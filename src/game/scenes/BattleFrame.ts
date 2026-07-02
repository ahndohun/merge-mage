import Phaser from "phaser"
import { TextureKeys } from "../TextureKeys"
import { BattleLayout } from "./BattleLayout"

const TILE_SCALE = 2
const TILE_SIZE = 16 * TILE_SCALE
const WALL_ROWS = 2
const FLOOR_TINT = 0x5b526b
const WALL_TINT = 0x6b5c82

export function drawBattleFrame(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics().setDepth(0)
  graphics.fillStyle(0x100e14, 1)
  graphics.fillRect(0, 0, BattleLayout.width, BattleLayout.viewportHeight)
  graphics.fillStyle(0x241e2e, 1)
  graphics.fillRect(6, 6, BattleLayout.width - 12, BattleLayout.viewportHeight - 12)

  drawWall(scene)
  drawFloor(scene)

  graphics.fillStyle(0x100e14, 0.42)
  graphics.fillRect(14, 76, BattleLayout.width - 28, BattleLayout.viewportHeight - 90)
  graphics.lineStyle(2, 0x4a3f63, 1)
  graphics.strokeRect(8, 8, BattleLayout.width - 16, BattleLayout.viewportHeight - 16)
  graphics.lineStyle(2, 0x73648c, 0.55)
  graphics.strokeRect(12, 12, BattleLayout.width - 24, BattleLayout.viewportHeight - 24)
}

function drawWall(scene: Phaser.Scene): void {
  const columns = Math.ceil(BattleLayout.width / TILE_SIZE)

  for (let column = 0; column < columns; column += 1) {
    const x = column * TILE_SIZE
    const topKey = getWallTopKey(column, columns)
    scene.add.image(x, 14, topKey).setOrigin(0, 0).setScale(TILE_SCALE).setTint(WALL_TINT).setAlpha(0.78).setDepth(1)

    for (let row = 1; row < WALL_ROWS; row += 1) {
      scene.add
        .image(x, 14 + row * TILE_SIZE, TextureKeys.tile.wallMid)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE)
        .setTint(WALL_TINT)
        .setAlpha(0.48)
        .setDepth(1)
    }
  }
}

function drawFloor(scene: Phaser.Scene): void {
  const top = 14 + WALL_ROWS * TILE_SIZE
  const columns = Math.ceil(BattleLayout.width / TILE_SIZE)
  const rows = Math.ceil((BattleLayout.viewportHeight - top - 14) / TILE_SIZE)

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const tileKey = TextureKeys.tile.floors[(row * 3 + column * 5) % TextureKeys.tile.floors.length]
      if (tileKey === undefined) {
        continue
      }

      scene.add
        .image(column * TILE_SIZE, top + row * TILE_SIZE, tileKey)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE)
        .setTint(FLOOR_TINT)
        .setAlpha(0.44)
        .setDepth(1)
    }
  }
}

function getWallTopKey(column: number, columns: number): string {
  if (column === 0) {
    return TextureKeys.tile.wallTopLeft
  }
  if (column === columns - 1) {
    return TextureKeys.tile.wallTopRight
  }
  return TextureKeys.tile.wallTopMid
}
