#!/usr/bin/env bash
# Cold-path Fleet Ready demo for GIF recording (15–30s).
# Usage:
#   ./scripts/record-relaunch-demo.sh
#   ./scripts/record-relaunch-demo.sh --pause   # wait for keypress between beats
set -euo pipefail

PAUSE=0
if [[ "${1:-}" == "--pause" ]]; then PAUSE=1; fi

step() {
  echo ""
  echo "────────────────────────────────────────"
  echo "▶ $1"
  echo "────────────────────────────────────────"
  if [[ "$PAUSE" -eq 1 ]]; then
    read -r -p "(press Enter)" _
  else
    sleep 1.2
  fi
}

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEMO="${FLEET_DEMO_DIR:-/tmp/fleet-ready-demo}"
INIT_CLI="$ROOT/tools/fleet-init/cli.js"
AUDIT_CLI="$ROOT/tools/fleet-audit/cli.js"

if [[ ! -f "$INIT_CLI" || ! -f "$AUDIT_CLI" ]]; then
  echo "Expected local fleet-init/fleet-audit CLIs under tools/" >&2
  exit 1
fi

step "1/4 Empty dir — expect low Fleet Ready"
rm -rf "$DEMO"
mkdir -p "$DEMO"
cd "$DEMO"
node "$AUDIT_CLI" . || true

step "2/4 fleet-init team-agent-registry"
node "$INIT_CLI" . --pattern team-agent-registry --tool grok

step "3/4 fleet-audit --suggest (score should jump)"
node "$AUDIT_CLI" . --suggest

step "4/4 Optional inbox pattern (second beat)"
node "$INIT_CLI" . --pattern shared-inbox-hitl || true
node "$AUDIT_CLI" .

echo ""
echo "Done. Record this terminal with asciinema/agg or CleanShot."
echo "Demo dir: $DEMO"
echo "Narration: stories/relaunch-demo-script.md"
