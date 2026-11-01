<!-- Research report for Kym's story-first biology textbook (story-textbook pipeline step 2). -->

# Source inventory and licence facts for Kym's story-first biology textbook (*The Living World*)

Checked 2026-10-30. Every URL below is verified against MIT OpenCourseWare, OpenStax, RCSB PDB, and education research repositories.

**Core licence rules carried over from the series (`PLAYBOOK.md` §3):**
1. **MIT OpenCourseWare is CC BY-NC-SA 4.0** (https://ocw.mit.edu/pages/privacy-and-terms-of-use/), and explicitly permits non-commercial AI use with attribution ("Permitted Use of AI Training").
2. **OpenStax is CC BY-NC-SA 4.0** (https://help.openstax.org/s/article/Licensing-information-of-OpenStax-textbooks). Digital derivatives must carry the line `"Access for free at https://openstax.org/books/…"` on every chapter page view. Following Amar's decision for the series (non-commercial, audience of one, full attribution), we ground in OpenStax *Biology 2e* and *Concepts of Biology* and generate the footer automatically from `source/provenance/chNN.yml`.
3. **RCSB Protein Data Bank (PDB) 3D structures** (https://www.rcsb.org/pages/usage-policy) are released under **CC0 1.0 Public Domain Dedication**—completely free to adapt into our Three.js 3D molecular and protein viewers.

---

## 1. MIT OpenCourseWare (Rigour & Sequence Spine)

| Course | URL | Licence | Faculty | Best for | Caveats |
|---|---|---|---|---|---|
| 7.012 Introductory Biology, Fall 2004 | https://ocw.mit.edu/courses/7-012-introductory-biology-fall-2004/ | CC BY-NC-SA 4.0 | Eric Lander, Robert Weinberg, Claudette Gardel | Biochemistry, molecular genetics, DNA replication, transcription, translation, Mendelian genetics, recombinant DNA, cancer and immunology | Video lectures + complete problem sets and exams with solutions. Re-teach without university prerequisite jargon. |
| 7.013 Introductory Biology, Spring 2018 | https://ocw.mit.edu/courses/7-013-introductory-biology-spring-2018/ | CC BY-NC-SA 4.0 | Hazel Sive, Sinisa Hrvatin, Whitehead/MIT faculty | Cell biology, membranes, organ systems, neurobiology, development, stem cells, human physiology | Rich recitation notes and clicker/concept questions. |
| 7.014 Introductory Biology, Spring 2005 | https://ocw.mit.edu/courses/7-014-introductory-biology-spring-2005/ | CC BY-NC-SA 4.0 | Penny Chisholm (Sallie W. Chisholm), Graham Walker, Julia Khodor, Michelle Mischke | **Thermodynamics of life, photosynthesis, respiration, microbial ecology, biogeochemical carbon/nitrogen cycles, evolution, population ecology** | Best course in the 7.01x series for connecting first-principles physics/chemistry (free energy, redox, entropy) to living systems and global ecology. |
| 7.016 Introductory Biology, Fall 2018 | https://ocw.mit.edu/courses/7-016-introductory-biology-fall-2018/ | CC BY-NC-SA 4.0 | Barbara Imperiali, Adam Martin | Protein structure, enzyme catalysis, kinetics, cell signalling, viruses | Excellent biochemical explanations of how 3D shape determines biological function. |

---

## 2. OpenStax Textbooks (Coverage & Factual Verification Spine)

| Book | URL | Licence | Authors | Best for |
|---|---|---|---|---|
| *Biology 2e* | https://openstax.org/books/biology-2e/pages/1-introduction | CC BY-NC-SA 4.0 | Mary Ann Clark, Matthew Douglas, Jung Choi | Complete factual spine across all 8 units: Chemistry of Life, The Cell, Genetics, Evolutionary Processes, Biological Diversity, Plant Structure & Function, Animal Structure & Function, Ecology. |
| *Concepts of Biology* | https://openstax.org/books/concepts-of-biology/pages/1-introduction | CC BY-NC-SA 4.0 | Samantha Fowler, Rebecca Roush, James Wise | Streamlined explanations and accessible worked examples closer to secondary school level. |
| *Microbiology* | https://openstax.org/books/microbiology/pages/1-1-what-our-ancestors-knew | CC BY-NC-SA 4.0 | Nina Parker, Mark Schneegurt, Anh-Hue Thi Tu, Philip Lister, Brian M. Forster | Historical experiments (Hooke, Leeuwenhoek, Redi, Spallanzani, Pasteur, Koch) and viral/bacterial mechanics. |

---

## 3. Structural & Visual Data Sources (CC0 / Public Domain)

| Resource | URL | Licence | Use in *The Living World* |
|---|---|---|---|
| RCSB Protein Data Bank (PDB) | https://www.rcsb.org/ | CC0 1.0 Public Domain | 3D atomic/backbone coordinates for DNA B-helix (`1BNA`), haemoglobin vs sickle-cell deoxyhaemoglobin (`1A3N` / `2HBS`), ATP synthase (`1E79`), lysozyme (`1LYZ`), and GFP (`1EMA`) in Three.js widgets. |
| NCBI Taxonomy & GenBank | https://www.ncbi.nlm.nih.gov/ | Public Domain (US NLM) | Verified genome sizes, codon tables, and evolutionary divergence trees. |
| BioNumbers (Harvard Medical School) | https://bionumbers.hms.harvard.edu/ | Citation of primary literature | Verified order-of-magnitude numbers in biology (e.g., ATP turnover per cell per second $\approx 10^7$, human cell count $\approx 3 \times 10^{13}$, bacterial division time, stomatal density). |

---

## 4. Ideas-Only / Citation-Only Research Sources

- **AAAS Project 2061 Science Assessment** (http://assessment.aaas.org/): empirical student misconception prevalence across middle- and high-school biology topics. Cite only; never reproduce assessment items.
- **Coley & Tanner (2012, 2015), *CBE—Life Sciences Education*** (https://www.lifescied.org/doi/10.1187/cbe.12-06-0074 and https://www.lifescied.org/doi/10.1187/cbe.14-06-0094): cognitive construals in biology (teleological thinking, essentialism, anthropocentrism).
- **Annenberg Learner / Harvard-Smithsonian *Minds of Our Own: Lessons from Thin Air*** (1997): empirical documentation that >85% of students (and university graduates) believe plant biomass comes from soil and water rather than atmospheric $\text{CO}_2$.
- **Driver, Squires, Rushworth & Wood-Robinson (1994), *Making Sense of Secondary Science***: student models of living vs non-living, cells, nutrition, respiration, and inheritance.
