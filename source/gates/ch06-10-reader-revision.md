# Chapters 6 to 10 reader revision

Implemented 1 November 2026 from the detailed editorial review. The five-chapter sequence, historical stories, Mumbai examples and molecular depth are preserved. Source counts after revision: 6,614 / 7,790 / 10,164 / 10,843 / 13,220 words.

The revision covers chapter prose, captions, figures, 2D models and widgets, 3D Atlas models and descriptions, lesson metadata, guided tours, grounding, provenance, linked stories and checks. Scientific corrections include capillary fluid return, exercise breathing, neural timing and synapses, the TTX case, renal rates and diagnostic inference, immune protection and thermal limits. Teaching changes include causal sequencing, pauses, meal tracing, folded extensions, improved predictions, shorter school bridges and a cross-chapter synthesis.

The kidney example stipulates a 330 mg/min recovery capacity and 125 mL/min GFR. At 16 mmol/L glucose, 360 mg/min filters and 30 mg/min is excreted, or 43.2 g/day. The 3.8 L/day urine value is an observation in the case, not a prediction from glucose alone. Live models use the same dimensional account; model assumptions are explicit.

Independent chapter receipts are in `ch06-ch07-reader-revision.md`, `ch08-reader-revision.md`, `ch09-reader-revision.md` and `ch06-10-independent-final-review.md`. The coordinator resolution is distinguished from the independent findings. Practical activities have improved procedures and inference limits; they have not been physically trialled, and reader understanding still benefits from testing with Kym.

## Local verification

Run `source/tests/verify_ch06_10_revision.sh` from the repository root. The default creates a fresh temporary directory; optionally set `BIO_READER_VERIFY_OUT` to a fresh destination. It copies the current working book into an isolated snapshot, builds all sixteen chapters, runs all five chapter domain/browser/print acceptance suites requires actual WebGL at all twenty Atlas stations, checks paused mobile redraw, and runs the whole-book offline smoke check. It fails if a required step fails. All work runs locally; the command neither pushes source nor publishes the site.

Historical preservation manifests are unchanged. The revision hash manifest explicitly records updated files, including retained earlier chapter changes; unlisted files continue through their historical checks. The immutable snapshot prevents unrelated concurrent edits from invalidating a browser run halfway through it.

## Final chapter acceptance evidence

Command: `BIO_READER_VERIFY_OUT=/tmp/bio-ch06-10-complete source/tests/verify_ch06_10_revision.sh`.

| Chapter | Acceptance assertions | Result |
| --- | ---: | --- |
| 6 | 1,439 | pass |
| 7 | 1,706 | pass |
| 8 | 1,886 | pass |
| 9 | 1,815 | pass |
| 10 | 1,853 | pass |

All five reports use the same frozen build, cache `lw-16fe6e9ae30f`. They cover the relevant static-figure viewport/theme matrices, interactive states, saved trials, keyboard behaviour, print captions and browser errors, as well as the chapter domain checks. Chapter 10 has 1,945 domain assertions including explicit rate-ledger and Day 0 memory regressions.

Reports: `/tmp/bio-ch06-10-complete/qa_ch06/report.json` through `qa_ch10/report.json`. The current repository entry point `index.html` was also rebuilt locally with all sixteen chapters; no publication or source push was performed.

The one-command local runner completed successfully: `PASS: Chapters 6–10 build, domain, browser, print, WebGL and offline checks.` Whole-book smoke opened all 63 live widgets and the three additional explorers; the service worker became ready, offline reload opened the book and a live figure, and there were no console errors. Receipt: `/tmp/bio-ch06-10-complete/offline.log`.

## Actual WebGL and final delivery refinements

The additional actual-WebGL gate found legacy scene construction failures that older tests accepted through a silent 2D fallback. Chapters 6–10 now import and call the existing engine primitives correctly. Representation repairs remove unsupported ATP/speed claims, distinguish droplets and micelles, draw the stated chamber schematic, connect TTX and accommodation controls to visible geometry, and share the Chapter 10 antibody curves with the 2D model.

A paused-resize regression was reproduced before repair: after the transient interaction loop expired, resizing cleared the canvas without scheduling another draw. The book adapter now requests paused redraws on resize and visibility changes, with observer cleanup on destroy. Its regression waits 1,800 ms before resizing, then requires new WebGL draw calls. This does not advance the paused simulation clock.

All 20 actual WebGL stations passed desktop/control/mobile checks in the full acceptance run. The final minor refinements widened and centred Chapter 10's antibody camera, removed an undrawn SGLT1 claim from its alt text, corrected the Chapter 9 total-delay caption and called the ORS percentage a support control. The primary-memory staging rule is explicitly chosen. These refinements did not change chapter prose or numerical behaviour.

After these refinements, rebuilt `/tmp/bio-ch06-10-delivery` (cache `lw-2c902cae2b03`) and reran all 20 actual WebGL stations: pass, no browser errors. Final report and screenshots: `/tmp/bio-ch06-10-atlas-qa-6-7-8-9-10/report.json`; log: `/tmp/bio-ch06-10-delivery-atlas.log`. Separately inspected Chapter 10's mobile graph after the camera change; its full axes and endpoints are contained. Current Atlas 9 model regressions and all 1,945 Chapter 10 domain assertions passed again. Checked both delivery and workspace artifacts contain the final captions/camera and omit the obsolete ORS dose phrase. The local repository book was rebuilt after these changes.

The independent science follow-up in `ch06-10-independent-final-review.md` confirms findings A–E resolved and passes its bounded source/model agreement review. This is separate from the browser and offline evidence above. No physical household trial or Kym comprehension trial is claimed. No hosted CI, publication, commit or push was performed.

## Commit preparation

The commit candidate was exported from the staged Chapters 6–10 sources over the preceding Chapters 1–5 commit, preserving the previous committed Chapters 11–15. The shared enhancement table was staged only through Chapter 10. Its generated HTML, service worker and lazy bundles were rebuilt from this exact scoped tree, rather than copying the working site's concurrent later-chapter revisions. All 89 referenced bundles resolve. Fresh Chapter 7–10 domain suites and Atlas 9 regressions passed in that exported tree; Chapter 6's formula cases are part of its already-passed acceptance suite rather than a separate domain file. Staged whitespace checks passed.
