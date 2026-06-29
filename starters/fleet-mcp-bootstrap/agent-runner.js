// Demo: a fleet agent waking up as a blank slate.
//
// Instead of reading a hardcoded API key from .env, the agent spawns the Fleet
// Resource Manager (MCP server) as a child process and *requests* an ephemeral,
// role-scoped credential + budget + base prompt over stdio. From there the real
// agent loop would start using only what it was granted.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runAgent(fleetId, role) {
  console.log(`[Agent ${fleetId}] Booting with role: ${role}...`);

  // Point at the server shipped in tools/fleet-mcp.
  const serverPath = path.resolve(__dirname, '../../tools/fleet-mcp/server.js');

  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
    env: process.env,
  });

  const client = new Client(
    { name: 'fleet-agent-client', version: '0.3.0' },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log(`[Agent ${fleetId}] Connected to Fleet Resource MCP Server.`);

  try {
    const result = await client.callTool({
      name: 'get_agent_bootstrap',
      arguments: { fleetId, role },
    });

    const text = result.content[0].text;
    if (result.isError) {
      console.error(`[Agent ${fleetId}] Bootstrap denied: ${text}`);
      process.exitCode = 1;
      return;
    }

    const bootstrap = JSON.parse(text);
    console.log(`[Agent ${fleetId}] Bootstrap OK. Granted:`);
    console.log(`  budgetCap   : ${bootstrap.budgetCap} (daily)`);
    console.log(`  permissions : ${bootstrap.permissions.join(', ')}`);
    console.log(`  token       : ${bootstrap.credentials.apiKey}`);
    console.log(`  expiresAt   : ${bootstrap.credentials.expiresAt}`);

    // ---- From here the real AI loop would start, using ONLY the grant: ----
    // - init the model with bootstrap.credentials.apiKey
    // - use bootstrap.systemPrompt as the base prompt
    // - feed bootstrap.budgetCap into your loop-cost / admission control
    console.log(`\n[Agent ${fleetId}] Starting harness within budget ${bootstrap.budgetCap}.`);
  } catch (error) {
    console.error(`[Agent ${fleetId}] Bootstrap failed:`, error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

const [, , fleetId = 'agent-007', role = 'security-auditor'] = process.argv;
await runAgent(fleetId, role);
