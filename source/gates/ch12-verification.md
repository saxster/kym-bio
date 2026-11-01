# Chapter 12 — Final Verification & Handover Record

**Chapter:** Chapter 12 — *Copying the Blueprint: Mitosis, Stem Cells & Meiosis* (Volume IV: *The Master Code & The Four-Billion-Year Case File*)
**Book:** *The Living World: Biology from the dry seed to the thinking brain* (Book 3)
**Verification Date:** 2026-10-31
**Overall Status:** **PASS (Gate A PASS · Gate B PASS · Local Acceptance & Ch 11/10/9/8/7/6/5 Regressions PASS)**

---

## 1. Frozen Build & Artifact Inventory (`artifact-hashes.json`)

All verification suites, visual inspections, and independent Gate A and Gate B reviews were executed against the frozen build in `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and `/tmp/lt_bio_ch12/final` (service worker cache version `lw-46acdcb0edb2`):

| Artifact Path | Size (bytes) | SHA-256 Digest |
| :--- | ---: | :--- |
| `source/grounding/ch12.md` | `35,686` | `8d6eaf924fc1a279058044ba05769ed5f6443127387a41b60678dd75bd255e3e` |
| `source/src/ch12.md` | `85,353` | `40936ac853ae1208470c81fb443813202aaf6e0e290c151f316d0ac1edaa2175` |
| `source/src/stories/meselson-flemming-gurdon-divisions.md` | `9,734` | `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5` |
| `source/src/stories/p-ammal.md` | `2,155` | `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096` |
| `source/figs_ch12.py` | `41,009` | `03a63d5432ff200ac8291e6d407943779c5cff4e5e4cc101901f32054fa1a62c` |
| `source/provenance/ch12.yml` | `27,535` | `36d57df3a19b26007e7e8145686a3aff9b380a3a9f4bb823e16ba92f6864916e` |
| `source/provenance/sources.yml` | `1,232` | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/cell_division_model.js` | `45,158` | `bc2fe14c682d4b5a67f16bad8128ecb5ba0a6902862fa353df069392b00fc82a` |
| `source/live/w_dna_replication_meselson.js` | `13,573` | `bb4ba8e21259a5be83125e8a5322638d71bee5d310a3430fb86f74b2966c829d` |
| `source/live/w_mitosis_meiosis_stepper.js` | `13,325` | `481c5ae2d1542d1359c9bd1b2ba04a48a8854ecc955b7444c6812dc1222bb08d` |
| `source/live/w_stem_cell_expression_lab.js` | `11,948` | `1c1eb417bbcc61d4f4af7670b15a5a5c8c587246d36519e08f0731d43b743e41` |
| `source/live/enhancements.js` | `91,898` | `17babcd77caea250f6e8f021148ccec5e6264eb6dff25ac3d6a03a12f6fde6d9` |
| `source/tests/ch12-preserved.json` | `153,626` | `47ea0d3e6f41cf0b738cf361a44d9fd116cddd3575fe86cb4755bcc03de77caf` |
| `source/tests/ch12_domain.mjs` | `16,906` | `5933d2732cb0aa0a819f596f3cae52fe2ba5e41891064d169ac024af7de6a37f` |
| `source/tests/qa_ch12.py` | `31,133` | `a9bf8176120ef22d10132f76078e6f51608977ade52465487c840f62af926f43` |
| `source/tests/verify_ch12.sh` | `1,668` | `3beda5d223df3004f4a52a4361546566f182c4571482dad6e5e6f01bde8ca991` |
| `source/tests/README-ch12.md` | `3,423` | `bf139a6fc5925b3ed81f3c623fbbeba576b12743bfb6fe2dbd9d460bf001f24d` |
| `source/build/site/index.html` | `2,786,236` | `4f99ecac6dbce3c125e3de7d19b213d118732756141123f0236d864a665cb1e7` |
| `source/build/site/sw.js` | `3,516` | `c0d240298a64f1b58d51246a65e133d7489e55021b4d417827813d35050b7783` |
| `source/build/site/live/w_dna_replication_meselson-T2ZKSQ7Y.js` | `7,256` | `f1b11551d0f499ce6f5c40685caef6ba6854efb94a6a6d7a5ba6ce1c21a8a61d` |
| `source/build/site/live/w_mitosis_meiosis_stepper-AS6XTNKP.js` | `6,833` | `3ed300eb26e52164331a1600fe632862023eea537081e768db402d95876e7891` |
| `source/build/site/live/w_stem_cell_expression_lab-2ZCNBLRE.js` | `6,406` | `03a818b58490e65e3cb4276d3a8ba3f9d62a417be5cc3c9dc12515a506166dc3` |
| `/tmp/lt_bio_ch12/final/qa_ch12/print.pdf` | `29,198,379` | `33a61e0232d168bcd41ff94f9d722050b6fbfe39cf9fc7de927dfe792632807e` |

---

## 2. Automated Verification & Regression Summary (`verify_ch12.sh`)

Command executed:
```bash
cd /Users/amarsukhi/src/MyCode/kym_bio/source
BIO_CH12_VERIFY_OUT=/tmp/lt_bio_ch12/final ./tests/verify_ch12.sh
```

| Verification Step | Command / Script | Result | Evidence / Output |
| :--- | :--- | :--- | :--- |
| **1. Full Site Build** | `build.py --site build/site` | **PASS** | `index.html` (`2720.9 KB`, `13` chapters, `63` checks, `52` predictions, `106` terms, `38` live widgets); cache version `lw-46acdcb0edb2`; all lazy JS chunks `< 150 KB` (`w_dna_replication_meselson` `7.1 KB`, `w_mitosis_meiosis_stepper` `6.7 KB`, `w_stem_cell_expression_lab` `6.3 KB`, shared `cell_division_model` chunk `27.8 KB`). |
| **2. Chapter 12 Domain Model** | `node tests/ch12_domain.mjs` | **PASS** | **`4,387` assertions passed** across Meselson–Stahl (`1958`) `CsCl` density gradients (`1.724`, `1.717`, `1.710 g/cm³`; `G0 → 100% HH`, `G1 → 100% HL` falsifying conservative, `G2 → 50% HL + 50% LL` falsifying dispersive, `G3 → 25%/75%`, `G4 → 12.5%/87.5%`), polymerase proofreading (`10⁻⁴ → 10⁻⁹`), centromere vs sister chromatid accounting (`46/46 → 46/92 → 2 × 46/46`), mitosis (`2n = 46 → 2 × 2n = 46`) vs meiosis (`2n = 46 → 4 × n = 23`, $2^{23} = 8,388,608$ gametes, $2^{46} \approx 7.04 \times 10^{13}$ zygotes) vs triploid Cavendish banana (`3n = 33`, `11` uneven triplets jamming Meiosis I), and selective gene expression across `ATP5F1A`, `GAPDH`, `OCT4_SOX2`, `INS`, `HBB`, and `CHAT_SCN9A`. |
| **3. Chapter 12 Acceptance Suite** | `tests/qa_ch12.py` | **PASS** | **`1,926` assertions passed** across preservation baseline (`299` files), provenance & sources, story routing (`meselson-flemming-gurdon-divisions` with `0` prior collisions across Ch 0–11, plus preserved `p-ammal` linked in §12.4 and Case 12), `SVG_AUDIT` (`0` overlap/clipping across 9 plates × 5 widths × 3 themes), live widgets (`fig-12-1`, `fig-12-3`, `fig-12-5`, `window.ch12Issues == []`, tour steps `1–5`, cutaway toggles, trial capture/clear), and print PDF (`595` pages, `0` single-line figure splits, `0` console/page errors). |
| **4. Chapter 11 Regression** | `tests/qa_ch11.py` | **PASS** | **`1,894` QA assertions + `2,713` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch11_regression`). |
| **5. Chapter 10 Regression** | `tests/qa_ch10.py` | **PASS** | **`1,857` QA assertions + `1,938` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch10_regression`). |
| **6. Chapter 9 Regression** | `tests/qa_ch09.py` | **PASS** | **`1,819` QA assertions + `620` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch09_regression`). |
| **7. Chapter 8 Regression** | `tests/qa_ch08.py` | **PASS** | **`1,890` QA assertions + `1,731` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch08_regression`). |
| **8. Chapter 7 Regression** | `tests/qa_ch07.py` | **PASS** | **`1,710` QA assertions + `2,046` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch07_regression`). |
| **9. Chapter 6 Regression** | `tests/qa_ch06.py` | **PASS** | **`1,441` QA assertions + `1,145` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch06_regression`). |
| **10. Chapter 5 Regression** | `tests/qa_ch05.py` | **PASS** | **`985` QA assertions + `18,133` domain cases passed** (`/tmp/lt_bio_ch12/final/qa_ch05_regression`). |
| **11. Full-Book Offline Smoke Test** | `livetest.py --offline` | **PASS** | `0` chunks loaded before tap; all `38` live figures + `3` explorers open cleanly; service worker ready; offline reload and offline widget launch verified; `0` console errors (`/tmp/lt_bio_ch12/final/full`). |

---

## 3. Print PDF Pagination Map (`/tmp/lt_bio_ch12/final/qa_ch12/print.pdf`, 595 pages)

- **Chapter 12 Opener & Section 12.1 (*Unzipping the ladder: semi-conservative DNA replication*):** PDF pages `449–460` (`Figure 12.1` `c12_meselson_stahl_replication` + companion story card on p. `455`; `Figure 12.2` `c12_chromosome_chromatid_ledger` on p. `457`).
- **Section 12.2 (*The thread dance: mitosis, growth, repair and asexual cloning*):** PDF pages `460–472` (`Figure 12.3` `c12_mitosis_cycle_roles` on p. `464`; `:::home` *Rooting an onion bulb in a water tumbler and sprouting a potato eye* on p. `466`; `Figure 12.4` `c12_asexual_vs_sexual_crops` on p. `468`).
- **Section 12.3 (*Same library, different bookmarks: stem cells and selective gene expression*):** PDF pages `472–481` (`Figure 12.5` `c12_stem_cells_gene_expression` on p. `476`; `Figure 12.6` `c12_gurdon_yamanaka_proof` on p. `479`).
- **Section 12.4 (*Halving the deck: meiosis, gametes and fertilisation*):** PDF pages `482–493` (`Figure 12.7` `c12_diploid_haploid_meiosis` on p. `486`; `Figure 12.8` `c12_mitosis_vs_meiosis_ledger` on p. `489`).
- **End-of-Chapter Synthesis & Chapter 13 Bridge (`:::case` & `:::next`):** PDF pages `494–498` (`Figure 12.9` `c12_triploid_banana_case` on p. `494`; `Case file 12: Why your Cavendish banana has no seeds—and why one fungus threatens it` on pp. `495–497`; `:::next` bridge to Chapter 13 on p. `498`).

---

## 4. Independent Gate Reviews

1. **Gate A (`source/gates/ch12-A.md`) — Facts, Models, Syllabus, Provenance & Preservation:**
   - **Reviewer:** Independent Gate A Subagent (`5b6d3de1-76be-432f-8ca8-51544b97af32`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**
2. **Gate B (`source/gates/ch12-B.md`) — Reader Clarity, ≤ 3-Sentence Explain-Backs, Visuals, Story & Safety:**
   - **Reviewer:** Independent Gate B Subagent (`ce8954c3-101c-4050-8272-d25f9388d9e0`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**

---

## 5. Local Handover Preview Server

A local HTTP server is running in the background serving `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and verified byte-for-byte against `source/build/site/index.html` (`2,786,236` bytes, SHA-256 `4f99ecac6dbce3c125e3de7d19b213d118732756141123f0236d864a665cb1e7`):
- **Chapter 12 Direct Link:** `http://127.0.0.1:8797/index.html#ch12`
- **Section 12.1 & Live Widget (`fig-12-1`):** `http://127.0.0.1:8797/index.html#s12-1`
- **Section 12.2 & Live Widget (`fig-12-3`):** `http://127.0.0.1:8797/index.html#s12-2`
- **Section 12.3 & Live Widget (`fig-12-5`):** `http://127.0.0.1:8797/index.html#s12-3`
- **Section 12.4:** `http://127.0.0.1:8797/index.html#s12-4`
- **3D Master Code Explorer:** `http://127.0.0.1:8797/index.html#explore-code`
- **3D Living Cell Explorer:** `http://127.0.0.1:8797/index.html#explore-cell`
