# Chapter 5 — independent Gate A: facts and fidelity

Reviewed 30 October 2026. Report-only reviewer; no chapter, story, figure, widget, ledger, engine or earlier-chapter files edited. Scope: `grounding/ch05.md`, `src/ch05.md`, `figs_ch05.py`, `live/photosynthesis_model.js`, the three Chapter 5 widgets and their `enhancements.js` entries, `provenance/ch05.yml`, and `src/stories/p-ingenhousz.md`. Read the workspace instructions and the relevant source SKILL, GATES, NARRATIVE, FORMAT, PLAYBOOK and BOOKPLAN material. Grounding assertions were treated as claims to check, not independent evidence.

## Chapter 5 findings

### A1 — FIX — §5.5 vessel-element end walls (REPORT)

**Location:** `src/ch05.md:395`; corresponding §5.5 grounding description.

The submitted wording said mature vessel elements have “no end cross-walls”. That is too absolute: vessel elements connect through perforation plates at their end walls. The distinction matters because the chapter presents actual vessel anatomy, not merely a school schematic of an unobstructed continuous tube.

**Evidence:** OpenStax Biology 2e [30.2 Stems, Vascular Tissue](https://openstax.org/books/biology-2e/pages/30-2-stems) explicitly describes end-wall perforation plates and passage of water through them. Independently opened during this review. Minimal correction: end walls have large openings (perforation plates) that connect successive elements.

**Disposition:** REPORT → FIXED BY AUTHOR, independently confirmed. Chapter and grounding now describe perforation plates; provenance cites 30.2. The reviewer has not edited those files.

### A2 — FIX — §5.2 scene's reporting chronology (REPORT)

**Location:** original `src/ch05.md:84` scene, “experiments reported in 1771 and 1779”.

1771 is the date of Priestley's experiment, not the publication date of the public report. Calling these experiments “reported in 1771” collapses experiment and publication chronology. The surrounding evidence paragraph correctly dates the experiment and does not otherwise make this mistake.

**Evidence:** Priestley's [1775 second edition](https://www.gutenberg.org/files/29734/29734-h/29734-h.htm), preface, identifies observations published in the Philosophical Transactions for 1772; printed pp51–54 specify 17 and 27 August 1771. Ingenhousz's [original book](https://archive.org/details/b30516638_0001) title page gives London, 1779.

**Disposition:** REPORT → FIXED BY AUTHOR, independently confirmed. Revised scene now says “an experiment in 1771 and a book in 1779”; provenance records the distinction.

## Chapter 5 checks with no additional finding

**§5.1 history and mass.** The [Saupe university page's attributed translation](https://faculty.csbsju.edu/SSAUPE/biol115/van_helmont.htm) supports the 200-pound earth, 5-pound shoot, five-year interval, final 169 pounds/about 3 ounces, soil loss about 2 ounces, water, lid and omitted fallen leaves. The chapter correctly treats 1648 as posthumous publication and does not equate the reported tree gain with dry wood or convert uncertain historical units to exact modern kilograms. Carbon dioxide supplies carbohydrate carbon; water and essential mineral ions remain in the account. No unsupported Mumbai tree age or mass retained.

**§5.2 gas evidence.** Read Priestley's original comparison and dates directly, and Ingenhousz's cached original OCR at printed pp14–17, 203ff and 238ff, checked against the linked original scan's metadata/title page. Separate plant/no-plant exposure, collection over water, light conditions, green tissues and varying bubble forms are supported. The prose does not give Ingenhousz modern molecular knowledge. De Saussure's qualitative claim agrees with [the cited scholarly analysis, §3.2](https://comptes-rendus.academie-sciences.fr/geoscience/articles/en/10.1016/j.crte.2012.10.006/), retrieved through indexed full text when direct access returned 403. No atmospheric concentration or apparatus recipe is imported. Net production/consumption and the limitations of bubbles/indicator changes are correctly distinguished.

**§5.3 mechanism, collaborators and equations.** Independently opened [MIT 7.014 Lecture 8 transcript](https://ocw.mit.edu/courses/7-014-introductory-biology-spring-2005/3fbe99b92e196ff4bfd90f6cba6a169f_7_0142005L08.pdf) and [OpenStax 8.2](https://openstax.org/books/biology-2e/pages/8-2-the-light-dependent-reactions-of-photosynthesis)/[8.3](https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules). Energy capture, water-derived oxygen/electrons, membrane proton gradient, ATP/NADPH and small carbon products are faithful at this level. The four 1941 authors and date match [ACS publisher metadata](https://pubs.acs.org/doi/10.1021/ja01848a512): Samuel Ruben, Merle Randall, Martin Kamen and James Logan Hyde. Publisher full text was unavailable; no claim here to have read it. The chapter avoids the radioactive-isotope misconception and does not use equation layout as atom tracing.

Independent `python3 -I` arithmetic:

| Account | C/H/O on either side | Formal mass on either side, C=12 H=1 O=16 |
|---|---|---|
| Net glucose summary | 6 / 12 / 18 | 372 |
| Fuller summary, water on both sides | 6 / 24 / 24 | 480 |
| Fuller summary ×2 / ×3 / ×4 | 12/48/48; 18/72/72; 24/96/96 | 960 / 1440 / 1920 |

No actual plant yield, photon count or elapsed time is implied by these formal accounts.

**Limiting-factor model and widget integration.** Independently recomputed the disclosed model `R=min(L,C,max(0,100−((T−25)/2)²))`, net `R−10`: `(20,80,25)` gives gross20/net10; `(60,80,25)` gives60/50; `(80,20,25)` gives20/10; 5°C and45°C at80/80 give0/−10; darkness gives0/−10. Loaded the actual JavaScript module: four batch outputs agree; 18,081 allowed slider combinations respect the stated caps and net balance. `compareTrials` rejects absent, unchanged and two-factor comparisons, and accepts a one-factor comparison. The challenge requires captured baseline/comparison trials, not merely slider movement. Fixed oxygen use, independent new samples, invented temperature curve and absence of calibrated bubbles are disclosed. The plot's40/80 plateaux agree with its chosen capacities.

**§5.4 leaf integrity.** Representative dicot geometry, xylem above phloem in its vein, palisade/spongy tissue, pore-to-air-space route and separate enlarged surface view are internally consistent. No scale measurement is implied. Guard-cell solutes, osmotic water entry, turgor and wall mechanics explain aperture changes; stomatal distribution/timetables are qualified. Chapter appropriately limits the unaided attached-leaf activity.

**§5.5 transport integrity.** Subject to A1, the causal account preserves evaporation, curved water surfaces, lowered liquid pressure, cohesion, total water potential, dead conducting vessels, cavitation, and the limited role of root pressure. Phloem osmotic entry/pressure flow and source/sink switching are distinct from xylem tension. Active and passive loading are supported by [Rennie and Turgeon's primary study](https://pmc.ncbi.nlm.nih.gov/articles/PMC2729037/) (indexed full text; direct PMC initially challenged browser). The two phloem diagrams and widget arrows correctly run in separate source-to-sink directions. Stage controls alter explanatory focus, not simulated time or measured sap velocity.

**School bridges and terrarium.** Checked the cached official [0610 2026–2028 syllabus](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf), printed pp17–18 and22–23. Core/Supplement distinctions and topic coverage match. The case is explicitly fictional, nearly closed to matter but open to light/heat, and correctly includes plant respiration in daylight. No indefinite survival guarantee or unsupported bottle date remains.

## Story p-ingenhousz

No additional finding. [Science Museum Group](https://collection.sciencemuseumgroup.org.uk/people/cp37466/jan-ingenhousz) supports Dutch physician/natural philosopher, Breda,1730–1799. Original1779 book/OCR supports the collection and condition comparisons. The story avoids invented quotation, thoughts, room, precise discovery day, exclusive priority or a completed modern mechanism. The point about bubble counts versus volume is identified as a present-day inference, not an attributed historical measurement.

## Provenance, licensing and preserved scope

All five numbered sections, seven original figures, three widgets and the new story have ledger entries. Source courses/books retain existing grouping names and named creators. Original schematic art contains no copied photographic or restricted molecular assets. [MIT terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) and OpenStax's [book preface](https://openstax.org/books/biology-2e/pages/preface)/page attribution specify the recorded CC BY-NC-SA obligations. The existing source-use decision and explicit OpenStax AI-ingestion limitation remain disclosed; this review does not reinterpret the user's recorded decision as a waiver from the publisher. Footer generation follows the existing Biology2e ledger grouping. No publishing or remote operation was performed.

Hash comparison against `tests/ch05-preserved.json`: all154 preserved files other than the explicitly authorized `live/enhancements.js` match their155-file baseline at review time. This includes Chapters0–4 and `p-helmont`. **Inherited limitation, outside this change:** `p-helmont` still asserts exact metric conversions and a stronger solid-wood inference than the evidence supports. New Chapter5 avoids linking its corrected discussion to that story and expressly rejects those inferences. No unrelated rewrite is requested.

## Status and counts

Initial findings: **0 BLOCKER, 2 FIX, 0 CONSIDER**. **Both FIX items resolved; 0 required Gate A corrections remain. Gate A PASS for the final correction set examined.**

Final confirmation, 30 October 2026: reread the complete substantive correction set supplied by the author. Vessel anatomy and scene chronology are corrected. The added concentration/charge-gradient energy relay agrees with MIT Lecture8 and preserves energy accounting. The story's concrete oxygen-source question does not attribute the modern tracer result to Ingenhousz. Shortening the temperature slider to `Temperature` is reflected consistently in the widget and all three enhancement tour actions; independent-new-sample and invented-model disclosures remain. Python confirms exact light-axis breakpoints `70+5.2×40=278` and `70+5.2×80=486`, matching the corrected schematic paths. Grounding and provenance record these changes. Repeated preservation hashes still show only authorized `enhancements.js` differs among the155 baseline files.

No author files edited by reviewer; therefore no post-edit build was run by this reviewer. UI behaviour/rendering and Mumbai activity safety also require the separate Gate B/QA lane; the checks here concern source fidelity, calculations and diagram/model integrity. Later visual-only changes should preserve this examined scientific content.

## Supplemental shared print correction review

The author requested review of an additional necessary print fix after PDF inspection. `book.css` appends a print-only palette/background reset; grounding/provenance record the defect. Independently hashed the original stylesheet prefix against `ch05-preserved.json`: unchanged. All other baseline files remain unchanged except authorized `enhancements.js`; the appended CSS is728 bytes in the submitted print correction. This supplements the earlier preservation result, which preceded the stylesheet correction.

### A3 — FIX — print colour-scheme selector specificity (REPORT)

**Location:** appended `book.css` print block, `html:root` rule.

Semantic palette tokens/background use `!important` and override the old dark palette correctly. However, `color-scheme: light` does not. The existing `:root[data-theme="dark"]` rule has specificity `(0,2,0)`, exceeding `html:root`'s `(0,1,1)`, so the explicit dark colour scheme still wins in print. Apply `!important` to the print colour-scheme reset (or an adequately specific print selector), and add a computed colour-scheme assertion for all three themes.

**Evidence:** inspected the actual old theme rule and appended rule. The new QA assertions check body/background/SVG ink but do not currently check `getComputedStyle(document.documentElement).colorScheme`.

**Disposition:** REPORT → FIXED BY AUTHOR, independently confirmed. Print `color-scheme: light !important` is now present, and author QA explicitly asserts the computed root scheme for each theme.

Independent final Chromium check against the rebuilt local site: print from light, dark and sepia each computes root scheme `light`, body/background white (`rgb(255,255,255)`), Chapter0/4/5 text `rgb(20,27,25)`, and Chapter5 original-SVG text `rgb(20,27,25)`. Switching back to screen with dark selected computes scheme `dark`, pale screen ink `rgb(230,227,214)` and dark paper `rgb(20,27,25)`, demonstrating the correction remains print-only. Final stylesheet addition is739 bytes; the original-prefix SHA still matches the baseline. Built CSS strips comments, so the original-source marker is not used as a build-presence test.

Final cumulative result: **Gate A PASS; 0 BLOCKER, 3 FIX identified and resolved, 0 unresolved required fixes, 0 CONSIDER.** Scientific-content approval stands; the scoped shared print correction is also confirmed. Reviewer edited only this report.
