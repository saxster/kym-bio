// Spaced retrieval, FSRS v5 Flashcard Deck (Forward / Reverse / Cloze Fading),
// 4-Rung End-of-Chapter Questions & Answers Bench (with Transfer Twins),
// and Frequent 5-Question Interleaved Checkpoint Quizzes for web books (Surface B).
// Persists in App.store ('mastery', 'eoc:*', 'fc:*') with zero streaks, XP, or internal engine jargon.
import App from './core.js';
import {
  FSRS_RATING,
  createCard,
  createSkill,
  interleaveItems,
  propagateImplicitCredit,
  ratingFromAttempt,
  scheduleFSRS,
  updateBKT,
} from './mastery_model.mjs';

const { el, store } = App;
const clean = s => String(s || '').replace(/\s+/g, ' ').trim();

function playSound(kind) {
  if (typeof window !== 'undefined' && window.__bookSound) window.__bookSound.play(kind);
}

function localDayKey(ts = Date.now()) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function renderProgressiveCloze(text, keyTerms = [], stage = 1) {
  if (!stage || stage <= 0) return text;
  const normSet = new Set(
    keyTerms
      .flatMap(t => String(t).toLowerCase().split(/\s+/))
      .map(w => w.replace(/^[^a-z0-9µ°]+|[^a-z0-9µ°]+$/gi, ''))
      .filter(w => w.length >= 3)
  );
  return String(text || '')
    .split(/\s+/)
    .map((tok, idx) => {
      const bare = tok.replace(/^[^a-z0-9µ°]+|[^a-z0-9µ°]+$/gi, '');
      if (bare.length < 3) return tok;
      const isKey = normSet.has(bare.toLowerCase()) || /\d/.test(bare);
      const shouldMask = stage === 1 ? isKey : (isKey || (bare.length >= 5 && idx % 2 === 0));
      if (!shouldMask) return tok;
      const pre = (tok.match(/^[^a-z0-9µ°]+/i) || [''])[0];
      const suf = (tok.match(/[^a-z0-9µ°]+$/i) || [''])[0];
      if (stage === 1) {
        return `${pre}${bare[0]}${'_'.repeat(Math.max(2, Math.min(7, bare.length - 1)))}${suf}`;
      }
      return `${pre}${'_'.repeat(Math.max(3, Math.min(8, bare.length)))}${suf}`;
    })
    .join(' ');
}

// ------------------------------------------------------------------ 16-Chapter 4-Rung End-of-Chapter Synthesis & Transfer Twin Bank
const CHAPTER_SYNTHESIS_BANK = {
  0: [
    {
      id: 'eoc-ch0-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain why increasing a microscope’s magnification without increasing its numerical aperture (NA) or shortening wavelength λ produces "empty magnification" rather than revealing finer sub-cellular detail.',
      keywords: ['wavelength', 'diffraction', 'numerical aperture', 'resolution', 'blur'],
      answer: 'Resolution is physically limited by wave diffraction (d = 0.61 λ ÷ NA). If two structures lie closer than the diffraction limit (~200 nm for visible light), their Airy diffraction discs overlap into a single blur; enlarging the image further (empty magnification) only makes the blur bigger without separating the two points.',
    },
    {
      id: 'eoc-ch0-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A student draws a bacterial cell 45 mm long at a magnification of ×15,000. Calculate the actual length A of the bacterium in micrometres (µm), showing the unit conversion from mm to µm.',
      keywords: ['45,000', '15,000', '3 µm', '1,000'],
      answer: 'Convert image size I to micrometres first: I = 45 mm × 1,000 µm/mm = 45,000 µm. Using A = I ÷ M: A = 45,000 µm ÷ 15,000 = 3.0 µm (or 0.003 mm).',
    },
    {
      id: 'eoc-ch0-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Pasteur’s swan-neck flask stayed clear because boiling destroyed the vital life-force in the air above the broth."',
      keywords: ['open to air', 'gravity', 'dust', 'microbes', 'trapped', 'bend'],
      answer: 'The swan-neck bend remained open to free gas exchange with outside air, proving air itself was undamaged. Airborne microbes and dust settled by gravity in the low U-bend; tipping the broth into that bend or snapping the neck immediately triggered microbial growth.',
    },
    {
      id: 'eoc-ch0-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'A cell biologist wants to image (a) live cytoplasmic streaming in an Elodea leaf cell (~50 µm wide) and (b) individual 25 nm ribosomes inside a cell. Which microscopy modality suits each task, and what physical trade-off prevents one instrument from doing both?',
      keywords: ['light microscope', 'electron', '200 nm', 'vacuum', 'living', 'wavelength'],
      answer: '(a) A visible-light microscope (d ≈ 200 nm) resolves 50 µm live cells in liquid water without killing them. (b) Resolving 25 nm ribosomes requires an electron microscope whose short de Broglie electron wavelength (~0.004 nm) beats the 200 nm photon diffraction barrier, but requires a high vacuum and chemically fixed (dead) tissue.',
      twinTitle: 'New Scenario · Tracing a 90 nm Enveloped Virus vs. a Live White Blood Cell',
      twinPrompt: 'A virology lab in Pune needs to (a) film a live 12 µm human neutrophil chasing bacteria in blood plasma, and (b) resolve the 15 nm glycoprotein spikes on a 90 nm coronavirus capsid. Justify which microscope is required for each and explain the wavelength and vacuum trade-off.',
      twinAnswer: 'Filming a live 12 µm neutrophil requires light microscopy in aqueous medium (well above the ~200 nm diffraction limit). Resolving 15 nm viral spikes on a 90 nm capsid requires electron microscopy because 15 nm is far below visible light’s ~200 nm resolution floor, at the cost of fixing the specimen in a vacuum.',
    },
  ],
  1: [
    {
      id: 'eoc-ch1-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Both a candle flame and a germinating moong seed oxidise organic carbon fuel into CO₂ and H₂O. Explain how the cell prevents all that free energy from escaping as a single burst of heat.',
      keywords: ['enzymes', 'coupled', 'ATP', 'stepwise', 'activation'],
      answer: 'Cells break down glucose across many enzyme-catalysed steps at 37 °C, coupling exergonic oxidation steps directly to phosphorylating ADP + Pᵢ into ATP (~34% standard-state capture across ~30–32 ATP) rather than releasing 100% (-2,870 kJ/mol) as uncoupled thermal energy.',
    },
    {
      id: 'eoc-ch1-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A batch of dry moong seeds has a dry mass m(dry) = 45 g. After soaking in monsoon water, water makes up 65% (f = 0.65) of the hydrated seeds’ total mass before new dry mass is synthesised. Calculate the hydrated total mass m(total).',
      keywords: ['128.6', '0.35', '45', 'imbibition'],
      answer: 'Since dry mass is 1 − 0.65 = 0.35 (35%) of total mass: m(total) = m(dry) ÷ (1 − f) = 45 g ÷ 0.35 = 128.6 g (an imbibition water gain of 83.6 g without biological growth).',
    },
    {
      id: 'eoc-ch1-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Passing undigested plant cellulose fibre in faeces is an example of excretion, and taking antibiotics cures a viral cold."',
      keywords: ['egestion', 'metabolic', 'cells', 'ribosomes', 'cell wall', 'bacteria'],
      answer: 'First, cellulose fibre never crossed a cell membrane or was made by intracellular metabolism, so passing it out of the gut lumen is egestion (true excretion removes metabolic wastes like CO₂ and urea). Second, viruses lack cell walls and 70S ribosomes, so antibacterial drugs have no viral target.',
    },
    {
      id: 'eoc-ch1-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Connect imbibition, coupled ATP turnover, and the MRS GREN criteria to explain how a dry seed on a shelf transitions into an actively growing seedling, and contrast it with a growing alum crystal.',
      keywords: ['dry mass', 'hydration', 'enzymes', 'respiration', 'ATP', 'DNA'],
      answer: 'Imbibition hydrates the seed cytoplasm so dormant enzymes resume aerobic respiration, coupling glucose oxidation to ATP regeneration. ATP powers DNA-directed protein and cell-wall synthesis, producing a permanent increase in dry mass from within — whereas an alum crystal only accretes external ions onto its surface without cells, ATP, or genetic instructions.',
      twinTitle: 'New Scenario · Dormant Brine-Shrimp Cyst vs. Swelling Hydrogel Bead',
      twinPrompt: 'A decorative polymer hydrogel bead and a dormant Artemia (brine shrimp) cyst both double in diameter when placed in water. Describe two decisive experimental measurements after 48 hours that distinguish living cellular metabolism and growth from passive swelling.',
      twinAnswer: 'Measure (1) O₂ consumption / CO₂ evolution and heat release from coupled mitochondrial respiration (present in the hatching cyst, zero in the hydrogel), and (2) oven-dried mass and mitotic cell division after 48 h feeding (the hydrogel’s dry mass stays constant; the organism synthesises new dry-mass polymers via ATP and DNA).',
    },
  ],
  2: [
    {
      id: 'eoc-ch2-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Using the square-cube law (SA/V = 6/L), explain why a single spherical or cubic cell cannot simply grow to 10 cm wide and survive by passive diffusion across its outer membrane.',
      keywords: ['square', 'cube', '6/L', 'volume', 'diffusion distance'],
      answer: 'When cell width L increases 10-fold, membrane surface area (6L²) increases 100-fold while metabolising cytoplasmic volume (L³) increases 1,000-fold. SA/V drops to one-tenth (6/L) and diffusion time to the core (τ ≈ L²/2D) increases 100-fold, starving the interior.',
    },
    {
      id: 'eoc-ch2-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'Compare a 1 cm potato cube and a 2 cm potato cube. Calculate the surface area (6L²), volume (L³), and surface-area-to-volume ratio (SA/V) for each cube.',
      keywords: ['6 cm', '1 cm', '24 cm', '8 cm', '3 cm'],
      answer: 'For the 1 cm cube: SA = 6(1²) = 6 cm², V = 1³ = 1 cm³, so SA/V = 6.0 cm⁻¹. For the 2 cm cube: SA = 6(2²) = 24 cm², V = 2³ = 8 cm³, so SA/V = 24 ÷ 8 = 3.0 cm⁻¹ (halved when side length doubles).',
    },
    {
      id: 'eoc-ch2-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Plant cells have chloroplasts instead of mitochondria, and the rigid plant cell wall controls which molecules enter and leave the cell."',
      keywords: ['both', 'mitochondria', 'ATP', 'darkness', 'cell membrane', 'selectively permeable'],
      answer: 'Plant cells have BOTH chloroplasts (to fix carbon in light) and mitochondria (to respire glucose into ATP 24 hours a day, including in darkness and in non-green roots). Furthermore, the cellulose cell wall is a porous structural mesh; the plasma membrane inside it is the selectively permeable barrier.',
    },
    {
      id: 'eoc-ch2-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Cite three independent lines of structural and molecular evidence that mitochondria and chloroplasts evolved from free-living prokaryotes via endosymbiosis (Margulis), and explain why they are no longer independent bacteria today.',
      keywords: ['circular DNA', '70S ribosomes', 'double membrane', 'binary fission', 'nuclear genes'],
      answer: 'Mitochondria and chloroplasts carry their own circular DNA, contain bacterial-type 70S ribosomes, are bounded by double membranes, and divide by binary-fission-like pinching. They are no longer independent bacteria because most of their original genes transferred to the host cell nucleus, making them dependent on host protein import.',
      twinTitle: 'New Scenario · Newly Discovered Photosynthetic Sea-Slug Organelle',
      twinPrompt: 'A marine biologist discovers a green membrane-bound compartment inside a sea-slug cell. Outline three molecular tests to determine whether it is an endosymbiotic plastid of cyanobacterial ancestry rather than a host-built storage vesicle.',
      twinAnswer: 'Test for (1) circular DNA whose sequence clusters phylogenetically with cyanobacteria, (2) 70S ribosomes sensitive to bacterial translation inhibitors, and (3) a double-membrane envelope with division from pre-existing plastids.',
    },
  ],
  3: [
    {
      id: 'eoc-ch3-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain from thermal kinetic motion why simple diffusion and osmosis require zero ATP expenditure from the cell, whereas accumulating nitrate ions inside a root hair cell requires ATP.',
      keywords: ['thermal', 'random', 'concentration gradient', 'water potential', 'against', 'pump'],
      answer: 'Diffusion and osmosis are driven by random thermal motion (k_B T) down a free-energy or water-potential gradient. Moving nitrate ions uphill against their electrochemical gradient decreases entropy and increases free energy, so membrane transporters must couple uptake to ATP hydrolysis or an ATP-built proton gradient.',
    },
    {
      id: 'eoc-ch3-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A 60.0 mm raw potato strip immersed in 5% salt solution shrinks to 56.4 mm after 30 minutes. Calculate the percentage change in length, including the correct sign.',
      keywords: ['-6.0%', '-3.6', '60.0', 'water loss'],
      answer: 'Change ΔL = 56.4 mm − 60.0 mm = −3.6 mm. Percentage change = (100 × −3.6 mm) ÷ 60.0 mm = −6.0% (shrinkage due to net water loss by osmosis to lower water potential).',
    },
    {
      id: 'eoc-ch3-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "When placed in pure distilled water, both a human red blood cell and a palisade plant cell swell up and burst."',
      keywords: ['cell wall', 'turgor pressure', 'turgid', 'red blood cell', 'burst', 'water potential'],
      answer: 'The red blood cell lacks a cell wall, so continuous osmotic water entry swells and bursts (lyses) its plasma membrane. The plant cell has an inelastic cellulose wall that resists expansion, building positive turgor pressure (Ψ_p) until internal water potential equals external water potential and net inflow stops (turgid).',
    },
    {
      id: 'eoc-ch3-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Explain the molecular mechanism of Oral Rehydration Therapy (ORT): why drinking plain water fails to rehydrate a cholera patient rapidly, whereas a solution containing both glucose and sodium ions succeeds.',
      keywords: ['SGLT1', 'cotransporter', 'sodium', 'glucose', 'water potential', 'osmosis'],
      answer: 'The intestinal brush-border SGLT1 symporter couples the inward transport of 2 Na⁺ ions and 1 glucose molecule across the enterocyte membrane (driven by the basolateral Na⁺/K⁺-ATPase pump). Absorbing Na⁺ and glucose lowers the water potential inside the intestinal wall, drawing water in rapidly by osmosis.',
      twinTitle: 'New Scenario · Halophyte Mangrove Root Salt Exclusion & Water Uptake',
      twinPrompt: 'A Mumbai coastal mangrove root sits in brackish water. Explain how active ion transport across root membranes and vacuolar solute storage allow the root cells to maintain a lower internal water potential than the surrounding water so water still enters by osmosis.',
      twinAnswer: 'Root cells use ATP-driven proton pumps and antiporters to sequester compartmentalised solutes into their central vacuoles while excluding excess cytoplasmic Na⁺. Lowering internal vacuolar water potential below the surrounding water drives net osmotic water entry into the root.',
    },
  ],
  4: [
    {
      id: 'eoc-ch4-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain why an enzyme-catalysed reaction speeds up as temperature rises from 10 °C to 37 °C, but drops sharply to zero above 60 °C.',
      keywords: ['kinetic energy', 'collision', 'active site', 'denatured', 'hydrogen bonds', 'complementary'],
      answer: 'From 10 °C to 37 °C, higher molecular kinetic energy increases the frequency of collisions exceeding activation energy E_a. Above the optimum temperature, intense thermal vibration breaks weak intramolecular hydrogen and ionic bonds, unfolding the 3D active site (denaturation) so the substrate can no longer bind.',
    },
    {
      id: 'eoc-ch4-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'Under Michaelis–Menten kinetics (v = V_max [S] ÷ (K_m + [S])), an enzyme has V_max = 120 µmol/min and K_m = 2.0 mM. Calculate the initial reaction rate v when substrate concentration [S] = 2.0 mM and when [S] = 6.0 mM.',
      keywords: ['60', '90', 'half', 'K_m'],
      answer: 'At [S] = 2.0 mM (= K_m): v = 120 × 2.0 ÷ (2.0 + 2.0) = 60 µmol/min (exactly ½ V_max by definition of K_m). At [S] = 6.0 mM: v = 120 × 6.0 ÷ (2.0 + 6.0) = 720 ÷ 8.0 = 90 µmol/min.',
    },
    {
      id: 'eoc-ch4-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Boiling kills salivary amylase enzymes, and cooling the boiled tube back to 37 °C brings the enzymes back to life."',
      keywords: ['not alive', 'protein', 'denature', 'irreversible', 'freezing', 'deactivated'],
      answer: 'Enzymes are folded protein molecules, not living cells, so they cannot "die". Boiling irreversibly denatures their tertiary active-site geometry, so cooling back to 37 °C does not restore activity (whereas freezing at 0 °C merely slows kinetic collisions reversibly without denaturing the active site).',
    },
    {
      id: 'eoc-ch4-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Contrast how a competitive inhibitor and a non-competitive (allosteric) inhibitor alter an enzyme’s active site, and explain why adding excess substrate overcomes one but not the other.',
      keywords: ['active site', 'allosteric', 'V_max', 'K_m', 'outcompete', 'conformational'],
      answer: 'A competitive inhibitor mimics the substrate and competes directly for the active site; adding high [S] outcompetes the inhibitor so V_max is unchanged while apparent K_m increases. A non-competitive inhibitor binds a separate allosteric site and distorts the active site’s catalytic geometry, lowering V_max regardless of how much substrate is added.',
      twinTitle: 'New Scenario · Methanol Poisoning Treated with Ethanol Infusion',
      twinPrompt: 'In emergency medicine, accidental methanol poisoning is treated by administering ethanol, because liver alcohol dehydrogenase (ADH) converts methanol into toxic formaldehyde. Using competitive enzyme inhibition, explain why flooding the blood with ethanol protects the patient.',
      twinAnswer: 'Ethanol acts as a competing substrate for the active site of alcohol dehydrogenase. At high ethanol concentration, ethanol outcompetes methanol for ADH active sites, drastically slowing toxic formaldehyde formation while kidneys excrete the unreacted methanol.',
    },
  ],
  5: [
    {
      id: 'eoc-ch5-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Using Priestley, Ingenhousz, and Kamen’s ¹⁸O-tracer evidence, explain where the oxygen gas (O₂) released during photosynthesis actually comes from and what role light plays.',
      keywords: ['water', 'H2O', 'photolysis', 'chloroplast', 'thylakoid', 'CO2'],
      answer: 'All evolved O₂ comes from the photolysis (light-driven splitting) of water (2H₂O → O₂ + 4H⁺ + 4e⁻) at Photosystem II in the thylakoid membrane, not from carbon dioxide. Light energy drives electron transport to make ATP and NADPH, which then reduce CO₂ into carbohydrate in the Calvin cycle.',
    },
    {
      id: 'eoc-ch5-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'In an aquatic Elodea pondweed experiment, moving a lamp from 20 cm to 40 cm doubles the distance d. By the inverse-square law (I ∝ 1/d²), how does light intensity change, and if the bubble rate drops from 36 bubbles/min to 9 bubbles/min, what was the limiting factor?',
      keywords: ['quarter', '1/4', '9', 'light intensity', 'limiting factor'],
      answer: 'Doubling distance d from 20 cm to 40 cm reduces light intensity to 1/(2²) = ¼ (one-quarter) of its original value. Because the photosynthetic rate dropped proportionally to ¼ (from 36 to 9 bubbles/min), light intensity was the limiting factor over that range.',
    },
    {
      id: 'eoc-ch5-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Van Helmont’s willow tree gained 74 kg of dry wood mass by eating soil, and plants only respire at night when there is no sunlight."',
      keywords: ['carbon dioxide', 'air', '64 g', '24 hours', 'compensation point', 'mitochondria'],
      answer: 'Van Helmont’s dry soil lost only ~60 g while the tree gained 74 kg; the dry carbon skeleton of wood comes from atmospheric CO₂ gas entering through stomata. Furthermore, plant mitochondria respire 24 hours a day; in bright light, photosynthesis simply outpaces respiration so net gas exchange is CO₂ uptake and O₂ release.',
    },
    {
      id: 'eoc-ch5-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Trace how the structural architecture of a dicot leaf (waxy cuticle, upper epidermis, palisade mesophyll, spongy mesophyll, xylem/phloem, and stomatal guard cells) solves the plant’s conflict between maximising CO₂ capture and minimising water loss.',
      keywords: ['transparent', 'palisade', 'chloroplasts', 'air spaces', 'guard cells', 'transpiration'],
      answer: 'The transparent waxy cuticle and upper epidermis let light reach tightly packed palisade mesophyll cells rich in chloroplasts while sealing the top surface against evaporation. Spongy mesophyll air spaces allow rapid internal CO₂ diffusion from lower-surface stomata, whose guard cells open by turgor in light and close during drought.',
      twinTitle: 'New Scenario · Glasshouse CO₂ Enrichment on a Cold Cloudy Winter Day',
      twinPrompt: 'A commercial tomato grower pumps extra CO₂ (1,200 ppm) into a glasshouse on a dark, freezing winter afternoon (8 °C) and sees almost zero increase in sugar production. Use Blackman’s Law of Limiting Factors to explain why and prescribe what must change.',
      twinAnswer: 'By Blackman’s Law, photosynthetic rate is governed by whichever factor is in shortest supply. On a dark, cold afternoon, light-dependent ATP/NADPH supply and Calvin-cycle enzyme kinetics at 8 °C limit the rate, so adding extra CO₂ has no effect until light intensity and temperature are raised.',
    },
  ],
  6: [
    {
      id: 'eoc-ch6-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain Peter Mitchell’s chemiosmotic mechanism in mitochondria: how electron transport along the inner mitochondrial membrane actually drives ATP synthesis without a direct chemical high-energy intermediate.',
      keywords: ['protons', 'H+', 'intermembrane', 'gradient', 'ATP synthase', 'rotary'],
      answer: 'NADH and FADH₂ donate electrons to the inner-membrane electron transport chain, which pumps protons (H⁺) into the intermembrane space to build an electrochemical proton-motive force. Protons flowing back down this gradient spin the F₀F₁ ATP synthase rotor, mechanically phosphorylating ADP + Pᵢ into ATP.',
    },
    {
      id: 'eoc-ch6-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'Compare the ATP yield per mole of glucose in aerobic respiration (~30–32 mol ATP) versus anaerobic lactic-acid glycolysis (2 mol ATP). How many times more glucose must a muscle fibre consume anaerobically per minute to match the same ATP production rate?',
      keywords: ['15', '16', '32', '2 ATP', 'glycolysis'],
      answer: 'Aerobic respiration yields 30 to 32 ATP per glucose versus 2 ATP in anaerobic glycolysis — a 15- to 16-fold ratio. Therefore, an anaerobic muscle cell must consume 15 to 16 times more glucose per minute to generate ATP at the same rate.',
    },
    {
      id: 'eoc-ch6-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "During a 400 m sprint, human muscle cells switch to anaerobic fermentation and produce ethanol and carbon dioxide bubbles, causing cramp."',
      keywords: ['lactic acid', 'lactate', 'no CO2', 'yeast', 'oxygen debt', 'liver'],
      answer: 'Human skeletal muscles reduce pyruvate to lactic acid (lactate) with zero CO₂ or ethanol released (glucose → 2 lactic acid); only yeast and some plant tissues decarboxylate pyruvate into ethanol + CO₂. After the sprint, extra oxygen intake (EPOC / oxygen debt) oxidises lactic acid and reconverts it to glucose in the liver.',
    },
    {
      id: 'eoc-ch6-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'A chemical uncoupler (such as 2,4-DNP) makes the inner mitochondrial membrane leaky to protons (H⁺) without blocking the electron transport chain. Predict and explain what happens to (a) ATP production, (b) oxygen consumption rate, and (c) body temperature.',
      keywords: ['proton gradient', 'bypass', 'ATP drops', 'oxygen rises', 'heat'],
      answer: '(a) Protons leak back into the matrix bypassing F₀F₁ ATP synthase, collapsing the proton-motive force so ATP synthesis drops sharply. (b) Without back-pressure from the proton gradient, the electron transport chain runs faster, increasing O₂ consumption. (c) The free energy of glucose oxidation is dissipated directly as heat, dangerously raising body temperature.',
      twinTitle: 'New Scenario · Hibernating Mammal Brown Adipose Tissue (Thermogenin / UCP1)',
      twinPrompt: 'Newborn human infants and hibernating mammals possess brown fat whose mitochondria express a natural protein channel called thermogenin (UCP1) that lets H⁺ flow back into the matrix without making ATP. Explain how UCP1 keeps a newborn warm without shivering.',
      twinAnswer: 'UCP1 provides a regulated proton leak across the inner mitochondrial membrane. As fatty acids are oxidised and protons are pumped out, H⁺ flows back through UCP1 instead of ATP synthase, converting the electrochemical proton gradient directly into life-saving thermal energy (non-shivering thermogenesis).',
    },
  ],
  7: [
    {
      id: 'eoc-ch7-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain why large food polymers (starch, proteins, triglycerides) in the gut lumen cannot be used by body cells directly, and how bile salts (which are not enzymes) speed up lipid digestion by pancreatic lipase.',
      keywords: ['insoluble', 'membrane', 'monomers', 'emulsify', 'surface area', 'lipase'],
      answer: 'Polymers are too large and often insoluble to cross intestinal cell membranes, so hydrolase enzymes must cleave them into absorbable monomers (glucose, amino acids, fatty acids + glycerol). Bile salts physically emulsify large fat globules into tiny droplets, vastly increasing the surface area accessible to water-soluble pancreatic lipase.',
    },
    {
      id: 'eoc-ch7-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A cylindrical tube of small intestine has length 3.0 m and radius r = 1.25 cm (smooth cylinder area ≈ 0.24 m²). Circular folds, villi (×10), and microvilli (×20) multiply the absorptive surface area by ~125-fold in modern morphometric estimates. Calculate the effective absorptive surface area and explain its role in Fick’s Law.',
      keywords: ['30 m²', '125', '0.24', 'Fick', 'surface area'],
      answer: 'Effective absorptive area = 0.24 m² × 125 ≈ 30 m². By Fick’s First Law (J = D · A · ΔC ÷ Δx), multiplying surface area A by 125-fold while keeping the epithelium a single cell thick (Δx ≈ 25 µm) increases monomer absorption rate into capillaries and lacteals 125-fold.',
    },
    {
      id: 'eoc-ch7-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Bile is a digestive enzyme made by the gall bladder that chemically breaks down fat molecules into fatty acids, and stomach acid digests proteins on its own."',
      keywords: ['liver', 'gall bladder stores', 'emulsifies', 'physical', 'pepsin', 'pH 2'],
      answer: 'Bile is synthesised by the liver and stored in the gall bladder; it contains no enzymes and performs physical emulsification, while pancreatic lipase breaks ester bonds chemically. In the stomach, HCl provides the acidic optimum (pH ~2) and unfolds proteins, while the protease enzyme pepsin actually cleaves the peptide bonds.',
    },
    {
      id: 'eoc-ch7-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'A student tests an unknown hospital meal suspension: Iodine stays yellow-brown; Biuret turns purple; Ethanol emulsion gives a cloudy white layer; Benedict’s heated at 80 °C stays blue before digestion, but turns brick-red after incubating with pancreatic juice and bile. Deduce the meal’s composition and explain the post-digestion change.',
      keywords: ['protein', 'lipid', 'no starch', 'no reducing sugar', 'sucrose', 'maltose'],
      answer: 'Before digestion, the meal contains protein (purple Biuret) and lipid (white ethanol emulsion), but no starch (yellow-brown iodine) and no free reducing sugar (blue Benedict’s). If a non-reducing sugar or trace polysaccharide was hydrolysed by intestinal/pancreatic carbohydrases into reducing monosaccharides, Benedict’s turns brick-red after digestion.',
      twinTitle: 'New Scenario · Coeliac Disease Villus Atrophy & Nutritional Deficiency',
      twinPrompt: 'In untreated coeliac disease, an autoimmune reaction to gluten flattens the finger-like villi of the small intestine into a smooth wall. Using Fick’s Law and nutrient roles, explain why the patient develops both weight loss and iron-deficiency anaemia despite eating a balanced diet.',
      twinAnswer: 'Flattening villi drastically reduces absorptive surface area A in Fick’s Law, impairing uptake of glucose/amino acids (causing energy and protein deficit / weight loss) and iron ions (reducing haemoglobin synthesis in red blood cells, causing anaemia and fatigue).',
    },
  ],
  8: [
    {
      id: 'eoc-ch8-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain how William Harvey’s 1628 quantitative cardiac-output calculation demolished Galen’s theory that the liver continuously manufactures new blood from food to be consumed by tissues.',
      keywords: ['stroke volume', 'beats', 'litres', 'exceeds', 'recirculate', 'closed'],
      answer: 'Even with a conservative stroke volume (~60–70 mL) at 60–70 beats/min, the left ventricle pumps ~4 to 5 L/min (>250 L/hour) — far exceeding the entire mass of a human body and any food ingested. Therefore, the same ~5 L of blood must travel in a closed re-circulating loop via capillaries from arteries to veins.',
    },
    {
      id: 'eoc-ch8-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'At rest, Kym’s heart rate is 70 beats/min with a stroke volume of 60 mL/beat. During a run, her heart rate rises to 160 beats/min and stroke volume rises to 90 mL/beat. Calculate her cardiac output (CO = HR × SV) in L/min in both states.',
      keywords: ['4.2', '14.4', '4,200', '14,400'],
      answer: 'At rest: CO = 70 × 60 mL = 4,200 mL/min = 4.20 L/min. During exercise: CO = 160 × 90 mL = 14,400 mL/min = 14.40 L/min (a 3.4-fold increase in oxygen delivery rate).',
    },
    {
      id: 'eoc-ch8-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "All arteries carry oxygenated blood and all veins carry deoxygenated blood, and blood flows fastest in capillaries because they are the narrowest tubes."',
      keywords: ['pulmonary artery', 'pulmonary vein', 'away', 'total cross-sectional area', 'slows'],
      answer: 'Arteries are defined by carrying blood AWAY from the heart: the pulmonary artery carries deoxygenated blood to the lungs, while the pulmonary vein carries oxygenated blood to the left atrium. Although a single capillary is narrow (~8 µm), billions in parallel create a vast total cross-sectional area A_total, so by continuity (v = Q ÷ A_total) blood slows to ~0.5 mm/s for diffusion.',
    },
    {
      id: 'eoc-ch8-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Explain the hydrodynamic advantage of the mammalian four-chambered double circulation over a fish’s two-chambered single circulation, and explain why the left ventricular wall is three times thicker than the right ventricular wall.',
      keywords: ['pressure drops', 'capillaries', 're-pressurise', 'systemic', 'pulmonary', 'oedema'],
      answer: 'Passing blood through gill/lung capillaries causes a steep Poiseuille pressure drop. The mammalian double pump sends oxygenated blood back to the left heart to be re-pressurised (~120 mmHg) by the thick muscular left ventricle for the high-resistance whole-body systemic circuit, while the thinner right ventricle pumps at low pressure (~25 mmHg) to protect delicate alveolar capillaries from fluid leakage.',
      twinTitle: 'New Scenario · Ventricular Septal Defect (VSD "Hole in the Heart") Shunt',
      twinPrompt: 'An infant is born with a gap in the muscular septum between the left and right ventricles (VSD). Given that left ventricular systolic pressure is ~120 mmHg and right ventricular systolic pressure is ~25 mmHg, predict the direction of blood shunting and its effect on pulmonary blood flow (Qp/Qs).',
      twinAnswer: 'Because left ventricular pressure (~120 mmHg) far exceeds right ventricular pressure (~25 mmHg), oxygenated blood shunts left-to-right (LV → RV → pulmonary artery), raising pulmonary flow Qp above systemic flow Qs (Qp/Qs > 1) and overloading the lung capillaries.',
    },
  ],
  9: [
    {
      id: 'eoc-ch9-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Trace how an action potential conducts along a neuron axon and explain why a chemical synapse enforces strictly one-way (unidirectional) signal transmission.',
      keywords: ['sodium', 'depolarisation', 'vesicles', 'neurotransmitter', 'receptors', 'post-synaptic'],
      answer: 'Action potentials propagate as voltage-gated Na⁺ channels open sequentially along the axon membrane. At the synapse, neurotransmitter vesicles are located only in the pre-synaptic terminal and specific ligand-gated receptors sit only on the post-synaptic membrane, so chemical diffusion across the ~20 nm cleft can only trigger impulses in the forward direction.',
    },
    {
      id: 'eoc-ch9-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A finger touches a hot pan 0.80 m from the spinal cord. Sensory and motor myelinated axons conduct at 80 m/s, and the spinal cord relay involves 2 chemical synapses (each adding a 1.0 ms synaptic delay). Calculate the minimum reflex arc latency in milliseconds (ms).',
      keywords: ['22 ms', '10 ms', '2 ms', '0.01'],
      answer: 'Sensory travel time = 0.80 m ÷ 80 m/s = 0.010 s = 10 ms. Motor return time = 0.80 m ÷ 80 m/s = 10 ms. Two synaptic delays = 2 × 1.0 ms = 2.0 ms. Total reflex conduction latency = 10 + 10 + 2 = 22 ms (plus muscle activation time), pulling the hand back before conscious cortical processing.',
    },
    {
      id: 'eoc-ch9-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Nerves conduct electrical currents of free electrons at the speed of light like copper wires, and a plant shoot bends towards a window because sunlight attracts the tip."',
      keywords: ['ions', 'Na+', 'K+', 'membrane', 'auxin', 'shaded side', 'elongation'],
      answer: 'Axons regenerate waves of Na⁺ and K⁺ ion fluxes across the membrane at ~1 to 100 m/s, not free electrons in metal. In plant phototropism, directional blue light causes auxin (IAA) to accumulate on the SHADED side of the shoot tip; auxin stimulates faster cell elongation on the shaded side, curving the shoot towards the light.',
    },
    {
      id: 'eoc-ch9-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Explain the mechanical antagonism between the ciliary muscle and suspensory ligaments when your eye shifts focus (accommodation) from a distant train on Marine Drive to a book 25 cm away.',
      keywords: ['ciliary muscle contracts', 'suspensory ligaments slacken', 'more convex', 'thickens', 'refraction'],
      answer: 'To focus on a near book (diverging rays), the circular ciliary muscle CONTRACTS inward, narrowing its ring diameter so the suspensory ligaments SLACKEN (loosen). Freed from outward tension, the elastic crystalline lens springs into a thicker, more convex shape with shorter focal length, refracting light more strongly onto the fovea.',
      twinTitle: 'New Scenario · Organophosphate Nerve-Toast / Acetylcholinesterase Blockade',
      twinPrompt: 'At the neuromuscular junction, the enzyme acetylcholinesterase (AChE) rapidly hydrolyses acetylcholine in the synaptic cleft after each impulse. Predict and explain what happens to skeletal muscle contraction if a neurotoxin inhibits AChE.',
      twinAnswer: 'Without AChE cleavage, acetylcholine remains bound to post-synaptic receptors in the cleft, continuously depolarising the motor end-plate and causing sustained spastic paralysis (tetanic contraction) unable to relax for breathing.',
    },
  ],
  10: [
    {
      id: 'eoc-ch10-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Using Claude Bernard and Walter Cannon’s concept of negative feedback, explain how the pancreas and liver cooperate to hold blood glucose near ~90 mg/dL (5 mM) both after a sweet mango meal and during an overnight fast.',
      keywords: ['insulin', 'glucagon', 'glycogen', 'liver', 'negative feedback'],
      answer: 'After a meal, rising blood glucose stimulates pancreatic β-cells to secrete insulin, causing liver and muscle cells to absorb glucose and polymerise it into insoluble glycogen. During fasting, falling glucose stimulates pancreatic α-cells to secrete glucagon, which triggers liver glycogenolysis back into blood glucose.',
    },
    {
      id: 'eoc-ch10-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A healthy adult’s two kidneys filter a Glomerular Filtration Rate (GFR) of 125 mL/min, yet excrete only 1.0 mL/min of urine. Calculate the total volume filtered per 24-hour day (in L/day) and the percentage of filtrate reabsorbed by the nephron tubules.',
      keywords: ['180 L', '99.2%', '1.44 L', 'reabsorbed'],
      answer: 'Daily glomerular filtrate = 125 mL/min × 60 min/h × 24 h/day = 180,000 mL/day = 180 L/day. Daily urine = 1.0 × 1,440 = 1.44 L/day. Percentage reabsorbed = ((180 − 1.44) ÷ 180) × 100% = 99.2% reabsorbed back into peritubular capillaries.',
    },
    {
      id: 'eoc-ch10-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "On a hot Mumbai afternoon, skin capillaries move closer to the surface of the skin to let heat out, and the kidney nephron selectively pushes only waste urea out of the glomerulus while keeping glucose in the blood."',
      keywords: ['vasodilation', 'arterioles', 'fixed position', 'ultrafiltration', 'selective reabsorption', 'proximal'],
      answer: 'Capillaries are anchored in fixed positions in the dermis and never move; instead, dermal arterioles widen (vasodilation) to increase warm blood flow through superficial capillaries. In the kidney, glomerular ultrafiltration pushes ALL small solutes (water, glucose, ions, urea) into Bowman’s capsule by pressure; the proximal convoluted tubule then rescues 100% of the glucose via active selective reabsorption.',
    },
    {
      id: 'eoc-ch10-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Compare how clonal selection of B-lymphocytes (antibodies) and phagocytes defend the body against an invading bacterial pathogen, and explain why vaccination prevents disease on a second exposure years later.',
      keywords: ['antigen', 'memory cells', 'antibodies', 'secondary response', 'faster', 'phagocytosis'],
      answer: 'Phagocytes provide non-specific rapid engulfment, while only the specific B- and T-lymphocyte clones whose receptors complement the pathogen’s 3D antigen divide by mitosis into plasma cells (secreting antibodies) and long-lived memory cells. A vaccine introduces harmless antigens first so memory cells mount a vastly faster, higher-titre secondary antibody response upon real infection.',
      twinTitle: 'New Scenario · Untreated Type 1 Diabetes Glucosuria & Osmotic Diuresis',
      twinPrompt: 'In untreated Type 1 diabetes, blood glucose rises to 300 mg/dL — exceeding the maximum transport rate (T_max) of SGLTcotransporters in the kidney’s proximal convoluted tubule. Explain why glucose appears in the urine and why the patient suffers extreme thirst and frequent urination.',
      twinAnswer: 'Once filtered glucose exceeds the proximal tubule’s SGLT carrier capacity (renal threshold ~180 mg/dL), unabsorbed glucose remains in the tubule filtrate. This lowers the filtrate’s water potential, opposing osmotic water reabsorption in the collecting duct so large volumes of water are lost in urine (osmotic diuresis).',
    },
  ],
  11: [
    {
      id: 'eoc-ch11-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain how Oswald Avery’s enzyme destruction trials (1944) and Hershey & Chase’s ³²P / ³⁵S bacteriophage blender experiment (1952) proved that DNA — not protein — is the molecule of heredity.',
      keywords: ['DNase', 'protease', 'phosphorus', '32P', 'sulfur', '35S'],
      answer: 'Avery showed that proteases and RNase left the bacterial transforming principle intact, whereas DNase abolished heredity completely. Hershey & Chase labelled phage DNA with radioactive ³²P and protein coats with ³⁵S; only ³²P entered the host bacteria to direct new virus production, while ³⁵S remained outside in the sheared protein ghosts.',
    },
    {
      id: 'eoc-ch11-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A double-stranded DNA genome contains 22% Cytosine (C). Using Watson–Crick base-pairing rules (Chargaff’s rules), calculate the percentages of Guanine (G), Adenine (A), and Thymine (T).',
      keywords: ['22%', '28%', '56%', '44%', 'hydrogen bonds'],
      answer: 'By complementary base pairing (C pairs with G via 3 hydrogen bonds; A pairs with T via 2 hydrogen bonds): %G = %C = 22% (together 44%). The remaining 100% − 44% = 56% is split equally between A and T, so %A = 28% and %T = 28%.',
    },
    {
      id: 'eoc-ch11-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "During DNA replication, the original parent double helix stays intact while a brand-new double helix is copied alongside it, and amino acids fold back into RNA to rewrite DNA."',
      keywords: ['semi-conservative', 'Meselson', 'Stahl', 'template', 'Central Dogma', 'Crick'],
      answer: 'Meselson and Stahl’s ¹⁵N/¹⁴N density-gradient centrifugation proved replication is semi-conservative: each daughter DNA molecule retains one original template strand paired with one newly synthesised strand. By Crick’s Central Dogma, sequence information flows from nucleic acids to protein (DNA → RNA → Protein) and never backward from protein to nucleic acid.',
    },
    {
      id: 'eoc-ch11-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'In the sickle-cell β-globin mutation, a single DNA base substitution (CTC → CAC on the template strand; GAG → GTG on the coding strand) replaces hydrophilic Glutamate (Glu) with hydrophobic Valine (Val) at position 6. Trace this causal chain from DNA codon to capillary crisis.',
      keywords: ['mRNA', 'GUG', 'ribosome', 'valine', 'hydrophobic', 'haemoglobin'],
      answer: 'Transcription of the mutated template triplet CAC produces mRNA codon GUG instead of GAG. At the ribosome, tRNA inserts hydrophobic Valine instead of charged Glutamate on the β-globin surface. Under low oxygen, the exposed hydrophobic patch causes deoxy-HbS molecules to polymerise into rigid fibres that sickle red blood cells and block micro-capillaries.',
      twinTitle: 'New Scenario · Meselson–Stahl Generation 2 Density Bands in ¹⁴N Medium',
      twinPrompt: 'E. coli grown for many generations in heavy ¹⁵N medium are shifted to light ¹⁴N medium for exactly TWO rounds of semi-conservative replication. Predict the exact fraction of hybrid (¹⁵N/¹⁴N) versus all-light (¹⁴N/¹⁴N) DNA duplexes after Generation 2.',
      twinAnswer: 'After Generation 1, 100% of DNA duplexes are hybrid (¹⁵N/¹⁴N). When those two hybrid duplexes unwind for Generation 2 in ¹⁴N medium, the 2 heavy strands each pair with a new ¹⁴N strand (2 hybrid duplexes = 50%) and the 2 light strands each pair with a new ¹⁴N strand (2 all-light duplexes = 50%).',
    },
  ],
  12: [
    {
      id: 'eoc-ch12-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Contrast the chromosome behaviour and biological purpose of Mitosis versus Meiosis in a human whose diploid somatic cells have 2n = 46 chromosomes.',
      keywords: ['46', '23', 'diploid', 'haploid', 'homologous', 'crossing over'],
      answer: 'Mitosis is a single division separating sister chromatids to produce 2 genetically identical diploid cells (2n = 46) for growth and tissue repair. Meiosis separates homologous chromosome pairs in Meiosis I (with crossing-over and independent assortment) and sister chromatids in Meiosis II, producing 4 genetically unique haploid gametes (n = 23) so fertilisation restores 2n = 46.',
    },
    {
      id: 'eoc-ch12-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'A single fertilised zygote divides by synchronous mitosis every 24 hours. How many cells are present after 10 divisions (2¹⁰), and how many combinations of maternal/paternal chromosomes can one human parent produce by independent assortment alone (2²³) without crossing over?',
      keywords: ['1,024', '8.4 million', '8,388,608', '2^23'],
      answer: 'After 10 mitotic divisions: 2¹⁰ = 1,024 diploid cells. In human meiosis with n = 23 homologous pairs, independent assortment alone yields 2²³ = 8,388,608 (~8.4 million) distinct chromosome combinations per gamete (and ~7 × 10¹³ zygote combinations per couple before crossing over).',
    },
    {
      id: 'eoc-ch12-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Your liver cells and retina photoreceptors look different because liver cells delete the eye genes during mitosis, and a chromosome is always X-shaped throughout the cell cycle."',
      keywords: ['genomic equivalence', 'same DNA', 'gene expression', 'transcription factors', 'S phase', 'chromatids'],
      answer: 'Every nucleated somatic cell retains the complete diploid genome (genomic equivalence); liver and retina cells differ because tissue-specific transcription factors transcribe different subsets of genes (differential gene expression). A chromosome is only X-shaped (two sister chromatids joined at a centromere) AFTER DNA replication in S-phase until anaphase.',
    },
    {
      id: 'eoc-ch12-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Explain how a cell-cycle tumour-suppressor checkpoint (such as p53 at the G₁/S boundary) normally prevents cancer when UV radiation damages DNA, and why losing both copies of a tumour-suppressor brake allows uncontrolled clonal division.',
      keywords: ['checkpoint', 'p53', 'repair', 'apoptosis', 'mutation', 'mitosis'],
      answer: 'When DNA damage is detected at the G₁/S checkpoint, p53 halts the cell cycle to allow DNA repair enzymes to fix the lesion, or triggers programmed cell death (apoptosis) if damage is irreparable. If mutations inactivate both alleles of the p53 brake alongside an overactive proto-oncogene accelerator, damaged cells replicate mutated DNA unchecked.',
      twinTitle: 'New Scenario · Taxol / Colchicine Spindle-Microtubule Arrest in Metaphase',
      twinPrompt: 'The plant alkaloid colchicine (and cancer drug paclitaxel/Taxol) disrupts mitotic spindle microtubule assembly/depolymerisation. At which phase of mitosis do dividing cells become arrested, and why can sister chromatids no longer segregate into daughter nuclei?',
      twinAnswer: 'Dividing cells arrest at Metaphase because kinetochore spindle microtubules cannot generate the tension and depolymerisation forces needed to trigger the Spindle Assembly Checkpoint and pull sister chromatids apart at Anaphase.',
    },
  ],
  13: [
    {
      id: 'eoc-ch13-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Explain how Gregor Mendel’s particulate model of two discrete alleles per trait (Law of Segregation) solved Darwin’s nightmare of "blending inheritance" when two heterozygous purple-flowered pea plants (Pp × Pp) are crossed.',
      keywords: ['discrete', 'alleles', 'segregate', 'gametes', '3:1', 'pp'],
      answer: 'Under blending inheritance, pink/purple intermediates would dilute variation away within a few generations. Mendel showed that the recessive white allele (p) remains physically unaltered inside a purple Pp heterozygote; during gamete formation (meiosis), P and p segregate cleanly (½ P, ½ p), so Pp × Pp regenerates pure white pp offspring 25% of the time (3 purple : 1 white).',
    },
    {
      id: 'eoc-ch13-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'Two healthy parents are both heterozygous carriers (Cc) for cystic fibrosis (an autosomal recessive condition). Draw or calculate from a 2×2 Punnett square: (a) the probability that a child has cystic fibrosis (cc), and (b) the probability that a healthy (unaffected) child of theirs is a carrier (Cc).',
      keywords: ['25%', '1/4', '2/3', '66.7%', 'CC', 'Cc'],
      answer: '(a) Punnett outcomes for Cc × Cc are 1 CC : 2 Cc : 1 cc, so P(cc affected) = ¼ = 25%. (b) Given the child is unaffected (not cc, leaving 3 equally likely genotypes: 1 CC and 2 Cc), the conditional probability of being a carrier is 2/3 ≈ 66.7%.',
    },
    {
      id: 'eoc-ch13-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "Because the Huntington’s or polydactyly allele is dominant, it must be the most common allele in the human population, and if Cc × Cc parents have one cc child, their next three children are guaranteed to be unaffected."',
      keywords: ['dominance', 'frequency', 'phenotype', 'heterozygote', 'independent', '1/4'],
      answer: 'Dominance describes only how an allele expresses in a heterozygote (masking the recessive allele), NOT its population frequency — lethal or rare dominant alleles remain very rare in populations. Furthermore, fertilisation events are statistically independent (gambler’s fallacy): every pregnancy of Cc × Cc parents carries the exact same ¼ (25%) probability of cc.',
    },
    {
      id: 'eoc-ch13-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Explain why X-linked recessive traits (such as red-green colour blindness or haemophilia A, Xⁿ) appear far more frequently in human males (XY) than in females (XX), and trace why an affected father (XⁿY) can never pass the condition to his son.',
      keywords: ['hemizygous', 'one X', 'Y chromosome', 'carrier', 'daughter', 'q^2'],
      answer: 'Males are hemizygous (XY) with only one X chromosome, so a single recessive allele Xⁿ expresses with probability q, whereas a female (XX) must inherit two copies (XⁿXⁿ, probability q² ≪ q). A father always contributes his Y chromosome to his sons and his Xⁿ chromosome to his daughters (who become carriers).',
      twinTitle: 'New Scenario · ABO Blood Group Codominance & Paternity Exclusion',
      twinPrompt: 'In the human ABO system, alleles I^A and I^B are codominant and both are dominant over i (Type O = ii). A mother with Type A blood and a father with Type B blood have a baby with Type O blood. Deduce the exact genotypes of both parents and calculate the probability that their next child will have Type AB blood.',
      twinAnswer: 'For the baby to be Type O (ii), it must inherit an i allele from each parent, proving the mother is heterozygous I^A i and the father is heterozygous I^B i. Crossing I^A i × I^B i gives ¼ I^A I^B (Type AB), ¼ I^A i (Type A), ¼ I^B i (Type B), and ¼ ii (Type O) — so P(Type AB) = 25%.',
    },
  ],
  14: [
    {
      id: 'eoc-ch14-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Using Luria & Delbrück’s fluctuation test (1943) and the Grants’ Galápagos finch beak measurements, explain why mutations are random with respect to need while natural selection is non-random.',
      keywords: ['pre-existing', 'random', 'selection pressure', 'differential survival', 'allele frequency'],
      answer: 'Mutations arise randomly from replication errors before the organism encounters an environmental challenge (as Luria & Delbrück proved with pre-existing phage-resistant bacterial mutants). Natural selection is non-random because environmental pressures consistently favour individuals whose pre-existing heritable traits confer higher survival and reproductive success.',
    },
    {
      id: 'eoc-ch14-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'In a population in Hardy–Weinberg equilibrium (p² + 2pq + q² = 1), 9% of individuals show the homozygous recessive phenotype (q² = 0.09). Calculate the recessive allele frequency q, the dominant allele frequency p, and the percentage of heterozygous carriers (2pq).',
      keywords: ['0.30', '0.70', '42%', '0.42', 'Hardy-Weinberg'],
      answer: 'Since q² = 0.09, recessive allele frequency q = √0.09 = 0.30. Dominant allele frequency p = 1 − q = 1 − 0.30 = 0.70. Heterozygous carrier frequency 2pq = 2 × 0.70 × 0.30 = 0.42 = 42% of the population.',
    },
    {
      id: 'eoc-ch14-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "When exposed to an antibiotic, individual bacteria mutate on purpose in order to become resistant and adapt during their lifetime."',
      keywords: ['Lamarckian', 'populations evolve', 'pre-existing', 'kills susceptible', 'reproduce'],
      answer: 'Individual organisms never evolve or direct mutations to meet a need (a Lamarckian fallacy). Random mutations already exist in a tiny fraction of bacteria before the antibiotic arrives; the antibiotic acts as a selection pressure that kills susceptible cells, leaving resistant mutants to divide and shift the population’s allele frequency.',
    },
    {
      id: 'eoc-ch14-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Explain the evolutionary balancing act (heterozygote advantage) that maintains the sickle-cell allele (HbS) at high frequency (~10–20%) in malaria-endemic regions of Central Africa and parts of India despite HbS/HbS homozygosity being severely harmful.',
      keywords: ['heterozygote', 'HbA/HbS', 'Plasmodium', 'malaria', 'balancing selection', 'fitness'],
      answer: 'In *Plasmodium falciparum* malaria zones, HbA/HbA homozygotes suffer high mortality from severe malaria, while HbS/HbS homozygotes suffer lethal sickle-cell disease. Heterozygotes (HbA/HbS) clear infected cells faster and resist severe cerebral malaria without clinical sickling, giving heterozygotes the highest reproductive fitness (balancing selection).',
      twinTitle: 'New Scenario · Industrial Melanism Reversal in Peppered Moths After Clean Air Acts',
      twinPrompt: 'After British Clean Air legislation reduced coal soot on birch tree bark from the 1960s onward, the frequency of the dark (carbonaria) peppered moth allele fell steadily while the pale speckled (typica) allele rose. Trace the four Darwinian steps driving this reversal.',
      twinAnswer: '1. Heritable genetic variation existed (pale typica vs dark carbonaria alleles). 2. As pale lichen regrew on clean bark, dark moths became conspicuous to insectivorous birds (selection pressure). 3. Pale moths survived bird predation at higher rates and reproduced. 4. Over generations, the pale allele frequency rose in the population.',
    },
  ],
  15: [
    {
      id: 'eoc-ch15-r1',
      rung: '1 · Mechanism Explain-Back',
      marks: 2,
      prompt: 'Using the First and Second Laws of Thermodynamics and Lindeman’s 10% trophic efficiency rule, explain why ecosystems require a continuous input of solar energy whereas carbon and nitrogen atoms are recycled indefinitely.',
      keywords: ['respiration', 'heat', '10%', 'entropy', 'decomposers', 'cycles'],
      answer: 'At every trophic transfer, ~90% of chemical energy is lost as unrecoverable metabolic heat via cellular respiration or unassimilated detritus (Second Law of Thermodynamics), so energy flows one-way and limits food chains to 4–5 levels. Atoms (C, N, P) are never destroyed; decomposers and biogeochemical cycles return them to inorganic pools for producers.',
    },
    {
      id: 'eoc-ch15-r2',
      rung: '2 · Quantitative & Unit Check',
      marks: 3,
      prompt: 'Phytoplankton in a coastal bay fix 20,000 kJ/m²/yr of net primary production. Assuming a 10% trophic transfer efficiency at each step (Phytoplankton → Zooplankton → Small Fish → Osprey), calculate the energy available to the Osprey population and the energy lost between Phytoplankton and Osprey.',
      keywords: ['20 kJ', '2,000', '200', '19,980'],
      answer: 'Zooplankton receive 20,000 × 0.10 = 2,000 kJ; Small Fish receive 2,000 × 0.10 = 200 kJ; Osprey receive 200 × 0.10 = 20 kJ/m²/yr (only 0.1% of primary production, with 19,980 kJ/m²/yr dissipated as respiratory heat and detritus along the chain).',
    },
    {
      id: 'eoc-ch15-r3',
      rung: '3 · Misconception Autopsy',
      marks: 3,
      prompt: 'Spot & repair the flaw: "The arrows in a food chain point from the predator to the prey it eats, and removing top predators like sea otters or wolves always makes an ecosystem healthier and more diverse."',
      keywords: ['direction of energy flow', 'eaten by', 'keystone species', 'trophic cascade', 'urchins', 'kelp'],
      answer: 'Food-chain arrows always point from the organism being eaten TO the consumer to represent the direction of energy and matter transfer. As Robert Paine showed, top predators often act as keystone species: removing sea otters triggers a trophic cascade where sea urchins multiply unchecked and graze down entire kelp forests, collapsing biodiversity.',
    },
    {
      id: 'eoc-ch15-r4',
      rung: '4 · Synthesis & Transfer Twin',
      marks: 4,
      prompt: 'Trace the step-by-step causal cascade of cultural eutrophication when agricultural nitrate/phosphate fertiliser runoff enters a warm lake, and distinguish bioaccumulation from biomagnification for a persistent toxin like methylmercury.',
      keywords: ['algal bloom', 'blocks light', 'decomposers', 'aerobic bacteria', 'anoxia', 'bioaccumulation', 'biomagnification'],
      answer: 'Excess nitrates/phosphates trigger a dense surface algal bloom that blocks light to submerged plants. When the algae and plants die, aerobic decomposer bacteria multiply rapidly and consume dissolved oxygen via cellular respiration, creating hypoxic dead zones that suffocate fish. Bioaccumulation is toxin build-up within ONE organism over its life; biomagnification is toxin concentration multiplying UP trophic levels.',
      twinTitle: 'New Scenario · Diclofenac Vulture Collapse Across India',
      twinPrompt: 'In the 1990s, traces of the veterinary drug diclofenac in cattle carcasses caused a >95% collapse in Indian Gyps vulture populations. Explain (a) why vultures at the top of the scavenging chain suffered lethal kidney failure from low tissue concentrations, and (b) the ecological cascade that followed their loss.',
      twinAnswer: '(a) Diclofenac persisted in treated livestock carcasses; scavenging vultures consumed large quantities of tissue, concentrating the nephrotoxic drug to lethal levels. (b) Losing the keystone scavenger allowed rotting carcasses and feral dog populations (and rabies transmission risk) to surge across affected regions.',
    },
  ],
};

// ------------------------------------------------------------------ Boot & UI Orchestration
App.ready(() => {
  const state = store.get('mastery', { cards: {}, skills: {}, proofs: {}, links: [] });
  state.cards = state.cards || {};
  state.skills = state.skills || {};
  state.proofs = state.proofs || {};
  state.links = state.links || [];

  const save = () => store.set('mastery', state);

  function recordCheck({
    id,
    chapterId = 'ch-1',
    skillId = 'core',
    isCorrect,
    usedHelp = false,
    isClosedChoice = false,
    responseTimeMs = 4500,
    nowMs = Date.now(),
  }) {
    if (!id) return null;
    const day = localDayKey(nowMs);
    const prevProof = state.proofs[id] || {
      id,
      chapterId,
      skillId,
      status: 'unseen',
      distinctDays: 0,
      lastProvenDay: null,
      lastWrongAtMs: null,
    };

    const isRapidBruteForce =
      Boolean(isCorrect) &&
      !usedHelp &&
      isClosedChoice &&
      ((prevProof.lastWrongAtMs != null && nowMs - prevProof.lastWrongAtMs < 5000) || responseTimeMs < 1200);

    let skill = state.skills[skillId] || createSkill(skillId);
    if (!isRapidBruteForce) {
      skill = updateBKT(skill, Boolean(isCorrect), Boolean(usedHelp));
      state.skills[skillId] = skill;

      if (state.links.length && (!isCorrect || !usedHelp)) {
        for (const adj of propagateImplicitCredit(skillId, Boolean(isCorrect) && !usedHelp, state.links)) {
          const pre = state.skills[adj.skillID] || createSkill(adj.skillID);
          pre.pLearned = Math.min(0.99, Math.max(0.05, pre.pLearned + adj.bktDelta));
          state.skills[adj.skillID] = pre;
        }
      }
    }

    let card = state.cards[id] || createCard();
    const proof = { ...prevProof, chapterId, skillId, updatedAtMs: nowMs };

    if (!isCorrect) {
      proof.distinctDays = 0;
      proof.lastProvenDay = null;
      proof.lastWrongAtMs = nowMs;
      proof.status = proof.status === 'proven' || proof.status === 'secure' ? 'retest_scheduled' : 'working';
      const scheduled = scheduleFSRS(card, ratingFromAttempt(false, responseTimeMs), nowMs);
      card = { ...scheduled.card, dueAtMs: scheduled.dueAtMs };
      state.cards[id] = card;
    } else if (usedHelp) {
      proof.distinctDays = 0;
      proof.lastProvenDay = null;
      proof.status = proof.status === 'proven' || proof.status === 'secure' ? 'retest_scheduled' : 'assisted';
    } else if (isRapidBruteForce) {
      if (proof.status === 'unseen') proof.status = 'working';
    } else {
      if (proof.lastProvenDay !== day) {
        proof.distinctDays += 1;
        proof.lastProvenDay = day;
      }
      proof.status = proof.distinctDays >= 2 && skill.pLearned >= 0.85 ? 'secure' : 'proven';
      const profile = isClosedChoice ? 'conceptual_choice' : 'multi_step_derivation';
      const scheduled = scheduleFSRS(card, ratingFromAttempt(true, responseTimeMs, profile), nowMs);
      card = { ...scheduled.card, dueAtMs: scheduled.dueAtMs };
      state.cards[id] = card;
    }

    state.proofs[id] = proof;
    save();
    return { skill, proof, card };
  }

  function reviewFlashcard(id, chapterId, skillId, rating, nowMs = Date.now()) {
    if (!id) return null;
    const cur = state.cards[id] || createCard();
    const scheduled = scheduleFSRS(cur, rating, nowMs);
    const card = { ...scheduled.card, dueAtMs: scheduled.dueAtMs };
    state.cards[id] = card;
    const isCorrect = rating >= FSRS_RATING.GOOD;
    const prevProof = state.proofs[id] || {
      id,
      chapterId,
      skillId,
      status: 'unseen',
      distinctDays: 0,
      lastProvenDay: null,
      lastWrongAtMs: null,
    };
    const day = localDayKey(nowMs);
    const proof = { ...prevProof, chapterId, skillId, updatedAtMs: nowMs };
    if (!isCorrect) {
      proof.status = 'retest_scheduled';
      proof.distinctDays = 0;
    } else {
      if (proof.lastProvenDay !== day) {
        proof.distinctDays += 1;
        proof.lastProvenDay = day;
      }
      proof.status = proof.distinctDays >= 2 ? 'secure' : 'proven';
    }
    state.proofs[id] = proof;
    save();
    App.emit('learn:change');
    return { card, proof, intervalDays: scheduled.intervalDays };
  }

  function dueChecks(nowMs = Date.now(), maxSitting = 6) {
    const today = localDayKey(nowMs);
    const candidates = Object.values(state.proofs).filter(p => {
      const updatedDay = p.updatedAtMs ? localDayKey(p.updatedAtMs) : '';
      if (p.status === 'retest_scheduled' && updatedDay !== today) return true;
      if (p.status === 'assisted' && updatedDay !== today) return true;
      if (p.status === 'proven' && p.lastProvenDay && p.lastProvenDay !== today) return true;
      const card = state.cards[p.id];
      return Boolean(card && card.dueAtMs && card.dueAtMs <= nowMs && updatedDay !== today);
    });
    return interleaveItems(candidates, maxSitting, x => x.chapterId, x => x.skillId);
  }

  // ------------------------------------------------------------------ Harvest Multi-Modal Flashcards & Quizzes from Book DOM
  const flashcardsByChapter = new Map();
  const quizzesByChapter = new Map();
  const allFlashcardsList = [];

  function harvestChapterDeck(chEl) {
    const chNum = Number(chEl.id.replace('ch', ''));
    const chapterId = `ch-${chNum}`;
    const chTitle = clean(chEl.querySelector('.opener h2')?.textContent) || `Chapter ${chNum}`;
    const cards = [];

    // 1. Margin Definitions (:::note) -> Bidirectional Term <-> Mechanism cards
    chEl.querySelectorAll('aside.side.def').forEach((note, idx) => {
      const b = note.querySelector('b');
      if (!b) return;
      const term = clean(b.textContent);
      const clone = note.cloneNode(true);
      const bClone = clone.querySelector('b');
      if (bClone) bClone.remove();
      const defText = clean(clone.textContent);
      if (!term || !defText) return;
      const sec = note.closest('section.sec[id]');
      const secLabel = sec ? sec.id.replace(/^s/, '').replace('-', '.') : `${chNum}`;
      const keyTerms = [
        ...term.split(/\s+/),
        ...(defText.match(/\b[A-Za-z]{5,}\b/g) || []).slice(0, 6),
      ];
      const escapedTermRx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const maskedDef = defText.replace(escapedTermRx, '________');
      cards.push({
        id: `fc-ch${chNum}-term-${idx + 1}`,
        chNum,
        chapterId,
        chTitle,
        skillId: secLabel,
        kind: 'term',
        kindLabel: 'Key Term & Mechanism',
        title: term,
        frontPrompt: `What is “${term}” in biology, and what physical or cellular role does it perform?`,
        backAnswer: defText,
        reversePrompt: `Name the biological term for: “${maskedDef}”`,
        reverseAnswer: `${term} — ${defText}`,
        keyTerms,
        anchor: sec ? sec.id : chEl.id,
      });
    });

    // 2. Misconception Traps (:::careful) -> Spot & Repair cards
    chEl.querySelectorAll('.box.careful').forEach((box, idx) => {
      const bq = box.querySelector('blockquote');
      const myth = clean(bq ? bq.textContent : '');
      const paras = [...box.querySelectorAll(':scope > p:not(.bh)')].map(p => clean(p.textContent)).filter(Boolean);
      const fix = paras.join(' ');
      if (!myth || !fix) return;
      const sec = box.closest('section.sec[id]');
      const secLabel = sec ? sec.id.replace(/^s/, '').replace('-', '.') : `${chNum}`;
      cards.push({
        id: `fc-ch${chNum}-trap-${idx + 1}`,
        chNum,
        chapterId,
        chTitle,
        skillId: secLabel,
        kind: 'trap',
        kindLabel: 'Misconception Trap',
        title: `Spot the Flaw · Sec ${secLabel}`,
        frontPrompt: `A student claims: ${myth} — Why is this tempting idea wrong, and what actually happens?`,
        backAnswer: fix,
        reversePrompt: `Which common misconception in Section ${secLabel} is refuted by: “${fix.slice(0, 140)}…”?`,
        reverseAnswer: `Tempting myth: ${myth} — Correction: ${fix}`,
        keyTerms: (fix.match(/\b[A-Za-z]{5,}\b/g) || []).slice(0, 7),
        anchor: sec ? sec.id : chEl.id,
      });
    });

    // 3. Section Checks & Spaced Recalls (:::check / :::recall)
    chEl.querySelectorAll('.box.check[id]:not(.five-turn)').forEach(box => {
      const tpl = box.querySelector('template.chk-a');
      if (!tpl) return;
      const q = clean([...box.children].filter(x => x.tagName === 'P' && !x.classList.contains('bh') && !x.classList.contains('ans')).map(x => x.textContent).join(' '));
      const tmp = document.createElement('div');
      tmp.append(tpl.content.cloneNode(true));
      const a = clean(tmp.textContent);
      if (!q || !a) return;
      const isRecall = box.classList.contains('recall');
      const sec = box.closest('section.sec[id]');
      const secLabel = sec ? sec.id.replace(/^s/, '').replace('-', '.') : `${chNum}`;
      const bolds = [...tmp.querySelectorAll('b, strong')].map(n => clean(n.textContent)).filter(Boolean);
      cards.push({
        id: `fc-${box.id}`,
        chNum,
        chapterId,
        chTitle,
        skillId: secLabel,
        kind: isRecall ? 'recall' : 'check',
        kindLabel: isRecall ? 'Cross-Chapter Recall' : 'Mechanism Check',
        title: `Section ${secLabel} Check`,
        frontPrompt: q,
        backAnswer: a,
        reversePrompt: q,
        reverseAnswer: a,
        keyTerms: bolds.length ? bolds : (a.match(/\b[A-Za-z]{5,}\b/g) || []).slice(0, 6),
        anchor: box.id,
      });
    });

    // 4. Cheat Sheet Quantitative & Boundary Rows (:::cheatsheet)
    chEl.querySelectorAll('.cheat-sheet-card tbody tr').forEach((tr, idx) => {
      const tds = [...tr.querySelectorAll('td')].map(td => clean(td.textContent));
      if (tds.length < 4) return;
      const [rule, quant, limit, trap] = tds;
      const head = rule.split(':')[0] || `Rule ${idx + 1}`;
      cards.push({
        id: `fc-ch${chNum}-sheet-${idx + 1}`,
        chNum,
        chapterId,
        chTitle,
        skillId: `${chNum}.sheet`,
        kind: 'quant',
        kindLabel: 'Cheat-Sheet Rule & Quantitative Anchor',
        title: head,
        frontPrompt: `For “${head}” (Chapter ${chNum}): state the plain-English rule, its quantitative anchor/equation, and its top misconception trap.`,
        backAnswer: `Rule: ${rule}\nQuantitative anchor: ${quant}\nWhere the model breaks: ${limit}\nTop trap: ${trap}`,
        reversePrompt: `Which Chapter ${chNum} principle is anchored by “${quant}” and guards against the trap ${trap}?`,
        reverseAnswer: `${rule} (Model boundary: ${limit})`,
        keyTerms: (rule + ' ' + quant).match(/\b[A-Za-z0-9µ°]{4,}\b/g) || [],
        anchor: chEl.id,
      });
    });

    flashcardsByChapter.set(chNum, cards);
    allFlashcardsList.push(...cards);

    // Build 5-Question Interleaved Checkpoint Quiz for Chapter chNum
    const quizItems = [];
    // Q1 & Q2: From chapter :::predict blocks
    chEl.querySelectorAll('.box.predict[data-predict]').forEach((pbox, idx) => {
      if (quizItems.length >= 2) return;
      const pq = clean(pbox.querySelector('.pq')?.textContent);
      const opts = [...pbox.querySelectorAll('.pred-opts li')].map(li => clean(li.textContent));
      const rev = clean(pbox.querySelector('.pred-reveal')?.textContent).replace(/^What happens\s*/i, '');
      if (!pq || opts.length < 2) return;
      let ansIdx = 1;
      const lowRev = rev.toLowerCase();
      if (/\bfirst\s+(choice|option|outcome|explanation)\b/.test(lowRev)) ansIdx = 0;
      else if (/\bsecond\s+(choice|option|outcome|explanation)\b/.test(lowRev)) ansIdx = 1;
      else if (/\bthird\s+(choice|option|outcome|explanation)\b/.test(lowRev) && opts.length >= 3) ansIdx = 2;
      else if (/^no\b/i.test(rev)) {
        const ni = opts.findIndex(o => /^no\b/i.test(o));
        if (ni >= 0) ansIdx = ni;
      } else if (/^yes\b/i.test(rev)) {
        const yi = opts.findIndex(o => /^yes\b/i.test(o));
        if (yi >= 0) ansIdx = yi;
      }
      quizItems.push({
        id: `qz-ch${chNum}-pred-${idx + 1}`,
        badge: idx === 0 ? '1 · Prediction Hinge' : '2 · Mechanism Discrimination',
        prompt: pq,
        options: opts,
        correctIndex: Math.min(ansIdx, opts.length - 1),
        explanation: rev,
      });
    });

    // Q3: From Synthesis Rung 2 (Quantitative Problem) converted into a 3-choice quantitative check
    const synth = CHAPTER_SYNTHESIS_BANK[chNum] || [];
    if (synth[1]) {
      const q2 = synth[1];
      const correctKw = q2.keywords[0] || 'Exact calculated value';
      quizItems.push({
        id: `qz-ch${chNum}-quant`,
        badge: '3 · Quantitative & Unit Check',
        prompt: q2.prompt,
        options: [
          `Result anchored by ${correctKw} — ${q2.answer.split('.')[0]}.`,
          `Tenfold unit-conversion slip (forgetting 1 mm = 1,000 µm or inverting the ratio in the formula).`,
          `Linear scaling assumption (treating volume, concentration, or inverse-square intensity as a 1:1 linear change).`,
        ],
        correctIndex: 0,
        explanation: q2.answer,
      });
    }

    // Q4: From Synthesis Rung 3 (Misconception Autopsy)
    if (synth[2]) {
      const q3 = synth[2];
      quizItems.push({
        id: `qz-ch${chNum}-autopsy`,
        badge: '4 · Misconception Autopsy',
        prompt: q3.prompt,
        options: [
          'The student’s claim is completely accurate and needs no correction.',
          q3.answer,
          'The effect depends on a vital force rather than physical gradients, enzymes, or cellular structures.',
        ],
        correctIndex: 1,
        explanation: q3.answer,
      });
    }

    // Q5: Spaced Lagged Recall from an earlier chapter (or Synthesis Rung 4 for Ch 0)
    const prevCh = chNum > 0 ? chNum - 1 : 0;
    const prevSynth = (CHAPTER_SYNTHESIS_BANK[prevCh] || [])[0];
    if (prevSynth && chNum > 0) {
      quizItems.push({
        id: `qz-ch${chNum}-lagged-ch${prevCh}`,
        badge: `5 · Spaced Recall from Chapter ${prevCh}`,
        prompt: `[Lagged Retrieval · Ch ${prevCh}] ${prevSynth.prompt}`,
        options: [
          prevSynth.answer,
          'It occurs spontaneously without enzymes, gradients, or physical structure.',
          'Only macroscopic organs change; molecular and cellular boundaries play no role.',
        ],
        correctIndex: 0,
        explanation: `Spaced retrieval from Chapter ${prevCh}: ${prevSynth.answer}`,
      });
    } else if (synth[3]) {
      quizItems.push({
        id: `qz-ch${chNum}-synth`,
        badge: '5 · Cross-Scale Synthesis',
        prompt: synth[3].prompt,
        options: [
          synth[3].answer,
          'A single instrument or uncoupled reaction can perform both tasks without physical trade-offs.',
          'Resolution and energy coupling depend only on specimen size, never on wavelength or enzymes.',
        ],
        correctIndex: 0,
        explanation: synth[3].answer,
      });
    }

    quizzesByChapter.set(chNum, quizItems);
  }

  document.querySelectorAll('article.chapter[id]').forEach(harvestChapterDeck);

  // ------------------------------------------------------------------ Render End-of-Chapter Mastery Studio in Every Chapter
  const CONF_STOPS = [
    ['sure', 'Sure'],
    ['guess', '50–50 guess'],
    ['unsure', 'Not sure'],
  ];

  function matchesKeyword(text, kw) {
    const hay = clean(text).toLowerCase();
    const needle = clean(kw).toLowerCase();
    if (!hay || !needle) return false;
    if (hay.includes(needle)) return true;
    const parts = needle.split(/\s+/).filter(w => w.length >= 3);
    return parts.length > 0 && parts.every(p => hay.includes(p));
  }

  function buildEocQuestionCard(q, chNum) {
    const key = 'eoc:' + q.id;
    const saved = store.get(key, {});
    let usingTwin = Boolean(saved.twin);

    const card = el('article', { class: 'eoc-q-card', id: q.id });
    const rungBadge = el('span', { class: 'eoc-q-rung' }, q.rung);
    const marksBadge = el('span', { class: 'eoc-q-marks' }, `${q.marks} marks`);
    const topBar = el('div', { class: 'eoc-q-head' }, rungBadge, marksBadge);

    if (q.twinPrompt) {
      const twinBtn = el('button', {
        type: 'button',
        class: 'lj-chip eoc-twin-btn',
        'aria-pressed': String(usingTwin),
      }, usingTwin ? 'Showing Transfer Twin · Switch to Original' : 'Try Transfer Twin (New Scenario)');
      twinBtn.addEventListener('click', () => {
        playSound('tick');
        usingTwin = !usingTwin;
        twinBtn.setAttribute('aria-pressed', String(usingTwin));
        twinBtn.textContent = usingTwin ? 'Showing Transfer Twin · Switch to Original' : 'Try Transfer Twin (New Scenario)';
        promptP.textContent = usingTwin ? `[${q.twinTitle}] ${q.twinPrompt}` : q.prompt;
        modelBody.textContent = usingTwin ? q.twinAnswer : q.answer;
        const cur = store.get(key, {}); cur.twin = usingTwin; store.set(key, cur);
      });
      topBar.append(twinBtn);
    }

    const promptP = el('p', { class: 'eoc-q-prompt' }, usingTwin && q.twinPrompt ? `[${q.twinTitle}] ${q.twinPrompt}` : q.prompt);
    const ta = el('textarea', {
      class: 'lj-ta',
      rows: 2,
      placeholder: 'Write your explanation or calculation before checking the mark scheme…',
      'aria-label': q.rung,
    });
    ta.value = saved.a || '';

    const confRow = el('div', { class: 'lj-conf', role: 'group', 'aria-label': 'Confidence before checking' });
    const confBtns = CONF_STOPS.map(([v, l]) =>
      el('button', { type: 'button', class: 'lj-chip lj-conf-chip', 'data-conf': v, 'aria-pressed': String(saved.conf === v) }, l)
    );
    confRow.append(el('span', { class: 'lj-q' }, 'Confidence:'), ...confBtns);

    const kwWrap = el('div', { class: 'chk-key-ideas eoc-kw-bar', hidden: !saved.seen });
    const kwHead = el('span', { class: 'chk-idea-count' });
    const kwChips = el('div', { class: 'chk-idea-chips' });
    kwWrap.append(
      el('div', { class: 'chk-idea-head' }, el('span', { class: 'lj-q' }, 'Cambridge mark-scheme key ideas:'), kwHead),
      kwChips
    );

    const modelWrap = el('div', { class: 'chk-reveal eoc-reveal', hidden: !saved.seen });
    const modelBody = el('p', { class: 'eoc-model-txt' }, usingTwin && q.twinAnswer ? q.twinAnswer : q.answer);
    const rateRow = el('div', { class: 'lj-rate', role: 'group', 'aria-label': 'Self-rate your answer' });
    const rateBtns = [
      ['got', 'I got it'],
      ['partly', 'Partly'],
      ['not', 'Not yet'],
    ].map(([v, l]) =>
      el('button', { type: 'button', class: 'lj-chip', 'data-r': v, 'aria-pressed': String(saved.r === v) }, l)
    );
    rateRow.append(el('span', { class: 'lj-q' }, 'How did you do?'), ...rateBtns);
    modelWrap.append(el('p', { class: 'lj-kick' }, 'Model answer & mark scheme'), modelBody, kwWrap, rateRow);

    const checkBtn = el('button', {
      type: 'button',
      class: 'lj-btn primary eoc-check-btn',
      hidden: Boolean(saved.seen),
    }, 'Check against mark scheme');

    function paintKeywords() {
      kwChips.innerHTML = '';
      let hits = 0;
      (q.keywords || []).forEach(kw => {
        const hit = matchesKeyword(ta.value, kw);
        if (hit) hits++;
        kwChips.append(
          el('span', { class: 'chk-idea-pill' + (hit ? ' is-hit' : '') },
            el('span', { class: 'chk-idea-icon' }, hit ? '✓' : '○'),
            el('span', {}, kw)
          )
        );
      });
      kwHead.textContent = `${hits} of ${(q.keywords || []).length} mark-scheme ideas matched`;
    }

    confBtns.forEach(b =>
      b.addEventListener('click', () => {
        playSound('tick');
        const cur = store.get(key, {});
        cur.conf = b.dataset.conf;
        cur.a = ta.value;
        cur.t = Date.now();
        store.set(key, cur);
        confBtns.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.conf === cur.conf)));
        App.emit('learn:change');
      })
    );

    ta.addEventListener('input', () => {
      const cur = store.get(key, {});
      cur.a = ta.value;
      cur.t = Date.now();
      store.set(key, cur);
      if (!modelWrap.hidden) paintKeywords();
      App.emit('learn:change');
    });

    checkBtn.addEventListener('click', () => {
      playSound('flap');
      const cur = store.get(key, {});
      cur.a = ta.value;
      cur.seen = true;
      cur.t = Date.now();
      store.set(key, cur);
      checkBtn.hidden = true;
      kwWrap.hidden = false;
      modelWrap.hidden = false;
      paintKeywords();
      App.emit('learn:change');
    });

    rateBtns.forEach(b =>
      b.addEventListener('click', () => {
        playSound('tick');
        const r = b.dataset.r;
        const cur = store.get(key, {});
        cur.r = r;
        cur.a = ta.value;
        cur.seen = true;
        cur.t = Date.now();
        store.set(key, cur);
        rateBtns.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.r === r)));
        recordCheck({
          id: q.id,
          chapterId: `ch-${chNum}`,
          skillId: `${chNum}.eoc`,
          isCorrect: r === 'got',
          usedHelp: r === 'partly',
          isClosedChoice: false,
          responseTimeMs: 25000,
        });
        App.emit('learn:change');
      })
    );

    if (saved.seen) paintKeywords();
    card.append(topBar, promptP, ta, confRow, el('div', { class: 'lj-row' }, checkBtn), modelWrap);
    return card;
  }

  function buildFlashcardWidget(getDeckFn, emptyMsg = 'No flashcards in this filter.') {
    let idx = 0;
    let mode = 'forward'; // 'forward' | 'reverse' | 'cloze1' | 'cloze2'
    let flipped = false;
    let conf = 'sure';

    const wrap = el('div', { class: 'fc-player' });
    const modeBar = el('div', { class: 'fc-mode-bar', role: 'group', 'aria-label': 'Flashcard study mode' });
    const modes = [
      ['forward', 'Prompt → Mechanism'],
      ['reverse', 'Reverse: Clue → Term'],
      ['cloze1', 'Cloze Fading (Stage 1)'],
      ['cloze2', 'Cold Cloze (Stage 2)'],
    ];
    const modeBtns = modes.map(([m, label]) =>
      el('button', { type: 'button', class: 'lj-chip', 'aria-pressed': String(m === mode), onclick: () => {
        playSound('tick');
        mode = m;
        flipped = false;
        modeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(modes[i][0] === mode)));
        render();
      } }, label)
    );
    modeBar.append(el('span', { class: 'lj-q' }, 'Card mode:'), ...modeBtns);

    const cardBox = el('div', { class: 'fc-card-stage' });
    wrap.append(modeBar, cardBox);

    function render() {
      const deck = getDeckFn();
      cardBox.innerHTML = '';
      if (!deck.length) {
        cardBox.append(el('p', { class: 'fc-empty' }, emptyMsg));
        return;
      }
      idx = ((idx % deck.length) + deck.length) % deck.length;
      const card = deck[idx];
      const fsrs = state.cards[card.id] || createCard();
      const proof = state.proofs[card.id];

      const metaRow = el('div', { class: 'fc-meta-row' },
        el('span', { class: 'fc-kind-pill' }, `${card.kindLabel} · Ch ${card.chNum}`),
        el('span', { class: 'fc-counter' }, `Card ${idx + 1} of ${deck.length}`),
        el('span', { class: 'fc-sched-pill' },
          fsrs.reps > 0
            ? `Stability: ${fsrs.stability.toFixed(1)}d · ${proof?.status === 'secure' ? 'Secure' : 'Reviewed'}`
            : 'New card'
        )
      );

      let promptText = card.frontPrompt;
      let answerText = card.backAnswer;
      if (mode === 'reverse') {
        promptText = card.reversePrompt || card.frontPrompt;
        answerText = card.reverseAnswer || card.backAnswer;
      } else if (mode === 'cloze1') {
        promptText = `${card.title}: ${renderProgressiveCloze(card.backAnswer, card.keyTerms, 1)}`;
        answerText = card.backAnswer;
      } else if (mode === 'cloze2') {
        promptText = `${card.title}: ${renderProgressiveCloze(card.backAnswer, card.keyTerms, 2)}`;
        answerText = card.backAnswer;
      }

      const promptEl = el('div', { class: 'fc-prompt' },
        el('p', { class: 'lj-kick' }, mode === 'reverse' ? 'Reverse recall cue' : (mode.startsWith('cloze') ? 'Fill in the faded terms' : 'Active recall prompt')),
        el('p', { class: 'fc-prompt-txt' }, promptText)
      );

      const draftTa = el('textarea', {
        class: 'lj-ta fc-draft-ta',
        rows: 2,
        placeholder: 'Optional: type or jot the key terms before flipping…',
        'aria-label': 'Your recall attempt before flipping',
      });

      const confRow = el('div', { class: 'lj-conf', role: 'group', 'aria-label': 'Pre-flip confidence' });
      CONF_STOPS.forEach(([v, l]) => {
        const b = el('button', {
          type: 'button',
          class: 'lj-chip lj-conf-chip',
          'aria-pressed': String(conf === v),
          onclick: () => { playSound('tick'); conf = v; render(); },
        }, l);
        confRow.append(b);
      });
      confRow.prepend(el('span', { class: 'lj-q' }, 'Confidence:'));

      const flipBtn = el('button', {
        type: 'button',
        class: 'lj-btn primary chk-flap-btn fc-flip-btn',
        hidden: flipped,
        onclick: () => { playSound('flap'); flipped = true; render(); },
      },
        el('span', { class: 'flap-k' }, 'FLIP CARD'),
        el('span', { class: 'flap-t' }, 'Reveal answer & rate your recall'),
      );

      const backEl = el('div', { class: 'chk-reveal fc-back', hidden: !flipped },
        el('p', { class: 'lj-kick' }, 'Model answer'),
        el('p', { class: 'fc-ans-txt' }, answerText)
      );

      if (card.keyTerms && card.keyTerms.length) {
        const ktRow = el('div', { class: 'chk-idea-chips fc-kt-row' });
        card.keyTerms.slice(0, 6).forEach(kt => {
          ktRow.append(el('span', { class: 'chk-idea-pill is-hit' }, el('span', { class: 'chk-idea-icon' }, '✓'), el('span', {}, kt)));
        });
        backEl.append(el('div', { class: 'chk-key-ideas' }, el('span', { class: 'lj-q' }, 'Anchor terms:'), ktRow));
      }

      // FSRS 4-Button Rating Bar with live interval preview
      const ratings = [
        [FSRS_RATING.AGAIN, 'Again · 1d', 'not'],
        [FSRS_RATING.HARD, 'Hard', 'partly'],
        [FSRS_RATING.GOOD, 'Good', 'got'],
        [FSRS_RATING.EASY, 'Easy', 'got'],
      ];
      const fsrsBar = el('div', { class: 'lj-rate fc-rate-bar', role: 'group', 'aria-label': 'Schedule next spaced review' },
        el('span', { class: 'lj-q' }, 'Schedule next review:')
      );
      ratings.forEach(([rVal, rLabel, tone]) => {
        const preview = scheduleFSRS(fsrs, rVal);
        const btn = el('button', {
          type: 'button',
          class: 'lj-chip fc-rate-btn',
          'data-r': tone,
          onclick: () => {
            playSound('tick');
            reviewFlashcard(card.id, card.chapterId, card.skillId, rVal);
            flipped = false;
            idx = (idx + 1) % deck.length;
            render();
          },
        }, rVal === FSRS_RATING.AGAIN ? rLabel : `${rLabel} · ${preview.intervalDays}d`);
        fsrsBar.append(btn);
      });
      backEl.append(fsrsBar);

      const navRow = el('div', { class: 'fc-nav-row' },
        el('button', {
          type: 'button',
          class: 'lj-btn',
          onclick: () => { playSound('tick'); flipped = false; idx = (idx - 1 + deck.length) % deck.length; render(); },
        }, '← Previous card'),
        el('button', {
          type: 'button',
          class: 'lj-btn',
          onclick: () => { playSound('tick'); flipped = false; idx = (idx + 1) % deck.length; render(); },
        }, 'Next card →')
      );

      cardBox.append(metaRow, promptEl, draftTa, confRow, flipBtn, backEl, navRow);
    }

    render();
    return { el: wrap, refresh: render };
  }

  function buildQuickQuizWidget(getQuizFn) {
    const picked = new Map();
    const wrap = el('div', { class: 'qz-sprint' });

    function render() {
      const items = getQuizFn();
      wrap.innerHTML = '';
      if (!items.length) {
        wrap.append(el('p', { class: 'fc-empty' }, 'No quiz questions available.'));
        return;
      }

      let correctCount = 0;
      items.forEach(it => {
        if (picked.get(it.id) === it.correctIndex) correctCount++;
      });

      const scoreBar = el('div', { class: 'qz-score-bar' },
        el('span', { class: 'qz-score-title' }, `5-Question Interleaved Checkpoint Sprint`),
        el('span', { class: 'qz-score-pill' }, `${picked.size} of ${items.length} answered · ${correctCount} correct`),
        picked.size > 0
          ? el('button', {
              type: 'button',
              class: 'lj-link',
              onclick: () => { playSound('flap'); picked.clear(); render(); },
            }, 'Reset sprint')
          : null
      );
      wrap.append(scoreBar);

      items.forEach((it, qIdx) => {
        const chosen = picked.get(it.id);
        const isAnswered = chosen != null;
        const isCorrect = chosen === it.correctIndex;

        const qCard = el('article', { class: 'qz-card' },
          el('div', { class: 'eoc-q-head' },
            el('span', { class: 'eoc-q-rung' }, it.badge || `Question ${qIdx + 1}`),
            isAnswered
              ? el('span', { class: 'qz-verdict-chip', 'data-ok': isCorrect ? '1' : '0' },
                  isCorrect ? '✓ Mechanism verified' : '✗ Misconception trap — inspect why below'
                )
              : null
          ),
          el('p', { class: 'eoc-q-prompt' }, it.prompt)
        );

        const optList = el('div', { class: 'qz-opts', role: 'group', 'aria-label': it.prompt });
        const letters = 'ABCD';
        it.options.forEach((optText, oIdx) => {
          const btn = el('button', {
            type: 'button',
            class: 'qz-opt-btn' +
              (isAnswered && oIdx === it.correctIndex ? ' is-correct' : '') +
              (isAnswered && oIdx === chosen && !isCorrect ? ' is-wrong' : ''),
            'aria-pressed': String(chosen === oIdx),
            disabled: isAnswered,
            onclick: () => {
              playSound('tick');
              picked.set(it.id, oIdx);
              recordCheck({
                id: it.id,
                chapterId: 'ch-quiz',
                skillId: it.id,
                isCorrect: oIdx === it.correctIndex,
                usedHelp: false,
                isClosedChoice: true,
                responseTimeMs: 9000,
              });
              render();
            },
          },
            el('span', { class: 'pred-l' }, letters[oIdx] || String(oIdx + 1)),
            el('span', { class: 'pred-t' }, optText)
          );
          optList.append(btn);
        });
        qCard.append(optList);

        if (isAnswered) {
          qCard.append(
            el('div', { class: 'chk-reveal qz-exp' },
              el('p', { class: 'lj-kick' }, isCorrect ? 'Why this works' : 'Diagnostic explanation'),
              el('p', {}, it.explanation)
            )
          );
        }

        wrap.append(qCard);
      });
    }

    render();
    return { el: wrap, refresh: render };
  }

  function injectChapterMasteryStudios() {
    document.querySelectorAll('article.chapter[id]').forEach(chEl => {
      if (chEl.querySelector('.ch-mastery-studio')) return;
      const chNum = Number(chEl.id.replace('ch', ''));
      const chTitle = clean(chEl.querySelector('.opener h2')?.textContent) || `Chapter ${chNum}`;
      const synthList = CHAPTER_SYNTHESIS_BANK[chNum] || [];
      const chCards = flashcardsByChapter.get(chNum) || [];
      const chQuiz = quizzesByChapter.get(chNum) || [];

      let activeTab = 'eoc'; // 'eoc' | 'flashcards' | 'quiz'
      const studio = el('section', {
        class: 'box ch-mastery-studio',
        id: `mastery-studio-ch${chNum}`,
        'aria-label': `Chapter ${chNum} Questions, Flashcards & Checkpoint Quiz`,
      });

      const header = el('div', { class: 'cms-header' },
        el('div', {},
          el('p', { class: 'lj-kick' }, `Chapter ${chNum} Active Retrieval & Synthesis Bench`),
          el('h3', { class: 'cms-title' }, `Master Chapter ${chNum}: ${chTitle}`)
        ),
        el('div', { class: 'cms-tabs', role: 'tablist', 'aria-label': 'Chapter practice modes' })
      );

      const tabDefs = [
        ['eoc', `End-of-Chapter Q&A (${synthList.length})`],
        ['flashcards', `Flashcards (${chCards.length})`],
        ['quiz', `5-Question Quick Quiz (${chQuiz.length})`],
      ];

      const eocPane = el('div', { class: 'cms-pane' },
        el('p', { class: 'cms-sub' },
          'Work up the 4-rung synthesis ladder: (1) Mechanism Explain-Back, (2) Quantitative Calculation, (3) Misconception Autopsy, and (4) Cross-Chapter Synthesis with a Transfer Twin scenario.'
        ),
        ...synthList.map(q => buildEocQuestionCard(q, chNum))
      );

      const fcWidget = buildFlashcardWidget(() => chCards, 'No flashcards found for this chapter.');
      const fcPane = el('div', { class: 'cms-pane', hidden: true }, fcWidget.el);

      const qzWidget = buildQuickQuizWidget(() => chQuiz);
      const qzPane = el('div', { class: 'cms-pane', hidden: true }, qzWidget.el);

      const tabBtns = tabDefs.map(([tId, tLabel]) =>
        el('button', {
          type: 'button',
          role: 'tab',
          class: 'lj-chip cms-tab-btn',
          'aria-selected': String(tId === activeTab),
          'aria-pressed': String(tId === activeTab),
          onclick: () => {
            playSound('tick');
            activeTab = tId;
            tabBtns.forEach((b, i) => {
              const on = tabDefs[i][0] === activeTab;
              b.setAttribute('aria-selected', String(on));
              b.setAttribute('aria-pressed', String(on));
            });
            eocPane.hidden = activeTab !== 'eoc';
            fcPane.hidden = activeTab !== 'flashcards';
            qzPane.hidden = activeTab !== 'quiz';
            if (activeTab === 'flashcards') fcWidget.refresh();
            if (activeTab === 'quiz') qzWidget.refresh();
          },
        }, tLabel)
      );
      header.querySelector('.cms-tabs').append(...tabBtns);
      studio.append(header, eocPane, fcPane, qzPane);

      const endSec = chEl.querySelector('section.sec.end') || chEl.querySelector('.flow') || chEl;
      const closerComic = endSec.querySelector('.atlas-comic-strip[data-role="chapterCloser"]');
      const nextBlock = endSec.querySelector('.next');
      if (closerComic) endSec.insertBefore(studio, closerComic);
      else if (nextBlock) endSec.insertBefore(studio, nextBlock);
      else endSec.append(studio);
    });
  }

  // ------------------------------------------------------------------ Enhance Back-of-Book "#answers" Page with Self-Test Mode
  function enhanceBackOfBookAnswers() {
    const ansSec = document.getElementById('answers');
    if (!ansSec || ansSec.querySelector('.ans-toolbar')) return;
    let selfTestOn = false;
    let selectedCh = 'all';

    const items = [...ansSec.querySelectorAll('.a[id^="ans-"]')];
    let curCh = '0';
    ansSec.querySelectorAll('h3, .a[id^="ans-"]').forEach(node => {
      if (node.tagName === 'H3') {
        const m = node.textContent.match(/Chapter\s+(\d+)/i);
        curCh = m ? m[1] : 'stories';
        node.dataset.ch = curCh;
      } else {
        node.dataset.ch = curCh;
        const anchor = node.id.replace(/^ans-/, '');
        const badge = el('span', { class: 'ans-status-pill' });
        node.querySelector('.q')?.append(' ', badge);
        node._paintStatus = () => {
          const saved = store.get('chk:' + anchor, null);
          if (saved && saved.r) {
            const labels = { got: '✓ I got it', partly: '◐ Partly', not: '↻ Review again' };
            badge.textContent = labels[saved.r] || '';
            badge.dataset.r = saved.r;
            badge.hidden = false;
          } else {
            badge.hidden = true;
          }
        };
        node._paintStatus();
      }
    });

    const selfTestBtn = el('button', {
      type: 'button',
      class: 'lj-btn primary',
      'aria-pressed': 'false',
      onclick: () => {
        playSound('tick');
        selfTestOn = !selfTestOn;
        selfTestBtn.setAttribute('aria-pressed', String(selfTestOn));
        selfTestBtn.textContent = selfTestOn ? 'Show all answers' : 'Self-Test Mode: Hide answers until tapped';
        ansSec.classList.toggle('is-selftest', selfTestOn);
        items.forEach(item => item.classList.remove('is-peeked'));
      },
    }, 'Self-Test Mode: Hide answers until tapped');

    const chSelect = el('select', {
      class: 'lj-btn ans-ch-select',
      'aria-label': 'Filter answers by chapter',
      onchange: e => {
        selectedCh = e.target.value;
        ansSec.querySelectorAll('h3[data-ch], .a[data-ch]').forEach(n => {
          n.hidden = selectedCh !== 'all' && n.dataset.ch !== selectedCh;
        });
      },
    },
      el('option', { value: 'all' }, 'All 16 chapters'),
      ...Array.from({ length: 16 }, (_, i) => el('option', { value: String(i) }, `Chapter ${i}`))
    );

    items.forEach(item => {
      item.addEventListener('click', e => {
        if (!selfTestOn || e.target.closest('a')) return;
        playSound('flap');
        item.classList.toggle('is-peeked');
      });
    });

    const bar = el('div', { class: 'ans-toolbar' }, selfTestBtn, chSelect);
    const introP = ansSec.querySelector('p');
    if (introP) introP.after(bar);
    else ansSec.prepend(bar);

    App.on('learn:change', () => items.forEach(it => it._paintStatus && it._paintStatus()));
  }

  // ------------------------------------------------------------------ Top-Toolbar Flashcards & Quiz Modal
  let studioDlg, studioBody;
  let filterCh = 'due';
  let filterKind = 'all';

  function filteredGlobalDeck() {
    if (filterCh === 'due') {
      const now = Date.now();
      const due = allFlashcardsList.filter(c => {
        const fc = state.cards[c.id];
        const pr = state.proofs[c.id];
        if (pr && (pr.status === 'retest_scheduled' || pr.status === 'working')) return true;
        if (fc && fc.dueAtMs && fc.dueAtMs <= now) return true;
        return false;
      });
      if (due.length > 0) return due;
      // Fallback: interleave unseen / low-stability cards across chapters
      return interleaveItems(allFlashcardsList, 24, c => c.chapterId, c => c.kind);
    }
    return allFlashcardsList.filter(c => {
      const chMatch = filterCh === 'all' || String(c.chNum) === filterCh;
      const kindMatch = filterKind === 'all' || c.kind === filterKind;
      return chMatch && kindMatch;
    });
  }

  function buildStudioModal() {
    studioBody = el('div', { class: 'nb-body cms-dlg-body' });
    studioDlg = el('dialog', { class: 'lj-dlg notebook practice-dlg', 'aria-labelledby': 'prac-h' },
      el('div', { class: 'nb-bar' },
        el('h2', { id: 'prac-h' }, 'Flashcards, Spaced Retrieval & Quick Quiz'),
        el('button', { type: 'button', class: 'lj-btn', onclick: () => studioDlg.close() }, 'Close')
      ),
      studioBody
    );
    studioDlg.addEventListener('click', e => { if (e.target === studioDlg) studioDlg.close(); });
    document.body.append(studioDlg);
  }

  function renderStudioModal() {
    studioBody.innerHTML = '';
    const curPage = App.pages && App.pages.current && App.pages.current();
    if (curPage && curPage.kind === 'chapter' && filterCh === 'due' && Object.keys(state.cards).length === 0) {
      filterCh = String(curPage.n);
    }

    const chSel = el('select', {
      class: 'lj-btn',
      'aria-label': 'Filter flashcards by chapter',
      onchange: e => { filterCh = e.target.value; fcPlayer.refresh(); },
    },
      el('option', { value: 'due', selected: filterCh === 'due' }, 'Due & Interleaved Queue (FSRS)'),
      el('option', { value: 'all', selected: filterCh === 'all' }, `All 16 Chapters (${allFlashcardsList.length} cards)`),
      ...Array.from({ length: 16 }, (_, i) =>
        el('option', { value: String(i), selected: filterCh === String(i) }, `Chapter ${i} (${(flashcardsByChapter.get(i) || []).length} cards)`)
      )
    );

    const kindSel = el('select', {
      class: 'lj-btn',
      'aria-label': 'Filter flashcards by card type',
      onchange: e => { filterKind = e.target.value; fcPlayer.refresh(); },
    },
      el('option', { value: 'all', selected: filterKind === 'all' }, 'All Card Types'),
      el('option', { value: 'term', selected: filterKind === 'term' }, 'Key Terms & Definitions'),
      el('option', { value: 'trap', selected: filterKind === 'trap' }, 'Misconception Traps'),
      el('option', { value: 'check', selected: filterKind === 'check' }, 'Section Mechanism Checks'),
      el('option', { value: 'quant', selected: filterKind === 'quant' }, 'Cheat-Sheet Rules & Equations')
    );

    const filterBar = el('div', { class: 'fc-filter-bar' },
      el('span', { class: 'lj-q' }, 'Deck filter:'),
      chSel,
      kindSel
    );

    const fcPlayer = buildFlashcardWidget(filteredGlobalDeck, 'No cards match this filter.');
    studioBody.append(filterBar, fcPlayer.el);
  }

  injectChapterMasteryStudios();
  enhanceBackOfBookAnswers();
  buildStudioModal();

  const CARDS_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="5" width="11" height="12" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 3h9.5A1.5 1.5 0 0 1 17 4.5V14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 9h5M6 12h3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  App.tool({
    id: 'flashcards',
    label: 'Flashcards',
    icon: CARDS_ICON,
    order: 35,
    title: 'Spaced-retrieval flashcards (Forward, Reverse & Cloze Fading)',
    onClick: () => {
      const curPage = App.pages && App.pages.current && App.pages.current();
      if (curPage && curPage.kind === 'chapter') filterCh = String(curPage.n);
      renderStudioModal();
      studioDlg.showModal();
    },
  });

  App.mastery = {
    recordCheck,
    reviewFlashcard,
    dueChecks,
    deckForChapter: n => flashcardsByChapter.get(Number(n)) || [],
    allFlashcards: () => allFlashcardsList.slice(),
    synthesisForChapter: n => CHAPTER_SYNTHESIS_BANK[Number(n)] || [],
    quizForChapter: n => quizzesByChapter.get(Number(n)) || [],
    openStudio: (chNum = null) => {
      if (chNum != null) filterCh = String(chNum);
      renderStudioModal();
      studioDlg.showModal();
    },
    registerSkillLinks(links) {
      if (Array.isArray(links)) {
        state.links = links;
        save();
      }
    },
    getProof(id) {
      return state.proofs[id] || null;
    },
    reset() {
      state.cards = {};
      state.skills = {};
      state.proofs = {};
      save();
    },
  };
});
