import Phaser from "phaser"
import type { Element } from "../engine/types"
import { PIXEL_GLYPHS, PixelGlyphPatterns, type PixelGlyph } from "./PixelGlyphs"

export const PLACEHOLDER_MODE = true

export const ElementColors: Record<Element, number> = {
  fire: 0xff6242,
  frost: 0x6dd7ff,
  holy: 0xfff0a8,
}

export const TextureKeys = {
  wizard: "battle:wizard",
  boss: "battle:boss",
  coin: "battle:coin",
  pixel: "battle:pixel",
  particle: "battle:particle",
  mob: {
    fire: "battle:mob:fire",
    frost: "battle:mob:frost",
    holy: "battle:mob:holy",
  },
  projectile: {
    fire: "battle:projectile:fire",
    frost: "battle:projectile:frost",
    holy: "battle:projectile:holy",
  },
  glyph(glyph: PixelGlyph): string {
    return `battle:glyph:${glyph}`
  },
} as const

export const AnimationKeys = {
  cast: "battle:anim:cast",
  mobHit: "battle:anim:mob-hit",
  mobDeath: "battle:anim:mob-death",
} as const

export function registerPlaceholderTextures(scene: Phaser.Scene): void {
  if (!PLACEHOLDER_MODE || scene.textures.exists(TextureKeys.wizard)) {
    return
  }

  const graphics = scene.add.graphics()
  generatePixel(graphics)
  generateWizard(graphics)
  generateBoss(graphics)
  generateCoin(graphics)
  generateParticle(graphics)

  for (const element of ["fire", "frost", "holy"] as const) {
    generateMob(graphics, element, ElementColors[element])
    generateProjectile(graphics, element, ElementColors[element])
  }

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

function generateWizard(graphics: Phaser.GameObjects.Graphics): void {
  graphics.clear()
  graphics.fillStyle(0x111827, 1)
  graphics.fillRect(7, 10, 10, 17)
  graphics.fillStyle(0x3b2b64, 1)
  graphics.fillRect(5, 14, 14, 14)
  graphics.fillStyle(0x9a7cf2, 1)
  graphics.fillRect(8, 5, 8, 8)
  graphics.fillRect(4, 10, 16, 3)
  graphics.fillStyle(0xf4d7a1, 1)
  graphics.fillRect(9, 12, 6, 6)
  graphics.fillStyle(0xe8d7ff, 1)
  graphics.fillRect(14, 17, 3, 11)
  graphics.fillStyle(0x5e47bd, 1)
  graphics.fillRect(6, 27, 12, 3)
  graphics.generateTexture(TextureKeys.wizard, 24, 32)
}

function generateMob(graphics: Phaser.GameObjects.Graphics, element: Element, color: number): void {
  graphics.clear()
  graphics.fillStyle(0x15151e, 1)
  graphics.fillRect(4, 5, 12, 12)
  graphics.fillStyle(color, 1)
  graphics.fillRect(6, 3, 8, 4)
  graphics.fillRect(3, 8, 14, 7)
  graphics.fillStyle(0xffffff, 1)
  graphics.fillRect(7, 8, 2, 2)
  graphics.fillRect(12, 8, 2, 2)
  graphics.fillStyle(0x0b0d13, 1)
  graphics.fillRect(5, 15, 3, 3)
  graphics.fillRect(13, 15, 3, 3)
  graphics.generateTexture(TextureKeys.mob[element], 20, 20)
}

function generateBoss(graphics: Phaser.GameObjects.Graphics): void {
  graphics.clear()
  graphics.fillStyle(0x2b122b, 1)
  graphics.fillRect(9, 12, 30, 26)
  graphics.fillStyle(0xff3f68, 1)
  graphics.fillRect(5, 17, 38, 16)
  graphics.fillRect(13, 6, 22, 12)
  graphics.fillStyle(0xffc857, 1)
  graphics.fillRect(15, 18, 5, 5)
  graphics.fillRect(28, 18, 5, 5)
  graphics.fillStyle(0x120814, 1)
  graphics.fillRect(11, 38, 8, 5)
  graphics.fillRect(29, 38, 8, 5)
  graphics.generateTexture(TextureKeys.boss, 48, 48)
}

function generateProjectile(graphics: Phaser.GameObjects.Graphics, element: Element, color: number): void {
  graphics.clear()
  graphics.fillStyle(0xffffff, 1)
  graphics.fillRect(3, 0, 2, 8)
  graphics.fillRect(0, 3, 8, 2)
  graphics.fillStyle(color, 1)
  graphics.fillRect(2, 2, 4, 4)
  graphics.generateTexture(TextureKeys.projectile[element], 8, 8)
}

function generateCoin(graphics: Phaser.GameObjects.Graphics): void {
  graphics.clear()
  graphics.fillStyle(0x8d5a12, 1)
  graphics.fillRect(2, 1, 4, 6)
  graphics.fillRect(1, 2, 6, 4)
  graphics.fillStyle(0xffd24a, 1)
  graphics.fillRect(2, 2, 4, 4)
  graphics.fillStyle(0xfff3a3, 1)
  graphics.fillRect(3, 2, 2, 1)
  graphics.generateTexture(TextureKeys.coin, 8, 8)
}

function generateParticle(graphics: Phaser.GameObjects.Graphics): void {
  graphics.clear()
  graphics.fillStyle(0xffffff, 1)
  graphics.fillRect(1, 0, 2, 4)
  graphics.fillRect(0, 1, 4, 2)
  graphics.generateTexture(TextureKeys.particle, 4, 4)
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
