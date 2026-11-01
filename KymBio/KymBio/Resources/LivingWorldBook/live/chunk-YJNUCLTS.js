function b(e,i,o,r){let t=e.canvas(i,o,r),a=null,n=()=>{t.clear(e.colors().plate),a?.(t.ctx,e.colors())};return e.loop(n),{...t,draw(l){a=l,n()},redraw:n}}export{b as a};
