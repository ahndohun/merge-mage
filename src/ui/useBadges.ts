import { getSlotUpgradeCost } from "../engine/actions"
import { getMineClaimPreview, hasDailyMissionClaim } from "../engine/camp"
import type { EngineState } from "../engine/types"

export type BadgeFlags = {
  readonly books: boolean
  readonly skills: boolean
  readonly camp: boolean
  readonly rebirth: boolean
}

export function getRebirthPreviewCrystals(stage: number): number {
  return Math.floor(stage ** 1.5 / 10)
}

export function getMinimumSlotUpgradeCost(state: EngineState): number {
  return Math.min(...state.slotTiers.map((tier) => getSlotUpgradeCost(tier)))
}

export function canAffordSlotUpgrade(state: EngineState, slotIdx: number): boolean {
  const tier = state.slotTiers[slotIdx] ?? 0
  return state.gold >= getSlotUpgradeCost(tier)
}

export function useBadges(state: EngineState): BadgeFlags {
  const minUpgradeCost = getMinimumSlotUpgradeCost(state)
  const rebirthPreview = getRebirthPreviewCrystals(state.stage)

  return {
    books: state.gold >= minUpgradeCost,
    skills: state.skillPoints > 0,
    camp: getMineClaimPreview(state, Date.now()).claimable || hasDailyMissionClaim(state, new Date()),
    rebirth:
      state.stage >= 10 &&
      rebirthPreview > 0 &&
      rebirthPreview >= state.manaCrystals * 0.5,
  }
}
