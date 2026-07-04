import type { LeaderboardEntry } from "./apiClient"
import { RanksPanel } from "./RanksPanel"
import type { LeaderboardStatus } from "./useEngine"
import { useLocale } from "./useLocale"

type RanksModalProps = {
  readonly onClose: () => void
  readonly status: LeaderboardStatus
  readonly entries: readonly LeaderboardEntry[]
  readonly nickname: string
  readonly nicknameSaved: boolean
  readonly onNickname: (nickname: string) => void
  readonly onSubmit: () => void
  readonly onRefresh: () => void
}

// R3 IA: the leaderboard left the tab bar. It opens from the HUD trophy button
// (revealed at the rebirth unlock) as a modal so the tab row stays at five.
export function RanksModal(props: RanksModalProps) {
  const { t } = useLocale()

  return (
    <div className="modal-shade" onClick={props.onClose}>
      <div
        className="modal ranks-modal"
        data-testid="ranks-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("tabRanks")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="help-header">
          <h2 className="help-title">{t("tabRanks")}</h2>
          <button aria-label={t("close")} className="help-close" data-testid="ranks-close" onClick={props.onClose} type="button">
            X
          </button>
        </div>
        <RanksPanel
          entries={props.entries}
          nickname={props.nickname}
          nicknameSaved={props.nicknameSaved}
          onNickname={props.onNickname}
          onRefresh={props.onRefresh}
          onSubmit={props.onSubmit}
          status={props.status}
        />
      </div>
    </div>
  )
}
