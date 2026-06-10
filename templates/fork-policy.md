# Agent Clone & Fork Policy — {{TEAM_NAME}}

Pattern: **Agent Clone & Fork** · Initialized {{DATE}}

## Rules

1. Every clone registers as a **new** `id` in `agents/registry.yaml` within 24h
2. Manifest must include `forked_from: <source-id>@<version>`
3. Clone default permission: `run` only; `edit` for clone owner
4. Production connectors require inbox approval on first run

## Promotion path

`experimental` → `active` only after accountability test passes for scoped actions.