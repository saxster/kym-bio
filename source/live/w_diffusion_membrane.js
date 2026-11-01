import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { makeWalk } from './transport_model.js';

Live.register('diffusion_membrane',(stage,params,api)=>{
  let initial=80,open=true,walk=makeWalk(31,initial),accumulator=0;
  const k=makeCanvas(api,640,325,'Random-walk chamber with exactly 100 particles and separate counts of leftward and rightward crossings.');
  const say=api.readout();
  const paint=(ctx,c)=>{
    const q=walk.counts,text=(s,x,y,size=16,col=c.ink)=>api.draw.text(ctx,s,x,y,{size,color:col});
    text('Equal-volume chambers · random directions on both sides',22,28,18);
    ctx.strokeStyle=c.ink;ctx.lineWidth=2;ctx.strokeRect(16,48,608,186);
    ctx.strokeStyle=open?c.rule:c.proton;ctx.setLineDash(open?[5,5]:[]);ctx.beginPath();ctx.moveTo(320,48);ctx.lineTo(320,234);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=c.electron;for(const p of walk.particles){ctx.beginPath();ctx.arc(p.x,p.y,3.6,0,7);ctx.fill();}
    text(`Left: ${q.left}`,25,261,18);text(`Right: ${q.right}`,344,261,18);
    text(`Crossings → ${q.lr}    ← ${q.rl}    net → ${q.lr-q.rl}`,25,290,16);
    text(`${q.steps} steps · divider ${open?'permeable':'closed'} · total 100`,25,316,14,c.muted);
  };
  const refresh=()=>{
    k.draw(paint);const q=walk.counts;
    say(`Left ${q.left}, right ${q.right}; total 100. Actual crossings: ${q.lr} rightward, ${q.rl} leftward; signed net rightward ${q.lr-q.rl}. Counts fluctuate even near equal concentration. Steps and speeds are chosen for the model, not measured molecular time.`);
  };
  api.slider('Initially left',{min:50,max:100,step:10,value:80,fmt:v=>`${v} of 100`,onInput:v=>{initial=v;walk=makeWalk(31,initial);accumulator=0;refresh();}});
  api.tabs(['Permeable divider','Closed divider'],i=>{open=i===0;refresh();});
  api.button('Step 20 bounces',()=>{for(let i=0;i<20;i++)walk.step(open);refresh();});
  // makeCanvas redraws on theme/resize; this loop advances only after explicit Play.
  api.loop(dt=>{if(!dt)return;accumulator+=Math.min(dt,.1);if(accumulator>=.08){accumulator-=.08;walk.step(open);refresh();}});
  api.onHide(()=>{accumulator=0;api.pause();});
  refresh();return {};
},{label:'Count the blind crossings',three:false});
