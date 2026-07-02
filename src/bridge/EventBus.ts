import type Phaser from "phaser"

export type GameBootedPayload = {
  readonly width: number
  readonly height: number
}

export type GameEvents = {
  readonly "current-scene-ready": Phaser.Scene
  readonly "game-booted": GameBootedPayload
}

type GameEventName = keyof GameEvents
type Listener<K extends GameEventName> = (payload: GameEvents[K]) => void
type ListenerMap = {
  readonly [K in GameEventName]: Set<Listener<K>>
}

const listeners: ListenerMap = {
  "current-scene-ready": new Set<Listener<"current-scene-ready">>(),
  "game-booted": new Set<Listener<"game-booted">>(),
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
