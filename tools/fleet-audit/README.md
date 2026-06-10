# fleet-audit

Fleet Readiness Score CLI — scores a workspace for fleet engineering artifacts (F0–F3).

## Usage

```bash
npx @cobusgreyling/fleet-audit .
npx @cobusgreyling/fleet-audit . --suggest
npx @cobusgreyling/fleet-audit . --json
```

## What it checks

- `FLEET.md`, `FLEET-STATE.md`
- Registry (`agents/registry.yaml` or `patterns/registry.yaml`)
- Agent manifests
- Permissions model
- `fleet-budget.md`
- Kill switch and accountability references
- Optional: inbox/audit runbooks, handoff schema