import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { foodTests,foodResult } from './biomolecules_model.js';

Live.register('food_detective',(stage,params,api)=>{
  let test=0,control=0,ran=false;
  const k=makeCanvas(api,640,350,'Virtual food tests: compare a reagent blank, known positive and invented unknown; invalid controls prevent interpretation. Vials are symbolic; observations are written, not colour measurements.');
  const say=api.readout();
  api.tabs(foodTests.map(q=>q.name),i=>{test=i;ran=false;refresh();});
  api.tabs(['Valid controls','Failed positive','Misleading blank'],i=>{control=i;ran=false;refresh();});
  api.button('Run comparison',()=>{ran=true;refresh();});
  function refresh(){
    const q=foodTests[test],r=foodResult(test,control,ran);
    k.draw((ctx,c)=>{
      const text=(s,x,y,size=16,col=c.ink,align='left')=>api.draw.text(ctx,s,x,y,{size,color:col,align});
      text(`${q.name}: ${q.target}`,320,29,21,c.ink,'center');
      const entries=[['Reagent blank',control===2?'False response':q.negative],['Known positive',control===1?q.negative:q.positive],['Unknown U',q.present?q.positive:q.negative]];
      entries.forEach(([label,obs],i)=>{
        const x=108+i*212;
        text(label,x,67,17,c.ink,'center');
        ctx.strokeStyle=c.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-24,87);ctx.lineTo(x-24,155);ctx.quadraticCurveTo(x,185,x+24,155);ctx.lineTo(x+24,87);ctx.stroke();
        if(ran){ctx.fillStyle=c.rule;ctx.fillRect(x-20,124,40,25);text('•',x,149,21,c.ink,'center');}
        text(ran?obs:'Not run',x,206,14,c.ink,'center');
        text(i===1?q.control:i===0?'Water + reagents':'Invented mixture',x,233,13,c.muted,'center');
      });
      text(r.status,320,275,23,r.valid?c.green:c.proton,'center');
      text('Symbolic vials: use the written observation, not these ink tints.',320,310,14,c.muted,'center');
      text('School lab only · results are invented · no nutrient mass calculated',320,337,13,c.muted,'center');
    });
    say(`${ran?'Comparison run':'Not run'}. ${q.name}: ${r.status}. ${ran?r.observation:'Select controls, then press Run comparison.'} ${q.method} ${q.limit} ${ran&&r.valid?'Unknown U: '+(q.present?'target detected.':'target not detected under these model conditions.'):'Do not infer the unknown’s composition from an unrun or invalid comparison.'}`);
  }
  refresh();return {};
},{label:'Investigate a controlled food test',three:false,static:true});
