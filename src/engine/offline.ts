import { OFFLINE_CAP_MS, OFFLINE_EFFICIENCY } from "./constants"
import type { EngineState } from "./types"

export function computeOfflineGold(state: EngineState, nowServerTs: number): number {
  if (state.lastSeenServerTs === null) {
    return 0
  }

  const elapsedMs = Math.max(0, nowServerTs - state.lastSeenServerTs)
  const cappedMs = Math.min(elapsedMs, OFFLINE_CAP_MS)

  return state.recentGoldPerSecond * (cappedMs / 1_000) * OFFLINE_EFFICIENCY
}
