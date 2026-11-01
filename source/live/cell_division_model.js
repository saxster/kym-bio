/**
 * Chapter 12 pure domain model:
 * - Semi-conservative DNA replication, Meselson-Stahl (1958) 15N/14N CsCl density-gradient
 *   ultracentrifugation (1.724, 1.717, 1.710 g/cm³), and DNA polymerase proofreading
 * - Mitosis vs Meiosis division stepper, chromosome vs sister chromatid accounting,
 *   diploid (2n = 46) to haploid (n = 23) reduction division, Cavendish banana (3n = 33),
 *   and E. K. Janaki Ammal polyploid sugarcane hybrids
 * - Stem cell self-renewal, differentiation, selective gene expression (0610 17.1.6 & 17.2.5),
 *   John Gurdon (1962) nuclear transfer, and Shinya Yamanaka (2006) iPSC reprogramming
 */

export const COMPLEMENT_MAP = Object.freeze({
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
});

export const H_BOND_MAP = Object.freeze({
  A: 2,
  T: 2,
  C: 3,
  G: 3,
});

export function complementBase(base) {
  const b = String(base || '').toUpperCase().trim();
  return COMPLEMENT_MAP[b] || 'N';
}

export function complementStrand(seq) {
  const clean = String(seq || '').toUpperCase().replace(/[^ATCG]/g, '');
  let out = '';
  for (let i = 0; i < clean.length; i += 1) {
    out += COMPLEMENT_MAP[clean[i]] || 'N';
  }
  return out;
}

export function countHydrogenBonds(seq) {
  const clean = String(seq || '').toUpperCase().replace(/[^ATCG]/g, '');
  let total = 0;
  let atPairs = 0;
  let gcPairs = 0;
  for (let i = 0; i < clean.length; i += 1) {
    const b = clean[i];
    if (b === 'A' || b === 'T') {
      total += 2;
      atPairs += 1;
    } else if (b === 'C' || b === 'G') {
      total += 3;
      gcPairs += 1;
    }
  }
  return Object.freeze({
    lengthBp: clean.length,
    atPairs,
    gcPairs,
    totalHydrogenBonds: total,
  });
}

// ---------------------------------------------------------------------------
// 1. MESELSON & STAHL (1958) + DNA REPLICATION FORK MODEL
// ---------------------------------------------------------------------------

export const CSCL_DENSITIES = Object.freeze({
  heavy15N15N: 1.724,
  hybrid15N14N: 1.717,
  light14N14N: 1.710,
});

export const MESELSON_HYPOTHESIS_PRESETS = Object.freeze([
  Object.freeze({
    id: 'semi_conservative',
    modeIndex: 0,
    label: 'Semi-conservative (Meselson-Stahl actual)',
    shortLabel: 'Semi-conservative',
    proposers: 'Watson & Crick (1953); proved by Meselson & Stahl (1958)',
    mechanismSummary: 'Parental double helix unzips; each original strand templates one new complementary strand (1 old + 1 new strand per daughter duplex).',
    verdict: 'CONFIRMED by Meselson & Stahl (1958): single hybrid band at Gen 1 (1.717 g/cm³) and equal hybrid + light bands at Gen 2.',
    matchesExperiment: true,
  }),
  Object.freeze({
    id: 'conservative',
    modeIndex: 1,
    label: 'Conservative hypothesis (falsified at Gen 1)',
    shortLabel: 'Conservative (falsified)',
    proposers: 'Theoretical whole-duplex template hypothesis (falsified 1958)',
    mechanismSummary: 'Original ¹⁵N/¹⁵N double helix remains completely intact while an entirely new ¹⁴N/¹⁴N double helix is synthesised alongside it.',
    verdict: 'FALSIFIED at Generation 1: predicted 50% heavy (1.724 g/cm³) + 50% light (1.710 g/cm³), but E. coli produced 100% hybrid (1.717 g/cm³).',
    matchesExperiment: false,
  }),
  Object.freeze({
    id: 'dispersive',
    modeIndex: 2,
    label: 'Dispersive hypothesis (falsified at Gen 2)',
    shortLabel: 'Dispersive (falsified)',
    proposers: 'Max Delbrück (1954 theoretical model; falsified 1958)',
    mechanismSummary: 'Parental chains are cut into pieces during replication so every daughter strand is a patchwork blend of old ¹⁵N and new ¹⁴N segments.',
    verdict: 'FALSIFIED at Generation 2: predicted one single band at 1.7135 g/cm³ (1/4 ¹⁵N), whereas E. coli split cleanly into 50% hybrid (1.717) and 50% light (1.710).',
    matchesExperiment: false,
  }),
  Object.freeze({
    id: 'fork_proofreading',
    modeIndex: 3,
    label: 'Replication fork & polymerase proofreading',
    shortLabel: 'Fork & Proofreading',
    proposers: 'Arthur Kornberg (1956 DNA polymerase) & eukaryotic origin mapping',
    mechanismSummary: 'DNA helicase unzips H-bonds at ~40,000 origins; DNA polymerase pairs A=T and C≡G and proofreads via 3\'→5\' exonuclease + mismatch repair.',
    verdict: 'CONFIRMED: semi-conservative copying with proofreading achieves ~10⁻⁹ errors per base across 6.4 × 10⁹ human base pairs.',
    matchesExperiment: true,
  }),
]);

export const MESELSON_FIDELITY_PRESETS = Object.freeze([
  Object.freeze({
    step: 1,
    label: 'Step 1: Helicase Unzips H-Bonds (Raw Base Pairing)',
    forkBasesUnzipped: 4,
    errorRatePerBase: 1e-4,
    errorExponent: -4,
    errorsPerHumanDivision: 640000,
    originsActive: 10000,
    stageNote: 'DNA helicase breaks A=T (2 H-bonds) and C≡G (3 H-bonds); raw Watson-Crick H-bond geometry alone makes ~1 error per 10,000 bases (10⁻⁴).',
  }),
  Object.freeze({
    step: 2,
    label: 'Step 2: Polymerase Active-Site Geometry Check',
    forkBasesUnzipped: 8,
    errorRatePerBase: 1e-5,
    errorExponent: -5,
    errorsPerHumanDivision: 64000,
    originsActive: 25000,
    stageNote: 'DNA polymerase active-site pocket rejects mismatched base pair geometry before covalent phosphodiester bond formation (~10⁻⁵ error rate).',
  }),
  Object.freeze({
    step: 3,
    label: 'Step 3: Polymerase 3\'→5\' Exonuclease Proofreading',
    forkBasesUnzipped: 10,
    errorRatePerBase: 1e-7,
    errorExponent: -7,
    errorsPerHumanDivision: 640,
    originsActive: 40000,
    stageNote: 'If a wrong nucleotide slips in, DNA polymerase reverses with its 3\'→5\' exonuclease backspace key, improving accuracy 100-fold to ~10⁻⁷.',
  }),
  Object.freeze({
    step: 4,
    label: 'Step 4: Full Proofreading + Post-Replication Mismatch Repair',
    forkBasesUnzipped: 12,
    errorRatePerBase: 1e-9,
    errorExponent: -9,
    errorsPerHumanDivision: 6,
    originsActive: 40000,
    stageNote: 'Post-replication mismatch repair enzymes scan the new strand and fix residual errors, reaching ~10⁻⁹ errors/base (~6 bases in 6.4 × 10⁹ bp).',
  }),
]);

export function computeSemiConservativeFractions(generation) {
  const g = Math.max(0, Math.min(4, Math.round(Number(generation) || 0)));
  const totalDuplexes = Math.pow(2, g);
  const totalSingleStrands = totalDuplexes * 2;
  const heavySingleStrands = 2;
  const lightSingleStrands = totalSingleStrands - 2;
  if (g === 0) {
    return Object.freeze({
      generation: 0,
      totalDuplexes: 1,
      totalSingleStrands: 2,
      heavySingleStrands: 2,
      lightSingleStrands: 0,
      heavyDuplexCount: 1,
      hybridDuplexCount: 0,
      lightDuplexCount: 0,
      heavyPct: 100,
      hybridPct: 0,
      lightPct: 0,
    });
  }
  const hybridDuplexCount = 2;
  const lightDuplexCount = totalDuplexes - 2;
  const hybridPct = (hybridDuplexCount / totalDuplexes) * 100;
  const lightPct = (lightDuplexCount / totalDuplexes) * 100;
  return Object.freeze({
    generation: g,
    totalDuplexes,
    totalSingleStrands,
    heavySingleStrands,
    lightSingleStrands,
    heavyDuplexCount: 0,
    hybridDuplexCount,
    lightDuplexCount,
    heavyPct: 0,
    hybridPct,
    lightPct,
  });
}

export function simulateDnaReplicationMeselson(params = {}) {
  let modeIdx = 0;
  if (typeof params.mode === 'number') {
    modeIdx = Math.max(0, Math.min(3, Math.round(params.mode)));
  } else if (typeof params.mode === 'string') {
    const found = MESELSON_HYPOTHESIS_PRESETS.find(
      (p) => p.id === params.mode || p.label === params.mode || p.shortLabel === params.mode
    );
    if (found) modeIdx = found.modeIndex;
  }
  const preset = MESELSON_HYPOTHESIS_PRESETS[modeIdx];
  const generation = Math.max(0, Math.min(4, Math.round(Number(params.generation ?? 1))));
  const fidelityStep = Math.max(1, Math.min(4, Math.round(Number(params.fidelityStep ?? 4))));
  const fidelity = MESELSON_FIDELITY_PRESETS[fidelityStep - 1];

  const actual = computeSemiConservativeFractions(generation);
  const templateSeq = 'ATGCCGTAATCG';
  const compSeq = complementStrand(templateSeq);
  const hBondStats = countHydrogenBonds(templateSeq);

  let heavyPct = actual.heavyPct;
  let hybridPct = actual.hybridPct;
  let lightPct = actual.lightPct;
  let dispersivePct = 0;
  let dispersiveDensity = CSCL_DENSITIES.heavy15N15N;
  let bands = [];

  if (preset.id === 'conservative') {
    if (generation === 0) {
      heavyPct = 100;
      hybridPct = 0;
      lightPct = 0;
      bands = [
        Object.freeze({
          kind: 'heavy',
          label: 'Heavy ¹⁵N/¹⁵N',
          densityGPerCm3: CSCL_DENSITIES.heavy15N15N,
          fractionPct: 100,
          duplexCount: 1,
        }),
      ];
    } else {
      heavyPct = (1 / actual.totalDuplexes) * 100;
      hybridPct = 0;
      lightPct = ((actual.totalDuplexes - 1) / actual.totalDuplexes) * 100;
      bands = [
        Object.freeze({
          kind: 'light',
          label: 'Light ¹⁴N/¹⁴N',
          densityGPerCm3: CSCL_DENSITIES.light14N14N,
          fractionPct: lightPct,
          duplexCount: actual.totalDuplexes - 1,
        }),
        Object.freeze({
          kind: 'heavy',
          label: 'Heavy ¹⁵N/¹⁵N',
          densityGPerCm3: CSCL_DENSITIES.heavy15N15N,
          fractionPct: heavyPct,
          duplexCount: 1,
        }),
      ];
    }
  } else if (preset.id === 'dispersive') {
    heavyPct = generation === 0 ? 100 : 0;
    hybridPct = generation === 1 ? 100 : 0;
    lightPct = 0;
    dispersivePct = 100;
    const heavyShare = 1 / Math.pow(2, generation);
    dispersiveDensity = Number(
      (CSCL_DENSITIES.light14N14N + heavyShare * (CSCL_DENSITIES.heavy15N15N - CSCL_DENSITIES.light14N14N)).toFixed(5)
    );
    bands = [
      Object.freeze({
        kind: generation === 0 ? 'heavy' : generation === 1 ? 'hybrid' : 'dispersive',
        label:
          generation === 0
            ? 'Heavy ¹⁵N/¹⁵N'
            : generation === 1
            ? 'Patchwork 1/2 ¹⁵N'
            : `Patchwork 1/${Math.pow(2, generation)} ¹⁵N`,
        densityGPerCm3: dispersiveDensity,
        fractionPct: 100,
        duplexCount: actual.totalDuplexes,
      }),
    ];
  } else {
    // Semi-conservative or Fork & Proofreading mode
    if (generation === 0) {
      bands = [
        Object.freeze({
          kind: 'heavy',
          label: 'Heavy ¹⁵N/¹⁵N',
          densityGPerCm3: CSCL_DENSITIES.heavy15N15N,
          fractionPct: 100,
          duplexCount: 1,
        }),
      ];
    } else if (generation === 1) {
      bands = [
        Object.freeze({
          kind: 'hybrid',
          label: 'Hybrid ¹⁵N/¹⁴N',
          densityGPerCm3: CSCL_DENSITIES.hybrid15N14N,
          fractionPct: 100,
          duplexCount: 2,
        }),
      ];
    } else {
      bands = [
        Object.freeze({
          kind: 'light',
          label: 'Light ¹⁴N/¹⁴N',
          densityGPerCm3: CSCL_DENSITIES.light14N14N,
          fractionPct: actual.lightPct,
          duplexCount: actual.lightDuplexCount,
        }),
        Object.freeze({
          kind: 'hybrid',
          label: 'Hybrid ¹⁵N/¹⁴N',
          densityGPerCm3: CSCL_DENSITIES.hybrid15N14N,
          fractionPct: actual.hybridPct,
          duplexCount: actual.hybridDuplexCount,
        }),
      ];
    }
  }

  const timeMinutesEColi = generation * 20;
  let falsificationStatus = 'Baseline Generation 0: all models start at 100% heavy ¹⁵N/¹⁵N (1.724 g/cm³).';
  if (generation === 1) {
    if (preset.id === 'conservative') {
      falsificationStatus = 'CONTRADICTS E. COLI DATA: Conservative predicts 2 bands (1.724 & 1.710), but Meselson & Stahl observed 1 hybrid band (1.717 g/cm³).';
    } else {
      falsificationStatus = 'Generation 1 (20 min): 100% hybrid ¹⁵N/¹⁴N band at 1.717 g/cm³ eliminates the conservative hypothesis.';
    }
  } else if (generation >= 2) {
    if (preset.id === 'conservative') {
      falsificationStatus = 'CONTRADICTS E. COLI DATA: Conservative never forms the observed 1.717 g/cm³ hybrid band.';
    } else if (preset.id === 'dispersive') {
      falsificationStatus = `CONTRADICTS E. COLI DATA: Dispersive predicts 1 blended band at ${dispersiveDensity.toFixed(4)} g/cm³, but E. coli shows 2 distinct bands (1.717 & 1.710 g/cm³).`;
    } else {
      falsificationStatus = `Generation ${generation} (${timeMinutesEColi} min): ${actual.hybridPct.toFixed(1)}% hybrid (1.717) + ${actual.lightPct.toFixed(1)}% light (1.710) confirms semi-conservative copying.`;
    }
  }

  return Object.freeze({
    modeIndex: modeIdx,
    modeId: preset.id,
    modeLabel: preset.label,
    shortModeLabel: preset.shortLabel,
    matchesExperiment: preset.matchesExperiment,
    generation,
    timeMinutesEColi,
    totalDuplexes: actual.totalDuplexes,
    totalSingleStrands: actual.totalSingleStrands,
    heavySingleStrands: actual.heavySingleStrands,
    lightSingleStrands: actual.lightSingleStrands,
    heavyPct,
    hybridPct,
    lightPct,
    dispersivePct,
    dispersiveDensity,
    actualSemiConservative: actual,
    bands: Object.freeze(bands),
    centrifugationG: 140000,
    densities: CSCL_DENSITIES,
    templateStrand: templateSeq,
    complementaryStrand: compSeq,
    forkBasesUnzipped: fidelity.forkBasesUnzipped,
    hydrogenBondsUnzipped: countHydrogenBonds(templateSeq.slice(0, fidelity.forkBasesUnzipped)).totalHydrogenBonds,
    totalTemplateHydrogenBonds: hBondStats.totalHydrogenBonds,
    fidelityStep: fidelity.step,
    fidelityLabel: fidelity.label,
    errorRatePerBase: fidelity.errorRatePerBase,
    errorExponent: fidelity.errorExponent,
    errorsPerHumanDivision: fidelity.errorsPerHumanDivision,
    originsActive: fidelity.originsActive,
    fidelityNote: fidelity.stageNote,
    falsificationStatus,
    verdict: preset.verdict,
  });
}

export function captureMeselsonTrial(params = {}, prevTrials = []) {
  const sim = simulateDnaReplicationMeselson(params);
  const trialNumber = (Array.isArray(prevTrials) ? prevTrials.length : 0) + 1;
  const record = Object.freeze({
    trialNumber,
    modeId: sim.modeId,
    shortModeLabel: sim.shortModeLabel,
    generation: sim.generation,
    totalDuplexes: sim.totalDuplexes,
    heavyPct: sim.heavyPct,
    hybridPct: sim.hybridPct,
    lightPct: sim.lightPct,
    bandCount: sim.bands.length,
    errorRatePerBase: sim.errorRatePerBase,
    matchesExperiment: sim.matchesExperiment,
  });
  return Object.freeze([...(Array.isArray(prevTrials) ? prevTrials : []), record]);
}

export function compareMeselsonTrials(trialA, trialB) {
  const a = trialA.modeId ? trialA : simulateDnaReplicationMeselson(trialA);
  const b = trialB.modeId ? trialB : simulateDnaReplicationMeselson(trialB);
  return Object.freeze({
    generationDelta: b.generation - a.generation,
    duplexRatio: b.totalDuplexes / Math.max(1, a.totalDuplexes),
    hybridPctDelta: b.hybridPct - a.hybridPct,
    lightPctDelta: b.lightPct - a.lightPct,
    heavyPctDelta: b.heavyPct - a.heavyPct,
    errorRateRatio: b.errorRatePerBase / a.errorRatePerBase,
    summary: `Gen ${a.generation} (${a.shortModeLabel}: ${a.hybridPct.toFixed(1)}% hyb / ${a.lightPct.toFixed(1)}% light) → Gen ${b.generation} (${b.shortModeLabel}: ${b.hybridPct.toFixed(1)}% hyb / ${b.lightPct.toFixed(1)}% light)`,
  });
}

// ---------------------------------------------------------------------------
// 2. MITOSIS VS MEIOSIS CHROMOSOME STEPPER & PLOIDY MODEL
// ---------------------------------------------------------------------------

export const ORGANISM_PLOIDY_PRESETS = Object.freeze([
  Object.freeze({
    presetIndex: 1,
    id: 'human_2n46',
    species: 'Homo sapiens (Human)',
    commonName: 'Human somatic / germ line',
    basicSetX: 23,
    ploidyMultiple: 2,
    ploidySymbol: '2n',
    somaticChromosomes: 46,
    homologousPairs: 23,
    gameteChromosomes: 23,
    meioticViable: true,
    note: '23 homologous pairs (46 chromosomes); meiosis produces haploid gametes (n = 23) with 2²³ = 8,388,608 combinations.',
  }),
  Object.freeze({
    presetIndex: 2,
    id: 'wild_banana_2n22',
    species: 'Musa acuminata (Wild diploid banana)',
    commonName: 'Wild seeded banana',
    basicSetX: 11,
    ploidyMultiple: 2,
    ploidySymbol: '2n',
    somaticChromosomes: 22,
    homologousPairs: 11,
    gameteChromosomes: 11,
    meioticViable: true,
    note: '11 homologous pairs (2n = 22); balanced Meiosis I (11 + 11) forms viable n = 11 gametes and hard black fertile seeds.',
  }),
  Object.freeze({
    presetIndex: 3,
    id: 'cavendish_3n33',
    species: 'Musa acuminata cv. Cavendish (Triploid)',
    commonName: 'Seedless Cavendish banana',
    basicSetX: 11,
    ploidyMultiple: 3,
    ploidySymbol: '3n',
    somaticChromosomes: 33,
    homologousPairs: 11, // 11 homologous triplets
    gameteChromosomes: 0, // unbalanced aneuploid (11..22), sterile
    meioticViable: false,
    note: '11 homologous triplets (3n = 33); odd triplets cannot pair evenly in Meiosis I → sterile seedless fruit cloned by mitosis.',
  }),
  Object.freeze({
    presetIndex: 4,
    id: 'sugarcane_2n80',
    species: 'Saccharum officinarum (Noble sugarcane)',
    commonName: 'Janaki Ammal Coimbatore cane',
    basicSetX: 10,
    ploidyMultiple: 8,
    ploidySymbol: '2n = 8x',
    somaticChromosomes: 80,
    homologousPairs: 40,
    gameteChromosomes: 40,
    meioticViable: true,
    note: 'Even-numbered octoploid (2n = 80, 40 pairs) studied by E. K. Janaki Ammal in Coimbatore; pairs in meiosis to breed hardy hybrid canes.',
  }),
]);

export const DIVISION_MODE_PRESETS = Object.freeze([
  Object.freeze({
    modeIndex: 0,
    id: 'human_mitosis',
    label: 'Human Mitosis (2n = 46 → 2n = 46)',
    shortLabel: 'Mitosis (2n → 2n)',
    divisionType: 'mitosis',
    defaultOrganismPreset: 1,
    nuclearDivisions: 1,
    daughterCellCount: 2,
    geneticIdentity: 'Same inherited chromosome copies in this model; new mutations are not represented',
    biologicalRoles: 'Growth, repair of damaged tissues, replacement of worn-out cells, and asexual reproduction',
  }),
  Object.freeze({
    modeIndex: 1,
    id: 'human_meiosis',
    label: 'Human Meiosis & Fertilisation (2n = 46 → n = 23)',
    shortLabel: 'Meiosis (2n → n)',
    divisionType: 'meiosis',
    defaultOrganismPreset: 1,
    nuclearDivisions: 2,
    daughterCellCount: 4,
    geneticIdentity: 'Genetically different haploid gametes (crossing over + independent assortment)',
    biologicalRoles: 'Production of haploid gametes (sperm and egg) so fertilisation restores diploid 2n = 46',
  }),
  Object.freeze({
    modeIndex: 2,
    id: 'cavendish_triploid',
    label: 'Triploid Cavendish Banana (3n = 33 Case 12)',
    shortLabel: 'Cavendish (3n = 33)',
    divisionType: 'triploid_case',
    defaultOrganismPreset: 3,
    nuclearDivisions: 2,
    daughterCellCount: 4,
    geneticIdentity: 'Mitosis produces low-diversity 3n = 33 clonal lineages; odd triplets often yield unbalanced meiotic products',
    biologicalRoles: 'Explains why commercial bananas are seedless and why cloned plantations face Panama TR4 risk',
  }),
  Object.freeze({
    modeIndex: 3,
    id: 'ammal_sugarcane',
    label: 'Janaki Ammal Sugarcane Cross (Coimbatore)',
    shortLabel: 'Janaki Ammal Cane',
    divisionType: 'polyploid_cross',
    defaultOrganismPreset: 4,
    nuclearDivisions: 2,
    daughterCellCount: 4,
    geneticIdentity: 'Meiosis + sexual hybridisation creates hardy polyploid canes; stem-cutting mitosis clones them',
    biologicalRoles: 'Combines sexual variation (meiosis + cross) with asexual crop uniformity (mitotic stem cuttings)',
  }),
]);

export function computeIndependentAssortment(nPairs) {
  const n = Math.max(0, Math.min(40, Math.round(Number(nPairs) || 0)));
  return Math.pow(2, n);
}

export function computeZygoteCombinations(nPairs) {
  const gameteCombos = computeIndependentAssortment(nPairs);
  return gameteCombos * gameteCombos;
}

export function simulateMitosisMeiosisStepper(params = {}) {
  let modeIdx = 0;
  if (typeof params.mode === 'number') {
    modeIdx = Math.max(0, Math.min(3, Math.round(params.mode)));
  } else if (typeof params.mode === 'string') {
    const found = DIVISION_MODE_PRESETS.find(
      (p) => p.id === params.mode || p.label === params.mode || p.shortLabel === params.mode
    );
    if (found) modeIdx = found.modeIndex;
  }
  const modePreset = DIVISION_MODE_PRESETS[modeIdx];
  const stage = Math.max(1, Math.min(5, Math.round(Number(params.stage ?? 1))));

  // Organism preset (1..4); if mode is Cavendish or Sugarcane and organismPreset not explicitly overridden, use mode default or user selection
  const rawOrg = params.organismPreset !== undefined ? Number(params.organismPreset) : modePreset.defaultOrganismPreset;
  const orgIdx = Math.max(1, Math.min(4, Math.round(rawOrg || 1)));
  // In Cavendish mode, if orgIdx is 1 (default slider initial), use Cavendish 3n=33 unless user slid organismPreset > 1
  const effectiveOrgIdx =
    modePreset.id === 'cavendish_triploid' && params.organismPreset === undefined
      ? 3
      : modePreset.id === 'ammal_sugarcane' && params.organismPreset === undefined
      ? 4
      : orgIdx;
  const org = ORGANISM_PLOIDY_PRESETS[effectiveOrgIdx - 1];

  const baseChromosomes = org.somaticChromosomes;
  const isTriploid = org.ploidyMultiple === 3;
  const isMitosis = modePreset.divisionType === 'mitosis';

  let stageTitle = '';
  let chromosomesPerCell = baseChromosomes;
  let chromatidsPerCell = baseChromosomes;
  let dnaMassC = org.ploidyMultiple;
  let ploidyLabel = `${org.ploidySymbol} = ${baseChromosomes}`;
  let cellCount = 1;
  let homologousPairing = false;
  let crossingOverActive = false;
  let stageMechanism = '';

  if (isMitosis) {
    if (stage === 1) {
      stageTitle = 'Stage 1: Interphase (G₁ Unreplicated Parent Cell)';
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes;
      dnaMassC = org.ploidyMultiple;
      cellCount = 1;
      stageMechanism = `Unreplicated somatic cell holds ${baseChromosomes} chromosomes (${baseChromosomes} DNA double helices, ${dnaMassC}C mass).`;
    } else if (stage === 2) {
      stageTitle = 'Stage 2: S-Phase DNA Replication Completed (G₂)';
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes * 2;
      dnaMassC = org.ploidyMultiple * 2;
      cellCount = 1;
      stageMechanism = `In this idealised model, semi-conservative DNA replication copies each chromosome into 2 linked sister chromatids (${baseChromosomes} chromosomes, ${baseChromosomes * 2} chromatids).`;
    } else if (stage === 3) {
      stageTitle = 'Stage 3: Mitotic Alignment at Cell Equator';
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes * 2;
      dnaMassC = org.ploidyMultiple * 2;
      cellCount = 1;
      stageMechanism = `All ${baseChromosomes} replicated chromosomes condense and line up individually along the equatorial spindle plate.`;
    } else if (stage === 4) {
      stageTitle = 'Stage 4: Sister Chromatids Separate on Spindle';
      chromosomesPerCell = baseChromosomes * 2; // transiently 2 sets of baseChromosomes inside parting cell
      chromatidsPerCell = baseChromosomes * 2;
      dnaMassC = org.ploidyMultiple * 2;
      cellCount = 1;
      stageMechanism = `Protein links release; sister centromeres separate; spindle fibres pull ${baseChromosomes} daughter chromosomes toward each opposite pole in this copying model.`;
    } else {
      stageTitle = 'Stage 5: Two Daughter Cells with the Same Model Chromosome Copies';
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes;
      dnaMassC = org.ploidyMultiple;
      cellCount = 2;
      stageMechanism = `Nuclear membranes re-form and cytoplasm divides, yielding 2 daughter cells with matching chromosome copies in this model, each holding ${org.ploidySymbol} = ${baseChromosomes} chromosomes.`;
    }
  } else if (isTriploid && modePreset.id === 'cavendish_triploid') {
    // Triploid Cavendish 3n = 33 meiosis jam vs mitotic sucker comparison
    if (stage === 1) {
      stageTitle = 'Stage 1: Triploid Cavendish Somatic / Germ Cell (3n = 33)';
      chromosomesPerCell = 33;
      chromatidsPerCell = 33;
      dnaMassC = 3;
      ploidyLabel = '3n = 33 (11 triplets)';
      cellCount = 1;
      stageMechanism = 'Cavendish banana cells carry 3 copies of each of the 11 chromosomes (3n = 33), unlike wild diploid bananas (2n = 22).';
    } else if (stage === 2) {
      stageTitle = 'Stage 2: Pre-Meiotic S-Phase Replication (33 → 66 Chromatids)';
      chromosomesPerCell = 33;
      chromatidsPerCell = 66;
      dnaMassC = 6;
      ploidyLabel = '3n = 33 (66 chromatids)';
      cellCount = 1;
      stageMechanism = 'DNA replication succeeds normally, duplicating the 33 chromosomes into 66 sister chromatids.';
    } else if (stage === 3) {
      stageTitle = 'Stage 3: Meiosis I Triplet Pairing Traffic Jam';
      chromosomesPerCell = 33;
      chromatidsPerCell = 66;
      dnaMassC = 6;
      ploidyLabel = '11 uneven triplets (3 × 11)';
      cellCount = 1;
      homologousPairing = true;
      stageMechanism = 'Homologous chromosomes try to pair up, but 3 copies per set cannot divide evenly 2-by-2: each triplet splits 2-vs-1 at random.';
    } else if (stage === 4) {
      stageTitle = 'Stage 4: Unbalanced Meiotic Products (Poor Fertility)';
      chromosomesPerCell = 16; // uneven 11..22 range
      chromatidsPerCell = 16;
      dnaMassC = 1.5;
      ploidyLabel = 'Unbalanced model (11–22 chr)';
      cellCount = 4;
      stageMechanism = 'The illustrated products have unbalanced chromosome counts. Triploid meiosis often reduces fertility; parthenocarpy lets fruit develop without fertilisation. The model does not claim every product is inviable.';
    } else {
      stageTitle = 'Stage 5: Mitotic Sucker / Tissue-Culture Cloning (3n = 33 Clones)';
      chromosomesPerCell = 33;
      chromatidsPerCell = 33;
      dnaMassC = 3;
      ploidyLabel = '3n = 33 (clonal crop)';
      cellCount = 2;
      stageMechanism = 'Because triploid meiosis often produces unbalanced products, farmers propagate Cavendish bananas asexually by mitosis (suckers/tissue culture), forming low-diversity clonal lineages with possible new mutations.';
    }
  } else {
    // Meiosis I & II + Fertilisation (Human 2n=46, Wild banana 2n=22, or Sugarcane 2n=80)
    const halfChr = Math.round(baseChromosomes / 2);
    if (stage === 1) {
      stageTitle = `Stage 1: Diploid Germ Cell in Reproductive Organ (2n = ${baseChromosomes})`;
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes;
      dnaMassC = 2;
      ploidyLabel = `2n = ${baseChromosomes} (${halfChr} pairs)`;
      cellCount = 1;
      stageMechanism = `Unreplicated diploid germ-line cell holds ${halfChr} maternal and ${halfChr} paternal homologous chromosomes (${baseChromosomes} DNA helices).`;
    } else if (stage === 2) {
      stageTitle = `Stage 2: Pre-Meiotic Replication & Homologous Pairing (${baseChromosomes} → ${baseChromosomes * 2} Chromatids)`;
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes * 2;
      dnaMassC = 4;
      ploidyLabel = `2n = ${baseChromosomes} (${baseChromosomes * 2} chromatids)`;
      cellCount = 1;
      homologousPairing = true;
      crossingOverActive = true;
      stageMechanism = `DNA replicates once; maternal and paternal homologues pair into ${halfChr} bivalents and swap segments by crossing over.`;
    } else if (stage === 3) {
      stageTitle = `Stage 3: Meiosis I Reduction Division (2n = ${baseChromosomes} → n = ${halfChr})`;
      chromosomesPerCell = halfChr;
      chromatidsPerCell = baseChromosomes;
      dnaMassC = 2;
      ploidyLabel = `n = ${halfChr} (${baseChromosomes} chromatids)`;
      cellCount = 2;
      homologousPairing = true;
      crossingOverActive = true;
      stageMechanism = `Homologous pairs separate randomly into 2 cells: chromosome number is halved from diploid (${baseChromosomes}) to haploid (n = ${halfChr}), each still having 2 chromatids.`;
    } else if (stage === 4) {
      stageTitle = `Stage 4: Meiosis II Chromatid Separation (4 Haploid Gametes, n = ${halfChr})`;
      chromosomesPerCell = halfChr;
      chromatidsPerCell = halfChr;
      dnaMassC = 1;
      ploidyLabel = `n = ${halfChr} (haploid gamete)`;
      cellCount = 4;
      crossingOverActive = true;
      stageMechanism = `Sister chromatids separate without further DNA copying, forming 4 haploid products (sperm model) each holding n = ${halfChr} single chromosomes.`;
    } else {
      stageTitle = `Stage 5: Fertilisation Restores Diploid Zygote (n + n → 2n = ${baseChromosomes})`;
      chromosomesPerCell = baseChromosomes;
      chromatidsPerCell = baseChromosomes;
      dnaMassC = 2;
      ploidyLabel = `2n = ${baseChromosomes} (zygote restored)`;
      cellCount = 1;
      stageMechanism = `Fusion of two haploid gamete nuclei (n = ${halfChr} + n = ${halfChr}) forms a single diploid zygote (2n = ${baseChromosomes}) ready to grow by mitosis.`;
    }
  }

  const assortmentCombinations = isMitosis || isTriploid ? 1 : computeIndependentAssortment(org.homologousPairs);
  const zygoteCombinations = isMitosis || isTriploid ? 1 : computeZygoteCombinations(org.homologousPairs);
  const runawayWithoutMeiosisGen3 = baseChromosomes * Math.pow(2, 3); // after 3 generations without meiosis

  return Object.freeze({
    modeIndex: modeIdx,
    modeId: modePreset.id,
    modeLabel: modePreset.label,
    shortModeLabel: modePreset.shortLabel,
    divisionType: modePreset.divisionType,
    stage,
    stageTitle,
    stageMechanism,
    organismPresetIndex: effectiveOrgIdx,
    organismId: org.id,
    species: org.species,
    commonName: org.commonName,
    basicSetX: org.basicSetX,
    somaticChromosomes: baseChromosomes,
    homologousPairs: org.homologousPairs,
    gameteChromosomes: org.gameteChromosomes,
    meioticViable: org.meioticViable,
    chromosomesPerCell,
    chromatidsPerCell,
    dnaMassC,
    ploidyLabel,
    cellCount,
    nuclearDivisions: modePreset.nuclearDivisions,
    daughterCellCount: modePreset.daughterCellCount,
    homologousPairing,
    crossingOverActive,
    assortmentCombinations,
    zygoteCombinations,
    runawayWithoutMeiosisGen3,
    geneticIdentity: modePreset.geneticIdentity,
    biologicalRoles: modePreset.biologicalRoles,
  });
}

export function captureDivisionTrial(params = {}, prevTrials = []) {
  const sim = simulateMitosisMeiosisStepper(params);
  const trialNumber = (Array.isArray(prevTrials) ? prevTrials.length : 0) + 1;
  const record = Object.freeze({
    trialNumber,
    modeId: sim.modeId,
    shortModeLabel: sim.shortModeLabel,
    stage: sim.stage,
    commonName: sim.commonName,
    chromosomesPerCell: sim.chromosomesPerCell,
    chromatidsPerCell: sim.chromatidsPerCell,
    ploidyLabel: sim.ploidyLabel,
    cellCount: sim.cellCount,
    assortmentCombinations: sim.assortmentCombinations,
  });
  return Object.freeze([...(Array.isArray(prevTrials) ? prevTrials : []), record]);
}

export function compareDivisionTrials(trialA, trialB) {
  const a = trialA.modeId ? trialA : simulateMitosisMeiosisStepper(trialA);
  const b = trialB.modeId ? trialB : simulateMitosisMeiosisStepper(trialB);
  return Object.freeze({
    chromosomeDelta: b.chromosomesPerCell - a.chromosomesPerCell,
    chromatidDelta: b.chromatidsPerCell - a.chromatidsPerCell,
    cellCountDelta: b.cellCount - a.cellCount,
    summary: `${a.shortModeLabel} Stg ${a.stage} (${a.chromosomesPerCell} chr / ${a.chromatidsPerCell} chromatids, ${a.cellCount} cell) → ${b.shortModeLabel} Stg ${b.stage} (${b.chromosomesPerCell} chr / ${b.chromatidsPerCell} chromatids, ${b.cellCount} cells)`,
  });
}

// ---------------------------------------------------------------------------
// 3. STEM CELLS, SELECTIVE GENE EXPRESSION & REPROGRAMMING MODEL
// ---------------------------------------------------------------------------

export const GENE_PANEL = Object.freeze([
  Object.freeze({
    symbol: 'ATP5F1A',
    name: 'ATP Synthase Subunit Alpha',
    chromosome: 'Chromosome 18',
    category: 'housekeeping',
    proteinProduct: 'Mitochondrial ATP synthase complex',
    functionNote: 'Broadly used in mitochondrial ATP synthesis; kept ON as a housekeeping example in this panel.',
  }),
  Object.freeze({
    symbol: 'GAPDH',
    name: 'Glyceraldehyde-3-Phosphate Dehydrogenase',
    chromosome: 'Chromosome 12',
    category: 'housekeeping',
    proteinProduct: 'Glycolysis housekeeping enzyme',
    functionNote: 'A broadly expressed glycolysis enzyme; kept ON as a housekeeping example in this panel.',
  }),
  Object.freeze({
    symbol: 'OCT4_SOX2',
    name: 'Pluripotency Master Factors (OCT4 / SOX2)',
    chromosome: 'Chromosomes 6 & 3',
    category: 'pluripotency',
    proteinProduct: 'Oct4 & Sox2 transcription factors',
    functionNote: 'Keep embryonic stem cells and Yamanaka iPSCs unspecialised and self-renewing; silenced once cells differentiate.',
  }),
  Object.freeze({
    symbol: 'INS',
    name: 'Insulin Hormone Gene',
    chromosome: 'Chromosome 11',
    category: 'specialist_beta',
    proteinProduct: 'Insulin peptide hormone (51 aa)',
    functionNote: 'A pancreatic beta-cell example supporting insulin production; the panel models INS as ON in this lineage and OFF in the comparison lineages.',
  }),
  Object.freeze({
    symbol: 'HBB',
    name: 'Haemoglobin Subunit Beta Gene',
    chromosome: 'Chromosome 11',
    category: 'specialist_blood',
    proteinProduct: 'Beta-globin chain of haemoglobin',
    functionNote: 'Switched ON massively in bone-marrow erythroblasts (regulated by GATA1) to pack 270 million haemoglobin molecules per red blood cell.',
  }),
  Object.freeze({
    symbol: 'CHAT',
    name: 'Choline Acetyltransferase',
    chromosome: 'Chromosome 10',
    category: 'specialist_neural',
    proteinProduct: 'Choline acetyltransferase (acetylcholine synthesis)',
    functionNote: 'Expressed in cholinergic motor neurones to synthesise acetylcholine for signalling to skeletal muscle. The panel uses an illustrative on/off programme.',
  }),
]);

export const STEM_CELL_LINEAGE_PRESETS = Object.freeze([
  Object.freeze({
    modeIndex: 0,
    id: 'pancreatic_beta',
    label: 'Pancreatic Beta Cell (Insulin secretor)',
    shortLabel: 'Pancreatic Beta Cell',
    stemCellOrigin: 'Embryonic endoderm / pancreatic progenitor',
    masterRegulator: 'PDX1 & NKX6-1 transcription factors',
    specialistGeneSymbol: 'INS',
    specialistProtein: 'Insulin hormone (secreted into islet capillaries)',
    chromosomesInNucleus: 46,
    totalGenesInNucleus: 20000,
    nuclearStatusAtStage4: 'Illustrative diploid nucleus: 46 chromosomes; displayed entries retained',
  }),
  Object.freeze({
    modeIndex: 1,
    id: 'erythroblast_rbc',
    label: 'Bone-Marrow Erythroblast (Haemoglobin printer)',
    shortLabel: 'Erythroblast / RBC',
    stemCellOrigin: 'Adult bone-marrow haematopoietic stem cell (multipotent)',
    masterRegulator: 'GATA1 & KLF1 transcription factors',
    specialistGeneSymbol: 'HBB',
    specialistProtein: 'Haemoglobin (270 million molecules per cell)',
    chromosomesInNucleus: 46,
    totalGenesInNucleus: 20000,
    nuclearStatusAtStage4: 'This panel models a nucleated diploid erythroblast; a mature mammalian red blood cell has lost its nucleus.',
  }),
  Object.freeze({
    modeIndex: 2,
    id: 'motor_neurone',
    label: 'Spinal Motor Neurone (Action-potential wire)',
    shortLabel: 'Spinal Motor Neurone',
    stemCellOrigin: 'Embryonic neural tube ectoderm progenitor',
    masterRegulator: 'Illustrative motor-neurone regulatory programme',
    specialistGeneSymbol: 'CHAT',
    specialistProtein: 'Choline acetyltransferase for acetylcholine synthesis',
    chromosomesInNucleus: 46,
    totalGenesInNucleus: 20000,
    nuclearStatusAtStage4: 'Illustrative diploid nucleus: 46 chromosomes; displayed entries retained',
  }),
  Object.freeze({
    modeIndex: 3,
    id: 'gurdon_yamanaka',
    label: 'Gurdon / Yamanaka Nuclear Reprogramming',
    shortLabel: 'Gurdon / Yamanaka iPSC',
    stemCellOrigin: 'Differentiated intestinal or skin fibroblast cell',
    masterRegulator: 'Egg cytoplasm (Gurdon 1962) or Oct4, Sox2, Klf4, c-Myc (Yamanaka 2006)',
    specialistGeneSymbol: 'OCT4_SOX2',
    specialistProtein: 'Re-opened pluripotent chromatin & multi-lineage proteins',
    chromosomesInNucleus: 46,
    totalGenesInNucleus: 20000,
    nuclearStatusAtStage4: 'Reprogramming shows that many specialised nuclei retain developmental information; it does not prove every sequence is unchanged.',
  }),
]);

export const DIFFERENTIATION_STAGE_PRESETS = Object.freeze([
  Object.freeze({
    stage: 1,
    label: 'Stage 1: Unspecialised Stem Cell (Mitotic Self-Renewal)',
    potencyLabel: 'Pluripotent / Multipotent Stem Cell',
    mitoticIndexPct: 85,
    specialisationPct: 10,
  }),
  Object.freeze({
    stage: 2,
    label: 'Stage 2: Lineage-Committed Progenitor Cell',
    potencyLabel: 'Committed Progenitor (Chromatin Bookmarking)',
    mitoticIndexPct: 55,
    specialisationPct: 45,
  }),
  Object.freeze({
    stage: 3,
    label: 'Stage 3: Differentiating Precursor Printing Specialist mRNA',
    potencyLabel: 'Differentiating Precursor (High Transcription)',
    mitoticIndexPct: 20,
    specialisationPct: 80,
  }),
  Object.freeze({
    stage: 4,
    label: 'Stage 4: Fully Specialised Worker Cell (or Reprogrammed iPSC)',
    potencyLabel: 'Mature Specialised Cell / Reprogrammed Proof',
    mitoticIndexPct: 5,
    specialisationPct: 100,
  }),
]);

export const TF_SWITCH_PRESETS = Object.freeze([
  Object.freeze({
    switchIndex: 1,
    id: 'lineage_default',
    label: 'Switch 1: Native Lineage Transcription Factors',
    activeRegulator: 'Native lineage programme',
  }),
  Object.freeze({
    switchIndex: 2,
    id: 'pdx1_beta',
    label: 'Switch 2: PDX1 Beta-Cell Activator (Opens INS)',
    activeRegulator: 'PDX1 (Pancreatic beta-cell switch)',
  }),
  Object.freeze({
    switchIndex: 3,
    id: 'gata1_blood',
    label: 'Switch 3: GATA1 Erythroid Activator (Opens HBB)',
    activeRegulator: 'GATA1 (Erythroblast globin switch)',
  }),
  Object.freeze({
    switchIndex: 4,
    id: 'yamanaka_oskm',
    label: 'Switch 4: Yamanaka Factors Oct4+Sox2+Klf4+c-Myc (iPSC Reset)',
    activeRegulator: 'Oct4, Sox2, Klf4, c-Myc (Pluripotency reset)',
  }),
]);

export function simulateStemCellExpressionLab(params = {}) {
  let modeIdx = 0;
  if (typeof params.mode === 'number') {
    modeIdx = Math.max(0, Math.min(3, Math.round(params.mode)));
  } else if (typeof params.mode === 'string') {
    const found = STEM_CELL_LINEAGE_PRESETS.find(
      (p) => p.id === params.mode || p.label === params.mode || p.shortLabel === params.mode
    );
    if (found) modeIdx = found.modeIndex;
  }
  const lineage = STEM_CELL_LINEAGE_PRESETS[modeIdx];
  const diffStage = Math.max(1, Math.min(4, Math.round(Number(params.differentiationStage ?? 4))));
  const stagePreset = DIFFERENTIATION_STAGE_PRESETS[diffStage - 1];
  const tfSwitchIdx = Math.max(1, Math.min(4, Math.round(Number(params.tfSwitch ?? 1))));
  const tfPreset = TF_SWITCH_PRESETS[tfSwitchIdx - 1];

  // Determine effective lineage programme based on TF switch override
  let effectiveProgramme = lineage.id;
  if (tfPreset.id === 'pdx1_beta') effectiveProgramme = 'pancreatic_beta';
  else if (tfPreset.id === 'gata1_blood') effectiveProgramme = 'erythroblast_rbc';
  else if (tfPreset.id === 'yamanaka_oskm') effectiveProgramme = 'gurdon_yamanaka';

  const isStemOrReprogrammed =
    diffStage === 1 || (effectiveProgramme === 'gurdon_yamanaka' && diffStage >= 3);

  const geneStates = GENE_PANEL.map((g) => {
    const presentInDna = true; // Explicit assumption: all six displayed entries remain in this model.
    let expressed = false;
    let mrnaCopiesPerCell = 0;
    let chromatinState = 'Closed heterochromatin (SILENCED)';

    if (g.category === 'housekeeping') {
      expressed = true;
      mrnaCopiesPerCell = 450;
      chromatinState = 'Open chromatin (ON in this panel)';
    } else if (g.category === 'pluripotency') {
      if (isStemOrReprogrammed) {
        expressed = true;
        mrnaCopiesPerCell = diffStage === 1 ? 600 : 750;
        chromatinState = 'Open euchromatin (STEM / iPSC ON)';
      }
    } else if (g.symbol === 'INS') {
      if (effectiveProgramme === 'pancreatic_beta' && diffStage >= 2) {
        expressed = true;
        mrnaCopiesPerCell = diffStage === 2 ? 300 : diffStage === 3 ? 1200 : 2800;
        chromatinState = 'Open euchromatin (PDX1-activated ON)';
      }
    } else if (g.symbol === 'HBB') {
      if (effectiveProgramme === 'erythroblast_rbc' && diffStage >= 2) {
        expressed = true;
        mrnaCopiesPerCell = diffStage === 2 ? 400 : diffStage === 3 ? 1800 : 3500;
        chromatinState = 'Open euchromatin (GATA1-activated ON)';
      }
    } else if (g.symbol === 'CHAT') {
      if (effectiveProgramme === 'motor_neurone' && diffStage >= 2) {
        expressed = true;
        mrnaCopiesPerCell = diffStage === 2 ? 220 : diffStage === 3 ? 650 : 1400;
        chromatinState = 'Open chromatin (motor-neurone model ON)';
      }
    }

    return Object.freeze({
      symbol: g.symbol,
      name: g.name,
      chromosome: g.chromosome,
      category: g.category,
      presentInDna,
      expressed,
      mrnaCopiesPerCell,
      proteinMade: expressed ? g.proteinProduct : 'None (0 mRNA transcribed)',
      chromatinState,
    });
  });

  const expressedCount = geneStates.filter((g) => g.expressed).length;
  const silencedCount = geneStates.length - expressedCount;
  const dnaGenesRetainedPct = 100;

  let igcseRuleExplanation = '';
  if (effectiveProgramme === 'gurdon_yamanaka' && diffStage >= 3) {
    igcseRuleExplanation =
      'Gurdon nuclear transfer and Yamanaka reprogramming show that many specialised nuclei retain information supporting other developmental programmes. They do not show that every body cell retains an identical complete genome. This panel keeps six displayed entries as a model assumption.';
  } else if (diffStage === 1) {
    igcseRuleExplanation =
      'Unspecialised stem cell (0610 17.2.5): divides by mitosis to self-renew and produce daughter cells that can specialise as tissue transcription factors switch on.';
  } else {
    igcseRuleExplanation = `Illustrative selective-expression model: this diploid nucleus is assigned 46 chromosomes and keeps all six displayed entries; the ON entries are housekeeping examples + ${
      effectiveProgramme === 'pancreatic_beta'
        ? 'INS (insulin)'
        : effectiveProgramme === 'erythroblast_rbc'
        ? 'HBB (haemoglobin)'
        : 'CHAT (acetylcholine synthesis)'
    }.`;
  }

  return Object.freeze({
    modeIndex: modeIdx,
    modeId: lineage.id,
    modeLabel: lineage.label,
    shortModeLabel: lineage.shortLabel,
    effectiveProgramme,
    differentiationStage: diffStage,
    stageLabel: stagePreset.label,
    potencyLabel: isStemOrReprogrammed ? 'Stem / reprogrammed model' : stagePreset.potencyLabel,
    mitoticIndexPct: isStemOrReprogrammed ? 85 : stagePreset.mitoticIndexPct,
    specialisationPct: isStemOrReprogrammed ? 15 : stagePreset.specialisationPct,
    tfSwitchIndex: tfSwitchIdx,
    tfSwitchLabel: tfPreset.label,
    activeRegulator: tfSwitchIdx === 1 ? lineage.masterRegulator : tfPreset.activeRegulator,
    chromosomesInNucleus: 46,
    totalGenesInNucleus: 20000,
    dnaGenesRetainedPct,
    modelAssumptions: Object.freeze({ illustrative: true, retainedPanelEntries: 6,
      nucleus: 'A diploid human nucleus with 46 chromosomes is chosen for this comparison, not asserted for every nucleated cell.',
      panel: 'Six displayed entries, including the grouped OCT4/SOX2 entry, are retained. The percentage is panel retention, not a complete-genome measurement.',
      expression: 'On/off states, transcript counts, differentiation percentages and regulator overrides are invented teaching values. Housekeeping examples remain ON in this panel.',
      limits: 'Most body cells share most inherited DNA. Mutation, immune-cell DNA rearrangement, polyploidy and loss of the nucleus are relevant exceptions.' }),
    panelGenesTotal: geneStates.length,
    expressedPanelGenes: expressedCount,
    silencedPanelGenes: silencedCount,
    geneStates: Object.freeze(geneStates),
    nuclearStatusNote: lineage.nuclearStatusAtStage4,
    igcseRuleExplanation,
  });
}

export function captureExpressionTrial(params = {}, prevTrials = []) {
  const sim = simulateStemCellExpressionLab(params);
  const trialNumber = (Array.isArray(prevTrials) ? prevTrials.length : 0) + 1;
  const activeSymbols = sim.geneStates
    .filter((g) => g.expressed)
    .map((g) => g.symbol)
    .join(', ');
  const record = Object.freeze({
    trialNumber,
    modeId: sim.modeId,
    shortModeLabel: sim.shortModeLabel,
    differentiationStage: sim.differentiationStage,
    tfSwitchIndex: sim.tfSwitchIndex,
    chromosomesInNucleus: sim.chromosomesInNucleus,
    dnaGenesRetainedPct: sim.dnaGenesRetainedPct,
    expressedPanelGenes: sim.expressedPanelGenes,
    activeSymbols,
  });
  return Object.freeze([...(Array.isArray(prevTrials) ? prevTrials : []), record]);
}

export function compareExpressionTrials(trialA, trialB) {
  const a = trialA.modeId ? trialA : simulateStemCellExpressionLab(trialA);
  const b = trialB.modeId ? trialB : simulateStemCellExpressionLab(trialB);
  const aActive = a.activeSymbols || a.geneStates.filter((g) => g.expressed).map((g) => g.symbol).join(', ');
  const bActive = b.activeSymbols || b.geneStates.filter((g) => g.expressed).map((g) => g.symbol).join(', ');
  return Object.freeze({
    chromosomeDifference: b.chromosomesInNucleus - a.chromosomesInNucleus, // always 0
    dnaRetainedDeltaPct: b.dnaGenesRetainedPct - a.dnaGenesRetainedPct, // always 0
    expressedCountDelta: b.expressedPanelGenes - a.expressedPanelGenes,
    summary: `Both illustrative states use ${a.chromosomesInNucleus} chromosomes and retain the six displayed entries; ${a.shortModeLabel} expresses [${aActive}] whereas ${b.shortModeLabel} expresses [${bActive}].`,
  });
}
