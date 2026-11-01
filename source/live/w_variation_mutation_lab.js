// Chapter 14 Widget 1: Variation & Mutation Lab (0610 Topic 18.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  VARIATION_MODES,
  VARIATION_TRAITS,
  MUTAGEN_ENVIRONMENT_STEPS,
  LEDERBERG_REPLICA_COLONIES,
  simulateVariationMutation,
  captureVariationTrial,
  compareVariationTrials,
} from './selection_model.js';

Live.register(
  'variation_mutation_lab',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let traitStep = 1;
    let envStep = 1;
    let capturedTrials = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Continuous vs discontinuous variation distributions, Lederberg 1952 replica-plating proof, mutagen dose multipliers, and four sources of variation'
    );

    const say = api.readout();
    const tabs = api.tabs(
      VARIATION_MODES.map((m) => m.shortLabel),
      (idx) => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const traitSlider = api.slider('Variation trait focus', {
      min: 1,
      max: 4,
      step: 1,
      value: traitStep,
      fmt: (v) => ['Height', 'Mass', 'ABO', 'Pea'][v - 1] || 'Height',
      onInput: (v) => {
        traitStep = Math.round(v);
        refresh();
      },
    });

    const envSlider = api.slider('Mutagen or environment', {
      min: 1,
      max: 4,
      step: 1,
      value: envStep,
      fmt: (v) => ['1×', '5×', '20×', '50×'][v - 1] || '1×',
      onInput: (v) => {
        envStep = Math.round(v);
        refresh();
      },
    });

    function applyPreset(mIdx, tStep, eStep) {
      modeIndex = mIdx;
      traitStep = tStep;
      envStep = eStep;
      tabs.setActive(modeIndex);
      traitSlider.set(traitStep);
      envSlider.set(envStep);
      refresh();
    }

    api.button('Height (Continuous)', () => applyPreset(0, 1, 2));
    api.button('ABO Blood (Discontinuous)', () => applyPreset(0, 3, 3));
    api.button('Replica Plate (1952)', () => applyPreset(1, 3, 3));
    api.button('Ionising X-ray (50×)', () => applyPreset(2, 4, 4));

    api.button('Capture trial', () => {
      const state = simulateVariationMutation({ modeIndex, traitStep, envStep });
      const cap = captureVariationTrial(state);
      const prev = capturedTrials[capturedTrials.length - 1];
      if (
        !prev ||
        prev.traitId !== cap.traitId ||
        prev.modeId !== cap.modeId ||
        prev.envLabel !== cap.envLabel
      ) {
        capturedTrials = [...capturedTrials.slice(-3), { ...cap, trialNumber: capturedTrials.length + 1 }];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      capturedTrials = [];
      refresh();
    });

    function refresh() {
      const state = simulateVariationMutation({ modeIndex, traitStep, envStep });
      const cmpObj =
        capturedTrials.length >= 2
          ? compareVariationTrials(
              capturedTrials[capturedTrials.length - 2],
              capturedTrials[capturedTrials.length - 1]
            )
          : null;

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Main Distribution / Experiment Diagram
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.stroke();

        if (modeIndex === 0) {
          const tr = state.trait;
          const isCont = state.isContinuous;
          draw.text(ctx, tr.name, 194, 30, {
            size: 10.0,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(
            ctx,
            isCont
              ? 'Continuous Variation: Polygenic + Environment (Touching Bars)'
              : 'Discontinuous Variation: Single Gene Only (Separated Bars)',
            194,
            46,
            {
              size: 8.4,
              weight: 600,
              color: isCont ? c.electron : c.green,
              align: 'center',
            }
          );

          const plotX = 48;
          const plotY = 66;
          const plotW = 304;
          const plotH = 210;

          ctx.strokeStyle = c.rule;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(plotX, plotY);
          ctx.lineTo(plotX, plotY + plotH);
          ctx.lineTo(plotX + plotW, plotY + plotH);
          ctx.stroke();

          const maxPct = isCont ? 42 : 80;
          draw.text(ctx, `${maxPct}%`, plotX - 6, plotY + 8, { size: 8.0, color: c.muted, align: 'right' });
          draw.text(ctx, `${Math.round(maxPct / 2)}%`, plotX - 6, plotY + plotH * 0.54, {
            size: 8.0,
            color: c.muted,
            align: 'right',
          });
          draw.text(ctx, '0%', plotX - 6, plotY + plotH, { size: 8.0, color: c.muted, align: 'right' });

          const bins = state.bins;
          const nBins = bins.length;

          if (isCont) {
            const barW = plotW / nBins;
            bins.forEach((b, idx) => {
              const bh = Math.min(plotH - 6, (b.pct / maxPct) * plotH);
              const bx = plotX + idx * barW;
              const by = plotY + plotH - bh;
              ctx.fillStyle = c.sheet;
              ctx.fillRect(bx + 1, by, barW - 2, bh);
              ctx.strokeStyle = c.electron;
              ctx.lineWidth = 1.2;
              ctx.strokeRect(bx + 1, by, barW - 2, bh);

              draw.text(ctx, `${b.pct}%`, bx + barW / 2, by - 5, {
                size: 8.0,
                weight: 700,
                color: c.electron,
                align: 'center',
              });
              draw.text(ctx, b.label, bx + barW / 2, plotY + plotH + 14, {
                size: 7.8,
                color: c.ink,
                align: 'center',
              });
            });

            ctx.beginPath();
            ctx.strokeStyle = c.proton;
            ctx.lineWidth = 2.2;
            bins.forEach((b, idx) => {
              const bh = Math.min(plotH - 6, (b.pct / maxPct) * plotH);
              const cx = plotX + (idx + 0.5) * barW;
              const cy = plotY + plotH - bh;
              if (idx === 0) ctx.moveTo(cx, cy);
              else ctx.lineTo(cx, cy);
            });
            ctx.stroke();

            draw.text(
              ctx,
              `Mean: ${state.computedMean} ${tr.unit} (env shift +${state.environmentalShift} ${tr.unit}) | SD ±${tr.sd} ${tr.unit}`,
              194,
              326,
              { size: 8.4, weight: 600, color: c.ink, align: 'center' }
            );
          } else {
            const slotW = plotW / nBins;
            const barW = Math.min(48, slotW * 0.56);
            const cols = [c.electron, c.green, c.proton, c.ink];
            bins.forEach((b, idx) => {
              const bh = Math.min(plotH - 6, (b.pct / maxPct) * plotH);
              const bx = plotX + idx * slotW + (slotW - barW) / 2;
              const by = plotY + plotH - bh;
              ctx.fillStyle = c.sheet;
              draw.roundRect(ctx, bx, by, barW, bh, 4);
              ctx.fill();
              ctx.strokeStyle = cols[idx % cols.length];
              ctx.lineWidth = 1.6;
              draw.roundRect(ctx, bx, by, barW, bh, 4);
              ctx.stroke();

              draw.text(ctx, `${b.pct}%`, bx + barW / 2, by - 5, {
                size: 8.2,
                weight: 700,
                color: cols[idx % cols.length],
                align: 'center',
              });
              draw.text(ctx, b.code || b.label, bx + barW / 2, plotY + plotH + 14, {
                size: 8.0,
                weight: 600,
                color: c.ink,
                align: 'center',
              });
            });

            draw.text(
              ctx,
              'Environment shift: 0% — nutrition never alters single-gene categories',
              194,
              326,
              { size: 8.4, weight: 600, color: c.green, align: 'center' }
            );
          }
        } else if (modeIndex === 1) {
          draw.text(ctx, 'Lederberg & Lederberg (1952) Replica Plating', 194, 30, {
            size: 10.0,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'Master Plate (No Drug) vs Replica Plate (+ Streptomycin)', 194, 46, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });

          const cx1 = 108;
          const cx2 = 280;
          const cy = 166;
          const r = 64;

          ctx.fillStyle = c.sheet;
          ctx.beginPath();
          ctx.arc(cx1, cy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = c.green;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx2, cy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = c.electron;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          draw.text(ctx, 'Master (No Drug)', cx1, cy - r - 10, {
            size: 8.6,
            weight: 700,
            color: c.green,
            align: 'center',
          });
          draw.text(ctx, 'Replica (+ Drug)', cx2, cy - r - 10, {
            size: 8.6,
            weight: 700,
            color: c.electron,
            align: 'center',
          });

          LEDERBERG_REPLICA_COLONIES.forEach((col) => {
            const mx = cx1 + (col.x - 0.5) * r * 1.4;
            const my = cy + (col.y - 0.5) * r * 1.4;
            ctx.beginPath();
            ctx.arc(mx, my, col.resistant ? 5.2 : 3.8, 0, Math.PI * 2);
            ctx.fillStyle = col.resistant ? c.proton : c.green;
            ctx.fill();
            if (col.resistant) {
              draw.text(ctx, `C${col.id}`, mx, my - 8, {
                size: 7.8,
                weight: 700,
                color: c.proton,
                align: 'center',
              });
            }

            const rx = cx2 + (col.x - 0.5) * r * 1.4;
            const ry = cy + (col.y - 0.5) * r * 1.4;
            if (col.resistant) {
              ctx.beginPath();
              ctx.arc(rx, ry, 5.4, 0, Math.PI * 2);
              ctx.fillStyle = c.proton;
              ctx.fill();
              draw.text(ctx, `C${col.id}`, rx, ry - 8, {
                size: 7.8,
                weight: 700,
                color: c.proton,
                align: 'center',
              });
            }
          });

          draw.text(ctx, '12 colonies (C3, C7, C11 mutant)', cx1, cy + r + 18, {
            size: 8.0,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'Same C3, C7, C11 survive drug', cx2, cy + r + 18, {
            size: 8.0,
            weight: 700,
            color: c.proton,
            align: 'center',
          });
          draw.text(
            ctx,
            '100% coordinate match proves mutations pre-exist before antibiotic contact',
            194,
            324,
            { size: 8.2, weight: 600, color: c.ink, align: 'center' }
          );
        } else if (modeIndex === 2) {
          draw.text(ctx, 'Mutagen Dose vs Spontaneous Baseline Rate', 194, 30, {
            size: 10.0,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'HBB Codon 6: CCT GAG GAG (Glu6) → CCT GTG GAG (Val6)', 194, 46, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });

          MUTAGEN_ENVIRONMENT_STEPS.forEach((lvl, idx) => {
            const by = 68 + idx * 58;
            const isSel = lvl.step === state.envStep;
            const col = idx === 0 ? c.green : idx === 1 ? c.electron : c.proton;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, 28, by, 332, 48, 7);
            ctx.fill();
            ctx.strokeStyle = isSel ? col : c.rule;
            ctx.lineWidth = isSel ? 1.8 : 1;
            draw.roundRect(ctx, 28, by, 332, 48, 7);
            ctx.stroke();

            draw.text(ctx, lvl.label, 40, by + 18, {
              size: 8.6,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            const barW = Math.max(12, (lvl.mutagenMultiplier / 50) * 185);
            ctx.fillStyle = col;
            draw.roundRect(ctx, 40, by + 26, barW, 12, 3);
            ctx.fill();

            draw.text(ctx, `${lvl.newMutantsPer10MCells} / 10⁷ cells`, 348, by + 35, {
              size: 8.2,
              weight: 700,
              color: col,
              align: 'right',
            });
          });

          draw.text(ctx, 'Mutagens raise glitch frequency across all loci, never direction.', 194, 326, {
            size: 8.4,
            weight: 600,
            color: c.ink,
            align: 'center',
          });
        } else {
          draw.text(ctx, 'Four Sources of Genetic Variation (0610 18.1.10)', 194, 30, {
            size: 10.0,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'Only DNA Mutation Creates Brand-New Alleles', 194, 46, {
            size: 8.4,
            color: c.proton,
            align: 'center',
          });

          state.variationSources.forEach((src, idx) => {
            const by = 64 + idx * 64;
            const isFocus = idx + 1 === state.traitStep;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, 28, by, 332, 54, 7);
            ctx.fill();
            ctx.strokeStyle = isFocus ? c.electron : c.rule;
            ctx.lineWidth = isFocus ? 1.8 : 1;
            draw.roundRect(ctx, 28, by, 332, 54, 7);
            ctx.stroke();

            draw.text(ctx, `${src.order}. ${src.source}`, 38, by + 18, {
              size: 8.8,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            draw.text(
              ctx,
              src.createsNewAlleles ? 'NEW ALLELES: YES (SOLE SOURCE)' : 'NEW ALLELES: NO (RESHUFFLES)',
              350,
              by + 18,
              {
                size: 7.8,
                weight: 700,
                color: src.createsNewAlleles ? c.proton : c.green,
                align: 'right',
              }
            );
            draw.text(ctx, `Scope: ${src.appliesTo}`, 38, by + 38, {
              size: 8.2,
              color: c.muted,
              align: 'left',
            });
          });
        }

        // Top-Right Summary Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Syllabus & Molecular Ledger', 505, 30, {
          size: 10.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Variation type', state.trait.variationType],
          ['Caused by', state.causedBy],
          [
            'Env shift',
            state.isContinuous ? `+${state.environmentalShift} ${state.trait.unit}` : '0% (fixed)',
          ],
          ['Mutagen level', `${state.env.mutagenMultiplier}× baseline`],
          ['Rate / bp', `${state.env.mutationRatePerBp.toExponential(0)}`],
          ['Mutants / 10⁷', `~${state.env.newMutantsPer10MCells} cells`],
          ['New alleles by', 'Mutation ONLY'],
        ];
        rows.forEach(([k, v], idx) => {
          const ry = 56 + idx * 25;
          draw.text(ctx, k, 396, ry, { size: 8.4, color: c.muted, align: 'left' });
          draw.text(ctx, v, 614, ry, { size: 8.4, weight: 700, color: c.ink, align: 'right' });
        });

        // Bottom-Right Captured Trials Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 250, 242, 98, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 250, 242, 98, 10);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${capturedTrials.length})`, 505, 268, {
          size: 9.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (capturedTrials.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two traits', 505, 294, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'or mutagen doses to compare.', 505, 312, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
        } else {
          capturedTrials.slice(-2).forEach((cap, idx) => {
            const cy = 292 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.traitName} (${cap.envLabel})`,
              505,
              cy,
              {
                size: 8.0,
                weight: 600,
                color: idx === 0 ? c.electron : c.green,
                align: 'center',
              }
            );
          });
        }
      });

      const history = capturedTrials
        .map((cap, idx) => `#${idx + 1} ${cap.summaryTag}`)
        .join(' | ');

      const compText =
        cmpObj && cmpObj.contrasting
          ? ` Contrasting variation or mutation trials captured for comparison: ${cmpObj.summary}`
          : ' Tap "Capture trial" on two contrasting traits or mutagen levels to compare.';

      say(
        `${state.mode.label} · ${state.trait.name} (${state.trait.variationType} variation; ${state.trait.geneticBasis}) · ${state.env.label}. ${state.readout}${compText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Explore continuous vs discontinuous variation, Lederberg 1952 replica plating & mutagen dose rates',
    three: false,
    static: true,
  }
);
