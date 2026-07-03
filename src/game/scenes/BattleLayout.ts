import type { Element } from "../../engine/types"
import { createTranslator, type Translator } from "../../ui/i18n"

export const BOSS_WAVE_NUMBER = 10
export const BOSS_ENRAGE_MS = 30_000

export const BattleLayout = {
  width: 390,
  height: 844,
  viewportHeight: 844,
  wizardX: 64,
  wizardY: 226,
  castX: 78,
  castY: 208,
  mobStartX: 330,
  mobMinX: 178,
  bossX: 320,
  bossY: 224,
  mobScale: 2,
  bossScale: 3,
  bannerY: 70,
  hpBarHeight: 3,
  bossHpBarHeight: 5,
  hudCoinTargetX: 34,
  hudCoinTargetY: 28,
  mobSpeed: 12,
  slowAlpha: 0.78,
} as const

const LANES = [174, 210, 246, 282, 318] as const
const ELEMENT_CYCLE: readonly Element[] = ["fire", "frost", "holy"]
const MOB_COLUMN_WIDTH = 30
const MOB_COLUMN_RANDOM_MAX = 8
const MOB_Y_JITTER = 10

type Point = {
  readonly x: number
  readonly y: number
}

type StaffTipInput = {
  readonly x: number
  readonly y: number
  readonly displayWidth: number
  readonly displayHeight: number
  readonly originX: number
  readonly originY: number
}

type MobSpawnInput = {
  readonly index: number
  readonly stage: number
  readonly wave: number
  readonly isBoss: boolean
}

type WaveIndicator = {
  readonly text: string
  readonly tint: number
}

const defaultTranslator = createTranslator("en")

export function getLaneY(index: number): number {
  const lane = LANES[index % LANES.length]

  if (lane === undefined) {
    return LANES[0]
  }

  return lane
}

export function isBossWave(wave: number): boolean {
  return wave === BOSS_WAVE_NUMBER
}

export function getElementForIndex(index: number): Element {
  const element = ELEMENT_CYCLE[index % ELEMENT_CYCLE.length]
  return element ?? "fire"
}

export function getStaffTipPoint(input: StaffTipInput): Point {
  const centerX = input.x + input.displayWidth * (0.5 - input.originX)
  const centerY = input.y + input.displayHeight * (0.5 - input.originY)

  return {
    x: Math.round(centerX + input.displayWidth * 0.52),
    y: Math.round(centerY - input.displayHeight * 0.48),
  }
}

export function getMobSpawnPoint(input: MobSpawnInput): Point {
  if (input.isBoss) {
    return { x: BattleLayout.bossX, y: BattleLayout.bossY }
  }

  const columns = 2 + (hashInt(input.stage, input.wave, 91) % 2)
  const column = hashInt(input.stage, input.wave, input.index) % columns
  const xJitter = hashInt(input.wave, input.index, input.stage) % (MOB_COLUMN_RANDOM_MAX + 1)
  const yJitter = (hashInt(input.index, input.stage, input.wave) % (MOB_Y_JITTER * 2 + 1)) - MOB_Y_JITTER

  return {
    x: BattleLayout.mobStartX - column * MOB_COLUMN_WIDTH - xJitter,
    y: getLaneY(input.index) + yJitter,
  }
}

export function getWaveIndicator(wave: number, t: Translator = defaultTranslator): WaveIndicator {
  if (isBossWave(wave)) {
    return { text: t("battleBoss"), tint: 0xc4344a }
  }

  return { text: t.battleWaveIndicator(wave, BOSS_WAVE_NUMBER), tint: 0xfff0a8 }
}

function hashInt(left: number, middle: number, right: number): number {
  let value = Math.imul(left + 31, 73856093) ^ Math.imul(middle + 17, 19349663) ^ Math.imul(right + 13, 83492791)
  value ^= value >>> 16
  return Math.abs(value)
}
