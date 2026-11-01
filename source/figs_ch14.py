"""Chapter 14 original SVG plates — The Glitch Engine & Natural Selection: Variation, Adaptation & Evolution.

Nine bespoke figures built on figs_core primitives:
1. c14_mutation_variation_spectra   (#fig-14-1, upgraded by w_variation_mutation_lab.js)
2. c14_mutagens_dna_glitches        (#fig-14-2)
3. c14_natural_selection_six_steps  (#fig-14-3)
4. c14_antibiotic_resistance_selection (#fig-14-4, upgraded by w_natural_selection_simulator.js)
5. c14_xerophyte_hydrophyte_adaptations (#fig-14-5, upgraded by w_adaptive_features_selective_breeding.js)
6. c14_animal_plant_adaptive_features (#fig-14-6)
7. c14_selective_breeding_vs_natural (#fig-14-7)
8. c14_sahni_fossils_dna_clocks     (#fig-14-8)
9. c14_sickle_cell_malaria_case     (#fig-14-9)
"""

from html import escape
from figs_core import Fig, figure

ARROW_KIND = {"e": "electron", "p": "proton", "g": "green", "ink": "ink"}


def heading(f: Fig, title: str, sub: str) -> None:
    f.text(320, 22, escape(title), "t b", "middle", 11.4)
    f.text(320, 40, escape(sub), "t m", "middle", 8.8)


def txt(
    f: Fig,
    x: float,
    y: float,
    s: str,
    cls: str = "t",
    size: float = 8.8,
    anchor: str = "middle",
) -> None:
    f.text(x, y, escape(s), cls, anchor, size)


def arr(f: Fig, x1: float, y1: float, x2: float, y2: float, k: str = "ink") -> None:
    f.arrow(x1, y1, x2, y2, ARROW_KIND.get(k, k), width=1.8)


def box(
    f: Fig,
    x: float,
    y: float,
    w: float,
    h: float,
    rows,
    cls: str = "plate",
    size: float = 8.4,
) -> None:
    f.rect(x, y, w, h, cls, rx=8)
    for dy, s, tcls in rows:
        f.text(x + w / 2, y + dy, escape(s), tcls, "middle", size)


# ──────────────────────────────────────────────────────────────────────
# 1. CONTINUOUS VS DISCONTINUOUS VARIATION SPECTRA (#fig-14-1)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_mutation_variation_spectra() -> str:
    f = Fig(
        640,
        590,
        "Continuous vs discontinuous variation distributions, polygenic vs single-gene control, and the four sources of variation",
    )
    heading(
        f,
        "14.1  Continuous vs Discontinuous Variation: Spectra, Categories & Causes",
        "Polygenic + environmental bell curves (height) vs single-gene distinct category bars (ABO blood groups & pea coats)",
    )

    # LEFT PANEL: Continuous Variation (Student Height Histogram + Bell Curve)
    f.rect(16, 54, 296, 360, "wash-e", rx=10)
    txt(f, 164, 74, "1. Continuous Variation (Student Height)", "t b e", 9.4)
    txt(f, 164, 91, "Polygenic (many genes) + environment (nutrition)", "t m", 8.1)

    f.rect(28, 102, 272, 206, "plate", rx=8)
    txt(f, 164, 120, "Distribution of Student Heights (n = 200, Mumbai)", "t b", 8.4)

    # Histogram bars (touching)
    ax_x, ax_y, ax_w, ax_h = 52, 136, 224, 124
    f.line(ax_x, ax_y, ax_x, ax_y + ax_h, "axis")
    f.line(ax_x, ax_y + ax_h, ax_x + ax_w, ax_y + ax_h, "axis")

    bins = [
        ("145", 5, 18),
        ("153", 17, 60),
        ("162", 34, 112),
        ("170", 27, 90),
        ("178", 12, 42),
        ("184", 5, 18),
    ]
    bw = ax_w / len(bins)
    pts = []
    for idx, (lbl, pct, bh) in enumerate(bins):
        bx = ax_x + idx * bw
        by = ax_y + ax_h - bh
        f.rect(bx + 0.5, by, bw - 1, bh, "wash-e", rx=1)
        txt(f, bx + bw / 2, by - 5, f"{pct}%", "t b e", 7.8)
        txt(f, bx + bw / 2, ax_y + ax_h + 13, lbl, "t mono", 7.6)
        pts.append((bx + bw / 2, by))

    path_d = "M " + " L ".join(f"{px:.1f} {py:.1f}" for px, py in pts)
    f.path(path_d, "ln p", extra='fill="none" stroke-width="2.2"')
    txt(f, 164, 294, "Height midpoint (cm) — touching bars + bell curve", "t m", 7.8)

    box(
        f,
        28,
        316,
        272,
        88,
        [
            (20, "Continuous Variation Contract (0610 18.1)", "t b e"),
            (40, "• Range of phenotypes between two extremes", "t"),
            (59, "• Controlled by many genes + environment shift", "t b g"),
            (77, "• Examples: body height, body mass, leaf area", "t m"),
        ],
        "plate",
        8.1,
    )

    # RIGHT PANEL: Discontinuous Variation (ABO Blood Groups)
    f.rect(328, 54, 296, 360, "wash-g", rx=10)
    txt(f, 476, 74, "2. Discontinuous Variation (ABO Blood Groups)", "t b g", 9.4)
    txt(f, 476, 91, "Single gene locus (Iᴬ, Iᴮ, Iᴼ) — genes alone", "t m", 8.1)

    f.rect(340, 102, 272, 206, "plate", rx=8)
    txt(f, 476, 120, "ABO Blood Group Frequencies (Distinct Categories)", "t b", 8.4)

    bx_x, bx_y, bx_w, bx_h = 364, 136, 224, 124
    f.line(bx_x, bx_y, bx_x, bx_y + bx_h, "axis")
    f.line(bx_x, bx_y + bx_h, bx_x + bx_w, bx_y + bx_h, "axis")

    cats = [
        ("Group O", 38, 114, "wash-e"),
        ("Group B", 32, 96, "wash-g"),
        ("Group A", 22, 66, "wash-p"),
        ("Group AB", 8, 26, "plate"),
    ]
    slot = bx_w / len(cats)
    for idx, (lbl, pct, bh, ccls) in enumerate(cats):
        cx = bx_x + idx * slot + 8
        cy = bx_y + bx_h - bh
        f.rect(cx, cy, slot - 16, bh, ccls, rx=3)
        txt(f, cx + (slot - 16) / 2, cy - 5, f"{pct}%", "t b p", 8.0)
        txt(f, cx + (slot - 16) / 2, bx_y + bx_h + 13, lbl, "t b", 7.6)

    txt(f, 476, 294, "Separated category bars (gaps = zero intermediates)", "t m", 7.8)

    box(
        f,
        340,
        316,
        272,
        88,
        [
            (20, "Discontinuous Variation Contract (0610 18.1)", "t b g"),
            (40, "• Distinct categories with NO intermediates", "t"),
            (59, "• Controlled by 1 or a few genes; 0% env shift", "t b p"),
            (77, "• Examples: ABO blood group, pea seed shape/colour", "t m"),
        ],
        "plate",
        8.1,
    )

    # BOTTOM BAR: Four Sources of Variation
    f.rect(16, 424, 608, 152, "wash-p", rx=10)
    txt(f, 320, 444, "3. Four Sources of Genetic & Phenotypic Variation in Populations", "t b p", 9.4)

    sources = [
        ("A. DNA Mutation", "Random base change", "(GAG→GTG in HBB)", "ONLY source of NEW alleles", "wash-p"),
        ("B. Meiosis Shuffle", "Crossing over + 2²³", "(8.4M assortments)", "Reshuffles existing alleles", "wash-e"),
        ("C. Fertilisation", "Random sperm + ovum", "(70.4 trillion zygotes)", "New diploid combinations", "wash-g"),
        ("D. Environment", "Nutrition, light, water", "modify continuous traits", "Non-heritable (not in DNA)", "plate"),
    ]
    for idx, (st, l1, l2, l3, scls) in enumerate(sources):
        sx = 28 + idx * 148
        box(
            f,
            sx,
            456,
            140,
            108,
            [
                (22, st, "t b"),
                (44, l1, "t"),
                (64, l2, "t mono"),
                (88, l3, "t b e"),
            ],
            scls,
            7.8,
        )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 2. SPONTANEOUS GLITCHES, MUTAGENS & LEDERBERG REPLICA PLATING (#fig-14-2)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_mutagens_dna_glitches() -> str:
    f = Fig(
        640,
        590,
        "Spontaneous DNA base substitution (HBB codon 6 GAG to GTG), mutagen rate multipliers, and Lederberg 1952 velveteen replica-plating experiment",
    )
    heading(
        f,
        "14.2  Spontaneous Glitches, Mutagens & the Replica-Plating Proof (1952)",
        "How random DNA base changes invent new alleles and why Lederberg proved mutations precede selection",
    )

    # TOP LEFT: HBB Codon 6 Molecular Glitch
    f.rect(16, 54, 296, 236, "wash-e", rx=10)
    txt(f, 164, 74, "1. Mutation: Random Change in DNA Base Sequence", "t b e", 9.2)

    box(
        f,
        28,
        86,
        272,
        90,
        [
            (20, "Wild-Type Allele (Hbᴬ) — Chromosome 11", "t b e"),
            (40, "DNA coding: CCT GAG GAG  →  mRNA: GAG", "t mono"),
            (59, "Codon 6: Glutamic acid (hydrophilic surface)", "t"),
            (77, "Phenotype: Flexible biconcave red blood cell", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        28,
        186,
        272,
        92,
        [
            (20, "Mutant Allele (Hbˢ) — Single Base Substitution", "t b p"),
            (40, "DNA coding: CCT GTG GAG  →  mRNA: GUG", "t mono"),
            (59, "Codon 6: Valine (hydrophobic sticky patch)", "t"),
            (77, "Polymerase proofreading baseline: ~10⁻⁹ per bp", "t b g"),
        ],
        "wash-p",
        8.0,
    )

    # TOP RIGHT: Mutagen Multipliers
    f.rect(328, 54, 296, 236, "wash-p", rx=10)
    txt(f, 476, 74, "2. Mutagens Raise Rate (Never Direction)", "t b p", 9.2)

    box(
        f,
        340,
        86,
        272,
        192,
        [
            (22, "Mutagen Dose vs Spontaneous Baseline Rate", "t b"),
            (48, "1× Baseline (no mutagen): 1 per 10⁸ divisions", "t b g"),
            (74, "8× UV-B Radiation: thymine dimers (8 / 10⁸)", "t"),
            (100, "20× Chemical Mutagens: tobacco tar / HNO₂", "t b e"),
            (126, "50× Ionising Radiation: X-rays / gamma rays", "t b p"),
            (154, "Rule: Mutagens boost glitch frequency across", "t m"),
            (172, "all loci; they NEVER aim for a useful allele.", "t b"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM PANEL: Lederberg & Lederberg (1952) Velveteen Replica Plating
    f.rect(16, 302, 608, 272, "wash-g", rx=10)
    txt(f, 320, 322, "3. Joshua & Esther Lederberg (1952) Velveteen Replica-Plating Proof", "t b g", 9.4)
    txt(f, 320, 339, "Do antibiotics cause bacteria to mutate, or do resistant mutants already exist before drug contact?", "t m", 8.1)

    box(
        f,
        28,
        352,
        184,
        154,
        [
            (22, "Step 1: Master Agar Plate", "t b e"),
            (42, "(NO Antibiotic Present)", "t b g"),
            (66, "12 bacterial colonies grow on", "t"),
            (84, "plain nutrient agar.", "t"),
            (108, "Colonies C3, C7, C11 carry a", "t b p"),
            (126, "pre-existing random mutation.", "t m"),
        ],
        "plate",
        8.0,
    )

    arr(f, 214, 428, 226, 428, "e")

    box(
        f,
        228,
        352,
        184,
        154,
        [
            (22, "Step 2: Velveteen Stamp", "t b"),
            (42, "(Exact Spatial Imprint)", "t m"),
            (66, "Sterile velveteen block pressed", "t"),
            (84, "onto Master Plate, then stamped", "t"),
            (108, "onto lethal Antibiotic Agar", "t b e"),
            (126, "at identical (x, y) coordinates.", "t m"),
        ],
        "wash-e",
        8.0,
    )

    arr(f, 414, 428, 426, 428, "p")

    box(
        f,
        428,
        352,
        184,
        154,
        [
            (22, "Step 3: Replica Plate", "t b p"),
            (42, "(+ Lethal Antibiotic Agar)", "t b p"),
            (66, "Sensitive colonies lyse; ONLY", "t"),
            (84, "positions C3, C7, C11 survive", "t b g"),
            (108, "at 100% matching coordinates", "t mono"),
            (126, "on every replicate plate.", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        28,
        516,
        584,
        46,
        [
            (18, "Decisive Proof: Picking colony C3 from the antibiotic-free Master Plate yields a 100% resistant culture", "t b p"),
            (35, "without those cells EVER touching penicillin or streptomycin — mutations arise randomly BEFORE selection.", "t"),
        ],
        "wash-p",
        8.1,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 3. SIX-STEP NATURAL SELECTION & PEPPERED MOTHS (#fig-14-3)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_natural_selection_six_steps() -> str:
    f = Fig(
        640,
        595,
        "Cambridge six-step mechanism of natural selection and Bernard Kettlewell Biston betularia industrial melanism and Clean Air reversal",
    )
    heading(
        f,
        "14.3  The Six-Step Engine of Natural Selection & Biston betularia",
        "From pre-existing genetic variation to multi-generation allele shifts in peppered moths",
    )

    # TOP PANEL: 6-Step Causal Chain
    f.rect(16, 54, 608, 252, "wash-e", rx=10)
    txt(f, 320, 74, "1. The Six-Step Causal Chain of Natural Selection (Cambridge 0610 18.3)", "t b e", 9.4)

    steps = [
        ("Step 1: Genetic Variation", "Individuals within a population", "have different alleles (e.g. pale", "typica vs dark carbonaria).", "plate"),
        ("Step 2: Overproduction", "Organisms produce far more", "offspring than scarce food and", "habitat space can support.", "wash-g"),
        ("Step 3: Struggle for Existence", "Individuals compete for resources", "and face predation, disease, and", "climate selection pressures.", "plate"),
        ("Step 4: Differential Survival", "Individuals with adaptive features", "best suited to the environment", "are more likely to survive.", "wash-p"),
        ("Step 5: Reproduction", "Better-adapted survivors breed", "and pass their advantageous", "alleles to their offspring.", "plate"),
        ("Step 6: Allele Frequency Shift", "Across many generations, the", "advantageous allele increases", "in frequency in the population.", "wash-g"),
    ]
    for idx, (st, l1, l2, l3, scls) in enumerate(steps):
        col = idx % 3
        row = idx // 3
        sx = 28 + col * 198
        sy = 86 + row * 106
        box(
            f,
            sx,
            sy,
            188,
            96,
            [
                (20, st, "t b e" if row == 0 else "t b p"),
                (42, l1, "t"),
                (61, l2, "t"),
                (80, l3, "t m"),
            ],
            scls,
            8.0,
        )

    # BOTTOM PANEL: Kettlewell's Peppered Moths (3 Eras)
    f.rect(16, 318, 608, 262, "wash-p", rx=10)
    txt(f, 320, 338, "2. Bernard Kettlewell's Peppered Moths (Biston betularia): Selection & Reversal", "t b p", 9.4)
    txt(f, 320, 355, "Selective agent = visual predation by insectivorous birds (robins, hedge sparrows, great tits)", "t m", 8.1)

    eras = [
        (
            "Era 1: Pre-1848 Rural Woods",
            "Pale lichen-crusted birch bark",
            "typica: 98%  |  carbonaria: 2%",
            "Kettlewell Dorset recapture:",
            "15.8% pale vs 7.4% dark",
            "Pale typica camouflaged",
            "wash-g",
        ),
        (
            "Era 2: 1895–1955 Industrial Soot",
            "SO₂ kills lichens; soot darkens bark",
            "typica: 10%  |  carbonaria: 90%",
            "Kettlewell Birmingham recapture:",
            "13.1% pale vs 27.5% dark",
            "Dark carbonaria camouflaged",
            "plate",
        ),
        (
            "Era 3: Post-1956 Clean Air Act",
            "SO₂ falls; pale lichens recover",
            "typica: 88%  |  carbonaria: 12%",
            "Selection pressure reverses:",
            "birds eat dark morphs again",
            "Pale typica allele rebounds",
            "wash-e",
        ),
    ]
    for idx, (et, bark, freq, r1, r2, verd, ecls) in enumerate(eras):
        ex = 28 + idx * 198
        box(
            f,
            ex,
            368,
            188,
            198,
            [
                (22, et, "t b p" if idx == 1 else "t b e"),
                (42, bark, "t m"),
                (68, freq, "t mono"),
                (98, r1, "t"),
                (118, r2, "t b"),
                (148, verd, "t b g"),
                (174, "No moth chooses its wing colour", "t m"),
            ],
            ecls,
            8.0,
        )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 4. ANTIBIOTIC RESISTANCE SELECTION (#fig-14-4)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_antibiotic_resistance_selection() -> str:
    f = Fig(
        640,
        595,
        "Evolution of antibiotic resistance in bacteria by natural selection and clinical comparison of a completed 7-day course vs stopping on Day 3",
    )
    heading(
        f,
        "14.4  Antibiotic Resistance as Natural Selection in Action",
        "Why stopping antibiotics on Day 3 breeds a resistant relapse while a full course clears infection",
    )

    # TOP PANEL: 4-Stage Antibiotic Selection Mechanism
    f.rect(16, 54, 608, 224, "wash-p", rx=10)
    txt(f, 320, 74, "1. How an Antibiotic Acts as an Environmental Selection Pressure (0610 18.3)", "t b p", 9.4)

    stages = [
        ("1. Pre-Existing Variation", "99% sensitive (wild-type)", "1% random resistant mutant", "(e.g. β-lactamase plasmid)", "BEFORE antibiotic exposure.", "plate"),
        ("2. Antibiotic Applied", "Drug inhibits bacterial cell", "wall or 70S ribosome; lyses", "sensitive bacteria first", "(never viruses).", "wash-e"),
        ("3. Survivors Reproduce", "Freed from competition for", "nutrients & space, resistant", "survivors divide every", "20 min by binary fission.", "plate"),
        ("4. Resistant Population", "Resistance allele passed to", "offspring; entire bacterial", "population is now resistant", "to that antibiotic.", "wash-p"),
    ]
    for idx, (st, l1, l2, l3, l4, scls) in enumerate(stages):
        sx = 28 + idx * 148
        box(
            f,
            sx,
            88,
            140,
            176,
            [
                (22, st, "t b p" if idx in (0, 3) else "t b e"),
                (50, l1, "t"),
                (72, l2, "t b"),
                (94, l3, "t"),
                (118, l4, "t m"),
                (150, f"Stage {idx + 1} / 4", "t mono"),
            ],
            scls,
            7.8,
        )

    # BOTTOM LEFT: Full 7-Day Course
    f.rect(16, 290, 296, 290, "wash-g", rx=10)
    txt(f, 164, 310, "2. Completed 7-Day Antibiotic Course", "t b g", 9.4)
    txt(f, 164, 327, "Sustained dose + host immune phagocytes clear infection", "t m", 8.0)

    box(
        f,
        28,
        340,
        272,
        226,
        [
            (22, "Trajectory Across Steps 0 → 10 (Days 0 → 7)", "t b g"),
            (46, "• Step 0: 100% bacterial load (1.0% resistant)", "t mono"),
            (68, "• Step 3 (Day 3): Load drops to 26%; fever fades", "t"),
            (90, "• Step 6 (Day 5): Load drops to 4.5%; drug kept high", "t"),
            (112, "• Step 10 (Day 7): 0% bacterial load (Cleared)", "t b g"),
            (142, "Why completion works:", "t b e"),
            (164, "Sustained antibiotic pressure + host white blood", "t"),
            (184, "cells (phagocytes & antibodies) eliminate the", "t"),
            (204, "few partially resistant survivors before rebound.", "t m"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM RIGHT: Stopped Early on Day 3
    f.rect(328, 290, 296, 290, "wash-p", rx=10)
    txt(f, 476, 310, "3. Stopped Early on Day 3 (Resistant Relapse)", "t b p", 9.4)
    txt(f, 476, 327, "Symptom relief at Day 3 ≠ bacterial eradication", "t m", 8.0)

    box(
        f,
        340,
        340,
        272,
        226,
        [
            (22, "Trajectory When Pills Stop at Step 3 (Day 3)", "t b p"),
            (46, "• Step 0: 100% bacterial load (1.0% resistant)", "t mono"),
            (68, "• Step 3 (Stopped): Load 26% (21.2% resistant)", "t b p"),
            (90, "• Step 6 (Relapse): Load rebounds to 74% (95% res)", "t"),
            (112, "• Step 10 (Full Relapse): 98% load (99.4% resistant)", "t b p"),
            (142, "Why stopping early is dangerous:", "t b"),
            (164, "Days 1–3 kill sensitive competitors, leaving", "t"),
            (184, "resistant bacteria alive with zero competition to", "t"),
            (204, "multiply into a drug-resistant relapse (e.g. MRSA).", "t m"),
        ],
        "plate",
        8.0,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 5. XEROPHYTE VS HYDROPHYTE ADAPTATIONS (#fig-14-5)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_xerophyte_hydrophyte_adaptations() -> str:
    f = Fig(
        640,
        595,
        "Xerophyte (Ammophila arenaria marram grass and Opuntia cactus) vs hydrophyte (Nymphaea water lily) structural adaptations and leaf metrics",
    )
    heading(
        f,
        "14.5  Adaptive Features of Xerophytes vs Hydrophytes (0610 18.2)",
        "How marram grass and cacti conserve water in arid dunes while water lilies thrive on freshwater ponds",
    )

    # LEFT PANEL: Xerophyte (Marram Grass & Cactus)
    f.rect(16, 54, 296, 344, "wash-p", rx=10)
    txt(f, 164, 74, "1. Xerophyte: Marram Grass & Cactus (Arid)", "t b p", 9.4)
    txt(f, 164, 91, "Selection pressure: Intense heat, wind & dry sand", "t m", 8.1)

    box(
        f,
        28,
        102,
        272,
        282,
        [
            (22, "Four Inherited Water-Conserving Features", "t b p"),
            (46, "1. Thick waxy cuticle (8.5 µm vs 2.2 µm bean):", "t b"),
            (64, "   Waterproof barrier cuts epidermal water loss ~85%.", "t"),
            (90, "2. Sunken stomata in rolled grooves + trichomes:", "t b e"),
            (108, "   C-shaped rolled leaf & hairs trap moist air,", "t"),
            (126, "   lowering ΔΨ water potential gradient.", "t m"),
            (152, "3. Small rolled leaves or cactus spines:", "t b"),
            (170, "   Minimises evaporating surface area; green", "t"),
            (188, "   succulent stem stores water & photosynthesises.", "t m"),
            (214, "4. Deep taproots (3.2 m) + wide surface roots:", "t b g"),
            (232, "   Reaches deep water table and absorbs brief rain.", "t"),
            (260, "Transpiration loss: 1.4 mg/cm²/h (92% conserved)", "t mono"),
        ],
        "plate",
        7.9,
    )

    # RIGHT PANEL: Hydrophyte (Floating Water Lily)
    f.rect(328, 54, 296, 344, "wash-e", rx=10)
    txt(f, 476, 74, "2. Hydrophyte: Floating Water Lily (Aquatic)", "t b e", 9.4)
    txt(f, 476, 91, "Selection pressure: Abundant water, low submerged O₂", "t m", 8.1)

    box(
        f,
        340,
        102,
        272,
        282,
        [
            (22, "Four Inherited Aquatic Adaptive Features", "t b e"),
            (46, "1. Large air spaces (aerenchyma = 58% volume):", "t b g"),
            (64, "   Buoyancy keeps leaf blades sunlit at water surface;", "t"),
            (82, "   forms internal O₂ diffusion highway to roots.", "t m"),
            (108, "2. Stomata on UPPER epidermis only (280/mm²):", "t b e"),
            (126, "   Upper surface contacts air for CO₂/O₂ exchange;", "t"),
            (144, "   lower surface touches water (0 stomata/mm²).", "t m"),
            (170, "3. Very thin or absent waxy cuticle (0.4 µm):", "t b"),
            (188, "   No need to restrict water loss when surrounded", "t"),
            (206, "   by pond water; allows direct gas/ion diffusion.", "t m"),
            (232, "4. Reduced roots (0.25 m) & minimal xylem:", "t b p"),
            (260, "Water supports stems; leaves absorb water directly.", "t mono"),
        ],
        "plate",
        7.9,
    )

    # BOTTOM BAR: Quantitative Comparison Table
    f.rect(16, 410, 608, 170, "wash-g", rx=10)
    txt(f, 320, 430, "3. Quantitative Leaf & Root Comparison Across Three Plant Groups", "t b g", 9.4)

    box(
        f,
        28,
        442,
        584,
        126,
        [
            (20, "Feature                   | Xerophyte (Marram)      | Mesophyte (Bean)       | Hydrophyte (Water Lily)", "t b mono"),
            (44, "Waxy cuticle thickness    | 8.5 µm (very thick)     | 2.2 µm (moderate)      | 0.4 µm (thin / absent)", "t mono"),
            (66, "Stomata (upper / lower)   | 0 / 45 per mm² (sunken) | 40 / 240 per mm²       | 280 / 0 per mm² (upper only)", "t mono"),
            (88, "Internal air space %      | 12% (compact mesophyll) | 25% (spongy mesophyll) | 58% (large aerenchyma)", "t mono"),
            (110, "Root system depth         | 3.2 m deep + dense xylem| 0.8 m branching roots  | 0.25 m feathery; low xylem", "t mono"),
        ],
        "plate",
        7.7,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 6. ANIMAL & PLANT ADAPTIVE FEATURES & FITNESS (#fig-14-6)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_animal_plant_adaptive_features() -> str:
    f = Fig(
        640,
        590,
        "Thar desert camel and Arctic polar bear structural, physiological, and behavioural adaptive features and Cambridge definition of fitness",
    )
    heading(
        f,
        "14.6  Adaptive Features & Fitness Across Contrasting Environments",
        "How inherited structural, physiological & behavioural traits raise survival and reproductive fitness",
    )

    # LEFT PANEL: Thar Desert Camel
    f.rect(16, 54, 296, 266, "wash-p", rx=10)
    txt(f, 164, 74, "1. Thar Desert Dromedary Camel (Hot Arid)", "t b p", 9.4)
    txt(f, 164, 91, "45 °C heat, intense solar radiation, scarce water", "t m", 8.1)

    box(
        f,
        28,
        102,
        272,
        204,
        [
            (22, "Structural, Physiological & Behavioural Suite", "t b p"),
            (46, "• Concentrated urine & dry faeces (physiological):", "t b"),
            (64, "  Long loop of Henle reabsorbs water efficiently.", "t"),
            (88, "• Fat-storing dorsal hump (structural):", "t b e"),
            (106, "  Concentrates energy reserve so rest of skin", "t"),
            (124, "  radiates body heat freely without blubber.", "t m"),
            (148, "• Wide two-toed leathery foot pads (structural):", "t b g"),
            (166, "  Spreads weight (low pressure) on loose sand.", "t"),
            (190, "• Thermal tolerance 34–41 °C reduces sweating loss.", "t mono"),
        ],
        "plate",
        7.9,
    )

    # RIGHT PANEL: Arctic Polar Bear
    f.rect(328, 54, 296, 266, "wash-e", rx=10)
    txt(f, 476, 74, "2. Arctic Polar Bear (Ursus maritimus — Cold)", "t b e", 9.4)
    txt(f, 476, 91, "−40 °C sea ice, icy water swimming, white snow", "t m", 8.1)

    box(
        f,
        340,
        102,
        272,
        204,
        [
            (22, "Heat-Conserving & Hunting Adaptive Suite", "t b e"),
            (46, "• Compact body & small ears (low SA : V ratio):", "t b"),
            (64, "  Minimises exposed surface area per kg body mass.", "t"),
            (88, "• 10 cm subcutaneous blubber + hollow guard hairs:", "t b p"),
            (106, "  Insulates core at 37 °C in icy water & provides", "t"),
            (124, "  white camouflage against snow when stalking seals.", "t m"),
            (148, "• Large rough-papillae paws (structural):", "t b g"),
            (166, "  Snowshoes on thin ice + wide paddles in water.", "t"),
            (190, "• Countercurrent limb heat exchange conserves heat.", "t mono"),
        ],
        "plate",
        7.9,
    )

    # BOTTOM PANEL: Cambridge Definitions of Adaptive Feature & Fitness
    f.rect(16, 332, 608, 244, "wash-g", rx=10)
    txt(f, 320, 352, "3. Cambridge 0610 Definitions: Adaptive Feature (Core) & Fitness (Supplement)", "t b g", 9.4)

    box(
        f,
        28,
        364,
        584,
        82,
        [
            (22, "Exact Syllabus Wording (Topic 18.2.1 & 18.2.3):", "t b e"),
            (44, "• Adaptive feature: An inherited feature that helps an organism to survive and reproduce in its environment.", "t b"),
            (66, "• Fitness: The probability of an organism surviving and reproducing in the environment in which it is found.", "t b p"),
        ],
        "plate",
        8.1,
    )

    chain = [
        ("1. Inherited Alleles", "Passed in gametes", "(never acquired by", "workout or tanning)", "wash-e"),
        ("2. Adaptive Feature", "Matches specific", "environmental", "pressures in habitat", "plate"),
        ("3. Higher Fitness", "Higher probability", "of surviving drought,", "cold, or predators", "wash-p"),
        ("4. Differential Breeding", "Leaves more fertile", "offspring carrying", "those alleles", "plate"),
    ]
    for idx, (ct, l1, l2, l3, ccls) in enumerate(chain):
        cx = 28 + idx * 148
        box(
            f,
            cx,
            458,
            140,
            104,
            [
                (22, ct, "t b"),
                (46, l1, "t"),
                (66, l2, "t m"),
                (86, l3, "t b e"),
            ],
            ccls,
            7.8,
        )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 7. SELECTIVE BREEDING VS NATURAL SELECTION (#fig-14-7)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_selective_breeding_vs_natural() -> str:
    f = Fig(
        640,
        595,
        "Five-step selective breeding cycle, E. K. Janaki Ammal Coimbatore sugarcane and Gir cattle lineages, and six-point comparison with natural selection",
    )
    heading(
        f,
        "14.7  Selective Breeding (Artificial Selection) vs Natural Selection",
        "The 5-step human breeding cycle, Janaki Ammal's Coimbatore sugarcane, and the 6-point contrast",
    )

    # TOP PANEL: 5-Step Selective Breeding Loop
    f.rect(16, 54, 608, 232, "wash-e", rx=10)
    txt(f, 320, 74, "1. The Five-Step Selective Breeding Loop Across Generations (0610 18.3)", "t b e", 9.4)

    b_steps = [
        ("1. Choose Trait", "Human defines", "desirable feature", "(milk, sugar, rust)", "plate"),
        ("2. Select Parents", "Pick individuals", "showing high level", "of that feature", "wash-g"),
        ("3. Cross-Breed", "Breed selected", "parents together", "(controlled cross)", "plate"),
        ("4. Select Offspring", "Measure progeny;", "keep ONLY best", "to breed next", "wash-p"),
        ("5. Repeat ×N Gens", "Repeat over many", "generations until", "trait is amplified", "plate"),
    ]
    for idx, (st, l1, l2, l3, scls) in enumerate(b_steps):
        bx = 28 + idx * 118
        box(
            f,
            bx,
            86,
            110,
            96,
            [
                (20, st, "t b e"),
                (42, l1, "t"),
                (61, l2, "t"),
                (80, l3, "t m"),
            ],
            scls,
            7.7,
        )

    box(
        f,
        28,
        192,
        584,
        82,
        [
            (20, "Landmark Selective Breeding Trajectories (Generation 0 → Generation 40):", "t b p"),
            (40, "• Coimbatore Sugarcane (E. K. Janaki Ammal, Saccharum hybrids): Stalk sucrose 8.5% → 17.8% (+109%)", "t b g"),
            (58, "• Indian Gir & Sahiwal Cattle: Milk yield 1,350 L → 4,200 L (+211%), while heterozygosity drops 0.78 → 0.34", "t"),
            (74, "• Wild Brassica oleracea diverged into cabbage (bud), broccoli (flowers), kale (leaves) & kohlrabi (stem)", "t m"),
        ],
        "plate",
        7.9,
    )

    # BOTTOM PANEL: 6-Point Comparison Table
    f.rect(16, 298, 608, 282, "wash-p", rx=10)
    txt(f, 320, 318, "2. Six-Point Comparison: Natural Selection vs Selective Breeding (Artificial Selection)", "t b p", 9.4)

    box(
        f,
        28,
        330,
        584,
        236,
        [
            (22, "Dimension              | Natural Selection                        | Selective Breeding (Artificial)", "t b mono"),
            (50, "1. Selective agent     | Environment (predators, disease, climate)| Humans (farmers, breeders, scientists)", "t mono"),
            (78, "2. Trait favoured      | Adaptive features aiding wild survival   | Traits useful or profitable to humans", "t mono"),
            (106, "3. Effect on wild fit. | Increases survival fitness in habitat    | May lower wild survival (e.g. heavy udder)", "t mono"),
            (134, "4. Speed of change     | Usually slower over evolutionary eras    | Faster across tens of human generations", "t mono"),
            (162, "5. Genetic diversity   | Maintained higher across wild gene pools | Reduced (inbreeding depression & disease)", "t b p"),
            (190, "6. Classic examples    | Peppered moths, antibiotic resistance    | Coimbatore sugarcane, Gir cattle, wheat", "t mono"),
            (218, "Key Trade-Off: Selective breeding narrows the gene pool, raising homozygosity for deleterious recessives.", "t b e"),
        ],
        "plate",
        7.6,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 8. BIRBAL SAHNI FOSSILS, DNA CLOCKS & THREE DOMAINS (#fig-14-8)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_sahni_fossils_dna_clocks() -> str:
    f = Fig(
        640,
        595,
        "Birbal Sahni Gondwana plant fossils (Pentoxyleae and Glossopteris), Cytochrome c molecular clock, and Carl Woese 1977 three domains",
    )
    heading(
        f,
        "14.8  Fossils, DNA Sequence Clocks & the Tree of Life (0610 1.2 & 18.3)",
        "How Birbal Sahni's Gondwana fossils and modern DNA/amino-acid alignments reconstruct evolution",
    )

    # TOP LEFT: Birbal Sahni & Fossil Strata
    f.rect(16, 54, 296, 256, "wash-p", rx=10)
    txt(f, 164, 74, "1. Birbal Sahni & Gondwana Fossil Strata", "t b p", 9.4)
    txt(f, 164, 91, "Lucknow palaeobotany & chronological rock layers", "t m", 8.0)

    box(
        f,
        28,
        102,
        272,
        196,
        [
            (22, "Stratigraphic Order (Youngest Top → Oldest Deep)", "t b p"),
            (46, "• Cenozoic (66–0 Ma, Deccan Intertrappean beds):", "t b"),
            (64, "  Fossil palms, early angiosperms & mammals.", "t"),
            (88, "• Jurassic (201–145 Ma, Rajmahal Hills, Bihar):", "t b e"),
            (106, "  Birbal Sahni's Pentoxyleae (extinct gymnosperm", "t"),
            (124, "  order bridging seed-ferns and conifers).", "t m"),
            (148, "• Permian (299–252 Ma, Gondwana coal seams):", "t b g"),
            (166, "  Glossopteris flora across India & Antarctica.", "t"),
            (186, "• Deep Cambrian (>500 Ma): simple marine life.", "t mono"),
        ],
        "plate",
        7.9,
    )

    # TOP RIGHT: Molecular Clock (Cytochrome c & HBB)
    f.rect(328, 54, 296, 256, "wash-e", rx=10)
    txt(f, 476, 74, "2. Molecular Clock: Cytochrome c (104 aa)", "t b e", 9.4)
    txt(f, 476, 91, "Fewer sequence differences = more recent ancestor", "t m", 8.0)

    box(
        f,
        340,
        102,
        272,
        196,
        [
            (22, "Comparison with Human (Cyt c / HBB / Split)", "t b e"),
            (48, "• Chimpanzee: 0/104 Cyt c | 0/146 HBB (~6.5 Ma)", "t b g"),
            (72, "  Coding DNA identity = 98.8% (closest relative)", "t m"),
            (96, "• Rhesus Monkey: 1/104 Cyt c | 8/146 HBB (~27 Ma)", "t"),
            (120, "• Domestic Dog: 11/104 Cyt c | 15/146 HBB (~92 Ma)", "t"),
            (144, "• Tuna Fish: 21/104 Cyt c | 68/146 HBB (~430 Ma)", "t b p"),
            (168, "• Baker's Yeast: 45/104 Cyt c diffs (~1,100 Ma)", "t"),
            (186, "Rule: DNA base similarity measures relatedness.", "t mono"),
        ],
        "plate",
        7.9,
    )

    # BOTTOM PANEL: Cladogram & Carl Woese Three Domains
    f.rect(16, 322, 608, 258, "wash-g", rx=10)
    txt(f, 320, 342, "3. Sequence Classification (0610 1.2.5–1.2.6) & Carl Woese's Three Domains (1977)", "t b g", 9.4)

    box(
        f,
        28,
        356,
        282,
        210,
        [
            (22, "Why DNA Beats Morphology Alone (0610 1.2)", "t b e"),
            (46, "• Morphology can mislead via convergent evolution", "t"),
            (64, "  (e.g. shark vs dolphin streamlined fins).", "t m"),
            (90, "• Comparing DNA base sequences & amino acid", "t b g"),
            (108, "  sequences provides quantitative clocks:", "t"),
            (132, "  More similar base sequences = species share a", "t b"),
            (150, "  MORE RECENT common ancestor (cladogram node).", "t b p"),
            (176, "• Greater base differences = longer divergence", "t"),
            (194, "  time as neutral mutations accumulate steadily.", "t m"),
        ],
        "plate",
        7.9,
    )

    box(
        f,
        326,
        356,
        286,
        210,
        [
            (22, "Carl Woese (1977) 16S rRNA Three Domains", "t b p"),
            (46, "Sequencing 16S ribosomal RNA split 'prokaryotes'", "t"),
            (64, "into two evolutionary domains plus Eukarya:", "t m"),
            (90, "1. Bacteria: True bacteria (peptidoglycan walls;", "t b e"),
            (108, "   cyanobacteria, E. coli).", "t"),
            (132, "2. Archaea: Extremophiles & methanogens (no", "t b p"),
            (150, "   peptidoglycan; transcription closer to Eukarya).", "t"),
            (174, "3. Eukarya: Nucleated cells (linked to Lynn", "t b g"),
            (192, "   Margulis's endosymbiotic mitochondria/plastids).", "t m"),
        ],
        "plate",
        7.9,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 9. SICKLE-CELL BALANCING SELECTION IN MALARIA BELTS (#fig-14-9)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_sickle_cell_malaria_case() -> str:
    f = Fig(
        640,
        595,
        "Balancing selection of the sickle-cell allele (HbS) in Plasmodium falciparum malaria belts across East Africa (Allison 1954) and Central/Western India (Sanghvi)",
    )
    heading(
        f,
        "14.9  Balancing Selection: Why the Sickle-Cell Allele (Hbˢ) Persists",
        "Anthony Allison (1954) & L. D. Sanghvi's proof of heterozygote advantage in P. falciparum malaria belts",
    )

    # TOP PANEL: Three Genotypes in a Malaria Belt
    f.rect(16, 54, 608, 250, "wash-p", rx=10)
    txt(f, 320, 74, "1. Opposing Selection Pressures on the Three HBB Genotypes (Chromosome 11)", "t b p", 9.4)

    genos = [
        (
            "1. Normal Homozygote (HbᴬHbᴬ)",
            "100% Normal Haemoglobin A",
            "Flexible biconcave RBCs",
            "• No sickle-cell anaemia",
            "• HIGH susceptibility to lethal",
            "  cerebral P. falciparum malaria",
            "Relative fitness w ≈ 0.85",
            "wash-e",
        ),
        (
            "2. Heterozygous Carrier (HbᴬHbˢ)",
            "~60% HbA + ~40% HbS (Sickle Trait)",
            "Normal at rest; infected cells cleared",
            "• No severe sickle-cell anaemia",
            "• ~60–80% PROTECTED against",
            "  severe P. falciparum malaria",
            "HIGHEST fitness w = 1.00",
            "wash-g",
        ),
        (
            "3. Sickle Homozygote (HbˢHbˢ)",
            "100% Sickle Haemoglobin S",
            "Polymerises at low O₂ into crescents",
            "• Severe sickle-cell anaemia;",
            "  capillary blockage & pain crises",
            "• Strong negative selection",
            "Low wild fitness w ≈ 0.20",
            "plate",
        ),
    ]
    for idx, (gt, l1, l2, l3, l4, l5, w_str, gcls) in enumerate(genos):
        gx = 28 + idx * 198
        box(
            f,
            gx,
            88,
            188,
            202,
            [
                (22, gt, "t b g" if idx == 1 else "t b p"),
                (44, l1, "t b"),
                (64, l2, "t m"),
                (92, l3, "t"),
                (114, l4, "t b e" if idx == 1 else "t"),
                (134, l5, "t"),
                (166, w_str, "t mono"),
                (186, "Favoured by selection" if idx == 1 else "Selected against", "t b"),
            ],
            gcls,
            7.9,
        )

    # BOTTOM LEFT: Geographic Concordance (Allison & Sanghvi)
    f.rect(16, 316, 296, 264, "wash-e", rx=10)
    txt(f, 164, 336, "2. Geographic Concordance (Allison & Sanghvi)", "t b e", 9.2)

    box(
        f,
        28,
        348,
        272,
        218,
        [
            (22, "HbᴬHbˢ Carrier % vs Malaria Endemicity", "t b e"),
            (46, "• Highland / Malaria-Free Zones:", "t b"),
            (64, "  0.8% carriers (q ≈ 0.004) — Hbˢ selected out.", "t m"),
            (90, "• Seasonal / Lowland Fringe:", "t b"),
            (108, "  9.5% carriers (q ≈ 0.050) — moderate balance.", "t m"),
            (134, "• Holoendemic Lake Victoria (Allison 1954):", "t b p"),
            (152, "  26.6% carriers (q ≈ 0.158); parasite rate 28%", "t"),
            (170, "  in HbᴬHbˢ vs 46% in HbᴬHbᴬ children.", "t b g"),
            (196, "• Central & Western India (Sanghvi): 20–24% carriers.", "t mono"),
        ],
        "plate",
        7.8,
    )

    # BOTTOM RIGHT: Volume IV Synthesis Chain
    f.rect(328, 316, 296, 264, "wash-g", rx=10)
    txt(f, 476, 336, "3. Volume IV Synthesis: Base to Evolution", "t b g", 9.2)

    box(
        f,
        340,
        348,
        272,
        218,
        [
            (22, "One Continuous Story Across Chapters 11–14", "t b g"),
            (46, "• Chapter 11 (DNA & Protein Synthesis):", "t b e"),
            (64, "  HBB codon 6 base substitution GAG → GTG (Val⁶).", "t"),
            (90, "• Chapter 12 (Replication & Meiosis):", "t b"),
            (108, "  Copied by DNA polymerase & segregated into gametes.", "t"),
            (134, "• Chapter 13 (Mendelian Inheritance):", "t b p"),
            (152, "  HbᴬHbˢ × HbᴬHbˢ yields 25% HbᴬHbᴬ : 50% HbᴬHbˢ : 25% HbˢHbˢ.", "t"),
            (178, "• Chapter 14 (Natural Selection):", "t b g"),
            (196, "  Balancing selection stabilises q ≈ 15.8% in malaria belts.", "t m"),
        ],
        "plate",
        7.8,
    )

    return f.svg()


FIGS = {
    "c14_mutation_variation_spectra": c14_mutation_variation_spectra,
    "c14_mutagens_dna_glitches": c14_mutagens_dna_glitches,
    "c14_natural_selection_six_steps": c14_natural_selection_six_steps,
    "c14_antibiotic_resistance_selection": c14_antibiotic_resistance_selection,
    "c14_xerophyte_hydrophyte_adaptations": c14_xerophyte_hydrophyte_adaptations,
    "c14_animal_plant_adaptive_features": c14_animal_plant_adaptive_features,
    "c14_selective_breeding_vs_natural": c14_selective_breeding_vs_natural,
    "c14_sahni_fossils_dna_clocks": c14_sahni_fossils_dna_clocks,
    "c14_sickle_cell_malaria_case": c14_sickle_cell_malaria_case,
}
