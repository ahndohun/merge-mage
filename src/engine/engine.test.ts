import { describe, expect, it } from "vitest"
import { SUMMON_COST_BASE, SUMMON_COST_GROWTH } from "./constants"
import { MergeLevelMismatchError, mergeSpellbooks } from "./merge"
import { getSummonCost, getSummonLevel } from "./summon"
import type { Spellbook } from "./types"

describe("summon floor rule", () => {
  it("returns max one when highest level is inside the floor gap", () => {
    const highestLevel = 7

    const summonLevel = getSummonLevel(highestLevel)

    expect(summonLevel).toBe(1)
  })

  it("subtracts the floor gap when highest level exceeds the floor gap", () => {
    const highestLevel = 13

    const summonLevel = getSummonLevel(highestLevel)

    expect(summonLevel).toBe(5)
  })
})

describe("merge spellbooks", () => {
  it("raises the level by exactly one when levels match", () => {
    const left: Spellbook = { id: "left", level: 4, element: "fire" }
    const right: Spellbook = { id: "right", level: 4, element: "holy" }

    const merged = mergeSpellbooks(left, right, () => 0.2)

    expect(merged.level).toBe(5)
  })

  it("rejects different levels", () => {
    const left: Spellbook = { id: "left", level: 4, element: "fire" }
    const right: Spellbook = { id: "right", level: 5, element: "frost" }

    expect(() => mergeSpellbooks(left, right, () => 0.8)).toThrow(MergeLevelMismatchError)
  })
})

describe("summon cost", () => {
  it("uses base times growth raised to the summon level", () => {
    const summonLevel = 4

    const cost = getSummonCost(summonLevel)

    expect(cost).toBeCloseTo(SUMMON_COST_BASE * SUMMON_COST_GROWTH ** summonLevel)
  })
})
