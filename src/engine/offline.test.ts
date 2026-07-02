import { describe, expect, it } from "vitest"
import { computeOfflineGold } from "./offline"
import { createInitialState } from "./state"

describe("computeOfflineGold", () => {
  it("uses recent gold per second with an eight hour cap and 0.6 factor", () => {
    const state = {
      ...createInitialState(1),
      lastSeenServerTs: 0,
      recentGoldPerSecond: 10,
    }

    const gold = computeOfflineGold(state, 10 * 60 * 60 * 1_000)

    expect(gold).toBe(10 * 8 * 60 * 60 * 0.6)
  })

  it("returns zero when there is no previous server timestamp", () => {
    const state = { ...createInitialState(1), recentGoldPerSecond: 10 }

    expect(computeOfflineGold(state, 1_000)).toBe(0)
  })
})
