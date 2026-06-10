# Minimal Fleet Starter

F1 starter kit: catalog + permissions + budget templates. No platform lock-in.

## Copy or scaffold

```bash
# From fleet-engineering repo root
node tools/fleet-init/dist/cli.js /path/to/your/workspace --pattern team-agent-registry
```

## What you get

```
FLEET.md
FLEET-STATE.md
agents/registry.yaml
agents/manifests/example-agent.yaml
templates/permissions-model.yaml   # copied to fleet root
fleet-budget.md
```

## Week one

1. Replace `example-agent` manifest with your real agents
2. Run accountability test on one recent action
3. Do **not** enable unattended L2+ loops until inbox + budget exist

## Next patterns

- [Shared Inbox HITL](../../patterns/shared-inbox-hitl.md)
- [Fleet Budget Guard](../../patterns/fleet-budget-guard.md)

## Prerequisite

Understand at least one [loop-engineering](https://github.com/cobusgreyling/loop-engineering) pattern before registering loop-backed agents.