# Style reference

Each style is a set of CSS custom properties (font + palette + stroke) in
`assets/sketch-skin.css`. They all share the same sketchiness ramp and the same
hand-drawn box geometry, so switching style is just changing `data-sketch`.

## The five styles

| `data-sketch` | Font (Google Fonts) | Ink / stroke | Paper | Border | Character |
|---|---|---|---|---|---|
| `balsamiq` | Balsamiq Sans | `#3a3a3a` | `#ffffff` (page `#fafafa`) | 2px | Neutral greyscale wireframe. The safe default. |
| `sharpie` | Permanent Marker | `#141414` | `#ffffff` | 3px | Bold, high-contrast whiteboard marker. |
| `pencil` | Gaegu | `#6f6f6f` / ink `#4a4a4a` | `#fcfcfa` | 2px | Soft, light graphite draft. |
| `doodle` | Short Stack | `#222222`, accent `#ff5b5b`, links `#2b8aef` | `#fffef7` | 2.5px | Playful, lightly coloured. |
| `blueprint` | Patrick Hand | ink `#eaf3ff` on blue | `#0d3f93` (page `#0b3a86`) | 2px | White ink on blue "drawing board". |

All fonts are SIL Open Font License and load via the `@import` at the top of
`sketch-skin.css`. Balsamiq Sans is the official Balsamiq wireframe font
(https://fonts.google.com/specimen/Balsamiq+Sans).

## CSS variables each style may set

| Variable | Meaning |
|---|---|
| `--sketch-font` | Handwritten font stack |
| `--sketch-ink` | Text colour |
| `--sketch-stroke` | Border / line colour |
| `--sketch-paper` | Surface fill (cards, inputs, buttons) |
| `--sketch-muted` | Secondary fill |
| `--sketch-accent` | Links / emphasis |
| `--sketch-border` | Border thickness |
| `--sketch-radius` | Hand-drawn rectangle radii (rarely overridden) |
| `--sketch-wobble` | The active SVG filter (set by the level ramp, not by styles) |

## Adding a new style

1. Add a block to `sketch-skin.css`:
   ```css
   [data-sketch="crayon"] {
     --sketch-font: 'Gaegu', cursive;
     --sketch-ink:    #333;
     --sketch-stroke: #c0392b;
     --sketch-paper:  #fffdf5;
     --sketch-accent: #2980b9;
     --sketch-border: 3px;
   }
   [data-sketch="crayon"] :where(body) { background:#fffdf5 !important; color:var(--sketch-ink) !important; }
   ```
2. If it needs a new font, add it to the `@import` URL at the top of the file
   and to `assets/fonts/README.md` for offline use.
3. Add it to the `STYLES`/`LABELS` arrays in `assets/sketch-toggle.js` so it
   appears in the overlay.
4. Add it to `STYLES` in `demo/capture-screenshots.mjs` to include it in the
   gallery.

## The hand-drawn box geometry

The wobbly rectangle look at **every** level (even 0) comes from asymmetric
border-radii, not from the SVG filter:

```css
--sketch-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
```

This classic trick (different radius per corner, horizontal vs vertical) reads
as a sloppy hand-drawn box and, unlike the SVG filter, never blurs text. The
SVG filter then *adds* line jitter on top, scaled by the sketchiness level.
