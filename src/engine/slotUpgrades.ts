import {
  SLOT_MULTIPLIER_PER_TIER,
  SLOT_UPGRADE_COST_BASE,
  SLOT_UPGRADE_COST_GROWTH,
} from "./constants.js"

export function getSlotUpgradeCost(currentTier: number): number {
  return SLOT_UPGRADE_COST_BASE * SLOT_UPGRADE_COST_GROWTH ** currentTier
}

export function getSlotMultiplier(currentTier: number): number {
  return 1 + SLOT_MULTIPLIER_PER_TIER * currentTier
}
