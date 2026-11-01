// Chapter 13 Widget 3: Sex Determination (XX vs XY) & X-Linked Recessive Cross Lab (0610 Topics 17.1 & 17.4 Extended).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  SEX_LINKED_MODES,
  SEX_LINKED_TRAITS,
  simulateSexLinkedCross,
  captureSexLinkedTrial,
  compareSexLinkedTrials,
} from './inheritance_model.js';

Live.register(
  'sex_linked_cross_lab',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let traitStep = 1;
    let maternalStep = 1;
    let paternalStep = 1;
    let captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'XX versus XY sex determination and X-linked recessive inheritance Punnett lab for colour vision, haemophilia, and Morgan Drosophila eye colour'
    );

    const say = api.readout();
    const tabs = api.tabs(
      SEX_LINKED_MODES.map((m) => m.shortLabel),
      (idx) => {
        modeIndex = idx;
        const m = SEX_LINKED_MODES[idx];
        maternalStep = m.defaultMaternalStep;
        paternalStep = m.defaultPaternalStep;
        matSlider.set(maternalStep);
        refresh();
      },
      0
    );

    const matSlider = api.slider('Maternal XX genotype', {
      min: 1,
      max: 3,
      step: 1,
      value: maternalStep,
      fmt: (v) => {
        const t = SEX_LINKED_TRAITS[traitStep - 1] || SEX_LINKED_TRAITS[0];
        if (v === 1) return `Carrier (${t.dominantAllele}${t.recessiveAllele})`;
        if (v === 2) return `Normal (${t.dominantAllele}${t.dominantAllele})`;
        return `Affected (${t.recessiveAllele}${t.recessiveAllele})`;
      },
      onInput: (v) => {
        maternalStep = v;
        refresh();
      },
    });

    const traitSlider = api.slider('X-linked gene locus', {
      min: 1,
      max: SEX_LINKED_TRAITS.length,
      step: 1,
      value: traitStep,
      fmt: (v) => {
        const t = SEX_LINKED_TRAITS[v - 1] || SEX_LINKED_TRAITS[0];
        return `${t.shortName} (${t.dominantAllele}/${t.recessiveAllele})`;
      },
      onInput: (v) => {
        traitStep = v;
        matSlider.set(maternalStep);
        refresh();
      },
    });

    api.button('Carrier Mum × Normal Dad', () => {
      modeIndex = 0;
      maternalStep = 1;
      paternalStep = 1;
      tabs.setActive(0);
      matSlider.set(1);
      refresh();
    });

    api.button('Normal Mum × Affected Dad', () => {
      modeIndex = 1;
      maternalStep = 2;
      paternalStep = 2;
      tabs.setActive(1);
      matSlider.set(2);
      refresh();
    });

    api.button('Carrier Mum × Affected Dad', () => {
      modeIndex = 2;
      maternalStep = 1;
      paternalStep = 2;
      tabs.setActive(2);
      matSlider.set(1);
      refresh();
    });

    api.button('Haemophilia (Xᴴ/Xʰ)', () => {
      traitStep = 2;
      traitSlider.set(2);
      matSlider.set(maternalStep);
      refresh();
    });

    api.button('Capture trial', () => {
      const sim = simulateSexLinkedCross({
        modeIndex,
        traitStep,
        maternalStep,
        paternalStep,
      });
      const cap = captureSexLinkedTrial(sim);
      const prev = captures[captures.length - 1];
      if (!prev || prev.crossCode !== cap.crossCode || prev.traitName !== cap.traitName) {
        captures = [...captures.slice(-3), { ...cap, trialNumber: captures.length + 1 }];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures = [];
      refresh();
    });

    function refresh() {
      const sim = simulateSexLinkedCross({
        modeIndex,
        traitStep,
        maternalStep,
        paternalStep,
      });

      const cmpText =
        captures.length >= 2
          ? 'Contrasting X-linked crosses captured for comparison: ' +
            compareSexLinkedTrials(captures[captures.length - 2], captures[captures.length - 1]).summary
          : 'Tap "Capture trial" on Carrier Mum × Normal Dad vs Normal Mum × Affected Dad to compare son vs daughter outcomes.';

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: 2x2 X-Linked Punnett Grid
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 306, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 306, 336, 10);
        ctx.stroke();

        draw.text(ctx, `${sim.trait.shortName} · Cross ${sim.crossCode}`, 167, 29, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(
          ctx,
          `Mother (${sim.maternal.code}) × Father (${sim.paternal.code})`,
          167,
          45,
          {
            size: 9.0,
            color: c.muted,
            align: 'center',
          }
        );

        // Paternal sperm headers (X vs Y)
        for (let col = 0; col < 2; col += 1) {
          const gx = 96 + col * 104;
          const sp = sim.paternal.alleles[col];
          const sCol = sp === 'Y' ? c.proton : c.electron;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, gx, 54, 96, 24, 6);
          ctx.fill();
          ctx.strokeStyle = sCol;
          draw.roundRect(ctx, gx, 54, 96, 24, 6);
          ctx.stroke();
          draw.text(
            ctx,
            sp === 'Y' ? 'Y-Sperm (Y)' : `X-Sperm (${sp})`,
            gx + 48,
            66,
            {
              size: 8.6,
              weight: 700,
              color: sCol,
              align: 'center',
            }
          );
        }

        // Maternal ovum headers + 4 Punnett cells
        for (let row = 0; row < 2; row += 1) {
          const gy = 84 + row * 72;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, 24, gy, 66, 64, 6);
          ctx.fill();
          ctx.strokeStyle = c.proton;
          draw.roundRect(ctx, 24, gy, 66, 64, 6);
          ctx.stroke();
          draw.text(ctx, 'Ovum (X)', 57, gy + 23, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, sim.maternal.alleles[row], 57, gy + 43, {
            size: 10.8,
            weight: 700,
            color: c.proton,
            align: 'center',
          });

          for (let col = 0; col < 2; col += 1) {
            const cell = sim.punnettCells[row * 2 + col];
            const cx = 96 + col * 104;
            const bCol = cell.isAffected ? c.proton : cell.isCarrier ? c.electron : c.green;

            ctx.fillStyle = c.sheet;
            draw.roundRect(ctx, cx, gy, 96, 64, 8);
            ctx.fill();
            ctx.strokeStyle = bCol;
            ctx.lineWidth = 1.4;
            draw.roundRect(ctx, cx, gy, 96, 64, 8);
            ctx.stroke();
            ctx.lineWidth = 1;

            draw.text(ctx, `${cell.genotype} (25%)`, cx + 48, gy + 18, {
              size: 10.2,
              weight: 700,
              color: c.ink,
              align: 'center',
            });
            draw.text(ctx, cell.category, cx + 48, gy + 36, {
              size: 7.8,
              weight: 700,
              color: bCol,
              align: 'center',
            });
            draw.text(
              ctx,
              cell.isAffected
                ? 'Affected'
                : cell.isCarrier
                  ? 'Unaffected carrier'
                  : 'Unaffected normal',
              cx + 48,
              gy + 52,
              {
                size: 8.0,
                color: c.muted,
                align: 'center',
              }
            );
          }
        }

        // Bottom summary box inside Left Card
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 24, 232, 286, 106, 8);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 24, 232, 286, 106, 8);
        ctx.stroke();

        draw.text(
          ctx,
          `Sex ratio: 50% XX Daughters : 50% XY Sons (1 : 1)`,
          34,
          250,
          {
            size: 8.8,
            weight: 700,
            color: c.ink,
            align: 'left',
          }
        );
        draw.text(
          ctx,
          `X (~156 Mb, ~850 genes) vs Y (~57 Mb, <100 genes)`,
          34,
          270,
          {
            size: 8.5,
            color: c.electron,
            align: 'left',
          }
        );
        draw.text(
          ctx,
          `Father → Son X transmission: 0% (sons get Father's Y)`,
          34,
          290,
          {
            size: 8.5,
            weight: 700,
            color: c.green,
            align: 'left',
          }
        );
        draw.text(
          ctx,
          `XY male has 1 X copy: cannot be a hidden carrier`,
          34,
          310,
          {
            size: 8.5,
            color: c.proton,
            align: 'left',
          }
        );
        draw.text(
          ctx,
          `Locus: ${sim.trait.dominantAllele} = normal | ${sim.trait.recessiveAllele} = recessive`,
          34,
          328,
          {
            size: 8.3,
            color: c.muted,
            align: 'left',
          }
        );

        // Right Card: Separate Daughter vs Son vs All-Children Percentages
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 330, 12, 296, 234, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 330, 12, 296, 234, 10);
        ctx.stroke();

        draw.text(ctx, 'Daughters (XX) vs Sons (XY) Breakdown', 478, 29, {
          size: 10.4,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        // Daughters sub-box
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 342, 42, 272, 62, 7);
        ctx.fill();
        ctx.strokeStyle = c.proton;
        draw.roundRect(ctx, 342, 42, 272, 62, 7);
        ctx.stroke();

        draw.text(ctx, 'Among Daughters (XX only):', 352, 58, {
          size: 8.8,
          weight: 700,
          color: c.proton,
          align: 'left',
        });
        draw.text(
          ctx,
          `Normal: ${sim.amongDaughters.homozygousNormalPct}% | Carrier: ${sim.amongDaughters.carrierPct}%`,
          352,
          76,
          { size: 8.5, color: c.ink, align: 'left' }
        );
        draw.text(
          ctx,
          `Affected Daughters: ${sim.amongDaughters.affectedPct}%`,
          352,
          93,
          {
            size: 8.5,
            weight: 700,
            color: sim.amongDaughters.affectedPct > 0 ? c.proton : c.green,
            align: 'left',
          }
        );

        // Sons sub-box
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 342, 112, 272, 62, 7);
        ctx.fill();
        ctx.strokeStyle = c.electron;
        draw.roundRect(ctx, 342, 112, 272, 62, 7);
        ctx.stroke();

        draw.text(ctx, 'Among Sons (XY only — hemizygous):', 352, 128, {
          size: 8.8,
          weight: 700,
          color: c.electron,
          align: 'left',
        });
        draw.text(
          ctx,
          `Normal Sons: ${sim.amongSons.normalPct}% | Carriers: 0% (only 1 X)`,
          352,
          146,
          { size: 8.5, color: c.ink, align: 'left' }
        );
        draw.text(
          ctx,
          `Affected Sons: ${sim.amongSons.affectedPct}%`,
          352,
          163,
          {
            size: 8.5,
            weight: 700,
            color: sim.amongSons.affectedPct > 0 ? c.proton : c.green,
            align: 'left',
          }
        );

        // All-children denominator reminder box
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 342, 182, 272, 54, 7);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 342, 182, 272, 54, 7);
        ctx.stroke();

        draw.text(ctx, 'Among ALL Children (4 Punnett squares):', 352, 198, {
          size: 8.6,
          weight: 700,
          color: c.ink,
          align: 'left',
        });
        draw.text(
          ctx,
          `Affected overall: ${sim.amongAllChildren.totalAffectedChildrenPct}% (${sim.amongAllChildren.affectedSonPct}% son + ${sim.amongAllChildren.affectedDaughterPct}% daughter)`,
          352,
          215,
          { size: 8.3, color: c.muted, align: 'left' }
        );
        draw.text(
          ctx,
          `Carrier overall: ${sim.amongAllChildren.totalCarrierChildrenPct}% (daughters only)`,
          352,
          230,
          { size: 8.3, color: c.muted, align: 'left' }
        );

        // Bottom-Right Captured Trials Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 330, 254, 296, 94, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 330, 254, 296, 94, 10);
        ctx.stroke();

        draw.text(ctx, `Captured X-linked crosses (${captures.length})`, 478, 272, {
          size: 10.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" to compare Carrier Mum × Normal Dad', 478, 296, {
            size: 8.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'against Normal Mum × Affected Dad (0% father-to-son).', 478, 314, {
            size: 8.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 295 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.crossCode}: Sons ${cap.sonsAffectedPct}% aff | Daughters ${cap.daughtersCarrierPct}% car, ${cap.daughtersAffectedPct}% aff`,
              478,
              cy,
              {
                size: 8.3,
                weight: 600,
                color: idx === 0 ? c.electron : c.green,
                align: 'center',
              }
            );
          });
        }
      });

      const history = captures
        .map(
          (cap) =>
            `#${cap.trialNumber} ${cap.crossCode} (sons ${cap.sonsAffectedPct}% aff, daughters ${cap.daughtersCarrierPct}% car)`
        )
        .join(' | ');

      say(
        `${sim.mode.label} · ${sim.trait.name} (${sim.crossCode}): among daughters (XX), ${sim.amongDaughters.homozygousNormalPct}% are homozygous normal, ${sim.amongDaughters.carrierPct}% are carriers, and ${sim.amongDaughters.affectedPct}% are affected; among sons (XY), ${sim.amongSons.normalPct}% are normal and ${sim.amongSons.affectedPct}% are affected (${sim.amongAllChildren.totalAffectedChildrenPct}% of all children). ${sim.trait.molecularMechanism} ${cmpText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Simulate XX vs XY sex determination and X-linked recessive crosses (colour vision, haemophilia & Morgan fly eye)',
    three: false,
    static: true,
  }
);
