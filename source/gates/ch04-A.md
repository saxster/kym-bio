# Chapter 4 — independent Gate A: facts and fidelity

Reviewed 30 October 2026. Reviewer did not participate in writing. Scope: `grounding/ch04.md`, `src/ch04.md`, `figs_ch04.py`, `live/biomolecules_model.js`, the three Chapter 4 widgets and their enhancement entries, `provenance/ch04.yml`, and `src/stories/p-ramachandran.md`. Instructions read: workspace AGENTS/CLAUDE, SKILL, GATES, NARRATIVE, FORMAT, BOOKPLAN and relevant PLAYBOOK material. This reviewer changed this report only; substantive changes belong to the author.

**Final decision: PASS. Both required corrections were made by the author and independently confirmed. No unresolved required fixes or blockers.**

## 4.1 — water, carbon and building units

No required fact/fidelity correction identified. Partial charges are distinguished from ions and intermolecular hydrogen bonds from covalent O–H bonds. Four-bond capacity, glucose formula, glucose-derived starch/glycogen/cellulose, protein units, and the glycerol/three-fatty-acid triglyceride pattern agree with [OpenStax water](https://openstax.org/books/biology-2e/pages/2-2-water), [carbon](https://openstax.org/books/biology-2e/pages/2-3-carbon), [carbohydrates](https://openstax.org/books/biology-2e/pages/3-2-carbohydrates), [lipids](https://openstax.org/books/biology-2e/pages/3-3-lipids) and [proteins](https://openstax.org/books/biology-2e/pages/3-4-proteins). The prose avoids treating every lipid as a repeating monomer polymer or all proteins as twenty identical possibilities.

Geometry review: `c4_water_carbon` joins a hydrogen edge on one molecule to an oxygen edge on another; its bent-water and methane drawings are expressly illustrative. Methane is explicitly identified as tetrahedral. `c4_building_units` disclaims real chain lengths and atomic structure; branching, alternating cellulose-unit orientation, ordered different amino-acid units and three triglyceride tails support the written distinctions. No external molecular coordinates or artwork are present.

The school bridge matches Cambridge 0610 **Core 4.1.1–3**. These objectives include the elemental lists, larger/smaller molecule relationships and all five food tests. DNA is **Supplement 4.1.4**, correctly deferred rather than claimed covered. Verified against an independently downloaded [official 2026–2028 version 3 syllabus](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf), printed pp16–17 (`/tmp/gate-a-ch04-cambridge.pdf`).

## 4.2 — collagen and backbone restrictions

### A1 — FIX — 1954 assembly versus 1955 coiling — FIXED by author; independently confirmed

Locations: `src/ch04.md:181`; `figs_ch04.py:81–87`; history-source claims in `grounding/ch04.md:29–32` and `provenance/ch04.yml` §4.2 / shared story history. The sentence attributes three chains **wound together** to 1954. The figure likewise draws chains around a common axis beside a 1954-only label. This compresses a material change between the 1954 parallel-chain assembly and the 1955 coiled-coil revision.

Direct evidence is now accessible: the National Medical Journal of India hosts a permission reprint of **both original papers**, [Structure of Collagen (1954 and 1955)](https://nmji.in/nmji/archives/Volume_19_6_Nov_Dec_2006/classics/Class1.htm). The second paper, third paragraph, contrasts the new coiled coils with the earlier parallel axes. It says the “chains now form coiled coils”. Original 1955 citation: Ramachandran & Kartha, *Nature* **176**, 593–595, [DOI 10.1038/176593a0](https://doi.org/10.1038/176593a0). The reprint header has an obvious **1995** transcription error; its reference list and the original publication metadata establish **1955**. Do not import the typo.

Verified resolution: the chapter now says the 1954 chains were **arranged together**, explicitly dates common-axis coiling to the 1955 revision, and the story distinguishes the earlier parallel axes. The figure heading now says **modern schematic**, with separate 1954 and 1955 milestones. Grounding and shared chapter/story provenance now record the accessible original-paper reprint and its transcription caveat. These corrections agree with the primary text.

Other checks passed: the [original 1963 paper](https://williams.chemistry.gatech.edu/course_Information/2024_3521_Spring/papers/ramachandran_1963.pdf), pp95–99, supports peptide planarity, two backbone rotations, nonbonded-contact restrictions, comparison with known structures, the Madras affiliation, all three authors, and receipt on **27 December 1962**. Publication in **1963** is correctly separated from submission. The chapter does not turn an allowed local angle into a complete folding prediction. The clash circles overlap only in the explicitly crowded case; the cartoon is not presented as measured coordinates or a copied angle plot.

## 4.3 — enzymes and energy barriers

No required correction identified. Catalytic chemistry, induced fit, substrate specificity, regeneration and unchanged endpoints agree with [Imperiali's MIT lecture transcript](https://ocw.mit.edu/courses/7-016-introductory-biology-fall-2018/f531ebe6a60d74b7f6b7c10732a4f130_QTdJiG7mV40.pdf), pp10–14, and [OpenStax enzymes](https://openstax.org/books/biology-2e/pages/6-5-enzymes). The RNA exception and qualified substrate-family statement avoid false absolutes.

The [1897 Buchner communication, translated excerpt](https://web.lemoyne.edu/~giunta/buchner.html), paragraphs on carbohydrate comparisons and cell-retaining filtration, supports the historical evidence block. It establishes cell-free fermentation, not isolation of one purified enzyme. No unsafe historical protocol is re-enacted or directly quoted.

Independent Python arithmetic: forward barriers **90−20=70**, **55−20=35**; reverse **90−10=80**, **55−10=45**; endpoint change **10−20=−10**; both barriers lowered by **35**. No speed multiplier follows from the ratio. Original SVG uses a common linear mapping: levels 20/10/90/55 at y 204/224/64/134, respectively. Widget endpoints and peak controls likewise agree with the stated account. Reaction progress is expressly not elapsed time.

Cambridge **Core 5.1.1–5** versus **Supplement 5.1.6–9** checked. Complex/specificity explanation belongs to Supplement; the bridge refers to Topic 5.1 generally without falsely labelling it Core.

## 4.4 — conditions model and denaturation

### A2 — FIX — combined active share display — FIXED by author; independently confirmed

Locations: `live/biomolecules_model.js:7–13`; `live/w_enzyme_conditions.js:27–33`; matching grounding/provenance model explanation. The initial display called F(T) the active fraction even for a heat-exposed sample whose calculation used **F(T)×0.15**. This could leave two incompatible accounts of how much enzyme was active.

Verified correction: the model now returns `activeFraction=fraction*survival`; the canvas displays **Active share**, and the readout separately names thermal fraction and combined active share. Rate remains E×activeFraction×H. At 60 °C/pH 7, F=**0.0758581800**, exposed active share=**0.0113787270**, fresh rate=**0.3034327201**, exposed rate=**0.0455149080**. The correction changes explanation, not numerical predictions.

Remaining claims agree with the MIT transcript pp1–2 and OpenStax protein/enzyme sections cited above: denaturation can retain the peptide chain; activity changes need not prove unfolding; pH changes charge states; recovery is not guaranteed. The curves disclose invented parameters, separate samples, unspecified fixed exposure and no human fever inference.

Independent analytic optimum: let a=ln(2)/20; solving a−(1−F)/4=0 gives **T=50+4ln(4a/(1−4a))=42.6931185854 °C**, R=**1.8912785445** at pH 7. The ledger's 42.69 °C is correct; 50 °C is the fraction midpoint, not rate maximum. H(pH 5)=e⁻¹=**0.3678794412**. This is an internal model result, not a real enzyme measurement.

## 4.5 — food tests

No required fact correction identified. Checked against [CCEA food tests](https://ccea.org.uk/downloads/docs/Support/Factfile/2019/GCSE%20Biology%20Factfile%20Unit%201.3%20Food%20Tests.pdf), [WJEC/Eduqas methods](https://resource.download.wjec.co.uk/vtc/2021-22/ebl21-22_9-1/Downloads/eduqas-a-level-biology-lab-book-food-tests.pdf), [Pearson practical precautions](https://www.pearson.com/content/dam/one-dot-com/one-dot-com/uk/documents/subjects/science/GCSE-core-practical-sheets/cp3-testing-food.pdf) and [SAPS DCPIP assay](https://www.saps.org.uk/teaching-resources/resources/191/measuring-changes-in-ascorbic-acid-vitamin-c-concentration-in-ripening-fruit-and-vegetables/). The chapter correctly avoids copying CCEA's misleading free-amino-acid claim and incomplete ethanol-only description. DCPIP's acid pink/magenta appearance is explicitly supported by SAPS.

Targets, positive observations and separate controls agree across prose, SVG and model. The invented mixture is consistently positive for starch/peptide bonds/oil and negative for reducing sugar/vitamin C. Unknown negatives remain inconclusive when the positive fails or blank misbehaves. Selection changes clear the unrun state. No calibrated nutrient mass, real lunch measurement or unsupervised reagent activity is claimed.

## Story — `p-ramachandran`

No additional required story correction. A1 chronology is now corrected in the story as well. [IUCr's Yathindra obituary](https://journals.iucr.org/a/issues/2001/05/00/es0305/index.html) confirms full name, Ernakulam birth in 1922, Raman/IISc, Cambridge, Madras head in 1952 and Chennai death in 2001. The 1954 bibliographic record and original 1963 paper confirm collaborators, dates and affiliation. Story explicitly calls the initial result a proposal and credits later refinements; there are no invented quotations, private thoughts, emotions or laboratory furnishings. No restricted photograph is used.

## Licence, provenance and reproducibility

All five section entries, six original figures and story have ledger records. Exact MIT/OpenStax source titles, instructors/authors and links appear in generated credits. The build includes the chapter's required **Access for free** OpenStax link and change notice. Original SVG/code use no external artwork, coordinates, copied assessment or source prose.

Verified current [MIT terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) and [Biology 2e attribution/licence notice](https://openstax.org/books/biology-2e/pages/1-introduction). Both identify CC BY-NC-SA 4.0. OpenStax separately states an AI-ingestion restriction; the existing grounding records the user's already-authorised decision. This report does not claim the restriction is waived, grant legal permission, or reopen that decision. Third-party historical/assay facts are independently retaught; the ledger does not purport to relicense those source works.

Recomputed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I`: actual JS exports compared against an independent Python formula over **111 barrier settings, 3402 condition states, 30 food-result states**, all passed. Model optimum was solved analytically, independently of the author's rounded receipt. After the final corrections, `build.py --only 4 --out build/gate-a-ch04.html` completed successfully: 2523 KB, 1 chapter, 7 checks, 5 predictions, 14 terms, 3 live widgets. Final corrected chapter, story, plate, grounding, provenance, model and display read back and confirmed. This Gate A review does not replace the separate browser/safety/visual acceptance gate.

## Summary count

Final findings: **0 BLOCKER; 2 FIX, both corrected and independently confirmed; 0 CONSIDER. Outstanding required corrections: 0. Gate A: PASS.** No chapter/code/ledger edits made by this reviewer.
