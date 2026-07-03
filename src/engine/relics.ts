import { RELIC_LEVEL_CAP } from "./constants.js"
import type { Element, RelicState } from "./types.js"

export const RELIC_IDS = [
  "emberSigil",
  "frostLens",
  "goldenBookmark",
  "quickeningHourglass",
  "abyssalEye",
  "summonersSeal",
  "sageInk",
  "kingMint",
  "moonlitLedger",
  "craftsmanChisel",
  "crystalVial",
  "apprenticePurse",
] as const

export type RelicId = (typeof RELIC_IDS)[number]

export type RelicDefinition = {
  readonly id: RelicId
  readonly nameEn: string
  readonly nameKo: string
  readonly shortEn: string
  readonly shortKo: string
}

export type RelicEffects = {
  readonly fireDamageMultiplier: number
  readonly frostSlowBonusMs: number
  readonly goldMultiplier: number
  readonly castIntervalMultiplier: number
  readonly critDamageBonus: number
  readonly summonCostMultiplier: number
  readonly xpMultiplier: number
  readonly bossGoldMultiplier: number
  readonly offlineEfficiencyBonus: number
  readonly slotUpgradeCostMultiplier: number
  readonly crystalGainMultiplier: number
  readonly startingGoldBonus: number
}

export const RELICS: readonly RelicDefinition[] = [
  {
    id: "emberSigil",
    nameEn: "Ember Sigil",
    nameKo: "잿불 문장",
    shortEn: "Fire damage +8% / Lv",
    shortKo: "화염 피해 +8% / Lv",
  },
  {
    id: "frostLens",
    nameEn: "Frost Lens",
    nameKo: "서리 렌즈",
    shortEn: "Frost slow +0.2s / Lv",
    shortKo: "빙결 시간 +0.2초 / Lv",
  },
  {
    id: "goldenBookmark",
    nameEn: "Golden Bookmark",
    nameKo: "황금 책갈피",
    shortEn: "Gold +6% / Lv",
    shortKo: "골드 +6% / Lv",
  },
  {
    id: "quickeningHourglass",
    nameEn: "Quickening Hourglass",
    nameKo: "가속 모래시계",
    shortEn: "Cast interval -3% / Lv",
    shortKo: "시전 간격 -3% / Lv",
  },
  {
    id: "abyssalEye",
    nameEn: "Abyssal Eye",
    nameKo: "심연의 눈",
    shortEn: "Critical damage +10%p / Lv",
    shortKo: "치명 피해 +10%p / Lv",
  },
  {
    id: "summonersSeal",
    nameEn: "Summoner's Seal",
    nameKo: "소환사의 인장",
    shortEn: "Summon cost -2% / Lv",
    shortKo: "소환비 -2% / Lv",
  },
  {
    id: "sageInk",
    nameEn: "Sage Ink",
    nameKo: "현자의 잉크",
    shortEn: "XP +4% / Lv",
    shortKo: "경험치 +4% / Lv",
  },
  {
    id: "kingMint",
    nameEn: "King's Mint",
    nameKo: "왕의 금화틀",
    shortEn: "Boss gold +8% / Lv",
    shortKo: "보스 골드 +8% / Lv",
  },
  {
    id: "moonlitLedger",
    nameEn: "Moonlit Ledger",
    nameKo: "월광 장부",
    shortEn: "Offline efficiency +3%p / Lv",
    shortKo: "오프라인 효율 +3%p / Lv",
  },
  {
    id: "craftsmanChisel",
    nameEn: "Craftsman's Chisel",
    nameKo: "장인의 끌",
    shortEn: "Slot upgrade cost -2.5% / Lv",
    shortKo: "슬롯 강화비 -2.5% / Lv",
  },
  {
    id: "crystalVial",
    nameEn: "Crystal Vial",
    nameKo: "수정 약병",
    shortEn: "Rebirth crystals +3% / Lv",
    shortKo: "크리스탈 획득 +3% / Lv",
  },
  {
    id: "apprenticePurse",
    nameEn: "Apprentice Purse",
    nameKo: "견습생 주머니",
    shortEn: "Start gold +5 / Lv",
    shortKo: "시작 골드 +5 / Lv",
  },
] as const

export function isRelicId(value: string): value is RelicId {
  return RELIC_IDS.some((id) => id === value)
}

export function getRelicDefinition(id: string): RelicDefinition | null {
  return RELICS.find((relic) => relic.id === id) ?? null
}

export function getEquippedRelicEffects(relics: RelicState): RelicEffects {
  let fireDamageMultiplier = 1
  let frostSlowBonusMs = 0
  let goldMultiplier = 1
  let castIntervalMultiplier = 1
  let critDamageBonus = 0
  let summonCostMultiplier = 1
  let xpMultiplier = 1
  let bossGoldMultiplier = 1
  let offlineEfficiencyBonus = 0
  let slotUpgradeCostMultiplier = 1
  let crystalGainMultiplier = 1
  let startingGoldBonus = 0

  for (const relicId of relics.equipped) {
    if (relicId === null || !isRelicId(relicId)) {
      continue
    }
    const level = getOwnedRelicLevel(relics, relicId)
    fireDamageMultiplier *= relicId === "emberSigil" ? 1 + 0.08 * level : 1
    frostSlowBonusMs += relicId === "frostLens" ? 200 * level : 0
    goldMultiplier *= relicId === "goldenBookmark" ? 1 + 0.06 * level : 1
    castIntervalMultiplier *= relicId === "quickeningHourglass" ? Math.max(0.7, 1 - 0.03 * level) : 1
    critDamageBonus += relicId === "abyssalEye" ? 0.1 * level : 0
    summonCostMultiplier *= relicId === "summonersSeal" ? Math.max(0.8, 1 - 0.02 * level) : 1
    xpMultiplier *= relicId === "sageInk" ? 1 + 0.04 * level : 1
    bossGoldMultiplier *= relicId === "kingMint" ? 1 + 0.08 * level : 1
    offlineEfficiencyBonus += relicId === "moonlitLedger" ? 0.03 * level : 0
    slotUpgradeCostMultiplier *= relicId === "craftsmanChisel" ? Math.max(0.75, 1 - 0.025 * level) : 1
    crystalGainMultiplier *= relicId === "crystalVial" ? 1 + 0.03 * level : 1
    startingGoldBonus += relicId === "apprenticePurse" ? 5 * level : 0
  }

  return {
    fireDamageMultiplier,
    frostSlowBonusMs,
    goldMultiplier,
    castIntervalMultiplier,
    critDamageBonus,
    summonCostMultiplier,
    xpMultiplier,
    bossGoldMultiplier,
    offlineEfficiencyBonus,
    slotUpgradeCostMultiplier,
    crystalGainMultiplier,
    startingGoldBonus,
  }
}

export function getElementDamageMultiplier(element: Element, relics: RelicState): number {
  const effects = getEquippedRelicEffects(relics)
  return element === "fire" ? effects.fireDamageMultiplier : 1
}

export function getOwnedRelicLevel(relics: RelicState, id: RelicId): number {
  return Math.min(RELIC_LEVEL_CAP, relics.owned[id] ?? 0)
}

export function getUncappedRelicIds(relics: RelicState): readonly RelicId[] {
  return RELIC_IDS.filter((id) => getOwnedRelicLevel(relics, id) < RELIC_LEVEL_CAP)
}
