import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { relayAccount, relayStages } from './respiration_model.js';

Live.register('respiration_relay', (stage, params, api) => {
  let step = 0, oxygen = true;
  const compared = new Set();
  const k = makeCanvas(api, 640, 550, 'Manual inner mitochondrial membrane relay. Intermembrane space above, matrix below. Electron transfer towards oxygen powers outward proton pumping; proton return through ATP synthase supports ATP formation. Lack-of-oxygen comparison is sustained absence after residual gradients dissipate, not an immediate ATP shutdown.');
  const say = api.readout();
  api.tabs(['O₂ available', 'Sustained O₂ absence'], i => { oxygen = i === 0; refresh(); });
  const focus = api.slider('Relay stage', { min: 0, max: 4, step: 1, value: 0,
    fmt: v => `${v}: ${relayStages[v][0]}`, onInput: v => { step = v; refresh(); } });
  api.button('Next relay stage', () => { step = (step + 1) % 5; focus.set(step); refresh(); });
  function refresh() {
    const q = relayAccount(step, oxygen);
    if (step === 4) compared.add(oxygen ? 0 : 1);
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 16, color = c.ink, align = 'left', weight = 400) => api.draw.text(ctx, s, x, y, { size, color, align, weight });
      const line = (x1, y1, x2, y2, color = c.rule, width = 1) => { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
      const box = (x, y, w, h, label, active) => { ctx.fillStyle = c.sheet; ctx.fillRect(x, y, w, h); ctx.strokeStyle = active ? c.green : c.rule; ctx.lineWidth = active ? 3 : 1; ctx.strokeRect(x, y, w, h); t(label, x + w / 2, y + h / 2 + 5, 15, c.ink, 'center'); };
      t(`${step} · ${q.title}`, 320, 30, 22, c.ink, 'center', 600);
      t(oxygen ? 'O₂ available: sustained aerobic relay' : 'No O₂: settled comparison after gradient loss', 320, 58, 15, oxygen ? c.green : c.proton, 'center');
      ctx.fillStyle = c.paper; ctx.fillRect(22, 80, 596, 140);
      t('INTERMEMBRANE SPACE', 36, 103, 15, c.ink, 'left', 600);
      t(oxygen ? 'Higher H⁺ concentration; more positive' : 'No maintained H⁺ electrochemical difference', 36, 129, 14, oxygen ? c.proton : c.muted);
      // A single labelled H+ token denotes direction, never a stoichiometric count.
      if (oxygen) { t('H⁺', 180, 170, 22, c.proton, 'center'); t('H⁺', 477, 170, 22, c.proton, 'center'); }
      for (const y of [222, 257]) line(22, y, 618, y, c.green, 2);
      for (let x = 27; x < 617; x += 18) line(x, 229, x + 4, 250, c.rule);
      box(135, 208, 90, 64, '', step === 1);
      box(431, 208, 92, 64, '', step === 3);
      t('Pump', 83, 245, 15, c.ink, 'center'); t('Rotor', 572, 245, 15, c.ink, 'center');
      t('Inner membrane', 324, 245, 14, c.ink, 'center');
      if (oxygen) {
        api.draw.arrow(ctx, 180, 307, 180, 183, c.proton, step === 1 ? 4 : 2, 9);
        api.draw.arrow(ctx, 477, 180, 477, 268, c.proton, step === 3 ? 4 : 2, 9);
      } else {
        t('Pumping stalled', 180, 293, 14, c.proton, 'center');
        t('No sustained drive', 477, 293, 14, c.proton, 'center');
      }
      t('H⁺ OUT', 90, 188, 14, c.proton, 'center'); t('H⁺ RETURN', 561, 188, 14, c.proton, 'center');
      t('MATRIX', 36, 338, 15, c.ink, 'left', 600);
      t('NADH', 65, 375, 17, step === 0 ? c.green : c.electron, 'center');
      api.draw.arrow(ctx, 102, 369, 248, 369, oxygen ? c.electron : c.muted, 2, 9);
      t('e⁻ chain', 176, 354, 14, c.electron, 'center');
      t(oxygen ? 'O₂ → water' : 'O₂ absent', 302, 375, 16, oxygen ? c.electron : c.proton, 'center');
      line(477, 273, 477, 324, c.green, 6);
      box(422, 326, 110, 67, 'Fixed head', step === 4);
      t('ADP + Pᵢ', 409, 426, 16, c.ink, 'center');
      api.draw.arrow(ctx, 454, 420, 503, 420, oxygen ? c.green : c.muted, 2, 9);
      t(oxygen ? 'ATP' : 'No sustained ATP', oxygen ? 543 : 550, 426, oxygen ? 19 : 12, oxygen ? c.green : c.proton, 'center');
      line(24, 448, 616, 448);
      const notes = oxygen ? [
        ['Fuel → carriers → membrane electron chain.', 'Carbon dioxide forms in earlier carbon reactions.'],
        ['Electron transfer towards oxygen drives H⁺ out.', 'The pump is separate from ATP synthase.'],
        ['Concentration AND electric potential store the difference.', 'A membrane freely leaky to H⁺ cannot hold it.'],
        ['H⁺ returns to the matrix through ATP synthase.', 'Rotation changes shapes in its fixed catalytic head.'],
        ['ADP + phosphate is converted to ATP.', 'Some ATP is also made outside this membrane relay.'],
      ][step] : [
        'No O₂: this aerobic chain cannot keep accepting electrons.',
        'This is sustained absence after residual gradients dissipate.',
      ];
      notes.forEach((s, i) => t(s, 320, 478 + i * 24, 15, c.ink, 'center'));
      t('Manual focus stages overlap in life · geometry schematic · no clock or yield', 320, 536, 13, c.muted, 'center');
    });
    say(`Oxygen condition ${oxygen ? 0 : 1}; relay stage ${step}: ${q.title}. ${q.detail} Pump: matrix → intermembrane space; return: intermembrane space → matrix. Oxygen receives electrons and protons to form water; CO₂ forms in earlier carbon reactions. ${compared.size === 2 ? 'Both oxygen endpoints inspected.' : 'Inspect stage 4 in both oxygen conditions to compare endpoints.'} The no-O₂ state is sustained absence after the residual gradient dissipates. It does not mean all cellular ATP instantly becomes zero. Stages overlap in life; no elapsed time, rotation speed or ATP yield is calculated.`);
  }
  refresh();
  return {};
}, { label: 'Follow the membrane energy relay', three: false, static: true });
