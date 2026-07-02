import Phaser from "phaser"
import { TextureKeys } from "../TextureKeys"
import { toPixelGlyph } from "../PixelGlyphs"

const GLYPH_WIDTH = 3
const GLYPH_HEIGHT = 5
const GLYPH_GAP = 1

type PixelTextOptions = {
  readonly tint: number
  readonly scale: number
}

export class PixelTextLine {
  readonly container: Phaser.GameObjects.Container

  private readonly glyphs: readonly Phaser.GameObjects.Image[]

  constructor(scene: Phaser.Scene, maxGlyphs: number, depth: number) {
    this.container = scene.add.container(0, 0).setDepth(depth).setVisible(false)
    this.glyphs = Array.from({ length: maxGlyphs }, () => {
      const image = scene.add.image(0, 0, TextureKeys.glyph(" ")).setOrigin(0, 0).setVisible(false)
      this.container.add(image)
      return image
    })
  }

  setText(value: string, options: PixelTextOptions): void {
    const glyphs = [...value].map(toPixelGlyph).slice(0, this.glyphs.length)
    const width = glyphs.length * GLYPH_WIDTH + Math.max(0, glyphs.length - 1) * GLYPH_GAP
    const left = (-width * options.scale) / 2
    const top = (-GLYPH_HEIGHT * options.scale) / 2

    this.glyphs.forEach((image, index) => {
      const glyph = glyphs[index]
      if (glyph === undefined) {
        image.setVisible(false)
        return
      }

      image
        .setTexture(TextureKeys.glyph(glyph))
        .setPosition(left + index * (GLYPH_WIDTH + GLYPH_GAP) * options.scale, top)
        .setScale(options.scale)
        .setTint(options.tint)
        .setVisible(true)
    })
  }

  show(x: number, y: number): void {
    this.container.setPosition(x, y).setAlpha(1).setScale(1).setVisible(true)
  }

  hide(): void {
    this.container.setVisible(false)
  }
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
