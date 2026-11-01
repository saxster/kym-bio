from revision_fingerprint import revision_digest
#!/usr/bin/env python3
"""Chapter 15 acceptance on the built book, with separate durable local receipts.

Run tests/verify_ch15.sh for the complete required build/regression/offline suite.
BIO_CH15_QA_OUT selects receipts. Browser font metrics supplement direct image review.
"""
from pathlib import Path
import base64,functools,hashlib,http.server,json,os,re,subprocess,threading,traceback,unicodedata
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
SITE=Path(os.environ.get('BIO_CH15_SITE',str(ROOT/'build/site')))
OUT=Path(os.environ.get('BIO_CH15_QA_OUT','/tmp/lt_bio_ch15/qa'));OUT.mkdir(parents=True,exist_ok=True)
WIDTHS=[390,820,1024,1180,1440];THEMES=['light','dark','sepia']
WIDGETS={1:'ecosystem_trophic_lab',4:'nutrient_cycles_eutrophication',8:'biotech_fermenter_plasmid_lab'}
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

def ready(page,fragment='ch15'):
    page.goto(URL+'#'+fragment,wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(400)

def slide(f,label,value):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))

def tab(f,label):f.get_by_role('button',name=label,exact=True).click()

def opened(page,n):
    f=page.locator(f'#fig-15-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();page.wait_for_timeout(350);return f

def stamped(f):return f.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')")

def clear_stamps(page):page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")

def preservation():
    revision_baseline=os.environ.get('BIO_REVISION_BASELINE')
    if revision_baseline:
        baseline=json.loads(Path(revision_baseline).read_text())
        for name,expected in baseline.items():
            data=(ROOT.parent/name).read_bytes()
            check(revision_digest(ROOT.parent/name)==expected,'Revision source unchanged during QA '+name)
        report['preserved_files']=len(baseline)
        return
    raw_json=json.loads((ROOT/'tests/ch15-preserved.json').read_text())
    baseline=raw_json['files']
    shared=raw_json.get('shared_append_only',{})
    for name,expected in baseline.items():
        target=ROOT/name if (ROOT/name).exists() else ROOT.parent/name
        data=target.read_bytes()
        if name in ('live/enhancements.js','source/live/enhancements.js'):
            marker=b'  ecosystem_trophic_lab: {'
            check(data.count(marker)==1,'Three Chapter15 enhancements appended once')
            data=data.split(marker)[0]+b'};\n'
            orig_b64=expected.get('original_base64') or shared.get(name,{}).get('original_base64')
            check(data==base64.b64decode(orig_b64),'Exact original enhancement bytes reconstructed; no whole-file exemption')
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
CANVAS_AUDIT=r'''window.ch15Issues=[];window.ch15Frames={};window.ch15GL=0;
const original=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...rest){
 const id=this.canvas.closest('figure')?.id;
 if(id?.startsWith('fig-15-')&&this.canvas.dataset.logicalWidth){
 const W=+this.canvas.dataset.logicalWidth,H=+this.canvas.style.aspectRatio.split('/')[1],m=this.measureText(t);
 const bounds={left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
 if(bounds.left<-.1||bounds.right>W+.1||bounds.top<-.1||bounds.bottom>H+.1)window.ch15Issues.push({id,text:String(t),bounds,W,H});
 window.ch15Frames[id]=(window.ch15Frames[id]||0)+1;
 }return original.call(this,t,x,y,...rest);
};'''

def overflow(page,f,label):
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No document overflow '+label)
    issues=f.locator('.live-slider, .live-tabs, .live-controls').evaluate_all('''els=>{const out=[];for(const e of els){const box=e.closest('figure').getBoundingClientRect();for(const q of e.querySelectorAll('label,input,output,button')){if(!q.getClientRects().length)continue;const b=q.getBoundingClientRect();if(b.left<box.left-1||b.right>box.right+1)out.push(q.textContent||q.type);}}return [...new Set(out)];}''')
    check(not issues,f'Controls within figure {label}: {issues}')

def assert_tour(f,n,index):
    expected={
        1:[(0,10,50,False),(1,10,20,True),(2,10,90,True),(2,10,10,False),(3,12,60,True)],
        4:[(0,80,90,False),(0,30,10,True),(1,90,20,True),(2,80,40,False),(3,80,80,True)],
        8:[(0,90,80,False),(0,15,80,True),(1,45,90,True),(1,80,40,False),(2,40,80,True)],
    }[n][index]
    text=f.locator('.live-readout').inner_text()
    if n==1:
        m,eff,sec,cut=expected
        label=['SGNP Web','Banyan Pyramid','Diet Efficiency','Sigmoid Curve'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual Ecosystem tab '+label)
        check(int(f.get_by_label('Trophic transfer',exact=True).input_value())==eff,'Actual Trophic transfer')
        check(int(f.get_by_label('Plant share or scale',exact=True).input_value())==sec,'Actual Plant share or scale')
        check(any(k in text.lower() for k in ['trophic','banyan','diet','sigmoid']),'Ecosystem tour readout agrees')
    elif n==4:
        m,p,sec,cut=expected
        label=['Nitrogen & Legumes','Eutrophication','Carbon & Keeling','Deforestation'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual Nutrient tab '+label)
        check(int(f.get_by_label('Legume or runoff load',exact=True).input_value())==p,'Actual Legume or runoff load')
        check(int(f.get_by_label('Aeration or sink cover',exact=True).input_value())==sec,'Actual Aeration or sink cover')
        check(any(k in text.lower() for k in ['nitrogen','eutrophication','co₂','deforestation']),'Nutrient tour readout agrees')
    else:
        m,p,sec,cut=expected
        label=['Recombinant Insulin','Industrial Fermenter','Yeast & Enzymes','GM Crops & CRISPR'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual Biotech tab '+label)
        check(int(f.get_by_label('Ligase or temp or pest',exact=True).input_value())==p,'Actual Ligase or temp or pest')
        check(int(f.get_by_label('Culture or O₂ or refuge',exact=True).input_value())==sec,'Actual Culture or O₂ or refuge')
        check(any(k in text.lower() for k in ['insulin','fermenter','washing','cotton']),'Biotech tour readout agrees')
    check(f.locator('.live-cutaway-btn').get_attribute('aria-pressed')==str(cut).lower(),'Actual cutaway explicitly set')
    report['tour_states'].append({'figure':n,'shot':index+1,'state':list(expected)})

def challenge(page,f,n):
    if n==1:
        slide(f,'Trophic transfer',12);slide(f,'Plant share or scale',60)
        check(not stamped(f),'Sliders without captured trials cannot earn Ecosystem comparison')
        tab(f,'Capture trial');tab(f,'Capture trial')
        check(not stamped(f),'Identical Ecosystem trial cannot earn comparison')
        tab(f,'Clear trials')
        tab(f,'SGNP Web (10%)');tab(f,'Capture trial')
        tab(f,'Direct Crop Diet (90%)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting trophic or population trials captured for comparison:' in text,'Contrasting Ecosystem trials recorded')
    elif n==4:
        slide(f,'Legume or runoff load',60);slide(f,'Aeration or sink cover',50)
        check(not stamped(f),'Sliders without capturing two states cannot earn Nutrient comparison')
        tab(f,'Aerated Legumes');tab(f,'Capture trial')
        check(not stamped(f),'Single captured state cannot earn Nutrient comparison')
        tab(f,'Waterlogged Paddy');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting nutrient or eutrophication trials captured for comparison:' in text,'Both Aerated and Waterlogged states captured')
    else:
        slide(f,'Ligase or temp or pest',60)
        check(not stamped(f),'Moving slider without capture cannot earn Biotech comparison')
        tab(f,'Fermenter 37 °C Opt.');tab(f,'Capture trial')
        check(not stamped(f),'Single Biotech capture cannot earn comparison')
        tab(f,'Overheated 55 °C');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting biotechnology trials captured for comparison:' in text,'Both Optimum and Overheated fermenter states captured')
    check(stamped(f),'Challenge earned from required captured outcomes')

def story_check(page,label):
    story=page.locator('#storydlg #story-lindeman-chain-boyer-doudna-biosphere-biotech');check(story.is_visible(),'Story opens '+label)
    text=story.inner_text()
    check('Raymond Lindeman' in text and 'Martinus Beijerinck' in text and 'Sergei Winogradsky' in text,'Story includes Lindeman, Beijerinck and Winogradsky '+label)
    check('Ernst Chain' in text and 'Herbert Boyer' in text and 'Jennifer Doudna' in text and 'Madhav Gadgil' in text,'Story includes Chain, Boyer, Doudna and Gadgil '+label)
    check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'),'Story no unintended horizontal overflow '+label)

def browser_checks():
    with sync_playwright() as p:
        browser=p.chromium.launch()
        context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        context.add_init_script(CANVAS_AUDIT);page=context.new_page();monitor(page);requests=[]
        page.on('request',lambda r:requests.append(r.url) if '/live/' in r.url else None)
        ready(page);check(not requests,'No lazy chunks imported before interaction')
        check(page.locator('#ch15 svg.fig').count()==9,'Nine original Chapter15 plates in final book')
        check('Access for free at' in page.locator('#ch15').inner_text(),'Generated OpenStax footer present')
        for st_id in ['p-ali','p-ammal','p-helmont','p-ingenhousz','p-pasteur','p-subbarow','banting-mahalanabis-lifelines','franklin-khorana-codebreakers','meselson-flemming-gurdon-divisions','mendel-morgan-sanghvi-inheritance','darwin-wallace-luria-sahni-selection']:
            check(page.locator(f'#ch15 a[data-story="{st_id}"]').count()>=1,f'Existing {st_id} story linked in Chapter15')
        for width in WIDTHS:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for n in range(1,10):
                    f=page.locator(f'#fig-15-{n}');f.scroll_into_view_if_needed();page.wait_for_timeout(60)
                    issues=f.locator('svg.fig').evaluate(SVG_AUDIT)
                    check(not issues,f'SVG font bounds/collisions/arrows {n}/{width}/{theme}: {issues}')
                    shot(f,f'plate-{n}-{width}-{theme}.png')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No page overflow {width}/{theme}')
                report['matrix'].append([width,theme])
        # Original static enlargements: every plate, mobile and desktop, full view or keyboard pan.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for n in range(1,10):
                f=page.locator(f'#fig-15-{n}');button=f.locator('.figure-enlarge');button.scroll_into_view_if_needed();button.focus()
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
            if n==1:
                for name in ['SGNP Web','Banyan Pyramid','Diet Efficiency','Sigmoid Curve']:
                    tab(f,name)
                    for eff in [5,10,15,20]:
                        slide(f,'Trophic transfer',eff)
                        for sec in [0,30,60,100]:slide(f,'Plant share or scale',sec)
            elif n==4:
                for name in ['Nitrogen & Legumes','Eutrophication','Carbon & Keeling','Deforestation']:
                    tab(f,name)
                    for pval in [0,30,70,100]:
                        slide(f,'Legume or runoff load',pval)
                        for sec in [0,30,70,100]:slide(f,'Aeration or sink cover',sec)
            else:
                for name in ['Recombinant Insulin','Industrial Fermenter','Yeast & Enzymes','GM Crops & CRISPR']:
                    tab(f,name)
                    for pval in [0,30,60,90]:
                        slide(f,'Ligase or temp or pest',pval)
                        for sec in [0,40,80,100]:slide(f,'Culture or O₂ or refuge',sec)
            f.locator('.live-close').click()
        # Resize/theme while open: repaint, preserve state/readouts/captures; keyboard slider actual focus.
        for n,label,val,step in [(1,'Trophic transfer',10,1),(4,'Legume or runoff load',50,10),(8,'Ligase or temp or pest',50,5)]:
            f=opened(page,n);slide(f,label,val);before=f.locator('.live-readout').text_content();frames=page.evaluate(f'window.ch15Frames["fig-15-{n}"]')
            page.set_viewport_size({'width':820,'height':900});page.evaluate("document.documentElement.dataset.theme='dark'");page.wait_for_timeout(180)
            check(page.evaluate(f'window.ch15Frames["fig-15-{n}"]')>frames,'Paused Canvas actually repaints after resize/theme')
            check(before==f.locator('.live-readout').text_content(),'Resize/theme retains model state')
            slider=f.get_by_label(label,exact=True);slider.focus();check(slider.evaluate('e=>document.activeElement===e'),'Slider receives keyboard focus');page.keyboard.press('ArrowRight')
            check(float(slider.input_value())==val+step,'Keyboard changes actual labelled control')
            shot(f,f'paused-resize-{n}.png');f.locator('.live-close').click()
        check(not page.evaluate('window.ch15Issues'),'Actual Canvas ink bounds all states: '+str(page.evaluate('window.ch15Issues')))
        # Both visible story card and auto-linked names; open native folds if any.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for selector in ['#ch15 a.st-card[data-story="lindeman-chain-boyer-doudna-biosphere-biotech"]','#ch15 a.sl:not(.st-card)[data-story="lindeman-chain-boyer-doudna-biosphere-biotech"]']:
                    link=page.locator(selector).first
                    link.evaluate("e=>{for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}")
                    link.scroll_into_view_if_needed();link.focus();check(link.evaluate('e=>document.activeElement===e'),'Story link receives keyboard focus')
                    page.keyboard.press('Enter');page.wait_for_timeout(250);story_check(page,f'{width}/{theme}')
                    shot(page.locator('#storydlg'),f'story-{width}-{theme}-{ "card" if "st-card[" in selector else "term"}.png')
                    page.keyboard.press('Escape');page.wait_for_timeout(200);check(not page.locator('#storydlg').is_visible(),'Escape closes story')
        deep=context.new_page();monitor(deep);ready(deep,'story-lindeman-chain-boyer-doudna-biosphere-biotech');story_check(deep,'direct URL');deep.close()
        for ch_idx in range(15):
            check(page.locator(f'#ch{ch_idx} a[data-story="lindeman-chain-boyer-doudna-biosphere-biotech"]').count()==0,f'New proper-name terms do not hijack preserved Chapter{ch_idx}')
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
            check(page.locator('#ch15').evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"),'Print dark chapter ink from '+theme)
            check(page.locator('#ch15 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"),'Print SVG dark ink from '+theme)
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
            mp.locator('#s15-4' if n==1 else '#s15-1').scroll_into_view_if_needed();mp.wait_for_timeout(180);check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour stops offscreen')
            f.scroll_into_view_if_needed();f.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(180)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Dynamic reduced motion stops active tour')
            f.locator('.live-close').click();mp.emulate_media(reduced_motion='no-preference')
        motion.close()
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nojs.new_page();np.goto(URL,wait_until='load')
        check(np.locator('#ch15').is_visible() and np.locator('#ch15 svg.fig').count()==9,'No-JavaScript prose and all nine original plates available')
        check('eutrophication' in np.locator('#ch15').inner_text().lower(),'No-JavaScript retains causal explanation')
        np.locator('#fig-15-1').scroll_into_view_if_needed();shot(np,'no-js.png');nojs.close()
        page.evaluate('navigator.serviceWorker.ready');page.wait_for_timeout(1800)
        check(page.evaluate('!!navigator.serviceWorker.controller'),'Built service worker controls final book')
        report['browser_caches']=page.evaluate('caches.keys()');check(report['cache'] in report['browser_caches'],'Browser uses exact final built cache')
        context.set_offline(True);offline=context.new_page();monitor(offline);ready(offline)
        check(offline.locator('#ch15').is_visible(),'Chapter15 reloads offline')
        for n in WIDGETS:
            for attempt in [1,2]:
                f=opened(offline,n);check(f.locator('canvas[aria-label]').count()==1,f'Widget{n} opens/reopens offline attempt{attempt}');f.locator('.live-close').click()
        offline.evaluate("App.openStory('lindeman-chain-boyer-doudna-biosphere-biotech')");offline.wait_for_timeout(250);story_check(offline,'offline');shot(offline.locator('#storydlg'),'story-offline.png')
        offline.keyboard.press('Escape');context.set_offline(False);context.close();browser.close()
        fallback=p.chromium.launch(args=['--disable-webgl']);fc=fallback.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        fc.add_init_script(CANVAS_AUDIT+'''const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...rest){if(kind.includes('webgl'))window.ch15GL++;return get.call(this,kind,...rest);};''')
        fp=fc.new_page();monitor(fp);ready(fp)
        for n,label,step in [(1,'Trophic transfer',1),(4,'Legume or runoff load',10),(8,'Ligase or temp or pest',5)]:
            f=opened(fp,n);check(f.locator('canvas[aria-label]').count()==1,'Usable Canvas without WebGL')
            slider=f.get_by_label(label,exact=True);old=float(slider.input_value());slider.focus();fp.keyboard.press('ArrowRight')
            check(float(slider.input_value())==old+step,'Keyboard changes model without WebGL')
            shot(f,f'no-webgl-{n}.png');f.locator('.live-close').click()
        check(fp.evaluate('window.ch15GL')==0,'No Chapter15 WebGL probes or owned GL resources')
        check(not fp.evaluate('window.ch15Issues'),'Fallback Canvas text bounds valid');fallback.close()

def pdf_receipts():
    subprocess.run(['pdftotext','-layout',str(OUT/'print.pdf'),str(OUT/'print.txt')],check=True)
    subprocess.run(['pdftotext','-raw',str(OUT/'print.pdf'),str(OUT/'print-raw.txt')],check=True)
    pages=(OUT/'print-raw.txt').read_text().split('\f')
    normal=lambda s:re.sub(r'[\s\+\-\u00ad\u2013\u2014\u2212\u2192]+','',unicodedata.normalize('NFKC',s).replace('’',"'"))
    captions=[]
    for line in (ROOT/'src/ch15.md').read_text().splitlines():
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
    report['story_body_printed']=normal('During the freezing Minnesota winters between 1936 and 1940') in normal((OUT/'print-raw.txt').read_text())
    (OUT/'pdf-pages.json').write_text(json.dumps(mapping,indent=2))
    hashes={}
    for rel in ['source/grounding/ch15.md','source/figs_ch15.py','source/src/ch15.md','source/src/stories/lindeman-chain-boyer-doudna-biosphere-biotech.md','source/src/stories/p-ali.md','source/src/stories/p-ammal.md','source/src/stories/p-helmont.md','source/src/stories/p-ingenhousz.md','source/src/stories/p-pasteur.md','source/src/stories/p-subbarow.md','source/src/stories/banting-mahalanabis-lifelines.md','source/src/stories/franklin-khorana-codebreakers.md','source/src/stories/meselson-flemming-gurdon-divisions.md','source/src/stories/mendel-morgan-sanghvi-inheritance.md','source/src/stories/darwin-wallace-luria-sahni-selection.md','source/provenance/ch15.yml','source/live/biosphere_biotech_model.js','source/live/w_ecosystem_trophic_lab.js','source/live/w_nutrient_cycles_eutrophication.js','source/live/w_biotech_fermenter_plasmid_lab.js','source/live/enhancements.js','source/tests/ch15_domain.mjs','source/tests/qa_ch15.py','source/tests/verify_ch15.sh','source/tests/README-ch15.md','source/tests/ch15-preserved.json','source/build/site/index.html','source/build/site/sw.js']:
        p=ROOT.parent/rel
        if p.exists():
            b=p.read_bytes()
            hashes[rel]={'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
    (OUT/'artifact-hashes.json').write_text(json.dumps(hashes,indent=2))
    report['artifact_hashes']=hashes

server=None
try:
    check((SITE/'index.html').exists(),'Final built site exists');preservation()
    raw=(ROOT/'src/ch15.md').read_text();check(re.findall(r'^## (15\.\d) ',raw,re.M)==['15.1','15.2','15.3','15.4'],'Exactly four numbered sections')
    check('$' not in raw and '\\text' not in raw,'No raw LaTeX syntax in Chapter15 prose')
    check(raw.count('!')==0,'Zero exclamation marks in Chapter15 prose')
    check((ROOT/'figs_ch15.py').read_text().count('!')==0,'Zero exclamation marks in figs_ch15.py')
    check((ROOT/'src/stories/lindeman-chain-boyer-doudna-biosphere-biotech.md').read_text().count('!')==0,'Zero exclamation marks in Chapter15 story')
    domain=subprocess.run(['node',str(ROOT/'tests/ch15_domain.mjs')],capture_output=True,text=True,check=True)
    report['domain']=domain.stdout.strip()
    sw=(SITE/'sw.js').read_text();m=re.search(r"CACHE = '([^']+)'",sw);check(bool(m),'Service worker cache version present');report['cache']=m.group(1)
    for chunk in ['w_ecosystem_trophic_lab','w_nutrient_cycles_eutrophication','w_biotech_fermenter_plasmid_lab']:
        check(chunk in sw,f'{chunk} precached in sw.js')
    handler=functools.partial(Quiet,directory=str(SITE))
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler)
    URL=f'http://127.0.0.1:{server.server_port}/index.html'
    threading.Thread(target=server.serve_forever,daemon=True).start()
    browser_checks();pdf_receipts()
    check(not report['errors'],'No console/page errors: '+str(report['errors']))
    report['status']='pass';(OUT/'report.json').write_text(json.dumps(report,indent=2))
    print(f"PASS: {len(report['checks'])} checks, {len(report['screenshots'])} screenshots, PDF pages {report['pdf_pages']}")
except Exception as exc:
    report['status']='fail';report['failure']=str(exc);report['traceback']=traceback.format_exc()
    (OUT/'report.json').write_text(json.dumps(report,indent=2));raise
finally:
    if server:server.shutdown()
