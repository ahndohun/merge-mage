# Merge Mage Design System

## 1. Atmosphere & Identity

Merge Mage is a mobile-first pixel idle battler. The UI must read as a game
surface, not a web app: bitmap fonts, square pixel corners, hard 2px borders,
inset highlights, and block shadows. Large screens should feel like a wider
arcade cabinet: battle stage on the left, command sidepanel on the right, HUD
locked across the top.

## 2. Color

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Surface/base | --mm-bg | #100e14 | Page and empty slot base |
| Surface/ui | --mm-ui-bg | #1a1721 | HUD and panel backdrop |
| Surface/panel | --mm-panel | #241e2e | Cards, buttons, modal panels |
| Border/base | --mm-panel-edge | #4a3f63 | Pixel frame border |
| Border/highlight | --mm-panel-hi | #73648c | Inset frame highlight |
| Text/primary | --mm-ink | #e8e0d8 | Main UI text |
| Text/muted | --mm-muted | #9a8fa8 | Labels and disabled text |
| Accent/gold | --mm-gold | #e6b450 | Primary action, rewards |
| Accent/danger | --mm-danger | #c4344a | Errors, badge dots |
| Element/fire | --mm-fire | #e25822 | Fire books and resonance |
| Element/frost | --mm-frost | #6ecbff | Frost books and focus rings |
| Element/holy | --mm-holy | #ffd873 | Holy books and hints |
| Accent/good | --mm-good | #79c86a | XP and success states |
| Shadow | --mm-shadow | #08070a | Pixel drop shadows |

No CSS gradient backgrounds for primary UI. If depth is needed, use borders,
inset shadows, tint layers, sprites, or Phaser-rendered assets.

## 3. Typography

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| HUD number | 20-24px | 400 | 0.85-1 | 0 | Gold/stage/wave values |
| Panel label | 9-12px | 400 | 1.1-1.4 | 0-0.5px | Buttons and labels |
| Small copy | 8-10px | 400 | 1.1-1.5 | 0-0.5px | Quest, relic, status copy |
| Splash title | 30px | 400 | 1 | 0 | Preboot only |

Primary label font: `--mm-font-label` (Silkscreen, Galmuri9 fallback).
Numeric font: `--mm-font-numeric` (VT323, Galmuri9 fallback). DungeonFont is
only for the preboot title because it is not legible at panel sizes.

## 4. Spacing & Layout

Base unit: 4px. Borders are 2px. Pixel frames use `--mm-corners`.

| Breakpoint | Layout |
|------------|--------|
| <768px | Preserve the existing 390x844 mobile stack: battle top, bottom panel, controls, tabbar. |
| 768-1279px | Keep battle canvas centered at the top. Widen the overlay to tablet width; BOOKS splits equipment and inventory into two columns while tabbar remains bottom. |
| >=1280px | Two-column cabinet: top HUD full-width, battle host left, fixed 420px sidepanel right. RIFTS, toast, modal, and micro-toast surfaces move away from the sidepanel. |

The Phaser world remains 390x844 with `Scale.FIT` and integer `MAX_ZOOM` for
pixel stability. CSS controls the parent container; BattleLayout coordinates
remain deterministic.

## 5. Components

### GameShell
- Structure: Phaser host plus absolute React overlay.
- Mobile state: centered 390x844 viewport.
- Tablet state: centered battle host with a wider overlay panel below.
- Desktop state: CSS grid shell with left battle frame and right sidepanel.

### HudOverlay
- Top pixel frame, full overlay width.
- Desktop: spans the full cabinet width.

### Side/Bottom Overlay
- Mobile/tablet: bottom stack with tab content, hint, controls, tabbar.
- Desktop: fixed 420px sidepanel with the same children and tabbar.
- Surface: nine-slice-like square clip path, inset highlight, block shadow.

### BooksPanel
- Mobile: vertical stack.
- Tablet: two-column layout with equipment/resonance on the left and inventory/codex on the right.
- Desktop: compact sidepanel stack.

### Modals, Toasts, RIFTS
- Mobile: centered modal and in-canvas toast positions.
- Desktop: modal aligns near the sidepanel; RIFTS and toast surfaces sit left of the sidepanel so they do not cover tab content.

## 6. Motion & Interaction

Motion uses stepped or short transform/opacity effects: save flash, button press,
tutorial blink, drag feedback, merge/summon/upgrade juice. Do not animate layout
properties. Hover/active changes must communicate interactivity.

## 7. Depth & Surface

Depth strategy is pixel material: 2px borders, clip-path corners, inset highlight,
and 3-4px hard shadows. No rounded web cards, no soft glass, no decorative orbs,
and no emoji icons.
