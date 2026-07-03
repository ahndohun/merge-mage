export const SUMMON_FLOOR_GAP = 8
export const SUMMON_COST_BASE = 20
export const SUMMON_COST_GROWTH = 1.34
export const DMG_BASE = 5
export const DMG_GROWTH = 1.35
export const HP_BASE = 10
export const HP_GROWTH = 1.43
export const INITIAL_GOLD = 100
export const INITIAL_STAGE = 1
export const INITIAL_WAVE = 1
export const INITIAL_HIGHEST_LEVEL = 1
export const INVENTORY_LIMIT = 15
export const EQUIPMENT_SLOT_COUNT = 6
export const SLOT_INDEXES = [0, 1, 2, 3, 4, 5] as const
export const SLOT_UPGRADE_COST_BASE = 50
export const SLOT_UPGRADE_COST_GROWTH = 1.6
export const SLOT_MULTIPLIER_PER_TIER = 0.15
export const TICK_MS = 100
export const BASE_CAST_INTERVAL_MS = 1_000
export const CAST_SPEED_REDUCTION_MS = 40
export const MIN_CAST_INTERVAL_MS = 300
// Wave C: regular waves use 6-9 visible mobs, while balance helpers keep
// regular-wave HP/reward totals anchored to the original five-mob budget.
export const REGULAR_MOB_BASE_COUNT = 5
export const REGULAR_MOB_MIN_COUNT = 6
export const REGULAR_MOB_MAX_COUNT = 9
export const REGULAR_MOB_STAGE_BAND = 20
export const BOSS_WAVE = 10
// Wave C boss HP is expected-DPS based: expectedDps(stage) * 30s * factor.
export const BOSS_EXPECTED_DPS_BASE = 9
export const BOSS_EXPECTED_DPS_GROWTH = 1.49
export const BOSS_REGULAR_FACTOR = 1
export const BOSS_WALL_FACTOR = 1.5
export const BOSS_GATE_FACTOR = 2.2
export const BOSS_ENRAGE_MS = 30_000
export const FIRE_TARGET_CAP = 3
export const FROST_SLOW_MS = 2_000
export const FROST_SLOW_FACTOR = 0.2
export const BASE_CRIT_CHANCE = 0.05
export const CRIT_CHANCE_PER_POINT = 0.01
export const CRIT_DAMAGE_MULTIPLIER = 2
export const MANA_DAMAGE_PER_CRYSTAL = 0.08
export const GOLD_REWARD_BASE = 2
export const GOLD_REWARD_GROWTH = 1.3
export const GOLD_GAIN_PER_POINT = 0.1
export const BOSS_REWARD_MULTIPLIER = 15
export const WIZARD_XP_PER_LEVEL = 20
// Wave C permanent wizard milestones: Lv10 cast -5%, Lv20 crit +3%p,
// Lv30 gold +10%. They are derived from retained wizard level.
export const WIZARD_CAST_MILESTONE_LEVEL = 10
export const WIZARD_CAST_INTERVAL_MULTIPLIER = 0.95
export const WIZARD_CRIT_MILESTONE_LEVEL = 20
export const WIZARD_CRIT_CHANCE_BONUS = 0.03
export const WIZARD_GOLD_MILESTONE_LEVEL = 30
export const WIZARD_GOLD_MULTIPLIER = 1.1
// Wave C tome tier milestones are current-run firepower jumps.
export const TOME_DAMAGE_MILESTONES = [10, 20, 30, 40] as const
export const TOME_DAMAGE_MILESTONE_MULTIPLIER = 2
// First useful rebirth should appear around st14-16: floor((stage-8)^1.7/6).
export const PRESTIGE_STAGE_OFFSET = 8
export const PRESTIGE_CRYSTAL_EXPONENT = 1.7
export const PRESTIGE_CRYSTAL_DIVISOR = 6
export const OFFLINE_CAP_MS = 8 * 60 * 60 * 1_000
export const OFFLINE_EFFICIENCY = 0.6
export const XP_PER_KILL = 1
export const XP_PER_BOSS_KILL = 15
export const RELIC_SUMMON_COST = 10
export const RELIC_LEVEL_CAP = 10
export const RELIC_SLOT_COUNT = 3
export const GOLDEN_RIFT_MS = 180_000
export const RIFT_DAILY_LIMIT = 2
export const GOLDEN_RIFT_REWARD_MULTIPLIER = 2.5
export const TRIAL_RIFT_BOSS_MULTIPLIERS = [0.8, 1, 1.3, 1.7, 2.2] as const
