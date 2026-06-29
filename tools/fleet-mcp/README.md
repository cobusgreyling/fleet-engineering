# fleet-mcp

Centralized Resource Lookup for a fleet, exposed as a **Model Context Protocol (MCP)** server.

Agents boot as blank slates and call one tool — `get_agent_bootstrap` — to receive
**ephemeral, role-scoped credentials**, a **daily budget cap**, a **permission set**,
and a **base prompt**. No agent stores a long-lived API key or shares a fleet-wide
`.env`. One leaked token maps to exactly one agent, one role, and one expiry.

## Run

```bash
cd tools/fleet-mcp
npm install
npm start          # serves on stdio
```

The server speaks MCP over **stdio**: `stdout` carries protocol frames only, all
logs (including the accountability trail) go to `stderr`. Point any MCP client at
`node tools/fleet-mcp/server.js`, or use the demo client in
[`starters/fleet-mcp-bootstrap`](../../starters/fleet-mcp-bootstrap/).

## Tool: `get_agent_bootstrap`

| Input | Type | Description |
|-------|------|-------------|
| `fleetId` | string | Unique agent instance ID, e.g. `agent-007` |
| `role` | string | Role to provision, must exist in `registry.json` |

Returns `budgetCap`, `permissions`, `systemPrompt`, and `credentials`
(`apiKey`, `issuedAt`, `expiresAt`, `ttlSeconds`). Unknown roles **fail closed**.

## Registry

Roles live in [`registry.json`](registry.json) (override path with
`FLEET_MCP_REGISTRY`):

```json
{
  "roles": {
    "security-auditor": {
      "permissions": ["repo:read", "issue:write"],
      "dailyBudgetCap": 50,
      "basePrompt": "You are a strict security auditor."
    }
  }
}
```

## Production note

`mintEphemeralToken` in [`allocate.js`](allocate.js) is a stand-in. Swap it for a
real secrets backend — HashiCorp Vault, AWS KMS / Secrets Manager, GCP Secret
Manager — to graduate this pattern to **F3 Enterprise Governance**. The allocation
logic is kept transport-free in `allocate.js` so it is unit-tested without the SDK.

## Test

```bash
npm test
```

See the [mcp-resource-lookup pattern](../../patterns/mcp-resource-lookup.md) for the why.
