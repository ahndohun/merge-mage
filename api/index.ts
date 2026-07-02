import { handle } from "@hono/node-server/vercel"
import { Hono, type Context } from "hono"
import type { ZodError } from "zod"
import { claimOffline, getLeaderboard, getSavedGame, saveGame, upsertLeaderboard } from "./_lib/db.js"
import { CorruptSaveError, DatabaseConfigError, InvalidJsonError } from "./_lib/errors.js"
import { leaderboardBodySchema, saveBodySchema, tokenBodySchema, tokenSchema } from "./_lib/schemas.js"

export { engineStateSchema, leaderboardBodySchema, saveBodySchema, tokenBodySchema, tokenSchema } from "./_lib/schemas.js"

export const config = {
  api: {
    bodyParser: false,
  },
} as const

const app = new Hono().basePath("/api")

app.onError((error, context) => {
  if (error instanceof InvalidJsonError) {
    return context.json(errorEnvelope("invalid_request", { body: ["Invalid JSON body"] }), 400)
  }
  if (error instanceof DatabaseConfigError || error instanceof CorruptSaveError) {
    return context.json(errorEnvelope("internal_error"), 500)
  }
  return context.json(errorEnvelope("internal_error"), 500)
})

app.get("/health", (context) => {
  return context.json({ ok: true, ts: new Date().toISOString() })
})

app.post("/save", async (context) => {
  const parsed = saveBodySchema.safeParse(await readJson(context.req.json()))
  if (!parsed.success) {
    return validationError(context, parsed.error)
  }
  return context.json({ ok: true, savedAt: await saveGame(parsed.data.token, parsed.data.state) })
})

app.get("/save/:token", async (context) => {
  const parsed = tokenSchema.safeParse(context.req.param("token"))
  if (!parsed.success) {
    return validationError(context, parsed.error)
  }
  const save = await getSavedGame(parsed.data)
  if (save === null) {
    return context.json(errorEnvelope("not_found"), 404)
  }
  return context.json(save)
})

app.post("/offline-claim", async (context) => {
  const parsed = tokenBodySchema.safeParse(await readJson(context.req.json()))
  if (!parsed.success) {
    return validationError(context, parsed.error)
  }
  const claim = await claimOffline(parsed.data.token)
  if (claim === null) {
    return context.json(errorEnvelope("not_found"), 404)
  }
  return context.json(claim)
})

app.get("/leaderboard", async (context) => {
  const rows = await getLeaderboard()
  return context.json({
    items: rows.map((row) => ({
      nickname: row.nickname,
      bestStage: row.best_stage,
      prestigeCount: row.prestige_count,
    })),
  })
})

app.post("/leaderboard", async (context) => {
  const parsed = leaderboardBodySchema.safeParse(await readJson(context.req.json()))
  if (!parsed.success) {
    return validationError(context, parsed.error)
  }
  const bestStage = await upsertLeaderboard(parsed.data.token, parsed.data.nickname)
  if (bestStage === null) {
    return context.json(errorEnvelope("not_found"), 404)
  }
  return context.json({ ok: true, bestStage })
})

async function readJson(body: Promise<unknown>): Promise<unknown> {
  try {
    return await body
  } catch (error) {
    if (error instanceof Error) {
      throw new InvalidJsonError()
    }
    throw error
  }
}

function validationError(context: Context, error: ZodError) {
  return context.json(errorEnvelope("invalid_request", error.flatten()), 400)
}

function errorEnvelope(error: string, details?: unknown) {
  return details === undefined ? { error } : { error, details }
}

export default handle(app)
