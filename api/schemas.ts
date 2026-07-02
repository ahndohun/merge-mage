import { z, type ZodType } from "zod"
import { EQUIPMENT_SLOT_COUNT, INVENTORY_LIMIT } from "../src/engine/constants"
import { ELEMENTS, type EngineState, type EquippedBooks, type SkillAllocations, type SlotTiers, type SlotTimers, type Spellbook } from "../src/engine/types"
import { CorruptSaveError } from "./errors"

export const MAX_GOLD = 1_000_000_000_000
export const MAX_STAGE = 100_000

export const tokenSchema = z.string().min(24).max(64).regex(/^[A-Za-z0-9_-]+$/)

const nonNegativeNumber = z.number().finite().min(0)
const goldSchema = nonNegativeNumber.max(MAX_GOLD)
const stageSchema = z.number().finite().int().min(1).max(MAX_STAGE)
const levelSchema = z.number().finite().int().min(1)
const slotNumberSchema = z.number().finite().int().min(0)
const spellbookSchema = z.object({
  id: z.string().min(1).max(128),
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
