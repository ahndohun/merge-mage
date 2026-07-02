export const AUDIO_MUTED_STORAGE_KEY = "merge-mage:audio-muted"
export const AUDIO_MUTED_EVENT = "merge-mage:audio-muted"
export const GAME_SFX_EVENT = "merge-mage:sfx"

export type GameSfx = "merge" | "confirm"

export function readAudioMutedPreference(): boolean {
  return getStorage()?.getItem(AUDIO_MUTED_STORAGE_KEY) === "true"
}

export function writeAudioMutedPreference(muted: boolean): void {
  getStorage()?.setItem(AUDIO_MUTED_STORAGE_KEY, muted ? "true" : "false")
  window.dispatchEvent(new CustomEvent(AUDIO_MUTED_EVENT, { detail: muted }))
}

export function emitGameSfx(sfx: GameSfx): void {
  window.dispatchEvent(new CustomEvent(GAME_SFX_EVENT, { detail: sfx }))
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
