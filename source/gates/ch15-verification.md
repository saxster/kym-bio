# Chapter 15 — Final Verification & Handover Record

**Chapter:** Chapter 15 — *Web of Life & Code Rewritable: Ecology, Nutrient Cycles & Biotechnology* (Volume IV: *The Master Code & The Four-Billion-Year Case File* — Final Capstone Chapter of *The Living World*)
**Book:** *The Living World: Biology from the dry seed to the thinking brain* (Book 3)
**Verification Date:** 2026-10-31
**Overall Status:** **PASS (Gate A PASS · Gate B PASS · Local Acceptance & Ch 14/13/12/11/10/9/8/7/6/5 Regressions PASS)**

---

## 1. Frozen Build & Artifact Inventory (`artifact-hashes.json`)

All verification suites, visual inspections, and independent Gate A and Gate B reviews were executed against the frozen build in `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and `/tmp/lt_bio_ch15/final` (service worker cache version `lw-f41361b0f7b4`):

| Artifact Path | Size (bytes) | SHA-256 Digest |
| :--- | ---: | :--- |
| `source/grounding/ch15.md` | `54,689` | `855048298b5cd8ceb558dd4732796a72bacb263f2a31e67ee18111f43b902d62` |
| `source/src/ch15.md` | `118,751` | `d896deec2d54e78fa2765a80c1958767cf50d095a9be23816cc819c3c7fa22a2` |
| `source/src/stories/lindeman-chain-boyer-doudna-biosphere-biotech.md` | `9,851` | `796d3624bc4cd8c51c8ca780e020f48969ccdc2d64b7ad9c0a7cd20cc837db0a` |
| `source/src/stories/p-ali.md` | `1,951` | `1a45f5a1ce0200cae7edff4322c30f02fa9c58f74f89327b0c404de2f03e0cc6` |
| `source/src/stories/p-ammal.md` | `2,155` | `fd23010d4b6b854414d1b6872bfb402c862390f541806f2f0df45c99f9395096` |
| `source/src/stories/p-helmont.md` | `3,248` | `32fb4ba3d783ce401476da9794213367d61470f9b9efa38aabf97b08e78d1624` |
| `source/src/stories/p-ingenhousz.md` | `4,416` | `a693963cdf87d1de74d58466cd752b002b42f5feb5765d1752b934bcf304357d` |
| `source/src/stories/p-pasteur.md` | `1,981` | `f4175b1e582d2e87c43be665e0fc15928fd6c28adf36554821a095783be9edca` |
| `source/src/stories/p-subbarow.md` | `3,161` | `ea16f604ce24f5f9ce7f8dcfc2ec4e93df43c349fff4389e2575dd8a66c917a7` |
| `source/src/stories/banting-mahalanabis-lifelines.md` | `10,564` | `223b4da2850c4cfa93409b26df1fe48906ecd064f372017c129a819681fde299` |
| `source/src/stories/franklin-khorana-codebreakers.md` | `12,921` | `968af153b124aa87d2b8804ed59548204f58b7b8c99b00fd22580128aafe2bdb` |
| `source/src/stories/meselson-flemming-gurdon-divisions.md` | `9,734` | `9f37dadd4bda7ee16d0e264d4e1d786734eef1979269fa7c55991166d83094b5` |
| `source/src/stories/mendel-morgan-sanghvi-inheritance.md` | `7,641` | `28ab98d15a1c8925b4c6f2c87cb7187c85066707afcc83895be16e5f5894936e` |
| `source/src/stories/darwin-wallace-luria-sahni-selection.md` | `8,657` | `8f967c01519d7d647a017bc924c3d39b219034d877dab82201e9d7e0b312476b` |
| `source/figs_ch15.py` | `55,868` | `1b5df5e10e1b969dd8aa1de9406ef59bb9babf956d9452a1c502400c75006e5f` |
| `source/provenance/ch15.yml` | `29,903` | `4f5ff0bdb85fcf1def7a14fa5f0f320a76dfa7529d021ac78ec04ec1f9301cba` |
| `source/provenance/sources.yml` | `1,232` | `f7bbe63eb599dc36247675211245cb8506a604c790c5bdb12e8b72aaafd78ea0` |
| `source/live/biosphere_biotech_model.js` | `36,648` | `65da6f00095593ffa118a7e50e4ac88257f622081570671a8ad0cdc1998ea774` |
| `source/live/w_ecosystem_trophic_lab.js` | `16,868` | `9bf8544deb1f45b9166e464f3d25fa0b9306492456a73638ad5c671a9c7945a5` |
| `source/live/w_nutrient_cycles_eutrophication.js` | `16,256` | `5ebad92b9bf99ea55ce2a5928e96a2623394a4575bf6a14a429efbdb99c7561b` |
| `source/live/w_biotech_fermenter_plasmid_lab.js` | `16,223` | `2b392cbd8c6d5f8ef5e6c8ebf842bffd37717ceb1609002b3e6187f71b017054` |
| `source/live/enhancements.js` | `125,869` | `312002ad9e5f88a3997b5610ae618edfb4bc66efb5f62343a6a5ee35053f1bc7` |
| `source/tests/ch15-preserved.json` | `203,133` | `2889631bd95f36f98b6b6c20b488f4202bc5a6e38d2224b1f0cac39ed8c3b2cb` |
| `source/tests/ch15_domain.mjs` | `12,448` | `425037a0666b749a4fcc2892cd7112391bf813ea23238d92ff6ee1540ae35e19` |
| `source/tests/qa_ch15.py` | `31,174` | `f3b495b0392318ebb80b458851bb2c197bf880065d9757dbb7b7c16a060385ca` |
| `source/tests/verify_ch15.sh` | `2,050` | `592bc848abd1a862fce02e3c25252a0fcfbc1af034feff93d45285f02b181449` |
| `source/tests/README-ch15.md` | `2,616` | `3e2271f6159b0dfa64bea109d08037e518260c925016f2746ce6f02fafd978b5` |
| `source/build/site/index.html` | `3,616,520` | `b7bd133a741560fc0bc55b6bbb7ab33fc97d93374ec0c55cdf364b277edb315a` |
| `source/build/site/sw.js` | `4,058` | `21a2373b4955cf8140c34f4f4a7430fa0597513b1fb1ed07f0d2e30701bf7b42` |
| `source/build/site/live/w_ecosystem_trophic_lab-KOJFMNSU.js` | `8,946` | `66176004570ea65d258ee56c45d2c6db2638195d7354831b72e6e0c9f7547780` |
| `source/build/site/live/w_nutrient_cycles_eutrophication-XN2IPZWD.js` | `9,317` | `faeed8bbd883a2a661ad02dcd244f74b0706a4f2ab3c875ecf5ec377fea09733` |
| `source/build/site/live/w_biotech_fermenter_plasmid_lab-7NHJA7JT.js` | `8,983` | `1e15e656e739ce1e5976418ff93efda83d0c148f01fb5cb085be3c8df5361186` |
| `/tmp/lt_bio_ch15/final/qa_ch15/print.pdf` | `38,062,487` | `aa7839548bfa48d551849ad132c5cefda2fc6fc81ddc37ce0138f08d3743517c` |

---

## 2. Automated Verification & Regression Summary (`verify_ch15.sh`)

Command executed:
```bash
cd /Users/amarsukhi/src/MyCode/kym_bio
BIO_CH15_VERIFY_OUT=/tmp/lt_bio_ch15/final ./source/tests/verify_ch15.sh
```

| Verification Step | Command / Script | Result | Evidence / Output |
| :--- | :--- | :--- | :--- |
| **1. Full Site Build** | `build.py --site build/site` | **PASS** | `index.html` (`3531.8 KB`, `16` chapters, `75` checks, `64` predictions, `107` terms, `47` live widgets); cache version `lw-f41361b0f7b4`; all lazy JS chunks `< 150 KB` (`w_ecosystem_trophic_lab` `8.7 KB`, `w_nutrient_cycles_eutrophication` `9.1 KB`, `w_biotech_fermenter_plasmid_lab` `8.8 KB`, shared `biosphere_biotech_model` chunk `15.3 KB`). |
| **2. Chapter 15 Domain Model** | `node tests/ch15_domain.mjs` | **PASS** | **`27,148` assertions passed** (`0` failures) across all `12` simulation modes (`sgnp_food_web`, `banyan_pyramid`, `human_diet_efficiency`, `sigmoid_growth`, `nitrogen_legumes`, `eutrophication_cascade`, `carbon_keeling`, `deforestation_impact`, `recombinant_insulin`, `industrial_fermenter`, `yeast_enzyme_biotech`, `gm_crops_crispr`), verifying the `10%` trophic rule (`10,000 → 1,000 → 100 → 10 → 1 kJ m⁻² yr⁻¹`), inverted banyan pyramid of numbers (`1 < 8,000`) vs upright biomass (`4,500 → 135 kg`) and energy (`45,000 → 4,500 kJ`), `9.1×` vs `1.9×` human dietary land capacity, `4`-phase sigmoid growth (`K = 680` at stationary `B = D`), nitrogen guild fluxes, `7`-step eutrophication DO/BOD hypoxia, Keeling `CO₂`/`CH₄` greenhouse forcing, deforestation soil erosion, `5`-step recombinant plasmid human insulin (`same restriction enzyme + DNA ligase`), `6`-parameter industrial fermenter cooling-jacket heat balance (`37.5 °C` vs `55 °C` denaturation), and enzyme/yeast biotechnology. |
| **3. Chapter 15 Acceptance Suite** | `tests/qa_ch15.py` | **PASS** | **`1,668` assertions passed** across preservation baseline (`350` files + base64 prefix of `live/enhancements.js`), provenance & sources (`20` primary/curriculum sources), story routing (`lindeman-chain-boyer-doudna-biosphere-biotech` with `0` prior collisions across Ch 0–14, plus preserved `p-ali`, `p-ammal`, `p-helmont`, `p-ingenhousz`, `p-pasteur`, `p-subbarow`, `banting-mahalanabis-lifelines`, `franklin-khorana-codebreakers`, `meselson-flemming-gurdon-divisions`, `mendel-morgan-sanghvi-inheritance`, and `darwin-wallace-luria-sahni-selection` linked in Chapter 15), `SVG_AUDIT` (`0` overlap/clipping across 9 plates × 5 widths × 3 themes), live widgets (`fig-15-1`, `fig-15-4`, `fig-15-8`, `window.ch15Issues == []`, tour steps `1–5`, cutaway toggles, trial capture/clear), and print PDF (`802` pages, `9` single-page figures on `pp. 617–673`, `0` console/page errors). |
| **4. Chapter 14 Regression** | `tests/qa_ch14.py` | **PASS** | **`1,664` QA assertions + `4,664` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch14_regression`). |
| **5. Chapter 13 Regression** | `tests/qa_ch13.py` | **PASS** | **`1,643` QA assertions + `34,346` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch13_regression`). |
| **6. Chapter 12 Regression** | `tests/qa_ch12.py` | **PASS** | **`1,926` QA assertions + `4,387` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch12_regression`). |
| **7. Chapter 11 Regression** | `tests/qa_ch11.py` | **PASS** | **`1,894` QA assertions + `2,713` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch11_regression`). |
| **8. Chapter 10 Regression** | `tests/qa_ch10.py` | **PASS** | **`1,857` QA assertions + `1,938` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch10_regression`). |
| **9. Chapter 9 Regression** | `tests/qa_ch09.py` | **PASS** | **`1,819` QA assertions + `620` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch09_regression`). |
| **10. Chapter 8 Regression** | `tests/qa_ch08.py` | **PASS** | **`1,890` QA assertions + `1,731` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch08_regression`). |
| **11. Chapter 7 Regression** | `tests/qa_ch07.py` | **PASS** | **`1,710` QA assertions + `2,046` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch07_regression`). |
| **12. Chapter 6 Regression** | `tests/qa_ch06.py` | **PASS** | **`1,441` QA assertions + `1,145` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch06_regression`). |
| **13. Chapter 5 Regression** | `tests/qa_ch05.py` | **PASS** | **`985` QA assertions + `18,133` domain cases passed** (`/tmp/lt_bio_ch15/final/qa_ch05_regression`). |
| **14. Full-Book Offline Smoke Test** | `livetest.py --offline` | **PASS** | `0` chunks loaded before tap; all `47` live figures + `3` explorers open cleanly; service worker ready; offline reload and offline widget launch verified; `0` console errors (`/tmp/lt_bio_ch15/final/full`). |

---

## 3. Print PDF Pagination Map (`/tmp/lt_bio_ch15/final/qa_ch15/print.pdf`, 802 pages)

- **Chapter 15 Opener & Section 15.1 (*Sunlit chains & the ten-percent tax: food webs, ecological pyramids and population growth*):** PDF pages `611–624` (`Figure 15.1` `c15_food_webs_trophic_pyramids` on p. `617`; `Figure 15.2` `c15_energy_budget_sigmoid_growth` on p. `621`).
- **Section 15.2 (*Atoms on loan: the water, carbon and nitrogen cycles*):** PDF pages `624–641` (`Figure 15.3` `c15_carbon_water_cycles` on p. `628`; `Figure 15.4` `c15_nitrogen_cycle_legumes` + companion story card on p. `633`; `:::home` *Inspecting legume root nodules at the kitchen sink* on pp. `637–638`).
- **Section 15.3 (*Footprints on the web: farming, deforestation, eutrophication and conservation*):** PDF pages `641–657` (`Figure 15.5` `c15_eutrophication_greenhouse_impacts` on p. `647`; `Figure 15.6` `c15_deforestation_conservation_sustainability` on p. `651`).
- **Section 15.4 (*Living factories & rewritable code: fermenters, plasmids, recombinant insulin and CRISPR*):** PDF pages `657–672` (`Figure 15.7` `c15_yeast_enzymes_industrial_fermenter` on p. `662`; `Figure 15.8` `c15_recombinant_plasmid_insulin_crispr` on p. `665`).
- **End-of-Book Synthesis & Capstone Close (`:::case` & `:::next`):** PDF pages `672–677` (`Figure 15.9` `c15_mumbai_creek_insulin_case` on p. `673`; `Case file 15: Three stations along the Mithi–Powai–Thane watershed and the Parel insulin fermenter` on pp. `673–676`; `:::next` full-book synthesis closing *The Living World* across all 16 chapters on pp. `676–677`).

---

## 4. Independent Gate Reviews

1. **Gate A (`source/gates/ch15-A.md`) — Facts, Models, Syllabus, Provenance & Preservation:**
   - **Reviewer:** Independent Gate A Subagent (`def6e473-b676-4558-8372-e4a11373ea06`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**
2. **Gate B (`source/gates/ch15-B.md`) — Reader Clarity, ≤ 3-Sentence Explain-Backs, Visuals, Story & Safety:**
   - **Reviewer:** Independent Gate B Subagent (`501699a4-66b3-40c8-a87c-be0965500797`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**

---

## 5. Local Handover Preview Server

A local HTTP server is running in the background serving `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and verified byte-for-byte against `source/build/site/index.html` (`3,616,520` bytes, SHA-256 `b7bd133a741560fc0bc55b6bbb7ab33fc97d93374ec0c55cdf364b277edb315a`):
- **Chapter 15 Direct Link:** `http://127.0.0.1:8805/index.html#ch15`
- **Section 15.1 & Live Widget (`fig-15-1`):** `http://127.0.0.1:8805/index.html#s15-1`
- **Section 15.2 & Live Widget (`fig-15-4`):** `http://127.0.0.1:8805/index.html#s15-2`
- **Section 15.3:** `http://127.0.0.1:8805/index.html#s15-3`
- **Section 15.4 & Live Widget (`fig-15-8`):** `http://127.0.0.1:8805/index.html#s15-4`
- **3D Master Code Explorer:** `http://127.0.0.1:8805/index.html#explore-code`
- **3D Living Cell Explorer:** `http://127.0.0.1:8805/index.html#explore-cell`
