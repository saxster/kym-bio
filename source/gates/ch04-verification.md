# Chapter 4 completion and verification — 30 October 2026

## Delivered in the authorised order

1. `grounding/ch04.md` was written before art, widgets or chapter prose, from opened OpenStax pages, actual MIT lecture transcripts, the official Cambridge syllabus and checked primary/authoritative history. The Python calculation receipt distinguishes invented parameters from factual claims.
2. `figs_ch04.py`: six original plates — c4_water_carbon, c4_building_units, c4_folding, c4_barrier, c4_conditions, c4_food_tests. Every numbered section has a useful standalone plate; §4.1 has two. Semantic theme classes and full arrow-marker names; no external artwork, portraits or atomic coordinates.
3. Three substantial Canvas widgets and all five enhancement fields: enzyme_barrier, enzyme_conditions, food_detective. Each has exactly five manual tour shots, a nontrivial challenge and original SVG fallback. No motion on load or opening. Time adds nothing to these parameter/cycle comparisons, so playback controls are hidden. The existing core owns observers, tours and cleanup; the widgets own no timers or WebGL resources.
4. `src/ch04.md`: approximately 7,200 words (7,237 whitespace-separated source tokens including markup/front matter), five sections, nine complete Understand-it cards, five predictions, five checks, two recalls, one home activity, the washing-powder case and photosynthesis bridge. `src/stories/p-ramachandran.md`: approximately 700 words (723 source tokens), with verified collaborators and separate 1954/1955/1963 milestones.
5. `provenance/ch04.yml`: every section contains ocw, openstax, research, history, figures and licence; records for all six figures and the story. Exact existing course/book grouping names and generated OpenStax access/change footer retained.

Completed Chapter 0–3 source files were preserved. All **23** files in `tests/ch04-preserved.json` match their pre-task SHA-256 hashes. No shared engine code was changed. The sole shared-file addition is three registration entries in `live/enhancements.js`; full-book live testing verifies existing widgets still open.

## Independent gates — closed

- [Gate A](ch04-A.md): **PASS**, 0 BLOCKER; two FIX findings corrected and independently confirmed; no outstanding required findings. Distinguished the 1954 parallel-axis three-chain proposal from the 1955 common-axis coiled-coil revision. Corrected the conditions widget's displayed active share to include its imposed surviving fraction. Reviewer independently compared actual JS with Python over 111 barrier settings, 3,402 conditions states and 30 food-result states; solved the invented model optimum analytically. Chapter-only gate build passed.
- [Gate B](ch04-B.md): **PASS**, 0 outstanding BLOCKER/FIX. Five exact three-sentence explain-backs avoid the target misconceptions. Added the specific sugar oxygen/O–H contacts with water, and clarified the runny-to-cooked egg-white comparison as an explanation with no raw-egg/heat activity. Safety and estimated Mumbai-home feasibility pass.
- Optional B3 early active-site scene label was subsequently removed in favour of “where chemistry happens”. B2 (additional structure-level sketch) and B5 (story pacing) remain optional editorial decisions: retain the descriptive hierarchy after its mechanism and retain the story's historical question. Neither requires a rewrite or blocks the gate.
- Grounding and provenance record these corrections. A final Canvas bounds audit also shortened a stage-two display sentence that exceeded the edge by 1.65 logical pixels; no mechanism or model calculation changed. Final actual Canvas audit has zero out-of-bounds text entries.

## Final build and executable checks

All Python commands use `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`, from `source/` unless stated otherwise.

**Final service-worker cache: `lw-6619f90d6391`** (build version `6619f90d6391`).

- `build.py --site build/site`: **exit 0**. Final index **1,203,740 bytes** (~1.18 MB), under 4 MB. Widget chunks: enzyme_barrier **2,854 bytes**; enzyme_conditions **2,472 bytes**; food_detective **2,086 bytes**, each under 150 KB. Shared Three.js is excluded from the widget budget as specified.
- Requested full command `livetest.py build/site/index.html /tmp/lt_bio_ch04`: **exit 0**, all 14 widgets and the three available explorer mounts opened; no lazy widget imports before interaction; no console errors. This initial full run preceded the final corrections.
- **Final full-suite rerun**, `livetest.py build/site/index.html /tmp/lt_bio_ch04/final-full --offline`: **exit 0** on the final cache above. All 14 widgets and three explorer mounts opened, service worker ready, offline reload and a live widget opened offline; no console errors. Two software-GL driver performance notices were filtered by the existing harness, not page failures.
- `tests/qa_ch04.py`: **exit 0**, **428 assertions**, **15 viewport/theme combinations**, **1,817 domain cases**, **133 screenshots**, zero page/console errors; final cache above. This full Chapter 4 acceptance suite ran after the final chapter/model/label corrections. The preservation baseline was then moved from its temporary receipt to the persistent test JSON, and all 23 hashes were checked again successfully.
- Actual model invariants: shared endpoints and ΔG; equal lowering of forward/reverse barriers; bounded active fractions and nonnegative rate; exposed/fresh ratio 0.15 at matched assay settings; qualitative warming-then-falling response; invalid/unrun food controls prevent inference. Gate A provides an independent, broader Python/JS comparison.
- Structural audit: all five section ledger records have all six fields; every one of the nine cards has five core questions and three folded questions; required section/case/bridge blocks present.

## Rendered acceptance

Static plates checked at **390, 820, 1024, 1180 and 1440 px**, in **light, dark and sepia**. Browser text bounds checked for clipping/collisions; all arrows checked for defined markers and visible strokes. Rendered images were also inspected directly and in three 30-image matrix sheets. Geometry inspection includes O–H versus intermolecular contact, methane connectivity limitation, chain/branch/orientation keys, backbone restrictions, modern collagen chronology, barrier heights/endpoints, temperature factors and food-test columns. No horizontal page overflow.

All three widgets were captured at default and meaningful changed states on **390 and 1440 px**, in all three themes, and visually inspected. Specific assertions cover keyboard stepping/range changes; stage/slider synchronisation; partner reset; barrier arithmetic; pH factor; residual activity; food results clearing after test/control changes; invalid positive control; completion only after an actual food comparison. All five tour buttons work manually under reduced motion; explicit normal-motion tours stop off-screen and when the reduced-motion preference changes while open. Parameter-only widgets have no elapsed-time playback button.

Already-open paused widgets were resized and recoloured, retaining their model state and redrawing nonempty canvases. A separate actual `fillText`/font-metrics audit across control/tour states found no remaining clipped Canvas labels after the wording correction. Static drawings and prose remain available with JavaScript off. All three widgets retain their Canvas functionality with WebGL disabled; **3D camera controls are not applicable** because this chapter deliberately uses 2D accounts rather than invented protein coordinates.

Print/PDF checks restore the original SVG during live use. The generated 177-page whole-book check PDF was examined; Chapter 4 plates appear with their captions on PDF pages **112, 115, 124, 130, 135 and 141**. Printed art is the original plate, not a Canvas screenshot. These are verification pages, not a newly authored publication edition.

The final Chapter 4 acceptance suite specifically reloads Chapter 4 offline and opens **and reopens each of its three widgets offline**. The full-book offline smoke test independently checks general offline loading.

## Evidence locations and limitations

- Final build log: `/tmp/lt_bio_ch04/final-build.log`.
- Final full-book live log: `/tmp/lt_bio_ch04/final-live.log`; captures in `/tmp/lt_bio_ch04/final-full/`.
- Chapter acceptance report/screenshots/PDF: `/tmp/lt_bio_ch04/qa/`; stdout `/tmp/lt_bio_ch04/final-qa.log`. Matrix/live contact sheets in `/tmp/ch04-static-*-matrix.jpg` and `/tmp/ch04-live-*.jpg`; individual screenshots remain available at native dimensions.
- No known unresolved required factual or implementation finding. Direct Nature publisher access was blocked, but the original 1954/1955 articles were read in NMJI's permission reprint and the original 1963 paper was fully examined. Practical Biology returned 403; accessible SAPS and exam-board/publisher material supplies the assay support. No inaccessible source was treated as read in full.
- The oil/water home activity received independent safety and estimated qualitative feasibility review. **It was not physically trialled.** No school food test, egg-cooking test, enzyme assay or washing experiment was performed in this session. No exact home outcome is promised.
- Curves, energies, molecular outlines, surviving share and virtual unknown are explicitly illustrative/invented, not measured data or calibrated real-enzyme predictions. No universal numerical enzyme speed-up or fever threshold is claimed.
- Local implementation/build only; no publication or deployment was performed.

Local reading server started for handover: `http://127.0.0.1:54677/index.html#ch4`. The durable built artifact is `build/site/index.html`; serve its directory over HTTP for lazy widgets and offline support.
