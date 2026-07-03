import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState } from "../engine/types"
import { SkillsPanel } from "./SkillsPanel"

function renderSkillsPanel(state: EngineState): string {
  return renderToStaticMarkup(<SkillsPanel onAllocateSkill={() => undefined} onResetSkills={() => undefined} state={state} />)
}

describe("SkillsPanel", () => {
  it("shows the per-point effect and base values when no points are allocated", () => {
    const state = createInitialState(1)

    const markup = renderSkillsPanel(state)

    expect(markup).toContain("+1 summon level / pt (+0)")
    expect(markup).toContain("-40ms cast / pt (now 1000ms)")
    expect(markup).toContain("+10% gold / pt (+0%)")
    expect(markup).toContain("+1% crit / pt (5%)")
  })

  it("reflects allocated points in the current-effect readout", () => {
    const state = {
      ...createInitialState(1),
      skills: { summonBonus: 2, castSpeed: 3, goldGain: 4, critChance: 5 },
    } satisfies EngineState

    const markup = renderSkillsPanel(state)

    expect(markup).toContain("(+2)")
    expect(markup).toContain("now 880ms")
    expect(markup).toContain("(+40%)")
    expect(markup).toContain("(10%)")
  })

  it("floors the cast interval at the engine minimum", () => {
    const state = {
      ...createInitialState(1),
      skills: { summonBonus: 0, castSpeed: 50, goldGain: 0, critChance: 0 },
    } satisfies EngineState

    const markup = renderSkillsPanel(state)

    expect(markup).toContain("now 300ms")
  })
})
