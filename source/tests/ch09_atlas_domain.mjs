import assert from 'node:assert/strict';
import {actionPotentialWave, auxinTropismAccount, eyeOpticsAccount} from '../live/atlas/biology/ch09-nerves-synapse-eye/model.js';
// Independent expected observations, not copied expressions from the model.
assert.equal(actionPotentialWave(2,15,0).vMv,30);
assert.equal(actionPotentialWave(2,15,100).fired,false);
assert.equal(actionPotentialWave(2,15,100).gNa,0);
for (const angle of [10,25,45]) {
  const left=auxinTropismAccount(-angle),right=auxinTropismAccount(angle);
  assert.ok(left.shadedFraction>.5 && right.shadedFraction>.5);
  assert.equal(left.shadedFraction,right.shadedFraction);
  assert.equal(left.bendAngleDeg,-right.bendAngleDeg);
}
assert.equal(auxinTropismAccount(0).shadedFraction,.5);
assert.ok(Math.abs(eyeOpticsAccount(.25).powerDioptres-62.8235294)<.001);
assert.ok(eyeOpticsAccount(.25).powerDioptres>eyeOpticsAccount(5).powerDioptres);
assert.ok(eyeOpticsAccount(.35,0).pupilDiamMm>eyeOpticsAccount(.35,100).pupilDiamMm);
console.log('PASS: Atlas9 blockade, regenerated spike, light-direction symmetry and reduced-eye optics');
