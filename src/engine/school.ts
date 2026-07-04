import { BOSS_ENRAGE_MS, BOSS_WAVE, INITIAL_STAGE } from "./constants.js"
import type { AscensionState, Element, EngineState, School } from "./types.js"

// R5 유파(학파) 오버레이. 원칙(스펙 B): 기존 공명·데미지 공식은 보존하고, 선택한 학파가
// 그 위에 곱해지는 증폭기만 얹는다. 원소 특성(pyroGlyphs/deepFreeze/sanctifiedAim)은
// 학파에 자동 내장한다. 여기의 함수는 전부 순수 함수 — 저장하지 않는다.

export const DEFAULT_ASCENSION: AscensionState = { rank: 0, school: null, schoolRespecs: 0 }

/** 정식(rank1) 이상이면서 이 원소가 선택 학파일 때만 true. */
function ownsSchool(state: EngineState, element: School): boolean {
  return state.ascension.rank >= 1 && state.ascension.school === element
}

/**
 * 공명 요구 흡수: 선택 학파 주원소만 요구 3→2. 나머지 원소는 base 그대로.
 * (전체 적용 시 딜 폭주 — 스펙 B)
 */
export function getSchoolResonanceRequirement(state: EngineState, element: Element, base: number): number {
  return ownsSchool(state, element) ? Math.max(2, base - 1) : base
}

/**
 * 화염 학파의 targetCap 가산: 정식 +1(목업), 대마법사도 +1(누적 없음).
 * (밸런스 재증명 2026-07-04: 대마법사 다중타격 상한 +2가 클리어 속도→골드→book을 밀어
 *  Day-7 티어캡을 딱 클리어시켰다. 딜 배수 조정은 시뮬이 카오스틱해 Day-1을 흔들 뿐 book을
 *  못 낮춘다 — book의 실제 레버는 동시 타격 수였다. 대마법사 targetCap 누적만 제거(+1 유지).
 *  정식 +1·게이트·나머지 화염 계수는 불변.)
 */
export function getSchoolFireTargetCapBonus(state: EngineState): number {
  if (state.ascension.school !== "fire" || state.ascension.rank < 1) {
    return 0
  }
  return 1
}

/**
 * 냉기 학파의 둔화 강화(deepFreeze 내장 +0.10/+500ms 포함).
 * 정식 factor +0.25·dur +1500, 대마법사 dur +3000.
 */
export function getSchoolFrostSlowBonus(state: EngineState): { readonly factor: number; readonly durationMs: number } {
  if (state.ascension.school !== "frost" || state.ascension.rank < 1) {
    return { factor: 0, durationMs: 0 }
  }
  return { factor: 0.25, durationMs: state.ascension.rank >= 2 ? 3_000 : 1_500 }
}

/** 신성 학파의 보스 배율 가산(sanctifiedAim 내장 +0.25 포함): 정식 +0.75, 대마법사 +1.25. */
export function getSchoolHolyBossBonus(state: EngineState): number {
  if (state.ascension.school !== "holy" || state.ascension.rank < 1) {
    return 0
  }
  return state.ascension.rank >= 2 ? 1.25 : 0.75
}

/** 학파 원소 피해 배수(pyroGlyphs 내장): 화염 정식×1.2/대마법사×1.5, 냉기·신성 대마법사×1.3. */
export function getSchoolElementDamageMultiplier(state: EngineState, element: Element): number {
  if (state.ascension.rank < 1 || state.ascension.school !== element) {
    return 1
  }
  switch (element) {
    case "fire":
      return state.ascension.rank >= 2 ? 1.5 : 1.2
    case "frost":
      return state.ascension.rank >= 2 ? 1.3 : 1
    case "holy":
      return state.ascension.rank >= 2 ? 1.3 : 1
    default:
      return 1
  }
}

// ── 신규 패시브 계수 (스펙 B) ──────────────────────────────────────────────

/** 연쇄 발화(화염 정식+): targetCap 초과 대상이 받는 스플래시 비율. */
export function getChainIgnitionSplash(state: EngineState): number {
  return state.ascension.school === "fire" && state.ascension.rank >= 1 ? 0.2 : 0
}

/** 겁화(화염 대마법사): 보스가 30초(BOSS_ENRAGE_MS) 넘게 버티면 화염 피해 ×2. */
export function getInfernoMultiplier(state: EngineState): number {
  if (
    state.ascension.school === "fire" &&
    state.ascension.rank >= 2 &&
    state.wave === BOSS_WAVE &&
    state.bossElapsedMs >= BOSS_ENRAGE_MS
  ) {
    return 2
  }
  return 1
}

/** 빙결 축적(냉기 정식+): 둔화(frostSlowMs>0)에 걸린 적에게 주는 피해 +15%. */
export function getFrostBuildupMultiplier(state: EngineState): number {
  return state.ascension.school === "frost" && state.ascension.rank >= 1 && state.frostSlowMs > 0 ? 1.15 : 1
}

/** 절대영도(냉기 대마법사): 일반 웨이브 냉기 타격이 대상 현재 HP의 20%를 추가 즉결. */
export function getAbsoluteZeroExecute(state: EngineState): number {
  return state.ascension.school === "frost" && state.ascension.rank >= 2 && state.wave !== BOSS_WAVE ? 0.2 : 0
}

/** 심판의 빛(신성 정식+): 보스 처치 골드 +25%. */
export function getJudgmentGoldMultiplier(state: EngineState): number {
  return state.ascension.school === "holy" && state.ascension.rank >= 1 ? 1.25 : 1
}

/**
 * 성역(신성 대마법사): 환생 후 첫 보스까지 신성 ×2.
 * 별도 상태 없이 "환생 이력 있고 아직 첫 스테이지(INITIAL_STAGE)를 못 넘긴 구간"으로 근사한다.
 */
export function getSanctuaryMultiplier(state: EngineState): number {
  return state.ascension.school === "holy" &&
    state.ascension.rank >= 2 &&
    state.prestigeCount > 0 &&
    state.stage === INITIAL_STAGE
    ? 2
    : 1
}
