import { useCallback, useRef, useState } from "react"

/**
 * Reusable interaction-feedback layer. Every player action should visibly
 * respond, so this hook centralises three primitives:
 *
 *  - floating text: a short label that rises and fades above a target element
 *    (e.g. "MERGED! Lv 4" over the merged slot),
 *  - micro toasts: smaller and shorter-lived than the main toast stack
 *    ("Levels must match", "Not enough gold"),
 *  - element pulses: a one-shot CSS animation class (shake / flash / pulse)
 *    applied imperatively to a target element found by CSS selector.
 *
 * Floating text and micro toasts are React state (rendered by
 * <ActionFeedbackLayer/>); pulses are imperative because the target components
 * (slots, buttons) are owned elsewhere and only need a transient class.
 */

export type FloatingText = {
  readonly id: number
  readonly text: string
  readonly tone: "gold" | "danger"
  /** Viewport-relative anchor (center-x, top of target). */
  readonly x: number
  readonly y: number
}

export type MicroToast = {
  readonly id: number
  readonly text: string
}

/** Pulse class -> lifetime. Must match the CSS animation durations. */
const PULSE_DURATION_MS: Record<PulseKind, number> = {
  "fb-shake": 380,
  "fb-flash": 420,
  "fb-pulse": 340,
}

export type PulseKind = "fb-shake" | "fb-flash" | "fb-pulse"

const FLOATING_TEXT_MS = 800
const MICRO_TOAST_MS = 1_200

export type UseActionFeedbackResult = {
  readonly floatingTexts: readonly FloatingText[]
  readonly microToasts: readonly MicroToast[]
  /** Rise-and-fade label centered above the given element selector. */
  readonly floatAbove: (selector: string, text: string, tone?: FloatingText["tone"]) => void
  /** Small transient toast, shorter than the main stack. */
  readonly microToast: (text: string) => void
  /** One-shot animation on the element matched by selector. */
  readonly pulse: (selector: string, kind: PulseKind) => void
}

export function useActionFeedback(): UseActionFeedbackResult {
  const [floatingTexts, setFloatingTexts] = useState<readonly FloatingText[]>([])
  const [microToasts, setMicroToasts] = useState<readonly MicroToast[]>([])
  const idRef = useRef(1)

  const floatAbove = useCallback((selector: string, text: string, tone: FloatingText["tone"] = "gold") => {
    if (typeof document === "undefined") {
      return
    }
    const el = document.querySelector(selector)
    if (el === null) {
      return
    }
    const box = el.getBoundingClientRect()
    const id = idRef.current++
    const item: FloatingText = { id, text, tone, x: box.left + box.width / 2, y: box.top }
    setFloatingTexts((current) => [...current, item].slice(-6))
    window.setTimeout(() => {
      setFloatingTexts((current) => current.filter((entry) => entry.id !== id))
    }, FLOATING_TEXT_MS)
  }, [])

  const microToast = useCallback((text: string) => {
    const id = idRef.current++
    setMicroToasts((current) => [...current, { id, text }].slice(-3))
    window.setTimeout(() => {
      setMicroToasts((current) => current.filter((entry) => entry.id !== id))
    }, MICRO_TOAST_MS)
  }, [])

  const pulse = useCallback((selector: string, kind: PulseKind) => {
    if (typeof document === "undefined") {
      return
    }
    const el = document.querySelector(selector)
    if (!(el instanceof HTMLElement)) {
      return
    }
    // Restart the animation even if the class is still present from a rapid
    // repeat: remove, force reflow, re-add.
    el.classList.remove(kind)
    void el.offsetWidth
    el.classList.add(kind)
    window.setTimeout(() => {
      el.classList.remove(kind)
    }, PULSE_DURATION_MS[kind])
  }, [])

  return { floatingTexts, microToasts, floatAbove, microToast, pulse }
}
