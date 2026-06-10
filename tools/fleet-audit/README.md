# fleet-audit

Fleet Readiness Score CLI — scores a workspace for fleet engineering artifacts (F0–F3).

## Usage

```bash
node tools/fleet-audit/cli.js .
node tools/fleet-audit/cli.js . --suggest
node tools/fleet-audit/cli.js . --json
```

## What it checks

- `FLEET.md`, `FLEET-STATE.md`
- Registry (`agents/registry.yaml` or `patterns/registry.yaml`)
- Agent manifests
- Permissions model
- `fleet-budget.md`
- Kill switch and accountability references