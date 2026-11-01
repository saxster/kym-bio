#!/usr/bin/env python3
"""Chapter 9 acceptance on the built book, with separate durable local receipts.

Run tests/verify_ch09.sh for the complete required build/regression/offline suite.
BIO_CH09_QA_OUT selects receipts. Browser font metrics supplement direct image review.
"""
from pathlib import Path
import base64,functools,hashlib,http.server,json,os,re,subprocess,threading,traceback,unicodedata
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
SITE=Path(os.environ.get('BIO_QA_SITE', str(ROOT/'build/site')))
OUT=Path(os.environ.get('BIO_CH09_QA_OUT','/tmp/lt_bio_ch09/qa'));OUT.mkdir(parents=True,exist_ok=True)
WIDTHS=[390,820,1024,1180,1440];THEMES=['light','dark','sepia']
WIDGETS={2:'reflex_action_potential',4:'synapse_transmission',7:'eye_accommodation_tropism'}
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

def ready(page,fragment='ch9'):
    page.goto(URL+'#'+fragment,wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(400)

def slide(f,label,value):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))

def tab(f,label):f.get_by_role('button',name=label,exact=True).click()

def opened(page,n):
    f=page.locator(f'#fig-9-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();page.wait_for_timeout(350);return f

def stamped(f):return f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')")

def clear_stamps(page):page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")

def preservation():
    baseline=json.loads((ROOT/'tests/ch09-preserved.json').read_text())['files']
    for name,expected in baseline.items():
        from revision_preservation import revised_file
        if revised_file(ROOT,name,check,report):continue
        data=(ROOT.parent/name).read_bytes()
        if name=='source/live/enhancements.js':
            marker=b'  reflex_action_potential: {'
            check(data.count(marker)==1,'Three Chapter9 enhancements appended once')
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
CANVAS_AUDIT=r'''window.ch09Issues=[];window.ch09Frames={};window.ch09GL=0;
const original=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...rest){
 const id=this.canvas.closest('figure')?.id;
 if(id?.startsWith('fig-9-')&&this.canvas.dataset.logicalWidth){
 const W=+this.canvas.dataset.logicalWidth,H=+this.canvas.style.aspectRatio.split('/')[1],m=this.measureText(t);
 const bounds={left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
 if(bounds.left<-.1||bounds.right>W+.1||bounds.top<-.1||bounds.bottom>H+.1)window.ch09Issues.push({id,text:String(t),bounds,W,H});
 window.ch09Frames[id]=(window.ch09Frames[id]||0)+1;
 }return original.call(this,t,x,y,...rest);
};'''

def overflow(page,f,label):
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No document overflow '+label)
    issues=f.locator('.live-slider, .live-tabs, .live-controls').evaluate_all('''els=>{const out=[];for(const e of els){const box=e.closest('figure').getBoundingClientRect();for(const q of e.querySelectorAll('label,input,output,button')){if(!q.getClientRects().length)continue;const b=q.getBoundingClientRect();if(b.left<box.left-1||b.right>box.right+1)out.push(q.textContent||q.type);}}return [...new Set(out)];}''')
    check(not issues,f'Controls within figure {label}: {issues}')

def assert_tour(f,n,index):
    expected={
        2:[(0,12,25,False),(1,12,25,True),(2,12,25,False),(3,12,22,False),(3,12,32,True)],
        4:[(0,40,20,False),(0,60,20,True),(1,60,20,True),(2,60,20,False),(3,40,20,False)],
        7:[(0,25,70,True),(0,400,70,False),(1,100,90,False),(2,100,80,True),(3,100,80,False)],
    }[n][index]
    text=f.locator('.live-readout').inner_text()
    if n==2:
        m,diam,temp,cut=expected
        label=['Illustrative myelinated pathway','Unmyelinated axon loop','Voluntary ruler catch','Siddiqi para^ts Na⁺ mutant'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual reflex tab '+label)
        check(int(f.get_by_label('Axon diameter',exact=True).input_value())==diam,'Actual axon diameter')
        check(int(f.get_by_label('Temperature',exact=True).input_value())==temp,'Actual temperature')
        check(f'{label} ({diam} µm, {temp} °C):' in text,'Reflex tour readout agrees')
    elif n==4:
        m,freq,cleft,cut=expected
        label=['Forward (Pre → Post)','Reverse test (Post → Pre)','Receptor blocker (Curare)','Enzyme block (AChE inhibited)'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual synapse tab '+label)
        check(int(f.get_by_label('Stimulus frequency',exact=True).input_value())==freq,'Actual stimulus frequency')
        check(int(f.get_by_label('Synaptic gap width',exact=True).input_value())==cleft,'Actual synaptic gap width')
        check(f'{label} ({freq} Hz, {cleft} nm cleft):' in text,'Synapse tour readout agrees')
    else:
        m,dist,light,cut=expected
        label=['Eye accommodation (Near/Far)','Pupil reflex (Bright/Dim)','Shoot phototropism (Auxin)','Shoot vs Root gravitropism'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual eye/tropism tab '+label)
        check(int(f.get_by_label('Object distance',exact=True).input_value())==dist,'Actual object distance')
        check(int(f.get_by_label('Light intensity',exact=True).input_value())==light,'Actual light intensity')
        if m==0:
            check(f'Accommodation at {dist} cm:' in text,'Eye accommodation tour readout agrees')
        elif m==1:
            check(f'Pupil reflex at {light}% light:' in text,'Pupil reflex tour readout agrees')
        elif m==2:
            check(f'Shoot phototropism ({light}% lateral light):' in text,'Shoot phototropism tour readout agrees')
        else:
            check('Horizontal seedling gravitropism:' in text,'Seedling gravitropism tour readout agrees')
    check(f.locator('.live-cutaway-btn').get_attribute('aria-pressed')==str(cut).lower(),'Actual cutaway explicitly set')
    report['tour_states'].append({'figure':n,'shot':index+1,'state':list(expected)})

def challenge(page,f,n):
    if n==2:
        slide(f,'Axon diameter',16);slide(f,'Temperature',28)
        check(not stamped(f),'Sliders without captured trials cannot earn reflex comparison')
        tab(f,'Capture trial');tab(f,'Capture trial')
        check(not stamped(f),'Identical reflex trial cannot earn comparison')
        tab(f,'Clear trials')
        tab(f,'Myelinated reflex (12 µm, 25 °C)');tab(f,'Capture trial')
        tab(f,'Siddiqi para^ts block (32 °C)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting reflex/conduction pathways captured for comparison.' in text,'Contrasting reflex & para^ts states recorded')
        slide(f,'Axon diameter',6);slide(f,'Temperature',20)
        text=f.locator('.live-readout').inner_text()
        check('#1 Illustrative myelinated pathway (12 µm, 25 °C → 36.8 ms) | #2 Siddiqi para^ts Na⁺ mutant (12 µm, 32 °C → Blocked)' in text,'Saved reflex trials remain immutable after slider changes')
    elif n==4:
        tab(f,'Reverse test (Post → Pre)');slide(f,'Stimulus frequency',60)
        check(not stamped(f),'Switching tabs without capturing both states cannot earn synapse comparison')
        tab(f,'Forward relay (40 Hz, 20 nm)');tab(f,'Capture trial')
        check(not stamped(f),'Single captured state cannot earn synapse comparison')
        tab(f,'Reverse preset (Post → Pre, 40 Hz)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting synapse transmission states captured for comparison.' in text,'Both forward and reverse synapse states captured')
        slide(f,'Stimulus frequency',80);slide(f,'Synaptic gap width',40)
        text=f.locator('.live-readout').inner_text()
        check('#1 Forward (Pre → Post) (5 vesicles, 55% bound → Fires) | #2 Reverse test (Post → Pre) (0 vesicles, 0% bound → Silent)' in text,'Saved synapse captures remain immutable')
    else:
        slide(f,'Object distance',25)
        check(not stamped(f),'Moving object distance slider without capture cannot earn accommodation comparison')
        tab(f,'Near book (25 cm)');tab(f,'Capture trial')
        check(not stamped(f),'Single accommodation capture cannot earn comparison')
        tab(f,'Distant horizon (400 cm)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting accommodation or tropism states captured for comparison.' in text,'Both near and distant accommodation states captured')
        slide(f,'Object distance',150);slide(f,'Light intensity',40)
        text=f.locator('.live-readout').inner_text()
        check('#1 Eye accommodation (Near/Far) (25 cm, 75% light) | #2 Eye accommodation (Near/Far) (400 cm, 75% light)' in text,'Saved eye/tropism captures remain immutable')
    check(stamped(f),'Challenge earned from required captured outcomes')

def story_check(page,label):
    story=page.locator('#storydlg #story-siddiqi-para-channels');check(story.is_visible(),'Story opens '+label)
    text=story.inner_text()
    check('Colaba' in text and 'Obaid Siddiqi' in text,'Story includes TIFR Colaba and Obaid Siddiqi '+label)
    check('Otto Loewi' in text and 'Alan Hodgkin' in text,'Story includes Loewi and Hodgkin-Huxley '+label)
    check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'),'Story no unintended horizontal overflow '+label)

def browser_checks():
    with sync_playwright() as p:
        browser=p.chromium.launch()
        context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        context.add_init_script(CANVAS_AUDIT);page=context.new_page();monitor(page);requests=[]
        page.on('request',lambda r:requests.append(r.url) if '/live/' in r.url else None)
        ready(page);check(not requests,'No lazy chunks imported before interaction')
        check(page.locator('#ch9 svg.fig').count()==9,'Nine original Chapter9 plates in final book')
        check('Access for free at' in page.locator('#ch9').inner_text(),'Generated OpenStax footer present')
        for width in WIDTHS:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for n in range(1,10):
                    f=page.locator(f'#fig-9-{n}');f.scroll_into_view_if_needed();page.wait_for_timeout(60)
                    issues=f.locator('svg.fig').evaluate(SVG_AUDIT)
                    check(not issues,f'SVG font bounds/collisions/arrows {n}/{width}/{theme}: {issues}')
                    shot(f,f'plate-{n}-{width}-{theme}.png')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No page overflow {width}/{theme}')
                report['matrix'].append([width,theme])
        # Original static enlargements: every plate, mobile and desktop, full view or keyboard pan.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for n in range(1,10):
                f=page.locator(f'#fig-9-{n}');button=f.locator('.figure-enlarge');button.scroll_into_view_if_needed();button.focus()
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
                for name in ['Illustrative myelinated pathway','Unmyelinated axon loop','Voluntary ruler catch','Siddiqi para^ts Na⁺ mutant']:
                    tab(f,name)
                    for d in [4,12,20]:
                        slide(f,'Axon diameter',d)
                        for t in [20,25,32]:slide(f,'Temperature',t)
            elif n==4:
                for name in ['Forward (Pre → Post)','Reverse test (Post → Pre)','Receptor blocker (Curare)','Enzyme block (AChE inhibited)']:
                    tab(f,name)
                    for freq in [20,40,80]:
                        slide(f,'Stimulus frequency',freq)
                        for cleft in [15,20,45]:slide(f,'Synaptic gap width',cleft)
            else:
                for name in ['Eye accommodation (Near/Far)','Pupil reflex (Bright/Dim)','Shoot phototropism (Auxin)','Shoot vs Root gravitropism']:
                    tab(f,name)
                    for dist in [25,100,400]:
                        slide(f,'Object distance',dist)
                        for light in [20,70,90]:slide(f,'Light intensity',light)
            f.locator('.live-close').click()
        # Resize/theme while open: repaint, preserve state/readouts/captures; keyboard slider actual focus.
        for n,label,val,step in [(2,'Axon diameter',12,1),(4,'Stimulus frequency',40,10),(7,'Object distance',100,25)]:
            f=opened(page,n);slide(f,label,val);before=f.locator('.live-readout').text_content();frames=page.evaluate(f'window.ch09Frames["fig-9-{n}"]')
            page.set_viewport_size({'width':820,'height':900});page.evaluate("document.documentElement.dataset.theme='dark'");page.wait_for_timeout(180)
            check(page.evaluate(f'window.ch09Frames["fig-9-{n}"]')>frames,'Paused Canvas actually repaints after resize/theme')
            check(before==f.locator('.live-readout').text_content(),'Resize/theme retains model state')
            slider=f.get_by_label(label,exact=True);slider.focus();check(slider.evaluate('e=>document.activeElement===e'),'Slider receives keyboard focus');page.keyboard.press('ArrowRight')
            check(float(slider.input_value())==val+step,'Keyboard changes actual labelled control')
            shot(f,f'paused-resize-{n}.png');f.locator('.live-close').click()
        check(not page.evaluate('window.ch09Issues'),'Actual Canvas ink bounds all states: '+str(page.evaluate('window.ch09Issues')))
        # Both visible story card and auto-linked names; open native folds if any.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for selector in ['#ch9 a.st-card[data-story="siddiqi-para-channels"]','#ch9 a.sl:not(.st-card)[data-story="siddiqi-para-channels"]']:
                    link=page.locator(selector).first
                    link.evaluate("e=>{for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}")
                    link.scroll_into_view_if_needed();link.focus();check(link.evaluate('e=>document.activeElement===e'),'Story link receives keyboard focus')
                    page.keyboard.press('Enter');page.wait_for_timeout(250);story_check(page,f'{width}/{theme}')
                    shot(page.locator('#storydlg'),f'story-{width}-{theme}-{ "card" if "st-card[" in selector else "term"}.png')
                    page.keyboard.press('Escape');page.wait_for_timeout(200);check(not page.locator('#storydlg').is_visible(),'Escape closes story')
        deep=context.new_page();monitor(deep);ready(deep,'story-siddiqi-para-channels');story_check(deep,'direct URL');deep.close()
        for ch_idx in range(9):
            check(page.locator(f'#ch{ch_idx} a[data-story="siddiqi-para-channels"]').count()==0,f'New proper-name terms do not hijack preserved Chapter{ch_idx}')
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
            check(page.locator('#ch9').evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"),'Print dark chapter ink from '+theme)
            check(page.locator('#ch9 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"),'Print SVG dark ink from '+theme)
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
            mp.locator('#s9-4' if n==2 else '#s9-1').scroll_into_view_if_needed();mp.wait_for_timeout(180);check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour stops offscreen')
            f.scroll_into_view_if_needed();f.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(180)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Dynamic reduced motion stops active tour')
            f.locator('.live-close').click();mp.emulate_media(reduced_motion='no-preference')
        motion.close()
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nojs.new_page();np.goto(URL,wait_until='load')
        check(np.locator('#ch9').is_visible() and np.locator('#ch9 svg.fig').count()==9,'No-JavaScript prose and all nine original plates available')
        check('voltage-gated' in np.locator('#ch9').inner_text(),'No-JavaScript retains causal explanation')
        np.locator('#fig-9-2').scroll_into_view_if_needed();shot(np,'no-js.png');nojs.close()
        page.evaluate('navigator.serviceWorker.ready');page.wait_for_timeout(1800)
        check(page.evaluate('!!navigator.serviceWorker.controller'),'Built service worker controls final book')
        report['browser_caches']=page.evaluate('caches.keys()');check(report['cache'] in report['browser_caches'],'Browser uses exact final built cache')
        context.set_offline(True);offline=context.new_page();monitor(offline);ready(offline)
        check(offline.locator('#ch9').is_visible(),'Chapter9 reloads offline')
        for n in WIDGETS:
            for attempt in [1,2]:
                f=opened(offline,n);check(f.locator('canvas[aria-label]').count()==1,f'Widget{n} opens/reopens offline attempt{attempt}');f.locator('.live-close').click()
        offline.evaluate("App.openStory('siddiqi-para-channels')");offline.wait_for_timeout(250);story_check(offline,'offline');shot(offline.locator('#storydlg'),'story-offline.png')
        offline.keyboard.press('Escape');context.set_offline(False);context.close();browser.close()
        fallback=p.chromium.launch(args=['--disable-webgl']);fc=fallback.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        fc.add_init_script(CANVAS_AUDIT+'''const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...rest){if(kind.includes('webgl'))window.ch09GL++;return get.call(this,kind,...rest);};''')
        fp=fc.new_page();monitor(fp);ready(fp)
        for n,label,step in [(2,'Axon diameter',1),(4,'Stimulus frequency',10),(7,'Object distance',25)]:
            f=opened(fp,n);check(f.locator('canvas[aria-label]').count()==1,'Usable Canvas without WebGL')
            slider=f.get_by_label(label,exact=True);old=float(slider.input_value());slider.focus();fp.keyboard.press('ArrowRight')
            check(float(slider.input_value())==old+step,'Keyboard changes model without WebGL')
            shot(f,f'no-webgl-{n}.png');f.locator('.live-close').click()
        check(fp.evaluate('window.ch09GL')==0,'No Chapter9 WebGL probes or owned GL resources')
        check(not fp.evaluate('window.ch09Issues'),'Fallback Canvas text bounds valid');fallback.close()

def pdf_receipts():
    subprocess.run(['pdftotext','-layout',str(OUT/'print.pdf'),str(OUT/'print.txt')],check=True)
    subprocess.run(['pdftotext','-raw',str(OUT/'print.pdf'),str(OUT/'print-raw.txt')],check=True)
    pages=(OUT/'print-raw.txt').read_text().split('\f')
    normal=lambda s:re.sub(r'[\s\-\u00ad]+','',unicodedata.normalize('NFKC',s).replace('’',"'"))
    captions=[]
    for line in (ROOT/'src/ch09.md').read_text().splitlines():
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
    report['story_body_printed']=normal('Single-gene temperature-sensitive mutations can switch individual electrical steps') in normal((OUT/'print-raw.txt').read_text())
    (OUT/'pdf-pages.json').write_text(json.dumps(mapping,indent=2))

server=None
try:
    check((SITE/'index.html').exists(),'Final built site exists');preservation()
    raw=(ROOT/'src/ch09.md').read_text();check(re.findall(r'^## (9\.\d) ',raw,re.M)==['9.1','9.2','9.3','9.4'],'Exactly four numbered sections')
    check('$' not in raw and '\\text' not in raw,'No raw LaTeX syntax in Chapter9 prose')
    check(raw.count('!')<=1,'At most one exclamation mark in Chapter9 prose')
    check((ROOT/'figs_ch09.py').read_text().count('!')==0,'Zero exclamation marks in figs_ch09.py')
    check(raw.count(':::check\n')==4 and raw.count(':::predict\n')==4,'One prediction/check per section')
    check(':::case ' in raw and raw.rstrip().endswith(':::'),'Case and final bridge present')
    result=subprocess.run(['node','tests/ch09_domain.mjs'],cwd=ROOT,capture_output=True,text=True)
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
