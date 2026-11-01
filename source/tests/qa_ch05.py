#!/usr/bin/env python3
"""Chapter 5 acceptance: scientific accounts, stateful controls, plates and fallbacks."""
from pathlib import Path
import functools,http.server,json,threading,hashlib,re,subprocess,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('BIO_CH05_QA_OUT','/tmp/lt_bio_ch05/qa'));OUT.mkdir(parents=True,exist_ok=True)
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
    pg.goto(URL+'#ch5',wait_until='load');pg.wait_for_timeout(500);pg.evaluate('document.fonts.ready')
def slide(f,label,v):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(v))
def shot(f,name):
    f.screenshot(path=str(OUT/name));report['screenshots'].append(name)
def openfig(pg,n):
    f=pg.locator(f'#fig-5-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();pg.wait_for_timeout(300);return f
# Domain invariants use the actual widget model, with an independent mathematical oracle.
script="""
import {atomAccount,rateAccount,compareTrials} from './live/photosynthesis_model.js';
import assert from 'node:assert/strict';
let n=0;
for(let b=-3;b<10;b+=.25){const q=atomAccount(b),k=Math.max(1,Math.min(4,Math.round(b)));assert.equal(q.n,k);assert.deepEqual(q.input,[6*k,24*k,24*k]);assert.deepEqual(q.input,q.output);assert.equal(q.massIn,44*q.co2+18*q.waterIn);assert.equal(q.massOut,180*q.glucose+32*q.oxygen+18*q.waterOut);assert.equal(q.massIn,q.massOut);n++;}
for(let l=0;l<=100;l+=5)for(let c=0;c<=100;c+=5)for(let t=5;t<=45;t++){let q=rateAccount(l,c,t),v=Math.max(0,100-(t-25)**2/4);assert.equal(q.gross,Math.min(l,c,v));assert.ok(q.gross>=0&&q.gross<=100);assert.equal(q.net,q.gross-10);assert.ok(q.limits.length);n++;}
let a=rateAccount(20,80,25),b=rateAccount(60,80,25);assert.equal(a.net,10);assert.equal(b.net,50);assert.equal(compareTrials(a,b).valid,true);assert.equal(compareTrials(a,a).valid,false);assert.equal(compareTrials(a,rateAccount(60,20,25)).valid,false);assert.equal(compareTrials().valid,false);console.log(n+' domain cases passed');
"""
r=subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,capture_output=True,text=True)
check(r.returncode==0,r.stdout+r.stderr);report['domain']=r.stdout.strip()
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    pg=c.new_page();monitor(pg);req=[]
    pg.add_init_script("""window.canvasIssues=[];const fill=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...args){if(this.canvas.closest('figure')?.id.startsWith('fig-4-')&&this.canvas.dataset.logicalWidth){const w=Number(this.canvas.dataset.logicalWidth),h=Number(this.canvas.style.aspectRatio.split('/')[1]),m=this.measureText(t),left=x-(this.textAlign==='center'?m.width/2:this.textAlign==='right'?m.width:0);if(left<0||left+m.width>w||y-m.actualBoundingBoxAscent<0||y+m.actualBoundingBoxDescent>h)window.canvasIssues.push(String(t));}return fill.call(this,t,x,y,...args);};""")
    pg.on('request',lambda r:req.append(r.url) if '/live/w_' in r.url else None)
    ready(pg);check(not req,'No widget requests before interaction');check('Access for free at' in pg.locator('#ch5').inner_text(),'OpenStax footer visible')
    for width in [390,820,1024,1180,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in range(1,8):
                f=pg.locator(f'#fig-5-{n}');f.scroll_into_view_if_needed();shot(f,f'plate-{n}-{width}-{theme}.png')
                issues=f.locator('svg.fig').evaluate('''s=>{
                    const v=s.viewBox.baseVal,a=[...s.querySelectorAll('text')].map(t=>({t:t.textContent,b:t.getBBox()})),r=[];
                    for(let q of a)if(q.b.x<0||q.b.y<0||q.b.x+q.b.width>v.width||q.b.y+q.b.height>v.height)r.push('clip '+q.t);
                    for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(Math.min(a[i].b.x+a[i].b.width,a[j].b.x+a[j].b.width)-Math.max(a[i].b.x,a[j].b.x)>1&&Math.min(a[i].b.y+a[i].b.height,a[j].b.y+a[j].b.height)-Math.max(a[i].b.y,a[j].b.y)>1)r.push('text overlap '+a[i].t+' / '+a[j].t);
                    for(let l of s.querySelectorAll('[marker-end]')){let id=l.getAttribute('marker-end').match(/#([^)]+)/)[1];if(!document.getElementById(id)||getComputedStyle(l).stroke==='none')r.push('invisible arrow '+id);}
                    return r;
                }''')
                check(not issues,f'Plate {n}/{width}/{theme}: {issues}')
                crossed=f.locator('svg.fig').evaluate("""s=>{const out=[];for(const l of s.querySelectorAll('line[marker-end]')){const x1=l.x1.baseVal.value,y1=l.y1.baseVal.value,x2=l.x2.baseVal.value,y2=l.y2.baseVal.value;for(const t of s.querySelectorAll('text')){const b=t.getBBox();for(let k=0;k<=100;k++){const x=x1+(x2-x1)*k/100,y=y1+(y2-y1)*k/100;if(x>b.x&&x<b.x+b.width&&y>b.y&&y<b.y+b.height){out.push(t.textContent);break;}}}}return out;}""")
                check(not crossed,f'Arrow shafts avoid text {n}/{width}/{theme}: {crossed}')
            check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No horizontal overflow {width}/{theme}');report['matrix'].append([width,theme])
    # Corrected cast story: the restored chapter link works with keyboard and at both sizes.
    for width in [390,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            link=pg.locator('#s5-1 a[data-story="p-helmont"]').first
            check(link.count()==1,'Chapter5 links to corrected Helmont story')
            link.scroll_into_view_if_needed();link.focus();pg.keyboard.press('Enter');pg.wait_for_timeout(250)
            story=pg.locator('#storydlg #story-p-helmont')
            check(story.is_visible(),'Keyboard opens corrected cast story')
            copy=story.inner_text()
            check('the tree was not established to be dry' in copy and 'not the year the five-year experiment began' in copy,'Rendered story retains mass and chronology limits')
            check('The soil, dried again, had lost about 2 ounces.' in copy and '169 pounds and about 3 ounces' in copy,'Built story carries qualified historical observations')
            check('kg' not in copy and '57 grams' not in copy,'Old metric conversions absent from rendered story')
            check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'),'Story content has no horizontal overflow')
            shot(pg.locator('#storydlg'),f'helmont-{width}-{theme}.png')
            pg.keyboard.press('Escape');pg.wait_for_timeout(250)
            check(not pg.locator('#storydlg').is_visible(),'Escape returns to chapter')
    for width in [390,1440]:
        pg.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in [3,4,6]:
                f=openfig(pg,n)
                check(f.locator('.live-stage').count()==1,f'Widget {n} opened at {width}/{theme}')
                check(f.locator('.live-play').count()==0,'No meaningless elapsed-time playback')
                check(not f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')"),'Challenge not awarded at initial state')
                check(f.locator('canvas[aria-label]').count()==1,'Accessible Canvas label')
                shot(f,f'live-{n}-{width}-{theme}-default.png')
                if n==3:
                    f.get_by_role('button',name='Next account stage',exact=True).focus();pg.keyboard.press('Enter')
                    check(f.get_by_label('Account stage',exact=True).input_value()=='1','Keyboard manual account stage')
                    slide(f,'Accounting batches',2);slide(f,'Account stage',4)
                    check('C 12, H 48, O 48' in f.locator('.live-readout').inner_text() and '960 = 960' in f.locator('.live-readout').inner_text(),'Atom/mass display conserved')
                elif n==4:
                    slide(f,'Light capacity',60)
                    check('0 captured trials' in f.locator('.live-readout').inner_text() and not f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')"),'Slider alone cannot complete controlled experiment')
                    slide(f,'Light capacity',20);f.get_by_role('button',name='Capture trial',exact=True).click();slide(f,'Light capacity',60);f.get_by_role('button',name='Capture trial',exact=True).click()
                    check('Controlled light comparison completed.' in f.locator('.live-readout').inner_text(),'Actual captured controlled comparison')
                    slide(f,'CO₂ capacity',20);f.get_by_role('button',name='Capture trial',exact=True).click()
                    check('One factor changed.' in f.locator('.live-readout').inner_text(),'Single factor recognised')
                    slide(f,'Light capacity',80);slide(f,'Temperature',45);f.get_by_role('button',name='Capture trial',exact=True).click()
                    check('More than one factor changed.' in f.locator('.live-readout').inner_text(),'Confounded comparison flagged')
                    slide(f,'Temperature',25)
                    check('80/20/45: gross 0, net -10' in f.locator('.live-readout').inner_text(),'Current controls do not rewrite captured history')
                else:
                    f.get_by_role('button',name='Store → shoot phloem',exact=True).click();slide(f,'Transport stage',4)
                    check('Route 2; stage 4:' in f.locator('.live-readout').inner_text(),'Upward phloem route correctly selected')
                    check('Storage source' in f.get_by_label('Transport stage',exact=True).locator('..').inner_text(),'Stage output synchronised to route')
                # Saved stamps persist across reopen; clear only test storage before next widget iteration.
                check(f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')"),f'Widget {n} challenge reached by requested actions')
                f.locator('.live-watch-btn').click();check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Reduced-motion tour stays manual')
                check(f.locator('.live-watch-dot').count()==5,'Exactly five manual shots')
                for i,d in enumerate(f.locator('.live-watch-dot').all()):
                    d.click();check(d.evaluate("e=>e.classList.contains('is-active')"),f'Shot {i+1} active')
                    if n==3:
                        check(f.get_by_label('Account stage',exact=True).input_value()==str(i),f'Atom tour actual stage {i}')
                        check(f.get_by_label('Accounting batches',exact=True).input_value()==('2' if i==4 else '1'),'Atom tour batch state')
                    elif n==4:
                        targets=[(20,80,25),(60,80,25),(60,20,25),(60,20,45),(0,80,25)][i]
                        for label,v in zip(['Light capacity','CO₂ capacity','Temperature'],targets):check(f.get_by_label(label,exact=True).input_value()==str(v),f'Rate tour actual {label}/{i}')
                        if i==1:check('Controlled light comparison completed.' in f.locator('.live-readout').inner_text(),'Tour captures both trials')
                        if i==4:check('gross 0.0; net -10.0' in f.locator('.live-readout').inner_text(),'Dark tour net/gross distinction')
                    else:
                        route,step=[(0,0),(0,3),(0,4),(1,1),(2,4)][i]
                        check(f'Route {route}; stage {step}:' in f.locator('.live-readout').inner_text(),f'Transport tour actual route and stage {i}')
                shot(f,f'live-{n}-{width}-{theme}-changed.png')
                check(pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No live overflow {n}/{width}/{theme}')
                boxes=f.locator('.live-slider').evaluate_all("els=>els.flatMap(e=>{const f=e.closest('figure').getBoundingClientRect();return [...e.querySelectorAll('label,input,output')].filter(q=>{const b=q.getBoundingClientRect();return b.left<f.left-1||b.right>f.right+1;}).map(q=>q.textContent||q.type);})")
                check(not boxes,f'No clipped controls {n}/{width}/{theme}: {boxes}')
                f.locator('.live-close').click();pg.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")
    # Resize and recolour an already-open paused widget; model state must survive.
    for n in [3,4,6]:
        f=openfig(pg,n)
        if n==3:slide(f,'Account stage',2)
        elif n==4:slide(f,'Light capacity',60)
        else:slide(f,'Transport stage',2)
        before=f.locator('.live-readout').text_content()
        pg.set_viewport_size({'width':390,'height':844});pg.evaluate("document.documentElement.dataset.theme='dark'");pg.wait_for_timeout(100)
        f.scroll_into_view_if_needed();pg.wait_for_timeout(200)
        # content-visibility:auto may defer innerText during reflow; state text and controls stay authoritative.
        check(before==f.locator('.live-readout').text_content(),f'Widget {n} retains state on resize and theme change')
        check(f.locator('canvas').evaluate('c=>c.width>0&&c.height>0'),'Paused canvas resized to nonzero dimensions')
        label={3:'Account stage',4:'Light capacity',6:'Transport stage'}[n];control=f.get_by_label(label,exact=True);v=float(control.input_value());control.focus();pg.keyboard.press('ArrowRight');check(float(control.input_value())==v+(5 if n==4 else 1),'Keyboard arrow changes labelled range control')
        shot(f,f'paused-resize-theme-{n}.png');f.locator('.live-close').click()
    check(not pg.evaluate('canvasIssues'),f'All drawn Canvas labels within logical geometry: {pg.evaluate("canvasIssues")}')
    f=openfig(pg,3);pg.emulate_media(media='print');check(f.locator('svg.fig').is_visible(),'Print restores original plate during widget use')
    for theme in ['light','dark','sepia']:
        pg.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
        check(pg.evaluate("getComputedStyle(document.documentElement).colorScheme==='light'"),f'Print color scheme overrides {theme}')
        for ch in ['#ch0','#ch4','#ch5']:
            check(pg.locator(ch).evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"),f'{ch} print ink readable from {theme}')
        check(pg.locator('#ch5 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"),f'Original plate print ink from {theme}')
        check(pg.locator('body').evaluate("e=>getComputedStyle(e).backgroundColor==='rgb(255, 255, 255)'"),'Print white paper')
    pg.pdf(path=str(OUT/'print.pdf'),format='A4',print_background=True);pg.emulate_media(media='screen');f.locator('.live-close').click()
    nj=b.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nj.new_page();np.goto(URL,wait_until='load')
    check(np.locator('#ch5 svg.fig').count()==7 and np.locator('#ch5').is_visible(),'All seven plates and prose readable with JavaScript off');np.locator('#fig-5-3').scroll_into_view_if_needed();shot(np,'no-js.png');nj.close()
    # Normal-motion users still open on a static state; tours pause off-screen and on preference changes.
    mc=b.new_context(viewport={'width':820,'height':1000},reduced_motion='no-preference');mp=mc.new_page();monitor(mp);ready(mp)
    for n in [3,4,6]:
        mf=openfig(mp,n)
        before=mf.locator('.live-readout').inner_text();mp.wait_for_timeout(300);check(before==mf.locator('.live-readout').inner_text(),'No autoplay at normal motion preference')
        mf.locator('.live-watch-btn').click();check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='true','Tour starts only on request')
        mp.locator('#s5-1').scroll_into_view_if_needed();mp.wait_for_timeout(200);check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour pauses off-screen')
        mf.scroll_into_view_if_needed();mf.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(150);check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Open tour stops when reduced motion changes')
        mf.locator('.live-close').click();mp.emulate_media(reduced_motion='no-preference')
    mc.close()
    # Final-build service-worker cache: offline reload plus all Chapter 5 widgets reopening offline.
    pg.evaluate('navigator.serviceWorker.ready');pg.wait_for_timeout(2000)
    check(pg.evaluate('!!navigator.serviceWorker.controller'),'Service worker controls final build')
    c.set_offline(True);off=c.new_page();monitor(off);ready(off)
    check(off.locator('#ch5').is_visible(),'Chapter 5 reloads offline')
    for n in [3,4,6]:
        of=openfig(off,n);check(of.locator('canvas').count()==1,f'Widget {n} opens offline');of.locator('.live-close').click()
        of=openfig(off,n);check(of.locator('canvas').count()==1,f'Widget {n} reopens offline');of.locator('.live-close').click()
    off.evaluate("App.openStory('p-helmont')");off.wait_for_timeout(150)
    check(off.locator('#storydlg #story-p-helmont').is_visible() and 'about 2 ounces' in off.locator('#storydlg').inner_text(),'Corrected cast story opens offline')
    off.keyboard.press('Escape')
    c.set_offline(False);c.close();b.close()
    fb=p.chromium.launch(args=['--disable-webgl']);fc=fb.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');fp=fc.new_page();monitor(fp);ready(fp)
    for n in [3,4,6]:
        ff=openfig(fp,n);check(ff.locator('canvas').count()==1,f'Widget {n} works with WebGL disabled');shot(ff,f'no-webgl-{n}.png');ff.locator('.live-close').click()
    fb.close()
server.shutdown()
check(not report['errors'],f'No console/page errors: {report["errors"]}')
check((ROOT/'build/site/index.html').stat().st_size<4_000_000,'Index below 4 MB')
for pattern in ['w_carbon_account-*.js','w_limiting_lab-*.js','w_sap_routes-*.js']:
    q=list((ROOT/'build/site/live').glob(pattern));check(len(q)==1 and q[0].stat().st_size<150_000,f'{pattern}: below 150 KB')
amendments=json.loads((ROOT/'tests/helmont-authorised-corrections.json').read_text())['files']
check(set(amendments)=={'source/src/stories/p-helmont.md','source/provenance/stories.yml'},'Only explicitly authorised older-story files amend preservation')
for file,sha in json.loads((ROOT/'tests/ch05-preserved.json').read_text())['files'].items():
    data=(ROOT.parent/file).read_bytes()
    if file=='source/live/enhancements.js':data=(data.decode().split('  carbon_account: {')[0]+'};\n').encode()
    if file=='source/book.css':data=data.decode().split('\n/* Chapter 5 print verification:')[0].encode()
    if file in amendments:
        check(amendments[file]['before']==sha,'Correction refers to immutable original baseline '+file)
        check(hashlib.sha256(data).hexdigest()==amendments[file]['after'],'Authorised corrected content '+file)
    else:check(hashlib.sha256(data).hexdigest()==sha,'Preserved '+file)
report['cache']=re.search(r"const CACHE\s*=\s*['\"]([^'\"]+)",(ROOT/'build/site/sw.js').read_text()).group(1)
(OUT/'report.json').write_text(json.dumps(report,indent=2));print(f'PASS {len(report["checks"])} assertions, 15 viewport/theme combinations; {report["domain"]}; cache {report["cache"]}; {OUT}')
