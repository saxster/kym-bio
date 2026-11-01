# Chapter 9 reader revision, 1 November 2026

Applied the Chapter 9 recommendations from the Chapters 6–10 editorial and independent scientific reviews. Kept the four-section chapter, Mumbai examples, scientific history and molecular explanations. Added pauses to trace circuits, membrane currents and chemical release separately; moved eye/auxin predictions before outcomes; shortened school bridges; corrected activity identification and household observation conditions.

Scientific repairs cover the unsupported hot-pan latency, three junctions in the drawn withdrawal route, typical rather than universal neural/endocrine timing, portal insulin delivery, excitatory chemical synapse scope, presynaptic regulatory receptors, TTX endplate vs whole-muscle response, consistent17mm effective reduced-eye model, directed auxin transport, gelatin/agar distinction and specified clinostat axis. These are carried through still figures, widget captions/limits, pure models, atlas descriptions, lesson metadata and checks.

Local evidence:

- `node source/tests/ch09_domain.mjs`: passed620 existing domain cases plus new assertions for junction count, synapse scope and reduced-eye power.
- `cd source && /Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python build.py --only 9 --out /tmp/ch09-reader-revision.html`: passed with provenance; no root generated artifacts touched.
- Playwright scoped browser check: all9 figure text boundaries at390 and1440px, all3 Chapter 9 widgets opening and capturing trials at both widths, zero page errors. Screenshots under `/tmp/ch09-widget-*-*.png`; manually inspected synapse response screenshot. A long synapse footer found during the desktop check was shortened and the check passed on rerun.
- `git diff --check` scoped to Chapter 9 files: passed.

Full integrated preservation, offline, print and regression verification is owned by the coordinator. No claim is made that the revised eye observations or plant activities have been physically trialled. No external CI, publishing or git commit was performed.

## Actual WebGL follow-up

The shared Atlas adapter could hide scene construction errors with a 2D fallback. Required actual WebGL and repaired Chapter 9 construction: imported shadeMat; supplied correct parent/axes to plot; supplied particle count/options and per-particle setters. All four stations now build and render in WebGL, including changed controls and 390 px resize. Cameras were widened after direct screenshot inspection; the voltage plot was lifted into view. Eye geometry now includes cornea, enlarged fovea marker, variable ciliary ring, zonules and adjustable iris aperture. TTX affects evoked transmitter particles. Regulatory receptor scope and reduced-eye power labels match the chapter. Shaded-side auxin enrichment is symmetric under reversed light while bend direction changes.

- `node source/tests/ch09_atlas_domain.mjs`: PASS (regenerated spike, blockade, bilateral light, reduced-eye power and pupil responses).
- `cd source && /Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python build.py --site /tmp/bio-atlas9-site` followed by `python tests/qa_ch06_10_atlas.py /tmp/bio-atlas9-site/index.html --chapters 9`: PASS: 4 actual WebGL stations; changed controls; mobile resize; no browser errors. Screenshots/report are under `/tmp/bio-ch06-10-atlas-qa`.
- Scoped diff check passes. No root generated artifacts were changed.
