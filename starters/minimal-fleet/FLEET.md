# FLEET.md

Fleet posture for this workspace. Customize after `fleet-init`.

## Maturity target

F1 — cataloged. Week one: no unattended production writes.

## Accountability test

Required for every production-touching agent. See fleet-engineering `docs/accountability-test.md`.

## Kill switch

1. Set `FLEET_PAUSE_ALL=true` in team env, or
2. Disable schedulers per `agents/registry.yaml`, or
3. Pause agents in platform console (LangSmith Fleet / etc.)

## Active patterns

- [ ] Team Agent Registry
- [ ] Fleet Budget Guard
- [ ] Shared Inbox HITL