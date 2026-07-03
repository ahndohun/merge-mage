import { BOSS_WAVE } from "../engine/constants"
import { getUnlockedFeatures } from "../engine/unlocks"
import type { EngineState, Spellbook } from "../engine/types"
import { createTranslator, type Translator } from "./i18n"

type HintInput = {
  readonly state: EngineState
  readonly summonCost: number
}

const defaultTranslator = createTranslator("en")

export function getContextHint(input: HintInput, t: Translator = defaultTranslator): string | null {
  const allBooks = collectBooks(input.state)
  const hasBook = allBooks.length > 0

  if (!hasBook && input.state.gold >= input.summonCost) {
    return t("hintSummonFirst")
  }

  if (hasSameLevelPair(allBooks)) {
    return t("hintMergePair")
  }

  if (input.state.books.length > 0 && hasEmptyEquipSlot(input.state)) {
    return t("hintEquipEmptySlot")
  }

  if (input.state.wave === BOSS_WAVE) {
    return t("hintBossHoly")
  }

  if (getUnlockedFeatures(input.state).rebirth && input.state.prestigeCount === 0) {
    return t("hintRebirthUnlocked")
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
