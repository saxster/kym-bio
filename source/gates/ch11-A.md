# Chapter 11 — Gate A: independent facts, models, syllabus, provenance and preservation review

Reviewed 30 October 2026. Independent reviewer did not author the chapter, story, figures, models, tests or provenance. Report-only review; this report (`/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch11-A.md`) is the only file written. Scope is scientific, historical, mathematical, syllabus, cross-book continuity, provenance and preservation acceptance, not final browser/print acceptance or publication approval. Read `source/GATES.md`, `source/gates/ch10-A.md`, all Chapter 11 deliverables, `source/live/enhancements.js`, `source/provenance/sources.yml`, preserved stories `source/src/stories/p-ramachandran.md`, `source/src/stories/siddiqi-para-channels.md`, `source/src/stories/p-agre.md`, and `source/src/stories/banting-mahalanabis-lifelines.md`, front-matter 3D explorer `source/app/x_code.js`, and `source/src/ch10.md`.

## Disposition Summary

**PASS** — **0 BLOCKER / 0 FIX / 0 CONSIDER**.

---

## Section 1: Artifact Hash & Build Verification

Independently computed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I` and verified against `/tmp/lt_bio_ch11/final/artifact-hashes.json`:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch11.md` | 36860 | `fdcb7496c3d4842a473b76b72a57db3da938adf9779c7b075399bf28176fdc59` |
| `source/src/ch11.md` | 81565 | `3e3f616a899999bac1cf93f64173e0d30a79833097dd6ead92081b01790e153c` |
| `source/src/stories/franklin-khorana-codebreakers.md` | 12921 | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| `source/figs_ch11.py` | 35437 | `a219773ff5b44448e16909bc80ad64c610082d00526a5ea8b6f6f204b2bee211` |
| `source/provenance/ch11.yml` | 27649 | `306cfa3bb7feb96bf2edf81264410ff33bef38b2669d30ab60194cfb42a95626` |
| `source/provenance/sources.yml` | 1232 | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/genetic_code_model.js` | 33827 | `7e3f97f1be1dce4762edfe14549e2a3a00d17077e56efa49e0135a04c94292ed` |
| `source/live/w_dna_base_pairing.js` | 12014 | `933841cbddaec082e23646d7ed442281eaef3cadc05e79c7c422e282ae8be532` |
| `source/live/w_codon_cipher_khorana.js` | 10651 | `e19daa7296c25e9f81e64d9be4fae70cbc342114501843baa8d9779c19ca84a1` |
| `source/live/w_transcription_translation_ribosome.js` | 10842 | `14fa3de06c432281ab1331612e47350b8b0c0eced21fb7bab2f273cf97947007` |
| `source/live/enhancements.js` | 81763 | `9bf761b461d71b97f1172c48feeae12b2670c68b70f13cff173e16685c57495a` |
| `source/tests/ch11_domain.mjs` | 11535 | `1ea669cc9bbd54df45e4f7bb623cf3936a81b759a0733eafbc539b5e2190ee17` |
| `source/tests/qa_ch11.py` | 31249 | `20020df875c8ff46a91dd142d6ef9c722619c32c4a8a8737b477287649d5fedc` |
| `source/tests/verify_ch11.sh` | 1537 | `5931cc71adeb838f0877fb512e7428d56f9d6b7e287340f1edae33780c718fc8` |
| `source/tests/README-ch11.md` | 2468 | `47886a91c121a4a63796f6bbbb53c4f1bd4b48dff0be4bab314d87fdfd43feb9` |
| `source/tests/ch11-preserved.json` | 138511 | `723c78384181fa66c6ff7cf237c15bd9c68c58c7a76fafece7e6deafde2b88d2` |
| `source/build/site/index.html` | 2546045 | `4cb76291a56b256f2e26826f3311dc4728ddf150f2aa9bfa05ae9540603ee42b` |
| `source/build/site/sw.js` | 3342 | `ce943807a285518613584fc38cfafd1c425cd4f248851f755891a5064475aec3` |
| `source/build/site/live/w_dna_base_pairing-BAUJF3R4.js` | 6459 | `e098ee5769a1469ca8fb18d817b7633c992587a8e7f9b6a973b7336023a32f78` |
| `source/build/site/live/w_codon_cipher_khorana-IVHI32Z5.js` | 5502 | `326a2b3fddbbeba51da8238c44184b4d8e996672df4b0d0f967918988147409e` |
| `source/build/site/live/w_transcription_translation_ribosome-UDYHDGJW.js` | 5977 | `1eddcbc8a8f5cf6b98027197bbc87fa2181262700f943f05b21d4304c93ec338` |
| `/tmp/lt_bio_ch11/final/qa_ch11/print.pdf` | 26158781 | `f302f096033b083454a23c18985199127c8a61bf867729a20d2a9cee59b109ae` |

### Build, Domain, Acceptance & Regression Summary

- **Built Service Worker Cache Version:** `lw-b3d3ad9c287c` (`source/build/site/sw.js` and `/tmp/lt_bio_ch11/final/qa_ch11/report.json`).
- **Lazy Widget Chunk Budgets (`< 150,000` bytes each):** `w_dna_base_pairing-BAUJF3R4.js` (`6,459` bytes), `w_codon_cipher_khorana-IVHI32Z5.js` (`5,502` bytes), `w_transcription_translation_ribosome-UDYHDGJW.js` (`5,977` bytes); `index.html` size `2,546,045` bytes (`< 4,000,000` bytes).
- **Chapter 11 Headless Domain Verification (`node source/tests/ch11_domain.mjs`):** **`2,713` assertions passed** (`0` failures).
- **Chapter 11 Full-Book Browser & Print Acceptance (`source/tests/qa_ch11.py`):** **`1,894` QA assertions passed** (`0` console/page errors, `535`-page PDF with all 9 plates on single pages `404, 414, 423, 425, 427, 429, 437, 439, 443`).
- **Prior-Chapter Regression Suite Pass Counts (`/tmp/lt_bio_ch11/final`):**
  - **Chapter 10 (`qa_ch10.py`):** `1,857` QA assertions + `1,938` domain cases passed.
  - **Chapter 9 (`qa_ch09.py`):** `1,819` QA assertions + `620` domain cases passed.
  - **Chapter 8 (`qa_ch08.py`):** `1,890` QA assertions + `1,731` domain cases passed.
  - **Chapter 7 (`qa_ch07.py`):** `1,710` QA assertions + `2,046` domain cases passed.
  - **Chapter 6 (`qa_ch06.py`):** `1,441` QA assertions + `1,145` domain cases passed.
  - **Chapter 5 (`qa_ch05.py`):** `985` QA assertions + `18,133` domain cases passed.
  - **Full-Book Offline & Lazy-Chunk Smoke Test (`livetest.py --offline`):** `0` chunks loaded before interaction, all `35` live figures + `3` explorers open cleanly online and offline with `0` console errors.

---

## Section 2: Cambridge IGCSE Biology 0610 (2026–2028 v3 & 2029) & Lower Secondary 0893 Syllabus Audit

Every Core and Supplement learning outcome assigned to Chapter 11 was audited across `source/src/ch11.md`, `source/figs_ch11.py`, `source/live/genetic_code_model.js`, the three interactive widgets, and `source/provenance/ch11.yml`:

### Cambridge Lower Secondary Science 0893 (`9Bs.01`, `9Bs.02`): PASS
- **`9Bs.01`:** Explicitly describes how **chromosomes are found in the nucleus of a cell and are made of DNA** (`src/ch11.md` §11.1 `:::note Chromosome, DNA, and gene`, `:::five`, `:::careful`, `:::school`, and `#fig-11-1` `c11_avery_dna_genes` middle panel tracing the five-step scale hierarchy `Cell (~20 µm) → Nucleus (~6 µm) → Chromosome → One Gene → DNA Helix (2.0 nm)`).
- **`9Bs.02`:** Explicitly describes how **genes are located on chromosomes and help to determine the characteristics of an organism**, with the required scientific qualification that while some traits (such as ABO blood group or beta-globin amino-acid sequence) are set directly by genes, most whole-organism characteristics (such as leaf greenness requiring light and `Mg²⁺` or human height requiring nutrition) emerge from **genes acting alongside other genes and the environment** (`src/ch11.md` §11.1).

### Cambridge IGCSE Biology 0610 Topic 4.1 — Biological molecules (DNA structure): PASS
- **4.1 Core & Supplement (DNA molecular structure):** Deferred from Chapter 4 to Chapter 11 by the book architecture and covered in full in `src/ch11.md` §11.2, `#fig-11-2` (`c11_photo51_double_helix`), `w_dna_base_pairing.js`, and `#explore-code`:
  - **(a) Two strands coiled together to form a double helix:** Explicitly taught as two antiparallel sugar–phosphate strands (`5' → 3'` and `3' → 5'`) coiled around a central axis (`2.0 nm` diameter, `3.4 nm` pitch per 10-bp turn).
  - **(b) Each strand contains chemicals called bases:** Explicitly identifies the four DNA bases (**adenine `A`**, **thymine `T`**, **cytosine `C`**, **guanine `G`**) projecting inward from the deoxyribose–phosphate backbone, while noting in `:::school` that Core exam papers do not require recalling the full base names from memory provided `A`, `T`, `C`, and `G` are used accurately.
  - **(c) Cross-links (bonds) between the strands are formed by pairs of bases:** Explicitly describes hydrogen bonds (`2` in `A=T`, `3` in `C≡G`) linking paired bases across the interior of the double helix.
  - **(d) The bases always pair up in the same way — `A` with `T`, and `C` with `G`:** Enforced across prose, `:::note`, `:::five`, `:::careful`, `:::check`, `#fig-11-2`, and `w_dna_base_pairing.js`.

### Cambridge IGCSE Biology 0610 Topic 17.1 — Chromosomes, genes and proteins (plus molecular preview of 17.4): PASS
- **17.1.1 (Core):** States that **chromosomes are made of DNA, which contains genetic information in the form of genes** (`src/ch11.md` §11.1 `:::note`, `:::school`, `#fig-11-1`).
- **17.1.2 (Core):** Defines a **gene** verbatim as **a length of DNA that codes for a protein** (`src/ch11.md` §11.1 `:::note`, `:::five`, `:::school`, `#fig-11-1`).
- **17.1.3 (Core):** Explains that the **sequence of bases in a gene is the genetic code for putting together amino acids in the correct order to make a specific protein**, noting in `:::school` (§11.3) which biochemical details (nucleotide monomer components and triplet decoding mechanics) are Supplement/enrichment.
- **17.1.4 (Supplement):** Explains that **DNA controls cell function by controlling the production of proteins, including enzymes, membrane carriers and receptors for neurotransmitters** (alongside antibodies and haemoglobin from Chapters 8 and 10), dedicated in full in `src/ch11.md` §11.3 and `#fig-11-5` (`c11_sequence_to_3d_machines`) and interactive selector `Protein machine family` (`1..4`) in `w_transcription_translation_ribosome.js`.
- **17.1.5 (Supplement):** Explains how a protein is made using all six required points verbatim in `src/ch11.md` §11.3, `:::school`, `#fig-11-4` (`c11_transcription_translation`), `#fig-11-6` (`c11_dna_vs_mrna_ledger`), and `w_transcription_translation_ribosome.js`:
  1. **The gene coding for the protein remains in the nucleus;**
  2. **Messenger RNA (`mRNA`) is a copy of a gene;**
  3. **mRNA molecules are made in the nucleus and move to the cytoplasm;**
  4. **The mRNA passes through ribosomes;**
  5. **The ribosome assembles amino acids into protein molecules;**
  6. **The specific sequence of amino acids is determined by the sequence of bases in the mRNA.**
- **Molecular Sequence-to-Shape & Gene Mutation (`17.1` & `17.4` molecular preview):** Section 11.4 and Case 11 (`#fig-11-7`, `#fig-11-8`, `#fig-11-9`) trace how different amino-acid sequences give different 3D protein shapes (Ramachandran folding) and contrast **silent (synonymous)** (`HBB` Codon 3 `CTG → CTT`, mRNA `CUG → CUU`, both `Leu³`), **missense** (`HBB` Codon 6 `GAG → GTG`, mRNA `GAG → GUG`, `Glu⁶ → Val⁶`), and **nonsense** (`HBB` Codon 39 `CAG → TAG`, mRNA `CAG → UAG` Stop) single-base substitutions alongside `+1 / −1` frameshifts.
- **Strict Syllabus Boundary Obedience (Chapters 12–15 Partition):**
  - **Chapter 12 reserved:** DNA replication, mitosis, stem cell specialisation / why only the genes needed by a specific cell are expressed (`17.1 Supplement 6`), haploid (`n = 23`) vs diploid (`2n = 46`) chromosome numbers, and meiosis are **only** previewed in the closing `:::next` bridge at the end of Chapter 11.
  - **Chapter 13 reserved:** Mendelian alleles, dominant/recessive/codominant crosses, and Punnett squares are explicitly deferred (`:::school` §11.4).
  - **Chapter 14 reserved:** Natural selection and sickle-cell heterozygote advantage in malaria zones are explicitly deferred (`:::school` §11.4).
  - **Chapter 15 reserved:** Restriction enzymes, DNA ligase, and plasmid vectors in genetic engineering are not prematurely pulled into Chapter 11.

---

## Section 3: Independent Mathematical, Biophysical & Algorithmic Verification of `genetic_code_model.js`, `ch11_domain.mjs` and Prose/Plates

Every constant, formula, sequence, and state transition in `source/live/genetic_code_model.js`, `source/tests/ch11_domain.mjs` (`2,713` assertions), `source/src/ch11.md`, `source/figs_ch11.py`, and `source/live/enhancements.js` was independently verified using Node and Python:

### 1. The 64-Codon Genetic Dictionary & Combinatorial Capacity (`CODON_TABLE`, `combinatorialCodonCapacity`)
- **Combinatorial capacity (`4^k`):**
  - Singlet ($k = 1$): $4^1 = \mathbf{4} < 20$ (16 amino acids short).
  - Doublet ($k = 2$): $4^2 = \mathbf{16} < 20$ (4 amino acids short).
  - Triplet ($k = 3$): $4^3 = \mathbf{64} \ge 20$ (**61 sense codons** specifying the 20 standard amino acids + **3 stop codons** `UAA`, `UAG`, `UGA`).
- **Complete 64-codon verification (`CODON_TABLE`):** All 64 entries are frozen, unambiguous (`1 codon → 1 meaning`), and carry exact degeneracy counts (`synonymCount`):
  - **6-fold degenerate:** `Leu` (`UUA, UUG, CUU, CUC, CUA, CUG`), `Ser` (`UCU, UCC, UCA, UCG, AGU, AGC`), `Arg` (`CGU, CGC, CGA, CGG, AGA, AGG`).
  - **4-fold degenerate:** `Val` (`GUU, GUC, GUA, GUG`), `Pro` (`CCU, CCC, CCA, CCG`), `Thr` (`ACU, ACC, ACA, ACG`), `Ala` (`GCU, GCC, GCA, GCG`), `Gly` (`GGU, GGC, GGA, GGG`).
  - **3-fold degenerate:** `Ile` (`AUU, AUC, AUA`).
  - **2-fold degenerate:** `Phe` (`UUU, UUC`), `Tyr` (`UAU, UAC`), `His` (`CAU, CAC`), `Gln` (`CAA, CAG`), `Asn` (`AAU, AAC`), `Lys` (`AAA, AAG`), `Asp` (`GAU, GAC`), `Glu` (`GAA, GAG`), `Cys` (`UGU, UGC`).
  - **1-fold (unique):** `Met` (`AUG`, start), `Trp` (`UGG`).
  - **Total sense codons:** $3\times 6 + 5\times 4 + 1\times 3 + 9\times 2 + 2\times 1 = 18 + 20 + 3 + 18 + 2 = \mathbf{61}$ sense codons $+ \mathbf{3}$ stop codons (`UAA`, `UAG`, `UGA`) $= \mathbf{64}$ codons.

### 2. Chargaff Equivalence, Photo 51 Geometry & Complementary Rung Width (`simulateDnaDoubleHelix`, `#fig-11-2`, `w_dna_base_pairing.js`)
- **Photo 51 B-DNA crystallographic invariants:**
  - Helical pitch $P = \mathbf{3.4\text{ nm}}$ ($34\text{ \AA}$) per complete $360^\circ$ turn.
  - Vertical step per stacked base pair $h = \mathbf{0.34\text{ nm}}$ ($3.4\text{ \AA}$), giving $P / h = 3.4 / 0.34 = \mathbf{10\text{ base pairs per turn}}$ and $\Delta\theta = 360^\circ / 10 = \mathbf{36^\circ\text{ twist per base pair}}$ (at Rung 10: vertical rise $= 10 \times 0.34 = \mathbf{3.40\text{ nm}}$, twist $= \mathbf{360^\circ}$).
  - Missing **4th layer line** on the X-diffraction cross reflects the coaxial offset of the two antiparallel sugar–phosphate chains (major and minor grooves).
- **Chargaff base-equivalence arithmetic (`solveChargaffFromSingleBasePct`, `computeChargaffLedger`):**
  - Across all 164 single-base input sweeps ($5\% \le p \le 45\%$ for `A, T, G, C`), `%A === %T`, `%G === %C`, and `%A + %T + %G + %C === 100.0%`.
  - Section 11.2 `:::predict` check: `%C = 22%` $\implies$ `%G = 22%` ($44\%$ `C+G`), leaving $56\% \div 2 = \mathbf{28\%\text{ A}}$ and $\mathbf{28\%\text{ T}}$.
  - Section 11.2 `:::check` H-bond count on 9-bp sequence `A–T–G–G–T–G–C–A–C` (4 `A/T` pairs + 5 `G/C` pairs): $4\times 2 + 5\times 3 = 8 + 15 = \mathbf{23\text{ hydrogen bonds}}$.
  - Widget 1 tour & challenge benchmarks (`12-bp` window):
    - *Human `30% A` (`mode = 1, adeninePct = 30, focusPos = 6`):* `30.0% A = 30.0% T`, `20.0% G = 20.0% C` (`40.0% GC`), `GTGCACCTGACT` ($5\text{ A/T}\times 2 + 7\text{ G/C}\times 3 = \mathbf{31\text{ H-bonds}}$), uniform diameter $\mathbf{2.00\text{ nm}}$.
    - *GC-rich `15% A` (`mode = 1, adeninePct = 15, focusPos = 6`):* `15.0% A = 15.0% T`, `35.0% G = 35.0% C` (`70.0% GC`), `GCGCGCCGGCGC` ($12\text{ G/C}\times 3 = \mathbf{36\text{ H-bonds}}$), uniform diameter $\mathbf{2.00\text{ nm}}$.
    - *Mismatch mode (`mode = 3`):* Purine–purine mismatch (`adeninePct >= 34`) bulges rung width to **$2.45\text{ nm} > 2.00\text{ nm}$** (`0` H-bonds); pyrimidine–pyrimidine mismatch (`adeninePct <= 22`) pinches rung width to **$1.55\text{ nm} < 2.00\text{ nm}$** (`0` H-bonds); purine–pyrimidine wobble (`23..33%`) gives **$2.08\text{ nm}$** (`1` H-bond).

### 3. Nirenberg Homopolymers, Khorana Repeating Copolymers & Crick–Brenner Frameshifts (`simulateKhoranaCodonCipher`, `#fig-11-3`, `w_codon_cipher_khorana.js`)
- **Nirenberg & Matthaei (1961) homopolymers (`mode = 0`):**
  - Template #1 `poly-U` (`UUUUUUUUUUUUUUUUUU`) $\to$ 6 triplets `UUU` $\to$ **`Phe–Phe–Phe–Phe–Phe–Phe`** (`6` residues).
  - Template #2 `poly-C` $\to$ **`Pro–Pro–Pro–Pro–Pro–Pro`**; Template #3 `poly-A` $\to$ **`Lys–Lys–Lys–Lys–Lys–Lys`**; Template #4 `poly-G` $\to$ **`Gly–Gly–Gly–Gly–Gly–Gly`**.
- **Har Gobind Khorana (1964–1968) repeating dinucleotide copolymers (`mode = 1`):**
  - Template #1 `(UC)n` (`UCUCUCUCUCUCUCUCUC`) $\to$ `UCU · CUC · UCU · CUC · UCU · CUC` $\to$ **`Ser–Leu–Ser–Leu–Ser–Leu`**.
  - Template #2 `(UG)n` (`UGUGUGUGUGUGUGUGUG`) $\to$ `UGU · GUG · UGU · GUG · UGU · GUG` $\to$ **`Cys–Val–Cys–Val–Cys–Val`**.
  - Template #3 `(AG)n` (`AGAGAGAGAGAGAGAGAG`) $\to$ `AGA · GAG · AGA · GAG · AGA · GAG` $\to$ **`Arg–Glu–Arg–Glu–Arg–Glu`**.
  - Template #4 `(AC)n` (`ACACACACACACACACAC`) $\to$ `ACA · CAC · ACA · CAC · ACA · CAC` $\to$ **`Thr–His–Thr–His–Thr–His`**.
- **Trinucleotides & Nonsense Stop Codons (`mode = 2`):**
  - Template #1 `(UUC)n` in shifts `0, +1, +2` yields `Phe–Phe–Phe–Phe–Phe–Phe` (`UUC`), `Ser–Ser–Ser–Ser–Ser–Ser` (`UCU`), and `Leu–Leu–Leu–Leu–Leu–Leu` (`CUU`).
  - Template #2 (`AUG GUG CAC CUG UAG GAG`, amber `UAG` stop at Codon 5): terminates at `stoppedAtCodon = 5`, releasing **`Met–Val–His–Leu`** (`4` residues).
  - Template #3 (`UAA` ochre stop at Codon 4): terminates at Codon 4, releasing **`Met–Val–His`** (`3` residues).
  - Template #4 (`UGA` opal stop at Codon 3): terminates at Codon 3, releasing **`Met–Val`** (`2` residues).
- **Crick & Brenner (1961) `+1 / +2 / +3` frameshift proof (`mode = 3`):**
  - Across all 64 states, `frameRestored === (shift === 0 || shift === 3)`: `+1` and `+2` insertions scramble every triplet downstream of the insertion, whereas `+3` insertions (`+1` full codon) restore the original downstream reading frame (`CAU → His`).

### 4. Six-Step Transcription–Translation & Human Beta-Globin (`HBB`) Mutations (`simulateTranscriptionTranslation`, `#fig-11-4`, `#fig-11-7`–`#fig-11-9`, `w_transcription_translation_ribosome.js`)
- **Reference Adult Beta-Globin (`HbA`, `mode = 0`, Codons 1–7):**
  - Coding DNA (`5' → 3'`): `GTG CAC CTG ACT CCT GAG GAG`
  - Template DNA (`3' → 5'`): `CAC GTG GAC TGA GGA CTC CTC`
  - Transcribed mRNA (`5' → 3'`): `GUG CAC CUG ACU CCU GAG GAG` (contains `U` and zero `T`)
  - Polypeptide (`Residues 1–7`): **`Val–His–Leu–Thr–Pro–Glu–Glu`** (`matchesWildTypeProtein: true`, hydrophilic negatively charged `Glu⁶` on exterior).
- **Child X — Silent (Synonymous) Substitution at Codon 3 (`mode = 1`, `CTG → CTT`):**
  - Coding DNA: `GTG CAC CTT ACT CCT GAG GAG` (Template Codon 3: `GAC → GAA`)
  - Transcribed mRNA: `GUG CAC CUU ACU CCU GAG GAG` (`CUG → CUU` at Codon 3; tRNA anticodon `3'-GAA-5'`)
  - Polypeptide: **`Val–His–Leu–Thr–Pro–Glu–Glu`** (`matchesWildTypeProtein: true` — both `CUG` and `CUU` encode `Leu³`, leaving the 146-aa chain and 3D `HbA` structure $100\%$ unchanged).
- **Child Y — Missense Substitution at Codon 6 (`mode = 2`, Ingram 1956–1957 `GAG → GTG`):**
  - Coding DNA: `GTG CAC CTG ACT CCT GTG GAG` (Template Codon 6: `CTC → CAC`)
  - Transcribed mRNA: `GUG CAC CUG ACU CCU GUG GAG` (`GAG → GUG` at Codon 6; tRNA anticodon `3'-CAC-5'`)
  - Polypeptide: **`Val–His–Leu–Thr–Pro–Val–Glu`** (`matchesWildTypeProtein: false` — negatively charged hydrophilic `Glu⁶`, charge $-1$, hydropathy $-3.5$, replaced by neutral hydrophobic `Val⁶`, charge $0$, hydropathy $+4.2$, creating the sticky surface patch on deoxygenated `HbS`).
- **Nonsense Stop Substitution (`mode = 3` in widget at Codon 6 `GAG → TAG`; Codon 39 `CAG → TAG` in §11.4 prose and `#fig-11-8`):**
  - In Widget 3 (`Codon 6 GAG → TAG`, mRNA `UAG` Stop): halts ribosome at Codon 6 (`terminatedEarly: true`), releasing a truncated `5`-residue fragment (`Val–His–Leu–Thr–Pro`).
  - In §11.4 and `#fig-11-8` (`Codon 39 CAG → TAG`, mRNA `CAG` `Gln³⁹` $\to$ `UAG` Amber Stop): halts ribosome after residue 38 (`Trp³⁷–Thr³⁸–[STOP]`), truncating $>70\%$ of the 146-residue beta-globin chain (classic $\beta^0$-thalassaemia nonsense mutation).

---

## Section 4: Cross-Chapter & Cross-Book Continuity Audit: PASS

1. **Fulfilment of Chapter 10's Closing Bridge (`src/ch10.md` `:::next`):**
   - Directly answers Chapter 10's closing question by uniting the folded protein machines of Volumes I–III (**amylases** and **proteases** from Ch 4 & Ch 7; **haemoglobin** from Ch 8; **Obaid Siddiqi's *para* voltage-gated sodium channels** and **neurotransmitter receptors** from Ch 9; **insulin**, **glucagon**, **Peter Agre's aquaporins**, **sodium–glucose carrier proteins**, and **antibodies** from Ch 10) under the DNA $\to$ mRNA $\to$ ribosome $\to$ Ramachandran 3D folding spine.
2. **Existing Companion Stories & Front-Matter 3D Explorer Linked Without Modification:**
   - `[G. N. Ramachandran]{story="p-ramachandran"}` linked in `src/ch11.md` §11.3 (`p-ramachandran.md` untouched).
   - `[Obaid Siddiqi]{story="siddiqi-para-channels"}` linked in `src/ch11.md` §11.3 (`siddiqi-para-channels.md` untouched).
   - `[Peter Agre]{story="p-agre"}` linked in `src/ch11.md` §11.3 (`p-agre.md` untouched).
   - Front-matter 3D Master Code explorer linked in `src/ch11.md` §11.2 via `[Open The Master Code 3D Explorer](#explore-code)` (`source/app/x_code.js` untouched, and its 7 beta-globin codons `GTG CAC CTG ACT CCT GAG GAG` and Codon 6 `GAG → GTG` mutation match Chapter 11 byte-for-byte).
3. **New Companion Story `source/src/stories/franklin-khorana-codebreakers.md` (`terms:` check):**
   - Declares `terms: Rosalind Franklin, Photo 51, Erwin Chargaff, Francis Crick, Har Gobind Khorana, Marshall Nirenberg`.
   - Independent Python regex scan across `src/ch00.md`–`src/ch10.md` and all 19 pre-existing stories returned **0 prior hits** for all six terms, and `qa_ch11.py` confirmed `0` hijacked story links across `#ch0`–`#ch10`.
4. **Outgoing Bridge to Chapter 12 (`src/ch11.md` `:::next`):**
   - Cleanly bridges to Chapter 12 (*Copying the Blueprint: Mitosis, Stem Cells & Meiosis*) across its three core questions: **(1)** DNA replication and mitosis from 1 zygote to 37 trillion cells, **(2)** stem cells, differentiation, and why only the genes needed by a specific specialised cell are expressed (`0610 17.1 Supplement 6`), and **(3)** diploid (`46`) to haploid (`23`) reduction division in meiosis.

---

## Section 5: Historical & Primary-Source Provenance Audit (`source/provenance/ch11.yml` & `sources.yml`): PASS

Audited all **18 top-level keys** in `source/provenance/ch11.yml` (`11.1`, `11.2`, `11.3`, `11.4`, the 9 `fig:c11_*` entries, `story:franklin-khorana-codebreakers`, the 3 `model:*` entries, and `record:ch11-decisions`, plus the `activity:` disclosure in `11.1`) and `source/provenance/sources.yml`:

1. **Frederick Griffith (1928, *J. Hyg.* 27(2): 113–159, `PMC2167760`), Oswald Avery, Colin MacLeod & Maclyn McCarty (1944, *J. Exp. Med.* 79(2): 137–158, `PMC2135445`), and Alfred Hershey & Martha Chase (1952, *J. Gen. Physiol.* 36(1): 39–56, `PMC2147348`):** Accurately documents Smooth (S) vs Rough (R) pneumococcal transformation, systematic enzymatic elimination (trypsin, chymotrypsin, and RNase leave transforming activity intact whereas DNase abolishes it; `N : P ≈ 1.67`), and bacteriophage T2 `³⁵S` (protein coat) vs `³²P` (DNA core) blender experiments.
2. **Erwin Chargaff (1950, *Experientia* 6(6): 201–209, `doi:10.1007/BF02173653`):** Accurately documents paper chromatography and UV spectrophotometric base determinations across species (human thymus `30.9% A, 29.4% T, 19.9% G, 19.8% C`; maize `26.8% A, 27.2% T, 22.8% G, 23.2% C`; *E. coli* `24.7% A, 23.6% T, 26.0% G, 25.7% C`; *Sarcina lutea* `13.4% A, 13.1% T, 37.1% G, 36.4% C`), refuting Levene's tetranucleotide hypothesis.
3. **Rosalind Franklin & Raymond Gosling (May 1952 / 25 April 1953, *Nature* 171(4356): 740–741, `doi:10.1038/171740a0`) and James Watson & Francis Crick (25 April 1953, *Nature* 171(4356): 737–738):** Accurately documents Franklin's separation of A-DNA (~75% RH) and hydrated B-DNA (~92% RH), the 62-hour exposure of Photo 51 (`3.4 nm` helical pitch, `0.34 nm` meridional base step, `10` bp/turn, missing 4th layer line, outside sugar–phosphate backbones on a `2.0 nm` cylinder, `C2` space-group symmetry), how Photo 51 and the MRC report reached Watson and Crick via Wilkins and Perutz without Franklin's prior permission, Jerry Donohue's keto tautomer correction, and complementary purine–pyrimidine base pairing (`A=T` 2 H-bonds, `C≡G` 3 H-bonds). Completely free of the false legend that Franklin "did not understand her own data".
4. **Francis Crick, Sydney Brenner, Leslie Barnett & R. J. Watts-Tobin (1961, *Nature* 192(4809): 1227–1232, `doi:10.1038/1921227a0`), Marshall Nirenberg & Heinrich Matthaei (1961, *PNAS* 47(10): 1588–1602, `PMC223178`), and Har Gobind Khorana (1965, *J. Mol. Biol.* 13(1): 302–324; 1968 Nobel Lecture):** Accurately documents the phage T4 `rII` `+1 / +2 / +3` frameshift proof, cell-free `poly-U` translation into polyphenylalanine (`UUU = Phe`), and Khorana's journey from Raipur (Punjab), D.A.V. High School (Multan), and Punjab University (Lahore, with Mahan Singh) to Liverpool, Zurich, Cambridge, Vancouver, and Madison, where his synthetic repeating copolymers (`(UC)n → Ser–Leu`, `(UG)n → Cys–Val`, `(AG)n → Arg–Glu`, `(AC)n → Thr–His`, `(UUC)n`, and `(UAG)n` nonsense codons) completed the 64-codon table.
5. **Linus Pauling et al. (1949, *Science* 110: 543–548) and Vernon Ingram (1956, *Nature* 178: 792–794; 1957, *Nature* 180(4581): 326–328, `doi:10.1038/180326a0`):** Accurately documents two-dimensional trypsin peptide fingerprinting of `HbA` vs `HbS` Peptide #4 and the single-amino-acid substitution at position 6 of the 146-residue beta-globin chain (`GAG → GTG` / mRNA `GAG → GUG`, `Glu⁶ → Val⁶`).
6. **Honest Source-Use, Access-Limits & Non-Trialled Activity Disclosures:** Every section and `record:ch11-decisions` includes explicit OpenStax attribution (`Biology 2e` and `Concepts of Biology` in `provenance/sources.yml`) and licence/AI-ingestion disclosures, honest access limits, and explicit in-text and provenance disclosure that the kitchen banana DNA spooling activity (`:::home` in §11.1) is an educational demonstration reviewed for safety and feasibility (adult supervision, external chilled rubbing alcohol away from flames, never tasted) and not classroom-trialled for this edition.

---

## Section 6: Preservation Baseline & Shared-File Audit (`source/tests/ch11-preserved.json`): PASS

- Independently verified all **282** pre-Chapter-11 files recorded in `source/tests/ch11-preserved.json` by exact byte count and SHA-256 hash: **281 of 282** files (including all Chapters 0–10 markdown, figures, all 20 prior stories including `p-ramachandran.md`, `siddiqi-para-channels.md`, `p-agre.md`, and `banting-mahalanabis-lifelines.md`, front-matter 3D explorer `source/app/x_code.js`, models, widgets, CSS/JS app shell, fonts, `provenance/sources.yml`, and prior gate/test files) are **100% byte-for-byte identical** to the pre-Chapter-11 baseline.
- The sole modified existing file is the shared registry `source/live/enhancements.js` (current size `81,763` bytes, SHA-256 `9bf761b461d71b97f1172c48feeae12b2670c68b70f13cff173e16685c57495a`). Splitting at the single marker `  dna_base_pairing: {` and restoring the closing `};\n` reconstructs the exact `72,327`-byte pre-Chapter-11 file with SHA-256 **`fba7e18d6982dce2ba27bec47e3b3ee201d1f7b78618f428b8395f80dc614ef0`** (matching `original_base64` byte-for-byte), proving that `source/live/enhancements.js` was modified strictly by appending the 3 Chapter 11 widget entries (`dna_base_pairing`, `codon_cipher_khorana`, `transcription_translation_ribosome`).

---

## Section 7: Gate A Findings & Disposition

- **`BLOCKER`:** None (`0`).
- **`FIX`:** None (`0`).
- **`CONSIDER`:** None (`0`).

**Final Gate A Verdict:** **`PASS` (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**.
