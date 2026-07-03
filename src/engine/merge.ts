import type { RandomSource } from "./rng.js"
import type { Element, Spellbook } from "./types.js"

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
  _random: RandomSource,
): Spellbook {
  if (left.level !== right.level) {
    throw new MergeLevelMismatchError(left.level, right.level)
  }

  // The merged book keeps LEFT's element — left is the anchor (the reducer is
  // called as mergeBooks(targetId, sourceId) and the result lands in left's
  // cell/slot). Deterministic merges give the three elements strategic weight:
  // merge onto the element you want to keep. (Was random-of-two — pure luck.)
  const element: Element = left.element

  return {
    id: `${left.id}+${right.id}`,
    level: left.level + 1,
    element,
  }
}
