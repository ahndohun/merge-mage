# Wave A Combat Targeted Recheck Gate Review

## recommendation

REJECT for strict gate approval; maps to user-visible `VERDICT: REVISE`.

## originalIntent

Recheck the prior Wave A combat blockers after revise. The requested feature is the Orbiting Grimoires combat presentation: equipped books visibly orbit the idle wizard on a 390x844 mobile-portrait canvas, use pixel-art integer scales, launch projectiles from the current orbiting book position, home toward the target, and preserve the Phaser/game-feel art direction.

## desiredOutcome

All prior blockers are resolved, no new blocker is evident in the named changed files or supplied evidence frames, and the reviewer can return `VERDICT: PASS`.

## userOutcomeReview

The previous code-specific blockers are resolved in the current source:

- `src/game/scenes/BattleScene.ts` no longer contains the stale cast-queue comment from the prior review.
- `src/game/scenes/BattleEffects.ts` now uses `HOLY_IMPACT_SCALE = 2`, and `bossDeath` calls `playImpact(point, 2)`.
- `src/game/scenes/OrbitingTomesView.ts` now calls `onLaunch(this.getEntryPoint(entry))` inside the punch tween `onComplete`, so launch origin is sampled at launch time. `getEntryPoint` also repositions entries from the latest scene time before returning the holder position.
- The added frame sequence exists, is 390x844, and visually shows the equipped tomes and combat effects at different times after summon input.

The targeted runtime evidence gap from the previous review is materially improved by the three-frame sequence. I did not find a new runtime/art-direction blocker in the screenshots or in the named changed files.

Strict gate approval is still blocked by the required slop/programming pass below.

## blockers

1. `src/game/scenes/BattleScene.ts` is now 279 pure LOC with no `SIZE_OK` justification.
   - Evidence: `awk '!/^[[:space:]]*$/ && !/^[[:space:]]*(\/\/|#|--)/' src/game/scenes/BattleScene.ts | wc -l` returned `279`.
   - Gate impact: `omo:programming` and `omo:remove-ai-slops` both treat source files over 250 pure LOC as an architectural defect/slop unless justified. This is a new blocker evident in a changed file.

2. No separate executor code-review/manual-QA matrix artifact was found for this Wave A revise.
   - Evidence search found `.omo/evidence/wave-a-combat-gate-review.md` and the Wave A PNG frames, but no distinct code review report or manual QA matrix carrying the same `remove-ai-slops` and `programming` coverage.
   - This artifact records the direct reviewer pass, but it does not prove the executor-side coverage requested by the final-gate protocol.

## checkedArtifactPaths

- `docs/specs/2026-07-02-merge-mage-design.md`
- `docs/ART-DIRECTION.md`
- `.omo/evidence/wave-a-combat-gate-review.md`
- `.omo/evidence/wave-a-combat/orbiting-tomes-t0-390x844.png`
- `.omo/evidence/wave-a-combat/orbiting-tomes-t1500-390x844.png`
- `.omo/evidence/wave-a-combat/orbiting-tomes-t3000-390x844.png`
- `src/game/scenes/BattleScene.ts`
- `src/game/scenes/BattleEffects.ts`
- `src/game/scenes/OrbitingTomesView.ts`
- `src/game/scenes/BattleLayout.ts`
- `src/engine/battle.test.ts`
- `src/game/scenes/BattleLayout.test.ts`

## directSkillPass

- `omo:remove-ai-slops`: Direct pass checked stale comments, dead/debug leftovers, over-defensive code, excessive/tautological tests, requested-removal-only tests, implementation-mirroring tests, needless abstraction, and oversized modules in the rechecked scope. Prior code blockers 1-3 are resolved. New blocker: `BattleScene.ts` exceeds 250 pure LOC.
- `omo:programming`: Direct TypeScript pass checked for `as any`, `as unknown`, `@ts-ignore`, `@ts-expect-error`, empty/nonnarrowed catches, `.only`, `.skip`, non-integer visual scales called out by the prior review, and source size. Manual `rg` found none of those escape-hatch/test-focus violations in the inspected scope. New blocker: `BattleScene.ts` source size.

## verificationRunByReviewer

- `pnpm test`: PASS, Vitest reported 19 files and 126 tests passed.
- `pnpm build`: PASS, `tsc -b && vite build` completed. Vite reported only the existing large-chunk warning.
- Evidence dimensions: `sips` reported all three supplied time-sequence screenshots as 390x844.
- Bundled no-excuse checker: attempted with `pnpm exec tsx`, but the plugin-cache script could not resolve this repo's `typescript` package from its own path. A manual `rg` pass covered the relevant no-excuse patterns in the inspected files.

## exactEvidenceGaps

- No distinct Wave A executor code-review report/manual QA matrix was present beyond the prior gate review and the new screenshots.
- The screenshot sequence supports visible motion/effects over time, but it is still not a machine assertion of orbit position, depth swap, or homing path.
- No Phaser-level automated test directly covers `OrbitingTomesView.playCast` launch-origin timing or `BattleEffects.fireProjectile` homing updates.

