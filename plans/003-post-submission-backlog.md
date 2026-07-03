# Plan 003: 제출 후 폴리시 백로그 (심사 기간 무배포 — 심사 후 실행)

> **Executor instructions**: 이 플랜은 002 제출이 끝나고 심사 결과가 나온 뒤에만
> 실행한다. 항목별로 독립적이며 순서 무관. 각 항목 완료 시 `pnpm test` +
> `pnpm build` + 로컬 프리뷰 실측 후 커밋. STOP conditions 우선.
>
> **Drift check (run first)**: `git diff --stat 4c83c2c..HEAD -- src/`
> 변경분이 크면 각 항목의 현재 상태 서술을 라이브 코드와 대조.

## Status

- **Priority**: P3
- **Effort**: M (전체), 항목별 S
- **Risk**: LOW
- **Depends on**: plans/002-hackathon-submission.md (완료 후)
- **Category**: tech-debt / dx / direction
- **Planned at**: commit `4c83c2c`, 2026-07-03

## Why this matters

디렉터 플레이 평가에서 나온 비차단 개선점들. 심사 기간에 라이브를 건드리지 않기 위해 의도적으로 보류한 것들이므로, 심사 후 게임을 계속 살릴 경우의 출발점이다.

## 백로그 (디렉터 평가 실측 기준)

1. **전투 캔버스 배너 겹침**: 스테이지 시작 배너("스테이지 N — 웨이브 1/10", `BattleBanner`)가 우상단 웨이브 인디케이터(`BattleWaveIndicator`)와 정보 중복 + 상단 브릭 테두리와 겹친다. 배너 위치를 캔버스 세로 중앙(y≈40%)으로 내리거나 인디케이터를 배너 표시 중 숨기기.
2. **전장 밀도**: 데스크톱 뷰포트에서 전장 중앙이 비어 보인다 (모바일 세로 기준 설계). 바닥 데코 스프라이트(0x72 DungeonTileset II — 이미 로드됨, `docs/ART-DIRECTION.md` 라이선스 대장 참조) 2~3종을 시드 고정으로 흩뿌리기. 시드는 엔진 rngSeed와 무관하게 스테이지 번호로 — 전투 결정론에 영향 금지.
3. **frost 캐스트 중 마법사 실루엣화**: frost 틴트 플래시가 길어 마법사가 하늘색 고스트로 보이는 프레임이 잦다 (`BattleWizardView`의 flash — 이미 timed tint owner 구조). 지속시간/알파를 fire·holy와 비교해 한 눈금 줄이기.
4. **시뮬 봇의 스킬 미사용**: `src/engine/simulate.ts` greedy 정책이 skillPoints를 안 쓴다. 스킬 배분(예: goldGain 우선)을 넣으면 곡선 검증이 실플레이어에 더 가까워진다. 곡선이 크게 달라지면 docs/specs의 밸런스 v2 표와 함께 갱신.
5. **HUD "MANA" 라벨**: 첫 환생 전엔 항상 0이라 신규 유저가 의아해한다 (실측: 디렉터도 첫 플레이에서 갸웃). 도움말(HOW TO PLAY)에 MC 한 줄 추가가 최소 수정, 또는 환생 전 숨김.
6. **랭킹 행 카피**: ko 로케일에서 `t.rankStage`가 "스테이지 72"로 길다. 행 폭 실측 후 필요하면 "S72"로 축약.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| 테스트 | `pnpm test` | 전부 pass |
| 빌드 | `pnpm build` | ✓ built |
| 프리뷰 | `.claude/launch.json`의 `merge-mage-dev` (포트 8080) | 게임 로드 |
| 시뮬 | `npx tsx src/engine/simulate.ts --minutes 60 < /dev/null` | 감속 곡선 유지 |

## Scope

**In scope**: 위 6개 항목의 해당 파일들 (`src/game/scenes/*`, `src/engine/simulate.ts`, `src/ui/HelpModal.tsx`, `src/ui/i18n.ts`).

**Out of scope**:
- 밸런스 상수 (항목 4로 곡선이 흔들리면 상수가 아니라 봇 정책을 조정).
- `?fresh=1` 계약, data-testid, 세이브 스키마(SAVE_VERSION).

## Done criteria (항목별)

- [ ] `pnpm test`·`pnpm build` 그린
- [ ] 로컬 프리뷰에서 해당 변화 실측 (스크린샷)
- [ ] 시각 변경은 en·ko 두 로케일 확인
- [ ] plans/README.md 갱신

## STOP conditions

- 항목 4에서 시뮬 곡선의 첫 STALL이 60분 이전으로 당겨지거나 사라짐 (밸런스 회귀).
- 어떤 항목이든 FE E2E(TestSprite)가 참조하는 텍스트/testid를 바꿔야 성립할 때.

## Maintenance notes

- 캔버스 텍스트는 A-Z·숫자만 픽셀 글리프, 그 외는 Galmuri Phaser Text 폴백 (`src/game/scenes/PixelText.ts`). 새 캔버스 카피 추가 시 이 규약 유지.
