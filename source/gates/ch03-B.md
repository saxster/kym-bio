# Chapter 3 — independent Gate B: reader, safety and feasibility

Reviewed 30 October 2026. Report only: no chapter, story or figure edits. Read `GATES.md`, `NARRATIVE.md`, relevant `BOOKPLAN.md`, `FORMAT.md`, local `SKILL.md`/`PLAYBOOK.md`, `grounding/ch03.md`, `src/ch03.md`, and both assigned stories. This is a prose and proposed-activity review, not an assertion that the activities have been physically trialled or the widgets visually accepted.

## Chapter 3

### 3.1 Blind bounces, not wishes

**Three-sentence explain-back:** Molecules keep bouncing about without choosing where to go. If one equal-sized space has more molecules, usually more cross out of it than cross back, so the difference gets smaller. When the concentrations balance, molecules still cross both ways and the numbers wobble a little.

**Result:** PASS for the central misconception. The train analogy explicitly discards human decisions; concentration is defined with volume; dynamic equilibrium is not frozen motion. The food-colouring observation is correctly separated from the model and from proof of a molecular mechanism.

- **CONSIDER B1 — §3.1, paragraph immediately before the Diffusion card (line 52): unexplained symbols before a use for the number.** The reader encounters `kᵦT` and a very small joule number without being told what `kᵦ` or `T` mean or what she can compare that number with. It adds a memorisable label after an otherwise excellent mechanism. Either explain the symbols, connect the quantity explicitly to temperature and a meaningful comparison, or place the calculation in a folded extension. Evidence: the text itself; independent Python gives `1.380649e-23 * 300 = 4.141947e-21 J`, so this is a reader issue, not a numerical error.

### 3.2 Water potential and the selective gate

**Three-sentence explain-back:** A membrane has different routes, and a water channel lets water through faster without deciding which way it goes. Dissolved stuff and pressure change which side water tends to move towards overall, even though molecules keep crossing both ways. A wall or other support can let pressure build until it balances a solute difference, so equal water movement does not require equal sugar concentration.

**Result:** Central misconception avoided; a focused explanatory revision is needed. The aquaporin is earned by a difference in observed swelling, and charge/chemistry prevent the false kitchen-sieve model. The most difficult conceptual bridge is solute/pressure to water potential.

- **FIX B2 — §3.2, water-potential introduction and pressure example (lines 124–155): the reader can repeat the predictor before understanding the account.** “Reduce its capacity for net outward transfer” and “water's capacity to drive transfer” are abstract restatements; substituting a made-up quantity for “water potential” leaves much of the explanation unchanged. The supported compartment appears only after the new term and diagram, and negative MPa values have no zero reference. Bring the concrete supported-compartment comparison before the name: water initially enters the sugary compartment, the supported boundary lets pressure rise, and that pressure progressively opposes entry; then attach the combined quantity and show why −0.30 is higher than −0.80. State that pure water at the reference pressure is assigned zero and that MPa means a million pascals, or link to the earlier pressure explanation. No need to replace this with false “salt sucking” or universally lower “water concentration.” Evidence: sequence in lines 124–155 and the grounding note's pressure-plus-solute requirement; Python confirms `−0.80 + 0.50 = −0.30 MPa` (floating-point representation aside). The current three-sentence explain-back is possible, so a whole-section REWRITE is not required, but this missing bridge should be fixed.

### 3.3 Balloons inside boxes

**Three-sentence explain-back:** In dilute water, water can enter both animal and plant cells. The plant wall resists expansion, so pressure builds and the cell becomes firm, while a red blood cell can swell too far and burst. Losing water reduces that firmness, and only when the contents visibly pull away from the wall do we call it plasmolysis.

**Result:** PASS for central misconceptions. Wall and membrane remain distinct, the vacuole boundary omission is disclosed, salt entry is not made the necessary cause of shrinkage, and limp tissue is not falsely presented as direct evidence of plasmolysis.

- **CONSIDER B3 — §3.3 home activity, “suitable scale” (lines 254, 258): say what scale is useful.** A 60 × 5 × 5 mm strip occupies about 1.5 cm³ and has an order-of-magnitude mass of 1.5 g if density is approximated as 1 g/cm³. An illustrative 5% change is about 0.075 g per strip or 0.225 g for three together, smaller than a common 1 g kitchen-scale increment. Specify that a 1 g scale can prepare the salt approximately but is too coarse for small strip-mass changes; weigh each three-strip group with a 0.1 g or finer scale if available, or keep the length/firmness observations. This is not a promised 5% biological outcome. Evidence: Python calculations below. The current warning that a scale must be suitable prevents this from being a safety blocker.

### 3.4 Pushing uphill: roots and the salty sea

**Three-sentence explain-back:** ATP can power one protein to send hydrogen ions out of a root cell. Another protein uses their downhill return to bring nitrate in, so nitrate uptake can keep going even when nitrate is already more concentrated inside. A mangrove manages salt and keeps its water potential low enough for water to enter by itself; it does not spend ATP pumping the water uphill.

**Result:** PASS for the nitrate-pump/water-pump misconceptions, with a definition qualification needed. The two-protein relay is sufficiently explicit, the Skou assay is not oversold, salt exclusion alone is not offered as the mangrove answer, and the continued ATP requirement is explained.

- **FIX B4 — §3.4 opening and active-transport note/card (lines 283, 307, 325): concentration-only wording needs an ion qualification.** The prose correctly introduces electrical forces and the combined electrochemical gradient, but the portable definition again says “against a concentration gradient.” The opening also suggests an open ion route must undo a concentration difference. For charged particles, electrical attraction can oppose the concentration tendency; concentration alone therefore does not establish the passive direction or identify active transport. Retain the school wording in `:::school`, but qualify the general account as energy-coupled movement against the relevant overall gradient, including electrical effects for ions. Evidence: `grounding/ch03.md` §3.4 and [OpenStax Biology 2e §5.3, Electrochemical Gradient / Moving Against a Gradient](https://openstax.org/books/biology-2e/pages/5-3-active-transport), which separately describes the opposing concentration and electrical effects for potassium. This adjustment prevents the short definition from undoing the fuller explanation.

### Case and chapter voice

The sailor case distinguishes cell-water redistribution from whole-body loss through salt excretion, and explicitly prohibits treating the case as a drinking experiment. No BLOCKER found. No exclamation marks occur in the chapter or assigned story prose; there is no uncorrected “wants/tries” mechanism. The final hibiscus sentence is a brief joke explicitly rejecting purpose, not a scientific explanation built on purpose. School bridges and folded cards are longer than the ordinary prose, but the main chapter remains coherent.

## Home and try audit — every activity

There are exactly two `:::home` blocks and no `:::try` blocks in `src/ch03.md`.

### §3.1 A drop with no spoon — SAFE; works as the limited observation stated

Food colouring, cool tap water, a transparent glass and a tray are available ordinary household materials; no electricity, heating, fumes or sharp tools are involved. A stable tray, no tasting and spill cleanup are appropriate. A glass can break, but the ordinary handling instructions do not create an unusual glass hazard requiring an additional approval flow.

Colour will visibly move, but a density plume, temperature-driven convection or adding the drop can dominate. The text already says so twice and never promises a pure diffusion rate. For scale only, assuming a small-solute diffusivity of `D = 10⁻⁹ m²/s` (an illustrative assumption, not a measurement of the unspecified dye), one-dimensional RMS diffusion displacement in 300 s is `sqrt(2Dt) = 0.775 mm`; reaching an RMS distance of 1 cm takes about 13.9 hours at that assumed D. Thus a dramatic centimetre-scale swirl within minutes must not be presented as molecular wandering alone. The current protocol passes this test; neither a fixed spreading radius nor a guaranteed “fully mixed after minutes” result should be added. If no visible change is apparent beyond the initial drop, recording that is a valid result.

### §3.3 Two cups, six strips — SAFE with adult cutting; qualitative feasibility good, precision limited

Potato, salt, water, cups and a ruler are readily available. Adult knife handling is explicitly the first instruction. No tasting, same-day disposal, handwashing and cleaning fit a warm Mumbai home; no live blood or animal experiment is proposed. The loosely covered cups do not form a sealed pressure vessel. Choose cups with enough clear interior length to submerge a 60 mm strip without bending it against the wall.

The solution is correctly defined as 5 g in 100 mL **final** solution, not 5 g added to 100 mL water and not seawater. The teaspoon fallback is honestly approximate. As a rough independent strength check, `50 g/L ÷ 58.44 g/mol = 0.856 mol/L NaCl`; an ideal fully dissociated model at 300 K gives `π ≈ 2cRT = 4.27 MPa`. Non-ideality, tissue composition and solute entry prevent this from predicting an exact potato response, but it confirms a substantial imposed osmotic difference rather than an implausibly weak treatment. Thirty to sixty minutes is a reasonable observation window for slender strips, not a guarantee that every potato gives a measurable length change.

Three strips per condition, one potato, equal immersion conditions, identical blotting, reporting spread and accepting unclear results are strengths. One ruler increment is `100 × 1/60 = 1.67%` of the initial length, so small changes are difficult to resolve; errors at both initial and final measurements compound. Mass limitations are finding B3. Firmness is the easiest visible/tactile endpoint, although it remains qualitative and repeated bending can damage tissue. Recovery is appropriately described as possible rather than assured. None of these observations directly establishes plasmolysis without microscopy.

### Other mentioned observations — correctly bounded

The Carter Road opener says to look from the public path and never asks the child to enter mud, tides or mangrove roots. If rewritten as an outdoor investigation, require an accompanying adult and retain the public-path boundary. The epidermis/salt activity is expressly “at school,” with no unsafe home preparation protocol; keep microscope sample cutting under school supervision. Frog-egg manipulation, crab membrane assays and red-blood-cell lysis are historical/conceptual descriptions, not home instructions. The sailor case explicitly states that it is never a drinking experiment.

## Story `p-agre`

**Reader check:** PASS. Observed permeability differences precede the name aquaporin; the added-protein/control comparison is clear; low permeability is not turned into zero permeability; faster water movement is not called an active pump. No home safety issue.

- **CONSIDER B5 — middle and closing paragraphs: repeated explanation of what counts as evidence slows the human story.** “A useful scientific question…”, “What did the comparison establish?”, “There are limits…”, and the final two paragraphs largely revisit distinctions already explicit in §3.2. Keep the crucial intervention, the control and the date distinction, but condense the repeated commentary and preserve room for the unknown-protein puzzle. Evidence: comparison with chapter lines 112–124; this is a pacing judgement rather than a factual defect. No invented dialogue or scene detail is needed.

## Story `p-skou`

**Reader check:** PASS. The story starts with unequal ion distributions and leakage, then earns the need for energy-coupled maintenance. It accurately distinguishes a candidate enzyme from a complete transport movie and distinguishes the crab pump from the root relay. No home safety issue.

- **CONSIDER B6 — final five paragraphs: the story increasingly retells §3.4 rather than developing Skou's discovery.** The paragraphs on two ledgers, the root proton relay, water not being pumped uphill and protein presence not proving function are individually useful but collectively duplicate the chapter. Condense them into a short link back to the chapter and let the experimental question carry the story's ending. Evidence: story paragraphs beginning “For Chapter 3…”, “This distinction…”, “The root…”, “Nor should…” and “The story's useful habit…”. This is a pacing finding, not a request to add unsupported historical colour.

## Computation record

Executed independently with `python3 -I`; all estimates above disclose their assumptions:

```python
import math
1.380649e-23 * 300                   # 4.141947e-21 J
math.sqrt(2 * 1e-9 * 300) * 1000    # 0.774596669 mm
(0.01**2 / (2 * 1e-9)) / 3600       # 13.88888889 h
6 * 0.5 * 0.5                       # 1.5 cm³ per strip
3 * 1.5 * 0.05                      # 0.225 g illustrative grouped change
100 / 60                            # 1.666666667% per 1 mm
50 / 58.44                          # 0.855578371 mol/L
2 * (50/58.44) * 1000 * 8.314462618 * 300 / 1e6  # 4.268204629 MPa
-0.80 + 0.50                        # approximately -0.30 MPa
```

## Summary

**Initial findings: 0 BLOCKER, 2 FIX, 4 CONSIDER.** Two home activities pass safety review under their stated boundaries, with an optional scale-resolution clarification. All four numbered-section explain-backs avoid the target misconceptions; no wholesale section REWRITE is indicated. This report does not replace Gate A, a physical kitchen trial, or rendered-widget verification. No build was required because this reviewer edited no book content.

### Follow-up on main-agent revisions, same review session

Re-read the revised §3.2 and §3.4 prose after the main agent reported changes. **B2 is RESOLVED:** the concrete membrane-floor compartment and resisting lid now precede the name water potential; a pure-water zero reference and explicit less-negative comparison supply the missing number bridge. Expanding MPa remains optional vocabulary polish, not a surviving required fix.

**B4 is PARTLY RESOLVED:** the main explanatory paragraph, glossary note and card now explicitly include the electrical contribution for ions. The opening still says “Blind spreading through an open route would tend to undo the difference” immediately after a concentration-only question about an ion. Qualify that sentence with the electrical proviso, or frame the opening puzzle as transport against the combined gradient. This is the sole remaining required text correction at the time of this follow-up.

**Outstanding: 0 BLOCKER, 1 FIX (B4 opening only), 4 CONSIDER.** No other required reader or safety correction emerged from the follow-up.

### Final source confirmation, same review session

Re-read only the three subsequently corrected passages in `src/ch03.md`. **B4 is now RESOLVED:** §3.4's opening explicitly conditions passive spreading on electrical effects not opposing it. **B1 is addressed:** §3.1 now explains T as kelvin temperature and kᵦ as its conversion constant for the energy scale. **B3 is addressed:** the potato activity explicitly states that a whole-gram kitchen scale is too coarse for small changes in these strips. These corrections preserve the existing explanation and safe activity boundaries.

**Final outstanding required findings: 0 BLOCKER, 0 FIX.** B5 and B6 remain optional story-pacing choices. Gate B's prose, safety and estimated-feasibility review passes; the separate physical-trial and rendered-widget limitations stated above still apply.
