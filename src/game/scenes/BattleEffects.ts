import Phaser from "phaser"
import type { Element } from "../../engine/types"
import { ElementColors, TextureKeys } from "../TextureKeys"
import { DamageTextPool } from "./PixelText"

type Point = {
  readonly x: number
  readonly y: number
}

type ProjectileRequest = {
  readonly from: Point
  readonly to: Point
  readonly element: Element
  readonly onImpact: () => void
}

export class BattleEffects {
  readonly damageTexts: DamageTextPool

  private readonly projectiles: Phaser.GameObjects.Image[]
  private readonly coins: Phaser.GameObjects.Image[]
  private readonly particles: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(private readonly scene: Phaser.Scene) {
    this.projectiles = Array.from({ length: 48 }, () =>
      scene.add.image(0, 0, TextureKeys.projectile.fire).setDepth(30).setVisible(false),
    )
    this.coins = Array.from({ length: 32 }, () => scene.add.image(0, 0, TextureKeys.coin).setDepth(31).setVisible(false))
    this.damageTexts = new DamageTextPool(scene, 64, 40)
    this.particles = scene.add
      .particles(0, 0, TextureKeys.particle, {
        emitting: false,
        frequency: -1,
        lifespan: 330,
        speed: { min: 22, max: 72 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.7, end: 0 },
        alpha: { start: 0.95, end: 0 },
        maxAliveParticles: 120,
        reserve: 120,
      })
      .setDepth(29)
  }

  fireProjectile(request: ProjectileRequest): void {
    const projectile = this.borrowImage(this.projectiles, TextureKeys.projectile[request.element])
    if (projectile === null) {
      request.onImpact()
      return
    }

    const arc = Math.max(16, Math.abs(request.to.x - request.from.x) * 0.14)
    projectile
      .setPosition(request.from.x, request.from.y)
      .setAlpha(1)
      .setScale(1.5)
      .setRotation(Phaser.Math.Angle.Between(request.from.x, request.from.y, request.to.x, request.to.y))
      .setVisible(true)

    this.scene.tweens.add({
      targets: projectile,
      x: request.to.x,
      y: [request.from.y, (request.from.y + request.to.y) / 2 - arc, request.to.y],
      duration: 260,
      ease: "Sine.easeInOut",
      onComplete: () => {
        projectile.setVisible(false)
        request.onImpact()
      },
    })
  }

  impact(element: Element, point: Point): void {
    this.particles.setParticleTint(ElementColors[element])
    this.particles.explode(14, point.x, point.y)
  }

  death(point: Point, element: Element): void {
    this.particles.setParticleTint(ElementColors[element])
    this.particles.explode(20, point.x, point.y)
    this.flyCoin(point)
  }

  showDamage(point: Point, damage: number, critical: boolean): void {
    this.damageTexts.show({
      x: point.x,
      y: point.y - 18,
      damage,
      critical,
    })
  }

  clear(): void {
    this.damageTexts.clear()
    this.projectiles.forEach((projectile) => {
      this.scene.tweens.killTweensOf(projectile)
      projectile.setVisible(false)
    })
    this.coins.forEach((coin) => {
      this.scene.tweens.killTweensOf(coin)
      coin.setVisible(false)
    })
    this.particles.killAll()
  }

  private flyCoin(point: Point): void {
    const coin = this.borrowImage(this.coins, TextureKeys.coin)
    if (coin === null) {
      return
    }

    coin.setPosition(point.x, point.y).setAlpha(1).setScale(1.4).setVisible(true)
    this.scene.tweens.add({
      targets: coin,
      y: point.y - 42,
      alpha: 0,
      scale: 0.9,
      duration: 520,
      ease: "Cubic.easeOut",
      onComplete: () => {
        coin.setVisible(false)
      },
    })
  }

  private borrowImage(images: readonly Phaser.GameObjects.Image[], texture: string): Phaser.GameObjects.Image | null {
    const image = images.find((candidate) => !candidate.visible)
    if (image === undefined) {
      return null
    }

    this.scene.tweens.killTweensOf(image)
    image.setTexture(texture)
    return image
  }
}
