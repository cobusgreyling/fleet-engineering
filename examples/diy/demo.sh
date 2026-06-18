#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEMO="${TMPDIR:-/tmp}/fleet-diy-demo-$$"
REPO_CLI="${ROOT}/tools"

echo "=== Fleet DIY Demo ==="
echo "Workspace: $DEMO"
mkdir -p "$DEMO"
cd "$DEMO"

echo ""
echo "--- Before (empty) ---"
node "$REPO_CLI/fleet-audit/cli.js" . --json | node -e "
const d=JSON.parse(require('fs').readFileSync(0,'utf8'));
console.log('Score:', d.score, 'Level:', d.level);
"

echo ""
echo "--- Scaffold F1 (15 min) ---"
node "$REPO_CLI/fleet-init/cli.js" . --pattern team-agent-registry --with-loop daily-triage --tool grok

echo ""
echo "--- After scaffold ---"
node "$REPO_CLI/fleet-audit/cli.js" . --suggest
node "$REPO_CLI/fleet-budget/cli.js" .
node "$REPO_CLI/fleet-cost/cli.js" .

echo ""
echo "--- Promote toward F2 ---"
node "$REPO_CLI/fleet-init/cli.js" . --pattern shared-inbox-hitl 2>/dev/null || true

echo ""
echo "Demo complete. Inspect: $DEMO"
echo "Cleanup: rm -rf $DEMO"