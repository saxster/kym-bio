import { BoxGeometry, SphereGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { makeStage, webglOK } from './three_kit.js';

Live.register('osmosis_cells',(stage,params,api)=>{
  let condition=0,step=0,kit=null,animal,wall,contents;
  const k=makeCanvas(api,640,300,'Side-by-side animal and plant cell sections; choose surrounding solution and manually advance a qualitative response.');
  const say=api.readout();
  if(webglOK())try{
    kit=makeStage(stage,api,{height:280,label:'Animal membrane beside a plant wall enclosing membrane-bound contents. Turn with drag or camera buttons.'});kit.spinSpeed=0;
    const material=(color,opacity=1)=>new MeshStandardMaterial({color,transparent:opacity<1,opacity,roughness:.8,wireframe:opacity<1});
    animal=new Mesh(new SphereGeometry(.8,28,18),material(api.colors().proton));animal.position.x=-1.6;
    wall=new Mesh(new BoxGeometry(2,2,1.6),material(api.colors().green,.5));wall.position.x=1.5;
    contents=new Mesh(new BoxGeometry(2,2,1.6),material(api.colors().electron));contents.position.x=1.5;
    kit.root.add(animal,wall,contents);kit.label('Animal membrane',[-1.6,1.3,0]);kit.label('Plant wall',[1.5,1.3,0]);kit.root.rotation.set(.15,-.25,0);kit.fit(3.5);
  }catch(_){stage.querySelector('.live-3d')?.remove();kit=null;}
  if(!kit){const p=document.createElement('p');p.textContent='The 2D sections remain available without WebGL.';stage.append(p);}
  function refresh(){
    const t=step/4,burst=condition===0&&step===4;
    const a=condition===0?1+.4*t:condition===2?1-.35*t:1;
    const p=condition===2?.965-.4*t:.965;
    const state=step===0?'Starting cells':condition===0?(burst?'Animal: burst · plant: turgid':'Water entry · plant pressure rising'):condition===2?(step===4?'Animal shrivelled · plant plasmolysed':'Water loss · plant pressure falling'):'No sustained net volume change';
    k.draw((ctx,c)=>{
      const text=(s,x,y,size=16,col=c.ink)=>api.draw.text(ctx,s,x,y,{size,color:col});
      text(['Dilute surroundings','Matching solutes; little initial pressure','Concentrated surroundings'][condition],24,28,18);
      text('Animal cell',82,62,16);text('Plant cell',385,62,16);
      ctx.strokeStyle=c.proton;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(147,148,55*a,40*a,0,burst?.4:0,burst?5.4:Math.PI*2);ctx.stroke();
      if(burst){api.draw.arrow(ctx,201,124,228,111,c.proton,2,7);}
      ctx.strokeStyle=c.green;ctx.lineWidth=5;ctx.strokeRect(357,81,170,130);
      const w=170*p,h=130*p;ctx.strokeStyle=c.electron;ctx.lineWidth=2;ctx.strokeRect(442-w/2,146-h/2,w,h);
      ctx.fillStyle=c.electron;ctx.globalAlpha=.22;const v=.64+.14*(condition===0?t:0);ctx.fillRect(442-w*v/2,146-h*v/2,w*v,h*v);ctx.globalAlpha=1;
      text(state,24,252,16);
      text('Wall stays outside · inner line = membrane · blue fill = vacuole',24,276,14,c.muted);
      text('Chosen shapes and steps; different enlargements; no calibrated volumes or times',24,296,12,c.muted);
      if(kit){animal.material.color.set(c.proton);wall.material.color.set(c.green);contents.material.color.set(c.electron);kit.dirty=true;kit.render();}
    });
    if(kit){animal.scale.set(a,a*.72,a*.72);animal.visible=!burst;contents.scale.setScalar(p);kit.dirty=true;kit.render();}
    say(`${state}. Step ${step} of 4 is a manually selected stage, not elapsed time. ${condition===0?'A wall permits pressure to build and oppose further net entry.':condition===2?'Sufficient water loss separates plant contents from the largely fixed wall.':'A flaccid plant has little turgor pressure.'} The solid 3D interior represents the membrane envelope; its always-visible 2D section identifies the vacuole.`);
  }
  api.tabs(['Dilute outside','Matching solutes','Concentrated outside'],i=>{condition=i;refresh();});
  api.slider('Response stage',{min:0,max:4,step:1,value:0,fmt:v=>`${v} of 4 (schematic)`,onInput:v=>{step=v;refresh();}});
  refresh();return {};
},{label:'Inspect two cells in changing water',three:true,static:true});
