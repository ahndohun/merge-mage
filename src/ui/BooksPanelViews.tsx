import { CODEX_DAMAGE_PER_TIER, getCodexCells } from "../engine/codex"
import { getResonance } from "../engine/resonance"
import { ELEMENTS, type EngineState, type Spellbook } from "../engine/types"
import type { BookSource, DragPreview } from "./bookInteractions"
import type { Translator } from "./i18n"

export function TomeIcon(props: { readonly element: Spellbook["element"] }) {
  return <img alt="" aria-hidden="true" className="tome-icon" draggable={false} src={`/assets/tomes/${props.element}.png`} />
}

export function InventoryView(props: {
  readonly cells: readonly (Spellbook | null)[]
  readonly inventoryCollapsed: boolean
  readonly selected: BookSource | null
  readonly draggingBookId: string | null
  readonly dragActive: boolean
  readonly dragPreview: DragPreview | null
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onBookDrop: (book: Spellbook) => void
  readonly onBookClick: (source: BookSource, book: Spellbook) => void
  readonly t: Translator
  readonly renderCell: (props: InventoryCellRenderProps) => React.ReactNode
}) {
  if (props.inventoryCollapsed) {
    return (
      <div className="inventory-empty-row" aria-label="Inventory">
        {props.t("inventoryEmptyAutoEquip")}
      </div>
    )
  }

  return (
    <div className="merge-grid" aria-label="Inventory">
      {props.cells.map((book, index) =>
        props.renderCell({
          book,
          index,
          selected: props.selected,
          onBookPointerDown: props.onBookPointerDown,
          onBookClick: props.onBookClick,
          dragActive: props.dragActive,
          dragPreview: props.dragPreview,
          draggingBookId: props.draggingBookId,
          onBookDrop: props.onBookDrop,
          t: props.t,
        }),
      )}
    </div>
  )
}

export type InventoryCellRenderProps = {
  readonly book: Spellbook | null
  readonly index: number
  readonly selected: BookSource | null
  readonly draggingBookId: string | null
  readonly dragActive: boolean
  readonly dragPreview: DragPreview | null
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onBookDrop: (book: Spellbook) => void
  readonly onBookClick: (source: BookSource, book: Spellbook) => void
  readonly t: Translator
}

export function ResonanceBadges(props: { readonly state: EngineState; readonly t: Translator }) {
  const resonance = getResonance(props.state)

  return (
    <div className="resonance-row" data-testid="resonance-row">
      {ELEMENTS.map((element) => (
        <span
          className={`resonance-badge element-${element}${resonance[element].active ? " is-active" : ""}${resonance[element].mono ? " is-mono" : ""}`}
          data-testid={`resonance-${element}`}
          key={element}
        >
          {props.t.resonanceBadge(props.t(element), resonance[element].count, resonance.requirement)}
        </span>
      ))}
    </div>
  )
}

export function CodexGrid(props: { readonly state: EngineState; readonly t: Translator; readonly renderTomeIcon: (element: Spellbook["element"]) => React.ReactNode }) {
  const cells = getCodexCells(props.state)
  const bonusPercent = Math.round(CODEX_DAMAGE_PER_TIER * 100)

  return (
    <div className="codex-grid" aria-label="Grimoire Codex" data-testid="codex-grid">
      {cells.map((cell) => (
        <div
          className={`codex-cell element-${cell.element}${cell.unlocked ? " is-unlocked" : ""}`}
          data-testid={`codex-${cell.element}-${cell.tier}`}
          key={`${cell.element}-${cell.tier}`}
        >
          {cell.unlocked ? props.renderTomeIcon(cell.element) : <span aria-hidden="true" className="codex-silhouette" />}
          <span className="codex-cell-label">{props.t.codexTier(cell.tier, bonusPercent)}</span>
        </div>
      ))}
    </div>
  )
}
