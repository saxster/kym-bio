// The 3D Cell & Nanocity Explorer: interactive Three.js and evidence cards comparing
// Animal Cell (~20 µm), Plant Palisade Cell (~50 µm) and Bacterial Cell (~2 µm).
import App from './core.js';
import { acquireRenderer, releaseRenderer, webglOK, clearGroup } from '../live/three_kit.js';
import {
  Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, AmbientLight,
  Group, Mesh, SphereGeometry, CylinderGeometry, TorusGeometry, BoxGeometry, MeshStandardMaterial,
  Color, Vector3, Quaternion, SRGBColorSpace,
} from 'three';

const { el } = App;

const CELLS = {
  animal: {
    name: 'Animal Cell (Human Cheek / Liver Cell)',
    size: '~20 µm across (0.02 mm)',
    kingdom: 'Eukaryote · Animalia',
    summary: 'Flexible plasma membrane with no rigid wall; packed with mitochondria and ribosomes around a membrane-bound nucleus.',
    organelles: [
      { id: 'nucleus', name: 'Nucleus & DNA', size: '~6 µm diameter', color: '#b8432f', present: 'Animal ✓ · Plant ✓ · Bacteria ✗ (nucleoid)',
        job: 'Holds linear chromosomes of DNA wrapped around histone proteins; DNA is transcribed into RNA inside the nucleus, and RNA messages exit through nuclear pores.',
        howWeKnow: 'Robert Brown named it in orchid cells (1831); fluorescent DAPI dye stains its DNA bright blue.' },
      { id: 'mito', name: 'Mitochondria (ATP Powerhouses)', size: '~1–2 µm long', color: '#b07818', present: 'Animal ✓ · Plant ✓ · Bacteria ✗',
        job: 'Carries out important stages of aerobic respiration: reactions use chemical energy from nutrients to supply ATP. Its folded inner membrane provides reaction surface; glycolysis occurs in the cytoplasm.',
        howWeKnow: 'Lynn Margulis brought evidence for bacterial ancestry together in 1967. Mitochondrial DNA, bacterial-related ribosomes and comparative gene sequences support that ancestry; human mitochondrial ribosomes differ from bacterial ribosomes.' },
      { id: 'membrane', name: 'Cell Membrane (Phospholipid Bilayer)', size: '~7.5 nm thick', color: '#2f6d8f', present: 'Animal ✓ · Plant ✓ · Bacteria ✓',
        job: 'Selectively permeable lipid double layer studded with protein channels and ATP-driven ion pumps that guard what enters and leaves.',
        howWeKnow: 'Gorter & Grendel (1925) extracted lipids from red blood cells and found the lipid sheet had exactly twice the surface area of the cells.' },
      { id: 'ribosome', name: 'Ribosomes (80S Protein Printers)', size: '~25 nm across', color: '#2e6f4e', present: 'Animal ✓ (80S) · Plant ✓ (80S) · Bacteria ✓ (70S)',
        job: 'Reads mRNA codons three letters at a time and stitches amino acids into folded 3D enzymes and structural proteins.',
        howWeKnow: 'George Palade discovered them by electron microscopy (1955); Venki Ramakrishnan solved their atomic structure by X-ray crystallography.' },
      { id: 'cytoplasm', name: 'Cytoplasm (70% Water Gel)', size: 'Fills cell volume', color: '#5d6c66', present: 'Animal ✓ · Plant ✓ · Bacteria ✓',
        job: 'Crowded aqueous solution where glycolysis and thousands of enzyme-catalysed metabolic pathways occur by thermal collision.',
        howWeKnow: 'Fluorescence recovery after photobleaching (FRAP) tracks how fast tagged proteins diffuse through living cytoplasm.' },
    ],
  },
  plant: {
    name: 'Plant Cell (Leaf Palisade Mesophyll Cell)',
    size: '~50 µm long × 20 µm wide',
    kingdom: 'Eukaryote · Plantae',
    summary: 'Armoured in a tough cellulose cell wall, inflated by a central sap vacuole, and powered by both green chloroplasts AND mitochondria.',
    organelles: [
      { id: 'chloroplast', name: 'Chloroplasts (Solar Sugar Factories)', size: '~5 µm long', color: '#2e6f4e', present: 'Animal ✗ · Plant (green parts) ✓ · Bacteria ✗',
        job: 'Stacks green chlorophyll in thylakoid discs to split H₂O with sunlight, release O₂, and stitch CO₂ into glucose (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂).',
        howWeKnow: 'Engelmann (1882) shone a prism on Spirogyra algae and watched oxygen-loving bacteria crowd around the red and blue wavelengths.' },
      { id: 'vacuole', name: 'Large Permanent Vacuole', size: 'Up to 80% of cell volume', color: '#2f6d8f', present: 'Typical animal cell: no large sap vacuole · Plant ✓ · Typical bacterium shown: absent; some bacteria have other large vacuoles',
        job: 'Filled with cell sap (sugars, salts, water); draws water in by osmosis to push outward against the cell wall, creating crisp turgor pressure.',
        howWeKnow: 'Placing a plant leaf in concentrated salt solution pulls water out of the vacuole, visibly shrinking the protoplast away from the wall (plasmolysis).' },
      { id: 'wall', name: 'Cellulose Cell Wall', size: '~0.1–1 µm thick', color: '#8a7a5a', present: 'Animal ✗ · Plant ✓ (cellulose) · Bacteria ✓ (peptidoglycan)',
        job: 'Freely permeable criss-cross mesh of tough β-glucose cellulose fibres that prevents the cell from bursting when water rushes in by osmosis.',
        howWeKnow: 'Robert Hooke saw these empty cork walls in 1665 and coined the word "cell".' },
      { id: 'mito', name: 'Mitochondria (Yes, plants have them too!)', size: '~1–2 µm long', color: '#b07818', present: 'Animal ✓ · Plant ✓ · Bacteria ✗',
        job: 'Plant cells respire in light and darkness. Mitochondria use chemical energy from nutrients to supply ATP for work such as ion transport and protein synthesis.',
        howWeKnow: 'Germinating seeds and roots in pitch darkness consume O₂ and release CO₂ via mitochondrial respiration.' },
      { id: 'nucleus', name: 'Nucleus & DNA', size: '~6 µm diameter', color: '#b8432f', present: 'Animal ✓ · Plant ✓ · Bacteria ✗',
        job: 'Stores the plant’s nuclear chromosomes and coordinates gene expression with the chloroplasts and mitochondria.',
        howWeKnow: 'E. K. Janaki Ammal stained and counted sugarcane and magnolia chromosomes inside plant nuclei in Coimbatore (1930s).' },
    ],
  },
  bacteria: {
    name: 'Bacterial Cell (Prokaryote, e.g. E. coli / Lactobacillus)',
    size: '~2 µm long × 0.8 µm wide (10× smaller than animal cell)',
    kingdom: 'Prokaryote · Bacteria',
    summary: 'No nucleus and no membrane-bound organelles—yet a complete, self-reproducing living factory with its own DNA, 70S ribosomes, ATP synthase and peptidoglycan wall.',
    organelles: [
      { id: 'nucleoid', name: 'Circular DNA Chromosome (Nucleoid)', size: '~1.4 mm unfolded loop', color: '#b8432f', present: 'Animal ✗ · Plant ✗ · Bacteria ✓',
        job: 'A single closed loop of double-stranded DNA floating directly in the cytoplasm without a nuclear membrane.',
        howWeKnow: 'Cairns (1963) autoradiographed replicating E. coli DNA and revealed a single intact circular chromosome.' },
      { id: 'plasmid', name: 'Plasmids (Bonus DNA Rings)', size: '~2–10 kb rings', color: '#2f6d8f', present: 'Animal ✗ · Plant ✗ · Bacteria ✓',
        job: 'Small independent rings of DNA that carry bonus genes (such as antibiotic resistance) and can be traded between bacteria.',
        howWeKnow: 'Biotechnologists insert the human insulin gene into bacterial plasmids so bacteria print human insulin for diabetics.' },
      { id: 'ribosome', name: '70S Ribosomes', size: '~20 nm across', color: '#2e6f4e', present: 'Animal (80S) · Plant (80S) · Bacteria ✓ (70S)',
        job: 'Translates mRNA into bacterial proteins. Because bacterial 70S ribosomes differ slightly from human 80S ribosomes, antibiotics like streptomycin block bacterial ribosomes without stopping ours.',
        howWeKnow: 'Cryo-EM and X-ray structures show exactly how macrolide and aminoglycoside antibiotics bind bacterial 70S subunits.' },
      { id: 'wall', name: 'Peptidoglycan Cell Wall & Membrane', size: '~20–80 nm thick', color: '#b07818', present: 'Bacteria ✓ (peptidoglycan, NOT cellulose)',
        job: 'Cross-linked sugar-peptide armour that resists osmotic bursting; the plasma membrane underneath houses the bacterium’s ATP synthase turbines.',
        howWeKnow: 'Alexander Fleming’s penicillin works by blocking the enzyme that cross-links bacterial peptidoglycan walls!' },
      { id: 'flagellum', name: 'Rotary Flagellum Motor', size: '~20 nm filament', color: '#5d6c66', present: 'Many motile bacteria ✓',
        job: 'A true molecular rotary propeller spun at up to 300 revolutions per second by protons (H⁺) flowing through a protein ring in the membrane.',
        howWeKnow: 'Tethering a bacterium by its flagellum to a glass slide makes the whole bacterial cell body spin like a carousel.' },
    ],
  },
};


App.explorer('cell', {
  mount(stage, { close }) {
    let kind = 'animal', orgIdx = 0, cutaway = true, spinning = false, disposed = false, raf = 0;

    const topBar = el('div', { class: 'scale-top' },
      el('p', { class: 'xp-kicker' }, 'Three kinds of cell · One shared chemical engine'),
      el('button', { type: 'button', class: 'xp-btn', onclick: () => { cleanup(); close(); } }, 'Close explorer')
    );

    const tabs = el('div', { class: 'live-tabs', role: 'tablist', 'aria-label': 'Cell type' });
    const tabBtns = Object.entries(CELLS).map(([k, info]) => {
      const b = el('button', {
        type: 'button', role: 'tab', 'aria-selected': String(k === kind),
        onclick: () => { kind = k; orgIdx = 0; syncUI(); buildScene(); }
      }, info.name.split(' (')[0]);
      tabs.append(b);
      return [k, b];
    });

    const cutBtn = el('button', {
      type: 'button', class: 'xp-btn', 'aria-pressed': String(cutaway),
      onclick: () => { cutaway = !cutaway; cutBtn.setAttribute('aria-pressed', String(cutaway)); cutBtn.textContent = cutaway ? 'Cut-away: ON' : 'Cut-away: OFF'; buildScene(); }
    }, 'Cut-away: ON');

    const spinBtn = el('button', {
      type: 'button', class: 'xp-btn', 'aria-pressed': String(spinning),
      onclick: () => { spinning = !spinning; spinBtn.setAttribute('aria-pressed', String(spinning)); spinBtn.textContent = spinning ? 'Pause rotation' : 'Rotate 3D'; }
    }, spinning ? 'Pause rotation' : 'Rotate 3D');

    const viewWrap = el('div', { class: 'live-3d', style: 'height:340px;position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--rule);background:var(--wash)' });
    viewWrap.tabIndex = 0;
    viewWrap.setAttribute('role', 'img');
    viewWrap.setAttribute('aria-label', 'Schematic cell cutaway. Arrow keys turn the 3D view.');
    const turn = (dx, dy = 0) => {
      if (!root) return;
      root.quaternion.premultiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), dx));
      root.quaternion.premultiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), dy));
      renderNow();
    };
    viewWrap.addEventListener('keydown', event => {
      const delta = { ArrowLeft: [-.2, 0], ArrowRight: [.2, 0], ArrowUp: [0, -.2], ArrowDown: [0, .2] }[event.key];
      if (delta) { turn(...delta); event.preventDefault(); }
    });
    const turnLeft = el('button', { type: 'button', class: 'xp-btn', onclick: () => turn(-.3) }, 'Turn left');
    const turnRight = el('button', { type: 'button', class: 'xp-btn', onclick: () => turn(.3) }, 'Turn right');
    const orgBar = el('div', { class: 'live-tabs', style: 'margin-top:0.6rem;flex-wrap:wrap', role: 'tablist', 'aria-label': 'Inspect organelle' });

    const cardTitle = el('h3', { style: 'margin:0 0 0.25rem 0;font-size:1.08rem' });
    const cardMeta = el('p', { style: 'margin:0 0 0.45rem 0;font-size:0.88rem;color:var(--muted);font-weight:600' });
    const cardJob = el('p', { style: 'margin:0 0 0.45rem 0;font-size:0.95rem' });
    const cardEvidence = el('p', { style: 'margin:0;font-size:0.9rem;color:var(--ink)' });
    const infoCard = el('aside', { class: 'scale-guide', style: 'margin-top:0.75rem;padding:0.9rem 1.1rem;border-radius:8px;border:1px solid var(--rule);background:var(--paper)' },
      el('p', { class: 'xp-kicker', style: 'margin:0 0 0.25rem 0' }, 'Organelle forensics · Size, mechanism & evidence'),
      cardTitle, cardMeta, cardJob, cardEvidence
    );

    const wrap = el('div', { class: 'scale-explorer' },
      topBar,
      el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin:0.5rem 0' }, tabs, cutBtn, spinBtn, turnLeft, turnRight),
      viewWrap,
      el('p', { class: 'live-note' }, 'Schematic cutaways at different enlargements: the cells do not share a scale. Ribosomes, membranes and some other parts are enlarged for visibility; molecular crowding is omitted.'),
      orgBar,
      infoCard
    );
    stage.replaceChildren(wrap);

    // Set up Three.js, with an explicit link to the still drawings if unavailable.
    let renderer = null, scene = null, camera = null, root = null;
    if (webglOK()) {
      try {
        renderer = acquireRenderer();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = SRGBColorSpace;
        viewWrap.append(renderer.domElement);
        scene = new Scene();
        camera = new PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.set(0, 1.4, 7.2);
        camera.lookAt(0, 0, 0);
        scene.add(new HemisphereLight(0xffffff, 0x8a8270, 1.45));
        scene.add(new AmbientLight(0xffffff, 0.4));
        const dir = new DirectionalLight(0xffffff, 1.6);
        dir.position.set(5, 7, 6);
        scene.add(dir);
        root = new Group();
        scene.add(root);

        let drag = null;
        viewWrap.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; viewWrap.setPointerCapture(e.pointerId); });
        viewWrap.addEventListener('pointermove', (e) => {
          if (!drag || !root) return;
          const dx = (e.clientX - drag.x) * 0.01;
          const dy = (e.clientY - drag.y) * 0.01;
          drag = { x: e.clientX, y: e.clientY };
          root.quaternion.premultiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), dx));
          root.quaternion.premultiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), dy));
          renderNow();
        });
        viewWrap.addEventListener('pointerup', () => { drag = null; });
      } catch (_) {
        if (renderer) releaseRenderer(renderer, renderer.getContext().isContextLost());
        renderer = null;
      }
    }

    if (!renderer) {
      viewWrap.removeAttribute('role');viewWrap.removeAttribute('aria-label');viewWrap.removeAttribute('tabindex');
      for (const button of [cutBtn, spinBtn, turnLeft, turnRight]) button.hidden = true;
      viewWrap.style.height = 'auto';viewWrap.style.padding = '1rem';
      viewWrap.append(el('p', {}, '3D is unavailable in this browser. The evidence cards below still work. ',
        el('a', { href: '#ch2' }, 'Open the cell drawings in Chapter 2.')));
    }

    const sphereGeo = new SphereGeometry(1, 28, 20);
    const cylGeo = new CylinderGeometry(1, 1, 1, 20);
    const torusGeo = new TorusGeometry(1, 0.18, 12, 32);
    const boxGeo = new BoxGeometry(1, 1, 1);

    // These primitives belong to this explorer session and survive rebuilds.
    for (const geometry of [sphereGeo, cylGeo, torusGeo, boxGeo]) geometry.userData.shared = true;

    function mat(hex, opts = {}) {
      return new MeshStandardMaterial({ color: new Color(hex), roughness: 0.5, metalness: 0.05, ...opts });
    }

    function buildScene() {
      if (!root) return;
      clearGroup(root);
      const selId = CELLS[kind].organelles[orgIdx]?.id;

      if (kind === 'animal') {
        // Outer plasma membrane
        const mem = new Mesh(sphereGeo, mat('#2f6d8f', { transparent: true, opacity: cutaway ? 0.22 : 0.48 }));
        mem.scale.set(2.3, 1.9, 2.1);
        root.add(mem);
        // Nucleus
        const nuc = new Mesh(sphereGeo, mat('#b8432f', { emissive: new Color(selId === 'nucleus' ? '#4a1208' : '#000000') }));
        nuc.scale.setScalar(selId === 'nucleus' ? 0.92 : 0.82);
        root.add(nuc);
        // Mitochondria
        for (const [x, y, z, rx, rz] of [[-1.3, 0.5, 0.6, 0.4, 0.5], [1.25, -0.45, 0.5, -0.3, 0.4], [0.9, 0.75, -0.6, 0.5, -0.2], [-1.0, -0.7, -0.5, -0.2, -0.6]]) {
          const m = new Mesh(cylGeo, mat('#b07818', { emissive: new Color(selId === 'mito' ? '#402800' : '#000000') }));
          m.scale.set(0.24, 0.58, 0.24);
          m.position.set(x, y, z);
          m.rotation.set(rx, 0, rz);
          root.add(m);
        }
        // Ribosomes
        for (let i = 0; i < 22; i++) {
          const a = i * 1.9, r = 1.15 + (i % 4) * 0.22;
          const rib = new Mesh(sphereGeo, mat('#2e6f4e'));
          rib.scale.setScalar(selId === 'ribosome' ? 0.11 : 0.075);
          rib.position.set(Math.cos(a) * r, ((i % 5) - 2) * 0.35, Math.sin(a) * r * 0.85);
          root.add(rib);
        }
      } else if (kind === 'plant') {
        // Rigid cellulose box wall
        const wall = new Mesh(boxGeo, mat('#8a7a5a', { transparent: true, opacity: cutaway ? 0.20 : 0.45 }));
        wall.scale.set(3.4, 2.5, 2.2);
        root.add(wall);
        // Central permanent sap vacuole
        const vac = new Mesh(sphereGeo, mat('#2f6d8f', { transparent: true, opacity: 0.45, emissive: new Color(selId === 'vacuole' ? '#0d2b3e' : '#000000') }));
        vac.scale.set(1.25, 0.88, 0.82);
        vac.position.set(-0.2, 0, 0);
        root.add(vac);
        // Nucleus pushed to side
        const nuc = new Mesh(sphereGeo, mat('#b8432f', { emissive: new Color(selId === 'nucleus' ? '#4a1208' : '#000000') }));
        nuc.scale.setScalar(0.58);
        nuc.position.set(1.15, 0.45, 0.2);
        root.add(nuc);
        // Chloroplasts
        for (const [x, y, z] of [[-1.35, 0.8, 0.55], [-1.35, -0.75, 0.5], [0.2, 0.92, 0.45], [0.3, -0.92, -0.4], [1.2, -0.65, 0.45], [-0.4, 0.85, -0.6]]) {
          const ch = new Mesh(sphereGeo, mat('#2e6f4e', { emissive: new Color(selId === 'chloroplast' ? '#0f3822' : '#000000') }));
          ch.scale.set(0.38, 0.18, 0.26);
          ch.position.set(x, y, z);
          root.add(ch);
        }
        // Mitochondria
        for (const [x, y, z] of [[1.15, -0.1, -0.5], [-1.2, 0.1, -0.55], [0.6, 0.85, -0.3]]) {
          const m = new Mesh(cylGeo, mat('#b07818', { emissive: new Color(selId === 'mito' ? '#402800' : '#000000') }));
          m.scale.set(0.18, 0.42, 0.18);
          m.position.set(x, y, z);
          m.rotation.z = 0.6;
          root.add(m);
        }
      } else {
        // Bacterial capsule/peptidoglycan rod
        const body = new Mesh(cylGeo, mat('#b07818', { transparent: true, opacity: cutaway ? 0.24 : 0.5 }));
        body.scale.set(1.15, 2.8, 1.15);
        body.rotation.z = Math.PI / 2;
        root.add(body);
        // Circular nucleoid tangle
        const nuc = new Mesh(torusGeo, mat('#b8432f', { emissive: new Color(selId === 'nucleoid' ? '#4a1208' : '#000000') }));
        nuc.scale.set(0.75, 0.52, 0.75);
        nuc.position.set(-0.25, 0, 0);
        nuc.rotation.set(0.4, 0.3, 0.2);
        root.add(nuc);
        // Plasmid rings
        for (const [x, y, z] of [[0.85, 0.35, 0.25], [0.75, -0.38, -0.2]]) {
          const pl = new Mesh(torusGeo, mat('#2f6d8f', { emissive: new Color(selId === 'plasmid' ? '#0d2b3e' : '#000000') }));
          pl.scale.setScalar(0.28);
          pl.position.set(x, y, z);
          root.add(pl);
        }
        // 70S ribosomes
        for (let i = 0; i < 18; i++) {
          const rib = new Mesh(sphereGeo, mat('#2e6f4e'));
          rib.scale.setScalar(selId === 'ribosome' ? 0.10 : 0.068);
          rib.position.set(((i % 6) - 2.5) * 0.45, ((i % 3) - 1) * 0.38, ((i % 4) - 1.5) * 0.32);
          root.add(rib);
        }
        // Rotary flagellum tail
        for (let s = 0; s < 12; s++) {
          const seg = new Mesh(sphereGeo, mat('#5d6c66'));
          seg.scale.setScalar(0.08);
          const t = s * 0.22;
          seg.position.set(1.45 + t, Math.sin(s * 0.9) * 0.22, Math.cos(s * 0.9) * 0.22);
          root.add(seg);
        }
      }
      renderNow();
    }

    function syncUI() {
      const info = CELLS[kind];
      for (const [k, b] of tabBtns) b.setAttribute('aria-selected', String(k === kind));
      orgBar.replaceChildren(...info.organelles.map((o, idx) =>
        el('button', {
          type: 'button', role: 'tab', 'aria-selected': String(idx === orgIdx),
          onclick: () => { orgIdx = idx; syncUI(); buildScene(); }
        }, o.name.split(' (')[0])
      ));
      const org = info.organelles[orgIdx] || info.organelles[0];
      cardTitle.textContent = `${org.name} — ${org.size}`;
      cardMeta.textContent = `${info.name} (${info.size})  ·  Presence: ${org.present}`;
      cardJob.textContent = `Mechanism: ${org.job}`;
      cardEvidence.textContent = `How we know: ${org.howWeKnow}`;
    }

    function resize() {
      if (!renderer || disposed) return;
      const w = viewWrap.clientWidth || 640, h = viewWrap.clientHeight || 340;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderNow();
    }

    function renderNow() {
      if (renderer && !disposed) renderer.render(scene, camera);
    }

    let last = performance.now();
    function tick(now) {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (spinning && root && !document.hidden) {
        root.rotateOnWorldAxis(new Vector3(0, 1, 0), dt * 0.42);
        renderNow();
      }
      raf = requestAnimationFrame(tick);
    }

    const visibility = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) {
        spinning = false;
        spinBtn.setAttribute('aria-pressed', 'false');
        spinBtn.textContent = 'Rotate 3D';
      }
    });
    visibility.observe(viewWrap);
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const stopForStill = () => {
      if (App.reduceMotion()) {
        spinning = false;
        spinBtn.setAttribute('aria-pressed', 'false');
        spinBtn.textContent = 'Rotate 3D';
      }
    };
    motionPreference.addEventListener('change', stopForStill);
    const ro = new ResizeObserver(resize);
    ro.observe(viewWrap);
    syncUI();
    resize();
    buildScene();
    raf = requestAnimationFrame(tick);

    function cleanup() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      visibility.disconnect();
      motionPreference.removeEventListener('change', stopForStill);
      if (renderer) {
        if (root) clearGroup(root);
        scene?.clear();
        releaseRenderer(renderer, renderer.getContext().isContextLost());
        renderer = null;root = null;scene = null;
      }
      for (const geometry of [sphereGeo, cylGeo, torusGeo, boxGeo]) geometry.dispose();
    }
    return cleanup;
  },
});
