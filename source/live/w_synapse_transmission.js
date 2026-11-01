// Chapter 9 Widget 2: Chemical synapse ultrastructure, 4-step sequence & one-way conduction test (0610 14.1.7–14.1.10).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  SYNAPSE_MODES,
  synapseAccount,
  captureSynapse,
  compareSynapse,
} from './coordination_model.js';

Live.register(
  'synapse_transmission',
  (stage, params, api) => {
    let mode = 0;
    let stimFreqHz = 40;
    let cleftWidthNm = 20;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Interactive chemical synapse investigator: vesicle release, diffusion across the synaptic gap, receptor binding and one-way conduction'
    );

    const say = api.readout();
    const tabs = api.tabs(
      SYNAPSE_MODES.map((m) => m.label),
      (idx) => {
        mode = idx;
        refresh();
      },
      0
    );

    const freqSlider = api.slider('Stimulus frequency', {
      min: 10,
      max: 100,
      step: 10,
      value: stimFreqHz,
      fmt: (v) => `${v} Hz`,
      onInput: (v) => {
        stimFreqHz = v;
        refresh();
      },
    });

    const cleftSlider = api.slider('Synaptic gap width', {
      min: 15,
      max: 60,
      step: 5,
      value: cleftWidthNm,
      fmt: (v) => `${v} nm`,
      onInput: (v) => {
        cleftWidthNm = v;
        refresh();
      },
    });

    api.button('Forward relay (40 Hz, 20 nm)', () => {
      mode = 0;
      stimFreqHz = 40;
      cleftWidthNm = 20;
      tabs.setActive(0);
      freqSlider.set(40);
      cleftSlider.set(20);
      refresh();
    });

    api.button('Reverse preset (Post → Pre, 40 Hz)', () => {
      mode = 1;
      stimFreqHz = 40;
      cleftWidthNm = 20;
      tabs.setActive(1);
      freqSlider.set(40);
      cleftSlider.set(20);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureSynapse(synapseAccount(mode, stimFreqHz, cleftWidthNm));
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const q = synapseAccount(mode, stimFreqHz, cleftWidthNm);
      const cmp = compareSynapse(captures.at(-2), captures.at(-1));

      view.draw((ctx, c) => {
        const { draw } = api;

        // Left panel: Synapse physical diagram (x=16..336, y=14..344)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 16, 14, 320, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, `1 · ${q.modeLabel.toUpperCase()}`, 176, 36, {
          size: 13,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, q.direction, 176, 54, {
          size: 11,
          color: c.muted,
          align: 'center',
        });

        const gapPx = Math.round(28 + (q.cleftWidthNm - 15) * 0.7);
        const preRight = 148;
        const postLeft = preRight + gapPx;

        ctx.fillStyle = c.plate;
        ctx.strokeStyle = c.electron;
        ctx.lineWidth = 2;
        draw.roundRect(ctx, 28, 72, preRight - 28, 192, 14);
        ctx.fill();
        ctx.stroke();
        draw.text(ctx, 'Presynaptic knob', (28 + preRight) / 2, 92, {
          size: 11.2,
          weight: 700,
          color: c.electron,
          align: 'center',
        });
        draw.text(ctx, `${q.vesiclesFused} vesicles fuse`, (28 + preRight) / 2, 110, {
          size: 10.5,
          color: c.ink,
          align: 'center',
        });

        for (const [vx, vy] of [
          [62, 144],
          [108, 144],
          [62, 186],
          [108, 186],
          [85, 224],
        ]) {
          ctx.beginPath();
          ctx.arc(vx, vy, 12, 0, Math.PI * 2);
          ctx.fillStyle = c.sheet;
          ctx.fill();
          ctx.strokeStyle = c.electron;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = c.proton;
          ctx.fill();
        }

        draw.text(ctx, `${q.cleftWidthNm} nm`, (preRight + postLeft) / 2, 66, {
          size: 10.5,
          weight: 700,
          color: c.muted,
          align: 'center',
        });
        if (q.vesiclesFused > 0) {
          draw.arrow(ctx, preRight + 4, 168, postLeft - 4, 168, c.proton, 2);
          for (let i = 0; i < Math.min(10, q.vesiclesFused); i++) {
            const px = preRight + 8 + ((i * 17) % Math.max(10, gapPx - 16));
            const py = 118 + i * 13;
            ctx.beginPath();
            ctx.arc(px, py, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = c.proton;
            ctx.fill();
          }
        } else {
          draw.text(ctx, '0 release', (preRight + postLeft) / 2, 168, {
            size: 10.5,
            weight: 700,
            color: c.proton,
            align: 'center',
          });
        }

        ctx.fillStyle = c.plate;
        ctx.strokeStyle = c.green;
        ctx.lineWidth = 2;
        draw.roundRect(ctx, postLeft, 72, 324 - postLeft, 192, 14);
        ctx.fill();
        ctx.stroke();
        draw.text(ctx, 'Postsynaptic', (postLeft + 324) / 2, 92, {
          size: 11.2,
          weight: 700,
          color: c.green,
          align: 'center',
        });
        draw.text(ctx, `${q.boundReceptorsPct}% receptors bound`, (postLeft + 324) / 2, 110, {
          size: 10.2,
          color: c.ink,
          align: 'center',
        });

        for (const ry of [124, 156, 188]) {
          ctx.fillStyle = q.mode === 2 ? c.mark_soft : c.sheet;
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.5;
          draw.roundRect(ctx, postLeft, ry, 16, 18, 4);
          ctx.fill();
          ctx.stroke();
        }

        draw.text(
          ctx,
          q.postImpulseFired ? 'Impulse stimulated' : 'No impulse fired',
          (postLeft + 324) / 2,
          230,
          {
            size: 10.2,
            weight: 700,
            color: q.postImpulseFired ? c.green : c.proton,
            align: 'center',
          }
        );
        draw.text(
          ctx,
          q.postImpulseFired ? '(Vm ≥ −55 mV)' : '(sub-threshold)',
          (postLeft + 324) / 2,
          246,
          {
            size: 9.8,
            color: q.postImpulseFired ? c.green : c.proton,
            align: 'center',
          }
        );

        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 28, 274, 296, 58, 8);
        ctx.fill();
        draw.text(ctx, '0610 14.1.10 One-way rule:', 176, 292, {
          size: 11.2,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, 'This excitatory relay releases transmitter', 176, 309, {
          size: 10.6,
          color: c.muted,
          align: 'center',
        });
        draw.text(ctx, 'then receives it on the postsynaptic side.', 176, 324, {
          size: 10.6,
          color: c.muted,
          align: 'center',
        });

        // Right panel: 4-Step Sequence / Postsynaptic EPSP & Captures (x=348..624, y=14..344)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 348, 14, 276, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '2 · POSTSYNAPTIC RESPONSE & LEDGER', 486, 36, {
          size: 12.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        const metrics = [
          ['1. Vesicles fused:', `${q.vesiclesFused} (${q.moleculesReleased.toLocaleString()} ACh)`],
          ['2. Cleft diffusion delay:', `${q.cleftDelayMs} ms (${q.cleftWidthNm} nm gap)`],
          ['3. Receptors bound:', `${q.boundReceptorsPct}%`],
          ['4. Postsynaptic Vm:', `${q.postPotentialMv} mV (rest −70 mV)`],
          ['5. Next neurone spike:', q.postImpulseFired ? 'YES (fires impulse)' : 'NO (silent)'],
        ];
        metrics.forEach(([k, v], i) => {
          const ry = 70 + i * 28;
          ctx.fillStyle = c.plate;
          draw.roundRect(ctx, 360, ry - 16, 252, 24, 5);
          ctx.fill();
          draw.text(ctx, k, 368, ry, { size: 11, weight: 600, color: c.ink });
          draw.text(ctx, v, 604, ry, {
            size: 11,
            weight: 700,
            color: i === 4 ? (q.postImpulseFired ? c.green : c.proton) : c.electron,
            align: 'right',
          });
        });

        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 360, 232, 252, 100, 8);
        ctx.fill();
        draw.text(ctx, `Captured synapse trials (${captures.length})`, 486, 252, {
          size: 11.5,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        if (captures.length === 0) {
          draw.text(ctx, 'Capture Forward (Pre → Post) and', 486, 276, {
            size: 10.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'Reverse (Post → Pre) trials to prove', 486, 294, {
            size: 10.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'why impulses travel one way only.', 486, 312, {
            size: 10.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          const shortNames = ['Forward', 'Reverse', 'Curare', 'AChE-block'];
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 278 + idx * 22;
            draw.text(
              ctx,
              `#${idx + 1}: ${shortNames[cap.mode]} → ${cap.vesiclesFused} ves, ${cap.postPotentialMv} mV (${cap.postImpulseFired ? 'Fires' : 'Blocked'})`,
              486,
              cy,
              { size: 10, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      const history = captures
        .map(
          (c, i) =>
            `#${i + 1} ${c.modeLabel} (${c.vesiclesFused} vesicles, ${c.boundReceptorsPct}% bound → ${c.postImpulseFired ? 'Fires' : 'Silent'})`
        )
        .join(' | ');
      say(
        `${q.modeLabel} (${q.stimFreqHz} Hz, ${q.cleftWidthNm} nm cleft): ${q.vesiclesFused} vesicles released · ${q.boundReceptorsPct}% receptors bound · postsynaptic Vm ${q.postPotentialMv} mV (${q.postImpulseFired ? 'Impulse stimulated' : 'No impulse'}). ${captures.length} captured trials. ${cmp.reason} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  { label: 'Investigate chemical synapse & one-way relay', three: false, static: true }
);
