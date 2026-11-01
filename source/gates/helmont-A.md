# Helmont story correction — independent Gate A

Reviewed 30 October 2026, report-only. Scope: the user-authorised revision of `src/stories/p-helmont.md`, its `story:p-helmont` provenance record, follow-up notes in Chapter5 grounding/provenance, and the restored normal name/link in §5.1. Reviewer edited only this report. This follow-up supersedes the earlier instruction to retain the old story; the original preservation baseline remains immutable.

## Finding

### H1 — FIX — unsupported certainty about water in the weighing (REPORT)

**Location:** `src/stories/p-helmont.md:24`.

The story correctly says that the tree was not established to be dry at either weighing, then states that water “therefore formed part of its measured mass”. The latter is more certain than the historical methods establish. The absence of a stated tree-drying method makes water content an unresolved contribution; it does not document the actual water content or weighing preparation. Keep the conclusion at the level already used in Chapter5: unrecorded water content prevents treating the whole gain as new dry wood. For example: “The unrecorded water content therefore prevents treating the gain as new dry wood.”

**Evidence:** [Saupe's university-hosted attributed translation](https://faculty.csbsju.edu/SSAUPE/biol115/van_helmont.htm) explicitly describes drying the earth but gives no comparable tree preparation. The same page highlights missing methods. Its later exercise's assumed fresh/dry proportions are teaching assumptions, not measurements in the original account.

**Disposition:** REPORT → FIXED BY AUTHOR, independently confirmed. The final story says: “The unrecorded water content prevents treating the whole gain as new dry wood.” This states the evidential limitation without inventing a measured water contribution. Grounding/provenance record the correction.

## Verified facts and fidelity

Reopened the actual [Saupe university page](https://faculty.csbsju.edu/SSAUPE/biol115/van_helmont.htm). The story accurately retains the reported 200 pounds of oven-dried earth, 5-pound shoot, five-year interval, final169 pounds/about3ounces, soil loss about2ounces, rain/distilled water, perforated tin-plated iron lid and unweighed fallen leaves. It does not reconstruct an exact final soil weight, convert the uncertain pound standard to modern kilograms, or call the whole gain dry wood. The lid's dust-exclusion purpose is supported; its perforations did not isolate the plant from surrounding gases.

Pure arithmetic checked independently in `python3 -I`: `169−5=164` in the reported pound numbers, with the small reported ounce term additional; `1648−1644=4`. These are consistency checks only, not modern conversions, measured dry-mass gains or exact experiment dates. No ratio based on an assumed historical ounce/pound standard is introduced into the story.

Read [William B. Ashworth Jr.'s actual Linda Hall Library article](https://www.lindahall.org/about/news/scientist-of-the-day/joan-baptista-van-helmont/). It supports Flemish physician/medical chemistry, introduction of the word gas, later identification of gas sylvestre as carbon dioxide, death1644, son Franciscus Mercurius, and publication of the collected treatises as *Ortus medicinae* in1648. The article's rounded willow mass is not used. The revised story removes the invented house scene/c.1640 timing and private speculation about what van Helmont suspected. It does not claim he identified photosynthetic carbon uptake merely because he studied carbon dioxide.

**Birth-date caveat checked independently:** the publisher-indexed first page of [Partington1936, *Annals of Science*1:359–384](https://www.tandfonline.com/doi/pdf/10.1080/00033793600200291) includes the birth-register footnote distinguishing1579 Old Style from1580 New Style. Direct DOI/PDF access was unavailable; this is an indexed first-page check, not a claim to have read the full article or original register. Retaining metadata `born:1580` with the explicit modern-year convention in provenance is defensible. Saupe's1577 sidebar and Linda Hall's1579 lead are not silently treated as matching the modern-year metadata.

Modern carbon/material explanation agrees with the cited [OpenStax Biology2e8.1](https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis) and the already independently reviewed Chapter5: carbohydrate carbon comes from carbon dioxide; water contributes material; essential soil mineral ions have distinct roles; the original ledger does not identify every input. Subject to H1, the revised story and §5.1 agree on quantities, uncertainty, publication chronology and inference limits. Restoring the normal name in the chapter now links to a substantially corrected story.

## Provenance, licensing and preserved scope

The story record separately identifies the attributed historical translation, Linda Hall's biographical facts, the limited Partington access, and the modern conceptual source. Original prose contains no reproduced quotations, photographs or copied artwork; its CC BY-NC-SA attribution is consistent with the book. No claims of waived publisher terms or new historical measurement precision are added.

Inspected `tests/helmont-before.json` and `tests/helmont-authorised-corrections.json`: the original before hashes of the story and provenance agree with the existing preservation record, and the allowlist describes the explicit user authorisation. Current original-baseline differences are confined to the already authorised appended `book.css` print fix and `enhancements.js`, plus the newly authorised story and its provenance file. Chapters0–4 source files remain unchanged. Final after hashes must follow the final H1 correction, rather than leave an out-of-date approved story hash.

## Status

Initial counts: **0 BLOCKER, 1 FIX, 0 CONSIDER**. H1 resolved; **0 required corrections remain. Gate A PASS for the final corrected Helmont story and linked §5.1.**

Final confirmation, 30 October2026: reread the corrected inference paragraph and follow-up notes. Both exact authorised after hashes match the final story/provenance files; both recorded before hashes match the immutable original baseline. No additional baseline file differs outside the four explicitly authorised files (story, story provenance, appended print CSS, Chapter5 enhancement entries). No author files edited by reviewer; no build or hosted/remote action performed in this report-only review. The author's local rebuild/QA lane remains separate from this source/fact approval.
