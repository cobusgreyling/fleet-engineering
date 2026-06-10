# Agent Clone & Fork

**Goal:** Spread a proven agent across teams without permission chaos or config drift.

## When to use

- One team built `vendor-intake`; three other teams want it
- LangSmith Fleet "can clone" permission model applies

## Permission levels

| Level | Meaning |
|-------|---------|
| Can clone | Fork into own copy to customize |
| Can run | Use canonical agent unchanged |
| Can edit | Maintain canonical agent |

## Week one (F1)

Publish **can run** for most users; **can clone** for leads only. No edit for non-owners.

## Fork tracking

Every clone registers:

```yaml
id: vendor-intake-emea
forked_from: vendor-intake@1.2.0
owner: emea-ops
```

## Human gates

- Clone promoted to production connectors
- Upstream merge from canonical to fork
- Retire canonical while forks exist

## Anti-pattern

Clone → customize → lose accountability link to `forked_from`.