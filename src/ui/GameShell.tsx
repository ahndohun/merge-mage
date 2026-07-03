import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { EventBus } from "../bridge/EventBus"
import { emitGameSfx, readAudioMutedPreference, writeAudioMutedPreference } from "../game/GameAudio"
import { createGame } from "../game/createGame"
import { INVENTORY_LIMIT } from "../engine/constants"
import { assertNever, type Spellbook } from "../engine/types"
import { ActionFeedbackLayer } from "./ActionFeedbackLayer"
import { bookElementSelector, getEquipSlotClickDecision, type BookSource } from "./bookInteractions"
import { ControlsPanel } from "./ControlsPanel"
import { canMerge } from "./engineActionHelpers"
import { clearSavedRun } from "./engineStorage"
import { HelpModal } from "./HelpModal"
import { HudOverlay } from "./HudOverlay"
import { OfflineClaimModal } from "./OfflineClaimModal"
import { renderTab, type TabId } from "./renderTab"
import { getContextHint } from "./hints"
import { Toasts } from "./Toasts"
import { Tutorial } from "./TutorialOverlay"
import { useActionFeedback } from "./useActionFeedback"
import { useEngine } from "./useEngine"
import { useLocale } from "./useLocale"
import { useTutorial } from "./useTutorial"
import type { MessageKey } from "./i18n"

const TABS: readonly { readonly id: TabId; readonly labelKey: MessageKey; readonly testId: string }[] = [
  { id: "books", labelKey: "tabBooks", testId: "tab-books" },
  { id: "skills", labelKey: "tabSkills", testId: "tab-skills" },
  { id: "rebirth", labelKey: "tabRebirth", testId: "tab-rebirth" },
  { id: "ranks", labelKey: "tabRanks", testId: "tab-ranks" },
]

export function GameShell() {
  const { t } = useLocale()
  const hostRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const selectedRef = useRef<BookSource | null>(null)
  const draggingRef = useRef<BookSource | null>(null)
  const suppressClickRef = useRef(false)
  const [activeSceneKey, setActiveSceneKey] = useState("booting")
  const [activeTab, setActiveTab] = useState<TabId>("books")
  const [selected, setSelected] = useState<BookSource | null>(null)
  const [, setDragging] = useState<BookSource | null>(null)
  const [soundMuted, setSoundMuted] = useState(readAudioMutedPreference)
  const [helpOpen, setHelpOpen] = useState(false)
  const engine = useEngine()
  const feedback = useActionFeedback()
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

    // StrictMode runs this effect twice in dev; destroying a Phaser game
    // mid-asset-load corrupts the loader (scene stuck in "booting"). The game
    // is an app-lifetime singleton, so create once and never destroy on the
    // double-invoke.
    if (gameRef.current === null) {
      gameRef.current = createGame(host)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const setSelectedSource = (source: BookSource | null) => {
    selectedRef.current = source
    setSelected(source)
  }

  const setDraggingSource = (source: BookSource | null) => {
    draggingRef.current = source
    setDragging(source)
  }

  const clearHeldBook = () => {
    setSelectedSource(null); setDraggingSource(null)
  }

  // allowSwap distinguishes intent: a drag-drop onto a different-level book
  // falls back to a swap, but a tap-tap means "merge these two" — a silent swap
  // on a level mismatch was the #1 source of "I don't know what happened".
  const applyBookTargetAction = (source: BookSource, target: BookSource, allowSwap: boolean) => {
    if (source.bookId === target.bookId) {
      setSelectedSource(target)
      setDraggingSource(null)
      return
    }

    // Anchor the merge feedback to the target slot before the merge mutates
    // state (the merged book gets a new id at the same cell).
    const targetSelector = bookElementSelector(engine.state, target.bookId)
    const willMerge = canMerge(engine.state, target.bookId, source.bookId)
    const mergedLevel = willMerge ? findBookLevel(target.bookId) + 1 : null

    if (engine.mergeBooks(target.bookId, source.bookId)) {
      emitGameSfx("merge")
      if (targetSelector !== null) {
        if (mergedLevel !== null) {
          feedback.floatAbove(targetSelector, t.mergedLv(mergedLevel), "gold")
        }
        feedback.pulse(targetSelector, "fb-flash")
      }
      tutorial.notifyMerge()
      clearHeldBook()
      return
    }

    if (!allowSwap) {
      // Tap-tap on a level mismatch: shake, tell the player why, keep the
      // selection so they can pick a matching book instead of losing it.
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

  const findBookLevel = (bookId: string): number => {
    const equipped = engine.state.equipped.find((book) => book?.id === bookId)
    if (equipped != null) {
      return equipped.level
    }
    return engine.state.books.find((book) => book.id === bookId)?.level ?? 0
  }

  const handleBookPointerDown = (source: BookSource) => {
    const selectedSource = selectedRef.current
    if (selectedSource !== null && selectedSource.bookId !== source.bookId) {
      return
    }
    setDraggingSource(source)
  }

  const handleBookDrop = (targetBook: Spellbook) => {
    const source = draggingRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true
    setDraggingSource(null)

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
    const source = draggingRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true

    if (target !== null) {
      applyBookTargetAction(source, target, true)
      return
    }

    setDraggingSource(null)
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
    }
    return upgraded
  }

  const toggleSoundMuted = () => {
    const nextMuted = !soundMuted
    setSoundMuted(nextMuted)
    writeAudioMutedPreference(nextMuted)
  }

  const handleNewGame = () => {
    clearSavedRun(); window.location.reload()
  }

  const handleReplayTutorial = () => {
    setHelpOpen(false)
    tutorial.replay()
  }

  const contextHint = getContextHint({ state: engine.state, summonCost: engine.summonCost }, t)

  return (
    <main
      id="app-root"
      className="game-shell"
      data-active-scene={activeSceneKey}
      data-gold={Math.floor(engine.state.gold)}
      data-inventory-count={engine.state.books.length}
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
        <div className="bottom-overlay">
          <div className="tab-content">
            {renderTab(
              activeTab,
              engine,
              selected,
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
              if (engine.summon()) {
                emitGameSfx("confirm")
                tutorial.notifySummon()
                return
              }
              // Blocked summon: shake the button and say why. Inventory-full is
              // checked first (matches the engine's summonBook order); otherwise
              // it's the gold shortfall.
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
                className={`tab-btn${activeTab === tab.id ? " is-active" : ""}`}
                data-testid={tab.testId}
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  emitGameSfx("confirm")
                }}
                type="button"
              >
                {t(tab.labelKey)}
                {tab.id === "skills" && engine.state.skillPoints > 0 ? (
                  <span className="tab-badge" data-testid="skills-badge">
                    {engine.state.skillPoints}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
        <Toasts toasts={engine.toasts} />
        <ActionFeedbackLayer floatingTexts={feedback.floatingTexts} microToasts={feedback.microToasts} />
        <OfflineClaimModal claim={engine.offlineClaim} onClose={engine.closeOfflineClaim} />
        <Tutorial state={tutorial.state} onSkip={tutorial.skip} />
        {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} onReplayTutorial={handleReplayTutorial} /> : null}
      </div>
    </main>
  )
}
