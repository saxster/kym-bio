// Chapter 9 Widget 1: Reflex arc, myelinated vs unmyelinated conduction, ruler-drop & Siddiqi para^ts Na+ channel.
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  REFLEX_MODES,
  reflexActionAccount,
  captureReflex,
  compareReflex,
} from './coordination_model.js';

Live.register(
  'reflex_action_potential',
  (stage, params, api) => {
    let mode = 0;
    let diameterUm = 12;
    let tempC = 25;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Illustrative timing model, not a measured hot-pan reflex; action potential waveform and Siddiqi para temperature-sensitive Na+ channel investigator'
    );

    const say = api.readout();
    const tabs = api.tabs(
      REFLEX_MODES.map((m) => m.label),
      (idx) => {
        mode = idx;
        refresh();
      },
      0
    );

    const diamSlider = api.slider('Axon diameter', {
      min: 2,
      max: 20,
      step: 1,
      value: diameterUm,
      fmt: (v) => `${v} µm`,
      onInput: (v) => {
        diameterUm = v;
        refresh();
      },
    });

    const tempSlider = api.slider('Temperature', {
      min: 18,
      max: 36,
      step: 1,
      value: tempC,
      fmt: (v) => `${v} °C`,
      onInput: (v) => {
        tempC = v;
        refresh();
      },
    });

    api.button('Myelinated reflex (12 µm, 25 °C)', () => {
      mode = 0;
      diameterUm = 12;
      tempC = 25;
      tabs.setActive(0);
      diamSlider.set(12);
      tempSlider.set(25);
      refresh();
    });

    api.button('Siddiqi para^ts block (32 °C)', () => {
      mode = 3;
      diameterUm = 12;
      tempC = 32;
      tabs.setActive(3);
      diamSlider.set(12);
      tempSlider.set(32);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureReflex(reflexActionAccount(mode, diameterUm, tempC));
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const q = reflexActionAccount(mode, diameterUm, tempC);
      const cmp = compareReflex(captures.at(-2), captures.at(-1));

      view.draw((ctx, c) => {
        const { draw } = api;

        // Left panel: Pathway & Axon structure (x=16..316, y=14..344)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 16, 14, 300, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, `1 · ${q.modeLabel.toUpperCase()}`, 166, 36, {
          size: 13,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, q.pathway, 166, 54, {
          size: 11,
          color: c.muted,
          align: 'center',
        });

        // Draw axon tube across y=112..148
        const tubeHalf = Math.max(8, Math.min(20, q.diameterUm * 1.0));
        const ay = 132;
        ctx.fillStyle = q.paraBlocked ? c.mark_soft : c.plate;
        ctx.strokeStyle = q.paraBlocked ? c.proton : c.electron;
        ctx.lineWidth = 2;
        draw.roundRect(ctx, 34, ay - tubeHalf, 264, tubeHalf * 2, 6);
        ctx.fill();
        ctx.stroke();

        if (q.mode !== 1) {
          for (const mx of [52, 104, 156, 208, 252]) {
            ctx.fillStyle = c.sheet;
            ctx.strokeStyle = c.electron;
            ctx.lineWidth = 1.6;
            draw.roundRect(ctx, mx, ay - tubeHalf - 6, 34, tubeHalf * 2 + 12, 4);
            ctx.fill();
            ctx.stroke();
          }
          draw.text(ctx, 'Myelin sheath (Schwann cells) + nodes of Ranvier', 166, ay - tubeHalf - 14, {
            size: 10.8,
            weight: 600,
            color: c.electron,
            align: 'center',
          });
        } else {
          draw.text(ctx, 'Unmyelinated membrane (continuous domino wave)', 166, ay - tubeHalf - 12, {
            size: 10.8,
            weight: 600,
            color: c.proton,
            align: 'center',
          });
        }

        if (!q.paraBlocked) {
          draw.arrow(ctx, 44, ay, 286, ay, c.green, 2.5);
          draw.text(ctx, `Speed v = ${q.velocityMS.toFixed(1)} m/s (${q.diameterUm} µm, ${q.tempC} °C)`, 166, ay + tubeHalf + 22, {
            size: 11.8,
            weight: 700,
            color: c.green,
            align: 'center',
          });
        } else {
          draw.text(ctx, `BLOCKED AT ${q.tempC} °C: para^ts Na⁺ gates fail to open`, 166, ay + tubeHalf + 22, {
            size: 11.5,
            weight: 700,
            color: c.proton,
            align: 'center',
          });
        }

        const by = 194;
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 28, by, 276, 138, 8);
        ctx.fill();
        draw.text(ctx, 'Chosen pathway timing model', 166, by + 20, {
          size: 12,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        const rows = [
          ['Axonal conduction:', Number.isFinite(q.axonalMs) ? `${q.axonalMs.toFixed(1)} ms` : 'Blocked'],
          ['Synaptic delay:', Number.isFinite(q.synapticMs) ? `${q.synapticMs.toFixed(1)} ms` : '—'],
          ['Brain decision delay:', `${q.brainDelayMs} ms`],
          ['Muscle activation:', Number.isFinite(q.muscleActivationMs) ? `${q.muscleActivationMs.toFixed(1)} ms` : '—'],
          [
            'Total response time:',
            Number.isFinite(q.totalLatencyMs)
              ? `${q.totalLatencyMs.toFixed(1)} ms${q.rulerDropCm != null ? ` (ruler ${q.rulerDropCm} cm)` : ''}`
              : 'No muscle twitch',
          ],
        ];
        rows.forEach(([k, v], i) => {
          const ry = by + 42 + i * 20;
          draw.text(ctx, k, 40, ry, { size: 11.2, weight: i === 4 ? 700 : 400, color: c.ink });
          draw.text(ctx, v, 292, ry, {
            size: 11.2,
            weight: 700,
            color: i === 4 ? (q.paraBlocked ? c.proton : c.green) : c.ink,
            align: 'right',
          });
        });

        // Right panel: Action Potential Waveform + Captured Trial Comparison (x=328..624, y=14..344)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 328, 14, 296, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '2 · MEMBRANE POTENTIAL Vm (mV)', 476, 36, {
          size: 13,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const gx0 = 374,
          gx1 = 604,
          gy0 = 220,
          gyTop = 66;
        const yForMv = (mv) => gy0 - ((mv - -85) / (40 - -85)) * (gy0 - gyTop);

        ctx.strokeStyle = c.muted;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(gx0, gyTop);
        ctx.lineTo(gx0, gy0);
        ctx.lineTo(gx1, gy0);
        ctx.stroke();

        for (const mv of [30, 0, -55, -70]) {
          const py = yForMv(mv);
          ctx.strokeStyle = c.grid;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(gx0, py);
          ctx.lineTo(gx1, py);
          ctx.stroke();
          ctx.setLineDash([]);
          draw.text(ctx, `${mv > 0 ? '+' : ''}${mv}`, gx0 - 6, py + 4, {
            size: 10.5,
            color: c.muted,
            align: 'right',
          });
        }

        ctx.strokeStyle = q.paraBlocked ? c.proton : c.green;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        const yRest = yForMv(-70);
        const yThresh = yForMv(-55);
        const yPeak = yForMv(q.peakMv);
        const yUnder = yForMv(q.undershootMv);
        ctx.moveTo(gx0, yRest);
        ctx.lineTo(gx0 + 36, yRest);
        if (q.paraBlocked) {
          ctx.lineTo(gx0 + 54, yForMv(-62));
          ctx.lineTo(gx0 + 82, yRest);
          ctx.lineTo(gx1, yRest);
        } else {
          ctx.quadraticCurveTo(gx0 + 48, yRest, gx0 + 56, yThresh);
          ctx.lineTo(gx0 + 78, yPeak);
          ctx.lineTo(gx0 + 114, yRest);
          ctx.quadraticCurveTo(gx0 + 132, yUnder + 6, gx0 + 158, yRest);
          ctx.lineTo(gx1, yRest);
        }
        ctx.stroke();

        draw.text(
          ctx,
          q.paraBlocked
            ? 'Sub-threshold blip only (Na⁺ channels blocked)'
            : `Peak ${q.peakMv > 0 ? '+' : ''}${q.peakMv} mV (Na⁺ influx) → K⁺ repolarisation`,
          488,
          242,
          {
            size: 11,
            weight: 600,
            color: q.paraBlocked ? c.proton : c.green,
            align: 'center',
          }
        );

        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 340, 256, 272, 78, 8);
        ctx.fill();
        draw.text(ctx, `Captured trials (${captures.length})`, 476, 274, {
          size: 11.5,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on two different pathways', 476, 296, {
            size: 10.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'or temperatures to compare speed & latency.', 476, 314, {
            size: 10.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          const shortNames = ['Myelinated', 'Unmyelinated', 'Voluntary', 'para^ts'];
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 294 + idx * 18;
            const lat = Number.isFinite(cap.totalLatencyMs) ? `${cap.totalLatencyMs} ms` : 'Blocked';
            draw.text(
              ctx,
              `#${idx + 1}: ${shortNames[cap.mode]} (${cap.diameterUm} µm, ${cap.tempC} °C) → ${cap.velocityMS} m/s, ${lat}`,
              476,
              cy,
              { size: 10, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const latTxt = Number.isFinite(q.totalLatencyMs)
        ? `${q.totalLatencyMs.toFixed(1)} ms (axonal ${q.axonalMs.toFixed(1)} ms + synaptic ${q.synapticMs.toFixed(1)} ms${q.brainDelayMs ? ` + brain ${q.brainDelayMs} ms` : ''})`
        : 'BLOCKED (Na⁺ gates closed above 30 °C; resting −70 mV held)';
      const rulerTxt = q.rulerDropCm != null ? ` · equivalent ruler drop ${q.rulerDropCm.toFixed(1)} cm` : '';
      const history = captures
        .map(
          (c, i) =>
            `#${i + 1} ${c.modeLabel} (${c.diameterUm} µm, ${c.tempC} °C → ${Number.isFinite(c.totalLatencyMs) ? c.totalLatencyMs + ' ms' : 'Blocked'})`
        )
        .join(' | ');
      say(
        `${q.modeLabel} (${q.diameterUm} µm, ${q.tempC} °C): conduction speed ${q.velocityMS.toFixed(1)} m/s · peak ${q.peakMv > 0 ? '+' : ''}${q.peakMv} mV · illustrative total ${latTxt}${rulerTxt}. ${captures.length} captured trials. ${cmp.reason} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  { label: 'Investigate reflex arcs & action potentials', three: false, static: true }
);
