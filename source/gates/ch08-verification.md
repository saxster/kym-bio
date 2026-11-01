# Chapter 8 — final local verification record

Completed locally on 30 October 2026. **PASS**: final reviewed source, build, Chapter 8 acceptance, unchanged Chapter 7/6/5 regressions and whole-book live/offline verification. Service-worker cache: **`lw-01edbfdee14d`**.

[Read Chapter 8](http://127.0.0.1:52880/index.html#ch8). The handover server was started locally and its HTTP response was compared byte for byte with the final built index. This is a local preview. No publication, deployment, commit, push, remote repository operation or hosted verification occurred.

## Delivered material and sequence

- `src/ch08.md`: **10,083 raw whitespace words** (`65,673` bytes, SHA-256 `9089725c6689bbd2a3c62f67156006b0abd75c95de77dad9cefc09dd16f1c81c`), including front matter, block labels, cards and hidden answers. Exactly four numbered sections (`8.1`–`8.4`); four Understand-it (`:::five`) cards; four predictions (`:::predict`) and four section checks (`:::check`); four evidence boxes (`:::evidence`); four misconception guards (`:::careful`); four curriculum bridges (`:::school`); two recalls (`:::recall 6` and `:::recall 2`); one safe seated breathing-rate and dead-space arithmetic activity (`:::home`); a fictional post-natal ventricular septal defect reasoning case (`:::case`); and the closing bridge to Chapter 9 (`:::next`).
- `figs_ch08.py`: **nine original registered SVG plates** (`42,491` bytes, SHA-256 `1cb3f7552df06371eaa08404d076cee59ea5faddf25215eb1ada573801df4ec6`), with meaningful alt text, semantic theme classes, labelled directions and explicit scale/model limits. Plates cover the conducting airways and mucociliary escalator (`c8_airway_mucociliary`), thoracic volume/pressure cycle and bell-jar critique (`c8_thorax_pressure_cycle`), alveolar-capillary gas exchange and brain CO₂ control (`c8_alveolar_exchange`), Harvey's 1628 lower bound vs modern cardiac output and forearm vein-valve experiment (`c8_harvey_evidence`), fish single vs mammalian double circulation and named organ vessels (`c8_double_circulation`), heart chambers, septum, valves and coronary supply (`c8_heart_cutaway`), artery/capillary/vein cross-sections and vascular continuity (`c8_vessel_comparison`), capillary filtration, lymph return, blood components and clotting (`c8_capillary_bed_blood`), and intact septum vs post-natal VSD left-to-right shunt (`c8_septal_defect_case`).
- **Three manual 2D widgets**: `breathing_gradients`, `double_pump` and `vessel_exchange`, supported by the new `live/circulation_model.js` (`14,140` bytes, SHA-256 `f240aed649417d1818cbc8f0bc728b6aace79b9fd00e5458d6f21963e34c2c32`). Every widget has its matching original static plate, challenge requiring captured outcomes, numbers, cutaway, exactly five deterministic tour shots and model limits. These are manually selected explanatory states, without autoplay clocks or unverified rate coefficients.
- `src/stories/harvey-circulation.md`: **one new story, 1,206 raw whitespace words** (`7,494` bytes, SHA-256 `5f6078657919b3cf7857bff23f7fa97a989d474bdae756649469c8334b5ab418`), “One drachm a beat, and a finger on a vein.” It distinguishes Padua study under Fabricius (1602), London Lumleian lectures (from 1616) and Frankfurt publication (1628); separates Harvey's Chapter IX conservative Troy/apothecaries' lower bound from modern metric cardiac output; credits Ibn al-Nafis, Realdo Colombo, Hieronymus Fabricius and Marcello Malpighi; and explicitly notes that seventeenth-century live-animal vessel pinching and tight arm ligatures are historical observations never to be repeated at home. Its five `terms:` (`De Motu Cordis, Hieronymus Fabricius, Marcello Malpighi, Realdo Colombo, Ibn al-Nafis`) have zero occurrences in Chapters 0–7.
- Grounding (`grounding/ch08.md`), section/figure/story/model provenance (`provenance/ch08.yml`), independent Gate A/B reports (`gates/ch08-A.md`, `gates/ch08-B.md`), immutable preservation baseline (`tests/ch08-preserved.json`), independent domain oracle (`tests/ch08_domain.mjs`), browser acceptance (`tests/qa_ch08.py`), executable local runner (`tests/verify_ch08.sh`) and command documentation (`tests/README-ch08.md`).

The required sequence was followed: preservation baseline and primary-source grounding; paper-first SVG generation, rendering and inspection; declared widget models and rendered components; chapter and story prose; provenance, independent gates and final-book acceptance.

## Independent reviews

**Gate A PASS:** `gates/ch08-A.md`. **Gate B PASS:** `gates/ch08-B.md`. Both reviewers received fresh contexts and report-only ownership. Neither authored the chapter, story, figures, models or widgets. Each includes final independent confirmation against the frozen source, with **zero outstanding BLOCKER, FIX or CONSIDER findings** (`0 BLOCKER · 0 FIX · 0 CONSIDER`). Gate B includes an **exactly three-sentence explain-back** for each of Sections 8.1, 8.2, 8.3 and 8.4.

Both optional Gate B suggestions (`CONSIDER B1` and `CONSIDER B2`) were adopted before final freezing:
- **B1 adopted:** Both `src/ch08.md` and `src/stories/harvey-circulation.md` explicitly remind the reader that Harvey's seventeenth-century snake vessel pinching and tight/medium arm ligatures are historical observations never to be reproduced on animals or with tight bands at home, and the three forearm valve steps in `src/stories/harvey-circulation.md` use third-person historical descriptions rather than imperative instructions.
- **B2 adopted:** In `src/ch08.md`, the second prose exclamation mark was replaced with a full stop (leaving a single exclamation mark in the chapter) and `"trying to return"` was replaced with `"returning under pressure"`; in `figs_ch08.py`, four box exclamation marks were replaced with clean punctuation.

The 15 reviewed source/test artifacts match `/tmp/lt_bio_ch08/final/artifact-hashes.json` exactly in bytes and SHA-256:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch08.md` | 70,877 | `baea4bac864de4ccc764f0fff62a4cb3cc044a58365ea4134816f5fc75daaa18` |
| `source/src/ch08.md` | 65,673 | `9089725c6689bbd2a3c62f67156006b0abd75c95de77dad9cefc09dd16f1c81c` |
| `source/src/stories/harvey-circulation.md` | 7,494 | `5f6078657919b3cf7857bff23f7fa97a989d474bdae756649469c8334b5ab418` |
| `source/figs_ch08.py` | 42,491 | `1cb3f7552df06371eaa08404d076cee59ea5faddf25215eb1ada573801df4ec6` |
| `source/provenance/ch08.yml` | 24,050 | `f7248ddb66200bd7a831757208932f0f558a29b15436233db170d087564d14e6` |
| `source/live/circulation_model.js` | 14,140 | `f240aed649417d1818cbc8f0bc728b6aace79b9fd00e5458d6f21963e34c2c32` |
| `source/live/w_breathing_gradients.js` | 7,125 | `77e75353c390c98e4d023e1d99e4e4011acbfc4ec4906448b9ef67b202e828e1` |
| `source/live/w_double_pump.js` | 6,897 | `9511ccd6b51f09887cb3b66b857f4aff388700ec17533e8a85ccedea387e2650` |
| `source/live/w_vessel_exchange.js` | 6,437 | `984ec1c80e503a31611c343152817564b2eae8244ea73235663c442b6738c7dd` |
| `source/live/enhancements.js` | 53,435 | `c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397` |
| `source/tests/ch08_domain.mjs` | 6,724 | `a36907652eb1e0532b3f4a6ae89651517bcf183ff3e92d3918235dad38a2b70a` |
| `source/tests/qa_ch08.py` | 21,904 | `c2fc7d247f161076b709c6bf187fb9e161d14b3e5b9c07bc97a994fa97fc9e82` |
| `source/tests/verify_ch08.sh` | 917 | `66a41b69bd06c4faee90a17bd7764794f973d986891ef1168dfbd2f514b0290e` |
| `source/tests/README-ch08.md` | 1,738 | `32245fd5875948d7e8d69ff43e7b9a43c50c9f5b8f64b56a711618cf78a41db3` |
| `source/tests/ch08-preserved.json` | 93,705 | `37cf3bf9f0d90311794dcc597b51690874fd6971d2cd22f37267d6a6d28ef016` |

## One local command and final receipts

From `/Users/amarsukhi/src/MyCode/kym_bio/source`:

```bash
./tests/verify_ch08.sh
```

The runner uses `set -euo pipefail` and `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`. It builds the site, runs Chapter 8 acceptance, runs the unchanged Chapter 7, Chapter 6 and Chapter 5 scripts in separate receipt directories, and runs the whole-book live/offline smoke test. Any failed required step returns nonzero. `BIO_CH08_VERIFY_OUT` selects a separate receipt root; `tests/README-ch08.md` documents prerequisites and interpreter override. The old runners and historical receipts are preserved.

Final command: `BIO_CH08_VERIFY_OUT=/tmp/lt_bio_ch08/final ./tests/verify_ch08.sh`. The complete command exited **0** after all required steps.

| Final-build check | Result |
|---|---|
| Site build | Exit 0; nine chapters, 26 live widgets |
| Chapter 8 acceptance (`qa_ch08.py`) | Exit 0; **1,890 assertions**, **1,731 independent domain cases**, no browser console/page errors |
| Unchanged Chapter 7 acceptance (`qa_ch07.py`) | Exit 0; **1,710 assertions**, **2,046 independent cases** |
| Unchanged Chapter 6 acceptance (`qa_ch06.py`) | Exit 0; **1,441 assertions**, **1,145 independent cases** |
| Unchanged Chapter 5 acceptance (`qa_ch05.py`) | Exit 0; **985 assertions**, **18,133 independent cases** |
| Whole-book live/offline smoke (`livetest.py --offline`) | Exit 0; **26 live figures**, **three explorer mounts**, zero premature lazy chunks, service worker ready, successful offline reload/live opening and no application console/page errors |

Receipts are under `/tmp/lt_bio_ch08/final/`: `qa_ch08/report.json`, `qa_ch07_regression/report.json`, `qa_ch06_regression/report.json`, `qa_ch05_regression/report.json`, `artifact-hashes.json` and `full/`. All acceptance cache values match **`lw-01edbfdee14d`**. The delivered index is **1,817,635 bytes**, well below 4 MB; its SHA-256 is `0a7b3094d550ef55ab3878205984299ba0ad7c2ab1358f53f0d2e873ca2f3433`. New lazy chunks are **5,297** (`w_breathing_gradients`), **5,071** (`w_double_pump`) and **4,865 bytes** (`w_vessel_exchange`), well below 150 KB. No lazy chunk is imported before interaction.

## Browser, print PDF and mathematical coverage

- All nine static SVGs at **390, 820, 1024, 1180 and 1440 px**, in **light, dark and sepia**: 15 combinations and 135 static-plate screenshots. Real SVG text and shape bounds, label collisions, arrow shafts against text, arrow markers and page overflow are checked.
- All three widgets in default and meaningful changed states on 390 px mobile and 1440 px desktop, in every theme. Instrumented browser Canvas `measureText` ink metrics check the whole logical bitmap across all states (`window.ch08Issues == []`).
- **108 recorded tour-state checks**, including out-of-order selection (`[4, 1, 3, 0, 2, 4]`). Assertions inspect actual controls, cutaway state, selected tab, sliders and readout. Challenges remain incomplete when merely selecting controls or capturing only one state; saved breath trials, pump states and vessel segments remain immutable after subsequent slider changes.
- Actual keyboard focus, manual controls, enlarged native drawings and keyboard panning when content overflows; full visibility when it already fits. Resize/theme changes retain state and repaint.
- No autoplay under normal or reduced motion; tours pause offscreen and on dynamic reduced-motion changes. All three widgets work with WebGL disabled, with zero Chapter 8 WebGL probes.
- JavaScript-off chapter prose and original figures; offline chapter loading and opening **and reopening every new widget offline**. Story card and automatic proper-name links, keyboard entry, Escape, direct story URL and offline opening are checked.
- The final acceptance produced a **354-page whole-book verification PDF** (`/tmp/lt_bio_ch08/final/qa_ch08/print.pdf`). With all three new widgets open, the original SVGs are restored and the interactive stages are excluded in print across all screen themes. Every complete caption matches uniquely on one PDF page:

| Plate | Function | PDF page |
|---|---|---:|
| 8.1 | `c8_airway_mucociliary` | 261 |
| 8.2 | `c8_thorax_pressure_cycle` | 263 |
| 8.3 | `c8_alveolar_exchange` | 268 |
| 8.4 | `c8_harvey_evidence` | 273 |
| 8.5 | `c8_double_circulation` | 278 |
| 8.6 | `c8_heart_cutaway` | 280 |
| 8.7 | `c8_vessel_comparison` | 288 |
| 8.8 | `c8_capillary_bed_blood` | 290 |
| 8.9 | `c8_septal_defect_case` | 293 |

## Preservation and authorised scope

`tests/ch08-preserved.json` captured **231 original files** before implementation, including completed Chapters 0–7, all stories, earlier gate reports, baselines, authorised-correction records and acceptance scripts. **230 remain byte-identical**. The only existing-file change is the addition of three enhancement entries (`breathing_gradients`, `double_pump`, `vessel_exchange`) in `live/enhancements.js`; reconstructing the exact original bytes passes both length (`44,489` bytes) and SHA-256 (`5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3`). No entire file is exempted from preservation, no original baseline was regenerated, no old assertion weakened and no shared engine/CSS file changed.

No Git repository assumption or remote operation was made. No project `.github/workflows` triggers were found; none were created, enabled or dispatched. All verification ran locally.
