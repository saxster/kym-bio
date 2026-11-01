#!/usr/bin/env python3
"""Chapter 4 acceptance: scientific accounts, stateful controls, plates and fallbacks."""
from pathlib import Path
import functools,http.server,json,threading,hashlib,re,subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/tmp/lt_bio_ch04/qa');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'build/site')))
threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_address[1]}/index.html'
report={'checks':[],'errors':[],'matrix':[],'screenshots':[]}
def check(ok,msg):
    assert ok,msg
    report['checks'].append(msg)
def monitor(pg):
    pg.on('pageerror',lambda e:report['errors'].append(str(e)))
    pg.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
def ready(pg):
    pg.goto(URL+'#ch4',wait_until='load');pg.wait_for_timeout(500);pg.evaluate('document.fonts.ready')
def slide(f,label,v):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(v))
def shot(f,name):
    f.screenshot(path=str(OUT/name));report['screenshots'].append(name)
def openfig(pg,n):
    f=pg.locator(f'#fig-4-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();pg.wait_for_timeout(300);return f
# Domain invariants use the actual widget model, with an independent mathematical oracle.
script="""
import {energyAccount,conditionsAccount,foodResult} from './live/biomolecules_model.js';
import assert from 'node:assert/strict';
let n=0;
for(let l=-5;l<=50;l+=.5){let q=energyAccount(l);assert.equal(q.start,20);assert.equal(q.end,10);assert.equal(q.delta,-10);assert.equal(q.reverse-q.forward,10);assert.equal(70-q.forward,80-q.reverse);assert.ok(q.catPeak<=90&&q.catPeak>=45);n++;}
for(let t=0;t<=80;t++)for(let p=2;p<=12;p+=.5){let q=conditionsAccount(t,p,false),h=conditionsAccount(t,p,true);assert.ok(q.rate>=0&&q.fraction>=0&&q.fraction<=1&&q.chemistry<=1);assert.ok(Math.abs(h.rate/q.rate-.15)<1e-12);assert.ok(Math.abs(q.rate-2**((t-20)/20)/(1+Math.exp((t-50)/4))*Math.exp(-(((p-7)/2)**2)))<1e-12);n++;}
assert.ok(conditionsAccount(40).rate>conditionsAccount(20).rate);assert.ok(conditionsAccount(60).rate<conditionsAccount(40).rate);
for(let t=0;t<5;t++){assert.equal(foodResult(t,0,false).valid,false);assert.equal(foodResult(t,1,true).valid,false);assert.equal(foodResult(t,2,true).valid,false);assert.equal(foodResult(t,0,true).valid,true);n++;}
console.log(n+' domain cases passed');
"""
r=subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,capture_output=True,text=True)
check(r.returncode==0,r.stdout+r.stderr);report['domain']=r.stdout.strip()
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    pg=c.new_page();monitor(pg);req=[]
    pg.add_init_script("""window.canvasIssues=[];const fill=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...args){if(this.canvas.closest('figure')?.id.startsWith('fig-4-')&&this.canvas.dataset.logicalWidth){const w=Number(this.canvas.dataset.logicalWidth),h=Number(this.canvas.style.aspectRatio.split('/')[1]),m=this.measureText(t),left=x-(this.textAlign==='center'?m.width/2:this.textAlign==='right'?m.width:0);if(left<0||left+m.width>w||y-m.actualBoundingBoxAscent<0||y+m.actualBoundingBoxDescent>h)window.canvasIssues.push(String(t));}return fill.call(this,t,x,y,...args);};""")
    pg.on('request',lambda r:req.append(r.url) if '/live/w_' in r.url else None)
    ready(pg);check(not req,'No widget requests before interaction');check('Access for free at' in pg.locator('#ch4').inner_text(),'OpenStax footer visible')
    for width in [390,820,1024,1180,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in range(1,7):
                f=pg.locator(f'#fig-4-{n}');f.scroll_into_view_if_needed();shot(f,f'plate-{n}-{width}-{theme}.png')
                issues=f.locator('svg.fig').evaluate('''s=>{
                    const v=s.viewBox.baseVal,a=[...s.querySelectorAll('text')].map(t=>({t:t.textContent,b:t.getBBox()})),r=[];
                    for(let q of a)if(q.b.x<0||q.b.y<0||q.b.x+q.b.width>v.width||q.b.y+q.b.height>v.height)r.push('clip '+q.t);
                    for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(Math.min(a[i].b.x+a[i].b.width,a[j].b.x+a[j].b.width)-Math.max(a[i].b.x,a[j].b.x)>1&&Math.min(a[i].b.y+a[i].b.height,a[j].b.y+a[j].b.height)-Math.max(a[i].b.y,a[j].b.y)>1)r.push('text overlap '+a[i].t+' / '+a[j].t);
                    for(let l of s.querySelectorAll('[marker-end]')){let id=l.getAttribute('marker-end').match(/#([^)]+)/)[1];if(!document.getElementById(id)||getComputedStyle(l).stroke==='none')r.push('invisible arrow '+id);}
                    return r;
                }''')
                check(not issues,f'Plate {n}/{width}/{theme}: {issues}')
            check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No horizontal overflow {width}/{theme}');report['matrix'].append([width,theme])
    for width in [390,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in [4,5,6]:
                f=openfig(pg,n)
                check(f.locator('.live-stage').count()==1,f'Widget {n} opened at {width}/{theme}')
                check(f.locator('.live-play').count()==0,'No meaningless elapsed-time playback')
                check(not f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')"),'Challenge not awarded at initial state')
                check(f.locator('canvas[aria-label]').count()==1,'Accessible Canvas label')
                shot(f,f'live-{n}-{width}-{theme}-default.png')
                if n==4:
                    f.get_by_role('button',name='Next stage',exact=True).focus();pg.keyboard.press('Enter')
                    check(f.get_by_label('Cycle stage',exact=True).input_value()=='1','Keyboard manual step synchronises stage slider')
                    slide(f,'Barrier lowering',40);slide(f,'Cycle stage',4)
                    check('Forward barrier 30; reverse 40; net change −10' in f.locator('.live-readout').inner_text(),'Changed barriers retain endpoints and reverse relationship')
                    f.get_by_role('button',name='Wrong chemical group',exact=True).click()
                    check(f.get_by_label('Cycle stage',exact=True).input_value()=='0' and 'Forward barrier 70' in f.locator('.live-readout').inner_text(),'Partner reset clears cycle and catalytic lowering')
                    f.get_by_role('button',name='Matched chemistry',exact=True).click();slide(f,'Barrier lowering',35);slide(f,'Cycle stage',4)
                elif n==5:
                    slide(f,'Assay temperature',60);slide(f,'Assay pH',7);f.get_by_role('button',name='Heat-exposed sample',exact=True).click()
                    check('Relative model rate 0.046' in f.locator('.live-readout').inner_text(),'Exposed sample rate agrees with model')
                    slide(f,'Assay pH',5);check('pH activity factor 0.368' in f.locator('.live-readout').inner_text(),'pH changes chemistry factor')
                    slide(f,'Assay pH',7)
                else:
                    f.get_by_role('button',name='Iodine',exact=True).click()
                    check('Not run' in f.locator('.live-readout').inner_text() and not f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')"),'Selecting target alone does not complete food challenge')
                    f.get_by_role('button',name='Run comparison',exact=True).focus();pg.keyboard.press('Enter')
                    check('Iodine: Detected. Blue-black' in f.locator('.live-readout').inner_text(),'Manual keyboard-run iodine identifies starch')
                    f.get_by_role('button',name='Failed positive',exact=True).click()
                    check(f.locator('.live-readout').inner_text().startswith('Not run'),'Changing control clears previous result')
                    f.get_by_role('button',name='Run comparison',exact=True).click()
                    check('Inconclusive' in f.locator('.live-readout').inner_text(),'Failed control prevents composition inference')
                    f.get_by_role('button',name='Valid controls',exact=True).click();f.get_by_role('button',name='Run comparison',exact=True).click()
                # Saved stamps persist across reopen; clear only test storage before next widget iteration.
                check(f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')"),f'Widget {n} challenge reached by requested actions')
                f.locator('.live-watch-btn').click();check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Reduced-motion tour stays manual')
                check(f.locator('.live-watch-dot').count()==5,'Exactly five manual shots')
                for i,d in enumerate(f.locator('.live-watch-dot').all()):
                    d.click();check(d.evaluate("e=>e.classList.contains('is-active')"),f'Shot {i+1} active')
                shot(f,f'live-{n}-{width}-{theme}-changed.png')
                check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No live overflow {n}/{width}/{theme}')
                f.locator('.live-close').click();pg.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")
    # Resize and recolour an already-open paused widget; model state must survive.
    for n in [4,5,6]:
        f=openfig(pg,n)
        if n==4:slide(f,'Cycle stage',2)
        elif n==5:slide(f,'Assay temperature',60)
        else:f.get_by_role('button',name='Run comparison',exact=True).click()
        before=f.locator('.live-readout').text_content()
        pg.set_viewport_size({'width':390,'height':844});pg.evaluate("document.documentElement.dataset.theme='dark'");pg.wait_for_timeout(100)
        f.scroll_into_view_if_needed();pg.wait_for_timeout(200)
        # content-visibility:auto may defer innerText during reflow; state text and controls stay authoritative.
        check(before==f.locator('.live-readout').text_content(),f'Widget {n} retains state on resize and theme change')
        check(f.locator('canvas').evaluate('c=>c.width>0&&c.height>0'),'Paused canvas resized to nonzero dimensions')
        if n in [4,5]:
            label='Cycle stage' if n==4 else 'Assay temperature';control=f.get_by_label(label,exact=True);v=float(control.input_value());control.focus();pg.keyboard.press('ArrowRight');check(float(control.input_value())==v+1,'Keyboard arrow changes labelled range control')
        shot(f,f'paused-resize-theme-{n}.png');f.locator('.live-close').click()
    check(not pg.evaluate('canvasIssues'),f'All drawn Canvas labels within logical geometry: {pg.evaluate("canvasIssues")}')
    f=openfig(pg,4);pg.emulate_media(media='print');check(f.locator('svg.fig').is_visible(),'Print restores original plate during widget use')
    pg.pdf(path=str(OUT/'print.pdf'),format='A4',print_background=True);pg.emulate_media(media='screen');f.locator('.live-close').click()
    nj=b.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nj.new_page();np.goto(URL,wait_until='load')
    check(np.locator('#ch4 svg.fig').count()==6 and np.locator('#ch4').is_visible(),'All six plates and prose readable with JavaScript off');np.locator('#fig-4-3').scroll_into_view_if_needed();shot(np,'no-js.png');nj.close()
    # Normal-motion users still open on a static state; tours pause off-screen and on preference changes.
    mc=b.new_context(viewport={'width':820,'height':1000},reduced_motion='no-preference');mp=mc.new_page();monitor(mp);ready(mp);mf=openfig(mp,4)
    before=mf.locator('.live-readout').inner_text();mp.wait_for_timeout(300);check(before==mf.locator('.live-readout').inner_text(),'No autoplay at normal motion preference')
    mf.locator('.live-watch-btn').click();check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='true','Tour starts only on request')
    mp.locator('#s4-4').scroll_into_view_if_needed();mp.wait_for_timeout(200);check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour pauses off-screen')
    mf.scroll_into_view_if_needed();mf.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_function("document.querySelector('#fig-4-4 .live-watch-btn').getAttribute('aria-pressed')==='false'",timeout=2000);check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Open tour stops when reduced motion changes')
    mc.close()
    # Final-build service-worker cache: offline reload plus all Chapter 4 widgets reopening offline.
    pg.evaluate('navigator.serviceWorker.ready');pg.wait_for_timeout(2000)
    check(pg.evaluate('!!navigator.serviceWorker.controller'),'Service worker controls final build')
    c.set_offline(True);off=c.new_page();monitor(off);ready(off)
    check(off.locator('#ch4').is_visible(),'Chapter 4 reloads offline')
    for n in [4,5,6]:
        of=openfig(off,n);check(of.locator('canvas').count()==1,f'Widget {n} opens offline');of.locator('.live-close').click()
        of=openfig(off,n);check(of.locator('canvas').count()==1,f'Widget {n} reopens offline');of.locator('.live-close').click()
    c.set_offline(False);c.close();b.close()
    fb=p.chromium.launch(args=['--disable-webgl']);fc=fb.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');fp=fc.new_page();monitor(fp);ready(fp)
    for n in [4,5,6]:
        ff=openfig(fp,n);check(ff.locator('canvas').count()==1,f'Widget {n} works with WebGL disabled');shot(ff,f'no-webgl-{n}.png');ff.locator('.live-close').click()
    fb.close()
server.shutdown()
check(not report['errors'],f'No console/page errors: {report["errors"]}')
check((ROOT/'build/site/index.html').stat().st_size<4_000_000,'Index below 4 MB')
for pattern in ['w_enzyme_barrier-*.js','w_enzyme_conditions-*.js','w_food_detective-*.js']:
    q=list((ROOT/'build/site/live').glob(pattern));check(len(q)==1 and q[0].stat().st_size<150_000,f'{pattern}: below 150 KB')
check(all(hashlib.sha256((ROOT.parent/f).read_bytes()).hexdigest()==h for f,h in json.loads((ROOT/'tests/ch04-preserved.json').read_text()).items()),'Completed Chapter 0–3 source files unchanged')
report['cache']=re.search(r"const CACHE\s*=\s*['\"]([^'\"]+)",(ROOT/'build/site/sw.js').read_text()).group(1)
(OUT/'report.json').write_text(json.dumps(report,indent=2));print(f'PASS {len(report["checks"])} assertions, 15 viewport/theme combinations; {report["domain"]}; cache {report["cache"]}; {OUT}')
