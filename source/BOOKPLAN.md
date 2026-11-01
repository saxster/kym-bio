# Kym's biology book: book plan (*The Living World*) — Approval Gate

## Context
This is the third book in Kym's story-first textbook series. Kym is 12, lives in Mumbai, and is on the IB MYP / Cambridge IGCSE track.
- Book 1, *The Invisible World* (chemistry): https://saxster.github.io/kym-chem/ (`saxster/kym-chem`, plus companion lab app in `../kym_chem`)
- Book 2, *The Moving World* (physics): https://saxster.github.io/kym-physics/ (`saxster/kym-physics`)
- Book 3, ***The Living World*** (biology): `saxster/kym-bio`, built in `/Users/amarsukhi/src/MyCode/kym_bio/source/`

This book reuses the v2.1 engine from `kym_physics/source` together with the visual and spatial design rules from `../kym_chem/DESIGN.md` (Johnstone's Triangle bridging **Macroscopic Observation ↔ Submicroscopic Cellular/Molecular Mechanics ↔ Symbolic/Genetic Notation**, warm archival paper `#f7f3e8`, forest ink `#203d36`, terracotta `#a94730`, ochre `#936022`, slate-blue `#356d83`, conservation emerald `#2e604a`, and interactive Three.js 3D models paired with accessible 2D engraved SVG schematics).

Per `SKILL.md` and `PLAYBOOK.md` step 3, **this plan plus the working visual prototype of Chapter 0 & Chapter 1 ("The Seed and the Flame") serve as the Approval Gate** before the remaining chapters (Chapters 2–15) are written.

---

## 1. Research Foundation (`source/research/*.md`)
All four research reports are saved in `source/research/`:
- [`sources.md`](file:///Users/amarsukhi/src/MyCode/kym_bio/source/research/sources.md): MIT OCW **7.012** (Lander, Weinberg), **7.013** (Sive), **7.014** (Chisholm, Walker — thermodynamics, photosynthesis, respiration, ecology), and **7.016** (Imperiali — protein structure & enzymes), paired with OpenStax ***Biology 2e***, ***Concepts of Biology***, and ***Microbiology*** (CC BY-NC-SA 4.0) and **RCSB Protein Data Bank** (CC0 3D atomic coordinates).
- [`misconceptions.md`](file:///Users/amarsukhi/src/MyCode/kym_bio/source/research/misconceptions.md): Built on Coley & Tanner (2012, 2015) on teleological/anthropocentric/essentialist construals, AAAS Project 2061, Harvard *Lessons from Thin Air* (>85% believe tree mass comes from soil/water rather than $\text{CO}_2$ gas), Driver et al. (1994), and Odom & Barrow (1995).
- [`history.md`](file:///Users/amarsukhi/src/MyCode/kym_bio/source/research/history.md): 25+ primary cast members (including Indian pioneers **Yellapragada SubbaRow**, **J. C. Bose**, **E. K. Janaki Ammal**, **G. N. Ramachandran**, **Har Gobind Khorana**, **Obaid Siddiqi**, **Kamal Ranadive**, **Salim Ali**, **Birbal Sahni**, and **Gagandeep Kang**) with TRUE / HEDGE / LEGEND tags on every historical scene.
- [`school-wording.md`](file:///Users/amarsukhi/src/MyCode/kym_bio/source/research/school-wording.md): Exact bridge sentences (`:::school`) and examiner traps (`:::careful`) for **Cambridge IGCSE Biology 0610 (2026–2028)**, **Cambridge Lower Secondary 0893**, and **IB MYP**.

---

## 2. Five Big Ideas of *The Living World* (`src/front/ideas.md`)
1. **Life is a rebellion against chaos, paid for with energy.** A living cell is not magic matter; it is ordinary atoms arranged into microscopic machines that continuously spend chemical energy (ATP) to repair themselves and hold back thermal disorder.
2. **Shape is how molecules do things.** From an enzyme's active-site pocket to an antibody grabbing a virus or haemoglobin carrying oxygen, biological machines work because their 3D folded shape fits one specific partner and changes when bound.
3. **Every cell carries and copies a digital four-letter recipe book.** DNA stores hereditary information as a sequence of four chemical bases ($\text{A, T, C, G}$), which ribosomes read three letters at a time to print 3D protein machinery.
4. **Random copying glitches plus survival filter create all diversity.** Organisms never mutate "in order to" solve a problem. Copying errors happen blindly; environments simply allow the individuals whose recipes work best to leave more offspring.
5. **Atoms loop forever while energy flows one way.** The carbon atoms in a Mumbai banyan leaf today were once exhaled by dinosaurs and will one day pass through soil fungi, ocean algae, and your own lungs, powered by a one-way stream of sunlight that ultimately leaves Earth as heat.

---

## 3. Visual & Interactive Layer (HTML5 + Three.js + `../kym_chem/DESIGN.md`)

### Four Front-Matter Explorers (`app/x_*.js`)
1. **`scale` — Powers of Ten in the Living World (`x_scale.js`):** Logarithmic zoom from a water molecule ($0.28\text{ nm}$), ATP ($1.4\text{ nm}$), DNA helix ($2\text{ nm}$), and ribosome ($25\text{ nm}$) → bacteriophage & coronavirus ($100\text{ nm}$) → mitochondrion & *E. coli* ($2\text{ }\mu\text{m}$) → red blood cell ($8\text{ }\mu\text{m}$) → plant palisade cell ($50\text{ }\mu\text{m}$) → *Amoeba* ($250\text{ }\mu\text{m}$) → *moong* seed ($4\text{ mm}$) → Kym ($1.5\text{ m}$) → banyan tree ($100\text{ m}$) → Sanjay Gandhi National Park ($10\text{ km}$) → Earth's biosphere ($1.27 \times 10^7\text{ m}$), with a 5-question guided explanation.
2. **`cell` — The 3D Cell & Nanocity Explorer (`x_cell.js`, Three.js WebGL):** Interactive 3D cutaway comparator of an **Animal Cell**, a **Turgid Plant Cell** (with cellulose wall, chloroplasts, and central vacuole), and a **Prokaryotic Bacterium** (with nucleoid, plasmids, and flagellar rotary motor). Orbit, slice, and tap any organelle to inspect its real micrometre scale, submicroscopic role, and IGCSE bridge.
3. **`code` — The Master Code: 3D DNA → mRNA → Protein Explorer (`x_code.js`, Three.js WebGL):** Interactive 3D B-DNA double helix showing base-pair hydrogen bonds ($\text{A=T}$, $\text{G}\equiv\text{C}$), live transcription to mRNA, ribosome codon stepping, and 3D polypeptide folding—including a live toggle for the single-letter $\beta$-globin mutation ($\text{GAG} \to \text{GTG}$, Glutamate $\to$ Valine) that causes sickle-cell haemoglobin fibres.
4. **`map` — The Biological Adventure Map (`x_map.js`):** Interactive world & Mumbai map of every historical discovery scene with timeline slider and lifeline cards.

### Per-Chapter Visual Ambition
- **Engraved 2D SVG Scientific Plates (`figs_chNN.py`):** Every section has a high-information SVG figure bridging Macroscopic apparatus, Submicroscopic particles/cells, and Symbolic notation/graphs, using the `../kym_chem` rag-paper & forest-ink palette.
- **2–4 Live Interactive Widgets per Chapter (`live/w_*.js`):** Combining **Three.js 3D molecular/cellular models**, **Canvas 2D stochastic particle simulations**, **WebGL shaders**, **Web Audio**, and **opt-in phone camera/microphone/tap sensors**.

---

## 4. Sixteen Chapters Across Four Volumes (Syllabus Arc)

### Volume I: The Scene of the Crime & The Nanotech City (Chapters 0–3)

**Ch 0: The Detective's Lens (Seeing the Invisible)**
*When weevils appear inside a sealed tin of rice in a Mumbai kitchen, or green life explodes in a monsoon puddle overnight, did life spring out of non-living matter by itself?*
- **0.1 The maggot red herring.** Everyday intuition of spontaneous generation; Francesco Redi in Florence, 1668 (open, sealed, and gauze-covered jars; controls and variables). **Live:** `w_redi_jars` (interactive Redi jars + Pasteur swan-neck flask lab).
- **0.2 The cloth merchant's glass bead.** Robert Hooke's cork "cells" in London (1665) vs. Antonie van Leeuwenhoek's $270\times$ single-lens bead in Delft (1674 & 1683 tooth plaque). **Live:** `w_leeuwenhoek_scope` (virtual single-lens focus & specimen stage + opt-in camera loupe).
- **0.3 The swan-neck trap.** Louis Pasteur in Paris (1859): why boiled broth stays sterile with the neck curved—even open to air—until tilted into the dust trap.
- **0.4 The ladder of biological size.** Millimetres ($10^{-3}\text{ m}$), micrometres ($10^{-6}\text{ m}$), and nanometres ($10^{-9}\text{ m}$); IGCSE magnification formula $M = I \div A$. Opens **Powers of Ten in the Living World**.
- **Case:** *The cloudy soup in the monsoon kitchen.*

**Ch 1: The Seed and the Flame (What Is Life?)**
*A candle flame moves, grows, consumes fuel, takes in oxygen, and releases carbon dioxide. A dry moong bean in your kitchen cupboard does none of those things. Why is the bean alive and the flame not?*
- **1.1 Forty-eight hours in June.** Mumbai's parched brown hills before the monsoon vs. 48 hours after the first June rain; the mystery of dormant seeds. **Live:** `w_monsoon_imbibition` (interactive dry-seed vs. hydrated-seed water uptake, enzyme mobilisation & oxygen tracker).
- **1.2 The flame and the bean.** Testing our intuition: why every single criterion ("moves", "breathes", "grows") fails on its own; comparing a burning candle flame with a germinating *moong* seed. **Live:** `w_seed_flame3d` (**Three.js 3D** molecular comparison of wax combustion vs. ATP-driven cellular assembly).
- **1.3 Rebellion against chaos, and the ₹10 note of the cell.** Thermodynamic disorder (*The Moving World* Ch 7–8); how Yellapragada SubbaRow (from Bhimavaram to Boston, 1929) discovered **ATP**, the rechargeable chemical battery that couples fuel breakdown to cellular building.
- **1.4 Seven jobs that keep the rebellion going.** Deriving **MRS GREN** (*Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition*) as engineering necessities rather than a rote school list; why faeces (egestion) are not excretion.
- **1.5 The outlaw at the border.** Viruses (tobacco mosaic virus, bacteriophages, SARS-CoV-2): why a protein box holding RNA or DNA is biological software without hardware, and how biological classification works.
- **Case:** *The Viking Mars soil puzzle.*

**Ch 2: The Nanocity Under the Microscope (Cells & Scale)**
*Why are you made of 30 trillion tiny cells instead of one giant, football-sized cell?*
- **2.1 Inside the walled city.** Animal vs. plant vs. bacterial cells; why onion bulb cells have no chloroplasts and why plant cells still need mitochondria 24 hours a day. Opens **The 3D Cell Explorer (`#explore-cell`)**.
- **2.2 The stowaways that became power stations.** Lynn Margulis (1967) and **endosymbiosis**: the forensic clues proving mitochondria and chloroplasts were once free-living bacteria.
- **2.3 Why there are no dog-sized amoebas.** The geometry trap: Surface-Area-to-Volume ratio ($SA/V$) as a cube grows $1\times \to 2\times \to 10\times$, tested with *paneer*/potato cubes in turmeric/beetroot dye (`:::home`). **Live:** `w_sav_cubes3d` (Three.js 3D diffusion-penetration cube slicer).
- **2.4 Specialists in the city.** Red blood cells, root hair cells, ciliated epithelial cells, palisade mesophyll cells, and neurons: how structure matches physical job, and the hierarchy of cell → tissue → organ → system.
- **Case:** *The giant deep-sea bacterium that cheats the geometry rule.*

**Ch 3: The Crowded Train & The Salty Sea (Diffusion, Osmosis & Active Transport)**
*The mangroves along Carter Road and Thane Creek stand knee-deep in salty Arabian Sea water that would shrivel a garden hibiscus in a day. How do their roots drink from the sea?*
- **3.1 Blind bounces, not wishes.** Diffusion from random thermal motion ($k_B T$, linking to *The Invisible World* Ch 3); why molecules never "want more space" and never stop moving at equilibrium. **Live:** `w_diffusion_membrane` (stochastic particle chamber with permeable divider).
- **3.2 Water potential and the selective gate.** How a partially permeable membrane with aquaporin channels lets small $\text{H}_2\text{O}$ molecules slip through while blocking sucrose and hydrated salt ions (**osmosis**).
- **3.3 Balloons inside boxes.** Why an animal red blood cell bursts in pure water while a plant cell swells tight (**turgid**) against its cellulose wall; plasmolysis in salt water; the raw potato strip experiment (`:::home`). **Live:** `w_osmosis_cells` (interactive animal vs. plant cell across water potentials).
- **3.4 Pushing uphill: active transport & Mumbai's mangroves.** How root hair cells pump scarce nitrate ions *against* a concentration gradient using ATP—and how *Avicennia marina* mangroves on Carter Road filter salt at their roots and excrete salt crystals from their leaves.
- **Case:** *Why drinking seawater makes a shipwrecked sailor thirstier.*

---

### Volume II: The Molecular Locks & The Energy Heist (Chapters 4–6)

**Ch 4: Carbon's Lego Set & The Million-Speed Locks (Biomolecules & Enzymes)**
*Your cells burn glucose at $37^\circ\text{C}$, yet dry sugar on a spoon needs a $185^\circ\text{C}$ flame even to melt. How do living cells run fast chemistry in lukewarm water—and why is a $42^\circ\text{C}$ fever so dangerous?*
- **4.1 Water's sticky geometry & Carbon's four hands.** Monomers and polymers: glucose to starch/glycogen/cellulose, fatty acids + glycerol to lipids, and 20 amino acids to polypeptides.
- **4.2 Folding the ribbon in Madras.** G. N. Ramachandran in Madras (1954 & 1963): how steric clashes limit backbone angles (**the Ramachandran plot**) and fold a 1D chain of amino acids into a precise 3D molecular machine.
- **4.3 The lock that bends the stick.** Enzymes as biological catalysts: active site, enzyme-substrate complex, lowering activation energy ($E_a$, linking to *The Invisible World* Ch 7). **Live:** `w_enzyme3d` (Three.js 3D enzyme active site + temperature/pH denaturation curve).
- **4.4 Why enzymes don't "die" when boiled.** Temperature and pH curves; why thermal jiggling unfolds the active site (**denaturation**); kitchen test with raw vs. boiled potato catalase in pharmacy $6\%\text{ H}_2\text{O}_2$ (`:::home`).
- **4.5 Forensic food tests.** Benedict's, iodine, biuret, ethanol emulsion, and DCPIP: how chemical colour shifts reveal what a Mumbai lunch is made of.
- **Case:** *The biological washing powder that failed in boiling water.*

**Ch 5: Solar Power & The Green Engine (Photosynthesis & Plant Engineering)**
*A 150-year-old banyan tree at Horniman Circle weighs a hundred tonnes. When it started as a tiny fig seed on a branch, where did those hundred tonnes of solid wood come from?*
- **5.1 The five-year willow tree.** Jan Baptista van Helmont in Vilvoorde (1648): $74.5\text{ kg}$ of new tree from $90.7\text{ kg}$ of soil that lost only $57\text{ g}$—and why even van Helmont guessed the wrong culprit (water instead of air!). **Live:** `w_vanhelmont` (interactive willow mass ledger & atom tracker).
- **5.2 Bubbles in the sunlight.** Joseph Priestley's mint in a jar (1771), Jan Ingenhousz's sunlit underwater leaves (1779), and Nicolas-Théodore de Saussure's carbon accounting (1804).
- **5.3 Inside the green solar panel.** How chlorophyll in chloroplasts uses photon energy to split water ($\text{H}_2\text{O} \to \text{O}_2$) and stitch atmospheric $\text{CO}_2$ into glucose; limiting factors (light intensity, $\text{CO}_2$, temperature). **Live:** `w_photosynthesis_rates` (3-factor limiting-rate simulator & pondweed bubble counter).
- **5.4 Engineering a flat solar factory.** Inside a dicot leaf: waxy cuticle, palisade mesophyll, spongy air spaces, and kidney-shaped guard cells opening and closing stomata.
- **5.5 Pulling water 50 metres up without a mechanical pump.** Xylem vessels, transpiration pull from water cohesion, and phloem translocation of sucrose from source to sink.
- **Case:** *The sealed glass terrarium that hasn't been watered since 1960.*

**Ch 6: Burning Sugar in the Dark (Cellular Respiration)**
*When someone exercises and loses a kilogram of body fat, where do the actual atoms of that kilogram go—and why does idli batter puff up to double its height overnight in a warm Mumbai kitchen?*
- **6.1 Breathing is not respiration.** Why lungs are just air bellows, while **cellular respiration** is the controlled chemical unlocking of glucose inside every living cell (plants included, 24 hours a day!).
- **6.2 The rotary turbine inside your mitochondria.** Aerobic respiration ($\text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2 \to 6\text{CO}_2 + 6\text{H}_2\text{O}$), proton pumping, and ATP synthase spinning at 9,000 rpm. **Live:** `w_atp_synthase3d` (Three.js 3D rotary ATP synthase turbine).
- **6.3 Where lost weight actually goes.** Counting every carbon, hydrogen, and oxygen atom when $1\text{ kg}$ of fat is oxidised: $840\text{ g}$ breathed out as invisible $\text{CO}_2$ gas and $160\text{ g}$ as water!
- **6.4 Emergency power without oxygen.** Anaerobic respiration: yeast and *Leuconostoc* bacteria fermenting *idli* batter ($\text{CO}_2$ bubbles + ethanol/organic acids, `:::home`), vs. human sprinters building lactic acid and paying back the **oxygen debt** in the liver.
- **Case:** *Why waterlogged houseplant roots suffocate even though they are surrounded by $\text{H}_2\text{O}$.*

---

### Volume III: The Human Orchestra (Chapters 7–10)

**Ch 7: The Chemical Disassembly Line (Nutrition & Digestion)**
*You eat a warm buttered pav. Starch and fat molecules are thousands of times too big to pass through a cell membrane. How does your gut chop them into spare parts without digesting its own walls?*
- **7.1 Why food inside your gut is still "outside" your body.** The alimentary canal as a 9-metre tunnel from mouth to anus; ingestion, digestion, absorption, assimilation, and egestion.
- **7.2 Teeth, peristalsis, and the acid vat.** Mechanical chewing, wave-like muscle squeezes (peristalsis, works even upside down!), William Beaumont and Alexis St. Martin's stomach window (1825), hydrochloric acid ($\text{pH } 2$), and pepsin.
- **7.3 Bile is a dish soap, not an enzyme.** How liver bile emulsifies fat globules into micro-droplets so pancreatic lipase has $1,000\times$ more surface area to attack. **Live:** `w_emulsification` (interactive fat-droplet surface-area & lipase kinetics simulator).
- **7.4 Folding a tennis court into your belly.** How villi and microvilli pack $\approx 30\text{ m}^2$ of one-cell-thick absorption surface into the small intestine, with capillaries for glucose/amino acids and lacteals for fats.
- **Case:** *The patient whose gallbladder was removed.*

**Ch 8: The Breath and the Double Pump (Gas Exchange & Circulation)**
*If a fish swims all day with a simple two-chambered heart, why would a human collapse in seconds without a four-chambered double pump?*
- **8.1 Three hundred million wet air sacs.** Why lungs sit deep inside the ribcage; diaphragm and intercostal pressure mechanics (linking to *The Moving World* Ch 6: air is pushed in by atmospheric pressure, never "sucked"); inspired vs. expired air tested with limewater.
- **8.2 William Harvey's arithmetic in London (1628).** Why Galen's "liver makes new blood every hour" failed the simple multiplication test ($70\text{ beats/min} \times 60\text{ mL}$), and how Harvey proved blood circulates in a closed loop with one-way valves.
- **8.3 Why two pumps beat one.** Pulmonary vs. systemic circuits: why pumping blood through tiny lung capillaries drops its pressure, requiring a return trip to the muscular left ventricle before heading to the brain and muscles. **Live:** `w_heart_loop` (interactive double-circulation pressure & oxygenation simulator + opt-in pulse tap timer).
- **8.4 Pipes, leaky capillaries, and the dark-red truth about veins.** Arteries, veins, and one-cell-thick capillaries; why venous blood is dark maroon (never blue); red blood cells, platelets, phagocytes, and lymphocytes.
- **Case:** *The hole in the baby's heart wall (septal defect).*

**Ch 9: High-Speed Wiring & Chemical Couriers (Nerves, Senses & Hormones)**
*Touch a hot steel vessel and your hand pulls back in 50 milliseconds—before you even feel pain. How does a cell made of salty water fire an electrical message faster than an express train?*
- **9.1 Two ways to run a 30-trillion-cell city.** Fast, point-to-point electrical cables (**nervous system**) vs. slower, broadcast chemical letters in the blood (**endocrine hormones**).
- **9.2 The salty domino wave.** Sensory, relay, and motor neurons; how sodium and potassium ions rushing across the membrane create an action potential; Obaid Siddiqi's temperature-sensitive *para* flies at TIFR Mumbai.
- **9.3 The 20-nanometre gap.** Why wires don't touch: **synapses**, neurotransmitter vesicles, diffusion across the cleft, and why chemical gaps enforce one-way traffic. **Live:** `w_synapse` (interactive action-potential & synaptic vesicle simulator).
- **9.4 Focusing the world & bending towards the window.** The human eye's ciliary muscles and iris reflex (linking to *The Moving World* Ch 10), plus J. C. Bose's Calcutta crescograph and how **auxin** makes plant shoots bend towards light (phototropism).
- **Case:** *The pufferfish toxin (tetrodotoxin) that silences sodium gates.*

**Ch 10: Holding the Line in a Mumbai Summer (Homeostasis, Kidneys & Immunity)**
*Walk out onto Marine Drive in May at $38^\circ\text{C}$, then step into an air-conditioned room at $20^\circ\text{C}$: your blood temperature changes by less than $0.3^\circ\text{C}$. How does your body hold the line?*
- **10.1 Negative feedback: the thermostat rule.** Why stability requires detecting a drift and pushing the opposite way (**homeostasis**): insulin and glucagon holding blood glucose steady between meals.
- **10.2 Sweating in May vs. sweating in July.** Vasodilation, vasoconstriction, shivering, and evaporative cooling; why Mumbai's $85\%$ July monsoon humidity makes sweat drip without cooling you (*The Moving World* Ch 8).
- **10.3 Filtering the bathtub 40 times a day.** Inside the kidney nephron: how high pressure squeezes water, glucose, urea, and salts out of the blood at the glomerulus, and why the tubule reabsorbs $100\%$ of the glucose before sending urine to the bladder. **Live:** `w_nephron` (interactive nephron filtration & selective reabsorption ledger).
- **10.4 The microscopic war & the memory shield.** Pathogens, Koch's postulates, Kamal Ranadive's leprosy vaccine work in Mumbai, Gagandeep Kang's rotavirus cohorts in Vellore, and how vaccines train memory lymphocytes without the disease.
- **Case:** *Why sugary urine was the ancient diagnostic clue for diabetes.*

---

### Volume IV: The Master Code & The Four-Billion-Year Case File (Chapters 11–15)

**Ch 11: The Twisted Ladder & The Protein Printers (DNA, RNA & Protein Synthesis)**
*How can a molecule with only four chemical letters spell out the recipe for a mango tree, a cobra, and you?*
- **11.1 What is the gene made of?** Oswald Avery, Colin MacLeod, and Maclyn McCarty (1944) proving that pure DNA—not protein—transforms harmless bacteria into virulent ones; extracting visible DNA threads from a banana in your kitchen (`:::home`).
- **11.2 Photo 51 and the base-pair secret.** Rosalind Franklin's X-ray diffraction cross at King's College London (1952), Erwin Chargaff's $A=T, G=C$ puzzle, and Watson & Crick's double-helix model (1953). Opens **The Master Code 3D Explorer (`#explore-code`)**.
- **11.3 Cracking the three-letter words.** Why a 4-letter alphabet needs 3-letter words ($4^3 = 64$ codons for 20 amino acids), and how Har Gobind Khorana synthesized repeating RNA chains to decode the genetic dictionary.
- **11.4 From nuclear vault to ribosome factory.** Transcription into mRNA, ribosome translation via tRNA, and how a single base swap ($\text{GAG} \to \text{GTG}$) changes one amino acid in haemoglobin.
- **Case:** *Why five different codons all spell "Leucine", so some mutations leave no trace at all.*

**Ch 12: Copying the Blueprint (Mitosis, Stem Cells & Meiosis)**
*Your skin cell and your eye's photoreceptor cell carry the exact same 46 chromosomes of DNA. Why does one make tough keratin while the other detects light?*
- **12.1 Unzipping the ladder.** Semi-conservative DNA replication (Meselson & Stahl, 1958) and how DNA polymerase proofreads one error in a billion letters.
- **12.2 Mitosis: making two identical daughters.** Chromosomes condensing, lining up, and pulling apart for growth, tissue repair, and asexual reproduction. **Live:** `w_cell_division` (interactive Mitosis vs. Meiosis chromosome stepper).
- **12.3 The library where only some books are open.** Stem cells and differentiation: why every cell holds the whole recipe book, but transcription factors bookmark only the chapters needed for that cell's job.
- **12.4 Meiosis and Janaki Ammal's sweet chromosomes.** Why sexual reproduction requires halving the chromosome number ($2n \to n$, diploid to haploid) while shuffling maternal and paternal alleles—and how E. K. Janaki Ammal used polyploid chromosome counts in Coimbatore to breed sweet Indian sugarcane.
- **Case:** *Why seedless bananas and watermelons cannot make fertile seeds.*

**Ch 13: The Monk's Spreadsheet (Mendel & Inheritance)**
*For centuries everyone assumed a tall parent and a short parent mixed like black and white paint into medium grey. Why didn't traits blend away into uniformity long ago?*
- **13.1 Twenty-eight thousand pea plants in Brno.** Gregor Mendel (1856–1863): why the blending theory failed when purple $\times$ white flowers gave $100\%$ purple in generation $F_1$, then $705\text{ purple} : 224\text{ white}$ ($3.15 : 1$) in generation $F_2$!
- **13.2 Genes, alleles, and the Punnett grid.** Dominant vs. recessive alleles at the molecular level (why one working copy of a pigment enzyme is enough to make a flower purple); homozygous vs. heterozygous; genotype vs. phenotype. **Live:** `w_mendel_peas` (interactive Punnett square & $N=10,000$ Monte Carlo cross simulator).
- **13.3 When neither allele hides.** Codominance in human $\text{ABO}$ blood groups ($I^A, I^B, I^o$) and sex-linked inheritance on the $\text{X}$ and $\text{Y}$ chromosomes (why red-green colour blindness is much commoner in boys).
- **Case:** *The royal family pedigree and the missing clotting factor.*

**Ch 14: The Glitch Engine & Natural Selection (Evolution & Speciation)**
*When a patient stops taking an antibiotic halfway through the course, resistant superbugs take over. Did the bacteria mutate in order to survive the drug?*
- **14.1 No foresight allowed.** Unpacking the biggest misconception in biology: why mutations are blind copying glitches that happen *before* the environment changes, tested by Luria & Delbrück (1943) and Lederberg's velvet-stamp experiment (1952). **Live:** `w_selection_plate` (interactive antibiotic selection & Kettlewell peppered-moth population simulator).
- **14.2 The finches Darwin mislabelled, and Wallace's fever letter.** What really happened on the *Beagle* (1835) and in John Gould's London workshop (1837); Alfred Russel Wallace's 1858 letter from Ternate; the six-step logic of **natural selection**.
- **14.3 Clocks in rock and clocks in DNA.** Birbal Sahni's Gondwana plant fossils in Lucknow, homologous pentadactyl limbs across whales, bats, and humans, and Carl Woese's ribosomal RNA clock revealing the **Three Domains of Life** (Bacteria, Archaea, Eukarya).
- **Case:** *Why the sickle-cell allele stays common in malaria belts.*

**Ch 15: The Web of Everything & The Cold Cases (Ecology, Cycles & The Unsolved Frontier)**
*Sanjay Gandhi National Park sits inside Mumbai, surrounded by 20 million people, yet supports about forty wild leopards. Why can that forest support thousands of spotted deer, but never thousands of leopards?*
- **15.1 Salim Ali's sparrow and the web of SGNP.** Food chains, food webs, and trophic levels in Sanjay Gandhi National Park and Sewri's flamingo mudflats.
- **15.2 The 10% energy tax.** Why $90\%$ of chemical energy is lost as respiratory heat and unassimilated waste at every step up the food chain—making pyramids of energy always narrow steeply at the top. **Live:** `w_trophic_pyramid` (interactive SGNP energy-flow & trophic cascade simulator).
- **15.3 Looping atoms forever.** The global carbon cycle and nitrogen cycle (nitrogen-fixing bacteria in *dal*/legume root nodules, nitrifying and denitrifying bacteria), plus human fossil-fuel disruption and Thane Creek's mangrove carbon sink.
- **15.4 Editing the code & the open cold cases.** Jennifer Doudna and Emmanuelle Charpentier's programmable **CRISPR-Cas9** scissors (2012), and the three great unsolved mysteries waiting for Kym's generation: how chemistry first crossed the line into life on the early Earth, why cells age, and how 86 billion neurons generate conscious experience.
- **Case:** *What happened when wolves returned to Yellowstone—and what leopards do for Mumbai.*
