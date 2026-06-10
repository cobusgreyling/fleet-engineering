# Team Agent Registry

**Goal:** Know what agents exist, who owns them, and what each is allowed to do — before scaling further.

## When to use

- 3+ agents and nobody has a complete list
- New hire asks "which bots can I use?"
- Compliance asks for an inventory

## Week one (F1)

Catalog only. No new production connectors without a manifest.

## Required artifacts

- `agents/registry.yaml` — machine-readable index
- `agents/manifests/<id>.yaml` — per agent
- `FLEET-STATE.md` — human-friendly status board

Scaffold:

```bash
node tools/fleet-init/dist/cli.js . --pattern team-agent-registry
```

## Manifest minimum

```yaml
id: weekly-sales-numbers
owner: sales-ops
version: 1.0.0
identity: claw
permissions: [run]
loops: [daily-triage]
autonomy_tier: F1
status: active
```

## Registry review cadence

- Weekly: 15-minute owner scan of `FLEET-STATE.md`
- Monthly: retire `status: paused` > 30 days

## Human gates

- New agent touching production data
- Credential model changes
- Owner change without handoff note

## Accountability test

Every registry entry must support all four clauses. If not, mark `status: experimental` and restrict connectors.

## Platform notes

**LangSmith Fleet:** Workspace list is the registry; export metadata to team `agents/registry.yaml` for git-backed backup.

**DIY:** This pattern is the foundation — start here.