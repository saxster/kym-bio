// Chapter 11 Widget 2: Nirenberg Homopolymers, Khorana Repeating Copolymers & Crick–Brenner Frameshift Bench (0610 Topic 17.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  KHORANA_CIPHER_MODES,
  simulateKhoranaCodonCipher,
  captureCipherTrial,
  compareCipherTrials,
} from './genetic_code_model.js';

Live.register(
  'codon_cipher_khorana',
  (stage, params, api) => {
    let modeIndex = 0;
    let templateSelector = 1;
    let frameShiftBases = 0;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Nirenberg homopolymers, Har Gobind Khorana repeating copolymers and Crick–Brenner triplet reading-frame workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      KHORANA_CIPHER_MODES,
      idx => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const tplSlider = api.slider('Synthetic RNA template', {
      min: 1,
      max: 4,
      step: 1,
      value: templateSelector,
      fmt: v => `Template #${v}`,
      onInput: v => {
        templateSelector = v;
        refresh();
      },
    });

    const shiftSlider = api.slider('Reading-frame shift', {
      min: 0,
      max: 3,
      step: 1,
      value: frameShiftBases,
      fmt: v => `+${v} bases`,
      onInput: v => {
        frameShiftBases = v;
        refresh();
      },
    });

    api.button('Nirenberg poly-U', () => {
      modeIndex = 0;
      templateSelector = 1;
      frameShiftBases = 0;
      tabs.setActive(0);
      tplSlider.set(1);
      shiftSlider.set(0);
      refresh();
    });

    api.button('Khorana (UC)n', () => {
      modeIndex = 1;
      templateSelector = 1;
      frameShiftBases = 0;
      tabs.setActive(1);
      tplSlider.set(1);
      shiftSlider.set(0);
      refresh();
    });

    api.button('Frameshift +1 vs +3', () => {
      modeIndex = 3;
      templateSelector = 1;
      frameShiftBases = frameShiftBases === 1 ? 3 : 1;
      tabs.setActive(3);
      tplSlider.set(1);
      shiftSlider.set(frameShiftBases);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureCipherTrial(modeIndex, templateSelector, frameShiftBases);
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const p = simulateKhoranaCodonCipher(modeIndex, templateSelector, frameShiftBases);
      const cmp = compareCipherTrials(captures);

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Synthetic mRNA Codon Tape & Polypeptide Output
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.stroke();

        draw.text(ctx, p.experimentTitle, 171, 30, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, p.investigator, 171, 46, {
          size: 9.2,
          color: c.muted,
          align: 'center',
        });

        // Combinatorial banner (4^1 = 4, 4^2 = 16, 4^3 = 64)
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 58, 294, 34, 6);
        ctx.fill();
        draw.text(ctx, '4¹ = 4 (<20)   ·   4² = 16 (<20)   ·   4³ = 64 triplets (≥20 AA)', 171, 79, {
          size: 9.2,
          weight: 700,
          color: c.electron,
          align: 'center',
        });

        // Draw the 6 codons along the synthetic mRNA tape
        draw.text(ctx, `5' → 3' mRNA Reading Frame (Shift: +${p.frameShiftBases} bases)`, 171, 110, {
          size: 9.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        p.codons.slice(0, 6).forEach((cod, i) => {
          const cx = 24 + i * 49;
          const cy = 122;
          const isStop = cod === 'UAA' || cod === 'UAG' || cod === 'UGA';
          ctx.fillStyle = c.sheet;
          ctx.strokeStyle = isStop ? c.proton : c.electron;
          ctx.lineWidth = 1.5;
          draw.roundRect(ctx, cx, cy, 45, 34, 5);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, `C${i + 1}`, cx + 22.5, cy + 12, {
            size: 8.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, cod, cx + 22.5, cy + 27, {
            size: 10.0,
            weight: 700,
            color: isStop ? c.proton : c.electron,
            align: 'center',
          });
        });

        // Polypeptide beads synthesised by E. coli ribosomes
        draw.text(ctx, 'Cell-Free Ribosome Polypeptide Output', 171, 180, {
          size: 9.6,
          weight: 700,
          color: c.green,
          align: 'center',
        });

        p.codons.slice(0, 6).forEach((cod, i) => {
          const cx = 46.5 + i * 49;
          const cy = 214;
          const aaObj = p.aminoAcids[i];
          const isStopHere = p.terminatedByStop && p.stoppedAtCodon === i + 1;
          const isAfterStop = p.terminatedByStop && p.stoppedAtCodon < i + 1;

          if (i > 0 && !isAfterStop) {
            ctx.strokeStyle = c.ink;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx - 49 + 18, cy);
            ctx.lineTo(cx - 18, cy);
            ctx.stroke();
          }

          ctx.fillStyle = c.sheet;
          ctx.strokeStyle = isStopHere ? c.proton : isAfterStop ? c.rule : c.green;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(cx, cy, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          const labelTxt = isStopHere ? 'STOP' : isAfterStop ? '—' : aaObj ? aaObj.aa3 : '—';
          draw.text(ctx, labelTxt, cx, cy + 3.5, {
            size: 9.0,
            weight: 700,
            color: isStopHere ? c.proton : isAfterStop ? c.muted : c.green,
            align: 'center',
          });
        });

        // Benchmark rule box at bottom of left card (word-boundary wrap across two lines)
        const words = String(p.benchmarkRule || '').split(/\s+/);
        let line1 = '';
        let line2 = '';
        for (const w of words) {
          if ((line1 + ' ' + w).trim().length <= 50) {
            line1 = (line1 + ' ' + w).trim();
          } else {
            line2 = (line2 + ' ' + w).trim();
          }
        }
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 254, 294, 80, 7);
        ctx.fill();
        draw.text(ctx, 'Experimental Verdict:', 171, 272, {
          size: 9.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, line1, 171, 292, {
          size: 8.8,
          color: c.muted,
          align: 'center',
        });
        draw.text(ctx, line2, 171, 310, {
          size: 8.8,
          color: c.muted,
          align: 'center',
        });

        // Right Card: Cipher Telemetry & Captured Trials
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 12, 290, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 12, 290, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Triplet Cipher & Frame Telemetry', 481, 30, {
          size: 11.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Alphabet capacity', '4¹=4 · 4²=16 · 4³=64 codons'],
          ['Sense vs Stop', '61 sense + 3 STOP (UAA/UAG/UGA)'],
          ['Reading-frame shift', `+${p.frameShiftBases} base insertion (${p.frameRestored ? 'Intact/Restored' : 'Scrambled'})`],
          ['mRNA triplets (1–4)', p.codons.slice(0, 4).join(' · ')],
          ['Synthesised peptide', p.peptideChain.slice(0, 27)],
          ['Residues translated', `${p.residueCount} amino acids`],
          ['Stop codon reached?', p.terminatedByStop ? `YES (at Codon ${p.stoppedAtCodon})` : 'NO (continuous reading)'],
          ['Frame status', p.frameRestored ? 'In-frame triplet reading' : 'Out-of-frame downstream'],
        ];

        rows.forEach(([k, v], i) => {
          const ry = 54 + i * 22;
          draw.text(ctx, k, 346, ry, { size: 9.4, color: c.muted, align: 'left' });
          draw.text(ctx, v, 616, ry, { size: 9.4, weight: 600, color: c.ink, align: 'right' });
        });

        // Bottom-Right Captured Trials Box
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 248, 290, 100, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 248, 290, 100, 10);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${captures.length})`, 481, 266, {
          size: 10.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two contrasting states', 481, 290, {
            size: 9.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Nirenberg poly-U vs Khorana (UC)n).', 481, 308, {
            size: 9.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 290 + idx * 22;
            draw.text(
              ctx,
              `#${idx + 1}: ${cap.codonsJoined} → ${cap.peptideChain.slice(0, 19)} (+${cap.frameShiftBases})`,
              481,
              cy,
              { size: 9.2, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap, i) =>
            `#${i + 1} ${cap.modeName} (Template #${cap.templateSelector}, +${cap.frameShiftBases} → ${cap.peptideChain})`
        )
        .join(' | ');

      say(
        `${p.modeName} (Template #${p.templateSelector}, shift +${p.frameShiftBases} bases): ${p.experimentTitle} · mRNA codons ${p.codons.join(' ')} → polypeptide ${p.peptideChain} (${p.residueCount} residues, stop=${p.terminatedByStop ? 'YES' : 'NO'}, frameRestored=${p.frameRestored ? 'YES' : 'NO'}) · ${p.benchmarkRule} ${cmp.summary} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate Nirenberg homopolymers, Khorana copolymers & triplet frameshifts',
    three: false,
    static: true,
  }
);
