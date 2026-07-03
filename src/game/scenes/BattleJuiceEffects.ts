import Phaser from "phaser"
import { EventBus, type Unsubscribe } from "../../bridge/EventBus"
import type { CastElement } from "../../engine/types"
import { createTranslator, getInitialLocale, type Translator } from "../../ui/i18n"
import { CastColors, TextureKeys } from "../TextureKeys"
import { BattleLayout } from "./BattleLayout"
import { PixelTextLine } from "./PixelText"

type Point = {
  readonly x: number
  readonly y: number
}

export class BattleJuiceEffects {
  private readonly coins: Phaser.GameObjects.Image[]
  private readonly flashes: Phaser.GameObjects.Image[]
  private readonly muzzleFlashes: Phaser.GameObjects.Image[]
  private readonly ringDots: Phaser.GameObjects.Image[]
  private readonly levelUpText: PixelTextLine
  private t: Translator = createTranslator(getInitialLocale())
  private unsubscribeLocale: Unsubscribe | null = null

  constructor(private readonly scene: Phaser.Scene) {
    this.coins = Array.from({ length: 36 }, () => makeImage(scene, 34))
    this.flashes = Array.from({ length: 18 }, () => makeImage(scene, 33))
    this.muzzleFlashes = Array.from({ length: 18 }, () => makeImage(scene, 31))
    this.ringDots = Array.from({ length: 32 }, () => makeImage(scene, 35))
    this.levelUpText = new PixelTextLine(scene, 8, 58)
    this.unsubscribeLocale = EventBus.on("locale:changed", (locale) => {
      this.t = createTranslator(locale)
    })
  }

  clear(): void {
    this.unsubscribeLocale?.()
    this.unsubscribeLocale = null
    for (const image of [...this.coins, ...this.flashes, ...this.muzzleFlashes, ...this.ringDots]) {
      this.scene.tweens.killTweensOf(image)
      image.setVisible(false)
    }

    this.scene.tweens.killTweensOf(this.levelUpText.container)
    this.levelUpText.hide()
  }

  muzzleFlash(point: Point, element: CastElement): void {
    const flash = this.borrowImage(this.muzzleFlashes)
    if (flash === null) {
      return
    }

    // A muzzle flash must read as a spark, not a balloon: with six books
    // casting ~1/s each, a scale-5 (~155px) flash overlaps itself into a
    // permanent giant orb covering the wizard.
    flash.setPosition(point.x + 3, point.y - 1).setTint(CastColors[element]).setAlpha(0.75).setScale(0.6).setVisible(true)
    this.scene.tweens.add({
      targets: flash,
      scale: 2.2,
      alpha: 0,
      duration: 90,
      ease: "Quad.easeOut",
      onComplete: () => flash.setVisible(false),
    })
  }

  whitePop(point: Point, scale: number): void {
    this.pixelSparkBurst(point, 0xffffff, scale)
  }

  flyCoins(point: Point, bonusCoins = 0, target?: Point): void {
    const count = Math.min(5, 2 + (Math.round(point.x + point.y) % 2) + bonusCoins)
    for (let index = 0; index < count; index += 1) {
      this.flyCoin(point, index, target)
    }
  }

  levelUp(point: Point): void {
    this.ringBurst({ x: point.x, y: point.y - 42 })
    this.scene.tweens.killTweensOf(this.levelUpText.container)
    this.levelUpText.setText(this.t("battleLevelUp"), { tint: 0xe6b450, scale: 3 })
    this.levelUpText.show(point.x + 18, point.y - 86)
    this.levelUpText.container.setAlpha(1).setScale(0.8)
    this.scene.tweens.add({
      targets: this.levelUpText.container,
      y: point.y - 104,
      scale: 1,
      alpha: 0,
      duration: 620,
      ease: "Back.easeOut",
      onComplete: () => this.levelUpText.hide(),
    })
  }

  private flyCoin(point: Point, index: number, target?: Point): void {
    const coin = this.borrowImage(this.coins)
    if (coin === null) {
      return
    }

    const targetX = target === undefined ? BattleLayout.hudCoinTargetX + index * 7 : target.x + index * 3
    const targetY = target === undefined ? BattleLayout.hudCoinTargetY + (index % 2) * 4 : target.y + (index % 2) * 3
    coin.setPosition(point.x + index * 3, point.y - 8).setTint(0xe6b450).setAlpha(1).setScale(4).setVisible(true)
    this.scene.tweens.add({
      targets: coin,
      x: [coin.x, (coin.x + targetX) / 2 - 18, targetX],
      y: [coin.y, Math.min(coin.y, targetY) - 44 - index * 4, targetY],
      scale: [4, 5, 3],
      alpha: { from: 1, to: 0 },
      duration: 520 + index * 45,
      ease: "Cubic.easeOut",
      onComplete: () => coin.setVisible(false),
    })
  }

  private ringBurst(point: Point): void {
    const count = 16
    for (let index = 0; index < count; index += 1) {
      const dot = this.borrowImage(this.ringDots)
      if (dot === null) {
        return
      }

      const angle = (Math.PI * 2 * index) / count
      const startRadius = 8
      const endRadius = 36
      dot
        .setPosition(point.x + Math.cos(angle) * startRadius, point.y + Math.sin(angle) * startRadius)
        .setTint(0xe6b450)
        .setAlpha(1)
        .setScale(2)
        .setVisible(true)
      this.scene.tweens.add({
        targets: dot,
        x: point.x + Math.cos(angle) * endRadius,
        y: point.y + Math.sin(angle) * endRadius,
        scale: 1,
        alpha: 0,
        duration: 420,
        ease: "Cubic.easeOut",
        onComplete: () => dot.setVisible(false),
      })
    }
  }

  private pixelSparkBurst(point: Point, tint: number, scale: number): void {
    const count = Math.max(6, Math.min(14, Math.round(scale * 2)))
    const radius = 5 + scale * 4
    for (let index = 0; index < count; index += 1) {
      const flash = this.borrowImage(this.flashes)
      if (flash === null) {
        return
      }

      const angle = (Math.PI * 2 * index) / count
      const targetX = point.x + Math.cos(angle) * radius
      const targetY = point.y + Math.sin(angle) * radius
      flash.setPosition(point.x, point.y).setTint(tint).setAlpha(0.95).setScale(2).setVisible(true)
      this.scene.tweens.add({
        targets: flash,
        x: targetX,
        y: targetY,
        scale: 1,
        alpha: 0,
        duration: 130,
        ease: "Quad.easeOut",
        onComplete: () => flash.setVisible(false),
      })
    }
  }

  private borrowImage(images: readonly Phaser.GameObjects.Image[]): Phaser.GameObjects.Image | null {
    const image = images.find((candidate) => !candidate.visible)
    if (image === undefined) {
      return null
    }

    this.scene.tweens.killTweensOf(image)
    return image
  }
}

function makeImage(scene: Phaser.Scene, depth: number): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, TextureKeys.pixel).setDepth(depth).setVisible(false)
}
