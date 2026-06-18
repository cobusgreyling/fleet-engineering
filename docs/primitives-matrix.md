# Fleet Primitives Matrix

How fleet primitives map across platforms. Tool-agnostic discipline; vendor-specific cells.

| Primitive | DIY (this repo) | LangSmith Fleet | OpenHermit | Cursor | Claude Code | Codex / Copilot | Grok |
|-----------|-----------------|-----------------|------------|--------|-------------|-----------------|------|
| Registry | `FLEET-STATE.md` + manifests | Workspace agent list | `hermit` CLI + Postgres | `.cursor/rules`, project docs | `CLAUDE.md`, agents | Workspace agents | Scheduled tasks + MCP |
| Identity | manifest `claw\|assistant` | Claw vs Assistant | Per-agent Docker + creds | User session | User session | User / service | User / API key |
| Permissions | `permissions-model.yaml` | clone / run / edit | CLI skills ops | Team rules (manual) | Project scope | Org policy | Connector scopes |
| Inbox | GitHub Issues / manual | Fleet Inbox | Web UI | Not native — DIY | Not native — DIY | PR review | Not native — DIY |
| Audit | git + CI; LangSmith optional | Native tracing | Session logs | Local history | Session logs | GH Actions logs | Run history |
| Economics | `fleet-budget` + `fleet-cost` | Platform metering | Per-deployment | Usage dashboard | API billing | Copilot metrics | Token dashboard |
| Sovereign control | `FLEET_PAUSE_ALL` in FLEET.md | Admin controls | `hermit pause` | Disable rules | Pause automations | Disable workflows | Pause schedules |

## When to use what

| Situation | Start with |
|-----------|------------|
| Enterprise, mixed builders | LangSmith Fleet + this repo's checklists |
| Self-hosted eng team | DIY templates + loop-engineering |
| IDE-native agents (Cursor, Claude Code) | F1 registry in git + permissions doc |
| Personal agent farm | OpenHermit + F1 registry |
| GitHub-centric (Codex, Copilot) | Registry + CI audit workflow |

## Not native? Use DIY artifact

| Platform gap | Fleet engineering fill-in |
|--------------|----------------------------|
| No team registry | `agents/registry.yaml` + `fleet-init` |
| No shared inbox | `inbox-runbook.md` + GitHub Issues label |
| No cross-agent audit | `audit-runbook.md` + `fleet-run-log.jsonl` |
| No per-agent caps | `fleet-budget.md` + manifest `budget_daily_tokens` |

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
permissions-model.yaml
fleet-budget.md
```

No platform required — enforce permissions and inbox manually until F2.

See also: [fleet-vs-frameworks.md](./fleet-vs-frameworks.md)