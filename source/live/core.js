// Live figures: the runtime that turns a still SVG figure into an animated or 3D one on request.
// Every live figure keeps its still drawing: it is what prints, what shows without JavaScript,
// and what a reader sees until they choose to play. Widgets register with Live.register().
// In the single-file build every widget is bundled with this runtime; in the --site build each widget is a
// lazy ES-module chunk (window.BOOK_CHUNKS maps "w_<name>" to its file) imported when the reader taps its button.

import { ENHANCEMENTS } from './enhancements.js';
import { makeColourResolver } from './css_colour.mjs';

const EL = {
  H: '#f3f1e8', C: '#3d4a46', N: '#4f74b3', O: '#c4553c', Na: '#8a6bb5', Cl: '#5c9a52', Mg: '#c7a24a',
  Al: '#a7b3b8', S: '#d9b93b', Fe: '#b06a3b', Cu: '#c27a45', Zn: '#8fa2ad', Ag: '#c9cdd0', Li: '#b98bc9',
  Ne: '#e0897a', He: '#e6c87a', K: '#a67ccf', Ca: '#9fb5a0', X: '#b8b2a2', A: '#c97b5a', B: '#5a8fae',
};
const DARK_TEXT = new Set(['C', 'Na', 'N', 'O', 'Cl', 'Fe', 'Cu', 'K', 'A', 'B', 'Li']);
const reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

// Raw fragment-shader pool. A healthy WebGL1 canvas is lent to one lesson at
// a time; losing contexts on every close can itself exhaust WebKit's context cap.
let idleRawGL = null;
let activeRawGL = null;
let rawGLUnavailable = false;
function resetRawGL(g) {
  if (g.isContextLost()) return;
  g.useProgram(null);
  g.bindBuffer(g.ARRAY_BUFFER, null); g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
  g.bindFramebuffer(g.FRAMEBUFFER, null); g.bindRenderbuffer(g.RENDERBUFFER, null);
  for (let i = 0; i < g.getParameter(g.MAX_VERTEX_ATTRIBS); i++) {
    g.disableVertexAttribArray(i); g.vertexAttrib4f(i, 0, 0, 0, 1);
  }
  for (let i = 0; i < g.getParameter(g.MAX_COMBINED_TEXTURE_IMAGE_UNITS); i++) {
    g.activeTexture(g.TEXTURE0 + i);
    g.bindTexture(g.TEXTURE_2D, null); g.bindTexture(g.TEXTURE_CUBE_MAP, null);
  }
  g.activeTexture(g.TEXTURE0);
  for (const cap of [g.BLEND, g.CULL_FACE, g.DEPTH_TEST, g.STENCIL_TEST,
    g.SCISSOR_TEST, g.POLYGON_OFFSET_FILL, g.SAMPLE_ALPHA_TO_COVERAGE, g.SAMPLE_COVERAGE]) g.disable(cap);
  g.enable(g.DITHER); g.colorMask(true, true, true, true); g.depthMask(true); g.stencilMask(0xffffffff);
  g.clearColor(0, 0, 0, 0); g.clearDepth(1); g.clearStencil(0);
  g.blendFunc(g.ONE, g.ZERO); g.blendEquation(g.FUNC_ADD); g.depthFunc(g.LESS);
  g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false); g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  g.pixelStorei(g.UNPACK_ALIGNMENT, 4); g.pixelStorei(g.PACK_ALIGNMENT, 4);
  g.viewport(0, 0, 1, 1); g.scissor(0, 0, 1, 1);
}
function releaseRawGL(lease) {
  if (lease.released) return;
  lease.released = true;
  lease.detach();
  lease.disposeGPU();
  const { canvas, gl } = lease;
  canvas.remove();
  if (activeRawGL === lease) activeRawGL = null;
  // A genuinely lost context is retired; healthy returns never force a loss.
  if (gl.isContextLost()) return;
  resetRawGL(gl);
  canvas.width = canvas.height = 1;
  canvas.removeAttribute('style'); canvas.hidden = false;
  idleRawGL = { canvas, gl };
}
function acquireRawGL(fig) {
  if (activeRawGL) {
    const previous = activeRawGL;
    if (previous.fig !== fig) previous.fig.dispatchEvent(new CustomEvent('close-lesson'));
    if (!previous.released) releaseRawGL(previous);
  }
  let entry = idleRawGL; idleRawGL = null;
  if (entry?.gl.isContextLost()) { entry.canvas.remove(); entry = null; }
  if (!entry && !rawGLUnavailable) {
    const canvas = document.createElement('canvas');
    let gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
      || canvas.getContext('experimental-webgl', { antialias: false, premultipliedAlpha: false }); } catch (_) { /* use 2D */ }
    if (gl) entry = { canvas, gl }; else rawGLUnavailable = true;
  }
  if (entry) resetRawGL(entry.gl);
  return entry;
}
// End raw fragment-shader pool.

const widgets = {};
export const Live = {
  EL, DARK_TEXT,
  /** register(name, factory, {label}) — factory(stage, params, api) returns {start(), stop(), destroy()} */
  register(name, factory, meta = {}) { widgets[name] = { factory, meta }; },
};
window.Live = Live;

const resolveCanvasColour = makeColourResolver(() => document.createElement('canvas'));
function cssVar(name) {
  return resolveCanvasColour(getComputedStyle(document.body).getPropertyValue(name).trim() || '#888');
}

export function colors() {
  const c = {};
  for (const k of ['paper', 'sheet', 'ink', 'ink-2', 'muted', 'rule', 'rule-2', 'proton', 'neutron', 'electron', 'green', 'vol', 'plate', 'grid', 'mark-soft'])
    c[k.replace('-', '_')] = cssVar('--' + k);
  return c;
}

// ------------------------------------------------------------------ 2D drawing helpers
export const draw = {
  atom(ctx, x, y, r, el, opts = {}) {
    const fill = EL[el] || '#bbb';
    ctx.save();
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = Math.max(0.8, r * 0.07); ctx.strokeStyle = 'rgba(29,51,45,.55)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.55);
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = Math.max(1, r * 0.09); ctx.lineCap = 'round'; ctx.stroke();
    if (opts.label !== false && r >= 7) {
      ctx.fillStyle = DARK_TEXT.has(el) ? '#fbfaf5' : '#1d2b27';
      ctx.font = `600 ${(r * (el.length === 1 ? 0.95 : 0.78)).toFixed(1)}px Lexend, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(el, x, y + r * 0.04);
    }
    if (opts.charge) {
      const bx = x + r * 0.78, by = y - r * 0.78, br = Math.max(5, r * 0.42);
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = opts.c ? opts.c.sheet : '#fbfaf5'; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = opts.c ? opts.c.ink : '#1d332d'; ctx.stroke();
      ctx.fillStyle = opts.c ? opts.c.ink : '#1d332d';
      ctx.font = `700 ${(br * 1.2).toFixed(1)}px Lexend, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(opts.charge, bx, by + 0.5);
    }
    ctx.restore();
  },
  // particle: 'p' proton, 'n' neutron, 'e' electron (book colours, with sign)
  particle(ctx, x, y, r, kind, c) {
    const col = { p: c.proton, n: c.neutron, e: c.electron }[kind];
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    const s = { p: '+', n: '', e: '−' }[kind];
    if (s && r >= 4) {
      ctx.fillStyle = '#fff'; ctx.font = `700 ${(r * 1.5).toFixed(1)}px Lexend, system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + r * 0.08);
    }
  },
  bond(ctx, x1, y1, x2, y2, order, c, width = 3) {
    ctx.strokeStyle = c.ink; ctx.lineWidth = width; ctx.lineCap = 'round';
    const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1, ox = -dy / n * 4, oy = dx / n * 4;
    const offs = order === 1 ? [0] : order === 2 ? [-0.6, 0.6] : [-1, 0, 1];
    for (const k of offs) { ctx.beginPath(); ctx.moveTo(x1 + ox * k, y1 + oy * k); ctx.lineTo(x2 + ox * k, y2 + oy * k); ctx.stroke(); }
  },
  arrow(ctx, x1, y1, x2, y2, color, width = 1.8, head = 8) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.42), y2 - head * Math.sin(a - 0.42));
    ctx.lineTo(x2 - head * Math.cos(a + 0.42), y2 - head * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill();
  },
  text(ctx, s, x, y, { size = 13, color = '#1d332d', align = 'left', weight = 400, base = 'alphabetic', serif = false } = {}) {
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.font = `${weight} ${size}px ${serif ? 'Literata, "Literata Static", Georgia, serif' : 'Lexend, system-ui, sans-serif'}`;
    ctx.fillText(s, x, y);
  },
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  },
};

// Deterministic random numbers so every reader sees the same opening frame.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
// Normal-ish random (Box–Muller)
export function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()); }

// ------------------------------------------------------------------ sound: api.audio()
// One AudioContext per open figure, created on first use (which is always inside a tap: nothing plays by itself).
// A browser may still start it "suspended"; it resumes on the reader's next tap or key press.
function makeAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, unlockers = [];
  const voices = new Set();
  function ensure() {
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.22;           // gentle: well below full scale
      const comp = ctx.createDynamicsCompressor();                    // so stacked harmonics never clip
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
      if (!unlockers.length) {
        const unlock = () => { if (ctx) ctx.resume().catch(() => {}); unlockers.forEach(([e, f]) => document.removeEventListener(e, f, true)); unlockers = []; };
        unlockers = ['pointerdown', 'keydown', 'touchend'].map(e => [e, unlock]);
        unlockers.forEach(([e, f]) => document.addEventListener(e, f, true));
      }
    }
    return ctx;
  }
  function voice(src, gainNode, c, panner = null) {
    const v = {
      src, gain: gainNode,
      setFreq(f) { if (src.frequency) src.frequency.setTargetAtTime(f, c.currentTime, 0.02); },
      setGain(g) { gainNode.gain.setTargetAtTime(g, c.currentTime, 0.03); },
      setPan(p) { if (panner) panner.pan.setTargetAtTime(Math.max(-1, Math.min(1, p)), c.currentTime, 0.02); },
      stop(release = 0.08) {
        if (!voices.has(v)) return;
        const t = c.currentTime;
        try { gainNode.gain.cancelScheduledValues(t); gainNode.gain.setValueAtTime(gainNode.gain.value, t); gainNode.gain.linearRampToValueAtTime(0, t + release); src.stop(t + release + 0.02); } catch (e) {}
      },
    };
    voices.add(v);
    src.onended = () => {
      voices.delete(v);
      try { gainNode.disconnect(); } catch (e) {}
      try { panner && panner.disconnect(); } catch (e) {}
    };
    return v;
  }
  const audio = {
    get available() { return !!AC; },
    /** The AudioContext (created on first access). */
    get ctx() { return ensure(); },
    /** The master gain node every sound goes through. */
    get master() { ensure(); return master; },
    /** Play a tone: tone(440, {gain: 0.3, type: 'sine'|'square'|'sawtooth'|'triangle', dur: 1, attack: 0.01, release: 0.08, wave, pan, slideTo}).
        dur: Infinity holds it until voice.stop(). Returns a voice {setFreq(f), setGain(g), setPan(p), stop()} or null without Web Audio. */
    tone(freq, { gain = 0.3, type = 'sine', dur = 1, attack = 0.01, release = 0.08, when = 0, wave = null, pan = 0, slideTo = null } = {}) {
      const c = ensure(); if (!c) return null;
      const t0 = c.currentTime + when;
      const o = c.createOscillator();
      if (wave) o.setPeriodicWave(wave); else o.type = type;
      const safeFreq = Math.max(40, Math.min(3200, freq));
      o.frequency.setValueAtTime(safeFreq, t0);
      if (slideTo != null && Number.isFinite(slideTo)) {
        const endT = Number.isFinite(dur) ? t0 + Math.max(0.02, dur) : t0 + 0.16;
        o.frequency.exponentialRampToValueAtTime(Math.max(40, Math.min(3200, slideTo)), endT);
      }
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(gain, t0 + attack);
      if (Number.isFinite(dur)) {
        g.gain.setValueAtTime(gain, t0 + Math.max(attack, dur - release));
        g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      }
      let panner = null;
      if (typeof c.createStereoPanner === 'function') {
        panner = c.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, Number(pan) || 0)), t0);
        o.connect(g); g.connect(panner); panner.connect(master);
      } else {
        o.connect(g); g.connect(master);
      }
      o.start(t0);
      if (Number.isFinite(dur)) o.stop(t0 + dur + 0.02);
      return voice(o, g, c, panner);
    },
    /** A directional micro-click with optional stereo pan (-1 left .. +1 right). */
    click({ dir = 1, pan = 0, gain = 0.14 } = {}) {
      return audio.tone(dir >= 0 ? 520 : 390, {
        slideTo: dir >= 0 ? 740 : 270,
        dur: 0.042,
        attack: 0.004,
        release: 0.024,
        type: 'triangle',
        gain,
        pan,
      });
    },
    /** Semitone-scaled confirmation boop. */
    boop({ streak = 0, baseFreq = 330, dur = 0.08, gain = 0.16, pan = 0 } = {}) {
      const semi = Math.max(0, Math.min(12, streak));
      const f0 = baseFreq * (2 ** (semi / 12));
      return audio.tone(f0 * 0.92, { slideTo: f0 * 1.12, dur, attack: 0.006, release: 0.04, type: 'triangle', gain, pan });
    },
    /** A note built from harmonics: amps[k] is the amplitude of harmonic k+1 (frequency (k+1)·f0). Same options as tone(). */
    harmonics(amps, f0, opts = {}) {
      const c = ensure(); if (!c) return null;
      const n = amps.length + 1;
      const real = new Float32Array(n), imag = new Float32Array(n);
      amps.forEach((a, k) => { imag[k + 1] = a; });
      return audio.tone(f0, { ...opts, wave: c.createPeriodicWave(real, imag) });
    },
    /** Silence everything this figure is playing. */
    stop() { voices.forEach(v => v.stop()); },
    _close() {
      audio.stop();
      unlockers.forEach(([e, f]) => document.removeEventListener(e, f, true)); unlockers = [];
      if (ctx) { const c = ctx; ctx = null; setTimeout(() => c.close().catch(() => {}), 200); }
    },
  };
  return audio;
}

// ------------------------------------------------------------------ Kym-iO & lazy archival plate loader
const kymIORegistry = new Map();
let directorsCutPromise = null;

function loadDirectorsCut() {
  if (!directorsCutPromise) {
    const url = new URL('assets/plates/directors_cut.json', document.baseURI).href;
    directorsCutPromise = fetch(url)
      .then((r) => {
        if (!r.ok) {
          directorsCutPromise = null;
          return null;
        }
        return r.json();
      })
      .catch(() => {
        directorsCutPromise = null;
        return null;
      });
  }
  return directorsCutPromise;
}

function encodePresetURL(widgetName, stateObj) {
  try {
    const payload = {
      sliders: (stateObj.sliders || []).map((s) => s.value),
      tabs: stateObj.tabs || [],
      custom: stateObj.custom || undefined,
    };
    const u = new URL(location.href);
    u.searchParams.set('wpreset', `${widgetName}:${JSON.stringify(payload)}`);
    return u.href;
  } catch (e) {
    return location.href;
  }
}

function readPresetFromURL(widgetName) {
  try {
    const raw = new URLSearchParams(location.search).get('wpreset');
    if (!raw || !raw.startsWith(widgetName + ':')) return null;
    return JSON.parse(raw.slice(widgetName.length + 1));
  } catch (e) {
    return null;
  }
}

function captureCompositePNG(stage, ext) {
  try {
    if (ext.io?.beforeSnapshot) ext.io.beforeSnapshot();
    const canvases = [...stage.querySelectorAll('canvas')].filter((cv) => cv.width > 0 && cv.height > 0);
    if (!canvases.length) return null;
    if (canvases.length === 1) {
      const primary = canvases[0];
      const w = primary.width;
      const h = primary.height;
      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      const ctx = out.getContext('2d');
      if (!ctx) return primary.toDataURL('image/png');
      ctx.fillStyle = colors().plate || '#fdfbf6';
      ctx.fillRect(0, 0, w, h);
      try { ctx.drawImage(primary, 0, 0, w, h); } catch (_) { /* ignore tainted */ }
      return out.toDataURL('image/png');
    }
    const maxW = Math.max(...canvases.map((cv) => cv.width));
    const gap = 8;
    const heights = canvases.map((cv) => Math.max(1, Math.round((cv.height / cv.width) * maxW)));
    const totalH = heights.reduce((a, b) => a + b, 0) + gap * (canvases.length - 1);
    const out = document.createElement('canvas');
    out.width = maxW;
    out.height = totalH;
    const ctx = out.getContext('2d');
    if (!ctx) return canvases[0].toDataURL('image/png');
    ctx.fillStyle = colors().plate || '#fdfbf6';
    ctx.fillRect(0, 0, maxW, totalH);
    let yOff = 0;
    canvases.forEach((cv, idx) => {
      const h = heights[idx];
      try { ctx.drawImage(cv, 0, yOff, maxW, h); } catch (_) { /* ignore tainted */ }
      yOff += h + gap;
    });
    return out.toDataURL('image/png');
  } catch (e) {
    return null;
  }
}

if (typeof window !== 'undefined') {
  window.__kymIO = {
    list() { return [...kymIORegistry.keys()]; },
    getState(name) {
      const entry = kymIORegistry.get(name);
      return entry ? entry.getState() : null;
    },
    setState(name, patch) {
      const entry = kymIORegistry.get(name);
      return entry ? entry.setState(patch) : false;
    },
    captureSnapshot(name) {
      const entry = kymIORegistry.get(name);
      return entry ? entry.captureSnapshot() : null;
    },
  };
}

// ------------------------------------------------------------------ the per-figure API
function isReducedMotion() {
  return !!(reducedQuery.matches
    || document.documentElement.classList.contains('still')
    || (document.body && document.body.classList.contains('still')));
}

function makeApi(fig, stage, controls, state) {
  const loops = new Set();
  const cleanups = [];
  const hides = new Set();     // run when the figure scrolls off screen
  const sliders = [];          // [{label, input, set, onInput}]
  const tabGroups = [];        // [{btns, activeIdx, onSelect}]
  const buttons = [];          // [{label, btn}]
  const changeListeners = new Set();
  const calmListeners = new Set();
  let readoutText = '';
  let customChallenge = null;
  let customNumbers = null;
  let customWatch = null;
  let customCutaway = null;
  let customCutawayCb = null;
  let customIdealised = null;
  let customReset = null;
  let customIO = null;
  let trialsCtrl = null;
  let sonifyCtrl = null;
  let calmOverride = false;
  let interacted = false;
  let watched = false;
  let audio = null;
  let lastEmitAt = 0;
  let emitTimer = 0;
  const palette = colors();
  const themeObserver = new MutationObserver(() => {
    Object.assign(palette, colors());
    for (const fn of loops) fn(0, state.t);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  cleanups.push(() => themeObserver.disconnect());
  cleanups.push(() => { if (emitTimer) clearTimeout(emitTimer); });

  const emitTelemetry = (type = 'change', summary = '') => {
    if (typeof window === 'undefined' || !state.widgetName) return;
    const send = () => {
      lastEmitAt = performance.now();
      const entry = kymIORegistry.get(state.widgetName);
      window.dispatchEvent(new CustomEvent('kym:sim-event', {
        detail: {
          widgetId: state.widgetName,
          type,
          summary: summary || readoutText,
          state: entry ? entry.getState() : null,
        },
      }));
    };
    const now = performance.now();
    if (type === 'stamp' || type === 'trial' || type === 'reset' || now - lastEmitAt > 240) {
      if (emitTimer) { clearTimeout(emitTimer); emitTimer = 0; }
      send();
    } else if (!emitTimer) {
      emitTimer = setTimeout(() => { emitTimer = 0; send(); }, 250);
    }
  };

  const notifyChange = (reason = 'change') => {
    for (const fn of changeListeners) {
      try { fn(); } catch (e) { /* ignore */ }
    }
    if (interacted || reason === 'reset' || reason === 'trial' || reason === 'stamp') {
      emitTelemetry(reason);
    }
  };

  const setCalm = (on) => {
    calmOverride = !!on;
    fig.dataset.calmMotion = calmOverride ? '1' : '0';
    for (const fn of calmListeners) {
      try { fn(calmOverride || isReducedMotion()); } catch (e) { /* ignore */ }
    }
    for (const fn of loops) fn(0, state.t);
    notifyChange('calm');
  };

  const note = (text, cls = '') => {
    const p = document.createElement('p'); p.className = 'live-note ' + cls; p.setAttribute('aria-live', 'polite');
    p.textContent = text; controls.appendChild(p); return p;
  };
  const sizeCanvas = (cv, W, H) => {
    cv.style.width = '100%'; cv.style.height = 'auto'; cv.style.aspectRatio = `${W} / ${H}`; cv.style.display = 'block';
    cv.style.setProperty('--drawing-width', W + 'px');
    cv.dataset.logicalWidth = W;
    cv.dataset.logicalHeight = H;
  };
  const pointerXY = (target, ev) => {
    const cv = target?.cv || target;
    if (!cv || !cv.getBoundingClientRect) return { x: 0, y: 0 };
    const r = cv.getBoundingClientRect();
    const w = target?.W || Number(cv.dataset.logicalWidth) || cv.width || r.width || 1;
    const h = target?.H || Number(cv.dataset.logicalHeight) || cv.height || r.height || 1;
    return {
      x: ((ev.clientX - r.left) / Math.max(1, r.width)) * w,
      y: ((ev.clientY - r.top) / Math.max(1, r.height)) * h,
    };
  };
  const api = {
    get reduced() { return isReducedMotion(); },
    get calm() { return calmOverride || isReducedMotion(); },
    get controls() { return controls; },
    get stage() { return stage; },
    colors: () => palette,
    draw, rng, gauss, EL, pointerXY,
    /** true while the figure is on screen */
    get visible() { return state.visible; },
    /** Start/pause from an explicit lesson button (for example, Run a motor). */
    play() { state.setPlaying?.(true); },
    pause() { state.setPlaying?.(false); },
    /** Parameter-only lessons do not offer a Play action with no visible effect. */
    playback(enabled) { state.setPlaybackSupported?.(!!enabled); },
    /** Keep a lesson's controls beside its primary visual. */
    placeControls(slot) { slot.appendChild(controls); },
    /** Register a custom reset handler invoked by the shared Reset button or 'R' key. */
    reset(fn) { customReset = fn; },
    /** Register Kym-iO bidirectional inspection hooks: { getState, setState, beforeSnapshot }. */
    io(hooks) { customIO = hooks; },
    /** Subscribe to Calm background motion changes. */
    onCalmChange(fn) { calmListeners.add(fn); return () => calmListeners.delete(fn); },
    /** Opt-in spatial audio sonification toggle synced with Still Mode and off-screen pause. */
    sonifyToggle(label = 'Sonify', onToggle) {
      let active = false;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'live-ctl live-sonify-btn';
      btn.textContent = label;
      btn.setAttribute('aria-pressed', 'false');
      const set = (on) => {
        const next = !!on && !isReducedMotion();
        if (next === active) {
          if (on && !next) notifyChange('sonify');
          return;
        }
        active = next;
        btn.setAttribute('aria-pressed', String(active));
        if (!active && audio) audio.stop();
        if (active) api.audio();
        try { onToggle?.(active, active ? api.audio() : null); } catch (e) { /* ignore */ }
        notifyChange('sonify');
      };
      btn.addEventListener('click', () => { interacted = true; set(!active); });
      controls.appendChild(btn);
      buttons.push({ label, btn });
      const stopAudio = () => { if (active) set(false); };
      hides.add(stopAudio);
      cleanups.push(stopAudio);
      const onStill = (e) => { if (e.detail?.still) stopAudio(); };
      window.addEventListener('still:change', onStill);
      cleanups.push(() => window.removeEventListener('still:change', onStill));
      sonifyCtrl = {
        get active() { return active; },
        set,
        btn,
        label,
      };
      return sonifyCtrl;
    },
    /** Live Sim Data table + mini dot-plot + CSV/Snapshot export + optional biological noise toggle. */
    trials({
      columns = ['Trial', 'Value'],
      maxRows = 8,
      allowNoise = false,
      noiseLabel = 'Biological noise',
      onNoiseChange = null,
      plotColumn = null,
      plotLabel = null,
      plotValue = null,
    } = {}) {
      const wrap = document.createElement('div');
      wrap.className = 'live-trials';
      const head = document.createElement('div');
      head.className = 'live-trials-head';
      const titleEl = document.createElement('span');
      titleEl.className = 'live-trials-title';
      titleEl.textContent = 'Live Sim Data (0)';
      head.appendChild(titleEl);

      let noiseOn = false;
      let noiseInput = null;
      if (allowNoise) {
        const lab = document.createElement('label');
        lab.className = 'live-check';
        noiseInput = document.createElement('input');
        noiseInput.type = 'checkbox';
        noiseInput.checked = false;
        const sp = document.createElement('span');
        sp.textContent = noiseLabel;
        lab.append(noiseInput, sp);
        noiseInput.addEventListener('change', () => {
          interacted = true;
          noiseOn = !!noiseInput.checked;
          try { onNoiseChange?.(noiseOn); } catch (e) { /* ignore */ }
          notifyChange('noise');
        });
        head.appendChild(lab);
      }

      const actions = document.createElement('div');
      actions.className = 'live-trials-actions';
      const csvBtn = document.createElement('button');
      csvBtn.type = 'button';
      csvBtn.className = 'live-ctl live-csv-btn';
      csvBtn.textContent = 'Copy CSV';
      const snapBtn = document.createElement('button');
      snapBtn.type = 'button';
      snapBtn.className = 'live-ctl live-snapshot-btn';
      snapBtn.textContent = 'Snapshot';
      actions.append(csvBtn, snapBtn);
      head.appendChild(actions);

      const plotBox = document.createElement('div');
      plotBox.className = 'live-trials-plot';
      plotBox.hidden = true;

      const scrollBox = document.createElement('div');
      scrollBox.className = 'live-trials-scroll';
      const tbl = document.createElement('table');
      tbl.className = 'live-trials-table';
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      columns.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col;
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      const tbody = document.createElement('tbody');
      tbl.append(thead, tbody);
      scrollBox.appendChild(tbl);
      wrap.append(head, plotBox, scrollBox);
      wrap.hidden = !allowNoise;
      controls.appendChild(wrap);

      let recorded = [];

      const rowValues = (r) => (Array.isArray(r) ? r : columns.map((c) => (r[c] != null ? r[c] : '')));
      const toCSV = () => [columns, ...recorded.map(rowValues)]
        .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const toMarkdown = () => {
        if (!recorded.length) return '';
        const hdr = '| ' + columns.join(' | ') + ' |';
        const sep = '| ' + columns.map(() => '---').join(' | ') + ' |';
        const body = recorded.map((r) => '| ' + rowValues(r).map((v) => String(v ?? '')).join(' | ') + ' |').join('\n');
        return [hdr, sep, body].join('\n');
      };

      const renderTable = () => {
        titleEl.textContent = `Live Sim Data (${recorded.length})`;
        wrap.hidden = !allowNoise && recorded.length === 0;
        scrollBox.hidden = recorded.length === 0;
        csvBtn.hidden = recorded.length === 0;
        tbody.replaceChildren();
        recorded.forEach((r) => {
          const tr = document.createElement('tr');
          rowValues(r).forEach((val) => {
            const td = document.createElement('td');
            td.textContent = String(val ?? '');
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        // Render inline trend dot-plot for explicit/outcome numeric metric from row 1
        let explicitIdx = -1;
        if (typeof plotColumn === 'number' && plotColumn >= 0 && plotColumn < columns.length) {
          explicitIdx = plotColumn;
        } else if (typeof plotColumn === 'string') {
          explicitIdx = columns.indexOf(plotColumn);
        }
        let metricIdx = explicitIdx;
        if (metricIdx < 0 && typeof plotValue !== 'function') {
          for (let ci = columns.length - 1; ci >= 1; ci--) {
            if (recorded.some((r) => Number.isFinite(parseFloat(rowValues(r)[ci])))) {
              metricIdx = ci;
              break;
            }
          }
        }
        const vals = recorded
          .map((r) => {
            if (typeof plotValue === 'function') return Number(plotValue(rowValues(r), r));
            if (metricIdx >= 0) return parseFloat(rowValues(r)[metricIdx]);
            return NaN;
          })
          .filter((n) => Number.isFinite(n));

        plotBox.replaceChildren();
        if (vals.length >= 1) {
          const metricName = plotLabel || (metricIdx >= 0 ? columns[metricIdx] : 'Value');
          const lo = Math.min(...vals);
          const hi = Math.max(...vals);
          const span = Math.max(1e-6, hi - lo);
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          const W = 260, H = 34, pad = 16;
          const xAt = (v) => (vals.length === 1 ? W / 2 : pad + ((v - lo) / span) * (W - pad * 2));
          const svgNS = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(svgNS, 'svg');
          svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
          svg.setAttribute('aria-label', `Trial trend for ${metricName}`);
          const mkSvg = (tag, attrs) => {
            const el = document.createElementNS(svgNS, tag);
            Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
            return el;
          };
          svg.appendChild(mkSvg('line', { x1: pad, y1: 17, x2: W - pad, y2: 17, stroke: 'var(--rule)', 'stroke-width': 1.2 }));
          if (vals.length >= 2) {
            const mx = xAt(mean);
            svg.appendChild(mkSvg('line', { x1: mx.toFixed(1), y1: 5, x2: mx.toFixed(1), y2: 29, stroke: 'var(--proton)', 'stroke-width': 1.8 }));
            const pts = vals.map((v, idx) => `${xAt(v).toFixed(1)},${17 + ((idx % 3) - 1) * 5}`).join(' ');
            svg.appendChild(mkSvg('polyline', { fill: 'none', stroke: 'var(--electron)', 'stroke-width': 1.3, opacity: 0.55, points: pts }));
          }
          vals.forEach((v, idx) => {
            svg.appendChild(mkSvg('circle', {
              cx: xAt(v).toFixed(1),
              cy: (vals.length === 1 ? 17 : 17 + ((idx % 3) - 1) * 5).toFixed(1),
              r: idx === vals.length - 1 ? 4.2 : 3.2,
              fill: idx === vals.length - 1 ? 'var(--green)' : 'var(--electron)',
              opacity: 0.92,
            }));
          });
          const summaryEl = document.createElement('span');
          summaryEl.className = 'live-trials-mean';
          summaryEl.textContent = vals.length === 1
            ? `${metricName} baseline: ${vals[0].toFixed(1)}`
            : `${metricName} mean: ${mean.toFixed(1)} (${lo.toFixed(1)}–${hi.toFixed(1)})`;
          plotBox.append(svg, summaryEl);
          plotBox.hidden = false;
        } else {
          plotBox.hidden = true;
        }
      };

      csvBtn.addEventListener('click', () => {
        const csv = toCSV();
        try { navigator.clipboard?.writeText(csv); } catch (_) { /* optional */ }
        const prev = csvBtn.textContent;
        csvBtn.textContent = 'Copied CSV';
        setTimeout(() => { csvBtn.textContent = prev; }, 1400);
      });

      snapBtn.addEventListener('click', () => {
        const wname = state.widgetName;
        const snapData = wname ? window.__kymIO?.captureSnapshot(wname) : null;
        let savedOk = false;
        if (window.webkit?.messageHandlers?.kymbioBridge && snapData) {
          try {
            window.webkit.messageHandlers.kymbioBridge.postMessage({
              kind: 'snapshot',
              snapshotWidgetId: wname,
              readout: snapData.readout || '',
              trialsMarkdown: snapData.trialsMarkdown || '',
              pngBase64: snapData.pngBase64 || '',
            });
            savedOk = true;
          } catch (_) { /* ignore bridge failure */ }
        } else if (snapData?.pngBase64) {
          const a = document.createElement('a');
          a.href = snapData.pngBase64;
          a.download = `${wname || 'lab'}-snapshot.png`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
          savedOk = true;
        }
        const prev = snapBtn.textContent;
        snapBtn.textContent = savedOk ? 'Saved' : 'Unavailable';
        setTimeout(() => { snapBtn.textContent = prev; }, 1400);
      });

      renderTable();

      trialsCtrl = {
        record(row) {
          interacted = true;
          recorded = [...recorded.slice(-(maxRows - 1)), row];
          renderTable();
          if (typeof window !== 'undefined' && state.widgetName) {
            window.dispatchEvent(new CustomEvent('kym:trial-recorded', {
              detail: { widgetId: state.widgetName, row, rows: recorded.slice() },
            }));
          }
          notifyChange('trial');
          return recorded.slice();
        },
        clear() {
          recorded = [];
          renderTable();
          notifyChange('trial');
        },
        rows: () => recorded.slice(),
        get noise() { return noiseOn; },
        setNoise(v) {
          noiseOn = !!v;
          if (noiseInput) noiseInput.checked = noiseOn;
          try { onNoiseChange?.(noiseOn); } catch (e) { /* ignore */ }
          notifyChange('noise');
        },
        toCSV,
        toMarkdown,
      };
      return trialsCtrl;
    },
    /** A canvas that fills the stage at a fixed logical size (W x H); drawing uses logical units. */
    canvas(W, H, label) {
      const cv = document.createElement('canvas');
      cv.setAttribute('role', 'img');
      cv.setAttribute('aria-label', label || fig.querySelector('svg')?.getAttribute('aria-label') || 'Animated figure');
      sizeCanvas(cv, W, H);
      stage.appendChild(cv);
      const ctx = cv.getContext('2d');
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        const cssW = cv.clientWidth || W;
        const s = cssW / W;
        cv.width = Math.round(W * s * dpr); cv.height = Math.round(H * s * dpr);
        ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
        for (const fn of loops) fn(0, state.t); // resizing clears a canvas: redraw the current frame
      };
      fit();
      const ro = new ResizeObserver(fit); ro.observe(cv); cleanups.push(() => ro.disconnect());
      return { cv, ctx, W, H, clear(col) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore(); if (col) { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); } } };
    },
    /** Register a per-frame function fn(dt seconds, t seconds). Runs only while the figure plays; dt = 0 means draw a still frame. */
    loop(fn) { loops.add(fn); return () => loops.delete(fn); },
    button(label, onClick, opts = {}) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'live-ctl'; b.textContent = label;
      if (opts.pressed != null) b.setAttribute('aria-pressed', String(!!opts.pressed));
      b.addEventListener('click', () => {
        interacted = true;
        onClick(b);
        notifyChange();
      });
      controls.appendChild(b);
      buttons.push({ label, btn: b });
      return b;
    },
    tabs(labels, onSelect, start = 0) {
      const wrap = document.createElement('div'); wrap.className = 'live-tabs'; wrap.setAttribute('role', 'group');
      const grp = { activeIdx: start, btns: [], onSelect };
      const btns = labels.map((l, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'live-ctl'; b.textContent = l;
        b.setAttribute('aria-pressed', String(i === start));
        b.addEventListener('click', () => {
          interacted = true;
          grp.activeIdx = i;
          btns.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i)));
          onSelect(i);
          notifyChange();
        });
        wrap.appendChild(b); return b;
      });
      grp.btns = btns;
      tabGroups.push(grp);
      btns.setActive = (index) => {
        grp.activeIdx = index;
        btns.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      };
      controls.appendChild(wrap); return btns;
    },
    slider(label, { min, max, step = 1, value, fmt = (v) => String(v), onInput }) {
      const id = 'ls' + Math.random().toString(36).slice(2, 8);
      const wrap = document.createElement('div'); wrap.className = 'live-slider';
      const lab = document.createElement('label'); lab.htmlFor = id; lab.textContent = label;
      const inp = document.createElement('input'); inp.type = 'range'; inp.id = id; inp.min = min; inp.max = max; inp.step = step; inp.value = value;
      const out = document.createElement('output'); out.htmlFor = id; out.textContent = fmt(+value);
      const setVal = (v, trigger = false) => {
        inp.value = v;
        out.textContent = fmt(+inp.value);
        if (trigger && onInput) onInput(+inp.value);
        notifyChange();
      };
      inp.addEventListener('input', () => {
        interacted = true;
        out.textContent = fmt(+inp.value);
        onInput(+inp.value);
        notifyChange();
      });
      wrap.append(lab, inp, out); controls.appendChild(wrap);
      const item = { label, input: inp, set: (v) => setVal(v, false), drive: (v) => setVal(v, true),
        setLabel(text) { lab.textContent = text; item.label = text; } };
      sliders.push(item);
      return item;
    },
    /** A live text readout under the figure, announced politely to screen readers. */
    readout() {
      const r = document.createElement('p'); r.className = 'live-readout'; r.setAttribute('aria-live', 'polite');
      controls.appendChild(r);
      let last = '';
      const write = (html) => {
        if (html !== last) {
          r.innerHTML = html;
          last = html;
          readoutText = r.textContent || '';
          notifyChange();
        }
      };
      write.element = r;
      return write;
    },
    /** Pedagogical challenge: prompt + check(snapshot) */
    challenge(prompt, check) { customChallenge = { prompt, check }; },
    /** Live handwritten margin substitution: fn(snapshot) or string; also returns a setter(str) */
    yourNumbers(fn) {
      if (fn !== undefined) customNumbers = fn;
      else if (!customNumbers) customNumbers = '';
      return (str) => { customNumbers = str; notifyChange(); };
    },
    /** 5-shot choreographed Watch tour + optional cutaway description/callback */
    watch(shots, opts = {}) {
      customWatch = shots;
      if (opts.cutaway) customCutaway = opts.cutaway;
      if (opts.onCutAway) customCutawayCb = opts.onCutAway;
    },
    /** 1-sentence "What the model simplifies" honesty footnote */
    idealised(text) { customIdealised = text; },
    onCleanup(fn) { cleanups.push(fn); },
    /** fn() runs whenever the figure scrolls off screen (the loop pauses by itself; use this for sound, sensors, video). */
    onHide(fn) { hides.add(fn); return () => hides.delete(fn); },

    /** Web Audio for this figure: {tone(freq, opts), harmonics(amps, f0, opts), stop(), ctx, master, available}.
        Call it from a button handler. Sound stops when the figure closes or scrolls off screen. */
    audio() {
      if (!audio) { audio = makeAudio(); hides.add(() => audio.stop()); cleanups.push(() => audio._close()); }
      return audio;
    },

    /** The microphone, behind a button: permission is asked only when the reader presses it.
        Returns a reader {time() Float32Array (−1..1), freq() Float32Array (dB per bin), rms(), active, sampleRate, binHz, stop()}.
        Sound is analysed on the device: nothing is recorded or sent anywhere. */
    mic({ label = 'Use my microphone', fftSize = 2048, smoothing = 0.6, onStart, onStop, onError } = {}) {
      let stream = null, src = null, an = null;
      const td = new Float32Array(fftSize), fd = new Float32Array(fftSize / 2);
      const btn = api.button(label, () => (an ? stop() : start()));
      btn.setAttribute('aria-pressed', 'false');
      const msg = note('The sound is measured on this device. Nothing is recorded or sent anywhere.');
      const fail = (e) => {
        stop();
        msg.textContent = 'Microphone not available here. You can still read the figure, or try another browser or device.';
        msg.classList.add('live-warn'); btn.disabled = true;
        onError && onError(e);
      };
      async function start() {
        const md = navigator.mediaDevices;
        if (!md || !md.getUserMedia || !api.audio().available) return fail(new Error('no getUserMedia'));
        btn.disabled = true;
        const c = api.audio().ctx;             // created inside the tap, so the browser lets it run
        try {
          stream = await md.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        } catch (e) { btn.disabled = false; return fail(e); }
        if (!stage.isConnected) { stop(); return; }
        if (c.state === 'suspended') c.resume().catch(() => {});
        src = c.createMediaStreamSource(stream);
        an = c.createAnalyser(); an.fftSize = fftSize; an.smoothingTimeConstant = smoothing;
        src.connect(an);                       // analyser only: never connected to the speakers, so no feedback
        btn.disabled = false; btn.textContent = 'Stop the microphone'; btn.setAttribute('aria-pressed', 'true');
        onStart && onStart(reader);
      }
      function stop() {
        if (stream) stream.getTracks().forEach(t => t.stop());
        try { src && src.disconnect(); } catch (e) {}
        const was = !!an;
        stream = src = an = null;
        btn.textContent = label; btn.setAttribute('aria-pressed', 'false');
        if (was && onStop) onStop();
      }
      const reader = {
        get active() { return !!an; },
        get sampleRate() { return audio && audio.ctx ? audio.ctx.sampleRate : 48000; },
        get binHz() { return reader.sampleRate / fftSize; },
        time() { if (an) an.getFloatTimeDomainData(td); else td.fill(0); return td; },
        freq() { if (an) an.getFloatFrequencyData(fd); else fd.fill(-160); return fd; },
        rms() { const t = reader.time(); let s = 0; for (let i = 0; i < t.length; i++) s += t[i] * t[i]; return Math.sqrt(s / t.length); },
        stop,
      };
      hides.add(stop); cleanups.push(stop);
      return reader;
    },

    /** The phone's accelerometer, behind a button (iOS asks permission on that press).
        Returns {onSample(fn), stop(), active}; fn gets {t (s), x, y, z, g} in m/s², gravity included (a phone lying still reads g ≈ 9.8). */
    motion({ label = 'Use the motion sensor', onError } = {}) {
      const fns = new Set();
      let on = false, got = false, timer = 0;
      const btn = api.button(label, () => (on ? stop() : start()));
      btn.setAttribute('aria-pressed', 'false');
      const msg = note('Readings stay on this device.');
      const handler = (e) => {
        const a = e.accelerationIncludingGravity;
        if (!a || a.x == null) return;
        got = true;
        if (!state.visible) return;                // paused while off screen
        const s = { t: e.timeStamp / 1000, x: a.x, y: a.y, z: a.z, g: Math.hypot(a.x, a.y, a.z) };
        fns.forEach(f => f(s));
      };
      const fail = (e) => {
        stop();
        msg.innerHTML = 'No motion sensor is available here. On a phone, the free <a href="https://phyphox.org" target="_blank" rel="noopener">phyphox</a> app can record the same measurement.';
        msg.classList.add('live-warn'); btn.disabled = true;
        onError && onError(e);
      };
      async function start() {
        if (!('DeviceMotionEvent' in window)) return fail(new Error('no DeviceMotionEvent'));
        try {
          if (typeof DeviceMotionEvent.requestPermission === 'function') {
            const r = await DeviceMotionEvent.requestPermission();
            if (r !== 'granted') return fail(new Error('permission ' + r));
          }
        } catch (e) { return fail(e); }
        window.addEventListener('devicemotion', handler);
        on = true; btn.textContent = 'Stop the sensor'; btn.setAttribute('aria-pressed', 'true');
        clearTimeout(timer);
        timer = setTimeout(() => { if (on && !got) fail(new Error('no readings')); }, 1500);   // desktops have the event but no sensor
      }
      function stop() {
        window.removeEventListener('devicemotion', handler); clearTimeout(timer);
        on = false; btn.textContent = label; btn.setAttribute('aria-pressed', 'false');
      }
      cleanups.push(stop);
      return { onSample(fn) { fns.add(fn); return () => fns.delete(fn); }, stop, get active() { return on; } };
    },

    /** The reader's own video clip: a file picker, frame stepping and tap-to-mark.
        Returns {video, marks() [{t, x, y}] (seconds; video pixels, y downwards), onMark(fn), undo(), clear(), step(n), fps}.
        The clip is opened from the device and never leaves it. */
    video({ label = 'Choose a video', fps = 30, fpsChoices = [24, 30, 60, 120, 240], onLoad } = {}) {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'video/*'; input.hidden = true; controls.appendChild(input);
      api.button(label, () => input.click());
      const wrap = document.createElement('div'); wrap.className = 'live-video';
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('playsinline', '');
      const ov = document.createElement('canvas'); ov.className = 'live-video-marks';
      ov.setAttribute('aria-label', 'Tap the video to mark where the object is in this frame');
      wrap.append(v, ov); wrap.hidden = true; stage.appendChild(wrap);
      const bar = document.createElement('div'); bar.className = 'live-tabs live-vbar'; bar.hidden = true;
      const mk = (txt, fn, aria) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'live-ctl'; b.textContent = txt; if (aria) b.setAttribute('aria-label', aria); b.addEventListener('click', fn); bar.appendChild(b); return b; };
      mk('◀', () => step(-1), 'Back one frame'); mk('▶', () => step(1), 'Forward one frame');
      const sel = document.createElement('select'); sel.className = 'live-ctl'; sel.setAttribute('aria-label', 'Frames per second of the clip');
      fpsChoices.forEach(f => { const o = document.createElement('option'); o.value = f; o.textContent = `${f} fps`; if (f === fps) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', () => { ctl.fps = +sel.value; });
      bar.appendChild(sel);
      mk('Undo mark', () => ctl.undo());
      controls.appendChild(bar);
      const msg = note('Your clip opens on this device and is never uploaded.');
      let url = null, curT = 0;
      const marks = [], fns = new Set();
      const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
      function paint() {
        const r = v.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
        ov.width = Math.max(1, Math.round(r.width * dpr)); ov.height = Math.max(1, Math.round(r.height * dpr));
        const g = ov.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, r.width, r.height);
        if (!v.videoWidth) return;
        const s = r.width / v.videoWidth, c = colors();
        marks.forEach((m, i) => {
          const now = Math.abs(m.t - curT) < 0.5 / ctl.fps;
          g.beginPath(); g.arc(m.x * s, m.y * s, now ? 7 : 4.5, 0, 6.2832);
          g.fillStyle = now ? c.proton : c.electron; g.globalAlpha = now ? 1 : 0.75; g.fill();
          g.globalAlpha = 1; g.lineWidth = 1.5; g.strokeStyle = '#fff'; g.stroke();
        });
      }
      function settle() {
        curT = v.currentTime; paint();
        // the exact time of the frame on screen, where the browser reports it
        if (hasRVFC) v.requestVideoFrameCallback((now, md) => { if (Math.abs(md.mediaTime - v.currentTime) < 1 / ctl.fps) { curT = md.mediaTime; paint(); } });
      }
      function step(n) {
        if (!v.duration) return;
        v.pause();
        v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + n / ctl.fps));
      }
      v.addEventListener('seeked', settle);
      v.addEventListener('loadeddata', () => { wrap.hidden = false; bar.hidden = false; curT = 0; settle(); onLoad && onLoad(ctl); });
      v.addEventListener('error', () => { msg.textContent = 'This browser cannot play that video. Try a clip saved as MP4.'; msg.classList.add('live-warn'); });
      input.addEventListener('change', () => {
        const f = input.files && input.files[0]; if (!f) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(f); marks.length = 0; v.src = url; v.load();
      });
      ov.addEventListener('pointerdown', (e) => {
        if (!v.videoWidth) return;
        const r = ov.getBoundingClientRect(), s = v.videoWidth / r.width;
        const m = { t: +curT.toFixed(4), x: Math.round((e.clientX - r.left) * s), y: Math.round((e.clientY - r.top) * s) };
        const i = marks.findIndex(q => Math.abs(q.t - m.t) < 0.5 / ctl.fps);
        if (i >= 0) marks.splice(i, 1, m); else marks.push(m);
        marks.sort((a, b) => a.t - b.t);
        paint(); fns.forEach(f => f(m, marks.slice()));
        step(1);                                   // after a mark, move on to the next frame
      });
      const ro = new ResizeObserver(paint); ro.observe(wrap);
      hides.add(() => v.pause());
      cleanups.push(() => { ro.disconnect(); v.removeAttribute('src'); v.load(); if (url) URL.revokeObjectURL(url); });
      const ctl = {
        video: v, fps,
        marks: () => marks.slice(),
        onMark(fn) { fns.add(fn); return () => fns.delete(fn); },
        undo() { marks.pop(); paint(); fns.forEach(f => f(null, marks.slice())); },
        clear() { marks.length = 0; paint(); fns.forEach(f => f(null, [])); },
        step,
        get time() { return curT; },
      };
      return ctl;
    },

    /** A full-canvas WebGL fragment shader. The source gets `precision highp float; uniform vec2 u_res; uniform float u_time;`
        prepended; declare your own uniforms in it and pass their values in `uniforms` (numbers or arrays of 2–4).
        Returns {ok, canvas, set(name, value), draw(), onCanvasChange(fn)}; the callback
        immediately receives the current canvas, then a replacement on fallback or null on close. Without WebGL: opts.fallback(ctx2d, W, H, uniforms, t) draws on a
        2D canvas instead, or, with no fallback, the still drawing stays with a short note. Runs in api.loop, so it plays,
        pauses and respects reduced motion like any widget. */
    gl(fragment, uniforms = {}, { width = 640, height = 360, label, fallback } = {}) {
      const U = { ...uniforms }, entry = acquireRawGL(fig);
      let t = state.t || 0, closed = false, lost = false, surface = null, fallbackMounted = false;
      let prog = null, buf = null, loc = -1, ro = null;
      const shaders = [], attached = new Set(), locs = {}, listeners = [], pointerIds = new Set(), canvasChanges = new Set();
      const cv = entry?.canvas, g = entry?.gl;
      let lease = null;
      const drawFallback = () => { if (!closed && surface && fallback) fallback(surface.ctx, width, height, U, t); };
      const currentCanvas = () => surface?.cv || (fallbackMounted ? null : cv);
      const notifyCanvas = canvas => { for (const fn of canvasChanges) fn(canvas); };
      const mountFallback = message => {
        if (fallbackMounted || closed) return;
        fallbackMounted = true;
        if (fallback) { surface = api.canvas(width, height, label); drawFallback(); }
        else {
          const svg = fig.querySelector('svg.fig');
          if (svg) stage.appendChild(svg.cloneNode(true));
        }
        notifyCanvas(currentCanvas());
        note(message || 'This view needs WebGL. The calculated drawing shows the same idea.', 'live-warn');
      };
      const disposeGPU = () => {
        if (!g || g.isContextLost()) { prog = buf = null; shaders.length = 0; attached.clear(); return; }
        g.useProgram(null);
        if (loc >= 0) g.disableVertexAttribArray(loc);
        g.bindBuffer(g.ARRAY_BUFFER, null); g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
        if (buf) { g.deleteBuffer(buf); buf = null; }
        if (prog) {
          for (const shader of attached) g.detachShader(prog, shader);
          g.deleteProgram(prog); prog = null;
        }
        for (const shader of shaders) g.deleteShader(shader);
        shaders.length = 0; attached.clear();
      };
      const loseView = event => {
        event?.preventDefault();
        if (closed || lost) return;
        lost = true;
        if (lease) releaseRawGL(lease);
        mountFallback('The shader view became unavailable. Keep using the calculated drawing and its controls.');
      };
      const drawNow = () => {
        if (closed) return;
        if (fallbackMounted) { drawFallback(); return; }
        if (!g || lost || lease?.released) return;
        if (g.isContextLost()) { loseView(); return; }
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round((cv.clientWidth || width) * dpr)), h = Math.max(1, Math.round((cv.clientHeight || height) * dpr));
        if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
        // Bind this lease explicitly, including on paused redraws after resize.
        g.useProgram(prog); g.bindBuffer(g.ARRAY_BUFFER, buf);
        g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
        g.viewport(0, 0, w, h);
        const uni = n => n in locs ? locs[n] : (locs[n] = g.getUniformLocation(prog, n));
        g.uniform2f(uni('u_res'), w, h); g.uniform1f(uni('u_time'), t);
        for (const [n, val] of Object.entries(U)) {
          const l = uni(n); if (l == null) continue;
          if (typeof val === 'number') g.uniform1f(l, val);
          else if (val.length === 2) g.uniform2fv(l, val);
          else if (val.length === 3) g.uniform3fv(l, val);
          else if (val.length === 4) g.uniform4fv(l, val);
        }
        g.drawArrays(g.TRIANGLES, 0, 3);
      };
      if (entry) {
        // Widgets attach pointer listeners directly to the returned canvas. Track
        // them for this lease so a reused surface cannot call a closed widget.
        const add = cv.addEventListener, remove = cv.removeEventListener;
        cv.addEventListener = function(type, listener, options) {
          listeners.push([type, listener, options]); add.call(cv, type, listener, options);
        };
        cv.removeEventListener = function(type, listener, options) {
          remove.call(cv, type, listener, options);
          const capture = option => typeof option === 'boolean' ? option : !!option?.capture;
          for (let i = listeners.length - 1; i >= 0; i--) if (listeners[i][0] === type && listeners[i][1] === listener
            && capture(listeners[i][2]) === capture(options)) listeners.splice(i, 1);
        };
        const rememberPointer = e => pointerIds.add(e.pointerId);
        add.call(cv, 'pointerdown', rememberPointer, true);
        add.call(cv, 'webglcontextlost', loseView);
        lease = { ...entry, fig, released: false, disposeGPU, detach() {
          ro?.disconnect();
          for (const id of pointerIds) { try { if (cv.hasPointerCapture(id)) cv.releasePointerCapture(id); } catch (_) { /* pointer ended */ } }
          for (const [type, listener, options] of listeners) remove.call(cv, type, listener, options);
          listeners.length = 0;
          remove.call(cv, 'pointerdown', rememberPointer, true); remove.call(cv, 'webglcontextlost', loseView);
          cv.addEventListener = add; cv.removeEventListener = remove;
        } };
        activeRawGL = lease;
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', label || fig.querySelector('svg')?.getAttribute('aria-label') || 'Animated figure');
        sizeCanvas(cv, width, height); stage.appendChild(cv);
        try {
          const compile = (type, source) => {
            const shader = g.createShader(type);
            if (!shader) throw new Error('Shader allocation failed');
            shaders.push(shader); g.shaderSource(shader, source); g.compileShader(shader);
            if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(shader) || 'Shader compilation failed');
            return shader;
          };
          prog = g.createProgram();
          if (!prog) throw new Error('Program allocation failed');
          const vertex = compile(g.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
          g.attachShader(prog, vertex); attached.add(vertex);
          const pixel = compile(g.FRAGMENT_SHADER, 'precision highp float;\nuniform vec2 u_res;\nuniform float u_time;\n' + fragment);
          g.attachShader(prog, pixel); attached.add(pixel);
          g.linkProgram(prog);
          if (!g.getProgramParameter(prog, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(prog) || 'Shader link failed');
          // Linked executables no longer need their source shader objects.
          for (const shader of shaders) { g.detachShader(prog, shader); g.deleteShader(shader); }
          shaders.length = 0; attached.clear();
          buf = g.createBuffer(); if (!buf) throw new Error('Buffer allocation failed');
          g.bindBuffer(g.ARRAY_BUFFER, buf);
          g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
          loc = g.getAttribLocation(prog, 'p'); if (loc < 0) throw new Error('Shader position attribute unavailable');
          ro = new ResizeObserver(drawNow); ro.observe(cv);
        } catch (_) {
          releaseRawGL(lease);
          mountFallback('The shader could not start. Keep using the calculated drawing and controls.');
        }
      } else mountFallback();
      api.loop((dt, tt) => { t = tt; drawNow(); });
      cleanups.push(() => { closed = true; notifyCanvas(null); canvasChanges.clear(); if (lease) releaseRawGL(lease); });
      drawNow();
      return {
        get ok() { return !!entry && !lost && !fallbackMounted && !closed && !lease?.released; },
        get canvas() { return currentCanvas(); },
        onCanvasChange(fn) {
          if (closed) { fn(null); return () => {}; }
          canvasChanges.add(fn); fn(currentCanvas());
          return () => canvasChanges.delete(fn);
        },
        set(n, val) { if (closed) return; U[n] = val; drawNow(); },
        draw: drawNow,
      };
    },
    _loops: loops, _cleanups: cleanups, _hides: hides,
    _ext: {
      sliders, tabGroups, buttons, changeListeners,
      get readoutText() { return readoutText; },
      get interacted() { return interacted; },
      get watched() { return watched; },
      setWatched(v) { watched = v; notifyChange('watch'); },
      get challenge() { return customChallenge; },
      get yourNumbers() { return customNumbers; },
      get watch() { return customWatch; },
      get cutaway() { return customCutaway; },
      get cutawayCb() { return customCutawayCb; },
      get idealised() { return customIdealised; },
      get resetFn() { return customReset; },
      get io() { return customIO; },
      get trials() { return trialsCtrl; },
      get sonify() { return sonifyCtrl; },
      get calm() { return calmOverride || isReducedMotion(); },
      setCalm,
      notifyChange,
    },
  };
  return api;
}

function makeSnapshot(ext) {
  return {
    num(prefix, fallback = 0) {
      const p = prefix.toLowerCase();
      const s = ext.sliders.find((x) => x.label.toLowerCase().includes(p));
      return s ? +s.input.value : fallback;
    },
    setSlider(prefix, val) {
      const p = prefix.toLowerCase();
      const s = ext.sliders.find((x) => x.label.toLowerCase().includes(p));
      if (s) s.drive(val);
    },
    tab(groupIdx = 0) {
      return ext.tabGroups[groupIdx] ? ext.tabGroups[groupIdx].activeIdx : 0;
    },
    selectTab(groupIdx = 0, tabIdx = 0) {
      const g = ext.tabGroups[groupIdx];
      if (g && g.btns[tabIdx]) g.btns[tabIdx].click();
    },
    clickBtn(substr) {
      const p = substr.toLowerCase();
      const b = ext.buttons.find((x) => x.label.toLowerCase().includes(p));
      if (b) b.btn.click();
    },
    readout() { return ext.readoutText || ''; },
    get interacted() { return ext.interacted; },
    get watched() { return ext.watched; },
  };
}

function findPlateInManifest(manifest, plateId) {
  if (!manifest || !Array.isArray(manifest.chapters)) return null;
  for (const ch of manifest.chapters) {
    const found = (ch.plates || []).find((p) => p.id === plateId);
    if (found) return found;
  }
  return null;
}

function attachEnhancements(name, fig, stage, controls, api, openBtn) {
  const def = ENHANCEMENTS[name] || {};
  const ext = api._ext;
  const snap = makeSnapshot(ext);
  const chal = ext.challenge || def.challenge;
  const hasNum = ext.yourNumbers !== null || !!def.yourNumbers;
  const shots = ext.watch || def.watch;
  const cutawayText = ext.cutaway || def.cutaway;
  const idealText = ext.idealised || def.idealised;
  const realPlateDef = def.realPlate;
  const realPlateId = typeof realPlateDef === 'string' ? realPlateDef : realPlateDef?.id;

  // 1. Challenge banner + Open-Play / Verified phase + circular rubber stamp at top of stage
  let stampEl = null;
  let phaseEl = null;
  let challengeBar = null;
  const stampKey = 'mw:stamp:' + name;
  let stamped = false;
  try { stamped = localStorage.getItem(stampKey) === '1'; } catch (e) { /* ignore */ }

  if (chal && chal.prompt) {
    challengeBar = document.createElement('div');
    challengeBar.className = 'live-challenge';
    challengeBar.dataset.phase = stamped ? 'stamped' : 'open-play';
    const txtWrap = document.createElement('div');
    txtWrap.className = 'live-challenge-main';
    const txt = document.createElement('span');
    txt.className = 'live-challenge-text';
    txt.innerHTML = `<strong>Challenge:</strong> ${chal.prompt}`;
    txtWrap.appendChild(txt);
    if (def.predictHint) {
      const det = document.createElement('details');
      det.className = 'live-predict-hint';
      const sum = document.createElement('summary');
      sum.textContent = 'Predict first';
      const hp = document.createElement('p');
      hp.textContent = def.predictHint;
      det.append(sum, hp);
      txtWrap.appendChild(det);
    }
    const statusWrap = document.createElement('div');
    statusWrap.className = 'live-challenge-status';
    phaseEl = document.createElement('span');
    phaseEl.className = 'live-challenge-phase';
    phaseEl.textContent = stamped ? 'Verified' : 'Open play';
    stampEl = document.createElement('span');
    stampEl.className = 'live-stamp' + (stamped ? ' is-stamped' : '');
    stampEl.setAttribute('role', 'status');
    stampEl.textContent = stamped ? '✓ Stamped' : '◎ Goal';
    statusWrap.append(phaseEl, stampEl);
    challengeBar.append(txtWrap, statusWrap);
    stage.insertBefore(challengeBar, stage.firstChild);
  }

  // 2. Cut-away cross-section overlay card inside stage
  let cutawayCard = null;
  let cutawayBtn = null;
  let cutawayOpen = false;
  if (cutawayText) {
    cutawayCard = document.createElement('div');
    cutawayCard.className = 'live-cutaway-card';
    cutawayCard.setAttribute('data-glass', '1');
    cutawayCard.hidden = true;
    cutawayCard.innerHTML = `<span class="live-cutaway-badge">◐ Cut-away inside view</span><p>${cutawayText}</p>`;
    stage.appendChild(cutawayCard);
  }
  const setCutaway = (on) => {
    cutawayOpen = !!on;
    if (cutawayCard) cutawayCard.hidden = !cutawayOpen;
    if (cutawayBtn) cutawayBtn.setAttribute('aria-pressed', String(cutawayOpen));
    if (typeof ext.cutawayCb === 'function') {
      try { ext.cutawayCb(cutawayOpen); } catch (e) { /* ignore */ }
    }
  };
  ext.setCutaway = setCutaway;
  ext.isCutaway = () => cutawayOpen;

  // 2b. Real specimen microscopy / archival plate overlay (fetched lazily on first toggle)
  let specimenCard = null;
  let specimenBtn = null;
  let specimenOpen = false;
  let specimenLoaded = false;

  const renderSpecimenContent = (plate) => {
    if (!specimenCard) return;
    const title = plate?.title || (typeof realPlateDef === 'object' ? realPlateDef.title : '') || 'Real biological specimen';
    const eyebrow = plate?.eyebrow || 'Micrograph & archival plate';
    const scale = plate?.scale || (typeof realPlateDef === 'object' ? realPlateDef.scale : '') || '';
    const summary = plate?.summary || (typeof realPlateDef === 'object' ? realPlateDef.summary : '') || '';
    const credit = plate?.credit || '';
    const imgSrc = new URL(`assets/plates/${realPlateId}.webp`, document.baseURI).href;
    const pins = Array.isArray(plate?.pins) ? plate.pins : [];

    specimenCard.innerHTML = '';
    const hdr = document.createElement('div');
    hdr.className = 'live-specimen-head';
    const meta = document.createElement('div');
    meta.className = 'live-specimen-meta';
    const eb = document.createElement('span');
    eb.className = 'live-cutaway-badge';
    eb.textContent = eyebrow;
    const ttl = document.createElement('strong');
    ttl.className = 'live-specimen-title';
    ttl.textContent = title;
    meta.append(eb, ttl);
    if (scale) {
      const sc = document.createElement('span');
      sc.className = 'live-specimen-scale';
      sc.textContent = scale;
      meta.appendChild(sc);
    }
    const closeSp = document.createElement('button');
    closeSp.type = 'button';
    closeSp.className = 'live-ctl live-specimen-close';
    closeSp.textContent = 'Close';
    closeSp.addEventListener('click', () => {
      setSpecimen(false);
      specimenBtn?.focus({ preventScroll: true });
    });
    hdr.append(meta, closeSp);

    const frameStage = document.createElement('div');
    frameStage.className = 'live-specimen-stage';
    const frame = document.createElement('div');
    frame.className = 'live-specimen-frame';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `${title}. ${summary}`.trim();
    img.loading = 'lazy';
    frame.appendChild(img);
    frameStage.appendChild(frame);

    const pinDetail = document.createElement('p');
    pinDetail.className = 'live-specimen-pin-detail';

    if (pins.length) {
      const pinBtns = [];
      const selectPin = (idx) => {
        const p = pins[idx];
        if (!p) return;
        pinBtns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === idx)));
        pinDetail.replaceChildren();
        const strong = document.createElement('strong');
        strong.textContent = `${p.label}: `;
        pinDetail.append(strong, document.createTextNode(p.detail || ''));
      };
      pins.forEach((p, idx) => {
        const pb = document.createElement('button');
        pb.type = 'button';
        pb.className = 'live-spec-pin';
        pb.style.left = `${p.x}%`;
        pb.style.top = `${p.y}%`;
        pb.textContent = String(idx + 1);
        pb.setAttribute('aria-label', `${p.label}: ${p.detail}`);
        pb.addEventListener('click', () => selectPin(idx));
        pb.addEventListener('keydown', (ev) => {
          if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
            ev.preventDefault();
            const nextIdx = (idx + 1) % pinBtns.length;
            selectPin(nextIdx);
            pinBtns[nextIdx]?.focus();
          } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
            ev.preventDefault();
            const prevIdx = (idx - 1 + pinBtns.length) % pinBtns.length;
            selectPin(prevIdx);
            pinBtns[prevIdx]?.focus();
          }
        });
        frame.appendChild(pb);
        pinBtns.push(pb);
      });
      selectPin(0);
    } else if (summary) {
      pinDetail.textContent = summary;
    }

    specimenCard.append(hdr, frameStage, pinDetail);
    if (credit || (pins.length && summary)) {
      const foot = document.createElement('p');
      foot.className = 'live-specimen-foot';
      foot.textContent = [pins.length ? summary : '', credit].filter(Boolean).join(' · ');
      specimenCard.appendChild(foot);
    }
  };

  const setSpecimen = (on) => {
    if (!realPlateId) return;
    specimenOpen = !!on;
    if (specimenCard) specimenCard.hidden = !specimenOpen;
    if (specimenBtn) specimenBtn.setAttribute('aria-pressed', String(specimenOpen));
    if (specimenOpen && !specimenLoaded) {
      specimenLoaded = true;
      renderSpecimenContent(null);
      loadDirectorsCut().then((manifest) => {
        const match = findPlateInManifest(manifest, realPlateId);
        if (match) renderSpecimenContent(match);
      });
    }
  };
  ext.setSpecimen = setSpecimen;
  ext.isSpecimen = () => specimenOpen;
  ext.isStamped = () => stamped;

  if (realPlateId) {
    specimenCard = document.createElement('div');
    specimenCard.className = 'live-specimen-card';
    specimenCard.hidden = true;
    stage.appendChild(specimenCard);

    specimenBtn = document.createElement('button');
    specimenBtn.type = 'button';
    specimenBtn.className = 'live-ctl live-specimen-btn';
    specimenBtn.textContent = 'Real specimen';
    specimenBtn.setAttribute('aria-pressed', 'false');
    specimenBtn.addEventListener('click', () => {
      setSpecimen(!specimenOpen);
      if (window.__bookSound) window.__bookSound.play('lens');
    });
  }

  // 3. Live "Your Numbers" handwritten margin substitution strip at top of controls
  let numEl = null;
  if (hasNum) {
    numEl = document.createElement('div');
    numEl.className = 'live-your-numbers';
    numEl.setAttribute('aria-live', 'off');
    const badge = document.createElement('span');
    badge.className = 'live-yn-badge';
    badge.textContent = 'Your numbers';
    const eq = document.createElement('span');
    eq.className = 'live-yn-eq';
    numEl.append(badge, eq);
    controls.insertBefore(numEl, controls.firstChild);
  }

  // 4. 5-shot choreographed Watch tour bar
  let watchTimer = 0;
  if (shots && shots.length) {
    const wBar = document.createElement('div');
    wBar.className = 'live-watch-bar';

    const wBtn = document.createElement('button');
    wBtn.type = 'button';
    wBtn.className = 'live-ctl live-watch-btn';
    wBtn.textContent = api.reduced ? 'Start tour · use steps 1–5' : '▶ Watch 5-shot tour';
    wBtn.setAttribute('aria-pressed', 'false');

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'live-watch-dots';
    const capEl = document.createElement('span');
    capEl.className = 'live-watch-caption';
    capEl.textContent = 'Tap Watch or any step 1–5 for a guided tour.';

    const dotBtns = shots.map((sh, idx) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'live-watch-dot';
      d.textContent = String(idx + 1);
      d.title = sh.title || `Shot ${idx + 1}`;
      d.setAttribute('aria-label', sh.title || `Shot ${idx + 1}`);
      d.addEventListener('click', () => {
        stopTour();
        applyShot(idx);
      });
      dotsWrap.appendChild(d);
      return d;
    });

    if (cutawayText || ext.cutawayCb) {
      cutawayBtn = document.createElement('button');
      cutawayBtn.type = 'button';
      cutawayBtn.className = 'live-ctl live-cutaway-btn';
      cutawayBtn.textContent = '◐ Cut-away';
      cutawayBtn.setAttribute('aria-pressed', 'false');
      cutawayBtn.addEventListener('click', () => {
        setCutaway(!cutawayOpen);
        if (window.__bookSound) window.__bookSound.play('flap');
      });
    }

    function applyShot(idx) {
      const sh = shots[idx];
      if (!sh) return;
      dotBtns.forEach((b, j) => b.classList.toggle('is-active', j === idx));
      capEl.textContent = sh.caption || sh.title || '';
      if (sh.cutaway != null) setCutaway(!!sh.cutaway);
      const actFn = sh.act || sh.enter;
      if (typeof actFn === 'function') {
        try { actFn(snap); } catch (e) { /* ignore */ }
      }
      if (idx === shots.length - 1) ext.setWatched(true);
    }

    function stopTour() {
      if (watchTimer) { clearInterval(watchTimer); watchTimer = 0; }
      wBtn.setAttribute('aria-pressed', 'false');
      wBtn.textContent = api.reduced ? 'Start tour · use steps 1–5' : '▶ Watch 5-shot tour';
    }

    wBtn.addEventListener('click', () => {
      if (watchTimer) {
        stopTour();
        return;
      }
      let stepIdx = 0;
      wBtn.setAttribute('aria-pressed', 'true');
      wBtn.textContent = '■ Stop tour';
      applyShot(0);
      // Still readers advance with the numbered buttons, never a timed tour.
      if (api.reduced) { stopTour(); return; }
      watchTimer = setInterval(() => {
        stepIdx++;
        if (stepIdx >= shots.length) {
          stopTour();
          return;
        }
        applyShot(stepIdx);
      }, 2100);
    });

    const stopForReducedMotion = () => { if (api.reduced) stopTour(); };
    reducedQuery.addEventListener?.('change', stopForReducedMotion);
    api.onCleanup(() => reducedQuery.removeEventListener?.('change', stopForReducedMotion));
    api.onCleanup(stopTour);
    api.onHide(stopTour);

    wBar.append(wBtn, dotsWrap);
    if (cutawayBtn) wBar.appendChild(cutawayBtn);
    if (specimenBtn) wBar.appendChild(specimenBtn);
    wBar.appendChild(capEl);
    controls.insertBefore(wBar, numEl ? numEl.nextSibling : controls.firstChild);
    ext.watchCtrl = { applyShot, stopTour, count: shots.length };
  } else {
    if (cutawayText || ext.cutawayCb) {
      cutawayBtn = document.createElement('button');
      cutawayBtn.type = 'button';
      cutawayBtn.className = 'live-ctl live-cutaway-btn';
      cutawayBtn.textContent = '◐ Cut-away';
      cutawayBtn.setAttribute('aria-pressed', 'false');
      cutawayBtn.addEventListener('click', () => {
        setCutaway(!cutawayOpen);
        if (window.__bookSound) window.__bookSound.play('flap');
      });
      controls.appendChild(cutawayBtn);
    }
    if (specimenBtn) controls.appendChild(specimenBtn);
  }

  // 5. "What the model simplifies" 1-sentence honesty footnote
  if (idealText) {
    const idEl = document.createElement('p');
    idEl.className = 'live-idealised';
    idEl.innerHTML = `<strong>What the model simplifies:</strong> ${idealText}`;
    controls.appendChild(idEl);
  }

  // Sync live numbers + challenge check
  let lastNumStr = '';
  const evaluate = () => {
    const curNum = ext.yourNumbers !== null ? ext.yourNumbers : def.yourNumbers;
    if (numEl && curNum != null) {
      const val = typeof curNum === 'function' ? curNum(snap) : String(curNum);
      if (val && val !== lastNumStr) {
        numEl.querySelector('.live-yn-eq').textContent = val;
        lastNumStr = val;
      }
    }
    if (!stamped && phaseEl && challengeBar && ext.interacted) {
      challengeBar.dataset.phase = 'testing';
      phaseEl.textContent = 'Exploring';
    }
    if (!stamped && chal && typeof chal.check === 'function') {
      let ok = false;
      try { ok = !!chal.check(snap); } catch (e) { ok = false; }
      if (ok) {
        stamped = true;
        try { localStorage.setItem(stampKey, '1'); } catch (e) { /* ignore */ }
        if (challengeBar) challengeBar.dataset.phase = 'stamped';
        if (phaseEl) phaseEl.textContent = 'Verified';
        if (stampEl) {
          stampEl.textContent = '✓ Stamped';
          stampEl.classList.add('is-stamped', 'just-stamped');
        }
        if (openBtn && !openBtn.querySelector('.live-open-stamp')) {
          const b = document.createElement('em');
          b.className = 'live-open-stamp';
          b.textContent = '✓';
          b.title = 'Challenge completed';
          openBtn.appendChild(b);
        }
        if (window.__bookSound) window.__bookSound.play('stamp');
        ext.notifyChange?.('stamp');
      }
    }
  };

  ext.changeListeners.add(evaluate);
  evaluate();
}

// ------------------------------------------------------------------ wiring figures
const chunkURL = (key) => {
  const m = window.BOOK_CHUNKS || {};
  return m[key] ? new URL(m[key], document.baseURI).href : null;
};
/** Load a lazy chunk by name (site build); resolves once its module has run. */
const chunkRetries = {};
let liveRequestSequence=0;
export function loadChunk(key) {
  const url = chunkURL(key);
  if (!url) return Promise.reject(new Error(`no chunk ${key}`));
  const next = new URL(url);
  if(chunkRetries[key])next.searchParams.set('retry',chunkRetries[key]);
  return import(/* @vite-ignore */ next.href).catch(error=>{chunkRetries[key]=(chunkRetries[key]||0)+1;throw error;});
}

const ICON_3D = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5 L17 6.3 V13.7 L10 17.5 L3 13.7 V6.3 Z M3 6.3 L10 10 L17 6.3 M10 10 V17.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const ICON_PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.2 L15.5 10 L6.5 15.8 Z" fill="currentColor"/></svg>';

function setup(fig) {
  const options = [];
  if (fig.dataset.live) {
    let params = {};
    try { params = JSON.parse(fig.dataset.liveParams || '{}'); } catch (_) { /* defaults */ }
    const pre = widgets[fig.dataset.live]?.meta || { label: fig.dataset.liveLabel, three: fig.dataset.live3d === '1' };
    options.push({ name: fig.dataset.live, params, label: pre.label || (pre.three ? 'Turn it in 3D' : 'Watch it move'), original: true, three: pre.three });
  }
  try {
    for (const lesson of JSON.parse(fig.dataset.labs || '[]')) {
      options.push({ name: lesson.widget, params: { lesson: lesson.id }, id: lesson.id, label: 'Explore: ' + lesson.title });
    }
  } catch (_) { /* an invalid extension must not hide the original drawing */ }
  const available = options.filter(o => widgets[o.name] || chunkURL('w_' + o.name));
  if (!available.length) return;
  let name, params, open, openLabel, generation = 0;
  for (const option of available) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = option.original ? 'live-open' : 'lab-open';
    if (option.id) button.dataset.lessonId = option.id;
    if (option.original) {
      button.innerHTML = (option.three ? ICON_3D : ICON_PLAY) + '<span></span>';
      button.querySelector('span').textContent = option.label;
      try {
        if (localStorage.getItem('mw:stamp:' + option.name) === '1') {
          const stamp = document.createElement('em'); stamp.className = 'live-open-stamp';
          stamp.textContent = '✓'; stamp.title = 'Challenge completed'; button.append(stamp);
        }
      } catch (_) { /* notebook storage is optional */ }
    } else button.textContent = option.label;
    option.button = button;
    button.addEventListener('click', () => openLive(option));
    fig.insertBefore(button, fig.querySelector('figcaption'));
  }

  let w = null, inst = null, api = null, stage = null, controls = null, playing = false, raf = 0, last = 0, liftTimer = 0;
  let speed = 1;
  const state = { visible: true, t: 0, widgetName: null };
  state.setPlaying = setPlaying;
  state.setPlaybackSupported = (enabled) => {
    state.playbackSupported = enabled;
    playBtn.hidden = !enabled;
    speedBtn.hidden = !enabled;
    stepBtn.hidden = !enabled;
    if (!enabled && playing) setPlaying(false);
  };
  const originalFigureName = { label: fig.getAttribute('aria-label'), by: fig.getAttribute('aria-labelledby') };
  const playBtn = document.createElement('button');
  playBtn.type = 'button'; playBtn.className = 'live-ctl live-play';
  const speedBtn = document.createElement('button');
  speedBtn.type = 'button'; speedBtn.className = 'live-ctl live-speed';
  speedBtn.textContent = '0.25×'; speedBtn.setAttribute('aria-pressed', 'false');
  speedBtn.setAttribute('aria-label', 'Toggle slow motion');
  const stepBtn = document.createElement('button');
  stepBtn.type = 'button'; stepBtn.className = 'live-ctl live-step';
  stepBtn.textContent = 'Step'; stepBtn.setAttribute('aria-label', 'Step forward one frame');

  speedBtn.addEventListener('click', () => {
    speed = speed === 1 ? 0.25 : 1;
    speedBtn.setAttribute('aria-pressed', String(speed < 1));
    speedBtn.textContent = speed < 1 ? '0.25× Slow' : '0.25×';
  });
  stepBtn.addEventListener('click', () => {
    if (!api) return;
    if (playing) setPlaying(false);
    const stepDt = 0.08;
    state.t += stepDt;
    for (const fn of api._loops) fn(stepDt, state.t);
    api._ext.notifyChange('step');
  });

  function frame(ts) {
    const rawDt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
    const dt = rawDt * speed;
    last = ts; state.t += dt;
    const activeApi = api;
    for (const fn of activeApi._loops) {
      fn(dt, state.t);
      if (api !== activeApi || !playing) break;
    }
    if (api === activeApi && playing && state.visible) raf = requestAnimationFrame(frame);
  }
  function setPlaying(p) {
    p = !!p && state.playbackSupported !== false;
    playing = p;
    playBtn.textContent = p ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-pressed', String(p));
    fig.querySelectorAll('.live-readout').forEach(node => node.setAttribute('aria-live', p ? 'off' : 'polite'));
    cancelAnimationFrame(raf); last = 0;
    if (p && state.visible) raf = requestAnimationFrame(frame);
    else if (api) for (const fn of api._loops) fn(0, state.t); // draw one still frame
  }
  async function openLive(option, story = null) {
    const requestOrder=++liveRequestSequence;
    if (stage) closeLive(false);
    const ticket = ++generation;
    name = option.name; params = { ...option.params, story }; open = option.button; openLabel = option.label;
    const setLabel = text => { const span = option.button.querySelector('span'); if (span) span.textContent = text; else option.button.textContent = text; };
    if (!widgets[name]) {
      available.forEach(o => { o.button.disabled = true; }); setLabel('Loading…');
      try { await loadChunk('w_' + name); } catch (e) { /* reported below */ }
      if (ticket !== generation || requestOrder!==liveRequestSequence) {
        if(ticket===generation)available.forEach(o=>{o.button.disabled=false;});
        setLabel(option.label);return;
      }
      available.forEach(o => { o.button.disabled = false; }); setLabel(openLabel);
      if (!widgets[name]) {
        let msg = fig.querySelector('.live-fail');
        if (!msg) { msg = document.createElement('p'); msg.className = 'live-note live-warn live-fail'; msg.setAttribute('role', 'status'); fig.insertBefore(msg, open.nextSibling); }
        msg.textContent = location.protocol === 'file:'
          ? 'This live figure loads from the web. Open the book from its website (or a local server) to use it.'
          : 'This live figure could not load. Check the connection and try again.';
        return;
      }
    }
    w = widgets[name];
    fig.querySelector('.live-fail')?.remove();
    fig.classList.add('live-on');
    if (params.lesson) {
      fig.dataset.activeLesson = params.lesson;
      fig.setAttribute('aria-label', option.label.replace(/^Explore:\s*/, ''));
      fig.removeAttribute('aria-labelledby');
    }
    if (!isReducedMotion()) {
      fig.classList.add('live-lifting');
      clearTimeout(liftTimer);
      liftTimer = setTimeout(() => fig.classList.remove('live-lifting'), 520);
    }
    if (window.__bookSound) window.__bookSound.play('flap');
    stage = document.createElement('div'); stage.className = 'live-stage';
    controls = document.createElement('div'); controls.className = 'live-controls';
    fig.insertBefore(stage, open); fig.insertBefore(controls, open);
    state.t = 0;
    speed = 1;
    speedBtn.setAttribute('aria-pressed', 'false');
    speedBtn.textContent = '0.25×';
    state.widgetName = name;
    state.playbackSupported = !w.meta.static;
    playBtn.hidden = !state.playbackSupported;
    speedBtn.hidden = !state.playbackSupported;
    stepBtn.hidden = !state.playbackSupported;
    api = makeApi(fig, stage, controls, state);
    if (!w.meta.static) controls.append(playBtn, speedBtn, stepBtn);
    try { inst = w.factory(stage, params, api) || {}; }
    catch (_) {
      closeLive(false);
      const message = document.createElement('p');
      message.className = 'live-note live-fail'; message.setAttribute('role', 'status');
      message.textContent = 'This experiment could not open here. The drawing remains available; try opening it again.';
      fig.insertBefore(message, open); return;
    }
    attachEnhancements(name, fig, stage, controls, api, open);

    const ext = api._ext;
    const initialSliders = ext.sliders.map((s) => s.input.value);
    const initialTabs = ext.tabGroups.map((g) => g.activeIdx);

    const resetSim = () => {
      if (playing) setPlaying(false);
      speed = 1;
      speedBtn.setAttribute('aria-pressed', 'false');
      speedBtn.textContent = '0.25×';
      state.t = 0;
      ext.sonify?.set(false);
      ext.setCutaway?.(false);
      ext.setSpecimen?.(false);
      if (typeof ext.resetFn === 'function') {
        try { ext.resetFn(); } catch (e) { /* ignore */ }
      } else {
        ext.tabGroups.forEach((g, idx) => {
          const targetIdx = initialTabs[idx] ?? 0;
          if (g.btns[targetIdx] && g.activeIdx !== targetIdx) g.btns[targetIdx].click();
        });
        ext.sliders.forEach((s, idx) => {
          const v = initialSliders[idx];
          if (v !== undefined) s.drive(v);
        });
        ext.trials?.clear();
      }
      for (const fn of api._loops) fn(0, state.t);
      ext.notifyChange('reset');
    };

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button'; resetBtn.className = 'live-ctl live-reset';
    resetBtn.textContent = '↺ Reset'; resetBtn.setAttribute('aria-label', 'Reset simulation');
    resetBtn.addEventListener('click', resetSim);
    controls.appendChild(resetBtn);

    const prefsBtn = document.createElement('button');
    prefsBtn.type = 'button'; prefsBtn.className = 'live-ctl live-prefs-btn';
    prefsBtn.textContent = '⚙'; prefsBtn.setAttribute('aria-label', 'Simulation preferences');
    prefsBtn.setAttribute('aria-expanded', 'false');

    const keysBtn = document.createElement('button');
    keysBtn.type = 'button'; keysBtn.className = 'live-ctl live-keys-btn';
    keysBtn.textContent = '?'; keysBtn.setAttribute('aria-label', 'Keyboard shortcuts');
    keysBtn.setAttribute('aria-expanded', 'false');

    const prefsPanel = document.createElement('div');
    prefsPanel.className = 'live-panel live-prefs-panel';
    prefsPanel.hidden = true;
    const mkPref = (label, checked, onChange) => {
      const l = document.createElement('label');
      l.className = 'live-check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = !!checked;
      const sp = document.createElement('span');
      sp.textContent = label;
      l.append(inp, sp);
      inp.addEventListener('change', () => onChange(inp.checked, inp));
      return { l, inp };
    };
    let savedHi = false;
    try { savedHi = localStorage.getItem('mw:prefs:highlights') === '1'; } catch (_) {}
    if (savedHi) fig.dataset.interactiveHighlights = '1';
    const hiPref = mkPref('Interactive highlights', fig.dataset.interactiveHighlights === '1', (on) => {
      if (on) fig.dataset.interactiveHighlights = '1';
      else delete fig.dataset.interactiveHighlights;
      try {
        if (on) localStorage.setItem('mw:prefs:highlights', '1');
        else localStorage.removeItem('mw:prefs:highlights');
      } catch (_) {}
    });
    const calmPref = mkPref('Calm background motion', ext.calm, (on) => ext.setCalm(on));
    prefsPanel.append(hiPref.l, calmPref.l);
    let sonifyPref = null;
    if (ext.sonify) {
      sonifyPref = mkPref('Audio sonification', ext.sonify.active, (on) => ext.sonify.set(on));
      prefsPanel.append(sonifyPref.l);
      ext.changeListeners.add(() => {
        if (sonifyPref) sonifyPref.inp.checked = ext.sonify.active;
      });
    }
    const linkBtn = document.createElement('button');
    linkBtn.type = 'button';
    linkBtn.className = 'live-ctl live-link-btn';
    linkBtn.textContent = 'Copy state link';
    linkBtn.addEventListener('click', () => {
      const entry = kymIORegistry.get(name);
      const url = entry ? encodePresetURL(name, entry.getState()) : location.href;
      try { navigator.clipboard?.writeText(url); } catch (_) { /* optional */ }
      const prev = linkBtn.textContent;
      linkBtn.textContent = 'Link copied';
      setTimeout(() => { linkBtn.textContent = prev; }, 1400);
    });
    prefsPanel.appendChild(linkBtn);

    const keysPanel = document.createElement('div');
    keysPanel.className = 'live-panel live-keys-panel';
    keysPanel.hidden = true;
    keysPanel.innerHTML = '<dl class="live-keys-grid">' +
      '<div><dt><kbd>Space</kbd></dt><dd>Play / Pause</dd></div>' +
      '<div><dt><kbd>.</kbd></dt><dd>Step frame</dd></div>' +
      '<div><dt><kbd>R</kbd></dt><dd>Reset simulation</dd></div>' +
      '<div><dt><kbd>C</kbd></dt><dd>Toggle Cut-away</dd></div>' +
      '<div><dt><kbd>M</kbd></dt><dd>Toggle Real specimen</dd></div>' +
      '<div><dt><kbd>1–5</kbd></dt><dd>Guided tour shot</dd></div>' +
      '<div><dt><kbd>Esc</kbd></dt><dd>Close open panels</dd></div>' +
      '</dl>';

    const setPanels = (which) => {
      const openPrefs = which === 'prefs' ? prefsPanel.hidden : false;
      const openKeys = which === 'keys' ? keysPanel.hidden : false;
      prefsPanel.hidden = !openPrefs;
      keysPanel.hidden = !openKeys;
      prefsBtn.setAttribute('aria-expanded', String(openPrefs));
      keysBtn.setAttribute('aria-expanded', String(openKeys));
    };
    prefsBtn.addEventListener('click', () => setPanels('prefs'));
    keysBtn.addEventListener('click', () => setPanels('keys'));

    const close = document.createElement('button');
    close.type = 'button'; close.className = 'live-ctl live-close'; close.textContent = 'Back to the drawing';
    close.addEventListener('click', () => closeLive());
    controls.appendChild(close);
    const detail = document.createElement('button');
    detail.type = 'button'; detail.className = 'live-ctl live-detail-toggle';
    detail.textContent = 'Full-size drawing'; detail.setAttribute('aria-pressed', 'false');
    const detailHint = document.createElement('p');
    detailHint.className = 'live-detail-hint'; detailHint.hidden = true;
    detailHint.textContent = params.lesson ? 'Scroll sideways in the drawing to see all of it.' : 'Scroll sideways to see the full drawing. The controls below still work.';
    controls.append(detail, prefsBtn, keysBtn, prefsPanel, keysPanel, detailHint);
    detail.addEventListener('click', () => {
      const full = stage.classList.toggle('live-inspect');
      detail.setAttribute('aria-pressed', String(full));
      detail.textContent = full ? 'Fit drawing' : 'Full-size drawing';
      detailHint.hidden = !full;
      if (params.lesson) {
        const diagram = stage.querySelector('.lab-diagram-scroll');
        diagram?.setAttribute('aria-label', full ? 'Full-size calculated drawing. Scroll horizontally to inspect it.' : 'Calculated drawing and measurements.');
        diagram?.focus();
      } else if (full) {
        stage.tabIndex = 0;
        stage.setAttribute('role', 'region');
        stage.setAttribute('aria-label', 'Full-size live drawing. Scroll horizontally to explore.');
      } else {
        stage.removeAttribute('tabindex'); stage.removeAttribute('role'); stage.removeAttribute('aria-label');
        stage.scrollLeft = 0;
      }
      // Canvas ResizeObservers redraw the same state; this changes no physical input or clock.
    });

    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        if (!prefsPanel.hidden) { setPanels('none'); prefsBtn.focus({ preventScroll: true }); e.preventDefault(); return; }
        if (!keysPanel.hidden) { setPanels('none'); keysBtn.focus({ preventScroll: true }); e.preventDefault(); return; }
        if (ext.isSpecimen?.()) { ext.setSpecimen(false); fig.querySelector('.live-specimen-btn')?.focus({ preventScroll: true }); e.preventDefault(); return; }
        if (ext.isCutaway?.()) { ext.setCutaway(false); e.preventDefault(); return; }
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === ' ' && state.playbackSupported !== false) {
        if (tag === 'BUTTON' || tag === 'SUMMARY' || tag === 'A') return;
        e.preventDefault();
        setPlaying(!playing);
      } else if (e.key === '.' && state.playbackSupported !== false) {
        e.preventDefault();
        stepBtn.click();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetSim();
      } else if ((e.key === 'c' || e.key === 'C') && ext.setCutaway) {
        e.preventDefault();
        ext.setCutaway(!ext.isCutaway?.());
      } else if ((e.key === 'm' || e.key === 'M') && ext.setSpecimen) {
        e.preventDefault();
        ext.setSpecimen(!ext.isSpecimen?.());
      } else if (/^[1-5]$/.test(e.key) && ext.watchCtrl) {
        const idx = Number(e.key) - 1;
        if (idx < ext.watchCtrl.count) {
          e.preventDefault();
          ext.watchCtrl.stopTour();
          ext.watchCtrl.applyShot(idx);
        }
      }
    };
    fig.addEventListener('keydown', onKeyDown);
    api._cleanups.push(() => fig.removeEventListener('keydown', onKeyDown));

    const getIOState = () => ({
      name,
      sliders: ext.sliders.map((s) => ({ label: s.label, value: Number(s.input.value), min: Number(s.input.min), max: Number(s.input.max) })),
      tabs: ext.tabGroups.map((g) => g.activeIdx),
      readout: ext.readoutText || '',
      stamped: !!ext.isStamped?.(),
      cutaway: !!ext.isCutaway?.(),
      specimen: !!ext.isSpecimen?.(),
      trials: ext.trials ? ext.trials.rows() : [],
      custom: ext.io?.getState ? ext.io.getState() : null,
    });
    const setIOState = (patch = {}) => {
      if (!patch || typeof patch !== 'object') return false;
      if (patch.reset) { resetSim(); return true; }
      if (Array.isArray(patch.tabs)) {
        patch.tabs.forEach((tabIdx, groupIdx) => {
          const g = ext.tabGroups[groupIdx];
          if (g && g.btns[tabIdx]) g.btns[tabIdx].click();
        });
      }
      if (Array.isArray(patch.sliders)) {
        patch.sliders.forEach((val, idx) => {
          const s = ext.sliders[idx];
          if (s && val !== undefined) s.drive(val);
        });
      } else if (patch.sliders && typeof patch.sliders === 'object') {
        Object.entries(patch.sliders).forEach(([k, v]) => {
          const s = ext.sliders.find((x) => x.label.toLowerCase().includes(k.toLowerCase()));
          if (s) s.drive(v);
        });
      }
      if (typeof patch.watchStep === 'number' && ext.watchCtrl) {
        ext.watchCtrl.stopTour();
        ext.watchCtrl.applyShot(patch.watchStep);
      }
      if (typeof patch.cutaway === 'boolean') ext.setCutaway?.(patch.cutaway);
      if (typeof patch.specimen === 'boolean') ext.setSpecimen?.(patch.specimen);
      if (patch.custom && ext.io?.setState) ext.io.setState(patch.custom);
      ext.notifyChange('io');
      return true;
    };
    const activeWidgetName = name;
    kymIORegistry.set(activeWidgetName, {
      getState: getIOState,
      setState: setIOState,
      captureSnapshot: () => {
        for (const fn of api._loops) fn(0, state.t);
        const st = getIOState();
        const pngBase64 = captureCompositePNG(stage, ext);
        return {
          widgetId: activeWidgetName,
          readout: st.readout,
          state: st,
          trials: st.trials,
          trialsMarkdown: ext.trials ? ext.trials.toMarkdown() : '',
          pngBase64,
        };
      },
    });
    api._cleanups.push(() => { kymIORegistry.delete(activeWidgetName); });

    const urlPreset = readPresetFromURL(name);
    if (urlPreset) setIOState(urlPreset);

    fig.tabIndex = -1;
    available.forEach(o => { o.button.hidden = true; });
    setPlaying(!params.lesson && !api.reduced && !w.meta.static);
    if (params.lesson) for (const fn of api._loops) fn(0, 0);
    if (w.meta.static) for (const fn of api._loops) fn(0, 0);
    (stage.querySelector('.live-3d[tabindex],canvas[tabindex],button,input')
      || controls.querySelector('button:not([hidden]),input')
      || fig).focus?.({ preventScroll: true });
  }
  function closeLive(restoreFocus = true) {
    ++generation; // Also cancels a story experiment whose module is still loading.
    clearTimeout(liftTimer);
    cancelAnimationFrame(raf);
    inst?.destroy?.();
    api?._cleanups.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    stage?.remove(); controls?.remove();
    fig.classList.remove('live-on', 'live-lifting');
    delete fig.dataset.activeLesson;
    delete fig.dataset.calmMotion;
    delete fig.dataset.interactiveHighlights;
    fig.removeAttribute('tabindex');
    for (const [attribute, value] of [['aria-label', originalFigureName.label], ['aria-labelledby', originalFigureName.by]]) {
      if (value === null) fig.removeAttribute(attribute); else fig.setAttribute(attribute, value);
    }
    available.forEach(o => { o.button.hidden = false;o.button.disabled=false;const span=o.button.querySelector('span');if(span)span.textContent=o.label;else o.button.textContent=o.label; });
    if (restoreFocus) open?.focus({ preventScroll: true });
    inst = api = stage = controls = null; playing = false;
  }
  playBtn.addEventListener('click', () => setPlaying(!playing));
  fig.addEventListener('open-lesson', e => {
    const option = available.find(o => o.id === e.detail?.id);
    if (option) openLive(option, e.detail?.story || null);
  });
  fig.addEventListener('close-lesson', () => closeLive(false));
  window.addEventListener('still:change', (e) => {
    if (!api || !w) return;
    const stillOn = !!(e.detail && e.detail.still);
    if (stillOn && playing) setPlaying(false);
    else if (!stillOn && !params.lesson && state.playbackSupported && !playing) setPlaying(true);
  });
  // pause while off screen (animation, sound, sensors, video), resume the animation when back
  const handleVisibility = (vis) => {
    state.visible = vis;
    if (!api) return;
    cancelAnimationFrame(raf); last = 0;
    if (state.visible && playing) raf = requestAnimationFrame(frame);
    if (!state.visible) api._hides.forEach((f) => { try { f(); } catch (err) { console.error(err); } });
  };
  fig.addEventListener('contentvisibilityautostatechange', (e) => {
    handleVisibility(!e.skipped);
  });
  if (!('contentVisibility' in document.documentElement.style)) {
    new IntersectionObserver((ents) => {
      for (const e of ents) handleVisibility(e.isIntersecting);
    }, { rootMargin: '200px', threshold: 0.05 }).observe(fig);
  } else {
    new IntersectionObserver((ents) => {
      for (const e of ents) handleVisibility(e.isIntersecting);
    }, { threshold: 0.05 }).observe(fig);
  }
}

// Lazy chunks import this module's exports through the page's copy (see build_chunks in build.py):
// every export must be listed here.
window.__liveModule = { Live, colors, draw, rng, gauss, loadChunk };

function init() {
  document.querySelectorAll('figure[data-live],figure[data-labs]').forEach(setup);
  try {
    const rawPreset = new URLSearchParams(location.search).get('wpreset');
    const sep = rawPreset ? rawPreset.indexOf(':') : -1;
    if (sep > 0) {
      const targetWid = rawPreset.slice(0, sep);
      const fig = document.querySelector(`figure[data-live="${targetWid}"]`);
      const openBtn = fig?.querySelector('.live-open');
      if (fig && openBtn) {
        window.App?.reveal?.(fig);
        fig.scrollIntoView({ block: 'center' });
        openBtn.click();
      }
    }
  } catch (_) { /* ignore malformed preset param */ }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
