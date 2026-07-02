import Phaser from "phaser"
import { EventBus } from "../bridge/EventBus"
import { BattleScene } from "./scenes/BattleScene"

export const GAME_WIDTH = 390
export const GAME_HEIGHT = 844

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: "#0b0d13",
    pixelArt: true,
    roundPixels: true,
    loader: {
      // Phaser 4.2 stalls after the first parallel batch completes (32 done,
      // 0 inflight, rest pending forever). Keep every asset in one batch
      // until the upstream nextFile handoff is fixed.
      maxParallelDownloads: 256,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom: Phaser.Scale.MAX_ZOOM,
    },
    scene: [BattleScene],
  }

  const game = new Phaser.Game(config)
  EventBus.emit("game-booted", { width: GAME_WIDTH, height: GAME_HEIGHT })

  if (import.meta.env.DEV) {
    ;(globalThis as Record<string, unknown>)["__mergeMageGame"] = game
  }
  return game
}
