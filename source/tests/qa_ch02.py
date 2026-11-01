#!/usr/bin/env python3
"""Chapter 2 acceptance: rendered matrix, arithmetic, manual controls and fallbacks.
Run from source/: kym_physics/.venv/bin/python tests/qa_ch02.py
Screenshots and report stay in /tmp/lt_bio/ch02-qa.
"""
from pathlib import Path
import functools, http.server, json, math, threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path('/tmp/lt_bio/ch02-qa'); OUT.mkdir(parents=True, exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'build/site')))
threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_address[1]}/index.html'
report={'matrix':[], 'checks':[], 'console':[]}

def check(ok, description):
    assert ok, description
    report['checks'].append(description)

def monitor(page):
    page.on('pageerror',lambda e: report['console'].append(str(e)))
    page.on('console',lambda m: report['console'].append(m.text) if m.type=='error' else None)

def ready(page):
    page.goto(URL+'#ch2',wait_until='load');page.wait_for_timeout(500)
    page.evaluate('document.fonts.ready');page.locator('#ch2').wait_for(state='visible')

def set_slider(fig, label, value):
    # The API gives the slider a visible associated label.
    fig.get_by_label(label, exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))

with sync_playwright() as p:
    browser=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    page=context.new_page();monitor(page);ready(page)
    check('Access for free at' in page.locator('#ch2').inner_text(),'OpenStax access attribution appears in Chapter 2')
    # Every static figure is inspected in all requested viewports/themes.
    for width in [390,820,1024,1180,1440]:
        page.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            page.wait_for_timeout(100)
            check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'No document overflow: {width}px {theme}')
            for n in range(1,5):
                fig=page.locator(f'#fig-2-{n}')
                fig.scroll_into_view_if_needed()
                fig.screenshot(path=str(OUT/f'plate-{n}-{width}-{theme}.png'))
                clipped=fig.locator('svg.fig').evaluate('''s=>[...s.querySelectorAll('text')].filter(t=>{
                    const b=t.getBBox(), v=s.viewBox.baseVal;
                    return b.x < -1 || b.y < -1 || b.x+b.width>v.width+1 || b.y+b.height>v.height+1;
                }).map(t=>t.textContent)''')
                check(not clipped,f'SVG text inside viewBox: plate {n}, {width}px {theme}: {clipped}')
                collisions=fig.locator('svg.fig').evaluate("""s=>{
                    const labels=[...s.querySelectorAll('text')].map(t=>({t:t.textContent,b:t.getBBox()}));
                    const out=[];
                    for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++) {
                      const a=labels[i],c=labels[j];
                      if(Math.min(a.b.x+a.b.width,c.b.x+c.b.width)-Math.max(a.b.x,c.b.x)>1 &&
                         Math.min(a.b.y+a.b.height,c.b.y+c.b.height)-Math.max(a.b.y,c.b.y)>1) out.push([a.t,c.t]);
                    }return out;
                }""")
                check(not collisions,f'No SVG label collisions: plate {n}, {width}px {theme}: {collisions}')
            report['matrix'].append({'viewport':width,'theme':theme,'plates':4})
    # New widgets: default and meaningful changed states at desktop and mobile in all themes.
    for width in [390,1440]:
        page.set_viewport_size({'width':width,'height':1000})
        for theme in ['light','dark','sepia']:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for n in [1,2,3]:
                fig=page.locator(f'#fig-2-{n}')
                fig.scroll_into_view_if_needed();fig.locator('.live-open').click();page.wait_for_timeout(600)
                check(fig.locator('.live-stage').count()==1,f'Widget {n} opens at {width}px {theme}')
                check(fig.locator('.live-play:visible').count()==0,f'Widget {n} has no meaningless playback control')
                fig.screenshot(path=str(OUT/f'live-{n}-{width}-{theme}-default.png'))
                if n==1:
                    fig.get_by_role('button',name='White onion bulb',exact=True).click()
                    check('no developed chloroplasts' in fig.locator('.live-readout').inner_text().lower() or 'lacking developed chloroplasts' in fig.locator('.live-readout').inner_text().lower(),'Onion comparison remains explicit')
                elif n==2:
                    fig.get_by_role('button',name='Chloroplast',exact=True).click();set_slider(fig,'Clue groups',4)
                    check('cyanobacterial' in fig.locator('.live-readout').inner_text(),'Chloroplast ancestry readout changes with controls')
                else:
                    set_slider(fig,'Side length',10);set_slider(fig,'Reached depth',.2)
                    fig.get_by_role('button',name='Centre slice',exact=True).click()
                    check('11.5%' in fig.locator('.live-readout').inner_text(),'Cube reports volume fraction, not cross-sectional area fraction')
                    view=fig.locator('.live-3d')
                    if view.count():
                        before=view.screenshot();view.focus();page.keyboard.press('ArrowRight')
                        check(before!=view.screenshot(),'3D camera responds to keyboard')
                # Every manual tour shot must execute without errors; reduced motion never schedules its timed tour.
                fig.locator('.live-watch-btn').click()
                check(fig.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Reduced-motion tour uses manual steps')
                for button in fig.locator('.live-watch-dot').all(): button.click()
                if n==3:
                    set_slider(fig,'Side length',10);set_slider(fig,'Reached depth',.2)
                    fig.get_by_role('button',name='Centre slice',exact=True).click()
                fig.screenshot(path=str(OUT/f'live-{n}-{width}-{theme}-changed.png'))
                check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'No live overflow: widget {n}, {width}px {theme}')
                fig.locator('.live-close').click()
    # Check zero depth, total reach and the eight-cube conservation account in JS directly.
    # Domain module is also checked directly by the arithmetic gate in Node; here verify visible extremes.
    fig=page.locator('#fig-2-3');fig.scroll_into_view_if_needed();fig.locator('.live-open').click();page.wait_for_timeout(200)
    set_slider(fig,'Reached depth',0)
    check('0.0%' in fig.locator('.live-readout').inner_text(),'Zero reached depth gives zero reached volume')
    set_slider(fig,'Side length',1);set_slider(fig,'Reached depth',.5)
    check('100.0%' in fig.locator('.live-readout').inner_text(),'Opposite reached layers meet at the centre')
    fig.locator('.live-close').click()
    # Print restores the static SVG for an open widget.
    fig.locator('.live-open').click();page.wait_for_timeout(200)
    page.emulate_media(media='print')
    check(fig.locator('svg.fig').is_visible(),'Print exposes the SVG even while a widget is open')
    page.pdf(path=str(OUT/'chapter-print-check.pdf'),format='A4',print_background=True)
    page.emulate_media(media='screen');fig.locator('.live-close').click()
    # No JavaScript: prose, illustrations, evidence and native folded content remain available.
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    np=nojs.new_page();np.goto(URL,wait_until='load')
    check(np.locator('#ch2 svg.fig').count()==4,'All four Chapter 2 plates exist without JavaScript')
    check(np.locator('#ch2').is_visible(),'Chapter prose remains visible without JavaScript')
    np.locator('#fig-2-4').scroll_into_view_if_needed();np.screenshot(path=str(OUT/'no-js-390.png'))
    nojs.close()
    # Normal motion: an explicitly requested tour stops as the reader scrolls away.
    motion=browser.new_context(viewport={'width':820,'height':1000},reduced_motion='no-preference')
    mp=motion.new_page();monitor(mp);ready(mp)
    mf=mp.locator('#fig-2-3');mf.scroll_into_view_if_needed();mf.locator('.live-open').click();mp.wait_for_timeout(600)
    mf.locator('.live-watch-btn').click();mp.locator('#s2-4').scroll_into_view_if_needed();mp.wait_for_timeout(300)
    check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Timed tour stops off-screen')
    mf.scroll_into_view_if_needed();mf.locator('.live-watch-btn').click()
    mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(150)
    check(mf.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Timed tour stops when reduced motion is enabled')
    motion.close();context.close();browser.close()
    # Disable WebGL: the same numeric account and Canvas controls still work.
    fallback=p.chromium.launch(args=['--disable-webgl'])
    fc=fallback.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
    fp=fc.new_page();monitor(fp);ready(fp)
    ff=fp.locator('#fig-2-3');ff.scroll_into_view_if_needed();ff.locator('.live-open').click();fp.wait_for_timeout(500)
    check(ff.locator('canvas').count()==1,'Canvas-only fallback opens without WebGL')
    set_slider(ff,'Side length',10)
    check('11.5%' in ff.locator('.live-readout').inner_text(),'Fallback retains exact cube calculation')
    ff.screenshot(path=str(OUT/'no-webgl-390.png'))
    fallback.close()
server.shutdown()
check(not report['console'],f'No browser errors: {report["console"]}')
(OUT/'report.json').write_text(json.dumps(report,indent=2))
print(f'PASS: {len(report["matrix"])} viewport/theme combinations; {len(report["checks"])} assertions; 0 browser errors. Artifacts: {OUT}')
