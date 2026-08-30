#!/usr/bin/env bash
# Offline compute-level audit for all calculators.
# Copies /app/frontend/src/lib/calculators/*.js (+ currency.js) into a temp ESM dir
# and runs the audit harnesses with plain node (no browser needed).
set -euo pipefail
SRC=/app/frontend/src/lib/calculators
OUT=$(mktemp -d)
for f in "$SRC"/*.js; do
  b=$(basename "$f" .js)
  sed 's|from "\./\([a-z-]*\)"|from "./\1.mjs"|g' "$f" > "$OUT/$b.mjs"
done
sed 's|from "\./\([a-z-]*\)"|from "./\1.mjs"|g' /app/frontend/src/lib/currency.js > "$OUT/currency.mjs"
cp "$(dirname "$0")"/audit_*.mjs "$OUT/"
cd "$OUT"
for a in audit_*.mjs; do
  echo "===== $a ====="
  node "$a"
done
