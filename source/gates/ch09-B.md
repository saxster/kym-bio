# Chapter 9 — Gate B: Reader Clarity, Feynman Method, Visuals & Safety Audit

Independent report-only review, 30 October 2026. Reviewed all finished Chapter 9 source, story, figure, widget, model, test, build, and rendered QA artifacts with fresh context without authoring any chapter, story, figure, widget, or provenance file. In accordance with the Gate B ownership rule, `/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch09-B.md` is the **only** file created or modified during this review.

**Disposition: Gate B PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`).** Every numbered section (`9.1`, `9.2`, `9.3`, `9.4`) builds the physical mechanism or concrete Mumbai experience before naming its technical terms, passes the Feynman movability test, and supports an accurate **three-sentence explain-back** (≤ 3 sentences each) in 12-year-old Kym's voice without reproducing any target misconception. No section requires a `REWRITE`.

---

## 1. SHA-256 Artifact Table

Exact byte sizes and SHA-256 hashes of all 15 Chapter 9 deliverables, plus `live/enhancements.js`, `build/site/index.html`, `build/site/sw.js`, and the exported full-book print PDF (`/tmp/lt_bio_ch09/final/qa_ch09/print.pdf`):

| # | Artifact Path | Bytes | SHA-256 |
|---:|---|---:|---|
| 1 | `source/grounding/ch09.md` | 44,356 | `3b27c8a94072b89c6a292cd7a9d32c734e1c6fe6f7c6c5b6d0bcfa363f59bea2` |
| 2 | `source/src/ch09.md` | 73,987 | `4098960ea2edbbfa908fd98b3d47b00a63772418c6fc1c79dd6c3d1572f423aa` |
| 3 | `source/src/stories/siddiqi-para-channels.md` | 9,720 | `f80d9795d86a4d62f6e497883f79771ecfb557680b43463affde41901ab5b4ef` |
| 4 | `source/src/stories/p-bose.md` | 1,939 | `a3ae4af4ba2738a100b3de0ec8a21da86526e02209941213b12b369f24278f62` |
| 5 | `source/figs_ch09.py` | 46,340 | `81bf33c073e8252c33bb47edb1fccc3e228377709ede6df631ce1d09178e0881` |
| 6 | `source/provenance/ch09.yml` | 30,641 | `a797bd25cde03c369d7c98baf71b795a5cedb268bcfb3e6cf4946769c8ed9794` |
| 7 | `source/live/coordination_model.js` | 15,803 | `7298b2dac86eff0fe20feda31e74bde422c3ea14b8ecec8a6fac5b73ab1d7d13` |
| 8 | `source/live/w_reflex_action_potential.js` | 10,999 | `4f6c80e0fa6cf438ed423cf9e0d992334a2a43246d4efc666928cc1dc22c9a90` |
| 9 | `source/live/w_synapse_transmission.js` | 10,642 | `3844666d375ee109be5bcb91443df2ea3117a5194f2bd52decb912008c8e2838` |
| 10 | `source/live/w_eye_accommodation_tropism.js` | 11,422 | `a96a63beedfda7df2adb653aa4d42f1268366a022cee7d7cbd1c568384580828` |
| 11 | `source/tests/ch09_domain.mjs` | 7,778 | `1e94fc7e40a2709da90653fa63924687857fb808615aede5a4363a49f92343df` |
| 12 | `source/tests/qa_ch09.py` | 30,403 | `aa886f29510c068b561e939c9a9f121f4a8982fc08a71cdeae33f2ad5d615759` |
| 13 | `source/tests/verify_ch09.sh` | 1,275 | `f008e4c6a866ec704a8f88ced39c88fd7989541981fbb59aa0eecbd7042d03fb` |
| 14 | `source/tests/README-ch09.md` | 2,029 | `902acc2deeeda5181f52e7a2ad27bc6745f594117beebe704a5e0071922f7ba3` |
| 15 | `source/tests/ch09-preserved.json` | 108,169 | `3a8563fd527a6a154a1e5106d6fb921f0f01b1471204a7cc5f726b9ff4a21b5d` |
| 16 | `source/live/enhancements.js` | 62,628 | `bf0a5fd2c5944776bdbdf10c979431d30e5c1f0fcf007837a3f6723e1d29f7c1` |
| 17 | `source/build/site/index.html` | 2,044,220 | `09f7d7a934c6c9067812b53adfb7d8a0427f72ebb42cd8bb2244a5428bf387bc` |
| 18 | `source/build/site/sw.js` | 3,001 | `f2bcfd5b3a7313f44c580a41d7ba447a836af72e60da181f5bef7614809c1876` |
| 19 | `/tmp/lt_bio_ch09/final/qa_ch09/print.pdf` (`build/The-Living-World.pdf` print export) | 19,926,942 | `38d49a60786ba56c4792a04c11b1452138ca9f601563c6a837f7f2d11e45457a` |

*(Independent domain execution: ran `node /Users/amarsukhi/src/MyCode/kym_bio/source/tests/ch09_domain.mjs` → **620 independent Chapter 9 reflex, `para^ts`, synapse, eye accommodation, tropism and tour cases passed**, exit 0.)*

---

## 2. 12-Year-Old Mumbai Reader Persona & Feynman “Thing Before Name” Audit

### Term-by-Term “Thing Before Name” & Movability Verification

Every required technical term in `src/ch09.md` and `src/stories/siddiqi-para-channels.md` was audited to verify that the physical experience, structural geometry, or causal mechanism is established *before* the technical label is introduced, and that no label is used as a circular explanation:

| Section | Technical Term(s) | How the Concrete Mechanism / Experience Precedes the Name | Status |
|---|---|---|---|
| **9.1** | `stimulus`, `receptor`, `coordinator`, `effector` | Contrasts brushing a hot steel *tawa* in a Mumbai kitchen (tens of milliseconds, one arm) with a barking dog beside an autorickshaw at dusk (multi-organ readiness lasting minutes) before naming the environmental change (`==stimulus==`), detector (`receptor`), integrator (`coordinator`), and responding muscle or gland (`==effector==`). | **PASS** |
| **9.1** | `neurone`, `central nervous system`, `peripheral nervous system` | Establishes fast electrical impulses travelling along specialised nerve cells (`==neurones==`), then separates the cranium/vertebral-column coordinator (**CNS**: brain and spinal cord) from the cranial and spinal nerves connecting the body (**PNS**). | **PASS** |
| **9.1** | `endocrine gland`, `hormone`, `target organ` | Contrasts ducted digestive glands (Chapter 7) with ductless glands secreting directly into capillaries and blood plasma (`==hormone==`), demonstrated by Bayliss and Starling's 1902 denervated duodenum experiment, and explains **target organ** specificity via Chapter 4 complementary 3D receptor proteins rather than hormones "knowing" where to go. | **PASS** |
| **9.2** | `axon`, `myelin sheath`, `sensory neurone`, `relay neurone`, `motor neurone` | Starts with the 1-metre geometry puzzle from spinal cord to big toe (solved by a 1–20 µm thin conducting fibre, the **axon**), distinguishes **sensory**, **relay**, and **motor neurones** by cell-body position and direction relative to the CNS, and shows how Schwann-cell lipid wrapping (`==myelin sheath==`) and exposed nodes of Ranvier jump the impulse at 70–120 m/s. | **PASS** |
| **9.2** | `reflex arc`, `action potential`, `depolarisation`, `repolarisation` | Traces the automatic hot-*tawa* withdrawal pathway and its 35.9 ms time budget (`==reflex arc==`), then contrasts a copper wire (free electrons) with a salty membrane tube pre-loaded by Skou's `Na⁺/K⁺` pump (−70 mV rest), showing voltage-gated `Na⁺` channels opening at −55 mV so `Na⁺` rushes in to +30 mV (**depolarisation**), `K⁺` diffusing out to −70/−75 mV (**repolarisation**), and the sideways domino wave (**action potential**). | **PASS** |
| **9.2** | `synapse`, `vesicle`, `neurotransmitter`, `synaptic cleft` | Follows the impulse to the presynaptic terminal bulb where current leaks into conductive extracellular fluid across a 20 nm water-filled space (**synaptic gap / synaptic cleft**, `==synapse==`), then shows membrane sacs (**vesicles**) fusing to release chemical courier molecules (`==neurotransmitter==`) that diffuse across the 20 nm gap and bind complementary postsynaptic receptor proteins in one direction only. | **PASS** |
| **9.3** | `cornea`, `iris`, `pupil`, `antagonistic muscles`, `ciliary muscles`, `suspensory ligaments`, `accommodation`, `rods`, `cones`, `fovea`, `blind spot` | Opens with stepping from Marine Drive midday glare into a shaded lobby and glancing from a watch at 25 cm to a ship on the horizon. Connects Book 2 refraction physics to the **cornea** (~2/3 of bend) and **lens** (fine tuning), explains why muscles can only pull so the **iris** needs **antagonistic** circular and radial muscles around the **pupil** hole, explains 3D sphincter-ring geometry of **ciliary muscles** and **suspensory ligaments** during **accommodation**, and links dim peripheral star-gazing vs bright central colour vision to **rods**, **cones**, the **fovea**, and the receptor-free optic-nerve exit (**blind spot**). | **PASS** |
| **9.4** | `phototropism`, `gravitropism`, `coleoptile`, `auxin` | Opens with J. C. Bose's Calcutta crescograph and a windowsill moong seedling bending without muscles or nerves, defines directional growth to light (`==phototropism==`) and gravity (`==gravitropism==`), walks through Darwin (1880), Boysen-Jensen (1913), and Went (1926) on the grass shoot sheath (**coleoptile**) to earn the diffusible chemical (`==auxin==`), and explains how shaded-side / lower-side auxin accumulation stimulates shoot cell elongation while inhibiting root cell elongation. | **PASS** |

---

### Mandatory Three-Sentence Explain-Backs (12-Year-Old Kym Persona)

Each section explain-back below is **exactly 3 sentences** (verified ≤ 3 sentences) and captures the causal mechanism without any textbook misconception:

- **Section 9.1 (3 sentences):**
  When my body needs to jerk one hand off a hot tawa in milliseconds, receptors send fast electrical impulses along neurones through my peripheral and central nervous systems directly to that arm's muscle effector. When I get startled by a barking dog and need my heart, lungs, pupils, and liver working together for several minutes, my ductless adrenal glands release the chemical hormone adrenaline into my blood plasma. Even though blood carries a hormone past every cell in my body, only target organs whose cells have complementary receptor proteins on their membranes bind the hormone and change what they are doing.

- **Section 9.2 (3 sentences):**
  In a spinal reflex arc, impulses race from skin receptors along a sensory neurone, across a relay neurone in the spinal cord, and out along a myelinated motor neurone to contract my muscle in about 36 milliseconds—before a parallel signal even finishes climbing to my brain to feel pain. A neurone is not a copper wire with free electrons: instead, ion pumps keep the resting cell at −70 mV until voltage-gated sodium channels snap open at −55 mV to let `Na⁺` rush sideways into the cell (+30 mV depolarisation), followed by `K⁺` diffusing out to reset the membrane so the spike travels forward like falling dominoes. When that spike reaches a 20-nanometre synaptic gap, vesicles in the presynaptic knob release neurotransmitter molecules that diffuse across the gap and bind complementary receptors on the next neurone, forcing impulses to travel in one direction only.

- **Section 9.3 (3 sentences):**
  Light entering my eye is bent mostly by the curved front cornea and fine-focused onto the retina by the flexible lens, while antagonistic circular and radial muscles in the iris shrink the pupil hole in bright light and widen it in dim light. Because the ciliary muscle forms a circular ring around the lens, contracting it for a near book makes the ring smaller and slackens the suspensory ligaments so the elastic lens springs thicker to bend diverging rays more strongly, whereas relaxing the ring for a distant ship pulls the ligaments tight and flattens the lens. On the retina, three kinds of cones packed into the central fovea give sharp colour vision in bright light, sensitive rods spread outside the fovea give monochrome night vision, and the blind spot where the optic nerve exits has no rods or cones at all.

- **Section 9.4 (3 sentences):**
  A growing plant shoot bends towards a sunny window (positive phototropism) and upward away from gravity (negative gravitropism) without any muscles or nerves by steering where its cells elongate. The shoot tip makes the plant hormone auxin, which diffuses downward into the growth zone and accumulates on the shaded side under one-sided light or on the lower side when a seedling lies horizontally. Because auxin stimulates cell elongation in shoots, the shaded or lower side grows longer faster and curves the stem towards light or upward, whereas in roots high auxin on the lower side inhibits elongation so the upper side grows faster and turns the root downward into the soil.

---

## 3. Typography, Formatting & Guardrails Audit

Independently scanned `src/ch09.md`, `src/stories/siddiqi-para-channels.md`, `figs_ch09.py`, `live/w_reflex_action_potential.js`, `live/w_synapse_transmission.js`, and `live/w_eye_accommodation_tropism.js` in Python:

1. **Raw LaTeX / `$` tokens:** **0** raw `$` characters and **0** `\text{...}`, `\frac`, or `\sqrt` LaTeX strings in `src/ch09.md` and `src/stories/siddiqi-para-channels.md`. All quantities and chemical/ionic symbols use clean Unicode (`Na⁺`, `K⁺`, `Ca²⁺`, `−70 mV`, `µm`, `d = ½gt²`, `t = √(2d ÷ g)`).
2. **Exclamation marks (`!`):** **0** exclamation marks in `src/ch09.md`, **0** in `src/stories/siddiqi-para-channels.md`, **0** in `figs_ch09.py`, and **0** in widget UI strings across `w_reflex_action_potential.js`, `w_synapse_transmission.js`, and `w_eye_accommodation_tropism.js`.
3. **Causal `:::predict` and `:::check` blocks:**
   - All **4 `:::predict` blocks** (9.1 hormone-only body speed/targeting trap; 9.2 sideways `Na⁺` influx vs wire electron drift; 9.3 near-to-far ciliary ring relaxation and ligament tightening; 9.4 Went's off-centre auxin agar block in darkness) test genuine physical/biological causality rather than vocabulary recall.
   - All **4 `:::check` blocks** (9.1 dual-timescale fright response and why adrenaline is a signal rather than a fuel; 9.2 demyelination conduction slowdown + acetylcholinesterase inhibition at the synapse; 9.3 averted-vision faint-star astronomy + iris/lens night-sky adjustment; 9.4 stationary vs clinostat-rotated seedling under unilateral light) require multi-step mechanistic reasoning.
4. **`:::five` blocks:** All 4 `:::five` blocks (`Nervous system vs endocrine system`, `Action potential`, `Chemical synapse`, `Tropisms and auxin`) contain all 5 core `?` questions and all 3 deeper `??` questions in the exact required order.

---

## 4. Companion Story Review (`src/stories/siddiqi-para-channels.md`)

Audited `src/stories/siddiqi-para-channels.md` (*“Giant squid axons, sleeping frog hearts and the warm-paralysed flies of Colaba”*, 1,291 words) against `STORYWRITING.md`:

- **Human & local Mumbai presence:** Anchored vividly at the **Tata Institute of Fundamental Research (TIFR)** in **Colaba, Mumbai** beside the Arabian Sea, where **Obaid Siddiqi** (born 1932 in Basti, UP; educated at Aligarh, Delhi, and Glasgow with Guido Pontecorvo) founded India's first Molecular Biology Unit in 1962 at Homi Bhabha's invitation before collaborating with **Seymour Benzer** between Pasadena (Caltech) and Colaba (1973–1976).
- **Historical & experimental progression:**
  1. Sets up the two physical barriers to the 19th-century "telegraph wire" metaphor: Ramón y Cajal's microscopic gap (Sherrington's 1897 **synapse**) and the leakiness of a salty membrane tube.
  2. Traces **Otto Loewi's** 1921 two-frog-heart Ringer's transfer in Graz (*Vagusstoff*, identified with Henry Dale as acetylcholine).
  3. Traces **Alan Hodgkin** and **Andrew Huxley** threading a glass capillary electrode inside the 0.5–1.0 mm *Loligo forbesii* **squid giant axon** at Plymouth in 1939 (discovering the +30 mV overshoot above 0 mV) and their 1952 voltage-clamp separation of `Na⁺` influx and `K⁺` efflux.
  4. Traces **David Suzuki's** 1971 discovery of temperature-sensitive *Drosophila* `para` (*paralytic*) mutants (walking normally at 22 °C, paralysed within 5 seconds at 29–32 °C, recovering immediately on cooling) and **Siddiqi & Benzer's** 1976 *PNAS* (`73: 3253–3257`) glass-microelectrode recordings from the cervical nerve and flight muscle, which separated axonal spike failure in `para^ts` from synaptic failure in `shi` (*shibire*) and `com` (*comatose*).
- **Honest mystery resolved in 1989:** Explicitly notes that in 1976 nobody had yet sequenced the channel protein, and closes with **Loughney, Kreber & Ganetzky (1989)** cloning the `para` gene to prove it encodes the pore-forming subunit of the **voltage-gated `Na⁺` channel**.
- **Zero invented quotes/emotions & clean non-duplication with `p-bose.md`:** Contains zero invented dialogue or unsourced internal emotions. Its front-matter `terms:` (`Obaid Siddiqi, Alan Hodgkin, Andrew Huxley, Otto Loewi, squid giant axon, Vagusstoff`) have **zero overlap** with `src/stories/p-bose.md` (`J. C. Bose, Jagadish Chandra Bose, crescograph`).

---

## 5. Direct Visual Inspection of All 9 Plates, All 3 Widgets, Story Modal & Print PDF

Directly inspected the rendered PNGs in `/tmp/lt_bio_ch09/final/qa_ch09/` using `read_file`:

1. **All 9 Static SVG Plates (`plate-1` through `plate-9` across `1024-light`, `1440-light`, `390-dark`, `390-sepia`):**
   - `plate-1` (`c9_nerves_vs_hormones`): Clean two-column comparison of CNS/PNS point-to-point wiring vs endocrine ductless broadcast and receptor specificity above the five-row 0610 comparison table. Zero text collisions.
   - `plate-2` (`c9_neurone_types_reflex`): Clear side-by-side anatomy of sensory (cell body on side branch), relay (wholly in CNS), and motor (cell body at start, myelinated axon) neurones above the 5-stage hot-*tawa* spinal withdrawal loop.
   - `plate-3` (`c9_action_potential_wave`): Contrasts copper wire vs resting/firing axon membrane, plots the −70 mV → −55 mV → +30 mV → −75 mV action potential trace with well-spaced labels, and pairs 22 °C vs 32 °C `para^ts` cards below.
   - `plate-4` (`c9_synapse_relay`): Presynaptic knob (mitochondria, vesicles), ~20 nm synaptic gap, and postsynaptic complementary receptor proteins with Steps 1–4 clearly boxed, above the 0610 one-way rule and Loewi's 1921 two-heart proof.
   - `plate-5` (`c9_pathway_latency_budget`): Four stacked quantitative cards comparing spinal reflex (~35 ms), voluntary ruler catch (~190 ms, 18 cm drop), endocrine broadcast (~5–30 s), and plant shoot phototropism (~20–120 min).
   - `plate-6` (`c9_eye_anatomy_receptors`): Cross-section of the human eye with left/right leader lines that never cross unrelated text, paired with Rods vs Cones cards below.
   - `plate-7` (`c9_pupil_and_accommodation`): Bright vs dim pupil reflex iris diagrams on top; near (25 cm, contracted smaller ciliary ring, slack ligaments, thick lens) vs distant (>6 m, relaxed wider ring, taut ligaments, thin lens) accommodation diagrams below.
   - `plate-8` (`c9_plant_tropisms_auxin`): Five coleoptile experiment cards (Darwin A–C, Boysen-Jensen D, Went E in darkness) above the 4-point 0610 shoot phototropism and shoot/root gravitropism cards.
   - `plate-9` (`c9_tetrodotoxin_case`): Side-by-side forensic flowchart comparing normal motor axon `Na⁺` opening with nanomolar TTX outer-pore blockade (Narahashi, Moore & Scott 1964).
2. **All 3 Interactive Widgets (`live-2` = `reflex_action_potential`, `live-4` = `synapse_transmission`, `live-7` = `eye_accommodation_tropism` at `1440-light` and `390-dark/sepia`, default and changed/stamped states):**
   - All three widgets render with crisp canvas typography, responsive controls, clear cutaway overlays, immutable trial-capture ledgers, and `✓ STAMPED` challenge completion badges without any overlapping text or horizontal overflow at 390 px or 1440 px.
3. **Story Modal (`story-1440-light-card.png`, `story-390-dark-card.png`):**
   - Opens cleanly with the `1921–1976` header, title, cast line, `Colaba, Mumbai & Pasadena, 1921–1976` scene marker, and well-typeset body text in both desktop light and mobile dark modes.
4. **Exported Print PDF Pages (`pdf-304.png`, `pdf-310.png`, `pdf-314.png`, `pdf-319.png`, `pdf-320.png`, `pdf-327.png`, `pdf-329.png`, `pdf-336.png`, `pdf-342.png`):**
   - All 9 figures, captions, story callout cards, headings, and the closing Chapter 10 bridge + OpenStax attribution footer paginate cleanly with zero clipped figures or orphan headings.

---

## 6. Home Activity & Historical Safety Audit

1. **Home Activity 1 — `:::home Investigation 9.3: Measure your voluntary visual reaction time with a 30 cm ruler` (`src/ch09.md:310–321`):**
   - **Safety & materials:** Uses only a standard 30 cm plastic or wooden ruler, a notebook, and a partner sitting across a table in a well-lit room. Preceded immediately by the explicit warning in `:::careful` (`src/ch09.md:307`): *“(Never attempt to test a withdrawal reflex using heat or sharp objects.)”*
   - **Physics & experimental rigor:** Properly controls the 4 cm starting thumb–index gap and zero-countdown release, converts catch distance `d` to reaction time via `t = √(2d ÷ g)` (`10 cm → 143 ms`, `18 cm → 192 ms`, `25 cm → 226 ms`), compares focused vs cognitive-distraction trials, states model assumptions honestly, and ends with *“This proposed activity has been reviewed for feasibility, not physically trialled for the book.”*
2. **Home Activity 2 — `:::home Investigation 9.3: Map your own blind spot and observe the pupil reflex in ordinary room light` (`src/ch09.md:419–426`):**
   - **Safety & materials:** Uses an index card, black pen, 30 cm ruler, and ordinary indoor room/window light. Features an explicit bold eye-safety rule (`src/ch09.md:420` & `425`): *“**Eye safety rule:** never look at the Sun and never shine a torch, phone LED or laser into anyone's eye; ordinary desk or window lighting is completely sufficient.”*
   - **Geometry & feasibility:** With `+` and `●` separated by 8 cm on the card, the blind spot (~15° nasal to the fovea, `tan 15° ≈ 0.268`) is hit at viewing distance `D ≈ 8 ÷ tan 15° ≈ 29.8 cm` (or 20–28 cm accounting for nodal point offset), so the dot reliably vanishes as the card is brought from 50 cm to ~20–28 cm. Includes the required non-trialled feasibility disclosure.
3. **Historical Neurophysiology & Pharmacology Framing:**
   - Every historical or clinical laboratory procedure is explicitly marked as historical laboratory research never to be repeated at home: Bayliss & Starling (`src/ch09.md:59`), Hodgkin & Huxley (`src/ch09.md:183`, `siddiqi-para-channels.md:33`), Siddiqi & Benzer (`src/ch09.md:206`), Otto Loewi (`siddiqi-para-channels.md:23`, `figs_ch09.py:396`), and the tetrodotoxin detective case (`src/ch09.md:540`, `figs_ch09.py:815`: *“Reasoning case only: tetrodotoxin is a lethal marine neurotoxin, never a substance for experiment.”*).

---

## 7. Categorized Findings (`BLOCKER`, `FIX`, `CONSIDER`)

- **`BLOCKER`: 0**
- **`FIX`: 0**
- **`CONSIDER`: 0**

**Final Verdict:** **Gate B PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`).**
