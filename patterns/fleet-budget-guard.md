# Fleet Budget Guard

**Goal:** Attribute and cap token/API spend before fleet scale surprises the finance team.

## When to use

- 2+ unattended or scheduled loops
- Sub-agents multiply cost
- Nobody owns the bill

## Week one (F1)

Caps and reporting only — hard stop without disabling agents first.

## Artifact

Copy [templates/fleet-budget.md](../templates/fleet-budget.md):

```markdown
## Team cap (monthly tokens): 50_000_000

| Agent | Daily cap | Owner | Alert at |
|-------|-----------|-------|----------|
| daily-triage | 100_000 | platform | 80% |
| pr-babysitter | 2_000_000 | eng | 80% |
```

## Admission control

When agent exceeds daily cap:
1. Pause scheduler for that agent only
2. Notify owner
3. Require inbox approval to raise cap

## Pair with loop engineering

Use [loop-cost](https://github.com/cobusgreyling/loop-engineering/tree/main/tools/loop-cost) estimates when setting caps.

## Human gates

- Cap override > 2× default
- Moving agent to F3 unattended without budget history