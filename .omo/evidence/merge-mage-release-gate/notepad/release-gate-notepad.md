# Merge Mage Release Gate Notepad

## Bootstrap
- Skills selected:
  - omo:ulw-loop: user invoked ultrawork and asked for artifact-backed release gate.
  - omo:frontend: live web/game UI and shipped visual/UX surface are being audited.
  - omo:visual-qa: user asks whether the page/game delivers for a player and judge; screenshots and interaction evidence are required.
  - browser:control-in-app-browser: browser-facing criteria must be driven through a browser first.
- Skills deliberately not used:
  - Phaser 4 skills: no Phaser code is being written in this gate; use only if a fix is requested.
  - omo:programming: no source code edits planned; API behavior will be verified via live HTTP first.
- Tier: HEAVY.
- Reason: strict release gate across browser UX, persistence, adversarial API/server authority, external TestSprite/GitHub CI, and hackathon judge claims.
- Shape: research/evaluation gate with live-surface evidence. No product changes unless separately requested.
- Contract sources read: docs/specs/2026-07-02-merge-mage-design.md, README.md, LOOP.md, .github/workflows/testsprite.yml, git log.

## Scenarios
- C1 cold start:
  - Channel: browser.
  - Invocation: open https://merge-mage.vercel.app/?fresh=1 at 390x844; wait 5 seconds; collect DOM data attributes, visible text, gold/stage/kill deltas, screenshot.
  - Binary PASS: combat starts without input, at least one kill/monster damage and gold increase occurs, hint strip tells player to summon.
  - Evidence: browser/cold-start.json, browser/cold-start.png.
- C2 core loop:
  - Channel: browser.
  - Invocation: continue fresh session; read summon button displayed cost; click summon; verify gold delta equals displayed cost after freezing idle income if possible, or record engine state immediately before/after click; verify auto-equipped slot; summon until two same-level books exist; tap-tap merge; observe Lv(n+1); continue until highest level threshold implies floor = max(1, highest-8), verify floor rises.
  - Binary PASS: exact cost accounting, auto-equip, merge, and documented summon-floor rule are all observed.
  - Evidence: browser/core-loop.json, browser/core-loop-*.png.
- C3 persistence:
  - Channel: browser + HTTP.
  - Invocation: after progress and cloud save, reload https://merge-mage.vercel.app without ?fresh; read token/state; curl -i https://merge-mage.vercel.app/api/save/<token>.
  - Binary PASS: progress retained, SAVED chip visible, API state matches browser state.
  - Evidence: browser/persistence.json, browser/persistence.png, api/save-get.txt.
- C4 server authority:
  - Channel: HTTP.
  - Invocation: curl -i POST /api/save with gold=-5, stage=999999, and NaN; create valid save; curl -i POST /api/leaderboard with supplied stage; curl -i POST /api/offline-claim with client clock fields.
  - Binary PASS: invalid saves return 400; leaderboard derives bestStage from stored save; offline claim ignores client clock and caps computed offline seconds at 28800.
  - Evidence: api/server-authority-*.txt and api/server-authority-summary.json.
- C5 settings:
  - Channel: browser.
  - Invocation: open each of the four tabs, click every visible button/control, toggle sound, reload, verify persisted; click NEW GAME then cancel/confirm sequence; verify wiped fresh restart.
  - Binary PASS: sound persists, two-step new-game wipes only after confirm, no tab has dead controls.
  - Evidence: browser/settings.json, browser/settings-*.png.
- C6 judge surface:
  - Channel: CLI/HTTP auxiliary.
  - Invocation: curl live URL and /api/health; compare README claims to observed files; compare LOOP entry subjects to git log; run gh run list for workflow; inspect TestSprite tests and preflight.
  - Binary PASS: README claims are supported, LOOP entries have matching commits, CI workflow exists and latest run is green.
  - Evidence: repo/judge-surface.txt, repo/gh-run-list.json, testsprite/preflight.txt.

## Current Verdict
- REJECT.
- Blocker: Settings controls are not clickable in the required 390x844 mobile portrait browser surface because the Phaser canvas intercepts pointer events over the settings popover. Evidence: `browser/settings-pointer-intercept.json` and `browser/settings-pointer-intercept-open.png`.
- Secondary process blocker from final reviewer: no dedicated code-review/slop report artifact under `.omo/evidence/merge-mage-release-gate/` for `remove-ai-slops` or programming-skill perspective coverage. Evidence: `.omo/evidence/merge-mage-release-gate-review.md`.
- Passing evidence captured for cold start, core loop, persistence, server authority, and judge surface.
- Cleanup receipts: `cleanup/task-browser.txt`, `cleanup/task-api.txt`, `cleanup/task-repo.txt`.
