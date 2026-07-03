import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState } from "../engine/types"
import { getVisibleTabs, getVisibleTabDotCount, tabShowsDot } from "./tabs"
import { useBadges } from "./useBadges"

describe("R1 tab visibility", () => {
  it("shows one tab and zero red dots on a fresh save", () => {
    const state = createInitialState(1)
    const badges = useBadges(state)

    expect(getVisibleTabs(state).map((tab) => tab.id)).toEqual(["books"])
    expect(getVisibleTabDotCount(state, badges)).toBe(0)
  })

  it("reveals tabs at their unlock thresholds", () => {
    const state = {
      ...createInitialState(1),
      wizardLevel: 3,
      highestStage: 10,
      prestigeCount: 1,
    } satisfies EngineState

    expect(getVisibleTabs(state).map((tab) => tab.id)).toEqual(["books", "skills", "quests", "camp", "rebirth", "ranks"])
  })

  it("does not show dots for hidden features", () => {
    const state = {
      ...createInitialState(1),
      skillPoints: 1,
      highestStage: 1,
    } satisfies EngineState

    expect(getVisibleTabs(state).map((tab) => tab.id)).toEqual(["books"])
    expect(tabShowsDot("skills", state, useBadges(state))).toBe(false)
  })
})
