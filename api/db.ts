import { OFFLINE_CAP_MS } from "../src/engine/constants"
import { computeOfflineGold } from "../src/engine/offline"
import type { EngineState } from "../src/engine/types"
import { CorruptSaveError, DatabaseConfigError } from "./errors"
import { jsonState, MAX_GOLD, parseSavedState } from "./schemas"

type SaveRow = {
  readonly state: unknown
  readonly saved_at: unknown
}

type LeaderboardRow = {
  readonly nickname: string
  readonly best_stage: number
  readonly prestige_count: number
}

type SaveSummary = {
  readonly stage: number
  readonly prestigeCount: number
}

type OfflineClaim = {
  readonly gold: number
  readonly cappedHours: number
  readonly claimedAt: string
}

let sqlPromise: Promise<NeonQuery> | null = null

export async function saveGame(token: string, state: EngineState): Promise<string> {
  const sql = await getSql()
  const [row] = await sql<SaveRow>`
    insert into saves (token, state, updated_at)
    values (${token}, ${jsonState(state)}::jsonb, now())
    on conflict (token) do update set state = excluded.state, updated_at = now()
    returning updated_at as saved_at
  `
  return timestamp(row?.saved_at)
}

export async function getSavedGame(token: string): Promise<{ readonly state: EngineState; readonly savedAt: string } | null> {
  const sql = await getSql()
  const [row] = await sql<SaveRow>`select state, updated_at as saved_at from saves where token = ${token}`
  if (row === undefined) {
    return null
  }
  return { state: parseSavedState(row.state), savedAt: timestamp(row.saved_at) }
}

export async function claimOffline(token: string): Promise<OfflineClaim | null> {
  const sql = await getSql()
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const [row] = await sql<SaveRow & { readonly now_ms: string }>`
      select state, updated_at as saved_at, floor(extract(epoch from now()) * 1000)::text as now_ms
      from saves
      where token = ${token}
    `
    if (row === undefined) {
      return null
    }
    const state = parseSavedState(row.state)
    const nowServerTs = Number(row.now_ms)
    const grossGold = computeOfflineGold(state, nowServerTs)
    const gold = Math.max(0, Math.min(grossGold, MAX_GOLD - state.gold))
    const updatedState: EngineState = { ...state, gold: state.gold + gold, lastSeenServerTs: nowServerTs }
    const [updated] = await sql<SaveRow>`
      update saves
      set state = ${jsonState(updatedState)}::jsonb, updated_at = now()
      where token = ${token} and state = ${jsonState(state)}::jsonb
      returning updated_at as saved_at
    `
    if (updated !== undefined) {
      return { gold, cappedHours: getCappedHours(state, nowServerTs), claimedAt: timestamp(updated.saved_at) }
    }
  }
  return null
}

export async function getLeaderboard(): Promise<readonly LeaderboardRow[]> {
  const sql = await getSql()
  return sql<LeaderboardRow>`
    select nickname, best_stage, prestige_count
    from leaderboard
    order by best_stage desc, updated_at asc
    limit 100
  `
}

export async function upsertLeaderboard(token: string, nickname: string): Promise<number | null> {
  const save = await loadSaveSummary(token)
  if (save === null) {
    return null
  }
  const sql = await getSql()
  const [row] = await sql<{ readonly best_stage: number }>`
    insert into leaderboard (token, nickname, best_stage, prestige_count, updated_at)
    values (${token}, ${nickname}, ${save.stage}, ${save.prestigeCount}, now())
    on conflict (token) do update set
      nickname = case when excluded.best_stage >= leaderboard.best_stage then excluded.nickname else leaderboard.nickname end,
      best_stage = greatest(leaderboard.best_stage, excluded.best_stage),
      prestige_count = case
        when excluded.best_stage > leaderboard.best_stage then excluded.prestige_count
        when excluded.best_stage = leaderboard.best_stage then greatest(leaderboard.prestige_count, excluded.prestige_count)
        else leaderboard.prestige_count
      end,
      updated_at = case when excluded.best_stage >= leaderboard.best_stage then now() else leaderboard.updated_at end
    returning best_stage
  `
  return row?.best_stage ?? save.stage
}

async function loadSaveSummary(token: string): Promise<SaveSummary | null> {
  const save = await getSavedGame(token)
  if (save === null) {
    return null
  }
  return { stage: save.state.stage, prestigeCount: save.state.prestigeCount }
}

async function getSql(): Promise<NeonQuery> {
  const databaseUrl = process.env["DATABASE_URL"]
  if (databaseUrl === undefined || databaseUrl.length === 0) {
    throw new DatabaseConfigError()
  }
  if (sqlPromise === null) {
    sqlPromise = import("@neondatabase/serverless").then((module) => module.neon(databaseUrl))
  }
  return sqlPromise
}

function getCappedHours(state: EngineState, nowServerTs: number): number {
  if (state.lastSeenServerTs === null) {
    return 0
  }
  return Math.min(Math.max(0, nowServerTs - state.lastSeenServerTs), OFFLINE_CAP_MS) / 3_600_000
}

function timestamp(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.valueOf())) {
    throw new CorruptSaveError()
  }
  return date.toISOString()
}
