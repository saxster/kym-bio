import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import { rateAccount, compareTrials } from './photosynthesis_model.js';

Live.register('limiting_lab', (stage, params, api) => {
  let light = 20;
  let carbon = 80;
  let temperature = 25;
  let trials = [];
  const k = makeCanvas(
    api,
    640,
    450,
    'Invented limiting-factor investigation. Light, carbon dioxide and temperature impose chosen capacities; run and retain two comparisons. Gross and net oxygen are separate relative model accounts, not bubbles or measured plant data.'
  );
  const say = api.readout();
  const sonify = api.sonifyToggle('O₂ bubble pulse');
  const dataTable = api.trials({
    columns: ['#', 'Light', 'CO₂', '°C', 'Gross', 'Net O₂', 'Limiting'],
    maxRows: 6,
    allowNoise: true,
    noiseLabel: 'Pondweed bubble variability',
    onNoiseChange: () => refresh(),
    plotColumn: 'Net O₂',
  });

  const lightSlider = api.slider('Light capacity', {
    min: 0,
    max: 100,
    step: 5,
    value: 20,
    fmt: (v) => `${v} chosen units`,
    onInput: (v) => {
      light = v;
      refresh();
    },
  });
  const co2Slider = api.slider('CO₂ capacity', {
    min: 0,
    max: 100,
    step: 5,
    value: 80,
    fmt: (v) => `${v} chosen units`,
    onInput: (v) => {
      carbon = v;
      refresh();
    },
  });
  const tempSlider = api.slider('Temperature', {
    min: 5,
    max: 45,
    step: 1,
    value: 25,
    fmt: (v) => `${v} °C`,
    onInput: (v) => {
      temperature = v;
      refresh();
    },
  });

  api.button('Capture trial', () => {
    const acct = rateAccount(light, carbon, temperature);
    trials = [...trials.slice(-1), { ...acct }];
    const rGen = api.rng(503 + dataTable.rows().length * 29 + light + carbon + temperature);
    const noiseDelta = dataTable.noise ? (rGen() - 0.5) * 4.4 : 0;
    const netBubble = Math.max(-10, acct.net + noiseDelta);
    dataTable.record([
      dataTable.rows().length + 1,
      acct.L,
      acct.C,
      acct.T,
      acct.gross.toFixed(1),
      netBubble.toFixed(1),
      acct.limits.join(' + '),
    ]);
    if (sonify.active && !api.reduced && acct.gross > 0) {
      api.audio().boop({ streak: Math.min(12, Math.round(acct.gross / 10)), baseFreq: 310, gain: 0.08 });
    }
    refresh();
  });

  api.button('Clear trials', () => {
    trials = [];
    dataTable.clear();
    refresh();
  });

  api.reset(() => {
    light = 20;
    carbon = 80;
    temperature = 25;
    trials = [];
    lightSlider.set(20);
    co2Slider.set(80);
    tempSlider.set(25);
    dataTable.clear();
    refresh();
  });

  api.io({
    getState: () => ({ light, carbon, temperature, trialsCount: trials.length }),
    setState: (patch = {}) => {
      if (typeof patch.light === 'number') { light = patch.light; lightSlider.set(light); }
      if (typeof patch.carbon === 'number') { carbon = patch.carbon; co2Slider.set(carbon); }
      if (typeof patch.temperature === 'number') { temperature = patch.temperature; tempSlider.set(temperature); }
      refresh();
    },
  });

  function refresh() {
    const q = rateAccount(light, carbon, temperature);
    const pair = compareTrials(...trials);
    k.draw((ctx, c) => {
      const t = (s, x, y, size = 14, col = c.ink, align = 'left', weight = 400) =>
        api.draw.text(ctx, s, x, y, { size, color: col, align, weight });
      ctx.fillStyle = c.plate;
      ctx.fillRect(0, 0, 640, 450);

      t('What caps photosynthesis right now?', 320, 24, 18.5, c.ink, 'center', 700);

      // Left Card: Liebig Bottleneck Capacity Gauges & Net Compensation Balance (x=18..320, y=38..314)
      ctx.fillStyle = c.sheet;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1.2;
      api.draw.roundRect(ctx, 18, 38, 302, 276, 10);
      ctx.fill();
      ctx.stroke();

      t('1 · LIEBIG BOTTLENECK GAUGES', 169, 58, 12, c.ink, 'center', 700);
      const factors = [
        ['Light', q.L, q.limits.includes('light intensity')],
        ['CO₂', q.C, q.limits.includes('CO₂ supply')],
        ['Temp', q.thermal, q.limits.includes('temperature')],
      ];
      const barBaseY = 204;
      const barTopY = 82;
      const barH = barBaseY - barTopY;
      factors.forEach(([label, val, isLim], i) => {
        const cx = 74 + i * 95;
        t(label, cx, 75, 11.5, isLim ? c.proton : c.ink, 'center', 700);
        ctx.fillStyle = c.plate;
        ctx.strokeStyle = isLim ? c.proton : c.rule;
        ctx.lineWidth = isLim ? 1.8 : 1;
        ctx.fillRect(cx - 20, barTopY, 40, barH);
        ctx.strokeRect(cx - 20, barTopY, 40, barH);
        const hFill = Math.max(0, Math.min(100, val)) / 100 * barH;
        ctx.fillStyle = isLim ? c.proton : c.green;
        ctx.fillRect(cx - 19, barBaseY - hFill, 38, hFill);
        t(val.toFixed(0), cx, barBaseY + 18, 12.5, c.ink, 'center', 700);
      });

      // Dashed bottleneck cap line across all three gauges
      const capY = barBaseY - (Math.max(0, Math.min(100, q.gross)) / 100) * barH;
      ctx.strokeStyle = c.proton;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(40, capY);
      ctx.lineTo(298, capY);
      ctx.stroke();
      ctx.setLineDash([]);

      t(`Bottleneck: ${q.limits.join(' + ')}`, 169, 242, 12.5, c.proton, 'center', 700);

      // Compensation Point Bar (Gross vs 10 respiration cost)
      t(`Gross ${q.gross.toFixed(1)} − Resp 10 = Net ${q.net.toFixed(1)}${dataTable.noise ? ' ±2.2' : ''}`, 169, 266, 12, c.ink, 'center', 700);
      ctx.fillStyle = c.plate;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1;
      ctx.fillRect(38, 276, 262, 14);
      ctx.strokeRect(38, 276, 262, 14);
      const grossW = (Math.max(0, Math.min(100, q.gross)) / 100) * 262;
      ctx.fillStyle = q.net >= 0 ? c.green : c.proton;
      ctx.fillRect(39, 277, Math.max(0, grossW - 2), 12);
      const compX = 38 + (10 / 100) * 262;
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(compX, 273);
      ctx.lineTo(compX, 294);
      ctx.stroke();
      t('Comp = 10', compX + 4, 305, 9.5, c.muted, 'left', 600);

      // Right Card: Live Blackman Response Curve + O₂ Bubble Column (x=332..622, y=38..314)
      ctx.fillStyle = c.sheet;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1.2;
      api.draw.roundRect(ctx, 332, 38, 290, 276, 10);
      ctx.fill();
      ctx.stroke();

      t('2 · BLACKMAN RESPONSE CURVE (vs Light)', 466, 58, 12, c.ink, 'center', 700);
      const gx0 = 368, gx1 = 564, gy0 = 268, gyTop = 86;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(gx0, gyTop);
      ctx.lineTo(gx0, gy0);
      ctx.lineTo(gx1, gy0);
      ctx.stroke();

      // Curve R(L) at current C & T
      ctx.strokeStyle = c.green;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let lx = 0; lx <= 100; lx += 5) {
        const pt = rateAccount(lx, carbon, temperature);
        const px = gx0 + (lx / 100) * (gx1 - gx0);
        const py = gy0 - (pt.gross / 100) * (gy0 - gyTop);
        if (lx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current active sample dot
      const dotX = gx0 + (light / 100) * (gx1 - gx0);
      const dotY = gy0 - (q.gross / 100) * (gy0 - gyTop);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5.2, 0, Math.PI * 2);
      ctx.fillStyle = c.proton;
      ctx.fill();

      // Captured trials overlay
      trials.forEach((tr, ti) => {
        const tx = gx0 + (tr.L / 100) * (gx1 - gx0);
        const ty = gy0 - (tr.gross / 100) * (gy0 - gyTop);
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fillStyle = c.electron;
        ctx.fill();
        t(`T${ti + 1}`, tx, ty - 8, 9.5, c.electron, 'center', 700);
      });
      t('0', gx0, gy0 + 14, 9.5, c.muted, 'center');
      t('Light → 100', (gx0 + gx1) / 2, gy0 + 28, 10, c.muted, 'center');
      t('100', gx1, gy0 + 14, 9.5, c.muted, 'center');
      t('100', gx0 - 5, gyTop + 4, 9.5, c.muted, 'right');

      // Pondweed O₂ Bubble Column on right margin of chart card
      ctx.fillStyle = c.plate;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1;
      api.draw.roundRect(ctx, 578, 86, 30, 182, 14);
      ctx.fill();
      ctx.stroke();
      const bCount = Math.max(0, Math.round(Math.max(0, q.net) / 11));
      ctx.fillStyle = c.electron;
      for (let bi = 0; bi < bCount; bi++) {
        ctx.beginPath();
        ctx.arc(593 + ((bi % 2) * 2 - 1) * 3.5, 254 - bi * 19, 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
      t('O₂', 593, 282, 10, c.ink, 'center', 700);

      // Bottom Card: Captured Trials Ledger (x=18..622, y=324..438)
      ctx.fillStyle = c.sheet;
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1.2;
      api.draw.roundRect(ctx, 18, 324, 604, 92, 10);
      ctx.fill();
      ctx.stroke();

      t('Captured trials (Light / CO₂ / °C → gross; net)', 32, 346, 13.5, c.ink, 'left', 700);
      trials.forEach((a, i) =>
        t(
          `T${i + 1}: L=${a.L}, CO₂=${a.C}, ${a.T}°C → gross ${a.gross.toFixed(1)}, net ${a.net.toFixed(1)} (${a.limits.join('+')})`,
          32,
          372 + i * 22,
          12.8,
          i === 0 ? c.electron : c.green,
          'left',
          600
        )
      );
      if (!trials.length) t('No trial captured. Moving controls does not run a trial.', 32, 376, 13.5, c.muted);
      t('Invented capacities · relative rate units · no calibrated gas volume or time', 320, 438, 12, c.muted, 'center');
    });
    const receipt = trials.map((a) => `${a.L}/${a.C}/${a.T}: gross ${a.gross}, net ${a.net}`).join(' | ');
    const done =
      trials.length === 2 &&
      trials[0].L === 20 &&
      trials[0].C === 80 &&
      trials[0].T === 25 &&
      trials[1].L === 60 &&
      trials[1].C === 80 &&
      trials[1].T === 25;
    const countLabel = trials.length === 1 ? '1 captured trial' : `${trials.length} captured trials`;
    say(
      `Current: gross ${q.gross.toFixed(1)}; net ${q.net.toFixed(1)}; limiting ${q.limits.join(' + ')}. ${countLabel}. ${pair.reason} ${receipt} ${
        done ? 'Controlled light comparison completed.' : ''
      } R = min(L, C, max(0, 100 − ((T−25)/2)²)); net = R − 10. All capacities and respiratory baseline invented; new independently prepared sample at each temperature, no damage/recovery history. Negative net means oxygen consumption exceeds production; it does not imply negative photosynthesis.`
    );
  }
  refresh();
  return {};
}, { label: 'Run a controlled limiting-factor comparison', three: false, static: true });
