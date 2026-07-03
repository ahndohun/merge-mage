import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState, Spellbook } from "../engine/types"
import { bookElementSelector, canUpgradeSlotWhileSelected, getEquipSlotClickDecision, type BookSource } from "./bookInteractions"

const selectedBook: BookSource = { kind: "inventory", bookId: "book-1" }
const equippedBook: BookSource = { kind: "equipped", bookId: "book-2" }

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("book interaction decisions", () => {
  it("targets the selected book at an occupied equip slot", () => {
    const decision = getEquipSlotClickDecision({
      suppressedClick: false,
      selected: selectedBook,
      slotSource: equippedBook,
    })

    expect(decision).toEqual({ kind: "target-slot-book", source: selectedBook, target: equippedBook })
  })

  it("equips the selected book when an empty equip slot is tapped", () => {
    const decision = getEquipSlotClickDecision({
      suppressedClick: false,
      selected: selectedBook,
      slotSource: null,
    })

    expect(decision).toEqual({ kind: "equip-selected-book", source: selectedBook })
  })

  it("ignores slot upgrades while a book selection is active", () => {
    expect(canUpgradeSlotWhileSelected(selectedBook)).toBe(false)
    expect(canUpgradeSlotWhileSelected(null)).toBe(true)
  })
})

describe("bookElementSelector", () => {
  it("points at the equip slot when the book is equipped", () => {
    const state = {
      ...createInitialState(1),
      equipped: [null, null, book("e", 2, "fire"), null, null, null],
    } satisfies EngineState

    expect(bookElementSelector(state, "e")).toBe('[data-testid="equip-slot-2"]')
  })

  it("points at the merge cell when the book is in inventory", () => {
    const state = {
      ...createInitialState(1),
      books: [book("a", 1, "fire"), book("b", 1, "frost")],
    } satisfies EngineState

    expect(bookElementSelector(state, "b")).toBe('[data-testid="merge-cell-1"]')
  })

  it("returns null when the book is absent (e.g. consumed by a merge)", () => {
    expect(bookElementSelector(createInitialState(1), "gone")).toBeNull()
  })
})
