import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { HelpModal } from "./HelpModal"

function render(): string {
  return renderToStaticMarkup(<HelpModal onClose={() => undefined} onReplayTutorial={() => undefined} />)
}

describe("HelpModal", () => {
  it("renders the modal with the testable id", () => {
    expect(render()).toContain('data-testid="help-modal"')
  })

  it("explains the core loop", () => {
    const markup = render()
    expect(markup).toContain("SUMMON")
    expect(markup).toContain("AUTO-EQUIP")
    expect(markup).toContain("MERGE same levels (tap-tap)")
    expect(markup).toContain("higher level = more damage")
    expect(markup).toContain("beat the BOSS every 10 waves")
    expect(markup).toContain("REBIRTH at stage 10+ for permanent power")
  })

  it("lists each element and its effect", () => {
    const markup = render()
    expect(markup).toContain("FIRE")
    expect(markup).toContain("hits 3 enemies")
    expect(markup).toContain("FROST")
    expect(markup).toContain("slows")
    expect(markup).toContain("HOLY")
    expect(markup).toContain("x2 vs bosses")
  })

  it("notes merge keeps the target book's element and the offline rule", () => {
    const markup = render()
    expect(markup).toContain("element of the TARGET")
    expect(markup).toContain("up to 8h")
  })

  it("offers a REPLAY TUTORIAL button", () => {
    expect(render()).toContain("REPLAY TUTORIAL")
  })
})
