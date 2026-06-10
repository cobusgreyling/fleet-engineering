# fleet-init

Scaffold fleet engineering artifacts into a target workspace.

## Usage

```bash
npx @cobusgreyling/fleet-init /path/to/workspace
npx @cobusgreyling/fleet-init /path/to/workspace --pattern shared-inbox-hitl
```

## Patterns

| Pattern | Extra artifacts |
|---------|-----------------|
| `team-agent-registry` | Base F1 kit |
| `shared-inbox-hitl` | `inbox-runbook.md` |
| `hierarchical-delegation` | `agents/handoff-schema.json` |
| `agent-clone-fork` | `fork-policy.md` |
| `fleet-budget-guard` | Base kit (budget emphasized in FLEET.md) |
| `cross-agent-audit` | `audit-runbook.md` |

## Creates

- `FLEET.md`, `FLEET-STATE.md`, `fleet-budget.md`
- `permissions-model.yaml`
- `agents/registry.yaml`, `agents/manifests/example-agent.yaml`
- `.github/workflows/fleet-audit.yml`

See [docs/RELEASE.md](../../docs/RELEASE.md) for publishing.