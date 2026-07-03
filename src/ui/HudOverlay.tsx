import { useEffect, useRef, useState } from "react"
import { WIZARD_XP_PER_LEVEL } from "../engine/constants"
import type { EngineState } from "../engine/types"
import { formatNumber } from "./formatNumber"
import type { SaveIndicatorState } from "./useSaveIndicator"

type HudOverlayProps = {
  readonly state: EngineState
  readonly muted: boolean
  readonly onToggleMute: () => void
  readonly onNewGame: () => void
  readonly onOpenHelp: () => void
  readonly saveIndicator: SaveIndicatorState
}

export function HudOverlay(props: HudOverlayProps) {
  const xpRequired = WIZARD_XP_PER_LEVEL * props.state.wizardLevel
  const xpProgress = Math.min(100, (props.state.wizardXp / xpRequired) * 100)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newGameArmed, setNewGameArmed] = useState(false)
  const disarmTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (disarmTimerRef.current !== null) {
        window.clearTimeout(disarmTimerRef.current)
      }
    }
  }, [])

  const armNewGame = () => {
    if (newGameArmed) {
      props.onNewGame()
      return
    }

    setNewGameArmed(true)
    if (disarmTimerRef.current !== null) {
      window.clearTimeout(disarmTimerRef.current)
    }
    disarmTimerRef.current = window.setTimeout(() => {
      disarmTimerRef.current = null
      setNewGameArmed(false)
    }, 3_000)
  }

  return (
    <>
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
      <div className="hud-actions">
        <div
          aria-live="polite"
          className={`save-chip is-${props.saveIndicator}`}
          data-testid="save-indicator"
        >
          {getSaveIndicatorLabel(props.saveIndicator)}
        </div>
        <button
          aria-label="How to play"
          className="help-btn"
          data-testid="help-btn"
          onClick={props.onOpenHelp}
          type="button"
        >
          ?
        </button>
        <button
          aria-controls="settings-popover"
          aria-expanded={settingsOpen}
          aria-label="Open settings"
          className="settings-btn"
          data-testid="settings-btn"
          onClick={() => setSettingsOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true" className="settings-glyph" />
        </button>
      </div>
    </header>
      {settingsOpen ? (
        <div className="settings-popover" id="settings-popover" role="dialog" aria-label="Settings">
            <button
              aria-pressed={!props.muted}
              className={`settings-sound${props.muted ? " is-muted" : ""}`}
              data-testid="settings-sound"
              onClick={props.onToggleMute}
              type="button"
            >
              SOUND {props.muted ? "OFF" : "ON"}
            </button>
            <button
              className={`settings-new-game${newGameArmed ? " is-armed" : ""}`}
              data-testid="settings-new-game"
              onClick={armNewGame}
              type="button"
            >
              {newGameArmed ? "TAP AGAIN TO WIPE" : "NEW GAME"}
            </button>
            <a
              className="settings-credits"
              data-testid="settings-credits"
              href="https://github.com/ahndohun/merge-mage/blob/main/CREDITS.md"
              rel="noreferrer"
              target="_blank"
            >
              Credits
            </a>
          </div>
      ) : null}
  </>
  )
}

function getSaveIndicatorLabel(state: SaveIndicatorState): string {
  switch (state) {
    case "saved":
      return "SAVED"
    case "offline":
      return "OFFLINE"
    case "idle":
      return ""
  }
}
