# fleet-cost

Attribute token spend per fleet agent.

```bash
npx @cobusgreyling/fleet-cost .
npx @cobusgreyling/fleet-cost . --json
```

## Run log

Append JSONL lines to `fleet-run-log.jsonl`:

```json
{"agent_id":"weekly-report","tokens":42000,"timestamp":"2026-06-18T10:00:00Z"}
```

Without a log, estimates from manifest `loops:` using loop-engineering cost tiers.

## Pair with fleet-budget

```bash
npx @cobusgreyling/fleet-budget .
npx @cobusgreyling/fleet-cost .
```