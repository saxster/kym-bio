import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { atomAccount } from './photosynthesis_model.js';
Live.register('carbon_account',(stage,params,api)=>{
  let n=1,step=0;
  const names=['Absorb light','Water and oxygen','Carbon from air','Small carbon products','Balance the fuller summary'];
  const k=makeCanvas(api,640,410,'Manual photosynthesis account: carbon from carbon dioxide; water supplies released oxygen. Fuller summary balances carbon, hydrogen, oxygen and formal mass; no kinetics.');
  const say=api.readout();
  api.slider('Accounting batches',{min:1,max:4,step:1,value:1,fmt:v=>`${v} formal glucose summaries`,onInput:v=>{n=v;refresh();}});
  const focus=api.slider('Account stage',{min:0,max:4,step:1,value:0,fmt:v=>`${v}: ${names[v]}`,onInput:v=>{step=v;refresh();}});
  api.button('Next account stage',()=>{step=(step+1)%5;focus.set(step);refresh();});
  function refresh(){
    const q=atomAccount(n);
    k.draw((ctx,c)=>{
      const t=(s,x,y,size=17,col=c.ink,align='left')=>api.draw.text(ctx,s,x,y,{size,color:col,align});
      t(names[step],320,28,22,c.ink,'center');
      t('INPUT MATTER',40,76,16,c.green);t('OUTPUT MATTER',366,76,16,c.green);
      t(`${q.co2} CO₂`,40,115,24);t(`${q.waterIn} H₂O`,40,158,24);
      api.draw.arrow(ctx,254,125,342,125,c.green,3,10);
      t(`${q.glucose} C₆H₁₂O₆`,366,115,24);t(`${q.oxygen} O₂ + ${q.waterOut} H₂O`,366,158,24);
      t('Light: energy transferred, no carbon atoms',320,201,17,c.neutron,'center');
      ctx.strokeStyle=c.rule;ctx.beginPath();ctx.moveTo(25,218);ctx.lineTo(615,218);ctx.stroke();
      for(let i=0;i<3;i++){
        const x=110+i*210;t(['Carbon C','Hydrogen H','Oxygen O'][i],x,250,18,c.ink,'center');
        t(`${q.input[i]} in = ${q.output[i]} out`,x,285,18,c.green,'center');
      }
      const notes=[['Chlorophyll in thylakoids absorbs light.','Electron transfer links absorption to chemical work.'],['Released O₂ comes from water: isotope evidence.','This summary does not trace every other oxygen atom.'],['The carbohydrate carbon comes from CO₂.','Light transfers energy; it is not a material ingredient.'],['Enzymes build small three-carbon products first.','They can supply larger sugars, starch and cellulose.'],['Fuller summary: water appears on BOTH sides.','Cancel equal waters to obtain the school net equation.']][step];
      t(notes[0],320,329,16,c.ink,'center');t(notes[1],320,357,15,c.muted,'center');
      t('Formal account only · no photon count, reaction clock or measured yield',320,397,13,c.muted,'center');
    });
    say(`Stage ${step}: ${names[step]}. ${q.co2} CO₂ + ${q.waterIn} H₂O → ${q.glucose} C₆H₁₂O₆ + ${q.oxygen} O₂ + ${q.waterOut} H₂O. C ${q.input[0]}, H ${q.input[1]}, O ${q.input[2]} on each side. Formal relative mass ${q.massIn} = ${q.massOut} (C=12, H=1, O=16). Light energy is transferred; released O₂ originates from water. This is an overall account, not one molecular step.`);
  }
  refresh();return {};
},{label:'Trace matter and energy separately',three:false,static:true});
