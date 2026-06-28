# Changelog

All notable changes to this skill are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

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
