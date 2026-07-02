import {
  BOSS_WAVE,
  INVENTORY_LIMIT,
  SLOT_INDEXES,
  SLOT_MULTIPLIER_PER_TIER,
  SLOT_UPGRADE_COST_BASE,
  SLOT_UPGRADE_COST_GROWTH,
} from "./constants"
import {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InventoryFullError,
  PrestigeRequirementError,
  SkillPointError,
  SlotIndexError,
} from "./errors"
import { mergeSpellbooks } from "./merge"
import { nextRandomState } from "./rng"
import { getSummonCost, getSummonLevel } from "./summon"
import {
  createInitialState,
  createWaveEnemies,
  emptyEquipment,
  setEquippedSlot,
  setSlotTier,
  sumHp,
  zeroTimers,
} from "./state"
import { assertNever, type Element, type EngineState, type SkillName, type SlotIndex, type Spellbook } from "./types"

export {
  BookNotFoundError,
  EmptySlotError,
  InsufficientGoldError,
  InventoryFullError,
  PrestigeRequirementError,
  SkillPointError,
  SlotIndexError,
} from "./errors"

type BookLocation =
  | { readonly kind: "inventory"; readonly index: number; readonly book: Spellbook }
  | { readonly kind: "equipped"; readonly slot: SlotIndex; readonly book: Spellbook }

export function summonBook(state: EngineState): EngineState {
  if (state.books.length >= INVENTORY_LIMIT) {
    throw new InventoryFullError(INVENTORY_LIMIT)
  }

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

  return {
    ...state,
    gold: state.gold - cost,
    books: [...state.books, spellbook],
    highestLevelEver: Math.max(state.highestLevelEver, spellbook.level),
    rngState: roll.state,
    nextBookId: state.nextBookId + 1,
  }
}

export function mergeBooks(state: EngineState, idA: string, idB: string): EngineState {
  if (idA === idB) {
    throw new BookNotFoundError(idB)
  }

  const left = findBook(state, idA)
  const right = findBook(state, idB)
  const roll = nextRandomState(state.rngState)
  const merged = mergeSpellbooks(left.book, right.book, () => roll.value)
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

  return {
    ...state,
    books,
    equipped,
    highestLevelEver: Math.max(state.highestLevelEver, merged.level),
    rngState: roll.state,
  }
}

export function equipBook(state: EngineState, bookId: string, slotIdx: number): EngineState {
  const targetSlot = toSlotIndex(slotIdx)
  const source = findBook(state, bookId)

  if (source.kind === "equipped" && source.slot === targetSlot) {
    return state
  }

  const targetBook = state.equipped[targetSlot]
  const booksWithoutSource = state.books.filter((item) => item.id !== bookId)

  switch (source.kind) {
    case "inventory":
      return {
        ...state,
        books: targetBook === null ? booksWithoutSource : [...booksWithoutSource, targetBook],
        equipped: setEquippedSlot(state.equipped, targetSlot, source.book),
      }
    case "equipped":
      return {
        ...state,
        equipped: setEquippedSlot(setEquippedSlot(state.equipped, targetSlot, source.book), source.slot, targetBook),
      }
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
  if (state.books.length >= INVENTORY_LIMIT) {
    throw new InventoryFullError(INVENTORY_LIMIT)
  }

  return {
    ...state,
    books: [...state.books, equipped],
    equipped: setEquippedSlot(state.equipped, slot, null),
  }
}

export function upgradeSlot(state: EngineState, slotIdx: number): EngineState {
  const slot = toSlotIndex(slotIdx)
  const currentTier = state.slotTiers[slot]
  const cost = getSlotUpgradeCost(currentTier)

  if (state.gold < cost) {
    throw new InsufficientGoldError(cost, state.gold)
  }

  return {
    ...state,
    gold: state.gold - cost,
    slotTiers: setSlotTier(state.slotTiers, slot, currentTier + 1),
  }
}

export function allocateSkill(state: EngineState, skill: SkillName): EngineState {
  if (state.skillPoints < 1) {
    throw new SkillPointError()
  }

  switch (skill) {
    case "summonBonus":
      return { ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, summonBonus: state.skills.summonBonus + 1 } }
    case "castSpeed":
      return { ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, castSpeed: state.skills.castSpeed + 1 } }
    case "goldGain":
      return { ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, goldGain: state.skills.goldGain + 1 } }
    case "critChance":
      return { ...state, skillPoints: state.skillPoints - 1, skills: { ...state.skills, critChance: state.skills.critChance + 1 } }
    default:
      return assertNever(skill)
  }
}

export function resetSkills(state: EngineState): EngineState {
  const allocated = state.skills.summonBonus + state.skills.castSpeed + state.skills.goldGain + state.skills.critChance

  return {
    ...state,
    skillPoints: state.skillPoints + allocated,
    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
  }
}

export function prestige(state: EngineState): EngineState {
  if (state.stage < BOSS_WAVE) {
    throw new PrestigeRequirementError(state.stage)
  }

  const initial = createInitialState(state.rngSeed)
  const manaCrystals = Math.floor(state.stage ** 1.5 / 10)
  const enemiesHp = createWaveEnemies(initial.stage, initial.wave)

  return {
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
  }
}

export function getSlotUpgradeCost(currentTier: number): number {
  return SLOT_UPGRADE_COST_BASE * SLOT_UPGRADE_COST_GROWTH ** currentTier
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

function findBook(state: EngineState, bookId: string): BookLocation {
  const inventoryIndex = state.books.findIndex((item) => item.id === bookId)
  const inventoryBook = state.books.find((item) => item.id === bookId)
  if (inventoryBook !== undefined) {
    return { kind: "inventory", index: inventoryIndex, book: inventoryBook }
  }

  for (const slot of SLOT_INDEXES) {
    const equipped = state.equipped[slot]
    if (equipped?.id === bookId) {
      return { kind: "equipped", slot, book: equipped }
    }
  }

  throw new BookNotFoundError(bookId)
}

function toSlotIndex(slotIdx: number): SlotIndex {
  switch (slotIdx) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 4
    case 5:
      return 5
    default:
      throw new SlotIndexError(slotIdx)
  }
}
