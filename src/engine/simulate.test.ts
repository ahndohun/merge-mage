import { describe, expect, it } from "vitest"
import { formatSimulation, formatSimulationSummary, runBalanceSimulation } from "./simulate.js"

describe("balance simulator", () => {
  it("proves the Wave C first wall and first rebirth timing", () => {
    // Given: the Wave C greedy simulator sampled at the public proof cadence.
    const result = runBalanceSimulation({ minutes: 60, rowMinutes: 5, seed: 1 })

    // When: callers inspect the first-hour curve.
    const stageTen = result.summary.stageBreakthroughs.find((event) => event.stage === 10)

    // Then: the first wall and first rebirth sit inside the director range.
    expect(result.rows).toHaveLength(12)
    expect(result.summary.firstWallMinute).toBeGreaterThanOrEqual(8)
    expect(result.summary.firstWallMinute).toBeLessThanOrEqual(12)
    expect(result.summary.firstPrestigeMinute).toBeGreaterThanOrEqual(25)
    expect(result.summary.firstPrestigeMinute).toBeLessThanOrEqual(35)
    expect(stageTen?.minute).toBeLessThanOrEqual(21)
  }, 10_000)

  it("keeps Day 1 progress in the requested stage band", () => {
    // Given: a one-day Wave C simulation with meta systems enabled.
    const result = runBalanceSimulation({ minutes: 1_440, seed: 1 })

    // When: the true peak stage is inspected across the whole run.
    const maxStageEver = result.maxStageEver

    // Then: Day 1 is slower than v2 and remains within the target band.
    // R5: promotion/schools are a specialization reward, so Day 1 runs a touch
    // hotter than the pre-ascension R1 curve — band relaxed 50→60 (director call
    // 2026-07-04). The real ceiling stays the Day-7 uncleared cap below.
    expect(maxStageEver).toBeGreaterThanOrEqual(35)
    expect(maxStageEver).toBeLessThanOrEqual(60)
  }, 10_000)

  it("keeps the seven-day highest tome below the level 100 cap", () => {
    // Given: a seven-day long-mode simulation.
    const result = runBalanceSimulation({ minutes: 10_080, seed: 1 })

    // When: the true strongest owned or equipped tome is inspected across the whole run.
    const maxBookLevelEver = result.maxBookLevelEver

    // Then: the tier cap remains uncleared after a week.
    expect(maxBookLevelEver).toBeLessThan(100)
  }, 30_000)

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
    // Given: a baseline and a harder boss-DPS experiment.
    // Sampled before the first rebirth (~34m) so the stage comparison isn't
    // scrambled by a prestige stage-reset landing inside the window.
    const baseline = runBalanceSimulation({ minutes: 30, seed: 1 })

    // When: boss expected DPS is overridden only for the simulator run.
    const harder = runBalanceSimulation({ minutes: 30, seed: 1, overrides: { BOSS_EXPECTED_DPS_BASE: 100 } })

    // Then: the experiment changes simulated progress without touching shared constants.
    expect(harder.finalState.stage).toBeLessThan(baseline.finalState.stage)
  }, 10_000)
})
