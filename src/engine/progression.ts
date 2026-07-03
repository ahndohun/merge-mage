import { incrementAchievementCounter, refreshAchievementCounters } from "./achievements.js"
import { recordBookCodex } from "./codex.js"
import { refreshQuests } from "./quests.js"
import type { EngineState, Spellbook } from "./types.js"

export function trackProgress(
  state: EngineState,
  counters: readonly { readonly counter: string; readonly amount: number }[] = [],
  codexBook?: Spellbook,
): EngineState {
  const codexState = codexBook === undefined ? state : recordBookCodex(state, codexBook)
  const counted = counters.reduce((current, item) => incrementAchievementCounter(current, item.counter, item.amount), codexState)
  return refreshQuests(refreshAchievementCounters(counted))
}
