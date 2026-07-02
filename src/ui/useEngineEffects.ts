import { useEffect, type Dispatch, type SetStateAction } from "react"
import { simulateTicks } from "../engine/battle"
import { TICK_MS } from "../engine/constants"
import type { EngineEvent, EngineState } from "../engine/types"
import { postOfflineClaim, postSave, type OfflineClaim } from "./apiClient"
import { advanceFixedStepDriver } from "./engineDriver"
import { mergeFirstInventoryPair } from "./engineActionHelpers"
import { saveLocalState, type SaveToken } from "./engineStorage"
import type { ToastMessage } from "./useToasts"

type MutableRef<T> = {
  current: T
}

type CommitState = (state: EngineState, events: readonly EngineEvent[]) => void

const SAVE_INTERVAL_MS = 5_000
const AUTO_INTERVAL_MS = 1_000

const offlineClaimsAttempted = new Set<string>()

export function useEngineClock(input: {
  readonly stateRef: MutableRef<EngineState>
  readonly accumulatorRef: MutableRef<number>
  readonly lastFrameRef: MutableRef<number | null>
  readonly rafRef: MutableRef<number | null>
  readonly commitState: CommitState
}): void {
  useEffect(() => {
    const frame = (timestamp: number) => {
      if (document.hidden) {
        input.lastFrameRef.current = null
        input.rafRef.current = window.requestAnimationFrame(frame)
        return
      }

      const lastFrame = input.lastFrameRef.current
      input.lastFrameRef.current = timestamp
      if (lastFrame !== null) {
        const advanced = advanceFixedStepDriver({
          state: input.stateRef.current,
          accumulatorMs: input.accumulatorRef.current,
          elapsedMs: timestamp - lastFrame,
          stepMs: TICK_MS,
          simulate: simulateTicks,
        })
        input.accumulatorRef.current = advanced.accumulatorMs
        if (advanced.ticks > 0) {
          input.commitState(advanced.state, advanced.events)
        }
      }

      input.rafRef.current = window.requestAnimationFrame(frame)
    }

    input.rafRef.current = window.requestAnimationFrame(frame)
    return () => {
      if (input.rafRef.current !== null) {
        window.cancelAnimationFrame(input.rafRef.current)
      }
    }
  }, [input.accumulatorRef, input.commitState, input.lastFrameRef, input.rafRef, input.stateRef])
}

export function useVisibilityPause(lastFrameRef: MutableRef<number | null>): void {
  useEffect(() => {
    const clearFrame = () => {
      if (document.hidden) {
        lastFrameRef.current = null
      }
    }

    document.addEventListener("visibilitychange", clearFrame)
    return () => document.removeEventListener("visibilitychange", clearFrame)
  }, [lastFrameRef])
}

export function useAutoEngineActions(input: {
  readonly autoBuyRef: MutableRef<boolean>
  readonly autoMergeRef: MutableRef<boolean>
  readonly stateRef: MutableRef<EngineState>
  readonly summon: () => void
  readonly mergeBooks: (leftId: string, rightId: string) => void
}): void {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (input.autoBuyRef.current) {
        input.summon()
      }
      if (input.autoMergeRef.current) {
        mergeFirstInventoryPair(input.stateRef.current, input.mergeBooks)
      }
    }, AUTO_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [input.autoBuyRef, input.autoMergeRef, input.mergeBooks, input.stateRef, input.summon])
}

export function useSaveCadence(input: {
  readonly stateRef: MutableRef<EngineState>
  readonly saveTokenRef: MutableRef<SaveToken>
  readonly nicknameRef: MutableRef<string>
  readonly saveIssueRef: MutableRef<string | null>
  readonly saveFailureCountRef: MutableRef<number>
  readonly addToast: (text: string, kind: ToastMessage["kind"]) => void
  readonly onCloudSaveOk: () => void
  readonly onCloudSaveOffline: () => void
}): void {
  useEffect(() => {
    const save = () => {
      saveLocalState(input.stateRef.current)
      void postSave({
        token: input.saveTokenRef.current.token,
        nickname: input.nicknameRef.current,
        state: input.stateRef.current,
      }).then((result) => {
        if (result.kind === "ok") {
          input.saveIssueRef.current = null
          input.saveFailureCountRef.current = 0
          input.onCloudSaveOk()
          return
        }

        if (import.meta.env.DEV) {
          input.saveIssueRef.current = null
          input.saveFailureCountRef.current = 0
          return
        }

        input.saveFailureCountRef.current += 1
        if (input.saveFailureCountRef.current < 3) {
          return
        }

        input.onCloudSaveOffline()
        const message = result.kind === "unavailable" ? "Cloud save unavailable; local save active." : `Save failed: ${result.message}`
        if (input.saveIssueRef.current !== message) {
          input.saveIssueRef.current = message
          input.addToast(message, "error")
        }
      })
    }

    const intervalId = window.setInterval(save, SAVE_INTERVAL_MS)
    window.addEventListener("pagehide", save)
    window.addEventListener("beforeunload", save)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("pagehide", save)
      window.removeEventListener("beforeunload", save)
    }
  }, [
    input.addToast,
    input.nicknameRef,
    input.onCloudSaveOffline,
    input.onCloudSaveOk,
    input.saveFailureCountRef,
    input.saveIssueRef,
    input.saveTokenRef,
    input.stateRef,
  ])
}

export function useOfflineClaim(input: {
  readonly saveTokenRef: MutableRef<SaveToken>
  readonly stateRef: MutableRef<EngineState>
  readonly commitState: CommitState
  readonly setOfflineClaim: Dispatch<SetStateAction<OfflineClaim | null>>
}): void {
  useEffect(() => {
    const token = input.saveTokenRef.current
    if (!token.existed || offlineClaimsAttempted.has(token.token)) {
      return
    }

    offlineClaimsAttempted.add(token.token)
    void postOfflineClaim(token.token).then((result) => {
      if (result.kind !== "ok" || result.data === null) {
        return
      }

      const claim = result.data
      input.setOfflineClaim(claim)
      input.commitState({ ...input.stateRef.current, gold: input.stateRef.current.gold + claim.gold }, [])
    })
  }, [input.commitState, input.saveTokenRef, input.setOfflineClaim, input.stateRef])
}
