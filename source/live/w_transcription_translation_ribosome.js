// Chapter 11 Widget 3: Nucleus-to-Ribosome Protein Printer & Mutation Outcomes Bench (0610 Topic 17.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  RIBOSOME_PRINTER_MODES,
  simulateTranscriptionTranslation,
  captureRibosomeTrial,
  compareRibosomeTrials,
} from './genetic_code_model.js';

Live.register(
  'transcription_translation_ribosome',
  (stage, params, api) => {
    let modeIndex = 0;
    let activeCodonStep = 6;
    let machineClassIdx = 1;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Nucleus-to-ribosome mRNA transcription, tRNA translation and silent vs missense vs nonsense mutation workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      RIBOSOME_PRINTER_MODES,
      idx => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const stepSlider = api.slider('Ribosome codon step', {
      min: 1,
      max: 7,
      step: 1,
      value: activeCodonStep,
      fmt: v => `Codon ${v}`,
      onInput: v => {
        activeCodonStep = v;
        refresh();
      },
    });

    const machineSlider = api.slider('Protein machine family', {
      min: 1,
      max: 4,
      step: 1,
      value: machineClassIdx,
      fmt: v => `Family #${v}`,
      onInput: v => {
        machineClassIdx = v;
        refresh();
      },
    });

    api.button('Child X Silent (C3)', () => {
      modeIndex = 1;
      activeCodonStep = 3;
      machineClassIdx = 1;
      tabs.setActive(1);
      stepSlider.set(3);
      machineSlider.set(1);
      refresh();
    });

    api.button('Child Y Missense (C6)', () => {
      modeIndex = 2;
      activeCodonStep = 6;
      machineClassIdx = 1;
      tabs.setActive(2);
      stepSlider.set(6);
      machineSlider.set(1);
      refresh();
    });

    api.button('Nonsense Stop (C6)', () => {
      modeIndex = 3;
      activeCodonStep = 6;
      machineClassIdx = 1;
      tabs.setActive(3);
      stepSlider.set(6);
      machineSlider.set(1);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureRibosomeTrial(modeIndex, activeCodonStep, machineClassIdx);
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const p = simulateTranscriptionTranslation(modeIndex, activeCodonStep, machineClassIdx);
      const cmp = compareRibosomeTrials(captures);

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Nucleus (DNA Gene Stays Inside) -> Nuclear Pore -> Cytoplasmic Ribosome
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.stroke();

        draw.text(ctx, p.modeName, 171, 30, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, p.machineTargetName, 171, 46, {
          size: 9.2,
          color: c.muted,
          align: 'center',
        });

        // Zone 1: Nucleus Box (Gene stays in nucleus; mRNA copy made)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.electron;
        ctx.lineWidth = 1.3;
        draw.roundRect(ctx, 24, 56, 294, 86, 7);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '1. NUCLEUS: Gene stays inside; mRNA copy made', 171, 72, {
          size: 9.2,
          weight: 700,
          color: c.electron,
          align: 'center',
        });
        draw.text(ctx, `Coding DNA:  5'-${p.codingCodons.join(' ')}-3'`, 171, 92, {
          size: 8.8,
          weight: 600,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `Template:    3'-${p.codingCodons.map(k => k.replace(/A/g, 't').replace(/T/g, 'a').replace(/C/g, 'g').replace(/G/g, 'c').toUpperCase()).join(' ')}-5'`, 171, 108, {
          size: 8.6,
          color: c.muted,
          align: 'center',
        });
        draw.text(ctx, `mRNA copy:   5'-${p.mrnaCodons.join(' ')}-3'  (U replaces T)`, 171, 128, {
          size: 8.8,
          weight: 700,
          color: c.green,
          align: 'center',
        });

        // Nuclear Pore exit banner
        draw.text(ctx, '↓ Step 3: mRNA exits nucleus via nuclear pore to cytoplasm ↓', 171, 156, {
          size: 8.8,
          weight: 600,
          color: c.muted,
          align: 'center',
        });

        // Zone 2: Cytoplasmic Ribosome & Codon Tape (Codons 1-7)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.green;
        ctx.lineWidth = 1.3;
        draw.roundRect(ctx, 24, 166, 294, 168, 7);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, `2. CYTOPLASM RIBOSOME (At Codon ${p.activeCodonStep}: ${p.currentCodon})`, 171, 182, {
          size: 9.2,
          weight: 700,
          color: c.green,
          align: 'center',
        });

        // 7 codon boxes across width
        p.mrnaCodons.forEach((cod, idx) => {
          const cx = 29 + idx * 40.5;
          const cy = 194;
          const isCur = idx + 1 === p.activeCodonStep;
          const isMut = idx + 1 === p.mutatedCodonIndex;

          ctx.fillStyle = c.plate;
          ctx.strokeStyle = isMut ? c.proton : isCur ? c.electron : c.rule;
          ctx.lineWidth = isCur || isMut ? 1.8 : 1;
          draw.roundRect(ctx, cx, cy, 38, 28, 4);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, `C${idx + 1}`, cx + 19, cy + 10, {
            size: 7.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, cod, cx + 19, cy + 23, {
            size: 8.8,
            weight: 700,
            color: isMut ? c.proton : c.ink,
            align: 'center',
          });
        });

        // Active tRNA anticodon & growing amino-acid chain
        draw.text(
          ctx,
          `tRNA anticodon 3'-${p.currentAnticodon}-5' → delivers ${p.currentAminoAcid} (${p.currentAminoAcidFull})`,
          171,
          242,
          {
            size: 8.8,
            weight: 700,
            color: p.currentAminoAcid === 'STOP' ? c.proton : c.electron,
            align: 'center',
          }
        );

        draw.text(ctx, `Chain at step ${p.activeCodonStep}: ${p.stepPeptideChain}`, 171, 264, {
          size: 9.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        draw.text(ctx, `Full protein (1–7): ${p.fullPeptideChain}`, 171, 286, {
          size: 9.0,
          weight: 700,
          color: p.matchesWildTypeProtein ? c.green : c.proton,
          align: 'center',
        });

        draw.text(ctx, p.functionalStatus, 171, 312, {
          size: 9.0,
          weight: 700,
          color: p.matchesWildTypeProtein ? c.green : c.proton,
          align: 'center',
        });

        // Right Card: Six-Step 0610 Telemetry & Mutation Ledger
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 12, 290, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 12, 290, 228, 10);
        ctx.stroke();

        draw.text(ctx, '0610 Protein Synthesis & Mutation Ledger', 481, 30, {
          size: 10.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['1. Gene location', 'Remains inside nucleus (DNA)'],
          ['2. Messenger copy', 'mRNA made in nucleus → cytoplasm'],
          ['3. Ribosome Codon', `Codon ${p.activeCodonStep}: ${p.currentCodon} (tRNA ${p.currentAnticodon})`],
          ['4. Residue added', `${p.currentAminoAcid} (${p.currentCategory})`],
          ['5. Base change', p.mutatedCodonIndex ? `Codon ${p.mutatedCodonIndex} substituted` : 'None (Wild-type)'],
          ['6. Full peptide', p.fullPeptideChain],
          ['7. Matches WT HbA?', p.matchesWildTypeProtein ? 'YES (100% identical AA chain)' : 'NO (altered or truncated)'],
          ['8. 3D Machine class', p.machineTargetName],
        ];

        rows.forEach(([k, v], i) => {
          const ry = 54 + i * 22;
          draw.text(ctx, k, 346, ry, { size: 9.2, color: c.muted, align: 'left' });
          draw.text(ctx, v, 616, ry, { size: 9.2, weight: 600, color: c.ink, align: 'right' });
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
          draw.text(ctx, '(e.g. Child X Silent vs Child Y Missense).', 481, 308, {
            size: 9.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 290 + idx * 22;
            draw.text(
              ctx,
              `#${idx + 1}: C${cap.activeCodonStep} ${cap.currentCodon} → ${cap.fullPeptideChain} (WT=${cap.matchesWildTypeProtein ? 'YES' : 'NO'})`,
              481,
              cy,
              { size: 8.6, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap, i) =>
            `#${i + 1} ${cap.modeName} (Codon ${cap.activeCodonStep}, Family #${cap.machineClassIdx} → ${cap.fullPeptideChain}, WT=${cap.matchesWildTypeProtein ? 'YES' : 'NO'})`
        )
        .join(' | ');

      say(
        `${p.modeName} (Codon ${p.activeCodonStep}, Family #${p.machineClassIdx}): ${p.baseChangeLabel} · coding DNA 5'-${p.codingCodons.join(' ')}-3' → mRNA 5'-${p.mrnaCodons.join(' ')}-3' · ribosome at Codon ${p.activeCodonStep} (${p.currentCodon}, tRNA ${p.currentAnticodon} → ${p.currentAminoAcidFull}) · full peptide ${p.fullPeptideChain} (WT match=${p.matchesWildTypeProtein ? 'YES' : 'NO'}) · ${p.shapeOutcome}. ${cmp.summary} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate mRNA transcription, ribosome translation & mutation outcomes',
    three: false,
    static: true,
  }
);
