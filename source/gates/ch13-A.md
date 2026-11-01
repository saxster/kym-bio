# Chapter 13 — Gate A: independent facts, models, syllabus, provenance and preservation review

Reviewed 31 October 2026. Independent reviewer did not author the chapter, story, figures, models, tests or provenance. Report-only review; this report (`/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch13-A.md`) is the only file written. Scope is scientific, historical, mathematical, syllabus, cross-book continuity, provenance and preservation acceptance, not final browser/print acceptance or publication approval. Read `source/GATES.md`, `source/gates/ch12-A.md`, all Chapter 13 deliverables, `source/live/enhancements.js`, `source/provenance/sources.yml`, preserved stories `source/src/stories/p-ammal.md`, `source/src/stories/p-ramachandran.md`, `source/src/stories/franklin-khorana-codebreakers.md`, and `source/src/stories/meselson-flemming-gurdon-divisions.md`, and `source/src/ch12.md`.

## Disposition Summary

**PASS** — **0 BLOCKER / 0 FIX / 0 CONSIDER**.

---

## Section 1: Artifact Hash & Build Verification

Independently computed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I` and verified against `/tmp/lt_bio_ch13/final/qa_ch13/artifact-hashes.json` and `/tmp/lt_bio_ch13/final/qa_ch13/report.json`:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch13.md` | 39729 | `8aab8c20dd1e219bde54e9641e9a2010cbb2de730b3451ef9e086a891f9085e7` |
| `source/src/ch13.md` | 94671 | `301ffc61d85105f1d1d1226f014e3c2af644060137cda7ef3287a5c32501051e` |
| `source/src/stories/mendel-morgan-sanghvi-inheritance.md` | 7641 | `28ab98d15a1c8925b4c6f2c87cb7187c85066707afcc83895be16e5f5894936e` |
| `source/src/stories/p-ammal.md` | 2155 | `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096` |
| `source/src/stories/p-ramachandran.md` | 4745 | `44fbf4cf961c399e22b7b884b4af8c2aa9ed796088782e3aa0ca2e77f00d6832` |
| `source/src/stories/franklin-khorana-codebreakers.md` | 12921 | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| `source/src/stories/meselson-flemming-gurdon-divisions.md` | 9734 | `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5` |
| `source/figs_ch13.py` | 53866 | `884c39294809ce0caeea8a65e36703fc3221d938fd846da3f6962f4145335c08` |
| `source/provenance/ch13.yml` | 28030 | `09214720c1be4734439804e808dd2c4ce5dce81e7a6f8dddebd22a284020f747` |
| `source/provenance/sources.yml` | 1232 | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/inheritance_model.js` | 46465 | `b908cfe548c3d9bddf0a4114e1666ab9fdf1fd200109f41b4fa27bb5aa362093` |
| `source/live/w_mendel_punnett_simulator.js` | 14313 | `aa6934db81e33d2b2c9220fbe4625b89e95dbf36aea584f36edb8bf0fa55bdfe` |
| `source/live/w_abo_codominance_pedigree.js` | 14061 | `1a3403dfb78808612715b1e030face97be3bf0c92951c127f4ac4b5f1217b913` |
| `source/live/w_sex_linked_cross_lab.js` | 14986 | `53a03e27855ea305a1bc24f9bc40b1f1eda2555babfbea8db8ba139399cc08fc` |
| `source/live/enhancements.js` | 102985 | `f37480e1dbc50ec082abec69a0600fa90cfc085ef20d10e266077eacfd039a8a` |
| `source/tests/ch13-preserved.json` | 169723 | `5cb5b26d81b81d641145f0213b0c9e379ab6c3a02c6a76e50286158de7240ad8` |
| `source/tests/ch13_domain.mjs` | 19832 | `acf0353477ce6bba6e7566dc5d648ea747eb17954778a5d758f7c510d66a0370` |
| `source/tests/qa_ch13.py` | 31380 | `ccb254c04e9e050e1b39a7fa084fc0cc160e0a2f3fe9a90caae72f12f0dd3f83` |
| `source/tests/verify_ch13.sh` | 1788 | `158888060fff29400c3a00ab491d65a902f1f18329505961e8fb81122c178fd7` |
| `source/tests/README-ch13.md` | 3570 | `5cc5c2f1a74674b24563f267cff26a5d7538460012d2c6ef68bf8ab28e5a7863` |
| `source/build/site/index.html` | 3057899 | `4c31da7b6dd74859f347dceb5b906f5a732116a53c796dfede2b68828612b2c8` |
| `source/build/site/sw.js` | 3687 | `bb71fd733e6574f21b09ec9bba2b49ea58b5e9714bda83834675995338d4e3ac` |
| `source/build/site/live/w_mendel_punnett_simulator-WA4B5TCS.js` | 7417 | `594618798f7e22df6b9075e210483826d2ac4596c4e6988c861c5b9d7f8de476` |
| `source/build/site/live/w_abo_codominance_pedigree-RMSA4IW4.js` | 7319 | `d395977012b368668079680099adbd22e06a254f338d41eccfecff55121eedf0` |
| `source/build/site/live/w_sex_linked_cross_lab-J4A475K7.js` | 7710 | `bf813f25219d3892afc08198fdc2c188d9b068fd8fcdccd8e7aa3a0ff736b94c` |
| `/tmp/lt_bio_ch13/final/qa_ch13/print.pdf` | 32105647 | `c6590821897682af23e8f05de841f77f38cac8946d9eeea3a6d9b969b1942d37` |

### Build, Domain, Acceptance & Regression Summary

- **Built Service Worker Cache Version:** `lw-1638f24652e7` (`source/build/site/sw.js` and `/tmp/lt_bio_ch13/final/qa_ch13/report.json`).
- **Lazy Widget Chunk Budgets (`< 150,000` bytes each):** `w_mendel_punnett_simulator-WA4B5TCS.js` (`7,417` bytes), `w_abo_codominance_pedigree-RMSA4IW4.js` (`7,319` bytes), `w_sex_linked_cross_lab-J4A475K7.js` (`7,710` bytes); `index.html` size `3,057,899` bytes (`< 4,000,000` bytes).
- **Chapter 13 Headless Domain Verification (`node source/tests/ch13_domain.mjs`):** **`34,346` assertions passed** (`0` failures).
- **Chapter 13 Full-Book Browser & Print Acceptance (`source/tests/qa_ch13.py`):** **`1,643` QA assertions passed** (`0` console/page errors, `660`-page PDF with all 9 plates on single pages `508, 512, 521, 523, 534, 535, 541, 546, 551`).
- **Prior-Chapter Regression Suite Pass Counts (`/tmp/lt_bio_ch13/final`):**
  - **Chapter 12 (`qa_ch12.py`):** `1,926` QA assertions + `4,387` domain cases passed.
  - **Chapter 11 (`qa_ch11.py`):** `1,894` QA assertions + `2,713` domain cases passed.
  - **Chapter 10 (`qa_ch10.py`):** `1,857` QA assertions + `1,938` domain cases passed.
  - **Chapter 9 (`qa_ch09.py`):** `1,819` QA assertions + `620` domain cases passed.
  - **Chapter 8 (`qa_ch08.py`):** `1,890` QA assertions + `1,731` domain cases passed.
  - **Chapter 7 (`qa_ch07.py`):** `1,710` QA assertions + `2,046` domain cases passed.
  - **Chapter 6 (`qa_ch06.py`):** `1,441` QA assertions + `1,145` domain cases passed.
  - **Chapter 5 (`qa_ch05.py`):** `985` QA assertions + `18,133` domain cases passed.
  - **Full-Book Offline & Lazy-Chunk Smoke Test (`livetest.py --offline`):** `0` chunks loaded before interaction, all `41` live figures + `3` explorers open cleanly online and offline with `0` console errors.

---

## Section 2: Cambridge IGCSE Biology 0610 (2026–2028 v3 & 2029) & Lower Secondary 0893 Syllabus Audit

Every Core and Supplement learning outcome assigned to Chapter 13 was audited across `source/src/ch13.md`, `source/figs_ch13.py`, `source/live/inheritance_model.js`, the three interactive widgets, and `source/provenance/ch13.yml`:

### Cambridge Lower Secondary Science 0893 (`7Bp.01`, `7Bp.03`, `8Bp.01`–`8Bp.03`, `9Bp.01`–`9Bp.04`, `9Bs.01`–`9Bs.03`): PASS
- **`7Bp.01`, `7Bp.03`, `9Bs.01`–`9Bs.03`:** Reinforces that chromosomes inside the cell nucleus are made of DNA, that genes sit at fixed chromosome addresses (loci) and come in alternative forms (**alleles**), and that **meiosis** halves diploid (`2n`) homologous pairs into haploid (`n`) gametes so **fertilisation** gives each zygote one allele of each gene from each parent (`src/ch13.md` §13.1, §13.2, `#fig-13-1`–`#fig-13-3`).
- **`8Bp.01`–`8Bp.03`, `9Bp.01`–`9Bp.04`:** Explains chromosomal sex determination in humans (**`XX` female**, **`XY` male**), shows why `100%` of ova carry `X` while sperm split `50% X : 50% Y` to produce an independent **`1 : 1` sex ratio** at fertilisation, and links inherited alleles on chromosomes to observable organismal characteristics (`src/ch13.md` §13.4, `#fig-13-7`).

### Cambridge IGCSE Biology 0610 Topic 17.1 — Chromosomes, genes and proteins (`Core 2–4 & Supplement 7`): PASS
- **17.1 Core 2 & 3 (`Gene & Allele`):** Defines a **gene** verbatim as **a length of DNA that codes for a protein** and an **allele** verbatim as **an alternative form of a gene** (`src/ch13.md` §13.1, `:::school`, `#fig-13-2`).
- **17.1 Core 4 (`Inheritance of Sex`):** Describes the inheritance of sex in humans with **`XX` (female)** and **`XY` (male)** chromosomes using complete genetic diagrams and `2 × 2` Punnett squares showing `1 : 1` (`50% XX : 50% XY`) offspring probabilities (`src/ch13.md` §13.4, `#fig-13-7`, `w_sex_linked_cross_lab.js`).
- **17.1 Supplement 7 (`Molecular Basis of Dominance & Codominance via Proteins/Enzymes`):** Explains how the DNA base sequence of an allele determines the amino-acid sequence and 3D active-site folding of the encoded enzyme or protein—demonstrating why a `50%` dose of active starch-branching enzyme `SBEI` in `Rr` peas (or `GTA`/`GTB` in `IᴬIᴼ`/`IᴮIᴼ`) is haplosufficient for the dominant phenotype, whereas in `IᴬIᴮ` (`Group AB`) and `HbᴬHbˢ` both functional allele products are synthesized simultaneously (`src/ch13.md` §13.1, §13.3, `#fig-13-2`, `#fig-13-5`, `#fig-13-6`).

### Cambridge IGCSE Biology 0610 Topic 17.4 — Monohybrid inheritance (`Core & Supplement 1–20`): PASS
- **17.4.1 (Core):** Describes **inheritance** verbatim as **the transmission of genetic information from generation to generation** (`src/ch13.md` §13.1, `:::school`).
- **17.4.2 & 17.4.3 / 17.4.6 & 17.4.7 (Core — Dominant & Recessive Alleles):**
  - Defines a **dominant allele** verbatim as **an allele that is expressed if it is present in the genotype** (`src/ch13.md` §13.1, `:::school`).
  - Defines a **recessive allele** verbatim as **an allele that is only expressed when there is no dominant allele of the gene present in the genotype** (`src/ch13.md` §13.1, `:::school`).
- **17.4.4 & 17.4.5 (Core — Genotype & Phenotype):**
  - Defines **genotype** verbatim as **the genetic make-up of an organism in terms of the alleles present** (`src/ch13.md` §13.1 table, `:::school`, `#fig-13-2`).
  - Defines **phenotype** verbatim as **the observable features of an organism** (`src/ch13.md` §13.1 table, `:::school`, `#fig-13-2`).
- **17.4.6–17.4.9 (Core — Homozygous, Heterozygous & Pure-Breeding):**
  - Defines **homozygous** verbatim as **having two identical alleles of a particular gene** and states verbatim that **two identical homozygous individuals that breed together will be pure-breeding** (`src/ch13.md` §13.1 table, `:::school`, `:::check`).
  - Defines **heterozygous** verbatim as **having two different alleles of a particular gene** and states verbatim that **a heterozygous individual is not pure-breeding** (`src/ch13.md` §13.1 table, `:::school`, `:::check`).
- **17.4.10–17.4.12 (Core — Monohybrid Genetic Diagrams, Punnett Squares, `3 : 1` and `1 : 1` Ratios, and Pedigree Diagrams):**
  - Teaches the six-line Cambridge genetic diagram protocol (parental phenotypes, diploid `2n` parental genotypes, circled single-allele haploid `n` gametes, `2 × 2` Punnett square, offspring genotypes/phenotypes, and simplest whole-number ratios **`3 : 1`** and **`1 : 1`** plus percentage/fraction probabilities) (`src/ch13.md` §13.2, `#fig-13-3`, `w_mendel_punnett_simulator.js`).
  - Teaches standard **pedigree diagrams** (`□` male, `○` female, shaded affected, unshaded unaffected) and both deductive rules (`Rule 1: Unaffected × Unaffected → Affected proves recessive`; `Rule 2: Affected × Affected → Unaffected proves dominant`) (`src/ch13.md` §13.2, `#fig-13-4`, `w_abo_codominance_pedigree.js`).
- **17.4.13–17.4.14 (Supplement — Test Crosses):**
  - Explains how to identify an unknown dominant-phenotype genotype (`BB` vs `Bb`, or `TT` vs `Tt`) by a **test cross** with a **homozygous recessive individual (`bb` or `tt`)**, contrasting `100%` dominant offspring (`BB × bb`) against a **`1 : 1` phenotypic ratio** (`Bb × bb`) (`src/ch13.md` §13.2, `#fig-13-3`, `w_mendel_punnett_simulator.js`).
- **17.4.15, 17.4.17 & 17.4.18 (Supplement — Codominance, `Iᴬ/Iᴮ/Iᴼ` ABO Blood Groups & `1 : 2 : 1` Ratio):**
  - Describes **codominance** verbatim as **a situation in which both alleles in heterozygous organisms contribute to the phenotype** (and are expressed simultaneously and independently) (`src/ch13.md` §13.3, `:::school`, `#fig-13-5`, `#fig-13-6`).
  - Explains the inheritance of **ABO blood groups** across all four phenotypes (**`A`, `B`, `AB` and `O`**) and all six diploid genotypes formed by the alleles **`Iᴬ`, `Iᴮ` and `Iᴼ`** (`IᴬIᴬ`, `IᴬIᴼ`, `IᴮIᴮ`, `IᴮIᴼ`, `IᴬIᴮ`, `IᴼIᴼ`), demonstrating `1 : 2 : 1` phenotypic ratios in codominant crosses (`IᴬIᴮ × IᴬIᴮ` and `CᴿCᵂ × CᴿCᵂ`), `1 : 1 : 1 : 1` in `IᴬIᴼ × IᴮIᴼ`, and `1 : 1` in `IᴬIᴮ × IᴼIᴼ` (`src/ch13.md` §13.3, Case 13, `#fig-13-5`, `#fig-13-6`, `#fig-13-9`, `w_abo_codominance_pedigree.js`).
- **17.4.16, 17.4.19 & 17.4.20 (Supplement — Sex-Linked Characteristics, Red–Green Colour Blindness, Haemophilia & Sex-Linked Crosses):**
  - Describes a **sex-linked characteristic** verbatim as **a characteristic in which the gene responsible is located on a sex chromosome and that this makes it more common in one sex than in the other** (`src/ch13.md` §13.4, `:::school`, `:::check`).
  - Describes **red–green colour blindness** (`Xᴮ/Xᵇ`) and **haemophilia** (`Xᴴ/Xʰ`) as examples of X-linked recessive characteristics, constructs and interprets genetic diagrams using `X`/`Y` superscript notation (`Xᴮ, Xᵇ, Y` and `Xᴴ, Xʰ, Y`), and distinguishes probabilities **among daughters (`XX`)**, **among sons (`XY`)**, and **among all children** (`src/ch13.md` §13.4, Case 13, `#fig-13-8`, `#fig-13-9`, `w_sex_linked_cross_lab.js`).
- **Strict Syllabus Boundary Obedience (Chapters 14–16 Partition):**
  - **No premature teaching of Chapters 14–16:** Continuous versus discontinuous variation graphs (`0610 18.1`), adaptive features (`18.2`), natural selection, malaria selection on `HbᴬHbˢ` allele frequencies, antibiotic resistance, and artificial selection (`18.3`) are **not** taught in Chapter 13—they appear solely as forward-looking questions in the closing `:::next` bridge to Chapter 14 (`src/ch13.md` lines 612–622). Recombinant DNA, plasmids, and genetic engineering (`0610 20.1–20.3`) are likewise reserved for Chapter 15.
  - **No dihybrid `9 : 3 : 3 : 1` clutter:** All crosses in Chapter 13 strictly obey the Cambridge `0610 17.4` monohybrid scope (`2 × 2` Punnett grids).

---

## Section 3: Independent Mathematical, Biophysical & Algorithmic Verification of `inheritance_model.js`, `ch13_domain.mjs`, Prose, Plates & Widgets

Every constant, ratio, count, and state transition in `source/live/inheritance_model.js`, `source/tests/ch13_domain.mjs` (`34,346` assertions), `source/src/ch13.md`, `source/figs_ch13.py`, and `source/live/enhancements.js` was independently verified using Node and Python:

### 1. Mendel's 1866 Brno 7-Character Pea Ledger, `F₃` Progeny Tests & Molecular Enzyme Haplosufficiency (`simulateMendelPunnett`, `#fig-13-1`–`#fig-13-3`, `w_mendel_punnett_simulator.js`)
- **Exact `F₂` counts across all 7 characters in Mendel (1866):**

| # | Character | Locus | Dominant (`F₁ = 100%`) | Recessive | `F₂` Dom | `F₂` Rec | Total (`N`) | Ratio | Dom `%` | Rec `%` |
|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|
| 1 | Seed shape | `R / r` | Round | Wrinkled | `5,474` | `1,850` | `7,324` | **`2.96 : 1`** | `74.74%` | `25.26%` |
| 2 | Cotyledon colour | `Y / y` | Yellow | Green | `6,022` | `2,001` | `8,023` | **`3.01 : 1`** | `75.06%` | `24.94%` |
| 3 | Flower colour | `B / b` | Purple | White | `705` | `224` | `929` | **`3.15 : 1`** | `75.89%` | `24.11%` |
| 4 | Ripe pod form | `P / p` | Inflated | Constricted | `882` | `299` | `1,181` | **`2.95 : 1`** | `74.68%` | `25.32%` |
| 5 | Unripe pod colour | `G / g` | Green | Yellow | `428` | `152` | `580` | **`2.82 : 1`** | `73.79%` | `26.21%` |
| 6 | Flower position | `Fa / fa` | Axial | Terminal | `651` | `207` | `858` | **`3.14 : 1`** | `75.87%` | `24.13%` |
| 7 | Stem height | `T / t` | Tall (`1.8–2.1 m`) | Dwarf (`0.3–0.45 m`) | `787` | `277` | `1,064` | **`2.84 : 1`** | `73.97%` | `26.03%` |
| **Sum** | **All 7 characters** | — | **Dominant** | **Recessive** | **`14,949`** | **`5,010`** | **`19,959`** | **`2.98 : 1`** | **`74.90%`** | **`25.10%`** |

- **`F₃` self-fertilisation progeny tests proving the hidden `1 : 2` (`RR : Rr`) split inside the `F₂` dominant class:**
  - **Seed shape (`565` round `F₂` seeds grown to `F₃`):** `193` plants (`34.16% ≈ 1/3`) bred true (`100%` round, `RR`) and `372` plants (`65.84% ≈ 2/3`) segregated `3 : 1` (`Rr`), giving `372 / 193 = 1.93 : 1` (theoretical `2 : 1`), confirming the `1 RR : 2 Rr : 1 rr` (`25% : 50% : 25%`) genotypic ratio.
  - **Seed cotyledon colour (`519` yellow `F₂` seeds grown to `F₃`):** `166` plants (`31.98%`) bred true (`YY`) and `353` plants (`68.02%`) segregated `3 : 1` (`Yy`), giving `353 / 166 = 2.13 : 1` (theoretical `2 : 1`).
- **All 9 (`3 × 3`) diploid parental monohybrid crosses & enzyme dosage (`buildMendelGenotypeStep`, `combineMendelAlleles`):**
  - `RR × RR → 100% RR` (`100%` enzyme dose, `100%` dominant); `rr × rr → 100% rr` (`0%` enzyme dose, `100%` recessive).
  - `RR × rr` (or `rr × RR`) $\to$ **`100% Rr`** (`50%` haplosufficient enzyme dose, `100%` dominant `F₁` phenotype).
  - `Rr × Rr` $\to$ **`1 RR : 2 Rr : 1 rr`** (`25%` `100%` dose : `50%` `50%` dose : `25%` `0%` dose) $\to$ **`3 : 1` (`75% : 25%`) phenotype ratio**.
  - `Rr × rr` (or `rr × Rr`, **diagnostic test cross**) $\to$ **`1 Rr : 1 rr`** $\to$ **`1 : 1` (`50% : 50%`) phenotype ratio**, contrasting sharply with `RR × rr → 100% Rr`.
  - Sample-size convergence (`MENDEL_SAMPLE_STEPS` at `N = 16, 64, 400, 7,324`): deterministic small-sample bounce at `N = 16` (`68.8% : 31.3%`, `2.20 : 1` for `R/r`) narrows monotonically at `N = 64` (`71.9% : 28.1%`, `2.56 : 1`), `N = 400` (`74.3% : 25.8%`, `2.88 : 1`), and `N = 7,324` (`74.74% : 25.26%`, `2.96 : 1`).

### 2. Pedigree Logic, ABO Glycosyltransferase Codominance & Scale-Dependent Dominance (`simulateAboCodominancePedigree`, `#fig-13-4`–`#fig-13-6`, `w_abo_codominance_pedigree.js`)
- **Three core pedigree deduction rules across Chapter 13:**
  1. **Autosomal Recessive Proof (`Rule 1`):** Two unaffected parents (`Aa × Aa`) producing an affected child (`aa`, or two Group A parents `IᴬIᴼ × IᴬIᴼ` having a Group O child `IᴼIᴼ`) proves the condition is **recessive** and both parents are **heterozygous carriers (`Aa`)**. Each subsequent pregnancy has an independent **`25%` (`1/4`)** chance of `aa`, **`50%` (`1/2`)** chance of `Aa`, and **`25%` (`1/4`)** chance of `AA`; among **already-born unaffected siblings** (`aa` excluded), **`2/3` (`66.7%`)** are carriers (`2 Aa` out of `1 AA + 2 Aa`).
  2. **Autosomal Dominant Proof (`Rule 2`):** Two affected parents (`Aa × Aa`) producing an unaffected child (`aa`) proves the condition is **dominant (`A`)** and both parents are heterozygous (`Aa`), because two recessive affected parents (`aa × aa`) could only ever have `100%` affected (`aa`) children.
  3. **X-Linked Recessive Pedigree Pattern (`§13.4` & Case 13):** Unaffected parents (`XᴮXᵇ × XᴮY` or `XᴴXʰ × XᴴY`) having an affected son (`XᵇY` or `XʰY`) with an affected maternal grandfather (`XᵇY` or `XʰY`) traces transmission through the **unaffected carrier mother (`XᴮXᵇ`)**, while an affected father (`XᵇY`) transmits `Xᵇ` to **`100%` of his daughters (`XᴮXᵇ`)** and **`0%` of his sons (`XᴮY`)**.
- **Chromosome `9` `ABO` glycosyltransferase molecular biology & all `36` (`6 × 6`) parental crosses:**
  - `Iᴬ` encodes active `α-1,3-N-acetylgalactosaminyltransferase` (`GTA`, attaching `GalNAc` = Antigen A); `Iᴮ` differs at 4 codons (`176, 235, 266, 268`) to encode active `α-1,3-galactosyltransferase` (`GTB`, attaching `D-Gal` = Antigen B); `Iᴼ` carries frameshift deletion `ΔG261` (`0%` transferase activity, unmodified H-stalk).
  - Across all `36` (`6 × 6`) parental combinations of `IᴬIᴼ`, `IᴬIᴬ`, `IᴮIᴼ`, `IᴮIᴮ`, `IᴬIᴮ`, and `IᴼIᴼ`:
    - **Four-blood-group cross (`IᴬIᴼ × IᴮIᴼ`):** `25% IᴬIᴮ (Group AB) : 25% IᴬIᴼ (Group A) : 25% IᴮIᴼ (Group B) : 25% IᴼIᴼ (Group O)` (**`1 : 1 : 1 : 1`**).
    - **Maternity swap exclusion cross (`IᴬIᴮ × IᴼIᴼ`):** `50% IᴬIᴼ (Group A) : 50% IᴮIᴼ (Group B)` (**`1 : 1`**), with **`0%` Group AB and `0%` Group O**.
    - **Codominance cross (`IᴬIᴮ × IᴬIᴮ`):** `25% IᴬIᴬ (Group A) : 50% IᴬIᴮ (Group AB) : 25% IᴮIᴮ (Group B)` (**`1 : 2 : 1` phenotypic ratio** matching the `1 : 2 : 1` genotypic ratio, exactly parallel to roan cattle `CᴿCᵂ × CᴿCᵂ`).
  - **Dominance vs codominance by observation scale (`Hbᴬ/Hbˢ` bridge to Chapter 11):** Explains clearly why in `HbᴬHbˢ` heterozygotes on Chromosome `11`, both normal `HbA` and sickle `HbS` beta-globin polypeptides are synthesized side-by-side inside every red blood cell (**codominance at the molecular protein scale**), while one `Hbᴬ` allele normally prevents severe clinical sickle-cell anaemia at sea level.

### 3. `XX` vs `XY` Sex Determination, X-Linked Recessive Crosses & Maternity Ward Bijective Solver (`simulateSexLinkedCross`, `#fig-13-7`–`#fig-13-9`, `w_sex_linked_cross_lab.js`)
- **`XX` (`~156 Mb`, `~850–900` genes) vs `XY` (`~57 Mb`, `<100` genes including `SRY`) sex determination:**
  - Maternal meiosis produces `100%` `(X)` ova; paternal meiosis produces `50%` `(X)` sperm and `50%` `(Y)` sperm $\to$ **`50% XX` female : `50% XY` male (`1 : 1`)** at every pregnancy, completely independent of prior births.
- **Exhaustive `3 × 2` X-linked cross table across all 3 loci (`Xᴮ/Xᵇ` red–green colour vision, `Xᴴ/Xʰ` Factor VIII/IX haemophilia, `X⁺/Xʷ` Morgan 1910 *Drosophila* white eye):**

| Maternal `XX` × Paternal `XY` | Daughters (`XX`) Normal `%` | Daughters (`XX`) Carrier `%` | Daughters (`XX`) Affected `%` | Sons (`XY`) Normal `%` | Sons (`XY`) Affected `%` | All Children Affected `%` |
|---|---:|---:|---:|---:|---:|---:|
| **`1.` Carrier (`XᴮXᵇ`) × Normal (`XᴮY`)** | `50%` (`XᴮXᴮ`) | `50%` (`XᴮXᵇ`) | **`0%`** | `50%` (`XᴮY`) | **`50%` (`XᵇY`)** | **`25%`** (all male) |
| **`2.` Carrier (`XᴮXᵇ`) × Affected (`XᵇY`)** | `0%` | `50%` (`XᴮXᵇ`) | **`50%` (`XᵇXᵇ`)** | `50%` (`XᴮY`) | **`50%` (`XᵇY`)** | **`50%`** (`25% F + 25% M`) |
| **`3.` Normal (`XᴮXᴮ`) × Normal (`XᴮY`)** | `100%` (`XᴮXᴮ`) | `0%` | **`0%`** | `100%` (`XᴮY`) | **`0%`** | **`0%`** |
| **`4.` Normal (`XᴮXᴮ`) × Affected (`XᵇY`)** | `0%` | **`100%` (`XᴮXᵇ`)** | **`0%`** | **`100%` (`XᴮY`)** | **`0%`** | **`0%`** |
| **`5.` Affected (`XᵇXᵇ`) × Normal (`XᴮY`)** | `0%` | **`100%` (`XᴮXᵇ`)** | **`0%`** | `0%` | **`100%` (`XᵇY`)** | **`50%`** (all male) |
| **`6.` Affected (`XᵇXᵇ`) × Affected (`XᵇY`)** | `0%` | `0%` | **`100%` (`XᵇXᵇ`)** | `0%` | **`100%` (`XᵇY`)** | **`100%`** |

- **Mumbai Maternity Ward Assignment Verification:**
  - In Case 13 (`src/ch13.md` & `#fig-13-9`), Couple 1 (`Desai: IᴬIᴮ × IᴼIᴼ`) can produce only `Group A (IᴬIᴼ)` or `Group B (IᴮIᴼ)` children (`0%` Group O), whereas Couple 2 (`Kulkarni: IᴬIᴼ × IᴮIᴼ`) produces `AB, A, B, O` (`25%` each), uniquely assigning **Baby 1 (`Group O, IᴼIᴼ`) to Couple 2** and **Baby 2 (`Group A, IᴬIᴼ`) to Couple 1**.
  - Furthermore, combining the 6 distinct parental ABO/X-linked family profiles tested in the Chapter 13 suite (`IᴼIᴼ × IᴼIᴼ` only O; `IᴬIᴮ × IᴬIᴮ` only A/AB/B; `IᴬIᴮ × IᴼIᴼ` only A/B; `IᴬIᴬ × IᴼIᴼ` only A; `IᴮIᴮ × IᴼIᴼ` only B; and X-linked/4-group combinations) yields **1 unique bijective baby-to-family assignment out of `6! = 720` permutations**.

---

## Section 4: Cross-Chapter & Cross-Book Continuity Audit: PASS

1. **Fulfilment of Chapter 12's Closing Bridge (`src/ch12.md` `:::next`):**
   - Directly answers all three questions posed at the close of Chapter 12: **(1)** how two alleles on a homologous chromosome pair interact when they carry different instructions (`R/r` in Mendel's peas, `Hbᴬ/Hbˢ` on Chromosome `11`, and `Iᴬ/Iᴮ/Iᴼ` on Chromosome `9` in `§13.1` & `§13.3`); **(2)** how meiotic segregation (`2n → n`) and random fertilisation (`n + n → 2n`) generate exact `3 : 1`, `1 : 2 : 1`, `1 : 1`, and `1 : 1 : 1 : 1` ratios across Punnett squares, test crosses, and family pedigrees (`§13.1`–`§13.3`); and **(3)** why `XX`/`XY` sex chromosomes produce a `1 : 1` sex ratio and why X-linked recessive traits (`red–green colour blindness` and `haemophilia`) follow a distinct mother-to-son and grandfather-to-grandson pattern (`§13.4` & Case 13).
2. **Existing Companion Stories & Cross-Chapter Callbacks Preserved and Linked:**
   - **E. K. Janaki Ammal (`source/src/stories/p-ammal.md`):** Preserved byte-for-byte (`2,155` bytes, SHA-256 `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096`) and auto-linked in `src/ch13.md` §13.1 (`#ch13 a[data-story="p-ammal"]` verified in `qa_ch13.py`).
   - **G. N. Ramachandran (`source/src/stories/p-ramachandran.md`):** Preserved byte-for-byte (`4,745` bytes, SHA-256 `44fbf4cf961c399e22b7b884b4af8c2aa9ed796088782e3aa0ca2e77f00d6832`) and auto-linked in `src/ch13.md` §13.1 (`#ch13 a[data-story="p-ramachandran"]`).
   - **Rosalind Franklin & Har Gobind Khorana (`source/src/stories/franklin-khorana-codebreakers.md`):** Preserved byte-for-byte (`12,921` bytes, SHA-256 `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb`) and auto-linked in `src/ch13.md` §13.1 (`#ch13 a[data-story="franklin-khorana-codebreakers"]`).
   - **Walther Flemming, Meselson & Stahl, and John Gurdon (`source/src/stories/meselson-flemming-gurdon-divisions.md`):** Preserved byte-for-byte (`9,734` bytes, SHA-256 `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5`) and auto-linked in `src/ch13.md` opening (`#ch13 a[data-story="meselson-flemming-gurdon-divisions"]`).
   - Connects seamlessly back to Chapter 3 (water potential and osmosis in wrinkled `rr` pea seeds), Chapter 4 (enzyme active sites and catalytic turnover), Chapters 8 & 10 (RBC surface antigens, plasma antibodies, and `fibrinogen → fibrin` blood clotting in haemophilia), Chapter 9 (foveal red/green cone photoreceptor opsins in colour vision), Chapter 11 (DNA base triplets, frameshift mutations, and `HbA`/`HbS` on Chromosome `11`), and Chapter 12 (homologous chromosomes, mitosis, meiosis `2n → n`, and selective gene expression).
3. **New Companion Story `source/src/stories/mendel-morgan-sanghvi-inheritance.md` (`terms:` check):**
   - Declares `terms: Johann Gregor Mendel, Reginald Punnett, William Bateson, Nettie Stevens, Thomas Hunt Morgan, L. D. Sanghvi`.
   - Independent Python scan across `src/ch00.md`–`src/ch12.md` and all 21 pre-existing stories returned **0 prior hits** for all six terms, and `qa_ch13.py` confirmed `0` hijacked story links across `#ch0`–`#ch12`.
4. **Outgoing Bridge to Chapter 14 (`src/ch13.md` `:::next`):**
   - Cleanly bridges to Chapter 14 (*The Four-Billion-Year Trial: Variation, Natural Selection & Evolution*) across its three core questions: **(1)** mutation, meiosis, and fertilisation as the sources of continuous and discontinuous variation, **(2)** natural selection, adaptation, and antibiotic resistance, and **(3)** heterozygote advantage of `HbᴬHbˢ` in malaria belts and selective breeding.

---

## Section 5: Historical & Primary-Source Provenance Audit (`source/provenance/ch13.yml` & `sources.yml`): PASS

Audited all **18 top-level keys** in `source/provenance/ch13.yml` (`13.1`, `13.2`, `13.3`, `13.4`, the 9 `fig:c13_*` entries, `story:mendel-morgan-sanghvi-inheritance`, the 3 `model:*` entries, and `record:ch13-decisions`) and `source/provenance/sources.yml`:

1. **Johann Gregor Mendel (1866, *Verhandlungen des naturforschenden Vereines in Brünn* 4: 3–47, BHL `page/40056925`) & Molecular Pea Locus Identifications:** Accurately documents Mendel's 1851–1853 University of Vienna training under Christian Doppler and Andreas von Ettingshausen, his 1856–1863 *Pisum sativum* crosses in Brno across `~28,000` plants and `19,959` `F₂` outcomes (`14,949 : 5,010 = 2.98 : 1`) and `F₃` progeny tests (`193 RR : 372 Rr` out of `565` round `F₂` seeds), Carl Nägeli's apomictic *Hieracium* (hawkweed) complication, and the molecular cloning of `SBEI` (`Bhattacharyya et al. 1990`, *Cell* 60: 115–122, `doi:10.1016/0092-8674(90)90721-P`), `PsGA3ox1` gibberellin `3β-hydroxylase` (`Lester et al. 1997`), and the flower-colour bHLH regulator (`Hellens et al. 2010`).
2. **William Bateson & Edith Rebecca Saunders (1902, *Reports to the Evolution Committee of the Royal Society* I) and Reginald Crundall Punnett (1905, *Mendelism*, Cambridge, `doi:10.5962/bhl.title.168646`):** Accurately documents the 1900 rediscovery by de Vries, Correns, and Tschermak, Bateson's coining of *allele* (*allelomorph*), *homozygote*, *heterozygote*, and *genetics* (1905), and Punnett's `2 × 2` gamete matrix.
3. **Karl Landsteiner (1900–1901, *Wiener klinische Wochenschrift* 14: 1132–1134), Felix Bernstein (1924, *Klinische Wochenschrift* 3: 1495–1497, `doi:10.1007/BF01736255`), Fumi-ichiro Yamamoto et al. (1990, *Nature* 345: 229–233, `doi:10.1038/345229a0`), and L. D. Sanghvi & V. R. Khanolkar (1949, *Annals of Eugenics* 15(1): 52–76, `doi:10.1111/j.1469-1809.1949.tb02422.x`):** Accurately documents Landsteiner's serological discovery of ABO blood groups, Bernstein's 1924 mathematical proof of three multiple alleles at a single locus, Yamamoto et al.'s 1990 molecular sequencing of Chromosome `9q34.2` (`GTA`, `GTB` 4-codon difference, and `Iᴼ` `ΔG261` frameshift), and Sanghvi's human genetics and pedigree surveys at the Indian Cancer Research Centre (Tata Memorial Centre) in Parel, Mumbai.
4. **Nettie Maria Stevens (1905, *Carnegie Institution of Washington Publication* No. 36: 1–32, `doi:10.5962/bhl.title.56515`) and Thomas Hunt Morgan (1910, *Science* 32(812): 120–122, `doi:10.1126/science.32.812.120`):** Accurately documents Stevens's 1905 discovery of `XX` and `XY` sex chromosomes in *Tenebrio molitor* at Bryn Mawr College and Morgan's 1910 white-eyed *Drosophila melanogaster* crosses (`1,237` red `F₁`; `3,470` red : `782` white `F₂` with all white-eyed `F₂` flies being male `XʷY`) in the Columbia University Fly Room.
5. **Honest Source-Use, Access-Limits & Non-Trialled Activity Disclosures:** Every section and `record:ch13-decisions` includes explicit OpenStax attribution (`Biology 2e` and `Concepts of Biology` in `provenance/sources.yml`) and licence/AI-ingestion disclosures, honest access limits, and explicit in-text and provenance disclosure that the Two-Coin & Two-Dal Mendel Ledger kitchen probability investigation (`:::home` in §13.2) is a safe, non-trialled educational adaptation (`0` chemicals, `0` heat, `0` biological fluids).

---

## Section 6: Preservation Baseline & Shared-File Audit (`source/tests/ch13-preserved.json`): PASS

- Independently verified all **316** pre-Chapter-13 files recorded in `source/tests/ch13-preserved.json` by exact byte count and SHA-256 hash: **315 of 316** files (including all Chapters 0–12 markdown, figures, all 22 prior stories including `p-ammal.md`, `p-ramachandran.md`, `franklin-khorana-codebreakers.md`, and `meselson-flemming-gurdon-divisions.md`, front-matter 3D explorers, models, widgets, CSS/JS app shell, fonts, `provenance/sources.yml`, and prior gate/test files) are **100% byte-for-byte identical** to the pre-Chapter-13 baseline.
- The sole modified existing file is the shared registry `source/live/enhancements.js` (current size `102,985` bytes, SHA-256 `f37480e1dbc50ec082abec69a0600fa90cfc085ef20d10e266077eacfd039a8a`). Splitting at the single marker `  mendel_punnett_simulator: {` and restoring the closing `};\n` reconstructs the exact `91,898`-byte pre-Chapter-13 file with SHA-256 **`17babcd77caea250f6e8f021148ccec5e6264eb6dff25ac3d6a03a12f6fde6d9`** (matching `original_base64` byte-for-byte), proving that `source/live/enhancements.js` was modified strictly by appending the 3 Chapter 13 widget entries (`mendel_punnett_simulator`, `abo_codominance_pedigree`, `sex_linked_cross_lab`).

---

## Section 7: Gate A Findings & Disposition

- **`BLOCKER`:** None (`0`).
- **`FIX`:** None (`0`).
- **`CONSIDER`:** None (`0`).

**Final Gate A Verdict:** **`PASS` (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**.
