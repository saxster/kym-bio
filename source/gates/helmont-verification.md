# Older Helmont story — correction and local verification

30 October 2026. **PASS. Current built service-worker cache: `lw-7e66ea6e50d5`.** This user-authorised follow-up supersedes the earlier decision to retain the inaccurate older story. It does not retroactively change the original Chapter5 test receipts or preservation baseline.

## Corrected content

`src/stories/p-helmont.md` now keeps the reported historical units and distinguishes measurements from inference. Removed unsupported metric conversions, an inferred exact final soil mass, the claim of measured dry-wood gain, “proved beyond doubt”, an unverified c.1640/home-laboratory setting and speculation about his thoughts. The story explains the unrecorded tree water content, unweighed fallen leaves and missing water/gas accounts; carbon dioxide supplies carbohydrate carbon, while water and mineral nutrients remain important.

Publication in1648 is distinguished from the unknown exact experiment dates. Van Helmont's1644 death and his son Franciscus Mercurius's publication role are sourced. Existing born1580 metadata retains the documented modern-year convention; the1579Old Style/1580New Style caveat and publisher-access limit are in grounding/provenance. No unsupported exact experiment date has replaced the old one.

The role/blurb, which also feed the cast and timeline, are corrected. Chapter5's normal name link now opens the corrected story. Story-specific source records in `provenance/stories.yml`, Chapter5 provenance and grounding were updated. All other cast provenance entries are unchanged: reconstructing the old Helmont entry against the unchanged prefix reproduces the original file SHA.

Independent **Gate A PASS**, `helmont-A.md`: one required inference correction identified and resolved, zero outstanding blockers/fixes. Independent **Gate B PASS**, `helmont-B.md`: zero blockers/fixes/optional findings and exactly three sentences of explain-back. Both reviewers confirmed the final wording. No new home activity, physical trial or biological measurement was introduced.

## Preservation

- `tests/ch05-preserved.json` remains unchanged.
- `tests/helmont-before.json` records before-change hashes for this follow-up.
- `tests/helmont-authorised-corrections.json` records exact before/after SHA values for the two pre-existing files explicitly amended by this request: the Helmont story and its story-provenance file.
- The acceptance script requires both matching original-baseline before hashes and matching approved final hashes. It does not simply skip those files or regenerate the original baseline.
- Completed Chapter0–4 prose, art, grounding, gates, tests and widgets remain unchanged. Prior shared CSS/enhancement additions retain their original-prefix checks; this follow-up changes neither shared file.

## One local verification command

From `source/`:

```bash
./tests/verify_ch05.sh
```

The script uses `set -euo pipefail` and runs the actual site build, Chapter5/story acceptance and full-book live/offline smoke test with the specified Python interpreter. It fails if any command fails. Optional `BIO_PYTHON_INTERPRETER` and `BIO_VERIFY_OUT` select another local interpreter or receipt directory.

Executed successfully, **overall exit0**, after the final content correction:

| Local command | Result |
|---|---|
|`python build.py --site build/site`|exit0|
|`python tests/qa_ch05.py`|exit0;985 assertions;18,133 domain cases|
|`python livetest.py build/site/index.html … --offline`|exit0;17 live figures and3 explorer mounts; no console/page errors|

All commands used `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`. Receipts are in `/tmp/lt_bio_ch05/helmont-followup/`: `build.log`, `qa.log`, `live.log`; machine-readable acceptance at `qa/report.json`. The current index is below4MB and all three Chapter5 widget chunks remain below150KB. No lazy live chunks loaded before interaction. Existing smoke-test output classified two software-GL performance notices as driver notes, not application errors.

The acceptance run includes the original15 viewport/theme combinations, seven plates, three widgets, their manual/tour/model invariants, dynamic reduced motion, resize/theme redraw, no-JS/WebGL fallbacks, print palette and offline widget reopening. Added story checks cover keyboard activation of Chapter5's restored link, Escape return, mobile390/desktop1440 in light/dark/sepia, no horizontal overflow, qualified observations in the built story and opening the corrected story offline. All passed on the current cache.

## Direct inspection and reading link

Inspected native story screenshots in all three themes, mobile/desktop, and the mobile ending after scrolling. A separate direct-URL check confirmed the modal opens at `#story-p-helmont` with no page errors. Screenshots: `qa/helmont-<width>-<theme>.png` and `helmont-ending-390.png`.

The current QA PDF was regenerated. Inspected Chapter5 evidence/ledger page150 and the corrected timeline summary on page184. Chapter5's seven plate/caption page positions remain150,155,160,164,168,174,178. This is a verification PDF, not a publication edition; no claim that the entire story body was included in that whole-book print view is made.

Verified the running local HTTP server returns exactly the current built index bytes:

[Read the corrected story](http://127.0.0.1:54678/index.html#story-p-helmont) · [Chapter5](http://127.0.0.1:54678/index.html#ch5)

No unresolved required story finding remains. Historical mass-unit standards and exact experiment dates remain unknown and are labelled accordingly. Source-access limits remain recorded rather than presented as full-text access. All verification ran locally. No GitHub Actions workflows were present in this project, and none were created or dispatched. No publication, deployment or remote repository operation occurred.
