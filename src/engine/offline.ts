import { OFFLINE_CAP_MS, OFFLINE_EFFICIENCY } from "./constants.js"
import { getEquippedRelicEffects } from "./relics.js"
import type { EngineState } from "./types.js"

export function computeOfflineGold(state: EngineState, nowServerTs: number): number {
  if (state.lastSeenServerTs === null) {
    return 0
  }

  const elapsedMs = Math.max(0, nowServerTs - state.lastSeenServerTs)
  const cappedMs = Math.min(elapsedMs, OFFLINE_CAP_MS)

  const efficiency = Math.min(1, OFFLINE_EFFICIENCY + getEquippedRelicEffects(state.relics).offlineEfficiencyBonus)
  return state.recentGoldPerSecond * (cappedMs / 1_000) * efficiency
}
