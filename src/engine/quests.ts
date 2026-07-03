import type { EngineState } from "./types.js"
import { getCodexCellCount } from "./codex.js"

export type QuestReward = {
  readonly gold: number
  readonly skillPoints: number
}

export type QuestDefinition = {
  readonly id: string
  readonly chainIndex: number | null
  readonly reward: QuestReward
  readonly isComplete: (state: EngineState) => boolean
}

const chainRewards: readonly QuestReward[] = [
  { gold: 60, skillPoints: 0 },
  { gold: 90, skillPoints: 0 },
  { gold: 120, skillPoints: 0 },
  { gold: 160, skillPoints: 0 },
  { gold: 220, skillPoints: 1 },
  { gold: 300, skillPoints: 0 },
  { gold: 360, skillPoints: 1 },
  { gold: 460, skillPoints: 0 },
  { gold: 560, skillPoints: 1 },
  { gold: 720, skillPoints: 1 },
  { gold: 900, skillPoints: 0 },
  { gold: 1_100, skillPoints: 1 },
  { gold: 1_400, skillPoints: 1 },
  { gold: 1_700, skillPoints: 1 },
  { gold: 2_100, skillPoints: 1 },
  { gold: 2_600, skillPoints: 1 },
  { gold: 3_200, skillPoints: 1 },
  { gold: 4_000, skillPoints: 1 },
  { gold: 5_000, skillPoints: 2 },
  { gold: 6_500, skillPoints: 2 },
] as const

export const QUESTS: readonly QuestDefinition[] = [
  chain("chain-01", 1, chainRewards[0], (state) => getBookCount(state) >= 1),
  chain("chain-02", 2, chainRewards[1], (state) => (state.achievements.counters["mergesTotal"] ?? 0) >= 1 || state.highestLevelEver >= 2),
  chain("chain-03", 3, chainRewards[2], (state) => state.highestLevelEver >= 3),
  chain("chain-04", 4, chainRewards[3], (state) => getEquippedCount(state) >= 3),
  chain("chain-05", 5, chainRewards[4], (state) => state.highestLevelEver >= 5),
  chain("chain-06", 6, chainRewards[5], (state) => state.stage >= 2 || (state.achievements.counters["bossKills"] ?? 0) >= 1),
  chain("chain-07", 7, chainRewards[6], (state) => getTotalSkillPoints(state) >= 1),
  chain("chain-08", 8, chainRewards[7], (state) => state.traits.picks["lv8"] !== undefined),
  chain("chain-09", 9, chainRewards[8], (state) => getEquippedCount(state) >= 6),
  chain("chain-10", 10, chainRewards[9], (state) => state.highestLevelEver >= 10),
  chain("chain-11", 11, chainRewards[10], (state) => state.prestigeCount >= 1),
  chain("chain-12", 12, chainRewards[11], (state) => getCodexCellCount(state) >= 5),
  chain("chain-13", 13, chainRewards[12], (state) => state.stage >= 15),
  chain("chain-14", 14, chainRewards[13], (state) => state.prestigeCount >= 2),
  chain("chain-15", 15, chainRewards[14], (state) => state.highestLevelEver >= 20),
  chain("chain-16", 16, chainRewards[15], (state) => state.traits.picks["lv16"] !== undefined),
  chain("chain-17", 17, chainRewards[16], (state) => (state.achievements.counters["bossKills"] ?? 0) >= 25),
  chain("chain-18", 18, chainRewards[17], (state) => state.stage >= 25),
  chain("chain-19", 19, chainRewards[18], (state) => state.traits.picks["lv24"] !== undefined),
  chain("chain-20", 20, chainRewards[19], (state) => state.prestigeCount >= 3),
  long("long-stage-25", { gold: 2_500, skillPoints: 1 }, (state) => state.stage >= 25),
  long("long-stage-50", { gold: 8_000, skillPoints: 2 }, (state) => state.stage >= 50),
  long("long-stage-75", { gold: 18_000, skillPoints: 3 }, (state) => state.stage >= 75),
  long("long-stage-100", { gold: 40_000, skillPoints: 4 }, (state) => state.stage >= 100),
  long("long-rebirth-3", { gold: 6_000, skillPoints: 2 }, (state) => state.prestigeCount >= 3),
  long("long-rebirth-10", { gold: 35_000, skillPoints: 4 }, (state) => state.prestigeCount >= 10),
  long("long-relics-5", { gold: 14_000, skillPoints: 2 }, (state) => Object.keys(state.relics.owned).length >= 5),
  long("long-codex-15", { gold: 12_000, skillPoints: 2 }, (state) => getCodexCellCount(state) >= 15),
  long("long-codex-30", { gold: 45_000, skillPoints: 4 }, (state) => getCodexCellCount(state) >= 30),
  long("long-level-50", { gold: 25_000, skillPoints: 3 }, (state) => state.highestLevelEver >= 50),
] as const

export function refreshQuests(state: EngineState): EngineState {
  const completed = QUESTS.filter((quest) => isQuestExposed(state, quest) && quest.isComplete(state)).map((quest) => quest.id)
  return { ...state, quests: { ...state.quests, completed } }
}

export function getVisibleQuests(state: EngineState): readonly QuestDefinition[] {
  return QUESTS.filter((quest) => isQuestExposed(state, quest))
}

export function getClaimableQuests(state: EngineState): readonly QuestDefinition[] {
  const refreshed = refreshQuests(state)
  return getVisibleQuests(refreshed).filter((quest) => refreshed.quests.completed.includes(quest.id) && !refreshed.quests.claimed.includes(quest.id))
}

export function findQuest(id: string): QuestDefinition | null {
  return QUESTS.find((quest) => quest.id === id) ?? null
}

function isQuestExposed(state: EngineState, quest: QuestDefinition): boolean {
  if (quest.chainIndex === null) {
    return true
  }
  if (quest.chainIndex === 1) {
    return true
  }
  return state.quests.claimed.includes(`chain-${String(quest.chainIndex - 1).padStart(2, "0")}`)
}

function chain(
  id: string,
  chainIndex: number,
  reward: QuestReward | undefined,
  isComplete: (state: EngineState) => boolean,
): QuestDefinition {
  return { id, chainIndex, reward: reward ?? { gold: 0, skillPoints: 0 }, isComplete }
}

function long(id: string, reward: QuestReward, isComplete: (state: EngineState) => boolean): QuestDefinition {
  return { id, chainIndex: null, reward, isComplete }
}

function getBookCount(state: EngineState): number {
  return state.books.length + getEquippedCount(state)
}

function getEquippedCount(state: EngineState): number {
  return state.equipped.filter((book) => book !== null).length
}

function getTotalSkillPoints(state: EngineState): number {
  return state.skillPoints + state.skills.summonBonus + state.skills.castSpeed + state.skills.goldGain + state.skills.critChance
}
