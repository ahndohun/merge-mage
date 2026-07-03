export const LOCALES = ["en", "ko"] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_STORAGE_KEY = "merge-mage:locale"

const enMessages = {
  appTitle: "MERGE MAGE",
  documentTitle: "Merge Mage — retro idle spellbook battler",
  loading: "loading...",
  tabBooks: "BOOKS",
  tabSkills: "SKILLS",
  tabQuests: "QUESTS",
  tabRebirth: "REBIRTH",
  tabRanks: "RANKS",
  relics: "RELICS",
  rifts: "RIFTS",
  questsComingSoon: "Coming soon",
  questsLockedTooltip: "Coming soon",
  subBooks: "TOMES",
  subCodex: "CODEX",
  mainQuest: "MAIN CHAIN",
  longQuest: "LONG OATHS",
  achievements: "ACHIEVEMENTS",
  reward: "REWARD",
  claimed: "CLAIMED",
  ready: "READY",
  locked: "LOCKED",
  traits: "TRAITS",
  selected: "SELECTED",
  resonance: "RESONANCE",
  respecReady: "RESPEC READY",
  nextGoal: "NEXT GOAL",
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
  relicCurrencyHint: "Mana Crystals fuel rebirth power and relic summons.",
  relicSummon: "SUMMON RELIC",
  relicOwned: "OWNED RELICS",
  relicEquipped: "EQUIPPED RELICS",
  relicEmpty: "No relics yet",
  relicSlotEmpty: "EMPTY",
  riftGolden: "GOLDEN RIFT",
  riftTrial: "TRIAL RIFT",
  riftGoldenDesc: "3:00 gold rush",
  riftTrialDesc: "5 boss trial",
  riftEnter: "ENTER",
  riftExit: "EXIT",
  riftRemaining: "LEFT",
  riftStep: "STEP",
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
  toastRelicSummoned: "Relic awakened.",
  toastRiftBlocked: "Rift unavailable.",
  toastRiftComplete: "Rift settled.",
  toastQuestClaimed: "Quest reward claimed.",
  toastLeaderboardSaved: "Nickname saved to the leaderboard!",
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
  tabQuests: "퀘스트",
  tabRebirth: "환생",
  tabRanks: "랭킹",
  relics: "유물",
  rifts: "균열",
  questsComingSoon: "곧 열림",
  questsLockedTooltip: "곧 열림",
  subBooks: "마법서",
  subCodex: "도감",
  mainQuest: "메인 연쇄",
  longQuest: "장기 맹세",
  achievements: "업적",
  reward: "보상",
  claimed: "받음",
  ready: "완료",
  locked: "잠김",
  traits: "특성",
  selected: "선택됨",
  resonance: "공명",
  respecReady: "재선택 가능",
  nextGoal: "다음 목표",
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
  relicCurrencyHint: "마나 크리스탈은 환생 강화와 유물 소환에 쓰는 재화예요.",
  relicSummon: "유물 소환",
  relicOwned: "보유 유물",
  relicEquipped: "장착 유물",
  relicEmpty: "아직 유물이 없어요",
  relicSlotEmpty: "비어 있음",
  riftGolden: "황금 균열",
  riftTrial: "시험의 균열",
  riftGoldenDesc: "3분 골드 러시",
  riftTrialDesc: "보스 5연전",
  riftEnter: "입장",
  riftExit: "종료",
  riftRemaining: "남은 시간",
  riftStep: "단계",
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
  toastRelicSummoned: "유물이 깨어났어요.",
  toastRiftBlocked: "균열에 입장할 수 없어요.",
  toastRiftComplete: "균열 정산 완료.",
  toastQuestClaimed: "퀘스트 보상 획득!",
  toastLeaderboardSaved: "리더보드에 닉네임을 저장했어요!",
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
  readonly relicLevel: (level: number) => string
  readonly relicSummonCost: (cost: number) => string
  readonly riftRunsLeft: (left: number) => string
  readonly riftTimer: (seconds: number) => string
  readonly riftTrialStep: (step: number, total: number) => string
  readonly rankStage: (stage: number) => string
  readonly saveFailed: (message: string) => string
  readonly soundState: (muted: boolean) => string
  readonly battleStageWave: (stage: number, wave: number, bossWave: number) => string
  readonly battleStage: (stage: number) => string
  readonly battleBossDown: (gold: number) => string
  readonly battleStageWaveReset: (stage: number) => string
  readonly battleWaveIndicator: (wave: number, bossWave: number) => string
  readonly questTitle: (id: string) => string
  readonly questDescription: (id: string) => string
  readonly achievementTitle: (counter: string, threshold: number) => string
  readonly achievementProgress: (current: number, threshold: number) => string
  readonly rewardLine: (gold: number, skillPoints: number) => string
  readonly codexTier: (tier: number, bonusPercent: number) => string
  readonly traitTitle: (id: string) => string
  readonly traitDescription: (id: string) => string
  readonly traitUnlock: (level: number) => string
  readonly resonanceBadge: (element: string, count: number, requirement: number) => string
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
    relicLevel: (level) => `Lv${level}`,
    relicSummonCost: (cost) => `${cost} MC`,
    riftRunsLeft: (left) => `${left}/2 left`,
    riftTimer: (seconds) => `${seconds}s`,
    riftTrialStep: (step, total) => `${step}/${total}`,
    rankStage: (stage) => `ST ${stage}`,
    saveFailed: (message) => `Save failed: ${message}`,
    soundState: (muted) => `SOUND ${muted ? "OFF" : "ON"}`,
    battleStageWave: (stage, wave, bossWave) => `STAGE ${stage} — WAVE ${wave}/${bossWave}`,
    battleStage: (stage) => `STAGE ${stage}`,
    battleBossDown: (gold) => `BOSS DOWN +${gold}`,
    battleStageWaveReset: (stage) => `STAGE ${stage} — WAVE RESET`,
    battleWaveIndicator: (wave, bossWave) => `W ${wave}/${bossWave}`,
    questTitle: (id) => enQuestText[id]?.title ?? id.toUpperCase(),
    questDescription: (id) => enQuestText[id]?.description ?? "Arcane work awaits.",
    achievementTitle: (counter, threshold) => `${enCounterText[counter] ?? counter} ${threshold}`,
    achievementProgress: (current, threshold) => `${Math.min(current, threshold)}/${threshold}`,
    rewardLine: (gold, skillPoints) => `+${gold} gold${skillPoints > 0 ? `, +${skillPoints} SP` : ""}`,
    codexTier: (tier, bonusPercent) => `T${tier} +${bonusPercent}%`,
    traitTitle: (id) => enTraitText[id]?.title ?? id,
    traitDescription: (id) => enTraitText[id]?.description ?? "A sealed arcane path.",
    traitUnlock: (level) => `Wizard Lv${level}`,
    resonanceBadge: (element, count, requirement) => `${element.toUpperCase()} ${count}/${requirement}`,
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
    relicLevel: (level) => `Lv${level}`,
    relicSummonCost: (cost) => `${cost} MC`,
    riftRunsLeft: (left) => `${left}/2 남음`,
    riftTimer: (seconds) => `${seconds}초`,
    riftTrialStep: (step, total) => `${step}/${total}`,
    rankStage: (stage) => `스테이지 ${stage}`,
    saveFailed: (message) => `저장 실패: ${message}`,
    soundState: (muted) => `사운드 ${muted ? "끔" : "켬"}`,
    battleStageWave: (stage, wave, bossWave) => `스테이지 ${stage} - 웨이브 ${wave}/${bossWave}`,
    battleStage: (stage) => `스테이지 ${stage}`,
    battleBossDown: (gold) => `보스 처치 +${gold}`,
    battleStageWaveReset: (stage) => `스테이지 ${stage} - 웨이브 리셋`,
    battleWaveIndicator: (wave, bossWave) => `웨이브 ${wave}/${bossWave}`,
    questTitle: (id) => koQuestText[id]?.title ?? id,
    questDescription: (id) => koQuestText[id]?.description ?? "비전의 과제가 기다려요.",
    achievementTitle: (counter, threshold) => `${koCounterText[counter] ?? counter} ${threshold}`,
    achievementProgress: (current, threshold) => `${Math.min(current, threshold)}/${threshold}`,
    rewardLine: (gold, skillPoints) => `골드 +${gold}${skillPoints > 0 ? `, SP +${skillPoints}` : ""}`,
    codexTier: (tier, bonusPercent) => `T${tier} +${bonusPercent}%`,
    traitTitle: (id) => koTraitText[id]?.title ?? id,
    traitDescription: (id) => koTraitText[id]?.description ?? "봉인된 비전 특성입니다.",
    traitUnlock: (level) => `마법사 Lv${level}`,
    resonanceBadge: (element, count, requirement) => `${element} ${count}/${requirement}`,
  },
}

const enCounterText: Record<string, string> = {
  mergesTotal: "Merges",
  bossKills: "Boss kills",
  summonsTotal: "Summons",
  rebirths: "Rebirths",
  questsClaimed: "Quest claims",
  highestLevelEver: "Highest tome",
  stagesReached: "Stage",
  codexCells: "Codex cells",
  killsTotal: "Kills",
}

const koCounterText: Record<string, string> = {
  mergesTotal: "합성",
  bossKills: "보스 처치",
  summonsTotal: "소환",
  rebirths: "환생",
  questsClaimed: "퀘스트 수령",
  highestLevelEver: "최고 마법서",
  stagesReached: "스테이지",
  codexCells: "도감 칸",
  killsTotal: "처치",
}

const enTraitText: Record<string, { readonly title: string; readonly description: string }> = {
  chainCast: { title: "Chain Cast", description: "After a cast, the next spell rhythm runs 20% faster." },
  goldenLibrary: { title: "Golden Library", description: "Gold rewards rise by 15%." },
  elementalCycle: { title: "Elemental Cycle", description: "Resonance awakens with 2 matching tomes." },
  pyroGlyphs: { title: "Pyro Glyphs", description: "Fire tome damage rises by 20%." },
  deepFreeze: { title: "Deep Freeze", description: "Frost slow bites harder and lasts longer." },
  sanctifiedAim: { title: "Sanctified Aim", description: "Holy boss damage gains another 25%." },
  archmageFocus: { title: "Archmage Focus", description: "Each codex tier adds 1% more elemental damage." },
  quickHands: { title: "Quick Hands", description: "All tome casting is 10% faster." },
  treasureOath: { title: "Treasure Oath", description: "Gold rewards rise by 25%." },
}

const koTraitText: Record<string, { readonly title: string; readonly description: string }> = {
  chainCast: { title: "연쇄 시전", description: "시전 뒤 다음 주문 박자가 20% 빨라집니다." },
  goldenLibrary: { title: "황금 서고", description: "골드 보상이 15% 증가합니다." },
  elementalCycle: { title: "원소 순환", description: "같은 원소 2권만으로 공명이 깨어납니다." },
  pyroGlyphs: { title: "화염 문양", description: "화염 마법서 피해가 20% 증가합니다." },
  deepFreeze: { title: "심층 결빙", description: "냉기 둔화가 더 강하고 오래 지속됩니다." },
  sanctifiedAim: { title: "성화 조준", description: "신성 보스 피해가 추가로 25% 증가합니다." },
  archmageFocus: { title: "대마법사 집중", description: "도감 티어마다 원소 피해가 1% 더 증가합니다." },
  quickHands: { title: "재빠른 손", description: "모든 마법서 시전이 10% 빨라집니다." },
  treasureOath: { title: "보물 맹세", description: "골드 보상이 25% 증가합니다." },
}

const enQuestText: Record<string, { readonly title: string; readonly description: string }> = {
  "chain-01": { title: "Bind the First Tome", description: "Summon or equip any spellbook." },
  "chain-02": { title: "Ink into Power", description: "Merge your first matching pair." },
  "chain-03": { title: "Third Seal", description: "Reach a Lv3 tome." },
  "chain-04": { title: "Circle of Three", description: "Equip three tomes at once." },
  "chain-05": { title: "Apprentice Shelf", description: "Reach a Lv5 tome." },
  "chain-06": { title: "Break the Gate", description: "Defeat your first boss gate." },
  "chain-07": { title: "Spend the Spark", description: "Earn or spend a skill point." },
  "chain-08": { title: "First Specialization", description: "Choose a Lv8 arcane trait." },
  "chain-09": { title: "Full Orbit", description: "Fill all six equipped slots." },
  "chain-10": { title: "Tiered Flame", description: "Reach a Lv10 tome." },
  "chain-11": { title: "Arcane Rebirth", description: "Rebirth once." },
  "chain-12": { title: "Five Grimoire Marks", description: "Unlock five codex cells." },
  "chain-13": { title: "Fifteenth Stair", description: "Reach stage 15." },
  "chain-14": { title: "Second Ash", description: "Rebirth twice." },
  "chain-15": { title: "Deep Shelf", description: "Reach a Lv20 tome." },
  "chain-16": { title: "Adept Vow", description: "Choose a Lv16 arcane trait." },
  "chain-17": { title: "Boss Ledger", description: "Defeat 25 bosses." },
  "chain-18": { title: "Stage 25 Gate", description: "Reach stage 25." },
  "chain-19": { title: "Archmage Vow", description: "Choose a Lv24 arcane trait." },
  "chain-20": { title: "Triple Rebirth", description: "Rebirth three times." },
  "long-stage-25": { title: "Oath: Stage 25", description: "Hold the line at stage 25." },
  "long-stage-50": { title: "Oath: Stage 50", description: "Climb to stage 50." },
  "long-stage-75": { title: "Oath: Stage 75", description: "Climb to stage 75." },
  "long-stage-100": { title: "Oath: Stage 100", description: "Climb to stage 100." },
  "long-rebirth-3": { title: "Oath: Three Rebirths", description: "Rebirth three times." },
  "long-rebirth-10": { title: "Oath: Ten Rebirths", description: "Rebirth ten times." },
  "long-relics-5": { title: "Oath: Five Relics", description: "Own five relic types." },
  "long-codex-15": { title: "Oath: Fifteen Marks", description: "Unlock 15 codex cells." },
  "long-codex-30": { title: "Oath: Full Grimoire", description: "Unlock all 30 codex cells." },
  "long-level-50": { title: "Oath: Lv50 Tome", description: "Reach a Lv50 tome." },
}

const koQuestText: Record<string, { readonly title: string; readonly description: string }> = {
  "chain-01": { title: "첫 마법서 결속", description: "아무 마법서나 소환하거나 장착하세요." },
  "chain-02": { title: "잉크를 힘으로", description: "첫 같은 레벨 쌍을 합성하세요." },
  "chain-03": { title: "세 번째 봉인", description: "Lv3 마법서에 도달하세요." },
  "chain-04": { title: "세 권의 원", description: "마법서 세 권을 동시에 장착하세요." },
  "chain-05": { title: "견습 서가", description: "Lv5 마법서에 도달하세요." },
  "chain-06": { title: "관문 돌파", description: "첫 보스 관문을 넘으세요." },
  "chain-07": { title: "불씨 사용", description: "스킬 포인트를 얻거나 사용하세요." },
  "chain-08": { title: "첫 특화", description: "Lv8 비전 특성을 선택하세요." },
  "chain-09": { title: "완전한 궤도", description: "장착 슬롯 6개를 모두 채우세요." },
  "chain-10": { title: "티어의 불꽃", description: "Lv10 마법서에 도달하세요." },
  "chain-11": { title: "비전 환생", description: "한 번 환생하세요." },
  "chain-12": { title: "도감 표식 다섯", description: "도감 5칸을 해금하세요." },
  "chain-13": { title: "열다섯 번째 계단", description: "스테이지 15에 도달하세요." },
  "chain-14": { title: "두 번째 재", description: "두 번 환생하세요." },
  "chain-15": { title: "깊은 서가", description: "Lv20 마법서에 도달하세요." },
  "chain-16": { title: "숙련자의 맹세", description: "Lv16 비전 특성을 선택하세요." },
  "chain-17": { title: "보스 장부", description: "보스 25마리를 처치하세요." },
  "chain-18": { title: "스테이지 25 관문", description: "스테이지 25에 도달하세요." },
  "chain-19": { title: "대마법사의 맹세", description: "Lv24 비전 특성을 선택하세요." },
  "chain-20": { title: "세 번의 환생", description: "세 번 환생하세요." },
  "long-stage-25": { title: "맹세: 스테이지 25", description: "스테이지 25에 도달하세요." },
  "long-stage-50": { title: "맹세: 스테이지 50", description: "스테이지 50에 도달하세요." },
  "long-stage-75": { title: "맹세: 스테이지 75", description: "스테이지 75에 도달하세요." },
  "long-stage-100": { title: "맹세: 스테이지 100", description: "스테이지 100에 도달하세요." },
  "long-rebirth-3": { title: "맹세: 환생 3회", description: "세 번 환생하세요." },
  "long-rebirth-10": { title: "맹세: 환생 10회", description: "열 번 환생하세요." },
  "long-relics-5": { title: "맹세: 유물 5종", description: "유물 5종을 보유하세요." },
  "long-codex-15": { title: "맹세: 표식 15개", description: "도감 15칸을 해금하세요." },
  "long-codex-30": { title: "맹세: 완전한 도감", description: "도감 30칸을 모두 해금하세요." },
  "long-level-50": { title: "맹세: Lv50 마법서", description: "Lv50 마법서에 도달하세요." },
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
