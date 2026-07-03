import { describe, expect, it } from "vitest"
import { detectNavigatorLocale, isLocale, resolveLocale } from "./i18n"

describe("locale detection", () => {
  it("uses Korean for bare ko browser language", () => {
    expect(detectNavigatorLocale("ko")).toBe("ko")
  })

  it("uses Korean for regional Korean browser language", () => {
    expect(detectNavigatorLocale("ko-KR")).toBe("ko")
  })

  it("uses English for non-Korean browser language", () => {
    expect(detectNavigatorLocale("en-US")).toBe("en")
  })

  it("lets a stored English override win over Korean browser language", () => {
    expect(resolveLocale({ storedLocale: "en", navigatorLanguage: "ko-KR" })).toBe("en")
  })

  it("lets a stored Korean override win over English browser language", () => {
    expect(resolveLocale({ storedLocale: "ko", navigatorLanguage: "en-US" })).toBe("ko")
  })

  it("rejects unsupported stored locale values", () => {
    expect(isLocale("ja")).toBe(false)
    expect(resolveLocale({ storedLocale: "ja", navigatorLanguage: "ko-KR" })).toBe("ko")
  })
})
