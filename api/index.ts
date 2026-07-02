import { Hono } from "hono"
import { handle } from "@hono/node-server/vercel"

export const config = {
  api: {
    bodyParser: false,
  },
} as const

const app = new Hono().basePath("/api")

app.get("/health", (context) => {
  return context.json({ ok: true, ts: new Date().toISOString() })
})

app.post("/save", (context) => {
  return context.json({ error: "not_implemented" }, 501)
})

app.get("/save/:token", (context) => {
  return context.json({ error: "not_implemented" }, 501)
})

app.post("/offline-claim", (context) => {
  return context.json({ error: "not_implemented" }, 501)
})

app.get("/leaderboard", (context) => {
  return context.json({ error: "not_implemented" }, 501)
})

app.post("/leaderboard", (context) => {
  return context.json({ error: "not_implemented" }, 501)
})

export default handle(app)
