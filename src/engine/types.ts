import { SLOT_INDEXES } from "./constants.js"

export const ELEMENTS = ["fire", "frost", "holy"] as const
export const SKILL_NAMES = ["summonBonus", "castSpeed", "goldGain", "critChance"] as const

export type Element = (typeof ELEMENTS)[number]
export type CastElement = Element | "arcane"
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
export type RelicEquipment = readonly [string | null, string | null, string | null]
export type RiftKind = "golden" | "trial"

export type QuestState = {
  readonly completed: readonly string[]
  readonly claimed: readonly string[]
}

export type AchievementState = {
  readonly counters: Record<string, number>
  readonly claimed: readonly string[]
}

export type CodexState = {
  readonly tiers: Record<string, number>
}

export type TraitState = {
  readonly picks: Record<string, string>
}

export type RelicState = {
  readonly owned: Record<string, number>
  readonly equipped: RelicEquipment
}

export type RiftRunsState = {
  readonly date: string
  readonly golden: number
  readonly trial: number
}

export type BattleSnapshot = {
  readonly stage: number
  readonly wave: number
  readonly stageHp: number
  readonly enemiesHp: readonly number[]
  readonly bossElapsedMs: number
  readonly frostSlowMs: number
}

export type ActiveRiftState =
  | {
      readonly kind: "golden"
      readonly remainingMs: number
      readonly startedStage: number
      readonly snapshot: BattleSnapshot
    }
  | {
      readonly kind: "trial"
      readonly step: number
      readonly startedStage: number
      readonly snapshot: BattleSnapshot
    }

export type PetState = {
  readonly level: number
  readonly xp: number
  readonly evolution: number
}

export type MineState = {
  readonly floor: number
  readonly lastClaimAt: number | null
}

export type DailyMissionState = {
  readonly date: string
  readonly progress: Record<string, number>
  readonly claimed: readonly string[]
}

export type SkinState = {
  readonly owned: readonly string[]
  readonly equipped: string | null
}

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
  readonly manaStone: number
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
  readonly quests: QuestState
  readonly achievements: AchievementState
  readonly codex: CodexState
  readonly traits: TraitState
  readonly relics: RelicState
  readonly riftRuns: RiftRunsState
  readonly activeRift: ActiveRiftState | null
  readonly pet: PetState
  readonly mine: MineState
  readonly dailyMissions: DailyMissionState
  readonly skins: SkinState
}

export type EngineEvent =
  | {
      readonly type: "cast"
      readonly bookId: string
      readonly slotIdx: SlotIndex
      readonly element: CastElement
      readonly damage: number
      readonly critical: boolean
      readonly targetIndex: number
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
  | { readonly type: "riftComplete"; readonly kind: RiftKind; readonly reward: number }
  | {
      readonly type: "petCast"
      readonly damage: number
      readonly targetIndex: number
      readonly evolution: number
    }

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
