FINAL RELEASE GATE for deployed Merge Mage at https://merge-mage.vercel.app.

Render APPROVE or REJECT with artifact evidence under .omo/evidence/merge-mage-release-gate/.

Success criteria:
1. Cold start: brand-new player at /?fresh=1 sees combat begin within 5s without input, innate bolt kills mobs, gold rises, and hint strip guides first summon.
2. Core loop: summon deducts exactly displayed cost, auto-equips to a slot, tap-tap merge two same-level books, Lv(n+1) results, summon floor rises at documented threshold.
3. Persistence: reload without ?fresh retains progress; SAVED chip appears on cloud save; /api/save/<token> returns same state.
4. Server authority: invalid save gold=-5, stage=999999, NaN returns 400; leaderboard ignores supplied stage and uses stored bestStage; offline claim caps at 8h and ignores client clock.
5. Settings: sound toggle persists across reload; NEW GAME two-step confirm wipes and restarts; no dead buttons in four tabs.
6. Judge surface: README claims match reality; live URL works; LOOP.md entries correspond to real commits in git log; CI workflow exists and latest gh run is green.
