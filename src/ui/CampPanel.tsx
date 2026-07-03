import {
  DAILY_MISSIONS,
  SKINS,
  getDailyMissionStatus,
  getEquippedSkin,
  getMineClaimPreview,
  getPetDps,
  getPetXpThreshold,
  getUnlockedSkins,
  type DailyMissionId,
  type SkinId,
} from "../engine/camp"
import type { EngineState } from "../engine/types"
import { formatNumber } from "./formatNumber"
import type { MessageKey } from "./i18n"
import { useLocale } from "./useLocale"

type CampPanelProps = {
  readonly state: EngineState
  readonly onClaimMine: () => boolean
  readonly onClaimDailyMission: (missionId: DailyMissionId) => boolean
  readonly onEquipSkin: (skinId: string) => boolean
}

const missionLabelKeys: Record<DailyMissionId, MessageKey> = {
  merge20: "missionMerge20",
  boss3: "missionBoss3",
  summon30: "missionSummon30",
  mineClaim1: "missionMineClaim1",
  stage3: "missionStage3",
}

const skinLabelKeys: Record<SkinId, MessageKey> = {
  apprentice: "skinApprentice",
  ember: "skinEmber",
  frost: "skinFrost",
  gilded: "skinGilded",
}

export function CampPanel(props: CampPanelProps) {
  const { t } = useLocale()
  const now = new Date()
  const mine = getMineClaimPreview(props.state, now.getTime())
  const unlockedSkins = getUnlockedSkins(props.state)
  const equippedSkin = getEquippedSkin(props.state)
  const petXpRequired = getPetXpThreshold(props.state.pet.level)
  const petXpPercent = Math.min(100, (props.state.pet.xp / petXpRequired) * 100)

  return (
    <section className="panel tab-panel camp-panel" aria-label="Camp">
      <div className="panel-header">
        <span>{t("campTitle")}</span>
        <strong>{formatNumber(props.state.manaStone)} {t.locale === "ko" ? "마나석" : "MANA"}</strong>
      </div>

      <div className="camp-grid">
        <section className="camp-card camp-pet-card" data-testid="camp-pet-card">
          <div className="camp-card-title">{t("familiar")}</div>
          <div className="camp-pet-body">
            <div className={`camp-pet-sprite evolution-${props.state.pet.evolution}`} aria-hidden="true" />
            <div className="camp-readouts">
              <strong>{t.levelBadge(props.state.pet.level)}</strong>
              <span>{t.petEvolution(props.state.pet.evolution)}</span>
              <span>{t.petDps(formatNumber(getPetDps(props.state)))}</span>
            </div>
          </div>
          <div className="camp-progress" aria-label="Familiar XP">
            <div className="camp-progress-fill" style={{ width: `${petXpPercent}%` }} />
          </div>
        </section>

        <section className="camp-card camp-mine-card" data-testid="camp-mine-card">
          <div className="camp-card-title">{t("mineTitle")}</div>
          <div className="camp-mine-row">
            <span>{t.mineFloor(mine.floor)}</span>
            <strong>{formatNumber(mine.manaStone)}</strong>
          </div>
          <div className="camp-muted">{t.mineRate(formatNumber(mine.ratePerHour))}</div>
          <button
            className="btn btn-mini btn-wide"
            data-testid="mine-claim-btn"
            disabled={!mine.claimable}
            onClick={props.onClaimMine}
            type="button"
          >
            {t("claim")}
            {mine.claimable ? <span aria-hidden="true" className="badge-dot" /> : null}
          </button>
        </section>
      </div>

      <section className="camp-card camp-skins-card" data-testid="camp-skins-card">
        <div className="camp-card-title">{t("skinsTitle")}</div>
        <div className="skin-grid">
          {SKINS.map((skin) => {
            const unlocked = unlockedSkins.some((item) => item.id === skin.id)
            const active = equippedSkin.id === skin.id
            return (
              <button
                aria-pressed={active}
                className={`skin-cell${active ? " is-active" : ""}${unlocked ? "" : " is-locked"}`}
                data-testid={`skin-${skin.id}`}
                disabled={!unlocked}
                key={skin.id}
                onClick={() => props.onEquipSkin(skin.id)}
                type="button"
              >
                <span className="skin-swatch" style={{ backgroundColor: `#${skin.tint.toString(16).padStart(6, "0")}` }} />
                <span>{t(skinLabelKeys[skin.id])}</span>
                <small>{active ? t("equipped") : unlocked ? t("equip") : t("locked")}</small>
              </button>
            )
          })}
        </div>
      </section>

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
                    {formatNumber(status.progress)}/{formatNumber(status.goal)} +{formatNumber(status.rewardManaStone)}{" "}
                    {t.locale === "ko" ? "마나석" : "MANA"}
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
    </section>
  )
}
