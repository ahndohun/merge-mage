import { describe, expect, it } from "vitest"
import { enterRift } from "./actions.js"
import { getBossFactor, getBossHp, getPrestigeCrystalReward } from "./balance.js"
import { bookDamage, simulateTicks } from "./battle.js"
import { createInitialState, type EngineState } from "./state.js"
import type { Spellbook } from "./types.js"

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("battle ticks", () => {
  it("rolls critical hits deterministically from the state seed", () => {
    const spellbook = book("crit", 2, "fire")
    const state = {
      ...createInitialState(99),
      skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 95 },
    } satisfies EngineState

    const first = bookDamage(spellbook, 0, state)
    const second = bookDamage(spellbook, 0, state)

    expect(first.damage).toBe(second.damage)
    expect(first.critical).toBe(true)
  })

  it("emits a boss fail and retreats to wave one after the enrage timer", () => {
    const state = {
      ...createInitialState(2),
      wave: 10,
      enemiesHp: [1_000_000],
      stageHp: 1_000_000,
      bossElapsedMs: 0,
    } satisfies EngineState

    const result = simulateTicks(state, 300)

    expect(result.events.some((event) => event.type === "bossFail")).toBe(true)
    expect(result.state.wave).toBe(1)
    expect(result.state.stage).toBe(1)
    expect(result.state.enemiesHp).toHaveLength(6)
    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "bossFail",
        requiredDps: expect.any(Number),
        currentDps: expect.any(Number),
      }),
    )
  })

  it("clears waves, grants gold, and records a recent gold rate", () => {
    const state = {
      ...createInitialState(7),
      equipped: [book("a", 10, "holy"), null, null, null, null, null],
      enemiesHp: [1],
      stageHp: 1,
    } satisfies EngineState

    const result = simulateTicks(state, 10)

    expect(result.events.some((event) => event.type === "kill")).toBe(true)
    expect(result.state.gold).toBeGreaterThan(state.gold)
    expect(result.state.recentGoldPerSecond).toBeGreaterThan(0)
  })

  it("kills a wave-one mob and grants gold from the innate staff bolt when nothing is equipped", () => {
    const state = createInitialState(21)

    const result = simulateTicks(state, 60)

    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "cast",
        element: "arcane",
        critical: false,
        targetsHit: 1,
      }),
    )
    expect(result.events.some((event) => event.type === "kill")).toBe(true)
    expect(result.state.gold).toBeGreaterThan(state.gold)
  })

  it("includes the actual target index on cast events", () => {
    const state = {
      ...createInitialState(11),
      equipped: [book("splash", 8, "fire"), null, null, null, null, null],
      enemiesHp: [500, 500, 500, 500, 500],
      stageHp: 2_500,
    } satisfies EngineState

    const result = simulateTicks(state, 10)
    const castEvent = result.events.find((event) => event.type === "cast")

    expect(castEvent).toEqual(
      expect.objectContaining({
        type: "cast",
        bookId: "splash",
        targetIndex: 0,
        targetsHit: 3,
      }),
    )
  })

  it("applies equipped relic damage, frost duration, and crit damage contracts", () => {
    const spellbook = book("crit-fire", 2, "fire")
    const state = {
      ...createInitialState(99),
      skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 95 },
      relics: {
        owned: { emberSigil: 2, abyssalEye: 3, frostLens: 1 },
        equipped: ["emberSigil", "abyssalEye", "frostLens"],
      },
    } satisfies EngineState

    const base = bookDamage(spellbook, 0, { ...state, relics: { owned: {}, equipped: [null, null, null] } })
    const boosted = bookDamage(spellbook, 0, state)
    const frost = simulateTicks(
      {
        ...state,
        equipped: [book("frost", 20, "frost"), null, null, null, null, null],
        enemiesHp: [10_000],
        stageHp: 10_000,
      },
      10,
    )

    expect(boosted.damage).toBeGreaterThan(base.damage * 1.3)
    expect(frost.events).toContainEqual(expect.objectContaining({ type: "slow", durationMs: 2_200 }))
  })

  it("doubles all tome damage at highest-book milestones", () => {
    const spellbook = book("milestone", 10, "fire")
    const base = { ...createInitialState(5), highestLevelEver: 9 } satisfies EngineState
    const milestone = { ...base, highestLevelEver: 10 } satisfies EngineState

    const before = bookDamage(spellbook, 0, base)
    const after = bookDamage(spellbook, 0, milestone)

    expect(after.damage).toBeCloseTo(before.damage * 2)
  })

  it("applies wizard level 10, 20, and 30 permanent battle bonuses", () => {
    const spellbook = book("wizard-bonus", 10, "fire")
    const base = {
      ...createInitialState(19),
      equipped: [spellbook, null, null, null, null, null],
      enemiesHp: [10_000],
      stageHp: 10_000,
    } satisfies EngineState
    const crit = { ...base, wizardLevel: 20 } satisfies EngineState
    const fast = { ...base, wizardLevel: 10 } satisfies EngineState
    const gold = { ...base, wizardLevel: 30, stage: 20, enemiesHp: [1], stageHp: 1 } satisfies EngineState
    const baseGold = { ...base, stage: 20, enemiesHp: [1], stageHp: 1 } satisfies EngineState

    const baseRoll = bookDamage(spellbook, 0, base)
    const critRoll = bookDamage(spellbook, 0, crit)
    const baseCasts = simulateTicks(base, 29).events.filter((event) => event.type === "cast")
    const fastCasts = simulateTicks(fast, 29).events.filter((event) => event.type === "cast")
    const baseGoldResult = simulateTicks(baseGold, 10)
    const goldResult = simulateTicks(gold, 10)

    expect(baseRoll.critical).toBe(false)
    expect(critRoll.critical).toBe(true)
    expect(critRoll.damage).toBeGreaterThan(baseRoll.damage)
    expect(fastCasts.length).toBeGreaterThan(baseCasts.length)
    expect(goldResult.state.gold - gold.gold).toBeGreaterThan(baseGoldResult.state.gold - baseGold.gold)
  })

  it("uses expected DPS boss factors and the Wave C rebirth crystal curve", () => {
    expect(getBossFactor(4)).toBe(1)
    expect(getBossFactor(5)).toBe(1.5)
    expect(getBossFactor(10)).toBe(2.2)
    expect(getBossHp(10)).toBeGreaterThan(getBossHp(9))
    expect(getPrestigeCrystalReward(13, 1)).toBe(2)
    expect(getPrestigeCrystalReward(14, 1)).toBe(3)
  })

  it("keeps golden rift kills on the home stage and multiplies gold rewards", () => {
    const state = {
      ...createInitialState(4),
      stage: 20,
      wave: 4,
      equipped: [book("holy", 30, "holy"), null, null, null, null, null],
      enemiesHp: [1],
      stageHp: 1,
    } satisfies EngineState
    const active = { ...enterRift(state, "golden", "2026-07-03"), enemiesHp: [1], stageHp: 1 }

    const normal = simulateTicks(state, 10)
    const rift = simulateTicks(active, 10)

    expect(rift.state.stage).toBe(20)
    expect(rift.state.gold - active.gold).toBeGreaterThan((normal.state.gold - state.gold) * 2)
  })
})
