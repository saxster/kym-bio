// Chapter 15 Widget 2: Nitrogen Cycle, Legume Nodules, 7-Step Eutrophication Cascade, Carbon Keeling & Deforestation Lab (0610 Topics 19.3, 20.2, 20.3).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  NUTRIENT_MODES,
  simulateNutrientCyclesEutrophication,
  captureNutrientTrial,
  compareNutrientTrials,
} from './biosphere_biotech_model.js';

Live.register(
  'nutrient_cycles_eutrophication',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let primaryLevel = 80;
    let secondaryLevel = 85;
    let capturedTrials = [];

    const modeLabels = [
      'Nitrogen & Legumes',
      'Eutrophication',
      'Carbon & Keeling',
      'Deforestation',
    ];

    const view = makeCanvas(
      api,
      640,
      360,
      'Nitrogen cycle four bacterial guilds and legume nodules, 7-step Powai Lake eutrophication cascade, carbon cycle and Keeling CO2 curve, and Western Ghats deforestation'
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

    const primSlider = api.slider('Legume or runoff load', {
      min: 0,
      max: 100,
      step: 10,
      value: primaryLevel,
      fmt: (v) => `${Math.round(v)}%`,
      onInput: (v) => {
        primaryLevel = Math.round(v);
        refresh();
      },
    });

    const secSlider = api.slider('Aeration or sink cover', {
      min: 0,
      max: 100,
      step: 10,
      value: secondaryLevel,
      fmt: (v) => `${Math.round(v)}%`,
      onInput: (v) => {
        secondaryLevel = Math.round(v);
        refresh();
      },
    });

    function applyPreset(mIdx, pVal, sVal) {
      modeIndex = mIdx;
      primaryLevel = pVal;
      secondaryLevel = sVal;
      tabs.setActive(modeIndex);
      primSlider.set(primaryLevel);
      secSlider.set(secondaryLevel);
      refresh();
    }

    api.button('Aerated Legumes', () => applyPreset(0, 80, 90));
    api.button('Waterlogged Paddy', () => applyPreset(0, 30, 10));
    api.button('Powai Eutrophication', () => applyPreset(1, 90, 20));
    api.button('Ghats Deforestation', () => applyPreset(3, 80, 80));

    api.button('Capture trial', () => {
      const mode = NUTRIENT_MODES[modeIndex] || 'nitrogen_legumes';
      const cap = captureNutrientTrial({ mode, primaryLevel, secondaryLevel });
      const prev = capturedTrials[capturedTrials.length - 1];
      if (
        !prev ||
        prev.mode !== cap.mode ||
        prev.primaryLevel !== cap.primaryLevel ||
        prev.secondaryLevel !== cap.secondaryLevel
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
      const mode = NUTRIENT_MODES[modeIndex] || 'nitrogen_legumes';
      const sim = simulateNutrientCyclesEutrophication({
        mode,
        primaryLevel,
        secondaryLevel,
      });
      const cmpObj =
        capturedTrials.length >= 2
          ? compareNutrientTrials(
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

        // Left Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 360, 336, 10);
        ctx.stroke();

        if (sim.mode === 'nitrogen_legumes') {
          draw.text(
            ctx,
            `Nitrogen Cycle Guilds (Nodules: ${sim.nodulePct}%, Aeration: ${sim.aerationPct}%)`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            sim.dominantProcess,
            194,
            46,
            {
              size: 8.2,
              weight: 600,
              color: sim.aerationPct < 30 ? c.proton : c.green,
              align: 'center',
            }
          );

          const bars = [
            {
              label: '1. Rhizobium N₂ fixation (N₂ → NH₄⁺)',
              val: `${sim.rhizobiumFixationKgHa} kg ha⁻¹`,
              frac: sim.rhizobiumFixationKgHa / 180,
              col: c.green,
            },
            {
              label: '2. Decomposer ammonification (→ NH₄⁺)',
              val: `${sim.ammonificationKgHa} kg ha⁻¹`,
              frac: sim.ammonificationKgHa / 180,
              col: c.electron,
            },
            {
              label: '3. Aerobic nitrification (NH₄⁺ → NO₂⁻ → NO₃⁻)',
              val: `${sim.nitrificationFluxKgHa} kg ha⁻¹`,
              frac: sim.nitrificationFluxKgHa / 180,
              col: c.green,
            },
            {
              label: '4. Anaerobic denitrification (NO₃⁻ → N₂ gas)',
              val: `${sim.denitrificationLossKgHa} kg ha⁻¹`,
              frac: sim.denitrificationLossKgHa / 180,
              col: c.proton,
            },
          ];

          let y = 72;
          for (const b of bars) {
            draw.text(ctx, `${b.label}: ${b.val}`, 30, y, {
              size: 8.3,
              weight: 600,
              color: c.ink,
              align: 'left',
            });
            ctx.fillStyle = b.col;
            ctx.globalAlpha = 0.78;
            ctx.fillRect(30, y + 6, Math.max(8, Math.round(b.frac * 320)), 16);
            ctx.globalAlpha = 1;
            y += 56;
          }

          draw.text(
            ctx,
            `Soil NO₃⁻: ${sim.soilNitrateMgKg} mg kg⁻¹ · Crop protein: ${sim.plantProteinYieldKgHa} kg ha⁻¹`,
            194,
            328,
            { size: 8.3, weight: 700, color: c.electron, align: 'center' }
          );
        } else if (sim.mode === 'eutrophication_cascade') {
          draw.text(
            ctx,
            `Powai Lake 7-Step Eutrophication Cascade (Runoff: ${sim.runoffPct}%)`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Aerobic decomposer bacteria respiring dead plants strip dissolved O₂',
            194,
            46,
            { size: 8.0, weight: 600, color: c.proton, align: 'center' }
          );

          let sy = 58;
          for (const st of sim.steps) {
            ctx.fillStyle =
              st.step >= 5 ? 'rgba(220, 38, 38, 0.14)' : 'rgba(37, 99, 235, 0.12)';
            draw.roundRect(ctx, 26, sy, 336, 36, 5);
            ctx.fill();
            draw.text(ctx, st.label, 34, sy + 14, {
              size: 8.1,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            draw.text(ctx, st.value, 354, sy + 14, {
              size: 8.0,
              weight: 700,
              color: st.step >= 5 ? c.proton : c.electron,
              align: 'right',
            });
            draw.text(
              ctx,
              st.step === 5
                ? 'Bacteria multiply on dead detritus & respire aerobically'
                : st.step === 6
                ? 'High biochemical oxygen demand (BOD) causes hypoxia'
                : 'Causal step in aquatic cascade',
              34,
              sy + 28,
              { size: 7.3, color: c.muted, align: 'left' }
            );
            sy += 40;
          }
        } else if (sim.mode === 'carbon_keeling') {
          draw.text(
            ctx,
            `Carbon Cycle & Enhanced Greenhouse (CO₂: ${sim.atmosphericCo2Ppm} ppm)`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Photosynthesis removes CO₂; respiration, decay & combustion add CO₂',
            194,
            46,
            { size: 8.0, weight: 600, color: c.green, align: 'center' }
          );

          const cbars = [
            { label: 'Photosynthesis uptake (removes CO₂)', val: `${sim.photosynthesisDrawdownGtC} Gt C`, frac: sim.photosynthesisDrawdownGtC / 140, col: c.green },
            { label: 'Plant, animal & microbe respiration', val: `${sim.plantAnimalMicrobeRespGtC} Gt C`, frac: sim.plantAnimalMicrobeRespGtC / 140, col: c.electron },
            { label: 'Fossil-fuel combustion release', val: `${sim.fossilCombustionGtC} Gt C`, frac: sim.fossilCombustionGtC / 15, col: c.proton },
            { label: 'Deforestation & burning release', val: `${sim.deforestationReleaseGtC} Gt C`, frac: sim.deforestationReleaseGtC / 15, col: c.proton },
          ];

          let cy = 74;
          for (const b of cbars) {
            draw.text(ctx, `${b.label}: ${b.val}`, 30, cy, {
              size: 8.3,
              weight: 600,
              color: c.ink,
              align: 'left',
            });
            ctx.fillStyle = b.col;
            ctx.globalAlpha = 0.78;
            ctx.fillRect(30, cy + 6, Math.max(8, Math.round(b.frac * 320)), 16);
            ctx.globalAlpha = 1;
            cy += 56;
          }

          draw.text(
            ctx,
            `CH₄: ${sim.methanePpb} ppb (cattle, rice paddies, landfills) · +${sim.tempAnomalyC} °C`,
            194,
            328,
            { size: 8.2, weight: 700, color: c.proton, align: 'center' }
          );
        } else {
          // deforestation_impact
          draw.text(
            ctx,
            `Four Effects of Deforestation (${sim.clearedPct}% Canopy Cleared)`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Biodiversity loss, soil erosion, river flooding & atmospheric CO₂ rise',
            194,
            46,
            { size: 8.0, weight: 600, color: c.proton, align: 'center' }
          );

          const dbars = [
            { label: '1. Species biodiversity retained', val: `${sim.biodiversityRetainedPct}%`, frac: sim.biodiversityRetainedPct / 100, col: c.green },
            { label: '2. Topsoil erosion loss', val: `${sim.soilErosionTonsHa} t ha⁻¹`, frac: Math.min(1, sim.soilErosionTonsHa / 70), col: c.proton },
            { label: '3. Surface runoff & siltation flood index', val: `${sim.floodRunoffIndex}/100`, frac: sim.floodRunoffIndex / 100, col: c.proton },
            { label: '4. Canopy transpiration return', val: `${sim.transpirationReturnPct}%`, frac: sim.transpirationReturnPct / 100, col: c.electron },
          ];

          let dy = 74;
          for (const b of dbars) {
            draw.text(ctx, `${b.label}: ${b.val}`, 30, dy, {
              size: 8.3,
              weight: 600,
              color: c.ink,
              align: 'left',
            });
            ctx.fillStyle = b.col;
            ctx.globalAlpha = 0.78;
            ctx.fillRect(30, dy + 6, Math.max(8, Math.round(b.frac * 320)), 16);
            ctx.globalAlpha = 1;
            dy += 56;
          }

          draw.text(
            ctx,
            `Net carbon released: ${sim.netCarbonReleaseTonsHa} t C ha⁻¹ · Leached NO₃⁻: ${sim.nitrateLeachingKgHa} kg ha⁻¹`,
            194,
            328,
            { size: 8.1, weight: 700, color: c.proton, align: 'center' }
          );
        }

        // Top-Right Telemetry Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Cycle & Impact Telemetry', 505, 30, {
          size: 9.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows =
          sim.mode === 'nitrogen_legumes'
            ? [
                ['Cycle focus', 'Nitrogen Cycle (19.3)'],
                ['Rhizobium fixation', `${sim.rhizobiumFixationKgHa} kg ha⁻¹`],
                ['Nitrification (O₂)', `${sim.nitrificationFluxKgHa} kg ha⁻¹`],
                ['Denitrification', `${sim.denitrificationLossKgHa} kg ha⁻¹`],
                ['Soil nitrate [NO₃⁻]', `${sim.soilNitrateMgKg} mg kg⁻¹`],
                ['Crop protein yield', `${sim.plantProteinYieldKgHa} kg ha⁻¹`],
              ]
            : sim.mode === 'eutrophication_cascade'
            ? [
                ['Pollution focus', 'Eutrophication (20.3)'],
                ['Nitrate [NO₃⁻]', `${sim.nitrateMgL} mg L⁻¹`],
                ['Underwater light', `${sim.underwaterLightPct}%`],
                ['Bacterial BOD', `${sim.aerobicBacteriaBodMgL} mg L⁻¹`],
                ['Dissolved O₂ (DO)', `${sim.dissolvedOxygenMgL} mg L⁻¹`],
                ['Fish survival', `${sim.fishSurvivalPct}%`],
              ]
            : sim.mode === 'carbon_keeling'
            ? [
                ['Cycle focus', 'Carbon & Climate'],
                ['Atmospheric CO₂', `${sim.atmosphericCo2Ppm} ppm`],
                ['Methane (CH₄)', `${sim.methanePpb} ppb`],
                ['Photosynthesis sink', `${sim.photosynthesisDrawdownGtC} Gt C`],
                ['Fossil combustion', `${sim.fossilCombustionGtC} Gt C`],
                ['Warming anomaly', `+${sim.tempAnomalyC} °C`],
              ]
            : [
                ['Habitat focus', 'Deforestation (20.2)'],
                ['Canopy cleared', `${sim.clearedPct}%`],
                ['Biodiversity kept', `${sim.biodiversityRetainedPct}%`],
                ['Topsoil erosion', `${sim.soilErosionTonsHa} t ha⁻¹`],
                ['Flood runoff index', `${sim.floodRunoffIndex}/100`],
                ['Net C released', `${sim.netCarbonReleaseTonsHa} t ha⁻¹`],
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
          draw.text(ctx, 'Tap "Capture trial" on two soil', 505, 294, {
            size: 8.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'or runoff states to compare.', 505, 312, {
            size: 8.2,
            color: c.muted,
            align: 'center',
          });
        } else {
          capturedTrials.slice(-2).forEach((cap, idx) => {
            const cy = 292 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.mode}: ${cap.headlineMetric} (${cap.secondaryMetric})`,
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
          ? ` Contrasting nutrient or eutrophication trials captured for comparison: Δprimary = ${cmpObj.deltaHeadline}, Δsecondary = ${cmpObj.deltaSecondary}.`
          : ' Tap "Capture trial" on two states to compare.';

      say(`${modeLabels[modeIndex]} · ${sim.summaryText}${compText}`);
    }

    refresh();
    return {};
  },
  {
    label: 'Explore nitrogen cycle bacterial guilds, legume nodules, Powai Lake eutrophication, Keeling CO₂ & deforestation',
    three: false,
    static: true,
  }
);
