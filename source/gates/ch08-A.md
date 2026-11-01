# Chapter 8 — Gate A: independent facts, models, provenance and preservation review

Reviewed 30 October 2026. Independent reviewer did not author the chapter, story, figures, models or provenance. Read-only review; this report (`/Users/amarsukhi/src/MyCode/kym_bio/source/gates/ch08-A.md`) is the only file written. Scope is scientific, historical, mathematical, provenance and preservation acceptance, not final browser/print acceptance or publication approval. Read `source/GATES.md`, `source/SKILL.md`, `source/FORMAT.md`, `source/NARRATIVE.md`, `source/gates/ch07-A.md`, all twelve Chapter 8 artifacts, cached primary sources in `/tmp/ch08_sources/`, and the cross-referenced Chapter 6 of *The Moving World* (`/Users/amarsukhi/src/MyCode/kym_physics/source/src/ch06.md`). Existing `BOOKPLAN.md` simplifications are treated as planning context, not scientific evidence.

## Disposition Summary

**PASS** — **0 BLOCKER / 0 FIX / 0 CONSIDER**.

---

## Chapter 8: scientific findings and fidelity

### Section 8.1 — Moving air to an exchange surface: PASS

- **Three-process separation (`ventilation` vs `gas exchange` vs `cellular respiration`):** `src/ch08.md` explicitly separates mechanical bulk airflow driven by thoracic volume and pressure changes (**ventilation**), passive diffusion of $\text{O}_2$ and $\text{CO}_2$ in opposite directions across the thin moist alveolar-capillary barrier down their partial-pressure gradients (**gas exchange**), and intracellular chemical oxidation of fuel regenerating ATP (**cellular respiration**, linked back to Chapter 6).
- **Pressure causality and cross-book physics continuity:** Directly verified against *The Moving World* (`kym_physics/source/src/ch06.md` §§6.1–6.4). Neither prose, figures nor widgets use "diaphragm sucks/pulls air molecules" language. Sea-level atmospheric pressure ($P_{\text{atm}} = 760\text{ mmHg} \approx 101.3\text{ kPa}$, $0\text{ mmHg}$ gauge), alveolar pressure ($P_{\text{alv}}$), and intrapleural pressure ($P_{\text{ip}}$) are clearly distinguished. Because stretched elastic lung tissue pulls inward while the chest wall springs slightly outward across the fluid-coupled **pleural cavity** (visceral and parietal **pleural membranes** lubricated by **pleural fluid**), $P_{\text{ip}}$ remains negative throughout quiet breathing ($\approx -4\text{ mmHg}$ at end-exhalation to $\approx -6\text{ mmHg}$ at peak quiet inhalation), maintaining a positive transpulmonary pressure ($P_{\text{alv}} - P_{\text{ip}} = +4\text{ to }+6\text{ mmHg}$) that holds the lungs open.
- **Quiet inhalation vs quiet passive exhalation vs forced exhalation:**
  1. *Quiet inhalation (active):* **Diaphragm** contracts and flattens downward; **external intercostal muscles** contract to lift the ribcage upward and outward; thoracic and lung volume increase; by Boyle's law ($P \propto 1/V$ at constant temperature), $P_{\text{alv}}$ dips to $\approx -1\text{ mmHg}$ gauge ($759\text{ mmHg}$), and higher outside atmospheric pressure pushes air in.
  2. *Quiet exhalation (passive):* Diaphragm and external intercostals relax; **elastic recoil** of stretched lung fibres and the settling ribcage/doming diaphragm reduce thoracic volume without requiring expiratory muscle contraction, raising $P_{\text{alv}}$ to $\approx +1\text{ mmHg}$ gauge ($761\text{ mmHg}$) and pushing air out.
  3. *Forced exhalation (active):* **Internal intercostal muscles** contract to pull the ribcage downward and inward while **abdominal muscles** contract to push abdominal organs and the relaxing diaphragm upward, generating larger positive alveolar pressure (matching both physiological mechanics and Cambridge 0610 Supplement 11.1.8).
- **Conducting airway route and mucociliary defence:** Correctly traces **nose/mouth → pharynx → larynx → trachea → left and right bronchi → bronchioles → alveoli**. Incomplete **C-shaped rings of cartilage** in the trachea prevent collapse when airway pressure drops or the neck moves while leaving a soft posterior surface next to the oesophagus. **Goblet cells** secrete sticky **mucus** that traps dust and pathogens, and **ciliated epithelial cells** beat in coordinated waves to sweep mucus upward to the pharynx to be swallowed into stomach acid (0610 Supplement 11.1.6 & 11.1.11).
- **Bell-jar model fidelity and four explicit misrepresentations:** `src/ch08.md`, `c8_thorax_pressure_cycle` and `w_breathing_gradients.js` state what the bell-jar model gets right (pulling the bottom sheet increases jar volume and lowers internal pressure so outside atmospheric pressure pushes air into the balloons) and explicitly identify all four misrepresentations: (1) rigid glass jar wall vs movable ribcage driven by intercostals; (2) flat rubber sheet pulled down past baseline from a central knot vs an upward-arching muscular dome that flattens when contracting; (3) wide air-filled jar cavity vs microscopic fluid-filled pleural cavity; (4) dry rubber balloons vs hundreds of millions of moist alveoli lined with surfactant.
- **Stereological alveolar counts and surface area (Ochs et al. 2004, `PMID 14512270`):** Independently checked against `/tmp/ch08_sources/pubmed_ochs2004.txt`. In $n = 6$ adult human lungs studied by unbiased Euler-network stereology, total alveolar count across **both lungs combined** averaged **480 million** with a range of **274 million to 790 million** (CV $37\%$, correlated with total lung volume; mean single alveolus volume $4.2 \times 10^6\ \mu\text{m}^3$, $\approx 170\text{ alveoli mm}^{-3}$). The chapter, evidence box, figure `c8_alveolar_exchange`, widget and provenance explicitly report these as **adult two-lung combined estimates** (alongside classic $\sim 70\text{ m}^2$ adult two-lung surface area and $\sim 0.5\ \mu\text{m}$ alveolar-capillary barrier thickness), avoiding the single-lung confusion in OpenStax *Biology 2e* §39.2 and never claiming that $70\text{ m}^2$ or $480\text{ million}$ was measured in a 12-year-old reader.
- **Anatomical dead space, partial pressures, inspired vs expired air, and brain $\text{CO}_2$ exercise control:**
  - Separating conducting-airway **anatomical dead space** ($V_D \approx 150\text{ mL}$ in an adult) from **tidal volume** ($V_T \approx 500\text{ mL}$) explains why fresh alveolar ventilation $\dot{V}_A = f \times (V_T - V_D)$ differs from total minute ventilation $\dot{V}_E = f \times V_T$.
  - Independent diffusion down partial-pressure gradients across the moist one-cell-thick alveolar epithelium and one-cell-thick capillary endothelium: $\text{O}_2$ from alveolar air ($P_{\text{O}_2} \approx 104\text{ mmHg}$) to arriving pulmonary arterial blood ($40\text{ mmHg}$, $\Delta P = 64\text{ mmHg}$), and $\text{CO}_2$ from arriving blood ($P_{\text{CO}_2} \approx 45\text{ mmHg}$) to alveolar air ($40\text{ mmHg}$, $\Delta P = 5\text{ mmHg}$).
  - Inspired vs expired air table matches Cambridge 0610 11.1.4 & 11.1.9: **$\text{O}_2$** $21\% \to 16\%$, **$\text{CO}_2$** $0.04\% \to 4\%$ (tested with limewater or hydrogencarbonate indicator), **$\text{N}_2$** $78\% \to 78\%$, **water vapour** variable $\to$ saturated (and warmer).
  - Exercise control (0610 11.1.10): faster aerobic cellular respiration in active muscles raises **blood $\text{CO}_2$ concentration** (and lowers pH via carbonic acid dissociation), which is **detected by the brain** (medulla respiratory centre / chemoreceptors), increasing both the **rate and depth** of breathing.

### Section 8.2 & Companion Story (`harvey-circulation`) — Quantitative and experimental proof: PASS

- **Honest representation of Galenic physiology:** Both `src/ch08.md` and `src/stories/harvey-circulation.md` accurately describe Galen's two-stream nutritive/vital blood model and tissue consumption without repeating the modern textbook strawman that Galen claimed the liver manufactures a person's entire body weight in blood every hour.
- **Historical places, dates and publication details:** Independently verified against the cached 1847 Robert Willis translation of Harvey's 1628 Latin treatise (`/tmp/ch08_sources/harvey_ch7_14_wrapped.txt`) and peer-reviewed historical scholarship (`/tmp/ch08_sources/pubmed_harvey_history.xml`, `pubmed_ibn_al_nafis.xml`, `pubmed_malpighi.xml`). Harvey studied at Padua under **Hieronymus Fabricius** (graduating 1602), lectured at the College of Physicians in **London** from **1616**, and published *Exercitatio Anatomica de Motu Cordis et Sanguinis in Animalibus* (*De Motu Cordis*) in **Frankfurt** in **1628** with the publisher **William Fitzer**.
- **Harvey's Chapter IX conservative lower-bound calculation vs modern metric example:**
  - *De Motu Cordis* Chapter IX (verified verbatim in `/tmp/ch08_sources/harvey_ch7_14_wrapped.txt` lines 170–210): Harvey noted the dilated human left ventricle holds upwards of $2\text{ ounces}$, then assumed for his lower-bound argument that each contraction ejects only $\frac{1}{8}$, $\frac{1}{6}$, or $\frac{1}{4}$ of that charge—**$1\text{ drachm}$**, **$2\text{ drachms}$**, **$3\text{ drachms}$**, or **half an ounce ($4\text{ drachms}$)**—over **$1{,}000\text{ beats}$ in half an hour**. In apothecaries'/Troy weight ($8\text{ drachms} = 1\text{ oz}$, $12\text{ oz} = 1\text{ lb Troy} = 96\text{ drachms}$):
    - $1\text{ drachm} \times 1{,}000 = 1{,}000\text{ drachms} = 125\text{ oz} = \mathbf{10\text{ lb } 5\text{ oz Troy}}$ ($\approx 3.89\text{ kg}$).
    - $2\text{ drachms} \times 1{,}000 = 2{,}000\text{ drachms} = 250\text{ oz} = \mathbf{20\text{ lb } 10\text{ oz Troy}}$ ($\approx 7.78\text{ kg}$).
    - $4\text{ drachms} \times 1{,}000 = 4{,}000\text{ drachms} = 500\text{ oz} = \mathbf{41\text{ lb } 8\text{ oz Troy}}$ ($\approx 15.55\text{ kg}$).
  - The chapter, story, figure `c8_harvey_evidence` and widget `w_double_pump.js` keep Harvey's 1628 Troy/apothecaries' underestimate strictly separate from the chosen modern clinical illustration ($\text{CO} = \text{HR} \times \text{SV} = 70\text{ bpm} \times 60\text{ mL} = 4.20\text{ L min}^{-1} = 252\text{ L h}^{-1}$, or $70\text{ bpm} \times 70\text{ mL} = 4.90\text{ L min}^{-1} = 294\text{ L h}^{-1}$).
- **Epistemic boundary between arithmetic, mechanical experiments, and later microscopy:**
  - *What arithmetic proves:* Rules out single-pass production from ingested food and complete consumption by tissues; blood must recirculate.
  - *What ligature and valve experiments prove (Chapters X, XI, XIII, verified verbatim at lines 279–320 and 530–569 of `/tmp/ch08_sources/harvey_ch7_14_wrapped.txt`):* Pinching the snake's vena cava empties the segment toward the heart while pinching the artery distends the segment leaving the heart (Ch X); a tight arm bandage blocks both arteries and veins (cold, pulseless hand), whereas a medium bandage lets high-pressure arterial blood pass while compressing low-pressure veins so veins swell *below* the band (Ch XI); pressing a forearm vein at lower node $H$ and stroking upward past valve $O$ leaves segment $HO$ empty because valve $O$ prevents backward flow toward the hand, while releasing $H$ refills the segment from the hand toward the heart (Ch XIII).
  - *Predecessors and later discoveries credited accurately:* **Ibn al-Nafis** (c. 1242, rejecting invisible septal pores and describing pulmonary transit), **Realdo Colombo** (1559, pulmonary transit), and **Hieronymus Fabricius** (1603, *De Venarum Ostiolis*, venous valves) are credited as predecessors; **Marcello Malpighi** (1661, *De Pulmonibus*, microscopic observation of frog lung capillaries) and 1770s chemistry ($\text{O}_2$) are explicitly placed after Harvey.
- **Story `terms:` ownership check:** `src/stories/harvey-circulation.md` declares `terms: De Motu Cordis, Hieronymus Fabricius, Marcello Malpighi, Realdo Colombo, Ibn al-Nafis`. Independent Python case-insensitive search across `src/ch00.md` through `src/ch07.md` and all earlier stories returned **0 hits** for all five terms.

### Section 8.3 & Chapter-End Clinical Case — Double circulation, heart mechanics, and post-natal VSD: PASS

- **Fish single circulation vs mammalian double circulation:** Rejects the `BOOKPLAN.md` "collapse in seconds" framing (`grounding/ch08.md` §3.1, `provenance/ch08.yml` `record:ch08-decisions`). Bony fish single circulation ($\text{1 atrium} \to \text{1 ventricle} \to \text{gill capillaries} \to \text{systemic body capillaries} \to \text{heart}$, passing through the heart **once** per circuit) is presented accurately as adapted to a water-supported aquatic ectotherm, where the pressure drop across narrow gill capillaries leaves lower systemic pressure. Mammalian double circulation passes through the heart **twice** per complete circuit: a low-pressure **pulmonary circuit** ($\sim 25\text{ mmHg}$ peak systolic in RV, protecting $0.5\ \mu\text{m}$ alveolar capillaries from fluid leakage/oedema) and a re-pressurised high-pressure **systemic circuit** ($\sim 120\text{ mmHg}$ peak systolic in LV, driving rapid flow to all body organs).
- **Series flow conservation vs wall thickness:** In an intact heart without a shunt, the pulmonary and systemic circuits are in series, so both ventricles pump the **same steady volume per minute** ($Q_p = Q_s = \text{CO}$). The **left ventricular wall is $\sim 3\times$ thicker** ($\sim 12\text{–}15\text{ mm}$ vs $\sim 4\text{–}5\text{ mm}$) because it must generate $\sim 5\times$ higher systolic pressure ($\sim 120\text{ mmHg}$ vs $\sim 25\text{ mmHg}$) against the much higher resistance of the whole-body systemic tree; **ventricles have much thicker walls than atria** because atria only push blood into the ventricles immediately below them. The muscular **septum** separates oxygenated blood on the left from deoxygenated blood on the right.
- **Named vessels, chamber orientation, and valve mechanics:**
  - Explicitly states that front-facing heart diagrams show **anatomical right on the viewer's left** and **anatomical left on the viewer's right**.
  - Defines **arteries** as vessels carrying blood **away from the heart** and **veins** as vessels carrying blood **towards the heart** regardless of oxygen content (pulmonary artery carries deoxygenated blood away from RV; pulmonary veins carry oxygenated blood towards LA).
  - Covers all Cambridge 0610 9.3.3 & 9.3.6 named vessels in prose and `c8_double_circulation`: **vena cava**, **aorta**, **pulmonary artery**, **pulmonary vein**, **hepatic artery**, **hepatic portal vein** (from gut capillaries to liver), **hepatic vein** (from liver to vena cava), **renal artery**, and **renal vein**.
  - Traces the **atrioventricular valves** (**tricuspid** on the right, **bicuspid/mitral** on the left, supported by tendons/*chordae tendineae*) and **semilunar valves** (**pulmonary** and **aortic**), connecting their pressure-driven closure to the stethoscope "**lub**" (AV valves closing at ventricular systole) and "**dub**" (semilunar valves closing at ventricular diastole) heart sounds.
- **Pacemaker, exercise regulation, monitoring, and CHD:** Distinguishes the intrinsic myogenic **pacemaker (sinoatrial node, SAN)** in the right atrium from exercise modulation via brain **autonomic nerves** and **adrenaline**. Covers the three 0610 9.2.3 monitoring methods (**ECG**, **pulse rate**, and **listening to sounds of valves closing**) and **coronary heart disease (CHD)**—atheromatous plaque narrowing/thrombosis of the **coronary arteries** supplying the myocardium, along with all 0610 9.2.5–9.2.6 risk factors (diet high in saturated fats, lack of exercise, stress, smoking, genetic predisposition, age, and biological sex).
- **Chapter-end Case (`The child with a hole in the septum`):** Grounded in post-natal VSD haemodynamics (`PMID 21606399`, `PMID 24703800`, `PMID 31985995`). Clearly states the fictional-case disclaimer. Because post-natal left ventricular systolic pressure ($\sim 115\text{–}120\text{ mmHg}$) is more than three times right ventricular systolic pressure ($\sim 25\text{–}35\text{ mmHg}$), an uncomplicated post-natal ventricular septal defect drives a **left-to-right shunt** of already-oxygenated blood from LV into RV and back through the pulmonary artery and lungs ($Q_p > Q_s$), producing a turbulent **systolic murmur** between "lub" and "dub" and pulmonary volume overload/exertional breathlessness without immediate cyanosis (noting parenthetically that right-to-left reversal occurs only if years of untreated pulmonary vascular damage raise right-sided pressure above left).

### Section 8.4 — Vessels, capillaries, tissue fluid and blood: PASS

- **Continuity equation ($v = Q / A_{\text{total}}$) across the branching vascular tree:** Explicitly debunks the pinched-garden-hose misconception. Although a single capillary is only $\sim 8\ \mu\text{m}$ wide, billions of capillaries in parallel have a combined cross-sectional area $A_{\text{total}} \approx 4{,}500\text{ cm}^2$—roughly $1{,}000\times$ the single aorta's $4.5\text{ cm}^2$. At $Q = 4.9\text{ L min}^{-1} \approx 81.67\text{ cm}^3\text{ s}^{-1}$, average linear velocity drops from $\approx 181\text{ mm s}^{-1}$ ($18.1\text{ cm s}^{-1}$) in the aorta to $\approx 0.18\text{ mm s}^{-1}$ in the capillary bed, then rises to $\approx 45\text{ mm s}^{-1}$ in the venae cavae ($A_{\text{total}} \approx 18\text{ cm}^2$).
- **Artery, capillary and vein wall structure and function:** Matches Cambridge 0610 9.3.1, 9.3.4 & 9.3.5. **Arteries** have thick muscular and elastic walls and a relatively narrow lumen (stretching and recoiling to smooth high-pressure surges; arterioles adjust resistance via vasoconstriction/vasodilation). **Capillaries** have a single-cell-thick endothelial wall ($\sim 0.5\ \mu\text{m}$) and narrow single-file lumen ($\sim 8\ \mu\text{m}$) with no valves, minimising diffusion distance. **Veins** have thinner walls with less muscle/elastic tissue, a wide low-resistance lumen, and **one-way semilunar valves** assisted by skeletal muscle squeezing.
- **Tissue fluid filtration, osmotic reabsorption, and lymphatic return:** At the arterial end of a capillary bed, hydrostatic pressure ($\text{CHP} \approx 35\text{ mmHg}$) exceeds blood colloidal osmotic pressure ($\text{BCOP} \approx 25\text{ mmHg}$, $\text{NFP} = +10\text{ mmHg}$), filtering water and small solutes ($\text{O}_2$, glucose, amino acids, ions) into **tissue fluid** while **red blood cells, platelets and large plasma proteins** stay inside the capillary. At the venous end, hydrostatic pressure has fallen ($\text{CHP} \approx 18\text{ mmHg} < \text{BCOP } 25\text{ mmHg}$, $\text{NFP} = -7\text{ mmHg}$), so $\sim 85\%$ of filtered fluid returns to blood by osmosis, while the remaining $\sim 15\%$ enters blind-ended **lymphatic capillaries** as **lymph**, passes through **lymph nodes** (containing lymphocytes and phagocytes), and returns via **subclavian veins**.
- **Blood components and clotting (0610 9.4.1–9.4.7):**
  - **Plasma ($\sim 55\%$):** liquid matrix transporting blood cells, mineral ions, soluble nutrients (glucose, amino acids), urea, hormones, plasma proteins, $\text{CO}_2$ (mainly as $\text{HCO}_3^-$), and heat.
  - **Red blood cells (erythrocytes):** biconcave discs lacking a nucleus (and mitochondria), packed with **haemoglobin** that binds $\text{O}_2$ reversibly ($\text{Hb} + 4\,\text{O}_2 \rightleftharpoons \text{Hb(O}_2)_4$).
  - **White blood cells (leukocytes):** clearly distinguishes **phagocytes** (multi-lobed nucleus; engulf and digest pathogens in vacuoles by **phagocytosis**) from **lymphocytes** (large round nucleus filling most of the cell; produce specific **antibodies**).
  - **Platelets and clotting:** non-nucleated cell fragments that initiate clotting at a wound, converting **soluble fibrinogen** into an **insoluble fibrin mesh** that traps red blood cells to prevent blood loss and block pathogen entry.

---

## Syllabus, figures, models, widgets and provenance

- **Cambridge IGCSE Biology 0610 (2026–2028 v3 & 2029) verification:** Independently checked `/tmp/ch08_sources/cambridge_topics_9_11_exact.txt` extracted from the official 2026–2028 and 2029 syllabuses. All Core and Supplement sub-objectives across **Topic 9 (`9.1`–`9.4`)** and **Topic 11 (`11.1`)** are accurately mapped and taught in Sections 8.1–8.4 and their `:::school` bridges. No assessment items are copied, and 0893 Lower Secondary scope is honestly qualified in `provenance/ch08.yml`.
- **Static figures (`source/figs_ch08.py`):** All nine original `@figure` functions (`c8_airway_mucociliary`, `c8_thorax_pressure_cycle`, `c8_alveolar_exchange`, `c8_harvey_evidence`, `c8_double_circulation`, `c8_heart_cutaway`, `c8_vessel_comparison`, `c8_capillary_bed_blood`, `c8_septal_defect_case`) were inspected at code level. Every figure uses semantic theme classes only, provides detailed accessible alt text and scale/model-limit disclosures, and matches the numerical and anatomical contracts in `grounding/ch08.md`.
- **Interactive models, widgets and enhancements (`circulation_model.js`, `w_breathing_gradients.js`, `w_double_pump.js`, `w_vessel_exchange.js`, and the 3 new `enhancements.js` entries):**
  - Pure, deterministic state functions (`ventilationAccount`, `harveyAccount`, `circulationAccount`, `vesselAccount`) clamp out-of-range and non-finite inputs safely to documented defaults.
  - Capture functions (`captureVentilation`, `captureCirculation`, `captureVessel`) return `Object.freeze(...)` immutable snapshots.
  - All three new `ENHANCEMENTS` entries (`breathing_gradients`, `double_pump`, `vessel_exchange`) include `challenge`, `yourNumbers`, `cutaway`, 5-shot `watch` tours that explicitly set every slider/tab and boolean `cutaway` without auto-clicking capture buttons, and `idealised` model-limit disclosures.
- **Provenance ledger (`source/provenance/ch08.yml`):** Covers all four numbered sections (`8.1`–`8.4`), all nine figures, `story:harvey-circulation`, all three models, and `record:ch08-decisions`. OpenStax *Biology 2e* (spine) and *Anatomy and Physiology 2e* (corroborating physiological facts) are properly credited with author/section details and access-for-free attribution notes.

---

## Independent Python & Node verification receipts

Executed independently with `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python -I` and `node`:

1. **Ventilation & dead-space arithmetic:**
   - Quiet resting breath ($V_T = 500\text{ mL}$, $f = 12\text{ min}^{-1}$, $V_D = 150\text{ mL}$): $\dot{V}_E = 6.00\text{ L min}^{-1}$, $\dot{V}_A = 4.20\text{ L min}^{-1}$, $\dot{V}_D = 1.80\text{ L min}^{-1}$.
   - Shallow rapid breathing ($V_T = 250\text{ mL}$, $f = 24\text{ min}^{-1}$, $V_D = 150\text{ mL}$): $\dot{V}_E = 6.00\text{ L min}^{-1}$, $\dot{V}_A = 2.40\text{ L min}^{-1}$, $\dot{V}_D = 3.60\text{ L min}^{-1}$.
   - Home activity example ($V_T = 400\text{ mL}$, $V_D = 120\text{ mL}$ at $f = 15\text{ min}^{-1}$ vs $200\text{ mL}$ at $2f = 30\text{ min}^{-1}$): both give $\dot{V}_E = 6.00\text{ L min}^{-1}$, while $\dot{V}_A$ drops from $4.20\text{ L min}^{-1}$ to $2.40\text{ L min}^{-1}$.
2. **Harvey 1628 Troy/apothecaries' lower bound vs modern cardiac output:**
   - At $1\text{ drachm} = 3.8879346\text{ g}$ over $1{,}000\text{ beats}$ in $30\text{ min}$:
     - $1\text{ drachm/beat} \to 1{,}000\text{ drachms} = 125\text{ oz} = \mathbf{10\text{ lb } 5\text{ oz Troy}}$ ($3.8879\text{ kg}$).
     - $2\text{ drachms/beat} \to 2{,}000\text{ drachms} = 250\text{ oz} = \mathbf{20\text{ lb } 10\text{ oz Troy}}$ ($7.7759\text{ kg}$).
     - $3\text{ drachms/beat} \to 3{,}000\text{ drachms} = 375\text{ oz} = \mathbf{31\text{ lb } 3\text{ oz Troy}}$ ($11.6638\text{ kg}$).
     - $4\text{ drachms/beat} \to 4{,}000\text{ drachms} = 500\text{ oz} = \mathbf{41\text{ lb } 8\text{ oz Troy}}$ ($15.5517\text{ kg}$).
   - Modern metric cardiac output: $70\text{ bpm} \times 60\text{ mL} = 4.20\text{ L min}^{-1} = 252.0\text{ L h}^{-1} = 6{,}048.0\text{ L day}^{-1}$; $70\text{ bpm} \times 70\text{ mL} = 4.90\text{ L min}^{-1} = 294.0\text{ L h}^{-1}$; athlete check $140\text{ bpm} \times 90\text{ mL} = 12.60\text{ L min}^{-1}$.
3. **Post-natal VSD shunt & systemic vascular continuity ($v = Q / A_{\text{total}}$):**
   - VSD case examples: at $Q_s = 4.5\text{ L min}^{-1}$ and $Q_{\text{shunt}} = 3.6\text{ L min}^{-1}$, $Q_p = 8.1\text{ L min}^{-1}$ ($Q_p/Q_s = 1.80$); at $Q_s = 4.2\text{ L min}^{-1}$ and $Q_p = 6.3\text{ L min}^{-1}$, $Q_{\text{shunt}} = 2.1\text{ L min}^{-1}$ ($Q_p/Q_s = 1.50$); in the widget model ($60\%$ L→R shunt), $Q_p/Q_s = 1.60$ across all HR/SV combinations.
   - Continuity at $Q = 4.9\text{ L min}^{-1} = 81.6667\text{ cm}^3\text{ s}^{-1}$:
     - Aorta ($A_{\text{total}} = 4.5\text{ cm}^2$): $v = 18.1481\text{ cm s}^{-1} = \mathbf{181.481\text{ mm s}^{-1}}$.
     - Systemic capillaries ($A_{\text{total}} = 4{,}500\text{ cm}^2$): $v = 0.0181\text{ cm s}^{-1} = \mathbf{0.181\text{ mm s}^{-1}}$ (exact $1{,}000\times$ reduction).
     - Venae cavae ($A_{\text{total}} = 18\text{ cm}^2$): $v = 4.5370\text{ cm s}^{-1} = \mathbf{45.370\text{ mm s}^{-1}}$.
   - Starling capillary exchange: arterial $\text{NFP} = 35 - 25 = +10\text{ mmHg}$; venous $\text{NFP} = 18 - 25 = -7\text{ mmHg}$; at $24.0\text{ L day}^{-1}$ filtration, $85\%$ osmotic reabsorption $= 20.4\text{ L day}^{-1}$ and $15\%$ lymphatic return $= 3.6\text{ L day}^{-1}$.
4. **Domain test suite and independent Node probes:**
   - Executed `node source/tests/ch08_domain.mjs`: **1,731 cases passed** with 0 failures.
   - Executed independent reviewer in-memory Node probes across full parameter grids, frozen-snapshot mutation attempts, and tour invariants: **1,712 states passed** with 0 failures.
5. **Preservation baseline verification (`source/tests/ch08-preserved.json`):**
   - Verified all **231** recorded preservation targets by SHA-256: **230 of 231** files are byte-for-byte identical to the baseline.
   - The sole changed file is the authorised shared `source/live/enhancements.js` (`53,435` bytes, SHA-256 `c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397`). Removing the newly appended Chapter 8 block beginning at `  breathing_gradients: {` and restoring the closing `};\n` reproduces the exact baseline length (`44,489` bytes) and SHA-256 (`5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3`).

---

## Reviewed artifact hashes

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch08.md` | 70877 | `baea4bac864de4ccc764f0fff62a4cb3cc044a58365ea4134816f5fc75daaa18` |
| `source/src/ch08.md` | 65520 | `b80cabc3a59b3f1f1d2d5ac156271feb5f5059d41e50a23035831fd38a624251` |
| `source/src/stories/harvey-circulation.md` | 7332 | `e7499f81a8b43316cfe04cbcd2b7a81dba0eb12e8ca242f778bb5a0369feaab0` |
| `source/figs_ch08.py` | 42493 | `415bb958bc4b31e2a84eb6c5497c18b5f1a4597984fce502fa4cf78dcf5a5a1a` |
| `source/provenance/ch08.yml` | 24050 | `f7248ddb66200bd7a831757208932f0f558a29b15436233db170d087564d14e6` |
| `source/live/circulation_model.js` | 14140 | `f240aed649417d1818cbc8f0bc728b6aace79b9fd00e5458d6f21963e34c2c32` |
| `source/live/w_breathing_gradients.js` | 7125 | `77e75353c390c98e4d023e1d99e4e4011acbfc4ec4906448b9ef67b202e828e1` |
| `source/live/w_double_pump.js` | 6897 | `9511ccd6b51f09887cb3b66b857f4aff388700ec17533e8a85ccedea387e2650` |
| `source/live/w_vessel_exchange.js` | 6437 | `984ec1c80e503a31611c343152817564b2eae8244ea73235663c442b6738c7dd` |
| `source/live/enhancements.js` | 53435 | `c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397` |
| `source/tests/ch08-preserved.json` | 93705 | `37cf3bf9f0d90311794dcc597b51690874fd6971d2cd22f37267d6a6d28ef016` |
| `source/tests/ch08_domain.mjs` | 6724 | `a36907652eb1e0532b3f4a6ae89651517bcf183ff3e92d3918235dad38a2b70a` |

Reviewed scope: **12 hashed artifacts**, **4 numbered sections (`8.1`–`8.4`), 1 clinical case, 1 historical story (`harvey-circulation`), 9 static SVG figures, 3 interactive canvas widgets, 3 appended `ENHANCEMENTS` entries, 1,731 domain test cases + 1,712 independent Node probe states, and 231 preservation targets**.

Final Gate A verdict: **0 BLOCKER / 0 FIX / 0 CONSIDER — PASS**.

---

## Final independent reconfirmation — PASS

Requested and completed 30 October 2026 after the coordinator adopted Gate B's two optional voice/safety items (`B1` and `B2`).

1. **Independently inspected the three updated files (`src/ch08.md`, `src/stories/harvey-circulation.md`, `figs_ch08.py`):**
   - `src/ch08.md`: Line 185 replaces the second chapter exclamation mark with a full stop (`once every minute at rest.`); line 189 adds an explicit parenthetical safety note (`(historical observations and surgical/ligature tests that are never to be reproduced on animals or with tight bands at home)`); line 192 replaces `"trying to return"` with `"returning under pressure"`. All quantitative values, equations, historical citations, and scientific claims remain untouched.
   - `src/stories/harvey-circulation.md`: Line 38 adds the explicit parenthetical safety reminder (`(historical procedures that are never to be repeated on animals or with tight bands at home)`), and lines 42–46 frame Harvey's Chapter XIII three-part forearm vein-valve test in third-person historical narration (`Pressing...`, `Pushing...`, `Lifting...`) rather than imperative instructions. All historical dates, places (Padua, London, Frankfurt 1628), Chapter IX Troy/apothecaries' arithmetic, and contributor credits (Ibn al-Nafis, Colombo, Fabricius, Harvey, Malpighi) remain untouched.
   - `figs_ch08.py`: Four punctuation edits in `c8_harvey_evidence`, `c8_double_circulation`, and `c8_septal_defect_case` replace exclamation marks with full stops or a semicolon (`intake.`, `flat;`, `heart.)`, `recycles)`). All coordinates, dimensions, arrows, and quantitative labels are unchanged.
2. **Byte-identity of the remaining 9 Chapter 8 artifacts and 231 preservation targets:**
   - Compared to the initial Gate A review table above, `grounding/ch08.md`, `provenance/ch08.yml`, `live/circulation_model.js`, `live/w_breathing_gradients.js`, `live/w_double_pump.js`, `live/w_vessel_exchange.js`, `live/enhancements.js`, `tests/ch08-preserved.json`, and `tests/ch08_domain.mjs` are **100% byte-identical**.
   - Re-verified all **231** preservation baseline targets against `source/tests/ch08-preserved.json`: **230 of 231** files are byte-identical, and stripping the three appended Chapter 8 entries from `source/live/enhancements.js` (`53,435` bytes) and restoring `};\n` reproduces the exact baseline bytes (`44,489` bytes) and SHA-256 (`5502146a54729d027ddface39ff63361b82398f2f24342363ab72c063209d4f3`).

### Final reviewed artifact hashes

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch08.md` | 70877 | `baea4bac864de4ccc764f0fff62a4cb3cc044a58365ea4134816f5fc75daaa18` |
| `source/src/ch08.md` | 65673 | `9089725c6689bbd2a3c62f67156006b0abd75c95de77dad9cefc09dd16f1c81c` |
| `source/src/stories/harvey-circulation.md` | 7494 | `5f6078657919b3cf7857bff23f7fa97a989d474bdae756649469c8334b5ab418` |
| `source/figs_ch08.py` | 42491 | `1cb3f7552df06371eaa08404d076cee59ea5faddf25215eb1ada573801df4ec6` |
| `source/provenance/ch08.yml` | 24050 | `f7248ddb66200bd7a831757208932f0f558a29b15436233db170d087564d14e6` |
| `source/live/circulation_model.js` | 14140 | `f240aed649417d1818cbc8f0bc728b6aace79b9fd00e5458d6f21963e34c2c32` |
| `source/live/w_breathing_gradients.js` | 7125 | `77e75353c390c98e4d023e1d99e4e4011acbfc4ec4906448b9ef67b202e828e1` |
| `source/live/w_double_pump.js` | 6897 | `9511ccd6b51f09887cb3b66b857f4aff388700ec17533e8a85ccedea387e2650` |
| `source/live/w_vessel_exchange.js` | 6437 | `984ec1c80e503a31611c343152817564b2eae8244ea73235663c442b6738c7dd` |
| `source/live/enhancements.js` | 53435 | `c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397` |
| `source/tests/ch08-preserved.json` | 93705 | `37cf3bf9f0d90311794dcc597b51690874fd6971d2cd22f37267d6a6d28ef016` |
| `source/tests/ch08_domain.mjs` | 6724 | `a36907652eb1e0532b3f4a6ae89651517bcf183ff3e92d3918235dad38a2b70a` |

Final source scope: **12 hashed artifacts; 4 numbered sections (`8.1`–`8.4`), 1 clinical case, 1 historical story, 9 static figures, 3 widgets, 3 appended enhancement entries; 231 original preservation targets**. Remaining Gate A findings: **0 BLOCKER / 0 FIX / 0 CONSIDER — PASS**.
