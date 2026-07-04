import Phaser from "phaser"
import { getPixelGlyphPatternWidth, PIXEL_GLYPHS, PixelGlyphPatterns, type PixelGlyph } from "./PixelGlyphs"
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

  graphics.generateTexture(TextureKeys.glyph(glyph), getPixelGlyphPatternWidth(glyph), pattern.length)
}

// Damage numbers update several times per second, so they render as BitmapText
// (batched) rather than per-glyph Images — text-and-bitmaptext skill, Gotcha 14.
// A fixed-width RetroFont atlas of the 10 digits backs it; digits are uniformly
// 4 cells wide in PixelGlyphs, so a fixed cell keeps the spacing faithful.
export const DAMAGE_FONT_KEY = "damage-digit"
const DAMAGE_FONT_IMAGE = "damage-digit-font"
const DAMAGE_DIGITS = "0123456789"
const DAMAGE_CELL_W = 4
const DAMAGE_CELL_H = 5

export function registerDamageFont(scene: Phaser.Scene): void {
  if (scene.cache.bitmapFont.has(DAMAGE_FONT_KEY)) {
    return
  }

  const graphics = scene.add.graphics()
  graphics.fillStyle(0xffffff, 1)
  ;[...DAMAGE_DIGITS].forEach((digit, index) => {
    const pattern = PixelGlyphPatterns[digit as PixelGlyph]
    const baseX = index * DAMAGE_CELL_W
    pattern.forEach((row, rowIndex) => {
      ;[...row].forEach((cell, colIndex) => {
        if (cell === "1") {
          graphics.fillRect(baseX + colIndex, rowIndex, 1, 1)
        }
      })
    })
  })
  graphics.generateTexture(DAMAGE_FONT_IMAGE, DAMAGE_DIGITS.length * DAMAGE_CELL_W, DAMAGE_CELL_H)
  graphics.destroy()

  // RetroFont.Parse already returns the { data, frame, texture } cache entry —
  // pass it straight to add(). Wrapping it again in { data: … } (as some docs
  // show) double-nests it and leaves BitmapText.fontData.chars undefined.
  scene.cache.bitmapFont.add(
    DAMAGE_FONT_KEY,
    Phaser.GameObjects.RetroFont.Parse(scene, {
      image: DAMAGE_FONT_IMAGE,
      width: DAMAGE_CELL_W,
      height: DAMAGE_CELL_H,
      chars: DAMAGE_DIGITS,
      charsPerRow: DAMAGE_DIGITS.length,
      "offset.x": 0,
      "offset.y": 0,
      "spacing.x": 0,
      "spacing.y": 0,
      lineSpacing: 0,
    }),
  )
}
