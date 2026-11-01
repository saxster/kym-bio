# Independent review of the live-audit repair

Reviewed 1 November 2026. Scope limited to the current changes in `source/figs_ch00.py`, `source/figs_ch05.py`, `source/book.css`, `source/live/atlas/biology/ch00-microscopy-scale/chapter.js` and `source/tests/ch00_atlas_domain.mjs`, with the primitive definitions and Chapter 0 model read only to check their contracts. No implementation was edited and no expensive tests or browser runs were repeated.

## Consequential finding

At inspection, `chapter.js:145` defines the open jar with `lid: 'none'`, whereas the fly-position update at approximately line 231 tests `fc.lid === 'open'`. Consequently all three fly clouds are placed above their containers. The repaired particle API exposes this semantic defect: the open jar does not show flies entering while its description says it does. Normalize the lid value or branch on `'none'`. The domain test should additionally inspect positions to ensure the open jar's flies can be inside and covered jars' flies remain above their lids. Finite coordinates alone cannot detect this error. This finding was sent to the coordinator immediately.

## Label and model-limit details sent to the coordinator

- The water plate describes approximately 0.28 nm **O–O spacing**, but the scale readout calls the whole four-water cluster 0.3 nm. Those are different extents. Name the spacing or use a molecular-water scale comparison.
- The scale columns have chosen heights 0.45, 0.95, 1.55 and 2.25 for approximately 5, 100, 2,000 and 8,000 nm. They convey size order but are not a calibrated logarithmic height scale. Call them schematic size-order columns, or calibrate the heights before claiming a logarithmic axis.
- The microscope's reported diffraction estimate includes an illustrative numerical-aperture rule chosen from lens radius. The revised ideal-ball-lens qualification is helpful. Extend that qualification to the readout so it cannot be mistaken for a measurement of Leeuwenhoek's historical instrument.

## Repairs that agree with the intended content

- The imported `shadeMat` exists in the used kit. `particles(parent, count, options)` and `set(index, xyz)` now agree with the current primitive contracts. The molecule conversion supplies the expected XYZ-style rows. A cheap coordinate-distance check found exactly the eight intended intramolecular O–H bonds, with no new inter-water covalent bonds inferred.
- Reusing the two broth materials avoids creating a fresh material every update. The flask explanation now conditions clear broth on initial sterilisation and protection from contamination, and explains tipped cloudiness as later growth under suitable conditions. The trapping estimate is explicitly not a sterility prediction.
- The Redi SVG's shorter two-line footer states the actual comparison, air admitted in both jars and fly access differing. It avoids the previous unqualified claim that only one experimental variable was exactly equal.
- Increased spacing in the Chapter 0 scale labels and swan-neck annotation, and between Chapter 5's "electron" and "carrier", does not change the scientific meaning. The revised Redi SVG viewBox height provides room for the second footer line. Actual clipping and mobile legibility remain for the coordinator's visual checks.
- The cover changes are appropriate. `ADP → ATP` avoids asserting a universal respiration yield; it is a symbolic chapter cue rather than a complete reaction. `A·T C·G` identifies pairing without drawing covalent triple bonds between DNA bases. `Energy` avoids presenting a universal 10% trophic efficiency.
- `overflow-wrap: anywhere` in mobile table cells can reduce minimum-content width and allow long entries to wrap. It does not change table content. This source review does not establish the measured width of the Chapter 14 table; the coordinator's 360 px check must do that.
- The new Chapter 0 domain test exercises real scene construction and update paths, so it will catch the missing import and obsolete primitive signatures that previously caused fallback. Its geometric finiteness assertions are useful but do not alone prove scientific agreement or visual readability.

## Review status

The primitive repairs, changed SVG wording, cover tokens and mobile wrapping rule have no further objection within this bounded source review. The open-jar branch mismatch is a concrete defect requiring correction. The scale and optics labels need the small qualifications described above. The coordinator is handling implementation and the full live, mobile, offline and WebKit verification; this note does not claim those tests passed.

## Independent resolution check

I rechecked the latest source after the coordinator's repairs. All findings above are resolved within this review's scope.

- The open-jar branch now tests `fc.lid === 'none'`, matching its definition. Its fly heights range from 0.45 to 0.80, inside the jar below the 1.6 lid plane. Covered-jar fly heights range from 1.72 to 1.90, above the barriers. The added semantic assertion in `ch00_atlas_domain.mjs` checks all ten particles in each of the three jars against that boundary. This directly covers the previously missed enum mismatch.
- The scale figure heading and readout now describe schematic size-order columns, and the plate explicitly says that heights are categories rather than a calibrated logarithmic axis.
- The water readout now identifies approximately 0.3 nm as O–O spacing; the nearby display label says molecular scale rather than assigning that width to the entire cluster.
- The microscope readout now calls its diffraction value a chosen ideal-optics estimate.

**Result: pass for the bounded independent source review, with no consequential unresolved defect found.** I did not repeat expensive browser or live-site tests. The coordinator's final visual and deployment checks remain the evidence for actual rendering, mobile fit, WebKit, offline behaviour and delivered-file freshness.

## Independent review of the cover popup cards

I read the current `source/app/m_cover.js` diff and its sixteen card definitions. The revised scientific summaries agree with the corrected explanations within their short introductory scope. They remove a universal ATP yield, the ATP-spring fiction, universal organelle claims, a guaranteed unburst freshwater cell, pH changes equated automatically with denaturation, all absorbed fats going directly to blood, electrical impulses jumping chemical gaps, an exact unvarying temperature, exact identical DNA in all mature cells, a one-gene eye-colour example and a universal trophic heat-loss fraction. The new DNA description distinguishes transcription, translation and folding, and the Mendelian example identifies ratios as probabilities. No consequential new scientific contradiction was found in these changes.

Two small question-to-answer gaps were sent to the coordinator. Chapter 6 asks about rising idli batter but its summary initially omitted the trapping of microbially produced gas. Chapter 7 asks why the stomach does not digest itself but its summary initially described nutrient processing and transport without the maintained protective barrier. These are opportunities to make each card answer its own question, rather than scientific errors in the revised sentences themselves.

The additional Chapter 0 camera-distance increases and shortened figure headings change framing and label burden. They do not change the model calculations or the previously reviewed scientific distinctions. This source review cannot establish mobile camera fit; that remains part of the coordinator's screenshot checks.

**Cover-card scientific agreement: pass within this bounded source review.** No implementation was edited and no expensive tests were repeated.
