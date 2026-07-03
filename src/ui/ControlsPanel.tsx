import { formatNumber } from "./formatNumber"
import { useLocale } from "./useLocale"

type ControlsPanelProps = {
  readonly summonLevel: number
  readonly summonCost: number
  readonly canSummon: boolean
  readonly onSummon: () => void
}

export function ControlsPanel(props: ControlsPanelProps) {
  const { t } = useLocale()

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
        {t.summonButton(props.summonLevel, formatNumber(props.summonCost))}
      </button>
    </section>
  )
}
