import { assertNever, type Spellbook } from "../engine/types"
import { BooksPanel } from "./BooksPanel"
import type { BookSource, DragPreview } from "./bookInteractions"
import { CampPanel } from "./CampPanel"
import { JourneyPanel } from "./JourneyPanel"
import { RebirthPanel } from "./RebirthPanel"
import { WizardPanel } from "./WizardPanel"
import type { TabId } from "./tabs"
import type { UseEngineResult } from "./useEngine"

export function renderTab(
  activeTab: TabId,
  engine: UseEngineResult,
  selected: BookSource | null,
  draggingBookId: string | null,
  dragActive: boolean,
  dragPreview: DragPreview | null,
  nextGoalHint: string | null,
  onBookPointerDown: (source: BookSource) => void,
  onBookDrop: (book: Spellbook) => void,
  onBookClick: (source: BookSource, book: Spellbook) => void,
  onEquipDrop: (slotIdx: number, source: BookSource | null) => void,
  onEquipClick: (slotIdx: number, source: BookSource | null) => void,
  onUpgradeSlot: (slotIdx: number) => boolean,
  onClaimQuest: (questId: string) => boolean,
) {
  switch (activeTab) {
    case "books":
      return (
        <BooksPanel
          dragActive={dragActive}
          dragPreview={dragPreview}
          draggingBookId={draggingBookId}
          nextGoalHint={nextGoalHint}
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
    case "wizard":
      return (
        <WizardPanel
          onAllocateSkill={engine.allocateSkill}
          onPromoteClass={engine.promoteClass}
          onRespecSchool={engine.respecSchool}
          onResetSkills={engine.resetSkills}
          onSelectTrait={engine.selectTrait}
          state={engine.state}
        />
      )
    case "journey":
      return (
        <JourneyPanel
          onClaimDailyMission={engine.claimDailyMission}
          onClaimQuest={onClaimQuest}
          state={engine.state}
        />
      )
    case "camp":
      return (
        <CampPanel
          onClaimMine={engine.claimMine}
          onEquipSkin={engine.equipSkin}
          state={engine.state}
        />
      )
    case "rebirth":
      return (
        <RebirthPanel
          onEquipRelic={engine.equipRelic}
          onPrestige={engine.prestige}
          onSummonRelic={engine.summonRelic}
          state={engine.state}
        />
      )
    default:
      return assertNever(activeTab)
  }
}
