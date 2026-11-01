# Chapter 1 independent revision review — 1 November 2026

Reviewed the revised chapter, still figures, hydration and flame widgets, linked ATP story, Atlas chapter/model and lesson catalogue against the requested corrections. This review is independent of the principal Chapter 1 rewrite, with direct corrections of clear errors. It is a targeted scientific/reader/rendering review, not a new certification of every historical claim in the entire linked story.

## Corrected findings

- Closed a missing careful-block delimiter before the 1.4 school box. Chapter now builds with five distinct section checks.
- Removed retained MRS figure assertions that every process is required visibly in every cell; narrowed the caption's conversion of fuel “into ATP” to transfer of chemical energy. Corrected respiration glossary and the claim that sugar is useless before ATP conversion.
- Corrected 1.5 grammar and a lingering ATP-only description; removed a shared approximate 100 nm size from two differently enlarged virus examples. Narrowed the old dividing-host-cells history claim to living plant tissue.
- Corrected hydration alt text and the “50 g dry” label: 50 g starting mass includes 5 g water. Removed the arbitrary mobility marker from the mass graph. Kept the explicitly chosen 45 g fixed-material balance; 45/0.35 = 128.5714 g at 65% water; (105−45)/105 = 57.1429% water at 105 g total.
- Corrected the linked SubbaRow story's ATP paragraph/blurb to distinguish molecule identification from later functional understanding.
- Corrected the separate Atlas layer's single-step combustion, ATP bond-energy, universal carrier, fixed germination threshold and timetable claims. Its existing model parameters are explicitly illustrative. The historical heatKj field is described as unassigned free energy, not measured calorimetric heat; API retained.
- Corrected Chapter 1 lesson descriptions and added current lesson IDs to existing Atlas presets (old aliases preserved). ATP and MRS links select the ATP/rotor page, virus selects the host/phage page. The MRS lesson now describes the rotor actually available rather than nonexistent coupled gears.
- Actual 3D inspection exposed a missing shadeMat import and a wrong prims.molecule argument type. Added the import and converted selected ATP-core coordinates to the XYZ text API. The incomplete core is labelled schematic rather than experimentally fitted atomic structure.

## Completed checks

- Focused Chapter 1 build succeeds: `/tmp/kym-revised1-gate.html`, five section checks and four predictions.
- All five still figures at 390 and 1440 px in light, dark and sepia: no horizontal document overflow or SVG text outside its viewBox. Mobile hydration/MRS screenshots inspected directly.
- Hydration widget endpoints 10% → 50 g and 65% → 128.6 g match the prose and still. The mass tab opens. No page errors.
- Node syntax checks and scoped git diff whitespace checks pass.
- Focused browser evidence and screenshots: `/tmp/kym-revised1-qa/`. Browser scripts are `/tmp/check-revised1.py` and `/tmp/check-atlas1.py`.

## Atlas runtime check

The first headless inspection exposed the two runtime defects above; those initial fallback screenshots are not evidence of functioning 3D. Final post-correction Atlas verification is recorded below when complete.

**Final post-correction check: PASS.** Opened all five actual Chapter 1 Atlas links at 390 and 1440 px in a fresh browser context. Each selected its intended page and corrected readout; none fell back to the 2D error path, no page errors occurred, and no document overflow appeared. Screenshots `atlas-1..5-390.png` and `atlas-1..5-1440.png` are the final widened-camera captures. The camera distance was increased for the engine's narrow field of view and long titles shortened: direct seed, ATP and phage screenshot inspection confirms the formerly cropped assemblies are visible. These final runtime tests follow both API/import repairs and the final camera/title changes. Two overlapping ATP scene labels were subsequently shortened to “ATP core” and “ATP synthase”; no scientific or runtime logic changed. No unresolved required finding remains within this targeted review. Full-book/site verification remains with the coordinator.
