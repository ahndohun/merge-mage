import { SUMMON_COST_BASE, SUMMON_COST_GROWTH, SUMMON_FLOOR_GAP } from "./constants.js"

export function getSummonLevel(highestLevel: number): number {
  return Math.max(1, highestLevel - SUMMON_FLOOR_GAP)
}

export function getSummonCost(summonLevel: number, costMultiplier = 1): number {
  // Integral gold at the source: the displayed cost and the charged cost must
  // be the same number (TestSprite round-1 catch: button said 24, charge was 24.4).
  return Math.ceil(SUMMON_COST_BASE * SUMMON_COST_GROWTH ** summonLevel * costMultiplier)
}
