# Chapter 7 local verification

From `/Users/amarsukhi/src/MyCode/kym_bio/source`, run:

```bash
./tests/verify_ch07.sh
```

This command builds the real book and runs Chapter 7 acceptance, the unchanged Chapter 6 and Chapter 5 acceptance scripts, and the whole-book live/offline smoke test. It exits nonzero if any step fails. It does not publish, push or dispatch hosted CI.

The default receipt root is `/tmp/lt_bio_ch07/final`, with separate `qa_ch07`, `qa_ch06_regression`, `qa_ch05_regression` and `full` directories. Use `BIO_CH07_VERIFY_OUT` for a separate run so earlier receipts remain intact. The Python interpreter defaults to `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`; `BIO_PYTHON_INTERPRETER` overrides it. Local prerequisites are the installed Node/esbuild dependencies, Playwright Chromium, `pdftotext` and `pdftoppm`.

`tests/qa_ch07.py` checks the actual `build/site`, not the component fixture. It retains its report and screenshots even if it fails. `tests/ch07_domain.mjs` independently recomputes geometry, route/compartment ledgers, input bounds, water-inclusive molecular balances, immutable captured products and explicit tour controls. `tests/ch07-preserved.json` captures the completed/corrected pre-Chapter7 source state; never regenerate it to accept a change. The only original-file change is three appended enhancement entries, checked by reconstructing the exact original bytes rather than exempting the file.

The acceptance matrix and browser receipts do not substitute for looking at images. Direct visual/PDF inspection, final cache version, independent reviews, access limits and any targeted follow-up runs are recorded in `gates/ch07-verification.md`. Activities were reviewed, not physically trialled.
