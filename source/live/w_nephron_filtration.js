// Chapter 10 Widget 2: Kidney nephron ultrafiltration, selective reabsorption & liver deamination ledger (0610 Topic 13.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  NEPHRON_MODES,
  nephronFiltrationAccount,
  captureNephronTrial,
  compareNephronTrials,
} from './homeostasis_model.js';

Live.register(
  'nephron_filtration',
  (stage, params, api) => {
    let modeIndex = 0;
    let plasmaGlucoseMmolL = 5;
    let gfrMlMin = 125;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Kidney nephron glomerular ultrafiltration, selective reabsorption and urea mass-balance workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      NEPHRON_MODES,
      idx => {
        modeIndex = idx;
        if (idx === 3 && plasmaGlucoseMmolL < 12) {
          plasmaGlucoseMmolL = 16;
          glucoseSlider.set(16);
        } else if (idx !== 3 && plasmaGlucoseMmolL > 10) {
          plasmaGlucoseMmolL = 5;
          glucoseSlider.set(5);
        }
        refresh();
      },
      0
    );

    const glucoseSlider = api.slider('Plasma glucose', {
      min: 4,
      max: 18,
      step: 1,
      value: plasmaGlucoseMmolL,
      fmt: v => `${v} mmol/L`,
      onInput: v => {
        plasmaGlucoseMmolL = v;
        refresh();
      },
    });

    const gfrSlider = api.slider('GFR filtration rate', {
      min: 80,
      max: 140,
      step: 5,
      value: gfrMlMin,
      fmt: v => `${v} mL/min`,
      onInput: v => {
        gfrMlMin = v;
        refresh();
      },
    });

    api.button('Normal 5 mmol/L', () => {
      modeIndex = 0;
      plasmaGlucoseMmolL = 5;
      gfrMlMin = 125;
      tabs.setActive(0);
      glucoseSlider.set(5);
      gfrSlider.set(125);
      refresh();
    });

    api.button('Dehydrated afternoon', () => {
      modeIndex = 1;
      plasmaGlucoseMmolL = 5;
      gfrMlMin = 120;
      tabs.setActive(1);
      glucoseSlider.set(5);
      gfrSlider.set(120);
      refresh();
    });

    api.button('Diabetic 16 mmol/L', () => {
      modeIndex = 3;
      plasmaGlucoseMmolL = 16;
      gfrMlMin = 125;
      tabs.setActive(3);
      glucoseSlider.set(16);
      gfrSlider.set(125);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureNephronTrial(modeIndex, plasmaGlucoseMmolL, gfrMlMin);
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const p = nephronFiltrationAccount(modeIndex, plasmaGlucoseMmolL, gfrMlMin);
      const cmp = compareNephronTrials(captures);

      view.draw((ctx, c) => {
        const { draw } = api;

        // Left panel: Nephron Cortex/Medulla Schematic (x=16..316, y=14..346)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 16, 14, 300, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, `1 · ${p.modeName.toUpperCase()}`, 166, 36, {
          size: 12.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `GFR ${p.gfrMlMin} mL/min (${p.filtrateLPerDay} L/d) · Plasma gluc ${p.plasmaGlucoseMmolL} mmol/L`,
          166,
          54,
          { size: 10.2, color: c.muted, align: 'center' }
        );

        // Stage 1 box: Renal Cortex — Glomerulus & Renal Capsule
        ctx.fillStyle = c.plate;
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 30, 68, 272, 74, 6);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, 'Renal Cortex: Glomerulus → Renal Capsule', 166, 86, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `Protein model (rounded): ${p.plasmaProteinG100Ml.toFixed(1)} → ${p.filtrateProteinG100Ml.toFixed(1)} g/100mL`,
          166,
          106,
          { size: 10.0, weight: 600, color: c.photon, align: 'center' }
        );
        draw.text(
          ctx,
          `Small solutes filtered: H₂O, glucose (${p.filtrateGlucoseMmolL} mmol/L), urea, ions`,
          166,
          126,
          { size: 9.8, color: c.muted, align: 'center' }
        );

        // Stage 2 box: Proximal Renal Tubule — Selective Reabsorption
        ctx.fillStyle = c.plate;
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 30, 150, 272, 82, 6);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, 'Renal Tubule: Selective Reabsorption', 166, 168, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `Glucose reabsorbed: ${p.reabsorbedGlucoseMgMin.toFixed(1)} mg/min (${p.glucoseReabsorbedPct}%)`,
          166,
          188,
          {
            size: 10.2,
            weight: 700,
            color: p.excretedGlucoseMgMin > 0 ? c.proton : c.electron,
            align: 'center',
          }
        );
        draw.text(
          ctx,
          p.excretedGlucoseMgMin > 0
            ? `Capacity 330; excreted ${p.excretedGlucoseMgMin.toFixed(1)} mg/min`
            : '100% of filtered glucose rescued via active transport',
          166,
          208,
          {
            size: 9.8,
            color: p.excretedGlucoseMgMin > 0 ? c.proton : c.photon,
            align: 'center',
          }
        );
        draw.text(
          ctx,
          `Water reabsorbed: ${p.reabsorbedWaterLPerDay} L/d (${p.waterReabsorbedPct}%)`,
          166,
          224,
          { size: 9.8, color: c.ink, align: 'center' }
        );

        // Stage 3 box: Medulla Collecting Duct → Ureter → Bladder → Urethra
        ctx.fillStyle = c.plate;
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 30, 240, 272, 92, 6);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, 'Medulla Collecting Duct → Ureter → Bladder', 166, 258, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `Final urine volume: ${p.urineLPerDay} L/day · Urea ${p.urineUreaG100Ml} g/100mL (${p.ureaConcentrationRatio}×)`,
          166,
          278,
          { size: 10.0, weight: 600, color: c.electron, align: 'center' }
        );
        draw.text(
          ctx,
          `Urine glucose: ${p.urineGlucoseG100Ml} g/100mL (${p.urineGlucoseGPerDay} g/day)`,
          166,
          298,
          {
            size: 10.0,
            weight: 600,
            color: p.urineGlucoseGPerDay > 0 ? c.proton : c.photon,
            align: 'center',
          }
        );
        draw.text(
          ctx,
          `Liver deamination urea excreted: ${p.excretedUreaGPerDay} g/day`,
          166,
          318,
          { size: 9.8, color: c.muted, align: 'center' }
        );

        // Right panel: Quantitative Solute Ledger & Captured Trials (x=328..624, y=14..346)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 328, 14, 296, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '2 · PLASMA → FILTRATE → URINE LEDGER', 476, 36, {
          size: 12.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Filtrate / Urine vol', `${p.filtrateLPerDay} → ${p.urineLPerDay} L/d`],
          ['Water reabsorbed', `${p.waterReabsorbedPct}% (${p.reabsorbedWaterLPerDay} L/d)`],
          ['Proteins (g/100mL)', `${p.plasmaProteinG100Ml.toFixed(1)} → 0.0 → 0.0`],
          ['Glucose (mg/min)', `${p.filteredGlucoseMgMin.toFixed(1)} in → ${p.reabsorbedGlucoseMgMin.toFixed(1)} back → ${p.excretedGlucoseMgMin.toFixed(1)} out`],
          ['Glucose reabsorbed', `${p.glucoseReabsorbedPct}% (${p.reabsorbedGlucoseGPerDay} g/d)`],
          ['Urea (g/100mL)', `${p.plasmaUreaG100Ml} → ${p.filtrateUreaG100Ml} → ${p.urineUreaG100Ml}`],
          ['Urea concentration', `${p.ureaConcentrationRatio}× (${p.excretedUreaGPerDay} g/d)`],
          ['Ions reabsorbed', `${p.ionReabsorbedPct}% (urine ${p.urineIonsG100Ml} g/100mL)`],
        ];

        rows.forEach(([k, v], i) => {
          const ry = 62 + i * 23;
          draw.text(ctx, k, 342, ry, { size: 10.0, color: c.muted, align: 'left' });
          draw.text(ctx, v, 610, ry, { size: 10.0, weight: 600, color: c.ink, align: 'right' });
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
            size: 10.0,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Normal 5 mmol/L vs Diabetic 16 mmol/L).', 476, 308, {
            size: 10.0,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 290 + idx * 19;
            draw.text(
              ctx,
              `#${idx + 1}: gluc ${cap.plasmaGlucoseMmolL} mmol/L → reabs ${cap.glucoseReabsorbedPct}%, urine ${cap.urineLPerDay} L/d`,
              476,
              cy,
              { size: 9.6, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap, i) =>
            `#${i + 1} ${cap.modeName} (gluc ${cap.plasmaGlucoseMmolL} mmol/L, GFR ${cap.gfrMlMin} → reabs ${cap.glucoseReabsorbedPct}%, urine ${cap.urineLPerDay} L/d)`
        )
        .join(' | ');
      say(
        `${p.modeName} (plasma glucose ${p.plasmaGlucoseMmolL} mmol/L, GFR ${p.gfrMlMin} mL/min = ${p.filtrateLPerDay} L/day filtrate): stipulated barrier (rounded protein values: ${p.plasmaProteinG100Ml} → ${p.filtrateProteinG100Ml} g/100mL) · proximal tubule glucose reabsorbed ${p.glucoseReabsorbedPct}% (${p.reabsorbedGlucoseMgMin.toFixed(1)} mg/min rescued, ${p.excretedGlucoseMgMin.toFixed(1)} mg/min excreted) · water reabsorbed ${p.waterReabsorbedPct}% → urine ${p.urineLPerDay} L/day · urea concentrated ${p.ureaConcentrationRatio}× (${p.plasmaUreaG100Ml} → ${p.urineUreaG100Ml} g/100mL, ${p.excretedUreaGPerDay} g/day excreted). ${cmp.summary} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Illustrative rate model: investigate glomerular ultrafiltration, selective reabsorption & urea excretion',
    three: false,
    static: true,
  }
);
