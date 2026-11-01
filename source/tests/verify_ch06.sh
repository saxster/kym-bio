#!/bin/bash
# One local command: final build, Chapter 6 acceptance, preserved Chapter 5 regression,
# and full-book lazy-loading/offline smoke checks. No hosted CI is dispatched.
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHON_BIN="${BIO_PYTHON_INTERPRETER:-/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python}"
VERIFY_OUT="${BIO_CH06_VERIFY_OUT:-/tmp/lt_bio_ch06/verification}"
mkdir -p "$VERIFY_OUT"
"$PYTHON_BIN" build.py --site build/site 2>&1 | tee "$VERIFY_OUT/build.log"
BIO_CH06_QA_OUT="$VERIFY_OUT/qa_ch06" "$PYTHON_BIN" tests/qa_ch06.py 2>&1 | tee "$VERIFY_OUT/qa_ch06.log"
BIO_CH05_QA_OUT="$VERIFY_OUT/qa_ch05_regression" "$PYTHON_BIN" tests/qa_ch05.py 2>&1 | tee "$VERIFY_OUT/qa_ch05_regression.log"
"$PYTHON_BIN" livetest.py build/site/index.html "$VERIFY_OUT/full_book_live" --offline 2>&1 | tee "$VERIFY_OUT/full_book_live.log"
printf 'PASS: local build, Chapter 6 acceptance, Chapter 5 regression and full-book offline checks. Evidence: %s\n' "$VERIFY_OUT"
