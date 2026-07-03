import { getUnlockedFeatures, type UnlockFeatureId } from "../engine/unlocks"
import type { EngineState } from "../engine/types"
import type { MessageKey } from "./i18n"
import type { BadgeFlags } from "./useBadges"

export type TabId = "books" | "skills" | "quests" | "camp" | "rebirth" | "ranks"

export type TabDefinition = {
  readonly id: TabId
  readonly labelKey: MessageKey
  readonly testId: string
  readonly feature: UnlockFeatureId
}

export const TABS: readonly TabDefinition[] = [
  { id: "books", labelKey: "tabBooks", testId: "tab-books", feature: "books" },
  { id: "skills", labelKey: "tabSkills", testId: "tab-skills", feature: "skills" },
  { id: "quests", labelKey: "tabQuests", testId: "tab-quests", feature: "quests" },
  { id: "camp", labelKey: "tabCamp", testId: "tab-camp", feature: "camp" },
  { id: "rebirth", labelKey: "tabRebirth", testId: "tab-rebirth", feature: "rebirth" },
  { id: "ranks", labelKey: "tabRanks", testId: "tab-ranks", feature: "rebirth" },
] as const

export function getVisibleTabs(state: EngineState): readonly TabDefinition[] {
  const unlocked = getUnlockedFeatures(state)
  return TABS.filter((tab) => unlocked[tab.feature])
}

export function tabShowsDot(tabId: TabId, state: EngineState, badges: BadgeFlags): boolean {
  if (!getVisibleTabs(state).some((tab) => tab.id === tabId)) {
    return false
  }

  switch (tabId) {
    case "books":
      return false
    case "skills":
      return badges.skills
    case "quests":
      return badges.quests
    case "camp":
      return badges.camp
    case "rebirth":
      return badges.rebirth
    case "ranks":
      return false
  }
}

export function getVisibleTabDotCount(state: EngineState, badges: BadgeFlags): number {
  return getVisibleTabs(state).filter((tab) => tabShowsDot(tab.id, state, badges)).length
}
