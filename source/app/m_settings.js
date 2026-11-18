// Reading settings: profiles, typeface, text size, line spacing, line length, theme, Still mode, Paper sounds, and Projector mode.
import App from './core.js';

const SIZES = [0.92, 1, 1.1, 1.22];
const SIZE_NAMES = ['Smaller', 'Normal', 'Larger', 'Largest'];
const FACES = [['literata', 'Literata'], ['georgia', 'New York'], ['sans', 'Lexend'], ['mono', 'Mono']];
const SPACINGS = [['compact', 'Compact', '1.48'], ['comfortable', 'Comfortable', '1.65'], ['spacious', 'Spacious', '1.92']];
const WIDTHS = [['narrow', 'Narrow', '31rem'], ['normal', 'Normal', '36rem'], ['wide', 'Wide', '43rem']];
const PROFILES = [
  ['read', 'Read', { face: 'literata', size: 1, spacing: 'comfortable', width: 'normal', theme: 'sepia' }],
  ['study', 'Study', { face: 'georgia', size: 2, spacing: 'comfortable', width: 'narrow', theme: 'light' }],
  ['evening', 'Evening', { face: 'literata', size: 2, spacing: 'spacious', width: 'normal', theme: 'dark' }],
];
const THEMES = [['auto', 'Auto'], ['light', 'Light'], ['sepia', 'Sepia'], ['dark', 'Dark']];
const root = document.documentElement;

function apply() {
  const s = App.store.get('settings', {});
  const size = Number.isInteger(s.size) ? Math.max(0, Math.min(3, s.size)) : 0;  // default: the smallest size
  root.style.setProperty('--scale', SIZES[size]);
  const face = FACES.some(f => f[0] === s.face) ? s.face : 'literata';
  root.setAttribute('data-face', face);
  const spEntry = SPACINGS.find(x => x[0] === s.spacing) || SPACINGS[1];
  const spacing = spEntry[0];
  root.style.setProperty('--lh', spEntry[2]);
  const wdEntry = WIDTHS.find(x => x[0] === s.width) || WIDTHS[1];
  const width = wdEntry[0];
  root.style.setProperty('--measure', wdEntry[2]);
  const theme = s.theme || 'sepia';  // default: sepia
  if (theme !== 'auto') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
  const still = !!s.still;
  root.classList.toggle('still', still);
  if (document.body) document.body.classList.toggle('still', still);
  const projector = !!s.projector;
  if (projector) root.setAttribute('data-projector', '1');
  else root.removeAttribute('data-projector');
  const sound = s.sound !== false;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--paper').trim() || '#f6f4ec');
  return { size, face, spacing, width, theme, still, projector, sound };
}
apply(); // as early as the module runs, before the toolbar is drawn

const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 18 8 6l4.5 12M5.2 13.6h5.6"/><path d="M14.5 18l3-8 3 8M15.6 15.4h3.8"/></svg>';
const ICON_STILL = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="10" cy="10" r="7.5"/><path d="M10 2.5 A7.5 7.5 0 0 1 10 17.5 Z" fill="currentColor" stroke="none"/></svg>';

App.ready(() => {
  const { el } = App;
  const supportsPopover = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;
  let state = apply();

  const profileBtns = PROFILES.map(([k, label, patch]) => el('button', {
    type: 'button', class: 'seg-b', 'aria-pressed': 'false', onclick: () => save(patch),
  }, label));
  const faceBtns = FACES.map(([k, label]) => el('button', {
    type: 'button', class: 'seg-b', 'aria-pressed': 'false', onclick: () => save({ face: k }),
  }, label));
  const sizeBtns = SIZES.map((_, i) => el('button', {
    type: 'button', class: 'seg-b', 'aria-pressed': 'false', 'aria-label': `Text size: ${SIZE_NAMES[i]}`,
    onclick: () => save({ size: i }),
  }, el('span', { style: `font-size:${0.78 + i * 0.13}rem`, 'aria-hidden': 'true' }, 'A')));
  const spacingBtns = SPACINGS.map(([k, label]) => el('button', {
    type: 'button', class: 'seg-b', 'aria-pressed': 'false', onclick: () => save({ spacing: k }),
  }, label));
  const widthBtns = WIDTHS.map(([k, label]) => el('button', {
    type: 'button', class: 'seg-b', 'aria-pressed': 'false', onclick: () => save({ width: k }),
  }, label));
  const themeBtns = THEMES.map(([k, label]) => el('button', {
    type: 'button', class: `seg-b th th-${k}`, 'aria-pressed': 'false', onclick: () => save({ theme: k }),
  }, el('span', { class: 'sw', 'aria-hidden': 'true' }), label));

  const stillToggle = el('button', {
    type: 'button', class: 'seg-b seg-wide', 'aria-pressed': 'false',
    onclick: () => save({ still: !state.still }),
  }, 'Still mode (freeze motion)');
  const soundToggle = el('button', {
    type: 'button', class: 'seg-b seg-wide', 'aria-pressed': 'false',
    onclick: () => save({ sound: !state.sound }),
  }, 'Paper & stamp sounds');
  const projToggle = el('button', {
    type: 'button', class: 'seg-b seg-wide', 'aria-pressed': 'false',
    onclick: () => save({ projector: !state.projector }),
  }, 'Projector mode (classroom)');

  const panel = el('div', { class: 'iw-pop settings-pop', id: 'settings-pop', role: 'dialog', 'aria-label': 'Reading settings' },
    el('p', { class: 'pop-h' }, 'Reading profiles'),
    el('div', { class: 'seg', role: 'group', 'aria-label': 'Reading profiles' }, profileBtns),
    el('p', { class: 'pop-h' }, 'Typeface'),
    el('div', { class: 'seg', role: 'group', 'aria-label': 'Typeface' }, faceBtns),
    el('p', { class: 'pop-h' }, 'Text size'),
    el('div', { class: 'seg', role: 'group', 'aria-label': 'Text size' }, sizeBtns),
    el('p', { class: 'pop-h' }, 'Line spacing'),
    el('div', { class: 'seg', role: 'group', 'aria-label': 'Line spacing' }, spacingBtns),
    el('p', { class: 'pop-h' }, 'Line length'),
    el('div', { class: 'seg', role: 'group', 'aria-label': 'Line length' }, widthBtns),
    el('p', { class: 'pop-h' }, 'Colours'),
    el('div', { class: 'seg seg-th', role: 'group', 'aria-label': 'Colour theme' }, themeBtns),
    el('p', { class: 'pop-h' }, 'Motion, sound & display'),
    el('div', { class: 'seg seg-stack', role: 'group', 'aria-label': 'Motion, sound and display' }, stillToggle, soundToggle, projToggle),
    App.store.available ? null : el('p', { class: 'pop-note' }, 'This browser is not saving settings, so they will reset next time.'),
  );
  if (supportsPopover) panel.setAttribute('popover', 'auto');
  document.body.append(panel);

  const stillBtn = App.tool({
    id: 'still',
    label: 'Still',
    icon: ICON_STILL,
    order: 85,
    title: 'Still mode: freeze all ambient motion and transitions',
    onClick: () => save({ still: !state.still }),
  });

  function sync() {
    profileBtns.forEach((b, i) => {
      const p = PROFILES[i][2];
      const match = state.face === p.face && state.size === p.size && state.spacing === p.spacing && state.width === p.width && state.theme === p.theme;
      b.setAttribute('aria-pressed', String(match));
    });
    faceBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(FACES[i][0] === state.face)));
    sizeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === state.size)));
    spacingBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(SPACINGS[i][0] === state.spacing)));
    widthBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(WIDTHS[i][0] === state.width)));
    themeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(THEMES[i][0] === state.theme)));
    stillToggle.setAttribute('aria-pressed', String(!!state.still));
    soundToggle.setAttribute('aria-pressed', String(!!state.sound));
    projToggle.setAttribute('aria-pressed', String(!!state.projector));
    if (stillBtn) {
      stillBtn.setAttribute('aria-pressed', String(!!state.still));
      stillBtn.title = state.still ? 'Still mode is on (tap to allow motion)' : 'Still mode: freeze all ambient motion and transitions';
    }
  }
  function save(patch) {
    const prevStill = state.still;
    const s = Object.assign(App.store.get('settings', {}), patch);
    App.store.set('settings', s);
    state = apply();
    sync();
    App.emit('settings:change', state);
    if (prevStill !== state.still) {
      App.emit('still:change', state.still);
      try { window.dispatchEvent(new CustomEvent('still:change', { detail: { still: state.still } })); } catch (e) {}
    }
  }
  window.__applyKymBioSettings = save;
  sync();

  let open = false;
  function toggle(force) {
    const want = force == null ? !isOpen() : force;
    if (supportsPopover) { try { want ? panel.showPopover() : panel.hidePopover(); } catch (e) {} }
    else { panel.classList.toggle('open', want); open = want; }
    btn.setAttribute('aria-expanded', String(want));
    if (want) (panel.querySelector('[aria-pressed="true"]') || sizeBtns[1]).focus();
  }
  function isOpen() { return supportsPopover ? panel.matches(':popover-open') : open; }
  if (supportsPopover) panel.addEventListener('toggle', e => {
    btn.setAttribute('aria-expanded', String(e.newState === 'open'));
    if (e.newState === 'open') (panel.querySelector('[aria-pressed="true"]') || sizeBtns[1]).focus();
  });
  else {
    document.addEventListener('click', e => { if (open && !panel.contains(e.target) && !btn.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', e => { if (open && e.key === 'Escape') { toggle(false); btn.focus(); } });
  }

  const btn = App.tool({ id: 'settings', label: 'Text', icon: ICON, order: 90, title: 'Reading settings: text size and colours',
    onClick: e => { if (!supportsPopover) { e.stopPropagation(); toggle(); } } });
  if (btn && supportsPopover) btn.popoverTargetElement = panel;
  if (btn) { btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'settings-pop'); }

  // follow the OS theme live when on Auto
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (mq && mq.addEventListener) mq.addEventListener('change', () => { state = apply(); });
});
