import { Live } from './core.js';

Live.register('monsoon_imbibition', (stage, params, api) => {
  const c = api.colors();
  const k = api.canvas(640, 320, 'Interactive simulation of a dry moong seed hydrating from 10% water (glassy dormant cytoplasm) to 65% water (active fluid cytoplasm)');
  const say = api.readout();

  let waterPct = 10; // 10% dry cupboard seed to 65% soaked seed
  let viewTab = 0;   // 0 = Cytoplasm & Bean, 1 = Oxygen & Mass Curve

  api.tabs(['1. Seed & Cytoplasmic Loupe', '2. Hydration vs. O₂ Curve'], (idx) => {
    viewTab = idx;
    updateReadout();
  });

  api.slider('Seed water content', {
    min: 10, max: 65, step: 5, value: waterPct,
    fmt: (v) => `${v}% H₂O`,
    onInput: (v) => { waterPct = v; updateReadout(); },
  });

  // Deterministic particles inside the cytoplasmic loupe
  const rand = api.rng(42);
  const particles = Array.from({ length: 28 }, (_, i) => ({
    x: 340 + rand() * 250,
    y: 70 + rand() * 165,
    vx: (rand() - 0.5) * 90,
    vy: (rand() - 0.5) * 90,
    kind: i < 6 ? 'enzyme' : i < 14 ? 'glucose' : 'water',
  }));

  function metrics(w) {
    // Below 24% water, cytoplasm is vitrified glass; above 25%, mobility and O2 uptake climb sharply
    const mobility = w <= 22 ? 0.015 : Math.min(1, Math.pow((w - 20) / 45, 1.6));
    const o2Rate = w <= 20 ? 0.04 : +(0.04 + 135 * Math.pow((w - 20) / 45, 2.1)).toFixed(1);
    const wetMass = +(50 * (0.90 / (1 - w / 100))).toFixed(1);
    return { mobility, o2Rate, wetMass };
  }

  function updateReadout() {
    const { o2Rate, wetMass } = metrics(waterPct);
    if (waterPct <= 20) {
      say(`At <b>${waterPct}% water</b> (dry May cupboard seed): Cytoplasm is locked in a solid sugar-glass. Enzymes cannot diffuse to meet fuel molecules. Mass of sample = <b>${wetMass} g</b>; O₂ uptake = <b>${o2Rate} µL/g·h</b>.`);
    } else if (waterPct < 45) {
      say(`At <b>${waterPct}% water</b> (imbibition underway): Water enters the micropyle, swelling the beans to <b>${wetMass} g</b> and melting the cytoplasmic glass. O₂ uptake rises to <b>${o2Rate} µL/g·h</b>.`);
    } else {
      say(`At <b>${waterPct}% water</b> (48 h after monsoon rain): Cytoplasm is fully fluid! Enzymes collide rapidly with glucose, recharging ATP at full speed (O₂ uptake = <b>${o2Rate} µL/g·h</b>, >2,000× dry rate) and pushing out the white radicle root.`);
    }
  }

  api.loop((dt, t) => {
    const ctx = k.ctx;
    ctx.clearRect(0, 0, 640, 320);
    ctx.fillStyle = c.paper;
    ctx.fillRect(0, 0, 640, 320);

    const { mobility, o2Rate, wetMass } = metrics(waterPct);

    if (viewTab === 0) {
      // Left panel: Macroscopic Moong Seed swelling + radicle emergence
      api.draw.roundRect(ctx, 20, 20, 275, 275, 8, c.plate, c.rule);
      api.draw.text(ctx, 'Macroscopic Moong Seed', 157, 44, { size: 13.5, weight: 700, align: 'center', color: c.ink });

      const scale = 1 + (waterPct - 10) / 95;
      const sx = 148, sy = 135;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(scale, scale);
      ctx.fillStyle = waterPct > 35 ? c.green : c.neutron;
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.ellipse(0, 0, 42, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = waterPct > 35 ? c.green : c.neutron;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // White radicle root emerging when waterPct >= 45%
      if (waterPct >= 45) {
        const rootLen = (waterPct - 40) * 1.6;
        ctx.strokeStyle = c.ink;
        ctx.fillStyle = c.sheet;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(28, 12);
        ctx.quadraticCurveTo(38 + rootLen * 0.5, 18 + rootLen * 0.6, 32 + rootLen * 0.4, 24 + rootLen);
        ctx.quadraticCurveTo(22 + rootLen * 0.2, 20 + rootLen * 0.7, 18, 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      api.draw.text(ctx, `Sample mass: ${wetMass} g (from 50 g dry)`, 36, 224, { size: 12, weight: 600, color: c.ink });
      api.draw.text(ctx, `O₂ respiration: ${o2Rate} µL / g·h`, 36, 246, {
        size: 12, weight: 700, color: waterPct > 35 ? c.proton : c.muted,
      });
      api.draw.text(ctx, waterPct <= 22 ? 'State: Dormant cytoplasmic glass' : 'State: Active ATP metabolism!', 36, 268, {
        size: 12, weight: 600, color: waterPct <= 22 ? c.neutron : c.green,
      });

      // Right panel: Submicroscopic Cytoplasmic Loupe
      api.draw.roundRect(ctx, 312, 20, 308, 275, 8, c.plate, c.rule);
      api.draw.text(ctx, 'Submicroscopic Cytoplasm (Loupe)', 466, 44, { size: 13.5, weight: 700, align: 'center', color: c.ink });

      const lx = 330, ly = 60, lw = 272, lh = 190;
      api.draw.roundRect(ctx, lx, ly, lw, lh, 6, c.sheet, waterPct > 25 ? c.electron : c.neutron);

      // Update & draw particles
      const stepDt = Math.min(dt, 0.05);
      particles.forEach((p) => {
        if (stepDt > 0) {
          p.x += p.vx * stepDt * mobility;
          p.y += p.vy * stepDt * mobility;
          if (p.x < lx + 14) { p.x = lx + 14; p.vx = Math.abs(p.vx); }
          if (p.x > lx + lw - 14) { p.x = lx + lw - 14; p.vx = -Math.abs(p.vx); }
          if (p.y < ly + 14) { p.y = ly + 14; p.vy = Math.abs(p.vy); }
          if (p.y > ly + lh - 14) { p.y = ly + lh - 14; p.vy = -Math.abs(p.vy); }
        }
        const jiggleX = mobility < 0.05 ? Math.sin(t * 9 + p.x) * 0.6 : 0;
        const jiggleY = mobility < 0.05 ? Math.cos(t * 9 + p.y) * 0.6 : 0;
        if (p.kind === 'enzyme') {
          ctx.fillStyle = c.neutron;
          ctx.beginPath();
          ctx.arc(p.x + jiggleX, p.y + jiggleY, 10, 0, Math.PI * 2);
          ctx.fill();
          api.draw.text(ctx, 'E', p.x + jiggleX, p.y + jiggleY + 4, { size: 10.5, weight: 700, align: 'center', color: c.sheet });
        } else if (p.kind === 'glucose') {
          ctx.fillStyle = c.proton;
          ctx.beginPath();
          ctx.arc(p.x + jiggleX, p.y + jiggleY, 5.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (waterPct >= 20) {
          ctx.fillStyle = c.electron;
          ctx.beginPath();
          ctx.arc(p.x + jiggleX, p.y + jiggleY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      api.draw.text(ctx, 'E = Enzyme (ochre) · Red = Glucose · Blue = H₂O', 466, 272, { size: 11.5, align: 'center', color: c.muted });
    } else {
      // Tab 2: Quantitative Curve of Water % vs O2 Respiration Rate
      api.draw.roundRect(ctx, 25, 20, 590, 275, 8, c.plate, c.rule);
      api.draw.text(ctx, 'Respiratory O₂ Uptake vs. Seed Hydration (% H₂O)', 320, 44, { size: 14, weight: 700, align: 'center', color: c.ink });

      const axX = 85, axY = 245, axW = 480, axH = 170;
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(axX, axY - axH);
      ctx.lineTo(axX, axY);
      ctx.lineTo(axX + axW, axY);
      ctx.stroke();

      // Glass transition threshold line at 22%
      const glassX = axX + ((22 - 10) / 55) * axW;
      ctx.strokeStyle = c.neutron;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(glassX, axY - axH);
      ctx.lineTo(glassX, axY);
      ctx.stroke();
      ctx.setLineDash([]);
      api.draw.text(ctx, 'Glass melts (~22% H₂O)', glassX + 6, axY - axH + 16, { size: 11.5, color: c.neutron });

      // Curve
      ctx.strokeStyle = c.proton;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let w = 10; w <= 65; w += 1) {
        const px = axX + ((w - 10) / 55) * axW;
        const py = axY - (metrics(w).o2Rate / 140) * axH;
        if (w === 10) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current marker
      const curX = axX + ((waterPct - 10) / 55) * axW;
      const curY = axY - (o2Rate / 140) * axH;
      ctx.fillStyle = c.proton;
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();
      api.draw.text(ctx, `${waterPct}% H₂O → ${o2Rate} µL O₂/g·h`, Math.min(curX + 10, 420), Math.max(curY - 10, 80), {
        size: 12, weight: 700, color: c.proton,
      });

      api.draw.text(ctx, 'Seed hydration (% water by mass)', axX + axW / 2, axY + 32, { size: 12, align: 'center', color: c.muted });
      api.draw.text(ctx, 'O₂ uptake (µL/g·h)', axX - 10, axY - axH - 8, { size: 12, align: 'start', color: c.muted });
    }
  });

  updateReadout();
  return { destroy() {} };
}, { label: 'Soak the dry moong seed' });
