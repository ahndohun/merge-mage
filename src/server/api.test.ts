import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import { leaderboardBodySchema, saveBodySchema } from "../../api/index"
import { jsonState, parseSavedState } from "../../api/_lib/schemas"

const token = "merge_mage_test_token_12345"
const V3_PROGRESS_KEYS = ["quests", "achievements", "codex", "traits", "relics", "riftRuns", "activeRift", "pet", "mine", "dailyMissions", "skins"] as const

function book(id: string, level = 1) {
  return { id, level, element: "fire" } as const
}

function withoutV3Progression(state: ReturnType<typeof createInitialState>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(state).filter(([key]) => !V3_PROGRESS_KEYS.some((progressKey) => progressKey === key)))
}

describe("saveBodySchema", () => {
  it("accepts an engine state inside anti-cheat limits", () => {
    const body = {
      token,
      state: {
        ...createInitialState(7),
        books: [book("book-1")],
        equipped: [book("book-2"), null, null, null, null, null],
      },
    }

    const parsed = saveBodySchema.safeParse(body)

    expect(parsed.success).toBe(true)
  })

  it("accepts a v2 engine state and fills v3 progression defaults", () => {
    const v2State = withoutV3Progression({
      ...createInitialState(7),
      gold: 99,
      stage: 6,
    })
    const parsed = saveBodySchema.safeParse({ token, state: v2State })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.state.gold).toBe(99)
      expect(parsed.data.state.stage).toBe(6)
      expect(parsed.data.state.quests).toEqual({ completed: [], claimed: [] })
      expect(parsed.data.state.achievements).toEqual({ counters: {}, claimed: [] })
      expect(parsed.data.state.codex).toEqual({ tiers: {} })
      expect(parsed.data.state.traits).toEqual({ picks: {} })
      expect(parsed.data.state.relics).toEqual({ owned: {}, equipped: [null, null, null] })
      expect(parsed.data.state.riftRuns).toEqual({ date: "", golden: 0, trial: 0 })
      expect(parsed.data.state.activeRift).toBeNull()
      expect(parsed.data.state.pet).toEqual({ level: 1, xp: 0, evolution: 0 })
      expect(parsed.data.state.mine).toEqual({ floor: 1, lastClaimAt: null })
      expect(parsed.data.state.dailyMissions).toEqual({ date: "", progress: {}, claimed: [] })
      expect(parsed.data.state.skins).toEqual({ owned: [], equipped: null })
    }
  })

  it("round-trips a v3 engine state through JSON serialization", () => {
    const state = {
      ...createInitialState(7),
      achievements: { counters: { mergesTotal: 12, bossKills: 1 }, claimed: ["merge-10"] },
      codex: { tiers: { fire: 3 } },
      relics: { owned: { emberSigil: 2 }, equipped: ["emberSigil", null, null] as const },
      riftRuns: { date: "2026-07-03", golden: 1, trial: 2 },
      skins: { owned: ["apprentice-blue"], equipped: "apprentice-blue" },
    }

    const parsed = parseSavedState(JSON.parse(jsonState(state)))

    expect(parsed.achievements.counters["mergesTotal"]).toBe(12)
    expect(parsed.achievements.counters["bossKills"]).toBe(1)
    expect(parsed.codex.tiers["fire"]).toBe(3)
    expect(parsed.relics).toEqual({ owned: { emberSigil: 2 }, equipped: ["emberSigil", null, null] })
    expect(parsed.riftRuns).toEqual({ date: "2026-07-03", golden: 1, trial: 2 })
    expect(parsed.skins).toEqual({ owned: ["apprentice-blue"], equipped: "apprentice-blue" })
  })

  it("rejects malformed tokens", () => {
    const parsed = saveBodySchema.safeParse({
      token: "short!",
      state: createInitialState(7),
    })

    expect(parsed.success).toBe(false)
  })

  it("rejects non-finite, negative, and absurd gold", () => {
    for (const gold of [Number.NaN, -1, 1_000_000_000_001]) {
      const parsed = saveBodySchema.safeParse({
        token,
        state: { ...createInitialState(7), gold },
      })

      expect(parsed.success).toBe(false)
    }
  })

  it("rejects stages outside the server limit", () => {
    for (const stage of [0, 100_001]) {
      const parsed = saveBodySchema.safeParse({
        token,
        state: { ...createInitialState(7), stage },
      })

      expect(parsed.success).toBe(false)
    }
  })

  it("rejects excess inventory and invalid book levels", () => {
    const tooManyBooks = Array.from({ length: 16 }, (_, index) => book(`book-${index + 1}`))
    const excessInventory = saveBodySchema.safeParse({
      token,
      state: { ...createInitialState(7), books: tooManyBooks },
    })
    const invalidLevel = saveBodySchema.safeParse({
      token,
      state: { ...createInitialState(7), books: [book("book-1", 0)] },
    })

    expect(excessInventory.success).toBe(false)
    expect(invalidLevel.success).toBe(false)
  })
})

describe("leaderboardBodySchema", () => {
  it("strips control characters from nicknames", () => {
    const parsed = leaderboardBodySchema.safeParse({
      token,
      nickname: "Me\u0000r\nlin",
    })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.nickname).toBe("Merlin")
    }
  })

  it("rejects nicknames shorter than two visible characters after stripping", () => {
    const parsed = leaderboardBodySchema.safeParse({
      token,
      nickname: "M\u0000",
    })

    expect(parsed.success).toBe(false)
  })
})
