import { SLOT_INDEXES } from "./constants.js"
import { BookNotFoundError, SlotIndexError } from "./errors.js"
import { setEquippedSlot } from "./state.js"
import type { EngineState, SlotIndex, Spellbook } from "./types.js"

export type BookLocation =
  | { readonly kind: "inventory"; readonly index: number; readonly book: Spellbook }
  | { readonly kind: "equipped"; readonly slot: SlotIndex; readonly book: Spellbook }

export type MergePair = {
  readonly targetId: string
  readonly consumedId: string
}

export function findBookLocation(state: EngineState, bookId: string): BookLocation {
  for (let index = 0; index < state.books.length; index += 1) {
    const book = state.books[index]
    if (book?.id === bookId) {
      return { kind: "inventory", index, book }
    }
  }

  for (const slot of SLOT_INDEXES) {
    const book = state.equipped[slot]
    if (book?.id === bookId) {
      return { kind: "equipped", slot, book }
    }
  }

  throw new BookNotFoundError(bookId)
}

export function toSlotIndex(slotIdx: number): SlotIndex {
  switch (slotIdx) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 4
    case 5:
      return 5
    default:
      throw new SlotIndexError(slotIdx)
  }
}

export function refillEmptySlotsFromInventory(state: EngineState): EngineState {
  return refillSlotsFromInventory(state, SLOT_INDEXES)
}

export function refillSlotsFromInventory(state: EngineState, slots: readonly SlotIndex[]): EngineState {
  if (state.books.length === 0 || state.equipped.every((book) => book !== null)) {
    return state
  }

  let books = [...state.books]
  let equipped = state.equipped

  for (const slot of slots) {
    if (equipped[slot] !== null) {
      continue
    }

    const candidateIndex = findHighestBookIndex(books)
    if (candidateIndex === null) {
      return { ...state, books, equipped }
    }

    const candidate = books[candidateIndex]
    if (candidate === undefined) {
      return { ...state, books, equipped }
    }

    books = books.filter((_, index) => index !== candidateIndex)
    equipped = setEquippedSlot(equipped, slot, candidate)
  }

  return { ...state, books, equipped }
}

export function swapBookLocations(state: EngineState, idA: string, idB: string): EngineState {
  const left = findBookLocation(state, idA)
  const right = findBookLocation(state, idB)

  if (left.kind === "inventory" && right.kind === "inventory") {
    const books = [...state.books]
    books[left.index] = right.book
    books[right.index] = left.book
    return { ...state, books }
  }

  if (left.kind === "equipped" && right.kind === "equipped") {
    return {
      ...state,
      equipped: setEquippedSlot(setEquippedSlot(state.equipped, left.slot, right.book), right.slot, left.book),
    }
  }

  if (left.kind === "inventory" && right.kind === "equipped") {
    const books = [...state.books]
    books[left.index] = right.book
    return { ...state, books, equipped: setEquippedSlot(state.equipped, right.slot, left.book) }
  }

  if (left.kind === "equipped" && right.kind === "inventory") {
    const books = [...state.books]
    books[right.index] = left.book
    return { ...state, books, equipped: setEquippedSlot(state.equipped, left.slot, right.book) }
  }

  return state
}

export function findHighestLevelMergePair(state: EngineState): MergePair | null {
  const locations = collectBookLocations(state)
  let best: { readonly target: BookLocation; readonly consumed: BookLocation } | null = null

  for (let leftIndex = 0; leftIndex < locations.length; leftIndex += 1) {
    const target = locations[leftIndex]
    if (target === undefined) {
      continue
    }

    for (let rightIndex = leftIndex + 1; rightIndex < locations.length; rightIndex += 1) {
      const consumed = locations[rightIndex]
      if (consumed === undefined || consumed.book.level !== target.book.level) {
        continue
      }

      if (best === null || target.book.level > best.target.book.level) {
        best = { target, consumed }
      }
    }
  }

  if (best === null) {
    return null
  }

  return { targetId: best.target.book.id, consumedId: best.consumed.book.id }
}

function collectBookLocations(state: EngineState): readonly BookLocation[] {
  const locations: BookLocation[] = []

  for (const slot of SLOT_INDEXES) {
    const book = state.equipped[slot]
    if (book !== null) {
      locations.push({ kind: "equipped", slot, book })
    }
  }

  for (let index = 0; index < state.books.length; index += 1) {
    const book = state.books[index]
    if (book !== undefined) {
      locations.push({ kind: "inventory", index, book })
    }
  }

  return locations
}

function findHighestBookIndex(books: readonly Spellbook[]): number | null {
  let bestIndex: number | null = null
  let bestLevel = -Infinity

  for (let index = 0; index < books.length; index += 1) {
    const book = books[index]
    if (book !== undefined && book.level > bestLevel) {
      bestIndex = index
      bestLevel = book.level
    }
  }

  return bestIndex
}
