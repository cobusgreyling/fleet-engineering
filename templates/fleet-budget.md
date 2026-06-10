# Fleet Budget — {{TEAM_NAME}}

Review cadence: weekly  
Hard stop: pause agent scheduler when daily cap exceeded

## Team totals

| Period | Cap (tokens) | Spent | Owner |
|--------|--------------|-------|-------|
| Monthly | 50_000_000 | — | platform-lead |

## Per-agent caps

| Agent ID | Daily cap | Alert at % | Loop pattern | Owner |
|----------|-----------|------------|--------------|-------|
| example-agent | 100_000 | 80 | daily-triage | team-name |

## Admission control

1. At 80% daily cap → notify owner (Slack/email)
2. At 100% → pause agent; require inbox approval to resume
3. Monthly team cap → `FLEET_PAUSE_ALL` except read-only triage

## Override log

| Date | Agent | Old cap | New cap | Approver | Reason |
|------|-------|---------|---------|----------|--------|
| — | — | — | — | — | — |