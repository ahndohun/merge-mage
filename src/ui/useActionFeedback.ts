import { useCallback, useRef, useState } from "react"
import type { Spellbook } from "../engine/types"

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
 * Wave B adds juice sequences (merge/summon/upgrade) and DOM particles.
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

export type JuiceParticle = {
  readonly id: number
  readonly x: number
  readonly y: number
  readonly color: string
  readonly angle: number
  readonly distance: number
  readonly size: number
  readonly tier: "normal" | "gold"
}

/** Pulse class -> lifetime. Must match the CSS animation durations. */
const PULSE_DURATION_MS: Record<PulseKind, number> = {
  "fb-shake": 380,
  "fb-flash": 420,
  "fb-pulse": 340,
  "juice-merge-suck": 120,
  "juice-merge-pop": 280,
  "juice-summon-in": 250,
  "juice-upgrade-punch": 320,
  "juice-hitstop": 60,
  "juice-area-shake": 70,
  "juice-gold-flash": 200,
}

export type PulseKind =
  | "fb-shake"
  | "fb-flash"
  | "fb-pulse"
  | "juice-merge-suck"
  | "juice-merge-pop"
  | "juice-summon-in"
  | "juice-upgrade-punch"
  | "juice-hitstop"
  | "juice-area-shake"
  | "juice-gold-flash"

const FLOATING_TEXT_MS = 800
const MICRO_TOAST_MS = 1_200
const PARTICLE_MS = 520
const MAX_PARTICLES = 48
const MAX_ACTIVE_PULSES = 12

const ELEMENT_COLORS: Record<Spellbook["element"], string> = {
  fire: "#e25822",
  frost: "#6ecbff",
  holy: "#ffd873",
}

export type UseActionFeedbackResult = {
  readonly floatingTexts: readonly FloatingText[]
  readonly microToasts: readonly MicroToast[]
  readonly particles: readonly JuiceParticle[]
  /** Rise-and-fade label centered above the given element selector. */
  readonly floatAbove: (selector: string, text: string, tone?: FloatingText["tone"]) => void
  /** Small transient toast, shorter than the main stack. */
  readonly microToast: (text: string) => void
  /** One-shot animation on the element matched by selector. */
  readonly pulse: (selector: string, kind: PulseKind) => void
  readonly playMergeJuice: (
    sourceSelector: string,
    targetSelector: string,
    element: Spellbook["element"],
    resultLevel: number,
  ) => void
  readonly playSummonJuice: (selector: string) => void
  readonly playSlotUpgradeJuice: (selector: string) => void
}

export function useActionFeedback(): UseActionFeedbackResult {
  const [floatingTexts, setFloatingTexts] = useState<readonly FloatingText[]>([])
  const [microToasts, setMicroToasts] = useState<readonly MicroToast[]>([])
  const [particles, setParticles] = useState<readonly JuiceParticle[]>([])
  const idRef = useRef(1)
  const activePulseCountRef = useRef(0)

  const spawnParticles = useCallback((input: {
    readonly x: number
    readonly y: number
    readonly element: Spellbook["element"]
    readonly count: number
    readonly tier: JuiceParticle["tier"]
  }) => {
    const color = input.tier === "gold" ? "#e6b450" : ELEMENT_COLORS[input.element]
    const batch: JuiceParticle[] = []
    for (let index = 0; index < input.count; index += 1) {
      const id = idRef.current++
      batch.push({
        id,
        x: input.x,
        y: input.y,
        color,
        angle: (360 / input.count) * index + (index % 2 === 0 ? 8 : -8),
        distance: 18 + (index % 4) * 6,
        size: input.tier === "gold" ? 5 : 4,
        tier: input.tier,
      })
      window.setTimeout(() => {
        setParticles((current) => current.filter((entry) => entry.id !== id))
      }, PARTICLE_MS)
    }
    setParticles((current) => [...current, ...batch].slice(-MAX_PARTICLES))
  }, [])

  const pulse = useCallback((selector: string, kind: PulseKind) => {
    if (typeof document === "undefined") {
      return
    }
    if (activePulseCountRef.current >= MAX_ACTIVE_PULSES) {
      return
    }
    const el = document.querySelector(selector)
    if (!(el instanceof HTMLElement)) {
      return
    }
    activePulseCountRef.current += 1
    el.classList.remove(kind)
    void el.offsetWidth
    el.classList.add(kind)
    window.setTimeout(() => {
      el.classList.remove(kind)
      activePulseCountRef.current = Math.max(0, activePulseCountRef.current - 1)
    }, PULSE_DURATION_MS[kind])
  }, [])

  const anchorCenter = useCallback((selector: string): { x: number; y: number } | null => {
    if (typeof document === "undefined") {
      return null
    }
    const el = document.querySelector(selector)
    if (el === null) {
      return null
    }
    const box = el.getBoundingClientRect()
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
  }, [])

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

  const playMergeJuice = useCallback(
    (sourceSelector: string, targetSelector: string, element: Spellbook["element"], resultLevel: number) => {
      pulse(sourceSelector, "juice-merge-suck")
      pulse(targetSelector, "juice-merge-suck")
      window.setTimeout(() => {
        pulse(targetSelector, "juice-hitstop")
        window.setTimeout(() => {
          pulse(targetSelector, "juice-merge-pop")
          pulse(targetSelector, "juice-area-shake")
          const anchor = anchorCenter(targetSelector)
          if (anchor !== null) {
            const tierPromotion = resultLevel % 10 === 0
            spawnParticles({
              x: anchor.x,
              y: anchor.y,
              element,
              count: tierPromotion ? 24 : 14,
              tier: tierPromotion ? "gold" : "normal",
            })
            if (tierPromotion) {
              pulse(targetSelector, "juice-gold-flash")
            }
          }
        }, PULSE_DURATION_MS["juice-hitstop"])
      }, PULSE_DURATION_MS["juice-merge-suck"])
    },
    [anchorCenter, pulse, spawnParticles],
  )

  const playSummonJuice = useCallback(
    (selector: string) => {
      pulse(selector, "juice-summon-in")
    },
    [pulse],
  )

  const playSlotUpgradeJuice = useCallback(
    (selector: string) => {
      pulse(selector, "juice-upgrade-punch")
      const anchor = anchorCenter(selector)
      if (anchor !== null) {
        spawnParticles({
          x: anchor.x,
          y: anchor.y,
          element: "holy",
          count: 3,
          tier: "gold",
        })
      }
    },
    [anchorCenter, pulse, spawnParticles],
  )

  return {
    floatingTexts,
    microToasts,
    particles,
    floatAbove,
    microToast,
    pulse,
    playMergeJuice,
    playSummonJuice,
    playSlotUpgradeJuice,
  }
}