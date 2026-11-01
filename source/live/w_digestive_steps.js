import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { digestionAccount, digestionStages, foods, captureDigestion } from './digestion_model.js';

Live.register('digestive_steps', (stage, params, api) => {
  let route = 0, step = 0;
  const trials = [];
  const k = makeCanvas(api, 640, 520, 'Manual compartment explorer for starch, protein and triglyceride processing. Focus stages are not a clock; actual digestion overlaps. Native controls and the readout provide the same selected route and chemical roles.');
  const say = api.readout();
  api.tabs(foods, i => { route = i; refresh(); });
  const focus = api.slider('Digestive stage', { min: 0, max: 4, step: 1, value: 0, fmt: v => `${v}: ${digestionStages[v]}`, onInput: v => { step = v; refresh(); } });
  api.button('Next digestive stage', () => { step = (step + 1) % 5; focus.set(step); refresh(); });
  api.button('Capture product endpoint', () => { const q = captureDigestion(digestionAccount(route, step)); if (q) trials.push(q); refresh(); });
  api.button('Clear product captures', () => { trials.length = 0; refresh(); });
  function refresh() {
    const q = digestionAccount(route, step), complete = new Set(trials.map(t => t.route)).size === 3;
    k.draw((ctx, c) => {
      const text = (s,x,y,size=16,color=c.ink,weight=400) => api.draw.text(ctx,s,x,y,{size,color,weight,align:'center'});
      text(`${q.food} · ${q.compartment}`,320,32,22,c.ink,600);
      text('Selected main route · manually chosen focus, no elapsed time',320,60,14,c.muted);
      // A compartment ladder separates route position from enlarged molecular symbols.
      digestionStages.forEach((label,i) => {
        const y=89+i*68;
        ctx.fillStyle=i===step?c.green:c.sheet;ctx.strokeStyle=c.rule;ctx.lineWidth=1;
        ctx.fillRect(24,y,170,48);ctx.strokeRect(24,y,170,48);
        text(label,109,y+29,label==='Absorptive epithelium'?12:14,i===step?c.sheet:c.ink,i===step?600:400);
        if(i<4)api.draw.arrow(ctx,109,y+50,109,y+63,c.ink,1.5,6);
      });
      ctx.fillStyle=c.sheet;ctx.fillRect(217,89,398,122);ctx.strokeStyle=c.rule;ctx.strokeRect(217,89,398,122);
      text('MOLECULAR VIEW · schematic symbols',416,113,14,c.muted);
      if(route===0||route===1){
        const count=6,gap=43,start=309;
        for(let i=0;i<count;i++){
          if(i<count-1 && !(step===4 || (route===1&&step>=2&&i%2===1) || (route===0&&step>=0&&i%3===2))) {
            ctx.strokeStyle=c.ink;ctx.beginPath();ctx.moveTo(start+i*gap,160);ctx.lineTo(start+(i+1)*gap,160);ctx.stroke();
          }
          ctx.fillStyle=route===0?c.electron:c.neutron;ctx.beginPath();ctx.arc(start+i*gap,160,12,0,Math.PI*2);ctx.fill();
        }
        text(route===0?'Sugar-unit symbols; links omitted at endpoints.':'Amino-acid-unit symbols; chains are shortened.',416,194,12,c.muted);
      }else{
        if(step<3){ctx.fillStyle=c.neutron;ctx.beginPath();ctx.arc(416,158,29,0,Math.PI*2);ctx.fill();text('Many triglycerides per droplet',416,200,12,c.muted);}
        else{text(step===3?'Lipase + water → changed molecules':'Products enter; cells rebuild / package',416,151,14,c.ink,600);text('Fatty acids + monoacylglycerols',416,181,14,c.neutron);}
      }
      q.lines.forEach((s,i)=>text(s,416,252+i*40,14,c.ink,i===0?600:400));
      text('No atom counts, rates or exact molecular shapes.',416,390,13,c.muted);
      text(`${trials.length} captured product endpoints`,320,461,17,c.green,600);
      text(complete?'Three endpoint routes captured for comparison.':'Select stage 4 and capture each of the three foods.',320,489,14,c.ink);
      text('A capture records the displayed model; it does not mark your explanation.',320,513,12,c.muted);
    });
    const history = trials.map((t,i)=>`${i+1}: ${t.food}, stage ${t.step}: ${t.products}`).join(' | ');
    say(`Food ${route}; digestive stage ${step}: ${q.compartment}. ${q.lines.join(' ')} ${trials.length} captured product endpoints. ${complete?'Three endpoint routes captured for comparison.':''} Saved: ${history||'none'}. Capture works only at stage 4; moving a control alone does not record an outcome. Shapes are abstract unit symbols, not complete molecules or an atom ledger. Stages overlap in life. The stamp records comparisons, not the correctness of a written explanation.`);
  }
  refresh();return {};
}, { label: 'Follow food through the chemical compartments', three: false, static: true });
