# Budget Cap Stopped a Runaway Loop

**Context:** Manager loop spawned 12 sub-agent retries on a flaky API; spend 8× normal by 6am.  
**Pattern:** Fleet Budget Guard (F1)

## What worked

`budget_daily_tokens: 500_000` on manager manifest triggered pause at 100%. Owner woke to alert, not invoice surprise.

## What broke

Sub-agents had no individual caps — manager absorbed all spend. Added per-worker caps in manifests.

## Scores

- fleet-budget rollup before fix: 1 agent over cap (manager)
- After: 13 agents with caps; monthly estimate under team cap

## Lesson

Fleet Budget Guard without per-agent attribution hides runaway **delegation trees**. Cap the manager **and** workers.