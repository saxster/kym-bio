# Chapter 2 — independent Gate A: facts and fidelity

Checked 30 October 2026. Scope: `src/ch02.md`, `src/stories/p-hooke.md`, `src/stories/p-margulis.md`, `figs_ch02.py`, `grounding/ch02.md`, `provenance/ch02.yml`, and consequential contradictions in the linked `app/x_cell.js`. Read BOOKPLAN §2, FORMAT, NARRATIVE and GATES. No author files were edited by this checker; author corrections made during the review are identified below. This is a content/source audit, not rendered visual or runtime QA.

## Chapter 2

### A1 — FIX — §2.1, `figs_ch02.py`, `_cell`: ribosome in plant vacuole — author FIXED, independently verified

The shared ribosome coordinates originally placed a dot at `(305,151)` inside the plant vacuole bounded by approximately `x=287..374, y=91..164`. The legend explicitly identifies these dots as ribosomes, so this teaches the wrong compartment. Ribosomes occur in cytoplasm and other appropriate translation compartments, not freely in the sap of a plant's central vacuole. The author now skips markers inside the vacuole; verified in the current helper. [OpenStax 4.3](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells).

### A2 — FIX — §2.4, cell theory / school coverage — author FIXED, independently verified

Grounding promised the principle that new cells arise by division, but the original chapter only explicitly described organelle division. Cambridge 0610 2.1.5 specifically requires the cellular principle. The author has now added the correct statement before specialised cells, connected to the growing root. [Official syllabus, printed p14](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf).

### A3 — FIX — §2.1 linked explorer, mitochondrial evidence card — author FIXED, independently verified

`x_cell.js` formerly said Margulis proved the mitochondrial account in 1967. This contradicted §2.2 and the story's appropriate account of a synthesis and later evidence. The 1967 paper explicitly offers hypotheses and further tests. The author now describes her gathering evidence and separates the later sequence evidence. [Sagan's original paper record and abstract](https://pubmed.ncbi.nlm.nih.gov/11541392/).

### A4 — FIX — §2.1 linked explorer, human mitochondrial ribosomes — author FIXED, independently verified

The same card formerly called human mitochondrial ribosomes 70S. Human mitoribosomes are 55S, substantially modified from bacterial ribosomes. This undermined §2.2's careful distinction between bacterial ancestry and present-day ordinary bacteria. The author removed the false size and now explicitly states that the human ribosomes differ. [Primary human mitoribosome cryo-EM study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6486771/).

### A5 — FIX — §2.1 linked explorer, nucleus mechanism — author FIXED, independently verified

The nucleus card formerly said it transcribed messages “through nuclear pores”, conflating transcription with export. It now correctly puts transcription inside the nucleus and the exit of RNA through pores. [OpenStax 4.3, nucleus/ribosomes](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells).

### A6 — FIX — §2.1 linked explorer, both mitochondrial mechanism cards — author FIXED, independently verified

The animal card originally put the complete glucose-to-carbon-dioxide equation under “Runs aerobic respiration”, assigning the whole process to the mitochondrion; its first stage, glycolysis, occurs in the cytoplasm. The plant card said mitochondria burn glucose “into ATP”, implying that glucose matter becomes ATP. Both cards now correctly describe chemical energy from nutrients supplying ATP; the animal card explicitly distinguishes important mitochondrial stages from cytoplasmic glycolysis. Verified in the final source. [OpenStax 7.2](https://openstax.org/books/biology-2e/pages/7-2-glycolysis).

### A7 — FIX — §2.1 linked explorer, vacuole presence versus chapter-end case — author FIXED, independently verified

The vacuole card's original unqualified `Bacteria ✗` conflicted with the chapter's central counterexample: *Thiomargarita namibiensis* has a large nitrate-storing vacuole. The final presence text explicitly scopes absence to the typical bacterium shown, notes bacterial exceptions, and distinguishes the large sap vacuole. Verified in the final source. The case itself is correct. The primary team's account illustrates the vacuole and peripheral cytoplasm. [WHOI, *Oceanus/Currents*, “Bulking Up a Bacterium”](https://www.whoi.edu/wp-content/uploads/2019/02/WHCurrents_v8n4_2000web.pdf); [Schulz's original research dissertation including the 1999 study](https://pure.mpg.de/pubman/item/item_3254096_1/component/file_3254097/1_Schulz_Diss_1999.pdf).

### A8 — CONSIDER — §2.1 linked explorer, displayed scale — author FIXED, independently verified

The explorer originally lacked the plate's warning about different enlargements and enlarged ribosomes. It displays similarly sized full-cell meshes despite the given animal/bacterial examples differing tenfold in length. An animal ribosome's drawn diameter is `0.15/4.6 = 0.03261` of cell width, versus `25 nm/20,000 nm = 0.00125` from the cards: about 26 times larger relative to its cell than the stated size. Exaggeration is useful here. The final explorer now appends a visible paragraph disclosing nonshared scale, enlarged structures and omitted crowding; verified in the rendered-content construction code. These are calculations from the explorer geometry, not measured cell sizes.

### Final recheck — new paired cards and etymology

The two new §2.1 cards correctly distinguish DNA storage from ribosomal protein synthesis and mitochondrial respiration stages from chloroplast carbohydrate synthesis. Their mechanisms and typical-cell limitations do not introduce a factual contradiction.

Independently opened all four new etymology sources. Latin *nucleus* = kernel, Greek *mitos* = thread and *khondrion* = little granule, and chloroplast's green + formed roots agree with the dictionary entries: [Merriam-Webster](https://www.merriam-webster.com/dictionary/nucleus), [Etymonline](https://www.etymonline.com/word/mitochondrion), [Oxford](https://www.oxfordlearnersdictionaries.com/us/definition/english/chloroplast). “Ribose-containing body” appears explicitly in *Perspectives on the ribosome*. The ledger's credit **Steitz & Moore (2017) is correct**, confirmed independently in the [original PubMed bibliographic record](https://pubmed.ncbi.nlm.nih.gov/28138074/): Thomas A. Steitz and Peter B. Moore, DOI 10.1098/rstb.2016.0537. The [PMC article indexed text](https://pmc.ncbi.nlm.nih.gov/articles/PMC5311932/) supports the ribosome wording. No new FIX finding.

### Verified findings without required changes

- The approximately 30 trillion count is explicitly an adult reference estimate, accurately representing the cited 2016 study's `3.0 × 10¹³` human cells rather than counting Kym. [Sender, Fuchs and Milo](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1002533).
- Plant/onion, membrane versus wall, bacterial DNA/plasmid qualifications, ribosomes, typical organelles, and mature human red-cell exceptions are sound. The current cytoplasm definition explicitly excludes the nucleus. The chapter appropriately distinguishes visible evidence from multi-method reconstructions.
- Ris and Plaut's 1962 organism, microscopy, DNA tests and DNase-sensitive fibres agree with the original abstract, without claiming that this one observation proved endosymbiosis. [Primary record](https://pubmed.ncbi.nlm.nih.gov/14492436/).
- Endosymbiotic ancestry, gene transfer/loss, present dependence and the limits of membrane/shape evidence faithfully simplify the sources. General two-membrane statements refer to the ordinary organelles being taught; secondary plastids and reduced mitochondrial derivatives are outside this selected example. [OpenStax 23.1](https://openstax.org/books/biology-2e/pages/23-1-eukaryotic-origins).
- The *Thiomargarita* date, location and maximum diameter are correct: 1997 collection, 1999 description, Namibian shelf sediment, up to 750 µm (0.75 mm). No obsolete “largest known” claim is made. [Original research-team release](https://www.whoi.edu/press-room/news-release/giant-sulfur-bacteria-discovered-off-african-coast/).
- The cell → palisade tissue → leaf → shoot system → bean plant hierarchy is valid; root/shoot are organ systems. Specialised-cell functions and the spelling “neurone” match the syllabus. [OpenStax 30.1](https://openstax.org/books/biology-2e/pages/30-1-the-plant-body), [official syllabus](https://www.cambridgeinternational.org/Images/697203-2026-2028-syllabus.pdf).

## Story `p-hooke`

No required factual correction. Dates 1635–1703, London and publication in 1665 are supported by the collections holding the historical work. The text accurately distinguishes dead cork walls from the inventory of living cells; no invented quotation, scene detail or discovery of living contents is asserted. [Harvard's original-book catalogue](https://www.huh.harvard.edu/book/micrographia-1665), [Glasgow's original-book collection](https://www.gla.ac.uk/myglasgow/archivespecialcollections/digitisedcollections/birdsbeesandblooms/bees/roberthookemicrographia/).

## Story `p-margulis`

No required factual correction. The 1967 title, publication as Lynn Sagan and Boston University affiliation are confirmed by the original bibliographic record. The story's distinction between a synthesis and proof in one paper is correct; the original paper also proposed flagellar origins, so noting that broader proposals were not all accepted is honest. The 1938–2011 dates match the institutional memorial. Ris/Plaut is accurately reported as supporting evidence, not Margulis's own experiment. [1967 original paper](https://pubmed.ncbi.nlm.nih.gov/11541392/), [UMass memorial reproduced by NASA](https://science.nasa.gov/people/lynn-margulis/), [Ris/Plaut](https://pubmed.ncbi.nlm.nih.gov/14492436/).

## Arithmetic independently rerun

Ran `python3 -I -c` with Decimal arithmetic, independently of the grounding calculations:

| Side / model | Surface area | Volume | SA/V | Reached fraction at chosen 2 mm depth |
|---|---:|---:|---:|---:|
| 1 cm | 6 cm² | 1 cm³ | 6 cm⁻¹ | 78.4% |
| 2 cm | 24 cm² | 8 cm³ | 3 cm⁻¹ | 48.8% |
| 10 cm | 600 cm² | 1000 cm³ | 0.6 cm⁻¹ | 11.5264%, correctly rounded to 11.5% |

Used `SA=6a²`, `V=a³`, reached fraction `1−max(a−0.4,0)³/a³`. Eight separate unit cubes give 48 cm² versus 24 cm²: factor 2, same total volume. `50 µm = 0.050 mm`; `40/0.050 = 800`. All printed chapter numbers and figure arithmetic agree. The equal-depth layer is explicitly hypothetical; neither a diffusion speed nor successful kitchen result is claimed.

## Source fidelity, attribution and licensing

All four numbered sections, both stories and all four figures have ledger entries. The plate code is original schematic drawing rather than copied artwork. School vocabulary is restated in original teaching prose, without reproducing assessments. MIT/OpenStax links resolve, and the actual MIT Lecture 1 transcript was downloaded and read around 20–23 minutes: nucleus, plasma membrane, mitochondrial DNA/ribosomes, imported proteins and the caution about artists' reconstructions are genuinely present. The ledger honestly identifies the cube arithmetic and specialised detail as coming from other sources rather than inventing lecture coverage.

The current MIT and OpenStax pages identify CC BY-NC-SA 4.0; `build.py` contains the required OpenStax access line and changes notice for chapter views and credits. Actual rendered-view attribution remains part of the parent's build/visual verification. [MIT terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/), [OpenStax preface](https://openstax.org/books/biology-2e/pages/preface). OpenStax additionally displays an AI-ingestion permission restriction; `research/sources.md` records the user's series decision to proceed. That internal decision should not be represented as permission granted by OpenStax; the chapter ledger does not make that representation. No new approval flow is requested here.

No build was needed for this report-only change; this checker did not change chapter, figures, explorer or ledger files.

## Summary count

**0 BLOCKER; 7 FIX (all author-corrected and independently verified); 1 CONSIDER (author-corrected and independently verified). Zero outstanding findings.** Stories: no required corrections. Chapter arithmetic: all correct. Final explorer changes and new paired-card source credits rechecked independently.
