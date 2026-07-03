import type { LeaderboardEntry } from "./apiClient"
import type { Translator } from "./i18n"
import { useLocale } from "./useLocale"
import type { LeaderboardStatus } from "./useEngine"

type RanksPanelProps = {
  readonly status: LeaderboardStatus
  readonly entries: readonly LeaderboardEntry[]
  readonly nickname: string
  readonly nicknameSaved: boolean
  readonly onNickname: (nickname: string) => void
  readonly onSubmit: () => void
  readonly onRefresh: () => void
}

export function RanksPanel(props: RanksPanelProps) {
  const { t } = useLocale()

  return (
    <section className="panel tab-panel ranks-panel" aria-label="Ranks">
      <div className="nickname-row">
        <input
          className="input"
          data-testid="nickname-input"
          maxLength={18}
          onChange={(event) => props.onNickname(event.currentTarget.value)}
          value={props.nickname}
        />
        <button className="btn btn-mini" data-testid="nickname-save" onClick={props.onSubmit} type="button">
          {t("save")}
        </button>
        <button className="btn btn-mini" data-testid="leaderboard-refresh" onClick={props.onRefresh} type="button">
          {t("refreshShort")}
        </button>
      </div>
      {props.nicknameSaved ? (
        <div aria-live="polite" className="nickname-saved" data-testid="nickname-saved">
          {t("saved")} ✓
        </div>
      ) : null}
      <div className="leaderboard" data-status={props.status}>
        {renderStatus(props.status, props.entries, t)}
      </div>
    </section>
  )
}

function renderStatus(status: LeaderboardStatus, entries: readonly LeaderboardEntry[], t: Translator) {
  if (status === "loading") {
    return <div className="rank-empty">{t("ranksLoading")}</div>
  }

  if (status === "unavailable") {
    return <div className="rank-empty">{t("ranksOffline")}</div>
  }

  if (status === "error") {
    return <div className="rank-empty">{t("ranksError")}</div>
  }

  if (entries.length === 0) {
    return <div className="rank-empty">{t("noRanksYet")}</div>
  }

  return entries.map((entry) => (
    <div className="rank-row" data-testid={`rank-row-${entry.rank}`} key={`${entry.rank}-${entry.nickname}`}>
      <span>{entry.rank}</span>
      <strong>{entry.nickname}</strong>
      <span>{t.rankStage(entry.stage)}</span>
    </div>
  ))
}
