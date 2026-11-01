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
        "Polygenic + environmental bell curves (height) vs single-gene distinct category bars (ABO blood groups & pea seeds)",
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
            (59, "• Our ABO example is controlled by inherited alleles", "t b p"),
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
            (74, "UV-B radiation: adjacent-base damage", "t"),
            (100, "Chemical mutagens: tobacco tar / HNO₂", "t b e"),
            (126, "Ionising radiation: X-rays / gamma rays", "t b p"),
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
            (18, "Recover and purify resistant cells from an unexposed source; coordinates C3/C7/C11 are illustrative", "t b p"),
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
    f = Fig(640, 560, 'Model steps are not clinical days; no patient or treatment duration is represented')
    heading(f, '14.4  Selection in an Illustrative Bacterial Culture', 'Model steps are not clinical days; no patient or treatment duration is represented')
    box(f, 16, 58, 296, 214, [(23, '1. Inherited variation', 't b e'), (48, 'Start: 990 susceptible + 10 resistant cells.', 't'), (71, 'A mutation or gene transfer supplies variation.', 't'), (94, 'The culture model starts with resistance present.', 't'), (117, 'Changes can also arise during exposure.', 't'), (140, 'The drug does not specify a helpful mutation.', 't')], "plate", 8.1)
    box(f, 328, 58, 296, 214, [(23, '2. Differential survival', 't b e'), (48, 'A worked example: kill 90% of susceptible cells.', 't'), (71, 'Let all 10 resistant cells survive this exposure.', 't'), (94, '99 susceptible + 10 resistant = 109 survivors.', 't'), (117, 'Resistant number: still 10.', 't'), (140, 'Resistant fraction: 1% → about 9.2%.', 't')], "plate", 8.1)
    box(f, 16, 284, 296, 214, [(23, '3. Reproduction changes the next generation', 't b e'), (48, 'Survivors can pass resistance to offspring.', 't'), (71, 'Density and reproductive costs also matter.', 't'), (94, 'The interactive model compares exposure', 't'), (117, 'with drug removal after an illustrative step.', 't'), (140, 'Changing assumptions changes the result.', 't')], "plate", 8.1)
    box(f, 328, 284, 296, 214, [(23, '4. Clinical decisions require clinical evidence', 't b e'), (48, 'Follow the clinician’s dose and duration.', 't'), (71, 'Ask before changing a prescribed treatment.', 't'), (94, 'Unnecessary drug exposure also selects resistance.', 't'), (117, 'Neither longer nor shorter is always best.', 't'), (140, 'Hygiene limits spread of resistant strains.', 't')], "plate", 8.1)
    txt(f, 320, 536, 'Selection changes relative contribution to descendants; these numbers are chosen, not clinical data.', "t m", 8.0)
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 5. XEROPHYTE VS HYDROPHYTE ADAPTATIONS (#fig-14-5)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_xerophyte_hydrophyte_adaptations() -> str:
    f = Fig(640, 560, 'Dry-habitat, floating and submerged leaves require different gas-exchange arrangements')
    heading(f, '14.5  Leaves Solve Different Physical Problems', 'Dry-habitat, floating and submerged leaves require different gas-exchange arrangements')
    box(f, 16, 58, 296, 214, [(23, 'Dry habitat: marram grass', 't b e'), (48, 'Rolled blade shelters inner stomata.', 't'), (71, 'Hairs and grooves retain still, humid air.', 't'), (94, 'A smaller water-vapour gradient slows loss.', 't'), (117, 'A waxy surface restricts epidermal evaporation.', 't'), (140, 'Different xerophytes have different root systems.', 't')], "plate", 8.1)
    box(f, 328, 58, 296, 214, [(23, 'Dry habitat: cactus', 't b e'), (48, 'Spines reduce the area of exposed leaves.', 't'), (71, 'Green succulent stems store water and photosynthesise.', 't'), (94, 'Stem stomata commonly open mainly at night.', 't'), (117, 'CAM stores captured carbon for daylight use.', 't'), (140, 'These are not all features of marram grass.', 't')], "plate", 8.1)
    box(f, 16, 284, 296, 214, [(23, 'Floating water lily: Nymphaea', 't b e'), (48, 'Upper stomata exchange gases with air.', 't'), (71, 'The upper surface can carry water-repellent wax.', 't'), (94, 'Aerenchyma provides buoyancy and gas pathways.', 't'), (117, 'Roots anchor the plant and obtain nutrients.', 't'), (140, 'A floating leaf is not a wholly submerged leaf.', 't')], "plate", 8.1)
    box(f, 328, 284, 296, 214, [(23, 'Fully submerged: Elodea', 't b e'), (48, 'Thin simple leaves exchange dissolved gases.', 't'), (71, 'Submerged leaves have no stomata.', 't'), (94, 'Thin surface barriers shorten diffusion routes.', 't'), (117, 'Water supports flexible shoots.', 't'), (140, 'Internal gas spaces help supply submerged tissues.', 't')], "plate", 8.1)
    txt(f, 320, 536, 'Dimensions and performance in the interactive comparison are invented teaching values, not species constants.', "t m", 8.0)
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
        "Five-step breeding cycle, illustrative invented trajectories, and a comparison with natural selection",
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
            (20, "Illustrative Invented Trajectories (Generation 0 → Generation 40):", "t b p"),
            (40, "• Illustrative sugarcane programme (invented trajectory): Stalk sucrose 8.5% → 17.8% (+109%)", "t b g"),
            (58, "• Illustrative dairy herd: Milk yield 1,350 L → 4,200 L (+211%), while heterozygosity drops 0.78 → 0.34", "t"),
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
            (106, "3. Wild contribution  | Favours more descendants in this setting | Human-desired trait may hinder wild life", "t mono"),
            (134, "4. Speed of change     | Depends on variation and generation time | Depends on selection and generation time", "t mono"),
            (162, "5. Genetic diversity   | Can increase or decrease                 | Small parent pools can reduce diversity", "t b p"),
            (190, "6. Classic examples    | Peppered moths, antibiotic resistance    | Coimbatore sugarcane, Gir cattle, wheat", "t mono"),
            (218, "Related mating can expose harmful recessives; uniformity can separately increase shared disease risk.", "t b e"),
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
    f = Fig(640, 560, 'Fossils and homologous sequences supply evidence; interpretation and uncertainty remain')
    heading(f, '14.8  Reconstructing Evolutionary History', 'Fossils and homologous sequences supply evidence; interpretation and uncertainty remain')
    box(f, 16, 58, 296, 214, [(23, '1. Birbal Sahni and Rajmahal fossils', 't b e'), (48, 'Sahni described Pentoxyleae in 1948.', 't'), (71, 'His original paper called the material Jurassic.', 't'), (94, 'Relevant Rajmahal deposits were later dated', 't'), (117, 'to the Early Cretaceous. Mixed anatomical traits', 't'), (140, 'do not alone establish a direct ancestor.', 't')], "plate", 8.1)
    box(f, 328, 58, 296, 214, [(23, '2. Compare the same inherited sequence', 't b e'), (48, 'Illustrative A: A T G C C T A G', 't'), (71, 'Illustrative B: A T G C C T A A', 't'), (94, 'A and B differ at 1 of 8 aligned positions.', 't'), (117, 'That is 87.5% identity in this short sample.', 't'), (140, 'A close match supports a close relationship.', 't')], "plate", 8.1)
    box(f, 16, 284, 296, 214, [(23, '3. A clock needs calibration', 't b e'), (48, 'Sequence changes accumulate through time.', 't'), (71, 'Rates vary among genes and lineages.', 't'), (94, 'Fossils can constrain minimum ages.', 't'), (117, 'Compare many sequences and allow uncertainty.', 't'), (140, 'Raw similarity is not an automatic stopwatch.', 't')], "plate", 8.1)
    box(f, 328, 284, 296, 214, [(23, '4. Woese and colleagues', 't b e'), (48, '1977: Woese and Fox identify an archaeal lineage.', 't'), (71, '1990: Woese, Kandler and Wheelis propose domains.', 't'), (94, 'Bacteria and Archaea have 16S small-subunit rRNA.', 't'), (117, 'Eukaryotic cytoplasmic ribosomes have 18S rRNA.', 't'), (140, 'Shared RNA sequences help test relationships.', 't')], "plate", 8.1)
    txt(f, 320, 536, 'The sequence widget uses invented alignments; no coding-genome percentages or divergence dates are asserted.', "t m", 8.0)
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 9. SICKLE-CELL BALANCING SELECTION IN MALARIA BELTS (#fig-14-9)
# ──────────────────────────────────────────────────────────────────────
@figure
def c14_sickle_cell_malaria_case() -> str:
    f = Fig(640, 560, 'Hypothetical large random-mating populations: constant fitness, no migration or new mutation')
    heading(f, '14.9  Why Selection Can Maintain the HbS Allele', 'Hypothetical large random-mating populations: constant fitness, no migration or new mutation')
    box(f, 16, 58, 296, 214, [(23, '1. Three genotypes in the malaria model', 't b e'), (48, 'HbAA: predominantly HbA; model w = 0.85.', 't'), (71, 'HbAS: roughly 60:40 HbA:HbS; w = 1.00.', 't'), (94, 'HbSS: predominantly HbS, variable HbF; w = 0.20.', 't'), (117, 'HbSS can cause severe sickle-cell disease.', 't'), (140, 'Values are relative reproductive contributions.', 't')], "plate", 8.1)
    box(f, 328, 58, 296, 214, [(23, '2. Heterozygote advantage', 't b e'), (48, 'One HbS copy can reduce severe-malaria risk.', 't'), (71, 'That is not complete protection from infection.', 't'), (94, 'Parasite prevalence is a different measurement', 't'), (117, 'from severe illness or contribution to offspring.', 't'), (140, 'The model assumes HbAS has the highest fitness.', 't')], "plate", 8.1)
    box(f, 16, 284, 296, 214, [(23, '3. Equilibrium in this model', 't b e'), (48, 'Selection against AA: s = 0.15.', 't'), (71, 'Selection against SS: t = 0.80.', 't'), (94, 'q* = s / (s + t) ≈ 0.1579.', 't'), (117, 'Newborn carrier fraction: 2pq ≈ 26.6%.', 't'), (140, 'This is not a universal district carrier rate.', 't')], "plate", 8.1)
    box(f, 328, 284, 296, 214, [(23, '4. Remove the malaria advantage', 't b e'), (48, 'Now assume wAA = wAS = 1; retain wSS = 0.20.', 't'), (71, 'Starting q = 0.158, after 20 generations:', 't'), (94, 'q ≈ 0.0454; newborn carriers ≈ 8.66%.', 't'), (117, 'HbS copies are sheltered in heterozygotes.', 't'), (140, 'The allele declines but does not rapidly vanish.', 't')], "plate", 8.1)
    txt(f, 320, 536, 'Historical malaria studies motivate the question; these model outputs do not forecast modern patients.', "t m", 8.0)
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
