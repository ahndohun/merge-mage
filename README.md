# Merge Mage

Merge Mage is a vertical idle merge battler scaffold for TestSprite Hackathon S3.

Live URL: TBD

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run build
npx vitest run
```

## API

The Hono API is mounted at `/api` through `vercel.json`.

Run the Neon migration with:

```bash
npx tsx scripts/db-migrate.ts
```

Required environment: `DATABASE_URL` in Vercel, or `.env.local` for local migration runs.

- `GET /api/health` returns `{ ok, ts }`.
- `POST /api/save` accepts `{ token, state }`, validates the engine state, and upserts a save.
- `GET /api/save/:token` returns `{ state, savedAt }` or `404`.
- `POST /api/offline-claim` accepts `{ token }`, uses server time to claim capped offline gold, and updates the save.
- `GET /api/leaderboard` returns the top 100 entries by stage.
- `POST /api/leaderboard` accepts `{ token, nickname }` and records the best stage from the server-side save only.

The current scaffold wires Vite, React 19, Phaser 4.2, a pure TypeScript economy engine, and Hono API stubs. Gameplay systems and final art are intentionally not implemented yet.
