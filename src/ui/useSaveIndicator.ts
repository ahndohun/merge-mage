import { useCallback, useEffect, useRef, useState } from "react"

export type SaveIndicatorState = "idle" | "saved" | "offline"

export type SaveIndicatorControls = {
  readonly state: SaveIndicatorState
  readonly flashCloudSaved: () => void
  readonly markCloudOffline: () => void
}

export function useSaveIndicator(): SaveIndicatorControls {
  const [state, setState] = useState<SaveIndicatorState>("idle")
  const flashTimerRef = useRef<number | null>(null)

  const clearFlashTimer = useCallback(() => {
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current)
      flashTimerRef.current = null
    }
  }, [])

  const flashCloudSaved = useCallback(() => {
    clearFlashTimer()
    setState("saved")
    flashTimerRef.current = window.setTimeout(() => {
      flashTimerRef.current = null
      setState((current) => (current === "saved" ? "idle" : current))
    }, 800)
  }, [clearFlashTimer])

  const markCloudOffline = useCallback(() => {
    clearFlashTimer()
    setState("offline")
  }, [clearFlashTimer])

  useEffect(() => {
    return () => clearFlashTimer()
  }, [clearFlashTimer])

  return { state, flashCloudSaved, markCloudOffline }
}
