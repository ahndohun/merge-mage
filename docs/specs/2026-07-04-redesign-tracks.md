# Arcane Ascension 재설계 (트랙 R) — 웨이브 맵과 R1 스펙

디렉터 승인: 2026-07-04. 제안서 정본: https://claude.ai/code/artifact/9cafc25b-c6ae-4f06-bcd1-8c2fbae9707f
브랜치: `redesign` (라이브 main과 분리). 각 웨이브 끝에 프리뷰 검수 게이트. E2E 플랜 재작성은 트랙 통합 시점에 일괄.

## 확정된 기둥
1. **머지가 왕** — 모든 시스템은 "다음 머지를 더 맛있게"로 수렴. 설명 안 되면 흡수.
2. **마법사의 여정** — 견습→정식→대마법사 전직이 뼈대. 시스템은 전직·레벨 순간에 열린다.
3. **화폐 3종** — 골드(단기·구매) / 마나수정(환생·영구) / 스킬포인트(레벨). 신규 화폐 발행 금지.
4. **원소·속성이 합성 단위** — 마법서가 아니라 원소 구슬을 합친다 (디렉터 지정).
5. 볼륨 유지 — 컷 없음, 재배치·연결만.

## 웨이브
- **R1 화폐 통합 + 언락 폭포** (이 문서 아래 스펙)
- **R2 원소 재테마** — 합성 단위 책→원소 구슬 (스프라이트 생성 병행 중, 카피·도감·연출 전환)
- **R3 IA 재배치** — 탭 6→5(마법서/마법사/여정/캠프/환생), 웨이브 정보 HUD 통합, 랭킹→HUD 아이콘, 데스크톱 3열
- **R4 시스템 연결** — 여정(퀘스트+NEXT GOAL+일일미션 통합), 캠프(펫이 광산을 캔다), 균열→전장 포탈
- **R5 전직·유파** — 공명+특성을 전직 선택으로 흡수, 스킨=전직 보상, 연출 통일
- **통합 게이트** — 밸런스 시뮬 재증명, E2E 재작성, 신선한 눈 실사용, 라이브 교체 판단

## R1 스펙 — 화폐 통합 + 언락 폭포

### A. 화폐 통합 (엔진)
- `manaStone`(광산 산출 재화) 폐지 → 광산·일일미션 보상을 `manaCrystals`(마나수정)로 통합.
- 환율 설계: 환생이 주 수입원으로 남아야 한다. 광산은 시간당 소량(기존 마나석 12/h → 크리스탈 환산 시 첫 환생 획득량의 5% 수준/h을 넘지 않게). 일일미션 보상도 같은 원칙.
- `SAVE_VERSION` 4 마이그레이션: 기존 세이브 manaStone → 크리스탈 환산 편입, 서버 zod 스키마는 관대 원칙 유지.
- HUD 정리: 화폐 3종 원칙에 따라 HUD에는 골드(+환생 해본 뒤 크리스탈)만. "MANA 0" 항목의 정체를 규명해 크리스탈 표기로 통합하거나 제거.
- 시뮬 재검증: `src/engine/simulate.ts`로 첫 벽 8~12분, 첫 환생 25~35분, 7일 클리어 불가 유지 확인. 결과 수치를 보고에 포함.

### B. 언락 폭포 (엔진 파생 + UI)
- 파생 함수 `getUnlockedFeatures(state)` (순수 함수, 저장 안 함):
  - books: 상시
  - skills: 마법사 Lv3+
  - quests: 최고 스테이지 5+
  - rifts: 최고 스테이지 7+
  - rebirth: 최고 스테이지 10+ (환생으로 스테이지가 리셋돼도 유지)
  - camp: 환생 1회+
- "최고 스테이지"는 상태에 `highestStage` 기록 필요(마이그레이션 포함).
- UI: 잠긴 기능의 탭·배지·버튼은 **숨김**(자물쇠 아님 — 언락 등장이 보상). 언락 순간: 토스트 + 탭 등장 연출(펄스 1회).
- 균열 배지도 rifts 언락 전 숨김.
- 투토리얼·NEXT GOAL 힌트가 잠긴 기능을 가리키지 않는지 정합 확인.
- 신규 세이브 첫 화면 목표: 탭 1개(마법서), 빨간점 0개.

### C. 검증 (R1 완료 조건)
- 유닛테스트: unlock 파생 경계값, highestStage 유지, 마이그레이션(v3→v4), 광산 환율. 기존 166개 회귀 없음.
- `npm run test` + `npm run build` 그린.
- 시뮬 곡선 수치 보고 (첫 벽/첫 환생/Day-7).
- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.

**R1 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 커밋 49dfc2c. 테스트 174 그린·빌드 그린 재확인. 곡선: 첫 벽 10m / 첫 환생 34m / Day-7 book 86<100. 프리뷰 실측: fresh 첫 화면 탭 1개(BOOKS)·빨간점 0·HUD MANA 제거·균열 배지 숨김. 랭킹 탭은 rebirth 언락에 편승(스테이지 10+) — R3에서 HUD 아이콘으로 이동 예정.

## R3 스펙 — 정보구조 재배치 (R2보다 먼저 실행 — R2는 구슬 시안 확정 대기)

### A. 탭 6→5, "마법사" 탭 신설
- 새 탭 구성: **마법서(books) / 마법사(wizard) / 여정(journey) / 캠프(camp) / 환생(rebirth)**.
- **마법사 탭** = 기존 스킬 탭 전체(스킬·특성) + 도감(CODEX) 이동 + 공명 현황 요약. 질문: "나는 얼마나 강한가".
  - 마법서 탭에서 TOMES/CODEX 서브탭 제거 — 마법서 탭은 장착·인벤·구매에 집중.
- **여정 탭** = 기존 퀘스트 탭(메인 연쇄·장기 맹세·업적) + 일일 미션(캠프에서 이동). NEXT GOAL 스트립을 탭하면 여정 탭이 열린다(스트립이 여정의 입구).
- **랭킹**: 탭에서 제거 → HUD 설정 버튼 옆 트로피 아이콘 버튼 → 기존 RanksPanel을 모달(불투명 .modal.panel)로. rebirth 언락과 동일 시점에 아이콘 등장.
- 언락 폭포 매핑 갱신: journey=기존 quests 조건, wizard=기존 skills 조건. R1의 getUnlockedFeatures 키를 새 탭 구조에 맞게 리네임(하위호환 불필요 — 브랜치 내부).

### B. 웨이브 정보 HUD 통합
- Phaser 캔버스 상단의 "STAGE X - WAVE Y/10" 상시 텍스트 제거 → HUD의 STAGE 항목을 "STAGE X · WAVE Y/10"으로 확장(React, 기존 data-stage/data-wave 소스 활용).
- BattleBanner는 일시 연출(웨이브 클리어/보스/레벨 업/보스 실패) 전용으로 유지.
- 균열 배지(DOM)는 rifts 언락 후 표시 — 위치는 캔버스 우상단 유지(이제 상시 텍스트가 없어 겹침 자체가 소멸).

### C. 데스크톱(1280px+) 3열
- 좌: 여정 요약 칼럼(현재 목표 + 진행 중 퀘스트 2~3개, 클릭 시 여정 탭) / 중: 전투 캔버스 / 우: 마법서 패널 상주(현행 우측 패널 유지).
- 좌 칼럼은 journey 언락 전 숨김(전투가 그만큼 넓어짐).
- 탭 콘텐츠(마법사/캠프/환생)는 우측 패널 영역에서 전환(현행 방식 유지).

### D. 검증 (R3 완료 조건)
- 모든 탭·모달 데스크톱/모바일 렌더 확인(가려짐·클리핑 없음), 언락 전 숨김 동작 유지.
- NEXT GOAL 탭→여정 열림 상호작용 테스트 포함.
- 유닛테스트 갱신+신규(탭 매핑·랭킹 모달·여정 통합), `npm run test`+`npm run build` 그린.
- data-testid: 기존 것 유지 최우선. 탭 리네임으로 불가피한 변경(tab-skills→tab-wizard, tab-quests→tab-journey)은 보고서에 목록화 — E2E 재작성 시 반영.
- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.

**R3 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 탭 6→5(마법서/마법사/여정/캠프/환생). 랭킹은 탭에서 빠져 HUD 트로피 버튼→모달(rebirth 언락 시 등장). 웨이브 정보는 캔버스 상시 배너에서 HUD "STAGE X · W Y/10"로 통합(BattleBanner는 이벤트 연출 전용). 데스크톱 3열(좌 여정 요약·중 캔버스·우 마법서). 테스트 179 그린·빌드 그린. 프리뷰 실측(모바일 375+데스크톱 1280): 5탭·마법사(스킬+특성+공명+도감)·여정(퀘스트+일일미션)·랭킹 모달·데미지 숫자 정상, 캔버스 겹침 없음.
- **data-testid 변경** (E2E 재작성 시 반영): `tab-skills→tab-wizard`, `tab-quests→tab-journey`, `tab-ranks` 제거(→`ranks-btn`·`ranks-modal`·`ranks-close`). 신규 `journey-summary`. `books-subview-*` 제거. `skills-badge`·`camp-daily-card`·`daily-*`·`resonance-row`·`codex-grid` 유지.
- **Phaser 정식화 (감사 파생)**: 데스크톱 3열을 CSS로 캔버스를 강제하던 방식(`.phaser-host canvas { width !important }`, scale Gotcha 3 위반)을 걷어내고 ScaleManager가 host를 FIT + GameShell `ResizeObserver`→`game.scale.refresh()`로 재구현. 전체 Phaser 감사(src/game 24파일, 높음3/중간6/낮음10)에서 canvas 직접 스타일·`game.destroy` 누락·오디오 window 이벤트 우회(→EventBus)·데미지 숫자 Image 조합(→RetroFont BitmapText)·banner/wizard destroy 경로·audio unlock 리스너 해제까지 수정. 보류: 오디오 ogg 폴백(에셋 추가 필요). 재발방지: `src/game/phaser-conventions.test.ts`(CI) + AGENTS.md 스케일 규칙.

## R4 스펙 — 균열→전장 포탈 (여정·캠프는 R3/선행 커밋으로 완료)

원안(제안서 v2): "균열 → 재배치 → 전투 화면의 이벤트 문(門)으로 — 탭이 아니라 전장에 나타나는 포탈". 언락 폭포 "~15분 첫 균열 포탈 / 전투 화면에 처음으로 '누를 것'이 생김". 현재 균열은 `.ui-overlay` 안 `RiftsOverlay`(`rift-entry-btn` 떠있는 버튼→`.rift-modal`(golden/trial 카드)→진입→`rift-active-hud`). 데이터·전투 연결(`activeRift`·`riftRuns`·`riftMultiplier`·`riftComplete`)은 이미 있음 — **R4는 진입점의 위치·시각·연출을 "전장 포탈"로 재구성한다. 엔진(actions/battle/state) 신규 로직 없음.**

### A. 포탈 진입점 (`rift-entry-btn` → 전장 포탈)
- 균열 진입점을 전투 캔버스(`.phaser-host`) 위에 자리잡는 **포탈 요소**로 재구성. `.ui-overlay` 내 전장 영역에 겹쳐 배치 — HUD(상단)·여정 스트립·탭바(하단)와 겹치거나 클리핑되지 않게. 모바일은 전투 존 하단부, 데스크톱(1280+)은 중앙 전투열에.
- 시각: 새 외부 레퍼런스 없이 **게임 자체 아트를 기준**으로 일관(레트로 픽셀, `--mm-gold`/`--mm-frost`, `clip-path` 각진 모서리, 오프셋 `box-shadow`). 포탈 = 열린 문/소용돌이 은유.
- 남은 총횟수(golden+trial) 배지 유지. 횟수 0이면 "닫힌 포탈"(비활성 시각)·클릭 시 microToast.

### B. 등장·워프 연출
- rifts 언락(`highestStage≥7`) 순간: 포탈 **등장 연출**(스케일-업/페이드/펄스 1회) + 토스트. 언락 폭포의 "전투 화면에 처음 누를 것이 생김"을 실현. 최초 1회만 등장 연출, 이후 상시 표시.
- 포탈 클릭 → 기존 golden/trial 선택 모달(`.rift-modal`) 유지(횟수·설명이 필요). 진입 확정 → 짧은 **워프 전환**(포탈 플래시/줌) 후 `activeRift` 세팅.
- 균열 전장 분위기 전환은 **EventBus로 BattleScene에 일시 연출 신호**(배경 틴트 등). 캔버스 직접 스타일 금지(R3 Gotcha3). 과하면 생략 가능 — 필수는 포탈 등장 + 워프.
- 나가기(`rift-exit-btn`) → 복귀. active 중엔 진입 포탈 숨김(기존 `rift-active-hud` 전환 로직 유지).

### C. 상태·정합
- 엔진 신규 로직 없음 — 기존 `enterRift`/`exitRift`/`activeRift`/`riftRuns` 재사용. 변경 범위 = UI(`RiftsOverlay`·`GameShell`·`overlay.css`) + 선택적 `BattleScene` EventBus 연출 + i18n 카피.
- 포탈은 rifts 언락 전 숨김(`GameShell` 581 조건 유지).
- 신규 카피(등장 토스트 등)는 `i18n.ts` ko/en 양쪽.

### D. 검증 (R4 완료 조건)
- 언락 전 포탈 숨김 / 언락 시 등장 연출 / golden·trial 진입·나가기 / 횟수 0 비활성.
- 데스크톱(1280)·모바일(375) 렌더: 포탈이 전장 영역에 위치, HUD·탭바·여정 스트립과 겹침·클리핑 없음.
- data-testid: 기존 `rifts-open-btn`·`rift-modal`·`rifts-close-btn`·`rift-active-hud`·`rift-exit-btn` 최대 유지. 포탈화로 불가피한 변경은 보고서에 목록화(E2E 재작성 반영).
- 컴포넌트/유닛 테스트 갱신+신규(포탈 등장 조건·진입·비활성). `npm run test`+`npm run build` 그린.
- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.

**R4 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 커밋 4e4b3d4/a6b9670/33ea966. 균열 진입점을 전장 포탈로 재구성 — `rift-entry-btn`→`rift-portal-btn`(금색 이중 테두리+청록 이너 차원문, 남은 횟수 배지, 횟수 0시 `is-closed`). 언락 시 등장 연출(`is-appearing`)·진입 워프(`rift-warp-flash` gold/frost 틴트)·BattleScene `cameras.main.flash()`(EventBus, 캔버스 직접 스타일 없음). 엔진 무변경(enterRift/exitRift 재사용). 테스트 180→191 그린·빌드 그린. 프리뷰 실측(playwright, highestStage=8 주입): 데스크톱 3열 캔버스 하단 중앙·모바일 캔버스 중앙에 포탈, HUD·탭바·여정 겹침 없음. i18n 신규 키 0(기존 featureUnlocked/toastRiftBlocked 재사용). data-testid: `rifts-open-btn`·`rift-modal`·`rifts-close-btn`·`rift-active-hud`·`rift-exit-btn` 유지, 신규 `rift-warp-flash`.

## R5 스펙 — 전직·유파 (공명+특성 흡수 → 유파 선택)

원안(제안서): "공명+특성 → 전직 유파 — 전직 때 화염/냉기/신성 유파를 선택 → 진짜 특화". 견습→정식→대마법사, 스킨=전직 보상. **3모델 독립 설계(codex 밸런스·grok 최소침습·opus UX) 합성.** 디렉터 확정: 전직 페이싱 **중간**(환생 1회+레벨), 유파 신규 패시브 **도입**.

**용어(디렉터 지정 2026-07-04)**: `school` = **학파**(화염/냉기/신성 학파 — "school of magic" 설정 차용), `ascension.rank` = **클래스**(견습→정식→대마법사 — "클래스로 표현되는 마법 수준" 설정 차용). **코드 키(`school`/`rank`)는 유지하고 UI 카피·i18n을 학파/클래스로 통일한다.** 정체성 = 학파(전공)×클래스(급) 교차 — 예: "화염 학파의 대마법사". 아래 본문의 "유파"는 전부 "학파"로 읽는다. (전직 = 클래스 승급, 학파 선택은 정식 클래스 승급 시 1회.)

### A. 전직 3단계 (`ascension` 상태)
- 신규 상태 `ascension: { rank: 0|1|2, school: "fire"|"frost"|"holy"|null, schoolRespecs: number }` — `EngineState`에 1필드. 기존 `traits`는 삭제하지 않고 비전 각인(C절)으로 의미 재정의.
- **견습(rank0)**: 시작. `school=null`. 범용 공명만 약하게(기존 `getResonance` 유지). 스킨 apprentice.
- **정식(rank1)**: 복합 게이트 **`prestigeCount≥1 && wizardLevel≥12`** (잠정 — G절 시뮬로 확정). 유파 1회 선택(세리머니). 스킨 유파색.
- **대마법사(rank2)**: 복합 게이트 **`prestigeCount≥4 && wizardLevel≥30 && highestStage≥20`** (잠정 — 시뮬 확정, Day-7 클리어 불가 라인 아래로). 유파 심화(선택 없음, 승천). 스킨 각성판.
- 파생 `getPromotionStatus(state)`(순수함수·저장X): `{ nextRank, eligible, progress }` — UI·배지·NEXT GOAL 단일 소스. 권한은 항상 진행값 재검증. 환생 시 `ascension` 보존(`traits` 보존 패턴).
- 견습 이탈 방지: 첫 환생 후 마법사 탭에 "유파 예고"(3카드 잠금 미리보기 + 진행도 "환생 1/1 · 레벨 n/12").

### B. 유파 3종 효과 (기존 수치 보존 + 신규 패시브 도입)
- 원칙: 기존 공명·데미지 수치 보존, 유파는 그 위 증폭기. 모든 효과는 장착·캐스트 결과에 곱하는 배수/공명 증폭 — 자동클리어 금지("머지가 왕").
- 공명 흡수: 선택 유파 주원소 공명 요구 `3→2`(elementalCycle 흡수, **선택 유파 원소 한정** — 전체 적용 시 딜 폭주). 기존 `resonance.ts` 공식 불변.
- 특성 흡수: 원소 특성(pyroGlyphs/deepFreeze/sanctifiedAim) 유파 자동 내장.
- 유파별 (정식 rank1 / 대마법사 rank2, 수치는 잠정·시뮬 확정):
  - **화염 Pyromancer**: 정식 = 요구3→2, targetCap+1, 화염×1.2, 신규 **연쇄 발화**(초과 대상 20% 스플래시). 대마법사 = targetCap+1, 화염×1.5, 신규 **겁화**(보스 `bossElapsedMs` 30초 후 ×2).
  - **냉기 Cryomancer**: 정식 = 요구3→2, factor+0.15·dur+1000, deepFreeze, 신규 **빙결 축적**(`frostSlowMs>0` 적 피해+15%). 대마법사 = dur+1500, 냉기×1.3, 신규 **절대영도**(일반웨이브 첫타 20% 즉결).
  - **신성 Lightbringer**: 정식 = 요구3→2, bossMult+0.5, sanctifiedAim, 신규 **심판의 빛**(보스 처치 골드+25%). 대마법사 = bossMult+1, 신성×1.3, 신규 **성역**(환생 후 첫 보스까지 신성×2).
- 신규 패시브 계수는 밸런스 시뮬 반영·재측정(특히 겁화·절대영도는 DPS 변동 큼 — codex 경고).

### C. 비전 각인 (범용 특성 슬롯 — 컷 없이 보존)
- 범용 특성 5종(chainCast/goldenLibrary/quickHands/treasureOath/archmageFocus)을 **삭제하지 않고** 선택 슬롯으로 보존(디렉터 "볼륨 유지, 컷 없음").
- 슬롯: 정식 2 / 대마법사 3 (견습 0). 기존 `TraitState{picks}` 구조 재사용, 원소 특성 id 제거. 슬롯별 후보 겹침 없이 배분.
- 되돌림: 환생 시 무료 respec 크레딧(기존 `grantTraitRespecAfterPrestige` 계승).

### D. respec 이원화 + 스킨 매핑
- **respec 이원화**(정체성 무게 vs 실험 자유):
  - 비전 각인 = 환생 무료 크레딧.
  - 유파 = 마나수정 유료. 첫 변경 무료 → 이후 25 → 50 점증(`schoolRespecs`). 화폐 3종 준수(신규 발행 없음). 확인 다이얼로그로 비용·효과 공개. 환생 크레딧은 유파에 적용 안 함.
- **스킨 = (rank, 유파) 결정론적 보상**. 구매·업적 카운터 언락 폐지.
  - apprentice(시작) / ember·frost·gilded = 유파 정식(기존 tint 재활용, 즉시 가능).
  - 대마법사 3종(archmagePyro/Cryo/Lumen) 신규 id — 에셋은 **R2 스프라이트 파이프라인 연동**. 그전까진 각성 오라(글로우/파티클, `BattleWizardView`)로 임시 차별.
  - 전직 확정 시 스프라이트 스킨 전환 연출("펑"). `SkinState` owned/equipped 유지(되돌리기 수집). 외형과 수치 분리(apprentice로 되돌려도 유파 효과 유지).

### E. 상태·액션·SAVE v5 마이그레이션
- `types.ts`: `School`, `AscensionRank`(0|1|2), `AscensionState` 추가, `EngineState.ascension`. `TraitState` 유지(마이그레이션·비전 각인).
- 액션: `promoteClass(state, school?)`(rank+1, rank0→1 school 필수·rank1→2 승계), `respecSchool(state, school)`(마나수정 차감·교체·schoolRespecs+1·스킨 재부여), `getPromotionStatus`(파생). `selectTrait` 유지(비전 각인 의미). `prestige` `ascension` 보존. `equipSkin` 언락소스 전직 기반. `useEngine.ts` 배선 추가.
- **SAVE_VERSION 4→5**: v4→v5 마이그레이션 `ascension:{rank:0,school:null,schoolRespecs:0}` 초기화. 기존 traits.picks에서 공용 특성만 비전 각인 이관, 원소 특성 폐기(rank0 무효라 손실 체감 없음), **school 자동추론 안 함**(오추론 방지). 스킨 owned 보존+전직 재획득, `normalizeSkinState` 정규화. `isEngineState`에 `isAscensionState` 추가. 서버 zod 관대(ascension optional). `createInitialState`에 ascension 기본값.

### F. 마법사 탭 UI (전직 세리머니)
- 정보구조(위→아래): ① 정체성 헤더(초상·칭호·유파 문장·다음 전직 게이지) ② 전직 카드(eligible 시 CTA, 미충족 시 진행도) ③ 유파 패널(효과 목록 or 예고) ④ 비전 각인 슬롯(`TraitsSection` 재활용) ⑤ 스킬포인트(유지) ⑥ 공명(`ResonanceBadges`, 유파 보너스 표기 "화염 4/2 · 유파 +1") ⑦ 도감(유지). 정체성·유파 상시, 나머지 접이식.
- **1차 전직 세리머니**(견습→정식, 무게 최대): 트리거(토스트+펄스) → 풀스크린 모달(`.modal.panel` 불투명) → 딤·집중 → 유파 3카드(효과 프리뷰 수치) → 되돌림 고지 → 확정·각성 연출(스킨 전환·능력 순차 공개) → 헤더 갱신·NEXT GOAL 전환. 캔버스 딤·파티클은 EventBus(R3 Gotcha3).
- **2차 전직**(정식→대마법사, 카타르시스): 선택 없음, 승천 연출, 각성 오라·심화 효과 공개. 유파 변경은 세리머니 아닌 유파 패널 하단 "유파 변경" 버튼.
- 시안: `scratchpad/r5-mockup.html`(디렉터 승인 방향).

### G. 검증 (R5 완료 조건)
- **밸런스 시뮬 재증명**: `simulate.ts` selectGreedy를 전직·유파(화염 기본)로 교체. 첫 벽 8~12분·첫 환생 25~35분·Day-7 클리어 불가 유지. 신규 패시브 계수 반영. 결과 수치 보고에 포함.
- 유닛/컴포넌트 테스트 갱신+신규(progression·camp·state·actions·engineStorage·unlocks·i18n). `npm run test`+`npm run build` 그린.
- data-testid: 신규 `identity-header`·`promote-card`·`promote-btn`·`school-modal`·`school-card-{fire|frost|holy}`·`school-confirm`·`school-respec-btn`. 유지 `resonance-row`·`codex-grid`·`skill-*`. 불가피 변경(trait 슬롯 id `lv8`→비전 각인 슬롯 등) 목록화.
- 커밋은 redesign 브랜치에만. main·배포·원격 테스트 접근 금지.

**R5 결과 (2026-07-04, 오케스트레이터 검수 완료)**: 이전 세션 미커밋 엔진 코어 + 신규 UI·밸런스·적대리뷰 결함수정 통합. 병렬 위임(codex=엔진테스트·밸런스, sonnet=마법사 탭 UI).
- **전직·학파**: `ascension{rank,school,schoolRespecs}` + `school.ts` 학파 오버레이. 게이트 = 디렉터 확정 **중간 페이싱**(정식 환생1·Lv12, 대마법사 환생4·Lv30·st20). 마법사 탭 = 정체성 헤더(클래스×학파)·전직 카드·학파 모달(3카드)·유파 변경·rank 게이팅 비전 각인(arcane1/2/3)·스킬·공명·도감.
- **밸런스**: 화염 대마법사 targetCap 누적 제거(+2→+1, 클리어속도→골드→book 진행 주범)로 Day-7 book<100 달성. 화염 정식 4수치(공명3→2·targetCap+1·×1.2·연쇄발화20%)·배수×1.5·겁화×2는 원안 보존(딜 배수 조정은 시뮬이 카오스틱해 Day1을 흔들 뿐 book을 못 낮춤 — 실제 레버는 동시 타격 수였다). Day1 밴드 50→60(디렉터 승인, 전직=특화보상). **정직 지표 도입**(`maxStageEver`·`maxBookLevelEver` — 환생 stage 리셋이 피크를 숨기던 문제). 4밴드: 첫벽 10m·첫환생 34m·Day1 maxStage 57·Day7 maxBook 96.
- **적대 리뷰(codex) 3 high 전부 수정**: ① same-school respec 크리스탈 손실 방어(엔진 `same-school` throw + UI confirm 비활성) ② rank>0·school=null 불가능 상태 차단(`isAscensionState`+서버 zod refine+`promoteClass` rank1→2 방어) ③ 밸런스 정직 지표(위).
- **검증**: 217 테스트 그린·tsc·build 그린. 프리뷰 실사용(세이브 주입 rank0→정식): 견습→정식 전직 플로우·학파 모달 4수치 카피·rank 게이팅·유파 변경 same-school confirm 비활성 확인.
- **data-testid**: 신규 위 목록대로. 변경 trait 슬롯 `lv8/lv16/lv24`→`arcane1/arcane2/arcane3`. 유지 `resonance-row`·`codex-grid`·`skill-*`·`trait-{slot}-{id}`.
- **후속**: 풀스크린 세리머니 연출(스펙 F — 각성 모달·능력 순차 공개·EventBus 캔버스 딤)은 별도 커밋으로 얹는다.

## 진행 상태 & 재시작 이어갈 지점 (2026-07-04)

**재시작 사유**: 직전 세션이 repo 밖(`~/Documents/Codex/2026-07-04/new-chat`)에서 열려, codex-companion(codex:rescue 플러그인)의 쓰기 루트가 그 디렉토리로 제한돼 이 repo에 `apply_patch`가 거부됐다. **repo(`~/projects/merge-mage-redesign`)에서 세션을 재시작하면 플러그인이 정상 작동한다.** (교훈: codex 위임은 세션 cwd=repo에서.)

**완료**: R1(49dfc2c)·R3(8f45c43)·R4(4e4b3d4/a6b9670/33ea966) 커밋·검수 완료. 테스트 191 그린.

**R5 전직·유파 — 스펙·설계·시안 확정, 엔진 미구현**:
- 스펙 위 A~G 확정. 디렉터 확정: 페이싱 **중간**(정식=환생1회+Lv12 잠정, 대마법사=환생4회+Lv30+최고스테이지20 잠정), 유파 신규 패시브 **도입**, 용어 **학파(school)/클래스(rank)**.
- 3모델 독립 설계 합성: `docs/redesign-assets/r5-design/{codex,grok,claude}.md`.
- 세리머니 목업(학파/클래스 카피) 확정: `docs/redesign-assets/r5-mockup.png` (+.html).
- **다음**: ① 엔진 재위임 — codex:rescue에 `docs/redesign-assets/r5-engine-prompt.txt` 프롬프트 전달(엔진+상태+SAVE v5+밸런스 시뮬+WizardPanel 최소 마이그레이션, 세리머니 UX 제외). ② UI — sonnet에 세리머니 모달·정체성 헤더(목업·학파/클래스 카피 반영). ③ 검증 — codex review 적대 + 시뮬 수치(첫 벽/첫 환생/Day-7) + 프리뷰 실사용.

**R2 원소 구슬 — 준비 완료(R5 후 착수)**:
- 스프라이트 프로토타입: `docs/redesign-assets/orbs/{fire,frost,holy}.png`(16×16, 기존 tome 팔레트 재사용, **신성만 금색 확장 — R5 gilded 정합, 디렉터 확인됨**), 생성기 `orbs/gen_orbs.py`. 시안 `docs/redesign-assets/r2-orb-mockup.png`.
- 스코프 = **표면 재테마**(스프라이트+카피+도감/궤도 비주얼, 엔진 `Spellbook`/`books` 타입 유지 — 정합 리네임 `tome→orb`는 선택).
- 범위맵: 스프라이트 `public/assets/tomes/{fire,frost,holy}.png` 3장 교체(**`atlas.png`는 미사용 레거시**), 카피 `i18n.ts` en/ko 다수 키(tome/spellbook/마법서/도감), CTA `ControlsPanel.tsx`+`.btn-summon`(주인공급 격상), 도감 `CodexGrid` 비주얼(`codex.ts` 로직 유지). 깨질 테스트: `JourneyPanel.test`(Bind the First Tome), `BattleLayout.test`(resolveTomeLaunchPoint).

**통합 게이트 — E2E 재작성 범위 스캔 완료**:
- E2E 실체 = **TestSprite**(`tests/testsprite/fe/*.json`+`be/*.py`, `.testsprite/runs/*/code.py`). FE 01–07 + BE 01–04.
- 깨짐: **fe/05**(`tab-skills`→`tab-wizard`), **fe/07**(`tab-ranks` 제거→HUD `ranks-btn`→`ranks-modal`+하드코딩 xpath). fe/01·02·03 = copy만(R2). fe/06·be/* 안정.
- **R4는 E2E 무영향**(`rift-entry-btn`→`rift-portal-btn`은 CSS, testid `rifts-open-btn` 유지).
- **fe/04 auto-buy**: 토글 UI 소실(상태만 `useEngine`에 잔존) + `04.json` 유실. 원안이 "자동구매 첫 버전 제외·후반 잠금해제 보상"이라 명시 → **폐기 또는 후반 언락 보상으로 이관**이 정합(통합 게이트서 확정).
- CI 게이트 얕음(`testsprite.yml`이 FE 스모크 1건만 자동) → 재작성 후 편입 범위 결정.

**다음 순서**: R5 엔진 재위임 → R5 UI → R5 검증 → R2(표면 재테마) → 통합 게이트(밸런스 시뮬·E2E 재작성·fe/04 결정·신선한 눈 실사용·라이브 교체 판단).
