import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { summonBook } from "../engine/actions"
import { createInitialState } from "../engine/state"
import { QuestsPanel } from "./QuestsPanel"

describe("QuestsPanel", () => {
  it("renders the active chain quest, claim button, and achievement grid", () => {
    const state = summonBook({ ...createInitialState(1), gold: 1_000 })

    const markup = renderToStaticMarkup(<QuestsPanel state={state} onClaimQuest={() => false} />)

    expect(markup).toContain("Bind the First Tome")
    expect(markup).toContain("data-testid=\"quest-claim-chain-01\"")
    expect(markup).toContain("ACHIEVEMENTS")
    expect(markup).toContain("data-testid=\"achievement-mergesTotal-10\"")
  })
})
