# R5 엔진 구현 — 인수인계 (2026-07-04, 세션 중단)

작업 루트: `~/projects/merge-mage-redesign`, 브랜치 `redesign` 전용.
금지: main·타 브랜치, git push, 배포, 원격 테스트 API, `LOOP.md`·`plans`·`.github`·`AGENTS.md` 수정.
권위 소스: `docs/specs/2026-07-04-redesign-tracks.md`의 R5 스펙 A~G + `docs/redesign-assets/r5-engine-prompt.txt`.

## 현재 상태 — 엔진 코어 ~90% 완료, 미커밋(worktree dirty)

`npx tsc --noEmit` 남은 에러 **3곳뿐** (아래 "남은 작업"이 전부 처리):
- `src/ui/useEngine.ts:232` — `toastPromoted` i18n 키 미추가
- `src/engine/progression.test.ts:91/97/101` — 옛 `lv8`/`elementalCycle` 테스트(재작성 필요)
- `src/ui/WizardPanel.tsx:129` — `requiredLevel`(제거됨) 참조(재작성 필요)

### 완료된 변경 (수정 파일)
- **types.ts**: `SCHOOLS`, `School`, `AscensionRank(0|1|2)`, `AscensionState{rank,school,schoolRespecs}`, `EngineState.ascension` 추가.
- **school.ts (신규)**: 학파 오버레이 순수함수 전부. `DEFAULT_ASCENSION` export. 계수:
  - 공명 요구: `getSchoolResonanceRequirement(state,element,base)` — 선택 학파 원소만 3→2.
  - 화염: `getSchoolFireTargetCapBonus`(정식+1/대마법사+2), `getSchoolElementDamageMultiplier`(정식×1.2/대마법사×1.5), `getChainIgnitionSplash`(0.2), `getInfernoMultiplier`(보스 30s↑ ×2).
  - 냉기: `getSchoolFrostSlowBonus`(factor+0.25·dur+1500→+3000, deepFreeze 내장), 대마법사×1.3, `getFrostBuildupMultiplier`(둔화 적 +15%), `getAbsoluteZeroExecute`(일반웨이브 20% 즉결).
  - 신성: `getSchoolHolyBossBonus`(정식+0.75/대마법사+1.25, sanctifiedAim 내장), 대마법사×1.3, `getJudgmentGoldMultiplier`(보스골드×1.25), `getSanctuaryMultiplier`(신성 대마법사 & prestigeCount>0 & stage===INITIAL_STAGE → ×2).
  - **설계 결정**: 성역·절대영도는 상태 필드 추가 없이 기존 state로 근사(주석에 명시). 스펙 E의 `AscensionState`는 3필드 그대로 유지.
- **traits.ts**: 비전 각인으로 재정의. `TRAIT_IDS`=공용 5종(chainCast/goldenLibrary/quickHands/treasureOath/archmageFocus), 원소 특성 id 제거. 슬롯 `arcane1{chainCast,goldenLibrary}`·`arcane2{quickHands,treasureOath}`·`arcane3{archmageFocus}`, `requiredRank` 1/1/2. `getUnlockedTraitSlots(rank)`(정식 2·대마법사 3·견습 0), `getSlotRequiredRank`. `hasTrait`는 **열린 슬롯 픽만** 유효(이관 픽이 견습에서 무효). `canSelectTrait`/`selectTraitPick`은 rank 게이팅. `getResonanceRequirement`→항상 3. 원소 특성 getter 3종 삭제.
- **resonance.ts**: 원소별 요구값 + 학파 보너스(targetCap/factor/dur/bossMult) 반영.
- **battle.ts**: `getElementProgressionMultiplier`가 학파 원소배수 사용. `applyCastDamage`에 연쇄발화 스플래시 + 절대영도 즉결. `getElementDamage`에 빙결축적·겁화·성역.
- **battleRewards.ts**: 보스 골드에 심판의 빛(×1.25).
- **camp.ts**: `SkinId`에 대마법사 3종(archmagePyro/Cryo/Lumen) 추가. `getAscensionSkinId(rank,school)`·`applyAscensionSkin(state)`. `isSkinUnlocked`은 (rank,school) 결정론(카운터 언락 폐지, `getAchievementMilestoneCount`/`getThresholdCount` 삭제). `getExpectedBookDamage`가 학파 원소배수 사용.
- **progressionActions.ts**: `promoteClass(state,school?)`·`respecSchool(state,school)`·`getPromotionStatus(state)`·`getSchoolRespecCost(n)`(0→free,1→25,else 50). 게이트: 정식=prestige≥1 & Lv12, 대마법사=prestige≥4 & Lv30 & highestStage≥20.
- **actions.ts**: 전직 액션·에러 재export. **prestige가 ascension 보존**.
- **errors.ts**: `PromotionError`·`SchoolRespecError`. **engineActionHelpers.ts**: `isExpectedEngineError`에 두 에러 추가.
- **state.ts**: `createInitialState`에 `ascension: DEFAULT_ASCENSION`.
- **engineStorage.ts**: `SAVE_VERSION=5`. `migrateV4State`(ascension 초기화 + `foldTraitsToArcane`로 공용 특성만 새 슬롯 이관, 원소 id 폐기, school 자동추론 X). v2/v3 마이그레이션도 `migrateV4State`로 체인. `isEngineState`=`isV4EngineState`+`isAscensionState`.
- **api/_lib/schemas.ts + stateDefaults.ts**: `ascensionSchema.default(defaultAscensionState)` — 서버 zod 관대. (별도 서버 state 검증 파일은 이것뿐 — "server zod 없음"이 아니라 여기 있음.)
- **simulate.ts**: `selectGreedyTraits`→`promoteGreedy`(화염 기본 승급 + arcane1 goldenLibrary/arcane2 quickHands/arcane3 archmageFocus). 복제 전투로직에 학파 계수 전부 미러링. `createInitialSimulationState`에 ascension 기본값. (prestigeForBalance는 `...state`로 ascension 자동 보존.)
- **useEngine.ts**: `promoteClass(school?)`·`respecSchool(school)` 배선(반환·타입·핸들러). `toastPromoted` 키 사용(미추가 상태).
- **CampPanel.tsx + i18n.ts**: 대마법사 스킨 3종 카피(en/ko) 추가.

## 남은 작업 (순서대로)

1. **i18n.ts**: `toastPromoted`(en/ko) 추가. WizardPanel용 카피 키 추가(클래스명 견습/정식/대마법사, 학파명, 전직 CTA/진행도, 비전 각인, 유파 변경, 학파 효과 요약). 카피는 **학파(school)/클래스(rank)** 용어 통일(스펙 R5 용어절).
2. **WizardPanel.tsx 재작성** (기본 동작 UI만, 연출·목업 CSS 금지). 필수 data-testid:
   `identity-header`·`promote-card`·`promote-btn`·`school-modal`·`school-card-fire`·`school-card-frost`·`school-card-holy`·`school-confirm`·`school-respec-btn`. 유지: `resonance-row`·`codex-grid`·`skill-*`.
   - 정체성 헤더(클래스×학파), 전직 카드(`getPromotionStatus`로 eligible CTA/진행도/최대치), 학파 모달(3카드+확정, 견습→정식은 학파 필수·정식→대마법사는 학파 없이 승계), 유파 변경 버튼(모달 respec 모드), 비전 각인 슬롯(`getUnlockedTraitSlots`·새 슬롯 id·rank 게이팅), 스킬·공명·도감 유지.
   - props에 `onPromoteClass`·`onRespecSchool` 추가.
3. **renderTab.tsx**: WizardPanel에 `onPromoteClass={engine.promoteClass}`·`onRespecSchool={engine.respecSchool}` 전달.
4. **테스트 갱신/신규**:
   - `progression.test.ts` (85~102): 옛 `lv8`/`elementalCycle`/respec 테스트 → 학파 공명·비전 각인 respec로 재작성.
   - `WizardPanel.test.tsx`: 특성 카드가 레벨이 아니라 **rank 게이팅**(정식 이상). "Wizard Lv8"/LOCKED 문구 사라짐 — testid 기반으로 갱신.
   - `camp.test.ts` (137~162): 스킨 언락이 (rank,school) 결정론 — 재작성.
   - `engineStorage.test.ts` (48~49 `.toBe(4)`→5; v2/v3 마이그레이션 기대값 점검; **v4→v5 마이그레이션 테스트 신규**: ascension 기본값·공용특성 이관·원소특성 폐기·school 추론 안 함).
   - `state.test.ts`: ascension 기본값 단언 추가(선택).
   - `actions.test.ts` prestige: ascension 보존 단언 추가(선택).
   - **신규 엔진 테스트**: `promoteClass`(게이트·학파필수·승계·스킨), `respecSchool`(무료→25→50·마나차감), `getPromotionStatus`, 학파 패시브(공명 3→2 선택원소 한정·화염 배수·연쇄발화·겁화·빙결축적·심판골드·성역).
5. **밸런스 시뮬 검증·튜닝**: `simulate.test.ts`가 첫벽 8~12분·첫환생 25~35분·Day1 stage 35~50·Day7 book<100을 이미 단언. 화염 학파 버프로 곡선이 밀리면 **게이트·계수 조정 후 최종값 보고**. 수동 확인: `npx tsx src/engine/simulate.ts --summary` (또는 vitest).
6. **`npm run test` + `npm run build` 그린**.
7. **커밋** (redesign, 메시지 말미 정확히): `Co-Authored-By: Claude <noreply@anthropic.com>`
8. **보고(한국어)**: (1)A~G 구현표 (2)밸런스 수치+최종 게이트·계수 (3)data-testid 변경목록(trait 슬롯 lv8/16/24→arcane1/2/3 포함) (4)신규/갱신 테스트 (5)이 작업 git log --oneline (6)git status --short.

## 주의
- 순환 import 없음 확인됨. school.js는 constants+types만 import.
- `getUnlockedTraitSlots`는 `rank>=1`에서만 슬롯 반환(견습 0). WizardPanel·테스트가 이에 의존.
- 시뮬 기본 학파=화염. 냉기·신성 패시브는 시뮬에 안 뜸(유닛테스트로만 검증).
