# Cross-Agent Audit Runbook — {{TEAM_NAME}}

Pattern: **Cross-Agent Audit** · Initialized {{DATE}}

## Incident response (F1)

1. Identify time window and affected agent IDs from `agents/registry.yaml`
2. Export traces / logs with shared `trace_id` or `handoff_id`
3. Run accountability test for each action in scope
4. File postmortem in `stories/` or team wiki

## Weekly review

- [ ] Sample 3 random agent actions — can you complete the accountability sentence?
- [ ] Check `fleet-budget.md` spend vs caps
- [ ] Retire `status: paused` agents older than 30 days

## Export format (minimum)

```json
{
  "agent_id": "example-agent",
  "principal": "claw",
  "task": "weekly-report",
  "trace_id": "trace-abc",
  "timestamp": "2026-06-10T12:00:00Z"
}
```