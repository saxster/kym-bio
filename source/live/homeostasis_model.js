// Pure deterministic domain models for Chapter 10 (Homeostasis, Excretion & Immunity).
// Zero DOM, Canvas, or WebGL dependencies; suitable for headless Node verification and live 2D widgets.

export const THERMO_GLUCOSE_MODES = Object.freeze([
  'Skin thermoregulation',
  'Mumbai humidity stress',
  'Glucose feedback (Insulin/Glucagon)',
  'Type 1 diabetes & insulin rescue',
]);

export const NEPHRON_MODES = Object.freeze([
  'Normal hydration',
  'Hot Mumbai dehydration',
  'High-protein meal (deamination)',
  'Untreated hyperglycaemia (16 mmol/L)',
]);

export const IMMUNITY_MODES = Object.freeze([
  'Primary vs Vaccine Memory',
  'Antigen shape specificity',
  'Active vs Passive immunity',
  'Cholera toxin vs ORS rescue',
]);

export const HOMEOSTASIS_CONSTANTS = Object.freeze({
  coreTempSetPointC: 37.0,
  enzymeDenatureOnsetC: 40.5,
  latentHeatSweatJPerG: 2420,
  bloodGlucoseSetPointMmolL: 5.0,
  bloodGlucoseNormalMinMmolL: 4.0,
  bloodGlucoseNormalMaxMmolL: 5.5,
  renalGlucoseTmMmolL: 10.5,
  normalGfrMlMin: 125,
  plasmaProteinGPer100Ml: 8.0,
  normalPlasmaUreaGPer100Ml: 0.03,
  normalPlasmaIonsGPer100Ml: 0.72,
  passiveHalfLifeDays: 21.0,
});

function clamp(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

function round(v, dp = 2) {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
}

// ---------------------------------------------------------------------------
// 1. Thermoregulation & Blood Glucose Negative-Feedback Model
// ---------------------------------------------------------------------------
export function thermoGlucoseAccount(modeIndex = 0, ambientTempC = 38, humidityOrMealPct = 65) {
  const m = Math.round(clamp(modeIndex, 0, 3));
  const tAmb = clamp(ambientTempC, 10, 42);
  const pct = clamp(humidityOrMealPct, 10, 90);
  const modeName = THERMO_GLUCOSE_MODES[m];

  // Thermoregulation variables (used primarily in modes 0 and 1, and always computed consistently)
  const rh = pct;
  // Stull-like simplified wet-bulb approximation valid across 10..42 °C and 10..90% RH
  const wetBulbC = round(tAmb - ((100 - rh) * (0.14 + 0.0022 * tAmb)), 2);

  // Arteriole smooth-muscle vasomotor state (note: capillaries stay fixed in depth!)
  let arterioleState = 'Normotonic (balanced)';
  let arterioleDiameterPct = 100;
  let surfaceCapillaryFlowMlMin = 250;
  let hairErectorState = 'Relaxed (hairs flat)';
  let shiveringWatts = 0;
  let sweatSecretedGH = 40;

  if (tAmb >= 30) {
    arterioleState = 'Vasodilated (smooth muscle relaxed)';
    arterioleDiameterPct = round(100 + (tAmb - 25) * 3.5, 1);
    surfaceCapillaryFlowMlMin = round(250 + (tAmb - 25) * 38, 0);
    hairErectorState = 'Relaxed (hairs lie flat)';
    shiveringWatts = 0;
    sweatSecretedGH = round(60 + (tAmb - 28) * 36, 0);
  } else if (tAmb <= 20) {
    arterioleState = 'Vasoconstricted (smooth muscle contracted)';
    arterioleDiameterPct = round(Math.max(42, 100 - (24 - tAmb) * 4.0), 1);
    surfaceCapillaryFlowMlMin = round(Math.max(45, 250 - (24 - tAmb) * 15), 0);
    hairErectorState = 'Contracted (hairs upright trapping air)';
    shiveringWatts = round((21 - tAmb) * 16, 0);
    sweatSecretedGH = 10;
  } else {
    arterioleState = 'Baseline arteriole tone';
    arterioleDiameterPct = round(100 + (tAmb - 25) * 2.0, 1);
    surfaceCapillaryFlowMlMin = round(250 + (tAmb - 25) * 14, 0);
    hairErectorState = 'Relaxed (hairs flat)';
    shiveringWatts = 0;
    sweatSecretedGH = round(25 + Math.max(0, tAmb - 22) * 5, 0);
  }

  // Evaporative ceiling depends on (100 - RH) vapour pressure deficit
  const maxEvapCapacityGH = round((100 - rh) * (4.2 + Math.max(0, tAmb - 20) * 0.14), 1);
  const sweatEvaporatedGH = round(Math.min(sweatSecretedGH, maxEvapCapacityGH), 1);
  const sweatDrippedGH = round(Math.max(0, sweatSecretedGH - sweatEvaporatedGH), 1);
  const evaporativeCoolingW = round((sweatEvaporatedGH * HOMEOSTASIS_CONSTANTS.latentHeatSweatJPerG) / 3600, 1);

  // Dry heat loss (positive = heat shed to cooler air; negative = heat gained from hotter >35 °C air)
  const skinSurfaceTempC = round(tAmb >= 32 ? 35.6 : tAmb <= 18 ? 29.5 : 33.2, 1);
  const dryTransferCoeff = tAmb < 25 ? 11.5 : 4.8;
  const dryHeatLossW = round((skinSurfaceTempC - tAmb) * (dryTransferCoeff + surfaceCapillaryFlowMlMin * 0.008), 1);
  const metabolicHeatW = round(110 + shiveringWatts + (m === 1 ? 50 : 0), 1);
  const netHeatStorageW = round(metabolicHeatW - dryHeatLossW - evaporativeCoolingW, 1);

  let coreTempC = 37.0;
  if (netHeatStorageW > 25) {
    coreTempC = round(37.0 + Math.min(2.6, (netHeatStorageW - 25) * 0.014), 2);
  } else if (netHeatStorageW < -35) {
    coreTempC = round(37.0 - Math.min(1.2, (-netHeatStorageW - 35) * 0.008), 2);
  }

  // Blood glucose feedback variables (used primarily in modes 2 and 3, always available)
  // Map pct (10..90) to fasting/exercise (10..35), euglycaemic (40..50), or carbohydrate meal (55..90)
  const uncompensatedGlucoseMmolL = round(2.8 + (pct / 100) * 7.5, 2);
  let insulinUnitsMl = 8;
  let glucagonPgMl = 55;
  let liverAction = 'Balanced glycogen turnover';
  let liverGlycogenRateGH = 0;
  let regulatedGlucoseMmolL = 5.0;
  let urineGlucoseSpillMmolL = 0;

  if (m === 3) {
    // Mode 3: Type 1 diabetes — slider pct >= 55 represents injected insulin rescue; pct < 55 represents untreated
    const insulinInjected = pct >= 55;
    if (!insulinInjected) {
      insulinUnitsMl = 0;
      glucagonPgMl = 95;
      liverAction = 'No insulin signal: glucose stays locked in blood';
      liverGlycogenRateGH = -6.5;
      regulatedGlucoseMmolL = round(14.2 + (tAmb - 10) * 0.11, 2);
      urineGlucoseSpillMmolL = round(Math.max(0, regulatedGlucoseMmolL - HOMEOSTASIS_CONSTANTS.renalGlucoseTmMmolL), 2);
    } else {
      insulinUnitsMl = round(28 + (pct - 55) * 0.8, 1);
      glucagonPgMl = 45;
      liverAction = 'Injected insulin restores glucose → glycogen storage';
      liverGlycogenRateGH = round(8.0 + (pct - 55) * 0.2, 1);
      regulatedGlucoseMmolL = round(5.2 - (pct - 55) * 0.015, 2);
      urineGlucoseSpillMmolL = 0;
    }
  } else if (uncompensatedGlucoseMmolL > 5.5) {
    insulinUnitsMl = round(15 + (uncompensatedGlucoseMmolL - 5.0) * 14, 1);
    glucagonPgMl = round(Math.max(20, 55 - (uncompensatedGlucoseMmolL - 5.0) * 9), 1);
    liverAction = 'Insulin stimulates liver & muscle: GLUCOSE → GLYCOGEN';
    liverGlycogenRateGH = round((uncompensatedGlucoseMmolL - 5.0) * 4.8, 1);
    regulatedGlucoseMmolL = round(5.0 + (uncompensatedGlucoseMmolL - 5.0) * 0.22, 2);
  } else if (uncompensatedGlucoseMmolL < 4.4) {
    insulinUnitsMl = round(Math.max(2, 8 - (4.6 - uncompensatedGlucoseMmolL) * 4), 1);
    glucagonPgMl = round(75 + (4.6 - uncompensatedGlucoseMmolL) * 65, 1);
    liverAction = 'Glucagon stimulates liver: GLYCOGEN → GLUCOSE';
    liverGlycogenRateGH = round(-(4.6 - uncompensatedGlucoseMmolL) * 6.2, 1);
    regulatedGlucoseMmolL = round(5.0 - (4.6 - uncompensatedGlucoseMmolL) * 0.25, 2);
  } else {
    insulinUnitsMl = 9.0;
    glucagonPgMl = 55.0;
    liverAction = 'Steady set-point equilibrium (5.0 mmol/L)';
    liverGlycogenRateGH = 0.0;
    regulatedGlucoseMmolL = 5.0;
  }

  return Object.freeze({
    modeIndex: m,
    modeName,
    ambientTempC: tAmb,
    humidityOrMealPct: pct,
    wetBulbC,
    arterioleState,
    arterioleDiameterPct,
    capillaryPositionFixed: true,
    surfaceCapillaryFlowMlMin,
    hairErectorState,
    shiveringWatts,
    sweatSecretedGH,
    sweatEvaporatedGH,
    sweatDrippedGH,
    evaporativeCoolingW,
    dryHeatLossW,
    metabolicHeatW,
    netHeatStorageW,
    coreTempC,
    uncompensatedGlucoseMmolL,
    regulatedGlucoseMmolL,
    insulinUnitsMl,
    glucagonPgMl,
    liverAction,
    liverGlycogenRateGH,
    urineGlucoseSpillMmolL,
  });
}

export function captureThermoGlucoseTrial(modeIndex, ambientTempC, humidityOrMealPct) {
  return thermoGlucoseAccount(modeIndex, ambientTempC, humidityOrMealPct);
}

export function compareThermoGlucoseTrials(trials = []) {
  if (!Array.isArray(trials) || trials.length === 0) {
    return Object.freeze({
      count: 0,
      hasContrast: false,
      summary: 'No trials captured yet. Capture two contrasting temperature, humidity or glucose states to compare.',
    });
  }
  if (trials.length === 1) {
    const t = trials[0];
    return Object.freeze({
      count: 1,
      hasContrast: false,
      summary: `1 trial captured (${t.modeName} at ${t.ambientTempC} °C, ${t.humidityOrMealPct}%). Capture a second contrasting state to compare.`,
    });
  }
  const first = trials[0];
  const last = trials[trials.length - 1];
  const hasContrast =
    first.modeIndex !== last.modeIndex ||
    Math.abs(first.ambientTempC - last.ambientTempC) >= 5 ||
    Math.abs(first.humidityOrMealPct - last.humidityOrMealPct) >= 15;

  const summary = hasContrast
    ? `Contrasting thermoregulation or glucose feedback states captured for comparison: (${first.modeName}, ${first.ambientTempC} °C, ${first.humidityOrMealPct}% → core ${first.coreTempC.toFixed(2)} °C, glucose ${first.regulatedGlucoseMmolL.toFixed(1)} mmol/L) vs (${last.modeName}, ${last.ambientTempC} °C, ${last.humidityOrMealPct}% → core ${last.coreTempC.toFixed(2)} °C, glucose ${last.regulatedGlucoseMmolL.toFixed(1)} mmol/L).`
    : `Two similar states captured (${first.modeName}). Change the tab, ambient temperature or humidity/meal slider to capture a contrasting state.`;

  return Object.freeze({
    count: trials.length,
    hasContrast,
    first,
    last,
    summary,
  });
}

// ---------------------------------------------------------------------------
// 2. Kidney Nephron Ultrafiltration & Selective Reabsorption Model
// ---------------------------------------------------------------------------
export function nephronFiltrationAccount(modeIndex = 0, plasmaGlucoseMmolL = 5, gfrMlMin = 125) {
  const m = Math.round(clamp(modeIndex, 0, 3));
  let pGluc = clamp(plasmaGlucoseMmolL, 4, 18);
  const gfr = clamp(gfrMlMin, 80, 140);
  const modeName = NEPHRON_MODES[m];

  // Mode-specific physiological overrides so each tab immediately demonstrates its target state cleanly
  if (m === 3 && pGluc < 12) {
    pGluc = 16;
  }

  const filtrateLPerDay = round((gfr * 1440) / 1000, 1);
  const plasmaProteinG100Ml = HOMEOSTASIS_CONSTANTS.plasmaProteinGPer100Ml;
  const filtrateProteinG100Ml = 0.0;
  const urineProteinG100Ml = 0.0;

  // Glucose: 1 mmol/L ≈ 0.018 g/100 mL
  const plasmaGlucoseG100Ml = round(pGluc * 0.018, 3);
  const filtrateGlucoseMmolL = pGluc;
  const tm = HOMEOSTASIS_CONSTANTS.renalGlucoseTmMmolL;
  const reabsorbedGlucoseMmolL = round(Math.min(filtrateGlucoseMmolL, tm), 2);
  const spilledGlucoseMmolL = round(Math.max(0, filtrateGlucoseMmolL - tm), 2);
  const glucoseReabsorbedPct = round((reabsorbedGlucoseMmolL / filtrateGlucoseMmolL) * 100, 1);

  // Urea: mode 2 (high-protein meal / deamination) doubles liver urea production and plasma urea
  const plasmaUreaG100Ml = m === 2 ? 0.06 : 0.03;
  const filtrateUreaG100Ml = plasmaUreaG100Ml;
  const filteredUreaGPerDay = round(filtrateLPerDay * 10 * filtrateUreaG100Ml, 1);
  const reabsorbedUreaPct = 44.0;
  const excretedUreaGPerDay = round(filteredUreaGPerDay * (1 - reabsorbedUreaPct / 100), 1);

  // Water reabsorption and urine volume (L/day)
  // Osmotic diuresis when glucose spills into collecting duct (spilledGlucoseMmolL > 0)
  let baseUrineLPerDay = 1.5;
  if (m === 1) {
    baseUrineLPerDay = 0.78; // Dehydrated Mumbai afternoon: high ADH & aquaporin water rescue
  } else if (m === 2) {
    baseUrineLPerDay = 1.85; // High-protein urea load
  }
  const osmoticExtraUrineLPerDay = round(spilledGlucoseMmolL * 0.42, 2);
  const urineLPerDay = round(
     clamp(baseUrineLPerDay * (gfr / 125) + osmoticExtraUrineLPerDay, 0.5, 6.0),
    2,
  );
  const reabsorbedWaterLPerDay = round(filtrateLPerDay - urineLPerDay, 2);
  const waterReabsorbedPct = round((reabsorbedWaterLPerDay / filtrateLPerDay) * 100, 2);

  const urineUreaG100Ml = round(excretedUreaGPerDay / (urineLPerDay * 10), 2);
  const ureaConcentrationRatio = round(urineUreaG100Ml / plasmaUreaG100Ml, 1);

  const filteredGlucoseGPerDay = round(filtrateLPerDay * 10 * plasmaGlucoseG100Ml, 1);
  const reabsorbedGlucoseGPerDay = round(filteredGlucoseGPerDay * (glucoseReabsorbedPct / 100), 1);
  const urineGlucoseGPerDay = round(Math.max(0, filteredGlucoseGPerDay - reabsorbedGlucoseGPerDay), 1);
  const urineGlucoseG100Ml = round(urineGlucoseGPerDay / (urineLPerDay * 10), 2);

  // Mineral ions (Na+, Cl-)
  const plasmaIonsG100Ml = HOMEOSTASIS_CONSTANTS.normalPlasmaIonsGPer100Ml;
  const ionReabsorbedPct = m === 1 ? 99.1 : 98.3;
  const filteredIonsGPerDay = round(filtrateLPerDay * 10 * plasmaIonsG100Ml, 1);
  const excretedIonsGPerDay = round(filteredIonsGPerDay * (1 - ionReabsorbedPct / 100), 1);
  const urineIonsG100Ml = round(excretedIonsGPerDay / (urineLPerDay * 10), 2);

  return Object.freeze({
    modeIndex: m,
    modeName,
    gfrMlMin: gfr,
    filtrateLPerDay,
    reabsorbedWaterLPerDay,
    waterReabsorbedPct,
    urineLPerDay,
    plasmaProteinG100Ml,
    filtrateProteinG100Ml,
    urineProteinG100Ml,
    glomerularBarrierIntact: true,
    plasmaGlucoseMmolL: pGluc,
    filtrateGlucoseMmolL,
    reabsorbedGlucoseMmolL,
    spilledGlucoseMmolL,
    glucoseReabsorbedPct,
    filteredGlucoseGPerDay,
    reabsorbedGlucoseGPerDay,
    urineGlucoseGPerDay,
    urineGlucoseG100Ml,
    plasmaUreaG100Ml,
    filtrateUreaG100Ml,
    filteredUreaGPerDay,
    excretedUreaGPerDay,
    urineUreaG100Ml,
    ureaConcentrationRatio,
    plasmaIonsG100Ml,
    ionReabsorbedPct,
    urineIonsG100Ml,
  });
}

export function captureNephronTrial(modeIndex, plasmaGlucoseMmolL, gfrMlMin) {
  return nephronFiltrationAccount(modeIndex, plasmaGlucoseMmolL, gfrMlMin);
}

export function compareNephronTrials(trials = []) {
  if (!Array.isArray(trials) || trials.length === 0) {
    return Object.freeze({
      count: 0,
      hasContrast: false,
      summary: 'No nephron trials captured yet. Capture two contrasting hydration, protein-load or glucose states to compare.',
    });
  }
  if (trials.length === 1) {
    const t = trials[0];
    return Object.freeze({
      count: 1,
      hasContrast: false,
      summary: `1 trial captured (${t.modeName}, plasma glucose ${t.plasmaGlucoseMmolL} mmol/L, GFR ${t.gfrMlMin} mL/min). Capture a second contrasting state.`,
    });
  }
  const first = trials[0];
  const last = trials[trials.length - 1];
  const hasContrast =
    first.modeIndex !== last.modeIndex ||
    Math.abs(first.plasmaGlucoseMmolL - last.plasmaGlucoseMmolL) >= 3 ||
    Math.abs(first.gfrMlMin - last.gfrMlMin) >= 15;

  const summary = hasContrast
    ? `Contrasting nephron filtration and reabsorption states captured for comparison: (${first.modeName}, glucose ${first.plasmaGlucoseMmolL} mmol/L → reabsorbed ${first.glucoseReabsorbedPct}%, urine ${first.urineLPerDay} L/d, urea ${first.urineUreaG100Ml} g/100mL) vs (${last.modeName}, glucose ${last.plasmaGlucoseMmolL} mmol/L → reabsorbed ${last.glucoseReabsorbedPct}%, urine ${last.urineLPerDay} L/d, urea ${last.urineUreaG100Ml} g/100mL).`
    : `Two similar nephron states captured (${first.modeName}). Change the physiological tab or plasma glucose slider to compare contrasting states.`;

  return Object.freeze({
    count: trials.length,
    hasContrast,
    first,
    last,
    summary,
  });
}

// ---------------------------------------------------------------------------
// 3. Immunity, Vaccination Memory & Cholera/ORS Rescue Model
// ---------------------------------------------------------------------------
export function immunityVaccineAccount(modeIndex = 0, daysPostExposure = 14, memoryOrOrsPct = 80) {
  const m = Math.round(clamp(modeIndex, 0, 3));
  const day = clamp(daysPostExposure, 0, 42);
  const level = clamp(memoryOrOrsPct, 0, 100);
  const modeName = IMMUNITY_MODES[m];

  // Primary antibody curve (first encounter with Antigen A, no prior memory cells: lag ~5 days, peak ~28 AU at day 14)
  let primaryAntibodyAU = 0;
  if (day > 4) {
    const t = day - 4;
    primaryAntibodyAU = round(28 * (t / 10) * Math.exp(1 - t / 10), 1);
  }

  // Secondary memory-driven antibody curve (post-vaccination memory cells: lag ~1 day, peak up to ~220 AU at day 7)
  let secondaryAntibodyAU = 0;
  if (day >= 1 && level > 0) {
    const t = day - 0.5;
    const scale = 0.25 + 0.75 * (level / 100);
    secondaryAntibodyAU = round(220 * scale * (t / 6.5) * Math.exp(1 - t / 6.5) + 18 * scale, 1);
  }

  // Passive borrowed antibody curve (starts high at Day 0, decays with half-life 21 days, 0 memory cells)
  const initialPassiveAU = round(60 + 100 * (level / 100), 1);
  const passiveAntibodyAU = round(initialPassiveAU * Math.pow(0.5, day / HOMEOSTASIS_CONSTANTS.passiveHalfLifeDays), 1);

  let activeAntibodyAU = m === 0 ? (level >= 40 ? secondaryAntibodyAU : primaryAntibodyAU) : primaryAntibodyAU;
  let antigenShapeMatchPct = 100;
  let memoryCellsPresent = true;
  let immunityClassification = 'Active immunity (lymphocytes + memory cells)';
  let protectionStatus = 'Protected above threshold (≥40 AU)';

  if (m === 1) {
    // Tab 1: Antigen shape specificity check — testing Anti-A antibody against Pathogen B (level < 50) vs Pathogen A (level >= 50)
    const matchingAntigen = level >= 50;
    antigenShapeMatchPct = matchingAntigen ? 100 : 0;
    activeAntibodyAU = matchingAntigen ? secondaryAntibodyAU : 0;
    memoryCellsPresent = matchingAntigen;
    immunityClassification = matchingAntigen
      ? 'Complementary antigen–antibody lock-and-key fit (100% binding)'
      : 'Non-complementary antigen B shape (0% binding by Anti-A antibody)';
    protectionStatus = matchingAntigen
      ? 'Pathogen clumped and marked for phagocytes'
      : 'Anti-A antibodies cannot bind Pathogen B; new primary response required';
  } else if (m === 2) {
    // Tab 2: Active vs Passive immunity comparison
    // Slider level < 50 selects Passive borrowed antibodies; level >= 50 selects Active vaccine/infection
    const isPassive = level < 50;
    if (isPassive) {
      activeAntibodyAU = passiveAntibodyAU;
      memoryCellsPresent = false;
      immunityClassification = 'Passive immunity (borrowed antibodies; NO memory cells)';
      protectionStatus =
        day <= 21
          ? 'Immediate protection at Day 0, decaying as protein breaks down'
          : 'Borrowed antibodies decayed below protective threshold; 0 memory cells remain';
    } else {
      activeAntibodyAU = secondaryAntibodyAU;
      memoryCellsPresent = true;
      immunityClassification = 'Active immunity (host lymphocytes make antibodies + memory cells)';
      protectionStatus = 'Long-term memory cells sustain and boost defence on re-exposure';
    }
  }

  // Tab 3: Cholera toxin Cl- secretion vs Oral Rehydration Solution (ORS: water + NaCl + glucose)
  const choleraClSecretionMmolH = 95;
  const gutOsmoticWaterLossMlH = round(680 - level * 4.5, 0);
  const orsCotransportUptakeMlH = round(level * 6.8, 0);
  const netIntestinalWaterBalanceMlH = round(orsCotransportUptakeMlH - 420, 0);
  const choleraStatus =
    level >= 65
      ? 'ORS Na⁺–glucose cotransport restores net water absorption into blood'
      : 'Cholera toxin Cl⁻ secretion lowers gut Ψ_w, driving osmotic water loss (diarrhoea)';

  return Object.freeze({
    modeIndex: m,
    modeName,
    daysPostExposure: day,
    memoryOrOrsPct: level,
    primaryAntibodyAU,
    secondaryAntibodyAU,
    passiveAntibodyAU,
    activeAntibodyAU,
    protectiveThresholdAU: 40,
    antigenShapeMatchPct,
    memoryCellsPresent,
    immunityClassification,
    protectionStatus,
    choleraClSecretionMmolH,
    gutOsmoticWaterLossMlH,
    orsCotransportUptakeMlH,
    netIntestinalWaterBalanceMlH,
    choleraStatus,
  });
}

export function captureImmunityTrial(modeIndex, daysPostExposure, memoryOrOrsPct) {
  return immunityVaccineAccount(modeIndex, daysPostExposure, memoryOrOrsPct);
}

export function compareImmunityTrials(trials = []) {
  if (!Array.isArray(trials) || trials.length === 0) {
    return Object.freeze({
      count: 0,
      hasContrast: false,
      summary: 'No immunity trials captured yet. Capture two contrasting immune, specificity, passive or ORS states to compare.',
    });
  }
  if (trials.length === 1) {
    const t = trials[0];
    return Object.freeze({
      count: 1,
      hasContrast: false,
      summary: `1 trial captured (${t.modeName}, Day ${t.daysPostExposure}, level ${t.memoryOrOrsPct}%). Capture a second contrasting state.`,
    });
  }
  const first = trials[0];
  const last = trials[trials.length - 1];
  const hasContrast =
    first.modeIndex !== last.modeIndex ||
    Math.abs(first.daysPostExposure - last.daysPostExposure) >= 4 ||
    Math.abs(first.memoryOrOrsPct - last.memoryOrOrsPct) >= 20;

  const summary = hasContrast
    ? `Contrasting immunity or oral rehydration states captured for comparison: (${first.modeName}, Day ${first.daysPostExposure}, level ${first.memoryOrOrsPct}% → ${first.activeAntibodyAU} AU, memory=${first.memoryCellsPresent ? 'YES' : 'NO'}) vs (${last.modeName}, Day ${last.daysPostExposure}, level ${last.memoryOrOrsPct}% → ${last.activeAntibodyAU} AU, memory=${last.memoryCellsPresent ? 'YES' : 'NO'}).`
    : `Two similar immunity states captured (${first.modeName}). Change the tab, day or memory/ORS slider to capture a contrasting state.`;

  return Object.freeze({
    count: trials.length,
    hasContrast,
    first,
    last,
    summary,
  });
}
