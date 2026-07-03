import { ELEMENTS, assertNever, type Element, type EngineState, type Spellbook } from "./types.js"

export const CODEX_MAX_TIER = 10
export const CODEX_DAMAGE_PER_TIER = 0.03

export type CodexCell = {
  readonly element: Element
  readonly tier: number
  readonly unlocked: boolean
}

export function getBookCodexTier(book: Spellbook): number {
  return Math.min(CODEX_MAX_TIER, Math.floor(book.level / 10))
}

export function recordBookCodex(state: EngineState, book: Spellbook): EngineState {
  const tier = getBookCodexTier(book)
  if (tier < 1) {
    return state
  }

  const currentTier = state.codex.tiers[book.element] ?? 0
  if (currentTier >= tier) {
    return state
  }

  return {
    ...state,
    codex: { tiers: { ...state.codex.tiers, [book.element]: tier } },
  }
}

export function getCodexBonusMultiplier(state: EngineState, element: Element): number {
  return 1 + CODEX_DAMAGE_PER_TIER * (state.codex.tiers[element] ?? 0)
}

export function getCodexCellCount(state: EngineState): number {
  return ELEMENTS.reduce((total, element) => total + (state.codex.tiers[element] ?? 0), 0)
}

export function getCodexCells(state: EngineState): readonly CodexCell[] {
  return ELEMENTS.flatMap((element) =>
    Array.from({ length: CODEX_MAX_TIER }, (_, index) => {
      const tier = index + 1
      return {
        element,
        tier,
        unlocked: (state.codex.tiers[element] ?? 0) >= tier,
      }
    }),
  )
}

export function getElementLabel(element: Element): string {
  switch (element) {
    case "fire":
      return "Fire"
    case "frost":
      return "Frost"
    case "holy":
      return "Holy"
    default:
      return assertNever(element)
  }
}
