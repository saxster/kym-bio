// The Master Code: 3D DNA Double Helix -> mRNA -> Protein Explorer on section#explore-code.
// Shows the Watson-Crick B-DNA 3D double helix (10 base pairs per 3.4 nm turn), complementary
// A=T and C≡G base pairing, ribosome codon stepping, and the sickle-cell GAG -> GTG point mutation.
import App from './core.js';
import { acquireRenderer, releaseRenderer, webglOK, clearGroup } from '../live/three_kit.js';
import {
  Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, AmbientLight,
  Group, Mesh, SphereGeometry, CylinderGeometry, MeshStandardMaterial, Color, Vector3, Quaternion, SRGBColorSpace,
} from 'three';

const { el } = App;

const BASE_COLORS = {
  A: '#2e6f4e', // Adenine (Forest green)
  T: '#b8432f', // Thymine (Vermilion red)
  U: '#b8432f', // Uracil in mRNA
  G: '#b07818', // Guanine (Golden ochre)
  C: '#2f6d8f', // Cytosine (Deep teal)
};

const COMPLEMENT = { A: 'T', T: 'A', G: 'C', C: 'G' };

// Codons 1 to 7 of human beta-globin (HBB): Val-His-Leu-Thr-Pro-Glu-Glu (normal) vs Val at position 6 in HbS
const CODONS_NORMAL = [
  { pos: 1, dna: 'GTG', mrna: 'GUG', aa: 'Val (Valine)', prop: 'Non-polar · Hydrophobic', note: 'First amino acid of mature beta-globin chain.' },
  { pos: 2, dna: 'CAC', mrna: 'CAC', aa: 'His (Histidine)', prop: 'Polar · Positively charged', note: 'Helps stabilise the N-terminal helix of haemoglobin.' },
  { pos: 3, dna: 'CTG', mrna: 'CUG', aa: 'Leu (Leucine)', prop: 'Non-polar · Hydrophobic', note: 'Tucks inside the water-free core of the globin fold.' },
  { pos: 4, dna: 'ACT', mrna: 'ACU', aa: 'Thr (Threonine)', prop: 'Polar · Hydrophilic', note: 'Faces outward toward the watery red-blood-cell cytoplasm.' },
  { pos: 5, dna: 'CCT', mrna: 'CCU', aa: 'Pro (Proline)', prop: 'Rigid ring · Helix turn', note: 'Creates a sharp corner on the surface of the protein.' },
  { pos: 6, dna: 'GAG', mrna: 'GAG', aa: 'Glu (Glutamate)', prop: 'Negatively charged · Water-loving', note: 'WILD-TYPE (HbA): Sits on the outside surface; haemoglobin tetramers glide past each other freely!' },
  { pos: 7, dna: 'GAG', mrna: 'GAG', aa: 'Glu (Glutamate)', prop: 'Negatively charged · Water-loving', note: 'Neighbouring negatively charged surface residue.' },
];

const CODON6_MUTANT = {
  pos: 6, dna: 'GTG', mrna: 'GUG', aa: 'Val (Valine) — MUTANT!', prop: 'Hydrophobic (water-fearing) sticky patch',
  note: 'SICKLE-CELL MUTATION (HbS): Swapping A → T in DNA flips codon 6 from GAG (Glutamate) to GUG (Valine), creating a sticky hydrophobic patch that makes deoxygenated haemoglobin polymerise into rigid fibres!',
};


App.explorer('code', {
  mount(stage, { close }) {
    let mutated = false, codonIdx = 5, spinning = !App.reduceMotion(), disposed = false, raf = 0;

    function activeCodons() {
      return CODONS_NORMAL.map((c, i) => (i === 5 && mutated ? CODON6_MUTANT : c));
    }

    const topBar = el('div', { class: 'scale-top' },
      el('p', { class: 'xp-kicker' }, 'Four chemical letters · Three-letter codons · One 3D machine'),
      el('button', { type: 'button', class: 'xp-btn', onclick: () => { cleanup(); close(); } }, 'Close explorer')
    );

    const mutBtn = el('button', {
      type: 'button', class: 'xp-btn', 'aria-pressed': String(mutated),
      onclick: () => {
        mutated = !mutated;
        codonIdx = 5;
        mutBtn.setAttribute('aria-pressed', String(mutated));
        mutBtn.textContent = mutated ? 'Codon 6: Mutant GTG (Sickle HbS)' : 'Codon 6: Normal GAG (Wild-type HbA)';
        syncUI(); buildHelix();
      }
    }, 'Codon 6: Normal GAG (Wild-type HbA)');

    const spinBtn = el('button', {
      type: 'button', class: 'xp-btn', 'aria-pressed': String(spinning),
      onclick: () => { spinning = !spinning; spinBtn.setAttribute('aria-pressed', String(spinning)); spinBtn.textContent = spinning ? 'Pause helix spin' : 'Spin 3D helix'; }
    }, spinning ? 'Pause helix spin' : 'Spin 3D helix');

    const viewWrap = el('div', { class: 'live-3d', style: 'height:340px;position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--rule);background:var(--wash)' });
    const codonBar = el('div', { class: 'live-tabs', style: 'margin-top:0.6rem;flex-wrap:wrap', role: 'tablist', 'aria-label': 'Select codon along beta-globin gene' });

    const readoutTitle = el('h3', { style: 'margin:0 0 0.25rem 0;font-size:1.08rem' });
    const readoutPairs = el('p', { style: 'margin:0 0 0.45rem 0;font-family:var(--mono,monospace);font-size:0.92rem;font-weight:600' });
    const readoutNote = el('p', { style: 'margin:0;font-size:0.93rem' });
    const infoCard = el('aside', { class: 'scale-guide', style: 'margin-top:0.75rem;padding:0.9rem 1.1rem;border-radius:8px;border:1px solid var(--rule);background:var(--paper)' },
      el('p', { class: 'xp-kicker', style: 'margin:0 0 0.25rem 0' }, 'Central Dogma · DNA → mRNA → Amino Acid in Haemoglobin (HBB)'),
      readoutTitle, readoutPairs, readoutNote
    );

    const wrap = el('div', { class: 'scale-explorer' },
      topBar,
      el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin:0.5rem 0' }, mutBtn, spinBtn),
      viewWrap,
      codonBar,
      infoCard
    );
    stage.replaceChildren(wrap);

    let renderer = null, scene = null, camera = null, root = null;
    if (webglOK()) {
      try {
        renderer = acquireRenderer();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = SRGBColorSpace;
        viewWrap.append(renderer.domElement);
        scene = new Scene();
        camera = new PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.set(0, 0.4, 8.8);
        camera.lookAt(0, 0, 0);
        scene.add(new HemisphereLight(0xffffff, 0x8a8270, 1.45));
        scene.add(new AmbientLight(0xffffff, 0.4));
        const dir = new DirectionalLight(0xffffff, 1.6);
        dir.position.set(5, 6, 7);
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
      spinBtn.hidden = true;
      viewWrap.style.height = 'auto';viewWrap.style.padding = '1rem';
      viewWrap.append(el('p', {}, '3D is unavailable in this browser. The evidence cards below still work. ',
        el('a', { href: '#ch11' }, 'Open the DNA drawings in Chapter 11.')));
    }

    const sphereGeo = new SphereGeometry(1, 24, 18);
    const cylGeo = new CylinderGeometry(1, 1, 1, 16);

    // These primitives belong to this explorer session and survive rebuilds.
    for (const geometry of [sphereGeo, cylGeo]) geometry.userData.shared = true;

    function mat(hex, opts = {}) {
      return new MeshStandardMaterial({ color: new Color(hex), roughness: 0.48, metalness: 0.05, ...opts });
    }

    function buildHelix() {
      if (!root) return;
      clearGroup(root);
      const codons = activeCodons();
      const bases = codons.map(c => c.dna).join(''); // 21 bases = 7 codons
      const total = bases.length;
      const radius = 1.35;
      const rise = 0.25;
      const twist = (36 * Math.PI) / 180; // 36 degrees per base pair (10 bp per turn, Franklin's Photo 51!)

      let prevA = null, prevB = null;
      for (let i = 0; i < total; i++) {
        const b1 = bases[i];
        const b2 = COMPLEMENT[b1];
        const cIdx = Math.floor(i / 3);
        const isSelected = cIdx === codonIdx;
        const y = (i - (total - 1) / 2) * rise;
        const ang = i * twist;
        const pA = new Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius);
        const pB = new Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius);

        // Sugar-phosphate backbone spheres
        const sA = new Mesh(sphereGeo, mat(isSelected ? '#1d2b27' : '#7b7466'));
        sA.scale.setScalar(isSelected ? 0.20 : 0.14);
        sA.position.copy(pA);
        root.add(sA);

        const sB = new Mesh(sphereGeo, mat(isSelected ? '#1d2b27' : '#7b7466'));
        sB.scale.setScalar(isSelected ? 0.20 : 0.14);
        sB.position.copy(pB);
        root.add(sB);

        // Backbone phosphodiester rods
        if (prevA) {
          for (const [P0, P1] of [[prevA, pA], [prevB, pB]]) {
            const d = P1.clone().sub(P0);
            const rod = new Mesh(cylGeo, mat('#8a8270'));
            rod.scale.set(0.055, d.length(), 0.055);
            rod.position.copy(P0).addScaledVector(d, 0.5);
            rod.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.clone().normalize());
            root.add(rod);
          }
        }
        prevA = pA; prevB = pB;

        // Half-rungs for complementary base pair b1 -- b2
        const mid = pA.clone().add(pB).multiplyScalar(0.5);
        for (const [P, base] of [[pA, b1], [pB, b2]]) {
          const d = mid.clone().sub(P);
          const rung = new Mesh(cylGeo, mat(BASE_COLORS[base] || '#2f6d8f', {
            emissive: new Color(isSelected ? '#221408' : '#000000')
          }));
          rung.scale.set(isSelected ? 0.105 : 0.072, d.length() * 0.92, isSelected ? 0.105 : 0.072);
          rung.position.copy(P).addScaledVector(d, 0.46);
          rung.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.clone().normalize());
          root.add(rung);
        }
      }
      renderNow();
    }

    function syncUI() {
      const codons = activeCodons();
      codonBar.replaceChildren(...codons.map((c, idx) =>
        el('button', {
          type: 'button', role: 'tab', 'aria-selected': String(idx === codonIdx),
          onclick: () => { codonIdx = idx; syncUI(); buildHelix(); }
        }, `Codon ${c.pos}: ${c.dna} (${c.aa.split(' ')[0]})`)
      ));
      const cur = codons[codonIdx];
      const template = cur.dna.split('').map(b => COMPLEMENT[b]).join('');
      const hBonds = cur.dna.split('').map(b => (b === 'G' || b === 'C' ? '3 H-bonds (C≡G)' : '2 H-bonds (A=T)')).join(' · ');
      readoutTitle.textContent = `Codon ${cur.pos}: ${cur.aa} — ${cur.prop}`;
      readoutPairs.textContent = `Coding DNA: 5'-${cur.dna}-3'  |  Template DNA: 3'-${template}-5'  |  mRNA Codon: 5'-${cur.mrna}-3'  (${hBonds})`;
      readoutNote.textContent = cur.note;
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
        root.rotateOnWorldAxis(new Vector3(0, 1, 0), dt * 0.45);
        renderNow();
      }
      raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(viewWrap);
    syncUI();
    resize();
    buildHelix();
    raf = requestAnimationFrame(tick);

    function cleanup() {
      if (disposed) return;
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      if (renderer) {
        if (root) clearGroup(root);
        scene?.clear();
        releaseRenderer(renderer, renderer.getContext().isContextLost());
        renderer = null;root = null;scene = null;
      }
      for (const geometry of [sphereGeo, cylGeo]) geometry.dispose();
    }
    return cleanup;
  },
});
