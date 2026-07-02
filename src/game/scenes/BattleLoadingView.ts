import Phaser from "phaser"
import { BattleLayout } from "./BattleLayout"
import { PixelTextLine } from "./PixelText"

const BAR_WIDTH = 168
const BAR_HEIGHT = 12
const BAR_X = Math.floor((BattleLayout.width - BAR_WIDTH) / 2)
const BAR_Y = 174

export class BattleLoadingView {
  private readonly track: Phaser.GameObjects.Graphics
  private readonly fill: Phaser.GameObjects.Graphics
  private readonly label: PixelTextLine

  constructor(private readonly scene: Phaser.Scene) {
    this.track = scene.add.graphics().setDepth(90)
    this.fill = scene.add.graphics().setDepth(91)
    this.label = new PixelTextLine(scene, 10, 92)
    this.label.setText("LOADING", { tint: 0xe8e0d8, scale: 3 })
    this.label.show(BattleLayout.width / 2, BAR_Y - 28)
    this.render(0)

    scene.load.on("progress", this.render, this)
    scene.load.once("complete", this.destroy, this)
  }

  private render(value: number): void {
    const progress = Phaser.Math.Clamp(value, 0, 1)
    this.track.clear()
    this.track.fillStyle(0x100e14, 1)
    this.track.fillRect(BAR_X - 4, BAR_Y - 4, BAR_WIDTH + 8, BAR_HEIGHT + 8)
    this.track.fillStyle(0x4a3f63, 1)
    this.track.fillRect(BAR_X - 2, BAR_Y - 2, BAR_WIDTH + 4, BAR_HEIGHT + 4)
    this.track.fillStyle(0x1a1721, 1)
    this.track.fillRect(BAR_X, BAR_Y, BAR_WIDTH, BAR_HEIGHT)

    this.fill.clear()
    this.fill.fillStyle(0xe6b450, 1)
    this.fill.fillRect(BAR_X, BAR_Y, Math.floor(BAR_WIDTH * progress), BAR_HEIGHT)
  }

  private destroy(): void {
    this.scene.load.off("progress", this.render, this)
    this.track.destroy()
    this.fill.destroy()
    this.label.container.destroy(true)
  }
}
