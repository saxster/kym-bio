# Chapter 12 Local Verification Suite (`README-ch12.md`)

All verification for **Chapter 12: *Copying the Blueprint: Mitosis, Stem Cells & Meiosis*** runs locally without remote repository operations or CI triggers.

## Files Included

1. **`tests/ch12-preserved.json`** — Pre-authoring SHA-256 preservation baseline of all `299` pre-existing files under `source/` (Chapters 0–11, baselines, gate reports, runners, and `original_base64` of the `81,763`-byte `source/live/enhancements.js` prefix).
2. **`tests/ch12_domain.mjs`** — Standalone Node.js unit and invariant suite (`4,387` assertions) verifying `source/live/cell_division_model.js`:
   - Complementary base pairing (`A=T` `2` H-bonds, `C≡G` `3` H-bonds) and hydrogen-bond sums.
   - Matthew Meselson and Franklin Stahl (`1958`) `¹⁵N/¹⁴N` `CsCl` density-gradient laws (`1.724`, `1.717`, `1.710 g/cm³`; `Hybrid = 2 / 2ᵍ = 1 / 2ᵍ⁻¹`), falsification of conservative (`Gen 1`) and dispersive (`Gen 2`) models, and 4-stage DNA polymerase proofreading fidelity (`10⁻⁴` to `10⁻⁹` errors/base across `~40,000` human replication origins).
   - Mitosis (`2n = 46 → 2n = 46`) vs Meiosis (`2n = 46 → n = 23`) centromere chromosome counts, sister chromatid counts (`46 → 92 → 46`), independent assortment (`2²³ = 8,388,608` gametes, `2⁴⁶` zygotes), triploid Cavendish banana (`3n = 33`) Meiosis I triplet jam, and E. K. Janaki Ammal's Coimbatore octoploid sugarcane (`2n = 80`).
   - Stem cell differentiation (`0610 17.2.5`), selective gene expression (`0610 17.1.6`, `100%` of `2n = 46` nuclear DNA retained while housekeeping vs specialist genes `ATP5F1A, GAPDH, OCT4/SOX2, INS, HBB, CHAT/SCN9A` switch ON/OFF), and Gurdon (`1962`) / Yamanaka (`2006`) nuclear reprogramming.
3. **`tests/qa_ch12.py`** — Headless Playwright browser and PDF acceptance suite:
   - Verifies all `299` preserved files in `ch12-preserved.json` (including `p-ammal.md` byte-for-byte and the `81,763`-byte prefix of `enhancements.js`).
   - Verifies clean text (`0` `$`, `0` `\text`, `0` `!`) in `src/ch12.md`, `src/stories/meselson-flemming-gurdon-divisions.md`, and `figs_ch12.py`.
   - Audits all `9` Chapter 12 SVG plates across `5` viewport widths (`320, 390, 768, 1024, 1440`, plus `390, 820, 1024, 1180, 1440`) and `3` themes (`light, sepia, dark`) for zero text clipping, zero text overlaps, and zero arrow-text intersections.
   - Exercises all `3` interactive 2D canvas widgets (`dna_replication_meselson`, `mitosis_meiosis_stepper`, `stem_cell_expression_lab`) across tabs, slider extremes, presets, trial captures, and guided tours with `0` clipped canvas text strings.
   - Generates the standalone Chapter 12 A4 PDF (`ch12.pdf`), renders PDF pages to PNGs (`pdf-*.png`), and records SHA-256 hashes in `artifact-hashes.json`.
4. **`tests/verify_ch12.sh`** — Full one-command runner executing `build.py`, `qa_ch12.py`, regression suites `qa_ch11.py` down to `qa_ch05.py`, and full-book `livetest.py --offline`.

## Commands

```bash
# 1. Standalone Node domain test suite (4,387 assertions)
node source/tests/ch12_domain.mjs

# 2. Chapter 12 browser + PDF acceptance suite (default widths 320,390,768,1024,1440)
/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python source/tests/qa_ch12.py --out /tmp/lt_bio_ch12/final

# 3. Full build + Ch 12 QA + Ch 5..11 regressions + full-book offline smoke test
./source/tests/verify_ch12.sh
```
