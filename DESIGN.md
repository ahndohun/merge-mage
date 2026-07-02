# Merge Mage Design System

## 1. Atmosphere & Identity

This scaffold is a neutral technical shell for a later pixel-art game interface. The current signature is only the centered canvas plus a minimal HUD overlay; final art direction is deferred to the asset pass in the product spec.

## 2. Color

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Surface/base | --surface-base | #05060A | Page background |
| Surface/game | --surface-game | #0B0D13 | Phaser scene background |
| Surface/hud | --surface-hud | rgba(0, 0, 0, 0.35) | Placeholder HUD bar |
| Text/primary | --text-primary | #F7F7FF | Placeholder text |

## 3. Typography

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | 32px | 700 | 1.2 | 0 | Phaser title placeholder |
| Caption | 12px | 600 | 1.4 | 0 | HUD placeholder labels |

Primary: monospace fallback only until bitmap font assets are selected.

## 4. Spacing & Layout

Base unit: 4px. The canvas targets 390x844 and centers on larger screens.

| Token | Value | Usage |
|-------|-------|-------|
| --space-3 | 12px | HUD horizontal padding |
| --hud-height | 48px | Placeholder HUD height |

## 5. Components

### GameShell
- Structure: centered Phaser host with absolute React overlay.
- States: default only.
- Accessibility: page owns the document title; game accessibility pass comes later.
- Motion: Phaser scene owns the render-loop proof tween.

### HudOverlay
- Structure: one top bar with three placeholder readouts.
- States: default only.
- Accessibility: readouts are plain text.
- Motion: none.

## 6. Motion & Interaction

Only the Phaser text tween is present in this skeleton to prove the engine render loop is active.

## 7. Depth & Surface

Strategy: flat placeholder surfaces. Pixel-art frames and nine-slice depth are deferred to the art implementation pass.
