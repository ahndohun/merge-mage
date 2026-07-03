import { describe, expect, it } from "vitest"
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
    expect(result.state.enemiesHp).toHaveLength(5)
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
})
