import { canMerge } from "./engineActionHelpers"
import type { EngineState, Spellbook } from "../engine/types"

export const DRAG_THRESHOLD_PX = 8
export const DRAG_GHOST_OFFSET_Y = -48

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

export type DropTarget =
  | { readonly kind: "inventory"; readonly index: number; readonly book: Spellbook | null }
  | { readonly kind: "equipped"; readonly index: number; readonly book: Spellbook | null }

export type DragPreview = {
  readonly valid: boolean
  readonly mergeable: boolean
  readonly previewLevel: number | null
  readonly equipEmpty: boolean
  readonly targetTestId: string | null
}

export function findBookInState(state: EngineState, bookId: string): Spellbook | null {
  const inventoryBook = state.books.find((book) => book.id === bookId)
  if (inventoryBook !== undefined) {
    return inventoryBook
  }

  for (const book of state.equipped) {
    if (book?.id === bookId) {
      return book
    }
  }

  return null
}

export function dropTargetTestId(target: DropTarget): string {
  return target.kind === "inventory" ? `merge-cell-${target.index}` : `equip-slot-${target.index}`
}

export function parseDropTargetFromTestId(testId: string, book: Spellbook | null): DropTarget | null {
  const inventoryMatch = /^merge-cell-(\d+)$/.exec(testId)
  if (inventoryMatch !== null) {
    return { kind: "inventory", index: Number(inventoryMatch[1]), book }
  }

  const equipMatch = /^equip-slot-(\d+)$/.exec(testId)
  if (equipMatch !== null) {
    return { kind: "equipped", index: Number(equipMatch[1]), book }
  }

  return null
}

export function resolveDropTargetFromElement(element: Element | null): DropTarget | null {
  if (element === null) {
    return null
  }

  const slot = element.closest("[data-testid]")
  if (slot === null) {
    return null
  }

  const testId = slot.getAttribute("data-testid")
  if (testId === null) {
    return null
  }

  const bookId = slot.getAttribute("data-book-id")
  const bookLevel = slot.getAttribute("data-book-level")
  const bookElement = slot.getAttribute("data-book-element")
  const book =
    bookId !== null &&
    bookLevel !== null &&
    bookElement !== null &&
    isSpellbookElement(bookElement)
      ? ({
          id: bookId,
          level: Number(bookLevel),
          element: bookElement,
        } satisfies Spellbook)
      : null

  return parseDropTargetFromTestId(testId, book)
}

export function dropTargetToBookSource(target: DropTarget): BookSource | null {
  if (target.book === null) {
    return null
  }

  return { kind: target.kind === "inventory" ? "inventory" : "equipped", bookId: target.book.id }
}

export function getDragPreview(input: {
  readonly state: EngineState
  readonly source: BookSource
  readonly target: DropTarget | null
}): DragPreview {
  if (input.target === null) {
    return { valid: false, mergeable: false, previewLevel: null, equipEmpty: false, targetTestId: null }
  }

  const targetTestId = dropTargetTestId(input.target)
  const sourceBook = findBookInState(input.state, input.source.bookId)
  if (sourceBook === null) {
    return { valid: false, mergeable: false, previewLevel: null, equipEmpty: false, targetTestId }
  }

  if (input.target.book === null) {
    if (input.target.kind === "equipped") {
      return {
        valid: true,
        mergeable: false,
        previewLevel: null,
        equipEmpty: true,
        targetTestId,
      }
    }

    return { valid: false, mergeable: false, previewLevel: null, equipEmpty: false, targetTestId }
  }

  const targetSource = dropTargetToBookSource(input.target)
  if (targetSource === null || targetSource.bookId === input.source.bookId) {
    return { valid: false, mergeable: false, previewLevel: null, equipEmpty: false, targetTestId }
  }

  const mergeable = canMerge(input.state, targetSource.bookId, input.source.bookId)
  return {
    valid: true,
    mergeable,
    previewLevel: mergeable ? input.target.book.level + 1 : null,
    equipEmpty: false,
    targetTestId,
  }
}

function isSpellbookElement(value: string): value is Spellbook["element"] {
  return value === "fire" || value === "frost" || value === "holy"
}

export function pointerDragDistance(startX: number, startY: number, currentX: number, currentY: number): number {
  const dx = currentX - startX
  const dy = currentY - startY
  return Math.hypot(dx, dy)
}

export function shouldActivateDrag(distance: number): boolean {
  return distance >= DRAG_THRESHOLD_PX
}
