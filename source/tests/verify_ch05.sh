#!/bin/bash
# Local build + chapter/story acceptance + full-book live/offline smoke test.
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHON_BIN="${BIO_PYTHON_INTERPRETER:-/Users/amarsukhi/src/MyCode/kym_physics/.venv/bin/python}"
VERIFY_OUT="${BIO_VERIFY_OUT:-/tmp/lt_bio_ch05/helmont-followup}"
mkdir -p "$VERIFY_OUT"
"$PYTHON_BIN" build.py --site build/site 2>&1 | tee "$VERIFY_OUT/build.log"
BIO_CH05_QA_OUT="$VERIFY_OUT/qa" "$PYTHON_BIN" tests/qa_ch05.py 2>&1 | tee "$VERIFY_OUT/qa.log"
"$PYTHON_BIN" livetest.py build/site/index.html "$VERIFY_OUT/live" --offline 2>&1 | tee "$VERIFY_OUT/live.log"
