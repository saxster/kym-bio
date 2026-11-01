// Chapter 14 Widget 3: Adaptive Features, Selective Breeding & DNA Clock (0610 Topics 18.2, 18.3 & 1.2).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  ADAPTATION_MODES,
  simulateAdaptiveSelective,
  captureAdaptationTrial,
  compareAdaptationTrials,
} from './selection_model.js';

Live.register(
  'adaptive_features_selective_breeding',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let stressOrGenStep = 3;
    let featureOrLineageStep = 2;
    let capturedTrials = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Xerophyte and hydrophyte adaptive features, 40-generation selective breeding trajectories, and synthetic homologous DNA and protein comparisons'
    );

    const say = api.readout();
    const tabs = api.tabs(
      ADAPTATION_MODES.map((m) => m.shortLabel),
      (idx) => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const stressSlider = api.slider('Stress or generation', {
      min: 1,
      max: 5,
      step: 1,
      value: stressOrGenStep,
      fmt: (v) => `S${Math.round(v)}/5`,
      onInput: (v) => {
        stressOrGenStep = Math.round(v);
        refresh();
      },
    });

    const featureSlider = api.slider('Feature or lineage', {
      min: 1,
      max: 4,
      step: 1,
      value: featureOrLineageStep,
      fmt: (v) => `F${Math.round(v)}/4`,
      onInput: (v) => {
        featureOrLineageStep = Math.round(v);
        refresh();
      },
    });

    function applyPreset(mIdx, sStep, fStep) {
      modeIndex = mIdx;
      stressOrGenStep = sStep;
      featureOrLineageStep = fStep;
      tabs.setActive(modeIndex);
      stressSlider.set(stressOrGenStep);
      featureSlider.set(featureOrLineageStep);
      refresh();
    }

    api.button('Marram Grass (Arid)', () => applyPreset(0, 4, 1));
    api.button('Water Lily (Aquatic)', () => applyPreset(1, 3, 3));
    api.button('Gir Cattle (Gen 40)', () => applyPreset(2, 5, 1));
    api.button('Synthetic DNA examples', () => applyPreset(3, 4, 1));

    api.button('Capture trial', () => {
      const state = simulateAdaptiveSelective({
        modeIndex,
        stressOrGenStep,
        profileStep: featureOrLineageStep,
      });
      const cap = captureAdaptationTrial(state);
      const prev = capturedTrials[capturedTrials.length - 1];
      if (
        !prev ||
        prev.modeId !== cap.modeId ||
        prev.stressOrGenStep !== cap.stressOrGenStep ||
        prev.profileStep !== cap.profileStep
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
      const state = simulateAdaptiveSelective({
        modeIndex,
        stressOrGenStep,
        profileStep: featureOrLineageStep,
      });
      const cmpObj =
        capturedTrials.length >= 2
          ? compareAdaptationTrials(
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

        // Left Card: Plant Anatomy / Selective Breeding Bar Chart / Molecular Clock
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.stroke();

        if (modeIndex === 0 || modeIndex === 1) {
          const prof = state.profile;
          const isXero = modeIndex === 0;
          draw.text(ctx, prof.name, 194, 30, {
            size: 9.6,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(
            ctx,
            isXero
              ? `Xerophyte Adaptive Features · Aridity Step ${state.stressOrGenStep}/5`
              : `Hydrophyte Adaptive Features · Submergence Step ${state.stressOrGenStep}/5`,
            194,
            46,
            {
              size: 8.4,
              color: isXero ? c.proton : c.electron,
              align: 'center',
            }
          );

          const featureCards = [
            ['Illustrative cuticle', `${prof.cuticleThicknessUm} µm waterproof barrier`],
            ['Stomatal distribution', prof.stomataLocation],
            ['Leaf surface & trichomes', prof.leafHairs],
            ['Aerenchyma & xylem', `${prof.aerenchymaPct}% air spaces · ${prof.xylemSupport}`],
          ];

          featureCards.forEach(([title, desc], idx) => {
            const by = 64 + idx * 58;
            const isSel = idx + 1 === state.profileStep;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, 28, by, 332, 50, 7);
            ctx.fill();
            ctx.strokeStyle = isSel ? (isXero ? c.proton : c.electron) : c.rule;
            ctx.lineWidth = isSel ? 1.8 : 1;
            draw.roundRect(ctx, 28, by, 332, 50, 7);
            ctx.stroke();

            draw.text(ctx, `${idx + 1}. ${title}`, 38, by + 18, {
              size: 8.6,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            draw.text(ctx, desc, 38, by + 37, {
              size: 7.5,
              color: c.muted,
              align: 'left',
            });
          });

          draw.text(
            ctx,
            `Transpiration: ${state.plantTranspirationRate} vs ${state.mesophyteTranspirationRate} mg/(dm²·h) (${state.waterSavedPct}% saved)`,
            194,
            326,
            { size: 8.2, weight: 700, color: c.ink, align: 'center' }
          );
        } else if (modeIndex === 2) {
          const lin = state.lineage;
          draw.text(ctx, lin.name, 194, 30, {
            size: 9.6,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, `Metric: ${lin.unit} Across 40 Selective Generations`, 194, 46, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });

          const plotX = 52;
          const plotY = 66;
          const plotW = 296;
          const plotH = 210;

          ctx.strokeStyle = c.rule;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(plotX, plotY);
          ctx.lineTo(plotX, plotY + plotH);
          ctx.lineTo(plotX + plotW, plotY + plotH);
          ctx.stroke();

          const maxVal = lin.genValues[4] * 1.12;
          const slotW = plotW / 5;
          const gTags = ['G1', 'G5', 'G10', 'G20', 'G40'];

          lin.genValues.forEach((val, idx) => {
            const isCur = idx + 1 === state.stressOrGenStep;
            const bh = (val / maxVal) * plotH;
            const bx = plotX + idx * slotW + 10;
            const bw = slotW - 20;
            const by = plotY + plotH - bh;

            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, bx, by, bw, bh, 4);
            ctx.fill();
            ctx.strokeStyle = isCur ? c.proton : c.electron;
            ctx.lineWidth = isCur ? 2.0 : 1.3;
            draw.roundRect(ctx, bx, by, bw, bh, 4);
            ctx.stroke();

            draw.text(ctx, `${val}`, bx + bw / 2, by - 5, {
              size: 8.4,
              weight: 700,
              color: isCur ? c.proton : c.ink,
              align: 'center',
            });
            draw.text(ctx, gTags[idx], bx + bw / 2, plotY + plotH + 14, {
              size: 8.2,
              color: c.ink,
              align: 'center',
            });
          });

          draw.text(
            ctx,
            `${state.currentGenLabel}: ${state.currentValue} ${lin.unit} (+${state.pctGain}%) | H = ${state.heterozygosity}`,
            194,
            326,
            { size: 8.4, weight: 700, color: c.proton, align: 'center' }
          );
        } else {
          draw.text(ctx, 'Illustrative Homologous Sequence Comparisons', 194, 30, {
            size: 9.6,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'Count differences; dates require calibrated rate models', 194, 46, {
            size: 8.4,
            color: c.electron,
            align: 'center',
          });

          state.allTaxa.forEach((tx, idx) => {
            const by = 60 + idx * 50;
            const isSel = idx + 1 === state.stressOrGenStep;
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, 28, by, 332, 43, 6);
            ctx.fill();
            ctx.strokeStyle = isSel ? c.electron : c.rule;
            ctx.lineWidth = isSel ? 1.8 : 1;
            draw.roundRect(ctx, 28, by, 332, 43, 6);
            ctx.stroke();

            draw.text(ctx, `X vs ${tx.shortName}`, 38, by + 16, {
              size: 8.4,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            draw.text(ctx, `DNA ${tx.alignedDnaSimilarityPct}% | 200 bases`, 350, by + 16, {
              size: 8.0,
              weight: 700,
              color: c.electron,
              align: 'right',
            });
            draw.text(
              ctx,
              `Cyt c diffs: ${tx.cytochromeCDiffsOutOf104}/104 aa | HBB diffs: ${tx.betaGlobinDiffsOutOf146}/146 aa`,
              38,
              by + 33,
              { size: 8.0, color: c.muted, align: 'left' }
            );
          });

          draw.text(ctx, 'Synthetic DNA/protein alignments; no measured species or dates', 194, 326, {
            size: 8.2,
            weight: 600,
            color: c.ink,
            align: 'center',
          });
        }

        // Top-Right Card: Quantitative Ledger
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Adaptation & Clock Ledger', 505, 30, {
          size: 10.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows =
          modeIndex === 0 || modeIndex === 1
            ? [
                ['Plant species', state.profile.shortName],
                ['Cuticle', `${state.profile.cuticleThicknessUm} µm`],
                ['Aerenchyma', `${state.profile.aerenchymaPct}% vol`],
                ['Root O₂ (mud)', `${state.rootO2InMudPct}% sat`],
                ['Turgor', `${state.leafTurgorPct}%`],
                ['Transpiration', `${state.plantTranspirationRate} mg`],
                ['Water saved', `${state.waterSavedPct}%`],
              ]
            : modeIndex === 2
            ? [
                ['Lineage', state.lineage.shortName],
                ['Generation', state.currentGenLabel],
                ['Mean trait', `${state.currentValue} ${state.lineage.unit}`],
                ['Gain vs G1', `+${state.pctGain}%`],
                ['Heterozygosity', `H = ${state.heterozygosity}`],
                ['Agent', 'Human breeders'],
                ['Risk', 'Inbreeding (aa)'],
              ]
            : [
                ['Taxon', state.taxon.shortName],
                ['Cyt c diffs', `${state.taxon.cytochromeCDiffsOutOf104} / 104 aa`],
                ['HBB diffs', `${state.taxon.betaGlobinDiffsOutOf146} / 146 aa`],
                ['Aligned DNA', `${state.taxon.alignedDnaSimilarityPct}%`],
                ['Dates', 'Not inferred'],
                ['Sahni fossil', 'Pentoxyleae (Jur)'],
                ['Woese 1977', '3 rRNA Domains'],
              ];

        rows.forEach(([k, v], idx) => {
          const ry = 56 + idx * 25;
          draw.text(ctx, k, 396, ry, { size: 8.4, color: c.muted, align: 'left' });
          draw.text(ctx, v, 614, ry, { size: 8.2, weight: 700, color: c.ink, align: 'right' });
        });

        // Bottom-Right Card: Captured Trials
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
          draw.text(ctx, 'Tap "Capture trial" on Xerophyte', 505, 294, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'vs Hydrophyte or Breeding.', 505, 312, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
        } else {
          capturedTrials.slice(-2).forEach((cap, idx) => {
            const cy = 292 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.modeLabel} (S${cap.stressOrGenStep}/F${cap.profileStep})`,
              505,
              cy,
              {
                size: 8.2,
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
          ? ` Contrasting adaptation or breeding trials captured for comparison: ${cmpObj.summary}`
          : ' Tap "Capture trial" on two contrasting plant, breeding, or clock states to compare.';

      say(
        `${state.mode.label} (molecular clock & adaptation lab, step ${state.stressOrGenStep}/5, focus ${state.profileStep}/4): ${state.readout}${compText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Compare xerophyte & hydrophyte adaptations, 40-generation selective breeding & DNA molecular clocks',
    three: false,
    static: true,
  }
);
