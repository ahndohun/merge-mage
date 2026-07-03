import { useLocale } from "./useLocale"

export function QuestsPanel() {
  const { t } = useLocale()

  return (
    <section className="panel tab-panel quests-panel" aria-label="Quests">
      <div className="quests-locked" data-testid="quests-locked">
        <span aria-hidden="true" className="quests-lock-icon" />
        <div className="quests-locked-title">{t("tabQuests")}</div>
        <div className="quests-locked-copy">{t("questsComingSoon")}</div>
      </div>
    </section>
  )
}