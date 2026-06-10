# The Accountability Test

The single standard that separates a **fleet** from a **population** of agents.

## The Sentence

For every agent action that touches production data, customer systems, or shared credentials, you must be able to answer:

> **Which agent did it, with what authority, against what task, evidenced by what?**

If any clause is blank, you do not have fleet engineering — you have hope.

## Clause by Clause

### Which agent did it?

- Stable agent ID (not "the Slack bot")
- Version or config hash
- Instance / deployment identifier if relevant

**Bad:** "Claude did something in the channel."  
**Good:** `vendor-intake@1.2.0` (claw) via LangSmith Fleet workspace `acme-prod`.

### With what authority?

- Principal: service account vs acting-as-user
- Permission level: clone / run / edit
- Tool scope: which MCP servers, APIs, repos

**Bad:** "It had API keys somewhere."  
**Good:** Claw credentials for Linear workspace `ENG`; run-only for workspace members; edit for `ops-team`.

### Against what task?

- User request, scheduled job, or loop state item
- Linked ticket / PR / inbox thread
- Stated goal from manifest or run record

**Bad:** "It was doing research."  
**Good:** Scheduled `daily-triage` run; state item `#1241 flaky auth test`; human approved inbox action `approve-8821`.

### Evidenced by what?

- Structured trace (tool calls, decisions)
- Audit log exportable for compliance
- Correlation ID across handoffs

**Bad:** Screenshot of chat.  
**Good:** LangSmith trace `trace-abc123` + inbox approval record + git commit `def456` with agent attribution in PR body.

## Quick Audit (15 minutes)

Walk one recent incident or agent action through the four clauses. Score:

| Score | Meaning |
|-------|---------|
| 4/4 | Fleet-ready for that action class |
| 2–3/4 | Fleet in progress — patch the gaps |
| 0–1/4 | Population — stop scaling until registry + audit exist |

## CI Hook

`fleet-audit` checks for artifacts that support the test:

- `FLEET.md` or `FLEET-STATE.md`
- `templates/AGENT-MANIFEST.yaml` or `agents/` manifests
- Identity / permissions documentation
- Budget and kill-switch references

```bash
npx @cobusgreyling/fleet-audit . --suggest
```

## When the test is hard on purpose

Some exploratory agents will score 1/4 — that is fine **if** they are classified F0 sandbox with no production connectors. Fleet engineering is about **classifying** and **promoting** agents, not banning experiments.

Promotion path: F0 sandbox → F1 cataloged (test passes for scoped actions) → F2 shared → F3 enterprise.