# Independent reader review of Chapters 2 and 3 — 1 November 2026

Reviewed the settled Chapter2/3 prose diff against the existing chapter explanations, plates and root-transport model. This reviewer did not implement the initial Chapter2/3 revision. Three clear integration fixes applied:

1. Chapter2 specialised-root prediction: removed an answer explanation of the old membrane-removal option after prediction choices changed. The reveal now explains shape, area and exchange distance under the stated equal-permeability assumptions.
2. Chapter2 home activities: the newly promoted geometry activity duplicated the retained2.4 dough protocol. Replaced the latter with a brief application back to Investigation2.3 and a distinction between geometry and haemoglobin/membrane function.
3. Chapter3 root caption: the new prose's three explanatory frames did not match the static plate's numbered mangrove clues. Caption now explicitly assigns the protein relay to the left and the mangrove water account to the right. Interactive relay stages0–4 remain accurately identified as manual mechanism stages, independent of the prose's three teaching steps.

No further scientific or clarity correction identified in the revised passages. Equal-pressure osmosis precedes pressure opposition and total water potential; two-way exchange persists at equal total potentials. The nitrate explanation retains the electrochemical qualification and distinguishes primary proton pumping, coupled ion entry and passive water uptake. Chapter2 inventory names selected typical specimens and preserves exceptions; multicellular transport closes the internal-cell supply gap. The reliable dough activity is now primary and staining remains explicitly optional and uncertain.

Existing qa_ch02.py/qa_ch03.py execution is pending the root's final combined build; verification results will be appended below. No preservation baselines refreshed.

## Local rendered acceptance

Both existing acceptance scripts passed against the combined source build:

- `qa_ch02.py`:15 viewport/theme combinations,242 assertions,0 browser errors; artifacts `/tmp/lt_bio/ch02-qa`, log `/tmp/ch02-reader-qa.log`.
- `qa_ch03.py`:15 combinations,253 assertions,no browser errors; artifacts `/tmp/lt_bio/ch03-qa`, log `/tmp/ch03-reader-qa.log`.
- Extra inventory-table check at390px: no document overflow; screenshot `/tmp/ch02-table390.png` directly inspected, wrapping readable.

No fixtures or preservation baselines changed. Atlas follow-up changes are documented separately and need the final candidate rebuild for their targeted smoke check; the standard2D chapter acceptance above remains valid because Atlas changes do not modify their models.
