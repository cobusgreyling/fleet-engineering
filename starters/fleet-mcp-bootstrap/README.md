# fleet-mcp-bootstrap (starter)

A minimal fleet agent that **asks for** its credentials instead of being born with
them. It spawns the [Fleet Resource Manager](../../tools/fleet-mcp/) (an MCP server)
and calls `get_agent_bootstrap` to receive an ephemeral, role-scoped token, a daily
budget cap, a permission set, and a base prompt — over stdio.

Fleet level: **F2 → F3** (centralized credential + budget governance).

## Run

```bash
# 1. install the server's deps once
cd tools/fleet-mcp && npm install && cd -

# 2. install + run the agent
cd starters/fleet-mcp-bootstrap
npm install
npm run demo
```

Expected: the agent connects, prints its grant (budget, permissions, an
`sk-ephemeral-...` token with an expiry), then "starts its harness". Try a role
that does not exist to see it **fail closed**:

```bash
node agent-runner.js agent-999 ghost-role
```

## Why this matters

Hardcoding API keys or sharing one `.env` across 20 agents breaks the
[Accountability Test](../../docs/accountability-test.md): if a key leaks, you cannot
tell *which* agent leaked it. Here every grant is per-agent, per-role, and expiring.

Full rationale: [patterns/mcp-resource-lookup.md](../../patterns/mcp-resource-lookup.md).
