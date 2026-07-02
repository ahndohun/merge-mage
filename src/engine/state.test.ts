import { describe, expect, it } from "vitest"
import { createInitialState } from "./state.js"

describe("createInitialState", () => {
  it("creates deterministic run state with inventory, equipment, and battle defaults", () => {
    const state = createInitialState(42)

    expect(state.books).toEqual([])
    expect(state.equipped).toEqual([null, null, null, null, null, null])
    expect(state.highestLevelEver).toBe(1)
    expect(state.stage).toBe(1)
    expect(state.wave).toBe(1)
    expect(state.stageHp).toBeGreaterThan(0)
    expect(state.skills).toEqual({ summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 })
    expect(state.slotTiers).toEqual([0, 0, 0, 0, 0, 0])
  })
})
