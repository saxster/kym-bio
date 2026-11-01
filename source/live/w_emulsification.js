import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { dropletAccount, compareDroplets, captureDroplets } from './digestion_model.js';

Live.register('emulsification', (stage, params, api) => {
  let radius=3,division=1;
  const trials=[];
  const k=makeCanvas(api,640,565,'Conserved-volume 3D equal-sphere geometry shown as spread-out circle projections. Change a reference sphere radius and linear division. Number is division cubed; each radius is reference radius divided by division. Every sphere is drawn. Surface area is not a measured lipase rate.');
  const say=api.readout();
  api.slider('Reference radius',{min:0,max:3,step:.1,value:3,fmt:v=>`${v.toFixed(1)} mm model`,onInput:v=>{radius=v;refresh();}});
  api.slider('Linear division',{min:1,max:6,step:1,value:1,fmt:v=>`${v}; ${v**3} arrangement slots`,onInput:v=>{division=v;refresh();}});
  api.button('Capture geometry trial',()=>{const q=captureDroplets(dropletAccount(radius,division));if(q)trials.push(q);refresh();});
  api.button('Clear geometry trials',()=>{trials.length=0;refresh();});
  function refresh(){
    const q=dropletAccount(radius,division),comparison=compareDroplets(trials.at(-2),trials.at(-1));
    k.draw((ctx,c)=>{
      const t=(s,x,y,size=16,color=c.ink,weight=400)=>api.draw.text(ctx,s,x,y,{size,color,weight,align:'center'});
      t('Divide droplets; keep the same fat volume',320,31,22,c.ink,600);
      t('Chosen millimetre spheres · 3D calculation · not measured gut droplets',320,59,13,c.muted);
      t('REFERENCE SPHERE',111,97,15,c.ink,600);t(`${q.N} SPHERES AFTER DISPERSING`,426,97,15,c.ink,600);
      ctx.fillStyle=c.neutron;
      if(q.R>0){ctx.beginPath();ctx.arc(111,233,q.R*14,0,2*Math.PI);ctx.fill();}
      t(`R = ${q.R.toFixed(1)} mm`,111,333,16);
      const cols=Math.ceil(Math.sqrt(q.N*1.3))||1,rows=Math.ceil(q.N/cols),r=q.r*14,pitch=2*r+2;
      ctx.fillStyle=c.neutron;
      for(let i=0;i<q.N;i++){
        const x=426+((i%cols)-(cols-1)/2)*pitch,y=230+(Math.floor(i/cols)-(rows-1)/2)*pitch;
        ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.fill();
      }
      if(!q.N)t('No fat supplied',426,235,19,c.muted);
      t(`Each r = ${q.r.toFixed(3)} mm`,426,352,16);
      ctx.strokeStyle=c.rule;ctx.beginPath();ctx.moveTo(24,372);ctx.lineTo(616,372);ctx.stroke();
      t(`V = ${q.volume.toFixed(3)} mm³ · conserved`,320,405,20,c.green,600);
      t(`Total area = ${q.area.toFixed(3)} mm²`,320,437,20);
      t(q.ratio===null?'Area ratio: not applicable at zero volume':`Area / original area = ${q.ratio.toFixed(1)} ×; not ${q.N} ×`,320,469,16,c.neutron,600);
      t(`${trials.length} captured trials · ${comparison.valid?'controlled comparison saved':'capture a same-volume comparison'}`,320,509,14,c.ink);
      t('Circles are spread-out projections. No hydrolysis or rate is computed.',320,539,13,c.muted);
      t('The fat molecules are unchanged by this geometric division.',320,560,13,c.muted);
    });
    const history=trials.map((t,i)=>`${i+1}: R ${t.R.toFixed(1)}, k ${t.k}, N ${t.N}, r ${t.r.toFixed(3)} mm, V ${t.volume.toFixed(3)} mm³, A ${t.area.toFixed(3)} mm²`).join(' | ');
    say(`Reference radius ${q.R.toFixed(1)} mm; linear division ${q.k}. ${q.N} droplets, radius ${q.r.toFixed(3)} mm each. Total volume ${q.volume.toFixed(3)} mm³; total area ${q.area.toFixed(3)} mm². Area ratio ${q.ratio===null?'not applicable at zero volume':q.ratio.toFixed(1)+' ×'}. ${trials.length} captured trials. ${comparison.reason} Saved: ${history||'none'}. At zero supply there are no physical droplets and no valid trial. All ${q.N} spheres are shown as a spread-out projection; three-dimensional area and volume determine the account. No lipase action, digestion rate, time or changing fat molecules is modelled. Capture records geometry, not the correctness of your explanation.`);
  }
  refresh();return {};
}, { label: 'Investigate fat droplets and surface area', three: false, static: true });
