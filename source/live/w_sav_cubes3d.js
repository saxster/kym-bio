import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Live } from './core.js';
import { makeStage, webglOK } from './three_kit.js';
import { makeCanvas } from './lab_kit.js';
import { cubeAccount } from './cell_geometry.js';

Live.register('sav_cubes3d', (stage, params, api) => {
  let side=2, depth=.2, slice=0, kit=null, outer=null, core=null;
  // The 2D account remains usable with no WebGL or after context loss.
  const k=makeCanvas(api,640,300,'Central section of a cube drawn to a fixed centimetre scale, with calculated surface, volume and reached fraction.');
  const say=api.readout();
  if(webglOK()) {
    try {
      kit=makeStage(stage,api,{height:310,label:'Turnable cube with a coloured reached shell and a pale untouched core; fitted to the same viewing width at each size.'});
      kit.spinSpeed=0;
      outer=new Mesh(new BoxGeometry(3,3,3),new MeshStandardMaterial({color:api.colors().electron,transparent:true,opacity:.28,depthWrite:false,roughness:.8}));
      core=new Mesh(new BoxGeometry(3,3,3),new MeshStandardMaterial({color:api.colors().neutron,roughness:.9}));
      kit.root.add(outer,core);kit.root.rotation.set(.35,-.5,0);kit.fit(3);
    } catch (_) {
      kit=null;
      stage.querySelector('.live-3d')?.remove();
    }
  }
  if(!kit) {const note=document.createElement('p');note.textContent='Use the calculated 2D section; 3D is unavailable here.';stage.append(note);}
  function refresh() {
    const q=cubeAccount(side,depth);
    if(kit) {
      const ratio=q.coreSide/side;
      outer.scale.set(1,1,slice ? .04 : 1);
      core.scale.set(ratio,ratio,slice ? .045 : ratio);
      core.visible=ratio>0;
      kit.dirty=true;kit.render();
    }
    k.draw((ctx,c)=>{
      const text=(s,x,y,size=16)=>api.draw.text(ctx,s,x,y,{color:c.ink,size});
      text('2D centre section · fixed scale',24,30,18);
      const w=side*18,d=depth*18,x=30,y=240-w;
      ctx.fillStyle=c.electron;ctx.fillRect(x,y,w,w);
      if(q.coreSide>0){ctx.fillStyle=c.neutron;ctx.fillRect(x+d,y+d,q.coreSide*18,q.coreSide*18);}
      ctx.strokeStyle=c.ink;ctx.lineWidth=2;ctx.strokeRect(x,y,w,w);
      text(`${side} cm side`,30,267,14);
      ctx.beginPath();ctx.moveTo(248,60);ctx.lineTo(248,268);ctx.strokeStyle=c.rule;ctx.stroke();
      [`Surface = ${q.area} cm²`,`Volume = ${q.volume} cm³`,`SA/V = ${q.ratio.toFixed(2)} cm⁻¹`,`Depth = ${(depth*10).toFixed(0)} mm (chosen)`,`Reached volume = ${(q.reached*100).toFixed(1)}%`].forEach((s,i)=>text(s,274,75+i*35,16));
      text('Blue outer layer = reached; ochre core = untouched.',24,293,13);
    });
    say(`Side ${side} cm; surface ${q.area} cm²; volume ${q.volume} cm³; SA/V ${q.ratio.toFixed(2)} cm⁻¹. A chosen ${(depth*10).toFixed(0)} mm layer reaches ${(q.reached*100).toFixed(1)}% of the volume. This is geometric bookkeeping, not measured dye transport. The 3D cube is fitted to the same width; the 2D section keeps a fixed scale.`);
  }
  api.slider('Side length',{min:1,max:10,step:1,value:side,fmt:v=>`${v} cm`,onInput:v=>{side=v;refresh();}});
  api.slider('Reached depth',{min:0,max:.5,step:.1,value:depth,fmt:v=>`${(v*10).toFixed(0)} mm`,onInput:v=>{depth=v;refresh();}});
  api.tabs(['Whole cube','Centre slice'],i=>{slice=i;refresh();});
  refresh();return {};
}, { label: 'Slice the surface-area puzzle in 3D', three: true, static: true });
