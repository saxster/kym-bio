#!/usr/bin/env python3
"""Local revised-manuscript gate; no network CI or publication.
Run with the project Python containing Playwright: python tests/verify_ch11_15_revision.py.
BIO_REVISION_OUT selects an isolated build and retained evidence directory.
Historical chapter-authoring preservation checks remain available without this runner.
"""
from pathlib import Path
import hashlib,json,os,re,subprocess,sys
from concurrent.futures import ThreadPoolExecutor
from revision_fingerprint import revision_digest
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('BIO_REVISION_OUT','/tmp/kym-bio-ch11-15-revision'))
OUT.mkdir(parents=True,exist_ok=True)
SITE=OUT/'site'
resume='--resume' in sys.argv
prior={}
if resume:
    prior=json.loads((OUT/'baseline.json').read_text())
    for name,digest in prior.items():
        if not name.startswith('source/tests/'):
            assert revision_digest(ROOT.parent/name)==digest, f'Content changed; run a fresh build: {name}'
(OUT/'result.json').unlink(missing_ok=True)

def run(args,name,extra=None):
    env=os.environ.copy();env.update(extra or {})
    with (OUT/(name+'.log')).open('w') as log:
        result=subprocess.run(args,cwd=ROOT,env=env,stdout=log,stderr=subprocess.STDOUT)
    if result.returncode:
        print((OUT/(name+'.log')).read_text()[-8000:]);raise SystemExit(f'FAIL {name}; see {OUT}')
    print('PASS',name,flush=True)
if not resume:
    run([sys.executable,'build.py','--site',str(SITE)],'build')
paths=set()
for n in range(11,16):
    for pattern in [f'src/ch{n}.md',f'figs_ch{n}.py',f'grounding/ch{n}.md',f'provenance/ch{n}.yml',f'live/atlas/biology/ch{n}-*/*.js']:
        paths.update(ROOT.glob(pattern))
paths.add(ROOT/'lessons/vol4_genetics_ecology.json')
paths.add(ROOT/'build.py')
paths.add(ROOT/'tests/revision_fingerprint.py')
for pattern in ['tests/ch1[1-5]_domain.mjs','tests/qa_ch1[1-5].py','tests/ch11_12_revision.mjs','tests/qa_ch11_15_atlas.py']:
    paths.update(ROOT.glob(pattern))
paths.update(ROOT/'live'/f for f in ['genetic_code_model.js','cell_division_model.js','inheritance_model.js','selection_model.js','biosphere_biotech_model.js','enhancements.js'])
for n in range(11,16):
    for name in re.findall(r'^:::live (\w+)',(ROOT/f'src/ch{n}.md').read_text(),re.M):
        p=ROOT/f'live/w_{name}.js'
        if p.exists(): paths.add(p)
baseline={str(p.relative_to(ROOT.parent)):revision_digest(p) for p in sorted(paths)}
base=OUT/'baseline.json';base.write_text(json.dumps(baseline,indent=2))
for n in range(11,16):
    run(['node',f'tests/ch{n}_domain.mjs'],f'domain{n}')
run(['node','tests/ch11_12_revision.mjs'],'independent11-12')
run([sys.executable,'tests/qa_ch11_15_atlas.py',str(SITE/'index.html')],'atlas',{'BIO_REVISION_OUT':str(OUT)})
def chapter_qa(n):
    receipt=OUT/f'qa{n}'/'report.json'
    if resume and receipt.exists():
        report=json.loads(receipt.read_text())
        cache=re.search(r"const CACHE\s*=\s*['\"]([^'\"]+)",(SITE/'sw.js').read_text()).group(1)
        test=f'source/tests/qa_ch{n}.py'
        if report.get('status')=='pass' and report.get('cache')==cache and prior.get(test)==baseline.get(test):
            print(f'PASS qa{n} (retained receipt: same frozen content, cache and test)',flush=True)
            return
    run([sys.executable,f'tests/qa_ch{n}.py'],f'qa{n}',{'BIO_REVISION_BASELINE':str(base),f'BIO_CH{n}_SITE':str(SITE),f'BIO_CH{n}_QA_OUT':str(OUT/f'qa{n}')})
with ThreadPoolExecutor(max_workers=2) as pool:
    for result in pool.map(chapter_qa,[15,11,12,13,14]):
        pass
run([sys.executable,'livetest.py',str(SITE/'index.html'),str(OUT/'offline'),'--offline'],'offline')
for name,digest in baseline.items():
    assert revision_digest(ROOT.parent/name)==digest,f'Source changed during verification: {name}'
(OUT/'result.json').write_text(json.dumps({'status':'pass','site':str(SITE),'baseline':str(base),'chapters':[11,12,13,14,15]},indent=2))
print('PASS all revised chapter checks, source stability and offline browser smoke:',OUT)
