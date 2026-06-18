# FLEET.md — Enterprise F3

## Sovereign control

Kill switch: `FLEET_PAUSE_ALL=1` — halts all scheduled agents within 5 minutes.

Rollback: revert manifest commit + `hermit pause <id>` or platform equivalent.

Tested: 2026-06-18 (tabletop).

## Accountability test

Required for every production action. Export format: `compliance/audit-event.schema.json`.

## Policy

- Tool allowlist: `policy/tool-allowlist.yaml`
- Autonomy tiers: `policy/autonomy-tiers.yaml`
- CI check: `node scripts/check-policy.mjs`

## Active patterns

- [x] Team Agent Registry
- [x] Cross-Agent Audit
- [x] Fleet Budget Guard