[2m2026-07-04T07:01:27.557523Z[0m [33m WARN[0m plugin name collision resolved by scope precedence [3mplugin_name[0m[2m=[0mcodex [3mwinner[0m[2m=[0m/Users/ahndohun/.claude/plugins/marketplaces/openai-codex/plugins/codex [3mloser[0m[2m=[0m/Users/ahndohun/.claude/plugins/cache/openai-codex/codex/1.0.5
[2m2026-07-04T07:01:27.644180Z[0m [33m WARN[0m plugin name collision resolved by scope precedence [3mplugin_name[0m[2m=[0mcodex [3mwinner[0m[2m=[0m/Users/ahndohun/.claude/plugins/marketplaces/openai-codex/plugins/codex [3mloser[0m[2m=[0m/Users/ahndohun/.claude/plugins/cache/openai-codex/codex/1.0.5
[2m2026-07-04T07:01:28.222075Z[0m [33m WARN[0m repo_state.git.collect failed [3merror[0m[2m=[0mgit repo discovery failed: not a git repository: /Users/ahndohun/Documents/Codex/2026-07-04/new-chat: Could not find a git repository in '/Users/ahndohun/Documents/Codex/2026-07-04/new-chat' or in any of its parents [3merror_debug[0m[2m=[0mgit repo discovery failed

Caused by:
    0: not a git repository: /Users/ahndohun/Documents/Codex/2026-07-04/new-chat
    1: Could not find a git repository in '/Users/ahndohun/Documents/Codex/2026-07-04/new-chat' or in any of its parents [3melapsed_us[0m[2m=[0m109
[2m2026-07-04T07:01:28.222661Z[0m [33m WARN[0m Codebase upload failed: repo data collection or manifest preparation error [3merror[0m[2m=[0mgit repo discovery failed: not a git repository: /Users/ahndohun/Documents/Codex/2026-07-04/new-chat: Could not find a git repository in '/Users/ahndohun/Documents/Codex/2026-07-04/new-chat' or in any of its parents [3merror_debug[0m[2m=[0mgit repo discovery failed

Caused by:
    0: not a git repository: /Users/ahndohun/Documents/Codex/2026-07-04/new-chat
    1: Could not find a git repository in '/Users/ahndohun/Documents/Codex/2026-07-04/new-chat' or in any of its parents
[2m2026-07-04T07:01:30.102464Z[0m [33m WARN[0m Skipping OAuth MCP in non-interactive mode (no stored tokens); authenticate in TUI or set an Authorization header [3mserver[0m[2m=[0m"tinyfish"
[2m2026-07-04T07:01:30.102665Z[0m [33m WARN[0m Failed to spawn MCP server: MCP server 'tinyfish': Auth required (non-interactive session; authenticate in TUI or set Authorization header)
[2m2026-07-04T07:01:30.102733Z[0m [33m WARN[0m MCP server spawn failed, removing from initializing set [3mserver[0m[2m=[0m"tinyfish"
지정하신 파일들을 먼저 읽어 현재 엔진·UI·트랙 문서를 파악한 뒤 R5 전직·유파 설계안을 작성하겠습니다.
[2m2026-07-04T07:01:35.427923Z[0m [33m WARN[0m session registry summary sync failed after title generation [3merror[0m[2m=[0msession update failed: 404 Not Found [3msession_id[0m[2m=[0m019f2bee-a38d-7ff1-be75-f534169641a9
스킨·마이그레이션·진행 로직을 추가로 확인해 설계의 정합성을 맞추겠습니다.
# R5 전직·유파 시스템 설계안

**트랙**: redesign / R5  
**원칙**: 최소침습 — `traits.ts`·`resonance.ts` 수식은 유지하고, `school.ts` 래퍼가 가상 특성·공명 보정을 주입한다.  
**제약**: 화폐 3종 유지, 신규 화폐 없음, 머지가 왕, 스킨=전직 보상.

---

## 0. 현황 요약

| 영역 | 현재 구조 |
|------|-----------|
| 특성 | `traits.picks` — Lv8/Lv16/Lv24 슬롯, 슬롯당 3종 선택 (총 9종) |
| 공명 | `getResonance()` — 장착 원소 개수 vs `getResonanceRequirement()`(3 또는 `elementalCycle` 시 2) |
| 스킨 | `camp.ts` — `apprentice` 기본, `ember`/`frost`/`gilded`는 업적·환생 카운터 언락 |
| 마법사 탭 | 스킬 → 특성 3슬롯 → 공명 배지 → 도감 (`WizardPanel.tsx`) |
| 저장 | `SAVE_VERSION = 4`, `traits`·`skins` 필드 존재 |

공명 수치(기준값, `constants.ts`):

- 화염: `targetCap = 3 + ceil(scale)`, scale = mono 1.5 / 일반 1  
- 냉기: `factor = 0.2 + 0.15×scale`, `durationMs = 2000 + 1000×scale` (+ `deepFreeze` 시 +0.1, +500ms)  
- 신성: `bossMultiplier = 2 + 0.5×scale` (+ `sanctifiedAim` 시 +0.25)

---

## 1. 전직 3단계 — 조건·타이밍 (상태값 기준)

### 1.1 신규 상태 필드

```typescript
type PromotionTier = 0 | 1 | 2   // 견습 | 정식 | 대마법사
type School = "fire" | "frost" | "holy" | null

type PromotionState = {
  readonly tier: PromotionTier
  readonly school: School
}
```

- `EngineState`에 `promotion: PromotionState` **1필드만** 추가.
- `pending`·`modalSeen` 등 UI 플래그는 **저장하지 않음** — 파생 함수로 계산.

```typescript
function getPromotionOffer(state): "formal" | "archmage" | null
  // tier===0 && wizardLevel>=8  → "formal"
  // tier===1 && school!==null && wizardLevel>=24 → "archmage"
  // 그 외 → null
```

### 1.2 단계 정의

| tier | 명칭 | 진입 조건 (상태값) | 플레이어 액션 | 타이밍 |
|------|------|-------------------|--------------|--------|
| **0** | 견습 | 초기값 `{ tier:0, school:null }` | 없음 | ~Lv1–7 |
| **1** | 정식 | `tier===0` ∧ `wizardLevel≥8` | `promoteFormal(state, school)` 1회 | **Lv8 달성 직후** (기존 Lv8 특성 슬롯 대체) |
| **2** | 대마법사 | `tier===1` ∧ `school≠null` ∧ `wizardLevel≥24` | `promoteArchmage(state)` 1회 | **Lv24 달성 직후** (기존 Lv24 특성 슬롯 대체) |

- Lv16은 **별도 전직 없음** — 구 Lv16 특성(원소 특화)은 Lv8 유파 선택에 흡수.
- 환생(`prestige`) 시 `wizardLevel`·`promotion`·`skins`는 **유지** (`actions.ts`의 `traits` 보존 패턴과 동일).
- 언락 폭포 `wizard: wizardLevel≥3` — 변경 없음. 전직 UI는 마법사 탭 내부에서 Lv8부터 표면화.

### 1.3 전직 순간 연출 (UI·이벤트, 엔진 최소)

- `levelUp` 이벤트 후 `getPromotionOffer(state)≠null`이면 마법사 탭 배지 + 전면 모달.
- 정식: 유파 3종 카드 선택(필수, 닫기 불가).
- 대마법사: 기존 유파 확인·강화 연출(재선택 없음).
- BattleBanner: `"promotion"` 타입 추가는 **선택** — R5 필수 아님(토스트+탭 펄스로 충분).

---

## 2. 유파 3종 효과 — 공명/특성 흡수 (수치)

### 2.1 래퍼 메커니즘 (`school.ts` 신규)

```
getEffectiveTraits(state) → traits.picks를 합성해 반환
traits.ts 각 getter 진입부: state' = applySchoolOverlay(state)
resonance.ts getScale(): schoolScaleBonus(state, element) 가산 (2~3줄)
```

- `traits.picks` **물리 필드는 유지**하되, 런타임 getter는 합성 picks를 우선.
- 기존 `getResonance`·`getTrait*` **공식 변경 없음** — 주입만으로 동일 결과 재현.

### 2.2 흡수 매핑표

| 구 시스템 | 흡수 위치 |
|-----------|-----------|
| Lv8 `elementalCycle` (공명 2권) | 정식 유파 공통 |
| Lv16 `pyroGlyphs` / `deepFreeze` / `sanctifiedAim` | 정식 유파별 |
| Lv24 `archmageFocus` + `quickHands` | 대마법사 공통 |
| Lv8 `chainCast`·`goldenLibrary`, Lv24 `treasureOath` | **흡수·폐기** → 마법사 마일스톤(Lv10 시전, Lv30 골드)으로 대체 |
| 장착 기반 공명 배지 | 유지 — 유파는 **같은 원소 장착 시 보너스 증폭** |

### 2.3 정식 (tier 1) — 유파 선택 시 합성 picks

| 유파 | 가상 `lv8` | 가상 `lv16` | 공명 requirement | 추가 피해/효과 |
|------|-----------|------------|------------------|----------------|
| **화염** | `elementalCycle` | `pyroGlyphs` | 2 | 화염 피해 ×1.20 |
| **냉기** | `elementalCycle` | `deepFreeze` | 2 | 둔화 +0.10 factor, +500ms |
| **신성** | `elementalCycle` | `sanctifiedAim` | 2 | 보스 배율 +0.25 |

**공명 수치 예시 (정식, 3권 동원소, mono 아님)** — 기존 공식 그대로:

| 유파 | 활성 조건 | 화염 cap | 냉기 slow | 신성 보스배율 |
|------|----------|---------|-----------|--------------|
| 화염 유파 | fire≥2 | **4** (3+1) | (비활성) | — |
| 냉기 유파 | frost≥2 | — | factor **0.35**, 3000ms | — |
| 신성 유파 | holy≥2 | — | — | **2.75** (2+0.5+0.25) |

### 2.4 대마법사 (tier 2) — 추가 합성·스케일 보정

정식 picks 유지 + 아래 추가:

| 항목 | 수치 |
|------|------|
| 가상 `lv24` | `archmageFocus` + `quickHands` (도감 티어당 +1% 피해, 시전 ×0.9) |
| `getSchoolScaleBonus(state, element)` | **선택 유파 원소**이고 `count≥requirement`일 때 scale에 **+0.5** |

**대마법사 공명 예시 (선택 유파 3권, mono 아님)**:

| 유파 | scale (기존1 + 보너스0.5) | 화염 cap | 냉기 slow | 신성 보스배율 |
|------|-------------------------|---------|-----------|--------------|
| 화염 | 1.5 | **5** (3+2) | — | — |
| 냉기 | 1.5 | — | factor **0.425**, 3500ms (+deep) | — |
| 신성 | 1.5 | — | — | **3.0** (2+0.75+0.25) |

**mono(6권) 시** 기존 1.5에 +0.5 → effective scale **2.0** (화염 cap 5, 신성 보스 3.25+0.25=3.5 등).

### 2.5 견습 (tier 0) 밸런스

- 합성 picks **없음** → 공명 requirement **3**, 원소 특성 보너스 **0**.
- Lv1–7 구간은 의도적으로 약함 — Lv8 전직이 첫 “진짜 특화” 스파이크.
- 머지 동기: 유파별 공명은 **장착 원소 구성**에 달려 있으므로, 고레벨 동원소 구슬 머지·장착이 핵심.

---

## 3. 스킨 매핑

### 3.1 원칙

- **스킨 = 전직 보상** — 카운터 언락(보스 25킬, 환생 3회 등) **폐기**.
- 스킨 ID **신규 발행 없음** — 기존 4종 재매핑.

| skinId | 전직 조건 | 자동 지급 시점 | 비고 |
|--------|----------|---------------|------|
| `apprentice` | tier 0 (기본) | 신규 세이브 | tint `0xffffff` |
| `ember` | tier≥1 ∧ school=`fire` | `promoteFormal(..., "fire")` | 정식 화염 로브 |
| `frost` | tier≥1 ∧ school=`frost` | `promoteFormal(..., "frost")` | 정식 냉기 로브 |
| `gilded` | tier≥1 ∧ school=`holy` | `promoteFormal(..., "holy")` | 정식 신성 로브 |

- 전직 확정 시: `skins.owned`에 추가 + **해당 스킨 자동 장착**.
- **대마법사(tier 2)**: 신규 skinId 없음 — Phaser 위저드 tint 강화(밝기 +10%) 또는 로브 오라 파티클. `promotion.tier===2`로 파생.

### 3.2 `camp.ts` 변경 방향

```typescript
isSkinUnlocked(state, skinId):
  apprentice → true
  ember/frost/gilded → promotion.tier>=1 && school 일치
  // 기존 counter 분기 제거
```

### 3.3 v4→v5 마이그레이션 (스킨)

1. 이미 `owned`에 `ember`/`frost`/`gilded` 있으면 **그대로 보존** (그랜드파더).
2. `traits.picks.lv16`으로 school 추론 시 tier≥1이면 해당 스킨 `owned`에 병합.
3. 신규 플레이어는 전직으로만 획득.

---

## 4. 상태·액션·SAVE_VERSION 마이그레이션 변경 목록

### 4.1 `types.ts`

| 변경 | 내용 |
|------|------|
| 추가 | `PromotionState`, `PromotionTier`, `School` |
| 추가 | `EngineState.promotion` |
| 유지 | `TraitState` — 삭제하지 않음 (마이그레이션·회귀 완충) |

### 4.2 `school.ts` (신규 모듈)

| export | 역할 |
|--------|------|
| `applySchoolOverlay(state)` | 합성 traits 주입용 얕은 복사 |
| `getPromotionOffer(state)` | 파생 오퍼 |
| `canPromoteFormal` / `canPromoteArchmage` | 액션 가드 |
| `promoteFormal(state, school)` | tier→1, skin 지급 |
| `promoteArchmage(state)` | tier→2 |
| `getSchoolScaleBonus(state, element)` | resonance scale +0.5 |
| `synthesizeTraitPicks(state)` | 합성 picks 생성 |

### 4.3 `traits.ts` (최소 수정)

- `hasTrait`, `getResonanceRequirement`, `getTrait*` **진입 1줄**: `applySchoolOverlay` 적용.
- `selectTraitPick`, `TRAITS` 상수, `TraitSelectionError` — **deprecated 유지** (테스트·마이그레이션용).

### 4.4 `resonance.ts` (최소 수정)

- `getScale()` 내부: `scale += getSchoolScaleBonus(...)` (tier 2·해당 원소만).

### 4.5 `actions.ts` / `progressionActions.ts`

| 액션 | 변경 |
|------|------|
| **추가** | `promoteFormal`, `promoteArchmage` (→ `progressionActions` export) |
| **유지** | `selectTrait` — 내부/마이그레이션 전용, UI에서 제거 |
| **수정** | `prestige` — `promotion`, `skins` 보존 (`traits`와 동일 패턴) |

### 4.6 `camp.ts`

- `isSkinUnlocked` 전직 기반으로 교체.
- `getUnlockedSkinsFromCounters` — promotion 병합.

### 4.7 `quests.ts`

| 퀘스트 | 기존 완료 조건 | 신규 조건 |
|--------|--------------|----------|
| `chain-08` | `traits.picks.lv8` | `promotion.tier ≥ 1` |
| `chain-16` | `traits.picks.lv16` | `promotion.tier ≥ 1` (흡수 — 정식과 동시 달성) |
| `chain-19` | `traits.picks.lv24` | `promotion.tier ≥ 2` |

- `chain-16`은 완료 시점이 `chain-08`과 겹침 — 의도적(구 Lv16 특성이 Lv8에 흡수됐으므로). 카피만 “유파 각인”으로 수정.

### 4.8 `simulate.ts`

- `selectGreedyTraits` → `selectGreedyPromotion`: Lv8에 `fire`+정식, Lv24에 `promoteArchmage`.
- 밸런스 곡선 재검증 필수 (첫 벽 8~12분, 첫 환생 25~35분).

### 4.9 `engineStorage.ts` — **SAVE_VERSION 5**

| 항목 | 내용 |
|------|------|
| 버전 | `SAVE_VERSION = 5` |
| `migrateV4State` | `promotion` 기본값 주입 |
| 추론 로직 | `lv16` pick → `school`, `lv24` 존재 → `tier=2`, `lv8`만 → `tier=1` |
| `traits.picks` | **삭제하지 않음** — 읽기 전용 유산 |
| `isEngineState` | `promotion` 필드 검증 추가 |
| v4 세이브 | `readVersionedSave`에서 v4→migrateV4→v5 경로 |

### 4.10 `state.ts`

- `createInitialState`: `promotion: { tier: 0, school: null }`.

### 4.11 변경 **하지 않는** 모듈

- `battle.ts` / `battleRewards.ts` — `getTrait*`·`getResonance` 경유로 자동 반영.
- `merge.ts`, 화폐, 균열 엔진 — 무변경.

---

## 5. 마법사 탭 UI 재구성

### 5.1 정보 구조 (위→아래)

```
┌─ 전직 헤더 ─────────────────────────┐
│  [견습|정식|대마법사]  배지 + 유파 문장  │
│  (오퍼 있으면 CTA: "전직 가능")        │
└─────────────────────────────────────┘
┌─ 전직 모달/인라인 (조건부) ───────────┐
│  정식: 화염/냉기/신성 카드 3          │
│  대마법사: 강화 확인 + 수치 프리뷰    │
└─────────────────────────────────────┘
┌─ 스킬 포인트 (기존 유지) ─────────────┐
└─────────────────────────────────────┘
┌─ 유파·공명 (TraitsSection 제거) ──────┐
│  선택 유파 요약 카드 (흡수 특성 목록)  │
│  ResonanceBadges — 유파 원소 강조     │
│  (비유파 원소는 dim 처리)             │
└─────────────────────────────────────┘
┌─ 도감 (기존 유지) ────────────────────┐
└─────────────────────────────────────┘
```

### 5.2 제거·이동

| 제거 | 대체 |
|------|------|
| `TraitsSection` (3슬롯 9카드) | 정식 모달 유파 3카드 |
| `trait-lv8-*` testid | `promotion-formal-fire` 등 |
| 캠프 스킨 카운터 설명 | “전직 보상” 라벨 |

### 5.3 `ResonanceBadges` 보강

- `promotion.school` 있으면 해당 `element` 배지에 `is-school` 클래스 + cap/배율 **프리뷰 수치** 표기.
- 견습: 기존과 동일, requirement 3 안내.

### 5.4 i18n

- `traitTitle`/`traitDescription` 9종 → `schoolFireTitle`, `schoolFormalDesc`, `promotionArchmageDesc` 등 **전직·유파 카피**로 이전.
- 기존 trait 문자열은 마이그레이션 릴리스 후 제거 가능(1버전 유예).

### 5.5 data-testid (E2E)

| 신규 | 용도 |
|------|------|
| `promotion-badge` | 현재 tier |
| `promotion-offer-formal` | Lv8 오퍼 |
| `promotion-formal-{fire,frost,holy}` | 유파 선택 |
| `promotion-offer-archmage` | Lv24 오퍼 |
| `promotion-confirm-archmage` | 대마법사 확정 |
| `school-summary` | 흡수 효과 요약 |

유지: `resonance-row`, `resonance-{element}`, `codex-grid`, `skill-plus-*`.

---

## 6. 밸런스 영향·리스크·테스트 충돌

### 6.1 밸런스 영향

| 구간 | 영향 |
|------|------|
| Lv1–7 견습 | 공명 3권·특성 없음 → **소폭 약화** (의도) |
| Lv8 정식 | 구 최적빌(`elementalCycle`+원소특성)과 **동등** |
| Lv24 대마법사 | 구 `archmageFocus`+`quickHands`+scale+0.5 → **동등~소폭 상향** (mono 빌드) |
| 골드 | `goldenLibrary`/`treasureOath` 제거 → Lv30 마일스톤(+10%)로 **순손실 ~5–15%** — 시뮬로 확인·필요 시 `WIZARD_GOLD_MULTIPLIER` 미세 조정 |
| 머지 | 유파 공명이 장착 구성 의존 → **고레벨 동원소 머지 동기 강화** (머지가 왕 정합) |

**시뮬 재증명 목표** (R1 기준 유지): 첫 벽 8~12분, 첫 환생 25~35분, Day-7 book <100.

### 6.2 리스크

| 등급 | 리스크 | 완화 |
|------|--------|------|
| **중** | v4 세이브 school 추론 오류 (lv16 미선택) | lv8만 있으면 UI에서 재선택 오퍼; 기본값 `fire` + 로그 |
| **중** | 기존 최적화 시뮬(`selectGreedyTraits`) 무효화 | `selectGreedyPromotion` 교체 + 곡선 비교 보고 |
| **低** | 캠프 스킨 UI 빈 목록 (구 카운터 기대) | 카피·조건 동시 수정 |
| **低** | 환생 후 전직 tier 유지로 신규 플레이어 압도 | 의도된 메타 진행 — 견습 구간만 짧게 약함 |

### 6.3 테스트 충돌 예상 (파일별)

| 파일 | 충돌 내용 | 대응 |
|------|----------|------|
| `progression.test.ts` | trait 선택·공명 4 cap 테스트 | promotion 경로로 rewrite |
| `camp.test.ts` | counter 기반 skin unlock | `promoteFormal` 후 unlock 검증 |
| `engineStorage.test.ts` | v4 스키마, `V3_PROGRESS_KEYS` | v5 migration 케이스 추가 |
| `actions.test.ts` | prestige가 traits 보존 | promotion·skins 보존 assert 추가 |
| `simulate.ts` (내부) | `selectGreedyTraits` | `selectGreedyPromotion` |
| `server/api.test.ts` | zod/state 검증 | `promotion` 필드 관대 허용 |
| `WizardPanel` 컴포넌트 테스트 | trait 카드 | promotion 모달 테스트 |
| E2E (통합 게이트) | `trait-lv8-*` 클릭 플로우 | 전직 모달 플로우로 재작성 |

**회귀 범위 추정**: ~15–25 테스트 수정/신규, 엔진 핵심 diff는 `school.ts` 신규 + `traits`/`resonance` 진입부 + `types`/`storage`/`camp`/`quests`/`simulate` 정책.

---

## 7. 구현 우선순위 (참고 — 설계만)

1. `school.ts` + 단위테스트 (합성 picks·scale 수치 스냅샷)  
2. `traits`/`resonance` 오버레이 연결  
3. `promoteFormal`/`promoteArchmage` 액션 + SAVE v5  
4. `WizardPanel` UI 교체  
5. `camp` 스킨·`quests`·`simulate` 정책  
6. 시뮬 곡선 보고 → 통합 게이트

---

## 8. 설계 한 줄 요약

**Lv8에 유파(화염/냉기/신성)를 고르면 구 특성·공명이 한 번에 각인되고, Lv24에 대마법사로 스케일이 한 단계 올라가며, 스킨은 그 전직의 로브 보상이다** — 엔진 심장(`merge`·`battle`·화폐)은 건드리지 않고, `school.ts` 래퍼가 기존 `traits`/`resonance` 수식을 그대로 재활용하는 **위험 대비 이득이 가장 확실한** R5 안이다.
