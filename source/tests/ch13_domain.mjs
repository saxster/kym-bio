import assert from 'node:assert/strict';
import { mendelCrossAccount, aboPhenotypeAccount } from '../live/atlas/biology/ch13-mendel-inheritance/model.js';
import {
  MENDEL_CROSS_MODES,
  MENDEL_SEVEN_TRAITS,
  MENDEL_TRAIT_LOCI,
  MENDEL_COMBINED_LEDGER,
  MENDEL_SAMPLE_STEPS,
  ABO_GENOTYPES,
  ABO_CROSS_MODES,
  PEDIGREE_DETECTIVE_RULES,
  SEX_LINKED_MODES,
  SEX_LINKED_TRAITS,
  simulateMendelPunnett,
  captureMendelTrial,
  compareMendelTrials,
  simulateAboCodominancePedigree,
  captureAboTrial,
  compareAboTrials,
  simulateSexLinkedCross,
  captureSexLinkedTrial,
  compareSexLinkedTrials,
} from '../live/inheritance_model.js';

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

// 1. Constant tables & historical Brno ledger verification
check(Object.isFrozen(MENDEL_CROSS_MODES), 'MENDEL_CROSS_MODES frozen');
check(Object.isFrozen(MENDEL_SEVEN_TRAITS), 'MENDEL_SEVEN_TRAITS frozen');
check(Object.isFrozen(MENDEL_TRAIT_LOCI), 'MENDEL_TRAIT_LOCI frozen');
check(Object.isFrozen(MENDEL_COMBINED_LEDGER), 'MENDEL_COMBINED_LEDGER frozen');
check(Object.isFrozen(MENDEL_SAMPLE_STEPS), 'MENDEL_SAMPLE_STEPS frozen');
check(Object.isFrozen(ABO_GENOTYPES), 'ABO_GENOTYPES frozen');
check(Object.isFrozen(ABO_CROSS_MODES), 'ABO_CROSS_MODES frozen');
check(Object.isFrozen(PEDIGREE_DETECTIVE_RULES), 'PEDIGREE_DETECTIVE_RULES frozen');
check(Object.isFrozen(SEX_LINKED_MODES), 'SEX_LINKED_MODES frozen');
check(Object.isFrozen(SEX_LINKED_TRAITS), 'SEX_LINKED_TRAITS frozen');

checkEqual(MENDEL_CROSS_MODES.length, 4, '4 Mendel cross modes');
checkEqual(MENDEL_SEVEN_TRAITS.length, 7, '7 Mendel traits in 1866 ledger');
checkEqual(MENDEL_TRAIT_LOCI.length, 4, '4 primary interactive Mendel trait loci');
checkEqual(MENDEL_SAMPLE_STEPS.length, 4, '4 Mendel sample size steps');
checkEqual(ABO_GENOTYPES.length, 6, '6 diploid ABO genotypes');
checkEqual(ABO_CROSS_MODES.length, 4, '4 ABO cross modes');
checkEqual(PEDIGREE_DETECTIVE_RULES.length, 2, '2 pedigree detective rules');
checkEqual(SEX_LINKED_MODES.length, 4, '4 sex-linked modes');
checkEqual(SEX_LINKED_TRAITS.length, 3, '3 sex-linked traits');

let sumDom = 0;
let sumRec = 0;
for (const t of MENDEL_SEVEN_TRAITS) {
  check(Object.isFrozen(t), `Trait ${t.id} frozen`);
  checkEqual(t.mendelDominantCount + t.mendelRecessiveCount, t.mendelTotal, `Trait ${t.id} total sum`);
  const ratio = Number((t.mendelDominantCount / t.mendelRecessiveCount).toFixed(2));
  checkEqual(t.mendelRatio, ratio, `Trait ${t.id} ratio`);
  check(t.mendelRatio >= 2.82 && t.mendelRatio <= 3.15, `Trait ${t.id} ratio in [2.82, 3.15]`);
  checkEqual(t.f3TrueBreedingDominant + t.f3SegregatingHybrid, t.f3ProgenyTested, `Trait ${t.id} F3 sum`);
  checkCleanText(t.character, `Trait ${t.id} character`);
  checkCleanText(t.dominantTrait, `Trait ${t.id} dominantTrait`);
  checkCleanText(t.recessiveTrait, `Trait ${t.id} recessiveTrait`);
  checkCleanText(t.enzymeName, `Trait ${t.id} enzymeName`);
  checkCleanText(t.geneMechanism, `Trait ${t.id} geneMechanism`);
  checkCleanText(t.heterozygoteNote, `Trait ${t.id} heterozygoteNote`);
  sumDom += t.mendelDominantCount;
  sumRec += t.mendelRecessiveCount;
}

checkEqual(sumDom, 14949, 'Mendel combined dominant count = 14,949');
checkEqual(sumRec, 5010, 'Mendel combined recessive count = 5,010');
checkEqual(sumDom + sumRec, 19959, 'Mendel grand total = 19,959');
checkEqual(MENDEL_COMBINED_LEDGER.dominantTotal, 14949, 'Ledger dominantTotal');
checkEqual(MENDEL_COMBINED_LEDGER.recessiveTotal, 5010, 'Ledger recessiveTotal');
checkEqual(MENDEL_COMBINED_LEDGER.grandTotal, 19959, 'Ledger grandTotal');
checkEqual(MENDEL_COMBINED_LEDGER.combinedRatio, 2.98, 'Ledger combinedRatio = 2.98');
checkEqual(MENDEL_COMBINED_LEDGER.f3RoundSeedsTested, 565, 'F3 565 round seeds tested');
checkEqual(MENDEL_COMBINED_LEDGER.f3TrueBreedingRR, 193, 'F3 193 true-breeding RR');
checkEqual(MENDEL_COMBINED_LEDGER.f3SegregatingRr, 372, 'F3 372 segregating Rr');

// 2. Exhaustive Mendel Punnett & Sample Convergence Sweep
for (let modeIndex = 0; modeIndex < MENDEL_CROSS_MODES.length; modeIndex += 1) {
  checkCleanText(MENDEL_CROSS_MODES[modeIndex].label, `Mendel mode ${modeIndex} label`);
  checkCleanText(MENDEL_CROSS_MODES[modeIndex].summary, `Mendel mode ${modeIndex} summary`);
  for (let traitStep = 1; traitStep <= MENDEL_SEVEN_TRAITS.length; traitStep += 1) {
    for (let sampleStep = 1; sampleStep <= MENDEL_SAMPLE_STEPS.length; sampleStep += 1) {
      for (let matStep = 1; matStep <= 3; matStep += 1) {
        for (let patStep = 1; patStep <= 3; patStep += 1) {
          const res = simulateMendelPunnett({
            modeIndex,
            traitStep,
            sampleStep,
            maternalGenotypeStep: matStep,
            paternalGenotypeStep: patStep,
          });
          check(Object.isFrozen(res), 'Mendel result frozen');
          check(Object.isFrozen(res.punnettCells), 'Mendel punnettCells frozen');
          check(Object.isFrozen(res.empirical), 'Mendel empirical frozen');
          checkEqual(res.punnettCells.length, 4, '4 Punnett cells');
          checkEqual(res.dominantSquares + res.recessiveSquares, 4, '4 total squares');
          checkEqual(
            res.canonicalCounts.RR + res.canonicalCounts.Rr + res.canonicalCounts.rr,
            4,
            'Canonical genotype counts sum to 4'
          );
          checkEqual(
            res.theoreticalDominantPct + res.theoreticalRecessivePct,
            100,
            'Theoretical phenotype percentages sum to 100%'
          );
          checkEqual(
            res.theoreticalHomoDomPct + res.theoreticalHeteroPct + res.theoreticalHomoRecPct,
            100,
            'Theoretical genotype percentages sum to 100%'
          );
          checkEqual(
            res.empirical.dominantCount + res.empirical.recessiveCount,
            res.empirical.sampleSize,
            'Empirical dominant + recessive counts sum to sampleSize'
          );

          // Check canonical cross rules
          if (matStep === 2 && patStep === 2) {
            checkEqual(res.canonicalCounts.RR, 1, 'Rr x Rr -> 1 RR');
            checkEqual(res.canonicalCounts.Rr, 2, 'Rr x Rr -> 2 Rr');
            checkEqual(res.canonicalCounts.rr, 1, 'Rr x Rr -> 1 rr');
            checkEqual(res.theoreticalDominantPct, 75, 'Rr x Rr -> 75% dominant');
            checkEqual(res.theoreticalRecessivePct, 25, 'Rr x Rr -> 25% recessive');
            checkEqual(res.theoreticalPhenotypeRatio, '3 : 1', 'Rr x Rr -> 3 : 1');
          } else if ((matStep === 2 && patStep === 3) || (matStep === 3 && patStep === 2)) {
            checkEqual(res.canonicalCounts.RR, 0, 'Rr x rr -> 0 RR');
            checkEqual(res.canonicalCounts.Rr, 2, 'Rr x rr -> 2 Rr');
            checkEqual(res.canonicalCounts.rr, 2, 'Rr x rr -> 2 rr');
            checkEqual(res.theoreticalDominantPct, 50, 'Rr x rr -> 50% dominant');
            checkEqual(res.theoreticalRecessivePct, 50, 'Rr x rr -> 50% recessive');
            checkEqual(res.theoreticalPhenotypeRatio, '1 : 1', 'Rr x rr -> 1 : 1');
          } else if ((matStep === 1 && patStep === 3) || (matStep === 3 && patStep === 1)) {
            checkEqual(res.canonicalCounts.RR, 0, 'RR x rr -> 0 RR');
            checkEqual(res.canonicalCounts.Rr, 4, 'RR x rr -> 4 Rr');
            checkEqual(res.canonicalCounts.rr, 0, 'RR x rr -> 0 rr');
            checkEqual(res.theoreticalDominantPct, 100, 'RR x rr -> 100% dominant');
          } else if (matStep === 3 && patStep === 3) {
            checkEqual(res.canonicalCounts.rr, 4, 'rr x rr -> 4 rr');
            checkEqual(res.theoreticalRecessivePct, 100, 'rr x rr -> 100% recessive');
          } else if (matStep === 1 && patStep === 1) {
            checkEqual(res.canonicalCounts.RR, 4, 'RR x RR -> 4 RR');
            checkEqual(res.theoreticalDominantPct, 100, 'RR x RR -> 100% dominant');
          }

          for (const cell of res.punnettCells) {
            check(Object.isFrozen(cell), 'Punnett cell frozen');
            checkEqual(cell.probabilityPct, 25, 'Each cell is 25%');
            if (cell.canonical === 'RR') checkEqual(cell.workingAlleleCopies, 2, 'RR has two working dominant allele copies');
            if (cell.canonical === 'Rr') checkEqual(cell.workingAlleleCopies, 1, 'Rr has one working dominant allele copy');
            if (cell.canonical === 'rr') checkEqual(cell.workingAlleleCopies, 0, 'rr has no working dominant allele copy');
            check(!('enzymeDosePct' in cell), 'Allele count does not assert an enzyme concentration');
          }

          const cap = captureMendelTrial(res);
          check(Object.isFrozen(cap), 'Captured Mendel trial frozen');
          checkCleanText(cap.crossCode, 'Captured Mendel crossCode');
        }
      }
    }
  }
}

// Compare explicitly labelled preset examples and historical measurements, not a guarantee for every random run.
const mSmall = simulateMendelPunnett({ modeIndex: 0, traitStep: 1, sampleStep: 1 });
const mMed = simulateMendelPunnett({ modeIndex: 0, traitStep: 1, sampleStep: 2 });
const mLarge = simulateMendelPunnett({ modeIndex: 0, traitStep: 1, sampleStep: 3 });
const mBrno = simulateMendelPunnett({ modeIndex: 0, traitStep: 1, sampleStep: 4 });
check(
  Math.abs(mSmall.empirical.dominantPct - 75) > Math.abs(mLarge.empirical.dominantPct - 75),
  'The chosen illustrative N=400 example lies closer than the chosen N=16 example'
);
checkEqual(mSmall.empirical.sampleKind, 'illustrative', 'Small preset is labelled illustrative, not an observation');
checkEqual(mBrno.empirical.sampleKind, 'historical', 'Brno counts are labelled historical');
checkEqual(simulateMendelPunnett({modeIndex:1,sampleStep:4}).empirical.sampleKind, 'theoretical', 'Non-historical expected test-cross counts are labelled theoretical');
check(MENDEL_SEVEN_TRAITS.find(t=>t.id==='stem_height').geneMechanism.includes('does not eliminate'), 'Dwarfing allele retains reduced activity');
check(mendelCrossAccount('f1_self',64).stdError < mendelCrossAccount('f1_self',16).stdError, 'Larger independent samples reduce standard error, without forcing realised counts');
check(!mendelCrossAccount('test_homo').ratioLabel.includes('verified'), 'Known-parent grid does not claim finite offspring prove genotype');
checkEqual(aboPhenotypeAccount('IA','IB').antibodies, 'No anti-A or anti-B', 'AB antibody readout makes no reversed plasma-recipient claim');
checkEqual(aboPhenotypeAccount('IA','i').genotype, 'I^A I^O', 'Atlas uses consistent ABO allele notation');
checkEqual(mBrno.empirical.dominantCount, 5474, 'Seed shape Brno dominant = 5,474');
checkEqual(mBrno.empirical.recessiveCount, 1850, 'Seed shape Brno recessive = 1,850');
const mCmp = compareMendelTrials(mSmall, mBrno);
check(Object.isFrozen(mCmp), 'Mendel comparison frozen');
checkCleanText(mCmp.summary, 'Mendel comparison summary clean');

// 3. Exhaustive ABO Codominance & Pedigree Sweep
for (const g of ABO_GENOTYPES) {
  check(Object.isFrozen(g), `ABO genotype ${g.code} frozen`);
  checkCleanText(g.code, `ABO genotype ${g.code} code`);
  checkCleanText(g.bloodGroup, `ABO genotype ${g.code} bloodGroup`);
  checkCleanText(g.surfaceAntigens, `ABO genotype ${g.code} surfaceAntigens`);
  checkCleanText(g.plasmaAntibodies, `ABO genotype ${g.code} plasmaAntibodies`);
  checkCleanText(g.enzymeState, `ABO genotype ${g.code} enzymeState`);
  checkCleanText(g.inheritancePattern, `ABO genotype ${g.code} inheritancePattern`);
}

for (const rule of PEDIGREE_DETECTIVE_RULES) {
  check(Object.isFrozen(rule), `Pedigree rule ${rule.ruleNumber} frozen`);
  checkCleanText(rule.title, `Pedigree rule ${rule.ruleNumber} title`);
  checkCleanText(rule.deduction, `Pedigree rule ${rule.ruleNumber} deduction`);
  checkCleanText(rule.whyOtherFails, `Pedigree rule ${rule.ruleNumber} whyOtherFails`);
  checkCleanText(rule.siblingProbabilities, `Pedigree rule ${rule.ruleNumber} siblingProbabilities`);
}

for (let modeIndex = 0; modeIndex < ABO_CROSS_MODES.length; modeIndex += 1) {
  checkCleanText(ABO_CROSS_MODES[modeIndex].label, `ABO mode ${modeIndex} label`);
  checkCleanText(ABO_CROSS_MODES[modeIndex].summary, `ABO mode ${modeIndex} summary`);
  for (let matStep = 1; matStep <= ABO_GENOTYPES.length; matStep += 1) {
    for (let patStep = 1; patStep <= ABO_GENOTYPES.length; patStep += 1) {
      for (let pedStep = 1; pedStep <= 2; pedStep += 1) {
        const res = simulateAboCodominancePedigree({
          modeIndex,
          maternalGenotypeStep: matStep,
          paternalGenotypeStep: patStep,
          pedigreeFocusStep: pedStep,
        });
        check(Object.isFrozen(res), 'ABO result frozen');
        check(Object.isFrozen(res.punnettCells), 'ABO punnettCells frozen');
        check(Object.isFrozen(res.groupPercentages), 'ABO groupPercentages frozen');
        checkEqual(res.punnettCells.length, 4, '4 ABO Punnett cells');
        const totalPct =
          res.groupPercentages.A +
          res.groupPercentages.B +
          res.groupPercentages.AB +
          res.groupPercentages.O;
        checkEqual(totalPct, 100, 'ABO percentages sum to 100%');
        checkEqual(
          res.possibleGroups.length + res.impossibleGroups.length,
          4,
          'Possible + impossible ABO groups = 4'
        );
        checkCleanText(res.phenotypeRatioSummary, 'ABO phenotypeRatioSummary clean');

        const cap = captureAboTrial(res);
        check(Object.isFrozen(cap), 'Captured ABO trial frozen');
      }
    }
  }
}

// Specific benchmark ABO crosses
const aboFour = simulateAboCodominancePedigree({
  modeIndex: 0,
  maternalGenotypeStep: 1, // IᴬIᴼ
  paternalGenotypeStep: 3, // IᴮIᴼ
});
checkEqual(aboFour.groupPercentages.AB, 25, 'IᴬIᴼ x IᴮIᴼ -> 25% AB');
checkEqual(aboFour.groupPercentages.A, 25, 'IᴬIᴼ x IᴮIᴼ -> 25% A');
checkEqual(aboFour.groupPercentages.B, 25, 'IᴬIᴼ x IᴮIᴼ -> 25% B');
checkEqual(aboFour.groupPercentages.O, 25, 'IᴬIᴼ x IᴮIᴼ -> 25% O');
checkEqual(aboFour.isFourGroupSplit, true, 'IᴬIᴼ x IᴮIᴼ isFourGroupSplit');

const aboSwap = simulateAboCodominancePedigree({
  modeIndex: 1,
  maternalGenotypeStep: 5, // IᴬIᴮ
  paternalGenotypeStep: 6, // IᴼIᴼ
});
checkEqual(aboSwap.groupPercentages.A, 50, 'IᴬIᴮ x IᴼIᴼ -> 50% A');
checkEqual(aboSwap.groupPercentages.B, 50, 'IᴬIᴮ x IᴼIᴼ -> 50% B');
checkEqual(aboSwap.groupPercentages.AB, 0, 'IᴬIᴮ x IᴼIᴼ -> 0% AB');
checkEqual(aboSwap.groupPercentages.O, 0, 'IᴬIᴮ x IᴼIᴼ -> 0% O');
checkEqual(aboSwap.canHaveGroupOChild, false, 'IᴬIᴮ x IᴼIᴼ cannot have Group O child');
checkEqual(aboSwap.canHaveGroupABChild, false, 'IᴬIᴮ x IᴼIᴼ cannot have Group AB child');

const aboCodom = simulateAboCodominancePedigree({
  modeIndex: 2,
  maternalGenotypeStep: 5, // IᴬIᴮ
  paternalGenotypeStep: 5, // IᴬIᴮ
});
checkEqual(aboCodom.groupPercentages.A, 25, 'IᴬIᴮ x IᴬIᴮ -> 25% A');
checkEqual(aboCodom.groupPercentages.AB, 50, 'IᴬIᴮ x IᴬIᴮ -> 50% AB');
checkEqual(aboCodom.groupPercentages.B, 25, 'IᴬIᴮ x IᴬIᴮ -> 25% B');
checkEqual(aboCodom.groupPercentages.O, 0, 'IᴬIᴮ x IᴬIᴮ -> 0% O');
checkEqual(aboCodom.isCodominantOneTwoOne, true, 'IᴬIᴮ x IᴬIᴮ isCodominantOneTwoOne');

const aboCmp = compareAboTrials(aboFour, aboSwap);
check(Object.isFrozen(aboCmp), 'ABO comparison frozen');
checkEqual(aboCmp.groupODeltaPct, -25, 'Group O delta -25%');
checkCleanText(aboCmp.summary, 'ABO comparison summary clean');

// 4. Exhaustive Sex-Linked & XX/XY Sweep
for (const t of SEX_LINKED_TRAITS) {
  check(Object.isFrozen(t), `Sex-linked trait ${t.id} frozen`);
  checkCleanText(t.name, `Sex-linked trait ${t.id} name`);
  checkCleanText(t.chapterBridge, `Sex-linked trait ${t.id} chapterBridge`);
  checkCleanText(t.molecularMechanism, `Sex-linked trait ${t.id} molecularMechanism`);
}

for (let modeIndex = 0; modeIndex < SEX_LINKED_MODES.length; modeIndex += 1) {
  checkCleanText(SEX_LINKED_MODES[modeIndex].label, `Sex-linked mode ${modeIndex} label`);
  checkCleanText(SEX_LINKED_MODES[modeIndex].summary, `Sex-linked mode ${modeIndex} summary`);
  for (let traitStep = 1; traitStep <= SEX_LINKED_TRAITS.length; traitStep += 1) {
    for (let matStep = 1; matStep <= 3; matStep += 1) {
      for (let patStep = 1; patStep <= 2; patStep += 1) {
        const res = simulateSexLinkedCross({
          modeIndex,
          traitStep,
          maternalStep: matStep,
          paternalStep: patStep,
        });
        check(Object.isFrozen(res), 'Sex-linked result frozen');
        check(Object.isFrozen(res.punnettCells), 'Sex-linked punnettCells frozen');
        check(Object.isFrozen(res.amongDaughters), 'amongDaughters frozen');
        check(Object.isFrozen(res.amongSons), 'amongSons frozen');
        check(Object.isFrozen(res.amongAllChildren), 'amongAllChildren frozen');
        checkEqual(res.punnettCells.length, 4, '4 sex-linked Punnett cells');
        checkEqual(res.amongAllChildren.femaleXXPct, 50, '50% XX female children');
        checkEqual(res.amongAllChildren.maleXYPct, 50, '50% XY male children');
        checkEqual(
          res.amongDaughters.homozygousNormalPct +
            res.amongDaughters.carrierPct +
            res.amongDaughters.affectedPct,
          100,
          'Daughter percentages sum to 100%'
        );
        checkEqual(
          res.amongSons.normalPct + res.amongSons.affectedPct,
          100,
          'Son percentages sum to 100%'
        );
        checkEqual(
          res.amongAllChildren.normalDaughterPct +
            res.amongAllChildren.carrierDaughterPct +
            res.amongAllChildren.affectedDaughterPct +
            res.amongAllChildren.normalSonPct +
            res.amongAllChildren.affectedSonPct,
          100,
          'All children percentages sum to 100%'
        );
        checkEqual(
          res.chromosomeFacts.fatherToSonXTransmissionPct,
          0,
          'Father-to-son X transmission is 0%'
        );
        checkEqual(
          res.chromosomeFacts.fatherToDaughterXTransmissionPct,
          100,
          'Father-to-daughter X transmission is 100%'
        );

        const cap = captureSexLinkedTrial(res);
        check(Object.isFrozen(cap), 'Captured sex-linked trial frozen');
      }
    }
  }
}

// Specific benchmark sex-linked crosses
// Mode 0: Carrier mother (XᴮXᵇ) x Normal father (XᴮY)
const sxCarrierMum = simulateSexLinkedCross({
  modeIndex: 0,
  traitStep: 1,
  maternalStep: 1,
  paternalStep: 1,
});
checkEqual(sxCarrierMum.amongDaughters.homozygousNormalPct, 50, 'Carrier mum x Normal dad: 50% normal daughters');
checkEqual(sxCarrierMum.amongDaughters.carrierPct, 50, 'Carrier mum x Normal dad: 50% carrier daughters');
checkEqual(sxCarrierMum.amongDaughters.affectedPct, 0, 'Carrier mum x Normal dad: 0% affected daughters');
checkEqual(sxCarrierMum.amongSons.normalPct, 50, 'Carrier mum x Normal dad: 50% normal sons');
checkEqual(sxCarrierMum.amongSons.affectedPct, 50, 'Carrier mum x Normal dad: 50% affected sons');
checkEqual(sxCarrierMum.amongAllChildren.totalAffectedChildrenPct, 25, 'Carrier mum x Normal dad: 25% of all children affected');

// Mode 1: Homozygous normal mother (XᴮXᴮ) x Affected father (XᵇY)
const sxAffectedDad = simulateSexLinkedCross({
  modeIndex: 1,
  traitStep: 2,
  maternalStep: 2,
  paternalStep: 2,
});
checkEqual(sxAffectedDad.amongDaughters.carrierPct, 100, 'Normal mum x Affected dad: 100% carrier daughters');
checkEqual(sxAffectedDad.amongDaughters.affectedPct, 0, 'Normal mum x Affected dad: 0% affected daughters');
checkEqual(sxAffectedDad.amongSons.normalPct, 100, 'Normal mum x Affected dad: 100% normal sons');
checkEqual(sxAffectedDad.amongSons.affectedPct, 0, 'Normal mum x Affected dad: 0% affected sons (no father-to-son X transmission)');

// Mode 2: Carrier mother (XᴮXᵇ) x Affected father (XᵇY)
const sxBoth = simulateSexLinkedCross({
  modeIndex: 2,
  traitStep: 1,
  maternalStep: 1,
  paternalStep: 2,
});
checkEqual(sxBoth.amongDaughters.carrierPct, 50, 'Carrier mum x Affected dad: 50% carrier daughters');
checkEqual(sxBoth.amongDaughters.affectedPct, 50, 'Carrier mum x Affected dad: 50% affected daughters (XᵇXᵇ)');
checkEqual(sxBoth.amongSons.normalPct, 50, 'Carrier mum x Affected dad: 50% normal sons');
checkEqual(sxBoth.amongSons.affectedPct, 50, 'Carrier mum x Affected dad: 50% affected sons');

const sxCmp = compareSexLinkedTrials(sxCarrierMum, sxAffectedDad);
check(Object.isFrozen(sxCmp), 'Sex-linked comparison frozen');
checkEqual(sxCmp.sonsAffectedDeltaPct, -50, 'Sons affected delta -50%');
checkEqual(sxCmp.daughtersCarrierDeltaPct, 50, 'Daughters carrier delta +50%');
checkCleanText(sxCmp.summary, 'Sex-linked comparison summary clean');

console.log(`ch13_domain.mjs: ${assertions} assertions passed with 0 failures.`);
