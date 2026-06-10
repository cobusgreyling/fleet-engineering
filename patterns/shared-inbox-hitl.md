# Shared Inbox HITL

**Goal:** One place for humans to review, approve, or reject agent actions across the fleet.

## When to use

- Multiple agents can take external actions (email, tickets, deploys)
- "Who approved that?" is already a question

## Week one (F1)

Approve-only. Agents propose; humans commit. No auto-execute on destructive class.

## Model (LangSmith Fleet)

- **Claw:** editors with edit access review fleet-visible threads
- **Assistant:** per-user private inbox for sensitive personal tasks

## DIY equivalent

- GitHub Issues with label `fleet-inbox`
- Slack channel `#agent-approvals` with required reaction before tool continuation
- Linear project "Agent Inbox"

## Inbox record shape

```markdown
## Inbox — 2026-06-10

| ID | Agent | Action | Principal | Status | Trace |
|----|-------|--------|-----------|--------|-------|
| IN-1042 | vendor-intake | Create Linear issue | claw | approved | trace-abc |
```

## Human gates (always)

- Destructive tools
- External customer communication
- Production writes
- Spend above per-action threshold

## Failure modes

- FM-03 Inbox Bypass — see [failure-modes.md](../docs/failure-modes.md)

## Verification

Approved actions must link `inbox_id` in audit log or PR body.