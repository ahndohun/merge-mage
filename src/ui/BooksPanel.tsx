import { INVENTORY_LIMIT } from "../engine/constants"
import { getSlotUpgradeCost } from "../engine/actions"
import type { EngineState, Spellbook } from "../engine/types"
import { formatNumber } from "./formatNumber"

export type BookSource = {
  readonly kind: "inventory" | "equipped"
  readonly bookId: string
}

type BooksPanelProps = {
  readonly state: EngineState
  readonly selected: BookSource | null
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onBookDrop: (book: Spellbook) => void
  readonly onBookClick: (source: BookSource, book: Spellbook) => void
  readonly onEquipDrop: (slotIdx: number) => void
  readonly onEquipClick: (slotIdx: number, source: BookSource | null) => void
  readonly onUpgradeSlot: (slotIdx: number) => void
}

export function BooksPanel(props: BooksPanelProps) {
  const cells = Array.from({ length: INVENTORY_LIMIT }, (_, index) => props.state.books[index] ?? null)

  return (
    <section className="panel books-panel" aria-label="Books">
      <div className="equip-row" aria-label="Equipped books">
        {props.state.equipped.map((book, index) => (
          <EquipSlot
            book={book}
            index={index}
            key={`equip-${index}`}
            selected={props.selected}
            tier={props.state.slotTiers[index] ?? 0}
            gold={props.state.gold}
            onBookPointerDown={props.onBookPointerDown}
            onEquipClick={props.onEquipClick}
            onEquipDrop={props.onEquipDrop}
            onUpgradeSlot={props.onUpgradeSlot}
          />
        ))}
      </div>

      <div className="merge-grid" aria-label="Inventory">
        {cells.map((book, index) => (
          <InventoryCell
            book={book}
            index={index}
            key={`cell-${index}`}
            selected={props.selected}
            onBookPointerDown={props.onBookPointerDown}
            onBookClick={props.onBookClick}
            onBookDrop={props.onBookDrop}
          />
        ))}
      </div>
    </section>
  )
}

function EquipSlot(props: {
  readonly book: Spellbook | null
  readonly index: number
  readonly selected: BookSource | null
  readonly tier: number
  readonly gold: number
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onEquipDrop: (slotIdx: number) => void
  readonly onEquipClick: (slotIdx: number, source: BookSource | null) => void
  readonly onUpgradeSlot: (slotIdx: number) => void
}) {
  const upgradeCost = getSlotUpgradeCost(props.tier)
  const elementClass = props.book === null ? "empty" : props.book.element
  const selected = props.book !== null && props.selected?.bookId === props.book.id

  return (
    <div
      className={`slot equip-slot element-${elementClass}${selected ? " is-selected" : ""}`}
      data-testid={`equip-slot-${props.index}`}
      onClick={() =>
        props.onEquipClick(props.index, props.book === null ? null : { kind: "equipped", bookId: props.book.id })
      }
      onPointerDown={() => {
        if (props.book !== null) {
          props.onBookPointerDown({ kind: "equipped", bookId: props.book.id })
        }
      }}
      onPointerUp={() => props.onEquipDrop(props.index)}
      role="button"
      tabIndex={0}
    >
      <span className="slot-title">{props.book === null ? "EMPTY" : `LV ${props.book.level}`}</span>
      <span className="slot-meta">{props.book === null ? "SLOT" : props.book.element.toUpperCase()}</span>
      <button
        className="btn btn-mini"
        data-testid={`slot-upgrade-${props.index}`}
        disabled={props.gold < upgradeCost}
        onClick={(event) => {
          event.stopPropagation()
          props.onUpgradeSlot(props.index)
        }}
        type="button"
      >
        UP {formatNumber(upgradeCost)}
      </button>
    </div>
  )
}

function InventoryCell(props: {
  readonly book: Spellbook | null
  readonly index: number
  readonly selected: BookSource | null
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onBookDrop: (book: Spellbook) => void
  readonly onBookClick: (source: BookSource, book: Spellbook) => void
}) {
  const selected = props.book !== null && props.selected?.bookId === props.book.id
  const elementClass = props.book === null ? "empty" : props.book.element

  return (
    <div
      className={`slot merge-cell element-${elementClass}${selected ? " is-selected" : ""}`}
      data-testid={`merge-cell-${props.index}`}
      onClick={() => {
        if (props.book !== null) {
          props.onBookClick({ kind: "inventory", bookId: props.book.id }, props.book)
        }
      }}
      onPointerDown={() => {
        if (props.book !== null) {
          props.onBookPointerDown({ kind: "inventory", bookId: props.book.id })
        }
      }}
      onPointerUp={() => {
        if (props.book !== null) {
          props.onBookDrop(props.book)
        }
      }}
      role="button"
      tabIndex={0}
    >
      {props.book === null ? (
        <span className="slot-title">-</span>
      ) : (
        <>
          <span className="slot-title">LV {props.book.level}</span>
          <span className="slot-meta">{props.book.element.toUpperCase()}</span>
        </>
      )}
    </div>
  )
}
