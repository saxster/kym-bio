import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';

Live.register('organelle_clues', (stage, params, api) => {
  let organelle=0, count=1;
  const k=makeCanvas(api,640,300,'Organelle cutaway with four manually revealed lines of evidence for bacterial ancestry.');
  const say=api.readout();
  function refresh() {
    k.draw((ctx,c)=>{
      const col=organelle?c.green:c.neutron;
      api.draw.text(ctx,organelle?'Chloroplast':'Mitochondrion',38,32,{size:21,color:c.ink});
      ctx.strokeStyle=col;ctx.lineWidth=3;
      for(const [x,y,w,h] of [[35,70,240,145],[42,77,226,131]]) {ctx.beginPath();ctx.roundRect(x,y,w,h,55);ctx.stroke();}
      if(organelle) {for(let x=75;x<230;x+=50) for(let y=100;y<155;y+=14) ctx.strokeRect(x,y,33,9);}
      else {ctx.beginPath();ctx.moveTo(75,100);for(let x=75;x<240;x+=23){ctx.lineTo(x,178);ctx.lineTo(x+12,100);}ctx.stroke();}
      if(count>=2){ctx.strokeStyle=c.proton;ctx.beginPath();ctx.ellipse(85,185,17,10,0,0,7);ctx.stroke();}
      if(count>=3)for(let x=125;x<220;x+=27){ctx.fillStyle=c.ink;ctx.beginPath();ctx.arc(x,190,3,0,7);ctx.fill();}
      const rows=['1 · Two surrounding membranes','2 · Inherited DNA inside','3 · Bacterial-related ribosomes','4 · Division + matching gene ancestry'];
      rows.slice(0,count).forEach((s,i)=>api.draw.text(ctx,s,302,92+37*i,{size:14,color:c.ink}));
      api.draw.text(ctx,'Enlarged diagram; gene sequences are not visible shapes.',30,273,{size:14,color:c.muted});
    });
    say(`${count} of 4 clue groups revealed. ${count<4?'A shape alone does not establish ancestry. Add DNA, ribosome and gene-comparison evidence.':`The combined evidence supports ${organelle?'cyanobacterial':'bacterial'} ancestry. Some ancestral genes moved to the nucleus; this organelle now depends on its host cell.`}`);
  }
  api.tabs(['Mitochondrion','Chloroplast'],i=>{organelle=i;refresh();});
  api.slider('Clue groups',{min:1,max:4,step:1,value:count,fmt:v=>`${v} of 4`,onInput:v=>{count=v;refresh();}});
  refresh();return {};
}, { label: 'Inspect the ancestry evidence', three: false, static: true });
