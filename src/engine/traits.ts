import { GOLD_GAIN_PER_POINT, MIN_CAST_INTERVAL_MS } from "./constants.js"
import { assertNever, type EngineState } from "./types.js"

export const TRAIT_SLOTS = ["lv8", "lv16", "lv24"] as const
export type TraitSlot = (typeof TRAIT_SLOTS)[number]

export const TRAIT_IDS = [
  "chainCast",
  "goldenLibrary",
  "elementalCycle",
  "pyroGlyphs",
  "deepFreeze",
  "sanctifiedAim",
  "archmageFocus",
  "quickHands",
  "treasureOath",
] as const
export type TraitId = (typeof TRAIT_IDS)[number]

export type TraitDefinition = {
  readonly id: TraitId
  readonly slot: TraitSlot
  readonly requiredLevel: number
}

const RESPEC_KEY = "__respecPrestige"

export const TRAITS: readonly TraitDefinition[] = [
  { id: "chainCast", slot: "lv8", requiredLevel: 8 },
  { id: "goldenLibrary", slot: "lv8", requiredLevel: 8 },
  { id: "elementalCycle", slot: "lv8", requiredLevel: 8 },
  { id: "pyroGlyphs", slot: "lv16", requiredLevel: 16 },
  { id: "deepFreeze", slot: "lv16", requiredLevel: 16 },
  { id: "sanctifiedAim", slot: "lv16", requiredLevel: 16 },
  { id: "archmageFocus", slot: "lv24", requiredLevel: 24 },
  { id: "quickHands", slot: "lv24", requiredLevel: 24 },
  { id: "treasureOath", slot: "lv24", requiredLevel: 24 },
] as const

export function getTraitsForSlot(slot: TraitSlot): readonly TraitDefinition[] {
  return TRAITS.filter((trait) => trait.slot === slot)
}

export function isTraitId(value: string): value is TraitId {
  return TRAIT_IDS.some((traitId) => traitId === value)
}

export function getTraitDefinition(slot: TraitSlot, traitId: TraitId): TraitDefinition {
  const definition = TRAITS.find((trait) => trait.slot === slot && trait.id === traitId)
  if (definition === undefined) {
    throw new TraitSelectionError(slot, traitId, "wrong_slot")
  }
  return definition
}

export function hasTrait(state: EngineState, traitId: TraitId): boolean {
  return Object.values(state.traits.picks).some((value) => value === traitId)
}

export function canSelectTrait(state: EngineState, slot: TraitSlot, traitId: TraitId): boolean {
  const definition = getTraitDefinition(slot, traitId)
  if (state.wizardLevel < definition.requiredLevel) {
    return false
  }

  const existing = state.traits.picks[slot]
  return existing === undefined || existing === traitId || hasRespecCredit(state)
}

export function selectTraitPick(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
  const definition = getTraitDefinition(slot, traitId)
  if (state.wizardLevel < definition.requiredLevel) {
    throw new TraitSelectionError(slot, traitId, "locked")
  }

  const existing = state.traits.picks[slot]
  if (existing !== undefined && existing !== traitId && !hasRespecCredit(state)) {
    throw new TraitSelectionError(slot, traitId, "respec_unavailable")
  }

  const picks =
    existing !== undefined && existing !== traitId
      ? { ...state.traits.picks, [slot]: traitId, [RESPEC_KEY]: "0" }
      : { ...state.traits.picks, [slot]: traitId }

  return { ...state, traits: { picks } }
}

export function grantTraitRespecAfterPrestige(state: EngineState): EngineState {
  if (Object.values(state.traits.picks).filter(isTraitId).length === 0) {
    return state
  }
  return { ...state, traits: { picks: { ...state.traits.picks, [RESPEC_KEY]: String(state.prestigeCount) } } }
}

export function getResonanceRequirement(state: EngineState): number {
  return hasTrait(state, "elementalCycle") ? 2 : 3
}

export function getTraitCastIntervalMultiplier(state: EngineState): number {
  let multiplier = 1
  if (hasTrait(state, "chainCast")) {
    multiplier *= 0.8
  }
  if (hasTrait(state, "quickHands")) {
    multiplier *= 0.9
  }
  return multiplier
}

export function applyTraitCastInterval(state: EngineState, intervalMs: number): number {
  return Math.max(MIN_CAST_INTERVAL_MS, intervalMs * getTraitCastIntervalMultiplier(state))
}

export function getTraitGoldMultiplier(state: EngineState): number {
  let multiplier = 1
  if (hasTrait(state, "goldenLibrary")) {
    multiplier += 0.15
  }
  if (hasTrait(state, "treasureOath")) {
    multiplier += 0.25
  }
  return multiplier
}

export function getTraitSkillGoldPoints(state: EngineState): number {
  return state.skills.goldGain + (getTraitGoldMultiplier(state) - 1) / GOLD_GAIN_PER_POINT
}

export function getTraitElementDamageMultiplier(state: EngineState, element: "fire" | "frost" | "holy"): number {
  switch (element) {
    case "fire":
      return hasTrait(state, "pyroGlyphs") ? 1.2 : 1
    case "frost":
      return 1
    case "holy":
      return 1
    default:
      return assertNever(element)
  }
}

export function getTraitCodexBonusPerTier(state: EngineState): number {
  return hasTrait(state, "archmageFocus") ? 0.01 : 0
}

export function getTraitFrostSlowBonus(state: EngineState): { readonly factor: number; readonly durationMs: number } {
  return hasTrait(state, "deepFreeze") ? { factor: 0.1, durationMs: 500 } : { factor: 0, durationMs: 0 }
}

export function getTraitHolyBossBonus(state: EngineState): number {
  return hasTrait(state, "sanctifiedAim") ? 0.25 : 0
}

function hasRespecCredit(state: EngineState): boolean {
  return state.prestigeCount > 0 && state.traits.picks[RESPEC_KEY] === String(state.prestigeCount)
}

export class TraitSelectionError extends Error {
  readonly name = "TraitSelectionError"

  constructor(
    readonly slot: TraitSlot,
    readonly traitId: TraitId,
    readonly reason: "locked" | "respec_unavailable" | "wrong_slot",
  ) {
    super(`Trait ${traitId} cannot be selected in ${slot}: ${reason}`)
  }
}
