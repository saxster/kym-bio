# Chapter 9 — Gate A: independent facts, models, syllabus, provenance and preservation review

Reviewed 30 October 2026. Independent reviewer did not author the chapter, story, figures, models, tests or provenance. Report-only review; this report (`/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch09-A.md`) is the only file written. Scope is scientific, historical, mathematical, syllabus, cross-book continuity, provenance and preservation acceptance, not final browser/print acceptance or publication approval. Read `source/GATES.md`, `source/gates/ch08-A.md`, all fifteen Chapter 9 deliverables, `source/live/enhancements.js`, preserved story `source/src/stories/p-bose.md`, `source/src/ch08.md`, and the cross-referenced Chapters 10 and 12 of *The Moving World* (`/Users/amarsukhi/src/MyCode/kym_physics/source/src/ch10.md` and `ch12.md`).

## Disposition Summary

**PASS** — **0 BLOCKER / 0 FIX / 0 CONSIDER**.

---

## 1. Reviewed Artifact SHA-256 & Byte-Size Table

Independently computed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I`:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch09.md` | 44356 | `3b27c8a94072b89c6a292cd7a9d32c734e1c6fe6f7c6c5b6d0bcfa363f59bea2` |
| `source/src/ch09.md` | 73987 | `4098960ea2edbbfa908fd98b3d47b00a63772418c6fc1c79dd6c3d1572f423aa` |
| `source/src/stories/siddiqi-para-channels.md` | 9720 | `f80d9795d86a4d62f6e497883f79771ecfb557680b43463affde41901ab5b4ef` |
| `source/figs_ch09.py` | 46340 | `81bf33c073e8252c33bb47edb1fccc3e228377709ede6df631ce1d09178e0881` |
| `source/provenance/ch09.yml` | 30641 | `a797bd25cde03c369d7c98baf71b795a5cedb268bcfb3e6cf4946769c8ed9794` |
| `source/live/coordination_model.js` | 15803 | `7298b2dac86eff0fe20feda31e74bde422c3ea14b8ecec8a6fac5b73ab1d7d13` |
| `source/live/w_reflex_action_potential.js` | 10999 | `4f6c80e0fa6cf438ed423cf9e0d992334a2a43246d4efc666928cc1dc22c9a90` |
| `source/live/w_synapse_transmission.js` | 10642 | `3844666d375ee109be5bcb91443df2ea3117a5194f2bd52decb912008c8e2838` |
| `source/live/w_eye_accommodation_tropism.js` | 11422 | `a96a63beedfda7df2adb653aa4d42f1268366a022cee7d7cbd1c568384580828` |
| `source/live/enhancements.js` | 62628 | `bf0a5fd2c5944776bdbdf10c979431d30e5c1f0fcf007837a3f6723e1d29f7c1` |
| `source/tests/ch09_domain.mjs` | 7778 | `1e94fc7e40a2709da90653fa63924687857fb808615aede5a4363a49f92343df` |
| `source/tests/qa_ch09.py` | 30403 | `aa886f29510c068b561e939c9a9f121f4a8982fc08a71cdeae33f2ad5d615759` |
| `source/tests/verify_ch09.sh` | 1275 | `f008e4c6a866ec704a8f88ced39c88fd7989541981fbb59aa0eecbd7042d03fb` |
| `source/tests/README-ch09.md` | 2029 | `902acc2deeeda5181f52e7a2ad27bc6745f594117beebe704a5e0071922f7ba3` |
| `source/tests/ch09-preserved.json` | 108169 | `3a8563fd527a6a154a1e5106d6fb921f0f01b1471204a7cc5f726b9ff4a21b5d` |
| `source/build/site/index.html` | 2044220 | `09f7d7a934c6c9067812b53adfb7d8a0427f72ebb42cd8bb2244a5428bf387bc` |
| `source/build/site/sw.js` | 3001 | `f2bcfd5b3a7313f44c580a41d7ba447a836af72e60da181f5bef7614809c1876` |
| `/tmp/lt_bio_ch09/final/qa_ch09/print.pdf` (`build/The-Living-World.pdf` equivalent; `source/build/The-Living-World.pdf` not present on disk) | 19926942 | `38d49a60786ba56c4792a04c11b1452138ca9f601563c6a837f7f2d11e45457a` |

### Preservation Baseline Verification (`source/tests/ch09-preserved.json`)

- Verified all **248** recorded pre-Chapter 9 preservation targets by exact byte length and SHA-256: **247 of 248** files are 100% byte-for-byte identical to the baseline.
- The sole modified existing file is the shared `source/live/enhancements.js` (`62,628` bytes, SHA-256 `bf0a5fd2c5944776bdbdf10c979431d30e5c1f0fcf007837a3f6723e1d29f7c1`). Splitting at the single marker `  reflex_action_potential: {` and restoring the closing `};\n` reproduces the exact baseline `original_base64` payload (`53,435` bytes, SHA-256 `c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397`), proving that `source/live/enhancements.js` was modified strictly by appending the 3 Chapter 9 widget entries (`reflex_action_potential`, `synapse_transmission`, `eye_accommodation_tropism`).

---

## 2. Cambridge IGCSE Biology 0610 (2026–2028 v3 & 2029) & Lower Secondary 0893 Syllabus Audit

Every Core and Supplement requirement assigned to Chapter 9 was audited across `src/ch09.md`, `figs_ch09.py`, `live/coordination_model.js`, the three interactive widgets, and `provenance/ch09.yml`:

### Topic 14.1 — Coordination and response (Mammalian nervous system, neurones, reflex arc & synapses): PASS
- **14.1.1 (Core):** States explicitly that **electrical impulses** travel along **neurones** (using the Cambridge spelling `neurone` and never substituting vague "messages" in formal definitions).
- **14.1.2 (Core):** Partitions the mammalian nervous system into **(a) the central nervous system (CNS)** consisting of the **brain and spinal cord**, and **(b) the peripheral nervous system (PNS)** consisting of the **nerves outside of the brain and spinal cord** (cranial and spinal nerves).
- **14.1.3 (Core):** Describes the role of the nervous system as **coordination and regulation of body functions** via `stimulus → receptor → coordinator (CNS) → effector (muscle or gland) → response`.
- **14.1.4 (Core):** Identifies and compares **sensory**, **relay**, and **motor neurones** in prose, `c9_neurone_types_reflex`, and `w_reflex_action_potential.js`:
  - **Sensory neurone:** receptor endings, long dendron, **cell body sitting on a side branch** (in the dorsal root ganglion outside the spinal cord), and axon entering the CNS.
  - **Relay neurone:** central cell body, short branched dendrites and short unmyelinated axon **entirely inside the CNS** (grey matter).
  - **Motor neurone:** multipolar cell body and dendrites at the start of the cell in CNS grey matter, with a **long myelinated axon** (wrapped by **Schwann cells** forming the **myelin sheath** interrupted by **nodes of Ranvier**) ending at motor end plates on an effector muscle.
- **14.1.5 (Core):** Gives the simple reflex arc in exact sequence: **`stimulus → receptor → sensory neurone → relay neurone → motor neurone → effector → response`**.
- **14.1.6 (Core):** Defines a reflex action verbatim as a means of **automatically and rapidly integrating and coordinating stimuli with the responses of effectors (muscles and glands)** without waiting for a conscious brain decision.
- **14.1.7 (Core):** Defines a **synapse** as a **junction between two neurones** (`:::note Synapse`).
- **14.1.8 (Supplement):** Describes and illustrates synapse structure in `src/ch09.md` §9.2, `c9_synapse_relay`, and `w_synapse_transmission.js`, explicitly labelling **vesicles containing neurotransmitter molecules** (in the presynaptic knob, alongside mitochondria), the ~20 nm **synaptic gap** (or **synaptic cleft**), and complementary **receptor proteins** on the postsynaptic membrane.
- **14.1.9 (Supplement):** States the four-step synaptic sequence in exact causal order:
  1. **(a)** An arriving electrical impulse stimulates the release of **neurotransmitter molecules from vesicles into the synaptic gap** (via exocytosis).
  2. **(b)** The neurotransmitter molecules **diffuse across the synaptic gap** down their concentration gradient.
  3. **(c)** Neurotransmitter molecules **bind with receptor proteins** on the next (postsynaptic) neurone.
  4. **(d)** **An electrical impulse is then stimulated in the next neurone** (as $\text{Na}^+$ channels open and depolarise the membrane past threshold, followed by enzymatic breakdown/reuptake to reset the synapse).
- **14.1.10 (Supplement):** States and proves that **synapses ensure that impulses travel in one direction only** because vesicles containing neurotransmitter are located **only in the presynaptic knob** and complementary receptor proteins are located **only on the postsynaptic membrane** (interactive Tab 1 in `w_synapse_transmission.js`).

### Topic 14.2 — Sense organs & the human eye: PASS
- **14.2.1 (Core):** Defines **sense organs** as **groups of receptor cells responding to specific stimuli: light, sound, touch, temperature and chemicals**.
- **14.2.2 & 14.2.3 (Core + Supplement):** Labels all required structures on `c9_eye_anatomy_receptors` and states their exact functions:
  - **Cornea:** refracts light (~two-thirds of total refractive power at the air–cornea interface).
  - **Iris:** controls how much light enters the pupil.
  - **Pupil:** central aperture allowing light to reach the lens.
  - **Lens:** focuses (fine-tunes) light onto the retina.
  - **Retina:** contains light receptors (**rods** and **cones**), some sensitive to light of different colours.
  - **Optic nerve:** carries electrical impulses to the brain.
  - **Blind spot:** exit point of the optic nerve lacking rods and cones.
  - **Ciliary muscles** and **suspensory ligaments** (Supplement): circular muscle ring and radial fibres adjusting lens shape.
  - **Fovea** (Supplement): central retinal pit packed tightly with cones only for high-acuity bright-light vision.
- **14.2.4 (Core) & 14.2.5 (Supplement):** Explains the **pupil reflex** in terms of light intensity and the **antagonistic action of circular and radial muscles in the iris**:
  - *Bright light:* **circular muscles contract**, **radial muscles relax** $\to$ **pupil constricts** (narrows), protecting the retina from excessive light.
  - *Dim light:* **radial muscles contract**, **circular muscles relax** $\to$ **pupil dilates** (widens), admitting more light.
- **14.2.6 (Supplement):** Explains **accommodation** to view near and distant objects in `src/ch09.md` §9.3, `c9_pupil_and_accommodation`, and `w_eye_accommodation_tropism.js` using the 3D sphincter-ring geometry of the ciliary muscle:
  - *Viewing a near object:* **ciliary muscles contract** (ring diameter narrows inward) $\to$ **suspensory ligaments slacken** $\to$ elastic **lens becomes thicker / more convex** $\to$ light is **refracted more strongly** onto the retina.
  - *Viewing a distant object:* **ciliary muscles relax** (intraocular pressure widens the ring) $\to$ **suspensory ligaments are pulled tight (taut)** $\to$ **lens is pulled thinner / less convex** $\to$ light is **refracted less**.
- **14.2.7–14.2.9 (Supplement):** Contrasts **rods** (~120 million per eye; **greater sensitivity to dim light for night vision**; distributed across the peripheral retina outside the fovea; absent at fovea centre and blind spot) with **cones** (~6 million per eye; **three different kinds of cones absorbing light of different wavelengths**—red, green, blue—for colour vision in bright light; **concentrated at the fovea**; absent at the blind spot).

### Topic 14.3 — Hormones in humans & nervous vs hormonal comparison: PASS
- **14.3.1 (Core):** Defines a **hormone** as a **chemical substance, produced by a gland and carried by the blood, which alters the activity of one or more specific target organs**.
- **14.3.2 & 14.3.5 (Core + Supplement):** Identifies in prose and `c9_nerves_vs_hormones` the **pituitary gland**, **adrenal glands (adrenaline)**, **pancreas (insulin and Supplement glucagon)**, **testes (testosterone)**, and **ovaries (oestrogen)**.
- **14.3.3 & 14.3.6 (Core + Supplement):** Describes **adrenaline** as the hormone secreted in **‘fight or flight’** situations and covers all required effects: **increased breathing rate**, **increased heart rate**, **increased pupil diameter**, and (Supplement) its role in the **chemical control of metabolic activity, including increasing the blood glucose concentration** (by stimulating liver cells to convert glycogen to glucose) and **increasing the heart rate**.
- **14.3.4 (Core):** Compares nervous and hormonal control in `src/ch09.md`, `c9_nerves_vs_hormones`, and `c9_pathway_latency_budget` by **speed of action** (very rapid milliseconds vs slower seconds/minutes) and **duration of effect** (short-lived vs longer-lasting until broken down), plus signal form, pathway, and target specificity.

### Topic 14.5 — Tropic responses in plants: PASS
- **14.5.1–14.5.3 (Core):** Defines **gravitropism** as a response in which parts of a plant grow towards or away from gravity, and **phototropism** as a response in which parts of a plant grow towards or away from the direction of a light source; describes positive phototropism and negative gravitropism in shoots, positive gravitropism (and negative phototropism) in roots, and clinostat controls.
- **14.5.4–14.5.5 (Supplement):** Explains phototropism and gravitropism of a shoot as examples of the chemical control of plant growth by **auxin**, explicitly stating all four Cambridge mark-scheme points in `src/ch09.md` §9.4, `c9_plant_tropisms_auxin`, and `w_eye_accommodation_tropism.js`:
  - **(a) Auxin is made in the shoot tip.**
  - **(b) Auxin diffuses through the plant from the shoot tip.**
  - **(c) Auxin is unequally distributed in response to light and gravity** (accumulating on the **shaded side** under unilateral light and on the **lower side** in a horizontal seedling).
  - **(d) Auxin stimulates cell elongation** in shoots (so the shaded/lower side elongates faster, bending the shoot towards light or upward away from gravity; also notes parenthetically why high auxin on the lower side of a horizontal root *inhibits* root cell elongation to produce positive gravitropism).

### Clean Chapter 9 vs Chapter 10 Syllabus Partition: PASS
- Chapter 9 introduces **insulin** and **glucagon** as pancreatic hormones at Topic 14.3 scope, while cleanly deferring **Topic 14.4 (Homeostasis: negative feedback, insulin/glucagon blood-glucose regulation loop, Type 1 diabetes, and skin thermoregulation)**, **Topic 13 (Excretion in humans)**, and **Topic 10 (Diseases and immunity)** to Chapter 10 via the closing `:::next` bridge.
- Cambridge Lower Secondary Science **0893** scope is honestly qualified in `provenance/ch09.yml` (level fit only; full framework not publicly inspected; no invented 0893 objective codes).

---

## 3. Cross-Book Continuity Audit: PASS

1. **Continuity within *The Living World* (Book 3):**
   - **Chapter 2 (§2.4):** Connects the 1-metre motor neurone axon (`1–20 µm` wide) directly to Chapter 2's surface-area-to-volume rule and the `cell → tissue → organ → organ system` hierarchy.
   - **Chapter 3 (§§3.1, 3.4 & story `p-skou.md`):** Accurately builds on passive diffusion down concentration/electrochemical gradients and **Jens Christian Skou's 1957 crab-nerve $\text{Na}^+/\text{K}^+$-ATPase pump** ($3\,\text{Na}^+$ out, $2\,\text{K}^+$ in per ATP hydrolysed) maintaining the $-70\text{ mV}$ resting potential.
   - **Chapter 4 (§§4.2–4.3):** Explains hormone–receptor and neurotransmitter–receptor specificity through **complementary 3D protein conformation and charge**.
   - **Chapter 5 (§§5.1, 5.4):** Connects auxin-stimulated cell elongation in shoots to proton-pump acidification loosening the **cellulose cell wall** so **turgor pressure** expands the cell.
   - **Chapter 8 (§§8.3–8.4 & closing `:::next` bridge):** Picks up directly from Chapter 8's closing `:::next` bridge (stair climb in Mumbai, sinoatrial node pacemaker modulated by autonomic nerves and blood-borne adrenaline, and blood plasma as the dissolved-solute courier).
   - **Existing Story `src/stories/p-bose.md`:** Referenced via `:::story p-bose` in Section 9.4 (`src/ch09.md` line 448) without modifying or duplicating `src/stories/p-bose.md` (verified byte-identical in `tests/ch09-preserved.json`).
   - **New Story `src/stories/siddiqi-para-channels.md` (`terms:` check):** Declares `terms: Obaid Siddiqi, Alan Hodgkin, Andrew Huxley, Otto Loewi, squid giant axon, Vagusstoff`. Independent Python case-insensitive regex scan across `src/ch00.md` through `src/ch08.md` and all 26 earlier stories returned **0 prior hits** for all six terms (and `qa_ch09.py` verifies 0 hijacked links in `#ch0`–`#ch8`).
2. **Continuity with *The Moving World* (Book 2):**
   - **Book 2 Chapter 10 (`/Users/amarsukhi/src/MyCode/kym_physics/source/src/ch10.md` §§10.1, 10.4 & 10.5):** Directly verified against `kym_physics/source/src/ch10.md` lines 298–342. Matches the exact refractive indices ($n_{\text{air}} = 1.00$, $n_{\text{cornea}} \approx 1.38$, $n_{\text{humours}} \approx 1.34$, $n_{\text{lens}} \approx 1.41$), the air–cornea interface performing **about two-thirds** of total refraction while the lens fine-tunes power from **$\sim 50\text{ D}$ (distant)** to **$\sim 54\text{ D}$ (near object at $25\text{ cm}$)**, and the formation of a **real, inverted image** on the retina via the thin-lens equation $P = 1/f = 1/d_o + 1/d_i$.
   - **Book 2 Chapter 12 (`/Users/amarsukhi/src/MyCode/kym_physics/source/src/ch12.md` §§12.1–12.3):** Directly verified against `kym_physics/source/src/ch12.md` lines 116 and 204. Contrasts copper-wire conduction (mobile free electrons drifting at $\sim 8\ \mu\text{m s}^{-1}$ while the electric field propagates at $\sim 10^8\text{ m s}^{-1}$) with a biological neurone, where **zero free electrons** flow down a metal core and instead $\text{Na}^+$ and $\text{K}^+$ ions move **sideways across the cell membrane** to propagate a domino wave at $\sim 1\text{–}120\text{ m s}^{-1}$.

---

## 4. Independent Mathematical & Quantitative Verification: PASS

Every numerical value and equation across `src/ch09.md`, `figs_ch09.py`, `provenance/ch09.yml`, `live/coordination_model.js`, and `live/enhancements.js` was independently recomputed with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I` and `node`:

1. **Action potential voltages & `para^ts` thermal threshold (`src/ch09.md` §9.2, `c9_action_potential_wave`, `coordination_model.js`):**
   - Resting membrane potential: **$-70\text{ mV}$**; threshold: **$-55\text{ mV}$**; depolarisation peak: **$+30\text{ mV}$**; refractory undershoot: **$-75\text{ mV}$**.
   - `para^ts` temperature-sensitive $\text{Na}^+$ channel mutant (`mode = 3`): normal conduction at permissive $22\ ^\circ\text{C}$ ($+30\text{ mV}$ peak, $100\%$ $\text{Na}^+$ conductance); partial impairment at $28.5 \le T < 30\ ^\circ\text{C}$ ($-5\text{ mV}$, $35\%$ conductance); complete reversible conduction block at restrictive $T \ge 30\ ^\circ\text{C}$ ($v = 0\text{ m s}^{-1}$, peak stays at $-70\text{ mV}$, $\text{Na}^+$ conductance $0\%$), recovering immediately upon cooling to $22\ ^\circ\text{C}$.
2. **Pathway conduction velocities & latency budgets (`src/ch09.md` §9.2, `c9_pathway_latency_budget`, `coordination_model.js`):**
   - *Myelinated spinal withdrawal reflex (`mode = 0`, $d = 12\ \mu\text{m}$, $T = 25\ ^\circ\text{C}$, $L = 1.3\text{ m}$, $2$ synapses):*
     $$v = 6.0 \times 12 \times 1.35^{(25-25)/10} = \mathbf{72.0\text{ m s}^{-1}}$$
     $$\text{Axonal time} = \frac{1.3\text{ m}}{72.0\text{ m s}^{-1}} = 18.056\text{ ms} \approx \mathbf{18.1\text{ ms}}$$
     $$\text{Synaptic delay} = 2 \times 0.9\text{ ms} = \mathbf{1.8\text{ ms}}, \quad \text{Muscle activation} = \mathbf{16.0\text{ ms}}$$
     $$\text{Total spinal reflex latency} = 18.1 + 1.8 + 16.0 = \mathbf{35.9\text{ ms}}$$
   - *Unmyelinated pathway (`mode = 1`, $d = 12\ \mu\text{m}$, $T = 25\ ^\circ\text{C}$, $L = 1.3\text{ m}$, $2$ synapses):*
     $$v = \operatorname{round}(1.45\sqrt{12}, 2) = \mathbf{5.02\text{ m s}^{-1}}, \quad \text{Axonal time} = \operatorname{round}\!\left(\frac{1300}{5.02}, 1\right) = \mathbf{259.0\text{ ms}}, \quad \text{Total} = 259.0 + 1.8 + 16.0 = \mathbf{276.8\text{ ms}}\ (\sim 276.6\text{ ms unrounded})$$
   - *Voluntary conscious ruler catch (`mode = 2`, $d = 12\ \mu\text{m}$, $T = 25\ ^\circ\text{C}$, $L = 1.4\text{ m}$, $6$ synapses, brain cortical delay $135\text{ ms}$):*
     $$\text{Axonal time} = \operatorname{round}\!\left(\frac{1400}{72.0}, 1\right) = \mathbf{19.4\text{ ms}}, \quad \text{Synaptic} = 6 \times 0.9 = \mathbf{5.4\text{ ms}}, \quad \text{Total} = 19.4 + 5.4 + 135.0 + 16.0 = \mathbf{175.8\text{ ms}}$$
     $$\text{Ruler drop distance } d = \tfrac{1}{2}gt^2 = 0.5 \times 980\text{ cm s}^{-2} \times (0.1758\text{ s})^2 = \mathbf{15.1\text{ cm}}$$
3. **Free-fall ruler-drop kinematics (`src/ch09.md` Investigation 9.3, `c9_pathway_latency_budget`, `provenance/ch09.yml`):**
   - Using $t = \sqrt{2d/g}$ with $g = 9.8\text{ m s}^{-2} = 980\text{ cm s}^{-2}$:
     - $d = 10\text{ cm}$ ($0.10\text{ m}$): $t = \sqrt{0.20 / 9.8} = 0.14286\text{ s} \approx \mathbf{143\text{ ms}}$.
     - $d = 18\text{ cm}$ ($0.18\text{ m}$): $t = \sqrt{0.36 / 9.8} = 0.19166\text{ s} \approx \mathbf{191.7\text{ ms}}$ ($\mathbf{192\text{ ms}}$).
     - $d = 20\text{ cm}$ ($0.20\text{ m}$): $t = \sqrt{0.40 / 9.8} = 0.20203\text{ s} \approx \mathbf{202\text{ ms}}$.
     - $d = 25\text{ cm}$ ($0.25\text{ m}$): $t = \sqrt{0.50 / 9.8} = 0.22588\text{ s} \approx \mathbf{226\text{ ms}}$.
4. **Synaptic cleft diffusion vs total synaptic delay (`src/ch09.md` §9.2, `coordination_model.js`, `provenance/ch09.yml`):**
   - Across a synaptic cleft width $x = 20\text{ nm} = 2.0 \times 10^{-8}\text{ m}$, pure 1D diffusion time $t \approx x^2 / (2D)$:
     - At $D = 4.0 \times 10^{-10}\text{ m}^2\text{ s}^{-1}$ ($400\ \mu\text{m}^2\text{ s}^{-1}$, `coordination_model.js`): $t = 400 / 800 = \mathbf{0.50\ \mu\text{s}}$.
     - At $D = 5.0 \times 10^{-10}\text{ m}^2\text{ s}^{-1}$ ($500\ \mu\text{m}^2\text{ s}^{-1}$, `provenance/ch09.yml`): $t = 400 / 1000 = \mathbf{0.40\ \mu\text{s}}$.
   - Including presynaptic $\text{Ca}^{2+}$ influx, vesicle exocytosis, and postsynaptic receptor gating ($\sim 0.45\text{ ms}$ baseline $+ 0.25\text{ ms}$ at $20\text{ nm}$), total single-synapse delay is **$\mathbf{0.70\text{ ms}}$** ($\sim 0.5\text{–}1.0\text{ ms}$).
   - At $40\text{ Hz}$ forward stimulation (`mode = 0`, $20\text{ nm}$): $5$ vesicles fuse ($25{,}000$ ACh molecules), $55\%$ of postsynaptic receptors bind, $\text{EPSP} = +19.8\text{ mV}$, postsynaptic $V_m = -70 + 19.8 = \mathbf{-50.2\text{ mV}} \ge -55\text{ mV}$ threshold $\to$ **impulse fires**.
   - In reverse stimulation (`mode = 1`, Post $\to$ Pre): $0$ vesicles fuse, $0\%$ receptors bound, $V_m = -70\text{ mV}$ $\to$ **blocked (one-way rule)**.
   - In curare competitive blockade (`mode = 2`, $85\%$ receptors blocked): $5$ vesicles fuse, only $11\%$ of receptors bind, $V_m = -66.0\text{ mV} < -55\text{ mV}$ $\to$ **sub-threshold (no impulse)**.
5. **Eye accommodation thin-lens optics (`src/ch09.md` §9.3, `c9_pupil_and_accommodation`, `coordination_model.js`):**
   - Using the Book 2 Ch 10 reduced-eye convention ($d_i = 2.0\text{ cm} = 0.020\text{ m} \implies 1/d_i = 50.0\text{ D}$, fixed corneal share $P_{\text{cornea}} = 38.0\text{ D}$):
     $$P_{\text{total}} = \frac{1}{d_o} + \frac{1}{d_i} = \frac{100}{d_{\text{cm}}} + 50.0\text{ D}$$
     - Distant object at $600\text{ cm}$ ($6.0\text{ m}$): $P_{\text{total}} = \mathbf{50.17\text{ D}}$ ($P_{\text{lens}} = 12.17\text{ D}$, lens thickness $3.60\text{ mm}$).
     - Distant object at $400\text{ cm}$ ($4.0\text{ m}$): $P_{\text{total}} = \mathbf{50.25\text{ D}}$ ($P_{\text{lens}} = 12.25\text{ D}$, lens thickness $3.62\text{ mm}$).
     - Near object at $25\text{ cm}$ ($0.25\text{ m}$): $P_{\text{total}} = 50.0 + 4.0 = \mathbf{54.00\text{ D}}$ ($P_{\text{lens}} = 16.00\text{ D}$, lens thickness $4.60\text{ mm}$), an exact $+4.0\text{ D}$ ($+8\%$) accommodation range matching Book 2 Chapter 10 §10.5 (`kym_physics/source/src/ch10.md` line 307).
     - *(Note: `provenance/ch09.yml` line 176 & 202 also notes the standard Gullstrand 17 mm nodal-to-retina adult eye figures where cornea $\approx 43\text{ D}$ and lens $\approx 19\text{–}33\text{ D}$ for $\sim 60\text{–}74\text{ D}$ total power, while the chapter prose, figures, widget and Book 2 Ch 10 consistently use the 20 mm reduced-eye $\sim 50\text{–}54\text{ D}$ teaching numbers.)*
6. **Coleoptile auxin redistribution & differential elongation (`src/ch09.md` §9.4, `c9_plant_tropisms_auxin`, `coordination_model.js`):**
   - At $80\%$ unilateral light (`mode = 2`): $\text{shaded auxin} = \operatorname{round}(50 + 0.22 \times 80) = \mathbf{68\%}$ vs $\mathbf{32\%}$ lit (matching Went's 1926 $\sim 2:1$ split); shaded elongation rate $= 40 + 18 \times 3.2 = \mathbf{97.6\ \mu\text{m h}^{-1}}$ vs lit $40 - 18 \times 1.1 = \mathbf{20.2\ \mu\text{m h}^{-1}}$, bending **$+32.4^\circ$** towards light.
   - In a horizontal seedling (`mode = 3`, $68\%$ auxin on lower side): shoot bends **$+32.4^\circ$ upward** (negative gravitropism) while root bends **$-27.0^\circ$ downward** (positive gravitropism).

---

## 5. Primary Historical & Scientific Source Audit & Provenance (`provenance/ch09.yml`): PASS

1. **Bayliss & Starling (1902, *J. Physiol.* 28(5): 325–353, `PMID 16992627` / `PMC1540572`):** Accurately describes the January 1902 University College London experiment showing that dilute $\text{HCl}$ in a denervated loop of upper small intestine (jejunum/duodenum) still triggers pancreatic secretion via blood-borne **secretin**, and Starling's 1905 Croonian Lecture coining **hormone** from Greek *hormōn*. Includes explicit ethical/historical framing (`never repeated outside licensed laboratory research`).
2. **Otto Loewi (1921, *Pflügers Archiv* 189: 239–242):** Accurately describes the 1921 Graz two-frog-heart Ringer's saline transfer experiment demonstrating chemical vagal inhibition (*Vagusstoff*, identified with Henry Dale as **acetylcholine**) and sympathetic acceleration, with explicit historical laboratory framing.
3. **Alan Hodgkin & Andrew Huxley (1939 *Nature* 144: 710–711; 1952 *J. Physiol.* 117(4): 500–544, `PMID 12991237` / `PMC1392413`):** Accurately describes the 1939 Plymouth intracellular recording in the giant axon ($0.5\text{–}1.0\text{ mm}$) of *Loligo forbesii* showing the positive overshoot above $0\text{ mV}$, and the 1952 voltage-clamp separation of voltage-gated $\text{Na}^+$ inward current and delayed $\text{K}^+$ outward current.
4. **Suzuki, Grigliatti & Williamson (1971, *PNAS* 68(5): 890–893, `PMID 5280526`), Obaid Siddiqi & Seymour Benzer (1976, *PNAS* 73(9): 3253–3257, `PMID 184469` / `PMC431023`), and Loughney, Kreber & Ganetzky (1989, *Cell* 58(6): 1143–1154, `PMID 2550145`):**
   - Properly distinguishes **Suzuki et al. (1971)** (isolation of the X-linked temperature-sensitive `para^ts` *Drosophila* mutant in Vancouver), **Obaid Siddiqi & Seymour Benzer (1976)** (electrophysiological dissection between Caltech and **TIFR Colaba, Mumbai**, where Siddiqi founded the Molecular Biology Unit in 1962 at Homi Bhabha's invitation: proving that `para` reversibly loses axonal action-potential conduction above $\sim 29\text{–}32\ ^\circ\text{C}$ while direct muscle excitability remains intact, whereas `shi` and `com` maintain axonal spikes and fail at the neuromuscular synapse), and **Loughney, Kreber & Ganetzky (1989)** (molecular cloning proving that the `para` locus encodes the structural $\alpha$-subunit of the voltage-gated $\text{Na}^+$ channel).
5. **Charles Darwin & Francis Darwin (1880, *The Power of Movement in Plants*), Peter Boysen-Jensen (1913, *Ber. Dtsch. Bot. Ges.* 31: 559–566), and Frits Warmolt Went (1926/1928, Utrecht):** Accurately distinguishes Darwin's tip-removal and opaque-cap experiments, Boysen-Jensen's permeable gelatin vs shaded-side mica barrier proof of a water-soluble chemical moving down the shaded side, and Went's agar-block bioassay in darkness and split-agar lateral redistribution proof.
6. **Toshio Narahashi, John W. Moore & William R. Scott (1964, *J. Gen. Physiol.* 47(5): 965–974, `PMID 14155438` / `PMC2195365`):** Accurately frames the Chapter 9 end-case around voltage-clamped giant axons where nanomolar **tetrodotoxin (TTX)** selectively plugs the outer mouth of voltage-gated $\text{Na}^+$ channels without blocking $\text{K}^+$ channels or altering the $-70\text{ mV}$ resting potential, explicitly contrasting TTX (axonal $\text{Na}^+$-channel block before the synapse) with **curare** (postsynaptic acetylcholine receptor block).
7. **Provenance Ledger (`source/provenance/ch09.yml`) & Automated Domain Suite (`source/tests/ch09_domain.mjs`):**
   - `provenance/ch09.yml` covers all 4 sections (`9.1`–`9.4`), all 9 figures (`fig:c9_*`), `story:siddiqi-para-channels`, all 3 interactive models (`model:*`), and `record:ch09-decisions` with honest source-use, access-limit, and physical-trial disclosures.
   - Executed `node source/tests/ch09_domain.mjs`: **620 independent cases passed** with 0 failures.
   - Executed independent reviewer exhaustive Node state-space probe across all modes, diameters, temperatures, frequencies, cleft widths, distances, and light intensities: **4,124 states passed** with 0 failures.

---

## 6. Categorized Findings (`BLOCKER`, `FIX`, `CONSIDER`)

- **`BLOCKER`:** None (`0`).
- **`FIX`:** None (`0`).
- **`CONSIDER`:** None (`0`).

**Final Gate A Verdict:** **PASS (`0 BLOCKER / 0 FIX / 0 CONSIDER`)**.
