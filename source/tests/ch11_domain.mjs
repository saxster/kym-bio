// Headless Node domain verification suite for Chapter 11 (The Twisted Ladder & The Protein Printers).
import assert from 'node:assert/strict';
import {
  DNA_BASE_INFO,
  CODON_TABLE,
  DNA_HELIX_MODES,
  KHORANA_CIPHER_MODES,
  RIBOSOME_PRINTER_MODES,
  anticodonForMrnaCodon,
  complementDnaBase,
  transcribeDnaBase,
  codingBaseToMrna,
  complementDnaStrand,
  transcribeCodingStrandToMrna,
  transcribeTemplateStrandToMrna,
  translateMrnaSequence,
  computeChargaffLedger,
  solveChargaffFromSingleBasePct,
  combinatorialCodonCapacity,
  simulateDnaDoubleHelix,
  captureHelixTrial,
  compareHelixTrials,
  simulateKhoranaCodonCipher,
  captureCipherTrial,
  compareCipherTrials,
  simulateTranscriptionTranslation,
  captureRibosomeTrial,
  compareRibosomeTrials,
} from '../live/genetic_code_model.js';
import { ENHANCEMENTS } from '../live/enhancements.js';

let count = 0;
function check(cond, msg) {
  assert.ok(cond, msg);
  count += 1;
}

// 1. Frozen tables & fundamental constants
check(Object.isFrozen(DNA_BASE_INFO), 'DNA_BASE_INFO is frozen');
check(Object.isFrozen(CODON_TABLE), 'CODON_TABLE is frozen');
check(Object.keys(CODON_TABLE).length === 64, 'CODON_TABLE has exactly 64 triplet codons');
check(Object.isFrozen(DNA_HELIX_MODES) && DNA_HELIX_MODES.length === 4, 'DNA_HELIX_MODES has 4 modes');
check(Object.isFrozen(KHORANA_CIPHER_MODES) && KHORANA_CIPHER_MODES.length === 4, 'KHORANA_CIPHER_MODES has 4 modes');
check(Object.isFrozen(RIBOSOME_PRINTER_MODES) && RIBOSOME_PRINTER_MODES.length === 4, 'RIBOSOME_PRINTER_MODES has 4 modes');

// Verify all 64 codons in CODON_TABLE
let senseCount = 0;
let stopCount = 0;
for (const [codon, entry] of Object.entries(CODON_TABLE)) {
  check(Object.isFrozen(entry), `Codon ${codon} entry frozen`);
  check(codon.length === 3 && /^[AUCG]{3}$/.test(codon), `Valid RNA triplet ${codon}`);
  check(entry.anticodon3to5.length === 3, `Anticodon length 3 for ${codon}`);
  if (entry.isStop) {
    stopCount += 1;
    check(['UAA', 'UAG', 'UGA'].includes(codon), `Stop codon ${codon} is UAA, UAG or UGA`);
  } else {
    senseCount += 1;
    check(entry.aa3.length === 3 && entry.aa1.length === 1, `Sense codon ${codon} has aa3 and aa1`);
  }
}
check(senseCount === 61 && stopCount === 3, '61 sense codons and 3 stop codons');

// Verify Leucine degeneracy (6 codons) and key benchmark codons
for (const leuCodon of ['UUA', 'UUG', 'CUU', 'CUC', 'CUA', 'CUG']) {
  check(CODON_TABLE[leuCodon].aa3 === 'Leu' && CODON_TABLE[leuCodon].synonymCount === 6, `${leuCodon} is Leucine with 6 synonyms`);
}
check(CODON_TABLE.UUU.aa3 === 'Phe', 'Nirenberg UUU = Phe');
check(CODON_TABLE.CCC.aa3 === 'Pro', 'CCC = Pro');
check(CODON_TABLE.AAA.aa3 === 'Lys', 'AAA = Lys');
check(CODON_TABLE.GGG.aa3 === 'Gly', 'GGG = Gly');
check(CODON_TABLE.GAG.aa3 === 'Glu' && CODON_TABLE.GAG.charge < 0, 'GAG = negatively charged hydrophilic Glu');
check(CODON_TABLE.GUG.aa3 === 'Val' && CODON_TABLE.GUG.hydropathy > 0, 'GUG = hydrophobic Val');

// 2. Combinatorial capacity checks (4^1 = 4, 4^2 = 16, 4^3 = 64)
const c1 = combinatorialCodonCapacity(1, 4);
const c2 = combinatorialCodonCapacity(2, 4);
const c3 = combinatorialCodonCapacity(3, 4);
check(c1.combinations === 4 && !c1.canEncode20AminoAcids, 'Singlet 4^1 = 4 < 20');
check(c2.combinations === 16 && !c2.canEncode20AminoAcids, 'Doublet 4^2 = 16 < 20');
check(c3.combinations === 64 && c3.canEncode20AminoAcids && c3.surplusOver20 === 44, 'Triplet 4^3 = 64 >= 20');

// 3. Base pairing, transcription & Chargaff solver checks
check(complementDnaBase('A') === 'T' && complementDnaBase('T') === 'A', 'A <-> T');
check(complementDnaBase('C') === 'G' && complementDnaBase('G') === 'C', 'C <-> G');
check(transcribeDnaBase('A') === 'U' && transcribeDnaBase('T') === 'A', 'Template A->U, T->A');
check(transcribeDnaBase('C') === 'G' && transcribeDnaBase('G') === 'C', 'Template C->G, G->C');

const hbbCoding = 'GTGCACCTGACTCCTGAGGAG';
const hbbTemplate = complementDnaStrand(hbbCoding);
const hbbMrnaFromCoding = transcribeCodingStrandToMrna(hbbCoding);
const hbbMrnaFromTemplate = transcribeTemplateStrandToMrna(hbbTemplate);
check(hbbTemplate === 'CACGTGGACTGAGGACTCCTC', 'Exact HBB template strand');
check(hbbMrnaFromCoding === 'GUGCACCUGACUCCUGAGGAG', 'Exact HBB mRNA from coding strand');
check(hbbMrnaFromTemplate === hbbMrnaFromCoding, 'Template transcription equals coding T->U transcription');

const chLedger = computeChargaffLedger(hbbCoding, true);
check(chLedger.pctA === chLedger.pctT && chLedger.pctG === chLedger.pctC, 'Double-stranded Chargaff %A=%T and %G=%C');
check(chLedger.ratioAT === 1 && chLedger.ratioGC === 1, 'Double-stranded A/T = 1 and G/C = 1');

for (let p = 5; p <= 45; p += 1) {
  for (const b of ['A', 'T', 'G', 'C']) {
    const solved = solveChargaffFromSingleBasePct(b, p);
    check(solved.A === solved.T && solved.G === solved.C, `Chargaff equivalence for ${b}=${p}%`);
    check(Math.abs(solved.A + solved.T + solved.G + solved.C - 100) < 1e-6, `Chargaff sum = 100% for ${b}=${p}%`);
  }
}

// 4. Exhaustive sweep of Widget 1: simulateDnaDoubleHelix (4 modes × 7 %A × 12 rungs = 336 states)
for (let m = 0; m < 4; m += 1) {
  for (const aPct of [10, 15, 20, 25, 30, 35, 40]) {
    for (let pos = 1; pos <= 12; pos += 1) {
      const s = simulateDnaDoubleHelix(m, aPct, pos);
      check(s.helicalPitchNm === 3.4 && s.baseStepNm === 0.34 && s.basePairsPerTurn === 10, 'Photo 51 geometry constants');
      check(s.chargaff.A === s.chargaff.T && s.chargaff.G === s.chargaff.C, 'Chargaff equality in helix simulation');
      check(s.pairs.length === 12, '12 base-pair rungs simulated');
      if (m !== 3) {
        check(s.allRungsComplementary && s.helixDiameterNm === 2.0, 'Complementary modes keep uniform 2.0 nm diameter');
      } else {
        check(!s.allRungsComplementary && s.helixDiameterNm !== 2.0, 'Mismatch mode distorts rung width away from 2.0 nm');
      }
    }
  }
}

const hCap1 = captureHelixTrial(1, 30, 6);
const hCap2 = captureHelixTrial(1, 15, 6);
check(Object.isFrozen(hCap1) && Object.isFrozen(hCap2), 'Captured helix trials are frozen');
check(!compareHelixTrials([hCap1]).ready, 'Single helix trial not ready');
check(!compareHelixTrials([hCap1, hCap1]).ready, 'Identical helix trials rejected');
const hCmp = compareHelixTrials([hCap1, hCap2]);
check(hCmp.ready && hCmp.summary.includes('Contrasting DNA double-helix and Chargaff states captured for comparison:'), 'Contrasting helix trials accepted');

// 5. Exhaustive sweep of Widget 2: simulateKhoranaCodonCipher (4 modes × 4 templates × 4 shifts = 64 states)
for (let m = 0; m < 4; m += 1) {
  for (let tpl = 1; tpl <= 4; tpl += 1) {
    for (let sh = 0; sh <= 3; sh += 1) {
      const c = simulateKhoranaCodonCipher(m, tpl, sh);
      check(c.combinatorics.singlet4to1 === 4 && c.combinatorics.doublet4to2 === 16 && c.combinatorics.triplet4to3 === 64, 'Combinatorial constants');
      check(c.codons.length === 6, '6 triplets decoded from 18-nt template');
      check(c.frameRestored === (sh === 0 || sh === 3), 'Frame restored only at 0 or +3 shift');
    }
  }
}

// Specific Nirenberg & Khorana benchmark checks
const polyU = simulateKhoranaCodonCipher(0, 1, 0);
check(polyU.peptideChain === 'Phe–Phe–Phe–Phe–Phe–Phe', 'Nirenberg poly-U -> poly-Phe');
const khoranaUC = simulateKhoranaCodonCipher(1, 1, 0);
check(khoranaUC.peptideChain === 'Ser–Leu–Ser–Leu–Ser–Leu', 'Khorana (UC)n -> alternating Ser-Leu');
const khoranaUG = simulateKhoranaCodonCipher(1, 2, 0);
check(khoranaUG.peptideChain === 'Cys–Val–Cys–Val–Cys–Val', 'Khorana (UG)n -> alternating Cys-Val');
const khoranaAG = simulateKhoranaCodonCipher(1, 3, 0);
check(khoranaAG.peptideChain === 'Arg–Glu–Arg–Glu–Arg–Glu', 'Khorana (AG)n -> alternating Arg-Glu');
const khoranaStop = simulateKhoranaCodonCipher(2, 2, 0);
check(khoranaStop.terminatedByStop && khoranaStop.stoppedAtCodon === 5 && khoranaStop.residueCount === 4, 'Amber UAG stop at codon 5 halts translation after 4 residues');

const cCap1 = captureCipherTrial(0, 1, 0);
const cCap2 = captureCipherTrial(1, 1, 0);
check(Object.isFrozen(cCap1) && Object.isFrozen(cCap2), 'Captured cipher trials are frozen');
check(!compareCipherTrials([cCap1, cCap1]).ready, 'Identical cipher trials rejected');
const cCmp = compareCipherTrials([cCap1, cCap2]);
check(cCmp.ready && cCmp.summary.includes('Contrasting triplet cipher states captured for comparison:'), 'Contrasting cipher trials accepted');

// 6. Exhaustive sweep of Widget 3: simulateTranscriptionTranslation (4 modes × 7 codon steps × 4 protein families = 112 states)
for (let m = 0; m < 4; m += 1) {
  for (let step = 1; step <= 7; step += 1) {
    for (let fam = 1; fam <= 4; fam += 1) {
      const r = simulateTranscriptionTranslation(m, step, fam);
      check(r.sixSteps0610.length === 6, 'All 6 Cambridge 0610 17.1 steps generated');
      check(r.codingCodons.length === 7 && r.mrnaCodons.length === 7, '7 HBB codons in nucleus and mRNA');
      check(!r.mrna.includes('T'), 'mRNA contains Uracil (U) and zero Thymine (T)');
      if (m === 0) {
        check(r.fullPeptideChain === 'Val–His–Leu–Thr–Pro–Glu–Glu' && r.matchesWildTypeProtein, 'Reference HbA peptide chain');
      } else if (m === 1) {
        // Child X Silent (Codon 3 CTG -> CTT, mRNA CUG -> CUU, still Leu)
        check(r.codingCodons[2] === 'CTT' && r.mrnaCodons[2] === 'CUU', 'Child X Codon 3 is CTT / mRNA CUU');
        check(r.fullPeptideChain === 'Val–His–Leu–Thr–Pro–Glu–Glu' && r.matchesWildTypeProtein, 'Child X silent mutation preserves 100% WT amino-acid chain');
      } else if (m === 2) {
        // Child Y Missense (Codon 6 GAG -> GTG, mRNA GAG -> GUG, Glu -> Val)
        check(r.codingCodons[5] === 'GTG' && r.mrnaCodons[5] === 'GUG', 'Child Y Codon 6 is GTG / mRNA GUG');
        check(r.fullPeptideChain === 'Val–His–Leu–Thr–Pro–Val–Glu' && !r.matchesWildTypeProtein, 'Child Y missense mutation replaces Glu6 with Val6');
      } else {
        // Nonsense Stop at Codon 6 (GAG -> TAG, mRNA UAG Stop)
        check(r.codingCodons[5] === 'TAG' && r.mrnaCodons[5] === 'UAG', 'Nonsense Codon 6 is TAG / mRNA UAG');
        check(r.terminatedEarly && r.fullResidueCount === 5 && !r.matchesWildTypeProtein, 'Nonsense mutation truncates chain to 5 residues');
      }
    }
  }
}

const rCapX = captureRibosomeTrial(1, 3, 1);
const rCapY = captureRibosomeTrial(2, 6, 1);
check(Object.isFrozen(rCapX) && Object.isFrozen(rCapY), 'Captured ribosome trials are frozen');
check(!compareRibosomeTrials([rCapX, rCapX]).ready, 'Identical ribosome trials rejected');
const rCmp = compareRibosomeTrials([rCapX, rCapY]);
check(rCmp.ready && rCmp.summary.includes('Contrasting transcription and translation states captured for comparison:'), 'Contrasting ribosome trials accepted');

// 7. Verify ENHANCEMENTS entries for all three Chapter 11 widgets
for (const key of ['dna_base_pairing', 'codon_cipher_khorana', 'transcription_translation_ribosome']) {
  const e = ENHANCEMENTS[key];
  check(Boolean(e), `ENHANCEMENTS.${key} exists`);
  check(typeof e.challenge?.prompt === 'string' && typeof e.challenge?.check === 'function', `${key} has challenge`);
  check(typeof e.yourNumbers === 'function', `${key} has yourNumbers`);
  check(typeof e.cutaway === 'string' && e.cutaway.length > 40, `${key} has cutaway text`);
  check(Array.isArray(e.watch) && e.watch.length === 5, `${key} has 5-step guided tour`);
}

console.log(`ch11_domain.mjs: ${count} assertions passed.`);
