# DIY Fleet

No platform required — git-backed fleet artifacts.

## Minimum F1 workspace

```
FLEET.md
FLEET-STATE.md
agents/registry.yaml
agents/manifests/*.yaml
permissions-model.yaml
fleet-budget.md
```

## Scaffold

```bash
git clone https://github.com/cobusgreyling/fleet-engineering.git
node fleet-engineering/tools/fleet-init/cli.js /path/to/team-workspace
node fleet-engineering/tools/fleet-audit/cli.js /path/to/team-workspace
```

Pair with [loop-engineering](https://github.com/cobusgreyling/loop-engineering) for loop patterns inside each agent manifest.