"""Local two-edition lifecycle test using a saved previous release and new build."""
import argparse,hashlib,json,re,threading,time,traceback
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--previous-site',required=True);p.add_argument('--site',required=True);p.add_argument('--out',required=True);a=p.parse_args()
old=Path(a.previous_site).resolve();new=Path(a.site).resolve();out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True);current=[old];report={'checks':[],'http_cache_control':'public, max-age=600'}
def check(ok,name):
 report['checks'].append({'check':name,'pass':bool(ok)});assert ok,name
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(current[0]),**kwargs)
 def end_headers(self):self.send_header('Cache-Control','public, max-age=600');super().end_headers()
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();url=f'http://127.0.0.1:{server.server_port}/'
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce');page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(url+'#ch4',wait_until='load');page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=60000)
  old_cache=re.search("const CACHE = '([^']+)'",(old/'sw.js').read_text()).group(1);new_cache=re.search("const CACHE = '([^']+)'",(new/'sw.js').read_text()).group(1);check(old_cache!=new_cache,'fixture has two distinct editions');report.update(old_cache=old_cache,new_cache=new_cache)
  current[0]=new;page.evaluate('async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update()}');
  deadline=time.monotonic()+30
  while time.monotonic()<deadline:
   if page.evaluate('async()=>{const r=await navigator.serviceWorker.getRegistration();return r.waiting?.state==="installed"}'):break
   page.wait_for_timeout(100)
  else:raise AssertionError('new worker did not wait with a fully installed cache')
  report['cache_entries_before_close']=page.evaluate('async()=>Promise.all((await caches.keys()).map(async k=>{const c=await caches.open(k);const r=await c.match("./index.html");return {key:k,count:(await c.keys()).length,sha:r?[...new Uint8Array(await crypto.subtle.digest("SHA-256",await r.arrayBuffer()))].map(x=>x.toString(16).padStart(2,"0")).join(""):null}}))');(out/'before-close.json').write_text(json.dumps(report,indent=2));page.wait_for_timeout(250);check(page.evaluate('async()=>!!(await navigator.serviceWorker.getRegistration()).waiting'),'new worker stays waiting while reader tab remains open');keys=page.evaluate('caches.keys()');check(old_cache in keys and new_cache in keys,'new edition waits while old tab keeps both complete caches')
  context.set_offline(True);f=page.locator('#fig-4-1');f.scroll_into_view_if_needed();f.locator('.lab-open').first.tap();f.locator('.atlas-pages button').first.wait_for();check(f.locator('.atlas-badge').inner_text().startswith('3D Atlas'),'old tab can still lazy-load its original Atlas offline');page.screenshot(path=str(out/'old-tab-after-update.png'));f.locator('.live-close').click()
  page.close();deadline=time.monotonic()+40;activated=False
  while time.monotonic()<deadline:
   for worker in context.service_workers:
    try:state=worker.evaluate('async()=>({cache:CACHE,waiting:self.registration.waiting?.state,active:self.registration.active?.state,keys:await caches.keys()})')
    except Exception as error:
     if any(term in str(error) for term in ['restarted','closed','destroyed']):continue
     raise
    if state['cache']==new_cache and state.get('waiting') is None and state.get('active')=='activated' and state['keys']==[new_cache]:activated=True;break
   if activated:break
   time.sleep(.1)
  check(activated,'new edition activates after old tab closes')
  fresh=context.new_page();fresh.on('pageerror',lambda e:errors.append(str(e)));response=fresh.goto(url+'#ch4',wait_until='load');(out/'fresh.html').write_bytes(response.body());report['fresh_sha256']=hashlib.sha256(response.body()).hexdigest();report['expected_sha256']=hashlib.sha256((new/'index.html').read_bytes()).hexdigest();report['fresh_caches']=fresh.evaluate('caches.keys()');check(response.body()==(new/'index.html').read_bytes(),'fresh offline tab receives byte-exact new edition');check(fresh.evaluate('caches.keys()')==[new_cache],'old edition cache removed after safe activation')
  f=fresh.locator('#fig-4-1');f.scroll_into_view_if_needed();f.locator('.lab-open').first.tap();f.locator('.atlas-pages button').first.wait_for();check(f.locator('.atlas-title').inner_text()=='Carbon monomers','new offline tab lazy-loads updated Atlas');f.locator('.live-close').click()
  answer=fresh.locator('#ch4 .box.check textarea').first;answer.fill('Offline upgrade persistence check');fresh.wait_for_timeout(500);fresh.reload(wait_until='load');check(fresh.locator('#ch4 .box.check textarea').first.input_value()=='Offline upgrade persistence check','offline check answer survives reload');box=fresh.locator('#ch4 .box.check').first;box.locator('.chk-flap-btn').click();check(box.locator('.chk-reveal').is_visible(),'offline answer flap opens');box.get_by_role('button',name='I got it',exact=True).click();fresh.reload(wait_until='load');check(fresh.locator('#ch4 .box.check').first.get_attribute('data-rated')=='got','offline self-rating survives reload');check(not errors,'no page errors during edition transition');browser.close()
 report['pass']=True
except Exception as e:report.update(pass_=False,error=str(e));report['pass']=False;traceback.print_exc()
finally:server.shutdown();server.server_close()
(out/'report.json').write_text(json.dumps(report,indent=2)+'\n');print('PASS' if report['pass'] else 'FAIL','offline edition upgrade',out,flush=True);raise SystemExit(0 if report['pass'] else 1)
