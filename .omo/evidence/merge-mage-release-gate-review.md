# Merge Mage Release Gate Review

## recommendation
REJECT

## originalIntent
The user asked for a rigorous final release-gate review of the deployed Merge Mage game at `https://merge-mage.vercel.app`, using the contract in `docs/specs/2026-07-02-merge-mage-design.md`, `README.md`, `LOOP.md`, and the evidence bundle under `.omo/evidence/merge-mage-release-gate/`.

## desiredOutcome
Approve only if the deployed mobile-portrait game satisfies the documented release criteria with artifact-backed evidence: cold start, core loop, persistence, server authority, settings controls, judge-facing repo surface, TestSprite/GitHub evidence, cleanup receipts, and no unresolved slop or unsupported code-review coverage.

## userOutcomeReview
The shipped artifact is not ready for approval from a player/judge perspective. Core game evidence is mostly positive, but the settings surface fails on the required `390x844` mobile portrait browser surface: settings controls exist in the DOM but are covered by the Phaser canvas and cannot be clicked. That makes sound persistence and the two-step new-game wipe unverifiable through the real user surface and violates the release gate's own criterion 5.

The notepad's final REJECT is justified. A real failed criterion is present and binding, so the release cannot be approved even though build, unit tests, API authority checks, persistence, cold start, core loop, CI, and TestSprite preflight evidence are favorable.

## blockers
1. Settings controls are inaccessible in the required mobile browser surface.
   - Evidence: `.omo/evidence/merge-mage-release-gate/browser/settings-pointer-intercept.json`
   - Exact finding: `pass: false`; `locator.click` timed out on `data-testid="settings-sound"`; hit test at the button center returned `canvas` as the top element.
   - Corroborating screenshot: `.omo/evidence/merge-mage-release-gate/browser/settings-pointer-intercept-open.png` does not show an operable settings popover above the game canvas.
   - Contract impact: fails the settings criterion from `.omo/evidence/merge-mage-release-gate/notepad/brief.md`: sound toggle persistence, two-step NEW GAME, and no dead buttons in four tabs.

2. Required code-review/slop coverage artifact is absent.
   - Evidence search under `.omo/evidence/merge-mage-release-gate/` found notepad/brief artifacts only for review-like paths, with no code review report or manual QA matrix carrying the required skill-perspective and overfit/slop coverage.
   - The notepad explicitly says `omo:programming` was deliberately not used, while this gate review was required to confirm `remove-ai-slops` and `programming` coverage before approval.
   - My direct pass did not find an oversized source file over the 250 pure-LOC ceiling and did not find obvious `as any`, `@ts-ignore`, `@ts-expect-error`, `.skip`, or `.only` blockers in `src/`, `api/`, and `tests/`, but missing reviewer coverage is still an approval blocker under the final-gate instructions.

## checked artifact paths
- `docs/specs/2026-07-02-merge-mage-design.md`
- `README.md`
- `LOOP.md`
- `.omo/plans/merge-mage-release-gate-review.md`
- `.omo/ulw-loop/merge-mage-release-gate/ledger.jsonl`
- `.omo/evidence/merge-mage-release-gate/notepad/brief.md`
- `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md`
- `.omo/evidence/merge-mage-release-gate/browser/cold-start.json`
- `.omo/evidence/merge-mage-release-gate/browser/cold-start-ready.png`
- `.omo/evidence/merge-mage-release-gate/browser/cold-start-after-5s.png`
- `.omo/evidence/merge-mage-release-gate/browser/core-loop-summon-auto-equip.json`
- `.omo/evidence/merge-mage-release-gate/browser/core-loop-summon-auto-equip.png`
- `.omo/evidence/merge-mage-release-gate/browser/core-loop-merge-threshold.json`
- `.omo/evidence/merge-mage-release-gate/browser/core-loop-before-threshold-merge.png`
- `.omo/evidence/merge-mage-release-gate/browser/core-loop-after-threshold-merge.png`
- `.omo/evidence/merge-mage-release-gate/browser/persistence.json`
- `.omo/evidence/merge-mage-release-gate/browser/persistence-saved-before-reload.png`
- `.omo/evidence/merge-mage-release-gate/browser/persistence-reloaded.png`
- `.omo/evidence/merge-mage-release-gate/api/save-get-from-browser.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-summary.json`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-save-negative-gold.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-save-absurd-stage.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-save-string-nan.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-save-raw-nan.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-leaderboard-save.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-leaderboard-post-stage-ignored.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-leaderboard-get.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-offline-save.txt`
- `.omo/evidence/merge-mage-release-gate/api/server-authority-offline-claim-client-clock-ignored.txt`
- `.omo/evidence/merge-mage-release-gate/browser/settings-pointer-intercept.json`
- `.omo/evidence/merge-mage-release-gate/browser/settings-pointer-intercept-open.png`
- `.omo/evidence/merge-mage-release-gate/repo/judge-surface-summary.json`
- `.omo/evidence/merge-mage-release-gate/repo/judge-surface.txt`
- `.omo/evidence/merge-mage-release-gate/repo/live-url-and-health.txt`
- `.omo/evidence/merge-mage-release-gate/repo/npm-build.txt`
- `.omo/evidence/merge-mage-release-gate/repo/npm-test.txt`
- `.omo/evidence/merge-mage-release-gate/testsprite/preflight.txt`
- `.omo/evidence/merge-mage-release-gate/cleanup/task-browser.txt`
- `.omo/evidence/merge-mage-release-gate/cleanup/task-api.txt`
- `.omo/evidence/merge-mage-release-gate/cleanup/task-repo.txt`
- `.github/workflows/testsprite.yml`
- `package.json`
- `src/ui/GameShell.tsx`
- `src/ui/HudOverlay.tsx`
- `src/styles.css`
- `src/ui/overlay.css`
- `api/index.ts`
- `src/game/GameAudio.ts`
- `src/ui/engineStorage.ts`
- `src/ui/apiClient.ts`
- `src/ui/useEngine.ts`

## supporting evidence
- Cold start passes: `.omo/evidence/merge-mage-release-gate/browser/cold-start.json` has `pass: true`, scene `BattleScene`, gold `100 -> 103` within 5 seconds, and hint `Tap SUMMON to arm your first spellbook`.
- Core loop passes: `.omo/evidence/merge-mage-release-gate/browser/core-loop-summon-auto-equip.json` has `pass: true`, displayed cost `25`, gold `1000 -> 975`, and first slot `Lv1FROSTUP 50`; `.omo/evidence/merge-mage-release-gate/browser/core-loop-merge-threshold.json` has `pass: true`, summon level `1 -> 2`, and merged slot `Lv10FROST`.
- Persistence passes in artifact summary: `.omo/evidence/merge-mage-release-gate/browser/persistence.json` has `pass: true`; `.omo/evidence/merge-mage-release-gate/api/save-get-from-browser.txt` shows HTTP 200 for the saved token. Some compact field names differ from the planner's proposed artifact shape, but the saved server state is present.
- Server authority passes: `.omo/evidence/merge-mage-release-gate/api/server-authority-summary.json` has invalid save statuses all `400`, leaderboard stored `bestStage: 4` despite supplied stage, and offline claim `cappedHours: 8`.
- Judge surface passes in summary: `.omo/evidence/merge-mage-release-gate/repo/judge-surface-summary.json` has live URL/API true, workflow exists, latest GitHub run success, TestSprite preflight ok, build ok, test ok.
- Local verification rerun: `npm test -- --run` passed 11 files / 46 tests; `npm run build` exited 0 with only the existing Vite chunk-size warning.

## cleanup/state review
Cleanup artifacts do not change the verdict. `.omo/evidence/merge-mage-release-gate/cleanup/task-browser.txt` reports Playwright/browser contexts closed, no related processes/listening ports, and the temp dependency directory removed. `.omo/evidence/merge-mage-release-gate/cleanup/task-api.txt` records unavoidable remote fixture residue because there is no public delete endpoint. `.omo/evidence/merge-mage-release-gate/cleanup/task-repo.txt` reports all CLI commands exited and no local dev server was started. The browser cleanup note says one pre-existing GitHub popup was closed; that is collateral state handling, not the product-release blocker.

## exact evidence gaps
- No code review report artifact with explicit `remove-ai-slops` overfit/slop criterion coverage and `programming` skill-perspective coverage was present under `.omo/evidence/merge-mage-release-gate/`.
- No later artifact contradicts `browser/settings-pointer-intercept.json` or proves the settings controls are clickable through the deployed `390x844` surface.
- The planner referenced some artifact names that differ from actual outputs, such as `browser/settings.json`, `browser/core-loop-cost-merge.json`, and per-criterion cleanup files. Actual provided artifacts are sufficient to prove several passes, but they do not fill the settings pass gap.

## final
REJECT
