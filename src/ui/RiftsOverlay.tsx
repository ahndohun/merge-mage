import { useState } from "react"
import { RIFT_DAILY_LIMIT, TRIAL_RIFT_BOSS_MULTIPLIERS } from "../engine/constants"
import type { EngineState, RiftKind } from "../engine/types"
import { formatNumber } from "./formatNumber"
import { useLocale } from "./useLocale"

type RiftsOverlayProps = {
  readonly state: EngineState
  readonly onEnterRift: (kind: RiftKind) => boolean
  readonly onExitRift: () => boolean
}

export function RiftsOverlay(props: RiftsOverlayProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const active = props.state.activeRift
  const goldenLeft = getRunsLeft(props.state.riftRuns.golden)
  const trialLeft = getRunsLeft(props.state.riftRuns.trial)
  const totalLeft = goldenLeft + trialLeft

  if (active !== null) {
    return (
      <div className="rift-hud" data-testid="rift-active-hud">
        <div>
          <span>{active.kind === "golden" ? t("riftGolden") : t("riftTrial")}</span>
          <strong>
            {active.kind === "golden"
              ? t.riftTimer(Math.ceil(active.remainingMs / 1_000))
              : t.riftTrialStep(active.step + 1, TRIAL_RIFT_BOSS_MULTIPLIERS.length)}
          </strong>
        </div>
        <button className="btn btn-mini" data-testid="rift-exit-btn" onClick={props.onExitRift} type="button">
          {t("riftExit")}
        </button>
      </div>
    )
  }

  return (
    <>
      <button className="rift-entry-btn" data-testid="rifts-open-btn" onClick={() => setOpen(true)} type="button">
        {t("rifts")}
        <span>{formatNumber(totalLeft)}</span>
      </button>
      {open ? (
        <div className="modal-shade" role="presentation">
          <div aria-modal="true" className="modal panel rift-modal" role="dialog">
            <div className="panel-header">
              <span>{t("rifts")}</span>
              <strong>{formatNumber(totalLeft)}</strong>
            </div>
            <RiftCard
              description={t("riftGoldenDesc")}
              disabled={goldenLeft < 1}
              label={t("riftGolden")}
              left={t.riftRunsLeft(goldenLeft)}
              onEnter={() => {
                if (props.onEnterRift("golden")) {
                  setOpen(false)
                }
              }}
            />
            <RiftCard
              description={t("riftTrialDesc")}
              disabled={trialLeft < 1}
              label={t("riftTrial")}
              left={t.riftRunsLeft(trialLeft)}
              onEnter={() => {
                if (props.onEnterRift("trial")) {
                  setOpen(false)
                }
              }}
            />
            <button className="btn" data-testid="rifts-close-btn" onClick={() => setOpen(false)} type="button">
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

function RiftCard(props: {
  readonly label: string
  readonly left: string
  readonly description: string
  readonly disabled: boolean
  readonly onEnter: () => void
}) {
  const { t } = useLocale()
  return (
    <div className="rift-card">
      <div>
        <strong>{props.label}</strong>
        <span>{props.left}</span>
        <small>{props.description}</small>
      </div>
      <button className="btn btn-mini" disabled={props.disabled} onClick={props.onEnter} type="button">
        {t("riftEnter")}
      </button>
    </div>
  )
}

function getRunsLeft(used: number): number {
  return Math.max(0, RIFT_DAILY_LIMIT - used)
}
