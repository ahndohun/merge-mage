import { z, type ZodType } from "zod"
import { EQUIPMENT_SLOT_COUNT, INVENTORY_LIMIT } from "../../src/engine/constants.js"
import {
  ELEMENTS,
  type ActiveRiftState,
  type AchievementState,
  type BattleSnapshot,
  type CodexState,
  type DailyMissionState,
  type EngineState,
  type EquippedBooks,
  type MineState,
  type PetState,
  type QuestState,
  type RelicEquipment,
  type RelicState,
  type RiftRunsState,
  type SkillAllocations,
  type SkinState,
  type SlotTiers,
  type SlotTimers,
  type Spellbook,
  type TraitState,
} from "../../src/engine/types.js"
import { CorruptSaveError } from "./errors.js"

export const MAX_GOLD = 1_000_000_000_000
export const MAX_STAGE = 100_000

export const tokenSchema = z.string().min(24).max(64).regex(/^[A-Za-z0-9_-]+$/)

const nonNegativeNumber = z.number().finite().min(0)
const goldSchema = nonNegativeNumber.max(MAX_GOLD)
const stageSchema = z.number().finite().int().min(1).max(MAX_STAGE)
const levelSchema = z.number().finite().int().min(1)
const slotNumberSchema = z.number().finite().int().min(0)
const idSchema = z.string().min(1).max(128)
const shortLabelSchema = z.string().max(64)
const counterRecordSchema = z.record(idSchema, slotNumberSchema)
const stringRecordSchema = z.record(idSchema, idSchema)
const spellbookSchema = z.object({
  id: idSchema,
  level: levelSchema,
  element: z.enum(ELEMENTS),
}) satisfies ZodType<Spellbook>
const skillsSchema = z.object({
  summonBonus: slotNumberSchema,
  castSpeed: slotNumberSchema,
  goldGain: slotNumberSchema,
  critChance: slotNumberSchema,
}) satisfies ZodType<SkillAllocations>
const equippedSchema = z.tuple([
  spellbookSchema.nullable(),
  spellbookSchema.nullable(),
  spellbookSchema.nullable(),
  spellbookSchema.nullable(),
  spellbookSchema.nullable(),
  spellbookSchema.nullable(),
]) satisfies ZodType<EquippedBooks>
const slotsSchema = z.tuple([
  slotNumberSchema,
  slotNumberSchema,
  slotNumberSchema,
  slotNumberSchema,
  slotNumberSchema,
  slotNumberSchema,
]) satisfies ZodType<SlotTiers>
const timersSchema = z.tuple([
  nonNegativeNumber,
  nonNegativeNumber,
  nonNegativeNumber,
  nonNegativeNumber,
  nonNegativeNumber,
  nonNegativeNumber,
]) satisfies ZodType<SlotTimers>
const questSchema = z.object({
  completed: z.array(idSchema),
  claimed: z.array(idSchema),
}) satisfies ZodType<QuestState>
const achievementSchema = z.object({
  counters: counterRecordSchema,
  claimed: z.array(idSchema),
}) satisfies ZodType<AchievementState>
const codexSchema = z.object({
  tiers: counterRecordSchema,
}) satisfies ZodType<CodexState>
const traitSchema = z.object({
  picks: stringRecordSchema,
}) satisfies ZodType<TraitState>
const relicEquipmentSchema = z.tuple([idSchema.nullable(), idSchema.nullable(), idSchema.nullable()]) satisfies ZodType<RelicEquipment>
const relicSchema = z.object({
  owned: counterRecordSchema,
  equipped: relicEquipmentSchema,
}) satisfies ZodType<RelicState>
const riftRunsSchema = z.object({
  date: shortLabelSchema,
  golden: slotNumberSchema,
  trial: slotNumberSchema,
}) satisfies ZodType<RiftRunsState>
const battleSnapshotSchema = z.object({
  stage: stageSchema,
  wave: levelSchema,
  stageHp: nonNegativeNumber,
  enemiesHp: z.array(nonNegativeNumber),
  bossElapsedMs: nonNegativeNumber,
  frostSlowMs: nonNegativeNumber,
}) satisfies ZodType<BattleSnapshot>
const activeRiftSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("golden"),
    remainingMs: nonNegativeNumber,
    startedStage: stageSchema,
    snapshot: battleSnapshotSchema,
  }),
  z.object({
    kind: z.literal("trial"),
    step: slotNumberSchema,
    startedStage: stageSchema,
    snapshot: battleSnapshotSchema,
  }),
]) satisfies ZodType<ActiveRiftState>
const petSchema = z.object({
  level: levelSchema,
  xp: nonNegativeNumber,
  evolution: slotNumberSchema,
}) satisfies ZodType<PetState>
const mineSchema = z.object({
  floor: levelSchema,
  lastClaimAt: nonNegativeNumber.nullable(),
}) satisfies ZodType<MineState>
const dailyMissionSchema = z.object({
  date: shortLabelSchema,
  progress: counterRecordSchema,
  claimed: z.array(idSchema),
}) satisfies ZodType<DailyMissionState>
const skinSchema = z.object({
  owned: z.array(idSchema),
  equipped: idSchema.nullable(),
}) satisfies ZodType<SkinState>

function defaultQuestState(): { completed: string[]; claimed: string[] } {
  return { completed: [], claimed: [] }
}

function defaultAchievementState(): { counters: Record<string, number>; claimed: string[] } {
  return { counters: {}, claimed: [] }
}

function defaultCodexState(): { tiers: Record<string, number> } {
  return { tiers: {} }
}

function defaultTraitState(): { picks: Record<string, string> } {
  return { picks: {} }
}

function defaultRelicState(): { owned: Record<string, number>; equipped: [string | null, string | null, string | null] } {
  return { owned: {}, equipped: [null, null, null] }
}

function defaultRiftRunsState(): { date: string; golden: number; trial: number } {
  return { date: "", golden: 0, trial: 0 }
}

function defaultPetState(): { level: number; xp: number; evolution: number } {
  return { level: 1, xp: 0, evolution: 0 }
}

function defaultMineState(): { floor: number; lastClaimAt: number | null } {
  return { floor: 1, lastClaimAt: null }
}

function defaultDailyMissionState(): { date: string; progress: Record<string, number>; claimed: string[] } {
  return { date: "", progress: {}, claimed: [] }
}

function defaultSkinState(): { owned: string[]; equipped: string | null } {
  return { owned: ["apprentice"], equipped: "apprentice" }
}

export const engineStateSchema: ZodType<EngineState> = z
  .object({
    gold: goldSchema,
    books: z.array(spellbookSchema).max(INVENTORY_LIMIT),
    equipped: equippedSchema,
    highestLevelEver: levelSchema,
    stage: stageSchema,
    wave: levelSchema,
    stageHp: nonNegativeNumber,
    wizardLevel: levelSchema,
    wizardXp: nonNegativeNumber,
    skillPoints: slotNumberSchema,
    skills: skillsSchema,
    manaCrystals: slotNumberSchema,
    manaStone: slotNumberSchema.default(0),
    prestigeCount: slotNumberSchema,
    lastSeenServerTs: nonNegativeNumber.nullable(),
    slotTiers: slotsSchema,
    castProgressMs: timersSchema,
    enemiesHp: z.array(nonNegativeNumber),
    bossElapsedMs: nonNegativeNumber,
    frostSlowMs: nonNegativeNumber,
    recentGoldPerSecond: nonNegativeNumber,
    elapsedMs: nonNegativeNumber,
    rngSeed: slotNumberSchema,
    rngState: slotNumberSchema,
    nextBookId: levelSchema,
    quests: questSchema.default(defaultQuestState),
    achievements: achievementSchema.default(defaultAchievementState),
    codex: codexSchema.default(defaultCodexState),
    traits: traitSchema.default(defaultTraitState),
    relics: relicSchema.default(defaultRelicState),
    riftRuns: riftRunsSchema.default(defaultRiftRunsState),
    activeRift: activeRiftSchema.nullable().default(null),
    pet: petSchema.default(defaultPetState),
    mine: mineSchema.default(defaultMineState),
    dailyMissions: dailyMissionSchema.default(defaultDailyMissionState),
    skins: skinSchema.default(defaultSkinState),
  })
  .superRefine((state, context) => {
    const equippedCount = state.equipped.filter((book) => book !== null).length
    if (state.books.length + equippedCount > INVENTORY_LIMIT + EQUIPMENT_SLOT_COUNT) {
      context.addIssue({
        code: "custom",
        path: ["books"],
        message: "too many spellbooks",
      })
    }
  })

export const saveBodySchema = z.object({
  token: tokenSchema,
  state: engineStateSchema,
})
export const tokenBodySchema = z.object({ token: tokenSchema })
export const leaderboardBodySchema = z.object({
  token: tokenSchema,
  nickname: z
    .string()
    .transform((value) => value.replace(/[\u0000-\u001f\u007f]/g, "").trim())
    .pipe(z.string().min(2).max(16)),
})

export function parseSavedState(value: unknown): EngineState {
  const parsed = engineStateSchema.safeParse(value)
  if (!parsed.success) {
    throw new CorruptSaveError()
  }
  return parsed.data
}

export function jsonState(state: EngineState): string {
  const json = JSON.stringify(state)
  if (json === undefined) {
    throw new CorruptSaveError()
  }
  return json
}
