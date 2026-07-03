import type { EngineState } from "../engine/types"

export type BookSource = {
  readonly kind: "inventory" | "equipped"
  readonly bookId: string
}

/**
 * CSS selector for the slot/cell a book currently occupies, for anchoring
 * feedback (floating text, flash). Returns null when the book is no longer
 * present (e.g. queried after a merge consumed it).
 */
export function bookElementSelector(state: EngineState, bookId: string): string | null {
  const equippedIdx = state.equipped.findIndex((book) => book?.id === bookId)
  if (equippedIdx >= 0) {
    return `[data-testid="equip-slot-${equippedIdx}"]`
  }
  const inventoryIdx = state.books.findIndex((book) => book.id === bookId)
  if (inventoryIdx >= 0) {
    return `[data-testid="merge-cell-${inventoryIdx}"]`
  }
  return null
}

export type EquipSlotClickDecision =
  | { readonly kind: "consume-suppressed-click" }
  | { readonly kind: "select-slot-book"; readonly source: BookSource | null }
  | { readonly kind: "equip-selected-book"; readonly source: BookSource }
  | { readonly kind: "target-slot-book"; readonly source: BookSource; readonly target: BookSource }

export function getEquipSlotClickDecision(input: {
  readonly suppressedClick: boolean
  readonly selected: BookSource | null
  readonly slotSource: BookSource | null
}): EquipSlotClickDecision {
  if (input.suppressedClick) {
    return { kind: "consume-suppressed-click" }
  }

  if (input.selected === null) {
    return { kind: "select-slot-book", source: input.slotSource }
  }

  if (input.slotSource === null) {
    return { kind: "equip-selected-book", source: input.selected }
  }

  return { kind: "target-slot-book", source: input.selected, target: input.slotSource }
}

export function canUpgradeSlotWhileSelected(selected: BookSource | null): boolean {
  return selected === null
}
