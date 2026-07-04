import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  BOSS_WAVE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  CRIT_DAMAGE_MULTIPLIER,
  DMG_BASE,
  DMG_GROWTH,
  MANA_DAMAGE_PER_CRYSTAL,
  MIN_CAST_INTERVAL_MS,
  SLOT_INDEXES,
  SLOT_MULTIPLIER_PER_TIER,
  WIZARD_XP_PER_LEVEL,
} from "./constants.js"
import {
  getTomeMilestoneDamageMultiplier,
  getWizardCastIntervalMultiplier,
  getWizardCritChanceBonus,
} from "./balance.js"
import { getCodexBonusMultiplier } from "./codex.js"
import { getElementDamageMultiplier, getEquippedRelicEffects } from "./relics.js"
import { getHolyBossMultiplier } from "./resonance.js"
import { getSchoolElementDamageMultiplier } from "./school.js"
import { applyTraitCastInterval, getTraitCodexBonusPerTier } from "./traits.js"
import type { AscensionRank, Element, EngineState, PetState, School, SkinState } from "./types.js"

export type DailyMissionId = "merge20" | "boss3" | "summon30" | "mineClaim1" | "stage3"
// R5: 스킨은 (클래스, 학파) 결정론적 보상. 대마법사(rank2) 3종은 R2 스프라이트 파이프라인
// 연동 전까지 자리(placeholder)만 잡는다 — tint로만 임시 차별.
export type SkinId =
  | "apprentice"
  | "ember"
  | "frost"
  | "gilded"
  | "archmagePyro"
  | "archmageCryo"
  | "archmageLumen"

export type DailyMissionDefinition = {
  readonly id: DailyMissionId
  readonly goal: number
  readonly rewardManaCrystals: number
}

export type DailyMissionStatus = DailyMissionDefinition & {
  readonly progress: number
  readonly claimed: boolean
  readonly claimable: boolean
}

export type SkinDefinition = {
  readonly id: SkinId
  readonly tint: number
}

export type MineClaimPreview = {
  readonly floor: number
  readonly elapsedMs: number
  readonly manaCrystals: number
  readonly ratePerHour: number
  readonly claimable: boolean
}

const PET_EVOLUTION_ONE_LEVEL = 10
const PET_EVOLUTION_TWO_LEVEL = 25
const PET_ATTACK_INTERVAL_MS = 1_000
const PET_BASE_DPS_SHARE = 0.05
const PET_LEVEL_DPS_SHARE = 0.01
const PET_EVOLUTION_DPS_SHARE = 0.05
const MINE_CAP_MS = 12 * 60 * 60 * 1_000
const MINE_FLOOR_ONE_RATE = 0.15
const MINE_FLOOR_RATES_PER_HOUR: readonly [number, number, number, number] = [MINE_FLOOR_ONE_RATE, 0.4, 0.95, 2]
// R4: the familiar mines. Its level/evolution raise the crystal rate (it still
// contributes battle DPS via getPetDps). Kept gentle so mining stays well under
// a rebirth's yield (R1 balance rule: <=5% of first-rebirth crystals per hour).
const MINE_PET_LEVEL_BONUS = 0.015
const MINE_PET_EVOLUTION_BONUS = 0.1

const DAILY_MISSION_MERGE20: DailyMissionDefinition = { id: "merge20", goal: 20, rewardManaCrystals: 1 }
const DAILY_MISSION_BOSS3: DailyMissionDefinition = { id: "boss3", goal: 3, rewardManaCrystals: 1 }
const DAILY_MISSION_SUMMON30: DailyMissionDefinition = { id: "summon30", goal: 30, rewardManaCrystals: 1 }
const DAILY_MISSION_MINE_CLAIM1: DailyMissionDefinition = { id: "mineClaim1", goal: 1, rewardManaCrystals: 1 }
const DAILY_MISSION_STAGE3: DailyMissionDefinition = { id: "stage3", goal: 3, rewardManaCrystals: 1 }

export const DAILY_MISSIONS: readonly DailyMissionDefinition[] = [
  DAILY_MISSION_MERGE20,
  DAILY_MISSION_BOSS3,
  DAILY_MISSION_SUMMON30,
  DAILY_MISSION_MINE_CLAIM1,
  DAILY_MISSION_STAGE3,
] as const

const APPRENTICE_SKIN: SkinDefinition = { id: "apprentice", tint: 0xffffff }
const EMBER_SKIN: SkinDefinition = { id: "ember", tint: 0xff7a3c }
const FROST_SKIN: SkinDefinition = { id: "frost", tint: 0x86dcff }
const GILDED_SKIN: SkinDefinition = { id: "gilded", tint: 0xffd873 }
// 대마법사 각성판 — 정식판보다 밝은 tint로 임시 차별(에셋 연동 전).
const ARCHMAGE_PYRO_SKIN: SkinDefinition = { id: "archmagePyro", tint: 0xffb15a }
const ARCHMAGE_CRYO_SKIN: SkinDefinition = { id: "archmageCryo", tint: 0xbdefff }
const ARCHMAGE_LUMEN_SKIN: SkinDefinition = { id: "archmageLumen", tint: 0xfff0b0 }

export const SKINS: readonly SkinDefinition[] = [
  APPRENTICE_SKIN,
  EMBER_SKIN,
  FROST_SKIN,
  GILDED_SKIN,
  ARCHMAGE_PYRO_SKIN,
  ARCHMAGE_CRYO_SKIN,
  ARCHMAGE_LUMEN_SKIN,
] as const

// (클래스, 학파) → 스킨 결정론 매핑. 견습·미선택은 apprentice.
const RANK1_SCHOOL_SKIN: Record<School, SkinId> = { fire: "ember", frost: "frost", holy: "gilded" }
const RANK2_SCHOOL_SKIN: Record<School, SkinId> = {
  fire: "archmagePyro",
  frost: "archmageCryo",
  holy: "archmageLumen",
}

export function getAscensionSkinId(rank: AscensionRank, school: School | null): SkinId {
  if (rank < 1 || school === null) {
    return "apprentice"
  }
  return rank >= 2 ? RANK2_SCHOOL_SKIN[school] : RANK1_SCHOOL_SKIN[school]
}

/**
 * 전직·유파 변경 확정 시 호출. 결정론적 스킨을 owned에 병합하고 즉시 장착한다.
 * 외형과 수치는 분리 — 이후 apprentice로 되돌려도 유파 효과는 유지된다.
 */
export function applyAscensionSkin(state: EngineState): EngineState {
  const skinId = getAscensionSkinId(state.ascension.rank, state.ascension.school)
  return {
    ...state,
    skins: {
      owned: mergeOwnedSkins(state.skins.owned.length === 0 ? DEFAULT_SKIN_STATE.owned : state.skins.owned, skinId),
      equipped: skinId,
    },
  }
}

export const DEFAULT_SKIN_STATE: SkinState = {
  owned: ["apprentice"],
  equipped: "apprentice",
}

export function getPetEvolutionForLevel(level: number): number {
  if (level >= PET_EVOLUTION_TWO_LEVEL) {
    return 2
  }
  if (level >= PET_EVOLUTION_ONE_LEVEL) {
    return 1
  }
  return 0
}

export function getPetDamagePercent(pet: PetState): number {
  return PET_BASE_DPS_SHARE + pet.level * PET_LEVEL_DPS_SHARE + pet.evolution * PET_EVOLUTION_DPS_SHARE
}

export function addPetXp(state: EngineState, xp: number): EngineState {
  if (xp <= 0) {
    return state
  }

  let level = state.pet.level
  let petXp = state.pet.xp + xp

  while (petXp >= getPetXpThreshold(level)) {
    petXp -= getPetXpThreshold(level)
    level += 1
  }

  return {
    ...state,
    pet: {
      level,
      xp: petXp,
      evolution: getPetEvolutionForLevel(level),
    },
  }
}

export function shouldPetAttack(previousElapsedMs: number, nextElapsedMs: number): boolean {
  return Math.floor(previousElapsedMs / PET_ATTACK_INTERVAL_MS) < Math.floor(nextElapsedMs / PET_ATTACK_INTERVAL_MS)
}

export function getWizardTotalDps(state: EngineState): number {
  const castIntervalSeconds = getCastIntervalMs(state) / 1_000
  let equippedDps = 0
  for (const slot of SLOT_INDEXES) {
    const book = state.equipped[slot]
    if (book === null) {
      continue
    }
    equippedDps += getExpectedBookDamage(state, book.level, state.slotTiers[slot], book.element) / castIntervalSeconds
  }
  const innateStaffDps = DMG_BASE * 0.6 * getManaDamageMultiplier(state) / 1.2
  return equippedDps + innateStaffDps
}

export function getPetDps(state: EngineState): number {
  return getWizardTotalDps(state) * getPetDamagePercent(state.pet)
}

export function getUnlockedMineFloor(stage: number): number {
  if (stage >= 50) {
    return 4
  }
  if (stage >= 30) {
    return 3
  }
  if (stage >= 15) {
    return 2
  }
  return 1
}

export function getMineClaimPreview(state: EngineState, nowMs: number): MineClaimPreview {
  const floor = Math.max(state.mine.floor, getUnlockedMineFloor(state.stage))
  const ratePerHour = getMineRatePerHour(floor) * getMinePetMultiplier(state.pet)
  if (state.mine.lastClaimAt === null) {
    return { floor, elapsedMs: 0, manaCrystals: 0, ratePerHour, claimable: false }
  }

  const elapsedMs = Math.min(MINE_CAP_MS, Math.max(0, nowMs - state.mine.lastClaimAt))
  const manaCrystals = Math.floor((elapsedMs / (60 * 60 * 1_000)) * ratePerHour)
  return { floor, elapsedMs, manaCrystals, ratePerHour, claimable: manaCrystals > 0 }
}

export function claimMine(state: EngineState, nowMs: number): EngineState {
  const preview = getMineClaimPreview(state, nowMs)
  const claimed = {
    ...state,
    manaCrystals: state.manaCrystals + preview.manaCrystals,
    mine: {
      floor: preview.floor,
      lastClaimAt: nowMs,
    },
  }
  return preview.manaCrystals > 0 ? recordDailyProgress(incrementAchievementCounter(claimed, "mineClaims", 1), "mineClaim1", 1) : claimed
}

export function syncMineClock(state: EngineState, nowMs: number): EngineState {
  const floor = Math.max(state.mine.floor, getUnlockedMineFloor(state.stage))
  if (state.mine.lastClaimAt === null || state.mine.floor !== floor) {
    return {
      ...state,
      mine: {
        floor,
        lastClaimAt: state.mine.lastClaimAt ?? nowMs,
      },
    }
  }
  return state
}

export function syncDailyMissions(state: EngineState, date: Date): EngineState {
  const dateKey = getLocalDateKey(date)
  if (state.dailyMissions.date === dateKey) {
    return state
  }
  return {
    ...state,
    dailyMissions: {
      date: dateKey,
      progress: {},
      claimed: [],
    },
  }
}

export function recordDailyProgress(
  state: EngineState,
  missionId: DailyMissionId,
  amount: number,
  date?: Date,
): EngineState {
  if (amount <= 0) {
    return state
  }

  const current = date === undefined ? state : syncDailyMissions(state, date)
  const mission = getDailyMissionDefinition(missionId)
  const currentProgress = current.dailyMissions.progress[missionId] ?? 0
  return {
    ...current,
    dailyMissions: {
      ...current.dailyMissions,
      progress: {
        ...current.dailyMissions.progress,
        [missionId]: Math.min(mission.goal, currentProgress + amount),
      },
    },
  }
}

export function claimDailyMission(state: EngineState, missionId: DailyMissionId, date: Date): EngineState {
  const current = syncDailyMissions(state, date)
  const mission = getDailyMissionDefinition(missionId)
  const status = getDailyMissionStatus(current, mission, date)
  if (!status.claimable) {
    return current
  }
  return {
    ...current,
    manaCrystals: current.manaCrystals + mission.rewardManaCrystals,
    dailyMissions: {
      ...current.dailyMissions,
      claimed: [...current.dailyMissions.claimed, missionId],
    },
  }
}

export function getDailyMissionStatus(
  state: EngineState,
  mission: DailyMissionDefinition,
  date?: Date,
): DailyMissionStatus {
  const current = date === undefined ? state : syncDailyMissions(state, date)
  const progress = current.dailyMissions.progress[mission.id] ?? 0
  const claimed = current.dailyMissions.claimed.includes(mission.id)
  return {
    ...mission,
    progress,
    claimed,
    claimable: progress >= mission.goal && !claimed,
  }
}

export function hasDailyMissionClaim(state: EngineState, date: Date): boolean {
  const current = syncDailyMissions(state, date)
  return DAILY_MISSIONS.some((mission) => getDailyMissionStatus(current, mission).claimable)
}

export function getUnlockedSkins(state: EngineState): readonly SkinDefinition[] {
  return SKINS.filter((skin) => isSkinUnlocked(state, skin.id))
}

export function equipSkin(state: EngineState, skinId: string): EngineState {
  const unlocked = getUnlockedSkins(state).some((skin) => skin.id === skinId)
  if (!unlocked) {
    return { ...state, skins: normalizeSkinState(state.skins, state) }
  }
  return {
    ...state,
    skins: {
      owned: mergeOwnedSkins(normalizeSkinState(state.skins, state).owned, skinId),
      equipped: skinId,
    },
  }
}

export function normalizeSkinState(skins: SkinState, state: EngineState): SkinState {
  const unlockedIds = getUnlockedSkins(state).map((skin) => skin.id)
  const owned = mergeOwnedSkins(skins.owned.length === 0 ? DEFAULT_SKIN_STATE.owned : skins.owned, ...unlockedIds)
  const equipped = skins.equipped !== null && owned.includes(skins.equipped) ? skins.equipped : DEFAULT_SKIN_STATE.equipped
  return { owned, equipped }
}

export function getEquippedSkin(state: EngineState): SkinDefinition {
  const normalized = normalizeSkinState(state.skins, state)
  return SKINS.find((skin) => skin.id === normalized.equipped) ?? APPRENTICE_SKIN
}

export function incrementAchievementCounter(state: EngineState, counter: string, amount: number): EngineState {
  if (amount <= 0) {
    return state
  }
  const current = state.achievements.counters[counter] ?? 0
  return {
    ...state,
    achievements: {
      ...state.achievements,
      counters: {
        ...state.achievements.counters,
        [counter]: current + amount,
      },
    },
  }
}

export function setAchievementCounterMax(state: EngineState, counter: string, value: number): EngineState {
  const current = state.achievements.counters[counter] ?? 0
  if (current >= value) {
    return state
  }
  return {
    ...state,
    achievements: {
      ...state.achievements,
      counters: {
        ...state.achievements.counters,
        [counter]: value,
      },
    },
  }
}

function getExpectedBookDamage(state: EngineState, level: number, slotTier: number, element: Element): number {
  const critChance = Math.min(1, BASE_CRIT_CHANCE + CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel))
  const expectedCritFactor = 1 + critChance * (CRIT_DAMAGE_MULTIPLIER + getEquippedRelicEffects(state.relics).critDamageBonus - 1)
  const bossElementMultiplier = element === "holy" && state.wave === BOSS_WAVE ? getHolyBossMultiplier(state) : 1
  const codexTiers = state.codex.tiers[element] ?? 0
  return DMG_BASE *
    DMG_GROWTH ** level *
    getSlotMultiplierForTier(slotTier) *
    getManaDamageMultiplier(state) *
    getElementDamageMultiplier(element, state.relics) *
    getCodexBonusMultiplier(state, element) *
    (1 + getTraitCodexBonusPerTier(state) * codexTiers) *
    getSchoolElementDamageMultiplier(state, element) *
    getTomeMilestoneDamageMultiplier(state.highestLevelEver) *
    bossElementMultiplier *
    expectedCritFactor
}

function getManaDamageMultiplier(state: EngineState): number {
  return 1 + MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals
}

function getCastIntervalMs(state: EngineState): number {
  const baseInterval = BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * state.skills.castSpeed
  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel)
  return applyTraitCastInterval(state, Math.max(MIN_CAST_INTERVAL_MS, relicInterval))
}

function getSlotMultiplierForTier(slotTier: number): number {
  return 1 + SLOT_MULTIPLIER_PER_TIER * slotTier
}

export function getPetXpThreshold(level: number): number {
  return WIZARD_XP_PER_LEVEL * level
}

function getMineRatePerHour(floor: number): number {
  return MINE_FLOOR_RATES_PER_HOUR[Math.max(0, floor - 1)] ?? MINE_FLOOR_ONE_RATE
}

export function getMinePetMultiplier(pet: PetState): number {
  // A level-1 familiar adds nothing, so the base rate stays under the R1 balance
  // ceiling; the bonus grows as the familiar levels up and evolves.
  return 1 + Math.max(0, pet.level - 1) * MINE_PET_LEVEL_BONUS + pet.evolution * MINE_PET_EVOLUTION_BONUS
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getDailyMissionDefinition(id: DailyMissionId): DailyMissionDefinition {
  switch (id) {
    case "merge20":
      return DAILY_MISSION_MERGE20
    case "boss3":
      return DAILY_MISSION_BOSS3
    case "summon30":
      return DAILY_MISSION_SUMMON30
    case "mineClaim1":
      return DAILY_MISSION_MINE_CLAIM1
    case "stage3":
      return DAILY_MISSION_STAGE3
  }
}

// R5: 스킨 언락은 (클래스, 학파) 결정론. 구매·업적 카운터 언락은 폐지.
// apprentice는 상시, 정식·대마법사 스킨은 해당 클래스에 도달하고 학파가 일치할 때 획득.
export function isSkinUnlocked(state: EngineState, skinId: SkinId): boolean {
  const rank = state.ascension.rank
  const school = state.ascension.school
  switch (skinId) {
    case "apprentice":
      return true
    case "ember":
      return rank >= 1 && school === "fire"
    case "frost":
      return rank >= 1 && school === "frost"
    case "gilded":
      return rank >= 1 && school === "holy"
    case "archmagePyro":
      return rank >= 2 && school === "fire"
    case "archmageCryo":
      return rank >= 2 && school === "frost"
    case "archmageLumen":
      return rank >= 2 && school === "holy"
  }
}

function mergeOwnedSkins(owned: readonly string[], ...skinIds: readonly string[]): readonly string[] {
  const merged = new Set<string>(owned)
  for (const skinId of skinIds) {
    merged.add(skinId)
  }
  return [...merged]
}
