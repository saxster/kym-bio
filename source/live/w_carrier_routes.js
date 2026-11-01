import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { carrierAccount, carrierStages } from './respiration_model.js';

Live.register('carrier_routes', (stage, params, api) => {
  let route = 0, step = 0;
  const compared = new Set();
  const k = makeCanvas(api, 640, 560, 'Manual carrier-recycling comparison: aerobic electron chain, yeast fermentation and lactate fermentation. Glycolysis reduces NAD+ to NADH. Each route restores NAD+ by transferring those electrons onwards. Glycolysis forms four ATP after investing two: two net ATP. Fermentation recycling adds no extra ATP. No reaction clock, gas volume or universal ATP yield.');
  const say = api.readout();
  const control = api.slider('Carrier stage', { min: 0, max: 4, step: 1, value: 0,
    fmt: v => `${v}: ${carrierStages[v]}`, onInput: v => { step = v; refresh(); } });
  api.tabs(['Aerobic route', 'Yeast fermentation', 'Lactate fermentation'], i => { route = i; refresh(); });
  api.button('Next carrier stage', () => { step = (step + 1) % 5; control.set(step); refresh(); });
  function refresh() {
    const q = carrierAccount(route, step);
    if (step === 4) compared.add(route);
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 16, color = c.ink, align = 'left', weight = 400) => api.draw.text(ctx, s, x, y, { size, color, align, weight });
      const box = (x, y, w, h, active) => { ctx.fillStyle = c.sheet; ctx.fillRect(x, y, w, h); ctx.strokeStyle = active ? c.green : c.rule; ctx.lineWidth = active ? 3 : 1; ctx.strokeRect(x, y, w, h); };
      t(`${step} · ${q.title}`, 320, 29, 22, c.ink, 'center', 600);
      t(q.name, 320, 59, 18, c.green, 'center');
      box(172, 90, 296, 97, step === 0 || step === 1);
      t('GLYCOLYSIS · cytoplasm', 320, 119, 17, c.ink, 'center', 600);
      t('1 glucose → 2 pyruvates', 320, 154, 19, c.ink, 'center');
      t('NAD⁺', 71, 124, 21, step === 0 ? c.green : c.electron, 'center');
      api.draw.arrow(ctx, 112, 131, 162, 131, c.electron, 2, 8);
      api.draw.arrow(ctx, 476, 131, 527, 131, c.electron, 2, 8);
      t('NADH', 571, 124, 21, step === 1 ? c.green : c.electron, 'center');
      t('4 ATP formed − 2 ATP invested = 2 net ATP', 320, 219, 19, c.green, 'center', 600);
      t('These two ATP belong to glycolysis.', 320, 246, 15, c.ink, 'center');
      box(172, 280, 296, 91, step === 2 || step === 3);
      t(route === 0 ? 'AEROBIC ELECTRON CHAIN' : 'FERMENTATION', 320, 306, 16, c.ink, 'center', 600);
      const recipient = route === 0 ? ['Electrons → O₂', 'Water forms at the chain end.'] : route === 1 ? ['Organic recipient accepts electrons.', 'Ethanol route restores NAD⁺.'] : ['Pyruvate accepts electrons.', 'Lactate route restores NAD⁺.'];
      recipient.forEach((s, i) => t(s, 320, 333 + i * 24, 14, c.ink, 'center'));
      ctx.strokeStyle = c.electron; ctx.lineWidth = step === 3 ? 3 : 2;
      ctx.beginPath(); ctx.moveTo(571, 145); ctx.lineTo(571, 324); ctx.lineTo(480, 324); ctx.stroke();
      api.draw.arrow(ctx, 493, 324, 476, 324, c.electron, 2, 7);
      ctx.beginPath(); ctx.moveTo(164, 324); ctx.lineTo(71, 324); ctx.lineTo(71, 160); ctx.stroke();
      api.draw.arrow(ctx, 71, 174, 71, 147, c.electron, 2, 8);
      t('NAD⁺', 79, 353, 15, c.electron, 'center'); t('restored', 79, 374, 13, c.electron, 'center');
      t('e⁻ passed', 565, 354, 13, c.electron, 'center'); t('onwards', 565, 374, 13, c.electron, 'center');
      box(25, 403, 590, 82, step === 4);
      t(q.products, 320, 433, route === 2 ? 17 : 18, c.ink, 'center', 600);
      t(route === 0 ? 'Membrane relay can add ATP; total not assigned.' : 'Recycling step adds 0 extra ATP.', 320, 464, 16, c.green, 'center');
      t(route === 2 ? 'Lactate can form with O₂ present; it can be reused as fuel.' : route === 1 ? 'This yeast route is not a unique recipe for mixed-community idli.' : 'Carbon processing, carriers and compartments are compressed here.', 320, 514, 14, c.muted, 'center');
      t('Manual schematic · no NAD proton balance, clock, gas volume or rate', 320, 547, 13, c.muted, 'center');
    });
    say(`Route ${route}; carrier stage ${step}: ${q.title}. ${q.detail} NAD⁺ → NADH during glycolytic electron collection; NADH → NAD⁺ when electrons pass onwards. ${q.products}. Glycolysis: 4 ATP formed − 2 ATP invested = 2 net ATP per glucose. ${route === 0 ? q.limit : 'Fermentation recycling adds 0 extra ATP.'} ${compared.size === 3 ? 'All three recycling endpoints inspected.' : `Recycling endpoints inspected: ${compared.size} of 3.`} This is a carrier-recycling schematic, not proton-balanced NAD chemistry or a timed particle mechanism. Lactate formation does not require complete absence of oxygen and does not explain next-day soreness. Mixed idli communities are outside this route account; no gas volume, incubation temperature or universal yield is calculated.`);
  }
  refresh(); return {};
}, { label: 'Compare three carrier-recycling routes', three: false, static: true });
