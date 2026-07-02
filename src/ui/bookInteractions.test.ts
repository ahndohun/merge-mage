import { describe, expect, it } from "vitest"
import { canUpgradeSlotWhileSelected, getEquipSlotClickDecision, type BookSource } from "./bookInteractions"

const selectedBook: BookSource = { kind: "inventory", bookId: "book-1" }
const equippedBook: BookSource = { kind: "equipped", bookId: "book-2" }

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
