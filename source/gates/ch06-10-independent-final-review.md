# Independent final review of the Chapters 6–10 revision

Reviewed 1 November 2026 against `source/research/ch06-10-editorial-review-2026-11-01.md` and the earlier independent science review. This review covered chapter changes, associated still-figure source, lesson text, live models and widget labels, guided enhancements and relevant Atlas definitions. No browser checks were repeated. No manuscript or implementation files were changed by this reviewer.

## Overall assessment

The revision preserves the scientific depth while improving the route through it. In Chapters 6–7, the mechanisms and qualifications remain available: chemiosmosis, carrier recycling, lactate reuse, complete oxidation, hydrolysis, monoacylglycerols, colipase, micelles, glucose cotransport and chylomicron/lymph transport. Moving the second fat-mass account and general droplet geometry into deeper notes has not removed those explanations. The added tracing exercises and retrieval table help the main teaching sequence.

The main Chapter 8 repairs are present: no universal 85/15 fluid-return rule, exercise distinguishes CO₂ production from arterial concentration, Harvey's smallest bound is qualified, and the capillary-time arithmetic is corrected. Chapter 9 now distinguishes a defined timing illustration from measured hot-pan withdrawal and appropriately limits the chemical synapse example. The TTX case tests local endplate depolarisation rather than assuming normal muscle contraction. Chapter 10 now separates transport rate from concentration threshold and uses a consistent chosen 330 mg/min capacity. Its case correctly identifies urine volume as a supplied observation, distinguishes negative tests from proof of perfect health, and qualifies vaccine protection.

The remaining problems found in this pass were chiefly contradictions in secondary representations, rather than missing main-chapter explanations.

## Findings sent to the parent during this review

### A. Nephron canvas mixed rate values and concentration units

At initial inspection, `source/live/w_nephron_filtration.js:180` displayed `reabsorbedGlucoseMgMin` as mmol/L, and line 270 placed `excretedGlucoseMgMin` into the final cell of a concentration ledger. This would show 330 mmol/L recovered in the high-glucose example even though 330 is a rate in mg/min. The textual readout already used the correct units, making the canvas and readout disagree.

The parent reports this is fixed to a rate ledger. Verify the final source/build includes that repair before declaring the gate closed.

### B. Guided enhancement captions retained old immunity and kidney assertions

Initial `source/live/enhancements.js:459–462` promised pathogen clearance before illness, stated an unqualified A-only binding rule, applied the same half-life description to placental and breast-milk protection, and gave an ORS number inconsistent with the current model. The parent has corrected the principal immunity captions and clarified that the 1924 renal evidence does not establish the model's chosen numerical parameters.

Two additional wording details remain useful to check at the final freeze:

- At approximately line 436, "plasma glucose climbs above ... 330 mg/min" compares a concentration with a rate. Say the **filtered glucose rate** exceeds capacity.
- At approximately line 443, "Each kidney nephron ... ~180 L/day" must identify 180 L/day as the **combined two-kidney** filtration illustration, not a single nephron's output. Likewise the 330 mg/min recovery capacity is aggregate.

The updated ORS caption no longer needs an asserted numerical dose or clinical prediction; its percentage is an illustrative support control.

### C. Chapter 9 transition still described electrical jumping across chemical synapses

At initial inspection, `source/src/ch09.md:558` said electrical impulses jump "across 20 nm synapses". This contradicted the repaired chemical-relay explanation and Chapter 10's corrected opening. The parent reports this sentence has been fixed. Preserve the distinction in the final build.

### D. Atlas Chapter 10 plate text still contradicted the repaired mechanisms

At the last source inspection before this note, `source/live/atlas/biology/ch10-homeostasis-nephron/chapter.js` retained these consequential problems:

- **Line 53:** insulin described as "opening GLUT4 channels". GLUT4 is a glucose transporter; insulin promotes its availability at the membrane in relevant tissues such as muscle and adipose tissue. This should not become the liver's universal glucose-entry mechanism. Use the main chapter's distinction between muscle uptake and liver glucose handling.
- **Line 66:** one glomerulus/capsule was described as receiving 180 L/day. State that this is the combined two-kidney adult illustration.
- **Line 69:** "PCT mitochondria actively reabsorb" glucose up to 330 mg/min. Mitochondria supply ATP; epithelial transport machinery performs reabsorption. Again identify the rate as an aggregate chosen model capacity, not one tubule's capacity.
- **Line 79:** vaccines said to generate an "immediate, 20-fold higher IgG surge" through memory B and T lymphocytes. The fixed multiplier and immediate response are not universal, and T cells are not antibody-secreting cells. Say immune memory can support a faster, stronger subsequent response; B-lineage cells produce antibodies, while T cells have other roles.

Nearby wording at line 57 can say **less toxic urea** rather than non-toxic. The primary issue is that visiting an Atlas plate should reinforce, rather than undo, the corrected chapter explanation.

These Atlas issues were sent to the parent before the final freeze.

### E. Primary-response Day 0 still reported memory already present

At inspection, `source/live/homeostasis_model.js:404–406` initialised `memoryCellsPresent = true` and did not change it for the no-prior-memory primary-response mode. A direct local Node evaluation of `immunityVaccineAccount(0, 0, 0)` returned zero primary and secondary antibodies but `memoryCellsPresent: true` and "Active immunity (lymphocytes + memory cells)". This contradicts the first-exposure/no-prior-memory scenario and its 0% memory control.

Distinguish prior antigen-specific memory from memory that can develop during a primary response. At minimum the stipulated first encounter on Day 0 should not report pre-existing specific memory. Do not impose an apparently measured universal day for memory formation merely to switch a Boolean.

This defect was sent to the parent before the final freeze.

## Cheap verification performed

Direct local evaluation of `nephronFiltrationAccount(0, 5, 125)` and `(3, 16, 125)` confirmed the repaired model's basic rate arithmetic:

| Quantity | Comparison | High glucose |
| --- | --- | --- |
| Filtered glucose | 112.5 mg/min | 360 mg/min |
| Reabsorbed glucose | 112.5 mg/min | 330 mg/min |
| Excreted glucose | 0 mg/min | 30 mg/min |
| Daily excreted glucose | 0 g/day | 43.2 g/day |

The high-glucose example supplies an illustrative 3.8 L/day urine volume, consistent with the new case's stated scope. At that volume the daily glucose amount corresponds to approximately 63.2 mmol/L average urine glucose, not 30 mmol/L. A rate-based canvas ledger avoids needing a separate concentration conversion.

The same local model call confirmed the Day 0 memory defect described above. The ORS 80% illustration returned 544 mL/h uptake, 320 mL/h loss and +224 mL/h net balance; a numerical caption must follow those chosen values or remain qualitative. This is a model arithmetic check, not validation of a clinical dose-response relationship.

## Gate status

The main chapter-level scientific reconstruction and preservation of depth are satisfactory within this bounded review. This note is **not an unconditional final pass** while the Atlas Chapter 10 contradictions and primary-response memory state remain unresolved. The parent is handling the identified implementation fixes and final local verification. The final delivery should record their resolution and use the rebuilt artifacts.

## Coordinator resolution after independent review

The coordinator addressed the reported residuals before the final frozen build:

- Nephron canvas recovery and excretion values now carry mg/min labels; the ledger separates filtered, recovered and excreted rates.
- Chapter 9's closing transition now describes chemical relays across synapses.
- Chapter 10 enhancement captions distinguish filtered load from plasma concentration, aggregate both kidneys, bound immunity claims and identify the illustrative IgG decay model.
- Atlas plates describe GLUT4 transporters in muscle/adipose, liver handling separately, ATP-supported carriers, aggregate filtration/capacity and variable immune protection.
- The primary first-exposure model has no pre-existing memory on Day 0; a focused regression covers this state.
- The final verification snapshot is `/tmp/bio-ch06-10-frozen-final/snapshot`; final receipts are recorded in the coordinator handover record rather than inferred from this review.

These are coordinator fixes and verification claims, not a second independent review.

## Independent follow-up after the late Atlas repairs

I independently reread the final Chapter 6–10 Atlas chapter definitions, pure model modules, live registrations and relevant shared adapter paths, together with the Chapter 10 2D rate/memory fixes and guided captions. This follow-up is separate from the coordinator resolution above.

**Earlier findings A–E are resolved in the reviewed source.**

- **A:** The nephron canvas now labels recovery in mg/min and uses a separate filtered/recovered/excreted rate ledger. It no longer presents a transport rate as a glucose concentration.
- **B:** Guided captions distinguish filtered load from plasma concentration, identify kidney rates and daily totals as aggregate two-kidney examples, qualify vaccine protection and cross-recognition, and distinguish the chosen IgG decay example from breast-milk protection. The 1924 experiments are no longer offered as proof of the chosen numerical parameters.
- **C:** Chapter 9's closing transition uses chemical relays across synapses.
- **D:** Atlas Chapter 10 now identifies GLUT4 transporters in muscle/adipose and liver handling separately, attributes reabsorption to carriers supported by mitochondrial ATP, identifies 180 L/day and 330 mg/min as aggregate examples, and removes the universal immediate twentyfold immune-response claim.
- **E:** A primary first encounter on Day 0 reports no pre-existing memory. The Day 7 display transition is explicitly a chosen staging rule, not a universal measured onset.

The late Atlas changes also agree with the teaching mechanisms checked here. Chapter 6 no longer assigns a fixed aerobic ATP yield, measured rotor speed or oxygen dose-response to its schematic relay. Chapter 7 separates epithelial nutrient transfer, chylomicron/lymph transport and droplet geometry from digestion-rate prediction. Chapter 8 distinguishes arterial pressures from capillary pressures and open-air breathing pressure swings from closed-gas compression. Chapter 9 updates its plotted action potential when TTX changes, keeps the all-or-none schematic spike, and connects near/distant focus to the ciliary ring, ligaments and lens. Chapter 10 uses the same illustrative primary/secondary antibody curves as its 2D model; its 3D antibody page now identifies ORS as a paired 2D explanation rather than claiming an undrawn SGLT1 structure.

Two small copy residuals found during this follow-up were reported and then independently rechecked after the coordinator fixed them. The Atlas Chapter 9 readout now attaches millisecond timing to the **total synaptic delay**, rather than to neurotransmitter diffusion alone. The ORS guided caption now calls its percentage a chosen **support control**, rather than a dose, and identifies glucose and electrolytes. Both are resolved in the latest source inspected.

For cheap independent numerical checks, I imported the pure models from `/tmp/bio-ch06-10-complete/snapshot` and checked Day 0 primary memory, oxygen-linked relay availability, equal-volume droplet geometry, inhalation/exhalation pressure signs, TTX blockade versus the schematic full spike, matching 2D/3D antibody values at Days 0, 7, 14 and 28, and the 360/330/30 mg/min renal ledger with 43.2 g/day excretion. These checks passed. Fifteen selected source files matched that immutable snapshot byte for byte when compared, before the subsequent wording-only and camera refinements reported above.

**Independent follow-up result: pass for the bounded scientific and representation-agreement review.** No consequential unresolved defect was found in that scope. This is not a fresh visual, accessibility, offline or browser-runtime pass. I did not repeat the expensive browser checks, inspect concurrent Chapter 11–15 changes, certify the illustrative models as clinical predictors, or treat a source review as proof that a later delivery artifact includes the latest copy changes. The coordinator's final rebuild and verification must cover those delivered artifacts.
