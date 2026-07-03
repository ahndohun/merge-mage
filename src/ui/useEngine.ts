import { useCallback, useEffect, useRef, useState } from "react"
import {
  allocateSkill as allocateSkillReducer,
  autoMergeBooks as autoMergeBooksReducer,
  claimQuestReward as claimQuestRewardReducer,
  enterRift as enterRiftReducer,
  equipRelic as equipRelicReducer,
  equipBook as equipBookReducer,
  exitRift as exitRiftReducer,
  mergeBooks as mergeBooksReducer,
  prestige as prestigeReducer,
  resetSkills as resetSkillsReducer,
  selectTrait as selectTraitReducer,
  summonRelic as summonRelicReducer,
  summonBook,
  swapBookPositions as swapBookPositionsReducer,
  unequipBook as unequipBookReducer,
  upgradeSlot as upgradeSlotReducer,
} from "../engine/actions"
import { INVENTORY_LIMIT } from "../engine/constants"
import { getEquippedRelicEffects } from "../engine/relics"
import { getSummonCost, getSummonLevel } from "../engine/summon"
import type { TraitId, TraitSlot } from "../engine/traits"
import type { EngineEvent, EngineState, RiftKind, SkillName } from "../engine/types"
import { EventBus } from "../bridge/EventBus"
import { canMerge, isExpectedEngineError } from "./engineActionHelpers"
import { ensureSaveToken, loadInitialState, loadNickname, saveNickname } from "./engineStorage"
import { useAutoEngineActions, useEngineClock, useOfflineClaim, useSaveCadence, useVisibilityPause } from "./useEngineEffects"
import { useToasts, type ToastMessage } from "./useToasts"
import { useLocale } from "./useLocale"
import { useSaveIndicator, type SaveIndicatorState } from "./useSaveIndicator"
import {
  fetchLeaderboard,
  postLeaderboard,
  postSave,
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
  /** True after the last submit succeeded; cleared when the nickname is edited. */
  readonly nicknameSaved: boolean
  readonly offlineClaim: OfflineClaim | null
  readonly saveIndicator: SaveIndicatorState
  readonly notify: (text: string, kind: ToastMessage["kind"]) => void
  readonly summon: () => boolean
  readonly mergeBooks: (leftId: string, rightId: string) => boolean
  readonly swapBooks: (leftId: string, rightId: string) => boolean
  readonly autoMergeBooks: () => boolean
  readonly equipBook: (bookId: string, slotIdx: number) => boolean
  readonly unequipBook: (slotIdx: number) => boolean
  readonly upgradeSlot: (slotIdx: number) => boolean
  readonly allocateSkill: (skill: SkillName) => boolean
  readonly resetSkills: () => boolean
  readonly prestige: () => boolean
  readonly summonRelic: () => boolean
  readonly equipRelic: (relicId: string | null, slotIdx: number) => boolean
  readonly enterRift: (kind: RiftKind) => boolean
  readonly exitRift: () => boolean
  readonly claimQuestReward: (questId: string) => boolean
  readonly selectTrait: (slot: TraitSlot, traitId: TraitId) => boolean
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
  const { t } = useLocale()
  const [state, setState] = useState(loadInitialState)
  const [events, setEvents] = useState<readonly EngineEvent[]>([])
  const [autoMerge, setAutoMergeState] = useState(false)
  const [autoBuy, setAutoBuyState] = useState(false)
  const [leaderboardStatus, setLeaderboardStatus] = useState<LeaderboardStatus>("idle")
  const [leaderboard, setLeaderboard] = useState<readonly LeaderboardEntry[]>([])
  const [nickname, setNicknameState] = useState(loadNickname)
  const [nicknameSaved, setNicknameSaved] = useState(false)
  const [offlineClaim, setOfflineClaim] = useState<OfflineClaim | null>(null)
  const saveIndicator = useSaveIndicator()
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
  const saveFailureCountRef = useRef(0)

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
          addToast(t("toastSummonLevelUp"), "notice")
        }
        if (input.successToast !== undefined) {
          addToast(input.successToast, "notice")
        }
        return true
      } catch (error) {
        if (isExpectedEngineError(error)) {
          return false
        }
        throw error
      }
    },
    [addToast, commitState, t],
  )

  const summon = useCallback(() => applyReducer({ reducer: summonBook, floorToast: true }), [applyReducer])

  const mergeBooks = useCallback(
    (leftId: string, rightId: string) => {
      if (!canMerge(stateRef.current, leftId, rightId)) {
        return false
      }
      return applyReducer({ reducer: (current) => mergeBooksReducer(current, leftId, rightId), floorToast: true })
    },
    [applyReducer],
  )

  const equipBook = useCallback(
    (bookId: string, slotIdx: number) => applyReducer({ reducer: (current) => equipBookReducer(current, bookId, slotIdx) }),
    [applyReducer],
  )

  const swapBooks = useCallback(
    (leftId: string, rightId: string) => applyReducer({ reducer: (current) => swapBookPositionsReducer(current, leftId, rightId) }),
    [applyReducer],
  )

  const autoMergeBooks = useCallback(
    () => applyReducer({ reducer: autoMergeBooksReducer, floorToast: true }),
    [applyReducer],
  )

  const unequipBook = useCallback(
    (slotIdx: number) => applyReducer({ reducer: (current) => unequipBookReducer(current, slotIdx) }),
    [applyReducer],
  )

  const upgradeSlot = useCallback(
    (slotIdx: number) => applyReducer({ reducer: (current) => upgradeSlotReducer(current, slotIdx) }),
    [applyReducer],
  )

  const allocateSkill = useCallback(
    (skill: SkillName) => applyReducer({ reducer: (current) => allocateSkillReducer(current, skill) }),
    [applyReducer],
  )

  const resetSkills = useCallback(() => applyReducer({ reducer: resetSkillsReducer }), [applyReducer])

  const prestige = useCallback(() => applyReducer({ reducer: prestigeReducer, successToast: t("toastRebirthComplete") }), [applyReducer, t])
  const summonRelic = useCallback(() => applyReducer({ reducer: summonRelicReducer, successToast: t("toastRelicSummoned") }), [applyReducer, t])
  const equipRelic = useCallback(
    (relicId: string | null, slotIdx: number) => applyReducer({ reducer: (current) => equipRelicReducer(current, relicId, slotIdx) }),
    [applyReducer],
  )
  const enterRift = useCallback(
    (kind: RiftKind) => applyReducer({ reducer: (current) => enterRiftReducer(current, kind, currentLocalDate()) }),
    [applyReducer],
  )
  const exitRift = useCallback(() => applyReducer({ reducer: exitRiftReducer }), [applyReducer])

  const claimQuestReward = useCallback(
    (questId: string) => applyReducer({ reducer: (current) => claimQuestRewardReducer(current, questId) }),
    [applyReducer],
  )

  const selectTrait = useCallback(
    (slot: TraitSlot, traitId: TraitId) => applyReducer({ reducer: (current) => selectTraitReducer(current, slot, traitId) }),
    [applyReducer],
  )

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
    setNicknameSaved(false)
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
    setNicknameSaved(false)
    const token = saveTokenRef.current.token
    // The server derives bestStage from the stored save, so persist the
    // current state first — a brand-new token has no save yet (404 otherwise).
    void postSave({ token, nickname: nicknameRef.current, state: stateRef.current })
      .then(() => postLeaderboard({ token, nickname: nicknameRef.current }))
      .then((result) => {
        if (result.kind !== "ok") {
          setLeaderboardStatus(result.kind)
          return
        }
        // Visible confirmation is the only feedback the submitter gets: E2E%
        // nicknames never appear on the public board (server filter), and a
        // real player's row can sit below the fold. The toast is transient, so
        // nicknameSaved also drives a persistent SAVED chip in the panel.
        setNicknameSaved(true)
        addToast(t("toastLeaderboardSaved"), "notice")
        return fetchLeaderboard().then((list) => {
          if (list.kind === "ok") {
            setLeaderboard(list.data)
            setLeaderboardStatus("ready")
            return
          }
          setLeaderboardStatus(list.kind)
        })
      })
  }, [addToast, t])

  const closeOfflineClaim = useCallback(() => {
    setOfflineClaim(null)
  }, [])

  useEffect(() => {
    EventBus.emit("engine:state", stateRef.current)
  }, [])

  useEngineClock({ stateRef, accumulatorRef, lastFrameRef, rafRef, commitState })
  useVisibilityPause(lastFrameRef)
  useAutoEngineActions({ autoBuyRef, autoMergeRef, summon, autoMergeBooks })
  useSaveCadence({
    stateRef,
    saveTokenRef,
    nicknameRef,
    saveIssueRef,
    saveFailureCountRef,
    addToast,
    cloudSaveUnavailableMessage: t("toastCloudSaveUnavailable"),
    onCloudSaveOk: saveIndicator.flashCloudSaved,
    onCloudSaveOffline: saveIndicator.markCloudOffline,
    saveFailed: t.saveFailed,
  })
  useOfflineClaim({ saveTokenRef, stateRef, commitState, setOfflineClaim })

  useEffect(() => {
    refreshLeaderboard()
  }, [refreshLeaderboard])

  const summonLevel = getSummonLevel(state.highestLevelEver) + state.skills.summonBonus
  const summonCost = getSummonCost(summonLevel, getEquippedRelicEffects(state.relics).summonCostMultiplier)
  const canSummon = (state.equipped.some((book) => book === null) || state.books.length < INVENTORY_LIMIT) && state.gold >= summonCost

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
    nicknameSaved,
    offlineClaim,
    saveIndicator: saveIndicator.state,
    notify: addToast,
    summon,
    mergeBooks,
    swapBooks,
    autoMergeBooks,
    equipBook,
    unequipBook,
    upgradeSlot,
    allocateSkill,
    resetSkills,
    prestige,
    summonRelic,
    equipRelic,
    enterRift,
    exitRift,
    claimQuestReward,
    selectTrait,
    setAutoMerge,
    setAutoBuy,
    setNickname,
    submitLeaderboard,
    refreshLeaderboard,
    closeOfflineClaim,
  }
}

function currentLocalDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
