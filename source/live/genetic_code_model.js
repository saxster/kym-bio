// Pure domain model for Chapter 11: The Twisted Ladder & The Protein Printers
// Covers Cambridge Lower Secondary 0893 (9Bs.01, 9Bs.02) and IGCSE 0610 (4.1 DNA structure, 17.1 Chromosomes, genes and proteins).
// Zero DOM, Canvas or WebGL dependencies; directly testable by Node in source/tests/ch11_domain.mjs.

export const DNA_BASE_INFO = Object.freeze({
  A: Object.freeze({
    symbol: 'A',
    name: 'Adenine',
    ringClass: 'Purine',
    rings: 2,
    dnaPartner: 'T',
    rnaPartner: 'U',
    hBonds: 2,
    pairLabel: 'A=T',
  }),
  T: Object.freeze({
    symbol: 'T',
    name: 'Thymine',
    ringClass: 'Pyrimidine',
    rings: 1,
    dnaPartner: 'A',
    rnaPartner: 'A',
    hBonds: 2,
    pairLabel: 'T=A',
  }),
  C: Object.freeze({
    symbol: 'C',
    name: 'Cytosine',
    ringClass: 'Pyrimidine',
    rings: 1,
    dnaPartner: 'G',
    rnaPartner: 'G',
    hBonds: 3,
    pairLabel: 'C≡G',
  }),
  G: Object.freeze({
    symbol: 'G',
    name: 'Guanine',
    ringClass: 'Purine',
    rings: 2,
    dnaPartner: 'C',
    rnaPartner: 'C',
    hBonds: 3,
    pairLabel: 'G≡C',
  }),
  U: Object.freeze({
    symbol: 'U',
    name: 'Uracil',
    ringClass: 'Pyrimidine',
    rings: 1,
    dnaPartner: 'A',
    rnaPartner: 'A',
    hBonds: 2,
    pairLabel: 'U=A',
  }),
});

const AA_META = Object.freeze({
  Phe: { aa1: 'F', fullName: 'Phenylalanine', category: 'hydrophobic', hydropathy: 2.8, charge: 0 },
  Leu: { aa1: 'L', fullName: 'Leucine', category: 'hydrophobic', hydropathy: 3.8, charge: 0 },
  Ile: { aa1: 'I', fullName: 'Isoleucine', category: 'hydrophobic', hydropathy: 4.5, charge: 0 },
  Met: { aa1: 'M', fullName: 'Methionine', category: 'hydrophobic', hydropathy: 1.9, charge: 0 },
  Val: { aa1: 'V', fullName: 'Valine', category: 'hydrophobic', hydropathy: 4.2, charge: 0 },
  Ser: { aa1: 'S', fullName: 'Serine', category: 'polar', hydropathy: -0.8, charge: 0 },
  Pro: { aa1: 'P', fullName: 'Proline', category: 'nonpolar', hydropathy: -1.6, charge: 0 },
  Thr: { aa1: 'T', fullName: 'Threonine', category: 'polar', hydropathy: -0.7, charge: 0 },
  Ala: { aa1: 'A', fullName: 'Alanine', category: 'hydrophobic', hydropathy: 1.8, charge: 0 },
  Tyr: { aa1: 'Y', fullName: 'Tyrosine', category: 'polar', hydropathy: -1.3, charge: 0 },
  His: { aa1: 'H', fullName: 'Histidine', category: 'basic (+)', hydropathy: -3.2, charge: 0.5 },
  Gln: { aa1: 'Q', fullName: 'Glutamine', category: 'polar', hydropathy: -3.5, charge: 0 },
  Asn: { aa1: 'N', fullName: 'Asparagine', category: 'polar', hydropathy: -3.5, charge: 0 },
  Lys: { aa1: 'K', fullName: 'Lysine', category: 'basic (+)', hydropathy: -3.9, charge: 1 },
  Asp: { aa1: 'D', fullName: 'Aspartic acid', category: 'acidic (−)', hydropathy: -3.5, charge: -1 },
  Glu: { aa1: 'E', fullName: 'Glutamic acid', category: 'acidic (−)', hydropathy: -3.5, charge: -1 },
  Cys: { aa1: 'C', fullName: 'Cysteine', category: 'polar', hydropathy: 2.5, charge: 0 },
  Trp: { aa1: 'W', fullName: 'Tryptophan', category: 'hydrophobic', hydropathy: -0.9, charge: 0 },
  Arg: { aa1: 'R', fullName: 'Arginine', category: 'basic (+)', hydropathy: -4.5, charge: 1 },
  Gly: { aa1: 'G', fullName: 'Glycine', category: 'nonpolar', hydropathy: -0.4, charge: 0 },
  STOP: { aa1: '*', fullName: 'Stop (Release factor)', category: 'termination', hydropathy: 0, charge: 0 },
});

const RAW_CODONS = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  UGU: 'Cys', UGC: 'Cys', UGA: 'STOP', UGG: 'Trp',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};

const SYNONYM_COUNTS = {};
for (const aa of Object.values(RAW_CODONS)) {
  SYNONYM_COUNTS[aa] = (SYNONYM_COUNTS[aa] || 0) + 1;
}

function rnaComplementBase(b) {
  if (b === 'A') return 'U';
  if (b === 'U') return 'A';
  if (b === 'C') return 'G';
  if (b === 'G') return 'C';
  return 'N';
}

export function anticodonForMrnaCodon(codon5to3) {
  const clean = String(codon5to3 || '').toUpperCase().replace(/T/g, 'U');
  if (clean.length !== 3) return '---';
  // Antiparallel 3'->5' pairing aligned left-to-right with 5'->3' codon
  return clean
    .split('')
    .map(rnaComplementBase)
    .join('');
}

const builtTable = {};
for (const [codon, aa3] of Object.entries(RAW_CODONS)) {
  const meta = AA_META[aa3];
  builtTable[codon] = Object.freeze({
    codon,
    aa3,
    aa1: meta.aa1,
    fullName: meta.fullName,
    category: meta.category,
    hydropathy: meta.hydropathy,
    charge: meta.charge,
    isStart: codon === 'AUG',
    isStop: aa3 === 'STOP',
    synonymCount: SYNONYM_COUNTS[aa3],
    anticodon3to5: anticodonForMrnaCodon(codon),
  });
}

export const CODON_TABLE = Object.freeze(builtTable);

export function complementDnaBase(base) {
  const b = String(base || '').toUpperCase();
  if (b === 'A') return 'T';
  if (b === 'T') return 'A';
  if (b === 'C') return 'G';
  if (b === 'G') return 'C';
  throw new Error(`Invalid DNA base: ${base}`);
}

export function transcribeDnaBase(templateBase) {
  const b = String(templateBase || '').toUpperCase();
  if (b === 'A') return 'U';
  if (b === 'T') return 'A';
  if (b === 'C') return 'G';
  if (b === 'G') return 'C';
  throw new Error(`Invalid template DNA base: ${templateBase}`);
}

export function codingBaseToMrna(codingBase) {
  const b = String(codingBase || '').toUpperCase();
  if (b === 'T') return 'U';
  if (b === 'A' || b === 'C' || b === 'G' || b === 'U') return b;
  throw new Error(`Invalid coding base: ${codingBase}`);
}

export function complementDnaStrand(strand) {
  const clean = String(strand || '').toUpperCase().replace(/[^ATCG]/g, '');
  return clean
    .split('')
    .map(complementDnaBase)
    .join('');
}

export function transcribeCodingStrandToMrna(codingStrand) {
  const clean = String(codingStrand || '').toUpperCase().replace(/[^ATCGU]/g, '');
  return clean
    .split('')
    .map(codingBaseToMrna)
    .join('');
}

export function transcribeTemplateStrandToMrna(templateStrand) {
  const clean = String(templateStrand || '').toUpperCase().replace(/[^ATCG]/g, '');
  return clean
    .split('')
    .map(transcribeDnaBase)
    .join('');
}

export function translateMrnaSequence(mrna) {
  const clean = String(mrna || '').toUpperCase().replace(/T/g, 'U').replace(/[^AUCG]/g, '');
  const codons = [];
  const aminoAcids = [];
  let stoppedAtCodon = null;
  for (let i = 0; i + 2 < clean.length; i += 3) {
    const cod = clean.slice(i, i + 3);
    const info = CODON_TABLE[cod];
    codons.push(cod);
    if (!info || stoppedAtCodon !== null) continue;
    if (info.isStop) {
      stoppedAtCodon = codons.length;
      continue;
    }
    aminoAcids.push(info);
  }
  return {
    mrna: clean,
    codons,
    aminoAcids,
    peptide3: aminoAcids.map(a => a.aa3).join('–'),
    peptide1: aminoAcids.map(a => a.aa1).join(''),
    residueCount: aminoAcids.length,
    stoppedAtCodon,
    terminatedByStop: stoppedAtCodon !== null,
  };
}

export function computeChargaffLedger(codingStrand, isDoubleStranded = true) {
  const s1 = String(codingStrand || '').toUpperCase().replace(/[^ATCG]/g, '');
  if (!s1.length) {
    return {
      lengthBp: 0,
      pctA: 0,
      pctT: 0,
      pctG: 0,
      pctC: 0,
      ratioAT: 1,
      ratioGC: 1,
      gcContentPct: 0,
      totalHBonds: 0,
    };
  }
  const s2 = isDoubleStranded ? complementDnaStrand(s1) : '';
  const combined = s1 + s2;
  const totalBases = combined.length;
  let cA = 0;
  let cT = 0;
  let cG = 0;
  let cC = 0;
  for (const ch of combined) {
    if (ch === 'A') cA++;
    else if (ch === 'T') cT++;
    else if (ch === 'G') cG++;
    else if (ch === 'C') cC++;
  }
  let hBonds = 0;
  for (const ch of s1) {
    hBonds += ch === 'G' || ch === 'C' ? 3 : 2;
  }
  const pctA = Number(((cA / totalBases) * 100).toFixed(1));
  const pctT = Number(((cT / totalBases) * 100).toFixed(1));
  const pctG = Number(((cG / totalBases) * 100).toFixed(1));
  const pctC = Number(((cC / totalBases) * 100).toFixed(1));
  const gcContentPct = Number((((cG + cC) / totalBases) * 100).toFixed(1));
  return {
    lengthBp: s1.length,
    totalBases,
    countA: cA,
    countT: cT,
    countG: cG,
    countC: cC,
    pctA,
    pctT,
    pctG,
    pctC,
    ratioAT: cT > 0 ? Number((cA / cT).toFixed(2)) : 1,
    ratioGC: cC > 0 ? Number((cG / cC).toFixed(2)) : 1,
    gcContentPct,
    atContentPct: Number((100 - gcContentPct).toFixed(1)),
    totalHBonds: isDoubleStranded ? hBonds : 0,
  };
}

export function solveChargaffFromSingleBasePct(base, pctValue) {
  const b = String(base || 'A').toUpperCase();
  const p = Math.max(1, Math.min(49, Number(pctValue) || 25));
  const rem = Number(((100 - 2 * p) / 2).toFixed(1));
  if (b === 'A' || b === 'T') {
    return {
      A: Number(p.toFixed(1)),
      T: Number(p.toFixed(1)),
      G: rem,
      C: rem,
      gcPct: Number((2 * rem).toFixed(1)),
      atPct: Number((2 * p).toFixed(1)),
      ratioAT: 1.0,
      ratioGC: 1.0,
    };
  }
  if (b === 'G' || b === 'C') {
    return {
      A: rem,
      T: rem,
      G: Number(p.toFixed(1)),
      C: Number(p.toFixed(1)),
      gcPct: Number((2 * p).toFixed(1)),
      atPct: Number((2 * rem).toFixed(1)),
      ratioAT: 1.0,
      ratioGC: 1.0,
    };
  }
  throw new Error(`Invalid DNA base for Chargaff solver: ${base}`);
}

export function combinatorialCodonCapacity(wordLength, alphabetSize = 4) {
  const k = Math.max(1, Math.round(Number(wordLength) || 1));
  const a = Math.max(2, Math.round(Number(alphabetSize) || 4));
  const combinations = Math.pow(a, k);
  return {
    wordLength: k,
    alphabetSize: a,
    combinations,
    canEncode20AminoAcids: combinations >= 20,
    surplusOver20: combinations - 20,
    degeneracyStatus:
      combinations < 20
        ? `Insufficient (${combinations} < 20 amino acids)`
        : combinations === 64
          ? 'Degenerate triplet code (61 sense codons for 20 amino acids + 3 stop codons)'
          : `Sufficient (${combinations} combinations)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WIDGET 1 MODEL: DNA Double-Helix, Chargaff & Photo 51 Bench (fig-11-2)
// ─────────────────────────────────────────────────────────────────────────────
export const DNA_HELIX_MODES = Object.freeze([
  'Beta-globin HBB (Codons 1–7)',
  'Chargaff species ledger',
  'Photo 51 B-DNA geometry',
  'Base-pair mismatch test',
]);

const SPECIES_PRESETS = [
  { name: 'AT-rich Plasmodium (20% GC)', pctA: 40.0, pctT: 40.0, pctG: 10.0, pctC: 10.0, coding: 'ATATAAATATATATGCATAT' },
  { name: 'Human Homo sapiens (40% GC)', pctA: 30.0, pctT: 30.0, pctG: 20.0, pctC: 20.0, coding: 'GTGCACCTGACTCCTGAGGA' },
  { name: 'Maize Zea mays (46% GC)', pctA: 27.0, pctT: 27.0, pctG: 23.0, pctC: 23.0, coding: 'GTGCACCTGACTCCGGAGCG' },
  { name: 'E. coli bacterium (51% GC)', pctA: 24.5, pctT: 24.5, pctG: 25.5, pctC: 25.5, coding: 'GCGCACCTGACTCCGGAGCG' },
  { name: 'Sarcina lutea (72% GC)', pctA: 14.0, pctT: 14.0, pctG: 36.0, pctC: 36.0, coding: 'GCGCGCCGGCGCCGGGCGCG' },
];

export function simulateDnaDoubleHelix(modeIndex = 0, gcOrAdeninePct = 30, pairStepOrMismatch = 6) {
  const m = Math.max(0, Math.min(3, Math.round(Number(modeIndex) || 0)));
  const adeninePct = Math.max(10, Math.min(40, Math.round(Number(gcOrAdeninePct) || 30)));
  const focusPos = Math.max(1, Math.min(12, Math.round(Number(pairStepOrMismatch) || 6)));

  // Base 12-bp segment from HBB codons 1-4 (GTG CAC CTG ACT) or adjusted by %A slider
  let coding12 = 'GTGCACCTGACT';
  let speciesLabel = 'Human beta-globin HBB (Codons 1–4)';
  if (m === 1) {
    if (adeninePct >= 36) {
      coding12 = 'ATATAAATATGC';
      speciesLabel = 'AT-rich genome (~20% GC)';
    } else if (adeninePct >= 28) {
      coding12 = 'GTGCACCTGACT';
      speciesLabel = 'Human thymus DNA (~40% GC)';
    } else if (adeninePct >= 23) {
      coding12 = 'GCGCACCTGACT';
      speciesLabel = 'E. coli bacterial DNA (~50% GC)';
    } else {
      coding12 = 'GCGCGCCGGCGC';
      speciesLabel = 'GC-rich Actinomycete (~72% GC)';
    }
  } else if (m === 0) {
    // Allow adeninePct slider to shift between AT-rich promoter (35-40% A), HBB wild-type (30% A), and GC-rich motif (15% A)
    if (adeninePct >= 35) {
      coding12 = 'TATAAACATGAG';
      speciesLabel = 'HBB TATA promoter box';
    } else if (adeninePct <= 20) {
      coding12 = 'GTGCACCTGGCG';
      speciesLabel = 'GC-stabilised coding segment';
    } else {
      coding12 = 'GTGCACCTGACT';
      speciesLabel = 'Human beta-globin HBB (Codons 1–4)';
    }
  }

  const template12 = complementDnaStrand(coding12);
  const pairs = [];
  let totalHBonds = 0;

  for (let i = 0; i < coding12.length; i++) {
    const b1 = coding12[i];
    let b2 = template12[i];
    let pairWidthNm = 2.0;
    let hBonds = b1 === 'G' || b1 === 'C' ? 3 : 2;
    let geometryState = 'Complementary Watson–Crick rung (2.0 nm)';
    let isValid = true;

    if (m === 3 && i + 1 === focusPos) {
      // Mismatch test at focusPos based on adeninePct slider bucket
      if (adeninePct >= 34) {
        // Purine-Purine mismatch (A-G)
        b2 = b1 === 'A' || b1 === 'G' ? 'G' : 'A';
        if (b1 === 'T' || b1 === 'C') {
          // Force purine-purine at this rung
          b2 = 'G';
        }
        pairWidthNm = 2.45;
        hBonds = 0;
        geometryState = 'Purine–purine bulge (>2.0 nm: distorts sugar–phosphate backbone)';
        isValid = false;
      } else if (adeninePct <= 22) {
        // Pyrimidine-Pyrimidine mismatch (T-C)
        b2 = 'C';
        pairWidthNm = 1.55;
        hBonds = 0;
        geometryState = 'Pyrimidine–pyrimidine pinch (<2.0 nm: bases too far apart for H-bonds)';
        isValid = false;
      } else {
        // Non-complementary purine-pyrimidine (A-C wobble)
        b2 = b1 === 'A' ? 'C' : 'T';
        pairWidthNm = 2.08;
        hBonds = 1;
        geometryState = 'Mismatched donor/acceptor groups (unstable 1 H-bond wobble)';
        isValid = false;
      }
    }

    totalHBonds += hBonds;
    pairs.push({
      index: i + 1,
      leftBase: b1,
      rightBase: b2,
      leftClass: DNA_BASE_INFO[b1].ringClass,
      rightClass: DNA_BASE_INFO[b2].ringClass,
      hBonds,
      pairWidthNm,
      geometryState,
      isValid,
      verticalRiseNm: Number(((i + 1) * 0.34).toFixed(2)),
      twistAngleDeg: (i + 1) * 36,
    });
  }

  const chargaff = solveChargaffFromSingleBasePct('A', adeninePct);
  const focusedRung = pairs[focusPos - 1];
  const meltingTempC = Number((64.9 + 0.41 * chargaff.gcPct - (m === 3 ? 6.5 : 0)).toFixed(1));

  return {
    modeIndex: m,
    modeName: DNA_HELIX_MODES[m],
    speciesLabel,
    adeninePct,
    focusPos,
    codingStrand5to3: coding12,
    templateStrand3to5: pairs.map(p => p.rightBase).join(''),
    pairs,
    focusedRung,
    chargaff,
    totalHBonds,
    meltingTempC,
    helicalPitchNm: 3.4,
    baseStepNm: 0.34,
    basePairsPerTurn: 10,
    helixDiameterNm: focusedRung.pairWidthNm,
    missingLayerLine: 4,
    allRungsComplementary: pairs.every(p => p.isValid),
  };
}

export function captureHelixTrial(modeIndex, adeninePct, focusPos) {
  const s = simulateDnaDoubleHelix(modeIndex, adeninePct, focusPos);
  return Object.freeze({
    modeIndex: s.modeIndex,
    modeName: s.modeName,
    adeninePct: s.adeninePct,
    focusPos: s.focusPos,
    pctA: s.chargaff.A,
    pctT: s.chargaff.T,
    pctG: s.chargaff.G,
    pctC: s.chargaff.C,
    gcPct: s.chargaff.gcPct,
    totalHBonds: s.totalHBonds,
    meltingTempC: s.meltingTempC,
    helixDiameterNm: s.helixDiameterNm,
    allRungsComplementary: s.allRungsComplementary,
  });
}

export function compareHelixTrials(captures = []) {
  if (!Array.isArray(captures) || captures.length < 2) {
    return {
      ready: false,
      summary: 'Capture two contrasting DNA double-helix or Chargaff states to compare base ratios, hydrogen bonds and helix width.',
    };
  }
  const a = captures[0];
  const b = captures[captures.length - 1];
  const differs =
    a.modeIndex !== b.modeIndex ||
    a.adeninePct !== b.adeninePct ||
    a.focusPos !== b.focusPos;
  if (!differs) {
    return {
      ready: false,
      summary: 'Captured trials are identical; change the %Adenine slider, rung position or tab before capturing a second trial.',
    };
  }
  return {
    ready: true,
    summary: `Contrasting DNA double-helix and Chargaff states captured for comparison: #1 (${a.pctA}% A = ${a.pctT}% T, ${a.pctG}% G = ${a.pctC}% C, ${a.totalHBonds} H-bonds, width ${a.helixDiameterNm.toFixed(2)} nm) vs #2 (${b.pctA}% A = ${b.pctT}% T, ${b.pctG}% G = ${b.pctC}% C, ${b.totalHBonds} H-bonds, width ${b.helixDiameterNm.toFixed(2)} nm).`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WIDGET 2 MODEL: Nirenberg & Khorana Triplet Cipher & Frameshift Bench (fig-11-3)
// ─────────────────────────────────────────────────────────────────────────────
export const KHORANA_CIPHER_MODES = Object.freeze([
  'Nirenberg homopolymers (poly-U/C/A)',
  'Khorana dinucleotides ((UC)ₙ / (UG)ₙ)',
  'Khorana trinucleotides & Stop ((UAG)ₙ)',
  'Crick–Brenner frameshift (+1/+2/+3)',
]);

export function simulateKhoranaCodonCipher(modeIndex = 0, templateSelector = 1, frameShiftBases = 0) {
  const m = Math.max(0, Math.min(3, Math.round(Number(modeIndex) || 0)));
  const sel = Math.max(1, Math.min(4, Math.round(Number(templateSelector) || 1)));
  const shift = Math.max(0, Math.min(3, Math.round(Number(frameShiftBases) || 0)));

  let experimentTitle = '';
  let investigator = '';
  let baseMrna18 = '';
  let benchmarkRule = '';

  if (m === 0) {
    investigator = 'Marshall Nirenberg & Heinrich Matthaei (1961)';
    if (sel === 1) {
      experimentTitle = 'Synthetic poly-U homopolymer (UUUUUU...)';
      baseMrna18 = 'UUUUUUUUUUUUUUUUUU';
      benchmarkRule = 'UUU = Phenylalanine (Phe): first codon cracked in cell-free E. coli extract.';
    } else if (sel === 2) {
      experimentTitle = 'Synthetic poly-C homopolymer (CCCCCC...)';
      baseMrna18 = 'CCCCCCCCCCCCCCCCCC';
      benchmarkRule = 'CCC = Proline (Pro): homopolymer of cytosine directs polyproline synthesis.';
    } else if (sel === 3) {
      experimentTitle = 'Synthetic poly-A homopolymer (AAAAAA...)';
      baseMrna18 = 'AAAAAAAAAAAAAAAAAA';
      benchmarkRule = 'AAA = Lysine (Lys): homopolymer of adenine directs polylysine synthesis.';
    } else {
      experimentTitle = 'Synthetic poly-G homopolymer (GGGGGG...)';
      baseMrna18 = 'GGGGGGGGGGGGGGGGGG';
      benchmarkRule = 'GGG = Glycine (Gly): triplets of guanine specify glycine.';
    }
  } else if (m === 1) {
    investigator = 'Har Gobind Khorana (1964–1966)';
    if (sel === 1) {
      experimentTitle = 'Repeating dinucleotide copolymer (UC)ₙ';
      baseMrna18 = 'UCUCUCUCUCUCUCUCUC';
      benchmarkRule = '(UC)ₙ is read as alternating triplets UCU | CUC → alternating Ser–Leu–Ser–Leu.';
    } else if (sel === 2) {
      experimentTitle = 'Repeating dinucleotide copolymer (UG)ₙ';
      baseMrna18 = 'UGUGUGUGUGUGUGUGUG';
      benchmarkRule = '(UG)ₙ is read as alternating triplets UGU | GUG → alternating Cys–Val–Cys–Val.';
    } else if (sel === 3) {
      experimentTitle = 'Repeating dinucleotide copolymer (AG)ₙ';
      baseMrna18 = 'AGAGAGAGAGAGAGAGAG';
      benchmarkRule = '(AG)ₙ is read as alternating triplets AGA | GAG → alternating Arg–Glu–Arg–Glu.';
    } else {
      experimentTitle = 'Repeating dinucleotide copolymer (AC)ₙ';
      baseMrna18 = 'ACACACACACACACACAC';
      benchmarkRule = '(AC)ₙ is read as alternating triplets ACA | CAC → alternating Thr–His–Thr–His.';
    }
  } else if (m === 2) {
    investigator = 'Har Gobind Khorana & Obaid Siddiqi / Brenner (1965–1968)';
    if (sel === 1) {
      experimentTitle = 'Repeating trinucleotide (UUC)ₙ in 3 frames';
      baseMrna18 = 'UUCUUCUUCUUCUUCUUC';
      benchmarkRule = 'Depending on starting nucleotide, (UUC)ₙ reads as UUC (Phe), UCU (Ser), or CUU (Leu).';
    } else if (sel === 2) {
      experimentTitle = 'Sense message interrupted by UAG Amber Stop';
      baseMrna18 = 'AUGGUGCACCUGUAGGAG';
      benchmarkRule = 'UAG is an amber nonsense (stop) codon: translation halts at codon 5, releasing a 4-residue fragment.';
    } else if (sel === 3) {
      experimentTitle = 'Sense message interrupted by UAA Ochre Stop';
      baseMrna18 = 'AUGGUGCACUAAACUCCU';
      benchmarkRule = 'UAA is an ochre stop codon: ribosome releases a truncated 3-residue peptide (Met–Val–His).';
    } else {
      experimentTitle = 'Sense message interrupted by UGA Opal Stop';
      baseMrna18 = 'AUGGUGUGAACUCCUGAG';
      benchmarkRule = 'UGA is an opal stop codon: ribosome halts after just 2 amino acids (Met–Val).';
    }
  } else {
    investigator = 'Francis Crick, Sydney Brenner et al. (1961)';
    experimentTitle = 'Phage T4 rII reading-frame insertion test';
    // Base message: CAU CAU CAU CAU CAU CAU (His-His-His-His-His-His) or HBB segment
    baseMrna18 = sel <= 2 ? 'CAUCAUCAUCAUCAUCAU' : 'GUGCACCUGACUCCUGAG';
    benchmarkRule =
      shift === 0
        ? '0 insertions: non-overlapping triplet reading frame is intact from start to finish.'
        : shift === 1 || shift === 2
          ? `+${shift} base insertion shifts the triplet reading frame downstream, scrambling every subsequent codon.`
          : '+3 base insertions (+1 full triplet) restores the original reading frame downstream of the insertion.';
  }

  // Apply reading-frame insertion shift at codon 2 boundary (after index 3) when in frameshift mode, or starting offset in other modes
  let workingMrna = baseMrna18;
  if (m === 3) {
    const ins = 'G'.repeat(shift);
    workingMrna = (baseMrna18.slice(0, 3) + ins + baseMrna18.slice(3)).slice(0, 18);
  } else if (shift > 0) {
    workingMrna = (baseMrna18.slice(shift) + baseMrna18.slice(0, shift)).slice(0, 18);
  }

  const trans = translateMrnaSequence(workingMrna);
  const frameRestored = shift === 0 || shift === 3;

  return {
    modeIndex: m,
    modeName: KHORANA_CIPHER_MODES[m],
    templateSelector: sel,
    frameShiftBases: shift,
    investigator,
    experimentTitle,
    benchmarkRule,
    mrnaSequence: workingMrna,
    codons: trans.codons,
    aminoAcids: trans.aminoAcids,
    peptideChain: trans.peptide3 || 'STOP (0 residues)',
    residueCount: trans.residueCount,
    terminatedByStop: trans.terminatedByStop,
    stoppedAtCodon: trans.stoppedAtCodon,
    frameRestored,
    combinatorics: {
      singlet4to1: 4,
      doublet4to2: 16,
      triplet4to3: 64,
    },
  };
}

export function captureCipherTrial(modeIndex, templateSelector, frameShiftBases) {
  const s = simulateKhoranaCodonCipher(modeIndex, templateSelector, frameShiftBases);
  return Object.freeze({
    modeIndex: s.modeIndex,
    modeName: s.modeName,
    templateSelector: s.templateSelector,
    frameShiftBases: s.frameShiftBases,
    experimentTitle: s.experimentTitle,
    codonsJoined: s.codons.slice(0, 4).join('·'),
    peptideChain: s.peptideChain,
    residueCount: s.residueCount,
    terminatedByStop: s.terminatedByStop,
    frameRestored: s.frameRestored,
  });
}

export function compareCipherTrials(captures = []) {
  if (!Array.isArray(captures) || captures.length < 2) {
    return {
      ready: false,
      summary: 'Capture two contrasting Khorana copolymer or Crick–Brenner frameshift trials to compare triplet decoding.',
    };
  }
  const a = captures[0];
  const b = captures[captures.length - 1];
  const differs =
    a.modeIndex !== b.modeIndex ||
    a.templateSelector !== b.templateSelector ||
    a.frameShiftBases !== b.frameShiftBases;
  if (!differs) {
    return {
      ready: false,
      summary: 'Captured cipher trials are identical; change the RNA template, tab or reading-frame shift before capturing a second trial.',
    };
  }
  return {
    ready: true,
    summary: `Contrasting triplet cipher states captured for comparison: #1 (${a.codonsJoined} → ${a.peptideChain}, shift +${a.frameShiftBases}) vs #2 (${b.codonsJoined} → ${b.peptideChain}, shift +${b.frameShiftBases}).`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WIDGET 3 MODEL: Nucleus-to-Ribosome Protein Printer & Mutation Bench (fig-11-4)
// ─────────────────────────────────────────────────────────────────────────────
export const RIBOSOME_PRINTER_MODES = Object.freeze([
  'Reference HbA (Codons 1–7)',
  'Child X Silent (Codon 3 CTG→CTT)',
  'Child Y Missense (Codon 6 GAG→GTG)',
  'Nonsense Stop (Codon 6 GAG→TAG)',
]);

const PROTEIN_MACHINE_TARGETS = Object.freeze([
  {
    id: 'hbb',
    name: 'Beta-globin oxygen carrier (HBB, Ch 8)',
    machineClass: 'Oxygen-carrying globin subunit',
    wtCoding21: 'GTGCACCTGACTCCTGAGGAG',
    ramachandranFold: 'Globular 8-helix haem pocket (soluble HbA tetramer)',
  },
  {
    id: 'enzyme',
    name: 'Amylase / Catalase active site (Ch 4)',
    machineClass: 'Enzyme catalyst (0610 17.1 Supp 4)',
    wtCoding21: 'GTGCACCTGACTCCTGAGGAG',
    ramachandranFold: 'Complementary 3D substrate active-site cleft',
  },
  {
    id: 'carrier',
    name: 'Na⁺–glucose membrane carrier (Ch 10)',
    machineClass: 'Membrane carrier protein (0610 17.1 Supp 4)',
    wtCoding21: 'GTGCACCTGACTCCTGAGGAG',
    ramachandranFold: '14-helix transmembrane cotransport channel',
  },
  {
    id: 'receptor',
    name: 'Synaptic neurotransmitter receptor (Ch 9)',
    machineClass: 'Receptor for neurotransmitter (0610 17.1 Supp 4)',
    wtCoding21: 'GTGCACCTGACTCCTGAGGAG',
    ramachandranFold: 'Postsynaptic acetylcholine-binding ion gate',
  },
]);

export function simulateTranscriptionTranslation(modeIndex = 0, activeCodonStep = 6, machineClassIdx = 1) {
  const m = Math.max(0, Math.min(3, Math.round(Number(modeIndex) || 0)));
  const step = Math.max(1, Math.min(7, Math.round(Number(activeCodonStep) || 6)));
  const targetIdx = Math.max(1, Math.min(4, Math.round(Number(machineClassIdx) || 1)));
  const target = PROTEIN_MACHINE_TARGETS[targetIdx - 1];

  // Codons 1–7 of human HBB: GTG CAC CTG ACT CCT GAG GAG
  let codingCodons = ['GTG', 'CAC', 'CTG', 'ACT', 'CCT', 'GAG', 'GAG'];
  let mutationType = 'Wild-type reference (no base substitution)';
  let mutatedCodonIndex = null;
  let baseChangeLabel = 'None (Reference sequence)';
  let shapeOutcome = `Normal 3D fold: ${target.ramachandranFold}`;
  let functionalStatus = '100% functional 3D protein machine';
  let matchesWildTypeProtein = true;

  if (m === 1) {
    // Child X Silent (Synonymous) substitution at Codon 3: CTG -> CTT (CUG -> CUU, both Leu)
    codingCodons[2] = 'CTT';
    mutationType = 'Silent (synonymous) single-base substitution';
    mutatedCodonIndex = 3;
    baseChangeLabel = 'Codon 3: DNA CTG → CTT (mRNA CUG → CUU, both code for Leucine Leu³)';
    shapeOutcome = `Unchanged 3D fold: degenerate genetic code inserts the exact same Leucine (Leu³) and hydrophilic Glu⁶ (${target.ramachandranFold})`;
    functionalStatus = '100% functional 3D protein machine (identical amino-acid chain)';
    matchesWildTypeProtein = true;
  } else if (m === 2) {
    // Child Y Missense substitution at Codon 6: GAG -> GTG (GAG -> GUG, Glu6 -> Val6)
    codingCodons[5] = 'GTG';
    mutationType = 'Missense single-base substitution (Ingram 1956–1957)';
    mutatedCodonIndex = 6;
    baseChangeLabel = 'Codon 6: DNA GAG → GTG (mRNA GAG → GUG, hydrophilic Glu⁶ → hydrophobic Val⁶)';
    shapeOutcome =
      targetIdx === 1
        ? 'Altered 3D surface: hydrophobic Val⁶ creates a sticky patch on deoxygenated HbS that polymerises into rigid sickle fibres'
        : `Altered 3D fold: replacing negatively charged Glu⁶ with hydrophobic Val⁶ distorts the ${target.machineClass.toLowerCase()} pocket`;
    functionalStatus = 'Impaired 3D surface / binding pocket (missense substitution)';
    matchesWildTypeProtein = false;
  } else if (m === 3) {
    // Nonsense (Stop) substitution at Codon 6: GAG -> TAG (GAG -> UAG Amber Stop)
    codingCodons[5] = 'TAG';
    mutationType = 'Nonsense (amber stop) single-base substitution';
    mutatedCodonIndex = 6;
    baseChangeLabel = 'Codon 6: DNA GAG → TAG (mRNA GAG → UAG STOP codon)';
    shapeOutcome = 'Premature chain termination at Codon 6: ribosome releases an incomplete 5-amino-acid fragment that cannot fold';
    functionalStatus = 'Non-functional truncated fragment (0% working protein)';
    matchesWildTypeProtein = false;
  }

  const codingDna = codingCodons.join('');
  const templateDna = complementDnaStrand(codingDna);
  const mrna = transcribeCodingStrandToMrna(codingDna);
  const mrnaCodons = codingCodons.map(c => transcribeCodingStrandToMrna(c));

  const fullTranslation = translateMrnaSequence(mrna);
  // Stepwise ribosome translation up to activeCodonStep
  const activeSliceMrna = mrnaCodons.slice(0, step).join('');
  const stepTranslation = translateMrnaSequence(activeSliceMrna);

  const currentCodon = mrnaCodons[step - 1];
  const currentCodonInfo = CODON_TABLE[currentCodon];

  // Cambridge 0610 17.1 Supplement 6-step status
  const sixSteps0610 = [
    '1. Gene remains in the nucleus on chromosome DNA.',
    '2. mRNA is synthesised in the nucleus as a single-stranded copy of the gene (U replaces T).',
    '3. mRNA moves out of the nucleus through a nuclear pore into the cytoplasm.',
    `4. mRNA passes through the ribosome (currently reading Codon ${step}: ${currentCodon}).`,
    `5. Ribosome links amino acids via peptide bonds (${stepTranslation.peptide3 || 'halted'}).`,
    `6. mRNA base sequence determines the exact amino-acid sequence (${fullTranslation.peptide3}).`,
  ];

  return {
    modeIndex: m,
    modeName: RIBOSOME_PRINTER_MODES[m],
    activeCodonStep: step,
    machineClassIdx: targetIdx,
    machineTargetName: target.name,
    machineClass: target.machineClass,
    mutationType,
    mutatedCodonIndex,
    baseChangeLabel,
    codingDna,
    templateDna,
    mrna,
    codingCodons,
    mrnaCodons,
    currentCodon,
    currentAnticodon: currentCodonInfo.anticodon3to5,
    currentAminoAcid: currentCodonInfo.aa3,
    currentAminoAcidFull: currentCodonInfo.fullName,
    currentCategory: currentCodonInfo.category,
    stepPeptideChain: stepTranslation.peptide3,
    fullPeptideChain: fullTranslation.peptide3,
    fullResidueCount: fullTranslation.residueCount,
    terminatedEarly: fullTranslation.terminatedByStop,
    matchesWildTypeProtein,
    shapeOutcome,
    functionalStatus,
    sixSteps0610,
  };
}

export function captureRibosomeTrial(modeIndex, activeCodonStep, machineClassIdx) {
  const s = simulateTranscriptionTranslation(modeIndex, activeCodonStep, machineClassIdx);
  return Object.freeze({
    modeIndex: s.modeIndex,
    modeName: s.modeName,
    activeCodonStep: s.activeCodonStep,
    machineClassIdx: s.machineClassIdx,
    currentCodon: s.currentCodon,
    currentAminoAcid: s.currentAminoAcid,
    fullPeptideChain: s.fullPeptideChain,
    matchesWildTypeProtein: s.matchesWildTypeProtein,
    functionalStatus: s.functionalStatus,
  });
}

export function compareRibosomeTrials(captures = []) {
  if (!Array.isArray(captures) || captures.length < 2) {
    return {
      ready: false,
      summary: 'Capture two contrasting mutation or ribosome states (e.g. Child X Silent vs Child Y Missense) to compare mRNA codons, amino-acid sequence and 3D protein outcome.',
    };
  }
  const a = captures[0];
  const b = captures[captures.length - 1];
  const differs =
    a.modeIndex !== b.modeIndex ||
    a.activeCodonStep !== b.activeCodonStep ||
    a.machineClassIdx !== b.machineClassIdx;
  if (!differs) {
    return {
      ready: false,
      summary: 'Captured ribosome trials are identical; switch between Reference, Child X Silent, Child Y Missense or Nonsense before capturing a second trial.',
    };
  }
  return {
    ready: true,
    summary: `Contrasting transcription and translation states captured for comparison: #1 ${a.modeName} (Codon ${a.activeCodonStep} ${a.currentCodon} → ${a.fullPeptideChain}, WT match=${a.matchesWildTypeProtein ? 'YES' : 'NO'}) vs #2 ${b.modeName} (Codon ${b.activeCodonStep} ${b.currentCodon} → ${b.fullPeptideChain}, WT match=${b.matchesWildTypeProtein ? 'YES' : 'NO'}).`,
  };
}
