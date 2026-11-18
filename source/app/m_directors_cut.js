// Director's Cut Edition:
// - 32 Museum-Grade Archival Plates & Real Specimen Micrographs (Hooke, Leeuwenhoek, Goodsell,
//   Ramachandran, Grew, Beaumont, Harvey, Cajal, Franklin's Photo 51, Flemming, Mendel, Darwin,
//   Gould, CRISPR-Cas9, and SEM/TEM/Confocal micrographs) with interactive callout pins & loupe zoom.
// - 32 "In the Master's Words" Science Writing & Primary Literature cards (Primo Levi, Bill Bryson,
//   Ed Yong, Siddhartha Mukherjee, E. O. Wilson, J. B. S. Haldane, Santiago Ramón y Cajal,
//   Eric Kandel, Nick Lane, Lewis Thomas, Richard Feynman, Paul de Kruif, Erwin Schrödinger,
//   Max Perutz, William Harvey, Claude Bernard, Watson/Crick/Franklin, Mendel, Darwin,
//   Jonathan Weiner, Salim Ali, David Quammen, and Jennifer Doudna — zero Oliver Sacks).
// - Full-book "Cabinet of Curiosities & Masterworks" modal browser + Private Bookshelf passage slot.
import App from './core.js';

const ICON_CABINET = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="3" width="15" height="14" rx="2"/><path d="M2.5 8.5h15M10 3v14"/><circle cx="7" cy="5.8" r=".8" fill="currentColor"/><circle cx="13" cy="5.8" r=".8" fill="currentColor"/></svg>';

function sid(sec) {
  return 's' + String(sec).replace('.', '-');
}

function applyDirectorsCutAttr() {
  const s = App.store.get('settings', {});
  const on = s.directorsCut !== false; // Enabled by default for Kym's Private Director's Cut
  document.documentElement.setAttribute('data-directors-cut', on ? '1' : '0');
  return on;
}
applyDirectorsCutAttr();

function buildPlateCard(el, plate, chNum, openCabinet) {
  const pins = Array.isArray(plate.pins) ? plate.pins : [];
  let activeIdx = 0;

  const trayTitle = el('b', {}, pins[0] ? `Pin 1 · ${pins[0].label}:` : 'Specimen note:');
  const trayText = el('span', {}, pins[0] ? pins[0].detail : plate.summary);
  const tray = el('div', { class: 'dc-pin-tray', role: 'status', 'aria-live': 'polite' }, trayTitle, trayText);

  const img = el('img', {
    src: plate.image,
    alt: `${plate.title} — ${plate.summary}`,
    loading: 'lazy',
    decoding: 'async',
    width: '960',
    height: '620',
  });

  const stage = el('div', { class: 'dc-plate-stage' }, img);
  const pinBtns = pins.map((p, idx) => {
    const btn = el('button', {
      type: 'button',
      class: 'dc-pin',
      style: `left:${p.x}%;top:${p.y}%`,
      'aria-label': `Inspect pin ${idx + 1}: ${p.label}`,
      'aria-pressed': String(idx === activeIdx),
      onclick: e => {
        e.stopPropagation();
        activeIdx = idx;
        pinBtns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === idx)));
        trayTitle.textContent = `Pin ${idx + 1} · ${p.label}:`;
        trayText.textContent = p.detail;
      },
    }, String(idx + 1));
    stage.append(btn);
    return btn;
  });

  let zoomed = false;
  const zoomBtn = el('button', {
    type: 'button',
    class: 'dc-btn',
    'aria-pressed': 'false',
    onclick: () => {
      zoomed = !zoomed;
      stage.classList.toggle('is-zoomed', zoomed);
      zoomBtn.setAttribute('aria-pressed', String(zoomed));
      zoomBtn.textContent = zoomed ? 'Reset Loupe (1×)' : 'Magnify Plate (1.65×)';
    },
  }, 'Magnify Plate (1.65×)');

  stage.addEventListener('pointermove', e => {
    if (!zoomed) return;
    const r = stage.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - r.left) / Math.max(1, r.width)) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - r.top) / Math.max(1, r.height)) * 100));
    stage.style.setProperty('--zoom-x', `${x.toFixed(1)}%`);
    stage.style.setProperty('--zoom-y', `${y.toFixed(1)}%`);
  });

  const cabinetBtn = el('button', {
    type: 'button',
    class: 'dc-btn',
    onclick: () => openCabinet('plates', chNum),
  }, 'Open Full Cabinet');

  return el('div', {
    class: 'dc-plate-card',
    id: `dc-plate-${plate.id}`,
    'data-mode': plate.mode || 'archival',
    'data-chapter': String(chNum),
  },
    el('div', { class: 'dc-plate-header' },
      el('span', { class: 'dc-plate-eyebrow' }, plate.eyebrow || `Chapter ${chNum} Archival Plate`),
      el('span', { class: 'dc-plate-scale' }, plate.scale || 'Primary Specimen')
    ),
    el('h4', { class: 'dc-plate-title' }, plate.title),
    el('p', { class: 'dc-plate-summary' }, plate.summary),
    stage,
    pins.length ? tray : null,
    el('div', { class: 'dc-plate-controls' },
      el('div', { class: 'dc-plate-btns' }, zoomBtn, cabinetBtn),
      el('span', { class: 'dc-plate-credit' }, plate.credit || '')
    )
  );
}

function buildReadingCard(el, reading, chNum, openCabinet) {
  const customKey = `dc:custom:${reading.id}`;
  const savedCustom = App.store.get(customKey, '');

  const customDisplay = el('div', {
    class: 'dc-custom-passage',
    hidden: !savedCustom,
  }, savedCustom || '');

  const textarea = el('textarea', {
    placeholder: `Paste an extended passage or personal note from ${reading.author}'s "${reading.work}" for Kym's private copy…`,
    value: savedCustom || '',
  });

  const saveCustomBtn = el('button', {
    type: 'button',
    class: 'dc-btn',
    onclick: () => {
      const val = textarea.value.trim();
      App.store.set(customKey, val);
      customDisplay.textContent = val;
      customDisplay.hidden = !val;
      editorWrap.hidden = true;
      toggleEditBtn.setAttribute('aria-pressed', 'false');
    },
  }, 'Save to Kym’s Copy');

  const editorWrap = el('div', { class: 'dc-custom-editor', hidden: true }, textarea, el('div', {}, saveCustomBtn));

  const toggleEditBtn = el('button', {
    type: 'button',
    class: 'dc-btn',
    'aria-pressed': 'false',
    onclick: () => {
      const next = editorWrap.hidden;
      editorWrap.hidden = !next;
      toggleEditBtn.setAttribute('aria-pressed', String(next));
      if (next) textarea.focus();
    },
  }, savedCustom ? 'Edit Private Bookshelf Excerpt' : '+ Add Full Bookshelf Passage');

  const openAnthologyBtn = el('button', {
    type: 'button',
    class: 'dc-btn',
    onclick: () => openCabinet('readings', chNum),
  }, 'Browse All 32 Masterworks');

  return el('section', {
    class: 'dc-master-card',
    id: `dc-read-${reading.id}`,
    'data-chapter': String(chNum),
    'aria-label': `In the Master's Words: ${reading.author}`,
  },
    el('div', { class: 'dc-master-top' },
      el('span', { class: 'dc-master-badge' }, reading.badge || "In the Master's Words"),
      el('span', { class: 'dc-plate-scale' }, `Ch. ${chNum} · ${reading.year}`)
    ),
    el('h4', { class: 'dc-master-cite' },
      `${reading.author} — `,
      el('span', {}, `${reading.work} (${reading.year})`)
    ),
    el('blockquote', { class: 'dc-master-quote' }, `“${reading.epigraph}”`),
    el('div', { class: 'dc-master-notes' },
      el('div', { class: 'dc-master-note-row' },
        el('strong', {}, 'Why This Matters for Your Mental Model'),
        reading.whyItMatters
      ),
      el('div', { class: 'dc-master-note-row' },
        el('strong', {}, 'Science Writing & Mechanism Craft'),
        reading.craftNote
      )
    ),
    customDisplay,
    editorWrap,
    el('div', { class: 'dc-master-actions' },
      el('div', { class: 'dc-plate-btns' }, toggleEditBtn, openAnthologyBtn)
    )
  );
}

App.ready(() => {
  const { el } = App;
  let catalog = window.BOOK_DIRECTORS_CUT || null;
  let dialog = null;
  let filterKind = 'all';
  let filterVol = 0;

  function volumeOf(ch) {
    if (ch <= 3) return 1;
    if (ch <= 6) return 2;
    if (ch <= 10) return 3;
    return 4;
  }

  function ensureCabinetDialog() {
    if (dialog) return dialog;
    const bodyGrid = el('div', { class: 'dc-cabinet-body' });

    function renderGrid() {
      bodyGrid.innerHTML = '';
      if (!catalog || !Array.isArray(catalog.chapters)) return;
      for (const chObj of catalog.chapters) {
        const ch = chObj.chapter;
        if (filterVol && volumeOf(ch) !== filterVol) continue;
        if (filterKind === 'all' || filterKind === 'plates') {
          for (const p of (chObj.plates || [])) {
            bodyGrid.append(el('article', { class: 'dc-cabinet-tile' },
              el('span', { class: 'dc-plate-eyebrow' }, `Ch. ${ch} · ${p.eyebrow}`),
              el('img', { src: p.image, alt: p.title, loading: 'lazy' }),
              el('h3', {}, p.title),
              el('p', {}, p.summary),
              el('button', {
                type: 'button',
                class: 'dc-btn',
                onclick: () => {
                  dialog.close();
                  location.hash = `#dc-plate-${p.id}`;
                },
              }, `Jump to Chapter ${ch} (§${p.targetSec})`)
            ));
          }
        }
        if (filterKind === 'all' || filterKind === 'readings') {
          for (const r of (chObj.readings || [])) {
            bodyGrid.append(el('article', { class: 'dc-cabinet-tile' },
              el('span', { class: 'dc-master-badge' }, `Ch. ${ch} · ${r.author} (${r.year})`),
              el('h3', {}, r.work),
              el('p', { style: 'font-style:italic' }, `“${r.epigraph}”`),
              el('p', {}, r.whyItMatters),
              el('button', {
                type: 'button',
                class: 'dc-btn',
                onclick: () => {
                  dialog.close();
                  location.hash = `#dc-read-${r.id}`;
                },
              }, `Read in Chapter ${ch} (§${r.targetSec})`)
            ));
          }
        }
      }
    }

    const filterBtns = [
      ['all', 'All 64 Treasures'],
      ['plates', '32 Archival Plates & Micrographs'],
      ['readings', '32 Master’s Voice Readings'],
    ].map(([k, label]) => el('button', {
      type: 'button',
      class: 'dc-btn',
      'aria-pressed': String(k === filterKind),
      onclick: () => {
        filterKind = k;
        updateFilterButtons();
        renderGrid();
      },
    }, label));

    const volBtns = [
      [0, 'All Volumes'],
      [1, 'Vol I (Ch 0–3)'],
      [2, 'Vol II (Ch 4–6)'],
      [3, 'Vol III (Ch 7–10)'],
      [4, 'Vol IV (Ch 11–15)'],
    ].map(([v, label]) => el('button', {
      type: 'button',
      class: 'dc-btn',
      'aria-pressed': String(v === filterVol),
      onclick: () => {
        filterVol = v;
        updateFilterButtons();
        renderGrid();
      },
    }, label));

    function updateFilterButtons() {
      ['all', 'plates', 'readings'].forEach((k, i) => filterBtns[i].setAttribute('aria-pressed', String(k === filterKind)));
      [0, 1, 2, 3, 4].forEach((v, i) => volBtns[i].setAttribute('aria-pressed', String(v === filterVol)));
    }

    const closeBtn = el('button', {
      type: 'button',
      class: 'dc-btn',
      onclick: () => dialog.close(),
    }, 'Close (Esc)');

    dialog = el('dialog', { class: 'dc-cabinet-dialog', 'aria-label': "Kym's Director's Cut Cabinet of Curiosities" },
      el('div', { class: 'dc-cabinet-shell' },
        el('div', { class: 'dc-cabinet-head' },
          el('div', {},
            el('h2', {}, 'Director’s Cut · Cabinet of Curiosities & Masterworks'),
            el('p', { class: 'dc-cabinet-sub' }, '32 Primary Historical Plates & Micrographs + 32 Great Science Writing Readings Across Chapters 0–15')
          ),
          closeBtn
        ),
        el('div', { class: 'dc-cabinet-filters' }, ...filterBtns, ...volBtns),
        bodyGrid
      )
    );
    dialog.addEventListener('click', e => {
      if (e.target === dialog) dialog.close();
    });
    dialog.__render = (kind) => {
      if (kind) filterKind = kind;
      updateFilterButtons();
      renderGrid();
    };
    document.body.append(dialog);
    return dialog;
  }

  function openCabinet(kind = 'all') {
    const dlg = ensureCabinetDialog();
    dlg.__render(kind);
    if (typeof dlg.showModal === 'function') {
      try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
    } else {
      dlg.setAttribute('open', '');
    }
  }

  window.__openDirectorsCutCabinet = openCabinet;

  // Register toolbar button
  App.tool({
    id: 'cabinet',
    label: 'Cabinet',
    icon: ICON_CABINET,
    order: 75,
    title: "Director's Cut: 32 Archival Plates & 32 Science Writing Masterworks",
    onClick: () => openCabinet('all'),
  });

  // Add toggle inside the Settings popover if present
  const settingsPop = document.getElementById('settings-pop');
  if (settingsPop) {
    const stack = settingsPop.querySelector('.seg-stack');
    if (stack) {
      const dcBtn = el('button', {
        type: 'button',
        class: 'seg-b seg-wide',
        'aria-pressed': String(applyDirectorsCutAttr()),
        onclick: () => {
          const s = App.store.get('settings', {});
          const next = s.directorsCut === false;
          s.directorsCut = next;
          App.store.set('settings', s);
          dcBtn.setAttribute('aria-pressed', String(applyDirectorsCutAttr()));
        },
      }, "Director’s Cut (32 Plates & 32 Readings)");
      stack.append(dcBtn);
    }
  }

  function mountCatalog(data) {
    if (!data || !Array.isArray(data.chapters)) return;
    catalog = data;
    for (const chObj of data.chapters) {
      const ch = chObj.chapter;
      for (const plate of (chObj.plates || [])) {
        if (document.getElementById(`dc-plate-${plate.id}`)) continue;
        const secEl = document.getElementById(sid(plate.targetSec)) || document.querySelector(`#ch${ch} .sec`);
        if (!secEl) continue;
        const card = buildPlateCard(el, plate, ch, openCabinet);
        const anchorFig = secEl.querySelector('figure');
        if (anchorFig && anchorFig.nextSibling) {
          secEl.insertBefore(card, anchorFig.nextSibling);
        } else {
          secEl.append(card);
        }
      }
      for (const reading of (chObj.readings || [])) {
        if (document.getElementById(`dc-read-${reading.id}`)) continue;
        const secEl = document.getElementById(sid(reading.targetSec)) || document.querySelector(`#ch${ch} .sec`);
        if (!secEl) continue;
        const card = buildReadingCard(el, reading, ch, openCabinet);
        secEl.append(card);
      }
    }
  }

  if (catalog) {
    mountCatalog(catalog);
  } else {
    fetch('assets/plates/directors_cut.json')
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (data) mountCatalog(data); })
      .catch(() => {});
  }
});
