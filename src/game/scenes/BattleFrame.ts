import Phaser from "phaser"
import { BattleLayout } from "./BattleLayout"

export function drawBattleFrame(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics().setDepth(0)
  graphics.fillStyle(0x070913, 1)
  graphics.fillRect(0, 0, BattleLayout.width, BattleLayout.viewportHeight)
  graphics.fillStyle(0x11131d, 1)
  graphics.fillRect(0, BattleLayout.viewportHeight - 60, BattleLayout.width, 60)
  graphics.fillStyle(0x1f2030, 1)
  graphics.fillRect(8, 8, BattleLayout.width - 16, BattleLayout.viewportHeight - 16)
  graphics.fillStyle(0x090b12, 1)
  graphics.fillRect(12, 12, BattleLayout.width - 24, BattleLayout.viewportHeight - 24)
  graphics.fillStyle(0x171827, 1)
  graphics.fillRect(20, 302, BattleLayout.width - 40, 18)
}
