import { describe, expect, it } from "vitest"
import { getPixelGlyphPatternWidth, PixelGlyphPatterns } from "./PixelGlyphs"

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

describe("pixel glyph patterns", () => {
  it("uses consistent row widths for every digit glyph", () => {
    for (const digit of DIGITS) {
      const width = getPixelGlyphPatternWidth(digit)

      expect(width).toBe(4)
      expect(PixelGlyphPatterns[digit].every((row) => row.length === width)).toBe(true)
    }
  })

  it("draws 3 with a curved middle instead of a mirrored-E block", () => {
    expect(PixelGlyphPatterns["3"]).toEqual(["1110", "0001", "0110", "0001", "1110"])
  })
})
