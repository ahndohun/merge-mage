import type { MessageKey } from "./i18n"
import { useLocale } from "./useLocale"

type HelpModalProps = {
  readonly onClose: () => void
  readonly onReplayTutorial: () => void
}

const LOOP_STEPS: readonly MessageKey[] = [
  "helpLoopSummon",
  "helpLoopAutoEquip",
  "helpLoopMerge",
  "helpLoopDamage",
  "helpLoopBoss",
  "helpLoopRebirth",
]

const ELEMENTS: readonly { readonly nameKey: MessageKey; readonly descKey: MessageKey; readonly className: string }[] = [
  { nameKey: "fire", descKey: "fireDesc", className: "help-el-fire" },
  { nameKey: "frost", descKey: "frostDesc", className: "help-el-frost" },
  { nameKey: "holy", descKey: "holyDesc", className: "help-el-holy" },
]

/**
 * Always-available "HOW TO PLAY" panel (opened from the HUD ?). One screen: the
 * core loop, the three elements, the offline rule, and a REPLAY TUTORIAL button.
 */
export function HelpModal(props: HelpModalProps) {
  const { t } = useLocale()

  return (
    <div className="modal-shade" onClick={props.onClose}>
      <div
        className="modal help-modal"
        data-testid="help-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("howToPlay")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="help-header">
          <h2 className="help-title">{t("howToPlay")}</h2>
          <button aria-label={t("close")} className="help-close" data-testid="help-close" onClick={props.onClose} type="button">
            X
          </button>
        </div>

        <ol className="help-loop">
          {LOOP_STEPS.map((stepKey, index) => (
            <li className="help-loop-step" key={stepKey}>
              <span className="help-loop-num">{index + 1}</span>
              <span className="help-loop-text">{t(stepKey)}</span>
            </li>
          ))}
        </ol>

        <div className="help-section">
          <div className="help-section-title">{t("elements")}</div>
          <ul className="help-elements">
            {ELEMENTS.map((el) => (
              <li className={`help-element ${el.className}`} key={el.nameKey}>
                <strong>{t(el.nameKey)}</strong> {t(el.descKey)}
              </li>
            ))}
          </ul>
          <p className="help-note">{t("helpMergeTargetNote")}</p>
        </div>

        <div className="help-section">
          <div className="help-section-title">{t("offline")}</div>
          <p className="help-note">{t("helpOfflineNote")}</p>
        </div>

        <button className="btn help-replay" data-testid="help-replay-tutorial" onClick={props.onReplayTutorial} type="button">
          {t("replayTutorial")}
        </button>
      </div>
    </div>
  )
}
