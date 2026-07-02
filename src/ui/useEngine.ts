import { useCallback, useEffect, useRef, useState } from "react"
import {
  allocateSkill as allocateSkillReducer,
  equipBook as equipBookReducer,
  mergeBooks as mergeBooksReducer,
  prestige as prestigeReducer,
  resetSkills as resetSkillsReducer,
  summonBook,
  unequipBook as unequipBookReducer,
  upgradeSlot as upgradeSlotReducer,
} from "../engine/actions"
import { INVENTORY_LIMIT } from "../engine/constants"
import { getSummonCost, getSummonLevel } from "../engine/summon"
import type { EngineEvent, EngineState, SkillName } from "../engine/types"
import { EventBus } from "../bridge/EventBus"
import { canMerge, isExpectedEngineError } from "./engineActionHelpers"
import { ensureSaveToken, loadInitialState, loadNickname, saveNickname } from "./engineStorage"
import { useAutoEngineActions, useEngineClock, useOfflineClaim, useSaveCadence, useVisibilityPause } from "./useEngineEffects"
import { useToasts, type ToastMessage } from "./useToasts"
import {
  fetchLeaderboard,
  postLeaderboard,
  type LeaderboardEntry,
  type OfflineClaim,
} from "./apiClient"

export type LeaderboardStatus = "idle" | "loading" | "ready" | "unavailable" | "error"

export type UseEngineResult = {
  readonly state: EngineState
  readonly events: readonly EngineEvent[]
  readonly summonLevel: number
  readonly summonCost: number
  readonly canSummon: boolean
  readonly autoMerge: boolean
  readonly autoBuy: boolean
  readonly toasts: readonly ToastMessage[]
  readonly leaderboardStatus: LeaderboardStatus
  readonly leaderboard: readonly LeaderboardEntry[]
  readonly nickname: string
  readonly offlineClaim: OfflineClaim | null
  readonly summon: () => void
  readonly mergeBooks: (leftId: string, rightId: string) => void
  readonly equipBook: (bookId: string, slotIdx: number) => void
  readonly unequipBook: (slotIdx: number) => void
  readonly upgradeSlot: (slotIdx: number) => void
  readonly allocateSkill: (skill: SkillName) => void
  readonly resetSkills: () => void
  readonly prestige: () => void
  readonly setAutoMerge: (enabled: boolean) => void
  readonly setAutoBuy: (enabled: boolean) => void
  readonly setNickname: (nickname: string) => void
  readonly submitLeaderboard: () => void
  readonly refreshLeaderboard: () => void
  readonly closeOfflineClaim: () => void
}

type ReducerInput = {
  readonly reducer: (state: EngineState) => EngineState
  readonly floorToast?: boolean
  readonly successToast?: string
}

export function useEngine(): UseEngineResult {
  const [state, setState] = useState(loadInitialState)
  const [events, setEvents] = useState<readonly EngineEvent[]>([])
  const [autoMerge, setAutoMergeState] = useState(false)
  const [autoBuy, setAutoBuyState] = useState(false)
  const [leaderboardStatus, setLeaderboardStatus] = useState<LeaderboardStatus>("idle")
  const [leaderboard, setLeaderboard] = useState<readonly LeaderboardEntry[]>([])
  const [nickname, setNicknameState] = useState(loadNickname)
  const [offlineClaim, setOfflineClaim] = useState<OfflineClaim | null>(null)
  const { toasts, addToast } = useToasts()
  const stateRef = useRef(state)
  const autoMergeRef = useRef(autoMerge)
  const autoBuyRef = useRef(autoBuy)
  const nicknameRef = useRef(nickname)
  const accumulatorRef = useRef(0)
  const lastFrameRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const saveTokenRef = useRef(ensureSaveToken())
  const saveIssueRef = useRef<string | null>(null)

  const commitState = useCallback((nextState: EngineState, nextEvents: readonly EngineEvent[]) => {
    stateRef.current = nextState
    setState(nextState)
    setEvents(nextEvents)
    EventBus.emit("engine:state", nextState)
    if (nextEvents.length > 0) {
      EventBus.emit("engine:events", nextEvents)
    }
  }, [])

  const applyReducer = useCallback(
    (input: ReducerInput) => {
      const before = stateRef.current
      const beforeSummonLevel = getSummonLevel(before.highestLevelEver) + before.skills.summonBonus

      try {
        const next = input.reducer(before)
        commitState(next, [])

        const afterSummonLevel = getSummonLevel(next.highestLevelEver) + next.skills.summonBonus
        if (input.floorToast === true && afterSummonLevel > beforeSummonLevel) {
          addToast("Summon level up!", "notice")
        }
        if (input.successToast !== undefined) {
          addToast(input.successToast, "notice")
        }
      } catch (error) {
        if (isExpectedEngineError(error)) {
          return
        }
        throw error
      }
    },
    [addToast, commitState],
  )

  const summon = useCallback(() => {
    applyReducer({ reducer: summonBook, floorToast: true })
  }, [applyReducer])

  const mergeBooks = useCallback(
    (leftId: string, rightId: string) => {
      if (!canMerge(stateRef.current, leftId, rightId)) {
        return
      }
      applyReducer({ reducer: (current) => mergeBooksReducer(current, leftId, rightId), floorToast: true })
    },
    [applyReducer],
  )

  const equipBook = useCallback(
    (bookId: string, slotIdx: number) => {
      applyReducer({ reducer: (current) => equipBookReducer(current, bookId, slotIdx) })
    },
    [applyReducer],
  )

  const unequipBook = useCallback(
    (slotIdx: number) => {
      applyReducer({ reducer: (current) => unequipBookReducer(current, slotIdx) })
    },
    [applyReducer],
  )

  const upgradeSlot = useCallback(
    (slotIdx: number) => {
      applyReducer({ reducer: (current) => upgradeSlotReducer(current, slotIdx) })
    },
    [applyReducer],
  )

  const allocateSkill = useCallback(
    (skill: SkillName) => {
      applyReducer({ reducer: (current) => allocateSkillReducer(current, skill) })
    },
    [applyReducer],
  )

  const resetSkills = useCallback(() => {
    applyReducer({ reducer: resetSkillsReducer })
  }, [applyReducer])

  const prestige = useCallback(() => {
    applyReducer({ reducer: prestigeReducer, successToast: "Rebirth complete." })
  }, [applyReducer])

  const setAutoMerge = useCallback((enabled: boolean) => {
    autoMergeRef.current = enabled
    setAutoMergeState(enabled)
  }, [])

  const setAutoBuy = useCallback((enabled: boolean) => {
    autoBuyRef.current = enabled
    setAutoBuyState(enabled)
  }, [])

  const setNickname = useCallback((nextNickname: string) => {
    const clean = nextNickname.slice(0, 18)
    nicknameRef.current = clean
    setNicknameState(clean)
    saveNickname(clean)
  }, [])

  const refreshLeaderboard = useCallback(() => {
    setLeaderboardStatus("loading")
    void fetchLeaderboard().then((result) => {
      if (result.kind === "ok") {
        setLeaderboard(result.data)
        setLeaderboardStatus("ready")
        return
      }
      setLeaderboardStatus(result.kind)
    })
  }, [])

  const submitLeaderboard = useCallback(() => {
    setLeaderboardStatus("loading")
    void postLeaderboard({ nickname: nicknameRef.current, stage: stateRef.current.stage }).then((result) => {
      if (result.kind === "ok") {
        setLeaderboard(result.data)
        setLeaderboardStatus("ready")
        return
      }
      setLeaderboardStatus(result.kind)
    })
  }, [])

  const closeOfflineClaim = useCallback(() => {
    setOfflineClaim(null)
  }, [])

  useEffect(() => {
    EventBus.emit("engine:state", stateRef.current)
  }, [])

  useEngineClock({ stateRef, accumulatorRef, lastFrameRef, rafRef, commitState })
  useVisibilityPause(lastFrameRef)
  useAutoEngineActions({ autoBuyRef, autoMergeRef, stateRef, summon, mergeBooks })
  useSaveCadence({ stateRef, saveTokenRef, nicknameRef, saveIssueRef, addToast })
  useOfflineClaim({ saveTokenRef, stateRef, commitState, setOfflineClaim })

  useEffect(() => {
    refreshLeaderboard()
  }, [refreshLeaderboard])

  const summonLevel = getSummonLevel(state.highestLevelEver) + state.skills.summonBonus
  const summonCost = getSummonCost(summonLevel)
  const canSummon = state.books.length < INVENTORY_LIMIT && state.gold >= summonCost

  return {
    state,
    events,
    summonLevel,
    summonCost,
    canSummon,
    autoMerge,
    autoBuy,
    toasts,
    leaderboardStatus,
    leaderboard,
    nickname,
    offlineClaim,
    summon,
    mergeBooks,
    equipBook,
    unequipBook,
    upgradeSlot,
    allocateSkill,
    resetSkills,
    prestige,
    setAutoMerge,
    setAutoBuy,
    setNickname,
    submitLeaderboard,
    refreshLeaderboard,
    closeOfflineClaim,
  }
}
