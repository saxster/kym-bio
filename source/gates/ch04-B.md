# Chapter 4 — independent Gate B: reader, safety and feasibility

Reviewed 30 October 2026. Report only; this reviewer changed no chapter, story, figure or widget. Read the workspace instructions and local `SKILL.md`, `GATES.md`, `NARRATIVE.md`, `FORMAT.md`, relevant `BOOKPLAN.md` and `PLAYBOOK.md`, `grounding/ch04.md`, `src/ch04.md`, `src/stories/p-ramachandran.md`, `figs_ch04.py`, the three chapter widgets and their shared model. Line locations below refer to the version first reviewed. This is an independent prose/source-code and proposed-activity review, not a physical kitchen trial or rendered visual acceptance.

## Chapter 4

### 4.1 Water's sticky geometry and carbon's four hands

**Three-sentence explain-back:** A water molecule has an uneven spread of charge, so its partly positive hydrogen ends attract suitable partly negative places nearby. Carbon can make chains and rings, and the way smaller units are joined changes what a big molecule does, so starch and cellulose are different even though both can give glucose. Proteins use ordered amino-acid chains, while a fat or oil molecule can have one glycerol joined to three fatty acids instead of being a long repeating chain.

**Result:** The central misconceptions are avoided: neutral does not mean no partial charges, identical building units do not ensure identical properties, and triglycerides are not treated as ordinary repeating-unit polymers. One small mechanism bridge should be supplied; a section REWRITE is unnecessary.

- **FIX B1 — §4.1, paragraph beginning “Water can form useful interactions” (initial line 45): finish the sugar-side explanation.** The opening asks why water surrounds sugar while oil separates, but the answer identifies sugars as “polar” without showing which parts give water a suitable contact. The water-side mechanism has been taught; add the matching sugar-side step, such as sugar's multiple oxygen/O–H groups forming hydrogen bonds with surrounding water, contrasted with the largely nonpolar long tails of oil. As written, the reader can remember “sugar is polar” without connecting the lunch observation to molecular structure. Evidence: the opening at line 16, the water-only polarity figure, and the general solvent account in [OpenStax Biology 2e §2.2, Water's Solvent Properties](https://openstax.org/books/biology-2e/pages/2-2-water). This is a short missing bridge, not a request for a full dissolution thermodynamics calculation.

### 4.2 Folding the ribbon in Madras

**Three-sentence explain-back:** A protein chain cannot fold into just any drawing because atoms take up space and some turns would crowd them together. Its side groups attract, repel and interact with water, which makes some arrangements more stable than others and can bring distant parts into one useful pocket. The angle map rules out many local turns, but passing that test does not prove the shape of the whole protein.

**Result:** PASS for the sequence-only, rigid-protein and complete-fold-prediction misconceptions. The physical question precedes the plot name; the collaborators remain visible; chemical interactions are offered in addition to spatial restrictions.

- **CONSIDER B2 — §4.2, four structure levels (initial line 206): give the coils and sheets something visible to attach to.** The paragraph introduces primary, secondary, tertiary and quaternary structure rapidly, while the adjacent plate shows collagen strands, peptide-group rotation and clashes rather than a coil/sheet/whole-chain comparison. The labels are correctly described as names, not explanations, but a reader may acquire four words without a mental picture of the distinctions. A small coil/sheet/one-chain/several-chain sketch or one concrete chain example would earn the vocabulary. Evidence: comparison of the paragraph with `c4_folding()`; the source's [protein-structure account](https://openstax.org/books/biology-2e/pages/3-4-proteins) uses separate structural representations. Optional because this classification is not needed to follow the chapter's central causal argument.

### 4.3 The lock that bends the stick

**Three-sentence explain-back:** A folded enzyme brings the right chemical groups together with a substrate, and binding can change their shapes. Those contacts make a difficult reacting arrangement easier to reach, so more reactions succeed under the same conditions. The enzyme is regenerated and can work again, but it does not give the reaction free energy or change where equilibrium ends up.

**Result:** PASS for a rigid lock, an enzyme energy gift, one-use enzyme fuel and a changed equilibrium. The chapter supplies actual candidate mechanisms—positioning, charge stabilisation, proton exchange and distortion—rather than relying on the name catalyst. Forward and reverse barriers are consistent; no speed multiplier follows falsely from the ratio of drawn barrier heights.

- **CONSIDER B3 — §4.3 scene label and §4.2 school bridge (initial lines 242 and 251): “active site” arrives before the pocket earns its name.** The opening prose itself does this well: a visitor meets a pocket and its chemical groups before the formal definition. The scene banner pre-empts that sequence with “at the active site,” and the previous school bridge also uses the term. “At a protein's chemical pocket” would preserve the thing-before-name sequence. This is a small sequence issue, not a failure of the main explanation.

### 4.4 Why enzymes do not “die” when heated

**Three-sentence explain-back:** Warming can make molecules meet and react more often while the enzyme still has a useful shape. Strong heat can spoil that arrangement or make unfolded proteins stick together, so cooling afterwards does not always restore activity, and pH can change the chemistry even without unfolding the whole protein. We compare treated and fresh samples under the same measuring conditions, and we must not turn an invented curve into one failure temperature for every enzyme or every person.

**Result:** PASS for dead enzymes, universal optimum/fever thresholds, always-irreversible denaturation and peptide-chain cutting. The treatment-versus-assay distinction is unusually clear and useful. One familiar-observation wording needs correction.

- **FIX B4 — §4.4, egg example (initial line 388): “Heating cooked egg white illustrates” describes the wrong observable comparison.** Already cooked white has undergone the familiar visible aggregation; reheating it is not a reliable way to show the initial runny-to-firm transformation. Point to the familiar contrast between runny and cooked egg white, or say that an already cooked white is a familiar result of structural change, without inviting raw-egg handling or heating at home. Evidence: the paragraph's own denaturation/aggregation account and [OpenStax Biology 2e §3.4, Denaturation and Protein Folding](https://openstax.org/books/biology-2e/pages/3-4-proteins), which describes the cooking change. This is a will-it-show-the-stated-effect correction, not a request to add an egg experiment.

### 4.5 Forensic food tests

**Three-sentence explain-back:** Each test looks for a particular kind of substance or chemical feature, so a food can give several positive results at once. I compare the unknown with a known positive and a blank, and a failed control means I cannot trust the conclusion. A negative means the target was not detected in that test, while colour alone cannot tell me the exact nutrient amount or whether a protein is a working enzyme.

**Result:** PASS. Tests are tied to targets, observations and appropriate controls; empirical colour responses are not offered as exact nutrition measurements. The more detailed iodine, biuret and emulsion accounts connect observable changes with chemical contacts or scattering. “Reducing sugar” is introduced as a test category rather than falsely equated with every sugar.

### Case, continuity and voice

The Chapter 3 protein-doorway question develops into building units, spatial restrictions, selective chemical pockets, catalysis, loss of activity and tests of molecular identity. Lunch returns naturally in §4.5 and washing powder ties §4.4 to the final case; this is a connected investigation for a bright Mumbai reader. The headline's million-speed nickname is explicitly qualified. No exclamation marks or uncorrected purposeful “wants/tries” mechanisms were found. The many correct caveats can feel more procedural than vivid, but none warrants sacrificing accuracy or a section rewrite.

## Home, mentioned-activity and school-boundary audit

There is **one `:::home` and no `:::try`** in the finished chapter. The optional paper-strip model and the rejected potato/peroxide experiment in the grounding note are not activities assigned by the finished chapter; they must not be silently counted as home trials.

### §4.1 Water and oil: keep a comparison — SAFE; qualitatively feasible

Cooking oil, cool tap water, two small transparent containers, secure lids and a tray are ordinary Mumbai-flat materials. There is no heat, mains electricity, sharp preparation or chemical reagent. Gentle closed-container inversion, no tasting, spill cleanup and absorbent oil disposal are proportionate boundaries; no extra adult-only operation is introduced.

Taking “about half a teaspoon” as an illustrative 2.5 mL and assuming a cylindrical jar, Python gives settled layer thicknesses of **3.54 mm at 3 cm internal diameter, 1.99 mm at 4 cm, and 0.884 mm at 6 cm**. These are assumptions for visibility, not measured jar dimensions or a certified teaspoon volume. The stated quantity can make a visible separate phase in an ordinary small jar. A very broad container makes the layer thinner; residual detergent can stabilise droplets, tinted walls obscure the result, and vigorous mixing makes a long-lived cloud of droplets. Clean containers, gentle turning and the text's refusal to promise a fixed settling time address the important failure modes. The water-only control does not establish individual hydrogen bonds, and the chapter correctly says so. **No physical trial performed.**

### §4.1 opening sugar/oil observations — SAFE as casual observations

The opening mentions stirring sugar into water and adding oil, without assigning quantities, heating or tasting. These are ordinary cool-food-material observations. Too much sugar can leave undissolved crystals; the text appropriately says it “can” disappear rather than promising complete dissolution at any ratio. The only actual home protocol is the oil comparison above.

### §4.1 chemical breakdown/digestion comparison — evidence, not a home hydrolysis instruction

Purified starch/cellulose chemical breakdown is described as scientific evidence. No acid, heat or preparation method is supplied and the reader is not asked to carry it out. Do not turn it into a home acid-hydrolysis recipe. Human digestive-enzyme selectivity is not oversold as proof that no other chemical route could break cellulose down.

### §4.2 ribbon, paper drawing and molecular-model comparisons — conceptual; no tool hazard

The ribbon is an analogy and the drawings are thought comparisons. There is no assigned cutting, construction, outdoor collection or physical molecular-model experiment. The figure labels the projections and local-check limitation, so fitting a drawing is not called experimental proof of a full fold.

### §4.3 Buchner's cell-free preparation — historical evidence; not home culturing

Pressing/filtering yeast and comparing fermentation are historical descriptions, without a home replication request. They are not supplied as a recipe for growing, sealing or ingesting cultures. The story of the experiment does not assert that one purified enzyme was isolated or that fermentation has a single-step mechanism.

### §4.4 enzyme-treatment/activity comparisons — SCHOOL ONLY; workable design, not a complete bench method

The first instruction explicitly assigns preparation to a teacher. Matched enzyme amounts, treatment duration, subsequent assay temperature/pH, substrate and measurement method, untreated/no-enzyme comparisons and repeats give a usable experimental design. The unspecified enzyme/substrate pair and instrument prevent a numerical prediction of visible activity or an optimum; the text claims none. A teacher must select a risk-assessed pair and exact method rather than infer a home method from this comparison. No 6% pharmacy peroxide, liver dissection or universal zero-bubbles test remains in the chapter.

The egg reference is finding **B4**: retain it as a familiar result, not an instruction to reheat cooked white or handle raw egg. This reviewer neither handled egg nor heated enzyme preparations.

### §4.5 each of the five assays — SCHOOL ONLY; adequate boundary and conditional feasibility

All five are explicitly placed in a supervised school laboratory by the scene, figure and final safety paragraph. The paragraph requires teacher risk assessment, eye protection, labelled clean equipment, no tasting or mouth pipetting, teacher-managed reagent preparation/hot baths and laboratory waste collection. These boundaries agree with the hazards and clean-equipment requirements in [Pearson's food-testing practical](https://www.pearson.com/content/dam/one-dot-com/one-dot-com/uk/documents/subjects/science/GCSE-core-practical-sheets/cp3-testing-food.pdf). This is a target/observation map, deliberately not a replacement for the teacher's bench method.

- **Benedict's:** a teacher manages the hot bath; an appropriate reducing-sugar concentration and validated heating procedure are needed. Glucose positive and reagent blank allow interpretation; sucrose's possible negative result and lack of exact grams are stated. Scalding and reagent handling remain at school.
- **Iodine:** known starch and a blank distinguish a usable reagent response. Low starch content, sample colour and unsuitable preparation may hide a result; the shared limitations cover these. Iodine is a school reagent here, not permission to obtain a household substitute.
- **Biuret:** the teacher prepares/manages the alkaline copper reagent; eye protection and concentration-dependent alkali hazard are explicit. A suitable protein positive is needed; free amino acids or a correctly folded enzyme are not inferred from this test. Copper-containing waste is collected by the teacher.
- **Ethanol emulsion:** the clear ethanol extract is added to water, with a clear ethanol/water blank and processed oil positive. Droplet scattering can give a visible cloud, while pre-existing sample cloudiness is not accepted as evidence. No flames and no ethanol heating are explicit; do not combine the assay's ethanol with Benedict's hot-bath operation.
- **DCPIP:** standard vitamin C and a water blank check performance; dye acidity, food colour and other reducing substances can interfere. This is not a guarantee that any juice will give a legible endpoint or an exact vitamin mass. School preparation, handling and disposal instructions apply to this reagent too.

### Final washing-powder case — fictional reasoning; no home hot-detergent experiment

The case explicitly forbids reading it as a request to reproduce a wash, handles fabric/formulation/time alternatives, and uses a common-condition residual activity comparison rather than inferring denaturation from stain appearance alone. No reader operation requires handling hot detergent or concentrated powder. Product instructions are the appropriate practical boundary.

### Three live widgets — no physical exposure; source-level teaching limits checked

The barrier widget opens still, manually advances stages, leaves reaction endpoints unchanged and does not calculate a measured rate multiplier. Wrong chemistry has no productive catalytic lowering in the stated model. The conditions widget calls every parameter invented, compares new samples at each setting and labels the extra 0.15 heat-exposed surviving share, so returning a slider does not claim physical refolding. The food widget clears results on selection changes and blocks inference when controls fail; symbolic vials are not colour measurements. These are source-level checks only; rendered mobile/desktop and theme acceptance belongs to the separate visual verification lane.

## Story `p-ramachandran`

**Reader result:** PASS. The problem of a drawing that atoms cannot fit precedes the named map, and the story gives the geometric test rather than using the scientist's name as its explanation. It distinguishes local restrictions from the whole fold, the developing collagen investigation from a finished solo discovery, and a publication date from an imagined scene. It adds no physical home activity or safety issue.

- **CONSIDER B5 — story paragraphs beginning “The modern map bears” and “There is a powerful limit”: keep the evidence, reduce repeated editorial defence.** The collaborators, date distinction and local-versus-whole limit are valuable, but the story repeatedly pauses to explain how not to tell its own history, including “not an invented afternoon.” Some of that repeats the chapter and makes the human investigation feel like a gate report. Retain the true credits and limits while letting the physical problem—what would make a convincing model impossible—carry the ending. Evidence: the story's final four paragraphs compared with §4.2's evidence box and check. This is optional pacing work; inventing dialogue or a historical afternoon would be worse.

## Independent computations

Executed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I`; no biological outcome is implied:

```python
import math
# Assumed 2.5 mL oil, cylindrical jar diameter d in cm; answer in mm.
{d: 2.5/(math.pi*(d/2)**2)*10 for d in (3, 4, 6)}
# {3: 3.53677651315323, 4: 1.989436788648692, 6: 0.8841941282883075}
(90-20, 55-20, 90-10, 55-10, 10-20)
# (70, 35, 80, 45, -10)
max(((i/100, 2**((i/100-20)/20)/(1+math.exp((i/100-50)/4)))
     for i in range(8001)), key=lambda p: p[1])
# (42.69, 1.8912784758543053), invented model only, not a real enzyme optimum.
```

## Summary

**Initial findings: 0 BLOCKER, 2 FIX (B1, B4), 3 CONSIDER (B2, B3, B5).** All five three-sentence explain-backs avoid the target misconceptions; no whole-section REWRITE is required. The single home activity passes safety and estimated qualitative feasibility under its stated boundaries. The mentioned hot/reagent investigations remain at school; history, egg observation and the final wash case are not authorised home experiments. No physical trial or rendered-widget acceptance is claimed, and no build was required for this report-only review.

### Final source confirmation, same review session

Re-read the two corrected passages directly in `src/ch04.md`, together with the correction entries in the grounding note and provenance ledger. **B1 is RESOLVED:** sugar's oxygen/O–H groups now provide the water-side hydrogen-bond contacts, and the long carbon/hydrogen regions of oil are explicitly contrasted. **B4 is RESOLVED:** the passage now points to the familiar runny-to-cooked change and explicitly says that this is an explanation, with no raw-egg handling or heat activity requested. Both changes preserve the chapter's scientific account and safe boundaries.

**Final outstanding required findings: 0 BLOCKER, 0 FIX. Gate B passes for prose, safety and estimated qualitative feasibility.** B2, B3 and B5 remain optional presentation choices at the time of this confirmation; none blocks the gate. Physical trials and rendered-widget acceptance remain outside this report.
