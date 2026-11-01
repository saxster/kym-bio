// Headless Node domain verification suite for Chapter 10 (Homeostasis, Excretion & Immunity).
import assert from 'node:assert/strict';
import {
  HOMEOSTASIS_CONSTANTS,
  THERMO_GLUCOSE_MODES,
  NEPHRON_MODES,
  IMMUNITY_MODES,
  thermoGlucoseAccount,
  captureThermoGlucoseTrial,
  compareThermoGlucoseTrials,
  nephronFiltrationAccount,
  captureNephronTrial,
  compareNephronTrials,
  immunityVaccineAccount,
  captureImmunityTrial,
  compareImmunityTrials,
} from '../live/homeostasis_model.js';
import { ENHANCEMENTS } from '../live/enhancements.js';

let count = 0;
function check(cond, msg) {
  assert.ok(cond, msg);
  count += 1;
}

// 1. Constants & frozen exports
check(Object.isFrozen(HOMEOSTASIS_CONSTANTS), 'HOMEOSTASIS_CONSTANTS frozen');
check(Object.isFrozen(THERMO_GLUCOSE_MODES) && THERMO_GLUCOSE_MODES.length === 4, 'THERMO_GLUCOSE_MODES length 4');
check(Object.isFrozen(NEPHRON_MODES) && NEPHRON_MODES.length === 4, 'NEPHRON_MODES length 4');
check(Object.isFrozen(IMMUNITY_MODES) && IMMUNITY_MODES.length === 4, 'IMMUNITY_MODES length 4');
check(HOMEOSTASIS_CONSTANTS.coreTempSetPointC === 37.0, 'Set point 37.0 °C');
check(HOMEOSTASIS_CONSTANTS.latentHeatSweatJPerG === 2420, 'Sweat latent heat 2420 J/g');
check(HOMEOSTASIS_CONSTANTS.bloodGlucoseSetPointMmolL === 5.0, 'Glucose set point 5.0 mmol/L');
check(HOMEOSTASIS_CONSTANTS.renalGlucoseTmMgMin === 330, 'Renal glucose T_m 330 mg/min');
check(HOMEOSTASIS_CONSTANTS.plasmaProteinGPer100Ml === 8.0, 'Plasma protein 8.0 g/100mL');
check(HOMEOSTASIS_CONSTANTS.passiveHalfLifeDays === 21.0, 'Passive half-life 21 days');

// 2. Exhaustive sweep of thermoGlucoseAccount across all 4 modes, temperatures & humidity/meal sliders
for (let m = 0; m < 4; m += 1) {
  for (const temp of [10, 15, 22, 28, 34, 38, 42]) {
    for (const pct of [15, 35, 50, 65, 85]) {
      const a = thermoGlucoseAccount(m, temp, pct);
      check(Object.isFrozen(a), `thermoGlucoseAccount frozen (${m},${temp},${pct})`);
      check(a.capillaryPositionFixed === true, 'Capillaries stay fixed in position');
      check(a.wetBulbC <= a.ambientTempC, 'Wet-bulb never exceeds dry-bulb');
      check(a.sweatEvaporatedGH <= a.sweatSecretedGH + 1e-6, 'Evaporated sweat <= secreted sweat');
      check(Math.abs(a.sweatEvaporatedGH + a.sweatDrippedGH - a.sweatSecretedGH) < 0.2, 'Sweat mass balance');
      if (temp >= 32) {
        check(a.arterioleDiameterPct > 100, 'Hot ambient triggers arteriole vasodilation');
        check(a.shiveringWatts === 0, 'No shivering in hot ambient');
      }
      if (temp <= 18) {
        check(a.arterioleDiameterPct < 100, 'Cold ambient triggers arteriole vasoconstriction');
        check(a.shiveringWatts > 0, 'Cold ambient triggers skeletal muscle shivering');
      }
    }
  }
}

// Specific Mumbai humidity comparison at 38 °C: dry (20% RH) vs humid (85% RH)
const dry38 = thermoGlucoseAccount(1, 38, 20);
const humid38 = thermoGlucoseAccount(1, 38, 85);
check(dry38.sweatEvaporatedGH > humid38.sweatEvaporatedGH, 'More sweat evaporates at 20% RH than 85% RH');
check(humid38.sweatDrippedGH > dry38.sweatDrippedGH, 'More sweat drips off un-evaporated at 85% RH');
check(humid38.coreTempC > dry38.coreTempC, 'Humid 38 °C causes higher core temperature than dry 38 °C');

// Specific glucose negative-feedback checks: mango meal (85%) vs fasting (15%) vs Type 1 diabetes (mode 3)
const mealState = thermoGlucoseAccount(2, 30, 85);
const fastState = thermoGlucoseAccount(2, 30, 15);
check(mealState.insulinUnitsMl > fastState.insulinUnitsMl, 'High glucose meal triggers higher insulin');
check(fastState.glucagonPgMl > mealState.glucagonPgMl, 'Fasting triggers higher glucagon');
check(mealState.liverGlycogenRateGH > 0 && fastState.liverGlycogenRateGH < 0, 'Liver stores glycogen after meal and breaks down glycogen during fast');

const t1dUntreated = thermoGlucoseAccount(3, 30, 30);
const t1dRescued = thermoGlucoseAccount(3, 30, 75);
check(t1dUntreated.insulinUnitsMl === 0 && t1dUntreated.urineGlucoseSpillMgMin > 0, 'Untreated Type 1 diabetes spills glucose in urine');
check(t1dRescued.insulinUnitsMl > 0 && t1dRescued.urineGlucoseSpillMgMin === 0, 'Injected insulin rescues glucose below renal T_m');

// Immutability & comparison checks for thermoGlucose
const tg0 = compareThermoGlucoseTrials([]);
const tg1 = compareThermoGlucoseTrials([captureThermoGlucoseTrial(0, 38, 65)]);
const tgSame = compareThermoGlucoseTrials([captureThermoGlucoseTrial(0, 38, 65), captureThermoGlucoseTrial(0, 38, 65)]);
const tgDiff = compareThermoGlucoseTrials([captureThermoGlucoseTrial(0, 38, 65), captureThermoGlucoseTrial(0, 15, 45)]);
check(!tg0.hasContrast && !tg1.hasContrast && !tgSame.hasContrast, 'Non-contrasting thermo trials rejected');
check(tgDiff.hasContrast && tgDiff.summary.includes('Contrasting thermoregulation or glucose feedback states captured for comparison:'), 'Contrasting thermo trials accepted');

// 3. Exhaustive sweep of nephronFiltrationAccount across all 4 modes, glucose levels & GFRs
for (let m = 0; m < 4; m += 1) {
  for (const gluc of [4, 5, 8, 10, 12, 16, 18]) {
    for (const gfr of [85, 105, 125, 140]) {
      const n = nephronFiltrationAccount(m, gluc, gfr);
      check(Object.isFrozen(n), `nephronFiltrationAccount frozen (${m},${gluc},${gfr})`);
      check(n.filtrateProteinG100Ml === 0 && n.urineProteinG100Ml === 0, 'Rounded protein zeros in the stipulated intact-barrier model');
      check(n.glomerularBarrierIntact === true, 'Glomerular barrier intact');
      check(Math.abs(n.reabsorbedWaterLPerDay + n.urineLPerDay - n.filtrateLPerDay) < 0.05, 'Nephron water volume balance');
      if (n.filteredGlucoseMgMin <= HOMEOSTASIS_CONSTANTS.renalGlucoseTmMgMin) {
        check(n.glucoseReabsorbedPct === 100 && n.excretedGlucoseMgMin === 0 && n.urineGlucoseGPerDay === 0, '100% glucose reabsorbed below T_m');
      } else {
        check(n.glucoseReabsorbedPct < 100 && n.excretedGlucoseMgMin > 0 && n.urineGlucoseGPerDay > 0, 'Glucose spills into urine above T_m');
      }
      check(n.ureaConcentrationRatio > 10, 'Urea concentrated strongly in urine relative to plasma');
    }
  }
}

const normNeph = nephronFiltrationAccount(0, 5, 125);
const dehydNeph = nephronFiltrationAccount(1, 5, 120);
const protNeph = nephronFiltrationAccount(2, 5, 125);
const diabNeph = nephronFiltrationAccount(3, 16, 125);
check(dehydNeph.urineLPerDay < normNeph.urineLPerDay && dehydNeph.waterReabsorbedPct > normNeph.waterReabsorbedPct, 'Dehydration increases water reabsorption and reduces urine volume');
check(protNeph.excretedUreaGPerDay > normNeph.excretedUreaGPerDay, 'High-protein meal increases liver deamination and daily urea excretion');
check(diabNeph.urineLPerDay > normNeph.urineLPerDay && diabNeph.urineProteinG100Ml === 0, 'Hyperglycaemia causes osmotic diuresis with intact glomerular protein barrier');

const np0 = compareNephronTrials([]);
const np1 = compareNephronTrials([captureNephronTrial(0, 5, 125)]);
const npSame = compareNephronTrials([captureNephronTrial(0, 5, 125), captureNephronTrial(0, 5, 125)]);
const npDiff = compareNephronTrials([captureNephronTrial(0, 5, 125), captureNephronTrial(3, 16, 125)]);
check(!np0.hasContrast && !np1.hasContrast && !npSame.hasContrast, 'Non-contrasting nephron trials rejected');
check(npDiff.hasContrast && npDiff.summary.includes('Contrasting nephron filtration and reabsorption states captured for comparison:'), 'Contrasting nephron trials accepted');

// 4. Exhaustive sweep of immunityVaccineAccount across all 4 modes, days & levels
for (let m = 0; m < 4; m += 1) {
  for (const day of [0, 2, 7, 14, 21, 28, 42]) {
    for (const lvl of [0, 20, 50, 80, 100]) {
      const im = immunityVaccineAccount(m, day, lvl);
      check(Object.isFrozen(im), `immunityVaccineAccount frozen (${m},${day},${lvl})`);
      check(im.primaryAntibodyAU >= 0 && im.secondaryAntibodyAU >= 0 && im.passiveAntibodyAU >= 0, 'Non-negative antibody levels');
      if (m === 1 && lvl < 50) {
        check(im.antigenShapeMatchPct === 0 && im.activeAntibodyAU === 0, 'Mismatched antigen shape gives 0% binding');
      }
      if (m === 2 && lvl < 50) {
        check(im.memoryCellsPresent === false, 'Passive immunity produces zero memory cells');
      }
    }
  }
}

const naiveDay7 = immunityVaccineAccount(0, 7, 0);
const vacDay7 = immunityVaccineAccount(0, 7, 90);
check(vacDay7.activeAntibodyAU > naiveDay7.activeAntibodyAU * 5, 'Post-vaccine memory response is much higher and faster at Day 7');

const passiveDay0 = immunityVaccineAccount(2, 0, 20);
const passiveDay21 = immunityVaccineAccount(2, 21, 20);
const passiveDay42 = immunityVaccineAccount(2, 42, 20);
check(Math.abs(passiveDay21.passiveAntibodyAU - passiveDay0.passiveAntibodyAU * 0.5) < 0.2, 'Passive antibodies decay with 21-day half-life');
check(passiveDay42.passiveAntibodyAU < passiveDay21.passiveAntibodyAU && !passiveDay0.memoryCellsPresent, 'Passive immunity decays and lacks memory cells');

const choleraNoOrs = immunityVaccineAccount(3, 2, 10);
const choleraFullOrs = immunityVaccineAccount(3, 2, 80);
check(choleraNoOrs.netIntestinalWaterBalanceMlH < 0 && choleraFullOrs.netIntestinalWaterBalanceMlH > 0, 'ORS Na+-glucose cotransport reverses cholera net water loss');

const im0 = compareImmunityTrials([]);
const im1 = compareImmunityTrials([captureImmunityTrial(0, 14, 0)]);
const imSame = compareImmunityTrials([captureImmunityTrial(0, 14, 0), captureImmunityTrial(0, 14, 0)]);
const imDiff = compareImmunityTrials([captureImmunityTrial(0, 14, 0), captureImmunityTrial(0, 7, 90)]);
check(!im0.hasContrast && !im1.hasContrast && !imSame.hasContrast, 'Non-contrasting immunity trials rejected');
check(imDiff.hasContrast && imDiff.summary.includes('Contrasting immunity or oral rehydration states captured for comparison:'), 'Contrasting immunity trials accepted');

// 5. Verify ENHANCEMENTS entries for all 3 Chapter 10 widgets
for (const key of ['glucose_thermoregulation', 'nephron_filtration', 'immunity_vaccine_memory']) {
  const entry = ENHANCEMENTS[key];
  check(Boolean(entry), `ENHANCEMENTS.${key} exists`);
  check(typeof entry.challenge?.prompt === 'string' && typeof entry.challenge?.check === 'function', `${key} challenge check valid`);
  check(typeof entry.yourNumbers === 'function' && typeof entry.cutaway === 'string' && typeof entry.idealised === 'string', `${key} metadata valid`);
  check(Array.isArray(entry.watch) && entry.watch.length === 5, `${key} has 5 watch tour shots`);
  for (const shot of entry.watch) {
    check(typeof shot.cutaway === 'boolean' && typeof shot.act === 'function', `${key} watch shot cutaway boolean & act function`);
  }
}



// Independent worked ledger and dimensional regression: concentration is not a transport rate.
const rateCase = nephronFiltrationAccount(3, 16, 125);
check(Math.abs(rateCase.filteredGlucoseMgMin - 360) < 1e-9, '2.88 mg/mL ×125mL/min =360mg/min');
check(rateCase.reabsorbedGlucoseMgMin ===330 && rateCase.excretedGlucoseMgMin===30, '330mg/min capacity leaves30mg/min');
check(rateCase.urineGlucoseGPerDay===43.2, '30mg/min ×1440min/day =43.2g/day');
const lowerFlow = nephronFiltrationAccount(0,16,85);
check(lowerFlow.excretedGlucoseMgMin===0,'Same plasma concentration at lower GFR need not exceed rate capacity');
check(normNeph.filteredGlucoseGPerDay===162,'5mmol/L at180L/day filters162g/day');
check(Math.abs(rateCase.urineGlucoseG100Ml *rateCase.urineLPerDay*10-rateCase.urineGlucoseGPerDay)<0.2,'Urine concentration and daily loss agree within rounding');

check(!immunityVaccineAccount(0,0,0).memoryCellsPresent, 'First exposure at Day0 has no pre-existing memory');
console.log(`ch10_domain: ${count} assertions passed`);
