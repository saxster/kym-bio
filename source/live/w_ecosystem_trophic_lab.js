// Chapter 15 Widget 1: Ecosystem Food Webs, Ecological Pyramids, Diet Efficiency & Sigmoid Growth Lab (0610 Topics 19.1, 19.2, 19.4).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  TROPHIC_MODES,
  TROPHIC_PRESETS,
  simulateTrophicEcosystem,
  captureTrophicTrial,
  compareTrophicTrials,
} from './biosphere_biotech_model.js';

Live.register(
  'ecosystem_trophic_lab',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let transferEffPct = 10;
    let secondaryParam = 50;
    let capturedTrials = [];

    const modeLabels = [
      'SGNP Web',
      'Banyan Pyramid',
      'Diet Efficiency',
      'Sigmoid Curve',
    ];

    const view = makeCanvas(
      api,
      640,
      360,
      'SGNP monsoon food web energy flow, banyan tree pyramids of numbers, dry biomass and energy, human plant-vs-livestock dietary efficiency, and 4-phase sigmoid population growth'
    );

    const say = api.readout();
    const tabs = api.tabs(
      modeLabels,
      (idx) => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const effSlider = api.slider('Trophic transfer', {
      min: 5,
      max: 20,
      step: 1,
      value: transferEffPct,
      fmt: (v) => `${Math.round(v)}%`,
      onInput: (v) => {
        transferEffPct = Math.round(v);
        refresh();
      },
    });

    const secSlider = api.slider('Plant share or scale', {
      min: 0,
      max: 100,
      step: 10,
      value: secondaryParam,
      fmt: (v) => `${Math.round(v)}%`,
      onInput: (v) => {
        secondaryParam = Math.round(v);
        refresh();
      },
    });

    function applyPreset(mIdx, effVal, secVal) {
      modeIndex = mIdx;
      transferEffPct = effVal;
      secondaryParam = secVal;
      tabs.setActive(modeIndex);
      effSlider.set(transferEffPct);
      secSlider.set(secondaryParam);
      refresh();
    }

    api.button('SGNP Web (10%)', () => applyPreset(0, 10, 50));
    api.button('Banyan Tree (Inverted)', () => applyPreset(1, 10, 20));
    api.button('Direct Crop Diet (90%)', () => applyPreset(2, 10, 90));
    api.button('Sigmoid Batch (K=680)', () => applyPreset(3, 12, 60));

    api.button('Capture trial', () => {
      const mode = TROPHIC_MODES[modeIndex] || 'sgnp_web';
      const cap = captureTrophicTrial({ mode, transferEffPct, secondaryParam });
      const prev = capturedTrials[capturedTrials.length - 1];
      if (
        !prev ||
        prev.mode !== cap.mode ||
        prev.transferEffPct !== cap.transferEffPct ||
        prev.secondaryParam !== cap.secondaryParam
      ) {
        capturedTrials = [
          ...capturedTrials.slice(-3),
          { ...cap, trialNumber: capturedTrials.length + 1 },
        ];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      capturedTrials = [];
      refresh();
    });

    function refresh() {
      const mode = TROPHIC_MODES[modeIndex] || 'sgnp_web';
      const sim = simulateTrophicEcosystem({
        mode,
        transferEffPct,
        secondaryParam,
      });
      const cmpObj =
        capturedTrials.length >= 2
          ? compareTrophicTrials(
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

        // Left Card: Main Pyramid / Diet / Sigmoid Diagram
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.stroke();

        if (sim.mode === 'sgnp_web') {
          draw.text(
            ctx,
            `SGNP Monsoon Web (${sim.chainLength} Levels, ${sim.transferEffPct}% Transfer)`,
            194,
            30,
            { size: 10.0, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            `Arrows (→) show energy transfer; ${sim.lossPerStepPct}% lost per step as heat & waste`,
            194,
            46,
            { size: 8.2, weight: 600, color: c.green, align: 'center' }
          );

          const activeLevels = sim.levels.slice(0, sim.chainLength);
          const slotH = 54;
          for (let i = 0; i < activeLevels.length; i++) {
            const lv = activeLevels[activeLevels.length - 1 - i];
            const y = 64 + i * slotH;
            const logRatio = Math.max(0.14, Math.pow(lv.energyKj / sim.producerEnergyKj, 0.34));
            const bw = Math.round(logRatio * 310);
            const bx = 194 - bw / 2;

            ctx.fillStyle =
              lv.level === 1
                ? 'rgba(21, 128, 61, 0.20)'
                : lv.level === 2
                ? 'rgba(37, 99, 235, 0.20)'
                : lv.level === 3
                ? 'rgba(217, 119, 6, 0.22)'
                : 'rgba(220, 38, 38, 0.22)';
            draw.roundRect(ctx, bx, y, bw, 42, 6);
            ctx.fill();
            ctx.strokeStyle =
              lv.level === 1 ? c.green : lv.level === 2 ? c.electron : c.proton;
            ctx.stroke();

            draw.text(ctx, `L${lv.level}: ${lv.energyKj} kJ m⁻² yr⁻¹`, 194, y + 17, {
              size: 8.8,
              weight: 700,
              color: c.ink,
              align: 'center',
            });
            draw.text(ctx, `${lv.biomassKg} kg dry mass`, 194, y + 33, {
              size: 7.8,
              color: c.muted,
              align: 'center',
            });
          }

          draw.text(
            ctx,
            sim.topLevelViable
              ? `Level ${sim.chainLength} viable (≥ 8 kJ m⁻² yr⁻¹) · Decomposers get ${sim.totalDecomposerInputKj} kJ`
              : `Level ${sim.chainLength} starves (< 8 kJ m⁻² yr⁻¹): why chains rarely exceed 4–5 levels`,
            194,
            334,
            {
              size: 8.0,
              weight: 700,
              color: sim.topLevelViable ? c.green : c.proton,
              align: 'center',
            }
          );
        } else if (sim.mode === 'banyan_pyramid') {
          draw.text(
            ctx,
            `One Giant Banyan Tree (${sim.treeCount} Tree): Three Pyramids`,
            194,
            30,
            { size: 10.0, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Numbers inverted at base (1 < 8,000); Biomass & Energy upright',
            194,
            46,
            { size: 8.2, weight: 600, color: c.electron, align: 'center' }
          );

          const cols = [
            {
              title: '1. Numbers (Inverted)',
              key: 'numbers',
              unit: '',
              widths: [0.14, 0.92, 0.42, 0.16],
              col: c.proton,
              y0: 64,
            },
            {
              title: '2. Dry Biomass (Upright kg)',
              key: 'biomassKg',
              unit: ' kg',
              widths: [0.92, 0.56, 0.34, 0.16],
              col: c.green,
              y0: 156,
            },
            {
              title: '3. Energy (Always Upright kJ)',
              key: 'energyKj',
              unit: ' kJ',
              widths: [0.94, 0.58, 0.36, 0.18],
              col: c.electron,
              y0: 248,
            },
          ];

          for (const sec of cols) {
            draw.text(ctx, sec.title, 30, sec.y0 + 10, {
              size: 8.4,
              weight: 700,
              color: sec.col,
              align: 'left',
            });
            for (let r = 0; r < 4; r++) {
              const lv = sim.levels[3 - r];
              const by = sec.y0 + 16 + r * 16;
              const bw = Math.round(sec.widths[3 - r] * 210);
              const bx = 240 - bw / 2;
              ctx.fillStyle = sec.col;
              ctx.globalAlpha = 0.24;
              ctx.fillRect(bx, by, bw, 13);
              ctx.globalAlpha = 1;
              draw.text(ctx, `L${lv.level}: ${lv[sec.key]}${sec.unit}`, 240, by + 10, {
                size: 7.4,
                weight: 600,
                color: c.ink,
                align: 'center',
              });
            }
          }
        } else if (sim.mode === 'diet_efficiency') {
          draw.text(
            ctx,
            `Human Diet Efficiency: ${sim.plantSharePct}% Crops vs ${sim.meatSharePct}% Meat`,
            194,
            30,
            { size: 10.0, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Direct crop diet (1 step) is 10× more efficient than livestock meat (2 steps)',
            194,
            46,
            { size: 8.0, weight: 600, color: c.green, align: 'center' }
          );

          const bars = [
            { label: 'Total crop harvest per ha', val: `${sim.cropHarvestKj} kJ`, frac: 1.0, col: c.green },
            { label: `Direct plant food (${sim.plantSharePct}%)`, val: `${sim.cropDirectKj} kJ`, frac: sim.plantSharePct / 100, col: c.green },
            { label: `Fed to livestock (${sim.meatSharePct}%)`, val: `${sim.cropToLivestockKj} kJ`, frac: sim.meatSharePct / 100, col: c.electron },
            { label: 'Lost in livestock heat/faeces/urea', val: `${sim.livestockLossKj} kJ`, frac: sim.livestockLossKj / 10000, col: c.proton },
            { label: 'Assimilated by humans', val: `${sim.totalHumanAssimilatedKj} kJ`, frac: Math.min(1, sim.totalHumanAssimilatedKj / 2000), col: c.green },
          ];

          let y = 70;
          for (const b of bars) {
            draw.text(ctx, `${b.label}: ${b.val}`, 30, y, {
              size: 8.4,
              weight: 600,
              color: c.ink,
              align: 'left',
            });
            ctx.fillStyle = b.col;
            ctx.globalAlpha = 0.75;
            ctx.fillRect(30, y + 6, Math.max(8, Math.round(b.frac * 320)), 16);
            ctx.globalAlpha = 1;
            y += 50;
          }

          draw.text(
            ctx,
            `Supports ${sim.relativePeopleSupported}× as many people per hectare as a 100% meat diet`,
            194,
            332,
            { size: 8.4, weight: 700, color: c.electron, align: 'center' }
          );
        } else {
          // sigmoid_population
          draw.text(
            ctx,
            `Sigmoid (S-Shaped) Population Curve (K = ${sim.carryingCapacityK})`,
            194,
            30,
            { size: 10.0, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            '1. Lag → 2. Exponential (Log) → 3. Stationary (B = D) → 4. Death (D > B)',
            194,
            46,
            { size: 8.0, weight: 600, color: c.electron, align: 'center' }
          );

          const gx = 44, gy = 66, gw = 308, gh = 224;
          ctx.strokeStyle = c.rule;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(gx, gy, gw, gh);

          const maxY = 1050;
          const ky = gy + gh - (sim.carryingCapacityK / maxY) * (gh - 24);
          ctx.strokeStyle = c.green;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(gx, ky);
          ctx.lineTo(gx + gw, ky);
          ctx.stroke();
          ctx.setLineDash([]);

          draw.text(ctx, `Carrying capacity K = ${sim.carryingCapacityK} (B = D)`, gx + 8, Math.max(gy + 14, ky - 6), {
            size: 7.8,
            weight: 700,
            color: c.green,
            align: 'left',
          });

          for (const hMark of [6, 20, 34]) {
            const px = gx + (hMark / 48) * gw;
            ctx.strokeStyle = c.rule;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(px, gy);
            ctx.lineTo(px, gy + gh);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.strokeStyle = c.electron;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          sim.timePoints.forEach((pt, idx) => {
            const px = gx + (pt.hour / 48) * gw;
            const py = gy + gh - (pt.population / maxY) * (gh - 24);
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();

          draw.text(ctx, '1. Lag', gx + 20, gy + 26, { size: 7.6, weight: 700, color: c.electron, align: 'center' });
          draw.text(ctx, '2. Log', gx + 84, gy + 26, { size: 7.6, weight: 700, color: c.green, align: 'center' });
          draw.text(ctx, '3. Stat.', gx + 174, gy + 26, { size: 7.6, weight: 700, color: c.ink, align: 'center' });
          draw.text(ctx, '4. Death', gx + 262, gy + 26, { size: 7.6, weight: 700, color: c.proton, align: 'center' });

          draw.text(
            ctx,
            `Time (0–48 h) · Peak N = ${sim.peakPop} · 48 h Death N = ${sim.finalPop}`,
            194,
            326,
            { size: 8.2, weight: 600, color: c.ink, align: 'center' }
          );
        }

        // Top-Right Telemetry Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Trophic & Population Telemetry', 505, 30, {
          size: 9.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Active mode', modeLabels[modeIndex]],
          ['Trophic transfer', `${sim.transferEffPct}% kept`],
          ['Inter-level loss', `${sim.lossPerStepPct}% heat/waste`],
          [
            'Primary metric',
            sim.mode === 'diet_efficiency'
              ? `${sim.totalHumanAssimilatedKj} kJ`
              : sim.mode === 'sigmoid_population'
              ? `K = ${sim.carryingCapacityK}`
              : `${sim.topLevelEnergyKj} kJ`,
          ],
          [
            'Secondary metric',
            sim.mode === 'diet_efficiency'
              ? `${sim.relativePeopleSupported}× population`
              : sim.mode === 'banyan_pyramid'
              ? `${sim.levels[1].numbers} insects`
              : sim.mode === 'sigmoid_population'
              ? `End N = ${sim.finalPop}`
              : `${sim.totalDecomposerInputKj} kJ decay`,
          ],
          [
            'Syllabus law',
            sim.mode === 'banyan_pyramid'
              ? 'Numbers invert; E upright'
              : sim.mode === 'sigmoid_population'
              ? 'Lag → Log → Stat → Death'
              : 'Energy flows one way',
          ],
        ];

        rows.forEach(([k, v], idx) => {
          const ry = 56 + idx * 28;
          draw.text(ctx, k, 396, ry, { size: 8.2, color: c.muted, align: 'left' });
          draw.text(ctx, v, 614, ry, { size: 8.2, weight: 700, color: c.ink, align: 'right' });
        });

        // Bottom-Right Captured Trials Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 250, 242, 98, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 250, 242, 98, 10);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${capturedTrials.length})`, 505, 268, {
          size: 9.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (capturedTrials.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two modes', 505, 294, {
            size: 8.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'or diet shares to compare.', 505, 312, {
            size: 8.2,
            color: c.muted,
            align: 'center',
          });
        } else {
          capturedTrials.slice(-2).forEach((cap, idx) => {
            const cy = 292 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.mode} (${cap.transferEffPct}%): ${cap.metricPrimary}`,
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

      const compText =
        cmpObj
          ? ` Contrasting trophic or population trials captured for comparison: Δprimary = ${cmpObj.deltaPrimary}, Δsecondary = ${cmpObj.deltaSecondary}.`
          : ' Tap "Capture trial" on two settings to compare.';

      say(`${modeLabels[modeIndex]} · ${sim.summaryText}${compText}`);
    }

    refresh();
    return {};
  },
  {
    label: 'Explore SGNP food webs, banyan pyramids of numbers/biomass/energy, human diet efficiency & 4-phase sigmoid curves',
    three: false,
    static: true,
  }
);
