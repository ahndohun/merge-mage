# Plan 001: 라운드 9 검증을 마감하고 전 스위트 그린을 확정한다

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 4c83c2c..HEAD -- src/ tests/ .github/`
> 변경이 있으면 "Current state"의 사실들을 라이브 코드와 대조 후 진행. 불일치면 STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `4c83c2c`, 2026-07-03

## Why this matters

TestSprite 해커톤 S3 Track A 심사 배점은 Project 40 / **Loop 40** / Innovation 20+5(CI/CD)다. "전 테스트 그린 + LOOP.md 반복 서사"가 점수의 절반을 만든다. 직전 세션이 밸런스 v2 + ko/en i18n + UX 수정을 배포하고 검증 라운드 9(테스트 2건)를 발사한 채 종료됐다. 이 라운드를 마감하고 실패 시 수정 루프를 돌려 11/11 그린을 확정해야 제출(plan 002)로 넘어갈 수 있다.

## Current state

- 레포: `~/projects/merge-mage` (github.com/ahndohun/merge-mage), 라이브: https://merge-mage.vercel.app
- HEAD `4c83c2c` 기준 유닛테스트 114개 그린, 빌드 그린, 라이브 배포 완료.
- TestSprite 프로젝트: **FE** `cc32b9b9-ea01-408d-a2df-6e2a724b7142`, **BE** `83edef2d-3534-491d-9529-929416c41499`
- FE 테스트 7종 (플랜 원본은 `tests/testsprite/fe/0N.json`, 원격과 1:1):
  | 파일 | 테스트 ID | 마지막 상태 |
  |---|---|---|
  | 01 소환 스모크 | `c1a547c1-0c47-4063-aa15-415ac64796f0` | passed (CI가 매 푸시 실행) |
  | 02 합성 | `2902ff52-46b4-4d84-b3bf-403159d3c342` | passed |
  | 03 슬롯 이동 | `1aea4595-7283-468e-ad31-e89b77e8e2d9` | passed |
  | 04 자동구매 | `21beb7a2-b767-4900-9455-9a6e09cc491e` | **passed (라운드 9, 2026-07-03 이양 직전 확인)** |
  | 05 스킬 | `e669db87-e5ca-44a3-ab33-6135172f4ecb` | passed |
  | 06 환생 잠금 | `8f8edd9c-b822-4672-854c-597adad452a4` | passed |
  | 07 리더보드 | `a3e61756-feac-4b87-8675-017a6125ff89` | **passed (라운드 9, 2026-07-03 이양 직전 확인)** |

  → **라운드 9 종료: FE 7/7 + BE 4/4 = 11/11 전 그린.** Step 1~4는 확인만 하면 되고, 실질 작업은 Step 5(LOOP.md 14)와 Step 6(최종 스냅샷)이다.
- BE 4종은 `testsprite test run --all --project <BE id>`로 일괄 실행하며 CI 게이트(.github/workflows/testsprite.yml)가 매 푸시마다 돌린다. 마지막 CI 그린.
- 07을 위해 방금 배포된 제품 변경: 리더보드 닉네임 제출 성공 시 ① 토스트("Nickname saved to the leaderboard!") ② **지속형 `data-testid="nickname-saved"` "SAVED ✓" 칩** (`src/ui/RanksPanel.tsx`, `src/ui/useEngine.ts`의 `nicknameSaved`). 서버는 `E2E`로 시작하는 닉네임을 공개 보드에서 필터한다(`api/_lib/db.ts` getLeaderboard의 `not like 'E2E%'`) — 07 플랜의 "리더보드에 E2EBOT 표시" 분기는 영원히 성립하지 않고, "UI가 저장을 확인" 분기를 SAVED 칩이 충족한다.
- **TestSprite 에이전트 판정 특성 (실측 3회, 이번 세션)**: 테스트 이름/설명(description)에 ① 명령형 메타지시("Do NOT...", "verdict is passed") ② 상태 예측("inventory stays empty until...")이 들어가면, 에이전트 산문이 PASS여도 판정이 `blocked`로 나온다. **설명은 평서문 행위 서술만.** 현 04/07 플랜은 이 규칙에 맞게 정제된 상태다.
- 검증 트리거는 분당 60 제한이 있고 CI 게이트와 동시 실행하면 blocked가 난다 — **CI 완료 후 직렬(테스트 간 45초 간격) 실행**이 확립된 방식.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| 유닛테스트 | `pnpm test` | 114 passed |
| 빌드 | `pnpm build` | `✓ built` |
| 밸런스 시뮬 | `npx tsx src/engine/simulate.ts --minutes 60 [--row-minutes 1] < /dev/null` | 분당 표 출력 (감속 곡선) |
| FE/BE 상태 일람 | `testsprite test list --project <id>` | 테이블 (STATUS 열) |
| 단건 실행 | `testsprite test run <test-id> --wait --timeout 900 --output json` | `"status": "passed"` |
| 실패 번들 | `testsprite test failure get <test-id> --failed-only --out <dir>` | failure.json 등 (주의: `test result get`은 이 프로젝트 테스트에 Resource not found를 냄 — failure get을 쓸 것) |
| CI 상태 | `gh run list --limit 1` / `gh run watch <id> --exit-status` | ✓ |
| 배포 | `vercel --prod --yes` | Ready |

## Scope

**In scope**: 라운드 9의 04·07 결과 확정, 실패 시 원인 진단·수정(플랜 JSON 또는 제품 코드), `LOOP.md`에 iteration 14 추가, `plans/README.md` 상태 갱신.

**Out of scope**:
- `src/engine/constants.ts`의 밸런스 상수 — 방금 시뮬로 검증해 확정한 곡선(docs/specs/…design.md "밸런스 v2" 섹션). 테스트를 통과시키려고 밸런스를 되돌리지 말 것.
- `?fresh=1` 동작 (fresh 세이브 + tutorial-done + locale en 고정) — E2E 결정론의 기반.
- CI 워크플로의 테스트 ID 교체 (01 스모크가 이미 지정돼 있고 그린).

## Git workflow

- main 직커밋 (이 레포의 확립된 방식 — git log 참조, conventional commits)
- 커밋 메시지 끝: `Co-Authored-By:` 트레일러 관례 유지
- 푸시하면 CI 게이트가 돈다 (BE 4종 + FE 스모크, ~4분). docs-only 커밋은 CI 스킵.

## Steps

### Step 1: 라운드 9 결과 확인

`testsprite test list --project cc32b9b9-ea01-408d-a2df-6e2a724b7142` 를 실행해 04(`21beb7a2…`)와 07(`a3e61756…`)의 STATUS를 읽는다. (참고: 직전 세션 로그가 `/private/tmp/claude-501/-Users-ahndohun/4a27de23-3c53-432d-8f3e-06e0ef8d04a1/tasks/bfrfveeb7.output`에 남아 있을 수 있으나, test list가 정본.)

**Verify**: 두 테스트의 STATUS가 passed/failed/blocked 중 하나로 확인됨.

### Step 2 (둘 다 passed일 때): 종료 처리로 건너뛰기

Step 5로 이동.

### Step 3 (failed/blocked가 있을 때): 번들 진단

해당 테스트마다 `testsprite test failure get <id> --failed-only --out /tmp/f-<id>` 후 `failure.json`의 `rootCauseHypothesis`를 읽는다. 판정 기준:
- 산문이 "PASS/기능 정상"인데 판정만 blocked → 플랜 텍스트 문제. `tests/testsprite/fe/0N.json`의 name/description/step에서 명령형·예측 문구를 평서문으로 정제 → `testsprite test delete <구ID> --confirm` → `testsprite test create --plan-from tests/testsprite/fe/0N.json` (새 ID를 이 파일 Current state 표와 plans/README.md에 기록) → 재실행.
- 제품 결함 서술 → 먼저 로컬 프리뷰(`.claude/launch.json`의 merge-mage-dev, 포트 8080)나 라이브에서 **직접 재현**해 진위 확인. 재현되면 수정 → `pnpm test` → 커밋 → 푸시 → CI 그린 확인 → `vercel --prod --yes` → 재실행.

**Verify**: 재실행 결과 `"status": "passed"`.

### Step 4: 같은 테스트가 2회 연속 같은 사유로 실패하면 STOP

(아래 STOP conditions 참조.)

### Step 5: LOOP.md iteration 14 기록

`LOOP.md` 표 형식(기존 13행 참조: `| # | date | maker | what ran | what broke | what got fixed |`)으로 14행을 추가한다. 내용 재료: 밸런스 v2가 FE 플랜 3종(03/04/05)을 구식화시킨 것, E2E% 서버 필터가 "제출 피드백 전무"라는 실 UX 갭을 드러내 토스트+SAVED 칩으로 고친 것, TestSprite 에이전트의 blocked 판정 클래스(명령형 지시·상태 예측 금지) 확립, 최종 그린 스코어. 커밋 메시지: `docs: LOOP.md iteration 14`.

**Verify**: `git log --oneline -1` 에 해당 커밋. (docs-only라 CI 스킵됨 — 정상.)

### Step 6: 전 스위트 최종 스냅샷

`testsprite test list`를 FE·BE 프로젝트 각각 실행해 11개 전부 passed인 표를 확보한다 (제출 증빙).

**Verify**: FE 7/7 + BE 4/4 passed.

## Test plan

이 플랜 자체가 테스트 실행이다. 새 유닛테스트는 제품 수정이 생길 때만 그 수정에 따라 추가 (기존 패턴: `src/ui/*.test.ts`, `src/engine/*.test.ts`).

## Done criteria

- [ ] FE 7종 + BE 4종 전부 `passed` (`testsprite test list` 두 프로젝트)
- [ ] `pnpm test` 114+ passed, `pnpm build` 성공
- [ ] LOOP.md에 iteration 14 행 존재
- [ ] 변경이 있었다면 라이브(https://merge-mage.vercel.app)가 최신 커밋 배포본
- [ ] `plans/README.md` 상태 갱신

## STOP conditions

- 같은 테스트가 **같은 사유로 2회 연속** 실패/blocked — 동일 재시도 금지, 원인 분석과 함께 보고.
- TestSprite API가 `INSUFFICIENT_CREDITS` 반환 — 크레딧 충전은 금전 행위라 사용자 승인 필요. 보고 후 대기.
- 수정이 밸런스 상수나 `?fresh=1` 계약(Out of scope) 변경을 요구하는 것으로 보일 때.
- 라이브 사이트가 500/빈 화면 등 배포 자체가 깨진 정황일 때 (테스트 문제가 아님).

## Maintenance notes

- FE 테스트를 재생성하면 ID가 바뀐다. **CI의 `FE_SMOKE_TEST_ID`(.github/workflows/testsprite.yml)는 01 스모크만 참조** — 01을 재생성하면 반드시 워크플로도 갱신.
- 플랜 JSON을 고칠 때 `data-testid`는 절대 변경 금지 (플랜·코드 양쪽이 참조).
