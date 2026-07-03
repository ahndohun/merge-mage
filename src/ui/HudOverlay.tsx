import { useEffect, useRef, useState } from "react"
import { WIZARD_XP_PER_LEVEL } from "../engine/constants"
import type { EngineState } from "../engine/types"
import { formatNumber } from "./formatNumber"
import { LOCALES } from "./i18n"
import { useLocale } from "./useLocale"
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
  const { locale, setLocaleOverride, t } = useLocale()
  const xpRequired = WIZARD_XP_PER_LEVEL * props.state.wizardLevel
  const xpProgress = Math.min(100, (props.state.wizardXp / xpRequired) * 100)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newGameArmed, setNewGameArmed] = useState(false)
  const disarmTimerRef = useRef<number | null>(null)
  const showCrystals = props.state.prestigeCount > 0 || props.state.manaCrystals > 0

  useEffect(() => {
    return () => {
      if (disarmTimerRef.current !== null) {
        window.clearTimeout(disarmTimerRef.current)
      }
    }
  }, [])

  // The popover must yield the screen the moment attention moves elsewhere:
  // tap anywhere outside it (game canvas included) and it closes.
  useEffect(() => {
    if (!settingsOpen) {
      return
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest(".settings-popover, .settings-btn") !== null) {
        return
      }
      setSettingsOpen(false)
      setNewGameArmed(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [settingsOpen])

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
    <header className={`hud-strip${showCrystals ? " has-crystals" : ""}`} aria-label="Merge Mage HUD">
      <div className="hud-stat">
        <span>{t("gold")}</span>
        <strong>{formatNumber(props.state.gold)}</strong>
      </div>
      <div className="hud-stat">
        <span>{t("stage")}</span>
        <strong>
          {props.state.stage}-{props.state.wave}
        </strong>
      </div>
      {showCrystals ? (
        <div className="hud-stat">
          <span>{t("manaCrystals")}</span>
          <strong>{formatNumber(props.state.manaCrystals)}</strong>
        </div>
      ) : null}
      <div className="hud-stat wizard-stat">
        <span>{t.wizardLevel(props.state.wizardLevel)}</span>
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
          {getSaveIndicatorLabel(props.saveIndicator, t)}
        </div>
        <button
          aria-label={t("howToPlay")}
          className="help-btn"
          data-testid="help-btn"
          onClick={() => {
            setSettingsOpen(false)
            props.onOpenHelp()
          }}
          type="button"
        >
          ?
        </button>
        <button
          aria-controls="settings-popover"
          aria-expanded={settingsOpen}
          aria-label={t("openSettings")}
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
        <div className="settings-popover" id="settings-popover" role="dialog" aria-label={t("settings")}>
            <button
              aria-pressed={!props.muted}
              className={`settings-sound${props.muted ? " is-muted" : ""}`}
              data-testid="settings-sound"
              onClick={props.onToggleMute}
              type="button"
            >
              {t.soundState(props.muted)}
            </button>
            <div className="settings-language" aria-label={t("language")}>
              {LOCALES.map((item) => (
                <button
                  aria-pressed={locale === item}
                  className={`settings-locale${locale === item ? " is-active" : ""}`}
                  data-testid={`settings-locale-${item}`}
                  key={item}
                  onClick={() => setLocaleOverride(item)}
                  type="button"
                >
                  {item === "en" ? "EN" : "한국어"}
                </button>
              ))}
            </div>
            <button
              className={`settings-new-game${newGameArmed ? " is-armed" : ""}`}
              data-testid="settings-new-game"
              onClick={armNewGame}
              type="button"
            >
              {newGameArmed ? t("tapAgainToWipe") : t("newGame")}
            </button>
            <a
              className="settings-credits"
              data-testid="settings-credits"
              href="https://github.com/ahndohun/merge-mage/blob/main/CREDITS.md"
              rel="noreferrer"
              target="_blank"
            >
              {t("credits")}
            </a>
          </div>
      ) : null}
  </>
  )
}

function getSaveIndicatorLabel(state: SaveIndicatorState, t: ReturnType<typeof useLocale>["t"]): string {
  switch (state) {
    case "saved":
      return t("saved")
    case "offline":
      return t("offline")
    case "idle":
      return ""
  }
}
