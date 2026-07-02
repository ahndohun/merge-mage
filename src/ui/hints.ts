import { BOSS_WAVE } from "../engine/constants"
import type { EngineState, Spellbook } from "../engine/types"

type HintInput = {
  readonly state: EngineState
  readonly summonCost: number
}

export function getContextHint(input: HintInput): string | null {
  const allBooks = collectBooks(input.state)
  const hasBook = allBooks.length > 0

  if (!hasBook && input.state.gold >= input.summonCost) {
    return "Tap SUMMON to arm your first spellbook"
  }

  if (hasSameLevelPair(allBooks)) {
    return "Tap a book, then another of the same level — works in slots too"
  }

  if (input.state.books.length > 0 && hasEmptyEquipSlot(input.state)) {
    return "Tap a book, then an empty slot to equip"
  }

  if (input.state.wave === BOSS_WAVE) {
    return "Boss! Holy books deal double damage"
  }

  if (input.state.stage >= 10 && input.state.prestigeCount === 0) {
    return "REBIRTH is unlocked — permanent power"
  }

  return null
}

function collectBooks(state: EngineState): readonly Spellbook[] {
  return [...state.books, ...state.equipped.filter((book) => book !== null)]
}

function hasSameLevelPair(books: readonly Spellbook[]): boolean {
  const seenLevels = new Set<number>()
  for (const book of books) {
    if (seenLevels.has(book.level)) {
      return true
    }
    seenLevels.add(book.level)
  }
  return false
}

function hasEmptyEquipSlot(state: EngineState): boolean {
  return state.equipped.some((book) => book === null)
}
