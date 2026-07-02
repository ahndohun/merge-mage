import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { EventBus } from "../bridge/EventBus"
import { createGame } from "../game/createGame"
import { HudOverlay } from "./HudOverlay"

export function GameShell() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [activeSceneKey, setActiveSceneKey] = useState("booting")

  useEffect(() => {
    const host = hostRef.current

    if (host === null) {
      return
    }

    const unsubscribe = EventBus.on("current-scene-ready", (scene) => {
      setActiveSceneKey(scene.scene.key)
    })

    const game = createGame(host)
    gameRef.current = game

    return () => {
      unsubscribe()
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <main
      className="game-shell"
      data-active-scene={activeSceneKey}
      data-gold="0"
      data-stage="1"
      data-wave="1"
    >
      <div ref={hostRef} className="phaser-host" />
      <HudOverlay />
    </main>
  )
}
