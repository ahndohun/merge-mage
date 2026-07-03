import Phaser from "phaser"
import type { Element } from "../../engine/types"
import { AnimationKeys, ElementColors, type ActorAction, type BossKind, type MobKind, TextureKeys } from "../TextureKeys"
import { BattleLayout, getMobSpawnPoint } from "./BattleLayout"

type MobSpawn = {
  readonly hp: number
  readonly index: number
  readonly isBoss: boolean
  readonly element: Element
  readonly mobKind: MobKind
  readonly bossKind: BossKind
  readonly stage: number
  readonly wave: number
}

type Knockback = {
  value: number
}

const ENRAGE_BAR_HEIGHT = 3

export class BattleMobView {
  readonly container: Phaser.GameObjects.Container
  readonly sprite: Phaser.GameObjects.Sprite

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
  private mobKind: MobKind = "imp"
  private bossKind: BossKind = "big_demon"
  private currentMotion: ActorAction | null = null

  constructor(scene: Phaser.Scene) {
    this.container = scene.add.container(0, 0).setDepth(20).setVisible(false)
    this.sprite = scene.add.sprite(0, 0, TextureKeys.mob("imp", "idle", 0)).setOrigin(0.5, 0.75)
    this.hpBack = makePixel(scene, 0x1d1b24, 0.95, 21, 0.5)
    this.hpFill = makePixel(scene, 0x49e071, 1, 22, 0)
    this.enrageBack = makePixel(scene, 0x13060a, 0.95, 21, 0.5)
    this.enrageFill = makePixel(scene, 0xff3f68, 1, 22, 0)
    this.container.add([this.sprite, this.hpBack, this.hpFill, this.enrageBack, this.enrageFill])
    this.hide()
  }

  spawn(request: MobSpawn): void {
    this.boss = request.isBoss
    this.activeElement = request.element
    this.mobKind = request.mobKind
    this.bossKind = request.bossKind
    this.currentMotion = null
    this.maxHp = Math.max(1, request.hp)
    this.dying = false
    this.flashUntil = 0
    this.knockback.value = 0
    this.entrance.value = request.isBoss ? 40 : 0
    const point = getMobSpawnPoint({
      index: request.index,
      stage: request.stage,
      wave: request.wave,
      isBoss: request.isBoss,
    })
    this.visualX = point.x
    this.visualY = point.y

    const texture = request.isBoss ? TextureKeys.boss(request.bossKind, "idle", 0) : TextureKeys.mob(request.mobKind, "idle", 0)
    this.sprite.setTexture(texture).setAlpha(1).setScale(request.isBoss ? BattleLayout.bossScale : BattleLayout.mobScale).clearTint()
    this.container.setAlpha(1).setScale(1).setVisible(true)
    this.syncHp(request.hp)
    this.syncBars(0)
    this.playMotion("run")
    this.updatePosition()
  }

  hide(): void {
    this.container.setVisible(false)
    this.container.setAlpha(1)
    this.enrageBack.setVisible(false)
    this.enrageFill.setVisible(false)
    this.sprite.anims.stop()
  }

  isActive(): boolean {
    return this.container.visible && !this.dying
  }

  getImpactPoint(): { readonly x: number; readonly y: number } {
    return {
      x: this.container.x,
      y: this.container.y - Math.round(this.sprite.displayHeight * (this.boss ? 0.52 : 0.48)),
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
    const width = this.getSpriteBarWidth()
    const height = this.boss ? BattleLayout.bossHpBarHeight : BattleLayout.hpBarHeight
    const barY = this.getHpBarY()

    this.hpBack.setPosition(0, barY).setDisplaySize(width, height)
    this.hpFill.setPosition(-width / 2, barY).setDisplaySize(Math.max(1, Math.floor(width * ratio)), height)
  }

  syncBars(enrageRatio: number): void {
    const width = this.getSpriteBarWidth()
    // hpBack/enrageBack are centered on their y position (origin 0.5), so
    // the HP bar's bottom edge is getHpBarY() + half its own height, and the
    // enrage bar center needs to sit another half-height further down to
    // land exactly 4px below that bottom edge.
    const barY = this.getHpBarY() + BattleLayout.bossHpBarHeight / 2 + 4 + ENRAGE_BAR_HEIGHT / 2
    this.enrageBack.setVisible(this.boss).setPosition(0, barY)
    this.enrageFill.setVisible(this.boss).setPosition(-width / 2, barY)
    this.enrageBack.setDisplaySize(width, ENRAGE_BAR_HEIGHT)
    this.enrageFill.setDisplaySize(Math.max(1, Math.floor(width * Phaser.Math.Clamp(enrageRatio, 0, 1))), ENRAGE_BAR_HEIGHT)
  }

  update(time: number, delta: number, slowFactor: number): void {
    if (!this.isActive()) {
      return
    }

    const speed = (this.boss ? BattleLayout.mobSpeed * 0.58 : BattleLayout.mobSpeed) * slowFactor
    const previousX = this.visualX
    this.visualX = Math.max(BattleLayout.mobMinX, this.visualX - speed * (delta / 1_000))
    this.playMotion(this.visualX < previousX ? "run" : "idle")

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
    this.sprite.anims.stop()
    this.sprite.setTint(ElementColors[this.activeElement]).setTintMode(Phaser.TintModes.ADD)
    scene.tweens.add({
      targets: this.container,
      y: this.container.y - 12,
      alpha: 0,
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

  // Bar width tracks the sprite's actual on-screen size (not a fixed
  // constant), so it stays correct across mob (2x) and boss (3x) scales.
  private getSpriteBarWidth(): number {
    return Math.max(8, Math.round(this.sprite.displayWidth * 0.8))
  }

  // sprite/hpBack/hpFill are all children of the same container at local
  // (0, 0), so "sprite.y" in local space is 0 — the bar's local y is just
  // the offset above the sprite's visible top edge. displayHeight * originY
  // is that top edge (origin.y = 0.75 means the sprite's anchor point sits
  // 75% down the frame, so the visible top is that many px above it); we
  // then sit the bar 6px above that, matching sprite scale changes (2x/3x)
  // automatically since displayHeight already includes scale.
  private getHpBarY(): number {
    const top = -this.sprite.displayHeight * this.sprite.originY
    return Math.floor(top) - 6
  }

  private playMotion(action: ActorAction): void {
    if (this.currentMotion === action) {
      return
    }

    this.currentMotion = action
    const key = this.boss ? AnimationKeys.boss(this.bossKind, action) : AnimationKeys.mob(this.mobKind, action)
    this.sprite.play(key, true)
  }
}

function makePixel(scene: Phaser.Scene, tint: number, alpha: number, depth: number, originX: number): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, TextureKeys.pixel).setOrigin(originX, 0.5).setTint(tint).setAlpha(alpha).setDepth(depth)
}
