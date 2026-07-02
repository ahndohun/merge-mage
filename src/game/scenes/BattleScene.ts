import Phaser from "phaser"
import { EventBus } from "../../bridge/EventBus"

export class BattleScene extends Phaser.Scene {
  constructor() {
    super("BattleScene")
  }

  create(): void {
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    this.cameras.main.setBackgroundColor("#0b0d13")

    const title = this.add
      .text(centerX, centerY, "MERGE MAGE", {
        color: "#f7f7ff",
        fontFamily: "monospace",
        fontSize: "32px",
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: title,
      alpha: { from: 0.55, to: 1 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    })

    EventBus.emit("current-scene-ready", this)
  }
}
