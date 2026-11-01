"""Chapter 13 original SVG plates — The Monk's Spreadsheet: Mendel, Alleles & Inheritance.

Nine bespoke figures built on figs_core primitives:
1. c13_mendel_peas_ratios       (#fig-13-1, upgraded by w_mendel_punnett_simulator.js)
2. c13_homologous_loci_alleles  (#fig-13-2)
3. c13_punnett_test_cross_ledger(#fig-13-3)
4. c13_pedigree_detective_rules (#fig-13-4)
5. c13_codominance_abo_blood    (#fig-13-5, upgraded by w_abo_codominance_pedigree.js)
6. c13_dominance_vs_codominance (#fig-13-6)
7. c13_xx_xy_sex_determination  (#fig-13-7)
8. c13_x_linked_inheritance     (#fig-13-8, upgraded by w_sex_linked_cross_lab.js)
9. c13_mumbai_maternity_case    (#fig-13-9)
"""

from figs_core import Fig, figure

ARROW_KIND = {"e": "electron", "p": "proton", "g": "green", "ink": "ink"}


def heading(f: Fig, title: str, sub: str) -> None:
    f.text(320, 22, title, "t b", "middle", 11.4)
    f.text(320, 40, sub, "t m", "middle", 8.8)


def txt(
    f: Fig,
    x: float,
    y: float,
    s: str,
    cls: str = "t",
    size: float = 8.8,
    anchor: str = "middle",
) -> None:
    f.text(x, y, s, cls, anchor, size)


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
        f.text(x + w / 2, y + dy, s, tcls, "middle", size)


# ──────────────────────────────────────────────────────────────────────
# 1. MENDEL'S BRNO PEA LEDGER & 3:1 PARTICULATE PROOF (#fig-13-1)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_mendel_peas_ratios() -> str:
    f = Fig(
        640,
        590,
        "Johann Gregor Mendel 1866 Brno pea breeding crosses (P, F1, F2, F3) and the 19,959-outcome ledger disproving blending inheritance",
    )
    heading(
        f,
        "13.1  The Monk's Spreadsheet: Particulate Inheritance vs Blending (Brno, 1856–1866)",
        "Why recessive traits vanish in F₁ hybrids (100% dominant) and return unblemished at 25% in F₂ (3 : 1 ratio)",
    )

    # LEFT PANEL: P -> F1 -> F2 -> F3 Experimental Flow
    f.rect(16, 54, 296, 424, "wash-e", rx=10)
    txt(f, 164, 74, "1. Controlled Pea Crosses (Pisum sativum)", "t b e", 9.4)
    txt(f, 164, 91, "Anthers clipped early to prevent unplanned self-pollination", "t m", 8.1)

    box(
        f,
        28,
        102,
        272,
        74,
        [
            (20, "Parental (P): Pure-Breeding Lines", "t b p"),
            (40, "Pure Round (RR)  ×  Pure Wrinkled (rr)", "t mono"),
            (59, "Gametes: 100% R eggs  ×  100% r sperm", "t m"),
        ],
        "wash-p",
        8.2,
    )

    arr(f, 164, 178, 164, 198, "e")

    box(
        f,
        28,
        200,
        272,
        74,
        [
            (20, "First Filial (F₁): 100% Uniform Hybrids (Rr)", "t b e"),
            (40, "Observed: 100% Round seeds (0% Wrinkled)", "t b g"),
            (59, "Blending predicts medium-wrinkled; r stays intact", "t m"),
        ],
        "plate",
        8.2,
    )

    arr(f, 164, 276, 164, 296, "g")

    box(
        f,
        28,
        298,
        272,
        78,
        [
            (20, "Second Filial (F₂): F₁ Self-Pollination (Rr × Rr)", "t b g"),
            (40, "5,474 Round (74.7%) : 1,850 Wrinkled (25.3%)", "t mono"),
            (60, "Observed ratio = 2.96 : 1  (Theoretical = 3 : 1)", "t m"),
        ],
        "wash-g",
        8.2,
    )

    arr(f, 164, 378, 164, 396, "p")

    box(
        f,
        28,
        398,
        272,
        70,
        [
            (20, "Third Filial (F₃) Progeny Test of 565 Round F₂", "t b p"),
            (39, "193 bred true (RR) : 372 segregated 3:1 (Rr)", "t mono"),
            (56, "Proves hidden 1 RR : 2 Rr : 1 rr genotype ratio", "t m"),
        ],
        "plate",
        8.1,
    )

    # RIGHT PANEL: All 7 Characters in Mendel's 1866 Paper
    f.rect(324, 54, 300, 424, "wash-g", rx=10)
    txt(f, 474, 74, "2. Mendel's 1866 Brno F₂ Ledger (7 Traits)", "t b g", 9.4)
    txt(f, 474, 91, "19,959 scored F₂ seeds and plants converge on 2.98 : 1", "t m", 8.1)

    rows_data = [
        ("1. Seed shape (R/r)", "5,474 Round : 1,850 Wrinkled", "2.96 : 1"),
        ("2. Cotyledon (Y/y)", "6,022 Yellow : 2,001 Green", "3.01 : 1"),
        ("3. Flower colour (B/b)", "705 Purple : 224 White", "3.15 : 1"),
        ("4. Pod form (P/p)", "882 Inflated : 299 Constricted", "2.95 : 1"),
        ("5. Unripe pod (G/g)", "428 Green : 152 Yellow", "2.82 : 1"),
        ("6. Flower site (Fa/fa)", "651 Axial : 207 Terminal", "3.14 : 1"),
        ("7. Stem height (T/t)", "787 Tall : 277 Dwarf", "2.84 : 1"),
    ]

    for idx, (trait_lbl, counts_lbl, ratio_lbl) in enumerate(rows_data):
        ry = 104 + idx * 44
        f.rect(336, ry, 276, 38, "plate", rx=6)
        txt(f, 344, ry + 15, trait_lbl, "t b", 8.1, "start")
        txt(f, 604, ry + 15, ratio_lbl, "t b e", 8.2, "end")
        txt(f, 344, ry + 31, counts_lbl, "t mono m", 7.8, "start")

    box(
        f,
        336,
        414,
        276,
        54,
        [
            (19, "Grand Total Across All 7 Characters", "t b g"),
            (39, "14,949 Dom (74.9%) : 5,010 Rec (25.1%) = 2.98 : 1", "t mono"),
        ],
        "wash-e",
        8.1,
    )

    # BOTTOM STRIP: Why Blending Fails & Particulate Succeeds
    box(
        f,
        16,
        490,
        608,
        84,
        [
            (22, "Why Mendel's Ledger Defeated the Paint-Pot Blending Hypothesis", "t b"),
            (
                44,
                "If alleles mixed like paint, F₁ hybrids would be intermediate and F₂ could never recover pure white flowers or wrinkled seeds.",
                "t",
            ),
            (
                65,
                "Instead, alleles are discrete DNA packets: meiosis separates them cleanly into haploid gametes (n), and fertilisation re-pairs them (2n).",
                "t b e",
            ),
        ],
        "plate",
        8.3,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 2. HOMOLOGOUS LOCI, ALLELES & ENZYME DOMINANCE (#fig-13-2)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_homologous_loci_alleles() -> str:
    f = Fig(
        640,
        590,
        "Homologous chromosomes showing matching gene loci, homozygous and heterozygous allele pairs, and SBEI enzyme haplosufficiency",
    )
    heading(
        f,
        "13.1  Genes, Loci & Alleles on Homologous Chromosomes (Diploid 2n)",
        "One working R copy supplies enough SBEI for round seeds; allele counts do not measure enzyme percentages",
    )

    # TOP PANEL: Homologous Chromosome Pair with 3 Loci
    f.rect(16, 54, 608, 178, "wash-e", rx=10)
    txt(
        f,
        320,
        74,
        "1. One Homologous Pair of Chromosomes in a Diploid Nucleus (2n)",
        "t b e",
        9.4,
    )
    txt(
        f,
        320,
        91,
        "Same length, centromere position, and gene order (loci) — one maternal homologue + one paternal homologue",
        "t m",
        8.1,
    )

    # Maternal homologue bar
    f.rect(44, 108, 552, 34, "wash-p", rx=14)
    txt(f, 108, 129, "Maternal Homologue", "t b p", 8.3)
    f.rect(204, 112, 96, 26, "plate", rx=5)
    txt(f, 252, 129, "Locus 1: R", "t b g", 8.3)
    f.rect(334, 112, 96, 26, "plate", rx=5)
    txt(f, 382, 129, "Locus 2: B", "t b e", 8.3)
    f.rect(464, 112, 96, 26, "plate", rx=5)
    txt(f, 512, 129, "Locus 3: t", "t b p", 8.3)

    # Paternal homologue bar
    f.rect(44, 154, 552, 34, "wash-g", rx=14)
    txt(f, 108, 175, "Paternal Homologue", "t b e", 8.3)
    f.rect(204, 158, 96, 26, "plate", rx=5)
    txt(f, 252, 175, "Locus 1: R", "t b g", 8.3)
    f.rect(334, 158, 96, 26, "plate", rx=5)
    txt(f, 382, 175, "Locus 2: b", "t b p", 8.3)
    f.rect(464, 158, 96, 26, "plate", rx=5)
    txt(f, 512, 175, "Locus 3: t", "t b p", 8.3)

    txt(f, 252, 214, "RR = Homozygous dom", "t b g", 8.1)
    txt(f, 382, 214, "Bb = Heterozygous", "t b e", 8.1)
    txt(f, 512, 214, "tt = Homozygous rec", "t b p", 8.1)

    # MIDDLE PANEL: Three Genotype Cards (RR, Rr, rr) showing SBEI Enzyme Molecular Mechanism
    f.rect(16, 244, 608, 232, "wash-g", rx=10)
    txt(
        f,
        320,
        264,
        "2. Molecular Mechanism of Dominance: Starch-Branching Enzyme I (SBEI) in Pea Seeds",
        "t b g",
        9.4,
    )
    txt(
        f,
        320,
        281,
        "Connects Chapter 11 (DNA → mRNA → enzyme) and Chapter 4 (enzyme active site) to Chapter 13 (phenotype)",
        "t m",
        8.1,
    )

    box(
        f,
        28,
        294,
        184,
        168,
        [
            (22, "Homozygous Dominant", "t b g"),
            (42, "Genotype: RR (2 functional copies)", "t mono"),
            (64, "Two working R copies", "t b e"),
            (86, "Builds branched starch", "t"),
            (108, "Low free sucrose; normal osmosis", "t m"),
            (132, "Phenotype: ROUND SEED", "t b g"),
            (152, "Breeds true on self-pollination", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        228,
        294,
        184,
        168,
        [
            (22, "Heterozygous Hybrid", "t b e"),
            (42, "Genotype: Rr (1 R + 1 mutant r)", "t mono"),
            (64, "One working R copy", "t b e"),
            (86, "Enough enzyme for round seeds", "t"),
            (108, "Still builds full amylopectin starch", "t m"),
            (132, "Phenotype: ROUND SEED", "t b g"),
            (152, "Carries hidden r allele to 50% gametes", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        428,
        294,
        184,
        168,
        [
            (22, "Homozygous Recessive", "t b p"),
            (42, "Genotype: rr (0.8 kb insertion)", "t mono"),
            (64, "No functional SBEI", "t b p"),
            (86, "Soluble sucrose accumulates", "t"),
            (108, "Osmotic water influx → shrinks dry", "t m"),
            (132, "Phenotype: WRINKLED SEED", "t b p"),
            (152, "Appears only when R is absent", "t m"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM PANEL: Core Definitions Rule
    box(
        f,
        16,
        488,
        608,
        86,
        [
            (22, "Core Vocabulary Lock: Gene vs Allele vs Genotype vs Phenotype", "t b"),
            (
                44,
                "Gene = length of DNA coding for a protein (e.g. SBEI locus)  |  Allele = alternative version of that gene (R vs r)",
                "t",
            ),
            (
                66,
                "Genotype = allele combination carried in DNA (RR, Rr, or rr)  |  Phenotype = observable feature produced (Round vs Wrinkled)",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 3. MONOHYBRID 3:1 PUNNETT VS 1:1 DIAGNOSTIC TEST CROSS (#fig-13-3)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_punnett_test_cross_ledger() -> str:
    f = Fig(
        640,
        590,
        "Side-by-side Cambridge genetic diagrams for the monohybrid F1 cross (Rr x Rr -> 3:1) and the diagnostic test cross (Rr x rr -> 1:1)",
    )
    heading(
        f,
        "13.2  The Punnett Ledger: 3 : 1 Monohybrid Cross vs 1 : 1 Diagnostic Test Cross",
        "Every six-line genetic diagram tracks diploid parents (2n) → circled haploid gametes (n) → 2×2 fertilisation grid (2n)",
    )

    # LEFT PANEL: Monohybrid Hybrid Cross (Rr x Rr)
    f.rect(16, 54, 296, 424, "wash-e", rx=10)
    txt(f, 164, 74, "1. Monohybrid Cross: Heterozygote × Heterozygote", "t b e", 9.1)
    txt(f, 164, 91, "Parents: Purple flower (Bb)  ×  Purple flower (Bb)", "t m", 8.1)

    box(
        f,
        28,
        102,
        272,
        52,
        [
            (19, "Meiosis separates homologous alleles (2n → n)", "t b e"),
            (38, "Eggs: (B) 50%, (b) 50%   |   Sperm: (B) 50%, (b) 50%", "t mono"),
        ],
        "plate",
        8.0,
    )

    # 2x2 Grid Left
    f.rect(28, 164, 76, 32, "wash-p", rx=5)
    txt(f, 66, 184, "Gametes", "t b", 8.1)
    f.rect(110, 164, 92, 32, "wash-p", rx=5)
    txt(f, 156, 184, "Pollen (B) ½", "t b e", 8.2)
    f.rect(208, 164, 92, 32, "wash-p", rx=5)
    txt(f, 254, 184, "Pollen (b) ½", "t b p", 8.2)

    # Row 1 Left
    f.rect(28, 202, 76, 62, "wash-p", rx=5)
    txt(f, 66, 228, "Ovule (B)", "t b e", 8.2)
    txt(f, 66, 246, "½ (50%)", "t m", 7.8)

    box(
        f,
        110,
        202,
        92,
        62,
        [
            (22, "BB (25%)", "t b g"),
            (44, "Purple petal", "t"),
        ],
        "plate",
        8.2,
    )
    box(
        f,
        208,
        202,
        92,
        62,
        [
            (22, "Bb (25%)", "t b g"),
            (44, "Purple petal", "t"),
        ],
        "plate",
        8.2,
    )

    # Row 2 Left
    f.rect(28, 270, 76, 62, "wash-p", rx=5)
    txt(f, 66, 296, "Ovule (b)", "t b p", 8.2)
    txt(f, 66, 314, "½ (50%)", "t m", 7.8)

    box(
        f,
        110,
        270,
        92,
        62,
        [
            (22, "Bb (25%)", "t b g"),
            (44, "Purple petal", "t"),
        ],
        "plate",
        8.2,
    )
    box(
        f,
        208,
        270,
        92,
        62,
        [
            (22, "bb (25%)", "t b p"),
            (44, "White petal", "t"),
        ],
        "wash-p",
        8.2,
    )

    box(
        f,
        28,
        344,
        272,
        122,
        [
            (22, "Monohybrid F₂ Ledger Summary", "t b e"),
            (44, "Genotype ratio:  1 BB : 2 Bb : 1 bb  (25% : 50% : 25%)", "t mono"),
            (66, "Phenotype ratio: 3 Purple : 1 White  (75% : 25%)", "t b g"),
            (88, "Among Purple offspring: 1/3 are BB, 2/3 are Bb carriers", "t"),
            (108, "Each fertilisation is an independent probability event", "t m"),
        ],
        "plate",
        8.0,
    )

    # RIGHT PANEL: Diagnostic Test Cross (Bb x bb)
    f.rect(324, 54, 300, 424, "wash-g", rx=10)
    txt(f, 474, 74, "2. Diagnostic Test Cross: Unknown B_ × Tester bb", "t b g", 9.1)
    txt(f, 474, 91, "How to distinguish homozygous BB from heterozygous Bb", "t m", 8.1)

    box(
        f,
        336,
        102,
        276,
        52,
        [
            (19, "Cross mystery Purple plant with White recessive (bb)", "t b g"),
            (38, "If mystery parent is Bb → gametes (B) 50%, (b) 50%", "t mono"),
        ],
        "plate",
        8.0,
    )

    # 2x2 Grid Right
    f.rect(336, 164, 76, 32, "wash-p", rx=5)
    txt(f, 374, 184, "Gametes", "t b", 8.1)
    f.rect(418, 164, 94, 32, "wash-p", rx=5)
    txt(f, 465, 184, "Tester (b) ½", "t b p", 8.2)
    f.rect(518, 164, 94, 32, "wash-p", rx=5)
    txt(f, 565, 184, "Tester (b) ½", "t b p", 8.2)

    # Row 1 Right
    f.rect(336, 202, 76, 62, "wash-p", rx=5)
    txt(f, 374, 228, "Parent (B)", "t b e", 8.2)
    txt(f, 374, 246, "½ (50%)", "t m", 7.8)

    box(
        f,
        418,
        202,
        94,
        62,
        [
            (22, "Bb (25%)", "t b g"),
            (44, "Purple petal", "t"),
        ],
        "plate",
        8.2,
    )
    box(
        f,
        518,
        202,
        94,
        62,
        [
            (22, "Bb (25%)", "t b g"),
            (44, "Purple petal", "t"),
        ],
        "plate",
        8.2,
    )

    # Row 2 Right
    f.rect(336, 270, 76, 62, "wash-p", rx=5)
    txt(f, 374, 296, "Parent (b)", "t b p", 8.2)
    txt(f, 374, 314, "½ (50%)", "t m", 7.8)

    box(
        f,
        418,
        270,
        94,
        62,
        [
            (22, "bb (25%)", "t b p"),
            (44, "White petal", "t"),
        ],
        "wash-p",
        8.2,
    )
    box(
        f,
        518,
        270,
        94,
        62,
        [
            (22, "bb (25%)", "t b p"),
            (44, "White petal", "t"),
        ],
        "wash-p",
        8.2,
    )

    box(
        f,
        336,
        344,
        276,
        122,
        [
            (22, "Test-Cross Diagnostic Verdict", "t b g"),
            (44, "Case A (Bb × bb): 1 Bb : 1 bb → 1 Purple : 1 White (50% : 50%)", "t mono"),
            (66, "Case B (BB × bb): 100% Bb → 100% Purple, 0% White", "t b e"),
            (88, "Even a single white (bb) offspring proves the parent", "t"),
            (108, "carried a hidden recessive b allele (heterozygous Bb)", "t m"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM STRIP: Six-Line Exam Checklist
    box(
        f,
        16,
        490,
        608,
        84,
        [
            (22, "The Six-Line Genetic Diagram Checklist (Cambridge 0610 Standard)", "t b"),
            (
                44,
                "1. Parental phenotypes   2. Parental genotypes (2 letters each)   3. Gametes (1 letter inside a circle)",
                "t",
            ),
            (
                65,
                "4. 2×2 Punnett grid   5. Offspring genotypes & phenotypes   6. Simplest whole-number ratio (3 : 1 or 1 : 1)",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 4. PEDIGREE DETECTIVE RULES (#fig-13-4)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_pedigree_detective_rules() -> str:
    f = Fig(
        640,
        590,
        "Pedigree chart symbols and the two diagnostic proof patterns for autosomal recessive versus autosomal dominant inheritance",
    )
    heading(
        f,
        "13.2  Reading Family Trees: Two Powerful Pedigree Clues",
        "Model assumptions: one autosomal gene, complete expression, no new mutation",
    )

    # TOP BAR: Standard Pedigree Key
    box(
        f,
        16,
        54,
        608,
        58,
        [
            (
                20,
                "Pedigree Chart Key:   □ = Male   |   ○ = Female   |   Unshaded = Unaffected   |   Shaded = Affected",
                "t b",
            ),
            (
                41,
                "Horizontal line between □ and ○ = Parents   |   Vertical drop to bracket = Children in birth order (Generations I, II, III)",
                "t m",
            ),
        ],
        "plate",
        8.2,
    )

    # LEFT PANEL: Rule 1 — Recessive Proof
    f.rect(16, 122, 296, 362, "wash-e", rx=10)
    txt(f, 164, 142, "Rule 1: Unaffected Parents → Affected Child", "t b e", 9.2)
    txt(f, 164, 159, "Proves the condition is RECESSIVE (aa)", "t b g", 8.4)

    # Generation I (Parents) Left
    f.rect(64, 174, 82, 48, "plate", rx=6)
    txt(f, 105, 194, "I-1 Father □", "t b", 8.2)
    txt(f, 105, 212, "Unaffected (Aa)", "t m", 7.8)

    f.line(146, 198, 182, 198, "ink", 1.8)

    f.rect(182, 174, 82, 48, "plate", rx=24)
    txt(f, 223, 194, "I-2 Mother ○", "t b", 8.2)
    txt(f, 223, 212, "Unaffected (Aa)", "t m", 7.8)

    arr(f, 164, 200, 164, 240, "e")

    # Generation II (Children) Left
    box(
        f,
        28,
        244,
        84,
        58,
        [
            (20, "II-1 □ Normal", "t b"),
            (38, "AA or Aa", "t mono"),
            (52, "(2/3 carrier)", "t m"),
        ],
        "plate",
        7.8,
    )
    box(
        f,
        122,
        244,
        84,
        58,
        [
            (20, "II-2 ● Affected", "t b p"),
            (38, "Genotype: aa", "t mono"),
            (52, "(25% chance)", "t m"),
        ],
        "wash-p",
        7.8,
    )
    box(
        f,
        216,
        244,
        84,
        58,
        [
            (20, "II-3 ○ Normal", "t b"),
            (38, "AA or Aa", "t mono"),
            (52, "(2/3 carrier)", "t m"),
        ],
        "plate",
        7.8,
    )

    box(
        f,
        28,
        314,
        272,
        158,
        [
            (22, "Recessive Deduction in This Model", "t b e"),
            (44, "1. Child II-2 is affected (aa), so II-2 inherited", "t"),
            (62, "   one a allele from I-1 and one a allele from I-2.", "t"),
            (84, "2. Because parents I-1 and I-2 are unaffected,", "t"),
            (102, "   each must also carry a dominant A allele (Aa).", "t"),
            (124, "3. Therefore a is RECESSIVE, and the trait can", "t b g"),
            (142, "   skip generations silently inside Aa carriers.", "t b g"),
        ],
        "plate",
        8.0,
    )

    # RIGHT PANEL: Rule 2 — Dominant Proof
    f.rect(324, 122, 300, 362, "wash-g", rx=10)
    txt(f, 474, 142, "Rule 2: Affected Parents → Unaffected Child", "t b g", 9.2)
    txt(f, 474, 159, "Proves the condition is DOMINANT (A_)", "t b p", 8.4)

    # Generation I (Parents) Right
    f.rect(374, 174, 84, 48, "wash-p", rx=6)
    txt(f, 416, 194, "I-1 Father ■", "t b p", 8.2)
    txt(f, 416, 212, "Affected (Aa)", "t m", 7.8)

    f.line(458, 198, 492, 198, "ink", 1.8)

    f.rect(492, 174, 84, 48, "wash-p", rx=24)
    txt(f, 534, 194, "I-2 Mother ●", "t b p", 8.2)
    txt(f, 534, 212, "Affected (Aa)", "t m", 7.8)

    arr(f, 474, 200, 474, 240, "g")

    # Generation II (Children) Right
    box(
        f,
        336,
        244,
        86,
        58,
        [
            (20, "II-1 ■ Affected", "t b p"),
            (38, "AA or Aa", "t mono"),
            (52, "(75% chance)", "t m"),
        ],
        "wash-p",
        7.8,
    )
    box(
        f,
        431,
        244,
        86,
        58,
        [
            (20, "II-2 ○ Normal", "t b g"),
            (38, "Genotype: aa", "t mono"),
            (52, "(25% chance)", "t m"),
        ],
        "plate",
        7.8,
    )
    box(
        f,
        526,
        244,
        86,
        58,
        [
            (20, "II-3 ● Affected", "t b p"),
            (38, "AA or Aa", "t mono"),
            (52, "(75% chance)", "t m"),
        ],
        "wash-p",
        7.8,
    )

    box(
        f,
        336,
        314,
        276,
        158,
        [
            (22, "Dominant Deduction in This Model", "t b g"),
            (44, "1. If the condition were recessive, both affected", "t"),
            (62, "   parents would be aa × aa → 100% affected children.", "t"),
            (84, "2. Having an unaffected child (II-2, aa) proves", "t"),
            (102, "   both affected parents carried a hidden a (Aa).", "t"),
            (124, "3. Therefore the condition is DOMINANT (A), and", "t b p"),
            (142, "   unaffected children (aa) cannot pass it on.", "t b p"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM BAR: Consanguinity & Sanghvi Note
    box(
        f,
        16,
        494,
        608,
        80,
        [
            (21, "Population Genetics Insight (L. D. Sanghvi, Mumbai):", "t b"),
            (
                43,
                "Rare recessive alleles (like beta-thalassaemia or sickle-cell Hbˢ) stay hidden in healthy heterozygous carriers (Aa).",
                "t",
            ),
            (
                63,
                "Pedigree analysis + carrier screening identifies Aa × Aa couples before a child inherits aa (25% risk per pregnancy).",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 5. CODOMINANCE & MULTIPLE ALLELES: ABO BLOOD GROUPS (#fig-13-5)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_codominance_abo_blood() -> str:
    f = Fig(
        640,
        590,
        "Chromosome 9 ABO glycosyltransferase alleles (IA, IB, IO), the six diploid genotypes across four blood groups, and the four-group Punnett cross",
    )
    heading(
        f,
        "13.3  Beyond Simple Dominance: ABO Multiple Alleles & Codominance (Iᴬ, Iᴮ, Iᴼ)",
        "Three alleles exist in the human population on Chromosome 9, but each diploid person inherits exactly two",
    )

    # TOP PANEL: The 3 Alleles at the Chromosome 9 ABO Locus
    f.rect(16, 54, 608, 136, "wash-e", rx=10)
    txt(
        f,
        320,
        73,
        "1. Molecular Action of the Three ABO Alleles on Red Blood Cell H-Antigen Stalks",
        "t b e",
        9.2,
    )

    box(
        f,
        28,
        84,
        184,
        94,
        [
            (20, "Allele Iᴬ (Functional GTA)", "t b e"),
            (40, "Adds N-acetylgalactosamine", "t"),
            (58, "(GalNAc sugar) to H-stalk", "t m"),
            (78, "Builds Surface ANTIGEN A", "t b e"),
        ],
        "plate",
        8.0,
    )
    box(
        f,
        228,
        84,
        184,
        94,
        [
            (20, "Allele Iᴮ (Functional GTB)", "t b g"),
            (40, "Adds D-galactose sugar", "t"),
            (58, "(D-Gal) to H-antigen stalk", "t m"),
            (78, "Builds Surface ANTIGEN B", "t b g"),
        ],
        "plate",
        8.0,
    )
    box(
        f,
        428,
        84,
        184,
        94,
        [
            (20, "Allele Iᴼ (ΔG261 Frameshift)", "t b p"),
            (40, "Single-base deletion inactivates", "t"),
            (58, "transferase enzyme (0% activity)", "t m"),
            (78, "Leaves H-STALK UNMODIFIED", "t b p"),
        ],
        "plate",
        8.0,
    )

    # LOWER LEFT PANEL: 6 Diploid Genotypes -> 4 Phenotypes Table
    f.rect(16, 200, 314, 286, "wash-g", rx=10)
    txt(f, 173, 220, "2. Six Genotypes → Four Blood Groups", "t b g", 9.2)
    txt(f, 173, 237, "Landsteiner's Rule: plasma antibodies vs missing antigens", "t m", 7.9)

    abo_rows = [
        ("Group A", "IᴬIᴬ or IᴬIᴼ", "Antigen A only", "Anti-B in plasma", "e"),
        ("Group B", "IᴮIᴮ or IᴮIᴼ", "Antigen B only", "Anti-A in plasma", "g"),
        ("Group AB", "IᴬIᴮ (Codom)", "Both A and B", "No Anti-A / Anti-B", "p"),
        ("Group O", "IᴼIᴼ (Recess)", "Neither A nor B", "Both Anti-A & Anti-B", "ink"),
    ]

    for idx, (grp, geno, ag, ab, col) in enumerate(abo_rows):
        ry = 248 + idx * 56
        f.rect(28, ry, 290, 48, "plate", rx=6)
        txt(f, 38, ry + 19, f"{grp}:  {geno}", f"t b {col}", 8.3, "start")
        txt(f, 38, ry + 37, f"RBC: {ag}  |  Plasma: {ab}", "t m", 7.8, "start")

    # LOWER RIGHT PANEL: The 4-Group Cross (IAIO x IBIO)
    f.rect(340, 200, 284, 286, "wash-p", rx=10)
    txt(f, 482, 220, "3. The Four-Blood-Group Family Cross", "t b p", 9.2)
    txt(f, 482, 237, "Mother Group A (IᴬIᴼ) × Father Group B (IᴮIᴼ)", "t mono", 8.1)

    f.rect(352, 250, 72, 30, "plate", rx=5)
    txt(f, 388, 269, "Gametes", "t b", 8.0)
    f.rect(430, 250, 88, 30, "plate", rx=5)
    txt(f, 474, 269, "Sperm (Iᴮ)", "t b g", 8.2)
    f.rect(524, 250, 88, 30, "plate", rx=5)
    txt(f, 568, 269, "Sperm (Iᴼ)", "t b p", 8.2)

    # Row 1
    f.rect(352, 286, 72, 60, "plate", rx=5)
    txt(f, 388, 312, "Ovum (Iᴬ)", "t b e", 8.2)
    txt(f, 388, 330, "50%", "t m", 7.8)

    box(
        f,
        430,
        286,
        88,
        60,
        [
            (22, "IᴬIᴮ (25%)", "t b p"),
            (44, "Group AB", "t b"),
        ],
        "plate",
        8.2,
    )
    box(
        f,
        524,
        286,
        88,
        60,
        [
            (22, "IᴬIᴼ (25%)", "t b e"),
            (44, "Group A", "t b"),
        ],
        "plate",
        8.2,
    )

    # Row 2
    f.rect(352, 352, 72, 60, "plate", rx=5)
    txt(f, 388, 378, "Ovum (Iᴼ)", "t b p", 8.2)
    txt(f, 388, 396, "50%", "t m", 7.8)

    box(
        f,
        430,
        352,
        88,
        60,
        [
            (22, "IᴮIᴼ (25%)", "t b g"),
            (44, "Group B", "t b"),
        ],
        "plate",
        8.2,
    )
    box(
        f,
        524,
        352,
        88,
        60,
        [
            (22, "IᴼIᴼ (25%)", "t b"),
            (44, "Group O", "t b"),
        ],
        "plate",
        8.2,
    )

    box(
        f,
        352,
        420,
        260,
        54,
        [
            (20, "Result: 1 AB : 1 A : 1 B : 1 O (25% each)", "t b e"),
            (40, "Four children can have four different blood groups", "t m"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM BAR: Notation & Hierarchy Rule
    box(
        f,
        16,
        496,
        608,
        78,
        [
            (21, "Cambridge Superscript Rule & Dominance Hierarchy:", "t b"),
            (
                42,
                "Codominant alleles use a base gene letter with superscripts (Iᴬ and Iᴮ); the recessive allele at the same locus is Iᴼ.",
                "t",
            ),
            (
                62,
                "Iᴬ and Iᴮ are CODOMINANT with each other (IᴬIᴮ = Group AB), and both are DOMINANT over recessive Iᴼ (IᴬIᴼ = A, IᴮIᴼ = B).",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 6. SIMPLE DOMINANCE (3:1) VS CODOMINANCE (1:2:1) (#fig-13-6)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_dominance_vs_codominance() -> str:
    f = Fig(
        640,
        590,
        "Comparison of simple dominance (3:1 F2 phenotype ratio) with codominance (1:2:1 F2 phenotype ratio) and why codominance is not blending",
    )
    heading(
        f,
        "13.3  Simple Dominance (3 : 1) vs Codominance (1 : 2 : 1) in F₂ Crosses",
        "Why codominance reveals the 1 : 2 : 1 genotype ratio directly in the phenotype without blending the alleles",
    )

    # LEFT PANEL: Simple Dominance (3:1)
    f.rect(16, 54, 296, 420, "wash-e", rx=10)
    txt(f, 164, 74, "1. Simple Dominance (Mendel Pea R / r)", "t b e", 9.3)
    txt(f, 164, 91, "Heterozygote (Rr) looks identical to Homozygote (RR)", "t m", 8.1)

    box(
        f,
        28,
        104,
        272,
        66,
        [
            (20, "Cross: Heterozygote × Heterozygote (Rr × Rr)", "t b e"),
            (40, "Genotypes: 25% RR  :  50% Rr  :  25% rr", "t mono"),
            (56, "Genotype ratio = 1 : 2 : 1", "t m"),
        ],
        "plate",
        8.1,
    )

    arr(f, 164, 172, 164, 194, "e")

    box(
        f,
        28,
        196,
        272,
        92,
        [
            (22, "Phenotype Collapse (RR and Rr Merge)", "t b g"),
            (44, "RR (two R copies) → Round seed (25%)", "t"),
            (64, "Rr (one R copy) → Round seed (50%)", "t"),
            (82, "rr (no SBEI) → Wrinkled seed (25%)", "t b p"),
        ],
        "wash-g",
        8.1,
    )

    arr(f, 164, 290, 164, 312, "g")

    box(
        f,
        28,
        314,
        272,
        146,
        [
            (22, "Observable F₂ Phenotype Ratio: 3 : 1", "t b e"),
            (44, "75% Dominant (Round) : 25% Recessive (Wrinkled)", "t b"),
            (68, "Only 2 phenotype classes are visible.", "t"),
            (90, "You CANNOT tell RR apart from Rr by sight;", "t"),
            (110, "a test cross (× rr) or F₃ self-cross is needed", "t m"),
            (130, "to unmask the hidden 1 : 2 split inside the 3.", "t m"),
        ],
        "plate",
        8.1,
    )

    # RIGHT PANEL: Codominance (1:2:1)
    f.rect(324, 54, 300, 420, "wash-g", rx=10)
    txt(f, 474, 74, "2. Codominance (ABO Iᴬ/Iᴮ or Coat Cᴿ/Cᵂ)", "t b g", 9.3)
    txt(f, 474, 91, "Heterozygote expresses BOTH alleles side by side", "t m", 8.1)

    box(
        f,
        336,
        104,
        276,
        66,
        [
            (20, "Cross: Heterozygote × Heterozygote (IᴬIᴮ × IᴬIᴮ)", "t b g"),
            (40, "Genotypes: 25% IᴬIᴬ  :  50% IᴬIᴮ  :  25% IᴮIᴮ", "t mono"),
            (56, "Genotype ratio = 1 : 2 : 1", "t m"),
        ],
        "plate",
        8.1,
    )

    arr(f, 474, 172, 474, 194, "g")

    box(
        f,
        336,
        196,
        276,
        92,
        [
            (22, "Three Distinct Phenotypes (No Masking)", "t b p"),
            (44, "IᴬIᴬ → Group A (Antigen A only, 25%)", "t e"),
            (64, "IᴬIᴮ → Group AB (Both Antigens A + B, 50%)", "t b p"),
            (82, "IᴮIᴮ → Group B (Antigen B only, 25%)", "t g"),
        ],
        "wash-p",
        8.1,
    )

    arr(f, 474, 290, 474, 312, "p")

    box(
        f,
        336,
        314,
        276,
        146,
        [
            (22, "Observable F₂ Phenotype Ratio: 1 : 2 : 1", "t b g"),
            (44, "25% Group A : 50% Group AB : 25% Group B", "t b"),
            (68, "All 3 genotype classes have their own phenotype.", "t"),
            (90, "Same 1 : 2 : 1 rule holds in Roan cattle (CᴿCᵂ):", "t"),
            (110, "25% Red (CᴿCᴿ) : 50% Roan (CᴿCᵂ) : 25% White (CᵂCᵂ)", "t mono"),
            (130, "and Sickle-cell trait (HbᴬHbˢ: both HbA + HbS).", "t m"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM BAR: Why Codominance Is Not Blending
    box(
        f,
        16,
        486,
        608,
        88,
        [
            (22, "Careful: Codominance Is Simultaneous Expression, NOT Blending", "t b"),
            (
                44,
                "In a Group AB person (IᴬIᴮ), red blood cells carry distinct Antigen A sugars and distinct Antigen B sugars—not a blended 'AB-sugar'.",
                "t",
            ),
            (
                66,
                "And when two IᴬIᴮ parents have children, pure Group A (25%) and pure Group B (25%) reappear immediately in the next generation.",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 7. SEX DETERMINATION: XX VS XY & THE 1:1 RATIO (#fig-13-7)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_xx_xy_sex_determination() -> str:
    f = Fig(
        640,
        590,
        "Human XX and XY sex chromosomes, gene-content asymmetry between X (156 Mb) and Y (57 Mb), and the 1:1 sex determination Punnett grid",
    )
    heading(
        f,
        "13.4  Pair 23: Sex Chromosomes (XX vs XY) and the 1 : 1 Sex Ratio",
        "Why human ova all carry an X chromosome while sperm split 50% X : 50% Y at meiosis",
    )

    # LEFT PANEL: Chromosome Pair 23 Structural & Gene Comparison
    f.rect(16, 54, 296, 420, "wash-e", rx=10)
    txt(f, 164, 74, "1. Human Somatic Karyotype (2n = 46)", "t b e", 9.3)
    txt(f, 164, 91, "22 pairs of autosomes (44) + 1 pair of sex chromosomes (2)", "t m", 8.0)

    box(
        f,
        28,
        104,
        272,
        110,
        [
            (22, "X Chromosome (Long Metacentric Rod)", "t b p"),
            (44, "Length: ~156 million base pairs (~156 Mb)", "t mono"),
            (64, "Carries ~850–900 protein-coding genes", "t b"),
            (84, "Includes non-homologous loci for colour vision", "t"),
            (100, "(red/green cone opsins) & clotting Factor VIII / IX", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        28,
        226,
        272,
        110,
        [
            (22, "Y Chromosome (Short Acrocentric Rod)", "t b e"),
            (44, "Length: ~57 million base pairs (~57 Mb)", "t mono"),
            (64, "Carries <100 protein-coding genes (incl. SRY)", "t b"),
            (84, "LACKS homologous copies of most X-chromosome", "t"),
            (100, "housekeeping, vision, and blood-clotting genes", "t m"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        28,
        348,
        272,
        114,
        [
            (22, "Female (XX) vs Male (XY) Chromosome Sets", "t b g"),
            (44, "Female body cell: 44 autosomes + XX  (2n = 46)", "t"),
            (64, "→ Every haploid ovum has 22 autosomes + X (100%)", "t b p"),
            (86, "Male body cell:   44 autosomes + XY  (2n = 46)", "t"),
            (104, "→ Sperm split 50% (22 + X) and 50% (22 + Y)", "t b e"),
        ],
        "wash-g",
        8.0,
    )

    # RIGHT PANEL: Whole-Chromosome Sex Determination Punnett Square
    f.rect(324, 54, 300, 420, "wash-g", rx=10)
    txt(f, 474, 74, "2. Sex Determination Punnett Diagram", "t b g", 9.3)
    txt(f, 474, 91, "Parents: Female (XX)  ×  Male (XY)", "t mono", 8.2)

    f.rect(336, 108, 76, 34, "plate", rx=5)
    txt(f, 374, 129, "Gametes", "t b", 8.1)
    f.rect(418, 108, 94, 34, "plate", rx=5)
    txt(f, 465, 129, "X-Sperm (X) ½", "t b p", 8.2)
    f.rect(518, 108, 94, 34, "plate", rx=5)
    txt(f, 565, 129, "Y-Sperm (Y) ½", "t b e", 8.2)

    # Row 1
    f.rect(336, 148, 76, 74, "plate", rx=5)
    txt(f, 374, 178, "Ovum (X)", "t b p", 8.3)
    txt(f, 374, 198, "½ (50%)", "t m", 7.9)

    box(
        f,
        418,
        148,
        94,
        74,
        [
            (26, "XX (25%)", "t b p"),
            (50, "Female child", "t b"),
        ],
        "wash-p",
        8.4,
    )
    box(
        f,
        518,
        148,
        94,
        74,
        [
            (26, "XY (25%)", "t b e"),
            (50, "Male child", "t b"),
        ],
        "wash-e",
        8.4,
    )

    # Row 2
    f.rect(336, 228, 76, 74, "plate", rx=5)
    txt(f, 374, 258, "Ovum (X)", "t b p", 8.3)
    txt(f, 374, 278, "½ (50%)", "t m", 7.9)

    box(
        f,
        418,
        228,
        94,
        74,
        [
            (26, "XX (25%)", "t b p"),
            (50, "Female child", "t b"),
        ],
        "wash-p",
        8.4,
    )
    box(
        f,
        518,
        228,
        94,
        74,
        [
            (26, "XY (25%)", "t b e"),
            (50, "Male child", "t b"),
        ],
        "wash-e",
        8.4,
    )

    box(
        f,
        336,
        314,
        276,
        148,
        [
            (22, "Expected: 50% XX : 50% XY in this model", "t b g"),
            (46, "1. Sperm chromosome (X vs Y) sets the zygote sex.", "t b e"),
            (68, "2. Mother gives an X chromosome to EVERY child.", "t"),
            (90, "3. Father gives his X to EVERY daughter (XX)", "t"),
            (110, "   and his Y to EVERY son (XY).", "t"),
            (132, "4. Earlier children do not change the model probability.", "t b p"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM BAR: Nettie Stevens (1905) Historical Anchor
    box(
        f,
        16,
        486,
        608,
        88,
        [
            (22, "Historical Proof: Nettie Stevens (1905) & Mealworm Beetle Karyotypes", "t b"),
            (
                44,
                "Studying Tenebrio molitor, Nettie Stevens showed somatic females carry two large X chromosomes while males carry one X and one tiny Y.",
                "t",
            ),
            (
                66,
                "Meiosis splits XY into equal numbers of X-sperm and Y-sperm, locking sex determination to Mendelian chromosome segregation.",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 8. X-LINKED RECESSIVE INHERITANCE (#fig-13-8)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_x_linked_inheritance() -> str:
    f = Fig(
        640,
        590,
        "X-linked recessive Punnett crosses comparing Carrier Mother x Normal Father with Normal Mother x Affected Father for colour vision and haemophilia",
    )
    heading(
        f,
        "13.4  Sex-Linked Inheritance: Why X-Linked Recessive Traits Strike Males Most Often",
        "Superscript alleles sit on the X chromosome (Xᴮ, Xᵇ or Xᴴ, Xʰ); the Y chromosome carries no superscript at these loci",
    )

    # LEFT PANEL: Cross A — Carrier Mother (XBXb) x Normal Father (XBY)
    f.rect(16, 54, 296, 420, "wash-e", rx=10)
    txt(f, 164, 74, "1. Cross A: Carrier Mum × Normal Dad", "t b e", 9.2)
    txt(f, 164, 91, "Parents: XᴮXᵇ (normal vision)  ×  XᴮY (normal vision)", "t mono", 8.0)

    f.rect(28, 104, 74, 30, "plate", rx=5)
    txt(f, 65, 123, "Gametes", "t b", 8.0)
    f.rect(108, 104, 93, 30, "plate", rx=5)
    txt(f, 154, 123, "X-Sperm (Xᴮ)", "t b e", 8.1)
    f.rect(207, 104, 93, 30, "plate", rx=5)
    txt(f, 253, 123, "Y-Sperm (Y)", "t b p", 8.1)

    # Row 1 Left
    f.rect(28, 140, 74, 64, "plate", rx=5)
    txt(f, 65, 168, "Ovum (Xᴮ)", "t b e", 8.2)
    txt(f, 65, 186, "50%", "t m", 7.8)

    box(
        f,
        108,
        140,
        93,
        64,
        [
            (22, "XᴮXᴮ (25%)", "t b g"),
            (42, "Normal Girl", "t"),
            (56, "(Non-carrier)", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        207,
        140,
        93,
        64,
        [
            (22, "XᴮY (25%)", "t b g"),
            (42, "Normal Boy", "t"),
            (56, "(Has Xᴮ)", "t m"),
        ],
        "plate",
        7.9,
    )

    # Row 2 Left
    f.rect(28, 210, 74, 64, "plate", rx=5)
    txt(f, 65, 238, "Ovum (Xᵇ)", "t b p", 8.2)
    txt(f, 65, 256, "50%", "t m", 7.8)

    box(
        f,
        108,
        210,
        93,
        64,
        [
            (22, "XᴮXᵇ (25%)", "t b e"),
            (42, "Carrier Girl", "t"),
            (56, "(Normal vision)", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        207,
        210,
        93,
        64,
        [
            (22, "XᵇY (25%)", "t b p"),
            (42, "Affected Boy", "t b p"),
            (56, "(No 2nd X)", "t m"),
        ],
        "wash-p",
        7.9,
    )

    box(
        f,
        28,
        286,
        272,
        176,
        [
            (22, "Cross A Denominator Breakdown", "t b e"),
            (44, "Among Daughters (XX): 50% Normal, 50% Carrier,", "t"),
            (62, "   0% Affected (Father's Xᴮ masks Mother's Xᵇ).", "t b g"),
            (84, "Among Sons (XY): 50% Normal (XᴮY), 50% Affected (XᵇY).", "t b p"),
            (106, "Among ALL Children: 25% Affected (all of them sons).", "t"),
            (128, "Same grid applies to Haemophilia (XᴴXʰ × XᴴY):", "t m"),
            (148, "50% of sons inherit XʰY (Factor VIII/IX deficiency).", "t m"),
        ],
        "plate",
        8.0,
    )

    # RIGHT PANEL: Cross B — Normal Mother (XBXB) x Affected Father (XbY)
    f.rect(324, 54, 300, 420, "wash-g", rx=10)
    txt(f, 474, 74, "2. Cross B: Normal Mum × Affected Dad", "t b g", 9.2)
    txt(f, 474, 91, "Parents: XᴮXᴮ (homozygous)  ×  XᵇY (affected male)", "t mono", 8.0)

    f.rect(336, 104, 74, 30, "plate", rx=5)
    txt(f, 373, 123, "Gametes", "t b", 8.0)
    f.rect(416, 104, 95, 30, "plate", rx=5)
    txt(f, 463, 123, "X-Sperm (Xᵇ)", "t b p", 8.1)
    f.rect(517, 104, 95, 30, "plate", rx=5)
    txt(f, 564, 123, "Y-Sperm (Y)", "t b e", 8.1)

    # Row 1 Right
    f.rect(336, 140, 74, 64, "plate", rx=5)
    txt(f, 373, 168, "Ovum (Xᴮ)", "t b e", 8.2)
    txt(f, 373, 186, "50%", "t m", 7.8)

    box(
        f,
        416,
        140,
        95,
        64,
        [
            (22, "XᴮXᵇ (25%)", "t b e"),
            (42, "Carrier Girl", "t"),
            (56, "(Gets Dad's Xᵇ)", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        517,
        140,
        95,
        64,
        [
            (22, "XᴮY (25%)", "t b g"),
            (42, "Normal Boy", "t"),
            (56, "(Gets Dad's Y)", "t m"),
        ],
        "plate",
        7.9,
    )

    # Row 2 Right
    f.rect(336, 210, 74, 64, "plate", rx=5)
    txt(f, 373, 238, "Ovum (Xᴮ)", "t b e", 8.2)
    txt(f, 373, 256, "50%", "t m", 7.8)

    box(
        f,
        416,
        210,
        95,
        64,
        [
            (22, "XᴮXᵇ (25%)", "t b e"),
            (42, "Carrier Girl", "t"),
            (56, "(Gets Dad's Xᵇ)", "t m"),
        ],
        "plate",
        7.9,
    )
    box(
        f,
        517,
        210,
        95,
        64,
        [
            (22, "XᴮY (25%)", "t b g"),
            (42, "Normal Boy", "t"),
            (56, "(Gets Dad's Y)", "t m"),
        ],
        "plate",
        7.9,
    )

    box(
        f,
        336,
        286,
        276,
        176,
        [
            (22, "Cross B Key Rules (Why 0% Father → Son)", "t b g"),
            (44, "1. Father gives his Y chromosome to EVERY son,", "t"),
            (62, "   so 0% of sons inherit the father's Xᵇ allele.", "t b e"),
            (84, "2. Father gives his Xᵇ chromosome to EVERY daughter,", "t"),
            (102, "   so 100% of daughters become XᴮXᵇ carriers.", "t b p"),
            (124, "3. How can a female be affected (XᵇXᵇ)? Only if", "t"),
            (144, "   Two-copy model: both parents supply Xᵇ.", "t m"),
        ],
        "plate",
        8.0,
    )

    # BOTTOM BAR: Hemizygosity & Male Carrier Rule
    box(
        f,
        16,
        486,
        608,
        88,
        [
            (22, "Why XY Males Cannot Be Carriers of an X-Linked Recessive Trait:", "t b"),
            (
                44,
                "These grids use a simple recessive model; some women with one altered haemophilia allele have bleeding symptoms.",
                "t",
            ),
            (
                66,
                "Because an XY male has only ONE X chromosome (hemizygous), a single Xᵇ or Xʰ allele is expressed immediately.",
                "t b e",
            ),
        ],
        "plate",
        8.2,
    )
    return f.svg()


# ──────────────────────────────────────────────────────────────────────
# 9. MUMBAI MATERNITY & GENETIC CLINIC SYNTHESIS (#fig-13-9)
# ──────────────────────────────────────────────────────────────────────
@figure
def c13_mumbai_maternity_case() -> str:
    f = Fig(
        640,
        590,
        "Forensic resolution of the Mumbai maternity ward ABO bracelet swap and the X-linked colour-vision/clotting clinic pedigree",
    )
    heading(
        f,
        "Chapter 13 Synthesis: Solving the Mumbai Maternity & Genetic Clinic Case Files",
        "Combining autosomal ABO multiple alleles (Chromosome 9) with X-linked recessive inheritance (Chromosome X)",
    )

    # LEFT PANEL: Case File 1 — Maternity Ward Bracelet Audit
    f.rect(16, 54, 296, 420, "wash-e", rx=10)
    txt(f, 164, 74, "Case 1: The Maternity Ward Bracelet Audit", "t b e", 9.2)
    txt(f, 164, 91, "Baby 1 = Group O (IᴼIᴼ)   |   Baby 2 = Group A (Iᴬ_)", "t mono", 8.0)

    box(
        f,
        28,
        104,
        272,
        106,
        [
            (20, "Couple 1 (Desai): Mum Group AB × Dad Group O", "t b p"),
            (40, "Parental genotypes:  IᴬIᴮ  ×  IᴼIᴼ", "t mono"),
            (60, "Mother passes Iᴬ or Iᴮ; Father passes only Iᴼ", "t"),
            (80, "Possible children: 50% IᴬIᴼ (Group A), 50% IᴮIᴼ (Group B)", "t b e"),
            (98, "Standard model excludes Group O & Group AB for Couple 1", "t b p"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        28,
        222,
        272,
        106,
        [
            (20, "Couple 2 (Kulkarni): Mum Group A × Dad Group B", "t b g"),
            (40, "Heterozygous genotypes:  IᴬIᴼ  ×  IᴮIᴼ", "t mono"),
            (60, "Both parents carry a hidden recessive Iᴼ allele", "t"),
            (80, "Possible children: 25% AB, 25% A, 25% B, 25% O (IᴼIᴼ)", "t b g"),
            (98, "ONLY Couple 2 can contribute two Iᴼ gametes", "t b"),
        ],
        "plate",
        8.0,
    )

    arr(f, 164, 330, 164, 352, "e")

    box(
        f,
        28,
        354,
        272,
        108,
        [
            (22, "Forensic Verdict: Bracelets Were Swapped", "t b e"),
            (44, "Baby 1 (Group O, IᴼIᴼ) belongs to Couple 2 (IᴬIᴼ × IᴮIᴼ)", "t b g"),
            (66, "Baby 2 (Group A, IᴬIᴼ) belongs to Couple 1 (IᴬIᴮ × IᴼIᴼ)", "t b p"),
            (88, "Confirm by DNA STR profiling on nucleated WBCs", "t m"),
        ],
        "wash-g",
        8.0,
    )

    # RIGHT PANEL: Case File 2 — Why Two Unaffected Parents Have an Affected Son
    f.rect(324, 54, 300, 420, "wash-g", rx=10)
    txt(f, 474, 74, "Case 2: The X-Linked Clinic Pedigree", "t b g", 9.2)
    txt(f, 474, 91, "Both parents have normal colour vision / normal clotting", "t m", 8.0)

    box(
        f,
        336,
        104,
        276,
        106,
        [
            (20, "Why the Son Is Affected (XᵇY or XʰY)", "t b p"),
            (40, "Father is normal → Genotype MUST be XᴮY (or XᴴY)", "t mono"),
            (60, "Father gave the son his Y chromosome (no locus)", "t"),
            (80, "Therefore the son's Xᵇ (or Xʰ) came from his MOTHER", "t b p"),
            (98, "Mother is an unaffected carrier: XᴮXᵇ (or XᴴXʰ)", "t b e"),
        ],
        "plate",
        8.0,
    )

    box(
        f,
        336,
        222,
        276,
        106,
        [
            (20, "Why Maternal Grandfather Was Also Affected", "t b e"),
            (40, "Maternal Grandfather (XᵇY) passed his single Xᵇ", "t"),
            (60, "to his daughter (the boy's carrier mother, XᴮXᵇ)", "t"),
            (80, "She had normal vision because her second X (Xᴮ)", "t"),
            (98, "produced functional retinal cone opsin protein", "t m"),
        ],
        "plate",
        8.0,
    )

    arr(f, 474, 330, 474, 352, "g")

    box(
        f,
        336,
        354,
        276,
        108,
        [
            (22, "Next-Pregnancy Probabilities (XᴮXᵇ × XᴮY)", "t b g"),
            (44, "Among Daughters (XX): 0% affected, 50% carrier (XᴮXᵇ)", "t"),
            (66, "Among Sons (XY): 50% normal (XᴮY), 50% affected (XᵇY)", "t b p"),
            (88, "Among ALL Children: 25% (1 in 4) affected son", "t m"),
        ],
        "wash-p",
        8.0,
    )

    # BOTTOM BAR: Master Chapter 13 Synthesis Table
    box(
        f,
        16,
        486,
        608,
        88,
        [
            (22, "Four Inheritance Patterns Compared Across Chapter 13:", "t b"),
            (
                44,
                "1. Dominant model: Aa×Aa → 3 affected : 1 unaffected  |  2. Recessive model: Aa×Aa → 1 affected : 3 unaffected",
                "t",
            ),
            (
                66,
                "3. Codominance (IᴬIᴮ): 1:2:1 in IᴬIᴮ×IᴬIᴮ; both alleles expressed  |  4. X-Linked Recessive (XᵇY): more males affected; 0% father→son",
                "t b e",
            ),
        ],
        "plate",
        8.1,
    )
    return f.svg()
