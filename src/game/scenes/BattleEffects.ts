import Phaser from "phaser"
import { assertNever, type Element } from "../../engine/types"
import { AnimationKeys, ElementColors, TextureKeys } from "../TextureKeys"
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

  private readonly projectiles: Phaser.GameObjects.Sprite[]
  private readonly impacts: Phaser.GameObjects.Sprite[]
  private readonly particles: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(private readonly scene: Phaser.Scene) {
    this.projectiles = Array.from({ length: 48 }, () =>
      scene.add.sprite(0, 0, TextureKeys.vfxFrame("fire", 1)).setDepth(30).setVisible(false),
    )
    this.impacts = Array.from({ length: 24 }, () =>
      scene.add.sprite(0, 0, TextureKeys.vfxFrame("explosion", 1)).setDepth(32).setVisible(false),
    )
    this.damageTexts = new DamageTextPool(scene, 64, 40)
    this.particles = scene.add
      .particles(0, 0, TextureKeys.pixel, {
        emitting: false,
        frequency: -1,
        lifespan: 330,
        speed: { min: 22, max: 72 },
        angle: { min: 0, max: 360 },
        scale: 1,
        alpha: { start: 0.95, end: 0 },
        maxAliveParticles: 120,
        reserve: 120,
      })
      .setDepth(29)
  }

  fireProjectile(request: ProjectileRequest): void {
    const projectile = this.borrowSprite(this.projectiles, getProjectileTexture(request.element))
    if (projectile === null) {
      request.onImpact()
      return
    }

    const arc = Math.max(16, Math.abs(request.to.x - request.from.x) * 0.14)
    projectile
      .setPosition(request.from.x, request.from.y)
      .setAlpha(1)
      .setScale(1)
      .setRotation(0)
      .setVisible(true)
      .play(AnimationKeys.projectile[request.element], true)

    this.scene.tweens.add({
      targets: projectile,
      x: request.to.x,
      y: [request.from.y, (request.from.y + request.to.y) / 2 - arc, request.to.y],
      duration: 260,
      ease: "Sine.easeInOut",
      onComplete: () => {
        projectile.anims.stop()
        projectile.setVisible(false)
        request.onImpact()
      },
    })
  }

  impact(element: Element, point: Point): void {
    this.particles.setParticleTint(ElementColors[element])
    this.particles.explode(14, point.x, point.y)
    this.playImpact(point)
  }

  death(point: Point, element: Element): void {
    this.particles.setParticleTint(ElementColors[element])
    this.particles.explode(20, point.x, point.y)
    this.goldBurst(point)
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
      projectile.anims.stop()
      projectile.setVisible(false)
    })
    this.impacts.forEach((impact) => {
      this.scene.tweens.killTweensOf(impact)
      impact.anims.stop()
      impact.setVisible(false)
    })
    this.particles.killAll()
  }

  private playImpact(point: Point): void {
    const impact = this.borrowSprite(this.impacts, TextureKeys.vfxFrame("explosion", 1))
    if (impact === null) {
      return
    }

    impact.setPosition(point.x, point.y).setAlpha(0.92).setScale(1).setVisible(true)
    impact.once("animationcomplete", () => {
      impact.setVisible(false)
    })
    impact.play(AnimationKeys.impact)
  }

  private goldBurst(point: Point): void {
    this.particles.setParticleTint(0xe6b450)
    this.particles.explode(16, point.x, point.y - 4)
  }

  private borrowSprite(sprites: readonly Phaser.GameObjects.Sprite[], texture: string): Phaser.GameObjects.Sprite | null {
    const sprite = sprites.find((candidate) => !candidate.visible)
    if (sprite === undefined) {
      return null
    }

    this.scene.tweens.killTweensOf(sprite)
    sprite.anims.stop()
    sprite.removeAllListeners("animationcomplete")
    sprite.setTexture(texture)
    return sprite
  }
}

function getProjectileTexture(element: Element): string {
  switch (element) {
    case "fire":
      return TextureKeys.vfxFrame("fire", 1)
    case "frost":
      return TextureKeys.vfxFrame("frost", 1)
    case "holy":
      return TextureKeys.vfx.holy
    default:
      return assertNever(element)
  }
}
