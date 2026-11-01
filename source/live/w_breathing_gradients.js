import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { breathingModes, ventilationAccount, captureVentilation, compareVentilation } from './circulation_model.js';

Live.register('breathing_gradients', (stage, params, api) => {
  let mode = 0, vt = 500, rate = 12;
  const trials = [];
  const k = makeCanvas(api, 640, 560, 'Interactive thorax pressure, anatomical dead-space and alveolar gas-exchange explorer. Compare quiet inhalation, quiet exhalation, exercise breathing and the bell-jar model, and see how 150 mL airway dead space separates total minute ventilation from fresh alveolar ventilation.');
  const say = api.readout();
  api.tabs(breathingModes, i => { mode = i; refresh(); });
  const vtSlider = api.slider('Tidal volume', { min: 250, max: 1800, step: 50, value: 500, fmt: v => `${v} mL / breath`, onInput: v => { vt = v; refresh(); } });
  const rateSlider = api.slider('Breathing rate', { min: 8, max: 36, step: 2, value: 12, fmt: v => `${v} breaths / min`, onInput: v => { rate = v; refresh(); } });
  api.button('Shallow rapid (250 mL × 24)', () => { vt = 250; rate = 24; vtSlider.set(vt); rateSlider.set(rate); refresh(); });
  api.button('Quiet rest (500 mL × 12)', () => { vt = 500; rate = 12; vtSlider.set(vt); rateSlider.set(rate); refresh(); });
  api.button('Capture breath trial', () => { const q = captureVentilation(ventilationAccount(mode, vt, rate)); if (q) trials.push(q); refresh(); });
  api.button('Clear breath trials', () => { trials.length = 0; refresh(); });

  function refresh() {
    const q = ventilationAccount(mode, vt, rate);
    const cmp = compareVentilation(trials.at(-2), trials.at(-1));
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 15, color = c.ink, weight = 400, align = 'center') =>
        api.draw.text(ctx, s, x, y, { size, color, weight, align });

      t(q.modeName, 320, 30, 21, c.ink, 600);
      t(`Gauge pressures (relative to P_atm = 760 mmHg = 0) · 150 mL airway dead space`, 320, 56, 13, c.muted);

      // Left box: Thorax & Pressure state (x=24..308, y=76..296)
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.rule; ctx.lineWidth = 1.2;
      ctx.fillRect(24, 76, 284, 220); ctx.strokeRect(24, 76, 284, 220);
      t('THORAX AND THREE PRESSURES', 166, 98, 13.5, c.ink, 600);

      // Schematic lungs expanding with vt and diaphragm dome height
      const expand = Math.min(26, (q.vt - 200) / 65);
      const domeShift = mode === 0 || mode === 3 ? 14 : mode === 1 ? -10 : -16;
      ctx.fillStyle = mode === 0 ? c.green : mode === 1 ? c.electron : c.neutron;
      ctx.globalAlpha = 0.22;
      ctx.fillRect(68 - expand * 0.5, 116, 78 + expand * 0.5, 92 + expand * 0.6);
      ctx.fillRect(186, 116, 78 + expand * 0.5, 92 + expand * 0.6);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6;
      ctx.strokeRect(68 - expand * 0.5, 116, 78 + expand * 0.5, 92 + expand * 0.6);
      ctx.strokeRect(186, 116, 78 + expand * 0.5, 92 + expand * 0.6);

      // Diaphragm curve below lungs
      ctx.strokeStyle = c.proton; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(56, 232);
      ctx.quadraticCurveTo(166, 214 + domeShift, 276, 232);
      ctx.stroke();

      t(`P_alv ${q.pAlvMmHg > 0 ? '+' : ''}${q.pAlvMmHg}`, 107, 158, 12.2, q.pAlvMmHg < 0 ? c.green : c.proton, 600);
      t('mmHg', 107, 176, 11.5, q.pAlvMmHg < 0 ? c.green : c.proton);
      t(`P_ip ${q.pIpMmHg}`, 225, 158, 12.2, c.electron, 600);
      t('mmHg', 225, 176, 11.5, c.electron);
      t(`Transpulmonary: +${q.transpulmonaryMmHg} mmHg`, 166, 254, 13, c.ink, 600);
      t(q.pAlvMmHg < 0 ? 'Outside air pushes IN (nothing sucks)' : 'Recoil / muscle squeeze pushes air OUT', 166, 278, 12.2, c.muted);

      // Right box: Alveolar vs Dead-Space Ventilation & Gradients (x=326..616, y=76..296)
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.rule; ctx.lineWidth = 1.2;
      ctx.fillRect(326, 76, 290, 220); ctx.strokeRect(326, 76, 290, 220);
      t('DEAD SPACE vs ALVEOLAR EXCHANGE', 471, 98, 13.2, c.ink, 600);

      t(`Breath ${q.vt} mL = ${q.vd} dead + ${q.freshPerBreathMl} alveolar`, 471, 124, 12.2, c.ink);
      t(`Total minute ventilation: ${q.minuteVentilationLMin.toFixed(1)} L/min`, 471, 150, 13.5, c.electron, 600);
      t(`Fresh alveolar ventilation: ${q.alveolarVentilationLMin.toFixed(1)} L/min`, 471, 176, 14, c.green, 600);

      // Partial-pressure gradients across 0.5 um barrier
      t(`Alveolar P_O₂ ${q.alvPO2} → Blood ${q.capInPO2} mmHg (Δ = ${q.o2GradientMmHg})`, 471, 210, 12.2, c.proton, 600);
      t(`Blood P_CO₂ ${q.capInPCO2} → Alveolar ${q.alvPCO2} mmHg (Δ = ${q.co2GradientMmHg})`, 471, 234, 12.2, c.electron, 600);
      t(`Inspired → Expired: O₂ 21%→16% · CO₂ 0.04%→4%`, 471, 260, 11.8, c.ink);
      t(`N₂ stays 78% · Water vapour becomes saturated`, 471, 280, 11.8, c.muted);

      // Lower explanation lines & capture status
      q.lines.forEach((lineStr, idx) => {
        t(lineStr, 320, 330 + idx * 30, 12.2, c.ink, idx === 0 ? 600 : 400);
      });

      ctx.strokeStyle = c.rule; ctx.beginPath(); ctx.moveTo(24, 412); ctx.lineTo(616, 412); ctx.stroke();
      t(`Total ${q.minuteVentilationLMin.toFixed(1)} L/min · Alveolar ${q.alveolarVentilationLMin.toFixed(1)} L/min · Dead space ${q.deadSpaceVentilationLMin.toFixed(1)} L/min`, 320, 444, 15, c.green, 600);
      const shortStatus = cmp.valid
        ? (cmp.equalMinuteDiffAlveolar ? 'equal total L/min, deeper breath gives more alveolar air' : 'two distinct ventilation trials captured')
        : 'capture two breath trials to compare dead space';
      t(`${trials.length} captured trials · ${shortStatus}`, 320, 478, 12.5, c.ink);
      t('Adult estimate across BOTH lungs: ~300–500M alveoli (Ochs et al. 2004 mean 480M, range 274–790M).', 320, 512, 11.5, c.muted);
      t('Representative sea-level pressures and 150 mL dead space; not a clinical spirometer.', 320, 538, 11.5, c.muted);
    });

    const history = trials.map((tr, i) =>
      `${i + 1}: ${tr.vt} mL × ${tr.rate}/min, total ${tr.minuteVentilationLMin.toFixed(1)} L/min, alveolar ${tr.alveolarVentilationLMin.toFixed(1)} L/min`
    ).join(' | ');
    say(`Mode ${mode}: ${q.modeName}. Tidal volume ${q.vt} mL; breathing rate ${q.rate} breaths/min; dead space ${q.vd} mL; fresh alveolar air ${q.freshPerBreathMl} mL/breath. Total minute ventilation ${q.minuteVentilationLMin.toFixed(1)} L/min; alveolar ventilation ${q.alveolarVentilationLMin.toFixed(1)} L/min; dead-space ventilation ${q.deadSpaceVentilationLMin.toFixed(1)} L/min. Gauge pressures: alveolar ${q.pAlvMmHg} mmHg, pleural ${q.pIpMmHg} mmHg, transpulmonary +${q.transpulmonaryMmHg} mmHg. Gradients: O₂ ${q.alvPO2} to ${q.capInPO2} mmHg; CO₂ ${q.capInPCO2} to ${q.alvPCO2} mmHg. Inspired 21% O₂, 0.04% CO₂, 78% N₂; expired 16% O₂, 4% CO₂, 78% N₂, saturated water vapour. ${q.lines.join(' ')} ${trials.length} captured trials. ${cmp.reason} Saved: ${history || 'none'}.`);
  }

  refresh();
  return {};
}, { label: 'Explore thoracic pressures, dead space and gas exchange', three: false, static: true });
