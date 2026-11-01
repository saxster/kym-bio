# Chapter 13 Local Verification Suite (`README-ch13.md`)

All verification for **Chapter 13: *The Monk's Spreadsheet: Mendel, Alleles & Inheritance*** runs locally without remote repository operations or CI triggers.

## Files Included

1. **`tests/ch13-preserved.json`** — Pre-authoring SHA-256 preservation baseline of all `316` pre-existing files under `source/` (Chapters 0–12, baselines, gate reports, runners, and `original_base64` of the `91,898`-byte `source/live/enhancements.js` prefix).
2. **`tests/ch13_domain.mjs`** — Standalone Node.js unit and invariant suite (`34,346` assertions) verifying `source/live/inheritance_model.js`:
   - Johann Gregor Mendel's (`1866`) 7-character Brno ledger (`14,949` dominant : `5,010` recessive = `19,959` outcomes, `2.98 : 1` combined ratio), `F₃` progeny test (`193 RR : 372 Rr = 1 : 1.93`), all 9 (`3 × 3`) monohybrid Punnett combinations (`3 : 1`, `1 : 2 : 1`, `1 : 1`, `100%`), enzyme dosage (`100%`, `50%`, `0%`), and sample-size convergence (`N = 16, 64, 400, 7,324`).
   - Chromosome `9` `ABO` codominance and multiple alleles (`Iᴬ, Iᴮ, Iᴼ`) across all 36 (`6 × 6`) diploid parental crosses (`IᴬIᴬ, IᴬIᴼ, IᴮIᴮ, IᴮIᴼ, IᴬIᴮ, IᴼIᴼ`), including the `IᴬIᴼ × IᴮIᴼ` four-group cross (`25%` each), the `IᴬIᴮ × IᴼIᴼ` maternity-ward swap check (`50% A, 50% B, 0% AB, 0% O`), the `IᴬIᴮ × IᴬIᴮ` `1 : 2 : 1` codominance ratio, and Pedigree Detective Rules 1 & 2.
   - Human `XX` vs `XY` sex determination (`1 : 1` ratio, `X ~156 Mb` vs `Y ~57 Mb`) and X-linked recessive inheritance (`Xᴮ/Xᵇ`, `Xᴴ/Xʰ`, `X⁺/Xʷ`) across all 6 (`3 × 2`) maternal × paternal crosses, verifying separate probabilities among daughters (`XX`), among sons (`XY`), and among all children, plus `0%` father-to-son X transmission.
3. **`tests/qa_ch13.py`** — Headless Playwright browser and PDF acceptance suite:
   - Verifies all `316` preserved files in `ch13-preserved.json` (including pre-existing stories byte-for-byte and the `91,898`-byte prefix of `enhancements.js`).
   - Verifies clean text (`0` `$`, `0` `\text`, `0` `!`) in `src/ch13.md`, `src/stories/mendel-morgan-sanghvi-inheritance.md`, and `figs_ch13.py`.
   - Audits all `9` Chapter 13 SVG plates across `5` viewport widths (`390, 820, 1024, 1180, 1440`) and `3` themes (`light, dark, sepia`) for zero text clipping, zero text overlaps, and zero arrow-text intersections.
   - Exercises all `3` interactive 2D canvas widgets (`mendel_punnett_simulator`, `abo_codominance_pedigree`, `sex_linked_cross_lab`) across tabs, slider extremes, presets, trial captures, and guided tours with `0` clipped canvas text strings (`window.ch13Issues == []`).
   - Generates the A4 print PDF (`print.pdf`), maps all 9 figure captions to exact PDF pages (`pdf-pages.json`), renders PDF pages to PNGs (`pdf-*.png`), and records SHA-256 hashes in `artifact-hashes.json`.
4. **`tests/verify_ch13.sh`** — Full one-command runner executing `build.py --site build/site`, `qa_ch13.py`, regression suites `qa_ch12.py` down to `qa_ch05.py`, and full-book `livetest.py --offline`.

## Commands

```bash
# 1. Standalone Node domain test suite (34,346 assertions)
node source/tests/ch13_domain.mjs

# 2. Chapter 13 browser + PDF acceptance suite
BIO_CH13_QA_OUT=/tmp/lt_bio_ch13/final/qa_ch13 /Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python source/tests/qa_ch13.py

# 3. Full build + Ch 13 QA + Ch 5..12 regressions + full-book offline smoke test
BIO_CH13_VERIFY_OUT=/tmp/lt_bio_ch13/final ./source/tests/verify_ch13.sh
```
