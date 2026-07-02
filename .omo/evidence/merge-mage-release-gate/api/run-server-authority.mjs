import fs from "node:fs/promises"
import path from "node:path"

const BASE_URL = "https://merge-mage.vercel.app"
const EVIDENCE_DIR = new URL(".", import.meta.url).pathname

function token(suffix) {
  return `api${Date.now()}${suffix}`.padEnd(32, "x").slice(0, 32)
}

function baseState(overrides = {}) {
  return {
    gold: 500,
    books: [{ id: "b1", level: 3, element: "fire" }],
    equipped: [null, null, null, null, null, null],
    highestLevelEver: 3,
    stage: 4,
    wave: 1,
    stageHp: 96,
    wizardLevel: 1,
    wizardXp: 0,
    skillPoints: 0,
    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
    manaCrystals: 0,
    prestigeCount: 0,
    lastSeenServerTs: null,
    slotTiers: [0, 0, 0, 0, 0, 0],
    castProgressMs: [0, 0, 0, 0, 0, 0],
    enemiesHp: [19.2, 19.2, 19.2, 19.2, 19.2],
    bossElapsedMs: 0,
    frostSlowMs: 0,
    recentGoldPerSecond: 0,
    elapsedMs: 0,
    rngSeed: 42,
    rngState: 42,
    nextBookId: 1,
    ...overrides,
  }
}

async function requestTranscript(name, request) {
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
  const text = await response.text()
  const transcript = [
    `${request.method} ${request.url}`,
    `request-headers: ${JSON.stringify(request.headers ?? {}, null, 2)}`,
    "request-body:",
    request.body ?? "",
    "",
    `status: ${response.status}`,
    `response-headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`,
    "response-body:",
    text,
    "",
  ].join("\n")
  await fs.writeFile(path.join(EVIDENCE_DIR, name), transcript)
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }
  return { name, status: response.status, bodyText: text, bodyJson: json }
}

function postJson(url, body) {
  return {
    method: "POST",
    url,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }
}

async function main() {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true })

  const invalidToken = token("invalid")
  const validState = baseState()
  const negativeGold = await requestTranscript(
    "server-authority-save-negative-gold.txt",
    postJson(`${BASE_URL}/api/save`, { token: invalidToken, state: { ...validState, gold: -5 } }),
  )
  const absurdStage = await requestTranscript(
    "server-authority-save-absurd-stage.txt",
    postJson(`${BASE_URL}/api/save`, { token: invalidToken, state: { ...validState, stage: 999999 } }),
  )
  const stringNaN = await requestTranscript(
    "server-authority-save-string-nan.txt",
    postJson(`${BASE_URL}/api/save`, { token: invalidToken, state: { ...validState, gold: "NaN" } }),
  )
  const rawNaNBody = JSON.stringify({ token: invalidToken, state: validState }).replace('"gold":500', '"gold":NaN')
  const rawNaN = await requestTranscript("server-authority-save-raw-nan.txt", {
    method: "POST",
    url: `${BASE_URL}/api/save`,
    headers: { "content-type": "application/json" },
    body: rawNaNBody,
  })

  const leaderboardToken = token("leaderboard")
  const leaderboardNick = `Gate${Date.now().toString().slice(-6)}`
  const saveForLeaderboard = await requestTranscript(
    "server-authority-leaderboard-save.txt",
    postJson(`${BASE_URL}/api/save`, { token: leaderboardToken, state: validState }),
  )
  const leaderboardPost = await requestTranscript(
    "server-authority-leaderboard-post-stage-ignored.txt",
    postJson(`${BASE_URL}/api/leaderboard`, { token: leaderboardToken, nickname: leaderboardNick, stage: 999999 }),
  )
  const leaderboardList = await requestTranscript("server-authority-leaderboard-get.txt", {
    method: "GET",
    url: `${BASE_URL}/api/leaderboard`,
    headers: {},
  })

  const offlineToken = token("offline")
  const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000
  const offlineState = baseState({
    gold: 500,
    lastSeenServerTs: twelveHoursAgo,
    recentGoldPerSecond: 10,
  })
  const offlineSave = await requestTranscript(
    "server-authority-offline-save.txt",
    postJson(`${BASE_URL}/api/save`, { token: offlineToken, state: offlineState }),
  )
  const offlineClaim = await requestTranscript(
    "server-authority-offline-claim-client-clock-ignored.txt",
    postJson(`${BASE_URL}/api/offline-claim`, {
      token: offlineToken,
      clientNow: Date.now() + 365 * 24 * 60 * 60 * 1000,
      clientElapsedMs: 365 * 24 * 60 * 60 * 1000,
    }),
  )

  const leaderboardItems = leaderboardList.bodyJson?.items ?? []
  const leaderboardRow = Array.isArray(leaderboardItems)
    ? leaderboardItems.find((item) => item.nickname === leaderboardNick)
    : undefined
  const summary = {
    pass:
      negativeGold.status === 400 &&
      absurdStage.status === 400 &&
      stringNaN.status === 400 &&
      rawNaN.status === 400 &&
      saveForLeaderboard.status === 200 &&
      leaderboardPost.status === 200 &&
      leaderboardPost.bodyJson?.bestStage === 4 &&
      leaderboardRow?.bestStage === 4 &&
      offlineSave.status === 200 &&
      offlineClaim.status === 200 &&
      offlineClaim.bodyJson?.cappedHours === 8 &&
      offlineClaim.bodyJson?.gold === 172800,
    invalidSaveStatuses: {
      negativeGold: negativeGold.status,
      absurdStage: absurdStage.status,
      stringNaN: stringNaN.status,
      rawNaN: rawNaN.status,
    },
    leaderboard: {
      nickname: leaderboardNick,
      postStatus: leaderboardPost.status,
      postBody: leaderboardPost.bodyJson,
      listedRow: leaderboardRow ?? null,
    },
    offline: {
      claimStatus: offlineClaim.status,
      claimBody: offlineClaim.bodyJson,
      expectedGoldAtEightHourCap: 172800,
    },
    transcriptFiles: [
      negativeGold.name,
      absurdStage.name,
      stringNaN.name,
      rawNaN.name,
      saveForLeaderboard.name,
      leaderboardPost.name,
      leaderboardList.name,
      offlineSave.name,
      offlineClaim.name,
    ],
  }
  await fs.writeFile(path.join(EVIDENCE_DIR, "server-authority-summary.json"), `${JSON.stringify(summary, null, 2)}\n`)
  console.log(JSON.stringify(summary, null, 2))
}

await main()
