import type { EngineState } from "./types.js"

export type UnlockedFeatures = {
  readonly books: boolean
  readonly skills: boolean
  readonly quests: boolean
  readonly rifts: boolean
  readonly rebirth: boolean
  readonly camp: boolean
}

export type UnlockFeatureId = keyof UnlockedFeatures

export const UNLOCK_FEATURE_IDS: readonly UnlockFeatureId[] = ["books", "skills", "quests", "rifts", "rebirth", "camp"] as const

export function getUnlockedFeatures(state: EngineState): UnlockedFeatures {
  return {
    books: true,
    skills: state.wizardLevel >= 3,
    quests: state.highestStage >= 5,
    rifts: state.highestStage >= 7,
    rebirth: state.highestStage >= 10,
    camp: state.prestigeCount >= 1,
  }
}
