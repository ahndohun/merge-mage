import {
  BOSS_HP_MULTIPLIER,
  BOSS_WAVE,
  HP_BASE,
  HP_GROWTH,
  INITIAL_GOLD,
  INITIAL_HIGHEST_LEVEL,
  INITIAL_STAGE,
  INITIAL_WAVE,
  REGULAR_MOB_COUNT,
} from "./constants"
import { createRandomState } from "./rng"
import { assertNever, type EngineState, type EquippedBooks, type SkillAllocations, type SlotIndex, type SlotTiers, type SlotTimers } from "./types"

export type { EngineState } from "./types"

export function createInitialState(seed: number): EngineState {
  const enemiesHp = createWaveEnemies(INITIAL_STAGE, INITIAL_WAVE)

  return {
    gold: INITIAL_GOLD,
    books: [],
    equipped: emptyEquipment(),
    highestLevelEver: INITIAL_HIGHEST_LEVEL,
    stage: INITIAL_STAGE,
    wave: INITIAL_WAVE,
    stageHp: sumHp(enemiesHp),
    wizardLevel: 1,
    wizardXp: 0,
    skillPoints: 0,
    skills: zeroSkills(),
    manaCrystals: 0,
    prestigeCount: 0,
    lastSeenServerTs: null,
    slotTiers: zeroSlots(),
    castProgressMs: zeroSlots(),
    enemiesHp,
    bossElapsedMs: 0,
    frostSlowMs: 0,
    recentGoldPerSecond: 0,
    elapsedMs: 0,
    rngSeed: seed,
    rngState: createRandomState(seed),
    nextBookId: 1,
  }
}

export function zeroSkills(): SkillAllocations {
  return { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 }
}

export function emptyEquipment(): EquippedBooks {
  return [null, null, null, null, null, null]
}

export function zeroSlots(): SlotTiers {
  return [0, 0, 0, 0, 0, 0]
}

export function zeroTimers(): SlotTimers {
  return [0, 0, 0, 0, 0, 0]
}

export function createWaveEnemies(stage: number, wave: number): readonly number[] {
  const hp = getMobHp(stage)

  if (wave === BOSS_WAVE) {
    return [hp * BOSS_HP_MULTIPLIER]
  }

  return Array.from({ length: REGULAR_MOB_COUNT }, () => hp)
}

export function getMobHp(stage: number): number {
  return HP_BASE * HP_GROWTH ** stage
}

export function sumHp(values: readonly number[]): number {
  return values.reduce((total, value) => total + Math.max(0, value), 0)
}

export function setEquippedSlot(equipped: EquippedBooks, slot: SlotIndex, value: EquippedBooks[SlotIndex]): EquippedBooks {
  switch (slot) {
    case 0:
      return [value, equipped[1], equipped[2], equipped[3], equipped[4], equipped[5]]
    case 1:
      return [equipped[0], value, equipped[2], equipped[3], equipped[4], equipped[5]]
    case 2:
      return [equipped[0], equipped[1], value, equipped[3], equipped[4], equipped[5]]
    case 3:
      return [equipped[0], equipped[1], equipped[2], value, equipped[4], equipped[5]]
    case 4:
      return [equipped[0], equipped[1], equipped[2], equipped[3], value, equipped[5]]
    case 5:
      return [equipped[0], equipped[1], equipped[2], equipped[3], equipped[4], value]
    default:
      return assertNever(slot)
  }
}

export function setSlotTier(slotTiers: SlotTiers, slot: SlotIndex, value: number): SlotTiers {
  switch (slot) {
    case 0:
      return [value, slotTiers[1], slotTiers[2], slotTiers[3], slotTiers[4], slotTiers[5]]
    case 1:
      return [slotTiers[0], value, slotTiers[2], slotTiers[3], slotTiers[4], slotTiers[5]]
    case 2:
      return [slotTiers[0], slotTiers[1], value, slotTiers[3], slotTiers[4], slotTiers[5]]
    case 3:
      return [slotTiers[0], slotTiers[1], slotTiers[2], value, slotTiers[4], slotTiers[5]]
    case 4:
      return [slotTiers[0], slotTiers[1], slotTiers[2], slotTiers[3], value, slotTiers[5]]
    case 5:
      return [slotTiers[0], slotTiers[1], slotTiers[2], slotTiers[3], slotTiers[4], value]
    default:
      return assertNever(slot)
  }
}

export function setSlotTimer(castProgressMs: SlotTimers, slot: SlotIndex, value: number): SlotTimers {
  switch (slot) {
    case 0:
      return [value, castProgressMs[1], castProgressMs[2], castProgressMs[3], castProgressMs[4], castProgressMs[5]]
    case 1:
      return [castProgressMs[0], value, castProgressMs[2], castProgressMs[3], castProgressMs[4], castProgressMs[5]]
    case 2:
      return [castProgressMs[0], castProgressMs[1], value, castProgressMs[3], castProgressMs[4], castProgressMs[5]]
    case 3:
      return [castProgressMs[0], castProgressMs[1], castProgressMs[2], value, castProgressMs[4], castProgressMs[5]]
    case 4:
      return [castProgressMs[0], castProgressMs[1], castProgressMs[2], castProgressMs[3], value, castProgressMs[5]]
    case 5:
      return [castProgressMs[0], castProgressMs[1], castProgressMs[2], castProgressMs[3], castProgressMs[4], value]
    default:
      return assertNever(slot)
  }
}
