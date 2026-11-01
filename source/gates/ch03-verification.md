# Chapter 3 completion and verification — 30 October 2026

## Delivered

- Grounding written before the four SVG plates, then four widgets and enhancement entries, then chapter/stories, then complete provenance.
- `src/ch03.md`: four numbered sections following the prediction/evidence/mechanism/card/misconception/school/check spine; two home activities; two recalls; hidden-reasoning sailor case; Chapter 4 bridge.
- `figs_ch03.py`: c3_diffusion, c3_water_gate, c3_cells, c3_root_routes. Original theme-aware SVGs with descriptive alternatives and no copied source art.
- Canvas widgets: diffusion_membrane, water_potential, root_transport. osmosis_cells uses optional Three.js spatial inspection plus an always-available Canvas comparison. All include challenge, live numbers, cutaway description, five tour shots and model limitations.
- Cast stories: p-agre and p-skou, each over 500 words, verified dates and collaborators, no invented dialogue or emotional scene.
- `provenance/ch03.yml`: ocw, openstax, research, history, figures and licence for all four numbered sections, plus figure and story records. Added primary nitrate/proton flux experiment and original Skou paper.

## Independent gates

Gate A (`ch03-A.md`): no blockers. Both required fixes resolved: appose plant membranes to the wall except in plasmolysis; correct Cambridge topic mapping to 3.1/3.2/3.2/3.3. Suggested direct nitrate/proton primary citation added.

Gate B (`ch03-B.md`): final confirmation gives no outstanding required fixes. Added a concrete lid/pressure example and water-potential zero reference, electrical provisos in active-transport definitions and opening, explanation of kᵦ/T, and whole-gram scale limitation. Two optional story pacing suggestions retained as editorial choices.

No known UNSOURCED science/history claims remain. Research leads rejected: unverified misconception prevalence percentages, guaranteed potato lengths, guaranteed visible dye rate, salt suction, and direct ATP-powered water/nitrate-pump shortcuts.

## Executed checks

All commands use `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python` from `source/` unless noted.

- `build.py --site build/site`: exit 0; all provenance present; OpenStax access footer visible. Final index about 1.03 MB; Chapter 3 widget chunks about 1.7–3.2 KB, below 150 KB; shared Three.js remains separately bundled. Final service-worker cache `3a320d23c458`.
- `livetest.py build/site/index.html /tmp/lt_bio`: exit 0; all 11 book widgets and available explorers opened; no chunks before a tap; no console errors.
- Full `livetest.py ... --offline`: exit 0; service worker ready; offline reload succeeded and a widget opened offline; no console errors. Subsequent changes were label positioning only, checked by targeted narrow-screen live tests on the final build.
- `tests/qa_ch03.py`: exit 0, 253 assertions across 15 viewport/theme combinations (390, 820, 1024, 1180, 1440 × light/dark/sepia). All four static plates checked for text clipping/collisions. Default and changed widget states captured on mobile/desktop in all themes. Manual tours, no autoplay, off-screen pause, reduced motion, keyboard camera, print SVG, JavaScript-off prose/SVG and WebGL-off Canvas verified.
- Node domain checks: 27,000 random-walk steps over multiple seeds/starting distributions, total 100 particles throughout, exact identity initial-left − current-left = rightward − leftward crossings, reflected boundaries, no transfer through closed divider; pressure account entry/balance/reversal. Independent Gate A also ran 120 conservation trials.
- Ledger/card structural checks: all four section records include all required fields; four predictions/checks/cards; every card has five core questions and three deeper questions.
- Final SVG arrow audit: every arrow has a visible theme stroke and defined arrowhead. Visual inspection caught missing arrow colour names and a label crossing the root pathway; both corrected. Final mobile live check rerun after label movement.

Screenshots, JSON acceptance report, no-JS/no-WebGL captures and print-check PDF are under `/tmp/lt_bio/ch03-qa/`; full and final narrow live captures are under `/tmp/lt_bio/` and `/tmp/lt_bio/final-390/`.

## Verification limits

The two kitchen activities passed independent safety and estimated feasibility review but have not been physically trialled in a kitchen. Biological variability and coarse ruler resolution are stated in the chapter. The random walk has no calibrated diffusivity/time; cell-response stages are qualitative; the pressure widget varies imposed pressure rather than simulating evolving cell volume. No publication/deployment was requested or performed.
