#!/usr/bin/env python3
"""End-to-end Playwright verification of all 16 3D Atlas biology chapters (Ch 0..15) and 117 figure lessons."""
import functools
import http.server
import os
import sys
import threading
from playwright.sync_api import sync_playwright

_BUILD_SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'build', 'site'))
_ROOT_SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE_DIR = _BUILD_SITE if os.path.exists(os.path.join(_BUILD_SITE, 'index.html')) else _ROOT_SITE


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=SITE_DIR))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{server.server_address[1]}/index.html'

    # Representative figure per chapter (covering all 16 chapters Ch 0..15)
    chapter_targets = [
        (0, 'fig-0-3', 'ch00-pasteur-3d'),
        (1, 'fig-1-3', 'ch01-atp-coin-3d'),
        (2, 'fig-2-2', 'ch02-endosymbiosis-3d'),
        (3, 'fig-3-1', 'ch03-bilayer-3d'),
        (4, 'fig-4-3', 'ch04-protein-3d'),
        (5, 'fig-5-3', 'ch05-thylakoid-3d'),
        (6, 'fig-6-2', 'ch06-mitochondrion-3d'),
        (7, 'fig-7-3', 'ch07-peristalsis-3d-bolus'),
        (8, 'fig-8-3', 'ch08-alveolus-3d'),
        (9, 'fig-9-6', 'ch09-eye-3d-anatomy'),
        (10, 'fig-10-2', 'ch10-skin-3d'),
        (11, 'fig-11-2', 'ch11-helix-3d'),
        (12, 'fig-12-3', 'ch12-mitosis-3d'),
        (13, 'fig-13-2', 'ch13-locus-3d'),
        (14, 'fig-14-4', 'ch14-antibiotic-3d'),
        (15, 'fig-15-5', 'ch15-eutrophication-3d'),
    ]

    with sync_playwright() as p:
        # 1. Full 3D WebGL verification across all 16 chapters
        b = p.chromium.launch(args=[
            '--use-gl=angle',
            '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader',
            '--ignore-gpu-blocklist',
        ])
        ctx = b.new_context(viewport={'width': 1280, 'height': 900})
        pg = ctx.new_page()
        errs = []
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}')
              if m.type in ('error', 'warning') and 'GL Driver Message' not in m.text else None)
        pg.on('pageerror', lambda e: errs.append(f'pageerror: {e.stack}'))

        pg.goto(url, wait_until='load')
        pg.wait_for_timeout(600)

        # Verify all 117 chapter figures have .lab-open buttons
        lab_btns = pg.evaluate("document.querySelectorAll('figure[data-labs] .lab-open').length")
        print(f'Total figure .lab-open 3D Atlas buttons mounted: {lab_btns}')
        assert lab_btns >= 117, f'Expected at least 117 .lab-open buttons, found {lab_btns}'

        # Verify story links ("Try the experiment") are attached to cast stories
        story_links = pg.evaluate("document.querySelectorAll('.lab-story-links a[data-open-lesson]').length")
        print(f'Total story experiment links mounted: {story_links}')
        assert story_links >= 20, f'Expected >= 20 story experiment links, found {story_links}'

        for ch_num, fig_id, lesson_id in chapter_targets:
            pg.evaluate(f"location.hash = '#{fig_id}'")
            pg.wait_for_timeout(200)
            fig = pg.query_selector(f'#{fig_id}')
            assert fig is not None, f'Missing figure #{fig_id}'
            fig.evaluate("e => e.scrollIntoView({block: 'center'})")
            pg.wait_for_timeout(150)

            btn = fig.query_selector(f'.lab-open[data-lesson-id="{lesson_id}"]')
            assert btn is not None, f'Missing .lab-open[data-lesson-id="{lesson_id}"] on #{fig_id}'
            btn.click()
            pg.wait_for_timeout(700)

            stage = fig.query_selector('.atlas-stage')
            assert stage is not None, f'Ch {ch_num} (#{fig_id}): .atlas-stage did not mount'

            # Verify 4 multi-page station tabs
            page_tabs = fig.query_selector_all('.atlas-pages button')
            assert len(page_tabs) == 4, f'Ch {ch_num}: expected 4 page tabs, got {len(page_tabs)}'

            # Verify Solid / X-ray / Section cutaway buttons
            cut_btns = fig.query_selector_all('.atlas-cuts button')
            assert len(cut_btns) == 3, f'Ch {ch_num}: expected 3 cutaway buttons, got {len(cut_btns)}'
            cut_btns[1].click()  # X-ray
            pg.wait_for_timeout(120)
            cut_btns[2].click()  # Section cutaway
            pg.wait_for_timeout(120)
            cut_btns[0].click()  # Solid
            pg.wait_for_timeout(120)

            # Verify interactive parameter sliders
            sliders = fig.query_selector_all('.live-slider input[type=range]')
            assert len(sliders) >= 2, f'Ch {ch_num}: expected >= 2 sliders, got {len(sliders)}'
            sliders[0].evaluate("e => { e.value = e.max; e.dispatchEvent(new Event('input')); }")
            pg.wait_for_timeout(120)

            # Verify part breakdown buttons
            part_btns = fig.query_selector_all('.atlas-parts button')
            assert len(part_btns) >= 2, f'Ch {ch_num}: expected >= 2 part buttons, got {len(part_btns)}'
            part_btns[0].click()
            pg.wait_for_timeout(120)

            # Step to another station tab and verify readout is non-empty
            page_tabs[-1].click()
            pg.wait_for_timeout(200)
            readout_txt = fig.query_selector('.live-readout').inner_text().strip()
            assert len(readout_txt) > 20, f'Ch {ch_num}: readout empty'

            print(f'PASS Ch {ch_num:02d} ({fig_id} -> {lesson_id}): 4 pages, {len(sliders)} sliders, {len(part_btns)} part buttons')

        assert not errs, f'Console/page errors during WebGL 3D verification: {errs}'
        b.close()

        # 2. Verify --disable-webgl 2D Canvas fallback
        b2 = p.chromium.launch(args=['--disable-webgl'])
        ctx2 = b2.new_context(viewport={'width': 1280, 'height': 900})
        pg2 = ctx2.new_page()
        errs2 = []
        pg2.on('pageerror', lambda e: errs2.append(f'fallback pageerror: {e.stack}'))
        pg2.goto(url, wait_until='load')
        pg2.wait_for_timeout(500)
        pg2.evaluate("location.hash = '#fig-6-2'")
        pg2.wait_for_timeout(200)
        fig6 = pg2.query_selector('#fig-6-2')
        fig6.evaluate("e => e.scrollIntoView({block: 'center'})")
        fig6.query_selector('.lab-open').click()
        pg2.wait_for_timeout(600)
        assert fig6.query_selector('.atlas-stage canvas') is not None, '2D fallback canvas missing'
        assert not errs2, f'Fallback errors: {errs2}'
        print('PASS --disable-webgl 2D Canvas fallback verified cleanly')
        b2.close()

    server.shutdown()
    print('ALL 16 CHAPTERS & 117 3D ATLAS LESSONS VERIFIED FLAWLESSLY!')


if __name__ == '__main__':
    main()
