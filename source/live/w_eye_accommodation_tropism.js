// Chapter 9 Widget 3: Eye accommodation, pupil reflex & plant shoot/root auxin tropisms (0610 14.2 & 14.5).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  EYE_TROPISM_MODES,
  eyeTropismAccount,
  captureEyeTropism,
  compareEyeTropism,
} from './coordination_model.js';

Live.register(
  'eye_accommodation_tropism',
  (stage, params, api) => {
    let mode = 0;
    let objectDistCm = 35;
    let lightIntensityPct = 75;
    const captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'Interactive eye accommodation, pupil reflex and plant shoot/root auxin tropism investigator'
    );

    const say = api.readout();
    const tabs = api.tabs(
      EYE_TROPISM_MODES.map((m) => m.label),
      (idx) => {
        mode = idx;
        refresh();
      },
      0
    );

    const distSlider = api.slider('Object distance', {
      min: 25,
      max: 500,
      step: 25,
      value: objectDistCm,
      fmt: (v) => `${v} cm`,
      onInput: (v) => {
        objectDistCm = v;
        refresh();
      },
    });

    const lightSlider = api.slider('Light intensity', {
      min: 10,
      max: 100,
      step: 10,
      value: lightIntensityPct,
      fmt: (v) => `${v}%`,
      onInput: (v) => {
        lightIntensityPct = v;
        refresh();
      },
    });

    api.button('Near book (25 cm)', () => {
      mode = 0;
      objectDistCm = 25;
      tabs.setActive(0);
      distSlider.set(25);
      refresh();
    });

    api.button('Distant horizon (400 cm)', () => {
      mode = 0;
      objectDistCm = 400;
      tabs.setActive(0);
      distSlider.set(400);
      refresh();
    });

    api.button('Capture trial', () => {
      const snap = captureEyeTropism(eyeTropismAccount(mode, objectDistCm, lightIntensityPct));
      if (snap) captures.push(snap);
      refresh();
    });

    api.button('Clear trials', () => {
      captures.length = 0;
      refresh();
    });

    function refresh() {
      const q = eyeTropismAccount(mode, objectDistCm, lightIntensityPct);
      const cmp = compareEyeTropism(captures.at(-2), captures.at(-1));

      view.draw((ctx, c) => {
        const { draw } = api;

        // Left panel: Visual diagram of Eye or Plant Shoot/Root (x=16..328, y=14..344)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 16, 14, 312, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, `1 · ${q.modeLabel.toUpperCase()}`, 172, 36, {
          size: 12.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (q.mode === 0 || q.mode === 1) {
          const cx = 102,
            cy = 148;
          const ringR = Math.round(q.ciliaryRingRadiusMm * 8.5);
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.fillStyle = c.plate;
          ctx.fill();
          ctx.strokeStyle = q.isNear ? c.proton : c.electron;
          ctx.lineWidth = q.isNear ? 4.5 : 2.2;
          ctx.stroke();

          const lensR = 22;
          for (let a = 0; a < 360; a += 45) {
            const rad = (a * Math.PI) / 180;
            ctx.beginPath();
            ctx.moveTo(cx + lensR * Math.cos(rad), cy + lensR * Math.sin(rad));
            ctx.lineTo(cx + (ringR - 3) * Math.cos(rad), cy + (ringR - 3) * Math.sin(rad));
            ctx.strokeStyle = c.muted;
            ctx.lineWidth = q.isNear ? 1.2 : 2.0;
            if (q.isNear) ctx.setLineDash([3, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.beginPath();
          ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
          ctx.fillStyle = c.sheet;
          ctx.fill();
          ctx.strokeStyle = c.green;
          ctx.lineWidth = 2;
          ctx.stroke();

          const pupR = Math.max(5, Math.round(q.pupilDiameterMm * 2.2));
          ctx.beginPath();
          ctx.arc(cx, cy, pupR, 0, Math.PI * 2);
          ctx.fillStyle = c.ink;
          ctx.fill();

          draw.text(ctx, `Ciliary ring & pupil (${q.pupilDiameterMm} mm)`, cx, 214, {
            size: 10.6,
            weight: 600,
            color: c.ink,
            align: 'center',
          });

          const lx = 244,
            ly = 148;
          const bulge = Math.round((q.lensThicknessMm - 3.0) * 14);
          ctx.beginPath();
          ctx.moveTo(lx, ly - 44);
          ctx.quadraticCurveTo(lx + bulge, ly, lx, ly + 44);
          ctx.quadraticCurveTo(lx - bulge, ly, lx, ly - 44);
          ctx.closePath();
          ctx.fillStyle = c.plate;
          ctx.fill();
          ctx.strokeStyle = c.green;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          draw.text(ctx, `Lens ${q.lensThicknessMm} mm`, lx, 214, {
            size: 10.8,
            weight: 700,
            color: c.green,
            align: 'center',
          });
        } else {
          draw.text(
            ctx,
            q.mode === 2
              ? `Unilateral light from right (${q.lightIntensityPct}%)`
              : 'Horizontal seedling in gravity (↓ g)',
            172,
            62,
            { size: 11, weight: 600, color: c.proton, align: 'center' }
          );
          ctx.fillStyle = c.plate;
          draw.roundRect(ctx, 36, 82, 272, 130, 8);
          ctx.fill();
          draw.text(
            ctx,
            `Shaded / Lower side auxin: ${q.shadedAuxinPct}%`,
            172,
            110,
            { size: 12, weight: 700, color: c.green, align: 'center' }
          );
          draw.text(
            ctx,
            `Lit / Upper side auxin: ${q.litOrUpperAuxinPct}%`,
            172,
            134,
            { size: 11.5, color: c.electron, align: 'center' }
          );
          draw.text(
            ctx,
            `Shoot elongation: ${q.shadedElongationUmHr} vs ${q.litElongationUmHr} µm/h`,
            172,
            162,
            { size: 11.2, weight: 600, color: c.ink, align: 'center' }
          );
          draw.text(
            ctx,
            q.mode === 2
              ? `Shoot bends +${q.shootBendAngleDeg}° towards light`
              : `Shoot bends +${q.shootBendAngleDeg}° UP · Root ${q.rootBendAngleDeg}° DOWN`,
            172,
            190,
            { size: 11.5, weight: 700, color: c.proton, align: 'center' }
          );
        }

        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 28, 232, 288, 100, 8);
        ctx.fill();
        draw.text(ctx, 'Mechanical coupling summary', 172, 252, {
          size: 11.5,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        const lines =
          q.mode <= 1
            ? [
                `• Ciliary muscle: ${q.ciliaryState}`,
                `• Suspensory ligaments: ${q.ligamentTension}`,
                `• Lens shape: ${q.lensShape}`,
                `• Iris circular: ${q.circularIrisMuscle} | radial: ${q.radialIrisMuscle}`,
              ]
            : [
                '(a) Auxin made in shoot tip',
                '(b) Diffuses downward from tip',
                `(c) Unequal split: ${q.shadedAuxinPct}% on shaded/lower side`,
                '(d) Stimulates shoot cell elongation',
              ];
        lines.forEach((ln, i) => {
          draw.text(ctx, ln, 38, 272 + i * 15, { size: 10.4, color: c.ink });
        });

        // Right panel: Quantitative Readouts & Captured Trials (x=340..624, y=14..344)
        ctx.fillStyle = c.sheet;
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1.2;
        draw.roundRect(ctx, 340, 14, 284, 332, 10);
        ctx.fill();
        ctx.stroke();

        draw.text(ctx, '2 · QUANTITATIVE LEDGER', 482, 36, {
          size: 12.8,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const ledger = [
          ['Object distance:', `${q.objectDistCm} cm (${q.isNear ? 'Near' : 'Distant'})`],
          ['Optical power:', `${q.totalPowerDioptres} D (Lens ${q.lensPowerDioptres} D)`],
          ['Lens thickness:', `${q.lensThicknessMm} mm`],
          ['Pupil diameter:', `${q.pupilDiameterMm} mm (${q.lightIntensityPct}% light)`],
          ['Auxin shaded/lower:', `${q.shadedAuxinPct}% → +${q.shootBendAngleDeg}° bend`],
        ];
        ledger.forEach(([k, v], i) => {
          const ry = 68 + i * 28;
          ctx.fillStyle = c.plate;
          draw.roundRect(ctx, 352, ry - 16, 260, 24, 5);
          ctx.fill();
          draw.text(ctx, k, 360, ry, { size: 10.8, weight: 600, color: c.ink });
          draw.text(ctx, v, 604, ry, { size: 10.8, weight: 700, color: c.electron, align: 'right' });
        });

        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 352, 224, 260, 108, 8);
        ctx.fill();
        draw.text(ctx, `Captured trials (${captures.length})`, 482, 244, {
          size: 11.5,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        if (captures.length === 0) {
          draw.text(ctx, 'Capture a Near object (≤60 cm) and', 482, 268, {
            size: 10.6,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'a Distant object (≥200 cm) to compare', 482, 286, {
            size: 10.6,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'ciliary ring, ligament & lens states.', 482, 304, {
            size: 10.6,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 270 + idx * 24;
            draw.text(
              ctx,
              `#${idx + 1}: ${cap.objectDistCm} cm (${cap.totalPowerDioptres} D, ${cap.lensThicknessMm} mm) · pupil ${cap.pupilDiameterMm} mm`,
              482,
              cy,
              { size: 9.8, weight: 600, color: idx === 0 ? c.electron : c.proton, align: 'center' }
            );
          });
        }
      });

      let summary = '';
      if (q.mode === 0) {
        summary = `Accommodation at ${q.objectDistCm} cm: ciliary muscle ${q.ciliaryState} · suspensory ligaments ${q.ligamentTension} · lens ${q.lensThicknessMm} mm (${q.totalPowerDioptres} D total)`;
      } else if (q.mode === 1) {
        summary = `Pupil reflex at ${q.lightIntensityPct}% light: circular muscle ${q.circularIrisMuscle} · radial muscle ${q.radialIrisMuscle} · pupil ${q.pupilDiameterMm} mm`;
      } else if (q.mode === 2) {
        summary = `Shoot phototropism (${q.lightIntensityPct}% lateral light): shaded side gets ${q.shadedAuxinPct}% auxin (${q.shadedElongationUmHr} µm/h vs ${q.litElongationUmHr} µm/h lit) → bends +${q.shootBendAngleDeg}° towards light`;
      } else {
        summary = `Horizontal seedling gravitropism: lower side gets ${q.shadedAuxinPct}% auxin → shoot elongates faster below (+${q.shootBendAngleDeg}° up) while root is inhibited below (${q.rootBendAngleDeg}° down)`;
      }
      const history = captures
        .map((c, i) => `#${i + 1} ${c.modeLabel} (${c.objectDistCm} cm, ${c.lightIntensityPct}% light)`)
        .join(' | ');
      say(`${summary}. ${captures.length} captured trials. ${cmp.reason} Saved: ${history || 'none'}.`);
    }

    refresh();
    return {};
  },
  { label: 'Investigate eye accommodation, pupil reflex & auxin', three: false, static: true }
);
