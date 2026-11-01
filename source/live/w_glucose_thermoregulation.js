// Chapter 10 Widget 1: Skin thermoregulation, Mumbai humidity & pancreatic blood glucose negative feedback (0610 Topic 14.4).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  THERMO_GLUCOSE_MODES,
  thermoGlucoseAccount,
  captureThermoGlucoseTrial,
  compareThermoGlucoseTrials,
} from './homeostasis_model.js';

Live.register(
  'glucose_thermoregulation',
  (stage, params, api) => {
    let modeIndex = 0;
    let ambientTempC = 38;
    let humidityOrMealPct = 65;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Skin thermoregulation, Mumbai humidity and pancreatic blood glucose negative-feedback workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      THERMO_GLUCOSE_MODES,
      idx => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const tempSlider = api.slider('Ambient temperature', {
      min: 10,
      max: 42,
      step: 1,
      value: ambientTempC,
      fmt: v => `${v} °C`,
      onInput: v => {
        ambientTempC = v;
        refresh();
      },
    });

    const pctSlider = api.slider('Humidity or meal', {
      min: 10,
      max: 90,
      step: 5,
      value: humidityOrMealPct,
      fmt: v => `${v}%`,
      onInput: v => {
        humidityOrMealPct = v;
        refresh();
      },
    });

    api.button('Dadar May 38 °C', () => {
      modeIndex = 0;
      ambientTempC = 38;
      humidityOrMealPct = 65;
      tabs.setActive(0);
      tempSlider.set(38);
      pctSlider.set(65);
      refresh();
    });

    api.button('Cold room 15 °C', () => {
      modeIndex = 0;
      ambientTempC = 15;
      humidityOrMealPct = 45;
      tabs.setActive(0);
      tempSlider.set(15);
      pctSlider.set(45);
      refresh();
    });

    api.button('Mango meal', () => {
      modeIndex = 2;
      ambientTempC = 30;
      humidityOrMealPct = 85;
      tabs.setActive(2);
      tempSlider.set(30);
      pctSlider.set(85);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureThermoGlucoseTrial(modeIndex, ambientTempC, humidityOrMealPct);
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const p = thermoGlucoseAccount(modeIndex, ambientTempC, humidityOrMealPct);
      const cmp = compareThermoGlucoseTrials(captures);

      view.draw((ctx, c) => {
        const { draw } = api;

        // Left panel: Skin / Pancreas-Liver Negative Feedback Schematic (x=16..316, y=14..346)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 16, 14, 300, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, `1 · ${p.modeName.toUpperCase()}`, 166, 36, {
          size: 12.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `Ambient ${p.ambientTempC} °C · Slider ${p.humidityOrMealPct}%`, 166, 54, {
          size: 10.8,
          color: c.muted,
          align: 'center',
        });

        if (p.modeIndex <= 1) {
          // Mammalian skin bands: Epidermis, Dermis, Subcutaneous fatty tissue
          ctx.fillStyle = c.plate;
          ctx.strokeStyle = c.rule;
          draw.roundRect(ctx, 30, 68, 272, 28, 6);
          ctx.fill();
          ctx.stroke();
          draw.roundRect(ctx, 30, 100, 272, 118, 6);
          ctx.fill();
          ctx.stroke();
          draw.roundRect(ctx, 30, 222, 272, 30, 6);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, 'Epidermis (sweat pores & hair shaft)', 166, 86, {
            size: 10.2,
            weight: 600,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, 'Dermis (fixed capillaries, arterioles, sweat gland)', 166, 118, {
            size: 10.2,
            weight: 600,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, `Arteriole: ${p.arterioleState}`, 166, 142, {
            size: 10.5,
            weight: 700,
            color: p.ambientTempC >= 30 ? c.electron : c.proton,
            align: 'center',
          });
          draw.text(
            ctx,
            `Diameter ${p.arterioleDiameterPct}% · Flow ${p.surfaceCapillaryFlowMlMin} mL/min`,
            166,
            162,
            { size: 10.2, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            `${p.hairErectorState} · Shiver ${p.shiveringWatts} W`,
            166,
            182,
            { size: 10.0, color: c.muted, align: 'center' }
          );
          draw.text(
            ctx,
            `Wet-bulb ${p.wetBulbC} °C · Dripped sweat ${p.sweatDrippedGH} g/h`,
            166,
            202,
            { size: 10.0, color: c.proton, align: 'center' }
          );
          draw.text(ctx, 'Subcutaneous fatty tissue (thermal insulation)', 166, 241, {
            size: 10.2,
            color: c.muted,
            align: 'center',
          });

          draw.text(
            ctx,
            '0610 Rule: Arterioles dilate/constrict; capillaries NEVER move',
            166,
            276,
            { size: 10.0, weight: 700, color: c.electron, align: 'center' }
          );
          draw.text(
            ctx,
            `Evaporative cooling: ${p.evaporativeCoolingW} W (at 2,420 J/g)`,
            166,
            298,
            { size: 10.2, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            `Core temperature: ${p.coreTempC.toFixed(2)} °C (set point 37.0 °C)`,
            166,
            320,
            { size: 10.6, weight: 700, color: c.photon, align: 'center' }
          );
        } else {
          // Pancreas & Liver Glucose Loop
          ctx.fillStyle = c.plate;
          ctx.strokeStyle = c.rule;
          draw.roundRect(ctx, 30, 68, 272, 74, 6);
          ctx.fill();
          ctx.stroke();
          draw.roundRect(ctx, 30, 152, 272, 82, 6);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, 'Pancreas (Islets of Langerhans)', 166, 88, {
            size: 11.0,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(
            ctx,
            `Insulin ${p.insulinUnitsMl} µU/mL · Glucagon ${p.glucagonPgMl} pg/mL`,
            166,
            108,
            { size: 10.5, weight: 600, color: c.electron, align: 'center' }
          );
          draw.text(
            ctx,
            `Uncompensated glucose load: ${p.uncompensatedGlucoseMmolL.toFixed(2)} mmol/L`,
            166,
            128,
            { size: 10.0, color: c.muted, align: 'center' }
          );

          draw.text(ctx, 'Liver & Muscle Effector Response', 166, 172, {
            size: 11.0,
            weight: 700,
            color: c.ink,
            align: 'center',
          });
          draw.text(ctx, p.liverAction, 166, 194, {
            size: 10.0,
            weight: 600,
            color: c.photon,
            align: 'center',
          });
          draw.text(
            ctx,
            `Net hepatic glycogen rate: ${p.liverGlycogenRateGH >= 0 ? '+' : ''}${p.liverGlycogenRateGH} g/h`,
            166,
            216,
            { size: 10.2, color: c.ink, align: 'center' }
          );

          draw.text(
            ctx,
            `Regulated plasma glucose: ${p.regulatedGlucoseMmolL.toFixed(2)} mmol/L`,
            166,
            262,
            { size: 11.0, weight: 700, color: c.electron, align: 'center' }
          );
          draw.text(
            ctx,
            p.urineGlucoseSpillMgMin > 0
              ? `Model glucose excretion: ${p.urineGlucoseSpillMgMin.toFixed(1)} mg/min glucose loss`
              : 'Model filtered load below recovery capacity',
            166,
            286,
            {
              size: 10.2,
              weight: 600,
              color: p.urineGlucoseSpillMgMin > 0 ? c.proton : c.photon,
              align: 'center',
            }
          );
          draw.text(
            ctx,
            'Insulin is a protein: injected, never swallowed',
            166,
            314,
            { size: 10.0, color: c.muted, align: 'center' }
          );
        }

        // Right panel: Quantitative Homeostasis Ledger & Captured Trials (x=328..624, y=14..346)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 328, 14, 296, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '2 · QUANTITATIVE HOMEOSTASIS LEDGER', 476, 36, {
          size: 12.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Core temperature', `${p.coreTempC.toFixed(2)} °C (set 37.0)`],
          ['Sweat secreted / evap', `${p.sweatSecretedGH} / ${p.sweatEvaporatedGH} g/h`],
          ['Evaporative cooling', `${p.evaporativeCoolingW} W (2,420 J/g)`],
          ['Dry heat loss (+ out)', `${p.dryHeatLossW} W`],
          ['Net core heat storage', `${p.netHeatStorageW >= 0 ? '+' : ''}${p.netHeatStorageW} W`],
          ['Plasma glucose', `${p.regulatedGlucoseMmolL.toFixed(2)} mmol/L`],
          ['Insulin / Glucagon', `${p.insulinUnitsMl} µU / ${p.glucagonPgMl} pg`],
          ['Urine glucose spill', `${p.urineGlucoseSpillMgMin.toFixed(1)} mmol/L`],
        ];

        rows.forEach(([k, v], i) => {
          const ry = 62 + i * 23;
          draw.text(ctx, k, 342, ry, { size: 10.2, color: c.muted, align: 'left' });
          draw.text(ctx, v, 610, ry, { size: 10.2, weight: 600, color: c.ink, align: 'right' });
        });

        // Captured trials box
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 340, 250, 272, 82, 8);
        ctx.fill();
        draw.text(ctx, `Captured trials (${captures.length})`, 476, 268, {
          size: 11.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two contrasting states', 476, 290, {
            size: 10.2,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Dadar May 38 °C vs Cold room 15 °C).', 476, 308, {
            size: 10.2,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 290 + idx * 19;
            draw.text(
              ctx,
              `#${idx + 1}: ${cap.ambientTempC} °C, ${cap.humidityOrMealPct}% → core ${cap.coreTempC.toFixed(2)} °C, gluc ${cap.regulatedGlucoseMmolL.toFixed(1)}`,
              476,
              cy,
              { size: 9.8, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap, i) =>
            `#${i + 1} ${cap.modeName} (${cap.ambientTempC} °C, ${cap.humidityOrMealPct}% → core ${cap.coreTempC.toFixed(2)} °C, glucose ${cap.regulatedGlucoseMmolL.toFixed(1)} mmol/L)`
        )
        .join(' | ');
      say(
        `${p.modeName} (${p.ambientTempC} °C, ${p.humidityOrMealPct}%): ${p.arterioleState} (${p.arterioleDiameterPct}% diameter, ${p.surfaceCapillaryFlowMlMin} mL/min capillary flow) · sweat evaporated ${p.sweatEvaporatedGH} g/h (${p.evaporativeCoolingW} W cooling, dripped ${p.sweatDrippedGH} g/h) · core ${p.coreTempC.toFixed(2)} °C · plasma glucose ${p.regulatedGlucoseMmolL.toFixed(2)} mmol/L (insulin ${p.insulinUnitsMl} µU/mL, glucagon ${p.glucagonPgMl} pg/mL, ${p.liverAction}). ${cmp.summary} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate skin thermoregulation, Mumbai humidity & blood glucose feedback',
    three: false,
    static: true,
  }
);
