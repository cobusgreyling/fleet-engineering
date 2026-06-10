# Shadow Agents Found in Audit — Honest Failure

**Context:** 8 "official" agents in LangSmith; 14 actually running across IDE configs.  
**Pattern:** Team Agent Registry (F1)

## What broke

`fleet-audit` on a partial workspace scored 32/100 (F0+). Inventory sprint found 6 shadow agents with shared API keys and no owner.

## What worked

Running audit before claiming F1 forced honesty. Retired 4 shadows; registered 10 with owners in 1 day.

## Accountability test

Before: 2/4 clauses answerable for shadow agents.  
After: 4/4 for all `status: active` agents.

## Lesson

Audit score is a governance instrument, not a vanity metric. F1 means **100% active agents in registry**, not "we wrote FLEET.md."