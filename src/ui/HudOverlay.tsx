import { WIZARD_XP_PER_LEVEL } from "../engine/constants"
import type { EngineState } from "../engine/types"
import { formatNumber } from "./formatNumber"

type HudOverlayProps = {
  readonly state: EngineState
  readonly muted: boolean
  readonly onToggleMute: () => void
}

export function HudOverlay(props: HudOverlayProps) {
  const xpRequired = WIZARD_XP_PER_LEVEL * props.state.wizardLevel
  const xpProgress = Math.min(100, (props.state.wizardXp / xpRequired) * 100)

  return (
    <header className="hud-strip" aria-label="Merge Mage HUD">
      <div className="hud-stat">
        <span>GOLD</span>
        <strong>{formatNumber(props.state.gold)}</strong>
      </div>
      <div className="hud-stat">
        <span>STAGE</span>
        <strong>
          {props.state.stage}-{props.state.wave}
        </strong>
      </div>
      <div className="hud-stat">
        <span>MANA</span>
        <strong>{formatNumber(props.state.manaCrystals)}</strong>
      </div>
      <div className="hud-stat wizard-stat">
        <span>WIZARD {props.state.wizardLevel}</span>
        <div className="xp-bar" aria-label="Wizard XP">
          <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>
      <button
        aria-label={props.muted ? "Unmute sound" : "Mute sound"}
        aria-pressed={props.muted}
        className={`hud-mute-btn${props.muted ? " is-muted" : ""}`}
        data-testid="mute-toggle"
        onClick={props.onToggleMute}
        type="button"
      >
        {props.muted ? "SND OFF" : "SND ON"}
      </button>
    </header>
  )
}
