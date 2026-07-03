import Phaser from "phaser"
import { getBossKindForStage, getMobKindForStage } from "../TextureKeys"
import { getElementForIndex } from "./BattleLayout"
import { BattleMobView } from "./BattleMobView"

const MOB_POOL_SIZE = 36

type SpawnBattleMobInput = {
  readonly scene: Phaser.Scene
  readonly mobPool: BattleMobView[]
  readonly activeMobs: BattleMobView[]
  readonly hp: number
  readonly index: number
  readonly isBoss: boolean
  readonly stage: number
  readonly wave: number
}

export function prewarmBattleMobs(scene: Phaser.Scene, mobPool: BattleMobView[]): void {
  for (let index = 0; index < MOB_POOL_SIZE; index += 1) {
    mobPool.push(new BattleMobView(scene))
  }
}

export function spawnBattleMob(input: SpawnBattleMobInput): BattleMobView {
  const mob = input.mobPool.pop() ?? new BattleMobView(input.scene)
  mob.spawn({
    hp: input.hp,
    index: input.index,
    isBoss: input.isBoss,
    element: getElementForIndex(input.index),
    mobKind: getMobKindForStage(input.stage),
    bossKind: getBossKindForStage(input.stage),
    stage: input.stage,
    wave: input.wave,
  })
  input.activeMobs.push(mob)
  return mob
}
