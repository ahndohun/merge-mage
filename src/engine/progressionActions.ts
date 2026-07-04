import { applyAscensionSkin } from "./camp.js"
import { InsufficientManaCrystalsError, PromotionError, QuestClaimError, SchoolRespecError } from "./errors.js"
import { trackProgress } from "./progression.js"
import { findQuest, getVisibleQuests, refreshQuests } from "./quests.js"
import { selectTraitPick, type TraitId, type TraitSlot } from "./traits.js"
import { SCHOOLS, type AscensionRank, type EngineState, type School } from "./types.js"

const RANK1_GATE = { prestige: 1, level: 12 } as const
const RANK2_GATE = { prestige: 4, level: 30, stage: 20 } as const

export type PromotionProgress = {
  readonly prestige: { readonly current: number; readonly required: number }
  readonly level: { readonly current: number; readonly required: number }
  readonly stage?: { readonly current: number; readonly required: number }
}

export type PromotionStatus = {
  readonly nextRank: AscensionRank | null
  readonly eligible: boolean
  readonly progress: PromotionProgress | null
}

/** 전직 진행 상태 파생(순수·저장X) — UI·배지·NEXT GOAL 단일 소스. 권한은 항상 여기서 재검증. */
export function getPromotionStatus(state: EngineState): PromotionStatus {
  if (state.ascension.rank === 0) {
    const progress: PromotionProgress = {
      prestige: { current: state.prestigeCount, required: RANK1_GATE.prestige },
      level: { current: state.wizardLevel, required: RANK1_GATE.level },
    }
    return { nextRank: 1, eligible: isRank1Eligible(state), progress }
  }
  if (state.ascension.rank === 1) {
    const progress: PromotionProgress = {
      prestige: { current: state.prestigeCount, required: RANK2_GATE.prestige },
      level: { current: state.wizardLevel, required: RANK2_GATE.level },
      stage: { current: state.highestStage, required: RANK2_GATE.stage },
    }
    return { nextRank: 2, eligible: isRank2Eligible(state), progress }
  }
  return { nextRank: null, eligible: false, progress: null }
}

function isRank1Eligible(state: EngineState): boolean {
  return state.prestigeCount >= RANK1_GATE.prestige && state.wizardLevel >= RANK1_GATE.level
}

function isRank2Eligible(state: EngineState): boolean {
  return (
    state.prestigeCount >= RANK2_GATE.prestige &&
    state.wizardLevel >= RANK2_GATE.level &&
    state.highestStage >= RANK2_GATE.stage
  )
}

function isSchool(value: unknown): value is School {
  return typeof value === "string" && SCHOOLS.some((school) => school === value)
}

/**
 * 클래스 승급. 견습→정식(rank0→1)은 학파 선택 필수, 정식→대마법사(rank1→2)는 학파 승계.
 * 확정 시 결정론적 스킨을 부여·장착한다.
 */
export function promoteClass(state: EngineState, school?: School): EngineState {
  const status = getPromotionStatus(state)
  if (status.nextRank === null) {
    throw new PromotionError("max-rank")
  }
  if (!status.eligible) {
    throw new PromotionError("not-eligible")
  }

  if (state.ascension.rank === 0) {
    if (school === undefined) {
      throw new PromotionError("school-required")
    }
    if (!isSchool(school)) {
      throw new PromotionError("invalid-school")
    }
    return trackProgress(
      applyAscensionSkin({ ...state, ascension: { rank: 1, school, schoolRespecs: state.ascension.schoolRespecs } }),
    )
  }

  // 정식(rank1)은 학파가 반드시 있어야 하지만, 손상·위조된 세이브가 school=null로 새면 승계할 학파가 없다 — 방어.
  if (state.ascension.school === null) {
    throw new PromotionError("school-required")
  }
  return trackProgress(applyAscensionSkin({ ...state, ascension: { ...state.ascension, rank: 2 } }))
}

/** 유파 변경 비용(마나수정): 첫 변경 무료 → 25 → 이후 50. */
export function getSchoolRespecCost(schoolRespecs: number): number {
  if (schoolRespecs <= 0) {
    return 0
  }
  return schoolRespecs === 1 ? 25 : 50
}

/** 유파 유료 변경. 마나수정 차감·학파 교체·schoolRespecs+1·스킨 재부여. 환생 크레딧은 적용 안 함. */
export function respecSchool(state: EngineState, school: School): EngineState {
  if (state.ascension.rank < 1) {
    throw new SchoolRespecError("not-promoted")
  }
  if (!isSchool(school)) {
    throw new SchoolRespecError("invalid-school")
  }
  // 같은 학파를 다시 고르면 실제 변경이 없으니 크리스탈을 태우지 않는다(UI도 confirm을 막지만 엔진에서 방어).
  if (school === state.ascension.school) {
    throw new SchoolRespecError("same-school")
  }

  const cost = getSchoolRespecCost(state.ascension.schoolRespecs)
  if (state.manaCrystals < cost) {
    throw new InsufficientManaCrystalsError(cost, state.manaCrystals)
  }

  return applyAscensionSkin({
    ...state,
    manaCrystals: state.manaCrystals - cost,
    ascension: { ...state.ascension, school, schoolRespecs: state.ascension.schoolRespecs + 1 },
  })
}

export function claimQuestReward(state: EngineState, questId: string): EngineState {
  const refreshed = refreshQuests(state)
  const quest = findQuest(questId)
  if (quest === null) {
    throw new QuestClaimError(questId, "missing")
  }
  if (!getVisibleQuests(refreshed).some((visibleQuest) => visibleQuest.id === questId)) {
    throw new QuestClaimError(questId, "locked")
  }
  if (!refreshed.quests.completed.includes(questId) && !quest.isComplete(refreshed)) {
    throw new QuestClaimError(questId, "incomplete")
  }
  if (refreshed.quests.claimed.includes(questId)) {
    throw new QuestClaimError(questId, "claimed")
  }

  return trackProgress({
    ...refreshed,
    gold: refreshed.gold + quest.reward.gold,
    skillPoints: refreshed.skillPoints + quest.reward.skillPoints,
    quests: {
      completed: refreshed.quests.completed,
      claimed: [...refreshed.quests.claimed, questId],
    },
  })
}

export function selectTrait(state: EngineState, slot: TraitSlot, traitId: TraitId): EngineState {
  return trackProgress(selectTraitPick(state, slot, traitId))
}
