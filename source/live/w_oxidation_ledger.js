import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { oxidationAccount } from './respiration_model.js';

Live.register('oxidation_ledger', (stage, params, api) => {
  let fat = 1, view = 0;
  const inspected = new Set();
  const k = makeCanvas(api, 640, 550, 'Representative fat complete-oxidation ledger. Total input includes incoming oxygen. A separate original-fat allocation uses the paper’s oxygen-exchange convention and is not a tagged-atom path. Sample mass is mathematical, not a human body target or time course.');
  const say = api.readout();
  api.slider('Fat oxidised', { min: 0, max: 10, step: .1, value: 1, fmt: v => `${v.toFixed(1)} kg sample`, onInput: v => { fat = v; refresh(); } });
  api.tabs(['Total inputs and products', 'Original-fat allocation'], i => { view = i; refresh(); });
  function refresh() {
    const q = oxidationAccount(fat), f = n => n.toFixed(4);
    if (fat === 1) inspected.add(view);
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 16, color = c.ink, align = 'left', weight = 400) => api.draw.text(ctx, s, x, y, { size, color, align, weight });
      const rule = y => { ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(27, y); ctx.lineTo(613, y); ctx.stroke(); };
      t(view ? 'Where is the ORIGINAL sample assigned?' : 'Count the oxygen input as well as the fuel', 320, 30, 21, c.ink, 'center', 600);
      t('C₅₅H₁₀₄O₆ + 78O₂ → 55CO₂ + 52H₂O', 320, 69, 22, c.ink, 'center');
      t('Nominal C12, H1, O16 · one representative triglyceride', 320, 98, 14, c.muted, 'center');
      if (!view) {
        t('ALL INPUTS', 162, 142, 16, c.ink, 'center', 600); t('ALL PRODUCTS', 478, 142, 16, c.ink, 'center', 600);
        const row = (x, y, label, value, color) => {
          ctx.fillStyle = c.sheet; ctx.fillRect(x, y, 259, 72); ctx.strokeStyle = color; ctx.strokeRect(x, y, 259, 72);
          t(label, x + 13, y + 25, 16, color); t(`${f(value)} kg`, x + 245, y + 56, 21, c.ink, 'right', 600);
        };
        row(28, 163, 'Representative fat', q.fat, c.green); row(352, 163, 'Total carbon dioxide', q.co2, c.proton);
        row(28, 250, 'Incoming molecular O₂', q.oxygen, c.electron); row(352, 250, 'Total water', q.water, c.electron);
        t(`${f(q.input)} kg IN = ${f(q.output)} kg OUT`, 320, 362, 22, c.green, 'center', 600);
        rule(386);
        t('Per representative reaction: C 55 = 55; H 104 = 104; O 162 = 162.', 320, 415, 15, c.ink, 'center');
        t('Total products include atoms from incoming oxygen.', 320, 448, 17, c.ink, 'center');
        t('The original-fat contribution is a different account: select the other view.', 320, 481, 14, c.muted, 'center');
      } else {
        t(`Original sample only: ${fat.toFixed(1)} kg`, 320, 144, 20, c.ink, 'center', 600);
        // Fixed fraction, not a gas-volume bar; the selected mass changes the ledger values.
        const x = 40, y = 179, w = 560, split = w * q.fractionCO2;
        ctx.fillStyle = c.proton; ctx.fillRect(x, y, split, 36);
        ctx.fillStyle = c.electron; ctx.fillRect(x + split, y, w - split, 36);
        ctx.strokeStyle = c.ink; ctx.strokeRect(x, y, w, 36);
        t('Assigned to CO₂: about 84%', 40, 249, 18, c.proton);
        t(`${f(q.assignedCO2)} kg of the ORIGINAL fat`, 40, 278, 19, c.ink);
        t('Assigned to water: about 16%', 40, 318, 18, c.electron);
        t(`${f(q.assignedWater)} kg of the ORIGINAL fat`, 40, 347, 19, c.ink);
        rule(372);
        t('Assignment: carbon + 4 of the 6 fuel oxygen atoms to CO₂;', 320, 401, 15, c.ink, 'center');
        t('hydrogen + the remaining 2 fuel oxygen atoms to water.', 320, 426, 15, c.ink, 'center');
        t('An approximate accounting convention after oxygen exchange with body water.', 320, 462, 14, c.muted, 'center');
        t('The net equation alone cannot assign those oxygen origins uniquely.', 320, 488, 14, c.muted, 'center');
      }
      t('Complete-oxidation sample model · not a diet, body-mass change or breathing target', 320, 535, 13, c.muted, 'center');
    });
    say(`Account view ${view}; fat sample ${fat.toFixed(1)} kg. Total ledger: ${f(q.fat)} kg fat + ${f(q.oxygen)} kg O₂ = ${f(q.co2)} kg total CO₂ + ${f(q.water)} kg total H₂O. Input ${f(q.input)} kg = output ${f(q.output)} kg. Separately, assigned ORIGINAL-fat contribution: ${f(q.assignedCO2)} kg to CO₂ and ${f(q.assignedWater)} kg to water (724/860 and 136/860, approximately 84%/16%). At 1 kg this is about 842 g/158 g, customarily rounded 840 g/160 g. ${inspected.size === 2 && fat === 1 ? 'Both 1 kg accounts inspected.' : ''} Oxygen exchange with body water motivates the paper’s assignment; the balanced equation alone cannot determine atom origins. Water joins body water and may leave by several routes later. Nominal masses C12 H1 O16; displayed entries rounded separately, totals calculated before rounding. All fuel carbon reaches CO₂ in this complete-oxidation model; faster voluntary breathing does not force oxidation.`);
  }
  refresh(); return {};
}, { label: 'Balance both fat oxidation accounts', three: false, static: true });
