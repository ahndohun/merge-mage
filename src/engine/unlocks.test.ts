import { describe, expect, it } from "vitest"
import { createInitialState } from "./state.js"
import type { EngineState } from "./types.js"
import { getUnlockedFeatures } from "./unlocks.js"

describe("getUnlockedFeatures", () => {
  it("keeps a fresh save on books only", () => {
    const unlocked = getUnlockedFeatures(createInitialState(1))

    expect(unlocked).toEqual({
      books: true,
      wizard: false,
      journey: false,
      rifts: false,
      rebirth: false,
      camp: false,
    })
  })

  it("unlocks features at their exact R1 thresholds", () => {
    const below = { ...createInitialState(1), wizardLevel: 2, highestStage: 4 } satisfies EngineState
    const journey = { ...below, highestStage: 5 } satisfies EngineState
    const rifts = { ...journey, highestStage: 7 } satisfies EngineState
    const rebirth = { ...rifts, highestStage: 10 } satisfies EngineState
    const wizard = { ...below, wizardLevel: 3 } satisfies EngineState
    const camp = { ...below, prestigeCount: 1 } satisfies EngineState

    expect(getUnlockedFeatures(below)).toEqual({
      books: true,
      wizard: false,
      journey: false,
      rifts: false,
      rebirth: false,
      camp: false,
    })
    expect(getUnlockedFeatures(wizard).wizard).toBe(true)
    expect(getUnlockedFeatures(journey).journey).toBe(true)
    expect(getUnlockedFeatures(rifts).rifts).toBe(true)
    expect(getUnlockedFeatures(rebirth).rebirth).toBe(true)
    expect(getUnlockedFeatures(camp).camp).toBe(true)
  })

  it("keeps rebirth unlocked after stage resets", () => {
    const state = {
      ...createInitialState(1),
      stage: 1,
      highestStage: 10,
      prestigeCount: 1,
    } satisfies EngineState

    expect(getUnlockedFeatures(state).rebirth).toBe(true)
    expect(getUnlockedFeatures(state).camp).toBe(true)
  })
})
