import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { tutorialStepCopy, tutorialStepTarget, type TutorialState } from "./tutorial"
import { useLocale } from "./useLocale"

type Rect = { readonly top: number; readonly left: number; readonly width: number; readonly height: number }

type TutorialProps = {
  readonly state: TutorialState
  readonly onSkip: () => void
}

const SPOTLIGHT_PAD = 6

/**
 * First-run tutorial overlay: dims everything except the current step's target
 * (a four-panel dim, so the target stays fully interactive), and shows an
 * instruction card with a blinking pixel arrow pointing at it.
 */
export function Tutorial(props: TutorialProps) {
  const { t } = useLocale()
  const target = tutorialStepTarget(props.state)
  const copy = tutorialStepCopy(props.state, t)
  const rect = useSpotlightRect(target)

  if (target === null || copy === null) {
    return null
  }

  // Card sits below the target when the target is in the top half, otherwise
  // above it — so the card never covers the thing it points at.
  const overlayHeight = typeof window === "undefined" ? 844 : Math.min(window.innerHeight, 844)
  const spotlightBottom = rect === null ? 0 : rect.top + rect.height
  const placeCardBelow = rect === null ? true : spotlightBottom < overlayHeight * 0.55
  const arrowDirection = placeCardBelow ? "up" : "down"

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label="Tutorial">
      {rect === null ? (
        <div className="tutorial-dim tutorial-dim-full" />
      ) : (
        <DimPanels rect={rect} />
      )}

      {rect !== null ? (
        <div
          className="tutorial-spotlight-ring"
          style={{
            top: rect.top - SPOTLIGHT_PAD,
            left: rect.left - SPOTLIGHT_PAD,
            width: rect.width + SPOTLIGHT_PAD * 2,
            height: rect.height + SPOTLIGHT_PAD * 2,
          }}
        />
      ) : null}

      <div
        className={`tutorial-card tutorial-card-${placeCardBelow ? "below" : "above"}`}
        data-testid="tutorial-card"
        style={cardPosition(rect, placeCardBelow, overlayHeight)}
      >
        <div className={`tutorial-arrow tutorial-arrow-${arrowDirection}`} aria-hidden="true" />
        <p className="tutorial-copy">{copy}</p>
        <button className="tutorial-skip" data-testid="tutorial-skip" onClick={props.onSkip} type="button">
          {t("skip")}
        </button>
      </div>
    </div>
  )
}

function DimPanels(props: { readonly rect: Rect }) {
  const { rect } = props
  const top = rect.top - SPOTLIGHT_PAD
  const bottom = rect.top + rect.height + SPOTLIGHT_PAD
  const left = rect.left - SPOTLIGHT_PAD
  const right = rect.left + rect.width + SPOTLIGHT_PAD

  return (
    <>
      <div className="tutorial-dim" style={{ top: 0, left: 0, right: 0, height: Math.max(0, top) }} />
      <div className="tutorial-dim" style={{ top: bottom, left: 0, right: 0, bottom: 0 }} />
      <div className="tutorial-dim" style={{ top: Math.max(0, top), left: 0, width: Math.max(0, left), height: Math.max(0, bottom - top) }} />
      <div className="tutorial-dim" style={{ top: Math.max(0, top), left: right, right: 0, height: Math.max(0, bottom - top) }} />
    </>
  )
}

function cardPosition(rect: Rect | null, below: boolean, overlayHeight: number): CSSProperties {
  if (rect === null) {
    return { top: overlayHeight * 0.4, left: 16, right: 16 }
  }
  if (below) {
    return { top: rect.top + rect.height + SPOTLIGHT_PAD + 14, left: 16, right: 16 }
  }
  return { bottom: overlayHeight - rect.top + SPOTLIGHT_PAD + 14, left: 16, right: 16 }
}

/**
 * Tracks the target element's on-screen box relative to the overlay origin.
 * Re-measures on target change, resize, and on a short poll (the game re-lays
 * out as books appear, and the target element identity can change mid-step).
 */
function useSpotlightRect(target: string | null): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null)
  const rectRef = useRef<Rect | null>(null)

  useLayoutEffect(() => {
    rectRef.current = rect
  }, [rect])

  useEffect(() => {
    if (target === null) {
      setRect(null)
      return
    }

    let raf = 0
    const measure = () => {
      const el = document.querySelector(target)
      const overlay = document.querySelector(".tutorial-overlay")
      if (el === null || overlay === null) {
        if (rectRef.current !== null) {
          rectRef.current = null
          setRect(null)
        }
        return
      }
      const box = el.getBoundingClientRect()
      const origin = overlay.getBoundingClientRect()
      const next: Rect = {
        top: box.top - origin.top,
        left: box.left - origin.left,
        width: box.width,
        height: box.height,
      }
      const prev = rectRef.current
      if (prev === null || prev.top !== next.top || prev.left !== next.left || prev.width !== next.width || prev.height !== next.height) {
        rectRef.current = next
        setRect(next)
      }
    }

    const loop = () => {
      measure()
      raf = window.requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener("resize", measure)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("resize", measure)
    }
  }, [target])

  return rect
}
