export type FixedStepSimulation<State, Event> = {
  readonly state: State
  readonly events: readonly Event[]
}

export type FixedStepDriverInput<State, Event> = {
  readonly state: State
  readonly accumulatorMs: number
  readonly elapsedMs: number
  readonly stepMs: number
  readonly simulate: (state: State, ticks: number) => FixedStepSimulation<State, Event>
}

export type FixedStepDriverResult<State, Event> = {
  readonly state: State
  readonly accumulatorMs: number
  readonly events: readonly Event[]
  readonly ticks: number
}

export function advanceFixedStepDriver<State, Event>(
  input: FixedStepDriverInput<State, Event>,
): FixedStepDriverResult<State, Event> {
  const nextAccumulator = input.accumulatorMs + Math.max(0, input.elapsedMs)
  const ticks = Math.floor(nextAccumulator / input.stepMs)

  if (ticks === 0) {
    return {
      state: input.state,
      accumulatorMs: nextAccumulator,
      events: [],
      ticks,
    }
  }

  const simulated = input.simulate(input.state, ticks)

  return {
    state: simulated.state,
    accumulatorMs: nextAccumulator - ticks * input.stepMs,
    events: simulated.events,
    ticks,
  }
}
