import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import type { EngineState, Spellbook } from "../engine/types"
import { createInitialState } from "../engine/state"
import { BooksPanel } from "./BooksPanel"

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

function renderBooksPanel(state: EngineState): string {
  return renderToStaticMarkup(
    <BooksPanel
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
})
