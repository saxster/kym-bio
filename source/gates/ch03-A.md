# Chapter 3 — independent Gate A

Reviewed 30 October 2026. Scope: `grounding/ch03.md`, `src/ch03.md`, `src/stories/p-agre.md`, `src/stories/p-skou.md`, `provenance/ch03.yml`, the four Chapter 3 SVG figures, transport widgets/model and their enhancement text. Read GATES, NARRATIVE, FORMAT, SKILL, PLAYBOOK and the relevant BOOKPLAN provisions. Independent of the writing process. No chapter, story, figure, widget or provenance content was edited by this reviewer.

## Chapter 3.1 — diffusion

No factual correction required. The train analogy expressly discards human choices. Equal volumes, two-way crossings, expected rather than guaranteed counts, continuing motion at equilibrium, and a distinction between simulation and empirical evidence preserve the intended mechanism. Dye advection is acknowledged rather than presented as a pure diffusion measurement. The thermal number is expressly a characteristic scale, not every molecule's kinetic energy.

Recomputed with `python3 -I -c`: `1.380649e-23 * 300 = 4.141947e-21 J`; `300 − 273.15 = 26.85 °C`, supporting “about 27 °C” and `4.14 × 10⁻²¹ J`. `80 × .1 = 8`, `20 × .1 = 2`, net `6`; `50 × .1 = 5` each way. The check gives `17 − 11 = 6`, left `74`, right `26`, total `100`. [NIST SI definition](https://www.nist.gov/pml/special-publication-330/sp-330-section-2) independently confirms the exact Boltzmann constant.

An execution check of `transport_model.js` ran 60 open-divider walks (20 seeds × starting-left counts 50, 80, 100), each for 1,000 steps: all conserved 100 particles and satisfied `initialLeft − currentLeft = rightwardCrossings − leftwardCrossings`. Another 60 closed-divider runs preserved the initial side counts and recorded zero crossings. This verifies the counting mechanism, not a measured molecular diffusion rate. The model and caption appropriately disclaim calibrated time, distances and hard-sphere collision dynamics.

## Chapter 3.2 — water potential and selective permeability

No factual correction required. The prose distinguishes lipid permeability from specific protein routes, qualifies water-specific aquaporins, retains two-way water exchange, and makes the dilute-to-concentrated rule conditional on equal pressure and non-crossing solute. The pressure example correctly avoids the false rule that osmosis must equalise solute concentrations.

Python recomputation: `−.80 + .50 = −.30000000000000004 MPa` (floating-point representation of −0.30). The widget's tolerance correctly recognises this as balance; pressures 0 and +0.25 favour entry, +0.75 and +1.00 favour exit. Its text correctly says pressure is independently imposed and no evolving cell volume or concentration is calculated. [OpenStax 30.5](https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants) supports solute and pressure contributions; its problematic gravity example is not reproduced.

## Chapter 3.3 — plant and animal cell states

### A1 — FIX — REPORT, subsequently addressed by the writer during review: reserve clear membrane–wall detachment for plasmolysis

**Location:** `figs_ch03.py`, `c3_cells()`; `live/w_osmosis_cells.js`, the `p`/inset calculation and membrane-envelope geometry.

**Original problem:** The SVG used insets `[5,9,25]`, visibly separating the membrane from the wall in turgid and flaccid plants as well as the plasmolysed plant. The live model began every plant at `p=.88`, including matching-solute conditions, and the dilute endpoint reached only `.98`. Its 3D membrane envelope was also smaller than the wall before shrinkage. This visually assigned the chapter's diagnostic feature of plasmolysis to the other states.

**Evidence:** [OpenStax 5.2](https://openstax.org/books/biology-2e/pages/5-2-passive-transport), plant-cell tonicity and Figure 5.13; `grounding/ch03.md` §3.3 and the chapter's own precise definition distinguish loss of turgor from the membrane-bound contents pulling away from the wall.

**Requested correction:** Keep turgid/flaccid membranes adjacent to the inner wall, distinguish pressure/vacuole changes, and reserve an obvious gap for plasmolysis. After this finding was sent to the writer, source inspection found SVG insets `[3,3,25]`, live `p=.965` outside the concentrated shrinkage branch, and matching initial 3D envelope/wall dimensions. At the displayed Canvas stroke widths, the revised unplasmolysed outlines touch or overlap rather than leave a clear gap. This addresses the scientific distinction in source geometry; rendered visual verification remains with the main verification pass. This reviewer did not make those changes.

**Other checks:** The chapter correctly distinguishes a limp tissue strip from observed plasmolysis, identifies the vacuolar membrane omitted from the envelope model, and makes recovery conditional on viability. Python confirms `5 g / final 100 mL = 5% mass/volume`, six strips are three in each condition, a `60 × 5 × 5 mm` strip occupies about 1.5 mL, and a 1 mm increment is about 1.67% of 60 mm. The percentage-change formula is correct. The dimensions and 30–60 minute interval are identified as protocol choices rather than promised numerical outcomes.

## Chapter 3.4 — active transport and mangroves

### A2 — FIX — REPORT, subsequently FIXED by the writer: correct two syllabus references in the ledger

**Location:** `provenance/ch03.yml`, research entries under `3.3` and `3.4` (approximately lines 100 and 135 at review).

**Problem:** The ledger assigns Topic 3.3 to plasmolysis/osmosis and Topic 3.4 to active transport. These are chapter-section numbers accidentally used as Cambridge topic numbers. [Cambridge 0610, 2026–2028, printed pp15–16](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf) places osmosis in **3.2** and active transport in **3.3**; there is no Topic 3.4. The chapter's own school boxes are already correct.

**Correction:** Change the ledger's two topic references to 3.2 and 3.3 respectively. No scientific prose rewrite is needed.

**Verification:** A subsequent source read confirms the four section entries now map to Cambridge topics 3.1/3.2/3.2/3.3. This finding is resolved; this reviewer did not change the ledger.

### A3 — CONSIDER — REPORT: add a direct nitrate/proton cotransport source to the ledger

**Location:** `provenance/ch03.yml`, `3.4` research; `grounding/ch03.md` §3.4.

The proton-pump/nitrate-cotransporter relay is scientifically sound, but its exact root example is less directly sourced than the generic active-transport account. A useful primary experimental anchor is [McClure and colleagues, “Evidence for Cotransport of Nitrate and Protons in Maize Roots,” Part II](https://pubmed.ncbi.nlm.nih.gov/16667449/). Their root flux measurements support coupled proton/nitrate transport. Adding that citation would improve traceability without adding stoichiometry or extra detail to the child-facing text. The current diagram correctly makes no fixed ATP-per-nitrate claim.

**Other checks:** The text retains the electrical as well as concentration contribution for ions and distinguishes secondary transport from a fictional direct ATP nitrate pump. The mangrove explanation agrees with [Reef and Lovelock, Regulation of water balance in mangroves](https://pmc.ncbi.nlm.nih.gov/articles/PMC4332601/): salt restriction alone is insufficient; osmotic adjustment and lower total water potential matter; salt glands occur in some species. The review appeared online in 2014 and in its February 2015 issue, so citing it as 2015 is legitimate. [Maharashtra Mangrove Cell](https://mangroves.maharashtra.gov.in/Site/1086/Mangrove-Diversity) lists *Avicennia marina*, grey mangrove/Tivar, across coastal Maharashtra. The chapter does not invent a Carter Road salinity measurement or identify all local trees from a distance. The seawater case correctly separates cell osmosis from the whole-body salt-excretion water account; [NOAA](https://oceanservice.noaa.gov/facts/drinksw.html) supports the latter.

## Story p-agre

No factual correction required. [Agre's first-person Nobel biography](https://www.nobelprize.org/prizes/chemistry/2003/agre/biographical/) confirms John Parker's suggestion in 1991, Preston's low-water-permeability *Xenopus* expression system, Guggino's collaboration and the first test on 9 October 1991. The chapter/story responsibly separate that test from publication. The [original publication record](https://pubmed.ncbi.nlm.nih.gov/1373524/) confirms 17 April 1992, *Science* 256(5055):385–387, DOI 10.1126/science.256.5055.385, and authors Preston, Carroll, Guggino and Agre. Naming selected collaborators with “colleagues” is not an assertion that there were only three authors. The story invents no quotations or private emotional scene. Agre's 1949 birth year is supported by the Nobel Foundation's [2003 press release](https://www.nobelprize.org/prizes/chemistry/2003/8737-pressmeddelande-nobelpriset-i-kemi-2003/).

## Story p-skou

No factual correction required. The [1957 original paper hosted by Aarhus University](https://www.au.dk/fileadmin/www.au.dk/forskning/nobelprisen_i_kemi_1997/biografi/artikel_01.pdf) confirms author, Aarhus affiliation, nerve preparation and ion effects. [Skou's Nobel lecture](https://www.nobelprize.org/uploads/2018/06/skou-lecture.pdf) describes the proposal that the ATPase participated in transport and confirms 1957 publication; the story appropriately avoids treating that chemical assay as a complete observed pumping cycle. [Nobel facts](https://www.nobelprize.org/prizes/chemistry/1997/skou/facts/) support 1918–2018; [Aarhus University's obituary](https://newsroom.au.dk/en/news/show/artikel/nobel-laureate-medical-doctor-and-physiologist-jens-christian-skou-has-died-aged-99/) independently confirms his death in 2018. Animal sodium/potassium machinery is explicitly distinguished from the root proton relay.

## Licence and provenance

The ledger covers every numbered section, both stories and all four original figures. Source inspection found original prose, schematics and model code, rather than copied source illustrations, portraits or assessment items. The shared source registry credits Weinberg and the Biology 2e authors Clark, Douglas and Choi. The NC-SA declaration matches [OpenStax's current licensing guidance](https://help.openstax.org/s/article/Licensing-information-of-OpenStax-textbooks) and [MIT OCW's terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/). OpenStax's extra AI-use notice remains a recorded project-level policy matter in `research/sources.md`; this review does not infer new permission or require a new approval flow. The existing generated site contains the OpenStax access footer; the final regenerated Chapter 3 view should be checked by the main verifier. Research/history/dictionary facts are paraphrased and no external images are adapted. A2 is the only required provenance correction found.

Some direct Nobel URLs initially returned 403 and the first Cambridge PDF fetch failed to parse. Their indexed first-party text was retrievable through search; original publication records and the Aarhus-hosted paper/lecture provided independent corroboration. The PMC review likewise required indexed article text after a browser challenge.

## Summary

- **BLOCKER: 0.**
- **FIX: 2, both addressed in source by the writer** — A1 visual cell-state distinction (rendered recheck pending); A2 two incorrect Cambridge references in the ledger (verified corrected).
- **CONSIDER: 1** — A3 direct experimental citation for the root nitrate/proton relay.
- No content edited by this reviewer. No post-edit build was required from this reviewer; the main agent owns the concurrent changes and final build/visual verification.

Gate A scientific prose and historical stories pass. Verify the revised A1 render before recording the complete Chapter 3 gate as closed; no required factual or provenance text correction remains.
