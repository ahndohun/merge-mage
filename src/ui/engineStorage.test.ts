import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createInitialState } from "../engine/state"
import { loadInitialState, saveLocalState, SAVE_VERSION } from "./engineStorage"
import { LOCALE_STORAGE_KEY } from "./i18n"

const SAVE_STATE_KEY = "merge-mage:engine-state"
const SAVE_TOKEN_KEY = "merge-mage:save-token"
const TUTORIAL_DONE_KEY = "merge-mage:tutorial-done"

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => map.delete(key),
    setItem: (key: string, value: string) => map.set(key, value),
  }
}

describe("engineStorage save versioning", () => {
  let storage: Storage

  beforeEach(() => {
    storage = memoryStorage()
    vi.stubGlobal("window", { localStorage: storage, location: { search: "" } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("wraps saves as {version, state} at the current SAVE_VERSION", () => {
    const state = createInitialState(7)
    saveLocalState(state)

    const raw = storage.getItem(SAVE_STATE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string)
    expect(parsed.version).toBe(SAVE_VERSION)
    expect(parsed.state.rngSeed).toBe(7)
  })

  it("loads a current-version save unchanged", () => {
    const state = { ...createInitialState(11), gold: 4242, stage: 5 }
    saveLocalState(state)

    const loaded = loadInitialState()
    expect(loaded.gold).toBe(4242)
    expect(loaded.stage).toBe(5)
  })

  it("resets a legacy bare-EngineState save and wipes token + tutorial flag", () => {
    // Pre-v2 saves stored a bare EngineState (no version wrapper).
    const legacy = { ...createInitialState(3), gold: 99999, stage: 12 }
    storage.setItem(SAVE_STATE_KEY, JSON.stringify(legacy))
    storage.setItem(SAVE_TOKEN_KEY, "a".repeat(32))
    storage.setItem(TUTORIAL_DONE_KEY, "1")

    const loaded = loadInitialState()

    // Fresh game, not the stage-12 legacy run.
    expect(loaded.stage).toBe(1)
    expect(loaded.gold).not.toBe(99999)
    // Token + tutorial flag wiped so the owner sees the new onboarding.
    expect(storage.getItem(SAVE_TOKEN_KEY)).toBeNull()
    expect(storage.getItem(TUTORIAL_DONE_KEY)).toBeNull()
  })

  it("resets a save whose version is below SAVE_VERSION", () => {
    const belowVersion = { version: 1, state: { ...createInitialState(4), stage: 8 } }
    storage.setItem(SAVE_STATE_KEY, JSON.stringify(belowVersion))
    storage.setItem(TUTORIAL_DONE_KEY, "1")

    const loaded = loadInitialState()

    expect(loaded.stage).toBe(1)
    expect(storage.getItem(TUTORIAL_DONE_KEY)).toBeNull()
  })

  it("round-trips a saved-then-loaded run at the current version", () => {
    const state = { ...createInitialState(21), gold: 500, wave: 3 }
    saveLocalState(state)

    const loaded = loadInitialState()
    expect(loaded.gold).toBe(500)
    expect(loaded.wave).toBe(3)
  })

  it("forces English locale override for deterministic fresh E2E runs", () => {
    vi.stubGlobal("window", { localStorage: storage, location: { search: "?fresh=1" } })
    storage.setItem(LOCALE_STORAGE_KEY, "ko")

    loadInitialState()

    expect(storage.getItem(LOCALE_STORAGE_KEY)).toBe("en")
  })
})
