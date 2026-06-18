# LOOP.md — {{PATTERN}} agent loop

Fleet agent `example-agent` runs this loop. Keep IDs aligned with `agents/manifests/example-agent.yaml`.

## Active Loops

| Pattern | Cadence | Status | Tool |
|---------|---------|--------|------|
| {{LOOP_PATTERN}} | L1 report-only | active | {{LOOP_TOOL}} |

## Human Gates

- No unattended L2+ until fleet reaches F2 (inbox + budget enforced)
- Risky actions route through inbox — see `inbox-runbook.md` if present

## Budget

- Per-agent cap: see manifest `budget_daily_tokens`
- Fleet rollup: `npx @cobusgreyling/fleet-budget .`
- Spend attribution: `npx @cobusgreyling/fleet-cost .`
- Kill switch: `FLEET_PAUSE_ALL=1` — see `FLEET.md`

## Links

- Loop pattern: [{{LOOP_PATTERN}}](https://github.com/cobusgreyling/loop-engineering/tree/main/patterns/{{LOOP_PATTERN}}.md)
- Fleet bridge: [fleet-plus-loop](https://github.com/cobusgreyling/fleet-engineering/tree/main/starters/fleet-plus-loop)