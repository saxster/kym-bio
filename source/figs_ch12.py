"""Chapter 12 original SVG plates — Copying the Blueprint: Mitosis, Stem Cells & Meiosis.

Nine bespoke figures built on figs_core primitives:
1. c12_meselson_stahl_replication   (#fig-12-1, upgraded by w_dna_replication_meselson.js)
2. c12_chromosome_chromatid_ledger  (#fig-12-2)
3. c12_mitosis_cycle_roles          (#fig-12-3, upgraded by w_mitosis_meiosis_stepper.js)
4. c12_asexual_vs_sexual_crops      (#fig-12-4)
5. c12_stem_cells_gene_expression   (#fig-12-5, upgraded by w_stem_cell_expression_lab.js)
6. c12_gurdon_yamanaka_proof        (#fig-12-6)
7. c12_diploid_haploid_meiosis      (#fig-12-7)
8. c12_mitosis_vs_meiosis_ledger    (#fig-12-8)
9. c12_triploid_banana_case         (#fig-12-9)
"""

from figs_core import Fig, figure

ARROW_KIND = {"e": "electron", "p": "proton", "g": "green", "ink": "ink"}


def heading(f: Fig, title: str, sub: str) -> None:
    f.text(320, 22, title, "t b", "middle", 11.8)
    f.text(320, 40, sub, "t m", "middle", 9.0)


def txt(f: Fig, x: float, y: float, s: str, cls: str = "t", size: float = 9.0, anchor: str = "middle") -> None:
    f.text(x, y, s, cls, anchor, size)


def arr(f: Fig, x1: float, y1: float, x2: float, y2: float, k: str = "ink") -> None:
    f.arrow(x1, y1, x2, y2, ARROW_KIND.get(k, k), width=1.8)


def box(f: Fig, x: float, y: float, w: float, h: float, rows, cls: str = "plate", size: float = 8.6) -> None:
    f.rect(x, y, w, h, cls, rx=8)
    for dy, s, tcls in rows:
        f.text(x + w / 2, y + dy, s, tcls, "middle", size)


# ──────────────────────────────────────────────────────────────────────
# 1. MESELSON–STAHL 1958 & SEMI-CONSERVATIVE DNA REPLICATION (#fig-12-1)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_meselson_stahl_replication() -> str:
    f = Fig(
        640,
        590,
        "Semi-conservative DNA replication fork and the 1958 Meselson-Stahl CsCl density-gradient ultracentrifuge proof",
    )
    heading(
        f,
        "12.1  Unzipping the Archive: Semi-Conservative Replication & Meselson-Stahl (1958)",
        "Each parental strand templates a complementary partner; CsCl centrifugation (140,000 × g) proves the 1-old + 1-new rule",
    )

    # LEFT PANEL: Replication Fork & Polymerase Proofreading
    f.rect(16, 54, 294, 412, "wash-e", rx=10)
    txt(f, 163, 74, "1. Replication Fork inside the Nucleus", "t b e", 9.6)
    txt(f, 163, 92, "DNA helicase unzips H-bonds; DNA polymerase builds", "t m", 8.3)

    box(
        f,
        28,
        104,
        270,
        82,
        [
            (22, "Parental Double Helix (¹⁵N heavy strands)", "t b p"),
            (44, "3'- A T G C C A -5'  paired with  5'- T A C G G T -3'", "t mono"),
            (66, "A=T (2 H-bonds) & C≡G (3 H-bonds) unzipped by helicase", "t m"),
        ],
        "wash-p",
        8.2,
    )

    arr(f, 163, 188, 163, 210, "e")

    box(
        f,
        28,
        214,
        130,
        126,
        [
            (22, "Daughter Duplex 1", "t b e"),
            (48, "Old ¹⁵N: 3'-ATGCCA-5'", "t b p"),
            (72, "New ¹⁴N: 5'-TACGGT-3'", "t b g"),
            (96, "Hybrid ¹⁵N/¹⁴N", "t b"),
            (114, "1 old + 1 new strand", "t m"),
        ],
        "plate",
        8.1,
    )

    box(
        f,
        168,
        214,
        130,
        126,
        [
            (22, "Daughter Duplex 2", "t b e"),
            (48, "New ¹⁴N: 3'-ATGCCA-5'", "t b g"),
            (72, "Old ¹⁵N: 5'-TACGGT-3'", "t b p"),
            (96, "Hybrid ¹⁵N/¹⁴N", "t b"),
            (114, "1 old + 1 new strand", "t m"),
        ],
        "plate",
        8.1,
    )

    box(
        f,
        28,
        352,
        270,
        102,
        [
            (22, "DNA Polymerase Fidelity & Origins", "t b g"),
            (46, "Base-pairing + active site: ~10⁻⁴ errors/base", "t s"),
            (68, "3'→5' exonuclease + MMR: ~10⁻⁹ errors/base", "t b e"),
            (90, "~40,000 origins copy 6.4 × 10⁹ bp in ~6–8 h", "t m"),
        ],
        "wash-g",
        8.1,
    )

    # RIGHT PANEL: Meselson & Stahl 1958 CsCl Density Gradient Tubes
    f.rect(324, 54, 300, 412, "wash-n", rx=10)
    txt(f, 474, 74, "2. Meselson & Stahl CsCl Tubes (1958)", "t b", 9.6)
    txt(f, 474, 92, "E. coli shifted from heavy ¹⁵NH₄Cl to light ¹⁴NH₄Cl", "t m", 8.3)

    tubes = [
        (336, "Gen 0", "0 min", "100% Heavy", "1.724 g/cm³", "wash-p", "t b p"),
        (408, "Gen 1", "20 min", "100% Hybrid", "1.717 g/cm³", "wash-e", "t b e"),
        (480, "Gen 2", "40 min", "50% Hyb / 50% Lt", "1.717 & 1.710", "wash-g", "t b g"),
        (552, "Gen 3", "60 min", "25% Hyb / 75% Lt", "2/8 Hyb, 6/8 Lt", "wash-g", "t b g"),
    ]
    for tx, gname, tmin, frac, dens, bcls, tcls in tubes:
        box(
            f,
            tx,
            104,
            64,
            236,
            [
                (22, gname, "t b"),
                (42, tmin, "t m"),
                (72, "Light", "t s g"),
                (118, "Hybrid", "t s e"),
                (164, "Heavy", "t s p"),
                (198, frac, tcls),
                (220, dens, "t m"),
            ],
            bcls,
            7.6,
        )

    box(
        f,
        336,
        352,
        276,
        102,
        [
            (22, "How Two Generations Falsify Rivals", "t b e"),
            (46, "Gen 1 (100% hybrid 1.717 g/cm³):", "t b"),
            (64, "Eliminates Conservative (predicted 50% H + 50% L)", "t s"),
            (88, "Gen 2 (50% hybrid + 50% light) eliminates Dispersive", "t b g"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM PANEL: Mathematical Law of Semi-Conservative Replication
    f.rect(16, 478, 608, 98, "wash-g", rx=10)
    txt(f, 320, 498, "3. Quantitative Law Across Generations After Shifting from Heavy ¹⁵N to Light ¹⁴N", "t b g", 9.6)
    txt(
        f,
        320,
        522,
        "The 2 original parental ¹⁵N single strands never disappear: they reside inside exactly 2 hybrid (¹⁵N/¹⁴N) duplexes for all g ≥ 1.",
        "t s",
        8.5,
    )
    txt(
        f,
        320,
        546,
        "Total duplexes = 2ᵍ   |   Hybrid fraction = 2 / 2ᵍ = 1 / 2ᵍ⁻¹   |   Light fraction = 1 − (1 / 2ᵍ⁻¹)",
        "t b e",
        8.7,
    )
    txt(
        f,
        320,
        566,
        "Gen 0: 100% Heavy  →  Gen 1: 100% Hybrid  →  Gen 2: 50% Hyb + 50% Light  →  Gen 3: 25% Hyb + 75% Light  →  Gen 4: 12.5% Hyb + 87.5% Light",
        "t m",
        8.0,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 2. CHROMOSOME vs SISTER CHROMATID LEDGER (#fig-12-2)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_chromosome_chromatid_ledger() -> str:
    f = Fig(
        640,
        540,
        "Chromosome versus sister chromatid accounting across S-phase DNA replication and mitotic separation",
    )
    heading(
        f,
        "12.1  Bookkeeping the Archive: Chromosomes, Centromeres & Sister Chromatids",
        "Count chromosomes by functional centromeres; count DNA molecules by individual chromatids before and after mitosis",
    )

    stages = [
        (
            18,
            "1. Unreplicated (G₁ Phase)",
            "1 chromosome = 1 DNA molecule",
            "1 functional centromere",
            "0 sister-chromatid pairs",
            "Human G₁ body cell:",
            "46 chromosomes (2n = 46)",
            "46 DNA helices (mass 2C)",
            "wash-e",
            "t b e",
        ),
        (
            224,
            "2. After S-Phase Copy (G₂)",
            "1 chromosome = 2 sister chromatids",
            "Still 1 shared centromere",
            "2 identical DNA helices tethered",
            "Human cell entering mitosis:",
            "Still 46 chromosomes (2n = 46)",
            "92 chromatids / helices (mass 4C)",
            "wash-g",
            "t b g",
        ),
        (
            430,
            "3. Mitotic Separation",
            "Centromere splits in two",
            "2 independent centromeres",
            "Each chromatid is now 1 chromosome",
            "Each daughter nucleus (×2):",
            "46 chromosomes (2n = 46)",
            "46 DNA helices (mass 2C)",
            "wash-p",
            "t b p",
        ),
    ]

    for i, (sx, title_s, l1, l2, l3, h_hdr, h1, h2, bcls, tcls) in enumerate(stages):
        box(
            f,
            sx,
            58,
            192,
            326,
            [
                (26, title_s, tcls),
                (54, l1, "t b"),
                (82, l2, "t s"),
                (108, l3, "t m"),
                (148, "Centromere rule:", "t m"),
                (172, "1 centromere = 1 chromosome", "t b"),
                (216, h_hdr, "t m"),
                (244, h1, tcls),
                (272, h2, "t b"),
                (304, f"Step {i+1} of 3", "t m"),
            ],
            bcls,
            8.4,
        )
        if i < 2:
            arr(f, sx + 194, 220, sx + 222, 220, "ink")

    # Bottom guardrail ledger
    f.rect(18, 400, 604, 124, "wash-n", rx=10)
    txt(
        f,
        320,
        424,
        "Exam Trap Guardrail — Why S-Phase DNA Replication Does Not Turn a Diploid (2n) Cell into 4n",
        "t b e",
        9.6,
    )
    txt(
        f,
        320,
        450,
        "Ploidy (2n vs n) counts how many sets of homologous chromosomes a nucleus holds (2 sets of 23 = 46 in humans).",
        "t s",
        8.6,
    )
    txt(
        f,
        320,
        474,
        "S-phase replication duplicates each chromosome into 2 identical sister chromatids joined at 1 centromere (46 chromosomes, 92 chromatids).",
        "t s",
        8.5,
    )
    txt(
        f,
        320,
        500,
        "During mitosis, the copies separate to opposite poles, maintaining 2n = 46 chromosomes in every daughter cell (0610 17.2.3 & 17.2.4).",
        "t b g",
        8.6,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 3. MITOSIS DIVISION CYCLE & FOUR BIOLOGICAL ROLES (#fig-12-3)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_mitosis_cycle_roles() -> str:
    f = Fig(
        640,
        600,
        "The mitotic division cycle and the four roles of mitosis in growth, tissue repair, cell replacement, and asexual reproduction",
    )
    heading(
        f,
        "12.2  Mitosis: Nuclear Division Giving Rise to Genetically Identical Cells",
        "Exact replication occurs before mitosis; copies separate on the spindle to maintain 2n = 46 across four life roles",
    )

    # TOP PANEL: 4-Stage Mitotic Loop
    f.rect(16, 54, 608, 198, "wash-e", rx=10)
    txt(f, 320, 74, "1. The Mitotic Division Sequence (Walther Flemming's 'Mitos' Thread Dance, 1882)", "t b e", 9.6)

    m_steps = [
        (26, "Step 1: Interphase Copy", "2n = 46 parent cell", "DNA replicates →", "92 sister chromatids", "plate", "t b e"),
        (174, "Step 2: Condense & Line Up", "Chromosomes coil up;", "nuclear envelope breaks;", "align at cell equator", "plate", "t b e"),
        (322, "Step 3: Copies Separate", "Spindle fibres pull", "sister chromatids apart", "to opposite poles", "wash-p", "t b p"),
        (470, "Step 4: Two Cloned Cells", "Two nuclei re-form &", "cytoplasm divides →", "2 × (2n = 46) clones", "wash-g", "t b g"),
    ]
    for i, (mx, mt, m1, m2, m3, bcls, tcls) in enumerate(m_steps):
        box(
            f,
            mx,
            88,
            142,
            148,
            [
                (24, mt, tcls),
                (54, m1, "t b"),
                (80, m2, "t s"),
                (102, m3, "t b"),
                (130, "2n = 46 maintained", "t m"),
            ],
            bcls,
            8.2,
        )

    # BOTTOM PANEL: Four IGCSE 0610 17.2.2 Roles of Mitosis
    f.rect(16, 266, 608, 318, "wash-n", rx=10)
    txt(
        f,
        320,
        288,
        "2. Four Biological Roles of Mitosis in Living Organisms (Cambridge IGCSE 0610 17.2.2)",
        "t b",
        9.6,
    )

    roles = [
        (
            28,
            302,
            "Role A: Growth of the Organism",
            "1 diploid zygote (2n = 46) divides repeatedly",
            "by mitosis to build ~37 trillion adult cells;",
            "plant root-tip and shoot-tip meristems add cells.",
            "wash-g",
            "t b g",
        ),
        (
            326,
            302,
            "Role B: Repair of Damaged Tissues",
            "When skin is scraped or a blood vessel tears,",
            "surviving dermal fibroblasts and epidermal cells",
            "divide by mitosis to seal the wound with clones.",
            "wash-p",
            "t b p",
        ),
        (
            28,
            442,
            "Role C: Replacement of Worn-Out Cells",
            "Bone-marrow stem cells replace ~2 million red",
            "blood cells/s; gut crypt cells renew villus lining",
            "every 3–5 days; skin epidermis renews every ~27 d.",
            "wash-e",
            "t b e",
        ),
        (
            326,
            442,
            "Role D: Asexual Reproduction (Clones)",
            "Single parent produces genetically identical",
            "offspring by mitosis alone: potato stem tubers,",
            "onion bulbs, strawberry runners, banana suckers.",
            "plate",
            "t b",
        ),
    ]
    for rx, ry, rtitle, rl1, rl2, rl3, bcls, tcls in roles:
        box(
            f,
            rx,
            ry,
            286,
            126,
            [
                (24, rtitle, tcls),
                (54, rl1, "t s"),
                (78, rl2, "t s"),
                (102, rl3, "t b"),
            ],
            bcls,
            8.4,
        )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 4. ASEXUAL vs SEXUAL REPRODUCTION IN WILD & CROPS (#fig-12-4)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_asexual_vs_sexual_crops() -> str:
    f = Fig(
        640,
        590,
        "Asexual reproduction by mitosis versus sexual reproduction by meiosis and fertilisation in wild populations and crops",
    )
    heading(
        f,
        "12.2  One Parent or Two: Asexual Cloning vs Sexual Reproduction in Wild & Crops",
        "Comparing genetically identical clones (0610 16.1) with genetically diverse seed offspring (0610 16.2)",
    )

    # LEFT COLUMN: Asexual Reproduction
    f.rect(16, 54, 296, 520, "wash-e", rx=10)
    txt(f, 164, 76, "1. Asexual Reproduction (Mitosis Only)", "t b e", 9.6)
    txt(f, 164, 96, "One parent → genetically identical offspring", "t b", 8.5)

    box(
        f,
        28,
        110,
        272,
        104,
        [
            (22, "Mechanism & Examples", "t b e"),
            (46, "Cells divide by mitosis; no gametes or fusion", "t s"),
            (70, "Potato tuber eyes, onion bulbs, strawberry", "t s"),
            (90, "runners, sugarcane cuttings, banana suckers", "t b"),
        ],
        "plate",
        8.2,
    )

    box(
        f,
        28,
        228,
        272,
        160,
        [
            (22, "Advantages (Wild & Crop Production)", "t b g"),
            (48, "+ Fast reproduction from 1 well-adapted parent", "t s"),
            (72, "+ No mate or insect/wind pollinator needed", "t s"),
            (96, "+ Crop clones keep exact sweet / seedless /", "t s"),
            (118, "  high-yield traits in every daughter plant", "t b g"),
            (142, "+ Uniform harvest timing and fruit quality", "t m"),
        ],
        "wash-g",
        8.2,
    )

    box(
        f,
        28,
        402,
        272,
        158,
        [
            (22, "Disadvantages (Wild & Crop Production)", "t b p"),
            (48, "− Zero genetic variation among clones", "t b"),
            (72, "− Poor ability to adapt if climate changes", "t s"),
            (96, "− Monoculture trap: a single pathogen", "t s"),
            (118, "  (e.g. potato blight or banana TR4 fungus)", "t b p"),
            (140, "  can wipe out the entire cloned crop", "t m"),
        ],
        "wash-p",
        8.2,
    )

    # RIGHT COLUMN: Sexual Reproduction
    f.rect(328, 54, 296, 520, "wash-n", rx=10)
    txt(f, 476, 76, "2. Sexual Reproduction (Meiosis + Fusion)", "t b", 9.6)
    txt(f, 476, 96, "Gamete nuclei fuse → genetically different young", "t b", 8.5)

    box(
        f,
        340,
        110,
        272,
        104,
        [
            (22, "Mechanism & Examples", "t b e"),
            (46, "Meiosis makes haploid gametes (n); fertilisation", "t s"),
            (70, "fuses nuclei into a diploid zygote (2n)", "t s"),
            (90, "Seeded wild bananas, rice, wheat, mammals", "t b"),
        ],
        "plate",
        8.2,
    )

    box(
        f,
        340,
        228,
        272,
        160,
        [
            (22, "Advantages (Wild & Crop Breeding)", "t b g"),
            (48, "+ Creates genetic variation every generation", "t b"),
            (72, "+ Enables adaptation & evolution under new", "t s"),
            (96, "  selection pressures or emerging diseases", "t s"),
            (118, "+ Breeders cross varieties to combine disease", "t b g"),
            (142, "  resistance with high yield in new hybrids", "t m"),
        ],
        "wash-g",
        8.2,
    )

    box(
        f,
        340,
        402,
        272,
        158,
        [
            (22, "Disadvantages (Wild & Crop Production)", "t b p"),
            (48, "− Slower and requires two parents / pollinators", "t b"),
            (72, "− Costs energy to build flowers, nectar, pollen", "t s"),
            (96, "− Many pollen grains or seeds fail to germinate", "t s"),
            (118, "− Meiosis reshuffles alleles, so elite parental", "t b p"),
            (140, "  combinations do not breed true from seed", "t m"),
        ],
        "wash-p",
        8.2,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 5. STEM CELLS & SELECTIVE GENE EXPRESSION SWITCHBOARD (#fig-12-5)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_stem_cells_gene_expression() -> str:
    f = Fig(
        640,
        610,
        "Stem cell self-renewal and differentiation alongside the selective gene expression switchboard across human cell types",
    )
    heading(
        f,
        "12.3  Same 46-Volume Library, Different Open Pages: Stem Cells & Gene Expression",
        "Stem cells divide by mitosis; specialised daughter cells keep all ~20,000 genes but express only the proteins they need",
    )

    # TOP PANEL: Three Stem Cell Categories
    f.rect(16, 54, 608, 166, "wash-e", rx=10)
    txt(
        f,
        320,
        74,
        "1. Stem Cells — Unspecialised Cells Dividing by Mitosis to Renew and Specialise (0610 17.2.5)",
        "t b e",
        9.5,
    )

    sc_cols = [
        (
            28,
            "A. Embryonic Stem Cells",
            "Early embryo (blastocyst)",
            "Pluripotent: can become",
            "any of >200 body cell types",
            "wash-p",
            "t b p",
        ),
        (
            224,
            "B. Adult Tissue Stem Cells",
            "Bone marrow, gut, skin",
            "Multipotent: replace blood,",
            "immune, or epithelial cells",
            "plate",
            "t b e",
        ),
        (
            420,
            "C. Plant Apical Meristems",
            "Root tips, shoot tips, cambium",
            "Lifelong mitotic division →",
            "xylem, phloem, leaves, clones",
            "wash-g",
            "t b g",
        ),
    ]
    for sx, st, s1, s2, s3, bcls, tcls in sc_cols:
        box(
            f,
            sx,
            88,
            192,
            118,
            [
                (24, st, tcls),
                (50, s1, "t m"),
                (76, s2, "t s"),
                (98, s3, "t b"),
            ],
            bcls,
            8.3,
        )

    # BOTTOM PANEL: Selective Gene Expression Switchboard (0610 17.1.6)
    f.rect(16, 232, 608, 362, "wash-n", rx=10)
    txt(
        f,
        320,
        252,
        "2. Selective Gene Expression Switchboard — All Three Cells Carry 2n = 46 Chromosomes (0610 17.1.6)",
        "t b",
        9.4,
    )

    # Column headers
    headers = [
        (28, 134, "Specialised Cell", "t b"),
        (168, 106, "ATP5F1A (ATP)", "t b g"),
        (280, 108, "INS (Insulin)", "t b e"),
        (394, 108, "HBB (Globin)", "t b p"),
        (508, 104, "CHAT (Synapse)", "t b"),
    ]
    for hx, hw, htxt, hcls in headers:
        box(f, hx, 266, hw, 36, [(23, htxt, hcls)], "plate", 8.2)

    rows = [
        (
            310,
            ("Pancreatic Beta Cell", "Islets of Langerhans", "2n = 46 (100% genes)", "wash-e", "t b e"),
            ("SWITCHED ON", "ATP synthase mRNA", "Powers cell ATP", "wash-g", "t b g"),
            ("SWITCHED ON", "INS mRNA transcribed", "Prints insulin hormone", "wash-e", "t b e"),
            ("SILENCED (OFF)", "Gene present in DNA", "0 HBB mRNA made", "plate", "t m"),
            ("SILENCED (OFF)", "Gene present in DNA", "0 CHAT mRNA made", "plate", "t m"),
        ),
        (
            402,
            ("Bone-Marrow Erythroblast", "Immature red cell", "2n = 46 before ejection", "wash-p", "t b p"),
            ("SWITCHED ON", "ATP synthase mRNA", "Powers synthesis", "wash-g", "t b g"),
            ("SILENCED (OFF)", "Gene present in DNA", "0 INS mRNA made", "plate", "t m"),
            ("SWITCHED ON", "HBB mRNA transcribed", "270M haemoglobin", "wash-p", "t b p"),
            ("SILENCED (OFF)", "Gene present in DNA", "0 CHAT mRNA made", "plate", "t m"),
        ),
        (
            494,
            ("Spinal Motor Neurone", "Ventral horn → muscle", "2n = 46 (100% genes)", "wash-g", "t b g"),
            ("SWITCHED ON", "ATP synthase mRNA", "Powers Na⁺/K⁺ pumps", "wash-g", "t b g"),
            ("SILENCED (OFF)", "Gene present in DNA", "0 INS mRNA made", "plate", "t m"),
            ("SILENCED (OFF)", "Gene present in DNA", "0 HBB mRNA made", "plate", "t m"),
            ("SWITCHED ON", "CHAT mRNA made", "Neurotransmitter", "wash-e", "t b e"),
        ),
    ]

    col_specs = [(28, 134), (168, 106), (280, 108), (394, 108), (508, 104)]
    for ry, *cells in rows:
        for (cx, cw), (c1, c2, c3, bcls, tcls) in zip(col_specs, cells):
            box(
                f,
                cx,
                ry,
                cw,
                84,
                [
                    (22, c1, tcls),
                    (46, c2, "t s"),
                    (68, c3, "t m"),
                ],
                bcls,
                7.8,
            )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 6. GURDON (1962) & YAMANAKA (2006) EXPERIMENTAL PROOF (#fig-12-6)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_gurdon_yamanaka_proof() -> str:
    f = Fig(
        640,
        560,
        "John Gurdon 1962 Xenopus nuclear transfer and Shinya Yamanaka 2006 iPSC reprogramming proving genome invariance",
    )
    heading(
        f,
        "12.3  How We Know No Genes Were Deleted: Gurdon (1962) & Yamanaka (2006)",
        "Two Nobel-winning experiments proving that specialised cells retain the entire genome in reversible chromatin",
    )

    # LEFT PANEL: John Gurdon 1962
    f.rect(16, 54, 296, 404, "wash-e", rx=10)
    txt(f, 164, 76, "1. John Gurdon (Oxford, 1962)", "t b e", 9.6)
    txt(f, 164, 94, "Xenopus laevis Somatic Nuclear Transfer", "t m", 8.3)

    box(
        f,
        28,
        108,
        272,
        88,
        [
            (22, "Step A: Differentiated Tadpole Gut Cell", "t b e"),
            (46, "Intestinal epithelial cell specialised for digestion;", "t s"),
            (68, "diploid (2n) nucleus extracted with micropipette", "t b"),
        ],
        "plate",
        8.2,
    )
    arr(f, 164, 198, 164, 218, "e")

    box(
        f,
        28,
        222,
        272,
        88,
        [
            (22, "Step B: UV-Enucleated Frog Egg", "t b p"),
            (46, "Egg's own haploid nucleus destroyed by UV light;", "t s"),
            (68, "egg cytoplasm resets the injected gut nucleus", "t b"),
        ],
        "wash-p",
        8.2,
    )
    arr(f, 164, 312, 164, 332, "g")

    box(
        f,
        28,
        336,
        272,
        108,
        [
            (22, "Step C: Normal Tadpole & Fertile Frog", "t b g"),
            (46, "Reprogrammed egg divides by mitosis to build", "t s"),
            (68, "functional eyes, brain, heart, muscle, and blood:", "t s"),
            (92, "proving 100% of genes were kept in the gut cell", "t b g"),
        ],
        "wash-g",
        8.2,
    )

    # RIGHT PANEL: Shinya Yamanaka 2006
    f.rect(328, 54, 296, 404, "wash-n", rx=10)
    txt(f, 476, 76, "2. Shinya Yamanaka (Kyoto, 2006)", "t b", 9.6)
    txt(f, 476, 94, "Induced Pluripotent Stem Cells (iPSCs)", "t m", 8.3)

    box(
        f,
        340,
        108,
        272,
        88,
        [
            (22, "Step A: Differentiated Skin Fibroblast", "t b p"),
            (46, "Adult skin cell expressing collagen genes;", "t s"),
            (68, "insulin, globin, and neural genes switched OFF", "t b"),
        ],
        "plate",
        8.2,
    )
    arr(f, 476, 198, 476, 218, "p")

    box(
        f,
        340,
        222,
        272,
        88,
        [
            (22, "Step B: Add 4 Transcription Factors", "t b e"),
            (46, "Introduce Oct4, Sox2, Klf4, and c-Myc", "t mono"),
            (68, "('Yamanaka factors') to unlock silent chromatin", "t b e"),
        ],
        "wash-e",
        8.2,
    )
    arr(f, 476, 312, 476, 332, "g")

    box(
        f,
        340,
        336,
        272,
        108,
        [
            (22, "Step C: Induced Pluripotent Stem Cell", "t b g"),
            (46, "Skin cell rewinds to embryonic-like iPSC state;", "t s"),
            (68, "can be directed to differentiate into beating", "t s"),
            (92, "heart cells, motor neurones, or pancreas beta cells", "t b g"),
        ],
        "wash-g",
        8.2,
    )

    # BOTTOM BANNER
    f.rect(16, 470, 608, 76, "wash-g", rx=10)
    txt(
        f,
        320,
        494,
        "Shared 2012 Nobel Prize Verdict — Specialisation Is Selective Bookmarking, Never Gene Deletion",
        "t b g",
        9.5,
    )
    txt(
        f,
        320,
        522,
        "Every nucleated human somatic cell retains all 46 chromosomes; differentiation simply switches specific genes ON or OFF.",
        "t s",
        8.6,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 7. DIPLOID (2n = 46) TO HAPLOID (n = 23) MEIOSIS & FERTILISATION (#fig-12-7)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_diploid_haploid_meiosis() -> str:
    f = Fig(
        640,
        580,
        "Meiosis reduction division halving diploid germ cells to haploid gametes and fertilisation restoring diploidy",
    )
    heading(
        f,
        "12.4  Halving the Archive: Meiosis (2n → n) & Fertilisation (n + n → 2n)",
        "Why reproductive organs must halve chromosome sets into haploid gametes so every generation stays at 2n = 46",
    )

    # TOP PANEL: 4-Stage Human Sexual Life-Cycle Loop
    f.rect(16, 54, 608, 252, "wash-e", rx=10)
    txt(
        f,
        320,
        74,
        "1. The Human Chromosome Cycle Across Meiosis, Fertilisation & Mitotic Growth",
        "t b e",
        9.6,
    )

    c_steps = [
        (
            24,
            "1. Diploid Germ Cell",
            "Testes or ovaries",
            "2n = 46 chromosomes",
            "(23 homologous pairs:",
            "23 maternal + 23 paternal)",
            "S-phase → 92 chromatids",
            "plate",
            "t b e",
        ),
        (
            174,
            "2. Meiosis I & II",
            "Reduction division",
            "Div I: homologues pair,",
            "cross over & separate",
            "(2²³ = 8.4M combinations)",
            "Div II: chromatids part",
            "wash-p",
            "t b p",
        ),
        (
            324,
            "3. Haploid Gametes",
            "4 genetically unique cells",
            "Sperm nucleus: n = 23",
            "Egg nucleus: n = 23",
            "Each holds a single set",
            "of 23 chromosomes",
            "wash-e",
            "t b e",
        ),
        (
            474,
            "4. Fertilisation",
            "Fusion of gamete nuclei",
            "n (23) + n (23) = 2n (46)",
            "Forms Diploid Zygote;",
            "then divides by MITOSIS",
            "into 37 trillion body cells",
            "wash-g",
            "t b g",
        ),
    ]
    for cx, ct, c1, c2, c3, c4, c5, bcls, tcls in c_steps:
        box(
            f,
            cx,
            88,
            142,
            204,
            [
                (24, ct, tcls),
                (48, c1, "t m"),
                (76, c2, "t b"),
                (102, c3, "t s"),
                (124, c4, "t s"),
                (152, c5, tcls),
                (182, "0610 17.3 & 16.2", "t m"),
            ],
            bcls,
            8.0,
        )

    # BOTTOM PANEL: Weismann's Proof by Contradiction
    f.rect(16, 320, 608, 244, "wash-n", rx=10)
    txt(
        f,
        320,
        342,
        "2. August Weismann's Arithmetic Proof — Why Gametes Cannot Be Made by Mitosis",
        "t b",
        9.6,
    )

    box(
        f,
        28,
        358,
        286,
        192,
        [
            (24, "With Meiosis (Actual Biology)", "t b g"),
            (54, "Parents: diploid body cells (2n = 46)", "t s"),
            (80, "Meiosis halves count → Gametes (n = 23)", "t b e"),
            (108, "Gen 1 Zygote: 23 + 23 = 46 (2n restored)", "t b g"),
            (134, "Gen 2 Grandchild: 23 + 23 = 46 (2n stable)", "t b g"),
            (162, "Result: Stable 46-chromosome karyotype", "t s"),
            (180, "plus ~70 trillion novel allele combinations", "t m"),
        ],
        "wash-g",
        8.3,
    )

    box(
        f,
        326,
        358,
        286,
        192,
        [
            (24, "Without Meiosis (If Gametes Used Mitosis)", "t b p"),
            (54, "Parents: diploid body cells (2n = 46)", "t s"),
            (80, "Hypothetical mitotic gametes → 2n = 46", "t b p"),
            (108, "Gen 1 Zygote: 46 + 46 = 92 chromosomes (4n)", "t b p"),
            (134, "Gen 2: 184 → Gen 3: 368 → Gen 10: 47,104", "t mono"),
            (162, "Result: Catastrophic doubling every generation", "t s"),
            (180, "would physically burst the cell nucleus", "t m"),
        ],
        "wash-p",
        8.3,
    )

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 8. MITOSIS vs MEIOSIS SIDE-BY-SIDE LEDGER (#fig-12-8)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_mitosis_vs_meiosis_ledger() -> str:
    f = Fig(
        640,
        590,
        "Complete comparison ledger of mitosis versus meiosis for Cambridge IGCSE Biology 0610",
    )
    heading(
        f,
        "12.4  Master Comparison Ledger: Mitosis vs Meiosis (IGCSE 0610 17.2 & 17.3)",
        "How one round of DNA replication feeds either one conservation division (mitosis) or two reduction divisions (meiosis)",
    )

    # Table column headers
    box(f, 16, 56, 168, 38, [(24, "Comparison Feature", "t b")], "wash-n", 8.6)
    box(f, 190, 56, 214, 38, [(24, "MITOSIS (Conservation Division)", "t b e")], "wash-e", 8.6)
    box(f, 410, 56, 214, 38, [(24, "MEIOSIS (Reduction Division)", "t b p")], "wash-p", 8.6)

    rows = [
        (
            102,
            ("1. Where it occurs", "In the organism"),
            ("Somatic (body) cells, stem cells,", "and plant apical meristems"),
            ("Germ-line cells inside reproductive", "organs (testes, ovaries, anthers, ovules)"),
        ),
        (
            170,
            ("2. DNA replication", "Before division"),
            ("1 exact replication in interphase", "(human 46 → 92 sister chromatids)"),
            ("1 exact replication before Meiosis I", "(human 46 → 92 sister chromatids)"),
        ),
        (
            238,
            ("3. Nuclear divisions", "Number of splits"),
            ("1 nuclear division (sister chromatids", "separate to opposite poles)"),
            ("2 nuclear divisions: Div I separates", "homologues; Div II separates chromatids"),
        ),
        (
            306,
            ("4. Daughter cells", "Count per parent"),
            ("2 daughter cells produced", "per dividing parent cell"),
            ("4 daughter cells (gametes) produced", "per dividing germ-line cell"),
        ),
        (
            374,
            ("5. Ploidy & count", "Human chromosomes"),
            ("Diploid maintained: 2n → 2n", "(human 46 → 46, 23 pairs)"),
            ("Halved from diploid to haploid: 2n → n", "(human 46 → 23, single set)"),
        ),
        (
            442,
            ("6. Genetic identity", "Comparison of cells"),
            ("Genetically identical to each other", "and to the parent cell (clones)"),
            ("Genetically different from each other", "and from the parent cell"),
        ),
        (
            510,
            ("7. Biological role", "Why the organism uses it"),
            ("Growth, tissue repair, replacement", "of worn-out cells, asexual reproduction"),
            ("Production of haploid gametes for", "sexual reproduction & genetic variation"),
        ),
    ]

    for ry, (f1, f2), (m1, m2), (me1, me2) in rows:
        box(f, 16, ry, 168, 60, [(24, f1, "t b"), (44, f2, "t m")], "plate", 8.1)
        box(f, 190, ry, 214, 60, [(24, m1, "t b e"), (44, m2, "t s")], "wash-e", 8.0)
        box(f, 410, ry, 214, 60, [(24, me1, "t b p"), (44, me2, "t s")], "wash-p", 8.0)

    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 9. CASE 12: TRIPLOID CAVENDISH BANANA (3n = 33) & SUGARCANE (#fig-12-9)
# ──────────────────────────────────────────────────────────────────────
@figure
def c12_triploid_banana_case() -> str:
    f = Fig(
        640,
        590,
        "Case 12 synthesis: wild diploid seeded banana versus sterile triploid Cavendish banana and Janaki Ammal polyploid sugarcane",
    )
    heading(
        f,
        "Case 12  Why Your Cavendish Banana Has No Seeds — And Why One Fungus Threatens It",
        "Even diploid sets (2n = 22) pass through meiosis; odd triploid sets (3n = 33) jam Meiosis I and force mitotic cloning",
    )

    # Three comparative columns
    cols = [
        (
            16,
            "1. Wild Ancestral Banana",
            "Musa acuminata (Diploid 2n = 22)",
            "11 homologous pairs (2 × 11)",
            "Meiosis I splits pairs 11 + 11",
            "Viable haploid gametes (n = 11)",
            "Fertilisation forms hard black seeds",
            "Sexual reproduction reshuffles alleles:",
            "wild populations evolve resistance",
            "against Fusarium TR4 soil fungus",
            "wash-g",
            "t b g",
        ),
        (
            224,
            "2. Cavendish Export Banana",
            "Triploid cultivar (3n = 33, AAA)",
            "11 homologous triplets (3 × 11)",
            "Odd triplets split 2-vs-1 at random",
            "Meiotic traffic jam → gametes abort",
            "Sterile, seedless yellow fruit",
            "Propagated only by MITOSIS (rhizome",
            "suckers & meristem tissue culture):",
            "100% genetic clones vulnerable to TR4",
            "wash-p",
            "t b p",
        ),
        (
            432,
            "3. Janaki Ammal's Sugarcane",
            "Coimbatore hybrids (1930s)",
            "S. officinarum (2n = 80, sweet) ×",
            "S. spontaneum (2n = 48–128, hardy)",
            "Counted chromosomes in meiosis",
            "Selected fertile high-ploidy hybrids",
            "Combines both division strategies:",
            "meiotic cross creates hardy hybrid;",
            "mitotic stem cuttings clone the crop",
            "wash-e",
            "t b e",
        ),
    ]

    for cx, ctitle, csub, l1, l2, l3, l4, l5, l6, l7, bcls, tcls in cols:
        box(
            f,
            cx,
            58,
            192,
            396,
            [
                (26, ctitle, tcls),
                (48, csub, "t m"),
                (82, "Chromosome set:", "t m"),
                (104, l1, "t b"),
                (136, "Meiosis behaviour:", "t m"),
                (158, l2, tcls),
                (184, l3, "t b"),
                (210, l4, "t s"),
                (252, "Agricultural consequence:", "t m"),
                (278, l5, "t s"),
                (302, l6, "t s"),
                (326, l7, tcls),
                (368, "Chapter 12 Synthesis", "t m"),
            ],
            bcls,
            8.1,
        )

    # Bottom synthesis strip tying all 4 sections together
    f.rect(16, 468, 608, 108, "wash-n", rx=10)
    txt(
        f,
        320,
        490,
        "How All Four Mechanisms of Chapter 12 Interlock in a Single Banana Plantation",
        "t b e",
        9.5,
    )
    txt(
        f,
        320,
        516,
        "12.1 Semi-conservative replication copies all 33 chromosomes → 12.2 Mitosis clones suckers with 0 genetic variation →",
        "t s",
        8.4,
    )
    txt(
        f,
        320,
        540,
        "12.3 Shoot-tip meristem stem cells express root/leaf genes in tissue culture → 12.4 Triploid (3n = 33) meiosis jam blocks seed set.",
        "t b g",
        8.4,
    )
    txt(
        f,
        320,
        562,
        "Next in Chapter 13: How do homologous chromosome pairs carry dominant and recessive alleles across generations?",
        "t m",
        8.2,
    )

    return f.svg()
