import { Live } from './core.js';

Live.register('redi_jars', (stage, params, api) => {
  const c = api.colors();
  const k = api.canvas(640, 320, 'Interactive simulation of Francesco Redi’s 1668 jars and Louis Pasteur’s 1859 swan-neck flask');
  const say = api.readout();

  let mode = 0; // 0 = Redi's 3 Jars, 1 = Pasteur's Swan-Neck Flask
  let hours = 36;
  let tiltDeg = 0;

  api.tabs(['1. Redi’s Three Jars (1668)', '2. Pasteur’s Swan-Neck (1859)'], (idx) => {
    mode = idx;
    updateReadout();
  });

  api.slider('Elapsed time', {
    min: 0, max: 72, step: 2, value: hours,
    fmt: (v) => `${v} hours`,
    onInput: (v) => { hours = v; updateReadout(); },
  });

  api.slider('Swan-neck tilt angle', {
    min: 0, max: 95, step: 5, value: tiltDeg,
    fmt: (v) => `${v}°`,
    onInput: (v) => { tiltDeg = v; updateReadout(); },
  });

  function updateReadout() {
    if (mode === 0) {
      if (hours < 12) {
        say(`At <b>${hours} hours</b>: Flies are attracted by the scent rising from the open jar and the gauze-covered jar. In Jar 3, the fine Naples gauze stops the flies at the top mesh.`);
      } else {
        say(`At <b>${hours} hours</b>: Maggots hatch on the meat <b>only in Jar 1 (open)</b>. Jar 3 (gauze) has the exact same fresh air as Jar 1, yet zero maggots on the meat—eggs sit visibly on top of the gauze.`);
      }
    } else {
      if (tiltDeg < 65) {
        say(`Swan-neck at <b>${tiltDeg}°</b> (${hours} h): Room air flows in and out of the open tip, but dust and bacterial spores settle in the bottom U-bend. The boiled broth stays <b>100% sterile and clear</b>.`);
      } else {
        say(`Swan-neck tilted to <b>${tiltDeg}°</b> (${hours} h): Broth splashes into the dusty U-bend and carries trapped bacterial spores back into the bulb—turning cloudy with multiplying microbes!`);
      }
    }
  }

  api.loop((dt, t) => {
    const ctx = k.ctx;
    ctx.clearRect(0, 0, 640, 320);
    ctx.fillStyle = c.paper;
    ctx.fillRect(0, 0, 640, 320);

    if (mode === 0) {
      const jars = [
        { x: 40, title: 'Jar 1: Open (Control)', kind: 'open' },
        { x: 245, title: 'Jar 2: Wax-Sealed', kind: 'sealed' },
        { x: 450, title: 'Jar 3: Fine Gauze', kind: 'gauze' },
      ];
      jars.forEach((j, idx) => {
        api.draw.roundRect(ctx, j.x, 22, 150, 260, 8, c.plate, c.rule);
        api.draw.text(ctx, j.title, j.x + 75, 42, { size: 13, weight: 700, align: 'center', color: c.ink });

        // Glass jar body
        const jx = j.x + 25, jy = 86, jw = 100, jh = 140;
        api.draw.roundRect(ctx, jx, jy, jw, jh, 10, c.sheet, c.ink);
        // Meat at bottom
        ctx.fillStyle = c.proton;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.ellipse(jx + 50, jy + 122, 36, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = c.proton;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Flies buzzing
        for (let f = 0; f < 3; f++) {
          const phase = t * 2.2 + f * 2.1 + idx;
          let fx = jx + 50 + Math.sin(phase) * 28;
          let fy = 62 + Math.cos(phase * 1.3) * 10;
          if (j.kind === 'open' && hours > 8) {
            fy = jy + 35 + ((f * 29) % 65) + Math.sin(phase) * 8;
          }
          ctx.fillStyle = c.ink;
          ctx.beginPath();
          ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (j.kind === 'sealed') {
          ctx.fillStyle = c.neutron;
          ctx.fillRect(jx + 8, jy - 8, jw - 16, 10);
          api.draw.text(ctx, 'No air · No flies', j.x + 75, jy + 60, { size: 11.5, align: 'center', color: c.muted });
          api.draw.text(ctx, '0 maggots', j.x + 75, 262, { size: 12.5, weight: 700, align: 'center', color: c.green });
        } else if (j.kind === 'gauze') {
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(jx + 4, jy);
          ctx.lineTo(jx + jw - 4, jy);
          ctx.stroke();
          // Air arrows passing through gauze
          api.draw.arrow(ctx, jx + 32, jy - 18, jx + 32, jy + 26, c.electron, 1.5, 5);
          api.draw.arrow(ctx, jx + 68, jy - 18, jx + 68, jy + 26, c.electron, 1.5, 5);
          // Eggs on top of gauze
          if (hours >= 12) {
            for (let e = 0; e < Math.min(6, Math.floor(hours / 10)); e++) {
              ctx.fillStyle = c.neutron;
              ctx.beginPath();
              ctx.arc(jx + 35 + e * 6, jy - 3, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          api.draw.text(ctx, 'Air in · Eggs on gauze', j.x + 75, jy + 60, { size: 11.5, align: 'center', color: c.electron });
          api.draw.text(ctx, '0 maggots on meat!', j.x + 75, 262, { size: 12.5, weight: 700, align: 'center', color: c.green });
        } else {
          api.draw.arrow(ctx, jx + 32, jy - 18, jx + 32, jy + 22, c.electron, 1.5, 5);
          api.draw.arrow(ctx, jx + 68, jy - 18, jx + 68, jy + 22, c.electron, 1.5, 5);
          if (hours >= 16) {
            const count = Math.min(8, Math.floor((hours - 10) / 7));
            ctx.strokeStyle = c.ink;
            ctx.lineWidth = 2.2;
            for (let m = 0; m < count; m++) {
              const mx = jx + 26 + m * 6.5;
              const my = jy + 114 + Math.sin(t * 4 + m) * 2;
              ctx.beginPath();
              ctx.moveTo(mx, my);
              ctx.lineTo(mx + 5, my - 3);
              ctx.stroke();
            }
          }
          api.draw.text(ctx, hours >= 16 ? `${Math.min(24, Math.floor(hours - 10))} maggots hatching` : 'Flies laying eggs...', j.x + 75, 262, {
            size: 12.5, weight: 700, align: 'center', color: c.proton,
          });
        }
      });
    } else {
      // Pasteur Swan-Neck Flask view
      api.draw.roundRect(ctx, 30, 20, 580, 275, 8, c.plate, c.rule);
      const contaminated = tiltDeg >= 65 && hours >= 12;
      api.draw.text(ctx, 'Louis Pasteur’s Swan-Neck Flask (Paris, 1859)', 320, 44, { size: 14, weight: 700, align: 'center', color: c.ink });

      ctx.save();
      ctx.translate(250, 175);
      ctx.rotate((tiltDeg * Math.PI) / 180 * 0.35);

      // Flask bulb
      ctx.fillStyle = contaminated ? c.proton : c.electron;
      ctx.globalAlpha = contaminated ? 0.28 : 0.14;
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // S-shaped Swan Neck
      ctx.beginPath();
      ctx.moveTo(-10, -54);
      ctx.bezierCurveTo(-10, -110, 65, -110, 75, -55);
      ctx.bezierCurveTo(85, 0, 145, 0, 155, -65);
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.strokeStyle = c.sheet;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Trapped dust & spores in the lower U-bend (around x=112, y=-15)
      for (let d = 0; d < 7; d++) {
        ctx.fillStyle = c.proton;
        ctx.beginPath();
        ctx.arc(98 + d * 5, -15 + (d % 2) * 3, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Multiplying microbes inside bulb if tilted >= 65 deg
      if (contaminated) {
        const nDots = Math.min(35, Math.floor(hours / 2));
        for (let b = 0; b < nDots; b++) {
          const ang = b * 2.399 + t * 0.8;
          const rad = 8 + (b % 5) * 8;
          ctx.fillStyle = c.proton;
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * rad, 10 + Math.sin(ang) * rad * 0.6, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      api.draw.text(ctx, contaminated ? 'Status: CLOUDY (Spores entered broth from bend!)' : 'Status: STERILE & CLEAR (Dust trapped in lower U-bend)', 320, 272, {
        size: 13, weight: 700, align: 'center', color: contaminated ? c.proton : c.green,
      });
    }
  });

  updateReadout();
  return { destroy() {} };
}, { label: 'Run the forensic jar & flask lab' });
