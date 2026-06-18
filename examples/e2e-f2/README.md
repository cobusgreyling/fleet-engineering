# E2E F2 Fleet Example

Runnable F2 workspace: registry, inbox, budget, audit CI, and sample run log.

```bash
# From repo root
cp -r examples/e2e-f2 /tmp/my-fleet-e2e
cd /tmp/my-fleet-e2e
npx @cobusgreyling/fleet-audit . --json
npx @cobusgreyling/fleet-budget .
npx @cobusgreyling/fleet-cost .
```

Expected: score ≥ 65 (F2), budget rollup, cost attribution from `fleet-run-log.jsonl`.