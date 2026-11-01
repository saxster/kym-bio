#!/usr/bin/env bash
# Local integration gate only; never pushes or publishes.
set -euo pipefail
cd "$(dirname "$0")"
BIO_LOCAL_PYTHON="${BIO_PYTHON_INTERPRETER:-../.venv/bin/python}"
if [ ! -x "$BIO_LOCAL_PYTHON" ]; then
  BIO_LOCAL_PYTHON="${BIO_PYTHON_INTERPRETER:-python3}"
fi
exec "$BIO_LOCAL_PYTHON" tests/verify_integrated_revision.py "$@"
