import { SUMMON_COST_BASE, SUMMON_COST_GROWTH, SUMMON_FLOOR_GAP } from "./constants.js"

export function getSummonLevel(highestLevel: number): number {
  return Math.max(1, highestLevel - SUMMON_FLOOR_GAP)
}

export function getSummonCost(summonLevel: number): number {
  return SUMMON_COST_BASE * SUMMON_COST_GROWTH ** summonLevel
}
