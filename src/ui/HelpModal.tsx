type HelpModalProps = {
  readonly onClose: () => void
  readonly onReplayTutorial: () => void
}

const LOOP_STEPS: readonly string[] = [
  "SUMMON",
  "books AUTO-EQUIP",
  "MERGE same levels (tap-tap)",
  "higher level = more damage",
  "beat the BOSS every 10 waves",
  "REBIRTH at stage 10+ for permanent power",
]

const ELEMENTS: readonly { readonly name: string; readonly desc: string; readonly className: string }[] = [
  { name: "FIRE", desc: "hits 3 enemies", className: "help-el-fire" },
  { name: "FROST", desc: "slows", className: "help-el-frost" },
  { name: "HOLY", desc: "x2 vs bosses", className: "help-el-holy" },
]

/**
 * Always-available "HOW TO PLAY" panel (opened from the HUD ?). One screen: the
 * core loop, the three elements, the offline rule, and a REPLAY TUTORIAL button.
 */
export function HelpModal(props: HelpModalProps) {
  return (
    <div className="modal-shade" onClick={props.onClose}>
      <div
        className="modal help-modal"
        data-testid="help-modal"
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="help-header">
          <h2 className="help-title">HOW TO PLAY</h2>
          <button aria-label="Close" className="help-close" data-testid="help-close" onClick={props.onClose} type="button">
            X
          </button>
        </div>

        <ol className="help-loop">
          {LOOP_STEPS.map((step, index) => (
            <li className="help-loop-step" key={step}>
              <span className="help-loop-num">{index + 1}</span>
              <span className="help-loop-text">{step}</span>
            </li>
          ))}
        </ol>

        <div className="help-section">
          <div className="help-section-title">ELEMENTS</div>
          <ul className="help-elements">
            {ELEMENTS.map((el) => (
              <li className={`help-element ${el.className}`} key={el.name}>
                <strong>{el.name}</strong> {el.desc}
              </li>
            ))}
          </ul>
          <p className="help-note">Merging keeps the element of the TARGET book (the second one you tap).</p>
        </div>

        <div className="help-section">
          <div className="help-section-title">OFFLINE</div>
          <p className="help-note">You earn gold while away (up to 8h).</p>
        </div>

        <button className="btn help-replay" data-testid="help-replay-tutorial" onClick={props.onReplayTutorial} type="button">
          REPLAY TUTORIAL
        </button>
      </div>
    </div>
  )
}
