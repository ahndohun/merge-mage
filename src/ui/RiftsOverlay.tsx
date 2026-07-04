import { useEffect, useRef, useState } from "react"
import { RIFT_DAILY_LIMIT, TRIAL_RIFT_BOSS_MULTIPLIERS } from "../engine/constants"
import type { EngineState, RiftKind } from "../engine/types"
import { formatNumber } from "./formatNumber"
import { useLocale } from "./useLocale"

// Brief warp flash shown while stepping through the portal — long enough to
// read as a transition, short enough to never block input on the next screen.
const WARP_FLASH_MS = 320

type RiftsOverlayProps = {
  readonly state: EngineState
  /** True for a short window right after rifts unlock — plays the portal's one-time appearance animation. */
  readonly justAppeared: boolean
  readonly onEnterRift: (kind: RiftKind) => boolean
  readonly onExitRift: () => boolean
  /** Tapped the portal while it has zero runs left today (closed state). */
  readonly onClosedTap: () => void
}

export function RiftsOverlay(props: RiftsOverlayProps) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const [warpKind, setWarpKind] = useState<RiftKind | null>(null)
  const warpTimeoutRef = useRef<number | null>(null)
  const active = props.state.activeRift
  const goldenLeft = getRunsLeft(props.state.riftRuns.golden)
  const trialLeft = getRunsLeft(props.state.riftRuns.trial)
  const totalLeft = goldenLeft + trialLeft
  const closed = totalLeft < 1

  useEffect(() => {
    return () => {
      if (warpTimeoutRef.current !== null) {
        window.clearTimeout(warpTimeoutRef.current)
      }
    }
  }, [])

  const handleEnter = (kind: RiftKind) => {
    if (!props.onEnterRift(kind)) {
      return
    }
    setOpen(false)
    setWarpKind(kind)
    if (warpTimeoutRef.current !== null) {
      window.clearTimeout(warpTimeoutRef.current)
    }
    warpTimeoutRef.current = window.setTimeout(() => setWarpKind(null), WARP_FLASH_MS)
  }

  const handlePortalTap = () => {
    if (closed) {
      props.onClosedTap()
      return
    }
    setOpen(true)
  }

  return (
    <>
      {warpKind !== null ? (
        <div aria-hidden="true" className={`rift-warp-flash rift-warp-${warpKind}`} data-testid="rift-warp-flash" />
      ) : null}
      {active !== null ? (
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
      ) : (
        <>
          <button
            aria-disabled={closed}
            className={`rift-portal-btn${closed ? " is-closed" : ""}${props.justAppeared ? " is-appearing" : ""}`}
            data-testid="rifts-open-btn"
            onClick={handlePortalTap}
            type="button"
          >
            <span className="rift-portal-label">{t("rifts")}</span>
            <span className="rift-portal-count">{formatNumber(totalLeft)}</span>
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
                  onEnter={() => handleEnter("golden")}
                />
                <RiftCard
                  description={t("riftTrialDesc")}
                  disabled={trialLeft < 1}
                  label={t("riftTrial")}
                  left={t.riftRunsLeft(trialLeft)}
                  onEnter={() => handleEnter("trial")}
                />
                <button className="btn" data-testid="rifts-close-btn" onClick={() => setOpen(false)} type="button">
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
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
