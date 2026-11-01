// Pure domain model for Chapter 14: The Glitch Engine & Natural Selection
// (Cambridge Lower Secondary 0893 & IGCSE Biology 0610 Topic 18 + Topic 1.2 Supplement 5–6).
// Zero DOM or browser globals; verified exhaustively by source/tests/ch14_domain.mjs.

function clampInt(val, min, max, fallback) {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  const r = Math.round(n);
  if (r < min) return min;
  if (r > max) return max;
  return r;
}

function roundTo(val, digits = 2) {
  const f = 10 ** digits;
  return Math.round(val * f) / f;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WIDGET 1 DOMAIN: VARIATION (18.1.1–18.1.5) & MUTATION (18.1.6–18.1.10)
// ─────────────────────────────────────────────────────────────────────────────

export const VARIATION_MODES = Object.freeze([
  Object.freeze({
    index: 0,
    id: 'continuous_vs_discontinuous',
    label: 'Continuous vs Discontinuous',
    shortLabel: 'Continuous vs Discontinuous',
    summary:
      'Continuous and discontinuous describe observed patterns. Our height example reflects genes and environment; our ABO example uses inherited categories. These causes are example-specific, not universal.',
  }),
  Object.freeze({
    index: 1,
    id: 'replica_plate_proof',
    label: 'Replica Plate Proof',
    shortLabel: 'Replica Plate Proof',
    summary:
      'Joshua and Esther Lederberg (1952) stamped bacterial colonies from a drug-free master plate onto antibiotic agar using sterile velveteen: resistant colonies appeared at identical compass positions on all replicates, showing that resistance can already exist before antibiotic exposure; the illustrated coordinates are invented.',
  }),
  Object.freeze({
    index: 2,
    id: 'mutagen_dose',
    label: 'Mutagen Dose',
    shortLabel: 'Mutagen Dose',
    summary:
      'A gene mutation is a random change in the base sequence of DNA ( the only way new alleles are formed). Ionising radiation (X-rays, gamma rays) and non-ionising UV and mutagenic chemicals increase the rate of mutation above the ~10⁻⁹/bp baseline, but mutations remain blind to usefulness.',
  }),
  Object.freeze({
    index: 3,
    id: 'meiosis_shuffle',
    label: 'Meiosis Shuffle',
    shortLabel: 'Meiosis Shuffle',
    summary:
      'Four processes generate genetic variation in sexual populations (0610 18.1.10): mutation forms new alleles, while meiosis (crossing over + 2ⁿ independent assortment), random mating, and random fertilisation reshuffle existing alleles into unique combinations.',
  }),
]);

export const VARIATION_TRAITS = Object.freeze([
  Object.freeze({
    step: 1,
    id: 'student_height',
    name: 'Student height (continuous, cm)',
    shortName: 'Height (continuous)',
    variationType: 'continuous',
    graphType: 'histogram_touching_bars',
    causedBy: 'Both genes and environment',
    geneticBasis: 'Polygenic (hundreds of additive gene loci)',
    environmentalEffect: 'Nutrition, sleep, and childhood health shift the mean smoothly',
    hasIntermediates: true,
    unit: 'cm',
    baseMean: 151.0,
    sd: 5.4,
    envDeltaPerStep: 1.8,
    bins: Object.freeze([
      Object.freeze({ label: '135–139', mid: 137, basePct: 4.0 }),
      Object.freeze({ label: '140–144', mid: 142, basePct: 12.0 }),
      Object.freeze({ label: '145–149', mid: 147, basePct: 24.0 }),
      Object.freeze({ label: '150–154', mid: 152, basePct: 32.0 }),
      Object.freeze({ label: '155–159', mid: 157, basePct: 18.0 }),
      Object.freeze({ label: '160–164', mid: 162, basePct: 7.5 }),
      Object.freeze({ label: '165–169', mid: 167, basePct: 2.5 }),
    ]),
  }),
  Object.freeze({
    step: 2,
    id: 'body_mass',
    name: 'Body mass (continuous, kg)',
    shortName: 'Body mass (continuous)',
    variationType: 'continuous',
    graphType: 'histogram_touching_bars',
    causedBy: 'Both genes and environment',
    geneticBasis: 'Polygenic (metabolic and skeletal loci)',
    environmentalEffect: 'Caloric intake and physical activity shift the continuous distribution',
    hasIntermediates: true,
    unit: 'kg',
    baseMean: 44.5,
    sd: 4.2,
    envDeltaPerStep: 1.6,
    bins: Object.freeze([
      Object.freeze({ label: '32–35', mid: 33.5, basePct: 4.5 }),
      Object.freeze({ label: '36–39', mid: 37.5, basePct: 13.0 }),
      Object.freeze({ label: '40–43', mid: 41.5, basePct: 25.5 }),
      Object.freeze({ label: '44–47', mid: 45.5, basePct: 30.0 }),
      Object.freeze({ label: '48–51', mid: 49.5, basePct: 17.0 }),
      Object.freeze({ label: '52–55', mid: 53.5, basePct: 7.0 }),
      Object.freeze({ label: '56–59', mid: 57.5, basePct: 3.0 }),
    ]),
  }),
  Object.freeze({
    step: 3,
    id: 'abo_blood_group',
    name: 'ABO blood group (discontinuous)',
    shortName: 'ABO blood (discontinuous)',
    variationType: 'discontinuous',
    graphType: 'bar_chart_separated_bars',
    causedBy: 'Genes alone',
    geneticBasis: 'Single gene locus on Chromosome 9 (alleles Iᴬ, Iᴮ, Iᴼ)',
    environmentalEffect: 'Nutrition does not change the inherited ABO alleles in this model',
    hasIntermediates: false,
    unit: 'group',
    baseMean: null,
    sd: null,
    envDeltaPerStep: 0,
    bins: Object.freeze([
      Object.freeze({ label: 'Group O (IᴼIᴼ)', code: 'O', basePct: 34.0 }),
      Object.freeze({ label: 'Group B (IᴮIᴮ/IᴮIᴼ)', code: 'B', basePct: 33.0 }),
      Object.freeze({ label: 'Group A (IᴬIᴬ/IᴬIᴼ)', code: 'A', basePct: 24.0 }),
      Object.freeze({ label: 'Group AB (IᴬIᴮ)', code: 'AB', basePct: 9.0 }),
    ]),
  }),
  Object.freeze({
    step: 4,
    id: 'pea_seed_shape',
    name: 'Pea seed shape (discontinuous)',
    shortName: 'Pea shape (discontinuous)',
    variationType: 'discontinuous',
    graphType: 'bar_chart_separated_bars',
    causedBy: 'Genes alone',
    geneticBasis: 'Single SBEI gene locus on pea Chromosome 5 (alleles R, r)',
    environmentalEffect: 'Soil watering does not turn an rr wrinkled genotype into an R_ round genotype',
    hasIntermediates: false,
    unit: 'category',
    baseMean: null,
    sd: null,
    envDeltaPerStep: 0,
    bins: Object.freeze([
      Object.freeze({ label: 'Round (RR, Rr)', code: 'Round', basePct: 74.74 }),
      Object.freeze({ label: 'Wrinkled (rr)', code: 'Wrinkled', basePct: 25.26 }),
    ]),
  }),
]);

export const MUTAGEN_ENVIRONMENT_STEPS = Object.freeze([
  Object.freeze({
    step: 1,
    id: 'baseline_1x',
    label: 'Illustrative baseline (1×, 10⁻⁹/bp)',
    shortLabel: 'Baseline 1×',
    mutagenMultiplier: 1,
    mutationRatePerBp: 1e-9,
    newMutantsPer10MCells: 3,
    mutagenAgent: 'Spontaneous DNA polymerase replication slippage (~10⁻⁹ per base pair)',
    nutritionLabel: 'Baseline diet / environment (+0.0 offset)',
    envStepIndex: 0,
  }),
  Object.freeze({
    step: 2,
    id: 'chemical_5x',
    label: 'Illustrative chemical dose (5×)',
    shortLabel: 'Chemical 5×',
    mutagenMultiplier: 5,
    mutationRatePerBp: 5e-9,
    newMutantsPer10MCells: 15,
    mutagenAgent: 'Chemical mutagens (nitrous acid, mustard gas, tobacco tar benzopyrene)',
    nutritionLabel: 'Improved nutrition (+1 step shift on continuous traits only)',
    envStepIndex: 1,
  }),
  Object.freeze({
    step: 3,
    id: 'uv_radiation_20x',
    label: 'Illustrative UV dose (20×)',
    shortLabel: 'UV / Rad 20×',
    mutagenMultiplier: 20,
    mutationRatePerBp: 2e-8,
    newMutantsPer10MCells: 60,
    mutagenAgent: 'Ultraviolet (UV) radiation (thymine dimers distorting DNA helix)',
    nutritionLabel: 'High nutrition (+2 step shift on continuous traits only)',
    envStepIndex: 2,
  }),
  Object.freeze({
    step: 4,
    id: 'ionising_xray_50x',
    label: 'Illustrative ionising dose (50×)',
    shortLabel: 'X-ray 50×',
    mutagenMultiplier: 50,
    mutationRatePerBp: 5e-8,
    newMutantsPer10MCells: 150,
    mutagenAgent: 'Ionising radiation (X-rays, gamma rays, radioactive alpha/beta particles)',
    nutritionLabel: 'Optimal nutrition (+3 step shift on continuous traits only)',
    envStepIndex: 3,
  }),
]);

export const LEDERBERG_REPLICA_COLONIES = Object.freeze([
  Object.freeze({ id: 1, x: 0.28, y: 0.24, angleDeg: 310, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 2, x: 0.52, y: 0.18, angleDeg: 5, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 3, x: 0.74, y: 0.30, angleDeg: 55, resistant: true, genotype: 'rpsL-mut (pre-existing resistant)' }),
  Object.freeze({ id: 4, x: 0.22, y: 0.48, angleDeg: 270, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 5, x: 0.46, y: 0.44, angleDeg: 340, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 6, x: 0.66, y: 0.52, angleDeg: 95, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 7, x: 0.33, y: 0.72, angleDeg: 215, resistant: true, genotype: 'rpsL-mut (pre-existing resistant)' }),
  Object.freeze({ id: 8, x: 0.56, y: 0.76, angleDeg: 165, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 9, x: 0.78, y: 0.66, angleDeg: 120, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 10, x: 0.38, y: 0.30, angleDeg: 325, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
  Object.freeze({ id: 11, x: 0.62, y: 0.28, angleDeg: 35, resistant: true, genotype: 'rpsL-mut (pre-existing resistant)' }),
  Object.freeze({ id: 12, x: 0.48, y: 0.62, angleDeg: 185, resistant: false, genotype: 'rpsL⁺ (susceptible)' }),
]);

export const FOUR_VARIATION_SOURCES = Object.freeze([
  Object.freeze({
    order: 1,
    source: 'Mutation',
    createsNewAlleles: true,
    role: 'Random change in DNA base sequence; the ONLY source of brand-new alleles (e.g. GAG → GTG creating Hbˢ, or rpsL streptomycin resistance).',
    appliesTo: 'Both asexual and sexual organisms',
  }),
  Object.freeze({
    order: 2,
    source: 'Meiosis',
    createsNewAlleles: false,
    role: 'Crossing over (Prophase I) and independent assortment of homologous chromosomes (2²³ = 8,388,608 gamete combinations in humans) shuffle existing alleles.',
    appliesTo: 'Sexual reproduction only',
  }),
  Object.freeze({
    order: 3,
    source: 'Random mating',
    createsNewAlleles: false,
    role: 'Any two individuals in the breeding population may pair up, combining two independent parental genomes.',
    appliesTo: 'Sexual reproduction only',
  }),
  Object.freeze({
    order: 4,
    source: 'Random fertilisation',
    createsNewAlleles: false,
    role: 'Any one of millions of genetically unique haploid male gametes fuses with a haploid female gamete (>70 trillion diploid combinations per couple).',
    appliesTo: 'Sexual reproduction only',
  }),
]);

export function simulateVariationMutation(params = {}) {
  const modeIndex = clampInt(params.modeIndex, 0, VARIATION_MODES.length - 1, 0);
  const traitStep = clampInt(params.traitStep, 1, VARIATION_TRAITS.length, 1);
  const envStep = clampInt(params.envStep, 1, MUTAGEN_ENVIRONMENT_STEPS.length, 1);

  const mode = VARIATION_MODES[modeIndex];
  const trait = VARIATION_TRAITS[traitStep - 1];
  const env = MUTAGEN_ENVIRONMENT_STEPS[envStep - 1];

  const isContinuous = trait.variationType === 'continuous';
  const shift = isContinuous ? roundTo(env.envStepIndex * trait.envDeltaPerStep, 2) : 0;
  const computedMean = isContinuous ? roundTo(trait.baseMean + shift, 2) : null;

  // Compute bin percentages for continuous (shifted normal profile) vs discontinuous (invariant)
  let rawBins;
  if (isContinuous) {
    const weights = trait.bins.map((b) => {
      const z = (b.mid - computedMean) / trait.sd;
      return Math.exp(-0.5 * z * z);
    });
    const totalW = weights.reduce((a, b) => a + b, 0) || 1;
    rawBins = trait.bins.map((b, idx) => {
      const pct = roundTo((weights[idx] / totalW) * 100, 1);
      return Object.freeze({
        label: b.label,
        mid: b.mid,
        pct,
        countIn200: Math.round((pct / 100) * 200),
      });
    });
  } else {
    rawBins = trait.bins.map((b) =>
      Object.freeze({
        label: b.label,
        code: b.code,
        pct: b.basePct,
        countIn200: Math.round((b.basePct / 100) * 200),
      })
    );
  }

  const resistantColonies = LEDERBERG_REPLICA_COLONIES.filter((c) => c.resistant);

  return Object.freeze({
    modeIndex,
    mode,
    traitStep,
    trait,
    envStep,
    env,
    isContinuous,
    graphType: trait.graphType,
    causedBy: trait.causedBy,
    hasIntermediates: trait.hasIntermediates,
    computedMean,
    environmentalShift: shift,
    bins: Object.freeze(rawBins),
    replicaPlating: Object.freeze({
      masterColonyCount: LEDERBERG_REPLICA_COLONIES.length,
      resistantColonyCount: resistantColonies.length,
      resistantColonyIds: Object.freeze(resistantColonies.map((c) => c.id)),
      replicatePlatesAgree: true,
      preExistingBeforeAntibiotic: true,
      inducedByAntibiotic: false,
      colonies: LEDERBERG_REPLICA_COLONIES,
    }),
    mutagenStats: Object.freeze({
      multiplier: env.mutagenMultiplier,
      ratePerBp: env.mutationRatePerBp,
      newMutantsPer10MCells: env.newMutantsPer10MCells,
      agent: env.mutagenAgent,
      isRandom: true,
      fractionSilentOrNeutral: 0.7,
      fractionHarmful: 0.299,
      fractionBeneficial: 0.001,
    }),
    variationSources: FOUR_VARIATION_SOURCES,
    readout:
      modeIndex === 0
        ? `${trait.name}: ${trait.variationType} variation (${
            isContinuous
              ? `histogram with touching bars, mean = ${computedMean} ${trait.unit}, range between extremes, caused by both genes and environment`
              : `bar chart with separated bars, ${rawBins.map((b) => `${b.code || b.label} ${b.pct}%`).join(' · ')}, zero intermediates, controlled by the inherited locus in this example`
          }).`
        : modeIndex === 1
        ? `Lederberg 1952 replica-plating proof: Master plate (drug-free) holds ${LEDERBERG_REPLICA_COLONIES.length} colonies; stamping with sterile velvet onto Streptomycin Replicates A, B, and C reveals the exact same ${resistantColonies.length} resistant colonies (#3, #7, #11), proving resistance mutations existed before antibiotic contact.`
        : modeIndex === 2
        ? `${env.label}: illustrative mutation rate = ${env.mutagenMultiplier}× baseline (${env.mutationRatePerBp.toExponential(0)} per base pair; ~${env.newMutantsPer10MCells} mutant cells per 10⁷ divisions via ${env.mutagenAgent}). Mutation probabilities vary among sites; changes are not specified by what the organism needs. The dose multipliers and effect fractions are invented teaching assumptions.`
        : `Four sources of genetic variation (0610 18.1.10): ONLY mutation creates brand-new alleles; meiosis (crossing over + 2²³ = 8,388,608 independent assortments), random mating, and random fertilisation reshuffle existing alleles.`,
  });
}

export function captureVariationTrial(sim) {
  const s = sim?.mode ? sim : simulateVariationMutation(sim);
  return Object.freeze({
    modeId: s.mode.id,
    modeLabel: s.mode.shortLabel,
    traitId: s.trait.id,
    traitName: s.trait.shortName,
    variationType: s.trait.variationType,
    causedBy: s.causedBy,
    graphType: s.graphType,
    envLabel: s.env.shortLabel,
    mutagenMultiplier: s.env.mutagenMultiplier,
    computedMean: s.computedMean,
    summaryTag: `${s.trait.shortName} (${s.trait.variationType}, ${
      s.isContinuous ? `mean ${s.computedMean} ${s.trait.unit}` : 'no model nutrition shift'
    }, ${s.env.shortLabel})`,
  });
}

export function compareVariationTrials(a, b) {
  if (!a || !b) {
    return Object.freeze({
      contrasting: false,
      summary: 'Capture two trials to compare continuous vs discontinuous variation or mutagen rates.',
    });
  }
  const summary = `#1 ${a.summaryTag} | #2 ${b.summaryTag} — Continuous traits (height, mass) form touching histogram bars shifted by both genes and environment, whereas discontinuous traits (ABO blood groups, pea shape) form separated bars; these particular examples use inherited loci, and new DNA variation can arise by mutation.`;
  return Object.freeze({
    contrasting:
      a.traitId !== b.traitId ||
      a.modeId !== b.modeId ||
      a.envLabel !== b.envLabel,
    summary,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. WIDGET 2 DOMAIN: NATURAL SELECTION & ANTIBIOTIC RESISTANCE (18.3.1, 18.3.4, 18.3.5)
// ─────────────────────────────────────────────────────────────────────────────

export const SELECTION_MODES = Object.freeze([
  Object.freeze({
    index: 0,
    id: 'culture_continuous_exposure',
    label: 'Drug selection',
    shortLabel: 'Drug selection',
    summary:
      'Illustrative laboratory culture under continuous exposure: differential survival can raise the resistant fraction. No patient or treatment duration is represented.',
  }),
  Object.freeze({
    index: 1,
    id: 'culture_drug_removed',
    label: 'Drug removed',
    shortLabel: 'Drug removed',
    summary:
      'The same illustrative culture with drug removed after step 3; without drug, reproductive costs and density affect the variants. This does not predict relapse.',
  }),
  Object.freeze({
    index: 2,
    id: 'peppered_moths',
    label: 'Peppered Moths',
    shortLabel: 'Peppered Moths',
    summary:
      'Bernard Kettlewell (1953–1955) proved directional natural selection in Biston betularia: bird predators selectively eat conspicuous moths, shifting allele frequency toward dark carbonaria (D_) on soot-blackened Birmingham bark and back toward pale typica (dd) on clean lichen bark.',
  }),
  Object.freeze({
    index: 3,
    id: 'malaria_hbs',
    label: 'Malaria & HbS',
    shortLabel: 'Malaria & HbS',
    summary:
      'J. B. S. Haldane (1949), Anthony Allison (1954), and L. D. Sanghvi (1956) explained why the sickle-cell allele (Hbˢ) stays common (10–16%) in malaria belts: HbᴬHbˢ heterozygotes resist lethal Plasmodium falciparum malaria while avoiding sickle-cell anaemia.',
  }),
]);

export const SELECTION_PRESSURE_STEPS = Object.freeze([
  Object.freeze({
    step: 1,
    id: 'none_clean',
    label: 'No drug / Clean lichen bark / Malaria-free (0%)',
    shortLabel: 'Clean / No-Malaria',
    intensityPct: 0,
  }),
  Object.freeze({
    step: 2,
    id: 'moderate_40',
    label: 'Moderate selection pressure (40%)',
    shortLabel: 'Moderate (40%)',
    intensityPct: 40,
  }),
  Object.freeze({
    step: 3,
    id: 'high_80',
    label: 'High selection / Sooty bark / Malaria belt (80%)',
    shortLabel: 'High / Sooty / Malaria',
    intensityPct: 80,
  }),
  Object.freeze({
    step: 4,
    id: 'intense_100',
    label: 'Intense selection pressure (100%)',
    shortLabel: 'Intense (100%)',
    intensityPct: 100,
  }),
]);

export const SIX_STEPS_NATURAL_SELECTION = Object.freeze([
  Object.freeze({
    step: 1,
    title: '1. Genetic variation within populations',
    igcseClause: 'Individuals within a population have different alleles (from random mutation, meiosis, and fertilisation) giving different phenotypes.',
  }),
  Object.freeze({
    step: 2,
    title: '2. Production of many offspring',
    igcseClause: 'Organisms produce many more offspring than the environment can support.',
  }),
  Object.freeze({
    step: 3,
    title: '3. Struggle for survival & competition',
    igcseClause: 'Offspring face a struggle for survival, competing for limited resources (food, water, space, mates) and facing predators or antibiotics.',
  }),
  Object.freeze({
    step: 4,
    title: '4. Greater chance of survival & reproduction',
    igcseClause: 'Inherited variants can increase reproductive contribution through survival, mating success or fertility; survival alone is not the endpoint.',
  }),
  Object.freeze({
    step: 5,
    title: '5. Passing on advantageous alleles',
    igcseClause: 'These better-adapted survivors pass on their advantageous alleles to their offspring in the next generation.',
  }),
  Object.freeze({
    step: 6,
    title: '6. Change in inherited variant frequencies',
    igcseClause: 'A variant causing greater reproductive contribution can increase in frequency. Drift and migration can also change populations; selection does not guarantee perfection.',
  }),
]);

export const KETTLEWELL_FIELD_DATA = Object.freeze({
  birminghamPolluted1953: Object.freeze({
    location: 'Rubery near Birmingham (soot-blackened bark, no lichens)',
    year: 1953,
    releasedDark: 447,
    recapturedDark: 123,
    recapturePctDark: 27.5,
    releasedPale: 137,
    recapturedPale: 18,
    recapturePctPale: 13.1,
    relativeAdvantage: 'Dark carbonaria survived at >2× the rate of pale typica (27.5% vs 13.1%)',
  }),
  dorsetUnpolluted1955: Object.freeze({
    location: 'Dean End Wood, Dorset (clean lichen-covered bark)',
    year: 1955,
    releasedDark: 406,
    recapturedDark: 30,
    recapturePctDark: 7.4,
    releasedPale: 393,
    recapturedPale: 62,
    recapturePctPale: 15.8,
    birdsObservedEatingDark: 164,
    birdsObservedEatingPale: 26,
    relativeAdvantage: 'Pale typica survived at >2× the rate of dark carbonaria (15.8% vs 7.4%)',
  }),
  grantsFinches1977: Object.freeze({
    location: 'Daphne Major, Galápagos Islands (1977 drought)',
    species: 'Geospiza fortis (medium ground finch)',
    preDroughtPopulation: 1200,
    postDroughtSurvivors: 180,
    mortalityPct: 85.0,
    preDroughtBeakDepthMm: 9.42,
    survivorBeakDepthMm: 9.96,
    beakShiftMm: 0.54,
  }),
});

export const ALLISON_MALARIA_DATA = Object.freeze({
  ugandaChildren1954: Object.freeze({
    totalChildren: 290,
    hbAA_total: 247,
    hbAA_infected: 113,
    hbAA_infectedPct: 45.7,
    hbAS_total: 43,
    hbAS_infected: 12,
    hbAS_infectedPct: 27.9,
  }),
  volunteerInoculation1954: Object.freeze({
    hbAA_infected: 14,
    hbAA_total: 15,
    hbAA_pct: 93.3,
    hbAS_infected: 2,
    hbAS_total: 15,
    hbAS_pct: 13.3,
  }),
});

// Illustrative culture model: counts are expected values, not patient measurements.
// Each step applies differential drug survival, then density-limited reproduction.
// Resistance has a modest reproductive cost without drug; no immune system is modelled.
export function cultureSelectionAccount({ steps = 0, pressure = 0.8, removeAfter = Infinity } = {}) {
  const n = clampInt(steps, 0, 1000, 0);
  const dose = Number.isFinite(Number(pressure)) ? Math.max(0, Math.min(1, Number(pressure))) : 0;
  let susceptible = 990, resistant = 10;
  for (let step = 1; step <= n; step += 1) {
    const exposure = step <= removeAfter ? dose : 0;
    susceptible *= 1 - 0.9 * exposure;
    resistant *= 1 - 0.1 * exposure;
    const total = susceptible + resistant;
    const space = Math.max(0, 1 - total / 1000);
    susceptible *= 1 + space;
    resistant *= 1 + 0.9 * space;
  }
  const total = susceptible + resistant;
  return Object.freeze({ susceptible, resistant, total, resistantPct: 100 * resistant / total, modelOnly: true });
}

// Random mating, large population, no migration/mutation; genotype fitness is
// relative reproductive contribution. Genotype fractions refer to offspring BEFORE selection.
export function sickleSelectionAccount(qInitial = 0.158, generations = 0, malariaDisadvantage = 0.15) {
  let q = Math.max(0, Math.min(1, Number(qInitial) || 0));
  const n = clampInt(generations, 0, 1000, 0);
  const s = Math.max(0, Math.min(1, Number(malariaDisadvantage) || 0));
  for (let g = 0; g < n; g += 1) {
    const p = 1 - q;
    const mean = p*p*(1-s) + 2*p*q + 0.2*q*q;
    if (mean > 0) q = (p*q + 0.2*q*q) / mean;
  }
  return Object.freeze({ q, p: 1-q, carrier: 2*q*(1-q), affected: q*q,
    equilibrium: s / (s + 0.8), modelOnly: true });
}

export function simulateNaturalSelection(params = {}) {
  const modeIndex = clampInt(params.modeIndex, 0, SELECTION_MODES.length - 1, 0);
  const pressureStep = clampInt(params.pressureStep, 1, SELECTION_PRESSURE_STEPS.length, 3);
  const generationStep = clampInt(params.generationStep, 0, 10, 7);

  const mode = SELECTION_MODES[modeIndex];
  const pressure = SELECTION_PRESSURE_STEPS[pressureStep - 1];

  if (modeIndex === 0 || modeIndex === 1) {
    const account = cultureSelectionAccount({ steps: generationStep,
      pressure: pressure.intensityPct / 100, removeAfter: modeIndex === 1 ? 3 : Infinity });
    const susceptibleCount = roundTo(account.susceptible, 1);
    const resistantCount = roundTo(account.resistant, 1);
    const totalCount = roundTo(susceptibleCount + resistantCount, 1);
    const resistantPct = roundTo(account.resistantPct, 1);
    const susceptiblePct = roundTo(100 - resistantPct, 1);
    return Object.freeze({ modeIndex, mode, pressureStep, pressure, generationStep,
      timeLabel: `Step ${generationStep}`, susceptibleCount, resistantCount, totalCount,
      susceptiblePct, resistantPct, modelOnly: true, infectionCleared: false, relapseOccurred: false,
      sixSteps: SIX_STEPS_NATURAL_SELECTION,
      readout: `Illustrative culture · ${mode.label} · Step ${generationStep}: ${susceptibleCount} susceptible and ${resistantCount} resistant expected cells (${resistantPct}% resistant). Each exposed step removes 0.9 × pressure of susceptible and 0.1 × pressure of resistant cells, then survivors reproduce toward capacity 1000. ${modeIndex === 1 ? 'Drug is removed after step 3; resistance has a small reproductive cost without exposure.' : 'Drug exposure continues at the chosen pressure.'} These steps are not clinical days or treatment advice.`,
    });
  }

  if (modeIndex === 2) {
    // Peppered moths (Biston betularia): generationStep 0..10 (representing 0..50 generations, 5 gens per step)
    const generations = generationStep * 5;
    let darkCarbonariaPct;
    if (pressureStep === 1) {
      // Clean lichen bark (post-Clean Air Act recovery from 92% dark back to 5% dark, or Dorset clean forest)
      darkCarbonariaPct = roundTo(Math.max(4.0, 92.0 * Math.exp(-0.28 * generationStep)), 1);
    } else if (pressureStep === 2) {
      // Moderate soot
      darkCarbonariaPct = roundTo(5.0 + 58.0 * (1 - Math.exp(-0.26 * generationStep)), 1);
    } else {
      // High/Intense industrial soot (Manchester / Birmingham 1848 -> 1898: 5% dark -> 95% dark)
      const cap = pressureStep === 4 ? 96.5 : 93.5;
      darkCarbonariaPct = roundTo(5.0 + (cap - 5.0) * (1 - Math.exp(-0.35 * generationStep)), 1);
    }
    const paleTypicaPct = roundTo(100.0 - darkCarbonariaPct, 1);

    return Object.freeze({
      modeIndex,
      mode,
      pressureStep,
      pressure,
      generationStep,
      timeLabel: `Gen ${generations}`,
      darkCarbonariaPct,
      paleTypicaPct,
      kettlewellData: KETTLEWELL_FIELD_DATA,
      sixSteps: SIX_STEPS_NATURAL_SELECTION,
      readout:
        pressureStep === 1
          ? `Peppered moths (*Biston betularia*) · Clean lichen bark · Gen ${generations}: Birds spot dark carbonaria moths easily (Kettlewell Dorset recapture 15.8% pale vs 7.4% dark); illustrative trajectory: pale typica (dd) rises to ${paleTypicaPct}% and dark carbonaria falls to ${darkCarbonariaPct}%.`
          : `Peppered moths (*Biston betularia*) · Soot-darkened bark (${pressure.shortLabel}) · Gen ${generations}: Birds eat conspicuous pale moths while camouflaged dark carbonaria (D_) survive at 2× the rate (Birmingham 27.5% vs 13.1%), in this illustrative curve, shifting dark frequency from 5.0% to ${darkCarbonariaPct}%.`,
    });
  }

  // modeIndex === 3: Malaria & Sickle-Cell Allele (HbA vs HbS)
  const generations = generationStep * 2;
  const malariaDisadvantage = [0, 0.08, 0.15, 0.20][pressureStep - 1];
  const account = sickleSelectionAccount(0.158, generations, malariaDisadvantage);
  const hbsAllelePct = roundTo(account.q * 100, 2);
  const carrierHbASPct = roundTo(account.carrier * 100, 2);
  const normalHbAAPct = roundTo(account.p * account.p * 100, 2);
  const affectedHbSSPct = roundTo(account.affected * 100, 2);

  return Object.freeze({
    modeIndex,
    mode,
    pressureStep,
    pressure,
    generationStep,
    timeLabel: `Gen ${generations}`,
    hbsAllelePct,
    hbaAllelePct: roundTo(100 - hbsAllelePct, 1),
    carrierHbASPct,
    normalHbAAPct,
    affectedHbSSPct,
    allisonData: ALLISON_MALARIA_DATA,
    modelOnly: true,
    equilibriumAllelePct: 100 * account.equilibrium,
    malariaDisadvantage,
    sixSteps: SIX_STEPS_NATURAL_SELECTION,
    readout: `Illustrative random-mating model · Gen ${generations}: wAA=${roundTo(1-malariaDisadvantage,2)}, wAS=1, wSS=0.20; HbS ${hbsAllelePct}%, newborn carriers ${carrierHbASPct}%. ${pressureStep === 1 ? 'Malaria advantage removed: recessive HbS declines slowly because heterozygotes retain copies.' : `Heterozygote advantage gives equilibrium q*=${roundTo(account.equilibrium*100,2)}%.`} Constant fitness, no migration or mutation; not a forecast for patients or a district.`,
  });
}

export function captureSelectionTrial(sim) {
  const s = sim?.mode ? sim : simulateNaturalSelection(sim);
  let metricTag;
  if (s.modeIndex === 0 || s.modeIndex === 1) {
    metricTag = `${s.timeLabel}: ${s.totalCount} bacteria (${s.resistantPct}% resistant)`;
  } else if (s.modeIndex === 2) {
    metricTag = `${s.timeLabel} (${s.pressure.shortLabel}): ${s.darkCarbonariaPct}% dark : ${s.paleTypicaPct}% pale`;
  } else {
    metricTag = `${s.timeLabel} (${s.pressure.shortLabel}): Hbˢ allele ${s.hbsAllelePct}% (${s.carrierHbASPct}% HbᴬHbˢ carriers)`;
  }
  return Object.freeze({
    modeId: s.mode.id,
    modeLabel: s.mode.shortLabel,
    pressureStep: s.pressureStep,
    pressureLabel: s.pressure.shortLabel,
    generationStep: s.generationStep,
    timeLabel: s.timeLabel,
    metricTag,
    summaryTag: `${s.mode.shortLabel} [${ metricTag }]`,
  });
}

export function compareSelectionTrials(a, b) {
  if (!a || !b) {
    return Object.freeze({
      contrasting: false,
      summary: 'Capture two selection trials to compare allele-frequency shifts.',
    });
  }
  const summary = `#1 ${a.summaryTag} | #2 ${b.summaryTag} — Natural selection acts on pre-existing heritable variation: changing the environmental selection pressure changes which alleles confer higher survival and reproduction.`;
  return Object.freeze({
    contrasting:
      a.modeId !== b.modeId ||
      a.pressureStep !== b.pressureStep ||
      a.generationStep !== b.generationStep,
    summary,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WIDGET 3 DOMAIN: ADAPTIVE FEATURES (18.2), SELECTIVE BREEDING (18.3.2–6) & DNA CLOCK (1.2)
// ─────────────────────────────────────────────────────────────────────────────

export const ADAPTATION_MODES = Object.freeze([
  Object.freeze({
    index: 0,
    id: 'xerophyte_arid',
    label: 'Xerophyte (Arid)',
    shortLabel: 'Xerophyte (Arid)',
    summary:
      'Xerophytes (marram grass Ammophila, prickly pear Opuntia) survive hot, dry environments via inherited adaptive features that reduce transpiration: thick waxy cuticle, sunken stomata in pits, interlocking hairs trapping humid air, rolled leaves, spines, and deep/wide roots.',
  }),
  Object.freeze({
    index: 1,
    id: 'hydrophyte_aquatic',
    label: 'Hydrophyte (Aquatic)',
    shortLabel: 'Hydrophyte (Aquatic)',
    summary:
      'Floating Nymphaea leaves have upper stomata, surface wax and internal gas spaces; submerged Hydrilla leaves have no stomata and thin barriers for dissolved-gas exchange. Numerical dimensions and performance are invented.',
  }),
  Object.freeze({
    index: 2,
    id: 'selective_breeding',
    label: 'Selective Breeding',
    shortLabel: 'Selective Breeding',
    summary:
      'Selective breeding (artificial selection, 0610 18.3.2–18.3.3): (1) humans select individuals with desirable features, (2) cross them to produce the next generation, and (3) select offspring showing the desirable features, repeating over many generations.',
  }),
  Object.freeze({
    index: 3,
    id: 'dna_clock',
    label: 'DNA Clock',
    shortLabel: 'DNA Clock',
    summary:
      'Evolutionary classification (0610 1.2.5–1.2.6): organisms that share a more recent common ancestor have DNA base sequences and protein amino-acid sequences that are more similar, complementing Birbal Sahni’s Gondwana fossils and Carl Woese’s 16S rRNA Three Domains.',
  }),
]);

export const PLANT_ADAPTATION_PROFILES = Object.freeze([
  Object.freeze({
    step: 1,
    id: 'marram_grass',
    name: 'Marram grass (Ammophila arenaria, xerophyte)',
    shortName: 'Marram grass (xerophyte)',
    category: 'xerophyte',
    cuticleThicknessUm: 12.5,
    stomataLocation: 'Sunken in pits on inner rolled surface only',
    leafHairs: 'Dense interlocking trichomes trapping humid air',
    aerenchymaPct: 4.0,
    xylemSupport: 'Well-developed lignified xylem & sclerenchyma',
    waterSavingEfficiency: 0.86,
    anoxicRootO2Pct: 22.0,
  }),
  Object.freeze({
    step: 2,
    id: 'opuntia_cactus',
    name: 'Prickly pear cactus (Opuntia, xerophyte)',
    shortName: 'Opuntia cactus (xerophyte)',
    category: 'xerophyte',
    cuticleThicknessUm: 18.0,
    stomataLocation: 'Few sunken stomata on green stem (open at night)',
    leafHairs: 'Leaves reduced to spines (low SA); succulent stem stores water',
    aerenchymaPct: 3.0,
    xylemSupport: 'Succulent water-storing parenchyma + wide/deep roots',
    waterSavingEfficiency: 0.92,
    anoxicRootO2Pct: 18.0,
  }),
  Object.freeze({
    step: 3,
    id: 'water_lily',
    name: 'Floating water lily (Nymphaea, hydrophyte)',
    shortName: 'Water lily (hydrophyte)',
    category: 'hydrophyte',
    cuticleThicknessUm: 3.0,
    stomataLocation: 'Upper epidermis faces air; stomata need not remain permanently open',
    leafHairs: 'None; wide flat floating pad captures sunlight',
    aerenchymaPct: 58.0,
    xylemSupport: 'Buoyancy supports the floating leaf; roots anchor it and obtain nutrients',
    waterSavingEfficiency: 0.08,
    anoxicRootO2Pct: 94.0,
  }),
  Object.freeze({
    step: 4,
    id: 'hydrilla_mesophyte_cmp',
    name: 'Submerged Hydrilla vs Mesophyte control',
    shortName: 'Hydrilla / Mesophyte',
    category: 'hydrophyte_submerged',
    cuticleThicknessUm: 0.0,
    stomataLocation: 'Zero stomata on submerged leaves (direct gas diffusion)',
    leafHairs: 'Thin simple submerged leaves exchange dissolved gases',
    aerenchymaPct: 64.0,
    xylemSupport: 'Almost no xylem; flexible stems bend with water currents',
    waterSavingEfficiency: 0.02,
    anoxicRootO2Pct: 96.0,
  }),
]);

export const SELECTIVE_BREEDING_LINEAGES = Object.freeze([
  Object.freeze({
    step: 1,
    id: 'gir_dairy_cattle',
    name: 'Indian Gir / Sahiwal dairy cattle (milk yield)',
    shortName: 'Gir cattle milk yield',
    ancestor: 'Unselected indigenous Bos indicus village cattle',
    selectedFeature: 'High lactation milk yield & heat tolerance',
    unit: 'L / lactation',
    genValues: Object.freeze([1350, 1950, 2650, 3450, 4200]),
    heterozygosityValues: Object.freeze([0.78, 0.66, 0.54, 0.43, 0.34]),
  }),
  Object.freeze({
    step: 2,
    id: 'brassica_oleracea',
    name: 'Wild mustard (Brassica oleracea) → 6 vegetables',
    shortName: 'Brassica oleracea crops',
    ancestor: 'Wild coastal sea cabbage (Brassica oleracea)',
    selectedFeature: 'Enlarged terminal bud (cabbage), flower curd (cauliflower), buds/stem (broccoli), swollen stem (kohlrabi), leaves (kale)',
    unit: 'g harvestable organ mass',
    genValues: Object.freeze([85, 210, 420, 710, 1050]),
    heterozygosityValues: Object.freeze([0.80, 0.68, 0.56, 0.45, 0.36]),
  }),
  Object.freeze({
    step: 3,
    id: 'coimbatore_sugarcane',
    name: 'Illustrative sugarcane breeding programme (sucrose %)',
    shortName: 'Coimbatore sugarcane',
    ancestor: 'Saccharum officinarum × wild Indian S. spontaneum hybrids',
    selectedFeature: 'High stem sucrose content & monsoon cold/drought hardiness',
    unit: '% stem sucrose',
    genValues: Object.freeze([8.5, 11.2, 13.8, 16.0, 17.8]),
    heterozygosityValues: Object.freeze([0.82, 0.72, 0.61, 0.52, 0.44]),
  }),
  Object.freeze({
    step: 4,
    id: 'dwarf_wheat',
    name: 'Disease-resistant semi-dwarf wheat (grain yield)',
    shortName: 'Rust-resistant wheat',
    ancestor: 'Tall lodging-prone landrace wheat (Triticum aestivum)',
    selectedFeature: 'Stem-rust resistance + short strong straw + high grain mass',
    unit: 'tonnes / hectare',
    genValues: Object.freeze([1.4, 2.3, 3.4, 4.5, 5.4]),
    heterozygosityValues: Object.freeze([0.76, 0.64, 0.51, 0.40, 0.31]),
  }),
]);

export const NATURAL_VS_ARTIFICIAL_TABLE = Object.freeze([
  Object.freeze({
    aspect: 'Selection agent',
    naturalSelection: 'The environment (predators, pathogens, competition for food/water, climate)',
    artificialSelection: 'Humans (farmers and breeders choosing which parents mate)',
  }),
  Object.freeze({
    aspect: 'Traits favoured',
    naturalSelection: 'Adaptive features that help the organism survive and reproduce in its habitat',
    artificialSelection: 'Features useful or desirable to humans (even if harmful in the wild)',
  }),
  Object.freeze({
    aspect: 'Speed of change',
    naturalSelection: 'Rate depends on selection strength, variation and generation time',
    artificialSelection: 'Rate depends on selection strength, variation and generation time',
  }),
  Object.freeze({
    aspect: 'Genetic diversity',
    naturalSelection: 'Maintains adaptation to wild conditions; can preserve balanced polymorphism',
    artificialSelection: 'Small breeding pools can reduce diversity; related mating can expose harmful recessives',
  }),
]);

// Synthetic aligned DNA/protein examples; never presented as measured taxa or dates.
export const MOLECULAR_CLOCK_TAXA = Object.freeze([7, 18, 36, 43, 60].map((diffs, i) => {
  const referenceSequence = 'ACGT'.repeat(50);
  const sequence = [...referenceSequence].map((base, pos) => pos < diffs ? ({A:'C', C:'G', G:'T', T:'A'})[base] : base).join('');
  const aaDiffs = [0, 1, 3, 5, 8][i];
  return Object.freeze({ step: i+1, id: `example_${i+1}`, species: `Illustrative species ${['P','R','Q','S','T'][i]}`,
    shortName: `Species ${['P','R','Q','S','T'][i]}`, referenceSequence, sequence, alignedBaseCount: 200,
    alignedDnaSimilarityPct: 100*(200-diffs)/200, betaGlobinDiffsOutOf146: aaDiffs,
    betaGlobinIdentityPct: roundTo(100*(146-aaDiffs)/146,1), cytochromeCDiffsOutOf104: aaDiffs,
    cytochromeCIdentityPct: roundTo(100*(104-aaDiffs)/104,1), modelOnly: true,
    ancestorNote: 'Invented homologous alignments illustrate counting differences. No dates or tree root can be inferred from these percentages alone.' });
}));

export function simulateAdaptiveSelective(params = {}) {
  const modeIndex = clampInt(params.modeIndex, 0, ADAPTATION_MODES.length - 1, 0);
  const stressOrGenStep = clampInt(params.stressOrGenStep, 1, 5, 3);
  const profileStep = clampInt(params.profileStep, 1, 4, 1);

  const mode = ADAPTATION_MODES[modeIndex];

  if (modeIndex === 0 || modeIndex === 1) {
    // Plant adaptation physics: Xerophyte (mode 0) vs Hydrophyte (mode 1)
    const defaultProfileIdx = modeIndex === 0 ? (profileStep <= 2 ? profileStep - 1 : 0) : (profileStep >= 3 ? profileStep - 1 : 2);
    const chosenProfile = PLANT_ADAPTATION_PROFILES[modeIndex === 0 && profileStep <= 4 ? profileStep - 1 : defaultProfileIdx];
    const profile = PLANT_ADAPTATION_PROFILES[profileStep - 1];

    // Unadapted mesophyte baseline transpiration rate in mg H2O / dm2 / h under aridity steps 1..5
    const mesophyteTranspirationRate = roundTo(40 + stressOrGenStep * 55, 1);
    const plantTranspirationRate = roundTo(
      mesophyteTranspirationRate * (1 - profile.waterSavingEfficiency),
      1
    );
    const waterSavedPct = roundTo(profile.waterSavingEfficiency * 100, 1);
    const leafTurgorPct =
      profile.category === 'xerophyte'
        ? roundTo(96 - stressOrGenStep * 1.8, 1)
        : roundTo(Math.max(15, 95 - stressOrGenStep * 16), 1);

    const rootO2InMudPct = profile.anoxicRootO2Pct;
    const mesophyteRootO2Pct = 12.0;

    return Object.freeze({
      modeIndex,
      mode,
      stressOrGenStep,
      profileStep,
      profile,
      chosenProfile,
      mesophyteTranspirationRate,
      plantTranspirationRate,
      waterSavedPct,
      leafTurgorPct,
      rootO2InMudPct,
      mesophyteRootO2Pct,
      readout:
        modeIndex === 0
          ? `Illustrative plant model (invented dimensions and performance) · Xerophyte analysis · ${profile.name} at Aridity Step ${stressOrGenStep}/5: Cuticle (${profile.cuticleThicknessUm} µm) + ${profile.stomataLocation.toLowerCase()} cut transpiration to ${plantTranspirationRate} mg/(dm²·h) vs ${mesophyteTranspirationRate} in a mesophyte (${waterSavedPct}% water saved; turgor ${leafTurgorPct}%).`
          : `Illustrative plant model (invented dimensions and performance) · Hydrophyte analysis · ${profile.name} at Submergence Step ${stressOrGenStep}/5: Aerenchyma air spaces (${profile.aerenchymaPct}% volume) provide buoyancy and deliver ${rootO2InMudPct}% O₂ saturation to roots in anoxic mud (vs ${mesophyteRootO2Pct}% in a waterlogged mesophyte); stomata: ${profile.stomataLocation}.`,
    });
  }

  if (modeIndex === 2) {
    // Selective breeding over generations
    const lineage = SELECTIVE_BREEDING_LINEAGES[profileStep - 1];
    const genLabels = ['Gen 1 (Parental)', 'Gen 5', 'Gen 10', 'Gen 20', 'Gen 40'];
    const currentGenLabel = genLabels[stressOrGenStep - 1];
    const baselineValue = lineage.genValues[0];
    const currentValue = lineage.genValues[stressOrGenStep - 1];
    const pctGain = roundTo(((currentValue - baselineValue) / baselineValue) * 100, 1);
    const heterozygosity = lineage.heterozygosityValues[stressOrGenStep - 1];

    return Object.freeze({
      modeIndex,
      mode,
      stressOrGenStep,
      profileStep,
      lineage,
      currentGenLabel,
      baselineValue,
      currentValue,
      pctGain,
      heterozygosity,
      comparisonTable: NATURAL_VS_ARTIFICIAL_TABLE,
      readout: `Illustrative breeding trajectory, not historical measurements (0610 18.3.2–18.3.3) · ${lineage.name} at ${currentGenLabel}: Selecting parents with desirable features, crossing them, and selecting the best offspring raises the trait from ${baselineValue} to ${currentValue} ${lineage.unit} (+${pctGain}%), while heterozygosity drops from ${lineage.heterozygosityValues[0]} to ${heterozygosity}.`,
    });
  }

  // modeIndex === 3: DNA & Amino-Acid Sequence Clock + Gondwana Fossils (0610 1.2.5–1.2.6)
  const taxon = MOLECULAR_CLOCK_TAXA[stressOrGenStep - 1];
  return Object.freeze({
    modeIndex,
    mode,
    stressOrGenStep,
    profileStep,
    taxon,
    allTaxa: MOLECULAR_CLOCK_TAXA,
    readout: `Molecular classification · X vs ${taxon.species}: ${taxon.alignedDnaSimilarityPct}% identity across ${taxon.alignedBaseCount} invented aligned DNA bases. Protein difference counts are also synthetic. Similarity supports relationship under suitable assumptions; dates require calibration and models of variable rates.`,
  });
}

export function captureAdaptationTrial(sim) {
  const s = sim?.mode ? sim : simulateAdaptiveSelective(sim);
  let detail;
  if (s.modeIndex === 0) {
    detail = `${s.profile.shortName} @ Aridity ${s.stressOrGenStep}: ${s.plantTranspirationRate} mg/(dm²·h) (${s.waterSavedPct}% saved)`;
  } else if (s.modeIndex === 1) {
    detail = `${s.profile.shortName} @ Submergence ${s.stressOrGenStep}: ${s.profile.aerenchymaPct}% aerenchyma, ${s.rootO2InMudPct}% root O₂`;
  } else if (s.modeIndex === 2) {
    detail = `${s.lineage.shortName} @ ${s.currentGenLabel}: ${s.currentValue} ${s.lineage.unit} (+${s.pctGain}%, H=${s.heterozygosity})`;
  } else {
    detail = `X vs ${s.taxon.shortName}: ${s.taxon.alignedDnaSimilarityPct}% DNA, ${s.taxon.cytochromeCDiffsOutOf104} Cyt-c diffs`;
  }
  return Object.freeze({
    modeId: s.mode.id,
    modeLabel: s.mode.shortLabel,
    stressOrGenStep: s.stressOrGenStep,
    profileStep: s.profileStep,
    detail,
    summaryTag: `${s.mode.shortLabel} [${detail}]`,
  });
}

export function compareAdaptationTrials(a, b) {
  if (!a || !b) {
    return Object.freeze({
      contrasting: false,
      summary: 'Capture two trials to compare xerophyte vs hydrophyte features, selective breeding generations, or DNA sequence clocks.',
    });
  }
  const summary = `#1 ${a.summaryTag} | #2 ${b.summaryTag} — Adaptive features (sunken stomata vs aerenchyma) evolve by natural selection to match habitat physics, selective breeding amplifies human-chosen traits over generations, and DNA base similarity tracks recency of common ancestry.`;
  return Object.freeze({
    contrasting:
      a.modeId !== b.modeId ||
      a.stressOrGenStep !== b.stressOrGenStep ||
      a.profileStep !== b.profileStep,
    summary,
  });
}
