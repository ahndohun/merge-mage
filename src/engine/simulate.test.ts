import { describe, expect, it } from "vitest"
import { runBalanceSimulation } from "./simulate.js"

describe("balance simulator", () => {
  it("runs a 60 minute greedy simulation to at least stage three", () => {
    const result = runBalanceSimulation({ minutes: 60, seed: 123 })
    const lastRow = result.rows.at(-1)

    expect(lastRow?.stage).toBeGreaterThanOrEqual(3)
    expect(result.rows).toHaveLength(6)
  }, 10_000)
})
