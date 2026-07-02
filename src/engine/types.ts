import { SLOT_INDEXES } from "./constants.js"

export const ELEMENTS = ["fire", "frost", "holy"] as const
export const SKILL_NAMES = ["summonBonus", "castSpeed", "goldGain", "critChance"] as const

export type Element = (typeof ELEMENTS)[number]
export type SkillName = (typeof SKILL_NAMES)[number]
export type SlotIndex = (typeof SLOT_INDEXES)[number]

export type Spellbook = {
  readonly id: string
  readonly level: number
  readonly element: Element
}

export type SkillAllocations = {
  readonly summonBonus: number
  readonly castSpeed: number
  readonly goldGain: number
  readonly critChance: number
}

export type EquippedBooks = readonly [
  Spellbook | null,
  Spellbook | null,
  Spellbook | null,
  Spellbook | null,
  Spellbook | null,
  Spellbook | null,
]

export type SlotTiers = readonly [number, number, number, number, number, number]
export type SlotTimers = readonly [number, number, number, number, number, number]

export type EngineState = {
  readonly gold: number
  readonly books: readonly Spellbook[]
  readonly equipped: EquippedBooks
  readonly highestLevelEver: number
  readonly stage: number
  readonly wave: number
  readonly stageHp: number
  readonly wizardLevel: number
  readonly wizardXp: number
  readonly skillPoints: number
  readonly skills: SkillAllocations
  readonly manaCrystals: number
  readonly prestigeCount: number
  readonly lastSeenServerTs: number | null
  readonly slotTiers: SlotTiers
  readonly castProgressMs: SlotTimers
  readonly enemiesHp: readonly number[]
  readonly bossElapsedMs: number
  readonly frostSlowMs: number
  readonly recentGoldPerSecond: number
  readonly elapsedMs: number
  readonly rngSeed: number
  readonly rngState: number
  readonly nextBookId: number
}

export type EngineEvent =
  | {
      readonly type: "cast"
      readonly bookId: string
      readonly slotIdx: SlotIndex
      readonly element: Element
      readonly damage: number
      readonly critical: boolean
      readonly targetsHit: number
    }
  | {
      readonly type: "kill"
      readonly stage: number
      readonly wave: number
      readonly gold: number
      readonly xp: number
      readonly boss: boolean
    }
  | { readonly type: "waveClear"; readonly stage: number; readonly wave: number }
  | { readonly type: "bossSpawn"; readonly stage: number }
  | { readonly type: "bossKill"; readonly stage: number; readonly gold: number }
  | { readonly type: "bossFail"; readonly stage: number }
  | { readonly type: "levelUp"; readonly wizardLevel: number; readonly skillPoints: number }
  | { readonly type: "slow"; readonly durationMs: number; readonly factor: number }

export class UnexpectedVariantError extends Error {
  readonly name = "UnexpectedVariantError"

  constructor(readonly value: string) {
    super(`Unexpected variant: ${value}`)
  }
}

export function assertNever(value: never): never {
  throw new UnexpectedVariantError(String(value))
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
