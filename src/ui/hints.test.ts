import { describe, expect, it } from "vitest"
import type { EngineState, Spellbook } from "../engine/types"
import { createInitialState } from "../engine/state"
import { getContextHint } from "./hints"

function book(id: string, level: number, element: Spellbook["element"]): Spellbook {
  return { id, level, element }
}

describe("getContextHint", () => {
  it("asks a player with no books and enough gold to summon first", () => {
    const state = createInitialState(1)

    expect(getContextHint({ state, summonCost: 20 })).toBe("Tap SUMMON to arm your first spellbook")
  })

  it("prioritizes same-level merging across inventory and equipped books", () => {
    const state = {
      ...createInitialState(1),
      books: [book("inventory", 2, "fire")],
      equipped: [book("equipped", 2, "holy"), null, null, null, null, null],
    } satisfies EngineState

    expect(getContextHint({ state, summonCost: 20 })).toBe("Merge two same-level books: tap one, then the other")
  })

  it("points inventory books toward empty equipment slots before boss or rebirth hints", () => {
    const state = {
      ...createInitialState(1),
      books: [book("inventory", 3, "frost")],
      stage: 10,
      wave: 10,
    } satisfies EngineState

    expect(getContextHint({ state, summonCost: 20 })).toBe("Tap a book, then an empty slot to equip")
  })

  it("shows boss and rebirth hints after higher-priority inventory guidance is absent", () => {
    const boss = {
      ...createInitialState(1),
      wave: 10,
      equipped: [book("equipped", 3, "holy"), null, null, null, null, null],
    } satisfies EngineState
    const rebirth = {
      ...createInitialState(1),
      stage: 10,
      equipped: [book("equipped", 3, "holy"), null, null, null, null, null],
    } satisfies EngineState

    expect(getContextHint({ state: boss, summonCost: 20 })).toBe("Boss! Holy books deal double damage")
    expect(getContextHint({ state: rebirth, summonCost: 20 })).toBe("REBIRTH is unlocked — permanent power")
  })

  it("hides when no hint rule matches", () => {
    const state = {
      ...createInitialState(1),
      equipped: [book("equipped", 3, "fire"), null, null, null, null, null],
    } satisfies EngineState

    expect(getContextHint({ state, summonCost: 20 })).toBeNull()
  })
})
