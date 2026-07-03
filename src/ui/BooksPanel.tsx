import { INVENTORY_LIMIT, SLOT_MULTIPLIER_PER_TIER } from "../engine/constants"
import { getSlotMultiplier, getSlotUpgradeCost } from "../engine/actions"
import type { EngineState, Spellbook } from "../engine/types"
import { canUpgradeSlotWhileSelected, type BookSource } from "./bookInteractions"
import { formatNumber } from "./formatNumber"
import type { Translator } from "./i18n"
import { useLocale } from "./useLocale"

const SLOT_UPGRADE_BONUS_PERCENT = Math.round(SLOT_MULTIPLIER_PER_TIER * 100)

type BooksPanelProps = {
  readonly state: EngineState
  readonly selected: BookSource | null
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onBookDrop: (book: Spellbook) => void
  readonly onBookClick: (source: BookSource, book: Spellbook) => void
  readonly onEquipDrop: (slotIdx: number, source: BookSource | null) => void
  readonly onEquipClick: (slotIdx: number, source: BookSource | null) => void
  readonly onUpgradeSlot: (slotIdx: number) => boolean
}

export function BooksPanel(props: BooksPanelProps) {
  const { t } = useLocale()
  const cells = Array.from({ length: INVENTORY_LIMIT }, (_, index) => props.state.books[index] ?? null)
  const inventoryCollapsed = props.state.books.length === 0 && props.state.equipped.some((book) => book === null)

  return (
    <section
      className={`panel books-panel${inventoryCollapsed ? " inventory-collapsed" : ""}`}
      aria-label="Books"
      data-testid="tutorial-books-target"
    >
      <div className="equip-row" aria-label="Equipped books" data-testid="tutorial-equip-target">
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
            t={t}
          />
        ))}
      </div>

      {inventoryCollapsed ? (
        <div className="inventory-empty-row" aria-label="Inventory">
          {t("inventoryEmptyAutoEquip")}
        </div>
      ) : (
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
              t={t}
            />
          ))}
        </div>
      )}
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
  readonly onEquipDrop: (slotIdx: number, source: BookSource | null) => void
  readonly onEquipClick: (slotIdx: number, source: BookSource | null) => void
  readonly onUpgradeSlot: (slotIdx: number) => boolean
  readonly t: Translator
}) {
  const upgradeCost = getSlotUpgradeCost(props.tier)
  const elementClass = props.book === null ? "empty" : props.book.element
  const selected = props.book !== null && props.selected?.bookId === props.book.id
  const canUpgrade = canUpgradeSlotWhileSelected(props.selected) && props.gold >= upgradeCost

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
      onPointerUp={() =>
        props.onEquipDrop(props.index, props.book === null ? null : { kind: "equipped", bookId: props.book.id })
      }
      role="button"
      tabIndex={0}
    >
      <div className="slot-face">
        {props.book === null ? (
          <span className="slot-empty-plus">+</span>
        ) : (
          <>
            <TomeIcon element={props.book.element} />
            <span className="level-badge">{props.t.levelBadge(props.book.level)}</span>
            {props.tier > 0 ? (
              <span className="slot-tier-badge">x{getSlotMultiplier(props.tier).toFixed(2)}</span>
            ) : null}
          </>
        )}
        <span className="slot-meta">{props.book === null ? props.t("slot") : elementLabel(props.book.element, props.t)}</span>
      </div>
      <button
        aria-disabled={!canUpgrade}
        className={`btn btn-mini slot-upgrade${props.selected !== null ? " is-selection-locked" : ""}`}
        data-testid={`slot-upgrade-${props.index}`}
        disabled={!canUpgrade}
        onPointerDown={(event) => {
          if (props.selected === null) {
            event.stopPropagation()
          }
        }}
        onPointerUp={(event) => {
          if (props.selected === null) {
            event.stopPropagation()
          }
        }}
        onClick={(event) => {
          event.stopPropagation()
          if (canUpgrade) {
            props.onUpgradeSlot(props.index)
          }
        }}
        type="button"
      >
        {props.t.slotUpgrade(formatNumber(upgradeCost), SLOT_UPGRADE_BONUS_PERCENT)}
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
  readonly t: Translator
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
        <span className="slot-empty-plus">+</span>
      ) : (
        <>
          <TomeIcon element={props.book.element} />
          <span className="level-badge">{props.t.levelBadge(props.book.level)}</span>
          <span className="slot-meta">{elementLabel(props.book.element, props.t)}</span>
        </>
      )}
    </div>
  )
}

function TomeIcon(props: { readonly element: Spellbook["element"] }) {
  return <img alt="" aria-hidden="true" className="tome-icon" draggable={false} src={`/assets/tomes/${props.element}.png`} />
}

function elementLabel(element: Spellbook["element"], t: Translator): string {
  switch (element) {
    case "fire":
      return t("fire")
    case "frost":
      return t("frost")
    case "holy":
      return t("holy")
  }
}
