import { describe, expect, it } from "vitest"
import { HP_BASE, HP_GROWTH } from "./constants.js"
import { createInitialState, getMobHp } from "./state.js"

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
    expect(state.quests).toEqual({ completed: [], claimed: [] })
    expect(state.achievements).toEqual({ counters: {}, claimed: [] })
    expect(state.codex).toEqual({ tiers: {} })
    expect(state.traits).toEqual({ picks: {} })
    expect(state.relics).toEqual({ owned: {}, equipped: [null, null, null] })
    expect(state.riftRuns).toEqual({ date: "", golden: 0, trial: 0 })
    expect(state.activeRift).toBeNull()
    expect(state.pet).toEqual({ level: 1, xp: 0, evolution: 0 })
    expect(state.mine).toEqual({ floor: 1, lastClaimAt: null })
    expect(state.dailyMissions).toEqual({ date: "", progress: {}, claimed: [] })
    expect(state.manaStone).toBe(0)
    expect(state.skins).toEqual({ owned: ["apprentice"], equipped: "apprentice" })
  })

  it("derives wave-one mob HP from the tuning constants", () => {
    // Derived, not pinned: balance tuning changes HP_GROWTH on purpose.
    expect(getMobHp(1)).toBeCloseTo(HP_BASE * HP_GROWTH)
  })
})
