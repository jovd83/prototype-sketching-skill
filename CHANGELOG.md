# Changelog

All notable changes to this skill are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [1.1.1] — 2026-06-29

### Changed
- The README **validation badge** now shows this repository's own live GitHub
  Actions status (`actions/workflows/validate.yml/badge.svg`) instead of a static
  placeholder, so it reflects the real result of the skill's own validation
  workflow.

### Added
- Gallery screenshots for the 1.1.0 features:
  `demo/screenshots/feature-watermark.png` (the diagonal `DRAFT` watermark with a
  sketched dropdown menu) and `demo/screenshots/feature-modal.png` (a native
  `<dialog>` in the Sharpie style with the sketch `::backdrop`), now shown in the
  README. The bundled demo (`demo/demo.html`) gained an interactive account
  dropdown and a confirmation dialog so the modal/popup coverage is exercised.

## [1.1.0] — 2026-06-29

### Added
- **Diagonal "prototype" watermark** (opt-in): set `data-sketch-watermark="TEXT"`
  on `<html>` to stamp a faint, hand-lettered word diagonally across the
  viewport. Non-interactive (`pointer-events: none`), reversible, and adapts to
  the active style. The interactive overlay gains a **Watermark** text field to
  set it live (and a `?watermark=` URL parameter for headless capture).
- **CI validation**: `.github/workflows/validate.yml` runs
  `scripts/validate_skill.py` on every push / pull request, backing the new
  validation badge. README now carries version / status / category / validation /
  license / support badges.

### Changed
- **Modals, popups and SPA navigation now stay in the sketch look.** The
  box-styling and wobble selector lists were broadened to cover `dialog`,
  `[popover]`, `[role="dialog"]`, `[aria-modal="true"]`, `.modal`, `.popover`,
  dropdowns, menus, tooltips and toasts (including portal-mounted ones), plus a
  styled native `::backdrop`. Because activation is on `<html>`, lazily mounted
  UI and every SPA route inherit the skin automatically.
- The overlay script now watches `<body>` and re-injects the SVG filters if a
  framework replaces the body on a route change, so the wobble never silently
  drops mid-session.

## [1.0.0] — 2026-06-28

Initial public release.

### Added
- Reversible, non-destructive "hand-sketched" skin for Angular / React / Vue /
  static web apps. Activated with two `<html>` attributes (`data-sketch` and
  `data-sketch-level`); look-and-feel only — it never touches components, markup,
  routing, state, or logic, and reverting is just removing the two attributes.
- Five styles — **Balsamiq, Sharpie, Pencil, Doodle, Blueprint** — defined in
  `assets/sketch-skin.css`.
- Adjustable sketchiness from 0% to 100% via SVG displacement filters
  (`assets/sketch-filters.html`), using smooth single-octave `fractalNoise` so
  even the roughest level stays a clean hand-drawn wobble rather than grainy.
- Optional interactive overlay (`assets/sketch-toggle.js`): a floating panel with
  OFF + one radio per theme and a 0–100% slider; it auto-injects the SVG filters
  and persists the choice in `localStorage`.
- `.no-sketch` / `data-no-sketch` opt-out to keep a single element (logo, chart)
  crisp.
- Per-framework injection recipes (Angular / React / Vue / static) and the SVG
  filter math in `references/`.
- Self-hosting / offline font guidance (`assets/fonts/README.md`).
