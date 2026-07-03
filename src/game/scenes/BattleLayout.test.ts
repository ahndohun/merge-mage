import { describe, expect, it } from "vitest"
import {
  BattleLayout,
  getActorHpBarY,
  getMobSpawnPoint,
  getStaffTipPoint,
  getWaveIndicator,
  resolveTomeLaunchPoint,
} from "./BattleLayout"

describe("battle layout helpers", () => {
  it("places the projectile origin at the wizard staff tip instead of the feet", () => {
    const point = getStaffTipPoint({
      x: BattleLayout.wizardX,
      y: BattleLayout.wizardY,
      displayWidth: 64,
      displayHeight: 72,
      originX: 0.46,
      originY: 0.78,
    })

    expect(point.x).toBeGreaterThan(BattleLayout.wizardX + 24)
    expect(point.y).toBeLessThan(BattleLayout.wizardY - 52)
  })

  it("places mob hp bars above the visible sprite top, not transparent frame padding", () => {
    const frameTop = getActorHpBarY({
      displayHeight: 32,
      originY: 0.75,
      scaleY: 2,
      visibleTopPadding: 0,
    })
    const visibleTop = getActorHpBarY({
      displayHeight: 32,
      originY: 0.75,
      scaleY: 2,
      visibleTopPadding: 4,
    })

    expect(frameTop).toBe(-30)
    expect(visibleTop).toBe(-22)
  })

  it("uses the staff tip as the default cast origin when no equipped tome is visible", () => {
    const staffTip = { x: 103, y: 171 }

    expect(resolveTomeLaunchPoint({ entryPoint: null, fallbackPoint: staffTip })).toEqual(staffTip)
  })

  it("uses the equipped tome origin when a tome is visible", () => {
    const staffTip = { x: 103, y: 171 }
    const tomePoint = { x: 116, y: 202 }

    expect(resolveTomeLaunchPoint({ entryPoint: tomePoint, fallbackPoint: staffTip })).toEqual(tomePoint)
  })

  it("spreads regular mobs into loose columns with vertical jitter", () => {
    const points = Array.from({ length: 5 }, (_, index) =>
      getMobSpawnPoint({ index, stage: 2, wave: 4, isBoss: false }),
    )
    const uniqueX = new Set(points.map((point) => point.x))
    const uniqueY = new Set(points.map((point) => point.y))

    expect(uniqueX.size).toBeGreaterThan(1)
    expect(uniqueY.size).toBe(5)
    for (const point of points) {
      expect(point.x).toBeGreaterThanOrEqual(BattleLayout.mobStartX - 68)
      expect(point.x).toBeLessThanOrEqual(BattleLayout.mobStartX)
    }
  })

  it("formats the persistent wave indicator and marks boss waves red", () => {
    expect(getWaveIndicator(7)).toEqual({ text: "W 7/10", tint: 0xfff0a8 })
    expect(getWaveIndicator(10)).toEqual({ text: "BOSS", tint: 0xc4344a })
  })
})
