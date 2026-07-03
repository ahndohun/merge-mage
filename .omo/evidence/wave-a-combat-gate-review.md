# Wave A Combat Gate Review

## recommendation

REJECT for final approval; maps to user-facing `VERDICT: REVISE`.

## originalIntent

Implement Orbiting Grimoires for Merge Mage Wave A combat visuals: up to six equipped books orbit the wizard in an ellipse; pixel-art integer scale; no sprite rotation; element tint/glow; y-based depth swap behind/in front of the wizard; wizard stays in Idle for casts; projectiles launch from the current orbiting book position and home to the target; mobs spread into 2-3 columns without changing count. Art direction is governed by `docs/ART-DIRECTION.md`.

## desiredOutcome

At `https://merge-mage.vercel.app/?fresh=1` on 390x844 mobile portrait, after summoning/equipping books, visible tomes should orbit around the idle wizard as real battle state, fire from their live positions into moving mobs, and preserve the pixel-art direction without web-feel or non-integer sprite scaling.

## userOutcomeReview

The core requested behavior is mostly real and wired through production state/event paths, not mocked. `EngineState.equipped` drives `OrbitingTomesView.syncEquipped`; engine `cast` events carry `slotIdx`; `BattleScene.playCast` routes the slot to `OrbitingTomesView.playCast`; and `BattleEffects.fireProjectile` re-samples the active target impact point every frame until impact.

The 390x844 capture shows three equipped Lv1 books in slots and three visible tome/glow objects around the wizard. Mobs remain five per regular wave via `REGULAR_MOB_COUNT = 5`, while `getMobSpawnPoint` spreads them across 2 or 3 columns.

Approval is blocked because combat code still violates/risks the art and cleanup bar in the inspected scope, and the available artifacts do not prove the dynamic runtime behavior.

## blockers

1. Stale production comment contradicts the implementation.
   - `src/game/scenes/BattleScene.ts:131` says `BattleWizardView.playCast()` queues several casts, but `src/game/scenes/BattleWizardView.ts:33` now forces Idle and immediately invokes the callback. This is direct remove-ai-slops category 1/6: misleading stale comment created by the change.

2. Pixel-art integer-scale rule is not consistently upheld in the inspected combat visual path.
   - `src/game/scenes/BattleEffects.ts:30` defines `HOLY_IMPACT_SCALE = 64 / 48`, and `src/game/scenes/BattleEffects.ts:199` applies that fractional scale. `src/game/scenes/BattleEffects.ts:140` also calls impact scale `1.7` for boss death. The requested Orbiting Grimoires themselves use integer scales, but the reviewed combat visual path still contains non-integer Phaser sprite scaling under the same art-direction gate.

3. Projectile launch origin is captured before the tome flash tween completes.
   - `src/game/scenes/OrbitingTomesView.ts:83` stores `origin` before the 75ms punch tween; `src/game/scenes/OrbitingTomesView.ts:94` launches with that stale point. Since the holder keeps orbiting during scene updates, this is not strictly "launch from current orbiting book position" at launch time.

4. Evidence does not prove the animated requirements.
   - The only Wave A visual artifact found is a single PNG: `.omo/evidence/wave-a-combat/orbiting-tomes-390x844.png`.
   - No WebGL readback, video, frame sequence, DOM mirror of tome positions, or E2E assertion proves orbiting motion, y-depth swapping over time, or homing to a moving target.

5. Required independent review/slop coverage artifact for this Wave A change is absent.
   - Search found no Wave A-specific code review report, manual QA matrix, or notepad artifact with explicit `remove-ai-slops` overfit/slop and `programming` criteria coverage.

## checkedArtifactPaths

- `docs/specs/2026-07-02-merge-mage-design.md`
- `docs/ART-DIRECTION.md`
- `docs/specs/2026-07-03-grand-update-v3.md`
- `src/game/scenes/OrbitingTomesView.ts`
- `src/game/scenes/BattleScene.ts`
- `src/game/scenes/BattleWizardView.ts`
- `src/game/scenes/BattleEffects.ts`
- `src/game/scenes/BattleLayout.ts`
- `src/game/scenes/BattleMobView.ts`
- `src/engine/battle.ts`
- `src/engine/types.ts`
- `src/engine/state.ts`
- `src/engine/constants.ts`
- `src/ui/useEngine.ts`
- `src/game/scenes/BattleLayout.test.ts`
- `src/engine/battle.test.ts`
- `.omo/evidence/wave-a-combat/orbiting-tomes-390x844.png`
- `.testsprite/runs/2ced57e0-a70d-4500-b699-ac21e25eb244/{result.json,failure.json,meta.json}`
- `.testsprite/runs/d43e56aa-b80e-4f30-93e1-17b48bf3ee60/{result.json,failure.json,meta.json}`
- `.testsprite/runs/ddb509ee-49c0-436e-94fd-d3bff22eb3d1/{result.json,failure.json,meta.json}`
- `LOOP.md`

## directSkillPass

- `omo:programming`: TypeScript review checked for typed event flow, no `any`/suppression use in the inspected changed path, exhaustive variants via `assertNever`, and cleanup risks. `pnpm exec tsc --noEmit --pretty false` exited 0.
- `omo:remove-ai-slops`: Direct pass found stale/misleading comment slop in `BattleScene.ts`; overfit coverage risk in `battle.test.ts` because the new `targetIndex` test only asserts the hard-coded current behavior (`0`) and does not prove future target selection or projectile routing; no excessive deletion-only tests were found.

## verificationRunByReviewer

- `pnpm exec tsc --noEmit --pretty false`: PASS.
- `pnpm test -- --run src/game/scenes/BattleLayout.test.ts src/engine/battle.test.ts`: PASS, Vitest reported 19 files and 126 tests passed.
- LSP diagnostics: not available because `typescript-language-server` is not installed.
- Capture inspection: local PNG is 390x844 and visually contains the 390x844 game canvas with three equipped books and three visible orbiting tome/glow objects.

## exactEvidenceGaps

- No Wave A-specific manual QA matrix was present under `.omo/evidence/wave-a-combat/`; only the PNG was present.
- No video/frame-by-frame evidence proves orbit motion, depth swap crossing, homing behavior, or no-rotation during runtime.
- No Phaser-level automated test covers `OrbitingTomesView`, `BattleScene.playCast`, or `BattleEffects.fireProjectile`.
- TestSprite FE artifacts are unrelated to orbiting tomes/projectile origin; they cover Auto Buy, merge, and skills reset.
- Existing blocked TestSprite FE artifacts contain PASS prose, but their machine verdicts remain `blocked`; one FE artifact is a real `failed` verdict for skills reset, out of scope for Wave A but not a green FE suite.

## passingEvidence

- Six-slot maximum is encoded in `EquippedBooks` and `OrbitingTomesView` creates one holder per slot.
- `syncEquipped` hides empty slots and shows equipped spellbooks from actual `EngineState.equipped`.
- Ellipse positioning uses `ORBIT_RX = 46`, `ORBIT_RY = 30`, rounded holder positions, and y-based depth relative to the wizard center.
- Wizard cast behavior remains Idle-only in `BattleWizardView.playCast`.
- Projectile homing is implemented via scene update listeners and dynamic target impact point sampling while the target is active.
- Regular mob count remains five in `createWaveEnemies`; layout spreads those mobs across 2-3 columns.

