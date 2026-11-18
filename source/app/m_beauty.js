// The look of the book, brought to life — Herbarium Copperplate & Cellular Stipple Edition.
//   - the cover: organic spores, pollen grains and cytoplasmic vesicles drifting in gentle Brownian motion
//   - volume pages: four authentic biological stipple motifs (build.py MOTIFS:
//     I cloud -> dividing cellular tissue & cytoplasmic streaming;
//     II balance -> golden-angle leaf phyllotaxis & rotating F1 ATP synthase rotor;
//     III lattice -> arterial-bronchial branching tree & neural action-potential pulses;
//     IV field -> rotating antiparallel B-DNA double helix with paired base rungs)
//   - medallions for the biologists in the book: copperplate double-ring engravings with domain emblems
//   - a collapsible chapter spine in the left margin on wide screens
import App from './core.js';

const motionOK = () => !App.reduceMotion();

// ------------------------------------------------------------------ helpers
function rng(seed) {             // mulberry32
  let a = 0;
  for (const ch of String(seed)) a = (a * 31 + ch.charCodeAt(0)) >>> 0;
  a = a || 0x9e3779b9;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

function cssVar(el, name, fallback) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

function fit(canvas) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function animateWhileVisible(el, setup) {
  let raf = 0, visible = false, last = 0, state = null;
  const start = () => {
    if (!state) state = setup();
    if (!state) return;
    if (!motionOK()) { cancelAnimationFrame(raf); raf = 0; state.draw(0, 0); return; }
    if (raf) return;
    last = performance.now();
    const tick = now => {
      if (!motionOK()) { raf = 0; state.draw(now, 0); return; }
      const dt = Math.max(0, Math.min(64, now - last)); last = now;
      state.draw(now, dt);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => {
    for (const e of es) { visible = e.isIntersecting; if (visible) start(); else { cancelAnimationFrame(raf); raf = 0; } }
  }, { rootMargin: '80px' });
  io.observe(el);
  return { redraw() { state = null; if (visible) { cancelAnimationFrame(raf); raf = 0; start(); } } };
}

// ------------------------------------------------------------------ cover: Brownian spores & vesicles
function cover() {
  const host = document.querySelector('.cover');
  const canvas = host && host.querySelector('canvas.field');
  if (!canvas) return null;
  return animateWhileVisible(host, () => {
    const { ctx, w, h } = fit(canvas);
    const r = rng('cover-bio');
    const n = Math.round(Math.min(720, w * h / 1700));
    const pts = Array.from({ length: n }, (_, i) => ({
      x: r() * w, y: r() * h,
      s: .75 + r() * 1.45,
      a: .09 + r() * .20,
      ring: i % 19 === 0,
    }));
    const ink = cssVar(host, '--ink', '#182b24');
    const green = cssVar(host, '--green', '#1e5e45');
    return {
      draw(t, dt) {
        const k = dt ? Math.sqrt(dt / 16) * .28 : 0;
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          if (k) {
            p.x += gauss(Math.random) * k * (1.5 - p.s * .45);
            p.y += gauss(Math.random) * k * (1.5 - p.s * .45);
            if (p.x < 0) p.x += w; else if (p.x > w) p.x -= w;
            if (p.y < 0) p.y += h; else if (p.y > h) p.y -= h;
          }
          ctx.globalAlpha = p.a;
          if (p.ring) {
            ctx.strokeStyle = green;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2.2, 0, 6.2832); ctx.stroke();
          }
          ctx.fillStyle = ink;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      },
    };
  });
}

// ------------------------------------------------------------------ biology volume motifs
const MOTIFS = {
  // Volume I (The Scene of the Crime & The Nanotech City):
  // A living cluster of eukaryotic cells with stippled double membranes, dark nucleoli, and
  // cytoplasmic vesicles streaming along internal tracks around each nucleus.
  cloud(ctx, w, h, col, r) {
    const cx = w * .52, cy = h * .50, S = Math.min(w, h) * .42;
    const cells = [
      { x: cx - S * .36, y: cy - S * .22, rx: S * .42, ry: S * .34, rot: -0.22 },
      { x: cx + S * .32, y: cy - S * .16, rx: S * .38, ry: S * .31, rot: 0.28 },
      { x: cx - S * .08, y: cy + S * .32, rx: S * .44, ry: S * .35, rot: 0.08 },
      { x: cx + S * .38, y: cy + S * .30, rx: S * .30, ry: S * .26, rot: -0.35 },
    ];
    const dots = [];
    const vesicles = [];
    cells.forEach((c, idx) => {
      const cs = Math.cos(c.rot), sn = Math.sin(c.rot);
      const pt = (u, v) => [c.x + u * cs - v * sn, c.y + u * sn + v * cs];
      // Stippled lipid bilayer perimeter (two concentric rings)
      for (let i = 0; i < 320; i++) {
        const th = (i / 320) * 6.2832;
        for (const scale of [0.96, 1.03]) {
          const [px, py] = pt(Math.cos(th) * c.rx * scale, Math.sin(th) * c.ry * scale);
          dots.push([px + gauss(r) * .55, py + gauss(r) * .55, 0.55]);
        }
      }
      // Stippled nucleus & dense nucleolus inside each cell
      const nR = Math.min(c.rx, c.ry) * 0.34;
      for (let i = 0; i < 220; i++) {
        const rr = Math.sqrt(r()) * nR, th = r() * 6.2832;
        const [px, py] = pt(Math.cos(th) * rr - c.rx * .12, Math.sin(th) * rr);
        dots.push([px, py, rr < nR * 0.38 ? 0.85 : 0.38]);
      }
      // Cytoplasmic streaming vesicles orbiting along cytoskeleton track
      for (let k = 0; k < 5; k++) {
        vesicles.push({ c, cs, sn, phase: (idx * .19 + k * .2) % 1, speed: 0.00018 + k * 0.00003 });
      }
    });
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = col.ink;
      for (const [x, y, a] of dots) {
        ctx.globalAlpha = a * .42;
        ctx.fillRect(x, y, 1.25, 1.25);
      }
      ctx.fillStyle = col.vol;
      for (const v of vesicles) {
        if (dt) v.phase = (v.phase + dt * v.speed) % 1;
        const th = v.phase * 6.2832;
        const ux = Math.cos(th) * v.c.rx * 0.68, uy = Math.sin(th) * v.c.ry * 0.68;
        const px = v.c.x + ux * v.cs - uy * v.sn;
        const py = v.c.y + ux * v.sn + uy * v.cs;
        ctx.globalAlpha = 0.82;
        ctx.beginPath(); ctx.arc(px, py, 2.7, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
  },

  // Volume II (Molecular Locks & The Energy Heist):
  // Golden-angle botanical phyllotaxis spiral (137.508°) capturing photons toward a central
  // 6-subunit F1 ATP Synthase rotor.
  balance(ctx, w, h, col, r) {
    const cx = w * .52, cy = h * .50, S = Math.min(w, h) * .44;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const seeds = [];
    for (let i = 12; i < 240; i++) {
      const rad = Math.sqrt(i / 240) * S;
      const th = i * golden;
      const x = cx + Math.cos(th) * rad, y = cy + Math.sin(th) * rad;
      const fade = Math.max(0.15, 1 - (rad / S) * 0.65);
      for (let d = 0; d < 6; d++) {
        seeds.push([x + gauss(r) * 1.4, y + gauss(r) * 1.4, fade]);
      }
    }
    let rotorAngle = 0;
    return (t, dt) => {
      if (dt) rotorAngle = (rotorAngle + dt * 0.0008) % (Math.PI * 2);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = col.ink;
      for (const [x, y, f] of seeds) {
        ctx.globalAlpha = f * .40;
        ctx.fillRect(x, y, 1.3, 1.3);
      }
      // Central 6-subunit F1 ATP synthase hexamer rotor
      const rSub = S * 0.16;
      for (let k = 0; k < 6; k++) {
        const th = rotorAngle + (k * Math.PI) / 3;
        const sx = cx + Math.cos(th) * rSub, sy = cy + Math.sin(th) * rSub;
        ctx.globalAlpha = k % 2 === 0 ? 0.85 : 0.55;
        ctx.fillStyle = k % 2 === 0 ? col.vol : col.proton;
        ctx.beginPath(); ctx.arc(sx, sy, 6.2, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = col.ink;
      ctx.beginPath(); ctx.arc(cx, cy, 4.2, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    };
  },

  // Volume III (The Human Orchestra):
  // Branching physiological bronchial / arterial tree (Murray's law bifurcation) with
  // rhythmic oxygen/action-potential pulses travelling from trunk to terminal alveoli.
  lattice(ctx, w, h, col, r) {
    const segs = [];
    const buildBranch = (x1, y1, len, angle, depth) => {
      if (depth <= 0 || len < 6) return;
      const x2 = x1 + Math.cos(angle) * len;
      const y2 = y1 + Math.sin(angle) * len;
      segs.push({ x1, y1, x2, y2, depth });
      const spread = 0.42 + (6 - depth) * 0.03;
      buildBranch(x2, y2, len * 0.74, angle - spread, depth - 1);
      buildBranch(x2, y2, len * 0.74, angle + spread, depth - 1);
    };
    const S = Math.min(w, h);
    buildBranch(w * .52, h * .84, S * .22, -Math.PI / 2, 6);
    const dots = [];
    const alveoli = [];
    for (const s of segs) {
      const steps = Math.max(8, Math.round(Math.hypot(s.x2 - s.x1, s.y2 - s.y1) * 1.4));
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const px = s.x1 + (s.x2 - s.x1) * u, py = s.y1 + (s.y2 - s.y1) * u;
        const spread = s.depth * 0.45;
        dots.push([px + gauss(r) * spread, py + gauss(r) * spread, 0.32 + s.depth * 0.08]);
      }
      if (s.depth === 1) alveoli.push([s.x2, s.y2]);
    }
    let pulse = 0;
    return (t, dt) => {
      if (dt) pulse = (pulse + dt / 2400) % 1;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = col.ink;
      for (const [x, y, a] of dots) {
        ctx.globalAlpha = a * .45;
        ctx.fillRect(x, y, 1.2, 1.2);
      }
      ctx.fillStyle = col.vol;
      for (const [ax, ay] of alveoli) {
        ctx.globalAlpha = 0.48;
        ctx.beginPath(); ctx.arc(ax, ay, 3.4, 0, 6.2832); ctx.fill();
      }
      // Travelling physiological wave along the branching levels
      const targetDepth = 6 - pulse * 5.5;
      ctx.fillStyle = col.proton;
      for (const s of segs) {
        const dist = Math.abs(s.depth - targetDepth);
        if (dist < 0.85) {
          const frac = 1 - (targetDepth - Math.floor(targetDepth));
          const px = s.x1 + (s.x2 - s.x1) * frac, py = s.y1 + (s.y2 - s.y1) * frac;
          ctx.globalAlpha = (1 - dist / 0.85) * 0.85;
          ctx.beginPath(); ctx.arc(px, py, 2.8, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };
  },

  // Volume IV (The Master Code & The Four-Billion-Year Case File):
  // Antiparallel B-DNA double helix with 10 base pairs per turn, major/minor groove spacing,
  // and complementary hydrogen-bonded rungs rotating gently in 3D projection.
  field(ctx, w, h, col, r) {
    const cx = w * .52, topY = h * .10, spanY = h * .80;
    const radius = Math.min(w, h) * .18;
    const bgDots = [];
    for (let i = 0; i < 600; i++) {
      const u = i / 600;
      const y = topY + u * spanY;
      const th = u * Math.PI * 3.6;
      for (const offset of [0, 2.55]) {
        const x = cx + Math.sin(th + offset) * radius;
        bgDots.push([x + gauss(r) * 1.1, y + gauss(r) * 1.1, 0.42]);
      }
    }
    let phase = 0;
    return (t, dt) => {
      if (dt) phase = (phase + dt * 0.0009) % (Math.PI * 2);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = col.ink;
      for (const [x, y, a] of bgDots) {
        ctx.globalAlpha = a * .32;
        ctx.fillRect(x, y, 1.15, 1.15);
      }
      const rungs = 22;
      for (let i = 0; i <= rungs; i++) {
        const u = i / rungs;
        const y = topY + u * spanY;
        const th = u * Math.PI * 3.4 + phase;
        const x1 = cx + Math.sin(th) * radius;
        const x2 = cx + Math.sin(th + 2.55) * radius; // asymmetric major & minor grooves!
        const z1 = Math.cos(th);
        // Base-pair rung
        ctx.strokeStyle = i % 2 === 0 ? col.vol : col.proton;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
        // Sugar-phosphate backbone beads
        ctx.fillStyle = col.ink;
        ctx.globalAlpha = 0.55 + 0.35 * (z1 * 0.5 + 0.5);
        ctx.beginPath(); ctx.arc(x1, y, 2.8, 0, 6.2832); ctx.fill();
        ctx.fillStyle = col.vol;
        ctx.beginPath(); ctx.arc(x2, y, 2.8, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
  },
};

function volumes() {
  return [...document.querySelectorAll('.vol-art[data-motif]')].map(box => {
    const canvas = box.querySelector('canvas');
    const make = MOTIFS[box.dataset.motif];
    if (!canvas || !make) return null;
    return animateWhileVisible(box, () => {
      const { ctx, w, h } = fit(canvas);
      const sec = box.closest('.volume') || box;
      const col = { vol: cssVar(sec, '--vol', '#1e5e45'), ink: cssVar(sec, '--ink', '#182b24'), proton: cssVar(sec, '--proton', '#b8432f') };
      const draw = make(ctx, w, h, col, rng(box.dataset.motif));
      return { draw };
    });
  }).filter(Boolean);
}

// ------------------------------------------------------------------ medallions (engraved copperplate + domain ring)
function medal(el) {
  const canvas = el.querySelector('canvas');
  if (!canvas) return;
  const { ctx, w, h } = fit(canvas);
  if (w < 4) return;
  const seed = el.dataset.seed || 'x';
  const r = rng(seed);
  const host = el.closest('[data-vol], .story, .cast-page') || el;
  const col = cssVar(el, '--vol', cssVar(host, '--vol', '#1e5e45'));
  const ink = cssVar(el, '--ink', '#182b24');
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 1.5;
  const lx = -0.55, ly = -0.65;
  const n = Math.round(R * R * 1.25);
  ctx.clearRect(0, 0, w, h);

  // Outer copperplate double ring
  ctx.strokeStyle = col;
  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 1.25;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
  ctx.globalAlpha = 0.30;
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(cx, cy, R - 3, 0, 6.2832); ctx.stroke();

  // Stippled portrait relief shading
  ctx.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const rr = Math.sqrt(r()) * (R - 3.5), th = r() * 6.2832;
    const x = Math.cos(th) * rr, y = Math.sin(th) * rr;
    const shade = .48 - (x * lx + y * ly) / R * .42 + (rr / R) * .18;
    if (r() > shade * 1.05) continue;
    ctx.globalAlpha = .30 + shade * .50;
    ctx.beginPath(); ctx.arc(cx + x, cy + y, .6 + shade * .3, 0, 6.2832); ctx.fill();
  }

  // Subtle botanical/microscope compass ticks at N/E/S/W of medallion
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.1;
  for (let k = 0; k < 4; k++) {
    const th = (k * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(th) * (R - 4.5), cy + Math.sin(th) * (R - 4.5));
    ctx.lineTo(cx + Math.cos(th) * R, cy + Math.sin(th) * R);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  el.classList.add('drawn');
}

function medals() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { medal(e.target); io.unobserve(e.target); } }), { rootMargin: '200px' });
  document.querySelectorAll('.medal[data-seed]').forEach(m => io.observe(m));
  App.on('story:open', d => { const m = d && d.el && d.el.querySelector('.medal'); if (m) requestAnimationFrame(() => medal(m)); });
  return { redraw() { document.querySelectorAll('.medal.drawn').forEach(medal); } };
}

// ------------------------------------------------------------------ chapter spine
function spine() {
  const chapters = [...document.querySelectorAll('article.chapter')];
  if (!chapters.length) return;
  const nav = App.el('nav', { class: 'spine', 'aria-label': 'Sections of this chapter', hidden: true });
  document.body.append(nav);
  let current = null, curSec = null;
  let collapsed = !!(App.store && App.store.get('spineCollapsed', false));
  const syncCollapsed = () => {
    document.documentElement.classList.toggle('spine-collapsed', collapsed);
    const btn = nav.querySelector('.sp-toggle');
    if (btn) {
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.setAttribute('aria-label', collapsed ? 'Show chapter contents (Command+Backslash)' : 'Hide chapter contents (Command+Backslash)');
      btn.textContent = collapsed ? 'Contents' : 'Hide contents';
    }
  };
  const toggleSpine = () => {
    collapsed = !collapsed;
    if (App.store) App.store.set('spineCollapsed', collapsed);
    syncCollapsed();
  };
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); toggleSpine(); }
  });
  const build = ch => {
    const n = ch.querySelector('.opener .cl')?.textContent || '';
    const title = ch.querySelector('.opener h2')?.textContent || '';
    const items = [...ch.querySelectorAll('section.sec[id]')].map(s => {
      const num = s.querySelector('h3 .n')?.textContent || '';
      const h = s.querySelector('h3')?.cloneNode(true); h?.querySelector('.n')?.remove();
      return App.el('li', {}, App.el('a', { href: '#' + s.id, 'data-sec': s.id },
        App.el('span', { class: 'sp-n' }, num), App.el('span', { class: 'sp-t' }, (h?.textContent || '').trim())));
    });
    const toggleBtn = App.el('button', { type: 'button', class: 'sp-toggle', onclick: toggleSpine }, collapsed ? 'Contents' : 'Hide contents');
    nav.replaceChildren(
      toggleBtn,
      App.el('a', { class: 'sp-ch', href: '#' + ch.id }, App.el('span', { class: 'sp-k' }, n), App.el('span', { class: 'sp-h' }, title)),
      App.el('ol', {}, items));
    syncCollapsed();
  };
  const setSec = id => {
    if (id === curSec) return; curSec = id;
    nav.querySelectorAll('a[data-sec]').forEach(a => { if (a.dataset.sec === id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  };
  const chIO = new IntersectionObserver(es => {
    for (const e of es) {
      if (e.isIntersecting && e.target !== current) { current = e.target; build(current); curSec = null; }
      if (!e.isIntersecting && e.target === current) { current = null; }
    }
    nav.hidden = !current;
  }, { rootMargin: '-45% 0px -50% 0px' });
  chapters.forEach(c => chIO.observe(c));
  const secIO = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) setSec(e.target.id);
  }, { rootMargin: '-38% 0px -60% 0px' });
  document.querySelectorAll('article.chapter section.sec[id]').forEach(s => secIO.observe(s));
  const opIO = new IntersectionObserver(es => es.forEach(e => nav.classList.toggle('quiet', e.isIntersecting && e.target.closest('article') === current)), { threshold: .25 });
  document.querySelectorAll('article.chapter .opener').forEach(o => opIO.observe(o));
}

// ------------------------------------------------------------------ boot
App.ready(() => {
  const parts = [cover(), ...volumes(), medals()].filter(Boolean);
  spine();
  let rt = 0;
  const redraw = () => { clearTimeout(rt); rt = setTimeout(() => parts.forEach(p => p.redraw && p.redraw()), 150); };
  window.addEventListener('resize', redraw);
  App.on('still:change', () => parts.forEach(p => p.redraw && p.redraw()));
  try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw); } catch (e) {}
  new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });
});
