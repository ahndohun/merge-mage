import type { CSSProperties } from "react"
import type { FloatingText, JuiceParticle, MicroToast } from "./useActionFeedback"

type ActionFeedbackLayerProps = {
  readonly floatingTexts: readonly FloatingText[]
  readonly microToasts: readonly MicroToast[]
  readonly particles: readonly JuiceParticle[]
}

/**
 * Renders the transient feedback produced by useActionFeedback: floating texts
 * are fixed-positioned at the anchor captured when they were spawned; micro
 * toasts stack near the bottom, above the controls.
 */
export function ActionFeedbackLayer(props: ActionFeedbackLayerProps) {
  return (
    <>
      <div className="floating-text-layer" aria-hidden="true">
        {props.floatingTexts.map((item) => (
          <div
            className={`floating-text floating-text-${item.tone}`}
            data-testid="floating-text"
            key={item.id}
            style={{ left: item.x, top: item.y }}
          >
            {item.text}
          </div>
        ))}
      </div>
      <div className="juice-particle-layer" aria-hidden="true">
        {props.particles.map((item) => (
          <div
            className={`juice-particle juice-particle-${item.tier}`}
            key={item.id}
            style={
              {
                left: item.x,
                top: item.y,
                "--particle-color": item.color,
                "--particle-angle": `${item.angle}deg`,
                "--particle-distance": `${item.distance}px`,
                width: item.size,
                height: item.size,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="micro-toast-stack" aria-live="polite">
        {props.microToasts.map((item) => (
          <div className="micro-toast" data-testid="micro-toast" key={item.id}>
            {item.text}
          </div>
        ))}
      </div>
    </>
  )
}
