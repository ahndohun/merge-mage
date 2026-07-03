import { describe, expect, it } from "vitest"
import { claimQuestReward, mergeBooks, prestige, selectTrait, summonBook } from "./actions.js"
import { getAchievementProgress } from "./achievements.js"
import { bookDamage, simulateTicks } from "./battle.js"
import { getCodexBonusMultiplier, getCodexCellCount } from "./codex.js"
import { getResonance } from "./resonance.js"
import { createInitialState, type EngineState } from "./state.js"
import type { Spellbook } from "./types.js"

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("Wave D progression", () => {
  it("claims an exposed completed quest once and grants its reward", () => {
    const completed = summonBook({ ...createInitialState(1), gold: 1_000 })

    const claimed = claimQuestReward(completed, "chain-01")

    expect(claimed.quests.claimed).toContain("chain-01")
    expect(claimed.achievements.counters["questsClaimed"]).toBe(1)
    expect(claimed.gold).toBeGreaterThan(completed.gold)
    expect(() => claimQuestReward(claimed, "chain-01")).toThrow()
  })

  it("increments achievement counters from summons, merges, boss kills, and rebirths", () => {
    const summoned = summonBook({ ...createInitialState(3), gold: 1_000 })
    const merged = mergeBooks(
      {
        ...summoned,
        books: [book("a", 1, "fire")],
        equipped: [book("b", 1, "frost"), null, null, null, null, null],
      },
      "a",
      "b",
    )
    const battled = simulateTicks({
      ...merged,
      equipped: [book("holy", 30, "holy"), null, null, null, null, null],
      wave: 10,
      enemiesHp: [1],
      stageHp: 1,
    }, 20).state
    const reborn = prestige({ ...battled, stage: 12 })

    expect(reborn.achievements.counters["summonsTotal"]).toBe(1)
    expect(reborn.achievements.counters["mergesTotal"]).toBe(1)
    expect(reborn.achievements.counters["bossKills"]).toBe(1)
    expect(reborn.achievements.counters["rebirths"]).toBe(1)
    expect(getAchievementProgress(reborn, "bossKills")).toBe(1)
  })

  it("records codex tiers from summoned and merged tomes and counts the grid cells", () => {
    const state = mergeBooks(
      {
        ...createInitialState(5),
        books: [book("a", 19, "fire"), book("b", 19, "fire")],
        highestLevelEver: 19,
      },
      "a",
      "b",
    )

    expect(state.codex.tiers["fire"]).toBe(2)
    expect(getCodexCellCount(state)).toBe(2)
    expect(getCodexBonusMultiplier(state, "fire")).toBeCloseTo(1.06)
  })

  it("adds codex and resonance damage modifiers to elemental battle output", () => {
    const base = {
      ...createInitialState(7),
      equipped: [
        book("a", 20, "fire"),
        book("b", 10, "fire"),
        book("c", 10, "fire"),
        null,
        null,
        null,
      ],
      codex: { tiers: { fire: 2 } },
    } satisfies EngineState

    const damage = bookDamage(book("cast", 10, "fire"), 0, base)
    const plain = bookDamage(book("cast", 10, "fire"), 0, { ...base, equipped: [book("x", 10, "frost"), null, null, null, null, null], codex: { tiers: {} } })

    expect(damage.damage).toBeGreaterThan(plain.damage * 1.05)
    expect(getResonance(base).fire.targetCap).toBe(4)
  })

  it("selects unlocked traits, applies elemental-cycle resonance, and allows one post-rebirth respec", () => {
    const picked = selectTrait({ ...createInitialState(9), wizardLevel: 8 }, "lv8", "elementalCycle")
    const resonant = {
      ...picked,
      equipped: [book("a", 1, "holy"), book("b", 1, "holy"), null, null, null, null],
    } satisfies EngineState
    const reborn = prestige({ ...picked, stage: 12 })
    const respecced = selectTrait(reborn, "lv8", "goldenLibrary")

    expect(getResonance(resonant).holy.active).toBe(true)
    expect(respecced.traits.picks["lv8"]).toBe("goldenLibrary")
    expect(() => selectTrait(respecced, "lv8", "chainCast")).toThrow()
  })
})
