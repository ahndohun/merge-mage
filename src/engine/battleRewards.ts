import {
  BOSS_REWARD_MULTIPLIER,
  BOSS_WAVE,
  GOLD_GAIN_PER_POINT,
  GOLD_REWARD_BASE,
  GOLD_REWARD_GROWTH,
  WIZARD_XP_PER_LEVEL,
  XP_PER_BOSS_KILL,
  XP_PER_KILL,
} from "./constants.js"
import { createWaveEnemies, sumHp } from "./state.js"
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
  const reward = getKillReward(state.stage, boss, state.skills.goldGain)
  const gold = reward * killed
  // XP is kill-count based, NOT gold based: gold grows exponentially per stage
  // while the level threshold is linear, so gold-XP floods skill points late
  // game (measured: 22 unspent points in 3 minutes) and erases the choice.
  const xpPerKill = boss ? XP_PER_BOSS_KILL : XP_PER_KILL
  const withRewards = addWizardXp({ ...state, gold: state.gold + gold }, xpPerKill * killed)
  const killEvents = Array.from({ length: killed }, () => ({
    type: "kill",
    stage: state.stage,
    wave: state.wave,
    gold: reward,
    xp: xpPerKill,
    boss,
  }) satisfies EngineEvent)
  const stateWithEnemies = {
    ...withRewards.state,
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

function getKillReward(stage: number, boss: boolean, goldGain: number): number {
  const reward = Math.ceil(GOLD_REWARD_BASE * GOLD_REWARD_GROWTH ** stage * (1 + GOLD_GAIN_PER_POINT * goldGain))
  return boss ? reward * BOSS_REWARD_MULTIPLIER : reward
}

function getWizardXpThreshold(wizardLevel: number): number {
  return WIZARD_XP_PER_LEVEL * wizardLevel
}
