// Chapter 8 contracts, established in grounding/ch08.md before implementation.
const bounded = (value, min, max, fallback) => Number.isFinite(+value) ? Math.max(min, Math.min(max, +value)) : fallback;
const integer = (v, lo, hi, fallback) => Math.round(bounded(v, lo, hi, fallback));

export const breathingModes = ['Quiet inhalation', 'Quiet exhalation', 'Forced exhalation / exercise', 'Bell-jar model check'];

const breathingModeDetails = [
  [
    'External intercostals lift ribs up and out; diaphragm contracts and flattens down.',
    'Thoracic volume rises; alveolar gauge pressure drops slightly (P_alv ≈ −1 mmHg).',
    'Higher outside atmospheric pressure (0 mmHg gauge) pushes air into the lungs.',
  ],
  [
    'Diaphragm and external intercostals relax; elastic lung recoil shrinks thoracic volume.',
    'Alveolar pressure rises slightly above outside air (P_alv ≈ +1 mmHg), pushing air out.',
    'Pleural pressure stays negative (P_ip ≈ −4 mmHg) so lungs remain held against chest wall.',
  ],
  [
    'Movement signals and working-muscle feedback increase breathing alongside chemical regulation.',
    'Internal intercostal and abdominal muscles pull ribs down and in during forced exhalation.',
    'Both rate and depth of breathing increase, raising alveolar ventilation steeply.',
  ],
  [
    'Pulling the rubber sheet down increases jar volume and lowers internal pressure.',
    'Matches diaphragm lowering pressure so outside atmospheric pressure pushes air in.',
    'Misleads: rigid jar walls cannot swing like ribs; wide air gap ≠ thin fluid pleural cavity.',
  ],
];

export function ventilationAccount(mode = 0, tidalVolumeMl = 500, rateBpm = 12, deadSpaceMl = 150) {
  const focus = integer(mode, 0, 3, 0);
  const vt = integer(tidalVolumeMl, 200, 2000, 500);
  const rate = integer(rateBpm, 6, 40, 12);
  const vd = integer(deadSpaceMl, 100, 200, 150);
  const freshPerBreathMl = Math.max(0, vt - vd);
  const minuteVentilationLMin = (vt * rate) / 1000;
  const deadSpaceVentilationLMin = (Math.min(vt, vd) * rate) / 1000;
  const alveolarVentilationLMin = (freshPerBreathMl * rate) / 1000;

  // Gauge pressures relative to sea-level P_atm = 760 mmHg (0 mmHg gauge)
  const pAlvMmHg = focus === 0 ? -1 : focus === 1 ? 1 : focus === 2 ? 3 : -1;
  const pIpMmHg = focus === 0 ? -6 : focus === 1 ? -4 : focus === 2 ? -2 : -5;
  const transpulmonaryMmHg = pAlvMmHg - pIpMmHg;

  // Alveolar and pulmonary capillary partial pressures (mmHg)
  const alvPO2 = focus === 2 ? 110 : 104;
  const alvPCO2 = 40;
  const capInPO2 = focus === 2 ? 30 : 40;
  const capInPCO2 = focus === 2 ? 50 : 45;
  const o2GradientMmHg = alvPO2 - capInPO2;
  const co2GradientMmHg = capInPCO2 - alvPCO2;

  return {
    focus,
    modeName: breathingModes[focus],
    vt,
    rate,
    vd,
    freshPerBreathMl,
    minuteVentilationLMin,
    deadSpaceVentilationLMin,
    alveolarVentilationLMin,
    pAlvMmHg,
    pIpMmHg,
    transpulmonaryMmHg,
    alvPO2,
    alvPCO2,
    capInPO2,
    capInPCO2,
    o2GradientMmHg,
    co2GradientMmHg,
    inspiredPct: { o2: 21, co2: 0.04, n2: 78, water: 'Variable' },
    expiredPct: { o2: 16, co2: 4, n2: 78, water: 'Saturated' },
    lines: [...breathingModeDetails[focus]],
  };
}

export function captureVentilation(q) {
  if (!q || !Number.isFinite(q.vt) || !Number.isFinite(q.rate) || q.vt <= 0 || q.rate <= 0) return null;
  return Object.freeze({
    focus: q.focus,
    modeName: q.modeName,
    vt: q.vt,
    rate: q.rate,
    vd: q.vd,
    freshPerBreathMl: q.freshPerBreathMl,
    minuteVentilationLMin: q.minuteVentilationLMin,
    alveolarVentilationLMin: q.alveolarVentilationLMin,
    pAlvMmHg: q.pAlvMmHg,
    pIpMmHg: q.pIpMmHg,
  });
}

export function compareVentilation(a, b) {
  if (!a || !b) return { valid: false, reason: 'Capture two ventilation trials to compare dead-space effects.' };
  if (a.vt === b.vt && a.rate === b.rate) return { valid: false, reason: 'Same tidal volume and rate: change depth or rate for a comparison.' };
  const equalMinuteDiffAlveolar = Math.abs(a.minuteVentilationLMin - b.minuteVentilationLMin) < 1e-6 && a.alveolarVentilationLMin !== b.alveolarVentilationLMin;
  return {
    valid: true,
    equalMinuteDiffAlveolar,
    reason: equalMinuteDiffAlveolar
      ? 'Equal minute ventilation, different alveolar ventilation: deeper breaths waste less dead space.'
      : 'Two distinct ventilation trials captured: compare total vs alveolar ventilation.',
  };
}

// Section 8.2 & 8.3: Harvey's 1628 conservative Troy/apothecaries' account + Double Pump + Post-natal VSD
export const pumpModes = ['Intact double pump', 'Harvey 1628 vs Modern', 'Post-natal VSD case', 'Fish single circuit'];
export const cardiacStages = [
  'Vena cava → right atrium',
  'Tricuspid valve → right ventricle',
  'Pulmonary artery → lungs (O₂ loads)',
  'Pulmonary vein → left atrium → mitral valve',
  'Left ventricle → aorta → body organs',
];

export function harveyAccount(drachmsPerBeat = 1, beatsHalfHour = 1000) {
  const drachms = bounded(drachmsPerBeat, 0.5, 8, 1);
  const beats = integer(beatsHalfHour, 500, 4000, 1000);
  // 1 Troy/apothecaries' ounce = 8 drachms; 1 Troy pound = 12 ounces = 96 drachms; 1 drachm ≈ 3.8879346 g
  const totalDrachms = drachms * beats;
  const totalOunces = totalDrachms / 8;
  const troyPounds = Math.floor(totalOunces / 12);
  const remOunces = +(totalOunces - troyPounds * 12).toFixed(2);
  const approxKgHalfHour = +(totalDrachms * 3.8879346 / 1000).toFixed(2);
  return {
    drachms,
    beats,
    totalDrachms,
    totalOunces,
    troyPounds,
    remOunces,
    troyLabel: `${troyPounds} lb ${remOunces} oz`,
    approxKgHalfHour,
  };
}

export function circulationAccount(mode = 0, heartRateBpm = 70, strokeVolumeMl = 60, stage = 0) {
  const focusMode = integer(mode, 0, 3, 0);
  const hr = integer(heartRateBpm, 40, 180, 70);
  const sv = integer(strokeVolumeMl, 30, 120, 60);
  const step = integer(stage, 0, 4, 0);

  const coMlMin = hr * sv;
  const coLMin = +(coMlMin / 1000).toFixed(2);
  const coLHour = +(coLMin * 60).toFixed(1);
  const harvey1Drachm = harveyAccount(1, 1000);
  const harveyHalfOz = harveyAccount(4, 1000);

  // Pressures and pulmonary/systemic flows by mode
  const isVsd = focusMode === 2;
  const isFish = focusMode === 3;
  const rvSystolicMmHg = isFish ? 35 : isVsd ? 35 : 25;
  const lvSystolicMmHg = isFish ? 35 : isVsd ? 115 : 120;
  const systemicMeanMmHg = isFish ? 18 : 93;
  const pulmonaryMeanMmHg = isFish ? 30 : isVsd ? 24 : 15;

  // In intact series mammal (and fish), steady-state Qp = Qs = CO.
  // In uncomplicated post-natal VSD, LV systolic (115 mmHg) >> RV systolic (35 mmHg) drives a left-to-right shunt!
  const qsLMin = coLMin;
  const shuntLToRLMin = isVsd ? +(coLMin * 0.6).toFixed(2) : 0;
  const qpLMin = +(qsLMin + shuntLToRLMin).toFixed(2);
  const qpQsRatio = +(qpLMin / qsLMin).toFixed(2);
  const shuntDirection = isVsd ? 'Left-to-right (LV → RV → pulmonary artery → lungs)' : 'None (intact septum)';

  const modeLines = [
    [
      `Stage ${step}: ${cardiacStages[step]}.`,
      'Right ventricular systolic pressure ~25 mmHg; pressure falls further along lung vessels.',
      'Left ventricle has a ~3× thicker muscular wall to pump the same flow at ~120 mmHg to the body.',
    ],
    [
      'Harvey (Frankfurt, 1628) assumed 1,000 beats in 30 min ejecting 1 drachm → 10 lb 5 oz (~3.89 kg).',
      `Chosen modern metric calculation: ${hr} bpm × ${sv} mL = ${coLMin.toFixed(2)} L/min (${coLHour.toFixed(1)} L/h).`,
      'Arithmetic rules out single-pass production; venous valves (Ch. XIII) prove one-way return.',
    ],
    [
      'Post-natal LV systolic pressure (~115 mmHg) far exceeds RV systolic pressure (~35 mmHg).',
      `Already-oxygenated blood shunts LEFT-TO-RIGHT (LV → RV), raising lung flow Qp to ${qpLMin.toFixed(2)} L/min.`,
      'Causes a turbulent systolic murmur and pulmonary volume overload, not immediate blue skin.',
    ],
    [
      'Fish single circulation: 1 atrium and 1 ventricle pump blood through gill capillaries first.',
      'Narrow gill capillaries cause a large pressure drop before blood enters systemic body tissues.',
      'Suits a water-supported ectotherm; mammals re-pressurise blood in the left heart after the lungs.',
    ],
  ][focusMode];

  return {
    focusMode,
    modeName: pumpModes[focusMode],
    hr,
    sv,
    step,
    stageName: cardiacStages[step],
    coMlMin,
    coLMin,
    coLHour,
    harvey1Drachm,
    harveyHalfOz,
    rvSystolicMmHg,
    lvSystolicMmHg,
    systemicMeanMmHg,
    pulmonaryMeanMmHg,
    qsLMin,
    qpLMin,
    shuntLToRLMin,
    qpQsRatio,
    shuntDirection,
    avValves: step === 1 || step === 3 ? 'Open (filling ventricle)' : 'Closed ("lub" prevents backflow)',
    semilunarValves: step === 2 || step === 4 ? 'Open (ventricular ejection)' : 'Closed ("dub" prevents backflow)',
    lines: modeLines,
  };
}

export function captureCirculation(q) {
  if (!q || !Number.isFinite(q.coLMin) || q.coLMin <= 0) return null;
  return Object.freeze({
    focusMode: q.focusMode,
    modeName: q.modeName,
    hr: q.hr,
    sv: q.sv,
    step: q.step,
    coLMin: q.coLMin,
    qsLMin: q.qsLMin,
    qpLMin: q.qpLMin,
    qpQsRatio: q.qpQsRatio,
    shuntDirection: q.shuntDirection,
  });
}

// Section 8.4: Systemic vessels, continuity v = Q / A_total, capillary filtration/lymph, and blood components
export const vesselSegments = [
  { name: 'Aorta', kind: 'Artery', diameterMm: 25, wallMm: 2.0, totalAreaCm2: 4.5, meanPMmHg: 93, valves: 'None (semilunar at exit)' },
  { name: 'Muscular arteries', kind: 'Artery', diameterMm: 4.0, wallMm: 1.0, totalAreaCm2: 20, meanPMmHg: 85, valves: 'None' },
  { name: 'Arterioles', kind: 'Arteriole', diameterMm: 0.03, wallMm: 0.006, totalAreaCm2: 400, meanPMmHg: 55, valves: 'None (smooth muscle ring)' },
  { name: 'Capillary bed', kind: 'Capillary', diameterMm: 0.008, wallMm: 0.0005, totalAreaCm2: 4500, meanPMmHg: 25, valves: 'None (1-cell-thick endothelium)' },
  { name: 'Venules', kind: 'Vein', diameterMm: 0.02, wallMm: 0.001, totalAreaCm2: 4000, meanPMmHg: 15, valves: 'Micro-valves' },
  { name: 'Veins', kind: 'Vein', diameterMm: 5.0, wallMm: 0.5, totalAreaCm2: 40, meanPMmHg: 10, valves: 'One-way semilunar valves' },
  { name: 'Vena cava', kind: 'Vein', diameterMm: 30, wallMm: 1.5, totalAreaCm2: 18, meanPMmHg: 3, valves: 'Assisted by thorax/muscle pump' },
];

export const bloodFocusModes = [
  'Vessel structure & speed',
  'Tissue fluid & lymph',
  'RBCs, plasma & WBCs',
  'Platelets & fibrin clot',
];

export function vesselAccount(focusMode = 0, segment = 0, cardiacOutputLMin = 4.9) {
  const mode = integer(focusMode, 0, 3, 0);
  const segIdx = integer(segment, 0, 6, 0);
  const coLMin = bounded(cardiacOutputLMin, 2.0, 15.0, 4.9);
  const seg = vesselSegments[segIdx];

  // Continuity equation: v (cm/s) = Q (cm^3/s) / A_total (cm^2)
  const qCm3PerSec = (coLMin * 1000) / 60;
  const velocityCmSec = +(qCm3PerSec / seg.totalAreaCm2).toFixed(4);
  const velocityMmSec = +(velocityCmSec * 10).toFixed(3);

  // Revised Starling principle: no universal venous return percentage or CO-scaled lymph prediction.
  // This explorer teaches routes, not a fitted microvascular fluid-flow model.
  const exchangeModel = 'Net filtration with lymphatic return in ordinary steady tissue beds';
  const fluidRoutes = Object.freeze({ filtration: 'Blood → tissue fluid', lymph: 'Tissue fluid → lymph → veins', diffusion: 'Each solute follows its own gradient' });

  const linesByMode = [
    [
      `${seg.name} (${seg.kind}): wall ${seg.wallMm} mm, lumen ${seg.diameterMm} mm, valves: ${seg.valves}.`,
      `Total parallel area A_total = ${seg.totalAreaCm2} cm² → speed v = Q / A_total = ${velocityMmSec} mm/s.`,
      segIdx === 3
        ? 'Billions of capillaries give ~1,000× the aorta’s total area, slowing blood for diffusion.'
        : segIdx < 3
          ? 'Thick elastic and muscular arterial walls withstand high pressure and smooth surges.'
          : 'Wide venous lumen lowers resistance; semilunar valves and skeletal muscles stop backflow.',
    ],
    [
      'Pressure and barrier properties govern net fluid filtration from capillaries.',
      'O₂ diffuses into tissues; fluid filtration is a separate process.',
      'Lymphatics return net filtered fluid and escaped proteins.',

    ],
    [
      'Plasma (liquid): transports blood cells, ions, soluble nutrients, urea, hormones and CO₂.',
      'Red blood cells: biconcave discs with NO nucleus; haemoglobin binds O₂ reversibly.',
      'Neutrophils are lobed-nucleus phagocytes; B lymphocytes can become antibody-secreting cells.',
    ],
    [
      'At a wound, platelets stick to exposed vessel fibres and release clotting signals.',
      'Clotting converts soluble plasma protein fibrinogen into insoluble fibrin threads.',
      'The fibrin mesh traps red blood cells to prevent blood loss and block entry of pathogens.',
    ],
  ][mode];

  return {
    mode,
    modeName: bloodFocusModes[mode],
    segIdx,
    segmentName: seg.name,
    segmentKind: seg.kind,
    diameterMm: seg.diameterMm,
    wallMm: seg.wallMm,
    totalAreaCm2: seg.totalAreaCm2,
    meanPMmHg: seg.meanPMmHg,
    valves: seg.valves,
    coLMin,
    qCm3PerSec,
    velocityCmSec,
    velocityMmSec,
    exchangeModel,
    fluidRoutes,
    lines: linesByMode,
  };
}

export function captureVessel(q) {
  if (!q || !Number.isFinite(q.velocityMmSec)) return null;
  return Object.freeze({
    mode: q.mode,
    segIdx: q.segIdx,
    segmentName: q.segmentName,
    totalAreaCm2: q.totalAreaCm2,
    meanPMmHg: q.meanPMmHg,
    velocityMmSec: q.velocityMmSec,
    coLMin: q.coLMin,
  });
}
