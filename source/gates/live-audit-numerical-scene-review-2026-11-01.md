# Independent bounded review: Chapter 13 and 15 quantitative scenes

Reviewed 1 November 2026, before the proposed final scene repairs. Scope: `source/live/atlas/biology/ch13-mendel-inheritance/chapter.js`, `ch15-ecology-biotech/chapter.js`, their unchanged pure models, and the relevant stage/parts/explode behavior. No manuscript or implementation was edited; no build or expensive browser check was run.

**Recommendation: make the proposed corrections. They repair scientific representations, rather than merely improve styling. The proposed proportional encodings are sound, subject to the engine-position condition below. This report is not acceptance of an implementation not yet inspected.**

## Chapter 13: expected genotype probabilities

Confirmed consequential contradictions at `ch13-mendel-inheritance/chapter.js:140`–154 and 215–220:

- Tt geometry is 1.8 units tall before the same probability multiplier is applied to all bars, so its visible height does not encode the stated probability on the same scale as TT and tt.
- The 0.08 minimum depicts impossible genotypes as small positive outcomes. Zero-probability bars should be hidden, rather than enlarged for visibility.
- The fixed TT/Tt/Tt/tt palette pattern and static 1:2:1/3:1 descriptions disagree with the other two crosses offered by the control.

Use identical one-unit-height bar geometries and height `2.8 * probability`. The intended heights and grid frequencies are:

| Parents | TT/Tt/tt probability | TT/Tt/tt heights | Four equally weighted grid cells |
|---|---|---|---|
| Tt × Tt | 0.25 / 0.50 / 0.25 | 0.7 / 1.4 / 0.7 | TT, Tt, Tt, tt |
| Tt × tt | 0 / 0.50 / 0.50 | 0 / 1.4 / 1.4 | two Tt, two tt |
| TT × tt | 0 / 1 / 0 | 0 / 2.8 / 0 | four Tt |

**Engine condition:** `engine/stage.js` calls `W.update` and then `E.stepExplode`. The latter resets every exploded part's position to `userData.home + ex * explode`. Updating only `bar.position.y = height/2` therefore fails to keep the bar grounded even with explode at zero. Also update its home y-coordinate to `height/2`, or opt these quantitative bars out of exploding. Compare grounded actual geometry after the engine step, not only the mesh scale immediately after `W.update`.

Grid letters should be visible and agree with grid-cell names and colors, so meaning does not depend on color discrimination. Set each cell's material to the appropriate `shadeMat` palette; do not mutate cached shared material uniforms, which can recolor unrelated parts. If letters follow mesh positions, include assembly/explode transforms in their anchors.

Use neutral page/tab/figure/alt and assembly titles, with the selected parents and expected outcomes in dynamic labels/readouts. Review `PLATES.genotype_bars` and `PLATES.punnett_grid` as well: their static two-heterozygote/gametes-T-or-t wording is not a description of every offered cross. Call Tt "heterozygous", rather than imply that a dominant tall allele is a hidden recessive carrier state. Distinguish expected probabilities from observed results in a finite sample; changing N currently changes the standard error, not a newly sampled grid.

## Chapter 15: illustrative trophic production budget

Confirmed consequential contradictions at `ch15-ecology-biotech/chapter.js:145`–158 and 208–212. The current tier widths have different unrelated base sizes and then use powers of `eta/10`. At 20% they become 1.55, 2.10, 2.48 and 2.24: upper tiers can be wider than the producer tier even though their energies are lower. Fixed 10% names and labels also contradict the efficiency control.

The proposed repair is mathematically correct: start every tier with the same horizontal geometry, set both x/z scales to `sqrt(levelEnergy / producerEnergy)`, and leave display height equal. This makes horizontal footprint area proportional to the unchanged model's energy. Because each level uses the same base geometry, uniform horizontal scaling also preserves the correct area ratios for the rounded outlines.

| Assumed transfer | Producers/herbivores/primary carnivores/apex, kJ | Relative horizontal side lengths |
|---|---|---|
| 5% | 10000 / 500 / 25 / 1.25 | 1 / 0.22361 / 0.05 / 0.01118 |
| 10% | 10000 / 1000 / 100 / 10 | 1 / 0.31623 / 0.1 / 0.03162 |
| 20% | 10000 / 2000 / 400 / 80 | 1 / 0.44721 / 0.2 / 0.08944 |

Derive scales and current energy names from model values before rounding. Make the transfer assumption dynamic or neutral in the page/figure/alt, assembly subtitle, board label and plate text. State explicitly that equal display heights separate the trophic levels and **horizontal footprint area encodes energy**, using the same illustrative budget interval for all levels. Keep the caveat that transfer efficiency is assumed and varies in real systems; energy not transferred to the next consumer level includes detritus as well as respiratory heat.

At low efficiency, an honest apex footprint is necessarily tiny. Do not add a minimum footprint that falsifies the encoding. Keep the assembly and numerical readout accessible; show enough precision to retain the 1.25 kJ endpoint at 5% (or make rounding clear). The visual usefulness and selection behavior of the small apex require actual screenshot/control QA.

## Adjacent pre-existing station-0 residual

The Chapter 15 dot at lines 215–218 follows `R=1+0.42 cos(t)`, `F=1+0.42 sin(t)`. That arbitrary circle is not a conserved Lotka–Volterra orbit: the unchanged model gives V approximately 2.0693 at (1.42,1) and 2.1247 at (0.58,1). The assembly subtitle's "Closed predator–prey oscillation orbit" and board label "orbit bowl" can imply a trajectory the dot does not actually solve. This is separate from the pyramid repair. Minimal honest correction: describe an illustrative path over the invariant surface; otherwise drive the dot using an actual trajectory of the stated model. No change to the existing pure invariant function is required by the wording option.

## Acceptance bounds

The minimal repair should preserve the manuscript, biological assumptions and pure model outputs, while bringing the mesh geometry, colors, letters, names and descriptions into agreement with those outputs. Useful focused checks are all three Mendelian crosses, true zero bars, grounded bars after `stepExplode`, and monotone area/energy ratios at 5%, 10% and 20%. This reviewer has not run those checks or claimed a visual gate.

## Independent implementation follow-up

Read the implemented Chapter 13/15 diff and `source/tests/atlas_quantitative_display_domain.mjs`, together with the stage label and assembly appearance/explode code. **Pass for this bounded implementation review: the consequential findings above are resolved in source, including the adjacent LV scan description. No new consequential defect identified.** No implementation was edited and no browser/build/expensive test was repeated.

Chapter 13 now uses identical one-unit bar geometry, probability-proportional scales and explicit zero visibility. Updates synchronize `position.y` and `userData.home.y`; the bars' explode offsets have no vertical component. Thus the later engine explode step preserves the shared baseline, including the all-Tt cross. Parent strings generate the correct four gamete pairings in all three cases. Each grid tile owns a cloned material, and update copies only its three palette color uniforms. That is a sound refinement of the earlier palette-assignment recommendation: it avoids shared-material recoloring while retaining each tile's current section planes, opacity and appearance state after the controller clones it. No palette uniform is mutated through the source bar material.

The four genotype letter labels use the stage's supported `text()` function and `tile.getWorldPosition` anchors; they therefore change with the grid and follow its exploded location. Their sheet/ink styling uses defined book theme variables. The stage treats `mark` annotations as fixed to their anchors, so collision separation cannot move a genotype letter onto a different tile. Page/title/alt/plate/readout wording now distinguishes selected crosses, expected probabilities and sample-size uncertainty; the SE is correctly expressed in percentage points.

Chapter 15 now gives every tier identical base geometry and computes horizontal side scales from the square root of the actual model energy fraction. Area ratios therefore remain correct over the full 5–20% control range. Tier names, transfer caption, assembly subtitle, facts and readout agree with the current values. The numerical formatter preserves the 1.25 kJ apex at 5%. Equal display heights, the common budget interval and the assumed transfer fraction are explicit. The LV caption and plate now describe a chosen scan of example states and explicitly distinguish it from a solved trajectory; the pure model is unchanged.

The focused regression reads actual Three.js scene bounds **after** the assembly explode step, which addresses the engine interaction missed by a scale-only assertion. It covers all three crosses at N=20/400/2000 and explode=0/1, checks zero visibility and grounded heights, verifies the cell genotype strings and their top-color agreement, and confirms recoloring retains section clipping. It checks pyramid area ratios and monotonic narrowing at every integer efficiency from 5 through 20, dynamic efficiency labels and the low-energy readout precision.

Test limits: the focused test does not itself render the new letters into a DOM, verify actual label legibility/overlap in every view/theme, or separately assert both remaining color uniforms and x-ray opacity. The reviewed implementation copies all three colors and leaves those appearance fields intact; no source defect was found there. The coordinator reports direct-scene RED-to-GREEN and 1,728 framing cases passing. This reviewer inspected the test source but did not independently rerun those results or claim a visual gate. Tiny-apex visibility and new-label layout remain actual screenshot/control checks.
