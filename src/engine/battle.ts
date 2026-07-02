import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  BOSS_ENRAGE_MS,
  BOSS_REWARD_MULTIPLIER,
  BOSS_WAVE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  CRIT_DAMAGE_MULTIPLIER,
  DMG_BASE,
  DMG_GROWTH,
  FIRE_TARGET_CAP,
  FROST_SLOW_FACTOR,
  FROST_SLOW_MS,
  GOLD_GAIN_PER_POINT,
  GOLD_REWARD_BASE,
  GOLD_REWARD_GROWTH,
  MANA_DAMAGE_PER_CRYSTAL,
  MIN_CAST_INTERVAL_MS,
  SLOT_INDEXES,
  TICK_MS,
  WIZARD_XP_PER_LEVEL,
} from "./constants"
import { getSlotMultiplier } from "./actions"
import { nextRandomState } from "./rng"
import { createWaveEnemies, setSlotTimer, sumHp } from "./state"
import { assertNever, type Element, type EngineEvent, type EngineState, type SlotIndex, type Spellbook } from "./types"

export type DamageRoll = {
  readonly state: EngineState
  readonly damage: number
  readonly critical: boolean
}

export type TickSimulation = {
  readonly state: EngineState
  readonly events: readonly EngineEvent[]
}

type DamageApplication = {
  readonly state: EngineState
  readonly events: readonly EngineEvent[]
  readonly goldEarned: number
}

export function bookDamage(book: Spellbook, slotTier: number, state: EngineState): DamageRoll {
  const roll = nextRandomState(state.rngState)
  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance)
  const critical = roll.value < critChance
  const critFactor = critical ? CRIT_DAMAGE_MULTIPLIER : 1
  const damage =
    DMG_BASE *
    DMG_GROWTH ** book.level *
    getSlotMultiplier(slotTier) *
    (1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
    critFactor

  return {
    state: { ...state, rngState: roll.state },
    damage,
    critical,
  }
}

export function simulateTicks(state: EngineState, nTicks: number): TickSimulation {
  let current = normalizeBattleState(state)
  let events: readonly EngineEvent[] = []
  let goldEarned = 0

  for (let tick = 0; tick < nTicks; tick += 1) {
    current = {
      ...current,
      elapsedMs: current.elapsedMs + TICK_MS,
      frostSlowMs: Math.max(0, current.frostSlowMs - TICK_MS),
    }

    for (const slot of SLOT_INDEXES) {
      const book = current.equipped[slot]
      if (book === null) {
        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, 0) }
        continue
      }

      const nextProgress = current.castProgressMs[slot] + TICK_MS
      const castInterval = getCastIntervalMs(current)
      if (nextProgress < castInterval) {
        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, nextProgress) }
        continue
      }

      const damageRoll = bookDamage(book, current.slotTiers[slot], current)
      current = { ...damageRoll.state, castProgressMs: setSlotTimer(damageRoll.state.castProgressMs, slot, nextProgress - castInterval) }
      const applied = applyCastDamage(current, slot, book, damageRoll.damage, damageRoll.critical)
      current = applied.state
      events = [...events, ...applied.events]
      goldEarned += applied.goldEarned
    }

    if (current.wave === BOSS_WAVE && current.enemiesHp.length > 0) {
      const bossElapsedMs = current.bossElapsedMs + TICK_MS
      current = { ...current, bossElapsedMs }
      if (bossElapsedMs >= BOSS_ENRAGE_MS) {
        const enemiesHp = createWaveEnemies(current.stage, 1)
        current = {
          ...current,
          wave: 1,
          enemiesHp,
          stageHp: sumHp(enemiesHp),
          bossElapsedMs: 0,
          frostSlowMs: 0,
        }
        events = [...events, { type: "bossFail", stage: current.stage }]
      }
    }
  }

  return {
    state: {
      ...current,
      recentGoldPerSecond: nTicks > 0 ? goldEarned / ((nTicks * TICK_MS) / 1_000) : current.recentGoldPerSecond,
    },
    events,
  }
}

function applyCastDamage(
  state: EngineState,
  slot: SlotIndex,
  book: Spellbook,
  baseDamage: number,
  critical: boolean,
): DamageApplication {
  if (state.enemiesHp.length === 0) {
    return { state, events: [], goldEarned: 0 }
  }

  const targetsHit = getTargetsHit(book.element, state.enemiesHp.length)
  const damage = getElementDamage(book.element, baseDamage, state.wave)
  const damaged = state.enemiesHp.map((hp, index) => (index < targetsHit ? hp - damage : hp))
  const survivors = damaged.filter((hp) => hp > 0)
  const killed = damaged.length - survivors.length
  const castEvent: EngineEvent = {
    type: "cast",
    bookId: book.id,
    slotIdx: slot,
    element: book.element,
    damage,
    critical,
    targetsHit,
  }
  const slowEvents: readonly EngineEvent[] =
    book.element === "frost" ? [{ type: "slow", durationMs: FROST_SLOW_MS, factor: FROST_SLOW_FACTOR }] : []
  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, FROST_SLOW_MS) } : state
  const reward = getKillReward(state.stage, state.wave === BOSS_WAVE, state.skills.goldGain)
  const gold = reward * killed
  const withRewards = addWizardXp({ ...slowedState, gold: slowedState.gold + gold }, gold)
  const killEvents = Array.from({ length: killed }, () => ({
    type: "kill",
    stage: state.stage,
    wave: state.wave,
    gold: reward,
    xp: reward,
    boss: state.wave === BOSS_WAVE,
  }) satisfies EngineEvent)
  const stateWithEnemies = {
    ...withRewards.state,
    enemiesHp: survivors,
    stageHp: sumHp(survivors),
  }
  const cleared = survivors.length === 0 ? advanceWave(stateWithEnemies, gold) : { state: stateWithEnemies, events: [] }

  return {
    state: cleared.state,
    events: [castEvent, ...slowEvents, ...killEvents, ...withRewards.events, ...cleared.events],
    goldEarned: gold,
  }
}

function advanceWave(state: EngineState, bossGold: number): TickSimulation {
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

function addWizardXp(state: EngineState, xp: number): TickSimulation {
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

function normalizeBattleState(state: EngineState): EngineState {
  if (state.enemiesHp.length > 0) {
    return { ...state, stageHp: sumHp(state.enemiesHp) }
  }

  const enemiesHp = createWaveEnemies(state.stage, state.wave)
  return { ...state, enemiesHp, stageHp: sumHp(enemiesHp) }
}

function getTargetsHit(element: Element, enemyCount: number): number {
  switch (element) {
    case "fire":
      return Math.min(FIRE_TARGET_CAP, enemyCount)
    case "frost":
      return Math.min(1, enemyCount)
    case "holy":
      return Math.min(1, enemyCount)
    default:
      return assertNever(element)
  }
}

function getElementDamage(element: Element, damage: number, wave: number): number {
  switch (element) {
    case "fire":
      return damage
    case "frost":
      return damage
    case "holy":
      return wave === BOSS_WAVE ? damage * 2 : damage
    default:
      return assertNever(element)
  }
}

function getCastIntervalMs(state: EngineState): number {
  return Math.max(MIN_CAST_INTERVAL_MS, BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * state.skills.castSpeed)
}

function getKillReward(stage: number, boss: boolean, goldGain: number): number {
  const reward = Math.ceil(GOLD_REWARD_BASE * GOLD_REWARD_GROWTH ** stage * (1 + GOLD_GAIN_PER_POINT * goldGain))
  return boss ? reward * BOSS_REWARD_MULTIPLIER : reward
}

function getWizardXpThreshold(wizardLevel: number): number {
  return WIZARD_XP_PER_LEVEL * wizardLevel
}
