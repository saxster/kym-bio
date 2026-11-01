import assert from 'node:assert/strict';
import {
  VARIATION_MODES,
  VARIATION_TRAITS,
  MUTAGEN_ENVIRONMENT_STEPS,
  LEDERBERG_REPLICA_COLONIES,
  FOUR_VARIATION_SOURCES,
  SELECTION_MODES,
  SELECTION_PRESSURE_STEPS,
  SIX_STEPS_NATURAL_SELECTION,
  KETTLEWELL_FIELD_DATA,
  ALLISON_MALARIA_DATA,
  ADAPTATION_MODES,
  PLANT_ADAPTATION_PROFILES,
  SELECTIVE_BREEDING_LINEAGES,
  NATURAL_VS_ARTIFICIAL_TABLE,
  MOLECULAR_CLOCK_TAXA,
  simulateVariationMutation,
  captureVariationTrial,
  compareVariationTrials,
  simulateNaturalSelection,
  cultureSelectionAccount,
  sickleSelectionAccount,
  captureSelectionTrial,
  compareSelectionTrials,
  simulateAdaptiveSelective,
  captureAdaptationTrial,
  compareAdaptationTrials,
} from '../live/selection_model.js';

let assertions = 0;

function check(cond, msg) {
  assert.ok(cond, msg);
  assertions += 1;
}

function checkEqual(actual, expected, msg) {
  assert.strictEqual(actual, expected, msg);
  assertions += 1;
}

function checkCleanText(str, context) {
  check(typeof str === 'string' && str.length > 0, `${context}: non-empty string`);
  check(!str.includes('$'), `${context}: must not contain raw '$'`);
  check(!str.includes('\\text'), `${context}: must not contain raw '\\text'`);
  check(!str.includes('!'), `${context}: must not contain '!'`);
}

// 1. Frozen tables & historical / empirical constants
check(Object.isFrozen(VARIATION_MODES), 'VARIATION_MODES frozen');
check(Object.isFrozen(VARIATION_TRAITS), 'VARIATION_TRAITS frozen');
check(Object.isFrozen(MUTAGEN_ENVIRONMENT_STEPS), 'MUTAGEN_ENVIRONMENT_STEPS frozen');
check(Object.isFrozen(LEDERBERG_REPLICA_COLONIES), 'LEDERBERG_REPLICA_COLONIES frozen');
check(Object.isFrozen(FOUR_VARIATION_SOURCES), 'FOUR_VARIATION_SOURCES frozen');
check(Object.isFrozen(SELECTION_MODES), 'SELECTION_MODES frozen');
check(Object.isFrozen(SELECTION_PRESSURE_STEPS), 'SELECTION_PRESSURE_STEPS frozen');
check(Object.isFrozen(SIX_STEPS_NATURAL_SELECTION), 'SIX_STEPS_NATURAL_SELECTION frozen');
check(Object.isFrozen(KETTLEWELL_FIELD_DATA), 'KETTLEWELL_FIELD_DATA frozen');
check(Object.isFrozen(ALLISON_MALARIA_DATA), 'ALLISON_MALARIA_DATA frozen');
check(Object.isFrozen(ADAPTATION_MODES), 'ADAPTATION_MODES frozen');
check(Object.isFrozen(PLANT_ADAPTATION_PROFILES), 'PLANT_ADAPTATION_PROFILES frozen');
check(Object.isFrozen(SELECTIVE_BREEDING_LINEAGES), 'SELECTIVE_BREEDING_LINEAGES frozen');
check(Object.isFrozen(NATURAL_VS_ARTIFICIAL_TABLE), 'NATURAL_VS_ARTIFICIAL_TABLE frozen');
check(Object.isFrozen(MOLECULAR_CLOCK_TAXA), 'MOLECULAR_CLOCK_TAXA frozen');

checkEqual(VARIATION_MODES.length, 4, '4 variation modes');
checkEqual(VARIATION_TRAITS.length, 4, '4 variation traits');
checkEqual(MUTAGEN_ENVIRONMENT_STEPS.length, 4, '4 mutagen/environment steps');
checkEqual(LEDERBERG_REPLICA_COLONIES.length, 12, '12 colonies on Lederberg master plate');
checkEqual(FOUR_VARIATION_SOURCES.length, 4, '4 sources of genetic variation (0610 18.1.10)');
checkEqual(SELECTION_MODES.length, 4, '4 natural selection modes');
checkEqual(SELECTION_PRESSURE_STEPS.length, 4, '4 selection pressure steps');
checkEqual(SIX_STEPS_NATURAL_SELECTION.length, 6, '6 steps of natural selection (0610 18.3.1)');
checkEqual(ADAPTATION_MODES.length, 4, '4 adaptation & selective breeding modes');
checkEqual(PLANT_ADAPTATION_PROFILES.length, 4, '4 plant adaptation profiles');
checkEqual(SELECTIVE_BREEDING_LINEAGES.length, 4, '4 selective breeding lineages');
checkEqual(NATURAL_VS_ARTIFICIAL_TABLE.length, 4, '4 rows in natural vs artificial table');
checkEqual(MOLECULAR_CLOCK_TAXA.length, 5, '5 molecular clock taxa');

// Verify Four Sources of Genetic Variation (0610 18.1.10)
checkEqual(FOUR_VARIATION_SOURCES[0].source, 'Mutation', 'Source 1 is Mutation');
checkEqual(FOUR_VARIATION_SOURCES[0].createsNewAlleles, true, 'Only Mutation creates new alleles');
for (let i = 1; i < FOUR_VARIATION_SOURCES.length; i += 1) {
  checkEqual(
    FOUR_VARIATION_SOURCES[i].createsNewAlleles,
    false,
    `${FOUR_VARIATION_SOURCES[i].source} reshuffles existing alleles rather than creating new alleles`
  );
  checkCleanText(FOUR_VARIATION_SOURCES[i].role, `Variation source ${i} role`);
}

// Verify Lederberg 1952 replica-plating colony table
const resistantColonies = LEDERBERG_REPLICA_COLONIES.filter((c) => c.resistant);
checkEqual(resistantColonies.length, 3, '3 pre-existing resistant colonies (#3, #7, #11)');
checkEqual(resistantColonies.map((c) => c.id).join(','), '3,7,11', 'Exact resistant colony IDs');
for (const c of LEDERBERG_REPLICA_COLONIES) {
  check(Object.isFrozen(c), `Colony ${c.id} frozen`);
  check(c.x > 0.15 && c.x < 0.85, `Colony ${c.id} x inside plate`);
  check(c.y > 0.15 && c.y < 0.85, `Colony ${c.id} y inside plate`);
  checkCleanText(c.genotype, `Colony ${c.id} genotype`);
}

// Verify Kettlewell 1953–1955 & Grants 1977 & Allison 1954 primary data
checkEqual(KETTLEWELL_FIELD_DATA.birminghamPolluted1953.releasedDark, 447, 'Kettlewell 1953 releasedDark = 447');
checkEqual(KETTLEWELL_FIELD_DATA.birminghamPolluted1953.recapturedDark, 123, 'Kettlewell 1953 recapturedDark = 123');
checkEqual(KETTLEWELL_FIELD_DATA.birminghamPolluted1953.releasedPale, 137, 'Kettlewell 1953 releasedPale = 137');
checkEqual(KETTLEWELL_FIELD_DATA.birminghamPolluted1953.recapturedPale, 18, 'Kettlewell 1953 recapturedPale = 18');
checkEqual(KETTLEWELL_FIELD_DATA.dorsetUnpolluted1955.releasedDark, 406, 'Kettlewell 1955 Dorset releasedDark = 406');
checkEqual(KETTLEWELL_FIELD_DATA.dorsetUnpolluted1955.recapturedDark, 30, 'Kettlewell 1955 Dorset recapturedDark = 30');
checkEqual(KETTLEWELL_FIELD_DATA.dorsetUnpolluted1955.releasedPale, 393, 'Kettlewell 1955 Dorset releasedPale = 393');
checkEqual(KETTLEWELL_FIELD_DATA.dorsetUnpolluted1955.recapturedPale, 62, 'Kettlewell 1955 Dorset recapturedPale = 62');
checkEqual(KETTLEWELL_FIELD_DATA.grantsFinches1977.preDroughtBeakDepthMm, 9.42, 'Grant 1977 pre-drought beak = 9.42 mm');
checkEqual(KETTLEWELL_FIELD_DATA.grantsFinches1977.survivorBeakDepthMm, 9.96, 'Grant 1977 survivor beak = 9.96 mm');
checkEqual(ALLISON_MALARIA_DATA.ugandaChildren1954.totalChildren, 290, 'Allison 1954 290 Ganda children');
checkEqual(ALLISON_MALARIA_DATA.ugandaChildren1954.hbAA_infectedPct, 45.7, 'Allison 1954 HbAA 45.7% infected');
checkEqual(ALLISON_MALARIA_DATA.ugandaChildren1954.hbAS_infectedPct, 27.9, 'Allison 1954 HbAS 27.9% infected');

// 2. Exhaustive Widget 1 Sweep: Continuous vs Discontinuous Variation & Mutagens
for (let modeIndex = 0; modeIndex < VARIATION_MODES.length; modeIndex += 1) {
  checkCleanText(VARIATION_MODES[modeIndex].label, `Variation mode ${modeIndex} label`);
  checkCleanText(VARIATION_MODES[modeIndex].summary, `Variation mode ${modeIndex} summary`);
  for (let traitStep = 1; traitStep <= VARIATION_TRAITS.length; traitStep += 1) {
    let prevMean = null;
    let prevMutRate = 0;
    for (let envStep = 1; envStep <= MUTAGEN_ENVIRONMENT_STEPS.length; envStep += 1) {
      const sim = simulateVariationMutation({ modeIndex, traitStep, envStep });
      check(Object.isFrozen(sim), 'Variation sim frozen');
      check(Object.isFrozen(sim.bins), 'Variation bins frozen');
      checkCleanText(sim.readout, `Variation readout m=${modeIndex} t=${traitStep} e=${envStep}`);

      if (traitStep <= 2) {
        checkEqual(sim.isContinuous, true, 'Trait 1 & 2 are continuous');
        checkEqual(sim.graphType, 'histogram_touching_bars', 'Continuous uses histogram with touching bars');
        checkEqual(sim.causedBy, 'Both genes and environment', 'Continuous caused by both genes and environment');
        checkEqual(sim.hasIntermediates, true, 'Continuous has intermediates');
        checkEqual(sim.bins.length, 7, 'Continuous has 7 touching bins');
        if (prevMean !== null) {
          check(sim.computedMean > prevMean, 'Environmental nutrition increases continuous trait mean');
        }
        prevMean = sim.computedMean;
      } else {
        checkEqual(sim.isContinuous, false, 'Trait 3 & 4 are discontinuous');
        checkEqual(sim.graphType, 'bar_chart_separated_bars', 'Discontinuous uses bar chart with separated bars');
        checkEqual(sim.causedBy, 'Genes alone', 'Discontinuous caused by genes alone');
        checkEqual(sim.hasIntermediates, false, 'Discontinuous has no intermediates');
        checkEqual(sim.environmentalShift, 0, 'Discontinuous has 0 environmental shift');
        if (traitStep === 3) {
          checkEqual(sim.bins.map((b) => b.pct).join(','), '34,33,24,9', 'ABO percentages invariant at 34,33,24,9');
        } else {
          checkEqual(sim.bins.map((b) => b.pct).join(','), '74.74,25.26', 'Pea seed shape percentages invariant');
        }
      }

      // Mutagen rate increases monotonically with envStep
      check(sim.mutagenStats.ratePerBp > prevMutRate, 'Mutagen rate increases monotonically');
      checkEqual(sim.mutagenStats.isRandom, true, 'Mutation is always random');
      checkEqual(sim.replicaPlating.preExistingBeforeAntibiotic, true, 'Mutants pre-exist before antibiotic');
      checkEqual(sim.replicaPlating.inducedByAntibiotic, false, 'Mutants not induced by antibiotic');
      prevMutRate = sim.mutagenStats.ratePerBp;

      const cap = captureVariationTrial(sim);
      check(Object.isFrozen(cap), 'Captured variation trial frozen');
      checkCleanText(cap.summaryTag, 'Captured variation summaryTag');
    }
  }
}

const varCap1 = captureVariationTrial(simulateVariationMutation({ modeIndex: 0, traitStep: 1, envStep: 1 }));
const varCap2 = captureVariationTrial(simulateVariationMutation({ modeIndex: 0, traitStep: 3, envStep: 1 }));
const varCmp = compareVariationTrials(varCap1, varCap2);
checkEqual(varCmp.contrasting, true, 'Height vs ABO is contrasting');
checkCleanText(varCmp.summary, 'Variation comparison summary');
checkEqual(compareVariationTrials(varCap1, varCap1).contrasting, false, 'Identical variation trial not contrasting');

// 3. Exhaustive Widget 2 Sweep: Natural Selection, Antibiotic Resistance, Peppered Moths & Malaria HbS
for (let modeIndex = 0; modeIndex < SELECTION_MODES.length; modeIndex += 1) {
  checkCleanText(SELECTION_MODES[modeIndex].label, `Selection mode ${modeIndex} label`);
  checkCleanText(SELECTION_MODES[modeIndex].summary, `Selection mode ${modeIndex} summary`);
  for (let pressureStep = 1; pressureStep <= SELECTION_PRESSURE_STEPS.length; pressureStep += 1) {
    for (let generationStep = 0; generationStep <= 10; generationStep += 1) {
      const sim = simulateNaturalSelection({ modeIndex, pressureStep, generationStep });
      check(Object.isFrozen(sim), 'Selection sim frozen');
      checkCleanText(sim.readout, `Selection readout m=${modeIndex} p=${pressureStep} g=${generationStep}`);
      checkEqual(sim.sixSteps.length, 6, '6 natural selection steps attached');

      if (modeIndex <= 1) {
        check(sim.modelOnly, 'Culture numbers explicitly identify a teaching model');
        checkEqual(sim.timeLabel, `Step ${generationStep}`, 'No clinical day labels');
        check(sim.totalCount > 0, 'Culture model does not promise clinical eradication');
        checkEqual(sim.infectionCleared, false, 'No clinical cure claim');
        checkEqual(sim.relapseOccurred, false, 'No clinical relapse forecast');
        check(!/course|infection 100% cleared|superbug relapse/i.test(sim.readout), 'Readout makes no course completion guarantee');
      }
      if (modeIndex === 2) {
        checkEqual(
          Number((sim.darkCarbonariaPct + sim.paleTypicaPct).toFixed(1)),
          100.0,
          'Peppered moth percentages sum to 100%'
        );
        if (pressureStep >= 3 && generationStep === 10) {
          check(sim.darkCarbonariaPct > 90.0, 'Dark carbonaria exceeds 90% in industrial soot at Gen 50');
        }
        if (pressureStep === 1 && generationStep === 10) {
          check(sim.paleTypicaPct > 92.0, 'Pale typica exceeds 92% on clean lichen bark at Gen 50');
        }
      }
      if (modeIndex === 3) {
        checkEqual(
          Number((sim.hbsAllelePct + sim.hbaAllelePct).toFixed(1)),
          100.0,
          'HbS + HbA allele percentages sum to 100%'
        );
        if (pressureStep === 1 && generationStep === 10) {
          check(sim.hbsAllelePct < 5.0, 'Malaria-free environment selects against HbS (<5% by Gen 20)');
        }
        if (pressureStep >= 3 && generationStep === 10) {
          check(
            sim.hbsAllelePct >= 15.0 && sim.hbsAllelePct <= 20.1,
            'Malaria belt stabilises HbS allele at 14–16% via heterozygote advantage'
          );
        }
      }

      const cap = captureSelectionTrial(sim);
      check(Object.isFrozen(cap), 'Selection capture frozen');
      checkCleanText(cap.summaryTag, 'Selection capture summaryTag');
    }
  }
}

const selCap1 = captureSelectionTrial(simulateNaturalSelection({ modeIndex: 0, pressureStep: 3, generationStep: 7 }));
const selCap2 = captureSelectionTrial(simulateNaturalSelection({ modeIndex: 1, pressureStep: 3, generationStep: 7 }));
const selCmp = compareSelectionTrials(selCap1, selCap2);
checkEqual(selCmp.contrasting, true, 'Continuous exposure vs drug removal is contrasting');
checkCleanText(selCmp.summary, 'Selection comparison summary');
checkEqual(compareSelectionTrials(selCap1, selCap1).contrasting, false, 'Identical selection trial not contrasting');

// 4. Exhaustive Widget 3 Sweep: Xerophytes, Hydrophytes, Selective Breeding & DNA Clocks
for (let modeIndex = 0; modeIndex < ADAPTATION_MODES.length; modeIndex += 1) {
  checkCleanText(ADAPTATION_MODES[modeIndex].label, `Adaptation mode ${modeIndex} label`);
  checkCleanText(ADAPTATION_MODES[modeIndex].summary, `Adaptation mode ${modeIndex} summary`);
  for (let stressOrGenStep = 1; stressOrGenStep <= 5; stressOrGenStep += 1) {
    for (let profileStep = 1; profileStep <= 4; profileStep += 1) {
      const sim = simulateAdaptiveSelective({ modeIndex, stressOrGenStep, profileStep });
      check(Object.isFrozen(sim), 'Adaptation sim frozen');
      checkCleanText(sim.readout, `Adaptation readout m=${modeIndex} s=${stressOrGenStep} p=${profileStep}`);

      if (modeIndex === 0 || modeIndex === 1) {
        if (profileStep <= 2) {
          check(sim.waterSavedPct >= 85.0, 'Xerophytes save >=85% transpiration water vs mesophyte');
          check(sim.leafTurgorPct >= 85.0, 'Xerophytes maintain >=85% leaf turgor in arid wind');
        } else {
          check(sim.profile.aerenchymaPct >= 55.0, 'Hydrophytes have >=55% aerenchyma air space volume');
          check(sim.rootO2InMudPct >= 90.0, 'Hydrophyte aerenchyma delivers >=90% O2 saturation to roots in anoxic mud');
        }
      }
      if (modeIndex === 2) {
        check(sim.currentValue >= sim.baselineValue, 'Selective breeding increases desirable trait over generations');
        if (stressOrGenStep > 1) {
          check(sim.pctGain > 0, 'Positive percentage gain after selective breeding');
          check(
            sim.heterozygosity < sim.lineage.heterozygosityValues[0],
            'Selective breeding reduces genetic heterozygosity over generations'
          );
        }
      }
      if (modeIndex === 3) {
        const tx = sim.taxon;
        const different = [...tx.referenceSequence].filter((base, idx) => base !== tx.sequence[idx]).length;
        checkEqual(tx.referenceSequence.length, 200, 'Synthetic reference has stated 200 aligned bases');
        checkEqual(tx.sequence.length, 200, 'Comparison has same alignment length');
        checkEqual(tx.alignedDnaSimilarityPct, 100*(200-different)/200, 'Displayed identity counted from actual alignment');
        check(tx.modelOnly, 'Synthetic species identified as illustrative');
        check(!('divergenceMa' in tx), 'Similarity does not invent a divergence date');
      }

      const cap = captureAdaptationTrial(sim);
      check(Object.isFrozen(cap), 'Adaptation capture frozen');
      checkCleanText(cap.summaryTag, 'Adaptation capture summaryTag');
    }
  }
}

// Model checks derived independently from the biological accounting.
const start = cultureSelectionAccount({steps: 0});
checkEqual(start.total, 1000, 'Culture starts with 990+10 cells');
const one = cultureSelectionAccount({steps: 1, pressure: 1});
// 99 susceptible and 9 resistant survive, leaving capacity 892; growth factors 1.892 / 1.8028.
check(Math.abs(one.susceptible - 99*1.892) < 1e-9, 'Differential survival precedes density-limited reproduction');
check(Math.abs(one.resistant - 9*1.8028) < 1e-9, 'Resistance cost applies during reproduction');
check(one.resistantPct > 1, 'Resistant fraction can rise under selection without a new mutation');
for (let n=0; n<=3; n++) {
 const continuous = cultureSelectionAccount({steps:n,pressure:.8});
 const removed = cultureSelectionAccount({steps:n,pressure:.8,removeAfter:3});
 checkEqual(continuous.total, removed.total, 'Exposure histories identical through step 3');
}
check(cultureSelectionAccount({steps:10,pressure:.8}).resistantPct > cultureSelectionAccount({steps:10,pressure:.8,removeAfter:3}).resistantPct, 'Removing pressure does not guarantee increased resistance');
checkEqual(cultureSelectionAccount({steps:10,pressure:0}).resistantPct, 1, 'At carrying capacity with no selection initial composition persists');
check(Math.abs(sickleSelectionAccount(.158,20,0).q-.04536554025736232) < 1e-12, 'Twenty malaria-free generations reproduce independently calculated recessive-selection result');
check(Math.abs(sickleSelectionAccount(.158,1,0).q-(.842*.158+.2*.158*.158)/(1-.8*.158*.158)) < 1e-12, 'One-generation allele accounting is correct');
const equilibrium=.15/.95;
check(Math.abs(sickleSelectionAccount(equilibrium,20,.15).q-equilibrium) < 1e-12, 'Heterozygote-advantage equilibrium is stable under recurrence');
checkEqual(sickleSelectionAccount(0,20,0).q,0,'Absent HbS is not recreated when mutation is excluded');
checkEqual(sickleSelectionAccount(1,20,0).q,1,'Selection cannot restore an absent allele');

const adCap1 = captureAdaptationTrial(simulateAdaptiveSelective({ modeIndex: 0, stressOrGenStep: 5, profileStep: 1 }));
const adCap2 = captureAdaptationTrial(simulateAdaptiveSelective({ modeIndex: 1, stressOrGenStep: 5, profileStep: 3 }));
const adCmp = compareAdaptationTrials(adCap1, adCap2);
checkEqual(adCmp.contrasting, true, 'Xerophyte vs Hydrophyte is contrasting');
checkCleanText(adCmp.summary, 'Adaptation comparison summary');
checkEqual(compareAdaptationTrials(adCap1, adCap1).contrasting, false, 'Identical adaptation trial not contrasting');

// 5. Defensive clamping against NaN, Infinity, negative, and out-of-range inputs
for (const bad of [NaN, Infinity, -Infinity, -99, 999, undefined, null, 'invalid']) {
  const v = simulateVariationMutation({ modeIndex: bad, traitStep: bad, envStep: bad });
  check(Object.isFrozen(v) && v.bins.length > 0, 'Variation handles non-finite inputs safely');
  const s = simulateNaturalSelection({ modeIndex: bad, pressureStep: bad, generationStep: bad });
  check(Object.isFrozen(s) && s.sixSteps.length === 6, 'Selection handles non-finite inputs safely');
  const a = simulateAdaptiveSelective({ modeIndex: bad, stressOrGenStep: bad, profileStep: bad });
  check(Object.isFrozen(a) && typeof a.readout === 'string', 'Adaptation handles non-finite inputs safely');
}

// Construct the real Atlas scene with its real THREE/bio_kit implementation.
// This catches API/geometry failures that pure population calculations cannot detect.
const { CHAPTER: atlasChapter } = await import('../live/atlas/biology/ch14-evolution-selection/chapter.js');
const { THREE } = await import('../live/atlas/engine/bio_kit.js');
const atlasScene = new THREE.Scene();
const atlasWorld = atlasChapter.buildWorld({ scene: atlasScene, asm: (id, parent) => {
  const group = new THREE.Group(); group.name = id; parent.add(group); return group;
} });
check(typeof atlasWorld.update === 'function', 'Real Atlas scene constructs without missing imports or invalid primitive APIs');
for (const antibioticDose of [0, 50, 100]) for (const malariaPressure of [0, 15, 35]) {
  atlasChapter.params = { antibioticDose, malariaPressure };
  atlasWorld.update(atlasChapter.state(0, true));
  atlasScene.updateMatrixWorld(true);
  let meshCount = 0, instances = [];
  atlasScene.traverse(object => {
    check(object.matrixWorld.elements.every(Number.isFinite), 'Atlas world transforms stay finite at pressure extremes');
    if (object.geometry) {
      meshCount++;
      for (const attribute of Object.values(object.geometry.attributes))
        check(attribute.array.every(Number.isFinite), 'Actual Atlas geometry attributes stay finite');
    }
    if (object.isInstancedMesh) {
      check(object.instanceMatrix.array.every(Number.isFinite), 'Particle instance transforms stay finite');
      instances.push(object.count);
    }
  });
  check(meshCount > 20, 'Scene contains populated geometry rather than a fallback placeholder');
  check(instances.includes(Math.round(990*(1-.9*antibioticDose/100))), 'Susceptible particle count reflects the stated survival model');
  check(instances.includes(Math.round(10*(1-.1*antibioticDose/100))), 'Resistant particle count reflects the stated survival model');
}
atlasChapter.params = undefined;
atlasScene.traverse(object => { object.geometry?.dispose(); if(Array.isArray(object.material))object.material.forEach(m=>m.dispose()); else object.material?.dispose(); });

console.log(`PASS: ch14_domain.mjs verified ${assertions} assertions with 0 failures.`);
