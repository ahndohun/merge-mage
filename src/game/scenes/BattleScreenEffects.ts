import Phaser from "phaser"
import { TextureKeys } from "../TextureKeys"
import { BattleLayout } from "./BattleLayout"

export class BattleScreenEffects {
  private readonly flashOverlay: Phaser.GameObjects.Image
  private readonly vignette: readonly Phaser.GameObjects.Image[]

  constructor(private readonly scene: Phaser.Scene) {
    this.flashOverlay = scene.add
      .image(0, 0, TextureKeys.pixel)
      .setOrigin(0, 0)
      .setDepth(78)
      .setDisplaySize(BattleLayout.width, BattleLayout.height)
      .setTint(0xffffff)
      .setAlpha(0)
      .setVisible(false)
    this.vignette = makeVignette(scene)
  }

  clear(): void {
    this.scene.tweens.killTweensOf(this.flashOverlay)
    this.flashOverlay.setVisible(false).setAlpha(0)
    this.setBossEnragePulse(false)
  }

  stageFlash(): void {
    this.scene.tweens.killTweensOf(this.flashOverlay)
    this.flashOverlay.setAlpha(0.1).setVisible(true)
    this.scene.tweens.add({
      targets: this.flashOverlay,
      alpha: 0,
      duration: 60,
      ease: "Stepped",
      easeParams: [2],
      onComplete: () => this.flashOverlay.setVisible(false),
    })
  }

  setBossEnragePulse(active: boolean): void {
    const alpha = active ? 0.045 + Math.sin(this.scene.time.now / 78) * 0.025 : 0
    for (const edge of this.vignette) {
      edge.setVisible(active).setAlpha(alpha)
    }
  }
}

function makeImage(scene: Phaser.Scene, depth: number): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, TextureKeys.pixel).setDepth(depth).setVisible(false)
}

function makeVignette(scene: Phaser.Scene): readonly Phaser.GameObjects.Image[] {
  const tint = 0xc4344a
  const top = makeImage(scene, 57).setOrigin(0, 0).setTint(tint).setDisplaySize(BattleLayout.width, 42)
  const bottom = makeImage(scene, 57)
    .setOrigin(0, 0)
    .setTint(tint)
    .setPosition(0, BattleLayout.viewportHeight - 54)
    .setDisplaySize(BattleLayout.width, 54)
  const left = makeImage(scene, 57).setOrigin(0, 0).setTint(tint).setDisplaySize(20, BattleLayout.viewportHeight)
  const right = makeImage(scene, 57)
    .setOrigin(0, 0)
    .setTint(tint)
    .setPosition(BattleLayout.width - 20, 0)
    .setDisplaySize(20, BattleLayout.viewportHeight)
  return [top, bottom, left, right] as const
}
