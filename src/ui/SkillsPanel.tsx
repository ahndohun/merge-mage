import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  GOLD_GAIN_PER_POINT,
  MIN_CAST_INTERVAL_MS,
} from "../engine/constants"
import type { EngineState, SkillName } from "../engine/types"

const SKILL_ROWS: readonly { readonly name: SkillName; readonly label: string }[] = [
  { name: "summonBonus", label: "SUMMON FLOOR" },
  { name: "castSpeed", label: "CAST SPEED" },
  { name: "goldGain", label: "GOLD GAIN" },
  { name: "critChance", label: "CRIT CHANCE" },
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

function getSkillEffectCopy(skill: SkillName, state: EngineState): string {
  switch (skill) {
    case "summonBonus":
      return `+1 summon level / pt (+${state.skills.summonBonus})`
    case "castSpeed":
      return `-${CAST_SPEED_REDUCTION_MS}ms cast / pt (now ${getCastIntervalMs(state.skills.castSpeed)}ms)`
    case "goldGain":
      return `+${GOLD_GAIN_PER_POINT * 100}% gold / pt (+${Math.round(state.skills.goldGain * GOLD_GAIN_PER_POINT * 100)}%)`
    case "critChance":
      return `+${CRIT_CHANCE_PER_POINT * 100}% crit / pt (${Math.round(
        (BASE_CRIT_CHANCE + state.skills.critChance * CRIT_CHANCE_PER_POINT) * 100,
      )}%)`
  }
}

export function SkillsPanel(props: SkillsPanelProps) {
  return (
    <section className="panel tab-panel" aria-label="Skills">
      <div className="panel-header">
        <span>SKILL POINTS</span>
        <strong>{props.state.skillPoints}</strong>
      </div>
      {props.state.skillPoints === 0 ? (
        <div className="empty-copy">Level up your wizard (kill things) to earn skill points</div>
      ) : null}
      <div className="skill-list">
        {SKILL_ROWS.map((skill) => (
          <div className="skill-row" key={skill.name}>
            <span className="skill-row-label">
              {skill.label}
              <span className="skill-row-effect">{getSkillEffectCopy(skill.name, props.state)}</span>
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
        RESET
      </button>
    </section>
  )
}
