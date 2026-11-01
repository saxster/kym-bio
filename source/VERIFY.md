# Local verification

From the repository root, install the book's own dependencies:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r source/requirements-verification.txt
.venv/bin/python -m playwright install chromium
npm ci --prefix source --no-audit --no-fund
```

Run the combined reader-revision integration gate:

```bash
bash source/verify-integrated-revision.sh
```

This builds all sixteen chapters into a fresh temporary directory, runs the
existing domain and scene regressions, requires actual WebGL in all sixty Atlas
stations in Chapters 1–15, checks the Chapter 6–10 paused-mobile-redraw regression,
and tests the 47 non-Atlas live figures, three explorers and offline reopening. Source hashes
must stay unchanged throughout. The command fails if any required check fails.
The final receipt and logs are retained in the printed directory. Set
`BIO_INTEGRATION_OUT` to choose a destination or `BIO_PYTHON_INTERPRETER` to choose
an installed Python. No command above publishes, pushes or uses hosted CI.

The detailed chapter browser, figure, keyboard and print acceptance checks remain
available in `verify-reader-revision.sh`, `tests/verify_ch06_10_revision.sh` and
`tests/verify_ch11_15_revision.sh`. Their existing receipts and scientific reviews
are recorded in `gates/`. The combined gate adds integration evidence; it does not
replace those chapter checks or physical activity and learner trials.
