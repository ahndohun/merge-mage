import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState } from "../engine/types"
import { getMinimumSlotUpgradeCost, getRebirthPreviewCrystals, useBadges } from "./useBadges"

describe("useBadges", () => {
  it("keeps the books tab dot clear even when a slot upgrade is affordable", () => {
    const state = {
      ...createInitialState(1),
      gold: getMinimumSlotUpgradeCost(createInitialState(1)),
    } satisfies EngineState

    expect(useBadges(state).books).toBe(false)
  })

  it("flags wizard when skill points are available", () => {
    const state = {
      ...createInitialState(1),
      skillPoints: 2,
      wizardLevel: 3,
    } satisfies EngineState

    expect(useBadges(state).wizard).toBe(true)
  })

  it("flags rebirth when preview crystals reach half of current holdings", () => {
    const state = {
      ...createInitialState(1),
      stage: 16,
      highestStage: 16,
      manaCrystals: 4,
    } satisfies EngineState

    expect(getRebirthPreviewCrystals(16)).toBeGreaterThanOrEqual(2)
    expect(useBadges(state).rebirth).toBe(true)
  })

  it("clears rebirth badge before stage 10", () => {
    const state = {
      ...createInitialState(1),
      stage: 9,
      highestStage: 9,
      manaCrystals: 0,
    } satisfies EngineState

    expect(useBadges(state).rebirth).toBe(false)
  })
})
