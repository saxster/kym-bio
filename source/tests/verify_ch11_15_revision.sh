#!/usr/bin/env bash
# One local command for the Chapter 11–15 reader revision; never publishes.
set -euo pipefail
cd "$(dirname "$0")/.."
BIO_REVISION_PYTHON="${BIO_PYTHON_INTERPRETER:-python3}"
exec "$BIO_REVISION_PYTHON" tests/verify_ch11_15_revision.py "$@"
