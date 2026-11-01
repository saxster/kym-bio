import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { sapSteps } from './photosynthesis_model.js';
Live.register('sap_routes',(stage,params,api)=>{
  let route=0,step=0;
  const k=makeCanvas(api,640,410,'Manual plant transport mechanism: xylem tension or phloem pressure flow; source to sink can point up or down in separate pathways. Stages are explanations, not seconds or measured sap displacement.');
  const say=api.readout();
  const control=api.slider('Transport stage',{min:0,max:4,step:1,value:0,fmt:v=>`${v}: ${sapSteps[route][v]}`,onInput:v=>{step=v;refresh();}});
  api.tabs(['Xylem pull','Leaf → root phloem','Store → shoot phloem'],i=>{route=i;step=0;control.set(0);refresh();});
  api.button('Next transport stage',()=>{step=(step+1)%5;control.set(step);refresh();});
  const details=[
    ['Evaporation removes liquid from moist cell walls.','Water vapour diffuses to drier outside air.','Receding curved surfaces lower liquid pressure.','Attraction between water molecules transmits tension.','Water follows the total water-potential gradient.'],
    ['Example: active loading uses ATP-supported transport.','More sucrose lowers water potential; water enters.','Higher source pressure pushes sap towards the sink.','Use or storage removes sucrose, sustaining the route.','This path goes down; another path may go up.'],
    ['A storage organ can release sugars as a source.','Solute accumulation draws water into source phloem.','Pressure difference drives bulk flow upwards here.','Growing tissue uses delivered sugars and amino acids.','Direction follows this source–sink pair, not gravity.']];
  function refresh(){
    k.draw((ctx,c)=>{
      const t=(s,x,y,size=17,col=c.ink,align='left')=>api.draw.text(ctx,s,x,y,{size,color:col,align});
      t(route?'Phloem: pressure flow':'Xylem: cohesion–tension',320,29,22,c.ink,'center');
      const top=route===0?'Leaf: evaporating surface':route===1?'Mature leaf SOURCE':'Growing shoot SINK';
      const bottom=route===0?'Root water supply':route===1?'Root SINK':'Storage organ SOURCE';
      t(top,165,76,16,c.ink,'center');t(bottom,165,294,16,c.ink,'center');
      ctx.strokeStyle=route?c.green:c.electron;ctx.lineWidth=3;ctx.strokeRect(141,98,48,164);
      if(route){ctx.setLineDash([3,5]);for(let y=137;y<260;y+=40){ctx.beginPath();ctx.moveTo(142,y);ctx.lineTo(188,y);ctx.stroke();}ctx.setLineDash([]);}
      api.draw.arrow(ctx,165,route===1?115:246,165,route===1?246:115,route?c.green:c.electron,3,10);
      t(route?'Sucrose + amino acids':'Water + mineral ions',340,105,17,c.green);
      t(`Stage ${step}`,340,152,18);t(sapSteps[route][step],340,184,14);
      t(route?'Living sieve tubes; sieve plates.':'Hollow lignified vessels.',340,225,14,c.muted);
      t(route?'Loading can be active or passive.':'Not an ATP pump up the trunk.',340,253,14,c.muted);
      t(details[route][step],320,341,16,c.ink,'center');
      t('Conceptual pathways · enlarged tubes · stages are not time or sap speed',320,391,13,c.muted,'center');
    });
    say(`Route ${route}; stage ${step}: ${sapSteps[route][step]}. ${details[route][step]} ${route?'Phloem carries sucrose and amino acids from source to sink. Loading, osmotic water entry, a pressure difference and unloading sustain bulk flow. Opposite directions belong to separate pathways, not opposing flow in one tube.':'Xylem carries water and dissolved mineral ions. Leaf evaporation creates tension transmitted through cohesive water; roots replace losses. Root pressure sometimes contributes but is not the general tall-tree explanation.'} Geometry is schematic; no transport velocity calculated.`);
  }
  refresh();return {};
},{label:'Follow the two transport mechanisms',three:false,static:true});
