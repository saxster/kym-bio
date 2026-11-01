#!/bin/bash
# All required verification is local. Source pushes/publication are outside this command.
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHON_BIN="${BIO_PYTHON_INTERPRETER:-/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python}"
VERIFY_OUT="${BIO_CH08_VERIFY_OUT:-/tmp/lt_bio_ch08/final}"
mkdir -p "$VERIFY_OUT"
"$PYTHON_BIN" build.py --site build/site 2>&1 | tee "$VERIFY_OUT/build.log"
BIO_CH08_QA_OUT="$VERIFY_OUT/qa_ch08" "$PYTHON_BIN" tests/qa_ch08.py 2>&1 | tee "$VERIFY_OUT/qa_ch08.log"
BIO_CH07_QA_OUT="$VERIFY_OUT/qa_ch07_regression" "$PYTHON_BIN" tests/qa_ch07.py 2>&1 | tee "$VERIFY_OUT/qa_ch07_regression.log"
BIO_CH06_QA_OUT="$VERIFY_OUT/qa_ch06_regression" "$PYTHON_BIN" tests/qa_ch06.py 2>&1 | tee "$VERIFY_OUT/qa_ch06_regression.log"
BIO_CH05_QA_OUT="$VERIFY_OUT/qa_ch05_regression" "$PYTHON_BIN" tests/qa_ch05.py 2>&1 | tee "$VERIFY_OUT/qa_ch05_regression.log"
"$PYTHON_BIN" livetest.py build/site/index.html "$VERIFY_OUT/full" --offline 2>&1 | tee "$VERIFY_OUT/full.log"
printf 'PASS: local build, Chapter 8 acceptance, Chapter 7/6/5 regressions and full-book live/offline smoke test. Evidence: %s\n' "$VERIFY_OUT"
