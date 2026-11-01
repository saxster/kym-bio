# Chapter 5 — verification record

**Current status:** the user-authorised Helmont correction supersedes the initial-delivery receipt below. See [the follow-up verification](helmont-verification.md) for the current build, cache and results. The older story errors described in that initial receipt have been corrected.

## Initial-delivery receipt

Completed 30 October 2026. **PASS for the final build, cache `lw-997af0bb3fc4`.** No publication, deployment, commit, push or other remote repository operation occurred.

## Delivered chapter

- `src/ch05.md`: approximately **6,400 words** (6,423 whitespace-word matches including front matter, cards and block labels). Five numbered sections, seven Understand-it cards, five predictions, five reasoned hidden checks, two recalls, one home observation, a fictional sealed-terrarium case and Chapter6 bridge.
- `figs_ch05.py`: **seven original SVG plates**: historical mass ledger, gas-evidence comparison, chloroplast/atom-energy account, limiting-factor graph, representative leaf, xylem and phloem. Original art, semantic theme classes, meaningful alt text and explicit schematic limits.
- **Three manually controlled 2D widgets**, with original SVG counterparts and five-shot enhancements: `carbon_account`, `limiting_lab`, `sap_routes`. Every enhancement has challenge, yourNumbers, cutaway, five watch shots and idealised.
- `src/stories/p-ingenhousz.md`: one new cast story, approximately **700 words** (697 by the same count); no photographs or invented speech/private thoughts. Existing `p-helmont` retained unchanged.
- Grounding and numerical receipt in `grounding/ch05.md`; source mapping, credits, caveats and correction register in `provenance/ch05.yml`.
- Persistent acceptance script `tests/qa_ch05.py` and pre-change preservation baseline `tests/ch05-preserved.json`.

## Independent reviews and corrections

**Gate A PASS:** `gates/ch05-A.md`. Independent, fresh-context reviewer checked facts, actual source support, history, numbers, scientific figure/model integrity, attribution/licensing and preservation. Cumulative **three required fixes identified and resolved**, zero remaining blockers/fixes. Corrections: vessel-element end walls have perforation plates; scene distinguishes Priestley's1771 experiment from publication chronology; print colour-scheme override must defeat the explicit dark selector. Final author changes were independently confirmed, including actual Chromium print styles.

**Gate B PASS:** `gates/ch05-B.md`. Separate fresh-context reviewer supplied exactly three sentences of explain-back per numbered section and audited the home observation, all school proposals, evidence/inference boundaries, safety and qualitative feasibility. Zero blockers or required fixes. Optional gradient-energy bridge adopted; optional story pacing comment partly adopted by replacing editorial caution with an unresolved scientific question. Remaining pacing advice is optional. Final prose and print correction confirmed.

Both reports are report-only ownership: reviewers changed their reports; the author corrected chapter/art/style/grounding/provenance. Corrections appear in both grounding and provenance.

## Necessary shared changes and earlier-chapter preservation

Before authorship, SHA-256 hashes recorded **155 existing source/code/instruction/test files**; no Git assumption. Completed Chapters0–4, figures, stories, grounding, ledgers, widgets, tests and gate records remain byte-identical. Chapter4's baseline and verification report were not overwritten.

Two shared files have additions:

1. `live/enhancements.js`: only the three new entries appended before the final object closure. The acceptance script reconstructs and hashes the original object prefix/closure against the baseline; earlier entries are unchanged.
2. `book.css`: a **739-byte print-only semantic palette/background reset** appended. Visual inspection found the inherited screen dark palette printing pale text onto white paper and dark panel fills. The reset supplies readable ink/paper and `color-scheme: light !important` in print. This is necessary for the new plates' paper acceptance. The original stylesheet prefix hashes identically; no existing screen rule changed. Independent computed checks confirm dark screen styles still apply after leaving print. Print checks cover Chapters0,4,5 from all three themes.

All153 other baseline files are byte-identical. No shared JavaScript engine API, build logic, story parser, earlier chapter prose or source-use policy changed.

## Final-build commands and results

Run from `source/`, using `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`:

```text
python build.py --site build/site                                      exit0
python livetest.py build/site/index.html /tmp/lt_bio_ch05/final-full --offline  exit0
python tests/qa_ch05.py                                                exit0
```

The actual commands used the full interpreter path. Logs: `/tmp/lt_bio_ch05/final-build.log`, `final-live.log`, `final-qa.log`. The final full-book run opened **17 live figures and all three available explorer mounts**, found **zero lazy live chunks before interaction**, confirmed service-worker readiness/offline reload and reported **no console/page errors**. Two software-GL performance notices were classified by the existing smoke test as driver notes, not application errors.

Final Chapter5 acceptance: **939 assertions**, **18,133 domain-model cases**, **15 viewport/theme combinations**. Machine-readable receipt: `/tmp/lt_bio_ch05/qa/report.json`. The final cache in that receipt and built `sw.js` matches `lw-997af0bb3fc4`.

Earlier exploratory runs passed before final corrections; they are not represented as final-build verification. A dark-print defect was caught visually after those passes. Intermediate reruns were interrupted when reviewer feedback required the colour-scheme specificity correction. The three command results above are fresh completed runs after that final source correction. No chapter, figure, widget or stylesheet change followed them.

## Browser, interaction and mathematical coverage

- All seven SVGs at **390,820,1024,1180,1440px**, in **light,dark,sepia**: screenshots, actual SVG font bounds, pairwise text overlap, visible marker references, arrows against text and horizontal overflow.
- All three widgets in default and meaningful changed states at mobile390 and desktop1440, all themes; native screenshots and contact sheets directly inspected. Actual Canvas `measureText` ascent/descent/width bounds instrumented across controls/tour states.
- Manual keyboard buttons and arrow-key range changes; slider output/model synchronization; redraw and retained state after resize/theme change while open; nonzero paused Canvas dimensions; controls checked against the figure box so overflow-hidden cannot conceal clipping. Native image inspection prompted shortening the temperature label/output before the final build.
- Every one of each widget's five tour shots checked for its intended actual state, not only active buttons. The rate tour captures both requested trials. Control movement alone does not earn its challenge; confounded captured comparisons are flagged. Trial history survives changes in present conditions.
- Each widget opens still under normal and reduced motion. Tours stop offscreen and when reduced-motion preference changes while open; manual shots remain usable.
- JavaScript-off Chapter5 prose and all original SVGs; all three widgets with WebGL disabled. No3D camera requirement applies: these are deliberately2D accounts.
- Offline reload **at Chapter5**, then opening **and reopening each of its three widgets offline**, separately from the general full-book offline smoke check.
- Atom/full-equation formal mass invariants; bounded capacities and gross/net distinction; all18,081 allowed rate-slider combinations plus52 accounting cases. The thermal function, respiratory baseline and relative units are explicitly invented. No calibrated rate, bubbles, growth, transport speed or damage/recovery is claimed.
- No browser console/page errors. Index under4MB; each new widget chunk under150KB. The exact raw sizes are in the build log; each new widget is under3.4KB.

## Paper/PDF and direct visual inspection

The acceptance script generated a temporary whole-book **218-page PDF**, with a widget open and the original SVG restored by print styles. Print from light,dark,sepia explicitly computes light colour-scheme, white paper and dark readable chapter/SVG ink. It is a verification artifact, not a publication edition.

Every Chapter5 plate and caption was inspected in the final regenerated PDF, both as a contact sheet and at native rendered page size:

| Plate | PDF page |
|---|---:|
|5.1 ledger|150|
|5.2 gas comparisons|155|
|5.3 chloroplast/account|160|
|5.4 limiting factors|164|
|5.5 leaf|168|
|5.6 xylem|174|
|5.7 phloem|178|

Evidence: `/tmp/lt_bio_ch05/qa/print.pdf`, `pdf-pages.json`, `pdf-final-sheet.jpg`, `pdf-<page>.png`; static/native/live screenshots and three theme contact sheets in the same directory. Screen plate and live-widget layouts were inspected directly at native sizes as well as through sheets. Captions, gas/material directions, graph breakpoints, marker geometry, leaf cross-section versus surface inset, and separate source–sink arrows were considered; arithmetic and rectangle checks alone were not treated as visual proof.

## Source and practical limitations

No unresolved required Chapter5 factual or verification finding remains. Access limits are explicit: van Helmont through an attributed university-hosted translation, original historical mass standard unresolved (no metric conversion presented); Ingenhousz original Wellcome scan OCR examined after BHL direct403; de Saussure via scholarly historical analysis, not a claimed full reading of the French original;1941 ACS metadata/preview plus digitised original issue indexed text, not a purchased publisher full text. Exact source passages/grouping names and rejected inherited source shortcuts are in grounding/provenance. School bridges explicitly target **0610 2026–2028 version3**; the official page also lists2029, and examination year determines the syllabus. No invented0893 objective is claimed.

**Initial-delivery limitation, now resolved:** the old `p-helmont` story was originally retained with inaccurate conversions and an overstrong wood-mass conclusion. The user subsequently authorised correction. The story, provenance and Chapter5 term link are now corrected; see `helmont-verification.md` and the independent `helmont-A.md`/`helmont-B.md` reports. The original receipt above describes the earlier build, not the current one.

The one home task is observation of an attached familiar safe leaf. It and the proposed school comparisons received independent safety/feasibility review. **No home activity or school experiment was physically trialled.** No exact biological outcome is promised. The terrarium is explicitly fictional reasoning, not a verified famous bottle chronology. Models illustrate accounts and mechanisms; they are not calibrated biological predictions.

## Local reading handover

Verified HTTP200 from the newly started local server:

http://127.0.0.1:54678/index.html#ch5

Durable built artifact: `build/site/index.html`. Use HTTP for lazy widgets/service-worker support, not file://. Local server serves only this built directory. No publication or deployment occurred.
