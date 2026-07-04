// @vitest-environment happy-dom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { enterRift } from "../engine/actions"
import { RIFT_DAILY_LIMIT } from "../engine/constants"
import { createInitialState } from "../engine/state"
import type { EngineState, RiftKind } from "../engine/types"
import { RiftsOverlay } from "./RiftsOverlay"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

type Handlers = {
  readonly justAppeared?: boolean
  readonly onEnterRift?: (kind: RiftKind) => boolean
  readonly onExitRift?: () => boolean
  readonly onClosedTap?: () => void
}

function overlayElement(state: EngineState, handlers: Handlers) {
  return (
    <RiftsOverlay
      justAppeared={handlers.justAppeared ?? false}
      state={state}
      onClosedTap={handlers.onClosedTap ?? (() => undefined)}
      onEnterRift={handlers.onEnterRift ?? (() => true)}
      onExitRift={handlers.onExitRift ?? (() => true)}
    />
  )
}

function renderMarkup(state: EngineState, handlers: Handlers = {}): string {
  return renderToStaticMarkup(overlayElement(state, handlers))
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
    root.render(overlayElement(state, handlers))
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

// .rift-modal is a CSS class (see RiftsOverlay.tsx), not a data-testid.
function queryModal(host: HTMLElement): HTMLElement | null {
  return host.querySelector(".rift-modal")
}

function exhaustedRuns(): EngineState {
  return {
    ...createInitialState(1),
    riftRuns: { date: "", golden: RIFT_DAILY_LIMIT, trial: RIFT_DAILY_LIMIT },
  } satisfies EngineState
}

afterEach(() => {
  if (mountedRoot !== null) {
    act(() => mountedRoot?.unmount())
  }
  mountedHost?.remove()
  mountedRoot = null
  mountedHost = null
  vi.useRealTimers()
})

describe("RiftsOverlay", () => {
  describe("appearance", () => {
    it("shows the portal with the combined golden+trial runs-left badge when no rift is active", () => {
      const markup = renderMarkup(createInitialState(1))

      expect(markup).toContain('data-testid="rifts-open-btn"')
      expect(markup).not.toContain('data-testid="rift-active-hud"')
      expect(markup).toContain('class="rift-portal-count">4<')
    })

    it("shows the active HUD instead of the portal once a rift is entered", () => {
      const state = enterRift(createInitialState(1), "golden", "2026-07-04")

      const markup = renderMarkup(state)

      expect(markup).toContain('data-testid="rift-active-hud"')
      expect(markup).not.toContain('data-testid="rifts-open-btn"')
    })

    it("plays the one-time appearance animation only when justAppeared is true", () => {
      const state = createInitialState(1)

      expect(renderMarkup(state, { justAppeared: true })).toContain("is-appearing")
      expect(renderMarkup(state, { justAppeared: false })).not.toContain("is-appearing")
    })
  })

  describe("closed portal (daily runs exhausted)", () => {
    it("marks the portal closed once both golden and trial runs are used up for the day", () => {
      const markup = renderMarkup(exhaustedRuns())

      expect(markup).toContain('data-testid="rifts-open-btn"')
      expect(markup).toContain("is-closed")
      expect(markup).toContain('aria-disabled="true"')
    })

    it("stays open while at least one rift kind still has a run left", () => {
      const state = { ...createInitialState(1), riftRuns: { date: "", golden: RIFT_DAILY_LIMIT, trial: 0 } } satisfies EngineState

      const markup = renderMarkup(state)

      expect(markup).not.toContain("is-closed")
    })

    it("reports a closed-portal tap without opening the golden/trial modal", () => {
      let closedTaps = 0
      const host = renderInteractive(exhaustedRuns(), {
        onClosedTap: () => {
          closedTaps += 1
        },
      })

      act(() => {
        getByTestId(host, "rifts-open-btn").click()
      })

      expect(closedTaps).toBe(1)
      expect(queryModal(host)).toBeNull()
    })
  })

  describe("entry flow", () => {
    it("opens the golden/trial picker modal on tap when runs remain", () => {
      const host = renderInteractive(createInitialState(1))

      expect(queryModal(host)).toBeNull()

      act(() => {
        getByTestId(host, "rifts-open-btn").click()
      })

      expect(queryModal(host)).not.toBeNull()
    })

    it("closes the picker on cancel", () => {
      const host = renderInteractive(createInitialState(1))

      act(() => {
        getByTestId(host, "rifts-open-btn").click()
      })
      act(() => {
        getByTestId(host, "rifts-close-btn").click()
      })

      expect(queryModal(host)).toBeNull()
    })

    it("enters the selected rift, closes the modal, and plays a self-clearing warp flash", () => {
      vi.useFakeTimers()
      const entered: RiftKind[] = []
      const host = renderInteractive(createInitialState(1), {
        onEnterRift: (kind) => {
          entered.push(kind)
          return true
        },
      })

      act(() => {
        getByTestId(host, "rifts-open-btn").click()
      })
      const enterButtons = host.querySelectorAll(".rift-card button")
      act(() => {
        ;(enterButtons[0] as HTMLElement).click()
      })

      expect(entered).toEqual(["golden"])
      expect(queryModal(host)).toBeNull()
      const flash = queryByTestId(host, "rift-warp-flash")
      expect(flash).not.toBeNull()
      expect(flash?.className).toContain("rift-warp-golden")

      act(() => {
        vi.advanceTimersByTime(1_000)
      })

      expect(queryByTestId(host, "rift-warp-flash")).toBeNull()
    })

    it("keeps the modal open and skips the warp flash when the engine rejects entry", () => {
      const host = renderInteractive(createInitialState(1), { onEnterRift: () => false })

      act(() => {
        getByTestId(host, "rifts-open-btn").click()
      })
      const enterButtons = host.querySelectorAll(".rift-card button")
      act(() => {
        ;(enterButtons[0] as HTMLElement).click()
      })

      expect(queryModal(host)).not.toBeNull()
      expect(queryByTestId(host, "rift-warp-flash")).toBeNull()
    })
  })

  describe("exit flow", () => {
    it("exits an active rift via the HUD exit button and hides the HUD again once inactive", () => {
      const state = enterRift(createInitialState(1), "trial", "2026-07-04")
      let exited = 0
      const host = renderInteractive(state, {
        onExitRift: () => {
          exited += 1
          return true
        },
      })

      act(() => {
        getByTestId(host, "rift-exit-btn").click()
      })

      expect(exited).toBe(1)
    })
  })
})
