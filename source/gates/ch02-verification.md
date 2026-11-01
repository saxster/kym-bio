# Chapter 2 delivery verification

30 October 2026. Local build only; no publication or commit requested.

## Completed deliverables

- Grounding: `grounding/ch02.md`, written first from fetched sources and research briefs, with explicit fidelity traps and recalculated numbers.
- Original SVG plates: `figs_ch02.py`, four registered figures. Theme classes only, accessible descriptions, scale limitations disclosed. No source artwork copied.
- Widgets: `cell_inventory`, `organelle_clues`, `sav_cubes3d`, each registered with a literal metadata object; three enhancement entries each include challenge, live numbers, cutaway, five shots and model-limits footnote. Shared `makeCanvas` added to lab kit; exact cube calculation in `cell_geometry.js`.
- Chapter: `src/ch02.md`, 5,402 whitespace-delimited words including blocks and metadata; sections 2.1–2.4, six complete 5+3 question cards, prediction/evidence ordering, school bridges, four checks, one recall, three safe home activities, case and next-chapter bridge.
- Cast: original `p-hooke.md` and `p-margulis.md`.
- Provenance: `provenance/ch02.yml`; all four sections contain ocw/openstax/research/history/figures/licence, and both stories have entries. Generated chapter contains the OpenStax access attribution.

## Independent gates

- Gate A: `ch02-A.md`, zero outstanding findings after independent recheck. All seven FIX and one CONSIDER addressed.
- Gate B: `ch02-B.md`, zero outstanding findings after independent recheck. Original one FIX and three CONSIDER addressed; all explain-backs and three home-activity safety/feasibility reviews pass.
- No known unsourced claims in the delivered chapter. Rejected the brief's fixed dye penetration/timing and blanket plant-cell inventory; replaced one-person 1967 proof claim with cumulative evidence and synthesis. No kitchen dye measurement was performed or claimed.

## Commands and results

Run from `/Users/amarsukhi/src/MyCode/kym_bio/source`:

```
/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python build.py --site build/site
/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -u livetest.py build/site/index.html /tmp/lt_bio
/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -u tests/qa_ch02.py
```

All exited **0** on final build cache **af062a32322b**. Index: **920.1 KB**. New widget chunks: **2.6 KB / 1.7 KB / 2.6 KB** (shared Three.js separate). No widget chunks loaded before a tap. All seven current book live figures and all three lazy explorers opened; no console errors. Software-renderer performance notices excluded by the existing harness.

Dedicated Chapter 2 QA: **242 assertions**, **15 viewport/theme combinations**, zero browser errors. Viewports: 390, 820, 1024, 1180, 1440 px; light/dark/sepia. All plate text remains in bounds with no text-label collisions and no document overflow. Default and changed states for every new widget captured at 390 and 1440 px in all themes. Cube controls test 11.5% volume fraction, zero and complete penetration; keyboard camera changes, manual tour steps, off-screen tour stopping, live reduced-motion preference changes, no-WebGL Canvas fallback, no-JavaScript chapter/plates and print SVG restoration all pass.

Artifacts: `/tmp/lt_bio/ch02-qa/report.json`, screenshot matrix, `no-js-390.png`, `no-webgl-390.png`, `chapter-print-check.pdf` (print check contains the current whole book). Visual review inspected static plates and changed lesson states. Corrected two visual defects found by eye: cube/heading contact and adjacent specialist labels. Cube 3D is fitted to a constant viewing width; its linked 2D section keeps a fixed centimetre scale.

## Integration fixes within authorised scope

- Existing Chapter 1 `w_seed_flame3d` called a nonexistent kit destroy method when a new 3D lesson opened. Removed that call; the shared API owns cleanup. Scene groups now belong to the kit root for proper disposal. Final complete livetest confirms the transition no longer throws.
- Linked Cell Explorer corrected mitochondrial mechanism, bacterial ancestry/ribosome wording, RNA export, and bacterial-vacuole exceptions; added scale disclosure, paused opening, off-screen rotation stop and keyboard/button turning.
- Shared tour respects reduced motion with manual steps, including preference changes during a tour; existing off-screen cleanup retained.
- Palette aligned with requested warm paper, sepia, dark slate and semantic accents; dark-theme contrast variants retained.

The dye activity is exploratory: tissue binding and permeability may prevent a clear boundary. The cube's sharp reached layer is an explicit geometric assumption, not a measured diffusion simulation or a claimed rate of starvation.
