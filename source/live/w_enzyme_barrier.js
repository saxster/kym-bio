import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { energyAccount } from './biomolecules_model.js';

Live.register('enzyme_barrier',(stage,params,api)=>{
  let lowering=35,step=0,partner=0;
  const k=makeCanvas(api,640,420,'Chosen enzyme energy pathways and a manually stepped binding cycle. Energy units arbitrary; progress is not time.');
  const say=api.readout();
  const names=['Separate partners','Substrate binds','Interactions rearrange','Products leave','Enzyme ready again'];
  const stageControl=api.slider('Cycle stage',{min:0,max:4,step:1,value:0,fmt:v=>`${v}: ${names[v]}`,onInput:v=>{step=v;refresh();}});
  api.slider('Barrier lowering',{min:0,max:45,step:5,value:35,fmt:v=>`${v} chosen units`,onInput:v=>{lowering=v;refresh();}});
  api.tabs(['Matched chemistry','Wrong chemical group'],i=>{partner=i;step=0;stageControl.set(0);refresh();});
  api.button('Next stage',()=>{step=(step+1)%5;stageControl.set(step);refresh();});
  function refresh(){
    const q=energyAccount(partner?0:lowering);
    k.draw((ctx,c)=>{
      const text=(s,x,y,size=16,col=c.ink,align='left')=>api.draw.text(ctx,s,x,y,{size,color:col,align});
      const y=v=>244-v*1.75;
      text('Free energy (chosen units)',30,25,15,c.muted);
      api.draw.arrow(ctx,55,244,605,244,c.ink,1.5,8);
      ctx.strokeStyle=c.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(55,244);ctx.lineTo(55,58);ctx.stroke();
      function curve(peak,color,dash){ctx.strokeStyle=color;ctx.lineWidth=3;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(80,y(20));ctx.bezierCurveTo(165,y(20),195,y(peak),295,y(peak));ctx.bezierCurveTo(395,y(peak),450,y(10),575,y(10));ctx.stroke();ctx.setLineDash([]);}
      curve(q.uncatPeak,c.proton,[7,5]);curve(q.catPeak,c.green,[]);
      text('Dashed: uncatalysed',403,49,16,c.proton);text('Solid: enzyme route',403,77,16,c.green);
      text(`Forward hurdle: 70 → ${q.forward}`,403,105,15);text(`Reverse hurdle: 80 → ${q.reverse}`,403,130,15);
      text('Reactants 20',80,265,14);text('Products 10',490,265,14);
      text('Reaction progress, not time',320,291,15,c.muted,'center');
      // Abstract contact sites, not a solved molecular structure or literal lock.
      ctx.strokeStyle=c.green;ctx.lineWidth=4;ctx.beginPath();ctx.arc(123,352,38,.25,Math.PI*1.9);ctx.stroke();
      const bound=step>0&&step<3&&!partner;
      ctx.fillStyle=c.sheet;ctx.fillRect(bound?125:207,326,30,30);ctx.strokeStyle=c.electron;ctx.lineWidth=2;ctx.strokeRect(bound?125:207,326,30,30);
      text(partner?'0':'−',bound?140:222,347,20,c.electron,'center');text('+',143,365,19,c.green,'center');
      text(names[step],320,333,20);
      text(partner&&step>0?'No productive cycle in this model.':step===4?'Enzyme regenerated; another cycle is possible.':step===2?'Contacts favour a reactive arrangement.':step===3?'Products separate from the active site.':step===1?'Temporary enzyme–substrate complex.':'Shape AND chemical groups matter.',320,363,13);
      text('Invented energies and geometry · no rate multiplier or seconds calculated',25,405,13,c.muted);
    });
    say(`Stage ${step}: ${names[step]}. ${partner?'Wrong chemical group: this model has no catalytic lowering.':'Matched partner.'} Forward barrier ${q.forward}; reverse ${q.reverse}; net change −10 chosen units on both routes. ${step===4&&!partner?'Enzyme regenerated.':''} The drawings do not predict a measured reaction rate.`);
  }
  refresh();return {};
},{label:'Lower the reaction hurdle',three:false,static:true});
