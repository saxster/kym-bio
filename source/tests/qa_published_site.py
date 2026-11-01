"""Local browser checks against the published GitHub Pages URL; no hosted CI."""
from pathlib import Path
import argparse,json,re,time,traceback,ast
from playwright.sync_api import sync_playwright
ap=argparse.ArgumentParser();ap.add_argument('task',choices=['offline-webkit','figures','models','atlas','offline','webkit','fallback','cover','map','atlas-mobile','explorers','explorers-offline','explorers-webkit']);ap.add_argument('--url',default='https://saxster.github.io/kym-bio/');ap.add_argument('--chapters', default='0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15');ap.add_argument('--out',default='/tmp/kym-bio-live-qa');args=ap.parse_args();CHAPTERS=[int(n) for n in args.chapters.split(',')]
OUT=Path(args.out)/args.task;OUT.mkdir(parents=True,exist_ok=True)
report={'url':args.url,'task':args.task,'checks':[],'issues':[],'screenshots':[],'errors':[]};start=time.time()
def check(ok,what,**detail):
 report['checks'].append({'check':what,'pass':bool(ok),**detail})
 if not ok:report['issues'].append({'check':what,**detail});print('FAIL',what,detail,flush=True)
def snap(f,name):
 path=OUT/(name+'.png');f.screenshot(path=str(path),timeout=30000);report['screenshots'].append(str(path))
def goto_ch(n):
 page.evaluate('n=>{location.hash="#ch"+n}',n);page.locator('#ch'+str(n)).wait_for(state='visible')
def stable(f):
 page.wait_for_function('''id=>{const f=document.getElementById(id),v=JSON.stringify([...f.querySelectorAll('.atlas-labels>*')].map(e=>{const r=e.getBoundingClientRect();return[Math.round(r.x),Math.round(r.y)]})),o=f.__qaLayout;f.__qaLayout={v,n:o&&o.v===v?o.n+1:0};return f.__qaLayout.n>=3}''',arg=f.get_attribute('id'),polling=100,timeout=20000)
def bounds(f,label):
 check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'document fits '+label)
 problems=f.locator('.live-slider,.live-tabs,.live-controls,.atlas-parts').evaluate_all('''els=>{let out=[];for(const e of els){const parent=e.closest('figure').getBoundingClientRect();for(const c of e.querySelectorAll('button,input,output,label')){if(!c.getClientRects().length)continue;const r=c.getBoundingClientRect();if(r.left<parent.left-2||r.right>parent.right+2)out.push(c.textContent||c.type)}}return [...new Set(out)]}''')
 check(not problems,'controls fit '+label,details=problems)
def atlas(chapters,widths=(1440,390),offline=False,require3d=True):
 for n in chapters:
  goto_ch(n);f=page.locator(f'#fig-{n}-1');f.scroll_into_view_if_needed();f.locator('.lab-open').first.click();f.locator('.atlas-pages button').first.wait_for(timeout=45000)
  tabs=f.locator('.atlas-pages button');check(tabs.count()==4,f'Atlas {n} four stations')
  for station in range(4):
   tabs.nth(station).tap() if mobile else tabs.nth(station).click()
   for slider in f.locator('.live-slider input[type=range]').all():slider.evaluate('e=>{e.value=e.max;e.dispatchEvent(new Event("input",{bubbles:true}))}')
   for width in widths:
    if width==390 and not offline:page.wait_for_timeout(1800)
    before=page.evaluate('window.qaGLDraws');page.set_viewport_size({'width':width,'height':390 if mobile and width>=800 else 844 if mobile else 900});f.locator('.atlas-stage').scroll_into_view_if_needed();stable(f)
    badge=f.locator('.atlas-badge').inner_text();report.setdefault('atlas_modes',[]).append({'chapter':n,'station':station,'width':width,'badge':badge});is3d=badge.startswith('3D Atlas')
    if require3d:check(is3d,f'Atlas {n}.{station} real 3D at {width}',badge=badge)
    text=f.locator('.live-readout').inner_text();check(len(text)>20 and not re.search(r'\bNaN\b',text),f'Atlas {n}.{station} finite readout at {width}')
    if is3d:
     f.locator('.atlas-stage canvas').first.dispatch_event('wheel',{'deltaY':1})
     f.locator('.atlas-stage canvas').first.evaluate('e=>qaAtlasCanvases.add(e)');
     canvas=f.locator('.atlas-stage canvas').first
     state=canvas.evaluate('e=>{const g=e.getContext("webgl2")||e.getContext("webgl");return {webgl:!!g,lost:g?.isContextLost(),width:e.width,height:e.height}}')
     check(state['webgl'] and not state['lost'] and state['width']>0,f'Atlas {n}.{station} context {width}',state=state)
     check(page.evaluate('window.qaGLDraws')>before or width==widths[0],f'Atlas {n}.{station} redraw after resize {width}')
    label_issues=f.locator('.atlas-stage').evaluate("""e=>{const r=e.getBoundingClientRect(),bs=[...e.querySelectorAll('.lbl')].filter(n=>+n.style.opacity>0).map(n=>({text:n.textContent,r:n.getBoundingClientRect()})),out=[];for(const b of bs)if(b.r.left<r.left+3||b.r.right>r.right-3||b.r.top<r.top+3||b.r.bottom>r.bottom-22)out.push('clip '+b.text);for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++)if(Math.min(bs[i].r.right,bs[j].r.right)-Math.max(bs[i].r.left,bs[j].r.left)>1&&Math.min(bs[i].r.bottom,bs[j].r.bottom)-Math.max(bs[i].r.top,bs[j].r.top)>1)out.push('overlap '+bs[i].text+' / '+bs[j].text);return out}""")
    check(not label_issues,f'Atlas {n}.{station} visible labels fit and separate {width}',details=label_issues)
    bounds(f,f'Atlas {n}.{station}/{width}');snap(f.locator('.atlas-stage'),f'ch{n}-station{station}-{width}')
   for selector in ['.atlas-cuts button','.atlas-parts button']:
    buttons=f.locator(selector)
    if buttons.count():buttons.last.click();buttons.first.click()
   print('ATLAS',n,station,'offline' if offline else 'online',flush=True)
  if n==chapters[0] and require3d:
   for theme in ['dark','light','sepia']:
    before=page.evaluate('qaGLDraws');page.evaluate('t=>document.documentElement.dataset.theme=t',theme);page.wait_for_function('b=>qaGLDraws>b',arg=before);check(f.locator('.atlas-badge').inner_text().startswith('3D Atlas'),'Atlas theme '+theme+' rebuilds in 3D');f.locator('.atlas-stage canvas').first.evaluate('e=>qaAtlasCanvases.add(e)')
  f.locator('.live-close').click()
 if require3d:
  count=page.evaluate('qaAtlasCanvases.size');report['atlas_canvas_count']=count;check(count==1,'Atlas reuses one canvas/context across chapters',count=count)
def models(widths=(1440,390),offline=False):
 ids=page.locator('figure[data-live]').evaluate_all('es=>es.map(e=>e.id)');report['model_count']=len(ids)
 for fid in ids:
  chapter=re.match(r'fig-(\d+)-',fid)
  if chapter:goto_ch(int(chapter.group(1)))
  f=page.locator('#'+fid)
  f.evaluate("e=>{const a=e.closest('article.story');if(a&&window.App&&!e.closest('dialog'))App.openStory(a.id.replace('story-',''));}")
  f.scroll_into_view_if_needed();f.locator('.live-open').click();f.locator('.live-stage').wait_for(timeout=45000)
  tabs=f.locator('.live-tabs button');tab_count=tabs.count()
  for i in range(tab_count):
   t=tabs.nth(i)
   if not t.is_visible():continue
   t.tap() if mobile else t.click()
   if i==0 or offline:
    for value in ['min','max']:
     for slider in f.locator('input[type=range]').all():slider.evaluate('(e,k)=>{e.value=e[k];e.dispatchEvent(new Event("input",{bubbles:true}))}',value)
   text=' '.join(f.locator('.live-readout').all_text_contents())
   check(not re.search(r'\bNaN\b',text),fid+' tab '+str(i)+' finite readout')
  for width in widths:
   page.set_viewport_size({'width':width,'height':390 if mobile and width>=800 else 844 if mobile else 900});f.scroll_into_view_if_needed();bounds(f,fid+'/'+str(width));snap(f,fid+'-'+str(width))
  if mobile:
   sliders=f.locator('input[type=range]')
   if sliders.count() and sliders.first.is_enabled():
    slider=sliders.first;slider.evaluate('e=>e.scrollIntoView({block:"center",behavior:"instant"})');old=slider.input_value();box=slider.bounding_box()
    if slider.get_attribute('min')!=slider.get_attribute('max'):
     page.touchscreen.tap(box['x']+box['width']*.4,box['y']+box['height']/2)
     check(slider.input_value()!=old,fid+' touch slider changes value')
  play=f.locator('.live-play')
  if play.count():
   if play.get_attribute('aria-pressed')=='true':play.click()
   before=page.evaluate('window.qaDraws');play.click();page.wait_for_timeout(200);play.click()
   check(page.evaluate('window.qaDraws')>before,fid+' play renders frames')
  cut=f.locator('.live-cutaway-btn')
  if cut.count():
   old=cut.get_attribute('aria-pressed');cut.click();check(cut.get_attribute('aria-pressed')!=old,fid+' cutaway toggles');cut.click()
  f.locator('.live-close').click();print('MODEL',fid,'tabs',tab_count,'offline' if offline else 'online',flush=True)
 explorers()
def explorers():
 for mount in page.locator('.explore-mount[data-chunk]').all():
  name=mount.get_attribute('data-mount');sid=mount.evaluate("e=>e.closest('section').id");page.evaluate('s=>{location.hash="#"+s}',sid);mount.scroll_into_view_if_needed();mount.locator('.explore-open').click();mount.locator('.explore-stage').wait_for(state='visible',timeout=45000)
  check(mount.locator('.explore-stage').evaluate('e=>e.children.length>0'),'explorer '+name+' mounted')
  if name in ['cell','code']:
   canvas=mount.locator('.live-3d canvas');canvas.wait_for();check(canvas.evaluate('e=>!!(e.getContext("webgl2")||e.getContext("webgl"))'),name+' actual WebGL')
   if name=='cell':
    kinds=mount.get_by_role('tablist',name='Cell type')
    for k in range(kinds.get_by_role('tab').count()):
     kinds.get_by_role('tab').nth(k).click();check(kinds.get_by_role('tab').nth(k).get_attribute('aria-selected')=='true','cell type selected')
     organs=mount.get_by_role('tablist',name='Inspect organelle')
     for j in range(organs.get_by_role('tab').count()):
      organs.get_by_role('tab').nth(j).click();check(organs.get_by_role('tab').nth(j).get_attribute('aria-selected')=='true' and 'Mechanism:' in mount.inner_text(),'organelle selection updates evidence')
    cut=mount.get_by_role('button',name='Cut-away:',exact=False);old=cut.get_attribute('aria-pressed');cut.click();check(cut.get_attribute('aria-pressed')!=old,'cell cutaway toggles');cut.click()
    before=page.evaluate('qaGLDraws');mount.get_by_role('button',name='Turn left',exact=True).click();check(page.evaluate('qaGLDraws')>before,'cell manual turn redraws')
    spin=mount.get_by_role('button',name='Rotate 3D',exact=True)
   else:
    tabs=mount.get_by_role('tablist').get_by_role('tab')
    for j in range(tabs.count()):tabs.nth(j).click();check(tabs.nth(j).get_attribute('aria-selected')=='true','code codon selected')
    mutation=mount.get_by_role('button',name='Codon 6:',exact=False);mutation.click();check("mRNA Codon: 5'-GUG-3'" in mount.inner_text(),'mutant codon translates to GUG');mutation.click();check("mRNA Codon: 5'-GAG-3'" in mount.inner_text(),'normal codon restored')
    spin=mount.get_by_role('button',name='Spin 3D helix',exact=True)
   spin.click();before=page.evaluate('qaGLDraws');page.wait_for_timeout(300);check(page.evaluate('qaGLDraws')>before,name+' animation advances');mount.get_by_role('button',name='Pause rotation' if name=='cell' else 'Pause helix spin',exact=True).click()
  elif name=='scale':
   slider=mount.locator('input[type=range]')
   for end in ['min','max']:
    slider.evaluate('(e,k)=>{e.value=e[k];e.dispatchEvent(new Event("input",{bubbles:true}))}',end);check('NaN' not in mount.inner_text() and len(mount.locator('.scale-width').inner_text())>0,'scale '+end+' finite readout')
   choose=mount.get_by_role('combobox',name='Jump to a landmark')
   for value in choose.locator('option').evaluate_all('es=>es.map(e=>e.value).filter(Boolean)'):
    choose.select_option(value);check('Selected reference:' in mount.locator('.scale-caption').inner_text(),'scale landmark '+value)
   mount.get_by_role('button',name='Back to you',exact=True).click();check(choose.input_value()=='','scale home resets selection')
   mount.get_by_role('button',name='Take a guided journey',exact=True).click();guide=mount.get_by_label('Guided journey',exact=True);check(guide.is_visible(),'scale guide opens');guide.get_by_role('button',name='Begin at one metre',exact=True).click();next=guide.get_by_role('button',name='Next',exact=True)
   for step in range(12):
    if next.is_disabled():break
    next.click()
   check(step>0,'scale guide advances');mount.get_by_role('button',name='Close guide',exact=True).click()
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),name+' explorer fits viewport');snap(mount,'explorer-'+name)
  mount.get_by_role('button',name='Close explorer',exact=True).click();check(not mount.locator('.explore-stage').is_visible(),name+' closes')
  print('EXPLORER',name,flush=True)
def cover():
 for width in [360,390,1440]:
  page.set_viewport_size({'width':width,'height':390 if mobile and width>=800 else 844 if mobile else 900});page.evaluate('location.hash="#top"')
  for n in range(16):
   tile=page.locator(f'.cover-live g.el[data-ch="{n}"]');tile.scroll_into_view_if_needed();tile.click();card=page.locator('.cv-card');card.wait_for(state='visible');card.scroll_into_view_if_needed()
   text=card.inner_text();check(not any(x in text for x in ['32 ATP','ATP springs','jumping chemical','~90%','exact same DNA']),f'cover {n}/{width} revised text')
   check(card.evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1}'),f'cover {n}/{width} fits horizontally')
   link=card.get_by_role('link',name=f'Read Chapter {n}',exact=True);check(link.get_attribute('href')==f'#ch{n}',f'cover {n} chapter target')
   if width==390 and n in [0,6,7,10,11,12,15]:snap(card,f'cover-card-{n}-{width}')
   link.click();check(page.locator(f'#ch{n}').is_visible(),f'cover {n}/{width} chapter opens');page.evaluate('location.hash="#top"')

def map_check():
 page.evaluate('location.hash="#explore-map"');m=page.locator('[data-mount="map"]');m.scroll_into_view_if_needed();m.locator('.amap-svg').wait_for(timeout=45000)
 for button in m.locator('.amap-views button').all():button.click();check(button.get_attribute('aria-pressed')=='true','map region '+button.inner_text())
 slider=m.locator('input[aria-label="Year"]')
 for value in ['min','max']:slider.evaluate('(e,k)=>{e.value=e[k];e.dispatchEvent(new Event("input",{bubbles:true}))}',value)
 m.locator('.amap-views button[data-view=world]').click();check(m.locator('.amap-pin').count()>0,'map contains scene pins');pin=m.locator('.amap-pin[aria-label]').first;pin.focus();pin.press('Enter');check(m.locator('.amap-card').is_visible(),'map scene card opens');m.locator('.amap-x').click();m.locator('.amap-svg').evaluate('e=>e.scrollIntoView({block:"center",behavior:"instant"})');visible=m.locator('.amap-pin').evaluate_all('''es=>{for(let i=0;i<es.length;i++){const r=es[i].getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,p=document.elementFromPoint(x,y);if(p&&es[i].contains(p))return {index:i,x,y}}return null}''')
 check(visible is not None,'map has pointer-accessible marker')
 if visible is not None:
  page.touchscreen.tap(visible['x'],visible['y']) if mobile else page.mouse.click(visible['x'],visible['y']);check(m.locator('.amap-card').is_visible(),'map pointer opens scene card');m.locator('.amap-x').click()
 check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'map fits viewport');snap(m,'adventure-map')

SVG=r'''s=>{const v=s.viewBox.baseVal,root=s.getScreenCTM();if(!root)return ['no SVG transform'];const inv=root.inverse();function box(e){const b=e.getBBox(),m=inv.multiply(e.getScreenCTM()),ps=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));return{x:Math.min(...ps.map(p=>p.x)),y:Math.min(...ps.map(p=>p.y)),r:Math.max(...ps.map(p=>p.x)),b:Math.max(...ps.map(p=>p.y))}}let out=[];const texts=[...s.querySelectorAll('text')].filter(e=>!e.closest('defs')&&e.textContent.trim()).map(e=>({t:e.textContent,b:box(e)}));for(const q of texts)if(q.b.x<-.5||q.b.y<-.5||q.b.r>v.width+.5||q.b.b>v.height+.5)out.push('clip '+q.t);for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){let a=texts[i],b=texts[j];if(Math.min(a.b.r,b.b.r)-Math.max(a.b.x,b.b.x)>1&&Math.min(a.b.b,b.b.b)-Math.max(a.b.y,b.b.y)>1)out.push('overlap '+a.t+' / '+b.t)}return out}'''
try:
 with sync_playwright() as p:
  engine=p.webkit if args.task in ['webkit','explorers-webkit','offline-webkit'] else p.chromium
  browser=engine.launch(**({} if args.task in ['webkit','explorers-webkit','offline-webkit'] else {'args':['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']}))
  mobile=args.task in ['offline','offline-webkit','webkit','atlas-mobile','explorers-offline','explorers-webkit'];context=browser.new_context(viewport={'width':390 if mobile else 1440,'height':900},is_mobile=mobile,has_touch=mobile,service_workers='block' if args.task in ['webkit','explorers-webkit'] else 'allow',reduced_motion='reduce',device_scale_factor=2 if mobile else 1)
  page=context.new_page();page.set_default_timeout(30000)
  context.add_init_script('''window.qaDraws=0;window.qaGLDraws=0;window.qaAtlasCanvases=new Set();for(const p of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype])for(const k of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const f=p[k];if(f)p[k]=function(...a){window.qaDraws++;window.qaGLDraws++;return f.apply(this,a)}}for(const k of ['fillRect','fillText','drawImage','stroke']){const f=CanvasRenderingContext2D.prototype[k];CanvasRenderingContext2D.prototype[k]=function(...a){window.qaDraws++;return f.apply(this,a)}}''')
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
  response=page.goto(args.url if args.task=='offline' else args.url+'#ch0',wait_until='domcontentloaded' if args.task in ['offline','offline-webkit'] else 'load',timeout=180000);check(response.status==200,'live HTTP 200');page.evaluate('document.fonts.ready');page.locator('.lab-open').first.wait_for(state='attached',timeout=45000)
  if args.task=='figures':
   for width in [360,390,768,1440]:
    page.set_viewport_size({'width':width,'height':390 if mobile and width>=800 else 844 if mobile else 900})
    for theme in ['sepia','light','dark']:
     page.evaluate('t=>document.documentElement.dataset.theme=t',theme)
     for n in CHAPTERS:
      goto_ch(n);page.evaluate('document.fonts.ready');check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'chapter {n}/{width}/{theme} no overflow')
      for i,s in enumerate(page.locator(f'#ch{n} svg.fig').all()):
       s.scroll_into_view_if_needed();page.evaluate('document.fonts.ready');issues=s.evaluate(SVG);check(not issues,f'SVG {n}.{i+1}/{width}/{theme}',details=issues)
       if theme=='sepia' and width in [390,1440]:snap(s,f'ch{n}-fig{i+1}-{width}')
   page.evaluate('location.hash="#top"');cover=page.locator('#top svg.fig');cover.scroll_into_view_if_needed();check(not cover.evaluate(SVG),'cover labels fit');snap(cover,'cover');page.emulate_media(media='print');check(page.locator('svg.fig').count()==118,'print retains 118 plate elements');page.pdf(path=str(OUT/'book-print.pdf'),print_background=True)
  elif args.task=='models':models();map_check()
  elif args.task=='atlas':atlas(CHAPTERS)
  elif args.task=='atlas-mobile':atlas(CHAPTERS,(390,))
  elif args.task in ['offline','offline-webkit']:
   page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=180000)
   cache=page.evaluate('async()=>{const ks=await caches.keys();return await Promise.all(ks.map(async k=>({key:k,count:(await(await caches.open(k)).keys()).length})))}');report['caches']=cache;check(any(c['count']>=90 for c in cache),'full precache installed',caches=cache)
   context.set_offline(True);page.close();probe=context.new_page();probe.set_default_timeout(30000);report['expected_network_probe_errors']=[];probe.on('pageerror',lambda e:report['expected_network_probe_errors'].append(str(e)))
   probe.goto(args.url+'#ch0',wait_until='load',timeout=60000)
   online=probe.evaluate('async url=>{try{await fetch(url,{cache:"no-store"});return true}catch{return false}}',args.url+'README.md?offline-probe='+str(time.time_ns()))
   report['uncached_network_probe_rejected']=not online;check(not online,'uncached network request really fails offline')
   if online:raise RuntimeError('Browser offline emulation still permits uncached network requests')
   probe.wait_for_timeout(100);probe.close()
   page=context.new_page();page.set_default_timeout(30000);page.on('pageerror',lambda e:report['errors'].append(str(e)))
   page.goto(args.url+'#ch0',wait_until='load',timeout=60000);page.evaluate('document.fonts.ready');check(page.title()=='The Living World','fresh offline tab loads book')
   models((390,),True);map_check();atlas(CHAPTERS,(390,),True)
  elif args.task=='webkit':
   report['browser']=browser.version;models((390,844));map_check();atlas(CHAPTERS,(390,),require3d=True)
  elif args.task.startswith('explorers'):
   if args.task=='explorers-offline':
    page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=180000);context.set_offline(True);page.reload(wait_until='load');check(True,'explorers offline reload')
   explorers()
   if args.task=='explorers-webkit':
    for width in [390,844]:
     page.set_viewport_size({'width':width,'height':844 if width==390 else 390});map_check()
   else:map_check()
  elif args.task=='map':
   for width in [360,390,1440]:
    page.set_viewport_size({'width':width,'height':900});map_check()
  elif args.task=='cover':cover()
  elif args.task=='fallback':
   context.close();context=browser.new_context(viewport={'width':390,'height':844},java_script_enabled=False);page=context.new_page();page.goto(args.url+'#ch10',wait_until='load',timeout=180000);check(page.locator('#ch10').is_visible(),'no-JS chapter text visible');check(page.locator('svg.fig').count()==118,'no-JS all still figures present');snap(page,'no-javascript')
   context.close();context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce');context.add_init_script('const old=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(k,...a){return k.includes("webgl")?null:old.call(this,k,...a)}');page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.goto(args.url+'#ch0',wait_until='load',timeout=180000)
   for n in CHAPTERS:
    goto_ch(n);f=page.locator(f'#fig-{n}-1');f.scroll_into_view_if_needed();f.locator('.lab-open').first.tap();f.locator('.atlas-pages button').first.wait_for(timeout=30000)
    for station in range(4):
     f.locator('.atlas-pages button').nth(station).tap();check(f.locator('.atlas-badge').inner_text().startswith('2D Schematic View'),f'no-WebGL {n}.{station} explicit fallback');check('NaN' not in f.locator('.live-readout').inner_text(),f'no-WebGL {n}.{station} readout')
    if n in [0,6,10]:snap(f,f'no-webgl-{n}')
    f.locator('.live-close').tap();check(f.locator('svg.fig').is_visible(),f'no-WebGL {n} restores still figure')
   for name,ch in [('cell',2),('code',11)]:
    mount=page.locator('[data-mount="'+name+'"]');sid=mount.evaluate('e=>e.closest("section").id');page.evaluate('s=>location.hash="#"+s',sid);mount.scroll_into_view_if_needed();mount.locator('.explore-open').click();mount.get_by_text('3D is unavailable',exact=False).wait_for();check('3D is unavailable' in mount.inner_text(),'no-WebGL '+name+' honest explanation');check(mount.get_by_role('link',name='Open the',exact=False).get_attribute('href')=='#ch'+str(ch),'no-WebGL '+name+' still-drawing link')
    tabs=mount.get_by_role('tablist').first.get_by_role('tab');tabs.last.tap();check(tabs.last.get_attribute('aria-selected')=='true','no-WebGL '+name+' evidence selection works');mount.get_by_role('button',name='Close explorer',exact=True).click()

  check(not report['errors'],'no browser errors',details=report['errors']);browser.close()
except Exception as e:
 report['exception']=str(e);traceback.print_exc();report['issues'].append({'exception':str(e)})
finally:
 report['seconds']=round(time.time()-start,1);report['pass']=not report['issues'];(OUT/'report.json').write_text(json.dumps(report,indent=2));print('PASS' if report['pass'] else 'FAIL',args.task,'checks',len(report['checks']),'issues',len(report['issues']),flush=True)
raise SystemExit(0 if report['pass'] else 1)
