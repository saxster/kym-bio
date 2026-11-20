import { BoxGeometry, SphereGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { makeStage, webglOK } from './three_kit.js';

Live.register('osmosis_cells', (stage, params, api) => {
  let condition = 0;
  let step = 0;
  let kit = null;
  let animal, wall, contents;
  const k = makeCanvas(
    api,
    640,
    300,
    'Side-by-side animal and plant cell sections; choose surrounding solution and manually advance a qualitative response.'
  );
  const say = api.readout();
  const sonify = api.sonifyToggle('Water flux sound');
  const trials = api.trials({
    columns: ['Surroundings', 'Stage', 'Animal', 'Plant', 'Potato Δmass %'],
    maxRows: 6,
    allowNoise: true,
    noiseLabel: 'Potato strip variability',
    plotColumn: 'Potato Δmass %',
  });

  if (webglOK()) {
    try {
      kit = makeStage(stage, api, {
        height: 280,
        label: 'Animal membrane beside a plant wall enclosing membrane-bound contents. Turn with drag or camera buttons.',
      });
      kit.spinSpeed = 0;
      const material = (color, opacity = 1) =>
        new MeshStandardMaterial({ color, transparent: opacity < 1, opacity, roughness: 0.8, wireframe: opacity < 1 });
      animal = new Mesh(new SphereGeometry(0.8, 28, 18), material(api.colors().proton));
      animal.position.x = -1.6;
      wall = new Mesh(new BoxGeometry(2, 2, 1.6), material(api.colors().green, 0.5));
      wall.position.x = 1.5;
      contents = new Mesh(new BoxGeometry(2, 2, 1.6), material(api.colors().electron));
      contents.position.x = 1.5;
      kit.root.add(animal, wall, contents);
      kit.label('Animal membrane', [-1.6, 1.3, 0]);
      kit.label('Plant wall', [1.5, 1.3, 0]);
      kit.root.rotation.set(0.15, -0.25, 0);
      kit.fit(3.5);
    } catch (_) {
      stage.querySelector('.live-3d')?.remove();
      kit = null;
    }
  }
  if (!kit) {
    const p = document.createElement('p');
    p.textContent = 'The 2D sections remain available without WebGL.';
    stage.append(p);
  }

  function refresh() {
    const t = step / 4;
    const burst = condition === 0 && step === 4;
    const a = condition === 0 ? 1 + 0.4 * t : condition === 2 ? 1 - 0.35 * t : 1;
    const p = condition === 2 ? 0.965 - 0.4 * t : 0.965;
    const state =
      step === 0
        ? 'Starting cells'
        : condition === 0
        ? burst
          ? 'Animal: burst · plant: turgid'
          : 'Water entry · plant pressure rising'
        : condition === 2
        ? step === 4
          ? 'Animal shrivelled · plant plasmolysed'
          : 'Water loss · plant pressure falling'
        : 'No sustained net volume change';
    k.draw((ctx, c) => {
      const text = (s, x, y, size = 16, col = c.ink, align = 'left', weight = 400) =>
        api.draw.text(ctx, s, x, y, { size, color: col, align, weight });
      text(['Dilute surroundings', 'Matching solutes; little initial pressure', 'Concentrated surroundings'][condition], 22, 26, 17, c.ink, 'left', 700);

      // Tonicity baths (framed cards left & right)
      const baths = [
        [20, 'Animal cell (no wall)', condition === 0 ? 'Low bath solutes · H₂O enters' : condition === 2 ? 'High bath solutes · H₂O leaves' : 'Balanced solutes · net flux 0'],
        [330, 'Plant cell (cellulose wall)', condition === 0 ? 'Turgor pressure opposes entry' : condition === 2 ? 'Membrane pulls back (plasmolysis)' : 'Flaccid · Ψp ≈ 0'],
      ];
      const dotCount = condition === 0 ? 6 : condition === 1 ? 18 : 34;
      const randDots = api.rng(307 + condition * 41);

      baths.forEach(([bx, heading, sub], sideIdx) => {
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        api.draw.roundRect(ctx, bx, 38, 290, 196, 10);
        ctx.fill();
        ctx.stroke();

        // Bath fluid interior wash
        ctx.save();
        ctx.fillStyle = condition === 0 ? c.electron : condition === 2 ? c.proton : c.plate;
        ctx.globalAlpha = condition === 1 ? 0.55 : 0.08;
        api.draw.roundRect(ctx, bx + 8, 66, 274, 146, 7);
        ctx.fill();
        ctx.restore();

        // Scattered extracellular solute tokens (drawn around outer perimeter)
        ctx.fillStyle = c.proton;
        for (let di = 0; di < dotCount; di++) {
          const ang = randDots() * Math.PI * 2;
          const rad = 74 + randDots() * 34;
          const dx = Math.max(bx + 16, Math.min(bx + 274, bx + 145 + Math.cos(ang) * (rad * 1.15)));
          const dy = Math.max(74, Math.min(206, 140 + Math.sin(ang) * (rad * 0.52)));
          ctx.beginPath();
          ctx.arc(dx, dy, 2.3, 0, Math.PI * 2);
          ctx.fill();
        }
        text(heading, bx + 145, 56, 13.5, c.ink, 'center', 700);
        text(sub, bx + 145, 226, 10.5, c.muted, 'center', 600);
      });

      // Animal RBC shape (crenated at hypertonic, swollen/burst at hypotonic)
      const ax = 165, ay = 140;
      const rx = 50 * a, ry = 36 * a;
      ctx.save();
      ctx.fillStyle = c.proton;
      ctx.globalAlpha = burst ? 0.08 : 0.16;
      ctx.strokeStyle = c.proton;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      if (condition === 2 && step > 0) {
        const lobes = 10;
        const amp = 4.5 * t;
        for (let kStep = 0; kStep <= 60; kStep++) {
          const th = (kStep / 60) * Math.PI * 2;
          const wobble = 1 - (amp / 45) * Math.abs(Math.sin(th * lobes));
          const px = ax + Math.cos(th) * rx * wobble;
          const py = ay + Math.sin(th) * ry * wobble;
          if (kStep === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        ctx.ellipse(ax, ay, rx, ry, 0, burst ? 0.35 : 0, burst ? 5.65 : Math.PI * 2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();

      // Water flux arrows across animal membrane
      if (condition === 0 && step > 0) {
        api.draw.arrow(ctx, ax - 76, ay, ax - rx + 4, ay, c.electron, 2.2, 6);
        api.draw.arrow(ctx, ax + 76, ay, ax + rx - 4, ay, c.electron, 2.2, 6);
        if (burst) {
          api.draw.arrow(ctx, ax + rx * 0.72, ay - ry * 0.65, ax + rx + 24, ay - ry - 10, c.proton, 2.2, 7);
        }
      } else if (condition === 2 && step > 0) {
        api.draw.arrow(ctx, ax - rx + 8, ay, ax - rx - 24, ay, c.electron, 2.2, 6);
        api.draw.arrow(ctx, ax + rx - 8, ay, ax + rx + 24, ay, c.electron, 2.2, 6);
      }

      // Plant cell: rigid cellulose wall + shrinking membrane + vacuole + chloroplasts + turgor Ψp gauge
      const pcx = 460, pcy = 140;
      const wallW = 166, wallH = 118;
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 4.5;
      api.draw.roundRect(ctx, pcx - wallW / 2, pcy - wallH / 2, wallW, wallH, 10);
      ctx.stroke();

      const mw = wallW * p;
      const mh = wallH * p;
      ctx.fillStyle = c.plate;
      ctx.strokeStyle = c.electron;
      ctx.lineWidth = 2;
      api.draw.roundRect(ctx, pcx - mw / 2, pcy - mh / 2, mw, mh, 7);
      ctx.fill();
      ctx.stroke();

      // Vacuole
      const v = condition === 2 ? Math.max(0.42, 0.68 - 0.24 * t) : 0.64 + 0.14 * (condition === 0 ? t : 0);
      ctx.fillStyle = c.electron;
      ctx.globalAlpha = 0.24;
      api.draw.roundRect(ctx, pcx - (mw * v) / 2, pcy - (mh * v) / 2, mw * v, mh * v, 6);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Perimeter chloroplasts inside protoplasm
      ctx.fillStyle = c.green;
      for (const [ox, oy] of [[-0.36, -0.28], [0.36, -0.28], [-0.36, 0.28], [0.36, 0.28], [0, -0.34], [0, 0.34]]) {
        ctx.beginPath();
        ctx.ellipse(pcx + ox * mw, pcy + oy * mh, 6.5, 3.8, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Water flux arrows on plant membrane
      if (condition === 0 && step > 0) {
        api.draw.arrow(ctx, pcx - wallW / 2 - 22, pcy, pcx - mw / 2 + 8, pcy, c.electron, 2.2, 6);
        api.draw.arrow(ctx, pcx + wallW / 2 + 22, pcy, pcx + mw / 2 - 8, pcy, c.electron, 2.2, 6);
      } else if (condition === 2 && step > 0) {
        api.draw.arrow(ctx, pcx - mw / 2 + 4, pcy, pcx - wallW / 2 - 18, pcy, c.electron, 2.2, 6);
        api.draw.arrow(ctx, pcx + mw / 2 - 4, pcy, pcx + wallW / 2 + 18, pcy, c.electron, 2.2, 6);
      }

      // Compact Ψp turgor pressure bar (x = 576..592, y = 84..196)
      const turgorFrac = condition === 0 ? 0.25 + 0.72 * t : condition === 1 ? 0.22 : Math.max(0.02, 0.22 * (1 - t));
      ctx.fillStyle = c.plate;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1;
      ctx.fillRect(580, 84, 12, 112);
      ctx.strokeRect(580, 84, 12, 112);
      ctx.fillStyle = condition === 2 && step > 2 ? c.proton : c.green;
      ctx.fillRect(581, 195 - 110 * turgorFrac, 10, 110 * turgorFrac);
      text('Ψp', 586, 78, 10.5, c.ink, 'center', 700);

      text(state, 22, 258, 15.5, c.ink, 'left', 700);
      text('Blue arrows = net H₂O osmosis · Green border = cellulose wall · Blue centre = vacuole', 22, 277, 12.2, c.muted);
      text('Qualitative contours & stage progress (0–4); uncalibrated solutes, volumes & elapsed time', 22, 294, 11, c.muted);
      if (kit) {
        animal.material.color.set(c.proton);
        wall.material.color.set(c.green);
        contents.material.color.set(c.electron);
        kit.dirty = true;
        kit.render();
      }
    });
    if (kit) {
      animal.scale.set(a, a * 0.72, a * 0.72);
      animal.visible = !burst;
      contents.scale.setScalar(p);
      kit.dirty = true;
      kit.render();
    }
    if (sonify.active && !api.reduced && step > 0) {
      const pan = condition === 0 ? 0.65 : condition === 2 ? -0.65 : 0;
      const freq = condition === 0 ? 360 + step * 35 : condition === 2 ? 320 - step * 25 : 290;
      api.audio().tone(freq, { pan, dur: 0.08, type: 'sine', gain: 0.05 });
    }
    say(
      `${state}. Step ${step} of 4 is a manually selected stage, not elapsed time. ${
        condition === 0
          ? 'A wall permits pressure to build and oppose further net entry.'
          : condition === 2
          ? 'Sufficient water loss separates plant contents from the largely fixed wall.'
          : 'A flaccid plant has little turgor pressure.'
      } The solid 3D interior represents the membrane envelope; its always-visible 2D section identifies the vacuole.`
    );
  }

  const tabs = api.tabs(['Dilute outside', 'Matching solutes', 'Concentrated outside'], (i) => {
    condition = i;
    refresh();
  });
  const stepSlider = api.slider('Response stage', {
    min: 0,
    max: 4,
    step: 1,
    value: 0,
    fmt: (v) => `${v} of 4 (schematic)`,
    onInput: (v) => {
      step = v;
      refresh();
    },
  });

  api.button('Record strip trial', () => {
    const baseMassPct = condition === 0 ? 11.5 * (step / 4) : condition === 2 ? -13.2 * (step / 4) : 0.2;
    const rGen = api.rng(901 + trials.rows().length * 17 + condition * 7 + step);
    const jitter = trials.noise ? (rGen() - 0.5) * 3.2 : 0;
    const val = baseMassPct + jitter;
    trials.record([
      ['Dilute', 'Isotonic', 'Concentrated'][condition],
      `${step}/4`,
      condition === 0 && step === 4 ? 'Burst' : condition === 2 && step === 4 ? 'Crenated' : 'Intact',
      condition === 0 && step === 4 ? 'Turgid' : condition === 2 && step === 4 ? 'Plasmolysed' : 'Flaccid',
      `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`,
    ]);
  });

  api.reset(() => {
    condition = 0;
    step = 0;
    tabs.setActive(0);
    stepSlider.set(0);
    trials.clear();
    refresh();
  });

  api.io({
    getState: () => ({ condition, step }),
    setState: (patch = {}) => {
      if (typeof patch.condition === 'number') { condition = patch.condition; tabs.setActive(condition); }
      if (typeof patch.step === 'number') { step = patch.step; stepSlider.set(step); }
      refresh();
    },
    beforeSnapshot: () => {
      if (kit) {
        kit.dirty = true;
        kit.render();
      }
    },
  });

  refresh();
  return {};
}, { label: 'Inspect two cells in changing water', three: true, static: true });
