# Chapter 10 local verification

From `/Users/amarsukhi/src/MyCode/kym_bio/source`, run:

```bash
./tests/verify_ch10.sh
```

This command builds the real book and runs Chapter 10 acceptance, the unchanged Chapter 9, Chapter 8, Chapter 7, Chapter 6 and Chapter 5 acceptance scripts, and the whole-book live/offline smoke test. It exits nonzero if any step fails. It does not publish, push or dispatch hosted CI.

The default receipt root is `/tmp/lt_bio_ch10/final`, with separate `qa_ch10`, `qa_ch09_regression`, `qa_ch08_regression`, `qa_ch07_regression`, `qa_ch06_regression`, `qa_ch05_regression` and `full` directories. Use `BIO_CH10_VERIFY_OUT` for a separate run so earlier receipts remain intact. The Python interpreter defaults to `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`; `BIO_PYTHON_INTERPRETER` overrides it. Local prerequisites are the installed Node/esbuild dependencies, Playwright Chromium, `pdftotext` and `pdftoppm`.

`tests/qa_ch10.py` checks the actual `build/site`, not a component fixture. It retains its report and screenshots even if it fails. `tests/ch10_domain.mjs` independently recomputes skin thermoregulation and evaporative cooling latent-heat limits in Mumbai humidity, pancreatic insulin/glucagon negative feedback and Type 1 diabetes renal glycosuria, hepatic deamination of excess amino acids and two-stage nephron ultrafiltration/selective reabsorption (Wearn & Richards 1924), specific active vs passive immunity and memory lymphocyte kinetics, cholera toxin chloride secretion vs oral rehydration solution (ORS) sodium–glucose cotransport, immutable captured states and explicit tour controls. `tests/ch10-preserved.json` captures the completed/corrected pre-Chapter 10 source state (including all 265 files from Chapters 0–9); never regenerate it to accept a change.

The acceptance matrix and browser receipts do not substitute for looking at images. Direct visual/PDF inspection, final cache version, independent reviews, access limits and any targeted follow-up runs are recorded in `gates/ch10-verification.md`. Activities were reviewed, not physically trialled.
