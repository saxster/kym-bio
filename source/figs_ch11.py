"""Chapter 11 original SVG plates — The Twisted Ladder & The Protein Printers."""
from figs_core import Fig, figure

ARROW_KIND = {"e": "electron", "p": "proton", "g": "green", "ink": "ink"}


def heading(f: Fig, title: str, sub: str) -> None:
    f.text(320, 22, title, "t b", "middle", 12.2)
    f.text(320, 40, sub, "t m", "middle", 9.3)


def txt(f: Fig, x: float, y: float, s: str, cls: str = "t", size: float = 9.0, anchor: str = "middle") -> None:
    f.text(x, y, s, cls, anchor, size)


def arr(f: Fig, x1: float, y1: float, x2: float, y2: float, k: str = "ink") -> None:
    f.arrow(x1, y1, x2, y2, ARROW_KIND.get(k, k), width=1.8)


def box(f: Fig, x: float, y: float, w: float, h: float, rows, cls: str = "plate", size: float = 9.0) -> None:
    f.rect(x, y, w, h, cls, rx=8)
    for dy, s, tcls in rows:
        f.text(x + w / 2, y + dy, s, tcls, "middle", size)


@figure
def c11_avery_dna_genes() -> str:
    f = Fig(640, 620, "Avery, MacLeod and McCarty 1944 enzymatic elimination ledger, cell-to-DNA scale hierarchy, and banana DNA extraction chemistry")
    heading(
        f,
        "11.1  The Hidden Instruction Book: Avery's Proof, Scale Hierarchy & DNA Extraction",
        "Enzymatic elimination proved DNA carries genes (1944); chromosomes inside the nucleus coil long DNA threads",
    )

    # TOP PANEL: Avery, MacLeod & McCarty (1944) Enzymatic Elimination Ledger
    f.rect(16, 54, 608, 184, "wash-e", rx=10)
    txt(f, 320, 74, "1. Avery, MacLeod & McCarty (1944) — Purified S-Cell Extract Added to Live Rough (R) Bacteria", "t b e", 9.8)

    avery_cols = [
        (26, "A. No Enzyme", "DNA + RNA + Protein", "Live Smooth (S) cells", "Transformation ON", "wash-g", "t b g"),
        (174, "B. + Protease", "Protein digested", "Live Smooth (S) cells", "Not protein (ON)", "wash-g", "t b g"),
        (322, "C. + RNase", "RNA digested", "Live Smooth (S) cells", "Not RNA (ON)", "wash-g", "t b g"),
        (470, "D. + DNase", "DNA digested", "Only Rough (R) cells", "DNA IS THE GENE", "wash-p", "t b p"),
    ]
    for x, head_s, sub_s, out_s, verd_s, bcls, vcls in avery_cols:
        box(
            f,
            x,
            86,
            142,
            138,
            [
                (22, head_s, "t b"),
                (46, sub_s, "t m"),
                (76, "Culture outcome:", "t m"),
                (96, out_s, "t b"),
                (122, verd_s, vcls),
            ],
            bcls,
            8.5,
        )

    # MIDDLE PANEL: Scale Hierarchy (Cell -> Nucleus -> Chromosome -> Gene -> DNA Double Helix)
    f.rect(16, 252, 608, 174, "wash-n", rx=10)
    txt(f, 320, 272, "2. Scale Hierarchy — From Eukaryotic Cell Down to a Single Gene on a DNA Double Helix", "t b", 9.8)

    scales = [
        (24, "1. Cell", "~20 µm across", "Nucleus + cytoplasm", "plate"),
        (144, "2. Nucleus", "~6 µm diameter", "Holds chromosomes", "plate"),
        (264, "3. Chromosome", "Coiled thread", "Long DNA + protein", "plate"),
        (384, "4. One Gene", "DNA segment", "Codes for 1 protein", "wash-g"),
        (504, "5. DNA Helix", "2.0 nm wide", "Paired bases A=T, C≡G", "wash-e"),
    ]
    for i, (sx, st, s1, s2, bcls) in enumerate(scales):
        box(
            f,
            sx,
            286,
            110,
            124,
            [
                (24, st, "t b"),
                (54, s1, "t b e"),
                (82, s2, "t s"),
                (106, "Inside nucleus" if i < 4 else "Twisted ladder", "t m"),
            ],
            bcls,
            8.3,
        )
        if i < 4:
            arr(f, sx + 111, 348, sx + 142, 348, "ink")

    # BOTTOM PANEL: 4-Step Kitchen Banana DNA Extraction Mechanism
    f.rect(16, 440, 608, 166, "wash-g", rx=10)
    txt(f, 320, 460, "3. Kitchen Biochemistry — Why Four Steps Spool Visible White DNA Threads from Fruit Cells", "t b g", 9.8)

    k_steps = [
        (26, "Step 1: Mashing", "Separates cells &", "breaks cell walls", "plate"),
        (174, "Step 2: Detergent", "Dissolves lipid cell", "& nuclear membranes", "plate"),
        (322, "Step 3: Salt (Na⁺)", "Shields negative", "DNA phosphate rails", "plate"),
        (470, "Step 4: Cold Alcohol", "DNA is insoluble →", "white threads spool", "wash-e"),
    ]
    for i, (kx, kt, k1, k2, bcls) in enumerate(k_steps):
        box(
            f,
            kx,
            474,
            142,
            118,
            [
                (24, kt, "t b"),
                (56, k1, "t s"),
                (76, k2, "t s"),
                (102, f"Stage {i+1} of 4", "t m"),
            ],
            bcls,
            8.4,
        )

    return f.svg()


@figure
def c11_photo51_double_helix() -> str:
    f = Fig(640, 620, "Rosalind Franklin and Raymond Gosling Photo 51 B-DNA X-ray diffraction geometry, Erwin Chargaff base ratios, and Watson-Crick complementary base pairing")
    heading(
        f,
        "11.2  The Twisted Ladder: Photo 51, Chargaff's Ratios & Complementary Base Pairing",
        "Franklin's B-DNA X-cross (3.4 nm turn, 0.34 nm step, 2.0 nm width) + Chargaff's %A=%T, %G=%C → A=T & C≡G rungs",
    )

    # LEFT PANEL: Photo 51 X-ray Diffraction Geometry
    f.rect(16, 54, 194, 550, "wash-e", rx=10)
    txt(f, 113, 74, "1. Photo 51 (May 1952)", "t b e", 9.8)
    txt(f, 113, 92, "Franklin & Gosling B-DNA", "t m", 8.5)

    # X-ray diffraction circle and layer-line X-cross
    cx, cy = 113, 184
    f.circle(cx, cy, 68, "plate")
    f.line(cx, cy - 62, cx, cy + 62, "ln m")
    f.line(cx - 62, cy, cx + 62, cy, "ln m")
    # Meridional arcs at layer 10
    f.path(f"M{cx-18},{cy-52} Q{cx},{cy-58} {cx+18},{cy-52}", "ln")
    f.path(f"M{cx-18},{cy+52} Q{cx},{cy+58} {cx+18},{cy+52}", "ln")
    # X-cross layer bars (layers 1, 2, 3, 5)
    for ly, dx in [(10, 9), (20, 18), (30, 27), (42, 37)]:
        for sy in (-1, 1):
            for sx in (-1, 1):
                f.line(cx + sx * dx - 5, cy + sy * ly, cx + sx * dx + 5, cy + sy * ly, "ln")

    box(
        f,
        26,
        268,
        174,
        322,
        [
            (22, "Photo 51 Deductions", "t b e"),
            (48, "• X-shaped cross of spots", "t b"),
            (66, "proves a helical coil.", "t s"),
            (94, "• Helical pitch = 3.4 nm", "t b g"),
            (112, "per complete turn.", "t s"),
            (140, "• Base step = 0.34 nm", "t b p"),
            (158, "between stacked pairs.", "t s"),
            (186, "• 3.4 ÷ 0.34 = 10 base", "t b"),
            (204, "pairs per helical turn.", "t s"),
            (232, "• Missing 4th layer line:", "t b"),
            (250, "major & minor grooves.", "t s"),
            (278, "• Uniform 2.0 nm width;", "t b e"),
            (296, "phosphates on outside.", "t s"),
        ],
        "plate",
        8.2,
    )

    # CENTRE PANEL: Erwin Chargaff's (1950) Base-Ratio Ledger
    f.rect(220, 54, 198, 550, "wash-n", rx=10)
    txt(f, 319, 74, "2. Chargaff's Ratios (1950)", "t b", 9.8)
    txt(f, 319, 92, "%A ≈ %T and %G ≈ %C", "t m", 8.5)

    species = [
        (106, "Human (Homo sapiens)", "%A 30.9 · %T 29.4", "%G 19.9 · %C 19.8", "A/T=1.05 · G/C=1.01"),
        (206, "Maize (Zea mays)", "%A 26.8 · %T 27.2", "%G 22.8 · %C 23.2", "A/T=0.99 · G/C=0.98"),
        (306, "E. coli Bacterium", "%A 24.7 · %T 23.6", "%G 26.0 · %C 25.7", "A/T=1.05 · G/C=1.01"),
        (406, "Sarcina lutea (GC-rich)", "%A 13.4 · %T 13.1", "%G 37.1 · %C 36.4", "A/T=1.02 · G/C=1.02"),
    ]
    for ry, sp_name, l_at, l_gc, l_rat in species:
        box(
            f,
            230,
            ry,
            178,
            90,
            [
                (20, sp_name, "t b"),
                (42, l_at, "t b g"),
                (60, l_gc, "t b e"),
                (78, l_rat, "t m"),
            ],
            "plate",
            8.2,
        )

    box(
        f,
        230,
        506,
        178,
        84,
        [
            (20, "Chargaff's Arithmetic", "t b p"),
            (42, "If %A = 30%, then %T = 30%.", "t s"),
            (60, "Remaining 40% splits equally:", "t s"),
            (76, "%G = 20% and %C = 20%.", "t b"),
        ],
        "wash-p",
        8.1,
    )

    # RIGHT PANEL: Complementary Base Pairing (Watson & Crick 1953)
    f.rect(428, 54, 196, 550, "wash-g", rx=10)
    txt(f, 526, 74, "3. Complementary Rungs", "t b g", 9.8)
    txt(f, 526, 92, "Two antiparallel strands (2.0 nm)", "t m", 8.5)

    rungs = [
        (108, "Rung 1: A = T (2 H-bonds)", "Adenine (2-ring purine)", "pairs with Thymine (1-ring)", "wash-g"),
        (206, "Rung 2: G ≡ C (3 H-bonds)", "Guanine (2-ring purine)", "pairs with Cytosine (1-ring)", "wash-e"),
        (304, "Rung 3: T = A (2 H-bonds)", "Thymine (1-ring) pairs", "with Adenine (2-ring)", "wash-g"),
        (402, "Rung 4: C ≡ G (3 H-bonds)", "Cytosine (1-ring) pairs", "with Guanine (2-ring)", "wash-e"),
    ]
    for ry, r_head, r1, r2, bcls in rungs:
        box(
            f,
            438,
            ry,
            176,
            88,
            [
                (22, r_head, "t b"),
                (46, r1, "t s"),
                (64, r2, "t s"),
                (80, "Span = 2.0 nm across helix", "t m"),
            ],
            bcls,
            8.1,
        )

    box(
        f,
        438,
        502,
        176,
        88,
        [
            (20, "Why Pairing Is Exact", "t b"),
            (40, "Purine+Purine > 2.0 nm (bulge)", "t s"),
            (58, "Pyrimidine+Pyrimidine < 2.0 nm", "t s"),
            (76, "Strand 1 fixes Strand 2 order", "t b g"),
        ],
        "plate",
        8.0,
    )

    return f.svg()


@figure
def c11_triplet_code_khorana() -> str:
    f = Fig(640, 620, "Combinatorial triplet capacity, Crick and Brenner 1961 frameshift proof, and Nirenberg and Har Gobind Khorana synthetic RNA copolymers")
    heading(
        f,
        "11.3  Cracking the Triplet Cipher: Combinatorics, Frameshifts & Khorana's Polymers",
        "Why 4 bases must be read in triplets (4³ = 64) · Crick & Brenner's +1/+2/+3 proof · Nirenberg & Khorana's synthetic RNAs",
    )

    # TOP-LEFT: Combinatorial Math (4^1, 4^2, 4^3)
    f.rect(16, 54, 296, 224, "wash-e", rx=10)
    txt(f, 164, 74, "1. Combinatorial Capacity (4 Bases → 20 Amino Acids)", "t b e", 9.4)

    math_cards = [
        (86, "Singlets (1 base): 4¹ = 4 combinations", "Too few for 20 amino acids (16 short) → FAILS", "wash-p"),
        (146, "Doublets (2 bases): 4² = 16 combinations", "Too few for 20 amino acids (4 short) → FAILS", "wash-p"),
        (206, "Triplets (3 bases / codon): 4³ = 64 codons", "61 sense codons + 3 STOP codons → DEGENERATE CODE", "wash-g"),
    ]
    for my, m1, m2, bcls in math_cards:
        box(
            f,
            26,
            my,
            276,
            52,
            [
                (20, m1, "t b"),
                (40, m2, "t s"),
            ],
            bcls,
            8.2,
        )

    # TOP-RIGHT: Crick & Brenner (1961) Reading-Frame Proof
    f.rect(328, 54, 296, 224, "wash-n", rx=10)
    txt(f, 476, 74, "2. Crick & Brenner (1961) Phage T4 Frameshifts", "t b", 9.4)

    frames = [
        (86, "Wild-type (0): CAT · CAT · CAT · CAT", "Intact reading frame → functional protein", "wash-g"),
        (132, "+1 insertion: CAX · TCA · TCA · TCA", "Frame shifted downstream → scrambled", "wash-p"),
        (178, "+2 insertions: CAX · YTC · ATC · ATC", "Still out of frame downstream → scrambled", "wash-p"),
        (224, "+3 insertions: CAX · YZT · CAT · CAT", "Reading frame RESTORED after 3rd base", "wash-g"),
    ]
    for fy, f1, f2, bcls in frames:
        box(
            f,
            338,
            fy,
            276,
            40,
            [
                (16, f1, "t b"),
                (32, f2, "t m"),
            ],
            bcls,
            8.0,
        )

    # BOTTOM PANEL: Nirenberg (1961) & Har Gobind Khorana (1964–1968) Synthetic RNA Bench
    f.rect(16, 292, 608, 314, "wash-g", rx=10)
    txt(f, 320, 312, "3. Nirenberg's Homopolymers & Har Gobind Khorana's Synthetic Repeating Copolymers (1961–1968)", "t b g", 9.6)

    khorana = [
        (
            26,
            326,
            "A. Nirenberg & Matthaei (1961) — Homopolymer poly-U",
            "mRNA: UUU · UUU · UUU · UUU",
            "Polypeptide: Phe – Phe – Phe – Phe",
            "First codon cracked: UUU = Phenylalanine (Phe);",
            "homopolymers also solved CCC = Pro and AAA = Lys.",
            "plate",
        ),
        (
            326,
            326,
            "B. Har Gobind Khorana (1964–66) — Copolymer (UC)ₙ",
            "mRNA: UCU · CUC · UCU · CUC",
            "Polypeptide: Ser – Leu – Ser – Leu",
            "Alternating 2-base repeat splits into alternating",
            "triplets UCU (Serine) and CUC (Leucine).",
            "plate",
        ),
        (
            26,
            466,
            "C. Har Gobind Khorana — Copolymers (UG)ₙ & (AG)ₙ",
            "mRNA: UGU · GUG  and  AGA · GAG",
            "Polypeptide: Cys – Val  and  Arg – Glu",
            "Proved exact base order inside mixed triplets",
            "across the entire 64-codon genetic dictionary.",
            "plate",
        ),
        (
            326,
            466,
            "D. Khorana, Brenner & Siddiqi — Stop Triplets (UAG)ₙ",
            "mRNA: UAG · UAG · UAG (Amber Stop)",
            "Outcome: Translation HALTS (Release Factor)",
            "UAA, UAG and UGA specify no amino acid; instead",
            "they terminate polypeptide chain synthesis.",
            "wash-p",
        ),
    ]
    for kx, ky, kh, k1, k2, k3a, k3b, bcls in khorana:
        box(
            f,
            kx,
            ky,
            288,
            126,
            [
                (22, kh, "t b"),
                (48, k1, "t b e"),
                (72, k2, "t b g"),
                (98, k3a, "t s"),
                (114, k3b, "t s"),
            ],
            bcls,
            8.2,
        )

    return f.svg()


@figure
def c11_transcription_translation() -> str:
    f = Fig(640, 620, "Six-step protein synthesis pathway from DNA gene in the nucleus via mRNA through nuclear pore to cytoplasmic ribosome")
    heading(
        f,
        "11.3  From Nucleus to Ribosome: The Six-Step Protein Printing Pipeline",
        "Cambridge IGCSE 0610 17.1 Supplement: DNA gene stays in nucleus → mRNA copy moves to cytoplasm → ribosome links amino acids",
    )

    # LEFT CHAMBER: NUCLEUS (Steps 1 & 2)
    f.rect(16, 54, 274, 332, "wash-e", rx=10)
    txt(f, 153, 74, "NUCLEUS (Archive Stays Inside)", "t b e", 9.6)

    box(
        f,
        28,
        88,
        250,
        134,
        [
            (20, "Step 1: Gene Remains in Nucleus", "t b e"),
            (42, "DNA unzips locally around 1 gene (HBB):", "t m"),
            (64, "Coding:   5'-ATG GTG CAC CTG-3'", "t b"),
            (84, "Template: 3'-TAC CAC GTG GAC-5'", "t s"),
            (108, "• Chromosome DNA never leaves", "t s"),
            (124, "the protective nuclear envelope.", "t s"),
        ],
        "plate",
        8.2,
    )

    arr(f, 153, 224, 153, 240, "e")

    box(
        f,
        28,
        242,
        250,
        130,
        [
            (20, "Step 2: mRNA Copy Made in Nucleus", "t b g"),
            (42, "Complementary RNA bases pair (U for T):", "t m"),
            (66, "mRNA: 5'-AUG GUG CAC CUG-3'", "t b g"),
            (92, "• Messenger RNA (mRNA) is a", "t s"),
            (108, "single-stranded copy of ONE gene.", "t s"),
        ],
        "plate",
        8.2,
    )

    # NUCLEAR PORE BRIDGE (Step 3)
    box(
        f,
        296,
        256,
        56,
        96,
        [
            (24, "Step 3", "t b p"),
            (44, "Nuclear", "t b"),
            (60, "Pore", "t b"),
            (80, "Exit →", "t m"),
        ],
        "wash-p",
        8.0,
    )

    # RIGHT CHAMBER: CYTOPLASM & RIBOSOME (Steps 4, 5, 6)
    f.rect(358, 54, 266, 332, "wash-g", rx=10)
    txt(f, 491, 74, "CYTOPLASM (Ribosome Printer)", "t b g", 9.6)

    box(
        f,
        370,
        88,
        242,
        92,
        [
            (20, "Step 4: mRNA Passes Through Ribosome", "t b"),
            (44, "Ribosome reads mRNA 5' → 3' one", "t s"),
            (62, "triplet (codon) at a time:", "t s"),
            (80, "AUG · GUG · CAC · CUG · ACU · CCU · GAG", "t b e"),
        ],
        "plate",
        8.1,
    )

    arr(f, 491, 182, 491, 198, "g")

    box(
        f,
        370,
        200,
        242,
        86,
        [
            (20, "Step 5: Ribosome Assembles Amino Acids", "t b g"),
            (42, "tRNA carriers match codons and", "t s"),
            (60, "ribosome links amino acids in chain:", "t s"),
            (76, "Met – Val¹ – His² – Leu³ – Thr⁴ – Pro⁵ – Glu⁶", "t b p"),
        ],
        "plate",
        8.1,
    )

    arr(f, 491, 288, 491, 304, "p")

    box(
        f,
        370,
        306,
        242,
        66,
        [
            (20, "Step 6: Sequence Sets Sequence", "t b p"),
            (40, "Base order in mRNA determines the", "t s"),
            (56, "exact amino-acid order in the protein.", "t b"),
        ],
        "plate",
        8.1,
    )

    # BOTTOM PANEL: Six-Point Cambridge IGCSE 0610 17.1 Supplement Checklist
    f.rect(16, 400, 608, 206, "wash-n", rx=10)
    txt(f, 320, 420, "Cambridge IGCSE 0610 (17.1 Supplement) Six-Step Protein Synthesis Summary", "t b", 9.6)

    pts = [
        (26, 434, "1. Gene stays in nucleus", "The gene coding for the protein", "remains inside the nucleus."),
        (226, 434, "2. mRNA is a gene copy", "Messenger RNA (mRNA) is a", "single-stranded copy of a gene."),
        (426, 434, "3. Nucleus to cytoplasm", "mRNA molecules are made in the", "nucleus and move to the cytoplasm."),
        (26, 518, "4. Passes through ribosome", "The mRNA molecule passes", "through ribosomes in cytoplasm."),
        (226, 518, "5. Ribosome links residues", "The ribosome assembles amino", "acids into protein molecules."),
        (426, 518, "6. Base order → AA order", "Specific amino-acid sequence is", "set by the mRNA base sequence."),
    ]
    for px, py, ph, p1, p2 in pts:
        box(
            f,
            px,
            py,
            188,
            74,
            [
                (20, ph, "t b e"),
                (42, p1, "t s"),
                (58, p2, "t s"),
            ],
            "plate",
            8.1,
        )

    return f.svg()


@figure
def c11_sequence_to_3d_machines() -> str:
    f = Fig(640, 620, "How DNA base sequence controls cell function via Ramachandran 3D protein folding into enzymes, membrane carriers, neurotransmitter receptors, and antibodies")
    heading(
        f,
        "11.3  How DNA Controls Cell Function: Sequence → Ramachandran Folding → 3D Machines",
        "Cambridge IGCSE 0610 17.1 Supplement 4: DNA controls cell function by controlling production of four protein families",
    )

    # TOP CAUSAL SPINE
    f.rect(16, 54, 608, 128, "wash-e", rx=10)
    txt(f, 320, 74, "1. The Causal Spine — Why Base Order Determines Three-Dimensional Molecular Shape", "t b e", 9.6)

    spine = [
        (24, "1. DNA Base Order", "Gene in nucleus", "(A, T, C, G)"),
        (174, "2. mRNA Codons", "Transcript copy", "(A, U, C, G)"),
        (324, "3. Amino-Acid Chain", "Linear peptide", "(20 residue types)"),
        (474, "4. 3D Folded Machine", "Ramachandran (φ, ψ)", "Exact 3D pocket"),
    ]
    for i, (sx, st, s1, s2) in enumerate(spine):
        box(
            f,
            sx,
            86,
            140,
            84,
            [
                (24, st, "t b"),
                (48, s1, "t s"),
                (68, s2, "t b e"),
            ],
            "plate",
            8.3,
        )
        if i < 3:
            arr(f, sx + 142, 128, sx + 172, 128, "ink")

    # BOTTOM GRID: 4 Classes of Folded Protein Machines
    f.rect(16, 196, 608, 410, "wash-n", rx=10)
    txt(f, 320, 216, "2. Four Families of 3D Protein Machines Encoded by DNA (Uniting Chapters 4, 8, 9 & 10)", "t b", 9.6)

    cards = [
        (
            26,
            232,
            "A. ENZYMES (Catalysts — Ch 4)",
            "Amylase, pepsin, catalase, polymerases",
            "3D Feature: Complementary Active Site",
            "Exact amino-acid folding creates an active site",
            "pocket that binds its specific substrate.",
            "Gene mutation → altered active site → loss of catalysis.",
            "wash-g",
            "t b g",
        ),
        (
            326,
            232,
            "B. MEMBRANE CARRIERS & CHANNELS (Ch 9, 10)",
            "Na⁺–glucose carriers, aquaporins, para Na⁺ channels",
            "3D Feature: Selective Transmembrane Pore",
            "Folded barrel or gate moves glucose, water, or",
            "Na⁺/K⁺ ions across cell membranes.",
            "Siddiqi's para mutant: 1 gene change halts Na⁺ channel.",
            "wash-e",
            "t b e",
        ),
        (
            26,
            418,
            "C. RECEPTORS FOR NEUROTRANSMITTERS (Ch 9, 10)",
            "Synaptic acetylcholine receptors; insulin receptors",
            "3D Feature: Complementary Binding Cleft",
            "Receptor protein on postsynaptic or target-cell",
            "membrane locks onto neurotransmitter or hormone.",
            "Misfolded receptor → synapse or hormone signal blocked.",
            "wash-p",
            "t b p",
        ),
        (
            326,
            418,
            "D. ANTIBODIES & OXYGEN CARRIERS (Ch 8, 10)",
            "Lymphocyte antibodies; red-cell haemoglobin",
            "3D Feature: Variable Antigen Tips / Haem Pocket",
            "Variable loops match one pathogen antigen;",
            "haemoglobin subunits cradle four haem groups.",
            "Codon 6 change in HBB → sticky HbS haemoglobin.",
            "plate",
            "t b",
        ),
    ]
    for cx, cy, ch, ex, feat, l1, l2, fail, bcls, hcls in cards:
        box(
            f,
            cx,
            cy,
            288,
            172,
            [
                (22, ch, hcls),
                (44, ex, "t b"),
                (66, feat, "t b e"),
                (92, l1, "t s"),
                (110, l2, "t s"),
                (142, fail, "t m"),
            ],
            bcls,
            8.2,
        )

    return f.svg()


@figure
def c11_dna_vs_mrna_ledger() -> str:
    f = Fig(640, 620, "Side-by-side structural and functional ledger comparing double-stranded DNA with single-stranded messenger RNA")
    heading(
        f,
        "11.3  Master Archive vs Working Copy: DNA Compared with Messenger RNA (mRNA)",
        "Why eukaryotic cells keep double-stranded DNA in the nucleus and send single-stranded mRNA copies to ribosomes",
    )

    # TOP CARDS: Visual contrast
    box(
        f,
        16,
        56,
        296,
        118,
        [
            (22, "DNA (Deoxyribonucleic Acid)", "t b e"),
            (46, "2 antiparallel strands coiled in a double helix", "t b"),
            (68, "Bases: Adenine (A), Thymine (T), Cytosine (C), Guanine (G)", "t s"),
            (88, "Paired cross-links: A = T (2 H) and C ≡ G (3 H)", "t s"),
            (106, "Permanent master library kept inside the nucleus", "t m"),
        ],
        "wash-e",
        8.2,
    )

    box(
        f,
        328,
        56,
        296,
        118,
        [
            (22, "mRNA (Messenger Ribonucleic Acid)", "t b g"),
            (46, "1 single-stranded polynucleotide chain", "t b"),
            (68, "Bases: Adenine (A), Uracil (U), Cytosine (C), Guanine (G)", "t s"),
            (88, "Uracil (U) replaces Thymine (T); pairs with Adenine (A)", "t s"),
            (106, "Made in nucleus → moves to cytoplasm → ribosomes", "t m"),
        ],
        "wash-g",
        8.2,
    )

    # BOTTOM LEDGER: 6 Comparison Rows
    f.rect(16, 188, 608, 418, "wash-n", rx=10)
    txt(f, 102, 210, "Feature", "t b", 9.2)
    txt(f, 290, 210, "DNA (Master Chromosome Archive)", "t b e", 9.2)
    txt(f, 505, 210, "mRNA (Working Gene Transcript)", "t b g", 9.2)

    rows = [
        ("1. Strands", "Two strands coiled in a double helix", "One single-stranded chain"),
        ("2. Four Bases", "A, T, C, G  (contains Thymine, T)", "A, U, C, G  (Uracil, U replaces T)"),
        ("3. Sugar Unit", "Deoxyribose sugar in backbone", "Ribose sugar in backbone"),
        ("4. Cell Location", "Remains inside the nucleus", "Made in nucleus → cytoplasm → ribosome"),
        ("5. Molecular Size", "Very long (thousands of genes)", "Short (copy of one single gene)"),
        ("6. Persistence", "Permanent archive for life of cell", "Temporary copy degraded after use"),
    ]
    for i, (r_feat, r_dna, r_mrna) in enumerate(rows):
        ry = 222 + i * 62
        f.rect(26, ry, 148, 52, "plate", rx=6)
        txt(f, 100, ry + 30, r_feat, "t b", 8.6)

        f.rect(180, ry, 214, 52, "plate", rx=6)
        txt(f, 287, ry + 30, r_dna, "t s", 8.3)

        f.rect(400, ry, 214, 52, "plate", rx=6)
        txt(f, 507, ry + 30, r_mrna, "t s", 8.3)

    return f.svg()


@figure
def c11_beta_globin_mutation() -> str:
    f = Fig(640, 620, "Vernon Ingram 1956-1957 discovery of the single-base substitution in human beta-globin codon 6 changing glutamic acid to valine")
    heading(
        f,
        "11.4  One Letter in 438 Bases: Vernon Ingram & the Beta-Globin Codon 6 Substitution",
        "Human HBB codons 1–7: a single A → T change in Codon 6 (GAG → GTG) replaces hydrophilic Glu⁶ with hydrophobic Val⁶",
    )

    # TOP PANEL: Normal Adult Haemoglobin (HbA)
    f.rect(16, 54, 608, 266, "wash-g", rx=10)
    txt(f, 320, 74, "1. Normal Adult Beta-Globin (HbA) — Codon 6 = GAG → Hydrophilic Glutamic Acid (Glu⁶)", "t b g", 9.6)

    cod_ref = ["GTG", "CAC", "CTG", "ACT", "CCT", "GAG", "GAG"]
    rna_ref = ["GUG", "CAC", "CUG", "ACU", "CCU", "GAG", "GAG"]
    pep_ref = ["Val¹", "His²", "Leu³", "Thr⁴", "Pro⁵", "Glu⁶", "Glu⁷"]

    for i in range(7):
        cx = 28 + i * 84
        bcls = "wash-g" if i == 5 else "plate"
        tcls = "t b g" if i == 5 else "t b"
        box(
            f,
            cx,
            88,
            76,
            122,
            [
                (20, f"Codon {i+1}", "t m"),
                (44, f"DNA {cod_ref[i]}", tcls),
                (70, f"mRNA {rna_ref[i]}", "t s"),
                (100, pep_ref[i], tcls),
            ],
            bcls,
            8.3,
        )

    box(
        f,
        28,
        222,
        584,
        84,
        [
            (22, "HbA Molecular & Cellular Outcome (Ingram 1956–1957 Peptide Fingerprint)", "t b g"),
            (46, "• Codon 6 (GAG) places negatively charged, water-loving Glutamic acid (Glu⁶) on the surface.", "t s"),
            (68, "• Haemoglobin tetramers stay dissolved and separate → red blood cell remains a flexible biconcave disc.", "t b"),
        ],
        "plate",
        8.3,
    )

    # BOTTOM PANEL: Sickle-Cell Beta-Globin (HbS)
    f.rect(16, 336, 608, 268, "wash-p", rx=10)
    txt(f, 320, 356, "2. Sickle-Cell Beta-Globin (HbS) — Codon 6 = GTG (mRNA GUG) → Hydrophobic Valine (Val⁶)", "t b p", 9.6)

    cod_mut = ["GTG", "CAC", "CTG", "ACT", "CCT", "GTG", "GAG"]
    rna_mut = ["GUG", "CAC", "CUG", "ACU", "CCU", "GUG", "GAG"]
    pep_mut = ["Val¹", "His²", "Leu³", "Thr⁴", "Pro⁵", "Val⁶", "Glu⁷"]

    for i in range(7):
        cx = 28 + i * 84
        bcls = "wash-p" if i == 5 else "plate"
        tcls = "t b p" if i == 5 else "t b"
        box(
            f,
            cx,
            370,
            76,
            122,
            [
                (20, f"Codon {i+1}", "t m"),
                (44, f"DNA {cod_mut[i]}", tcls),
                (70, f"mRNA {rna_mut[i]}", "t s"),
                (100, pep_mut[i], tcls),
            ],
            bcls,
            8.3,
        )

    box(
        f,
        28,
        504,
        584,
        86,
        [
            (22, "HbS Molecular & Cellular Outcome — 1 Base Changed Out of 438 Coding Bases", "t b p"),
            (46, "• Single substitution (GAG → GTG, mRNA GUG) puts neutral, water-repelling Valine (Val⁶) on the outside.", "t s"),
            (68, "• At low O₂, sticky hydrophobic Val⁶ patches lock HbS tetramers into rigid fibres → crescent sickle cell.", "t b"),
        ],
        "plate",
        8.3,
    )

    return f.svg()


@figure
def c11_mutation_outcomes_comparison() -> str:
    f = Fig(640, 620, "Comparison of silent synonymous, missense, and nonsense stop single-base substitutions in a protein-coding gene")
    heading(
        f,
        "11.4  Three Single-Base Substitutions: Silent (Synonymous), Missense & Nonsense",
        "How the degenerate 64-codon genetic code makes some single-base changes invisible while others alter or truncate the protein",
    )

    cols = [
        (
            18,
            "A. SILENT (SYNONYMOUS)",
            "Codon 3: CTG → CTT",
            "mRNA: CUG → CUU",
            "Both codons = Leucine (Leu³)",
            "6 codons specify Leucine",
            "(UUA, UUG, CUU, CUC, CUA, CUG).",
            "Val–His–Leu–Thr–Pro–Glu–Glu",
            "Exact same 146-AA sequence",
            "and 3D Ramachandran fold.",
            "100% Normal Soluble HbA",
            "wash-g",
            "t b g",
        ),
        (
            226,
            "B. MISSENSE SUBSTITUTION",
            "Codon 6: GAG → GTG",
            "mRNA: GAG → GUG",
            "Glu⁶ (hydrophilic) → Val⁶",
            "Changes 1 codon into a codon",
            "for a different amino acid.",
            "Val–His–Leu–Thr–Pro–Val–Glu",
            "Full 146-AA length, but",
            "hydrophobic surface patch.",
            "Sticky Deoxygenated HbS",
            "wash-e",
            "t b e",
        ),
        (
            434,
            "C. NONSENSE (STOP)",
            "Codon 39: CAG → TAG",
            "mRNA: CAG → UAG (STOP)",
            "Gln³⁹ → Premature STOP",
            "Turns a sense codon into an",
            "amber termination codon (UAG).",
            "Val–His–Leu ... Trp–Thr–[STOP]",
            "Ribosome halts at residue 38;",
            "missing >70% of polypeptide.",
            "Truncated Non-Functional Chain",
            "wash-p",
            "t b p",
        ),
    ]

    for cx, head_s, sub_dna, sub_rna, aa_change, w1, w2, chain_s, f1, f2, verd, bcls, hcls in cols:
        f.rect(cx, 56, 188, 548, bcls, rx=10)
        txt(f, cx + 94, 80, head_s, hcls, 9.4)

        box(
            f,
            cx + 10,
            96,
            168,
            96,
            [
                (24, sub_dna, "t b"),
                (48, sub_rna, "t b e"),
                (76, aa_change, hcls),
            ],
            "plate",
            8.3,
        )

        box(
            f,
            cx + 10,
            206,
            168,
            96,
            [
                (22, "Triplet Code Mechanism", "t b"),
                (48, w1, "t s"),
                (68, w2, "t s"),
            ],
            "plate",
            8.1,
        )

        box(
            f,
            cx + 10,
            316,
            168,
            106,
            [
                (22, "Polypeptide Output", "t b"),
                (48, chain_s, hcls),
                (74, f1, "t s"),
                (92, f2, "t s"),
            ],
            "plate",
            8.0,
        )

        box(
            f,
            cx + 10,
            438,
            168,
            148,
            [
                (28, "3D Protein Outcome", "t b"),
                (62, verd, hcls),
                (96, "Degeneracy buffers A;" if cx == 18 else ("Altered side-chain in B;" if cx == 226 else "Early release in C;"), "t m"),
                (116, "zero shape change." if cx == 18 else ("fibres form at low O₂." if cx == 226 else "no working globin."), "t m"),
            ],
            "plate",
            8.2,
        )

    return f.svg()


@figure
def c11_leucine_silent_case() -> str:
    f = Fig(640, 620, "Case 11 diagnostic synthesis comparing Reference HbA, Child X silent codon 3 substitution CTG to CTT, and Child Y missense codon 6 substitution GAG to GTG")
    heading(
        f,
        "Case 11  Two Children, Two Single-Base Changes, One Unchanged Protein",
        "Tracing coding DNA → template DNA → mRNA codons → amino-acid sequence → 3D beta-globin folding",
    )

    cases = [
        (
            56,
            "1. Reference Adult Beta-Globin (HbA) — Codons 1 to 7",
            "Coding DNA:    5'- GTG · CAC · CTG · ACT · CCT · GAG · GAG -3'",
            "Template DNA:  3'- CAC · GTG · GAC · TGA · GGA · CTC · CTC -5'",
            "mRNA Codons:   5'- GUG · CAC · CUG · ACU · CCU · GAG · GAG -3'",
            "Amino Acids:   Val¹ – His² – Leu³ – Thr⁴ – Pro⁵ – Glu⁶ – Glu⁷",
            "Outcome: Hydrophilic Glu⁶ on exterior → soluble HbA tetramers & flexible biconcave red blood cells.",
            "wash-n",
            "t b",
        ),
        (
            244,
            "2. Child X — Single-Base Substitution at Codon 3 (CTG → CTT)",
            "Coding DNA:    5'- GTG · CAC · CTT · ACT · CCT · GAG · GAG -3'   [Codon 3: CTG → CTT]",
            "Template DNA:  3'- CAC · GTG · GAA · TGA · GGA · CTC · CTC -5'   [Template: GAC → GAA]",
            "mRNA Codons:   5'- GUG · CAC · CUU · ACU · CCU · GAG · GAG -3'   [mRNA: CUG → CUU]",
            "Amino Acids:   Val¹ – His² – Leu³ – Thr⁴ – Pro⁵ – Glu⁶ – Glu⁷   [UNCHANGED CHAIN]",
            "Verdict: SILENT (SYNONYMOUS) — Both CUG and CUU code for Leucine (Leu³); Glu⁶ intact → 100% normal HbA.",
            "wash-g",
            "t b g",
        ),
        (
            432,
            "3. Child Y — Single-Base Substitution at Codon 6 (GAG → GTG)",
            "Coding DNA:    5'- GTG · CAC · CTG · ACT · CCT · GTG · GAG -3'   [Codon 6: GAG → GTG]",
            "Template DNA:  3'- CAC · GTG · GAC · TGA · GGA · CAC · CTC -5'   [Template: CTC → CAC]",
            "mRNA Codons:   5'- GUG · CAC · CUG · ACU · CCU · GUG · GAG -3'   [mRNA: GAG → GUG]",
            "Amino Acids:   Val¹ – His² – Leu³ – Thr⁴ – Pro⁵ – Val⁶ – Glu⁷   [Glu⁶ → Val⁶ MISSENSE]",
            "Verdict: MISSENSE — Hydrophilic Glu⁶ replaced by hydrophobic Val⁶ → sticky patch forms rigid HbS fibres.",
            "wash-p",
            "t b p",
        ),
    ]

    for ry, title_s, dna_c, dna_t, mrna_s, pep_s, verd_s, bcls, hcls in cases:
        box(
            f,
            16,
            ry,
            608,
            174,
            [
                (22, title_s, hcls),
                (50, dna_c, "t b"),
                (72, dna_t, "t m"),
                (96, mrna_s, "t b e"),
                (122, pep_s, hcls),
                (152, verd_s, "t s"),
            ],
            bcls,
            8.3,
        )

    return f.svg()
