# Chapter 6 — independent Gate A

**PASS — 30 October 2026.** Report only. The checker did not author the chapter and reviewed finished artifacts, not writing-process discussion or final QA claims. No source, figure, widget, story, ledger or earlier chapter was edited. This is a facts/fidelity/provenance assessment; it does not replace Gate B or browser visual acceptance.

## Scope and evidence

Read `SKILL.md`, `GATES.md`, `FORMAT.md`, `NARRATIVE.md`, the relevant `BOOKPLAN.md` and `PLAYBOOK.md` requirements; then `grounding/ch06.md`, `src/ch06.md`, `figs_ch06.py`, `live/respiration_model.js`, all three Chapter 6 widgets, their appended `live/enhancements.js` entries, `src/stories/rotary-pointer.md`, and `provenance/ch06.yml`. Grounding assertions were checked against actual source material rather than treated as independent corroboration.

Fresh web reopens succeeded for OpenStax Biology 2e §§7.2–7.5; Buchner's translated primary communication; Mazzeo's primary abstract; Brooks's review abstract; the Colmer primary abstract; the 2010 idli paper; and the three cited etymological entries. Nature, Nobel and BMJ direct web requests failed, so the actual locally saved primary content was reopened: Nature abstract/metadata, official Nobel 1978/1997 HTML text, and the three-page publisher-formatted BMJ PDF/text from its recorded teaching mirror. The BMJ first-page rendered image was also inspected. The original MIT 7.014 lecture 7 and 7.012 lecture 5 transcript text and official Cambridge 2026–2028 v3 Topic 12 text were inspected.

Access limits remain material: Noji's subscription full paper was not read; the 1965 idli PMC landing text/abstract was read, not a verified complete reading of its scanned pages, and the erratum's correction contents were not accessed. Mazzeo and Colmer support the checked claims at abstract level; Brooks is a review, not the original tracer experiment. Lifson 1949 was not independently read. Nothing in this PASS claims those missing accesses occurred. The chapter restricts its claims accordingly.

## §6.1 — delivery versus cellular chemistry

**No BLOCKER/FIX/CONSIDER finding.** Ventilation, exchange, transport and cell reactions are separated. The mature mammalian red-cell exception, microbial alternatives and simultaneous plant photosynthesis/respiration prevent the plan's overbroad mitochondrial/oxygen wording from being inherited. ATP cycling and the whole hydrolysis account avoid energy creation or an isolated bond-breaking explanation. Buchner's 1897 filtered-juice experiment supports cell-free fermentation without implying a purified single enzyme or a complete intact cell: [primary translated communication, especially filtration and conclusions](https://web.lemoyne.edu/~giunta/buchner.html). The human gas arrows in `c6_routes` run O₂ air→blood and CO₂ blood→air.

## §6.2 — carbon, electrons, membrane and ATP

**No BLOCKER/FIX/CONSIDER finding.** [OpenStax 7.2](https://openstax.org/books/biology-2e/pages/7-2-glycolysis) and the MIT transcripts support the investment/payoff and finite-carrier sequence. [OpenStax 7.3](https://openstax.org/books/biology-2e/pages/7-3-oxidation-of-pyruvate-and-the-citric-acid-cycle) supports one carbon lost from each pyruvate before cycle entry. The text expressly avoids assigning the newly entering carbons to first-turn CO₂.

In `c6_membrane`, `respiration_relay` and its enhancement: matrix is below, intermembrane space above, pumping points up/out and return points down/in; the ATP-forming head is matrix-facing and stationary as a whole. Electron routes are separate from proton and carbon routes. The oxygen endpoint is water, consistent with [OpenStax 7.4](https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation). Leaks impair coupling; no universal yield, speed or proton ratio is asserted. The lack-of-O₂ comparison is explicitly sustained absence after residual gradient loss, with glycolytic ATP separately possible. Stages are attention/focus states, not biochemical seconds.

The [official 1978 Nobel release](https://www.nobelprize.org/prizes/chemistry/1978/press-release/) supports Mitchell 1961, indirect coupling and both gradient components. It does not substantiate a 1961 sighting of rotation, and none is claimed.

## §6.3 — two distinct mass accounts

**No BLOCKER/FIX/CONSIDER finding.** The independent nominal-mass calculation confirms the material ledger and approximate original-fuel allocation. The [BMJ primary article](https://www.bmj.com/content/349/bmj.g7257), read in its [publisher-formatted mirror copy](https://yosemitefoothills.com/Science-1A/Handouts/Week-10/CalculationOfMassLoss-bmj.g7257.full.pdf), supports the distinction between total products and the original-fat contribution. The chapter correctly treats four/two oxygen assignment as an additional approximate exchange-based account, not a consequence uniquely determined by stoichiometry. It does not present 0.84 kg as total CO₂ or animate uniquely tagged oxygen paths.

The rendered BMJ page really does contain inconsistent intermediate average-formula arithmetic: three C17.4H33.1 groups plus the printed additions would give C55.2H105.3, not its printed C54.8H104.4. The grounding caution is justified. The chapter neither reproduces that derivation nor claims its chosen C55H104O6 represents every mixture. Fat is essential material; no diet, body target, rate or breathing intervention is prescribed.

## §6.4 and the waterlogged-root case

**No BLOCKER/FIX/CONSIDER finding.** `c6_fermentation`, `carrier_routes` and its enhancement place two net ATP in glycolysis and zero extra ATP in the taught fermentation recycling reactions. NAD⁺→NADH collection and NADH→NAD⁺ restoration are consistent; the schematic explicitly omits full NAD proton balance. Yeast and lactate carbon outcomes differ. [OpenStax 7.5](https://openstax.org/books/biology-2e/pages/7-5-metabolism-without-oxygen) supports carrier regeneration and distinguishes fermentation from anaerobic electron-chain respiration.

The 1965 [primary idli abstract](https://pubmed.ncbi.nlm.nih.gov/14325884/) supports L. mesenteroides in the studied batters; the [2010 starter study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3551100/) supports bacteria plus yeast. Neither is turned into a universal kitchen species/equation claim. The unaccessed erratum remains a disclosed source limitation; no numerical 1965 result is reused. [Mazzeo 1986](https://pubmed.ncbi.nlm.nih.gov/3080398/) supplies tracer evidence for lactate oxidation; [Brooks 2018](https://pubmed.ncbi.nlm.nih.gov/29617642/) supports aerobic lactate formation and metabolic reuse. The chapter avoids the zero-oxygen switch, liver-only fate and delayed-soreness claims.

The labelled school bridge matches [official Cambridge 0610 v3, printed pp28–29](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf): balanced aerobic/yeast equations and oxygen-debt detail are Supplement. It identifies the liver/oxygen-debt account as exam wording alongside modern qualifications, without claiming verified IB wording. The root case separates bound water oxygen from molecular O₂ and allows adaptation-dependent outcomes. [Colmer's primary abstract](https://academic.oup.com/aob/article-abstract/91/2/301/131033) supports internal rice aeration; no survival time or universal anatomy is inferred. No home flooding/culturing task is assigned. Home feasibility/safety acceptance belongs to Gate B; this report does not claim a physical trial.

## Story — A pointer too large to miss

**No BLOCKER/FIX/CONSIDER finding.** The [Nature primary abstract and metadata](https://www.nature.com/articles/386299a0) confirm all four collaborators, fluorescent actin attached to gamma, ATP-supplied rotation, both Yokohama affiliations and issue date 20 March 1997. The story carefully calls this a published result, with no invented first-observation scene, dialogue or emotion. It distinguishes isolated F₁ ATP-breakdown rotation from proton-driven synthesis. The [official 1997 Nobel release](https://www.nobelprize.org/prizes/chemistry/1997/press-release/) supports Boyer's binding-change work, Walker's complementary structure and the half-prize shared by Boyer/Walker; Skou's different enzyme received the other half. No lone-discoverer or full-prize error remains.

## Independent numerical and local checks

Ran `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I` with fresh calculations using nominal C12/H1/O16:

| Account | Independently recomputed result |
|---|---|
| Glucose atoms | C6/H12/O18 on both sides |
| Glucose masses | 180 + 192 = 264 + 108 = 372 |
| Fat atoms | C55/H104/O162 on both sides |
| Fat masses | 860 + 2496 = 2420 + 936 = 3356 |
| Per 1 kg fat | 2.9023255814 kg O₂; 2.8139534884 kg CO₂; 1.0883720930 kg H₂O |
| Original-fat allocation | 724/860 = 84.18604651%; 136/860 = 15.81395349%; sum 100% |
| Per 10 kg fat | 29.023255814 kg O₂; 28.139534884 kg CO₂; 10.883720930 kg H₂O |
| Glycolytic ATP | 4 − 2 = 2 |
| Yeast atom balance | C6/H12/O6 = 2 ethanol + 2 CO₂ |

Exact rational checks passed at sample masses 0, 0.1, 1, 2 and 10 kg. A separate Node execution of the actual model passed total and assigned-mass conservation at every 0.1 kg slider setting (101 samples), and examined all relay oxygen/stage and carrier route/stage combinations. `build.py --only 6 --out /tmp/ch06-gate-a.html` exited 0 (2,533 KB, three live widgets). Generated output contains OpenStax access-for-free text plus named OpenStax authors and MIT faculty attribution.

Compared all 199 protected baseline records independently: all 198 non-enhancement files retain their recorded SHA-256; removing only the three appended Chapter 6 enhancement entries reconstructs the exact 30,551-byte original enhancement file/hash. No earlier source/plan correction was smuggled in. No Git operation, publication, hosted CI or remote mutation was performed.

## Licence, provenance and decision

Every numbered section, new figure, new story and model has a Chapter 6 provenance entry. Art is original schematic code; no source photographs, copied diagrams, quotations or PDB coordinates appear. BMJ's actual CC BY-NC 4.0 notice is recorded; the book's original work is CC BY-NC-SA 4.0. MIT/OpenStax teaching spines and named contributors are attributed in generated credits. The OpenStax AI restriction is acknowledged under the existing recorded source-use decision; this assessment does not claim permission was granted or terms waived. Nature/Nobel/Cambridge and other research are used for cited facts, not copied protected expression.

No required correction found in the reviewed finished snapshot. Subsequent substantive changes require rechecking the affected material. This PASS is limited to the reviewed scope and access limits above.

**Final counts: BLOCKER 0; FIX 0; CONSIDER 0. Edits to authored artifacts: 0. Gate A: PASS.**

## Final-source confirmation after the optional B1 clarification

Independently rechecked the finished source on 30 October 2026 after the author adopted the sentence in §6.4: “CO₂ collection alone cannot establish that fermentation is the only pathway or that oxygen is absent.” This is scientifically correct: the already checked aerobic glucose and yeast fermentation pathways both produce CO₂, so a collected-gas observation alone does not discriminate between them or establish the oxygen condition. Its placement beside gas collection, leaks, dissolution and temperature qualifications strengthens the observation/inference distinction. No new quantitative or historical claim is introduced.

Verified by SHA-256 that removing exactly this single sentence reconstructs the chapter previously reviewed, byte for byte. The final chapter hash is `aef4257fb6b5cf9e64df080aa8057baebe1518f47b0c0ee0a7476d3511244f34`. Reopened the final story ending, figures and model/widget files; the story, all six figures' source, model, three widgets and enhancement entries retain exactly their reviewed hashes, so no late scientific wording or mechanism has changed there. The grounding/provenance additions accurately record the optional clarification and the decision to retain the story ending. Retaining its pacing adds no factual error.

The QA harness adjustment described by the coordinator is outside this source gate; this confirmation does not assert that the subsequent full visual runner has completed. No authored artifact was changed by the checker.

**Final-source Gate A remains PASS: BLOCKER 0; FIX 0; CONSIDER 0; required corrections outstanding 0.**
