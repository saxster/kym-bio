#!/usr/bin/env python3
"""Compare live book files with this checkout. All work runs locally; no CI jobs."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import argparse,gzip,hashlib,json,re,subprocess,time,urllib.request
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url',default='https://saxster.github.io/kym-bio/')
parser.add_argument('--out',default='/tmp/kym-bio-live-assets')
args=parser.parse_args();ROOT=Path(__file__).resolve().parents[2];OUT=Path(args.out).resolve();OUT.mkdir(parents=True,exist_ok=True);BASE=args.url.rstrip('/')+'/'
files=json.loads(re.search(r'const FILES = (\[.*?\]);',(ROOT/'sw.js').read_text(),re.S).group(1));files={x.removeprefix('./') or 'index.html' for x in files}|{'sw.js','README.md','LICENSE.md','NOTICES.md','og.png'}
results=[]
def record(name,data,status,attempt):
 dest=OUT/'fetched'/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
 result={'file':name,'http':status,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'matches_release':data==(ROOT/name).read_bytes(),'attempt':attempt}
 print(name,status,'MATCH' if result['matches_release'] else 'MISMATCH',flush=True);return result
# Chromium reliably handles the large compressed HTML response and its fonts.
with sync_playwright() as p:
 browser=p.chromium.launch();page=browser.new_page();response=page.goto(BASE,wait_until='load',timeout=180000);results.append(record('index.html',response.body(),response.status,1));browser.close()
def fetch(name):
 for attempt in [1,2]:
  try:
   request=urllib.request.Request(BASE+name,headers={'Accept-Encoding':'gzip','User-Agent':'KymBook-live-verification/1.0'})
   with urllib.request.urlopen(request,timeout=90) as response:
    data=response.read();encoding=response.headers.get('Content-Encoding');status=response.status
   if encoding=='gzip':data=gzip.decompress(data)
   return record(name,data,status,attempt)
  except Exception as error:
   if attempt==2:return {'file':name,'matches_release':False,'error':str(error),'attempt':attempt}
   print('Retry transport failure:',name,str(error),flush=True)
with ThreadPoolExecutor(max_workers=6) as pool:results.extend(pool.map(fetch,sorted(files-{'index.html'})))
report={'url':BASE,'files':results,'pass':all(x['matches_release'] for x in results),'local_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()}
(OUT/'publication.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASS' if report['pass'] else 'FAIL',len(results),'published file comparisons:',OUT,flush=True)
raise SystemExit(0 if report['pass'] else 1)
