# FLEET.md — E2E F2 Example

## Posture

F2 shared fleet: catalog, inbox, budgets, audit.

## Kill switch

Set `FLEET_PAUSE_ALL=1` to halt all scheduled agents. Document in inbox-runbook.md.

## Accountability test

Every action must answer: which agent, what authority, what task, what evidence.

## Active patterns

- [x] Team Agent Registry
- [x] Shared Inbox HITL
- [x] Fleet Budget Guard
- [x] Cross-Agent Audit