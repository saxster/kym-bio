"""Check Mendel and energy-pyramid UI states against independent expected numbers."""
import argparse,json,time,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--url',default='https://saxster.github.io/kym-bio/');p.add_argument('--out',default='/tmp/bio-quantitative-scenes');p.add_argument('--engine',choices=['chromium','webkit'],default='chromium');p.add_argument('--offline',action='store_true');a=p.parse_args();out=Path(a.out);out.mkdir(parents=True,exist_ok=True);report={'url':a.url,'engine':a.engine,'offline':a.offline,'checks':[],'errors':[],'screenshots':[]}
def check(ok,name):
 report['checks'].append({'check':name,'pass':bool(ok)});assert ok,name
try:
 with sync_playwright() as pw:
  engine=getattr(pw,a.engine);browser=engine.launch(**({} if a.engine=='webkit' else {'args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}));context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',device_scale_factor=2,service_workers='allow' if a.offline else 'block');page=context.new_page();page.goto(a.url+'#ch13',wait_until='load',timeout=180000)
  if a.offline:
   page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=180000);context.set_offline(True);page.close();probe=context.new_page();probe.goto(a.url+'#ch13',wait_until='load');network=probe.evaluate('async u=>{try{await fetch(u,{cache:"no-store"});return true}catch{return false}}',a.url+'README.md?quantitative-offline-probe='+str(time.time_ns()));check(not network,'uncached request fails offline');probe.wait_for_timeout(100);probe.close();page=context.new_page();page.goto(a.url+'#ch13',wait_until='load')
  page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None);page.evaluate('document.fonts.ready')
  for chapter in [13,15]:
   page.evaluate('n=>location.hash="#ch"+n',chapter);f=page.locator(f'#fig-{chapter}-1');f.scroll_into_view_if_needed();f.locator('.lab-open').first.tap();f.locator('.atlas-pages button').first.wait_for();f.locator('.atlas-pages button').first.tap();check(f.locator('.atlas-badge').inner_text().startswith('3D Atlas'),f'{chapter} actual 3D')
   cases=[0,1,2] if chapter==13 else [5,10,20]
   slider=f.locator('input[id^="atlas-sl-'+('crossMode-' if chapter==13 else 'trophicEtaPct-')+'"]')
   for value in cases:
    slider.evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',value)
    marker=['Tt × Tt','Tt × tt','TT × tt'][value] if chapter==13 else f'η = {value}%'
    page.wait_for_function('(arg)=>document.querySelector("#fig-"+arg[0]+"-1 .live-readout").textContent.includes(arg[1])',arg=[chapter,marker])
    text=f.locator('.live-readout').inner_text()
    if chapter==13:
     percentages=[[25,50,25],[0,50,50],[0,100,0]][value];letters=[['TT','Tt','Tt','tt'],['Tt','tt','Tt','tt'],['Tt']*4][value]
     check(all(f'{g} = {v}%' in text for g,v in zip(['TT','Tt','tt'],percentages)),f'cross {value} expected probabilities');check(f.locator('.lbl.mark').all_text_contents()==letters,f'cross {value} visible Punnett letters match')
    else:
     expected={5:['500','25','1.25'],10:['1,000','100','10'],20:['2,000','400','80']}[value];check(all(n+' kJ' in text for n in expected),f'efficiency {value} exact energy values');check(f.locator('.atlas-labels').inner_text().find(marker)>=0,f'efficiency {value} label updates')
    for width in [390,1440]:
     page.set_viewport_size({'width':width,'height':844 if width==390 else 900});f.locator('.atlas-stage').scroll_into_view_if_needed();page.wait_for_timeout(250)
     issues=f.locator('.atlas-stage').evaluate('''e=>{const r=e.getBoundingClientRect(),bs=[...e.querySelectorAll('.lbl')].filter(l=>+l.style.opacity>0).map(l=>({t:l.textContent,r:l.getBoundingClientRect()})),out=[];for(const b of bs)if(b.r.left<r.left+2||b.r.right>r.right-2||b.r.top<r.top+2||b.r.bottom>r.bottom-20)out.push('clip '+b.t);for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++)if(Math.min(bs[i].r.right,bs[j].r.right)-Math.max(bs[i].r.left,bs[j].r.left)>1&&Math.min(bs[i].r.bottom,bs[j].r.bottom)-Math.max(bs[i].r.top,bs[j].r.top)>1)out.push('overlap '+bs[i].t+' / '+bs[j].t);return out}''');check(not issues,f'{chapter}/{value}/{width} labels fit: {issues}')
     path=out/f'ch{chapter}-{value}-{width}.png';f.locator('.atlas-stage').screenshot(path=str(path));report['screenshots'].append(str(path));check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{chapter}/{value}/{width} page fits')
   f.locator('.live-close').click()
  check(not report['errors'],'no unexpected browser errors');browser.close();report['pass']=True
except Exception as e:report['pass']=False;report['exception']=str(e);traceback.print_exc()
(out/'report.json').write_text(json.dumps(report,indent=2)+'\n');print('PASS' if report['pass'] else 'FAIL','quantitative scenes',len(report['checks']),out,flush=True);raise SystemExit(0 if report['pass'] else 1)
