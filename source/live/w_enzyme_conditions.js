import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { conditionsAccount } from './biomolecules_model.js';

Live.register('enzyme_conditions',(stage,params,api)=>{
  let temperature=20,pH=7,exposed=false;
  const k=makeCanvas(api,640,390,'Invented enzyme model: change assay temperature and pH; compare separately prepared fresh and heat-exposed samples. No recovery trajectory or human fever threshold.');
  const say=api.readout();
  api.slider('Assay temperature',{min:0,max:80,step:1,value:20,fmt:v=>`${v} °C`,onInput:v=>{temperature=v;refresh();}});
  api.slider('Assay pH',{min:2,max:12,step:.5,value:7,fmt:v=>v.toFixed(1),onInput:v=>{pH=v;refresh();}});
  api.tabs(['Fresh comparison','Heat-exposed sample'],i=>{exposed=!!i;refresh();});
  function refresh(){
    const q=conditionsAccount(temperature,pH,exposed);
    k.draw((ctx,c)=>{
      const text=(s,x,y,size=16,col=c.ink,align='left')=>api.draw.text(ctx,s,x,y,{size,color:col,align});
      text('Relative model rate',27,26,16);
      ctx.strokeStyle=c.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(55,64);ctx.lineTo(55,239);ctx.lineTo(600,239);ctx.stroke();
      for(const tick of [0,20,40,60,80])text(String(tick),55+tick*6.6,261,13,c.muted,'center');
      for(const [e,col,dash] of [[false,c.green,[]],[true,c.proton,[6,5]]]){
        ctx.strokeStyle=col;ctx.lineWidth=3;ctx.setLineDash(dash);ctx.beginPath();
        for(let t=0;t<=80;t++){let x=55+t*6.6,y=239-conditionsAccount(t,pH,e).rate*83;t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
      }
      const x=55+temperature*6.6,y=239-q.rate*83;
      ctx.fillStyle=c.ink;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
      text('Temperature (°C)',320,286,15,c.muted,'center');
      text('Solid: fresh',420,33,14,c.green);text('Dashed: heat-exposed',420,54,14,c.proton);
      text(`Encounters ×${q.encounters.toFixed(2)}`,25,315,16,c.electron);
      text(`Active share ${q.activeFraction.toFixed(3)}`,224,315,16,c.proton);
      text(`pH factor ${q.chemistry.toFixed(3)}`,445,315,16,c.green);
      text(`Selected rate ${q.rate.toFixed(3)} · ${exposed?'0.15 surviving share imposed':'fresh comparison'}`,25,346,17);
      text('Invented parameters · new sample per setting · fixed unspecified exposure',25,375,13,c.muted);
    });
    say(`${temperature} °C; pH ${pH.toFixed(1)}; ${exposed?'heat-exposed sample with chosen 0.15 surviving share':'fresh comparison'}. Relative model rate ${q.rate.toFixed(3)}. Encounters ×${q.encounters.toFixed(2)}, thermal fraction ${q.fraction.toFixed(3)}, combined active share ${q.activeFraction.toFixed(3)}, pH activity factor ${q.chemistry.toFixed(3)}. Each setting compares a separately prepared sample; changing back does not demonstrate refolding. No real enzyme is calibrated here.`);
  }
  refresh();return {};
},{label:'Separate speed from shape loss',three:false,static:true});
