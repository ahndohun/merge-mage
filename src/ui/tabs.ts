import { getUnlockedFeatures, type UnlockFeatureId } from "../engine/unlocks"
import type { EngineState } from "../engine/types"
import type { MessageKey } from "./i18n"
import type { BadgeFlags } from "./useBadges"

export type TabId = "books" | "wizard" | "journey" | "camp" | "rebirth"

export type TabDefinition = {
  readonly id: TabId
  readonly labelKey: MessageKey
  readonly testId: string
  readonly feature: UnlockFeatureId
}

export const TABS: readonly TabDefinition[] = [
  { id: "books", labelKey: "tabBooks", testId: "tab-books", feature: "books" },
  { id: "wizard", labelKey: "tabWizard", testId: "tab-wizard", feature: "wizard" },
  { id: "journey", labelKey: "tabJourney", testId: "tab-journey", feature: "journey" },
  { id: "camp", labelKey: "tabCamp", testId: "tab-camp", feature: "camp" },
  { id: "rebirth", labelKey: "tabRebirth", testId: "tab-rebirth", feature: "rebirth" },
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
    case "wizard":
      return badges.wizard
    case "journey":
      return badges.journey
    case "camp":
      return badges.camp
    case "rebirth":
      return badges.rebirth
  }
}

export function getVisibleTabDotCount(state: EngineState, badges: BadgeFlags): number {
  return getVisibleTabs(state).filter((tab) => tabShowsDot(tab.id, state, badges)).length
}
