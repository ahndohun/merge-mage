import Phaser from "phaser"
import type { PetState } from "../../engine/types"
import { AnimationKeys, TextureKeys } from "../TextureKeys"

type Point = {
  readonly x: number
  readonly y: number
}

const EVOLUTION_TINTS = [0xffffff, 0xff8a3d, 0x6ecbff] as const
const FOLLOW_OFFSET_X = -34
const FOLLOW_OFFSET_Y = 20
const FLOAT_X = 5
const FLOAT_Y = 4

export class BattleFamiliarView {
  readonly sprite: Phaser.GameObjects.Sprite

  private lastPoint: Point

  constructor(private readonly scene: Phaser.Scene, wizardCenter: Point) {
    this.lastPoint = this.getPoint(0, wizardCenter)
    this.sprite = scene.add
      .sprite(this.lastPoint.x, this.lastPoint.y, TextureKeys.mob("imp", "idle", 0))
      .setOrigin(0.5, 0.82)
      .setDepth(20)
      .setScale(1.35)
    this.sprite.play(AnimationKeys.familiar.idle)
  }

  update(time: number, wizardCenter: Point): void {
    this.lastPoint = this.getPoint(time, wizardCenter)
    this.sprite.setPosition(this.lastPoint.x, this.lastPoint.y)
  }

  syncPet(pet: PetState): void {
    const tint = EVOLUTION_TINTS[pet.evolution] ?? EVOLUTION_TINTS[0]
    this.sprite.setTint(tint).setTintMode(Phaser.TintModes.MULTIPLY)
  }

  playCast(onLaunch: (origin: Point) => void): void {
    this.scene.tweens.killTweensOf(this.sprite)
    this.sprite.play(AnimationKeys.familiar.run, true)
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x + 9,
      y: this.sprite.y - 4,
      duration: 80,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.sprite.play(AnimationKeys.familiar.idle, true)
        onLaunch(this.getCastOrigin())
      },
    })
  }

  getCoinTarget(): Point {
    return {
      x: Math.round(this.lastPoint.x),
      y: Math.round(this.lastPoint.y - 18),
    }
  }

  destroy(): void {
    this.scene.tweens.killTweensOf(this.sprite)
    this.sprite.destroy()
  }

  private getCastOrigin(): Point {
    return {
      x: Math.round(this.sprite.x + 10),
      y: Math.round(this.sprite.y - 18),
    }
  }

  private getPoint(time: number, wizardCenter: Point): Point {
    return {
      x: Math.round(wizardCenter.x + FOLLOW_OFFSET_X + Math.sin(time / 520) * FLOAT_X),
      y: Math.round(wizardCenter.y + FOLLOW_OFFSET_Y + Math.sin(time / 680) * FLOAT_Y),
    }
  }
}
