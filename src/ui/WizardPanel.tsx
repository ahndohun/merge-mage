import { useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import {
  BASE_CAST_INTERVAL_MS,
  BASE_CRIT_CHANCE,
  CAST_SPEED_REDUCTION_MS,
  CRIT_CHANCE_PER_POINT,
  GOLD_GAIN_PER_POINT,
  MIN_CAST_INTERVAL_MS,
} from "../engine/constants"
import { getPromotionStatus, getSchoolRespecCost } from "../engine/progressionActions"
import { getTraitsForSlot, getSlotRequiredRank, getUnlockedTraitSlots, TRAIT_SLOTS, type TraitId, type TraitSlot } from "../engine/traits"
import { SCHOOLS, type AscensionRank, type EngineState, type School, type SkillName } from "../engine/types"
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
  readonly onPromoteClass: (school?: School) => boolean
  readonly onRespecSchool: (school: School) => boolean
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

// The Wizard tab answers "how strong am I" (and, since R5, "who am I"): identity
// header + promotion, arcane traits, active skill points, elemental resonance
// (equipped synergy), and the grimoire codex (collection bonus). Resonance +
// codex moved here from the Books tab so Books stays focused on equip/inventory/buy.
export function WizardPanel(props: WizardPanelProps) {
  const { t } = useLocale()
  const [ceremonyOpen, setCeremonyOpen] = useState(false)
  const [respecOpen, setRespecOpen] = useState(false)

  const status = getPromotionStatus(props.state)

  const handlePromoteCta = () => setCeremonyOpen(true)

  return (
    <section className="panel tab-panel wizard-panel" aria-label="Wizard">
      <IdentityHeader state={props.state} status={status} t={t} />
      <PromotionCard
        onOpenSchoolModal={handlePromoteCta}
        state={props.state}
        status={status}
        t={t}
      />
      {props.state.ascension.rank >= 1 ? (
        <button
          className="btn btn-wide"
          data-testid="school-respec-btn"
          onClick={() => setRespecOpen(true)}
          type="button"
        >
          {t("schoolRespecBtn")} · {t.schoolRespecCost(getSchoolRespecCost(props.state.ascension.schoolRespecs))}
        </button>
      ) : null}
      {ceremonyOpen ? (
        <PromotionCeremony
          onClose={() => setCeremonyOpen(false)}
          onPromoteClass={props.onPromoteClass}
          state={props.state}
          status={status}
          t={t}
        />
      ) : null}
      {respecOpen ? (
        <SchoolRespecModal
          currentSchool={props.state.ascension.school}
          onCancel={() => setRespecOpen(false)}
          onConfirm={(school) => {
            if (props.onRespecSchool(school)) {
              setRespecOpen(false)
            }
          }}
          respecCost={getSchoolRespecCost(props.state.ascension.schoolRespecs)}
          t={t}
        />
      ) : null}
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

function IdentityHeader(props: {
  readonly state: EngineState
  readonly status: ReturnType<typeof getPromotionStatus>
  readonly t: Translator
}) {
  const { ascension } = props.state
  return (
    <div className="identity-header" data-testid="identity-header">
      <div className="identity-title">
        <strong>{props.t.identityLine(ascension.rank, ascension.school)}</strong>
        {ascension.school === null ? <span className="identity-no-school">{props.t("identityNoSchool")}</span> : null}
      </div>
      {props.status.progress !== null ? (
        <div className="identity-progress">
          {props.status.progress.stage !== undefined
            ? props.t.promotionProgressWithStage(
                props.status.progress.prestige.current,
                props.status.progress.prestige.required,
                props.status.progress.level.current,
                props.status.progress.level.required,
                props.status.progress.stage.current,
                props.status.progress.stage.required,
              )
            : props.t.promotionProgress(
                props.status.progress.prestige.current,
                props.status.progress.prestige.required,
                props.status.progress.level.current,
                props.status.progress.level.required,
              )}
        </div>
      ) : null}
    </div>
  )
}

function PromotionCard(props: {
  readonly state: EngineState
  readonly status: ReturnType<typeof getPromotionStatus>
  readonly onOpenSchoolModal: () => void
  readonly t: Translator
}) {
  const { status } = props

  return (
    <div className="promote-card panel-inset" data-testid="promote-card">
      {status.nextRank === null ? (
        <strong>{props.t("promoteMaxRank")}</strong>
      ) : status.eligible ? (
        <button className="btn btn-wide btn-emphasis" data-testid="promote-btn" onClick={props.onOpenSchoolModal} type="button">
          {status.nextRank === 1 ? props.t("promoteCta") : props.t("promoteCtaArchmage")}
        </button>
      ) : (
        <>
          <span>{props.t("promoteLocked")}</span>
          {status.progress !== null ? (
            <div className="identity-progress">
              {status.progress.stage !== undefined
                ? props.t.promotionProgressWithStage(
                    status.progress.prestige.current,
                    status.progress.prestige.required,
                    status.progress.level.current,
                    status.progress.level.required,
                    status.progress.stage.current,
                    status.progress.stage.required,
                  )
                : props.t.promotionProgress(
                    status.progress.prestige.current,
                    status.progress.prestige.required,
                    status.progress.level.current,
                    status.progress.level.required,
                  )}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

// How long the post-confirm awakening sequence plays before the ceremony
// auto-closes. The CSS stagger (card fade -> crest zoom -> ability reveal ->
// flash) is timed to fit inside this window; see overlay.css AWAKENING_MS
// comment for the per-step breakdown.
const AWAKENING_MS = 2200

// The 1st promotion (Apprentice -> Adept) is the heaviest beat in the run: a
// fullscreen ceremony dims the whole game (canvas + HUD + tab bar) and asks
// the player to commit to a school. The 2nd (Adept -> Archmage) reuses the
// same shell without the picker — school carries over, so it plays as a pure
// ascension payoff. `onPromoteClass` fires the instant the player confirms
// (engine state changes synchronously); the awakening phase is a trailing
// visual layer only, so tests that assert on the callback don't need to wait
// for the animation.
function PromotionCeremony(props: {
  readonly state: EngineState
  readonly status: ReturnType<typeof getPromotionStatus>
  readonly onPromoteClass: (school?: School) => boolean
  readonly onClose: () => void
  readonly t: Translator
}) {
  // Captured once at mount (not derived on every render): confirming a
  // choose-mode promotion updates props.state.ascension.rank from 0 to 1
  // immediately (engine state changes synchronously, see AWAKENING_MS
  // comment below), which would otherwise flip this ceremony instance's own
  // mode mid-awakening and rewrite its header/title out from under the
  // reveal animation.
  const [mode] = useState<"choose" | "ascend">(props.state.ascension.rank === 0 ? "choose" : "ascend")
  const [selected, setSelected] = useState<School | null>(mode === "ascend" ? props.state.ascension.school : null)
  const [revealSchool, setRevealSchool] = useState<School | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleConfirm = () => {
    if (selected === null) {
      return
    }
    const promoted = mode === "choose" ? props.onPromoteClass(selected) : props.onPromoteClass()
    if (!promoted) {
      return
    }
    setRevealSchool(selected)
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => props.onClose(), AWAKENING_MS)
  }

  const awakening = revealSchool !== null

  // Portal to <body>: the ceremony must dim the full screen (canvas + HUD +
  // tab bar), but it mounts from inside .wizard-panel, which sits under a
  // chain of ancestors (.tab-content -> .bottom-overlay -> .ui-overlay ->
  // .game-shell) where the panel itself is `overflow: auto`. A `position:
  // fixed` descendant of an `overflow` ancestor still gets clipped to that
  // ancestor's box in this app's layout, so escaping via a portal is what
  // actually reaches the true viewport. Still a DOM-only overlay — no
  // Phaser/canvas code touched.
  return createPortal(
    <div className="modal-shade ceremony-shade" role="presentation">
      <div
        aria-modal="true"
        className={`ceremony panel school-modal${awakening ? " is-awakening" : ""}`}
        data-testid="school-modal"
        role="dialog"
      >
        <div className="ceremony-eyebrow">
          {mode === "choose" ? props.t("ceremonyEyebrowChoose") : props.t("ceremonyEyebrowArchmage")}
        </div>
        <h2 className="ceremony-title">
          {mode === "choose" ? props.t("ceremonyTitleChoose") : props.t("ceremonyTitleArchmage")}
        </h2>
        <p className="ceremony-sub">{mode === "choose" ? props.t("ceremonySubChoose") : props.t("ceremonySubArchmage")}</p>
        <div className={`school-card-grid${awakening ? " is-awakening" : ""}`}>
          {SCHOOLS.map((school) => {
            if (mode === "ascend" && school !== selected) {
              return null
            }
            const isChosen = revealSchool === school
            const isFadingOut = awakening && !isChosen
            return (
              <button
                className={`school-card school-card-${school}${selected === school ? " is-selected" : ""}${
                  isChosen ? " is-chosen" : ""
                }${isFadingOut ? " is-fading-out" : ""}`}
                data-testid={`school-card-${school}`}
                disabled={awakening}
                key={school}
                onClick={() => setSelected(school)}
                type="button"
              >
                <div aria-hidden="true" className={`school-crest school-crest-${school}`} />
                <strong>{props.t.schoolTitle(school)}</strong>
                <ul className="school-effect-list">
                  {props.t.schoolEffectSummary(school).map((line, index) => (
                    <li className={isChosen ? "is-revealing" : ""} key={line} style={{ "--reveal-index": index } as CSSProperties}>
                      {line}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
        {awakening ? <div className="ceremony-flash" aria-hidden="true" data-school={revealSchool} /> : null}
        {!awakening ? (
          <>
            <div className="school-modal-notice">
              <span>{props.t("ceremonyRespecNotice")}</span>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={props.onClose} type="button">
                {props.t("cancel")}
              </button>
              <button
                className="btn btn-emphasis"
                data-testid="school-confirm"
                disabled={selected === null}
                onClick={handleConfirm}
                type="button"
              >
                {mode === "ascend"
                  ? props.t("ceremonyConfirmArchmage")
                  : selected !== null
                    ? props.t.ceremonyConfirmSchool(selected)
                    : props.t("confirm")}
              </button>
            </div>
          </>
        ) : (
          <div className="ceremony-awakening-label">{props.t("ceremonyAwakeningTitle")}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}

function SchoolRespecModal(props: {
  readonly currentSchool: School | null
  readonly respecCost: number
  readonly onConfirm: (school: School) => void
  readonly onCancel: () => void
  readonly t: Translator
}) {
  const [selected, setSelected] = useState<School | null>(props.currentSchool)

  return (
    <div className="modal-shade" role="presentation">
      <div aria-modal="true" className="modal panel school-modal" data-testid="school-modal" role="dialog">
        <div className="panel-header">
          <span>{props.t("schoolModalTitleRespec")}</span>
        </div>
        <div className="school-card-grid">
          {SCHOOLS.map((school) => (
            <button
              className={`school-card school-card-${school}${selected === school ? " is-selected" : ""}`}
              data-testid={`school-card-${school}`}
              key={school}
              onClick={() => setSelected(school)}
              type="button"
            >
              <strong>{props.t.schoolTitle(school)}</strong>
              <ul className="school-effect-list">
                {props.t.schoolEffectSummary(school).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
        <div className="school-modal-notice">
          <span>{props.t.schoolRespecCost(props.respecCost)}</span>
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={props.onCancel} type="button">
            {props.t("cancel")}
          </button>
          <button
            className="btn btn-emphasis"
            data-testid="school-confirm"
            disabled={selected === null || selected === props.currentSchool}
            onClick={() => {
              if (selected !== null && selected !== props.currentSchool) {
                props.onConfirm(selected)
              }
            }}
            type="button"
          >
            {props.t("confirm")}
          </button>
        </div>
      </div>
    </div>
  )
}

function TraitsSection(props: {
  readonly state: EngineState
  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
  readonly t: Translator
}) {
  const unlockedSlots = getUnlockedTraitSlots(props.state.ascension.rank)

  return (
    <section className="traits-section" aria-label="Arcane traits">
      <div className="panel-header">
        <span>{props.t("traits")}</span>
        <strong>{unlockedSlots.length}/3</strong>
      </div>
      {TRAIT_SLOTS.map((slot) => (
        <TraitSlotRow
          key={slot}
          rank={props.state.ascension.rank}
          slot={slot}
          state={props.state}
          onSelectTrait={props.onSelectTrait}
          t={props.t}
        />
      ))}
    </section>
  )
}

function TraitSlotRow(props: {
  readonly slot: TraitSlot
  readonly rank: AscensionRank
  readonly state: EngineState
  readonly onSelectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
  readonly t: Translator
}) {
  const traits = getTraitsForSlot(props.slot)
  const requiredRank = getSlotRequiredRank(props.slot)
  const unlocked = props.rank >= requiredRank
  const selected = props.state.traits.picks[props.slot]
  const lockedLabelKey = requiredRank >= 2 ? "arcaneSlotArchmageLocked" : "arcaneSlotLocked"

  return (
    <div className={`trait-slot-row${unlocked ? " is-unlocked" : " is-locked"}`}>
      <div className="trait-slot-title">
        <span>{props.t.arcaneSlotLabel(props.slot)}</span>
        {unlocked ? null : <strong>{props.t(lockedLabelKey)}</strong>}
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
