// Chapter 13 Widget 2: ABO Codominance, Multiple Alleles & Pedigree Detective Lab (0610 Topic 17.4 Extended).
import { Live } from './core.js';
import { makeCanvas } from './lab_kit.js';
import {
  ABO_GENOTYPES,
  ABO_CROSS_MODES,
  simulateAboCodominancePedigree,
  captureAboTrial,
  compareAboTrials,
} from './inheritance_model.js';

Live.register(
  'abo_codominance_pedigree',
  (stageEl, params, api) => {
    let modeIndex = 0;
    let maternalStep = 1;
    let paternalStep = 3;
    let pedigreeFocusStep = 1;
    let captures = [];

    const view = makeCanvas(
      api,
      640,
      360,
      'ABO blood group codominance and multiple-allele Punnett lab, red blood cell antigen and antibody table, and pedigree detective workbench'
    );

    const say = api.readout();
    const tabs = api.tabs(
      ABO_CROSS_MODES.map((m) => m.shortLabel),
      (idx) => {
        modeIndex = idx;
        const m = ABO_CROSS_MODES[idx];
        maternalStep = m.defaultMaternalStep;
        paternalStep = m.defaultPaternalStep;
        matSlider.set(maternalStep);
        patSlider.set(paternalStep);
        refresh();
      },
      0
    );

    const matSlider = api.slider('Maternal ABO genotype', {
      min: 1,
      max: ABO_GENOTYPES.length,
      step: 1,
      value: maternalStep,
      fmt: (v) => {
        const g = ABO_GENOTYPES[v - 1] || ABO_GENOTYPES[0];
        return `${g.code} (${g.bloodGroup})`;
      },
      onInput: (v) => {
        maternalStep = v;
        refresh();
      },
    });

    const patSlider = api.slider('Paternal ABO genotype', {
      min: 1,
      max: ABO_GENOTYPES.length,
      step: 1,
      value: paternalStep,
      fmt: (v) => {
        const g = ABO_GENOTYPES[v - 1] || ABO_GENOTYPES[0];
        return `${g.code} (${g.bloodGroup})`;
      },
      onInput: (v) => {
        paternalStep = v;
        refresh();
      },
    });

    api.button('IᴬIᴼ × IᴮIᴼ (4 Groups)', () => {
      modeIndex = 0;
      maternalStep = 1;
      paternalStep = 3;
      tabs.setActive(0);
      matSlider.set(1);
      patSlider.set(3);
      refresh();
    });

    api.button('IᴬIᴮ × IᴼIᴼ (Swap Check)', () => {
      modeIndex = 1;
      maternalStep = 5;
      paternalStep = 6;
      tabs.setActive(1);
      matSlider.set(5);
      patSlider.set(6);
      refresh();
    });

    api.button('IᴬIᴮ × IᴬIᴮ (1:2:1)', () => {
      modeIndex = 2;
      maternalStep = 5;
      paternalStep = 5;
      tabs.setActive(2);
      matSlider.set(5);
      patSlider.set(5);
      refresh();
    });

    api.button('Toggle Pedigree Rule 1/2', () => {
      modeIndex = 3;
      pedigreeFocusStep = pedigreeFocusStep === 1 ? 2 : 1;
      tabs.setActive(3);
      refresh();
    });

    api.button('Capture trial', () => {
      const sim = simulateAboCodominancePedigree({
        modeIndex,
        maternalGenotypeStep: maternalStep,
        paternalGenotypeStep: paternalStep,
        pedigreeFocusStep,
      });
      const cap = captureAboTrial(sim);
      const prev = captures[captures.length - 1];
      if (!prev || prev.crossCode !== cap.crossCode) {
        captures = [...captures.slice(-3), { ...cap, trialNumber: captures.length + 1 }];
      }
      refresh();
    });

    api.button('Clear trials', () => {
      captures = [];
      refresh();
    });

    function refresh() {
      const sim = simulateAboCodominancePedigree({
        modeIndex,
        maternalGenotypeStep: maternalStep,
        paternalGenotypeStep: paternalStep,
        pedigreeFocusStep,
      });

      const cmpText =
        captures.length >= 2
          ? 'Contrasting ABO crosses captured for comparison: ' +
            compareAboTrials(captures[captures.length - 2], captures[captures.length - 1]).summary
          : 'Tap "Capture trial" on two parental ABO crosses to compare possible and impossible offspring blood groups.';

      view.draw((ctx, c) => {
        const { draw } = api;
        const W = 640;
        const H = 360;
        ctx.fillStyle = c.sheet;
        ctx.fillRect(0, 0, W, H);

        // Left Card: 2x2 ABO Punnett Grid & RBC Surface Antigen Summary
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 14, 12, 306, 336, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        ctx.lineWidth = 1;
        draw.roundRect(ctx, 14, 12, 306, 336, 10);
        ctx.stroke();

        draw.text(ctx, `ABO Cross: ${sim.crossCode}`, 167, 29, {
          size: 10.6,
          weight: 700,
          color: c.ink,
          align: 'center',
        });
        draw.text(ctx, `${sim.maternal.bloodGroup} × ${sim.paternal.bloodGroup}`, 167, 45, {
          size: 9.0,
          color: c.muted,
          align: 'center',
        });

        // Paternal gamete headers
        for (let col = 0; col < 2; col += 1) {
          const gx = 96 + col * 104;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, gx, 54, 96, 24, 6);
          ctx.fill();
          ctx.strokeStyle = c.electron;
          draw.roundRect(ctx, gx, 54, 96, 24, 6);
          ctx.stroke();
          draw.text(ctx, `Sperm: ${sim.paternal.alleles[col]}`, gx + 48, 66, {
            size: 9.2,
            weight: 700,
            color: c.electron,
            align: 'center',
          });
        }

        // Maternal gamete headers + 4 Punnett cells
        for (let row = 0; row < 2; row += 1) {
          const gy = 84 + row * 72;
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, 24, gy, 66, 64, 6);
          ctx.fill();
          ctx.strokeStyle = c.proton;
          draw.roundRect(ctx, 24, gy, 66, 64, 6);
          ctx.stroke();
          draw.text(ctx, 'Ovum', 57, gy + 23, {
            size: 8.4,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, sim.maternal.alleles[row], 57, gy + 43, {
            size: 11.0,
            weight: 700,
            color: c.proton,
            align: 'center',
          });

          for (let col = 0; col < 2; col += 1) {
            const cell = sim.punnettCells[row * 2 + col];
            const cx = 96 + col * 104;
            const bCol =
              cell.shortGroup === 'AB'
                ? c.proton
                : cell.shortGroup === 'O'
                  ? c.ink
                  : cell.shortGroup === 'A'
                    ? c.electron
                    : c.green;

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
            draw.text(ctx, cell.bloodGroup, cx + 48, gy + 37, {
              size: 9.2,
              weight: 700,
              color: bCol,
              align: 'center',
            });
            draw.text(
              ctx,
              cell.shortGroup === 'AB'
                ? 'A + B antigens'
                : cell.shortGroup === 'O'
                  ? 'H stalk only'
                  : `Antigen ${cell.shortGroup} only`,
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

        draw.text(ctx, `Offspring: ${sim.phenotypeRatioSummary}`, 34, 250, {
          size: 8.8,
          weight: 700,
          color: c.ink,
          align: 'left',
        });
        draw.text(
          ctx,
          `Possible groups: ${sim.possibleGroups.map((g) => 'Group ' + g).join(', ')}`,
          34,
          270,
          {
            size: 8.6,
            weight: 700,
            color: c.green,
            align: 'left',
          }
        );
        draw.text(
          ctx,
          `Excluded (0%): ${sim.impossibleGroups.length > 0 ? sim.impossibleGroups.map((g) => 'Group ' + g).join(', ') : 'None (all 4 possible)'}`,
          34,
          290,
          {
            size: 8.6,
            weight: 700,
            color: c.proton,
            align: 'left',
          }
        );
        draw.text(ctx, 'Codominance: Iᴬ and Iᴮ both express sugars in IᴬIᴮ', 34, 310, {
          size: 8.4,
          color: c.electron,
          align: 'left',
        });
        draw.text(ctx, 'Simple dominance: Iᴬ and Iᴮ each mask recessive Iᴼ', 34, 328, {
          size: 8.4,
          color: c.muted,
          align: 'left',
        });

        // Right Card: Blood Group Distribution & Pedigree Detective Rules
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 330, 12, 296, 234, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 330, 12, 296, 234, 10);
        ctx.stroke();

        draw.text(ctx, 'ABO Blood Group Split & Pedigree Logic', 478, 29, {
          size: 10.4,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        const groups = [
          ['Group A', sim.groupPercentages.A, c.electron, 'Antigen A | Anti-B'],
          ['Group B', sim.groupPercentages.B, c.green, 'Antigen B | Anti-A'],
          ['Group AB', sim.groupPercentages.AB, c.proton, 'A + B | No antibodies'],
          ['Group O', sim.groupPercentages.O, c.ink, 'No A/B | Anti-A & B'],
        ];

        groups.forEach(([label, pct, col, info], idx) => {
          const ry = 54 + idx * 27;
          draw.text(ctx, `${label} (${pct}%)`, 344, ry, {
            size: 8.8,
            weight: 700,
            color: col,
            align: 'left',
          });
          draw.text(ctx, info, 614, ry, {
            size: 8.2,
            color: c.muted,
            align: 'right',
          });
          ctx.fillStyle = c.sheet;
          draw.roundRect(ctx, 344, ry + 5, 270, 8, 3);
          ctx.fill();
          if (pct > 0) {
            ctx.fillStyle = col;
            draw.roundRect(ctx, 344, ry + 5, Math.round((pct / 100) * 270), 8, 3);
            ctx.fill();
          }
        });

        // Pedigree Rule highlight box inside Right Card
        ctx.fillStyle = c.sheet;
        draw.roundRect(ctx, 342, 164, 272, 72, 8);
        ctx.fill();
        ctx.strokeStyle = c.electron;
        draw.roundRect(ctx, 342, 164, 272, 72, 8);
        ctx.stroke();

        const pRule = sim.activePedigreeRule;
        draw.text(
          ctx,
          pRule.ruleNumber === 1
            ? 'Pedigree Rule 1: Unaffected × Unaffected → Affected'
            : 'Pedigree Rule 2: Affected × Affected → Unaffected',
          478,
          182,
          { size: 8.6, weight: 700, color: c.electron, align: 'center' }
        );
        draw.text(
          ctx,
          pRule.ruleNumber === 1
            ? 'In this model: RECESSIVE; both parents are Aa'
            : 'In this model: DOMINANT; both parents are Aa',
          478,
          201,
          { size: 8.5, weight: 700, color: c.ink, align: 'center' }
        );
        draw.text(
          ctx,
          pRule.ruleNumber === 1
            ? 'Next child: 25% affected (aa), 50% carrier (Aa), 25% AA'
            : 'Next child: 75% affected (AA/Aa), 25% unaffected (aa)',
          478,
          220,
          { size: 8.2, color: c.muted, align: 'center' }
        );

        // Bottom-Right Captured Trials Card
        ctx.fillStyle = c.plate;
        draw.roundRect(ctx, 330, 254, 296, 94, 10);
        ctx.fill();
        ctx.strokeStyle = c.rule;
        draw.roundRect(ctx, 330, 254, 296, 94, 10);
        ctx.stroke();

        draw.text(ctx, `Captured ABO crosses (${captures.length})`, 478, 272, {
          size: 10.0,
          weight: 700,
          color: c.ink,
          align: 'center',
        });

        if (captures.length === 0) {
          draw.text(ctx, 'Tap "Capture trial" on IᴬIᴼ × IᴮIᴼ vs IᴬIᴮ × IᴼIᴼ', 478, 296, {
            size: 8.8,
            color: c.muted,
            align: 'center',
          });
          draw.text(ctx, 'to verify the Mumbai maternity ward blood-group proof.', 478, 314, {
            size: 8.8,
            color: c.muted,
            align: 'center',
          });
        } else {
          captures.slice(-2).forEach((cap, idx) => {
            const cy = 295 + idx * 22;
            draw.text(
              ctx,
              `#${cap.trialNumber} ${cap.crossCode}: A=${cap.groupPercentages.A}% B=${cap.groupPercentages.B}% AB=${cap.groupPercentages.AB}% O=${cap.groupPercentages.O}%`,
              478,
              cy,
              {
                size: 8.4,
                weight: 600,
                color: idx === 0 ? c.electron : c.green,
                align: 'center',
              }
            );
          });
        }
      });

      const history = captures
        .map((cap) => `#${cap.trialNumber} ${cap.crossCode} (${cap.phenotypeRatioSummary})`)
        .join(' | ');

      say(
        `${sim.mode.label} · ${sim.crossCode} (${sim.parentPhenotypes}): standard ABO model predicts ${sim.phenotypeRatioSummary}. Rare variants or absent H-antigen can change blood typing; an ABO grid alone does not establish real identity. Maternal ${sim.maternal.code} has ${sim.maternal.surfaceAntigens} and ${sim.maternal.plasmaAntibodies}; paternal ${sim.paternal.code} has ${sim.paternal.surfaceAntigens} and ${sim.paternal.plasmaAntibodies}. ${sim.activePedigreeRule.title}: ${sim.activePedigreeRule.deduction} ${cmpText} Saved: ${history || 'none'}.`
      );
    }

    refresh();
    return {};
  },
  {
    label: 'Explore ABO blood group codominance, multiple alleles (Iᴬ, Iᴮ, Iᴼ) & pedigree detective proofs',
    three: false,
    static: true,
  }
);
