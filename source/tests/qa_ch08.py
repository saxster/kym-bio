#!/usr/bin/env python3
"""Chapter 8 acceptance on the built book, with separate durable local receipts.

Run tests/verify_ch08.sh for the complete required build/regression/offline suite.
BIO_CH08_QA_OUT selects receipts. Browser font metrics supplement direct image review.
"""
from pathlib import Path
import base64,functools,hashlib,http.server,json,os,re,subprocess,threading,traceback,unicodedata
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'build/site'
OUT=Path(os.environ.get('BIO_CH08_QA_OUT','/tmp/lt_bio_ch08/qa'));OUT.mkdir(parents=True,exist_ok=True)
WIDTHS=[390,820,1024,1180,1440];THEMES=['light','dark','sepia'];WIDGETS={2:'breathing_gradients',6:'double_pump',7:'vessel_exchange'}
report={'checks':[],'errors':[],'screenshots':[],'matrix':[],'tour_states':[],'status':'running'}

def check(ok,message):
    if not ok:raise AssertionError(message)
    report['checks'].append(message)

def shot(target,name):
    target.screenshot(path=str(OUT/name));report['screenshots'].append(name)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

def monitor(page):
    page.on('pageerror',lambda e:report['errors'].append(str(e)))
    page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)

def ready(page,fragment='ch8'):
    page.goto(URL+'#'+fragment,wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(400)

def slide(f,label,value):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))

def tab(f,label):f.get_by_role('button',name=label,exact=True).click()

def opened(page,n):
    f=page.locator(f'#fig-8-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();page.wait_for_timeout(350);return f

def stamped(f):return f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')")

def clear_stamps(page):page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")

def preservation():
    baseline=json.loads((ROOT/'tests/ch08-preserved.json').read_text())['files']
    for name,expected in baseline.items():
        data=(ROOT.parent/name).read_bytes()
        if name=='source/live/enhancements.js':
            marker=b'  breathing_gradients: {'
            check(data.count(marker)==1,'Three Chapter8 enhancements appended once')
            data=data.split(marker)[0]+b'};\n'
            check(data==base64.b64decode(expected['original_base64']),'Exact original enhancement bytes reconstructed; no whole-file exemption')
        check(len(data)==expected['bytes'] and hashlib.sha256(data).hexdigest()==expected['sha256'],'Preserved '+name)
    report['preserved_files']=len(baseline)

SVG_AUDIT=r'''s=>{
 const v=s.viewBox.baseVal,a=[...s.querySelectorAll('text')].map(t=>({t:t.textContent,b:t.getBBox()})),out=[];
 for(const q of a){const b=q.b;if(b.x<-.1||b.y<-.1||b.x+b.width>v.width+.1||b.y+b.height>v.height+.1)out.push('clip '+q.t);}
 for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const x=a[i],y=a[j];if(Math.min(x.b.x+x.b.width,y.b.x+y.b.width)-Math.max(x.b.x,y.b.x)>1&&Math.min(x.b.y+x.b.height,y.b.y+y.b.height)-Math.max(x.b.y,y.b.y)>1)out.push('overlap '+x.t+' / '+y.t);}
 for(const shape of s.querySelectorAll('rect,circle,ellipse,path,line,polygon,polyline')){const b=shape.getBBox();if(b.x<-.1||b.y<-.1||b.x+b.width>v.width+.1||b.y+b.height>v.height+.1)out.push('geometry clip '+shape.outerHTML.slice(0,100));}
 for(const l of s.querySelectorAll('[marker-end]')){
  const ref=l.getAttribute('marker-end').match(/#([^)]+)/),marker=ref&&document.getElementById(ref[1]);
  if(!marker||getComputedStyle(l).stroke==='none')out.push('missing arrow '+l.outerHTML.slice(0,70));
  if(!l.getTotalLength)continue;const len=l.getTotalLength();
  for(const q of a){const b=q.b;for(let d=1;d<len-1;d+=.75){const p=l.getPointAtLength(d);if(p.x>b.x+.5&&p.x<b.x+b.width-.5&&p.y>b.y+.5&&p.y<b.y+b.height-.5){out.push('arrow crosses '+q.t);break;}}}
 }
 return out;
}'''
CANVAS_AUDIT=r'''window.ch08Issues=[];window.ch08Frames={};window.ch08GL=0;
const original=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...rest){
 const id=this.canvas.closest('figure')?.id;
 if(id?.startsWith('fig-8-')&&this.canvas.dataset.logicalWidth){
 const W=+this.canvas.dataset.logicalWidth,H=+this.canvas.style.aspectRatio.split('/')[1],m=this.measureText(t);
 const bounds={left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
 if(bounds.left<-.1||bounds.right>W+.1||bounds.top<-.1||bounds.bottom>H+.1)window.ch08Issues.push({id,text:String(t),bounds,W,H});
 window.ch08Frames[id]=(window.ch08Frames[id]||0)+1;
 }return original.call(this,t,x,y,...rest);
};'''

def overflow(page,f,label):
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No document overflow '+label)
    issues=f.locator('.live-slider, .live-tabs, .live-controls').evaluate_all('''els=>{const out=[];for(const e of els){const box=e.closest('figure').getBoundingClientRect();for(const q of e.querySelectorAll('label,input,output,button')){if(!q.getClientRects().length)continue;const b=q.getBoundingClientRect();if(b.left<box.left-1||b.right>box.right+1)out.push(q.textContent||q.type);}}return [...new Set(out)];}''')
    check(not issues,f'Controls within figure {label}: {issues}')

def assert_tour(f,n,index):
    expected={
        2:[(0,500,12,False),(1,500,12,False),(0,250,24,True),(2,1500,30,False),(3,500,12,False)],
        6:[(0,1,70,60,False),(0,4,70,60,True),(1,4,70,60,False),(2,2,70,60,True),(3,2,70,60,False)],
        7:[(0,0,4.9,False),(0,3,4.9,True),(1,3,4.9,True),(2,5,4.9,False),(3,3,4.9,False)],
    }[n][index]
    text=f.locator('.live-readout').inner_text()
    if n==2:
        m,vt,r,cut=expected
        label=['Quiet inhalation','Quiet exhalation','Forced exhalation / exercise','Bell-jar model check'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual breathing tab '+label)
        check(int(f.get_by_label('Tidal volume',exact=True).input_value())==vt,'Actual tidal volume')
        check(int(f.get_by_label('Breathing rate',exact=True).input_value())==r,'Actual breathing rate')
        check(f'Mode {m}: {label}. Tidal volume {vt} mL; breathing rate {r} breaths/min' in text,'Breathing tour readout agrees')
        check(f'Total minute ventilation {(vt*r)/1000:.1f} L/min; alveolar ventilation {(max(0,vt-150)*r)/1000:.1f} L/min' in text,'Independent browser dead-space oracle')
    elif n==6:
        m,s,hr,sv,cut=expected
        label=['Intact double pump','Harvey 1628 vs Modern','Post-natal VSD case','Fish single circuit'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual pump tab '+label)
        check(int(f.get_by_label('Circuit stage',exact=True).input_value())==s,'Actual circuit stage')
        check(int(f.get_by_label('Heart rate',exact=True).input_value())==hr,'Actual heart rate')
        check(int(f.get_by_label('Stroke volume',exact=True).input_value())==sv,'Actual stroke volume')
        check(f'Mode {m}: {label}; stage {s}:' in text,'Pump tour readout agrees')
        check(f'cardiac output {(hr*sv)/1000:.2f} L/min' in text,'Independent browser cardiac output oracle')
    else:
        m,seg,co,cut=expected
        label=['Vessel structure & speed','Tissue fluid & lymph','RBCs, plasma & WBCs','Platelets & fibrin clot'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual vessel tab '+label)
        check(int(f.get_by_label('Vessel segment',exact=True).input_value())==seg,'Actual vessel segment')
        check(abs(float(f.get_by_label('Cardiac output',exact=True).input_value())-co)<1e-6,'Actual cardiac output')
        check(f'Focus {m}: {label}; segment {seg}:' in text,'Vessel tour readout agrees')
    check(f.locator('.live-cutaway-btn').get_attribute('aria-pressed')==str(cut).lower(),'Actual cutaway explicitly set')
    report['tour_states'].append({'figure':n,'shot':index+1,'state':list(expected)})

def challenge(page,f,n):
    if n==2:
        slide(f,'Tidal volume',250);slide(f,'Breathing rate',24)
        check(not stamped(f),'Sliders without captured trials cannot earn dead-space comparison')
        tab(f,'Capture breath trial');tab(f,'Capture breath trial')
        check(not stamped(f),'Identical breath trial cannot earn dead-space comparison')
        tab(f,'Clear breath trials')
        tab(f,'Shallow rapid (250 mL × 24)');tab(f,'Capture breath trial')
        tab(f,'Quiet rest (500 mL × 12)');tab(f,'Capture breath trial')
        text=f.locator('.live-readout').inner_text()
        check('Equal minute ventilation, different alveolar ventilation: deeper breaths waste less dead space.' in text,'Equal V_E different V_A comparison recorded')
        slide(f,'Tidal volume',1000);slide(f,'Breathing rate',16)
        text=f.locator('.live-readout').inner_text()
        check('1: 250 mL × 24/min, total 6.0 L/min, alveolar 2.4 L/min | 2: 500 mL × 12/min, total 6.0 L/min, alveolar 4.2 L/min' in text,'Saved breath trials remain immutable after slider changes')
    elif n==6:
        tab(f,'Post-natal VSD case');slide(f,'Circuit stage',2)
        check(not stamped(f),'Switching tabs without capturing both states cannot earn VSD comparison')
        tab(f,'Intact double pump');tab(f,'Capture pump state')
        check(not stamped(f),'Single captured state cannot earn VSD comparison')
        tab(f,'Post-natal VSD case');tab(f,'Capture pump state')
        text=f.locator('.live-readout').inner_text()
        check('Intact and post-natal VSD states captured for comparison.' in text,'Both intact and VSD states captured')
        slide(f,'Heart rate',120);slide(f,'Stroke volume',90)
        text=f.locator('.live-readout').inner_text()
        check('1: Intact double pump, CO 4.20 L/min, Qp 4.20, Qs 4.20, Qp/Qs 1.00 (None (intact septum))' in text and '2: Post-natal VSD case, CO 4.20 L/min, Qp 6.72, Qs 4.20, Qp/Qs 1.60 (Left-to-right (LV → RV → pulmonary artery → lungs))' in text,'Saved pump captures remain immutable')
    else:
        slide(f,'Vessel segment',3)
        check(not stamped(f),'Moving segment slider without capture cannot earn continuity comparison')
        slide(f,'Vessel segment',0);tab(f,'Capture vessel state')
        check(not stamped(f),'Single vessel capture cannot earn continuity comparison')
        slide(f,'Vessel segment',3);tab(f,'Capture vessel state')
        text=f.locator('.live-readout').inner_text()
        check('Aorta and Capillary bed states captured for comparison.' in text,'Both Aorta and Capillary bed states captured')
        slide(f,'Cardiac output',9.8)
        text=f.locator('.live-readout').inner_text()
        check('1: Aorta, A_total 4.5 cm², P 93 mmHg, v 181.481 mm/s | 2: Capillary bed, A_total 4500 cm², P 25 mmHg, v 0.181 mm/s' in text,'Saved vessel captures remain immutable')
    check(stamped(f),'Challenge earned from required captured outcomes')

def story_check(page,label):
    story=page.locator('#storydlg #story-harvey-circulation');check(story.is_visible(),'Story opens '+label)
    text=story.inner_text()
    check('Frankfurt' in text and 'one drachm' in text,'Story includes Frankfurt 1628 and conservative drachm lower bound '+label)
    check('Ibn al-Nafis' in text and 'Marcello Malpighi' in text,'Story credits predecessors and Malpighi capillaries '+label)
    check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'),'Story no unintended horizontal overflow '+label)

def browser_checks():
    with sync_playwright() as p:
        browser=p.chromium.launch()
        context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        context.add_init_script(CANVAS_AUDIT);page=context.new_page();monitor(page);requests=[]
        page.on('request',lambda r:requests.append(r.url) if '/live/' in r.url else None)
        ready(page);check(not requests,'No lazy chunks imported before interaction')
        check(page.locator('#ch8 svg.fig').count()==9,'Nine original Chapter8 plates in final book')
        check('Access for free at' in page.locator('#ch8').inner_text(),'Generated OpenStax footer present')
        for width in WIDTHS:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for n in range(1,10):
                    f=page.locator(f'#fig-8-{n}');f.scroll_into_view_if_needed();page.wait_for_timeout(60)
                    issues=f.locator('svg.fig').evaluate(SVG_AUDIT)
                    check(not issues,f'SVG font bounds/collisions/arrows {n}/{width}/{theme}: {issues}')
                    shot(f,f'plate-{n}-{width}-{theme}.png')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No page overflow {width}/{theme}')
                report['matrix'].append([width,theme])
        # Original static enlargements: every plate, mobile and desktop, full view or keyboard pan.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for n in range(1,10):
                f=page.locator(f'#fig-8-{n}');button=f.locator('.figure-enlarge');button.scroll_into_view_if_needed();button.focus()
                check(button.evaluate('e=>document.activeElement===e'),'Static enlarge receives keyboard focus')
                page.keyboard.press('Enter');page.wait_for_timeout(180)
                dlg=page.locator('.figure-detail');check(dlg.is_visible(),'Keyboard opens static enlargement')
                scroll=dlg.locator('.figure-detail-scroll');scroll.focus();check(scroll.evaluate('e=>document.activeElement===e'),'Static scroll region focused')
                state=scroll.evaluate('e=>({max:e.scrollWidth-e.clientWidth,before:e.scrollLeft})')
                if state['max']>1:
                    page.keyboard.press('ArrowRight');page.wait_for_timeout(200)
                    check(scroll.evaluate('e=>e.scrollLeft>0'),'Keyboard pans overflowing static drawing')
                else:
                    check(scroll.locator('svg').evaluate('e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return a.left>=b.left&&a.right<=b.right;}'),'Already fitting static drawing fully visible')
                shot(dlg,f'enlarge-{n}-{width}.png');page.keyboard.press('Escape');page.wait_for_timeout(100)
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for n in WIDGETS:
                    clear_stamps(page);f=opened(page,n)
                    check(f.locator('.live-play').count()==0,'No meaningless elapsed-time playback')
                    check(not stamped(f),'Challenge initially unearned')
                    shot(f,f'live-{n}-{width}-{theme}-default.png');overflow(page,f,f'{n}/{width}/{theme}/default')
                    challenge(page,f,n)
                    f.locator('.live-watch-btn').click();check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Reduced-motion tour remains manual')
                    dots=f.locator('.live-watch-dot');check(dots.count()==5,'Exactly five tour shots')
                    for index in [4,1,3,0,2,4]:dots.nth(index).click();assert_tour(f,n,index)
                    shot(f,f'live-{n}-{width}-{theme}-changed.png');overflow(page,f,f'{n}/{width}/{theme}/changed')
                    before=f.locator('.live-readout').text_content();toggle=f.locator('.live-detail-toggle');toggle.focus();page.keyboard.press('Enter');page.wait_for_timeout(150)
                    check(toggle.get_attribute('aria-pressed')=='true','Keyboard opens full-size Canvas')
                    cv=f.locator('canvas');check(cv.evaluate('c=>c.getBoundingClientRect().width>=Number(c.dataset.logicalWidth)-1'),'Canvas reaches native logical width')
                    payload=cv.evaluate('c=>c.toDataURL()');(OUT/f'native-{n}-{width}-{theme}.png').write_bytes(base64.b64decode(payload.split(',')[1]))
                    scroll=f.locator('.live-stage');scroll.focus();check(scroll.evaluate('e=>document.activeElement===e'),'Live scroll receives keyboard focus')
                    if scroll.evaluate('e=>e.scrollWidth>e.clientWidth+1'):
                        scroll.evaluate('e=>e.scrollLeft=0');page.keyboard.press('ArrowRight');page.wait_for_timeout(200);check(scroll.evaluate('e=>e.scrollLeft>0'),'Keyboard pans overflowing live drawing')
                    check(before==f.locator('.live-readout').text_content(),'Enlarging/panning preserves model state')
                    shot(f,f'inspect-{n}-{width}-{theme}.png');check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Enlarged Canvas contained by local scroll')
                    toggle.click();f.locator('.live-close').click();overflow(page,f,'closed hidden controls')
        # All valid scientific states in actual final browser; canvas metrics cover text for every one.
        for n in WIDGETS:
            f=opened(page,n)
            if n==2:
                for name in ['Quiet inhalation','Quiet exhalation','Forced exhalation / exercise','Bell-jar model check']:
                    tab(f,name)
                    for vt in [250,500,1200,1800]:
                        slide(f,'Tidal volume',vt)
                        for r in [8,12,24,36]:slide(f,'Breathing rate',r)
            elif n==6:
                for name in ['Intact double pump','Harvey 1628 vs Modern','Post-natal VSD case','Fish single circuit']:
                    tab(f,name)
                    for s in range(5):
                        slide(f,'Circuit stage',s)
                        for hr in [50,70,120,160]:slide(f,'Heart rate',hr)
            else:
                for name in ['Vessel structure & speed','Tissue fluid & lymph','RBCs, plasma & WBCs','Platelets & fibrin clot']:
                    tab(f,name)
                    for seg in range(7):
                        slide(f,'Vessel segment',seg)
                        for co in [2.8,4.9,9.8,14.0]:slide(f,'Cardiac output',co)
            f.locator('.live-close').click()
        # Resize/theme while open: repaint, preserve state/readouts/captures; keyboard slider actual focus.
        for n,label,val,step in [(2,'Tidal volume',600,50),(6,'Circuit stage',2,1),(7,'Vessel segment',2,1)]:
            f=opened(page,n);slide(f,label,val);before=f.locator('.live-readout').text_content();frames=page.evaluate(f'window.ch08Frames["fig-8-{n}"]')
            page.set_viewport_size({'width':820,'height':900});page.evaluate("document.documentElement.dataset.theme='dark'");page.wait_for_timeout(180)
            check(page.evaluate(f'window.ch08Frames["fig-8-{n}"]')>frames,'Paused Canvas actually repaints after resize/theme')
            check(before==f.locator('.live-readout').text_content(),'Resize/theme retains model state')
            slider=f.get_by_label(label,exact=True);slider.focus();check(slider.evaluate('e=>document.activeElement===e'),'Slider receives keyboard focus');page.keyboard.press('ArrowRight')
            check(float(slider.input_value())==val+step,'Keyboard changes actual labelled control')
            shot(f,f'paused-resize-{n}.png');f.locator('.live-close').click()
        check(not page.evaluate('window.ch08Issues'),'Actual Canvas ink bounds all states: '+str(page.evaluate('window.ch08Issues')))
        # Both visible story card and auto-linked names; open native folds if any.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for selector in ['#ch8 a.st-card[data-story="harvey-circulation"]','#ch8 a.sl:not(.st-card)[data-story="harvey-circulation"]']:
                    link=page.locator(selector).first
                    link.evaluate("e=>{for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}")
                    link.scroll_into_view_if_needed();link.focus();check(link.evaluate('e=>document.activeElement===e'),'Story link receives keyboard focus')
                    page.keyboard.press('Enter');page.wait_for_timeout(250);story_check(page,f'{width}/{theme}')
                    shot(page.locator('#storydlg'),f'story-{width}-{theme}-{ "card" if "st-card[" in selector else "term"}.png')
                    page.keyboard.press('Escape');page.wait_for_timeout(200);check(not page.locator('#storydlg').is_visible(),'Escape closes story')
        deep=context.new_page();monitor(deep);ready(deep,'story-harvey-circulation');story_check(deep,'direct URL');deep.close()
        for ch_idx in range(8):
            check(page.locator(f'#ch{ch_idx} a[data-story="harvey-circulation"]').count()==0,f'New proper-name terms do not hijack preserved Chapter{ch_idx}')
        # Print original SVGs with all three widgets open; test the real print CSS in all screen themes.
        print_figures=[opened(page,n) for n in WIDGETS]
        page.emulate_media(media='print')
        for f in print_figures:
            check(f.locator('svg.fig').evaluate("e=>getComputedStyle(e).display==='block'"),'Print style restores each original SVG with all three widgets open')
            check(not f.locator('.live-stage').is_visible(),'Each interactive stage excluded from print')
        for theme in THEMES:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            check(page.evaluate("getComputedStyle(document.documentElement).colorScheme==='light'"),'Print light colour scheme from '+theme)
            check(page.locator('body').evaluate("e=>getComputedStyle(e).backgroundColor==='rgb(255, 255, 255)'"),'Print white paper from '+theme)
            check(page.locator('#ch8').evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"),'Print dark chapter ink from '+theme)
            check(page.locator('#ch8 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"),'Print SVG dark ink from '+theme)
        page.pdf(path=str(OUT/'print.pdf'),format='A4',print_background=True);report['print_pdf']=str(OUT/'print.pdf')
        for f in print_figures:
            check(f.locator('svg.fig').is_visible(),'Actual pagination renders each original SVG with all three widgets open')
        page.emulate_media(media='screen')
        for f in print_figures:f.locator('.live-close').click()
        # Normal motion: no autoplay, offscreen pause and changing reduced-motion preference stop tours.
        motion=browser.new_context(viewport={'width':820,'height':1000},reduced_motion='no-preference');mp=motion.new_page();monitor(mp);ready(mp)
        for n in WIDGETS:
            f=opened(mp,n);before=f.locator('canvas').evaluate('c=>c.toDataURL()');mp.wait_for_timeout(400)
            check(before==f.locator('canvas').evaluate('c=>c.toDataURL()'),'Normal motion still opens without autoplay')
            f.locator('.live-watch-btn').click();check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='true','Tour begins on explicit request')
            mp.locator('#s8-4' if n==2 else '#s8-1').scroll_into_view_if_needed();mp.wait_for_timeout(180);check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour stops offscreen')
            f.scroll_into_view_if_needed();f.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(180)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Dynamic reduced motion stops active tour')
            f.locator('.live-close').click();mp.emulate_media(reduced_motion='no-preference')
        motion.close()
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nojs.new_page();np.goto(URL,wait_until='load')
        check(np.locator('#ch8').is_visible() and np.locator('#ch8 svg.fig').count()==9,'No-JavaScript prose and all nine original plates available')
        check('anatomical dead space' in np.locator('#ch8').inner_text(),'No-JavaScript retains causal explanation')
        np.locator('#fig-8-2').scroll_into_view_if_needed();shot(np,'no-js.png');nojs.close()
        page.evaluate('navigator.serviceWorker.ready');page.wait_for_timeout(1800)
        check(page.evaluate('!!navigator.serviceWorker.controller'),'Built service worker controls final book')
        report['browser_caches']=page.evaluate('caches.keys()');check(report['cache'] in report['browser_caches'],'Browser uses exact final built cache')
        context.set_offline(True);offline=context.new_page();monitor(offline);ready(offline)
        check(offline.locator('#ch8').is_visible(),'Chapter8 reloads offline')
        for n in WIDGETS:
            for attempt in [1,2]:
                f=opened(offline,n);check(f.locator('canvas[aria-label]').count()==1,f'Widget{n} opens/reopens offline attempt{attempt}');f.locator('.live-close').click()
        offline.evaluate("App.openStory('harvey-circulation')");offline.wait_for_timeout(250);story_check(offline,'offline');shot(offline.locator('#storydlg'),'story-offline.png')
        offline.keyboard.press('Escape');context.set_offline(False);context.close();browser.close()
        fallback=p.chromium.launch(args=['--disable-webgl']);fc=fallback.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        fc.add_init_script(CANVAS_AUDIT+'''const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...rest){if(kind.includes('webgl'))window.ch08GL++;return get.call(this,kind,...rest);};''')
        fp=fc.new_page();monitor(fp);ready(fp)
        for n,label,step in [(2,'Tidal volume',50),(6,'Circuit stage',1),(7,'Vessel segment',1)]:
            f=opened(fp,n);check(f.locator('canvas[aria-label]').count()==1,'Usable Canvas without WebGL')
            slider=f.get_by_label(label,exact=True);old=float(slider.input_value());slider.focus();fp.keyboard.press('ArrowRight')
            check(float(slider.input_value())==old+step,'Keyboard changes model without WebGL')
            shot(f,f'no-webgl-{n}.png');f.locator('.live-close').click()
        check(fp.evaluate('window.ch08GL')==0,'No Chapter8 WebGL probes or owned GL resources')
        check(not fp.evaluate('window.ch08Issues'),'Fallback Canvas text bounds valid');fallback.close()

def pdf_receipts():
    subprocess.run(['pdftotext','-layout',str(OUT/'print.pdf'),str(OUT/'print.txt')],check=True)
    subprocess.run(['pdftotext','-raw',str(OUT/'print.pdf'),str(OUT/'print-raw.txt')],check=True)
    pages=(OUT/'print-raw.txt').read_text().split('\f')
    normal=lambda s:re.sub(r'[\s\-\u00ad]+','',unicodedata.normalize('NFKC',s).replace('’',"'"))
    captions=[]
    for line in (ROOT/'src/ch08.md').read_text().splitlines():
        if line.startswith(':::fig '):captions.append(line.split(' | ',1)[1])
    mapping={}
    for n,caption in enumerate(captions,1):
        needle=normal(caption)
        found=[i+1 for i,text in enumerate(pages) if needle in normal(text)]
        check(len(found)==1,f'Plate{n} caption exists on one actual PDF page: {found}')
        mapping[str(n)]=found[0]
    for n in sorted(set(mapping.values())):
        subprocess.run(['pdftoppm','-f',str(n),'-l',str(n),'-scale-to','1500','-singlefile','-png',str(OUT/'print.pdf'),str(OUT/f'pdf-{n}')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    report['pdf_pages']=mapping;report['pdf_page_count']=len(pages)-1
    report['story_body_printed']=normal('Deliberate lower-bound arithmetic can rule out an impossible supply claim') in normal((OUT/'print-raw.txt').read_text())
    (OUT/'pdf-pages.json').write_text(json.dumps(mapping,indent=2))

server=None
try:
    check((SITE/'index.html').exists(),'Final built site exists');preservation()
    raw=(ROOT/'src/ch08.md').read_text();check(re.findall(r'^## (8\.\d) ',raw,re.M)==['8.1','8.2','8.3','8.4'],'Exactly four numbered sections')
    check('$' not in raw and '\\text' not in raw,'No raw LaTeX syntax in Chapter8 prose')
    check(raw.count(':::check\n')==4 and raw.count(':::predict\n')==4,'One prediction/check per section')
    check(':::case ' in raw and raw.rstrip().endswith(':::'),'Case and final bridge present')
    result=subprocess.run(['node','tests/ch08_domain.mjs'],cwd=ROOT,capture_output=True,text=True)
    check(result.returncode==0,result.stdout+result.stderr);report['domain']=result.stdout.strip()
    report['index_bytes']=(SITE/'index.html').stat().st_size;check(report['index_bytes']<4_000_000,'Index below4MB')
    report['chunk_bytes']={}
    for name in WIDGETS.values():
        chunks=list((SITE/'live').glob(f'w_{name}-*.js'));check(len(chunks)==1 and chunks[0].stat().st_size<150_000,'Lazy chunk budget '+name);report['chunk_bytes'][name]=chunks[0].stat().st_size
    report['cache']=re.search(r"const CACHE\s*=\s*['\"]([^'\"]+)",(SITE/'sw.js').read_text()).group(1)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(SITE)));threading.Thread(target=server.serve_forever,daemon=True).start();URL=f'http://127.0.0.1:{server.server_address[1]}/index.html'
    browser_checks();check(not report['errors'],'No console/page errors: '+str(report['errors']));pdf_receipts();preservation();report['status']='pass'
except Exception:
    report['status']='fail';report['failure']=traceback.format_exc();raise
finally:
    if server:server.shutdown()
    (OUT/'report.json').write_text(json.dumps(report,indent=2))
print(f'PASS {len(report["checks"])} assertions; {report["domain"]}; cache {report["cache"]}; {OUT}')
