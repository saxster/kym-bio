/**
 * Chapter 12 standalone Node.js domain test suite (ch12_domain.mjs).
 * Verifies cell_division_model.js across >= 2,000 assertions:
 * 1. Complementary base pairing & hydrogen-bond counting
 * 2. Meselson & Stahl (1958) 15N/14N CsCl density-gradient laws & proofreading fidelity
 * 3. Mitosis vs Meiosis chromosome/chromatid accounting, ploidy, and Cavendish 3n = 33
 * 4. Stem cell differentiation, selective gene expression (0610 17.1.6 & 17.2.5), and Gurdon/Yamanaka reprogramming
 * 5. Trial capture, trial comparison, and deep Object.isFrozen immutability
 */

import assert from 'node:assert/strict';
import {
  COMPLEMENT_MAP,
  H_BOND_MAP,
  CSCL_DENSITIES,
  MESELSON_HYPOTHESIS_PRESETS,
  MESELSON_FIDELITY_PRESETS,
  ORGANISM_PLOIDY_PRESETS,
  DIVISION_MODE_PRESETS,
  GENE_PANEL,
  STEM_CELL_LINEAGE_PRESETS,
  DIFFERENTIATION_STAGE_PRESETS,
  TF_SWITCH_PRESETS,
  complementBase,
  complementStrand,
  countHydrogenBonds,
  computeSemiConservativeFractions,
  computeIndependentAssortment,
  computeZygoteCombinations,
  simulateDnaReplicationMeselson,
  captureMeselsonTrial,
  compareMeselsonTrials,
  simulateMitosisMeiosisStepper,
  captureDivisionTrial,
  compareDivisionTrials,
  simulateStemCellExpressionLab,
  captureExpressionTrial,
  compareExpressionTrials,
} from '../live/cell_division_model.js';

let assertionCount = 0;

function check(cond, msg) {
  assert.ok(cond, msg);
  assertionCount += 1;
}

function checkEqual(actual, expected, msg) {
  assert.strictEqual(actual, expected, msg);
  assertionCount += 1;
}

function checkClose(actual, expected, tol = 1e-6, msg = '') {
  assert.ok(Math.abs(actual - expected) <= tol, `${msg}: expected ${expected}, got ${actual}`);
  assertionCount += 1;
}

// ---------------------------------------------------------------------------
// 1. Frozen Reference Tables & Base-Pairing Helpers
// ---------------------------------------------------------------------------
check(Object.isFrozen(COMPLEMENT_MAP), 'COMPLEMENT_MAP is frozen');
check(Object.isFrozen(H_BOND_MAP), 'H_BOND_MAP is frozen');
check(Object.isFrozen(CSCL_DENSITIES), 'CSCL_DENSITIES is frozen');
check(Object.isFrozen(MESELSON_HYPOTHESIS_PRESETS), 'MESELSON_HYPOTHESIS_PRESETS is frozen');
check(Object.isFrozen(MESELSON_FIDELITY_PRESETS), 'MESELSON_FIDELITY_PRESETS is frozen');
check(Object.isFrozen(ORGANISM_PLOIDY_PRESETS), 'ORGANISM_PLOIDY_PRESETS is frozen');
check(Object.isFrozen(DIVISION_MODE_PRESETS), 'DIVISION_MODE_PRESETS is frozen');
check(Object.isFrozen(GENE_PANEL), 'GENE_PANEL is frozen');
check(Object.isFrozen(STEM_CELL_LINEAGE_PRESETS), 'STEM_CELL_LINEAGE_PRESETS is frozen');
check(Object.isFrozen(DIFFERENTIATION_STAGE_PRESETS), 'DIFFERENTIATION_STAGE_PRESETS is frozen');
check(Object.isFrozen(TF_SWITCH_PRESETS), 'TF_SWITCH_PRESETS is frozen');

checkEqual(complementBase('A'), 'T', 'A -> T');
checkEqual(complementBase('T'), 'A', 'T -> A');
checkEqual(complementBase('C'), 'G', 'C -> G');
checkEqual(complementBase('G'), 'C', 'G -> C');
checkEqual(complementStrand('ATGCCGTAATCG'), 'TACGGCATTAGC', 'complementStrand');

const hb0 = countHydrogenBonds('ATGCCGTAATCG');
check(Object.isFrozen(hb0), 'countHydrogenBonds output frozen');
checkEqual(hb0.lengthBp, 12, '12 bp template');
checkEqual(hb0.atPairs, 6, '6 AT pairs');
checkEqual(hb0.gcPairs, 6, '6 GC pairs');
checkEqual(hb0.totalHydrogenBonds, 6 * 2 + 6 * 3, '30 H-bonds');

// Sweep synthetic sequences to verify base pairing & H-bond invariants
const bases = ['A', 'T', 'C', 'G'];
for (let i = 0; i < 80; i += 1) {
  let seq = '';
  let expectedH = 0;
  for (let j = 0; j < 10; j += 1) {
    const b = bases[(i + j * 3) % 4];
    seq += b;
    expectedH += b === 'A' || b === 'T' ? 2 : 3;
  }
  const comp = complementStrand(seq);
  const back = complementStrand(comp);
  checkEqual(back, seq, 'double complement restores original strand');
  const stats = countHydrogenBonds(seq);
  checkEqual(stats.totalHydrogenBonds, expectedH, 'exact H-bond sum');
  checkEqual(stats.atPairs + stats.gcPairs, 10, 'pair sum equals length');
}

// ---------------------------------------------------------------------------
// 2. Meselson & Stahl (1958) Semi-Conservative Mathematical Laws & All Modes
// ---------------------------------------------------------------------------
checkClose(CSCL_DENSITIES.heavy15N15N, 1.724, 1e-6, '15N/15N density');
checkClose(CSCL_DENSITIES.hybrid15N14N, 1.717, 1e-6, '15N/14N density');
checkClose(CSCL_DENSITIES.light14N14N, 1.710, 1e-6, '14N/14N density');
checkClose(
  (CSCL_DENSITIES.heavy15N15N + CSCL_DENSITIES.light14N14N) / 2,
  CSCL_DENSITIES.hybrid15N14N,
  1e-6,
  'hybrid density is exact midpoint of heavy and light'
);

const expectedGenData = [
  { g: 0, dup: 1, hPct: 100, hybPct: 0, lPct: 0 },
  { g: 1, dup: 2, hPct: 0, hybPct: 100, lPct: 0 },
  { g: 2, dup: 4, hPct: 0, hybPct: 50, lPct: 50 },
  { g: 3, dup: 8, hPct: 0, hybPct: 25, lPct: 75 },
  { g: 4, dup: 16, hPct: 0, hybPct: 12.5, lPct: 87.5 },
];

for (const row of expectedGenData) {
  const sc = computeSemiConservativeFractions(row.g);
  check(Object.isFrozen(sc), `Gen ${row.g} frozen`);
  checkEqual(sc.totalDuplexes, row.dup, `Gen ${row.g} duplexes`);
  checkEqual(sc.totalSingleStrands, row.dup * 2, `Gen ${row.g} single strands`);
  checkEqual(sc.heavySingleStrands, 2, `Gen ${row.g} always retains 2 original 15N strands`);
  checkEqual(sc.lightSingleStrands, row.dup * 2 - 2, `Gen ${row.g} light strands`);
  checkClose(sc.heavyPct, row.hPct, 1e-6, `Gen ${row.g} heavyPct`);
  checkClose(sc.hybridPct, row.hybPct, 1e-6, `Gen ${row.g} hybridPct`);
  checkClose(sc.lightPct, row.lPct, 1e-6, `Gen ${row.g} lightPct`);
  checkClose(sc.heavyPct + sc.hybridPct + sc.lightPct, 100, 1e-6, `Gen ${row.g} sum 100%`);
  if (row.g >= 1) {
    checkEqual(sc.hybridDuplexCount, 2, `Gen ${row.g} has 2 hybrid duplexes`);
    checkClose(sc.hybridPct, (2 / Math.pow(2, row.g)) * 100, 1e-6, '2 / 2^g law');
  }
}

// Sweep all 4 modes x 5 generations x 4 fidelity steps = 80 states
let meselsonTrials = Object.freeze([]);
for (let m = 0; m < 4; m += 1) {
  for (let g = 0; g <= 4; g += 1) {
    for (let f = 1; f <= 4; f += 1) {
      const sim = simulateDnaReplicationMeselson({
        mode: m,
        generation: g,
        fidelityStep: f,
      });
      check(Object.isFrozen(sim), 'simulateDnaReplicationMeselson frozen');
      check(Object.isFrozen(sim.bands), 'sim.bands frozen');
      checkEqual(sim.modeIndex, m, 'modeIndex');
      checkEqual(sim.generation, g, 'generation');
      checkEqual(sim.fidelityStep, f, 'fidelityStep');
      checkEqual(sim.centrifugationG, 140000, '140,000 x g');
      checkEqual(sim.timeMinutesEColi, g * 20, '20 min per generation');
      checkEqual(sim.totalDuplexes, Math.pow(2, g), 'totalDuplexes = 2^g');
      checkEqual(sim.heavySingleStrands, 2, '2 heavy strands conserved');
      check(sim.bands.length >= 1 && sim.bands.length <= 2, '1 or 2 CsCl bands');
      check(sim.errorRatePerBase <= 1e-4 && sim.errorRatePerBase >= 1e-9, 'error rate range');

      if (m === 0 || m === 3) {
        checkEqual(sim.matchesExperiment, true, 'semi-conservative matches experiment');
        if (g === 1) {
          checkEqual(sim.bands.length, 1, 'Gen 1 single hybrid band');
          checkClose(sim.bands[0].densityGPerCm3, 1.717, 1e-6, 'Gen 1 1.717 g/cm³');
        } else if (g >= 2) {
          checkEqual(sim.bands.length, 2, 'Gen >= 2 two bands');
        }
      } else if (m === 1) {
        checkEqual(sim.matchesExperiment, false, 'conservative falsified');
        checkClose(sim.hybridPct, 0, 1e-6, 'conservative has 0% hybrid');
        if (g >= 1) {
          checkEqual(sim.bands.length, 2, 'conservative predicts 2 bands at Gen >= 1');
        }
      } else if (m === 2) {
        checkEqual(sim.matchesExperiment, false, 'dispersive falsified');
        checkEqual(sim.bands.length, 1, 'dispersive always forms 1 blended band');
        if (g === 2) {
          checkClose(sim.dispersiveDensity, 1.7135, 1e-5, 'Gen 2 dispersive density 1.7135');
        }
      }

      meselsonTrials = captureMeselsonTrial({ mode: m, generation: g, fidelityStep: f }, meselsonTrials);
      check(Object.isFrozen(meselsonTrials), 'captured trials frozen');
    }
  }
}

for (let i = 1; i < meselsonTrials.length; i += 1) {
  const cmp = compareMeselsonTrials(meselsonTrials[i - 1], meselsonTrials[i]);
  check(Object.isFrozen(cmp), 'compareMeselsonTrials frozen');
  check(typeof cmp.summary === 'string' && cmp.summary.length > 10, 'cmp summary string');
}

// ---------------------------------------------------------------------------
// 3. Mitosis vs Meiosis Stepper, Ploidy, Cavendish 3n = 33 & Janaki Ammal Cane
// ---------------------------------------------------------------------------
checkEqual(computeIndependentAssortment(23), 8388608, 'human 2^23 = 8,388,608');
checkEqual(computeIndependentAssortment(11), 2048, 'wild banana 2^11 = 2,048');
checkEqual(computeIndependentAssortment(3), 8, 'Indian muntjac 2^3 = 8');
checkEqual(computeZygoteCombinations(23), 8388608 * 8388608, 'human 2^46 zygotes');

// Sweep all 4 division modes x 5 stages x 4 organism presets = 80 states
let divisionTrials = Object.freeze([]);
for (let m = 0; m < 4; m += 1) {
  for (let st = 1; st <= 5; st += 1) {
    for (let org = 1; org <= 4; org += 1) {
      const sim = simulateMitosisMeiosisStepper({
        mode: m,
        stage: st,
        organismPreset: org,
      });
      check(Object.isFrozen(sim), 'simulateMitosisMeiosisStepper frozen');
      checkEqual(sim.modeIndex, m, 'modeIndex');
      checkEqual(sim.stage, st, 'stage');
      checkEqual(sim.organismPresetIndex, org, 'organismPresetIndex');
      check(sim.chromosomesPerCell > 0, 'positive chromosomesPerCell');
      check(sim.chromatidsPerCell >= sim.chromosomesPerCell, 'chromatids >= chromosomes');
      check(sim.cellCount >= 1 && sim.cellCount <= 4, 'cellCount in 1..4');

      // Check Human Mitosis specific invariants (m === 0, org === 1)
      if (m === 0 && org === 1) {
        if (st === 1) {
          checkEqual(sim.chromosomesPerCell, 46, 'G1 46 chromosomes');
          checkEqual(sim.chromatidsPerCell, 46, 'G1 46 chromatids');
          checkEqual(sim.cellCount, 1, 'G1 1 cell');
        } else if (st === 2 || st === 3) {
          checkEqual(sim.chromosomesPerCell, 46, 'G2/Metaphase 46 chromosomes');
          checkEqual(sim.chromatidsPerCell, 92, 'G2/Metaphase 92 sister chromatids');
        } else if (st === 5) {
          checkEqual(sim.chromosomesPerCell, 46, 'Daughter 46 chromosomes maintained');
          checkEqual(sim.chromatidsPerCell, 46, 'Daughter 46 chromatids');
          checkEqual(sim.cellCount, 2, 'Mitosis yields 2 daughter cells');
        }
      }

      // Check Human Meiosis specific invariants (m === 1, org === 1)
      if (m === 1 && org === 1) {
        if (st === 1) {
          checkEqual(sim.chromosomesPerCell, 46, 'Meiosis G1 46 chr');
          checkEqual(sim.chromatidsPerCell, 46, 'Meiosis G1 46 chromatids');
        } else if (st === 2) {
          checkEqual(sim.chromosomesPerCell, 46, 'Prophase I 46 chr');
          checkEqual(sim.chromatidsPerCell, 92, 'Prophase I 92 chromatids');
          checkEqual(sim.homologousPairing, true, 'homologues pair in Meiosis I');
          checkEqual(sim.crossingOverActive, true, 'crossing over active');
        } else if (st === 3) {
          checkEqual(sim.chromosomesPerCell, 23, 'Meiosis I halves to n = 23');
          checkEqual(sim.chromatidsPerCell, 46, 'Meiosis I 46 chromatids per cell');
          checkEqual(sim.cellCount, 2, 'Meiosis I forms 2 cells');
        } else if (st === 4) {
          checkEqual(sim.chromosomesPerCell, 23, 'Meiosis II n = 23');
          checkEqual(sim.chromatidsPerCell, 23, 'Meiosis II 23 single helices');
          checkEqual(sim.cellCount, 4, 'Meiosis II forms 4 haploid gametes');
        } else if (st === 5) {
          checkEqual(sim.chromosomesPerCell, 46, 'Fertilisation restores 2n = 46');
          checkEqual(sim.cellCount, 1, '1 diploid zygote');
        }
      }

      // Check Cavendish 3n = 33 mode (m === 2, org === 3)
      if (m === 2 && org === 3) {
        checkEqual(sim.meioticViable, false, 'Cavendish 3n = 33 meiotically sterile');
        checkEqual(sim.somaticChromosomes, 33, 'Cavendish 3n = 33');
        if (st === 2) {
          checkEqual(sim.chromatidsPerCell, 66, 'Cavendish S phase 66 chromatids');
        } else if (st === 4) {
          checkEqual(sim.cellCount, 4, '4 unbalanced spores abort');
        }
      }

      divisionTrials = captureDivisionTrial({ mode: m, stage: st, organismPreset: org }, divisionTrials);
      check(Object.isFrozen(divisionTrials), 'divisionTrials frozen');
    }
  }
}

for (let i = 1; i < divisionTrials.length; i += 1) {
  const cmp = compareDivisionTrials(divisionTrials[i - 1], divisionTrials[i]);
  check(Object.isFrozen(cmp), 'compareDivisionTrials frozen');
  check(typeof cmp.summary === 'string' && cmp.summary.length > 10, 'cmp summary');
}

// ---------------------------------------------------------------------------
// 4. Stem Cells, Selective Gene Expression (0610 17.1.6 & 17.2.5) & Reprogramming
// ---------------------------------------------------------------------------
let expressionTrials = Object.freeze([]);
for (let m = 0; m < 4; m += 1) {
  for (let d = 1; d <= 4; d += 1) {
    for (let tf = 1; tf <= 4; tf += 1) {
      const sim = simulateStemCellExpressionLab({
        mode: m,
        differentiationStage: d,
        tfSwitch: tf,
      });
      check(Object.isFrozen(sim), 'simulateStemCellExpressionLab frozen');
      check(Object.isFrozen(sim.geneStates), 'geneStates frozen');
      checkEqual(sim.chromosomesInNucleus, 46, 'chosen model nucleus has 46 chromosomes');
      checkEqual(sim.totalGenesInNucleus, 20000, 'model background gene-count estimate retained');
      checkEqual(sim.dnaGenesRetainedPct, 100, 'six displayed entries retained by assumption');
      checkEqual(sim.panelGenesTotal, 6, '6 displayed panel entries');
      check(sim.modelAssumptions?.illustrative === true, 'Expression panel explicitly exposes its model assumptions');
      check(Object.isFrozen(sim.modelAssumptions), 'Expression model assumptions immutable');
      checkEqual(sim.modelAssumptions?.retainedPanelEntries, 6, 'Retention applies to six displayed entries, not a complete genome');
      check(!/SCN9A|100% of (?:the )?genome|all 46 chromosomes|exact same 46/i.test(JSON.stringify(sim)), 'Expression state avoids inappropriate motor gene and universal genome claims');
      checkEqual(sim.expressedPanelGenes + sim.silencedPanelGenes, 6, 'expressed + silenced = 6');

      // Every single gene in panel must have presentInDna === true
      for (const g of sim.geneStates) {
        check(Object.isFrozen(g), 'gene state frozen');
        checkEqual(g.presentInDna, true, `${g.symbol} present in DNA`);
        if (g.category === 'housekeeping') {
          checkEqual(g.expressed, true, `housekeeping example ${g.symbol} ON in this panel`);
          check(g.mrnaCopiesPerCell > 0, 'housekeeping mRNA > 0');
        }
        if (g.expressed === false) {
          checkEqual(g.mrnaCopiesPerCell, 0, 'silenced gene makes 0 mRNA');
        }
      }

      // Check tissue-specific expression at Stage 4 with native TF switch (tf === 1)
      if (d === 4 && tf === 1) {
        const ins = sim.geneStates.find((g) => g.symbol === 'INS');
        const hbb = sim.geneStates.find((g) => g.symbol === 'HBB');
        const chat = sim.geneStates.find((g) => g.symbol === 'CHAT');
        const oct = sim.geneStates.find((g) => g.symbol === 'OCT4_SOX2');

        if (m === 0) {
          // Pancreatic Beta Cell
          checkEqual(ins.expressed, true, 'Beta cell expresses INS');
          checkEqual(hbb.expressed, false, 'Beta cell silences HBB');
          checkEqual(chat.expressed, false, 'Beta cell silences CHAT');
          checkEqual(oct.expressed, false, 'Beta cell silences OCT4/SOX2');
        } else if (m === 1) {
          // Bone-Marrow Erythroblast
          checkEqual(ins.expressed, false, 'Erythroblast silences INS');
          checkEqual(hbb.expressed, true, 'Erythroblast expresses HBB');
          checkEqual(chat.expressed, false, 'Erythroblast silences CHAT');
        } else if (m === 2) {
          // Spinal Motor Neurone
          checkEqual(ins.expressed, false, 'Motor neurone silences INS');
          checkEqual(hbb.expressed, false, 'Motor neurone silences HBB');
          checkEqual(chat.expressed, true, 'Motor-neurone panel expresses CHAT for acetylcholine synthesis');
        } else if (m === 3) {
          // Gurdon / Yamanaka Reprogramming
          checkEqual(oct.expressed, true, 'Reprogrammed iPSC expresses OCT4/SOX2');
        }
      }

      expressionTrials = captureExpressionTrial(
        { mode: m, differentiationStage: d, tfSwitch: tf },
        expressionTrials
      );
      check(Object.isFrozen(expressionTrials), 'expressionTrials frozen');
    }
  }
}

for (let i = 1; i < expressionTrials.length; i += 1) {
  const cmp = compareExpressionTrials(expressionTrials[i - 1], expressionTrials[i]);
  check(Object.isFrozen(cmp), 'compareExpressionTrials frozen');
  checkEqual(cmp.chromosomeDifference, 0, 'chosen comparison states retain the same model chromosome count');
  checkEqual(cmp.dnaRetainedDeltaPct, 0, 'dnaRetainedDeltaPct is 0');
}

check(GENE_PANEL.some(g=>g.category==='housekeeping'), 'Housekeeping examples retained');
const motorExample=GENE_PANEL.find(g=>g.symbol==='CHAT');
checkEqual(motorExample.chromosome,'Chromosome 10','CHAT example uses chromosome10');
check(/acetylcholine/i.test(motorExample.proteinProduct),'CHAT product supports acetylcholine synthesis');
check(!/channel/i.test(motorExample.proteinProduct),'CHAT is not a sodium channel');
check(!JSON.stringify(GENE_PANEL).includes('SCN9A'), 'Motor example does not use sensory-neurone SCN9A');
console.log(`ch12_domain.mjs: ${assertionCount} assertions passed with 0 failures.`);
