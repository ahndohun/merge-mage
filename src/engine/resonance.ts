import { FIRE_TARGET_CAP, FROST_SLOW_FACTOR, FROST_SLOW_MS } from "./constants.js"
import { getResonanceRequirement, getTraitFrostSlowBonus, getTraitHolyBossBonus } from "./traits.js"
import { ELEMENTS, assertNever, type Element, type EngineState } from "./types.js"

export type ElementResonance = {
  readonly active: boolean
  readonly count: number
  readonly mono: boolean
}

export type ResonanceState = {
  readonly requirement: number
  readonly fire: ElementResonance & { readonly targetCap: number }
  readonly frost: ElementResonance & { readonly factor: number; readonly durationMs: number }
  readonly holy: ElementResonance & { readonly bossMultiplier: number }
}

export function getResonance(state: EngineState): ResonanceState {
  const counts = countEquippedElements(state)
  const requirement = getResonanceRequirement(state)
  const monoElement = ELEMENTS.find((element) => counts[element] >= 6) ?? null
  const fireScale = getScale(counts.fire, requirement, monoElement === "fire")
  const frostScale = getScale(counts.frost, requirement, monoElement === "frost")
  const holyScale = getScale(counts.holy, requirement, monoElement === "holy")
  const frostTrait = getTraitFrostSlowBonus(state)
  const holyTrait = getTraitHolyBossBonus(state)

  return {
    requirement,
    fire: {
      ...baseResonance(counts.fire, requirement, monoElement === "fire"),
      targetCap: FIRE_TARGET_CAP + Math.ceil(fireScale),
    },
    frost: {
      ...baseResonance(counts.frost, requirement, monoElement === "frost"),
      factor: FROST_SLOW_FACTOR + 0.15 * frostScale + frostTrait.factor,
      durationMs: FROST_SLOW_MS + 1_000 * frostScale + frostTrait.durationMs,
    },
    holy: {
      ...baseResonance(counts.holy, requirement, monoElement === "holy"),
      bossMultiplier: 2 + 0.5 * holyScale + holyTrait,
    },
  }
}

export function getFireTargetCap(state: EngineState): number {
  return getResonance(state).fire.targetCap
}

export function getFrostSlow(state: EngineState): { readonly factor: number; readonly durationMs: number } {
  const frost = getResonance(state).frost
  return { factor: frost.factor, durationMs: frost.durationMs }
}

export function getHolyBossMultiplier(state: EngineState): number {
  return getResonance(state).holy.bossMultiplier
}

function countEquippedElements(state: EngineState): Record<Element, number> {
  return state.equipped.reduce(
    (counts, book) => {
      if (book === null) {
        return counts
      }
      switch (book.element) {
        case "fire":
          return { ...counts, fire: counts.fire + 1 }
        case "frost":
          return { ...counts, frost: counts.frost + 1 }
        case "holy":
          return { ...counts, holy: counts.holy + 1 }
        default:
          return assertNever(book.element)
      }
    },
    { fire: 0, frost: 0, holy: 0 },
  )
}

function baseResonance(count: number, requirement: number, mono: boolean): ElementResonance {
  return {
    active: count >= requirement,
    count,
    mono,
  }
}

function getScale(count: number, requirement: number, mono: boolean): number {
  if (count < requirement) {
    return 0
  }
  return mono ? 1.5 : 1
}
