export const LOCALES = ["en", "ko"] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_STORAGE_KEY = "merge-mage:locale"

const enMessages = {
  appTitle: "MERGE MAGE",
  documentTitle: "Merge Mage — retro idle spellbook battler",
  loading: "loading...",
  tabBooks: "BOOKS",
  tabSkills: "SKILLS",
  tabRebirth: "REBIRTH",
  tabRanks: "RANKS",
  autoMerge: "AUTO MERGE",
  autoBuy: "AUTO BUY",
  gold: "GOLD",
  stage: "STAGE",
  mana: "MANA",
  manaCrystals: "MANA CRYSTALS",
  saved: "SAVED",
  offline: "OFFLINE",
  howToPlay: "HOW TO PLAY",
  openSettings: "Open settings",
  settings: "Settings",
  language: "LANGUAGE",
  tapAgainToWipe: "TAP AGAIN TO WIPE",
  newGame: "NEW GAME",
  credits: "Credits",
  skip: "SKIP",
  close: "CLOSE",
  claim: "CLAIM",
  offlineClaim: "OFFLINE CLAIM",
  inventoryEmptyAutoEquip: "INVENTORY — empty (summons auto-equip)",
  slot: "SLOT",
  up: "UP",
  skillPoints: "SKILL POINTS",
  skillSummonFloor: "SUMMON FLOOR",
  skillCastSpeed: "CAST SPEED",
  skillGoldGain: "GOLD GAIN",
  skillCritChance: "CRIT CHANCE",
  skillEmpty: "Level up your wizard (kill things) to earn skill points",
  reset: "RESET",
  arcaneRebirth: "ARCANE REBIRTH",
  rebirth: "REBIRTH",
  rebirthKeep: "KEEP: skills, wizard level",
  rebirthReset: "RESET: stage, gold, books",
  confirm: "CONFIRM",
  cancel: "CANCEL",
  ranksLoading: "LOADING",
  ranksOffline: "RANKS OFFLINE",
  ranksError: "RANKS ERROR",
  noRanksYet: "No ranks yet — set a nickname and be first",
  save: "SAVE",
  refreshShort: "R",
  fire: "FIRE",
  frost: "FROST",
  holy: "HOLY",
  elements: "ELEMENTS",
  helpLoopSummon: "SUMMON",
  helpLoopAutoEquip: "books AUTO-EQUIP",
  helpLoopMerge: "MERGE same levels (tap-tap)",
  helpLoopDamage: "higher level = more damage",
  helpLoopBoss: "beat the BOSS every 10 waves",
  helpLoopRebirth: "REBIRTH at stage 10+ for permanent power",
  fireDesc: "hits 3 enemies",
  frostDesc: "slows",
  holyDesc: "x2 vs bosses",
  helpMergeTargetNote: "Merging keeps the element of the TARGET book (the second one you tap).",
  helpOfflineNote: "You earn gold while away (up to 8h).",
  replayTutorial: "REPLAY TUTORIAL",
  tutorialSummon: "Tap SUMMON to arm your first spellbook",
  tutorialFight: "Your books fight for you. Summon more!",
  tutorialMerge: "Tap one book, then another of the same level to MERGE — works in slots too",
  hintSummonFirst: "Tap SUMMON to arm your first spellbook",
  hintMergePair: "Tap a book, then another of the same level — works in slots too",
  hintEquipEmptySlot: "Tap a book, then an empty slot to equip",
  hintBossHoly: "Boss! Holy books deal double damage",
  hintRebirthUnlocked: "REBIRTH is unlocked — permanent power",
  toastTutorialComplete: "You know everything. Ascend!",
  toastLevelsMustMatch: "Levels must match",
  toastInventoryFull: "Inventory full",
  toastNotEnoughGold: "Not enough gold",
  toastSummonLevelUp: "Summon level up!",
  toastRebirthComplete: "Rebirth complete.",
  toastCloudSaveUnavailable: "Cloud save unavailable; local save active.",
  battleLoading: "LOADING",
  battleWaveClear: "WAVE CLEAR",
  battleBoss: "BOSS",
  battleLevelUp: "LEVEL UP",
} as const

export type MessageKey = keyof typeof enMessages

const en: Record<MessageKey, string> = enMessages

const ko: Record<MessageKey, string> = {
  appTitle: "MERGE MAGE",
  documentTitle: "Merge Mage - 레트로 방치형 마법서 전투",
  loading: "불러오는 중...",
  tabBooks: "마법서",
  tabSkills: "스킬",
  tabRebirth: "환생",
  tabRanks: "랭킹",
  autoMerge: "자동 합성",
  autoBuy: "자동 구매",
  gold: "골드",
  stage: "스테이지",
  mana: "마나",
  manaCrystals: "마나 크리스탈",
  saved: "저장됨",
  offline: "오프라인",
  howToPlay: "게임 방법",
  openSettings: "설정 열기",
  settings: "설정",
  language: "언어",
  tapAgainToWipe: "한 번 더 눌러 초기화",
  newGame: "새 게임",
  credits: "크레딧",
  skip: "넘기기",
  close: "닫기",
  claim: "받기",
  offlineClaim: "오프라인 보상",
  inventoryEmptyAutoEquip: "가방 비어 있음 - 소환하면 자동 장착",
  slot: "슬롯",
  up: "강화",
  skillPoints: "스킬 포인트",
  skillSummonFloor: "소환 최소 레벨",
  skillCastSpeed: "시전 속도",
  skillGoldGain: "골드 획득",
  skillCritChance: "치명타 확률",
  skillEmpty: "마법사가 레벨업하면 스킬 포인트를 얻어요",
  reset: "초기화",
  arcaneRebirth: "비전 환생",
  rebirth: "환생",
  rebirthKeep: "유지: 스킬·마법사 레벨",
  rebirthReset: "리셋: 스테이지·골드·마법서",
  confirm: "확인",
  cancel: "취소",
  ranksLoading: "불러오는 중",
  ranksOffline: "랭킹 오프라인",
  ranksError: "랭킹 오류",
  noRanksYet: "아직 랭킹이 없어요 - 닉네임을 정하고 1등이 되세요",
  save: "저장",
  refreshShort: "새로고침",
  fire: "화염",
  frost: "냉기",
  holy: "신성",
  elements: "원소",
  helpLoopSummon: "소환",
  helpLoopAutoEquip: "마법서는 자동 장착돼요",
  helpLoopMerge: "같은 레벨을 탭해 합성",
  helpLoopDamage: "레벨이 높을수록 더 강해요",
  helpLoopBoss: "10웨이브마다 보스를 쓰러뜨려요",
  helpLoopRebirth: "스테이지 10부터 환생으로 영구 강화",
  fireDesc: "적 3명을 때려요",
  frostDesc: "느리게 해요",
  holyDesc: "보스에게 2배",
  helpMergeTargetNote: "합성하면 두 번째로 탭한 마법서의 원소가 남아요.",
  helpOfflineNote: "접속하지 않아도 최대 8시간까지 골드를 벌어요.",
  replayTutorial: "튜토리얼 다시 보기",
  tutorialSummon: "소환을 눌러 첫 마법서를 장착해 보세요",
  tutorialFight: "마법서가 대신 싸워요. 더 소환해 보세요!",
  tutorialMerge: "같은 레벨 마법서 두 권을 차례로 탭하면 합성돼요. 슬롯에서도 돼요",
  hintSummonFirst: "소환을 눌러 첫 마법서를 장착해 보세요",
  hintMergePair: "같은 레벨 마법서 두 권을 차례로 탭해 합성해요",
  hintEquipEmptySlot: "마법서를 탭하고 빈 슬롯을 탭하면 장착돼요",
  hintBossHoly: "보스! 신성 마법서는 피해가 2배예요",
  hintRebirthUnlocked: "환생 해금 - 영구 강화가 가능해요",
  toastTutorialComplete: "이제 다 배웠어요. 정상까지 올라가 보세요!",
  toastLevelsMustMatch: "같은 레벨만 합성돼요",
  toastInventoryFull: "가방이 가득 찼어요",
  toastNotEnoughGold: "골드 부족",
  toastSummonLevelUp: "소환 레벨 업!",
  toastRebirthComplete: "환생 완료!",
  toastCloudSaveUnavailable: "클라우드 저장 불가. 로컬 저장 중이에요.",
  battleLoading: "불러오는 중",
  battleWaveClear: "웨이브 클리어",
  battleBoss: "보스",
  battleLevelUp: "레벨 업",
}

export const messages: Record<Locale, Record<MessageKey, string>> = { en, ko }

type TemplateSet = {
  readonly mergedLv: (level: number) => string
  readonly summonButton: (level: number, cost: string) => string
  readonly wizardLevel: (level: number) => string
  readonly levelBadge: (level: number) => string
  readonly slotUpgrade: (cost: string, bonusPercent: number) => string
  readonly skillSummonBonusEffect: (points: number) => string
  readonly skillCastSpeedEffect: (reductionMs: number, nowMs: number) => string
  readonly skillGoldGainEffect: (gainPercent: number, currentPercent: number) => string
  readonly skillCritChanceEffect: (gainPercent: number, currentPercent: number) => string
  readonly rebirthPreview: (manaCrystals: number) => string
  readonly rebirthGain: (manaCrystals: number, damagePercentPerCrystal: number) => string
  readonly rebirthUnlock: (stage: number) => string
  readonly rankStage: (stage: number) => string
  readonly saveFailed: (message: string) => string
  readonly soundState: (muted: boolean) => string
  readonly battleStageWave: (stage: number, wave: number, bossWave: number) => string
  readonly battleStage: (stage: number) => string
  readonly battleBossDown: (gold: number) => string
  readonly battleStageWaveReset: (stage: number) => string
  readonly battleWaveIndicator: (wave: number, bossWave: number) => string
}

export type Translator = ((key: MessageKey) => string) & TemplateSet & {
  readonly locale: Locale
}

const templates: Record<Locale, TemplateSet> = {
  en: {
    mergedLv: (level) => `MERGED! Lv ${level}`,
    summonButton: (level, cost) => `SUMMON L${level} ${cost}`,
    wizardLevel: (level) => `WIZARD ${level}`,
    levelBadge: (level) => `Lv${level}`,
    slotUpgrade: (cost, bonusPercent) => `UP ${cost} (+${bonusPercent}%)`,
    skillSummonBonusEffect: (points) => `+1 summon level / pt (+${points})`,
    skillCastSpeedEffect: (reductionMs, nowMs) => `-${reductionMs}ms cast / pt (now ${nowMs}ms)`,
    skillGoldGainEffect: (gainPercent, currentPercent) => `+${gainPercent}% gold / pt (+${currentPercent}%)`,
    skillCritChanceEffect: (gainPercent, currentPercent) => `+${gainPercent}% crit / pt (${currentPercent}%)`,
    rebirthPreview: (manaCrystals) => `${manaCrystals} MC`,
    rebirthGain: (manaCrystals, damagePercentPerCrystal) => `GAIN: +${manaCrystals} MC (each = +${damagePercentPerCrystal}% damage, forever)`,
    rebirthUnlock: (stage) => `Unlocks at stage 10 (now: ${stage})`,
    rankStage: (stage) => `ST ${stage}`,
    saveFailed: (message) => `Save failed: ${message}`,
    soundState: (muted) => `SOUND ${muted ? "OFF" : "ON"}`,
    battleStageWave: (stage, wave, bossWave) => `STAGE ${stage} — WAVE ${wave}/${bossWave}`,
    battleStage: (stage) => `STAGE ${stage}`,
    battleBossDown: (gold) => `BOSS DOWN +${gold}`,
    battleStageWaveReset: (stage) => `STAGE ${stage} — WAVE RESET`,
    battleWaveIndicator: (wave, bossWave) => `W ${wave}/${bossWave}`,
  },
  ko: {
    mergedLv: (level) => `합성! Lv ${level}`,
    summonButton: (level, cost) => `소환 L${level} ${cost}`,
    wizardLevel: (level) => `마법사 ${level}`,
    levelBadge: (level) => `Lv${level}`,
    slotUpgrade: (cost, bonusPercent) => `강화 ${cost} (+${bonusPercent}%)`,
    skillSummonBonusEffect: (points) => `소환 레벨 +1 / pt (+${points})`,
    skillCastSpeedEffect: (reductionMs, nowMs) => `시전 ${reductionMs}ms 단축 / pt (현재 ${nowMs}ms)`,
    skillGoldGainEffect: (gainPercent, currentPercent) => `골드 +${gainPercent}% / pt (+${currentPercent}%)`,
    skillCritChanceEffect: (gainPercent, currentPercent) => `치명타 +${gainPercent}% / pt (${currentPercent}%)`,
    rebirthPreview: (manaCrystals) => `${manaCrystals} MC`,
    rebirthGain: (manaCrystals, damagePercentPerCrystal) => `획득: +${manaCrystals} MC (1개당 피해 +${damagePercentPerCrystal}% 영구)`,
    rebirthUnlock: (stage) => `스테이지 10에서 해금 (현재: ${stage})`,
    rankStage: (stage) => `스테이지 ${stage}`,
    saveFailed: (message) => `저장 실패: ${message}`,
    soundState: (muted) => `사운드 ${muted ? "끔" : "켬"}`,
    battleStageWave: (stage, wave, bossWave) => `스테이지 ${stage} - 웨이브 ${wave}/${bossWave}`,
    battleStage: (stage) => `스테이지 ${stage}`,
    battleBossDown: (gold) => `보스 처치 +${gold}`,
    battleStageWaveReset: (stage) => `스테이지 ${stage} - 웨이브 리셋`,
    battleWaveIndicator: (wave, bossWave) => `웨이브 ${wave}/${bossWave}`,
  },
}

export function createTranslator(locale: Locale): Translator {
  return Object.assign((key: MessageKey) => messages[locale][key], { locale, ...templates[locale] })
}

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale === value)
}

export function detectNavigatorLocale(language: string | null | undefined): Locale {
  return language?.toLowerCase().startsWith("ko") === true ? "ko" : "en"
}

export function resolveLocale(input: {
  readonly storedLocale?: string | null
  readonly navigatorLanguage?: string | null
} = {}): Locale {
  const storedLocale = input.storedLocale ?? null
  if (storedLocale !== null && isLocale(storedLocale)) {
    return storedLocale
  }
  return detectNavigatorLocale(input.navigatorLanguage)
}

export function readStoredLocale(): Locale | null {
  const value = getStorage()?.getItem(LOCALE_STORAGE_KEY)
  return value !== undefined && value !== null && isLocale(value) ? value : null
}

export function getInitialLocale(): Locale {
  // ?fresh=1 pins English at the source. engineStorage also writes the
  // override, but that runs after LocaleProvider has already read the locale
  // (React init order), so a pre-existing ko override would win the race and
  // break E2E determinism.
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("fresh")) {
    writeLocaleOverride("en")
    return "en"
  }
  return resolveLocale({
    storedLocale: readStoredLocale(),
    navigatorLanguage: getNavigatorLanguage(),
  })
}

export function writeLocaleOverride(locale: Locale): void {
  getStorage()?.setItem(LOCALE_STORAGE_KEY, locale)
}

function getNavigatorLanguage(): string | null {
  return typeof navigator === "undefined" ? null : navigator.language
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
