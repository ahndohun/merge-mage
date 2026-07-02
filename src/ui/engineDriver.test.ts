import { describe, expect, it } from "vitest"
import { advanceFixedStepDriver, type FixedStepSimulation } from "./engineDriver"

type TestState = {
  readonly ticks: number
}

type TestEvent = {
  readonly ticks: number
}

function simulate(state: TestState, ticks: number): FixedStepSimulation<TestState, TestEvent> {
  return {
    state: { ticks: state.ticks + ticks },
    events: [{ ticks }],
  }
}

describe("advanceFixedStepDriver", () => {
  it("accumulates elapsed time and steps the mocked engine only for full ticks", () => {
    const first = advanceFixedStepDriver({
      state: { ticks: 0 },
      accumulatorMs: 50,
      elapsedMs: 249,
      stepMs: 100,
      simulate,
    })

    expect(first.ticks).toBe(2)
    expect(first.accumulatorMs).toBe(99)
    expect(first.state.ticks).toBe(2)
    expect(first.events).toEqual([{ ticks: 2 }])

    const second = advanceFixedStepDriver({
      state: first.state,
      accumulatorMs: first.accumulatorMs,
      elapsedMs: 1,
      stepMs: 100,
      simulate,
    })

    expect(second.ticks).toBe(1)
    expect(second.accumulatorMs).toBe(0)
    expect(second.state.ticks).toBe(3)
  })

  it("preserves fractional accumulator time when no full tick elapsed", () => {
    const frame = advanceFixedStepDriver({
      state: { ticks: 0 },
      accumulatorMs: 20,
      elapsedMs: 79,
      stepMs: 100,
      simulate,
    })

    expect(frame.ticks).toBe(0)
    expect(frame.accumulatorMs).toBe(99)
    expect(frame.events).toEqual([])
  })
})
