import { useState, type KeyboardEvent } from "react"
import { INVENTORY_LIMIT, SLOT_MULTIPLIER_PER_TIER } from "../engine/constants"
import { getSlotMultiplier, getSlotUpgradeCost } from "../engine/actions"
import type { EngineState, Spellbook } from "../engine/types"
import { canAffordSlotUpgrade } from "./useBadges"
import { canUpgradeSlotWhileSelected, type BookSource, type DragPreview } from "./bookInteractions"
import { CodexGrid, InventoryView, ResonanceBadges, TomeIcon, type InventoryCellRenderProps } from "./BooksPanelViews"
import { formatNumber } from "./formatNumber"
import type { Translator } from "./i18n"
import { NextGoalStrip } from "./NextGoalStrip"
import { useLocale } from "./useLocale"

const SLOT_UPGRADE_BONUS_PERCENT = Math.round(SLOT_MULTIPLIER_PER_TIER * 100)

function handleRoleButtonKeyDown(event: KeyboardEvent<HTMLDivElement>, activate: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    activate()
  }
}

type BooksPanelProps = {
  readonly state: EngineState
  readonly selected: BookSource | null
  readonly draggingBookId: string | null
  readonly dragActive: boolean
  readonly dragPreview: DragPreview | null
  readonly nextGoalHint: string | null
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onBookDrop: (book: Spellbook) => void
  readonly onBookClick: (source: BookSource, book: Spellbook) => void
  readonly onEquipDrop: (slotIdx: number, source: BookSource | null) => void
  readonly onEquipClick: (slotIdx: number, source: BookSource | null) => void
  readonly onUpgradeSlot: (slotIdx: number) => boolean
}

export function BooksPanel(props: BooksPanelProps) {
  const { t } = useLocale()
  const [subview, setSubview] = useState<"books" | "codex">("books")
  const cells = Array.from({ length: INVENTORY_LIMIT }, (_, index) => props.state.books[index] ?? null)
  // Collapsing the inventory-grid row only makes sense for the TOMES subview —
  // it shrinks the row that would otherwise hold the merge grid. Applying it
  // while CODEX is open squeezed the (unrelated) codex grid into the same
  // shrunk row, collapsing it to an 8px sliver of grey stripes.
  const inventoryCollapsed =
    subview === "books" && props.state.books.length === 0 && props.state.equipped.some((book) => book === null)

  return (
    <section
      className={`panel books-panel${inventoryCollapsed ? " inventory-collapsed" : ""}`}
      aria-label="Books"
      data-testid="tutorial-books-target"
    >
      <div className="subview-toggle" role="tablist" aria-label="Books view">
        <button
          aria-selected={subview === "books"}
          className={`btn btn-mini${subview === "books" ? " is-active" : ""}`}
          data-testid="books-subview-books"
          onClick={() => setSubview("books")}
          role="tab"
          type="button"
        >
          {t("subBooks")}
        </button>
        <button
          aria-selected={subview === "codex"}
          className={`btn btn-mini${subview === "codex" ? " is-active" : ""}`}
          data-testid="books-subview-codex"
          onClick={() => setSubview("codex")}
          role="tab"
          type="button"
        >
          {t("subCodex")}
        </button>
      </div>
      <ResonanceBadges state={props.state} t={t} />
      <div className="equip-row" aria-label="Equipped books" data-testid="tutorial-equip-target">
        {props.state.equipped.map((book, index) => (
          <EquipSlot
            book={book}
            dragActive={props.dragActive}
            dragPreview={props.dragPreview}
            draggingBookId={props.draggingBookId}
            index={index}
            key={`equip-${index}`}
            selected={props.selected}
            tier={props.state.slotTiers[index] ?? 0}
            gold={props.state.gold}
            onBookPointerDown={props.onBookPointerDown}
            onEquipClick={props.onEquipClick}
            onEquipDrop={props.onEquipDrop}
            onUpgradeSlot={props.onUpgradeSlot}
            showUpgradeDot={canAffordSlotUpgrade(props.state, index)}
            t={t}
          />
        ))}
      </div>

      {subview === "codex" ? (
        <CodexGrid state={props.state} t={t} renderTomeIcon={(element) => <TomeIcon element={element} />} />
      ) : (
        <InventoryView
          cells={cells}
          dragActive={props.dragActive}
          dragPreview={props.dragPreview}
          draggingBookId={props.draggingBookId}
          inventoryCollapsed={inventoryCollapsed}
          onBookClick={props.onBookClick}
          onBookDrop={props.onBookDrop}
          onBookPointerDown={props.onBookPointerDown}
          selected={props.selected}
          t={t}
          renderCell={(cellProps) => <InventoryCell {...cellProps} key={`cell-${cellProps.index}`} />}
        />
      )}
      <NextGoalStrip hint={props.nextGoalHint} />
    </section>
  )
}

function EquipSlot(props: {
  readonly book: Spellbook | null
  readonly index: number
  readonly selected: BookSource | null
  readonly draggingBookId: string | null
  readonly dragActive: boolean
  readonly dragPreview: DragPreview | null
  readonly tier: number
  readonly gold: number
  readonly onBookPointerDown: (source: BookSource) => void
  readonly onEquipDrop: (slotIdx: number, source: BookSource | null) => void
  readonly onEquipClick: (slotIdx: number, source: BookSource | null) => void
  readonly onUpgradeSlot: (slotIdx: number) => boolean
  readonly showUpgradeDot: boolean
  readonly t: Translator
}) {
  const upgradeCost = getSlotUpgradeCost(props.tier)
  const elementClass = props.book === null ? "empty" : props.book.element
  const selected = props.book !== null && props.selected?.bookId === props.book.id
  const canUpgrade = canUpgradeSlotWhileSelected(props.selected) && props.gold >= upgradeCost
  const targetTestId = `equip-slot-${props.index}`
  const isDraggingSource = props.dragActive && props.book !== null && props.draggingBookId === props.book.id
  const isDropTarget =
    props.dragActive &&
    props.dragPreview !== null &&
    props.dragPreview.targetTestId === targetTestId &&
    props.dragPreview.valid
  const isMergeTarget = isDropTarget && props.dragPreview?.mergeable === true
  const isEquipTarget = isDropTarget && props.dragPreview?.equipEmpty === true
  const slotSource: BookSource | null = props.book === null ? null : { kind: "equipped", bookId: props.book.id }
  const activate = () => props.onEquipClick(props.index, slotSource)

  return (
    <div
      className={`slot equip-slot element-${elementClass}${selected ? " is-selected" : ""}${isDraggingSource ? " is-dragging-source" : ""}${isDropTarget ? " is-drop-target" : ""}${isMergeTarget ? " is-merge-target" : ""}${isEquipTarget ? " is-equip-target" : ""}`}
      data-book-element={props.book?.element}
      data-book-id={props.book?.id}
      data-book-level={props.book?.level}
      data-testid={`equip-slot-${props.index}`}
      aria-label={props.t.slotAriaLabel(
        props.index + 1,
        props.book?.level ?? null,
        props.book === null ? null : props.t(props.book.element),
      )}
      onClick={activate}
      onKeyDown={(event) => handleRoleButtonKeyDown(event, activate)}
      onPointerDown={() => {
        if (props.book !== null) {
          props.onBookPointerDown({ kind: "equipped", bookId: props.book.id })
        }
      }}
      onPointerUp={() => props.onEquipDrop(props.index, slotSource)}
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
            {isMergeTarget && props.dragPreview?.previewLevel !== null ? (
              <span className="merge-preview-badge">{props.t.levelBadge(props.dragPreview.previewLevel)}</span>
            ) : null}
          </>
        )}
        <span className="slot-meta">{props.book === null ? props.t("slot") : props.t(props.book.element)}</span>
      </div>
      <button
        aria-disabled={!canUpgrade}
        aria-label={props.t.slotUpgradeAriaLabel(props.index + 1, formatNumber(upgradeCost))}
        className={`btn btn-mini slot-upgrade${props.selected !== null ? " is-selection-locked" : ""}`}
        data-testid={`slot-upgrade-${props.index}`}
        disabled={!canUpgrade}
        // Empty slots have nothing to upgrade — hide with visibility (not
        // display:none) so the row's layout doesn't jump when a book lands.
        style={props.book === null ? { visibility: "hidden" } : undefined}
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
        {props.book !== null && props.showUpgradeDot && canUpgrade ? <span aria-hidden="true" className="badge-dot" /> : null}
      </button>
    </div>
  )
}

function InventoryCell(props: InventoryCellRenderProps) {
  const selected = props.book !== null && props.selected?.bookId === props.book.id
  const elementClass = props.book === null ? "empty" : props.book.element
  const isDraggingSource = props.dragActive && props.book !== null && props.draggingBookId === props.book.id
  const targetTestId = `merge-cell-${props.index}`
  const isDropTarget =
    props.dragActive &&
    props.dragPreview !== null &&
    props.dragPreview.targetTestId === targetTestId &&
    props.dragPreview.valid
  const isMergeTarget = isDropTarget && props.dragPreview?.mergeable === true
  const activate = () =>
    props.book === null ? undefined : props.onBookClick({ kind: "inventory", bookId: props.book.id }, props.book)

  return (
    <div
      className={`slot merge-cell element-${elementClass}${selected ? " is-selected" : ""}${isDraggingSource ? " is-dragging-source" : ""}${isDropTarget ? " is-drop-target" : ""}${isMergeTarget ? " is-merge-target" : ""}`}
      data-book-element={props.book?.element}
      data-book-id={props.book?.id}
      data-book-level={props.book?.level}
      data-testid={targetTestId}
      onClick={activate}
      onKeyDown={(event) => handleRoleButtonKeyDown(event, activate)}
      onPointerDown={() => {
        if (props.book !== null) {
          props.onBookPointerDown({ kind: "inventory", bookId: props.book.id })
        }
      }}
      onPointerUp={() => (props.book === null ? undefined : props.onBookDrop(props.book))}
      role="button"
      tabIndex={0}
    >
      {props.book === null ? (
        <span className="slot-empty-plus">+</span>
      ) : (
        <>
          <TomeIcon element={props.book.element} />
          <span className="level-badge">{props.t.levelBadge(props.book.level)}</span>
          {isMergeTarget && props.dragPreview?.previewLevel !== null ? (
            <span className="merge-preview-badge">{props.t.levelBadge(props.dragPreview.previewLevel)}</span>
          ) : null}
          <span className="slot-meta">{props.t(props.book.element)}</span>
        </>
      )}
    </div>
  )
}
