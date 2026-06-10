# Fleet Primitives Matrix

How fleet primitives map across platforms. Tool-agnostic discipline; vendor-specific cells.

| Primitive | DIY (this repo) | LangSmith Fleet | OpenHermit | Notes |
|-----------|-----------------|-----------------|------------|-------|
| Registry | `FLEET-STATE.md` + `AGENT-MANIFEST.yaml` | Workspace agent list | `hermit` CLI + Postgres | |
| Identity | manifest `identity: claw\|assistant` | Claw vs Assistant model | Per-agent Docker + creds | |
| Permissions | `permissions-model.yaml` | clone / run / edit | CLI `--all` skills ops | |
| Inbox | GitHub Issues / manual | Fleet Inbox | Web UI | |
| Audit | git + CI logs; optional LangSmith | Native tracing | Session logs | |
| Economics | `fleet-budget.md` | Platform metering (varies) | Per-deployment limits | |
| Sovereign control | `FLEET.md` kill section | Admin controls | `hermit` pause | |

## When to use what

| Situation | Start with |
|-----------|------------|
| Enterprise, mixed builders | LangSmith Fleet + this repo's checklists |
| Self-hosted, eng team | DIY templates + loop-engineering |
| Personal agent farm | OpenHermit / SwarmClaw + F1 registry |

## LangSmith Fleet mapping

From [Introducing LangSmith Fleet](https://www.langchain.com/blog/introducing-langsmith-fleet):

| Fleet feature | Primitive |
|---------------|-----------|
| Agent identity and credentials | Identity |
| Tiered permissions and sharing | Permissions |
| Agent Inbox | Inbox |
| Agent observability | Audit |

## DIY minimum (F1)

Files from `fleet-init`:

```
FLEET.md
FLEET-STATE.md
agents/registry.yaml
agents/manifests/*.yaml
templates/permissions-model.yaml
templates/fleet-budget.md
```

No platform required — but you must enforce permissions and inbox manually until F2.