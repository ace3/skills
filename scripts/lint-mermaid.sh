#!/usr/bin/env bash
# Validate one or more Mermaid sources by rendering them with mmdc.
# Usage:
#   scripts/lint-mermaid.sh path/to/diagram.mmd [more.mmd ...]
#   scripts/lint-mermaid.sh --stdin   # read mermaid source on stdin
#
# Exits 0 when every input renders cleanly, non-zero on first failure.
# Requires the `@mermaid-js/mermaid-cli` package providing `mmdc`.
# Install once with: npm install -g @mermaid-js/mermaid-cli

set -euo pipefail

if ! command -v mmdc >/dev/null 2>&1; then
  echo "lint-mermaid: mmdc not found on PATH" >&2
  echo "install with: npm install -g @mermaid-js/mermaid-cli" >&2
  exit 2
fi

render_one() {
  local src="$1"
  local out
  out="$(mktemp -t mermaid-lint.XXXXXX.svg)"
  if mmdc --quiet --input "$src" --output "$out" >/dev/null 2>&1; then
    rm -f "$out"
    echo "ok: $src"
    return 0
  fi
  rm -f "$out"
  echo "fail: $src" >&2
  mmdc --input "$src" --output /tmp/_mermaid_lint_err.svg 2>&1 | tail -20 >&2
  return 1
}

if [ "${1:-}" = "--stdin" ]; then
  tmp="$(mktemp -t mermaid-lint.XXXXXX.mmd)"
  cat > "$tmp"
  render_one "$tmp"
  rc=$?
  rm -f "$tmp"
  exit $rc
fi

if [ "$#" -eq 0 ]; then
  echo "usage: $0 <file.mmd> [...]   |   $0 --stdin" >&2
  exit 2
fi

rc=0
for f in "$@"; do
  render_one "$f" || rc=1
done
exit $rc
