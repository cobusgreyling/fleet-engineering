# Fleet Design Checklist

Ship readiness rubric. Score with `fleet-audit`.

## F0 → F1 (Catalog)

- [ ] `FLEET.md` describes fleet posture for this team/repo
- [ ] `FLEET-STATE.md` or `agents/registry.yaml` lists active agents
- [ ] Each agent has `AGENT-MANIFEST.yaml` with owner
- [ ] Identity model documented (claw vs assistant)
- [ ] Permissions model (clone / run / edit) written down
- [ ] Accountability test passed for one recent action
- [ ] No production writes without human gate in week one

## F1 → F2 (Shared)

- [ ] 100% active agents in registry (no shadow agents)
- [ ] Shared inbox or equivalent for risky actions
- [ ] `fleet-budget.md` with per-agent daily caps
- [ ] Kill switch documented in `FLEET.md`
- [ ] Cross-agent audit path (trace search or log export)
- [ ] Loop patterns linked from each manifest
- [ ] `fleet-audit` score ≥ 40

## F2 → F3 (Enterprise)

- [ ] Autonomy tiers by data class (F1/F2/F3 per agent)
- [ ] Policy-as-code for tool allowlists
- [ ] Rollback procedure for agent configs tested once
- [ ] Inbox SLA defined for high-risk classes
- [ ] Compliance export format agreed
- [ ] `fleet-audit` score ≥ 65

## Per-agent manifest checklist

- [ ] `id`, `owner`, `version`
- [ ] `identity`: claw | assistant
- [ ] `permissions` levels defined
- [ ] `loops` or `pattern` reference
- [ ] `autonomy_tier`: F0–F3
- [ ] `budget_daily_tokens` (or N/A with justification)
- [ ] `connectors` list with risk class
- [ ] `human_gates` explicit

## Red flags (stop scaling)

- Shared API key with no agent attribution
- L3 unattended loop not in registry
- No owner for an agent touching customer data
- Inbox bypass for "just this once" destructive tools