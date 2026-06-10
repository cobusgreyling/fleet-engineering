# fleet-init

Scaffold fleet engineering artifacts into a target workspace.

## Usage

```bash
node tools/fleet-init/cli.js /path/to/workspace
node tools/fleet-init/cli.js /path/to/workspace --pattern team-agent-registry
```

## Creates

- `FLEET.md`
- `FLEET-STATE.md`
- `fleet-budget.md`
- `permissions-model.yaml`
- `agents/registry.yaml`
- `agents/manifests/example-agent.yaml`