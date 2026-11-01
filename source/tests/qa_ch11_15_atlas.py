#!/usr/bin/env python3
"""Verify actual WebGL stations and changed controls in revised Chapters 11–15.
Usage: python tests/qa_reader_atlas.py [build/site/index.html] [--chapters 1,2,3,4,5]
"""
from pathlib import Path
import argparse
import functools
import http.server
import json
import os
import threading
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('site', nargs='?', default='build/site/index.html')
parser.add_argument('--chapters', default='11,12,13,14,15')
args = parser.parse_args()
site = Path(args.site).resolve()
if site.is_dir():
    site = site / 'index.html'
assert site.is_file(), f'Build the site first: {site}'
chapters = [int(n) for n in args.chapters.split(',')]
assert chapters and all(11 <= n <= 15 for n in chapters)
out = Path(os.environ.get('BIO_REVISION_OUT','/tmp/kym-bio-ch11-15-revision')) / 'atlas'
out.mkdir(exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = http.server.ThreadingHTTPServer(
    ('127.0.0.1', 0), functools.partial(Quiet, directory=str(site.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
errors = []
report = {'site': str(site), 'stations': [], 'screenshots': []}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(args=[
            '--use-gl=angle', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}#ch{chapters[0]}', wait_until='load')
        page.evaluate('document.fonts.ready')
        for chapter in chapters:
            page.evaluate('(n)=>{location.hash="#ch"+n;}', chapter)
            predictions=page.locator(f'#ch{chapter} .predict')
            assert predictions.count()==4, f'Chapter {chapter}: four predictions'
            for prediction in predictions.all():
                assert prediction.locator('.pred-opts > li').count()==3, f'Chapter {chapter}: setup text must not become answer options'
            figure = page.locator(f'#fig-{chapter}-1')
            figure.scroll_into_view_if_needed()
            figure.locator('.lab-open').first.click()
            figure.locator('.atlas-pages button').first.wait_for(state='visible', timeout=20000)
            canvas = figure.locator('.atlas-stage canvas').first
            canvas.wait_for(state='visible', timeout=20000)
            tabs = figure.locator('.atlas-pages button')
            assert tabs.count() == 4, f'Chapter {chapter}: four station tabs required'
            for station in range(4):
                tabs.nth(station).click()
                # Let the engine apply the tab/controls and render; no fixed import delay.
                for slider in figure.locator('.live-slider input[type=range]').all():
                    slider.evaluate('e=>{e.value=e.max;e.dispatchEvent(new Event("input",{bubbles:true}));}')
                page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
                # Wait for camera interpolation to settle before inspecting/saving the scene.
                page.wait_for_function("""id=>{
                    const f=document.getElementById(id);
                    const positions=[...f.querySelectorAll('.atlas-labels>*')].map(e=>{
                        const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y)];
                    });
                    const value=JSON.stringify(positions), old=f.__readerQaLayout;
                    f.__readerQaLayout={value,count:old&&old.value===value?old.count+1:0};
                    return f.__readerQaLayout.count>=4;
                }""", arg=f'fig-{chapter}-1', polling=100, timeout=20000)
                badge = figure.locator('.atlas-badge').inner_text()
                assert badge.startswith('3D Atlas'), f'Chapter {chapter}, station {station}: {badge}'
                status = canvas.evaluate('''e=>{
                    const gl=e.getContext('webgl2')||e.getContext('webgl');
                    return {webgl:!!gl,lost:gl?gl.isContextLost():true,width:e.width,height:e.height};
                }''')
                assert status['webgl'] and not status['lost'], (chapter, station, status)
                assert status['width'] > 0 and status['height'] > 0, status
                assert len(figure.locator('.live-readout').inner_text()) > 30
                assert not errors, errors
                screenshot = out / f'ch{chapter}-station{station}-1440.png'
                figure.screenshot(path=str(screenshot))
                report['screenshots'].append(str(screenshot))
                report['stations'].append({'chapter': chapter, 'station': station, **status})
            page.set_viewport_size({'width': 390, 'height': 1000})
            page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'Chapter{chapter}: mobile overflow'
            assert figure.locator('.atlas-badge').inner_text().startswith('3D Atlas')
            screenshot = out / f'ch{chapter}-station3-390.png'
            figure.screenshot(path=str(screenshot))
            report['screenshots'].append(str(screenshot))
            figure.locator('.live-close').click()
            page.set_viewport_size({'width': 1440, 'height': 1000})
        assert not errors, errors
        browser.close()
finally:
    server.shutdown()
report['errors'] = errors
(out / 'report.json').write_text(json.dumps(report, indent=2))
print(f'PASS: {len(report["stations"])} actual WebGL stations; changed controls; mobile resize; no browser errors. {out}')
