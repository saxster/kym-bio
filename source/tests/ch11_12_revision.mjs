import assert from 'node:assert/strict';
import { betaGlobinMutationAccount, chargaffHelixAccount } from '../live/atlas/biology/ch11-central-dogma-dna/model.js';
import { transcribeCodingStrandToMrna, simulateTranscriptionTranslation } from '../live/genetic_code_model.js';
import { divisionPloidyAccount, meselsonStahlAccount } from '../live/atlas/biology/ch12-cell-division-meiosis/model.js';
for (const [mode,dna,rna] of [
 ['wildtype','GTG CAC CTG ACT CCT GAG GAG','GUG CAC CUG ACU CCU GAG GAG'],
 ['silent','GTG CAC CTT ACT CCT GAG GAG','GUG CAC CUU ACU CCU GAG GAG'],
 ['sickle','GTG CAC CTG ACT CCT GTG GAG','GUG CAC CUG ACU CCU GUG GAG']]) {
 const p=betaGlobinMutationAccount(mode);
 assert.equal(p.dnaCoding,dna); assert.equal(p.mrna,rna);
 assert.equal(transcribeCodingStrandToMrna(dna.replaceAll(' ','')),rna.replaceAll(' ',''));
}
assert.equal(chargaffHelixAccount(.5,21).turns,2,'relaxed B-DNA illustrative 10.5 bp turn');
assert.equal(divisionPloidyAccount('mitosis',4).chromosomesPerDaughter,4);
assert.equal(divisionPloidyAccount('meiosis',4).chromosomesPerDaughter,2);
for(let g=0;g<=4;g++){
 const p=meselsonStahlAccount(g);assert.equal(p.heavyFrac+p.hybridFrac+p.lightFrac,1);
 if(g>0)assert.equal(p.hybridFrac*p.totalDuplexes,2);
}
assert.equal(simulateTranscriptionTranslation(1,7,1).matchesWildTypeProtein,true,'synonymous means same sequence');
assert.ok(!simulateTranscriptionTranslation(1,7,1).functionalStatus.includes('100%'),'sequence alone must not guarantee clinical function');
console.log('PASS: independent revised sequence, copying, ploidy and inference contracts');

// Exercise the real scene geometry without a browser or WebGL renderer.
const { CHAPTER: atlas11 } = await import('../live/atlas/biology/ch11-central-dogma-dna/chapter.js');
const { CHAPTER: atlas12 } = await import('../live/atlas/biology/ch12-cell-division-meiosis/chapter.js');
const { THREE, rbcGeo } = await import('../live/atlas/engine/bio_kit.js');
const { createAssemblyController } = await import('../live/atlas/engine/render.js');
function sceneFor(chapter) {
  const scene = new THREE.Scene(), controller = createAssemblyController({});
  const world = chapter.buildWorld({ scene, asm: controller.asm });
  return { scene, assemblies: new Map(Object.entries(controller.ASM)), world };
}
function assertRightHanded(assembly) {
  let strands = 0;
  assembly.traverse(mesh => {
    if (!mesh.userData.part?.includes('double helix strand')) return;
    const points = mesh.geometry.parameters.path.points;
    // With points advancing along +y, positive signed torsion is right-handed.
    for (let i = 0; i < points.length - 3; i++) {
      assert.ok(points[i + 1].y > points[i].y, 'DNA strand advances along +y');
      const a = points[i + 1].clone().sub(points[i]);
      const b = points[i + 2].clone().sub(points[i + 1]);
      const c = points[i + 3].clone().sub(points[i + 2]);
      assert.ok(a.cross(b).dot(c) > 0, 'B-DNA scene geometry must be right-handed');
    }
    strands++;
  });
  assert.equal(strands, 2, 'Both DNA backbones are checked');
}
const scene11 = sceneFor(atlas11), scene12 = sceneFor(atlas12);
for (const { scene } of [scene11, scene12]) scene.traverse(mesh => {
  const positions = mesh.geometry?.attributes.position?.array;
  if (positions) assert.ok(positions.every(Number.isFinite), 'Scene vertices are finite, including the Waddington surface');
});
assertRightHanded(scene11.assemblies.get('bdna_helix'));
assertRightHanded(scene12.assemblies.get('replication_fork'));
const selectedCell = scene11.assemblies.get('hbs_sickle_rbc');
const expectedDisc = Array.from(rbcGeo(.78, 0).attributes.position.array);
for (const mode of ['wildtype', 'silent', 'sickle', 'silent']) {
  scene11.world.update({ t: 0, codonStep: 2, mut: betaGlobinMutationAccount(mode) });
  const cells = selectedCell.children.filter(m => m.geometry?.type === 'LatheGeometry' && m.visible);
  assert.equal(cells.length, 1, 'Exactly one selected RBC surface is visible');
  const vertices = Array.from(cells[0].geometry.attributes.position.array);
  if (mode === 'sickle') assert.notDeepEqual(vertices, expectedDisc, 'HbS has a deformed cell surface');
  else assert.ok(vertices.length === expectedDisc.length && vertices.every((v, i) => v === expectedDisc[i]), 'WT and synonymous selections restore actual normal geometry');
  const fibre = selectedCell.children.find(m => m.userData.part === 'Polymerised HbS rod fibre');
  assert.equal(fibre.visible, mode === 'sickle', 'HbS fibres appear only in the HbS selection');
}
console.log('PASS: actual scene DNA handedness and reversible normal/HbS cell geometry');
