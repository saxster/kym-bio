#!/usr/bin/env python3
"""Chapter 3 acceptance: counts, controls, viewports/themes and fallback media."""
from pathlib import Path
import functools, http.server, json, threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/tmp/lt_bio/ch03-qa');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'build/site')))
threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_address[1]}/index.html'
report={'checks':[],'errors':[],'matrix':[]}
def check(ok,text):
    assert ok,text
    report['checks'].append(text)
def monitor(pg):
    pg.on('pageerror',lambda e:report['errors'].append(str(e)))
    pg.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
def ready(pg):
    pg.goto(URL+'#ch3',wait_until='load');pg.wait_for_timeout(500);pg.evaluate('document.fonts.ready')
def slide(f,label,v):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(v))
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    context=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    pg=context.new_page();monitor(pg);ready(pg)
    check('Access for free at' in pg.locator('#ch3').inner_text(),'Chapter attribution visible')
    for width in [390,820,1024,1180,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in range(1,5):
                f=pg.locator(f'#fig-3-{n}');f.scroll_into_view_if_needed();f.screenshot(path=str(OUT/f'plate-{n}-{width}-{theme}.png'))
                issues=f.locator('svg.fig').evaluate('''s=>{
                    const v=s.viewBox.baseVal, a=[...s.querySelectorAll('text')].map(t=>({t:t.textContent,b:t.getBBox()})),out=[];
                    for(const q of a)if(q.b.x<0||q.b.y<0||q.b.x+q.b.width>v.width||q.b.y+q.b.height>v.height)out.push('clipped '+q.t);
                    for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(Math.min(a[i].b.x+a[i].b.width,a[j].b.x+a[j].b.width)-Math.max(a[i].b.x,a[j].b.x)>1&&Math.min(a[i].b.y+a[i].b.height,a[j].b.y+a[j].b.height)-Math.max(a[i].b.y,a[j].b.y)>1)out.push('overlap '+a[i].t+' / '+a[j].t);
                    return out;
                }''')
                check(not issues,f'Plate {n} {width} {theme}: {issues}')
            check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No overflow {width} {theme}')
            report['matrix'].append([width,theme])
    for width in [390,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in range(1,5):
                f=pg.locator(f'#fig-3-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();pg.wait_for_timeout(350)
                check(f.locator('.live-stage').count()==1,f'Widget {n} opens {width} {theme}')
                check(f.locator('.live-play[aria-pressed=true]').count()==0,f'Widget {n} opens still')
                f.screenshot(path=str(OUT/f'live-{n}-{width}-{theme}-default.png'))
                if n==1:
                    f.get_by_role('button',name='Step 20 bounces',exact=True).click()
                    check('total 100' in f.locator('.live-readout').inner_text(),'Random walk conserves total')
                    f.get_by_role('button',name='Closed divider',exact=True).click()
                    before=f.locator('.live-readout').inner_text()
                    f.get_by_role('button',name='Step 20 bounces',exact=True).click()
                    check(before==f.locator('.live-readout').inner_text(),'Closed divider preserves side counts and crossing counts')
                elif n==2:
                    slide(f,'Inside pressure',.5)
                    check('No net water transfer' in f.locator('.live-readout').inner_text(),'Pressure balances unequal solute contributions')
                    slide(f,'Inside pressure',.75)
                    check('Net water exit' in f.locator('.live-readout').inner_text(),'Pressure can reverse net direction')
                elif n==3:
                    f.get_by_role('button',name='Concentrated outside',exact=True).click();slide(f,'Response stage',4)
                    check('plasmolysed' in f.locator('.live-readout').inner_text(),'Plasmolysis endpoint named')
                    f.get_by_role('button',name='Dilute outside',exact=True).click()
                    check(f.get_by_label('Response stage',exact=True).input_value()=='4' and 'burst' in f.locator('.live-readout').inner_text(),'Changing condition preserves response-stage control')
                    view=f.locator('.live-3d')
                    if view.count():
                        before=view.screenshot();view.focus();pg.keyboard.press('ArrowRight');check(before!=view.screenshot(),'Keyboard camera turns')
                else:
                    slide(f,'Relay stage',4)
                    check('Nitrate accumulated' in f.locator('.live-readout').inner_text(),'Energy relay endpoint updates')
                f.locator('.live-watch-btn').click()
                check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Reduced motion tour is manual')
                check(f.locator('.live-watch-dot').count()==5,'Five tour shots')
                for dot in f.locator('.live-watch-dot').all():dot.click()
                f.screenshot(path=str(OUT/f'live-{n}-{width}-{theme}-changed.png'))
                check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No live overflow {n} {width} {theme}')
                f.locator('.live-close').click()
    f=pg.locator('#fig-3-3');f.scroll_into_view_if_needed();f.locator('.live-open').click();pg.wait_for_timeout(250)
    pg.emulate_media(media='print');check(f.locator('svg.fig').is_visible(),'Print restores original SVG during live use')
    pg.pdf(path=str(OUT/'print.pdf'),format='A4',print_background=True)
    pg.emulate_media(media='screen');f.locator('.live-close').click()
    nojs=b.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    np=nojs.new_page();np.goto(URL,wait_until='load')
    check(np.locator('#ch3 svg.fig').count()==4 and np.locator('#ch3').is_visible(),'Prose and all four plates available without JS')
    np.locator('#fig-3-3').scroll_into_view_if_needed();np.screenshot(path=str(OUT/'no-js.png'));nojs.close()
    # Normal-motion explicit playback: no load/open motion and pause when hidden.
    mc=b.new_context(viewport={'width':820,'height':1000},reduced_motion='no-preference')
    mp=mc.new_page();monitor(mp);ready(mp);mf=mp.locator('#fig-3-1');mf.scroll_into_view_if_needed();mf.locator('.live-open').click();mp.wait_for_timeout(300)
    before=mf.locator('.live-readout').inner_text();mp.wait_for_timeout(350)
    check(before==mf.locator('.live-readout').inner_text(),'Normal-motion widget also opens without autoplay')
    mf.locator('.live-play').click();mp.wait_for_timeout(500)
    check(mf.locator('canvas').get_attribute('aria-label') is not None,'Canvas has accessible label')
    mp.locator('#s3-2').scroll_into_view_if_needed();mp.wait_for_timeout(250)
    check(mf.locator('.live-play').get_attribute('aria-pressed')=='false','Playback pauses off-screen')
    mf.scroll_into_view_if_needed();mf.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(150)
    check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour stops on reduced-motion preference change')
    mc.close();context.close();b.close()
    fb=p.chromium.launch(args=['--disable-webgl']);fc=fb.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');fp=fc.new_page();monitor(fp);ready(fp)
    ff=fp.locator('#fig-3-3');ff.scroll_into_view_if_needed();ff.locator('.live-open').click();fp.wait_for_timeout(350)
    check(ff.locator('canvas').count()==1,'Canvas comparison survives without WebGL')
    ff.get_by_role('button',name='Concentrated outside',exact=True).click();slide(ff,'Response stage',4)
    check('plasmolysed' in ff.locator('.live-readout').inner_text(),'No-WebGL fallback retains manual cell response')
    ff.screenshot(path=str(OUT/'no-webgl.png'));fb.close()
server.shutdown();check(not report['errors'],f'No browser errors: {report["errors"]}')
(OUT/'report.json').write_text(json.dumps(report,indent=2));print(f'PASS: {len(report["matrix"])} combinations, {len(report["checks"])} assertions; no browser errors; {OUT}')
