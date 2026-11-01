#!/usr/bin/env python3
"""
Deterministic content pack compiler for KymBio (iPadOS 27 & macOS).

Compiles:
1. All 16 chapters of "The Living World" (source/src/ch00.md .. ch15.md)
2. All 16 3D Atlas lessons (source/lessons/vol1_cells.json .. vol4_genetics_ecology.json)
3. All live widgets & pedagogical enhancements (source/live/enhancements.js)
4. All 4 Front-Matter Explorers (x_scale, x_cell, x_code, x_map)
5. Complete 9-unit / 42-sub-topic Cambridge Lower Secondary Science 8
   (Learner's Book 8 & Workbook 8 by Mary Jones, Diane Fellowes-Freeman & Michael Smyth)
   with exact LB/WB page numbers, strands, Kym's completed unit ticks, and
   pre-seeded Worked Example -> Faded Completion -> Independent Proof questions.
6. 7 First-Principles Cross-Disciplinary Bridges from ../kym_chem and ../kym_physics
7. 24 Specimen & School Diagram Recall Plates with callout pins for Apple Pencil recall.

Also bundles the offline Living World web reader assets (index.html, live/, assets/)
into KymBio/KymBio/Resources/LivingWorldBook/.
"""

import json
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "source"
KYMBIO_DIR = ROOT / "KymBio" / "KymBio"
PACK_DIR = KYMBIO_DIR / "Resources" / "ContentPacks"
BOOK_BUNDLE_DIR = KYMBIO_DIR / "Resources" / "LivingWorldBook"

VOLUME_META = {
    1: {"id": "vol1", "number": 1, "title": "Volume I · Cells and the Machinery of Life", "chapters": [0, 1, 2, 3, 4]},
    2: {"id": "vol2", "number": 2, "title": "Volume II · Energy and Human Systems", "chapters": [5, 6, 7, 8, 9]},
    3: {"id": "vol3", "number": 3, "title": "Volume III · Reproduction, Health and Microbes", "chapters": [10, 11, 12]},
    4: {"id": "vol4", "number": 4, "title": "Volume IV · Heredity, Evolution and the Living Planet", "chapters": [13, 14, 15]},
}


def volume_for_chapter(ch_num: int) -> int:
    for vol_num, meta in VOLUME_META.items():
        if ch_num in meta["chapters"]:
            return vol_num
    return 1


def parse_chapters():
    chapters = []
    src_dir = SOURCE_DIR / "src"
    for ch_num in range(16):
        md_path = src_dir / f"ch{ch_num:02d}.md"
        if not md_path.exists():
            continue
        raw = md_path.read_text(encoding="utf-8")
        lines = raw.splitlines()
        title = f"Chapter {ch_num}"
        subtitle = ""
        for line in lines:
            if line.startswith("# "):
                raw_title = line[2:].strip()
                if " — " in raw_title:
                    parts = raw_title.split(" — ", 1)
                    title = parts[1].strip()
                elif ": " in raw_title:
                    parts = raw_title.split(": ", 1)
                    title = parts[1].strip()
                else:
                    title = raw_title
                break

        # Extract sections (## ...)
        sections = []
        current_sec = None
        for line in lines:
            if line.startswith("## "):
                if current_sec:
                    sections.append(current_sec)
                sec_heading = line[3:].strip()
                sec_id = f"ch{ch_num:02d}-s{len(sections)+1:02d}"
                current_sec = {
                    "id": sec_id,
                    "heading": sec_heading,
                    "markdown": "",
                }
            elif current_sec is not None:
                current_sec["markdown"] += line + "\n"
        if current_sec:
            sections.append(current_sec)

        # Extract :::callouts (predict, check, recall, careful, school, home, case)
        callouts = []
        callout_pattern = re.compile(
            r":::(predict|check|recall|careful|school|home|case)\s*([^\n]*)\n(.*?)\n:::",
            re.DOTALL,
        )
        for idx, match in enumerate(callout_pattern.finditer(raw)):
            kind = match.group(1).strip()
            header = match.group(2).strip()
            body = match.group(3).strip()
            callouts.append({
                "id": f"ch{ch_num:02d}-{kind}-{idx+1:02d}",
                "kind": kind,
                "title": header or kind.capitalize(),
                "body": body,
            })

        # Extract highlighted terms ==term==
        terms = []
        seen_terms = set()
        for m in re.finditer(r"==([^=\n]+)==", raw):
            t = m.group(1).strip()
            if t.lower() not in seen_terms and len(t) <= 48:
                seen_terms.add(t.lower())
                terms.append(t)

        # Extract widget references
        widgets = []
        for m in re.finditer(r"\{\{widget:([a-zA-Z0-9_]+)\}\}|data-widget=[\"']([a-zA-Z0-9_]+)[\"']|:::widget\s+([a-zA-Z0-9_]+)", raw):
            w_id = m.group(1) or m.group(2) or m.group(3)
            if w_id and w_id not in widgets:
                widgets.append(w_id)

        vol_num = volume_for_chapter(ch_num)
        hook_summary = sections[0]["markdown"].strip().split("\n\n")[0][:360] if sections else ""
        chapters.append({
            "id": f"ch{ch_num:02d}",
            "number": ch_num,
            "volumeNumber": vol_num,
            "volumeTitle": VOLUME_META[vol_num]["title"],
            "title": title,
            "subtitle": subtitle or f"Chapter {ch_num} of The Living World",
            "hookSummary": hook_summary,
            "sections": [
                {
                    "id": s["id"],
                    "heading": s["heading"],
                    "excerpt": s["markdown"].strip()[:1200],
                }
                for s in sections
            ],
            "callouts": callouts,
            "keyTerms": terms[:24],
            "widgets": widgets,
        })
    return chapters


def parse_atlas_lessons():
    lessons = []
    lessons_dir = SOURCE_DIR / "lessons"
    for json_file in sorted(lessons_dir.glob("*.json")):
        data = json.loads(json_file.read_text(encoding="utf-8"))
        for item in data:
            lessons.append({
                "id": item["id"],
                "widget": item.get("widget", ""),
                "title": item["title"],
                "chapter": item.get("chapter", 0),
                "figure": item.get("figure", ""),
                "question": item.get("question", ""),
                "explanation": item.get("explanation", ""),
                "limits": item.get("limits", ""),
                "sources": item.get("sources", []),
                "stories": item.get("stories", []),
            })
    return lessons


def parse_widgets():
    enh_path = SOURCE_DIR / "live" / "enhancements.js"
    raw = enh_path.read_text(encoding="utf-8") if enh_path.exists() else ""

    # Map widget IDs to chapters by scanning w_chXX.js
    widget_to_chapter = {}
    live_dir = SOURCE_DIR / "live"
    for w_file in sorted(live_dir.glob("w_ch*.js")):
        m_ch = re.search(r"w_ch(\d+)", w_file.name)
        ch_num = int(m_ch.group(1)) if m_ch else 0
        w_text = w_file.read_text(encoding="utf-8")
        for m_exp in re.finditer(r"export\s+function\s+([a-zA-Z0-9_]+)", w_text):
            widget_to_chapter[m_exp.group(1)] = ch_num

    # Extract widget blocks from enhancements.js
    widgets = []
    block_starts = list(re.finditer(r"\n  ([a-zA-Z0-9_]+):\s*\{\s*\n\s*challenge:", raw))
    for i, match in enumerate(block_starts):
        w_id = match.group(1)
        start_pos = match.start()
        end_pos = block_starts[i + 1].start() if i + 1 < len(block_starts) else len(raw)
        chunk = raw[start_pos:end_pos]

        prompt_m = re.search(r"prompt:\s*'((?:\\'|[^'])*)'", chunk)
        cutaway_m = re.search(r"cutaway:\s*'((?:\\'|[^'])*)'", chunk)
        ideal_m = re.search(r"idealised:\s*'((?:\\'|[^'])*)'", chunk)
        watch_steps = []
        for wm in re.finditer(r"\{\s*title:\s*'((?:\\'|[^'])*)',\s*caption:\s*'((?:\\'|[^'])*)'", chunk):
            watch_steps.append({
                "title": wm.group(1).replace("\\'", "'"),
                "caption": wm.group(2).replace("\\'", "'"),
            })

        ch_num = widget_to_chapter.get(w_id, 0)
        pretty_title = w_id.replace("_", " ").title().replace("3D", "3D").replace("Atp", "ATP").replace("Dna", "DNA").replace("Ph", "pH")
        widgets.append({
            "id": w_id,
            "title": pretty_title,
            "chapter": ch_num,
            "is3D": "3d" in w_id.lower(),
            "challengePrompt": prompt_m.group(1).replace("\\'", "'") if prompt_m else "",
            "cutaway": cutaway_m.group(1).replace("\\'", "'") if cutaway_m else "",
            "idealised": ideal_m.group(1).replace("\\'", "'") if ideal_m else "",
            "watchSteps": watch_steps,
        })
    return widgets


def build_explorers():
    return [
        {
            "id": "x_scale",
            "title": "The Scale of Life",
            "subtitle": "Logarithmic dial from 0.1 nm water molecules to the 10,000 km biosphere",
            "symbol": "ruler",
            "linkedChapters": [0, 2, 15],
            "summary": "Sweep across eleven orders of magnitude to see why naked eyes, light microscopes, and electron microscopes each unlock a different layer of biology.",
        },
        {
            "id": "x_cell",
            "title": "The Living Cell",
            "subtitle": "Interactive Plant, Animal and Bacterial cell comparison",
            "symbol": "circle.hexagongrid.fill",
            "linkedChapters": [2, 3, 5, 6],
            "summary": "Toggle between plant, animal, and prokaryotic cells to inspect how cell walls, chloroplasts, vacuoles, and mitochondria divide up the work of staying alive.",
        },
        {
            "id": "x_code",
            "title": "The Code of Life",
            "subtitle": "Live DNA -> mRNA -> Ribosome -> Polypeptide folding bench",
            "symbol": "allergens",
            "linkedChapters": [4, 12, 13, 14],
            "summary": "Mutate a single DNA base and watch how transcription, codon translation, and amino-acid chemistry reshape a folded protein.",
        },
        {
            "id": "x_map",
            "title": "The Web of Chapters",
            "subtitle": "Interactive concept graph across all 16 chapters and 9 school units",
            "symbol": "point.3.connected.trianglepath.dotted",
            "linkedChapters": list(range(16)),
            "summary": "Trace how energy, membranes, enzymes, transport, nerves, genes, and ecosystems connect across the entire curriculum.",
        },
    ]


def build_cross_disciplinary_bridges():
    return [
        {
            "id": "bridge-chem-diffusion",
            "discipline": "chemistry",
            "sourceBook": "The Invisible World (KymChem)",
            "sourceRef": "Ch 1 · Kinetic Theory & Brownian Motion",
            "deepLink": "kymchem://chapter/ch01",
            "title": "Why diffusion needs no pump: thermal kinetic energy",
            "schoolTopics": ["1.2", "2.1", "2.2", "3.7"],
            "livingWorldChapters": [1, 3, 6],
            "summary": "Alveolar oxygen and dissolved glucose do not 'want' to enter blood; random thermal collisions at 37 °C drive net movement down a concentration gradient (Fick's First Law: J = -D dC/dx).",
            "keyEquation": "J = -D · (ΔC / Δx)",
            "microCheckQuestion": "Why does pulmonary oedema (fluid thickening the alveolar wall from 0.5 µm to 5 µm) starve the blood of oxygen even when the lungs are full of fresh air?",
            "microCheckAnswer": "By Fick's law, rate of diffusion is inversely proportional to barrier thickness Δx; increasing Δx tenfold cuts the oxygen diffusion rate tenfold.",
        },
        {
            "id": "bridge-phys-boyle-breathing",
            "discipline": "physics",
            "sourceBook": "The Moving World (KymPhysics)",
            "sourceRef": "Ch 4 · Fluid Pressure & Gas Laws",
            "deepLink": "kymphysics://chapter/ch04",
            "title": "Boyle's Law in the thorax: how volume change drives airflow",
            "schoolTopics": ["1.3", "3.6"],
            "livingWorldChapters": [6],
            "summary": "Lungs have no skeletal muscle of their own. Contracting the diaphragm and external intercostals increases thoracic volume V, dropping alveolar pressure P below atmospheric pressure (P₁V₁ = P₂V₂) so air rushes in.",
            "keyEquation": "P₁V₁ = P₂V₂  (at constant T)",
            "microCheckQuestion": "During inhalation, thoracic volume increases by 12% while temperature stays constant at 310 K. Does intra-alveolar pressure rise or fall relative to atmospheric pressure?",
            "microCheckAnswer": "It falls below atmospheric pressure (by ~1–2 mmHg), creating a pressure gradient that pushes outside air into the alveoli.",
        },
        {
            "id": "bridge-chem-redox-atp",
            "discipline": "chemistry",
            "sourceBook": "The Invisible World (KymChem)",
            "sourceRef": "Ch 6 · Exothermic & Endothermic Energetics",
            "deepLink": "kymchem://chapter/ch06",
            "title": "Why cellular respiration doesn't set the cell on fire",
            "schoolTopics": ["1.4", "8.1", "8.2"],
            "livingWorldChapters": [1, 4, 5, 6],
            "summary": "Combusting 1 mole of glucose releases ΔG°' = -2,870 kJ all at once as heat and light. Mitochondria harvest the exact same reaction across enzyme-catalysed steps, capturing ~30–32 ATP molecules (~30.5 kJ/mol each).",
            "keyEquation": "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O  (ΔH = -2,805 kJ/mol)",
            "microCheckQuestion": "Both a burning marshmallow and a respiring muscle cell react glucose with oxygen to form CO₂ and H₂O. Why is respiration classified as exothermic in Unit 8.1, and how does the cell survive it?",
            "microCheckAnswer": "It is exothermic because the products (CO₂ + H₂O) have stronger bonds and lower chemical potential energy than glucose + O₂; enzymes lower activation energy at 37 °C and couple the released energy into ATP rather than pure heat.",
        },
        {
            "id": "bridge-chem-chromatography",
            "discipline": "chemistry",
            "sourceBook": "The Invisible World (KymChem)",
            "sourceRef": "Ch 2 · Separation, Polarity & Rf",
            "deepLink": "kymchem://chapter/ch02",
            "title": "Leaf pigment chromatography: chlorophyll a, chlorophyll b, carotene & xanthophyll",
            "schoolTopics": ["2.4", "6.4"],
            "livingWorldChapters": [5],
            "summary": "Spinach leaves look uniformly green, but paper chromatography separates four distinct photosynthetic pigments by their relative solubility in the mobile solvent vs hydrogen-bonding to cellulose paper.",
            "keyEquation": "Rf = distance travelled by pigment spot ÷ distance travelled by solvent front",
            "microCheckQuestion": "On a chromatogram of spinach extract, carotene travels 7.2 cm while the solvent front travels 8.0 cm. Calculate Rf and explain why carotene travels higher than chlorophyll b (Rf = 0.42).",
            "microCheckAnswer": "Rf = 7.2 ÷ 8.0 = 0.90. Carotene is non-polar and much more soluble in the non-polar mobile solvent (and less strongly adsorbed to polar cellulose paper) than chlorophyll b.",
        },
        {
            "id": "bridge-phys-biomechanics-levers",
            "discipline": "physics",
            "sourceBook": "The Moving World (KymPhysics)",
            "sourceRef": "Ch 3 · Moments, Levers & Mechanical Equilibrium",
            "deepLink": "kymphysics://chapter/ch03",
            "title": "Skeletal joints as third-class levers: trading force for speed",
            "schoolTopics": ["3.4", "7.4"],
            "livingWorldChapters": [8],
            "summary": "The biceps inserts just ~4 cm from the elbow pivot (fulcrum), while a ball in the hand sits ~32 cm away. By the principle of moments (F_biceps × d_in = F_load × d_out), the biceps must pull with 8× the load's weight — trading force advantage for rapid, wide-arc hand motion.",
            "keyEquation": "M = F × d⊥   (Clockwise moment = Anticlockwise moment)",
            "microCheckQuestion": "You hold a 15 N textbook in your hand 30 cm from your elbow pivot. Your biceps tendon attaches 3.0 cm from the elbow pivot. What upward force must your biceps muscle exert to keep your forearm horizontal?",
            "microCheckAnswer": "F_biceps × 3.0 cm = 15 N × 30 cm ⇒ F_biceps = 450 ÷ 3.0 = 150 N.",
        },
        {
            "id": "bridge-phys-optics-eye",
            "discipline": "physics",
            "sourceBook": "The Moving World (KymPhysics)",
            "sourceRef": "Ch 6 · Refraction, Lenses & Spectral Absorption",
            "deepLink": "kymphysics://chapter/ch06",
            "title": "Refraction in the microscope & eye lens, and why leaves reflect green light",
            "schoolTopics": ["6.2", "6.4"],
            "livingWorldChapters": [0, 5, 9],
            "summary": "Convex lenses in microscopes and the human eye bend rays toward a focal point on the retina (1/f = 1/u + 1/v). Meanwhile, chlorophyll absorbs red (~660 nm) and blue (~450 nm) wavelengths to drive photosynthesis, reflecting green (~530 nm) into our cone cells.",
            "keyEquation": "n₁ sin θ₁ = n₂ sin θ₂   and   M = I ÷ A",
            "microCheckQuestion": "What happens to the rate of oxygen bubble production in pondweed (Elodea) when illuminated with pure green light (530 nm) compared with red (660 nm) or blue (450 nm) light of the same intensity?",
            "microCheckAnswer": "Oxygen bubble production drops sharply under green light because chlorophyll a and b reflect/transmit green wavelengths rather than absorbing them to excite electrons.",
        },
        {
            "id": "bridge-chem-carbon-climate",
            "discipline": "chemistry",
            "sourceBook": "The Invisible World (KymChem)",
            "sourceRef": "Ch 8 · Earth's Carbon Reservoirs & Greenhouse IR Absorption",
            "deepLink": "kymchem://chapter/ch08",
            "title": "How photosynthesis, cellular respiration & combustion govern Earth's carbon cycle",
            "schoolTopics": ["4.4", "5.3", "5.4", "5.5"],
            "livingWorldChapters": [5, 15],
            "summary": "Every year, terrestrial and marine photosynthesis fixes ~120 Gt of carbon from atmospheric CO₂ into organic biomass, while respiration and decomposition return ~120 Gt. Burning fossilised Carboniferous biomass adds an uncompensated ~10 Gt C/yr.",
            "keyEquation": "6CO₂ + 6H₂O ⇌ C₆H₁₂O₆ + 6O₂",
            "microCheckQuestion": "Why does atmospheric CO₂ concentration at Mauna Loa dip every northern-hemisphere summer and peak every winter?",
            "microCheckAnswer": "In northern summer, vastboreal and temperate forests photosynthesise faster than ecosystems respire, drawing down atmospheric CO₂; in winter, photosynthesis slows while respiration and decomposition continue releasing CO₂.",
        },
    ]


def build_school_science_textbook():
    """
    Complete Cambridge Lower Secondary Science 8 (Second Edition)
    Learner's Book 8 & Workbook 8 — Mary Jones, Diane Fellowes-Freeman & Michael Smyth.
    Exact unit titles, sub-topic numbers, LB pages, WB pages, strands, and ticked state
    transcribed from Kym's physical textbook photos.
    """
    units = [
        {
            "id": "sci8-u1",
            "unitNumber": 1,
            "title": "Respiration",
            "discipline": "core_biology",
            "scienceStrands": ["Biology: Structure and function", "Biology: Life processes"],
            "twsStrands": [
                "Models and representations",
                "Carrying out scientific enquiry",
                "Scientific enquiry: purpose and planning",
                "Scientific enquiry: analysis, evaluation and conclusions",
            ],
            "scienceInContext": "Discuss how scientific knowledge develops over time by shared understanding and investigation. Describe how science is used in different societies and industries, and how it is used in research. Evaluate topics using scientific understanding.",
            "learnersBookStartPage": 8,
            "learnersBookEndPage": 39,
            "workbookStartPage": 2,
            "workbookEndPage": 20,
            "isCompletedInSchool": True,
            "livingWorldChapters": [1, 3, 6, 7],
            "bridgeIds": ["bridge-chem-diffusion", "bridge-phys-boyle-breathing", "bridge-chem-redox-atp"],
            "topics": [
                {
                    "id": "sci8-1.1",
                    "code": "1.1",
                    "title": "The human respiratory system",
                    "learnersBookPage": 8,
                    "workbookPage": 2,
                    "discipline": "core_biology",
                    "livingWorldChapters": [6],
                    "linkedWidgets": ["alveolus_gas_exchange", "bell_jar_lungs"],
                    "bridgeIds": [],
                    "summary": "Trace the pathway of air from nose and mouth through larynx (voicebox), trachea (supported by C-shaped cartilage rings), bronchi, bronchioles, and alveoli, plus ciliated epithelial and goblet cells that sweep mucus upward.",
                    "cambridgeWatchouts": [
                        "Always write 'trachea' (not just windpipe) and distinguish 'bronchus' (singular) from 'bronchi' (plural).",
                        "Do not confuse the trachea (airway with cartilage rings) with the oesophagus (food tube behind it).",
                    ],
                },
                {
                    "id": "sci8-1.2",
                    "code": "1.2",
                    "title": "Gas exchange",
                    "learnersBookPage": 12,
                    "workbookPage": 5,
                    "discipline": "core_biology",
                    "livingWorldChapters": [3, 6],
                    "linkedWidgets": ["alveolus_gas_exchange", "fick_diffusion_bench"],
                    "bridgeIds": ["bridge-chem-diffusion"],
                    "summary": "How oxygen diffuses from alveolar air spaces across the one-cell-thick alveolar and capillary walls into red blood cells, while carbon dioxide diffuses in the opposite direction down its concentration gradient.",
                    "cambridgeWatchouts": [
                        "State that alveolar and capillary walls are 'one cell thick' — never write 'cell walls are thin' (animal cells have no cell wall!).",
                        "Always name 'diffusion down a concentration gradient' and mention the rich blood capillary network that maintains a steep gradient.",
                    ],
                },
                {
                    "id": "sci8-1.3",
                    "code": "1.3",
                    "title": "Breathing",
                    "learnersBookPage": 18,
                    "workbookPage": 6,
                    "discipline": "core_biology",
                    "livingWorldChapters": [6],
                    "linkedWidgets": ["bell_jar_lungs"],
                    "bridgeIds": ["bridge-phys-boyle-breathing"],
                    "summary": "Mechanical ventilation of the lungs: how contraction and relaxation of the external intercostal muscles and diaphragm change thoracic volume and pressure to cause inspiration (breathing in) and expiration (breathing out).",
                    "cambridgeWatchouts": [
                        "Never write 'breathing is respiration'. Breathing is mechanical ventilation of the lungs; respiration is a chemical reaction in all living cells.",
                        "In the bell-jar model, note its limitations: the glass jar cannot move like the ribcage, and the rubber sheet pulls down from a point rather than flattening from a dome.",
                    ],
                },
                {
                    "id": "sci8-1.4",
                    "code": "1.4",
                    "title": "Respiration",
                    "learnersBookPage": 25,
                    "workbookPage": 14,
                    "discipline": "core_biology",
                    "livingWorldChapters": [1, 6],
                    "linkedWidgets": ["seed_flame3d", "monsoon_imbibition", "respirometer_bench"],
                    "bridgeIds": ["bridge-chem-redox-atp"],
                    "summary": "Aerobic respiration inside mitochondria of living cells: glucose + oxygen → carbon dioxide + water, releasing useful energy for movement, active transport, growth, and keeping body temperature constant.",
                    "cambridgeWatchouts": [
                        "Cambridge mark schemes strictly forbid 'energy is produced/made/created'. Always write 'energy is released from glucose'.",
                        "Know the word equation by heart: glucose + oxygen → carbon dioxide + water.",
                    ],
                },
                {
                    "id": "sci8-1.5",
                    "code": "1.5",
                    "title": "Blood",
                    "learnersBookPage": 31,
                    "workbookPage": 16,
                    "discipline": "core_biology",
                    "livingWorldChapters": [7],
                    "linkedWidgets": ["blood_smear_microscope", "double_circulation"],
                    "bridgeIds": [],
                    "summary": "Structure and function of the four components of blood: plasma (transports dissolved glucose, amino acids, CO₂, urea, hormones, and heat), red blood cells (biconcave discs packed with haemoglobin, no nucleus, carry O₂ as oxyhaemoglobin), white blood cells (have a nucleus, phagocytes and lymphocytes that defend against pathogens by phagocytosis and producing antibodies), and platelets (clotting).",
                    "cambridgeWatchouts": [
                        "Explain HOW each adaptation helps: 'no nucleus leaves more space for haemoglobin so each red blood cell can carry more oxygen'; 'biconcave shape gives a large surface area to volume ratio for rapid diffusion of oxygen in and out'.",
                    ],
                },
            ],
        },
        {
            "id": "sci8-u2",
            "unitNumber": 2,
            "title": "Properties of materials",
            "discipline": "biology_bridge",
            "scienceStrands": ["Chemistry: Materials and their structure", "Chemistry: Properties of materials"],
            "twsStrands": [
                "Scientific enquiry: purpose and planning",
                "Carrying out scientific enquiry",
                "Scientific enquiry: analysis, evaluation and conclusions",
            ],
            "scienceInContext": "Describe how science is used in different societies and industries, and how it is used in research.",
            "learnersBookStartPage": 40,
            "learnersBookEndPage": 67,
            "workbookStartPage": 21,
            "workbookEndPage": 37,
            "isCompletedInSchool": True,
            "livingWorldChapters": [3, 5, 7],
            "bridgeIds": ["bridge-chem-diffusion", "bridge-chem-chromatography"],
            "topics": [
                {
                    "id": "sci8-2.1",
                    "code": "2.1",
                    "title": "Dissolving",
                    "learnersBookPage": 40,
                    "workbookPage": 21,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [3, 7],
                    "linkedWidgets": ["osmosis_u_tube"],
                    "bridgeIds": ["bridge-chem-diffusion"],
                    "summary": "Solutes, solvents, and conservation of mass when substances dissolve — the chemical basis of blood plasma and cytoplasm as aqueous solutions.",
                    "cambridgeWatchouts": [
                        "Mass of solution = mass of solute + mass of solvent (particles are conserved when glucose or salt dissolves in water or plasma).",
                    ],
                },
                {
                    "id": "sci8-2.2",
                    "code": "2.2",
                    "title": "Solutions and solubility",
                    "learnersBookPage": 45,
                    "workbookPage": 23,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [3, 7],
                    "linkedWidgets": ["osmosis_u_tube"],
                    "bridgeIds": ["bridge-chem-diffusion"],
                    "summary": "Concentrated, dilute, and saturated solutions, and how temperature affects the solubility of solids vs gases (such as dissolved oxygen in warm vs cold river water).",
                    "cambridgeWatchouts": [
                        "While most solid solutes become MORE soluble as temperature rises, gases like oxygen become LESS soluble in warmer water — crucial for fish respiration in heated rivers.",
                    ],
                },
                {
                    "id": "sci8-2.3",
                    "code": "2.3",
                    "title": "Planning a solubility investigation",
                    "learnersBookPage": 53,
                    "workbookPage": 28,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [0],
                    "linkedWidgets": ["redi_jars"],
                    "bridgeIds": [],
                    "summary": "Identifying independent, dependent, and control variables, choosing intervals, and recording repeatable results.",
                    "cambridgeWatchouts": [
                        "Always state the exact volume of water (e.g., 100 cm³) as a control variable when comparing solubility.",
                    ],
                },
                {
                    "id": "sci8-2.4",
                    "code": "2.4",
                    "title": "Paper chromatography",
                    "learnersBookPage": 57,
                    "workbookPage": 33,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [5],
                    "linkedWidgets": ["leaf_chromatography"],
                    "bridgeIds": ["bridge-chem-chromatography"],
                    "summary": "Separating mixtures of dissolved pigments (such as chlorophyll a, chlorophyll b, xanthophyll, and carotene in plant leaves) using a pencil baseline and solvent front.",
                    "cambridgeWatchouts": [
                        "Draw the baseline in pencil, never ink, because ink dyes dissolve in the solvent and contaminate the chromatogram.",
                        "Keep the solvent level BELOW the sample spots so the spots do not wash directly into the solvent reservoir.",
                    ],
                },
            ],
        },
        {
            "id": "sci8-u3",
            "unitNumber": 3,
            "title": "Forces and energy",
            "discipline": "biology_bridge",
            "scienceStrands": ["Physics: Forces and energy"],
            "twsStrands": [
                "Models and representations",
                "Carrying out scientific enquiry",
                "Scientific enquiry: analysis, evaluation and conclusions",
                "Scientific enquiry: purpose and planning",
            ],
            "scienceInContext": "Evaluate topics using scientific understanding.",
            "learnersBookStartPage": 68,
            "learnersBookEndPage": 125,
            "workbookStartPage": 38,
            "workbookEndPage": 68,
            "isCompletedInSchool": True,
            "livingWorldChapters": [3, 6, 8],
            "bridgeIds": ["bridge-phys-biomechanics-levers", "bridge-phys-boyle-breathing", "bridge-chem-diffusion"],
            "topics": [
                {
                    "id": "sci8-3.1",
                    "code": "3.1",
                    "title": "Forces and motion",
                    "learnersBookPage": 68,
                    "workbookPage": 38,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [8],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Balanced and unbalanced forces and resultant force on moving organisms and objects.",
                    "cambridgeWatchouts": ["Balanced forces mean constant velocity (including stationary), not necessarily at rest."],
                },
                {
                    "id": "sci8-3.2",
                    "code": "3.2",
                    "title": "Speed",
                    "learnersBookPage": 77,
                    "workbookPage": 42,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [8, 9],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Calculating speed = distance ÷ time, nerve impulse conduction speeds (~100 m/s), and cheetah vs human locomotion.",
                    "cambridgeWatchouts": ["Always check units (m/s vs km/h) before substituting into speed = distance ÷ time."],
                },
                {
                    "id": "sci8-3.3",
                    "code": "3.3",
                    "title": "Describing movement",
                    "learnersBookPage": 84,
                    "workbookPage": 47,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [8],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Interpreting distance–time graphs: gradient equals speed, horizontal flat line means stationary.",
                    "cambridgeWatchouts": ["A steeper slope on a distance–time graph means higher speed, not climbing a hill."],
                },
                {
                    "id": "sci8-3.4",
                    "code": "3.4",
                    "title": "Turning forces",
                    "learnersBookPage": 91,
                    "workbookPage": 51,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [8],
                    "linkedWidgets": ["antagonistic_arm_lever"],
                    "bridgeIds": ["bridge-phys-biomechanics-levers"],
                    "summary": "Moments of a force (moment = force × perpendicular distance from pivot) and the principle of moments — the physical foundation for Unit 7.4 Moving the body (bones, joints as pivots, and antagonistic biceps/triceps muscles).",
                    "cambridgeWatchouts": [
                        "Always measure distance perpendicular to the line of action of the force from the pivot (joint).",
                        "State the unit of moment as N m or N cm (never J).",
                    ],
                },
                {
                    "id": "sci8-3.5",
                    "code": "3.5",
                    "title": "Pressure between solids",
                    "learnersBookPage": 99,
                    "workbookPage": 55,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [8, 14],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Pressure = force ÷ area (N/m² or N/cm²), comparing camel footpads (large area, low pressure on desert sand in Unit 4.1) vs sharp predator claws and teeth.",
                    "cambridgeWatchouts": ["When explaining camel feet or snowshoes, always follow the 3-step chain: larger area → force spread out → smaller pressure → does not sink."],
                },
                {
                    "id": "sci8-3.6",
                    "code": "3.6",
                    "title": "Pressure in liquids and gases",
                    "learnersBookPage": 106,
                    "workbookPage": 60,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [6, 7],
                    "linkedWidgets": ["bell_jar_lungs"],
                    "bridgeIds": ["bridge-phys-boyle-breathing"],
                    "summary": "How particle collisions with container walls create gas pressure, how volume changes affect pressure, and why blood pressure and thoracic pressure drive circulation and breathing (Unit 1.3).",
                    "cambridgeWatchouts": ["Gas pressure is caused by particles colliding with the walls of the container, not particles colliding with each other."],
                },
                {
                    "id": "sci8-3.7",
                    "code": "3.7",
                    "title": "Particles on the move",
                    "learnersBookPage": 114,
                    "workbookPage": 64,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [3, 6],
                    "linkedWidgets": ["fick_diffusion_bench", "alveolus_gas_exchange"],
                    "bridgeIds": ["bridge-chem-diffusion"],
                    "summary": "Diffusion in liquids and gases driven by random kinetic motion of particles from higher concentration to lower concentration, and how temperature and concentration gradient control the rate of diffusion across cell membranes and alveoli.",
                    "cambridgeWatchouts": ["Individual particles move randomly in all directions; only the NET (overall) movement is from higher concentration to lower concentration."],
                },
            ],
        },
        {
            "id": "sci8-u4",
            "unitNumber": 4,
            "title": "Ecosystems",
            "discipline": "core_biology",
            "scienceStrands": ["Biology: Ecosystems"],
            "twsStrands": ["Carrying out scientific enquiry"],
            "scienceInContext": "Discuss how scientific knowledge develops over time by shared understanding and investigation. Evaluate topics using scientific understanding. Discuss the impact science can have on the environment world-wide.",
            "learnersBookStartPage": 126,
            "learnersBookEndPage": 151,
            "workbookStartPage": 69,
            "workbookEndPage": 87,
            "isCompletedInSchool": True,
            "livingWorldChapters": [14, 15],
            "bridgeIds": ["bridge-chem-carbon-climate"],
            "topics": [
                {
                    "id": "sci8-4.1",
                    "code": "4.1",
                    "title": "The Sonoran Desert",
                    "learnersBookPage": 126,
                    "workbookPage": 69,
                    "discipline": "core_biology",
                    "livingWorldChapters": [14, 15],
                    "linkedWidgets": ["food_web_trophic", "desert_adaptations"],
                    "bridgeIds": [],
                    "summary": "Interactions between organisms and abiotic factors in the Sonoran Desert: saguaro cacti (wide shallow roots, pleated water-storing stem, spines instead of leaves), Gila woodpeckers, bats as nocturnal pollinators, Kangaroo rats, and desert food webs/habitats.",
                    "cambridgeWatchouts": [
                        "Distinguish carefully between 'ecosystem' (all living organisms + non-living environment interacting in an area), 'habitat' (the place where an organism lives), and 'niche' (the role an organism plays in its ecosystem).",
                    ],
                },
                {
                    "id": "sci8-4.2",
                    "code": "4.2",
                    "title": "Different ecosystems",
                    "learnersBookPage": 133,
                    "workbookPage": 72,
                    "discipline": "core_biology",
                    "livingWorldChapters": [15],
                    "linkedWidgets": ["food_web_trophic", "mangrove_ecosystem"],
                    "bridgeIds": [],
                    "summary": "Comparing mangrove forests (aerial breathing roots/pneumatophores, salt excretion, nursery habitat for young fish), sea ice in the Arctic Ocean (algae growing on the underside of sea ice feeding krill → arctic cod → seals → polar bears), and tropical rice paddies.",
                    "cambridgeWatchouts": [
                        "Arrows in a food chain or food web ALWAYS point in the direction of energy transfer (from eaten to eater), never 'who eats whom'.",
                    ],
                },
                {
                    "id": "sci8-4.3",
                    "code": "4.3",
                    "title": "Intruders in an ecosystem",
                    "learnersBookPage": 139,
                    "workbookPage": 76,
                    "discipline": "core_biology",
                    "livingWorldChapters": [15],
                    "linkedWidgets": ["invasive_species_sim"],
                    "bridgeIds": [],
                    "summary": "How introduced/invasive species (such as buffelgrass in the Sonoran Desert, prickly pear, cane toads, or stoats in New Zealand) outcompete native species for light, water, minerals, and nesting sites because they lack natural predators or pathogens in the new habitat.",
                    "cambridgeWatchouts": [
                        "When asked why an invasive species spreads rapidly, give TWO linked reasons: (1) no natural predators/herbivores/diseases in the new ecosystem, and (2) outcompetes native species for named resources (water, light, space, food).",
                    ],
                },
                {
                    "id": "sci8-4.4",
                    "code": "4.4",
                    "title": "Bioaccumulation",
                    "learnersBookPage": 142,
                    "workbookPage": 82,
                    "discipline": "core_biology",
                    "livingWorldChapters": [15],
                    "linkedWidgets": ["bioaccumulation_pyramid"],
                    "bridgeIds": ["bridge-chem-carbon-climate"],
                    "summary": "How persistent, non-biodegradable toxins (DDT, mercury, PCBs, microplastics) accumulate inside an organism over time (bioaccumulation) and increase in concentration at each higher trophic level along a food chain (biomagnification), causing thin eggshells in ospreys and eagles.",
                    "cambridgeWatchouts": [
                        "Always state that the toxin is 'persistent / does not break down (non-biodegradable) and is not excreted'.",
                        "Explain biomagnification quantitatively: one primary consumer eats many contaminated producers, one secondary consumer eats many primary consumers, so the top predator ingests the combined toxin dose of thousands of organisms below it.",
                    ],
                },
            ],
        },
        {
            "id": "sci8-u5",
            "unitNumber": 5,
            "title": "Materials and cycles on Earth",
            "discipline": "biology_bridge",
            "scienceStrands": [
                "Chemistry: Materials and their structure",
                "Chemistry: Changes to materials",
                "Earth and Space: Planet Earth",
                "Earth and Space: Cycles on Earth",
            ],
            "twsStrands": [
                "Carrying out scientific enquiry",
                "Scientific enquiry: purpose and planning",
                "Models and representations",
                "Scientific enquiry: analysis, evaluation and conclusions",
            ],
            "scienceInContext": "Discuss how scientific understanding is used and developed by people working on their own and working together, such as the peer-review process. Discuss the impact science can have on the environment world-wide.",
            "learnersBookStartPage": 152,
            "learnersBookEndPage": 189,
            "workbookStartPage": 88,
            "workbookEndPage": 110,
            "isCompletedInSchool": False,
            "livingWorldChapters": [5, 15],
            "bridgeIds": ["bridge-chem-carbon-climate"],
            "topics": [
                {
                    "id": "sci8-5.1",
                    "code": "5.1",
                    "title": "The structure of the atom",
                    "learnersBookPage": 152,
                    "workbookPage": 88,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [1],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Protons (+1), neutrons (0), and electrons (-1), electrostatic attraction, and Rutherford's gold-foil model.",
                    "cambridgeWatchouts": ["An atom has no overall charge because number of protons (+1) equals number of electrons (-1)."],
                },
                {
                    "id": "sci8-5.2",
                    "code": "5.2",
                    "title": "Purity",
                    "learnersBookPage": 157,
                    "workbookPage": 91,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [1],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Calculating percentage purity of salts, diamonds, gold alloys, and seawater components.",
                    "cambridgeWatchouts": ["Percentage purity = (mass of pure substance ÷ total mass of sample) × 100%."],
                },
                {
                    "id": "sci8-5.3",
                    "code": "5.3",
                    "title": "Weather and climate",
                    "learnersBookPage": 165,
                    "workbookPage": 97,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [15],
                    "linkedWidgets": [],
                    "bridgeIds": ["bridge-chem-carbon-climate"],
                    "summary": "Distinguishing short-term atmospheric weather from long-term climate averages and global climate zones that determine terrestrial biomes.",
                    "cambridgeWatchouts": ["Weather is day-to-day atmospheric conditions; climate is the average weather pattern over 30+ years."],
                },
                {
                    "id": "sci8-5.4",
                    "code": "5.4",
                    "title": "Climate and ice ages",
                    "learnersBookPage": 171,
                    "workbookPage": 103,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [14, 15],
                    "linkedWidgets": [],
                    "bridgeIds": ["bridge-chem-carbon-climate"],
                    "summary": "Glacial and interglacial periods, ice-core trapped air bubbles, peat bog pollen records, and glacial boulders as evidence of past climate and plant evolution.",
                    "cambridgeWatchouts": ["Pollen grains have tough outer coats that resist decay in anaerobic acidic peat bogs, showing which plant species lived at each depth/age."],
                },
                {
                    "id": "sci8-5.5",
                    "code": "5.5",
                    "title": "Atmosphere and climate",
                    "learnersBookPage": 177,
                    "workbookPage": 106,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [5, 15],
                    "linkedWidgets": ["carbon_cycle_flux"],
                    "bridgeIds": ["bridge-chem-carbon-climate"],
                    "summary": "How early photosynthetic cyanobacteria oxygenated Earth's atmosphere, locked carbon into limestone and fossil fuels, and how modern combustion and deforestation perturb the greenhouse effect.",
                    "cambridgeWatchouts": ["Photosynthesis evolved ~2.4–3.5 billion years ago, removing CO₂ and releasing O₂ into the atmosphere."],
                },
            ],
        },
        {
            "id": "sci8-u6",
            "unitNumber": 6,
            "title": "Light",
            "discipline": "biology_bridge",
            "scienceStrands": ["Physics: Light and sound", "Earth and Space: Earth in space"],
            "twsStrands": [
                "Scientific enquiry: purpose and planning",
                "Carrying out scientific enquiry",
                "Scientific enquiry: analysis, evaluation and conclusions",
                "Models and representations",
            ],
            "scienceInContext": "Evaluate topics using scientific understanding.",
            "learnersBookStartPage": 190,
            "learnersBookEndPage": 232,
            "workbookStartPage": 111,
            "workbookEndPage": 133,
            "isCompletedInSchool": True,
            "livingWorldChapters": [0, 5, 9],
            "bridgeIds": ["bridge-phys-optics-eye", "bridge-chem-chromatography"],
            "topics": [
                {
                    "id": "sci8-6.1",
                    "code": "6.1",
                    "title": "Reflection",
                    "learnersBookPage": 190,
                    "workbookPage": 111,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [9],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Law of reflection (angle of incidence i = angle of reflection r, measured from the normal).",
                    "cambridgeWatchouts": ["Always measure angles of incidence and reflection from the NORMAL (90° dashed line), never from the mirror surface."],
                },
                {
                    "id": "sci8-6.2",
                    "code": "6.2",
                    "title": "Refraction",
                    "learnersBookPage": 197,
                    "workbookPage": 115,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [0, 9],
                    "linkedWidgets": ["leeuwenhoek_scope", "eye_accommodation"],
                    "bridgeIds": ["bridge-phys-optics-eye"],
                    "summary": "Bending of light as it changes speed across air/water/glass/cornea boundaries — the optical principle behind microscope objective lenses (Ch 0) and eye cornea/lens focusing onto the retina (Ch 9).",
                    "cambridgeWatchouts": ["Light slowing down (air → glass/water) bends TOWARD the normal; light speeding up (glass/water → air) bends AWAY from the normal."],
                },
                {
                    "id": "sci8-6.3",
                    "code": "6.3",
                    "title": "Making rainbows",
                    "learnersBookPage": 204,
                    "workbookPage": 118,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [5, 9],
                    "linkedWidgets": [],
                    "bridgeIds": ["bridge-phys-optics-eye"],
                    "summary": "Dispersion of white light through a prism into the continuous spectrum (red, orange, yellow, green, blue, indigo, violet) because violet refracts more than red.",
                    "cambridgeWatchouts": ["Violet light slows down the most in glass and refracts through the largest angle; red light refracts the least."],
                },
                {
                    "id": "sci8-6.4",
                    "code": "6.4",
                    "title": "Colours of light",
                    "learnersBookPage": 209,
                    "workbookPage": 122,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [5, 9],
                    "linkedWidgets": ["photosynthesis_spectrum", "eye_accommodation"],
                    "bridgeIds": ["bridge-phys-optics-eye"],
                    "summary": "Primary colours of light (red, green, blue — matching the 3 cone photoreceptors in the human retina!), colour filters, and why plant leaves look green (chlorophyll absorbs red and blue light and reflects green light).",
                    "cambridgeWatchouts": ["Primary colours of LIGHT are Red, Green, and Blue (RGB), which add to make white light — corresponding directly to human S, M, and L retinal cone cells."],
                },
                {
                    "id": "sci8-6.5",
                    "code": "6.5",
                    "title": "Galaxies",
                    "learnersBookPage": 217,
                    "workbookPage": 125,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [0],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Spiral, elliptical, and irregular galaxies, the Milky Way, and stellar dust clouds.",
                    "cambridgeWatchouts": ["Galaxies are held together by gravity."],
                },
                {
                    "id": "sci8-6.6",
                    "code": "6.6",
                    "title": "Rocks in space",
                    "learnersBookPage": 222,
                    "workbookPage": 129,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [14],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Asteroids, the asteroid belt between Mars and Jupiter, and how the Chicxulub asteroid impact 66 million years ago triggered mass extinction and mammalian adaptive radiation.",
                    "cambridgeWatchouts": ["Most asteroids orbit the Sun in the asteroid belt between Mars and Jupiter."],
                },
            ],
        },
        {
            "id": "sci8-u7",
            "unitNumber": 7,
            "title": "Diet and growth",
            "discipline": "core_biology",
            "scienceStrands": ["Biology: Structure and function", "Biology: Life processes"],
            "twsStrands": [
                "Scientific enquiry: purpose and planning",
                "Carrying out scientific enquiry",
            ],
            "scienceInContext": "Evaluate topics using scientific understanding.",
            "learnersBookStartPage": 233,
            "learnersBookEndPage": 262,
            "workbookStartPage": 134,
            "workbookEndPage": 158,
            "isCompletedInSchool": False,
            "livingWorldChapters": [2, 4, 8, 10, 11],
            "bridgeIds": ["bridge-phys-biomechanics-levers", "bridge-chem-redox-atp"],
            "topics": [
                {
                    "id": "sci8-7.1",
                    "code": "7.1",
                    "title": "Nutrients",
                    "learnersBookPage": 233,
                    "workbookPage": 134,
                    "discipline": "core_biology",
                    "livingWorldChapters": [4, 7],
                    "linkedWidgets": ["food_tests_bench", "enzyme_lock_key"],
                    "bridgeIds": [],
                    "summary": "The six groups of nutrients and water: proteins (growth and repair of cells, antibodies, enzymes, haemoglobin), carbohydrates (starch and sugars for energy release in respiration), fats and oils (energy store, cell membranes, thermal insulation), vitamins (Vitamin A for night vision/rod cells, Vitamin C for healthy skin/gums and preventing scurvy, Vitamin D for calcium absorption and preventing rickets), minerals (calcium for strong bones/teeth, iron for making haemoglobin and preventing anaemia), fibre (cellulose to stimulate peristalsis and prevent constipation), plus iodine test for starch and Benedict's test for reducing sugars.",
                    "cambridgeWatchouts": [
                        "Fibre (roughage) is NOT digested or absorbed into the blood, so Cambridge treats it separately from nutrients that enter cells, though it is essential in a balanced diet to keep the alimentary canal moving.",
                        "Memorise each specific deficiency pairing: Vitamin D / Calcium → rickets; Vitamin C → scurvy; Vitamin A → night blindness; Iron → anaemia (fewer red blood cells / less haemoglobin → less oxygen transported → less aerobic respiration → tiredness).",
                    ],
                },
                {
                    "id": "sci8-7.2",
                    "code": "7.2",
                    "title": "A balanced diet",
                    "learnersBookPage": 241,
                    "workbookPage": 138,
                    "discipline": "core_biology",
                    "livingWorldChapters": [4, 6, 11],
                    "linkedWidgets": ["energy_balance_diet"],
                    "bridgeIds": ["bridge-chem-redox-atp"],
                    "summary": "How daily energy requirements (in MJ or kJ) depend on age, sex, activity level, and pregnancy/lactation; consequences of energy imbalance (malnutrition, starvation, obesity, type 2 diabetes, and coronary heart disease from excess saturated fat).",
                    "cambridgeWatchouts": [
                        "1 MJ = 1,000 kJ = 1,000,000 J. Always check whether a bar chart uses kJ or MJ!",
                        "When explaining why excess carbohydrate or fat intake causes mass gain, state: energy intake in food exceeds energy used in respiration/activity, so excess glucose is converted to fat and stored in adipose tissue.",
                    ],
                },
                {
                    "id": "sci8-7.3",
                    "code": "7.3",
                    "title": "Growth, development and health",
                    "learnersBookPage": 248,
                    "workbookPage": 144,
                    "discipline": "core_biology",
                    "livingWorldChapters": [2, 10, 11],
                    "linkedWidgets": ["cell_division_growth", "smoking_alveoli_sim"],
                    "bridgeIds": [],
                    "summary": "Growth by cell division (mitosis) and cell enlargement, adolescent growth spurts, and how lifestyle choices and drugs affect health — specifically how components of tobacco smoke damage gas exchange and circulation: nicotine (addictive, narrows blood vessels, raises blood pressure and heart rate), carbon monoxide (binds irreversibly to haemoglobin in red blood cells to form carboxyhaemoglobin so blood carries less oxygen, forcing the heart to work harder and starving a developing fetus of oxygen), tar (carcinogen that causes lung cancer, paralyses cilia in the trachea/bronchi so mucus accumulates, leading to chronic bronchitis and emphysema where alveolar walls break down), and particulates.",
                    "cambridgeWatchouts": [
                        "Never mix up the three components of cigarette smoke: NICOTINE = addictive + constricts blood vessels; CARBON MONOXIDE = replaces oxygen on haemoglobin; TAR = causes cancer + paralyses cilia + leads to bronchitis/emphysema.",
                    ],
                },
                {
                    "id": "sci8-7.4",
                    "code": "7.4",
                    "title": "Moving the body",
                    "learnersBookPage": 252,
                    "workbookPage": 153,
                    "discipline": "core_biology",
                    "livingWorldChapters": [8],
                    "linkedWidgets": ["antagonistic_arm_lever", "synovial_joint_3d"],
                    "bridgeIds": ["bridge-phys-biomechanics-levers"],
                    "summary": "The human skeleton, hinge joints (elbow, knee) vs ball-and-socket joints (shoulder, hip), cartilage, synovial fluid, ligaments vs tendons, and why skeletal muscles work in antagonistic pairs (biceps and triceps): muscles can only exert force by pulling when they contract, never by pushing.",
                    "cambridgeWatchouts": [
                        "Always state the fundamental rule: 'Muscles can only pull (when they contract); they cannot push. Therefore two muscles arranged as an antagonistic pair are needed to pull a bone in opposite directions across a joint.'",
                        "To bend (flex) the arm at the elbow: biceps contracts AND triceps relaxes. To straighten (extend) the arm: triceps contracts AND biceps relaxes.",
                    ],
                },
            ],
        },
        {
            "id": "sci8-u8",
            "unitNumber": 8,
            "title": "Chemical reactions",
            "discipline": "biology_bridge",
            "scienceStrands": ["Chemistry: Changes to materials"],
            "twsStrands": [
                "Scientific enquiry: purpose and planning",
                "Carrying out scientific enquiry",
                "Scientific enquiry: analysis, evaluation and conclusions",
            ],
            "scienceInContext": "Describe how science is used in different societies and industries, and how it is used in research. Evaluate topics using scientific understanding.",
            "learnersBookStartPage": 263,
            "learnersBookEndPage": 292,
            "workbookStartPage": 159,
            "workbookEndPage": 183,
            "isCompletedInSchool": False,
            "livingWorldChapters": [1, 4, 5, 6],
            "bridgeIds": ["bridge-chem-redox-atp"],
            "topics": [
                {
                    "id": "sci8-8.1",
                    "code": "8.1",
                    "title": "Exothermic reactions",
                    "learnersBookPage": 263,
                    "workbookPage": 159,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [1, 6],
                    "linkedWidgets": ["seed_flame3d"],
                    "bridgeIds": ["bridge-chem-redox-atp"],
                    "summary": "Chemical reactions that transfer thermal energy to the surroundings (temperature rises), including combustion, oxidation of glucose in cellular respiration (Unit 1.4), and self-heating cans.",
                    "cambridgeWatchouts": ["Respiration is an exothermic process that occurs continuously inside all living cells."],
                },
                {
                    "id": "sci8-8.2",
                    "code": "8.2",
                    "title": "Endothermic reactions",
                    "learnersBookPage": 269,
                    "workbookPage": 166,
                    "discipline": "biology_bridge",
                    "livingWorldChapters": [5],
                    "linkedWidgets": ["photosynthesis_spectrum"],
                    "bridgeIds": ["bridge-chem-redox-atp"],
                    "summary": "Chemical reactions and processes that absorb energy from the surroundings (such as citric acid + sodium hydrogencarbonate sherbet, instant cold packs, and photosynthesis absorbing light energy in chloroplasts).",
                    "cambridgeWatchouts": ["In an endothermic reaction in solution, energy is taken in from the solution, so the thermometer reading falls."],
                },
                {
                    "id": "sci8-8.3",
                    "code": "8.3",
                    "title": "Reactions of metals with oxygen",
                    "learnersBookPage": 276,
                    "workbookPage": 169,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [7],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Metal + oxygen → metal oxide, comparing reactivity of magnesium, iron (including reversible O₂ binding to iron(II) in haemoglobin!), copper, and gold.",
                    "cambridgeWatchouts": ["Haemoglobin uses an iron ion at the centre of each haem group to bind oxygen reversibly without permanently rusting."],
                },
                {
                    "id": "sci8-8.4",
                    "code": "8.4",
                    "title": "Reactions of metals with water",
                    "learnersBookPage": 282,
                    "workbookPage": 172,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [3, 9],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Metal + water → metal hydroxide + hydrogen (sodium, potassium, calcium) and why Na⁺ and K⁺ ions are the charge carriers of nerve impulses.",
                    "cambridgeWatchouts": ["Test for hydrogen gas: a lighted splint gives a squeaky pop."],
                },
                {
                    "id": "sci8-8.5",
                    "code": "8.5",
                    "title": "Reactions of metals with dilute acids",
                    "learnersBookPage": 286,
                    "workbookPage": 175,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [4],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Metal + dilute acid → salt + hydrogen (hydrochloric acid → chlorides, sulfuric acid → sulfates, nitric acid → nitrates) — linking to hydrochloric acid (pH ~1.5–2.0) in the human stomach.",
                    "cambridgeWatchouts": ["Hydrochloric acidalways forms a chloride salt; sulfuric acid forms a sulfate salt."],
                },
            ],
        },
        {
            "id": "sci8-u9",
            "unitNumber": 9,
            "title": "Magnetism",
            "discipline": "sibling_science",
            "scienceStrands": ["Physics: Electricity and magnetism", "Earth and Space: Planet Earth"],
            "twsStrands": [
                "Scientific enquiry: purpose and planning",
                "Scientific enquiry: analysis, evaluation and conclusions",
                "Models and representations",
                "Carrying out scientific enquiry",
            ],
            "scienceInContext": "Discuss how scientific knowledge develops over time by shared understanding and investigation. Evaluate topics using scientific understanding.",
            "learnersBookStartPage": 293,
            "learnersBookEndPage": 320,
            "workbookStartPage": 184,
            "workbookEndPage": 197,
            "isCompletedInSchool": False,
            "livingWorldChapters": [9, 14],
            "bridgeIds": [],
            "topics": [
                {
                    "id": "sci8-9.1",
                    "code": "9.1",
                    "title": "Magnetic fields",
                    "learnersBookPage": 293,
                    "workbookPage": 184,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [9],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Magnetic field lines from north pole to south pole, attraction and repulsion.",
                    "cambridgeWatchouts": ["Magnetic field lines always point AWAY from North and TOWARD South, and never cross."],
                },
                {
                    "id": "sci8-9.2",
                    "code": "9.2",
                    "title": "The Earth as a giant magnet",
                    "learnersBookPage": 300,
                    "workbookPage": 187,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [9, 14],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Earth's magnetic field generated by its liquid iron outer core, compass navigation, and magnetoreception in migratory birds and sea turtles.",
                    "cambridgeWatchouts": ["Geographic North is near a magnetic south pole, which is why the north-seeking pole of a compass needle points north."],
                },
                {
                    "id": "sci8-9.3",
                    "code": "9.3",
                    "title": "Electromagnets",
                    "learnersBookPage": 306,
                    "workbookPage": 193,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [9],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "Building an electromagnet with a coil of wire, electric current, and a soft iron core.",
                    "cambridgeWatchouts": ["Soft iron is used for the core because it magnetises and demagnetises easily when the current is switched on and off."],
                },
                {
                    "id": "sci8-9.4",
                    "code": "9.4",
                    "title": "Investigating electromagnets",
                    "learnersBookPage": 311,
                    "workbookPage": 197,
                    "discipline": "sibling_science",
                    "livingWorldChapters": [9],
                    "linkedWidgets": [],
                    "bridgeIds": [],
                    "summary": "How number of turns on the coil, current, and core material affect electromagnet strength.",
                    "cambridgeWatchouts": ["Increasing the number of turns or increasing the current increases the strength of the electromagnet."],
                },
            ],
        },
    ]
    return {
        "id": "cambridge-science-8-2ed",
        "title": "Cambridge Lower Secondary Science 8 (Second Edition)",
        "authors": "Mary Jones, Diane Fellowes-Freeman & Michael Smyth",
        "publisher": "Cambridge University Press",
        "curriculumCode": "0893",
        "learnersBookTotalPages": 326,
        "workbookTotalPages": 197,
        "units": units,
    }


def build_school_questions():
    """
    Pre-seeded Learner's Book (Topic Questions, Think like a scientist, Check your progress)
    and Workbook (Focus, Practice, Challenge) question bank with:
    - Worked Example (full step-by-step model reasoning)
    - Faded Completion (scaffolded blank to complete)
    - Independent Proof question + key mark-scheme points
    """
    return [
        # UNIT 1: RESPIRATION
        {
            "id": "q-u1-1.1-lb",
            "unitNumber": 1,
            "topicCode": "1.1",
            "sourceBook": "learners_book",
            "bookSection": "Topic 1.1 Questions (p. 11)",
            "tier": "Practice",
            "commandWord": "Explain",
            "marks": 3,
            "prompt": "Trace the path of an oxygen molecule from the air outside the nose until it reaches an alveolus, and explain how the rings of cartilage in the trachea and the ciliated cells lining the bronchi help keep the lungs working.",
            "workedExample": "Pathway: nose → pharynx → larynx (voicebox) → trachea → bronchus → bronchiole → alveolus.\n1. C-shaped rings of cartilage support the trachea and bronchi so the airway does not collapse when air pressure drops during inhalation.\n2. Goblet cells secrete sticky mucus that traps dust and bacteria, and cilia on ciliated epithelial cells beat rhythmically to sweep the mucus up to the throat to be swallowed.",
            "fadedPrompt": "Complete the mark-scheme explanation: Rings of ________ prevent the trachea from collapsing when pressure drops during breathing in. Sticky ________ traps dust and bacteria, and beating ________ sweep it up and out of the airways.",
            "fadedAnswer": "cartilage; mucus; cilia",
            "modelAnswer": "Air travels nose → larynx → trachea → bronchus → bronchiole → alveolus. Cartilage rings hold the trachea open against low pressure during inhalation; goblet cells make mucus to trap dust/microbes and ciliated cells beat to sweep mucus up to the throat.",
            "markSchemeKeywords": ["trachea", "bronchus", "bronchiole", "cartilage", "collapse", "mucus", "cilia"],
            "linkedChapter": 6,
            "linkedWidget": "alveolus_gas_exchange",
        },
        {
            "id": "q-u1-1.2-wb",
            "unitNumber": 1,
            "topicCode": "1.2",
            "sourceBook": "workbook",
            "bookSection": "Workbook 1.2 Challenge: Gas exchange (p. 5)",
            "tier": "Challenge",
            "commandWord": "Explain",
            "marks": 4,
            "prompt": "Explain three ways in which the structure of an alveolus and its blood supply are adapted to maximise the rate of gas exchange by diffusion.",
            "workedExample": "By Fick's law, diffusion rate increases with surface area and concentration gradient, and decreases with barrier thickness:\n1. Millions of alveoli provide a huge total surface area (~70 m² in adults) so many O₂ and CO₂ molecules diffuse simultaneously.\n2. Both the alveolus wall and the capillary wall are only ONE CELL THICK, giving a tiny diffusion distance (~0.5 µm).\n3. Continuous blood flow in the dense capillary network and continuous ventilation maintain a steep concentration gradient for O₂ (higher in alveolus than blood) and CO₂ (higher in blood than alveolus).",
            "fadedPrompt": "The alveolus wall and capillary wall are each only ________ cell thick, which makes the diffusion ________ very short. Continuous blood flow maintains a steep ________ gradient.",
            "fadedAnswer": "one; distance; concentration",
            "modelAnswer": "1. Large surface area from millions of alveoli. 2. Alveolar and capillary walls are one cell thick so the diffusion distance is very short. 3. Good blood supply in capillaries and breathing keep a steep concentration gradient for oxygen and carbon dioxide.",
            "markSchemeKeywords": ["surface area", "one cell thick", "short distance", "concentration gradient", "capillaries", "diffusion"],
            "linkedChapter": 6,
            "linkedWidget": "alveolus_gas_exchange",
        },
        {
            "id": "q-u1-1.3-lb",
            "unitNumber": 1,
            "topicCode": "1.3",
            "sourceBook": "learners_book",
            "bookSection": "Topic 1.3 Breathing & Bell-Jar Model (pp. 19–24)",
            "tier": "Practice",
            "commandWord": "Describe and explain",
            "marks": 4,
            "prompt": "Describe and explain the sequence of events in the ribcage, intercostal muscles, and diaphragm that causes air to enter the lungs when you breathe in (inspire).",
            "workedExample": "Step 1 (Muscles): External intercostal muscles contract (pulling the ribcage upwards and outwards) AND the diaphragm muscle contracts (flattening downwards).\nStep 2 (Volume): The volume inside the thorax (chest cavity) increases.\nStep 3 (Pressure): Because volume increases, pressure inside the thorax and lungs decreases below atmospheric pressure (Boyle's law).\nStep 4 (Airflow): Air flows down the pressure gradient from outside the body through the trachea into the lungs.",
            "fadedPrompt": "When breathing in, the intercostal muscles and diaphragm ________. This causes the volume inside the thorax to ________, so the pressure inside the lungs ________ below atmospheric pressure, drawing air in.",
            "fadedAnswer": "contract; increase; decreases",
            "modelAnswer": "The external intercostal muscles contract to move the ribcage up and out, and the diaphragm contracts and flattens. This increases the volume of the thorax, which decreases the pressure inside the lungs below atmospheric pressure, so air flows into the lungs.",
            "markSchemeKeywords": ["intercostal", "contract", "diaphragm", "flattens", "volume increases", "pressure decreases"],
            "linkedChapter": 6,
            "linkedWidget": "bell_jar_lungs",
        },
        {
            "id": "q-u1-1.4-wb",
            "unitNumber": 1,
            "topicCode": "1.4",
            "sourceBook": "workbook",
            "bookSection": "Workbook 1.4 Respiration in germinating peas (pp. 14–15)",
            "tier": "Challenge",
            "commandWord": "Explain",
            "marks": 4,
            "prompt": "Two thermos flasks are set up: Flask A contains live germinating pea seeds in surface steriliser; Flask B contains dead boiled pea seeds in surface steriliser. Write the word equation for aerobic respiration and explain why the thermometer in Flask A reads 6 °C higher after 48 hours than Flask B.",
            "workedExample": "Word equation: glucose + oxygen → carbon dioxide + water.\nIn Flask A, the living germinating pea cells carry out aerobic respiration inside their mitochondria to release energy for cell division and radicle growth. Because respiration is an exothermic reaction, some of the energy released from glucose is transferred as thermal energy (heat), raising the temperature. In Flask B, boiling killed the cells and denatured their respiratory enzymes, so no respiration occurs.",
            "fadedPrompt": "Word equation: ________ + oxygen → ________ + water. Live peas in Flask A carry out aerobic ________ inside their ________, which is an exothermic reaction that ________ thermal energy.",
            "fadedAnswer": "glucose; carbon dioxide; respiration; mitochondria; releases",
            "modelAnswer": "glucose + oxygen → carbon dioxide + water. The live germinating peas in Flask A respire aerobically, releasing energy from glucose; some energy is released as heat so temperature rises. Boiled peas in Flask B are dead (enzymes denatured) and cannot respire.",
            "markSchemeKeywords": ["glucose", "oxygen", "carbon dioxide", "water", "releases energy", "heat", "mitochondria"],
            "linkedChapter": 1,
            "linkedWidget": "monsoon_imbibition",
        },
        {
            "id": "q-u1-1.5-cyp",
            "unitNumber": 1,
            "topicCode": "1.5",
            "sourceBook": "learners_book",
            "bookSection": "Unit 1 Check your progress (pp. 37–39) & WB 1.5 (p. 16)",
            "tier": "Challenge",
            "commandWord": "Compare and explain",
            "marks": 4,
            "prompt": "State two structural differences between a red blood cell and a white blood cell as seen under a light microscope, and explain how each adaptation of a red blood cell helps it transport oxygen efficiently to respiring tissues.",
            "workedExample": "Differences under microscope: (1) Red blood cells have no nucleus, whereas white blood cells have a prominent (often lobed) nucleus; (2) Red blood cells are smaller biconcave discs, whereas white blood cells are larger and can change shape.\nAdaptations of red blood cells:\n1. Cytoplasm is packed with haemoglobin, which binds reversibly with oxygen in the lungs to form oxyhaemoglobin and releases oxygen at respiring cells.\n2. Having no nucleus (and no mitochondria) leaves more internal volume for haemoglobin molecules.\n3. Biconcave disc shape gives a large surface area to volume ratio so oxygen diffuses in and out rapidly; flexibility lets them squeeze through narrow capillaries.",
            "fadedPrompt": "Red blood cells contain the red pigment ________ which binds oxygen. Unlike white blood cells, mature red blood cells have no ________, leaving more space for haemoglobin, and have a ________ disc shape for a large surface area.",
            "fadedAnswer": "haemoglobin; nucleus; biconcave",
            "modelAnswer": "Red blood cells have no nucleus and are biconcave discs, while white blood cells have a nucleus. Having no nucleus leaves more room for haemoglobin to carry oxygen; the biconcave shape provides a large surface area to volume ratio for rapid oxygen diffusion.",
            "markSchemeKeywords": ["no nucleus", "haemoglobin", "biconcave", "surface area", "white blood cell", "oxyhaemoglobin"],
            "linkedChapter": 7,
            "linkedWidget": "blood_smear_microscope",
        },

        # UNIT 2 & UNIT 3 BIOLOGY BRIDGES
        {
            "id": "q-u2-2.4-wb",
            "unitNumber": 2,
            "topicCode": "2.4",
            "sourceBook": "workbook",
            "bookSection": "Workbook 2.4 Paper chromatography of leaf pigments (pp. 33–36)",
            "tier": "Practice",
            "commandWord": "Explain",
            "marks": 3,
            "prompt": "A student crushes green spinach leaves in propanone and spots the extract onto chromatography paper to separate the photosynthetic pigments. Explain (a) why the baseline must be drawn in pencil rather than ink, and (b) why the solvent level in the beaker must start below the pencil line.",
            "workedExample": "(a) Pencil lead is graphite, which is insoluble in the solvent and stays in place. Ink contains dyes that would dissolve in the rising solvent and travel up the paper, mixing with the leaf pigments.\n(b) If the solvent level started above the baseline, the spinach pigment spot would dissolve directly into the pool of solvent in the beaker instead of travelling up the paper fibres.",
            "fadedPrompt": "Pencil graphite is ________ in the solvent, whereas ink dyes would dissolve and move up the paper. Keeping the solvent below the baseline stops the pigment spot from ________ into the beaker liquid.",
            "fadedAnswer": "insoluble; dissolving",
            "modelAnswer": "(a) Pencil is insoluble in the solvent, whereas ink would dissolve and run up the chromatogram. (b) If the solvent were above the line, the leaf pigment spot would dissolve into the pool of solvent in the beaker instead of separating up the paper.",
            "markSchemeKeywords": ["insoluble", "dissolve", "ink", "solvent", "below"],
            "linkedChapter": 5,
            "linkedWidget": "leaf_chromatography",
        },
        {
            "id": "q-u3-3.4-wb",
            "unitNumber": 3,
            "topicCode": "3.4",
            "sourceBook": "workbook",
            "bookSection": "Workbook 3.4 Turning forces & Forearm Moments (pp. 51–54)",
            "tier": "Challenge",
            "commandWord": "Calculate",
            "marks": 3,
            "prompt": "Consider the human forearm as a lever with the elbow joint as the pivot. A student holds a 12 N stone in her hand at a perpendicular distance of 0.30 m from her elbow pivot. Her biceps muscle attaches to the radius bone 0.04 m from the elbow pivot. Calculate the upward force the biceps must exert to keep the forearm horizontal.",
            "workedExample": "1. Clockwise moment of stone about elbow = force × distance = 12 N × 0.30 m = 3.6 N m.\n2. For equilibrium (forearm stationary horizontal), anticlockwise moment of biceps = clockwise moment = 3.6 N m.\n3. F_biceps × 0.04 m = 3.6 N m ⇒ F_biceps = 3.6 ÷ 0.04 = 90 N.",
            "fadedPrompt": "Clockwise moment = 12 N × 0.30 m = ________ N m. For balance, F_biceps × 0.04 m = 3.6 N m, so F_biceps = ________ N.",
            "fadedAnswer": "3.6; 90",
            "modelAnswer": "Clockwise moment = 12 × 0.30 = 3.6 N m. Anticlockwise moment = F × 0.04 = 3.6 N m, so F = 3.6 ÷ 0.04 = 90 N.",
            "markSchemeKeywords": ["3.6", "90", "moment", "pivot"],
            "linkedChapter": 8,
            "linkedWidget": "antagonistic_arm_lever",
        },

        # UNIT 4: ECOSYSTEMS
        {
            "id": "q-u4-4.1-lb",
            "unitNumber": 4,
            "topicCode": "4.1",
            "sourceBook": "learners_book",
            "bookSection": "Topic 4.1 The Sonoran Desert (pp. 126–132) & WB 4.1 (p. 69)",
            "tier": "Practice",
            "commandWord": "Explain",
            "marks": 3,
            "prompt": "Explain how three structural adaptations of the saguaro cactus help it survive and photosynthesise in the hot, dry Sonoran Desert ecosystem.",
            "workedExample": "1. Wide, shallow root system spreads far just beneath the soil surface to absorb rainwater rapidly after brief desert showers before it evaporates.\n2. Thick, pleated green stem stores tonnes of water in swollen cells and contains chloroplasts to carry out photosynthesis.\n3. Leaves are reduced to sharp spines with a thick waxy cuticle, which greatly reduces surface area for water loss by transpiration and protects the stored water from thirsty herbivores.",
            "fadedPrompt": "The saguaro has wide shallow ________ to absorb rain quickly, a thick pleated green ________ that stores water and photosynthesises, and ________ instead of broad leaves to reduce water evaporation and deter herbivores.",
            "fadedAnswer": "roots; stem; spines",
            "modelAnswer": "1. Wide, shallow roots absorb water quickly over a large area when it rains. 2. Thick pleated stem stores large volumes of water and photosynthesises. 3. Spines instead of leaves reduce surface area for water loss and stop animals eating the cactus.",
            "markSchemeKeywords": ["roots", "store water", "stem", "spines", "surface area", "herbivores"],
            "linkedChapter": 14,
            "linkedWidget": "desert_adaptations",
        },
        {
            "id": "q-u4-4.2-wb",
            "unitNumber": 4,
            "topicCode": "4.2",
            "sourceBook": "workbook",
            "bookSection": "Workbook 4.2 Mangrove and Sea-Ice Ecosystems (pp. 72–75)",
            "tier": "Practice",
            "commandWord": "Explain",
            "marks": 3,
            "prompt": "In an Arctic Ocean food chain, photosynthetic algae grow on the underside of sea ice: ice algae → krill → Arctic cod → ringed seal → polar bear. Explain what the arrows in the food chain represent, and predict how melting of Arctic sea ice affects the polar bear population.",
            "workedExample": "1. The arrows represent the direction of energy transfer (chemical energy in food passing from one trophic level to the next).\n2. If sea ice melts, ice algae lose their habitat on the underside of the ice, so the producer population falls → less food for krill → fewer Arctic cod → fewer ringed seals → polar bears have less prey AND less sea-ice platform from which to hunt seals, causing the polar bear population to decrease.",
            "fadedPrompt": "Arrows in a food chain show the direction of ________ transfer. Melting sea ice destroys the habitat of ________ (the producers), reducing food for krill, cod, and seals, so the polar bear population ________.",
            "fadedAnswer": "energy; algae; decreases",
            "modelAnswer": "Arrows show the direction of energy transfer. Melting sea ice reduces the habitat for photosynthetic ice algae, leaving less food for krill, cod, and seals, and removes the ice platform polar bears need to hunt seals, so polar bear numbers fall.",
            "markSchemeKeywords": ["energy transfer", "algae", "producer", "habitat", "seals", "decrease"],
            "linkedChapter": 15,
            "linkedWidget": "food_web_trophic",
        },
        {
            "id": "q-u4-4.3-lb",
            "unitNumber": 4,
            "topicCode": "4.3",
            "sourceBook": "learners_book",
            "bookSection": "Topic 4.3 Intruders in an ecosystem (pp. 139–141) & WB 4.3 (p. 76)",
            "tier": "Challenge",
            "commandWord": "Explain",
            "marks": 4,
            "prompt": "Buffelgrass is an invasive grass introduced to the Sonoran Desert from Africa. Explain why buffelgrass spreads rapidly in the Sonoran Desert and how it reduces the population of native saguaro cacti.",
            "workedExample": "1. Buffelgrass spreads rapidly because in the Sonoran Desert it has few or no natural herbivores, pests, or pathogens that controlled it in its native African habitat.\n2. It grows in dense clumps and outcompetes native desert plants (including young saguaro seedlings) for scarce water, mineral ions, and space.\n3. Dry buffelgrass fuels frequent, hot wildfires; buffelgrass regrows quickly after fire, whereas native saguaro cacti are not adapted to fire and are killed.",
            "fadedPrompt": "Invasive buffelgrass has no natural ________ in the Sonoran Desert, ________ native saguaro seedlings for water and minerals, and fuels frequent ________ that kill native cacti.",
            "fadedAnswer": "predators/herbivores; outcompetes; wildfires",
            "modelAnswer": "Buffelgrass has no natural herbivores or diseases in the Sonoran Desert. It grows densely and outcompetes native saguaro seedlings for water, minerals, and space, and causes frequent wildfires that kill saguaro cacti.",
            "markSchemeKeywords": ["predators", "herbivores", "outcompetes", "water", "minerals", "fire", "native"],
            "linkedChapter": 15,
            "linkedWidget": "invasive_species_sim",
        },
        {
            "id": "q-u4-4.4-cyp",
            "unitNumber": 4,
            "topicCode": "4.4",
            "sourceBook": "workbook",
            "bookSection": "Workbook 4.4 Bioaccumulation & Unit 4 Check your progress (pp. 82–87)",
            "tier": "Challenge",
            "commandWord": "Explain",
            "marks": 4,
            "prompt": "A lake is sprayed with a very low concentration (0.000003 ppm) of the persistent insecticide DDT to kill mosquito larvae. Years later, fish-eating grebes and ospreys at the top of the food chain die or lay eggs with shells so thin they break. Using the terms bioaccumulation and biomagnification, explain why top predators suffer poison levels millions of times higher than the water.",
            "workedExample": "1. Persistence: DDT is non-biodegradable (does not break down) and fat-soluble, so organisms cannot excrete it; it builds up inside an organism's tissues over its lifetime (bioaccumulation).\n2. Food chain transfer: Microscopic plankton absorb DDT from water → each small fish eats thousands of plankton → each large fish eats many small fish → each osprey/grebe eats many large fish.\n3. Biomagnification: Because biomass is lost to respiration at each trophic level while all the DDT is retained, the concentration of DDT increases at each higher step of the food chain until it reaches a toxic dose in the top predator.",
            "fadedPrompt": "DDT does not ________ down and cannot be excreted, so it builds up in tissues (________). Each predator eats many prey from the level below, so the toxin concentration ________ along the food chain (biomagnification).",
            "fadedAnswer": "break; bioaccumulation; increases",
            "modelAnswer": "DDT is persistent (does not break down) and is not excreted, so it builds up in an organism over time (bioaccumulation). Because each consumer eats many organisms from the trophic level below, the concentration of DDT increases up the food chain (biomagnification) to reach toxic levels in top predators.",
            "markSchemeKeywords": ["persistent", "break down", "excreted", "bioaccumulation", "biomagnification", "concentration increases", "trophic"],
            "linkedChapter": 15,
            "linkedWidget": "bioaccumulation_pyramid",
        },

        # UNIT 7: DIET AND GROWTH (UPCOMING CORE BIOLOGY UNIT)
        {
            "id": "q-u7-7.1-lb",
            "unitNumber": 7,
            "topicCode": "7.1",
            "sourceBook": "learners_book",
            "bookSection": "Topic 7.1 Nutrients & Food Tests (pp. 233–240) & WB 7.1 (p. 134)",
            "tier": "Practice",
            "commandWord": "Describe and explain",
            "marks": 4,
            "prompt": "(a) Describe how you would test a sample of food for (i) starch and (ii) reducing sugar (glucose), stating the positive colour change for each. (b) Explain why a person whose diet lacks iron feels tired and short of breath.",
            "workedExample": "(a)(i) Starch test: Add a few drops of iodine solution; a positive result changes from orange-brown to blue-black.\n(a)(ii) Reducing sugar test: Add Benedict's solution and heat in a water bath at 80 °C; a positive result changes from blue to green/yellow/orange/brick-red precipitate.\n(b) Iron is needed to make haemoglobin in red blood cells. Without enough iron (anaemia), red blood cells contain less haemoglobin and carry less oxygen to respiring cells. Cells carry out less aerobic respiration and release less energy, causing tiredness and breathlessness.",
            "fadedPrompt": "(a) Iodine turns from brown to ________ with starch; heated Benedict's turns from blue to ________ with glucose. (b) Iron is needed to make ________, which carries oxygen for aerobic ________.",
            "fadedAnswer": "blue-black; brick-red/orange; haemoglobin; respiration",
            "modelAnswer": "(a)(i) Add iodine solution; turns blue-black if starch is present. (a)(ii) Add Benedict's solution and heat; turns brick-red/orange if sugar is present. (b) Iron is needed to make haemoglobin in red blood cells; a shortage causes anaemia so less oxygen is transported to cells for aerobic respiration, releasing less energy.",
            "markSchemeKeywords": ["iodine", "blue-black", "Benedict", "heat", "brick-red", "haemoglobin", "oxygen", "respiration"],
            "linkedChapter": 4,
            "linkedWidget": "food_tests_bench",
        },
        {
            "id": "q-u7-7.2-wb",
            "unitNumber": 7,
            "topicCode": "7.2",
            "sourceBook": "workbook",
            "bookSection": "Workbook 7.2 Balanced Diet & Energy Requirements (pp. 138–143)",
            "tier": "Practice",
            "commandWord": "Explain",
            "marks": 3,
            "prompt": "A 13-year-old student needs 10.0 MJ of energy per day, while a pregnant woman needs 10.9 MJ and a woman who is breastfeeding needs 11.7 MJ. Explain (a) why active teenagers need a high proportion of protein and calcium in their diet, and (b) why energy requirements increase during pregnancy.",
            "workedExample": "(a) Teenagers are undergoing rapid growth by cell division (mitosis): protein is required to synthesise new cell structures, cytoplasm, and muscle fibres, while calcium (with Vitamin D) is required to mineralise growing bones.\n(b) During pregnancy, extra energy is required for respiration in the growing fetus's dividing cells and placenta, plus the mother uses more energy moving a larger body mass.",
            "fadedPrompt": "Teenagers need ________ to build new cells for growth and ________ to build strong bones. A pregnant woman needs extra energy for ________ in the growing fetus and to carry extra body mass.",
            "fadedAnswer": "protein; calcium; respiration/growth",
            "modelAnswer": "(a) Protein is needed to make new cells and muscle tissue during growth; calcium is needed to build strong growing bones. (b) Extra energy is needed for respiration and cell division in the developing fetus and to move the mother's increased body mass.",
            "markSchemeKeywords": ["protein", "new cells", "growth", "calcium", "bones", "fetus", "respiration"],
            "linkedChapter": 11,
            "linkedWidget": "energy_balance_diet",
        },
        {
            "id": "q-u7-7.3-lb",
            "unitNumber": 7,
            "topicCode": "7.3",
            "sourceBook": "learners_book",
            "bookSection": "Topic 7.3 Growth, development and health — Smoking (pp. 248–251) & WB 7.3 (p. 144)",
            "tier": "Challenge",
            "commandWord": "Explain",
            "marks": 4,
            "prompt": "Tobacco smoke contains nicotine, carbon monoxide, and tar. Explain specifically how (a) carbon monoxide reduces the birth mass of babies born to mothers who smoke, and (b) tar leads to chronic bronchitis and emphysema.",
            "workedExample": "(a) Carbon monoxide diffuses into the mother's blood and binds irreversibly to haemoglobin in red blood cells (forming carboxyhaemoglobin), so each red blood cell carries less oxygen. Less oxygen diffuses across the placenta to the fetus, so fetal cells carry out less aerobic respiration, release less energy for cell division and protein synthesis, and the baby grows more slowly.\n(b) Tar paralyses and destroys the cilia on ciliated epithelial cells lining the trachea and bronchi. Mucus and trapped bacteria are no longer swept up, triggering persistent coughing (chronic bronchitis) that damages and ruptures the thin walls of the alveoli (emphysema), greatly reducing the surface area for gas exchange.",
            "fadedPrompt": "Carbon monoxide binds to ________ in place of oxygen, so fetal cells respire less and grow slower. Tar paralyses ________ so mucus builds up, and coughing breaks down ________ walls, reducing surface area for gas exchange.",
            "fadedAnswer": "haemoglobin; cilia; alveolar/alveolus",
            "modelAnswer": "(a) Carbon monoxide binds to haemoglobin so the mother's blood carries less oxygen to the fetus; fetal cells respire less and have less energy for growth. (b) Tar paralyses cilia in the airways so mucus and bacteria accumulate (bronchitis); persistent coughing breaks down alveolus walls (emphysema), reducing the surface area for gas exchange.",
            "markSchemeKeywords": ["carbon monoxide", "haemoglobin", "less oxygen", "respiration", "tar", "cilia", "mucus", "alveoli", "surface area"],
            "linkedChapter": 6,
            "linkedWidget": "smoking_alveoli_sim",
        },
        {
            "id": "q-u7-7.4-cyp",
            "unitNumber": 7,
            "topicCode": "7.4",
            "sourceBook": "learners_book",
            "bookSection": "Topic 7.4 Moving the body & Unit 7 Check your progress (pp. 252–262, WB p. 153)",
            "tier": "Challenge",
            "commandWord": "Explain",
            "marks": 4,
            "prompt": "Explain why two muscles — the biceps and the triceps — are needed at the elbow hinge joint to bend and straighten the forearm, and state the role of tendons, ligaments, and synovial fluid at the joint.",
            "workedExample": "1. Antagonistic pair rule: Muscles can only exert a pulling force when they contract; a muscle cannot push a bone when it relaxes. Therefore two antagonistic muscles pulling in opposite directions across the joint are required.\n2. Bending (flexing) the arm: the biceps contracts (pulling the radius upwards) while the triceps relaxes. Straightening (extending) the arm: the triceps contracts (pulling the ulna downwards) while the biceps relaxes.\n3. Tendons (tough, non-elastic cords) attach muscle to bone to transmit the pulling force; ligaments (slightly elastic) hold bone to bone to stabilise the joint; cartilage and synovial fluid reduce friction and absorb shock where bones meet.",
            "fadedPrompt": "Muscles can only ________ when they contract; they cannot push. To bend the arm, the biceps ________ and the triceps ________. ________ attach muscle to bone, while ligaments attach bone to bone.",
            "fadedAnswer": "pull; contracts; relaxes; Tendons",
            "modelAnswer": "Muscles can only pull when they contract and cannot push, so an antagonistic pair is needed to pull the forearm bones in opposite directions. To bend the arm, biceps contracts and triceps relaxes; to straighten it, triceps contracts and biceps relaxes. Tendons attach muscle to bone, ligaments hold bone to bone, and synovial fluid lubricates the joint to reduce friction.",
            "markSchemeKeywords": ["only pull", "cannot push", "antagonistic", "biceps contracts", "triceps relaxes", "tendons", "ligaments"],
            "linkedChapter": 8,
            "linkedWidget": "antagonistic_arm_lever",
        },
    ]


def build_diagram_recall_plates():
    """
    24 Specimen & School Diagram Recall Plates combining Cambridge Science 8 (Units 1, 4, 7)
    and The Living World (Ch 0-15) with normalized (x, y) callout pin coordinates for the
    3-tier Apple Pencil Fading Scaffold (Label Only -> Ghost Scaffold -> Blank Recall).
    """
    return [
        {
            "id": "plate-u1-respiratory",
            "title": "Human Respiratory System",
            "sourceRef": "Learner's Book 8 · Topic 1.1 (p. 9) & Living World Ch 6",
            "unitNumber": 1,
            "chapter": 6,
            "figureId": "c6_alveolus_exchange",
            "aspectRatio": 1.25,
            "callouts": [
                {"id": "larynx", "label": "Larynx (voicebox)", "x": 0.48, "y": 0.16, "hint": "Cartilage box at top of windpipe containing vocal cords"},
                {"id": "trachea", "label": "Trachea (with C-shaped cartilage rings)", "x": 0.48, "y": 0.30, "hint": "Main airway held open by rings of cartilage"},
                {"id": "bronchus", "label": "Left bronchus", "x": 0.56, "y": 0.44, "hint": "One of two main branches entering each lung"},
                {"id": "bronchiole", "label": "Bronchiole", "x": 0.66, "y": 0.56, "hint": "Fine muscular airway leading to air sacs"},
                {"id": "alveoli", "label": "Alveoli (air sacs)", "x": 0.72, "y": 0.68, "hint": "Microscopic grape-like air sacs where gas exchange occurs"},
                {"id": "intercostal", "label": "Intercostal muscle (between ribs)", "x": 0.26, "y": 0.50, "hint": "Muscle between ribs that moves the ribcage up and out"},
                {"id": "diaphragm", "label": "Diaphragm", "x": 0.50, "y": 0.84, "hint": "Dome-shaped sheet of muscle below the lungs"},
            ],
        },
        {
            "id": "plate-u1-alveolus",
            "title": "Alveolus & Blood Capillary Gas Exchange",
            "sourceRef": "Learner's Book 8 · Topic 1.2 (p. 13) & Workbook 1.2 (p. 5)",
            "unitNumber": 1,
            "chapter": 6,
            "figureId": "c6_alveolus_exchange",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "alv-wall", "label": "Alveolus wall (one cell thick)", "x": 0.42, "y": 0.28, "hint": "Single layer of squamous epithelial cells lining the air sac"},
                {"id": "cap-wall", "label": "Capillary wall (one cell thick)", "x": 0.54, "y": 0.64, "hint": "Single layer of endothelial cells carrying blood past the alveolus"},
                {"id": "o2-arrow", "label": "Oxygen diffusing into red blood cell", "x": 0.48, "y": 0.46, "hint": "Net movement down concentration gradient from air to haemoglobin"},
                {"id": "co2-arrow", "label": "Carbon dioxide diffusing into alveolar air", "x": 0.60, "y": 0.42, "hint": "Net movement from blood plasma into the air space to be exhaled"},
                {"id": "rbc", "label": "Red blood cell (biconcave, contains haemoglobin)", "x": 0.36, "y": 0.74, "hint": "Disc-shaped cell with no nucleus that forms oxyhaemoglobin"},
                {"id": "plasma", "label": "Blood plasma (carries dissolved CO₂ & glucose)", "x": 0.70, "y": 0.76, "hint": "Pale yellow liquid component of blood"},
            ],
        },
        {
            "id": "plate-u1-blood-smear",
            "title": "Blood Components Under the Light Microscope",
            "sourceRef": "Learner's Book 8 · Topic 1.5 (p. 32) & Living World Ch 7",
            "unitNumber": 1,
            "chapter": 7,
            "figureId": "c7_blood_components",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "rbc", "label": "Red blood cell (no nucleus, biconcave disc)", "x": 0.30, "y": 0.38, "hint": "Most numerous cell; transports oxygen bound to haemoglobin"},
                {"id": "phagocyte", "label": "White blood cell (lobed nucleus, engulfs pathogens)", "x": 0.64, "y": 0.36, "hint": "Larger cell with stained nucleus that defends against infection"},
                {"id": "lymphocyte", "label": "Lymphocyte (makes antibodies)", "x": 0.68, "y": 0.68, "hint": "White blood cell with large round nucleus that secretes antibodies"},
                {"id": "platelets", "label": "Platelets (cell fragments for blood clotting)", "x": 0.44, "y": 0.62, "hint": "Tiny fragments that seal wounds with fibrin mesh"},
                {"id": "plasma", "label": "Plasma (liquid medium)", "x": 0.22, "y": 0.74, "hint": "Watery solution carrying dissolved nutrients, CO₂, urea, and heat"},
            ],
        },
        {
            "id": "plate-u7-arm-lever",
            "title": "Antagonistic Biceps & Triceps at the Elbow Hinge Joint",
            "sourceRef": "Learner's Book 8 · Topic 7.4 (p. 254) & Living World Ch 8",
            "unitNumber": 7,
            "chapter": 8,
            "figureId": "c8_antagonistic_arm",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "scapula", "label": "Scapula (shoulder blade)", "x": 0.22, "y": 0.22, "hint": "Upper anchor bone for two tendons of the biceps"},
                {"id": "humerus", "label": "Humerus", "x": 0.34, "y": 0.44, "hint": "Upper arm bone between shoulder ball-and-socket and elbow hinge"},
                {"id": "biceps", "label": "Biceps muscle (contracts to bend arm)", "x": 0.44, "y": 0.34, "hint": "Flexor muscle on front of humerus"},
                {"id": "triceps", "label": "Triceps muscle (contracts to straighten arm)", "x": 0.28, "y": 0.56, "hint": "Extensor muscle on back of humerus"},
                {"id": "tendon", "label": "Tendon (attaches biceps muscle to radius)", "x": 0.52, "y": 0.56, "hint": "Tough inelastic cord transmitting muscle pull to bone"},
                {"id": "radius", "label": "Radius (pulled upward when biceps contracts)", "x": 0.68, "y": 0.54, "hint": "Forearm bone on thumb side where biceps inserts"},
                {"id": "ulna", "label": "Ulna (pulled downward when triceps contracts)", "x": 0.68, "y": 0.68, "hint": "Forearm bone forming the hinge at the elbow pivot"},
            ],
        },
        {
            "id": "plate-u7-synovial-joint",
            "title": "Synovial Hinge Joint Cutaway",
            "sourceRef": "Learner's Book 8 · Topic 7.4 (p. 253) & Living World Ch 8",
            "unitNumber": 7,
            "chapter": 8,
            "figureId": "c8_synovial_joint",
            "aspectRatio": 1.25,
            "callouts": [
                {"id": "cartilage", "label": "Smooth cartilage (absorbs shock, reduces friction)", "x": 0.48, "y": 0.44, "hint": "Smooth elastic layer covering the ends of both bones"},
                {"id": "synovial-fluid", "label": "Synovial fluid (lubricates joint)", "x": 0.52, "y": 0.54, "hint": "Slippery fluid filling the joint cavity"},
                {"id": "synovial-membrane", "label": "Synovial membrane (secretes synovial fluid)", "x": 0.34, "y": 0.52, "hint": "Inner lining of the joint capsule"},
                {"id": "ligament", "label": "Ligament (holds bone to bone)", "x": 0.72, "y": 0.50, "hint": "Tough, slightly elastic strap preventing dislocation"},
            ],
        },
        {
            "id": "plate-ch02-cells",
            "title": "Plant Cell vs Animal Cell Ultrastructure",
            "sourceRef": "The Living World · Ch 2 (fig c2_plant_animal_compare)",
            "unitNumber": 1,
            "chapter": 2,
            "figureId": "c2_plant_animal_compare",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "cell-wall", "label": "Cellulose cell wall (plant only — rigid support)", "x": 0.18, "y": 0.24, "hint": "Freely permeable outer box that resists turgor pressure"},
                {"id": "membrane", "label": "Partially permeable cell membrane (both)", "x": 0.48, "y": 0.28, "hint": "Phospholipid bilayer controlling entry and exit of substances"},
                {"id": "nucleus", "label": "Nucleus (contains DNA chromosomes)", "x": 0.50, "y": 0.48, "hint": "Control centre housing genetic instructions"},
                {"id": "chloroplast", "label": "Chloroplast (plant only — site of photosynthesis)", "x": 0.24, "y": 0.54, "hint": "Contains green chlorophyll to trap light energy"},
                {"id": "vacuole", "label": "Large permanent sap vacuole (plant only)", "x": 0.30, "y": 0.70, "hint": "Filled with cell sap; pushes cytoplasm against cell wall"},
                {"id": "mitochondrion", "label": "Mitochondrion (both — site of aerobic respiration)", "x": 0.72, "y": 0.64, "hint": "Folded inner membrane where glucose + oxygen release energy"},
            ],
        },
        {
            "id": "plate-ch05-leaf",
            "title": "Transverse Section of a Dicot Leaf",
            "sourceRef": "The Living World · Ch 5 (fig c5_leaf_cross_section) & Unit 2.4 / 6.4",
            "unitNumber": 2,
            "chapter": 5,
            "figureId": "c5_leaf_cross_section",
            "aspectRatio": 1.4,
            "callouts": [
                {"id": "cuticle", "label": "Waxy cuticle (waterproof, transparent)", "x": 0.48, "y": 0.12, "hint": "Prevents excessive water evaporation from upper surface"},
                {"id": "upper-epi", "label": "Upper epidermis (transparent, no chloroplasts)", "x": 0.48, "y": 0.22, "hint": "Lets light pass straight through to palisade layer"},
                {"id": "palisade", "label": "Palisade mesophyll (packed with chloroplasts)", "x": 0.48, "y": 0.38, "hint": "Tall column cells arranged end-on to absorb maximum light"},
                {"id": "spongy", "label": "Spongy mesophyll & interconnected air spaces", "x": 0.42, "y": 0.62, "hint": "Allows rapid diffusion of CO₂ to palisade cells and O₂ out"},
                {"id": "vein", "label": "Vascular bundle (xylem brings water; phloem exports sucrose)", "x": 0.68, "y": 0.56, "hint": "Leaf vein transporting water in and sugars out"},
                {"id": "guard-stoma", "label": "Guard cells surrounding stoma pore", "x": 0.52, "y": 0.86, "hint": "Bean-shaped cells in lower epidermis that open and close the pore"},
            ],
        },
        {
            "id": "plate-ch04-digestive",
            "title": "Human Digestive System & Enzyme Sites",
            "sourceRef": "The Living World · Ch 4 (fig c4_digestive_tract) & Unit 7.1",
            "unitNumber": 7,
            "chapter": 4,
            "figureId": "c4_digestive_tract",
            "aspectRatio": 1.25,
            "callouts": [
                {"id": "salivary", "label": "Salivary glands (secrete amylase: starch → maltose)", "x": 0.48, "y": 0.14, "hint": "Begins chemical digestion of starch at pH ~7"},
                {"id": "oesophagus", "label": "Oesophagus (peristalsis pushes bolus to stomach)", "x": 0.50, "y": 0.28, "hint": "Muscular tube behind trachea"},
                {"id": "stomach", "label": "Stomach (pepsin digests protein in HCl at pH 2)", "x": 0.56, "y": 0.44, "hint": "Churns food with hydrochloric acid and protease"},
                {"id": "liver-bile", "label": "Liver & Gall bladder (bile emulsifies fats & neutralises acid)", "x": 0.36, "y": 0.46, "hint": "Breaks large fat drops into tiny droplets for lipase"},
                {"id": "pancreas", "label": "Pancreas (secretes amylase, protease & lipase)", "x": 0.54, "y": 0.56, "hint": "Delivers all three classes of digestive enzymes into duodenum"},
                {"id": "ileum", "label": "Small intestine / Ileum (villi absorb glucose & amino acids)", "x": 0.50, "y": 0.72, "hint": "Folded wall with microvilli, capillaries, and lacteals"},
            ],
        },
        {
            "id": "plate-ch07-heart",
            "title": "Mammalian Four-Chambered Heart",
            "sourceRef": "The Living World · Ch 7 (fig c7_heart_section) & Unit 1.5",
            "unitNumber": 1,
            "chapter": 7,
            "figureId": "c7_heart_section",
            "aspectRatio": 1.25,
            "callouts": [
                {"id": "vena-cava", "label": "Vena cava (brings deoxygenated blood from body)", "x": 0.26, "y": 0.26, "hint": "Main vein entering the right atrium"},
                {"id": "right-atrium", "label": "Right atrium", "x": 0.32, "y": 0.42, "hint": "Upper right chamber (on left side of diagram)"},
                {"id": "right-ventricle", "label": "Right ventricle (pumps blood to lungs)", "x": 0.36, "y": 0.68, "hint": "Thinner muscular wall than left ventricle because lungs are close"},
                {"id": "pulm-artery", "label": "Pulmonary artery (carries deoxygenated blood to lungs)", "x": 0.48, "y": 0.20, "hint": "Only artery in adults that carries deoxygenated blood"},
                {"id": "pulm-vein", "label": "Pulmonary vein (brings oxygenated blood from lungs)", "x": 0.72, "y": 0.34, "hint": "Enters the left atrium from the lungs"},
                {"id": "left-ventricle", "label": "Left ventricle (thick muscular wall pumps to whole body)", "x": 0.64, "y": 0.70, "hint": "Thickest cardiac muscle wall to generate high systemic pressure"},
                {"id": "aorta", "label": "Aorta (main oxygenated artery to body)", "x": 0.56, "y": 0.16, "hint": "Arches over heart to supply head and body"},
            ],
        },
        {
            "id": "plate-ch09-reflex",
            "title": "Spinal Reflex Arc & Synapse",
            "sourceRef": "The Living World · Ch 9 (fig c9_reflex_arc)",
            "unitNumber": 7,
            "chapter": 9,
            "figureId": "c9_reflex_arc",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "receptor", "label": "Pain/Heat receptor in skin", "x": 0.18, "y": 0.68, "hint": "Detects stimulus and generates electrical impulse"},
                {"id": "sensory", "label": "Sensory neurone (carries impulse to spinal cord)", "x": 0.42, "y": 0.36, "hint": "Cell body sits in dorsal root ganglion"},
                {"id": "relay", "label": "Relay neurone in grey matter of spinal cord", "x": 0.68, "y": 0.44, "hint": "Links sensory neurone to motor neurone across synapses"},
                {"id": "motor", "label": "Motor neurone (carries impulse to effector muscle)", "x": 0.48, "y": 0.66, "hint": "Long axon ending at neuromuscular junction"},
                {"id": "effector", "label": "Effector (biceps muscle contracts to pull hand away)", "x": 0.28, "y": 0.82, "hint": "Carries out rapid automatic response before conscious pain"},
            ],
        },
        {
            "id": "plate-ch10-flower",
            "title": "Insect-Pollinated Flower Dissection",
            "sourceRef": "The Living World · Ch 10 (fig c10_flower_anatomy)",
            "unitNumber": 4,
            "chapter": 10,
            "figureId": "c10_flower_anatomy",
            "aspectRatio": 1.3,
            "callouts": [
                {"id": "petal", "label": "Brightly coloured petal & nectar guide", "x": 0.24, "y": 0.32, "hint": "Attracts insect pollinators"},
                {"id": "anther", "label": "Anther (produces sticky pollen grains)", "x": 0.34, "y": 0.26, "hint": "Top of male stamen"},
                {"id": "filament", "label": "Filament (supports anther)", "x": 0.36, "y": 0.48, "hint": "Stalk of male stamen"},
                {"id": "stigma", "label": "Stigma (sticky surface that catches pollen)", "x": 0.50, "y": 0.20, "hint": "Top of female carpel"},
                {"id": "style", "label": "Style (pollen tube grows down here)", "x": 0.50, "y": 0.42, "hint": "Connects stigma to ovary"},
                {"id": "ovary-ovule", "label": "Ovary containing ovules (becomes fruit with seeds)", "x": 0.50, "y": 0.68, "hint": "Base of carpel where fertilisation occurs"},
            ],
        },
        {
            "id": "plate-u4-pyramid",
            "title": "Sonoran Desert & Aquatic Bioaccumulation Pyramid",
            "sourceRef": "Learner's Book 8 · Topic 4.4 (p. 143) & Living World Ch 15",
            "unitNumber": 4,
            "chapter": 15,
            "figureId": "c15_trophic_pyramid",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "producers", "label": "Producers (algae / cacti — trap light energy, lowest toxin concentration)", "x": 0.50, "y": 0.82, "hint": "Base of pyramid with largest biomass"},
                {"id": "primary", "label": "Primary consumers (herbivorous zooplankton / insects)", "x": 0.50, "y": 0.62, "hint": "Second trophic level; ~90% of energy lost as heat/respiration"},
                {"id": "secondary", "label": "Secondary consumers (small carnivorous fish / lizards)", "x": 0.50, "y": 0.42, "hint": "Third trophic level; toxin concentration magnifies further"},
                {"id": "tertiary", "label": "Apex predator (osprey / hawk — highest biomagnified DDT concentration)", "x": 0.50, "y": 0.20, "hint": "Top trophic level with smallest biomass but highest toxin dose"},
            ],
        },
        {
            "id": "plate-ch00-microscope",
            "title": "Compound Light Microscope & Optical Ray Path",
            "sourceRef": "Living World Ch 0 · Seeing the Invisible & Unit 6.2 Refraction",
            "unitNumber": 6,
            "chapter": 0,
            "figureId": "c0_microscope_rays",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "eyepiece", "label": "Eyepiece lens (ocular — typically 10x magnification)", "x": 0.50, "y": 0.14, "hint": "Top lens you look through"},
                {"id": "objective", "label": "Objective lens turret (4x, 10x, 40x high power)", "x": 0.50, "y": 0.42, "hint": "Lens closest to the slide specimen"},
                {"id": "stage", "label": "Stage & slide clips (holds glass slide over condenser)", "x": 0.50, "y": 0.58, "hint": "Flat platform where the specimen sits"},
                {"id": "focus-knobs", "label": "Coarse & fine focus adjustment knobs", "x": 0.24, "y": 0.68, "hint": "Used to bring image into sharp focus"},
                {"id": "illuminator", "label": "Substage light source / condenser diaphragm", "x": 0.50, "y": 0.84, "hint": "Directs light upward through transparent specimen"},
            ],
        },
        {
            "id": "plate-ch01-bacterium-virus",
            "title": "Prokaryotic Bacterial Cell vs Acellular Virus Particle",
            "sourceRef": "Living World Ch 1 · What It Means to Be Alive",
            "unitNumber": 1,
            "chapter": 1,
            "figureId": "c1_prokaryote_vs_virus",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "nucleoid", "label": "Circular chromosomal DNA (nucleoid — no nuclear envelope)", "x": 0.28, "y": 0.48, "hint": "Main genetic loop of the bacterium"},
                {"id": "plasmid", "label": "Plasmid ring (small extra-chromosomal DNA loop)", "x": 0.40, "y": 0.66, "hint": "Often carries antibiotic-resistance genes"},
                {"id": "peptidoglycan", "label": "Bacterial cell wall & plasma membrane", "x": 0.18, "y": 0.28, "hint": "Prevents osmotic bursting"},
                {"id": "capsid", "label": "Viral protein coat (capsid — no cytoplasm or ribosomes)", "x": 0.74, "y": 0.36, "hint": "Geometric protein shell of the virus"},
                {"id": "viral-genome", "label": "Viral nucleic acid core (DNA or RNA only)", "x": 0.74, "y": 0.56, "hint": "Hijacks host cell machinery to replicate"},
            ],
        },
        {
            "id": "plate-ch03-membrane-mosaic",
            "title": "Fluid Mosaic Cell Membrane & Transport Proteins",
            "sourceRef": "Living World Ch 3 · Membranes, Diffusion & Osmosis",
            "unitNumber": 3,
            "chapter": 3,
            "figureId": "c3_fluid_mosaic",
            "aspectRatio": 1.5,
            "callouts": [
                {"id": "heads", "label": "Hydrophilic phosphate heads (face water on both sides)", "x": 0.22, "y": 0.30, "hint": "Water-loving outer surfaces of the bilayer"},
                {"id": "tails", "label": "Hydrophobic fatty-acid tails (non-polar interior barrier)", "x": 0.22, "y": 0.52, "hint": "Water-fearing core that blocks charged ions"},
                {"id": "aquaporin", "label": "Aquaporin water channel (facilitated osmosis)", "x": 0.50, "y": 0.48, "hint": "Protein pore allowing rapid water passage"},
                {"id": "pump", "label": "ATP-driven active transport pump (moves ions against gradient)", "x": 0.78, "y": 0.52, "hint": "Uses ATP hydrolysis to pump uphill"},
            ],
        },
        {
            "id": "plate-ch04-enzyme-complex",
            "title": "Enzyme Active Site, Induced Fit & Thermal Denaturation",
            "sourceRef": "Living World Ch 4 · Biological Molecules & Enzymes",
            "unitNumber": 7,
            "chapter": 4,
            "figureId": "c4_enzyme_catalysis",
            "aspectRatio": 1.5,
            "callouts": [
                {"id": "active-site", "label": "3D active site pocket (complementary to substrate)", "x": 0.22, "y": 0.38, "hint": "Specific binding cleft on the folded protein"},
                {"id": "es-complex", "label": "Enzyme-substrate complex (lowers activation energy Ea)", "x": 0.50, "y": 0.44, "hint": "Transient state stabilizing bond breaking"},
                {"id": "products", "label": "Released products (enzyme emerges unchanged)", "x": 0.72, "y": 0.26, "hint": "Leaves the active site free for the next cycle"},
                {"id": "denatured", "label": "Denatured enzyme (unfolded active site above T_opt)", "x": 0.82, "y": 0.74, "hint": "Thermal motion breaks hydrogen/ionic bonds"},
            ],
        },
        {
            "id": "plate-ch05-chloroplast",
            "title": "Chloroplast Ultrastructure: Thylakoid Grana & Stroma",
            "sourceRef": "Living World Ch 5 · Photosynthesis & Carbon Fixation",
            "unitNumber": 4,
            "chapter": 5,
            "figureId": "c5_chloroplast",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "double-envelope", "label": "Outer and inner chloroplast envelope membranes", "x": 0.20, "y": 0.24, "hint": "Double membrane boundary of endosymbiotic origin"},
                {"id": "granum", "label": "Granum (stack of thylakoid discs with chlorophyll)", "x": 0.42, "y": 0.48, "hint": "Site of light-dependent water splitting & ATP/NADPH generation"},
                {"id": "stroma", "label": "Stroma fluid (contains RuBisCO for the Calvin cycle)", "x": 0.68, "y": 0.56, "hint": "Fixes CO2 into triose phosphate sugars"},
                {"id": "starch-grain", "label": "Assimilatory starch grain (insoluble carbohydrate store)", "x": 0.62, "y": 0.32, "hint": "Tests blue-black with iodine solution"},
            ],
        },
        {
            "id": "plate-ch06-mitochondrion",
            "title": "Mitochondrion Ultrastructure & Proton-Motive ATP Synthase",
            "sourceRef": "Living World Ch 6 · Cellular Respiration & Unit 1.4",
            "unitNumber": 1,
            "chapter": 6,
            "figureId": "c6_mitochondrion",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "outer-membrane", "label": "Smooth outer mitochondrial membrane", "x": 0.20, "y": 0.26, "hint": "Separates mitochondrion from cytosol"},
                {"id": "cristae", "label": "Folded inner membrane (cristae — huge surface area for ETC)", "x": 0.46, "y": 0.42, "hint": "Infoldings packed with electron transport complexes"},
                {"id": "intermembrane", "label": "Intermembrane space (high H+ proton reservoir)", "x": 0.32, "y": 0.68, "hint": "Protons are pumped into this narrow compartment"},
                {"id": "matrix", "label": "Mitochondrial matrix (Krebs cycle enzymes & circular mtDNA)", "x": 0.66, "y": 0.54, "hint": "Innermost compartment where CO2 is released"},
                {"id": "atp-synthase", "label": "ATP synthase rotary molecular turbine", "x": 0.78, "y": 0.36, "hint": "Spun by proton flow back into the matrix"},
            ],
        },
        {
            "id": "plate-ch07-xylem-phloem",
            "title": "Plant Vascular Bundle: Xylem Vessels, Phloem & Transpiration",
            "sourceRef": "Living World Ch 7 · Transport in Plants & Animals",
            "unitNumber": 1,
            "chapter": 7,
            "figureId": "c7_vascular_bundle",
            "aspectRatio": 1.35,
            "callouts": [
                {"id": "xylem", "label": "Lignified xylem vessel (dead hollow tube carrying water & mineral ions upward)", "x": 0.34, "y": 0.44, "hint": "Rings/spirals of lignin prevent collapse under tension"},
                {"id": "sieve-tube", "label": "Phloem sieve-tube element (living cell translocating sucrose both ways)", "x": 0.66, "y": 0.44, "hint": "Perforated end walls (sieve plates)"},
                {"id": "companion", "label": "Companion cell (packed with mitochondria for active sucrose loading)", "x": 0.78, "y": 0.62, "hint": "Supplies ATP to adjacent sieve tube"},
                {"id": "cambium", "label": "Vascular cambium meristem", "x": 0.50, "y": 0.52, "hint": "Dividing layer between xylem and phloem"},
            ],
        },
        {
            "id": "plate-ch08-nephron",
            "title": "Kidney Nephron: Ultrafiltration & Selective Reabsorption",
            "sourceRef": "Living World Ch 8 · Digestion, Excretion & Movement",
            "unitNumber": 7,
            "chapter": 8,
            "figureId": "c8_kidney_nephron",
            "aspectRatio": 1.4,
            "callouts": [
                {"id": "glomerulus", "label": "Glomerulus & Bowman's capsule (high-pressure ultrafiltration)", "x": 0.24, "y": 0.28, "hint": "Filters water, glucose, urea and salts; retains blood cells & proteins"},
                {"id": "pct", "label": "Proximal convoluted tubule (reabsorbs 100% of glucose via active transport)", "x": 0.48, "y": 0.26, "hint": "Packed with mitochondria and microvilli"},
                {"id": "loop-henle", "label": "Loop of Henle (builds medullary salt gradient for water conservation)", "x": 0.46, "y": 0.72, "hint": "Hairpin countercurrent multiplier"},
                {"id": "collecting-duct", "label": "Collecting duct (ADH-regulated aquaporin water reabsorption)", "x": 0.78, "y": 0.54, "hint": "Delivers final urine to renal pelvis"},
            ],
        },
        {
            "id": "plate-ch09-eye-optics",
            "title": "Human Eye Cross-Section, Accommodation & Retinal Photoreceptors",
            "sourceRef": "Living World Ch 9 · Nervous System & Unit 6.2/6.4 Light",
            "unitNumber": 6,
            "chapter": 9,
            "figureId": "c9_human_eye",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "cornea", "label": "Cornea (transparent curved front window — performs most refraction)", "x": 0.16, "y": 0.50, "hint": "First refractive air-tissue interface"},
                {"id": "iris-pupil", "label": "Iris & pupil (circular/radial muscles regulating light entry)", "x": 0.26, "y": 0.42, "hint": "Constricts in bright light, dilates in dim light"},
                {"id": "lens-ciliary", "label": "Crystalline lens, suspensory ligaments & ciliary muscle (accommodation)", "x": 0.34, "y": 0.52, "hint": "Changes curvature to focus near vs distant objects"},
                {"id": "fovea", "label": "Retina & fovea (packed with red, green and blue cone photoreceptors)", "x": 0.82, "y": 0.50, "hint": "Transduces photons into action potentials"},
                {"id": "optic-nerve", "label": "Optic nerve & blind spot (carries impulses to visual cortex)", "x": 0.84, "y": 0.68, "hint": "No rods or cones where axons exit"},
            ],
        },
        {
            "id": "plate-ch10-homeostasis-loop",
            "title": "Blood Glucose Homeostasis: Insulin, Glucagon & Liver Glycogen",
            "sourceRef": "Living World Ch 10 · Endocrine Control & Homeostasis",
            "unitNumber": 7,
            "chapter": 10,
            "figureId": "c10_glucose_feedback",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "beta-insulin", "label": "Pancreatic beta cells secrete insulin when blood glucose rises", "x": 0.30, "y": 0.26, "hint": "Triggered after a carbohydrate-rich meal"},
                {"id": "glycogenesis", "label": "Liver & muscle cells take up glucose and store insoluble glycogen", "x": 0.72, "y": 0.28, "hint": "Lowers blood glucose back to ~90 mg/dL set-point"},
                {"id": "alpha-glucagon", "label": "Pancreatic alpha cells secrete glucagon when blood glucose falls", "x": 0.30, "y": 0.74, "hint": "Triggered during fasting or exercise"},
                {"id": "glycogenolysis", "label": "Liver breaks down glycogen into glucose and releases it into blood", "x": 0.72, "y": 0.72, "hint": "Restores blood glucose to normal"},
            ],
        },
        {
            "id": "plate-ch12-mitosis-meiosis",
            "title": "Cell Division Comparison: Mitosis (2n -> 2n) vs Meiosis (2n -> n)",
            "sourceRef": "Living World Ch 12 · Cell Cycle, Mitosis & Meiosis",
            "unitNumber": 7,
            "chapter": 12,
            "figureId": "c12_mitosis_vs_meiosis",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "spindle", "label": "Mitotic spindle fibres & centromere attachment (metaphase plate)", "x": 0.26, "y": 0.34, "hint": "Lines up replicated chromosomes before separation"},
                {"id": "diploid-clones", "label": "Two genetically identical diploid (2n) daughter cells (growth & repair)", "x": 0.28, "y": 0.72, "hint": "Output of mitosis"},
                {"id": "crossing-over", "label": "Homologous pairing & crossing over at chiasmata (prophase I)", "x": 0.72, "y": 0.30, "hint": "Shuffles maternal and paternal alleles in meiosis"},
                {"id": "haploid-gametes", "label": "Four genetically unique haploid (n) gametes (sperm / egg / pollen)", "x": 0.74, "y": 0.74, "hint": "Halves chromosome number so fertilisation restores 2n"},
            ],
        },
        {
            "id": "plate-ch14-selection-tree",
            "title": "Natural Selection, Antibiotic Resistance & Phylogenetic Speciation",
            "sourceRef": "Living World Ch 14 · Evolution, Natural Selection & Deep Time",
            "unitNumber": 4,
            "chapter": 14,
            "figureId": "c14_natural_selection",
            "aspectRatio": 1.45,
            "callouts": [
                {"id": "random-mutation", "label": "Pre-existing random genetic variation (resistant mutant arises before antibiotic)", "x": 0.20, "y": 0.34, "hint": "Mutation is random, never directed by need"},
                {"id": "selection-pressure", "label": "Environmental selection pressure (antibiotic / predator / drought)", "x": 0.48, "y": 0.48, "hint": "Removes susceptible individuals"},
                {"id": "differential-reproduction", "label": "Differential survival & reproduction (resistant survivors pass on alleles)", "x": 0.78, "y": 0.36, "hint": "Allele frequency shifts across generations"},
                {"id": "common-ancestor", "label": "Common ancestor node on phylogenetic tree", "x": 0.50, "y": 0.80, "hint": "Branch point where ancestral population diverged"},
            ],
        },
    ]


def parse_research_grounding():
    """
    Parses source/research/misconceptions.md and source/research/school-wording.md
    into structured records for kb.sqlite and BiologyCoachView.
    """
    def clean_md(s: str) -> str:
        s = re.sub(r"<br\s*/?>", " ", s)
        s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
        s = re.sub(r"\*([^*]+)\*", r"\1", s)
        return re.sub(r"\s+", " ", s).strip()

    research_dir = ROOT / "source" / "research"
    misconceptions = []
    mis_path = research_dir / "misconceptions.md"
    if mis_path.exists():
        text = mis_path.read_text(encoding="utf-8")
        sections = re.split(r"\n###\s+\d+\.\s+", text)
        for idx, sec in enumerate(sections[1:], start=1):
            lines = [ln.strip() for ln in sec.strip().splitlines() if ln.strip()]
            if not lines:
                continue
            heading = lines[0]
            body = " ".join(lines[1:])
            misconceptions.append({
                "id": f"misconception-{idx:02d}",
                "topic": heading,
                "details": clean_md(body)[:900],
            })

    school_wording = []
    sw_path = research_dir / "school-wording.md"
    if sw_path.exists():
        text = sw_path.read_text(encoding="utf-8")
        for idx, line in enumerate(text.splitlines()):
            if line.startswith("| **Ch"):
                cols = [c.strip() for c in line.strip("|").split("|")]
                if len(cols) >= 4:
                    school_wording.append({
                        "id": f"school-wording-{len(school_wording)+1:02d}",
                        "topicAndChapter": clean_md(cols[0]),
                        "firstPrinciples": clean_md(cols[1]),
                        "cambridgeWording": clean_md(cols[2]),
                        "examinerTrap": clean_md(cols[3]),
                    })

    return misconceptions, school_wording


def bundle_living_world_book():
    """
    Copies index.html, sw.js, live/, and assets/ into KymBio/KymBio/Resources/LivingWorldBook/
    so WKWebView can load the entire interactive book + 45 simulations 100% offline.
    """
    if BOOK_BUNDLE_DIR.exists():
        shutil.rmtree(BOOK_BUNDLE_DIR)
    BOOK_BUNDLE_DIR.mkdir(parents=True, exist_ok=True)

    for fname in ["index.html", "sw.js", "manifest.webmanifest"]:
        src = ROOT / fname
        if src.exists():
            shutil.copy2(src, BOOK_BUNDLE_DIR / fname)

    for folder in ["live", "assets"]:
        src_dir = ROOT / folder
        if src_dir.exists():
            shutil.copytree(src_dir, BOOK_BUNDLE_DIR / folder)


def main():
    PACK_DIR.mkdir(parents=True, exist_ok=True)

    chapters = parse_chapters()
    atlas_lessons = parse_atlas_lessons()
    widgets = parse_widgets()
    explorers = build_explorers()
    bridges = build_cross_disciplinary_bridges()
    school_textbook = build_school_science_textbook()
    school_questions = build_school_questions()
    diagram_plates = build_diagram_recall_plates()
    misconceptions, school_wording = parse_research_grounding()

    pack = {
        "schemaVersion": 1,
        "packId": "kymbio-seed-pack-v1",
        "generatedBy": "source/export_kymbio_pack.py",
        "volumes": list(VOLUME_META.values()),
        "chapters": chapters,
        "explorers": explorers,
        "atlasLessons": atlas_lessons,
        "widgets": widgets,
        "crossDisciplinaryBridges": bridges,
        "schoolTextbook": school_textbook,
        "schoolQuestions": school_questions,
        "diagramPlates": diagram_plates,
        "misconceptions": misconceptions,
        "schoolWordingEntries": school_wording,
    }

    out_path = PACK_DIR / "kymbio-seed-pack.json"
    out_path.write_text(json.dumps(pack, indent=2, ensure_ascii=False), encoding="utf-8")

    bundle_living_world_book()

    print(
        f"Exported KymBio seed pack to {out_path}:\n"
        f"  - {len(chapters)} Living World chapters across {len(VOLUME_META)} volumes\n"
        f"  - {len(explorers)} Front-Matter Explorers\n"
        f"  - {len(atlas_lessons)} 3D Atlas lessons\n"
        f"  - {len(widgets)} interactive simulations with Watch/Cutaway/Challenges\n"
        f"  - {len(school_textbook['units'])} Cambridge Science 8 units ({sum(len(u['topics']) for u in school_textbook['units'])} sub-topics)\n"
        f"  - {len(school_questions)} pre-seeded Learner's Book & Workbook Proof questions\n"
        f"  - {len(bridges)} Chemistry & Physics First-Principles Bridges\n"
        f"  - {len(diagram_plates)} Apple Pencil Specimen Diagram Recall plates"
    )


if __name__ == "__main__":
    main()
