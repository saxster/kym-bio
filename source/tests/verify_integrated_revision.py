#!/usr/bin/env python3
"""Build and check the combined reader revisions locally; never publish or push.

Chapter-specific acceptance suites remain available in their original runners.
This integration gate checks the combined artifact, domain regressions, all 64
revised Atlas stations and whole-book offline use against stable source hashes.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('BIO_INTEGRATION_OUT') or tempfile.mkdtemp(prefix='bio-integrated-'))
OUT.mkdir(parents=True, exist_ok=True)
SITE = OUT / 'site'
(OUT / 'result.json').unlink(missing_ok=True)


def source_hashes():
    result = {}
    for directory, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in {'node_modules', 'build', '__pycache__', '.venv'}]
        for name in files:
            path = Path(directory) / name
            if name != '.DS_Store':
                result[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def run(name, args, extra=None):
    env = os.environ.copy()
    env.update(extra or {})
    with (OUT / (name + '.log')).open('w') as log:
        result = subprocess.run(args, cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT)
    if result.returncode:
        print((OUT / (name + '.log')).read_text()[-6000:], flush=True)
        raise RuntimeError(f'{name} failed; receipts: {OUT}')
    print('PASS', name, flush=True)


def browser(name):
    if name == 'offline':
        run(name, [sys.executable, 'livetest.py', str(SITE / 'index.html'), str(OUT / 'offline'), '--offline'])
    elif name == 'atlas00-05':
        run(name, [sys.executable, 'tests/qa_reader_atlas.py', str(SITE / 'index.html')])
        shutil.copytree('/tmp/bio-reader-atlas-qa', OUT / name, dirs_exist_ok=True)
    elif name == 'atlas06-10':
        run(name, [sys.executable, 'tests/qa_ch06_10_atlas.py', str(SITE / 'index.html')])
        shutil.copytree('/tmp/bio-ch06-10-atlas-qa-6-7-8-9-10', OUT / name, dirs_exist_ok=True)
    elif name == 'atlas11-15':
        run(name, [sys.executable, 'tests/qa_ch11_15_atlas.py', str(SITE / 'index.html')],
            {'BIO_REVISION_OUT': str(OUT)})


def main():
    baseline = source_hashes()
    (OUT / 'source-hashes.json').write_text(json.dumps(baseline, indent=2) + '\n')
    run('build', [sys.executable, 'build.py', '--site', str(SITE)])
    for path in sorted((ROOT / 'tests').glob('ch*_domain.mjs')):
        run(path.stem, ['node', str(path)])
    for name in ['atlas_framing_domain', 'atlas_particle_bounds_domain', 'atlas_quantitative_display_domain']:
        run(name, ['node', 'tests/' + name + '.mjs'])
    run('independent11-12', ['node', 'tests/ch11_12_revision.mjs'])
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(browser, ['offline', 'atlas00-05', 'atlas06-10', 'atlas11-15']))
    assert source_hashes() == baseline, 'Sources changed during verification; run again'
    result = {'status': 'pass', 'site': str(SITE), 'source_hashes': str(OUT / 'source-hashes.json'),
              'chapters': list(range(16)), 'actual_webgl_stations': 64, 'offline': True}
    (OUT / 'result.json').write_text(json.dumps(result, indent=2) + '\n')
    print('PASS combined reader revision:', OUT, flush=True)


if __name__ == '__main__':
    main()
