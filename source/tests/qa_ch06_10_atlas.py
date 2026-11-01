#!/usr/bin/env python3
"""Require real WebGL, not the adapter's silent 2D fallback, in the revised Chapters 6–10 Atlas models.
Usage: python tests/qa_reader_atlas.py [build/site/index.html] [--chapters 6,7,8,9,10]
"""
from pathlib import Path
import argparse
import functools
import http.server
import json
import threading
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('site', nargs='?', default='build/site/index.html')
parser.add_argument('--chapters', default='6,7,8,9,10')
args = parser.parse_args()
site = Path(args.site).resolve()
if site.is_dir():
    site = site / 'index.html'
assert site.is_file(), f'Build the site first: {site}'
chapters = [int(n) for n in args.chapters.split(',')]
assert chapters and all(6 <= n <= 10 for n in chapters)
out = Path('/tmp/bio-ch06-10-atlas-qa-' + '-'.join(map(str, chapters)))
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
        page.add_init_script('''window.atlasDrawCalls=0; for(const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype]){for(const key of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const original=proto[key];if(original)proto[key]=function(...args){window.atlasDrawCalls++;return original.apply(this,args);};}}''')
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}#ch{chapters[0]}', wait_until='load')
        page.evaluate('document.fonts.ready')
        for chapter in chapters:
            page.evaluate('(n)=>{location.hash="#ch"+n;}', chapter)
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
                canvas.scroll_into_view_if_needed()
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
                assert 'NaN' not in figure.locator('.live-readout').inner_text()
                if chapter == 10 and station == 0:
                    assert 'mg/min' in figure.locator('.live-readout').inner_text(), 'Glucose excretion has rate units'
                assert not errors, errors
                screenshot = out / f'ch{chapter}-station{station}-1440.png'
                figure.locator('.atlas-stage').screenshot(path=str(screenshot))
                report['screenshots'].append(str(screenshot))
                report['stations'].append({'chapter': chapter, 'station': station, **status})
                page.wait_for_timeout(1800)  # Let the paused interaction redraw window expire.
                draws_before_resize = page.evaluate('window.atlasDrawCalls')
                page.set_viewport_size({'width': 390, 'height': 1000})
                page.wait_for_function('n=>window.atlasDrawCalls>n',arg=draws_before_resize,timeout=8000)
                canvas.scroll_into_view_if_needed()
                page.wait_for_function("""id=>{
                    const f=document.getElementById(id);
                    const value=JSON.stringify([...f.querySelectorAll('.atlas-labels>*')].map(e=>{
                      const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y)];
                    }));
                    const old=f.__mobileQaLayout;
                    f.__mobileQaLayout={value,count:old&&old.value===value?old.count+1:0};
                    return f.__mobileQaLayout.count>=4;
                }""", arg=f'fig-{chapter}-1', polling=100, timeout=20000)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                mobile = out / f'ch{chapter}-station{station}-390.png'
                figure.locator('.atlas-stage').screenshot(path=str(mobile))
                report['screenshots'].append(str(mobile))
                page.set_viewport_size({'width': 1440, 'height': 1000})

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
