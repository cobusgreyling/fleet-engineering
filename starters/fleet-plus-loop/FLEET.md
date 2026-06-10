# FLEET.md — fleet-plus-loop starter

## Maturity target

F1 catalog + L1 loop. Week one: no unattended production writes.

## Active patterns

- [x] Team Agent Registry
- [ ] Fleet Budget Guard
- [ ] Shared Inbox HITL

## Kill switch

1. `FLEET_PAUSE_ALL=true` in team env
2. Pause schedulers per `agents/registry.yaml`
3. Disable loop automation in `LOOP.md`

## Loop bridge

Agent `example-agent` runs loop pattern `daily-triage`. See `LOOP.md`.