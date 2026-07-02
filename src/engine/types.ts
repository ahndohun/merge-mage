export const ELEMENTS = ["fire", "frost", "holy"] as const

export type Element = (typeof ELEMENTS)[number]

export type Spellbook = {
  readonly id: string
  readonly level: number
  readonly element: Element
}

export type GameState = {
  readonly gold: number
  readonly books: readonly Spellbook[]
  readonly equipped: readonly Spellbook[]
  readonly stage: number
  readonly wave: number
  readonly highestLevel: number
  readonly summonCount: number
  readonly lastServerTime: string | null
}
