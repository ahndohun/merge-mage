export type RandomSource = () => number
export type RandomStep = {
  readonly value: number
  readonly state: number
}

const MULBERRY_INCREMENT = 0x6d2b79f5

export function mulberry32(seed: number): RandomSource {
  let state = seed >>> 0

  return () => {
    const step = nextRandomState(state)
    state = step.state

    return step.value
  }
}

export function createRandomState(seed: number): number {
  return seed >>> 0
}

export function nextRandomState(state: number): RandomStep {
  const nextState = (state + MULBERRY_INCREMENT) >>> 0
  let value = nextState
  value = Math.imul(value ^ (value >>> 15), value | 1)
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61)

  return {
    value: ((value ^ (value >>> 14)) >>> 0) / 4294967296,
    state: nextState,
  }
}
