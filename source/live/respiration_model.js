// Chapter 6 teaching accounts, fixed in grounding/ch06.md before implementation.
// Stages focus attention; they do not advance a biochemical clock.
const bounded = (value, min, max, fallback) => Number.isFinite(+value) ? Math.max(min, Math.min(max, +value)) : fallback;
export const relayStages = [
  ['Load electron carriers', 'Fuel reactions transfer electrons to carriers such as NADH.'],
  ['Pump protons out', 'Electron transfer towards O₂ drives H⁺ pumping from matrix to intermembrane space.'],
  ['Hold the difference', 'The inner membrane separates H⁺ concentration and electric-potential differences.'],
  ['Let protons return', 'H⁺ returns through synthase: its rotor and shaft turn; its head stays still.'],
  ['Make ATP available', 'Rotation changes catalytic shapes in the matrix-facing head: ADP + Pᵢ → ATP.'],
];
export function relayAccount(stage = 0, oxygen = true) {
  const step = Math.round(bounded(stage, 0, 4, 0)), supplied = !!oxygen;
  const absent = [
    'Carriers cannot keep unloading electrons through this chain without its terminal acceptor.',
    'Sustained absence of O₂ stalls this electron chain and its associated proton pumping.',
    'After the residual gradient dissipates, this chain cannot maintain the useful difference.',
    'Without the maintained gradient, sustained proton-driven ATP synthesis cannot continue.',
    'This aerobic relay no longer supplies ATP; glycolysis can still supply ATP if NAD⁺ is regenerated.',
  ];
  return { step, supplied, title: relayStages[step][0], detail: supplied ? relayStages[step][1] : absent[step],
    chainActive: supplied, maintainedGradient: supplied, sustainedSynthase: supplied };
}
export function oxidationAccount(fat = 1) {
  const m = bounded(fat, 0, 10, 1);
  const oxygen = m * 2496 / 860, co2 = m * 2420 / 860, water = m * 936 / 860;
  return { fat: m, oxygen, co2, water, input: m + oxygen, output: co2 + water,
    assignedCO2: m * 724 / 860, assignedWater: m * 136 / 860,
    fractionCO2: 724 / 860, fractionWater: 136 / 860,
    atomsIn: [55, 104, 162], atomsOut: [55, 104, 162],
    nominal: { fat: 860, oxygen: 2496, co2: 2420, water: 936 } };
}
export const carrierStages = ['Supply NAD⁺', 'Collect electrons', 'Follow the recipient', 'Restore NAD⁺', 'Keep glycolysis possible'];
export const carrierRoutes = [
  { name: 'Aerobic', recipient: 'Electron chain → O₂ → water', products: 'Complete glucose oxidation: 6 CO₂ + 6 H₂O',
    recycle: 'The aerobic electron chain oxidises NADH back to NAD⁺.',
    limit: 'Additional ATP can come from the membrane relay; no total yield is assigned.' },
  { name: 'Yeast fermentation', recipient: 'Organic recipient → ethanol', products: 'Per glucose: 2 ethanol + 2 CO₂',
    recycle: 'Electrons from NADH reach an organic recipient on the ethanol route, restoring NAD⁺.',
    limit: 'Fermentation recycling adds no ATP beyond the two net ATP of glycolysis.' },
  { name: 'Lactate fermentation', recipient: 'Pyruvate receives electrons → lactate', products: 'Per glucose: 2 lactate; no CO₂ in this route',
    recycle: 'Pyruvate receives electrons from NADH to form lactate, restoring NAD⁺.',
    limit: 'Lactate can form with oxygen present and can be reused as fuel.' },
];
export function carrierAccount(route = 0, stage = 0) {
  const selected = Math.round(bounded(route, 0, 2, 0)), step = Math.round(bounded(stage, 0, 4, 0));
  const r = carrierRoutes[selected];
  const details = ['Glycolysis requires the oxidised carrier NAD⁺ to accept electrons.',
    'Glucose becomes two pyruvates; NAD⁺ accepts electrons and becomes NADH.',
    r.recipient, r.recycle,
    `Regenerated NAD⁺ permits continued glycolysis. ${r.limit}`];
  return { route: selected, step, ...r, title: carrierStages[step], detail: details[step],
    investedATP: 2, formedATP: 4, netATP: 2, pyruvates: 2, fermentationExtraATP: selected ? 0 : null };
}
