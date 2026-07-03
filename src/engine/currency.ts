export const LEGACY_MANA_STONES_PER_CRYSTAL = 80

export function convertLegacyManaStonesToCrystals(manaStones: number): number {
  return Math.floor(Math.max(0, manaStones) / LEGACY_MANA_STONES_PER_CRYSTAL)
}
