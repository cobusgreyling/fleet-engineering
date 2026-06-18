#!/usr/bin/env bash
set -euo pipefail

# Export LangSmith Fleet workspace agents to git-backed registry backup.
# Requires: LANGSMITH_API_KEY, LANGSMITH_WORKSPACE_ID (or pass as args)

OUT_DIR="${1:-.}"
WORKSPACE_ID="${LANGSMITH_WORKSPACE_ID:-}"

if [[ -z "${LANGSMITH_API_KEY:-}" ]]; then
  echo "Set LANGSMITH_API_KEY to export workspace agents."
  echo "Without API access, copy sample-registry.yaml as a starting point:"
  echo "  cp examples/langsmith-fleet/sample-registry.yaml agents/registry.yaml"
  exit 1
fi

mkdir -p "$OUT_DIR/agents/manifests"

echo "# LangSmith Fleet backup — $(date -u +%Y-%m-%d)" > "$OUT_DIR/agents/registry.yaml"
echo "agents:" >> "$OUT_DIR/agents/registry.yaml"

# Placeholder: LangSmith Fleet list API evolves — adapt endpoint when stable.
echo "Fetching workspace ${WORKSPACE_ID:-default} agents..."
echo "  → Write manifests to $OUT_DIR/agents/manifests/"
echo "  → Run: npx @cobusgreyling/fleet-audit $OUT_DIR"

cat <<'NOTE'

Manual fallback (until API stabilizes):
1. Export agent list from LangSmith Fleet UI
2. For each agent, create agents/manifests/<id>.yaml from templates/AGENT-MANIFEST.yaml
3. Set evidence.trace_platform: langsmith
4. Commit registry + manifests to git for Cross-Agent Audit backup

See stories/langsmith-git-backup.md
NOTE