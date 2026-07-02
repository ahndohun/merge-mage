# Merge Mage Release Gate Review

## TL;DR
> Summary:      Executable HEAVY release-gate QA for Merge Mage, grounded in the current notepad criteria and the shipped live URL. Verdict on the current notepad plan: ITERATE until cleanup receipts, non-racy observables, and missing evidence artifacts are captured.
> Deliverables:
> - Agent-run evidence for COLD START, CORE LOOP, PERSISTENCE, SERVER AUTHORITY, SETTINGS, and JUDGE SURFACE.
> - Cleanup receipt per criterion under `.omo/evidence/merge-mage-release-gate/cleanup/`.
> - Final release-gate summary with APPROVE only if all criteria pass from captured artifacts.
> Effort:       Medium
> Risk:         Medium - live browser timing, remote TestSprite/GitHub auth, and API fixture cleanup cannot be inferred from repo files.

## Scope
### Must have
- Preserve the six user success criteria exactly as the notepad names them: COLD START, CORE LOOP, PERSISTENCE, SERVER AUTHORITY, SETTINGS, JUDGE SURFACE `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:17`.
- Drive browser-facing criteria against `https://merge-mage.vercel.app` at 390x844, matching the Director bar for mobile portrait and game feel `docs/specs/2026-07-02-merge-mage-design.md:7`.
- Use live TestSprite/GitHub/API evidence where the notepad requires it, including the frontend project `cc32b9b9-ea01-408d-a2df-6e2a724b7142` and backend project `83edef2d-3534-491d-9529-929416c41499` `AGENTS.md:142`.
- Capture an expected artifact and cleanup receipt for every criterion. Current evidence inventory only contains the notepad and brief, so all criterion artifacts are missing now `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:22`.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Do not edit product code, docs, tests, config, LOOP.md, README.md, or deployment settings.
- Do not relax the notepad pass/fail criteria during execution. If the five-second COLD START gate or exact CORE LOOP accounting fails, mark ITERATE with evidence.
- Do not fabricate LOOP.md, TestSprite, GitHub Actions, or browser evidence. AGENTS requires no fabricated loop entries `AGENTS.md:134`.
- Do not append to LOOP.md; this is a read-only release-gate plan, not a feature loop.
- Do not use localhost for TestSprite. The CLI must target a deployed URL `AGENTS.md:64`.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after + live browser, curl, GitHub CLI, and TestSprite CLI. No new source tests are created by this plan.
- QA policy: every task has agent-executed scenarios with exact invocation, binary observable, evidence path, and cleanup receipt.
- Evidence: `.omo/evidence/merge-mage-release-gate/task-<N>-<slug>.<ext>`

## Execution strategy
### Parallel execution waves
> Target 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks to maximize parallelism.

Wave 1 (no dependencies):
- Task 1: COLD START browser gate
- Task 4: SERVER AUTHORITY HTTP gate
- Task 5: SETTINGS browser gate
- Task 6: JUDGE SURFACE repository, CI, and TestSprite gate

Wave 2 (after Wave 1):
- Task 2: CORE LOOP browser gate, depends [1]

Wave 3 (after Wave 2):
- Task 3: PERSISTENCE browser plus API gate, depends [2]

Critical path: Task 1 -> Task 2 -> Task 3

### Dependency matrix
| Task | Depends on | Blocks | Can parallelize with |
|------|------------|--------|----------------------|
| 1 | none | 2 | 4, 5, 6 |
| 2 | 1 | 3 | none |
| 3 | 2 | final | 4, 5, 6 if still running |
| 4 | none | final | 1, 5, 6 |
| 5 | none | final | 1, 4, 6 |
| 6 | none | final | 1, 4, 5 |

## Todos
> Implementation + Test = ONE task. Never separate.
> Every task MUST have: References + Acceptance Criteria + QA Scenarios + Commit.

- [ ] 1. COLD START browser gate

  What to do: Execute the notepad C1 cold-start check against the live game. Use a fresh browser profile/state, 390x844 viewport, five-second observation window, DOM state mirror, screenshot, and cleanup receipt.
  Must NOT do: Do not extend the five-second pass window to make the gate pass. Do not count a static screenshot as motion proof without the DOM delta.

  Parallelization: Can parallel: YES | Wave 1 | Blocks: [2] | Blocked by: []

  References (executor has NO interview context - be exhaustive):
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:9` - no web-feel UI; pixel-art/game-feel bar.
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:11` - mandatory hit flash/damage/gold/boss effects.
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:12` - mobile portrait 390x844.
  - Notepad: `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:18` - C1 exact criterion.
  - State mirror: `src/ui/GameShell.tsx:183` - `#app-root` exposes `data-active-scene`, `data-gold`, `data-stage`, `data-wave`.
  - Battle mirror: `src/game/scenes/BattleDataMirror.ts:4` - body mirrors battle stage/wave/gold/boss HP.
  - Initial combat: `src/engine/battle.ts:71` - innate staff casts without player input.
  - Rewards: `src/engine/battleRewards.ts:23` - gold rises only after a kill reward.

  Acceptance criteria (agent-executable only):
  - [ ] Browser evidence JSON at `.omo/evidence/merge-mage-release-gate/browser/cold-start.json` has `ready === true`, `viewport.width === 390`, `viewport.height === 844`, and `after.gold > before.gold` after exactly 5000ms.
  - [ ] Screenshot `.omo/evidence/merge-mage-release-gate/browser/cold-start.png` shows the live game, not preboot/loading.
  - [ ] Cleanup receipt `.omo/evidence/merge-mage-release-gate/cleanup/task-1-cold-start.txt` records localStorage keys removed and final URL reset to `about:blank` or a fresh URL.

  QA scenarios (MANDATORY - task incomplete without these):
  > Name the exact tool AND its exact invocation - not "verify it works". Browser use: in Codex, use `browser:control-in-app-browser` first when available and no authenticated/persistent user browser profile is required; otherwise use Chrome to drive the page, or agent-browser (https://github.com/vercel-labs/agent-browser) when Chrome is unavailable. Computer use: OS-level GUI automation for a non-browser desktop app.
  ```
  Scenario: cold start has immediate life
    Tool:     browser:control-in-app-browser
    Steps:    Set viewport 390x844. Open `https://merge-mage.vercel.app/?fresh=1&gate=cold-start`. Wait until selector `#app-root[data-active-scene]` exists and `document.querySelector("#app-root").dataset.activeScene !== "booting"`. Run:
              `const root=document.querySelector("#app-root"); const before={gold:Number(root.dataset.gold),stage:Number(root.dataset.stage),wave:Number(root.dataset.wave),scene:root.dataset.activeScene}; await new Promise(r=>setTimeout(r,5000)); const after={gold:Number(root.dataset.gold),stage:Number(root.dataset.stage),wave:Number(root.dataset.wave),scene:root.dataset.activeScene,bodyGold:Number(document.body.dataset.gold||0)}; return {viewport:{width:390,height:844},ready:before.scene!=="booting"&&after.scene!=="booting",before,after,pass:after.gold>before.gold};`
              Save the returned JSON to `.omo/evidence/merge-mage-release-gate/browser/cold-start.json`. Capture screenshot `.omo/evidence/merge-mage-release-gate/browser/cold-start.png`.
    Expected: PASS iff returned `pass` is `true`; otherwise ITERATE with the JSON and screenshot.
    Evidence: .omo/evidence/merge-mage-release-gate/browser/cold-start.json

  Scenario: cold start cleanup receipt
    Tool:     browser:control-in-app-browser
    Steps:    On the same origin, run:
              `["merge-mage:engine-state","merge-mage:save-token","merge-mage:nickname","merge-mage:audio-muted"].forEach(k=>localStorage.removeItem(k)); return {remaining:Object.keys(localStorage).filter(k=>k.startsWith("merge-mage:")),url:location.href};`
              Save the returned JSON and timestamp to `.omo/evidence/merge-mage-release-gate/cleanup/task-1-cold-start.txt`.
    Expected: PASS iff `remaining` is an empty array.
    Evidence: .omo/evidence/merge-mage-release-gate/cleanup/task-1-cold-start.txt
  ```

  Commit: NO | Message: `test(release-gate): capture cold start evidence` | Files: [.omo/evidence/merge-mage-release-gate/browser/cold-start.json, .omo/evidence/merge-mage-release-gate/browser/cold-start.png, .omo/evidence/merge-mage-release-gate/cleanup/task-1-cold-start.txt]

- [ ] 2. CORE LOOP browser gate

  What to do: Execute the notepad C2 core-loop check in browser: exact initial summon cost accounting, auto-equip, same-level merge, and summon-floor rise. Use a fresh player path for cost/merge and a seeded browser state for the high-level floor threshold so the gate is finite.
  Must NOT do: Do not assert precise gold deltas after idle time has advanced; capture the click delta in one immediate browser evaluation. Do not skip floor-rise verification because it is slow naturally.

  Parallelization: Can parallel: NO | Wave 2 | Blocks: [3] | Blocked by: [1]

  References (executor has NO interview context - be exhaustive):
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:19` - summon floor and merge rule.
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:21` - summon cost and auto buy/merge controls.
  - Notepad: `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:23` - C2 exact criterion.
  - Cost source: `src/engine/summon.ts:7` - displayed and charged summon cost are integral at source.
  - Summon source: `src/engine/actions.ts:46` - summon spends cost and auto-equips into empty slots.
  - Merge source: `src/engine/actions.ts:74` - same-level merge updates book and highest level.
  - Controls: `src/ui/ControlsPanel.tsx:17` - `data-testid="summon-btn"`.
  - Slots: `src/ui/BooksPanel.tsx:73` - equipped slot test IDs and `Lv` badge.
  - Existing FE plan: `tests/testsprite/fe/01.json:1` - TestSprite plan covers summon and auto-equip.

  Acceptance criteria (agent-executable only):
  - [ ] `.omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.json` has `costDeltaPass === true`, `autoEquipPass === true`, and `mergePass === true`.
  - [ ] `.omo/evidence/merge-mage-release-gate/browser/core-loop-floor.json` has `beforeSummonLevel === 1`, `afterSummonLevel === 2`, and `mergedLevel === 10`.
  - [ ] Cleanup receipt `.omo/evidence/merge-mage-release-gate/cleanup/task-2-core-loop.txt` records all Merge Mage localStorage keys removed after both sub-scenarios.

  QA scenarios (MANDATORY - task incomplete without these):
  ```
  Scenario: fresh summon accounting and merge
    Tool:     browser:control-in-app-browser
    Steps:    Set viewport 390x844. Open `https://merge-mage.vercel.app/?fresh=1&gate=core-loop`. Wait for `#app-root[data-active-scene]` not booting. Run:
              `const root=document.querySelector("#app-root"); const btn=document.querySelector('[data-testid="summon-btn"]'); const cost=Number(btn.textContent.match(/(\\d+)$/)[1]); const before=Number(root.dataset.gold); btn.click(); await new Promise(requestAnimationFrame); const afterFirst=Number(root.dataset.gold); const slot0=document.querySelector('[data-testid="equip-slot-0"]').innerText; btn.click(); await new Promise(requestAnimationFrame); const slot1=document.querySelector('[data-testid="equip-slot-1"]').innerText; document.querySelector('[data-testid="equip-slot-0"]').click(); document.querySelector('[data-testid="equip-slot-1"]').click(); await new Promise(requestAnimationFrame); const slots=[...document.querySelectorAll('[data-testid^="equip-slot-"]')].map(el=>el.innerText); return {before,cost,afterFirst,delta:before-afterFirst,slot0,slot1,slots,costDeltaPass:before-afterFirst===cost,autoEquipPass:/Lv1/.test(slot0)&&/Lv1/.test(slot1),mergePass:slots.some(t=>/Lv2/.test(t))};`
              Save JSON to `.omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.json` and screenshot to `.omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.png`.
    Expected: PASS iff all three booleans are true.
    Evidence: .omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.json

  Scenario: summon floor rises at highest-level threshold
    Tool:     browser:control-in-app-browser
    Steps:    On `https://merge-mage.vercel.app`, run this setup, then reload:
              `localStorage.setItem("merge-mage:engine-state",JSON.stringify({gold:1000,books:[],equipped:[{id:"floor-a",level:9,element:"fire"},{id:"floor-b",level:9,element:"frost"},null,null,null,null],highestLevelEver:9,stage:1,wave:1,stageHp:64,wizardLevel:1,wizardXp:0,skillPoints:0,skills:{summonBonus:0,castSpeed:0,goldGain:0,critChance:0},manaCrystals:0,prestigeCount:0,lastSeenServerTs:null,slotTiers:[0,0,0,0,0,0],castProgressMs:[0,0,0,0,0,0],enemiesHp:[12.8,12.8,12.8,12.8,12.8],bossElapsedMs:0,frostSlowMs:0,recentGoldPerSecond:0,elapsedMs:0,rngSeed:42,rngState:42,nextBookId:3})); location.href="https://merge-mage.vercel.app/?gate=floor-fixture";`
              After reload and non-booting scene, run:
              `const root=document.querySelector("#app-root"); const beforeSummonLevel=Number(root.dataset.summonLevel); document.querySelector('[data-testid="equip-slot-0"]').click(); document.querySelector('[data-testid="equip-slot-1"]').click(); await new Promise(requestAnimationFrame); const afterSummonLevel=Number(root.dataset.summonLevel); const slots=[...document.querySelectorAll('[data-testid^="equip-slot-"]')].map(el=>el.innerText); return {beforeSummonLevel,afterSummonLevel,slots,mergedLevel:10,pass:beforeSummonLevel===1&&afterSummonLevel===2&&slots.some(t=>/Lv10/.test(t))};`
              Save JSON to `.omo/evidence/merge-mage-release-gate/browser/core-loop-floor.json`.
    Expected: PASS iff `pass === true`.
    Evidence: .omo/evidence/merge-mage-release-gate/browser/core-loop-floor.json

  Scenario: core loop cleanup receipt
    Tool:     browser:control-in-app-browser
    Steps:    Run:
              `["merge-mage:engine-state","merge-mage:save-token","merge-mage:nickname","merge-mage:audio-muted"].forEach(k=>localStorage.removeItem(k)); return {remaining:Object.keys(localStorage).filter(k=>k.startsWith("merge-mage:"))};`
              Save to `.omo/evidence/merge-mage-release-gate/cleanup/task-2-core-loop.txt`.
    Expected: PASS iff `remaining` is an empty array.
    Evidence: .omo/evidence/merge-mage-release-gate/cleanup/task-2-core-loop.txt
  ```

  Commit: NO | Message: `test(release-gate): capture core loop evidence` | Files: [.omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.json, .omo/evidence/merge-mage-release-gate/browser/core-loop-floor.json, .omo/evidence/merge-mage-release-gate/cleanup/task-2-core-loop.txt]

- [ ] 3. PERSISTENCE browser plus API gate

  What to do: Execute the notepad C3 persistence check after real progress and cloud save: save chip appears, reload keeps progress, and live `GET /api/save/:token` matches browser state.
  Must NOT do: Do not infer persistence from localStorage only. Do not use a token copied by a human.

  Parallelization: Can parallel: NO | Wave 3 | Blocks: [final] | Blocked by: [2]

  References (executor has NO interview context - be exhaustive):
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:29` - server offline/persistence authority.
  - Notepad: `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:28` - C3 exact criterion.
  - Save token: `src/ui/engineStorage.ts:58` - token stored in localStorage.
  - Save cadence: `src/ui/useEngineEffects.ts:99` - local and cloud save every 5000ms.
  - Save indicator: `src/ui/HudOverlay.tsx:68` - `data-testid="save-indicator"` labels SAVED/OFFLINE.
  - API route: `api/index.ts:33` - `GET /api/save/:token` returns saved state.
  - API client: `src/ui/apiClient.ts:50` - browser posts `{ token, nickname, state }`.

  Acceptance criteria (agent-executable only):
  - [ ] `.omo/evidence/merge-mage-release-gate/browser/persistence.json` contains a 32-character token, `saveIndicator === "SAVED"`, and matching `beforeReload`/`afterReload` stage, wave, gold, and summon level.
  - [ ] `.omo/evidence/merge-mage-release-gate/api/save-get.txt` has HTTP 200 and JSON state matching the browser artifact token/state.
  - [ ] Cleanup receipt `.omo/evidence/merge-mage-release-gate/cleanup/task-3-persistence.txt` records browser local cleanup and remote residue token note.

  QA scenarios (MANDATORY - task incomplete without these):
  ```
  Scenario: browser state survives reload
    Tool:     browser:control-in-app-browser
    Steps:    Browser: set viewport 390x844. Open `https://merge-mage.vercel.app/?fresh=1&gate=persistence`. Wait for non-booting scene. Click `[data-testid="summon-btn"]` once. Wait until `[data-testid="save-indicator"]` text is `SAVED` or 7000ms elapses. Run:
              `const root=document.querySelector("#app-root"); const beforeReload={gold:Number(root.dataset.gold),stage:Number(root.dataset.stage),wave:Number(root.dataset.wave),summonLevel:Number(root.dataset.summonLevel)}; const token=localStorage.getItem("merge-mage:save-token"); const localState=JSON.parse(localStorage.getItem("merge-mage:engine-state")); return {token,saveIndicator:document.querySelector('[data-testid="save-indicator"]').innerText.trim(),beforeReload,localState};`
              Save to `.omo/evidence/merge-mage-release-gate/browser/persistence-before.json`. Reload `https://merge-mage.vercel.app/?gate=persistence-reload` without `fresh`; wait non-booting; run:
              `const root=document.querySelector("#app-root"); return {afterReload:{gold:Number(root.dataset.gold),stage:Number(root.dataset.stage),wave:Number(root.dataset.wave),summonLevel:Number(root.dataset.summonLevel)},token:localStorage.getItem("merge-mage:save-token"),saveIndicator:document.querySelector('[data-testid="save-indicator"]').innerText.trim()};`
              Merge before/after into `.omo/evidence/merge-mage-release-gate/browser/persistence.json`.
    Expected: PASS iff browser reload values match and `saveIndicator === "SAVED"`.
    Evidence: .omo/evidence/merge-mage-release-gate/browser/persistence.json

  Scenario: API save matches browser token
    Tool:     bash
    Steps:    Run:
              `TOKEN=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(".omo/evidence/merge-mage-release-gate/browser/persistence.json","utf8")).token)'); curl -sS -i "https://merge-mage.vercel.app/api/save/$TOKEN" > .omo/evidence/merge-mage-release-gate/api/save-get.txt`
    Expected: PASS iff `.omo/evidence/merge-mage-release-gate/api/save-get.txt` starts with HTTP 200 and the response body state matches `.omo/evidence/merge-mage-release-gate/browser/persistence.json`.
    Evidence: .omo/evidence/merge-mage-release-gate/api/save-get.txt

  Scenario: persistence cleanup receipt
    Tool:     browser:control-in-app-browser
    Steps:    Remove `merge-mage:*` localStorage keys with:
              `["merge-mage:engine-state","merge-mage:save-token","merge-mage:nickname","merge-mage:audio-muted"].forEach(k=>localStorage.removeItem(k)); return {remaining:Object.keys(localStorage).filter(k=>k.startsWith("merge-mage:")),remoteCleanup:"no public delete endpoint for /api/save; fixture token recorded in browser/persistence.json"};`
              Save to `.omo/evidence/merge-mage-release-gate/cleanup/task-3-persistence.txt`.
    Expected: PASS iff browser remaining keys are empty and the receipt records that remote save residue cannot be deleted through a public API.
    Evidence: .omo/evidence/merge-mage-release-gate/cleanup/task-3-persistence.txt
  ```

  Commit: NO | Message: `test(release-gate): capture persistence evidence` | Files: [.omo/evidence/merge-mage-release-gate/browser/persistence.json, .omo/evidence/merge-mage-release-gate/api/save-get.txt, .omo/evidence/merge-mage-release-gate/cleanup/task-3-persistence.txt]

- [ ] 4. SERVER AUTHORITY HTTP gate

  What to do: Execute the notepad C4 server-authority checks with `curl -i`: invalid saves, server-derived leaderboard stage, and server-time offline cap despite client-clock fields.
  Must NOT do: Do not import project source into backend TestSprite code. Do not treat extra client fields as proof unless the response proves server-derived values.

  Parallelization: Can parallel: YES | Wave 1 | Blocks: [final] | Blocked by: []

  References (executor has NO interview context - be exhaustive):
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:29` - offline settlement uses server clock and 8h cap.
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:53` - BE tests cover negative/NaN, clock manipulation, leaderboard integrity.
  - Notepad: `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:33` - C4 exact criterion.
  - API routes: `api/index.ts:25` - save validation.
  - API routes: `api/index.ts:45` - offline claim.
  - API routes: `api/index.ts:68` - leaderboard derives `bestStage`.
  - Schema: `api/_lib/schemas.ts:6` - max gold/stage and token schema.
  - DB: `api/_lib/db.ts:51` - offline claim uses server `now()`.
  - DB: `api/_lib/db.ts:90` - leaderboard loads saved stage by token.
  - Existing BE tests: `tests/testsprite/be/02-save-rejects-invalid.py:6` - invalid save assertions.

  Acceptance criteria (agent-executable only):
  - [ ] `.omo/evidence/merge-mage-release-gate/api/server-authority-summary.json` has `negativeGoldStatus === 400`, `absurdStageStatus === 400`, `nanStatus === 400`, `leaderboardBestStage === 4`, and `offlineCappedHours <= 8`.
  - [ ] Raw curl transcripts exist for each API call under `.omo/evidence/merge-mage-release-gate/api/server-authority-*.txt`.
  - [ ] Cleanup receipt `.omo/evidence/merge-mage-release-gate/cleanup/task-4-server-authority.txt` records fixture token, nickname, and no public delete endpoint.

  QA scenarios (MANDATORY - task incomplete without these):
  ```
  Scenario: invalid saves, server-derived leaderboard, offline cap
    Tool:     bash
    Steps:    Run:
              `mkdir -p .omo/evidence/merge-mage-release-gate/api .omo/evidence/merge-mage-release-gate/cleanup; BASE=https://merge-mage.vercel.app; TOKEN="rgate$(date -u +%Y%m%d%H%M%S)server"; NICK="RGateTmp"; STATE='{"gold":500,"books":[{"id":"b1","level":3,"element":"fire"}],"equipped":[null,null,null,null,null,null],"highestLevelEver":3,"stage":4,"wave":1,"stageHp":64,"wizardLevel":1,"wizardXp":0,"skillPoints":0,"skills":{"summonBonus":0,"castSpeed":0,"goldGain":0,"critChance":0},"manaCrystals":0,"prestigeCount":0,"lastSeenServerTs":1,"slotTiers":[0,0,0,0,0,0],"castProgressMs":[0,0,0,0,0,0],"enemiesHp":[12.8,12.8,12.8,12.8,12.8],"bossElapsedMs":0,"frostSlowMs":0,"recentGoldPerSecond":10,"elapsedMs":0,"rngSeed":42,"rngState":42,"nextBookId":1}'; printf '{"token":"%s","state":%s}' "$TOKEN" "$(printf '%s' "$STATE" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{const o=JSON.parse(s);o.gold=-5;process.stdout.write(JSON.stringify(o))})')" > .omo/evidence/merge-mage-release-gate/api/server-authority-negative.json; curl -sS -i -X POST "$BASE/api/save" -H 'content-type: application/json' --data @.omo/evidence/merge-mage-release-gate/api/server-authority-negative.json > .omo/evidence/merge-mage-release-gate/api/server-authority-negative.txt; printf '{"token":"%s","state":%s}' "$TOKEN" "$(printf '%s' "$STATE" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{const o=JSON.parse(s);o.stage=999999;process.stdout.write(JSON.stringify(o))})')" > .omo/evidence/merge-mage-release-gate/api/server-authority-stage.json; curl -sS -i -X POST "$BASE/api/save" -H 'content-type: application/json' --data @.omo/evidence/merge-mage-release-gate/api/server-authority-stage.json > .omo/evidence/merge-mage-release-gate/api/server-authority-stage.txt; printf '{"token":"%s","state":{"gold":NaN}}' "$TOKEN" > .omo/evidence/merge-mage-release-gate/api/server-authority-nan.json; curl -sS -i -X POST "$BASE/api/save" -H 'content-type: application/json' --data @.omo/evidence/merge-mage-release-gate/api/server-authority-nan.json > .omo/evidence/merge-mage-release-gate/api/server-authority-nan.txt; printf '{"token":"%s","state":%s}' "$TOKEN" "$STATE" > .omo/evidence/merge-mage-release-gate/api/server-authority-valid.json; curl -sS -i -X POST "$BASE/api/save" -H 'content-type: application/json' --data @.omo/evidence/merge-mage-release-gate/api/server-authority-valid.json > .omo/evidence/merge-mage-release-gate/api/server-authority-valid.txt; printf '{"token":"%s","nickname":"%s","stage":999999}' "$TOKEN" "$NICK" > .omo/evidence/merge-mage-release-gate/api/server-authority-leaderboard.json; curl -sS -i -X POST "$BASE/api/leaderboard" -H 'content-type: application/json' --data @.omo/evidence/merge-mage-release-gate/api/server-authority-leaderboard.json > .omo/evidence/merge-mage-release-gate/api/server-authority-leaderboard.txt; printf '{"token":"%s","clientNowMs":4102444800000,"elapsedMs":999999999}' "$TOKEN" > .omo/evidence/merge-mage-release-gate/api/server-authority-offline.json; curl -sS -i -X POST "$BASE/api/offline-claim" -H 'content-type: application/json' --data @.omo/evidence/merge-mage-release-gate/api/server-authority-offline.json > .omo/evidence/merge-mage-release-gate/api/server-authority-offline.txt; node -e 'const fs=require("fs"); const p=".omo/evidence/merge-mage-release-gate/api/"; const status=f=>(fs.readFileSync(p+f,"utf8").match(/^HTTP\\/\\S+ (\\d+)/m)||[])[1]*1; const json=f=>JSON.parse(fs.readFileSync(p+f,"utf8").split(/\\r?\\n\\r?\\n/).pop()); const summary={negativeGoldStatus:status("server-authority-negative.txt"),absurdStageStatus:status("server-authority-stage.txt"),nanStatus:status("server-authority-nan.txt"),validStatus:status("server-authority-valid.txt"),leaderboardStatus:status("server-authority-leaderboard.txt"),leaderboardBestStage:json("server-authority-leaderboard.txt").bestStage,offlineStatus:status("server-authority-offline.txt"),offlineCappedHours:json("server-authority-offline.txt").cappedHours,offlineGold:json("server-authority-offline.txt").gold}; fs.writeFileSync(p+"server-authority-summary.json", JSON.stringify(summary,null,2)); if(!(summary.negativeGoldStatus===400&&summary.absurdStageStatus===400&&summary.nanStatus===400&&summary.leaderboardBestStage===4&&summary.offlineCappedHours<=8)) process.exit(1);'`
    Expected: PASS iff the final node assertion exits 0 and writes the summary JSON.
    Evidence: .omo/evidence/merge-mage-release-gate/api/server-authority-summary.json

  Scenario: server fixture cleanup receipt
    Tool:     bash
    Steps:    Run:
              `printf 'remote cleanup: no public delete endpoint for /api/save or /api/leaderboard; fixture token/nickname are recorded in api/server-authority-*.json and use low stage 4\\n' > .omo/evidence/merge-mage-release-gate/cleanup/task-4-server-authority.txt`
    Expected: PASS iff the receipt exists and names the remote residue limitation.
    Evidence: .omo/evidence/merge-mage-release-gate/cleanup/task-4-server-authority.txt
  ```

  Commit: NO | Message: `test(release-gate): capture server authority evidence` | Files: [.omo/evidence/merge-mage-release-gate/api/server-authority-summary.json, .omo/evidence/merge-mage-release-gate/cleanup/task-4-server-authority.txt]

- [ ] 5. SETTINGS browser gate

  What to do: Execute the notepad C5 settings check: all four tabs open, visible controls respond, sound toggle persists, new game requires two taps, delayed "cancel" disarms, and confirmed new game wipes browser state.
  Must NOT do: Do not treat the absence of an explicit Cancel button as failure; the current UI cancels by timeout. Do not click Credits unless the browser can capture the opened target without losing the game page.

  Parallelization: Can parallel: YES | Wave 1 | Blocks: [final] | Blocked by: []

  References (executor has NO interview context - be exhaustive):
  - Contract: `docs/specs/2026-07-02-merge-mage-design.md:14` - mute toggle is required.
  - Notepad: `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:38` - C5 exact criterion.
  - Tabs: `src/ui/GameShell.tsx:17` - four tabs and test IDs.
  - Tab render: `src/ui/renderTab.tsx:22` - books, skills, rebirth, ranks routing.
  - Settings controls: `src/ui/HudOverlay.tsx:76` - settings button and popover.
  - Sound persistence: `src/game/GameAudio.ts:1` - localStorage key `merge-mage:audio-muted`.
  - New game: `src/ui/HudOverlay.tsx:30` - first tap arms, second tap wipes.
  - Clear state: `src/ui/engineStorage.ts:51` - new game removes state/token/nickname.

  Acceptance criteria (agent-executable only):
  - [ ] `.omo/evidence/merge-mage-release-gate/browser/settings.json` has four tab checks passing, `soundPersisted === true`, `newGameDisarmed === true`, and `newGameWiped === true`.
  - [ ] Screenshots `.omo/evidence/merge-mage-release-gate/browser/settings-tabs.png` and `.omo/evidence/merge-mage-release-gate/browser/settings-popover.png` exist.
  - [ ] Cleanup receipt `.omo/evidence/merge-mage-release-gate/cleanup/task-5-settings.txt` records empty Merge Mage localStorage.

  QA scenarios (MANDATORY - task incomplete without these):
  ```
  Scenario: settings and tabs are live
    Tool:     browser:control-in-app-browser
    Steps:    Set viewport 390x844. Open `https://merge-mage.vercel.app/?fresh=1&gate=settings`. Wait for non-booting scene. Run:
              `const click=async s=>{document.querySelector(s).click(); await new Promise(requestAnimationFrame)}; const tabIds=["tab-books","tab-skills","tab-rebirth","tab-ranks"]; const tabChecks=[]; for (const id of tabIds){await click('[data-testid="'+id+'"]'); tabChecks.push({id,pressed:document.querySelector('[data-testid="'+id+'"]').getAttribute("aria-pressed"),text:document.querySelector(".tab-content").innerText});} await click('[data-testid="settings-btn"]'); const beforeSound=document.querySelector('[data-testid="settings-sound"]').innerText; await click('[data-testid="settings-sound"]'); const storedAfterToggle=localStorage.getItem("merge-mage:audio-muted"); location.reload(); await new Promise(r=>setTimeout(r,1000)); await click('[data-testid="settings-btn"]'); const soundPersisted=localStorage.getItem("merge-mage:audio-muted")===storedAfterToggle; await click('[data-testid="settings-new-game"]'); const armedText=document.querySelector('[data-testid="settings-new-game"]').innerText; await new Promise(r=>setTimeout(r,3200)); const disarmedText=document.querySelector('[data-testid="settings-new-game"]').innerText; await click('[data-testid="settings-new-game"]'); await click('[data-testid="settings-new-game"]'); await new Promise(r=>setTimeout(r,1000)); const root=document.querySelector("#app-root"); const remaining=Object.keys(localStorage).filter(k=>k.startsWith("merge-mage:")); return {tabChecks,beforeSound,storedAfterToggle,soundPersisted,armedText,disarmedText,newGameDisarmed:/NEW GAME/.test(disarmedText),newGameWiped:Number(root.dataset.gold)===100&&remaining.length<=1,remaining};`
              Save JSON to `.omo/evidence/merge-mage-release-gate/browser/settings.json`. Capture screenshots after tab traversal and popover.
    Expected: PASS iff every tab has `aria-pressed="true"` when selected, sound persistence is true, first new-game tap disarms after timeout, and confirmed wipe returns to fresh gold/state.
    Evidence: .omo/evidence/merge-mage-release-gate/browser/settings.json

  Scenario: settings cleanup receipt
    Tool:     browser:control-in-app-browser
    Steps:    Run:
              `["merge-mage:engine-state","merge-mage:save-token","merge-mage:nickname","merge-mage:audio-muted"].forEach(k=>localStorage.removeItem(k)); return {remaining:Object.keys(localStorage).filter(k=>k.startsWith("merge-mage:"))};`
              Save to `.omo/evidence/merge-mage-release-gate/cleanup/task-5-settings.txt`.
    Expected: PASS iff `remaining` is an empty array.
    Evidence: .omo/evidence/merge-mage-release-gate/cleanup/task-5-settings.txt
  ```

  Commit: NO | Message: `test(release-gate): capture settings evidence` | Files: [.omo/evidence/merge-mage-release-gate/browser/settings.json, .omo/evidence/merge-mage-release-gate/cleanup/task-5-settings.txt]

- [ ] 6. JUDGE SURFACE repository, CI, and TestSprite gate

  What to do: Execute the notepad C6 judge-surface check: live HTTP smoke, README/LOOP/git consistency, GitHub Actions status, TestSprite preflight, backend suite, and frontend smoke.
  Must NOT do: Do not call a missing GitHub/TestSprite credential a product failure. Mark BLOCKED with the exact auth error and evidence path.

  Parallelization: Can parallel: YES | Wave 1 | Blocks: [final] | Blocked by: []

  References (executor has NO interview context - be exhaustive):
  - Notepad: `.omo/evidence/merge-mage-release-gate/notepad/release-gate-notepad.md:43` - C6 exact criterion.
  - README claims: `README.md:18` - claims 7 FE plus 4 BE TestSprite tests.
  - README API: `README.md:39` - public API contract.
  - LOOP latest: `LOOP.md:12` - release build all-green claim.
  - Workflow: `.github/workflows/testsprite.yml:36` - backend suite command.
  - Workflow: `.github/workflows/testsprite.yml:41` - frontend smoke command.
  - AGENTS preflight: `AGENTS.md:18` - TestSprite CLI/auth commands.
  - AGENTS failure artifacts: `AGENTS.md:83` - artifact download command on failure.
  - Local scripts: `package.json:6` - build/test scripts available for repo sanity if needed.

  Acceptance criteria (agent-executable only):
  - [ ] `.omo/evidence/merge-mage-release-gate/repo/judge-surface.txt` records HTTP 200 for `/`, HTTP 200 with `{ ok: true }` for `/api/health`, seven FE plan files, four BE scripts, README/LOOP/git consistency, and current git SHA.
  - [ ] `.omo/evidence/merge-mage-release-gate/repo/gh-run-list.json` shows the latest `testsprite-gate` run conclusion is `success`, or `.omo/evidence/merge-mage-release-gate/blockers/gh-auth.txt` records the auth blocker.
  - [ ] `.omo/evidence/merge-mage-release-gate/testsprite/preflight.txt`, `testsprite/backend-run.json`, and `testsprite/frontend-smoke-run.json` exist with exit code 0, or the matching blocker/artifact bundle exists.
  - [ ] Cleanup receipt `.omo/evidence/merge-mage-release-gate/cleanup/task-6-judge-surface.txt` records no local processes left and lists TestSprite dashboard URLs/run IDs if present.

  QA scenarios (MANDATORY - task incomplete without these):
  ```
  Scenario: judge surface live, CI, and TestSprite
    Tool:     bash
    Steps:    Run:
              `mkdir -p .omo/evidence/merge-mage-release-gate/repo .omo/evidence/merge-mage-release-gate/testsprite .omo/evidence/merge-mage-release-gate/blockers .omo/evidence/merge-mage-release-gate/cleanup; { echo '# live root'; curl -sS -i https://merge-mage.vercel.app | sed -n '1,20p'; echo '# health'; curl -sS -i https://merge-mage.vercel.app/api/health; echo '# files'; find tests/testsprite/fe -maxdepth 1 -name '*.json' | sort; find tests/testsprite/be -maxdepth 1 -name '*.py' | sort; echo '# git'; git rev-parse HEAD; git log --oneline -n 20; echo '# loop'; sed -n '1,20p' LOOP.md; } > .omo/evidence/merge-mage-release-gate/repo/judge-surface.txt; gh run list --workflow testsprite-gate --limit 5 --json status,conclusion,headSha,event,createdAt,url > .omo/evidence/merge-mage-release-gate/repo/gh-run-list.json || gh auth status > .omo/evidence/merge-mage-release-gate/blockers/gh-auth.txt 2>&1; { testsprite --version; testsprite auth whoami; } > .omo/evidence/merge-mage-release-gate/testsprite/preflight.txt 2>&1; testsprite test run --all --project 83edef2d-3534-491d-9529-929416c41499 --wait --timeout 600 --output json > .omo/evidence/merge-mage-release-gate/testsprite/backend-run.json 2>&1 || { RUN_ID=$(node -e 'const fs=require("fs"); const s=fs.readFileSync(".omo/evidence/merge-mage-release-gate/testsprite/backend-run.json","utf8"); const m=s.match(/"runId"\\s*:\\s*"([^"]+)"/); if(m) console.log(m[1]);'); if [ -n "$RUN_ID" ]; then testsprite test artifact get "$RUN_ID" --out ".omo/evidence/merge-mage-release-gate/testsprite/backend-$RUN_ID"; fi; exit 1; }; testsprite test run 767706ae-35da-47cb-a1f0-6e5ec92dbe54 --wait --timeout 900 --output json > .omo/evidence/merge-mage-release-gate/testsprite/frontend-smoke-run.json 2>&1 || { RUN_ID=$(node -e 'const fs=require("fs"); const s=fs.readFileSync(".omo/evidence/merge-mage-release-gate/testsprite/frontend-smoke-run.json","utf8"); const m=s.match(/"runId"\\s*:\\s*"([^"]+)"/); if(m) console.log(m[1]);'); if [ -n "$RUN_ID" ]; then testsprite test artifact get "$RUN_ID" --out ".omo/evidence/merge-mage-release-gate/testsprite/frontend-$RUN_ID"; fi; exit 1; }; node -e 'const fs=require("fs"); const judge=fs.readFileSync(".omo/evidence/merge-mage-release-gate/repo/judge-surface.txt","utf8"); const gh=fs.existsSync(".omo/evidence/merge-mage-release-gate/repo/gh-run-list.json")?JSON.parse(fs.readFileSync(".omo/evidence/merge-mage-release-gate/repo/gh-run-list.json","utf8")):[]; const ok=judge.includes("HTTP/2 200")||judge.includes("HTTP/1.1 200"); const counts=(judge.match(/tests\\/testsprite\\/fe\\/.*\\.json/g)||[]).length===7&&(judge.match(/tests\\/testsprite\\/be\\/.*\\.py/g)||[]).length===4; const ghOk=gh[0]?.conclusion==="success"; if(!(ok&&counts&&ghOk)) process.exit(1);'`
    Expected: PASS iff live HTTP, file counts, latest CI success, TestSprite preflight, backend suite, and frontend smoke all exit 0. If auth fails, BLOCKED with exact blocker file, not APPROVE.
    Evidence: .omo/evidence/merge-mage-release-gate/repo/judge-surface.txt

  Scenario: judge surface cleanup receipt
    Tool:     bash
    Steps:    Run:
              `printf 'cleanup: no local server started; no tmux session started; TestSprite/GitHub remote run records are immutable audit evidence\\n' > .omo/evidence/merge-mage-release-gate/cleanup/task-6-judge-surface.txt`
    Expected: PASS iff the receipt exists and there are no leftover local processes from this task.
    Evidence: .omo/evidence/merge-mage-release-gate/cleanup/task-6-judge-surface.txt
  ```

  Commit: NO | Message: `test(release-gate): capture judge surface evidence` | Files: [.omo/evidence/merge-mage-release-gate/repo/judge-surface.txt, .omo/evidence/merge-mage-release-gate/repo/gh-run-list.json, .omo/evidence/merge-mage-release-gate/testsprite/preflight.txt, .omo/evidence/merge-mage-release-gate/cleanup/task-6-judge-surface.txt]

## Final verification wave (MANDATORY - after all implementation tasks)
> Runs in PARALLEL. ALL must APPROVE. Surface results to the caller and wait for an explicit "okay" before declaring complete.
- [ ] F1. Plan compliance audit - run `node -e 'const fs=require("fs"); const required=["browser/cold-start.json","browser/cold-start.png","browser/core-loop-cost-merge.json","browser/core-loop-cost-merge.png","browser/core-loop-floor.json","browser/persistence.json","api/save-get.txt","api/server-authority-summary.json","browser/settings.json","browser/settings-tabs.png","browser/settings-popover.png","repo/judge-surface.txt","repo/gh-run-list.json","testsprite/preflight.txt","testsprite/backend-run.json","testsprite/frontend-smoke-run.json","cleanup/task-1-cold-start.txt","cleanup/task-2-core-loop.txt","cleanup/task-3-persistence.txt","cleanup/task-4-server-authority.txt","cleanup/task-5-settings.txt","cleanup/task-6-judge-surface.txt"]; const base=".omo/evidence/merge-mage-release-gate/"; const missing=required.filter(p=>!fs.existsSync(base+p)); if(missing.length){console.error(missing.join("\\n")); process.exit(1)}'` and write output to `.omo/evidence/merge-mage-release-gate/final/F1-plan-compliance.txt`.
- [ ] F2. Code quality review - read-only audit of `git status --short`, `git diff -- . ':(exclude).omo/evidence/**' ':(exclude).omo/plans/**'`, and fail if product files changed; write `.omo/evidence/merge-mage-release-gate/final/F2-code-quality.txt`.
- [ ] F3. Real manual QA - verify every browser screenshot/JSON/API/TestSprite artifact opens and has a binary pass field; write `.omo/evidence/merge-mage-release-gate/final/F3-real-manual-qa.txt`.
- [ ] F4. Scope fidelity - compare plan scope against `docs/specs/2026-07-02-merge-mage-design.md`, notepad criteria, and Must NOT list; write `.omo/evidence/merge-mage-release-gate/final/F4-scope-fidelity.txt`.

## Commit strategy
- One logical change per commit. Conventional Commits (`<type>(<scope>): <subject>` body + footer).
- Atomic: every commit builds and passes tests on its own.
- No "WIP" / "fix typo squash later" commits on the final branch - clean up before merge.
- Reference the plan file path in the final commit footer: `Plan: .omo/plans/merge-mage-release-gate-review.md`.
- For this release-gate planning request, commit is NO unless the user separately asks to commit plan/evidence artifacts.

## Success criteria
- APPROVE only when all six criteria pass from captured evidence, all cleanup receipts exist, TestSprite/GitHub blockers are absent, F1-F4 approve, and no product files changed.
- ITERATE if any criterion fails, any expected artifact is missing, any cleanup receipt is missing, GitHub/TestSprite auth blocks verification, or remote fixture residue is not acknowledged.
- Current missing evidence paths before execution:
  - `.omo/evidence/merge-mage-release-gate/browser/cold-start.json`
  - `.omo/evidence/merge-mage-release-gate/browser/cold-start.png`
  - `.omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.json`
  - `.omo/evidence/merge-mage-release-gate/browser/core-loop-cost-merge.png`
  - `.omo/evidence/merge-mage-release-gate/browser/core-loop-floor.json`
  - `.omo/evidence/merge-mage-release-gate/browser/persistence.json`
  - `.omo/evidence/merge-mage-release-gate/api/save-get.txt`
  - `.omo/evidence/merge-mage-release-gate/api/server-authority-summary.json`
  - `.omo/evidence/merge-mage-release-gate/browser/settings.json`
  - `.omo/evidence/merge-mage-release-gate/browser/settings-tabs.png`
  - `.omo/evidence/merge-mage-release-gate/browser/settings-popover.png`
  - `.omo/evidence/merge-mage-release-gate/repo/judge-surface.txt`
  - `.omo/evidence/merge-mage-release-gate/repo/gh-run-list.json`
  - `.omo/evidence/merge-mage-release-gate/testsprite/preflight.txt`
  - `.omo/evidence/merge-mage-release-gate/testsprite/backend-run.json`
  - `.omo/evidence/merge-mage-release-gate/testsprite/frontend-smoke-run.json`
  - `.omo/evidence/merge-mage-release-gate/cleanup/task-1-cold-start.txt`
  - `.omo/evidence/merge-mage-release-gate/cleanup/task-2-core-loop.txt`
  - `.omo/evidence/merge-mage-release-gate/cleanup/task-3-persistence.txt`
  - `.omo/evidence/merge-mage-release-gate/cleanup/task-4-server-authority.txt`
  - `.omo/evidence/merge-mage-release-gate/cleanup/task-5-settings.txt`
  - `.omo/evidence/merge-mage-release-gate/cleanup/task-6-judge-surface.txt`
