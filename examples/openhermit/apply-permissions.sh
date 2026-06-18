#!/usr/bin/env bash
set -euo pipefail

# Overlay fleet permissions-model.yaml onto OpenHermit agent layout.
# Usage: ./apply-permissions.sh /path/to/hermit-workspace

TARGET="${1:-.}"
OVERLAY="$(cd "$(dirname "$0")" && pwd)/sample-permissions.yaml"
PERMS="$TARGET/permissions-model.yaml"

if [[ ! -f "$OVERLAY" ]]; then
  echo "Missing sample-permissions.yaml"
  exit 1
fi

cp "$OVERLAY" "$PERMS"
echo "Applied OpenHermit permissions overlay → $PERMS"
echo ""
echo "Next:"
echo "  1. Map hermit agent IDs to agents/manifests/*.yaml"
echo "  2. npx @cobusgreyling/fleet-init $TARGET --pattern team-agent-registry"
echo "  3. npx @cobusgreyling/fleet-audit $TARGET --suggest"