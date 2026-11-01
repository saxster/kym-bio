// Chapter 13 Widget 1: Mendel's Brno Pea Ratios & Monohybrid Punnett Simulator (0610 Topic 17.4).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  MENDEL_CROSS_MODES,
  MENDEL_TRAIT_LOCI,
  MENDEL_SAMPLE_STEPS,
  simulateMendelPunnett,
  captureMendelTrial,
  compareMendelTrials,
} from './inheritance_model.js';

Live.register(
  'mendel_punnett_simulator',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let traitStep = 1;
    let sampleStep = 4;
    let maternalStep = 2;
    let paternalStep = 2;
    let captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Mendel monohybrid Punnett square simulator, test-cross verifier, enzyme dose ledger, and 1866 Brno pea sample convergence lab'
    );

    const say = api.readout();
    const tabs = api.tabs(
      MENDEL_CROSS_MODES.map((m) => m.shortLabel),
      (idx) => {
        modeIndex = idx;
        const m = MENDEL_CROSS_MODES[idx];
        maternalStep = m.defaultMaternalStep;
        paternalStep = m.defaultPaternalStep;
        if (idx === 3) {
          sampleStep = 4;
          sampleSlider.set(4);
        }
        refresh();
      },
      0
    );

    const traitSlider = api.slider('Pea character locus', {
      min: 1,
      max: MENDEL_TRAIT_LOCI.length,
      step: 1,
      value: traitStep,
      fmt: (v) => {
        const t = MENDEL_TRAIT_LOCI[v - 1] || MENDEL_TRAIT_LOCI[0];
        return `${t.character} (${t.dominantSymbol}/${t.recessiveSymbol})`;
      },
      onInput: (v) => {
        traitStep = v;
        refresh();
      },
    });

    const sampleSlider = api.slider('Fertilisation sample size', {
      min: 1,
      max: MENDEL_SAMPLE_STEPS.length,
      step: 1,
      value: sampleStep,
      fmt: (v) => {
        const s = MENDEL_SAMPLE_STEPS[v - 1] || MENDEL_SAMPLE_STEPS[3];
        return s.shortLabel;
      },
      onInput: (v) => {
        sampleStep = v;
        refresh();
      },
    });

    api.button('3:1 Hybrid (Rr × Rr)', () => {
      modeIndex = 0;
      maternalStep = 2;
      paternalStep = 2;
      sampleStep = 4;
      tabs.setActive(0);
      sampleSlider.set(4);
      refresh();
    });

    api.button('1:1 Test Cross (Rr × rr)', () => {
      modeIndex = 1;
      maternalStep = 2;
      paternalStep = 3;
      sampleStep = 4;
      tabs.setActive(1);
      sampleSlider.set(4);
      refresh();
    });

    api.button('Small Pod (N = 16)', () => {
      modeIndex = 0;
      maternalStep = 2;
      paternalStep = 2;
      sampleStep = 1;
      tabs.setActive(0);
      sampleSlider.set(1);
      refresh();
    });

    api.button('Brno 7-Trait Ledger', () => {
      modeIndex = 3;
      maternalStep = 2;
      paternalStep = 2;
      sampleStep = 4;
      tabs.setActive(3);
      sampleSlider.set(4);
      refresh();
    });

    api.button('Capture trial', () => {
      const sim = simulateMendelPunnett({
        modeIndex,
        traitStep,
        sampleStep,
        maternalGenotypeStep: maternalStep,
        paternalGenotypeStep: paternalStep,
      });
      const cap = captureMendelTrial(sim);
      const prev = captures[captures.length - 1];
      if (
        !prev ||
        prev.crossCode !== cap.crossCode ||
        prev.sampleLabel !== cap.sampleLabel ||
        prev.character !== cap.character
      ) {
        captures = [...captures.slice(-3), { ...cap, trialNumber: captures.length + 1 }];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures = [];
      refresh();
    });

    function refresh() {
      const sim = simulateMendelPunnett({
        modeIndex,
        traitStep,
        sampleStep,
        maternalGenotypeStep: maternalStep,
        paternalGenotypeStep: paternalStep,
      });

      const cmpText =
        captures.length >= 2
          ? 'Contrasting crosses captured for comparison: ' +
            compareMendelTrials(captures[captures.length - 2], captures[captures.length - 1]).summary
          : 'Tap "Capture trial" on two crosses or sample sizes to compare theoretical Punnett ratios with empirical counts.';

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Interactive 2x2 Punnett Grid & Gamete Header
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 306, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 306, 336, 10);
        ctx.stroke();

        draw.text(ctx, `${sim.trait.character} · Cross ${sim.crossCode}`, 167, 29, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `Maternal (${sim.maternal.code}) × Paternal (${sim.paternal.code})`,
          167,
          45,
          {
            size: 9.0,
            color: c.muted,
            align: 'center',
          }
        );

        // Paternal gamete headers
        for (let col = 0; col < 2; col += 1) {
          const gx = 96 + col * 104;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, gx, 54, 96, 24, 6);
          ctx.fill();
          ctx.strokeStyle = c.electron;
          draw.roundRect(ctx, gx, 54, 96, 24, 6);
          ctx.stroke();
          draw.text(ctx, `Pollen (n): ${sim.paternal.alleles[col]}`, gx + 48, 66, {
            size: 9.0,
            weight: 700,
            color: c.electron,
            align: 'center',
          });
        }

        // Maternal gamete headers + 4 Punnett cells
        for (let row = 0; row < 2; row += 1) {
          const gy = 84 + row * 72;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, 24, gy, 66, 64, 6);
          ctx.fill();
          ctx.strokeStyle = c.proton;
          draw.roundRect(ctx, 24, gy, 66, 64, 6);
          ctx.stroke();
          draw.text(ctx, 'Ovule (n)', 57, gy + 23, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, sim.maternal.alleles[row], 57, gy + 43, {
            size: 11.0,
            weight: 700,
            color: c.proton,
            align: 'center',
          });

          for (let col = 0; col < 2; col += 1) {
            const cell = sim.punnettCells[row * 2 + col];
            const cx = 96 + col * 104;
            const bCol = cell.isDominantPhenotype ? c.green : c.proton;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, cx, gy, 96, 64, 8);
            ctx.fill();
            ctx.strokeStyle = bCol;
            ctx.lineWidth = 1.4;
            draw.roundRect(ctx, cx, gy, 96, 64, 8);
            ctx.stroke();
            ctx.lineWidth = 1;

            draw.text(ctx, `${cell.genotype} (25%)`, cx + 48, gy + 18, {
              size: 10.2,
              weight: 700,
              color: c.ink,
              align: 'center',
            });
            draw.text(ctx, cell.phenotype, cx + 48, gy + 36, {
              size: 8.6,
              weight: 600,
              color: bCol,
              align: 'center',
            });
            draw.text(ctx, `Enzyme: ${cell.enzymeDosePct}% dose`, cx + 48, gy + 52, {
              size: 8.0,
              color: c.muted,
              align: 'center',
            });
          }
        }

        // Bottom summary box inside Left Card
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 232, 286, 106, 8);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 24, 232, 286, 106, 8);
        ctx.stroke();

        draw.text(ctx, `Genotype ratio: ${sim.theoreticalGenotypeRatio}`, 34, 250, {
          size: 9.0,
          weight: 700,
          color: c.ink,
          align: 'left',
        });
        draw.text(
          ctx,
          `Phenotype: ${sim.theoreticalDominantPct}% dom : ${sim.theoreticalRecessivePct}% rec (${sim.theoreticalPhenotypeRatio})`,
          34,
          270,
          {
            size: 8.8,
            weight: 700,
            color: c.green,
            align: 'left',
          }
        );
        draw.text(ctx, `Protein: ${sim.trait.enzymeName}`, 34, 290, {
          size: 8.6,
          color: c.electron,
          align: 'left',
        });
        draw.text(
          ctx,
          `F₃ seed test: ${sim.trait.f3TrueBreedingDominant} pure : ${sim.trait.f3SegregatingHybrid} hybrid (1 : 2)`,
          34,
          310,
          {
            size: 8.5,
            color: c.muted,
            align: 'left',
          }
        );
        draw.text(
          ctx,
          `Dominant = ${sim.trait.dominantTrait} | Recessive = ${sim.trait.recessiveTrait}`,
          34,
          328,
          {
            size: 8.2,
            color: c.ink,
            align: 'left',
          }
        );

        // Right Card: Quantitative Sample Convergence & Brno Ledger
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 330, 12, 296, 234, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 330, 12, 296, 234, 10);
        ctx.stroke();

        draw.text(ctx, 'Empirical Sample vs Punnett Expectation', 478, 29, {
          size: 10.4,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, sim.empirical.sourceLabel, 478, 45, {
          size: 8.6,
          color: c.muted,
          align: 'center',
        });

        // Two horizontal progress bars: Dominant vs Recessive
        const barX = 344;
        const barW = 190;
        const domW = Math.round((sim.empirical.dominantPct / 100) * barW);
        const recW = Math.round((sim.empirical.recessivePct / 100) * barW);

        draw.text(ctx, `Dominant (${sim.trait.dominantSymbol}_)`, 344, 64, {
          size: 8.6,
          weight: 700,
          color: c.green,
          align: 'left',
        });
        draw.text(
          ctx,
          `${sim.empirical.dominantCount} (${sim.empirical.dominantPct}%)`,
          614,
          64,
          { size: 8.6, weight: 700, color: c.ink, align: 'right' }
        );
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, barX, 72, barW, 12, 4);
        ctx.fill();
        if (domW > 0) {
          ctx.fillStyle = c.green;
          draw.roundRect(ctx, barX, 72, Math.max(4, domW), 12, 4);
          ctx.fill();
        }

        draw.text(ctx, `Recessive (${sim.trait.recessiveSymbol}${sim.trait.recessiveSymbol})`, 344, 100, {
          size: 8.6,
          weight: 700,
          color: c.proton,
          align: 'left',
        });
        draw.text(
          ctx,
          `${sim.empirical.recessiveCount} (${sim.empirical.recessivePct}%)`,
          614,
          100,
          { size: 8.6, weight: 700, color: c.ink, align: 'right' }
        );
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, barX, 108, barW, 12, 4);
        ctx.fill();
        if (recW > 0) {
          ctx.fillStyle = c.proton;
          draw.roundRect(ctx, barX, 108, Math.max(4, recW), 12, 4);
          ctx.fill();
        }

        const rightRows = [
          ['Sample size (N)', `${sim.empirical.sampleSize} offspring`],
          ['Observed ratio', sim.empirical.observedRatioText],
          ['Theoretical ratio', sim.theoreticalPhenotypeRatio],
          [
            'Mendel 1866 trait count',
            `${sim.trait.mendelDominantCount} : ${sim.trait.mendelRecessiveCount} (${sim.trait.mendelRatio} : 1)`,
          ],
          ['All 7 traits (Brno)', '14,949 : 5,010 (2.98 : 1)'],
        ];

        rightRows.forEach(([k, v], i) => {
          const ry = 140 + i * 20;
          draw.text(ctx, k, 344, ry, { size: 8.6, color: c.muted, align: 'left' });
          draw.text(ctx, v, 614, ry, { size: 8.6, weight: 700, color: c.ink, align: 'right' });
        });

        // Bottom-Right Captured Trials Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 330, 254, 296, 94, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 330, 254, 296, 94, 10);
        ctx.stroke();

        draw.text(ctx, `Captured crosses (${captures.length})`, 478, 272, {
          size: 10.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" to compare N = 16 vs Mendel', 478, 296, {
            size: 8.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'or contrast 3:1 Hybrid (Rr × Rr) with 1:1 Test Cross.', 478, 314, {
            size: 8.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 295 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.crossCode} (${cap.sampleLabel}): ${cap.observedDominantPct}% dom (${cap.observedRatioText})`,
              478,
              cy,
              {
                size: 8.4,
                weight: 600,
                color: idx === 0 ? c.electron : c.green,
                align: 'center',
              }
            );
          });
        }
      });

      const history = captures
        .map((cap) => `#${cap.trialNumber} ${cap.crossCode} (${cap.sampleLabel}: ${cap.observedRatioText})`)
        .join(' | ');

      say(
        `${sim.mode.label} · ${sim.trait.character} (${sim.crossCode}): theoretical genotype ratio ${sim.theoreticalGenotypeRatio} and phenotype ratio ${sim.theoreticalPhenotypeRatio} (${sim.theoreticalDominantPct}% ${sim.trait.dominantTrait} : ${sim.theoreticalRecessivePct}% ${sim.trait.recessiveTrait}). At sample ${sim.sampleMeta.shortLabel} (N = ${sim.empirical.sampleSize}), observed count is ${sim.empirical.dominantCount} dominant : ${sim.empirical.recessiveCount} recessive (${sim.empirical.observedRatioText}). ${sim.trait.geneMechanism} ${cmpText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Simulate Mendel monohybrid crosses, 1:1 test crosses & sample convergence from N = 16 to 19,959 Brno peas',
    three: false,
    static: true,
  }
);
