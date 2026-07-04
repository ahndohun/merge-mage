import { describe, expect, it } from "vitest"
import {
  InsufficientManaCrystalsError,
  PromotionError,
  SchoolRespecError,
  getPromotionStatus,
  getSchoolRespecCost,
  promoteClass,
  respecSchool,
} from "./actions.js"
import { bookDamage, simulateTicks } from "./battle.js"
import { BOSS_ENRAGE_MS, BOSS_WAVE } from "./constants.js"
import { getResonance } from "./resonance.js"
import {
  getAbsoluteZeroExecute,
  getFrostBuildupMultiplier,
  getInfernoMultiplier,
  getJudgmentGoldMultiplier,
  getSanctuaryMultiplier,
} from "./school.js"
import { createInitialState, type EngineState } from "./state.js"
import type { School, Spellbook } from "./types.js"

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

function withSchool(rank: 1 | 2, school: School): EngineState {
  return {
    ...createInitialState(11),
    ascension: { rank, school, schoolRespecs: 0 },
  }
}

describe("class promotion", () => {
  it("requires gates, requires a school at rank one, carries school to rank two, and grants skins", () => {
    const apprentice = createInitialState(1)
    const eligibleRankOne = { ...apprentice, prestigeCount: 4, wizardLevel: 50 } satisfies EngineState
    const eligibleRankTwo = {
      ...eligibleRankOne,
      prestigeCount: 14,
      wizardLevel: 100,
      highestStage: 60,
      ascension: { rank: 1, school: "fire", schoolRespecs: 0 },
      skins: { owned: ["apprentice", "ember"], equipped: "ember" },
    } satisfies EngineState

    const rankOne = promoteClass(eligibleRankOne, "fire")
    const rankTwo = promoteClass(eligibleRankTwo)

    expect(getPromotionStatus(apprentice)).toEqual({
      nextRank: 1,
      eligible: false,
      progress: {
        prestige: { current: 0, required: 1 },
        level: { current: 1, required: 12 },
      },
    })
    expect(() => promoteClass(apprentice, "fire")).toThrow(PromotionError)
    expect(() => promoteClass(eligibleRankOne)).toThrow(PromotionError)
    expect(rankOne.ascension).toEqual({ rank: 1, school: "fire", schoolRespecs: 0 })
    expect(rankOne.skins).toEqual({ owned: ["apprentice", "ember"], equipped: "ember" })
    expect(rankTwo.ascension).toEqual({ rank: 2, school: "fire", schoolRespecs: 0 })
    expect(rankTwo.skins).toEqual({ owned: ["apprentice", "ember", "archmagePyro"], equipped: "archmagePyro" })

    // 손상·위조 세이브로 rank1·school=null이 새어 들어와도 대마법사 승계를 막는다.
    const brokenRankOne = { ...eligibleRankTwo, ascension: { rank: 1, school: null, schoolRespecs: 0 } } satisfies EngineState
    expect(() => promoteClass(brokenRankOne)).toThrow(PromotionError)
  })

  it("reports promotion progress for rank zero, rank one, and max rank", () => {
    const rankOne = {
      ...createInitialState(2),
      prestigeCount: 2,
      wizardLevel: 20,
      highestStage: 15,
      ascension: { rank: 1, school: "frost", schoolRespecs: 0 },
    } satisfies EngineState
    const rankTwo = { ...rankOne, ascension: { rank: 2, school: "frost", schoolRespecs: 0 } } satisfies EngineState

    expect(getPromotionStatus(rankOne)).toEqual({
      nextRank: 2,
      eligible: false,
      progress: {
        prestige: { current: 2, required: 4 },
        level: { current: 20, required: 30 },
        stage: { current: 15, required: 20 },
      },
    })
    expect(getPromotionStatus(rankTwo)).toEqual({ nextRank: null, eligible: false, progress: null })
  })
})

describe("school respec", () => {
  it("uses free, 25, then 50 crystal costs without consuming arcane respec credits", () => {
    const base = {
      ...withSchool(1, "fire"),
      manaCrystals: 75,
      traits: { picks: { arcane1: "goldenLibrary", __respecPrestige: "1" } },
      prestigeCount: 1,
    } satisfies EngineState
    const free = respecSchool(base, "frost")
    const paid = respecSchool(free, "holy")
    const capped = respecSchool(paid, "fire")
    const creditedNoMana = { ...base, manaCrystals: 0, ascension: { rank: 1, school: "fire", schoolRespecs: 1 } } satisfies EngineState

    expect(getSchoolRespecCost(0)).toBe(0)
    expect(getSchoolRespecCost(1)).toBe(25)
    expect(getSchoolRespecCost(2)).toBe(50)
    expect(free.manaCrystals).toBe(75)
    expect(free.ascension).toEqual({ rank: 1, school: "frost", schoolRespecs: 1 })
    expect(free.skins.equipped).toBe("frost")
    expect(paid.manaCrystals).toBe(50)
    expect(paid.ascension.schoolRespecs).toBe(2)
    expect(capped.manaCrystals).toBe(0)
    expect(capped.ascension.schoolRespecs).toBe(3)
    expect(() => respecSchool(creditedNoMana, "holy")).toThrow(InsufficientManaCrystalsError)
    expect(() => respecSchool(createInitialState(3), "fire")).toThrow(SchoolRespecError)
    // 같은 학파를 다시 골라도(모달 기본 선택 그대로 확정) 크리스탈을 태우지 않고 거부한다.
    expect(() => respecSchool(base, "fire")).toThrow(SchoolRespecError)
  })
})

describe("school passives", () => {
  it("lowers resonance only for the selected school element", () => {
    const fireSchool = {
      ...withSchool(1, "fire"),
      equipped: [book("f1", 1, "fire"), book("f2", 1, "fire"), null, null, null, null],
    } satisfies EngineState
    const offSchool = {
      ...withSchool(1, "fire"),
      equipped: [book("h1", 1, "holy"), book("h2", 1, "holy"), null, null, null, null],
    } satisfies EngineState

    expect(getResonance(fireSchool).fire.active).toBe(true)
    expect(getResonance(fireSchool).fire.targetCap).toBeGreaterThan(getResonance(createInitialState(4)).fire.targetCap)
    expect(getResonance(offSchool).holy.active).toBe(false)
  })

  it("applies fire damage, chain ignition splash, and inferno timing", () => {
    const base = createInitialState(5)
    const fireSchool = {
      ...withSchool(1, "fire"),
      equipped: [book("splash", 12, "fire"), null, null, null, null, null],
      enemiesHp: [10_000, 10_000, 10_000, 10_000, 10_000],
      stageHp: 50_000,
    } satisfies EngineState

    const plainDamage = bookDamage(book("plain", 10, "fire"), 0, base)
    const schoolDamage = bookDamage(book("school", 10, "fire"), 0, withSchool(1, "fire"))
    const splashed = simulateTicks(fireSchool, 10)
    const castEvent = splashed.events.find((event) => event.type === "cast")
    if (castEvent === undefined || castEvent.type !== "cast") {
      throw new Error("expected fire cast event")
    }

    expect(schoolDamage.damage).toBeCloseTo(plainDamage.damage * 1.2)
    expect(splashed.state.enemiesHp[4]).toBeCloseTo(10_000 - castEvent.damage * 0.2)
    expect(getInfernoMultiplier({ ...withSchool(2, "fire"), wave: BOSS_WAVE, bossElapsedMs: BOSS_ENRAGE_MS })).toBe(2)
  })

  it("applies frost buildup and absolute-zero execute passives", () => {
    expect(getFrostBuildupMultiplier({ ...withSchool(1, "frost"), frostSlowMs: 100 })).toBe(1.15)
    expect(getFrostBuildupMultiplier({ ...withSchool(1, "frost"), frostSlowMs: 0 })).toBe(1)
    expect(getAbsoluteZeroExecute({ ...withSchool(2, "frost"), wave: 1 })).toBe(0.2)
    expect(getAbsoluteZeroExecute({ ...withSchool(2, "frost"), wave: BOSS_WAVE })).toBe(0)
  })

  it("applies holy judgment gold and sanctuary passives", () => {
    expect(getJudgmentGoldMultiplier(withSchool(1, "holy"))).toBe(1.25)
    expect(getSanctuaryMultiplier({ ...withSchool(2, "holy"), prestigeCount: 1, stage: 1 })).toBe(2)
    expect(getSanctuaryMultiplier({ ...withSchool(2, "holy"), prestigeCount: 1, stage: 2 })).toBe(1)
  })
})
