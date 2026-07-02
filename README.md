# Merge Mage 🧙📚

**Play now: https://merge-mage.vercel.app** (mobile-portrait web game — best on a phone-sized window)

A retro pixel idle RPG for **TestSprite Hackathon Season 3 — Build the Loop**. Merge spellbooks to raise your summon floor, equip your six strongest tomes, and let the wizard auto-battle dungeon waves — with cloud saves, server-verified offline earnings, and a live leaderboard.

Built agent-first: coding agents wrote the code, and the **TestSprite CLI was the only source of truth** for whether anything actually worked. The whole build ran as write → deploy → verify → fix → verify. **[LOOP.md](LOOP.md) is the honest log of that loop** — every bug in it was caught by the checker (or by playing the deployed build), not invented.

## The game

- **Summon-floor merge core**: summoned book level = your highest level − 8. Merge two same-level books → +1 level → the floor (and every future summon) rises with you.
- Six equip slots = six casting instances; fire splashes, frost slows, holy shreds bosses.
- Boss gates every 10 waves with an enrage timer; skills with free respec; **Arcane Rebirth** prestige for permanent mana-crystal damage.
- **Server-authoritative economy**: saves are schema-validated (no NaN gold, no teleporting to stage 999999), offline gold is computed from server time (8h cap — clock cheating does nothing), and the leaderboard only trusts stages it can read from your stored save.

## The loop (what the checker caught)

11 TestSprite tests (7 browser-agent FE plans + 4 Python BE scripts) ran against the **live URL** after every deploy. Highlights from [LOOP.md](LOOP.md):

| The checker caught | The fix |
|---|---|
| Every API POST hanging 30s+ in prod | Vercel's Node helpers consume the body stream before Hono reads it — hand-rolled the handler |
| Summon button said 24 gold, charged 24.4 | costs are now integral at the engine source |
| Equipping a book spent gold | nested upgrade-button hitbox separated from the slot |
| "Merge failed" — actually the level badge `2` reads as a *stack count* | badges now say `Lv2` (humans misread it too) |
| Leaderboard dead: two parallel agents disagreed on the API contract | `{token,nickname}` + server-derived stage, both sides aligned |
| Tests polluting each other's browser state | `/?fresh=1` reset affordance, every plan starts clean |

Plus two engine-level catches while integrating: React StrictMode destroying Phaser mid-asset-load, and a Phaser 4.2 loader stall after the first 32-file parallel batch (upstream issue candidate — worked around with a single batch).

CI keeps the loop honest: [.github/workflows/testsprite.yml](.github/workflows/testsprite.yml) re-verifies the live app with TestSprite on every push and fails the build when the checker disagrees.

## Stack

Phaser **4.2** (WebGL, `pixelArt`) for battle rendering · Vite **8.1** + React 19 DOM overlay for the game UI · pure-TypeScript deterministic economy engine (seeded RNG, 38 unit tests, built-in balance simulator: `npx tsx src/engine/simulate.ts --minutes 120`) · Hono on Vercel functions + Neon Postgres for saves/leaderboard/offline claims.

Agents were guided by the official Phaser AI skills bundle (github.com/phaserjs/phaser/skills) and the TestSprite agent skills installed in this repo (see `AGENTS.md`).

## API

- `GET /api/health` → `{ ok, ts }`
- `POST /api/save` `{ token, state }` — zod-validates the full engine state, upserts
- `GET /api/save/:token` → `{ state, savedAt }` or 404
- `POST /api/offline-claim` `{ token }` — server-time offline gold, 8h cap
- `GET /api/leaderboard` → top 100 · `POST /api/leaderboard` `{ token, nickname }` — best stage read from the stored save only

Migration: `npx tsx scripts/db-migrate.ts` (`DATABASE_URL` via Vercel/Neon integration or `.env.local`).

## Run it yourself

```bash
npm install
npm run dev        # game at localhost:8080 (api routes live on the Vercel deploy)
npm run build && npx vitest run
```

## Credits

All art/audio is credited in [CREDITS.md](CREDITS.md) — LuizMelo, 0x72, BigWander, Foozle, pimen, vrtxrry, JDWasabi, HydroGene. Thank you!
