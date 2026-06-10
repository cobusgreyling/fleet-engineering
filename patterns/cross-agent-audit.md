# Cross-Agent Audit

**Goal:** Answer the accountability test across agent boundaries during incidents and compliance reviews.

## When to use

- Post-incident "which agent did this?"
- Regulated environment
- Multi-agent handoffs

## Week one (F1)

Read-only audit playbook; no new retention infrastructure required.

## Audit query checklist

1. Time range
2. Agent ID(s)
3. Principal (claw vs user)
4. Tool classes involved
5. Correlation / trace ID

## Minimum evidence chain

```
User request / schedule
  → agent_id@version
  → principal
  → tool calls (structured)
  → outcome + inbox_id (if gated)
```

## DIY

- Git log + CI runs for repo agents
- Export LangSmith traces weekly to team bucket
- `FLEET-STATE.md` links to workflow run URLs (this repo's dogfood)

## LangSmith Fleet

Native tracing per agent action — combine with agent identity for full clause coverage.

## Human gates

- Audit export containing PII
- Retention policy changes