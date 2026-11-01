# Chapter 4 reader revision verification — 1 November 2026

## Delivered

The chapter now separates water interactions, carbohydrate connections and protein/lipid building patterns using internal subheadings and explain-back pauses. Starch/cellulose evidence follows the appropriate puzzle. Detailed backbone-angle/structure-level material remains available in a native disclosure. A sourced lactase example follows one complete catalytic cycle and distinguishes that example from the abstract binding widget. The five-test table retains the full chemical explanations and school-only safety rules. Numbered section and figure IDs are unchanged.

## Rendered prose

An isolated Chapter 4 build passed. A focused Playwright check exercised the protein-detail disclosure and five-test table at 390 px, then a local scroll region corrected a detected table overflow. Final document scroll width matched the 390 px viewport; native table screenshot inspected. No JavaScript errors in this check.

## Atlas consistency and runtime repair

The Chapter 4 Atlas and its six lesson-catalog entries now describe the actual representations and limits. Corrected pyranose ring composition and removed the suggestion that one alpha-glucose linkage directly accounts for cellulose. The angle surface and kinetic/thermal rates are declared illustrative. Relative activity no longer masquerades as measured native-fold fraction, and no universal 37 °C optimum, 42 °C failure or irreversible temperature threshold is claimed. The rack contains five examples including DCPIP. Current catalog IDs map to the intended Atlas pages.

The initial mount-only browser check was insufficient: a swallowed scene-construction exception produced the adapter's 2D fallback. This was identified by inspecting the screenshot and explicitly checking the badge. Fixed the underlying Chapter 4 call sites without changing the shared engine:

- Imported `shadeMat` for tube materials.
- Passed XYZ strings and options to `prims.molecule`.
- Passed scene parents plus explicit axes to `surface` and `plot`.
- Corrected angle-surface axis orientation.
- Used a numeric binding-cleft depth and the blob result's `.object.scale`.

Node scene construction and updates at 10, 37, 58 and 70 °C passed with 64 meshes whose position coordinates were all finite. A fresh isolated site `/tmp/ch4-atlas-final` built successfully. Playwright then visited all four actual Atlas pages, asserting both absence of the fallback badge and a real WebGL context, and checked the DCPIP readout. No page errors. `/tmp/ch4-atlas-assays.png` was visually inspected and shows the five actual 3D tubes.

## Existing Chapter 4 acceptance suite

The original run reached the reduced-motion assertion but its fixed 150 ms delay raced media-query delivery under concurrent browser load. A focused actual interaction confirmed the tour stopped after the preference change. Replaced only that timing delay with an event-based wait of at most 2 seconds for the required stopped state; the behavioural expectation is unchanged.

The subsequent `tests/qa_ch04.py` run against the combined `source/build/site` completed its domain oracles, 15 viewport/theme combinations, plate bounds, widget controls/tours, state persistence, keyboard controls, print fallback, no-JavaScript and no-WebGL modes, offline reopening, console/page-error checks and asset budgets. It then failed solely at line 151, the old delivery-preservation assertion that Chapters 0–3 must remain byte-identical.

No preservation fixture was reset. Its eight mismatches are precisely authorised revision files: `source/figs_ch01.py`, `source/grounding/ch01.md`, `source/grounding/ch02.md`, `source/grounding/ch03.md`, `source/provenance/ch01.yml`, and `source/src/ch01.md`, `ch02.md`, `ch03.md`. All other preservation entries matched. Thus the unmodified historical-preservation rule does not pass this cross-chapter task; the behavioural portion does. The parent performs the final all-chapter rebuild and smoke check.

No home experiment was physically trialled. No deployment or remote CI run occurred.
