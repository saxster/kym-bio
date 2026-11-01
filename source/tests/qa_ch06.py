#!/usr/bin/env python3
"""Local Chapter 6 acceptance against the actual final site, never a fixture.

Run after build.py --site build/site. BIO_CH06_QA_OUT selects a distinct evidence
folder. Failures retain report.json and screenshots for review.
"""
from pathlib import Path
import functools
import hashlib
import http.server
import json
import os
import re
import subprocess
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SITE = Path(os.environ.get('BIO_QA_SITE', str(ROOT / 'build/site')))
OUT = Path(os.environ.get('BIO_CH06_QA_OUT', '/tmp/lt_bio_ch06/qa'))
OUT.mkdir(parents=True, exist_ok=True)
WIDGETS = [3, 4, 5]
THEMES = ['light', 'dark', 'sepia']
WIDTHS = [390, 820, 1024, 1180, 1440]
report = {'checks': [], 'errors': [], 'matrix': [], 'screenshots': [], 'tour_states': [], 'status': 'running'}


def check(ok, message):
    if not ok:
        raise AssertionError(message)
    report['checks'].append(message)


def save_report():
    (OUT / 'report.json').write_text(json.dumps(report, indent=2))


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def monitor(page):
    page.on('pageerror', lambda e: report['errors'].append(str(e)))
    page.on('console', lambda m: report['errors'].append(m.text) if m.type == 'error' else None)


def shot(target, name):
    target.screenshot(path=str(OUT / name))
    report['screenshots'].append(name)


def ready(page, fragment='ch6'):
    page.goto(URL + '#' + fragment, wait_until='load')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(400)


def slide(figure, label, value):
    figure.get_by_label(label, exact=True).evaluate(
        '(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}', str(value))


def tab(figure, name):
    figure.get_by_role('button', name=name, exact=True).click()


def opened(page, number):
    figure = page.locator(f'#fig-6-{number}')
    figure.scroll_into_view_if_needed()
    figure.locator('.live-open').click()
    page.wait_for_timeout(200)
    return figure


def stamped(figure):
    return figure.locator('.live-stamp').evaluate("e=>e.classList.contains('is-stamped')")


def clear_stamps(page):
    page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('mw:stamp:')).forEach(k=>localStorage.removeItem(k))")


def overflow(page, figure, label):
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Document has no horizontal overflow: ' + label)
    issues = figure.locator('.live-slider, .live-tabs, .live-controls').evaluate_all('''els=>{
      const out=[];for(const e of els){const f=e.closest('figure').getBoundingClientRect();
        for(const q of e.querySelectorAll('label,input,output,button')){
          if(!q.getClientRects().length)continue;const b=q.getBoundingClientRect();
          if(b.left<f.left-1||b.right>f.right+1)out.push(q.textContent||q.type);
        }}return [...new Set(out)];}''')
    check(not issues, f'Controls remain within figure {label}: {issues}')


# Real browser font bounds, including paths as well as line arrows.
SVG_AUDIT = '''s=>{
 const v=s.viewBox.baseVal,text=[...s.querySelectorAll('text')].map(t=>({t:t.textContent,b:t.getBBox()})),out=[];
 for(const q of text){const b=q.b;if(b.x<-.1||b.y<-.1||b.x+b.width>v.width+.1||b.y+b.height>v.height+.1)out.push('clip '+q.t);}
 for(let i=0;i<text.length;i++)for(let j=i+1;j<text.length;j++){
  const a=text[i],b=text[j];if(Math.min(a.b.x+a.b.width,b.b.x+b.b.width)-Math.max(a.b.x,b.b.x)>1&&Math.min(a.b.y+a.b.height,b.b.y+b.b.height)-Math.max(a.b.y,b.b.y)>1)out.push('text overlap '+a.t+' / '+b.t);
 }
 for(const l of s.querySelectorAll('[marker-end]')){
  const ref=l.getAttribute('marker-end').match(/#([^)]+)/),marker=ref&&document.getElementById(ref[1]);
  if(!marker||getComputedStyle(l).stroke==='none')out.push('invisible arrow '+l.outerHTML.slice(0,90));
  if(!l.getTotalLength)continue;const length=l.getTotalLength();
  for(const q of text){const b=q.b;for(let d=1;d<length-1;d+=.75){const p=l.getPointAtLength(d);
   if(p.x>b.x+.5&&p.x<b.x+b.width-.5&&p.y>b.y+.5&&p.y<b.y+b.height-.5){out.push('arrow shaft crosses '+q.t);break;}
  }}
 }
 return out;
}'''

# Canvas actual ink bounds and frame receipt for *Chapter 6*, including theme/resize.
CANVAS_AUDIT = '''window.ch06CanvasIssues=[];window.ch06Frames={};window.ch06GLCalls=0;
const originalFill=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,x,y,...args){
 const id=this.canvas.closest('figure')?.id;
 if(id?.startsWith('fig-6-')&&this.canvas.dataset.logicalWidth){
  const w=Number(this.canvas.dataset.logicalWidth),h=Number(this.canvas.style.aspectRatio.split('/')[1]),m=this.measureText(t);
  const b={left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};
  if(b.left<-.1||b.right>w+.1||b.top<-.1||b.bottom>h+.1)window.ch06CanvasIssues.push({id,text:String(t),bounds:b,width:w,height:h});
  window.ch06Frames[id]=(window.ch06Frames[id]||0)+1;
 }
 return originalFill.call(this,t,x,y,...args);
};'''

DOMAIN = r"""
import assert from 'node:assert/strict';
import {relayAccount,oxidationAccount,carrierAccount} from './live/respiration_model.js';
import {ENHANCEMENTS} from './live/enhancements.js';
// Independent formula parser and balance: do not import the implementation's constants.
const atoms=s=>Object.fromEntries([...s.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(m=>[m[1],+(m[2]||1)]));
const mass=a=>Object.entries(a).reduce((sum,[e,n])=>sum+({C:12,H:1,O:16}[e])*n,0);
const fuel=atoms('C55H104O6'),oxygen=atoms('O2'),carbon=atoms('CO2'),water=atoms('H2O');
const nCO2=fuel.C,nWater=fuel.H/water.H,nO2=(nCO2*carbon.O+nWater*water.O-fuel.O)/oxygen.O;
const inAtoms={...fuel,O:fuel.O+nO2*oxygen.O},outAtoms={C:nCO2*carbon.C,H:nWater*water.H,O:nCO2*carbon.O+nWater*water.O};
assert.deepEqual(inAtoms,outAtoms);
const F=mass(fuel),O=nO2*mass(oxygen),C=nCO2*mass(carbon),W=nWater*mass(water);
assert.equal(F+O,C+W);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
let count=0;
for(let i=0;i<=1000;i++){
 const m=i/100,q=oxidationAccount(m);near(q.fat,m);near(q.oxygen,m*O/F);near(q.co2,m*C/F);near(q.water,m*W/F);
 near(q.input,m*(F+O)/F);near(q.output,m*(C+W)/F);near(q.input,q.output);
 // Four of the six original oxygens is MB14's explicit exchange convention,
 // not something that can be solved from the net reaction alone.
 near(q.assignedCO2,m*(fuel.C*12+4*16)/F);near(q.assignedWater,m*(fuel.H+(fuel.O-4)*16)/F);
 near(q.assignedCO2+q.assignedWater,m);assert.deepEqual(q.atomsIn,Object.values(inAtoms));assert.deepEqual(q.atomsOut,Object.values(outAtoms));
 assert.deepEqual(q.nominal,{fat:F,oxygen:O,co2:C,water:W});count++;
}
for(const k of ['fat','oxygen','co2','water','input','output','assignedCO2','assignedWater'])assert.equal(oxidationAccount(0)[k],0);
for(const v of [-9,-.1,0,.49,1,3.6,4,9,NaN,Infinity,-Infinity,undefined]){
 const step=Number.isFinite(+v)?Math.round(Math.max(0,Math.min(4,+v))):0;
 for(const oxygen of [false,true]){const q=relayAccount(v,oxygen);assert.equal(q.step,step);assert.equal(q.chainActive,oxygen);assert.equal(q.maintainedGradient,oxygen);assert.equal(q.sustainedSynthase,oxygen);count++;}
 for(const r of [-20,0,.6,1,2,99,NaN,Infinity,-Infinity,undefined]){
  const route=Number.isFinite(+r)?Math.round(Math.max(0,Math.min(2,+r))):0,q=carrierAccount(r,v);
  assert.equal(q.route,route);assert.equal(q.step,step);assert.equal(q.pyruvates,2);assert.equal(q.netATP,4-2);assert.equal(q.formedATP-q.investedATP,q.netATP);
  assert.equal(q.fermentationExtraATP,route===0?null:0);count++;
 }
}
for(const v of [-100,100,NaN,Infinity,-Infinity,undefined]){
 const expected=Number.isFinite(+v)?Math.max(0,Math.min(10,+v)):1;assert.equal(oxidationAccount(v).fat,expected);
}
assert.match(carrierAccount(0).recipient,/O₂/);assert.match(carrierAccount(1).products,/2 ethanol \+ 2 CO₂/);assert.match(carrierAccount(2).products,/2 lactate; no CO₂/);
for(const name of ['respiration_relay','oxidation_ledger','carrier_routes']){
 const q=ENHANCEMENTS[name];assert.equal(q.watch.length,5);assert.ok(q.challenge&&q.yourNumbers&&q.cutaway&&q.idealised);
 for(const shot of q.watch){assert.equal(typeof shot.act,'function');assert.equal(typeof shot.cutaway,'boolean');}
}
console.log(count+' independent formula/balance/model cases; 15 explicit tour shots');
"""


def preservation():
    entries = json.loads((ROOT / 'tests/ch06-preserved.json').read_text())['files']
    for name, expected in entries.items():
        from revision_preservation import revised_file
        if revised_file(ROOT,name,check,report):continue
        data = (ROOT.parent / name).read_bytes()
        if name == 'source/live/enhancements.js':
            marker = b'  respiration_relay: {'
            check(data.count(marker) == 1, 'Chapter 6 enhancements appended exactly once')
            data = data.split(marker)[0] + b'};\n'
        check(len(data) == expected['bytes'] and hashlib.sha256(data).hexdigest() == expected['sha256'], 'Preserved existing file ' + name)
    report['preserved_files'] = len(entries)


def tour_state(figure, number, shot_index):
    state = {
        3: [(0, 0), (0, 1), (0, 2), (0, 4), (1, 4)],
        4: [(1, 0), (2, 0), (1, 1), (0, 0), (1, 1)],
        5: [(0, 0), (0, 1), (0, 4), (1, 4), (2, 4)],
    }[number][shot_index]
    a, z = state
    readout = figure.locator('.live-readout').inner_text()
    if number == 3:
        check(float(figure.get_by_label('Relay stage', exact=True).input_value()) == z, 'Relay tour stage')
        label = ['O₂ available', 'Sustained O₂ absence'][a]
        check(f'Oxygen condition {a}; relay stage {z}:' in readout, 'Relay readout matches actual tour state')
        if a:
            check('after the residual gradient dissipates' in readout, 'Absent oxygen is sustained comparison')
    elif number == 4:
        check(float(figure.get_by_label('Fat oxidised', exact=True).input_value()) == a, 'Mass tour sample')
        label = ['Total inputs and products', 'Original-fat allocation'][z]
        check(f'Account view {z}; fat sample {a:.1f} kg.' in readout, 'Mass readout matches actual tour state')
        if a == 0:
            check('0.0000 kg fat + 0.0000 kg O₂ = 0.0000 kg total CO₂ + 0.0000 kg total H₂O' in readout, 'Zero sample has zero input and product masses')
    else:
        check(float(figure.get_by_label('Carrier stage', exact=True).input_value()) == z, 'Carrier tour stage')
        label = ['Aerobic route', 'Yeast fermentation', 'Lactate fermentation'][a]
        check(f'Route {a}; carrier stage {z}:' in readout, 'Carrier readout matches actual tour state')
        check('4 ATP formed − 2 ATP invested = 2 net ATP' in readout, 'Glycolytic ATP is net account')
    check(figure.get_by_role('button', name=label, exact=True).get_attribute('aria-pressed') == 'true', 'Tour selected actual tab ' + label)
    check(figure.locator('.live-cutaway-btn').get_attribute('aria-pressed') == str(shot_index == 2).lower(), 'Tour explicitly selects cutaway state')
    report['tour_states'].append({'figure': number, 'shot': shot_index + 1, 'state': list(state)})


def complete_challenge(figure, number, page):
    if number == 3:
        tab(figure, 'Sustained O₂ absence'); slide(figure, 'Relay stage', 4)
        check(not stamped(figure), 'One oxygen endpoint cannot earn comparison')
        tab(figure, 'O₂ available'); slide(figure, 'Relay stage', 4)
        tab(figure, 'Sustained O₂ absence')
        check('Both oxygen endpoints inspected.' in figure.locator('.live-readout').inner_text(), 'Both requested oxygen endpoints actually inspected')
    elif number == 4:
        slide(figure, 'Fat oxidised', 2); tab(figure, 'Original-fat allocation')
        check(not stamped(figure), 'Wrong sample cannot earn 1 kg comparison')
        slide(figure, 'Fat oxidised', 1)
        tab(figure, 'Total inputs and products'); tab(figure, 'Original-fat allocation')
        check('2.8140 kg total CO₂' in figure.locator('.live-readout').inner_text() and '0.8419 kg to CO₂' in figure.locator('.live-readout').inner_text(), 'Displayed total and original-fat contribution are distinct')
    else:
        slide(figure, 'Carrier stage', 4)
        check(not stamped(figure), 'One carrier endpoint cannot earn three-route comparison')
        tab(figure, 'Yeast fermentation')
        check(not stamped(figure), 'Two carrier endpoints cannot earn three-route comparison')
        tab(figure, 'Lactate fermentation')
        check('All three recycling endpoints inspected.' in figure.locator('.live-readout').inner_text(), 'Three carrier endpoints actually inspected')
    check(stamped(figure), f'Challenge {number} earned by its actual requested history')


def story_check(page, name):
    story = page.locator('#storydlg #story-rotary-pointer')
    check(story.is_visible(), 'Rotary-pointer story visible: ' + name)
    text = story.inner_text()
    check('actin filament' in text and 'gamma subunit' in text, 'Story links observable pointer to shaft: ' + name)
    check('ATP breakdown' in text and 'reverse energy direction' in text, 'Story preserves hydrolysis/synthesis distinction: ' + name)
    check('Jens Skou' in text and 'half' in text, 'Story preserves shared Nobel attribution: ' + name)
    check(story.evaluate('e=>e.scrollWidth<=e.clientWidth+1'), 'Story has no horizontal overflow: ' + name)


def browser_checks():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        context.add_init_script(CANVAS_AUDIT)
        page = context.new_page(); monitor(page)
        requests = []
        page.on('request', lambda r: requests.append(r.url) if '/live/w_' in r.url else None)
        ready(page)
        check(not requests, 'No widget chunks requested before interaction')
        check(page.locator('#ch6 svg.fig').count() == 6, 'Six original Chapter 6 plates in actual site')
        check('Access for free at' in page.locator('#ch6').inner_text(), 'Chapter 6 OpenStax footer visible')
        for width in WIDTHS:
            page.set_viewport_size({'width': width, 'height': 1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t', theme)
                for number in range(1, 7):
                    figure = page.locator(f'#fig-6-{number}'); figure.scroll_into_view_if_needed(); page.wait_for_timeout(100)
                    issues = figure.locator('svg.fig').evaluate(SVG_AUDIT)
                    check(not issues, f'SVG bounds/text/arrows {number}/{width}/{theme}: {issues}')
                    shot(figure, f'plate-{number}-{width}-{theme}.png')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'Plate page no horizontal overflow {width}/{theme}')
                report['matrix'].append([width, theme])
        for width in [390, 1440]:
            page.set_viewport_size({'width': width, 'height': 1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t', theme)
                for number in WIDGETS:
                    clear_stamps(page)
                    figure = opened(page, number)
                    check(figure.locator('.live-play').count() == 0, 'Static lesson has no meaningless playback')
                    check(figure.locator('canvas[aria-label]').count() == 1, 'Canvas has accessible textual alternative')
                    check(not stamped(figure), f'Challenge {number} unearned at baseline')
                    shot(figure, f'live-{number}-{width}-{theme}-default.png')
                    overflow(page, figure, f'{number}/{width}/{theme}/default')
                    complete_challenge(figure, number, page)
                    figure.locator('.live-watch-btn').click()
                    check(figure.locator('.live-watch-btn').get_attribute('aria-pressed') == 'false', 'Reduced-motion tour remains manual')
                    dots = figure.locator('.live-watch-dot'); check(dots.count() == 5, 'Exactly five tour shots')
                    for index in [4, 1, 3, 0, 2, 4]:
                        dots.nth(index).click()
                        tour_state(figure, number, index)
                    shot(figure, f'live-{number}-{width}-{theme}-changed.png')
                    overflow(page, figure, f'{number}/{width}/{theme}/changed')
                    before = figure.locator('.live-readout').text_content()
                    detail = figure.locator('.live-detail-toggle')
                    detail.focus(); page.keyboard.press('Enter'); page.wait_for_timeout(100)
                    check(detail.get_attribute('aria-pressed') == 'true', 'Keyboard opens full-size inspection')
                    check(figure.locator('canvas').evaluate('c=>c.getBoundingClientRect().width>=Number(c.dataset.logicalWidth)-1'), 'Full-size drawing reaches native logical width')
                    check(before == figure.locator('.live-readout').text_content(), 'Full-size inspection preserves science state')
                    shot(figure, f'inspect-{number}-{width}-{theme}.png')
                    # Full drawing can scroll inside stage without pushing the document.
                    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Full-size drawing remains contained')
                    detail.focus(); page.keyboard.press('Enter')
                    figure.locator('.live-close').click()
                    overflow(page, figure, f'{number}/{width}/{theme}/closed-hidden-controls')
        # Story link, direct deep link, and Escape return to reading.
        for width in [390, 1440]:
            page.set_viewport_size({'width': width, 'height': 1000})
            for theme in THEMES:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t', theme)
                link = page.locator('#ch6 a.st-card[data-story="rotary-pointer"]').first
                link.scroll_into_view_if_needed(); link.focus(); page.keyboard.press('Enter'); page.wait_for_timeout(200)
                story_check(page, f'keyboard/{width}/{theme}')
                shot(page.locator('#storydlg'), f'rotary-pointer-{width}-{theme}.png')
                page.keyboard.press('Escape'); page.wait_for_timeout(200)
                check(not page.locator('#storydlg').is_visible(), 'Escape closes rotary story')
        # The automatic term link is inside a folded Understand-it answer. Open
        # that answer through its native summary before trying to focus the link.
        term = page.locator('#ch6 a.sl:not(.st-card)[data-story="rotary-pointer"]').first
        fold = term.locator('xpath=ancestor::details[1]')
        if fold.get_attribute('open') is None:
            summary = fold.locator('summary').first
            summary.scroll_into_view_if_needed(); summary.focus(); page.keyboard.press('Enter')
        term.scroll_into_view_if_needed(); term.focus()
        check(term.evaluate('e=>document.activeElement===e'), 'Expanded automatic story term receives keyboard focus')
        page.keyboard.press('Enter'); page.wait_for_timeout(200)
        story_check(page, 'expanded automatic term keyboard')
        page.keyboard.press('Escape'); page.wait_for_timeout(200)
        deep = context.new_page(); monitor(deep); ready(deep, 'story-rotary-pointer'); story_check(deep, 'direct URL'); deep.close()
        # Resize/theme must repaint an already-paused state, not just retain controls.
        for number in WIDGETS:
            figure = opened(page, number)
            label = {3: 'Relay stage', 4: 'Fat oxidised', 5: 'Carrier stage'}[number]
            slide(figure, label, 2)
            before = figure.locator('.live-readout').text_content()
            frames = page.evaluate('(id)=>window.ch06Frames[id]||0', f'fig-6-{number}')
            page.set_viewport_size({'width': 820, 'height': 1000}); page.evaluate("document.documentElement.dataset.theme='dark'")
            figure.scroll_into_view_if_needed(); page.wait_for_timeout(200)
            check(before == figure.locator('.live-readout').text_content(), 'Paused state survives resize/theme')
            check(page.evaluate('(id)=>window.ch06Frames[id]||0', f'fig-6-{number}') > frames, 'Paused Canvas actually repainted on resize/theme')
            check(figure.locator('canvas').evaluate('c=>c.width>0&&c.height>0'), 'Paused Canvas dimensions are nonzero')
            control = figure.get_by_label(label, exact=True); value = float(control.input_value()); control.focus(); page.keyboard.press('ArrowRight')
            check(abs(float(control.input_value()) - value - (.1 if number == 4 else 1)) < 1e-8, 'Native labelled slider works by keyboard')
            shot(figure, f'paused-resize-theme-{number}.png'); figure.locator('.live-close').click()
        check(not page.evaluate('window.ch06CanvasIssues'), 'All Chapter 6 Canvas text ink stays within geometry: ' + str(page.evaluate('window.ch06CanvasIssues')))
        # Print restores SVG even while an interactive lesson is open.
        figure = opened(page, 3)
        page.emulate_media(media='print')
        check(figure.locator('svg.fig').is_visible(), 'Print restores original SVG while widget is open')
        for theme in THEMES:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t', theme)
            check(page.evaluate("getComputedStyle(document.documentElement).colorScheme==='light'"), 'Print forces light scheme from ' + theme)
            check(page.locator('#ch6').evaluate("e=>getComputedStyle(e).color==='rgb(20, 27, 25)'"), 'Chapter print ink from ' + theme)
            check(page.locator('#ch6 svg.fig text').first.evaluate("e=>getComputedStyle(e).fill==='rgb(20, 27, 25)'"), 'Plate print ink from ' + theme)
            check(page.locator('body').evaluate("e=>getComputedStyle(e).backgroundColor==='rgb(255, 255, 255)'"), 'Print paper white from ' + theme)
        page.pdf(path=str(OUT / 'print.pdf'), format='A4', print_background=True)
        report['print_pdf'] = str(OUT / 'print.pdf')
        page.emulate_media(media='screen'); figure.locator('.live-close').click()
        # Normal-motion readers still open on a static first frame.
        motion = browser.new_context(viewport={'width': 820, 'height': 1000}, reduced_motion='no-preference')
        mp = motion.new_page(); monitor(mp); ready(mp)
        for number in WIDGETS:
            f = opened(mp, number); before = f.locator('.live-readout').text_content(); mp.wait_for_timeout(350)
            check(before == f.locator('.live-readout').text_content(), 'Normal motion opens without autoplay')
            f.locator('.live-watch-btn').click(); check(f.locator('.live-watch-btn').get_attribute('aria-pressed') == 'true', 'Tour starts only on explicit request')
            mp.locator('#s6-1').scroll_into_view_if_needed(); mp.wait_for_timeout(200)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed') == 'false', 'Tour pauses off-screen')
            f.scroll_into_view_if_needed(); f.locator('.live-watch-btn').click(); mp.emulate_media(reduced_motion='reduce'); mp.wait_for_timeout(150)
            check(f.locator('.live-watch-btn').get_attribute('aria-pressed') == 'false', 'Dynamic reduced-motion change stops tour')
            f.locator('.live-close').click(); mp.emulate_media(reduced_motion='no-preference')
        motion.close()
        nojs = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
        np = nojs.new_page(); np.goto(URL, wait_until='load')
        check(np.locator('#ch6').is_visible() and np.locator('#ch6 svg.fig').count() == 6, 'No-JavaScript Chapter 6 prose and all six plates readable')
        check('Breathing' in np.locator('#ch6').inner_text() or 'breathing' in np.locator('#ch6').inner_text(), 'No-JavaScript prose retains explanation')
        np.locator('#fig-6-3').scroll_into_view_if_needed(); shot(np, 'no-js.png'); nojs.close()
        # Final artifact service-worker receipt and actual offline reuse.
        page.evaluate('navigator.serviceWorker.ready'); page.wait_for_timeout(1800)
        check(page.evaluate('!!navigator.serviceWorker.controller'), 'Final site service worker controls page')
        report['browser_caches'] = page.evaluate('caches.keys()')
        check(report['cache'] in report['browser_caches'], 'Browser cache matches final built cache version')
        context.set_offline(True)
        offline = context.new_page(); monitor(offline); ready(offline)
        check(offline.locator('#ch6').is_visible(), 'Chapter 6 reloads offline')
        for number in WIDGETS:
            for attempt in range(2):
                f = opened(offline, number)
                check(f.locator('canvas[aria-label]').count() == 1, f'Widget {number} opens offline attempt {attempt+1}')
                f.locator('.live-close').click()
        offline.evaluate("App.openStory('rotary-pointer')"); offline.wait_for_timeout(200); story_check(offline, 'offline')
        shot(offline.locator('#storydlg'), 'rotary-pointer-offline.png')
        offline.keyboard.press('Escape'); context.set_offline(False); context.close(); browser.close()
        # WebGL disabled is an actual browser launch; manual keyboard controls still work.
        fallback = p.chromium.launch(args=['--disable-webgl'])
        fc = fallback.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
        fc.add_init_script(CANVAS_AUDIT + '''const getContext=HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext=function(kind,...args){if(kind.includes('webgl'))window.ch06GLCalls++;return getContext.call(this,kind,...args);};''')
        fp = fc.new_page(); monitor(fp); ready(fp)
        for number in WIDGETS:
            f = opened(fp, number)
            check(f.locator('canvas[aria-label]').count() == 1, f'Widget {number} works with WebGL disabled')
            label = {3: 'Relay stage', 4: 'Fat oxidised', 5: 'Carrier stage'}[number]
            control = f.get_by_label(label, exact=True); value = float(control.input_value()); control.focus(); fp.keyboard.press('ArrowRight')
            check(abs(float(control.input_value()) - value - (.1 if number == 4 else 1)) < 1e-8, 'Keyboard works without WebGL')
            shot(f, f'no-webgl-{number}.png'); f.locator('.live-close').click()
        check(fp.evaluate('window.ch06GLCalls') == 0, 'Chapter 6 widgets do not probe or create WebGL contexts')
        check(not fp.evaluate('window.ch06CanvasIssues'), 'Fallback Canvas text stays within geometry')
        fallback.close()


server = None
try:
    check((SITE / 'index.html').exists(), 'Final site exists before acceptance')
    check('id="ch6"' in (SITE / 'index.html').read_text(), 'Actual book build contains Chapter 6')
    preservation()
    result = subprocess.run(['node', '--input-type=module', '-e', DOMAIN], cwd=ROOT, capture_output=True, text=True)
    check(result.returncode == 0, result.stdout + result.stderr)
    report['domain'] = result.stdout.strip()
    check((SITE / 'index.html').stat().st_size < 4_000_000, 'Index below 4 MB')
    report['chunk_bytes'] = {}
    for name in ['respiration_relay', 'oxidation_ledger', 'carrier_routes']:
        chunks = list((SITE / 'live').glob(f'w_{name}-*.js'))
        check(len(chunks) == 1 and chunks[0].stat().st_size < 150_000, f'{name} lazy chunk below 150 KB')
        report['chunk_bytes'][name] = chunks[0].stat().st_size
    report['cache'] = re.search(r"const CACHE\s*=\s*['\"]([^'\"]+)", (SITE / 'sw.js').read_text()).group(1)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(SITE)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{server.server_address[1]}/index.html'
    browser_checks()
    check(not report['errors'], 'No browser console or page errors: ' + str(report['errors']))
    preservation()
    report['status'] = 'pass'
except Exception:
    report['status'] = 'fail'
    report['failure'] = traceback.format_exc()
    raise
finally:
    if server:
        server.shutdown()
    save_report()
print(f'PASS {len(report["checks"])} assertions; {report["domain"]}; cache {report["cache"]}; {OUT}')
