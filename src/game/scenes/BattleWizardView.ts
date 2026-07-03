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
  private baseTint = 0xffffff

  constructor(private readonly scene: Phaser.Scene) {
    this.sprite = scene.add
      .sprite(BattleLayout.wizardX, BattleLayout.wizardY, TextureKeys.wizard2.idle(1))
      .setOrigin(0.46, 0.78)
      .setDepth(18)
      .setScale(1)
    this.sprite.play(AnimationKeys.wizard2.idle)
    scene.tweens.add({
      targets: this.sprite,
      y: BattleLayout.wizardY - 3,
      duration: 820,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })
  }

  playCast(onLaunch: () => void): void {
    this.sprite.play(AnimationKeys.wizard2.idle, true)
    onLaunch()
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

  getOrbitCenter(): Point {
    return {
      x: Math.round(this.sprite.x + this.sprite.displayWidth * (0.5 - this.sprite.originX)),
      y: Math.round(this.sprite.y + this.sprite.displayHeight * (0.5 - this.sprite.originY)),
    }
  }

  playHit(): void {
    this.clearTint()
    this.sprite.play(AnimationKeys.wizard2.hurt)
    this.sprite.once("animationcomplete", () => {
      this.sprite.play(AnimationKeys.wizard2.idle, true)
    })
  }

  playDeath(): void {
    this.clearTint()
    this.sprite.play(AnimationKeys.wizard2.death)
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

  syncSkinTint(tint: number): void {
    this.baseTint = tint
    if (this.tintTimer === null) {
      this.applyBaseTint()
    }
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
      this.applyBaseTint()
    })
  }

  private clearTint(): void {
    this.tintTimer?.remove()
    this.tintTimer = null
    this.applyBaseTint()
  }

  private applyBaseTint(): void {
    if (this.baseTint === 0xffffff) {
      this.sprite.clearTint()
      return
    }
    this.sprite.setTint(this.baseTint).setTintMode(Phaser.TintModes.MULTIPLY)
  }
}
