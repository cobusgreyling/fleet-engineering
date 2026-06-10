# Fleet Maturity Model (F0–F3)

Phased rollout for fleet engineering. Do not skip F1.

## F0 — Ad-hoc Population

**Symptoms:**
- Agents in Slack, IDE, and SaaS with no central list
- Shared API keys in chat
- "Who turned that on?" is a frequent question

**Minimum exit criteria to F1:**
- [ ] `FLEET-STATE.md` or registry file exists
- [ ] Each production-touching agent has an owner
- [ ] Accountability test attempted for one recent action

## F1 — Cataloged

**Posture:** Know what exists; humans approve risky actions.

**Artifacts:**
- `patterns/registry.yaml` or team `agents/registry.yaml`
- `AGENT-MANIFEST.yaml` per agent
- Permissions doc (clone / run / edit)
- Shared inbox or issue queue for approvals

**Week one:** No unattended writes to production. Report and approve only.

**Exit criteria to F2:**
- [ ] 100% of active agents in registry
- [ ] Identity model documented (claw vs assistant)
- [ ] Audit path exists (traces or structured logs)
- [ ] `fleet-audit` score ≥ 40

## F2 — Shared Fleet

**Posture:** Good agents spread across team; budgets enforced.

**Artifacts:**
- Fleet budget file with per-agent caps
- Cross-agent search / audit playbook
- Clone-and-fork policy for team variants
- Kill switch documented and tested once

**Exit criteria to F3:**
- [ ] Budget alerts fire before hard stop
- [ ] Inbox SLA for risky actions
- [ ] Incident runbook references accountability test
- [ ] `fleet-audit` score ≥ 65

## F3 — Enterprise Fleet

**Posture:** Policy-as-code, compliance, SLOs.

**Artifacts:**
- Autonomy tiers by data class
- Attested rollback for agent configs
- Central observability with retention policy
- Board-reportable reliability KPIs

**Not every team needs F3.** Most engineering orgs stabilize at F2.

## Mapping to loop maturity

| Loop level | Fleet implication |
|------------|-------------------|
| L1 report-only loops | Safe to register at F1 |
| L2 assisted loops | Require F1 inbox + identity |
| L3 unattended loops | Require F2 budgets + kill switch minimum |

See [loop-engineering checklist](https://github.com/cobusgreyling/loop-engineering/blob/main/docs/loop-design-checklist.md).