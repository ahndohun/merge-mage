import { EventBus, type Unsubscribe } from "../bridge/EventBus"
import type { EngineEvent, EngineState } from "../engine/types"

type EngineStateListener = (state: EngineState) => void
type EngineEventsListener = (events: readonly EngineEvent[]) => void

export const EngineEventBridge = {
  install(): void {},
  onState(listener: EngineStateListener): Unsubscribe {
    return EventBus.on("engine:state", listener)
  },
  onEvents(listener: EngineEventsListener): Unsubscribe {
    return EventBus.on("engine:events", listener)
  },
}
