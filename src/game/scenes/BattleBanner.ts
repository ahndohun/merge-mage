import Phaser from "phaser"
import { BattleLayout } from "./BattleLayout"
import { PixelTextLine } from "./PixelText"

export class BattleBanner {
  private readonly line: PixelTextLine
  private readonly popLine: PixelTextLine

  constructor(private readonly scene: Phaser.Scene) {
    this.line = new PixelTextLine(scene, 28, 45)
    this.popLine = new PixelTextLine(scene, 18, 46)
  }

  show(text: string, tint: number): void {
    this.scene.tweens.killTweensOf(this.line.container)
    this.line.setText(text, { tint, scale: 3 })
    this.line.show(BattleLayout.width / 2, BattleLayout.bannerY)
    this.line.container.setAlpha(0).setScale(1)
    this.scene.tweens.add({
      targets: this.line.container,
      y: BattleLayout.bannerY - 12,
      alpha: { from: 0, to: 1 },
      duration: 180,
      hold: 520,
      yoyo: true,
      ease: "Cubic.easeOut",
      onComplete: () => this.line.hide(),
    })
  }

  showSlide(text: string, tint: number): void {
    this.scene.tweens.killTweensOf(this.line.container)
    this.line.setText(text, { tint, scale: 4 })
    this.line.show(BattleLayout.width / 2, BattleLayout.bannerY)
    this.line.container.setAlpha(0).setScale(1)
    this.scene.tweens.add({
      targets: this.line.container,
      x: { from: -64, to: BattleLayout.width / 2 },
      alpha: { from: 0, to: 1 },
      duration: 220,
      hold: 520,
      yoyo: true,
      ease: "Cubic.easeOut",
      onComplete: () => this.line.hide(),
    })
  }

  pop(text: string, tint: number): void {
    this.scene.tweens.killTweensOf(this.popLine.container)
    this.popLine.setText(text, { tint, scale: 4 })
    this.popLine.show(BattleLayout.width / 2, BattleLayout.bannerY + 36)
    this.popLine.container.setAlpha(1).setScale(0.8)
    this.scene.tweens.add({
      targets: this.popLine.container,
      scale: 1,
      alpha: 0,
      duration: 500,
      ease: "Back.easeOut",
      onComplete: () => this.popLine.hide(),
    })
  }
}
