// Headless Node unit & oracle test suite for Chapter 15 domain model
// Run with: node source/tests/ch15_domain.mjs

import assert from 'node:assert/strict';
import {
  TROPHIC_MODES,
  TROPHIC_PRESETS,
  simulateTrophicEcosystem,
  captureTrophicTrial,
  compareTrophicTrials,
  NUTRIENT_MODES,
  NUTRIENT_PRESETS,
  simulateNutrientCyclesEutrophication,
  captureNutrientTrial,
  compareNutrientTrials,
  BIOTECH_MODES,
  BIOTECH_PRESETS,
  simulateBiotechFermenterPlasmid,
  captureBiotechTrial,
  compareBiotechTrials,
  clamp,
  roundTo,
} from '../live/biosphere_biotech_model.js';

let passed = 0;
function check(cond, msg) {
  assert.ok(cond, msg);
  passed++;
}

function checkEqual(actual, expected, msg) {
  assert.strictEqual(actual, expected, msg);
  passed++;
}

// 1. Utility checks
checkEqual(clamp(5, 0, 10), 5, 'clamp in range');
checkEqual(clamp(-3, 0, 10), 0, 'clamp below min');
checkEqual(clamp(15, 0, 10), 10, 'clamp above max');
checkEqual(clamp(NaN, 2, 8), 2, 'clamp NaN fallback');
checkEqual(roundTo(3.14159, 2), 3.14, 'roundTo 2 decimals');

// 2. Exhaustive sweep of Trophic Ecosystem model across all 4 modes
for (const mode of TROPHIC_MODES) {
  for (let eff = 5; eff <= 20; eff += 1) {
    for (let sec = 0; sec <= 100; sec += 5) {
      const sim = simulateTrophicEcosystem({
        mode,
        transferEffPct: eff,
        secondaryParam: sec,
      });
      checkEqual(sim.mode, mode, 'mode preserved');
      checkEqual(sim.transferEffPct, eff, 'transferEffPct preserved');
      check(typeof sim.summaryText === 'string' && sim.summaryText.length > 20, 'summaryText non-empty');
      check(!sim.summaryText.includes('!'), 'zero exclamation marks in summaryText');
      check(!sim.summaryText.includes('$'), 'zero raw LaTeX dollar signs in summaryText');

      if (mode === 'sgnp_web') {
        check(sim.levels.length === 5, '5 trophic levels modeled');
        // Energy strictly decreases at every trophic transfer (Second Law of Thermodynamics)
        for (let i = 1; i < 5; i++) {
          check(
            sim.levels[i].energyKj < sim.levels[i - 1].energyKj,
            `energy decreases from level ${i} to ${i + 1}`
          );
          check(
            sim.levels[i].biomassKg < sim.levels[i - 1].biomassKg,
            `biomass decreases from level ${i} to ${i + 1}`
          );
          const sumLoss = roundTo(
            sim.levels[i].respHeatKj + sim.levels[i].egestExcretKj + sim.levels[i].uneatenDetritusKj,
            2
          );
          check(
            Math.abs(sumLoss - sim.levels[i].lossTotalKj) <= 0.05,
            'inter-level loss partitions sum to total loss'
          );
        }
      } else if (mode === 'banyan_pyramid') {
        checkEqual(sim.pyramidNumbersInverted, true, 'banyan pyramid of numbers is inverted at base');
        checkEqual(sim.pyramidBiomassUpright, true, 'banyan pyramid of biomass is upright');
        checkEqual(sim.pyramidEnergyUpright, true, 'banyan pyramid of energy is upright');
        check(sim.levels[0].numbers < sim.levels[1].numbers, '1-3 banyan trees < thousands of primary consumers');
        check(sim.levels[0].biomassKg > sim.levels[1].biomassKg, 'banyan dry mass > herbivore dry mass');
        check(sim.levels[0].energyKj > sim.levels[1].energyKj, 'banyan energy > herbivore energy');
      } else if (mode === 'diet_efficiency') {
        check(sim.totalHumanAssimilatedKj > 0, 'positive human assimilated energy');
        check(sim.relativePeopleSupported >= 1.0, 'relative people supported >= 1.0x meat baseline');
        if (sec === 100 && eff === 10) {
          checkEqual(sim.relativePeopleSupported, 10, '100% plant diet supports 10x population vs 100% meat at 10% transfer');
        }
        if (sec === 0) {
          checkEqual(sim.relativePeopleSupported, 1, '0% plant diet equals 1x meat baseline');
        }
      } else if (mode === 'sigmoid_population') {
        check(sim.timePoints.length === 25, '25 time points across 0-48 h');
        const lagPt = sim.timePoints.find((p) => p.hour === 2);
        const expPt = sim.timePoints.find((p) => p.hour === 12);
        const statPt = sim.timePoints.find((p) => p.hour === 26);
        const deathPt = sim.timePoints.find((p) => p.hour === 46);
        check(lagPt.phase.includes('Lag'), 'Lag phase at t=2h');
        check(expPt.phase.includes('Exponential'), 'Exponential phase at t=12h');
        check(expPt.birthRate > expPt.deathRate, 'birth rate > death rate in exponential phase');
        check(statPt.phase.includes('Stationary'), 'Stationary phase at t=26h');
        checkEqual(statPt.birthRate, statPt.deathRate, 'birth rate == death rate in stationary phase');
        check(deathPt.phase.includes('Death'), 'Death phase at t=46h');
        check(deathPt.deathRate > deathPt.birthRate, 'death rate > birth rate in death phase');
        check(deathPt.population < statPt.population, 'population declines in death phase');
      }

      const trial = captureTrophicTrial({ mode, transferEffPct: eff, secondaryParam: sec });
      check(Number.isFinite(trial.metricPrimary), 'trial metricPrimary is finite');
      check(Number.isFinite(trial.metricSecondary), 'trial metricSecondary is finite');
    }
  }
}

// Check Trophic presets and comparison
for (const preset of Object.values(TROPHIC_PRESETS)) {
  const sim = simulateTrophicEcosystem(preset);
  checkEqual(sim.mode, preset.mode, `preset ${preset.id} mode matches`);
}
const trA = captureTrophicTrial(TROPHIC_PRESETS.direct_crop_diet);
const trB = captureTrophicTrial({ mode: 'diet_efficiency', transferEffPct: 10, secondaryParam: 0 });
const cmpTr = compareTrophicTrials(trA, trB);
check(cmpTr.deltaPrimary < 0, 'switching from 90% plant to 0% plant reduces human energy');

// 3. Exhaustive sweep of Nutrient Cycles & Eutrophication model across all 4 modes
for (const mode of NUTRIENT_MODES) {
  for (let p1 = 0; p1 <= 100; p1 += 10) {
    for (let p2 = 0; p2 <= 100; p2 += 10) {
      const sim = simulateNutrientCyclesEutrophication({
        mode,
        primaryLevel: p1,
        secondaryLevel: p2,
      });
      checkEqual(sim.mode, mode, 'nutrient mode preserved');
      check(typeof sim.summaryText === 'string' && sim.summaryText.length > 20, 'nutrient summaryText non-empty');
      check(!sim.summaryText.includes('!'), 'zero exclamation marks in nutrient summaryText');
      check(!sim.summaryText.includes('$'), 'zero dollar signs in nutrient summaryText');

      if (mode === 'nitrogen_legumes') {
        check(sim.rhizobiumFixationKgHa >= 0, 'non-negative Rhizobium fixation');
        check(sim.nitrificationFluxKgHa >= 0, 'non-negative nitrification flux');
        check(sim.denitrificationLossKgHa >= 0, 'non-negative denitrification loss');
        check(sim.soilNitrateMgKg >= 4, 'positive soil nitrate pool');
        check(sim.plantProteinYieldKgHa > 0, 'positive plant protein yield');
      } else if (mode === 'eutrophication_cascade') {
        checkEqual(sim.steps.length, 7, 'all 7 syllabus eutrophication cascade steps present');
        check(sim.dissolvedOxygenMgL >= 0.4 && sim.dissolvedOxygenMgL <= 8.6, 'DO within physical range');
        check(sim.fishSurvivalPct >= 0 && sim.fishSurvivalPct <= 100, 'fish survival within 0-100%');
      } else if (mode === 'carbon_keeling') {
        check(sim.atmosphericCo2Ppm >= 280 && sim.atmosphericCo2Ppm <= 520, 'CO2 ppm within historical/projected range');
        check(sim.methanePpb >= 720, 'CH4 ppb >= pre-industrial baseline');
        check(sim.tempAnomalyC >= 0, 'temperature anomaly non-negative');
      } else if (mode === 'deforestation_impact') {
        check(sim.biodiversityRetainedPct >= 4 && sim.biodiversityRetainedPct <= 100, 'biodiversity within 4-100%');
        check(sim.soilErosionTonsHa >= 0.8, 'soil erosion positive');
        check(sim.floodRunoffIndex >= 12 && sim.floodRunoffIndex <= 100, 'flood runoff index in bounds');
      }

      const trial = captureNutrientTrial({ mode, primaryLevel: p1, secondaryLevel: p2 });
      check(Number.isFinite(trial.headlineMetric), 'nutrient trial headlineMetric finite');
    }
  }
}

// Monotonicity checks on nitrogen cycle & eutrophication
const aerHigh = simulateNutrientCyclesEutrophication({ mode: 'nitrogen_legumes', primaryLevel: 80, secondaryLevel: 90 });
const aerLow = simulateNutrientCyclesEutrophication({ mode: 'nitrogen_legumes', primaryLevel: 80, secondaryLevel: 10 });
check(aerHigh.nitrificationFluxKgHa > aerLow.nitrificationFluxKgHa, 'aerobic soil increases nitrification');
check(aerLow.denitrificationLossKgHa > aerHigh.denitrificationLossKgHa, 'waterlogged anaerobic soil increases denitrification');

const eutLow = simulateNutrientCyclesEutrophication({ mode: 'eutrophication_cascade', primaryLevel: 10, secondaryLevel: 80 });
const eutHigh = simulateNutrientCyclesEutrophication({ mode: 'eutrophication_cascade', primaryLevel: 90, secondaryLevel: 15 });
check(eutHigh.surfaceAlgalBloomIdx > eutLow.surfaceAlgalBloomIdx, 'nitrate runoff increases algal bloom');
check(eutHigh.underwaterLightPct < eutLow.underwaterLightPct, 'algal bloom blocks underwater light');
check(eutHigh.aerobicBacteriaBodMgL > eutLow.aerobicBacteriaBodMgL, 'dead plants increase bacterial BOD');
check(eutHigh.dissolvedOxygenMgL < eutLow.dissolvedOxygenMgL, 'bacterial aerobic respiration depletes dissolved O2');
check(eutHigh.fishSurvivalPct < eutLow.fishSurvivalPct, 'hypoxia reduces fish survival');

// 4. Exhaustive sweep of Biotech, Fermenter, Recombinant Plasmid & CRISPR model across all 4 modes
for (const mode of BIOTECH_MODES) {
  for (let p1 = 0; p1 <= 100; p1 += 10) {
    for (let p2 = 0; p2 <= 100; p2 += 10) {
      const sim = simulateBiotechFermenterPlasmid({
        mode,
        primaryParam: p1,
        secondaryParam: p2,
      });
      checkEqual(sim.mode, mode, 'biotech mode preserved');
      check(typeof sim.summaryText === 'string' && sim.summaryText.length > 20, 'biotech summaryText non-empty');
      check(!sim.summaryText.includes('!'), 'zero exclamation marks in biotech summaryText');
      check(!sim.summaryText.includes('$'), 'zero dollar signs in biotech summaryText');

      if (mode === 'recombinant_insulin') {
        checkEqual(sim.pipelineSteps.length, 5, 'all 5 recombinant insulin pipeline steps present');
        if (p1 < 25) {
          checkEqual(sim.sameRestrictionEnzyme, false, 'mismatched restriction enzyme blocked');
          checkEqual(sim.humanInsulinYieldMgL, 0, 'zero insulin without matching sticky ends');
        } else {
          checkEqual(sim.sameRestrictionEnzyme, true, 'matching restriction enzyme active');
          check(sim.humanInsulinYieldMgL > 0, 'positive insulin yield with matching sticky ends and ligase');
        }
      } else if (mode === 'industrial_fermenter') {
        check(sim.productYieldGL >= 0, 'non-negative fermenter yield');
        check(sim.coolingHeatRemovedKw >= 18, 'positive cooling jacket heat removal');
      } else if (mode === 'yeast_enzyme_biotech') {
        check(sim.washStainRemovalPct >= 10 && sim.washStainRemovalPct <= 99, 'washing powder stain removal in bounds');
        check(sim.lactoseHydrolysedPct >= 5 && sim.lactoseHydrolysedPct <= 99.5, 'lactase hydrolysis in bounds');
      } else if (mode === 'gm_crops_crispr') {
        checkEqual(sim.comparisonRows.length, 3, '3 comparison dimensions between selective breeding, GM, and CRISPR');
        check(sim.btCropYieldTonsHa >= sim.conventionalYieldTonsHa, 'Bt cotton preserves higher yield under pest pressure');
      }

      const trial = captureBiotechTrial({ mode, primaryParam: p1, secondaryParam: p2 });
      check(Number.isFinite(trial.headlineMetric), 'biotech trial headlineMetric finite');
    }
  }
}

const fermOpt = simulateBiotechFermenterPlasmid(BIOTECH_PRESETS.fermenter_optimum_37c);
const fermHot = simulateBiotechFermenterPlasmid(BIOTECH_PRESETS.fermenter_overheated_55c);
check(fermOpt.productYieldGL > fermHot.productYieldGL * 3, 'optimum 37 °C fermenter vastly outperforms denatured 55 °C fermenter');
checkEqual(fermHot.denatured, true, '55 °C triggers enzyme denaturation');

const cmpBio = compareBiotechTrials(
  captureBiotechTrial(BIOTECH_PRESETS.fermenter_optimum_37c),
  captureBiotechTrial(BIOTECH_PRESETS.fermenter_overheated_55c)
);
check(cmpBio.deltaHeadline < 0, 'overheating reduces fermenter yield');

console.log(`ch15_domain.mjs: ${passed} assertions passed (0 failures)`);
