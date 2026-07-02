import { chromium } from "/tmp/merge-mage-release-gate-playwright/node_modules/playwright/index.mjs"
import fs from "node:fs/promises"
import path from "node:path"

const BASE_URL = "https://merge-mage.vercel.app"
const EVIDENCE_DIR = new URL(".", import.meta.url).pathname

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

const browser = await launchBrowser()
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const page = await context.newPage()

let clickError = null
try {
  await page.goto(`${BASE_URL}/?fresh=1`, { waitUntil: "domcontentloaded" })
  await page.waitForSelector("#app-root", { timeout: 20000 })
  await page.waitForFunction(() => {
    const root = document.querySelector("#app-root")
    return root instanceof HTMLElement && root.dataset.activeScene !== "booting"
  }, { timeout: 20000 })
  await page.getByTestId("settings-btn").click()
  await page.waitForSelector('[data-testid="settings-sound"]', { timeout: 5000 })
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "settings-pointer-intercept-open.png"), fullPage: true })
  try {
    await page.getByTestId("settings-sound").click({ timeout: 3000 })
  } catch (error) {
    clickError = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { message: String(error) }
  }
  const hitTest = await page.evaluate(() => {
    const button = document.querySelector('[data-testid="settings-sound"]')
    if (!(button instanceof HTMLElement)) {
      return { found: false }
    }
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const top = document.elementFromPoint(x, y)
    return {
      found: true,
      buttonText: button.textContent?.trim() ?? "",
      buttonRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      center: { x, y },
      topElement: top
        ? {
            tag: top.tagName.toLowerCase(),
            className: top.getAttribute("class"),
            testid: top.getAttribute("data-testid"),
            text: top.textContent?.trim() ?? "",
          }
        : null,
    }
  })
  const result = {
    pass: clickError === null && hitTest.topElement?.testid === "settings-sound",
    clickError,
    hitTest,
  }
  await fs.writeFile(path.join(EVIDENCE_DIR, "settings-pointer-intercept.json"), `${JSON.stringify(result, null, 2)}\n`)
  console.log(JSON.stringify(result, null, 2))
} finally {
  await context.close()
  await browser.close()
}
