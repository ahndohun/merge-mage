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
  GOLDEN_RIFT_MS,
  MANA_DAMAGE_PER_CRYSTAL,
  MIN_CAST_INTERVAL_MS,
  SLOT_INDEXES,
  TICK_MS,
} from "./constants.js"
import { getBossRequiredDps, getTomeMilestoneDamageMultiplier, getWizardCastIntervalMultiplier, getWizardCritChanceBonus } from "./balance.js"
import { getPetDps, shouldPetAttack } from "./camp.js"
import { getSlotMultiplier } from "./actions.js"
import { finalizeDamage, type DamageApplication } from "./battleRewards.js"
import { getElementDamageMultiplier, getEquippedRelicEffects } from "./relics.js"
import { getCodexBonusMultiplier } from "./codex.js"
import { getFireTargetCap, getFrostSlow, getHolyBossMultiplier } from "./resonance.js"
import {
  getAbsoluteZeroExecute,
  getChainIgnitionSplash,
  getFrostBuildupMultiplier,
  getInfernoMultiplier,
  getSanctuaryMultiplier,
  getSchoolElementDamageMultiplier,
} from "./school.js"
import { nextRandomState } from "./rng.js"
import { createWaveEnemies, setSlotTimer, sumHp } from "./state.js"
import { applyTraitCastInterval, getTraitCodexBonusPerTier } from "./traits.js"
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
  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel))
  const critical = roll.value < critChance
  const relicEffects = getEquippedRelicEffects(state.relics)
  const critFactor = critical ? CRIT_DAMAGE_MULTIPLIER + relicEffects.critDamageBonus : 1
  const damage =
    DMG_BASE *
    DMG_GROWTH ** book.level *
    getSlotMultiplier(slotTier) *
    (1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
    getElementDamageMultiplier(book.element, state.relics) *
    getElementProgressionMultiplier(state, book.element) *
    getTomeMilestoneDamageMultiplier(state.highestLevelEver) *
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
      activeRift:
        current.activeRift?.kind === "golden"
          ? { ...current.activeRift, remainingMs: Math.max(0, current.activeRift.remainingMs - TICK_MS) }
          : current.activeRift,
    }

    if (shouldCastInnateStaff(previousElapsedMs, current.elapsedMs)) {
      const applied = applyInnateStaffDamage(current)
      current = applied.state
      events = [...events, ...applied.events]
      goldEarned += applied.goldEarned
    }

    if (shouldPetAttack(previousElapsedMs, current.elapsedMs)) {
      const applied = applyPetDamage(current)
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
      if (current.activeRift?.kind !== "trial" && bossElapsedMs >= BOSS_ENRAGE_MS) {
        const requiredDps = getBossRequiredDps(current.stage)
        const currentDps = Math.max(0, requiredDps - current.stageHp / (BOSS_ENRAGE_MS / 1_000))
        const enemiesHp = createWaveEnemies(current.stage, 1)
        current = {
          ...current,
          wave: 1,
          enemiesHp,
          stageHp: sumHp(enemiesHp),
          bossElapsedMs: 0,
          frostSlowMs: 0,
        }
        events = [...events, { type: "bossFail", stage: current.stage, requiredDps, currentDps }]
      }
    }

    if (current.activeRift?.kind === "golden" && current.activeRift.remainingMs <= 0) {
      current = {
        ...current,
        ...current.activeRift.snapshot,
        activeRift: null,
      }
      events = [...events, { type: "riftComplete", kind: "golden", reward: goldEarned }]
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

function applyPetDamage(state: EngineState): DamageApplication {
  if (state.enemiesHp.length === 0) {
    return { state, events: [], goldEarned: 0 }
  }

  const damage = getPetDps(state)
  if (damage <= 0) {
    return { state, events: [], goldEarned: 0 }
  }

  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
  const castEvent: EngineEvent = {
    type: "petCast",
    damage,
    targetIndex: 0,
    evolution: state.pet.evolution,
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
  // 연쇄 발화(화염): cap 초과 대상은 스플래시 비율만큼. 절대영도(냉기 일반웨이브): 첫 대상 현재 HP 20% 즉결.
  const splash = book.element === "fire" ? getChainIgnitionSplash(state) : 0
  const executeFrac = book.element === "frost" ? getAbsoluteZeroExecute(state) : 0
  const damaged = state.enemiesHp.map((hp, index) => {
    if (index < targetsHit) {
      const executed = index === 0 && executeFrac > 0 ? hp * executeFrac : 0
      return hp - damage - executed
    }
    return splash > 0 ? hp - damage * splash : hp
  })
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
  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
  const slowEvents: readonly EngineEvent[] =
    book.element === "frost" ? [{ type: "slow", durationMs: frostSlowMs, factor: frostSlow.factor }] : []
  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
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
  // 빙결 축적: 둔화 걸린 적에게 주는 피해 +15% (냉기 학파). 겁화·성역은 원소별 보스 배율.
  const buildup = getFrostBuildupMultiplier(state)
  switch (element) {
    case "fire":
      return damage * buildup * getInfernoMultiplier(state)
    case "frost":
      return damage * buildup
    case "holy":
      return wave === BOSS_WAVE
        ? damage * buildup * getHolyBossMultiplier(state) * getSanctuaryMultiplier(state)
        : damage * buildup
    default:
      return assertNever(element)
  }
}

function getCastIntervalMs(state: EngineState): number {
  const baseInterval = BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * state.skills.castSpeed
  const riftMultiplier = state.activeRift?.kind === "golden" ? GOLDEN_RIFT_MS / (GOLDEN_RIFT_MS * 2) : 1
  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * riftMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel)
  return applyTraitCastInterval(state, Math.max(MIN_CAST_INTERVAL_MS, relicInterval))
}

function getElementProgressionMultiplier(state: EngineState, element: Element): number {
  const codexTiers = state.codex.tiers[element] ?? 0
  return getCodexBonusMultiplier(state, element) * (1 + getTraitCodexBonusPerTier(state) * codexTiers) * getSchoolElementDamageMultiplier(state, element)
}
