import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { describe, expect, it } from "vitest"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const read = (relativePath: string): string => readFileSync(resolve(projectRoot, relativePath), "utf8")

/**
 * Guards the Phaser scale conventions. The 2026-07-04 audit found the desktop
 * layout was fighting the ScaleManager with CSS (`.phaser-host canvas { width…
 * !important }`) instead of letting Phaser FIT the canvas to a sized host. These
 * tests fail the build if that class of anti-pattern returns.
 *
 * Canon: ~/projects/phaser-skills/scale-and-responsive/SKILL.md
 * (Gotcha 3: the ScaleManager owns canvas.style width/height/margin.)
 */
describe("Phaser scale conventions", () => {
  it("never sizes the phaser canvas from CSS (scale Gotcha 3)", () => {
    for (const cssPath of ["src/styles.css", "src/ui/overlay.css"]) {
      const css = read(cssPath)
      for (const match of css.matchAll(/canvas\s*\{([^}]*)\}/g)) {
        const body = match[1] ?? ""
        expect(
          body,
          `${cssPath}: a 'canvas' rule sets width/height/margin — the ScaleManager owns those (scale-and-responsive Gotcha 3). Size .phaser-host and let Phaser FIT instead.`,
        ).not.toMatch(/\b(width|height|margin)\s*:/)
      }
    }
  })

  it("createGame keeps FIT scaling and does not disable expandParent", () => {
    const src = read("src/game/createGame.ts")
    expect(src).toMatch(/Phaser\.Scale\.FIT/)
    expect(src).toMatch(/autoCenter/)
    // expandParent:false makes the ScaleManager rely entirely on CSS for parent
    // sizing (Gotcha 1 risk). Leave it at the default (true).
    expect(src).not.toMatch(/expandParent\s*:\s*false/)
  })

  it("GameShell tears down Phaser and re-FITs on host resize", () => {
    const src = read("src/ui/GameShell.tsx")
    expect(src, "unmount must game.destroy(true) to release the WebGL context").toMatch(/\.destroy\(true\)/)
    expect(src, "host resize must be observed with a ResizeObserver").toMatch(/ResizeObserver/)
    expect(src, "host resize must call game.scale.refresh()").toMatch(/scale\.refresh\(\)/)
  })
})
