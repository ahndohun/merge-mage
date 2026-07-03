import type { SlotIndex } from "./types.js"

export class InventoryFullError extends Error {
  readonly name = "InventoryFullError"

  constructor(readonly limit: number) {
    super(`Inventory is full at ${limit} spellbooks`)
  }
}

export class InsufficientGoldError extends Error {
  readonly name = "InsufficientGoldError"

  constructor(
    readonly required: number,
    readonly available: number,
  ) {
    super(`Required ${required} gold, available ${available}`)
  }
}

export class BookNotFoundError extends Error {
  readonly name = "BookNotFoundError"

  constructor(readonly bookId: string) {
    super(`Spellbook ${bookId} was not found`)
  }
}

export class SlotIndexError extends Error {
  readonly name = "SlotIndexError"

  constructor(readonly slotIdx: number) {
    super(`Invalid slot index ${slotIdx}`)
  }
}

export class EmptySlotError extends Error {
  readonly name = "EmptySlotError"

  constructor(readonly slotIdx: SlotIndex) {
    super(`Slot ${slotIdx} is empty`)
  }
}

export class SkillPointError extends Error {
  readonly name = "SkillPointError"

  constructor() {
    super("No skill points available")
  }
}

export class PrestigeRequirementError extends Error {
  readonly name = "PrestigeRequirementError"

  constructor(readonly stage: number) {
    super(`Prestige requires stage 10 or higher; current stage is ${stage}`)
  }
}

export class InsufficientManaCrystalsError extends Error {
  readonly name = "InsufficientManaCrystalsError"

  constructor(
    readonly required: number,
    readonly available: number,
  ) {
    super(`Required ${required} mana crystals, available ${available}`)
  }
}

export class RelicLevelCapError extends Error {
  readonly name = "RelicLevelCapError"

  constructor(readonly relicId: string) {
    super(`Relic ${relicId} is already at the level cap`)
  }
}

export class RelicNotOwnedError extends Error {
  readonly name = "RelicNotOwnedError"

  constructor(readonly relicId: string) {
    super(`Relic ${relicId} is not owned`)
  }
}

export class RelicSlotIndexError extends Error {
  readonly name = "RelicSlotIndexError"

  constructor(readonly slotIdx: number) {
    super(`Invalid relic slot index ${slotIdx}`)
  }
}

export class RiftEntryError extends Error {
  readonly name = "RiftEntryError"

  constructor(readonly reason: "daily-limit" | "active-rift") {
    super(`Cannot enter rift: ${reason}`)
  }
}
