// Chapter 11 Widget 1: DNA Double-Helix, Chargaff's Ratios & Photo 51 Geometry Bench (0610 Topic 4.1 & 17.1).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  DNA_HELIX_MODES,
  simulateDnaDoubleHelix,
  captureHelixTrial,
  compareHelixTrials,
} from './genetic_code_model.js';

Live.register(
  'dna_base_pairing',
  (stage, params, api) => {
    let modeIndex = 0;
    let adeninePct = 30;
    let focusPos = 6;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'DNA double-helix complementary base pairing, Chargaff base ratios and Photo 51 X-ray geometry workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      DNA_HELIX_MODES,
      idx => {
        modeIndex = idx;
        refresh();
      },
      0
    );

    const adenineSlider = api.slider('Adenine percentage', {
      min: 10,
      max: 40,
      step: 5,
      value: adeninePct,
      fmt: v => `${v}%`,
      onInput: v => {
        adeninePct = v;
        refresh();
      },
    });

    const rungSlider = api.slider('Inspected base pair', {
      min: 1,
      max: 12,
      step: 1,
      value: focusPos,
      fmt: v => `Rung ${v}`,
      onInput: v => {
        focusPos = v;
        refresh();
      },
    });

    api.button('Human 30% A', () => {
      modeIndex = 1;
      adeninePct = 30;
      focusPos = 6;
      tabs.setActive(1);
      adenineSlider.set(30);
      rungSlider.set(6);
      refresh();
    });

    api.button('GC-rich 15% A', () => {
      modeIndex = 1;
      adeninePct = 15;
      focusPos = 6;
      tabs.setActive(1);
      adenineSlider.set(15);
      rungSlider.set(6);
      refresh();
    });

    api.button('Purine bulge test', () => {
      modeIndex = 3;
      adeninePct = 35;
      focusPos = 6;
      tabs.setActive(3);
      adenineSlider.set(35);
      rungSlider.set(6);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureHelixTrial(modeIndex, adeninePct, focusPos);
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function baseColor(b, c) {
      if (b === 'A') return c.green;
      if (b === 'T') return c.proton;
      if (b === 'G') return c.electron;
      return c.ink;
    }

    function refresh() {
      const p = simulateDnaDoubleHelix(modeIndex, adeninePct, focusPos);
      const cmp = compareHelixTrials(captures);

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: Double-Helix / Base-Pair Ladder + Photo 51 Inset
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 314, 336, 10);
        ctx.stroke();

        draw.text(ctx, p.modeName, 171, 30, {
          size: 11.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `${p.speciesLabel} · 2.0 nm B-DNA helix`, 171, 46, {
          size: 9.6,
          color: c.muted,
          align: 'center',
        });

        // Draw 12 rungs of the double-helix ladder on left half of left card
        const railL = 42;
        const railR = 190;
        ctx.strokeStyle = c.electron;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(railL, 62);
        ctx.lineTo(railL, 322);
        ctx.moveTo(railR, 62);
        ctx.lineTo(railR, 322);
        ctx.stroke();

        draw.text(ctx, "5'", railL, 56, { size: 9, weight: 700, color: c.electron, align: 'center' });
        draw.text(ctx, "3'", railR, 56, { size: 9, weight: 700, color: c.electron, align: 'center' });

        p.pairs.forEach((rung, idx) => {
          const ry = 70 + idx * 21;
          const isFocus = rung.index === p.focusPos;
          if (isFocus) {
            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, railL - 12, ry - 9, railR - railL + 24, 18, 4);
            ctx.fill();
          }

          // Left and right base blocks
          const wL = rung.leftClass === 'Purine' ? 56 : 40;
          const wR = rung.rightClass === 'Purine' ? 56 : 40;

          ctx.fillStyle = c.sheet;
          ctx.strokeStyle = baseColor(rung.leftBase, c);
          ctx.lineWidth = isFocus ? 1.8 : 1.1;
          draw.roundRect(ctx, railL + 4, ry - 7, wL, 14, 3);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = baseColor(rung.rightBase, c);
          draw.roundRect(ctx, railR - 4 - wR, ry - 7, wR, 14, 3);
          ctx.fill();
          ctx.stroke();

          draw.text(ctx, `${rung.index}:${rung.leftBase}`, railL + 4 + wL / 2, ry + 3.5, {
            size: 8.8,
            weight: 700,
            color: baseColor(rung.leftBase, c),
            align: 'center',
          });
          draw.text(ctx, rung.rightBase, railR - 4 - wR / 2, ry + 3.5, {
            size: 8.8,
            weight: 700,
            color: baseColor(rung.rightBase, c),
            align: 'center',
          });

          // Hydrogen bond connectors
          const gx1 = railL + 6 + wL;
          const gx2 = railR - 6 - wR;
          ctx.strokeStyle = rung.isValid ? c.green : c.proton;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          if (rung.hBonds === 3) {
            ctx.moveTo(gx1, ry - 3);
            ctx.lineTo(gx2, ry - 3);
            ctx.moveTo(gx1, ry);
            ctx.lineTo(gx2, ry);
            ctx.moveTo(gx1, ry + 3);
            ctx.lineTo(gx2, ry + 3);
          } else if (rung.hBonds === 2) {
            ctx.moveTo(gx1, ry - 2);
            ctx.lineTo(gx2, ry - 2);
            ctx.moveTo(gx1, ry + 2);
            ctx.lineTo(gx2, ry + 2);
          } else {
            ctx.moveTo(gx1, ry);
            ctx.lineTo(gx2, ry);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Photo 51 X-diffraction mini inset on right side of left card
        const px = 262;
        const py = 128;
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.ink;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(px, py, 46, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // X-cross spots
        ctx.strokeStyle = c.ink;
        ctx.lineWidth = 2.6;
        [
          [8, 7],
          [16, 14],
          [24, 21],
          [34, 29],
        ].forEach(([ly, dx]) => {
          [-1, 1].forEach(sy => {
            [-1, 1].forEach(sx => {
              ctx.beginPath();
              ctx.moveTo(px + sx * dx - 4, py + sy * ly);
              ctx.lineTo(px + sx * dx + 4, py + sy * ly);
              ctx.stroke();
            });
          });
        });
        draw.text(ctx, 'Photo 51 X-cross', px, py + 60, {
          size: 9.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, 'Pitch: 3.4 nm', px, py + 76, {
          size: 8.8,
          color: c.muted,
          align: 'center',
        });
        draw.text(ctx, 'Step: 0.34 nm', px, py + 90, {
          size: 8.8,
          color: c.muted,
          align: 'center',
        });
        draw.text(ctx, '≈10 bp / turn (fibre model)', px, py + 104, {
          size: 8.8,
          weight: 700,
          color: c.electron,
          align: 'center',
        });
        draw.text(ctx, `Rung ${p.focusPos}: ${p.focusedRung.leftBase}–${p.focusedRung.rightBase}`, px, py + 126, {
          size: 9.2,
          weight: 700,
          color: p.focusedRung.isValid ? c.green : c.proton,
          align: 'center',
        });
        draw.text(ctx, `Width: ${p.helixDiameterNm.toFixed(2)} nm`, px, py + 142, {
          size: 8.8,
          weight: 600,
          color: p.focusedRung.isValid ? c.ink : c.proton,
          align: 'center',
        });

        // Right Card: Chargaff Ledger, Telemetry & Captured Trials
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 12, 290, 228, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 12, 290, 228, 10);
        ctx.stroke();

        draw.text(ctx, 'Chargaff Ratios & B-DNA Telemetry', 481, 30, {
          size: 11.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const rows = [
          ['Chargaff %A = %T', `${p.chargaff.A.toFixed(1)}% A = ${p.chargaff.T.toFixed(1)}% T`],
          ['Chargaff %G = %C', `${p.chargaff.G.toFixed(1)}% G = ${p.chargaff.C.toFixed(1)}% C`],
          ['Total GC content', `${p.chargaff.gcPct.toFixed(1)}% (A/T=1.0, G/C=1.0)`],
          ['Inspected Rung', `#${p.focusPos}: ${p.focusedRung.leftBase} (${p.focusedRung.leftClass[0]}) – ${p.focusedRung.rightBase} (${p.focusedRung.rightClass[0]})`],
          ['Rung H-bonds & width', `${p.focusedRung.hBonds} H-bonds · ${p.helixDiameterNm.toFixed(2)} nm`],
          ['12-bp total H-bonds', `${p.totalHBonds} H-bonds · Tm ${p.meltingTempC} °C`],
          ['Photo 51 rise at rung', `${p.focusedRung.verticalRiseNm} nm · twist ${p.focusedRung.twistAngleDeg}°`],
          ['Backbone fit status', p.allRungsComplementary ? 'Uniform 2.00 nm cylinder' : 'Distorted (mismatch)'],
        ];

        rows.forEach(([k, v], i) => {
          const ry = 54 + i * 22;
          draw.text(ctx, k, 346, ry, { size: 9.6, color: c.muted, align: 'left' });
          draw.text(ctx, v, 616, ry, { size: 9.6, weight: 600, color: c.ink, align: 'right' });
        });

        // Bottom-Right Captured Trials Box
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 336, 248, 290, 100, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 336, 248, 290, 100, 10);
        ctx.stroke();

        draw.text(ctx, `Captured trials (${captures.length})`, 481, 266, {
          size: 10.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two contrasting states', 481, 290, {
            size: 9.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, '(e.g. Human 30% A vs GC-rich 15% A or Bulge).', 481, 308, {
            size: 9.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 290 + idx * 22;
            draw.text(
              ctx,
              `#${idx + 1}: ${cap.pctA}% A=${cap.pctT}% T, ${cap.pctG}% G=${cap.pctC}% C · ${cap.totalHBonds} H · ${cap.helixDiameterNm.toFixed(2)} nm`,
              481,
              cy,
              { size: 9.2, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap, i) =>
            `#${i + 1} ${cap.modeName} (${cap.adeninePct}% A, Rung ${cap.focusPos} → ${cap.pctG}% G, ${cap.totalHBonds} H-bonds, ${cap.helixDiameterNm.toFixed(2)} nm)`
        )
        .join(' | ');

      say(
        `${p.modeName} (${p.adeninePct}% A, Rung ${p.focusPos}): Chargaff %A=${p.chargaff.A}% = %T=${p.chargaff.T}%, %G=${p.chargaff.G}% = %C=${p.chargaff.C}% (GC ${p.chargaff.gcPct}%) · Rung ${p.focusPos} pairs ${p.focusedRung.leftBase}–${p.focusedRung.rightBase} (${p.focusedRung.hBonds} H-bonds, schematic width ${p.helixDiameterNm.toFixed(2)} (normal helix ≈2 nm; mismatch widths exaggerated), ${p.focusedRung.geometryState}) · 12-bp segment has ${p.totalHBonds} H-bonds (Tm ${p.meltingTempC} °C) · Photo 51 pitch 3.4 nm, step 0.34 nm (≈10 bp/turn (fibre model)). ${cmp.summary} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Investigate DNA base pairing, Chargaff ratios & Photo 51 geometry',
    three: false,
    static: true,
  }
);
