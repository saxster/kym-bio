// Chapter 12 Widget 2: Mitosis vs Meiosis Chromosome Stepper & Ploidy Ledger (0610 Topics 17.2, 17.3, 16.1 & 16.2).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  DIVISION_MODE_PRESETS,
  simulateMitosisMeiosisStepper,
  captureDivisionTrial,
  compareDivisionTrials,
} from './cell_division_model.js';

Live.register(
  'mitosis_meiosis_stepper',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let stage = 1;
    let organismPreset = 1;
    let captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Mitosis versus meiosis chromosome and sister chromatid stepper, ploidy ledger, and Cavendish 3n = 33 meiosis jam workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      DIVISION_MODE_PRESETS.map((p) => p.shortLabel),
      (idx) => {
        modeIndex = idx;
        if (idx === 2) {
          organismPreset = 3;
          orgSlider.set(3);
        } else if (idx === 3) {
          organismPreset = 4;
          orgSlider.set(4);
        } else if (organismPreset > 2) {
          organismPreset = 1;
          orgSlider.set(1);
        }
        refresh();
      },
      0
    );

    const stageSlider = api.slider('Division cycle stage', {
      min: 1,
      max: 5,
      step: 1,
      value: stage,
      fmt: (v) => `Stage ${v}`,
      onInput: (v) => {
        stage = v;
        refresh();
      },
    });

    const orgSlider = api.slider('Organism preset', {
      min: 1,
      max: 4,
      step: 1,
      value: organismPreset,
      fmt: (v) => `Preset #${v}`,
      onInput: (v) => {
        organismPreset = v;
        refresh();
      },
    });

    api.button('Mitosis S-Phase (92)', () => {
      modeIndex = 0;
      stage = 2;
      organismPreset = 1;
      tabs.setActive(0);
      stageSlider.set(2);
      orgSlider.set(1);
      refresh();
    });

    api.button('Mitosis Clones (2n=46)', () => {
      modeIndex = 0;
      stage = 5;
      organismPreset = 1;
      tabs.setActive(0);
      stageSlider.set(5);
      orgSlider.set(1);
      refresh();
    });

    api.button('Meiosis Gametes (n=23)', () => {
      modeIndex = 1;
      stage = 4;
      organismPreset = 1;
      tabs.setActive(1);
      stageSlider.set(4);
      orgSlider.set(1);
      refresh();
    });

    api.button('Cavendish 3n=33 Jam', () => {
      modeIndex = 2;
      stage = 3;
      organismPreset = 3;
      tabs.setActive(2);
      stageSlider.set(3);
      orgSlider.set(3);
      refresh();
    });

    api.button('Capture trial', () => {
      const next = captureDivisionTrial({ mode: modeIndex, stage, organismPreset }, captures);
      const cand = next[next.length - 1];
      const prev = captures[captures.length - 1];
      if (
        !prev ||
        prev.modeId !== cand.modeId ||
        prev.stage !== cand.stage ||
        prev.commonName !== cand.commonName
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
      const sim = simulateMitosisMeiosisStepper({
        mode: modeIndex,
        stage,
        organismPreset,
      });

      const cmpText =
        captures.length >= 2
          ? 'Contrasting division states captured for comparison: ' +
            compareDivisionTrials(captures[captures.length - 2], captures[captures.length - 1]).summary
          : 'Tap "Capture trial" on two division stages or organisms to compare chromosome and chromatid counts.';

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Visual Spindle & Chromosome Diagram
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 310, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 310, 336, 10);
        ctx.stroke();

        draw.text(ctx, `${sim.shortModeLabel} · Stage ${sim.stage}`, 169, 30, {
          size: 11.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `${sim.commonName} (${sim.ploidyLabel})`, 169, 46, {
          size: 9.4,
          color: c.muted,
          align: 'center',
        });

        // Draw 1, 2, or 4 cells in Left Card
        if (sim.cellCount === 1) {
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, 32, 60, 274, 162, 22);
          ctx.fill();
          ctx.strokeStyle = c.electron;
          draw.roundRect(ctx, 32, 60, 274, 162, 22);
          ctx.stroke();

          const nBars = sim.organismId === 'cavendish_3n33' ? 3 : 4;
          for (let i = 0; i < nBars; i += 1) {
            const cx = 74 + i * 62;
            const cy = 128;
            const col = i % 2 === 0 ? c.electron : c.proton;
            if (sim.chromatidsPerCell > sim.chromosomesPerCell) {
              // Replicated sister chromatids joined at 1 centromere
              ctx.fillStyle = col;
              draw.roundRect(ctx, cx - 10, cy - 26, 8, 52, 3);
              ctx.fill();
              draw.roundRect(ctx, cx + 2, cy - 26, 8, 52, 3);
              ctx.fill();
              ctx.fillStyle = c.green;
              draw.roundRect(ctx, cx - 12, cy - 4, 24, 8, 3);
              ctx.fill();
            } else {
              ctx.fillStyle = col;
              draw.roundRect(ctx, cx - 5, cy - 26, 10, 52, 4);
              ctx.fill();
              ctx.fillStyle = c.green;
              draw.roundRect(ctx, cx - 8, cy - 4, 16, 8, 3);
              ctx.fill();
            }
          }
          draw.text(
            ctx,
            `${sim.chromosomesPerCell} chromosomes | ${sim.chromatidsPerCell} chromatids`,
            169,
            204,
            { size: 9.4, weight: 700, color: c.ink, align: 'center' }
          );
        } else if (sim.cellCount === 2) {
          for (let k = 0; k < 2; k += 1) {
            const bx = 28 + k * 144;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, bx, 60, 134, 162, 18);
            ctx.fill();
            ctx.strokeStyle = c.green;
            draw.roundRect(ctx, bx, 60, 134, 162, 18);
            ctx.stroke();

            for (let i = 0; i < 2; i += 1) {
              const cx = bx + 42 + i * 48;
              const cy = 128;
              const col = i === 0 ? c.electron : c.proton;
              ctx.fillStyle = col;
              if (sim.chromatidsPerCell > sim.chromosomesPerCell) {
                draw.roundRect(ctx, cx - 9, cy - 24, 7, 48, 3);
                ctx.fill();
                draw.roundRect(ctx, cx + 2, cy - 24, 7, 48, 3);
                ctx.fill();
              } else {
                draw.roundRect(ctx, cx - 5, cy - 24, 10, 48, 4);
                ctx.fill();
              }
              ctx.fillStyle = c.green;
              draw.roundRect(ctx, cx - 9, cy - 4, 18, 8, 2);
              ctx.fill();
            }
            draw.text(ctx, `Cell ${k + 1}: ${sim.chromosomesPerCell} chr`, bx + 67, 204, {
              size: 9.0,
              weight: 700,
              color: c.ink,
              align: 'center',
            });
          }
        } else {
          for (let k = 0; k < 4; k += 1) {
            const gx = 28 + (k % 2) * 144;
            const gy = 60 + Math.floor(k / 2) * 82;
            const okCol = sim.meioticViable ? c.green : c.proton;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, gx, gy, 134, 74, 12);
            ctx.fill();
            ctx.strokeStyle = okCol;
            draw.roundRect(ctx, gx, gy, 134, 74, 12);
            ctx.stroke();

            draw.text(
              ctx,
              sim.meioticViable ? `Gamete ${k + 1} (n=${sim.chromosomesPerCell})` : `Spore ${k + 1} (Abort)`,
              gx + 67,
              gy + 28,
              { size: 9.0, weight: 700, color: okCol, align: 'center' }
            );
            draw.text(
              ctx,
              sim.meioticViable ? `${sim.chromatidsPerCell} single helices` : 'Unbalanced 11–22 chr',
              gx + 67,
              gy + 50,
              { size: 8.6, color: c.ink, align: 'center' }
            );
          }
        }

        // Bottom summary box inside Left Card
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 232, 290, 104, 8);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 24, 232, 290, 104, 8);
        ctx.stroke();

        draw.text(
          ctx,
          `Homologous pairing: ${sim.homologousPairing ? 'YES (Meiosis I)' : 'NO (Independent)'}`,
          34,
          254,
          { size: 9.2, weight: 700, color: c.ink, align: 'left' }
        );
        draw.text(
          ctx,
          `Crossing over: ${sim.crossingOverActive ? 'Active (chiasmata swap)' : 'None (clonal copy)'}`,
          34,
          276,
          { size: 9.2, color: c.muted, align: 'left' }
        );
        draw.text(
          ctx,
          `Divisions: ${sim.nuclearDivisions} → ${sim.daughterCellCount} daughter cells`,
          34,
          298,
          { size: 9.2, weight: 700, color: c.electron, align: 'left' }
        );
        draw.text(
          ctx,
          sim.divisionType === 'mitosis'
            ? 'Role: Growth, repair, replacement, clones'
            : sim.meioticViable
            ? 'Role: Haploid gametes & sexual variation'
            : 'Result: Sterile seedless fruit (cloned by mitosis)',
          34,
          320,
          { size: 8.8, color: c.green, align: 'left' }
        );

        // Right Card: Quantitative Chromosome & Ploidy Ledger
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 334, 12, 292, 232, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 334, 12, 292, 232, 10);
        ctx.stroke();

        draw.text(ctx, 'Quantitative Chromosome Ledger', 480, 30, {
          size: 11.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rightRows = [
          ['Organism (basic set)', `${sim.commonName} (x = ${sim.basicSetX})`],
          ['Somatic count', `${sim.somaticChromosomes} chromosomes`],
          ['Current stage count', `${sim.chromosomesPerCell} chr / ${sim.chromatidsPerCell} chromatids`],
          ['DNA mass / ploidy', `${sim.dnaMassC}C · ${sim.ploidyLabel}`],
          ['Cells at this stage', `${sim.cellCount} cell(s)`],
          [
            'Assortment (2ⁿ)',
            sim.divisionType === 'mitosis'
              ? '1 (100% genetic clone)'
              : sim.meioticViable
              ? `2^${sim.homologousPairs} gamete ways`
              : 'Sterile (11 odd triplets)',
          ],
          ['If no meiosis (Gen 3)', `Doubles to ${sim.runawayWithoutMeiosisGen3} chr`],
        ];

        rightRows.forEach(([k, v], i) => {
          const ry = 56 + i * 25;
          draw.text(ctx, k, 344, ry, { size: 9.2, color: c.muted, align: 'left' });
          draw.text(ctx, v, 616, ry, { size: 9.2, weight: 700, color: c.ink, align: 'right' });
        });

        // Bottom-Right Captured Trials Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 334, 252, 292, 96, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 334, 252, 292, 96, 10);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${captures.length})`, 480, 270, {
          size: 10.4,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two stages', 480, 294, {
            size: 9.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Mitosis Stage 5 vs Meiosis Stage 4).', 480, 312, {
            size: 9.2,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 294 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.shortModeLabel} Stg ${cap.stage}: ${cap.chromosomesPerCell} chr / ${cap.chromatidsPerCell} chromatids (${cap.cellCount}x)`,
              480,
              cy,
              {
                size: 8.6,
                weight: 600,
                color: idx === 0 ? c.electron : c.green,
                align: 'center',
              }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap) =>
            `#${cap.trialNumber} ${cap.shortModeLabel} Stg ${cap.stage} (${cap.chromosomesPerCell} chr/${cap.chromatidsPerCell} chromatids)`
        )
        .join(' | ');

      say(
        `${sim.modeLabel} · ${sim.stageTitle} (${sim.commonName}): ${sim.chromosomesPerCell} chromosomes, ${sim.chromatidsPerCell} sister chromatids (${sim.dnaMassC}C DNA, ${sim.ploidyLabel}) across ${sim.cellCount} cell(s). ${sim.stageMechanism} ${cmpText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate mitosis vs meiosis chromosome counts, ploidy & the 3n = 33 Cavendish banana jam',
    three: false,
    static: true,
  }
);
