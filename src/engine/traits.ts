import { GOLD_GAIN_PER_POINT, MIN_CAST_INTERVAL_MS } from "./constants.js"
import type { AscensionRank, EngineState } from "./types.js"

// R5 비전 각인(Arcane Inscriptions). 범용 특성 5종을 컷 없이 보존하되, 언락 기준을
// 마법사 레벨이 아니라 전직 클래스(rank)로 바꿨다. 원소 특성(공명/원소 피해)은 traits에서
// 빠져 학파(school.ts)로 흡수됐다. 슬롯 후보는 겹치지 않게 배분한다.
export const TRAIT_SLOTS = ["arcane1", "arcane2", "arcane3"] as const
export type TraitSlot = (typeof TRAIT_SLOTS)[number]

export const TRAIT_IDS = [
  "chainCast",
  "goldenLibrary",
  "quickHands",
  "treasureOath",
  "archmageFocus",
] as const
export type TraitId = (typeof TRAIT_IDS)[number]

export type TraitDefinition = {
  readonly id: TraitId
  readonly slot: TraitSlot
  /** 이 슬롯을 여는 최소 클래스: 정식(1) 2슬롯, 대마법사(2) 3슬롯. */
  readonly requiredRank: AscensionRank
}

const RESPEC_KEY = "__respecPrestige"

export const TRAITS: readonly TraitDefinition[] = [
  { id: "chainCast", slot: "arcane1", requiredRank: 1 },
  { id: "goldenLibrary", slot: "arcane1", requiredRank: 1 },
  { id: "quickHands", slot: "arcane2", requiredRank: 1 },
  { id: "treasureOath", slot: "arcane2", requiredRank: 1 },
  { id: "archmageFocus", slot: "arcane3", requiredRank: 2 },
] as const

export function getTraitsForSlot(slot: TraitSlot): readonly TraitDefinition[] {
  return TRAITS.filter((trait) => trait.slot === slot)
}

/** rank에서 실제로 열려 있는 비전 각인 슬롯(정식 2 / 대마법사 3 / 견습 0). */
export function getUnlockedTraitSlots(rank: AscensionRank): readonly TraitSlot[] {
  return TRAIT_SLOTS.filter((slot) => getSlotRequiredRank(slot) <= rank && rank >= 1)
}

export function getSlotRequiredRank(slot: TraitSlot): AscensionRank {
  return getTraitsForSlot(slot)[0]?.requiredRank ?? 1
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
  // 실제 열린 슬롯의 픽만 유효. v4→v5로 이관된 픽도 클래스에 도달해야 발동한다(견습=무효).
  const unlocked = getUnlockedTraitSlots(state.ascension.rank)
  return unlocked.some((slot) => state.traits.picks[slot] === traitId)
}

export function canSelectTrait(state: EngineState, slot: TraitSlot, traitId: TraitId): boolean {
  const definition = getTraitDefinition(slot, traitId)
  if (state.ascension.rank < definition.requiredRank) {
    return false
  }

  const existing = state.traits.picks[slot]
  return existing === undefined || existing === traitId || hasRespecCredit(state)
}

export function selectTraitPick(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
  const definition = getTraitDefinition(slot, traitId)
  if (state.ascension.rank < definition.requiredRank) {
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

/**
 * 공명 기본 요구값(3). 원소 요구 하향(3→2)은 이제 학파(school.ts)가 선택 원소에 한정해
 * 적용한다 — resonance.ts가 학파 오버레이를 얹는다.
 */
export function getResonanceRequirement(_state: EngineState): number {
  return 3
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

export function getTraitCodexBonusPerTier(state: EngineState): number {
  return hasTrait(state, "archmageFocus") ? 0.01 : 0
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
