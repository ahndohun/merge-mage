import Phaser from "phaser"
import { TextureKeys } from "../TextureKeys"
import { DAMAGE_FONT_KEY } from "../UtilityTextures"
import { getPixelGlyphPatternWidth, isPixelGlyph, toPixelGlyph } from "../PixelGlyphs"

const GLYPH_HEIGHT = 5
const GLYPH_GAP = 1
const FALLBACK_FONT_FAMILY = '"Silkscreen", "VT323", "Galmuri9", "Galmuri11", monospace'

type PixelTextOptions = {
  readonly tint: number
  readonly scale: number
  readonly maxWidth?: number
}

export class PixelTextLine {
  readonly container: Phaser.GameObjects.Container

  private readonly glyphs: readonly Phaser.GameObjects.Image[]
  private readonly fallbackText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, maxGlyphs: number, depth: number) {
    this.container = scene.add.container(0, 0).setDepth(depth).setVisible(false)
    this.glyphs = Array.from({ length: maxGlyphs }, () => {
      const image = scene.add.image(0, 0, TextureKeys.glyph(" ")).setOrigin(0, 0).setVisible(false)
      this.container.add(image)
      return image
    })
    this.fallbackText = scene.add
      .text(0, 0, "", {
        color: "#ffffff",
        fontFamily: FALLBACK_FONT_FAMILY,
        fontSize: "15px",
        resolution: 2,
      })
      .setOrigin(0.5)
      .setVisible(false)
    this.container.add(this.fallbackText)
  }

  setText(value: string, options: PixelTextOptions): void {
    if (!canRenderWithPixelGlyphs(value)) {
      this.glyphs.forEach((image) => image.setVisible(false))
      this.fallbackText
        .setText(value)
        .setFontSize(GLYPH_HEIGHT * options.scale)
        .setColor(tintToCssColor(options.tint))
        .setScale(getFitScale(this.fallbackText.width, options.maxWidth))
        .setVisible(true)
      return
    }

    this.fallbackText.setVisible(false).setScale(1)
    const glyphs = [...value].map(toPixelGlyph).slice(0, this.glyphs.length)
    const glyphWidths = glyphs.map(getPixelGlyphPatternWidth)
    const textWidth = glyphWidths.reduce((width, glyphWidth) => width + glyphWidth, 0) + Math.max(0, glyphs.length - 1) * GLYPH_GAP
    const renderScale = options.scale * getFitScale(textWidth * options.scale, options.maxWidth)
    let cursorX = (-textWidth * renderScale) / 2
    const top = (-GLYPH_HEIGHT * renderScale) / 2

    this.glyphs.forEach((image, index) => {
      const glyph = glyphs[index]
      const glyphWidth = glyphWidths[index]
      if (glyph === undefined) {
        image.setVisible(false)
        return
      }
      if (glyphWidth === undefined) {
        image.setVisible(false)
        return
      }

      image
        .setTexture(TextureKeys.glyph(glyph))
        .setPosition(cursorX, top)
        .setScale(renderScale)
        .setTint(options.tint)
        .setVisible(true)
      cursorX += (glyphWidth + GLYPH_GAP) * renderScale
    })
  }

  show(x: number, y: number): void {
    this.container.setPosition(x, y).setAlpha(1).setScale(1).setVisible(true)
  }

  hide(): void {
    this.container.setVisible(false)
  }

  destroy(): void {
    // Container.destroy() cascades to its glyph images and the fallback text.
    this.container.destroy()
  }
}

function canRenderWithPixelGlyphs(value: string): boolean {
  for (const char of value) {
    const normalized = char === "—" ? "-" : char.toUpperCase()
    if (!isPixelGlyph(normalized)) {
      return false
    }
  }
  return true
}

function tintToCssColor(tint: number): string {
  return `#${tint.toString(16).padStart(6, "0")}`
}

function getFitScale(width: number, maxWidth: number | undefined): number {
  if (maxWidth === undefined || width <= maxWidth || width <= 0) {
    return 1
  }

  return maxWidth / width
}

type DamageTextRequest = {
  readonly x: number
  readonly y: number
  readonly damage: number
  readonly critical: boolean
}

export class DamageTextPool {
  private readonly available: Phaser.GameObjects.BitmapText[]
  private readonly active = new Set<Phaser.GameObjects.BitmapText>()

  constructor(
    private readonly scene: Phaser.Scene,
    size: number,
    depth: number,
  ) {
    // BitmapText (batched vertex updates) instead of per-glyph Images — damage
    // numbers change every hit (text-and-bitmaptext Gotcha 14).
    this.available = Array.from({ length: size }, () =>
      this.scene.add.bitmapText(0, 0, DAMAGE_FONT_KEY, "", GLYPH_HEIGHT).setOrigin(0.5).setDepth(depth).setVisible(false),
    )
  }

  show(request: DamageTextRequest): void {
    const text = this.available.pop()
    if (text === undefined) {
      return
    }

    const tint = request.critical ? 0xfff06a : 0xf7f7ff
    const scale = request.critical ? 4 : 3
    const value = `${Math.max(1, Math.round(request.damage))}`

    this.active.add(text)
    text
      .setText(value)
      .setFontSize(GLYPH_HEIGHT * scale)
      .setLetterSpacing(scale)
      .setTint(tint)
      .setPosition(request.x, request.y)
      .setAlpha(1)
      .setVisible(true)

    this.scene.tweens.add({
      targets: text,
      y: request.y - 30,
      alpha: 0,
      duration: request.critical ? 720 : 560,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.release(text)
      },
    })
  }

  clear(): void {
    for (const text of this.active) {
      this.scene.tweens.killTweensOf(text)
      text.setVisible(false)
      this.available.push(text)
    }

    this.active.clear()
  }

  private release(text: Phaser.GameObjects.BitmapText): void {
    text.setVisible(false)
    this.active.delete(text)
    this.available.push(text)
  }
}
