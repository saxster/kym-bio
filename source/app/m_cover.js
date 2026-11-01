// The cover's chapter milestone tiles: every tile can be hovered, focused and tapped.
// Tapping opens a card showing the chapter's big question, key biological insight, people, and direct links.
import App from './core.js';

const el = App.el;

const CHAPTER_TILES = [
  { ch: 0, sym: 'M=I/A', title: 'The detective’s lens', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'How do you prove an invisible world is there without lying to yourself?',
    how: 'Controlled jars and flasks tested whether organisms came from contamination under the conditions studied. Microscopes made the tiny organisms themselves visible.',
    who: 'Redi, Leeuwenhoek & Pasteur · 1668–1859', story: 'p-leeuwenhoek', explore: '#explore-scale', exploreLabel: 'Open Powers of Ten' },
  { ch: 1, sym: 'ATP', title: 'The seed and the flame', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'Why does a fire eat, grow and die—yet isn’t alive, while a dry moong seed in your cupboard is?',
    how: 'A flame releases heat and light. A living seed can couple fuel reactions to ATP supply, maintenance and growth, using inherited instructions and cellular machinery.',
    who: 'Yellapragada SubbaRow, Fiske & Lohmann · 1929', story: 'p-subbarow', explore: '#explore-cell', exploreLabel: 'Open 3D Cell Explorer' },
  { ch: 2, sym: '20 µm', title: 'The nanotech city', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'How can a hundred trillion parts build a self-repairing city without a boss?',
    how: 'Cells use membranes to control their boundaries and ribosomes to make proteins. Nuclei, mitochondria and chloroplasts belong to particular cell types, rather than every cell.',
    who: 'Hooke, Schleiden, Schwann, Virchow & Margulis · 1665–1967', story: 'p-leeuwenhoek', explore: '#explore-cell', exploreLabel: 'Open 3D Cell Explorer' },
  { ch: 3, sym: 'ΔΨ', title: 'The border guards', vol: 'Volume I · The scene of the crime & the nanotech city',
    q: 'Why does salted mango lose water, and how does a freshwater cell manage incoming water?',
    how: 'Random molecular motion underlies diffusion. Water-potential differences help explain net water movement; transport proteins can couple an energy source to movement against a gradient.',
    who: 'Pfeffer, Overton & Gorter · 1877–1925', story: 'p-bose', explore: '#explore-cell', exploreLabel: 'Open 3D Cell Explorer' },
  { ch: 4, sym: 'E+S', title: 'Carbon’s Lego set & molecular locks', vol: 'Volume II · The molecular locks & the energy heist',
    q: 'How does your body run chemical reactions at 37 °C that would need a roaring laboratory furnace?',
    how: 'Most enzymes are folded proteins whose active sites help speed particular reactions. Changes in pH can alter charges and activity; excessive heat can disrupt the fold.',
    who: 'Payen, Buchner, Sumner & Kamala Sohonie · 1833–1939', story: 'p-subbarow', explore: null },
  { ch: 5, sym: '6CO₂', title: 'The green heist', vol: 'Volume II · The molecular locks & the energy heist',
    q: 'A 10-tonne banyan tree grows from a tiny seed. Where did all that solid wood come from?',
    how: 'Trees incorporate carbon from carbon dioxide into carbohydrates. Light reactions release oxygen from water and supply ATP and an electron carrier that support carbon fixation.',
    who: 'Van Helmont, Ingenhousz & J. C. Bose · 1648–1924', story: 'p-helmont', explore: null },
  { ch: 6, sym: 'ADP → ATP', title: 'Burning sugar in the dark', vol: 'Volume II · The molecular locks & the energy heist',
    q: 'Why can idli batter rise as oxygen becomes limited in a warm Mumbai kitchen?',
    how: 'Trapped microbial gas can expand batter. Fuel reactions supply electrons to a membrane relay that can support ATP formation. Fermentation recycles carriers so glycolysis can continue; total ATP yield depends on conditions.',
    who: 'Lavoisier, Krebs, Mitchell & SubbaRow · 1780–1961', story: 'p-subbarow', explore: null },
  { ch: 7, sym: 'pH 2', title: 'The disassembly line', vol: 'Volume III · The human orchestra',
    q: 'Why doesn’t your stomach digest itself?',
    how: 'Movement mixes food, bile disperses fat droplets, and enzymes break down digestible molecules. A maintained mucus–bicarbonate barrier, cell junctions and repair help protect the stomach wall. Small products cross the intestinal boundary: glucose and amino acids reach blood, while rebuilt long-chain fats first travel in lymph.',
    who: 'Beaumont, Pavlov & Kamala Sohonie · 1822–1950', story: 'p-subbarow', explore: null },
  { ch: 8, sym: '4 O₂', title: 'The twin pumps', vol: 'Volume III · The human orchestra',
    q: 'How do breathing, exchange surfaces and circulation deliver oxygen to working cells and carry carbon dioxide away?',
    how: 'In the human double circulation, the right heart sends blood to the lungs and the left sends it around the body. Exchange across thin surfaces connects ventilation, blood transport and cells.',
    who: 'Ibn al-Nafis, William Harvey & J. C. Bose · 1242–1927', story: 'p-bose', explore: null },
  { ch: 9, sym: '+30 mV', title: 'Wires, sparks and chemical whispers', vol: 'Volume III · The human orchestra',
    q: 'How can your hand start withdrawing from a hot tawa before you consciously locate the pain?',
    how: 'Electrical signals regenerate along neurones. At the chemical synapses described here, neurotransmitter release changes the next cell’s activity. A spinal reflex can begin a response before conscious pain perception.',
    who: 'Galvani, Cajal, Loewi, Hodgkin & Huxley · 1780–1952', story: 'p-bose', explore: null },
  { ch: 10, sym: 'Feedback', title: 'Holding the line & the microscopic war', vol: 'Volume III · The human orchestra',
    q: 'How does your body respond when heat, a meal or water loss disturbs its internal conditions?',
    how: 'Negative feedback loops regulate temperature, water (kidneys) and blood glucose (insulin/glucagon), while white blood cells and memory lymphocytes fight pathogens.',
    who: 'Claude Bernard, Banting, Jenner & Haffkine · 1796–1922', story: 'p-pasteur', explore: null },
  { ch: 11, sym: 'A·T C·G', title: 'The twisted ladder', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How can a chemical molecule store the recipe for both a bacterium and a human being?',
    how: 'Complementary base pairing supports DNA copying. In protein-coding examples, a DNA sequence is transcribed into RNA, and ribosomes translate mRNA codons into an amino-acid sequence that can fold into a protein.',
    who: 'Franklin, Watson, Crick & Har Gobind Khorana · 1952–1968', story: 'p-ammal', explore: '#explore-code', exploreLabel: 'Open 3D DNA Explorer' },
  { ch: 12, sym: '2n → n', title: 'Splitting the city', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How does one fertilised cell produce tissues with different jobs, and how do egg and sperm receive one chromosome set?',
    how: 'DNA is copied before division. Mitosis distributes replicated chromosomes; meiosis separates homologues and then sisters. Cells can inherit similar DNA yet use different combinations of genes.',
    who: 'Walther Flemming & E. K. Janaki Ammal · 1882–1939', story: 'p-ammal', explore: '#explore-code', exploreLabel: 'Open 3D DNA Explorer' },
  { ch: 13, sym: '3 : 1', title: 'The monk’s spreadsheet', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How can two round-seeded pea parents produce a wrinkled-seeded offspring?',
    how: 'Mendel’s crosses support inheritance through discrete alternatives. In the simplified pea example, parental alleles separate into gametes, and fertilisation combines them; expected ratios describe probabilities, not guaranteed family outcomes.',
    who: 'Gregor Mendel & Barbara McClintock · 1865–1950', story: 'p-ammal', explore: null },
  { ch: 14, sym: 'Δp', title: 'The glitch engine', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'How can a resistant bacterial variant become more common during antibiotic exposure?',
    how: 'Mutation supplies new variants without foresight about which would help. Differences in survival, mating or fertility can change reproductive contribution and inherited variant frequencies over generations.',
    who: 'Darwin, Wallace, Kettlewell & Rosemary Grant · 1858–today', story: 'p-ali', explore: null },
  { ch: 15, sym: 'Energy', title: 'The web of everything', vol: 'Volume IV · The master code & the four-billion-year case file',
    q: 'Why do food webs usually support fewer large predators than the organisms supplying their food?',
    how: 'Only part of production becomes new biomass at the next trophic level. Unconsumed material, waste and respiration take other routes; atoms cycle through organisms and their surroundings while energy disperses.',
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
  // Keep popups outside the cover art's horizontal scroller on phones.
  cover.appendChild(card);
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
