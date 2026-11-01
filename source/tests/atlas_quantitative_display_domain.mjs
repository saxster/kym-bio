import assert from 'node:assert/strict';
import { THREE } from '../live/atlas/engine/bio_kit.js';
import { createAssemblyController } from '../live/atlas/engine/render.js';
import { CHAPTER as mendel } from '../live/atlas/biology/ch13-mendel-inheritance/chapter.js';
import { CHAPTER as ecology } from '../live/atlas/biology/ch15-ecology-biotech/chapter.js';
const close = (a,b,label) => assert.ok(Math.abs(a-b)<1e-5,label+`: ${a} vs ${b}`);
function make(chapter) { const scene=new THREE.Scene(), c=createAssemblyController({});return {scene,c,world:chapter.buildWorld({scene,asm:c.asm,draggable(){}})}; }
const m=make(mendel), bars=m.c.ASM.genotype_bars.children.filter(o=>o.isMesh), cells=m.c.ASM.punnett_grid.children.filter(o=>o.isMesh);
const originalBarColors=bars.map(b=>b.material.uniforms.uTop.value.clone());
const expected=[[.25,.5,.25],[0,.5,.5],[0,1,0]], patterns=[['TT','Tt','Tt','tt'],['Tt','tt','Tt','tt'],['Tt','Tt','Tt','Tt']];
for(let cross=0;cross<3;cross++)for(const n of [20,400,2000])for(const explode of [0,1]) {
 mendel.params={...mendel.defaultParams,crossMode:cross,sampleN:n};m.c.setExplode(explode,null,true);m.world.update(mendel.state(2,false));m.c.stepExplode(0);m.scene.updateMatrixWorld(true);
 bars.forEach((bar,i)=>{assert.ok(bar.material.uniforms.uTop.value.equals(originalBarColors[i]),'recolouring cells never recolours the genotype bars');const box=new THREE.Box3().setFromObject(bar),p=expected[cross][i];assert.equal(bar.visible,p>0,'zero probability has no visible bar');close(box.max.y-box.min.y,2.8*p,'displayed bar height matches expected genotype probability');close(box.min.y,.1,'all genotype bars keep their baseline, including exploded views')});
 assert.deepEqual(cells.map(c=>c.userData.genotype),patterns[cross],'Punnett cells follow selected parental gametes');
 const lookup={TT:bars[0],Tt:bars[1],tt:bars[2]};cells.forEach((cell,i)=>{for(const key of ['uTop','uLight','uDark'])assert.ok(cell.material.uniforms[key].value.equals(lookup[patterns[cross][i]].material.uniforms[key].value),'genotype letter and colour agree')});
 m.c.setCutaway([0,0,-1,0],['punnett_grid']);m.world.update(mendel.state(2,false));assert.ok(cells.every(c=>c.material.clippingPlanes?.length===1),'recolouring retains section planes');
}
mendel.params={...mendel.defaultParams};
const e=make(ecology),tiers=e.c.ASM.trophic_pyramid.children.filter(o=>o.isMesh);
for(let eta=5;eta<=20;eta++) {
 ecology.params={...ecology.defaultParams,trophicEtaPct:eta};const s=ecology.state(2,false);e.world.update(s);e.c.stepExplode(0);e.scene.updateMatrixWorld(true);
 const areas=tiers.map(t=>{const b=new THREE.Box3().setFromObject(t);return(b.max.x-b.min.x)*(b.max.z-b.min.z)});
 areas.forEach((area,i)=>close(area/areas[0],(eta/100)**i,'horizontal block-area ratio matches energy ratio'));
 assert.ok(areas.every((a,i)=>i===0||a<areas[i-1]),'energy tiers narrow upwards at every efficiency');
 assert.ok(e.world.labels.some(l=>(l.text?.()||l.html||'').includes(eta+'%')),'energy label follows selected efficiency');
 if(eta===5)assert.ok(ecology.readout(s,ecology.PAGES[0],0).includes('1.25'),'small apex energy keeps its numerical precision');
}
ecology.params={...ecology.defaultParams};
console.log('PASS: all three Mendelian crosses, grounded bars, matching Punnett cells, and energy-scaled pyramid areas at 5–20%');
