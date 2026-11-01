# Independent scientific review of Chapters 6–10

Reviewed 1 November 2026. Scope: the current five chapter Markdown files, read in full, with targeted external checks of questionable claims. This is a bounded scientific audit, not certification of every historical, curricular or clinical statement. The chapter files have not been edited. Line numbers refer to the files as read on this date.

The strongest material to preserve is the distinction between respiration and ventilation, Chapter 6's separate carbon/electron/proton accounts, its accurate qualification of fermentation and lactate, and Chapter 7's distinction between droplets, molecules, micelles and chylomicrons. Most serious corrections occur in Chapters 8–10, where useful models repeatedly become universal physiological claims.

## Corrections to make first

### 1. Replace the universal 85% capillary reabsorption / 15% lymph account

**Location:** `source/src/ch08.md:394–397`, with repetitions at 420, 424 and 430.

**Current claim:** "about 85% of the filtered fluid returns directly into the venous capillary by osmosis", with the remainder returning as lymph.

**Assessment:** Substantive correction, high confidence. This is the traditional textbook Starling picture. It does not describe steady fluid balance in most tissues. Experimental work on the endothelial glycocalyx and the revised Starling principle supports slight steady filtration, including on the venular side, rather than the asserted universal return fraction. Transient absorption and specialised absorbing tissues remain possible. The correction should not become the opposite universal claim that capillaries never absorb.

**Minimal replacement:** "Pressure and the properties of the capillary barrier govern fluid exchange. In most tissues, a small net amount of fluid filters into the tissues, and lymphatic vessels return it to the blood. Some capillaries can absorb fluid under particular conditions." Keep oxygen and nutrient diffusion distinct from bulk water filtration. Delete the universal percentages and associated pressure-subtraction proof.

**Reason:** The current account would require later unlearning and obscures the importance of lymphatic return. The full glycocalyx theory need not be taught to make the explanation true.

**Sources:** Original experiment, [Adamson et al., 2004](https://physoc.onlinelibrary.wiley.com/doi/abs/10.1113/jphysiol.2003.058255). Explanation by the investigators developing the revision, [Levick and Michel, 2010](https://pubmed.ncbi.nlm.nih.gov/20200043/).

### 2. Correct the explanation of breathing during exercise

**Location:** `source/src/ch08.md:139`, reinforced by 137 and the school bridge at 148.

**Current claim:** During ordinary exercise, "the main trigger is carbon dioxide" and the brain detects an increased blood CO₂ concentration and lowered pH.

**Assessment:** Substantive correction, high confidence. Increased CO₂ production is different from an increased arterial CO₂ concentration. In moderate steady exercise, ventilation usually rises sufficiently to keep arterial CO₂ and pH near resting values. Neural signals associated with movement and feedback from working muscles contribute. A rise in arterial CO₂ is an important respiratory stimulus in other circumstances, but cannot be the whole normal-exercise explanation given here.

**Minimal replacement:** "Working muscles produce more CO₂. Neural signals associated with exercise increase breathing, helping remove that extra production while blood CO₂ remains near its usual level. Chemical sensors also help regulate breathing when CO₂, acidity or oxygen changes." Retain a clearly marked school simplification if the syllabus requires it.

**Reason:** This is an opportunity to teach successful regulation: a controlled variable need not rise substantially for the corrective system to work.

**Sources:** Original human experiment, [Wood, Fatemian and Robbins, 2008](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00820.2007). Original investigation of muscle-afferent contribution during prolonged exercise, [Iannetta et al., 2024](https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/JP286993).

### 3. Rebuild the quantitative kidney case around rates, not a concentration called a transport maximum

**Location:** `source/src/ch10.md:337`, 367, 542, 563, and especially the answer at 575–580.

**Current claim:** "transport maximum, T_m ≈ 10.5 mmol/L", followed by "16.0 − 10.5 = 5.5 mmol/L" left in the tubule.

**Assessment:** Substantive quantitative and mechanistic correction, high confidence. Renal glucose transport maximum is a maximum reabsorptive **rate**, such as mg/min. The plasma concentration at which glucose begins appearing in urine is a **renal threshold**. They are related through filtered load and variable nephron transport, not interchangeable. Water is also reabsorbed along the tubule, so the residual luminal concentration cannot be obtained by treating a plasma threshold as a fixed amount removed from every litre.

The case is internally inconsistent too. A residual equivalent of 5.5 mmol per litre of the original 180 L daily filtrate corresponds to 990 mmol/day, whereas the table at 556 claims approximately 260 mmol/day. The case does not derive 3.8 L/day from its stated glucose quantities.

**Minimal replacement:** Either make the case qualitative, or provide an explicitly invented but consistent rate ledger: filtered glucose per day = plasma glucose × daily filtration; urine glucose per day = filtered glucose − reabsorbed glucose. Treat urine volume as an observed case value, not an output proved by those two equations. Explain that excessive glucose delivery can exceed transport capacity while the glomerulus still admits glucose normally.

**Reason:** The central insight is good. A false calculation is unnecessary to establish it.

**Source:** Original human renal-transport study separating maximal transport from the threshold for urinary glucose, [Al-Jobori et al., 2017](https://pubmed.ncbi.nlm.nih.gov/28428225/).

### 4. Delete the claim of fatal dehydration in less than half an hour

**Location:** `source/src/ch10.md:319`.

**Current claim:** Failure to reabsorb the filtered glucose means "you would urinate away 180 g of sugar and dehydrate to death in under half an hour."

**Assessment:** Unsupported and false as a general prediction, high confidence. The chapter supplies neither a water-loss calculation nor physiological evidence for that timescale. People with inherited renal glucose transport defects can lose substantial glucose in urine, including reported losses exceeding 150 g per standardised body surface area per day. That does not imply a universal thirty-minute fatal course.

There is a separate conversion error in the same line. With glucose molecular mass 180, 5.0 mmol/L is 0.90 g/L, or 0.09 g/100 mL. At 180 L/day, that is 162 g/day. The chapter's 180 g/day follows from 1.0 g/L, approximately 5.56 mmol/L.

**Minimal replacement:** "Without sufficient reabsorption, useful glucose is lost in urine and can increase water loss." Choose one consistent glucose concentration for the numerical example.

**Sources:** [NIH Genetic Testing Registry description of familial renal glucosuria](https://www.ncbi.nlm.nih.gov/gtr/conditions/C3245525/); original human transport experiment above. The conversion is direct arithmetic from the manuscript's molecular mass and filtration volume.

### 5. Qualify normal urine, and remove diagnostic proof from a rounded zero

**Location:** `source/src/ch10.md:327–340`, 361, 397, 542, 553 and 573.

**Current claims:** Healthy urine has "zero protein"; "Zero protein in the urine proves the glomerular filtration barrier is completely intact"; plasma "protein (albumin)" is 8.00 g/100 mL.

**Assessment:** Substantive correction, high confidence. A negative or rounded urine test is not proof of perfect glomerular health. Normal urine can contain small amounts of albumin. A table entry of 0.00 must be identified as a rounded model value or a result below a stated detection limit. Furthermore, total plasma protein and albumin are different quantities. The 8 g/dL figure used here should not be labelled albumin.

**Minimal replacement:** "No abnormal protein was detected. That gives no evidence for the proposed major protein leak, and glucose is normally filtered even by an intact glomerulus." Relabel the plasma row "total plasma protein" if that is the intended measurement. Change universal zeros in explanatory prose to "normally virtually all glucose is reabsorbed" and "very little protein appears in urine". A stated school model can still use simplified zeros.

**Reason:** The case can discriminate among explanations without teaching that a single negative test proves an organ normal.

**Sources:** [NIDDK, albuminuria testing](https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/tests-diagnosis/albuminuria-albumin-urine); [FDA assessment recording normal urinary albumin at low but nonzero concentrations](https://www.accessdata.fda.gov/cdrh_docs/reviews/K182038.pdf).

### 6. Remove the universal mechanical-sieve claim

**Location:** `source/src/ch10.md:319` and 384.

**Current claim:** "No mechanical sieve in the world can let water and urea ... through while holding back dissolved glucose ... on size alone."

**Assessment:** The reasoning is false even within the chapter's simplified size-ordering argument. A smaller object passing a barrier does not prove that a larger object must pass it. Molecular mass is not itself a complete measure of hydrated molecular size or membrane permeability. The kitchen strainer demonstrates only that this particular coarse mesh passes both dissolved substances.

**Minimal replacement:** "The kidney's glomerular barrier admits glucose as well as water, urea and ions. Our kitchen strainer also passes both sugar and salt, but it does not reproduce the kidney's molecular-scale filter. In the kidney, glucose must subsequently be reabsorbed."

**Reason:** The activity's observation is useful; the impossible universal conclusion is not. No external physiological discovery is needed to see the logical failure.

### 7. Remove the exact hot-pan reflex latency and its downstream comparisons

**Location:** `source/src/ch09.md:10`, 29–34, 161–170, 283, 307 and 332.

**Current claim:** A hot-pan withdrawal takes approximately 35.9 ms, calculated using 72 m/s for the entire sensory-plus-motor route and two 0.9 ms synaptic delays.

**Assessment:** Substantive correction, high confidence about the unsupported generalisation. The described circuit includes **two central synapses plus a neuromuscular junction**, so its own counting is inconsistent. It also does not include heat transfer to receptors or sensory transduction. A maximum or chosen conduction speed cannot establish a normal thermal withdrawal time. Reflex latency depends on the afferents, stimulus, circuit, muscle and measurement method. Electrically evoked withdrawal studies should not be substituted directly for touching hot metal.

**Minimal replacement:** "A spinal withdrawal circuit can activate muscles without waiting for a conscious decision. The time depends on the stimulus and pathway." If a time-budget exercise is retained, label it an invented conduction-only example and separate it from measured hot-pan response. Delete the asserted fixed four-to-fivefold comparison with ruler-catching.

**Reason:** False precision gives a stronger impression of evidence than the chapter has. The correct lesson about automatic spinal coordination does not require it.

**Source:** Original human withdrawal experiment documenting variable afferent contributions and latency, [Thorell et al., 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11329128/). This study uses electrical stimulation and therefore supports caution about universal latency, not a replacement thermal latency.

### 8. Restrict the synapse account to a stated excitatory chemical synapse

**Location:** `source/src/ch09.md:242–276`, 291–295, 326 and 332.

**Current claims:** Receptor proteins are "ONLY on the postsynaptic membrane", and all chemical transmission opens sodium channels to excite the next neurone.

**Assessment:** Substantive correction, high confidence. Presynaptic neurotransmitter receptors exist and regulate release. Inhibitory transmission is also essential, and the chapter itself mentions integrating inhibitory inputs at 291. A basic one-direction chemical relay can be taught without asserting that presynaptic membranes have no receptors or that every synapse excites its target.

**Minimal replacement:** "At the simple excitatory chemical synapse drawn here, transmitter is released from the presynaptic terminal and binds receptors on the postsynaptic membrane. That arrangement gives this relay a direction. Other receptors can regulate release, and some synapses make the next neurone less likely to fire." Call the channels ligand-gated rather than universally sodium-only. In the acetylcholinesterase example, prolonged activation can progress to impaired firing and paralysis; avoid promising indefinitely continuous normal impulses.

**Source:** Original experiment on presynaptic nicotinic receptors controlling transmitter release, [Rowell, 1995](https://pubmed.ncbi.nlm.nih.gov/7624037/).

### 9. Make the TTX case distinguish endplate response from normal muscle contraction

**Location:** `source/src/ch09.md:542–555`, particularly Clue 3 at 546.

**Current claim:** Bath-applied TTX blocks the motor axon, but direct acetylcholine still makes muscle fibres "depolarise and contract"; this supposedly proves vesicles and postsynaptic receptors both work normally.

**Assessment:** The case needs tighter experimental specification. TTX can affect muscle as well as nerve voltage-gated sodium channels. Local acetylcholine-evoked endplate depolarisation can persist when propagated muscle spikes are lost. Strong acetylcholine can also produce local contractures, so the correct criticism is not that every possible contraction is impossible. A muscle response to directly supplied transmitter cannot prove presynaptic vesicle machinery intact. Nor does loss of evoked nerve transmission mean all spontaneous transmitter release is absent.

**Minimal replacement:** "Direct acetylcholine still produces a local endplate depolarisation." Explain that this tests postsynaptic receptor function, not normal propagated muscle action potentials, whole-muscle contraction or presynaptic vesicles. Say "action-potential-evoked release fails" rather than "no acetylcholine leaves".

**Source:** Original nerve–muscle experiments, [Furukawa, Sasaoka and Hosoya, 1959](https://www.jstage.jst.go.jp/article/jjphysiol1950/9/2/9_2_143/_pdf/-char/en).

### 10. Qualify immunity instead of promising complete, lifelong prevention

**Location:** `source/src/ch10.md:463–476`, 505 and 509; related opening question at 5.

**Current claims:** Vaccination always destroys the matching pathogen before symptoms or transmission; active immunity gives lifelong protection; antibodies have exactly 0% binding to a different pathogen; weakened vaccine organisms cannot multiply to cause severe illness.

**Assessment:** Substantive correction, high confidence. Protection can be strong without preventing every infection, symptom or transmission. Duration and need for boosters vary. Different pathogens can share recognisable antigens, so an idealised A/B comparison must explicitly assume no relevant cross-recognition. Live attenuated vaccine organisms can replicate; their weakened biology and appropriate clinical use differ from inactivated vaccines and isolated antigens.

**Minimal replacement:** "Vaccination prepares an immune response that reduces the risk of disease, often especially severe disease. Protection and its duration depend on the vaccine and person. Memory often produces a faster response on later exposure." In the two-pathogen exercise, state that its two model antigens are assumed not to cross-react. Distinguish weakened live organisms from killed or fragment vaccines in one sentence.

**Reason:** Readers should not lose trust in vaccination when they encounter a vaccinated person with an infection. Cross-recognition also appears positively in this chapter's Ranadive example, so the 0% rule contradicts the chapter itself.

**Sources:** [WHO on vaccine protection and breakthrough infections](https://www.who.int/news-room/feature-stories/detail/vaccine-efficacy-effectiveness-and-protection); [CDC Pink Book, principles of vaccination](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-1-principles-of-vaccination.html). The original Rotavac trial itself reports efficacy rather than perfect protection, [Bhandari et al., 2014](https://pubmed.ncbi.nlm.nih.gov/24629994/).

## Further definite corrections and bounded checks

- **Harvey's smallest bound does not exceed the modern blood-volume example.** At `ch08.md:173`, 1,000 drachms are approximately 3.9 kg, below the manuscript's own approximately 5 L adult blood-volume illustration. The 4,000-drachm result does exceed it. At 207, replace the assertion that even the tiniest bound exceeds blood volume with a distinction between these cases. The repeated replacement requirement remains implausible. This is internal arithmetic, not a challenge to Harvey's actual argument.
- **Capillary travel time.** `ch08.md:367` gives 0.18 mm/s and a 0.5 mm path. These imply approximately 2.8 seconds, not 1–2 seconds. Label the example's assumed length and report about 3 seconds, or change the chosen speed consistently.
- **Insulin reaches the liver first through the portal route.** `ch09.md:107` should not use pancreatic insulin as an example requiring heart and arteries before every tissue. Add "Pancreatic blood reaches the liver through the portal circulation before joining the wider circulation." Original human hepatic extraction study: [Meier et al., 2005](https://pubmed.ncbi.nlm.nih.gov/15919785/). This strengthens the connection with Chapters 7–8 rather than adding an isolated exception.
- **Optical numbers need a consistent eye model.** `ch09.md:356` calls 38 D out of 50–54 D approximately two-thirds, while 386 gives a total of 50 D for distance and 54 D at 25 cm. The fraction is already inconsistent numerically. Standard schematic-eye powers are nearer 60 D, with model-dependent values. Delete unnecessary total-power numbers or name and use one coherent optical model. Original model paper: [J. Warren Blaker, 1980, Toward an adaptive model of the human eye](https://opg.optica.org/josa/abstract.cfm?uri=josa-70-2-220).
- **Collip's chronology.** `ch10.md:81` puts Collip into the summer 1921 work. Split the history: Banting and Best began in May; Collip joined in December and improved purification. [FDA's history of the discovery](https://www.fda.gov/about-fda/fda-history-exhibits/100-years-insulin).
- **Rotavac identity.** `ch10.md:482` should call 116E a human–bovine natural reassortant, or simply name the vaccine without explaining its ancestry. The original trial's title and methods establish this directly. Keep an independently sourced current impact estimate separate from what the 2014 trial measured. [Bhandari et al., 2014](https://pubmed.ncbi.nlm.nih.gov/24629994/).
- **Egestion repeats a misconception Chapter 7 already avoids.** `ch10.md:271` describes faeces and gut bacteria as material that never crossed a cell membrane or took part in cellular metabolism. Gut microbes are living cells; faeces also contain shed human cells and substances excreted into the gut, as `ch07.md:69` explicitly explains. Reuse Chapter 7's distinction between processes rather than defining everything in faeces by an impossible common history.
- **Signals do not jump the chemical cleft as action potentials.** `ch10.md:8` says electrical impulses jump "across 20 nm synaptic gaps". Replace with "travel along neurones and are relayed chemically across the synapses described in Chapter 9". This is an internal contradiction, not a need to teach electrical synapses here.
- **Negative feedback need not oscillate.** `ch10.md:108` says it "always produces small oscillations". Replace with "can produce small fluctuations". A simple stable negative-feedback system can return monotonically towards its target. The sign of feedback alone does not determine oscillation.
- **Heat transfer depends on skin and surrounding surfaces, not air temperature alone.** `ch10.md:194` says dry radiation cannot cool someone at 38 °C air temperature. Radiation depends on surrounding surface temperatures; convection depends on the air–skin difference, not simply air–core difference. Retain the example only with stated assumptions about those surroundings. Likewise, avoid a single universal 40–42 °C switch at which all human enzymes permanently denature (`ch10.md:24`, 147, 211). Dangerous overheating can disrupt and damage cells without that false universal mechanism.
- **The two-stage kidney explanation needs a boundary sentence.** `ch10.md:302–305` and 357 present filtering and reabsorption as a complete solution for all small wastes. At minimum say this is the first model; kidneys also secrete selected substances into tubules, and protein-bound small molecules are not all freely filtered. Avoid "everything small" and unsupported evolutionary claims that alternative arrangements were almost impossible.

## Claims I would preserve

- Chapter 6 accurately separates oxygen's terminal electron-acceptor role from the carbon-to-CO₂ account, and avoids assigning product oxygen origins from the net equation alone.
- Chapter 6 appropriately distinguishes glycolytic ATP from the carrier-regeneration step in the routes taught. It explicitly avoids claiming every fermentation system has the same products or ATP yield.
- Its explanation that lactate can form with oxygen present, be used as fuel and does not explain next-day soreness is a strength. Do not replace it with the simpler but false universal oxygen-debt story.
- Chapter 7's approximately 30 m² small-intestinal area estimate is explicitly an adult extrapolation from a 2014 estimate of approximately 32 m² total mucosal area, including approximately 2 m² large intestine. The qualification is useful; there is no reason to restore the old tennis-court comparison.
- Chapter 7 correctly identifies mainly fatty acids and monoacylglycerols as pancreatic lipase products, includes colipase, and distinguishes the major route of long-chain lipids through chylomicrons and lymph from exceptions using portal blood.
- Chapter 8 correctly makes arterial/venous names depend on flow direction, distinguishes equal serial flow from different pumping pressures, and chooses left-to-right shunting for its stated uncomplicated postnatal VSD case. Preserve those core explanations while removing universal or diagnostic overstatement elsewhere.

The appropriate next action is to correct these mechanisms and accounts, then make sure the figures, live models, cards, questions and answers teach the same corrected model. A prose-only correction would leave several contradictions in the learning experience.
