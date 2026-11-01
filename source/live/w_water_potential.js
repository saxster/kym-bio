import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { waterAccount } from './transport_model.js';

Live.register('water_potential',(stage,params,api)=>{
  let pressure=0;
  const k=makeCanvas(api,640,310,'Inside and outside water-potential accounts: adjust pressure to balance net water transfer despite unequal solute contributions.');
  const say=api.readout();
  function refresh(){
    const q=waterAccount(pressure);
    k.draw((ctx,c)=>{
      const text=(s,x,y,size=16,col=c.ink)=>api.draw.text(ctx,s,x,y,{size,color:col});
      text('Outside',25,32,20);text('Inside a supported cell',342,32,20);
      ctx.strokeStyle=c.neutron;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(320,57);ctx.lineTo(320,226);ctx.stroke();
      text('Water potential',25,83,15,c.muted);text('−0.30 MPa',25,117,24,c.electron);
      text('Solute contribution    −0.80 MPa',342,83,15);
      text(`Pressure contribution  +${pressure.toFixed(2)} MPa`,342,117,15);
      text(`Total inside = ${q.inside.toFixed(2)} MPa`,342,158,21,c.electron);
      text('Water crosses both ways.',25,190,15);
      if(q.direction)api.draw.arrow(ctx,q.direction>0?245:395,214,q.direction>0?395:245,214,c.electron,3,10);
      else text('No net transfer',240,219,18,c.green);
      text(q.direction>0?'Net water: outside → inside':q.direction<0?'Net water: inside → outside':'Equal water potentials; different solute contributions',25,267,17);
      text('Chosen pressure account · pressure varied independently · no time or volume prediction',25,297,13,c.muted);
    });
    say(`Outside −0.30 MPa; inside −0.80 + ${pressure.toFixed(2)} = ${q.inside.toFixed(2)} MPa. ${q.direction>0?'Net water entry':q.direction<0?'Net water exit':'No net water transfer; water still crosses both ways'}. This compares imposed pressures, not a growing-cell simulation.`);
  }
  api.slider('Inside pressure',{min:0,max:1,step:.05,value:0,fmt:v=>`${v.toFixed(2)} MPa`,onInput:v=>{pressure=v;refresh();}});
  refresh();return {};
},{label:'Balance water with pressure',three:false,static:true});
