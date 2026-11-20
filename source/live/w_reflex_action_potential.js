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
    let captures = [];
    let showCharges = false;
    let showConc = false;
    let pulseU = -1; // -1 = resting; 0..1 = propagating spike cursor
    let pulseRaf = 0;
    let probeU = null; // 0..1 draggable oscilloscope probe
    let lastToneAt = 0;

    const view = makeCanvas(
      api,
      640,
      360,
      'Illustrative timing model, not a measured hot-pan reflex; action potential waveform and Siddiqi para temperature-sensitive Na+ channel investigator'
    );

    const say = api.readout();
    const sonify = api.sonifyToggle('Action potential tone');
    const trials = api.trials({
      columns: ['#', 'Pathway', 'µm', '°C', 'Speed (m/s)', 'Total (ms)'],
      maxRows: 6,
      allowNoise: true,
      noiseLabel: 'Biological variability',
      onNoiseChange: () => refresh(),
      plotColumn: 'Total (ms)',
    });

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

    function stopPulse() {
      if (pulseRaf) {
        cancelAnimationFrame(pulseRaf);
        pulseRaf = 0;
      }
      pulseU = -1;
    }

    function smooth01(x) {
      const t = Math.max(0, Math.min(1, x));
      return t * t * (3 - 2 * t);
    }

    function waveformMv(u, q) {
      if (q.paraBlocked) {
        const bump = Math.exp(-Math.pow((u - 0.24) / 0.06, 2)) * 8;
        return -70 + bump;
      }
      if (u < 0.16) return -70;
      if (u < 0.25) return -70 + smooth01((u - 0.16) / 0.09) * 15;
      if (u < 0.35) return -55 + smooth01((u - 0.25) / 0.10) * (q.peakMv + 55);
      if (u < 0.52) return q.peakMv - smooth01((u - 0.35) / 0.17) * (q.peakMv - q.undershootMv);
      if (u < 0.74) return q.undershootMv + smooth01((u - 0.52) / 0.22) * (-70 - q.undershootMv);
      return -70;
    }

    function phaseNameFor(u, q) {
      if (q.paraBlocked) return u > 0.16 && u < 0.32 ? 'Blocked Na⁺' : 'Resting';
      if (u < 0.16) return 'Resting';
      if (u < 0.35) return 'Depolarisation';
      if (u < 0.51) return 'Repolarisation';
      if (u < 0.72) return 'Refractory';
      return 'Resting';
    }

    function triggerImpulse() {
      const q = reflexActionAccount(mode, diameterUm, tempC);
      if (api.reduced || api.calm) {
        pulseU = q.paraBlocked ? 0.24 : 0.35;
        probeU = pulseU;
        if (sonify.active && !api.reduced) {
          const mv = waveformMv(pulseU, q);
          api.audio().tone(q.paraBlocked ? 155 : 220 + (mv + 70) * 5, { dur: 0.12, type: 'triangle', gain: 0.08 });
        }
        refresh();
        return;
      }
      stopPulse();
      let start = 0;
      const durationMs = 1350;
      const step = (ts) => {
        if (!start) start = ts;
        const u = Math.min(1, (ts - start) / durationMs);
        pulseU = q.paraBlocked ? Math.min(0.28, u) : u;
        if (sonify.active) {
          const now = performance.now();
          if (now - lastToneAt > 75) {
            lastToneAt = now;
            const mv = waveformMv(pulseU, q);
            const freq = q.paraBlocked ? 145 : Math.max(130, 190 + (mv + 75) * 4.8);
            api.audio().tone(freq, { dur: 0.08, type: q.paraBlocked ? 'sine' : 'triangle', gain: 0.05 });
          }
        }
        refresh();
        if (u < 1 && !(q.paraBlocked && u > 0.45)) {
          pulseRaf = requestAnimationFrame(step);
        } else {
          pulseRaf = 0;
          pulseU = -1;
          refresh();
        }
      };
      pulseRaf = requestAnimationFrame(step);
    }

    api.button('⚡ Stimulate Neuron', triggerImpulse);

    const chargesBtn = api.button('Charges (+/−)', (btn) => {
      showCharges = !showCharges;
      btn.setAttribute('aria-pressed', String(showCharges));
      refresh();
    }, { pressed: false });

    const concBtn = api.button('Ion mM', (btn) => {
      showConc = !showConc;
      btn.setAttribute('aria-pressed', String(showConc));
      refresh();
    }, { pressed: false });

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
      const qNow = reflexActionAccount(mode, diameterUm, tempC);
      const snap = captureReflex(qNow);
      if (snap) {
        captures.push(snap);
        const rGen = api.rng(409 + captures.length * 23 + mode * 13 + tempC);
        const jitter = trials.noise && Number.isFinite(qNow.totalLatencyMs)
          ? (rGen() - 0.5) * 8.4
          : 0;
        const latStr = Number.isFinite(qNow.totalLatencyMs)
          ? `${(qNow.totalLatencyMs + jitter).toFixed(1)} ms`
          : 'Blocked';
        trials.record([
          captures.length,
          qNow.modeLabel,
          qNow.diameterUm,
          qNow.tempC,
          qNow.velocityMS.toFixed(1),
          latStr,
        ]);
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      trials.clear();
      refresh();
    });

    api.onHide(stopPulse);
    api.onCleanup(stopPulse);

    api.reset(() => {
      stopPulse();
      mode = 0;
      diameterUm = 12;
      tempC = 25;
      captures = [];
      probeU = null;
      showCharges = false;
      showConc = false;
      chargesBtn.setAttribute('aria-pressed', 'false');
      concBtn.setAttribute('aria-pressed', 'false');
      tabs.setActive(0);
      diamSlider.set(12);
      tempSlider.set(25);
      trials.clear();
      refresh();
    });

    api.io({
      getState: () => ({ mode, diameterUm, tempC, showCharges, showConc, probeU, capturesCount: captures.length }),
      setState: (patch = {}) => {
        if (typeof patch.mode === 'number') { mode = patch.mode; tabs.setActive(mode); }
        if (typeof patch.diameterUm === 'number') { diameterUm = patch.diameterUm; diamSlider.set(diameterUm); }
        if (typeof patch.tempC === 'number') { tempC = patch.tempC; tempSlider.set(tempC); }
        if (typeof patch.showCharges === 'boolean') {
          showCharges = patch.showCharges;
          chargesBtn.setAttribute('aria-pressed', String(showCharges));
        }
        if (typeof patch.showConc === 'boolean') {
          showConc = patch.showConc;
          concBtn.setAttribute('aria-pressed', String(showConc));
        }
        if (patch.stimulate) triggerImpulse();
        refresh();
      },
    });

    const gx0 = 374, gx1 = 604, gy0 = 216, gyTop = 68;
    const handleProbePointer = (e) => {
      const { x: lx, y: ly } = api.pointerXY(view, e);
      if (lx >= gx0 && lx <= gx1 && ly >= gyTop - 8 && ly <= gy0 + 12) {
        probeU = Math.max(0, Math.min(1, (lx - gx0) / (gx1 - gx0)));
        refresh();
      }
    };
    view.cv.style.cursor = 'crosshair';
    view.cv.addEventListener('pointerdown', handleProbePointer);
    view.cv.addEventListener('pointermove', (e) => {
      if (e.buttons) handleProbePointer(e);
    });

    function refresh() {
      const q = reflexActionAccount(mode, diameterUm, tempC);
      const cmp = compareReflex(captures.at(-2), captures.at(-1));
      const activeU = pulseU >= 0 ? pulseU : probeU;

      view.draw((ctx, c) => {
        const { draw } = api;
        ctx.fillStyle = c.plate;
        ctx.fillRect(0, 0, 640, 360);

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

        // Draw axon tube across y=132
        const tubeHalf = Math.max(10, Math.min(20, q.diameterUm * 1.0));
        const ay = 132;
        ctx.fillStyle = q.paraBlocked ? c.mark_soft : c.plate;
        ctx.strokeStyle = q.paraBlocked ? c.proton : c.electron;
        ctx.lineWidth = 2;
        draw.roundRect(ctx, 34, ay - tubeHalf, 264, tubeHalf * 2, 6);
        ctx.fill();
        ctx.stroke();

        // Voltage-gated Na+ (terracotta) and K+ (blue) channels along the axon nodes
        const waveX = pulseU >= 0 ? 44 + pulseU * 242 : -100;
        const gateXs = q.mode !== 1 ? [93, 145, 197, 245] : [76, 132, 188, 244];
        gateXs.forEach((gx, idx) => {
          const nearWave = waveX > 0 && Math.abs(gx - waveX) < 28 && !q.paraBlocked;
          ctx.fillStyle = idx % 2 === 0 ? c.proton : c.electron;
          draw.roundRect(ctx, gx - 4, ay - tubeHalf - 3, 8, 6, 2);
          ctx.fill();
          if (nearWave) {
            ctx.beginPath();
            ctx.arc(gx, ay - tubeHalf - 9, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = idx % 2 === 0 ? c.proton : c.electron;
            ctx.fill();
          }
        });

        if (q.mode !== 1) {
          for (const mx of [52, 104, 156, 208, 252]) {
            ctx.fillStyle = c.sheet;
            ctx.strokeStyle = c.electron;
            ctx.lineWidth = 1.6;
            draw.roundRect(ctx, mx, ay - tubeHalf - 6, 34, tubeHalf * 2 + 12, 4);
            ctx.fill();
            ctx.stroke();
          }
          draw.text(ctx, 'Myelin sheath (Schwann cells) + nodes of Ranvier', 166, ay - tubeHalf - 16, {
            size: 10.6,
            weight: 600,
            color: c.electron,
            align: 'center',
          });
        } else {
          draw.text(ctx, 'Unmyelinated membrane (continuous domino wave)', 166, ay - tubeHalf - 14, {
            size: 10.6,
            weight: 600,
            color: c.proton,
            align: 'center',
          });
        }

        // Traveling action potential glow pulse
        if (pulseU >= 0) {
          ctx.save();
          ctx.fillStyle = q.paraBlocked ? c.proton : c.green;
          ctx.globalAlpha = 0.28;
          draw.roundRect(ctx, Math.max(36, waveX - 18), ay - tubeHalf + 2, 36, tubeHalf * 2 - 4, 6);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(waveX, ay, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Optional Charges (+ / −) overlay strictly along exposed membrane nodes
        if (showCharges) {
          const chargeXs = q.mode !== 1 ? [44, 95, 147, 199, 247] : [48, 76, 104, 132, 160, 188, 216, 244, 272];
          for (const cx of chargeXs) {
            const depol = waveX > 0 && Math.abs(cx - waveX) < 28 && !q.paraBlocked;
            draw.text(ctx, depol ? '−' : '+', cx, ay - tubeHalf - 7, { size: 9, weight: 700, color: depol ? c.proton : c.electron, align: 'center' });
            draw.text(ctx, depol ? '+' : '−', cx, ay + 3.5, { size: 9, weight: 700, color: depol ? c.green : c.muted, align: 'center' });
          }
        }

        if (!q.paraBlocked) {
          draw.arrow(ctx, 44, ay, 286, ay, c.green, 2.3);
          draw.text(ctx, `Speed v = ${q.velocityMS.toFixed(1)} m/s (${q.diameterUm} µm, ${q.tempC} °C)`, 166, ay + tubeHalf + 22, {
            size: 11.4,
            weight: 700,
            color: c.green,
            align: 'center',
          });
        } else {
          draw.text(ctx, `BLOCKED AT ${q.tempC} °C: paraᵗˢ Na⁺ gates fail to open`, 166, ay + tubeHalf + 22, {
            size: 11.2,
            weight: 700,
            color: c.proton,
            align: 'center',
          });
        }

        if (showConc) {
          draw.text(ctx, 'Out: Na⁺ 145 mM · K⁺ 4 mM  |  In: Na⁺ 10 mM · K⁺ 140 mM', 166, 184, {
            size: 9.2,
            weight: 700,
            color: c.electron,
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
              ? `${q.totalLatencyMs.toFixed(1)}${trials.noise ? ' ±4.2' : ''} ms${q.rulerDropCm != null && !trials.noise ? ` (ruler ${q.rulerDropCm} cm)` : ''}`
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

        // Right panel: Action Potential Waveform + Probe + Captured Trial Comparison (x=328..624, y=14..344)
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
        const steps = 80;
        for (let si = 0; si <= steps; si++) {
          const su = si / steps;
          const sx = gx0 + su * (gx1 - gx0);
          const sy = yForMv(waveformMv(su, q));
          if (si === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Synchronized pulse cursor OR draggable Data Probe on oscilloscope
        if (activeU != null) {
          const px = gx0 + activeU * (gx1 - gx0);
          const mv = waveformMv(activeU, q);
          const py = yForMv(mv);
          ctx.strokeStyle = c.neutron;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([3, 2]);
          ctx.beginPath();
          ctx.moveTo(px, gyTop);
          ctx.lineTo(px, gy0);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(px, py, 4.6, 0, Math.PI * 2);
          ctx.fillStyle = c.neutron;
          ctx.fill();
          draw.text(
            ctx,
            `${(activeU * 5).toFixed(1)} ms · ${mv >= 0 ? '+' : ''}${mv.toFixed(0)} mV (${phaseNameFor(activeU, q)})`,
            488,
            56,
            { size: 9.2, weight: 700, color: c.neutron, align: 'center' }
          );
        } else {
          draw.text(ctx, 'Click/drag plot for Data Probe · or Stimulate Neuron', 488, 56, {
            size: 9.0,
            color: c.muted,
            align: 'center',
          });
        }

        draw.text(
          ctx,
          q.paraBlocked
            ? 'Sub-threshold blip only (Na⁺ channels blocked)'
            : `Peak ${q.peakMv > 0 ? '+' : ''}${q.peakMv} mV (Na⁺ influx) → K⁺ repolarisation`,
          488,
          240,
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
          const shortNames = ['Myelinated', 'Unmyelinated', 'Voluntary', 'paraᵗˢ'];
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
      const capLabel = captures.length === 1 ? '1 captured trial' : `${captures.length} captured trials`;
      say(
        `${q.modeLabel} (${q.diameterUm} µm, ${q.tempC} °C): conduction speed ${q.velocityMS.toFixed(1)} m/s · peak ${q.peakMv > 0 ? '+' : ''}${q.peakMv} mV · illustrative total ${latTxt}${rulerTxt}. ${capLabel}. ${cmp.reason} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  { label: 'Investigate reflex arcs & action potentials', three: false, static: true }
);
