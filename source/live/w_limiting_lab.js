import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { rateAccount,compareTrials } from './photosynthesis_model.js';
Live.register('limiting_lab',(stage,params,api)=>{
  let light=20,carbon=80,temperature=25,trials=[];
  const k=makeCanvas(api,640,450,'Invented limiting-factor investigation. Light, carbon dioxide and temperature impose chosen capacities; run and retain two comparisons. Gross and net oxygen are separate relative model accounts, not bubbles or measured plant data.');
  const say=api.readout();
  api.slider('Light capacity',{min:0,max:100,step:5,value:20,fmt:v=>`${v} chosen units`,onInput:v=>{light=v;refresh();}});
  api.slider('CO₂ capacity',{min:0,max:100,step:5,value:80,fmt:v=>`${v} chosen units`,onInput:v=>{carbon=v;refresh();}});
  api.slider('Temperature',{min:5,max:45,step:1,value:25,fmt:v=>`${v} °C`,onInput:v=>{temperature=v;refresh();}});
  api.button('Capture trial',()=>{trials=[...trials.slice(-1),{...rateAccount(light,carbon,temperature)}];refresh();});
  api.button('Clear trials',()=>{trials=[];refresh();});
  function refresh(){
    const q=rateAccount(light,carbon,temperature),pair=compareTrials(...trials);
    k.draw((ctx,c)=>{
      const t=(s,x,y,size=16,col=c.ink,align='left')=>api.draw.text(ctx,s,x,y,{size,color:col,align});
      t('What caps the current model?',320,28,22,c.ink,'center');
      [['Light',q.L],['CO₂',q.C],['Temperature',q.thermal]].forEach(([label,v],i)=>{
        const x=113+i*207;t(label,x,65,18,c.ink,'center');
        ctx.strokeStyle=c.rule;ctx.strokeRect(x-24,85,48,135);ctx.fillStyle=c.green;ctx.fillRect(x-23,219-v*1.33,46,v*1.33);
        t(v.toFixed(1),x,245,19,c.ink,'center');
      });
      t(`Gross ${q.gross.toFixed(1)} − oxygen use 10 = net ${q.net.toFixed(1)}`,320,283,21,c.ink,'center');
      t(`Limiting: ${q.limits.join(' + ')}`,320,313,17,c.green,'center');
      t('Captured trials (L / CO₂ / °C → gross; net)',25,347,16);
      trials.forEach((a,i)=>t(`${i+1}: ${a.L} / ${a.C} / ${a.T} → ${a.gross.toFixed(1)}; ${a.net.toFixed(1)}`,25,374+i*25,15));
      if(!trials.length)t('No trial captured. Moving controls does not run a trial.',25,375,15,c.muted);
      t('Invented capacities · relative rate units · no calibrated gas volume or time',320,436,13,c.muted,'center');
    });
    const receipt=trials.map(a=>`${a.L}/${a.C}/${a.T}: gross ${a.gross}, net ${a.net}`).join(' | ');
    const done=trials.length===2&&trials[0].L===20&&trials[0].C===80&&trials[0].T===25&&trials[1].L===60&&trials[1].C===80&&trials[1].T===25;
    say(`Current: gross ${q.gross.toFixed(1)}; net ${q.net.toFixed(1)}; limiting ${q.limits.join(' + ')}. ${trials.length} captured trials. ${pair.reason} ${receipt} ${done?'Controlled light comparison completed.':''} R = min(L, C, max(0, 100 − ((T−25)/2)²)); net = R − 10. All capacities and respiratory baseline invented; new independently prepared sample at each temperature, no damage/recovery history. Negative net means oxygen consumption exceeds production; it does not imply negative photosynthesis.`);
  }
  refresh();return {};
},{label:'Run a controlled limiting-factor comparison',three:false,static:true});
