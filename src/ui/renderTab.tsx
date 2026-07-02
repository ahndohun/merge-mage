import { assertNever, type Spellbook } from "../engine/types"
import { BooksPanel } from "./BooksPanel"
import type { BookSource } from "./bookInteractions"
import { RanksPanel } from "./RanksPanel"
import { RebirthPanel } from "./RebirthPanel"
import { SkillsPanel } from "./SkillsPanel"
import type { UseEngineResult } from "./useEngine"

export type TabId = "books" | "skills" | "rebirth" | "ranks"

export function renderTab(
  activeTab: TabId,
  engine: UseEngineResult,
  selected: BookSource | null,
  onBookPointerDown: (source: BookSource) => void,
  onBookDrop: (book: Spellbook) => void,
  onBookClick: (source: BookSource, book: Spellbook) => void,
  onEquipDrop: (slotIdx: number) => void,
  onEquipClick: (slotIdx: number, source: BookSource | null) => void,
  onUpgradeSlot: (slotIdx: number) => boolean,
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
          onUpgradeSlot={onUpgradeSlot}
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
      return assertNever(activeTab)
  }
}
