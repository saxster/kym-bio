# Chapter 11 — Gate B: Reader Clarity, Feynman Method, Visuals & Safety Audit

Independent report-only review, 30 October 2026. Reviewed all finished Chapter 11 (*“The Twisted Ladder & The Protein Printers”*, opening Volume IV, *“The Master Code & The Four-Billion-Year Case File”*) source, companion story, figure, widget, model, test, build, and rendered QA artifacts with fresh context without authoring or modifying any chapter, story, figure, widget, or provenance file. In accordance with the Gate B ownership rule, `/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch11-B.md` is the **only** file created or modified during this review.

**Disposition: Gate B PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`).** Every numbered section (`11.1`, `11.2`, `11.3`, `11.4`) establishes the concrete experimental problem, physical mechanism, or kitchen/laboratory scene before or alongside naming its technical terms, passes the Feynman movability test, and supports an accurate **≤ 3-sentence explain-back** in 12-year-old Kym's voice without reproducing any target misconception. No section requires a `REWRITE`.

---

## 1. Artifact Hash & Build Verification

Exact byte sizes and SHA-256 hashes of all 22 Chapter 11 deliverables and final build artifacts matching `/tmp/lt_bio_ch11/final/artifact-hashes.json`, with service-worker cache version `lw-b3d3ad9c287c` and exported full-book print PDF pagination spanning figure pages `404–443` of `535` total pages:

| # | Artifact Path | Bytes | SHA-256 |
|---:|---|---:|---|
| 1 | `source/grounding/ch11.md` | 36,860 | `fdcb7496c3d4842a473b76b72a57db3da938adf9779c7b075399bf28176fdc59` |
| 2 | `source/src/ch11.md` | 81,565 | `3e3f616a899999bac1cf93f64173e0d30a79833097dd6ead92081b01790e153c` |
| 3 | `source/src/stories/franklin-khorana-codebreakers.md` | 12,921 | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| 4 | `source/figs_ch11.py` | 35,437 | `a219773ff5b44448e16909bc80ad64c610082d00526a5ea8b6f6f204b2bee211` |
| 5 | `source/provenance/ch11.yml` | 27,649 | `306cfa3bb7feb96bf2edf81264410ff33bef38b2669d30ab60194cfb42a95626` |
| 6 | `source/provenance/sources.yml` | 1,232 | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| 7 | `source/live/genetic_code_model.js` | 33,827 | `7e3f97f1be1dce4762edfe14549e2a3a00d17077e56efa49e0135a04c94292ed` |
| 8 | `source/live/w_dna_base_pairing.js` | 12,014 | `933841cbddaec082e23646d7ed442281eaef3cadc05e79c7c422e282ae8be532` |
| 9 | `source/live/w_codon_cipher_khorana.js` | 10,651 | `e19daa7296c25e9f81e64d9be4fae70cbc342114501843baa8d9779c19ca84a1` |
| 10 | `source/live/w_transcription_translation_ribosome.js` | 10,842 | `14fa3de06c432281ab1331612e47350b8b0c0eced21fb7bab2f273cf97947007` |
| 11 | `source/live/enhancements.js` | 81,763 | `9bf761b461d71b97f1172c48feeae12b2670c68b70f13cff173e16685c57495a` |
| 12 | `source/tests/ch11-preserved.json` | 138,511 | `723c78384181fa66c6ff7cf237c15bd9c68c58c7a76fafece7e6deafde2b88d2` |
| 13 | `source/tests/ch11_domain.mjs` | 11,535 | `1ea669cc9bbd54df45e4f7bb623cf3936a81b759a0733eafbc539b5e2190ee17` |
| 14 | `source/tests/qa_ch11.py` | 31,249 | `20020df875c8ff46a91dd142d6ef9c722619c32c4a8a8737b477287649d5fedc` |
| 15 | `source/tests/verify_ch11.sh` | 1,537 | `5931cc71adeb838f0877fb512e7428d56f9d6b7e287340f1edae33780c718fc8` |
| 16 | `source/tests/README-ch11.md` | 2,468 | `47886a91c121a4a63796f6bbbb53c4f1bd4b48dff0be4bab314d87fdfd43feb9` |
| 17 | `source/build/site/index.html` | 2,546,045 | `4cb76291a56b256f2e26826f3311dc4728ddf150f2aa9bfa05ae9540603ee42b` |
| 18 | `source/build/site/sw.js` | 3,342 | `ce943807a285518613584fc38cfafd1c425cd4f248851f755891a5064475aec3` |
| 19 | `source/build/site/live/w_codon_cipher_khorana-IVHI32Z5.js` | 5,502 | `326a2b3fddbbeba51da8238c44184b4d8e996672df4b0d0f967918988147409e` |
| 20 | `source/build/site/live/w_dna_base_pairing-BAUJF3R4.js` | 6,459 | `e098ee5769a1469ca8fb18d817b7633c992587a8e7f9b6a973b7336023a32f78` |
| 21 | `source/build/site/live/w_transcription_translation_ribosome-UDYHDGJW.js` | 5,977 | `1eddcbc8a8f5cf6b98027197bbc87fa2181262700f943f05b21d4304c93ec338` |
| 22 | `/tmp/lt_bio_ch11/final/qa_ch11/print.pdf` | 26,158,781 | `f302f096033b083454a23c18985199127c8a61bf867729a20d2a9cee59b109ae` |

---

## 2. Mandatory ≤ 3-Sentence Explain-Backs (Sections `11.1`–`11.4`)

Each section explain-back below is **exactly 3 sentences** (verified ≤ 3 sentences) in 12-year-old Kym's voice and captures the complete causal mechanism from the prose alone without reproducing any target misconception:

- **Section 11.1 (`11.1 The hidden instruction book: chromosomes, DNA and genes` — 3 sentences):**
  When Avery, MacLeod, and McCarty treated Griffith's heat-killed Smooth (*S*) bacterial extract with specific digestive enzymes, proteases and RNase left hereditary transformation intact whereas DNase abolished it completely (confirmed by Hershey and Chase's `³²P`-DNA vs `³⁵S`-protein phage experiment), proving that DNA—not chromosomal protein—carries hereditary instructions. Inside a eukaryotic cell (`~20 µm`), the nucleus (`~6 µm`) holds thread-like chromosomes made of long coiled DNA molecules (`2.0 nm` wide), and each gene is a specific length of DNA along a chromosome that codes for one protein and helps to determine an organism's characteristics alongside its environment. In our kitchen banana demo, mashing breaks cell walls, dishwashing detergent dissolves the lipid cell and nuclear membranes, `Na⁺` salt ions shield the negatively charged DNA phosphate backbones so strands clump together, and ice-cold rubbing alcohol precipitates millions of DNA strands as visible white threads.

- **Section 11.2 (`11.2 The twisted ladder: Photo 51, Chargaff's ratios and the double helix` — 3 sentences):**
  Rosalind Franklin and Raymond Gosling's hydrated B-DNA X-ray photograph (*Photo 51*) revealed an X-shaped helical cross with a `3.4 nm` turn pitch, `0.34 nm` vertical base spacing (`10` base pairs per turn), and a uniform `2.0 nm` diameter with water-loving sugar–phosphate backbones on the outside, while Erwin Chargaff proved chemically that `%A ≈ %T` and `%G ≈ %C` across species. Combining those clues, Watson and Crick showed that a DNA molecule consists of two antiparallel strands coiled into a double helix whose inward-facing bases form hydrogen-bonded cross-links following a strict complementary rule: two-ring adenine always pairs with one-ring thymine (`A=T`, 2 hydrogen bonds) and one-ring cytosine always pairs with two-ring guanine (`C≡G`, 3 hydrogen bonds). Because every purine–pyrimidine rung spans the exact same `2.0 nm` width, the sugar–phosphate backbone stays uniform in every organism while the lengthwise sequence of bases (`A, T, C, G`) along a strand is completely free to store genetic information and automatically fixes the complementary partner strand.

- **Section 11.3 (`11.3 Cracking the triplet cipher and printing the protein: from mRNA to the ribosome` — 3 sentences):**
  Because a 4-base alphabet yields only `4¹ = 4` singlets or `4² = 16` doublets, it takes 3-base triplets (`4³ = 64` codons: 61 sense codons + 3 stop codons `UAA, UAG, UGA`) to encode all 20 amino acids, as proved by Crick and Brenner's `+1/+2/+3` phage frameshifts and decoded by Nirenberg's `poly-U` (`UUU = Phe`) and Har Gobind Khorana's synthetic repeating copolymers (`(UC)ₙ → Ser–Leu`, `(UG)ₙ → Cys–Val`). To protect its master archive, a eukaryotic cell keeps the DNA gene inside the nucleus, transcribes a single-stranded messenger RNA (`mRNA`) copy of that gene in the nucleus (using Uracil `U` in place of Thymine `T` on a ribose backbone), and sends the `mRNA` through a nuclear pore into the cytoplasm to pass through a ribosome. As the ribosome reads the `mRNA` three bases (one codon) at a time and links tRNA-delivered amino acids with peptide bonds in the exact order set by the `mRNA` base sequence, the polypeptide folds via Ramachandran backbone angles into 3D enzymes, membrane carriers, neurotransmitter receptors, and antibodies so DNA controls cell function.

- **Section 11.4 (`11.4 One letter changed: beta-globin, silent triplets and why sequence controls shape` — 3 sentences):**
  Using trypsin peptide fingerprinting on the 146-amino-acid human beta-globin (`HBB`) chain, Vernon Ingram proved that sickle-cell haemoglobin (`HbS`) differs from normal adult haemoglobin (`HbA`) by just one base out of 438 coding bases at Codon 6 (`GAG → GTG` in coding DNA, `GAG → GUG` in `mRNA`), a missense substitution that replaces negatively charged, hydrophilic glutamic acid (`Glu⁶`) with neutral, hydrophobic valine (`Val⁶`) whose sticky surface patch polymerises deoxygenated `HbS` into rigid fibres that sickle red blood cells. By contrast, a single-base substitution at Codon 3 (`CTG → CTT` in coding DNA, `CUG → CUU` in `mRNA`, as in Child X) is a silent (synonymous) substitution because the 64-codon genetic code is degenerate and both `CUG` and `CUU` code for leucine (`Leu³`), leaving the 146-amino-acid sequence and 3D `HbA` structure 100% unchanged. Meanwhile, a nonsense substitution (such as Codon 39 `CAG → TAG`, `mRNA` `UAG` stop) halts the ribosome early and releases a truncated, non-functional fragment, and a single-base deletion (`−1`) shifts the downstream triplet reading frame completely.

---

## 3. Feynman “Thing Before Name”, Movability & Misconception-Guardrail Audit

### 3.1 Term-by-Term “Thing Before Name” Verification

Every technical term in `source/src/ch11.md` was audited to verify that the concrete physical puzzle, historical experiment, or structural mechanism precedes or accompanies the technical name:

| Section | Technical Term(s) | How the Concrete Mechanism / Experience Precedes the Name | Status |
|---|---|---|---|
| **11.1** | `chromosome`, `DNA`, `gene` | Starts with a dividing nucleus under a microscope and the 40-year debate over whether 20-letter chromosomal proteins or 4-letter nucleic acids store heredity, traces Griffith's (1928) Smooth/Rough capsule transformation and Avery–MacLeod–McCarty's (1944) protease/RNase/DNase elimination + Hershey–Chase (1952) `³²P`/`³⁵S` proof, and maps the 5-step scale hierarchy (`Cell → Nucleus → ==Chromosome== → ==Gene== → ==DNA==`) before the formal `:::note`. | **PASS** |
| **11.2** | `nucleotide`, `double helix`, `bases`, `complementary base pairing` | Introduces the 3-part monomer (phosphate + deoxyribose + 2-ring purine `A/G` or 1-ring pyrimidine `T/C`), walks through Chargaff's (1950) `%A ≈ %T` and `%G ≈ %C` chromatography ratios and Franklin & Gosling's (1952) hydrated B-DNA *Photo 51* (`3.4 nm` turn, `0.34 nm` step, `2.0 nm` width), and shows why purine+purine bulges (`>2.0 nm`) and pyrimidine+pyrimidine pinches (`<2.0 nm`) before defining `==double helix==`, `==bases==`, and **complementary base pairing** (`A=T`, `C≡G`). | **PASS** |
| **11.3** | `triplet` / `codon`, `degenerate code`, `messenger RNA (mRNA)`, `transcription`, `translation`, `ribosome` | Sets up the two puzzles—the **coding puzzle** (`4¹=4` and `4²=16` fail for 20 amino acids, requiring `4³=64` **triplets/codons**, proved by Crick–Brenner frameshifts and decoded by Nirenberg & Khorana) and the **location puzzle** (keeping the master chromosome locked in the nucleus while sending a disposable single-stranded `==messenger RNA (mRNA)==` copy through a nuclear pore to cytoplasmic **ribosomes**)—before naming **transcription**, **translation**, and the 6-step `0610 17.1.5` spine. | **PASS** |
| **11.4** | `silent (synonymous) substitution`, `missense substitution`, `nonsense (stop) substitution` | Walks through Vernon Ingram's (1956–1957) trypsin electrophoresis/chromatography fingerprint of human beta-globin (`HbA` vs `HbS`, Codon 6 `GAG → GTG`, hydrophilic `Glu⁶` → hydrophobic `Val⁶`), then tests the 64-codon table on three concrete beta-globin base changes (`Codon 3 CTG → CTT` where both `CUG` and `CUU` = `Leu³`; `Codon 6 GAG → GTG`; `Codon 39 CAG → TAG` = `UAG` stop) to establish `==silent==`, `==missense==`, and `==nonsense==` outcomes. | **PASS** |

### 3.2 Audit of `:::careful` Misconception Guardrail Blocks

All four `:::careful` blocks target high-frequency student and Cambridge `0893` / `0610` misconceptions directly and dismantle them mechanistically:

1. **Section 11.1 (`src/ch11.md:92–103`):** Refutes the inverted hierarchy misconception (*"DNA is made of chromosomes, and each chromosome is inside a gene"*), using the library reading room (`nucleus`), bound volume (`chromosome` made of coiled DNA), single recipe (`gene` = length of DNA coding for a protein), and ink letters (`DNA bases`) to lock in **Cell → Nucleus → Chromosome → Gene → DNA nucleotide bases**.
2. **Section 11.2 (`src/ch11.md:218–222`):** Refutes the misconception that different organisms have different sugar–phosphate backbones or different base-pairing rules (`A` with `G`), establishing that **every DNA double helix shares the exact same deoxyribose–phosphate backbone and `A=T`, `C≡G` pairing**, while **the sequence (order) of bases along the DNA strand** carries the specific genetic code (`0610 17.1 Core 3`).
3. **Section 11.3 (`src/ch11.md:360–367`):** Refutes the two classic `0610` exam errors (*"the gene leaves the nucleus and goes to the ribosome"* and *"the ribosome turns mRNA bases into amino acids"*), establishing that **the gene remains in the nucleus**, **an mRNA copy is made in the nucleus and moves to the cytoplasm**, and **the ribosome reads the mRNA base sequence to assemble free amino acids into a protein molecule**.
4. **Section 11.4 (`src/ch11.md:466–470`):** Refutes the over-generalisation that *every* DNA base mutation alters the amino-acid sequence and 3D shape of a protein, showing how the **degenerate 64-codon code** (`4³ = 64` for 20 amino acids) buffers **silent (synonymous) substitutions** (`CTG → CTT`, `mRNA CUG → CUU`, both `Leu³`) so the polypeptide chain and 3D Ramachandran fold remain 100% unchanged.

### 3.3 Audit of `:::five` (Rendered `.understand`) Movability Blocks

All four `:::five` blocks (`Chromosomes, DNA, and genes inside the nucleus`, `The DNA double helix and complementary base pairing`, `Transcription (mRNA copy in nucleus) and translation (protein assembly at the ribosome)`, and `Why one base change can be silent, missense, or nonsense`) contain all 5 core `?` questions (`What is it?`, `Why is it called this?`, `What problem did it solve?`, `Why does it work?`, `How does it help?`) and all 3 deeper `??` questions (`How do we know?`, `What it isn't`, `Where does it stop working?`) in the exact required order, testing non-circular operational understanding and explicit boundary conditions (mature mammalian red blood cells lacking a nucleus; single-stranded DNA phage `φX174` where `%A ≠ %T` until the complementary strand is synthesised; `α-amanitin` blocking nuclear RNA polymerase; and `+1/−1` frameshift insertions/deletions vs single-base substitutions).

---

## 4. Typography, Markdown & Guardrail Audit

Independently verified across `source/src/ch11.md`, `source/src/stories/franklin-khorana-codebreakers.md`, `source/figs_ch11.py`, `source/live/w_dna_base_pairing.js`, `source/live/w_codon_cipher_khorana.js`, `source/live/w_transcription_translation_ribosome.js`, and `source/build/site/index.html`:

- **`$` characters:** **`0`** across `ch11.md`, `franklin-khorana-codebreakers.md`, `figs_ch11.py`, and user-facing strings across all 3 widgets.
- **`\text` / raw LaTeX strings:** **`0`** across all Chapter 11 prose, story, figure, and widget files. All chemical formulas, isotopes, exponents, and biophysical symbols use clean Unicode (`³²P`, `³⁵S`, `Mg²⁺`, `Na⁺`, `Fe²⁺`, `−COO⁻`, `O₂`, `4¹ = 4`, `4² = 16`, `4³ = 64`, `(UC)ₙ`, `(UG)ₙ`, `(AG)ₙ`, `(AC)ₙ`, `(UAG)ₙ`, `A=T`, `C≡G`, `φ, ψ`, `5' → 3'`, `3' → 5'`, `2.0 nm`, `3.4 nm`, `0.34 nm`).
- **`!` exclamation marks:** **`0`** in `source/src/ch11.md`, **`0`** in `source/src/stories/franklin-khorana-codebreakers.md`, **`0`** in `source/figs_ch11.py`, and **`0`** in user-facing strings across all 3 widgets.
- **Clean HTML list & table rendering:** Verified in `source/build/site/index.html` (`#ch11`) and in the rendered PDF pages that every numbered list, bulleted list, and Markdown comparison table (`DNA vs mRNA` in `11.3` and the `Case 11` sequencing ledger) is parsed into clean `<ol>`/`<ul>`/`<li>`/`<table>` elements with **`0`** unparsed inline list markers.

---

## 5. Companion Story & Cross-Link Audit (`source/src/stories/franklin-khorana-codebreakers.md`)

Audited `source/src/stories/franklin-khorana-codebreakers.md` (*“A humid X-ray camera in London and a synthetic gene bench from Raipur to Madison”*, `12,921` bytes) against `source/STORYWRITING.md`:

1. **Concrete historical scenes (`1944–1953` & `1961–1968`):**
   - **Part 1 — New York, London & Cambridge (`1950–1953`):** Contrasts Phoebus Levene's monotonous tetranucleotide hypothesis against Avery–MacLeod–McCarty (1944) and **Erwin Chargaff**'s (1950) paper chromatography discovery that base composition varies between species while `%A ≈ %T` and `%G ≈ %C` everywhere. Traces **Rosalind Franklin** and **Raymond Gosling** at King's College London controlling relative humidity (`75%` A-form vs `92%` hydrated B-form) to capture the 62-hour X-ray exposure **Photo 51** (1–6 May 1952), proving the helical X-cross, `3.4 nm` turn pitch, `0.34 nm` base spacing (`10` bp/turn), missing 4th layer line (major/minor grooves), `C2` antiparallel space-group symmetry, and external phosphate backbone (`2.0 nm` diameter). Accurately documents how **Maurice Wilkins** showed *Photo 51* to **James Watson** without Franklin's permission in January 1953, how Max Perutz shared the MRC report with **Francis Crick**, and how Jerry Donohue's keto tautomer correction enabled Watson and Crick's complementary `A=T` and `C≡G` pairing published alongside Franklin & Gosling's and Wilkins, Stokes & Wilson's *Nature* papers on 25 April 1953.
   - **Part 2 — Raipur, Lahore, Bethesda & Madison (`1961–1968`):** Traces Crick & Brenner's (1961) phage T4 `+1/+2/+3` frameshift experiment and **Marshall Nirenberg** & Heinrich Matthaei's (May 1961) cell-free `poly-U` (`UUU = Phe`) breakthrough, then follows **Har Gobind Khorana** from his childhood in Raipur, Punjab (learning under a village tree, encouraged by his *patwari* clerk father) through D.A.V. High School in Multan, Punjab University in Lahore (with Mahan Singh), and Cambridge (with Alexander Todd) to Vancouver and the University of Wisconsin–Madison. Explains how Khorana combined organic synthesis of defined short DNA repeats with DNA and RNA polymerases to create repeating copolymer mRNAs (`(UC)ₙ → UCU|CUC → Ser–Leu`, `(UG)ₙ → Cys–Val`, `(AG)ₙ → Arg–Glu`, `(AC)ₙ → Thr–His`, and `(UAG)ₙ` nonsense stop codons), completing the 64-codon table and sharing the 1968 Nobel Prize with Nirenberg and Robert Holley.
2. **Exact `terms:` ownership & zero collisions:**
   - `franklin-khorana-codebreakers.md` owns `terms: Rosalind Franklin, Photo 51, Erwin Chargaff, Francis Crick, Har Gobind Khorana, Marshall Nirenberg`.
   - Zero duplication with `p-ramachandran.md` (`G. N. Ramachandran`), `siddiqi-para-channels.md` (`Obaid Siddiqi`), or `p-agre.md` (`Peter Agre`), all three of which are also linked cleanly in Chapter 11 prose (`report.json` checks verified).
   - Front-matter 3D workbench link `[Open The Master Code 3D Explorer](#explore-code)` in Section 11.2 (`src/ch11.md:183`) resolves cleanly.
   - Single-tap story drawer open and close verified across desktop (`story-1440-light-card.png`) and mobile (`story-390-dark-card.png`).

---

## 6. Direct Visual Inspection of All 9 SVG Plates, 3 Interactive Widgets, Story Modal & Print PDF (`pp. 404–443`)

Directly inspected all rendered PNG receipts in `/tmp/lt_bio_ch11/final/qa_ch11/` using `read_file`:

### 6.1 All 9 Static SVG Plates (`plate-1` through `plate-9` across `1440-light` and `390-dark` / `390-sepia`)
- **Plate 1 (`c11_avery_dna_genes`, `plate-1-1440-light.png`):** Top panel shows the 4-column Avery, MacLeod & McCarty (1944) enzymatic elimination ledger (`A. No Enzyme → Transformation ON`, `B. + Protease → Not protein (ON)`, `C. + RNase → Not RNA (ON)`, `D. + DNase → Only Rough (R) cells → DNA IS THE GENE`). Middle panel maps the 5-step scale hierarchy (`1. Cell ~20 µm → 2. Nucleus ~6 µm → 3. Chromosome → 4. One Gene → 5. DNA Helix 2.0 nm`). Bottom panel shows the 4-step kitchen banana DNA extraction biochemistry (`Mashing`, `Detergent`, `Salt (Na⁺)`, `Cold Alcohol`). Zero text overlaps or clipped arrows.
- **Plate 2 (`c11_photo51_double_helix`, `plate-2-1440-light.png`):** Three-column layout: Left (`1. Photo 51 (May 1952)` X-ray diffraction diagram with layer lines, meridional arcs, and 6 quantitative deductions: `3.4 nm` pitch, `0.34 nm` step, `10` bp/turn, missing 4th layer line, `2.0 nm` width), Centre (`2. Chargaff's Ratios (1950)` across Human, Maize, *E. coli*, and GC-rich *Sarcina lutea* plus Chargaff's arithmetic box), and Right (`3. Complementary Rungs` `A=T` 2 H-bonds, `G≡C` 3 H-bonds, `2.0 nm` span, and why purine+purine bulges and pyrimidine+pyrimidine pinches).
- **Plate 3 (`c11_triplet_code_khorana`, `plate-3-1440-light.png`):** Top-left shows combinatorial capacity (`4¹ = 4 FAILS`, `4² = 16 FAILS`, `4³ = 64 codons DEGENERATE CODE`). Top-right shows Crick & Brenner (1961) phage T4 frameshifts (`Wild-type (0)`, `+1 insertion scrambled`, `+2 insertions scrambled`, `+3 insertions RESTORED`). Bottom 2×2 grid shows Nirenberg's `poly-U` (`UUU → Phe`), Khorana's `(UC)ₙ` (`UCU·CUC → Ser–Leu`), Khorana's `(UG)ₙ & (AG)ₙ` (`Cys–Val` and `Arg–Glu`), and Stop triplets `(UAG)ₙ`.
- **Plate 4 (`c11_transcription_translation`, `plate-4-1440-light.png`):** Top left chamber (`NUCLEUS`: `Step 1: Gene Remains in Nucleus` + `Step 2: mRNA Copy Made in Nucleus`) connects through `Step 3: Nuclear Pore Exit →` to the right chamber (`CYTOPLASM`: `Step 4: mRNA Passes Through Ribosome` → `Step 5: Ribosome Assembles Amino Acids` → `Step 6: Sequence Sets Sequence`), above the 6-card `Cambridge IGCSE 0610 (17.1 Supplement) Six-Step Protein Synthesis Summary`.
- **Plate 5 (`c11_sequence_to_3d_machines`, `plate-5-1440-light.png`):** Top causal spine (`1. DNA Base Order → 2. mRNA Codons → 3. Amino-Acid Chain → 4. 3D Folded Machine Ramachandran (φ, ψ)`) above the 4-family grid uniting Chapters 4, 8, 9 & 10 (`A. ENZYMES`, `B. MEMBRANE CARRIERS & CHANNELS`, `C. RECEPTORS FOR NEUROTRANSMITTERS`, `D. ANTIBODIES & OXYGEN CARRIERS`).
- **Plate 6 (`c11_dna_vs_mrna_ledger`, `plate-6-1440-light.png`):** Top summary cards for `DNA (Deoxyribonucleic Acid)` vs `mRNA (Messenger Ribonucleic Acid)` above the 6-row structural and functional comparison table (`1. Strands`, `2. Four Bases`, `3. Sugar Unit`, `4. Cell Location`, `5. Molecular Size`, `6. Persistence`).
- **Plate 7 (`c11_beta_globin_mutation`, `plate-7-1440-light.png`):** Side-by-side 7-codon alignment (`Codons 1–7`) of `1. Normal Adult Beta-Globin (HbA)` (`Codon 6: DNA GAG, mRNA GAG → Glu⁶` hydrophilic surface residue → flexible biconcave red blood cell) vs `2. Sickle-Cell Beta-Globin (HbS)` (`Codon 6: DNA GTG, mRNA GUG → Val⁶` hydrophobic patch → rigid fibres at low `O₂` → crescent sickle cell).
- **Plate 8 (`c11_mutation_outcomes_comparison`, `plate-8-1440-light.png`):** Three-column comparison of `A. SILENT (SYNONYMOUS)` (`Codon 3: CTG → CTT`, `mRNA CUG → CUU = Leu³`, `100% Normal Soluble HbA`), `B. MISSENSE SUBSTITUTION` (`Codon 6: GAG → GTG`, `mRNA GAG → GUG`, `Glu⁶ → Val⁶`, `Sticky Deoxygenated HbS`), and `C. NONSENSE (STOP)` (`Codon 39: CAG → TAG`, `mRNA CAG → UAG (STOP)`, `Truncated Non-Functional Chain`).
- **Plate 9 (`c11_leucine_silent_case`, `plate-9-1440-light.png`):** Three-tier diagnostic ledger for Case 11 comparing `1. Reference Adult Beta-Globin (HbA)`, `2. Child X — Single-Base Substitution at Codon 3 (CTG → CTT)` (`SILENT / SYNONYMOUS → 100% normal HbA`), and `3. Child Y — Single-Base Substitution at Codon 6 (GAG → GTG)` (`MISSENSE Glu⁶ → Val⁶ → sticky HbS fibres`).

### 6.2 All 3 Interactive Widgets (`fig-11-2`, `fig-11-3`, `fig-11-4`)
- **`fig-11-2` (`w_dna_base_pairing`, `native-2-1440-light.png`, `live-2-1440-light-default.png`, `live-2-390-dark-changed.png`):** Left card displays the 12-rung antiparallel `5' / 3'` double-helix ladder alongside the `Photo 51 X-cross` inset (`Pitch: 3.4 nm`, `Step: 0.34 nm`, `10 bp / turn`, `Rung 6: C–G`, `Width: 2.00 nm` or `2.45 nm` in the purine–purine bulge test). Right card displays `Chargaff Ratios & B-DNA Telemetry` and `Captured trials`. In `live-2-390-dark-changed.png`, the `✓ STAMPED` badge is earned after capturing contrasting trials (`#1: 30% A=30% T, 20% G=20% C · 31 H · 2.00 nm` and `#2: 15% A=15% T, 35% G=35% C · 36 H · 2.00 nm`), with zero overflow at 390 px.
- **`fig-11-3` (`w_codon_cipher_khorana`, `native-3-1440-light.png`, `live-3-1440-light-default.png`, `live-3-390-dark-changed.png`):** Left card shows the combinatorial banner (`4¹ = 4 (<20) · 4² = 16 (<20) · 4³ = 64 triplets (≥20 AA)`), the 6-codon `5' → 3' mRNA Reading Frame` tape, the 6-bead `Cell-Free Ribosome Polypeptide Output`, and the `Experimental Verdict` box. Right card shows `Triplet Cipher & Frame Telemetry` and `Captured trials`. In `live-3-390-dark-changed.png`, the `✓ STAMPED` badge is earned after capturing Nirenberg `UUU` (`Phe-Phe-Phe-Phe-Phe`) and Khorana `(UC)ₙ` (`Ser-Leu-Ser-Leu-Ser`), and tour step 5 displays Crick–Brenner `+3` reading-frame restoration (`CAU · GGG · CAU · CAU → His-Gly-His-His-His-His`).
- **`fig-11-4` (`w_transcription_translation_ribosome`, `native-4-1440-light.png`, `live-4-1440-light-default.png`, `live-4-390-dark-changed.png`):** Left card shows `1. NUCLEUS: Gene stays inside; mRNA copy made` (`Coding DNA`, `Template`, and `mRNA copy` with `U replaces T`), `↓ Step 3: mRNA exits nucleus via nuclear pore to cytoplasm ↓`, and `2. CYTOPLASM RIBOSOME` stepping across Codons `C1`–`C7` with active `tRNA anticodon`, growing peptide chain, and 3D functional outcome. Right card shows the 8-row `0610 Protein Synthesis & Mutation Ledger` and `Captured trials`. In `live-4-390-dark-changed.png`, the `✓ STAMPED` badge is earned after capturing Child X Silent (`#1: C3 CUU → Val-His-Leu-Thr-Pro-Glu-Glu (WT=YES)`) vs Child Y Missense (`#2: C6 GUG → Val-His-Leu-Thr-Pro-Val-Glu (WT=NO)`).

### 6.3 Companion Story Modal (`story-1440-light-card.png`, `story-390-dark-card.png`)
- Opens cleanly in both 1440 px desktop light mode and 390 px mobile dark mode with the `1944–1968` date badge, title *“A humid X-ray camera in London and a synthetic gene bench from Raipur to Madison”*, full cast subheader (`Rosalind Franklin, Raymond Gosling, Erwin Chargaff, James Watson, Francis Crick, Maurice Wilkins, Marshall Nirenberg, Har Gobind Khorana`), scene marker, and well-proportioned body typography with `Share`, `Listen`, and `Close` buttons and zero horizontal overflow.

### 6.4 Exported Print PDF Pages (`pdf-404.png` through `pdf-443.png`, out of `535` total pages)
- Visually inspected all 9 Chapter 11 figure pages in `/tmp/lt_bio_ch11/final/qa_ch11/` (`pdf-404.png` = Fig 11.1; `pdf-414.png` = Fig 11.2 + story card; `pdf-423.png` = Fig 11.3; `pdf-425.png` = Fig 11.4; `pdf-427.png` = Fig 11.5; `pdf-429.png` = Fig 11.6; `pdf-437.png` = Fig 11.7; `pdf-439.png` = Fig 11.8; `pdf-443.png` = Fig 11.9). Even when all 3 interactive widgets were opened prior to printing, print CSS cleanly restored all 9 static vector SVG plates onto crisp white paper with dark ink, zero clipped figures, and `story_body_printed: false`.

---

## 7. Safe Home Activities & Ethical/Clinical Guardrails

1. **Home Activity — `:::home Spooling white threads of DNA from a mashed banana` (`source/src/ch11.md:105–112`):**
   - **Honest non-trialled disclosure (`PASS`):** Opens with the explicit disclosure: *“Disclosure: This is an optional kitchen-chemistry demonstration based on standard school and outreach nucleic-acid precipitation protocols (not a laboratory trial performed during the authoring of this chapter).”*
   - **Chemical, fire, and adult-supervision safety (`PASS`):** Explicitly requires working with an adult and using **chilled rubbing alcohol (70–91% isopropyl alcohol or surgical spirit) strictly as an external reagent in a glass**—with explicit instructions to **never taste or swallow rubbing alcohol, keep it away from stove flames, and wash your hands afterwards**. Uses only half a ripe banana, tap water, liquid dishwashing detergent, table salt (`NaCl`), a tea strainer/coffee filter, chilled rubbing alcohol, and a wooden toothpick.
   - **Scale honesty (`PASS`):** Explicitly reminds the reader that a single DNA double helix is only `2.0 nm` wide (invisible to the naked eye or a school light microscope), so the spooled white thread is millions of DNA strands clumped side by side like fibres twisted into cotton yarn.
2. **Clinical & Historical Framing (`Case file 11` & Historical Evidence Boxes):**
   - `:::case Two children, two single-base changes, one unchanged protein` (`source/src/ch11.md:497–498`) opens with the explicit clinical disclaimer: *“This is a fictional molecular-diagnostics reasoning case uniting Section 11.2 (complementary base pairing), Section 11.3 (transcription of mRNA and translation at the ribosome), and Section 11.4 (the degenerate 64-codon genetic code and beta-globin folding), not medical advice about any individual patient.”*
   - Historical animal and biochemical experiments (Griffith 1928; Avery, MacLeod & McCarty 1944; Hershey & Chase 1952; Franklin & Gosling 1952; Ingram 1956–1957; Crick & Brenner 1961; Nirenberg 1961; Khorana 1964–1968) are framed strictly as historical scientific evidence.

---

## 8. Gate B Findings & Disposition

- **`BLOCKER`: 0**
- **`FIX`: 0**
- **`CONSIDER`: 0**

**Final Verdict:** **Gate B PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`).**
