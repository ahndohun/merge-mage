import Phaser from "phaser"
import { EventBus, type Unsubscribe } from "../../bridge/EventBus"
import { assertNever, type EngineEvent, type EngineState } from "../../engine/types"
import { createTranslator, getInitialLocale, type Translator } from "../../ui/i18n"
import { EngineEventBridge } from "../GameEventBridge"
import { createBattleAnimations, preloadBattleAssets } from "../TextureKeys"
import { registerDamageFont, registerUtilityTextures } from "../UtilityTextures"
import { BattleAudio } from "./BattleAudio"
import { BattleCastController } from "./BattleCastController"
import { BattleEffects } from "./BattleEffects"
import { BOSS_ENRAGE_MS, BattleLayout, isBossWave } from "./BattleLayout"
import { BattleBanner } from "./BattleBanner"
import { mirrorBattleState } from "./BattleDataMirror"
import { drawBattleFrame } from "./BattleFrame"
import { BattleLoadingView } from "./BattleLoadingView"
import { prewarmBattleMobs, spawnBattleMob } from "./BattleMobSpawner"
import { BattleMobView } from "./BattleMobView"
import { BattleWizardView } from "./BattleWizardView"

export class BattleScene extends Phaser.Scene {
  private wizard: BattleWizardView | null = null
  private banner: BattleBanner | null = null
  private effects: BattleEffects | null = null
  private unsubscribeState: Unsubscribe | null = null
  private unsubscribeEvents: Unsubscribe | null = null
  private unsubscribeLocale: Unsubscribe | null = null
  private currentState: EngineState | null = null
  private t: Translator = createTranslator(getInitialLocale())
  private lastStage = 0
  private lastWave = 0
  private slowUntil = 0
  private slowFactor = 1
  private audio: BattleAudio | null = null
  private castController: BattleCastController | null = null

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
    registerDamageFont(this)
    createBattleAnimations(this)
    this.cameras.main.setBackgroundColor("#05060a")
    drawBattleFrame(this)

    this.wizard = new BattleWizardView(this)
    this.castController = new BattleCastController(this, this.wizard)
    this.effects = new BattleEffects(this)
    this.banner = new BattleBanner(this)
    this.audio = new BattleAudio(this)
    this.t = createTranslator(getInitialLocale())
    prewarmBattleMobs(this, this.mobPool)
    this.unsubscribeState = EngineEventBridge.onState((state) => this.handleState(state))
    this.unsubscribeEvents = EngineEventBridge.onEvents((events) => this.handleEvents(events))
    this.unsubscribeLocale = EventBus.on("locale:changed", (locale) => {
      this.t = createTranslator(locale)
    })
    this.events.once("shutdown", () => this.cleanup())

    EventBus.emit("current-scene-ready", this)
  }

  update(time: number, delta: number): void {
    this.slowFactor = time < this.slowUntil ? this.slowFactor : 1

    for (const mob of this.activeMobs) {
      mob.update(time, delta, this.slowFactor)
    }
    this.castController?.update(time)

    this.syncBossEnrage()
  }

  private handleState(state: EngineState): void {
    const waveChanged = state.stage !== this.lastStage || state.wave !== this.lastWave
    this.currentState = state
    mirrorBattleState(state)
    this.castController?.syncState(state)
    this.audio?.syncMusic(state)

    if (waveChanged) {
      const stageChanged = this.lastStage > 0 && state.stage !== this.lastStage
      this.resetWave(state)
      if (stageChanged) {
        this.effects?.stageFlash()
        this.banner?.showSlide(this.t.battleStage(state.stage), 0xe6b450)
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
      case "petCast":
        this.playPetCast(event)
        return
      case "kill":
        return
      case "waveClear":
        this.banner?.pop(this.t("battleWaveClear"), 0xe6b450)
        return
      case "bossSpawn":
        this.playBossEntrance()
        return
      case "bossKill":
        this.banner?.show(this.t.battleBossDown(event.gold), 0xfff06a)
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
      case "riftComplete":
        this.banner?.show(event.kind === "golden" ? `RIFT +${Math.floor(event.reward)}` : "TRIAL CLEAR", 0xe6b450)
        return
      default:
        return assertNever(event)
    }
  }

  private resetWave(state: EngineState): void {
    this.castController?.clearDyingTargets()
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
    this.castController?.clearDyingTargets()
    let removedTargetIndex = 0
    while (this.activeMobs.length > state.enemiesHp.length) {
      const mob = this.activeMobs.shift()
      if (mob === undefined) {
        return
      }

      this.castController?.trackRemovedTarget(removedTargetIndex, mob)
      this.playMobDeath(mob)
      removedTargetIndex += 1
    }

    state.enemiesHp.forEach((hp, index) => {
      let mob = this.activeMobs[index]
      if (mob === undefined) {
        mob = spawnBattleMob({
          scene: this,
          mobPool: this.mobPool,
          activeMobs: this.activeMobs,
          hp,
          index,
          isBoss: isBossWave(state.wave),
          stage: state.stage,
          wave: state.wave,
        })
      }

      mob.syncHp(hp)
    })
  }

  private playCast(event: Extract<EngineEvent, { readonly type: "cast" }>): void {
    const effects = this.effects
    if (effects === null) {
      return
    }

    this.castController?.playCast({
      event,
      activeMobs: this.activeMobs,
      effects,
      audio: this.audio,
    })
  }

  private playPetCast(event: Extract<EngineEvent, { readonly type: "petCast" }>): void {
    const effects = this.effects
    if (effects === null) {
      return
    }

    this.castController?.playPetCast({
      event,
      activeMobs: this.activeMobs,
      effects,
      audio: this.audio,
    })
  }

  private playMobDeath(mob: BattleMobView): void {
    const effects = this.effects
    const point = mob.getImpactPoint()
    const element = mob.getElement()
    const coinTarget = this.castController?.getFamiliarCoinTarget()

    if (effects !== null) {
      if (mob.isBoss()) {
        effects.bossDeath(point, element, coinTarget)
      } else {
        effects.death(point, element, coinTarget)
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
    this.banner?.show(this.t.battleStageWaveReset(stage), 0xff6a6a)
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
    this.unsubscribeLocale?.()
    this.unsubscribeState = null
    this.unsubscribeEvents = null
    this.unsubscribeLocale = null
    this.audio?.destroy()
    this.audio = null
    this.effects?.clear()
    this.castController?.destroy()
    this.castController = null
    this.banner?.destroy()
    this.banner = null
    this.wizard?.destroy()
    this.wizard = null
    this.activeMobs.splice(0).forEach((mob) => mob.hide())
    this.mobPool.splice(0)
  }
}
