"""Repeated mobile WebKit explorer use, with independent GPU buffer accounting."""
import argparse,json,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--url',default='https://saxster.github.io/kym-bio/');p.add_argument('--out',default='/tmp/bio-explorer-lifecycle');a=p.parse_args();out=Path(a.out);out.mkdir(parents=True,exist_ok=True);report={'checks':[],'errors':[],'gpu_after_close':[]}
def check(ok,name):
 report['checks'].append({'check':name,'pass':bool(ok)});assert ok,name
try:
 with sync_playwright() as pw:
  browser=pw.webkit.launch();context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',service_workers='block');context.add_init_script('''window.qaExplorerCanvases=new Set();window.qaGPU={buffers:0,textures:0};for(const p of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype])for(const [create,del,key] of [['createBuffer','deleteBuffer','buffers'],['createTexture','deleteTexture','textures']]){const c=p[create],d=p[del];p[create]=function(...a){const v=c.apply(this,a);if(v)qaGPU[key]++;return v};p[del]=function(v){if(v)qaGPU[key]--;return d.call(this,v)}}''');page=context.new_page();page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None);page.on('pageerror',lambda e:report['errors'].append(str(e)));page.goto(a.url+'#explore-cell',wait_until='load',timeout=180000)
  for cycle in range(6):
   for name in ['cell','code']:
    mount=page.locator('[data-mount="'+name+'"]');sid=mount.evaluate('e=>e.closest("section").id');page.evaluate('s=>location.hash="#"+s',sid);mount.scroll_into_view_if_needed();mount.locator('.explore-open').click();canvas=mount.locator('.live-3d canvas');canvas.wait_for();canvas.evaluate('e=>qaExplorerCanvases.add(e)');check(canvas.evaluate('e=>!(e.getContext("webgl2")||e.getContext("webgl")).isContextLost()'),f'{cycle}/{name} live WebGL')
    if name=='cell':
     tabs=mount.get_by_role('tablist',name='Cell type').get_by_role('tab')
     for i in range(tabs.count()):tabs.nth(i).tap()
    else:
     tabs=mount.get_by_role('tablist').get_by_role('tab')
     for i in range(tabs.count()):tabs.nth(i).tap()
     mount.get_by_role('button',name='Codon 6:',exact=False).tap()
    mount.get_by_role('button',name='Close explorer',exact=True).click();report['gpu_after_close'].append(page.evaluate('({...qaGPU})'));print('CYCLE',cycle,name,flush=True)
  check(page.evaluate('qaExplorerCanvases.size')==1,'12 openings share one renderer canvas');first=report['gpu_after_close'][0]
  check(all(r['buffers']<=first['buffers']+4 and r['textures']<=first['textures']+4 for r in report['gpu_after_close']),'GPU buffers/textures remain bounded after repeated rebuilds and closes');check(not report['errors'],'no console or page errors');browser.close()
 report['pass']=True
except Exception as e:report['pass']=False;report['exception']=str(e);traceback.print_exc()
(out/'report.json').write_text(json.dumps(report,indent=2)+'\n');print('PASS' if report['pass'] else 'FAIL','explorer lifecycle',out,flush=True);raise SystemExit(0 if report['pass'] else 1)
