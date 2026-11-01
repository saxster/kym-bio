import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { absorptionAccount, absorptionNames, absorptionStages, captureAbsorption } from './digestion_model.js';

Live.register('absorption_routes',(stage,params,api)=>{
  let route=0,step=0,supply=3;
  const trials=[];
  const k=makeCanvas(api,640,560,'Manually selected route for glucose, long-chain lipid material or some shorter-chain fatty acids. Track abstract marked dietary material through lumen, epithelial cell, tissue fluid, vessel and onward route. Markers do not represent unchanged molecules, micelles or fat droplets. No clock, permeability or efficiency is calculated.');
  const say=api.readout();
  api.tabs(absorptionNames,i=>{route=i;refresh();});
  const focus=api.slider('Absorption stage',{min:0,max:4,step:1,value:0,fmt:v=>`${v}: ${absorptionStages[v]}`,onInput:v=>{step=v;refresh();}});
  api.slider('Marked portions',{min:0,max:6,step:1,value:3,fmt:v=>`${v} abstract portions`,onInput:v=>{supply=v;refresh();}});
  api.button('Next absorption stage',()=>{step=(step+1)%5;focus.set(step);refresh();});
  api.button('Capture transport endpoint',()=>{const q=captureAbsorption(absorptionAccount(route,step,supply));if(q)trials.push(q);refresh();});
  api.button('Clear transport captures',()=>{trials.length=0;refresh();});
  function refresh(){
    const q=absorptionAccount(route,step,supply),complete=trials.some(t=>t.route===0)&&trials.some(t=>t.route===1);
    k.draw((ctx,c)=>{
      const t=(s,x,y,size=16,color=c.ink,weight=400)=>api.draw.text(ctx,s,x,y,{size,color,weight,align:'center'});
      t(q.name,320,29,22,c.ink,600);t(`${step} · ${q.compartment}`,320,60,17,c.green,600);
      const names=['Lumen','Epithelial cell','Tissue fluid',route===1?'Lacteal / lymph':'Blood capillary',route===1?'Blood near heart':'Portal → liver'];
      names.forEach((name,i)=>{
        const y=89+i*59;
        ctx.fillStyle=c.sheet;ctx.fillRect(25,y,590,45);ctx.strokeStyle=i===step?c.green:c.rule;ctx.lineWidth=i===step?3:1;ctx.strokeRect(25,y,590,45);
        t(name,145,y+28,15,c.ink,i===step?600:400);
        if(i===step)for(let n=0;n<q.supply;n++){
          const x=337+n*43;ctx.fillStyle=c.neutron;ctx.beginPath();ctx.arc(x,y+22,12,0,2*Math.PI);ctx.fill();
          t('M',x,y+27,12,c.sheet,600);
        }
        if(i<4)api.draw.arrow(ctx,294,y+47,294,y+57,i<2?c.green:c.ink,1.5,5);
      });
      t('M = marked dietary material; identity of molecules can change.',320,403,13,c.muted);
      q.lines.forEach((s,i)=>t(s,320,434+i*27,15,c.ink,i===0?600:400));
      t(`Material portions: ${q.portions.join(' + ')} = ${q.supply}`,320,494,17,c.green,600);
      t(!supply?'Zero supply: the route remains; no material moves.':complete?'Glucose and long-chain lipid endpoints captured.':`${trials.length} endpoints captured; compare glucose and long-chain lipid.`,320,524,14);
      t('Schematic focus states, not transit time, membrane permeability or efficiency.',320,551,12,c.muted);
    });
    const history=trials.map((t,i)=>`${i+1}: route ${t.route}, stage ${t.step}, supply ${t.supply}, ${t.destination}`).join(' | ');
    say(`Route ${route}; absorption stage ${step}; supply ${q.supply}. ${q.boundary}. ${q.lines.join(' ')} Destination: ${q.destination}. Portions in five compartments: ${q.portions.join(', ')}; total ${q.supply}. ${trials.length} captured transport endpoints. ${complete?'Glucose and long-chain lipid endpoints captured.':''} Saved: ${history||'none'}. Capture requires stage 4 and positive supply; controls alone do not record outcomes. These abstract portions track material through molecular rebuilding, not identical molecules, whole micelles or emulsion droplets. At zero supply all compartments contain zero marked portions. Membrane crossing and bulk blood/lymph transport are distinct; no elapsed time or efficiency is assigned. The stamp records comparisons, not the correctness of a written explanation.`);
  }
  refresh();return {};
},{label:'Trace material across the intestinal barrier',three:false,static:true});
