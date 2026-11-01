import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { THREE } from '../live/atlas/engine/bio_kit.js';
import { createAssemblyController } from '../live/atlas/engine/render.js';
import { frameAssemblies, separateLabels } from '../live/atlas/engine/framing.js';
const base = new URL('../live/atlas/biology/', import.meta.url);
let checked = 0;
for (const name of (await readdir(base)).filter(n => /^ch\d\d-/.test(n)).sort()) {
 const { CHAPTER: chapter } = await import(new URL(name + '/chapter.js', base));
 const scene = new THREE.Scene(), controller = createAssemblyController({});
 const world = chapter.buildWorld({ scene, asm: controller.asm, draggable() {} });
 for (const extreme of ['default', 'min', 'max']) {
  chapter.params = { ...chapter.defaultParams };
  if (extreme !== 'default') for (const c of chapter.controls || []) chapter.params[c.id] = c[extreme];
  for (const clock of [0, 2, 20]) {
  world.update(chapter.state(clock, false), {});
  for (const page of chapter.PAGES) for (const width of [310, 350, 680]) {
   const camera = new THREE.PerspectiveCamera(18, width / 420, .2, 300);
   const pose = { ...page.cam, dist: page.cam.dist * Math.max(1, (page.frameAspect ?? chapter.frameAspect ?? 1.25) / camera.aspect) };
   const place = p => {
    const az = THREE.MathUtils.degToRad(p.az), el = THREE.MathUtils.degToRad(p.el);
    camera.position.set(p.target[0] + p.dist * Math.sin(az) * Math.cos(el), p.target[1] + p.dist * Math.sin(el), p.target[2] + p.dist * Math.cos(az) * Math.cos(el));
    camera.lookAt(...p.target);camera.updateMatrixWorld();
   };
   place(pose);
   const groups = page.parts.map(k => { assert.ok(controller.ASM[k], `${name}: ${k}`);return controller.ASM[k]; });
   const fitted = process.argv.includes('--without-fit') ? pose : frameAssemblies(THREE, camera, pose, groups);
   // A reader starting a drag keeps the same fitted baseline. Panning moves
   // the composition without reverting to the formerly cropped authored zoom.
   const pan = new THREE.Vector3(.8, -.3, .2), panned = { ...pose, target: pose.target.map((v, k) => v + pan.getComponent(k)) };
   place(panned);
   const panFit = frameAssemblies(THREE, camera, panned, groups, { pan });
   if (!process.argv.includes('--without-fit')) assert.ok(Math.abs(panFit.dist - fitted.dist) < 1e-8, 'pan preserves fitted baseline distance');
   place(fitted);
   const box = new THREE.Box3();for (const g of groups) box.expandByObject(g);
   assert.ok(!box.isEmpty());
   for (let i = 0; i < 8; i++) {
    const p = new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
    assert.ok(Math.abs(p.x) <= .861 && p.y <= .621 && p.y >= -.841 && p.z < 1, `${name} ${page.tab}/${extreme}/${width}: clipped corner ${p.toArray()}`);
   }
   checked++;
  }
 }
 }
 chapter.params = { ...chapter.defaultParams };
}
console.log(`PASS: ${checked} complete page-assembly bounds at parameter extremes and phone/desktop aspects`);

const crowded = [{x: 20, y: 100, width: 180, height: 18}, {x: 150, y: 100, width: 180, height: 18}, {x: 80, y: 100, width: 180, height: 18}];
const offsets = separateLabels(crowded, 420);
for (let i = 0; i < crowded.length; i++) for (let j = i + 1; j < crowded.length; j++) assert.ok(Math.abs(crowded[i].y + offsets[i] - crowded[j].y - offsets[j]) >= 22, 'crowded scene labels separate');
assert.deepEqual(separateLabels(crowded, 420), offsets, 'layout stays stable between paused redraws');

const fixed = {x: 20, y: 100, width: 180, height: 18, fixed: true};
const mixed = separateLabels([crowded[0], fixed], 420);
assert.equal(mixed[1], 0, 'axis numbers retain their exact anchors');
assert.ok(Math.abs(mixed[0]) >= 22, 'annotation avoids fixed axis number');
