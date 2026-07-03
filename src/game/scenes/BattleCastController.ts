import Phaser from "phaser"
import type { EngineEvent, EngineState } from "../../engine/types"
import type { BattleAudio } from "./BattleAudio"
import type { BattleEffects } from "./BattleEffects"
import type { BattleMobView } from "./BattleMobView"
import type { BattleWizardView } from "./BattleWizardView"
import { OrbitingTomesView } from "./OrbitingTomesView"

export class BattleCastController {
  private readonly orbitingTomes: OrbitingTomesView
  private readonly dyingMobsByTargetIndex = new Map<number, BattleMobView>()

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly wizard: BattleWizardView,
  ) {
    this.orbitingTomes = new OrbitingTomesView(scene, wizard.getOrbitCenter())
  }

  update(time: number): void {
    this.orbitingTomes.update(time, this.wizard.getOrbitCenter())
  }

  syncState(state: EngineState): void {
    this.orbitingTomes.syncEquipped(state.equipped)
  }

  clearDyingTargets(): void {
    this.dyingMobsByTargetIndex.clear()
  }

  trackRemovedTarget(index: number, mob: BattleMobView): void {
    this.dyingMobsByTargetIndex.set(index, mob)
  }

  playCast(input: {
    readonly event: Extract<EngineEvent, { readonly type: "cast" }>
    readonly activeMobs: readonly BattleMobView[]
    readonly effects: BattleEffects
    readonly audio: BattleAudio | null
  }): void {
    const target = input.activeMobs[input.event.targetIndex] ?? this.dyingMobsByTargetIndex.get(input.event.targetIndex)
    if (target === undefined) {
      return
    }

    this.wizard.playCast(() => undefined)
    this.orbitingTomes.playCast(input.event.slotIdx, (origin) => {
      input.effects.fireProjectile({
        from: origin,
        target,
        element: input.event.element,
        onImpact: (impactPoint) => {
          if (target.isActive()) {
            target.flashHit(this.scene)
          }
          input.effects.impact(input.event.element, impactPoint)
          input.effects.showDamage(impactPoint, input.event.damage, input.event.critical)
          input.audio?.playMobHit(target.isBoss())
          this.wizard.flash(input.event.element)
        },
      })
    })
  }

  destroy(): void {
    this.orbitingTomes.destroy()
    this.dyingMobsByTargetIndex.clear()
  }
}
