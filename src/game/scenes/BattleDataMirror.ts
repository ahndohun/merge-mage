import type { EngineState } from "../../engine/types"
import { isBossWave } from "./BattleLayout"

export function mirrorBattleState(state: EngineState): void {
  document.body.dataset["stage"] = `${state.stage}`
  document.body.dataset["wave"] = `${state.wave}`
  document.body.dataset["gold"] = `${Math.floor(state.gold)}`
  document.body.dataset["bossHp"] = `${getBossHp(state)}`
}

function getBossHp(state: EngineState): number {
  if (!isBossWave(state.wave)) {
    return 0
  }

  return Math.max(0, Math.ceil(state.enemiesHp[0] ?? 0))
}
