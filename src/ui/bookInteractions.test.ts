import { describe, expect, it } from "vitest"
import { canUpgradeSlotWhileSelected, getEquipSlotClickDecision, type BookSource } from "./bookInteractions"

const selectedBook: BookSource = { kind: "inventory", bookId: "book-1" }
const equippedBook: BookSource = { kind: "equipped", bookId: "book-2" }

describe("book interaction decisions", () => {
  it("equips the selected book when an equip slot is tapped", () => {
    const decision = getEquipSlotClickDecision({
      suppressedClick: false,
      selected: selectedBook,
      slotSource: equippedBook,
    })

    expect(decision).toEqual({ kind: "equip-selected-book", source: selectedBook })
  })

  it("ignores slot upgrades while a book selection is active", () => {
    expect(canUpgradeSlotWhileSelected(selectedBook)).toBe(false)
    expect(canUpgradeSlotWhileSelected(null)).toBe(true)
  })
})
