import { immunityVaccineAccount } from '../../../homeostasis_model.js';
// Chapter 10 pure model: insulin/glucagon glucose feedback, skin thermoregulation, kidney nephron filtration/reabsorption, and vaccine memory.
export function glucoseHomeostasisAccount(mealCarbG = 60, insulinCapacityPct = 100) {
  const ins = Math.max(5, Math.min(100, insulinCapacityPct)) / 100;
  const peakBloodGlucoseMgDl = 90 + (mealCarbG * 1.45) / (0.25 + 0.75 * ins);
  const glycogenStoredG = mealCarbG * 0.65 * ins;
  const renalGlucoseExcretionMgMin = Math.max(0, peakBloodGlucoseMgDl / 100 * 125 - 330); // Chosen recovery rate, GFR125.
  return { mealCarbG, insulinCapacityPct, peakBloodGlucoseMgDl, glycogenStoredG, renalGlucoseExcretionMgMin };
}

export function nephronLedgerAccount(gfrMlMin = 125, adhLevelPct = 60, bloodGlucoseMgDl = 95) {
  const filtrateLPerDay = (gfrMlMin * 1440) / 1000; // 180 L/day
  const glucoseReabsorbedPct = 100 * Math.min(330, bloodGlucoseMgDl / 100 * gfrMlMin) / (bloodGlucoseMgDl / 100 * gfrMlMin);
  const adh = Math.max(0, Math.min(100, adhLevelPct)) / 100;
  const waterReabsorbedPct = 98.0 + 1.4 * adh; // 98.0% to 99.4%
  const urineLPerDay = filtrateLPerDay * (1 - waterReabsorbedPct / 100);
  const urineOsmolarityMosm = 120 + 1080 * adh;
  return { gfrMlMin, filtrateLPerDay, glucoseReabsorbedPct, waterReabsorbedPct, urineLPerDay, urineOsmolarityMosm };
}

export function immuneMemoryAccount(day = 6, responseType = 'secondary') {
  const account = immunityVaccineAccount(0, day, responseType === 'primary' ? 0 : 90);
  return { day: account.daysPostExposure, responseType, antibodyTitre: account.activeAntibodyAU,
    peakDay: responseType === 'primary' ? 14 : 7 };
}
