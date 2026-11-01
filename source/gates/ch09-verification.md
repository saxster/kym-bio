# Chapter 9 — final local verification record

Completed locally on 30 October 2026. **PASS**: final reviewed source, build, Chapter 9 acceptance, unchanged Chapter 8/7/6/5 regressions and whole-book live/offline verification. Service-worker cache: **`lw-ccc1ee483f5a`**.

[Read Chapter 9](http://127.0.0.1:52890/index.html#ch9). The handover server was started locally and its HTTP response was compared byte for byte with the final built index. This is a local preview. No publication, deployment, commit, push, remote repository operation or hosted verification occurred.

## Delivered material and sequence

- `src/ch09.md`: **11,304 raw whitespace words** (`73,987` bytes, SHA-256 `4098960ea2edbbfa908fd98b3d47b00a63772418c6fc1c79dd6c3d1572f423aa`), including front matter, block labels, cards and hidden answers. Exactly four numbered sections (`9.1`–`9.4`); four Understand-it (`:::five`) cards; four predictions (`:::predict`) and four section checks (`:::check`); four evidence boxes (`:::evidence`); four misconception guards (`:::careful`); four curriculum bridges (`:::school`); six recalls (`:::recall 8`, `:::recall 4`, `:::recall 2`, `:::recall 3`, `:::recall 7`, `:::recall 5`); two safe home activities (`:::home` — 30 cm ruler-drop voluntary reaction time in `9.2`, and blind-spot mapping plus ordinary-room-light pupil reflex in `9.3`); a pufferfish tetrodotoxin voltage-gated sodium-channel reasoning case (`:::case`); and the closing bridge to Chapter 10 (`:::next`).
- `figs_ch09.py`: **nine original registered SVG plates** (`46,340` bytes, SHA-256 `81bf33c073e8252c33bb47edb1fccc3e228377709ede6df631ce1d09178e0881`), with meaningful alt text, semantic theme classes, labelled directions and explicit scale/model limits. Plates cover nervous vs hormonal coordination and endocrine glands (`c9_nerves_vs_hormones`), sensory/relay/motor neurone types and the spinal reflex arc (`c9_neurone_types_reflex`), copper wire vs axonal action potential wave and `para^ts` (`c9_action_potential_wave`), chemical synapse relay, one-way rule and Loewi's 1921 two-heart proof (`c9_synapse_relay`), four-pathway latency budget and ruler-drop kinematics (`c9_pathway_latency_budget`), human eye cross-section and rod/cone photoreceptor distribution (`c9_eye_anatomy_receptors`), iris pupil reflex and 3D ciliary sphincter accommodation (`c9_pupil_and_accommodation`), Darwin/Boysen-Jensen/Went coleoptile experiments and auxin phototropism/gravitropism (`c9_plant_tropisms_auxin`), and normal motor axon conduction vs nanomolar tetrodotoxin outer-pore blockade (`c9_tetrodotoxin_case`).
- **Three manual 2D widgets**: `reflex_action_potential`, `synapse_transmission` and `eye_accommodation_tropism`, supported by the new `live/coordination_model.js` (`15,803` bytes, SHA-256 `7298b2dac86eff0fe20feda31e74bde422c3ea14b8ecec8a6fac5b73ab1d7d13`). Every widget has its matching original static plate (`#fig-9-2`, `#fig-9-4`, `#fig-9-7`), challenge requiring captured outcomes, numbers, cutaway, exactly five deterministic tour shots and model limits. These are manually selected explanatory states, without autoplay clocks or unverified rate coefficients.
- `src/stories/siddiqi-para-channels.md`: **one new story, 1,487 raw whitespace words** (`9,720` bytes, SHA-256 `f80d9795d86a4d62f6e497883f79771ecfb557680b43463affde41901ab5b4ef`), “Giant squid axons, sleeping frog hearts and the warm-paralysed flies of Colaba.” It connects Otto Loewi's 1921 Graz two-frog-heart *Vagusstoff* experiment, Alan Hodgkin and Andrew Huxley's 1939–1952 Plymouth squid giant axon intracellular and voltage-clamp recordings, David Suzuki's 1971 *Drosophila* `para^ts` mutant, Obaid Siddiqi (founder of the Molecular Biology Unit at TIFR Colaba, Mumbai) and Seymour Benzer's 1973–1976 neurogenetic microelectrode recordings separating axonal `para` failure from synaptic `shi`/`com` failure, and the 1989 molecular cloning of `para` as the voltage-gated sodium-channel alpha subunit (Loughney, Kreber & Ganetzky), while leaving existing `src/stories/p-bose.md` byte-identical. Its six `terms:` (`Obaid Siddiqi, Alan Hodgkin, Andrew Huxley, Otto Loewi, squid giant axon, Vagusstoff`) have zero occurrences in Chapters 0–8.
- Grounding (`grounding/ch09.md`), section/figure/story/model provenance (`provenance/ch09.yml`), independent Gate A/B reports (`gates/ch09-A.md`, `gates/ch09-B.md`), immutable preservation baseline (`tests/ch09-preserved.json`), independent domain oracle (`tests/ch09_domain.mjs`), browser acceptance (`tests/qa_ch09.py`), executable local runner (`tests/verify_ch09.sh`) and command documentation (`tests/README-ch09.md`).

The required sequence was followed: preservation baseline and primary-source grounding; paper-first SVG generation, rendering and inspection; declared widget models and rendered components; chapter and story prose; provenance, independent gates and final-book acceptance.

## Independent reviews

**Gate A PASS:** `gates/ch09-A.md`. **Gate B PASS:** `gates/ch09-B.md`. Both reviewers received fresh contexts and report-only ownership. Neither authored the chapter, story, figures, models or widgets. Each includes final independent confirmation against the frozen source, with **zero outstanding BLOCKER, FIX or CONSIDER findings** (`0 BLOCKER · 0 FIX · 0 CONSIDER`). Gate B includes an **exactly three-sentence explain-back** for each of Sections 9.1, 9.2, 9.3 and 9.4.

The 15 reviewed source/test artifacts match `/tmp/lt_bio_ch09/final/artifact-hashes.json` exactly in bytes and SHA-256:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `source/grounding/ch09.md` | 44,356 | `3b27c8a94072b89c6a292cd7a9d32c734e1c6fe6f7c6c5b6d0bcfa363f59bea2` |
| `source/src/ch09.md` | 73,987 | `4098960ea2edbbfa908fd98b3d47b00a63772418c6fc1c79dd6c3d1572f423aa` |
| `source/src/stories/siddiqi-para-channels.md` | 9,720 | `f80d9795d86a4d62f6e497883f79771ecfb557680b43463affde41901ab5b4ef` |
| `source/figs_ch09.py` | 46,340 | `81bf33c073e8252c33bb47edb1fccc3e228377709ede6df631ce1d09178e0881` |
| `source/provenance/ch09.yml` | 30,641 | `a797bd25cde03c369d7c98baf71b795a5cedb268bcfb3e6cf4946769c8ed9794` |
| `source/live/coordination_model.js` | 15,803 | `7298b2dac86eff0fe20feda31e74bde422c3ea14b8ecec8a6fac5b73ab1d7d13` |
| `source/live/w_reflex_action_potential.js` | 10,999 | `4f6c80e0fa6cf438ed423cf9e0d992334a2a43246d4efc666928cc1dc22c9a90` |
| `source/live/w_synapse_transmission.js` | 10,642 | `3844666d375ee109be5bcb91443df2ea3117a5194f2bd52decb912008c8e2838` |
| `source/live/w_eye_accommodation_tropism.js` | 11,422 | `a96a63beedfda7df2adb653aa4d42f1268366a022cee7d7cbd1c568384580828` |
| `source/live/enhancements.js` | 62,628 | `bf0a5fd2c5944776bdbdf10c979431d30e5c1f0fcf007837a3f6723e1d29f7c1` |
| `source/tests/ch09_domain.mjs` | 7,778 | `1e94fc7e40a2709da90653fa63924687857fb808615aede5a4363a49f92343df` |
| `source/tests/qa_ch09.py` | 30,403 | `aa886f29510c068b561e939c9a9f121f4a8982fc08a71cdeae33f2ad5d615759` |
| `source/tests/verify_ch09.sh` | 1,275 | `f008e4c6a866ec704a8f88ced39c88fd7989541981fbb59aa0eecbd7042d03fb` |
| `source/tests/README-ch09.md` | 2,029 | `902acc2deeeda5181f52e7a2ad27bc6745f594117beebe704a5e0071922f7ba3` |
| `source/tests/ch09-preserved.json` | 108,169 | `3a8563fd527a6a154a1e5106d6fb921f0f01b1471204a7cc5f726b9ff4a21b5d` |

## One local command and final receipts

From `/Users/amarsukhi/src/MyCode/kym_bio/source`:

```bash
./tests/verify_ch09.sh
```

The runner uses `set -euo pipefail` and `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`. It builds the site, runs Chapter 9 acceptance, runs the unchanged Chapter 8, Chapter 7, Chapter 6 and Chapter 5 scripts in separate receipt directories, and runs the whole-book live/offline smoke test. Any failed required step returns nonzero. `BIO_CH09_VERIFY_OUT` selects a separate receipt root; `tests/README-ch09.md` documents prerequisites and interpreter override. The old runners and historical receipts are preserved.

Final command: `BIO_CH09_VERIFY_OUT=/tmp/lt_bio_ch09/final ./tests/verify_ch09.sh`. The complete command exited **0** after all required steps.

| Final-build check | Result |
|---|---|
| Site build | Exit 0; ten chapters, 29 live widgets |
| Chapter 9 acceptance (`qa_ch09.py`) | Exit 0; **1,819 assertions**, **620 independent domain cases**, no browser console/page errors |
| Unchanged Chapter 8 acceptance (`qa_ch08.py`) | Exit 0; **1,890 assertions**, **1,731 independent cases** |
| Unchanged Chapter 7 acceptance (`qa_ch07.py`) | Exit 0; **1,710 assertions**, **2,046 independent cases** |
| Unchanged Chapter 6 acceptance (`qa_ch06.py`) | Exit 0; **1,441 assertions**, **1,145 independent cases** |
| Unchanged Chapter 5 acceptance (`qa_ch05.py`) | Exit 0; **985 assertions**, **18,133 independent cases** |
| Whole-book live/offline smoke (`livetest.py --offline`) | Exit 0; **29 live figures**, **three explorer mounts**, zero premature lazy chunks, service worker ready, successful offline reload/live opening and no application console/page errors |

Receipts are under `/tmp/lt_bio_ch09/final/`: `qa_ch09/report.json`, `qa_ch08_regression/report.json`, `qa_ch07_regression/report.json`, `qa_ch06_regression/report.json`, `qa_ch05_regression/report.json`, `artifact-hashes.json` and `full/`. All acceptance cache values match **`lw-ccc1ee483f5a`**. The delivered index is **2,044,220 bytes**, well below 4 MB; its SHA-256 is `09f7d7a934c6c9067812b53adfb7d8a0427f72ebb42cd8bb2244a5428bf387bc`. New lazy chunks are **6,048** (`w_reflex_action_potential`), **5,743** (`w_synapse_transmission`) and **6,528 bytes** (`w_eye_accommodation_tropism`), well below 150 KB. No lazy chunk is imported before interaction.

## Browser, print PDF and mathematical coverage

- All nine static SVGs at **390, 820, 1024, 1180 and 1440 px**, in **light, dark and sepia**: 15 combinations and 135 static-plate screenshots. Real SVG text and shape bounds, label collisions, arrow shafts against text, arrow markers and page overflow are checked.
- All three widgets in default and meaningful changed states on 390 px mobile and 1440 px desktop, in every theme. Instrumented browser Canvas `measureText` ink metrics check the whole logical bitmap across all states (`window.ch09Issues == []`).
- **108 recorded tour-state checks**, including out-of-order selection (`[4, 1, 3, 0, 2, 4]`). Assertions inspect actual controls, cutaway state, selected tab, sliders and readout. Challenges remain incomplete when merely selecting controls or capturing only one state; saved reflex/temperature trials, synaptic transmission trials and accommodation/tropism trials remain immutable after subsequent slider changes.
- Actual keyboard focus, manual controls, enlarged native drawings and keyboard panning when content overflows; full visibility when it already fits. Resize/theme changes retain state and repaint.
- No autoplay under normal or reduced motion; tours pause offscreen and on dynamic reduced-motion changes. All three widgets work with WebGL disabled, with zero Chapter 9 WebGL probes.
- JavaScript-off chapter prose and original figures; offline chapter loading and opening **and reopening every new widget offline**. Story card and automatic proper-name links (`siddiqi-para-channels` and preserved `p-bose`), keyboard entry, Escape, direct story URL and offline opening are checked.
- The final acceptance produced a **410-page whole-book verification PDF** (`/tmp/lt_bio_ch09/final/qa_ch09/print.pdf`, `19,926,942` bytes, SHA-256 `38d49a60786ba56c4792a04c11b1452138ca9f601563c6a837f7f2d11e45457a`). With all three new widgets open, the original SVGs are restored and the interactive stages are excluded in print across all screen themes. Every complete caption matches uniquely on one PDF page:

| Plate | Function | PDF page |
|---|---|---:|
| 9.1 | `c9_nerves_vs_hormones` | 304 |
| 9.2 | `c9_neurone_types_reflex` | 310 |
| 9.3 | `c9_action_potential_wave` | 314 |
| 9.4 | `c9_synapse_relay` | 319 |
| 9.5 | `c9_pathway_latency_budget` | 320 |
| 9.6 | `c9_eye_anatomy_receptors` | 327 |
| 9.7 | `c9_pupil_and_accommodation` | 329 |
| 9.8 | `c9_plant_tropisms_auxin` | 336 |
| 9.9 | `c9_tetrodotoxin_case` | 342 |

## Preservation and authorised scope

`tests/ch09-preserved.json` captured **248 original files** before implementation, including completed Chapters 0–8, all stories, earlier gate reports, baselines, authorised-correction records and acceptance scripts. **247 remain byte-identical**. The only existing-file change is the addition of three enhancement entries (`reflex_action_potential`, `synapse_transmission`, `eye_accommodation_tropism`) in `live/enhancements.js`; reconstructing the exact original bytes passes both length (`53,435` bytes) and SHA-256 (`c93717a754c70ae7cd2cd66806752a389abb5a0fa43bfbaba419d8a91b18d397`). No entire file is exempted from preservation, no original baseline was regenerated, no old assertion weakened and no shared engine/CSS file changed.

No Git repository assumption or remote operation was made. No project `.github/workflows` triggers were found; none were created, enabled or dispatched. All verification ran locally.
