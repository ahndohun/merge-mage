import {
  BOSS_WAVE,
  INVENTORY_LIMIT,
  SLOT_INDEXES,
} from "./constants.js"
import {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InventoryFullError,
  PrestigeRequirementError,
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
import { getSlotUpgradeCost } from "./slotUpgrades.js"
import { grantTraitRespecAfterPrestige } from "./traits.js"
import { assertNever, type Element, type EngineState, type SkillName, type Spellbook } from "./types.js"

export {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InventoryFullError,
  PrestigeRequirementError,
  SkillPointError,
  SlotIndexError,
} from "./errors.js"
export { claimQuestReward, selectTrait } from "./progressionActions.js"
export { getSlotMultiplier, getSlotUpgradeCost } from "./slotUpgrades.js"

export function summonBook(state: EngineState): EngineState {
  const emptySlot = SLOT_INDEXES.find((slot) => state.equipped[slot] === null)
  if (emptySlot === undefined && state.books.length >= INVENTORY_LIMIT) { throw new InventoryFullError(INVENTORY_LIMIT) }

  const summonLevel = getSummonLevel(state.highestLevelEver) + state.skills.summonBonus
  const cost = getSummonCost(summonLevel)
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
  const cost = getSlotUpgradeCost(currentTier)

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
  const manaCrystals = Math.floor(state.stage ** 1.5 / 10)
  const enemiesHp = createWaveEnemies(initial.stage, initial.wave)

  return trackProgress(grantTraitRespecAfterPrestige({
    ...initial,
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
    pet: state.pet,
    mine: state.mine,
    dailyMissions: state.dailyMissions,
    skins: state.skins,
  }))
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
