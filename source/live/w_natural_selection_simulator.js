// Chapter 14 Widget 2: Natural Selection Simulator (0610 Topic 18.3).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  SELECTION_MODES,
  SELECTION_PRESSURE_STEPS,
  simulateNaturalSelection,
  captureSelectionTrial,
  compareSelectionTrials,
} from './selection_model.js';

Live.register(
  'natural_selection_simulator',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let pressureStep = 3;
    let generationStep = 5;
    let capturedTrials = [];
    let probeStep = null; // 0..10 interactive Data Probe

    const view = makeCanvas(
      api,
      640,
      360,
      'Natural selection simulator: continuous drug exposure vs drug removal, Biston betularia melanism, malaria HbS balancing selection, interactive Data Probe, and stochastic drift replicates'
    );

    const say = api.readout();
    const trials = api.trials({
      columns: ['#', 'Scenario', 'Pressure', 'Step', 'Favoured %', 'Wild %'],
      maxRows: 6,
      allowNoise: true,
      noiseLabel: 'Stochastic drift (5 replicates)',
      onNoiseChange: () => refresh(),
      plotColumn: 'Favoured %',
    });

    const tabs = api.tabs(
      SELECTION_MODES.map((m) => m.shortLabel),
      (idx) => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const pressureSlider = api.slider('Selection pressure', {
      min: 1,
      max: 4,
      step: 1,
      value: pressureStep,
      fmt: (v) => ['0%', '40%', '80%', '100%'][v - 1] || '80%',
      onInput: (v) => {
        pressureStep = Math.round(v);
        refresh();
      },
    });

    const genSlider = api.slider('Generation or model step', {
      min: 0,
      max: 10,
      step: 1,
      value: generationStep,
      fmt: (v) => `S${Math.round(v)}/10`,
      onInput: (v) => {
        generationStep = Math.round(v);
        refresh();
      },
    });

    function applyPreset(mIdx, pStep, gStep) {
      modeIndex = mIdx;
      pressureStep = pStep;
      generationStep = gStep;
      tabs.setActive(modeIndex);
      pressureSlider.set(pressureStep);
      genSlider.set(generationStep);
      refresh();
    }

    api.button('Continuous exposure', () => applyPreset(0, 3, 10));
    api.button('Remove after step 3', () => applyPreset(1, 3, 10));
    api.button('Sooty Bark Moths', () => applyPreset(2, 4, 8));
    api.button('Malaria Belt (HbS)', () => applyPreset(3, 4, 9));

    api.button('Capture trial', () => {
      const state = simulateNaturalSelection({ modeIndex, pressureStep, generationStep });
      const cap = captureSelectionTrial(state);
      const prev = capturedTrials[capturedTrials.length - 1];
      if (
        !prev ||
        prev.modeId !== cap.modeId ||
        prev.pressureStep !== cap.pressureStep ||
        prev.generationStep !== cap.generationStep
      ) {
        const nextIdx = trials.rows().length + 1;
        capturedTrials = [...capturedTrials.slice(-3), { ...cap, trialNumber: nextIdx }];
        const pt = pointMetrics(state);
        trials.record([
          nextIdx,
          state.mode.shortLabel,
          state.pressure.shortLabel,
          `S${state.generationStep}`,
          `${pt.favouredPct}%`,
          `${pt.wildPct}%`,
        ]);
      }
      refresh();
    });

    api.button('Clear trials', () => {
      capturedTrials = [];
      trials.clear();
      refresh();
    });

    const plotX = 48;
    const plotY = 72;
    const plotW = 304;
    const plotH = 188;

    const handleProbe = (e) => {
      const { x: lx, y: ly } = api.pointerXY(view, e);
      if (lx >= plotX && lx <= plotX + plotW && ly >= plotY - 8 && ly <= plotY + plotH + 14) {
        probeStep = Math.max(0, Math.min(10, Math.round(((lx - plotX) / plotW) * 10)));
        refresh();
      }
    };
    view.cv.style.cursor = 'crosshair';
    view.cv.addEventListener('pointerdown', handleProbe);
    view.cv.addEventListener('pointermove', (e) => {
      if (e.buttons) handleProbe(e);
    });

    api.reset(() => {
      modeIndex = 0;
      pressureStep = 3;
      generationStep = 5;
      capturedTrials = [];
      probeStep = null;
      tabs.setActive(0);
      pressureSlider.set(3);
      genSlider.set(5);
      trials.clear();
      refresh();
    });

    api.io({
      getState: () => ({
        modeIndex,
        pressureStep,
        generationStep,
        probeStep,
        stochasticDrift: trials.noise,
        capturedCount: capturedTrials.length,
      }),
      setState: (patch = {}) => {
        if (typeof patch.modeIndex === 'number') { modeIndex = patch.modeIndex; tabs.setActive(modeIndex); }
        if (typeof patch.pressureStep === 'number') { pressureStep = patch.pressureStep; pressureSlider.set(pressureStep); }
        if (typeof patch.generationStep === 'number') { generationStep = patch.generationStep; genSlider.set(generationStep); }
        if (typeof patch.probeStep === 'number' || patch.probeStep === null) probeStep = patch.probeStep;
        if (typeof patch.stochasticDrift === 'boolean') trials.setNoise(patch.stochasticDrift);
        refresh();
      },
    });

    function pointMetrics(pt) {
      if (pt.modeIndex === 0 || pt.modeIndex === 1) {
        return {
          favouredPct: pt.resistantPct,
          wildPct: pt.susceptiblePct,
          loadPct: Math.round((pt.totalCount / 1000) * 100),
          status: `Expected cells: ${pt.totalCount}`,
        };
      }
      if (pt.modeIndex === 2) {
        return {
          favouredPct: pt.darkCarbonariaPct,
          wildPct: pt.paleTypicaPct,
          loadPct: 100,
          status: pt.pressureStep === 1 ? 'Pale typica favoured' : 'Dark carbonaria favoured',
        };
      }
      return {
        favouredPct: pt.hbsAllelePct,
        wildPct: pt.hbaAllelePct,
        carrierPct: pt.carrierHbASPct,
        loadPct: 100,
        status: pt.pressureStep === 1 ? 'HbA directional' : 'HbAHbS balanced',
      };
    }

    function refresh() {
      const state = simulateNaturalSelection({ modeIndex, pressureStep, generationStep });
      const cur = pointMetrics(state);
      const traj = [];
      for (let g = 0; g <= 10; g += 1) {
        traj.push(pointMetrics(simulateNaturalSelection({ modeIndex, pressureStep, generationStep: g })));
      }
      const cmpObj =
        capturedTrials.length >= 2
          ? compareSelectionTrials(
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

        // Left Card: Trajectory Plot Across Steps 0..10 + Allele Proportion Strip
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.stroke();

        const titleMap = [
          'Illustrative Culture: Continuous Drug Exposure',
          'Illustrative Culture: Drug Removed After Step 3',
          'Peppered Moth (Biston betularia): Dark vs Pale Morph %',
          'Balancing Selection: HbS Allele (q) & Carrier % (2pq)',
        ];
        draw.text(ctx, titleMap[modeIndex], 194, 30, {
          size: 9.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `${state.pressure.shortLabel} · ${state.timeLabel} (Step ${state.generationStep}/10)`, 194, 44, {
          size: 8.2,
          color: c.muted,
          align: 'center',
        });

        // Inline curve legend cleanly above plot area (y = 58)
        const legA = modeIndex === 3 ? 'HbS allele q' : 'Favoured %';
        const legB = modeIndex <= 1 ? 'Total pop.' : modeIndex === 3 ? 'Carrier 2pq' : 'Wild-type %';
        draw.text(ctx, `— ${legA}`, 76, 59, { size: 7.8, weight: 700, color: c.proton, align: 'left' });
        draw.text(ctx, `— ${legB}`, 196, 59, { size: 7.8, weight: 700, color: modeIndex === 2 ? c.green : c.electron, align: 'center' });
        if (trials.noise) {
          draw.text(ctx, '~ Drift (5×)', 326, 59, { size: 7.8, weight: 600, color: c.muted, align: 'right' });
        }

        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(plotX, plotY);
        ctx.lineTo(plotX, plotY + plotH);
        ctx.lineTo(plotX + plotW, plotY + plotH);
        ctx.stroke();

        const maxY = modeIndex === 3 ? 30 : 100;
        draw.text(ctx, `${maxY}%`, plotX - 6, plotY + 8, { size: 8.0, color: c.muted, align: 'right' });
        draw.text(ctx, `${Math.round(maxY / 2)}%`, plotX - 6, plotY + plotH * 0.52, {
          size: 8.0,
          color: c.muted,
          align: 'right',
        });
        draw.text(ctx, '0%', plotX - 6, plotY + plotH, { size: 8.0, color: c.muted, align: 'right' });

        // 5 stochastic drift replicates when enabled
        if (trials.noise) {
          for (let rep = 0; rep < 5; rep++) {
            const rGen = api.rng(9001 + modeIndex * 101 + pressureStep * 17 + rep * 37);
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = c.proton;
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 1.2;
            let drift = 0;
            traj.forEach((pt, idx) => {
              if (idx > 0) drift += (rGen() - 0.5) * (maxY === 30 ? 3.2 : 9.5);
              const val = Math.max(0, Math.min(maxY, pt.favouredPct + drift));
              const px = plotX + (idx / 10) * plotW;
              const py = plotY + plotH - (val / maxY) * plotH;
              if (idx === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();
          }
        }

        if (modeIndex === 0 || modeIndex === 1) {
          ctx.beginPath();
          ctx.strokeStyle = c.electron;
          ctx.lineWidth = 2.2;
          traj.forEach((pt, idx) => {
            const px = plotX + (idx / 10) * plotW;
            const py = plotY + plotH - (Math.min(100, pt.loadPct) / 100) * plotH;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = c.proton;
          ctx.lineWidth = 2.2;
          traj.forEach((pt, idx) => {
            const px = plotX + (idx / 10) * plotW;
            const py = plotY + plotH - (Math.min(100, pt.favouredPct) / 100) * plotH;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();

          if (modeIndex === 1) {
            const stopX = plotX + (3 / 10) * plotW;
            ctx.strokeStyle = c.proton;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(stopX, plotY);
            ctx.lineTo(stopX, plotY + plotH);
            ctx.stroke();
            ctx.setLineDash([]);
            draw.text(ctx, 'Drug removed', stopX + 6, plotY + 14, {
              size: 8.0,
              weight: 700,
              color: c.proton,
              align: 'left',
            });
          }
        } else if (modeIndex === 2) {
          ctx.beginPath();
          ctx.strokeStyle = c.green;
          ctx.lineWidth = 2.0;
          traj.forEach((pt, idx) => {
            const px = plotX + (idx / 10) * plotW;
            const py = plotY + plotH - (pt.wildPct / 100) * plotH;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = c.proton;
          ctx.lineWidth = 2.4;
          traj.forEach((pt, idx) => {
            const px = plotX + (idx / 10) * plotW;
            const py = plotY + plotH - (pt.favouredPct / 100) * plotH;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.strokeStyle = c.proton;
          ctx.lineWidth = 2.4;
          traj.forEach((pt, idx) => {
            const px = plotX + (idx / 10) * plotW;
            const py = plotY + plotH - (Math.min(30, pt.favouredPct) / 30) * plotH;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = c.electron;
          ctx.lineWidth = 2.0;
          traj.forEach((pt, idx) => {
            const px = plotX + (idx / 10) * plotW;
            const py = plotY + plotH - (Math.min(30, pt.carrierPct) / 30) * plotH;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
        }

        // Interactive Data Probe crosshair
        if (probeStep != null) {
          const pPt = traj[probeStep];
          const px = plotX + (probeStep / 10) * plotW;
          const py = plotY + plotH - (Math.min(maxY, pPt.favouredPct) / maxY) * plotH;
          ctx.strokeStyle = c.neutron;
          ctx.lineWidth = 1.3;
          ctx.setLineDash([3, 2]);
          ctx.beginPath();
          ctx.moveTo(px, plotY);
          ctx.lineTo(px, plotY + plotH);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(px, py, 4.4, 0, Math.PI * 2);
          ctx.fillStyle = c.neutron;
          ctx.fill();
          draw.text(
            ctx,
            `Probe S${probeStep}: Favoured ${pPt.favouredPct}% · Wild ${pPt.wildPct}%`,
            194,
            plotY + 11,
            { size: 8.2, weight: 700, color: c.neutron, align: 'center' }
          );
        }

        // Current step dot
        const curX = plotX + (state.generationStep / 10) * plotW;
        const curY = plotY + plotH - (Math.min(maxY, cur.favouredPct) / maxY) * plotH;
        ctx.beginPath();
        ctx.arc(curX, curY, 5.2, 0, Math.PI * 2);
        ctx.fillStyle = c.proton;
        ctx.fill();

        for (let s = 0; s <= 10; s += 2) {
          const sx = plotX + (s / 10) * plotW;
          draw.text(ctx, `S${s}`, sx, plotY + plotH + 13, { size: 8.0, color: c.ink, align: 'center' });
        }

        // Allele / Hardy–Weinberg Proportion Strip (y = 284..296)
        const barW = 304;
        const barY = 284;
        let favFrac = Math.max(0, Math.min(1, cur.favouredPct / 100));
        let carFrac = 0;
        let wildFrac = Math.max(0, 1 - favFrac);
        let qHw = favFrac, pHw = 1 - favFrac;
        if (modeIndex === 3) {
          qHw = Math.max(0, Math.min(1, cur.favouredPct / 100));
          pHw = 1 - qHw;
          favFrac = qHw * qHw;      // HbS/HbS
          carFrac = 2 * pHw * qHw;  // HbA/HbS carriers
          wildFrac = pHw * pHw;     // HbA/HbA
        }
        ctx.fillStyle = c.proton;
        ctx.fillRect(plotX, barY, barW * favFrac, 12);
        if (carFrac > 0) {
          ctx.fillStyle = c.electron;
          ctx.fillRect(plotX + barW * favFrac, barY, barW * carFrac, 12);
        }
        ctx.fillStyle = c.green;
        ctx.fillRect(plotX + barW * (favFrac + carFrac), barY, barW * wildFrac, 12);
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        ctx.strokeRect(plotX, barY, barW, 12);

        const legText =
          modeIndex === 0 || modeIndex === 1
            ? `Total load: ${state.totalCount} cells | Resistant: ${state.resistantPct}%`
            : modeIndex === 2
            ? `Dark carbonaria: ${state.darkCarbonariaPct}% | Pale typica: ${state.paleTypicaPct}%`
            : `HbS/HbS q²=${(favFrac * 100).toFixed(1)}% | Carriers 2pq=${(carFrac * 100).toFixed(1)}% | HbA/HbA p²=${(wildFrac * 100).toFixed(1)}%`;
        draw.text(ctx, legText, 194, 316, { size: modeIndex === 3 ? 7.8 : 8.4, weight: 700, color: c.ink, align: 'center' });
        draw.text(ctx, 'Tap/drag chart to probe any generation step', 194, 334, { size: 7.8, color: c.muted, align: 'center' });

        // Top-Right Card: Step Snapshot & 6-Step Causal Chain
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Selection Ledger & 6 Steps', 505, 30, {
          size: 10.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Scenario', state.mode.shortLabel],
          ['Pressure', state.pressure.shortLabel],
          ['Timepoint', `${state.timeLabel} (S${state.generationStep})`],
          ['Favoured %', `${cur.favouredPct}%`],
          ['Wild-type %', `${cur.wildPct}%`],
          ['Pop. load', modeIndex <= 1 ? `${state.totalCount} cells` : '100% stable'],
          ['Status', cur.status],
        ];
        rows.forEach(([k, v], idx) => {
          const ry = 56 + idx * 25;
          draw.text(ctx, k, 396, ry, { size: 8.4, color: c.muted, align: 'left' });
          draw.text(ctx, v, 614, ry, { size: 8.4, weight: 700, color: c.ink, align: 'right' });
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
          draw.text(ctx, 'Capture continuous exposure', 505, 294, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'and drug removal to compare.', 505, 312, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
        } else {
          capturedTrials.slice(-2).forEach((cap, idx) => {
            const cy = 292 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.modeLabel} (${cap.timeLabel})`,
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
          ? ` Contrasting natural selection trials captured for comparison: ${cmpObj.summary}`
          : ' Tap "Capture trial" on two contrasting scenarios or steps to compare.';

      say(
        `${state.mode.label} (${state.pressure.label}, step ${state.generationStep}/10, favoured allele/morph = ${cur.favouredPct}%, wild-type = ${cur.wildPct}%, status = ${cur.status}): ${state.readout}${compText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Explore illustrative culture selection (no clinical days), peppered moths & HbS malaria selection',
    three: false,
    static: true,
  }
);
