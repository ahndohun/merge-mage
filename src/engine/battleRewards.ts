import {
  BOSS_REWARD_MULTIPLIER,
  BOSS_WAVE,
  GOLDEN_RIFT_REWARD_MULTIPLIER,
  GOLD_GAIN_PER_POINT,
  GOLD_REWARD_BASE,
  GOLD_REWARD_GROWTH,
  TRIAL_RIFT_BOSS_MULTIPLIERS,
  WIZARD_XP_PER_LEVEL,
  XP_PER_BOSS_KILL,
  XP_PER_KILL,
} from "./constants.js"
import { getEquippedRelicEffects } from "./relics.js"
import { incrementAchievementCounter, refreshAchievementCounters } from "./achievements.js"
import { createWaveEnemies, sumHp } from "./state.js"
import { getTraitSkillGoldPoints } from "./traits.js"
import type { EngineEvent, EngineState } from "./types.js"

export type DamageApplication = {
  readonly state: EngineState
  readonly events: readonly EngineEvent[]
  readonly goldEarned: number
}

export function finalizeDamage(
  state: EngineState,
  damaged: readonly number[],
  prefixEvents: readonly EngineEvent[],
): DamageApplication {
  const survivors = damaged.filter((hp) => hp > 0)
  const killed = damaged.length - survivors.length
  const boss = state.wave === BOSS_WAVE
  const reward = getKillReward(state, boss)
  const gold = reward * killed
  // XP is kill-count based, NOT gold based: gold grows exponentially per stage
  // while the level threshold is linear, so gold-XP floods skill points late
  // game (measured: 22 unspent points in 3 minutes) and erases the choice.
  const xpPerKill = Math.ceil((boss ? XP_PER_BOSS_KILL : XP_PER_KILL) * getEquippedRelicEffects(state.relics).xpMultiplier)
  const withRewards = addWizardXp({ ...state, gold: state.gold + gold }, xpPerKill * killed)
  const killEvents = Array.from({ length: killed }, () => ({
    type: "kill",
    stage: state.stage,
    wave: state.wave,
    gold: reward,
    xp: xpPerKill,
    boss,
  }) satisfies EngineEvent)
  const countedState = killed > 0 ? incrementAchievementCounter(withRewards.state, "killsTotal", killed) : refreshAchievementCounters(withRewards.state)
  const bossCountedState = boss && killed > 0 ? incrementAchievementCounter(countedState, "bossKills", killed) : countedState
  const stateWithEnemies = {
    ...bossCountedState,
    enemiesHp: survivors,
    stageHp: sumHp(survivors),
  }
  const cleared = survivors.length === 0 ? advanceWave(stateWithEnemies, gold) : { state: stateWithEnemies, events: [] }

  return {
    state: cleared.state,
    events: [...prefixEvents, ...killEvents, ...withRewards.events, ...cleared.events],
    goldEarned: gold,
  }
}

function advanceWave(state: EngineState, bossGold: number): { readonly state: EngineState; readonly events: readonly EngineEvent[] } {
  const clearEvent: EngineEvent = { type: "waveClear", stage: state.stage, wave: state.wave }

  if (state.activeRift?.kind === "trial") {
    const earnedSkillPoints = state.skillPoints + 1
    const nextStep = state.activeRift.step + 1
    if (nextStep >= TRIAL_RIFT_BOSS_MULTIPLIERS.length) {
      return {
        state: {
          ...state,
          ...state.activeRift.snapshot,
          skillPoints: earnedSkillPoints,
          activeRift: null,
        },
        events: [clearEvent, { type: "riftComplete", kind: "trial", reward: TRIAL_RIFT_BOSS_MULTIPLIERS.length }],
      }
    }

    const enemiesHp = createTrialEnemies(state.activeRift.startedStage, nextStep)
    return {
      state: {
        ...state,
        skillPoints: earnedSkillPoints,
        activeRift: { ...state.activeRift, step: nextStep },
        enemiesHp,
        stageHp: sumHp(enemiesHp),
        bossElapsedMs: 0,
        frostSlowMs: 0,
      },
      events: [clearEvent, { type: "bossSpawn", stage: state.stage }],
    }
  }

  if (state.activeRift?.kind === "golden") {
    const nextWave = state.wave === BOSS_WAVE ? 1 : state.wave + 1
    const enemiesHp = createWaveEnemies(state.activeRift.startedStage, nextWave)
    const bossSpawn = nextWave === BOSS_WAVE ? [{ type: "bossSpawn", stage: state.activeRift.startedStage } satisfies EngineEvent] : []
    return {
      state: {
        ...state,
        stage: state.activeRift.startedStage,
        wave: nextWave,
        enemiesHp,
        stageHp: sumHp(enemiesHp),
        bossElapsedMs: 0,
      },
      events: [clearEvent, ...bossSpawn],
    }
  }

  if (state.wave === BOSS_WAVE) {
    const nextStage = state.stage + 1
    const enemiesHp = createWaveEnemies(nextStage, 1)
    return {
      state: {
        ...state,
        stage: nextStage,
        wave: 1,
        enemiesHp,
        stageHp: sumHp(enemiesHp),
        bossElapsedMs: 0,
      },
      events: [clearEvent, { type: "bossKill", stage: state.stage, gold: bossGold }],
    }
  }

  const nextWave = state.wave + 1
  const enemiesHp = createWaveEnemies(state.stage, nextWave)
  const bossSpawn = nextWave === BOSS_WAVE ? [{ type: "bossSpawn", stage: state.stage } satisfies EngineEvent] : []
  return {
    state: {
      ...state,
      wave: nextWave,
      enemiesHp,
      stageHp: sumHp(enemiesHp),
      bossElapsedMs: 0,
    },
    events: [clearEvent, ...bossSpawn],
  }
}

function addWizardXp(state: EngineState, xp: number): { readonly state: EngineState; readonly events: readonly EngineEvent[] } {
  let wizardLevel = state.wizardLevel
  let wizardXp = state.wizardXp + xp
  let skillPoints = state.skillPoints
  let events: readonly EngineEvent[] = []

  while (wizardXp >= getWizardXpThreshold(wizardLevel)) {
    wizardXp -= getWizardXpThreshold(wizardLevel)
    wizardLevel += 1
    skillPoints += 1
    events = [...events, { type: "levelUp", wizardLevel, skillPoints }]
  }

  return {
    state: { ...state, wizardLevel, wizardXp, skillPoints },
    events,
  }
}

function getKillReward(state: EngineState, boss: boolean): number {
  const relicEffects = getEquippedRelicEffects(state.relics)
  const riftMultiplier = state.activeRift?.kind === "golden" ? GOLDEN_RIFT_REWARD_MULTIPLIER : 1
  const reward = Math.ceil(
    GOLD_REWARD_BASE *
      GOLD_REWARD_GROWTH ** state.stage *
      (1 + GOLD_GAIN_PER_POINT * getTraitSkillGoldPoints(state)) *
      relicEffects.goldMultiplier *
      riftMultiplier,
  )
  return boss ? Math.ceil(reward * BOSS_REWARD_MULTIPLIER * relicEffects.bossGoldMultiplier) : reward
}

function getWizardXpThreshold(wizardLevel: number): number {
  return WIZARD_XP_PER_LEVEL * wizardLevel
}

function createTrialEnemies(stage: number, step: number): readonly number[] {
  const multiplier = TRIAL_RIFT_BOSS_MULTIPLIERS[step] ?? 2.2
  const hp = createWaveEnemies(stage, BOSS_WAVE)[0] ?? 1
  return [hp * multiplier]
}
