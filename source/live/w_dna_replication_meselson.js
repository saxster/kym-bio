// Chapter 12 Widget 1: Semi-Conservative DNA Replication & Meselson–Stahl (1958) Lab (0610 Topic 17.2.3 & 4.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  MESELSON_HYPOTHESIS_PRESETS,
  simulateDnaReplicationMeselson,
  captureMeselsonTrial,
  compareMeselsonTrials,
} from './cell_division_model.js';

Live.register(
  'dna_replication_meselson',
  (stage, params, api) => {
    let modeIndex = 0;
    let generation = 1;
    let fidelityStep = 4;
    let captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Semi-conservative DNA replication fork, DNA polymerase proofreading, and Meselson-Stahl 1958 CsCl density-gradient workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      MESELSON_HYPOTHESIS_PRESETS.map((p) => p.shortLabel),
      (idx) => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const genSlider = api.slider('Generation in ¹⁴N', {
      min: 0,
      max: 4,
      step: 1,
      value: generation,
      fmt: (v) => `Gen ${v}`,
      onInput: (v) => {
        generation = v;
        refresh();
      },
    });

    const fidSlider = api.slider('Proofreading step', {
      min: 1,
      max: 4,
      step: 1,
      value: fidelityStep,
      fmt: (v) => `Step ${v}`,
      onInput: (v) => {
        fidelityStep = v;
        refresh();
      },
    });

    api.button('Gen 0 Heavy (¹⁵N)', () => {
      modeIndex = 0;
      generation = 0;
      fidelityStep = 4;
      tabs.setActive(0);
      genSlider.set(0);
      fidSlider.set(4);
      refresh();
    });

    api.button('Gen 1 Hybrid Proof', () => {
      modeIndex = 0;
      generation = 1;
      fidelityStep = 4;
      tabs.setActive(0);
      genSlider.set(1);
      fidSlider.set(4);
      refresh();
    });

    api.button('Gen 2 Split Proof', () => {
      modeIndex = 0;
      generation = 2;
      fidelityStep = 4;
      tabs.setActive(0);
      genSlider.set(2);
      fidSlider.set(4);
      refresh();
    });

    api.button('Falsify Conservative', () => {
      modeIndex = 1;
      generation = 1;
      fidelityStep = 4;
      tabs.setActive(1);
      genSlider.set(1);
      fidSlider.set(4);
      refresh();
    });

    api.button('Capture trial', () => {
      const next = captureMeselsonTrial({ mode: modeIndex, generation, fidelityStep }, captures);
      const cand = next[next.length - 1];
      const prev = captures[captures.length - 1];
      if (!prev || prev.modeId !== cand.modeId || prev.generation !== cand.generation) {
        captures = [...next];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures = [];
      refresh();
    });

    function refresh() {
      const sim = simulateDnaReplicationMeselson({
        mode: modeIndex,
        generation,
        fidelityStep,
      });

      const cmpText =
        captures.length >= 2
          ? 'Contrasting replication states captured for comparison: ' +
            compareMeselsonTrials(captures[captures.length - 2], captures[captures.length - 1]).summary
          : 'Tap "Capture trial" on two contrasting generations or hypotheses to compare CsCl density bands.';

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Replication Fork & Daughter Duplex Pool
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 310, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 310, 336, 10);
        ctx.stroke();

        draw.text(ctx, sim.shortModeLabel, 169, 30, {
          size: 11.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `Gen ${sim.generation} (${sim.timeMinutesEColi} min in ¹⁴N) · ${sim.totalDuplexes} duplex(es)`,
          169,
          46,
          {
            size: 9.4,
            color: c.muted,
            align: 'center',
          }
        );

        // Draw Replication Fork (8 base pairs)
        const seq = sim.templateStrand.slice(0, 8);
        const comp = sim.complementaryStrand.slice(0, 8);
        const unzipped = Math.min(8, sim.forkBasesUnzipped);

        for (let i = 0; i < 8; i += 1) {
          const bx = 26 + i * 36;
          const isOpen = i < unzipped;

          // Parental 15N top strand
          ctx.fillStyle = c.proton;
          draw.roundRect(ctx, bx, isOpen ? 62 : 76, 28, 18, 4);
          ctx.fill();
          draw.text(ctx, seq[i], bx + 14, isOpen ? 74 : 88, {
            size: 9.2,
            weight: 700,
            color: c.sheet,
            align: 'center',
          });

          if (isOpen) {
            // New 14N partner on top duplex
            ctx.fillStyle = c.electron;
            draw.roundRect(ctx, bx, 84, 28, 18, 4);
            ctx.fill();
            draw.text(ctx, comp[i], bx + 14, 96, {
              size: 9.2,
              weight: 700,
              color: c.sheet,
              align: 'center',
            });

            // New 14N partner on bottom duplex
            ctx.fillStyle = c.electron;
            draw.roundRect(ctx, bx, 110, 28, 18, 4);
            ctx.fill();
            draw.text(ctx, seq[i], bx + 14, 122, {
              size: 9.2,
              weight: 700,
              color: c.sheet,
              align: 'center',
            });

            // Parental 15N bottom strand
            ctx.fillStyle = c.proton;
            draw.roundRect(ctx, bx, 132, 28, 18, 4);
            ctx.fill();
            draw.text(ctx, comp[i], bx + 14, 144, {
              size: 9.2,
              weight: 700,
              color: c.sheet,
              align: 'center',
            });
          } else {
            // Still zipped bottom strand
            ctx.fillStyle = c.proton;
            draw.roundRect(ctx, bx, 104, 28, 18, 4);
            ctx.fill();
            draw.text(ctx, comp[i], bx + 14, 116, {
              size: 9.2,
              weight: 700,
              color: c.sheet,
              align: 'center',
            });
          }
        }

        // Fork & Strand Telemetry Box inside Left Card
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 162, 290, 174, 8);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 24, 162, 290, 174, 8);
        ctx.stroke();

        const leftRows = [
          ['Helicase unzipped', `${sim.forkBasesUnzipped}/12 bp (${sim.hydrogenBondsUnzipped} H-bonds)`],
          ['Parental ¹⁵N strands', `${sim.heavySingleStrands} strands conserved`],
          ['New ¹⁴N strands', `${sim.lightSingleStrands} strands synthesised`],
          ['Polymerase step', `Step ${sim.fidelityStep} (10^${sim.errorExponent} err/bp)`],
          ['Errors / division', `~${sim.errorsPerHumanDivision} in 6.4 × 10⁹ bp`],
          ['Active origins', `${sim.originsActive.toLocaleString()} replication bubbles`],
          ['Model vs 1958 Data', sim.matchesExperiment ? 'CONFIRMED' : 'FALSIFIED'],
        ];

        leftRows.forEach(([k, v], i) => {
          const ry = 182 + i * 22;
          draw.text(ctx, k, 34, ry, { size: 9.2, color: c.muted, align: 'left' });
          draw.text(ctx, v, 304, ry, {
            size: 9.2,
            weight: 700,
            color: i === 6 ? (sim.matchesExperiment ? c.green : c.proton) : c.ink,
            align: 'right',
          });
        });

        // Right Card: CsCl Ultracentrifuge Tubes (140,000 × g)
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 334, 12, 292, 232, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 334, 12, 292, 232, 10);
        ctx.stroke();

        draw.text(ctx, 'CsCl Density Gradient (140,000 × g)', 480, 30, {
          size: 11.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const yLight = 92;
        const yHybrid = 132;
        const yHeavy = 172;

        draw.text(ctx, '1.710 Light', 344, yLight + 3, { size: 8.8, weight: 700, color: c.electron, align: 'left' });
        draw.text(ctx, '1.717 Hybrid', 344, yHybrid + 3, { size: 8.8, weight: 700, color: c.green, align: 'left' });
        draw.text(ctx, '1.724 Heavy', 344, yHeavy + 3, { size: 8.8, weight: 700, color: c.proton, align: 'left' });

        // Tube 1: Selected Model
        const txA = 432;
        draw.text(ctx, 'Selected Model', txA + 34, 54, { size: 9.2, weight: 700, color: c.ink, align: 'center' });
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, txA, 62, 68, 134, 14);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, txA, 62, 68, 134, 14);
        ctx.stroke();

        sim.bands.forEach((b) => {
          const tNorm = (b.densityGPerCm3 - 1.710) / (1.724 - 1.710);
          const by = yLight + tNorm * (yHeavy - yLight);
          const bh = Math.max(6, Math.round((b.fractionPct / 100) * 14));
          ctx.fillStyle = b.kind === 'light' ? c.electron : b.kind === 'heavy' ? c.proton : c.green;
          draw.roundRect(ctx, txA + 8, by - bh / 2, 52, bh, 3);
          ctx.fill();
        });

        // Tube 2: Actual 1958 E. coli Data
        const txB = 532;
        draw.text(ctx, '1958 E. coli Data', txB + 34, 54, { size: 9.2, weight: 700, color: c.green, align: 'center' });
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, txB, 62, 68, 134, 14);
        ctx.fill();
        ctx.strokeStyle = c.green;
        draw.roundRect(ctx, txB, 62, 68, 134, 14);
        ctx.stroke();

        const act = sim.actualSemiConservative;
        if (act.heavyPct > 0) {
          ctx.fillStyle = c.proton;
          draw.roundRect(ctx, txB + 8, yHeavy - 7, 52, 14, 3);
          ctx.fill();
        }
        if (act.hybridPct > 0) {
          const bh = Math.max(6, Math.round((act.hybridPct / 100) * 14));
          ctx.fillStyle = c.green;
          draw.roundRect(ctx, txB + 8, yHybrid - bh / 2, 52, bh, 3);
          ctx.fill();
        }
        if (act.lightPct > 0) {
          const bh = Math.max(6, Math.round((act.lightPct / 100) * 14));
          ctx.fillStyle = c.electron;
          draw.roundRect(ctx, txB + 8, yLight - bh / 2, 52, bh, 3);
          ctx.fill();
        }

        draw.text(
          ctx,
          `${sim.heavyPct.toFixed(0)}%H / ${sim.hybridPct.toFixed(0)}%Hyb / ${sim.lightPct.toFixed(0)}%L`,
          txA + 34,
          212,
          { size: 8.6, weight: 700, color: c.ink, align: 'center' }
        );
        draw.text(
          ctx,
          `${act.heavyPct.toFixed(0)}%H / ${act.hybridPct.toFixed(0)}%Hyb / ${act.lightPct.toFixed(0)}%L`,
          txB + 34,
          212,
          { size: 8.6, weight: 700, color: c.green, align: 'center' }
        );
        draw.text(ctx, 'Law: Hybrid = 2 / 2ᵍ = 1 / 2ᵍ⁻¹', 480, 232, {
          size: 9.0,
          weight: 600,
          color: c.muted,
          align: 'center',
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
          draw.text(ctx, 'Tap "Capture trial" on two generations', 480, 294, {
            size: 9.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Gen 1 Hybrid vs Gen 2 Split).', 480, 312, {
            size: 9.2,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 294 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} Gen ${cap.generation} (${cap.shortModeLabel}): ${cap.hybridPct.toFixed(1)}% Hyb, ${cap.lightPct.toFixed(1)}% Lt`,
              480,
              cy,
              {
                size: 8.8,
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
            `#${cap.trialNumber} Gen ${cap.generation} ${cap.shortModeLabel} (${cap.heavyPct.toFixed(0)}%H/${cap.hybridPct.toFixed(1)}%Hyb/${cap.lightPct.toFixed(1)}%L)`
        )
        .join(' | ');

      say(
        `${sim.modeLabel} · Generation ${sim.generation} (${sim.timeMinutesEColi} min in ¹⁴N, ${sim.totalDuplexes} duplexes, ${sim.heavySingleStrands} old ¹⁵N : ${sim.lightSingleStrands} new ¹⁴N strands): Heavy 1.724 g/cm³ = ${sim.heavyPct.toFixed(1)}%, Hybrid 1.717 g/cm³ = ${sim.hybridPct.toFixed(1)}%, Light 1.710 g/cm³ = ${sim.lightPct.toFixed(1)}% · ${sim.fidelityLabel} (error rate 10^${sim.errorExponent}/base, ~${sim.errorsPerHumanDivision} errors per division across ${sim.originsActive.toLocaleString()} origins). ${sim.falsificationStatus} ${cmpText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate semi-conservative DNA replication & Meselson–Stahl (1958) CsCl centrifugation',
    three: false,
    static: true,
  }
);
