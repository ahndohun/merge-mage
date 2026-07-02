import Phaser from "phaser"
import type { Element } from "../../engine/types"
import { AnimationKeys, ElementColors, TextureKeys } from "../TextureKeys"
import { BattleLayout } from "./BattleLayout"

export class BattleWizardView {
  readonly sprite: Phaser.GameObjects.Sprite

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

  playCast(onLaunch: () => void): void {
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

    this.sprite.off("animationupdate", launchOnFrame)
    this.sprite.on("animationupdate", launchOnFrame)
    this.sprite.once("animationcomplete", () => {
      this.sprite.off("animationupdate", launchOnFrame)
      launch()
      this.sprite.play(AnimationKeys.wizard.idle, true)
    })
    this.sprite.play(AnimationKeys.wizard.cast)
  }

  playHit(): void {
    this.sprite.play(AnimationKeys.wizard.hit)
    this.sprite.once("animationcomplete", () => {
      this.sprite.play(AnimationKeys.wizard.idle, true)
    })
  }

  playFail(): void {
    this.playHit()
    this.sprite.setTint(0xff425c).setTintMode(Phaser.TintModes.FILL)
    this.scene.tweens.add({
      targets: this.sprite,
      x: BattleLayout.wizardX - 18,
      alpha: 0.45,
      duration: 120,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.sprite.setPosition(BattleLayout.wizardX, BattleLayout.wizardY).setAlpha(1).clearTint()
      },
    })
  }

  flash(element: Element): void {
    this.sprite.setTint(ElementColors[element]).setTintMode(Phaser.TintModes.ADD)
    this.scene.time.delayedCall(90, () => {
      this.sprite.clearTint()
    })
  }
}
