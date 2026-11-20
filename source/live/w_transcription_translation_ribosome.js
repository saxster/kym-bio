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
    let captures = [];
    let populationView = false;
    let activeTool = 'ribosome'; // 'rnapol' | 'ribosome' | 'trna'
    const collectedFamilies = new Set();

    const view = makeCanvas(
      api,
      640,
      360,
      'Nucleus-to-ribosome mRNA transcription, tRNA translation, biomolecule toolbox, protein collection tray, 24-cell population view, and mutation workbench'
    );

    const say = api.readout();
    const trials = api.trials({
      columns: ['#', 'Mode', 'Codon', 'Family', 'Peptide', 'WT?'],
      maxRows: 6,
      plotLabel: 'Wild-type match %',
      plotValue: (row) => (row[5] === 'YES' ? 100 : 0),
    });

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

    const popBtn = api.button('24-Cell Population', (btn) => {
      populationView = !populationView;
      btn.setAttribute('aria-pressed', String(populationView));
      refresh();
    }, { pressed: false });

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
      if (snap) {
        captures.push(snap);
        trials.record([
          captures.length,
          snap.modeName.split(' ')[0],
          `C${snap.activeCodonStep}`,
          `#${snap.machineClassIdx}`,
          snap.fullPeptideChain,
          snap.matchesWildTypeProtein ? 'YES' : 'NO',
        ]);
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      trials.clear();
      refresh();
    });

    const TOOL_CHIPS = [
      { id: 'rnapol', label: 'RNA Pol', x: 26, w: 84 },
      { id: 'ribosome', label: 'Ribosome', x: 118, w: 94 },
      { id: 'trna', label: 'tRNA +1', x: 220, w: 92 },
    ];

    view.cv.style.cursor = 'pointer';
    view.cv.addEventListener('pointerdown', (e) => {
      const { x: lx, y: ly } = api.pointerXY(view, e);
      if (!populationView && ly >= 312 && ly <= 344) {
        const hit = TOOL_CHIPS.find((t) => lx >= t.x && lx <= t.x + t.w);
        if (hit) {
          activeTool = hit.id;
          if (hit.id === 'trna') {
            activeCodonStep = activeCodonStep >= 7 ? 1 : activeCodonStep + 1;
            stepSlider.set(activeCodonStep);
          } else if (hit.id === 'ribosome') {
            activeCodonStep = 7;
            stepSlider.set(7);
          }
          if (window.__bookSound) window.__bookSound.play('tick');
          refresh();
          return;
        }
      }
      // Protein collection tray click selects that protein family
      if (ly >= 202 && ly <= 238 && lx >= 342 && lx <= 620) {
        const famIdx = Math.min(4, Math.max(1, Math.floor(((lx - 344) / 272) * 4) + 1));
        machineClassIdx = famIdx;
        machineSlider.set(famIdx);
        refresh();
      }
    });

    api.reset(() => {
      modeIndex = 0;
      activeCodonStep = 6;
      machineClassIdx = 1;
      captures = [];
      populationView = false;
      activeTool = 'ribosome';
      collectedFamilies.clear();
      popBtn.setAttribute('aria-pressed', 'false');
      tabs.setActive(0);
      stepSlider.set(6);
      machineSlider.set(1);
      trials.clear();
      refresh();
    });

    api.io({
      getState: () => ({
        modeIndex,
        activeCodonStep,
        machineClassIdx,
        populationView,
        collectedFamilies: [...collectedFamilies],
      }),
      setState: (patch = {}) => {
        if (typeof patch.modeIndex === 'number') { modeIndex = patch.modeIndex; tabs.setActive(modeIndex); }
        if (typeof patch.activeCodonStep === 'number') { activeCodonStep = patch.activeCodonStep; stepSlider.set(activeCodonStep); }
        if (typeof patch.machineClassIdx === 'number') { machineClassIdx = patch.machineClassIdx; machineSlider.set(machineClassIdx); }
        if (typeof patch.populationView === 'boolean') {
          populationView = patch.populationView;
          popBtn.setAttribute('aria-pressed', String(populationView));
        }
        refresh();
      },
    });

    function refresh() {
      const p = simulateTranscriptionTranslation(modeIndex, activeCodonStep, machineClassIdx);
      const cmp = compareRibosomeTrials(captures);
      if (activeCodonStep >= 6 && p.matchesWildTypeProtein) {
        collectedFamilies.add(machineClassIdx);
      }

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Nucleus -> Cytoplasm OR 24-Cell Stochastic Population View
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.stroke();

        draw.text(ctx, p.modeName, 171, 30, {
          size: 10.4,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, p.machineTargetName, 171, 46, {
          size: 9.0,
          color: c.muted,
          align: 'center',
        });

        if (populationView) {
          ctx.fillStyle = c.plate;
          ctx.strokeStyle = c.rule;
          ctx.lineWidth = 1.2;
          draw.roundRect(ctx, 24, 56, 294, 240, 8);
          ctx.fill();
          ctx.stroke();
          draw.text(ctx, '24 Genetically Identical Cells · Stochastic Expression', 171, 74, {
            size: 8.8,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          const rand = api.rng(1701 + modeIndex * 31 + machineClassIdx * 13 + activeCodonStep * 7);
          let totalExpr = 0;
          for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
              const cx = 56 + col * 46;
              const cy = 108 + row * 44;
              const baseRate = p.matchesWildTypeProtein ? (activeCodonStep / 7) : modeIndex === 2 ? 0.35 : 0.12;
              const level = Math.max(0.04, Math.min(1, baseRate * (0.45 + rand() * 0.9)));
              totalExpr += level;
              ctx.beginPath();
              ctx.ellipse(cx, cy, 17, 11, (rand() - 0.5) * 0.35, 0, Math.PI * 2);
              ctx.save();
              ctx.fillStyle = p.matchesWildTypeProtein ? c.green : c.proton;
              ctx.globalAlpha = 0.22 + level * 0.72;
              ctx.fill();
              ctx.restore();
              ctx.lineWidth = 1.2;
              ctx.strokeStyle = c.rule;
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(cx - 4, cy, 3.2, 0, Math.PI * 2);
              ctx.fillStyle = c.sheet;
              ctx.fill();
            }
          }
          const avgPct = Math.round((totalExpr / 24) * 100);
          draw.text(ctx, `Mean fluorescence: ${avgPct}% (stochastic bursts)`, 171, 282, {
            size: 8.4,
            weight: 600,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'Same DNA code in every cell; stochastic collisions vary copy count.', 171, 326, {
            size: 8.6,
            color: c.muted,
            align: 'center',
          });
        } else {
          // Zone 1: Nucleus Box
          ctx.fillStyle = c.sheet;
          ctx.strokeStyle = activeTool === 'rnapol' ? c.neutron : c.electron;
          ctx.lineWidth = activeTool === 'rnapol' ? 2.2 : 1.3;
          draw.roundRect(ctx, 24, 56, 294, 84, 7);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, '1. NUCLEUS: Gene stays inside; mRNA copy made', 171, 72, {
            size: 9.0,
            weight: 700,
            color: c.electron,
            align: 'center',
          });
          draw.text(ctx, `Coding DNA:  5'-${p.codingCodons.join(' ')}-3'`, 171, 91, {
            size: 8.6,
            weight: 600,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, `Template:    3'-${p.codingCodons.map(k => k.replace(/A/g, 't').replace(/T/g, 'a').replace(/C/g, 'g').replace(/G/g, 'c').toUpperCase()).join(' ')}-5'`, 171, 107, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, `mRNA copy:   5'-${p.mrnaCodons.join(' ')}-3'  (U replaces T)`, 171, 126, {
            size: 8.6,
            weight: 700,
            color: c.green,
            align: 'center',
          });

          draw.text(ctx, '↓ Step 3: mRNA exits nucleus via nuclear pore to cytoplasm ↓', 171, 154, {
            size: 8.6,
            weight: 600,
            color: c.muted,
            align: 'center',
          });

          // Zone 2: Cytoplasmic Ribosome & Codon Tape (Codons 1-7)
          ctx.fillStyle = c.sheet;
          ctx.strokeStyle = activeTool === 'ribosome' ? c.green : c.rule;
          ctx.lineWidth = activeTool === 'ribosome' ? 2.0 : 1.3;
          draw.roundRect(ctx, 24, 162, 294, 144, 7);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, `2. CYTOPLASM RIBOSOME (At Codon ${p.activeCodonStep}: ${p.currentCodon})`, 171, 178, {
            size: 9.0,
            weight: 700,
            color: c.green,
            align: 'center',
          });

          p.mrnaCodons.forEach((cod, idx) => {
            const cx = 29 + idx * 40.5;
            const cy = 189;
            const isCur = idx + 1 === p.activeCodonStep;
            const isMut = idx + 1 === p.mutatedCodonIndex;

            ctx.fillStyle = isCur ? c.mark_soft : c.plate;
            ctx.strokeStyle = isMut ? c.proton : isCur ? c.electron : c.rule;
            ctx.lineWidth = isCur || isMut ? 1.8 : 1;
            draw.roundRect(ctx, cx, cy, 38, 27, 4);
            ctx.fill();
            ctx.stroke();

            draw.text(ctx, `C${idx + 1}`, cx + 19, cy + 9.5, {
              size: 7.6,
              color: c.muted,
              align: 'center',
            });
            draw.text(ctx, cod, cx + 19, cy + 22, {
              size: 8.6,
              weight: 700,
              color: isMut ? c.proton : c.ink,
              align: 'center',
            });
          });

          draw.text(
            ctx,
            `tRNA anticodon 3'-${p.currentAnticodon}-5' → ${p.currentAminoAcid} (${p.currentAminoAcidFull})`,
            171,
            234,
            {
              size: 8.6,
              weight: 700,
              color: p.currentAminoAcid === 'STOP' ? c.proton : c.electron,
              align: 'center',
            }
          );

          draw.text(ctx, `Chain at step ${p.activeCodonStep}: ${p.stepPeptideChain}`, 171, 254, {
            size: 8.8,
            weight: 700,
            color: c.ink,
            align: 'center',
          });

          draw.text(ctx, `Full protein (1–7): ${p.fullPeptideChain}`, 171, 274, {
            size: 8.8,
            weight: 700,
            color: p.matchesWildTypeProtein ? c.green : c.proton,
            align: 'center',
          });

          draw.text(ctx, p.functionalStatus, 171, 295, {
            size: 8.6,
            weight: 700,
            color: p.matchesWildTypeProtein ? c.green : c.proton,
            align: 'center',
          });

          // Interactive Biomolecule Toolbox chips
          TOOL_CHIPS.forEach((chip) => {
            const on = activeTool === chip.id;
            ctx.fillStyle = on ? c.ink : c.sheet;
            ctx.strokeStyle = on ? c.ink : c.rule;
            ctx.lineWidth = 1.2;
            draw.roundRect(ctx, chip.x, 314, chip.w, 26, 13);
            ctx.fill();
            ctx.stroke();
            draw.text(ctx, chip.label, chip.x + chip.w / 2, 331, {
              size: 9.0,
              weight: 700,
              color: on ? c.sheet : c.ink,
              align: 'center',
            });
          });
        }

        // Top-Right Card: Ledger + Protein Collection Tray
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 12, 290, 230, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 12, 290, 230, 10);
        ctx.stroke();

        draw.text(ctx, '0610 Protein Synthesis & Mutation Ledger', 481, 28, {
          size: 10.6,
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
          ['7. Matches WT HbA?', p.matchesWildTypeProtein ? 'YES (100% identical)' : 'NO (altered/stop)'],
        ];

        rows.forEach(([k, v], i) => {
          const ry = 49 + i * 20;
          draw.text(ctx, k, 346, ry, { size: 9.0, color: c.muted, align: 'left' });
          draw.text(ctx, v, 616, ry, { size: 9.0, weight: 600, color: c.ink, align: 'right' });
        });

        // Protein Collection Tray (X/4)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 344, 192, 274, 44, 7);
        ctx.fill();
        ctx.stroke();
        draw.text(ctx, `Protein collection (${collectedFamilies.size}/4)`, 352, 206, {
          size: 8.6,
          weight: 700,
          color: c.vol,
          align: 'left',
        });
        const famLabels = ['HbA', 'Enzyme', 'Channel', 'Antibody'];
        famLabels.forEach((lbl, idx) => {
          const fx = 352 + idx * 66;
          const fy = 212;
          const has = collectedFamilies.has(idx + 1);
          const isCur = machineClassIdx === idx + 1;
          ctx.fillStyle = has ? c.green : c.plate;
          ctx.strokeStyle = isCur ? c.electron : c.rule;
          ctx.lineWidth = isCur ? 1.8 : 1;
          draw.roundRect(ctx, fx, fy, 60, 19, 5);
          ctx.fill();
          ctx.stroke();
          draw.text(ctx, lbl, fx + 30, fy + 13, {
            size: 8.0,
            weight: 700,
            color: has ? c.sheet : c.muted,
            align: 'center',
          });
        });

        // Bottom-Right Captured Trials Box
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 250, 290, 98, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 250, 290, 98, 10);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${captures.length})`, 481, 268, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two contrasting states', 481, 290, {
            size: 9.6,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Child X Silent vs Child Y Missense).', 481, 308, {
            size: 9.6,
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
