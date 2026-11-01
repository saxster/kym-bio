// Independent mathematical and physiological oracles for Chapter 9 coordination models.
import assert from 'node:assert/strict';
import {
  REFLEX_MODES,
  reflexActionAccount,
  captureReflex,
  compareReflex,
  SYNAPSE_MODES,
  synapseAccount,
  captureSynapse,
  compareSynapse,
  EYE_TROPISM_MODES,
  eyeTropismAccount,
  captureEyeTropism,
  compareEyeTropism,
} from '../live/coordination_model.js';
import { ENHANCEMENTS } from '../live/enhancements.js';

let count = 0;
const near = (a, b, tol = 1e-6) =>
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${a} differs from ${b}`);
const bounded = (v, lo, hi, fallback) => (Number.isFinite(+v) ? Math.max(lo, Math.min(hi, +v)) : fallback);

// 1. Reflex arc, myelinated vs unmyelinated scaling, voluntary ruler-drop & Siddiqi para^ts thermal block
assert.equal(REFLEX_MODES.length, 4);
for (let mode = 0; mode < 4; mode++) {
  for (let d = 2; d <= 20; d += 3) {
    for (let t = 18; t <= 36; t += 3) {
      const q = reflexActionAccount(mode, d, t);
      assert.equal(q.restingMv, -70);
      assert.equal(q.thresholdMv, -55);
      if (mode === 3 && t >= 30) {
        assert.equal(q.paraBlocked, true, 'Siddiqi para^ts must block Na+ conduction at T >= 30 C');
        assert.equal(q.velocityMS, 0);
        assert.equal(q.peakMv, -70);
        assert.equal(q.naConductancePct, 0);
        assert.equal(q.totalLatencyMs, Infinity);
        assert.equal(q.rulerDropCm, null);
      } else {
        assert.equal(q.paraBlocked, false);
        assert.ok(q.velocityMS > 0);
        assert.ok(Number.isFinite(q.totalLatencyMs) && q.totalLatencyMs > 0);
        near(q.totalLatencyMs, q.axonalMs + q.synapticMs + q.brainDelayMs + q.muscleActivationMs, 1e-2);
        const expectedDrop = Math.round(0.5 * 980 * Math.pow(q.totalLatencyMs / 1000, 2) * 10) / 10;
        near(q.rulerDropCm, expectedDrop, 1e-6);
      }
      const cap = captureReflex(q);
      assert.ok(Object.isFrozen(cap));
      count++;
    }
  }
}

// Myelinated vs Unmyelinated at 12 um, 25 C: myelinated is >10x faster and much lower latency
const rMyelin = captureReflex(reflexActionAccount(0, 12, 25));
const rUnmyelin = captureReflex(reflexActionAccount(1, 12, 25));
const rRuler = captureReflex(reflexActionAccount(2, 12, 25));
const rParaWarm = captureReflex(reflexActionAccount(3, 12, 32));
assert.ok(rMyelin.velocityMS > 10 * rUnmyelin.velocityMS);
assert.ok(rMyelin.totalLatencyMs < 50);
assert.ok(rRuler.totalLatencyMs > 150 && rRuler.rulerDropCm > 10);
assert.equal(rParaWarm.paraBlocked, true);
assert.equal(compareReflex(rMyelin, rUnmyelin).contrastsPathway, true);
assert.equal(compareReflex(rMyelin, rParaWarm).contrastsPathway, true);
assert.equal(compareReflex(rMyelin, rMyelin).valid, false);
count += 6;

// 2. Chemical synapse: 4-step sequence, one-way rule & receptor/enzyme blocks
assert.equal(SYNAPSE_MODES.length, 4);
for (let mode = 0; mode < 4; mode++) {
  for (let freq = 10; freq <= 100; freq += 15) {
    for (let cleft = 15; cleft <= 60; cleft += 5) {
      const q = synapseAccount(mode, freq, cleft);
      if (mode === 1) {
        // Reverse test (Post -> Pre): 0610 14.1.10 one-way rule
        assert.equal(q.vesiclesFused, 0);
        assert.equal(q.moleculesReleased, 0);
        assert.equal(q.boundReceptorsPct, 0);
        assert.equal(q.postPotentialMv, -70);
        assert.equal(q.postImpulseFired, false);
      } else {
        assert.ok(q.vesiclesFused > 0);
        assert.equal(q.moleculesReleased, q.vesiclesFused * 5000);
        assert.ok(q.pureDiffusionUs > 0);
        if (mode === 2) {
          assert.equal(q.availableReceptorsPct, 15, 'Curare blocks 85% of postsynaptic receptors');
          assert.equal(q.postImpulseFired, false);
        }
      }
      const cap = captureSynapse(q);
      assert.ok(Object.isFrozen(cap));
      count++;
    }
  }
}

const sForward = captureSynapse(synapseAccount(0, 40, 20));
const sReverse = captureSynapse(synapseAccount(1, 40, 20));
const sCurare = captureSynapse(synapseAccount(2, 40, 20));
assert.equal(sForward.postImpulseFired, true);
assert.equal(sReverse.postImpulseFired, false);
assert.equal(sCurare.postImpulseFired, false);
assert.equal(compareSynapse(sForward, sReverse).forwardAndReverse, true);
assert.equal(compareSynapse(sForward, sReverse).valid, true);
assert.equal(compareSynapse(sForward, sForward).valid, false);
count += 6;

// 3. Eye accommodation, pupil reflex & plant shoot/root auxin tropisms (0610 14.2 & 14.5)
assert.equal(EYE_TROPISM_MODES.length, 4);
for (let mode = 0; mode < 4; mode++) {
  for (const dist of [25, 40, 100, 250, 500]) {
    for (const light of [10, 30, 50, 80, 100]) {
      const q = eyeTropismAccount(mode, dist, light);
      near(q.totalPowerDioptres, 1000 / 17 + 100 / dist, 1e-2);
      near(q.totalPowerDioptres, q.corneaPowerDioptres + q.lensPowerDioptres, 1e-2);
      assert.equal(q.shadedAuxinPct + q.litOrUpperAuxinPct, 100);
      if (mode === 3) {
        assert.ok(q.shootBendAngleDeg > 0, 'Horizontal shoot bends upward (negative gravitropism)');
        assert.ok(q.rootBendAngleDeg < 0, 'Horizontal root bends downward (positive gravitropism)');
      }
      const cap = captureEyeTropism(q);
      assert.ok(Object.isFrozen(cap));
      count++;
    }
  }
}

const eNear = captureEyeTropism(eyeTropismAccount(0, 25, 75));
const eFar = captureEyeTropism(eyeTropismAccount(0, 400, 75));
assert.ok(eNear.ciliaryState.startsWith('Contracted'));
assert.ok(eNear.ligamentTension.startsWith('Slackened'));
assert.ok(eFar.ciliaryState.startsWith('Relaxed'));
assert.ok(eFar.ligamentTension.startsWith('Pulled tight'));
assert.ok(eNear.lensThicknessMm > eFar.lensThicknessMm);
assert.ok(eNear.totalPowerDioptres > eFar.totalPowerDioptres);
assert.equal(compareEyeTropism(eNear, eFar).nearVsFar, true);
assert.equal(compareEyeTropism(eNear, eFar).valid, true);
assert.equal(compareEyeTropism(eNear, eNear).valid, false);
count += 9;

// 4. Out-of-bounds and NaN resilience
for (const bad of [-999, -1, 0, 99999, NaN, Infinity, -Infinity, undefined]) {
  const r = reflexActionAccount(bad, bad, bad);
  assert.equal(r.mode, Math.round(bounded(bad, 0, 3, 0)));
  const s = synapseAccount(bad, bad, bad);
  assert.equal(s.mode, Math.round(bounded(bad, 0, 3, 0)));
  const e = eyeTropismAccount(bad, bad, bad);
  assert.equal(e.mode, Math.round(bounded(bad, 0, 3, 0)));
  count++;
}

// 5. Verify all 3 Chapter 9 ENHANCEMENTS entries and their 5-shot watch tours
for (const [name, sliders, tabs] of [
  ['reflex_action_potential', ['Axon diameter', 'Temperature'], true],
  ['synapse_transmission', ['Stimulus frequency', 'Synaptic gap width'], true],
  ['eye_accommodation_tropism', ['Object distance', 'Light intensity'], true],
]) {
  const def = ENHANCEMENTS[name];
  assert.ok(def, `Missing enhancement entry for ${name}`);
  assert.equal(def.watch.length, 5, `${name} must have 5 watch steps`);
  for (const key of ['challenge', 'yourNumbers', 'cutaway', 'idealised']) {
    assert.ok(def[key], `${name} missing ${key}`);
  }
  for (const shot of def.watch) {
    const set = new Set();
    let selected = 0,
      captures = 0;
    shot.act({
      setSlider: (k, v) => {
        set.add(k);
        assert.ok(Number.isFinite(v));
      },
      selectTab: () => selected++,
      clickBtn: () => captures++,
    });
    for (const control of sliders) {
      assert.ok(set.has(control), `${name} shot "${shot.title}" missing slider ${control}`);
    }
    assert.equal(selected, tabs ? 1 : 0);
    assert.equal(captures, 0, 'Watch tour must not auto-click capture buttons');
    assert.equal(typeof shot.cutaway, 'boolean');
    count++;
  }
}

console.log(`${count} independent Chapter 9 reflex, para^ts, synapse, eye accommodation, tropism and tour cases passed`);

// Revised model boundaries: count both central junctions and NMJ; keep physiology separate from chosen timing.
assert.equal(REFLEX_MODES[0].synapseCount, 3);
assert.equal(reflexActionAccount(0, 12, 25).synapticMs, 2.7);
assert.ok(!synapseAccount().oneWayReason.includes("ONLY"));
near(eyeTropismAccount(0,25).totalPowerDioptres, 1000/17+4, 1e-2);
