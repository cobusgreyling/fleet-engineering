# DIY Fleet — F1 in One Afternoon

End-to-end walkthrough using only git-backed artifacts. No platform required.

## Before (empty workspace)

```bash
mkdir ~/diy-fleet && cd ~/diy-fleet
npx @cobusgreyling/fleet-audit .
# Score: ~10/100  Level: F0
```

## Scaffold (15 minutes)

```bash
npx @cobusgreyling/fleet-init . --pattern team-agent-registry
npx @cobusgreyling/fleet-audit . --suggest
# Score: ~55–65/100  Level: F1
```

## Customize (30 minutes)

1. Copy `agents/manifests/example-agent.yaml` → `agents/manifests/weekly-report.yaml`
2. Set real `owner`, `loops`, and `budget_daily_tokens`
3. Update `agents/registry.yaml` and `FLEET-STATE.md`
4. Run accountability test on last week's "who sent that report?" incident

```bash
node ../fleet-engineering/scripts/validate-agents.mjs .
npx @cobusgreyling/fleet-budget .
```

## After (F1 catalog)

Expected audit findings:

- ✓ FLEET.md, FLEET-STATE.md, registry, manifests
- ✓ Permissions and budget documented
- ✓ Kill switch in FLEET.md
- ✓ `.github/workflows/fleet-audit.yml` (if using starter CI)

## Promote to F2

Add inbox + enforce caps:

```bash
npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl
# Edit inbox-runbook.md with your Slack/GitHub channel
```

See [patterns/fleet-budget-guard](../../patterns/fleet-budget-guard.md) and [patterns/shared-inbox-hitl](../../patterns/shared-inbox-hitl.md).

## Pair with loops

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
```

See [starters/fleet-plus-loop](../../starters/fleet-plus-loop/).