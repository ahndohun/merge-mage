import Phaser from "phaser"
import type { EquippedBooks, SlotIndex, Spellbook } from "../../engine/types"
import { ElementColors, TextureKeys } from "../TextureKeys"
import { resolveTomeLaunchPoint } from "./BattleLayout"

type Point = {
  readonly x: number
  readonly y: number
}

type TomeEntry = {
  readonly slotIdx: SlotIndex
  readonly holder: Phaser.GameObjects.Container
  readonly glow: Phaser.GameObjects.Image
  readonly sprite: Phaser.GameObjects.Image
  readonly orbit: {
    angle: number
  }
  bookId: string | null
  tint: number
}

const SLOT_INDEXES = [0, 1, 2, 3, 4, 5] as const
export const ORBITING_TOME_VISUALS = {
  orbitRx: 66,
  orbitRy: 44,
  scale: 1.2,
  punchScale: 1.7,
  glowSize: 14,
  wizardBackDepth: 16,
  wizardFrontDepth: 19,
} as const

const ORBIT_PERIOD_MS = 6_000

export class OrbitingTomesView {
  private readonly tomes: TomeEntry[]
  private center: Point
  private lastTime = 0

  constructor(private readonly scene: Phaser.Scene, center: Point) {
    this.center = center
    this.tomes = SLOT_INDEXES.map((slotIdx) => {
      const glow = scene.add.image(0, 0, TextureKeys.pixel).setOrigin(0.5).setAlpha(0.2).setDisplaySize(ORBITING_TOME_VISUALS.glowSize, ORBITING_TOME_VISUALS.glowSize)
      const sprite = scene.add.image(0, 0, TextureKeys.tome.fire).setOrigin(0.5).setScale(ORBITING_TOME_VISUALS.scale)
      const holder = scene.add.container(center.x, center.y, [glow, sprite]).setVisible(false).setDepth(ORBITING_TOME_VISUALS.wizardBackDepth)

      return {
        slotIdx,
        holder,
        glow,
        sprite,
        orbit: { angle: getSlotAngle(slotIdx, SLOT_INDEXES.length) },
        bookId: null,
        tint: ElementColors.fire,
      }
    })
  }

  syncEquipped(equipped: EquippedBooks): void {
    const visibleSlots = SLOT_INDEXES.filter((slotIdx) => equipped[slotIdx] !== null)
    for (const entry of this.tomes) {
      const book = equipped[entry.slotIdx]
      if (book === null) {
        this.hideEntry(entry)
        continue
      }

      const visibleIndex = visibleSlots.indexOf(entry.slotIdx)
      const targetAngle = getSlotAngle(visibleIndex, visibleSlots.length)
      this.showEntry(entry, book, targetAngle)
    }
  }

  update(time: number, center: Point): void {
    this.lastTime = time
    this.center = center
    this.positionEntries(time)
  }

  playCast(slotIdx: SlotIndex, fallbackOrigin: Point, onLaunch: (origin: Point) => void): void {
    const entry = this.tomes[slotIdx]
    if (entry === undefined || !entry.holder.visible) {
      onLaunch(resolveTomeLaunchPoint({ entryPoint: null, fallbackPoint: fallbackOrigin }))
      return
    }

    this.scene.tweens.killTweensOf(entry.sprite)
    this.scene.tweens.killTweensOf(entry.holder)
    entry.sprite.setAlpha(1).setScale(ORBITING_TOME_VISUALS.scale).setTintMode(Phaser.TintModes.ADD)
    this.scene.tweens.add({
      targets: entry.sprite,
      scale: ORBITING_TOME_VISUALS.punchScale,
      duration: 75,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        onLaunch(resolveTomeLaunchPoint({ entryPoint: this.getEntryPoint(entry), fallbackPoint: fallbackOrigin }))
        entry.sprite.setAlpha(0.35).setScale(ORBITING_TOME_VISUALS.scale).setTint(entry.tint).setTintMode(Phaser.TintModes.MULTIPLY)
        this.scene.tweens.add({
          targets: entry.sprite,
          alpha: 1,
          duration: 400,
          ease: "Sine.easeOut",
        })
      },
    })
  }

  destroy(): void {
    for (const entry of this.tomes) {
      this.scene.tweens.killTweensOf(entry.orbit)
      this.scene.tweens.killTweensOf(entry.sprite)
      this.scene.tweens.killTweensOf(entry.holder)
      entry.holder.destroy()
    }
  }

  private showEntry(entry: TomeEntry, book: Spellbook, targetAngle: number): void {
    const elementColor = ElementColors[book.element]
    const bookChanged = entry.bookId !== book.id
    entry.bookId = book.id
    entry.tint = elementColor
    entry.glow.setTint(elementColor)
    entry.sprite.setTexture(TextureKeys.tome[book.element]).setTint(elementColor).setTintMode(Phaser.TintModes.MULTIPLY)

    if (bookChanged) {
      entry.holder.setAlpha(0).setVisible(true)
      entry.sprite.setScale(ORBITING_TOME_VISUALS.scale)
      this.scene.tweens.add({
        targets: entry.holder,
        alpha: 1,
        duration: 160,
        ease: "Sine.easeOut",
      })
    } else {
      entry.holder.setVisible(true)
    }

    const nextAngle = closestAngle(entry.orbit.angle, targetAngle)
    this.scene.tweens.killTweensOf(entry.orbit)
    this.scene.tweens.add({
      targets: entry.orbit,
      angle: nextAngle,
      duration: 220,
      ease: "Sine.easeInOut",
    })
  }

  private hideEntry(entry: TomeEntry): void {
    entry.bookId = null
    this.scene.tweens.killTweensOf(entry.orbit)
    this.scene.tweens.killTweensOf(entry.sprite)
    this.scene.tweens.killTweensOf(entry.holder)
    entry.holder.setVisible(false).setAlpha(1)
    entry.sprite.setAlpha(1).setScale(ORBITING_TOME_VISUALS.scale).clearTint()
  }

  private positionEntries(time: number): void {
    const baseAngle = (time / ORBIT_PERIOD_MS) * Math.PI * 2
    for (const entry of this.tomes) {
      if (!entry.holder.visible) {
        continue
      }

      const angle = baseAngle + entry.orbit.angle
      const x = Math.round(this.center.x + Math.cos(angle) * ORBITING_TOME_VISUALS.orbitRx)
      const y = Math.round(this.center.y + Math.sin(angle) * ORBITING_TOME_VISUALS.orbitRy)
      entry.holder.setPosition(x, y)
      entry.holder.setDepth(y >= this.center.y ? ORBITING_TOME_VISUALS.wizardFrontDepth : ORBITING_TOME_VISUALS.wizardBackDepth)
    }
  }

  private getEntryPoint(entry: TomeEntry): Point {
    this.positionEntries(this.lastTime)
    return {
      x: Math.round(entry.holder.x),
      y: Math.round(entry.holder.y),
    }
  }
}

function getSlotAngle(index: number, count: number): number {
  if (count <= 0) {
    return 0
  }

  return -Math.PI / 2 + (index / count) * Math.PI * 2
}

function closestAngle(current: number, target: number): number {
  const turn = Math.PI * 2
  const delta = ((((target - current) % turn) + Math.PI * 3) % turn) - Math.PI
  return current + delta
}
