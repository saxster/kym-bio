const MENDEL_CROSS_MODES = Object.freeze([
  Object.freeze({
    index: 0,
    id: 'f1_hybrid',
    label: '3:1 Hybrid (Rr × Rr)',
    shortLabel: '3:1 Hybrid',
    defaultMaternalStep: 2,
    defaultPaternalStep: 2,
    crossCode: 'Rr × Rr',
    expectedPhenotypeRatio: '3 : 1',
    expectedGenotypeRatio: '1 RR : 2 Rr : 1 rr',
    summary: 'Monohybrid F₁ self-cross: two heterozygous parents each produce 50% dominant and 50% recessive gametes, giving 1 RR : 2 Rr : 1 rr genotypes and a 3 : 1 dominant-to-recessive phenotype ratio.',
  }),
  Object.freeze({
    index: 1,
    id: 'test_cross',
    label: '1:1 Test Cross (Rr × rr)',
    shortLabel: '1:1 Test Cross',
    defaultMaternalStep: 2,
    defaultPaternalStep: 3,
    crossCode: 'Rr × rr',
    expectedPhenotypeRatio: '1 : 1',
    expectedGenotypeRatio: '1 Rr : 1 rr',
    summary: 'Diagnostic test cross: crossing a dominant-phenotype parent with a homozygous recessive tester (rr) reveals hidden recessive alleles via a 1 : 1 offspring ratio.',
  }),
  Object.freeze({
    index: 2,
    id: 'pure_f1',
    label: 'Pure F₁ (RR × rr)',
    shortLabel: 'Pure F₁',
    defaultMaternalStep: 1,
    defaultPaternalStep: 3,
    crossCode: 'RR × rr',
    expectedPhenotypeRatio: '100% dominant : 0% recessive',
    expectedGenotypeRatio: '100% Rr',
    summary: 'Parental pure-breeding cross: a homozygous dominant parent (RR) crossed with a homozygous recessive parent (rr) produces 100% heterozygous F₁ hybrids (Rr) where the recessive allele remains intact but unexpressed in the phenotype.',
  }),
  Object.freeze({
    index: 3,
    id: 'seven_traits_ledger',
    label: '7 Pea Traits Ledger',
    shortLabel: '7 Pea Traits',
    defaultMaternalStep: 2,
    defaultPaternalStep: 2,
    crossCode: 'Brno F₂ Ledger (19,959 outcomes)',
    expectedPhenotypeRatio: '2.98 : 1 across all 7 traits',
    expectedGenotypeRatio: '193 RR : 372 Rr in F₃ seed test (1 : 1.93)',
    summary: 'Johann Gregor Mendel counted 19,959 F₂ pea outcomes across seven independent characters in Brno (1856–1863), obtaining 14,949 dominant to 5,010 recessive outcomes (2.98 : 1).',
  }),
]);

const MENDEL_SEVEN_TRAITS = Object.freeze([
  Object.freeze({
    traitStep: 1,
    id: 'seed_shape',
    character: 'Seed shape',
    dominantSymbol: 'R',
    recessiveSymbol: 'r',
    dominantTrait: 'Round seed',
    recessiveTrait: 'Wrinkled seed',
    mendelDominantCount: 5474,
    mendelRecessiveCount: 1850,
    mendelTotal: 7324,
    mendelRatio: 2.96,
    mendelDominantPct: 74.74,
    mendelRecessivePct: 25.26,
    enzymeName: 'Starch-branching enzyme I (SBEI)',
    geneMechanism: 'R codes for functional SBEI that adds branches to growing glucose chains during amylopectin synthesis; r carries a 0.8 kb transposon insertion (Bhattacharyya et al., 1990) that inactivates SBEI so sucrose accumulates, draws in water by osmosis, and wrinkles the drying seed.',
    heterozygoteNote: 'One working R copy synthesises enough branched starch to keep Rr seeds fully round (haplosufficiency).',
    f3ProgenyTested: 565,
    f3TrueBreedingDominant: 193,
    f3SegregatingHybrid: 372,
  }),
  Object.freeze({
    traitStep: 2,
    id: 'flower_colour',
    character: 'Flower colour',
    dominantSymbol: 'B',
    recessiveSymbol: 'b',
    dominantTrait: 'Purple flower',
    recessiveTrait: 'White flower',
    mendelDominantCount: 705,
    mendelRecessiveCount: 224,
    mendelTotal: 929,
    mendelRatio: 3.15,
    mendelDominantPct: 75.89,
    mendelRecessivePct: 24.11,
    enzymeName: 'Anthocyanin bHLH transcription factor',
    geneMechanism: 'B activates the anthocyanin pigment enzymes in petal cells; b carries a G-to-A splice-site transition (Hellens et al., 2010) that creates a premature stop codon, leaving petals unpigmented (white).',
    heterozygoteNote: 'One B allele produces sufficient transcription factor to drive full purple anthocyanin synthesis in Bb petals.',
    f3ProgenyTested: 100,
    f3TrueBreedingDominant: 36,
    f3SegregatingHybrid: 64,
  }),
  Object.freeze({
    traitStep: 3,
    id: 'cotyledon_colour',
    character: 'Seed cotyledon colour',
    dominantSymbol: 'Y',
    recessiveSymbol: 'y',
    dominantTrait: 'Yellow cotyledon',
    recessiveTrait: 'Green cotyledon',
    mendelDominantCount: 6022,
    mendelRecessiveCount: 2001,
    mendelTotal: 8023,
    mendelRatio: 3.01,
    mendelDominantPct: 75.06,
    mendelRecessivePct: 24.94,
    enzymeName: 'Stay-green Mg-dechelatase (SGR)',
    geneMechanism: 'Y codes for functional SGR enzyme that dismantles green chlorophyll during seed maturation, unmasking yellow carotenoids; y is a loss-of-function allele (Sato et al., 2007) that leaves green chlorophyll intact.',
    heterozygoteNote: 'One Y copy in Yy seeds breaks down enough chlorophyll during ripening to turn the cotyledon yellow.',
    f3ProgenyTested: 519,
    f3TrueBreedingDominant: 166,
    f3SegregatingHybrid: 353,
  }),
  Object.freeze({
    traitStep: 4,
    id: 'stem_height',
    character: 'Stem length',
    dominantSymbol: 'T',
    recessiveSymbol: 't',
    dominantTrait: 'Tall stem (1.8–2.1 m)',
    recessiveTrait: 'Dwarf stem (0.3–0.45 m)',
    mendelDominantCount: 787,
    mendelRecessiveCount: 277,
    mendelTotal: 1064,
    mendelRatio: 2.84,
    mendelDominantPct: 73.97,
    mendelRecessivePct: 26.03,
    enzymeName: 'Gibberellin 3β-hydroxylase (PsGA3ox1)',
    geneMechanism: 'T codes for active gibberellin 3β-hydroxylase that converts inactive GA₂₀ into growth hormone GA₁; t carries an Ala229Thr active-site substitution (Lester et al., 1997) that greatly reduces, but does not eliminate, enzyme activity and hormone output, shortening internodes.',
    heterozygoteNote: 'One T copy in Tt plants produces enough active GA₁ hormone for normal tall internode elongation.',
    f3ProgenyTested: 100,
    f3TrueBreedingDominant: 28,
    f3SegregatingHybrid: 72,
  }),
  Object.freeze({
    traitStep: 5,
    id: 'pod_shape',
    character: 'Ripe pod form',
    dominantSymbol: 'P',
    recessiveSymbol: 'p',
    dominantTrait: 'Inflated pod',
    recessiveTrait: 'Constricted pod',
    mendelDominantCount: 882,
    mendelRecessiveCount: 299,
    mendelTotal: 1181,
    mendelRatio: 2.95,
    mendelDominantPct: 74.68,
    mendelRecessivePct: 25.32,
    enzymeName: 'Pod sclerenchyma wall regulator',
    geneMechanism: 'P directs complete lignified sclerenchyma parchment layer formation inside the pod wall; p lacks continuous pod-wall sclerenchyma so the drying pod shrinks tightly around each seed.',
    heterozygoteNote: 'One P allele suffices to form a rigid, inflated pod wall in Pp heterozygotes.',
    f3ProgenyTested: 100,
    f3TrueBreedingDominant: 29,
    f3SegregatingHybrid: 71,
  }),
  Object.freeze({
    traitStep: 6,
    id: 'pod_colour',
    character: 'Unripe pod colour',
    dominantSymbol: 'G',
    recessiveSymbol: 'g',
    dominantTrait: 'Green unripe pod',
    recessiveTrait: 'Yellow unripe pod',
    mendelDominantCount: 428,
    mendelRecessiveCount: 152,
    mendelTotal: 580,
    mendelRatio: 2.82,
    mendelDominantPct: 73.79,
    mendelRecessivePct: 26.21,
    enzymeName: 'Chloroplast development factor (Gp locus)',
    geneMechanism: 'G sustains normal chloroplast biogenesis in developing pod mesophyll cells; g reduces pod-wall chlorophyll accumulation so young pods appear bright yellow.',
    heterozygoteNote: 'One G allele maintains full green pod pigmentation in Gg heterozygotes.',
    f3ProgenyTested: 100,
    f3TrueBreedingDominant: 40,
    f3SegregatingHybrid: 60,
  }),
  Object.freeze({
    traitStep: 7,
    id: 'flower_position',
    character: 'Flower position',
    dominantSymbol: 'Fa',
    recessiveSymbol: 'fa',
    dominantTrait: 'Axial flowers',
    recessiveTrait: 'Terminal flowers',
    mendelDominantCount: 651,
    mendelRecessiveCount: 207,
    mendelTotal: 858,
    mendelRatio: 3.14,
    mendelDominantPct: 75.87,
    mendelRecessivePct: 24.13,
    enzymeName: 'Meristem identity regulator',
    geneMechanism: 'Fa maintains indeterminate shoot apical meristem growth with flowers borne along leaf axils; fa causes fasciated terminal flower clustering at the shoot apex.',
    heterozygoteNote: 'One Fa copy preserves indeterminate axial flowering in Fafa heterozygotes.',
    f3ProgenyTested: 100,
    f3TrueBreedingDominant: 33,
    f3SegregatingHybrid: 67,
  }),
]);

const MENDEL_TRAIT_LOCI = Object.freeze(MENDEL_SEVEN_TRAITS.slice(0, 4));

const MENDEL_COMBINED_LEDGER = Object.freeze({
  traitsCounted: 7,
  dominantTotal: 14949,
  recessiveTotal: 5010,
  grandTotal: 19959,
  combinedRatio: 2.98,
  dominantPct: 74.9,
  recessivePct: 25.1,
  f3RoundSeedsTested: 565,
  f3TrueBreedingRR: 193,
  f3SegregatingRr: 372,
  f3HeteroToHomoRatio: 1.93,
});

const MENDEL_SAMPLE_STEPS = Object.freeze([
  Object.freeze({
    step: 1,
    id: 'pod_16',
    label: '16 trials (illustrative sample)',
    shortLabel: 'N = 16',
    sampleSize: 16,
    note: 'Small sample (N = 16): random fertilisation sampling bounce makes individual families or pods deviate noticeably from the theoretical ratio.',
  }),
  Object.freeze({
    step: 2,
    id: 'kitchen_64',
    label: '64 trials (illustrative sample)',
    shortLabel: 'N = 64',
    sampleSize: 64,
    note: 'Moderate sample (N = 64): matches the two-coin or two-bean kitchen investigation; larger samples have smaller typical percentage fluctuations, not guaranteed improvement on each run.',
  }),
  Object.freeze({
    step: 3,
    id: 'plot_400',
    label: '400 trials (illustrative sample)',
    shortLabel: 'N = 400',
    sampleSize: 400,
    note: 'Large plot sample (N = 400): random fluctuations average out and typical percentage fluctuations shrink; these are preset examples, not freshly sampled counts.',
  }),
  Object.freeze({
    step: 4,
    id: 'mendel_limit',
    label: 'Mendel 1866 / Theoretical Limit',
    shortLabel: 'Mendel 1866',
    sampleSize: 7324,
    note: 'Thousands of independent fertilisations (Mendel 1866 Brno ledger) converge tightly on 3 : 1 (75% : 25%) for F₁ hybrids and 1 : 1 (50% : 50%) for test crosses.',
  }),
]);

const ABO_GENOTYPES = Object.freeze([
  Object.freeze({
    step: 1,
    code: 'IᴬIᴼ',
    asciiCode: 'IAIO',
    alleles: Object.freeze(['Iᴬ', 'Iᴼ']),
    bloodGroup: 'Group A',
    shortGroup: 'A',
    zygosity: 'Heterozygous Group A',
    surfaceAntigens: 'Antigen A only (GalNAc terminal sugar)',
    plasmaAntibodies: 'Anti-B antibodies',
    enzymeState: '1 active GTA transferase copy + 1 non-functional Iᴼ copy (one working copy supplies enough enzyme for Antigen A)',
    inheritancePattern: 'Simple dominance of Iᴬ over recessive Iᴼ',
  }),
  Object.freeze({
    step: 2,
    code: 'IᴬIᴬ',
    asciiCode: 'IAIA',
    alleles: Object.freeze(['Iᴬ', 'Iᴬ']),
    bloodGroup: 'Group A',
    shortGroup: 'A',
    zygosity: 'Homozygous Group A',
    surfaceAntigens: 'Antigen A only (GalNAc terminal sugar)',
    plasmaAntibodies: 'Anti-B antibodies',
    enzymeState: '2 active GTA transferase copies (enzyme adds Antigen A)',
    inheritancePattern: 'Homozygous dominant for Antigen A',
  }),
  Object.freeze({
    step: 3,
    code: 'IᴮIᴼ',
    asciiCode: 'IBIO',
    alleles: Object.freeze(['Iᴮ', 'Iᴼ']),
    bloodGroup: 'Group B',
    shortGroup: 'B',
    zygosity: 'Heterozygous Group B',
    surfaceAntigens: 'Antigen B only (D-Galactose terminal sugar)',
    plasmaAntibodies: 'Anti-A antibodies',
    enzymeState: '1 active GTB transferase copy + 1 non-functional Iᴼ copy (one working copy supplies enough enzyme for Antigen B)',
    inheritancePattern: 'Simple dominance of Iᴮ over recessive Iᴼ',
  }),
  Object.freeze({
    step: 4,
    code: 'IᴮIᴮ',
    asciiCode: 'IBIB',
    alleles: Object.freeze(['Iᴮ', 'Iᴮ']),
    bloodGroup: 'Group B',
    shortGroup: 'B',
    zygosity: 'Homozygous Group B',
    surfaceAntigens: 'Antigen B only (D-Galactose terminal sugar)',
    plasmaAntibodies: 'Anti-A antibodies',
    enzymeState: '2 active GTB transferase copies (enzyme adds Antigen B)',
    inheritancePattern: 'Homozygous dominant for Antigen B',
  }),
  Object.freeze({
    step: 5,
    code: 'IᴬIᴮ',
    asciiCode: 'IAIB',
    alleles: Object.freeze(['Iᴬ', 'Iᴮ']),
    bloodGroup: 'Group AB',
    shortGroup: 'AB',
    zygosity: 'Codominant Heterozygote (Group AB)',
    surfaceAntigens: 'Both Antigen A (GalNAc) and Antigen B (D-Galactose)',
    plasmaAntibodies: 'Neither Anti-A nor Anti-B antibodies',
    enzymeState: '1 active GTA copy + 1 active GTB copy; both enzymes attach their respective sugars side by side on the same red blood cell membrane',
    inheritancePattern: 'Codominance: both Iᴬ and Iᴮ alleles are simultaneously and distinctly expressed in the heterozygote phenotype',
  }),
  Object.freeze({
    step: 6,
    code: 'IᴼIᴼ',
    asciiCode: 'IOIO',
    alleles: Object.freeze(['Iᴼ', 'Iᴼ']),
    bloodGroup: 'Group O',
    shortGroup: 'O',
    zygosity: 'Homozygous Recessive (Group O)',
    surfaceAntigens: 'Unmodified H-antigen stalks only (no A or B sugar added)',
    plasmaAntibodies: 'Both Anti-A and Anti-B antibodies',
    enzymeState: '0 active copies in this common O-allele example (single-base deletion ΔG261 shifts reading frame in both Iᴼ alleles, producing truncated non-functional protein)',
    inheritancePattern: 'Homozygous recessive: Group O appears only when neither Iᴬ nor Iᴮ is present',
  }),
]);

const ABO_CROSS_MODES = Object.freeze([
  Object.freeze({
    index: 0,
    id: 'four_group_cross',
    label: '4-Group (IᴬIᴼ × IᴮIᴼ)',
    shortLabel: '4-Group Cross',
    defaultMaternalStep: 1,
    defaultPaternalStep: 3,
    summary: 'Heterozygous Group A (IᴬIᴼ) × Heterozygous Group B (IᴮIᴼ) can produce all four ABO blood groups—AB (25%), A (25%), B (25%), and O (25%)—in a 1 : 1 : 1 : 1 ratio.',
  }),
  Object.freeze({
    index: 1,
    id: 'hospital_swap_check',
    label: 'Swap Check (IᴬIᴮ × IᴼIᴼ)',
    shortLabel: 'Swap Check',
    defaultMaternalStep: 5,
    defaultPaternalStep: 6,
    summary: 'Group AB parent (IᴬIᴮ) × Group O parent (IᴼIᴼ) yields 50% Group A (IᴬIᴼ) and 50% Group B (IᴮIᴼ) children—never Group AB (0%) and never Group O (0%).',
  }),
  Object.freeze({
    index: 2,
    id: 'codominance_ratio',
    label: 'Codominance (IᴬIᴮ × IᴬIᴮ)',
    shortLabel: '1:2:1 Codominance',
    defaultMaternalStep: 5,
    defaultPaternalStep: 5,
    summary: 'Crossing two codominant heterozygotes (IᴬIᴮ × IᴬIᴮ) produces 25% Group A (IᴬIᴬ), 50% Group AB (IᴬIᴮ), and 25% Group B (IᴮIᴮ)—a 1 : 2 : 1 phenotype ratio matching the 1 : 2 : 1 genotype ratio.',
  }),
  Object.freeze({
    index: 3,
    id: 'pedigree_detective',
    label: 'Pedigree Detective',
    shortLabel: 'Pedigree Rules',
    defaultMaternalStep: 1,
    defaultPaternalStep: 1,
    summary: 'Pedigree deduction rules: two unaffected carrier parents (Aa × Aa) having an affected child (aa, or Group O child from IᴬIᴼ × IᴬIᴼ) indicates recessive inheritance in our single-gene, fully expressed, no-new-mutation model.',
  }),
]);

const PEDIGREE_DETECTIVE_RULES = Object.freeze([
  Object.freeze({
    ruleNumber: 1,
    id: 'recessive_proof',
    title: 'Rule 1 — Unaffected Parents → Affected Child (Recessive Model)',
    parentPattern: 'Two unaffected parents (Aa × Aa) produce an affected child (aa)',
    deduction: 'Within our single-gene, fully expressed, no-new-mutation model, the condition is recessive and both parents are heterozygous carriers (Aa), and the affected child is homozygous recessive (aa).',
    whyOtherFails: 'If the condition were dominant, an affected child would require at least one dominant allele, which would have made at least one parent affected.',
    siblingProbabilities: 'Each subsequent pregnancy has a 25% (1/4) chance of being affected (aa), a 50% (2/4) chance of being an unaffected carrier (Aa), and a 25% (1/4) chance of being homozygous normal (AA). Among already-born unaffected siblings, 2/3 are carriers (Aa).',
  }),
  Object.freeze({
    ruleNumber: 2,
    id: 'dominant_proof',
    title: 'Rule 2 — Affected Parents → Unaffected Child (Dominant Model)',
    parentPattern: 'Two affected parents (Aa × Aa) produce an unaffected child (aa)',
    deduction: 'Within our single-gene, fully expressed, no-new-mutation model, the condition is dominant and both affected parents are heterozygotes (Aa), and the unaffected child is homozygous recessive (aa).',
    whyOtherFails: 'If the condition were recessive, two affected parents would both be homozygous recessive (aa × aa) and could pass only recessive alleles (100% affected children).',
    siblingProbabilities: 'Each pregnancy has a 75% (3/4) chance of being affected (1/4 AA + 2/4 Aa) and a 25% (1/4) chance of being unaffected (aa).',
  }),
]);

const SEX_LINKED_MODES = Object.freeze([
  Object.freeze({
    index: 0,
    id: 'carrier_mum_normal_dad',
    label: 'Carrier Mum × Normal Dad',
    shortLabel: 'Carrier × Normal',
    defaultMaternalStep: 1,
    defaultPaternalStep: 1,
    defaultTraitStep: 1,
    summary: 'Carrier mother (XᴮXᵇ or XᴴXʰ) × Normal father (XᴮY or XᴴY): 0% of daughters are affected (50% normal, 50% carriers), while 50% of sons are affected (XᵇY or XʰY) because sons inherit their single X from their mother.',
  }),
  Object.freeze({
    index: 1,
    id: 'normal_mum_affected_dad',
    label: 'Normal Mum × Affected Dad',
    shortLabel: 'Normal × Affected',
    defaultMaternalStep: 2,
    defaultPaternalStep: 2,
    defaultTraitStep: 1,
    summary: 'Homozygous normal mother (XᴮXᴮ) × Affected father (XᵇY): 0% of sons are affected (fathers give sons their Y chromosome, never their X), while 100% of daughters become heterozygous carriers (XᴮXᵇ).',
  }),
  Object.freeze({
    index: 2,
    id: 'carrier_mum_affected_dad',
    label: 'Carrier Mum × Affected Dad',
    shortLabel: 'Carrier × Affected',
    defaultMaternalStep: 1,
    defaultPaternalStep: 2,
    defaultTraitStep: 1,
    summary: 'Carrier mother (XᴮXᵇ) × Affected father (XᵇY): 50% of daughters are affected (XᵇXᵇ, inheriting a recessive Xᵇ from both parents) and 50% are carriers (XᴮXᵇ); 50% of sons are normal (XᴮY) and 50% are affected (XᵇY).',
  }),
  Object.freeze({
    index: 3,
    id: 'xx_xy_sex_ratio',
    label: 'XX × XY (1:1 Sex Ratio)',
    shortLabel: 'XX × XY Ratio',
    defaultMaternalStep: 1,
    defaultPaternalStep: 1,
    defaultTraitStep: 1,
    summary: 'In the typical XX/XY model, an ovum carries 22 autosomes + X; meiosis in the father produces 50% X-sperm (22 + X) and 50% Y-sperm (22 + Y), giving expected independent 50% XX and 50% XY probabilities in this model; actual birth ratios need not equal 1 : 1.',
  }),
]);

const SEX_LINKED_TRAITS = Object.freeze([
  Object.freeze({
    traitStep: 1,
    id: 'colour_vision',
    name: 'Red–green colour vision (opsin gene on X)',
    shortName: 'Red–green vision',
    dominantAllele: 'Xᴮ',
    recessiveAllele: 'Xᵇ',
    yAllele: 'Y',
    normalPhenotype: 'Normal trichromatic colour vision',
    affectedPhenotype: 'Red–green colour vision deficiency',
    carrierPhenotype: 'Normal colour vision (carrier female)',
    chapterBridge: 'Chapter 9 (9.4): Red-sensitive and green-sensitive photopigment opsin proteins in foveal cone cells are encoded on the non-homologous region of the X chromosome.',
    molecularMechanism: 'Xᴮ codes for normal red/green cone opsin photopigment; Xᵇ alters the opsin spectral sensitivity, and Y carries no opsin locus.',
  }),
  Object.freeze({
    traitStep: 2,
    id: 'haemophilia',
    name: 'Haemophilia blood clotting (Factor VIII / IX on X)',
    shortName: 'Haemophilia',
    dominantAllele: 'Xᴴ',
    recessiveAllele: 'Xʰ',
    yAllele: 'Y',
    normalPhenotype: 'Normal blood clotting cascade',
    affectedPhenotype: 'Haemophilia (impaired fibrin clotting)',
    carrierPhenotype: 'Carrier female (may have bleeding symptoms)',
    chapterBridge: 'Chapters 8 & 10 (8.4 & 10.4): Plasma clotting enzyme cascade converts soluble fibrinogen into insoluble fibrin mesh threads to seal wounds.',
    molecularMechanism: 'The notation represents either F8 or F9, separate genes on X. Factor VIII helps activated Factor IX in an upstream clotting step; thrombin converts fibrinogen to fibrin. Altered factor function impairs clotting. Some heterozygous women have bleeding symptoms because of X-inactivation; these grid percentages describe the simple recessive model.',
  }),
  Object.freeze({
    traitStep: 3,
    id: 'morgan_drosophila',
    name: 'Morgan 1910 Drosophila eye colour (white locus on X)',
    shortName: 'Fly eye colour',
    dominantAllele: 'X⁺',
    recessiveAllele: 'Xʷ',
    yAllele: 'Y',
    normalPhenotype: 'Brick-red compound eyes',
    affectedPhenotype: 'White compound eyes',
    carrierPhenotype: 'Red compound eyes (carrier female)',
    chapterBridge: 'Thomas Hunt Morgan (1910, Columbia Fly Room) discovered that white-eyed F₂ flies (782 white out of 4,252 F₂ flies) were exclusively male (XʷY), proving genes reside on specific chromosomes.',
    molecularMechanism: 'X⁺ codes for an ABC pigment transporter that loads red and brown pigment precursors into eye ommatidia; Xʷ lacks the transporter and Y has no white locus.',
  }),
]);

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function buildMendelGenotypeStep(step, domSymbol, recSymbol) {
  const s = clampInt(step, 1, 3, 2);
  if (s === 1) {
    return Object.freeze({
      step: 1,
      code: `${domSymbol}${domSymbol}`,
      canonical: 'RR',
      alleles: Object.freeze([domSymbol, domSymbol]),
      zygosity: 'Homozygous dominant',
      workingAlleleCopies: 2,
      isDominantPhenotype: true,
    });
  }
  if (s === 2) {
    return Object.freeze({
      step: 2,
      code: `${domSymbol}${recSymbol}`,
      canonical: 'Rr',
      alleles: Object.freeze([domSymbol, recSymbol]),
      zygosity: 'Heterozygous',
      workingAlleleCopies: 1,
      isDominantPhenotype: true,
    });
  }
  return Object.freeze({
    step: 3,
    code: `${recSymbol}${recSymbol}`,
    canonical: 'rr',
    alleles: Object.freeze([recSymbol, recSymbol]),
    zygosity: 'Homozygous recessive',
    workingAlleleCopies: 0,
    isDominantPhenotype: false,
  });
}

function combineMendelAlleles(a1, a2, domSymbol, recSymbol) {
  const domCount = (a1 === domSymbol ? 1 : 0) + (a2 === domSymbol ? 1 : 0);
  if (domCount === 2) {
    return Object.freeze({
      genotype: `${domSymbol}${domSymbol}`,
      canonical: 'RR',
      zygosity: 'Homozygous dominant',
      workingAlleleCopies: 2,
      isDominantPhenotype: true,
    });
  }
  if (domCount === 1) {
    return Object.freeze({
      genotype: `${domSymbol}${recSymbol}`,
      canonical: 'Rr',
      zygosity: 'Heterozygous',
      workingAlleleCopies: 1,
      isDominantPhenotype: true,
    });
  }
  return Object.freeze({
    genotype: `${recSymbol}${recSymbol}`,
    canonical: 'rr',
    zygosity: 'Homozygous recessive',
    workingAlleleCopies: 0,
    isDominantPhenotype: false,
  });
}

function computeMendelSampleCounts(canonicalCounts, sampleStep, traitInfo, modeIndex) {
  const totalGrid = 4;
  const pRR = canonicalCounts.RR / totalGrid;
  const pRr = canonicalCounts.Rr / totalGrid;
  const prr = canonicalCounts.rr / totalGrid;
  const pDom = pRR + pRr;

  if (sampleStep === 4) {
    if (modeIndex === 3) {
      return Object.freeze({
        sampleSize: MENDEL_COMBINED_LEDGER.grandTotal,
        dominantCount: MENDEL_COMBINED_LEDGER.dominantTotal,
        recessiveCount: MENDEL_COMBINED_LEDGER.recessiveTotal,
        rrHomoDomCount: Math.round(MENDEL_COMBINED_LEDGER.grandTotal * 0.25),
        rrHeteroCount: Math.round(MENDEL_COMBINED_LEDGER.grandTotal * 0.5),
        rrRecessiveCount: MENDEL_COMBINED_LEDGER.recessiveTotal,
        dominantPct: MENDEL_COMBINED_LEDGER.dominantPct,
        recessivePct: MENDEL_COMBINED_LEDGER.recessivePct,
        observedRatioText: `${MENDEL_COMBINED_LEDGER.combinedRatio.toFixed(2)} : 1`,
        sourceLabel: 'Mendel 1866 combined 7-trait ledger',
      });
    }
    if (canonicalCounts.RR === 1 && canonicalCounts.Rr === 2 && canonicalCounts.rr === 1) {
      return Object.freeze({
        sampleSize: traitInfo.mendelTotal,
        dominantCount: traitInfo.mendelDominantCount,
        recessiveCount: traitInfo.mendelRecessiveCount,
        rrHomoDomCount: Math.round(traitInfo.mendelDominantCount / 3),
        rrHeteroCount: traitInfo.mendelDominantCount - Math.round(traitInfo.mendelDominantCount / 3),
        rrRecessiveCount: traitInfo.mendelRecessiveCount,
        dominantPct: traitInfo.mendelDominantPct,
        recessivePct: traitInfo.mendelRecessivePct,
        observedRatioText: `${traitInfo.mendelRatio.toFixed(2)} : 1`,
        sourceLabel: `Mendel 1866 Brno F₂ (${traitInfo.character})`,
      });
    }
    const n = 1000;
    const domCount = Math.round(n * pDom);
    const recCount = n - domCount;
    return Object.freeze({
      sampleSize: n,
      dominantCount: domCount,
      recessiveCount: recCount,
      rrHomoDomCount: Math.round(n * pRR),
      rrHeteroCount: Math.round(n * pRr),
      rrRecessiveCount: Math.round(n * prr),
      dominantPct: roundTo(pDom * 100, 1),
      recessivePct: roundTo(prr * 100, 1),
      observedRatioText:
        recCount > 0 && domCount > 0
          ? `${roundTo(domCount / recCount, 2).toFixed(2)} : 1`
          : domCount > 0
            ? '100% dominant'
            : '100% recessive',
      sourceLabel: 'Expected counts, not observations (N = 1,000)',
    });
  }

  const stepMeta = MENDEL_SAMPLE_STEPS[sampleStep - 1];
  const n = stepMeta.sampleSize;

  if (pDom === 1) {
    return Object.freeze({
      sampleSize: n,
      dominantCount: n,
      recessiveCount: 0,
      rrHomoDomCount: Math.round(n * pRR),
      rrHeteroCount: n - Math.round(n * pRR),
      rrRecessiveCount: 0,
      dominantPct: 100,
      recessivePct: 0,
      observedRatioText: '100% dominant',
      sourceLabel: stepMeta.label,
    });
  }
  if (pDom === 0) {
    return Object.freeze({
      sampleSize: n,
      dominantCount: 0,
      recessiveCount: n,
      rrHomoDomCount: 0,
      rrHeteroCount: 0,
      rrRecessiveCount: n,
      dominantPct: 0,
      recessivePct: 100,
      observedRatioText: '100% recessive',
      sourceLabel: stepMeta.label,
    });
  }

  // Preset illustrative counts for comparison, not a random run or a guarantee of monotonic convergence
  const traitOffset = (traitInfo.traitStep % 2 === 1 ? -1 : 1);
  let delta = 0;
  if (sampleStep === 1) delta = traitOffset * 1; // e.g. 11:5 or 13:3 for N=16 (3:1), 7:9 or 9:7 for 1:1
  else if (sampleStep === 2) delta = traitOffset * 2; // e.g. 46:18 or 50:14 for N=64 (3:1), 30:34 or 34:30 for 1:1
  else if (sampleStep === 3) delta = traitOffset * 3; // e.g. 297:103 or 303:97 for N=400 (3:1)

  const expectedDom = Math.round(n * pDom);
  const domCount = Math.max(1, Math.min(n - 1, expectedDom + delta));
  const recCount = n - domCount;
  const homoDomCount = pRR > 0 ? Math.max(0, Math.round(domCount * (pRR / pDom))) : 0;
  const heteroCount = Math.max(0, domCount - homoDomCount);

  return Object.freeze({
    sampleSize: n,
    dominantCount: domCount,
    recessiveCount: recCount,
    rrHomoDomCount: homoDomCount,
    rrHeteroCount: heteroCount,
    rrRecessiveCount: recCount,
    dominantPct: roundTo((domCount / n) * 100, 1),
    recessivePct: roundTo((recCount / n) * 100, 1),
    observedRatioText: `${roundTo(domCount / recCount, 2).toFixed(2)} : 1`,
    sourceLabel: stepMeta.label,
  });
}

export function simulateMendelPunnett(params = {}) {
  const modeIndex = clampInt(params.modeIndex ?? 0, 0, MENDEL_CROSS_MODES.length - 1, 0);
  const mode = MENDEL_CROSS_MODES[modeIndex];
  const traitStep = clampInt(params.traitStep ?? 1, 1, MENDEL_SEVEN_TRAITS.length, 1);
  const trait = MENDEL_SEVEN_TRAITS[traitStep - 1];
  const sampleStep = clampInt(params.sampleStep ?? 4, 1, MENDEL_SAMPLE_STEPS.length, 4);
  const sampleMeta = MENDEL_SAMPLE_STEPS[sampleStep - 1];

  const maternalStep = clampInt(
    params.maternalGenotypeStep ?? mode.defaultMaternalStep,
    1,
    3,
    mode.defaultMaternalStep
  );
  const paternalStep = clampInt(
    params.paternalGenotypeStep ?? mode.defaultPaternalStep,
    1,
    3,
    mode.defaultPaternalStep
  );

  const maternal = buildMendelGenotypeStep(maternalStep, trait.dominantSymbol, trait.recessiveSymbol);
  const paternal = buildMendelGenotypeStep(paternalStep, trait.dominantSymbol, trait.recessiveSymbol);

  const cells = [];
  const canonicalCounts = { RR: 0, Rr: 0, rr: 0 };
  let dominantSquares = 0;
  let recessiveSquares = 0;

  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 2; c += 1) {
      const matGamete = maternal.alleles[r];
      const patGamete = paternal.alleles[c];
      const outcome = combineMendelAlleles(matGamete, patGamete, trait.dominantSymbol, trait.recessiveSymbol);
      canonicalCounts[outcome.canonical] += 1;
      if (outcome.isDominantPhenotype) dominantSquares += 1;
      else recessiveSquares += 1;
      cells.push(
        Object.freeze({
          row: r,
          col: c,
          maternalGamete: matGamete,
          paternalGamete: patGamete,
          genotype: outcome.genotype,
          canonical: outcome.canonical,
          zygosity: outcome.zygosity,
          workingAlleleCopies: outcome.workingAlleleCopies,
          isDominantPhenotype: outcome.isDominantPhenotype,
          phenotype: outcome.isDominantPhenotype ? trait.dominantTrait : trait.recessiveTrait,
          probabilityPct: 25,
        })
      );
    }
  }

  const theoreticalDominantPct = dominantSquares * 25;
  const theoreticalRecessivePct = recessiveSquares * 25;
  const theoreticalHomoDomPct = canonicalCounts.RR * 25;
  const theoreticalHeteroPct = canonicalCounts.Rr * 25;
  const theoreticalHomoRecPct = canonicalCounts.rr * 25;

  let theoreticalPhenotypeRatio = '100% dominant : 0% recessive';
  if (dominantSquares === 3 && recessiveSquares === 1) theoreticalPhenotypeRatio = '3 : 1';
  else if (dominantSquares === 2 && recessiveSquares === 2) theoreticalPhenotypeRatio = '1 : 1';
  else if (dominantSquares === 0 && recessiveSquares === 4) theoreticalPhenotypeRatio = '0% dominant : 100% recessive';

  let theoreticalGenotypeRatio = `${canonicalCounts.RR} ${trait.dominantSymbol}${trait.dominantSymbol} : ${canonicalCounts.Rr} ${trait.dominantSymbol}${trait.recessiveSymbol} : ${canonicalCounts.rr} ${trait.recessiveSymbol}${trait.recessiveSymbol}`;
  if (canonicalCounts.RR === 1 && canonicalCounts.Rr === 2 && canonicalCounts.rr === 1) {
    theoreticalGenotypeRatio = `1 ${trait.dominantSymbol}${trait.dominantSymbol} : 2 ${trait.dominantSymbol}${trait.recessiveSymbol} : 1 ${trait.recessiveSymbol}${trait.recessiveSymbol}`;
  } else if (canonicalCounts.RR === 0 && canonicalCounts.Rr === 2 && canonicalCounts.rr === 2) {
    theoreticalGenotypeRatio = `1 ${trait.dominantSymbol}${trait.recessiveSymbol} : 1 ${trait.recessiveSymbol}${trait.recessiveSymbol}`;
  } else if (canonicalCounts.RR === 2 && canonicalCounts.Rr === 2 && canonicalCounts.rr === 0) {
    theoreticalGenotypeRatio = `1 ${trait.dominantSymbol}${trait.dominantSymbol} : 1 ${trait.dominantSymbol}${trait.recessiveSymbol}`;
  } else if (canonicalCounts.Rr === 4) {
    theoreticalGenotypeRatio = `100% ${trait.dominantSymbol}${trait.recessiveSymbol}`;
  } else if (canonicalCounts.RR === 4) {
    theoreticalGenotypeRatio = `100% ${trait.dominantSymbol}${trait.dominantSymbol}`;
  } else if (canonicalCounts.rr === 4) {
    theoreticalGenotypeRatio = `100% ${trait.recessiveSymbol}${trait.recessiveSymbol}`;
  }

  const historical = sampleStep === 4 && (modeIndex === 3 ||
    (canonicalCounts.RR === 1 && canonicalCounts.Rr === 2 && canonicalCounts.rr === 1));
  const empirical = Object.freeze({
    ...computeMendelSampleCounts(canonicalCounts, sampleStep, trait, modeIndex),
    sampleKind: historical ? 'historical' : sampleStep === 4 ? 'theoretical' : 'illustrative',
  });

  return Object.freeze({
    modeIndex,
    mode,
    traitStep,
    trait,
    sampleStep,
    sampleMeta,
    maternalStep,
    paternalStep,
    maternal,
    paternal,
    crossCode: `${maternal.code} × ${paternal.code}`,
    punnettCells: Object.freeze(cells),
    canonicalCounts: Object.freeze({ ...canonicalCounts }),
    dominantSquares,
    recessiveSquares,
    theoreticalDominantPct,
    theoreticalRecessivePct,
    theoreticalHomoDomPct,
    theoreticalHeteroPct,
    theoreticalHomoRecPct,
    theoreticalPhenotypeRatio,
    theoreticalGenotypeRatio,
    empirical,
    sevenTraitsLedger: MENDEL_SEVEN_TRAITS,
    combinedLedger: MENDEL_COMBINED_LEDGER,
  });
}

export function captureMendelTrial(state) {
  const s = state && state.punnettCells ? state : simulateMendelPunnett(state || {});
  return Object.freeze({
    crossCode: s.crossCode,
    character: s.trait.character,
    modeLabel: s.mode.shortLabel,
    sampleLabel: s.sampleMeta.shortLabel,
    theoreticalPhenotypeRatio: s.theoreticalPhenotypeRatio,
    theoreticalGenotypeRatio: s.theoreticalGenotypeRatio,
    theoreticalDominantPct: s.theoreticalDominantPct,
    theoreticalRecessivePct: s.theoreticalRecessivePct,
    observedRatioText: s.empirical.observedRatioText,
    observedDominantPct: s.empirical.dominantPct,
    observedRecessivePct: s.empirical.recessivePct,
    sampleSize: s.empirical.sampleSize,
    sampleKind: s.empirical.sampleKind,
  });
}

export function compareMendelTrials(trialA, trialB) {
  const a = trialA && typeof trialA.observedDominantPct === 'number' ? trialA : captureMendelTrial(trialA);
  const b = trialB && typeof trialB.observedDominantPct === 'number' ? trialB : captureMendelTrial(trialB);
  const domPctDelta = roundTo(b.observedDominantPct - a.observedDominantPct, 2);
  const theoDomDelta = roundTo(b.theoreticalDominantPct - a.theoreticalDominantPct, 2);
  return Object.freeze({
    first: a,
    second: b,
    theoreticalDominantDeltaPct: theoDomDelta,
    observedDominantDeltaPct: domPctDelta,
    summary: `${a.crossCode} (${a.sampleLabel}: ${a.observedDominantPct}% dom, ${a.observedRatioText}) vs ${b.crossCode} (${b.sampleLabel}: ${b.observedDominantPct}% dom, ${b.observedRatioText})`,
  });
}

const ALLELE_ORDER = Object.freeze({
  'Iᴬ': 1,
  'Iᴮ': 2,
  'Iᴼ': 3,
});

function combineAboAlleles(a1, a2) {
  const sorted = [a1, a2].sort((x, y) => (ALLELE_ORDER[x] || 9) - (ALLELE_ORDER[y] || 9));
  const code = `${sorted[0]}${sorted[1]}`;
  const found = ABO_GENOTYPES.find((g) => g.code === code) || ABO_GENOTYPES[0];
  return found;
}

export function simulateAboCodominancePedigree(params = {}) {
  const modeIndex = clampInt(params.modeIndex ?? 0, 0, ABO_CROSS_MODES.length - 1, 0);
  const mode = ABO_CROSS_MODES[modeIndex];
  const maternalStep = clampInt(
    params.maternalGenotypeStep ?? mode.defaultMaternalStep,
    1,
    ABO_GENOTYPES.length,
    mode.defaultMaternalStep
  );
  const paternalStep = clampInt(
    params.paternalGenotypeStep ?? mode.defaultPaternalStep,
    1,
    ABO_GENOTYPES.length,
    mode.defaultPaternalStep
  );
  const pedigreeFocusStep = clampInt(params.pedigreeFocusStep ?? 1, 1, 2, 1);

  const maternal = ABO_GENOTYPES[maternalStep - 1];
  const paternal = ABO_GENOTYPES[paternalStep - 1];

  const cells = [];
  const groupSquares = { A: 0, B: 0, AB: 0, O: 0 };
  const genotypeSquares = {};

  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 2; c += 1) {
      const matGamete = maternal.alleles[r];
      const patGamete = paternal.alleles[c];
      const outcome = combineAboAlleles(matGamete, patGamete);
      groupSquares[outcome.shortGroup] += 1;
      genotypeSquares[outcome.code] = (genotypeSquares[outcome.code] || 0) + 1;
      cells.push(
        Object.freeze({
          row: r,
          col: c,
          maternalGamete: matGamete,
          paternalGamete: patGamete,
          genotype: outcome.code,
          bloodGroup: outcome.bloodGroup,
          shortGroup: outcome.shortGroup,
          zygosity: outcome.zygosity,
          surfaceAntigens: outcome.surfaceAntigens,
          plasmaAntibodies: outcome.plasmaAntibodies,
          probabilityPct: 25,
        })
      );
    }
  }

  const groupPercentages = Object.freeze({
    A: groupSquares.A * 25,
    B: groupSquares.B * 25,
    AB: groupSquares.AB * 25,
    O: groupSquares.O * 25,
  });

  const possibleGroups = Object.keys(groupSquares).filter((k) => groupSquares[k] > 0);
  const impossibleGroups = Object.keys(groupSquares).filter((k) => groupSquares[k] === 0);

  let phenotypeRatioSummary = possibleGroups
    .map((g) => `${groupPercentages[g]}% Group ${g}`)
    .join(' : ');

  const canHaveGroupOChild = groupPercentages.O > 0;
  const canHaveGroupABChild = groupPercentages.AB > 0;
  const isFourGroupSplit =
    groupPercentages.A === 25 &&
    groupPercentages.B === 25 &&
    groupPercentages.AB === 25 &&
    groupPercentages.O === 25;
  const isCodominantOneTwoOne =
    groupPercentages.A === 25 &&
    groupPercentages.AB === 50 &&
    groupPercentages.B === 25 &&
    groupPercentages.O === 0;

  const activePedigreeRule = PEDIGREE_DETECTIVE_RULES[pedigreeFocusStep - 1];

  return Object.freeze({
    modeIndex,
    mode,
    maternalStep,
    paternalStep,
    maternal,
    paternal,
    crossCode: `${maternal.code} × ${paternal.code}`,
    parentPhenotypes: `${maternal.bloodGroup} × ${paternal.bloodGroup}`,
    punnettCells: Object.freeze(cells),
    groupSquares: Object.freeze({ ...groupSquares }),
    groupPercentages,
    genotypeSquares: Object.freeze({ ...genotypeSquares }),
    possibleGroups: Object.freeze(possibleGroups),
    impossibleGroups: Object.freeze(impossibleGroups),
    phenotypeRatioSummary,
    canHaveGroupOChild,
    canHaveGroupABChild,
    isFourGroupSplit,
    isCodominantOneTwoOne,
    pedigreeFocusStep,
    activePedigreeRule,
    pedigreeRules: PEDIGREE_DETECTIVE_RULES,
  });
}

export function captureAboTrial(state) {
  const s = state && state.punnettCells ? state : simulateAboCodominancePedigree(state || {});
  return Object.freeze({
    crossCode: s.crossCode,
    parentPhenotypes: s.parentPhenotypes,
    groupPercentages: s.groupPercentages,
    possibleGroups: s.possibleGroups,
    impossibleGroups: s.impossibleGroups,
    phenotypeRatioSummary: s.phenotypeRatioSummary,
    canHaveGroupOChild: s.canHaveGroupOChild,
    canHaveGroupABChild: s.canHaveGroupABChild,
  });
}

export function compareAboTrials(trialA, trialB) {
  const a = trialA && trialA.groupPercentages && !trialA.punnettCells ? trialA : captureAboTrial(trialA);
  const b = trialB && trialB.groupPercentages && !trialB.punnettCells ? trialB : captureAboTrial(trialB);
  return Object.freeze({
    first: a,
    second: b,
    groupODeltaPct: b.groupPercentages.O - a.groupPercentages.O,
    groupABDeltaPct: b.groupPercentages.AB - a.groupPercentages.AB,
    summary: `${a.crossCode} (${a.phenotypeRatioSummary}) vs ${b.crossCode} (${b.phenotypeRatioSummary})`,
  });
}

function buildMaternalXState(step, trait) {
  const s = clampInt(step, 1, 3, 1);
  const dom = trait.dominantAllele;
  const rec = trait.recessiveAllele;
  if (s === 1) {
    return Object.freeze({
      step: 1,
      code: `${dom}${rec}`,
      alleles: Object.freeze([dom, rec]),
      status: 'Carrier Female (heterozygous XX)',
      phenotype: trait.carrierPhenotype,
      isAffected: false,
      isCarrier: true,
    });
  }
  if (s === 2) {
    return Object.freeze({
      step: 2,
      code: `${dom}${dom}`,
      alleles: Object.freeze([dom, dom]),
      status: 'Homozygous Normal Female (XX)',
      phenotype: trait.normalPhenotype,
      isAffected: false,
      isCarrier: false,
    });
  }
  return Object.freeze({
    step: 3,
    code: `${rec}${rec}`,
    alleles: Object.freeze([rec, rec]),
    status: 'Affected Female (homozygous recessive XX)',
    phenotype: trait.affectedPhenotype,
    isAffected: true,
    isCarrier: false,
  });
}

function buildPaternalXYState(step, trait) {
  const s = clampInt(step, 1, 2, 1);
  const dom = trait.dominantAllele;
  const rec = trait.recessiveAllele;
  if (s === 1) {
    return Object.freeze({
      step: 1,
      code: `${dom}Y`,
      alleles: Object.freeze([dom, 'Y']),
      status: 'Normal Male (hemizygous XY)',
      phenotype: trait.normalPhenotype,
      isAffected: false,
    });
  }
  return Object.freeze({
    step: 2,
    code: `${rec}Y`,
    alleles: Object.freeze([rec, 'Y']),
    status: 'Affected Male (hemizygous XY)',
    phenotype: trait.affectedPhenotype,
    isAffected: true,
  });
}

export function simulateSexLinkedCross(params = {}) {
  const modeIndex = clampInt(params.modeIndex ?? 0, 0, SEX_LINKED_MODES.length - 1, 0);
  const mode = SEX_LINKED_MODES[modeIndex];
  const traitStep = clampInt(
    params.traitStep ?? mode.defaultTraitStep,
    1,
    SEX_LINKED_TRAITS.length,
    mode.defaultTraitStep
  );
  const trait = SEX_LINKED_TRAITS[traitStep - 1];

  const maternalStep = clampInt(
    params.maternalStep ?? mode.defaultMaternalStep,
    1,
    3,
    mode.defaultMaternalStep
  );
  const paternalStep = clampInt(
    params.paternalStep ?? mode.defaultPaternalStep,
    1,
    2,
    mode.defaultPaternalStep
  );

  const maternal = buildMaternalXState(maternalStep, trait);
  const paternal = buildPaternalXYState(paternalStep, trait);

  const dom = trait.dominantAllele;
  const rec = trait.recessiveAllele;

  const cells = [];
  let daughtersTotal = 0;
  let daughtersHomoNormal = 0;
  let daughtersCarrier = 0;
  let daughtersAffected = 0;
  let sonsTotal = 0;
  let sonsNormal = 0;
  let sonsAffected = 0;

  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 2; c += 1) {
      const ovum = maternal.alleles[r];
      const sperm = paternal.alleles[c];
      const isMale = sperm === 'Y';
      let genotype = '';
      let category = '';
      let phenotype = '';
      let isAffected = false;
      let isCarrier = false;

      if (isMale) {
        sonsTotal += 1;
        genotype = `${ovum}Y`;
        if (ovum === dom) {
          sonsNormal += 1;
          category = 'Normal Son (XY)';
          phenotype = trait.normalPhenotype;
        } else {
          sonsAffected += 1;
          isAffected = true;
          category = 'Affected Son (XY)';
          phenotype = trait.affectedPhenotype;
        }
      } else {
        daughtersTotal += 1;
        const domCount = (ovum === dom ? 1 : 0) + (sperm === dom ? 1 : 0);
        if (domCount === 2) {
          genotype = `${dom}${dom}`;
          daughtersHomoNormal += 1;
          category = 'Normal Daughter (XX)';
          phenotype = trait.normalPhenotype;
        } else if (domCount === 1) {
          genotype = `${dom}${rec}`;
          daughtersCarrier += 1;
          isCarrier = true;
          category = 'Carrier Daughter (XX)';
          phenotype = trait.carrierPhenotype;
        } else {
          genotype = `${rec}${rec}`;
          daughtersAffected += 1;
          isAffected = true;
          category = 'Affected Daughter (XX)';
          phenotype = trait.affectedPhenotype;
        }
      }

      cells.push(
        Object.freeze({
          row: r,
          col: c,
          ovumAllele: ovum,
          spermAllele: sperm,
          sex: isMale ? 'Male (XY)' : 'Female (XX)',
          genotype,
          category,
          phenotype,
          isAffected,
          isCarrier,
          probabilityOfAllChildrenPct: 25,
          probabilityWithinSexPct: 50,
        })
      );
    }
  }

  const amongDaughters = Object.freeze({
    homozygousNormalPct: (daughtersHomoNormal / daughtersTotal) * 100,
    carrierPct: (daughtersCarrier / daughtersTotal) * 100,
    affectedPct: (daughtersAffected / daughtersTotal) * 100,
    unaffectedTotalPct: ((daughtersHomoNormal + daughtersCarrier) / daughtersTotal) * 100,
  });

  const amongSons = Object.freeze({
    normalPct: (sonsNormal / sonsTotal) * 100,
    affectedPct: (sonsAffected / sonsTotal) * 100,
  });

  const amongAllChildren = Object.freeze({
    femaleXXPct: 50,
    maleXYPct: 50,
    normalDaughterPct: daughtersHomoNormal * 25,
    carrierDaughterPct: daughtersCarrier * 25,
    affectedDaughterPct: daughtersAffected * 25,
    normalSonPct: sonsNormal * 25,
    affectedSonPct: sonsAffected * 25,
    totalAffectedChildrenPct: (daughtersAffected + sonsAffected) * 25,
    totalCarrierChildrenPct: daughtersCarrier * 25,
  });

  const chromosomeFacts = Object.freeze({
    xLengthMb: 156,
    xProteinCodingGenes: 850,
    yLengthMb: 57,
    yProteinCodingGenes: 70,
    fatherToSonXTransmissionPct: 0,
    fatherToDaughterXTransmissionPct: 100,
    whyMaleCannotBeCarrier: 'An XY male has only one X chromosome and a shorter Y chromosome lacking homologous X-linked loci; a single recessive allele on his X chromosome is immediately expressed without a second X chromosome to mask it.',
  });

  return Object.freeze({
    modeIndex,
    mode,
    traitStep,
    trait,
    maternalStep,
    paternalStep,
    maternal,
    paternal,
    crossCode: `${maternal.code} × ${paternal.code}`,
    punnettCells: Object.freeze(cells),
    amongDaughters,
    amongSons,
    amongAllChildren,
    chromosomeFacts,
  });
}

export function captureSexLinkedTrial(state) {
  const s = state && state.punnettCells ? state : simulateSexLinkedCross(state || {});
  return Object.freeze({
    crossCode: s.crossCode,
    traitName: s.trait.shortName,
    daughtersAffectedPct: s.amongDaughters.affectedPct,
    daughtersCarrierPct: s.amongDaughters.carrierPct,
    sonsAffectedPct: s.amongSons.affectedPct,
    sonsNormalPct: s.amongSons.normalPct,
    allChildrenAffectedPct: s.amongAllChildren.totalAffectedChildrenPct,
  });
}

export function compareSexLinkedTrials(trialA, trialB) {
  const a = trialA && typeof trialA.sonsAffectedPct === 'number' ? trialA : captureSexLinkedTrial(trialA);
  const b = trialB && typeof trialB.sonsAffectedPct === 'number' ? trialB : captureSexLinkedTrial(trialB);
  return Object.freeze({
    first: a,
    second: b,
    sonsAffectedDeltaPct: b.sonsAffectedPct - a.sonsAffectedPct,
    daughtersCarrierDeltaPct: b.daughtersCarrierPct - a.daughtersCarrierPct,
    daughtersAffectedDeltaPct: b.daughtersAffectedPct - a.daughtersAffectedPct,
    summary: `${a.crossCode} (sons ${a.sonsAffectedPct}% affected, daughters ${a.daughtersCarrierPct}% carrier / ${a.daughtersAffectedPct}% affected) vs ${b.crossCode} (sons ${b.sonsAffectedPct}% affected, daughters ${b.daughtersCarrierPct}% carrier / ${b.daughtersAffectedPct}% affected)`,
  });
}

export {
  MENDEL_CROSS_MODES,
  MENDEL_SEVEN_TRAITS,
  MENDEL_TRAIT_LOCI,
  MENDEL_COMBINED_LEDGER,
  MENDEL_SAMPLE_STEPS,
  ABO_GENOTYPES,
  ABO_CROSS_MODES,
  PEDIGREE_DETECTIVE_RULES,
  SEX_LINKED_MODES,
  SEX_LINKED_TRAITS,
};
