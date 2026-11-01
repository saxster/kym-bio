// Chapter 12 Widget 3: Stem Cell Differentiation & Selective Gene Expression Switchboard (0610 Topics 17.1.6 & 17.2.5).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  STEM_CELL_LINEAGE_PRESETS,
  simulateStemCellExpressionLab,
  captureExpressionTrial,
  compareExpressionTrials,
} from './cell_division_model.js';

Live.register(
  'stem_cell_expression_lab',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let differentiationStage = 4;
    let tfSwitch = 1;
    let captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Stem cell differentiation, selective gene expression switchboard, and Gurdon/Yamanaka nuclear reprogramming workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      STEM_CELL_LINEAGE_PRESETS.map((p) => p.shortLabel),
      (idx) => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const diffSlider = api.slider('Differentiation stage', {
      min: 1,
      max: 4,
      step: 1,
      value: differentiationStage,
      fmt: (v) => `Stage ${v}`,
      onInput: (v) => {
        differentiationStage = v;
        refresh();
      },
    });

    const tfSlider = api.slider('Regulator switch', {
      min: 1,
      max: 4,
      step: 1,
      value: tfSwitch,
      fmt: (v) => `Switch #${v}`,
      onInput: (v) => {
        tfSwitch = v;
        refresh();
      },
    });

    api.button('Stem Cell (Stg 1)', () => {
      modeIndex = 0;
      differentiationStage = 1;
      tfSwitch = 1;
      tabs.setActive(0);
      diffSlider.set(1);
      tfSlider.set(1);
      refresh();
    });

    api.button('Beta Cell (INS ON)', () => {
      modeIndex = 0;
      differentiationStage = 4;
      tfSwitch = 1;
      tabs.setActive(0);
      diffSlider.set(4);
      tfSlider.set(1);
      refresh();
    });

    api.button('Erythroblast (HBB ON)', () => {
      modeIndex = 1;
      differentiationStage = 4;
      tfSwitch = 1;
      tabs.setActive(1);
      diffSlider.set(4);
      tfSlider.set(1);
      refresh();
    });

    api.button('Yamanaka iPSC Reset', () => {
      modeIndex = 3;
      differentiationStage = 4;
      tfSwitch = 4;
      tabs.setActive(3);
      diffSlider.set(4);
      tfSlider.set(4);
      refresh();
    });

    api.button('Capture trial', () => {
      const next = captureExpressionTrial(
        { mode: modeIndex, differentiationStage, tfSwitch },
        captures
      );
      const cand = next[next.length - 1];
      const prev = captures[captures.length - 1];
      if (
        !prev ||
        prev.modeId !== cand.modeId ||
        prev.differentiationStage !== cand.differentiationStage ||
        prev.tfSwitchIndex !== cand.tfSwitchIndex
      ) {
        captures = [...next];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures = [];
      refresh();
    });

    function refresh() {
      const sim = simulateStemCellExpressionLab({
        mode: modeIndex,
        differentiationStage,
        tfSwitch,
      });

      const cmpText =
        captures.length >= 2
          ? 'Contrasting expression states captured for comparison: ' +
            compareExpressionTrials(captures[captures.length - 2], captures[captures.length - 1]).summary
          : 'Tap "Capture trial" on two different cell types or stages to verify that 100% of DNA is retained while expressed genes change.';

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Cell State, Genome Invariance & Master Regulator
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 232, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 232, 336, 10);
        ctx.stroke();

        draw.text(ctx, sim.shortModeLabel, 130, 30, {
          size: 10.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `Stage ${sim.differentiationStage}: ${sim.potencyLabel.split(' (')[0]}`, 130, 46, {
          size: 8.8,
          color: c.muted,
          align: 'center',
        });

        // Nuclear DNA Invariance Box
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 58, 212, 68, 8);
        ctx.fill();
        ctx.strokeStyle = c.green;
        draw.roundRect(ctx, 24, 58, 212, 68, 8);
        ctx.stroke();

        draw.text(ctx, 'Nuclear DNA Archive: 2n = 46', 130, 76, {
          size: 9.6,
          weight: 700,
          color: c.green,
          align: 'center',
        });
        draw.text(ctx, '100% of ~20,000 genes present', 130, 94, {
          size: 9.0,
          weight: 600,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, 'Zero genes deleted in differentiation', 130, 112, {
          size: 8.4,
          color: c.muted,
          align: 'center',
        });

        // Active Transcription Factor Box
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 134, 212, 64, 8);
        ctx.fill();
        ctx.strokeStyle = c.electron;
        draw.roundRect(ctx, 24, 134, 212, 64, 8);
        ctx.stroke();

        draw.text(ctx, 'Active Transcription Switch', 130, 152, {
          size: 9.2,
          weight: 700,
          color: c.electron,
          align: 'center',
        });
        draw.text(ctx, sim.activeRegulator.split(' (')[0], 130, 170, {
          size: 8.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `Expressed: ${sim.expressedPanelGenes}/6 ON | ${sim.silencedPanelGenes}/6 OFF`, 130, 188, {
          size: 8.6,
          color: c.muted,
          align: 'center',
        });

        // Mitotic self-renewal vs specialisation bars
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 206, 212, 64, 8);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 24, 206, 212, 64, 8);
        ctx.stroke();

        draw.text(ctx, `Mitotic division rate: ${sim.mitoticIndexPct}%`, 34, 224, {
          size: 8.8,
          color: c.ink,
          align: 'left',
        });
        ctx.fillStyle = c.electron;
        draw.roundRect(ctx, 34, 230, Math.max(6, Math.round((sim.mitoticIndexPct / 100) * 190)), 7, 3);
        ctx.fill();

        draw.text(ctx, `Specialisation level: ${sim.specialisationPct}%`, 34, 250, {
          size: 8.8,
          color: c.ink,
          align: 'left',
        });
        ctx.fillStyle = c.green;
        draw.roundRect(ctx, 34, 256, Math.max(6, Math.round((sim.specialisationPct / 100) * 190)), 7, 3);
        ctx.fill();

        // Captured Trials Box inside Left Card bottom
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 278, 212, 60, 8);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 24, 278, 212, 60, 8);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${captures.length})`, 130, 294, {
          size: 9.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on 2 cell types', 130, 314, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'to compare active gene sets.', 130, 328, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const shortCell = cap.shortModeLabel.split(' ')[0];
            draw.text(
              ctx,
              `#${cap.trialNumber} ${shortCell} (Stg ${cap.differentiationStage}): [${cap.activeSymbols}]`,
              130,
              312 + idx * 16,
              { size: 7.8, weight: 600, color: idx === 0 ? c.electron : c.green, align: 'center' }
            );
          });
        }

        // Right Card: 6-Gene Selective Expression Switchboard
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 256, 12, 370, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 256, 12, 370, 336, 10);
        ctx.stroke();

        draw.text(ctx, 'Selective Gene Expression Switchboard (0610 17.1.6)', 441, 30, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        draw.text(ctx, 'Gene Locus', 268, 48, { size: 8.6, weight: 700, color: c.muted, align: 'left' });
        draw.text(ctx, 'In DNA?', 362, 48, { size: 8.6, weight: 700, color: c.muted, align: 'left' });
        draw.text(ctx, 'State', 418, 48, { size: 8.6, weight: 700, color: c.muted, align: 'left' });
        draw.text(ctx, 'mRNA & Protein Built', 464, 48, { size: 8.6, weight: 700, color: c.muted, align: 'left' });

        sim.geneStates.forEach((g, i) => {
          const ry = 56 + i * 47;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, 266, ry, 350, 41, 6);
          ctx.fill();
          ctx.strokeStyle = g.expressed ? c.electron : c.rule;
          draw.roundRect(ctx, 266, ry, 350, 41, 6);
          ctx.stroke();

          draw.text(ctx, g.symbol, 274, ry + 17, {
            size: 9.2,
            weight: 700,
            color: g.expressed ? c.ink : c.muted,
            align: 'left',
          });
          draw.text(ctx, g.chromosome, 274, ry + 33, {
            size: 8.0,
            color: c.muted,
            align: 'left',
          });

          draw.text(ctx, 'YES (100%)', 360, ry + 24, {
            size: 8.4,
            weight: 700,
            color: c.green,
            align: 'left',
          });

          draw.text(ctx, g.expressed ? 'ON' : 'OFF', 422, ry + 24, {
            size: 9.0,
            weight: 700,
            color: g.expressed ? c.electron : c.proton,
            align: 'left',
          });

          draw.text(
            ctx,
            g.expressed ? `${g.mrnaCopiesPerCell} mRNA copies` : '0 mRNA transcribed',
            464,
            ry + 17,
            {
              size: 8.6,
              weight: 700,
              color: g.expressed ? c.ink : c.muted,
              align: 'left',
            }
          );
          draw.text(
            ctx,
            g.expressed
              ? g.proteinMade.split(' (')[0].replace('Acetylcholine enzyme & voltage-gated', 'ACh enzyme &')
              : 'Closed heterochromatin',
            458,
            ry + 33,
            {
              size: 7.6,
              color: g.expressed ? c.green : c.muted,
              align: 'left',
            }
          );
        });
      });

      const activeList = sim.geneStates
        .filter((g) => g.expressed)
        .map((g) => g.symbol)
        .join(', ');
      const silentList = sim.geneStates
        .filter((g) => g.expressed === false)
        .map((g) => g.symbol)
        .join(', ');

      const history = captures
        .map(
          (cap) =>
            `#${cap.trialNumber} ${cap.shortModeLabel} Stg ${cap.differentiationStage} (DNA ${cap.dnaGenesRetainedPct}%, ON: ${cap.activeSymbols})`
        )
        .join(' | ');

      say(
        `${sim.modeLabel} · ${sim.stageLabel} (${sim.activeRegulator}): Nucleus retains ${sim.chromosomesInNucleus} chromosomes (${sim.dnaGenesRetainedPct}% of ${sim.totalGenesInNucleus.toLocaleString()} genes present in DNA). Expressed genes (${sim.expressedPanelGenes}/6 ON): [${activeList}] · Silenced genes (${sim.silencedPanelGenes}/6 OFF): [${silentList || 'none'}]. ${sim.igcseRuleExplanation} ${cmpText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate stem cell differentiation, selective gene expression & Yamanaka reprogramming',
    three: false,
    static: true,
  }
);
