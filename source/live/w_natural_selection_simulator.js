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

    const view = makeCanvas(
      api,
      640,
      360,
      'Natural selection simulator: completed 7-day antibiotic course vs Day 3 relapse, Biston betularia industrial melanism and Clean Air recovery, and malaria HbS balancing selection'
    );

    const say = api.readout();
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

    const genSlider = api.slider('Generation or day step', {
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

    api.button('Full 7-Day Course', () => applyPreset(0, 3, 10));
    api.button('Stop on Day 3 (Relapse)', () => applyPreset(1, 3, 10));
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
        capturedTrials = [...capturedTrials.slice(-3), { ...cap, trialNumber: capturedTrials.length + 1 }];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      capturedTrials = [];
      refresh();
    });

    function pointMetrics(pt) {
      if (pt.modeIndex === 0 || pt.modeIndex === 1) {
        return {
          favouredPct: pt.resistantPct,
          wildPct: pt.susceptiblePct,
          loadPct: Math.round((pt.totalCount / 1000) * 100),
          status: pt.infectionCleared ? 'Cleared (0 cells)' : pt.relapseOccurred ? 'Superbug relapse' : `${pt.totalCount} cells active`,
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

        // Left Card: Trajectory Plot Across Steps 0..10
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.stroke();

        const titleMap = [
          'Completed 7-Day Course: Bacterial Load & Resistant %',
          'Stopped Early on Day 3: Resistant Relapse Trajectory',
          'Peppered Moth (Biston betularia): Dark vs Pale Morph %',
          'Balancing Selection: HbS Allele (q) & Carrier % (2pq)',
        ];
        draw.text(ctx, titleMap[modeIndex], 194, 30, {
          size: 9.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `${state.pressure.shortLabel} · ${state.timeLabel} (Step ${state.generationStep}/10)`, 194, 46, {
          size: 8.4,
          color: c.muted,
          align: 'center',
        });

        const plotX = 48;
        const plotY = 64;
        const plotW = 304;
        const plotH = 216;

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
            draw.text(ctx, 'Stopped Day 3', stopX + 6, plotY + 14, {
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

        // Current step dot
        const curX = plotX + (state.generationStep / 10) * plotW;
        const curY = plotY + plotH - (Math.min(maxY, cur.favouredPct) / maxY) * plotH;
        ctx.beginPath();
        ctx.arc(curX, curY, 5.2, 0, Math.PI * 2);
        ctx.fillStyle = c.proton;
        ctx.fill();

        for (let s = 0; s <= 10; s += 2) {
          const sx = plotX + (s / 10) * plotW;
          draw.text(ctx, `S${s}`, sx, plotY + plotH + 14, { size: 8.0, color: c.ink, align: 'center' });
        }

        const legText =
          modeIndex === 0 || modeIndex === 1
            ? `Total load: ${state.totalCount} cells | Resistant: ${state.resistantPct}%`
            : modeIndex === 2
            ? `Dark carbonaria: ${state.darkCarbonariaPct}% | Pale typica: ${state.paleTypicaPct}%`
            : `HbS allele q: ${state.hbsAllelePct}% | Carriers (HbAHbS): ${state.carrierHbASPct}%`;
        draw.text(ctx, legText, 194, 326, { size: 8.4, weight: 700, color: c.ink, align: 'center' });

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
          draw.text(ctx, 'Tap "Capture trial" on Full Course', 505, 294, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'vs Day 3 Stop or Moths to compare.', 505, 312, {
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
    label: 'Simulate antibiotic resistance (7-day course vs Day 3 stop), peppered moths & HbS malaria selection',
    three: false,
    static: true,
  }
);
