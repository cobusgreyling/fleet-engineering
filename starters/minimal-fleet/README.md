# Minimal Fleet Starter

F1 starter kit: catalog + permissions + budget + CI audit. No platform lock-in.

**Use this template:** click "Use this template" on GitHub, or scaffold locally:

```bash
npx @cobusgreyling/fleet-init /path/to/your/workspace --pattern team-agent-registry
npx @cobusgreyling/fleet-audit /path/to/your/workspace --suggest
npx @cobusgreyling/fleet-budget /path/to/your/workspace
```

## What you get

```
FLEET.md
FLEET-STATE.md
fleet-budget.md
permissions-model.yaml
agents/registry.yaml
agents/manifests/example-agent.yaml
.github/workflows/fleet-audit.yml
```

## Week one

1. Replace `example-agent` manifest with your real agents
2. Run accountability test on one recent action
3. Do **not** enable unattended L2+ loops until inbox + budget exist

## Pattern variants

```bash
npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl      # adds inbox-runbook.md
npx @cobusgreyling/fleet-init . --pattern hierarchical-delegation # adds handoff-schema.json
npx @cobusgreyling/fleet-init . --pattern cross-agent-audit       # adds audit-runbook.md
```

## Next patterns

- [Shared Inbox HITL](../../patterns/shared-inbox-hitl.md)
- [Fleet Budget Guard](../../patterns/fleet-budget-guard.md)

## Prerequisite

Understand at least one [loop-engineering](https://github.com/cobusgreyling/loop-engineering) pattern before registering loop-backed agents. See [starters/fleet-plus-loop](../fleet-plus-loop/).