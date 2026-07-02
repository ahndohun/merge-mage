import Phaser from "phaser"
import { PIXEL_GLYPHS, PixelGlyphPatterns, type PixelGlyph } from "./PixelGlyphs"
import { TextureKeys } from "./TextureKeys"

export function registerUtilityTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKeys.pixel)) {
    return
  }

  const graphics = scene.add.graphics()
  generatePixel(graphics)

  for (const glyph of PIXEL_GLYPHS) {
    generateGlyph(graphics, glyph)
  }

  graphics.destroy()
}

function generatePixel(graphics: Phaser.GameObjects.Graphics): void {
  graphics.clear()
  graphics.fillStyle(0xffffff, 1)
  graphics.fillRect(0, 0, 1, 1)
  graphics.generateTexture(TextureKeys.pixel, 1, 1)
}

function generateGlyph(graphics: Phaser.GameObjects.Graphics, glyph: PixelGlyph): void {
  graphics.clear()
  graphics.fillStyle(0xffffff, 1)

  const pattern = PixelGlyphPatterns[glyph]
  for (let row = 0; row < pattern.length; row += 1) {
    const line = pattern[row]
    if (line === undefined) {
      continue
    }

    for (let col = 0; col < line.length; col += 1) {
      if (line[col] === "1") {
        graphics.fillRect(col, row, 1, 1)
      }
    }
  }

  graphics.generateTexture(TextureKeys.glyph(glyph), 3, 5)
}
