import { describe, expect, it } from "vitest"
import { createInitialState } from "../engine/state"
import { leaderboardBodySchema, saveBodySchema } from "../../api/index"

const token = "merge_mage_test_token_12345"

function book(id: string, level = 1) {
  return { id, level, element: "fire" } as const
}

describe("saveBodySchema", () => {
  it("accepts an engine state inside anti-cheat limits", () => {
    const body = {
      token,
      state: {
        ...createInitialState(7),
        books: [book("book-1")],
        equipped: [book("book-2"), null, null, null, null, null],
      },
    }

    const parsed = saveBodySchema.safeParse(body)

    expect(parsed.success).toBe(true)
  })

  it("rejects malformed tokens", () => {
    const parsed = saveBodySchema.safeParse({
      token: "short!",
      state: createInitialState(7),
    })

    expect(parsed.success).toBe(false)
  })

  it("rejects non-finite, negative, and absurd gold", () => {
    for (const gold of [Number.NaN, -1, 1_000_000_000_001]) {
      const parsed = saveBodySchema.safeParse({
        token,
        state: { ...createInitialState(7), gold },
      })

      expect(parsed.success).toBe(false)
    }
  })

  it("rejects stages outside the server limit", () => {
    for (const stage of [0, 100_001]) {
      const parsed = saveBodySchema.safeParse({
        token,
        state: { ...createInitialState(7), stage },
      })

      expect(parsed.success).toBe(false)
    }
  })

  it("rejects excess inventory and invalid book levels", () => {
    const tooManyBooks = Array.from({ length: 16 }, (_, index) => book(`book-${index + 1}`))
    const excessInventory = saveBodySchema.safeParse({
      token,
      state: { ...createInitialState(7), books: tooManyBooks },
    })
    const invalidLevel = saveBodySchema.safeParse({
      token,
      state: { ...createInitialState(7), books: [book("book-1", 0)] },
    })

    expect(excessInventory.success).toBe(false)
    expect(invalidLevel.success).toBe(false)
  })
})

describe("leaderboardBodySchema", () => {
  it("strips control characters from nicknames", () => {
    const parsed = leaderboardBodySchema.safeParse({
      token,
      nickname: "Me\u0000r\nlin",
    })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.nickname).toBe("Merlin")
    }
  })

  it("rejects nicknames shorter than two visible characters after stripping", () => {
    const parsed = leaderboardBodySchema.safeParse({
      token,
      nickname: "M\u0000",
    })

    expect(parsed.success).toBe(false)
  })
})
