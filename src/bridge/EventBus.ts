import type Phaser from "phaser"
import type { EngineEvent, EngineState } from "../engine/types"
import type { Locale } from "../ui/i18n"

export type GameBootedPayload = {
  readonly width: number
  readonly height: number
}

export type GameSfx = "merge" | "confirm"

export type GameEvents = {
  readonly "current-scene-ready": Phaser.Scene
  readonly "engine:events": readonly EngineEvent[]
  readonly "engine:state": EngineState
  readonly "game-booted": GameBootedPayload
  readonly "locale:changed": Locale
  readonly "audio:muted": boolean
  readonly "audio:sfx": GameSfx
}

type GameEventName = keyof GameEvents
type Listener<K extends GameEventName> = (payload: GameEvents[K]) => void
type ListenerMap = {
  readonly [K in GameEventName]: Set<Listener<K>>
}

const listeners: ListenerMap = {
  "current-scene-ready": new Set<Listener<"current-scene-ready">>(),
  "engine:events": new Set<Listener<"engine:events">>(),
  "engine:state": new Set<Listener<"engine:state">>(),
  "game-booted": new Set<Listener<"game-booted">>(),
  "locale:changed": new Set<Listener<"locale:changed">>(),
  "audio:muted": new Set<Listener<"audio:muted">>(),
  "audio:sfx": new Set<Listener<"audio:sfx">>(),
}

export type Unsubscribe = () => void

export const EventBus = {
  on<K extends GameEventName>(eventName: K, listener: Listener<K>): Unsubscribe {
    listeners[eventName].add(listener)

    return () => {
      listeners[eventName].delete(listener)
    }
  },
  emit<K extends GameEventName>(eventName: K, payload: GameEvents[K]): void {
    for (const listener of listeners[eventName]) {
      listener(payload)
    }
  },
}
