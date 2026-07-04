import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { summonBook } from "../engine/actions"
import { createInitialState } from "../engine/state"
import { JourneyPanel } from "./JourneyPanel"

describe("JourneyPanel", () => {
  it("renders the active chain quest, claim button, and achievement grid", () => {
    const state = summonBook({ ...createInitialState(1), gold: 1_000 })

    const markup = renderToStaticMarkup(
      <JourneyPanel state={state} onClaimQuest={() => false} onClaimDailyMission={() => false} />,
    )

    expect(markup).toContain("Bind the First Tome")
    expect(markup).toContain("data-testid=\"quest-claim-chain-01\"")
    expect(markup).toContain("ACHIEVEMENTS")
    expect(markup).toContain("data-testid=\"achievement-mergesTotal-10\"")
  })

  it("includes the daily missions moved from the camp tab", () => {
    const markup = renderToStaticMarkup(
      <JourneyPanel state={createInitialState(1)} onClaimQuest={() => false} onClaimDailyMission={() => false} />,
    )

    expect(markup).toContain("data-testid=\"camp-daily-card\"")
    expect(markup).toContain("data-testid=\"daily-merge20\"")
  })
})
