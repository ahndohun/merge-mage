// @vitest-environment happy-dom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import type { EngineState, School } from "../engine/types"
import { WizardPanel } from "./WizardPanel"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

type Handlers = {
  readonly onPromoteClass?: (school?: School) => boolean
  readonly onRespecSchool?: (school: School) => boolean
}

function panelElement(state: EngineState, handlers: Handlers = {}) {
  return (
    <WizardPanel
      onAllocateSkill={() => undefined}
      onPromoteClass={handlers.onPromoteClass ?? (() => false)}
      onRespecSchool={handlers.onRespecSchool ?? (() => false)}
      onResetSkills={() => undefined}
      onSelectTrait={() => false}
      state={state}
    />
  )
}

function renderMarkup(state: EngineState, handlers: Handlers = {}): string {
  return renderToStaticMarkup(panelElement(state, handlers))
}

let mountedRoot: Root | null = null
let mountedHost: HTMLDivElement | null = null

function renderInteractive(state: EngineState, handlers: Handlers = {}): HTMLElement {
  const host = document.createElement("div")
  document.body.append(host)
  const root = createRoot(host)
  mountedHost = host
  mountedRoot = root

  act(() => {
    root.render(panelElement(state, handlers))
  })

  return host
}

function getByTestId(host: HTMLElement, testId: string): HTMLElement {
  const element = host.querySelector(`[data-testid="${testId}"]`)
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing element with data-testid="${testId}"`)
  }
  return element
}

function queryByTestId(host: HTMLElement, testId: string): HTMLElement | null {
  return host.querySelector(`[data-testid="${testId}"]`)
}

function adeptState(overrides: Partial<EngineState> = {}): EngineState {
  return {
    ...createInitialState(1),
    ascension: { rank: 1, school: "fire", schoolRespecs: 0 },
    ...overrides,
  } satisfies EngineState
}

afterEach(() => {
  if (mountedRoot !== null) {
    act(() => mountedRoot?.unmount())
  }
  mountedHost?.remove()
  mountedRoot = null
  mountedHost = null
})

describe("WizardPanel", () => {
  describe("skills (unchanged behavior)", () => {
    it("shows the per-point effect and base values when no points are allocated", () => {
      const markup = renderMarkup(createInitialState(1))

      expect(markup).toContain("+1 buy level / pt (+0)")
      expect(markup).toContain("-40ms cast / pt (now 1000ms)")
      expect(markup).toContain("+10% gold / pt (+0%)")
      expect(markup).toContain("+1% crit / pt (5%)")
    })

    it("reflects allocated points in the current-effect readout", () => {
      const state = {
        ...createInitialState(1),
        skills: { summonBonus: 2, castSpeed: 3, goldGain: 4, critChance: 5 },
      } satisfies EngineState

      const markup = renderMarkup(state)

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

      const markup = renderMarkup(state)

      expect(markup).toContain("now 300ms")
    })

    it("includes the resonance summary and codex moved from the books tab", () => {
      const markup = renderMarkup(createInitialState(1))

      expect(markup).toContain('data-testid="resonance-row"')
      expect(markup).toContain('data-testid="codex-grid"')
    })
  })

  describe("identity header", () => {
    it("renders the apprentice identity with no school for a fresh wizard", () => {
      const markup = renderMarkup(createInitialState(1))

      expect(markup).toContain('data-testid="identity-header"')
      expect(markup).toContain("Apprentice")
      expect(markup).toContain("No school yet")
    })

    it("renders class x school identity once promoted", () => {
      const markup = renderMarkup(adeptState())

      expect(markup).toContain('data-testid="identity-header"')
      expect(markup).toContain("Adept")
      expect(markup).toContain("Fire School")
    })
  })

  describe("promotion card", () => {
    it("shows locked progress (no CTA) when the apprentice has not met the rank1 gate", () => {
      const markup = renderMarkup(createInitialState(1))

      expect(markup).toContain('data-testid="promote-card"')
      expect(markup).not.toContain('data-testid="promote-btn"')
      expect(markup).toContain("Rebirth 0/1")
      expect(markup).toContain("Lv 1/12")
    })

    it("shows an enabled CTA once rank1 is eligible", () => {
      const state = { ...createInitialState(1), prestigeCount: 1, wizardLevel: 12 } satisfies EngineState

      const markup = renderMarkup(state)

      expect(markup).toContain('data-testid="promote-btn"')
      expect(markup).toContain("Ascend to Adept")
    })

    it("shows the archmage CTA once rank2 is eligible", () => {
      const state = adeptState({ prestigeCount: 4, wizardLevel: 30, highestStage: 20 })

      const markup = renderMarkup(state)

      expect(markup).toContain('data-testid="promote-btn"')
      expect(markup).toContain("Ascend to Archmage")
      expect(markup).toContain("Stage")
    })

    it("shows the max-rank label with no CTA once archmage", () => {
      const state = { ...adeptState(), ascension: { rank: 2 as const, school: "fire" as const, schoolRespecs: 0 } } satisfies EngineState

      const markup = renderMarkup(state)

      expect(markup).toContain("MAX CLASS")
      expect(markup).not.toContain('data-testid="promote-btn"')
    })
  })

  describe("school respec button", () => {
    it("is hidden for an apprentice", () => {
      const markup = renderMarkup(createInitialState(1))

      expect(markup).not.toContain('data-testid="school-respec-btn"')
    })

    it("is shown once promoted to adept, showing the free first-change cost", () => {
      const markup = renderMarkup(adeptState())

      expect(markup).toContain('data-testid="school-respec-btn"')
      expect(markup).toContain("FREE")
    })

    it("shows a mana-crystal cost after the free respec has been used", () => {
      const markup = renderMarkup(adeptState({ ascension: { rank: 1, school: "fire", schoolRespecs: 1 } }))

      expect(markup).toContain("25")
    })
  })

  describe("arcane trait slots (rank-gated)", () => {
    it("locks all slots for an apprentice", () => {
      const host = renderInteractive(createInitialState(1))

      expect(getByTestId(host, "trait-arcane1-chainCast")).toHaveProperty("disabled", true)
      expect(getByTestId(host, "trait-arcane2-quickHands")).toHaveProperty("disabled", true)
      expect(getByTestId(host, "trait-arcane3-archmageFocus")).toHaveProperty("disabled", true)
    })

    it("unlocks arcane1/arcane2 but keeps arcane3 locked for an adept", () => {
      const host = renderInteractive(adeptState())

      expect(getByTestId(host, "trait-arcane1-chainCast")).toHaveProperty("disabled", false)
      expect(getByTestId(host, "trait-arcane2-quickHands")).toHaveProperty("disabled", false)
      expect(getByTestId(host, "trait-arcane3-archmageFocus")).toHaveProperty("disabled", true)
    })

    it("unlocks arcane3 for an archmage", () => {
      const state = { ...adeptState(), ascension: { rank: 2 as const, school: "fire" as const, schoolRespecs: 0 } } satisfies EngineState
      const host = renderInteractive(state)

      expect(getByTestId(host, "trait-arcane3-archmageFocus")).toHaveProperty("disabled", false)
    })
  })

  describe("school modal", () => {
    it("opens with the three school cards when the promote CTA is clicked (apprentice -> adept)", () => {
      const state = { ...createInitialState(1), prestigeCount: 1, wizardLevel: 12 } satisfies EngineState
      const host = renderInteractive(state)

      expect(queryByTestId(host, "school-modal")).toBeNull()

      act(() => {
        getByTestId(host, "promote-btn").click()
      })

      expect(queryByTestId(host, "school-modal")).not.toBeNull()
      expect(getByTestId(host, "school-card-fire")).toBeTruthy()
      expect(getByTestId(host, "school-card-frost")).toBeTruthy()
      expect(getByTestId(host, "school-card-holy")).toBeTruthy()
    })

    it("does not open a school picker for rank1 -> rank2 (school carries over)", () => {
      const state = adeptState({ prestigeCount: 4, wizardLevel: 30, highestStage: 20 })
      let promoted: (School | undefined)[] = []
      const host = renderInteractive(state, {
        onPromoteClass: (school) => {
          promoted.push(school)
          return true
        },
      })

      act(() => {
        getByTestId(host, "promote-btn").click()
      })

      expect(queryByTestId(host, "school-modal")).toBeNull()
      expect(promoted).toEqual([undefined])
    })

    it("selects a school card and confirms, calling onPromoteClass with the chosen school", () => {
      const state = { ...createInitialState(1), prestigeCount: 1, wizardLevel: 12 } satisfies EngineState
      const promoted: (School | undefined)[] = []
      const host = renderInteractive(state, {
        onPromoteClass: (school) => {
          promoted.push(school)
          return true
        },
      })

      act(() => {
        getByTestId(host, "promote-btn").click()
      })
      act(() => {
        getByTestId(host, "school-card-frost").click()
      })
      act(() => {
        getByTestId(host, "school-confirm").click()
      })

      expect(promoted).toEqual(["frost"])
      expect(queryByTestId(host, "school-modal")).toBeNull()
    })

    it("keeps the modal open when the engine rejects the promotion", () => {
      const state = { ...createInitialState(1), prestigeCount: 1, wizardLevel: 12 } satisfies EngineState
      const host = renderInteractive(state, { onPromoteClass: () => false })

      act(() => {
        getByTestId(host, "promote-btn").click()
      })
      act(() => {
        getByTestId(host, "school-card-fire").click()
      })
      act(() => {
        getByTestId(host, "school-confirm").click()
      })

      expect(queryByTestId(host, "school-modal")).not.toBeNull()
    })

    it("closes on cancel without calling onPromoteClass", () => {
      const state = { ...createInitialState(1), prestigeCount: 1, wizardLevel: 12 } satisfies EngineState
      let promoteCalls = 0
      const host = renderInteractive(state, {
        onPromoteClass: () => {
          promoteCalls += 1
          return true
        },
      })

      act(() => {
        getByTestId(host, "promote-btn").click()
      })
      act(() => {
        host.querySelector(".school-modal .modal-actions .btn:not([data-testid])")?.dispatchEvent(
          new MouseEvent("click", { bubbles: true }),
        )
      })

      expect(promoteCalls).toBe(0)
      expect(queryByTestId(host, "school-modal")).toBeNull()
    })

    it("opens in respec mode from the school-respec button and calls onRespecSchool on confirm", () => {
      const respecked: School[] = []
      const host = renderInteractive(adeptState(), {
        onRespecSchool: (school) => {
          respecked.push(school)
          return true
        },
      })

      act(() => {
        getByTestId(host, "school-respec-btn").click()
      })

      expect(queryByTestId(host, "school-modal")).not.toBeNull()

      act(() => {
        getByTestId(host, "school-card-holy").click()
      })
      act(() => {
        getByTestId(host, "school-confirm").click()
      })

      expect(respecked).toEqual(["holy"])
      expect(queryByTestId(host, "school-modal")).toBeNull()
    })
  })
})
