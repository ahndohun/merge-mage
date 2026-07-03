import Phaser from "phaser"
import { TextureKeys } from "../TextureKeys"
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
  private readonly available: PixelTextLine[]
  private readonly active = new Set<PixelTextLine>()

  constructor(
    private readonly scene: Phaser.Scene,
    size: number,
    depth: number,
  ) {
    this.available = Array.from({ length: size }, () => new PixelTextLine(scene, 8, depth))
  }

  show(request: DamageTextRequest): void {
    const line = this.available.pop()
    if (line === undefined) {
      return
    }

    const tint = request.critical ? 0xfff06a : 0xf7f7ff
    const scale = request.critical ? 4 : 3
    const value = `${Math.max(1, Math.round(request.damage))}`

    this.active.add(line)
    line.setText(value, { tint, scale })
    line.show(request.x, request.y)

    this.scene.tweens.add({
      targets: line.container,
      y: request.y - 30,
      alpha: 0,
      duration: request.critical ? 720 : 560,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.release(line)
      },
    })
  }

  clear(): void {
    for (const line of this.active) {
      this.scene.tweens.killTweensOf(line.container)
      line.hide()
      this.available.push(line)
    }

    this.active.clear()
  }

  private release(line: PixelTextLine): void {
    line.hide()
    this.active.delete(line)
    this.available.push(line)
  }
}
