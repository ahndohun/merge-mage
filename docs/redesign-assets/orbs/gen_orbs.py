"""Generate 16x16 pixel-art elemental orb sprites, re-themed from the
existing tome sprites' exact palette family (see pngtool dump).

Structure (same geometry for all 3, only colors differ):
  CORE   d<=1.6   -> bright core fill + hand-placed motif overlay
  SHELL1 1.6-3.0  -> brightest shell tone
  SHELL2 3.0-4.3  -> mid shell tone
  SHELL3 4.3-5.4  -> darkest shell tone (shadow ring before rim)
  RIM    5.4-6.2  -> bright rim/edge-glow tone (opaque)
  GLOW1  6.2-7.0  -> soft alpha bloom (alpha ~150)
  GLOW2  7.0-7.7  -> fainter alpha bloom (alpha ~60)
  else            -> transparent
"""
import sys
sys.path.insert(0, "/private/tmp/claude-501/-Users-ahndohun-Documents-Codex-2026-07-04-new-chat/89055e82-228c-49cd-874d-c772b8b5dd5e/scratchpad")
from pngtool import write_png
import math

W = H = 16
CX, CY = 7.5, 7.5

R_CORE, R_S1, R_S2, R_S3, R_RIM, R_G1, R_G2 = 1.6, 3.0, 4.3, 5.4, 6.2, 7.0, 7.7
DITHER = 0.35

TRANSPARENT = (0, 0, 0, 0)


def dist(x, y):
    return math.hypot(x - CX, y - CY)


def build(name, cfg):
    """cfg keys: shell1, shell2, shell3, rim, glow_rgb, core_fill, motif(dict (x,y)->rgba), glint(list of (x,y,rgba))"""
    px = [[TRANSPARENT for _ in range(W)] for _ in range(H)]
    for y in range(H):
        for x in range(W):
            d = dist(x, y)

            def zone_of(dd):
                if dd <= R_CORE:
                    return 0, cfg["core_fill"] + (255,)
                elif dd <= R_S1:
                    return 1, cfg["shell1"] + (255,)
                elif dd <= R_S2:
                    return 2, cfg["shell2"] + (255,)
                elif dd <= R_S3:
                    return 3, cfg["shell3"] + (255,)
                elif dd <= R_RIM:
                    return 4, cfg["rim"] + (255,)
                elif dd <= R_G1:
                    return 5, cfg["glow_rgb"] + (150,)
                elif dd <= R_G2:
                    return 6, cfg["glow_rgb"] + (60,)
                else:
                    return 7, TRANSPARENT

            zid, color = zone_of(d)
            # simple boundary dither: near a threshold, checkerboard-mix with the
            # zone just outside it, to avoid a perfectly smooth ring (keeps the
            # flat/dithered pixel-art brushwork instead of a smooth 3D gradient).
            # Only dither the INNER shading seams (core/shell/shell) — dithering
            # the outer silhouette (shell3->rim->glow->transparent) turned the
            # round outline into a jagged gear/flower shape, so those stay clean
            # circles instead.
            for thr in (R_CORE, R_S1, R_S2):
                if abs(d - thr) < DITHER and (x + y) % 2 == 0:
                    zid2, color2 = zone_of(thr + DITHER + 0.01) if d <= thr else zone_of(thr - DITHER - 0.01)
                    color = color2
                    break
            px[y][x] = color

    # motif overlay (explicit hand-placed pixels win over zone fill)
    for (mx, my), c in cfg["motif"].items():
        if 0 <= mx < W and 0 <= my < H:
            px[my][mx] = c + (255,)

    # single glossy glint pixel
    if cfg.get("glint"):
        gx, gy, gc = cfg["glint"]
        px[gy][gx] = gc + (255,)

    out_path = f"/private/tmp/claude-501/-Users-ahndohun-Documents-Codex-2026-07-04-new-chat/89055e82-228c-49cd-874d-c772b8b5dd5e/scratchpad/orbs/{name}.png"
    write_png(out_path, W, H, px)
    return px


def ascii_map(px):
    sym_map = {}
    symbols = ".#*oO+=-~^%$@abcdefghij"
    lines = []
    for row in px:
        line = []
        for c in row:
            if c not in sym_map:
                sym_map[c] = symbols[len(sym_map) % len(symbols)]
            line.append(sym_map[c])
        lines.append("".join(line))
    return lines, sym_map


# ---------------------------------------------------------------------------
# FIRE — reuse the fire tome's red/orange ramp almost verbatim.
FIRE = dict(
    shell1=(232, 59, 59),
    shell2=(174, 35, 52),
    shell3=(108, 39, 39),
    rim=(216, 58, 57),
    glow_rgb=(232, 59, 59),
    core_fill=(249, 194, 43),
    motif={
        (8, 6): (255, 255, 255),   # hot flame tip flicker, offset upward
        (7, 6): (249, 194, 43),
        (7, 7): (255, 255, 255),   # spark
        (8, 8): (249, 194, 43),
        (7, 9): (232, 59, 59),     # flame base licks into shell red
        (8, 9): (249, 194, 43),
    },
    glint=(5, 5, (255, 200, 160)),
)

# FROST — reuse the frost tome's blue ramp verbatim; sparkle motif in pale teal
# (199,220,208) reused from the tome's own "page" tone, which already reads icy.
FROST = dict(
    shell1=(77, 155, 230),
    shell2=(51, 117, 163),
    shell3=(21, 71, 105),
    rim=(95, 205, 228),
    glow_rgb=(95, 205, 228),
    core_fill=(95, 205, 228),
    motif={
        (7, 5): (199, 220, 208),
        (8, 10): (199, 220, 208),
        (5, 7): (199, 220, 208),
        (10, 8): (199, 220, 208),
        (7, 7): (255, 255, 255),
        (8, 8): (255, 255, 255),
        (7, 8): (255, 255, 255),
        (8, 7): (95, 205, 228),
    },
    glint=(5, 5, (255, 255, 255)),
)

# HOLY — direction calls for a GOLD-dominant orb (tome itself is blue-dominant
# with gold as a minor emblem accent). Body ramp built by extending the tome's
# existing gold/orange accent hues into a full light->shadow ramp; the two
# darkest/lightest steps are new tones derived from those exact accents
# (disclosed deviation — see report).
HOLY = dict(
    shell1=(251, 185, 84),
    shell2=(205, 104, 61),
    shell3=(110, 55, 30),      # NEW: darkened extension of the tome's (205,104,61)
    rim=(255, 221, 140),       # NEW: lightened extension of the tome's (251,185,84)
    glow_rgb=(251, 185, 84),
    core_fill=(255, 221, 140),
    motif={
        (9, 5): (205, 104, 61), (10, 4): (251, 185, 84),
        (5, 5): (205, 104, 61), (4, 4): (251, 185, 84),
        (9, 10): (205, 104, 61), (10, 11): (251, 185, 84),
        (5, 10): (205, 104, 61), (4, 11): (251, 185, 84),
        (7, 7): (255, 255, 255),
        (8, 7): (255, 255, 255),
        (7, 8): (255, 255, 255),
        (8, 8): (255, 255, 255),
    },
    glint=(5, 6, (255, 255, 255)),
)

if __name__ == "__main__":
    for name, cfg in [("fire", FIRE), ("frost", FROST), ("holy", HOLY)]:
        px = build(name, cfg)
        lines, legend = ascii_map(px)
        print(f"=== {name} ===")
        for l in lines:
            print(l)
        n_opaque = len({c for row in px for c in row if c[3] == 255})
        n_total = len({c for row in px for c in row})
        print(f"opaque colors: {n_opaque}, total distinct rgba (incl alpha tiers): {n_total}")
        print()
