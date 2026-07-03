import { getCodexCellCount } from "./codex.js"
import type { EngineState } from "./types.js"

export type AchievementDefinition = {
  readonly id: string
  readonly counter: string
  readonly threshold: number
}

const ACHIEVEMENT_STEPS = {
  mergesTotal: [10, 50, 200, 1_000, 5_000],
  bossKills: [5, 25, 100, 500, 1_000],
  summonsTotal: [25, 100, 400, 1_000, 2_500],
  rebirths: [1, 3, 10, 25, 50],
  questsClaimed: [5, 15, 30, 40, 60],
  highestLevelEver: [10, 20, 40, 70, 100],
  stagesReached: [10, 25, 50, 75, 100],
  codexCells: [3, 9, 15, 24, 30],
  killsTotal: [50, 250, 1_000, 5_000, 20_000],
} as const satisfies Record<string, readonly number[]>

export const ACHIEVEMENTS: readonly AchievementDefinition[] = Object.entries(ACHIEVEMENT_STEPS).flatMap(
  ([counter, thresholds]) =>
    thresholds.map((threshold) => ({
      id: `${counter}-${threshold}`,
      counter,
      threshold,
    })),
)

export function incrementAchievementCounter(state: EngineState, counter: string, amount: number): EngineState {
  return refreshAchievementCounters({
    ...state,
    achievements: {
      ...state.achievements,
      counters: {
        ...state.achievements.counters,
        [counter]: (state.achievements.counters[counter] ?? 0) + amount,
      },
    },
  })
}

export function refreshAchievementCounters(state: EngineState): EngineState {
  return {
    ...state,
    achievements: {
      ...state.achievements,
      counters: {
        ...state.achievements.counters,
        rebirths: state.prestigeCount,
        questsClaimed: state.quests.claimed.length,
        highestLevelEver: state.highestLevelEver,
        stagesReached: state.stage,
        codexCells: getCodexCellCount(state),
      },
    },
  }
}

export function getAchievementProgress(state: EngineState, counter: string): number {
  return refreshAchievementCounters(state).achievements.counters[counter] ?? 0
}

export function isAchievementUnlocked(state: EngineState, achievement: AchievementDefinition): boolean {
  return getAchievementProgress(state, achievement.counter) >= achievement.threshold
}
