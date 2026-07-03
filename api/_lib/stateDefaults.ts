type QuestDefault = { completed: string[]; claimed: string[] }
type AchievementDefault = { counters: Record<string, number>; claimed: string[] }
type CodexDefault = { tiers: Record<string, number> }
type TraitDefault = { picks: Record<string, string> }
type RelicDefault = { owned: Record<string, number>; equipped: [string | null, string | null, string | null] }
type RiftRunsDefault = { date: string; golden: number; trial: number }
type PetDefault = { level: number; xp: number; evolution: number }
type MineDefault = { floor: number; lastClaimAt: number | null }
type DailyMissionDefault = { date: string; progress: Record<string, number>; claimed: string[] }
type SkinDefault = { owned: string[]; equipped: string | null }

export function defaultQuestState(): QuestDefault {
  return { completed: [], claimed: [] }
}

export function defaultAchievementState(): AchievementDefault {
  return { counters: {}, claimed: [] }
}

export function defaultCodexState(): CodexDefault {
  return { tiers: {} }
}

export function defaultTraitState(): TraitDefault {
  return { picks: {} }
}

export function defaultRelicState(): RelicDefault {
  return { owned: {}, equipped: [null, null, null] }
}

export function defaultRiftRunsState(): RiftRunsDefault {
  return { date: "", golden: 0, trial: 0 }
}

export function defaultPetState(): PetDefault {
  return { level: 1, xp: 0, evolution: 0 }
}

export function defaultMineState(): MineDefault {
  return { floor: 1, lastClaimAt: null }
}

export function defaultDailyMissionState(): DailyMissionDefault {
  return { date: "", progress: {}, claimed: [] }
}

export function defaultSkinState(): SkinDefault {
  return { owned: ["apprentice"], equipped: "apprentice" }
}
