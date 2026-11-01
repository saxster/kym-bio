import { Live } from './core.js';

Live.register('leeuwenhoek_scope', (stage, params, api) => {
  const c = api.colors();
  const k = api.canvas(640, 320, 'Antonie van Leeuwenhoek’s 270× single-lens microscope stage showing living pond protists, dental bacteria, and Hooke’s cork cells');
  const say = api.readout();

  let specimen = 0; // 0 = Monsoon Puddle (270x), 1 = Tooth Plaque (1683), 2 = Hooke's Cork (30x)
  let focusUm = 0;  // -40 to +40 um (0 is sharp focus)
  let tempC = 28;   // 28 C normal vs 65 C hot coffee test

  api.tabs(['1. Pond Drop (270×)', '2. Tooth Plaque (1683)', '3. Hooke’s Cork (30×)'], (idx) => {
    specimen = idx;
    updateReadout();
  });

  api.slider('Focus screw', {
    min: -40, max: 40, step: 2, value: focusUm,
    fmt: (v) => `${v > 0 ? '+' : ''}${v} µm`,
    onInput: (v) => { focusUm = v; updateReadout(); },
  });

  api.slider('Sample temperature', {
    min: 20, max: 65, step: 5, value: tempC,
    fmt: (v) => `${v} °C`,
    onInput: (v) => { tempC = v; updateReadout(); },
  });

  function updateReadout() {
    const blur = Math.abs(focusUm);
    const focusNote = blur <= 6 ? 'Sharp focal plane!' : `Out of focus by ${blur} µm (turn the brass screw near 0 µm).`;
    if (specimen === 0) {
      say(`<b>Pond drop at 270×</b> (${tempC} °C): Slipper-shaped <i>Paramecium</i> (~200 µm) and green <i>Spirogyra</i> filaments. ${focusNote}`);
    } else if (specimen === 1) {
      if (tempC >= 55) {
        say(`<b>1683 Hot Coffee Test (${tempC} °C)</b>: Just as Leeuwenhoek reported after drinking scalding coffee, the heat denatures bacterial proteins and stops the swimming rods!`);
      } else {
        say(`<b>1683 Tooth Plaque at 270×</b> (${tempC} °C): Tumbling rods (<i>bacilli</i>, ~2 µm), spheres (<i>cocci</i>) and spirals (<i>spirilla</i>). ${focusNote}`);
      }
    } else {
      say(`<b>Hooke’s Bottle Cork at 30×</b>: Dead, empty hexagonal cell walls (~40 µm wide) with no living cytoplasm inside. ${focusNote}`);
    }
  }

  api.loop((dt, t) => {
    const ctx = k.ctx;
    ctx.clearRect(0, 0, 640, 320);
    ctx.fillStyle = c.paper;
    ctx.fillRect(0, 0, 640, 320);

    // Circular microscope field of view on left (cx=200, cy=160, r=128)
    const cx = 195, cy = 160, r = 126;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = c.sheet;
    ctx.fill();
    ctx.clip();

    const blurPx = Math.abs(focusUm) * 0.18;
    const speedFactor = tempC >= 55 ? 0.03 : (0.6 + (tempC - 20) * 0.025);

    if (specimen === 0) {
      // Spirogyra spiral green ribbon across field
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 10 + blurPx;
      ctx.globalAlpha = Math.max(0.25, 1 - blurPx * 0.08);
      ctx.beginPath();
      ctx.moveTo(cx - 120, cy - 50);
      ctx.lineTo(cx + 120, cy + 40);
      ctx.stroke();

      // Swimming Paramecium ciliates
      for (let i = 0; i < 4; i++) {
        const ang = t * 0.7 * speedFactor + i * 1.6;
        const px = cx + Math.cos(ang) * (45 + i * 14);
        const py = cy + Math.sin(ang * 1.3) * (38 + i * 12);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(ang + Math.PI / 2);
        ctx.fillStyle = c.electron;
        ctx.beginPath();
        ctx.ellipse(0, 0, 22 + blurPx, 9 + blurPx * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.ink;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (specimen === 1) {
      ctx.globalAlpha = Math.max(0.25, 1 - blurPx * 0.08);
      // Rods (bacilli), spheres (cocci), spirals
      for (let i = 0; i < 12; i++) {
        const phase = t * 1.4 * speedFactor + i * 1.9;
        const bx = cx + Math.cos(phase + i) * ((i * 17) % 92);
        const by = cy + Math.sin(phase * 1.2 + i) * ((i * 23) % 92);
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(phase);
        if (i % 3 === 0) {
          ctx.fillStyle = c.proton;
          api.draw.roundRect(ctx, -9, -3.5, 18 + blurPx, 7 + blurPx, 3.5, c.proton, null);
        } else if (i % 3 === 1) {
          ctx.fillStyle = c.electron;
          ctx.beginPath();
          ctx.arc(0, 0, 4 + blurPx * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = c.green;
          ctx.lineWidth = 2.2 + blurPx * 0.4;
          ctx.beginPath();
          for (let x = -12; x <= 12; x += 3) {
            const y = Math.sin(x * 0.6) * 3.5;
            if (x === -12) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    } else {
      // Hooke's cork honeycomb
      ctx.globalAlpha = Math.max(0.25, 1 - blurPx * 0.08);
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 2 + blurPx * 0.4;
      for (let row = -4; row <= 4; row++) {
        for (let col = -4; col <= 4; col++) {
          const hx = cx + col * 28 + (row % 2) * 14;
          const hy = cy + row * 22;
          ctx.strokeRect(hx - 12, hy - 9, 24, 18);
        }
      }
    }
    ctx.restore();

    // Brass viewport rim + scale bar
    ctx.strokeStyle = c.neutron;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Scale bar & Magnification ledger on right side
    api.draw.roundRect(ctx, 355, 28, 258, 264, 8, c.plate, c.rule);
    api.draw.text(ctx, 'Microscope Optics & Scale', 484, 52, { size: 14, weight: 700, align: 'center', color: c.ink });

    const mag = specimen === 2 ? '× 30 (Compound tube)' : '× 270 (1.5 mm glass bead)';
    const actual = specimen === 0 ? 'Paramecium: A = 200 µm' : specimen === 1 ? 'Bacillus rod: A = 2 µm' : 'Cork chamber: A = 40 µm';
    const imgSize = specimen === 0 ? 'I = 200 µm × 270 = 54,000 µm (54 mm)' : specimen === 1 ? 'I = 2 µm × 270 = 540 µm (0.54 mm)' : 'I = 40 µm × 30 = 1,200 µm (1.2 mm)';

    api.draw.text(ctx, `Lens power: ${mag}`, 374, 86, { size: 12.5, weight: 600, color: c.electron });
    api.draw.text(ctx, `Actual size (A): ${actual}`, 374, 114, { size: 12, color: c.ink });
    api.draw.text(ctx, `Image size (I = M × A):`, 374, 142, { size: 12, color: c.muted });
    api.draw.text(ctx, imgSize, 374, 162, { size: 12, weight: 600, color: c.proton });
    api.draw.text(ctx, `Focal error: ${Math.abs(focusUm)} µm`, 374, 196, {
      size: 12, weight: 600, color: Math.abs(focusUm) <= 6 ? c.green : c.proton,
    });
    api.draw.text(ctx, tempC >= 55 ? 'Thermal state: Proteins denatured (>55 °C)' : 'Thermal state: Active physiological range', 374, 224, {
      size: 12, color: tempC >= 55 ? c.proton : c.green,
    });

    // Visual scale bar inside right panel
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(374, 260);
    ctx.lineTo(474, 260);
    ctx.stroke();
    api.draw.text(ctx, specimen === 1 ? 'Scale bar = 10 µm' : 'Scale bar = 100 µm', 490, 264, { size: 11.5, color: c.muted });
  });

  updateReadout();
  return { destroy() {} };
}, { label: 'Focus Leeuwenhoek’s 270× lens' });
