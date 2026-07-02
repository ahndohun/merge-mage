import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { EventBus } from "../bridge/EventBus"
import { emitGameSfx, readAudioMutedPreference, writeAudioMutedPreference } from "../game/GameAudio"
import { createGame } from "../game/createGame"
import { assertNever, type Spellbook } from "../engine/types"
import { getEquipSlotClickDecision, type BookSource } from "./bookInteractions"
import { ControlsPanel } from "./ControlsPanel"
import { HudOverlay } from "./HudOverlay"
import { OfflineClaimModal } from "./OfflineClaimModal"
import { renderTab, type TabId } from "./renderTab"
import { getContextHint } from "./hints"
import { Toasts } from "./Toasts"
import { useEngine } from "./useEngine"

const TABS: readonly { readonly id: TabId; readonly label: string; readonly testId: string }[] = [
  { id: "books", label: "BOOKS", testId: "tab-books" },
  { id: "skills", label: "SKILLS", testId: "tab-skills" },
  { id: "rebirth", label: "REBIRTH", testId: "tab-rebirth" },
  { id: "ranks", label: "RANKS", testId: "tab-ranks" },
] as const

export function GameShell() {
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
  const engine = useEngine()

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
    setSelectedSource(null)
    setDraggingSource(null)
  }

  const handleBookPointerDown = (source: BookSource) => {
    const selectedSource = selectedRef.current
    if (selectedSource !== null && selectedSource.bookId !== source.bookId) {
      return
    }
    setDraggingSource(source)
  }

  const handleBookDrop = (targetBook: Spellbook) => {
    const source = draggingRef.current ?? selectedRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true
    setDraggingSource(null)

    if (source.bookId === targetBook.id) {
      setSelectedSource(source)
      return
    }

    if (engine.mergeBooks(source.bookId, targetBook.id)) {
      emitGameSfx("merge")
    }
    clearHeldBook()
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

    if (engine.mergeBooks(selectedSource.bookId, targetBook.id)) {
      emitGameSfx("merge")
    }
    clearHeldBook()
  }

  const handleEquipDrop = (slotIdx: number) => {
    const source = draggingRef.current ?? selectedRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true
    if (engine.equipBook(source.bookId, slotIdx)) {
      emitGameSfx("confirm")
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
        }
        clearHeldBook()
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
  const contextHint = getContextHint({ state: engine.state, summonCost: engine.summonCost })

  return (
    <main
      id="app-root"
      className="game-shell"
      data-active-scene={activeSceneKey}
      data-gold={Math.floor(engine.state.gold)}
      data-inventory-count={engine.state.books.length}
      data-stage={engine.state.stage}
      data-summon-level={engine.summonLevel}
      data-wave={engine.state.wave}
    >
      <div ref={hostRef} className="phaser-host" />
      <div className="ui-overlay" aria-label="Merge Mage overlay">
        <HudOverlay muted={soundMuted} onToggleMute={toggleSoundMuted} state={engine.state} />
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
              }
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <Toasts toasts={engine.toasts} />
        <OfflineClaimModal claim={engine.offlineClaim} onClose={engine.closeOfflineClaim} />
      </div>
    </main>
  )
}
