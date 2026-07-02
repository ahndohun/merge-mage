export const BOSS_WAVE_NUMBER = 10
export const BOSS_ENRAGE_MS = 30_000

export const BattleLayout = {
  width: 390,
  height: 844,
  viewportHeight: 380,
  wizardX: 64,
  wizardY: 226,
  castX: 78,
  castY: 208,
  mobStartX: 330,
  mobMinX: 178,
  bossX: 320,
  bossY: 224,
  bannerY: 70,
  hpBarWidth: 24,
  hpBarHeight: 3,
  bossHpBarWidth: 58,
  bossHpBarHeight: 5,
  mobSpeed: 12,
  slowAlpha: 0.78,
} as const

const LANES = [174, 210, 246, 282, 318] as const

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
