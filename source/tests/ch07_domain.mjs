// Independent mathematical oracles for the delivered Chapter 7 models.
import assert from 'node:assert/strict';
import { dropletAccount, compareDroplets, digestionAccount, absorptionAccount, captureDigestion, captureAbsorption, captureDroplets } from '../live/digestion_model.js';
import { ENHANCEMENTS } from '../live/enhancements.js';
let count=0;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(a),Math.abs(b)),`${a} differs from ${b}`);
for(let ri=0;ri<=300;ri++)for(let k=1;k<=6;k++){
 const R=ri/100,q=dropletAccount(R,k),N=k*k*k,r=R/Math.cbrt(N);
 assert.equal(q.N,R===0?0:N);near(q.r,r);
 const eachVolume=4*Math.PI*r*r*r/3,eachArea=4*Math.PI*r*r;
 near(eachVolume*N,4*Math.PI*R*R*R/3);near(q.volume,eachVolume*N);near(q.area,eachArea*N);
 if(R){near(q.area/q.originalArea,Math.cbrt(N));near(q.ratio,Math.cbrt(N));assert.ok(Object.isFrozen(captureDroplets(q)));}
 else {assert.equal(q.ratio,null);assert.equal(q.area,0);assert.equal(captureDroplets(q),null);}
 count++;
}
const bounded=(v,lo,hi,fallback)=>Number.isFinite(+v)?Math.max(lo,Math.min(hi,+v)):fallback;
for(const value of [-99,-.1,0,.6,1,3,4.5,6,99,NaN,Infinity,-Infinity,undefined]){
 const q=dropletAccount(value,value);
 near(q.R,bounded(value,0,3,3));assert.equal(q.k,Math.round(bounded(value,1,6,1)));
 for(const route of [-1,0,.8,1,2,3,NaN,Infinity,undefined]){
  const d=digestionAccount(route,value),a=absorptionAccount(route,value,value);
  assert.equal(d.route,Math.round(bounded(route,0,2,0)));assert.equal(d.step,Math.round(bounded(value,0,4,0)));
  assert.equal(a.route,d.route);assert.equal(a.step,d.step);assert.equal(a.supply,Math.round(bounded(value,0,6,3)));
  assert.equal(a.portions.reduce((sum,v)=>sum+v,0),a.supply);assert.equal(a.portions.filter(v=>v!==0).length,a.supply?1:0);
  a.portions.forEach((n,i)=>assert.equal(n,i===a.step?a.supply:0));
  assert.equal(a.destination,a.route===1?'Lymph → blood near heart':'Portal blood → liver');
  count++;
 }
}
for(let route=0;route<3;route++)for(let stage=0;stage<5;stage++)for(let amount=0;amount<=6;amount++){
 const q=absorptionAccount(route,stage,amount),capture=captureAbsorption(q),d=digestionAccount(route,stage),dc=captureDigestion(d);
 assert.equal(capture!==null,stage===4&&amount>0);assert.equal(dc!==null,stage===4);
 if(capture){assert.ok(Object.isFrozen(capture));const snapshot=JSON.stringify(capture);absorptionAccount(2,0,0);assert.equal(JSON.stringify(capture),snapshot);}
 if(dc){assert.equal(dc.products,['Glucose','Amino acids (some small peptides enter before final hydrolysis)','Fatty acids and monoacylglycerols'][route]);assert.ok(Object.isFrozen(dc)&&Object.isFrozen(dc.lines));const orig=dc.lines[0];d.lines[0]='changed current';assert.equal(dc.lines[0],orig);}
 count++;
}
const a=captureDroplets(dropletAccount(3,1)),b=captureDroplets(dropletAccount(3,2)),c=captureDroplets(dropletAccount(2,2));
assert.equal(compareDroplets(a,b).valid,true);assert.equal(compareDroplets(a,a).valid,false);assert.equal(compareDroplets(a,c).valid,false);assert.equal(compareDroplets().valid,false);assert.equal(compareDroplets(dropletAccount(0),b).valid,false);
const snap=JSON.stringify(a);dropletAccount(0,6);assert.equal(JSON.stringify(a),snap);
// Parse formulas and independently sum integer atoms, including reaction water.
const atoms=s=>{let q={};for(const m of s.matchAll(/([A-Z][a-z]?)(\d*)/g))q[m[1]]=(q[m[1]]||0)+Number(m[2]||1);return q;};
const add=terms=>{const q={};for(const [formula,n] of terms)for(const [e,k] of Object.entries(atoms(formula)))q[e]=(q[e]||0)+n*k;return q;};
const mass=q=>Object.entries(q).reduce((s,[e,n])=>s+n*({C:12,H:1,O:16}[e]),0);
for(const [left,right] of [
 [[['C12H22O11',1],['H2O',1]],[['C6H12O6',2]]],
 [[['C57H104O6',1],['H2O',2]],[['C21H40O4',1],['C18H34O2',2]]],
 [[['C57H104O6',1],['H2O',3]],[['C3H8O3',1],['C18H34O2',3]]],
]){assert.deepEqual(add(left),add(right));assert.equal(mass(add(left)),mass(add(right)));count++;}
assert.equal(mass(atoms('C12H22O11')),342);assert.equal(mass(atoms('C57H104O6')),884);assert.equal(mass(atoms('C21H40O4')),356);assert.equal(mass(atoms('C18H34O2')),282);
for(const [name,sliders,tabs] of [['digestive_steps',['Digestive stage'],true],['emulsification',['Reference radius','Linear division'],false],['absorption_routes',['Absorption stage','Marked portions'],true]]){
 const def=ENHANCEMENTS[name];assert.equal(def.watch.length,5);
 for(const key of ['challenge','yourNumbers','cutaway','idealised'])assert.ok(def[key]);
 for(const shot of def.watch){
  const set=new Set();let selected=0,captures=0;
  shot.act({setSlider:(k,v)=>{set.add(k);assert.ok(Number.isFinite(v));},selectTab:()=>selected++,clickBtn:()=>captures++});
  for(const control of sliders)assert.ok(set.has(control),`${name} shot missing ${control}`);
  assert.equal(selected,tabs?1:0);assert.equal(captures,0);assert.equal(typeof shot.cutaway,'boolean');count++;
 }
}
console.log(`${count} independent geometry, bounds, route, immutable-capture, atom/mass and tour cases passed`);
