// Pure first-run tutorial state machine. No React / DOM here — it takes an
// observation of the current game each tick and returns the next step. The
// overlay component (Tutorial.tsx) drives it and renders the spotlight.

export type TutorialStep = "summon" | "fight" | "merge" | "done"

export type TutorialState =
  | { readonly step: "summon" }
  | { readonly step: "fight"; readonly summonBaseline: number }
  | { readonly step: "merge"; readonly summonBaseline: number; readonly mergeBaseline: number }
  | { readonly step: "done" }

export type TutorialObservation = {
  /** Total books the player owns (inventory + equipped slots). */
  readonly bookCount: number
  /** Monotonic count of summons performed this run. */
  readonly summonCount: number
  /** True when two owned books share a level (a mergeable pair exists). */
  readonly hasSameLevelPair: boolean
  /** Monotonic count of successful merges performed this run. */
  readonly mergeCount: number
  /** Time spent on the current step, in ms. */
  readonly elapsedInStepMs: number
}

/** The FIGHT step auto-advances after this long if no second summon happens. */
export const FIGHT_STEP_TIMEOUT_MS = 6000

export type StartConditions = {
  readonly stage: number
  readonly prestigeCount: number
  readonly bookCount: number
}

/** Only a pristine save (stage 1, no prestige, no books, flag unset) starts the tutorial. */
export function shouldStartTutorial(conditions: StartConditions, completed: boolean): boolean {
  return (
    !completed &&
    conditions.stage === 1 &&
    conditions.prestigeCount === 0 &&
    conditions.bookCount === 0
  )
}

export function createTutorialState(): TutorialState {
  return { step: "summon" }
}

export function isTutorialActive(state: TutorialState): boolean {
  return state.step !== "done"
}

export function advanceTutorial(state: TutorialState, observation: TutorialObservation): TutorialState {
  switch (state.step) {
    case "summon": {
      // Arm the first spellbook: either a summon fired or the inventory grew.
      if (observation.summonCount >= 1 || observation.bookCount >= 1) {
        return { step: "fight", summonBaseline: Math.max(observation.summonCount, 1) }
      }
      return state
    }
    case "fight": {
      const summonedAgain = observation.summonCount > state.summonBaseline
      const timedOut = observation.elapsedInStepMs >= FIGHT_STEP_TIMEOUT_MS
      if (summonedAgain || timedOut) {
        return { step: "merge", summonBaseline: observation.summonCount, mergeBaseline: observation.mergeCount }
      }
      return state
    }
    case "merge": {
      if (observation.mergeCount > state.mergeBaseline) {
        return { step: "done" }
      }
      return state
    }
    case "done":
      return state
  }
}

export function tutorialStepTarget(state: TutorialState): string | null {
  switch (state.step) {
    case "summon":
      return '[data-testid="summon-btn"]'
    case "fight":
      return '[data-testid="tutorial-equip-target"]'
    case "merge":
      return '[data-testid="tutorial-books-target"]'
    case "done":
      return null
  }
}

export function tutorialStepCopy(state: TutorialState): string | null {
  switch (state.step) {
    case "summon":
      return "Tap SUMMON to arm your first spellbook"
    case "fight":
      return "Your books fight for you. Summon more!"
    case "merge":
      return "Tap one book, then another of the same level to MERGE — works in slots too"
    case "done":
      return null
  }
}

const TUTORIAL_DONE_KEY = "merge-mage:tutorial-done"

function tutorialStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null
  }
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function isTutorialCompleted(): boolean {
  return tutorialStorage()?.getItem(TUTORIAL_DONE_KEY) === "1"
}

export function markTutorialCompleted(): void {
  tutorialStorage()?.setItem(TUTORIAL_DONE_KEY, "1")
}

/** Clears the done flag so the tutorial can be replayed (HOW TO PLAY). */
export function clearTutorialCompleted(): void {
  tutorialStorage()?.removeItem(TUTORIAL_DONE_KEY)
}
