import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState } from "../engine/types"
import { getMinimumSlotUpgradeCost, getRebirthPreviewCrystals, useBadges } from "./useBadges"

describe("useBadges", () => {
  it("flags books when gold covers the cheapest slot upgrade", () => {
    const state = {
      ...createInitialState(1),
      gold: getMinimumSlotUpgradeCost(createInitialState(1)),
    } satisfies EngineState

    expect(useBadges(state).books).toBe(true)
  })

  it("flags skills when skill points are available", () => {
    const state = {
      ...createInitialState(1),
      skillPoints: 2,
    } satisfies EngineState

    expect(useBadges(state).skills).toBe(true)
  })

  it("flags rebirth when preview crystals reach half of current holdings", () => {
    const state = {
      ...createInitialState(1),
      stage: 16,
      manaCrystals: 4,
    } satisfies EngineState

    expect(getRebirthPreviewCrystals(16)).toBeGreaterThanOrEqual(2)
    expect(useBadges(state).rebirth).toBe(true)
  })

  it("clears rebirth badge before stage 10", () => {
    const state = {
      ...createInitialState(1),
      stage: 9,
      manaCrystals: 0,
    } satisfies EngineState

    expect(useBadges(state).rebirth).toBe(false)
  })
})