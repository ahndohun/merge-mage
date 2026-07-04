import Phaser from "phaser"
import { assertNever, type EngineState } from "../../engine/types"
import { EventBus } from "../../bridge/EventBus"
import { readAudioMutedPreference, type GameSfx } from "../GameAudio"
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
  private removeAudioBusListeners: (() => void) | null = null

  constructor(private readonly scene: Phaser.Scene) {
    this.audioMuted = readAudioMutedPreference()
    this.scene.sound.setMute(this.audioMuted)
    this.dungeonMusic = this.scene.sound.add(TextureKeys.bgm.dungeon, { loop: true, volume: 0.4 })
    this.bossMusic = this.scene.sound.add(TextureKeys.bgm.boss, { loop: true, volume: 0.42 })
    this.installGestureStart()
    this.installAudioBusEvents()
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
    this.removeAudioBusListeners?.()
    // once("unlocked") auto-clears when it fires, but a scene torn down before
    // the audio gesture would leave it dangling on the shared SoundManager.
    this.scene.sound.off("unlocked", this.onAudioUnlocked, this)
    this.dungeonMusic.destroy()
    this.bossMusic.destroy()
    this.removeAudioGestureListeners = null
    this.removeAudioBusListeners = null
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

  private installAudioBusEvents(): void {
    const removeMuted = EventBus.on("audio:muted", (muted) => {
      this.audioMuted = muted
      this.scene.sound.setMute(this.audioMuted)
      this.updateMusic()
    })
    const removeSfx = EventBus.on("audio:sfx", (sfx) => {
      this.playUiSfx(sfx)
    })
    this.removeAudioBusListeners = () => {
      removeMuted()
      removeSfx()
    }
  }

  private startAudioAfterGesture(): void {
    if (this.audioStarted) {
      return
    }

    this.audioStarted = true
    if (this.scene.sound.locked) {
      this.scene.sound.once("unlocked", this.onAudioUnlocked, this)
      return
    }

    this.updateMusic()
  }

  private readonly onAudioUnlocked = (): void => {
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
