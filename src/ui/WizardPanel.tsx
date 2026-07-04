import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  GOLD_GAIN_PER_POINT,
  MIN_CAST_INTERVAL_MS,
} from "../engine/constants"
import { getTraitsForSlot, TRAIT_SLOTS, type TraitId, type TraitSlot } from "../engine/traits"
import type { EngineState, SkillName } from "../engine/types"
import { CodexGrid, ResonanceBadges, TomeIcon } from "./BooksPanelViews"
import type { MessageKey, Translator } from "./i18n"
import { useLocale } from "./useLocale"

const SKILL_ROWS: readonly { readonly name: SkillName; readonly labelKey: MessageKey }[] = [
  { name: "summonBonus", labelKey: "skillSummonFloor" },
  { name: "castSpeed", labelKey: "skillCastSpeed" },
  { name: "goldGain", labelKey: "skillGoldGain" },
  { name: "critChance", labelKey: "skillCritChance" },
] as const

type WizardPanelProps = {
  readonly state: EngineState
  readonly onAllocateSkill: (skill: SkillName) => void
  readonly onResetSkills: () => void
  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
}

// Mirrors the engine's cast-interval formula (src/engine/battle.ts getCastIntervalMs).
// That helper is private to the engine module, so the UI recomposes it from the
// same exported constants rather than duplicating the magic numbers.
function getCastIntervalMs(castSpeedPoints: number): number {
  return Math.max(MIN_CAST_INTERVAL_MS, BASE_CAST_INTERVAL_MS - CAST_SPEED_REDUCTION_MS * castSpeedPoints)
}

function getSkillEffectCopy(skill: SkillName, state: EngineState, t: Translator): string {
  switch (skill) {
    case "summonBonus":
      return t.skillSummonBonusEffect(state.skills.summonBonus)
    case "castSpeed":
      return t.skillCastSpeedEffect(CAST_SPEED_REDUCTION_MS, getCastIntervalMs(state.skills.castSpeed))
    case "goldGain":
      return t.skillGoldGainEffect(GOLD_GAIN_PER_POINT * 100, Math.round(state.skills.goldGain * GOLD_GAIN_PER_POINT * 100))
    case "critChance":
      return t.skillCritChanceEffect(CRIT_CHANCE_PER_POINT * 100, Math.round(
        (BASE_CRIT_CHANCE + state.skills.critChance * CRIT_CHANCE_PER_POINT) * 100,
      ))
  }
}

// The Wizard tab answers "how strong am I": active skill points, arcane traits,
// elemental resonance (equipped synergy), and the grimoire codex (collection
// bonus). Resonance + codex moved here from the Books tab so Books stays focused
// on equip/inventory/buy.
export function WizardPanel(props: WizardPanelProps) {
  const { t } = useLocale()

  return (
    <section className="panel tab-panel wizard-panel" aria-label="Wizard">
      <div className="panel-header">
        <span>{t("skillPoints")}</span>
        <strong>{props.state.skillPoints}</strong>
      </div>
      {props.state.skillPoints === 0 ? (
        <div className="empty-copy">{t("skillEmpty")}</div>
      ) : null}
      <div className="skill-list">
        {SKILL_ROWS.map((skill) => (
          <div className="skill-row" key={skill.name}>
            <span className="skill-row-label">
              {t(skill.labelKey)}
              <span className="skill-row-effect">{getSkillEffectCopy(skill.name, props.state, t)}</span>
            </span>
            <strong>{props.state.skills[skill.name]}</strong>
            <button
              className="btn btn-mini"
              data-testid={`skill-plus-${skill.name}`}
              disabled={props.state.skillPoints < 1}
              onClick={() => props.onAllocateSkill(skill.name)}
              type="button"
            >
              +
              {props.state.skillPoints > 0 ? <span aria-hidden="true" className="badge-dot" /> : null}
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-wide" data-testid="skill-reset" onClick={props.onResetSkills} type="button">
        {t("reset")}
      </button>
      <TraitsSection state={props.state} onSelectTrait={props.onSelectTrait} t={t} />
      <div className="panel-header">
        <span>{t("resonance")}</span>
      </div>
      <ResonanceBadges state={props.state} t={t} />
      <div className="panel-header">
        <span>{t("subCodex")}</span>
      </div>
      <CodexGrid state={props.state} t={t} renderTomeIcon={(element) => <TomeIcon element={element} />} />
    </section>
  )
}

function TraitsSection(props: {
  readonly state: EngineState
  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
  readonly t: Translator
}) {
  return (
    <section className="traits-section" aria-label="Arcane traits">
      <div className="panel-header">
        <span>{props.t("traits")}</span>
        <strong>{Object.keys(props.state.traits.picks).filter((key) => key.startsWith("lv")).length}/3</strong>
      </div>
      {TRAIT_SLOTS.map((slot) => (
        <TraitSlotRow key={slot} slot={slot} state={props.state} onSelectTrait={props.onSelectTrait} t={props.t} />
      ))}
    </section>
  )
}

function TraitSlotRow(props: {
  readonly slot: TraitSlot
  readonly state: EngineState
  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
  readonly t: Translator
}) {
  const traits = getTraitsForSlot(props.slot)
  const requiredLevel = traits[0]?.requiredLevel ?? 1
  const unlocked = props.state.wizardLevel >= requiredLevel
  const selected = props.state.traits.picks[props.slot]

  return (
    <div className={`trait-slot-row${unlocked ? " is-unlocked" : " is-locked"}`}>
      <div className="trait-slot-title">
        <span>{props.t.traitUnlock(requiredLevel)}</span>
        {unlocked ? null : <strong>{props.t("locked")}</strong>}
        {unlocked && selected !== undefined ? <strong>{props.t("selected")}</strong> : null}
      </div>
      <div className="trait-card-grid">
        {traits.map((trait) => {
          const isSelected = selected === trait.id
          return (
            <button
              className={`trait-card${isSelected ? " is-selected" : ""}`}
              data-testid={`trait-${props.slot}-${trait.id}`}
              disabled={!unlocked || isSelected}
              key={trait.id}
              onClick={() => props.onSelectTrait(props.slot, trait.id)}
              type="button"
            >
              <strong>{props.t.traitTitle(trait.id)}</strong>
              <span>{props.t.traitDescription(trait.id)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
