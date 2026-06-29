#!/usr/bin/env node
// Fleet Resource Manager — a Model Context Protocol (MCP) server.
//
// Agents boot up as blank slates and call the `get_agent_bootstrap` tool to
// receive role-scoped, ephemeral credentials + a daily budget cap + a base
// prompt. No agent ever stores a long-lived API key or shares a fleet-wide
// .env file — that is the accountability win (one leaked token maps to one
// agent + one role + one expiry).
//
// Transport is stdio: the safest channel between co-located local processes.
// stdout carries MCP protocol frames only; all logging goes to stderr.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertValidRegistry, buildBootstrap, auditLine } from './allocate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the registry next to this file (override with FLEET_MCP_REGISTRY).
const registryPath = process.env.FLEET_MCP_REGISTRY
  ? path.resolve(process.env.FLEET_MCP_REGISTRY)
  : path.join(__dirname, 'registry.json');

const registry = assertValidRegistry(
  JSON.parse(readFileSync(registryPath, 'utf8'))
);

const server = new Server(
  { name: 'fleet-resource-manager', version: '0.3.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_agent_bootstrap',
      description:
        'Fetch ephemeral credentials, daily budget cap, permissions, and base prompt for a fleet agent based on its role.',
      inputSchema: {
        type: 'object',
        properties: {
          fleetId: {
            type: 'string',
            description: 'Unique ID of the agent instance (e.g. agent-007).',
          },
          role: {
            type: 'string',
            description: 'Role to provision (e.g. security-auditor).',
          },
        },
        required: ['fleetId', 'role'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'get_agent_bootstrap') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const { fleetId, role } = request.params.arguments ?? {};
  try {
    const bootstrap = buildBootstrap(registry, { fleetId, role });
    // Accountability trail → stderr, never stdout.
    console.error(`[fleet-mcp] granted ${auditLine(bootstrap)}`);
    return {
      content: [{ type: 'text', text: JSON.stringify(bootstrap, null, 2) }],
    };
  } catch (err) {
    console.error(`[fleet-mcp] denied fleetId=${fleetId} role=${role}: ${err.message}`);
    return {
      isError: true,
      content: [{ type: 'text', text: err.message }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[fleet-mcp] Fleet Resource Manager on stdio (registry: ${registryPath})`);
