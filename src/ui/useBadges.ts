import { getSlotUpgradeCost } from "../engine/actions"
import { getPrestigeCrystalReward } from "../engine/balance"
import { getMineClaimPreview, hasDailyMissionClaim } from "../engine/camp"
import { getClaimableQuests } from "../engine/quests"
import { getUnlockedFeatures } from "../engine/unlocks"
import type { EngineState } from "../engine/types"

export type BadgeFlags = {
  readonly books: boolean
  readonly wizard: boolean
  readonly journey: boolean
  readonly camp: boolean
  readonly rebirth: boolean
}

export function getRebirthPreviewCrystals(stage: number): number {
  return getPrestigeCrystalReward(stage, 1)
}

export function getMinimumSlotUpgradeCost(state: EngineState): number {
  return Math.min(...state.slotTiers.map((tier) => getSlotUpgradeCost(tier)))
}

export function canAffordSlotUpgrade(state: EngineState, slotIdx: number): boolean {
  const tier = state.slotTiers[slotIdx] ?? 0
  return state.gold >= getSlotUpgradeCost(tier)
}

export function useBadges(state: EngineState): BadgeFlags {
  const unlocked = getUnlockedFeatures(state)
  const rebirthPreview = getRebirthPreviewCrystals(state.stage)

  return {
    books: false,
    wizard: unlocked.wizard && state.skillPoints > 0,
    journey: unlocked.journey && getClaimableQuests(state).length > 0,
    camp: unlocked.camp && (getMineClaimPreview(state, Date.now()).claimable || hasDailyMissionClaim(state, new Date())),
    rebirth:
      unlocked.rebirth &&
      state.stage >= 10 &&
      rebirthPreview > 0 &&
      rebirthPreview >= state.manaCrystals * 0.5,
  }
}
