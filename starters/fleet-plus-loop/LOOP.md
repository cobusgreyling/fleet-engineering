# LOOP.md — example-agent / daily-triage

Loop pattern: **daily-triage** (from [loop-engineering](https://github.com/cobusgreyling/loop-engineering))

Fleet manifest: `agents/manifests/example-agent.yaml`  
Fleet tier: **F1** — cataloged, human gates on risky actions

## Maturity

- Loop level target: **L1** (scheduled triage, human gate on writes)
- Fleet level target: **F1** (registry + permissions)

Do not promote loop to L2+ until fleet reaches F2 (inbox + budget enforced).

## Accountability

Every loop run must map to fleet agent `example-agent` with trace evidence.