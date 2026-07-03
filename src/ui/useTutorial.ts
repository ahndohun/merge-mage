import { useCallback, useEffect, useRef, useState } from "react"
import type { EngineState } from "../engine/types"
import {
  advanceTutorial,
  createTutorialState,
  isTutorialActive,
  isTutorialCompleted,
  markTutorialCompleted,
  shouldStartTutorial,
  type TutorialObservation,
  type TutorialState,
} from "./tutorial"

type UseTutorialResult = {
  readonly state: TutorialState
  readonly notifySummon: () => void
  readonly notifyMerge: () => void
  readonly skip: () => void
}

function countBooks(state: EngineState): number {
  return state.books.length + state.equipped.filter((book) => book !== null).length
}

function hasSameLevelPair(state: EngineState): boolean {
  const seen = new Set<number>()
  for (const book of state.books) {
    if (seen.has(book.level)) {
      return true
    }
    seen.add(book.level)
  }
  for (const book of state.equipped) {
    if (book === null) {
      continue
    }
    if (seen.has(book.level)) {
      return true
    }
    seen.add(book.level)
  }
  return false
}

type TutorialCallbacks = {
  /** Fired once when the player completes the final MERGE step (not on skip). */
  readonly onComplete?: () => void
}

/**
 * Drives the pure tutorial state machine from live game state. Summon and merge
 * are reported explicitly by GameShell (the engine has no such events), while
 * book counts and pairs are read from state each tick.
 */
export function useTutorial(state: EngineState, callbacks: TutorialCallbacks = {}): UseTutorialResult {
  const onCompleteRef = useRef(callbacks.onComplete)
  onCompleteRef.current = callbacks.onComplete
  const skippedRef = useRef(false)
  const completedFiredRef = useRef(false)
  // Whether the tutorial was ever active. A returning player who starts (and
  // stays) at "done" must never trigger the completion callback.
  const wasActiveRef = useRef(false)
  const [tutorial, setTutorial] = useState<TutorialState>(() => {
    if (shouldStartTutorial({ stage: state.stage, prestigeCount: state.prestigeCount, bookCount: countBooks(state) }, isTutorialCompleted())) {
      return createTutorialState()
    }
    return { step: "done" }
  })

  const summonCountRef = useRef(0)
  const mergeCountRef = useRef(0)
  const stepStartRef = useRef(Date.now())
  const stepRef = useRef(tutorial.step)

  if (tutorial.step !== "done") {
    wasActiveRef.current = true
  }

  const notifySummon = useCallback(() => {
    summonCountRef.current += 1
  }, [])

  const notifyMerge = useCallback(() => {
    mergeCountRef.current += 1
  }, [])

  const skip = useCallback(() => {
    skippedRef.current = true
    markTutorialCompleted()
    setTutorial({ step: "done" })
  }, [])

  // Persist completion when the machine reaches "done". Fire the completion
  // callback only for a natural finish (a real merge), never on skip.
  useEffect(() => {
    if (tutorial.step === "done") {
      markTutorialCompleted()
      if (wasActiveRef.current && !skippedRef.current && !completedFiredRef.current) {
        completedFiredRef.current = true
        onCompleteRef.current?.()
      }
    }
  }, [tutorial.step])

  // Reset the per-step timer whenever the step changes.
  useEffect(() => {
    if (stepRef.current !== tutorial.step) {
      stepRef.current = tutorial.step
      stepStartRef.current = Date.now()
    }
  }, [tutorial.step])

  // Poll the machine while active. rAF is overkill; 200ms is snappy enough.
  useEffect(() => {
    if (!isTutorialActive(tutorial)) {
      return
    }
    const tick = () => {
      const observation: TutorialObservation = {
        bookCount: countBooks(state),
        summonCount: summonCountRef.current,
        hasSameLevelPair: hasSameLevelPair(state),
        mergeCount: mergeCountRef.current,
        elapsedInStepMs: Date.now() - stepStartRef.current,
      }
      setTutorial((current) => advanceTutorial(current, observation))
    }
    tick()
    const id = window.setInterval(tick, 200)
    return () => {
      window.clearInterval(id)
    }
  }, [tutorial, state])

  return { state: tutorial, notifySummon, notifyMerge, skip }
}
