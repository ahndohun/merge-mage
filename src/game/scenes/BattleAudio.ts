import Phaser from "phaser"
import { assertNever, type EngineState } from "../../engine/types"
import { AUDIO_MUTED_EVENT, GAME_SFX_EVENT, readAudioMutedPreference, type GameSfx } from "../GameAudio"
import { TextureKeys } from "../TextureKeys"
import { isBossWave } from "./BattleLayout"

type ThrottledSfx = "hit" | "bossHit" | "gold"

export class BattleAudio {
  private readonly dungeonMusic: Phaser.Sound.BaseSound
  private readonly bossMusic: Phaser.Sound.BaseSound
  private audioStarted = false
  private audioMuted = false
  private nextHitSfxAt = 0
  private nextBossHitSfxAt = 0
  private nextGoldSfxAt = 0
  private state: EngineState | null = null
  private removeAudioGestureListeners: (() => void) | null = null
  private removeAudioEventListeners: (() => void) | null = null

  constructor(private readonly scene: Phaser.Scene) {
    this.audioMuted = readAudioMutedPreference()
    this.scene.sound.setMute(this.audioMuted)
    this.dungeonMusic = this.scene.sound.add(TextureKeys.bgm.dungeon, { loop: true, volume: 0.4 })
    this.bossMusic = this.scene.sound.add(TextureKeys.bgm.boss, { loop: true, volume: 0.42 })
    this.installGestureStart()
    this.installWindowEvents()
  }

  syncMusic(state: EngineState): void {
    this.state = state
    this.updateMusic()
  }

  playMobHit(isBoss: boolean): void {
    this.playThrottledSfx(isBoss ? TextureKeys.sfx.bossHit : TextureKeys.sfx.hit, isBoss ? "bossHit" : "hit")
  }

  playGold(): void {
    this.playThrottledSfx(TextureKeys.sfx.gold, "gold")
  }

  destroy(): void {
    this.removeAudioGestureListeners?.()
    this.removeAudioEventListeners?.()
    this.dungeonMusic.destroy()
    this.bossMusic.destroy()
    this.removeAudioGestureListeners = null
    this.removeAudioEventListeners = null
  }

  private installGestureStart(): void {
    const startAudio = () => this.startAudioAfterGesture()
    window.addEventListener("pointerdown", startAudio, { once: true })
    window.addEventListener("keydown", startAudio, { once: true })
    this.removeAudioGestureListeners = () => {
      window.removeEventListener("pointerdown", startAudio)
      window.removeEventListener("keydown", startAudio)
    }
  }

  private installWindowEvents(): void {
    const onMuted = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "boolean") {
        return
      }

      this.audioMuted = event.detail
      this.scene.sound.setMute(this.audioMuted)
      this.updateMusic()
    }
    const onSfx = (event: Event) => {
      if (!(event instanceof CustomEvent) || !isGameSfx(event.detail)) {
        return
      }

      this.playUiSfx(event.detail)
    }

    window.addEventListener(AUDIO_MUTED_EVENT, onMuted)
    window.addEventListener(GAME_SFX_EVENT, onSfx)
    this.removeAudioEventListeners = () => {
      window.removeEventListener(AUDIO_MUTED_EVENT, onMuted)
      window.removeEventListener(GAME_SFX_EVENT, onSfx)
    }
  }

  private startAudioAfterGesture(): void {
    if (this.audioStarted) {
      return
    }

    this.audioStarted = true
    if (this.scene.sound.locked) {
      this.scene.sound.once("unlocked", () => this.updateMusic())
      return
    }

    this.updateMusic()
  }

  private updateMusic(): void {
    if (!this.audioStarted || this.audioMuted) {
      this.dungeonMusic.stop()
      this.bossMusic.stop()
      return
    }

    const active = this.state !== null && isBossWave(this.state.wave) ? this.bossMusic : this.dungeonMusic
    const inactive = active === this.bossMusic ? this.dungeonMusic : this.bossMusic
    inactive.stop()

    if (!active.isPlaying) {
      active.play()
    }
  }

  private playThrottledSfx(key: string, throttle: ThrottledSfx): void {
    const now = this.scene.time.now
    const nextAt = this.getNextSfxTime(throttle)
    if (now < nextAt) {
      return
    }

    this.setNextSfxTime(throttle, now + 250)
    this.playSfx(key)
  }

  private playUiSfx(sfx: GameSfx): void {
    switch (sfx) {
      case "merge":
        this.playSfx(TextureKeys.sfx.merge)
        return
      case "confirm":
        this.playSfx(TextureKeys.sfx.confirm)
        return
      default:
        return assertNever(sfx)
    }
  }

  private playSfx(key: string): void {
    if (this.audioMuted) {
      return
    }

    this.scene.sound.play(key, { volume: 0.68 })
  }

  private getNextSfxTime(throttle: ThrottledSfx): number {
    switch (throttle) {
      case "hit":
        return this.nextHitSfxAt
      case "bossHit":
        return this.nextBossHitSfxAt
      case "gold":
        return this.nextGoldSfxAt
      default:
        return assertNever(throttle)
    }
  }

  private setNextSfxTime(throttle: ThrottledSfx, value: number): void {
    switch (throttle) {
      case "hit":
        this.nextHitSfxAt = value
        return
      case "bossHit":
        this.nextBossHitSfxAt = value
        return
      case "gold":
        this.nextGoldSfxAt = value
        return
      default:
        return assertNever(throttle)
    }
  }
}

function isGameSfx(value: unknown): value is GameSfx {
  return value === "merge" || value === "confirm"
}
