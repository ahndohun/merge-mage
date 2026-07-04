import { EventBus, type GameSfx } from "../bridge/EventBus"

export type { GameSfx }

export const AUDIO_MUTED_STORAGE_KEY = "merge-mage:audio-muted"

export function readAudioMutedPreference(): boolean {
  return getStorage()?.getItem(AUDIO_MUTED_STORAGE_KEY) === "true"
}

// UI → Phaser audio signals ride the same typed EventBus as engine state, so
// there is a single React↔Phaser channel (no ad-hoc window CustomEvent bus).
export function writeAudioMutedPreference(muted: boolean): void {
  getStorage()?.setItem(AUDIO_MUTED_STORAGE_KEY, muted ? "true" : "false")
  EventBus.emit("audio:muted", muted)
}

export function emitGameSfx(sfx: GameSfx): void {
  EventBus.emit("audio:sfx", sfx)
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage
  } catch (error) {
    if (error instanceof Error) {
      return null
    }
    throw error
  }
}
