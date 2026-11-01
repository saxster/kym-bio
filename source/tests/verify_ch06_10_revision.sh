#!/usr/bin/env bash
# Local verification only; no source push or publication.
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHON_BIN="${BIO_PYTHON_INTERPRETER:-python3}"
if [ -n "${BIO_READER_VERIFY_OUT:-}" ]; then
  RECEIPTS="$BIO_READER_VERIFY_OUT"
else
  RECEIPTS="$(mktemp -d /tmp/bio-ch06-10-verify.XXXXXX)"
fi
mkdir -p "$RECEIPTS"
# Execute the frozen runner too, so later working-copy edits cannot alter an active run.
if [ "${BIO_READER_SNAPSHOT:-0}" != 1 ]; then
  "$PYTHON_BIN" tests/snapshot_reader_revision.py "$RECEIPTS/snapshot"
  export BIO_READER_SNAPSHOT=1 BIO_READER_VERIFY_OUT="$RECEIPTS"
  exec bash "$RECEIPTS/snapshot/source/tests/verify_ch06_10_revision.sh"
fi
SITE_DIR="$RECEIPTS/site"
"$PYTHON_BIN" build.py --site "$SITE_DIR" > "$RECEIPTS/build.log" 2>&1
"$PYTHON_BIN" tests/freeze_reader_revision.py "$RECEIPTS/revision-manifest.json"
export BIO_REVISION_MANIFEST="$RECEIPTS/revision-manifest.json"
export BIO_QA_SITE="$SITE_DIR"
# Keep at most three independent browser jobs active; all use this immutable site.
run_job() {
  case "$1" in
    atlas)
      node tests/ch09_atlas_domain.mjs > "$RECEIPTS/atlas-domain.log" 2>&1
      "$PYTHON_BIN" tests/qa_ch06_10_atlas.py "$SITE_DIR/index.html" > "$RECEIPTS/atlas.log" 2>&1
      ;;
    offline)
      "$PYTHON_BIN" livetest.py "$SITE_DIR/index.html" "$RECEIPTS/offline" --offline > "$RECEIPTS/offline.log" 2>&1
      ;;
    *)
      local chapter="$1"
      local key="BIO_CH${chapter}_QA_OUT"
      env "$key=$RECEIPTS/qa_ch${chapter}" "$PYTHON_BIN" "tests/qa_ch${chapter}.py" > "$RECEIPTS/ch${chapter}.log" 2>&1
      ;;
  esac
}
export -f run_job
export PYTHON_BIN RECEIPTS SITE_DIR
printf '%s\n' offline atlas 06 07 08 09 10 | xargs -n 1 -P 3 bash -c 'set -euo pipefail; run_job "$1"' _
printf 'PASS: Chapters 6–10 build, domain, browser, print, WebGL and offline checks. Receipts: %s\n' "$RECEIPTS"
