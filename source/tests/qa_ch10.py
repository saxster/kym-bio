#!/usr/bin/env python3
"""Chapter 10 acceptance on the built book, with separate durable local receipts.

Run tests/verify_ch10.sh for the complete required build/regression/offline suite.
BIO_CH10_QA_OUT selects receipts. Browser font metrics supplement direct image review.
"""
from pathlib import Path
import base64,functools,hashlib,http.server,json,os,re,subprocess,threading,traceback,unicodedata
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
SITE=Path(os.environ.get('BIO_QA_SITE', str(ROOT/'build/site')))
OUT=Path(os.environ.get('BIO_CH10_QA_OUT','/tmp/lt_bio_ch10/qa'));OUT.mkdir(parents=True,exist_ok=True)
WIDTHS=[390,820,1024,1180,1440];THEMES=['light','dark','sepia']
WIDGETS={2:'glucose_thermoregulation',5:'nephron_filtration',7:'immunity_vaccine_memory'}
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

def ready(page,fragment='ch10'):
    page.goto(URL+'#'+fragment,wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(400)

def slide(f,label,value):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))

def tab(f,label):f.get_by_role('button',name=label,exact=True).click()

def opened(page,n):
    f=page.locator(f'#fig-10-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();page.wait_for_timeout(350);return f

def stamped(f):return f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')")

def clear_stamps(page):page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")

def preservation():
    baseline=json.loads((ROOT/'tests/ch10-preserved.json').read_text())['files']
    for name,expected in baseline.items():
        from revision_preservation import revised_file
        if revised_file(ROOT,name,check,report):continue
        data=(ROOT.parent/name).read_bytes()
        if name=='source/live/enhancements.js':
            marker=b'  glucose_thermoregulation: {'
            check(data.count(marker)==1,'Three Chapter10 enhancements appended once')
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
CANVAS_AUDIT=r'''window.ch10Issues=[];window.ch10Frames={};window.ch10GL=0;
const original=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...rest){
 const id=this.canvas.closest('figure')?.id;
 if(id?.startsWith('fig-10-')&&this.canvas.dataset.logicalWidth){
 const W=+this.canvas.dataset.logicalWidth,H=+this.canvas.style.aspectRatio.split('/')[1],m=this.measureText(t);
 const bounds={left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
 if(bounds.left<-.1||bounds.right>W+.1||bounds.top<-.1||bounds.bottom>H+.1)window.ch10Issues.push({id,text:String(t),bounds,W,H});
 window.ch10Frames[id]=(window.ch10Frames[id]||0)+1;
 }return original.call(this,t,x,y,...rest);
};'''

def overflow(page,f,label):
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No document overflow '+label)
    issues=f.locator('.live-slider, .live-tabs, .live-controls').evaluate_all('''els=>{const out=[];for(const e of els){const box=e.closest('figure').getBoundingClientRect();for(const q of e.querySelectorAll('label,input,output,button')){if(!q.getClientRects().length)continue;const b=q.getBoundingClientRect();if(b.left<box.left-1||b.right>box.right+1)out.push(q.textContent||q.type);}}return [...new Set(out)];}''')
    check(not issues,f'Controls within figure {label}: {issues}')

def assert_tour(f,n,index):
    expected={
        2:[(0,38,65,False),(0,15,45,True),(1,38,85,False),(2,30,85,True),(3,30,75,False)],
        5:[(0,5,125,False),(0,5,125,True),(1,5,120,False),(2,5,125,False),(3,16,125,True)],
        7:[(0,14,0,False),(0,7,90,True),(1,7,20,True),(2,28,20,False),(3,2,80,False)],
    }[n][index]
    text=f.locator('.live-readout').inner_text()
    if n==2:
        m,temp,pct,cut=expected
        label=['Skin thermoregulation','Mumbai humidity stress','Glucose feedback (Insulin/Glucagon)','Type 1 diabetes & insulin rescue'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual thermo/glucose tab '+label)
        check(int(f.get_by_label('Ambient temperature',exact=True).input_value())==temp,'Actual ambient temperature')
        check(int(f.get_by_label('Humidity or meal',exact=True).input_value())==pct,'Actual humidity/meal load')
        check(f'{label} ({temp} °C, {pct}%):' in text,'Thermo/glucose tour readout agrees')
    elif n==5:
        m,gluc,gfr,cut=expected
        label=['Normal hydration','Hot Mumbai dehydration','High-protein meal (deamination)','Untreated hyperglycaemia (16 mmol/L)'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual nephron tab '+label)
        check(int(f.get_by_label('Plasma glucose',exact=True).input_value())==gluc,'Actual plasma glucose')
        check(int(f.get_by_label('GFR filtration rate',exact=True).input_value())==gfr,'Actual GFR filtration rate')
        check(f'{label} (plasma glucose {gluc} mmol/L, GFR {gfr} mL/min' in text,'Nephron tour readout agrees')
    else:
        m,day,level,cut=expected
        label=['Primary vs Vaccine Memory','Antigen shape specificity','Active vs Passive immunity','Cholera toxin vs ORS rescue'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual immunity tab '+label)
        check(int(f.get_by_label('Days post-exposure',exact=True).input_value())==day,'Actual days post-exposure')
        check(int(f.get_by_label('Memory or ORS support',exact=True).input_value())==level,'Actual vaccine memory / ORS dose')
        check(f'{label} (Day {day}, slider {level}%):' in text,'Immunity tour readout agrees')
    check(f.locator('.live-cutaway-btn').get_attribute('aria-pressed')==str(cut).lower(),'Actual cutaway explicitly set')
    report['tour_states'].append({'figure':n,'shot':index+1,'state':list(expected)})

def challenge(page,f,n):
    if n==2:
        slide(f,'Ambient temperature',34);slide(f,'Humidity or meal',70)
        check(not stamped(f),'Sliders without captured trials cannot earn thermo/glucose comparison')
        tab(f,'Capture trial');tab(f,'Capture trial')
        check(not stamped(f),'Identical thermo/glucose trial cannot earn comparison')
        tab(f,'Clear trials')
        tab(f,'Dadar May 38 °C');tab(f,'Capture trial')
        tab(f,'Cold room 15 °C');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting thermoregulation or glucose feedback states captured for comparison:' in text,'Contrasting thermo/glucose states recorded')
        slide(f,'Ambient temperature',25);slide(f,'Humidity or meal',50)
        text=f.locator('.live-readout').inner_text()
        check('#1 Skin thermoregulation (38 °C, 65% → core 37.00 °C, glucose 5.6 mmol/L) | #2 Skin thermoregulation (15 °C, 45% → core 37.00 °C, glucose 5.3 mmol/L)' in text,'Saved thermo/glucose trials remain immutable after slider changes')
    elif n==5:
        slide(f,'Plasma glucose',8);slide(f,'GFR filtration rate',110)
        check(not stamped(f),'Sliders without capturing both states cannot earn nephron comparison')
        tab(f,'Normal 5 mmol/L');tab(f,'Capture trial')
        check(not stamped(f),'Single captured state cannot earn nephron comparison')
        tab(f,'Diabetic 16 mmol/L');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting nephron filtration and reabsorption states captured for comparison:' in text,'Both normal and hyperglycaemic nephron states captured')
        slide(f,'Plasma glucose',10);slide(f,'GFR filtration rate',100)
        text=f.locator('.live-readout').inner_text()
        check('#1 Normal hydration (gluc 5 mmol/L, GFR 125 → reabs 100%, urine 1.5 L/d) | #2 Untreated hyperglycaemia (16 mmol/L) (gluc 16 mmol/L, GFR 125 → reabs 91.7%, urine 3.8 L/d)' in text,'Saved nephron captures remain immutable')
    else:
        slide(f,'Days post-exposure',10)
        check(not stamped(f),'Moving day slider without capture cannot earn immunity comparison')
        tab(f,'Primary Day 14 (0% mem)');tab(f,'Capture trial')
        check(not stamped(f),'Single immunity capture cannot earn comparison')
        tab(f,'Vaccinated Day 7 (90% mem)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting immunity or oral rehydration states captured for comparison:' in text,'Both primary and vaccinated secondary states captured')
        slide(f,'Days post-exposure',20);slide(f,'Memory or ORS support',50)
        text=f.locator('.live-readout').inner_text()
        check('#1 Primary vs Vaccine Memory (Day 14, 0% → 28 AU, memory=YES) | #2 Primary vs Vaccine Memory (Day 7, 90% → 220.2 AU, memory=YES)' in text,'Saved immunity captures remain immutable')
    check(stamped(f),'Challenge earned from required captured outcomes')

def story_check(page,label):
    story=page.locator('#storydlg #story-banting-mahalanabis-lifelines');check(story.is_visible(),'Story opens '+label)
    text=story.inner_text()
    check('Frederick Banting' in text and 'Charles Best' in text and 'Leonard Thompson' in text,'Story includes Banting, Best and Leonard Thompson '+label)
    check('Sambhu Nath De' in text and 'Dilip Mahalanabis' in text and 'Bongaon' in text,'Story includes Sambhu Nath De, Dilip Mahalanabis and Bongaon '+label)
    check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'),'Story no unintended horizontal overflow '+label)

def browser_checks():
    with sync_playwright() as p:
        browser=p.chromium.launch()
        context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        context.add_init_script(CANVAS_AUDIT);page=context.new_page();monitor(page);requests=[]
        page.on('request',lambda r:requests.append(r.url) if '/live/' in r.url else None)
        ready(page);check(not requests,'No lazy chunks imported before interaction')
        check(page.locator('#ch10 svg.fig').count()==9,'Nine original Chapter10 plates in final book')
        check('Access for free at' in page.locator('#ch10').inner_text(),'Generated OpenStax footer present')
        check(page.locator('#ch10 a[data-story="p-agre"]').count()>=1,'Existing Peter Agre story linked in Chapter10')
        check(page.locator('#ch10 a[data-story="p-pasteur"]').count()>=1,'Existing Louis Pasteur story linked in Chapter10')
        for width in WIDTHS:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for n in range(1,10):
                    f=page.locator(f'#fig-10-{n}');f.scroll_into_view_if_needed();page.wait_for_timeout(60)
                    issues=f.locator('svg.fig').evaluate(SVG_AUDIT)
                    check(not issues,f'SVG font bounds/collisions/arrows {n}/{width}/{theme}: {issues}')
                    shot(f,f'plate-{n}-{width}-{theme}.png')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No page overflow {width}/{theme}')
                report['matrix'].append([width,theme])
        # Original static enlargements: every plate, mobile and desktop, full view or keyboard pan.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for n in range(1,10):
                f=page.locator(f'#fig-10-{n}');button=f.locator('.figure-enlarge');button.scroll_into_view_if_needed();button.focus()
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
                for name in ['Skin thermoregulation','Mumbai humidity stress','Glucose feedback (Insulin/Glucagon)','Type 1 diabetes & insulin rescue']:
                    tab(f,name)
                    for t in [15,30,38]:
                        slide(f,'Ambient temperature',t)
                        for pct in [20,50,85]:slide(f,'Humidity or meal',pct)
            elif n==5:
                for name in ['Normal hydration','Hot Mumbai dehydration','High-protein meal (deamination)','Untreated hyperglycaemia (16 mmol/L)']:
                    tab(f,name)
                    for gluc in [4,10,16]:
                        slide(f,'Plasma glucose',gluc)
                        for gfr in [85,125,140]:slide(f,'GFR filtration rate',gfr)
            else:
                for name in ['Primary vs Vaccine Memory','Antigen shape specificity','Active vs Passive immunity','Cholera toxin vs ORS rescue']:
                    tab(f,name)
                    for d in [0,7,14,28]:
                        slide(f,'Days post-exposure',d)
                        for lvl in [0,20,80,100]:slide(f,'Memory or ORS support',lvl)
            f.locator('.live-close').click()
        # Resize/theme while open: repaint, preserve state/readouts/captures; keyboard slider actual focus.
        for n,label,val,step in [(2,'Ambient temperature',30,1),(5,'Plasma glucose',8,1),(7,'Days post-exposure',14,1)]:
            f=opened(page,n);slide(f,label,val);before=f.locator('.live-readout').text_content();frames=page.evaluate(f'window.ch10Frames["fig-10-{n}"]')
            page.set_viewport_size({'width':820,'height':900});page.evaluate("document.documentElement.dataset.theme='dark'");page.wait_for_timeout(180)
            check(page.evaluate(f'window.ch10Frames["fig-10-{n}"]')>frames,'Paused Canvas actually repaints after resize/theme')
            check(before==f.locator('.live-readout').text_content(),'Resize/theme retains model state')
            slider=f.get_by_label(label,exact=True);slider.focus();check(slider.evaluate('e=>document.activeElement===e'),'Slider receives keyboard focus');page.keyboard.press('ArrowRight')
            check(float(slider.input_value())==val+step,'Keyboard changes actual labelled control')
            shot(f,f'paused-resize-{n}.png');f.locator('.live-close').click()
        check(not page.evaluate('window.ch10Issues'),'Actual Canvas ink bounds all states: '+str(page.evaluate('window.ch10Issues')))
        # Both visible story card and auto-linked names; open native folds if any.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for selector in ['#ch10 a.st-card[data-story="banting-mahalanabis-lifelines"]','#ch10 a.sl:not(.st-card)[data-story="banting-mahalanabis-lifelines"]']:
                    link=page.locator(selector).first
                    link.evaluate("e=>{for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}")
                    link.scroll_into_view_if_needed();link.focus();check(link.evaluate('e=>document.activeElement===e'),'Story link receives keyboard focus')
                    page.keyboard.press('Enter');page.wait_for_timeout(250);story_check(page,f'{width}/{theme}')
                    shot(page.locator('#storydlg'),f'story-{width}-{theme}-{ "card" if "st-card[" in selector else "term"}.png')
                    page.keyboard.press('Escape');page.wait_for_timeout(200);check(not page.locator('#storydlg').is_visible(),'Escape closes story')
        deep=context.new_page();monitor(deep);ready(deep,'story-banting-mahalanabis-lifelines');story_check(deep,'direct URL');deep.close()
        for ch_idx in range(10):
            check(page.locator(f'#ch{ch_idx} a[data-story="banting-mahalanabis-lifelines"]').count()==0,f'New proper-name terms do not hijack preserved Chapter{ch_idx}')
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
            check(page.locator('#ch10').evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"),'Print dark chapter ink from '+theme)
            check(page.locator('#ch10 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"),'Print SVG dark ink from '+theme)
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
            mp.locator('#s10-4' if n==2 else '#s10-1').scroll_into_view_if_needed();mp.wait_for_timeout(180);check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour stops offscreen')
            f.scroll_into_view_if_needed();f.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(180)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Dynamic reduced motion stops active tour')
            f.locator('.live-close').click();mp.emulate_media(reduced_motion='no-preference')
        motion.close()
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nojs.new_page();np.goto(URL,wait_until='load')
        check(np.locator('#ch10').is_visible() and np.locator('#ch10 svg.fig').count()==9,'No-JavaScript prose and all nine original plates available')
        check('selective reabsorption' in np.locator('#ch10').inner_text(),'No-JavaScript retains causal explanation')
        np.locator('#fig-10-2').scroll_into_view_if_needed();shot(np,'no-js.png');nojs.close()
        page.evaluate('navigator.serviceWorker.ready');page.wait_for_timeout(1800)
        check(page.evaluate('!!navigator.serviceWorker.controller'),'Built service worker controls final book')
        report['browser_caches']=page.evaluate('caches.keys()');check(report['cache'] in report['browser_caches'],'Browser uses exact final built cache')
        context.set_offline(True);offline=context.new_page();monitor(offline);ready(offline)
        check(offline.locator('#ch10').is_visible(),'Chapter10 reloads offline')
        for n in WIDGETS:
            for attempt in [1,2]:
                f=opened(offline,n);check(f.locator('canvas[aria-label]').count()==1,f'Widget{n} opens/reopens offline attempt{attempt}');f.locator('.live-close').click()
        offline.evaluate("App.openStory('banting-mahalanabis-lifelines')");offline.wait_for_timeout(250);story_check(offline,'offline');shot(offline.locator('#storydlg'),'story-offline.png')
        offline.keyboard.press('Escape');context.set_offline(False);context.close();browser.close()
        fallback=p.chromium.launch(args=['--disable-webgl']);fc=fallback.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        fc.add_init_script(CANVAS_AUDIT+'''const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...rest){if(kind.includes('webgl'))window.ch10GL++;return get.call(this,kind,...rest);};''')
        fp=fc.new_page();monitor(fp);ready(fp)
        for n,label,step in [(2,'Ambient temperature',1),(5,'Plasma glucose',1),(7,'Days post-exposure',1)]:
            f=opened(fp,n);check(f.locator('canvas[aria-label]').count()==1,'Usable Canvas without WebGL')
            slider=f.get_by_label(label,exact=True);old=float(slider.input_value());slider.focus();fp.keyboard.press('ArrowRight')
            check(float(slider.input_value())==old+step,'Keyboard changes model without WebGL')
            shot(f,f'no-webgl-{n}.png');f.locator('.live-close').click()
        check(fp.evaluate('window.ch10GL')==0,'No Chapter10 WebGL probes or owned GL resources')
        check(not fp.evaluate('window.ch10Issues'),'Fallback Canvas text bounds valid');fallback.close()

def pdf_receipts():
    subprocess.run(['pdftotext','-layout',str(OUT/'print.pdf'),str(OUT/'print.txt')],check=True)
    subprocess.run(['pdftotext','-raw',str(OUT/'print.pdf'),str(OUT/'print-raw.txt')],check=True)
    pages=(OUT/'print-raw.txt').read_text().split('\f')
    normal=lambda s:re.sub(r'[\s\-\u00ad]+','',unicodedata.normalize('NFKC',s).replace('’',"'"))
    captions=[]
    for line in (ROOT/'src/ch10.md').read_text().splitlines():
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
    report['story_body_printed']=normal('Walk into a hospital ward in 1920 where children with severe Type 1 diabetes lay waiting') in normal((OUT/'print-raw.txt').read_text())
    (OUT/'pdf-pages.json').write_text(json.dumps(mapping,indent=2))

server=None
try:
    check((SITE/'index.html').exists(),'Final built site exists');preservation()
    raw=(ROOT/'src/ch10.md').read_text();check(re.findall(r'^## (10\.\d) ',raw,re.M)==['10.1','10.2','10.3','10.4'],'Exactly four numbered sections')
    check('$' not in raw and '\\text' not in raw,'No raw LaTeX syntax in Chapter10 prose')
    check(raw.count('!')<=1,'At most one exclamation mark in Chapter10 prose')
    check((ROOT/'figs_ch10.py').read_text().count('!')==0,'Zero exclamation marks in figs_ch10.py')
    check((ROOT/'src/stories/banting-mahalanabis-lifelines.md').read_text().count('!')==0,'Zero exclamation marks in Chapter10 story')
    check(raw.count(':::check\n')==4 and raw.count(':::predict\n')==4,'One prediction/check per section')
    check(':::case ' in raw and raw.rstrip().endswith(':::'),'Case and final bridge present')
    result=subprocess.run(['node','tests/ch10_domain.mjs'],cwd=ROOT,capture_output=True,text=True)
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
