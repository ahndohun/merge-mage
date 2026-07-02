import Phaser from "phaser"
import { EventBus, type Unsubscribe } from "../../bridge/EventBus"
import type { Element, EngineEvent, EngineState } from "../../engine/types"
import { EngineEventBridge } from "../GameEventBridge"
import { ElementColors, TextureKeys, registerPlaceholderTextures } from "../TextureKeys"
import { BattleEffects } from "./BattleEffects"
import { BOSS_ENRAGE_MS, BOSS_WAVE_NUMBER, BattleLayout, isBossWave } from "./BattleLayout"
import { BattleBanner } from "./BattleBanner"
import { mirrorBattleState } from "./BattleDataMirror"
import { drawBattleFrame } from "./BattleFrame"
import { BattleMobView } from "./BattleMobView"

const ELEMENT_CYCLE: readonly Element[] = ["fire", "frost", "holy"]
const MOB_POOL_SIZE = 36

export class BattleScene extends Phaser.Scene {
  private wizard: Phaser.GameObjects.Image | null = null
  private banner: BattleBanner | null = null
  private effects: BattleEffects | null = null
  private unsubscribeState: Unsubscribe | null = null
  private unsubscribeEvents: Unsubscribe | null = null
  private currentState: EngineState | null = null
  private lastStage = 0
  private lastWave = 0
  private slowUntil = 0
  private slowFactor = 1

  private readonly activeMobs: BattleMobView[] = []
  private readonly mobPool: BattleMobView[] = []

  constructor() {
    super("BattleScene")
  }

  create(): void {
    EngineEventBridge.install()
    registerPlaceholderTextures(this)
    this.cameras.main.setBackgroundColor("#05060a")
    drawBattleFrame(this)

    this.wizard = this.add
      .image(BattleLayout.wizardX, BattleLayout.wizardY, TextureKeys.wizard)
      .setDepth(18)
      .setScale(1.7)
    this.tweens.add({
      targets: this.wizard,
      y: BattleLayout.wizardY - 3,
      duration: 820,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })

    this.effects = new BattleEffects(this)
    this.banner = new BattleBanner(this)
    this.prewarmMobs()
    this.banner.show(`STAGE 1 — WAVE 1/${BOSS_WAVE_NUMBER}`, 0xfff0a8)
    this.unsubscribeState = EngineEventBridge.onState((state) => this.handleState(state))
    this.unsubscribeEvents = EngineEventBridge.onEvents((events) => this.handleEvents(events))
    this.events.once("shutdown", () => this.cleanup())

    EventBus.emit("current-scene-ready", this)
  }

  update(time: number, delta: number): void {
    this.slowFactor = time < this.slowUntil ? this.slowFactor : 1

    for (const mob of this.activeMobs) {
      mob.update(time, delta, this.slowFactor)
    }

    this.syncBossEnrage()
  }

  private prewarmMobs(): void {
    for (let index = 0; index < MOB_POOL_SIZE; index += 1) {
      this.mobPool.push(new BattleMobView(this))
    }
  }

  private handleState(state: EngineState): void {
    const waveChanged = state.stage !== this.lastStage || state.wave !== this.lastWave
    this.currentState = state
    mirrorBattleState(state)

    if (waveChanged) {
      this.resetWave(state)
      this.banner?.show(`STAGE ${state.stage} — WAVE ${state.wave}/${BOSS_WAVE_NUMBER}`, 0xfff0a8)
      this.lastStage = state.stage
      this.lastWave = state.wave
      return
    }

    this.reconcileMobs(state)
  }

  private handleEvents(events: readonly EngineEvent[]): void {
    for (const event of events) {
      this.handleEvent(event)
    }
  }

  private handleEvent(event: EngineEvent): void {
    switch (event.type) {
      case "cast":
        this.playCast(event)
        return
      case "kill":
        return
      case "waveClear":
        this.banner?.show(`STAGE ${event.stage} — WAVE ${event.wave} CLEAR`, 0xfff0a8)
        return
      case "bossSpawn":
        this.playBossEntrance()
        return
      case "bossKill":
        this.banner?.show(`BOSS DOWN +${event.gold}`, 0xfff06a)
        return
      case "bossFail":
        this.playBossFail(event.stage)
        return
      case "levelUp":
        this.banner?.show(`WIZARD LV ${event.wizardLevel} +${event.skillPoints}`, 0x6dd7ff)
        return
      case "slow":
        this.slowFactor = event.factor
        this.slowUntil = this.time.now + event.durationMs
        return
      default:
        return event
    }
  }

  private resetWave(state: EngineState): void {
    this.activeMobs.splice(0).forEach((mob) => {
      mob.hide()
      this.mobPool.push(mob)
    })
    this.reconcileMobs(state)

    if (isBossWave(state.wave)) {
      this.playBossEntrance()
    }
  }

  private reconcileMobs(state: EngineState): void {
    while (this.activeMobs.length > state.enemiesHp.length) {
      const mob = this.activeMobs.shift()
      if (mob === undefined) {
        return
      }

      this.playMobDeath(mob)
    }

    state.enemiesHp.forEach((hp, index) => {
      let mob = this.activeMobs[index]
      if (mob === undefined) {
        mob = this.spawnMob(hp, index, isBossWave(state.wave))
      }

      mob.syncHp(hp)
    })
  }

  private spawnMob(hp: number, index: number, isBoss: boolean): BattleMobView {
    const mob = this.mobPool.pop() ?? new BattleMobView(this)
    mob.spawn({
      hp,
      index,
      isBoss,
      element: getElementForIndex(index),
    })
    this.activeMobs.push(mob)
    return mob
  }

  private playCast(event: Extract<EngineEvent, { readonly type: "cast" }>): void {
    const target = this.activeMobs[0]
    const wizard = this.wizard
    const effects = this.effects
    if (target === undefined || wizard === null || effects === null) {
      return
    }

    const targetPoint = target.getImpactPoint()
    effects.fireProjectile({
      from: { x: BattleLayout.castX, y: BattleLayout.castY },
      to: targetPoint,
      element: event.element,
      onImpact: () => {
        target.flashHit(this)
        effects.impact(event.element, targetPoint)
        effects.showDamage(targetPoint, event.damage, event.critical)
        this.flashWizard(event.element)
      },
    })
  }

  private playMobDeath(mob: BattleMobView): void {
    const effects = this.effects
    const point = mob.getImpactPoint()
    const element = mob.getElement()

    if (effects !== null) {
      effects.death(point, element)
    }

    mob.playDeath(this, () => {
      this.mobPool.push(mob)
    })
  }

  private playBossEntrance(): void {
    const boss = this.activeMobs.find((mob) => mob.isBoss())
    if (boss !== undefined) {
      boss.playEntrance(this)
    }

    this.cameras.main.shake(150, 0.003)
  }

  private playBossFail(stage: number): void {
    const wizard = this.wizard
    if (wizard !== null) {
      wizard.setTint(0xff425c).setTintMode(Phaser.TintModes.FILL)
      this.tweens.add({
        targets: wizard,
        x: BattleLayout.wizardX - 18,
        alpha: 0.45,
        duration: 120,
        yoyo: true,
        ease: "Quad.easeOut",
        onComplete: () => {
          wizard.setPosition(BattleLayout.wizardX, BattleLayout.wizardY).setAlpha(1).clearTint()
        },
      })
    }

    this.cameras.main.shake(150, 0.004)
    this.banner?.show(`STAGE ${stage} — WAVE RESET`, 0xff6a6a)
  }

  private flashWizard(element: Element): void {
    const wizard = this.wizard
    if (wizard === null) {
      return
    }

    wizard.setTint(ElementColors[element]).setTintMode(Phaser.TintModes.ADD)
    this.time.delayedCall(90, () => {
      wizard.clearTint()
    })
  }

  private syncBossEnrage(): void {
    const state = this.currentState
    if (state === null || !isBossWave(state.wave)) {
      return
    }

    const boss = this.activeMobs.find((mob) => mob.isBoss())
    if (boss !== undefined) {
      boss.syncBars(state.bossElapsedMs / BOSS_ENRAGE_MS)
    }
  }

  private cleanup(): void {
    this.unsubscribeState?.()
    this.unsubscribeEvents?.()
    this.unsubscribeState = null
    this.unsubscribeEvents = null
    this.effects?.clear()
    this.activeMobs.splice(0).forEach((mob) => mob.hide())
    this.mobPool.splice(0)
  }
}

function getElementForIndex(index: number): Element {
  const element = ELEMENT_CYCLE[index % ELEMENT_CYCLE.length]

  if (element === undefined) {
    return "fire"
  }

  return element
}
