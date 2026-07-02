import Phaser from "phaser"
import { BattleLayout } from "./BattleLayout"
import { PixelTextLine } from "./PixelText"

export class BattleBanner {
  private readonly line: PixelTextLine

  constructor(private readonly scene: Phaser.Scene) {
    this.line = new PixelTextLine(scene, 28, 45)
  }

  show(text: string, tint: number): void {
    this.scene.tweens.killTweensOf(this.line.container)
    this.line.setText(text, { tint, scale: 3 })
    this.line.show(BattleLayout.width / 2, BattleLayout.bannerY)
    this.line.container.setAlpha(0).setScale(0.9)
    this.scene.tweens.add({
      targets: this.line.container,
      y: BattleLayout.bannerY - 12,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.9, to: 1 },
      duration: 180,
      hold: 520,
      yoyo: true,
      ease: "Cubic.easeOut",
      onComplete: () => this.line.hide(),
    })
  }
}
