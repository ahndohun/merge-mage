import type { RandomSource } from "./rng"
import type { Element, Spellbook } from "./types"

export class MergeLevelMismatchError extends Error {
  readonly leftLevel: number
  readonly rightLevel: number

  constructor(leftLevel: number, rightLevel: number) {
    super(`Cannot merge level ${leftLevel} with level ${rightLevel}`)
    this.name = "MergeLevelMismatchError"
    this.leftLevel = leftLevel
    this.rightLevel = rightLevel
  }
}

export function mergeSpellbooks(
  left: Spellbook,
  right: Spellbook,
  random: RandomSource,
): Spellbook {
  if (left.level !== right.level) {
    throw new MergeLevelMismatchError(left.level, right.level)
  }

  const element: Element = random() < 0.5 ? left.element : right.element

  return {
    id: `${left.id}+${right.id}`,
    level: left.level + 1,
    element,
  }
}
