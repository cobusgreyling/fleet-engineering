# Fleet Patterns

Documented, reusable fleet patterns for real team environments.

Each pattern answers:
- What organizational problem it solves
- Recommended scale and week-one mode (F0–F3)
- Required registry / manifest shape
- Identity and permissions model
- Human hand-off strategy
- Platform notes (DIY, LangSmith Fleet, self-hosted)

## Pattern Registry

| Pattern | Scale | Risk | File |
|---------|-------|------|------|
| Team Agent Registry | 3–20 agents | Low | [team-agent-registry.md](./team-agent-registry.md) |
| Shared Inbox HITL | 2+ active | Low | [shared-inbox-hitl.md](./shared-inbox-hitl.md) |
| Hierarchical Delegation | manager + workers | Medium | [hierarchical-delegation.md](./hierarchical-delegation.md) |
| Agent Clone & Fork | 1 → many | Low | [agent-clone-fork.md](./agent-clone-fork.md) |
| Fleet Budget Guard | any active | Low | [fleet-budget-guard.md](./fleet-budget-guard.md) |
| Cross-Agent Audit | compliance | Low | [cross-agent-audit.md](./cross-agent-audit.md) |
| MCP Resource Lookup | 5+ agents | Medium | [mcp-resource-lookup.md](./mcp-resource-lookup.md) |

Machine-readable index: [registry.yaml](./registry.yaml)

## How to Use a Pattern

1. Pick: [pattern-picker.md](../docs/pattern-picker.md)
2. Scaffold: `npx @cobusgreyling/fleet-init . --pattern <name>`
3. Run week one in **F1 catalog-only** before shared autonomy
4. Audit: `npx @cobusgreyling/fleet-audit . --suggest`

## Adding a Pattern

Add markdown + `registry.yaml` entry. See [CONTRIBUTING.md](../CONTRIBUTING.md).