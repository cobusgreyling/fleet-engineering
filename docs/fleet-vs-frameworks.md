# Fleet Engineering vs Multi-Agent Frameworks

Fleet engineering is **governance** for populations of agents. Frameworks are **execution** for individual runs or graphs.

| Question | Fleet engineering | LangGraph / CrewAI / AutoGen |
|----------|-------------------|------------------------------|
| Unit of design | Governed population | Agent graph or crew |
| Primary artifact | Registry + manifest | Code / graph definition |
| "Who did this?" | Accountability test | Trace per run (if configured) |
| Permissions | clone / run / edit across team | Usually per-deployment |
| Economics | Per-agent caps + attribution | Per-run metering (varies) |
| Human gates | Shared inbox across agents | Per-node interrupt (varies) |

## When to use what

| Situation | Start with |
|-----------|------------|
| Building one autonomous workflow | [loop-engineering](https://github.com/cobusgreyling/loop-engineering) |
| 3+ agents across Slack, IDE, SaaS | Fleet engineering (F1 registry) |
| Enterprise LangSmith deployment | LangSmith Fleet + this repo's checklists |
| Custom Python agent graph | Framework for execution + fleet manifests for governance |

## They compose

```
Framework (execution)  →  Loop (cadence)  →  Fleet (governance)
```

Register each loop-backed agent in `agents/manifests/`. Link `loops:` to loop-engineering patterns. Run `fleet-audit` before scaling L2+ loops.

## Anti-pattern

Using a multi-agent framework **instead of** a registry when the real problem is "we don't know what agents exist." Frameworks do not replace catalog, inbox, or budget discipline.