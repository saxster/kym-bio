// Chapter 7 contracts, established in grounding/ch07.md before implementation.
const bounded = (value, min, max, fallback) => Number.isFinite(+value) ? Math.max(min, Math.min(max, +value)) : fallback;
const integer = (v, lo, hi, fallback) => Math.round(bounded(v, lo, hi, fallback));
export const digestionStages = ['Mouth', 'Oesophagus', 'Stomach', 'Duodenum', 'Absorptive epithelium'];
export const foods = ['Starch', 'Protein', 'Triglyceride'];
const foodSteps = [
  [
    ['Salivary amylase begins hydrolysis.', 'Maltose and shorter chains form.', 'Chewing exposes food surface.'],
    ['Muscles propel the swallowed bolus.', 'Salivary processing may continue briefly.', 'No new digestive enzyme is supplied here.'],
    ['Acidic conditions limit salivary amylase.', 'Mixing continues; starch is not all glucose.', 'A compartment change alters enzyme conditions.'],
    ['Pancreatic amylase continues hydrolysis.', 'Maltose and shorter chains form.', 'Pancreatic bicarbonate helps neutralise acid.'],
    ['Brush-border enzymes finish accessible chains.', 'Maltase: maltose + water → glucose.', 'Glucose can cross using transport proteins.'],
  ], [
    ['Teeth break food into smaller pieces.', 'Protein molecules are not all cut by chewing.', 'Saliva moistens the bolus.'],
    ['Coordinated muscle movement propels food.', 'Protein is still mainly in chains.', 'The airway is a separate route.'],
    ['Acid unfolds proteins and activates pepsin.', 'Pepsin hydrolyses protein into peptides.', 'This does not complete protein digestion.'],
    ['Pancreatic proteases continue the breakdown.', 'Trypsin works in suitable intestinal conditions.', 'Peptides become smaller; peptidases continue.'],
    ['Peptidases supply amino acids.', 'Some small peptides enter, then are hydrolysed.', 'Amino acids can leave cells towards portal blood.'],
  ], [
    ['Mixing begins dispersing food components.', 'A fat droplet contains many molecules.', 'Physical division is not molecular hydrolysis.'],
    ['Muscle waves carry the bolus onwards.', 'Transport is not fat digestion.', 'No fat droplet moves directly into blood here.'],
    ['Mixing disperses fat; some lipase acts.', 'The main pancreatic lipase step is ahead.', 'A smaller droplet is not a smaller molecule.'],
    ['Bile helps stabilise dispersed droplets.', 'Lipase + water hydrolyses ester links.', 'Major products: fatty acids + monoacylglycerols.'],
    ['Fatty acids and monoacylglycerols enter cells.', 'Long-chain material is rebuilt and packaged.', 'Chylomicrons then leave towards lacteals.'],
  ],
];
export function digestionAccount(food = 0, stage = 0) {
  const route = integer(food, 0, 2, 0), step = integer(stage, 0, 4, 0);
  return { route, step, food: foods[route], compartment: digestionStages[step], products: ['Glucose', 'Amino acids (some small peptides enter before final hydrolysis)', 'Fatty acids and monoacylglycerols'][route], lines: [...foodSteps[route][step]] };
}
export function dropletAccount(radius = 3, division = 1) {
  const R = bounded(radius, 0, 3, 3), k = integer(division, 1, 6, 1);
  const slots = k ** 3, N = R > 0 ? slots : 0, r = R / k;
  const volume = 4 * Math.PI * R ** 3 / 3;
  const originalArea = 4 * Math.PI * R ** 2, area = N * 4 * Math.PI * r ** 2;
  return { R, k, slots, N, r, volume, originalArea, area, ratio: R > 0 ? area / originalArea : null };
}
export function compareDroplets(a, b) {
  if (!a || !b || !Number.isFinite(a.R) || !Number.isFinite(b.R) || !(a.R > 0 && b.R > 0)) return { valid: false, reason: 'Capture two positive-volume trials.' };
  if (a.R !== b.R) return { valid: false, reason: 'Reference radius changed: total fat volume differs.' };
  if (a.k === b.k) return { valid: false, reason: 'Division unchanged: this repeats the same comparison.' };
  return { valid: true, reason: 'Controlled geometry comparison captured: same volume, different division.' };
}
export const absorptionNames = ['Glucose', 'Long-chain lipid products', 'Shorter-chain fatty acids'];
export const absorptionStages = ['Lumen', 'Epithelial cell', 'Tissue fluid', 'Capillary or lacteal', 'Onward route'];
const absorptionDetails = [
  [
    ['Glucose is available at the lumen-facing membrane.', 'Na⁺-coupled transport can drive glucose entry.'],
    ['An ATP-driven pump maintains the Na⁺ gradient.', 'Glucose exits the tissue-facing side through a protein.'],
    ['Glucose reaches fluid between cells.', 'It next crosses into a villus blood capillary.'],
    ['Capillary blood carries glucose away.', 'Bulk blood flow differs from membrane transport.'],
    ['Portal blood carries glucose first to the liver.', 'Blood then supplies other tissues for uptake and use.'],
  ], [
    ['Fatty acids and monoacylglycerols leave micelles.', 'Products enter cells; whole micelles do not enter.'],
    ['Cells rebuild triglycerides from long-chain products.', 'Protein and other lipids help form chylomicrons.'],
    ['Chylomicrons leave cells into tissue fluid.', 'These new packages are not the original fat droplets.'],
    ['Packages enter a lacteal: a lymph capillary.', 'They are carried onwards in lymph.'],
    ['Lymph reaches blood near the heart.', 'Blood then delivers lipid material onwards.'],
  ], [
    ['This route represents some shorter-chain fatty acids.', 'Their route differs from long-chain packaged fat.'],
    ['Absorbed material passes through epithelial cells.', 'No universal permeability or time is assigned.'],
    ['Material reaches tissue fluid.', 'It can then enter local blood capillaries.'],
    ['Blood, rather than a chylomicron lymph route.', 'This is a representative exception, not all lipids.'],
    ['Portal blood carries material towards the liver.', 'All fat-derived material does not take one route.'],
  ],
];
export function absorptionAccount(route = 0, stage = 0, supply = 3) {
  const selected = integer(route, 0, 2, 0), step = integer(stage, 0, 4, 0), amount = integer(supply, 0, 6, 3);
  const portions = Array.from({ length: 5 }, (_, i) => i === step ? amount : 0);
  const destination = selected === 1 ? 'Lymph → blood near heart' : 'Portal blood → liver';
  return { route: selected, step, supply: amount, portions, destination, name: absorptionNames[selected],
    lines: [...absorptionDetails[selected][step]], compartment: absorptionStages[step],
    boundary: step === 0 ? 'Before membrane crossing' : step === 1 ? 'Across epithelium: entry, processing, exit' : step === 2 ? 'After epithelial exit, before vessel entry' : 'Bulk blood or lymph transport' };
}
// Captures are plain immutable snapshots. Changing current controls cannot rewrite history.
export function captureDigestion(q) {
  return q.step === 4 ? Object.freeze({ route: q.route, step: q.step, food: q.food, products: q.products, lines: Object.freeze([...q.lines]) }) : null;
}
export function captureAbsorption(q) {
  return q.supply > 0 && q.step === 4 ? Object.freeze({ route: q.route, step: q.step, supply: q.supply, destination: q.destination }) : null;
}
export function captureDroplets(q) {
  return q.R > 0 ? Object.freeze({ ...q }) : null;
}
