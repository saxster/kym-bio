"""Chapter 15 original SVG plates — Web of Life & Code Rewritable: Ecology, Nutrient Cycles & Biotechnology.

Nine bespoke figures built on figs_core primitives:
1. c15_food_webs_trophic_pyramids              (#fig-15-1, upgraded by w_ecosystem_trophic_lab.js)
2. c15_energy_budget_sigmoid_growth            (#fig-15-2)
3. c15_carbon_water_cycles                     (#fig-15-3)
4. c15_nitrogen_cycle_legumes                  (#fig-15-4, upgraded by w_nutrient_cycles_eutrophication.js)
5. c15_eutrophication_greenhouse_impacts       (#fig-15-5)
6. c15_deforestation_conservation_sustainability (#fig-15-6)
7. c15_yeast_enzymes_industrial_fermenter      (#fig-15-7)
8. c15_recombinant_plasmid_insulin_crispr      (#fig-15-8, upgraded by w_biotech_fermenter_plasmid_lab.js)
9. c15_mumbai_creek_insulin_case               (#fig-15-9)
"""

from html import escape
from figs_core import Fig, figure

ARROW_KIND = {"e": "electron", "p": "proton", "g": "green", "ink": "ink"}


def heading(f: Fig, title: str, sub: str) -> None:
    f.text(320, 22, escape(title), "t b", "middle", 11.2)
    f.text(320, 40, escape(sub), "t m", "middle", 8.5)


def txt(
    f: Fig,
    x: float,
    y: float,
    s: str,
    cls: str = "t",
    size: float = 8.6,
    anchor: str = "middle",
) -> None:
    f.text(x, y, escape(s), cls, anchor, size)


def arr(f: Fig, x1: float, y1: float, x2: float, y2: float, k: str = "ink") -> None:
    f.arrow(x1, y1, x2, y2, ARROW_KIND.get(k, k), width=1.7)


def box(
    f: Fig,
    x: float,
    y: float,
    w: float,
    h: float,
    rows,
    cls: str = "plate",
    size: float = 8.2,
) -> None:
    f.rect(x, y, w, h, cls, rx=8)
    for dy, s, tcls in rows:
        f.text(x + w / 2, y + dy, escape(s), tcls, "middle", size)


# ──────────────────────────────────────────────────────────────────────
# 1. SGNP FOOD WEB & ECOLOGICAL PYRAMIDS (#fig-15-1)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_food_webs_trophic_pyramids() -> str:
    f = Fig(
        640,
        540,
        "Mumbai SGNP Food Web and Ecological Pyramids of Numbers, Biomass, and Energy",
    )
    heading(
        f,
        "15.1  Food Webs, Trophic Levels & Why Pyramids of Energy Never Invert",
        "Arrows (→) show the direction of energy transfer into the consumer; energy flows one way while matter recycles",
    )

    # LEFT PANEL: SGNP Food Web
    f.rect(16, 54, 296, 470, "wash-g", rx=10)
    txt(f, 164, 74, "1. Sanjay Gandhi National Park (SGNP) Food Web", "t b g", 9.3)
    txt(f, 164, 90, "One-way solar energy flow through four trophic levels", "t m", 8.0)

    # Level 4: Tertiary / Apex Consumer
    box(
        f,
        56,
        102,
        216,
        46,
        [
            (18, "Level 4: Tertiary / Apex Consumer", "t b p"),
            (35, "Snakes / bird-eating raptors", "t"),
        ],
        "plate",
        8.2,
    )

    # Level 3: Secondary Consumers
    box(
        f,
        28,
        176,
        128,
        46,
        [
            (18, "Level 3: Secondary", "t b e"),
            (35, "Frogs & lizards", "t"),
        ],
        "plate",
        8.0,
    )
    box(
        f,
        172,
        176,
        128,
        46,
        [
            (18, "Level 3: Secondary", "t b e"),
            (35, "Insect-eating birds", "t"),
        ],
        "plate",
        8.0,
    )

    # Level 2: Primary Consumers (Herbivores)
    box(
        f,
        28,
        250,
        128,
        46,
        [
            (18, "Level 2: Herbivore", "t b g"),
            (35, "Caterpillars & plant bugs", "t"),
        ],
        "plate",
        8.0,
    )
    box(
        f,
        172,
        250,
        128,
        46,
        [
            (18, "Level 2: Herbivore", "t b g"),
            (35, "Grasshoppers & beetles", "t"),
        ],
        "plate",
        8.0,
    )

    # Level 1: Producers
    box(
        f,
        28,
        324,
        272,
        50,
        [
            (18, "Level 1: Producers (Photosynthetic Plants)", "t b g"),
            (36, "Karvi shrubs, grasses & Banyan figs (fix CO₂)", "t"),
        ],
        "plate",
        8.2,
    )

    # Principal Energy Input (Sun) & Decomposers
    box(
        f,
        28,
        402,
        128,
        56,
        [
            (18, "Energy Source: Sun", "t b p"),
            (35, "Light trapped by", "t"),
            (49, "chlorophyll (19.1)", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        172,
        402,
        128,
        56,
        [
            (18, "Decomposers", "t b e"),
            (35, "Fungi & bacteria", "t"),
            (49, "recycle dead matter", "t m"),
        ],
        "plate",
        7.9,
    )

    box(
        f,
        28,
        468,
        272,
        46,
        [
            (18, "Exam Rule: Food Chain Arrow Meaning (0610 19.2)", "t b"),
            (35, "Grass → Deer → Leopard means energy transfers that way", "t m"),
        ],
        "plate",
        7.9,
    )

    # Energy transfer arrows
    arr(f, 92, 400, 92, 376, "p")
    arr(f, 92, 322, 92, 298, "g")
    arr(f, 236, 322, 236, 298, "g")
    arr(f, 92, 248, 92, 224, "e")
    arr(f, 236, 248, 236, 224, "e")
    arr(f, 108, 174, 142, 150, "p")
    arr(f, 220, 174, 186, 150, "p")
    arr(f, 236, 376, 236, 400, "e")

    # RIGHT PANEL: Three Ecological Pyramids for One Giant Banyan Tree
    f.rect(328, 54, 296, 470, "wash-e", rx=10)
    txt(f, 476, 74, "2. One Giant Banyan Tree: Three Pyramids", "t b e", 9.3)
    txt(f, 476, 90, "Illustrative counts, dry biomass and annual production", "t m", 8.0)

    # Sub-card 1: Pyramid of Numbers (Inverted at base)
    f.rect(340, 102, 272, 128, "plate", rx=8)
    txt(f, 476, 118, "A. Pyramid of Numbers (Inverted at Base)", "t b p", 8.4)
    f.rect(462, 128, 28, 16, "wash-p", rx=2)
    txt(f, 476, 139, "L4: 6 bird-eating predators", "t", 7.6)
    f.rect(436, 148, 80, 16, "wash-e", rx=2)
    txt(f, 476, 159, "L3: 350 insect-eating birds", "t", 7.6)
    f.rect(366, 168, 220, 16, "wash-g", rx=2)
    txt(f, 476, 179, "L2: 8,000 caterpillars", "t b", 7.6)
    f.rect(466, 188, 20, 16, "wash-g", rx=2)
    txt(f, 476, 218, "L1: 1 giant banyan tree (1 individual < 8,000 insects)", "t b g", 7.6)

    # Sub-card 2: Pyramid of Biomass (Dry mass at a single moment)
    f.rect(340, 240, 272, 128, "plate", rx=8)
    txt(f, 476, 256, "B. Pyramid of Biomass (Dry Mass: Upright on Land)", "t b g", 8.4)
    f.rect(464, 266, 24, 16, "wash-p", rx=2)
    txt(f, 476, 277, "L4: 1.2 kg dry mass", "t", 7.6)
    f.rect(444, 286, 64, 16, "wash-e", rx=2)
    txt(f, 476, 297, "L3: 12 kg dry mass", "t", 7.6)
    f.rect(412, 306, 128, 16, "wash-g", rx=2)
    txt(f, 476, 317, "L2: 120 kg dry mass", "t", 7.6)
    f.rect(356, 326, 240, 18, "wash-g", rx=2)
    txt(f, 476, 338, "L1: 4,500 kg dry trunk, root & leaf mass", "t b g", 7.6)
    txt(f, 476, 358, "Eliminates size distortion by weighing dry biological matter", "t m", 7.5)

    # Sub-card 3: Pyramid of Energy (Always upright without exception)
    f.rect(340, 378, 272, 136, "plate", rx=8)
    txt(f, 476, 394, "C. Energy: Same Area, Period and Food-Source Boundary", "t b e", 8.4)
    f.rect(466, 404, 20, 16, "wash-p", rx=2)
    txt(f, 476, 415, "L4: 45 kJ m⁻² yr⁻¹", "t", 7.6)
    f.rect(446, 424, 60, 16, "wash-e", rx=2)
    txt(f, 476, 435, "L3: 450 kJ m⁻² yr⁻¹", "t", 7.6)
    f.rect(416, 444, 120, 16, "wash-g", rx=2)
    txt(f, 476, 455, "L2: 4,500 kJ m⁻² yr⁻¹", "t", 7.6)
    f.rect(354, 464, 244, 18, "wash-g", rx=2)
    txt(f, 476, 476, "L1: 45,000 kJ m⁻² yr⁻¹ captured by photosynthesis", "t b g", 7.6)
    txt(f, 476, 498, "10% production transfer assumed; efficiencies vary", "t b p", 7.6)

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 2. 10% ENERGY BUDGET, DIET EFFICIENCY & SIGMOID CURVE (#fig-15-2)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_energy_budget_sigmoid_growth() -> str:
    f = Fig(
        640,
        540,
        "The 90% Trophic Energy Loss Budget, Crop vs Livestock Human Diet Efficiency, and 4-Phase Sigmoid Population Curve",
    )
    heading(
        f,
        "15.2  Energy Budgets, Crop Food Routes & Batch Growth",
        "Why food chains rarely exceed 4–5 levels and how environmental limiting factors create S-shaped population curves",
    )

    # LEFT PANEL: 90% Energy Loss Partition & Crop vs Livestock Diet Efficiency
    f.rect(16, 54, 296, 470, "wash-p", rx=10)
    txt(f, 164, 74, "1. Example: 10% New-Biomass Transfer", "t b p", 9.1)
    txt(f, 164, 90, "Start: 1,000 kJ production in the lower feeding level", "t m", 8.0)

    box(
        f,
        28,
        102,
        272,
        154,
        [
            (20, "Illustrative shares: not a universal measured partition", "t b p"),
            (42, "1. Respiration transfers energy as heat (~540 kJ).", "t b"),
            (58, "   Movement, active transport & body temperature", "t m"),
            (78, "2. Egested faeces retain chemical energy (~220 kJ).", "t b"),
            (94, "   Cellulose cell walls, lignin, bone & fur (Ch 7)", "t m"),
            (114, "3. Excreted waste retains chemical energy (~70 kJ).", "t b"),
            (132, "4. Uneaten parts (~70 kJ) can feed decomposers.", "t b"),
            (148, "Result: Only ~100 kJ (10%) becomes new biomass", "t b g"),
        ],
        "plate",
        7.9,
    )

    txt(f, 164, 276, "2. Same Crop Harvest, Two Food-Supply Routes", "t b g", 9.1)

    box(
        f,
        28,
        288,
        272,
        106,
        [
            (20, "Direct Route: Food Supplied Before Human Digestion", "t b g"),
            (40, "Edible crops (10,000 kJ) → Food supply (10,000 kJ)", "t b"),
            (60, "• Eliminates intermediate livestock trophic step", "t"),
            (78, "• No livestock feed-conversion loss in this route", "t b g"),
            (95, "• Actual land needs depend on the farming system", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        28,
        404,
        272,
        108,
        [
            (20, "Livestock Route: Assume 10% Feed-to-Edible Food", "t b p"),
            (40, "Crops (10,000 kJ) → Animal food (1,000 kJ)", "t b"),
            (60, "• Remaining energy: maintenance, heat, waste, other tissue", "t"),
            (78, "• This example has 10× less food energy supplied.", "t b p"),
            (95, "  It is not a universal people-per-hectare estimate.", "t m"),
        ],
        "plate",
        8.0,
    )

    # RIGHT PANEL: 4-Phase Sigmoid (S-Shaped) Population Curve
    f.rect(328, 54, 296, 470, "wash-e", rx=10)
    txt(f, 476, 74, "3. Sigmoid (S-Shaped) Population Growth Curve", "t b e", 9.2)
    txt(f, 476, 90, "Yeast or bacteria growing in a closed vessel (0610 19.4)", "t m", 8.0)

    # Graph plate
    f.rect(340, 102, 272, 206, "plate", rx=8)
    txt(f, 476, 118, "Population Size (N) Across Four Phases", "t b", 8.3)

    gx, gy, gw, gh = 368, 134, 228, 144
    f.line(gx, gy, gx, gy + gh, "axis")
    f.line(gx, gy + gh, gx + gw, gy + gh, "axis")

    # Carrying capacity K line
    f.line(gx, gy + 34, gx + gw, gy + 34, "dash")
    txt(f, gx + 148, gy + 128, "Carrying capacity (K): B = D", "t b g", 7.3)

    # Vertical phase dividers
    f.line(gx + 46, gy, gx + 46, gy + gh, "dash")
    f.line(gx + 114, gy, gx + 114, gy + gh, "dash")
    f.line(gx + 178, gy, gx + 178, gy + gh, "dash")

    txt(f, gx + 23, gy + 13, "1. Lag", "t b e", 7.5)
    txt(f, gx + 80, gy + 13, "2. Log", "t b g", 7.5)
    txt(f, gx + 146, gy + 13, "3. Stat.", "t b", 7.5)
    txt(f, gx + 203, gy + 13, "4. Death", "t b p", 7.5)

    # Sigmoid + Death curve (explicit fill="none")
    f.path(
        f"M {gx + 4} {gy + gh - 8} "
        f"C {gx + 22} {gy + gh - 9}, {gx + 34} {gy + gh - 14}, {gx + 46} {gy + gh - 22} "
        f"C {gx + 68} {gy + gh - 45}, {gx + 90} {gy + 48}, {gx + 114} {gy + 36} "
        f"C {gx + 136} {gy + 34}, {gx + 156} {gy + 34}, {gx + 178} {gy + 36} "
        f"C {gx + 194} {gy + 46}, {gx + 210} {gy + 82}, {gx + 224} {gy + 104}",
        "ln e",
        extra='fill="none" stroke-width="2.4"',
    )

    txt(f, gx + gw / 2, gy + gh + 16, "Time (hours) — food supply, competition, predation & disease", "t m", 7.6)

    box(
        f,
        340,
        318,
        272,
        194,
        [
            (20, "Four Phases of the Sigmoid Curve (0610 19.4)", "t b e"),
            (42, "1. Lag phase (birth rate low, N small):", "t b"),
            (58, "   Few individuals present; cells inducing enzymes.", "t m"),
            (78, "2. Exponential (log) phase (birth rate ≫ death rate):", "t b g"),
            (94, "   Resource limitation is initially weak.", "t m"),
            (114, "3. Stationary phase (birth rate = death rate at K):", "t b"),
            (130, "   Limiting factors (food scarcity, competition,", "t m"),
            (145, "   predators, disease, toxins) cap population at K.", "t m"),
            (165, "4. Death phase (death rate > birth rate):", "t b p"),
            (181, "   Nutrients exhausted & toxic waste kills cells.", "t m"),
        ],
        "plate",
        7.8,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 3. THE WATER & CARBON CYCLES + KEELING CURVE (#fig-15-3)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_carbon_water_cycles() -> str:
    f = Fig(
        640,
        540,
        "The Water Cycle, Carbon Cycle, and Charles David Keeling Mauna Loa CO2 Record",
    )
    heading(
        f,
        "15.3  Atoms on Loan: The Water Cycle, Carbon Cycle & Keeling's CO₂ Record",
        "Photosynthesis fixes carbon in sunlit ecosystems; respiration, decomposition and combustion return CO₂",
    )

    # LEFT PANEL: Water Cycle (Mumbai Arabian Sea to SGNP Hills)
    f.rect(16, 54, 296, 470, "wash-e", rx=10)
    txt(f, 164, 74, "1. The Water Cycle (Linked Model)", "t b e", 9.3)
    txt(f, 164, 90, "Arabian Sea evaporation to Western Ghats monsoon rain", "t m", 8.0)

    box(
        f,
        28,
        104,
        128,
        58,
        [
            (18, "2. Condensation", "t b e"),
            (36, "Rising water vapour", "t"),
            (50, "cools into clouds", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        172,
        104,
        128,
        58,
        [
            (18, "3. Precipitation", "t b e"),
            (36, "Monsoon rain falls", "t"),
            (50, "on hills & forests", "t m"),
        ],
        "plate",
        7.9,
    )

    box(
        f,
        28,
        196,
        128,
        62,
        [
            (18, "1. Evaporation", "t b p"),
            (36, "Solar heat turns sea", "t"),
            (50, "liquid H₂O → vapour", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        172,
        196,
        128,
        62,
        [
            (18, "4. Transpiration", "t b g"),
            (36, "Leaf mesophyll H₂O", "t"),
            (50, "exits via stomata", "t m"),
        ],
        "plate",
        7.9,
    )

    box(
        f,
        28,
        292,
        272,
        58,
        [
            (18, "5. Surface Runoff, Percolation & Sea Return", "t b e"),
            (36, "Root uptake into xylem (Ch 5) vs river runoff", "t"),
            (50, "(Mithi & Ulhas rivers) returning H₂O to the sea", "t m"),
        ],
        "plate",
        8.0,
    )

    arr(f, 92, 194, 92, 164, "p")
    arr(f, 158, 133, 170, 133, "e")
    arr(f, 236, 164, 236, 194, "e")
    arr(f, 196, 194, 134, 164, "g")
    arr(f, 236, 260, 236, 290, "e")
    arr(f, 92, 290, 92, 260, "p")

    box(
        f,
        28,
        366,
        272,
        146,
        [
            (22, "Four Core Water Cycle Processes (0610 19.3)", "t b e"),
            (44, "• Evaporation: Sun heats liquid water → water vapour.", "t"),
            (66, "• Transpiration: Evaporation from leaf mesophyll cells", "t"),
            (82, "  followed by diffusion of water vapour through stomata.", "t m"),
            (104, "• Condensation: Cooling water vapour forms cloud droplets.", "t"),
            (126, "• Precipitation: Water falls as rain, snow, or hail.", "t"),
        ],
        "plate",
        7.9,
    )

    # RIGHT PANEL: Carbon Cycle & Keeling Curve
    f.rect(328, 54, 296, 470, "wash-g", rx=10)
    txt(f, 476, 74, "2. The Carbon Cycle & Keeling Curve (0610 19.3)", "t b g", 9.3)
    txt(f, 476, 90, "Photosynthesis, respiration, feeding, decay & combustion", "t m", 8.0)

    box(
        f,
        356,
        102,
        240,
        46,
        [
            (18, "Atmospheric Carbon Dioxide (CO₂)", "t b p"),
            (35, "~0.04% of air (315 ppm in 1958 → 426 ppm today)", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        340,
        176,
        128,
        58,
        [
            (18, "Producers (Plants)", "t b g"),
            (35, "Photosynthesis fixes", "t"),
            (49, "CO₂ → C₆H₁₂O₆", "t b g"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        480,
        176,
        112,
        58,
        [
            (18, "Consumers", "t b e"),
            (35, "Feeding takes C;", "t"),
            (49, "respiration → CO₂", "t m"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        340,
        262,
        128,
        58,
        [
            (18, "Decomposers", "t b"),
            (35, "Fungi & bacteria decay", "t"),
            (49, "dead matter → CO₂", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        484,
        262,
        128,
        58,
        [
            (18, "Fossil Fuels", "t b p"),
            (35, "Fossilisation of C;", "t"),
            (49, "Combustion → CO₂", "t b p"),
        ],
        "plate",
        7.9,
    )

    arr(f, 412, 150, 404, 174, "g")
    arr(f, 434, 174, 442, 150, "p")
    arr(f, 470, 205, 478, 205, "g")
    arr(f, 536, 174, 520, 150, "p")
    arr(f, 404, 236, 404, 260, "e")
    arr(f, 470, 291, 482, 291, "p")
    arr(f, 604, 260, 592, 150, "p")

    # Keeling curve mini-plate
    f.rect(340, 336, 272, 176, "plate", rx=8)
    txt(f, 476, 354, "Keeling's Mauna Loa CO₂ Curve (1958–2026)", "t b", 8.3)

    kx, ky, kw, kh = 374, 368, 218, 92
    f.line(kx, ky, kx, ky + kh, "axis")
    f.line(kx, ky + kh, kx + kw, ky + kh, "axis")

    f.path(
        f"M {kx + 6} {ky + kh - 12} "
        f"L {kx + 20} {ky + kh - 20} L {kx + 30} {ky + kh - 14} "
        f"L {kx + 48} {ky + kh - 28} L {kx + 58} {ky + kh - 22} "
        f"L {kx + 78} {ky + kh - 38} L {kx + 88} {ky + kh - 31} "
        f"L {kx + 110} {ky + kh - 50} L {kx + 120} {ky + kh - 43} "
        f"L {kx + 144} {ky + kh - 64} L {kx + 154} {ky + kh - 57} "
        f"L {kx + 178} {ky + kh - 76} L {kx + 188} {ky + kh - 69} "
        f"L {kx + 210} {ky + kh - 84}",
        "ln p",
        extra='fill="none" stroke-width="2.2"',
    )

    txt(f, kx + 28, ky + kh + 14, "1958 (315 ppm)", "t m", 7.4)
    txt(f, kx + 184, ky + kh + 14, "2026 (426 ppm)", "t b p", 7.4)
    txt(f, 476, 490, "Sawtooth wave: seasonal forest photosynthesis vs respiration", "t m", 7.5)
    txt(f, 476, 504, "Upward slope: fossil-fuel combustion + deforestation", "t b p", 7.5)

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 4. THE NITROGEN CYCLE & LEGUME ROOT NODULES (#fig-15-4)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_nitrogen_cycle_legumes() -> str:
    f = Fig(
        640,
        540,
        "The Nitrogen Cycle: Nitrogen Fixation, Ammonification, Nitrification, Denitrification, and Legume Root Nodules",
    )
    heading(
        f,
        "15.4  The Nitrogen Cycle: Four Bacterial Guilds Unlocking Atmospheric N₂",
        "Plants cannot fix N₂ gas through leaves; they absorb soil NO₃⁻ via active transport or partner with Rhizobium in root nodules",
    )

    # Top Center Hub: Atmospheric N2
    box(
        f,
        176,
        56,
        288,
        50,
        [
            (19, "Atmospheric Nitrogen Gas (N₂ — 78% of Air)", "t b e"),
            (37, "Strong N≡N triple covalent bond; inert to plants & animals", "t m"),
        ],
        "wash-e",
        8.3,
    )

    # Row 2: Fixation (Left), Plant/Animal Assimilation & Deamination (Center), Denitrification (Right)
    box(
        f,
        16,
        132,
        192,
        132,
        [
            (20, "1. Nitrogen Fixation", "t b g"),
            (38, "(N₂ Gas → NH₄⁺ / NO₃⁻)", "t b"),
            (58, "• Rhizobium bacteria inside", "t"),
            (73, "  legume root nodules (peas,", "t m"),
            (88, "  beans, chana, methi)", "t m"),
            (105, "• Free-living soil Azotobacter", "t"),
            (121, "• Lightning (N₂ + O₂ → NO₃⁻)", "t"),
        ],
        "wash-g",
        7.9,
    )

    box(
        f,
        224,
        132,
        192,
        132,
        [
            (20, "2. Uptake & Feeding", "t b e"),
            (38, "(NO₃⁻ → Proteins → Urea)", "t b"),
            (58, "• Root hair cells absorb NO₃⁻", "t"),
            (73, "  by active transport (Ch 3)", "t m"),
            (88, "• Plants make amino acids", "t"),
            (105, "• Animals feed & digest;", "t"),
            (121, "  liver deamination → urea", "t b p"),
        ],
        "plate",
        7.9,
    )

    box(
        f,
        432,
        132,
        192,
        132,
        [
            (20, "5. Denitrification", "t b p"),
            (38, "(NO₃⁻ → N₂ Gas Escape)", "t b"),
            (58, "• Denitrifying bacteria", "t"),
            (73, "  (Pseudomonas) in anaerobic,", "t m"),
            (88, "  waterlogged soils lacking O₂", "t m"),
            (105, "• Respire using NO₃⁻, turning", "t"),
            (121, "  nitrate back into N₂ gas", "t b p"),
        ],
        "wash-p",
        7.9,
    )

    # Row 3: Decomposition / Ammonification (Left) & Two-Step Nitrification (Right)
    box(
        f,
        16,
        290,
        208,
        112,
        [
            (20, "3. Decomposition (Ammonification)", "t b"),
            (40, "(Proteins & Urea → NH₄⁺ / NH₃)", "t b e"),
            (60, "• Saprotrophic fungi & putrefying", "t"),
            (76, "  bacteria digest dead organisms,", "t m"),
            (92, "  egested faeces, and excreted urea", "t m"),
            (106, "• Release ammonium ions (NH₄⁺)", "t b"),
        ],
        "plate",
        7.9,
    )

    f.rect(240, 290, 384, 112, "wash-g", rx=8)
    txt(f, 432, 310, "4. Nitrification in Well-Aerated Soil (Aerobic Nitrifying Bacteria)", "t b g", 8.6)
    txt(f, 432, 326, "Requires dissolved oxygen (O₂) in drained, ploughed soil air spaces", "t m", 7.8)

    box(
        f,
        252,
        338,
        104,
        52,
        [
            (20, "Ammonium", "t b"),
            (38, "Ions (NH₄⁺)", "t b e"),
        ],
        "plate",
        8.0,
    )
    box(
        f,
        380,
        338,
        104,
        52,
        [
            (20, "Nitrite Ions", "t b"),
            (38, "(NO₂⁻)", "t b g"),
        ],
        "plate",
        8.0,
    )
    box(
        f,
        508,
        338,
        104,
        52,
        [
            (20, "Nitrate Ions", "t b g"),
            (38, "(NO₃⁻)", "t b g"),
        ],
        "plate",
        8.0,
    )

    arr(f, 358, 364, 378, 364, "g")
    arr(f, 486, 364, 506, 364, "g")

    # Cycle arrows connecting boxes
    arr(f, 190, 106, 128, 130, "g")
    arr(f, 528, 130, 450, 106, "p")
    arr(f, 210, 198, 222, 198, "g")
    arr(f, 224, 266, 180, 288, "e")
    arr(f, 226, 364, 250, 364, "e")
    arr(f, 360, 288, 360, 266, "g")
    arr(f, 528, 288, 528, 266, "p")

    # Bottom Banner: Legume Root Nodule Symbiosis & Crop Rotation
    box(
        f,
        16,
        418,
        608,
        106,
        [
            (20, "Inside a Legume Root Nodule (Methi / Chickpea) & Why Farmers Rotate Crops", "t b g"),
            (42, "• Mutualism: The legume supplies carbohydrates from photosynthesis and pink leghaemoglobin (which scavenges free O₂", "t"),
            (58, "  so bacterial nitrogenase is not inactivated); Rhizobium fixes N₂ into ammonium/amino acids for the plant.", "t"),
            (78, "• Why farmers plough & drain fields: Introduces O₂ for aerobic nitrifying bacteria (NH₄⁺ → NO₂⁻ → NO₃⁻) and root hair", "t b e"),
            (94, "  active transport while inhibiting anaerobic denitrifying bacteria so soil nitrate fertility is preserved.", "t m"),
        ],
        "plate",
        7.9,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 5. EUTROPHICATION CASCADE, PLASTICS & GREENHOUSE EFFECT (#fig-15-5)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_eutrophication_greenhouse_impacts() -> str:
    f = Fig(
        640,
        540,
        "Seven-Step Eutrophication Cascade, River Dissolved Oxygen Sag Curve, Non-Biodegradable Plastics, and Enhanced Greenhouse Effect",
    )
    heading(
        f,
        "15.5  Eutrophication, Non-Biodegradable Plastics & The Greenhouse Blanket",
        "Why leached nitrates and untreated sewage suffocate fish via bacterial respiration, and how CO₂ and CH₄ warm the planet",
    )

    # LEFT PANEL: 7-Step Eutrophication Cascade & DO Sag Curve
    f.rect(16, 54, 304, 470, "wash-p", rx=10)
    txt(f, 168, 74, "1. Seven-Step Eutrophication Cascade (0610 20.3)", "t b p", 9.1)
    txt(f, 168, 90, "Leached NO₃⁻ fertilisers or untreated sewage in lakes", "t m", 7.9)

    steps = [
        ("1. Excess NO₃⁻ / sewage enters water", "Increases mineral ion availability in lake/river", "t b e"),
        ("2. Rapid growth of surface algae (bloom)", "Producers multiply across water surface", "t b g"),
        ("3. Algal bloom blocks sunlight below", "Submerged aquatic plants cannot photosynthesise", "t b"),
        ("4. Submerged plants & surface algae die", "Sinking dead organic detritus accumulates", "t b"),
        ("5. Aerobic decomposer bacteria multiply", "Feed on dead organic matter & respire aerobically", "t b p"),
        ("6. Dissolved oxygen (O₂) crashes", "Bacterial respiration strips O₂ from water (high BOD)", "t b p"),
        ("7. Aerobic fish & invertebrates suffocate", "Death of aquatic animals collapses the food web", "t b p"),
    ]

    sy = 100
    for title, sub, tcls in steps:
        f.rect(28, sy, 280, 36, "plate", rx=5)
        txt(f, 168, sy + 14, title, tcls, 7.9)
        txt(f, 168, sy + 28, sub, "t m", 7.3)
        sy += 40

    # Mini Oxygen Sag vs BOD Graph
    f.rect(28, 384, 280, 128, "plate", rx=8)
    txt(f, 168, 398, "Downstream Oxygen Sag: Dissolved O₂ vs BOD", "t b", 8.0)
    txt(f, 102, 412, "— Dissolved O₂ (sags)", "t b e", 7.2)
    txt(f, 234, 412, "-- Bacterial BOD (spikes)", "t b p", 7.2)
    ox, oy, ow, oh = 52, 420, 236, 66
    f.line(ox, oy, ox, oy + oh, "axis")
    f.line(ox, oy + oh, ox + ow, oy + oh, "axis")

    # Dissolved O2 curve (drops then recovers; fill="none")
    f.path(
        f"M {ox + 4} {oy + 10} C {ox + 42} {oy + 12}, {ox + 68} {oy + 58}, {ox + 110} {oy + 60} "
        f"C {ox + 158} {oy + 60}, {ox + 195} {oy + 22}, {ox + 228} {oy + 12}",
        "ln e",
        extra='fill="none" stroke-width="2.2"',
    )
    # Bacterial BOD curve (spikes then falls; fill="none")
    f.path(
        f"M {ox + 4} {oy + 58} C {ox + 42} {oy + 54}, {ox + 68} {oy + 10}, {ox + 104} {oy + 10} "
        f"C {ox + 154} {oy + 12}, {ox + 190} {oy + 50}, {ox + 228} {oy + 58}",
        "ln p",
        extra='fill="none" stroke-width="2.0" stroke-dasharray="4,3"',
    )
    txt(f, 168, 502, "Distance downstream from sewage / fertiliser runoff", "t m", 7.4)

    # RIGHT PANEL: Enhanced Greenhouse Effect & Non-Biodegradable Plastics
    f.rect(332, 54, 292, 470, "wash-e", rx=10)
    txt(f, 478, 74, "2. Enhanced Greenhouse Effect (CO₂ & CH₄)", "t b e", 9.1)
    txt(f, 478, 90, "Long-wave infrared radiation trapped by greenhouse gases", "t m", 7.9)

    box(
        f,
        344,
        100,
        268,
        178,
        [
            (20, "How CO₂ and CH₄ Drive Climate Change (0610 20.3)", "t b p"),
            (40, "1. Short-wave solar radiation warms Earth's surface.", "t"),
            (58, "2. Earth re-emits long-wave infrared thermal radiation.", "t"),
            (76, "3. Atmospheric CO₂ & CH₄ absorb and re-radiate infrared", "t b p"),
            (92, "   back toward Earth → enhanced greenhouse effect.", "t m"),
            (114, "• Carbon dioxide (CO₂) sources: fossil-fuel combustion", "t b"),
            (130, "  (coal, oil, gas) and clearing/burning forests.", "t m"),
            (150, "• Methane (CH₄) sources: cattle/livestock digestion,", "t b"),
            (166, "  waterlogged anaerobic rice paddies & landfill decay.", "t m"),
        ],
        "plate",
        7.8,
    )

    txt(f, 478, 298, "3. Persistent Plastics & Food-Web Pollutants", "t b g", 9.1)

    box(
        f,
        344,
        310,
        268,
        202,
        [
            (20, "Plastic Harm and Persistent Chemicals", "t b g"),
            (42, "• Many common plastics resist breakdown under", "t"),
            (58, "  ordinary environmental conditions; polymers differ.", "t m"),
            (78, "• Marine & terrestrial harm (Carter Road / creeks):", "t b"),
            (94, "  1. Ingestion: Turtles mistake bags for jellyfish; stomachs", "t"),
            (110, "     fill with indigestible plastic, causing starvation.", "t m"),
            (128, "  2. Entanglement: Ghost nets trap marine mammals/birds,", "t"),
            (144, "     causing drowning, suffocation, or lacerations.", "t m"),
            (164, "  3. Microplastic ingestion/transfer need not mean", "t b p"),
            (180, "     biomagnification. DDT/DDE provide a clearer", "t"),
            (194, "     example of concentration increasing up a food chain.", "t m"),
        ],
        "plate",
        7.8,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 6. DEFORESTATION, SUSTAINABILITY & CONSERVATION (#fig-15-6)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_deforestation_conservation_sustainability() -> str:
    f = Fig(
        640,
        540,
        "Four Undesirable Effects of Deforestation, Monocultures vs Biodiversity, Sustainable Resources, and Endangered Species Conservation",
    )
    heading(
        f,
        "15.6  Deforestation, Sustainable Forestry/Fisheries & Species Conservation",
        "Protecting habitats from Silent Valley to seed banks (-20 °C), fishery mesh quotas, and captive AI/IVF breeding",
    )

    # LEFT PANEL: Four Effects of Deforestation + Monocultures
    f.rect(16, 54, 296, 470, "wash-p", rx=10)
    txt(f, 164, 74, "1. Four Undesirable Effects of Deforestation", "t b p", 9.1)
    txt(f, 164, 90, "Why clearing tropical & Western Ghats forests damages ecosystems", "t m", 7.8)

    domains = [
        (
            "A. Extinction & Loss of Biodiversity",
            "Destroys canopy/understorey habitats, nesting sites & food webs;",
            "fragmented populations lose genetic diversity and go extinct.",
            "t b p",
        ),
        (
            "B. Severe Soil Erosion & Leaching",
            "Tree roots no longer bind soil and canopy no longer breaks rain;",
            "monsoon runoff strips fertile topsoil and leaches NO₃⁻ ions.",
            "t b e",
        ),
        (
            "C. Flooding & Disrupted Water Cycle",
            "Loss of leaf transpiration reduces local rainfall; water rushes",
            "over bare slopes as surface runoff and silts up riverbeds.",
            "t b g",
        ),
        (
            "D. Increase in Atmospheric CO₂",
            "Fewer trees remove CO₂ by photosynthesis; burning and microbial",
            "decomposition of felled timber release massive CO₂ stores.",
            "t b p",
        ),
    ]

    dy = 102
    for title, l1, l2, tcls in domains:
        box(
            f,
            28,
            dy,
            272,
            72,
            [
                (19, title, tcls),
                (39, l1, "t"),
                (55, l2, "t m"),
            ],
            "plate",
            7.8,
        )
        dy += 80

    box(
        f,
        28,
        420,
        272,
        92,
        [
            (18, "Monocultures vs Intensive Livestock (0610 20.1)", "t b"),
            (36, "• Monocultures: Fast machine harvesting, but low biodiversity,", "t"),
            (51, "  soil mineral depletion, and rapid pest/pathogen outbreaks.", "t m"),
            (68, "• Intensive livestock: Warm indoor pens cut respiratory energy", "t"),
            (82, "  loss, but risk disease spread, antibiotic resistance & slurry.", "t m"),
        ],
        "plate",
        7.6,
    )

    # RIGHT PANEL: Sustainable Resources & Endangered Species Conservation
    f.rect(328, 54, 296, 470, "wash-g", rx=10)
    txt(f, 476, 74, "2. Sustainability & Conservation Toolkit (0610 20.4)", "t b g", 9.1)
    txt(f, 476, 90, "Sustainable resource = produced as rapidly as it is removed", "t m", 7.9)

    box(
        f,
        340,
        102,
        272,
        122,
        [
            (20, "Sustainable Forestry & Fisheries", "t b g"),
            (40, "1. Sustainable Forests: Selective logging of mature trees,", "t"),
            (56, "   coppicing, replanting felled trees (reforestation),", "t m"),
            (72, "   protected buffer zones, education & legal timber quotas.", "t m"),
            (92, "2. Sustainable Fish Stocks: Catch quotas, minimum net mesh", "t"),
            (108, "   size (juveniles escape to breed), closed spawning seasons.", "t m"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        340,
        234,
        272,
        96,
        [
            (20, "Why Species Become Endangered + Inbreeding Risk", "t b p"),
            (40, "• Six drivers: habitat destruction, climate change, hunting,", "t"),
            (56, "  overharvesting, pollution & introduced alien species.", "t m"),
            (76, "• Small populations lose genetic variation (bottleneck);", "t b p"),
            (90, "  inbreeding raises harmful recessive homozygotes (Ch 13).", "t m"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        340,
        340,
        272,
        172,
        [
            (20, "Five Conservation Methods for Endangered Species", "t b e"),
            (40, "1. Monitoring & habitat protection: National parks (SGNP,", "t"),
            (56, "   Silent Valley), anti-poaching patrols, CITES treaties.", "t m"),
            (74, "2. Education: Community awareness & ethical consumption.", "t"),
            (92, "3. Captive breeding programmes: Zoo studbooks & DNA", "t"),
            (108, "   profiles help choose donors; habitat still matters.", "t m"),
            (126, "4. Seed banks: Suitable seeds tolerate drying/freezing;", "t b g"),
            (142, "   other species need specialised storage methods.", "t m"),
            (160, "5. AI: sperm into female; IVF: fertilisation outside body.", "t b e"),
        ],
        "plate",
        7.8,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 7. YEAST, ENZYMES & INDUSTRIAL FERMENTERS (#fig-15-7)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_yeast_enzymes_industrial_fermenter() -> str:
    f = Fig(
        640,
        540,
        "Yeast and Enzyme Biotechnology Applications and Cross-Section of a Stainless-Steel Industrial Fermenter",
    )
    heading(
        f,
        "15.7  Microbial & Enzyme Biotechnology and Inside an Industrial Fermenter",
        "Bread, bioethanol, pectinase, biological washing powders, immobilised lactase & fermenter controls and waste handling",
    )

    # LEFT PANEL: Four Core Microbial & Enzyme Applications
    f.rect(16, 54, 296, 470, "wash-e", rx=10)
    txt(f, 164, 74, "1. Four Core Biotechnology Applications (0610 21.2)", "t b e", 9.1)
    txt(f, 164, 90, "Harnessing yeast anaerobic respiration and purified enzymes", "t m", 7.9)

    box(
        f,
        28,
        102,
        272,
        98,
        [
            (19, "A. Yeast Anaerobic Respiration (Glucose → Ethanol + CO₂)", "t b p"),
            (39, "• Bread-making: CO₂ gas bubbles trapped in elastic gluten", "t"),
            (55, "  raise dough; baking removes much, not all, ethanol.", "t m"),
            (73, "• Biofuels: Yeast ferments maize/sugarcane sugars into", "t"),
            (89, "  renewable bioethanol fuel blended with petrol.", "t m"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        28,
        208,
        272,
        74,
        [
            (19, "B. Pectinase in Fruit Juice Production", "t b g"),
            (39, "• Hydrolyses insoluble pectin gluing plant cell walls →", "t"),
            (55, "  releases higher juice volume and clarifies cloudy juice.", "t m"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        28,
        290,
        272,
        88,
        [
            (19, "C. Biological Washing Powders (Protease, Lipase, Amylase)", "t b e"),
            (39, "• Digest insoluble protein (blood/egg), lipid (grease), and", "t"),
            (55, "  starch stains into soluble amino acids, fatty acids & sugars", "t m"),
            (73, "  at 30–40 °C (saves electricity; >60 °C denatures enzymes).", "t b p"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        28,
        386,
        272,
        126,
        [
            (19, "D. Immobilised Lactase & Why Bacteria Suit Biotech", "t b g"),
            (39, "• Lactase in alginate beads hydrolyses milk lactose into", "t"),
            (55, "  glucose + galactose (enzyme-free milk; reusable beads).", "t m"),
            (75, "• Four reasons bacteria excel in biotech (0610 21.1):", "t b"),
            (93, "  (1) Rapid reproduction (20 min), (2) make complex molecules,", "t"),
            (109, "  (3) few ethical concerns, (4) possess circular plasmids.", "t b e"),
        ],
        "plate",
        7.8,
    )

    # RIGHT PANEL: Industrial Fermenter Cross-Section & 6 Controlled Variables
    f.rect(328, 54, 296, 470, "wash-g", rx=10)
    txt(f, 476, 74, "2. Industrial Fermenter Engineering (0610 21.2)", "t b g", 9.1)
    txt(f, 476, 90, "Penicillin (Penicillium), Mycoprotein (Fusarium) & GM Insulin", "t m", 7.9)

    # Schematic diagram box
    f.rect(340, 102, 272, 224, "plate", rx=8)

    # Outer cooling jacket & inner tank
    f.rect(418, 132, 116, 152, "wash-e", rx=8)
    f.rect(430, 142, 92, 132, "wash-g", rx=5)

    # Motor & shaft
    f.rect(456, 110, 40, 20, "plate", rx=3)
    txt(f, 476, 124, "Motor", "t b", 7.5)
    f.line(476, 130, 476, 252, "ln")
    f.rect(446, 176, 60, 8, "plate", rx=2)
    f.rect(446, 218, 60, 8, "plate", rx=2)
    txt(f, 476, 202, "6. Stirring paddles", "t b", 7.4)
    txt(f, 476, 264, "5. Sterile air sparger (O₂)", "t b e", 7.2)

    # Left labels inside schematic
    txt(f, 380, 148, "2. Nutrients", "t b g", 7.6)
    txt(f, 380, 160, "(C + N ions)", "t m", 7.1)
    arr(f, 408, 152, 428, 152, "g")

    txt(f, 380, 196, "4. pH Probe", "t b p", 7.6)
    txt(f, 380, 208, "(Acid/alkali)", "t m", 7.1)
    arr(f, 408, 200, 428, 200, "p")

    txt(f, 380, 244, "3. Cooling", "t b e", 7.6)
    txt(f, 380, 256, "water jacket", "t b e", 7.4)
    arr(f, 408, 248, 418, 248, "e")

    # Right labels inside schematic
    txt(f, 572, 148, "1. Steam", "t b p", 7.6)
    txt(f, 572, 160, "(Aseptic)", "t m", 7.1)
    arr(f, 544, 152, 524, 152, "p")

    txt(f, 572, 196, "Temp Probe", "t b g", 7.6)
    txt(f, 572, 208, "(28 / 37 °C)", "t m", 7.1)
    arr(f, 544, 200, 524, 200, "g")

    txt(f, 572, 244, "5. Air Filter", "t b e", 7.6)
    txt(f, 572, 256, "(Sterile O₂)", "t m", 7.1)
    arr(f, 544, 248, 524, 248, "e")

    txt(f, 476, 302, "Harvest valve → purified antibiotic / insulin / mycoprotein", "t b", 7.6)
    txt(f, 476, 316, "Exhaust gas vent releases CO₂ via sterile filter", "t m", 7.3)

    # Six controlled conditions table card
    box(
        f,
        340,
        336,
        272,
        176,
        [
            (19, "Fermenter Controls, Mixing and Waste Handling", "t b g"),
            (39, "1. Aseptic steam sterilization: Kills foreign bacteria/fungi", "t"),
            (54, "   so they do not compete for nutrients or taint product.", "t m"),
            (72, "2. Nutrients: Glucose (respiration) + NH₄⁺/amino acids (protein).", "t"),
            (90, "3. Optimum Temp (cooling jacket): Microbial respiration", "t b p"),
            (105, "   releases heat; cold jacket prevents enzyme denaturation.", "t m"),
            (123, "4. Optimum pH (probes + acid/alkali): Prevents active-site", "t"),
            (138, "   denaturation as metabolic CO₂/organic acids form.", "t m"),
            (156, "5. Oxygenation (sterile sparger): Supplies O₂ for aerobic ATP.", "t"),
            (170, "6. Mix broth; exhaust CO₂ and control waste build-up.", "t"),
        ],
        "plate",
        7.6,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 8. RECOMBINANT PLASMID INSULIN, GM CROPS & CRISPR (#fig-15-8)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_recombinant_plasmid_insulin_crispr() -> str:
    f = Fig(
        640,
        540,
        "Five-Step Recombinant Plasmid Human Insulin Pipeline, GM Crops, Selective Breeding vs GM, and CRISPR-Cas9",
    )
    heading(
        f,
        "15.8  Genetic Modification: Recombinant Human Insulin, GM Crops & CRISPR",
        "Prepared intron-free coding DNA and bacterial controls; compatible ends joined by ligase; process and purify the product",
    )

    # LEFT PANEL: 5-Step Recombinant Human Insulin Pipeline
    f.rect(16, 54, 304, 470, "wash-e", rx=10)
    txt(f, 168, 74, "1. Five-Step Recombinant Insulin Pipeline (0610 21.3)", "t b e", 9.0)
    txt(f, 168, 90, "Intron-free DNA + expression controls + product processing", "t m", 7.9)

    box(
        f,
        28,
        102,
        134,
        74,
        [
            (18, "Step 1: Prepared DNA", "t b e"),
            (36, "Intron-free insulin code", "t"),
            (50, "plus bacterial controls", "t b e"),
            (65, "Cut to compatible ends", "t m"),
        ],
        "plate",
        7.6,
    )
    box(
        f,
        174,
        102,
        134,
        74,
        [
            (18, "Step 2: Plasmid Vector", "t b p"),
            (36, "Cut bacterial plasmid", "t"),
            (50, "same enzyme here", "t b p"),
            (65, "→ Compatible ends", "t m"),
        ],
        "plate",
        7.6,
    )

    box(
        f,
        28,
        196,
        280,
        74,
        [
            (19, "Step 3: Join with DNA Ligase → Recombinant Plasmid", "t b g"),
            (39, "• Complementary sticky ends anneal by base pairing (A–T, C–G)", "t"),
            (55, "• DNA ligase seals sugar-phosphate backbone covalent bonds", "t b g"),
            (68, "  to form a single circular recombinant plasmid molecule", "t m"),
        ],
        "plate",
        7.7,
    )

    box(
        f,
        28,
        290,
        280,
        68,
        [
            (19, "Step 4: Insert Plasmid into Host Bacteria (Transformation)", "t b e"),
            (39, "• Host E. coli bacteria are mixed with recombinant plasmids", "t"),
            (55, "  and take up the vector carrying the human insulin gene", "t m"),
        ],
        "plate",
        7.7,
    )

    box(
        f,
        28,
        378,
        280,
        134,
        [
            (20, "Step 5: Clone in Fermenter & Express Human Insulin", "t b p"),
            (40, "• Transformed bacteria multiply in an industrial fermenter", "t"),
            (56, "  (20-min doubling only an ideal E. coli example).", "t m"),
            (76, "• Express coding sequence, then recover, process, fold", "t b g"),
            (92, "  and purify. Mature insulin has two chains (21 + 30 aa).", "t m"),
            (112, "• Why better than pig/cattle pancreas insulin (Ch 10):", "t b"),
            (126, "  Human sequence; reduced reliance on animal pancreases.", "t m"),
        ],
        "plate",
        7.7,
    )

    arr(f, 95, 178, 135, 194, "e")
    arr(f, 241, 178, 201, 194, "p")
    arr(f, 168, 272, 168, 288, "g")
    arr(f, 168, 360, 168, 376, "e")

    # RIGHT PANEL: GM Crops, Selective Breeding vs GM & CRISPR-Cas9
    f.rect(332, 54, 292, 470, "wash-g", rx=10)
    txt(f, 478, 74, "2. GM Crops, Selective Breeding vs GM & CRISPR", "t b g", 9.0)
    txt(f, 478, 90, "Transgenic agriculture and programmable genome editing", "t m", 7.9)

    box(
        f,
        344,
        102,
        268,
        152,
        [
            (19, "Genetically Modified (GM) Crops: Pros & Cons (21.3)", "t b g"),
            (39, "• Bt Cotton & Maize (Insect-resistant): Bacterial gene makes", "t"),
            (54, "  toxin fatal to bollworm caterpillars → higher yield, less spray.", "t m"),
            (72, "• Golden Rice (Vitamin A): Beta-carotene genes in rice grain", "t"),
            (87, "  can help reduce deficiency; access and diet matter.", "t m"),
            (105, "• Herbicide-resistant Soya: Spray kills competing weeds only.", "t"),
            (123, "• Risks & Concerns: Pollen gene transfer to wild weeds", "t b p"),
            (139, "  resistant pests; commercial seed terms vary by product.", "t m"),
        ],
        "plate",
        7.6,
    )

    box(
        f,
        344,
        264,
        268,
        122,
        [
            (19, "Selective Breeding (Ch 14) vs Genetic Modification", "t b e"),
            (39, "1. Gene source: Selective breeding is restricted to alleles", "t"),
            (54, "   within the same species; GM transfers genes across kingdoms.", "t m"),
            (72, "2. Precision: Selective breeding shuffles thousands of alleles;", "t"),
            (87, "   GM makes chosen insertions/deletions/edits; test outcomes.", "t m"),
            (105, "3. Timescale: Selective breeding takes many generations;", "t b"),
            (116, "   GM crop development also needs selection and testing.", "t m"),
        ],
        "plate",
        7.6,
    )

    box(
        f,
        344,
        396,
        268,
        116,
        [
            (19, "Modern Extension: CRISPR-Cas9 Editing (Doudna 2012)", "t b p"),
            (39, "• Adapted from a natural bacterial anti-phage immune defence.", "t"),
            (57, "• A guide RNA has a 20-base target-matching region near", "t"),
            (73, "  a suitable PAM. It directs Cas9 to make a DNA cut;", "t m"),
            (89, "  cell repair makes the change. Check intended and", "t b g"),
            (105, "  unintended outcomes; a cut is not itself a correction.", "t m"),
        ],
        "plate",
        7.6,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 9. CAPSTONE CASE STUDY & FIVE BIG IDEAS SYNTHESIS (#fig-15-9)
# ──────────────────────────────────────────────────────────────────────
@figure
def c15_mumbai_creek_insulin_case() -> str:
    f = Fig(
        640,
        540,
        "Mumbai SGNP-Powai-Thane Creek Ecological Audit and Capstone Synthesis of the Five Big Ideas of Biology",
    )
    heading(
        f,
        "15.9  Mumbai Environments & The Five Big Ideas",
        "From SGNP forest energy webs and Powai Lake eutrophication to Thane Creek mangroves and recombinant insulin",
    )

    # TOP PANEL: Mumbai Watershed Three-Station Audit
    f.rect(16, 54, 608, 222, "wash-e", rx=10)
    txt(f, 320, 74, "1. Fictional Teaching Data: Three Separate Mumbai Environments (Not a Downstream Transect)", "t b e", 9.2)

    box(
        f,
        28,
        88,
        184,
        174,
        [
            (20, "Station 1: SGNP Forest", "t b g"),
            (38, "(Borivali Headwaters)", "t m"),
            (58, "• Producers fix solar light;", "t"),
            (74, "  assume 10% production transfer.", "t m"),
            (94, "• Wild legumes + Rhizobium &", "t"),
            (110, "  aerated nitrifiers make NO₃⁻.", "t m"),
            (130, "• Canopy transpiration & roots", "t"),
            (146, "  prevent soil erosion.", "t m"),
            (164, "Stream DO: 8.2 mg L⁻¹ (High)", "t b g"),
        ],
        "plate",
        7.7,
    )

    box(
        f,
        228,
        88,
        184,
        174,
        [
            (20, "Station 2: Powai Outfall", "t b p"),
            (38, "(Nitrate & Sewage Plume)", "t m"),
            (58, "• Excess NO₃⁻/PO₄³⁻ triggers", "t"),
            (74, "  dense surface algal bloom.", "t m"),
            (94, "• Shade kills submerged plants", "t"),
            (110, "  → dead organic detritus surges.", "t m"),
            (130, "• Aerobic decomposer bacteria", "t"),
            (146, "  respire O₂ (BOD 16 mg L⁻¹).", "t m"),
            (164, "Outfall DO: 1.4 mg L⁻¹ (Hypoxic)", "t b p"),
        ],
        "plate",
        7.7,
    )

    box(
        f,
        428,
        88,
        184,
        174,
        [
            (20, "Station 3: Thane Creek", "t b e"),
            (38, "(Separate Estuarine Site)", "t m"),
            (58, "• Compare nutrients, oxygen", "t"),
            (74, "  and communities over time.", "t m"),
            (94, "• Do not infer treatment from", "t"),
            (110, "  one illustrative snapshot.", "t m"),
            (130, "• Avicennia marina roots host", "t"),
            (146, "  crabs, fish & flamingos.", "t m"),
            (164, "Example DO: 6.8 mg L⁻¹", "t b e"),
        ],
        "plate",
        7.7,
    )

    # Separate sites: no downstream arrows between the illustrative panels.

    # BOTTOM PANEL: Capstone Synthesis of All Five Big Ideas (Ch 0 to Ch 15)
    f.rect(16, 288, 608, 236, "wash-g", rx=10)
    txt(f, 320, 308, "2. Capstone Synthesis: The Five Big Ideas Across Chapters 0–15", "t b g", 9.3)

    box(
        f,
        28,
        322,
        184,
        92,
        [
            (18, "1. Compartments (Ch 1–3, 15)", "t b e"),
            (36, "Partially permeable cell", "t"),
            (51, "membranes, chloroplasts,", "t m"),
            (66, "root hair vacuoles, bacterial", "t m"),
            (81, "plasmids & biosphere habitats.", "t b"),
        ],
        "plate",
        7.6,
    )
    box(
        f,
        228,
        322,
        184,
        92,
        [
            (18, "2. Chemistry on a Budget", "t b p"),
            (36, "Enzymes (Ch 4), photosynthesis", "t"),
            (51, "& respiration (Ch 5–6), one-way", "t m"),
            (66, "Energy transfer vs reused C,", "t m"),
            (81, "H₂O & N₂ cycles (Ch 15).", "t b"),
        ],
        "plate",
        7.6,
    )
    box(
        f,
        428,
        322,
        184,
        92,
        [
            (18, "3. Form Fits Job (Ch 5–9, 15)", "t b g"),
            (36, "Xylem vessels, villi, alveoli,", "t"),
            (51, "nephrons, neurones, xerophyte", "t m"),
            (66, "leaves, legume root nodules &", "t m"),
            (81, "restriction sticky ends.", "t b"),
        ],
        "plate",
        7.6,
    )

    box(
        f,
        28,
        424,
        286,
        88,
        [
            (19, "4. Steady Insides (Ch 9–10, 15)", "t b e"),
            (38, "• Negative feedback of blood glucose (insulin/glucagon),", "t"),
            (54, "  body temperature (37 °C), and water potential (ADH).", "t m"),
            (72, "• Population carrying capacity (K) & 37 °C / pH 7.0", "t b"),
            (84, "  homeostasis inside an industrial fermenter.", "t m"),
        ],
        "plate",
        7.6,
    )
    box(
        f,
        326,
        424,
        286,
        88,
        [
            (19, "5. Code Copies, Mutates & Rewrites (Ch 11–15)", "t b p"),
            (38, "• DNA double helix → mitosis/meiosis (Ch 12) → Mendelian", "t"),
            (54, "  inheritance (Ch 13) → natural selection (Ch 14).", "t m"),
            (72, "• Humans now edit the same universal code via recombinant", "t b g"),
            (84, "  plasmids (human insulin) and CRISPR-Cas9.", "t m"),
        ],
        "plate",
        7.6,
    )

    return f.svg()
