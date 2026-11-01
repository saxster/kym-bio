import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';

Live.register('root_transport',(stage,params,api)=>{
  let step=0;
  const k=makeCanvas(api,640,310,'Four manually selected stages connect ATP-driven proton export with proton-coupled nitrate uptake. No fixed ATP cost per nitrate is assigned.');
  const say=api.readout();
  const headings=['Before the relay','ATP coupled to the proton pump','Proton gradient established','Protons return through a cotransporter','Nitrate accumulated against its gradient'];
  function refresh(){k.draw((ctx,c)=>{
    const text=(s,x,y,size=16,col=c.ink)=>api.draw.text(ctx,s,x,y,{size,color:col});
    text(headings[step],22,28,18);text('Soil solution',24,62,16);text('Root hair interior',24,252,16);
    ctx.fillStyle=c.neutron;ctx.globalAlpha=.18;ctx.fillRect(20,125,600,45);ctx.globalAlpha=1;
    ctx.strokeStyle=c.green;ctx.lineWidth=3;ctx.strokeRect(175,103,60,89);ctx.strokeStyle=c.electron;ctx.strokeRect(418,103,60,89);
    text('Proton pump',90,91,15,c.green);text('Cotransporter',489,91,15,c.electron);
    text('H⁺',238,step<2?216:72,19,c.green);
    if(step>=1){text('ATP → ADP + Pᵢ',146,279,16,c.green);api.draw.arrow(ctx,205,215,205,69,c.green,3,9);}
    if(step>=2){text('H⁺  H⁺  H⁺',278,75,18,c.green);text('Stored gradient',266,101,14,c.muted);}
    if(step>=3){api.draw.arrow(ctx,447,69,447,217,c.electron,3,9);text('H⁺ + NO₃⁻',469,219,16,c.electron);}
    text('NO₃⁻ outside: scarce',25,109,13,c.electron);
    text('NO₃⁻ inside: already higher',330,279,14,c.electron);
    text('Energy relay, not one ATP per nitrate · arrows show stages, not measured rates',22,303,13,c.muted);
  });say(`${headings[step]}. ATP powers proton export; the resulting electrochemical gradient can power nitrate cotransport. The drawing is a pathway explanation, not particle counts or a measured transport rate. Water uptake uses its own water-potential gradient.`);}
  api.slider('Relay stage',{min:0,max:4,step:1,value:0,fmt:v=>`${v} of 4`,onInput:v=>{step=v;refresh();}});
  refresh();return {};
},{label:'Follow the root’s energy relay',three:false,static:true});
