# Chapter 12 — Gate A: independent facts, models, syllabus, provenance and preservation review

Reviewed 31 October 2026. Independent reviewer did not author the chapter, story, figures, models, tests or provenance. Report-only review; this report (`/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch12-A.md`) is the only file written. Scope is scientific, historical, mathematical, syllabus, cross-book continuity, provenance and preservation acceptance, not final browser/print acceptance or publication approval. Read `source/GATES.md`, `source/gates/ch11-A.md`, all Chapter 12 deliverables, `source/live/enhancements.js`, `source/provenance/sources.yml`, preserved stories `source/src/stories/p-ammal.md` and `source/src/stories/p-ranadive.md`, and `source/src/ch11.md`.

## Disposition Summary

**PASS** — **0 BLOCKER / 0 FIX / 0 CONSIDER**.

---

## Section 1: Artifact Hash & Build Verification

Independently computed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I` and verified against `/tmp/lt_bio_ch12/final/artifact-hashes.json`:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch12.md` | 35686 | `8d6eaf924fc1a279058044ba05769ed5f6443127387a41b60678dd75bd255e3e` |
| `source/src/ch12.md` | 85353 | `40936ac853ae1208470c81fb443813202aaf6e0e290c151f316d0ac1edaa2175` |
| `source/src/stories/meselson-flemming-gurdon-divisions.md` | 9734 | `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5` |
| `source/src/stories/p-ammal.md` | 2155 | `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096` |
| `source/figs_ch12.py` | 41009 | `03a63d5432ff200ac8291e6d407943779c5cff4e5e4cc101901f32054fa1a62c` |
| `source/provenance/ch12.yml` | 27535 | `36d57df3a19b26007e7e8145686a3aff9b380a3a9f4bb823e16ba92f6864916e` |
| `source/provenance/sources.yml` | 1232 | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/cell_division_model.js` | 45158 | `bc2fe14c682d4b5a67f16bad8128ecb5ba0a6902862fa353df069392b00fc82a` |
| `source/live/w_dna_replication_meselson.js` | 13573 | `bb4ba8e21259a5be83125e8a5322638d71bee5d310a3430fb86f74b2966c829d` |
| `source/live/w_mitosis_meiosis_stepper.js` | 13325 | `481c5ae2d1542d1359c9bd1b2ba04a48a8854ecc955b7444c6812dc1222bb08d` |
| `source/live/w_stem_cell_expression_lab.js` | 11948 | `1c1eb417bbcc61d4f4af7670b15a5a5c8c587246d36519e08f0731d43b743e41` |
| `source/live/enhancements.js` | 91898 | `17babcd77caea250f6e8f021148ccec5e6264eb6dff25ac3d6a03a12f6fde6d9` |
| `source/tests/ch12-preserved.json` | 153626 | `47ea0d3e6f41cf0b738cf361a44d9fd116cddd3575fe86cb4755bcc03de77caf` |
| `source/tests/ch12_domain.mjs` | 16906 | `5933d2732cb0aa0a819f596f3cae52fe2ba5e41891064d169ac024af7de6a37f` |
| `source/tests/qa_ch12.py` | 31133 | `a9bf8176120ef22d10132f76078e6f51608977ade52465487c840f62af926f43` |
| `source/tests/verify_ch12.sh` | 1668 | `3beda5d223df3004f4a52a4361546566f182c4571482dad6e5e6f01bde8ca991` |
| `source/tests/README-ch12.md` | 3423 | `bf139a6fc5925b3ed81f3c623fbbeba576b12743bfb6fe2dbd9d460bf001f24d` |
| `source/build/site/index.html` | 2786236 | `4f99ecac6dbce3c125e3de7d19b213d118732756141123f0236d864a665cb1e7` |
| `source/build/site/sw.js` | 3516 | `c0d240298a64f1b58d51246a65e133d7489e55021b4d417827813d35050b7783` |
| `source/build/site/live/w_dna_replication_meselson-T2ZKSQ7Y.js` | 7256 | `f1b11551d0f499ce6f5c40685caef6ba6854efb94a6a6d7a5ba6ce1c21a8a61d` |
| `source/build/site/live/w_mitosis_meiosis_stepper-AS6XTNKP.js` | 6833 | `3ed300eb26e52164331a1600fe632862023eea537081e768db402d95876e7891` |
| `source/build/site/live/w_stem_cell_expression_lab-2ZCNBLRE.js` | 6406 | `03a818b58490e65e3cb4276d3a8ba3f9d62a417be5cc3c9dc12515a506166dc3` |
| `/tmp/lt_bio_ch12/final/qa_ch12/print.pdf` | 29198379 | `33a61e0232d168bcd41ff94f9d722050b6fbfe39cf9fc7de927dfe792632807e` |

### Build, Domain, Acceptance & Regression Summary

- **Built Service Worker Cache Version:** `lw-46acdcb0edb2` (`source/build/site/sw.js` and `/tmp/lt_bio_ch12/final/qa_ch12/report.json`).
- **Lazy Widget Chunk Budgets (`< 150,000` bytes each):** `w_dna_replication_meselson-T2ZKSQ7Y.js` (`7,256` bytes), `w_mitosis_meiosis_stepper-AS6XTNKP.js` (`6,833` bytes), `w_stem_cell_expression_lab-2ZCNBLRE.js` (`6,406` bytes); `index.html` size `2,786,236` bytes (`< 4,000,000` bytes).
- **Chapter 12 Headless Domain Verification (`node source/tests/ch12_domain.mjs`):** **`4,387` assertions passed** (`0` failures).
- **Chapter 12 Full-Book Browser & Print Acceptance (`source/tests/qa_ch12.py`):** **`1,926` QA assertions passed** (`0` console/page errors, `595`-page PDF with all 9 plates on single pages `455, 457, 464, 468, 476, 479, 486, 489, 494`).
- **Prior-Chapter Regression Suite Pass Counts (`/tmp/lt_bio_ch12/final`):**
  - **Chapter 11 (`qa_ch11.py`):** `1,894` QA assertions + `2,713` domain cases passed.
  - **Chapter 10 (`qa_ch10.py`):** `1,857` QA assertions + `1,938` domain cases passed.
  - **Chapter 9 (`qa_ch09.py`):** `1,819` QA assertions + `620` domain cases passed.
  - **Chapter 8 (`qa_ch08.py`):** `1,890` QA assertions + `1,731` domain cases passed.
  - **Chapter 7 (`qa_ch07.py`):** `1,710` QA assertions + `2,046` domain cases passed.
  - **Chapter 6 (`qa_ch06.py`):** `1,441` QA assertions + `1,145` domain cases passed.
  - **Chapter 5 (`qa_ch05.py`):** `985` QA assertions + `18,133` domain cases passed.
  - **Full-Book Offline & Lazy-Chunk Smoke Test (`livetest.py --offline`):** `0` chunks loaded before interaction, all `38` live figures + `3` explorers open cleanly online and offline with `0` console errors.

---

## Section 2: Cambridge IGCSE Biology 0610 (2026–2028 v3 & 2029) & Lower Secondary 0893 Syllabus Audit

Every Core and Supplement learning outcome assigned to Chapter 12 was audited across `source/src/ch12.md`, `source/figs_ch12.py`, `source/live/cell_division_model.js`, the three interactive widgets, and `source/provenance/ch12.yml`:

### Cambridge Lower Secondary Science 0893 (`7Bp.03`, `9Bs.01`, `9Bs.02`, `9Bs.03`): PASS
- **`9Bs.01` & `9Bs.02`:** Reinforces that nuclear chromosomes are made of DNA and carry genes (`~20,000` protein-coding genes across `46` human chromosomes) copied faithfully before every cell division (`src/ch12.md` §12.1, §12.3).
- **`7Bp.03` & `9Bs.03`:** Explicitly explains how **gametes** (sperm and egg cells in animals; pollen grain nuclei and egg cells in ovules in flowering plants) carry **half the number of chromosomes** of body cells (`n = 23` vs `2n = 46`) and fuse at **fertilisation** so the **zygote** receives a complete diploid set (`23` maternal + `23` paternal = `46`) (`src/ch12.md` §12.4, `#fig-12-7`).

### Cambridge IGCSE Biology 0610 Topic 17.1 — Chromosomes, genes and proteins (`Haploid/Diploid` & `Supplement 6`): PASS
- **17.1 Core 1–3 & Haploid/Diploid Definitions (`17.1` & `16.2.3`):**
  - Defines a **haploid nucleus** verbatim as **a nucleus containing a single set of unpaired chromosomes** (e.g. in the **nuclei of gametes**, where `n = 23` in humans) (`src/ch12.md` §12.4 `:::note`, `:::school`, `#fig-12-7`, `#fig-12-8`).
  - Defines a **diploid nucleus** verbatim as **a nucleus containing two sets of chromosomes** (e.g. in somatic body cells and in the **nucleus of a zygote**, where **`2n = 46`**, arranged as **`23` pairs** of homologous chromosomes in humans) (`src/ch12.md` §12.4 `:::note`, `:::school`, `#fig-12-7`, `#fig-12-8`).
- **17.1 Supplement 6 (`Selective Gene Expression`):**
  - Explains verbatim that **most body cells in an organism contain the same genes, but many genes in a particular cell are not expressed because the cell only makes the specific proteins it needs** (`src/ch12.md` §12.3, `:::note`, `:::five`, `:::careful`, `:::school`, `#fig-12-5`, `#fig-12-6`, and `w_stem_cell_expression_lab.js`).
  - Demonstrates concretely that every nucleated somatic cell retains all `46` chromosomes (`100%` of the `~20,000` genes), keeping housekeeping genes (`ATP5F1A`, `GAPDH`) switched ON across all living cells while transcription factors selectively switch ON `INS` in pancreatic beta cells, `HBB` in bone-marrow erythroblasts, and `CHAT`/`SCN9A` in spinal motor neurones.

### Cambridge IGCSE Biology 0610 Topic 17.2 — Mitosis: PASS
- **17.2.1 (Core):** Defines **mitosis** verbatim as **nuclear division giving rise to genetically identical cells**, explicitly noting in prose and `:::school` that stage names (*prophase, metaphase, anaphase, telophase*) are not required for exam recall (`src/ch12.md` §12.2, `#fig-12-3`, `#fig-12-8`).
- **17.2.2 (Core):** States all four biological roles of mitosis verbatim: **growth**, **repair of damaged tissues**, **replacement of cells**, and **asexual reproduction** (`src/ch12.md` §12.2, `:::note`, `:::school`, `#fig-12-3`).
- **17.2.3 (Supplement):** States verbatim that the **exact replication of chromosomes occurs before mitosis** during interphase (S phase), connecting semi-conservative unzipping and complementary base pairing (`A=T`, `C≡G`) to the formation of identical **sister chromatids** (`src/ch12.md` §12.1, §12.2, `#fig-12-1`, `#fig-12-2`).
- **17.2.4 (Supplement):** States verbatim that **during mitosis, the copies of chromosomes separate, maintaining the chromosome number in each daughter cell** (`2n = 46 → 2n = 46`) (`src/ch12.md` §12.1, §12.2, `#fig-12-2`, `#fig-12-3`, `w_mitosis_meiosis_stepper.js`).
- **17.2.5 (Supplement):** Describes **stem cells** verbatim as **unspecialised cells that divide by mitosis to produce daughter cells that can become specialised for specific functions**, covering embryonic stem cells, adult tissue stem cells (red bone marrow, intestinal crypts, basal skin), and plant apical/cambial meristems (`src/ch12.md` §12.3, `#fig-12-5`, `w_stem_cell_expression_lab.js`).

### Cambridge IGCSE Biology 0610 Topic 17.3 — Meiosis: PASS
- **17.3.1 (Core):** States verbatim that **meiosis is involved in the production of gametes** (in testes and ovaries of animals; anthers and ovules of flowering plants) (`src/ch12.md` §12.4, `#fig-12-7`, `#fig-12-8`).
- **17.3.2 (Supplement):** Describes **meiosis** verbatim as a **reduction division in which the chromosome number is halved from diploid to haploid resulting in genetically different cells** (`2n = 46 → n = 23`), noting that sub-stage names are not required (`src/ch12.md` §12.4, `:::note`, `:::school`, `#fig-12-7`, `#fig-12-8`, `w_mitosis_meiosis_stepper.js`).

### Cambridge IGCSE Biology 0610 Topics 16.1 & 16.2 — Asexual vs Sexual Reproduction Bridge: PASS
- **16.1.1 & 16.1.2 (Core & Supplement):** Defines **asexual reproduction** verbatim as **a process resulting in the production of genetically identical offspring from one parent** (`src/ch12.md` §12.2 `:::note`), illustrates vegetative examples (potato stem tubers, onion bulbs, strawberry runners, sugarcane cuttings, Cavendish banana suckers/tissue culture), and systematically contrasts its **advantages and disadvantages** both **to a population of a species in the wild** and **to crop production** (`src/ch12.md` §12.2 table, `#fig-12-4`, Case 12 `#fig-12-9`).
- **16.2.1–16.2.4 (Core & Supplement):** Defines **fertilisation** verbatim as **the fusion of the nuclei of gametes** and **sexual reproduction** as **a process involving the fusion of the nuclei of two gametes to form a zygote and the production of offspring that are genetically different from each other**, states that gamete nuclei are **haploid (`n`)** and the zygote nucleus is **diploid (`2n`)**, and contrasts the **advantages and disadvantages of sexual reproduction** in the wild and in crop production (`src/ch12.md` §12.4, `#fig-12-4`, `#fig-12-7`, Case 12 `#fig-12-9`).
- **Strict Syllabus Boundary Obedience (Chapters 13–16 Partition):**
  - **Chapter 13 reserved:** Mendelian monohybrid crosses, dominant/recessive/codominant alleles, Punnett squares (`3:1`, `1:2:1`, `1:1`), pedigree charts, and sex-linked inheritance are **only** previewed in the closing `:::next` bridge at the end of Chapter 12.
  - **Chapter 14 reserved:** Continuous vs discontinuous variation, natural/artificial selection, adaptive features, and antibiotic resistance are deferred to Chapter 14.
  - **Chapter 15 reserved:** Restriction enzymes, DNA ligase, bacterial plasmid vectors, and recombinant biotechnology are deferred to Chapter 15.

---

## Section 3: Independent Mathematical, Biophysical & Algorithmic Verification of `cell_division_model.js`, `ch12_domain.mjs`, Prose, Plates & Widgets

Every constant, formula, sequence, and state transition in `source/live/cell_division_model.js`, `source/tests/ch12_domain.mjs` (`4,387` assertions), `source/src/ch12.md`, `source/figs_ch12.py`, and `source/live/enhancements.js` was independently verified using Node and Python:

### 1. Meselson & Stahl (1958) `CsCl` Density-Gradient Laws & Polymerase Proofreading (`simulateDnaReplicationMeselson`, `#fig-12-1`, `w_dna_replication_meselson.js`)
- **Equilibrium buoyant densities in `CsCl` at `44,770 rpm` (`140,000 × g`):**
  - Pure heavy `¹⁵N/¹⁵N` *E. coli* DNA (`Generation 0`): $\rho_{\text{HH}} = \mathbf{1.724\text{ g cm}^{-3}}$.
  - Pure light `¹⁴N/¹⁴N` *E. coli* DNA: $\rho_{\text{LL}} = \mathbf{1.710\text{ g cm}^{-3}}$.
  - Hybrid `¹⁵N/¹⁴N` *E. coli* DNA: exact arithmetic midpoint $\rho_{\text{HL}} = (1.724 + 1.710)/2 = \mathbf{1.717\text{ g cm}^{-3}}$.
- **Semi-conservative generation fractions (`computeSemiConservativeFractions`):**
  - For generation $g \ge 1$ in `¹⁴N` medium ($20\text{ min}$ per doubling), total DNA duplexes $= 2^g$ ($2^{g+1}$ single strands), while the **2 original parental `¹⁵N` single strands** remain conserved inside **2 hybrid (`¹⁵N/¹⁴N`) duplexes**:
    $$\text{Hybrid fraction} = \frac{2}{2^g} = \frac{1}{2^{g-1}}, \qquad \text{Light fraction} = 1 - \frac{1}{2^{g-1}}$$
  - **`G0` ($0\text{ min}$, $1$ duplex):** **`100%` Heavy (`1.724 g/cm³`)**, `0%` Hybrid, `0%` Light.
  - **`G1` ($20\text{ min}$, $2$ duplexes):** `0%` Heavy, **`100%` Hybrid (`1.717 g/cm³`)**, `0%` Light — **falsifies Conservative replication** (which predicts `50%` Heavy at `1.724` + `50%` Light at `1.710` and `0%` Hybrid).
  - **`G2` ($40\text{ min}$, $4$ duplexes):** `0%` Heavy, **`50%` Hybrid (`1.717 g/cm³`) + `50%` Light (`1.710 g/cm³`)** — **falsifies Dispersive replication** (which predicts a single patchwork band at $1.710 + \frac{1}{4}(1.724 - 1.710) = \mathbf{1.7135\text{ g cm}^{-3}}$).
  - **`G3` ($60\text{ min}$, $8$ duplexes):** `0%` Heavy, **`25.0%` Hybrid (`2/8`) + `75.0%` Light (`6/8`)**.
  - **`G4` ($80\text{ min}$, $16$ duplexes):** `0%` Heavy, **`12.5%` Hybrid (`2/16`) + `87.5%` Light (`14/16`)** (matches §12.1 `:::check` Question 2 exactly).
- **Template base-pairing & 4-stage proofreading fidelity (`MESELSON_FIDELITY_PRESETS`):**
  - 12-bp fork template `ATGCCGTAATCG` pairs with `TACGGCATTAGC` ($6\text{ A/T}\times 2 + 6\text{ G/C}\times 3 = \mathbf{30\text{ H-bonds}}$).
  - Step 1 (raw H-bond base pairing): $10^{-4}$ errors/bp (`~640,000` errors per $6.4\times 10^9\text{ bp}$ division).
  - Step 2 (polymerase active-site geometry check): $10^{-5}$ errors/bp (`~64,000` errors/division).
  - Step 3 (polymerase `3'→5'` exonuclease proofreading): $10^{-7}$ errors/bp (`~640` errors/division).
  - Step 4 (full proofreading + post-replication mismatch repair across `~40,000` origins): **$10^{-9}$ errors/bp** (`~6` errors per human diploid division).

### 2. Chromosome vs Sister Chromatid Bookkeeping, Mitosis vs Meiosis & Triploid Cavendish Banana (`simulateMitosisMeiosisStepper`, `#fig-12-2`, `#fig-12-3`, `#fig-12-7`–`#fig-12-9`, `w_mitosis_meiosis_stepper.js`)
- **Centromere vs chromatid accounting across Human Mitosis (`mode = 0, organismPreset = 1`):**
  - **Stage 1 (`G₁` unreplicated):** `46` chromosomes (`23` homologous pairs) / **`46` chromatids (`46` DNA molecules)**, mass `2C`, `1` cell.
  - **Stages 2 & 3 (`G₂` after S-phase copy & equatorial alignment):** still **`46` chromosomes** (counted by `46` shared centromeres) / **`92` sister chromatids (`92` DNA molecules)**, mass `4C`, `1` cell.
  - **Stage 4 (anaphase spindle separation):** centromeres split (`92` separated daughter chromosomes / `92` chromatids transiently in `1` parting cell).
  - **Stage 5 (telophase / cytokinesis):** **`2` genetically identical diploid daughter cells**, each with **`2n = 46` chromosomes / `46` chromatids**, mass `2C`.
- **Human Meiosis & Fertilisation (`mode = 1, organismPreset = 1`):**
  - **Stage 1 (`G₁` diploid germ cell):** `2n = 46` chromosomes / `46` chromatids (`2C`, `1` cell).
  - **Stage 2 (pre-meiotic S phase & Prophase I synapsis):** `2n = 46` chromosomes / `92` chromatids (`4C`, `1` cell; homologous pairing `true`, crossing over `true`).
  - **Stage 3 (Meiosis I reduction division):** homologous pairs separate $\to$ **`2` haploid cells**, each holding **`n = 23` chromosomes / `46` chromatids (`2C`)**.
  - **Stage 4 (Meiosis II chromatid separation):** sister chromatids separate $\to$ **`4` genetically different haploid gametes**, each holding **`n = 23` chromosomes / `23` single DNA molecules (`1C`)**.
  - **Stage 5 (Fertilisation):** fusion of haploid sperm (`n = 23`) and haploid egg (`n = 23`) restores **`1` diploid zygote (`2n = 46` chromosomes / `46` chromatids, `2C`)**.
  - **Independent assortment & Weismann doubling math:**
    - Human (`n = 23` pairs): $2^{23} = \mathbf{8,388,608}$ gamete combinations per parent; $2^{23} \times 2^{23} = 2^{46} = \mathbf{70,368,744,177,664} \approx \mathbf{7.04 \times 10^{13}}$ (`~70 trillion`) zygote combinations before crossing over.
    - Without meiosis (if gametes were `2n = 46`): Generation 1 $= 92$, Generation 2 $= 184$, Generation 3 $= 368$, Generation 10 $= 46 \times 2^{10} = \mathbf{47,104}$ chromosomes.
- **Wild Diploid (`2n = 22`) vs Triploid Cavendish Banana (`3n = 33`) & Coimbatore Sugarcane (`2n = 80`):**
  - **Wild *Musa acuminata* (`2n = 22, x = 11`):** `11` homologous pairs segregate `11 + 11` cleanly in Meiosis I ($2^{11} = \mathbf{2,048}$ combinations) $\to$ viable `n = 11` gametes $\to$ hard black fertile seeds.
  - **Triploid Cavendish banana (`3n = 33, x = 11`):** replicates `33` chromosomes to `66` chromatids in S phase and divides smoothly by **mitosis (`33 → 33`)** to grow suckers and tissue-culture plantlets, but in **Meiosis I** its **`11` homologous triplets** split `2 + 1` (or `3 + 0`) at random across the two poles (probability of an even split is $0$, and probability of all 11 triplets sorting `1` or `2` uniformly to yield pure $n=11$ or $2n=22$ is $(1/2)^{10} \dots (1/2)^{11} = 1/2048$), producing unbalanced aneuploid spores (`11–22` chromosomes) that abort $\to$ **sterile seedless fruit** with `100%` clonal vulnerability to *Fusarium* Panama disease `TR4`.
  - **Noble sugarcane *Saccharum officinarum* (`2n = 8x = 80, x = 10`):** even-numbered octoploid (`40` pairs) studied by **E. K. Janaki Ammal** in Coimbatore; undergoes meiotic pairing ($2^{40}$ combinations) and hybridisation with wild *S. spontaneum* (`2n = 48–128`).

### 3. Stem Cell Hierarchy, Selective Gene Expression & Gurdon/Yamanaka Reprogramming (`simulateStemCellExpressionLab`, `#fig-12-5`, `#fig-12-6`, `w_stem_cell_expression_lab.js`)
- **Genomic invariance across all 64 widget states (`4` lineages $\times$ `4` stages $\times$ `4` regulator switches):**
  - In every state, `chromosomesInNucleus === 46`, `totalGenesInNucleus === 20000`, `dnaGenesRetainedPct === 100`, and every gene in `GENE_PANEL` has `presentInDna === true`.
- **Selective expression across the 6-gene locus panel (`ATP5F1A`, `GAPDH`, `OCT4_SOX2`, `INS`, `HBB`, `CHAT_SCN9A`):**

| Cell State / Lineage | Nuclear DNA (`2n = 46`) | `ATP5F1A` & `GAPDH` (Housekeeping) | `OCT4_SOX2` (Pluripotency) | `INS` (Chr 11 Beta) | `HBB` (Chr 11 Blood) | `CHAT_SCN9A` (Neural) |
|---|---|---|---|---|---|---|
| **Stage 1 Stem Cell / Zygote** | `100%` (`46` chr) | **ON** (`450` mRNA) | **ON** (`600` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) |
| **Stage 4 Pancreatic Beta Cell (`PDX1`)** | `100%` (`46` chr) | **ON** (`450` mRNA) | OFF (`0` mRNA) | **ON** (`2,800` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) |
| **Stage 4 Bone-Marrow Erythroblast (`GATA1`)** | `100%` (`46` chr) | **ON** (`450` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) | **ON** (`3,500` mRNA) | OFF (`0` mRNA) |
| **Stage 4 Spinal Motor Neurone (`NEUROD1/ISL1`)** | `100%` (`46` chr) | **ON** (`450` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) | **ON** (`1,400` mRNA) |
| **Stage 4 Gurdon / Yamanaka iPSC (`Oct4, Sox2, Klf4, c-Myc`)** | `100%` (`46` chr) | **ON** (`450` mRNA) | **ON** (`750` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) | OFF (`0` mRNA) |

---

## Section 4: Cross-Chapter & Cross-Book Continuity Audit: PASS

1. **Fulfilment of Chapter 11's Closing Bridge (`src/ch11.md` `:::next`):**
   - Directly answers all three questions posed at the close of Chapter 11: **(1)** semi-conservative DNA replication (`§12.1`) and mitotic chromosome separation (`§12.2`) from 1 zygote to 37 trillion cells; **(2)** stem cells (`0610 17.2.5`) and selective gene expression (`0610 17.1.6`) explaining why pancreatic beta cells, erythroblasts, and motor neurones carry identical chromosomes yet build different proteins (`§12.3`); and **(3)** meiosis (`0610 17.3`) halving diploid (`2n = 46`) germ cells to haploid (`n = 23`) gametes so fertilisation restores `2n = 46`, integrated with the seedless triploid Cavendish banana (`3n = 33`) in Case 12 (`§12.4`).
2. **Existing Companion Stories & Cross-Chapter Callbacks Preserved and Linked:**
   - **E. K. Janaki Ammal (`source/src/stories/p-ammal.md`):** Preserved byte-for-byte (`2,155` bytes, SHA-256 `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096`) and auto-linked in `src/ch12.md` §12.4 and Case 12 (`#ch12 a[data-story="p-ammal"]` verified in `qa_ch12.py`).
   - **Kamal Ranadive (`source/src/stories/p-ranadive.md`):** Preserved byte-for-byte and auto-linked inside `meselson-flemming-gurdon-divisions.md` without duplicate `terms:` ownership.
   - Connects seamlessly back to Chapter 2 (specialised cells, anucleate mature RBCs, xylem vessels), Chapters 5 & 8 (`270 million` haemoglobin molecules per RBC, `120-day` lifespan, `~2 million/s` bone-marrow replacement, EPO), Chapter 7 (small-intestinal crypt mitosis every `3–5 days`), Chapters 9 & 10 (motor neurone `SCN9A`/`CHAT` channels and pancreatic beta-cell `INS` insulin secretion), and Chapter 11 (`A=T` `2` H-bonds, `C≡G` `3` H-bonds, `HBB` and `INS` on Chromosome `11`, mRNA transcription and ribosomal translation).
3. **New Companion Story `source/src/stories/meselson-flemming-gurdon-divisions.md` (`terms:` check):**
   - Declares `terms: Walther Flemming, Matthew Meselson, Franklin Stahl, Meselson and Stahl, John Gurdon, Shinya Yamanaka`.
   - Independent Python scan across `src/ch00.md`–`src/ch11.md` and all 20 pre-existing stories returned **0 prior hits** for all six terms, and `qa_ch12.py` confirmed `0` hijacked story links across `#ch0`–`#ch11`.
4. **Outgoing Bridge to Chapter 13 (`src/ch12.md` `:::next`):**
   - Cleanly bridges to Chapter 13 (*The Monk's Spreadsheet: Mendel, Alleles & Inheritance*) across its three core questions: **(1)** homologous chromosome pairs carrying two alleles (`HbA` vs `HbS`; `Iᴬ, Iᴮ, Iᴼ`), **(2)** meiotic segregation and Punnett-square probability ratios (`3:1`, `1:2:1`, `1:1`), and **(3)** `X`-linked inheritance (`red–green colour blindness`, `haemophilia`).

---

## Section 5: Historical & Primary-Source Provenance Audit (`source/provenance/ch12.yml` & `sources.yml`): PASS

Audited all **18 top-level keys** in `source/provenance/ch12.yml` (`12.1`, `12.2`, `12.3`, `12.4`, the 9 `fig:c12_*` entries, `story:meselson-flemming-gurdon-divisions`, the 3 `model:*` entries, and `record:ch12-decisions`) and `source/provenance/sources.yml`:

1. **James Watson & Francis Crick (25 April 1953, *Nature* 171(4356): 737–738, `doi:10.1038/171737a0`), Matthew Meselson & Franklin W. Stahl (July 1958, *PNAS* 44(7): 671–682, `PMC528642`), and Arthur Kornberg (1956–1959, *J. Biol. Chem.* 233(1): 171–177):** Accurately documents the 1953 complementary-copying prediction, the 1954 Woods Hole meeting and 1957–1958 Caltech experiments (`14` generations in `¹⁵NH₄Cl` at `36 °C`, shift to `¹⁴NH₄Cl`, `CsCl` equilibrium centrifugation at `44,770 rpm` / `~140,000 × g`, UV absorption at `260 nm`, buoyant densities `1.724`, `1.717`, and `1.710 g/cm³` falsifying conservative replication at Gen 1 and Max Delbrück's dispersive model at Gen 2), and DNA polymerase synthesis and `3'→5'` exonuclease proofreading.
2. **Walther Flemming (1879, *Arch. mikrosk. Anat.* 16: 302–436; 1882, *Zellsubstanz, Kern und Zelltheilung*, Leipzig, `doi:10.5962/bhl.title.168645`):** Accurately documents aniline dye staining of fire salamander larvae (*Salamandra maculosa*) at the University of Kiel, the naming of *chromatin* and *mitosis* (*mitos*, warp thread), longitudinal chromosome splitting, and *omnis nucleus e nucleo*.
3. **John B. Gurdon (1962, *J. Embryol. Exp. Morphol.* 10(4): 622–640, `doi:10.1242/dev.10.4.622`), Kamal Ranadive (1950s–1960s, Indian Cancer Research Centre, Parel, Mumbai, *Current Science* 80(12): 1596), and Kazutoshi Takahashi & Shinya Yamanaka (2006, *Cell* 126(4): 663–676, `doi:10.1016/j.cell.2006.07.024`):** Accurately documents *Xenopus laevis* tadpole intestinal epithelial nuclear transplantation into UV-enucleated eggs at Oxford, Indian mammalian tissue-culture research in Mumbai, and four-factor (`Oct4, Sox2, Klf4, c-Myc`) fibroblast reprogramming into induced pluripotent stem cells (`iPSCs`) at Kyoto University.
4. **Oscar Hertwig (1876, *Morphol. Jahrb.* 1: 347–434), Edouard van Beneden (1883, *Arch. Biol.* 4: 265–640), August Weismann (1887), and E. K. Janaki Ammal (1938, *Nature* 141: 925; Darlington & Janaki Ammal 1945, *Chromosome Atlas of Cultivated Plants*):** Accurately documents sea-urchin fertilisation nuclear fusion, *Ascaris megalocephala* diploid (`2n = 4`) vs haploid gamete (`n = 2`) counts, Weismann's theoretical prediction of reduction division, and Janaki Ammal's Coimbatore sugarcane crosses (*Saccharum officinarum* `2n = 80` × *S. spontaneum* `2n = 48–128`) and triploid banana (`3n = 33`) cytogenetics.
5. **Honest Source-Use, Access-Limits & Non-Trialled Activity Disclosures:** Every section and `record:ch12-decisions` includes explicit OpenStax attribution (`Biology 2e` and `Concepts of Biology` in `provenance/sources.yml`) and licence/AI-ingestion disclosures, honest access limits, and explicit in-text and provenance disclosure that the kitchen onion-bulb rooting and potato-eye sprouting observation (`:::home` in §12.2) is an optional demonstration reviewed for safety and feasibility (explicitly warning never to eat raw potato sprouts or green tubers due to toxic glycoalkaloid **solanine**) and not classroom-trialled for this edition.

---

## Section 6: Preservation Baseline & Shared-File Audit (`source/tests/ch12-preserved.json`): PASS

- Independently verified all **299** pre-Chapter-12 files recorded in `source/tests/ch12-preserved.json` by exact byte count and SHA-256 hash: **298 of 299** files (including all Chapters 0–11 markdown, figures, all 21 prior stories including `p-ammal.md` and `p-ranadive.md`, front-matter 3D explorers, models, widgets, CSS/JS app shell, fonts, `provenance/sources.yml`, and prior gate/test files) are **100% byte-for-byte identical** to the pre-Chapter-12 baseline.
- The sole modified existing file is the shared registry `source/live/enhancements.js` (current size `91,898` bytes, SHA-256 `17babcd77caea250f6e8f021148ccec5e6264eb6dff25ac3d6a03a12f6fde6d9`). Splitting at the single marker `  dna_replication_meselson: {` and restoring the closing `};\n` reconstructs the exact `81,763`-byte pre-Chapter-12 file with SHA-256 **`9bf761b461d71b97f1172c48feeae12b2670c68b70f13cff173e16685c57495a`** (matching `original_base64` byte-for-byte), proving that `source/live/enhancements.js` was modified strictly by appending the 3 Chapter 12 widget entries (`dna_replication_meselson`, `mitosis_meiosis_stepper`, `stem_cell_expression_lab`).

---

## Section 7: Gate A Findings & Disposition

- **`BLOCKER`:** None (`0`).
- **`FIX`:** None (`0`).
- **`CONSIDER`:** None (`0`).

**Final Gate A Verdict:** **`PASS` (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**.
