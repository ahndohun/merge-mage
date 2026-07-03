import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { EventBus } from "../bridge/EventBus"
import { emitGameSfx, readAudioMutedPreference, writeAudioMutedPreference } from "../game/GameAudio"
import { createGame } from "../game/createGame"
import { INVENTORY_LIMIT } from "../engine/constants"
import { assertNever, type Spellbook } from "../engine/types"
import { ActionFeedbackLayer } from "./ActionFeedbackLayer"
import {
  bookElementSelector,
  DRAG_GHOST_OFFSET_Y,
  dropTargetToBookSource,
  findBookInState,
  getDragPreview,
  getEquipSlotClickDecision,
  pointerDragDistance,
  resolveDropTargetFromElement,
  shouldActivateDrag,
  type BookSource,
  type DragPreview,
} from "./bookInteractions"
import { ControlsPanel } from "./ControlsPanel"
import { DragGhostLayer, type DragGhostState } from "./DragGhostLayer"
import { canMerge } from "./engineActionHelpers"
import { clearSavedRun } from "./engineStorage"
import { HelpModal } from "./HelpModal"
import { HudOverlay } from "./HudOverlay"
import { OfflineClaimModal } from "./OfflineClaimModal"
import { renderTab, type TabId } from "./renderTab"
import { RiftsOverlay } from "./RiftsOverlay"
import { getContextHint } from "./hints"
import { Toasts } from "./Toasts"
import { Tutorial } from "./TutorialOverlay"
import { useActionFeedback } from "./useActionFeedback"
import { useBadges } from "./useBadges"
import { useEngine } from "./useEngine"
import { useLocale } from "./useLocale"
import { useTutorial } from "./useTutorial"
import type { MessageKey } from "./i18n"

const TABS: readonly {
  readonly id: TabId
  readonly labelKey: MessageKey
  readonly testId: string
  readonly locked?: boolean
}[] = [
  { id: "books", labelKey: "tabBooks", testId: "tab-books" },
  { id: "skills", labelKey: "tabSkills", testId: "tab-skills" },
  { id: "quests", labelKey: "tabQuests", testId: "tab-quests", locked: true },
  { id: "rebirth", labelKey: "tabRebirth", testId: "tab-rebirth" },
  { id: "ranks", labelKey: "tabRanks", testId: "tab-ranks" },
]

export function GameShell() {
  const { t } = useLocale()
  const hostRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const selectedRef = useRef<BookSource | null>(null)
  const draggingRef = useRef<BookSource | null>(null)
  const dragStartRef = useRef<{ readonly x: number; readonly y: number } | null>(null)
  const dragActiveRef = useRef(false)
  const ghostOriginRef = useRef<{ readonly x: number; readonly y: number } | null>(null)
  const suppressClickRef = useRef(false)
  const [activeSceneKey, setActiveSceneKey] = useState("booting")
  const [activeTab, setActiveTab] = useState<TabId>("books")
  const [selected, setSelected] = useState<BookSource | null>(null)
  const [draggingBookId, setDraggingBookId] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
  const [dragGhost, setDragGhost] = useState<DragGhostState | null>(null)
  const dragGhostRef = useRef<DragGhostState | null>(null)
  dragGhostRef.current = dragGhost
  const [soundMuted, setSoundMuted] = useState(readAudioMutedPreference)
  const [helpOpen, setHelpOpen] = useState(false)
  const engine = useEngine()
  const engineStateRef = useRef(engine.state)
  engineStateRef.current = engine.state
  const feedback = useActionFeedback()
  const badges = useBadges(engine.state)
  const tutorial = useTutorial(engine.state, {
    onComplete: () => engine.notify(t("toastTutorialComplete"), "notice"),
  })

  useEffect(() => {
    const host = hostRef.current

    if (host === null) {
      return
    }

    const unsubscribe = EventBus.on("current-scene-ready", (scene) => {
      setActiveSceneKey(scene.scene.key)
    })

    if (gameRef.current === null) {
      gameRef.current = createGame(host)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    for (const event of engine.events) {
      if (event.type === "riftComplete") {
        engine.notify(t("toastRiftComplete"), "notice")
      }
    }
  }, [engine.events, engine.notify, t])

  const setSelectedSource = (source: BookSource | null) => {
    selectedRef.current = source
    setSelected(source)
  }

  const setDraggingSource = (source: BookSource | null) => {
    draggingRef.current = source
    setDraggingBookId(source?.bookId ?? null)
  }

  const clearDragSession = () => {
    dragStartRef.current = null
    dragActiveRef.current = false
    ghostOriginRef.current = null
    setDragActive(false)
    setDragPreview(null)
    setDragGhost(null)
    setDraggingSource(null)
  }

  const clearHeldBook = () => {
    setSelectedSource(null)
    clearDragSession()
  }

  const findBookLevel = (bookId: string): number => findBookInState(engineStateRef.current, bookId)?.level ?? 0

  const applyBookTargetAction = (source: BookSource, target: BookSource, allowSwap: boolean) => {
    if (source.bookId === target.bookId) {
      setSelectedSource(target)
      clearDragSession()
      return
    }

    const beforeState = engineStateRef.current
    const sourceSelector = bookElementSelector(beforeState, source.bookId)
    const targetSelector = bookElementSelector(beforeState, target.bookId)
    const willMerge = canMerge(beforeState, target.bookId, source.bookId)
    const mergedLevel = willMerge ? findBookLevel(target.bookId) + 1 : null
    const mergeElement = findBookInState(beforeState, target.bookId)?.element ?? "fire"

    if (engine.mergeBooks(target.bookId, source.bookId)) {
      emitGameSfx("merge")
      if (targetSelector !== null && sourceSelector !== null && mergedLevel !== null) {
        feedback.playMergeJuice(sourceSelector, targetSelector, mergeElement, mergedLevel)
        feedback.floatAbove(targetSelector, t.mergedLv(mergedLevel), "gold")
      } else if (targetSelector !== null) {
        feedback.pulse(targetSelector, "fb-flash")
      }
      tutorial.notifyMerge()
      clearHeldBook()
      return
    }

    if (!allowSwap) {
      if (targetSelector !== null) {
        feedback.pulse(targetSelector, "fb-shake")
      }
      feedback.microToast(t("toastLevelsMustMatch"))
      return
    }

    if (engine.swapBooks(source.bookId, target.bookId)) {
      emitGameSfx("confirm")
    }
    clearHeldBook()
  }

  const animateGhostSnapBack = (targetSelector: string | null) => {
    const ghost = dragGhostRef.current
    const origin = ghostOriginRef.current
    if (ghost === null || origin === null) {
      clearDragSession()
      return
    }

    setDragGhost({
      ...ghost,
      snapping: true,
      snapFromX: ghost.x,
      snapFromY: ghost.y,
      snapToX: origin.x,
      snapToY: origin.y,
    })

    window.setTimeout(() => {
      clearDragSession()
    }, 160)

    if (targetSelector !== null) {
      feedback.pulse(targetSelector, "fb-shake")
    }
  }

  const resolveDropAtPoint = (clientX: number, clientY: number) => {
    const source = draggingRef.current
    if (source === null) {
      return
    }

    const dropTarget = resolveDropTargetFromElement(document.elementFromPoint(clientX, clientY))
    const preview = getDragPreview({ state: engineStateRef.current, source, target: dropTarget })
    setDragPreview(preview)

    if (dropTarget === null || !preview.valid) {
      animateGhostSnapBack(preview.targetTestId === null ? null : `[data-testid="${preview.targetTestId}"]`)
      return
    }

    suppressClickRef.current = true

    if (dropTarget.book === null) {
      if (dropTarget.kind === "equipped") {
        if (engine.equipBook(source.bookId, dropTarget.index)) {
          emitGameSfx("confirm")
          feedback.pulse(`[data-testid="equip-slot-${dropTarget.index}"]`, "fb-pulse")
        }
        clearHeldBook()
        return
      }

      animateGhostSnapBack(null)
      return
    }

    const targetSource = dropTargetToBookSource(dropTarget)
    if (targetSource === null) {
      animateGhostSnapBack(`[data-testid="${preview.targetTestId}"]`)
      return
    }

    if (preview.mergeable) {
      applyBookTargetAction(source, targetSource, true)
      return
    }

    if (canMerge(engineStateRef.current, targetSource.bookId, source.bookId)) {
      applyBookTargetAction(source, targetSource, true)
      return
    }

    if (engine.swapBooks(source.bookId, targetSource.bookId)) {
      emitGameSfx("confirm")
      clearHeldBook()
      return
    }

    applyBookTargetAction(source, targetSource, true)
  }

  useEffect(() => {
    if (draggingBookId === null) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const source = draggingRef.current
      if (source === null) {
        return
      }

      if (dragStartRef.current === null) {
        dragStartRef.current = { x: event.clientX, y: event.clientY }
      }

      const start = dragStartRef.current
      const distance = pointerDragDistance(start.x, start.y, event.clientX, event.clientY)
      if (!dragActiveRef.current && shouldActivateDrag(distance)) {
        dragActiveRef.current = true
        setDragActive(true)
          const book = findBookInState(engineStateRef.current, source.bookId)
          if (book !== null) {
            const selector = bookElementSelector(engineStateRef.current, source.bookId)
          if (selector !== null) {
            const el = document.querySelector(selector)
            if (el !== null) {
              const box = el.getBoundingClientRect()
              ghostOriginRef.current = {
                x: box.left + box.width / 2,
                y: box.top + box.height / 2 + DRAG_GHOST_OFFSET_Y,
              }
            }
          }
          setDragGhost({
            x: event.clientX,
            y: event.clientY + DRAG_GHOST_OFFSET_Y,
            book,
          })
        }
      }

      if (dragActiveRef.current) {
        const book = findBookInState(engineStateRef.current, source.bookId)
        if (book !== null) {
          setDragGhost({
            x: event.clientX,
            y: event.clientY + DRAG_GHOST_OFFSET_Y,
            book,
          })
        }
        const dropTarget = resolveDropTargetFromElement(document.elementFromPoint(event.clientX, event.clientY))
        setDragPreview(getDragPreview({ state: engineStateRef.current, source, target: dropTarget }))
      }
    }

    const onPointerUp = (event: PointerEvent) => {
      const source = draggingRef.current
      if (source === null) {
        return
      }

      if (dragActiveRef.current) {
        resolveDropAtPoint(event.clientX, event.clientY)
        return
      }

      const dropTarget = resolveDropTargetFromElement(document.elementFromPoint(event.clientX, event.clientY))
      if (dropTarget !== null && dropTarget.book !== null) {
        const targetSource = dropTargetToBookSource(dropTarget)
        if (targetSource !== null && targetSource.bookId !== source.bookId) {
          suppressClickRef.current = true
          applyBookTargetAction(source, targetSource, true)
          return
        }
      }

      if (dropTarget !== null && dropTarget.book === null && dropTarget.kind === "equipped") {
        suppressClickRef.current = true
        if (engine.equipBook(source.bookId, dropTarget.index)) {
          emitGameSfx("confirm")
          feedback.pulse(`[data-testid="equip-slot-${dropTarget.index}"]`, "fb-pulse")
        }
        clearHeldBook()
        return
      }

      setSelectedSource(source)
      clearDragSession()
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
    }
  }, [draggingBookId, engine, feedback, t, tutorial])

  const handleBookPointerDown = (source: BookSource) => {
    const selectedSource = selectedRef.current
    if (selectedSource !== null && selectedSource.bookId !== source.bookId) {
      return
    }

    dragStartRef.current = null
    dragActiveRef.current = false
    setDragActive(false)
    setDragPreview(null)
    setDragGhost(null)
    setDraggingSource(source)
  }

  const handleBookDrop = (targetBook: Spellbook) => {
    if (dragActiveRef.current) {
      return
    }

    const source = draggingRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true
    clearDragSession()
    applyBookTargetAction(source, { kind: "inventory", bookId: targetBook.id }, true)
  }

  const handleBookClick = (source: BookSource, targetBook: Spellbook) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    const selectedSource = selectedRef.current
    if (selectedSource === null || selectedSource.bookId === targetBook.id) {
      setSelectedSource(source)
      return
    }

    applyBookTargetAction(selectedSource, { kind: "inventory", bookId: targetBook.id }, false)
  }

  const handleEquipDrop = (slotIdx: number, target: BookSource | null) => {
    if (dragActiveRef.current) {
      return
    }

    const source = draggingRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true

    if (target !== null) {
      clearDragSession()
      applyBookTargetAction(source, target, true)
      return
    }

    clearDragSession()
    if (engine.equipBook(source.bookId, slotIdx)) {
      emitGameSfx("confirm")
      feedback.pulse(`[data-testid="equip-slot-${slotIdx}"]`, "fb-pulse")
    }
    clearHeldBook()
  }

  const handleEquipClick = (slotIdx: number, source: BookSource | null) => {
    const decision = getEquipSlotClickDecision({
      suppressedClick: suppressClickRef.current,
      selected: selectedRef.current,
      slotSource: source,
    })

    switch (decision.kind) {
      case "consume-suppressed-click":
        suppressClickRef.current = false
        return
      case "select-slot-book":
        setSelectedSource(decision.source)
        return
      case "equip-selected-book":
        if (engine.equipBook(decision.source.bookId, slotIdx)) {
          emitGameSfx("confirm")
          feedback.pulse(`[data-testid="equip-slot-${slotIdx}"]`, "fb-pulse")
        }
        clearHeldBook()
        return
      case "target-slot-book":
        applyBookTargetAction(decision.source, decision.target, false)
        return
      default:
        return assertNever(decision)
    }
  }

  const handleUpgradeSlot = (slotIdx: number): boolean => {
    const upgraded = engine.upgradeSlot(slotIdx)
    if (upgraded) {
      emitGameSfx("confirm")
      feedback.playSlotUpgradeJuice(`[data-testid="equip-slot-${slotIdx}"]`)
    }
    return upgraded
  }

  const toggleSoundMuted = () => {
    const nextMuted = !soundMuted
    setSoundMuted(nextMuted)
    writeAudioMutedPreference(nextMuted)
  }

  const handleNewGame = () => {
    clearSavedRun()
    window.location.reload()
  }

  const handleReplayTutorial = () => {
    setHelpOpen(false)
    tutorial.replay()
  }

  const contextHint = getContextHint({ state: engine.state, summonCost: engine.summonCost }, t)
  const nextGoalHint = activeTab === "books" ? contextHint : null

  const tabShowsDot = (tabId: TabId): boolean => {
    switch (tabId) {
      case "books":
        return badges.books
      case "skills":
        return badges.skills
      case "rebirth":
        return badges.rebirth
      default:
        return false
    }
  }

  return (
    <main
      id="app-root"
      className="game-shell"
      data-active-scene={activeSceneKey}
      data-gold={Math.floor(engine.state.gold)}
      data-inventory-count={engine.state.books.length}
      data-rift-kind={engine.state.activeRift?.kind ?? "none"}
      data-rift-runs-golden={engine.state.riftRuns.golden}
      data-rift-runs-trial={engine.state.riftRuns.trial}
      data-stage={engine.state.stage}
      data-summon-level={engine.summonLevel}
      data-save-status={engine.saveIndicator}
      data-wave={engine.state.wave}
    >
      <div ref={hostRef} className="phaser-host" />
      {activeSceneKey !== "booting" ? null : (
        <div className="preboot-splash" aria-live="polite">
          <div className="preboot-copy">
            <div className="preboot-title">{t("appTitle")}</div>
            <div className="preboot-loading">{t("loading")}</div>
          </div>
        </div>
      )}
      <div className="ui-overlay" aria-label="Merge Mage overlay">
        <HudOverlay
          muted={soundMuted}
          onNewGame={handleNewGame}
          onOpenHelp={() => setHelpOpen(true)}
          onToggleMute={toggleSoundMuted}
          saveIndicator={engine.saveIndicator}
          state={engine.state}
        />
        <RiftsOverlay
          state={engine.state}
          onEnterRift={(kind) => {
            const entered = engine.enterRift(kind)
            if (entered) {
              emitGameSfx("confirm")
              return true
            }
            feedback.microToast(t("toastRiftBlocked"))
            return false
          }}
          onExitRift={() => {
            const exited = engine.exitRift()
            if (exited) {
              emitGameSfx("confirm")
            }
            return exited
          }}
        />
        <div className="bottom-overlay">
          <div className="tab-content">
            {renderTab(
              activeTab,
              engine,
              selected,
              draggingBookId,
              dragActive,
              dragPreview,
              nextGoalHint,
              handleBookPointerDown,
              handleBookDrop,
              handleBookClick,
              handleEquipDrop,
              handleEquipClick,
              handleUpgradeSlot,
            )}
          </div>
          {contextHint === null ? null : (
            <div className="hint-strip" data-testid="hint-strip">
              {contextHint}
            </div>
          )}
          <ControlsPanel
            autoBuy={engine.autoBuy}
            autoMerge={engine.autoMerge}
            canSummon={engine.canSummon}
            onAutoBuy={(enabled) => {
              engine.setAutoBuy(enabled)
              emitGameSfx("confirm")
            }}
            onAutoMerge={(enabled) => {
              engine.setAutoMerge(enabled)
              emitGameSfx("confirm")
            }}
            onSummon={() => {
              const before = engine.state
              if (engine.summon()) {
                emitGameSfx("confirm")
                tutorial.notifySummon()
                const newEquipped = engine.state.equipped.find(
                  (book, index) => book !== null && before.equipped[index]?.id !== book.id,
                )
                const newInventory = engine.state.books.find(
                  (book) => !before.books.some((previous) => previous.id === book.id),
                )
                const summonedBook = newEquipped ?? newInventory
                if (summonedBook !== null && summonedBook !== undefined) {
                  const selector = bookElementSelector(engine.state, summonedBook.id)
                  if (selector !== null) {
                    feedback.playSummonJuice(selector)
                  }
                }
                return
              }
              feedback.pulse('[data-testid="summon-btn"]', "fb-shake")
              const inventoryFull =
                engine.state.equipped.every((book) => book !== null) &&
                engine.state.books.length >= INVENTORY_LIMIT
              feedback.microToast(inventoryFull ? t("toastInventoryFull") : t("toastNotEnoughGold"))
            }}
            summonCost={engine.summonCost}
            summonLevel={engine.summonLevel}
          />
          <nav className="tab-bar" aria-label="Game tabs">
            {TABS.map((tab) => (
              <button
                aria-pressed={activeTab === tab.id}
                className={`tab-btn${activeTab === tab.id ? " is-active" : ""}${tab.locked === true ? " is-locked" : ""}`}
                data-testid={tab.testId}
                key={tab.id}
                onClick={() => {
                  if (tab.locked === true) {
                    return
                  }
                  setActiveTab(tab.id)
                  emitGameSfx("confirm")
                }}
                title={tab.locked === true ? t("questsLockedTooltip") : undefined}
                type="button"
              >
                {tab.locked === true ? <span aria-hidden="true" className="tab-lock-icon" /> : null}
                {t(tab.labelKey)}
                {tab.id === "skills" && engine.state.skillPoints > 0 ? (
                  <span className="tab-badge" data-testid="skills-badge">
                    {engine.state.skillPoints}
                  </span>
                ) : null}
                {tabShowsDot(tab.id) ? <span aria-hidden="true" className="badge-dot" /> : null}
              </button>
            ))}
          </nav>
        </div>
        <Toasts toasts={engine.toasts} />
        <ActionFeedbackLayer
          floatingTexts={feedback.floatingTexts}
          microToasts={feedback.microToasts}
          particles={feedback.particles}
        />
        <DragGhostLayer ghost={dragGhost} t={t} />
        <OfflineClaimModal claim={engine.offlineClaim} onClose={engine.closeOfflineClaim} />
        <Tutorial state={tutorial.state} onSkip={tutorial.skip} />
        {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} onReplayTutorial={handleReplayTutorial} /> : null}
      </div>
    </main>
  )
}
