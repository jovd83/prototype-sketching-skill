# Self-hosting the fonts (offline use)

By default `sketch-skin.css` loads fonts from Google Fonts via `@import`. For
offline or air-gapped client demos, host the fonts locally instead.

## 1. Download the font files

All five fonts are SIL Open Font License (free for commercial use):

| Font | Source |
|---|---|
| Balsamiq Sans | https://fonts.google.com/specimen/Balsamiq+Sans · https://github.com/balsamiq/balsamiqsans |
| Permanent Marker | https://fonts.google.com/specimen/Permanent+Marker |
| Gaegu | https://fonts.google.com/specimen/Gaegu |
| Short Stack | https://fonts.google.com/specimen/Short+Stack |
| Patrick Hand | https://fonts.google.com/specimen/Patrick+Hand |

Tip: https://gwfh.mranftl.com/fonts gives ready-to-download `.woff2` + a
`@font-face` snippet for each.

Place the `.woff2` files in this `assets/fonts/` folder.

## 2. Replace the @import with @font-face

Delete the `@import url('https://fonts.googleapis.com/…')` line at the top of
`sketch-skin.css` and add (adjust paths/filenames to match what you downloaded):

```css
@font-face { font-family:'Balsamiq Sans';    src:url('fonts/balsamiq-sans-v15-latin-regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
@font-face { font-family:'Balsamiq Sans';    src:url('fonts/balsamiq-sans-v15-latin-700.woff2')     format('woff2'); font-weight:700; font-display:swap; }
@font-face { font-family:'Permanent Marker'; src:url('fonts/permanent-marker-v16-latin-regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
@font-face { font-family:'Gaegu';            src:url('fonts/gaegu-v15-latin-regular.woff2')          format('woff2'); font-weight:400; font-display:swap; }
@font-face { font-family:'Short Stack';      src:url('fonts/short-stack-v15-latin-regular.woff2')    format('woff2'); font-weight:400; font-display:swap; }
@font-face { font-family:'Patrick Hand';     src:url('fonts/patrick-hand-v23-latin-regular.woff2')   format('woff2'); font-weight:400; font-display:swap; }
```

## 3. Make sure the path resolves

`src: url('fonts/…')` is relative to the location of `sketch-skin.css`. If your
build serves CSS from a different folder, adjust the path (e.g. `assets/fonts/…`).

> Font binaries are intentionally **not** committed to this repo to keep it
> light. Download them at setup time.
