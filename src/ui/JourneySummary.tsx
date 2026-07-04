import { getVisibleQuests, refreshQuests } from "../engine/quests"
import type { EngineState } from "../engine/types"
import { useLocale } from "./useLocale"

type JourneySummaryProps = {
  readonly state: EngineState
  readonly contextHint: string | null
  readonly onOpenJourney: () => void
}

// Desktop-only (>=1280px) left rail: the player's current goal plus a couple of
// active quests, one click from the full Journey tab. Hidden until journey
// unlocks (highestStage >= 5) — the battle canvas uses the width until then.
export function JourneySummary(props: JourneySummaryProps) {
  const { t } = useLocale()
  const state = refreshQuests(props.state)
  const quests = getVisibleQuests(state)
  const chain = quests.find((q) => q.chainIndex !== null && !state.quests.claimed.includes(q.id)) ?? null
  const oaths = quests.filter((q) => q.chainIndex === null).slice(0, 2)

  return (
    <aside
      aria-label={t("tabJourney")}
      className="journey-summary"
      data-testid="journey-summary"
      onClick={props.onOpenJourney}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          props.onOpenJourney()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="journey-summary-head">{t("nextGoal")}</div>
      {props.contextHint !== null ? <div className="journey-summary-hint">{props.contextHint}</div> : null}
      {chain !== null ? (
        <article className="journey-summary-quest is-chain">
          <strong>{t.questTitle(chain.id)}</strong>
          <span>{t.questDescription(chain.id)}</span>
        </article>
      ) : null}
      {oaths.map((quest) => (
        <article className="journey-summary-quest" key={quest.id}>
          <strong>{t.questTitle(quest.id)}</strong>
          <span>{t.questDescription(quest.id)}</span>
        </article>
      ))}
      <div className="journey-summary-more">{t("tabJourney")} →</div>
    </aside>
  )
}
