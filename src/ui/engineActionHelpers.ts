import {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InsufficientManaCrystalsError,
  InventoryFullError,
  PrestigeRequirementError,
  PromotionError,
  RelicLevelCapError,
  RelicNotOwnedError,
  RelicSlotIndexError,
  RiftEntryError,
  SchoolRespecError,
  SlotIndexError,
} from "../engine/actions"
import { MergeLevelMismatchError } from "../engine/merge"
import type { EngineState, Spellbook } from "../engine/types"

export function mergeFirstInventoryPair(state: EngineState, mergeBooks: (leftId: string, rightId: string) => void): void {
  for (const left of state.books) {
    for (const right of state.books) {
      if (left.id !== right.id && left.level === right.level) {
        mergeBooks(left.id, right.id)
        return
      }
    }
  }
}

export function canMerge(state: EngineState, leftId: string, rightId: string): boolean {
  const left = findBook(state, leftId)
  const right = findBook(state, rightId)
  return left !== null && right !== null && left.id !== right.id && left.level === right.level
}

export function isExpectedEngineError(error: unknown): error is Error {
  return (
    error instanceof BookNotFoundError ||
    error instanceof EmptySlotError ||
    error instanceof InsufficientGoldError ||
    error instanceof InsufficientManaCrystalsError ||
    error instanceof InventoryFullError ||
    error instanceof MergeLevelMismatchError ||
    error instanceof PrestigeRequirementError ||
    error instanceof PromotionError ||
    error instanceof RelicLevelCapError ||
    error instanceof RelicNotOwnedError ||
    error instanceof RelicSlotIndexError ||
    error instanceof RiftEntryError ||
    error instanceof SchoolRespecError ||
    error instanceof SlotIndexError
  )
}

function findBook(state: EngineState, bookId: string): Spellbook | null {
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
