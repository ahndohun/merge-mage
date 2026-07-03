import type { CSSProperties } from "react"
import type { Spellbook } from "../engine/types"
import type { Translator } from "./i18n"

export type DragGhostState = {
  readonly x: number
  readonly y: number
  readonly book: Spellbook
  readonly snapping?: boolean
  readonly snapFromX?: number
  readonly snapFromY?: number
  readonly snapToX?: number
  readonly snapToY?: number
}

type DragGhostLayerProps = {
  readonly ghost: DragGhostState | null
  readonly t: Translator
}

export function DragGhostLayer(props: DragGhostLayerProps) {
  if (props.ghost === null) {
    return null
  }

  const { ghost, t } = props
  const style =
    ghost.snapping === true
      ? ({
          "--snap-from-x": `${ghost.snapFromX ?? ghost.x}px`,
          "--snap-from-y": `${ghost.snapFromY ?? ghost.y}px`,
          "--snap-to-x": `${ghost.snapToX ?? ghost.x}px`,
          "--snap-to-y": `${ghost.snapToY ?? ghost.y}px`,
        } as CSSProperties)
      : ({
          left: ghost.x,
          top: ghost.y,
        } as CSSProperties)

  return (
    <div
      aria-hidden="true"
      className={`drag-ghost element-${ghost.book.element}${ghost.snapping === true ? " is-snapping" : ""}`}
      data-testid="drag-ghost"
      style={style}
    >
      <img alt="" className="drag-ghost-icon" draggable={false} src={`/assets/tomes/${ghost.book.element}.png`} />
      <span className="drag-ghost-badge">{t.levelBadge(ghost.book.level)}</span>
    </div>
  )
}