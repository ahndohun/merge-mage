import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { EventBus } from "../bridge/EventBus"
import {
  createTranslator,
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  resolveLocale,
  writeLocaleOverride,
  type Locale,
  type Translator,
} from "./i18n"

type LocaleContextValue = {
  readonly locale: Locale
  readonly t: Translator
  readonly setLocaleOverride: (locale: Locale) => void
}

const defaultTranslator = createTranslator("en")

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  t: defaultTranslator,
  setLocaleOverride: () => undefined,
})

type LocaleProviderProps = {
  readonly children: ReactNode
}

export function LocaleProvider(props: LocaleProviderProps) {
  const [locale, setLocale] = useState(getInitialLocale)
  const t = useMemo(() => createTranslator(locale), [locale])

  const setLocaleOverride = useCallback((nextLocale: Locale) => {
    writeLocaleOverride(nextLocale)
    setLocale(nextLocale)
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") {
      return
    }
    document.documentElement.lang = locale
    document.title = t("documentTitle")
  }, [locale, t])

  useEffect(() => {
    EventBus.emit("locale:changed", locale)
  }, [locale])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== LOCALE_STORAGE_KEY) {
        return
      }
      setLocale(resolveLocale({ storedLocale: event.newValue, navigatorLanguage: navigator.language }))
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const value = useMemo(
    () => ({ locale, t, setLocaleOverride }),
    [locale, setLocaleOverride, t],
  )

  return createElement(LocaleContext.Provider, { value }, props.children)
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext)
}
