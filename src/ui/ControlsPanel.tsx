import { formatNumber } from "./formatNumber"

type ControlsPanelProps = {
  readonly summonLevel: number
  readonly summonCost: number
  readonly canSummon: boolean
  readonly autoMerge: boolean
  readonly autoBuy: boolean
  readonly onSummon: () => void
  readonly onAutoMerge: (enabled: boolean) => void
  readonly onAutoBuy: (enabled: boolean) => void
}

export function ControlsPanel(props: ControlsPanelProps) {
  return (
    <section className="panel controls-panel" aria-label="Controls">
      {/* aria-disabled (not disabled) so a blocked summon still fires onClick —
          GameShell shakes the button and explains why (e.g. not enough gold). */}
      <button
        aria-disabled={!props.canSummon}
        className={`btn btn-summon${props.canSummon ? "" : " is-blocked"}`}
        data-testid="summon-btn"
        onClick={props.onSummon}
        type="button"
      >
        SUMMON L{props.summonLevel} {formatNumber(props.summonCost)}
      </button>
      <button
        aria-pressed={props.autoMerge}
        className={`btn toggle${props.autoMerge ? " is-on" : ""}`}
        data-testid="auto-merge-toggle"
        onClick={() => props.onAutoMerge(!props.autoMerge)}
        type="button"
      >
        AUTO MERGE
      </button>
      <button
        aria-pressed={props.autoBuy}
        className={`btn toggle${props.autoBuy ? " is-on" : ""}`}
        data-testid="auto-buy-toggle"
        onClick={() => props.onAutoBuy(!props.autoBuy)}
        type="button"
      >
        AUTO BUY
      </button>
    </section>
  )
}
