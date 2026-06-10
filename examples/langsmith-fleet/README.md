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
2. Export agent list to team `agents/registry.yaml` (backup)
3. Set permissions: run for workspace, edit for owners only
4. Route risky tools through Inbox before F2 autonomy

See [docs/primitives-matrix.md](../../docs/primitives-matrix.md).