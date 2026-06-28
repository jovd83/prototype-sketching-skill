---
name: prototype-sketching-skill
description: Use when a working Angular, React, Vue, or static web app must look hand-sketched (Balsamiq wireframe, Sharpie marker, pencil, doodle, or blueprint) for a client demo, so clients read it as a draft and understand it is not production. Applies a reversible, non-destructive visual skin with an adjustable sketchiness level (0-100%) without touching components, markup, routing, state, or any logic.
---

# Prototype Sketching Skill

Make a *working* web app **look** hand-drawn so clients see it is a prototype, not a finished product. This is a **look-and-feel skin only**. It is purely additive and fully reversible.

## Scope guardrails (read first, never violate)

1. **Only touch styling entry points and `index.html`.** Append a stylesheet, paste one SVG block, set two attributes. Nothing else.
2. **Never edit** components, templates, `.ts/.tsx/.jsx/.vue` logic, routing, state, services, or tests.
3. **Never swap components** for sketchy component libraries (e.g. wired-elements) — that rewrites markup. Forbidden.
4. **Never recolor or distort** logos, photos, charts, or icons that must stay crisp — use the opt-out class.
5. **Reverting must stay trivial**: removing the two `<html>` attributes turns the whole skin off.

## How it works (one mental model)

- One stylesheet `assets/sketch-skin.css` defines all 5 styles + the sketchiness ramp.
- One SVG block `assets/sketch-filters.html` defines the wobble filters (`#sketch-25` … `#sketch-100`).
- Activation is **two attributes on `<html>`**: `data-sketch="<style>"` and `data-sketch-level="<0|25|50|75|100>"`.
- The look comes from: handwritten **font swap** + **hand-drawn boxes** (irregular border-radius, flat fills) + an **SVG displacement filter** whose strength is the sketchiness level. The font carries text; the filter wobbles box decoration only (never blurs text).

## Quick start (do these in order)

1. **Confirm the request is skin-only.** If the user wants behavior/layout changes, stop — that is out of scope.
2. **Detect the framework** and find its global stylesheet + `index.html` (see recipe table below).
3. **Pick a style** (table in "Styles") and a **level** (`0`, `25`, `50`, `75`, or `100`).
4. **Add the skin CSS** to the project's global styles:
   - Copy `assets/sketch-skin.css` into the project (e.g. `src/styles.scss`) **or** `@import` it. The font `@import` is already inside that file (online use).
5. **Paste the SVG filters** from `assets/sketch-filters.html` immediately after the opening `<body>` tag in `index.html`. (Required — `filter: url(#sketch-…)` resolves only if these defs are in the DOM.)
6. **Activate** by editing the `<html>` tag in `index.html`:
   ```html
   <html lang="en" data-sketch="balsamiq" data-sketch-level="50">
   ```
7. **Verify** in the browser. To revert, delete the two `data-sketch*` attributes (the appended CSS/SVG can stay dormant — they do nothing without the attributes).

## Styles

| `data-sketch` | Look | Font | Use for |
|---|---|---|---|
| `balsamiq` | Clean greyscale wireframe, flat boxes | Balsamiq Sans | The default "this is a mockup" |
| `sharpie` | Bold black marker, heavy stroke | Permanent Marker | Whiteboard / workshop sketch |
| `pencil` | Light graphite, soft strokes | Gaegu | Gentle "pencil on paper" draft |
| `doodle` | Playful, light color accents | Short Stack | Friendly, informal concepts |
| `blueprint` | White ink on blue paper | Patrick Hand | Technical "drawing board" feel |

## Sketchiness level

`data-sketch-level` controls how shaky the lines are. It selects a different SVG displacement filter:

| Level | Effect |
|---|---|
| `0` | Hand-drawn boxes + font, but **straight, steady lines** (cleanest) |
| `25` | Subtle wobble |
| `50` | Clearly hand-drawn (recommended default) |
| `75` | Loose, energetic sketch |
| `100` | Very rough, maximum "scribble" |

If `data-sketch` is set but `data-sketch-level` is omitted, the skin defaults to level `50`.

## Framework injection recipes

The skin is framework-agnostic. These are the exact targets; full details in `references/implementation.md`.

| Stack | Add CSS to | Paste SVG into | Set attributes on |
|---|---|---|---|
| **Angular** | `src/styles.scss` (or `styles.css`) | `src/index.html` after `<body>` | `<html>` in `src/index.html` |
| **React / Vite** | `src/index.css` (imported in `main.tsx`) | `index.html` after `<body>` | `<html>` in `index.html` |
| **Vue** | `src/assets/main.css` (imported in `main.ts`) | `index.html` after `<body>` | `<html>` in `index.html` |
| **Static HTML** | link `sketch-skin.css` in `<head>` | `index.html` after `<body>` | `<html>` in `index.html` |

## Keeping specific assets crisp (opt-out)

The skin will not edit markup, but if the user explicitly asks to protect one element (logo, chart), the only allowed markup change is adding the opt-out hook to that **single** element:

```html
<img src="logo.svg" class="no-sketch" alt="Logo">
```

`.no-sketch` (or `data-no-sketch`) removes the wobble filter and color overrides from that element. Use sparingly and only when asked.

## Interactive preview overlay (optional)

When the user wants to *toggle* styles live (e.g. show a client a switch), use
the overlay instead of static attributes:

1. Add `assets/sketch-skin.css` to the global styles (as in Quick start).
2. Add **one** script tag before `</body>`:
   ```html
   <script src="sketch-toggle.js" defer></script>
   ```
3. Done. The script renders a floating panel with **OFF + one radio per theme**
   and a **0–100% sketchiness slider**, flips the `<html>` attributes live, and
   remembers the choice in `localStorage`. It **auto-injects the SVG filters**, so
   step 5 of Quick start (pasting `sketch-filters.html`) is not needed.

This is still skin-only and non-destructive — the script just sets attributes.
Remove the tag to disable. Choose this model when the request is "let me/the
client switch styles"; use static attributes for a fixed, screenshot-stable look.

## Screenshot gallery

`README.md` shows every style and the 0→100% ladder using the PNGs in
`demo/screenshots/`. Those images are pre-rendered; the interactive demo app and
the Playwright capture script that generate them live in the project's
development source and are not bundled with the installed skill. The skill itself
is just `assets/` + `references/` — no build step, no dependencies.

## Examples

**Example 1 — Angular demo in Balsamiq, moderate sketch**
- Input: "Make this Angular app look like a Balsamiq wireframe for tomorrow's demo."
- Actions: append `sketch-skin.css` to `src/styles.scss`; paste filters into `src/index.html`; set `<html data-sketch="balsamiq" data-sketch-level="50">`.
- Result: app runs identically; renders as a greyscale wireframe.

**Example 2 — React, maximum sharpie**
- Input: "React app, full whiteboard-marker look, really rough."
- Actions: import `sketch-skin.css` in `main.tsx`; paste filters into `index.html`; set `data-sketch="sharpie" data-sketch-level="100"`.

**Example 3 — Turn it off**
- Input: "Switch back to the real UI."
- Action: delete `data-sketch` and `data-sketch-level` from `<html>`. Done — no other change needed.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Boxes look hand-drawn but lines are perfectly straight | SVG filters not in DOM, or level `0` | Confirm `sketch-filters.html` is pasted after `<body>`; set level ≥ 25 |
| Nothing changed at all | Attributes missing or CSS not loaded | Verify `<html data-sketch="…">` is present and `sketch-skin.css` is in the global styles |
| Text looks blurry | Filter applied to text/whole `<body>` | Do not add `filter:` to body or text; the skin filters box decoration only — re-copy `sketch-skin.css` unmodified |
| Fonts are not handwritten | Offline / blocked Google Fonts | Self-host fonts — see `assets/fonts/README.md` |
| Page feels sluggish on huge tables/grids | `feDisplacementMap` cost on large DOM | Lower the level, or scope the wobble selector list (see `references/implementation.md`) |
| A logo got desaturated/wobbly | No opt-out on that asset | Add `class="no-sketch"` to that single element |
| Icon fonts / SVG icons disappeared | Aggressive flatten | Add `no-sketch` to the icon container, or see the icon note in `references/implementation.md` |

## Reference files (read only when needed)

- `references/styles.md` — exact font/palette/stroke spec for each of the 5 styles, and how to add a new style.
- `references/implementation.md` — SVG filter math, per-framework step-by-step, selector tuning, offline fonts, performance, revert details.
