# Implementation reference

Read this when the quick path in `SKILL.md` is not enough: framework specifics,
the SVG filter math, selector tuning, offline fonts, performance, and reverting.

## 1. The two activation models

There are two ways to turn the skin on. Both are non-destructive.

### A. Static attributes (best for a committed demo build)
1. Add `assets/sketch-skin.css` to the project's global styles.
2. Paste `assets/sketch-filters.html` right after `<body>` in `index.html`.
3. Set `<html data-sketch="balsamiq" data-sketch-level="50">`.

### B. Interactive overlay (best for client meetings — let them play)
1. Add `assets/sketch-skin.css` to the project's global styles.
2. Add **one** script tag: `<script src="sketch-toggle.js" defer></script>`.
   - It auto-injects the SVG filters, so step A's filter paste is **not needed**.
   - It renders a floating panel: radios **OFF + one per theme** and a
     **0–100% slider**. Selecting/sliding flips the `<html>` attributes live.
   - The choice persists in `localStorage` (key `sketch-skin-state`).
3. Nothing else. Remove the script tag to disable.

Use B when the user asks "let me toggle it / show my client a switch". Use A
for a fixed, screenshot-stable look.

## 2. Per-framework recipes

### Angular
- **CSS**: append the contents of `sketch-skin.css` to `src/styles.scss` (or
  `src/styles.css`), or copy the file into `src/` and add it to the `styles`
  array in `angular.json`.
- **Overlay**: copy `sketch-toggle.js` into `src/assets/` and add
  `<script src="assets/sketch-toggle.js" defer></script>` before `</body>` in
  `src/index.html`. (Or static: paste `sketch-filters.html` after `<body>` and
  set the attributes on `<html>` in `src/index.html`.)
- Angular bootstraps inside `<app-root>` in `<body>`; the filters/attributes on
  the document survive re-renders. No component or module changes.

### React / Vite
- **CSS**: `import './sketch-skin.css'` in `src/main.tsx` (place the file in
  `src/`).
- **Overlay**: put `sketch-toggle.js` in `public/` and add
  `<script src="/sketch-toggle.js" defer></script>` to `index.html`, or static:
  paste `sketch-filters.html` after `<body>` and set attributes on `<html>`.
- React mounts into `#root`; document-level attributes/filters are untouched by
  React's reconciler.

### Vue
- **CSS**: `import './sketch-skin.css'` in `src/main.ts` (file in `src/`).
- **Overlay**: `sketch-toggle.js` in `public/`, script tag in `index.html`;
  or static attributes on `<html>` in `index.html`.

### Static HTML
- Link the stylesheet in `<head>`: `<link rel="stylesheet" href="sketch-skin.css">`.
- Add `<script src="sketch-toggle.js" defer></script>` before `</body>` (overlay)
  **or** paste `sketch-filters.html` after `<body>` and set the `<html>` attributes.

## 3. SVG filter math (how sketchiness works)

Each `#sketch-NN` filter chains two primitives:

```xml
<filter id="sketch-50" x="-20%" y="-20%" width="140%" height="140%">
  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="1" seed="7" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4"
                     xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

- `feTurbulence` makes a Perlin-noise texture. **`baseFrequency`** = how tight
  the wobble is (higher → jittery; lower → long sweeping strokes).
- `feDisplacementMap` shoves each pixel by the noise value. **`scale`** = wobble
  amplitude — this is the main "sketchiness" dial.
- The filter region is expanded (`-20% … 140%`) so displaced edges are not
  clipped.
- **Why `fractalNoise` + `numOctaves="1"`:** `type="turbulence"` sums the
  *absolute* value of the noise, which adds sharp ridges, and extra octaves pile
  on high-frequency detail. At high `scale` that combination reads as a grainy,
  sandpapery edge. `fractalNoise` with a single octave gives one smooth,
  low-frequency wave, so even level 100 stays a clean hand-drawn wobble. `scale`
  alone carries the intensity; `baseFrequency` only eases down slightly so the
  bigger displacement keeps a long, smooth wavelength.

Level → parameters used here:

| Level | type | baseFrequency | scale | octaves |
|---|---|---|---|---|
| 25 | fractalNoise | 0.012 | 1.4 | 1 |
| 50 | fractalNoise | 0.011 | 2.4 | 1 |
| 75 | fractalNoise | 0.010 | 3.3 | 1 |
| 100 | fractalNoise | 0.009 | 4.2 | 1 |

To re-tune, edit the values in **both** `assets/sketch-filters.html` and the
`defs` array in `assets/sketch-toggle.js` so static and overlay stay identical.

**Why text never blurs:** the filter is applied only to box decoration
selectors (buttons, inputs, cards, tables, `hr`, `svg`…), never to `body` or
text nodes. Text "sketchiness" comes from the handwritten font instead.

## 4. Tuning the wobble selector list

If the effect is too weak or too strong on a given app, edit the selector list
in `sketch-skin.css` under section 2 ("Sketchiness ramp"). Add app-specific
container classes (e.g. `.mat-card`, `.ant-btn`, `.MuiPaper-root`) to extend
the wobble to a component library's wrappers — still no markup changes.

For very large DOMs (huge data grids), **remove `table` from the wobble list**
or lower the level; `feDisplacementMap` repaints can get expensive.

## 5. Offline / air-gapped fonts

The default `@import` pulls fonts from Google Fonts. For offline client demos,
self-host: see `assets/fonts/README.md` for the `@font-face` block and download
sources. Then delete the `@import` line from `sketch-skin.css`.

## 6. Keeping assets crisp

`.no-sketch` (or `data-no-sketch`) on a single element removes the wobble,
font swap, radius and desaturation from it and its children. The overlay panel
itself uses this class. Only add it to markup when the user explicitly asks to
protect a logo/chart — it is the one permitted markup change.

## 7. Reverting completely

- **Overlay model**: choose **OFF** in the panel, or remove the `<script>` tag.
- **Static model**: delete `data-sketch` and `data-sketch-level` from `<html>`.
- The appended CSS and SVG defs are inert without the attributes, so they can be
  left in place between demos with zero visual effect.

## 8. Known limitations

- Icon fonts and some CSS sprite techniques can look odd under the flatten
  rules; wrap the icon container in `.no-sketch` if needed.
- `feDisplacementMap` is supported in all evergreen browsers; in very old
  browsers the wobble is silently ignored (boxes still render via border-radius).
- The skin restyles; it does not change spacing/layout, so a genuinely
  pixel-cramped UI stays cramped — that is intentional (look-and-feel only).
