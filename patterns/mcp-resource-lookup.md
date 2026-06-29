# MCP Resource Lookup

**Goal:** Give every agent its credentials, budget, and permissions at boot from a
single governed source — over the Model Context Protocol — instead of baking secrets
into each agent.

## When to use

- 5+ agents, or any agent running unattended writes
- A leaked key today can't be traced to a single agent ("whose `.env` was it?")
- Finance/security want per-agent caps and revocation, not a shared master key
- You are moving from F2 (shared fleet) toward F3 (enterprise governance)

## The problem it solves

Hardcoding API keys, or sharing one `.env` across a fleet, breaks the
[Accountability Test](../docs/accountability-test.md): *which agent did it, with what
authority?* A static fleet-wide key has no answer — and no kill switch short of
rotating everything.

## The solution

A **Centralized Resource Manager** exposed as an MCP server. Agents boot as blank
slates and call one tool to request what they need:

```
agent (MCP client) ──get_agent_bootstrap{fleetId, role}──▶ Fleet Resource Manager (MCP server)
                   ◀──{ ephemeral token, budgetCap, permissions, basePrompt }──
```

Each grant is **per-agent, per-role, and expiring**. One leaked token = one agent,
one role, one short window. Revocation is changing one registry, not 20 deploys.

## Week one (F2)

Run the manager with a **static registry** and **mock ephemeral tokens** — no real
secrets backend yet. Prove the boot flow and the audit trail first.

## Artifacts

- `tools/fleet-mcp/` — the MCP server (`server.js`) + role registry (`registry.json`)
- `starters/fleet-mcp-bootstrap/` — an agent that requests its own bootstrap
- Accountability trail: one stderr line per grant (fleetId, role, budgetCap, expiry)

Run it:

```bash
cd tools/fleet-mcp && npm install && npm start          # server on stdio
# in another shell:
cd starters/fleet-mcp-bootstrap && npm install && npm run demo
```

## Accountability Test

- **Which**: `fleet-resource-manager` MCP server
- **Authority**: the role's `permissions` + `dailyBudgetCap` from `registry.json`
- **Task**: provision a named `fleetId` for a named `role`
- **Evidence**: stderr grant line with a token that **expires**

## Promote to F3

Replace `mintEphemeralToken` in `tools/fleet-mcp/allocate.js` with a real secrets
backend — HashiCorp Vault, AWS KMS / Secrets Manager, or GCP Secret Manager — and
move the registry behind policy-as-code. The transport (MCP/stdio) and the agent
contract stay the same.

## Human gates

- Adding a new role or raising a `dailyBudgetCap`
- Granting a write/delete permission (e.g. `branch:delete`, `issue:write`)
- Swapping the mock token minter for a production secrets backend

## Pair with

- [Fleet Budget Guard](fleet-budget-guard.md) — the `budgetCap` this hands out feeds
  per-agent admission control
- [Cross-Agent Audit](cross-agent-audit.md) — consumes the per-grant audit trail
