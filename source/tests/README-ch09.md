# Chapter 9 local verification

From `/Users/amarsukhi/src/MyCode/kym_bio/source`, run:

```bash
./tests/verify_ch09.sh
```

This command builds the real book and runs Chapter 9 acceptance, the unchanged Chapter 8, Chapter 7, Chapter 6 and Chapter 5 acceptance scripts, and the whole-book live/offline smoke test. It exits nonzero if any step fails. It does not publish, push or dispatch hosted CI.

The default receipt root is `/tmp/lt_bio_ch09/final`, with separate `qa_ch09`, `qa_ch08_regression`, `qa_ch07_regression`, `qa_ch06_regression`, `qa_ch05_regression` and `full` directories. Use `BIO_CH09_VERIFY_OUT` for a separate run so earlier receipts remain intact. The Python interpreter defaults to `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`; `BIO_PYTHON_INTERPRETER` overrides it. Local prerequisites are the installed Node/esbuild dependencies, Playwright Chromium, `pdftotext` and `pdftoppm`.

`tests/qa_ch09.py` checks the actual `build/site`, not a component fixture. It retains its report and screenshots even if it fails. `tests/ch09_domain.mjs` independently recomputes myelinated vs unmyelinated conduction velocities, spinal reflex vs voluntary ruler-drop free-fall kinematics ($d = \frac{1}{2}gt^2$), Siddiqi & Benzer's 1976 `para^ts` temperature-sensitive sodium-channel block, four-step chemical synaptic transmission and one-way conduction, eye accommodation thin-lens power and antagonistic iris pupil reflex, plant shoot/root auxin redistribution and curvature, immutable captured states and explicit tour controls. `tests/ch09-preserved.json` captures the completed/corrected pre-Chapter 9 source state (including all 248 files from Chapters 0–8); never regenerate it to accept a change.

The acceptance matrix and browser receipts do not substitute for looking at images. Direct visual/PDF inspection, final cache version, independent reviews, access limits and any targeted follow-up runs are recorded in `gates/ch09-verification.md`. Activities were reviewed, not physically trialled.
