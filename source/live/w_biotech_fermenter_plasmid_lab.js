// Chapter 15 Widget 3: Recombinant Human Insulin Plasmid, Industrial Fermenter, Yeast/Enzymes & CRISPR Lab (0610 Topics 21.1, 21.2, 21.3).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  BIOTECH_MODES,
  simulateBiotechFermenterPlasmid,
  captureBiotechTrial,
  compareBiotechTrials,
} from './biosphere_biotech_model.js';

Live.register(
  'biotech_fermenter_plasmid_lab',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let primaryParam = 90;
    let secondaryParam = 80;
    let capturedTrials = [];

    const modeLabels = [
      'Recombinant Insulin',
      'Industrial Fermenter',
      'Yeast & Enzymes',
      'GM Crops & CRISPR',
    ];

    const view = makeCanvas(
      api,
      640,
      360,
      'Five-step recombinant plasmid human insulin pipeline, six controlled industrial fermenter variables, yeast and enzyme biotechnology, and GM crops vs CRISPR-Cas9'
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

    const primSlider = api.slider('Ligase or temp or pest', {
      min: 0,
      max: 100,
      step: 5,
      value: primaryParam,
      fmt: (v) => `${Math.round(v)}%`,
      onInput: (v) => {
        primaryParam = Math.round(v);
        refresh();
      },
    });

    const secSlider = api.slider('Culture or O₂ or refuge', {
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

    function applyPreset(mIdx, pVal, sVal) {
      modeIndex = mIdx;
      primaryParam = pVal;
      secondaryParam = sVal;
      tabs.setActive(modeIndex);
      primSlider.set(primaryParam);
      secSlider.set(secondaryParam);
      refresh();
    }

    api.button('Matched EcoRI + Ligase', () => applyPreset(0, 90, 80));
    api.button('Fermenter 37 °C Opt.', () => applyPreset(1, 45, 90));
    api.button('Overheated 55 °C', () => applyPreset(1, 80, 40));
    api.button('Bt Cotton + Refuge', () => applyPreset(3, 75, 30));

    api.button('Capture trial', () => {
      const mode = BIOTECH_MODES[modeIndex] || 'recombinant_insulin';
      const cap = captureBiotechTrial({ mode, primaryParam, secondaryParam });
      const prev = capturedTrials[capturedTrials.length - 1];
      if (
        !prev ||
        prev.mode !== cap.mode ||
        prev.primaryParam !== cap.primaryParam ||
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
      const mode = BIOTECH_MODES[modeIndex] || 'recombinant_insulin';
      const sim = simulateBiotechFermenterPlasmid({
        mode,
        primaryParam,
        secondaryParam,
      });
      const cmpObj =
        capturedTrials.length >= 2
          ? compareBiotechTrials(
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

        if (sim.mode === 'recombinant_insulin') {
          draw.text(
            ctx,
            `5-Step Recombinant Human Insulin Pipeline (${sim.cultureHours} h)`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            sim.sameRestrictionEnzyme
              ? 'Same restriction enzyme creates complementary sticky ends'
              : 'Mismatched cut ends: sticky ends cannot base-pair',
            194,
            46,
            {
              size: 8.0,
              weight: 600,
              color: sim.sameRestrictionEnzyme ? c.green : c.proton,
              align: 'center',
            }
          );

          let sy = 58;
          for (const st of sim.pipelineSteps) {
            ctx.fillStyle = st.active
              ? 'rgba(21, 128, 61, 0.14)'
              : 'rgba(220, 38, 38, 0.14)';
            draw.roundRect(ctx, 26, sy, 336, 48, 6);
            ctx.fill();
            draw.text(ctx, st.title, 34, sy + 18, {
              size: 8.3,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            draw.text(ctx, st.detail, 34, sy + 35, {
              size: 7.5,
              color: c.muted,
              align: 'left',
            });
            sy += 55;
          }
        } else if (sim.mode === 'industrial_fermenter') {
          draw.text(
            ctx,
            `Industrial Fermenter Vessel (Temp: ${sim.tempC} °C, pH: ${sim.culturePh})`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            sim.denatured
              ? 'Alert: Broth > 45 °C denatures microbial enzymes'
              : `Cooling jacket removes ${sim.coolingHeatRemovedKw} kW respiratory heat`,
            194,
            46,
            {
              size: 8.0,
              weight: 600,
              color: sim.denatured ? c.proton : c.green,
              align: 'center',
            }
          );

          const conds = [
            ['1. Steam sterilization', 'Kills competing foreign bacteria/fungi'],
            ['2. Nutrient inlets', 'Glucose (C) + NH₄⁺/amino acids (N)'],
            ['3. Water-cooled jacket', `Holds ${sim.tempC} °C; prevents denaturation`],
            ['4. pH probe + acid/alkali', `Maintains pH ${sim.culturePh} optimum`],
            ['5. Sterile air sparger', `Bubbles ${sim.dissolvedO2Pct}% O₂ for aerobic ATP`],
            ['6. Stirring paddles', `Mixes broth → ${sim.productYieldGL} g L⁻¹ yield`],
          ];

          let cy = 62;
          for (const [title, desc] of conds) {
            ctx.fillStyle = sim.denatured
              ? 'rgba(220, 38, 38, 0.12)'
              : 'rgba(37, 99, 235, 0.12)';
            draw.roundRect(ctx, 26, cy, 336, 40, 5);
            ctx.fill();
            draw.text(ctx, title, 34, cy + 16, {
              size: 8.4,
              weight: 700,
              color: c.ink,
              align: 'left',
            });
            draw.text(ctx, desc, 34, cy + 31, {
              size: 7.6,
              color: c.muted,
              align: 'left',
            });
            cy += 46;
          }
        } else if (sim.mode === 'yeast_enzyme_biotech') {
          draw.text(
            ctx,
            `Yeast & Enzyme Applications (${sim.tempC} °C, Load: ${sim.enzymeLoadingPct}%)`,
            194,
            30,
            { size: 9.8, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Washing powders, pectinase juice clarity, alginate lactase & yeast CO₂',
            194,
            46,
            { size: 8.0, weight: 600, color: c.electron, align: 'center' }
          );

          const items = [
            {
              label: '1. Biological washing powder (protease/lipase)',
              val: `${sim.washStainRemovalPct}% stains removed`,
              frac: sim.washStainRemovalPct / 100,
              col: c.electron,
            },
            {
              label: '2. Pectinase fruit juice extraction & clarity',
              val: `${sim.pectinaseYieldMl} mL (${sim.juiceClarityPct}% clear)`,
              frac: sim.juiceClarityPct / 100,
              col: c.green,
            },
            {
              label: '3. Immobilised lactase in alginate beads',
              val: `${sim.lactoseHydrolysedPct}% lactose hydrolysed`,
              frac: sim.lactoseHydrolysedPct / 100,
              col: c.green,
            },
            {
              label: '4. Yeast bread dough CO₂ rise (ethanol evaporates)',
              val: `${sim.yeastDoughCo2Cm3} cm³ CO₂`,
              frac: Math.min(1, sim.yeastDoughCo2Cm3 / 180),
              col: c.proton,
            },
          ];

          let y = 74;
          for (const it of items) {
            draw.text(ctx, `${it.label}: ${it.val}`, 30, y, {
              size: 8.1,
              weight: 600,
              color: c.ink,
              align: 'left',
            });
            ctx.fillStyle = it.col;
            ctx.globalAlpha = 0.78;
            ctx.fillRect(30, y + 6, Math.max(8, Math.round(it.frac * 320)), 16);
            ctx.globalAlpha = 1;
            y += 58;
          }

          draw.text(
            ctx,
            `Residual ethanol in baked bread: ${sim.ethanolRemainingInBreadPct}% (evaporates in oven)`,
            194,
            328,
            { size: 8.1, weight: 700, color: c.ink, align: 'center' }
          );
        } else {
          // gm_crops_crispr
          draw.text(
            ctx,
            `GM Crops (Bt Cotton & Golden Rice) vs CRISPR (Pest: ${sim.pestPressurePct}%)`,
            194,
            30,
            { size: 9.6, weight: 700, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Selective breeding vs transgenic GM vs programmable CRISPR-Cas9',
            194,
            46,
            { size: 8.0, weight: 600, color: c.green, align: 'center' }
          );

          const mrows = [
            {
              label: `Bt cotton yield (${sim.refugePct}% non-Bt refuge)`,
              val: `${sim.btCropYieldTonsHa} t ha⁻¹`,
              frac: sim.btCropYieldTonsHa / 4,
              col: c.green,
            },
            {
              label: 'Conventional cotton yield under bollworm',
              val: `${sim.conventionalYieldTonsHa} t ha⁻¹`,
              frac: sim.conventionalYieldTonsHa / 4,
              col: c.electron,
            },
            {
              label: 'Reduction in chemical insecticide sprays',
              val: `${sim.insecticideReductionPct}%`,
              frac: sim.insecticideReductionPct / 100,
              col: c.green,
            },
            {
              label: 'Selection risk for Bt-resistant caterpillars',
              val: `${sim.pestResistanceRiskPct}%`,
              frac: sim.pestResistanceRiskPct / 100,
              col: c.proton,
            },
          ];

          let y = 74;
          for (const r of mrows) {
            draw.text(ctx, `${r.label}: ${r.val}`, 30, y, {
              size: 8.2,
              weight: 600,
              color: c.ink,
              align: 'left',
            });
            ctx.fillStyle = r.col;
            ctx.globalAlpha = 0.78;
            ctx.fillRect(30, y + 6, Math.max(8, Math.round(r.frac * 320)), 16);
            ctx.globalAlpha = 1;
            y += 58;
          }

          draw.text(
            ctx,
            'Golden Rice: 35 μg g⁻¹ provitamin A · CRISPR: gRNA + Cas9 exact locus cut',
            194,
            328,
            { size: 8.0, weight: 700, color: c.electron, align: 'center' }
          );
        }

        // Top-Right Telemetry Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 384, 12, 242, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Biotech & Plasmid Telemetry', 505, 30, {
          size: 9.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows =
          sim.mode === 'recombinant_insulin'
            ? [
                ['Vector system', 'Bacterial Plasmid'],
                ['Restriction cut', sim.sameRestrictionEnzyme ? 'SAME enzyme (EcoRI)' : 'Mismatched ends'],
                ['Sticky-end pairing', `${sim.stickyEndAnnealingPct}%`],
                ['DNA ligase yield', `${sim.recombinantPlasmidPct}% plasmid`],
                ['Binary fission', `${sim.doublings} doublings`],
                ['Human insulin', `${sim.humanInsulinYieldMgL} mg L⁻¹`],
              ]
            : sim.mode === 'industrial_fermenter'
            ? [
                ['Vessel status', sim.denatured ? 'Denatured (>45 °C)' : 'Aseptic Optimum'],
                ['Broth temperature', `${sim.tempC} °C`],
                ['Culture pH', `pH ${sim.culturePh}`],
                ['Dissolved O₂', `${sim.dissolvedO2Pct}%`],
                ['Jacket heat removed', `${sim.coolingHeatRemovedKw} kW`],
                ['Product yield', `${sim.productYieldGL} g L⁻¹`],
              ]
            : sim.mode === 'yeast_enzyme_biotech'
            ? [
                ['Process temp', `${sim.tempC} °C`],
                ['Washing stain', `${sim.washStainRemovalPct}% removed`],
                ['Pectinase juice', `${sim.pectinaseYieldMl} mL (${sim.juiceClarityPct}%)`],
                ['Alginate lactase', `${sim.lactoseHydrolysedPct}% hydrolysed`],
                ['Yeast dough CO₂', `${sim.yeastDoughCo2Cm3} cm³`],
                ['Baked bread ethanol', `${sim.ethanolRemainingInBreadPct}%`],
              ]
            : [
                ['Crop comparison', 'Bt vs Conventional'],
                ['Bt cotton yield', `${sim.btCropYieldTonsHa} t ha⁻¹`],
                ['Conv. cotton yield', `${sim.conventionalYieldTonsHa} t ha⁻¹`],
                ['Spray reduction', `-${sim.insecticideReductionPct}%`],
                ['Resistance risk', `${sim.pestResistanceRiskPct}%`],
                ['Golden Rice Vit. A', '35 μg g⁻¹ β-carotene'],
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
          draw.text(ctx, 'Tap "Capture trial" on two', 505, 294, {
            size: 8.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'biotech settings to compare.', 505, 312, {
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
          ? ` Contrasting biotechnology trials captured for comparison: Δprimary = ${cmpObj.deltaHeadline}, Δsecondary = ${cmpObj.deltaSecondary}.`
          : ' Tap "Capture trial" on two conditions to compare.';

      say(`${modeLabels[modeIndex]} · ${sim.summaryText}${compText}`);
    }

    refresh();
    return {};
  },
  {
    label: 'Explore recombinant human insulin plasmids, industrial fermenter controls, yeast/enzyme biotech & CRISPR-Cas9',
    three: false,
    static: true,
  }
);
