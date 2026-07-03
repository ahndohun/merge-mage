import {
  BOSS_WAVE,
  GOLDEN_RIFT_MS,
  INVENTORY_LIMIT,
  RELIC_LEVEL_CAP,
  RELIC_SUMMON_COST,
  RIFT_DAILY_LIMIT,
  SLOT_INDEXES,
  SLOT_MULTIPLIER_PER_TIER,
  SLOT_UPGRADE_COST_BASE,
  SLOT_UPGRADE_COST_GROWTH,
  TRIAL_RIFT_BOSS_MULTIPLIERS,
} from "./constants.js"
import {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InsufficientManaCrystalsError,
  InventoryFullError,
  PrestigeRequirementError,
  RelicLevelCapError,
  RelicNotOwnedError,
  RelicSlotIndexError,
  RiftEntryError,
  SkillPointError,
  SlotIndexError,
} from "./errors.js"
import {
  findBookLocation,
  findHighestLevelMergePair,
  refillEmptySlotsFromInventory,
  refillSlotsFromInventory,
  swapBookLocations,
  toSlotIndex,
} from "./bookSlots.js"
import { mergeSpellbooks } from "./merge.js"
import { trackProgress } from "./progression.js"
import { nextRandomState } from "./rng.js"
import { getEquippedRelicEffects, getUncappedRelicIds, isRelicId, RELIC_IDS, type RelicId } from "./relics.js"
import { getSummonCost, getSummonLevel } from "./summon.js"
import {
  createInitialState,
  createWaveEnemies,
  emptyEquipment,
  setEquippedSlot,
  setSlotTier,
  sumHp,
  zeroTimers,
} from "./state.js"
import { assertNever, type BattleSnapshot, type Element, type EngineState, type RelicEquipment, type RiftKind, type SkillName, type Spellbook } from "./types.js"
import { grantTraitRespecAfterPrestige } from "./traits.js"

export {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InsufficientManaCrystalsError,
  InventoryFullError,
  PrestigeRequirementError,
  RelicLevelCapError,
  RelicNotOwnedError,
  RelicSlotIndexError,
  RiftEntryError,
  SkillPointError,
  SlotIndexError,
} from "./errors.js"
export { claimQuestReward, selectTrait } from "./progressionActions.js"

export function summonBook(state: EngineState): EngineState {
  const emptySlot = SLOT_INDEXES.find((slot) => state.equipped[slot] === null)
  if (emptySlot === undefined && state.books.length >= INVENTORY_LIMIT) { throw new InventoryFullError(INVENTORY_LIMIT) }

  const summonLevel = getSummonLevel(state.highestLevelEver) + state.skills.summonBonus
  const cost = getSummonCost(summonLevel, getEquippedRelicEffects(state.relics).summonCostMultiplier)
  if (state.gold < cost) {
    throw new InsufficientGoldError(cost, state.gold)
  }

  const roll = nextRandomState(state.rngState)
  const spellbook: Spellbook = {
    id: `book-${state.nextBookId}`,
    level: summonLevel,
    element: pickElement(roll.value),
  }

  return trackProgress({
    ...state,
    gold: state.gold - cost,
    books: emptySlot === undefined ? [...state.books, spellbook] : state.books,
    equipped: emptySlot === undefined ? state.equipped : setEquippedSlot(state.equipped, emptySlot, spellbook),
    highestLevelEver: Math.max(state.highestLevelEver, spellbook.level),
    rngState: roll.state,
    nextBookId: state.nextBookId + 1,
  }, [{ counter: "summonsTotal", amount: 1 }], spellbook)
}

export function mergeBooks(state: EngineState, idA: string, idB: string): EngineState {
  if (idA === idB) {
    throw new BookNotFoundError(idB)
  }

  const left = findBookLocation(state, idA)
  const right = findBookLocation(state, idB)
  const roll = nextRandomState(state.rngState)
  const mergedBase = mergeSpellbooks(left.book, right.book, () => roll.value)
  const merged: Spellbook = { ...mergedBase, id: `book-${state.nextBookId}` }
  const books = state.books.flatMap((item) => {
    if (item.id === idA) {
      return [merged]
    }
    if (item.id === idB) {
      return []
    }
    return [item]
  })

  const equipped = SLOT_INDEXES.reduce((next, slot) => {
    const equippedBook = state.equipped[slot]
    if (equippedBook?.id === idA) {
      return setEquippedSlot(next, slot, merged)
    }
    if (equippedBook?.id === idB) {
      return setEquippedSlot(next, slot, null)
    }
    return next
  }, state.equipped)

  const next = {
    ...state,
    books,
    equipped,
    highestLevelEver: Math.max(state.highestLevelEver, merged.level),
    rngState: roll.state,
    nextBookId: state.nextBookId + 1,
  }

  const refilled = right.kind === "equipped" ? refillSlotsFromInventory(next, [right.slot]) : next
  return trackProgress(refilled, [{ counter: "mergesTotal", amount: 1 }], merged)
}

export function equipBook(state: EngineState, bookId: string, slotIdx: number): EngineState {
  const targetSlot = toSlotIndex(slotIdx)
  const source = findBookLocation(state, bookId)

  if (source.kind === "equipped" && source.slot === targetSlot) {
    return state
  }

  const targetBook = state.equipped[targetSlot]
  const booksWithoutSource = state.books.filter((item) => item.id !== bookId)

  switch (source.kind) {
    case "inventory":
      return trackProgress({
        ...state,
        books: targetBook === null ? booksWithoutSource : [...booksWithoutSource, targetBook],
        equipped: setEquippedSlot(state.equipped, targetSlot, source.book),
      })
    case "equipped":
      return trackProgress({
        ...state,
        equipped: setEquippedSlot(setEquippedSlot(state.equipped, targetSlot, source.book), source.slot, targetBook),
      })
    default:
      return assertNever(source)
  }
}

export function unequipBook(state: EngineState, slotIdx: number): EngineState {
  const slot = toSlotIndex(slotIdx)
  const equipped = state.equipped[slot]

  if (equipped === null) {
    throw new EmptySlotError(slot)
  }

  return refillSlotsFromInventory({
    ...state,
    books: [...state.books, equipped],
    equipped: setEquippedSlot(state.equipped, slot, null),
  }, [slot])
}

export function swapBookPositions(state: EngineState, idA: string, idB: string): EngineState {
  if (idA === idB) {
    throw new BookNotFoundError(idB)
  }

  return swapBookLocations(state, idA, idB)
}

export function refillEmptySlots(state: EngineState): EngineState {
  return refillEmptySlotsFromInventory(state)
}

export function autoMergeBooks(state: EngineState): EngineState {
  let current = state
  let pair = findHighestLevelMergePair(current)

  while (pair !== null) {
    current = mergeBooks(current, pair.targetId, pair.consumedId)
    pair = findHighestLevelMergePair(current)
  }

  return current
}

export function upgradeSlot(state: EngineState, slotIdx: number): EngineState {
  const slot = toSlotIndex(slotIdx)
  const currentTier = state.slotTiers[slot]
  const cost = getSlotUpgradeCost(currentTier, getEquippedRelicEffects(state.relics).slotUpgradeCostMultiplier)

  if (state.gold < cost) {
    throw new InsufficientGoldError(cost, state.gold)
  }

  return trackProgress({
    ...state,
    gold: state.gold - cost,
    slotTiers: setSlotTier(state.slotTiers, slot, currentTier + 1),
  })
}

export function allocateSkill(state: EngineState, skill: SkillName): EngineState {
  if (state.skillPoints < 1) {
    throw new SkillPointError()
  }

  switch (skill) {
    case "summonBonus":
      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, summonBonus: state.skills.summonBonus + 1 } })
    case "castSpeed":
      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, castSpeed: state.skills.castSpeed + 1 } })
    case "goldGain":
      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, goldGain: state.skills.goldGain + 1 } })
    case "critChance":
      return trackProgress({ ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, critChance: state.skills.critChance + 1 } })
    default:
      return assertNever(skill)
  }
}

export function resetSkills(state: EngineState): EngineState {
  const allocated = state.skills.summonBonus + state.skills.castSpeed + state.skills.goldGain + state.skills.critChance

  return trackProgress({
    ...state,
    skillPoints: state.skillPoints + allocated,
    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
  })
}

export function prestige(state: EngineState): EngineState {
  if (state.stage < BOSS_WAVE) {
    throw new PrestigeRequirementError(state.stage)
  }

  const initial = createInitialState(state.rngSeed)
  const manaCrystals = Math.floor((state.stage ** 1.5 / 10) * getEquippedRelicEffects(state.relics).crystalGainMultiplier)
  const enemiesHp = createWaveEnemies(initial.stage, initial.wave)

  return trackProgress(grantTraitRespecAfterPrestige({
    ...initial,
    gold: initial.gold + getEquippedRelicEffects(state.relics).startingGoldBonus,
    skills: state.skills,
    wizardLevel: state.wizardLevel,
    wizardXp: state.wizardXp,
    skillPoints: state.skillPoints,
    manaCrystals: state.manaCrystals + manaCrystals,
    prestigeCount: state.prestigeCount + 1,
    rngState: state.rngState,
    nextBookId: initial.nextBookId,
    equipped: emptyEquipment(),
    castProgressMs: zeroTimers(),
    enemiesHp,
    stageHp: sumHp(enemiesHp),
    lastSeenServerTs: state.lastSeenServerTs,
    quests: state.quests,
    achievements: state.achievements,
    codex: state.codex,
    traits: state.traits,
    relics: state.relics,
    riftRuns: state.riftRuns,
    activeRift: null,
    pet: state.pet,
    mine: state.mine,
    dailyMissions: state.dailyMissions,
    skins: state.skins,
  }))
}

export function summonRelic(state: EngineState): EngineState {
  if (state.manaCrystals < RELIC_SUMMON_COST) {
    throw new InsufficientManaCrystalsError(RELIC_SUMMON_COST, state.manaCrystals)
  }

  const uncapped = getUncappedRelicIds(state.relics)
  if (uncapped.length === 0) {
    throw new RelicLevelCapError("all")
  }

  const roll = nextRandomState(state.rngState)
  const rolledIndex = Math.floor(roll.value * RELIC_IDS.length)
  const rolledId = RELIC_IDS[rolledIndex] ?? "emberSigil"
  const relicId = state.relics.owned[rolledId] === RELIC_LEVEL_CAP ? getFirstRelicId(uncapped) : rolledId
  const currentLevel = state.relics.owned[relicId] ?? 0

  if (currentLevel >= RELIC_LEVEL_CAP) {
    throw new RelicLevelCapError(relicId)
  }

  return {
    ...state,
    manaCrystals: state.manaCrystals - RELIC_SUMMON_COST,
    rngState: roll.state,
    relics: {
      ...state.relics,
      owned: { ...state.relics.owned, [relicId]: currentLevel + 1 },
    },
  }
}

export function equipRelic(state: EngineState, relicId: string | null, slotIdx: number): EngineState {
  const slot = toRelicSlot(slotIdx)
  if (relicId !== null && (!isRelicId(relicId) || (state.relics.owned[relicId] ?? 0) < 1)) {
    throw new RelicNotOwnedError(relicId)
  }

  const cleared = state.relics.equipped.map((equippedId) => (equippedId === relicId ? null : equippedId))
  return {
    ...state,
    relics: {
      ...state.relics,
      equipped: setRelicSlot(toRelicEquipment(cleared), slot, relicId),
    },
  }
}

export function enterRift(state: EngineState, kind: RiftKind, date: string): EngineState {
  if (state.activeRift !== null) {
    throw new RiftEntryError("active-rift")
  }

  const riftRuns = state.riftRuns.date === date ? state.riftRuns : { date, golden: 0, trial: 0 }
  const used = kind === "golden" ? riftRuns.golden : riftRuns.trial
  if (used >= RIFT_DAILY_LIMIT) {
    throw new RiftEntryError("daily-limit")
  }

  const snapshot = takeBattleSnapshot(state)
  const nextRuns = kind === "golden"
    ? { ...riftRuns, golden: riftRuns.golden + 1 }
    : { ...riftRuns, trial: riftRuns.trial + 1 }
  const enemiesHp = kind === "golden" ? createWaveEnemies(state.stage, 1) : createTrialEnemies(state.stage, 0)

  return {
    ...state,
    riftRuns: nextRuns,
    activeRift:
      kind === "golden"
        ? { kind, remainingMs: GOLDEN_RIFT_MS, startedStage: state.stage, snapshot }
        : { kind, step: 0, startedStage: state.stage, snapshot },
    wave: kind === "golden" ? 1 : BOSS_WAVE,
    enemiesHp,
    stageHp: sumHp(enemiesHp),
    bossElapsedMs: 0,
    frostSlowMs: 0,
  }
}

export function exitRift(state: EngineState): EngineState {
  if (state.activeRift === null) {
    return state
  }
  return restoreBattleSnapshot(state)
}

export function getSlotUpgradeCost(currentTier: number, costMultiplier = 1): number {
  return Math.ceil(SLOT_UPGRADE_COST_BASE * SLOT_UPGRADE_COST_GROWTH ** currentTier * costMultiplier)
}

export function getSlotMultiplier(currentTier: number): number {
  return 1 + SLOT_MULTIPLIER_PER_TIER * currentTier
}

function pickElement(value: number): Element {
  if (value < 1 / 3) {
    return "fire"
  }
  if (value < 2 / 3) {
    return "frost"
  }
  return "holy"
}

function toRelicSlot(slotIdx: number): 0 | 1 | 2 {
  switch (slotIdx) {
    case 0:
    case 1:
    case 2:
      return slotIdx
    default:
      throw new RelicSlotIndexError(slotIdx)
  }
}

function setRelicSlot(equipped: RelicEquipment, slot: 0 | 1 | 2, relicId: string | null): RelicEquipment {
  switch (slot) {
    case 0:
      return [relicId, equipped[1], equipped[2]]
    case 1:
      return [equipped[0], relicId, equipped[2]]
    case 2:
      return [equipped[0], equipped[1], relicId]
    default:
      return assertNever(slot)
  }
}

function toRelicEquipment(values: readonly (string | null)[]): RelicEquipment {
  return [
    values[0] ?? null,
    values[1] ?? null,
    values[2] ?? null,
  ]
}

function takeBattleSnapshot(state: EngineState): BattleSnapshot {
  return {
    stage: state.stage,
    wave: state.wave,
    stageHp: state.stageHp,
    enemiesHp: state.enemiesHp,
    bossElapsedMs: state.bossElapsedMs,
    frostSlowMs: state.frostSlowMs,
  }
}

function restoreBattleSnapshot(state: EngineState): EngineState {
  const activeRift = state.activeRift
  if (activeRift === null) {
    return state
  }
  return {
    ...state,
    ...activeRift.snapshot,
    activeRift: null,
  }
}

function createTrialEnemies(stage: number, step: number): readonly number[] {
  const multiplier = TRIAL_RIFT_BOSS_MULTIPLIERS[step] ?? 2.2
  const hp = createWaveEnemies(stage, BOSS_WAVE)[0] ?? 1
  return [hp * multiplier]
}

function getFirstRelicId(ids: readonly RelicId[]): RelicId {
  return ids[0] ?? "emberSigil"
}
