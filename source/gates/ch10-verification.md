# Chapter 10 — Final Verification & Handover Record

**Chapter:** Chapter 10 — *Holding the Line in a Mumbai Summer* (Concluding Volume III: *The Human Orchestra*)
**Book:** *The Living World: Biology from the dry seed to the thinking brain* (Book 3)
**Verification Date:** 2026-10-30
**Overall Status:** **PASS (Gate A PASS · Gate B PASS · Local Acceptance & Ch 9/8/7/6/5 Regressions PASS)**

---

## 1. Frozen Build & Artifact Inventory (`artifact-hashes.json`)

All verification suites, visual inspections, and independent Gate A and Gate B reviews were executed against the frozen build in `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and `/tmp/lt_bio_ch10/final` (service worker cache version `lw-1e4ee3b367a1`):

| Artifact Path | Size (bytes) | SHA-256 Digest |
| :--- | ---: | :--- |
| `source/grounding/ch10.md` | `49,531` | `03c2e804937d43675dae0b9b2e286c880837ca61f520088aabbf39d2f4047f42` |
| `source/src/ch10.md` | `93,427` | `fe8c57c43756b032a6934ad6859531b0bdf3b10ef6271cba25b0c77dc0f01339` |
| `source/src/stories/banting-mahalanabis-lifelines.md` | `10,564` | `223b4da2850c4cfa93409b26df1fe48906ecd064f372017c129a819681fde299` |
| `source/figs_ch10.py` | `47,727` | `251af213f6792433ab96739e282a02b6b3fd016bd3fb849c5a6130b452135182` |
| `source/provenance/ch10.yml` | `27,177` | `43de7f20e626479a3cf3271dbe18c13f4585838c1baef9c151ccefaab49dcf40` |
| `source/live/homeostasis_model.js` | `21,616` | `55a5b89c1f3892eed7e7f97faabebc35d7a3625abb8ba8457ef35fb830f4d953` |
| `source/live/w_glucose_thermoregulation.js` | `12,103` | `480b221881521a53174d0c030c42395bbef9bea717743ec614efb7aaa07aa962` |
| `source/live/w_nephron_filtration.js` | `10,934` | `5e26b8bd3f526519b5171f2b35ba39e5917aae8272405fe01cc5b133807cc04a` |
| `source/live/w_immunity_vaccine_memory.js` | `14,484` | `eb29a1ccbad96d046486f429bda8506bc585ab0df7a8b1fcf3332da48f028da3` |
| `source/live/enhancements.js` | `72,327` | `fba7e18d6982dce2ba27bec47e3b3ee201d1f7b78618f428b8395f80dc614ef0` |
| `source/tests/ch10_domain.mjs` | `10,634` | `12c6c883f91b172df8986052974e3c9a68170d3644a9069d69561cc82a99df0c` |
| `source/tests/qa_ch10.py` | `30,796` | `a46bc989f1f9d99bc41c8942f07db313ce60785ee0f7d647164b61e698889c00` |
| `source/tests/verify_ch10.sh` | `1,406` | `ed5e9cf52fa7b1666075de06ea4ad4559c113f568cce996f3a7538cdb21a2b92` |
| `source/tests/README-ch10.md` | `2,128` | `cd905398bd0d02a69543475de217a6f9c3c613e893874ff429ca818cdfed66e1` |
| `source/tests/ch10-preserved.json` | `123,001` | `5a56557ec103a28326cc5c37aec62ecc42f13d12eeac8226c250e97eff86f2a6` |
| `source/build/site/index.html` | `2,299,027` | `59619f1523123aa0fcee3172641841a1bfd0b27c5b9ee749f33776ea74c680d0` |
| `source/build/site/sw.js` | `3,169` | `3bb7f0c8cf201e6e8ad4db25e4fb3980da578336a5db2d703db85033a3b75b68` |
| `/tmp/lt_bio_ch10/final/qa_ch10/print.pdf` | `23,084,292` | `859c0b691883294fbe047ba274cacd35583b167c72895c71c13bd09825d85dd5` |

---

## 2. Automated Verification & Regression Summary (`verify_ch10.sh`)

Command executed:
```bash
cd /Users/amarsukhi/src/MyCode/kym_bio/source
BIO_CH10_VERIFY_OUT=/tmp/lt_bio_ch10/final ./tests/verify_ch10.sh
```

| Verification Step | Command / Script | Result | Evidence / Output |
| :--- | :--- | :--- | :--- |
| **1. Full Site Build** | `build.py --site build/site` | **PASS** | `index.html` (`2245.1 KB`, `11` chapters, `55` checks, `44` predictions, `99` terms, `32` live widgets); cache version `lw-1e4ee3b367a1`; all lazy JS chunks `< 150 KB` (`w_glucose_thermoregulation` `6.6 KB`, `w_nephron_filtration` `6.1 KB`, `w_immunity_vaccine_memory` `7.6 KB`, shared `homeostasis_model` chunk `9.7 KB`). |
| **2. Chapter 10 Domain Model** | `node tests/ch10_domain.mjs` | **PASS** | **`1,938` assertions passed** across blood glucose feedback (`5.0 mmol/L` set point, post-mango insulin storage, fasting glucagon recovery, untreated Type 1 diabetes `>= 15.0 mmol/L` spilling above `T_m = 10.5 mmol/L`, insulin therapy), skin thermoregulation (`L_v = 2,420 J/g`, Stull 2011 wet-bulb `38 °C / 20% RH` vs `38 °C / 80% RH` wet-bulb `34.8 °C`, `15 °C` vasoconstriction + shivering), nephron mass balance (`180 L/day` filtrate, `0.00` protein, `100%` glucose reabsorbed below `T_m`, `99.17%` water reabsorbed to `1.5 L/day`, `67×` urea concentration, dehydration, high-protein deamination, diabetic glycosuria), and immunity/cholera kinetics (primary vs secondary memory surge, `100%` vs `0%` lock-and-key specificity, passive decay `t_1/2 = 21 d`, ORS reversal of cholera fluid loss). |
| **3. Chapter 10 Acceptance Suite** | `tests/qa_ch10.py` | **PASS** | **`1,857` assertions passed** across preservation baseline (`265` files), provenance & sources, story routing (`banting-mahalanabis-lifelines` with 0 prior collisions across Ch 0–9), `SVG_AUDIT` (`0` overlap/clipping across 9 plates × 5 widths × 3 themes), live widgets (`fig-10-2`, `fig-10-5`, `fig-10-7`, `window.ch10Issues == []`, tour steps `1–5`, cutaway toggles, trial capture/clear), and print PDF (`474` pages, `0` single-line figure splits, `0` console/page errors). |
| **4. Chapter 9 Regression** | `tests/qa_ch09.py` | **PASS** | **`1,819` QA assertions + `620` domain cases passed** (`/tmp/lt_bio_ch10/final/qa_ch09_regression`). |
| **5. Chapter 8 Regression** | `tests/qa_ch08.py` | **PASS** | **`1,890` QA assertions + `1,731` domain cases passed** (`/tmp/lt_bio_ch10/final/qa_ch08_regression`). |
| **6. Chapter 7 Regression** | `tests/qa_ch07.py` | **PASS** | **`1,710` QA assertions + `2,046` domain cases passed** (`/tmp/lt_bio_ch10/final/qa_ch07_regression`). |
| **7. Chapter 6 Regression** | `tests/qa_ch06.py` | **PASS** | **`1,441` QA assertions + `1,145` domain cases passed** (`/tmp/lt_bio_ch10/final/qa_ch06_regression`). |
| **8. Chapter 5 Regression** | `tests/qa_ch05.py` | **PASS** | **`985` QA assertions + `18,133` domain cases passed** (`/tmp/lt_bio_ch10/final/qa_ch05_regression`). |
| **9. Full-Book Offline Smoke Test** | `livetest.py --offline` | **PASS** | `0` chunks loaded before tap; all `32` live figures + `3` explorers open cleanly; service worker ready; offline reload and offline widget launch verified; `0` console errors (`/tmp/lt_bio_ch10/final/full`). |

---

## 3. Print PDF Pagination Map (`/tmp/lt_bio_ch10/final/qa_ch10/print.pdf`, 474 pages)

- **Chapter 10 Opener & Section 10.1 (*Why the body needs set points: negative feedback, insulin, glucagon, and Type 1 diabetes*):** PDF pages `344–356` (`Figure 10.1` `c10_negative_feedback_glucose` on p. `350`).
- **Section 10.2 (*Skin, sweat, and the Mumbai wet-bulb ceiling: thermoregulation at 37 °C*):** PDF pages `356–367` (`Figure 10.2` `c10_skin_thermoregulation` on p. `358`; `Figure 10.3` `c10_mumbai_heat_balance` on p. `363`; `:::home` *Two tumblers and a handkerchief* on p. `366`).
- **Section 10.3 (*Cleaning the internal bath: liver deamination and the two-stage kidney nephron*):** PDF pages `367–378` (`Figure 10.4` `c10_liver_excretion_urea` on p. `369`; `Figure 10.5` `c10_kidney_nephron_ledger` on p. `374`; `:::home` *Kitchen sieve and rescue* on p. `377`).
- **Section 10.4 (*Holding the border: pathogens, barriers, cholera, active vs passive immunity, and vaccines*):** PDF pages `378–391` (`Figure 10.6` `c10_pathogens_barriers_cholera` on p. `382`; `Figure 10.7` `c10_immune_response_vaccines` on p. `385`; `Figure 10.8` `c10_active_vs_passive_immunity` on p. `388`).
- **End-of-Chapter Synthesis & Volume IV Bridge (`:::case` & `:::next`):** PDF pages `392–396` (`Figure 10.9` `c10_diabetes_renal_case` on p. `392`; `Case file 10: The sweet urine and the innocent filter` on pp. `393–396`; `:::next` bridge to Volume IV / Chapter 11 on p. `396`).
- **Back Matter:** Glossary (`pp. 418–429`), Predictions & Check-yourself answer keys (`pp. 442–449`), and Sources & Provenance (`pp. 455–474`).

---

## 4. Independent Gate Reviews

1. **Gate A (`source/gates/ch10-A.md`) — Facts, Models, Syllabus, Provenance & Preservation:**
   - **Reviewer:** Independent Gate A Subagent (`ae312a0d-a4c2-4c46-9c7c-4c3d9176546f`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**
2. **Gate B (`source/gates/ch10-B.md`) — Reader Clarity, ≤ 3-Sentence Explain-Backs, Visuals, Story & Safety:**
   - **Reviewer:** Independent Gate B Subagent (`fd1c5d51-00b0-41f7-8528-4e3d183e62ac`)
   - **Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**

---

## 5. Local Handover Preview Server

A local HTTP server is running in the background serving `/Users/amarsukhi/src/MyCode/kym_bio/source/build/site` and verified byte-for-byte against `source/build/site/index.html` (`2,299,027` bytes, SHA-256 `59619f1523123aa0fcee3172641841a1bfd0b27c5b9ee749f33776ea74c680d0`):
- **Chapter 10 Direct Link:** `http://127.0.0.1:8795/index.html#ch10`
- **Section 10.1:** `http://127.0.0.1:8795/index.html#s10-1`
- **Section 10.2 & Live Widget (`fig-10-2`):** `http://127.0.0.1:8795/index.html#s10-2`
- **Section 10.3 & Live Widget (`fig-10-5`):** `http://127.0.0.1:8795/index.html#s10-3`
- **Section 10.4 & Live Widget (`fig-10-7`):** `http://127.0.0.1:8795/index.html#s10-4`
