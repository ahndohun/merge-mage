import { chromium } from "/tmp/merge-mage-release-gate-playwright/node_modules/playwright/index.mjs"
import fs from "node:fs/promises"
import path from "node:path"

const BASE_URL = "https://merge-mage.vercel.app"
const EVIDENCE_DIR = new URL(".", import.meta.url).pathname
const STATE_KEY = "merge-mage:engine-state"
const TOKEN_KEY = "merge-mage:save-token"
const AUDIO_KEY = "merge-mage:audio-muted"

const consoleMessages = []
const requestFailures = []

function token(suffix) {
  return `gate${Date.now()}${suffix}`.padEnd(32, "x").slice(0, 32)
}

function baseState(overrides = {}) {
  return {
    gold: 1000,
    books: [],
    equipped: [null, null, null, null, null, null],
    highestLevelEver: 1,
    stage: 1,
    wave: 1,
    stageHp: 10,
    wizardLevel: 1,
    wizardXp: 0,
    skillPoints: 0,
    skills: { summonBonus: 0, castSpeed: 0, goldGain: 0, critChance: 0 },
    manaCrystals: 0,
    prestigeCount: 0,
    lastSeenServerTs: null,
    slotTiers: [0, 0, 0, 0, 0, 0],
    castProgressMs: [0, 0, 0, 0, 0, 0],
    enemiesHp: [10, 10, 10, 10, 10],
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

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome", headless: true })
  } catch {
    return chromium.launch({
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    })
  }
}

async function newContext(browser, seeded) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  if (seeded !== undefined) {
    await context.addInitScript(({ state, saveToken, audioMuted }) => {
      window.localStorage.setItem("merge-mage:engine-state", JSON.stringify(state))
      window.localStorage.setItem("merge-mage:save-token", saveToken)
      if (audioMuted !== undefined) {
        window.localStorage.setItem("merge-mage:audio-muted", audioMuted)
      }
    }, seeded)
  }
  return context
}

async function newPage(context, label) {
  const page = await context.newPage()
  page.on("console", (message) => {
    consoleMessages.push({ label, type: message.type(), text: message.text() })
  })
  page.on("requestfailed", (request) => {
    requestFailures.push({
      label,
      url: request.url(),
      failure: request.failure()?.errorText ?? "unknown",
    })
  })
  return page
}

async function waitReady(page) {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" })
  await page.waitForSelector("#app-root", { timeout: 20000 })
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && root.dataset.activeScene !== "booting"
  }, { timeout: 20000 })
}

async function waitReadyFresh(page) {
  await page.goto(`${BASE_URL}/?fresh=1`, { waitUntil: "domcontentloaded" })
  await page.waitForSelector("#app-root", { timeout: 20000 })
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && root.dataset.activeScene !== "booting"
  }, { timeout: 20000 })
}

async function readUi(page, label) {
  return page.evaluate(({ label, stateKey, tokenKey, audioKey }) => {
    const root = document.querySelector("#app-root")
    const parseState = () => {
      const raw = window.localStorage.getItem(stateKey)
      if (raw === null) return null
      try {
        return JSON.parse(raw)
      } catch {
        return { parseError: raw }
      }
    }
    const text = (selector) => document.querySelector(selector)?.textContent?.trim() ?? null
    const controls = Array.from(document.querySelectorAll("button, a, input, [data-testid]")).map((el) => {
      const html = el
      return {
        tag: html.tagName.toLowerCase(),
        testid: html.getAttribute("data-testid"),
        text: html.textContent?.replace(/\s+/g, " ").trim() ?? "",
        ariaLabel: html.getAttribute("aria-label"),
        disabled: html instanceof HTMLButtonElement || html instanceof HTMLInputElement ? html.disabled : false,
        ariaDisabled: html.getAttribute("aria-disabled"),
        ariaPressed: html.getAttribute("aria-pressed"),
        href: html instanceof HTMLAnchorElement ? html.href : null,
      }
    })
    const slots = Array.from(document.querySelectorAll('[data-testid^="equip-slot-"], [data-testid^="merge-cell-"]')).map((el) => ({
      testid: el.getAttribute("data-testid"),
      text: el.textContent?.replace(/\s+/g, " ").trim() ?? "",
      className: el.getAttribute("class"),
    }))
    return {
      label,
      url: window.location.href,
      rootData: root instanceof HTMLElement ? { ...root.dataset } : null,
      bodyText: document.body.innerText,
      hint: text('[data-testid="hint-strip"]'),
      saveChip: text('[data-testid="save-indicator"]'),
      summonButton: text('[data-testid="summon-btn"]'),
      localState: parseState(),
      saveToken: window.localStorage.getItem(tokenKey),
      audioMuted: window.localStorage.getItem(audioKey),
      controls,
      slots,
    }
  }, { label, stateKey: STATE_KEY, tokenKey: TOKEN_KEY, audioKey: AUDIO_KEY })
}

function parseSummonCost(label) {
  const match = /SUMMON L(\d+)\s+([0-9]+)/.exec(label ?? "")
  if (match === null) {
    throw new Error(`Unable to parse summon cost from ${label}`)
  }
  return { level: Number(match[1]), cost: Number(match[2]) }
}

async function writeJson(name, value) {
  await fs.writeFile(path.join(EVIDENCE_DIR, name), `${JSON.stringify(value, null, 2)}\n`)
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(EVIDENCE_DIR, name), fullPage: true })
}

async function coldStart(browser) {
  const context = await newContext(browser)
  const page = await newPage(context, "cold-start")
  await waitReadyFresh(page)
  const atReady = await readUi(page, "ready-no-input")
  await screenshot(page, "cold-start-ready.png")
  await page.waitForTimeout(5000)
  const afterFive = await readUi(page, "after-5s-no-input")
  await screenshot(page, "cold-start-after-5s.png")
  await context.close()
  const readyGold = Number(atReady.rootData.gold)
  const afterGold = Number(afterFive.rootData.gold)
  const readyStage = Number(atReady.rootData.stage)
  const afterStage = Number(afterFive.rootData.stage)
  const readyWave = Number(atReady.rootData.wave)
  const afterWave = Number(afterFive.rootData.wave)
  const pass = afterGold > readyGold && (afterStage > readyStage || afterWave > readyWave || afterGold > readyGold) && /SUMMON/i.test(afterFive.hint ?? "")
  const result = { pass, atReady, afterFive, observations: { readyGold, afterGold, readyStage, afterStage, readyWave, afterWave } }
  await writeJson("cold-start.json", result)
  return result
}

async function summonAutoEquip(browser) {
  const saveToken = token("summon")
  const context = await newContext(browser, { state: baseState({ gold: 1000 }), saveToken })
  const page = await newPage(context, "summon-auto-equip")
  await waitReady(page)
  const before = await readUi(page, "before-summon")
  const displayed = parseSummonCost(before.summonButton)
  await page.getByTestId("summon-btn").click()
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && Number(root.dataset.gold) < 1000
  }, { timeout: 5000 })
  const after = await readUi(page, "after-summon")
  await screenshot(page, "core-loop-summon-auto-equip.png")
  await context.close()
  const beforeGold = Number(before.rootData.gold)
  const afterGold = Number(after.rootData.gold)
  const firstSlot = after.slots.find((slot) => slot.testid === "equip-slot-0")
  const pass = beforeGold - afterGold === displayed.cost && /Lv1/.test(firstSlot?.text ?? "") && Number(after.rootData.inventoryCount) === 0
  const result = { pass, displayed, beforeGold, afterGold, firstSlot, before, after }
  await writeJson("core-loop-summon-auto-equip.json", result)
  return result
}

async function mergeThreshold(browser) {
  const saveToken = token("merge")
  const context = await newContext(browser, {
    saveToken,
    state: baseState({
      gold: 1000,
      books: [
        { id: "b9a", level: 9, element: "fire" },
        { id: "b9b", level: 9, element: "frost" },
      ],
      highestLevelEver: 9,
      nextBookId: 3,
    }),
  })
  const page = await newPage(context, "merge-threshold")
  await waitReady(page)
  const before = await readUi(page, "before-merge-threshold")
  await screenshot(page, "core-loop-before-threshold-merge.png")
  await page.getByTestId("merge-cell-0").click()
  await page.getByTestId("merge-cell-1").click()
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && root.dataset.summonLevel === "2"
  }, { timeout: 5000 })
  const after = await readUi(page, "after-merge-threshold")
  await screenshot(page, "core-loop-after-threshold-merge.png")
  await context.close()
  const mergedSlot = after.slots.find((slot) => /Lv10/.test(slot.text))
  const pass = before.rootData.summonLevel === "1" && after.rootData.summonLevel === "2" && mergedSlot !== undefined
  const result = { pass, beforeSummonLevel: before.rootData.summonLevel, afterSummonLevel: after.rootData.summonLevel, mergedSlot, before, after }
  await writeJson("core-loop-merge-threshold.json", result)
  return result
}

async function persistence(browser) {
  const saveToken = token("persist")
  const context = await newContext(browser, { saveToken, state: baseState({ gold: 1000 }) })
  const page = await newPage(context, "persistence")
  await waitReady(page)
  await page.getByTestId("summon-btn").click()
  await page.waitForTimeout(5500)
  await page.waitForFunction(() => document.querySelector('[data-testid="save-indicator"]')?.textContent?.includes("SAVED"), {
    timeout: 12000,
  })
  const saved = await readUi(page, "saved-before-reload")
  await screenshot(page, "persistence-saved-before-reload.png")
  await page.reload({ waitUntil: "domcontentloaded" })
  await page.waitForSelector("#app-root", { timeout: 20000 })
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && root.dataset.activeScene !== "booting"
  }, { timeout: 20000 })
  const reloaded = await readUi(page, "reloaded-without-fresh")
  await screenshot(page, "persistence-reloaded.png")
  const api = await page.evaluate(async (saveToken) => {
    const response = await fetch(`/api/save/${saveToken}`)
    const body = await response.text()
    return { status: response.status, headers: Object.fromEntries(response.headers.entries()), body }
  }, saveToken)
  await fs.writeFile(
    path.join(new URL("../api/", import.meta.url).pathname, "save-get-from-browser.txt"),
    `GET /api/save/${saveToken}\nstatus: ${api.status}\nheaders: ${JSON.stringify(api.headers, null, 2)}\nbody:\n${api.body}\n`,
  )
  await context.close()
  const serverState = api.status === 200 ? JSON.parse(api.body).state : null
  const pass =
    saved.saveChip === "SAVED" &&
    reloaded.saveToken === saveToken &&
    reloaded.localState !== null &&
    api.status === 200 &&
    serverState !== null &&
    JSON.stringify(serverState.equipped) === JSON.stringify(saved.localState.equipped) &&
    serverState.highestLevelEver === saved.localState.highestLevelEver
  const result = { pass, saveToken, saved, reloaded, api, serverStateSummary: serverState === null ? null : { gold: serverState.gold, equipped: serverState.equipped, highestLevelEver: serverState.highestLevelEver } }
  await writeJson("persistence.json", result)
  return result
}

async function settings(browser) {
  const saveToken = token("settings")
  const context = await newContext(browser, { saveToken, state: baseState({ gold: 1000 }) })
  const page = await newPage(context, "settings")
  await waitReady(page)
  const before = await readUi(page, "settings-before")
  await page.getByTestId("settings-btn").click()
  const soundBefore = await readUi(page, "settings-open-before-sound")
  await page.getByTestId("settings-sound").click()
  const soundAfterToggle = await readUi(page, "settings-after-sound-toggle")
  await screenshot(page, "settings-sound-toggled.png")
  await page.reload({ waitUntil: "domcontentloaded" })
  await page.waitForSelector("#app-root", { timeout: 20000 })
  await page.getByTestId("settings-btn").click()
  const soundAfterReload = await readUi(page, "settings-after-reload")
  await page.getByTestId("settings-new-game").click()
  const newGameArmed = await readUi(page, "settings-new-game-armed")
  await screenshot(page, "settings-new-game-armed.png")
  await page.getByTestId("settings-new-game").click()
  await page.waitForLoadState("domcontentloaded")
  await page.waitForSelector("#app-root", { timeout: 20000 })
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && root.dataset.activeScene !== "booting"
  }, { timeout: 20000 })
  const afterWipe = await readUi(page, "settings-after-new-game-confirm")
  await screenshot(page, "settings-after-new-game-confirm.png")

  const tabChecks = []
  for (const tabId of ["tab-books", "tab-skills", "tab-rebirth", "tab-ranks"]) {
    await page.getByTestId(tabId).click()
    await page.waitForTimeout(300)
    const snapshot = await readUi(page, `after-click-${tabId}`)
    tabChecks.push({ tabId, activeButtons: snapshot.controls.filter((control) => control.tag === "button" && !control.disabled), snapshot })
  }
  await page.getByTestId("tab-ranks").click()
  await page.getByTestId("nickname-save").click()
  await page.getByTestId("leaderboard-refresh").click()
  await page.waitForTimeout(1500)
  const ranksAfterButtons = await readUi(page, "ranks-after-buttons")
  await screenshot(page, "settings-tabs-ranks-after-buttons.png")

  await context.close()
  const soundPersisted = soundAfterToggle.audioMuted === "true" && soundAfterReload.audioMuted === "true" && /SOUND OFF/.test(soundAfterReload.bodyText)
  const armedWithoutWipe = /TAP AGAIN TO WIPE/.test(newGameArmed.bodyText) && newGameArmed.saveToken === saveToken
  const wiped = afterWipe.saveToken !== saveToken && Number(afterWipe.rootData.gold) <= 110
  const tabsOpened = tabChecks.every((check) => check.snapshot.bodyText.includes(check.tabId.replace("tab-", "").toUpperCase()))
  const ranksLive = !/error/i.test(ranksAfterButtons.bodyText)
  const pass = soundPersisted && armedWithoutWipe && wiped && tabsOpened && ranksLive
  const result = {
    pass,
    soundPersisted,
    armedWithoutWipe,
    wiped,
    tabsOpened,
    ranksLive,
    before,
    soundBefore,
    soundAfterToggle,
    soundAfterReload,
    newGameArmed,
    afterWipe,
    tabChecks,
    ranksAfterButtons,
  }
  await writeJson("settings.json", result)
  return result
}

async function main() {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true })
  const browser = await launchBrowser()
  const results = {}
  try {
    results.coldStart = await coldStart(browser)
    results.summonAutoEquip = await summonAutoEquip(browser)
    results.mergeThreshold = await mergeThreshold(browser)
    results.persistence = await persistence(browser)
    results.settings = await settings(browser)
  } finally {
    await browser.close()
  }
  results.consoleMessages = consoleMessages
  results.requestFailures = requestFailures
  results.pass = results.coldStart.pass && results.summonAutoEquip.pass && results.mergeThreshold.pass && results.persistence.pass && results.settings.pass
  await writeJson("browser-gate-summary.json", results)
  console.log(JSON.stringify(results, null, 2))
}

await main()
