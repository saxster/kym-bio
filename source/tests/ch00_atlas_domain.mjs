import assert from 'node:assert/strict';
import { CHAPTER } from '../live/atlas/biology/ch00-microscopy-scale/chapter.js';
import { THREE } from '../live/atlas/engine/bio_kit.js';
import { createAssemblyController } from '../live/atlas/engine/render.js';
const scene = new THREE.Scene(), controller = createAssemblyController({});
const world = CHAPTER.buildWorld({ scene, asm: controller.asm });
for (const params of [{}, { lensRadiusMm: .45, neckDipMm: 6, tiltFlask: 0 }, { lensRadiusMm: 1.5, neckDipMm: 30, tiltFlask: 1 }]) {
 for (const t of [0, 2, 20]) {
  CHAPTER.params = { ...CHAPTER.defaultParams, ...params };
  const state = CHAPTER.state(t, false);
  world.update(state);
  scene.traverse(mesh => {
   for (const n of mesh.geometry?.attributes.position?.array || []) assert.ok(Number.isFinite(n), 'finite scene vertices');
   if (mesh.isInstancedMesh) {
    assert.ok(mesh.count > 0, 'visible particle population');
    for (const n of mesh.instanceMatrix.array) assert.ok(Number.isFinite(n), 'finite particle positions');
   }
  });
 }
}
CHAPTER.params = { ...CHAPTER.defaultParams };
world.update(CHAPTER.state(0, false));
for (const [key, inside] of [['open_jar', true], ['gauze_jar', false], ['sealed_jar', false]]) {
 const group = controller.ASM[key];
 const cloud = group.children.find(c => c.isInstancedMesh);
 assert.equal(cloud.count, 10);
 for (let i = 0; i < cloud.count; i++) {
  const y = cloud.instanceMatrix.array[i * 16 + 13];
  assert.ok(inside ? y < 1.6 : y > 1.6, key + ' flies respect access barrier');
 }
}
assert.equal(CHAPTER.PAGES.length, 4);
console.log('PASS: Chapter 0 scene construction, finite geometry and particle positions at control extremes');
