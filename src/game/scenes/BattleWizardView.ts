import Phaser from "phaser"
import type { CastElement } from "../../engine/types"
import { AnimationKeys, CastColors, TextureKeys } from "../TextureKeys"
import { BattleLayout, getStaffTipPoint } from "./BattleLayout"

type Point = {
  readonly x: number
  readonly y: number
}

export class BattleWizardView {
  readonly sprite: Phaser.GameObjects.Sprite

  private tintTimer: Phaser.Time.TimerEvent | null = null
  private castQueue: Array<() => void> = []
  private casting = false

  constructor(private readonly scene: Phaser.Scene) {
    this.sprite = scene.add
      .sprite(BattleLayout.wizardX, BattleLayout.wizardY, TextureKeys.wizard.idle)
      .setOrigin(0.46, 0.78)
      .setDepth(18)
      .setScale(1)
    this.sprite.play(AnimationKeys.wizard.idle)
    scene.tweens.add({
      targets: this.sprite,
      y: BattleLayout.wizardY - 3,
      duration: 820,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  /**
   * The battler can fire several casts in the same tick (one per equipped
   * book). Playing them all at once re-triggers sprite.play() on top of an
   * in-flight cast animation, which never cleans up the previous call's
   * "animationupdate" listener — every queued cast's launch callback then
   * fires off the newest animation's frames, so projectiles/impacts/tint
   * all land on the same instant instead of playing out one at a time.
   * Queuing here guarantees only one cast animation is ever playing on
   * this.sprite, so each request's own listeners are fully torn down
   * before the next one starts.
   */
  playCast(onLaunch: () => void): void {
    this.castQueue.push(onLaunch)
    this.pumpCastQueue()
  }

  private pumpCastQueue(): void {
    if (this.casting) {
      return
    }

    const onLaunch = this.castQueue.shift()
    if (onLaunch === undefined) {
      return
    }

    this.casting = true
    let launched = false
    const launch = () => {
      if (launched) {
        return
      }

      launched = true
      onLaunch()
    }
    const launchOnFrame = (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
      if (animation.key === AnimationKeys.wizard.cast && frame.index >= 5) {
        launch()
      }
    }

    this.sprite.on("animationupdate", launchOnFrame)
    this.sprite.once("animationcomplete", () => {
      this.sprite.off("animationupdate", launchOnFrame)
      launch()
      this.sprite.play(AnimationKeys.wizard.idle, true)
      this.casting = false
      this.pumpCastQueue()
    })
    this.sprite.play(AnimationKeys.wizard.cast)
  }

  getStaffTip(): Point {
    return getStaffTipPoint({
      x: this.sprite.x,
      y: this.sprite.y,
      displayWidth: this.sprite.displayWidth,
      displayHeight: this.sprite.displayHeight,
      originX: this.sprite.originX,
      originY: this.sprite.originY,
    })
  }

  playHit(): void {
    this.clearTint()
    this.sprite.play(AnimationKeys.wizard.hit)
    this.sprite.once("animationcomplete", () => {
      this.sprite.play(AnimationKeys.wizard.idle, true)
    })
  }

  playFail(): void {
    this.playHit()
    this.setTint(0xff425c, Phaser.TintModes.FILL, 120)
    this.scene.tweens.add({
      targets: this.sprite,
      x: BattleLayout.wizardX - 18,
      alpha: 0.45,
      duration: 120,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.sprite.setPosition(BattleLayout.wizardX, BattleLayout.wizardY).setAlpha(1)
      },
    })
  }

  flash(element: CastElement): void {
    this.setTint(CastColors[element], Phaser.TintModes.ADD, 70)
  }

  /**
   * Single owner for the wizard sprite's tint. Any caller that wants a
   * temporary tint goes through here so there is only ever one pending
   * clear timer — a later call always cancels an earlier one instead of
   * racing it, and the tint is always cleared even if an animation
   * transition happens first (see clearTint()/playHit()).
   *
   * The battler can land several casts in the same tick (one per equipped
   * book), each calling flash() back-to-back. If every call restarted a
   * fresh timer, the clear would keep getting pushed out and the tint
   * would never visibly go away. So only the *first* call in a burst
   * schedules the clear; later calls just refresh the color/mode without
   * extending how long the tint stays up.
   */
  private setTint(color: number, mode: Phaser.TintModes, durationMs: number): void {
    this.sprite.setTint(color).setTintMode(mode)
    if (this.tintTimer !== null) {
      return
    }

    this.tintTimer = this.scene.time.delayedCall(durationMs, () => {
      this.tintTimer = null
      this.sprite.clearTint()
    })
  }

  private clearTint(): void {
    this.tintTimer?.remove()
    this.tintTimer = null
    this.sprite.clearTint()
  }
}
