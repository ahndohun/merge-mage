import { describe, expect, it } from "vitest"
import { BattleLayout, getMobSpawnPoint, getStaffTipPoint, getWaveIndicator } from "./BattleLayout"

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
