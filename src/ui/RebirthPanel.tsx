import { useState } from "react"
import type { EngineState } from "../engine/types"

type RebirthPanelProps = {
  readonly state: EngineState
  readonly onPrestige: () => void
}

export function RebirthPanel(props: RebirthPanelProps) {
  const [confirming, setConfirming] = useState(false)
  const preview = Math.floor(props.state.stage ** 1.5 / 10)
  const ready = props.state.stage >= 10

  return (
    <section className="panel tab-panel rebirth-panel" aria-label="Rebirth">
      <div className="panel-header">
        <span>ARCANE REBIRTH</span>
        <strong>{preview} MC</strong>
      </div>
      <div className="rebirth-readout">
        <span>STAGE</span>
        <strong>{props.state.stage}</strong>
        <span>MANA CRYSTALS</span>
        <strong>{props.state.manaCrystals}</strong>
      </div>
      <button className="btn btn-wide" data-testid="prestige-open" disabled={!ready} onClick={() => setConfirming(true)} type="button">
        REBIRTH
      </button>
      {ready ? null : <div className="empty-copy rebirth-lock-copy">Unlocks at stage 10 (now: {props.state.stage})</div>}
      {confirming ? (
        <div className="modal-shade" role="presentation">
          <div aria-modal="true" className="modal panel" role="dialog">
            <div className="panel-header">
              <span>CONFIRM</span>
              <strong>+{preview} MC</strong>
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
                CONFIRM
              </button>
              <button className="btn" data-testid="prestige-cancel" onClick={() => setConfirming(false)} type="button">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
