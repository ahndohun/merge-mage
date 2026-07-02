import { describe, expect, it } from "vitest"
import {
  allocateSkill,
  autoMergeBooks,
  equipBook,
  InsufficientGoldError,
  InventoryFullError,
  mergeBooks,
  prestige,
  refillEmptySlots,
  resetSkills,
  SlotIndexError,
  summonBook,
  swapBookPositions,
  unequipBook,
  upgradeSlot,
} from "./actions.js"
import { getSummonCost } from "./summon.js"
import type { Spellbook } from "./types.js"
import { createInitialState, type EngineState } from "./state.js"

function withBooks(state: EngineState, books: readonly Spellbook[]): EngineState {
  return { ...state, books, highestLevelEver: Math.max(state.highestLevelEver, ...books.map((book) => book.level)) }
}

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("summonBook", () => {
  it("auto-equips a deterministic book into the first empty slot and charges the summon floor cost", () => {
    const state = { ...createInitialState(12), gold: 100 }

    const next = summonBook(state)

    expect(next.equipped[0]?.level).toBe(1)
    expect(next.books).toHaveLength(0)
    expect(next.gold).toBeCloseTo(100 - getSummonCost(1))
    expect(state.books).toHaveLength(0)
  })

  it("adds summoned books to inventory when all equipment slots are full", () => {
    const state = {
      ...createInitialState(12),
      equipped: [
        book("slot-0", 1, "fire"),
        book("slot-1", 1, "frost"),
        book("slot-2", 1, "holy"),
        book("slot-3", 1, "fire"),
        book("slot-4", 1, "frost"),
        book("slot-5", 1, "holy"),
      ],
      gold: 100,
    } satisfies EngineState

    const next = summonBook(state)

    expect(next.books).toHaveLength(1)
    expect(next.equipped.map((item) => item?.id)).toEqual(state.equipped.map((item) => item?.id))
  })

  it("rejects a summon when the inventory is full", () => {
    const books = Array.from({ length: 15 }, (_, idx) => book(`b${idx}`, 1, "fire"))
    const state = {
      ...createInitialState(1),
      books,
      equipped: [
        book("slot-0", 1, "fire"),
        book("slot-1", 1, "frost"),
        book("slot-2", 1, "holy"),
        book("slot-3", 1, "fire"),
        book("slot-4", 1, "frost"),
        book("slot-5", 1, "holy"),
      ],
      gold: 1_000,
    } satisfies EngineState

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
    expect(merged.books[0]?.id).toBe("book-1")
    expect(merged.highestLevelEver).toBe(10)
    expect(afterSummon.equipped[0]?.level).toBe(2)
  })

  it("empties idB's equipped slot when merging an equipped book into inventory", () => {
    const state = {
      ...createInitialState(8),
      books: [book("a", 3, "fire")],
      equipped: [book("b", 3, "holy"), null, null, null, null, null],
      highestLevelEver: 3,
    } satisfies EngineState

    const merged = mergeBooks(state, "a", "b")

    expect(merged.books).toHaveLength(0)
    expect(merged.equipped[0]?.id).toBe("book-1")
  })

  it("keeps an equipped target slot occupied when the target id is passed first", () => {
    const state = {
      ...createInitialState(8),
      books: [book("inventory", 4, "fire")],
      equipped: [book("slot-target", 4, "holy"), null, null, null, null, null],
      highestLevelEver: 4,
    } satisfies EngineState

    const merged = mergeBooks(state, "slot-target", "inventory")

    expect(merged.equipped[0]?.id).toBe("book-1")
    expect(merged.books).toHaveLength(0)
  })

  it("accepts equipped books in either location and refills the emptied slot from inventory", () => {
    const state = {
      ...createInitialState(8),
      books: [book("backup", 5, "frost")],
      equipped: [book("left", 3, "fire"), book("right", 3, "holy"), null, null, null, null],
      highestLevelEver: 5,
    } satisfies EngineState

    const merged = mergeBooks(state, "left", "right")

    expect(merged.equipped[0]?.id).toBe("book-1")
    expect(merged.equipped[1]?.id).toBe("backup")
    expect(merged.books).toHaveLength(0)
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

  it("rejects unequipping an empty slot", () => {
    const equipped = book("equipped", 1, "holy")
    const full = Array.from({ length: 15 }, (_, idx) => book(`b${idx}`, 1, "fire"))
    const state = {
      ...createInitialState(1),
      books: full,
      equipped: [equipped, null, null, null, null, null],
    } satisfies EngineState

    expect(() => unequipBook(state, 1)).toThrow()
  })

  it("rejects invalid slot indices", () => {
    const state = createInitialState(1)

    expect(() => equipBook(state, "missing", 6)).toThrow(SlotIndexError)
  })

  it("swaps different-level equipped and inventory books by position", () => {
    const state = {
      ...createInitialState(1),
      books: [book("inventory", 7, "fire")],
      equipped: [book("equipped", 2, "frost"), null, null, null, null, null],
    } satisfies EngineState

    const next = swapBookPositions(state, "equipped", "inventory")

    expect(next.equipped[0]?.id).toBe("inventory")
    expect(next.books.map((item) => item.id)).toEqual(["equipped"])
  })

  it("swaps two equipped books by slot", () => {
    const state = {
      ...createInitialState(1),
      equipped: [book("left", 2, "fire"), book("right", 6, "holy"), null, null, null, null],
    } satisfies EngineState

    const next = swapBookPositions(state, "left", "right")

    expect(next.equipped[0]?.id).toBe("right")
    expect(next.equipped[1]?.id).toBe("left")
  })

  it("refills empty slots with the highest-level inventory books first", () => {
    const state = {
      ...createInitialState(1),
      books: [book("low", 2, "fire"), book("high", 8, "holy"), book("mid", 5, "frost")],
      equipped: [book("kept", 1, "fire"), null, null, null, null, null],
    } satisfies EngineState

    const next = refillEmptySlots(state)

    expect(next.equipped.map((item) => item?.id ?? null)).toEqual(["kept", "high", "mid", "low", null, null])
    expect(next.books).toHaveLength(0)
  })

  it("unequips into inventory and immediately refills the slot with the highest inventory book", () => {
    const state = {
      ...createInitialState(1),
      books: [book("low", 2, "fire"), book("high", 6, "holy")],
      equipped: [book("equipped", 3, "frost"), null, null, null, null, null],
    } satisfies EngineState

    const next = unequipBook(state, 0)

    expect(next.equipped[0]?.id).toBe("high")
    expect(next.books.map((item) => item.id)).toEqual(["low", "equipped"])
  })

  it("allows unequip at inventory capacity by refilling the opened slot first", () => {
    const books = Array.from({ length: 15 }, (_, idx) => book(`b${idx}`, idx + 1, "fire"))
    const state = {
      ...createInitialState(1),
      books,
      equipped: [book("equipped", 3, "holy"), null, null, null, null, null],
    } satisfies EngineState

    const next = unequipBook(state, 0)

    expect(next.equipped[0]?.id).toBe("b14")
    expect(next.books).toHaveLength(15)
    expect(next.books.some((item) => item.id === "equipped")).toBe(true)
  })
})

describe("autoMergeBooks", () => {
  it("merges equipped and inventory pairs from the highest level downward until no pair remains", () => {
    const state = {
      ...createInitialState(4),
      books: [book("inv-low", 2, "fire"), book("inv-high", 6, "frost")],
      equipped: [book("slot-high", 6, "holy"), book("slot-low", 2, "fire"), null, null, null, null],
      highestLevelEver: 6,
    } satisfies EngineState

    const next = autoMergeBooks(state)

    expect(next.equipped[0]?.id).toBe("book-1")
    expect(next.equipped[1]?.id).toBe("book-2")
    expect(next.highestLevelEver).toBe(7)
    expect(next.books).toHaveLength(0)
  })

  it("keeps chaining same-level results within one auto-merge tick", () => {
    const state = {
      ...createInitialState(4),
      books: [book("c", 3, "fire"), book("d", 3, "frost")],
      equipped: [book("a", 3, "holy"), book("b", 3, "fire"), null, null, null, null],
      highestLevelEver: 3,
    } satisfies EngineState

    const next = autoMergeBooks(state)

    expect(next.equipped[0]?.id).toBe("book-3")
    expect(next.equipped[0]?.level).toBe(5)
    expect(next.books).toHaveLength(0)
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
