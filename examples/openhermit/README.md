# OpenHermit

Self-hosted fleet operations — per-agent Docker workspaces, Postgres state, CLI fleet ops.

| Primitive | OpenHermit |
|-----------|------------|
| Registry | `hermit` CLI + DB |
| Economics | per-deployment limits (configure) |
| Sovereign control | pause via CLI |

## Worked example: accountability + permissions

Even when runtime is OpenHermit, keep git-backed governance from this repo:

```bash
npx @cobusgreyling/fleet-init ~/hermit-governance --pattern team-agent-registry
```

### Sample permissions overlay

Use [sample-permissions.yaml](sample-permissions.yaml) with OpenHermit deployment names mapped to manifest `id` fields.

### Accountability test (sample action)

> **Which agent:** `research-hermit-3`  
> **Authority:** claw (service credential `HERMIT_SVC_RESEARCH`)  
> **Task:** ingest vendor PDF batch `2026-06-09`  
> **Evidence:** OpenHermit run `run_8f2a` + manifest `agents/manifests/research-hermit.yaml`

If any clause is blank, classify as F0 `experimental` and block write-external connectors.

See [docs/primitives-matrix.md](../../docs/primitives-matrix.md).