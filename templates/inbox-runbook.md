# Inbox Runbook — {{TEAM_NAME}}

Pattern: **Shared Inbox HITL** · Initialized {{DATE}}

## Channels

| Channel | Use for | SLA |
|---------|---------|-----|
| GitHub Issues `fleet-inbox` | Destructive tools, prod writes | 4h business hours |
| Slack `#agent-approvals` | External comms, spend overrides | 1h when tagged `@oncall` |

## Record shape

```markdown
| ID | Agent | Action | Principal | Status | Trace |
|----|-------|--------|-----------|--------|-------|
| IN-0001 | example-agent | Deploy staging | claw | pending | trace-abc |
```

## Week one (F1)

- Approve-only — agents propose, humans execute
- No auto-execute on `destructive` or `write-external` connectors
- Link every approval to `agents/registry.yaml` agent id

## Accountability test

Every inbox row must answer: which agent, what authority, what task, what evidence (trace ID).