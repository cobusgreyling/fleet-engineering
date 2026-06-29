# Starters

| Starter | Fleet level | Use when |
|---------|-------------|----------|
| [minimal-fleet](minimal-fleet/) | F1 | First fleet — registry + budget + CI |
| [fleet-plus-loop](fleet-plus-loop/) | F1 + L1 | You already have or want a loop pattern |
| [fleet-mcp-bootstrap](fleet-mcp-bootstrap/) | F2 → F3 | Centralize per-agent credentials + budgets over MCP |

## Quick start

```bash
npx @cobusgreyling/fleet-init ~/my-fleet --pattern team-agent-registry
cd ~/my-fleet
npx @cobusgreyling/fleet-audit . --suggest
```

GitHub template: use **minimal-fleet** as a template repository (see `.github/template.yml`).