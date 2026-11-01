# Chapter 7 — final local verification record

Completed locally on 30 October 2026. **PASS**: final reviewed source, build, Chapter 7 acceptance, unchanged Chapter 6/5 regressions and whole-book live/offline verification. Service-worker cache: **`lw-1fb964059709`**.

[Read Chapter 7](http://127.0.0.1:52870/index.html#ch7). The handover server was started locally and its HTTP response was compared byte for byte with the final built index. This is a local preview. No publication, deployment, commit, push, remote repository operation or hosted verification occurred.

## Delivered material and sequence

- `src/ch07.md`: **7,637 raw whitespace words**, including front matter, block labels, cards and hidden answers. Exactly four numbered sections, 7.1–7.4; nine Understand-it cards; four predictions and four section checks; two recalls; one clay/cool-dough geometry activity; a fictional gallbladder-removal reasoning case; and the bridge to Chapter 8.
- `figs_ch07.py`: **nine original registered SVG plates**, with meaningful alt text, semantic theme classes, labelled directions and explicit scale/model limits. Plates cover the canal and accessory ducts, epithelial boundary, peristalsis and tooth structure, compartment chemistry, protection, conserved-volume emulsification, molecular lipase chemistry, nested villus/microvillus structures and absorption routes.
- **Three manual 2D widgets**: `digestive_steps`, `emulsification` and `absorption_routes`, supported by the new `live/digestion_model.js`. Every widget has its matching original static plate, challenge requiring captured outcomes, numbers, cutaway, exactly five deterministic tour shots and model limits. These are manually selected explanatory states, without a physiological clock or invented absorption/rate coefficients.
- `src/stories/beaumont-st-martin.md`: **one new story, 990 raw whitespace words**, “What disappeared from the string?” It distinguishes the 1822 injury, 1825 experimental work and 1833 publication; examines apparatus, comparison and uncertainty; and treats St. Martin's contribution, discomfort and unequal relationship explicitly. Only the two proper names own automatic term links.
- Grounding, section/figure/story/model provenance, independent Gate A/B reports, immutable preservation baseline, independent domain oracle, browser acceptance, executable local runner and command documentation.

The required sequence was followed: preservation and actual-source grounding; paper-first SVG generation, rendering and inspection; declared widget models and rendered components; chapter and story prose; provenance, independent gates and final-book acceptance. Temporary galleries and fixtures supported earlier phase checks and did not replace final-book verification.

## Independent reviews

**Gate A PASS:** `gates/ch07-A.md`. **Gate B PASS:** `gates/ch07-B.md`. Both reviewers received fresh contexts and report-only ownership. Neither authored the chapter, story, figures, models or widgets. Each includes final independent confirmation against the frozen source and the final acceptance receipt, with **zero outstanding BLOCKER, FIX or CONSIDER findings**. Gate B includes exactly three sentences of explain-back for each numbered section.

Required corrections resolved: direct authoritative tooth-anatomy grounding was added; saved digestion endpoints now name the actual products; and the lipase explanation introduces the structure/change before relying on the name. Both optional Gate B suggestions were adopted: the activity specifies a chosen 3 cm starting ball, and the simplified lipid cartoon explicitly discloses omitted fatty-acid head-group atoms. Both grounding and provenance retain correction records.

The 13 reviewed source/test artifacts match `/tmp/lt_bio_ch07/final/artifact-hashes.json` exactly in bytes and SHA-256. The final chapter hash is `beb585fcc396c0839a0ba51563147f28af68dd58867e681c9f394efcbe32de89`; the final figure module hash is `0f1a48af8cda115378c6e2b686aa1fac0f0dc9fc5bdf524659992fb375593029`. Reviewer source/science approval and author-executed browser/visual acceptance are distinct evidence; reviewers do not claim image inspection or whole-book execution they did not perform.

## One local command and final receipts

From `/Users/amarsukhi/src/MyCode/kym_bio/source`:

```bash
./tests/verify_ch07.sh
```

The runner uses `set -euo pipefail` and `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`. It builds the site, runs Chapter 7 acceptance, runs the unchanged Chapter 6 and Chapter 5 scripts in separate receipt directories, and runs the whole-book live/offline smoke test. Any failed required step returns nonzero. `BIO_CH07_VERIFY_OUT` selects a separate receipt root; the README documents prerequisites and interpreter override. The old runners and historical receipts are preserved.

Final command: `BIO_CH07_VERIFY_OUT=/tmp/lt_bio_ch07/final ./tests/verify_ch07.sh`, aggregate log `/tmp/ch07-final-full.log`. The complete command exited **0** after all required steps.

| Final-build check | Result |
|---|---|
| Site build | Exit 0; eight chapters, 23 live widgets |
| Chapter 7 acceptance | Exit 0; **1,710 assertions**, **2,046 independent domain cases**, no browser console/page errors |
| Unchanged Chapter 6 acceptance | Exit 0; **1,441 assertions**, **1,145 independent cases** |
| Unchanged Chapter 5 acceptance | Exit 0; **985 assertions**, **18,133 independent cases** |
| Whole-book live/offline smoke | Exit 0; **23 live figures**, **three explorer mounts**, zero premature lazy chunks, service worker ready, successful offline reload/live opening and no application console/page errors |

Receipts are under `/tmp/lt_bio_ch07/final/`: `build.log`, `qa_ch07/report.json`, `qa_ch06_regression/report.json`, `qa_ch05_regression/report.json`, `full.log` and `full/`. The existing smoke script classified two software-GL performance notices as test-browser driver notes, not application errors. All acceptance cache values match **`lw-1fb964059709`**. The delivered index is **1,619,596 bytes**, below 4 MB; its SHA-256 is `73289146065a26750b1973c7dfda339db95ce593240e2dcc798f4f8568501184`. New lazy chunks are **3,382**, **3,414** and **3,411 bytes**, respectively, well below 150 KB. No new widget is imported before interaction.

## Browser and mathematical coverage

- All nine static SVGs at **390, 820, 1024, 1180 and 1440 px**, in **light, dark and sepia**: 15 combinations and 135 static-plate screenshots. Acceptance retained 227 named screenshots, plus native bitmap/PDF renders. Real SVG text and shape bounds, label collisions, arrow shafts against text, arrow markers and page overflow are checked.
- All three widgets in default and meaningful changed states on 390 px mobile and 1440 px desktop, in every theme. Instrumented browser Canvas `measureText` ink metrics check the whole logical bitmap; control bounds and actual native images supplement the fitted viewport.
- **108 recorded tour-state checks**, including out-of-order selection. Assertions inspect actual controls, cutaway state, selected route, stage and readout. Challenges remain incomplete when merely selecting controls or capturing only one required endpoint; saved products and comparison conditions retain their original values.
- Actual keyboard focus, manual controls, enlarged native drawings and keyboard panning when content overflows; full visibility when it already fits. Resize/theme changes retain state and repaint. Native folds are opened before focusing links inside them.
- No autoplay under normal or reduced motion; tours pause offscreen and on dynamic reduced-motion changes. The three widgets are deliberately 2D; no 3D camera requirement applies. They work with WebGL disabled, with zero new WebGL probes.
- JavaScript-off chapter prose and original figures; offline chapter loading and opening **and reopening every new widget offline**. Story card and automatic proper-name links, keyboard entry, Escape, direct story URL and offline opening are checked. No browser console/page errors were recorded.
- The independent domain oracle covers conserved 3D sphere volume, area and bounds; zero/nonfinite inputs; route and compartment material ledgers; saved-state immutability; representative water-inclusive atom/mass balance; and explicit deterministic tour control settings. It distinguishes droplet geometry from molecular hydrolysis and from an unmodelled biological rate.

Supplementary **18 meaningful route states** (two widths × three themes × three widgets) retained 36 fitted/native images: `/tmp/lt_bio_ch07/final/visual/extra-views.json`. These show triglyceride-product capture, all 216 droplets at maximum subdivision, and long-chain dietary material in the lacteal/lymph compartment. The author inspected their contact sheet and native examples. This targeted follow-up used the same frozen final build and does not substitute for the complete suite.

## Direct image and PDF inspection

The author inspected every original plate before implementing widgets, and inspected final-book static, default/changed live, enlarged/native and fallback images. Theme contact sheets and native-size views were used to assess arrowheads, anatomy, chemical connections, labels and clipping. Corrections included mobile control overflow, dark-theme outlines, explicit product identities and a protection-plate cell rectangle that extended beyond its viewBox. The last correction leaves eight whole schematic cells within the stated boundary; it makes no biological cell-count claim. The final suite includes shape-coordinate checks as well as text checks.

The final acceptance produced a **308-page whole-book verification PDF**. With all three new widgets open, the original SVGs are restored and the interactive stages are excluded. Every **complete** caption matches uniquely after reading-order/typography normalisation. The author viewed the contact sheet and all nine native rendered pages, including the final corrected protection plate:

| Plate | PDF page |
|---|---:|
| Canal and accessory routes | 221 |
| Epithelial boundary | 222 |
| Peristalsis and teeth | 229 |
| Compartment chemistry | 234 |
| Gut protection | 235 |
| Conserved-volume droplets | 240 |
| Lipase molecular connections | 243 |
| Folds, villi and microvilli | 248 |
| Capillary/portal and lacteal/lymph routes | 251 |

Evidence: `qa_ch07/print.pdf`, `print.txt`, `print-raw.txt`, `pdf-pages.json` and `pdf-<page>.png`; `visual/final-pdf-sheet.jpg`. The new story's **body does not print** in this PDF; cast/index/credit references are not counted as its body. Its web, direct-link, keyboard and offline routes are verified separately. This preserves the existing engine's story-print behaviour.

A separate fresh browser context exported the actual first PDF from each screen theme with all three widgets open: **12 supplementary checks**, three PDFs and nine rendered widget-backed plate pages. They confirm restored originals, all nine entire captions and readable paper/ink with computed light colour scheme. Evidence: `visual/print-restoration.json`, `first-export-{light,dark,sepia}.pdf` and `multiple-open-print-sheet.jpg`. These are same-build targeted print checks.

Earlier failed runs are not final-build passes. A real mobile label overflow was corrected by shortening “Marked material portions” to “Marked portions”, with the abstract unit retained in readouts. The harness was corrected to use reading-order text and normalise typography while requiring each entire caption, and to pass the `pdftoppm` scale argument as a string. A pre-pagination offscreen `is_visible` probe and an unnormalised SVG-title extraction initially suggested a print defect; actual PDF images disproved that inference. The temporary candidate print CSS was removed, and no shared print-engine change is delivered. The strengthened actual-export procedure passed on the frozen final build. Earlier complete and exploratory receipts are kept separately under `/tmp/lt_bio_ch07/` and are not substituted for this run.

## Preservation and authorised scope

`tests/ch07-preserved.json` captured **214 original files** before implementation, including the completed/corrected Chapter 6, corrected Helmont material, Chapter 5 print correction, old gate reports, old baselines, authorised-correction records and acceptance scripts. **213 remain byte-identical**. The only existing-file change is the addition of three enhancement entries in `live/enhancements.js`; reconstructing the exact original bytes passes both length and SHA-256 (`6afd885ab5da681e4e60bf3cd2e8b05c645a1eb41618b839817725a66d19dc76`). No entire file is exempted from preservation.

Completed Chapters 0–6 and their supporting source are preserved. No original baseline was regenerated, no old assertion weakened and no engine/CSS file changed. No new app CSS module exists; `app/p_print_figures.css` is absent. Final hash/preservation/HTTP checks are retained in `/tmp/lt_bio_ch07/final/final-preservation-http.json`.

No Git repository assumption or remote operation was made. No project `.github/workflows` triggers were found; none were created, enabled or dispatched. All verification ran locally.

## Source access and practical limits

Actual passages and experiment/page mappings are in `grounding/ch07.md` and `provenance/ch07.yml`. OpenStax Biology 2e, relevant Anatomy & Physiology material, NIDDK, actual MIT chemistry teaching, absorption reviews and Beaumont's digitised primary publication were examined. MIT is used for the chemistry it supports, not as invented evidence for anatomy or history. Original art and prose retain the generated OpenStax access footer and the recorded source-use decision; no source's terms are claimed waived.

Genuine limits remain explicit:

- Helander and Fändriks: PubMed abstract and metadata read, **subscription full text not read**. Adult mucosal-area estimates are qualified and are not measurements of Kym; the inherited tennis-court claim is not reproduced.
- Beaumont contract: archive catalogue read; manuscript download returned **403**. The relevant terms are supported through the archive curator's published scholarship, not a claimed direct reading of the inaccessible manuscript. Beaumont's actual published string/vial experiment pages were read in the digitised primary edition and inspected as page images.
- Official Cambridge **0610 2026–2028 version 3** was checked and mapped. The public **0893 overview** was accessible, but its full objective framework was not; no exact inaccessible 0893 objective wording/codes are claimed. The chapter does not claim to teach all diet and deficiency objectives. The later 2029 syllabus was distinguished rather than silently substituted.

The clay/cool-dough activity and school investigations received safety, feasibility and inference review. **They were not physically trialled.** Chosen dimensions and abstract model portions are not measured physiology. No elapsed-time model, clinical prediction or personal treatment/diet advice is supplied. No publication or deployment occurred.
