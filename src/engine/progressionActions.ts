import { QuestClaimError } from "./errors.js"
import { trackProgress } from "./progression.js"
import { findQuest, getVisibleQuests, refreshQuests } from "./quests.js"
import { selectTraitPick, type TraitId, type TraitSlot } from "./traits.js"
import type { EngineState } from "./types.js"

export function claimQuestReward(state: EngineState, questId: string): EngineState {
  const refreshed = refreshQuests(state)
  const quest = findQuest(questId)
  if (quest === null) {
    throw new QuestClaimError(questId, "missing")
  }
  if (!getVisibleQuests(refreshed).some((visibleQuest) => visibleQuest.id === questId)) {
    throw new QuestClaimError(questId, "locked")
  }
  if (!refreshed.quests.completed.includes(questId) && !quest.isComplete(refreshed)) {
    throw new QuestClaimError(questId, "incomplete")
  }
  if (refreshed.quests.claimed.includes(questId)) {
    throw new QuestClaimError(questId, "claimed")
  }

  return trackProgress({
    ...refreshed,
    gold: refreshed.gold + quest.reward.gold,
    skillPoints: refreshed.skillPoints + quest.reward.skillPoints,
    quests: {
      completed: refreshed.quests.completed,
      claimed: [...refreshed.quests.claimed, questId],
    },
  })
}

export function selectTrait(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
  return trackProgress(selectTraitPick(state, slot, traitId))
}
