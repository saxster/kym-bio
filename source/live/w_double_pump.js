import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { pumpModes, cardiacStages, circulationAccount, captureCirculation } from './circulation_model.js';

Live.register('double_pump', (stage, params, api) => {
  let mode = 0, hr = 70, sv = 60, step = 0;
  const trials = [];
  const k = makeCanvas(api, 640, 560, 'Interactive mammalian double-pump, Harvey 1628 vs modern cardiac-output calculator, post-natal ventricular septal defect shunt explorer, and fish single-circulation comparison. Anatomical right is on the viewer left.');
  const say = api.readout();
  api.tabs(pumpModes, i => { mode = i; refresh(); });
  const stageSlider = api.slider('Circuit stage', { min: 0, max: 4, step: 1, value: 0, fmt: v => `${v}: ${cardiacStages[v]}`, onInput: v => { step = v; refresh(); } });
  const hrSlider = api.slider('Heart rate', { min: 50, max: 160, step: 5, value: 70, fmt: v => `${v} beats / min`, onInput: v => { hr = v; refresh(); } });
  const svSlider = api.slider('Stroke volume', { min: 40, max: 110, step: 5, value: 60, fmt: v => `${v} mL / beat`, onInput: v => { sv = v; refresh(); } });
  api.button('Next circuit stage', () => { step = (step + 1) % 5; stageSlider.set(step); refresh(); });
  api.button('Capture pump state', () => { const q = captureCirculation(circulationAccount(mode, hr, sv, step)); if (q) trials.push(q); refresh(); });
  api.button('Clear pump captures', () => { trials.length = 0; refresh(); });

  function refresh() {
    const q = circulationAccount(mode, hr, sv, step);
    const hasIntactAndVsd = trials.some(tr => tr.focusMode === 0) && trials.some(tr => tr.focusMode === 2);
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 15, color = c.ink, weight = 400, align = 'center') =>
        api.draw.text(ctx, s, x, y, { size, color, weight, align });

      t(`${q.modeName} · ${q.coLMin.toFixed(2)} L/min`, 320, 30, 21, c.ink, 600);
      t('Anatomical right on viewer’s left · pressure drives valves and shunts', 320, 56, 13, c.muted);

      // Left panel: Schematic four-chamber heart / circuit & pressures (x=24..314, y=76..298)
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.rule; ctx.lineWidth = 1.2;
      ctx.fillRect(24, 76, 290, 222); ctx.strokeRect(24, 76, 290, 222);
      t(mode === 3 ? 'FISH SINGLE CIRCUIT' : 'HEART CHAMBERS & SEPTUM', 169, 98, 13.5, c.ink, 600);

      // Right heart (viewer's left) and Left heart (viewer's right)
      ctx.fillStyle = c.electron; ctx.globalAlpha = 0.16;
      ctx.fillRect(42, 114, 114, 112);
      ctx.fillStyle = c.proton;
      ctx.fillRect(182, 114, 114, 112);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.electron; ctx.lineWidth = 1.8; ctx.strokeRect(42, 114, 114, 112);
      ctx.strokeStyle = c.proton; ctx.lineWidth = 3.2; ctx.strokeRect(182, 114, 114, 112); // thicker LV wall!

      // Septum between x=156 and x=182 (with gap if mode === 2 Post-natal VSD)
      ctx.fillStyle = c.ink;
      if (mode === 2) {
        ctx.fillRect(162, 114, 14, 38);
        ctx.fillRect(162, 184, 14, 42);
        api.draw.arrow(ctx, 206, 168, 132, 168, c.proton, 2.5, 7);
        t('L → R shunt', 169, 162, 11.5, c.proton, 600);
      } else {
        ctx.fillRect(162, 114, 14, 112);
      }

      t('Right (O₂-poor)', 99, 136, 11.8, c.electron, 600);
      t(`RV ~${q.rvSystolicMmHg} mmHg`, 99, 198, 12.5, c.electron, 600);
      t('Left (O₂-rich)', 239, 136, 11.8, c.proton, 600);
      t(`LV ~${q.lvSystolicMmHg} mmHg`, 239, 198, 12.5, c.proton, 600);

      t(`AV valves: ${q.avValves}`, 169, 248, 11.8, c.ink);
      t(`Semilunar: ${q.semilunarValves}`, 169, 270, 11.8, c.ink);
      t(`Shunt: ${q.shuntDirection}`, 169, 290, 11.2, mode === 2 ? c.proton : c.green, 600);

      // Right panel: Quantitative Output & Harvey 1628 vs Modern Comparison (x=328..616, y=76..298)
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.rule; ctx.lineWidth = 1.2;
      ctx.fillRect(328, 76, 288, 222); ctx.strokeRect(328, 76, 288, 222);
      t('THROUGHPUT & CIRCUIT BALANCE', 472, 98, 13.2, c.ink, 600);

      t(`Modern: ${q.hr} bpm × ${q.sv} mL = ${q.coLMin.toFixed(2)} L/min`, 472, 126, 13.5, c.green, 600);
      t(`Per hour: ${q.coLHour.toFixed(1)} L/h (whole body blood ~5 L)`, 472, 148, 12, c.ink);
      t(`Harvey 1628 (1,000 beats / 30 min):`, 472, 176, 12.5, c.neutron, 600);
      t(`1 drachm/beat → ${q.harvey1Drachm.troyLabel} (~${q.harvey1Drachm.approxKgHalfHour} kg)`, 472, 196, 12, c.ink);
      t(`½ oz (4 drachms) → ${q.harveyHalfOz.troyLabel} (~${q.harveyHalfOz.approxKgHalfHour} kg)`, 472, 216, 12, c.ink);

      t(`Pulmonary flow Qp = ${q.qpLMin.toFixed(2)} L/min`, 472, 246, 13, c.electron, 600);
      t(`Systemic flow Qs = ${q.qsLMin.toFixed(2)} L/min (Qp/Qs = ${q.qpQsRatio.toFixed(2)})`, 472, 268, 12.8, c.proton, 600);
      t('Arteries go AWAY; veins go TOWARDS heart', 472, 290, 11.5, c.muted);

      // Lower explanation lines & capture status
      q.lines.forEach((lineStr, idx) => {
        t(lineStr, 320, 332 + idx * 30, 12, c.ink, idx === 0 ? 600 : 400);
      });

      ctx.strokeStyle = c.rule; ctx.beginPath(); ctx.moveTo(24, 414); ctx.lineTo(616, 414); ctx.stroke();
      t(`Qp = ${q.qpLMin.toFixed(2)} L/min · Qs = ${q.qsLMin.toFixed(2)} L/min · Qp/Qs = ${q.qpQsRatio.toFixed(2)}`, 320, 446, 15.5, c.green, 600);
      t(hasIntactAndVsd
        ? 'Intact and post-natal VSD states captured for comparison.'
        : `${trials.length} captured states · capture Intact (tab 0) and Post-natal VSD (tab 2) to compare.`, 320, 480, 12.5, c.ink);
      t('Harvey published in Frankfurt (1628); Malpighi saw frog lung capillaries in 1661.', 320, 514, 11.5, c.muted);
      t('Steady-state haemodynamic model; not a clinical echocardiogram.', 320, 540, 11.5, c.muted);
    });

    const history = trials.map((tr, i) =>
      `${i + 1}: ${tr.modeName}, CO ${tr.coLMin.toFixed(2)} L/min, Qp ${tr.qpLMin.toFixed(2)}, Qs ${tr.qsLMin.toFixed(2)}, Qp/Qs ${tr.qpQsRatio.toFixed(2)} (${tr.shuntDirection})`
    ).join(' | ');
    say(`Mode ${mode}: ${q.modeName}; stage ${q.step}: ${q.stageName}. Heart rate ${q.hr} bpm; stroke volume ${q.sv} mL; cardiac output ${q.coLMin.toFixed(2)} L/min (${q.coLHour.toFixed(1)} L/h). Harvey 1628 lower bound: 1 drachm/beat over 1,000 beats gives ${q.harvey1Drachm.troyLabel}; 4 drachms gives ${q.harveyHalfOz.troyLabel}. RV systolic ${q.rvSystolicMmHg} mmHg; LV systolic ${q.lvSystolicMmHg} mmHg. Pulmonary flow Qp ${q.qpLMin.toFixed(2)} L/min; systemic flow Qs ${q.qsLMin.toFixed(2)} L/min; Qp/Qs ${q.qpQsRatio.toFixed(2)}; shunt: ${q.shuntDirection}. ${q.lines.join(' ')} ${trials.length} captured states. ${hasIntactAndVsd ? 'Intact and post-natal VSD states captured for comparison.' : ''} Saved: ${history || 'none'}.`);
  }

  refresh();
  return {};
}, { label: 'Explore the double pump, Harvey’s arithmetic and septal shunts', three: false, static: true });
