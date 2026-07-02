import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { EventBus } from "../bridge/EventBus"
import { createGame } from "../game/createGame"
import type { Spellbook } from "../engine/types"
import { BooksPanel, type BookSource } from "./BooksPanel"
import { ControlsPanel } from "./ControlsPanel"
import { HudOverlay } from "./HudOverlay"
import { OfflineClaimModal } from "./OfflineClaimModal"
import { RanksPanel } from "./RanksPanel"
import { RebirthPanel } from "./RebirthPanel"
import { SkillsPanel } from "./SkillsPanel"
import { Toasts } from "./Toasts"
import { useEngine } from "./useEngine"

const TABS = [
  { id: "books", label: "BOOKS", testId: "tab-books" },
  { id: "skills", label: "SKILLS", testId: "tab-skills" },
  { id: "rebirth", label: "REBIRTH", testId: "tab-rebirth" },
  { id: "ranks", label: "RANKS", testId: "tab-ranks" },
] as const

type TabId = (typeof TABS)[number]["id"]

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
  const engine = useEngine()

  useEffect(() => {
    const host = hostRef.current

    if (host === null) {
      return
    }

    const unsubscribe = EventBus.on("current-scene-ready", (scene) => {
      setActiveSceneKey(scene.scene.key)
    })

    const game = createGame(host)
    gameRef.current = game

    return () => {
      unsubscribe()
      game.destroy(true)
      gameRef.current = null
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

    engine.mergeBooks(source.bookId, targetBook.id)
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

    engine.mergeBooks(selectedSource.bookId, targetBook.id)
    clearHeldBook()
  }

  const handleEquipDrop = (slotIdx: number) => {
    const source = draggingRef.current ?? selectedRef.current
    if (source === null) {
      return
    }

    suppressClickRef.current = true
    engine.equipBook(source.bookId, slotIdx)
    clearHeldBook()
  }

  const handleEquipClick = (slotIdx: number, source: BookSource | null) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    const selectedSource = selectedRef.current
    if (selectedSource === null) {
      setSelectedSource(source)
      return
    }

    engine.equipBook(selectedSource.bookId, slotIdx)
    clearHeldBook()
  }

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
        <HudOverlay state={engine.state} />
        <div className="bottom-overlay">
          <div className="tab-content">{renderTab(activeTab, engine, selected, handleBookPointerDown, handleBookDrop, handleBookClick, handleEquipDrop, handleEquipClick)}</div>
          <ControlsPanel
            autoBuy={engine.autoBuy}
            autoMerge={engine.autoMerge}
            canSummon={engine.canSummon}
            onAutoBuy={engine.setAutoBuy}
            onAutoMerge={engine.setAutoMerge}
            onSummon={engine.summon}
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
                onClick={() => setActiveTab(tab.id)}
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

function renderTab(
  activeTab: TabId,
  engine: ReturnType<typeof useEngine>,
  selected: BookSource | null,
  onBookPointerDown: (source: BookSource) => void,
  onBookDrop: (book: Spellbook) => void,
  onBookClick: (source: BookSource, book: Spellbook) => void,
  onEquipDrop: (slotIdx: number) => void,
  onEquipClick: (slotIdx: number, source: BookSource | null) => void,
) {
  switch (activeTab) {
    case "books":
      return (
        <BooksPanel
          onBookClick={onBookClick}
          onBookDrop={onBookDrop}
          onBookPointerDown={onBookPointerDown}
          onEquipClick={onEquipClick}
          onEquipDrop={onEquipDrop}
          onUpgradeSlot={engine.upgradeSlot}
          selected={selected}
          state={engine.state}
        />
      )
    case "skills":
      return <SkillsPanel onAllocateSkill={engine.allocateSkill} onResetSkills={engine.resetSkills} state={engine.state} />
    case "rebirth":
      return <RebirthPanel onPrestige={engine.prestige} state={engine.state} />
    case "ranks":
      return (
        <RanksPanel
          entries={engine.leaderboard}
          nickname={engine.nickname}
          onNickname={engine.setNickname}
          onRefresh={engine.refreshLeaderboard}
          onSubmit={engine.submitLeaderboard}
          status={engine.leaderboardStatus}
        />
      )
    default:
      return activeTab
  }
}
