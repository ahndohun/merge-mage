import Phaser from "phaser"
import { EventBus, type Unsubscribe } from "../../bridge/EventBus"
import { assertNever, type Element, type EngineEvent, type EngineState } from "../../engine/types"
import { EngineEventBridge } from "../GameEventBridge"
import {
  createBattleAnimations,
  getBossKindForStage,
  getMobKindForStage,
  preloadBattleAssets,
} from "../TextureKeys"
import { registerUtilityTextures } from "../UtilityTextures"
import { BattleAudio } from "./BattleAudio"
import { BattleEffects } from "./BattleEffects"
import { BOSS_ENRAGE_MS, BOSS_WAVE_NUMBER, BattleLayout, isBossWave } from "./BattleLayout"
import { BattleBanner } from "./BattleBanner"
import { mirrorBattleState } from "./BattleDataMirror"
import { drawBattleFrame } from "./BattleFrame"
import { BattleLoadingView } from "./BattleLoadingView"
import { BattleMobView } from "./BattleMobView"
import { BattleWizardView } from "./BattleWizardView"

const ELEMENT_CYCLE: readonly Element[] = ["fire", "frost", "holy"]
const MOB_POOL_SIZE = 36

export class BattleScene extends Phaser.Scene {
  private wizard: BattleWizardView | null = null
  private banner: BattleBanner | null = null
  private effects: BattleEffects | null = null
  private unsubscribeState: Unsubscribe | null = null
  private unsubscribeEvents: Unsubscribe | null = null
  private currentState: EngineState | null = null
  private lastStage = 0
  private lastWave = 0
  private slowUntil = 0
  private slowFactor = 1
  private audio: BattleAudio | null = null

  private readonly activeMobs: BattleMobView[] = []
  private readonly mobPool: BattleMobView[] = []

  constructor() {
    super("BattleScene")
  }

  preload(): void {
    registerUtilityTextures(this)
    new BattleLoadingView(this)
    preloadBattleAssets(this)
  }

  create(): void {
    EngineEventBridge.install()
    registerUtilityTextures(this)
    createBattleAnimations(this)
    this.cameras.main.setBackgroundColor("#05060a")
    drawBattleFrame(this)

    this.wizard = new BattleWizardView(this)
    this.effects = new BattleEffects(this)
    this.banner = new BattleBanner(this)
    this.audio = new BattleAudio(this)
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
    this.audio?.syncMusic(state)

    if (waveChanged) {
      const stageChanged = this.lastStage > 0 && state.stage !== this.lastStage
      this.resetWave(state)
      if (stageChanged) {
        this.effects?.stageFlash()
        this.banner?.showSlide(`STAGE ${state.stage}`, 0xe6b450)
      } else {
        this.banner?.show(`STAGE ${state.stage} — WAVE ${state.wave}/${BOSS_WAVE_NUMBER}`, 0xfff0a8)
      }
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
        this.banner?.pop("WAVE CLEAR", 0xe6b450)
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
        this.effects?.levelUp({ x: BattleLayout.wizardX, y: BattleLayout.wizardY })
        return
      case "slow":
        this.slowFactor = event.factor
        this.slowUntil = this.time.now + event.durationMs
        return
      default:
        return assertNever(event)
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
        mob = this.spawnMob(hp, index, isBossWave(state.wave), state.stage)
      }

      mob.syncHp(hp)
    })
  }

  private spawnMob(hp: number, index: number, isBoss: boolean, stage: number): BattleMobView {
    const mob = this.mobPool.pop() ?? new BattleMobView(this)
    mob.spawn({
      hp,
      index,
      isBoss,
      element: getElementForIndex(index),
      mobKind: getMobKindForStage(stage),
      bossKind: getBossKindForStage(stage),
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
    wizard.playCast(() => {
      effects.fireProjectile({
        from: { x: BattleLayout.castX, y: BattleLayout.castY },
        to: targetPoint,
        element: event.element,
        onImpact: () => {
          target.flashHit(this)
          effects.impact(event.element, targetPoint)
          effects.showDamage(targetPoint, event.damage, event.critical)
          this.audio?.playMobHit(target.isBoss())
          wizard.flash(event.element)
        },
      })
    })
  }

  private playMobDeath(mob: BattleMobView): void {
    const effects = this.effects
    const point = mob.getImpactPoint()
    const element = mob.getElement()

    if (effects !== null) {
      if (mob.isBoss()) {
        effects.bossDeath(point, element)
      } else {
        effects.death(point, element)
      }
    }

    this.audio?.playGold()
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
    this.wizard?.playFail()
    this.cameras.main.shake(150, 0.004)
    this.banner?.show(`STAGE ${stage} — WAVE RESET`, 0xff6a6a)
  }

  private syncBossEnrage(): void {
    const state = this.currentState
    if (state === null || !isBossWave(state.wave)) {
      this.effects?.setBossEnragePulse(false)
      return
    }

    const boss = this.activeMobs.find((mob) => mob.isBoss())
    if (boss !== undefined) {
      boss.syncBars(state.bossElapsedMs / BOSS_ENRAGE_MS)
    }
    this.effects?.setBossEnragePulse(BOSS_ENRAGE_MS - state.bossElapsedMs <= 5_000)
  }

  private cleanup(): void {
    this.unsubscribeState?.()
    this.unsubscribeEvents?.()
    this.unsubscribeState = null
    this.unsubscribeEvents = null
    this.audio?.destroy()
    this.audio = null
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
