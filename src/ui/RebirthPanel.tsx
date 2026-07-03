import { useState } from "react"
import { getPrestigeCrystalReward } from "../engine/balance"
import { MANA_DAMAGE_PER_CRYSTAL, RELIC_SUMMON_COST } from "../engine/constants"
import { getEquippedRelicEffects, getRelicDefinition, RELICS } from "../engine/relics"
import type { EngineState } from "../engine/types"
import { useBadges } from "./useBadges"
import { useLocale } from "./useLocale"

type RebirthPanelProps = {
  readonly state: EngineState
  readonly onPrestige: () => void
  readonly onSummonRelic: () => boolean
  readonly onEquipRelic: (relicId: string | null, slotIdx: number) => boolean
}

export function RebirthPanel(props: RebirthPanelProps) {
  const { t } = useLocale()
  const badges = useBadges(props.state)
  const [confirming, setConfirming] = useState(false)
  const [subview, setSubview] = useState<"rebirth" | "relics">("rebirth")
  const preview = getPrestigeCrystalReward(props.state.stage, getEquippedRelicEffects(props.state.relics).crystalGainMultiplier)
  const ready = props.state.stage >= 10

  return (
    <section className="panel tab-panel rebirth-panel" aria-label="Rebirth">
      <div className="panel-header">
        <span>{t("arcaneRebirth")}</span>
        <strong>{t.rebirthPreview(preview)}</strong>
      </div>
      <div className="segmented-control" data-testid="rebirth-subview">
        <button className={subview === "rebirth" ? "is-active" : ""} onClick={() => setSubview("rebirth")} type="button">
          {t("rebirth")}
        </button>
        <button className={subview === "relics" ? "is-active" : ""} onClick={() => setSubview("relics")} type="button">
          {t("relics")}
        </button>
      </div>
      <div className="rebirth-readout">
        <span>{t("stage")}</span>
        <strong>{props.state.stage}</strong>
        <span>{t("manaCrystals")}</span>
        <strong>{props.state.manaCrystals}</strong>
      </div>
      {subview === "rebirth" ? (
        <>
          <div className="rebirth-terms" data-testid="rebirth-terms">
            <div>{t("rebirthKeep")}</div>
            <div>{t("rebirthReset")}</div>
            <div className="rebirth-terms-gain">{t.rebirthGain(preview, Math.round(MANA_DAMAGE_PER_CRYSTAL * 100))}</div>
            <div>{t("relicCurrencyHint")}</div>
          </div>
          <button className="btn btn-wide" data-testid="prestige-open" disabled={!ready} onClick={() => setConfirming(true)} type="button">
            {t("rebirth")}
            {badges.rebirth ? <span aria-hidden="true" className="badge-dot" /> : null}
          </button>
          {ready ? null : <div className="empty-copy rebirth-lock-copy">{t.rebirthUnlock(props.state.stage)}</div>}
        </>
      ) : (
        <RelicsSubview state={props.state} onEquipRelic={props.onEquipRelic} onSummonRelic={props.onSummonRelic} />
      )}
      {confirming ? (
        <div className="modal-shade" role="presentation">
          <div aria-modal="true" className="modal panel" role="dialog">
            <div className="panel-header">
              <span>{t("confirm")}</span>
              <strong>+{t.rebirthPreview(preview)}</strong>
            </div>
            <div className="modal-actions">
              <button
                className="btn"
                data-testid="prestige-confirm"
                onClick={() => {
                  props.onPrestige()
                  setConfirming(false)
                }}
                type="button"
              >
                {t("confirm")}
              </button>
              <button className="btn" data-testid="prestige-cancel" onClick={() => setConfirming(false)} type="button">
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function RelicsSubview(props: {
  readonly state: EngineState
  readonly onSummonRelic: () => boolean
  readonly onEquipRelic: (relicId: string | null, slotIdx: number) => boolean
}) {
  const { t } = useLocale()
  const ownedRelics = RELICS.filter((relic) => (props.state.relics.owned[relic.id] ?? 0) > 0)
  const canSummon = props.state.manaCrystals >= RELIC_SUMMON_COST

  return (
    <div className="relics-view" data-testid="relics-view">
      <button
        aria-disabled={!canSummon}
        className={`btn btn-wide${canSummon ? "" : " is-blocked"}`}
        data-testid="relic-summon-btn"
        onClick={props.onSummonRelic}
        type="button"
      >
        {t("relicSummon")} {t.relicSummonCost(RELIC_SUMMON_COST)}
      </button>
      <div className="relic-slot-row" aria-label={t("relicEquipped")}>
        {props.state.relics.equipped.map((relicId, slotIdx) => {
          const relic = relicId === null ? null : getRelicDefinition(relicId)
          const level = relicId === null ? 0 : props.state.relics.owned[relicId] ?? 0
          return (
            <button
              className="relic-slot"
              data-testid={`relic-equip-slot-${slotIdx}`}
              key={`relic-slot-${slotIdx}`}
              onClick={() => props.onEquipRelic(null, slotIdx)}
              type="button"
            >
              <span>{relic === null ? t("relicSlotEmpty") : t.locale === "ko" ? relic.nameKo : relic.nameEn}</span>
              {level > 0 ? <strong>{t.relicLevel(level)}</strong> : null}
            </button>
          )
        })}
      </div>
      <div className="panel-header">
        <span>{t("relicOwned")}</span>
        <strong>{ownedRelics.length}</strong>
      </div>
      {ownedRelics.length === 0 ? <div className="empty-copy">{t("relicEmpty")}</div> : null}
      <div className="relic-grid">
        {ownedRelics.map((relic) => {
          const level = props.state.relics.owned[relic.id] ?? 0
          const equipped = props.state.relics.equipped.some((id) => id === relic.id)
          const emptySlot = props.state.relics.equipped.findIndex((id) => id === null)
          const nextSlot = emptySlot === -1 ? 0 : emptySlot
          return (
            <button
              className={`relic-card${equipped ? " is-equipped" : ""}`}
              data-testid={`relic-card-${relic.id}`}
              key={relic.id}
              onClick={() => props.onEquipRelic(relic.id, nextSlot)}
              type="button"
            >
              <span>{t.locale === "ko" ? relic.nameKo : relic.nameEn}</span>
              <strong>{t.relicLevel(level)}</strong>
              <small>{t.locale === "ko" ? relic.shortKo : relic.shortEn}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
