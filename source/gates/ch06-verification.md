# Chapter 6 — final verification record

Completed locally on 30 October 2026. **PASS**, final service-worker cache **`lw-146167e256d1`**. No publication, deployment, commit, push, remote repository operation or hosted verification occurred.

[Read Chapter 6](http://127.0.0.1:54679/index.html#ch6). The local HTTP server was started for this handover and its returned index bytes were compared with the current build. Lazy widgets use HTTP, not a file URL.

## Delivered material

- `src/ch06.md`: four numbered sections, **6,303 raw whitespace words** including front matter, block labels, cards and hidden answers; approximately 5,900 teaching words. Six Understand-it cards, four predictions, four section checks, two recalls, one adult-managed idli observation, a waterlogged-root case and a digestion bridge.
- `figs_ch06.py`: six original registered SVG plates: ventilation/exchange/cellular chemistry; carbon/electron pathways; inner-membrane cutaway; two fat-mass accounts; carrier regeneration; drained/waterlogged roots. Original semantic-theme artwork, alt text, direction labels and explicit model limits.
- Three manual 2D widgets: `respiration_relay`, `oxidation_ledger`, `carrier_routes`, with the shared new `respiration_model.js`. Each has its original SVG and a challenge, numbers, cutaway explanation, exactly five deterministic tour shots and model limitations. No numerical rotor speed, coupling ratio or universal aerobic ATP yield is assigned.
- `src/stories/rotary-pointer.md`: one new energy-topic story, **768 raw whitespace words**, approximately 700 visible words. The four collaborators and the ATP-breakdown direction of the isolated F₁ experiment are explicit. Narrow term ownership avoids replacing earlier stories.
- `grounding/ch06.md`, `provenance/ch06.yml`, independent Gate A/B reports, persistent acceptance/runner and preservation baseline.

Grounding preceded figures; figures were rendered and inspected before widgets; widget models and rendered components preceded prose; provenance, gates and final acceptance followed. Temporary galleries/fixtures were used for component inspection, not substituted for final-book verification.

## Independent gates

**Gate A PASS:** `gates/ch06-A.md`. Zero BLOCKER, FIX or CONSIDER findings. Independent review covered source fidelity, arithmetic, history/collaborators, anatomical directions, models/conservation, fat accounting, physiological qualifications, attribution and preservation. Its final confirmation checks the exact final chapter hash:

`aef4257fb6b5cf9e64df080aa8057baebe1518f47b0c0ee0a7476d3511244f34`

**Gate B PASS:** `gates/ch06-B.md`. Zero BLOCKER/FIX; two optional CONSIDER findings. It includes exactly three sentences of explain-back for each section and independent home/school safety and inference review. Optional B1 was adopted: CO₂ collection alone cannot establish fermentation as the only pathway or absence of oxygen. Optional B2, shortening the pointer-story ending, was not adopted; the return to energy direction and evidence limits is deliberate. Both reviewers independently confirmed the final clarification. No required finding or confirmation remains pending.

Corrections and editorial decisions are recorded in both grounding and provenance. Reviewers owned only their reports and did not author the chapter, figures or widgets.

## One local verification command

From `/Users/amarsukhi/src/MyCode/kym_bio/source`:

```bash
./tests/verify_ch06.sh
```

The runner uses `set -euo pipefail`, the specified `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`, and fails if the site build, Chapter 6 acceptance, existing Chapter 5 acceptance or full-book live/offline smoke test fails. It preserves `verify_ch05.sh` and gives Chapter 5 a separate `BIO_CH05_QA_OUT` directory. Optional `BIO_CH06_VERIFY_OUT` selects the receipt directory.

The final complete run used `BIO_CH06_VERIFY_OUT=/tmp/lt_bio_ch06/final` and exited **0**:

| Final-build check | Result |
|---|---|
| Site build | Exit 0; 7 chapters, 20 live widgets |
| `tests/qa_ch06.py` | Exit 0; **1,441 assertions**, **1,145 independent formula/balance/model cases** |
| Existing `tests/qa_ch05.py` | Exit 0; **985 assertions**, **18,133 model cases** |
| `livetest.py build/site/index.html … --offline` | Exit 0; **20 live figures**, **3 explorer mounts**, zero premature lazy chunks and no console/page errors |

Receipts: `/tmp/lt_bio_ch06/final/build.log`, `qa_ch06/report.json`, `qa_ch05_regression/report.json`, `full_book_live.log`; aggregate log `/tmp/ch06-final-full.log`. Two software-GL performance notices were classified by the existing smoke test as driver notes, not application errors.

Index size: **1,456,025 bytes**, below 4 MB. New lazy chunks: relay **4,426 bytes**, ledger **4,196 bytes**, carrier routes **4,019 bytes**, each below 150 KB. Browser caches and both acceptance reports match `lw-146167e256d1`.

An earlier exploratory acceptance run stopped because it tried to focus an automatic story link inside a closed fold. The test was corrected to open the native summary first and also test the visible story card. Both keyboard routes now pass. This was a test setup correction, not a change to the app or a weakened assertion. Earlier fixture/build results are not represented as final-build acceptance.

## Browser and mathematical coverage

- All six static plates at **390, 820, 1024, 1180 and 1440 px**, in **light, dark and sepia**: 90 screenshots, actual SVG font bounds, text collisions, line/path arrow shafts against labels, visible markers and page overflow.
- All three widgets in default and changed states at mobile 390 and desktop 1440, in all themes. Actual Canvas font-ink bounds are instrumented for Chapter 6. Controls are checked against figure bounds, including hidden controls after closing.
- Every tour shot is checked against its actual tab, numerical stage/sample and readout, including out-of-order selection and explicit cutaway state. Challenges require the requested in-session endpoint inspections; a single endpoint or incorrect sample does not earn a comparison.
- Keyboard controls, full-size inspection, retained state and actual repaint after resize/theme changes while paused. No autoplay under normal motion; tours stop offscreen and when reduced-motion preference changes while open.
- JavaScript-off prose and all six original SVGs; actual WebGL-disabled browser with keyboard operation and zero Chapter 6 WebGL probes. No 3D camera requirement applies to these deliberately 2D accounts.
- Original SVG restored for print while a widget is open; computed light colour scheme, white paper and dark chapter/SVG ink from all three screen themes.
- Offline Chapter 6 loading, opening **and reopening all three widgets offline**, story opening offline, keyboard story entry/Escape and direct story URL.
- Independent formula parsing derives the fat equation's atom balance and mass ratios, with zero/boundary/nonfinite inputs, all carrier/relay states and no extra fermentation ATP. Energy transfer is not included in material counts. Formal per-reaction atom coefficients are explicitly distinguished from a selected kilogram sample.

Supplementary checks on the same final build passed **145 assertions** and exported **36 native 640 px Canvas images**: `/tmp/lt_bio_ch06/final/extra/report.json`, script `/tmp/ch06-final-extra.py`. Keyboard arrows pan enlarged live drawings. Static drawings are keyboard pannable on narrow screens and already fully visible in the wider dialog. This targeted follow-up does not replace the full-suite run. No delivered content changed afterwards.

## Direct visual and PDF inspection

The author inspected all six original plates at native size, mobile layouts, all-theme contact sheets, final-build widget default/changed states, enlarged native Canvas exports and WebGL-disabled states. This includes looking at arrowheads and labels against structures, not relying only on bounding rectangles. Pre-prose inspection corrected a carrier-arrow/title crossing, proton/soil label collisions and an overbroad root caption. The live return arrowhead was moved clear of the shaft that had overpainted it.

The final Chapter 6 acceptance generated a **258-page whole-book verification PDF**. Every new plate and its caption was visually inspected in both the contact sheet and native rendered page:

| Plate | PDF page |
|---|---:|
| Ventilation/exchange/cellular chemistry | 185 |
| Carbon and electron pathways | 192 |
| Inner-membrane cutaway | 194 |
| Fat mass accounts | 200 |
| Carrier regeneration | 206 |
| Waterlogged roots | 213 |

Evidence: `qa_ch06/print.pdf`, `print.txt`, `pdf-pages.json`, `pdf-sheet.jpg`, `pdf-<page>.png`; native Canvas exports/contact sheets in `extra/`, fitted-widget contact sheets in `qa_ch06/`. Figure titles are not reliably extracted as PDF text, so caption-page mapping was followed by actual image inspection. The complete rotary story body is **not printed** in this whole-book PDF; its web modal, keyboard/direct URL and offline routes were verified separately. No claim is made that a cast/index title means its body was printed.

## Preservation and scope

`tests/ch06-preserved.json` captured **199 pre-existing files** before authoring, including the corrected Helmont story, authorised-correction records, previous gate reports, old preservation baselines and Chapter 5 print fix. **198 files remain byte-identical.** The one shared-file addition is `live/enhancements.js`: removing exactly the three appended Chapter 6 entries reconstructs the original **30,551 bytes** and SHA-256, preserving its **30,548-byte prefix plus original closure**. No entire file is exempted. Completed Chapters 0–5, their support files and the shared engine/CSS remain unchanged. No original baseline or assertion was weakened or overwritten.

No Git repository assumption was made. No `.github/workflows` files were found in this project; none were created, enabled or dispatched. All verification was local.

## Source and practical limits

No unresolved required Chapter 6 verification issue remains. Source access limits remain explicit: Noji's original abstract/metadata, not its subscription full text; the 1965 idli paper's landing/abstract and an unread erratum, supplemented by a later starter-culture study; lactate tracer abstract and review abstracts; root-aeration abstract/indexed text; Lifson1949's oxygen-exchange evidence reported through the BMJ article rather than independently read. The complete publisher-formatted BMJ article was read through a mirror after publisher 403 responses. Its inconsistent intermediate average-formula arithmetic is recorded and not reproduced as a derivation; the explicitly chosen representative molecule's balance was independently recomputed. MIT and Nobel source-access routes and the official Cambridge 2026–2028 version 3 wording are recorded precisely in grounding/provenance.

Earlier Chapter 1 ATP quantities and discovery claims that these sources do not verify are recorded separately, preserved and not inherited into Chapter 6. The existing source-use decision remains documented; no source's terms are claimed waived.

The idli observation and school investigation designs received independent safety/feasibility review. **They were not physically trialled.** The observation portion is not eaten, vessels remain loosely covered/vented and no fixed biological rise, gas output, temperature optimum or time is promised. No publication or deployment occurred.
