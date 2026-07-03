import {
  BOSS_ENRAGE_MS,
  BOSS_EXPECTED_DPS_BASE,
  BOSS_EXPECTED_DPS_GROWTH,
  BOSS_GATE_FACTOR,
  BOSS_REGULAR_FACTOR,
  BOSS_WALL_FACTOR,
  PRESTIGE_CRYSTAL_DIVISOR,
  PRESTIGE_CRYSTAL_EXPONENT,
  PRESTIGE_STAGE_OFFSET,
  REGULAR_MOB_MAX_COUNT,
  REGULAR_MOB_MIN_COUNT,
  REGULAR_MOB_STAGE_BAND,
  TOME_DAMAGE_MILESTONE_MULTIPLIER,
  TOME_DAMAGE_MILESTONES,
  WIZARD_CAST_INTERVAL_MULTIPLIER,
  WIZARD_CAST_MILESTONE_LEVEL,
  WIZARD_CRIT_CHANCE_BONUS,
  WIZARD_CRIT_MILESTONE_LEVEL,
  WIZARD_GOLD_MILESTONE_LEVEL,
  WIZARD_GOLD_MULTIPLIER,
} from "./constants.js"

export function getRegularMobCount(stage: number): number {
  return Math.min(REGULAR_MOB_MAX_COUNT, REGULAR_MOB_MIN_COUNT + Math.floor(Math.max(0, stage - 1) / REGULAR_MOB_STAGE_BAND))
}

export function getTomeMilestoneDamageMultiplier(highestLevelEver: number): number {
  const completedMilestones = TOME_DAMAGE_MILESTONES.filter((level) => highestLevelEver >= level).length
  return TOME_DAMAGE_MILESTONE_MULTIPLIER ** completedMilestones
}

export function getWizardCastIntervalMultiplier(wizardLevel: number): number {
  return wizardLevel >= WIZARD_CAST_MILESTONE_LEVEL ? WIZARD_CAST_INTERVAL_MULTIPLIER : 1
}

export function getWizardCritChanceBonus(wizardLevel: number): number {
  return wizardLevel >= WIZARD_CRIT_MILESTONE_LEVEL ? WIZARD_CRIT_CHANCE_BONUS : 0
}

export function getWizardGoldMultiplier(wizardLevel: number): number {
  return wizardLevel >= WIZARD_GOLD_MILESTONE_LEVEL ? WIZARD_GOLD_MULTIPLIER : 1
}

export function getBossExpectedDps(stage: number): number {
  return BOSS_EXPECTED_DPS_BASE * BOSS_EXPECTED_DPS_GROWTH ** stage
}

export function getBossFactor(stage: number): number {
  if (stage % 10 === 0) {
    return BOSS_GATE_FACTOR
  }
  if (stage % 5 === 0) {
    return BOSS_WALL_FACTOR
  }
  return BOSS_REGULAR_FACTOR
}

export function getBossHp(stage: number): number {
  return getBossExpectedDps(stage) * (BOSS_ENRAGE_MS / 1_000) * getBossFactor(stage)
}

export function getBossRequiredDps(stage: number): number {
  return getBossHp(stage) / (BOSS_ENRAGE_MS / 1_000)
}

export function getPrestigeCrystalReward(stage: number, crystalGainMultiplier: number): number {
  const progress = Math.max(0, stage - PRESTIGE_STAGE_OFFSET)
  return Math.floor((progress ** PRESTIGE_CRYSTAL_EXPONENT / PRESTIGE_CRYSTAL_DIVISOR) * crystalGainMultiplier)
}
