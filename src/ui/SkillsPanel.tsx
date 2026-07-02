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
            <span>{skill.label}</span>
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
