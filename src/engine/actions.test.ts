import { describe, expect, it } from "vitest"
import {
  allocateSkill,
  equipBook,
  InsufficientGoldError,
  InventoryFullError,
  mergeBooks,
  prestige,
  resetSkills,
  SlotIndexError,
  summonBook,
  unequipBook,
  upgradeSlot,
} from "./actions"
import { getSummonCost } from "./summon"
import type { Spellbook } from "./types"
import { createInitialState, type EngineState } from "./state"

function withBooks(state: EngineState, books: readonly Spellbook[]): EngineState {
  return { ...state, books, highestLevelEver: Math.max(state.highestLevelEver, ...books.map((book) => book.level)) }
}

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("summonBook", () => {
  it("adds a deterministic book and charges the summon floor cost", () => {
    const state = { ...createInitialState(12), gold: 100 }

    const next = summonBook(state)

    expect(next.books).toHaveLength(1)
    expect(next.books[0]?.level).toBe(1)
    expect(next.gold).toBeCloseTo(100 - getSummonCost(1))
    expect(state.books).toHaveLength(0)
  })

  it("rejects a summon when the inventory is full", () => {
    const books = Array.from({ length: 15 }, (_, idx) => book(`b${idx}`, 1, "fire"))
    const state = { ...createInitialState(1), books, gold: 1_000 }

    expect(() => summonBook(state)).toThrow(InventoryFullError)
  })

  it("rejects a summon when gold is insufficient", () => {
    const state = { ...createInitialState(1), gold: 0 }

    expect(() => summonBook(state)).toThrow(InsufficientGoldError)
  })
})

describe("mergeBooks", () => {
  it("replaces idA in place, removes idB, and raises the summon floor", () => {
    const state = withBooks(createInitialState(5), [
      book("a", 9, "fire"),
      book("b", 9, "frost"),
    ])

    const merged = mergeBooks(state, "a", "b")
    const afterSummon = summonBook({ ...merged, gold: 1_000 })

    expect(merged.books).toHaveLength(1)
    expect(merged.books[0]?.id).toBe("a+b")
    expect(merged.highestLevelEver).toBe(10)
    expect(afterSummon.books.at(-1)?.level).toBe(2)
  })

  it("empties idB's equipped slot when merging an equipped book into inventory", () => {
    const state = {
      ...createInitialState(8),
      books: [book("a", 3, "fire")],
      equipped: [book("b", 3, "holy"), null, null, null, null, null],
      highestLevelEver: 3,
    } satisfies EngineState

    const merged = mergeBooks(state, "a", "b")

    expect(merged.books[0]?.id).toBe("a+b")
    expect(merged.equipped[0]).toBeNull()
  })

  it("rejects different levels", () => {
    const state = withBooks(createInitialState(3), [
      book("a", 2, "fire"),
      book("b", 3, "holy"),
    ])

    expect(() => mergeBooks(state, "a", "b")).toThrow()
  })
})

describe("equipment reducers", () => {
  it("equips from inventory with swap semantics for an occupied slot", () => {
    const state = {
      ...createInitialState(1),
      books: [book("a", 2, "fire")],
      equipped: [book("old", 1, "frost"), null, null, null, null, null],
    } satisfies EngineState

    const next = equipBook(state, "a", 0)

    expect(next.equipped[0]?.id).toBe("a")
    expect(next.books.map((item) => item.id)).toEqual(["old"])
  })

  it("unequips into inventory and rejects a full inventory", () => {
    const equipped = book("equipped", 1, "holy")
    const full = Array.from({ length: 15 }, (_, idx) => book(`b${idx}`, 1, "fire"))
    const state = {
      ...createInitialState(1),
      books: full,
      equipped: [equipped, null, null, null, null, null],
    } satisfies EngineState

    expect(() => unequipBook(state, 0)).toThrow(InventoryFullError)
  })

  it("rejects invalid slot indices", () => {
    const state = createInitialState(1)

    expect(() => equipBook(state, "missing", 6)).toThrow(SlotIndexError)
  })
})

describe("slot upgrades and skills", () => {
  it("upgrades the selected slot by charging the tier cost", () => {
    const state = { ...createInitialState(1), gold: 100 }

    const next = upgradeSlot(state, 2)

    expect(next.gold).toBe(50)
    expect(next.slotTiers[2]).toBe(1)
  })

  it("allocates and resets skill points", () => {
    const state = { ...createInitialState(1), skillPoints: 2 }

    const allocated = allocateSkill(allocateSkill(state, "castSpeed"), "goldGain")
    const reset = resetSkills(allocated)

    expect(allocated.skillPoints).toBe(0)
    expect(allocated.skills.castSpeed).toBe(1)
    expect(reset.skillPoints).toBe(2)
    expect(reset.skills.goldGain).toBe(0)
  })
})

describe("prestige", () => {
  it("grants mana crystals and resets run progress while keeping meta progress", () => {
    const state = {
      ...createInitialState(4),
      gold: 500,
      books: [book("a", 7, "fire")],
      equipped: [book("b", 6, "holy"), null, null, null, null, null],
      highestLevelEver: 7,
      stage: 16,
      wave: 8,
      wizardLevel: 4,
      skillPoints: 1,
      skills: { summonBonus: 1, castSpeed: 2, goldGain: 3, critChance: 4 },
      manaCrystals: 2,
    } satisfies EngineState

    const next = prestige(state)

    expect(next.manaCrystals).toBe(8)
    expect(next.prestigeCount).toBe(1)
    expect(next.gold).toBe(createInitialState(4).gold)
    expect(next.books).toEqual([])
    expect(next.equipped).toEqual([null, null, null, null, null, null])
    expect(next.stage).toBe(1)
    expect(next.wave).toBe(1)
    expect(next.highestLevelEver).toBe(1)
    expect(next.wizardLevel).toBe(4)
    expect(next.skills.castSpeed).toBe(2)
  })

  it("requires stage 10 or higher", () => {
    const state = { ...createInitialState(1), stage: 9 }

    expect(() => prestige(state)).toThrow()
  })
})
