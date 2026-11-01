# Chapter 6 — independent Gate B: reader, safety and feasibility

Reviewed 30 October 2026. **Report only; no author files changed.** This reviewer did not author the chapter, story, grounding, figures or models and did not read the writing-process chat. Read the applicable MyCode `AGENTS.md`/`CLAUDE.md`, local `SKILL.md`, `GATES.md`, `NARRATIVE.md`, `FORMAT.md`, relevant `BOOKPLAN.md`, and `PLAYBOOK.md` principles, pipeline and §9; reviewed `src/ch06.md`, `src/stories/rotary-pointer.md`, `grounding/ch06.md`, `provenance/ch06.yml`, `figs_ch06.py`, `live/respiration_model.js`, all three Chapter 6 widgets and their final `live/enhancements.js` entries. Locations below refer to this review's source version. The user’s local-only and no-publication instructions take precedence over inherited publishing directions.

This is a Feynman read, proposed-activity review and independent mathematical/source-code check. It is not a physical trial, a full Gate A fact/licence audit, or rendered visual acceptance. Final visual/technical QA is a separate lane.

## 6.1 Breathing is only the delivery service

**Three-sentence explain-back:** Breathing moves air, gas exchange moves gases across surfaces, and blood carries them, but the energy-transferring reactions happen inside cells. A root can receive sugar and oxygen without lungs and use its own enzymes to support ATP recycling and jobs such as taking up mineral ions. Plants keep respiring in light as well as darkness, and different cells have different equipment, so oxygen use in a mitochondrion is not a rule for every living cell.

**Result: PASS; no REWRITE.** A visible chest/root comparison precedes the ventilation, gas-exchange and cellular-respiration distinctions. The address is not offered as a mechanism: delivery, enzyme reactions, ATP-supported tasks and heat have separate roles. Buchner’s cell-free preparation is a clue that chemical activity does not require breathing, not a claim that a preparation duplicates all cellular metabolism. ATP is a reusable participant, and energy is transferred rather than created. The red-cell/microbial exceptions prevent the convenient falsehood that all cells consume oxygen in mitochondria. The plant-day/night misconception is explicitly retrieved and rejected.

The card follows teaching and supplies the required five core and three deeper questions. ATP/ADP and the distinction between whole-reaction free energy and isolated bond breaking are established earlier in the book and retrieved here; they are not unexplained new initials imposed on this section.

## 6.2 A membrane between the fuel and the work

**Three-sentence explain-back:** Glucose is processed into smaller carbon compounds, making a little ATP and putting electrons onto reusable carriers, while later carbon reactions can release its carbon as carbon dioxide. Passing the electrons towards oxygen powers hydrogen-ion pumping across the inner mitochondrial membrane, and oxygen receives electrons and hydrogen ions to form water. When hydrogen ions return through ATP synthase, their stored concentration and charge difference drives rotation and shape changes that support ATP formation, so a leak can spoil this link even if electrons still move.

**Result: PASS; no REWRITE.** The opening explicitly rejects “mitochondria make ATP” as an explanation and the miniature-fire model. Sugar splitting, carrier loading, carbon removal, electron transfer, pumping, membrane storage, controlled return, rotation and catalytic changes are connected in small causal steps. The new pathway names follow their jobs; the section does not require memorising a name to understand an arrow. The matrix-to-intermembrane pumping and reverse return directions are consistent across prose, plate and widget. Concentration and electrical differences are both included, and the catalytic head does not rotate as one whole object.

The account keeps carbon, electrons and protons distinct. It avoids claiming that inhaled oxygen simply becomes CO₂, that protons become ATP, that ATP production all occurs at synthase, or that every cell has a fixed yield or rotational speed. Eventual carbon recovery is qualified against a first-cycle tagged-carbon interpretation. The no-oxygen widget state explicitly means sustained absence after residual gradient loss, preserving both temporary stored-gradient energy and possible glycolytic ATP.

The two cards follow their respective glycolysis and membrane mechanisms and have the prescribed question order. The pointer evidence explicitly identifies ATP-driven breakdown in isolated F₁, so it does not falsely claim to film proton-driven synthesis in an intact mitochondrion. Its historical place/year is a published result, not invented laboratory scenery.

## 6.3 The atoms do not turn into heat

**Three-sentence explain-back:** Fuel atoms get new partners instead of turning into heat, and the products can weigh more than the fuel because oxygen also enters. For this representative fat model, one kilogram of fuel combines with about 2.90 kilograms of oxygen to form about 2.81 kilograms of carbon dioxide and 1.09 kilograms of water. The separate roughly 84% and 16% numbers assign only the original fuel’s material between those destinations using an extra oxygen-exchange assumption, so they are not total product masses or a prediction of someone’s body weight.

**Result: PASS; no REWRITE.** Missing material comes before formula mass and the two-ledger distinction. The equation, worked sums, prose and model consistently include oxygen input. Nominal atomic masses and a representative triglyceride are disclosed; the chapter does not claim an exact universal fat composition. The 4/2 assignment of fuel oxygen is explicitly additional to balancing and is not animated as uniquely tagged atom trajectories. Four-decimal totals serve the worked account rather than being presented as measured human physiology.

The calculation has no dieting, exercise, calorie, body-size or voluntary-breathing target. Water’s later routes and storage are distinguished from formation, and the final card explicitly limits instantaneous scale predictions. The card follows both accounts and contains all eight required questions in order. The target misconception does not return in the explain-back.

## 6.4 Keeping the carrier ready for another round

**Three-sentence explain-back:** Glycolysis needs NAD⁺ to receive electrons, so it cannot keep running just because there is sugar if all that carrier stays as NADH. Fermentation passes those electrons to organic recipients and restores NAD⁺, allowing glycolysis’s two net ATP per glucose to continue without adding another ATP harvest at the recycling step. The yeast route makes ethanol and carbon dioxide while the lactate route makes no carbon dioxide, and lactate can form with oxygen present and be used again, so bubbles or their absence do not reveal the whole pathway or energy supply.

**Result: PASS; no REWRITE.** Finite carrier supply supplies a real bottleneck before the fermentation label. Recipient transfer explains regeneration rather than merely renaming it. Four formed minus two invested is repeatedly assigned to glycolysis; the recycling step is not awarded another two ATP. Yeast products, lactate products and variable mixed-community idli are kept separate. Lactate is not merely waste, proof of zero oxygen, or an explanation for next-day soreness.

Both central cards follow their respective mechanisms, with five core and three deeper questions in order. The idli rise is retained gas plus batter structure, not a species identification, total-gas meter or guaranteed overnight result. The human tracer evidence makes a specific inference—lactate carbon can contribute to expired CO₂—without pretending that one study measures every destination or every component of recovery.

- **CONSIDER B1 — school yeast-temperature proposal, `src/ch06.md:410–412`: name the experimental outcome as gas output under the chosen conditions.** The design already controls sample amounts, duration and measured temperature, includes a no-yeast comparison and repeats, and warns about leakage, dissolution and gas temperature. Because it appears beside fermentation, one additional sentence could make explicit that collected CO₂ alone does not show that oxygen was absent or distinguish aerobic metabolism from fermentation; it compares gas output under the chosen conditions. This is optional clarification, not a false claim currently made by the text. Evidence: the chapter’s own separate aerobic CO₂ account at lines 136–144 and its explicit non-identification limits for idli at lines 371–380; [OpenStax Biology 2e §7.5](https://openstax.org/books/biology-2e/pages/7-5-metabolism-without-oxygen) distinguishes electron-chain respiration from carrier-regenerating fermentation.

## School language versus full physiology

**PASS.** Independently compared the retained original official Cambridge 0610 2026–2028 syllabus PDF/text, Topic 12, printed pp.28–29, with all four `:::school` blocks. Uses of energy, aerobic word/balanced equations, yeast/muscle word equations and the Supplement yeast equation match the programme. The school yeast-temperature investigation is present; nothing is presented as independently verified IB wording.

Section 6.4 labels the Cambridge use of “anaerobic respiration” rather than silently substituting its broader biochemical meaning. The next paragraph explains electron-chain anaerobic respiration separately. The bridge attributes the continued fast-heart-rate, deeper/faster-breathing and liver aerobic-breakdown account to the syllabus. The adjoining full account expressly allows oxygen-present lactate formation, oxidation in other tissues, glucose production and recovery oxygen use beyond lactate handling. Thus the reader can learn the examiner-facing account without being told that all lactate is burnt only in the liver or that oxygen debt is a complete modern physiological model. Evidence: [official syllabus](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf), Topic 12.3 points 5–7; `src/ch06.md:383–424`; grounding’s primary lactate-tracer and review references.

## Story: A pointer too large to miss

**PASS.** The problem of seeing motion precedes F₁ and gamma-subunit names. The long visible pointer is a concrete bridge between the observed light signal and inferred shaft rotation. Supply, direction and apparatus limits are explicit: supplied ATP, isolated catalytic component, ATP breakdown, and inference to a rotary mechanism. The story does not imply that the observed fragment was a whole mitochondrial proton-driven turbine. The available Nature abstract/affiliations support the pointer principle and broad Yokohama location; no exact first-observation scene, dialogue, emotion or unsupported universal speed is invented. The complementary Boyer/Walker evidence and split Nobel recognition prevent a lone-genius replacement for the actual collaborators.

- **CONSIDER B2 — `src/stories/rotary-pointer.md`, Step 3 and the final two paragraphs: trim one repeated editorial warning.** The investigation is most absorbing when the reader asks what powered the turning and what the pointer establishes. Several consecutive paragraphs then tell her what the experiment did not establish and how a retelling must avoid overclaiming; some repeat the immediately preceding explicit reverse-direction distinction. Keeping the physical observation, direction-of-energy test and one sharp limit while shortening one general warning could improve momentum for a twelve-year-old. Evidence is the internal repetition across Steps 2–3 and the ending; this is optional pacing work, with no invitation to invent historical scenery or remove the scientific limit.

## Every activity: safety, feasibility and inference

There is **one `:::home`, no `:::try`, and one unboxed teacher-led school proposal**. The story contains no practical assignment.

| Location | Ordinary Mumbai home/school feasibility and safety | What it can establish |
|---|---|---|
| §6.1 root/chest comparison and Buchner history | Reasoning and historical evidence only; no replication of yeast extraction or isolated-organelle methods. | Breathing and chemistry are distinct; cell-free activity is evidence for a chemical system, not a complete model of a living organism. |
| §6.2 membrane-leak prediction, plates and explorer | Manual model exploration. No chemical uncouplers, membranes, mains equipment or living samples are proposed. | Explains coupling and sustained oxygen dependence; cannot measure cellular ATP, rotational speed, yield or the time to gradient loss. |
| §6.3 kilogram sample and slider | Mathematical sample only; no human intervention, breathing exercise, real weighing trial or body target. | Conserved-atom and proportional-mass accounts within the stated model; not a scale reading or individual oxygen-atom tracing. |
| §6.4 idli observation, lines 375–380 | PASS for a household already preparing familiar idli. Adult management is required in the first sentence. Ordinary batter, a clean transparent container, outside mark, headroom and loose cover need no specialist material or heat. The separate portion is never eaten; no raw tasting, close sniffing, experimental cultures, sealing or prolonged keeping is allowed. Adult cooking/disposal/cleaning, stopping at concerning appearance and handwashing are explicit. | Visible level and gas pockets can be recorded. Rise depends on retained gas and structure; neither a species, exact rate, universal equation, total gas nor food safety follows. No visible rise remains a valid result. |
| §6.4 yeast-temperature proposal, lines 410–412 | PASS as a teacher-led design idea, not a home bench recipe. Food-grade yeast/sugar, fresh matched portions, safe teacher-selected temperatures, repeats, no-yeast and room-temperature comparisons are included. The teacher chooses vented collection; pressure build-up, flames, tasting and chemical substitutes are excluded. No child handling of hot water or sealed fermentation is requested. | Comparisons concern collected gas under chosen conditions, with leaks, dissolution, gas temperature and prior heat damage acknowledged. No universal optimum, fermentation-only identification or exact ATP measurement is promised. The school’s concrete apparatus and risk assessment are still needed for execution. |
| Waterlogged-root case, lines 432–456 | Explicit fictional reasoning, not a request to flood a plant or make a sealed culture. | Distinguishes molecular O₂ from oxygen bound in H₂O and delivery from chemistry. Fermentation’s lower ATP return cannot guarantee survival; rice adaptations and environmental/species differences prohibit a universal survival time. |

**Estimated visibility, not a physical trial:** for a hypothetical roughly straight-sided container with cross-section 50 cm², retaining an additional 10 mL of gas would raise the batter surface by only 2 mm (`10 cm³ / 50 cm² = 0.2 cm`). The assumptions do not predict a real bowl’s gas production or rise; they explain why a visible mark, gas pockets and acceptance of “no visible rise” are sensible. A wider container, escaping/dissolved gas or changing structure can make a level comparison weaker. The activity wisely supplies neither a guaranteed gas amount nor an overnight doubling claim.

For the school proposal, an idealised equal amount of gas at equal pressure occupies `313.15 / 293.15 = 1.068224…` times the volume at 40 °C versus 20 °C. That approximately 6.8% temperature effect is a measurement confound, not a proposed pupil temperature range or biological rate; it supports the existing gas-temperature caution. No activity was physically performed for this review.

## Figures, models, cards, voice and continuity

The six original plates separate delivery/chemistry, carbon/electron paths, pumping/return, full-product/original-fuel ledgers, fermentation products and root oxygen supply. The caption/alt-text limits state enlargement, schematic geometry and absent kinetic claims. The three widgets register as static/manual lessons. The relay changes focus rather than advancing a clock; the carrier model keeps two net glycolytic ATP and zero extra fermentation-recycling ATP; the oxidation model scales incoming oxygen as well as products, including at zero sample. The final enhancement challenges require inspecting comparison endpoints and ask for explanations; their interaction checks are not evidence that a reader has understood her typed explanation. No autonomous motion, microphone or sensor requirement is introduced by these new sources.

All **six** Understand-it cards have exactly the required five core questions followed by three deeper questions, after the relevant teaching. Inspected `build.py:387–416`: the renderer adds the one-sentence Your-turn notebook check, so it is not missing from authored Markdown. One `:::check` occurs per numbered section. There are no chapter exclamation marks, object desires, invented Amar memories or unexplained universal biological promises.

The opening directly picks up Chapter 5’s carbon, phloem and root-supply problem; its recall rejects day-only photosynthesis/night-only respiration. The membrane relay develops the earlier ion-gradient account rather than replacing it with a turbine label. The ending moves naturally from already-small fuel inside cells to Chapter 7’s digestion and absorption question. Chapter 7 itself is not yet reviewed here; this is a continuity assessment of the outgoing bridge, not acceptance of unwritten material.

## Independent computation receipt

Ran locally with `python3 -I`:

```text
Fuel/O₂/CO₂/H₂O proportional masses: 860, 2496, 2420, 936
1 kg total input = total output = 3.902325581395349 kg
Original-fuel fractions: 724/860 = 0.8418604651162791
                         136/860 = 0.15813953488372093
Hypothetical retained-gas height: 10/50*10 = 2.0 mm
Hypothetical equal-mole gas-volume ratio: 313.15/293.15 = 1.068224458468361
```

Independently imported the actual `respiration_model.js` through a Node data-module and asserted full and original-fuel mass balance at 0, 0.1, 1, 2 and 10 kg; checked both relay oxygen conditions across all five focus stages; checked all three carrier routes across all five stages for two net ATP and zero extra fermentation ATP. All assertions passed. These checks validate stated mathematical/code accounts, not physical biology or rendered layout. No hosted CI, publication, remote Git operation or commit was performed.

## Final count

**0 BLOCKER, 0 FIX, 2 CONSIDER (B1–B2). Gate B PASS for prose, safety and estimated qualitative feasibility.** Each of 6.1, 6.2, 6.3 and 6.4 has exactly one three-sentence explain-back above; none reproduces its target misconception and no section is marked REWRITE. No required substantive correction is outstanding, so no mandatory independent correction-confirmation cycle remains. Optional changes should preserve the inference limits, the historical energy direction and the full-physiology correction.

### Final independent reviewer confirmation — 30 October 2026

Re-read the current school-investigation paragraph and surrounding fermentation/lactate, caution, Cambridge-bridge and retrieval passages, the pointer story’s experimental-direction explanation and ending, and the new grounding/provenance gate-decision records. **B1 is RESOLVED:** `src/ch06.md:412` now says, “CO₂ collection alone cannot establish that fermentation is the only pathway or that oxygen is absent.” This correctly limits the inference without equating gas absence with no metabolism, confusing an oxygen-present lactate route with aerobic electron transport, or changing the safe teacher-led design. It is consistent with the chapter’s separate aerobic carbon-dioxide account and the original Gate B observation; no new factual claim or experiment is required to resolve it.

**B2 remains an optional editorial suggestion, deliberately not adopted.** The retained story still states the supplied-ATP breakdown direction, distinguishes it from proton-driven synthesis, and asks a useful final evidence question. Its repeated emphasis is a pacing choice, not a factual or safety defect. The grounding and provenance accurately record adoption of B1 and retention of B2.

**Final Gate B decision remains PASS: 0 BLOCKER, 0 FIX; two original CONSIDER findings, of which B1 is resolved and B2 is retained as an acknowledged optional choice.** All four explain-backs remain valid and no section requires REWRITE. No required substantive issue or pending correction-confirmation cycle remains. This confirmation makes no claim about the separate final rebuild, browser test harness or rendered QA, which must retain their own execution receipts.
