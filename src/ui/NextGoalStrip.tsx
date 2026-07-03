import { useLocale } from "./useLocale"

type NextGoalStripProps = {
  readonly hint: string | null
}

export function NextGoalStrip(props: NextGoalStripProps) {
  const { t } = useLocale()

  if (props.hint === null) {
    return null
  }

  return (
    <div className="next-goal-strip" data-testid="next-goal-strip">
      <span className="next-goal-label">{t("nextGoal")}</span>
      <span className="next-goal-text">{props.hint}</span>
      <span aria-hidden="true" className="next-goal-arrow" />
    </div>
  )
}