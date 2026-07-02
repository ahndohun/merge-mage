import type { EngineState } from "../engine/types"

export type ApiResult<T> =
  | { readonly kind: "ok"; readonly data: T }
  | { readonly kind: "unavailable" }
  | { readonly kind: "error"; readonly message: string }

export type LeaderboardEntry = {
  readonly rank: number
  readonly nickname: string
  readonly stage: number
}

export type OfflineClaim = {
  readonly gold: number
  readonly seconds: number
}

const REQUEST_TIMEOUT_MS = 4_000

export async function fetchLeaderboard(): Promise<ApiResult<readonly LeaderboardEntry[]>> {
  const result = await requestJson("/api/leaderboard", { method: "GET" })

  if (result.kind !== "ok") {
    return result
  }

  return { kind: "ok", data: parseLeaderboard(result.data).slice(0, 100) }
}

export async function postLeaderboard(input: {
  readonly nickname: string
  readonly stage: number
}): Promise<ApiResult<readonly LeaderboardEntry[]>> {
  const result = await requestJson("/api/leaderboard", {
    method: "POST",
    body: JSON.stringify(input),
  })

  if (result.kind !== "ok") {
    return result
  }

  return { kind: "ok", data: parseLeaderboard(result.data).slice(0, 100) }
}

export async function postSave(input: {
  readonly token: string
  readonly nickname: string
  readonly state: EngineState
}): Promise<ApiResult<null>> {
  const result = await requestJson("/api/save", {
    method: "POST",
    body: JSON.stringify(input),
  })

  if (result.kind === "ok") {
    return { kind: "ok", data: null }
  }

  return result
}

export async function postOfflineClaim(token: string): Promise<ApiResult<OfflineClaim | null>> {
  const result = await requestJson("/api/offline-claim", {
    method: "POST",
    body: JSON.stringify({ token }),
  })

  if (result.kind !== "ok") {
    return result
  }

  return { kind: "ok", data: parseOfflineClaim(result.data) }
}

async function requestJson(path: string, init: RequestInit): Promise<ApiResult<unknown>> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(path, {
      ...init,
      headers: {
        "content-type": "application/json",
      },
      signal: controller.signal,
    })

    if (response.status === 501) {
      return { kind: "unavailable" }
    }
    if (!response.ok) {
      return { kind: "error", message: `HTTP ${response.status}` }
    }

    const data: unknown = await response.json()
    return { kind: "ok", data }
  } catch (error) {
    if (error instanceof Error) {
      return { kind: "error", message: error.name === "AbortError" ? "request timed out" : error.message }
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function parseLeaderboard(data: unknown): readonly LeaderboardEntry[] {
  const source = isRecord(data) && Array.isArray(data["entries"]) ? data["entries"] : data

  if (!Array.isArray(source)) {
    return []
  }

  return source.flatMap((item, index) => {
    if (!isRecord(item) || typeof item["nickname"] !== "string" || typeof item["stage"] !== "number") {
      return []
    }

    const rank = typeof item["rank"] === "number" ? item["rank"] : index + 1
    return [{ rank, nickname: item["nickname"], stage: item["stage"] }]
  })
}

function parseOfflineClaim(data: unknown): OfflineClaim | null {
  const source = isRecord(data) && isRecord(data["claim"]) ? data["claim"] : data

  if (!isRecord(source) || typeof source["gold"] !== "number") {
    return null
  }

  const seconds = typeof source["seconds"] === "number" ? source["seconds"] : 0
  return source["gold"] > 0 ? { gold: source["gold"], seconds } : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
