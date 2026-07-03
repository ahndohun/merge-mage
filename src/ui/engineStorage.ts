import { convertLegacyManaStonesToCrystals } from "../engine/currency"
import { createInitialState, createInitialV3ProgressionState, type EngineV3ProgressionState } from "../engine/state"
import type { AchievementState, EngineState, Spellbook } from "../engine/types"
import { writeLocaleOverride } from "./i18n"

const SAVE_STATE_KEY = "merge-mage:engine-state"
const SAVE_TOKEN_KEY = "merge-mage:save-token"
const NICKNAME_KEY = "merge-mage:nickname"
const TUTORIAL_DONE_KEY = "merge-mage:tutorial-done"

/**
 * Bump when a save-format change changes the local wrapper contract. v2 wiped
 * pre-release bare saves; v3 preserved progression slots; v4 folds mana stones
 * into crystals and records highestStage.
 */
export const SAVE_VERSION = 4

type VersionedSave = {
  readonly version: number
  readonly state: unknown
}

type EngineV2State = Omit<EngineState, keyof EngineV3ProgressionState | "highestStage"> & {
  readonly manaStone?: number
}
type EngineV3State = Omit<EngineState, "highestStage"> & {
  readonly manaStone: number
}
type EngineV3PreManaStoneState = Omit<EngineState, "highestStage">

export type SaveToken = {
  readonly token: string
  readonly existed: boolean
}

/** Drop the save, token, and tutorial flag — a clean-slate first experience. */
function wipeLegacySave(): void {
  const storage = getStorage()
  storage?.removeItem(SAVE_STATE_KEY)
  storage?.removeItem(SAVE_TOKEN_KEY)
  storage?.removeItem(TUTORIAL_DONE_KEY)
}

export function loadInitialState(): EngineState {
  // ?fresh=1 starts a brand-new run: E2E tests need isolation from state the
  // previous test left in this browser profile, and players get a reset URL.
  // A fresh-param visitor already knows the game, so the first-run tutorial is
  // marked done too (it would dim-block E2E agents otherwise); only organic
  // first visits (no param) see the tutorial.
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("fresh")) {
    getStorage()?.removeItem(SAVE_STATE_KEY)
    getStorage()?.removeItem(SAVE_TOKEN_KEY)
    writeLocaleOverride("en")
    getStorage()?.setItem(TUTORIAL_DONE_KEY, "1")
    const fresh = createInitialState(createSeed())
    saveLocalState(fresh)
    return fresh
  }

  const raw = getStorage()?.getItem(SAVE_STATE_KEY)
  if (raw !== undefined && raw !== null) {
    try {
      const parsed: unknown = JSON.parse(raw)
      const state = readVersionedSave(parsed)
      if (state !== null) {
        return state
      }
      // A save exists but is legacy / below SAVE_VERSION: reset everything so
      // pre-release visitors get the current first-run experience.
      wipeLegacySave()
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error
      }
    }
  }

  return createInitialState(createSeed())
}

/**
 * Returns the EngineState from a persisted wrapper. v2/v3 are migrated in
 * place; older versions return null so the caller resets.
 */
function readVersionedSave(value: unknown): EngineState | null {
  if (isVersionedSave(value)) {
    if (value.version >= SAVE_VERSION) {
      if (isEngineState(value.state)) {
        return value.state
      }
    }
    if (value.version === 3) {
      if (isV3EngineState(value.state)) {
        return migrateV3State(value.state)
      }
      if (isV3PreManaStoneState(value.state)) {
        return migrateV3PreManaStoneState(value.state)
      }
    }
    if (value.version === 2 && isV2EngineState(value.state)) {
      return migrateV2State(value.state)
    }
  }
  return null
}

function isVersionedSave(value: unknown): value is VersionedSave {
  return isRecord(value) && typeof value["version"] === "number" && "state" in value
}

export function saveLocalState(state: EngineState): void {
  const payload: VersionedSave = { version: SAVE_VERSION, state }
  getStorage()?.setItem(SAVE_STATE_KEY, JSON.stringify(payload))
}

export function loadNickname(): string {
  return getStorage()?.getItem(NICKNAME_KEY) ?? "Mage"
}

export function saveNickname(nickname: string): void {
  getStorage()?.setItem(NICKNAME_KEY, nickname)
}

let wipeInProgress = false

/** True after clearSavedRun(): unload-time autosave must not resurrect the run. */
export function isWipeInProgress(): boolean {
  return wipeInProgress
}

export function clearSavedRun(): void {
  // NEW GAME was broken: the beforeunload/pagehide autosave re-wrote the old
  // state between the wipe and the reload, so the "fresh" run loaded stage N.
  wipeInProgress = true
  const storage = getStorage()
  storage?.removeItem(SAVE_STATE_KEY)
  storage?.removeItem(SAVE_TOKEN_KEY)
  storage?.removeItem(NICKNAME_KEY)
}

export function ensureSaveToken(): SaveToken {
  const storage = getStorage()
  const existing = storage?.getItem(SAVE_TOKEN_KEY)
  if (existing !== undefined && existing !== null && existing.length === 32) {
    return { token: existing, existed: true }
  }

  const token = createToken()
  storage?.setItem(SAVE_TOKEN_KEY, token)
  return { token, existed: false }
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage
  } catch (error) {
    if (error instanceof Error) {
      return null
    }
    throw error
  }
}

function createSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647) + 1
}

function createToken(): string {
  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function isEngineState(value: unknown): value is EngineState {
  if (!isRecord(value)) {
    return false
  }
  const record: Record<string, unknown> = value

  return (
    isV2EngineState(value) &&
    typeof record["highestStage"] === "number" &&
    !("manaStone" in record) &&
    isQuestState(record["quests"]) &&
    isAchievementState(record["achievements"]) &&
    isCodexState(record["codex"]) &&
    isTraitState(record["traits"]) &&
    isRiftRunsState(record["riftRuns"]) &&
    (record["activeRift"] === null || isActiveRiftState(record["activeRift"])) &&
    isRelicState(record["relics"]) &&
    isPetState(record["pet"]) &&
    isMineState(record["mine"]) &&
    isDailyMissionState(record["dailyMissions"]) &&
    isSkinState(record["skins"])
  )
}

function isV3EngineState(value: unknown): value is EngineV3State {
  if (!isRecord(value)) {
    return false
  }
  const record: Record<string, unknown> = value
  return isV3PreManaStoneState(value) && typeof record["manaStone"] === "number"
}

function isV3PreManaStoneState(value: unknown): value is EngineV3PreManaStoneState {
  if (!isRecord(value)) {
    return false
  }

  const record: Record<string, unknown> = value

  return (
    isV2EngineState(value) &&
    isQuestState(record["quests"]) &&
    isAchievementState(record["achievements"]) &&
    isCodexState(record["codex"]) &&
    isTraitState(record["traits"]) &&
    isRelicState(record["relics"]) &&
    isRiftRunsState(record["riftRuns"]) &&
    (record["activeRift"] === null || isActiveRiftState(record["activeRift"])) &&
    isPetState(record["pet"]) &&
    isMineState(record["mine"]) &&
    isDailyMissionState(record["dailyMissions"]) &&
    isSkinState(record["skins"])
  )
}

function migrateV2State(state: EngineV2State): EngineState {
  const { manaStone = 0, ...withoutManaStone } = state
  return {
    ...withoutManaStone,
    manaCrystals: state.manaCrystals + convertLegacyManaStonesToCrystals(manaStone),
    highestStage: deriveHighestStage(state),
    ...createInitialV3ProgressionState(),
  }
}

function migrateV3State(state: EngineV3State): EngineState {
  const { manaStone, ...withoutManaStone } = state
  return {
    ...withoutManaStone,
    manaCrystals: state.manaCrystals + convertLegacyManaStonesToCrystals(manaStone),
    highestStage: deriveHighestStage(state),
  }
}

function migrateV3PreManaStoneState(state: EngineV3PreManaStoneState): EngineState {
  return { ...state, highestStage: deriveHighestStage(state) }
}

function deriveHighestStage(state: { readonly stage: number; readonly highestStage?: number; readonly achievements?: AchievementState }): number {
  return Math.max(state.stage, state.highestStage ?? 0, state.achievements?.counters["bestStage"] ?? 0, state.achievements?.counters["stagesReached"] ?? 0)
}

function isV2EngineState(value: unknown): value is EngineV2State {
  if (!isRecord(value)) {
    return false
  }

  const numbers = [
    "gold",
    "highestLevelEver",
    "stage",
    "wave",
    "stageHp",
    "wizardLevel",
    "wizardXp",
    "skillPoints",
    "manaCrystals",
    "prestigeCount",
    "bossElapsedMs",
    "frostSlowMs",
    "recentGoldPerSecond",
    "elapsedMs",
    "rngSeed",
    "rngState",
    "nextBookId",
  ] as const

  return (
    numbers.every((key) => typeof value[key] === "number") &&
    (value["lastSeenServerTs"] === null || typeof value["lastSeenServerTs"] === "number") &&
    isSpellbookArray(value["books"]) &&
    isEquippedArray(value["equipped"]) &&
    isSkills(value["skills"]) &&
    isNumberArray(value["slotTiers"], 6) &&
    isNumberArray(value["castProgressMs"], 6) &&
    isNumberArray(value["enemiesHp"], null)
  )
}

function isQuestState(value: unknown): boolean {
  return isRecord(value) && isStringArray(value["completed"]) && isStringArray(value["claimed"])
}

function isAchievementState(value: unknown): boolean {
  return isRecord(value) && isNumberRecord(value["counters"]) && isStringArray(value["claimed"])
}

function isCodexState(value: unknown): boolean {
  return isRecord(value) && isNumberRecord(value["tiers"])
}

function isTraitState(value: unknown): boolean {
  return isRecord(value) && isStringRecord(value["picks"])
}

function isRelicState(value: unknown): boolean {
  return isRecord(value) && isNumberRecord(value["owned"]) && isNullableStringArray(value["equipped"], 3)
}

function isRiftRunsState(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value["date"] === "string" &&
    typeof value["golden"] === "number" &&
    typeof value["trial"] === "number"
  )
}

function isActiveRiftState(value: unknown): boolean {
  if (!isRecord(value) || !isBattleSnapshot(value["snapshot"]) || typeof value["startedStage"] !== "number") {
    return false
  }
  if (value["kind"] === "golden") {
    return typeof value["remainingMs"] === "number"
  }
  if (value["kind"] === "trial") {
    return typeof value["step"] === "number"
  }
  return false
}

function isBattleSnapshot(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value["stage"] === "number" &&
    typeof value["wave"] === "number" &&
    typeof value["stageHp"] === "number" &&
    isNumberArray(value["enemiesHp"], null) &&
    typeof value["bossElapsedMs"] === "number" &&
    typeof value["frostSlowMs"] === "number"
  )
}

function isPetState(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value["level"] === "number" &&
    typeof value["xp"] === "number" &&
    typeof value["evolution"] === "number"
  )
}

function isMineState(value: unknown): boolean {
  return isRecord(value) && typeof value["floor"] === "number" && (value["lastClaimAt"] === null || typeof value["lastClaimAt"] === "number")
}

function isDailyMissionState(value: unknown): boolean {
  return isRecord(value) && typeof value["date"] === "string" && isNumberRecord(value["progress"]) && isStringArray(value["claimed"])
}

function isSkinState(value: unknown): boolean {
  return isRecord(value) && isStringArray(value["owned"]) && (value["equipped"] === null || typeof value["equipped"] === "string")
}

function isSkills(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value["summonBonus"] === "number" &&
    typeof value["castSpeed"] === "number" &&
    typeof value["goldGain"] === "number" &&
    typeof value["critChance"] === "number"
  )
}

function isEquippedArray(value: unknown): boolean {
  return Array.isArray(value) && value.length === 6 && value.every((item) => item === null || isSpellbook(item))
}

function isSpellbookArray(value: unknown): boolean {
  return Array.isArray(value) && value.every(isSpellbook)
}

function isNumberArray(value: unknown, length: number | null): boolean {
  return Array.isArray(value) && (length === null || value.length === length) && value.every((item) => typeof item === "number")
}

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isNullableStringArray(value: unknown, length: number): boolean {
  return Array.isArray(value) && value.length === length && value.every((item) => item === null || typeof item === "string")
}

function isNumberRecord(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "number")
}

function isStringRecord(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "string")
}

function isSpellbook(value: unknown): value is Spellbook {
  return isRecord(value) && typeof value["id"] === "string" && typeof value["level"] === "number" && isElement(value["element"])
}

function isElement(value: unknown): value is Spellbook["element"] {
  return value === "fire" || value === "frost" || value === "holy"
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
