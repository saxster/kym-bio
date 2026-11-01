# Chapter 8 local verification

From `/Users/amarsukhi/src/MyCode/kym_bio/source`, run:

```bash
./tests/verify_ch08.sh
```

This command builds the real book and runs Chapter 8 acceptance, the unchanged Chapter 7, Chapter 6 and Chapter 5 acceptance scripts, and the whole-book live/offline smoke test. It exits nonzero if any step fails. It does not publish, push or dispatch hosted CI.

The default receipt root is `/tmp/lt_bio_ch08/final`, with separate `qa_ch08`, `qa_ch07_regression`, `qa_ch06_regression`, `qa_ch05_regression` and `full` directories. Use `BIO_CH08_VERIFY_OUT` for a separate run so earlier receipts remain intact. The Python interpreter defaults to `/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python`; `BIO_PYTHON_INTERPRETER` overrides it. Local prerequisites are the installed Node/esbuild dependencies, Playwright Chromium, `pdftotext` and `pdftoppm`.

`tests/qa_ch08.py` checks the actual `build/site`, not a component fixture. It retains its report and screenshots even if it fails. `tests/ch08_domain.mjs` independently recomputes dead-space vs alveolar ventilation, Harvey's 1628 Troy/apothecaries' lower-bound arithmetic vs modern cardiac output, intact series vs post-natal VSD shunt haemodynamics, vascular continuity ($v = Q / A_{\text{total}}$), Starling capillary filtration/reabsorption and lymphatic return, immutable captured states and explicit tour controls. `tests/ch08-preserved.json` captures the completed/corrected pre-Chapter 8 source state (including all Chapter 7 files); never regenerate it to accept a change.

The acceptance matrix and browser receipts do not substitute for looking at images. Direct visual/PDF inspection, final cache version, independent reviews, access limits and any targeted follow-up runs are recorded in `gates/ch08-verification.md`. Activities were reviewed, not physically trialled.
