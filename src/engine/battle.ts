import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  BOSS_ENRAGE_MS,
  BOSS_WAVE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  CRIT_DAMAGE_MULTIPLIER,
  DMG_BASE,
  DMG_GROWTH,
  FIRE_TARGET_CAP,
  FROST_SLOW_FACTOR,
  FROST_SLOW_MS,
  MANA_DAMAGE_PER_CRYSTAL,
  MIN_CAST_INTERVAL_MS,
  SLOT_INDEXES,
  TICK_MS,
} from "./constants.js"
import { getSlotMultiplier } from "./actions.js"
import { finalizeDamage, type DamageApplication } from "./battleRewards.js"
import { getCodexBonusMultiplier } from "./codex.js"
import { getFireTargetCap, getFrostSlow, getHolyBossMultiplier } from "./resonance.js"
import { nextRandomState } from "./rng.js"
import { createWaveEnemies, setSlotTimer, sumHp } from "./state.js"
import { applyTraitCastInterval, getTraitCodexBonusPerTier, getTraitElementDamageMultiplier } from "./traits.js"
import { assertNever, type Element, type EngineEvent, type EngineState, type SlotIndex, type Spellbook } from "./types.js"

const INNATE_STAFF_INTERVAL_MS = 1_200
const INNATE_STAFF_BOOK_ID = "wizard-staff"

export type DamageRoll = {
  readonly state: EngineState
  readonly damage: number
  readonly critical: boolean
}

export type TickSimulation = {
  readonly state: EngineState
  readonly events: readonly EngineEvent[]
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
    getElementProgressionMultiplier(state, book.element) *
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
    const previousElapsedMs = current.elapsedMs
    current = {
      ...current,
      elapsedMs: previousElapsedMs + TICK_MS,
      frostSlowMs: Math.max(0, current.frostSlowMs - TICK_MS),
    }

    if (shouldCastInnateStaff(previousElapsedMs, current.elapsedMs)) {
      const applied = applyInnateStaffDamage(current)
      current = applied.state
      events = [...events, ...applied.events]
      goldEarned += applied.goldEarned
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

function shouldCastInnateStaff(previousElapsedMs: number, nextElapsedMs: number): boolean {
  return Math.floor(previousElapsedMs / INNATE_STAFF_INTERVAL_MS) < Math.floor(nextElapsedMs / INNATE_STAFF_INTERVAL_MS)
}

function applyInnateStaffDamage(state: EngineState): DamageApplication {
  if (state.enemiesHp.length === 0) {
    return { state, events: [], goldEarned: 0 }
  }

  const damage = DMG_BASE * 0.6 * (1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)
  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
  const castEvent: EngineEvent = {
    type: "cast",
    bookId: INNATE_STAFF_BOOK_ID,
    slotIdx: 0,
    element: "arcane",
    damage,
    critical: false,
    targetIndex: 0,
    targetsHit: 1,
  }

  return finalizeDamage(state, damaged, [castEvent])
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

  const targetsHit = getTargetsHit(book.element, state.enemiesHp.length, state)
  const damage = getElementDamage(book.element, baseDamage, state.wave, state)
  const damaged = state.enemiesHp.map((hp, index) => (index < targetsHit ? hp - damage : hp))
  const castEvent: EngineEvent = {
    type: "cast",
    bookId: book.id,
    slotIdx: slot,
    element: book.element,
    damage,
    critical,
    targetIndex: 0,
    targetsHit,
  }
  const frostSlow = getFrostSlow(state)
  const slowEvents: readonly EngineEvent[] =
    book.element === "frost" ? [{ type: "slow", durationMs: frostSlow.durationMs, factor: frostSlow.factor }] : []
  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlow.durationMs) } : state
  return finalizeDamage(slowedState, damaged, [castEvent, ...slowEvents])
}

function normalizeBattleState(state: EngineState): EngineState {
  if (state.enemiesHp.length > 0) {
    return { ...state, stageHp: sumHp(state.enemiesHp) }
  }

  const enemiesHp = createWaveEnemies(state.stage, state.wave)
  return { ...state, enemiesHp, stageHp: sumHp(enemiesHp) }
}

function getTargetsHit(element: Element, enemyCount: number, state: EngineState): number {
  switch (element) {
    case "fire":
      return Math.min(getFireTargetCap(state), enemyCount)
    case "frost":
      return Math.min(1, enemyCount)
    case "holy":
      return Math.min(1, enemyCount)
    default:
      return assertNever(element)
  }
}

function getElementDamage(element: Element, damage: number, wave: number, state: EngineState): number {
  switch (element) {
    case "fire":
      return damage
    case "frost":
      return damage
    case "holy":
      return wave === BOSS_WAVE ? damage * getHolyBossMultiplier(state) : damage
    default:
      return assertNever(element)
  }
}

function getCastIntervalMs(state: EngineState): number {
  return applyTraitCastInterval(state, Math.max(MIN_CAST_INTERVAL_MS, BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * state.skills.castSpeed))
}

function getElementProgressionMultiplier(state: EngineState, element: Element): number {
  const codexTiers = state.codex.tiers[element] ?? 0
  return getCodexBonusMultiplier(state, element) * (1 + getTraitCodexBonusPerTier(state) * codexTiers) * getTraitElementDamageMultiplier(state, element)
}
