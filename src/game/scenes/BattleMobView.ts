import Phaser from "phaser"
import type { Element } from "../../engine/types"
import { ElementColors, TextureKeys } from "../TextureKeys"
import { BattleLayout, getLaneY } from "./BattleLayout"

type MobSpawn = {
  readonly hp: number
  readonly index: number
  readonly isBoss: boolean
  readonly element: Element
}

type Knockback = {
  value: number
}

export class BattleMobView {
  readonly container: Phaser.GameObjects.Container
  readonly sprite: Phaser.GameObjects.Image

  private readonly hpBack: Phaser.GameObjects.Image
  private readonly hpFill: Phaser.GameObjects.Image
  private readonly enrageBack: Phaser.GameObjects.Image
  private readonly enrageFill: Phaser.GameObjects.Image
  private readonly knockback: Knockback = { value: 0 }
  private readonly entrance: Knockback = { value: 0 }

  private visualX = 0
  private visualY = 0
  private maxHp = 1
  private activeElement: Element = "fire"
  private boss = false
  private dying = false
  private flashUntil = 0

  constructor(scene: Phaser.Scene) {
    this.container = scene.add.container(0, 0).setDepth(20).setVisible(false)
    this.sprite = scene.add.image(0, 0, TextureKeys.mob.fire).setOrigin(0.5, 0.75)
    this.hpBack = makePixel(scene, 0x1d1b24, 0.95, 21)
    this.hpFill = makePixel(scene, 0x49e071, 1, 22)
    this.enrageBack = makePixel(scene, 0x13060a, 0.95, 21)
    this.enrageFill = makePixel(scene, 0xff3f68, 1, 22)
    this.container.add([this.sprite, this.hpBack, this.hpFill, this.enrageBack, this.enrageFill])
    this.hide()
  }

  spawn(request: MobSpawn): void {
    this.boss = request.isBoss
    this.activeElement = request.element
    this.maxHp = Math.max(1, request.hp)
    this.dying = false
    this.flashUntil = 0
    this.knockback.value = 0
    this.entrance.value = request.isBoss ? 40 : 0
    this.visualX = request.isBoss ? BattleLayout.bossX : BattleLayout.mobStartX + Math.floor(request.index / 5) * 18
    this.visualY = request.isBoss ? BattleLayout.bossY : getLaneY(request.index)

    const texture = request.isBoss ? TextureKeys.boss : TextureKeys.mob[request.element]
    this.sprite.setTexture(texture).setAlpha(1).setScale(request.isBoss ? 1.15 : 1).clearTint()
    this.container.setAlpha(1).setVisible(true)
    this.syncHp(request.hp)
    this.syncBars(0)
    this.updatePosition()
  }

  hide(): void {
    this.container.setVisible(false)
    this.container.setAlpha(1)
    this.enrageBack.setVisible(false)
    this.enrageFill.setVisible(false)
  }

  isActive(): boolean {
    return this.container.visible && !this.dying
  }

  getImpactPoint(): { readonly x: number; readonly y: number } {
    return {
      x: this.container.x,
      y: this.container.y - (this.boss ? 24 : 12),
    }
  }

  getElement(): Element {
    return this.activeElement
  }

  isBoss(): boolean {
    return this.boss
  }

  syncHp(hp: number): void {
    const ratio = Phaser.Math.Clamp(hp / this.maxHp, 0, 1)
    const width = this.boss ? BattleLayout.bossHpBarWidth : BattleLayout.hpBarWidth
    const height = this.boss ? BattleLayout.bossHpBarHeight : BattleLayout.hpBarHeight
    const barY = this.boss ? -42 : -25

    this.hpBack.setPosition(-width / 2, barY).setDisplaySize(width, height)
    this.hpFill.setPosition(-width / 2, barY).setDisplaySize(Math.max(1, width * ratio), height)
  }

  syncBars(enrageRatio: number): void {
    this.enrageBack.setVisible(this.boss).setPosition(-BattleLayout.bossHpBarWidth / 2, -34)
    this.enrageFill.setVisible(this.boss).setPosition(-BattleLayout.bossHpBarWidth / 2, -34)
    this.enrageBack.setDisplaySize(BattleLayout.bossHpBarWidth, 3)
    this.enrageFill.setDisplaySize(Math.max(1, BattleLayout.bossHpBarWidth * Phaser.Math.Clamp(enrageRatio, 0, 1)), 3)
  }

  update(time: number, delta: number, slowFactor: number): void {
    if (!this.isActive()) {
      return
    }

    const speed = (this.boss ? BattleLayout.mobSpeed * 0.58 : BattleLayout.mobSpeed) * slowFactor
    this.visualX = Math.max(BattleLayout.mobMinX, this.visualX - speed * (delta / 1_000))

    if (this.flashUntil > 0 && time >= this.flashUntil) {
      this.flashUntil = 0
      this.sprite.clearTint()
    }

    this.sprite.setAlpha(slowFactor < 1 ? BattleLayout.slowAlpha : 1)
    this.updatePosition()
  }

  flashHit(scene: Phaser.Scene): void {
    if (!this.isActive()) {
      return
    }

    this.flashUntil = scene.time.now + 80
    this.sprite.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL)
    scene.tweens.killTweensOf(this.knockback)
    scene.tweens.add({
      targets: this.knockback,
      value: 4,
      duration: 45,
      yoyo: true,
      ease: "Quad.easeOut",
    })
  }

  playEntrance(scene: Phaser.Scene): void {
    if (!this.boss) {
      return
    }

    this.entrance.value = 40
    scene.tweens.killTweensOf(this.entrance)
    scene.tweens.add({
      targets: this.entrance,
      value: 0,
      duration: 360,
      ease: "Cubic.easeOut",
    })
  }

  playDeath(scene: Phaser.Scene, onComplete: () => void): void {
    if (!this.isActive()) {
      onComplete()
      return
    }

    this.dying = true
    this.sprite.setTint(ElementColors[this.activeElement]).setTintMode(Phaser.TintModes.ADD)
    scene.tweens.add({
      targets: this.container,
      y: this.container.y - 12,
      alpha: 0,
      scale: 1.18,
      duration: 260,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.container.setScale(1)
        this.hide()
        onComplete()
      },
    })
  }

  private updatePosition(): void {
    this.container.setPosition(this.visualX + this.knockback.value + this.entrance.value, this.visualY)
  }
}

function makePixel(scene: Phaser.Scene, tint: number, alpha: number, depth: number): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, TextureKeys.pixel).setOrigin(0, 0.5).setTint(tint).setAlpha(alpha).setDepth(depth)
}
