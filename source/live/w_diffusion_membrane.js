import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { makeWalk } from './transport_model.js';

Live.register('diffusion_membrane', (stage, params, api) => {
  let initial = 80;
  let open = true;
  let channelMode = 'bilayer'; // 'bilayer' | 'protein' | 'blocked'
  let walk = makeWalk(31, initial);
  let accumulator = 0;
  let phaseT = 0;
  let flashRight = 0;
  let flashLeft = 0;
  let lastSoundAt = 0;

  const W = 640;
  const H = 360;
  const k = makeCanvas(
    api,
    W,
    H,
    'Phospholipid bilayer random-walk chamber with 100 solute particles, concentration bars, interactive membrane channel slots, and separate leftward/rightward crossing counts.'
  );
  const say = api.readout();
  const sonify = api.sonifyToggle('Stereo crossing sounds');
  const trials = api.trials({
    columns: ['Step', 'Mode', 'Left', 'Right', 'L→R', 'R→L', 'Net'],
    maxRows: 6,
    plotColumn: 'Net',
  });

  const TOOL_SLOTS = [
    { id: 'bilayer', label: 'Simple bilayer', x: 96, w: 140 },
    { id: 'protein', label: 'Protein pore (2×)', x: 248, w: 152 },
    { id: 'blocked', label: 'Closed gate', x: 412, w: 132 },
  ];

  const triggerStereoCrossings = (dLR, dRL) => {
    if (dLR > 0) flashRight = 1;
    if (dRL > 0) flashLeft = 1;
    if (!sonify.active || api.reduced) return;
    const now = performance.now();
    if (now - lastSoundAt < 90) return;
    lastSoundAt = now;
    const a = api.audio();
    if (dLR > 0) a.tone(540, { pan: 0.78, dur: 0.055, gain: 0.06, type: 'sine', slideTo: 620 });
    if (dRL > 0) a.tone(360, { pan: -0.78, dur: 0.055, gain: 0.06, type: 'triangle', slideTo: 310 });
  };

  const stepWalk = (steps = 1) => {
    const before = walk.counts;
    const mult = channelMode === 'protein' && open ? 2 : 1;
    for (let s = 0; s < steps * mult; s++) walk.step(open);
    const after = walk.counts;
    triggerStereoCrossings(after.lr - before.lr, after.rl - before.rl);
  };

  const paint = (ctx, c) => {
    const q = walk.counts;
    const text = (s, x, y, size = 14, col = c.ink, align = 'left', weight = 400) =>
      api.draw.text(ctx, s, x, y, { size, color: col, align, weight });

    text('Equal-volume chambers · thermal motion across phospholipid bilayer', 20, 26, 15.5, c.ink, 'left', 700);

    // Chamber card
    ctx.fillStyle = c.sheet;
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 1.8;
    api.draw.roundRect(ctx, 16, 44, 608, 192, 8);
    ctx.fill();
    ctx.stroke();

    // Phospholipid bilayer down x = 320
    const sway = api.calm ? 0 : Math.sin(phaseT * 4) * 1.6;
    for (let py = 54; py <= 226; py += 12) {
      if (channelMode === 'protein' && open && py >= 112 && py <= 166) continue;
      // Left & right leaflet tails + heads
      ctx.strokeStyle = c.muted;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(311, py);
      ctx.lineTo(318, py + sway);
      ctx.moveTo(329, py);
      ctx.lineTo(322, py - sway);
      ctx.stroke();
      ctx.fillStyle = open ? c.neutron : c.proton;
      ctx.beginPath();
      ctx.arc(310, py, 3.6, 0, Math.PI * 2);
      ctx.arc(330, py, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (channelMode === 'protein' && open) {
      ctx.fillStyle = c.sheet;
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 2.2;
      api.draw.roundRect(ctx, 303, 110, 34, 58, 7);
      ctx.fill();
      ctx.stroke();
      api.draw.arrow(ctx, 307, 132, 333, 132, c.green, 1.8, 5);
      api.draw.arrow(ctx, 333, 148, 307, 148, c.electron, 1.8, 5);
    } else if (!open) {
      ctx.strokeStyle = c.proton;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(320, 48);
      ctx.lineTo(320, 232);
      ctx.stroke();
    }

    // Crossing directional flash rings
    if (flashRight > 0.05) {
      ctx.strokeStyle = c.green;
      ctx.globalAlpha = flashRight * 0.7;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(336, 140, 10 + (1 - flashRight) * 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (flashLeft > 0.05) {
      ctx.strokeStyle = c.proton;
      ctx.globalAlpha = flashLeft * 0.7;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(304, 140, 10 + (1 - flashLeft) * 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Solute particles
    for (let i = 0; i < walk.particles.length; i++) {
      const p = walk.particles[i];
      ctx.fillStyle = p.x < 320 ? c.electron : c.green;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Compartment corner badges (drawn after particles with subtle translucent plate pills)
    ctx.save();
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = c.sheet;
    api.draw.roundRect(ctx, 22, 48, 118, 16, 4);
    ctx.fill();
    api.draw.roundRect(ctx, 492, 48, 126, 16, 4);
    ctx.fill();
    ctx.restore();
    text('LEFT COMPARTMENT', 28, 60, 10, c.muted, 'left', 700);
    text('RIGHT COMPARTMENT', 612, 60, 10, c.muted, 'right', 700);

    // Concentration Bars Strip (y = 244..286)
    ctx.fillStyle = c.sheet;
    ctx.strokeStyle = c.rule;
    ctx.lineWidth = 1;
    api.draw.roundRect(ctx, 16, 244, 608, 50, 7);
    ctx.fill();
    ctx.stroke();

    text(`Left: ${q.left}%`, 26, 263, 13, c.electron, 'left', 700);
    ctx.fillStyle = c.rule_2;
    ctx.fillRect(108, 253, 180, 12);
    ctx.fillStyle = c.electron;
    ctx.fillRect(108, 253, (q.left / 100) * 180, 12);

    text(`Right: ${q.right}%`, 330, 263, 13, c.green, 'left', 700);
    ctx.fillStyle = c.rule_2;
    ctx.fillRect(422, 253, 180, 12);
    ctx.fillStyle = c.green;
    ctx.fillRect(422, 253, (q.right / 100) * 180, 12);

    text(
      `Crossings:  → ${q.lr} rightward   ← ${q.rl} leftward   net ${q.lr - q.rl >= 0 ? '+' : ''}${q.lr - q.rl}   (${q.steps} ${q.steps === 1 ? 'step' : 'steps'})`,
      26,
      284,
      12.5,
      c.ink,
      'left',
      600
    );

    // Interactive on-canvas Membrane Toolbox chips (y = 304..332)
    TOOL_SLOTS.forEach((slot) => {
      const active = channelMode === slot.id;
      ctx.fillStyle = active ? c.ink : c.sheet;
      ctx.strokeStyle = active ? c.ink : c.rule;
      ctx.lineWidth = 1.2;
      api.draw.roundRect(ctx, slot.x, 304, slot.w, 28, 14);
      ctx.fill();
      ctx.stroke();
      text(slot.label, slot.x + slot.w / 2, 322, 11.5, active ? c.sheet : c.ink, 'center', 700);
    });
    text('Tap a membrane type or drag controls below · 100 random-walk tokens (uncalibrated clock)', 320, 350, 10.5, c.muted, 'center');
  };

  const refresh = () => {
    k.draw(paint);
    const q = walk.counts;
    say(
      `Left ${q.left}, right ${q.right}; total 100. Actual crossings: ${q.lr} rightward, ${q.rl} leftward; signed net rightward ${q.lr - q.rl}. Counts fluctuate even near equal concentration (${channelMode === 'protein' ? 'protein pore active · 2× jump steps' : open ? 'simple lipid bilayer' : 'closed divider'}). Steps and speeds are chosen for the model, not measured molecular time.`
    );
  };

  const initSlider = api.slider('Initially left', {
    min: 50,
    max: 100,
    step: 10,
    value: 80,
    fmt: (v) => `${v} of 100`,
    onInput: (v) => {
      initial = v;
      walk = makeWalk(31, initial);
      accumulator = 0;
      flashLeft = 0;
      flashRight = 0;
      refresh();
    },
  });

  const tabs = api.tabs(['Permeable divider', 'Closed divider'], (i) => {
    open = i === 0;
    if (!open) channelMode = 'blocked';
    else if (channelMode === 'blocked') channelMode = 'bilayer';
    refresh();
  });

  api.button('Step 20 bounces', () => {
    stepWalk(20);
    refresh();
  });

  api.button('Log trial', () => {
    const q = walk.counts;
    trials.record([
      q.steps,
      channelMode === 'protein' ? 'Pore' : open ? 'Bilayer' : 'Closed',
      q.left,
      q.right,
      q.lr,
      q.rl,
      q.lr - q.rl,
    ]);
  });

  k.cv.style.cursor = 'pointer';
  k.cv.addEventListener('pointerdown', (e) => {
    const { x: lx, y: ly } = api.pointerXY(k, e);
    if (ly >= 298 && ly <= 338) {
      const hit = TOOL_SLOTS.find((s) => lx >= s.x && lx <= s.x + s.w);
      if (hit) {
        channelMode = hit.id;
        open = hit.id !== 'blocked';
        tabs.setActive(open ? 0 : 1);
        if (window.__bookSound) window.__bookSound.play('tick');
        refresh();
      }
    }
  });

  api.reset(() => {
    initial = 80;
    open = true;
    channelMode = 'bilayer';
    walk = makeWalk(31, initial);
    accumulator = 0;
    phaseT = 0;
    flashLeft = 0;
    flashRight = 0;
    initSlider.set(80);
    tabs.setActive(0);
    trials.clear();
    refresh();
  });

  api.io({
    getState: () => ({ initial, open, channelMode, counts: walk.counts }),
    setState: (patch = {}) => {
      if (patch.channelMode) {
        channelMode = patch.channelMode;
        open = channelMode !== 'blocked';
        tabs.setActive(open ? 0 : 1);
      }
      if (typeof patch.initial === 'number') {
        initial = patch.initial;
        initSlider.set(initial);
        walk = makeWalk(31, initial);
      }
      refresh();
    },
  });

  // makeCanvas redraws on theme/resize; this loop advances only after explicit Play.
  api.loop((dt) => {
    if (!dt) return;
    phaseT += dt;
    flashRight = Math.max(0, flashRight - dt * 2.4);
    flashLeft = Math.max(0, flashLeft - dt * 2.4);
    accumulator += Math.min(dt, 0.1);
    if (accumulator >= 0.08) {
      accumulator -= 0.08;
      stepWalk(1);
    }
    refresh();
  });
  api.onHide(() => {
    accumulator = 0;
    api.pause();
  });
  refresh();
  return {};
}, { label: 'Count the blind crossings', three: false });
