import Phaser from "phaser"
import { getEquippedSkin } from "../../engine/camp"
import type { EngineEvent, EngineState } from "../../engine/types"
import type { BattleAudio } from "./BattleAudio"
import type { BattleEffects } from "./BattleEffects"
import { BattleFamiliarView } from "./BattleFamiliarView"
import type { BattleMobView } from "./BattleMobView"
import type { BattleWizardView } from "./BattleWizardView"
import { OrbitingTomesView } from "./OrbitingTomesView"

export class BattleCastController {
  private readonly orbitingTomes: OrbitingTomesView
  private readonly familiar: BattleFamiliarView
  private readonly dyingMobsByTargetIndex = new Map<number, BattleMobView>()

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly wizard: BattleWizardView,
  ) {
    this.orbitingTomes = new OrbitingTomesView(scene, wizard.getOrbitCenter())
    this.familiar = new BattleFamiliarView(scene, wizard.getOrbitCenter())
  }

  update(time: number): void {
    const center = this.wizard.getOrbitCenter()
    this.orbitingTomes.update(time, center)
    this.familiar.update(time, center)
  }

  syncState(state: EngineState): void {
    this.orbitingTomes.syncEquipped(state.equipped)
    this.familiar.syncPet(state.pet)
    this.wizard.syncSkinTint(getEquippedSkin(state).tint)
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

  playPetCast(input: {
    readonly event: Extract<EngineEvent, { readonly type: "petCast" }>
    readonly activeMobs: readonly BattleMobView[]
    readonly effects: BattleEffects
    readonly audio: BattleAudio | null
  }): void {
    const target = input.activeMobs[input.event.targetIndex] ?? this.dyingMobsByTargetIndex.get(input.event.targetIndex)
    if (target === undefined) {
      return
    }

    this.familiar.playCast((origin) => {
      input.effects.fireProjectile({
        from: origin,
        target,
        element: "arcane",
        onImpact: (impactPoint) => {
          if (target.isActive()) {
            target.flashHit(this.scene)
          }
          input.effects.impact("arcane", impactPoint)
          input.effects.showDamage(impactPoint, input.event.damage, false)
          input.audio?.playMobHit(target.isBoss())
        },
      })
    })
  }

  getFamiliarCoinTarget(): { readonly x: number; readonly y: number } {
    return this.familiar.getCoinTarget()
  }

  destroy(): void {
    this.orbitingTomes.destroy()
    this.familiar.destroy()
    this.dyingMobsByTargetIndex.clear()
  }
}
