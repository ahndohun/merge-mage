import { describe, expect, it } from "vitest"
import { SUMMON_COST_BASE, SUMMON_COST_GROWTH } from "./constants.js"
import { MergeLevelMismatchError, mergeSpellbooks } from "./merge.js"
import { getSummonCost, getSummonLevel } from "./summon.js"
import type { Spellbook } from "./types.js"

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

  it("keeps the anchor (left/target) book's element deterministically", () => {
    const left: Spellbook = { id: "left", level: 4, element: "fire" }
    const right: Spellbook = { id: "right", level: 4, element: "holy" }

    expect(mergeSpellbooks(left, right, () => 0.01).element).toBe("fire")
    expect(mergeSpellbooks(right, left, () => 0.99).element).toBe("holy")
  })

  it("rejects different levels", () => {
    const left: Spellbook = { id: "left", level: 4, element: "fire" }
    const right: Spellbook = { id: "right", level: 5, element: "frost" }

    expect(() => mergeSpellbooks(left, right, () => 0.8)).toThrow(MergeLevelMismatchError)
  })
})

describe("summon cost", () => {
  it("charges the ceil of base times growth so the displayed cost equals the charge", () => {
    const summonLevel = 4

    const cost = getSummonCost(summonLevel)

    expect(cost).toBe(Math.ceil(SUMMON_COST_BASE * SUMMON_COST_GROWTH ** summonLevel))
    expect(Number.isInteger(cost)).toBe(true)
  })
})
