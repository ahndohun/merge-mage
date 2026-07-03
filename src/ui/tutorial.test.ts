import { describe, expect, it } from "vitest"
import {
  advanceTutorial,
  createTutorialState,
  isTutorialActive,
  shouldStartTutorial,
  tutorialStepCopy,
  tutorialStepTarget,
  type TutorialObservation,
  type TutorialState,
} from "./tutorial"

const baseObservation: TutorialObservation = {
  bookCount: 0,
  summonCount: 0,
  hasSameLevelPair: false,
  mergeCount: 0,
  elapsedInStepMs: 0,
}

function obs(overrides: Partial<TutorialObservation>): TutorialObservation {
  return { ...baseObservation, ...overrides }
}

describe("shouldStartTutorial", () => {
  it("starts on a brand-new save with no completion flag", () => {
    expect(shouldStartTutorial({ stage: 1, prestigeCount: 0, bookCount: 0 }, false)).toBe(true)
  })

  it("does not start when the completion flag is set", () => {
    expect(shouldStartTutorial({ stage: 1, prestigeCount: 0, bookCount: 0 }, true)).toBe(false)
  })

  it("does not start on an in-progress save (stage advanced)", () => {
    expect(shouldStartTutorial({ stage: 3, prestigeCount: 0, bookCount: 0 }, false)).toBe(false)
  })

  it("does not start after a prestige", () => {
    expect(shouldStartTutorial({ stage: 1, prestigeCount: 1, bookCount: 0 }, false)).toBe(false)
  })

  it("does not start when the player already owns books", () => {
    expect(shouldStartTutorial({ stage: 1, prestigeCount: 0, bookCount: 2 }, false)).toBe(false)
  })
})

describe("createTutorialState", () => {
  it("begins on the summon step", () => {
    expect(createTutorialState().step).toBe("summon")
  })
})

describe("advanceTutorial — SUMMON step", () => {
  it("stays on summon until the first summon happens", () => {
    const state = createTutorialState()
    const next = advanceTutorial(state, obs({ summonCount: 0, bookCount: 0 }))
    expect(next.step).toBe("summon")
  })

  it("advances to fight once a book has been summoned", () => {
    const state = createTutorialState()
    const next = advanceTutorial(state, obs({ summonCount: 1, bookCount: 1 }))
    expect(next.step).toBe("fight")
  })

  it("advances when inventory grows even if summonCount is unknown", () => {
    const state = createTutorialState()
    const next = advanceTutorial(state, obs({ summonCount: 0, bookCount: 1 }))
    expect(next.step).toBe("fight")
  })
})

describe("advanceTutorial — FIGHT step", () => {
  const fightState: TutorialState = { step: "fight", summonBaseline: 1 }

  it("stays on fight before the second summon and before the timeout", () => {
    const next = advanceTutorial(fightState, obs({ summonCount: 1, elapsedInStepMs: 2000 }))
    expect(next.step).toBe("fight")
  })

  it("advances to merge on the second summon", () => {
    const next = advanceTutorial(fightState, obs({ summonCount: 2, elapsedInStepMs: 100 }))
    expect(next.step).toBe("merge")
  })

  it("advances to merge after the 6s timeout even without a second summon", () => {
    const next = advanceTutorial(fightState, obs({ summonCount: 1, elapsedInStepMs: 6000 }))
    expect(next.step).toBe("merge")
  })
})

describe("advanceTutorial — MERGE step", () => {
  const mergeState: TutorialState = { step: "merge", summonBaseline: 1, mergeBaseline: 0 }

  it("stays on merge until a merge actually happens", () => {
    const next = advanceTutorial(mergeState, obs({ hasSameLevelPair: true, mergeCount: 0 }))
    expect(next.step).toBe("merge")
  })

  it("completes once a merge occurs", () => {
    const next = advanceTutorial(mergeState, obs({ hasSameLevelPair: false, mergeCount: 1 }))
    expect(next.step).toBe("done")
  })
})

describe("advanceTutorial — DONE step", () => {
  it("is a terminal state", () => {
    const done: TutorialState = { step: "done" }
    expect(advanceTutorial(done, obs({ mergeCount: 5 })).step).toBe("done")
  })
})

describe("isTutorialActive", () => {
  it("is active for summon, fight, and merge", () => {
    expect(isTutorialActive({ step: "summon" })).toBe(true)
    expect(isTutorialActive({ step: "fight", summonBaseline: 1 })).toBe(true)
    expect(isTutorialActive({ step: "merge", summonBaseline: 1, mergeBaseline: 0 })).toBe(true)
  })

  it("is inactive once done", () => {
    expect(isTutorialActive({ step: "done" })).toBe(false)
  })
})

describe("tutorialStepTarget", () => {
  it("points at the summon button on the summon step", () => {
    expect(tutorialStepTarget({ step: "summon" })).toBe('[data-testid="summon-btn"]')
  })

  it("points at the equipped row on the fight step", () => {
    expect(tutorialStepTarget({ step: "fight", summonBaseline: 1 })).toBe('[data-testid="tutorial-equip-target"]')
  })

  it("points at the books area on the merge step", () => {
    expect(tutorialStepTarget({ step: "merge", summonBaseline: 1, mergeBaseline: 0 })).toBe(
      '[data-testid="tutorial-books-target"]',
    )
  })

  it("has no target once done", () => {
    expect(tutorialStepTarget({ step: "done" })).toBeNull()
  })
})

describe("tutorialStepCopy", () => {
  it("gives each active step instruction copy", () => {
    expect(tutorialStepCopy({ step: "summon" })).toContain("SUMMON")
    expect(tutorialStepCopy({ step: "fight", summonBaseline: 1 })).toContain("fight")
    expect(tutorialStepCopy({ step: "merge", summonBaseline: 1, mergeBaseline: 0 })).toContain("MERGE")
  })

  it("reflects that merges work in slots too", () => {
    expect((tutorialStepCopy({ step: "merge", summonBaseline: 1, mergeBaseline: 0 }) ?? "").toLowerCase()).toContain("same level")
  })

  it("returns null when done", () => {
    expect(tutorialStepCopy({ step: "done" })).toBeNull()
  })
})
