# Fleet + Loop Starter

Bridge kit: one agent with matched **loop** (L1) and **fleet** (F1) artifacts.

## Scaffold

```bash
npx @cobusgreyling/fleet-init . --pattern team-agent-registry
# Then add loop layer from loop-engineering:
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
```

## ID alignment

| Layer | File | ID field |
|-------|------|----------|
| Fleet | `agents/manifests/example-agent.yaml` | `id: example-agent` |
| Fleet | `agents/manifests/example-agent.yaml` | `loops: [daily-triage]` |
| Loop | `LOOP.md` | pattern `daily-triage` |

## Safe together?

| Loop level | Fleet level | Safe? |
|------------|-------------|-------|
| L0 manual | F0 ad-hoc | Yes (default chaos) |
| L1 scheduled | F1 catalog | Yes, with human gates |
| L2+ unattended | F1 | **No** — need F2 inbox + budget |
| L2+ unattended | F2 | Yes, with caps and audit |

See [docs/concepts.md](../../docs/concepts.md#loop-fleet-maturity-bridge).

## Week one

1. Register agent in `agents/registry.yaml`
2. Link `loops:` to a [loop-engineering pattern](https://github.com/cobusgreyling/loop-engineering/tree/main/patterns)
3. Run `npx @cobusgreyling/fleet-audit .` and `npx @cobusgreyling/loop-audit .`
4. Keep loop at L1 until fleet reaches F2