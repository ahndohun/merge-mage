import { equipBook, getSlotUpgradeCost, mergeBooks, summonBook, upgradeSlot } from "./actions.js"
import { INVENTORY_LIMIT, SLOT_INDEXES, TICK_MS } from "./constants.js"
import { simulateTicks } from "./battle.js"
import { getSummonCost, getSummonLevel } from "./summon.js"
import { createInitialState } from "./state.js"
import type { EngineState, Spellbook } from "./types.js"

type CliProcess = {
  readonly argv: readonly string[]
  readonly stdout: { readonly write: (text: string) => void }
}

declare const process: CliProcess | undefined

export type SimulationOptions = {
  readonly minutes: number
  readonly seed?: number
}

export type SimulationRow = {
  readonly minute: number
  readonly stage: number
  readonly highestBookLevel: number
  readonly gold: number
  readonly summonFloor: number
  readonly flags: readonly string[]
}

export type SimulationResult = {
  readonly rows: readonly SimulationRow[]
  readonly finalState: EngineState
}

export class CliArgumentError extends Error {
  readonly name = "CliArgumentError"

  constructor(readonly argument: string) {
    super(`Invalid simulator argument: ${argument}`)
  }
}

export function runBalanceSimulation(options: SimulationOptions): SimulationResult {
  const seed = options.seed ?? 1
  const totalTicks = Math.floor((options.minutes * 60 * 1_000) / TICK_MS)
  const rowIntervalTicks = Math.floor((10 * 60 * 1_000) / TICK_MS)
  let state = createInitialState(seed)
  let rows: readonly SimulationRow[] = []
  let lastProgressMinute = 0
  let lastStage = state.stage

  for (let tick = 1; tick <= totalTicks; tick += 1) {
    if (tick % 10 === 1) {
      state = applyGreedyPolicy(state)
    }

    const simulated = simulateTicks(state, 1)
    state = simulated.state

    if (state.stage > lastStage) {
      lastStage = state.stage
      lastProgressMinute = Math.floor((tick * TICK_MS) / 60_000)
    }

    if (tick % rowIntervalTicks === 0) {
      const minute = Math.floor((tick * TICK_MS) / 60_000)
      rows = [
        ...rows,
        {
          minute,
          stage: state.stage,
          highestBookLevel: getHighestBookLevel(state),
          gold: state.gold,
          summonFloor: getSummonLevel(state.highestLevelEver) + state.skills.summonBonus,
          flags: minute - lastProgressMinute > 15 ? ["STALL"] : [],
        },
      ]
    }
  }

  return { rows, finalState: state }
}

export function formatSimulation(result: SimulationResult): string {
  const lines = ["minute | stage | highest book | gold | summon floor | flags"]

  for (const row of result.rows) {
    lines.push(
      `${row.minute.toString().padStart(6)} | ${row.stage.toString().padStart(5)} | ${row.highestBookLevel
        .toString()
        .padStart(12)} | ${Math.floor(row.gold).toString().padStart(4)} | ${row.summonFloor.toString().padStart(12)} | ${
        row.flags.length === 0 ? "-" : row.flags.join(",")
      }`,
    )
  }

  return `${lines.join("\n")}\n`
}

function applyGreedyPolicy(state: EngineState): EngineState {
  let current = mergeAllPairs(summonAffordableBooks(state))
  let changed = true

  while (changed) {
    const before = current
    current = mergeAllPairs(summonAffordableBooks(current))
    changed = before !== current
  }

  return upgradeCheapestSlot(equipTopSix(current))
}

function summonAffordableBooks(state: EngineState): EngineState {
  let current = state
  let canContinue = true

  while (canContinue) {
    const summonLevel = getSummonLevel(current.highestLevelEver) + current.skills.summonBonus
    const summonCost = getSummonCost(summonLevel)
    if (current.books.length >= INVENTORY_LIMIT || current.gold < summonCost) {
      canContinue = false
    } else {
      current = summonBook(current)
    }
  }

  return current
}

function mergeAllPairs(state: EngineState): EngineState {
  let current = state
  let pair = findMergePair(current)

  while (pair !== null) {
    current = mergeBooks(current, pair.leftId, pair.rightId)
    pair = findMergePair(current)
  }

  return current
}

function findMergePair(state: EngineState): { readonly leftId: string; readonly rightId: string } | null {
  const books = getAllBooks(state)

  for (const left of books) {
    for (const right of books) {
      if (left.id !== right.id && left.level === right.level) {
        return { leftId: left.id, rightId: right.id }
      }
    }
  }

  return null
}

function equipTopSix(state: EngineState): EngineState {
  const sorted = [...getAllBooks(state)].sort((left, right) => right.level - left.level)
  let current: EngineState = { ...state, books: sorted, equipped: [null, null, null, null, null, null] }
  const top = sorted.slice(0, SLOT_INDEXES.length)

  for (const book of top) {
    const firstEmpty = SLOT_INDEXES.find((slot) => current.equipped[slot] === null)
    if (firstEmpty !== undefined) {
      current = equipBook(current, book.id, firstEmpty)
    }
  }

  return current
}

function upgradeCheapestSlot(state: EngineState): EngineState {
  const summonLevel = getSummonLevel(state.highestLevelEver) + state.skills.summonBonus
  const summonCost = getSummonCost(summonLevel)
  const cheapest = SLOT_INDEXES.reduce(
    (best, slot) => {
      const cost = getSlotUpgradeCost(state.slotTiers[slot])
      return cost < best.cost ? { slot, cost } : best
    },
    { slot: 0, cost: getSlotUpgradeCost(state.slotTiers[0]) },
  )

  if (state.gold > summonCost * 5 && state.gold >= cheapest.cost) {
    return upgradeSlot(state, cheapest.slot)
  }

  return state
}

function getAllBooks(state: EngineState): readonly Spellbook[] {
  return [...state.books, ...state.equipped.filter((book): book is Spellbook => book !== null)]
}

function getHighestBookLevel(state: EngineState): number {
  return getAllBooks(state).reduce((highest, book) => Math.max(highest, book.level), state.highestLevelEver)
}

function parseMinutes(argv: readonly string[]): number {
  const flagIndex = argv.findIndex((arg) => arg === "--minutes")
  if (flagIndex === -1) {
    return 120
  }

  const raw = argv[flagIndex + 1]
  if (raw === undefined) {
    throw new CliArgumentError("--minutes")
  }

  const minutes = Number(raw)
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new CliArgumentError(raw)
  }

  return minutes
}

function isCliEntry(argv: readonly string[]): boolean {
  const entry = argv[1]
  return entry !== undefined && (entry.endsWith("simulate.ts") || entry.endsWith("simulate.js"))
}

if (typeof process !== "undefined" && isCliEntry(process.argv)) {
  const minutes = parseMinutes(process.argv)
  process.stdout.write(formatSimulation(runBalanceSimulation({ minutes })))
}
