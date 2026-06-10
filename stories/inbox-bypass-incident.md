# Inbox Bypass — "Just This Once"

**Context:** Deploy agent with inbox configured; on-call approved via DM instead of inbox record.  
**Pattern:** Shared Inbox HITL (F1)

## What broke

Incident review could not answer *evidenced by what?* — no trace linked to approval. Compliance flagged as policy bypass.

## What worked

Retroactive inbox row created; DM approvals banned. All destructive tools now block without `IN-*` ticket ID.

## Scores

- fleet-audit before: 48/100 (F1 on paper)
- fleet-audit after: 62/100 (inbox runbook + workflow reference)

## Lesson

An inbox nobody uses is worse than no inbox — it creates false confidence. Week one = approve-only **through the channel**.