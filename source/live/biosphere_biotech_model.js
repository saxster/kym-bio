// Pure ES module mathematical domain model for Chapter 15:
// "Web of Life & Code Rewritable: Ecology, Nutrient Cycles & Biotechnology"
// Zero DOM dependencies. Shared by interactive widgets and headless Node tests.

export function clamp(val, min, max) {
  const n = Number(val);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function roundTo(val, decimals = 2) {
  const f = Math.pow(10, decimals);
  return Math.round(Number(val) * f) / f;
}

// ============================================================================
// 1. ECOSYSTEM TROPHIC PYRAMIDS, DIET EFFICIENCY & SIGMOID POPULATION LAB
// ============================================================================

export const TROPHIC_MODES = [
  'sgnp_web',
  'banyan_pyramid',
  'diet_efficiency',
  'sigmoid_population',
];

export const TROPHIC_PRESETS = {
  sgnp_monsoon: {
    id: 'sgnp_monsoon',
    label: 'SGNP Monsoon Web (10%)',
    mode: 'sgnp_web',
    transferEffPct: 10,
    secondaryParam: 4,
  },
  banyan_inversion: {
    id: 'banyan_inversion',
    label: 'Oval Maidan Banyan Tree',
    mode: 'banyan_pyramid',
    transferEffPct: 10,
    secondaryParam: 1,
  },
  direct_crop_diet: {
    id: 'direct_crop_diet',
    label: 'Direct Crop Diet (90% Plant)',
    mode: 'diet_efficiency',
    transferEffPct: 10,
    secondaryParam: 90,
  },
  yeast_batch_sigmoid: {
    id: 'yeast_batch_sigmoid',
    label: 'Batch Culture Sigmoid (K=600)',
    mode: 'sigmoid_population',
    transferEffPct: 12,
    secondaryParam: 60,
  },
};

export function simulateTrophicEcosystem(params = {}) {
  const mode = TROPHIC_MODES.includes(params.mode) ? params.mode : 'sgnp_web';
  const transferEffPct = clamp(params.transferEffPct ?? 10, 5, 20);
  const eff = transferEffPct / 100;
  const secondaryParam = clamp(params.secondaryParam ?? 50, 0, 100);

  // Illustrative budget, not SGNP measurements. Loss shares are chosen for teaching.
  // Base solar input and producer net primary productivity (kJ m⁻² yr⁻¹)
  const solarIncidentKj = 1000000;
  const producerEnergyKj = 10000; // assumed NPP equivalent to 1% of incident solar energy

  if (mode === 'sgnp_web') {
    // secondaryParam maps to chain length (3 to 5 levels) or producer scale
    const chainLength = secondaryParam <= 33 ? 3 : secondaryParam <= 67 ? 4 : 5;
    const names = [
      '1. Producers (Karvi shrubs & grasses)',
      '2. Primary consumers (Spotted deer & insects)',
      '3. Secondary consumers (Leopards & frogs)',
      '4. Tertiary consumers (Insect-eating bird predators)',
      '5. Quaternary consumers (Illustrative level)',
    ];
    const baseBiomassKg = 1200; // dry mass kg ha⁻¹
    const baseNumbers = [50000, 1800, 90, 6, 0.4];

    const levels = [];
    for (let i = 0; i < 5; i++) {
      const active = i < chainLength;
      const energyKj = roundTo(producerEnergyKj * Math.pow(eff, i), 2);
      const biomassKg = roundTo(baseBiomassKg * Math.pow(eff, i), 2);
      const numbers = roundTo(baseNumbers[i] * Math.pow(eff / 0.1, i * 0.6), 1);
      const lossTotalKj = i === 0 ? 0 : roundTo(levels[i - 1].energyKj - energyKj, 2);
      const respHeatKj = roundTo(lossTotalKj * 0.6, 2);
      const egestExcretKj = roundTo(lossTotalKj * 0.25, 2);
      const uneatenDetritusKj = roundTo(lossTotalKj - respHeatKj - egestExcretKj, 2);
      // Population viability cannot be inferred from energy per area alone.

      levels.push({
        level: i + 1,
        name: names[i],
        active,
        energyKj,
        biomassKg,
        numbers,
        lossTotalKj,
        respHeatKj,
        egestExcretKj,
        uneatenDetritusKj,
      });
    }

    const topActive = levels[chainLength - 1];
    const totalDecomposerInputKj = roundTo(
      levels.slice(1, chainLength).reduce((acc, l) => acc + l.egestExcretKj + l.uneatenDetritusKj, 0),
      1
    );

    return {
      mode,
      transferEffPct,
      secondaryParam,
      chainLength,
      solarIncidentKj,
      producerEnergyKj,
      levels,
      topLevelEnergyKj: topActive.energyKj,
      lossPerStepPct: roundTo(100 - transferEffPct, 1),
      totalDecomposerInputKj,
      pyramidNumbersInverted: false,
      pyramidBiomassUpright: true,
      pyramidEnergyUpright: true,
      summaryText:
        `Illustrative model: At ${transferEffPct}% transfer (${roundTo(100 - transferEffPct, 1)}% lost per step as respiration heat, faeces, urea, and uneaten parts), ` +
        `Level ${chainLength} receives ${topActive.energyKj} kJ m⁻² yr⁻¹ of new biomass production; population viability also needs habitat area and consumer requirements.`,
    };
  }

  if (mode === 'banyan_pyramid') {
    // Single giant Ficus benghalensis tree vs thousands of insects/bats
    const treeCount = Math.max(1, Math.round(1 + (secondaryParam / 100) * 2));
    const e1 = roundTo(45000 * treeCount, 1);
    const e2 = roundTo(e1 * eff, 1);
    const e3 = roundTo(e2 * eff, 1);
    const e4 = roundTo(e3 * eff, 1);

    const b1 = roundTo(4500 * treeCount, 1);
    const b2 = roundTo(b1 * eff * (4 / 15), 1);
    const b3 = roundTo(b2 * eff, 1);
    const b4 = roundTo(b3 * eff, 2);

    const n1 = treeCount;
    const n2 = Math.round(8000 * treeCount * (eff / 0.1));
    const n3 = Math.round(350 * treeCount * Math.pow(eff / 0.1, 1.4));
    const n4 = Math.max(1, Math.round(6 * treeCount * Math.pow(eff / 0.1, 1.8)));

    const levels = [
      {
        level: 1,
        name: '1. Producer (Giant Banyan tree)',
        numbers: n1,
        biomassKg: b1,
        energyKj: e1,
      },
      {
        level: 2,
        name: '2. Primary consumers (Caterpillars)',
        numbers: n2,
        biomassKg: b2,
        energyKj: e2,
      },
      {
        level: 3,
        name: '3. Secondary consumers (Insect-eating birds)',
        numbers: n3,
        biomassKg: b3,
        energyKj: e3,
      },
      {
        level: 4,
        name: '4. Tertiary consumers (Bird-eating predators)',
        numbers: n4,
        biomassKg: b4,
        energyKj: e4,
      },
    ];

    return {
      mode,
      transferEffPct,
      secondaryParam,
      treeCount,
      levels,
      pyramidNumbersInverted: n1 < n2,
      pyramidBiomassUpright: b1 > b2 && b2 > b3 && b3 > b4,
      pyramidEnergyUpright: e1 > e2 && e2 > e3 && e3 > e4,
      topLevelEnergyKj: e4,
      lossPerStepPct: roundTo(100 - transferEffPct, 1),
      summaryText:
        `Illustrative model: ${n1} banyan tree(s) support ${n2} primary consumers: the pyramid of numbers is inverted at the base (${n1} < ${n2}), ` +
        `while dry biomass (${b1} → ${b2} → ${b3} → ${b4} kg) and energy (${e1} → ${e2} → ${e3} → ${e4} kJ m⁻² yr⁻¹) remain strictly upright.`,
    };
  }

  if (mode === 'diet_efficiency') {
    const plantSharePct = clamp(secondaryParam, 0, 100);
    const meatSharePct = roundTo(100 - plantSharePct, 1);
    const cropHarvestKj = 10000; // kJ in the same assumed harvested edible crop supply

    const cropDirectKj = roundTo(cropHarvestKj * (plantSharePct / 100), 1);
    const cropToLivestockKj = roundTo(cropHarvestKj * (meatSharePct / 100), 1);

    // One assumed feed-to-edible-food conversion; human digestion is outside this model.
    const livestockMeatKj = roundTo(cropToLivestockKj * eff, 1);
    const livestockLossKj = roundTo(cropToLivestockKj - livestockMeatKj, 1);

    const directFoodEnergyKj = cropDirectKj;
    const animalFoodEnergyKj = livestockMeatKj;
    const totalFoodSuppliedKj = roundTo(directFoodEnergyKj + animalFoodEnergyKj, 1);

    const allMeatBaselineKj = roundTo(cropHarvestKj * eff, 1);
    const allPlantMaxKj = cropHarvestKj;
    const relativeFoodEnergy = roundTo(totalFoodSuppliedKj / Math.max(1, allMeatBaselineKj), 2);
    const cropInputMultiplier = roundTo(allPlantMaxKj / Math.max(1, totalFoodSuppliedKj), 2);

    return {
      mode,
      transferEffPct,
      secondaryParam,
      plantSharePct,
      meatSharePct,
      cropHarvestKj,
      cropDirectKj,
      cropToLivestockKj,
      livestockMeatKj,
      livestockLossKj,
      directFoodEnergyKj,
      animalFoodEnergyKj,
      totalFoodSuppliedKj,
      relativeFoodEnergy,
      cropInputMultiplier,
      topLevelEnergyKj: totalFoodSuppliedKj,
      lossPerStepPct: roundTo(100 - transferEffPct, 1),
      summaryText:
        `Illustrative model: With ${plantSharePct}% plant crops and ${meatSharePct}% livestock meat at an assumed ${transferEffPct}% feed-to-edible-food conversion, ` +
        `the same crop supply provides ${totalFoodSuppliedKj} kJ of food before human digestion (${relativeFoodEnergy}× the all-livestock-route food energy in this model). This does not predict actual people per hectare.`,
    };
  }

  // mode === 'sigmoid_population'
  // secondaryParam controls carrying capacity K (200 to 1000 cells × 10⁶ mL⁻¹)
  // transferEffPct controls intrinsic growth rate r (0.25 to 0.55 h⁻¹)
  const carryingCapacityK = Math.round(200 + (secondaryParam / 100) * 800);
  const r = 0.22 + ((transferEffPct - 5) / 15) * 0.26;
  const n0 = 12;
  const timePoints = [];

  for (let t = 0; t <= 48; t += 2) {
    let phase = 'Lag';
    let pop = n0;
    let birthRate = 0.05;
    let deathRate = 0.02;
    let nutrientPct = 100;
    let toxinPct = 2;

    if (t <= 6) {
      // Phase 1: Lag phase (enzyme induction, small N)
      phase = '1. Lag phase';
      pop = n0 * (1 + 0.08 * t + 0.015 * t * t);
      birthRate = roundTo(0.08 + 0.02 * t, 2);
      deathRate = 0.03;
      nutrientPct = roundTo(100 - t * 1.2, 1);
      toxinPct = roundTo(2 + t * 0.8, 1);
    } else if (t <= 20) {
      // Phase 2: Exponential (log) phase (birth rate >> death rate, no limiting factors)
      phase = '2. Exponential (log) phase';
      const dt = t - 6;
      const nLagEnd = n0 * (1 + 0.08 * 6 + 0.015 * 36);
      const logistic = carryingCapacityK / (1 + ((carryingCapacityK - nLagEnd) / nLagEnd) * Math.exp(-r * dt));
      pop = logistic;
      const fracK = pop / carryingCapacityK;
      birthRate = roundTo(r * (1 - 0.35 * fracK), 2);
      deathRate = roundTo(0.03 + 0.12 * fracK, 2);
      nutrientPct = roundTo(Math.max(22, 92.8 - dt * 4.5), 1);
      toxinPct = roundTo(Math.min(65, 6.8 + dt * 3.2), 1);
    } else if (t <= 34) {
      // Phase 3: Stationary phase (birth rate == death rate around carrying capacity K)
      phase = '3. Stationary phase';
      pop = carryingCapacityK * (0.985 + 0.012 * Math.sin((t - 20) * 0.5));
      birthRate = 0.18;
      deathRate = 0.18;
      nutrientPct = roundTo(Math.max(8, 29.8 - (t - 20) * 1.5), 1);
      toxinPct = roundTo(Math.min(88, 51.6 + (t - 20) * 2.4), 1);
    } else {
      // Phase 4: Death (decline) phase (death rate > birth rate as nutrients exhaust and ethanol/acid toxins accumulate)
      phase = '4. Death phase';
      const dt = t - 34;
      pop = carryingCapacityK * Math.exp(-0.075 * dt);
      birthRate = roundTo(Math.max(0.02, 0.14 - dt * 0.008), 2);
      deathRate = roundTo(0.26 + dt * 0.015, 2);
      nutrientPct = roundTo(Math.max(0.5, 8.8 - dt * 0.6), 1);
      toxinPct = roundTo(Math.min(99, 85.2 + dt * 1.0), 1);
    }

    timePoints.push({
      hour: t,
      phase,
      population: roundTo(pop, 1),
      birthRate,
      deathRate,
      nutrientPct,
      toxinPct,
    });
  }

  const peakPop = Math.max(...timePoints.map((p) => p.population));
  const finalPop = timePoints[timePoints.length - 1].population;

  return {
    mode,
    transferEffPct,
    secondaryParam,
    carryingCapacityK,
    intrinsicRateR: roundTo(r, 3),
    timePoints,
    peakPop: roundTo(peakPop, 1),
    finalPop: roundTo(finalPop, 1),
    topLevelEnergyKj: carryingCapacityK,
    lossPerStepPct: roundTo(100 - transferEffPct, 1),
    summaryText:
      `Sigmoid curve reaches stationary carrying capacity K = ${carryingCapacityK} cells×10⁶ mL⁻¹ (birth rate = death rate) ` +
      `after lag (0–6 h) and exponential growth (6–20 h), before nutrient exhaustion and toxic waste trigger the death phase (${roundTo(finalPop, 0)} at 48 h).`,
  };
}

export function captureTrophicTrial(params = {}) {
  const sim = simulateTrophicEcosystem(params);
  return {
    mode: sim.mode,
    transferEffPct: sim.transferEffPct,
    secondaryParam: sim.secondaryParam,
    metricPrimary: sim.topLevelEnergyKj,
    metricSecondary:
      sim.mode === 'diet_efficiency'
        ? sim.relativeFoodEnergy
        : sim.mode === 'banyan_pyramid'
        ? sim.levels[1].numbers
        : sim.mode === 'sigmoid_population'
        ? sim.finalPop
        : sim.totalDecomposerInputKj,
    summaryText: sim.summaryText,
  };
}

export function compareTrophicTrials(trialA, trialB) {
  if (!trialA || !trialB) return null;
  return {
    deltaPrimary: roundTo(trialB.metricPrimary - trialA.metricPrimary, 2),
    deltaSecondary: roundTo(trialB.metricSecondary - trialA.metricSecondary, 2),
    efficiencyShift: roundTo(trialB.transferEffPct - trialA.transferEffPct, 1),
  };
}

// ============================================================================
// 2. NUTRIENT CYCLES, EUTROPHICATION CASCADE, KEELING CO2 & DEFORESTATION LAB
// ============================================================================

export const NUTRIENT_MODES = [
  'nitrogen_legumes',
  'eutrophication_cascade',
  'carbon_keeling',
  'deforestation_impact',
];

export const NUTRIENT_PRESETS = {
  aerated_methi_legume: {
    id: 'aerated_methi_legume',
    label: 'Aerated Legume Soil (Rhizobium)',
    mode: 'nitrogen_legumes',
    primaryLevel: 80,
    secondaryLevel: 85,
  },
  waterlogged_denitrification: {
    id: 'waterlogged_denitrification',
    label: 'Waterlogged Monsoon Paddy',
    mode: 'nitrogen_legumes',
    primaryLevel: 25,
    secondaryLevel: 10,
  },
  powai_eutrophication_bloom: {
    id: 'powai_eutrophication_bloom',
    label: 'Powai Lake Sewage/Nitrate Bloom',
    mode: 'eutrophication_cascade',
    primaryLevel: 85,
    secondaryLevel: 20,
  },
  silent_valley_canopy: {
    id: 'silent_valley_canopy',
    label: 'Western Ghats Deforestation (80%)',
    mode: 'deforestation_impact',
    primaryLevel: 80,
    secondaryLevel: 75,
  },
};

export function simulateNutrientCyclesEutrophication(params = {}) {
  const mode = NUTRIENT_MODES.includes(params.mode) ? params.mode : 'nitrogen_legumes';
  const primaryLevel = clamp(params.primaryLevel ?? 60, 0, 100);
  const secondaryLevel = clamp(params.secondaryLevel ?? 70, 0, 100);

  if (mode === 'nitrogen_legumes') {
    // primaryLevel = Legume nodule / Rhizobium density (0-100%)
    // secondaryLevel = Soil aeration / drainage (0-100%; low = waterlogged anaerobic soil)
    const nodulePct = primaryLevel;
    const aerationPct = secondaryLevel;

    // Illustrative biological fixation by Rhizobium and free-living microbes; lightning is a separate nitrate input.
    const rhizobiumFixationKgHa = roundTo((nodulePct / 100) * 180, 1);
    const freeLivingFixationKgHa = roundTo(18 + (aerationPct / 100) * 14, 1);
    const totalN2FixedKgHa = roundTo(rhizobiumFixationKgHa + freeLivingFixationKgHa, 1);

    // Ammonification by decomposers (proteins & urea -> NH4+)
    const ammonificationKgHa = roundTo(45 + (nodulePct / 100) * 25, 1);

    // Nitrification (NH4+ -> NO2- -> NO3-) requires aerobic soil
    const nitrificationEfficiency = clamp(aerationPct / 100, 0.05, 0.98);
    const nitrificationFluxKgHa = roundTo(
      (ammonificationKgHa + rhizobiumFixationKgHa * 0.45) * nitrificationEfficiency,
      1
    );

    // Denitrification (NO3- -> N2 gas by anaerobic Pseudomonas in waterlogged soil)
    const anaerobicFactor = Math.pow(1 - aerationPct / 100, 1.6);
    const denitrificationLossKgHa = roundTo((30 + nitrificationFluxKgHa * 0.7) * anaerobicFactor, 1);

    // Soil nitrate pool and active transport uptake by root hair cells (requires O2 for root ATP)
    const soilNitrateMgKg = roundTo(
      Math.max(4, 12 + nitrificationFluxKgHa * 0.55 + rhizobiumFixationKgHa * 0.25 - denitrificationLossKgHa * 0.75),
      1
    );
    const rootActiveTransportEfficiency = clamp(0.15 + 0.85 * (aerationPct / 100), 0.15, 1.0);
    const plantProteinYieldKgHa = roundTo(
      (soilNitrateMgKg * 1.4 + rhizobiumFixationKgHa * 0.55) * rootActiveTransportEfficiency * 6.25,
      1
    );

    return {
      mode,
      primaryLevel,
      secondaryLevel,
      nodulePct,
      aerationPct,
      rhizobiumFixationKgHa,
      freeLivingFixationKgHa,
      totalN2FixedKgHa,
      ammonificationKgHa,
      nitrificationFluxKgHa,
      denitrificationLossKgHa,
      soilNitrateMgKg,
      plantProteinYieldKgHa,
      dominantProcess:
        aerationPct < 30
          ? 'Anaerobic denitrification (NO₃⁻ → N₂)'
          : nodulePct >= 50
          ? 'Mutualistic Rhizobium fixation + aerobic nitrification'
          : 'Aerobic nitrification (NH₄⁺ → NO₂⁻ → NO₃⁻)',
      headlineMetric: soilNitrateMgKg,
      secondaryMetric: plantProteinYieldKgHa,
      summaryText:
        `Illustrative model: At ${nodulePct}% legume nodulation and ${aerationPct}% soil aeration: Rhizobium fixes ${rhizobiumFixationKgHa} kg N ha⁻¹ yr⁻¹, ` +
        `nitrifying bacteria produce ${nitrificationFluxKgHa} kg NO₃⁻-N ha⁻¹, denitrifiers lose ${denitrificationLossKgHa} kg N₂ ha⁻¹, ` +
        `yielding ${soilNitrateMgKg} mg kg⁻¹ soil NO₃⁻ and ${plantProteinYieldKgHa} kg ha⁻¹ plant protein.`,
    };
  }

  if (mode === 'eutrophication_cascade') {
    // primaryLevel = Nitrate fertiliser & sewage runoff loading (0-100%)
    // secondaryLevel = Water flow / surface re-aeration (0-100%)
    const runoffPct = primaryLevel;
    const flushingPct = secondaryLevel;

    const effectiveLoad = clamp(runoffPct * (1 - (flushingPct / 100) * 0.45), 0, 100);
    const nitrateMgL = roundTo(0.8 + (effectiveLoad / 100) * 28.0, 2);
    const surfaceAlgalBloomIdx = roundTo(clamp(10 + (effectiveLoad / 100) * 90, 5, 100), 1);
    const underwaterLightPct = roundTo(clamp(95 - (surfaceAlgalBloomIdx - 10) * 0.92, 4, 95), 1);
    const submergedPlantSurvivalPct = roundTo(clamp(underwaterLightPct * 1.04, 2, 100), 1);
    const deadOrganicDetritusIdx = roundTo(clamp(100 - submergedPlantSurvivalPct + surfaceAlgalBloomIdx * 0.45, 5, 130), 1);
    const aerobicBacteriaBodMgL = roundTo(1.2 + (deadOrganicDetritusIdx / 130) * 18.5, 2);

    // Dissolved oxygen (saturation ~8.6 mg L⁻¹ at 24 °C; hypoxia < 2.0 mg L⁻¹)
    const dissolvedOxygenMgL = roundTo(
      clamp(8.6 - aerobicBacteriaBodMgL * 0.44 + (flushingPct / 100) * 1.4, 0.4, 8.6),
      2
    );
    const fishSurvivalPct = roundTo(
      dissolvedOxygenMgL >= 5.0
        ? 98
        : dissolvedOxygenMgL >= 2.0
        ? 15 + ((dissolvedOxygenMgL - 2.0) / 3.0) * 83
        : Math.max(0, (dissolvedOxygenMgL / 2.0) * 15),
      1
    );

    const steps = [
      { step: 1, label: '1. Excess NO₃⁻ / sewage runoff', value: `${nitrateMgL} mg L⁻¹` },
      { step: 2, label: '2. Surface algal bloom surge', value: `${surfaceAlgalBloomIdx}% cover` },
      { step: 3, label: '3. Underwater sunlight blocked', value: `${underwaterLightPct}% light left` },
      { step: 4, label: '4. Submerged plants die (detritus)', value: `${submergedPlantSurvivalPct}% alive` },
      { step: 5, label: '5. Aerobic decomposer bacteria respire', value: `BOD ${aerobicBacteriaBodMgL} mg L⁻¹` },
      { step: 6, label: '6. Dissolved O₂ crashes (hypoxia)', value: `${dissolvedOxygenMgL} mg L⁻¹ O₂` },
      { step: 7, label: '7. Aerobic fish & invertebrates die', value: `${fishSurvivalPct}% fish survive` },
    ];

    return {
      mode,
      primaryLevel,
      secondaryLevel,
      runoffPct,
      flushingPct,
      nitrateMgL,
      surfaceAlgalBloomIdx,
      underwaterLightPct,
      submergedPlantSurvivalPct,
      deadOrganicDetritusIdx,
      aerobicBacteriaBodMgL,
      dissolvedOxygenMgL,
      fishSurvivalPct,
      steps,
      headlineMetric: dissolvedOxygenMgL,
      secondaryMetric: fishSurvivalPct,
      summaryText:
        `Illustrative model: Runoff load ${runoffPct}% drives surface algal bloom (${surfaceAlgalBloomIdx}%), cutting underwater light to ${underwaterLightPct}%. ` +
        `Decomposer bacteria respiring dead plants raise BOD to ${aerobicBacteriaBodMgL} mg L⁻¹, dropping dissolved O₂ to ${dissolvedOxygenMgL} mg L⁻¹ (${fishSurvivalPct}% fish survival).`,
    };
  }

  if (mode === 'carbon_keeling') {
    // primaryLevel = Fossil fuel combustion + livestock/paddy methane intensity (0-100%)
    // secondaryLevel = Forest photosynthetic carbon sink cover (0-100%)
    const emissionPct = primaryLevel;
    const forestCoverPct = secondaryLevel;

    const photosynthesisDrawdownGtC = roundTo(85 + (forestCoverPct / 100) * 45, 1);
    const plantAnimalMicrobeRespGtC = roundTo(118, 1);
    const fossilCombustionGtC = roundTo((emissionPct / 100) * 12.5, 2);
    const deforestationReleaseGtC = roundTo(((100 - forestCoverPct) / 100) * 3.2, 2);
    const oceanSinkGtC = roundTo(2.8 + (emissionPct / 100) * 1.2, 2);

    const netAtmosphericGainGtC = roundTo(
      plantAnimalMicrobeRespGtC +
        fossilCombustionGtC +
        deforestationReleaseGtC -
        photosynthesisDrawdownGtC -
        oceanSinkGtC,
      2
    );

    const atmosphericCo2Ppm = roundTo(
      clamp(280 + Math.max(0, (emissionPct * 1.45 + (100 - forestCoverPct) * 0.55)), 280, 520),
      1
    );
    const methanePpb = Math.round(720 + (emissionPct / 100) * 1250);
    const tempAnomalyC = roundTo(((atmosphericCo2Ppm - 280) / 145) * 1.25 + ((methanePpb - 720) / 1250) * 0.35, 2);

    return {
      mode,
      primaryLevel,
      secondaryLevel,
      emissionPct,
      forestCoverPct,
      photosynthesisDrawdownGtC,
      plantAnimalMicrobeRespGtC,
      fossilCombustionGtC,
      deforestationReleaseGtC,
      oceanSinkGtC,
      netAtmosphericGainGtC,
      atmosphericCo2Ppm,
      methanePpb,
      tempAnomalyC,
      headlineMetric: atmosphericCo2Ppm,
      secondaryMetric: tempAnomalyC,
      summaryText:
        `Illustrative model: With ${emissionPct}% fossil/methane emissions and ${forestCoverPct}% forest sink, atmospheric CO₂ reaches ${atmosphericCo2Ppm} ppm ` +
        `and CH₄ reaches ${methanePpb} ppb (enhanced greenhouse warming +${tempAnomalyC} °C).`,
    };
  }

  // mode === 'deforestation_impact'
  // primaryLevel = Canopy cleared % (0-100%)
  // secondaryLevel = Monsoon rainfall intensity (0-100%)
  const clearedPct = primaryLevel;
  const intactForestPct = roundTo(100 - clearedPct, 1);
  const rainIntensityPct = secondaryLevel;

  const biodiversityRetainedPct = roundTo(clamp(100 * Math.pow(intactForestPct / 100, 0.65), 4, 100), 1);
  const soilErosionTonsHa = roundTo(
    0.8 + Math.pow(clearedPct / 100, 1.5) * (0.4 + 0.6 * (rainIntensityPct / 100)) * 68,
    1
  );
  const nitrateLeachingKgHa = roundTo(2.5 + (clearedPct / 100) * (rainIntensityPct / 100) * 52, 1);
  const transpirationReturnPct = roundTo(clamp(15 + (intactForestPct / 100) * 65, 15, 80), 1);
  const floodRunoffIndex = roundTo(
    clamp(12 + (clearedPct / 100) * 62 + (rainIntensityPct / 100) * 26, 12, 100),
    1
  );
  const netCarbonReleaseTonsHa = roundTo((clearedPct / 100) * 165 - (intactForestPct / 100) * 8, 1);

  return {
    mode,
    primaryLevel,
    secondaryLevel,
    clearedPct,
    intactForestPct,
    rainIntensityPct,
    biodiversityRetainedPct,
    soilErosionTonsHa,
    nitrateLeachingKgHa,
    transpirationReturnPct,
    floodRunoffIndex,
    netCarbonReleaseTonsHa,
    headlineMetric: biodiversityRetainedPct,
    secondaryMetric: soilErosionTonsHa,
    summaryText:
      `Clearing ${clearedPct}% of forest canopy under ${rainIntensityPct}% monsoon rain cuts biodiversity to ${biodiversityRetainedPct}%, ` +
      `accelerates topsoil erosion to ${soilErosionTonsHa} t ha⁻¹ yr⁻¹, raises flood runoff index to ${floodRunoffIndex}, and releases ${netCarbonReleaseTonsHa} t C ha⁻¹.`,
  };
}

export function captureNutrientTrial(params = {}) {
  const sim = simulateNutrientCyclesEutrophication(params);
  return {
    mode: sim.mode,
    primaryLevel: sim.primaryLevel,
    secondaryLevel: sim.secondaryLevel,
    headlineMetric: sim.headlineMetric,
    secondaryMetric: sim.secondaryMetric,
    summaryText: sim.summaryText,
  };
}

export function compareNutrientTrials(trialA, trialB) {
  if (!trialA || !trialB) return null;
  return {
    deltaHeadline: roundTo(trialB.headlineMetric - trialA.headlineMetric, 2),
    deltaSecondary: roundTo(trialB.secondaryMetric - trialA.secondaryMetric, 2),
  };
}

// ============================================================================
// 3. BIOTECHNOLOGY, INDUSTRIAL FERMENTERS, RECOMBINANT INSULIN & CRISPR LAB
// ============================================================================

export const BIOTECH_MODES = [
  'recombinant_insulin',
  'industrial_fermenter',
  'yeast_enzyme_biotech',
  'gm_crops_crispr',
];

export const BIOTECH_PRESETS = {
  matched_ecori_insulin: {
    id: 'matched_ecori_insulin',
    label: 'Same Restriction Enzyme + Ligase',
    mode: 'recombinant_insulin',
    primaryParam: 90,
    secondaryParam: 80,
  },
  fermenter_optimum_37c: {
    id: 'fermenter_optimum_37c',
    label: 'Industrial Fermenter Optimum (37 °C)',
    mode: 'industrial_fermenter',
    primaryParam: 45,
    secondaryParam: 90,
  },
  fermenter_overheated_55c: {
    id: 'fermenter_overheated_55c',
    label: 'Unjacketed Overheat (55 °C Denatured)',
    mode: 'industrial_fermenter',
    primaryParam: 80,
    secondaryParam: 40,
  },
  bt_cotton_refuge: {
    id: 'bt_cotton_refuge',
    label: 'Bt Cotton + 25% Non-Bt Refuge',
    mode: 'gm_crops_crispr',
    primaryParam: 75,
    secondaryParam: 25,
  },
};

export function simulateBiotechFermenterPlasmid(params = {}) {
  const mode = BIOTECH_MODES.includes(params.mode) ? params.mode : 'recombinant_insulin';
  const primaryParam = clamp(params.primaryParam ?? 85, 0, 100);
  const secondaryParam = clamp(params.secondaryParam ?? 80, 0, 100);

  if (mode === 'recombinant_insulin') {
    // primaryParam = Restriction enzyme sticky-end match & DNA ligase efficiency (0-100%)
    // secondaryParam = Fermenter culture duration scaled (0-100% -> 1 to 10 hours, doubling every 20 min)
    const ligaseEffPct = primaryParam;
    // Presets combine assembly quality with an incompatible-end example below 25%.
    // Explicit enzyme names permit independent compatible-end comparisons.
    const insertEnzyme = params.insertEnzyme ?? 'EcoRI';
    const vectorEnzyme = params.vectorEnzyme ?? (ligaseEffPct >= 25 ? 'EcoRI' : 'BamHI');
    const compatiblePairs = new Set(['EcoRI/EcoRI', 'BamHI/BamHI', 'BglII/BglII', 'BamHI/BglII', 'BglII/BamHI']);
    const endsCompatible = compatiblePairs.has(`${insertEnzyme}/${vectorEnzyme}`);
    const intronFree = params.intronFree !== false;
    const bacterialControls = params.bacterialControls !== false;
    const productProcessed = params.productProcessed !== false;
    const constructExpressible = endsCompatible && intronFree && bacterialControls;
    const cultureHours = roundTo(1 + (secondaryParam / 100) * 9, 1);
    const doublings = roundTo(cultureHours * 3, 1); // 20 min generation time = 3 doublings per hour

    const stickyEndAnnealingPct = endsCompatible ? roundTo(ligaseEffPct * 0.96, 1) : 0;
    const recombinantPlasmidPct = endsCompatible ? roundTo(ligaseEffPct * 0.88, 1) : 0;

    // Cloned E. coli cells (×10⁶ mL⁻¹) capped by fermenter stationary density
    const rawFold = Math.pow(2, Math.min(doublings, 14));
    const transformedCellDensity = constructExpressible
      ? roundTo(Math.min(4800, 0.5 * (recombinantPlasmidPct / 100) * rawFold), 1)
      : 0;
    const humanInsulinYieldMgL = productProcessed ? roundTo(transformedCellDensity * 0.42, 1) : 0;

    const pipelineSteps = [
      {
        step: 1,
        title: '1. Prepare intron-free insulin coding DNA',
        detail: 'Synthetic DNA or cDNA, with bacterial expression controls; cut to compatible ends',
        active: true,
      },
      {
        step: 2,
        title: '2. Cut plasmid to compatible ends',
        detail: endsCompatible
          ? 'Compatible ends can pair; the same enzyme is one route'
          : 'Mismatched cut ends cannot base-pair with the human gene',
        active: endsCompatible,
      },
      {
        step: 3,
        title: '3. Join with DNA ligase to form recombinant plasmid',
        detail: `Complementary sticky ends base-pair; DNA ligase seals sugar-phosphate backbone (${recombinantPlasmidPct}% yield)`,
        active: endsCompatible,
      },
      {
        step: 4,
        title: '4. Insert recombinant plasmid into host bacteria',
        detail: 'E. coli cells take up the recombinant plasmid vector via transformation',
        active: endsCompatible,
      },
      {
        step: 5,
        title: '5. Clone in industrial fermenter & purify insulin',
        detail: `Idealised growth (${cultureHours} h), then processing, folding and purification; ${humanInsulinYieldMgL} mg L⁻¹ model yield`,
        active: endsCompatible,
      },
    ];

    return {
      mode,
      primaryParam,
      secondaryParam,
      ligaseEffPct,
      endsCompatible,
      intronFree,
      bacterialControls,
      productProcessed,
      constructExpressible,
      cultureHours,
      doublings,
      stickyEndAnnealingPct,
      recombinantPlasmidPct,
      transformedCellDensity,
      humanInsulinYieldMgL,
      pipelineSteps,
      headlineMetric: humanInsulinYieldMgL,
      secondaryMetric: recombinantPlasmidPct,
      summaryText: constructExpressible && productProcessed
        ? `Illustrative insulin model: compatible ends (${insertEnzyme}/${vectorEnzyme}), intron-free coding DNA, bacterial controls and ligase give ${recombinantPlasmidPct}% recombinant plasmids; ${cultureHours} h idealised growth followed by processing/purification gives ${humanInsulinYieldMgL} mg L⁻¹. Mature insulin has two chains.`
        : `Illustrative insulin model: incompatible ends, unusable coding DNA, missing expression controls or omitted product processing prevent a finished insulin product (${humanInsulinYieldMgL} mg L⁻¹).`,
    };
  }

  if (mode === 'industrial_fermenter') {
    // primaryParam (0-100%) mapped monotonically to fermenter temperature (15 to 65 °C)
    const tempC = roundTo(15 + (primaryParam / 100) * 50, 1);
    const controlPct = secondaryParam; // sterile O2 sparger, stirrer paddles & pH buffer control (0-100%)

    // Enzyme kinetic curve peaking at 37 °C, sharp thermal denaturation above 44 °C
    let tempFactor = 0;
    if (tempC <= 37) {
      tempFactor = Math.exp(-Math.pow((tempC - 37) / 14, 2));
    } else {
      tempFactor = Math.exp(-Math.pow((tempC - 37) / 6.5, 2));
    }
    const denatured = tempC > 45;

    const dissolvedO2Pct = roundTo(clamp(15 + controlPct * 0.82 - tempFactor * 12, 5, 98), 1);
    const phDrift = roundTo((1 - controlPct / 100) * 1.8, 2);
    const culturePh = roundTo(7.0 - phDrift, 2);
    const phFactor = Math.exp(-Math.pow(phDrift / 1.1, 2));
    const oxygenFactor = 0.15 + 0.85 * (controlPct / 100);

    const productYieldGL = roundTo(24.0 * tempFactor * phFactor * oxygenFactor, 2);
    const coolingHeatRemovedKw = roundTo(18 + tempFactor * oxygenFactor * 64, 1);

    return {
      mode,
      primaryParam,
      secondaryParam,
      tempC,
      controlPct,
      denatured,
      tempFactor: roundTo(tempFactor, 3),
      dissolvedO2Pct,
      culturePh,
      productYieldGL,
      coolingHeatRemovedKw,
      headlineMetric: productYieldGL,
      secondaryMetric: dissolvedO2Pct,
      summaryText:
        `Illustrative model: At ${tempC} °C (${denatured ? 'enzymes denatured above optimum' : 'active enzyme conformation'}) and ${controlPct}% sparger/pH/stirrer control ` +
        `(pH ${culturePh}, ${dissolvedO2Pct}% dissolved O₂, cooling jacket removing ${coolingHeatRemovedKw} kW heat), fermenter yield is ${productYieldGL} g L⁻¹.`,
    };
  }

  if (mode === 'yeast_enzyme_biotech') {
    // primaryParam (0-100%) mapped monotonically to operating temperature (15 to 75 °C)
    const tempC = roundTo(15 + (primaryParam / 100) * 60, 1);
    const enzymeLoadingPct = clamp(secondaryParam, 10, 100);

    // Biological washing powder (optimum ~38 °C; denatures >55 °C)
    const washTempFactor =
      tempC <= 38
        ? Math.exp(-Math.pow((tempC - 38) / 15, 2))
        : Math.exp(-Math.pow((tempC - 38) / 7.5, 2));
    const washStainRemovalPct = roundTo(
      clamp(18 + 80 * washTempFactor * (0.4 + 0.6 * (enzymeLoadingPct / 100)), 10, 99),
      1
    );

    // Pectinase fruit juice extraction (optimum ~40 °C)
    const pectinaseYieldMl = roundTo(
      55 + 45 * washTempFactor * (0.35 + 0.65 * (enzymeLoadingPct / 100)),
      1
    );
    const juiceClarityPct = roundTo(clamp(30 + 68 * washTempFactor * (enzymeLoadingPct / 100), 25, 98), 1);

    // Immobilised lactase in alginate beads (lactose -> glucose + galactose; 0% enzyme in milk)
    const lactoseHydrolysedPct = roundTo(
      clamp(99 * washTempFactor * (0.45 + 0.55 * (enzymeLoadingPct / 100)), 5, 99.5),
      1
    );

    // Yeast bread dough CO2 rise vs oven baking ethanol evaporation
    const yeastDoughCo2Cm3 = roundTo(
      tempC <= 36
        ? 180 * Math.exp(-Math.pow((tempC - 35) / 13, 2)) * (0.5 + 0.5 * (enzymeLoadingPct / 100))
        : 180 * Math.exp(-Math.pow((tempC - 35) / 6.0, 2)) * (0.5 + 0.5 * (enzymeLoadingPct / 100)),
      1
    );
    // Baking time, moisture and loaf geometry are absent: no residual ethanol prediction.
    const ethanolRemainingInBreadPct = null;

    return {
      mode,
      primaryParam,
      secondaryParam,
      tempC,
      enzymeLoadingPct,
      washStainRemovalPct,
      pectinaseYieldMl,
      juiceClarityPct,
      lactoseHydrolysedPct,
      yeastDoughCo2Cm3,
      ethanolRemainingInBreadPct,
      enzymeDenatured: tempC > 52,
      headlineMetric: washStainRemovalPct,
      secondaryMetric: lactoseHydrolysedPct,
      summaryText:
        `Illustrative model: At ${tempC} °C and ${enzymeLoadingPct}% enzyme loading: biological washing powder removes ${washStainRemovalPct}% of protein/lipid stains, ` +
        `pectinase yields ${pectinaseYieldMl} mL clarified juice (${juiceClarityPct}% clarity), immobilised lactase hydrolyses ${lactoseHydrolysedPct}% of lactose into glucose + galactose, ` +
        `and yeast evolves ${yeastDoughCo2Cm3} cm³ CO₂. Baking removes much ethanol; the remaining amount cannot be inferred from this temperature control alone.`,
    };
  }

  // mode === 'gm_crops_crispr'
  // primaryParam = Bollworm pest pressure & Vitamin A deficiency challenge (0-100%)
  // secondaryParam = Ecological stewardship / non-Bt refuge zone % (0-50%, scaled from 0-100 slider)
  const pestPressurePct = primaryParam;
  const refugePct = roundTo((secondaryParam / 100) * 40, 1);

  const conventionalYieldTonsHa = roundTo(Math.max(0.6, 3.8 * (1 - (pestPressurePct / 100) * 0.68)), 2);
  const btCropYieldTonsHa = roundTo(
    Math.max(conventionalYieldTonsHa, 3.8 * (1 - (pestPressurePct / 100) * (0.06 + (refugePct / 100) * 0.22))),
    2
  );
  const insecticideReductionPct = roundTo(clamp(82 - refugePct * 0.4, 45, 85), 1);
  const goldenRiceBetaCaroteneUgG = 35.0; // μg g⁻¹ dry endosperm provitamin A
  const pestResistanceRiskPct = roundTo(
    clamp((pestPressurePct * 0.85) * Math.exp(-refugePct / 12), 4, 95),
    1
  );

  const comparisonRows = [
    {
      dimension: 'Gene source',
      selectiveBreeding: 'Same species / cross-fertile relatives only',
      geneticModification: 'Any species across kingdoms (transgenic)',
      crisprEditing: 'Guide targets suitable DNA near a PAM',
    },
    {
      dimension: 'Genetic precision',
      selectiveBreeding: 'Thousands of linked alleles shuffled together',
      geneticModification: 'Chosen insertion, deletion or base changes; test outcome',
      crisprEditing: 'Targeted cut, then repair; check unintended changes',
    },
    {
      dimension: 'Timescale',
      selectiveBreeding: 'Many generations (years or decades)',
      geneticModification: 'Initial modification, then selection and testing',
      crisprEditing: 'Editing, repair, selection and validation',
    },
  ];

  return {
    mode,
    primaryParam,
    secondaryParam,
    pestPressurePct,
    refugePct,
    conventionalYieldTonsHa,
    btCropYieldTonsHa,
    insecticideReductionPct,
    goldenRiceBetaCaroteneUgG,
    pestResistanceRiskPct,
    comparisonRows,
    headlineMetric: btCropYieldTonsHa,
    secondaryMetric: pestResistanceRiskPct,
    summaryText:
      `Under ${pestPressurePct}% pest pressure with a ${refugePct}% non-Bt refuge zone, Bt cotton harvests ${btCropYieldTonsHa} t ha⁻¹ ` +
      `(vs ${conventionalYieldTonsHa} t ha⁻¹ conventional), cuts chemical insecticide sprays by ${insecticideReductionPct}%, ` +
      `and keeps Bt-resistant pest selection risk at ${pestResistanceRiskPct}%.`,
  };
}

export function captureBiotechTrial(params = {}) {
  const sim = simulateBiotechFermenterPlasmid(params);
  return {
    mode: sim.mode,
    primaryParam: sim.primaryParam,
    secondaryParam: sim.secondaryParam,
    headlineMetric: sim.headlineMetric,
    secondaryMetric: sim.secondaryMetric,
    summaryText: sim.summaryText,
  };
}

export function compareBiotechTrials(trialA, trialB) {
  if (!trialA || !trialB) return null;
  return {
    deltaHeadline: roundTo(trialB.headlineMetric - trialA.headlineMetric, 2),
    deltaSecondary: roundTo(trialB.secondaryMetric - trialA.secondaryMetric, 2),
  };
}
