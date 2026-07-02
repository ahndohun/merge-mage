import { describe, expect, it } from "vitest"
import { formatNumber } from "./formatNumber"

describe("formatNumber", () => {
  it("formats compact gold-scale values", () => {
    expect(formatNumber(999)).toBe("999")
    expect(formatNumber(1_200)).toBe("1.2K")
    expect(formatNumber(3_400_000)).toBe("3.4M")
    expect(formatNumber(5_600_000_000)).toBe("5.6B")
  })

  it("keeps negative values compact and signed", () => {
    expect(formatNumber(-1_250)).toBe("-1.3K")
  })
})
