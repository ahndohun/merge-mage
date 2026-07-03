# Implementation Plans — Merge Mage 해커톤 로드맵 인수인계

improve 스킬(plan 변형)로 2026-07-03 작성. 작성 시점 커밋 `4c83c2c`.
**작성 배경**: 오케스트레이터 교대 (Fable 5 → Opus 4.8). 실행자는 각 플랜을 끝까지 읽고, STOP conditions를 지키고, 완료 시 아래 표를 갱신할 것.

## 계승자(Opus 4.8) 필독 컨텍스트

- **목표**: TestSprite Hackathon S3 **Track A** 상금 ($3,000/5명, 마감 **2026-07-07 4:59PM PDT**). Track B는 종결(PR 4건 머지, 지급 DM은 launchd 크론 1b15aa4f가 감시 — 손대지 말 것).
- **전체 상태·이력의 정본**: 메모리 `~/.claude/projects/-Users-ahndohun/memory/testsprite-hackathon-track-b.md` + 레포 `LOOP.md` (심사 서사, 13회 기록됨).
- **품질 기준**: `docs/specs/2026-07-02-merge-mage-design.md` §0 (AI slop 금지, 웹 느낌 금지) + `docs/ART-DIRECTION.md` (팔레트·라이선스 대장). 사용자에게 보이는 결과물은 디렉터 기준으로 직접 검수.
- **승인 게이트 (절대 규칙)**: 개인정보 제출(구글폼), 금전(크레딧 충전), 외부 공개 게시는 사용자 승인 후에만.
- **모델 라우팅**: 글로벌 `~/.claude/CLAUDE.md`의 오케스트레이션 규칙이 그대로 적용된다 (기계적 대량 작업 → composer/codex 위임, taste 결정 → 직접).

## Execution order & status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001 | 라운드 9 검증 마감 + 전 스위트 그린 확정 | P1 | S | — | DONE (FE 7/7 + BE 4/4 그린, 유닛 114, LOOP.md iter 14) |
| 002 | Track A 제출 (구글폼·Discord — 사용자 승인 게이트) | P1 | S | 001 | IN PROGRESS — 제출물 완비, 폼 X필드 병목(X계정 정지). hackathon-qa 문의 게시, 주최 답변 대기 |
| 003 | 제출 후 폴리시 백로그 (심사 기간 무배포) | P3 | M | 002 | TODO |

Status values: TODO | IN PROGRESS | DONE | BLOCKED (사유 한 줄) | REJECTED (근거 한 줄)

## Dependency notes

- 002는 001의 "11/11 그린" 증빙을 제출물에 쓰므로 001 선행 필수.
- 003은 심사 기간 라이브 안정성을 위해 002 이후로 고정.

## Findings considered and rejected

- 캔버스 한글 픽셀 글리프 직접 제작: Galmuri Phaser Text 폴백으로 대체 완료 — 비용 대비 무가치.
- 시뮬레이터 180분 백그라운드 행(hang) 근본 원인 추적: 포그라운드 0.5초 완주로 실사용 무영향 — 보류.
- X 홍보 강화: 실측 도달 10회 수준 — 지렛대 아님 (제출 후 선택 항목으로만).
