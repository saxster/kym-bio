# Chapter 14 — Final Verification & Handover Record

**Chapter:** Chapter 14 — *The Glitch Engine & Natural Selection: Variation, Adaptation & Evolution* (Volume IV: *The Master Code & The Four-Billion-Year Case File*)
**Book:** *The Living World: Biology from the dry seed to the thinking brain* (Book 3)
**Verification Date:** 2026-10-31
**Overall Status:** **PASS (Gate A PASS · Gate B PASS · Local Acceptance & Ch 13/12/11/10/9/8/7/6/5 Regressions PASS)**

---

## 1. Frozen Build & Artifact Inventory (`artifact-hashes.json`)

All verification suites, visual inspections, and independent Gate A and Gate B reviews were executed against the frozen build in `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and `/tmp/lt_bio_ch14/final` (service worker cache version `lw-6a0bae695699`):

| Artifact Path | Size (bytes) | SHA-256 Digest |
| :--- | ---: | :--- |
| `source/grounding/ch14.md` | `61,256` | `d662573c8633e4cfbaa10ad4cb6dd3f5833074a7705e55d3815aa8677991ca33` |
| `source/src/ch14.md` | `95,265` | `0354fa79cdf523242856ebdf1adf044e5e5524643e6d36dfa94d074d990e0461` |
| `source/src/stories/darwin-wallace-luria-sahni-selection.md` | `8,657` | `8f967c01519d7d647a017bc924c3d39b219034d877dab82201e9d7e0b312476b` |
| `source/src/stories/p-ammal.md` | `2,155` | `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096` |
| `source/src/stories/p-margulis.md` | `2,341` | `0ab39876c71ad04130f2145439aa7aaa699d02fa794e23ad56ff76f1df074e8b` |
| `source/src/stories/p-pasteur.md` | `1,981` | `f4175b1e582d2e87c43be665e0fc15928fd6c28adf36554821a095783be9edca` |
| `source/src/stories/p-ramachandran.md` | `4,745` | `44fbf4cf961c399e22b7b884b4af8c2aa9ed796088782e3aa0ca2e77f00d6832` |
| `source/src/stories/franklin-khorana-codebreakers.md` | `12,921` | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| `source/src/stories/meselson-flemming-gurdon-divisions.md` | `9,734` | `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5` |
| `source/src/stories/mendel-morgan-sanghvi-inheritance.md` | `7,641` | `28ab98d15a1c8925b4c6f2c87cb7187c85066707afcc83895be16e5f5894936e` |
| `source/figs_ch14.py` | `45,259` | `2282a41709f58eb06649075de709d641ec684ef3ff3954938463549c0c495179` |
| `source/provenance/ch14.yml` | `30,922` | `1c0ee389c49a7908c4f118d22e91743c0c941c530833b75a2aee6996a0de7ecf` |
| `source/provenance/sources.yml` | `1,232` | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/selection_model.js` | `49,179` | `c989ba26e82ac19f8eb05ef19dd7cd3d1f35bc16306f71db8190c5b1f2c0fcbd` |
| `source/live/w_variation_mutation_lab.js` | `17,967` | `3cb471bf59cb329d9cbd8a95fe95ef51f9ec3fcc0ff6da5e1dfe6fa1d77c01de` |
| `source/live/w_natural_selection_simulator.js` | `13,391` | `cb6003476236b741ad363abf6b03c5b173e7b81c0b28fb7d56ae9fe74cda26ac` |
| `source/live/w_adaptive_features_selective_breeding.js` | `14,247` | `597aca31a24425a2c2e02d2af2dda595cd4e4c4e7691ea5f867e205029c18886` |
| `source/live/enhancements.js` | `114,778` | `d0cac9e357f46dd9c3dfb2d0c737bccd26ac41fe45fa5d1d2a5a77c2ee18ff19` |
| `source/tests/ch14-preserved.json` | `187,087` | `cbbf7352e1f75a685ce2149eae0f5839030e9a3c50ac5f40ab2eef8a79fb0648` |
| `source/tests/ch14_domain.mjs` | `17,692` | `6e40be3e5b830dedaf8f5d5aadf87977ff3990cdd9ecf5e7b1195a288071e025` |
| `source/tests/qa_ch14.py` | `32,297` | `ab86869b152f6672f855aba8835baf380cf7a8bde295dc440391a81d43477d9d` |
| `source/tests/verify_ch14.sh` | `1,919` | `098da919acee148aac9056555e0d46ba973fdd144f52c03d7593ac50c128d96d` |
| `source/tests/README-ch14.md` | `2,435` | `1656aefe47b5c04038d74b9b798caf9b3d7895fd1e5616ac16e60e3392c0a732` |
| `source/build/site/index.html` | `3,306,894` | `3c5d675f33ab06fa2188be9151ac3d182bd1a9a048832f7dcec4ab78c0c1e2f0` |
| `source/build/site/sw.js` | `3,875` | `d1ba9107fc9a6975907a12ff80b1262e3ca8d7742c3974762c1b0224ebab8a32` |
| `source/build/site/live/w_variation_mutation_lab-IDHND2TM.js` | `8,722` | `160019c7a2e9f49c73d28cdd000f3eef9d88a7c4c7914ad7c1002e210b195522` |
| `source/build/site/live/w_natural_selection_simulator-LI2BJXWM.js` | `6,800` | `d3244b7ea20aa0528c885c66f7b0db11977bf559e640736f4960e026d2d8f0b5` |
| `source/build/site/live/w_adaptive_features_selective_breeding-SJWT7LLQ.js` | `7,170` | `afe7081993a1274115f91cfcf14330cc1c370d36fc4b7574588209307d021da6` |
| `/tmp/lt_bio_ch14/final/qa_ch14/print.pdf` | `34,952,504` | `6d43e29b6873639034d460029e7ad64b45d7fb137db269ded0dbc2076d88dde5` |

---

## 2. Automated Verification & Regression Summary (`verify_ch14.sh`)

Command executed:
```bash
cd /Users/amarsukhi/src/MyCode/kym_bio
BIO_CH14_VERIFY_OUT=/tmp/lt_bio_ch14/final ./source/tests/verify_ch14.sh
```

| Verification Step | Command / Script | Result | Evidence / Output |
| :--- | :--- | :--- | :--- |
| **1. Full Site Build** | `build.py --site build/site` | **PASS** | `index.html` (`3229.4 KB`, `15` chapters, `71` checks, `60` predictions, `107` terms, `44` live widgets); cache version `lw-6a0bae695699`; all lazy JS chunks `< 150 KB` (`w_variation_mutation_lab` `8.5 KB`, `w_natural_selection_simulator` `6.6 KB`, `w_adaptive_features_selective_breeding` `7.0 KB`, shared `selection_model` chunk `34.0 KB`). |
| **2. Chapter 14 Domain Model** | `node tests/ch14_domain.mjs` | **PASS** | **`4,664` assertions passed** (`0` failures) across continuous (`student_height`, `body_mass`, touching histogram bars) vs discontinuous (`abo_blood_group`, `pea_seed_shape`, separated bar charts, `0%` environmental shift) variation, mutagen rate multipliers (`1×` to `50×`), Lederberg `1952` `12`-colony velveteen replica plating (`C3, C7, C11` pre-existing), meiosis/fertilisation recombinations (`>70 trillion`), `7-day` completed vs Day `3` early-stop antibiotic resistance trajectories (`0` cleared vs `1,000` cells / `99.2%` resistant relapse), Kettlewell/Majerus *Biston betularia* selection, Haldane/Allison/Sanghvi `HbᴬHbˢ` malaria balancing selection (`w = 1.00` carrier fitness), xerophyte vs hydrophyte biophysics, `40`-generation selective breeding trajectories + heterozygosity decline, and the `6`-taxon Cytochrome c / beta-globin / coding-DNA molecular clock. |
| **3. Chapter 14 Acceptance Suite** | `tests/qa_ch14.py` | **PASS** | **`1,664` assertions passed** across preservation baseline (`333` files), provenance & sources, story routing (`darwin-wallace-luria-sahni-selection` with `0` prior collisions across Ch 0–13, plus preserved `p-ammal`, `p-margulis`, `p-pasteur`, `p-ramachandran`, `franklin-khorana-codebreakers`, `meselson-flemming-gurdon-divisions`, and `mendel-morgan-sanghvi-inheritance` linked in Chapter 14), `SVG_AUDIT` (`0` overlap/clipping across 9 plates × 5 widths × 3 themes), live widgets (`fig-14-1`, `fig-14-4`, `fig-14-5`, `window.ch14Issues == []`, tour steps `1–5`, cutaway toggles, trial capture/clear), and print PDF (`726` pages, `0` single-line figure splits, `0` console/page errors). |
| **4. Chapter 13 Regression** | `tests/qa_ch13.py` | **PASS** | **`1,643` QA assertions + `34,346` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch13_regression`). |
| **5. Chapter 12 Regression** | `tests/qa_ch12.py` | **PASS** | **`1,926` QA assertions + `4,387` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch12_regression`). |
| **6. Chapter 11 Regression** | `tests/qa_ch11.py` | **PASS** | **`1,894` QA assertions + `2,713` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch11_regression`). |
| **7. Chapter 10 Regression** | `tests/qa_ch10.py` | **PASS** | **`1,857` QA assertions + `1,938` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch10_regression`). |
| **8. Chapter 9 Regression** | `tests/qa_ch09.py` | **PASS** | **`1,819` QA assertions + `620` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch09_regression`). |
| **9. Chapter 8 Regression** | `tests/qa_ch08.py` | **PASS** | **`1,890` QA assertions + `1,731` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch08_regression`). |
| **10. Chapter 7 Regression** | `tests/qa_ch07.py` | **PASS** | **`1,710` QA assertions + `2,046` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch07_regression`). |
| **11. Chapter 6 Regression** | `tests/qa_ch06.py` | **PASS** | **`1,441` QA assertions + `1,145` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch06_regression`). |
| **12. Chapter 5 Regression** | `tests/qa_ch05.py` | **PASS** | **`985` QA assertions + `18,133` domain cases passed** (`/tmp/lt_bio_ch14/final/qa_ch05_regression`). |
| **13. Full-Book Offline Smoke Test** | `livetest.py --offline` | **PASS** | `0` chunks loaded before tap; all `44` live figures + `3` explorers open cleanly; service worker ready; offline reload and offline widget launch verified; `0` console errors (`/tmp/lt_bio_ch14/final/full`). |

---

## 3. Print PDF Pagination Map (`/tmp/lt_bio_ch14/final/qa_ch14/print.pdf`, 726 pages)

- **Chapter 14 Opener & Section 14.1 (*The glitch engine: continuous vs discontinuous variation, mutations and mutagens*):** PDF pages `557–569` (`Figure 14.1` `c14_mutation_variation_spectra` on p. `564`; `Figure 14.2` `c14_mutagens_dna_glitches` on p. `565`).
- **Section 14.2 (*The six-step filter: natural selection, peppered moths and antibiotic resistance*):** PDF pages `569–581` (`Figure 14.3` `c14_natural_selection_six_steps` + companion story card on p. `575`; `Figure 14.4` `c14_antibiotic_resistance_selection` on p. `576`; `:::home` *The 60-second forceps-and-newspaper camouflage hunt* on p. `578`).
- **Section 14.3 (*Built for the extremes: adaptive features of xerophytes, hydrophytes and animals*):** PDF pages `581–593` (`Figure 14.5` `c14_xerophyte_hydrophyte_adaptations` and `Figure 14.6` `c14_animal_plant_adaptive_features` on p. `588`).
- **Section 14.4 (*Guided evolution and deep time: selective breeding, fossils and DNA clocks*):** PDF pages `593–605` (`Figure 14.7` `c14_selective_breeding_vs_natural` and `Figure 14.8` `c14_sahni_fossils_dna_clocks` on p. `600`).
- **End-of-Chapter Synthesis & Chapter 15 Bridge (`:::case` & `:::next`):** PDF pages `605–610` (`Figure 14.9` `c14_sickle_cell_malaria_case` on p. `606`; `Case file 14: The sickle-cell malaria paradox, the stopped-antibiotic relapse, and the Coimbatore cane` on pp. `606–609`; `:::next` bridge to Chapter 15 on pp. `609–610`).

---

## 4. Independent Gate Reviews

1. **Gate A (`source/gates/ch14-A.md`) — Facts, Models, Syllabus, Provenance & Preservation:**
   - **Reviewer:** Independent Gate A Subagent (`c8a32f00-4d13-462f-bb1d-326f4339d5c8`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**
2. **Gate B (`source/gates/ch14-B.md`) — Reader Clarity, ≤ 3-Sentence Explain-Backs, Visuals, Story & Safety:**
   - **Reviewer:** Independent Gate B Subagent (`2a8055c4-1eb1-472f-a1a7-36711573ba34`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**

---

## 5. Local Handover Preview Server

A local HTTP server is running in the background serving `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and verified byte-for-byte against `source/build/site/index.html` (`3,306,894` bytes, SHA-256 `3c5d675f33ab06fa2188be9151ac3d182bd1a9a048832f7dcec4ab78c0c1e2f0`):
- **Chapter 14 Direct Link:** `http://127.0.0.1:8799/index.html#ch14`
- **Section 14.1 & Live Widget (`fig-14-1`):** `http://127.0.0.1:8799/index.html#s14-1`
- **Section 14.2 & Live Widget (`fig-14-4`):** `http://127.0.0.1:8799/index.html#s14-2`
- **Section 14.3 & Live Widget (`fig-14-5`):** `http://127.0.0.1:8799/index.html#s14-3`
- **Section 14.4:** `http://127.0.0.1:8799/index.html#s14-4`
- **3D Master Code Explorer:** `http://127.0.0.1:8799/index.html#explore-code`
- **3D Living Cell Explorer:** `http://127.0.0.1:8799/index.html#explore-cell`
