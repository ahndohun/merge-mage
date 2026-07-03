# Plan 002: Track A 제출을 완료한다 (마감 2026-07-07 4:59PM PDT)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: plans/001의 Done criteria가 전부 충족됐는지 확인
> (FE 7/7 + BE 4/4 그린, LOOP.md 14 존재). 미충족이면 001부터.

## Status

- **Priority**: P1
- **Effort**: S (사용자 대기 시간 제외)
- **Risk**: LOW (단, 되돌릴 수 없는 외부 행위 포함 — 승인 게이트 엄수)
- **Depends on**: plans/001-verification-closeout.md
- **Category**: direction
- **Planned at**: commit `4c83c2c`, 2026-07-03

## Why this matters

TestSprite Hackathon S3 Track A: 프로젝트 어워드 $3,000 / 5명, 마감 **2026-07-07 4:59PM PDT**. 직전 리서치 기준 실제 제출은 극소수로 경쟁이 약해 기대값이 높다. 제출물(라이브 게임 + LOOP.md 14회 반복 + CI/CD 게이트)은 이미 완성 상태다. 남은 것은 제출 행위 자체이며, 그중 구글폼은 개인정보(이름/이메일)가 들어가 **사용자 승인 없이 제출 금지**다.

## Current state

- 심사 배점: Project 40 / Loop 40 / Innovation 20 + CI/CD 보너스 5. 우리 서사: "TestSprite 루프가 잡은 실버그 목록"(LOOP.md 1~14) + CI 게이트 + 밸런스 시뮬 + ko/en i18n.
- 제출 채널 2개:
  1. **구글폼**: https://forms.gle/oyraF8mHW2KfobJh8 (이름·이메일 필요 — 사용자 것: ahndohun1@gmail.com. **반드시 AskUserQuestion 등으로 제출 내용 확인받고 진행**). 재제출 허용이 확인된 폼이다.
  2. **Discord** `#hackathon-s3-submissions` 채널에 레포 공유 (서버 1227394620623949934). 링크는 `<https://github.com/ahndohun/merge-mage>` 앵글브래킷으로 임베드 숨기기 — 이 서버의 확립된 예절.
- 레포: https://github.com/ahndohun/merge-mage (public), 라이브: https://merge-mage.vercel.app
- 선택 가산 요소 (여력 있으면): 데모 영상(랭킹 부스트 — 과거 우승작들이 활용), X 마무리 포스트 (계정 @andohun590295; 단, 실측상 우리 X 도달력은 미미해 우선순위 낮음).
- 브라우저 자동화: 로그인 세션 있는 자체 브라우저 = `mcp__aside__repl` (함정 목록: `~/.claude/lessons/playbooks/aside-repl.md`). Discord 게시도 aside로 가능.
- Track B(CLI 바운티)는 **이미 종결** — PR 4건 머지, 지급 DM 대기. launchd 크론(1b15aa4f, 3시간마다 :37)이 Discord DM을 감시 중이니 이 플랜에서 건드릴 것 없음.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| 그린 증빙 | `testsprite test list --project cc32b9b9-ea01-408d-a2df-6e2a724b7142` (FE) / `--project 83edef2d-3534-491d-9529-929416c41499` (BE) | 전부 passed |
| 라이브 확인 | `curl -s -o /dev/null -w "%{http_code}" https://merge-mage.vercel.app/api/health` | 200 |
| README 최신화 확인 | README에 라이브 URL·LOOP.md 링크·실행법 존재 | 육안 |

## Scope

**In scope**: 구글폼 제출(승인 후), Discord 제출 채널 게시(승인 후), README 제출용 최종 점검(라이브 링크·스크린샷·LOOP 링크), plans/README.md 갱신.

**Out of scope**:
- 게임 코드 변경 (제출 직전 리스크 — 001에서 그린 확정한 빌드를 그대로 제출).
- 크레딧 구매·유료 결제 일체.
- Track B 관련 행위 (크론이 담당).

## Steps

### Step 1: 제출물 사전 점검

라이브 health 200, FE/BE 전 그린 스냅샷, README에 ① 라이브 URL ② 한 줄 소개 ③ LOOP.md 링크 ④ 로컬 실행법이 있는지 확인. 빠진 항목만 docs 커밋으로 보강 (docs-only는 CI 스킵).

**Verify**: 위 4개 항목 전부 존재.

### Step 2: 사용자 승인 요청 (구글폼)

폼에 넣을 값(이름, 이메일 ahndohun1@gmail.com, 레포 URL, 라이브 URL, 프로젝트 설명 초안)을 정리해 사용자에게 보여주고 제출 승인을 받는다. **승인 전 제출 금지.**

**Verify**: 사용자의 명시적 승인.

### Step 3: 구글폼 제출

aside(`mcp__aside__repl` 또는 `aside exec`)로 폼을 열어 승인받은 값 그대로 입력·제출. 제출 완료 화면 스크린샷 확보.

**Verify**: 제출 확인 화면 스크린샷.

### Step 4: Discord 제출 채널 게시

`#hackathon-s3-submissions`에 간결한 소개(1~3문장: 게임 한 줄 + TestSprite 루프 14회 + CI 게이트) + `<레포>` `<라이브>` 링크. 게시 전 사용자에게 문안 확인(외부 공개 행위).

**Verify**: 게시된 메시지 링크.

### Step 5: 기록

plans/README.md의 002 상태 DONE, 메모리(`~/.claude/projects/-Users-ahndohun/memory/testsprite-hackathon-track-b.md`)에 제출 완료 사실과 시각 추가.

## Done criteria

- [ ] 구글폼 제출 완료 (사용자 승인 증적 + 완료 스크린샷)
- [ ] Discord 제출 채널 게시 완료 (메시지 링크)
- [ ] plans/README.md·메모리 갱신

## STOP conditions

- 사용자가 폼 값 승인에 응답하지 않음 — 마감 24시간 전(7/6 저녁 KST 기준 7/7 오전)까지 대기 후 리마인드 1회, 그래도 없으면 보고만.
- 폼이 닫혔거나 필드가 예상과 다름 — 스크린샷과 함께 보고.
- 제출 채널에 재제출 관련 새 규칙 공지가 있음 — 규칙 우선, 보고.

## Maintenance notes

- 제출 후 심사 기간에 라이브를 깨는 배포 금지. 개선은 plans/003 백로그로.
- TestSprite가 X에서 빌드 과정에 반응하는 문화가 있으니, 제출 후 X 포스트는 선택 가산.
