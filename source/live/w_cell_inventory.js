import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';

Live.register('cell_inventory', (stage, params, api) => {
  let specimen = 0;
  const names = ['Animal', 'Green leaf', 'White onion bulb', 'Bacterium'];
  const k = makeCanvas(api, 640, 310, 'Schematic cell cutaway and named structures; specimen enlargements differ.');
  const say = api.readout();
  function draw(ctx, c) {
    const plant = specimen === 1 || specimen === 2, bacterium = specimen === 3;
    const text = (s,x,y,col=c.ink,size=16) => api.draw.text(ctx,s,x,y,{color:col,size});
    const rect = (x,y,w,h,col,fill=false) => { ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2;fill?ctx.fillRect(x,y,w,h):ctx.strokeRect(x,y,w,h); };
    text(names[specimen]+' cell',28,28,c.ink,20);
    ctx.beginPath();ctx.roundRect(35,60,275,190,plant?12:75);ctx.strokeStyle=plant?c.green:c.electron;ctx.lineWidth=plant?6:3;ctx.stroke();
    if(plant || bacterium) {ctx.beginPath();ctx.roundRect(43,68,259,174,plant?8:70);ctx.strokeStyle=c.electron;ctx.lineWidth=2;ctx.stroke();}
    if(plant) {rect(125,98,130,116,c.electron);text('sap',169,159,c.electron,14);}
    if(!bacterium) {
      ctx.beginPath();ctx.arc(86,160,26,0,7);ctx.strokeStyle=c.proton;ctx.stroke();text('DNA',70,165,c.proton,13);
      for(const [x,y] of [[124,76],[220,216]]) {ctx.strokeStyle=c.neutron;ctx.strokeRect(x,y,34,18);for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+5+i*9,y+3);ctx.lineTo(x+9+i*9,y+15);ctx.stroke();}}
    } else {
      ctx.beginPath();ctx.ellipse(150,150,55,30,.2,0,7);ctx.strokeStyle=c.proton;ctx.stroke();
      ctx.beginPath();ctx.arc(245,185,12,0,7);ctx.stroke();text('plasmid',219,214,c.proton,13);
    }
    if(specimen===1) for(const [x,y] of [[72,88],[244,78],[74,210]]) {rect(x,y,29,15,c.green);for(let i=0;i<3;i++)rect(x+5+i*8,y+3,2,9,c.green,true);}
    for(const [x,y] of [[63,127],[115,218],[277,129],[275,177],[190,229]]) {ctx.fillStyle=c.ink;ctx.beginPath();ctx.arc(x,y,2.5,0,7);ctx.fill();}
    const rows = ['Membrane · controls passage','Cytoplasm · reaction mixture','Ribosomes · build proteins',bacterium?'DNA · no enclosed nucleus':'Nucleus · most cell DNA',bacterium?'No mitochondria':'Mitochondria · ATP supply',specimen===1?'Chloroplasts · build sugars':specimen===2?'No developed chloroplasts':bacterium?'Wall · not cellulose':'No cellulose wall'];
    rows.forEach((s,i)=>text(s,335,82+i*31,c.ink,14));
    text('Schematic cutaway · sizes differ · dots and boundaries enlarged',28,289,c.muted,14);
  }
  function refresh() {
    k.draw(draw);
    say(`${names[specimen]}: ${specimen===3?'the DNA is in the cytoplasm; this cell still has ribosomes and a cell membrane. The small extra DNA ring shown is a plasmid; not all bacteria carry one.':specimen===2?'a plant cell with a cellulose wall, vacuole, nucleus and mitochondria, despite lacking developed chloroplasts.':'a typical cell inventory, with a nucleus and mitochondria.'} ${specimen===1?'The chloroplasts build carbohydrates using light; mitochondria supply ATP through respiration in light and darkness.':''} Parts are enlarged to identify them; this is not a micrograph.`);
  }
  api.tabs(names,i=>{specimen=i;refresh();});
  refresh();
  return {};
}, { label: 'Compare four cell interiors', three: false, static: true });
