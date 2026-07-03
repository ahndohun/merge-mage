import { useState } from "react"
import { MANA_DAMAGE_PER_CRYSTAL } from "../engine/constants"
import type { EngineState } from "../engine/types"
import { useBadges } from "./useBadges"
import { useLocale } from "./useLocale"

type RebirthPanelProps = {
  readonly state: EngineState
  readonly onPrestige: () => void
}

export function RebirthPanel(props: RebirthPanelProps) {
  const { t } = useLocale()
  const badges = useBadges(props.state)
  const [confirming, setConfirming] = useState(false)
  const preview = Math.floor(props.state.stage ** 1.5 / 10)
  const ready = props.state.stage >= 10

  return (
    <section className="panel tab-panel rebirth-panel" aria-label="Rebirth">
      <div className="panel-header">
        <span>{t("arcaneRebirth")}</span>
        <strong>{t.rebirthPreview(preview)}</strong>
      </div>
      <div className="rebirth-readout">
        <span>{t("stage")}</span>
        <strong>{props.state.stage}</strong>
        <span>{t("manaCrystals")}</span>
        <strong>{props.state.manaCrystals}</strong>
      </div>
      <div className="rebirth-terms" data-testid="rebirth-terms">
        <div>{t("rebirthKeep")}</div>
        <div>{t("rebirthReset")}</div>
        <div className="rebirth-terms-gain">{t.rebirthGain(preview, Math.round(MANA_DAMAGE_PER_CRYSTAL * 100))}</div>
      </div>
      <button className="btn btn-wide" data-testid="prestige-open" disabled={!ready} onClick={() => setConfirming(true)} type="button">
        {t("rebirth")}
        {badges.rebirth ? <span aria-hidden="true" className="badge-dot" /> : null}
      </button>
      {ready ? null : <div className="empty-copy rebirth-lock-copy">{t.rebirthUnlock(props.state.stage)}</div>}
      {confirming ? (
        <div className="modal-shade" role="presentation">
          <div aria-modal="true" className="modal panel" role="dialog">
            <div className="panel-header">
              <span>{t("confirm")}</span>
              <strong>+{t.rebirthPreview(preview)}</strong>
            </div>
            <div className="modal-actions">
              <button
                className="btn"
                data-testid="prestige-confirm"
                onClick={() => {
                  props.onPrestige()
                  setConfirming(false)
                }}
                type="button"
              >
                {t("confirm")}
              </button>
              <button className="btn" data-testid="prestige-cancel" onClick={() => setConfirming(false)} type="button">
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
