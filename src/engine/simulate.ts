import { equipBook, getPromotionStatus, mergeBooks, promoteClass, selectTrait } from "./actions.js"
import { addPetXp } from "./camp.js"
import * as C from "./constants.js"
import { getCodexBonusMultiplier, recordBookCodex } from "./codex.js"
import { getEquippedRelicEffects, getElementDamageMultiplier, RELIC_IDS, type RelicId } from "./relics.js"
import { getFireTargetCap, getFrostSlow, getHolyBossMultiplier } from "./resonance.js"
import {
  DEFAULT_ASCENSION,
  getAbsoluteZeroExecute,
  getChainIgnitionSplash,
  getFrostBuildupMultiplier,
  getInfernoMultiplier,
  getJudgmentGoldMultiplier,
  getSanctuaryMultiplier,
  getSchoolElementDamageMultiplier,
} from "./school.js"
import { createRandomState, nextRandomState } from "./rng.js"
import { createInitialV3ProgressionState, setEquippedSlot, setSlotTier, setSlotTimer, sumHp } from "./state.js"
import {
  applyTraitCastInterval,
  getTraitCodexBonusPerTier,
  getTraitSkillGoldPoints,
  getUnlockedTraitSlots,
  type TraitId,
  type TraitSlot,
} from "./traits.js"
import { assertNever, type Element, type EngineState, type EquippedBooks, type SlotIndex, type SlotTiers, type SlotTimers, type Spellbook } from "./types.js"

type CliProcess = {
  readonly argv: readonly string[]
  readonly stdout: { readonly write: (text: string) => void }
}

declare const process: CliProcess | undefined

const INNATE_STAFF_INTERVAL_MS = 1_200
const PET_ATTACK_INTERVAL_MS = 1_000
const PET_BASE_DPS_SHARE = 0.05
const PET_LEVEL_DPS_SHARE = 0.01
const PET_EVOLUTION_DPS_SHARE = 0.05
const RECENT_POWERUP_INTERVALS = 10
const POLICY_INTERVAL_TICKS = 10
const WALL_STRENGTH_CAP = 999.9

const SIMULATION_CONSTANT_KEYS = [
  "SUMMON_FLOOR_GAP",
  "SUMMON_COST_BASE",
  "SUMMON_COST_GROWTH",
  "DMG_BASE",
  "DMG_GROWTH",
  "HP_BASE",
  "HP_GROWTH",
  "INITIAL_GOLD",
  "INITIAL_STAGE",
  "INITIAL_WAVE",
  "INITIAL_HIGHEST_LEVEL",
  "INVENTORY_LIMIT",
  "SLOT_UPGRADE_COST_BASE",
  "SLOT_UPGRADE_COST_GROWTH",
  "SLOT_MULTIPLIER_PER_TIER",
  "TICK_MS",
  "BASE_CAST_INTERVAL_MS",
  "CAST_SPEED_REDUCTION_MS",
  "MIN_CAST_INTERVAL_MS",
  "REGULAR_MOB_BASE_COUNT",
  "REGULAR_MOB_MIN_COUNT",
  "REGULAR_MOB_MAX_COUNT",
  "REGULAR_MOB_STAGE_BAND",
  "BOSS_WAVE",
  "BOSS_EXPECTED_DPS_BASE",
  "BOSS_EXPECTED_DPS_GROWTH",
  "BOSS_REGULAR_FACTOR",
  "BOSS_WALL_FACTOR",
  "BOSS_GATE_FACTOR",
  "BOSS_ENRAGE_MS",
  "FIRE_TARGET_CAP",
  "FROST_SLOW_MS",
  "FROST_SLOW_FACTOR",
  "BASE_CRIT_CHANCE",
  "CRIT_CHANCE_PER_POINT",
  "CRIT_DAMAGE_MULTIPLIER",
  "MANA_DAMAGE_PER_CRYSTAL",
  "GOLD_REWARD_BASE",
  "GOLD_REWARD_GROWTH",
  "GOLD_GAIN_PER_POINT",
  "BOSS_REWARD_MULTIPLIER",
  "WIZARD_XP_PER_LEVEL",
  "WIZARD_CAST_MILESTONE_LEVEL",
  "WIZARD_CAST_INTERVAL_MULTIPLIER",
  "WIZARD_CRIT_MILESTONE_LEVEL",
  "WIZARD_CRIT_CHANCE_BONUS",
  "WIZARD_GOLD_MILESTONE_LEVEL",
  "WIZARD_GOLD_MULTIPLIER",
  "TOME_DAMAGE_MILESTONE_MULTIPLIER",
  "PRESTIGE_STAGE_OFFSET",
  "PRESTIGE_CRYSTAL_EXPONENT",
  "PRESTIGE_CRYSTAL_DIVISOR",
  "XP_PER_KILL",
  "XP_PER_BOSS_KILL",
] as const

type SimulationConstantKey = (typeof SIMULATION_CONSTANT_KEYS)[number]
type SimulationOverrides = Partial<Record<SimulationConstantKey, number>>
type SimulationConfig = Record<SimulationConstantKey, number>

export type SimulationOptions = {
  readonly minutes: number
  readonly seed?: number
  readonly rowMinutes?: number
  readonly overrides?: SimulationOverrides
}

export type SimulationRow = {
  readonly minute: number
  readonly stage: number
  readonly highestBookLevel: number
  readonly gold: number
  readonly summonFloor: number
  readonly wallStrength: number
  readonly flags: readonly string[]
}

export type StageBreakthrough = {
  readonly stage: number
  readonly minute: number
}

export type SimulationSummary = {
  readonly firstPrestigeMinute: number | null
  readonly firstWallMinute: number | null
  readonly maxStageEver: number
  readonly maxBookLevelEver: number
  readonly stageBreakthroughs: readonly StageBreakthrough[]
}

export type SimulationResult = {
  readonly rows: readonly SimulationRow[]
  readonly finalState: EngineState
  readonly summary: SimulationSummary
  readonly maxStageEver: number
  readonly maxBookLevelEver: number
  readonly overrides: SimulationOverrides
}

type PowerupTracker = {
  readonly lastPowerupSecond: number | null
  readonly intervals: readonly number[]
}

type PolicyResult = {
  readonly state: EngineState
  readonly powerup: boolean
  readonly prestiged: boolean
}

type TickResult = {
  readonly state: EngineState
  readonly goldEarned: number
}

type CliOptions = {
  readonly minutes: number
  readonly rowMinutes?: number
  readonly summary: boolean
  readonly overrides: SimulationOverrides
}

export class CliArgumentError extends Error {
  readonly name = "CliArgumentError"

  constructor(readonly argument: string) {
    super(`Invalid simulator argument: ${argument}`)
  }
}

export function runBalanceSimulation(options: SimulationOptions): SimulationResult {
  const seed = options.seed ?? 1
  const config = createSimulationConfig(options.overrides ?? {})
  const totalTicks = Math.floor((options.minutes * 60 * 1_000) / config.TICK_MS)
  const rowIntervalTicks = Math.max(1, Math.floor(((options.rowMinutes ?? 10) * 60 * 1_000) / config.TICK_MS))
  let state = createInitialSimulationState(seed, config)
  let rows: readonly SimulationRow[] = []
  let tracker: PowerupTracker = { lastPowerupSecond: null, intervals: [] }
  let lastProgressMinute = 0
  let lastStage = state.stage
  let firstPrestigeMinute: number | null = null
  let firstWallMinute: number | null = null
  let maxStageEver = state.stage
  let maxBookLevelEver = getHighestBookLevel(state)
  let stageBreakthroughs: readonly StageBreakthrough[] = []

  for (let tick = 1; tick <= totalTicks; tick += POLICY_INTERVAL_TICKS) {
    const policy = applyGreedyPolicy(state, config)
    state = policy.state
    maxStageEver = Math.max(maxStageEver, state.stage)
    maxBookLevelEver = Math.max(maxBookLevelEver, getHighestBookLevel(state))
    tracker = policy.powerup ? recordPowerup(tracker, ((tick - 1) * config.TICK_MS) / 1_000) : tracker
    if (firstPrestigeMinute === null && policy.prestiged) {
      firstPrestigeMinute = Math.floor(((tick - 1) * config.TICK_MS) / 60_000)
    }

    const ticksThisStep = Math.min(POLICY_INTERVAL_TICKS, totalTicks - tick + 1)
    state = simulateTicksForBalance(state, ticksThisStep, config).state
    maxStageEver = Math.max(maxStageEver, state.stage)
    maxBookLevelEver = Math.max(maxBookLevelEver, getHighestBookLevel(state))
    const currentTick = tick + ticksThisStep - 1
    const minute = Math.floor((currentTick * config.TICK_MS) / 60_000)

    if (state.stage > lastStage) {
      stageBreakthroughs = recordStageBreakthroughs(stageBreakthroughs, lastStage, state.stage, minute)
      lastStage = state.stage
      lastProgressMinute = minute
    }

    if (currentTick % rowIntervalTicks === 0) {
      const wallStrength = getWallStrength(state, tracker, config)
      if (firstWallMinute === null && wallStrength > 5) {
        firstWallMinute = minute
      }
      rows = [
        ...rows,
        {
          minute,
          stage: state.stage,
          highestBookLevel: getHighestBookLevel(state),
          gold: state.gold,
          summonFloor: getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus,
          wallStrength,
          flags: minute - lastProgressMinute > 15 ? ["STALL"] : [],
        },
      ]
    }
  }

  return {
    rows,
    finalState: state,
    summary: { firstPrestigeMinute, firstWallMinute, maxStageEver, maxBookLevelEver, stageBreakthroughs },
    maxStageEver,
    maxBookLevelEver,
    overrides: options.overrides ?? {},
  }
}

export function formatSimulation(result: SimulationResult): string {
  const lines = ["minute | stage | highest book | gold | summon floor | wall | flags"]

  for (const row of result.rows) {
    lines.push(
      `${row.minute.toString().padStart(6)} | ${row.stage.toString().padStart(5)} | ${row.highestBookLevel
        .toString()
        .padStart(12)} | ${Math.floor(row.gold).toString().padStart(4)} | ${row.summonFloor.toString().padStart(12)} | ${formatWall(
        row.wallStrength,
      ).padStart(4)} | ${row.flags.length === 0 ? "-" : row.flags.join(",")}`,
    )
  }

  return `${formatOverrideHeader(result)}${lines.join("\n")}\n`
}

export function formatSimulationSummary(result: SimulationResult): string {
  const lines: readonly string[] = [
    ...formatOverrideLines(result),
    `first prestige: ${formatMinute(result.summary.firstPrestigeMinute)}`,
    `first wall>5: ${formatMinute(result.summary.firstWallMinute)}`,
    ...result.summary.stageBreakthroughs.map((event) => `stage ${event.stage}: ${event.minute}m`),
    `final: stage ${result.finalState.stage}, wave ${result.finalState.wave}, highest book ${getHighestBookLevel(result.finalState)}, gold ${Math.floor(
      result.finalState.gold,
    )}, mana ${result.finalState.manaCrystals}`,
  ]

  return `${lines.join("\n")}\n`
}

function createSimulationConfig(overrides: SimulationOverrides): SimulationConfig {
  return { ...DEFAULT_SIMULATION_CONFIG, ...overrides }
}

const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  SUMMON_FLOOR_GAP: C.SUMMON_FLOOR_GAP,
  SUMMON_COST_BASE: C.SUMMON_COST_BASE,
  SUMMON_COST_GROWTH: C.SUMMON_COST_GROWTH,
  DMG_BASE: C.DMG_BASE,
  DMG_GROWTH: C.DMG_GROWTH,
  HP_BASE: C.HP_BASE,
  HP_GROWTH: C.HP_GROWTH,
  INITIAL_GOLD: C.INITIAL_GOLD,
  INITIAL_STAGE: C.INITIAL_STAGE,
  INITIAL_WAVE: C.INITIAL_WAVE,
  INITIAL_HIGHEST_LEVEL: C.INITIAL_HIGHEST_LEVEL,
  INVENTORY_LIMIT: C.INVENTORY_LIMIT,
  SLOT_UPGRADE_COST_BASE: C.SLOT_UPGRADE_COST_BASE,
  SLOT_UPGRADE_COST_GROWTH: C.SLOT_UPGRADE_COST_GROWTH,
  SLOT_MULTIPLIER_PER_TIER: C.SLOT_MULTIPLIER_PER_TIER,
  TICK_MS: C.TICK_MS,
  BASE_CAST_INTERVAL_MS: C.BASE_CAST_INTERVAL_MS,
  CAST_SPEED_REDUCTION_MS: C.CAST_SPEED_REDUCTION_MS,
  MIN_CAST_INTERVAL_MS: C.MIN_CAST_INTERVAL_MS,
  REGULAR_MOB_BASE_COUNT: C.REGULAR_MOB_BASE_COUNT,
  REGULAR_MOB_MIN_COUNT: C.REGULAR_MOB_MIN_COUNT,
  REGULAR_MOB_MAX_COUNT: C.REGULAR_MOB_MAX_COUNT,
  REGULAR_MOB_STAGE_BAND: C.REGULAR_MOB_STAGE_BAND,
  BOSS_WAVE: C.BOSS_WAVE,
  BOSS_EXPECTED_DPS_BASE: C.BOSS_EXPECTED_DPS_BASE,
  BOSS_EXPECTED_DPS_GROWTH: C.BOSS_EXPECTED_DPS_GROWTH,
  BOSS_REGULAR_FACTOR: C.BOSS_REGULAR_FACTOR,
  BOSS_WALL_FACTOR: C.BOSS_WALL_FACTOR,
  BOSS_GATE_FACTOR: C.BOSS_GATE_FACTOR,
  BOSS_ENRAGE_MS: C.BOSS_ENRAGE_MS,
  FIRE_TARGET_CAP: C.FIRE_TARGET_CAP,
  FROST_SLOW_MS: C.FROST_SLOW_MS,
  FROST_SLOW_FACTOR: C.FROST_SLOW_FACTOR,
  BASE_CRIT_CHANCE: C.BASE_CRIT_CHANCE,
  CRIT_CHANCE_PER_POINT: C.CRIT_CHANCE_PER_POINT,
  CRIT_DAMAGE_MULTIPLIER: C.CRIT_DAMAGE_MULTIPLIER,
  MANA_DAMAGE_PER_CRYSTAL: C.MANA_DAMAGE_PER_CRYSTAL,
  GOLD_REWARD_BASE: C.GOLD_REWARD_BASE,
  GOLD_REWARD_GROWTH: C.GOLD_REWARD_GROWTH,
  GOLD_GAIN_PER_POINT: C.GOLD_GAIN_PER_POINT,
  BOSS_REWARD_MULTIPLIER: C.BOSS_REWARD_MULTIPLIER,
  WIZARD_XP_PER_LEVEL: C.WIZARD_XP_PER_LEVEL,
  WIZARD_CAST_MILESTONE_LEVEL: C.WIZARD_CAST_MILESTONE_LEVEL,
  WIZARD_CAST_INTERVAL_MULTIPLIER: C.WIZARD_CAST_INTERVAL_MULTIPLIER,
  WIZARD_CRIT_MILESTONE_LEVEL: C.WIZARD_CRIT_MILESTONE_LEVEL,
  WIZARD_CRIT_CHANCE_BONUS: C.WIZARD_CRIT_CHANCE_BONUS,
  WIZARD_GOLD_MILESTONE_LEVEL: C.WIZARD_GOLD_MILESTONE_LEVEL,
  WIZARD_GOLD_MULTIPLIER: C.WIZARD_GOLD_MULTIPLIER,
  TOME_DAMAGE_MILESTONE_MULTIPLIER: C.TOME_DAMAGE_MILESTONE_MULTIPLIER,
  PRESTIGE_STAGE_OFFSET: C.PRESTIGE_STAGE_OFFSET,
  PRESTIGE_CRYSTAL_EXPONENT: C.PRESTIGE_CRYSTAL_EXPONENT,
  PRESTIGE_CRYSTAL_DIVISOR: C.PRESTIGE_CRYSTAL_DIVISOR,
  XP_PER_KILL: C.XP_PER_KILL,
  XP_PER_BOSS_KILL: C.XP_PER_BOSS_KILL,
}

function applyGreedyPolicy(state: EngineState, config: SimulationConfig): PolicyResult {
  const meta = applyMetaPolicy(state, config)
  const summoned = summonAffordableBooks(meta.state, config)
  let current = mergeAllPairs(summoned.state)
  let changed = true

  while (changed) {
    const before = current
    const next = summonAffordableBooks(current, config)
    current = mergeAllPairs(next.state)
    changed = before !== current
  }

  const upgraded = upgradeCheapestSlot(equipTopSix(current), config)
  return { state: upgraded.state, powerup: meta.powerup || summoned.powerup || upgraded.powerup, prestiged: meta.prestiged }
}

function applyMetaPolicy(state: EngineState, config: SimulationConfig): PolicyResult {
  const promoted = promoteGreedy(state)
  const withRelics = summonAndEquipRelics(promoted)
  const previewCrystals = getPrestigeCrystalReward(withRelics.stage, getEquippedRelicEffects(withRelics.relics).crystalGainMultiplier, config)

  if (previewCrystals >= getPrestigeTarget(withRelics.prestigeCount)) {
    return {
      state: prestigeForBalance(withRelics, previewCrystals, config),
      powerup: true,
      prestiged: true,
    }
  }

  return { state: withRelics, powerup: withRelics !== state, prestiged: false }
}

function summonAffordableBooks(state: EngineState, config: SimulationConfig): PolicyResult {
  let current = state
  let powerup = false
  let canContinue = true

  while (canContinue) {
    const summonLevel = getSummonLevel(current.highestLevelEver, config) + current.skills.summonBonus
    const summonCost = getSummonCost(summonLevel, config)
    if (current.books.length >= config.INVENTORY_LIMIT || current.gold < summonCost) {
      canContinue = false
    } else {
      current = summonBookForBalance(current, summonLevel, summonCost)
      powerup = true
    }
  }

  return { state: current, powerup, prestiged: false }
}

function mergeAllPairs(state: EngineState): EngineState {
  let current = state
  let pair = findMergePair(current)

  while (pair !== null) {
    current = mergeBooks(current, pair.leftId, pair.rightId)
    pair = findMergePair(current)
  }

  return current
}

function findMergePair(state: EngineState): { readonly leftId: string; readonly rightId: string } | null {
  const books = getAllBooks(state)

  for (const left of books) {
    for (const right of books) {
      if (left.id !== right.id && left.level === right.level) {
        return { leftId: left.id, rightId: right.id }
      }
    }
  }

  return null
}

function equipTopSix(state: EngineState): EngineState {
  const sorted = [...getAllBooks(state)].sort((left, right) => right.level - left.level)
  let current: EngineState = { ...state, books: sorted, equipped: emptyEquipment() }
  const top = sorted.slice(0, C.SLOT_INDEXES.length)

  for (const book of top) {
    const firstEmpty = C.SLOT_INDEXES.find((slot) => current.equipped[slot] === null)
    if (firstEmpty !== undefined) {
      current = equipBook(current, book.id, firstEmpty)
    }
  }

  return current
}

function upgradeCheapestSlot(state: EngineState, config: SimulationConfig): PolicyResult {
  const summonLevel = getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus
  const summonCost = getSummonCost(summonLevel, config)
  let cheapestSlot: SlotIndex = 0
  let cheapestCost = getSlotUpgradeCost(state.slotTiers[cheapestSlot], config)

  for (const slot of C.SLOT_INDEXES) {
    const cost = getSlotUpgradeCost(state.slotTiers[slot], config)
    if (cost < cheapestCost) {
      cheapestSlot = slot
      cheapestCost = cost
    }
  }

  if (state.gold > summonCost * 5 && state.gold >= cheapestCost) {
    return {
      state: { ...state, gold: state.gold - cheapestCost, slotTiers: setSlotTier(state.slotTiers, cheapestSlot, state.slotTiers[cheapestSlot] + 1) },
      powerup: true,
      prestiged: false,
    }
  }

  return { state, powerup: false, prestiged: false }
}

// R5: 전직·유파(화염 기본) 정책. 게이트 충족 시 승급하고, 열린 비전 각인 슬롯을 골드·속도·도감
// 위주로 채운다. 학파 화염이라 화염 공명 요구 하향·화염 배수·연쇄발화가 곡선에 반영된다.
function promoteGreedy(state: EngineState): EngineState {
  let current = state
  const status = getPromotionStatus(current)
  if (status.eligible) {
    current = current.ascension.rank === 0 ? promoteClass(current, "fire") : promoteClass(current)
  }
  current = selectArcaneIfOpen(current, "arcane1", "goldenLibrary")
  current = selectArcaneIfOpen(current, "arcane2", "quickHands")
  current = selectArcaneIfOpen(current, "arcane3", "archmageFocus")
  return current
}

function selectArcaneIfOpen(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
  const unlocked = getUnlockedTraitSlots(state.ascension.rank).some((openSlot) => openSlot === slot)
  if (!unlocked || state.traits.picks[slot] !== undefined) {
    return state
  }
  return selectTrait(state, slot, traitId)
}

function summonAndEquipRelics(state: EngineState): EngineState {
  let current = state

  while (current.manaCrystals >= C.RELIC_SUMMON_COST) {
    const roll = nextRandomState(current.rngState)
    const relicId = RELIC_IDS[Math.floor(roll.value * RELIC_IDS.length)] ?? "emberSigil"
    const level = current.relics.owned[relicId] ?? 0
    if (level >= C.RELIC_LEVEL_CAP) {
      return { ...current, rngState: roll.state }
    }
    current = {
      ...current,
      manaCrystals: current.manaCrystals - C.RELIC_SUMMON_COST,
      rngState: roll.state,
      relics: {
        ...current.relics,
        owned: { ...current.relics.owned, [relicId]: level + 1 },
      },
    }
  }

  return equipPreferredRelics(current)
}

function equipPreferredRelics(state: EngineState): EngineState {
  const preferred: readonly RelicId[] = ["quickeningHourglass", "emberSigil", "goldenBookmark", "crystalVial", "sageInk", "craftsmanChisel"]
  const equipped = preferred.filter((relicId) => (state.relics.owned[relicId] ?? 0) > 0).slice(0, 3)
  return {
    ...state,
    relics: {
      ...state.relics,
      equipped: [equipped[0] ?? null, equipped[1] ?? null, equipped[2] ?? null],
    },
  }
}

function getPrestigeTarget(prestigeCount: number): number {
  if (prestigeCount === 0) {
    return 1
  }
  return Math.floor(3 * 1.45 ** prestigeCount)
}

function prestigeForBalance(state: EngineState, manaCrystals: number, config: SimulationConfig): EngineState {
  const enemiesHp = createWaveEnemies(config.INITIAL_STAGE, config.INITIAL_WAVE, config)
  return {
    ...state,
    gold: config.INITIAL_GOLD + getEquippedRelicEffects(state.relics).startingGoldBonus,
    books: [],
    equipped: emptyEquipment(),
    highestLevelEver: config.INITIAL_HIGHEST_LEVEL,
    stage: config.INITIAL_STAGE,
    wave: config.INITIAL_WAVE,
    stageHp: sumHp(enemiesHp),
    manaCrystals: state.manaCrystals + manaCrystals,
    prestigeCount: state.prestigeCount + 1,
    highestStage: state.highestStage,
    castProgressMs: zeroSlots(),
    enemiesHp,
    bossElapsedMs: 0,
    frostSlowMs: 0,
    recentGoldPerSecond: 0,
    activeRift: null,
  }
}

function simulateTicksForBalance(state: EngineState, nTicks: number, config: SimulationConfig): TickResult {
  let current = normalizeBattleState(state, config)
  let goldEarned = 0

  for (let tick = 0; tick < nTicks; tick += 1) {
    const previousElapsedMs = current.elapsedMs
    current = {
      ...current,
      elapsedMs: previousElapsedMs + config.TICK_MS,
      frostSlowMs: Math.max(0, current.frostSlowMs - config.TICK_MS),
    }

    if (shouldCastInnateStaff(previousElapsedMs, current.elapsedMs)) {
      const applied = applyInnateStaffDamage(current, config)
      current = applied.state
      goldEarned += applied.goldEarned
    }

    if (shouldPetAttack(previousElapsedMs, current.elapsedMs)) {
      const applied = applyPetDamage(current, config)
      current = applied.state
      goldEarned += applied.goldEarned
    }

    for (const slot of C.SLOT_INDEXES) {
      const book = current.equipped[slot]
      if (book === null) {
        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, 0) }
        continue
      }

      const nextProgress = current.castProgressMs[slot] + config.TICK_MS
      const castInterval = getCastIntervalMs(current, config)
      if (nextProgress < castInterval) {
        current = { ...current, castProgressMs: setSlotTimer(current.castProgressMs, slot, nextProgress) }
        continue
      }

      const damageRoll = bookDamage(book, current.slotTiers[slot], current, config)
      current = { ...damageRoll.state, castProgressMs: setSlotTimer(damageRoll.state.castProgressMs, slot, nextProgress - castInterval) }
      const applied = applyCastDamage(current, slot, book, damageRoll.damage, config)
      current = applied.state
      goldEarned += applied.goldEarned
    }

    if (current.wave === config.BOSS_WAVE && current.enemiesHp.length > 0) {
      const bossElapsedMs = current.bossElapsedMs + config.TICK_MS
      current = { ...current, bossElapsedMs }
      if (bossElapsedMs >= config.BOSS_ENRAGE_MS) {
        const enemiesHp = createWaveEnemies(current.stage, 1, config)
        current = {
          ...current,
          wave: 1,
          enemiesHp,
          stageHp: sumHp(enemiesHp),
          bossElapsedMs: 0,
          frostSlowMs: 0,
        }
      }
    }
  }

  return {
    state: {
      ...current,
      recentGoldPerSecond: nTicks > 0 ? goldEarned / ((nTicks * config.TICK_MS) / 1_000) : current.recentGoldPerSecond,
    },
    goldEarned,
  }
}

function applyInnateStaffDamage(state: EngineState, config: SimulationConfig): TickResult {
  if (state.enemiesHp.length === 0) {
    return { state, goldEarned: 0 }
  }

  const damage = config.DMG_BASE * 0.6 * (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)
  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
  return finalizeDamage(state, damaged, config)
}

function applyPetDamage(state: EngineState, config: SimulationConfig): TickResult {
  if (state.enemiesHp.length === 0) {
    return { state, goldEarned: 0 }
  }

  const damage = getPetDps(state, config)
  if (damage <= 0) {
    return { state, goldEarned: 0 }
  }

  const damaged = state.enemiesHp.map((hp, index) => (index === 0 ? hp - damage : hp))
  return finalizeDamage(state, damaged, config)
}

function applyCastDamage(state: EngineState, slot: SlotIndex, book: Spellbook, baseDamage: number, config: SimulationConfig): TickResult {
  if (state.enemiesHp.length === 0) {
    return { state, goldEarned: 0 }
  }

  const targetsHit = getTargetsHit(book.element, state.enemiesHp.length, state)
  const damage = getElementDamage(book.element, baseDamage, state.wave, state, config)
  const splash = book.element === "fire" ? getChainIgnitionSplash(state) : 0
  const executeFrac = book.element === "frost" ? getAbsoluteZeroExecute(state) : 0
  const damaged = state.enemiesHp.map((hp, index) => {
    if (index < targetsHit) {
      const executed = index === 0 && executeFrac > 0 ? hp * executeFrac : 0
      return hp - damage - executed
    }
    return splash > 0 ? hp - damage * splash : hp
  })
  const frostSlow = getFrostSlow(state)
  const frostSlowMs = frostSlow.durationMs + getEquippedRelicEffects(state.relics).frostSlowBonusMs
  const slowedState = book.element === "frost" ? { ...state, frostSlowMs: Math.max(state.frostSlowMs, frostSlowMs) } : state
  return finalizeDamage(slowedState, damaged, config)
}

function finalizeDamage(state: EngineState, damaged: readonly number[], config: SimulationConfig): TickResult {
  const survivors = damaged.filter((hp) => hp > 0)
  const killed = damaged.length - survivors.length
  const boss = state.wave === config.BOSS_WAVE
  const reward = getKillReward(state, boss, config)
  const gold = reward * killed
  const xpPerKill = getXpPerKill(state, boss, config)
  const withXp = addWizardXp({ ...state, gold: state.gold + gold }, xpPerKill * killed, config)
  const stateWithEnemies = { ...withXp, enemiesHp: survivors, stageHp: sumHp(survivors) }
  const cleared = survivors.length === 0 ? advanceWave(stateWithEnemies, config) : stateWithEnemies

  return { state: cleared, goldEarned: gold }
}

function advanceWave(state: EngineState, config: SimulationConfig): EngineState {
  if (state.wave === config.BOSS_WAVE) {
    const nextStage = state.stage + 1
    const enemiesHp = createWaveEnemies(nextStage, 1, config)
    return { ...state, stage: nextStage, highestStage: Math.max(state.highestStage, nextStage), wave: 1, enemiesHp, stageHp: sumHp(enemiesHp), bossElapsedMs: 0 }
  }

  const nextWave = state.wave + 1
  const enemiesHp = createWaveEnemies(state.stage, nextWave, config)
  return { ...state, wave: nextWave, enemiesHp, stageHp: sumHp(enemiesHp), bossElapsedMs: 0 }
}

function addWizardXp(state: EngineState, xp: number, config: SimulationConfig): EngineState {
  let wizardLevel = state.wizardLevel
  let wizardXp = state.wizardXp + xp
  let skillPoints = state.skillPoints

  while (wizardXp >= config.WIZARD_XP_PER_LEVEL * wizardLevel) {
    wizardXp -= config.WIZARD_XP_PER_LEVEL * wizardLevel
    wizardLevel += 1
    skillPoints += 1
  }

  return addPetXp({ ...state, wizardLevel, wizardXp, skillPoints }, xp * 0.5)
}

function createInitialSimulationState(seed: number, config: SimulationConfig): EngineState {
  const enemiesHp = createWaveEnemies(config.INITIAL_STAGE, config.INITIAL_WAVE, config)

  return {
    gold: config.INITIAL_GOLD,
    books: [],
    equipped: emptyEquipment(),
    highestLevelEver: config.INITIAL_HIGHEST_LEVEL,
    highestStage: config.INITIAL_STAGE,
    stage: config.INITIAL_STAGE,
    wave: config.INITIAL_WAVE,
    stageHp: sumHp(enemiesHp),
    wizardLevel: 1,
    wizardXp: 0,
    skillPoints: 0,
    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
    manaCrystals: 0,
    prestigeCount: 0,
    lastSeenServerTs: null,
    slotTiers: zeroSlots(),
    castProgressMs: zeroSlots(),
    enemiesHp,
    bossElapsedMs: 0,
    frostSlowMs: 0,
    recentGoldPerSecond: 0,
    elapsedMs: 0,
    rngSeed: seed,
    rngState: createRandomState(seed),
    nextBookId: 1,
    ascension: DEFAULT_ASCENSION,
    ...createInitialV3ProgressionState(),
  }
}

function summonBookForBalance(state: EngineState, summonLevel: number, cost: number): EngineState {
  const emptySlot = C.SLOT_INDEXES.find((slot) => state.equipped[slot] === null)
  const roll = nextRandomState(state.rngState)
  const spellbook: Spellbook = {
    id: `book-${state.nextBookId}`,
    level: summonLevel,
    element: pickElement(roll.value),
  }

  return recordBookCodex({
    ...state,
    gold: state.gold - cost,
    books: emptySlot === undefined ? [...state.books, spellbook] : state.books,
    equipped: emptySlot === undefined ? state.equipped : setEquippedSlot(state.equipped, emptySlot, spellbook),
    highestLevelEver: Math.max(state.highestLevelEver, spellbook.level),
    rngState: roll.state,
    nextBookId: state.nextBookId + 1,
  }, spellbook)
}

function recordPowerup(tracker: PowerupTracker, second: number): PowerupTracker {
  if (tracker.lastPowerupSecond === null) {
    return { ...tracker, lastPowerupSecond: second }
  }

  if (tracker.lastPowerupSecond === second) {
    return tracker
  }

  return {
    lastPowerupSecond: second,
    intervals: [...tracker.intervals, second - tracker.lastPowerupSecond].slice(-RECENT_POWERUP_INTERVALS),
  }
}

function getWallStrength(state: EngineState, tracker: PowerupTracker, config: SimulationConfig): number {
  if (state.stage < 7) {
    return 0
  }

  const median = getMedian(tracker.intervals)
  if (median === null || median <= 0) {
    return 0
  }

  return Math.min(WALL_STRENGTH_CAP, getExpectedPowerupWaitSeconds(state, config) / median)
}

function getExpectedPowerupWaitSeconds(state: EngineState, config: SimulationConfig): number {
  const requiredGold = Math.min(getNextSummonRequiredGold(state, config), getNextSlotRequiredGold(state, config))
  if (requiredGold <= state.gold) {
    return 0
  }

  return state.recentGoldPerSecond > 0 ? (requiredGold - state.gold) / state.recentGoldPerSecond : Number.POSITIVE_INFINITY
}

function getNextSummonRequiredGold(state: EngineState, config: SimulationConfig): number {
  if (state.books.length >= config.INVENTORY_LIMIT) {
    return Number.POSITIVE_INFINITY
  }

  return getSummonCost(getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus, config)
}

function getNextSlotRequiredGold(state: EngineState, config: SimulationConfig): number {
  const summonCost = getSummonCost(getSummonLevel(state.highestLevelEver, config) + state.skills.summonBonus, config)
  const cheapest = C.SLOT_INDEXES.reduce((best, slot) => Math.min(best, getSlotUpgradeCost(state.slotTiers[slot], config)), getSlotUpgradeCost(state.slotTiers[0], config))
  return Math.max(cheapest, summonCost * 5)
}

function getMedian(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null
  }

  const sorted = [...values].sort((left, right) => left - right)
  const mid = Math.floor(sorted.length / 2)
  const middle = sorted[mid]
  if (middle === undefined) {
    return null
  }

  if (sorted.length % 2 === 1) {
    return middle
  }

  const before = sorted[mid - 1]
  return before === undefined ? middle : (before + middle) / 2
}

function recordStageBreakthroughs(events: readonly StageBreakthrough[], previousStage: number, nextStage: number, minute: number): readonly StageBreakthrough[] {
  let recorded = events
  for (let stage = Math.ceil((previousStage + 1) / 10) * 10; stage <= nextStage; stage += 10) {
    recorded = [...recorded, { stage, minute }]
  }
  return recorded
}

function normalizeBattleState(state: EngineState, config: SimulationConfig): EngineState {
  if (state.enemiesHp.length > 0) {
    return { ...state, stageHp: sumHp(state.enemiesHp) }
  }

  const enemiesHp = createWaveEnemies(state.stage, state.wave, config)
  return { ...state, enemiesHp, stageHp: sumHp(enemiesHp) }
}

function createWaveEnemies(stage: number, wave: number, config: SimulationConfig): readonly number[] {
  const hp = config.HP_BASE * config.HP_GROWTH ** stage
  if (wave === config.BOSS_WAVE) {
    return [getBossHp(stage, config)]
  }

  const mobCount = getRegularMobCount(stage, config)
  return Array.from({ length: mobCount }, () => (hp * config.REGULAR_MOB_BASE_COUNT) / mobCount)
}

function bookDamage(book: Spellbook, slotTier: number, state: EngineState, config: SimulationConfig): { readonly state: EngineState; readonly damage: number } {
  const roll = nextRandomState(state.rngState)
  const critChance = Math.min(1, config.BASE_CRIT_CHANCE + config.CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel, config))
  const critical = roll.value < critChance
  const relicEffects = getEquippedRelicEffects(state.relics)
  const critFactor = critical ? config.CRIT_DAMAGE_MULTIPLIER + relicEffects.critDamageBonus : 1
  const damage =
    config.DMG_BASE *
    config.DMG_GROWTH ** book.level *
    getSlotMultiplier(slotTier, config) *
    (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
    getElementDamageMultiplier(book.element, state.relics) *
    getElementProgressionMultiplier(state, book.element) *
    getTomeMilestoneDamageMultiplier(state.highestLevelEver, config) *
    critFactor

  return { state: { ...state, rngState: roll.state }, damage }
}

function shouldCastInnateStaff(previousElapsedMs: number, nextElapsedMs: number): boolean {
  return Math.floor(previousElapsedMs / INNATE_STAFF_INTERVAL_MS) < Math.floor(nextElapsedMs / INNATE_STAFF_INTERVAL_MS)
}

function shouldPetAttack(previousElapsedMs: number, nextElapsedMs: number): boolean {
  return Math.floor(previousElapsedMs / PET_ATTACK_INTERVAL_MS) < Math.floor(nextElapsedMs / PET_ATTACK_INTERVAL_MS)
}

function getTargetsHit(element: Element, enemyCount: number, state: EngineState): number {
  switch (element) {
    case "fire":
      return Math.min(getFireTargetCap(state), enemyCount)
    case "frost":
      return Math.min(1, enemyCount)
    case "holy":
      return Math.min(1, enemyCount)
    default:
      return assertNever(element)
  }
}

function getElementDamage(element: Element, damage: number, wave: number, state: EngineState, config: SimulationConfig): number {
  const buildup = getFrostBuildupMultiplier(state)
  switch (element) {
    case "fire":
      return damage * buildup * getInfernoMultiplier(state)
    case "frost":
      return damage * buildup
    case "holy":
      return wave === config.BOSS_WAVE
        ? damage * buildup * getHolyBossMultiplier(state) * getSanctuaryMultiplier(state)
        : damage * buildup
    default:
      return assertNever(element)
  }
}

function pickElement(value: number): Element {
  if (value < 1 / 3) {
    return "fire"
  }
  if (value < 2 / 3) {
    return "frost"
  }
  return "holy"
}

function getCastIntervalMs(state: EngineState, config: SimulationConfig): number {
  const baseInterval = config.BASE_CAST_INTERVAL_MS - config.CAST_SPEED_REDUCTION_MS * state.skills.castSpeed
  const relicInterval = baseInterval * getEquippedRelicEffects(state.relics).castIntervalMultiplier * getWizardCastIntervalMultiplier(state.wizardLevel, config)
  return applyTraitCastInterval(state, Math.max(config.MIN_CAST_INTERVAL_MS, relicInterval))
}

function getKillReward(state: EngineState, boss: boolean, config: SimulationConfig): number {
  const relicEffects = getEquippedRelicEffects(state.relics)
  const reward = Math.ceil(
    config.GOLD_REWARD_BASE *
      config.GOLD_REWARD_GROWTH ** state.stage *
      (1 + config.GOLD_GAIN_PER_POINT * getTraitSkillGoldPoints(state)) *
      getWizardGoldMultiplier(state.wizardLevel, config) *
      relicEffects.goldMultiplier,
  )
  return boss
    ? Math.ceil(reward * config.BOSS_REWARD_MULTIPLIER * relicEffects.bossGoldMultiplier * getJudgmentGoldMultiplier(state))
    : Math.ceil((reward * config.REGULAR_MOB_BASE_COUNT) / getRegularMobCount(state.stage, config))
}

function getSlotUpgradeCost(currentTier: number, config: SimulationConfig): number {
  return config.SLOT_UPGRADE_COST_BASE * config.SLOT_UPGRADE_COST_GROWTH ** currentTier
}

function getSlotMultiplier(currentTier: number, config: SimulationConfig): number {
  return 1 + config.SLOT_MULTIPLIER_PER_TIER * currentTier
}

function getRegularMobCount(stage: number, config: SimulationConfig): number {
  return Math.min(config.REGULAR_MOB_MAX_COUNT, config.REGULAR_MOB_MIN_COUNT + Math.floor(Math.max(0, stage - 1) / config.REGULAR_MOB_STAGE_BAND))
}

function getBossHp(stage: number, config: SimulationConfig): number {
  return config.BOSS_EXPECTED_DPS_BASE * config.BOSS_EXPECTED_DPS_GROWTH ** stage * (config.BOSS_ENRAGE_MS / 1_000) * getBossFactor(stage, config)
}

function getBossFactor(stage: number, config: SimulationConfig): number {
  if (stage % 10 === 0) {
    return config.BOSS_GATE_FACTOR
  }
  if (stage % 5 === 0) {
    return config.BOSS_WALL_FACTOR
  }
  return config.BOSS_REGULAR_FACTOR
}

function getXpPerKill(state: EngineState, boss: boolean, config: SimulationConfig): number {
  const baseXp = boss ? config.XP_PER_BOSS_KILL : (config.XP_PER_KILL * config.REGULAR_MOB_BASE_COUNT) / getRegularMobCount(state.stage, config)
  return baseXp * getEquippedRelicEffects(state.relics).xpMultiplier
}

function getPetDps(state: EngineState, config: SimulationConfig): number {
  return getWizardTotalDps(state, config) * (PET_BASE_DPS_SHARE + PET_LEVEL_DPS_SHARE * state.pet.level + PET_EVOLUTION_DPS_SHARE * state.pet.evolution)
}

function getWizardTotalDps(state: EngineState, config: SimulationConfig): number {
  const castIntervalSeconds = getCastIntervalMs(state, config) / 1_000
  const equippedDps = C.SLOT_INDEXES.reduce<number>((total, slot) => {
    const book = state.equipped[slot]
    return book === null ? total : total + getExpectedBookDamage(state, book, state.slotTiers[slot], config) / castIntervalSeconds
  }, 0)
  const innateStaffDps = (config.DMG_BASE * 0.6 * (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals)) / (INNATE_STAFF_INTERVAL_MS / 1_000)
  return equippedDps + innateStaffDps
}

function getExpectedBookDamage(state: EngineState, book: Spellbook, slotTier: number, config: SimulationConfig): number {
  const critChance = Math.min(1, config.BASE_CRIT_CHANCE + config.CRIT_CHANCE_PER_POINT * state.skills.critChance + getWizardCritChanceBonus(state.wizardLevel, config))
  const expectedCritFactor = 1 + critChance * (config.CRIT_DAMAGE_MULTIPLIER + getEquippedRelicEffects(state.relics).critDamageBonus - 1)
  const bossElementMultiplier = book.element === "holy" && state.wave === config.BOSS_WAVE ? getHolyBossMultiplier(state) : 1
  return config.DMG_BASE *
    config.DMG_GROWTH ** book.level *
    getSlotMultiplier(slotTier, config) *
    (1 + config.MANA_DAMAGE_PER_CRYSTAL * state.manaCrystals) *
    getElementDamageMultiplier(book.element, state.relics) *
    getElementProgressionMultiplier(state, book.element) *
    getTomeMilestoneDamageMultiplier(state.highestLevelEver, config) *
    bossElementMultiplier *
    expectedCritFactor
}

function getElementProgressionMultiplier(state: EngineState, element: Element): number {
  const codexTiers = state.codex.tiers[element] ?? 0
  return getCodexBonusMultiplier(state, element) * (1 + getTraitCodexBonusPerTier(state) * codexTiers) * getSchoolElementDamageMultiplier(state, element)
}

function getTomeMilestoneDamageMultiplier(highestLevelEver: number, config: SimulationConfig): number {
  const milestones = [10, 20, 30, 40] as const
  return config.TOME_DAMAGE_MILESTONE_MULTIPLIER ** milestones.filter((level) => highestLevelEver >= level).length
}

function getWizardCastIntervalMultiplier(wizardLevel: number, config: SimulationConfig): number {
  return wizardLevel >= config.WIZARD_CAST_MILESTONE_LEVEL ? config.WIZARD_CAST_INTERVAL_MULTIPLIER : 1
}

function getWizardCritChanceBonus(wizardLevel: number, config: SimulationConfig): number {
  return wizardLevel >= config.WIZARD_CRIT_MILESTONE_LEVEL ? config.WIZARD_CRIT_CHANCE_BONUS : 0
}

function getWizardGoldMultiplier(wizardLevel: number, config: SimulationConfig): number {
  return wizardLevel >= config.WIZARD_GOLD_MILESTONE_LEVEL ? config.WIZARD_GOLD_MULTIPLIER : 1
}

function getPrestigeCrystalReward(stage: number, crystalGainMultiplier: number, config: SimulationConfig): number {
  const progress = Math.max(0, stage - config.PRESTIGE_STAGE_OFFSET)
  return Math.floor((progress ** config.PRESTIGE_CRYSTAL_EXPONENT / config.PRESTIGE_CRYSTAL_DIVISOR) * crystalGainMultiplier)
}

function getSummonLevel(highestLevel: number, config: SimulationConfig): number {
  return Math.max(1, highestLevel - config.SUMMON_FLOOR_GAP)
}

function getSummonCost(summonLevel: number, config: SimulationConfig): number {
  return Math.ceil(config.SUMMON_COST_BASE * config.SUMMON_COST_GROWTH ** summonLevel)
}

function getAllBooks(state: EngineState): readonly Spellbook[] {
  return [...state.books, ...state.equipped.filter((book): book is Spellbook => book !== null)]
}

function getHighestBookLevel(state: EngineState): number {
  return getAllBooks(state).reduce((highest, book) => Math.max(highest, book.level), state.highestLevelEver)
}

function emptyEquipment(): EquippedBooks {
  return [null, null, null, null, null, null]
}

function zeroSlots(): SlotTiers & SlotTimers {
  return [0, 0, 0, 0, 0, 0]
}

function formatWall(value: number): string {
  return (Number.isFinite(value) ? value : WALL_STRENGTH_CAP).toFixed(1)
}

function formatMinute(value: number | null): string {
  return value === null ? "-" : `${value}m`
}

function formatOverrideHeader(result: SimulationResult): string {
  const lines = formatOverrideLines(result)
  return lines.length === 0 ? "" : `${lines.join("\n")}\n`
}

function formatOverrideLines(result: SimulationResult): readonly string[] {
  const entries = Object.entries(result.overrides)
  return entries.length === 0 ? [] : [`overrides: ${entries.map(([key, value]) => `${key}=${value}`).join(", ")}`]
}

function parseCliOptions(argv: readonly string[]): CliOptions {
  const rowMinutes = parseOptionalNumberFlag(argv, "--row-minutes")
  const base = {
    minutes: parseNumberFlag(argv, "--minutes", 120),
    summary: argv.includes("--summary"),
    overrides: parseSetOverrides(argv),
  }

  return rowMinutes === undefined ? base : { ...base, rowMinutes }
}

function parseNumberFlag(argv: readonly string[], flag: string, fallback: number): number {
  const flagIndex = argv.findIndex((arg) => arg === flag)
  if (flagIndex === -1) {
    return fallback
  }

  const raw = argv[flagIndex + 1]
  const value = Number(raw)
  if (raw === undefined || !Number.isFinite(value) || value <= 0) {
    throw new CliArgumentError(raw ?? flag)
  }

  return value
}

function parseOptionalNumberFlag(argv: readonly string[], flag: string): number | undefined {
  const flagIndex = argv.findIndex((arg) => arg === flag)
  if (flagIndex === -1) {
    return undefined
  }

  const raw = argv[flagIndex + 1]
  const value = Number(raw)
  if (raw === undefined || !Number.isFinite(value) || value <= 0) {
    throw new CliArgumentError(raw ?? flag)
  }

  return value
}

function parseSetOverrides(argv: readonly string[]): SimulationOverrides {
  let overrides: SimulationOverrides = {}

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--set") {
      continue
    }

    const raw = argv[index + 1]
    if (raw === undefined) {
      throw new CliArgumentError("--set")
    }

    const parsed = parseOverride(raw)
    overrides = { ...overrides, [parsed.key]: parsed.value }
  }

  return overrides
}

function parseOverride(raw: string): { readonly key: SimulationConstantKey; readonly value: number } {
  const separator = raw.indexOf("=")
  if (separator <= 0 || separator === raw.length - 1) {
    throw new CliArgumentError(raw)
  }

  const key = raw.slice(0, separator)
  const value = Number(raw.slice(separator + 1))
  if (!isSimulationConstantKey(key) || !Number.isFinite(value)) {
    throw new CliArgumentError(raw)
  }

  return { key, value }
}

function isSimulationConstantKey(key: string): key is SimulationConstantKey {
  return SIMULATION_CONSTANT_KEYS.some((candidate) => candidate === key)
}

function isCliEntry(argv: readonly string[]): boolean {
  const entry = argv[1]
  return entry !== undefined && (entry.endsWith("simulate.ts") || entry.endsWith("simulate.js"))
}

if (typeof process !== "undefined" && isCliEntry(process.argv)) {
  const options = parseCliOptions(process.argv)
  const simulationOptions = {
    minutes: options.minutes,
    overrides: options.overrides,
  }
  const result = runBalanceSimulation(options.rowMinutes === undefined ? simulationOptions : { ...simulationOptions, rowMinutes: options.rowMinutes })
  process.stdout.write(options.summary ? formatSimulationSummary(result) : formatSimulation(result))
}
