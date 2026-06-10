# LangSmith Fleet

Maps fleet primitives to [LangSmith Fleet](https://www.langchain.com/langsmith/fleet).

| Primitive | Fleet feature |
|-----------|---------------|
| Identity | Claw vs Assistant |
| Permissions | clone / run / edit |
| Inbox | Agent Inbox |
| Audit | LangSmith tracing |

## Week one on Fleet

1. Create 1–2 agents in workspace
2. Export agent list to team `agents/registry.yaml` (git backup)
3. Set permissions: `run` for workspace, `edit` for owners only
4. Route risky tools through Inbox before F2 autonomy

## Sample registry backup

After exporting from LangSmith Fleet console, normalize to repo format:

```yaml
agents:
  - id: vendor-intake
    manifest: agents/manifests/vendor-intake.yaml
    owner: platform-team
    status: active
    pattern: shared-inbox-hitl
    evidence: langsmith://workspace/agents/vendor-intake
```

See [sample-registry.yaml](sample-registry.yaml) and [docs/primitives-matrix.md](../../docs/primitives-matrix.md).

## Scaffold git backup layer

```bash
npx @cobusgreyling/fleet-init ~/fleet-backup --pattern team-agent-registry
# Weekly: diff LangSmith agent list vs agents/registry.yaml
npx @cobusgreyling/fleet-audit ~/fleet-backup
```