import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState, Spellbook } from "../engine/types"
import {
  bookElementSelector,
  canUpgradeSlotWhileSelected,
  DRAG_GHOST_OFFSET_Y,
  DRAG_THRESHOLD_PX,
  dropTargetTestId,
  getDragPreview,
  parseDropTargetFromTestId,
  pointerDragDistance,
  shouldActivateDrag,
  getEquipSlotClickDecision,
  type BookSource,
} from "./bookInteractions"

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

describe("drag helpers", () => {
  it("uses a -48px ghost offset and 8px activation threshold", () => {
    expect(DRAG_GHOST_OFFSET_Y).toBe(-48)
    expect(DRAG_THRESHOLD_PX).toBe(8)
    expect(shouldActivateDrag(7)).toBe(false)
    expect(shouldActivateDrag(8)).toBe(true)
    expect(pointerDragDistance(0, 0, 3, 4)).toBe(5)
  })

  it("parses inventory and equip drop targets from test ids", () => {
    expect(parseDropTargetFromTestId("merge-cell-3", null)).toEqual({
      kind: "inventory",
      index: 3,
      book: null,
    })
    expect(parseDropTargetFromTestId("equip-slot-1", book("x", 4, "fire"))).toEqual({
      kind: "equipped",
      index: 1,
      book: book("x", 4, "fire"),
    })
    expect(dropTargetTestId({ kind: "inventory", index: 2, book: null })).toBe("merge-cell-2")
  })

  it("highlights empty equip slots and mergeable occupied targets", () => {
    const state = {
      ...createInitialState(1),
      books: [book("a", 2, "fire"), book("b", 2, "frost")],
    } satisfies EngineState
    const source: BookSource = { kind: "inventory", bookId: "a" }

    expect(
      getDragPreview({
        state,
        source,
        target: { kind: "equipped", index: 0, book: null },
      }),
    ).toEqual({
      valid: true,
      mergeable: false,
      previewLevel: null,
      equipEmpty: true,
      targetTestId: "equip-slot-0",
    })

    expect(
      getDragPreview({
        state,
        source,
        target: { kind: "inventory", index: 1, book: book("b", 2, "frost") },
      }),
    ).toEqual({
      valid: true,
      mergeable: true,
      previewLevel: 3,
      equipEmpty: false,
      targetTestId: "merge-cell-1",
    })
  })

  it("rejects empty inventory cells as drop targets", () => {
    const state = createInitialState(1)
    const source: BookSource = { kind: "inventory", bookId: "missing" }

    expect(
      getDragPreview({
        state,
        source,
        target: { kind: "inventory", index: 0, book: null },
      }).valid,
    ).toBe(false)
  })
})
