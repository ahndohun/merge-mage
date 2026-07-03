import { describe, expect, it } from "vitest"
import { formatSimulation, formatSimulationSummary, runBalanceSimulation } from "./simulate.js"

describe("balance simulator", () => {
  it("keeps the 60 minute greedy curve stable when sampled every five minutes", () => {
    // Given: the v2 greedy simulator baseline sampled at the public CLI cadence.
    const result = runBalanceSimulation({ minutes: 60, seed: 1 })

    // When: callers inspect the sampled balance rows.
    const rows = result.rows.map((row) => ({
      minute: row.minute,
      stage: row.stage,
      highestBookLevel: row.highestBookLevel,
      gold: Math.floor(row.gold),
      summonFloor: row.summonFloor,
    }))

    // Then: the gameplay curve remains identical to the pre-extension baseline.
    expect(result.rows).toHaveLength(6)
    expect(rows).toEqual([
      { minute: 10, stage: 11, highestBookLevel: 9, gold: 58, summonFloor: 1 },
      { minute: 20, stage: 12, highestBookLevel: 10, gold: 1, summonFloor: 2 },
      { minute: 30, stage: 13, highestBookLevel: 11, gold: 86, summonFloor: 3 },
      { minute: 40, stage: 15, highestBookLevel: 13, gold: 4, summonFloor: 5 },
      { minute: 50, stage: 16, highestBookLevel: 14, gold: 73, summonFloor: 6 },
      { minute: 60, stage: 17, highestBookLevel: 15, gold: 219, summonFloor: 7 },
    ])
  }, 10_000)

  it("prints wall strength as a sampled table column", () => {
    // Given: a short simulation with enough purchases to form power-up intervals.
    const result = runBalanceSimulation({ minutes: 60, rowMinutes: 5, seed: 1 })

    // When: the table is formatted.
    const formatted = formatSimulation(result)

    // Then: wall strength is visible and formatted to one decimal place.
    expect(formatted.split("\n")[0]).toContain("wall")
    expect(formatted).toContain(" 0.0 ")
  }, 10_000)

  it("summarizes only milestone events and final state", () => {
    // Given: a one-day simulation.
    const result = runBalanceSimulation({ minutes: 1_440, seed: 1 })

    // When: callers request summary output.
    const summary = formatSimulationSummary(result)

    // Then: the output omits the table and includes milestone-only lines.
    expect(summary).toContain("first prestige")
    expect(summary).toContain("stage 10")
    expect(summary).toContain("final")
    expect(summary).not.toContain("minute | stage")
  }, 10_000)

  it("applies constant overrides through the simulator config without mutating engine modules", () => {
    // Given: a baseline and a harder HP growth experiment.
    const baseline = runBalanceSimulation({ minutes: 60, seed: 1 })

    // When: HP_GROWTH is overridden only for the simulator run.
    const harder = runBalanceSimulation({ minutes: 60, seed: 1, overrides: { HP_GROWTH: 1.5 } })

    // Then: the experiment changes simulated progress without touching shared constants.
    expect(harder.finalState.stage).toBeLessThan(baseline.finalState.stage)
  }, 10_000)
})
