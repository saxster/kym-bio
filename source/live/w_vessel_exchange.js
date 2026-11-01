import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { vesselSegments, bloodFocusModes, vesselAccount, captureVessel } from './circulation_model.js';

Live.register('vessel_exchange', (stage, params, api) => {
  let focusMode = 0, segIdx = 0, co = 4.9;
  const trials = [];
  const k = makeCanvas(api, 640, 560, 'Interactive systemic blood-vessel, continuity velocity (v = Q / A_total), tissue-fluid and lymphatic return, and blood-component explorer. Compare arteries, capillaries and veins and see why billions of parallel capillaries slow blood down.');
  const say = api.readout();
  api.tabs(bloodFocusModes, i => { focusMode = i; refresh(); });
  const segSlider = api.slider('Vessel segment', { min: 0, max: 6, step: 1, value: 0, fmt: v => `${v}: ${vesselSegments[v].name}`, onInput: v => { segIdx = v; refresh(); } });
  api.slider('Cardiac output', { min: 2.8, max: 14.0, step: 0.7, value: 4.9, fmt: v => `${v.toFixed(1)} L / min`, onInput: v => { co = v; refresh(); } });
  api.button('Next vessel segment', () => { segIdx = (segIdx + 1) % 7; segSlider.set(segIdx); refresh(); });
  api.button('Capture vessel state', () => { const q = captureVessel(vesselAccount(focusMode, segIdx, co)); if (q) trials.push(q); refresh(); });
  api.button('Clear vessel captures', () => { trials.length = 0; refresh(); });

  function refresh() {
    const q = vesselAccount(focusMode, segIdx, co);
    const hasAortaAndCapillary = trials.some(tr => tr.segIdx === 0) && trials.some(tr => tr.segIdx === 3);
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 15, color = c.ink, weight = 400, align = 'center') =>
        api.draw.text(ctx, s, x, y, { size, color, weight, align });

      t(`${q.segmentName} (${q.segmentKind}) · ${q.modeName}`, 320, 30, 20, c.ink, 600);
      t('Continuity in series: same total flow Q passes each level (v = Q / A_total)', 320, 56, 13, c.muted);

      // Left box: Vessel cross-section & continuity numbers (x=24..306, y=76..298)
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.rule; ctx.lineWidth = 1.2;
      ctx.fillRect(24, 76, 282, 222); ctx.strokeRect(24, 76, 282, 222);
      t('VESSEL STRUCTURE & CONTINUITY', 165, 98, 13.5, c.ink, 600);

      // Schematic concentric cross-section
      const outerR = q.segIdx === 3 ? 22 : 36;
      const innerR = q.segIdx === 3 ? 18 : q.segIdx < 3 ? 16 : 28;
      ctx.fillStyle = q.segIdx < 3 ? c.proton : q.segIdx === 3 ? c.green : c.electron;
      ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.arc(165, 148, outerR, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = q.segIdx < 3 ? c.proton : q.segIdx === 3 ? c.green : c.electron;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(165, 148, outerR, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = c.sheet;
      ctx.beginPath(); ctx.arc(165, 148, innerR, 0, Math.PI * 2); ctx.fill();
      ctx.stroke();

      t(`Lumen ${q.diameterMm} mm · Wall ${q.wallMm} mm`, 165, 202, 12.2, c.ink, 600);
      t(`Total parallel area A_total = ${q.totalAreaCm2} cm²`, 165, 226, 12.2, c.neutron, 600);
      t(`Mean P = ${q.meanPMmHg} mmHg · v = ${q.velocityMmSec} mm/s`, 165, 250, 12.2, c.green, 600);
      t(`Valves: ${q.valves}`, 165, 276, 11.5, c.muted);

      // Right box: Tissue Fluid / Lymph & Blood Component Ledger (x=322..616, y=76..298)
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.rule; ctx.lineWidth = 1.2;
      ctx.fillRect(322, 76, 294, 222); ctx.strokeRect(322, 76, 294, 222);
      t('CAPILLARY EXCHANGE & BLOOD ROLES', 469, 98, 13.2, c.ink, 600);

      t('Fluid filtration: pressure + barrier', 469, 124, 11.8, c.proton, 600);
      t('O₂ and CO₂: diffuse down their own gradients', 469, 146, 11.8, c.electron, 600);
      t('Lymph returns filtered fluid and proteins', 469, 170, 11.5, c.green, 600);

      t('• Plasma: cells, ions, nutrients, urea, hormones, CO₂', 469, 200, 11.5, c.ink);
      t('• RBCs: biconcave, no nucleus, haemoglobin binds O₂', 469, 222, 11.5, c.ink);
      t('• Phagocytes engulf; B cells can make antibodies', 469, 244, 11.5, c.ink);
      t('• Platelets: fibrinogen → insoluble fibrin mesh', 469, 266, 11.5, c.ink);
      t('RBCs retained; small protein leaks return in lymph', 469, 288, 11.2, c.muted);

      // Lower explanation lines & capture status
      q.lines.forEach((lineStr, idx) => {
        t(lineStr, 320, 332 + idx * 30, 11.6, c.ink, idx === 0 ? 600 : 400);
      });

      ctx.strokeStyle = c.rule; ctx.beginPath(); ctx.moveTo(24, 414); ctx.lineTo(616, 414); ctx.stroke();
      t(`${q.segmentName}: A_total = ${q.totalAreaCm2} cm² · P = ${q.meanPMmHg} mmHg · v = ${q.velocityMmSec} mm/s`, 320, 446, 14.5, c.green, 600);
      t(hasAortaAndCapillary
        ? 'Aorta and Capillary bed states captured for comparison.'
        : `${trials.length} captured states · capture Aorta (0) and Capillary bed (3) to compare area and speed.`, 320, 480, 12.2, c.ink);
      t('One capillary is ~8 µm wide, but billions in parallel give ~1,000× the aorta’s total area.', 320, 514, 11.5, c.muted);
      t('Representative human vascular tree values; not an individual patient measurement.', 320, 540, 11.5, c.muted);
    });

    const history = trials.map((tr, i) =>
      `${i + 1}: ${tr.segmentName}, A_total ${tr.totalAreaCm2} cm², P ${tr.meanPMmHg} mmHg, v ${tr.velocityMmSec} mm/s`
    ).join(' | ');
    say(`Focus ${focusMode}: ${q.modeName}; segment ${q.segIdx}: ${q.segmentName} (${q.segmentKind}); cardiac output ${q.coLMin.toFixed(1)} L/min. Diameter ${q.diameterMm} mm; wall ${q.wallMm} mm; total cross-sectional area ${q.totalAreaCm2} cm²; mean pressure ${q.meanPMmHg} mmHg; velocity ${q.velocityMmSec} mm/s; valves: ${q.valves}. Capillary exchange: ${q.exchangeModel}. ${q.fluidRoutes.filtration}; ${q.fluidRoutes.lymph}; ${q.fluidRoutes.diffusion}. ${q.lines.join(' ')} ${trials.length} captured states. ${hasAortaAndCapillary ? 'Aorta and Capillary bed states captured for comparison.' : ''} Saved: ${history || 'none'}.`);
  }

  refresh();
  return {};
}, { label: 'Explore blood vessels, capillary exchange, lymph and blood components', three: false, static: true });
