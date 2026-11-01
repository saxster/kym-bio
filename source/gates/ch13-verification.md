# Chapter 13 — Final Verification & Handover Record

**Chapter:** Chapter 13 — *The Monk's Spreadsheet: Mendel, Alleles & Inheritance* (Volume IV: *The Master Code & The Four-Billion-Year Case File*)
**Book:** *The Living World: Biology from the dry seed to the thinking brain* (Book 3)
**Verification Date:** 2026-10-31
**Overall Status:** **PASS (Gate A PASS · Gate B PASS · Local Acceptance & Ch 12/11/10/9/8/7/6/5 Regressions PASS)**

---

## 1. Frozen Build & Artifact Inventory (`artifact-hashes.json`)

All verification suites, visual inspections, and independent Gate A and Gate B reviews were executed against the frozen build in `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and `/tmp/lt_bio_ch13/final` (service worker cache version `lw-1638f24652e7`):

| Artifact Path | Size (bytes) | SHA-256 Digest |
| :--- | ---: | :--- |
| `source/grounding/ch13.md` | `39,729` | `8aab8c20dd1e219bde54e9641e9a2010cbb2de730b3451ef9e086a891f9085e7` |
| `source/src/ch13.md` | `94,671` | `301ffc61d85105f1d1d1226f014e3c2af644060137cda7ef3287a5c32501051e` |
| `source/src/stories/mendel-morgan-sanghvi-inheritance.md` | `7,641` | `28ab98d15a1c8925b4c6f2c87cb7187c85066707afcc83895be16e5f5894936e` |
| `source/src/stories/p-ammal.md` | `2,155` | `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096` |
| `source/src/stories/p-ramachandran.md` | `4,745` | `44fbf4cf961c399e22b7b884b4af8c2aa9ed796088782e3aa0ca2e77f00d6832` |
| `source/src/stories/franklin-khorana-codebreakers.md` | `12,921` | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| `source/src/stories/meselson-flemming-gurdon-divisions.md` | `9,734` | `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5` |
| `source/figs_ch13.py` | `53,866` | `884c39294809ce0caeea8a65e36703fc3221d938fd846da3f6962f4145335c08` |
| `source/provenance/ch13.yml` | `28,030` | `09214720c1be4734439804e808dd2c4ce5dce81e7a6f8dddebd22a284020f747` |
| `source/provenance/sources.yml` | `1,232` | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/inheritance_model.js` | `46,465` | `b908cfe548c3d9bddf0a4114e1666ab9fdf1fd200109f41b4fa27bb5aa362093` |
| `source/live/w_mendel_punnett_simulator.js` | `14,313` | `aa6934db81e33d2b2c9220fbe4625b89e95dbf36aea584f36edb8bf0fa55bdfe` |
| `source/live/w_abo_codominance_pedigree.js` | `14,061` | `1a3403dfb78808612715b1e030face97be3bf0c92951c127f4ac4b5f1217b913` |
| `source/live/w_sex_linked_cross_lab.js` | `14,986` | `53a03e27855ea305a1bc24f9bc40b1f1eda2555babfbea8db8ba139399cc08fc` |
| `source/live/enhancements.js` | `102,985` | `f37480e1dbc50ec082abec69a0600fa90cfc085ef20d10e266077eacfd039a8a` |
| `source/tests/ch13-preserved.json` | `169,723` | `5cb5b26d81b81d641145f0213b0c9e379ab6c3a02c6a76e50286158de7240ad8` |
| `source/tests/ch13_domain.mjs` | `19,832` | `acf0353477ce6bba6e7566dc5d648ea747eb17954778a5d758f7c510d66a0370` |
| `source/tests/qa_ch13.py` | `31,380` | `ccb254c04e9e050e1b39a7fa084fc0cc160e0a2f3fe9a90caae72f12f0dd3f83` |
| `source/tests/verify_ch13.sh` | `1,788` | `158888060fff29400c3a00ab491d65a902f1f18329505961e8fb81122c178fd7` |
| `source/tests/README-ch13.md` | `3,570` | `5cc5c2f1a74674b24563f267cff26a5d7538460012d2c6ef68bf8ab28e5a7863` |
| `source/build/site/index.html` | `3,057,899` | `4c31da7b6dd74859f347dceb5b906f5a732116a53c796dfede2b68828612b2c8` |
| `source/build/site/sw.js` | `3,687` | `bb71fd733e6574f21b09ec9bba2b49ea58b5e9714bda83834675995338d4e3ac` |
| `source/build/site/live/w_mendel_punnett_simulator-WA4B5TCS.js` | `7,417` | `594618798f7e22df6b9075e210483826d2ac4596c4e6988c861c5b9d7f8de476` |
| `source/build/site/live/w_abo_codominance_pedigree-RMSA4IW4.js` | `7,319` | `d395977012b368668079680099adbd22e06a254f338d41eccfecff55121eedf0` |
| `source/build/site/live/w_sex_linked_cross_lab-J4A475K7.js` | `7,710` | `bf813f25219d3892afc08198fdc2c188d9b068fd8fcdccd8e7aa3a0ff736b94c` |
| `/tmp/lt_bio_ch13/final/qa_ch13/print.pdf` | `32,105,647` | `c6590821897682af23e8f05de841f77f38cac8946d9eeea3a6d9b969b1942d37` |

---

## 2. Automated Verification & Regression Summary (`verify_ch13.sh`)

Command executed:
```bash
cd /Users/amarsukhi/src/MyCode/kym_bio
BIO_CH13_VERIFY_OUT=/tmp/lt_bio_ch13/final ./source/tests/verify_ch13.sh
```

| Verification Step | Command / Script | Result | Evidence / Output |
| :--- | :--- | :--- | :--- |
| **1. Full Site Build** | `build.py --site build/site` | **PASS** | `index.html` (`2986.2 KB`, `14` chapters, `67` checks, `56` predictions, `107` terms, `41` live widgets); cache version `lw-1638f24652e7`; all lazy JS chunks `< 150 KB` (`w_mendel_punnett_simulator` `7.2 KB`, `w_abo_codominance_pedigree` `7.1 KB`, `w_sex_linked_cross_lab` `7.5 KB`, shared `inheritance_model` chunk `31.3 KB`). |
| **2. Chapter 13 Domain Model** | `node tests/ch13_domain.mjs` | **PASS** | **`34,346` assertions passed** (`0` failures) across Mendel's 1866 7-character pea ledger (`14,949 : 5,010 = 19,959` outcomes, `2.98 : 1`), `F₃` heterozygote progeny tests (`193 : 372` seed shape, `166 : 353` seed colour), `SBEI` enzyme dosage (`100%`, `50%`, `0%`), Punnett crosses (`3:1`, `1:2:1`, `1:1`), test crosses, 3 pedigree logic rules, `36` (`6 × 6`) `Iᴬ/Iᴮ/Iᴼ` ABO crosses (`GTA`/`GTB`/`ΔG261`), `Hbᴬ/Hbˢ` dominance vs codominance by measurement scale, `XX`/`XY` (`1:1`) sex determination (`50%` independent per pregnancy), X-linked crosses (`X⁺/Xʷ`, `Xᴮ/Xᵇ`, `Xᴴ/Xʰ`), and the 6-family Mumbai maternity ward assignment (`1` unique bijective assignment out of `720` permutations). |
| **3. Chapter 13 Acceptance Suite** | `tests/qa_ch13.py` | **PASS** | **`1,643` assertions passed** across preservation baseline (`316` files), provenance & sources, story routing (`mendel-morgan-sanghvi-inheritance` with `0` prior collisions across Ch 0–12, plus preserved `p-ammal`, `p-ramachandran`, `franklin-khorana-codebreakers`, and `meselson-flemming-gurdon-divisions` linked in Chapter 13), `SVG_AUDIT` (`0` overlap/clipping across 9 plates × 5 widths × 3 themes), live widgets (`fig-13-1`, `fig-13-5`, `fig-13-8`, `window.ch13Issues == []`, tour steps `1–5`, cutaway toggles, trial capture/clear), and print PDF (`660` pages, `0` single-line figure splits, `0` console/page errors). |
| **4. Chapter 12 Regression** | `tests/qa_ch12.py` | **PASS** | **`1,926` QA assertions + `4,387` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch12_regression`). |
| **5. Chapter 11 Regression** | `tests/qa_ch11.py` | **PASS** | **`1,894` QA assertions + `2,713` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch11_regression`). |
| **6. Chapter 10 Regression** | `tests/qa_ch10.py` | **PASS** | **`1,857` QA assertions + `1,938` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch10_regression`). |
| **7. Chapter 9 Regression** | `tests/qa_ch09.py` | **PASS** | **`1,819` QA assertions + `620` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch09_regression`). |
| **8. Chapter 8 Regression** | `tests/qa_ch08.py` | **PASS** | **`1,890` QA assertions + `1,731` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch08_regression`). |
| **9. Chapter 7 Regression** | `tests/qa_ch07.py` | **PASS** | **`1,710` QA assertions + `2,046` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch07_regression`). |
| **10. Chapter 6 Regression** | `tests/qa_ch06.py` | **PASS** | **`1,441` QA assertions + `1,145` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch06_regression`). |
| **11. Chapter 5 Regression** | `tests/qa_ch05.py` | **PASS** | **`985` QA assertions + `18,133` domain cases passed** (`/tmp/lt_bio_ch13/final/qa_ch05_regression`). |
| **12. Full-Book Offline Smoke Test** | `livetest.py --offline` | **PASS** | `0` chunks loaded before tap; all `41` live figures + `3` explorers open cleanly; service worker ready; offline reload and offline widget launch verified; `0` console errors (`/tmp/lt_bio_ch13/final/full`). |

---

## 3. Print PDF Pagination Map (`/tmp/lt_bio_ch13/final/qa_ch13/print.pdf`, 660 pages)

- **Chapter 13 Opener & Section 13.1 (*Seven questions in a monastery garden: Mendel, genes, alleles and loci*):** PDF pages `499–515` (`Figure 13.1` `c13_mendel_peas_ratios` + companion story card on p. `508`; `Figure 13.2` `c13_homologous_loci_alleles` on p. `512`).
- **Section 13.2 (*The probability grid: Punnett squares, test crosses and pedigree detective work*):** PDF pages `515–528` (`:::home` *Two coins, four dal bowls, and 100 tosses: testing whether the 3 : 1 ratio is exact or probabilistic* on p. `519`; `Figure 13.3` `c13_punnett_test_cross_ledger` on p. `521`; `Figure 13.4` `c13_pedigree_detective_rules` on p. `523`).
- **Section 13.3 (*When both voices speak at once: codominance and ABO blood groups*):** PDF pages `528–538` (`Figure 13.5` `c13_codominance_abo_blood` on p. `534`; `Figure 13.6` `c13_dominance_vs_codominance` on p. `535`).
- **Section 13.4 (*The missing partner on the Y: sex determination and sex-linked inheritance*):** PDF pages `538–550` (`Figure 13.7` `c13_xx_xy_sex_determination` on p. `541`; `Figure 13.8` `c13_x_linked_inheritance` on p. `546`).
- **End-of-Chapter Synthesis & Chapter 14 Bridge (`:::case` & `:::next`):** PDF pages `551–556` (`Figure 13.9` `c13_mumbai_maternity_case` on p. `551`; `Case file 13: The Mumbai maternity ward mix-up—and the sickle-cell double clue` on pp. `551–554`; `:::next` bridge to Chapter 14 on pp. `555–556`).

---

## 4. Independent Gate Reviews

1. **Gate A (`source/gates/ch13-A.md`) — Facts, Models, Syllabus, Provenance & Preservation:**
   - **Reviewer:** Independent Gate A Subagent (`10c2819e-4b1f-4399-a8e5-928b651b5202`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**
2. **Gate B (`source/gates/ch13-B.md`) — Reader Clarity, ≤ 3-Sentence Explain-Backs, Visuals, Story & Safety:**
   - **Reviewer:** Independent Gate B Subagent (`f3ca6521-8c88-483a-a4de-ac5bd16547db`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**

---

## 5. Local Handover Preview Server

A local HTTP server is running in the background serving `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and verified byte-for-byte against `source/build/site/index.html` (`3,057,899` bytes, SHA-256 `4c31da7b6dd74859f347dceb5b906f5a732116a53c796dfede2b68828612b2c8`):
- **Chapter 13 Direct Link:** `http://127.0.0.1:8798/index.html#ch13`
- **Section 13.1 & Live Widget (`fig-13-1`):** `http://127.0.0.1:8798/index.html#s13-1`
- **Section 13.2:** `http://127.0.0.1:8798/index.html#s13-2`
- **Section 13.3 & Live Widget (`fig-13-5`):** `http://127.0.0.1:8798/index.html#s13-3`
- **Section 13.4 & Live Widget (`fig-13-8`):** `http://127.0.0.1:8798/index.html#s13-4`
- **3D Master Code Explorer:** `http://127.0.0.1:8798/index.html#explore-code`
- **3D Living Cell Explorer:** `http://127.0.0.1:8798/index.html#explore-cell`
