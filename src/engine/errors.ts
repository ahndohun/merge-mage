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
