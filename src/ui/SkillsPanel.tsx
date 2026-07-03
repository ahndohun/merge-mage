import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  GOLD_GAIN_PER_POINT,
  MIN_CAST_INTERVAL_MS,
} from "../engine/constants"
import type { EngineState, SkillName } from "../engine/types"
import type { MessageKey, Translator } from "./i18n"
import { useLocale } from "./useLocale"

const SKILL_ROWS: readonly { readonly name: SkillName; readonly labelKey: MessageKey }[] = [
  { name: "summonBonus", labelKey: "skillSummonFloor" },
  { name: "castSpeed", labelKey: "skillCastSpeed" },
  { name: "goldGain", labelKey: "skillGoldGain" },
  { name: "critChance", labelKey: "skillCritChance" },
] as const

type SkillsPanelProps = {
  readonly state: EngineState
  readonly onAllocateSkill: (skill: SkillName) => void
  readonly onResetSkills: () => void
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

export function SkillsPanel(props: SkillsPanelProps) {
  const { t } = useLocale()

  return (
    <section className="panel tab-panel" aria-label="Skills">
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
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-wide" data-testid="skill-reset" onClick={props.onResetSkills} type="button">
        {t("reset")}
      </button>
    </section>
  )
}
