import type { LeaderboardEntry } from "./apiClient"
import type { LeaderboardStatus } from "./useEngine"

type RanksPanelProps = {
  readonly status: LeaderboardStatus
  readonly entries: readonly LeaderboardEntry[]
  readonly nickname: string
  readonly onNickname: (nickname: string) => void
  readonly onSubmit: () => void
  readonly onRefresh: () => void
}

export function RanksPanel(props: RanksPanelProps) {
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
          SAVE
        </button>
        <button className="btn btn-mini" data-testid="leaderboard-refresh" onClick={props.onRefresh} type="button">
          R
        </button>
      </div>
      <div className="leaderboard" data-status={props.status}>
        {renderStatus(props.status, props.entries)}
      </div>
    </section>
  )
}

function renderStatus(status: LeaderboardStatus, entries: readonly LeaderboardEntry[]) {
  if (status === "loading") {
    return <div className="rank-empty">LOADING</div>
  }

  if (status === "unavailable") {
    return <div className="rank-empty">RANKS OFFLINE</div>
  }

  if (status === "error") {
    return <div className="rank-empty">RANKS ERROR</div>
  }

  if (entries.length === 0) {
    return <div className="rank-empty">No ranks yet — set a nickname and be first</div>
  }

  return entries.map((entry) => (
    <div className="rank-row" data-testid={`rank-row-${entry.rank}`} key={`${entry.rank}-${entry.nickname}`}>
      <span>{entry.rank}</span>
      <strong>{entry.nickname}</strong>
      <span>ST {entry.stage}</span>
    </div>
  ))
}
