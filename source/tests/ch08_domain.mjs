// Independent mathematical and physiological oracles for Chapter 8 models.
import assert from 'node:assert/strict';
import {
  ventilationAccount,
  captureVentilation,
  compareVentilation,
  harveyAccount,
  circulationAccount,
  captureCirculation,
  vesselSegments,
  vesselAccount,
  captureVessel,
} from '../live/circulation_model.js';
import { ENHANCEMENTS } from '../live/enhancements.js';

let count = 0;
const near = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${a} differs from ${b}`);
const bounded = (v, lo, hi, fallback) => (Number.isFinite(+v) ? Math.max(lo, Math.min(hi, +v)) : fallback);

// 1. Ventilation, anatomical dead space, and partial-pressure gradient invariants
for (let mode = 0; mode < 4; mode++) {
  for (let vt = 200; vt <= 2000; vt += 150) {
    for (let rate = 6; rate <= 40; rate += 4) {
      const q = ventilationAccount(mode, vt, rate, 150);
      near(q.minuteVentilationLMin, (vt * rate) / 1000);
      near(q.alveolarVentilationLMin, (Math.max(0, vt - 150) * rate) / 1000);
      near(q.deadSpaceVentilationLMin, (Math.min(vt, 150) * rate) / 1000);
      near(q.minuteVentilationLMin, q.alveolarVentilationLMin + q.deadSpaceVentilationLMin);
      assert.ok(q.pIpMmHg < 0, 'Pleural pressure remains negative in normal thorax');
      assert.equal(q.transpulmonaryMmHg, q.pAlvMmHg - q.pIpMmHg);
      assert.ok(q.o2GradientMmHg > 0 && q.co2GradientMmHg > 0);
      assert.equal(q.inspiredPct.o2, 21);
      assert.equal(q.expiredPct.o2, 16);
      assert.equal(q.inspiredPct.co2, 0.04);
      assert.equal(q.expiredPct.co2, 4);
      assert.equal(q.inspiredPct.n2, 78);
      assert.equal(q.expiredPct.n2, 78);
      const cap = captureVentilation(q);
      assert.ok(Object.isFrozen(cap));
      count++;
    }
  }
}

// Shallow rapid (250 mL x 24 = 6.0 L/min, VA = 2.4 L/min) vs Quiet rest (500 mL x 12 = 6.0 L/min, VA = 4.2 L/min)
const vShallow = captureVentilation(ventilationAccount(0, 250, 24));
const vRest = captureVentilation(ventilationAccount(0, 500, 12));
near(vShallow.minuteVentilationLMin, 6.0);
near(vRest.minuteVentilationLMin, 6.0);
near(vShallow.alveolarVentilationLMin, 2.4);
near(vRest.alveolarVentilationLMin, 4.2);
assert.equal(compareVentilation(vShallow, vRest).equalMinuteDiffAlveolar, true);
assert.equal(compareVentilation(vRest, vRest).valid, false);
count += 4;

// 2. Harvey 1628 Troy/apothecaries' arithmetic vs modern metric cardiac output
const h1 = harveyAccount(1, 1000);
assert.equal(h1.totalDrachms, 1000);
assert.equal(h1.totalOunces, 125);
assert.equal(h1.troyLabel, '10 lb 5 oz');
near(h1.approxLitresHalfHour, 3.89, 1e-2);

const h2 = harveyAccount(2, 1000);
assert.equal(h2.troyLabel, '20 lb 10 oz');

const h4 = harveyAccount(4, 1000);
assert.equal(h4.troyLabel, '41 lb 8 oz');
count += 3;

// 3. Double pump series balance vs Post-natal VSD left-to-right shunt
for (let mode = 0; mode < 4; mode++) {
  for (let hr = 40; hr <= 180; hr += 20) {
    for (let sv = 30; sv <= 120; sv += 15) {
      for (let stage = 0; stage < 5; stage++) {
        const q = circulationAccount(mode, hr, sv, stage);
        near(q.coLMin, (hr * sv) / 1000, 1e-2);
        if (mode !== 2) {
          near(q.qpLMin, q.qsLMin, 1e-5);
          near(q.qpQsRatio, 1.0, 1e-5);
          assert.equal(q.shuntDirection, 'None (intact septum)');
        } else {
          assert.ok(q.lvSystolicMmHg > q.rvSystolicMmHg, 'Post-natal LV systolic pressure >> RV systolic pressure');
          assert.ok(q.qpLMin > q.qsLMin, 'Left-to-right shunt increases pulmonary blood flow Qp > Qs');
          near(q.qpQsRatio, 1.6, 1e-2);
          assert.ok(q.shuntDirection.startsWith('Left-to-right'));
        }
        const cap = captureCirculation(q);
        assert.ok(Object.isFrozen(cap));
        count++;
      }
    }
  }
}

// 4. Systemic vessel continuity (v = Q / A_total) and Starling capillary exchange
for (let focus = 0; focus < 4; focus++) {
  for (let segIdx = 0; segIdx < vesselSegments.length; segIdx++) {
    for (const co of [3.0, 4.9, 9.8, 14.0]) {
      const q = vesselAccount(focus, segIdx, co);
      const expectedVCmS = ((co * 1000) / 60) / vesselSegments[segIdx].totalAreaCm2;
      near(q.velocityCmSec, expectedVCmS, 1e-3);
      near(q.velocityMmSec, expectedVCmS * 10, 1e-2);
      assert.equal(q.nfpArterialMmHg, 10);
      assert.equal(q.nfpVenousMmHg, -7);
      near(q.filtrationLDay, q.reabsorptionLDay + q.lymphReturnLDay, 1e-5);
      const cap = captureVessel(q);
      assert.ok(Object.isFrozen(cap));
      count++;
    }
  }
}

// Capillary velocity is ~1,000x slower than aortic velocity at any given cardiac output
const vAorta = vesselAccount(0, 0, 4.9);
const vCap = vesselAccount(0, 3, 4.9);
near(vAorta.velocityMmSec / vCap.velocityMmSec, 4500 / 4.5, 1e-2);
count++;

// 5. Out-of-bounds and NaN resilience + immutable snapshot safety
for (const bad of [-999, -1, 0, 99999, NaN, Infinity, -Infinity, undefined]) {
  const v = ventilationAccount(bad, bad, bad, bad);
  assert.equal(v.focus, Math.round(bounded(bad, 0, 3, 0)));
  assert.equal(v.vt, Math.round(bounded(bad, 200, 2000, 500)));
  const c = circulationAccount(bad, bad, bad, bad);
  assert.equal(c.focusMode, Math.round(bounded(bad, 0, 3, 0)));
  const w = vesselAccount(bad, bad, bad);
  assert.equal(w.segIdx, Math.round(bounded(bad, 0, 6, 0)));
  count++;
}

// 6. Verify all 3 Chapter 8 ENHANCEMENTS entries and their 5-shot watch tours
for (const [name, sliders, tabs] of [
  ['breathing_gradients', ['Tidal volume', 'Breathing rate'], true],
  ['double_pump', ['Circuit stage', 'Heart rate', 'Stroke volume'], true],
  ['vessel_exchange', ['Vessel segment', 'Cardiac output'], true],
]) {
  const def = ENHANCEMENTS[name];
  assert.ok(def, `Missing enhancement entry for ${name}`);
  assert.equal(def.watch.length, 5, `${name} must have 5 watch steps`);
  for (const key of ['challenge', 'yourNumbers', 'cutaway', 'idealised']) {
    assert.ok(def[key], `${name} missing ${key}`);
  }
  for (const shot of def.watch) {
    const set = new Set();
    let selected = 0, captures = 0;
    shot.act({
      setSlider: (k, v) => { set.add(k); assert.ok(Number.isFinite(v)); },
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

console.log(`${count} independent Chapter 8 ventilation, Harvey, double-pump, VSD, vessel-continuity and tour cases passed`);
