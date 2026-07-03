import Phaser from "phaser"
import { assertNever, type CastElement, type Element } from "../../engine/types"
import { AnimationKeys, CastColors, ElementColors, TextureKeys } from "../TextureKeys"
import { BattleJuiceEffects } from "./BattleJuiceEffects"
import { BattleScreenEffects } from "./BattleScreenEffects"
import { DamageTextPool } from "./PixelText"

type Point = {
  readonly x: number
  readonly y: number
}

type ProjectileRequest = {
  readonly from: Point
  readonly to: Point
  readonly element: CastElement
  readonly onImpact: () => void
}

// The holy VFX sheet's native frame is 48x48 vs. the 64x64 fire/frost
// explosion frames, so it renders smaller at the same Phaser scale. Scale it
// up by the size ratio to read as the same visual weight as other impacts.
const HOLY_IMPACT_SCALE = 64 / 48

export class BattleEffects {
  readonly damageTexts: DamageTextPool

  private readonly projectiles: Phaser.GameObjects.Sprite[]
  private readonly impacts: Phaser.GameObjects.Sprite[]
  private readonly particles: Phaser.GameObjects.Particles.ParticleEmitter
  private readonly juice: BattleJuiceEffects
  private readonly screen: BattleScreenEffects

  constructor(private readonly scene: Phaser.Scene) {
    this.projectiles = Array.from({ length: 48 }, () =>
      scene.add.sprite(0, 0, TextureKeys.vfxFrame("fire", 1)).setDepth(30).setVisible(false),
    )
    this.impacts = Array.from({ length: 24 }, () =>
      scene.add.sprite(0, 0, TextureKeys.vfxFrame("explosion", 1)).setDepth(32).setVisible(false),
    )
    this.damageTexts = new DamageTextPool(scene, 64, 40)
    this.juice = new BattleJuiceEffects(scene)
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
    this.screen = new BattleScreenEffects(scene)
  }

  fireProjectile(request: ProjectileRequest): void {
    this.juice.muzzleFlash(request.from, request.element)
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
      .clearTint()
      .play(getProjectileAnimation(request.element), true)

    if (request.element === "arcane") {
      projectile.setTint(CastColors.arcane)
    }

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

  impact(element: CastElement, point: Point): void {
    this.particles.setParticleTint(CastColors[element])
    this.particles.explode(14, point.x, point.y)
    this.playImpact(point, 1, element)
  }

  death(point: Point, element: Element): void {
    this.particles.setParticleTint(ElementColors[element])
    this.particles.explode(20, point.x, point.y)
    this.juice.whitePop(point, 3)
    this.goldBurst(point)
  }

  bossDeath(point: Point, element: Element): void {
    this.particles.setParticleTint(ElementColors[element])
    this.particles.explode(56, point.x, point.y)
    this.playImpact(point, 1.7)
    this.juice.whitePop(point, 6)
    this.goldBurst(point, 5)
    this.playSlowMotion()
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
    this.juice.clear()
    this.particles.killAll()
    this.screen.clear()
  }

  stageFlash(): void {
    this.screen.stageFlash()
  }

  setBossEnragePulse(active: boolean): void {
    this.screen.setBossEnragePulse(active)
  }

  levelUp(point: Point): void {
    this.juice.levelUp(point)
  }

  private playImpact(point: Point, scale = 1, element?: CastElement): void {
    const useHoly = element === "holy"
    const texture = useHoly ? TextureKeys.vfx.holy : TextureKeys.vfxFrame("explosion", 1)
    const impact = this.borrowSprite(this.impacts, texture)
    if (impact === null) {
      return
    }

    // The holy VFX sheet's 48x48 frames render slightly smaller on screen
    // than the 64x64 fire/frost explosion frames, so scale it up to match.
    const elementScale = useHoly ? HOLY_IMPACT_SCALE : 1
    impact
      .setPosition(point.x, point.y)
      .setAlpha(0.92)
      .setScale(scale * elementScale)
      .setVisible(true)
    impact.once("animationcomplete", () => {
      impact.setVisible(false)
    })
    impact.play(useHoly ? AnimationKeys.holyImpact : AnimationKeys.impact)
  }

  private goldBurst(point: Point, bonusCoins = 0): void {
    this.particles.setParticleTint(0xe6b450)
    this.particles.explode(16, point.x, point.y - 4)
    this.juice.flyCoins(point, bonusCoins)
  }

  private playSlowMotion(): void {
    this.scene.time.timeScale = 0.5
    this.scene.tweens.setGlobalTimeScale(0.5)
    this.scene.time.delayedCall(75, () => {
      this.scene.time.timeScale = 1
      this.scene.tweens.setGlobalTimeScale(1)
    })
  }

  private borrowSprite(sprites: readonly Phaser.GameObjects.Sprite[], texture: string): Phaser.GameObjects.Sprite | null {
    const sprite = sprites.find((candidate) => !candidate.visible)
    if (sprite === undefined) {
      return null
    }

    this.scene.tweens.killTweensOf(sprite)
    sprite.anims.stop()
    sprite.removeAllListeners("animationcomplete")
    // Pass frame 0 explicitly: for multi-frame spritesheets (e.g. the holy
    // VFX sheet), setTexture(key) with no frame falls back to the sheet's
    // whole-image __BASE frame, which briefly renders as one giant frame
    // before play() takes over.
    sprite.setTexture(texture, 0)
    return sprite
  }
}

function getProjectileTexture(element: CastElement): string {
  switch (element) {
    case "fire":
      return TextureKeys.vfxFrame("fire", 1)
    case "frost":
      return TextureKeys.vfxFrame("frost", 1)
    case "holy":
      return TextureKeys.vfx.holy
    case "arcane":
      return TextureKeys.vfxFrame("fire", 1)
    default:
      return assertNever(element)
  }
}

function getProjectileAnimation(element: CastElement): string {
  switch (element) {
    case "fire":
      return AnimationKeys.projectile.fire
    case "frost":
      return AnimationKeys.projectile.frost
    case "holy":
      return AnimationKeys.projectile.holy
    case "arcane":
      return AnimationKeys.projectile.fire
    default:
      return assertNever(element)
  }
}
