// Pure, deterministic physiological and physical calculations for Chapter 9 coordination widgets.
// Keep DOM and Canvas rendering out of this module so Node tests can verify every invariant directly.

const clamp = (v, lo, hi, fallback) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
};

const round = (v, dp = 2) => {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
};

// ---------------------------------------------------------------------------
// 1. Reflex arc, myelinated vs unmyelinated conduction, ruler-drop & Siddiqi para^ts
// ---------------------------------------------------------------------------
export const REFLEX_MODES = Object.freeze([
  Object.freeze({
    idx: 0,
    id: 'myelinated-reflex',
    label: 'Myelinated reflex arc',
    pathway: 'Receptor → sensory → spinal relay → motor → biceps',
    synapseCount: 2,
    pathLengthM: 1.3,
    brainDelayMs: 0,
  }),
  Object.freeze({
    idx: 1,
    id: 'unmyelinated-pathway',
    label: 'Unmyelinated axon loop',
    pathway: 'Continuous membrane wave (no myelin sheath)',
    synapseCount: 2,
    pathLengthM: 1.3,
    brainDelayMs: 0,
  }),
  Object.freeze({
    idx: 2,
    id: 'voluntary-ruler',
    label: 'Voluntary ruler catch',
    pathway: 'Retina → visual/motor cortex → spinal cord → hand',
    synapseCount: 6,
    pathLengthM: 1.4,
    brainDelayMs: 135,
  }),
  Object.freeze({
    idx: 3,
    id: 'siddiqi-para-fly',
    label: 'Siddiqi para^ts Na⁺ mutant',
    pathway: 'Drosophila voltage-gated Na⁺ channel temperature test',
    synapseCount: 1,
    pathLengthM: 1.3,
    brainDelayMs: 0,
  }),
]);

export function reflexActionAccount(modeIdx = 0, diameterUm = 12, tempC = 25) {
  const mode = Math.round(clamp(modeIdx, 0, 3, 0));
  const dUm = round(clamp(diameterUm, 2, 20, 12), 1);
  const tC = round(clamp(tempC, 18, 36, 25), 1);
  const spec = REFLEX_MODES[mode];

  // Temperature Q10 scaling around 25 C for normal gating kinetics (~1.35 per 10 C)
  const q10Factor = Math.pow(1.35, (tC - 25) / 10);

  // Siddiqi & Benzer (1976) para^ts mutant: reversible voltage-gated Na+ channel block at T >= 30 C
  const paraBlocked = mode === 3 && tC >= 30;
  const paraPartial = mode === 3 && tC >= 28.5 && tC < 30;

  // Conduction velocity (m/s):
  // Myelinated vertebrate nerve (Hursh 1939 / Rushton 1951): v ≈ 6 * d (in um) adjusted modestly by temperature
  // Unmyelinated fibre (Hodgkin 1954 cable scaling): v ≈ 1.45 * sqrt(d)
  let velocityMS = 0;
  if (paraBlocked) {
    velocityMS = 0;
  } else if (mode === 1) {
    velocityMS = round(1.45 * Math.sqrt(dUm) * q10Factor, 2);
  } else {
    const baseV = 6.0 * dUm * q10Factor;
    velocityMS = round(paraPartial ? baseV * 0.45 : baseV, 2);
  }

  // Action potential voltages (mV)
  const restingMv = -70;
  const thresholdMv = -55;
  const peakMv = paraBlocked ? -70 : paraPartial ? -5 : 30;
  const undershootMv = paraBlocked ? -70 : -75;
  const naConductancePct = paraBlocked ? 0 : paraPartial ? 35 : 100;

  // Latency budget (ms) across the pathway
  const axonalMs = paraBlocked ? Infinity : round((spec.pathLengthM / velocityMS) * 1000, 1);
  const synapticMs = paraBlocked ? Infinity : round(spec.synapseCount * 0.9, 1);
  const muscleActivationMs = paraBlocked ? Infinity : 16.0;
  const totalLatencyMs = paraBlocked
    ? Infinity
    : round(axonalMs + synapticMs + spec.brainDelayMs + muscleActivationMs, 1);

  // Equivalent free-fall ruler distance d = 0.5 * g * t^2 (in cm, with g = 980 cm/s^2)
  const rulerDropCm = paraBlocked
    ? null
    : round(0.5 * 980 * Math.pow(totalLatencyMs / 1000, 2), 1);

  return {
    mode,
    modeLabel: spec.label,
    pathway: spec.pathway,
    diameterUm: dUm,
    tempC: tC,
    paraBlocked,
    paraPartial,
    velocityMS,
    restingMv,
    thresholdMv,
    peakMv,
    undershootMv,
    naConductancePct,
    axonalMs,
    synapticMs,
    brainDelayMs: spec.brainDelayMs,
    muscleActivationMs,
    totalLatencyMs,
    rulerDropCm,
  };
}

export function captureReflex(q) {
  return Object.freeze({
    mode: q.mode,
    modeLabel: q.modeLabel,
    diameterUm: q.diameterUm,
    tempC: q.tempC,
    paraBlocked: q.paraBlocked,
    velocityMS: q.velocityMS,
    peakMv: q.peakMv,
    totalLatencyMs: q.totalLatencyMs,
    rulerDropCm: q.rulerDropCm,
  });
}

export function compareReflex(a, b) {
  if (!a || !b) return { valid: false, contrastsPathway: false, reason: 'Capture two trials to compare.' };
  if (a.mode === b.mode && a.diameterUm === b.diameterUm && a.tempC === b.tempC) {
    return { valid: false, contrastsPathway: false, reason: 'Both captures have identical settings.' };
  }
  const contrastsPathway = a.mode !== b.mode || a.paraBlocked !== b.paraBlocked;
  const contrastsMyelinOrRoute = contrastsPathway || a.diameterUm !== b.diameterUm;
  return {
    valid: contrastsMyelinOrRoute,
    contrastsPathway,
    speedRatio:
      a.velocityMS > 0 && b.velocityMS > 0
        ? round(Math.max(a.velocityMS, b.velocityMS) / Math.min(a.velocityMS, b.velocityMS), 2)
        : null,
    reason: contrastsPathway
      ? 'Contrasting reflex/conduction pathways captured for comparison.'
      : 'Two diameter or temperature states captured; switch pathway tab or cross 30 °C in para^ts for full contrast.',
  };
}

// ---------------------------------------------------------------------------
// 2. Chemical synapse: 4-step sequence, one-way rule & receptor/enzyme pharmacology
// ---------------------------------------------------------------------------
export const SYNAPSE_MODES = Object.freeze([
  Object.freeze({
    idx: 0,
    id: 'forward-normal',
    label: 'Forward (Pre → Post)',
    direction: 'Presynaptic knob → Postsynaptic membrane',
    description: 'Normal orthodromic transmission across the cleft',
  }),
  Object.freeze({
    idx: 1,
    id: 'reverse-test',
    label: 'Reverse test (Post → Pre)',
    direction: 'Postsynaptic membrane → Presynaptic knob',
    description: 'Stimulate postsynaptic side first (0610 14.1.10 one-way test)',
  }),
  Object.freeze({
    idx: 2,
    id: 'receptor-blocker',
    label: 'Receptor blocker (Curare)',
    direction: 'Presynaptic knob → Blocked receptors',
    description: 'Competitive antagonist occupies 85% of postsynaptic receptors',
  }),
  Object.freeze({
    idx: 3,
    id: 'esterase-inhibitor',
    label: 'Enzyme block (AChE inhibited)',
    direction: 'Presynaptic knob → Uncleared cleft',
    description: 'Breakdown enzyme inhibited so neurotransmitter stays in cleft',
  }),
]);

export function synapseAccount(modeIdx = 0, stimFreqHz = 40, cleftWidthNm = 20) {
  const mode = Math.round(clamp(modeIdx, 0, 3, 0));
  const freqHz = Math.round(clamp(stimFreqHz, 10, 100, 40));
  const cleftNm = Math.round(clamp(cleftWidthNm, 15, 60, 20));
  const spec = SYNAPSE_MODES[mode];

  // Presynaptic vesicles fused per impulse burst (scales with stimulation frequency, 0 in reverse test!)
  const vesiclesFused = mode === 1 ? 0 : Math.max(2, Math.round(freqHz / 8));
  const moleculesReleased = vesiclesFused * 5000;

  // Diffusion time across cleft: t_diff = x^2 / (2 * D) with D = 4.0e-10 m^2/s = 4.0e8 nm^2/s, plus 0.45 ms exocytosis/gating
  const pureDiffusionUs = round((cleftNm * cleftNm) / (2 * 400), 2);
  const cleftDelayMs = mode === 1 ? 0 : round(0.45 + (cleftNm / 20) * 0.25, 2);

  // Fraction of transmitter reaching postsynaptic side before dilution
  const cleftEfficiency = round(Math.min(1, 20 / cleftNm), 2);

  // Available postsynaptic receptors (%) and bound receptors (%)
  const availableReceptorsPct = mode === 2 ? 15 : 100;
  let boundReceptorsPct = 0;
  if (mode === 0) {
    boundReceptorsPct = Math.min(95, Math.round(vesiclesFused * 11 * cleftEfficiency));
  } else if (mode === 1) {
    boundReceptorsPct = 0;
  } else if (mode === 2) {
    boundReceptorsPct = Math.min(15, Math.round(vesiclesFused * 2.2 * cleftEfficiency));
  } else if (mode === 3) {
    boundReceptorsPct = Math.min(99, Math.round(Math.min(95, vesiclesFused * 11 * cleftEfficiency) * 1.45));
  }

  // Postsynaptic membrane potential (resting -70 mV, threshold -55 mV)
  const epspDepolarisationMv = round(boundReceptorsPct * 0.36, 1);
  const postPotentialMv = round(-70 + epspDepolarisationMv, 1);
  const postImpulseFired = postPotentialMv >= -55;
  const synapseResetState =
    mode === 3
      ? 'Uncleared (continuous depolarisation / spasm)'
      : mode === 1
        ? 'Blocked (no vesicles on postsynaptic side)'
        : postImpulseFired
          ? 'Fires impulse, then cleared rapidly by enzyme'
          : 'Sub-threshold EPSP (no impulse fired)';

  return {
    mode,
    modeLabel: spec.label,
    direction: spec.direction,
    stimFreqHz: freqHz,
    cleftWidthNm: cleftNm,
    vesiclesFused,
    moleculesReleased,
    pureDiffusionUs,
    cleftDelayMs,
    availableReceptorsPct,
    boundReceptorsPct,
    epspDepolarisationMv,
    postPotentialMv,
    postImpulseFired,
    synapseResetState,
    oneWayReason:
      'Vesicles are present ONLY in the presynaptic knob; receptor proteins are ONLY on the postsynaptic membrane.',
  };
}

export function captureSynapse(q) {
  return Object.freeze({
    mode: q.mode,
    modeLabel: q.modeLabel,
    stimFreqHz: q.stimFreqHz,
    cleftWidthNm: q.cleftWidthNm,
    vesiclesFused: q.vesiclesFused,
    boundReceptorsPct: q.boundReceptorsPct,
    postPotentialMv: q.postPotentialMv,
    postImpulseFired: q.postImpulseFired,
  });
}

export function compareSynapse(a, b) {
  if (!a || !b) return { valid: false, forwardAndReverse: false, reason: 'Capture two synapse trials to compare.' };
  if (a.mode === b.mode && a.stimFreqHz === b.stimFreqHz && a.cleftWidthNm === b.cleftWidthNm) {
    return { valid: false, forwardAndReverse: false, reason: 'Both synapse captures have identical settings.' };
  }
  const modes = new Set([a.mode, b.mode]);
  const forwardAndReverse = modes.has(0) && modes.has(1);
  const contrastsTransmission = a.postImpulseFired !== b.postImpulseFired || a.mode !== b.mode;
  return {
    valid: contrastsTransmission,
    forwardAndReverse,
    reason: contrastsTransmission
      ? 'Contrasting synapse transmission states captured for comparison.'
      : 'Two similar synapse states captured; compare Forward (tab 0) with Reverse (tab 1) or Receptor blocker (tab 2).',
  };
}

// ---------------------------------------------------------------------------
// 3. Eye accommodation, pupil reflex & plant shoot/root auxin tropisms (0610 14.2 & 14.5)
// ---------------------------------------------------------------------------
export const EYE_TROPISM_MODES = Object.freeze([
  Object.freeze({
    idx: 0,
    id: 'eye-accommodation',
    label: 'Eye accommodation (Near/Far)',
  }),
  Object.freeze({
    idx: 1,
    id: 'pupil-reflex',
    label: 'Pupil reflex (Bright/Dim)',
  }),
  Object.freeze({
    idx: 2,
    id: 'shoot-phototropism',
    label: 'Shoot phototropism (Auxin)',
  }),
  Object.freeze({
    idx: 3,
    id: 'seedling-gravitropism',
    label: 'Shoot vs Root gravitropism',
  }),
]);

export function eyeTropismAccount(modeIdx = 0, objectDistCm = 35, lightIntensityPct = 75) {
  const mode = Math.round(clamp(modeIdx, 0, 3, 0));
  const distCm = Math.round(clamp(objectDistCm, 25, 600, 35));
  const lightPct = Math.round(clamp(lightIntensityPct, 5, 100, 75));

  // 1. Eye Accommodation mechanics (0610 14.2.6 & Book 2 Ch 10 thin-lens optics)
  // Retinal image distance d_i = 2.0 cm (0.020 m). Required optical power P = 1/d_o + 1/d_i = 1/(distCm/100) + 50 D
  const totalPowerDioptres = round(50.0 + 100.0 / distCm, 2);
  const corneaPowerDioptres = 38.0; // Fixed ~2/3 of total refraction at air-cornea interface
  const lensPowerDioptres = round(totalPowerDioptres - corneaPowerDioptres, 2);

  // Near factor: 1.0 at 25 cm (maximum accommodation), ~0.0 at 600 cm (distant rest)
  const nearFactor = round((100 / distCm - 100 / 600) / (100 / 25 - 100 / 600), 3);
  const isNear = distCm <= 60;
  const ciliaryState = isNear
    ? 'Contracted (smaller sphincter ring)'
    : distCm >= 200
      ? 'Relaxed (wider ring)'
      : 'Moderately contracted';
  const ligamentTension = isNear
    ? 'Slackened (loosened)'
    : distCm >= 200
      ? 'Pulled tight (taut)'
      : 'Moderate tension';
  const lensShape = isNear
    ? 'Thicker / more convex (stronger refraction)'
    : distCm >= 200
      ? 'Thinner / less convex (weaker refraction)'
      : 'Intermediate convexity';
  const lensThicknessMm = round(3.6 + 1.0 * nearFactor, 2);
  const ciliaryRingRadiusMm = round(5.5 - 0.9 * nearFactor, 2);

  // 2. Pupil reflex mechanics (0610 14.2.4–14.2.5)
  const pupilDiameterMm = round(7.5 - 0.055 * lightPct, 2);
  const circularIrisMuscle = lightPct >= 60 ? 'Contracted' : lightPct <= 30 ? 'Relaxed' : 'Balanced tone';
  const radialIrisMuscle = lightPct >= 60 ? 'Relaxed' : lightPct <= 30 ? 'Contracted' : 'Balanced tone';
  const activePhotoreceptor =
    lightPct >= 45
      ? 'Cones active (3 types at fovea: bright colour vision)'
      : 'Rods dominant (peripheral retina: dim monochrome vision)';

  // 3. Plant shoot phototropism & gravitropism auxin account (0610 14.5.4–14.5.5)
  // Lateral auxin redistribution under unilateral light (lightIntensityPct drives lateral transport to shaded side)
  const shadedAuxinPct = mode === 2 ? Math.round(50 + 0.22 * lightPct) : mode === 3 ? 68 : 50;
  const litOrUpperAuxinPct = 100 - shadedAuxinPct;
  const shadedElongationUmHr = round(40 + (shadedAuxinPct - 50) * 3.2, 1);
  const litElongationUmHr = round(40 - (shadedAuxinPct - 50) * 1.1, 1);
  const shootBendAngleDeg = round((shadedAuxinPct - 50) * 1.8, 1);
  const rootBendAngleDeg = mode === 3 ? -round((shadedAuxinPct - 50) * 1.5, 1) : 0;

  return {
    mode,
    modeLabel: EYE_TROPISM_MODES[mode].label,
    objectDistCm: distCm,
    lightIntensityPct: lightPct,
    isNear,
    totalPowerDioptres,
    corneaPowerDioptres,
    lensPowerDioptres,
    ciliaryState,
    ligamentTension,
    lensShape,
    lensThicknessMm,
    ciliaryRingRadiusMm,
    pupilDiameterMm,
    circularIrisMuscle,
    radialIrisMuscle,
    activePhotoreceptor,
    shadedAuxinPct,
    litOrUpperAuxinPct,
    shadedElongationUmHr,
    litElongationUmHr,
    shootBendAngleDeg,
    rootBendAngleDeg,
  };
}

export function captureEyeTropism(q) {
  return Object.freeze({
    mode: q.mode,
    modeLabel: q.modeLabel,
    objectDistCm: q.objectDistCm,
    lightIntensityPct: q.lightIntensityPct,
    isNear: q.isNear,
    totalPowerDioptres: q.totalPowerDioptres,
    ciliaryState: q.ciliaryState,
    ligamentTension: q.ligamentTension,
    lensThicknessMm: q.lensThicknessMm,
    pupilDiameterMm: q.pupilDiameterMm,
    shadedAuxinPct: q.shadedAuxinPct,
    shootBendAngleDeg: q.shootBendAngleDeg,
  });
}

export function compareEyeTropism(a, b) {
  if (!a || !b) return { valid: false, nearVsFar: false, brightVsDim: false, reason: 'Capture two trials to compare.' };
  if (a.mode === b.mode && a.objectDistCm === b.objectDistCm && a.lightIntensityPct === b.lightIntensityPct) {
    return { valid: false, nearVsFar: false, brightVsDim: false, reason: 'Both captures have identical settings.' };
  }
  const nearVsFar = (a.objectDistCm <= 60 && b.objectDistCm >= 200) || (b.objectDistCm <= 60 && a.objectDistCm >= 200);
  const brightVsDim = Math.abs(a.lightIntensityPct - b.lightIntensityPct) >= 35;
  const modeDiff = a.mode !== b.mode;
  const valid = nearVsFar || brightVsDim || modeDiff;
  return {
    valid,
    nearVsFar,
    brightVsDim,
    reason: valid
      ? 'Contrasting accommodation or tropism states captured for comparison.'
      : 'Capture a Near (≤60 cm) and Distant (≥200 cm) state or change light intensity/tab to compare.',
  };
}
