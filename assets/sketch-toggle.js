/* prototype-sketching-skill — sketch-toggle.js  (OPTIONAL interactive overlay)
   --------------------------------------------------------------------------
   A floating control panel for live previewing:
     • radio buttons: OFF + one per theme (Balsamiq / Sharpie / Pencil / Doodle / Blueprint)
     • a 0–100% sketchiness slider (snaps to 0/25/50/75/100)
     • a watermark text field (sets the diagonal "DRAFT"-style background stamp)
   It only flips data-sketch / data-sketch-level on <html>. It NEVER touches
   app logic or markup, so it stays non-destructive. Remove the <script> tag
   to disable. The chosen state persists in localStorage.

   Drop-in usage (demo / client preview):
     <link rel="stylesheet" href="sketch-skin.css">
     <script src="sketch-toggle.js" defer></script>
   The SVG wobble filters are auto-injected if missing — nothing else needed.

   Headless / screenshot use: append ?style=sharpie&level=75&watermark=DRAFT&panel=off to the URL.
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  var STYLES = ['balsamiq', 'sharpie', 'pencil', 'doodle', 'blueprint'];
  var LABELS = { balsamiq: 'Balsamiq', sharpie: 'Sharpie', pencil: 'Pencil', doodle: 'Doodle', blueprint: 'Blueprint' };
  var KEY = 'sketch-skin-state';
  var root = document.documentElement;

  /* Inject the displacement filters once, so the script is fully self-contained. */
  function ensureFilters() {
    if (document.getElementById('sketch-50')) return;
    var ns = 'http://www.w3.org/2000/svg';
    var defs = [['sketch-25', 0.012, 1.4, 1], ['sketch-50', 0.011, 2.4, 1], ['sketch-75', 0.01, 3.3, 1], ['sketch-100', 0.009, 4.2, 1]];
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    var defsEl = document.createElementNS(ns, 'defs');
    defs.forEach(function (f) {
      var filt = document.createElementNS(ns, 'filter');
      filt.setAttribute('id', f[0]);
      filt.setAttribute('x', '-20%'); filt.setAttribute('y', '-20%');
      filt.setAttribute('width', '140%'); filt.setAttribute('height', '140%');
      var t = document.createElementNS(ns, 'feTurbulence');
      t.setAttribute('type', 'fractalNoise');
      t.setAttribute('baseFrequency', f[1]);
      t.setAttribute('numOctaves', f[3]);
      t.setAttribute('seed', '7');
      t.setAttribute('result', 'noise');
      var dm = document.createElementNS(ns, 'feDisplacementMap');
      dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'noise');
      dm.setAttribute('scale', f[2]);
      dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
      filt.appendChild(t); filt.appendChild(dm); defsEl.appendChild(filt);
    });
    svg.appendChild(defsEl);
    document.body.appendChild(svg);
  }

  /* Re-inject the filters if a framework wipes <body> (e.g. some SPA route
     swaps replace the whole body) so the wobble never silently disappears. */
  function watchFilters() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(function () {
      if (!document.getElementById('sketch-50')) ensureFilters();
    }).observe(document.body, { childList: true });
  }

  function apply(style, level, watermark) {
    if (!style || style === 'off') {
      root.removeAttribute('data-sketch');
      root.removeAttribute('data-sketch-level');
    } else {
      root.setAttribute('data-sketch', style);
      root.setAttribute('data-sketch-level', String(level));
    }
    if (watermark) root.setAttribute('data-sketch-watermark', watermark);
    else root.removeAttribute('data-sketch-watermark');
    try { localStorage.setItem(KEY, JSON.stringify({ style: style || 'off', level: level, watermark: watermark || '' })); } catch (e) {}
  }

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) return { style: s.style || 'off', level: s.level || 50, watermark: s.watermark || '' }; } catch (e) {}
    return {
      style: root.getAttribute('data-sketch') || 'off',
      level: parseInt(root.getAttribute('data-sketch-level'), 10) || 50,
      watermark: root.getAttribute('data-sketch-watermark') || ''
    };
  }

  function radio(val, label, checked) {
    return '<label style="display:flex;align-items:center;gap:6px;padding:2px 0;cursor:pointer">'
      + '<input type="radio" name="sketch-style" value="' + val + '"' + (checked ? ' checked' : '') + '>'
      + '<span>' + label + '</span></label>';
  }

  function buildPanel(state) {
    var panel = document.createElement('div');
    panel.className = 'no-sketch';            // keep the controls crisp
    panel.id = 'sketch-panel';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Sketch preview controls');
    panel.style.cssText = [
      'position:fixed', 'bottom:16px', 'right:16px', 'z-index:2147483647',
      'font:13px/1.4 system-ui,sans-serif', 'background:#fff', 'color:#222',
      'border:1px solid #ccc', 'border-radius:10px', 'box-shadow:0 6px 24px rgba(0,0,0,.18)',
      'padding:12px 14px', 'width:190px', 'user-select:none'
    ].join(';');

    var html = '<div style="font-weight:600;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">'
      + '<span>✏️ Sketch preview</span>'
      + '<button type="button" id="sketch-min" aria-label="Minimize panel" style="border:none;background:none;cursor:pointer;font-size:16px;line-height:1">–</button>'
      + '</div><div id="sketch-body">';
    html += radio('off', 'OFF', state.style === 'off');
    STYLES.forEach(function (s) { html += radio(s, LABELS[s], state.style === s); });
    html += '<label style="display:block;margin-top:10px">Sketchiness: <output id="sketch-out">' + state.level + '%</output>'
      + '<input id="sketch-range" type="range" min="0" max="100" step="25" value="' + state.level + '" style="width:100%;margin-top:4px"></label>'
      + '<label style="display:block;margin-top:10px">Watermark'
      + '<input id="sketch-wm" type="text" placeholder="e.g. DRAFT" value="' + String(state.watermark || '').replace(/"/g, '&quot;') + '" style="width:100%;margin-top:4px;box-sizing:border-box;padding:4px 6px;border:1px solid #ccc;border-radius:6px;font:inherit"></label>'
      + '</div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    var range = panel.querySelector('#sketch-range');
    var out = panel.querySelector('#sketch-out');
    var wm = panel.querySelector('#sketch-wm');
    function current() {
      var sel = panel.querySelector('input[name="sketch-style"]:checked');
      return { style: sel ? sel.value : 'off', level: parseInt(range.value, 10), watermark: wm ? wm.value.trim() : '' };
    }
    panel.querySelectorAll('input[name="sketch-style"]').forEach(function (r) {
      r.addEventListener('change', function () { var c = current(); apply(c.style, c.level, c.watermark); });
    });
    range.addEventListener('input', function () {
      out.textContent = range.value + '%';
      var c = current();
      if (c.style !== 'off') apply(c.style, c.level, c.watermark);
    });
    if (wm) wm.addEventListener('input', function () { var c = current(); apply(c.style, c.level, c.watermark); });
    panel.querySelector('#sketch-min').addEventListener('click', function () {
      var b = panel.querySelector('#sketch-body');
      b.style.display = b.style.display === 'none' ? '' : 'none';
    });
  }

  function init() {
    ensureFilters();
    watchFilters();
    var state = load();
    apply(state.style, state.level, state.watermark);

    var q = new URLSearchParams(location.search);
    if (q.has('style')) {
      state.style = q.get('style');
      state.level = parseInt(q.get('level'), 10);
      if (isNaN(state.level)) state.level = 50;
      if (q.has('watermark')) state.watermark = q.get('watermark');
      apply(state.style, state.level, state.watermark);
    }
    if (q.get('panel') === 'off') return;     // headless capture: skip the UI
    buildPanel(state);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
