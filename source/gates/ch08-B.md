# Chapter 8 — Gate B: reader clarity, mechanism, safety, history and visual/widget execution

Independent report-only review, 30 October 2026. Reviewed the supplied finished Chapter 8 artifacts with fresh context without authoring the chapter, story, figures, models or provenance. No chapter, story, illustration, widget, ledger, baseline, runner or other project file was edited; `/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch08-B.md` is the sole file written. No publication, Git command or remote operation was performed.

**Disposition: Gate B PASS (0 BLOCKER · 0 FIX · 2 CONSIDER).** Every numbered section (8.1, 8.2, 8.3, 8.4) supports an accurate three-sentence explain-back in a 12-year-old reader's voice without reproducing the target misconception; no section requires a conceptual `REWRITE`. Both `CONSIDER` items (`B1`–`B2`) are optional voice/framing refinements that do not block acceptance.

---

## 1. Scope and Verification Evidence

1. **Standards and reference gate read:** `source/GATES.md`, `source/SKILL.md`, `source/PLAYBOOK.md`, `source/FORMAT.md`, `source/WRITING.md`, `source/NARRATIVE.md`, `source/STORYWRITING.md`, and `source/gates/ch07-B.md`.
2. **Chapter 8 artifacts audited:** `source/grounding/ch08.md`, `source/src/ch08.md`, `source/src/stories/harvey-circulation.md`, `source/figs_ch08.py`, `source/provenance/ch08.yml`, `source/live/circulation_model.js`, `source/live/w_breathing_gradients.js`, `source/live/w_double_pump.js`, `source/live/w_vessel_exchange.js`, the three Chapter 8 entries in `source/live/enhancements.js` (`breathing_gradients`, `double_pump`, `vessel_exchange`), and `source/tests/ch08_domain.mjs`.
3. **Independent local execution:**
   - Ran `node /Users/amarsukhi/src/MyCode/kym_bio/source/tests/ch08_domain.mjs`: **1,731 independent ventilation, Harvey, double-pump, VSD, vessel-continuity and tour cases passed (exit 0)**, emitting only Node's known typeless-package warning.
   - Recomputed all chapter, story, plate and widget numbers in Python (`/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`): minute ventilation $\dot{V}_E = f \times V_T$, alveolar ventilation $\dot{V}_A = f \times \max(0, V_T - V_D)$ ($12 \times 500\text{ mL} = 6.0\text{ L min}^{-1}$ total and $4.2\text{ L min}^{-1}$ alveolar vs $24 \times 250\text{ mL} = 6.0\text{ L min}^{-1}$ total and $2.4\text{ L min}^{-1}$ alveolar; home example $400\text{ mL}$ with $120\text{ mL}$ dead space vs $200\text{ mL}$ at $2f$), transpulmonary pressure $P_{\text{alv}} - P_{\text{ip}}$, partial-pressure gradients ($\Delta P_{\text{O}_2} = 104 - 40 = 64\text{ mmHg}$, $\Delta P_{\text{CO}_2} = 45 - 40 = 5\text{ mmHg}$), Harvey's 1628 Troy/apothecaries' conversion ($1\text{ drachm} \approx 3.8879\text{ g}$; $1{,}000\text{ drachms} = 125\text{ oz Troy} = 10\text{ lb } 5\text{ oz Troy} \approx 3.89\text{ kg}$; $2{,}000\text{ drachms} = 20\text{ lb } 10\text{ oz Troy}$; $4{,}000\text{ drachms} = 500\text{ oz Troy} = 41\text{ lb } 8\text{ oz Troy} \approx 15.55\text{ kg}$), modern cardiac output ($70 \times 60\text{ mL} = 4.20\text{ L min}^{-1} = 252\text{ L h}^{-1}$; $70 \times 70\text{ mL} = 4.90\text{ L min}^{-1} = 294\text{ L h}^{-1}$; athlete check $140 \times 90\text{ mL} = 12.6\text{ L min}^{-1}$), post-natal VSD shunt balance ($Q_p > Q_s$), vascular continuity ($v = Q / A_{\text{total}}$: at $Q = 4.9\text{ L min}^{-1} = 81.667\text{ cm}^3\text{ s}^{-1}$, aorta $4.5\text{ cm}^2 \to 181.481\text{ mm s}^{-1}$, capillaries $4{,}500\text{ cm}^2 \to 0.181\text{ mm s}^{-1}$, vena cava $18\text{ cm}^2 \to 45.370\text{ mm s}^{-1}$, speed ratio $1{,}000:1$), and Starling pressures/daily lymph balance ($+10\text{ mmHg}$ arterial filtration, $-7\text{ mmHg}$ venous reabsorption, $24.0 = 20.4 + 3.6\text{ L day}^{-1}$).
4. **Visual inspection:** Directly inspected the rendered static plate PNGs (`plate-1-1440-light.png` through `plate-9-1440-light.png` and `plate-1-390-dark.png` through `plate-9-390-dark.png`), interactive widget PNGs (`live-2-1440-light-default.png`, `live-6-1440-light-default.png`, `live-7-1440-light-default.png`, `live-2-390-dark-changed.png`, `live-6-390-dark-changed.png`, `live-7-390-dark-changed.png`), story modal PNG (`story-1440-light-card.png`), and PDF page renders (`pdf-261.png`, `pdf-263.png`, `pdf-268.png`, `pdf-273.png`, `pdf-278.png`, `pdf-280.png`, `pdf-288.png`, `pdf-290.png`, `pdf-293.png`) in `/tmp/lt_bio_ch08/qa/`.

---

## 2. Section-by-Section Feynman Read and Three-Sentence Explain-Backs

### 8.1 — Moving air to an exchange surface

- **Mechanism before terminology ("Thing before name"):** PASS. The section opens with a concrete Mumbai stair-climbing and quiet-breath puzzle, rejects the "suction / pulling air molecules" misconception via *The Moving World* Chapter 6, and earns bulk airflow by pressure differences, passive diffusion across a moist membrane, and intracellular fuel oxidation before highlighting `==Ventilation==`, `==Gas exchange==`, `==trachea==` and `==alveoli==` with paired `:::note` definitions placed after their introducing paragraphs.
- **Fidelity and misconception guards:**
  - Adult two-lung alveolar stereology (`Ochs et al., 2004`: mean $480\text{ million}$, range $274\text{–}790\text{ million}$ across both lungs combined) and classic $\sim 70\text{ m}^2$ surface area are explicitly qualified as adult two-lung estimates rather than a fixed single-lung constant or a direct measurement of a 12-year-old's smaller chest.
  - Atmospheric ($0\text{ mmHg}$ gauge), alveolar ($-1\text{ mmHg}$ inspiration, $+1\text{ mmHg}$ quiet expiration) and intrapleural ($-4\text{ to }-6\text{ mmHg}$) pressures are clearly separated. Quiet exhalation is taught as passive elastic recoil, while forced exhalation engages internal intercostal and abdominal muscles.
  - The bell-jar model critique explicitly states what matches (pulling the bottom sheet increases volume and lowers internal pressure so outside air pushes in) and four ways it misleads (rigid glass wall vs moving ribcage, pulled flat sheet vs domed muscular diaphragm, wide air space vs microscopic fluid-coupled pleural cavity, dry rubber vs surfactant-lined moist alveoli).
  - Anatomical dead space ($\sim 150\text{ mL}$ in an adult) is used to show why shallow rapid breathing wastes ventilation in conducting airways.
  - Exercise hyperpnoea is correctly linked to rising blood $\text{CO}_2$ concentration (and lowered pH) detected by the brain (medulla), not "running out of blood oxygen".
- **Components:** `:::predict`, `:::evidence`, `:::five Ventilation, dead space and the bell-jar model` (all 5 core `?` and 3 deeper `??` questions in exact order), `:::home`, `:::recall 6`, `:::careful`, `:::school` (0610 Topic 11.1 Core & Supplement), and `:::check` are all present and complete.

**Exactly three-sentence explain-back (8.1):** When my diaphragm and external intercostal muscles contract, they make my chest cavity larger, which drops air pressure inside my lungs slightly below outside air pressure so outside air is pushed in through my airways. The first part of every breath stays in the conducting tubes as dead space, while the fresh air that reaches the moist, one-cell-thick alveoli exchanges oxygen and carbon dioxide with blood by diffusion down each gas's own gradient. When I exercise, working muscles release more carbon dioxide into my blood, and my brain detects that extra carbon dioxide and tells my breathing muscles to breathe faster and deeper.

---

### 8.2 — Harvey's circulation question and quantitative evidence

- **Mechanism before terminology ("Thing before name"):** PASS. The section contrasts the Galenic slow outward nourishment/consumption view with a conservation-of-volume lower-bound argument before introducing the modern `Cardiac output (CO) = Heart rate (HR) × Stroke volume (SV)` equation, and then shows why mechanical vessel-pinching, bandage tightness and forearm vein-valve experiments are needed to establish one-way direction.
- **Fidelity and historical honesty:**
  - Explicitly rejects the straw man that Galen claimed the liver manufactures a person's entire body weight in blood every hour.
  - Keeps Harvey's 1628 Frankfurt lower-bound calculation in apothecaries'/Troy weight ($1{,}000\text{ beats in }30\text{ min} \times 1\text{ drachm} = 1{,}000\text{ drachms} = 10\text{ lb } 5\text{ oz Troy} \approx 3.9\text{ kg}$, or $\times 4\text{ drachms} = 41\text{ lb } 8\text{ oz Troy} \approx 15.5\text{ kg}$) strictly separate from our chosen modern metric example ($70\text{ beats min}^{-1} \times 60\text{ mL} = 4.20\text{ L min}^{-1} = 252\text{ L h}^{-1}$, or $\times 70\text{ mL} = 4.90\text{ L min}^{-1}$).
  - Credits predecessors and successors accurately: Ibn al-Nafis (1242) and Realdo Colombo (1559) for pulmonary transit, Hieronymus Fabricius (1603) for venous valves, William Harvey (Padua graduate 1602, London lectures from 1616, *De Motu Cordis* published in Frankfurt 1628), and Marcello Malpighi (1661) for microscopic observation of frog lung capillaries.
- **Components:** `:::predict`, `:::evidence`, `:::eq`, `:::story harvey-circulation`, `:::five Harvey’s circulation argument and its limits` (all 5 core `?` and 3 deeper `??` questions in order), `:::careful`, `:::school`, and `:::check` are all present and complete.

**Exactly three-sentence explain-back (8.2):** Even if the heart pumped only a tiny amount of blood on each beat, multiplying that amount by a thousand beats in half an hour gives far more blood than the whole body holds or than food could supply, so the same blood must travel around in a loop instead of being used up once. That multiplication alone cannot show which way the loop runs, so Harvey used pinched vessels, arm bandages of different tightness and one-way vein pockets on the forearm to prove that arteries carry blood away from the heart and veins bring it back towards the heart. Harvey still could not see how tiny arteries join tiny veins, and Marcello Malpighi later saw the microscopic capillary bridges in frog lungs with a microscope in 1661.

---

### 8.3 — The heart and two connected circuits

- **Mechanism before terminology ("Thing before name"):** PASS. The section first compares the pressure drop across gill capillaries in a fish's `==single circulation==` (explicitly noting that a fish heart is suited to a buoyant aquatic ectotherm, not a "defective human heart") with the dual-pressure mechanical dilemma of a mammal before naming `==double circulation==` and `==coronary arteries==` with paired `:::note` blocks.
- **Fidelity and misconception guards:**
  - Explains why both ventricles pump the **same volume per minute in series** ($Q_p = Q_s$) when the septum is intact, while the left ventricular wall is about three times thicker than the right because it must generate $\sim 5\times$ higher systolic pressure ($\sim 120\text{ mmHg}$ vs $\sim 25\text{ mmHg}$) to overcome systemic vascular resistance while keeping fragile alveolar capillaries safe from fluid leakage.
  - Defines arteries (**away** from the heart) and veins (**towards** the heart) by direction rather than oxygen content, highlighting the pulmonary artery (deoxygenated) and pulmonary veins (oxygenated), plus the aorta, venae cavae, hepatic artery, hepatic portal vein, hepatic vein, and renal arteries/veins.
  - Clearly states anatomical right (viewer's left) and anatomical left (viewer's right) and traces all four chambers and four valves (tricuspid, pulmonary semilunar, bicuspid/mitral, aortic semilunar) in sequence, linking "lub" and "dub" to pressure-driven valve closure.
  - Covers myogenic pacemaker (SAN) initiation, nervous and adrenaline modulation during exercise, heart monitoring (ECG, pulse rate, stethoscope valve sounds), and coronary heart disease (coronary artery narrowing/blockage starving heart muscle of oxygen, plus risk factors and diet/exercise prevention).
- **Components:** `:::predict`, `:::evidence`, `:::five The four-chambered double pump and its valves` (all 5 core `?` and 3 deeper `??` questions in order), `:::careful`, `:::school` (0610 Topics 9.1 & 9.2), and `:::check` are all present and complete.

**Exactly three-sentence explain-back (8.3):** A mammal's four-chambered heart acts as two pumps in series separated by a septum: the right side pumps deoxygenated blood at gentle pressure through the lungs so thin air sacs do not leak, and the left side re-pressurises the oxygenated blood to high pressure to supply the whole body. Both ventricles pump the same volume of blood per minute, so the left ventricle has a much thicker muscular wall because it has to push against higher resistance, while one-way valves open and snap shut ("lub-dub") whenever pressure is higher on one side than the other. Arteries always carry blood away from the heart and veins always carry blood towards it, and the heart muscle itself gets its oxygen and glucose from coronary arteries branching off the base of the aorta.

---

### 8.4 — Vessels, capillaries, tissue fluid and blood as a multi-job tissue

- **Mechanism before terminology ("Thing before name"):** PASS. The section resolves the "pinched garden hose" misconception using conservation of volume flow ($v = Q / A_{\text{total}}$) across a branching parallel network before defining `==Arteries==`, `==Capillaries==`, `==Veins==`, `==tissue fluid==` and `==haemoglobin==` with paired `:::note` blocks.
- **Fidelity and misconception guards:**
  - Shows why a ~1,000-fold increase in combined cross-sectional area from the single aorta ($\sim 4.5\text{ cm}^2$) to billions of parallel capillaries ($\sim 4{,}500\text{ cm}^2$) slows average blood speed from $\sim 181\text{ mm s}^{-1}$ to $\sim 0.18\text{ mm s}^{-1}$, giving time for diffusion across the one-cell-thick endothelial wall.
  - Explains tissue-fluid formation by outward hydrostatic filtration at the arterial end of a capillary bed ($\text{CHP } 35 > \text{BCOP } 25\text{ mmHg}$), noting that **red blood cells, platelets and large plasma proteins remain inside intact capillaries**, followed by $\sim 85\%$ osmotic reabsorption at the venous end ($\text{CHP } 18 < \text{BCOP } 25\text{ mmHg}$) and $\sim 15\%$ drainage into blind-ended lymphatic capillaries as **lymph** returning via lymph nodes and subclavian veins.
  - Covers all four blood components and their 0610 Core & Supplement roles: plasma (transporting cells, ions, soluble nutrients, urea, hormones, plasma proteins, $\text{CO}_2$ and heat), biconcave enucleate red blood cells with reversible haemoglobin-oxygen binding, white blood cells distinguishing multi-lobed-nucleus **phagocytes** (phagocytosis) from large-round-nucleus **lymphocytes** (antibody production), and **platelets** triggering conversion of soluble **fibrinogen** into an insoluble **fibrin** mesh to prevent blood loss and pathogen entry.
- **Chapter-end Case (`:::case The child with a hole in the septum`) & `:::next`:** The post-natal VSD case explicitly states it is a fictional reasoning case, not clinical advice, and uses pressure physics ($\text{LV } \sim 115\text{–}120\text{ mmHg} \gg \text{RV } \sim 25\text{–}35\text{ mmHg}$) to show why oxygenated blood shunts **left-to-right** into the right ventricle and recycles through the lungs ($Q_p > Q_s$), causing a systolic murmur and exertional breathlessness rather than immediate cyanosis. `:::next` bridges cleanly to Chapter 9 ("Wires, Hormones and the Steady Body").
- **Components:** `:::predict`, `:::evidence`, `:::recall 2`, `:::five Capillary exchange, lymph and the four jobs of blood` (all 5 core `?` and 3 deeper `??` questions in order), `:::careful`, `:::school` (0610 Topics 9.3 & 9.4), `:::check`, `:::case`, and `:::next` are all present and complete.

**Exactly three-sentence explain-back (8.4):** Thick elastic arteries carry high-pressure blood away from the heart and wide, valve-equipped veins return low-pressure blood towards the heart, while blood slows down about a thousandfold in capillaries because billions of narrow capillaries side by side have a huge combined cross-sectional area. At the arterial end of a capillary, blood pressure pushes water and small dissolved nutrients out through tiny wall gaps to form tissue fluid around cells—leaving red blood cells and large proteins inside—before osmosis pulls most fluid back at the venous end and lymphatic vessels return the rest as lymph. Inside blood, liquid plasma carries dissolved substances, red blood cells use haemoglobin to carry oxygen, phagocytes and lymphocytes defend against pathogens by engulfing them or making antibodies, and platelets trigger soluble fibrinogen to turn into an insoluble fibrin mesh that seals wounds.

---

## 3. Home Activity Safety and Feasibility (`:::home` in 8.1)

Reviewed `:::home Time your resting breaths and test the dead-space arithmetic` (`src/ch08.md:107–115`):
- **Materials and setting:** Requires only a wristwatch or wall clock with a second hand, a notebook and a pencil while sitting quietly in a chair in an ordinary Mumbai flat.
- **Safety:** Explicitly instructs: *"Do not hold your breath, hyperventilate or exercise to exhaustion."* No biological fluids, limewater chemicals, balloons, tight bandages or strenuous exertion are used.
- **Experimental design & model honesty:** Holds total minute ventilation ($f \times 400\text{ mL} = 2f \times 200\text{ mL}$) constant as the controlled quantity while varying breath depth versus rate; explicitly states that the watch measures breathing frequency ($f$) while the tidal volume ($400\text{ mL}$) and conducting dead space ($120\text{ mL}$) are chosen model assumptions.
- **Cleanup & non-trialled disclosure:** Includes putting pencil and notebook away and ends with the exact required sentence: *"This proposed activity has been reviewed for feasibility, not physically trialled for the book."*

---

## 4. Story (`harvey-circulation`) and Historical Ethics

Reviewed `source/src/stories/harvey-circulation.md` ("One drachm a beat, and a finger on a vein"):
- **Historical accuracy:** Distinguishes Padua anatomical study under Fabricius (graduating 1602), London Lumleian lectures (from 1616), and the 1628 Frankfurt publication of *De Motu Cordis* by William Fitzer. Credits Ibn al-Nafis (c. 1242), Realdo Colombo (1559), Hieronymus Fabricius (1603) and Marcello Malpighi (1661).
- **No invented quotes, thoughts or scenes:** Uses zero invented dialogue or internal emotions, rejects the Galenic hourly-body-weight straw man, and faithfully presents Harvey's Chapter IX conservative lower-bound arithmetic ($1\text{ drachm}$ or $4\text{ drachms}$ over $1{,}000\text{ beats}$ in $30\text{ minutes}$).
- **Optional historical-procedure caution:** See **CONSIDER B1** below.

---

## 5. Static Plates (9) and Interactive Widgets (3)

- **Static SVG plates (`figs_ch08.py`, Plates 8.1–8.9):** Visually inspected at 1440 px light, 390 px dark, and in the exported PDF pages (`pdf-261.png`, `pdf-263.png`, `pdf-268.png`, `pdf-273.png`, `pdf-278.png`, `pdf-280.png`, `pdf-288.png`, `pdf-290.png`, `pdf-293.png`). Every plate has a clear visual hierarchy, readable labels ($\ge 10.5\text{–}12\text{ px}$), semantic theme classes only (no hardcoded hex colours), explicit scale/schematic disclosures, and zero text/shape collisions or viewBox overhangs. (Note: `pdf-290.png` in `/tmp/lt_bio_ch08/qa/` was rendered 42 seconds before a minor markdown list-newline tidy in `src/ch08.md:413`, while Figure 8.8 itself and its caption are identical.)
- **Interactive widgets (`breathing_gradients`, `double_pump`, `vessel_exchange`):**
  - All three widgets register with `{ three: false, static: true }` and use manual tabs, sliders and buttons with **no autoplay clocks or autonomous timers**.
  - Snapshot captures (`captureVentilation`, `captureCirculation`, `captureVessel` in `live/circulation_model.js`) return `Object.freeze(...)` immutable records and reject invalid inputs.
  - All three comparison challenges in `live/enhancements.js` require `s.interacted` and check for specific multi-trial capture strings in the readout (`Equal minute ventilation, different alveolar ventilation: deeper breaths waste less dead space.`, `Intact and post-natal VSD states captured for comparison.`, `Aorta and Capillary bed states captured for comparison.`) that **cannot** be earned by merely stepping through the 5-shot `watch` tour or moving sliders without clicking the capture button.
  - Every one of the 15 `watch` tour shots across the 3 widgets sets all widget sliders and tabs explicitly, specifies a boolean `cutaway` state, and never clicks a capture button (`captures === 0` verified in `tests/ch08_domain.mjs`).

---

## 6. Findings (`0 BLOCKER · 0 FIX · 2 CONSIDER`)

- **CONSIDER B1 — Add a one-clause reminder that Harvey's historical vessel and ligature procedures are not for home reproduction (`src/stories/harvey-circulation.md:38–46`, `src/ch08.md:191–193`).**
  - *What & where:* Section 8.2 and Step 3 of `harvey-circulation.md` recount Harvey's live-snake vessel pinching (Ch. X), tight and medium human arm ligatures (Ch. XI), and the forearm vein-valve demonstration on a bound arm (Ch. XIII, written with second-person verbs *"1. Press one fingertip down... 2. Push against... 3. Lift the lower finger..."*). Neither passage is boxed as a home activity, and the chapter's only `:::home` block in 8.1 is completely safe. Adding a short parenthetical or closing clause in the story/section—explicitly noting that live animal vivisection and tight arm tourniquets/ligatures are seventeenth-century historical evidence and must never be tried at home—would make the boundary even more unmistakable for a twelve-year-old reader.
- **CONSIDER B2 — Trim one chapter exclamation mark and minor teleological phrasing (`src/ch08.md:139, 185, 192`, `figs_ch08.py:270, 289, 330, 688`).**
  - *What & where:* `FORMAT.md` / `GATES.md` allow at most one exclamation mark per chapter and avoid "wants/tries" phrasing for non-conscious matter. `src/ch08.md` currently has two exclamation marks (line 139 *"not oxygen!"* and line 185 *"once every minute at rest!"*) and one instance of *"trying to return"* for venous blood at line 192 (*"Blood must be entering the limb deep in the arteries and trying to return towards the chest in the veins"*), plus four exclamation marks in figure box text (`figs_ch08.py` lines 270, 289, 330, 688). Replacing the second prose exclamation mark with a full stop and *"trying to return"* with *"returning under pressure"* is an optional polish item.

---

## 7. Artifact Hash Table (SHA-256)

Exact SHA-256 hashes of the 11 reviewed Chapter 8 source and domain artifacts at the time of this review:

| Artifact Path | SHA-256 |
| --- | --- |
| `source/grounding/ch08.md` | `baea4bac864de4ccc764f0fff62a4cb3cc044a58365ea4134816f5fc75daaa18` |
| `source/src/ch08.md` | `b80cabc3a59b3f1f1d2d5ac156271feb5f5059d41e50a23035831fd38a624251` |
| `source/src/stories/harvey-circulation.md` | `e7499f81a8b43316cfe04cbcd2b7a81dba0eb12e8ca242f778bb5a0369feaab0` |
| `source/figs_ch08.py` | `415bb958bc4b31e2a84eb6c5497c18b5f1a4597984fce502fa4cf78dcf5a5a1a` |
| `source/provenance/ch08.yml` | `f7248ddb66200bd7a831757208932f0f558a29b15436233db170d087564d14e6` |
| `source/live/circulation_model.js` | `f240aed649417d1818cbc8f0bc728b6aace79b9fd00e5458d6f21963e34c2c32` |
| `source/live/w_breathing_gradients.js` | `77e75353c390c98e4d023e1d99e4e4011acbfc4ec4906448b9ef67b202e828e1` |
| `source/live/w_double_pump.js` | `9511ccd6b51f09887cb3b66b857f4aff388700ec17533e8a85ccedea387e2650` |
| `source/live/w_vessel_exchange.js` | `984ec1c80e503a31611c343152817564b2eae8244ea73235663c442b6738c7dd` |
| `source/live/enhancements.js` | `c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397` |
| `source/tests/ch08_domain.mjs` | `a36907652eb1e0532b3f4a6ae89651517bcf183ff3e92d3918235dad38a2b70a` |

Final Gate B counts: **0 BLOCKER · 0 FIX · 2 CONSIDER (B1–B2) · Gate B PASS**. Four section explain-backs, each exactly three sentences. Nine static plates and three interactive widgets reviewed across desktop, mobile and print renders. Only `source/gates/ch08-B.md` was written.


## Final independent reconfirmation — 30 October 2026

**Gate B PASS. Current outstanding counts: 0 BLOCKER · 0 FIX · 0 CONSIDER.** This decision supersedes the initial disposition above; that initial review remains as the audit trail.

Independently re-read the updated `source/src/ch08.md`, `source/src/stories/harvey-circulation.md`, and `source/figs_ch08.py`, and compared all 11 artifact SHA-256 hashes: the 8 unchanged artifacts (`grounding/ch08.md`, `provenance/ch08.yml`, `live/circulation_model.js`, `live/w_breathing_gradients.js`, `live/w_double_pump.js`, `live/w_vessel_exchange.js`, `live/enhancements.js`, and `tests/ch08_domain.mjs`) retain their exact initial hashes, and the 3 updated files adopt both optional `CONSIDER` items cleanly without altering any scientific mechanism, calculation or widget contract:

- **B1 adopted:** Both `src/ch08.md:189` (*"historical observations and surgical/ligature tests that are never to be reproduced on animals or with tight bands at home"*) and `src/stories/harvey-circulation.md:38–46` (*"historical procedures that are never to be repeated on animals or with tight bands at home"*, with the three Chapter XIII forearm vein-valve steps phrased in historical third-person/gerund form: *"1. Pressing... emptied... 2. Pushing... made... 3. Lifting... allowed..."*) now explicitly instruct the reader not to reproduce historical animal vivisection or tight arm ligatures at home.
- **B2 adopted:** In `src/ch08.md`, the second prose exclamation mark at line 185 was replaced with a full stop (leaving a single exclamation mark in the chapter at line 139) and *"trying to return"* at line 192 was replaced with *"returning under pressure"*. In `figs_ch08.py`, all four box exclamation marks (lines 270, 289, 330, 688) were replaced with clean punctuation.

Re-ran `node /Users/amarsukhi/src/MyCode/kym_bio/source/tests/ch08_domain.mjs`: **1,731 independent cases passed, exit 0**. All four section explain-backs remain exactly three sentences each and appropriate to the final text.

Final reviewed SHA-256 values:

```text
baea4bac864de4ccc764f0fff62a4cb3cc044a58365ea4134816f5fc75daaa18  grounding/ch08.md
9089725c6689bbd2a3c62f67156006b0abd75c95de77dad9cefc09dd16f1c81c  src/ch08.md
5f6078657919b3cf7857bff23f7fa97a989d474bdae756649469c8334b5ab418  src/stories/harvey-circulation.md
1cb3f7552df06371eaa08404d076cee59ea5faddf25215eb1ada573801df4ec6  figs_ch08.py
f7248ddb66200bd7a831757208932f0f558a29b15436233db170d087564d14e6  provenance/ch08.yml
f240aed649417d1818cbc8f0bc728b6aace79b9fd00e5458d6f21963e34c2c32  live/circulation_model.js
77e75353c390c98e4d023e1d99e4e4011acbfc4ec4906448b9ef67b202e828e1  live/w_breathing_gradients.js
9511ccd6b51f09887cb3b66b857f4aff388700ec17533e8a85ccedea387e2650  live/w_double_pump.js
984ec1c80e503a31611c343152817564b2eae8244ea73235663c442b6738c7dd  live/w_vessel_exchange.js
c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397  live/enhancements.js
a36907652eb1e0532b3f4a6ae89651517bcf183ff3e92d3918235dad38a2b70a  tests/ch08_domain.mjs
```

Final Gate B counts: **0 BLOCKER · 0 FIX · 0 CONSIDER outstanding**; both initial optional `CONSIDER` suggestions (`B1`–`B2`) adopted. Only this report (`source/gates/ch08-B.md`) was edited during reconfirmation.
