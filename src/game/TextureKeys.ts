import Phaser from "phaser"
import type { Element } from "../engine/types"
import type { PixelGlyph } from "./PixelGlyphs"

export const ElementColors: Record<Element, number> = {
  fire: 0xe25822,
  frost: 0x6ecbff,
  holy: 0xffd873,
}

export const MOB_KINDS = ["imp", "goblin", "skelet", "chort", "wogol", "orc_warrior"] as const
export const BOSS_KINDS = ["big_demon", "big_zombie", "ogre"] as const
export const TOME_ELEMENTS = ["fire", "frost", "holy"] as const

export type MobKind = (typeof MOB_KINDS)[number]
export type BossKind = (typeof BOSS_KINDS)[number]
export type ActorAction = "idle" | "run"

const ACTOR_FRAME_NUMBERS = [0, 1, 2, 3] as const
const WIZARD_FRAME_SIZE = { width: 231, height: 190 } as const
const WIZARD_FRAMES = {
  idle: 6,
  cast: 8,
  hit: 4,
  death: 7,
} as const
const VFX_PROJECTILE_FRAMES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
const VFX_EXPLOSION_FRAMES = [1, 2, 3, 4, 5, 6, 7] as const
const HOLY_FRAME_COUNT = 16
const FLOOR_TILES = ["floor_1", "floor_2", "floor_3", "floor_4", "floor_5", "floor_6", "floor_7", "floor_8"] as const

export const TextureKeys = {
  pixel: "battle:pixel",
  font: {
    dungeon: "DungeonFont",
  },
  wizard: {
    idle: "battle:wizard:idle",
    cast: "battle:wizard:cast",
    hit: "battle:wizard:hit",
    death: "battle:wizard:death",
  },
  tome: {
    fire: "battle:tome:fire",
    frost: "battle:tome:frost",
    holy: "battle:tome:holy",
  },
  vfx: {
    holy: "battle:vfx:holy",
  },
  tile: {
    floors: FLOOR_TILES.map((name) => `battle:tile:${name}`),
    wallMid: "battle:tile:wall_mid",
    wallTopLeft: "battle:tile:wall_top_left",
    wallTopMid: "battle:tile:wall_top_mid",
    wallTopRight: "battle:tile:wall_top_right",
  },
  sfx: {
    hit: "battle:sfx:hit",
    gold: "battle:sfx:gold",
    merge: "battle:sfx:merge",
    confirm: "battle:sfx:confirm",
    bossHit: "battle:sfx:boss-hit",
  },
  bgm: {
    dungeon: "battle:bgm:dungeon",
    boss: "battle:bgm:boss",
  },
  glyph(glyph: PixelGlyph): string {
    return `battle:glyph:${glyph}`
  },
  mob(kind: MobKind, action: ActorAction, frame: number): string {
    return `battle:mob:${kind}:${action}:${frame}`
  },
  boss(kind: BossKind, action: ActorAction, frame: number): string {
    return `battle:boss:${kind}:${action}:${frame}`
  },
  vfxFrame(kind: "fire" | "frost" | "explosion", frame: number): string {
    return `battle:vfx:${kind}:${frame}`
  },
} as const

export const AnimationKeys = {
  wizard: {
    idle: "battle:anim:wizard:idle",
    cast: "battle:anim:wizard:cast",
    hit: "battle:anim:wizard:hit",
    death: "battle:anim:wizard:death",
  },
  mob(kind: MobKind, action: ActorAction): string {
    return `battle:anim:mob:${kind}:${action}`
  },
  boss(kind: BossKind, action: ActorAction): string {
    return `battle:anim:boss:${kind}:${action}`
  },
  projectile: {
    fire: "battle:anim:projectile:fire",
    frost: "battle:anim:projectile:frost",
    holy: "battle:anim:projectile:holy",
  },
  impact: "battle:anim:impact:explosion",
} as const

export function preloadBattleAssets(scene: Phaser.Scene): void {
  scene.load.font(TextureKeys.font.dungeon, "/assets/fonts/DungeonFont.ttf", "truetype")
  scene.load.spritesheet(TextureKeys.wizard.idle, "/assets/wizard/idle.png", {
    frameWidth: WIZARD_FRAME_SIZE.width,
    frameHeight: WIZARD_FRAME_SIZE.height,
  })
  scene.load.spritesheet(TextureKeys.wizard.cast, "/assets/wizard/cast.png", {
    frameWidth: WIZARD_FRAME_SIZE.width,
    frameHeight: WIZARD_FRAME_SIZE.height,
  })
  scene.load.spritesheet(TextureKeys.wizard.hit, "/assets/wizard/hit.png", {
    frameWidth: WIZARD_FRAME_SIZE.width,
    frameHeight: WIZARD_FRAME_SIZE.height,
  })
  scene.load.spritesheet(TextureKeys.wizard.death, "/assets/wizard/death.png", {
    frameWidth: WIZARD_FRAME_SIZE.width,
    frameHeight: WIZARD_FRAME_SIZE.height,
  })

  for (const kind of MOB_KINDS) {
    loadActorFrames(scene, "mobs", kind, TextureKeys.mob)
  }

  for (const kind of BOSS_KINDS) {
    loadActorFrames(scene, "boss", kind, TextureKeys.boss)
  }

  for (const element of TOME_ELEMENTS) {
    scene.load.image(TextureKeys.tome[element], `/assets/tomes/${element}.png`)
  }

  for (const frame of VFX_PROJECTILE_FRAMES) {
    scene.load.image(TextureKeys.vfxFrame("fire", frame), `/assets/vfx/fire/${frameName(frame)}.png`)
    scene.load.image(TextureKeys.vfxFrame("frost", frame), `/assets/vfx/frost/${frameName(frame)}.png`)
  }

  for (const frame of VFX_EXPLOSION_FRAMES) {
    scene.load.image(TextureKeys.vfxFrame("explosion", frame), `/assets/vfx/explosion/${frameName(frame)}.png`)
  }

  scene.load.spritesheet(TextureKeys.vfx.holy, "/assets/vfx/holy/Holy%20VFX%2002.png", {
    frameWidth: 48,
    frameHeight: 48,
  })

  FLOOR_TILES.forEach((tileName, index) => {
    const tileKey = TextureKeys.tile.floors[index]
    if (tileKey !== undefined) {
      scene.load.image(tileKey, `/assets/tiles/${tileName}.png`)
    }
  })
  scene.load.image(TextureKeys.tile.wallMid, "/assets/tiles/wall_mid.png")
  scene.load.image(TextureKeys.tile.wallTopLeft, "/assets/tiles/wall_top_left.png")
  scene.load.image(TextureKeys.tile.wallTopMid, "/assets/tiles/wall_top_mid.png")
  scene.load.image(TextureKeys.tile.wallTopRight, "/assets/tiles/wall_top_right.png")

  scene.load.audio(TextureKeys.bgm.dungeon, "/assets/bgm/dungeon.mp3")
  scene.load.audio(TextureKeys.bgm.boss, "/assets/bgm/boss.mp3")
  scene.load.audio(TextureKeys.sfx.hit, "/assets/sfx/Hit%20damage%201.wav")
  scene.load.audio(TextureKeys.sfx.gold, "/assets/sfx/Fruit%20collect%201.wav")
  scene.load.audio(TextureKeys.sfx.merge, "/assets/sfx/Blow%201.wav")
  scene.load.audio(TextureKeys.sfx.confirm, "/assets/sfx/Confirm%201.wav")
  scene.load.audio(TextureKeys.sfx.bossHit, "/assets/sfx/Boss%20hit%201.wav")
}

export function createBattleAnimations(scene: Phaser.Scene): void {
  createAnimation(scene, AnimationKeys.wizard.idle, scene.anims.generateFrameNumbers(TextureKeys.wizard.idle, { start: 0, end: WIZARD_FRAMES.idle - 1 }), 8, -1)
  createAnimation(scene, AnimationKeys.wizard.cast, scene.anims.generateFrameNumbers(TextureKeys.wizard.cast, { start: 0, end: WIZARD_FRAMES.cast - 1 }), 18, 0)
  createAnimation(scene, AnimationKeys.wizard.hit, scene.anims.generateFrameNumbers(TextureKeys.wizard.hit, { start: 0, end: WIZARD_FRAMES.hit - 1 }), 14, 0)
  createAnimation(scene, AnimationKeys.wizard.death, scene.anims.generateFrameNumbers(TextureKeys.wizard.death, { start: 0, end: WIZARD_FRAMES.death - 1 }), 12, 0)

  for (const kind of MOB_KINDS) {
    createActorAnimation(scene, AnimationKeys.mob(kind, "idle"), TextureKeys.mob, kind, "idle", 6, -1)
    createActorAnimation(scene, AnimationKeys.mob(kind, "run"), TextureKeys.mob, kind, "run", 10, -1)
  }

  for (const kind of BOSS_KINDS) {
    createActorAnimation(scene, AnimationKeys.boss(kind, "idle"), TextureKeys.boss, kind, "idle", 5, -1)
    createActorAnimation(scene, AnimationKeys.boss(kind, "run"), TextureKeys.boss, kind, "run", 8, -1)
  }

  createAnimation(scene, AnimationKeys.projectile.fire, sequenceFrames(VFX_PROJECTILE_FRAMES.map((frame) => TextureKeys.vfxFrame("fire", frame))), 18, -1)
  createAnimation(scene, AnimationKeys.projectile.frost, sequenceFrames(VFX_PROJECTILE_FRAMES.map((frame) => TextureKeys.vfxFrame("frost", frame))), 18, -1)
  createAnimation(scene, AnimationKeys.projectile.holy, scene.anims.generateFrameNumbers(TextureKeys.vfx.holy, { start: 0, end: HOLY_FRAME_COUNT - 1 }), 18, -1)
  createAnimation(scene, AnimationKeys.impact, sequenceFrames(VFX_EXPLOSION_FRAMES.map((frame) => TextureKeys.vfxFrame("explosion", frame))), 20, 0)
}

export function getMobKindForStage(stage: number): MobKind {
  return MOB_KINDS[Math.max(0, stage - 1) % MOB_KINDS.length] ?? "imp"
}

export function getBossKindForStage(stage: number): BossKind {
  return BOSS_KINDS[Math.max(0, stage - 1) % BOSS_KINDS.length] ?? "big_demon"
}

function loadActorFrames<Kind extends string>(
  scene: Phaser.Scene,
  folder: "mobs" | "boss",
  kind: Kind,
  keyFor: (kind: Kind, action: ActorAction, frame: number) => string,
): void {
  for (const action of ["idle", "run"] as const) {
    for (const frame of ACTOR_FRAME_NUMBERS) {
      scene.load.image(keyFor(kind, action, frame), `/assets/${folder}/${kind}_${action}_anim_f${frame}.png`)
    }
  }
}

function createActorAnimation<Kind extends string>(
  scene: Phaser.Scene,
  key: string,
  keyFor: (kind: Kind, action: ActorAction, frame: number) => string,
  kind: Kind,
  action: ActorAction,
  frameRate: number,
  repeat: number,
): void {
  createAnimation(
    scene,
    key,
    sequenceFrames(ACTOR_FRAME_NUMBERS.map((frame) => keyFor(kind, action, frame))),
    frameRate,
    repeat,
  )
}

function createAnimation(
  scene: Phaser.Scene,
  key: string,
  frames: Phaser.Types.Animations.AnimationFrame[],
  frameRate: number,
  repeat: number,
): void {
  if (scene.anims.exists(key)) {
    return
  }

  scene.anims.create({
    key,
    frames,
    frameRate,
    repeat,
  })
}

function sequenceFrames(keys: readonly string[]): Phaser.Types.Animations.AnimationFrame[] {
  return keys.map((key) => ({ key }))
}

function frameName(frame: number): string {
  return `${frame}`.padStart(3, "0")
}
