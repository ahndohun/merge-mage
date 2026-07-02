const COMPACT_TIERS = [
  { value: 1_000_000_000, suffix: "B" },
  { value: 1_000_000, suffix: "M" },
  { value: 1_000, suffix: "K" },
] as const

export function formatNumber(value: number): string {
  const sign = value < 0 ? "-" : ""
  const absolute = Math.abs(value)

  if (absolute < 1_000) {
    return `${sign}${Math.floor(absolute)}`
  }

  const tier = COMPACT_TIERS.find((item) => absolute >= item.value)
  if (tier === undefined) {
    return `${sign}${Math.floor(absolute)}`
  }

  const compact = absolute / tier.value
  const rounded = compact >= 100 ? Math.round(compact).toString() : compact.toFixed(1).replace(/\.0$/, "")
  return `${sign}${rounded}${tier.suffix}`
}
