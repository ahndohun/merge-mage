import { describe, expect, it } from "vitest"
import { simulateTicks } from "./battle.js"
import {
  DAILY_MISSIONS,
  addPetXp,
  claimDailyMission,
  claimMine,
  equipSkin,
  getDailyMissionStatus,
  getMineClaimPreview,
  getPetDamagePercent,
  getPetEvolutionForLevel,
  getUnlockedMineFloor,
  getUnlockedSkins,
  getWizardTotalDps,
  recordDailyProgress,
  syncDailyMissions,
} from "./camp.js"
import { createInitialState, type EngineState } from "./state.js"
import type { Spellbook } from "./types.js"

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("pet progression and battle contribution", () => {
  it("shares half of wizard XP, levels up, and evolves at levels 10 and 25", () => {
    const levelTen = addPetXp(createInitialState(1), 900)
    const levelTwentyFive = addPetXp(createInitialState(1), 6_000)

    expect(levelTen.pet).toEqual({ level: 10, xp: 0, evolution: 1 })
    expect(levelTwentyFive.pet).toEqual({ level: 25, xp: 0, evolution: 2 })
    expect(getPetEvolutionForLevel(9)).toBe(0)
    expect(getPetEvolutionForLevel(10)).toBe(1)
    expect(getPetEvolutionForLevel(25)).toBe(2)
  })

  it("ticks familiar damage against the first target from wizard total DPS", () => {
    const state = {
      ...createInitialState(7),
      equipped: [book("holy", 10, "holy"), null, null, null, null, null],
      enemiesHp: [10_000, 10_000],
      stageHp: 20_000,
      pet: { level: 5, xp: 0, evolution: 0 },
    } satisfies EngineState
    const expectedDamage = getWizardTotalDps(state) * getPetDamagePercent(state.pet)
    const firstHp = state.enemiesHp[0] ?? 0
    const untouchedHp = state.enemiesHp[1] ?? 0

    const result = simulateTicks(state, 10)
    const petCast = result.events.find((event) => event.type === "petCast")

    expect(petCast).toEqual(expect.objectContaining({ type: "petCast", targetIndex: 0 }))
    expect(petCast?.damage).toBeCloseTo(expectedDamage)
    expect(result.state.enemiesHp[0]).toBeLessThan(firstHp - expectedDamage + 0.001)
    expect(result.state.enemiesHp[1]).toBe(untouchedHp)
  })
})

describe("mine production", () => {
  it("keeps the first mine floor under five percent of the first rebirth per hour", () => {
    const state = {
      ...createInitialState(2),
      stage: 4,
      mine: { floor: 1, lastClaimAt: 1_000 },
    } satisfies EngineState
    const preview = getMineClaimPreview(state, 1_000 + 12 * 60 * 60 * 1_000)
    const claimed = claimMine(state, 1_000 + 12 * 60 * 60 * 1_000)

    expect(preview.floor).toBe(1)
    expect(preview.ratePerHour).toBeLessThanOrEqual(0.15)
    expect(preview.manaCrystals).toBe(1)
    expect(claimed.manaCrystals).toBe(1)
  })

  it("unlocks floors from stage milestones and caps claim elapsed time at twelve hours", () => {
    expect(getUnlockedMineFloor(4)).toBe(1)
    expect(getUnlockedMineFloor(15)).toBe(2)
    expect(getUnlockedMineFloor(50)).toBe(4)

    const state = {
      ...createInitialState(2),
      stage: 50,
      mine: { floor: 1, lastClaimAt: 1_000 },
    } satisfies EngineState
    const preview = getMineClaimPreview(state, 1_000 + 24 * 60 * 60 * 1_000)
    const claimed = claimMine(state, 1_000 + 24 * 60 * 60 * 1_000)

    expect(preview.floor).toBe(4)
    expect(preview.elapsedMs).toBe(12 * 60 * 60 * 1_000)
    expect(claimed.mine.floor).toBe(4)
    expect(claimed.mine.lastClaimAt).toBe(1_000 + 24 * 60 * 60 * 1_000)
    expect(claimed.manaCrystals).toBe(preview.manaCrystals)
  })
})

describe("daily missions", () => {
  it("resets on local date change, tracks progress, and pays mana crystals once", () => {
    const date = new Date(2026, 6, 3, 9)
    const reset = syncDailyMissions(createInitialState(3), date)
    const progressed = recordDailyProgress(reset, "merge20", 20, date)
    const claimed = claimDailyMission(progressed, "merge20", date)
    const secondClaim = claimDailyMission(claimed, "merge20", date)
    const nextDay = syncDailyMissions(secondClaim, new Date(2026, 6, 4, 0, 1))
    const mission = DAILY_MISSIONS[0]
    if (mission === undefined) {
      throw new Error("daily mission fixture missing")
    }

    expect(getDailyMissionStatus(progressed, mission, date).claimable).toBe(true)
    expect(claimed.manaCrystals).toBe(mission.rewardManaCrystals)
    expect(secondClaim.manaCrystals).toBe(claimed.manaCrystals)
    expect(nextDay.dailyMissions.date).toBe("2026-07-04")
    expect(nextDay.dailyMissions.progress).toEqual({})
    expect(nextDay.dailyMissions.claimed).toEqual([])
  })
})

describe("wizard skins", () => {
  it("unlocks skins from counters and equips only owned skins", () => {
    const state = {
      ...createInitialState(4),
      prestigeCount: 3,
      achievements: { counters: { bossKills: 25, achievementMilestones: 15 }, claimed: [] },
    } satisfies EngineState

    const unlocked = getUnlockedSkins(state)
    const equipped = equipSkin(state, "gilded")
    const blocked = equipSkin(state, "missing")

    expect(unlocked.map((skin) => skin.id)).toEqual(["apprentice", "ember", "frost", "gilded"])
    expect(equipped.skins.equipped).toBe("gilded")
    expect(blocked.skins.equipped).toBe("apprentice")
  })

  it("falls back to stage and prestige milestones when achievement counters are absent", () => {
    const state = {
      ...createInitialState(5),
      stage: 50,
      prestigeCount: 3,
    } satisfies EngineState

    expect(getUnlockedSkins(state).map((skin) => skin.id)).toContain("gilded")
  })
})
