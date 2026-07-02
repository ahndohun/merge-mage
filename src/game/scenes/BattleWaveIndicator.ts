import Phaser from "phaser"
import { BattleLayout, getWaveIndicator } from "./BattleLayout"
import { PixelTextLine } from "./PixelText"

export class BattleWaveIndicator {
  private readonly text: PixelTextLine

  constructor(scene: Phaser.Scene) {
    this.text = new PixelTextLine(scene, 8, 55)
  }

  update(wave: number): void {
    const value = getWaveIndicator(wave)
    this.text.setText(value.text, { tint: value.tint, scale: 2 })
    this.text.show(BattleLayout.width - 34, 62)
  }

  hide(): void {
    this.text.hide()
  }
}
