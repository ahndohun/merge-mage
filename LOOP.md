# Merge Mage Loop Log

| # | date | maker | what ran | what broke | what got fixed |
| 1 | 2026-07-02 | codex(gpt-5.5) scaffolded Phaser 4.2+Vite 8.1+Hono skeleton | deployed to Vercel, smoke-tested / (game) and /api/health | /api/health hung then 504: Vercel ignored the edge runtime config, edge-style Hono adapter never answered on the Node runtime | switched to @hono/node-server v1 /vercel adapter (v2 dropped the subpath), health now returns {"ok":true} — checker: vercel logs + live smoke (TestSprite suite seeding starts with first real gameplay) |
