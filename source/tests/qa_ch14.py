from revision_fingerprint import revision_digest
#!/usr/bin/env python3
"""Chapter 14 acceptance on the built book, with separate durable local receipts.

Run tests/verify_ch14.sh for the complete required build/regression/offline suite.
BIO_CH14_QA_OUT selects receipts. Browser font metrics supplement direct image review.
"""
from pathlib import Path
import base64,functools,hashlib,http.server,json,os,re,subprocess,threading,traceback,unicodedata
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
SITE=Path(os.environ.get('BIO_CH14_SITE',str(ROOT/'build/site')))
OUT=Path(os.environ.get('BIO_CH14_QA_OUT','/tmp/lt_bio_ch14/qa'));OUT.mkdir(parents=True,exist_ok=True)
WIDTHS=[390,820,1024,1180,1440];THEMES=['light','dark','sepia']
WIDGETS={1:'variation_mutation_lab',4:'natural_selection_simulator',5:'adaptive_features_selective_breeding'}
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

def ready(page,fragment='ch14'):
    page.goto(URL+'#'+fragment,wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(400)

def slide(f,label,value):
    f.get_by_label(label,exact=True).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))

def tab(f,label):f.get_by_role('button',name=label,exact=True).click()

def opened(page,n):
    f=page.locator(f'#fig-14-{n}');f.scroll_into_view_if_needed();f.locator('.live-open').click();page.wait_for_timeout(350);return f

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
    baseline=json.loads((ROOT/'tests/ch14-preserved.json').read_text())['files']
    for name,expected in baseline.items():
        data=(ROOT.parent/name).read_bytes()
        if name=='source/live/enhancements.js':
            marker=b'  variation_mutation_lab: {'
            check(data.count(marker)==1,'Three Chapter14 enhancements appended once')
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
CANVAS_AUDIT=r'''window.ch14Issues=[];window.ch14Frames={};window.ch14GL=0;
const original=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...rest){
 const id=this.canvas.closest('figure')?.id;
 if(id?.startsWith('fig-14-')&&this.canvas.dataset.logicalWidth){
 const W=+this.canvas.dataset.logicalWidth,H=+this.canvas.style.aspectRatio.split('/')[1],m=this.measureText(t);
 const bounds={left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
 if(bounds.left<-.1||bounds.right>W+.1||bounds.top<-.1||bounds.bottom>H+.1)window.ch14Issues.push({id,text:String(t),bounds,W,H});
 window.ch14Frames[id]=(window.ch14Frames[id]||0)+1;
 }return original.call(this,t,x,y,...rest);
};'''

def overflow(page,f,label):
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No document overflow '+label)
    issues=f.locator('.live-slider, .live-tabs, .live-controls').evaluate_all('''els=>{const out=[];for(const e of els){const box=e.closest('figure').getBoundingClientRect();for(const q of e.querySelectorAll('label,input,output,button')){if(!q.getClientRects().length)continue;const b=q.getBoundingClientRect();if(b.left<box.left-1||b.right>box.right+1)out.push(q.textContent||q.type);}}return [...new Set(out)];}''')
    check(not issues,f'Controls within figure {label}: {issues}')

def assert_tour(f,n,index):
    expected={
        1:[(0,1,3,False),(0,3,4,True),(1,2,3,True),(2,4,4,False),(3,1,2,True)],
        4:[(0,3,10,False),(1,3,10,True),(2,4,5,True),(2,4,10,False),(3,4,9,True)],
        5:[(0,4,1,False),(1,3,3,True),(2,5,3,True),(2,5,1,False),(3,4,1,True)],
    }[n][index]
    text=f.locator('.live-readout').inner_text()
    if n==1:
        m,tr,env,cut=expected
        label=['Continuous vs Discontinuous','Replica Plate Proof','Mutagen Dose','Meiosis Shuffle'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual Variation tab '+label)
        check(int(f.get_by_label('Variation trait focus',exact=True).input_value())==tr,'Actual Variation trait focus')
        check(int(f.get_by_label('Mutagen or environment',exact=True).input_value())==env,'Actual Mutagen or environment')
        check('variation' in text.lower(),'Variation tour readout agrees')
    elif n==4:
        m,press,gen,cut=expected
        label=['Drug selection','Drug removed','Peppered Moths','Malaria & HbS'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual Selection tab '+label)
        check(int(f.get_by_label('Selection pressure',exact=True).input_value())==press,'Actual Selection pressure')
        check(int(f.get_by_label('Generation or model step',exact=True).input_value())==gen,'Actual Generation or model step')
        check('favoured' in text.lower(),'Selection tour readout agrees')
    else:
        m,st,fl,cut=expected
        label=['Xerophyte (Arid)','Hydrophyte (Aquatic)','Selective Breeding','DNA Clock'][m]
        check(f.get_by_role('button',name=label,exact=True).get_attribute('aria-pressed')=='true','Actual Adaptation tab '+label)
        check(int(f.get_by_label('Stress or generation',exact=True).input_value())==st,'Actual Stress or generation')
        check(int(f.get_by_label('Feature or lineage',exact=True).input_value())==fl,'Actual Feature or lineage')
        check(any(k in text.lower() for k in ['xerophyte','hydrophyte','selective breeding','molecular clock']),'Adaptation tour readout agrees')
    check(f.locator('.live-cutaway-btn').get_attribute('aria-pressed')==str(cut).lower(),'Actual cutaway explicitly set')
    report['tour_states'].append({'figure':n,'shot':index+1,'state':list(expected)})

def challenge(page,f,n):
    if n==1:
        slide(f,'Variation trait focus',2);slide(f,'Mutagen or environment',2)
        check(not stamped(f),'Sliders without captured trials cannot earn Variation comparison')
        tab(f,'Capture trial');tab(f,'Capture trial')
        check(not stamped(f),'Identical Variation trial cannot earn comparison')
        tab(f,'Clear trials')
        tab(f,'Height (Continuous)');tab(f,'Capture trial')
        tab(f,'ABO Blood (Discontinuous)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting variation or mutation trials captured for comparison:' in text,'Contrasting Variation trials recorded')
        slide(f,'Variation trait focus',4);slide(f,'Mutagen or environment',4)
        text=f.locator('.live-readout').inner_text()
        check('#1 Height (continuous) (continuous, mean 152.8 cm, Chemical 5×) | #2 ABO blood (discontinuous) (discontinuous, no model nutrition shift, UV / Rad 20×)' in text,'Saved Variation trials remain immutable after slider changes')
    elif n==4:
        slide(f,'Selection pressure',2);slide(f,'Generation or model step',4)
        check(not stamped(f),'Sliders without capturing both states cannot earn Selection comparison')
        tab(f,'Continuous exposure');tab(f,'Capture trial')
        check(not stamped(f),'Single captured state cannot earn Selection comparison')
        tab(f,'Remove after step 3');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting natural selection trials captured for comparison:' in text,'Both illustrative culture states captured')
        slide(f,'Selection pressure',1);slide(f,'Generation or model step',1)
        text=f.locator('.live-readout').inner_text()
        check('#1 Drug selection [Step 10:' in text and '#2 Drug removed [Step 10:' in text and 'clinical days' in text,'Saved model captures remain immutable and distinguish nonclinical steps')
    else:
        slide(f,'Stress or generation',2)
        check(not stamped(f),'Moving stress slider without capture cannot earn Adaptation comparison')
        tab(f,'Marram Grass (Arid)');tab(f,'Capture trial')
        check(not stamped(f),'Single Adaptation capture cannot earn comparison')
        tab(f,'Water Lily (Aquatic)');tab(f,'Capture trial')
        text=f.locator('.live-readout').inner_text()
        check('Contrasting adaptation or breeding trials captured for comparison:' in text,'Both Xerophyte and Hydrophyte states captured')
        slide(f,'Stress or generation',5);slide(f,'Feature or lineage',4)
        text=f.locator('.live-readout').inner_text()
        check('#1 Xerophyte (Arid) [Marram grass (xerophyte) @ Aridity 4: 36.4 mg/(dm²·h) (86% saved)] | #2 Hydrophyte (Aquatic) [Water lily (hydrophyte) @ Submergence 3: 58% aerenchyma, 94% root O₂]' in text,'Saved Adaptation captures remain immutable')
    check(stamped(f),'Challenge earned from required captured outcomes')

def story_check(page,label):
    story=page.locator('#storydlg #story-darwin-wallace-luria-sahni-selection');check(story.is_visible(),'Story opens '+label)
    text=story.inner_text()
    check('Charles Robert Darwin' in text and 'John Gould' in text and 'Wallace in Ternate' in text,'Story includes Darwin, Gould and Wallace in Ternate '+label)
    check('Joshua Lederberg' in text and 'Esther Lederberg' in text and 'Bernard Kettlewell' in text and 'Birbal Sahni' in text and 'Carl Woese' in text,'Story includes Lederbergs, Kettlewell, Sahni and Woese '+label)
    check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'),'Story no unintended horizontal overflow '+label)

def browser_checks():
    with sync_playwright() as p:
        browser=p.chromium.launch()
        context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        context.add_init_script(CANVAS_AUDIT);page=context.new_page();monitor(page);requests=[]
        page.on('request',lambda r:requests.append(r.url) if '/live/' in r.url else None)
        ready(page);check(not requests,'No lazy chunks imported before interaction')
        check(page.locator('#ch14 svg.fig').count()==9,'Nine original Chapter14 plates in final book')
        check('Access for free at' in page.locator('#ch14').inner_text(),'Generated OpenStax footer present')
        check(page.locator('#ch14 a[data-story="p-ammal"]').count()>=1,'Existing E. K. Janaki Ammal story linked in Chapter14')
        check(page.locator('#ch14 a[data-story="p-margulis"]').count()>=1,'Existing Lynn Margulis story linked in Chapter14')
        check(page.locator('#ch14 a[data-story="p-pasteur"]').count()>=1,'Existing Louis Pasteur story linked in Chapter14')
        check(page.locator('#ch14 a[data-story="p-ramachandran"]').count()>=1,'Existing G. N. Ramachandran story linked in Chapter14')
        check(page.locator('#ch14 a[data-story="franklin-khorana-codebreakers"]').count()>=1,'Existing Franklin-Khorana story linked in Chapter14')
        check(page.locator('#ch14 a[data-story="meselson-flemming-gurdon-divisions"]').count()>=1,'Existing Meselson-Flemming-Gurdon story linked in Chapter14')
        check(page.locator('#ch14 a[data-story="mendel-morgan-sanghvi-inheritance"]').count()>=1,'Existing Mendel-Morgan-Sanghvi story linked in Chapter14')
        for width in WIDTHS:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for n in range(1,10):
                    f=page.locator(f'#fig-14-{n}');f.scroll_into_view_if_needed();page.wait_for_timeout(60)
                    issues=f.locator('svg.fig').evaluate(SVG_AUDIT)
                    check(not issues,f'SVG font bounds/collisions/arrows {n}/{width}/{theme}: {issues}')
                    shot(f,f'plate-{n}-{width}-{theme}.png')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'No page overflow {width}/{theme}')
                report['matrix'].append([width,theme])
        # Original static enlargements: every plate, mobile and desktop, full view or keyboard pan.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for n in range(1,10):
                f=page.locator(f'#fig-14-{n}');button=f.locator('.figure-enlarge');button.scroll_into_view_if_needed();button.focus()
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
                for name in ['Continuous vs Discontinuous','Replica Plate Proof','Mutagen Dose','Meiosis Shuffle']:
                    tab(f,name)
                    for tr in [1,2,3,4]:
                        slide(f,'Variation trait focus',tr)
                        for env in [1,2,3,4]:slide(f,'Mutagen or environment',env)
            elif n==4:
                for name in ['Drug selection','Drug removed','Peppered Moths','Malaria & HbS']:
                    tab(f,name)
                    for press in [1,2,3,4]:
                        slide(f,'Selection pressure',press)
                        for gen in range(0,11):slide(f,'Generation or model step',gen)
            else:
                for name in ['Xerophyte (Arid)','Hydrophyte (Aquatic)','Selective Breeding','DNA Clock']:
                    tab(f,name)
                    for st in [1,2,3,4,5]:
                        slide(f,'Stress or generation',st)
                        for fl in [1,2,3,4]:slide(f,'Feature or lineage',fl)
            f.locator('.live-close').click()
        # Resize/theme while open: repaint, preserve state/readouts/captures; keyboard slider actual focus.
        for n,label,val,step in [(1,'Variation trait focus',2,1),(4,'Selection pressure',2,1),(5,'Stress or generation',2,1)]:
            f=opened(page,n);slide(f,label,val);before=f.locator('.live-readout').text_content();frames=page.evaluate(f'window.ch14Frames["fig-14-{n}"]')
            page.set_viewport_size({'width':820,'height':900});page.evaluate("document.documentElement.dataset.theme='dark'");page.wait_for_timeout(180)
            check(page.evaluate(f'window.ch14Frames["fig-14-{n}"]')>frames,'Paused Canvas actually repaints after resize/theme')
            check(before==f.locator('.live-readout').text_content(),'Resize/theme retains model state')
            slider=f.get_by_label(label,exact=True);slider.focus();check(slider.evaluate('e=>document.activeElement===e'),'Slider receives keyboard focus');page.keyboard.press('ArrowRight')
            check(float(slider.input_value())==val+step,'Keyboard changes actual labelled control')
            shot(f,f'paused-resize-{n}.png');f.locator('.live-close').click()
        check(not page.evaluate('window.ch14Issues'),'Actual Canvas ink bounds all states: '+str(page.evaluate('window.ch14Issues')))
        # Both visible story card and auto-linked names; open native folds if any.
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                for selector in ['#ch14 a.st-card[data-story="darwin-wallace-luria-sahni-selection"]','#ch14 a.sl:not(.st-card)[data-story="darwin-wallace-luria-sahni-selection"]']:
                    link=page.locator(selector).first
                    link.evaluate("e=>{for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}")
                    link.scroll_into_view_if_needed();link.focus();check(link.evaluate('e=>document.activeElement===e'),'Story link receives keyboard focus')
                    page.keyboard.press('Enter');page.wait_for_timeout(250);story_check(page,f'{width}/{theme}')
                    shot(page.locator('#storydlg'),f'story-{width}-{theme}-{ "card" if "st-card[" in selector else "term"}.png')
                    page.keyboard.press('Escape');page.wait_for_timeout(200);check(not page.locator('#storydlg').is_visible(),'Escape closes story')
        deep=context.new_page();monitor(deep);ready(deep,'story-darwin-wallace-luria-sahni-selection');story_check(deep,'direct URL');deep.close()
        for ch_idx in range(14):
            check(page.locator(f'#ch{ch_idx} a[data-story="darwin-wallace-luria-sahni-selection"]').count()==0,f'New proper-name terms do not hijack preserved Chapter{ch_idx}')
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
            check(page.locator('#ch14').evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"),'Print dark chapter ink from '+theme)
            check(page.locator('#ch14 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"),'Print SVG dark ink from '+theme)
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
            mp.locator('#s14-4' if n==1 else '#s14-1').scroll_into_view_if_needed();mp.wait_for_timeout(180);check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Tour stops offscreen')
            f.scroll_into_view_if_needed();f.locator('.live-watch-btn').click();mp.emulate_media(reduced_motion='reduce');mp.wait_for_timeout(180)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed')=='false','Dynamic reduced motion stops active tour')
            f.locator('.live-close').click();mp.emulate_media(reduced_motion='no-preference')
        motion.close()
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});np=nojs.new_page();np.goto(URL,wait_until='load')
        check(np.locator('#ch14').is_visible() and np.locator('#ch14 svg.fig').count()==9,'No-JavaScript prose and all nine original plates available')
        check('natural selection' in np.locator('#ch14').inner_text().lower(),'No-JavaScript retains causal explanation')
        np.locator('#fig-14-1').scroll_into_view_if_needed();shot(np,'no-js.png');nojs.close()
        page.evaluate('navigator.serviceWorker.ready');page.wait_for_timeout(1800)
        check(page.evaluate('!!navigator.serviceWorker.controller'),'Built service worker controls final book')
        report['browser_caches']=page.evaluate('caches.keys()');check(report['cache'] in report['browser_caches'],'Browser uses exact final built cache')
        context.set_offline(True);offline=context.new_page();monitor(offline);ready(offline)
        check(offline.locator('#ch14').is_visible(),'Chapter14 reloads offline')
        for n in WIDGETS:
            for attempt in [1,2]:
                f=opened(offline,n);check(f.locator('canvas[aria-label]').count()==1,f'Widget{n} opens/reopens offline attempt{attempt}');f.locator('.live-close').click()
        offline.evaluate("App.openStory('darwin-wallace-luria-sahni-selection')");offline.wait_for_timeout(250);story_check(offline,'offline');shot(offline.locator('#storydlg'),'story-offline.png')
        offline.keyboard.press('Escape');context.set_offline(False);context.close();browser.close()
        fallback=p.chromium.launch(args=['--disable-webgl']);fc=fallback.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        fc.add_init_script(CANVAS_AUDIT+'''const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...rest){if(kind.includes('webgl'))window.ch14GL++;return get.call(this,kind,...rest);};''')
        fp=fc.new_page();monitor(fp);ready(fp)
        for n,label,step in [(1,'Variation trait focus',1),(4,'Selection pressure',1),(5,'Stress or generation',1)]:
            f=opened(fp,n);check(f.locator('canvas[aria-label]').count()==1,'Usable Canvas without WebGL')
            slider=f.get_by_label(label,exact=True);old=float(slider.input_value());slider.focus();fp.keyboard.press('ArrowRight')
            check(float(slider.input_value())==old+step,'Keyboard changes model without WebGL')
            shot(f,f'no-webgl-{n}.png');f.locator('.live-close').click()
        check(fp.evaluate('window.ch14GL')==0,'No Chapter14 WebGL probes or owned GL resources')
        check(not fp.evaluate('window.ch14Issues'),'Fallback Canvas text bounds valid');fallback.close()

def pdf_receipts():
    subprocess.run(['pdftotext','-layout',str(OUT/'print.pdf'),str(OUT/'print.txt')],check=True)
    subprocess.run(['pdftotext','-raw',str(OUT/'print.pdf'),str(OUT/'print-raw.txt')],check=True)
    pages=(OUT/'print-raw.txt').read_text().split('\f')
    normal=lambda s:re.sub(r'[\s\-\u00ad\u2013\u2014\u2212\u2192]+','',unicodedata.normalize('NFKC',s).replace('’',"'"))
    captions=[]
    for line in (ROOT/'src/ch14.md').read_text().splitlines():
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
    report['story_body_printed']=normal('In September 1835, when the twenty-six-year-old naturalist') in normal((OUT/'print-raw.txt').read_text())
    (OUT/'pdf-pages.json').write_text(json.dumps(mapping,indent=2))
    hashes={}
    for rel in ['source/grounding/ch14.md','source/figs_ch14.py','source/src/ch14.md','source/src/stories/darwin-wallace-luria-sahni-selection.md','source/src/stories/p-ammal.md','source/src/stories/p-margulis.md','source/src/stories/p-pasteur.md','source/src/stories/p-ramachandran.md','source/src/stories/franklin-khorana-codebreakers.md','source/src/stories/meselson-flemming-gurdon-divisions.md','source/src/stories/mendel-morgan-sanghvi-inheritance.md','source/provenance/ch14.yml','source/live/selection_model.js','source/live/w_variation_mutation_lab.js','source/live/w_natural_selection_simulator.js','source/live/w_adaptive_features_selective_breeding.js','source/live/enhancements.js','source/tests/ch14_domain.mjs','source/tests/qa_ch14.py','source/tests/verify_ch14.sh','source/tests/README-ch14.md','source/tests/ch14-preserved.json','source/build/site/index.html','source/build/site/sw.js']:
        p=ROOT.parent/rel
        if p.exists():
            b=p.read_bytes()
            hashes[rel]={'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
    (OUT/'artifact-hashes.json').write_text(json.dumps(hashes,indent=2))
    report['artifact_hashes']=hashes

server=None
try:
    check((SITE/'index.html').exists(),'Final built site exists');preservation()
    raw=(ROOT/'src/ch14.md').read_text();check(re.findall(r'^## (14\.\d) ',raw,re.M)==['14.1','14.2','14.3','14.4'],'Exactly four numbered sections')
    check('$' not in raw and '\\text' not in raw,'No raw LaTeX syntax in Chapter14 prose')
    check(raw.count('!')==0,'Zero exclamation marks in Chapter14 prose')
    check((ROOT/'figs_ch14.py').read_text().count('!')==0,'Zero exclamation marks in figs_ch14.py')
    check((ROOT/'src/stories/darwin-wallace-luria-sahni-selection.md').read_text().count('!')==0,'Zero exclamation marks in Chapter14 story')
    domain=subprocess.run(['node',str(ROOT/'tests/ch14_domain.mjs')],capture_output=True,text=True,check=True)
    report['domain']=domain.stdout.strip()
    sw=(SITE/'sw.js').read_text();m=re.search(r"CACHE = '([^']+)'",sw);check(bool(m),'Service worker cache version present');report['cache']=m.group(1)
    for chunk in ['w_variation_mutation_lab','w_natural_selection_simulator','w_adaptive_features_selective_breeding']:
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
