# Chapter 8 reader revision, 1 November 2026

Implemented the Chapter 8 recommendations from the editorial and independent science reviews. Preserved the four-section story sequence and all nine figures. Added short learning pauses and subheadings, clarified partial pressure versus oxygen content, shortened school bridges, improved the ventilation distractor and valve-sound question, and narrowed the postnatal VSD case.

Scientific consistency changes cover revised Starling net filtration and lymphatic return, neural/chemical exercise control without assumed arterial hypercapnia, Harvey mass bounds, capillary transit arithmetic, cell-classification scope, ventricular versus capillary pressure and synchrony of the two pumps. The three 2D widgets, shared watch/cutaway entries, Chapter 8 lesson rows and Atlas descriptions now agree. The Atlas VSD model no longer predicts systemic desaturation from a left-to-right shunt. The Atlas breathing pressure is explicitly an illustrative small open-air swing rather than a closed-gas Boyle calculation. Grounding and provenance record the revised source contracts.

## Local evidence

- `node source/tests/ch08_domain.mjs`: 1,731 existing domain cases passed, with revised fluid-route assertions and additional independent Atlas pressure and VSD invariants.
- From `source`: `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python build.py --only 8 --out /tmp/ch08-reader-revision.html`: passed with provenance, 9 plates, 4 live widgets. No generated repository-root files were written.
- Python compile of `figs_ch08.py`: passed.
- Browser verification of the isolated build at localhost: 9 SVGs × 2 widths (390,1440) × 3 themes = 54 states with no text overlaps, clips or arrows crossing labels. Exercised tabs in all three 2D widgets; zero page errors. Screenshots and report at `/tmp/ch08-reader-browser-trail/`; manually viewed the revised tissue-fluid plate and vessel widget. The browser script is `/tmp/check_ch08_revision.py`.
- Targeted `git diff --check`: passed.

The old full acceptance runner freezes unrelated earlier-chapter content. It was not treated as authoritative after authorised concurrent revisions to Chapters 1–7. Root coordinates the integrated check and explicit revision manifest; historical baselines were not reset here. This record does not claim physical trial of the breath-counting home activity or full integrated/offline acceptance.


## Actual WebGL continuation

The earlier 2D-widget check did not establish that the Atlas 3D path worked. An actual WebGL check exposed a missing `shadeMat` import in Atlas Chapter 8. Corrected the import; the adapter now mounts the real WebGL renderer rather than silently falling back to 2D.

Visual inspection also led to four hollow chamber symbols with distinct atria/ventricles and valve markers, replacing two solid capsules described as a four-chamber cutaway. The left ventricular rim is approximately three times the right rim. Labels and cameras now fit the station; the text explicitly calls this a connection schematic. Corrected forearm insertion geometry to match the numerical 4:32 lever ratio. Removed microphone loudness as an apparent heart-rate measurement. The pressure display explicitly represents a chosen open-air swing.

Actual WebGL verification: `python tests/qa_ch06_10_atlas.py /tmp/bio-atlas8-site/index.html --chapters 8` passed all four stations with changed sliders, no context loss or browser errors, and mobile resize. Additional per-station mobile verification is recorded under `/tmp/bio-atlas8-all-mobile-qa/` using `/tmp/qa_atlas8_all_mobile.py`. No 2D fallback was accepted as WebGL evidence. The isolated site was built with `build.py --only 8 --site /tmp/bio-atlas8-site` and did not mutate the integrated build.

Per-station mobile context checks passed, but manual screenshot review caught a shared paused-resize rendering defect: the context and DOM labels remain valid while meshes disappear after resize. Engine resize clears render targets without requesting another paused draw after the adapter’s transient frame loop expires. Reported to root for shared adapter/engine repair; mobile visual completion remains pending that repair and rerun. Widened the last station camera to retain the full forearm and hand load at maximum elbow angle. Diagnostic receipts are `/tmp/bio-atlas8-all-mobile-qa/ch8-station{0,1,2,3}-{1440,390}.png`; they must not be mistaken for an all-clear visual pass.


### Paused resize defect resolved and independently rechecked

Root repaired the shared Atlas adapter so resize and visibility changes schedule paused redraws without advancing the simulation clock. Independently reran `qa_ch06_10_atlas.py /tmp/bio-atlas-final/site/index.html --chapters 8`: PASS, all four actual WebGL stations, changed controls, no errors or context loss, and the redraw-counter regression after an 1,800 ms idle period before mobile resize. Manually inspected all four new 390px screenshots in `/tmp/bio-ch06-10-atlas-qa-8/`: thorax/alveolus, figure-eight/valves, four hollow chambers and complete lever geometry are visible and contained in the frame. The previously blank mobile stages now render. This resolves the pending mobile visual issue recorded above. No Chapter 8 source changes were needed during this final check.
