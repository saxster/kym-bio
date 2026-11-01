// The cover's chapter milestone tiles: every tile can be hovered, focused and tapped.
// Tapping opens a card showing the chapter's big question, key biological insight, people, and direct links.
import App from './core.js';

const el = App.el;

const CHAPTER_TILES = [
  { ch: 0, sym: 'M=I/A', title: 'The detective’s lens', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'How do you prove an invisible world is there without lying to yourself?',
    how: 'Francesco Redi’s gauze-covered jars, Leeuwenhoek’s 0.7 mm glass bead (275×) and Pasteur’s swan-neck flasks proved that life arises from existing life.',
    who: 'Redi, Leeuwenhoek & Pasteur · 1668–1859', story: 'p-leeuwenhoek', explore: '#explore-scale', exploreLabel: 'Open Powers of Ten' },
  { ch: 1, sym: 'ATP', title: 'The seed and the flame', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'Why does a fire eat, grow and die—yet isn’t alive, while a dry moong seed in your cupboard is?',
    how: 'A flame scatters chemical energy as random heat; a living seed couples fuel oxidation to ATP springs and a four-letter DNA blueprint to build order against decay.',
    who: 'Yellapragada SubbaRow, Fiske & Lohmann · 1929', story: 'p-subbarow', explore: '#explore-cell', exploreLabel: 'Open 3D Cell Explorer' },
  { ch: 2, sym: '20 µm', title: 'The nanotech city', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'How can a hundred trillion parts build a self-repairing city without a boss?',
    how: 'Every organism is built of cells—enclosed droplets where membranes, mitochondria, ribosomes and (in plants) chloroplasts divide chemical labour.',
    who: 'Hooke, Schleiden, Schwann, Virchow & Margulis · 1665–1967', story: 'p-leeuwenhoek', explore: '#explore-cell', exploreLabel: 'Open 3D Cell Explorer' },
  { ch: 3, sym: 'ΔΨ', title: 'The border guards', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'Why does salted raw mango weep water within minutes while a freshwater amoeba never bursts?',
    how: 'Thermal motion drives diffusion and osmosis across selectively permeable membranes, while ATP-powered protein pumps haul ions uphill.',
    who: 'Pfeffer, Overton & Gorter · 1877–1925', story: 'p-bose', explore: '#explore-cell', exploreLabel: 'Open 3D Cell Explorer' },
  { ch: 4, sym: 'E+S', title: 'Carbon’s Lego set & molecular locks', vol: 'Volume II · The molecular locks & the energy heist',
    q: 'How does your body run chemical reactions at 37 °C that would need a roaring laboratory furnace?',
    how: 'Enzymes are 3D folded protein catalysts whose active sites match specific substrates—until high heat or wrong pH unfolds (denatures) the lock.',
    who: 'Payen, Buchner, Sumner & Kamala Sohonie · 1833–1939', story: 'p-subbarow', explore: null },
  { ch: 5, sym: '6CO₂', title: 'The green heist', vol: 'Volume II · The molecular locks & the energy heist',
    q: 'A 10-tonne banyan tree grows from a tiny seed. Where did all that solid wood come from?',
    how: 'Van Helmont weighed the soil and found it barely shrank; Ingenhousz and Ruben proved chloroplasts split water with sunlight and stitch CO₂ from air into sugar.',
    who: 'Van Helmont, Ingenhousz & J. C. Bose · 1648–1924', story: 'p-helmont', explore: null },
  { ch: 6, sym: '32 ATP', title: 'Burning sugar in the dark', vol: 'Volume II · The molecular locks & the energy heist',
    q: 'Why does idli batter puff up in a warm Mumbai kitchen without any oxygen?',
    how: 'All cells split glucose to recharge ATP—using oxygen in mitochondria for ~32 ATP, or fermenting anaerobically into lactic acid or CO₂ + ethanol.',
    who: 'Lavoisier, Krebs, Mitchell & SubbaRow · 1780–1961', story: 'p-subbarow', explore: null },
  { ch: 7, sym: 'pH 2', title: 'The disassembly line', vol: 'Volume III · The human orchestra',
    q: 'Why doesn’t your stomach digest itself?',
    how: 'Peristalsis, bile emulsification, and pH-tuned enzymes break giant polymers into monomers small enough to cross millions of intestinal villi into the blood.',
    who: 'Beaumont, Pavlov & Kamala Sohonie · 1822–1950', story: 'p-subbarow', explore: null },
  { ch: 8, sym: '4 O₂', title: 'The twin pumps', vol: 'Volume III · The human orchestra',
    q: 'How does oxygen reach a cell buried deep in your toe in under a minute, and how does water climb a 30-metre coconut palm?',
    how: 'In animals, a four-chambered double pump drives haemoglobin-rich red blood cells through capillaries; in plants, leaf transpiration pulls water up xylem tubes.',
    who: 'Ibn al-Nafis, William Harvey & J. C. Bose · 1242–1927', story: 'p-bose', explore: null },
  { ch: 9, sym: '+30 mV', title: 'Wires, sparks and chemical whispers', vol: 'Volume III · The human orchestra',
    q: 'How does touching a hot tawa yank your hand back BEFORE you consciously feel the pain?',
    how: 'Electrical impulses race along sensory, relay and motor neurons in a spinal reflex arc, jumping chemical synaptic gaps via neurotransmitters.',
    who: 'Galvani, Cajal, Loewi, Hodgkin & Huxley · 1780–1952', story: 'p-bose', explore: null },
  { ch: 10, sym: '37.0°C', title: 'Holding the line & the microscopic war', vol: 'Volume III · The human orchestra',
    q: 'Why does your core stay at 37.0 °C whether you are in a 40 °C May heatwave or an air-conditioned cinema?',
    how: 'Negative feedback loops regulate temperature, water (kidneys) and blood glucose (insulin/glucagon), while white blood cells and memory lymphocytes fight pathogens.',
    who: 'Claude Bernard, Banting, Jenner & Haffkine · 1796–1922', story: 'p-pasteur', explore: null },
  { ch: 11, sym: 'A=T', title: 'The twisted ladder', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How can a chemical molecule store the recipe for both a bacterium and a human being?',
    how: 'Complementary A–T and C–G base pairs on a DNA double helix are transcribed into mRNA codons and translated by ribosomes into 3D proteins.',
    who: 'Franklin, Watson, Crick & Har Gobind Khorana · 1952–1968', story: 'p-ammal', explore: '#explore-code', exploreLabel: 'Open 3D DNA Explorer' },
  { ch: 12, sym: '2n → n', title: 'Splitting the city', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How did a single fertilised cell become 30 trillion cells—all carrying the exact same DNA book?',
    how: 'Mitosis copies and divides chromosomes identically for growth and repair, while meiosis halves chromosome number (2n → n) and shuffles alleles for gametes.',
    who: 'Walther Flemming & E. K. Janaki Ammal · 1882–1939', story: 'p-ammal', explore: '#explore-code', exploreLabel: 'Open 3D DNA Explorer' },
  { ch: 13, sym: '3 : 1', title: 'The monk’s spreadsheet', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How can two brown-eyed parents have a blue-eyed child, or a trait skip an entire generation?',
    how: 'Gregor Mendel counted 28,000 pea plants in Brno and proved inheritance is particulate—pairs of dominant and recessive alleles segregate and recombine.',
    who: 'Gregor Mendel & Barbara McClintock · 1865–1950', story: 'p-ammal', explore: null },
  { ch: 14, sym: 'Δp', title: 'The glitch engine', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'Why are hospital bacteria becoming immune to antibiotics that killed their ancestors fifty years ago?',
    how: 'Random DNA mutations create heritable variation; differential survival and reproduction under environmental pressure shifts allele frequencies across generations.',
    who: 'Darwin, Wallace, Kettlewell & Rosemary Grant · 1858–today', story: 'p-ali', explore: null },
  { ch: 15, sym: '10%', title: 'The web of everything', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'Why are there thousands of spotted deer in Sanjay Gandhi National Park, but only about forty leopards?',
    how: 'Energy flows one way from sunlight through trophic levels (~90% lost as heat per step), while carbon and nitrogen atoms cycle endlessly through decomposers.',
    who: 'Lindeman, Sálim Ali & Madhav Gadgil · 1942–today', story: 'p-ali', explore: null },
];

const byCh = new Map(CHAPTER_TILES.map(t => [t.ch, t]));

App.ready(() => {
  const cover = document.querySelector('header.cover');
  const svg = cover && cover.querySelector('svg');
  if (!svg) return;
  const tiles = [...svg.querySelectorAll('g.el')];
  if (!tiles.length) return;

  svg.setAttribute('role', 'group');
  svg.classList.add('cover-live');

  const card = el('div', { class: 'cv-card', role: 'dialog', 'aria-modal': 'false', hidden: true });
  (svg.closest('figure') || svg.parentNode).appendChild(card);
  let current = null;

  tiles.forEach((g, idx) => {
    const chAttr = g.getAttribute('data-ch');
    const chNum = chAttr !== null ? parseInt(chAttr, 10) : idx;
    const item = byCh.get(chNum);
    if (!item) return;
    g.dataset.ch = chNum;
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `Chapter ${item.ch}: ${item.title}`);
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    t.textContent = `Chapter ${item.ch}: ${item.title}`;
    g.prepend(t);
    g.addEventListener('click', ev => { ev.stopPropagation(); open(g, item); });
    g.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(g, item); }
      if (ev.key === 'Escape') close();
    });
  });

  function place(g) {
    const host = card.parentNode.getBoundingClientRect();
    const r = g.getBoundingClientRect();
    const w = Math.min(340, host.width - 16);
    card.style.width = w + 'px';
    let left = r.left - host.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, host.width - w - 8));
    card.style.left = left + 'px';
    card.style.top = (r.bottom - host.top + 8) + 'px';
  }

  function open(g, item) {
    if (current) current.classList.remove('cv-sel');
    current = g; g.classList.add('cv-sel');
    card.replaceChildren(
      el('button', { type: 'button', class: 'cv-x', 'aria-label': 'Close', onclick: close }, '×'),
      el('p', { class: 'cv-top' },
        el('span', { class: 'cv-sym' }, item.sym),
        el('span', { class: 'cv-name' }, item.title, el('small', {}, `Chapter ${item.ch} · ${item.vol}`))),
      el('p', { class: 'cv-in' }, item.q),
      el('p', { class: 'cv-how' }, item.how),
      el('p', { class: 'cv-who' }, item.who),
      el('p', { class: 'cv-links' },
        el('a', { href: '#ch' + item.ch, onclick: () => close() }, `Read Chapter ${item.ch}`),
        item.story ? el('a', { class: 'sl', href: '#story-' + item.story, 'data-story': item.story, onclick: () => close() }, 'Read its story') : null,
        item.explore ? el('a', { href: item.explore, onclick: () => close() }, item.exploreLabel || 'Open explorer') : null));
    card.hidden = false;
    place(g);
    card.querySelector('.cv-x').focus({ preventScroll: true });
  }

  function close() {
    card.hidden = true;
    if (current) { current.classList.remove('cv-sel'); current.focus({ preventScroll: true }); current = null; }
  }

  document.addEventListener('click', ev => { if (!card.hidden && !card.contains(ev.target)) close(); });
  window.addEventListener('resize', () => { if (!card.hidden && current) place(current); });
});
