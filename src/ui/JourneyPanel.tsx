import { ACHIEVEMENTS, getAchievementProgress, isAchievementUnlocked } from "../engine/achievements"
import { DAILY_MISSIONS, getDailyMissionStatus, type DailyMissionId } from "../engine/camp"
import { getVisibleQuests, refreshQuests } from "../engine/quests"
import type { EngineState } from "../engine/types"
import { formatNumber } from "./formatNumber"
import type { MessageKey, Translator } from "./i18n"
import { useLocale } from "./useLocale"

type JourneyPanelProps = {
  readonly state: EngineState
  readonly onClaimQuest: (questId: string) => boolean
  readonly onClaimDailyMission: (missionId: DailyMissionId) => boolean
}

const missionLabelKeys: Record<DailyMissionId, MessageKey> = {
  merge20: "missionMerge20",
  boss3: "missionBoss3",
  summon30: "missionSummon30",
  mineClaim1: "missionMineClaim1",
  stage3: "missionStage3",
}

// The Journey tab is the player's roadmap: the main chain, long oaths, daily
// missions (moved here from Camp), and achievements. The NEXT GOAL strip opens
// this tab.
export function JourneyPanel(props: JourneyPanelProps) {
  const { t } = useLocale()
  const now = new Date()
  const state = refreshQuests(props.state)
  const quests = getVisibleQuests(state)
  const chainQuest = quests.find((quest) => quest.chainIndex !== null && !state.quests.claimed.includes(quest.id)) ?? null
  const longQuests = quests.filter((quest) => quest.chainIndex === null)

  return (
    <section className="panel tab-panel journey-panel" aria-label="Journey">
      <div className="panel-header">
        <span>{t("mainQuest")}</span>
        <strong>{state.quests.claimed.filter((id) => id.startsWith("chain-")).length}/20</strong>
      </div>
      {chainQuest === null ? null : (
        <QuestCard questId={chainQuest.id} state={state} t={t} featured onClaimQuest={props.onClaimQuest} />
      )}
      <div className="quest-list" aria-label="Long quests">
        <div className="quest-section-label">{t("longQuest")}</div>
        {longQuests.map((quest) => (
          <QuestCard key={quest.id} questId={quest.id} state={state} t={t} featured={false} onClaimQuest={props.onClaimQuest} />
        ))}
      </div>
      <section className="camp-card camp-daily-card" data-testid="camp-daily-card">
        <div className="camp-card-title">{t("dailyTitle")}</div>
        <div className="daily-list">
          {DAILY_MISSIONS.map((mission) => {
            const status = getDailyMissionStatus(props.state, mission, now)
            return (
              <div className="daily-row" data-testid={`daily-${mission.id}`} key={mission.id}>
                <div className="daily-copy">
                  <span>{t(missionLabelKeys[mission.id])}</span>
                  <small>
                    {formatNumber(status.progress)}/{formatNumber(status.goal)} +{formatNumber(status.rewardManaCrystals)}{" "}
                    {t("manaCrystals")}
                  </small>
                </div>
                <button
                  className="btn btn-mini"
                  disabled={!status.claimable}
                  onClick={() => props.onClaimDailyMission(mission.id)}
                  type="button"
                >
                  {status.claimed ? t("claimed") : t("claim")}
                  {status.claimable ? <span aria-hidden="true" className="badge-dot" /> : null}
                </button>
              </div>
            )
          })}
        </div>
      </section>
      <div className="achievement-block">
        <div className="quest-section-label">{t("achievements")}</div>
        <div className="achievement-grid">
          {ACHIEVEMENTS.map((achievement) => {
            const progress = getAchievementProgress(state, achievement.counter)
            const unlocked = isAchievementUnlocked(state, achievement)
            return (
              <div
                className={`achievement-cell${unlocked ? " is-unlocked" : ""}`}
                data-testid={`achievement-${achievement.id}`}
                key={achievement.id}
              >
                <span>{t.achievementTitle(achievement.counter, achievement.threshold)}</span>
                <strong>{t.achievementProgress(progress, achievement.threshold)}</strong>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function QuestCard(props: {
  readonly questId: string
  readonly state: EngineState
  readonly t: Translator
  readonly featured: boolean
  readonly onClaimQuest: (questId: string) => boolean
}) {
  const completed = props.state.quests.completed.includes(props.questId)
  const claimed = props.state.quests.claimed.includes(props.questId)
  const quest = getVisibleQuests(props.state).find((item) => item.id === props.questId)
  const reward = quest?.reward ?? { gold: 0, skillPoints: 0 }

  return (
    <article className={`quest-card${props.featured ? " is-featured" : ""}${completed ? " is-ready" : ""}${claimed ? " is-claimed" : ""}`}>
      <div className="quest-copy">
        <strong>{props.t.questTitle(props.questId)}</strong>
        <span>{props.t.questDescription(props.questId)}</span>
        <em>{props.t.rewardLine(Math.round(reward.gold), reward.skillPoints)}</em>
      </div>
      <button
        className="btn btn-mini"
        data-testid={`quest-claim-${props.questId}`}
        disabled={!completed || claimed}
        onClick={() => props.onClaimQuest(props.questId)}
        type="button"
      >
        {claimed ? props.t("claimed") : completed ? props.t("claim") : props.t("locked")}
        {completed && !claimed ? <span aria-hidden="true" className="badge-dot" /> : null}
      </button>
    </article>
  )
}
