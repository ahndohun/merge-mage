// @vitest-environment happy-dom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"
import type { EngineState, Spellbook } from "../engine/types"
import { createInitialState } from "../engine/state"
import { BooksPanel } from "./BooksPanel"
import type { BookSource } from "./bookInteractions"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

function renderBooksPanel(state: EngineState): string {
  return renderToStaticMarkup(
    <BooksPanel
      dragActive={false}
      dragPreview={null}
      draggingBookId={null}
      nextGoalHint={null}
      onBookClick={() => undefined}
      onBookDrop={() => undefined}
      onBookPointerDown={() => undefined}
      onEquipClick={() => undefined}
      onEquipDrop={() => undefined}
      onUpgradeSlot={() => false}
      selected={null}
      state={state}
    />,
  )
}

let mountedRoot: Root | null = null
let mountedHost: HTMLDivElement | null = null

function renderInteractiveBooksPanel(
  state: EngineState,
  handlers: {
    readonly selected?: BookSource | null
    readonly onBookClick?: (source: BookSource, book: Spellbook) => void
    readonly onBookDrop?: (book: Spellbook) => void
    readonly onBookPointerDown?: (source: BookSource) => void
    readonly onEquipClick?: (slotIdx: number, source: BookSource | null) => void
    readonly onEquipDrop?: (slotIdx: number, source: BookSource | null) => void
    readonly onUpgradeSlot?: (slotIdx: number) => boolean
  },
): HTMLElement {
  const host = document.createElement("div")
  document.body.append(host)
  const root = createRoot(host)
  mountedHost = host
  mountedRoot = root

  act(() => {
    root.render(
      <BooksPanel
        dragActive={false}
        dragPreview={null}
        draggingBookId={null}
        nextGoalHint={null}
        onBookClick={handlers.onBookClick ?? (() => undefined)}
        onBookDrop={handlers.onBookDrop ?? (() => undefined)}
        onBookPointerDown={handlers.onBookPointerDown ?? (() => undefined)}
        onEquipClick={handlers.onEquipClick ?? (() => undefined)}
        onEquipDrop={handlers.onEquipDrop ?? (() => undefined)}
        onUpgradeSlot={handlers.onUpgradeSlot ?? (() => false)}
        selected={handlers.selected ?? null}
        state={state}
      />,
    )
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

function dispatchKeyDown(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key })
  element.dispatchEvent(event)
  return event
}

afterEach(() => {
  if (mountedRoot !== null) {
    act(() => mountedRoot?.unmount())
  }
  mountedHost?.remove()
  mountedRoot = null
  mountedHost = null
})

describe("BooksPanel", () => {
  it("collapses the inventory grid when inventory is empty and equipment has space", () => {
    const state = {
      ...createInitialState(1),
      equipped: [book("equipped", 2, "fire"), null, null, null, null, null],
    } satisfies EngineState

    const markup = renderBooksPanel(state)

    expect(markup).toContain("INVENTORY — empty (summons auto-equip)")
    expect(markup).not.toContain("data-testid=\"merge-cell-0\"")
  })

  it("keeps inventory cells rendered when inventory has a book", () => {
    const state = {
      ...createInitialState(1),
      books: [book("inventory", 3, "holy")],
      equipped: [book("equipped", 2, "fire"), null, null, null, null, null],
    } satisfies EngineState

    const markup = renderBooksPanel(state)

    expect(markup).toContain("data-testid=\"merge-cell-0\"")
    expect(markup).not.toContain("summons auto-equip")
  })

  it("keeps inventory cells rendered when equipment is full", () => {
    const state = {
      ...createInitialState(1),
      equipped: [
        book("a", 1, "fire"),
        book("b", 1, "frost"),
        book("c", 1, "holy"),
        book("d", 1, "fire"),
        book("e", 1, "frost"),
        book("f", 1, "holy"),
      ],
    } satisfies EngineState

    const markup = renderBooksPanel(state)

    expect(markup).toContain("data-testid=\"merge-cell-14\"")
  })

  it("shows the upgrade bonus percentage on the slot upgrade button", () => {
    const state = createInitialState(1)

    const markup = renderBooksPanel(state)

    expect(markup).toContain("(+15%)")
  })

  it("shows the current tier multiplier badge only once a slot has been upgraded", () => {
    const upgraded = {
      ...createInitialState(1),
      equipped: [book("a", 1, "fire"), null, null, null, null, null],
      slotTiers: [2, 0, 0, 0, 0, 0] as EngineState["slotTiers"],
    } satisfies EngineState

    const markup = renderBooksPanel(upgraded)

    expect(markup).toContain("x1.30")
  })

  it("omits the tier badge for a book in an un-upgraded slot", () => {
    const state = {
      ...createInitialState(1),
      equipped: [book("a", 1, "fire"), null, null, null, null, null],
    } satisfies EngineState

    const markup = renderBooksPanel(state)

    expect(markup).not.toContain("slot-tier-badge")
  })

  it("selects an equipped book and targets an inventory merge from synthetic clicks", () => {
    const equipped = book("equipped-holy", 1, "holy")
    const inventory = book("inventory-holy", 1, "holy")
    const state = {
      ...createInitialState(1),
      books: [inventory],
      equipped: [equipped, null, null, null, null, null],
    } satisfies EngineState
    let selected: BookSource | null = null
    const targeted: { readonly source: BookSource; readonly target: BookSource }[] = []
    const host = renderInteractiveBooksPanel(state, {
      onBookClick: (source) => {
        if (selected === null) {
          selected = source
          return
        }
        targeted.push({ source: selected, target: source })
      },
      onEquipClick: (_slotIdx, source) => {
        selected = source
      },
    })

    getByTestId(host, "equip-slot-0").click()
    getByTestId(host, "merge-cell-0").click()

    expect(selected).toEqual({ kind: "equipped", bookId: "equipped-holy" })
    expect(targeted).toEqual([
      {
        source: { kind: "equipped", bookId: "equipped-holy" },
        target: { kind: "inventory", bookId: "inventory-holy" },
      },
    ])
  })

  it("uses Enter and Space as role-button activation keys for selection and merge targeting", () => {
    const equipped = book("equipped-holy", 1, "holy")
    const inventory = book("inventory-holy", 1, "holy")
    const state = {
      ...createInitialState(1),
      books: [inventory],
      equipped: [equipped, null, null, null, null, null],
    } satisfies EngineState
    let selected: BookSource | null = null
    const targeted: { readonly source: BookSource; readonly target: BookSource }[] = []
    const host = renderInteractiveBooksPanel(state, {
      onBookClick: (source) => {
        if (selected === null) {
          selected = source
          return
        }
        targeted.push({ source: selected, target: source })
      },
      onEquipClick: (_slotIdx, source) => {
        selected = source
      },
    })

    const enterEvent = dispatchKeyDown(getByTestId(host, "equip-slot-0"), "Enter")
    const spaceEvent = dispatchKeyDown(getByTestId(host, "merge-cell-0"), " ")

    expect(enterEvent.defaultPrevented).toBe(true)
    expect(spaceEvent.defaultPrevented).toBe(true)
    expect(selected).toEqual({ kind: "equipped", bookId: "equipped-holy" })
    expect(targeted).toEqual([
      {
        source: { kind: "equipped", bookId: "equipped-holy" },
        target: { kind: "inventory", bookId: "inventory-holy" },
      },
    ])
  })

  it("keeps slot upgrade clicks from bubbling into equip slot activation", () => {
    const state = {
      ...createInitialState(1),
      gold: 1_000,
      equipped: [book("equipped-holy", 1, "holy"), null, null, null, null, null],
    } satisfies EngineState
    let equipClicks = 0
    let upgrades = 0
    const host = renderInteractiveBooksPanel(state, {
      onEquipClick: () => {
        equipClicks += 1
      },
      onUpgradeSlot: () => {
        upgrades += 1
        return true
      },
    })

    getByTestId(host, "slot-upgrade-0").click()

    expect(upgrades).toBe(1)
    expect(equipClicks).toBe(0)
  })
})
