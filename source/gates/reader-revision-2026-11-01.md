# Chapters 1–5 reader revision

Implemented 1 November 2026. Scope: chapter text, Chapter1 still figures and two original live widgets, all five Atlas chapter modules and their lesson metadata, the linked SubbaRow story, grounding and provenance. Numbered section and figure IDs were retained.

## Changes

- Chapter1 corrects monsoon life histories, seed mobility, hydration arithmetic, thermodynamics, ATP coupling/discovery, dormancy/growth/reproduction scope, viral machinery, antibiotic examples, scientific names and Viking uncertainty. All five sections now have checks. Home activity makes observable promises only.
- Chapter2 sequences boundary/information/energy before cards, adds a specimen comparison, connects cell geometry with whole-body supply, and makes dough geometry primary.
- Chapter3 stages equal-pressure osmosis, resisting pressure and water potential, separates optional thermal arithmetic, and shows the root energy relay explicitly.
- Chapter4 stages molecular ideas, aligns the starch evidence, offers advanced geometry as optional detail, follows a lactase cycle, and compares five food tests.
- Chapter5 follows carbon separately from energy and water, supplies chosen net-gas arithmetic, and separates photosynthesis/rate limitation and xylem/phloem mechanisms.
- Atlas descriptions now distinguish chosen model quantities from measurements. Fixed missing material imports and incorrect molecule, particle, plot, surface and object-update API calls. Corrected lesson-to-page mappings. Tests require actual WebGL, so silent fallback no longer counts as 3D success.

## Local verification

- Chapter2:242 assertions and15 viewport/theme combinations pass.
- Chapter3:253 assertions and15 viewport/theme combinations pass.
- Chapter4: all behavioural checks pass, including domain cases, mobile/theme figure checks, keyboard/state/canvas checks, print, offline reopening and disabled-WebGL. The final historical preservation guard fails because eight Chapters1–3 files were intentionally revised. The fixture was not rewritten. A fixed150ms reduced-motion delay was replaced with a bounded wait for the required stopped-tour state.
- Chapter1: five plates at390/1440px across three themes; no bounds/overflow/page errors. All five Atlas links at two widths select correct pages and render actual3D. Camera framing visually checked.
- Hydration model: all12 slider settings conserve45g non-water material within rounding; endpoints50g at10% and128.6g at65%; mass increases monotonically.
- Chapters1–5 original live figures plus three explorers pass the combined browser smoke; offline reload and reopening a live widget pass; no console errors.
- Independent chapter receipts: ch01-reader-revision.md, ch02-ch03-reader-independent.md, ch04-reader-revision-verification.md, ch05-reader-revision.md and ch05-reader-revision-review.md.

Reusable local command: `BIO_PYTHON=/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python bash source/verify-reader-revision.sh`. It builds, tests hydration invariants, requires real3D in all20 Atlas stations, and runs the live/offline smoke. It fails on any check failure. No hosted CI was used.

## Final artifact

Final full-book build passed: `/tmp/bio-reader-delivery-final.log`. Its output (`/tmp/bio-reader-delivery-final`) was installed at the repository root. `index.html`, `live/` and `sw.js` include all final Chapters1–5 changes. Local full-book preview: http://127.0.0.1:54931/index.html#ch1 . The independently built scoped review edition remains at http://127.0.0.1:54932/index.html#ch1 and `source/build/reader-revision/index.html`; its five chapter sources and Atlas modules were compared byte-for-byte with the normal source.

Concurrent work temporarily introduced a Chapter10 prediction-block error, subsequently resolved by that work, and a missing comma at `source/live/w_ecosystem_trophic_lab.js:191`. A single comma was added after the existing template literal to unblock the final full build; no biological content in that widget was changed by this task. Node syntax check passed. Concurrent source edits outside the requested chapters were otherwise preserved.

Strict regression passed all20 Atlas stations, changed controls, mobile resize and actual WebGL with no browser errors (`/tmp/bio-reader-root-final-atlas.log`). Subsequent camera-only changes in Chapters2/5 passed another8-station actualWebGL run; full cube/curve and chloroplast/glucose assemblies were directly inspected. Chapter1's five lesson routes and camera framing were independently inspected at two widths.

The combined Chapters1–5 smoke and full live/explorer smoke both passed with no console errors. Final scoped artifact offline reload and live reopening passed (`/tmp/bio-reader-isolated-final-offline.log`). Final source/output whitespace check passed. The final index remains below4MB.

No physical kitchen trial or learner trial was performed. No hosted verification job was created or run. No commit, push or deployment was requested or performed.
