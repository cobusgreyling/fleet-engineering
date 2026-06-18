# Enterprise F3 Starter

Policy-as-code, autonomy tiers, compliance export, and tested kill switch.

```bash
npx @cobusgreyling/fleet-init . --pattern cross-agent-audit
cp -r examples/enterprise-f3/policy examples/enterprise-f3/compliance .  # or copy whole dir
npx @cobusgreyling/fleet-audit . --json
```

## Artifacts

| File | Purpose |
|------|---------|
| `policy/tool-allowlist.yaml` | Denylist / allowlist by data class |
| `policy/autonomy-tiers.yaml` | F1–F3 gates per connector risk |
| `compliance/audit-event.schema.json` | Export format for cross-agent audit |
| `compliance/export-runbook.md` | Retention and export procedure |
| `FLEET.md` | Kill switch + rollback tested quarterly |

## Exit criteria (F3)

- [ ] Autonomy tiers enforced in CI (`scripts/check-policy.mjs`)
- [ ] Inbox SLA documented for destructive tools
- [ ] Rollback procedure tested once per quarter
- [ ] `fleet-audit` score ≥ 65