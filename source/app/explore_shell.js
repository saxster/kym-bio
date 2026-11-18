// The shell every explorer page shares: a Bioluminescent Deep-Cell Confocal Observatory preview card
// (Option D synthesis) paired with the "Open" button. The heavy 3D/WebGL chunk loads only on tap,
// keeping initial chunk loads at zero and WebGL context lifecycle bounded.
import App from './core.js';

const { el } = App;
const ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.2 L15.5 10 L6.5 15.8 Z" fill="currentColor"/></svg>';

const CONFOCAL_PREVIEWS = {
  cell: {
    kicker: 'CONFOCAL FLUORESCENCE PREVIEW · ANIMAL · PALISADE LEAF · BACTERIUM',
    caption: 'Slice open three cellular architectures at 1 µm resolution. Compare DAPI-stained nuclear DNA, GFP chloroplasts, and MitoTracker cristae.',
    svg: `<svg class="explore-preview-svg" viewBox="0 0 760 220" role="img" aria-label="Preview of the 3D Cell Explorer showing animal, plant and bacterial cutaways">
      <rect x="0" y="0" width="760" height="220" rx="12" fill="#07111A"/>
      <g transform="translate(135,112)">
        <ellipse cx="0" cy="0" rx="92" ry="68" fill="#0F292E" stroke="#34D399" stroke-width="2.5"/>
        <circle cx="-22" cy="-6" r="28" fill="#3B1234" stroke="#F472B6" stroke-width="2.2"/>
        <circle cx="-26" cy="-10" r="9" fill="#EC4899"/>
        <rect x="24" y="-26" width="36" height="18" rx="9" fill="#7C2D12" stroke="#FDBA74" stroke-width="1.8"/>
        <path d="M30,-21 L35,-12 L40,-21 L45,-12 L50,-21" fill="none" stroke="#FED7AA" stroke-width="1.5"/>
        <text x="0" y="88" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" fill="#6EE7B7">Animal Cell (~20 µm)</text>
      </g>
      <g transform="translate(385,112)">
        <rect x="-98" y="-68" width="196" height="136" rx="14" fill="#0A2E23" stroke="#4ADE80" stroke-width="3.2"/>
        <rect x="-46" y="-44" width="104" height="86" rx="16" fill="#082F49" stroke="#38BDF8" stroke-width="2"/>
        <text x="6" y="4" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" fill="#BAE6FD">Turgid Sap Vacuole</text>
        <rect x="-82" y="-42" width="26" height="16" rx="8" fill="#065F46" stroke="#86EFAC" stroke-width="1.8"/>
        <rect x="-82" y="-18" width="26" height="16" rx="8" fill="#065F46" stroke="#86EFAC" stroke-width="1.8"/>
        <circle cx="-68" cy="36" r="16" fill="#3B1234" stroke="#F472B6" stroke-width="1.8"/>
        <text x="0" y="88" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" fill="#86EFAC">Palisade Leaf (~60 µm)</text>
      </g>
      <g transform="translate(625,112)">
        <rect x="-78" y="-42" width="156" height="84" rx="42" fill="#0F172A" stroke="#38BDF8" stroke-width="2.8"/>
        <path d="M-42,-4 C-48,-22 -6,-22 4,-4 C14,14 -32,18 -42,-4 Z" fill="none" stroke="#FB7185" stroke-width="2.2"/>
        <circle cx="36" cy="-6" r="10" fill="none" stroke="#FBBF24" stroke-width="2"/>
        <text x="0" y="88" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" fill="#7DD3FC">Bacterium (~2 µm · 10× Zoom)</text>
      </g>
    </svg>`,
  },
  code: {
    kicker: 'MOLECULAR CONFOCAL PREVIEW · B-DNA HELIX · RIBOSOME · FOLDED BETA-GLOBIN',
    caption: 'Follow the central dogma from a 2.0 nm twisted ladder through three-letter mRNA codons to a folded 3D protein—and test a single-base Codon 6 mutation.',
    svg: `<svg class="explore-preview-svg" viewBox="0 0 760 210" role="img" aria-label="Preview of the 3D DNA to Protein Explorer">
      <rect x="0" y="0" width="760" height="210" rx="12" fill="#07111A"/>
      <path d="M48,74 C108,18 168,154 228,98 C288,42 348,154 408,98" fill="none" stroke="#38BDF8" stroke-width="3.5"/>
      <path d="M48,118 C108,174 168,38 228,94 C288,150 348,38 408,94" fill="none" stroke="#FB7185" stroke-width="3.5"/>
      <line x1="88" y1="62" x2="88" y2="130" stroke="#34D399" stroke-width="2.5"/>
      <line x1="138" y1="74" x2="138" y2="118" stroke="#FBBF24" stroke-width="2.5"/>
      <line x1="188" y1="68" x2="188" y2="124" stroke="#34D399" stroke-width="2.5"/>
      <line x1="278" y1="66" x2="278" y2="126" stroke="#FBBF24" stroke-width="2.5"/>
      <line x1="338" y1="68" x2="338" y2="124" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="458" y="38" width="268" height="128" rx="12" fill="#0F1E2E" stroke="#10B981" stroke-width="1.8"/>
      <text x="592" y="68" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11.5" font-weight="bold" fill="#6EE7B7">CODON 6: 5'-GAG-3' → 5'-GUG-3'</text>
      <text x="592" y="96" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#F8FAFC">Glutamate (Hydrophilic) → Valine</text>
      <text x="592" y="122" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10.5" fill="#7DD3FC">3.4 nm Pitch · 0.34 nm Step · 64 Triplets</text>
      <text x="228" y="184" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">Antiparallel B-DNA Double Helix (A=T · C≡G)</text>
    </svg>`,
  },
};

export function explorerShell(name, { label } = {}) {
  App.ready(() => {
    const mount = document.querySelector(`[data-mount="${name}"]`);
    if (!mount) return;
    const title = mount.dataset.title || name;
    const chunk = mount.dataset.chunk || 'x_' + name;
    mount.querySelector('.noscript')?.remove();
    const btnLabel = label || `Open ${title}`;
    const btn = el('button', { type: 'button', class: 'live-open explore-open', html: ICON + `<span>${btnLabel}</span>` });
    const msg = el('p', { class: 'live-note', role: 'status' });
    const stage = el('div', { class: 'explore-stage', hidden: true });
    let preview, dispose;
    const close = () => {
      if (typeof dispose === 'function') dispose();
      dispose = null;
      stage.replaceChildren(); stage.hidden = true; btn.hidden = false;
      if (preview) preview.hidden = false;
      btn.focus();
    };
    if (name === 'scale') {
      preview = el('figure', { class: 'scale-preview explore-preview-card' },
        el('img', { src: window.BOOK_SCALE_ART, width: 1536, height: 1024, loading: 'lazy', alt: 'An illustrated Mumbai neighbourhood with a room at its centre.' }),
        el('figcaption', {}, 'A room. A street. A world. Begin with one metre and see what surrounds it.'));
      mount.append(preview);
    } else if (CONFOCAL_PREVIEWS[name]) {
      const spec = CONFOCAL_PREVIEWS[name];
      preview = el('figure', { class: 'explore-preview-card', html:
        `<div class="explore-preview-kicker">${spec.kicker}</div>` +
        spec.svg +
        `<figcaption>${spec.caption}</figcaption>`
      });
      mount.append(preview);
    }
    mount.append(btn, msg, stage);
    btn.addEventListener('click', async () => {
      msg.classList.remove('live-warn');
      mount.setAttribute('aria-busy', 'true');
      btn.disabled = true; btn.querySelector('span').textContent = 'Opening…'; msg.textContent = '';
      try {
        const impl = await App.loadExplorer(name, chunk);
        stage.hidden = false; btn.hidden = true;
        if (preview) preview.hidden = true;
        dispose = await impl.mount(stage, { title, close });
        App.emit('explore:open', { name });
      } catch (e) {
        close();
        msg.textContent = location.protocol === 'file:'
          ? 'This explorer loads from the web. Open the book from its website (or a local server) to use it.'
          : 'This explorer could not load. Check the connection and try again.';
        msg.classList.add('live-warn');
      } finally {
        mount.removeAttribute('aria-busy');
        btn.disabled = false; btn.querySelector('span').textContent = btnLabel;
        if (msg.classList.contains('live-warn')) btn.focus();
      }
    });
  });
}
