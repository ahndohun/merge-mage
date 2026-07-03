import { createInitialState } from "../engine/state"
import type { EngineState, Spellbook } from "../engine/types"

const SAVE_STATE_KEY = "merge-mage:engine-state"
const SAVE_TOKEN_KEY = "merge-mage:save-token"
const NICKNAME_KEY = "merge-mage:nickname"
const TUTORIAL_DONE_KEY = "merge-mage:tutorial-done"

/**
 * Bump when a save-format change should invalidate every existing local save.
 * v2 wipes all pre-release saves (owner included): they predate the new
 * onboarding, and no shipped players exist yet, so a clean first run is safest.
 * Persisted saves are wrapped as {version, state}; a bare EngineState (or any
 * value below the current version) is treated as legacy and reset.
 */
export const SAVE_VERSION = 2

type VersionedSave = {
  readonly version: number
  readonly state: EngineState
}

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
 * Returns the EngineState from a persisted value only when it is wrapped at the
 * current SAVE_VERSION. Bare EngineState (unwrapped legacy) and older versions
 * return null so the caller resets.
 */
function readVersionedSave(value: unknown): EngineState | null {
  if (isVersionedSave(value)) {
    return value.version >= SAVE_VERSION && isEngineState(value.state) ? value.state : null
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

function isSpellbook(value: unknown): value is Spellbook {
  return isRecord(value) && typeof value["id"] === "string" && typeof value["level"] === "number" && isElement(value["element"])
}

function isElement(value: unknown): value is Spellbook["element"] {
  return value === "fire" || value === "frost" || value === "holy"
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
