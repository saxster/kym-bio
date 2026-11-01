// Chapter 10 Widget 3: Specific active vs passive immunity, vaccine memory & cholera/ORS rescue (0610 Topic 10.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  IMMUNITY_MODES,
  immunityVaccineAccount,
  captureImmunityTrial,
  compareImmunityTrials,
} from './homeostasis_model.js';

Live.register(
  'immunity_vaccine_memory',
  (stage, params, api) => {
    let modeIndex = 0;
    let daysPostExposure = 14;
    let memoryOrOrsPct = 80;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Specific active vs passive immunity, vaccine memory kinetics and cholera ORS rescue workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      IMMUNITY_MODES,
      idx => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const daySlider = api.slider('Days post-exposure', {
      min: 0,
      max: 42,
      step: 1,
      value: daysPostExposure,
      fmt: v => `Day ${v}`,
      onInput: v => {
        daysPostExposure = v;
        refresh();
      },
    });

    const levelSlider = api.slider('Memory or ORS support', {
      min: 0,
      max: 100,
      step: 10,
      value: memoryOrOrsPct,
      fmt: v => `${v}%`,
      onInput: v => {
        memoryOrOrsPct = v;
        refresh();
      },
    });

    api.button('Primary Day 14 (0% mem)', () => {
      modeIndex = 0;
      daysPostExposure = 14;
      memoryOrOrsPct = 0;
      tabs.setActive(0);
      daySlider.set(14);
      levelSlider.set(0);
      refresh();
    });

    api.button('Vaccinated Day 7 (90% mem)', () => {
      modeIndex = 0;
      daysPostExposure = 7;
      memoryOrOrsPct = 90;
      tabs.setActive(0);
      daySlider.set(7);
      levelSlider.set(90);
      refresh();
    });

    api.button('Passive Day 28', () => {
      modeIndex = 2;
      daysPostExposure = 28;
      memoryOrOrsPct = 20;
      tabs.setActive(2);
      daySlider.set(28);
      levelSlider.set(20);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureImmunityTrial(modeIndex, daysPostExposure, memoryOrOrsPct);
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const p = immunityVaccineAccount(modeIndex, daysPostExposure, memoryOrOrsPct);
      const cmp = compareImmunityTrials(captures);

      view.draw((ctx, c) => {
        const { draw } = api;

        // Left panel: Immune Kinetics / Antigen Lock / Cholera ORS Schematic (x=16..316, y=14..346)
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
        draw.text(ctx, `Day ${p.daysPostExposure} · Slider ${p.memoryOrOrsPct}%`, 166, 54, {
          size: 10.2,
          color: c.muted,
          align: 'center',
        });

        if (p.modeIndex <= 2) {
          // Antibody kinetics graph box (x=32..300, y=68..210)
          ctx.fillStyle = c.plate;
          ctx.strokeStyle = c.rule;
          draw.roundRect(ctx, 30, 68, 272, 146, 6);
          ctx.fill();
          ctx.stroke();

          const gx = 52;
          const gy = 84;
          const gw = 232;
          const gh = 104;

          // Protective threshold dashed line (40 AU out of 240 AU max)
          const threshY = gy + gh - (40 / 240) * gh;
          ctx.strokeStyle = c.rule;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(gx, threshY);
          ctx.lineTo(gx + gw, threshY);
          ctx.stroke();
          ctx.setLineDash([]);
          draw.text(ctx, '40 AU threshold', gx + gw - 4, threshY - 5, {
            size: 8.8,
            color: c.muted,
            align: 'right',
          });

          // Plot primary curve (muted) and active/current curve (accent)
          ctx.strokeStyle = c.muted;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let d = 0; d <= 42; d += 1) {
            const st = immunityVaccineAccount(p.modeIndex, d, p.memoryOrOrsPct);
            const px = gx + (d / 42) * gw;
            const py = gy + gh - Math.min(1, st.primaryAntibodyAU / 240) * gh;
            if (d === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.strokeStyle = c.electron;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          for (let d = 0; d <= 42; d += 1) {
            const st = immunityVaccineAccount(p.modeIndex, d, p.memoryOrOrsPct);
            const px = gx + (d / 42) * gw;
            const py = gy + gh - Math.min(1, st.activeAntibodyAU / 240) * gh;
            if (d === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Day cursor marker
          const curX = gx + (p.daysPostExposure / 42) * gw;
          const curY = gy + gh - Math.min(1, p.activeAntibodyAU / 240) * gh;
          ctx.fillStyle = c.proton;
          ctx.beginPath();
          ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          draw.text(ctx, 'Day 0', gx, gy + gh + 16, { size: 9.0, color: c.muted, align: 'left' });
          draw.text(ctx, 'Day 21', gx + gw / 2, gy + gh + 16, { size: 9.0, color: c.muted, align: 'center' });
          draw.text(ctx, 'Day 42', gx + gw, gy + gh + 16, { size: 9.0, color: c.muted, align: 'right' });

          // Specificity & Memory status box
          draw.roundRect(ctx, 30, 222, 272, 110, 6);
          ctx.fillStyle = c.plate;
          ctx.fill();
          ctx.strokeStyle = c.rule;
          ctx.stroke();

          const shortClass =
            p.modeIndex === 1
              ? p.antigenShapeMatchPct === 100
                ? 'Recognised antigen in this model'
                : 'B assumed unrecognised in this model'
              : p.memoryCellsPresent
              ? 'Active immunity (lymphocytes + memory)'
              : 'Passive immunity (borrowed Ab; no memory)';
          const shortProt =
            p.modeIndex === 1
              ? p.antigenShapeMatchPct === 100
                ? 'Pathogen clumped and marked for phagocytes'
                : 'Anti-A cannot bind B; new response needed'
              : p.modeIndex === 2 && !p.memoryCellsPresent
              ? p.daysPostExposure <= 21
                ? 'Immediate cover at Day 0; decays with time'
                : 'Borrowed Ab decayed below 40 AU; 0 memory'
              : p.activeAntibodyAU >= 40
              ? 'Protected above threshold (≥40 AU)'
              : 'Below 40 AU protective threshold';

          draw.text(ctx, shortClass, 166, 244, {
            size: 9.8,
            weight: 700,
            color: p.antigenShapeMatchPct === 100 ? c.electron : c.proton,
            align: 'center',
          });
          draw.text(
            ctx,
            `Day ${p.daysPostExposure} Ab: ${p.activeAntibodyAU} AU (primary ${p.primaryAntibodyAU} AU)`,
            166,
            266,
            { size: 10.0, weight: 600, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            `Memory cells: ${p.memoryCellsPresent ? 'YES (long-term active)' : 'NO (0 memory cells)'}`,
            166,
            288,
            {
              size: 10.0,
              weight: 700,
              color: p.memoryCellsPresent ? c.photon : c.proton,
              align: 'center',
            }
          );
          draw.text(ctx, shortProt, 166, 310, {
            size: 9.4,
            color: c.muted,
            align: 'center',
          });
        } else {
          // Tab 3: Cholera toxin Cl- secretion vs ORS Na+-glucose cotransport rescue
          ctx.fillStyle = c.plate;
          ctx.strokeStyle = c.rule;
          draw.roundRect(ctx, 30, 68, 272, 118, 6);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, 'Vibrio cholerae Toxin in Small Intestine', 166, 88, {
            size: 10.8,
            weight: 700,
            color: c.proton,
            align: 'center',
          });
          draw.text(
            ctx,
            `Epithelial Cl⁻ secretion: ${p.choleraClSecretionMmolH} mmol/h into lumen`,
            166,
            110,
            { size: 10.0, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            'Lowers lumen Ψ_w → osmotic water loss',
            166,
            132,
            { size: 9.8, color: c.muted, align: 'center' }
          );
          draw.text(
            ctx,
            `Gut osmotic water loss: −${p.gutOsmoticWaterLossMlH} mL/h`,
            166,
            156,
            { size: 10.2, weight: 700, color: c.proton, align: 'center' }
          );

          draw.roundRect(ctx, 30, 196, 272, 136, 6);
          ctx.fillStyle = c.plate;
          ctx.fill();
          ctx.strokeStyle = c.rule;
          ctx.stroke();

          draw.text(ctx, 'ORS Rescue (Water + NaCl + Glucose)', 166, 216, {
            size: 10.4,
            weight: 700,
            color: c.photon,
            align: 'center',
          });
          draw.text(
            ctx,
            `Na⁺–glucose cotransport uptake: +${p.orsCotransportUptakeMlH} mL/h`,
            166,
            240,
            { size: 10.0, weight: 600, color: c.electron, align: 'center' }
          );
          draw.text(
            ctx,
            `Net gut water: ${p.netIntestinalWaterBalanceMlH >= 0 ? '+' : ''}${p.netIntestinalWaterBalanceMlH} mL/h`,
            166,
            264,
            {
              size: 10.4,
              weight: 700,
              color: p.netIntestinalWaterBalanceMlH >= 0 ? c.photon : c.proton,
              align: 'center',
            }
          );
          draw.text(
            ctx,
            p.netIntestinalWaterBalanceMlH >= 0
              ? 'ORS cotransport restores net water uptake'
              : 'Toxin Cl⁻ loss exceeds uptake (diarrhoea)',
            166,
            290,
            {
              size: 9.4,
              color: c.ink,
              align: 'center',
            }
          );
          draw.text(
            ctx,
            'Antibiotics treat bacteria; they never affect viruses',
            166,
            314,
            { size: 9.6, weight: 600, color: c.muted, align: 'center' }
          );
        }

        // Right panel: Quantitative Immunity & Cholera Ledger + Captured Trials (x=328..624, y=14..346)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 328, 14, 296, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '2 · QUANTITATIVE IMMUNITY & ORS LEDGER', 476, 36, {
          size: 12.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Active / current Ab', `${p.activeAntibodyAU} AU (thr 40 AU)`],
          ['Primary / Secondary Ab', `${p.primaryAntibodyAU} / ${p.secondaryAntibodyAU} AU`],
          ['Passive borrowed Ab', `${p.passiveAntibodyAU} AU (t₁/₂ = 21 d)`],
          ['Antigen shape match', `${p.antigenShapeMatchPct}% model recognition`],
          ['Memory cells present', p.memoryCellsPresent ? 'YES (active)' : 'NO (0 memory)'],
          ['Cholera Cl⁻ secretion', `${p.choleraClSecretionMmolH} mmol/h`],
          ['ORS cotransport uptake', `+${p.orsCotransportUptakeMlH} mL/h`],
          ['Net gut water balance', `${p.netIntestinalWaterBalanceMlH >= 0 ? '+' : ''}${p.netIntestinalWaterBalanceMlH} mL/h`],
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
          draw.text(ctx, '(e.g. Primary Day 14 vs Vaccinated Day 7).', 476, 308, {
            size: 10.0,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 290 + idx * 19;
            draw.text(
              ctx,
              `#${idx + 1}: Day ${cap.daysPostExposure}, ${cap.memoryOrOrsPct}% → ${cap.activeAntibodyAU} AU, mem=${cap.memoryCellsPresent ? 'YES' : 'NO'}`,
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
            `#${i + 1} ${cap.modeName} (Day ${cap.daysPostExposure}, ${cap.memoryOrOrsPct}% → ${cap.activeAntibodyAU} AU, memory=${cap.memoryCellsPresent ? 'YES' : 'NO'})`
        )
        .join(' | ');
      say(
        `${p.modeName} (Day ${p.daysPostExposure}, slider ${p.memoryOrOrsPct}%): ${p.immunityClassification} · antibody titre ${p.activeAntibodyAU} AU (primary ${p.primaryAntibodyAU} AU, secondary ${p.secondaryAntibodyAU} AU, passive ${p.passiveAntibodyAU} AU, threshold ${p.protectiveThresholdAU} AU) · antigen shape match ${p.antigenShapeMatchPct}% · memory cells ${p.memoryCellsPresent ? 'present' : 'absent'} · cholera Cl⁻ secretion ${p.choleraClSecretionMmolH} mmol/h, ORS uptake +${p.orsCotransportUptakeMlH} mL/h, net gut water ${p.netIntestinalWaterBalanceMlH >= 0 ? '+' : ''}${p.netIntestinalWaterBalanceMlH} mL/h. ${cmp.summary} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Illustrative curves: investigate antigen recognition, vaccine memory & oral rehydration',
    three: false,
    static: true,
  }
);
