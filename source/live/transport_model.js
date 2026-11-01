// Chosen teaching accounts, not fitted biological rates.
export function waterAccount(pressure) {
  const outside=-.30, solute=-.80, inside=solute+pressure;
  return { outside, solute, pressure, inside, direction: Math.abs(outside-inside)<1e-9 ? 0 : Math.sign(outside-inside) };
}
export function makeWalk(seed=31, left=80) {
  let state=seed>>>0;
  const random=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
  const particles=Array.from({length:100},(_,i)=>({x:(i<left?20:330)+random()*285,y:60+random()*150}));
  let lr=0,rl=0,steps=0;
  function step(open) {
    for(const p of particles) {
      const old=p.x,theta=random()*Math.PI*2;
      let x=old+Math.cos(theta)*16,y=p.y+Math.sin(theta)*16;
      if(x<18)x=36-x;if(x>622)x=1244-x;
      if(y<52)y=104-y;if(y>230)y=460-y;
      if((old<320)!==(x<320)) {
        if(!open)x=640-x;
        else if(old<320)lr++;else rl++;
      }
      p.x=x;p.y=y;
    }
    steps++;
  }
  return {particles,step,get counts(){const leftNow=particles.filter(p=>p.x<320).length;return {left:leftNow,right:100-leftNow,lr,rl,steps};}};
}
