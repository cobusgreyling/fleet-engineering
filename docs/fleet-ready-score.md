# Fleet Ready Score

Public contract for `npx @cobusgreyling/fleet-audit`.

Mirrors **Loop Ready** so people who already trust loop-audit adopt fleet-audit without relearning the ritual.

## Levels

| Level | Score | Meaning | Safe autonomy |
|-------|-------|---------|----------------|
| **F0** | 0–39 | Ad-hoc population | Humans only; catalog what exists |
| **F1** | 40–64 | Cataloged | Report + HITL inbox; no unattended prod writes |
| **F2** | 65–84 | Shared fleet | Budgets + kill switch + clone policy |
| **F3** | 85–100 | Enterprise fleet | Policy-as-code, compliance export, SLOs |

Default CI gate for “we know our agents”: `--min-score=40` (F1).  
Default gate for “shared team fleet”: `--min-score=65` (F2).

## Score weights (target product UX)

Approximate contributions used by `fleet-audit` (base 10):

| Signal | Points | Why |
|--------|--------|-----|
| `FLEET.md` posture | +15 | Written intent and sovereign control |
| `FLEET-STATE.md` | +12 | Human-readable catalog |
| Registry present | +12 | Machine list of agents |
| Manifests | +8–14 | Per-agent identity + owner |
| Permissions model | +10 | clone / run / edit clarity |
| Budget file | +10 | Economics exist |
| Kill switch language | +8 | Sovereign control |
| Accountability test | +10 | The one-sentence standard |
| Patterns registry | +6 | Intentional design |
| Audit workflow dogfood | +5 | Continuous readiness |
| Schema valid / no shadows | penalties | Lies in the registry are worse than no registry |
| Inbox + audit runbooks | bonus via files | HITL path |

Exact numbers may drift; **levels and the accountability sentence must not.**

## Human output template

```
Fleet Ready: 48/100  ·  F1 cataloged

OK
  FLEET.md present
  Registry file found
  2 agent manifest(s)
  Fleet budget file present

WARN
  Missing inbox-runbook.md
  Kill switch not documented
  Accountability test not referenced

Suggested actions
  npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl
  Document kill switch + FLEET_PAUSE in FLEET.md
  Add the accountability sentence to FLEET.md
```

## How to climb fast (solo, 30 minutes)

1. `npx @cobusgreyling/fleet-init . --pattern team-agent-registry`
2. Fill owners on each manifest
3. Add inbox pattern if any agent can write
4. Write kill switch paragraph
5. `npx @cobusgreyling/fleet-audit . --suggest`
6. Stop at F1 for a week — do not skip to unattended loops

## Mapping from Loop Ready

| Loop | Fleet expectation |
|------|-------------------|
| L1 report-only | Register at F1 |
| L2 assisted | F1 inbox + identity required |
| L3 unattended | F2 budgets + kill switch minimum |

See [maturity-model.md](./maturity-model.md) and [accountability-test.md](./accountability-test.md).
