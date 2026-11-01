# Chapter 11 — Final Verification & Handover Record

**Chapter:** Chapter 11 — *The Twisted Ladder & The Protein Printers* (Opening Volume IV: *The Master Code & The Four-Billion-Year Case File*)
**Book:** *The Living World: Biology from the dry seed to the thinking brain* (Book 3)
**Verification Date:** 2026-10-31
**Overall Status:** **PASS (Gate A PASS · Gate B PASS · Local Acceptance & Ch 10/9/8/7/6/5 Regressions PASS)**

---

## 1. Frozen Build & Artifact Inventory (`artifact-hashes.json`)

All verification suites, visual inspections, and independent Gate A and Gate B reviews were executed against the frozen build in `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and `/tmp/lt_bio_ch11/final` (service worker cache version `lw-b3d3ad9c287c`):

| Artifact Path | Size (bytes) | SHA-256 Digest |
| :--- | ---: | :--- |
| `source/grounding/ch11.md` | `36,860` | `fdcb7496c3d4842a473b76b72a57db3da938adf9779c7b075399bf28176fdc59` |
| `source/src/ch11.md` | `81,565` | `3e3f616a899999bac1cf93f64173e0d30a79833097dd6ead92081b01790e153c` |
| `source/src/stories/franklin-khorana-codebreakers.md` | `12,921` | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| `source/figs_ch11.py` | `35,437` | `a219773ff5b44448e16909bc80ad64c610082d00526a5ea8b6f6f204b2bee211` |
| `source/provenance/ch11.yml` | `27,649` | `306cfa3bb7feb96bf2edf81264410ff33bef38b2669d30ab60194cfb42a95626` |
| `source/provenance/sources.yml` | `1,232` | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/genetic_code_model.js` | `33,827` | `7e3f97f1be1dce4762edfe14549e2a3a00d17077e56efa49e0135a04c94292ed` |
| `source/live/w_dna_base_pairing.js` | `12,014` | `933841cbddaec082e23646d7ed442281eaef3cadc05e79c7c422e282ae8be532` |
| `source/live/w_codon_cipher_khorana.js` | `10,651` | `e19daa7296c25e9f81e64d9be4fae70cbc342114501843baa8d9779c19ca84a1` |
| `source/live/w_transcription_translation_ribosome.js` | `10,842` | `14fa3de06c432281ab1331612e47350b8b0c0eced21fb7bab2f273cf97947007` |
| `source/live/enhancements.js` | `81,763` | `9bf761b461d71b97f1172c48feeae12b2670c68b70f13cff173e16685c57495a` |
| `source/tests/ch11_domain.mjs` | `11,535` | `1ea669cc9bbd54df45e4f7bb623cf3936a81b759a0733eafbc539b5e2190ee17` |
| `source/tests/qa_ch11.py` | `31,249` | `20020df875c8ff46a91dd142d6ef9c722619c32c4a8a8737b477287649d5fedc` |
| `source/tests/verify_ch11.sh` | `1,537` | `5931cc71adeb838f0877fb512e7428d56f9d6b7e287340f1edae33780c718fc8` |
| `source/tests/README-ch11.md` | `2,468` | `47886a91c121a4a63796f6bbbb53c4f1bd4b48dff0be4bab314d87fdfd43feb9` |
| `source/tests/ch11-preserved.json` | `138,511` | `723c78384181fa66c6ff7cf237c15bd9c68c58c7a76fafece7e6deafde2b88d2` |
| `source/build/site/index.html` | `2,546,045` | `4cb76291a56b256f2e26826f3311dc4728ddf150f2aa9bfa05ae9540603ee42b` |
| `source/build/site/sw.js` | `3,342` | `ce943807a285518613584fc38cfafd1c425cd4f248851f755891a5064475aec3` |
| `source/build/site/live/w_dna_base_pairing-BAUJF3R4.js` | `6,459` | `e098ee5769a1469ca8fb18d817b7633c992587a8e7f9b6a973b7336023a32f78` |
| `source/build/site/live/w_codon_cipher_khorana-IVHI32Z5.js` | `5,502` | `326a2b3fddbbeba51da8238c44184b4d8e996672df4b0d0f967918988147409e` |
| `source/build/site/live/w_transcription_translation_ribosome-UDYHDGJW.js` | `5,977` | `1eddcbc8a8f5cf6b98027197bbc87fa2181262700f943f05b21d4304c93ec338` |
| `/tmp/lt_bio_ch11/final/qa_ch11/print.pdf` | `26,158,781` | `f302f096033b083454a23c18985199127c8a61bf867729a20d2a9cee59b109ae` |

---

## 2. Automated Verification & Regression Summary (`verify_ch11.sh`)

Command executed:
```bash
cd /Users/amarsukhi/src/MyCode/kym_bio/source
BIO_CH11_VERIFY_OUT=/tmp/lt_bio_ch11/final ./tests/verify_ch11.sh
```

| Verification Step | Command / Script | Result | Evidence / Output |
| :--- | :--- | :--- | :--- |
| **1. Full Site Build** | `build.py --site build/site` | **PASS** | `index.html` (`2486.4 KB`, `12` chapters, `59` checks, `48` predictions, `102` terms, `35` live widgets); cache version `lw-b3d3ad9c287c`; all lazy JS chunks `< 150 KB` (`w_dna_base_pairing` `6.3 KB`, `w_codon_cipher_khorana` `5.4 KB`, `w_transcription_translation_ribosome` `5.8 KB`, shared `genetic_code_model` chunk `17.7 KB`). |
| **2. Chapter 11 Domain Model** | `node tests/ch11_domain.mjs` | **PASS** | **`2,713` assertions passed** across all 64 standard genetic-code codons (`61` sense + `3` stop `UAA/UAG/UGA`), complementary DNA/mRNA/tRNA pairing (`A=T` `2` H-bonds, `C≡G` `3` H-bonds, `A=U` in RNA), Chargaff `%A = %T` and `%G = %C` equivalence (`A/T = 1.00`, `G/C = 1.00`), Franklin & Gosling's Photo 51 B-DNA geometry (`3.4 nm` pitch, `0.34 nm` step, `10 bp/turn`, `2.0 nm` diameter, purine–purine bulge vs pyrimidine–pyrimidine pinch), combinatorial capacity (`4¹=4`, `4²=16`, `4³=64`), Crick–Brenner `+1/+2/+3` frameshift restoration, Nirenberg (`poly-U → Phe`) and Khorana copolymers (`(UC)n → Ser–Leu`, `(UG)n → Cys–Val`, `(UAG)n` amber stop), 6-step nuclear transcription to cytoplasmic ribosome translation, and beta-globin (`HBB`) reference vs Child X silent (`CTG→CTT`, `CUG→CUU`, `Leu³ → Leu³`) vs Child Y missense (`GAG→GTG`, `GAG→GUG`, `Glu⁶ → Val⁶`) vs nonsense (`CAG→TAG`, `UAG` stop). |
| **3. Chapter 11 Acceptance Suite** | `tests/qa_ch11.py` | **PASS** | **`1,894` assertions passed** across preservation baseline (`282` files), provenance & sources, story routing (`franklin-khorana-codebreakers` with `0` prior collisions across Ch 0–10, plus cross-links to `p-ramachandran`, `siddiqi-para-channels`, `p-agre`, and `#explore-code`), `SVG_AUDIT` (`0` overlap/clipping across 9 plates × 5 widths × 3 themes), live widgets (`fig-11-2`, `fig-11-3`, `fig-11-4`, `window.ch11Issues == []`, tour steps `1–5`, cutaway toggles, trial capture/clear), and print PDF (`535` pages, `0` single-line figure splits, `0` console/page errors). |
| **4. Chapter 10 Regression** | `tests/qa_ch10.py` | **PASS** | **`1,857` QA assertions + `1,938` domain cases passed** (`/tmp/lt_bio_ch11/final/qa_ch10_regression`). |
| **5. Chapter 9 Regression** | `tests/qa_ch09.py` | **PASS** | **`1,819` QA assertions + `620` domain cases passed** (`/tmp/lt_bio_ch11/final/qa_ch09_regression`). |
| **6. Chapter 8 Regression** | `tests/qa_ch08.py` | **PASS** | **`1,890` QA assertions + `1,731` domain cases passed** (`/tmp/lt_bio_ch11/final/qa_ch08_regression`). |
| **7. Chapter 7 Regression** | `tests/qa_ch07.py` | **PASS** | **`1,710` QA assertions + `2,046` domain cases passed** (`/tmp/lt_bio_ch11/final/qa_ch07_regression`). |
| **8. Chapter 6 Regression** | `tests/qa_ch06.py` | **PASS** | **`1,441` QA assertions + `1,145` domain cases passed** (`/tmp/lt_bio_ch11/final/qa_ch06_regression`). |
| **9. Chapter 5 Regression** | `tests/qa_ch05.py` | **PASS** | **`985` QA assertions + `18,133` domain cases passed** (`/tmp/lt_bio_ch11/final/qa_ch05_regression`). |
| **10. Full-Book Offline Smoke Test** | `livetest.py --offline` | **PASS** | `0` chunks loaded before tap; all `35` live figures + `3` explorers open cleanly; service worker ready; offline reload and offline widget launch verified; `0` console errors (`/tmp/lt_bio_ch11/final/full`). |

---

## 3. Print PDF Pagination Map (`/tmp/lt_bio_ch11/final/qa_ch11/print.pdf`, 535 pages)

- **Chapter 11 Opener & Section 11.1 (*The hidden instruction book: chromosomes, DNA, and genes in the nucleus*):** PDF pages `398–409` (`Figure 11.1` `c11_avery_dna_genes` on p. `404`; `:::home` *Spooling white threads of DNA from a mashed banana* on p. `408`).
- **Section 11.2 (*The twisted ladder: Rosalind Franklin's Photo 51, Chargaff's rules, and the complementary double helix*):** PDF pages `410–418` (`Figure 11.2` `c11_photo51_double_helix` on p. `414`).
- **Section 11.3 (*From locked archive to protein printer: mRNA, Har Gobind Khorana's triplet codons, and the ribosome assembly line*):** PDF pages `419–433` (`Figure 11.3` `c11_triplet_code_khorana` on p. `423`; `Figure 11.4` `c11_transcription_translation` on p. `425`; `Figure 11.5` `c11_sequence_to_3d_machines` on p. `427`; `Figure 11.6` `c11_dna_vs_mrna_ledger` on p. `429`).
- **Section 11.4 (*One letter in a thousand: haemoglobin, sickle-cell substitution, and silent vs nonsense mutations*):** PDF pages `434–442` (`Figure 11.7` `c11_beta_globin_mutation` on p. `437`; `Figure 11.8` `c11_mutation_outcomes_comparison` on p. `439`).
- **End-of-Chapter Synthesis & Chapter 12 Bridge (`:::case` & `:::next`):** PDF pages `443–447` (`Figure 11.9` `c11_leucine_silent_case` on p. `443`; `Case file 11: Two children, two single-base changes, one unchanged protein` on pp. `443–446`; `:::next` bridge to Chapter 12 on p. `447`).

---

## 4. Independent Gate Reviews

1. **Gate A (`source/gates/ch11-A.md`) — Facts, Models, Syllabus, Provenance & Preservation:**
   - **Reviewer:** Independent Gate A Subagent (`3f2050b1-89d3-439d-9983-d5c6fe8b09ae`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**
2. **Gate B (`source/gates/ch11-B.md`) — Reader Clarity, ≤ 3-Sentence Explain-Backs, Visuals, Story & Safety:**
   - **Reviewer:** Independent Gate B Subagent (`124536fa-1b5e-40f7-9505-36a76675398c`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**

---

## 5. Local Handover Preview Server

A local HTTP server is running in the background serving `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and verified byte-for-byte against `source/build/site/index.html` (`2,546,045` bytes, SHA-256 `4cb76291a56b256f2e26826f3311dc4728ddf150f2aa9bfa05ae9540603ee42b`):
- **Chapter 11 Direct Link:** `http://127.0.0.1:8796/index.html#ch11`
- **Section 11.1:** `http://127.0.0.1:8796/index.html#s11-1`
- **Section 11.2 & Live Widget (`fig-11-2`):** `http://127.0.0.1:8796/index.html#s11-2`
- **Section 11.3 & Live Widgets (`fig-11-3`, `fig-11-4`):** `http://127.0.0.1:8796/index.html#s11-3`
- **Section 11.4:** `http://127.0.0.1:8796/index.html#s11-4`
- **3D Master Code Explorer:** `http://127.0.0.1:8796/index.html#explore-code`
