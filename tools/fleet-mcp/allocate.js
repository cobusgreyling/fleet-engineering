// Pure allocation logic for the Fleet Resource Manager.
// No MCP SDK or I/O here so it can be unit-tested in isolation and reused
// by other transports (HTTP, in-process) later. server.js wires this to stdio.

import { randomBytes } from 'node:crypto';

/**
 * Validate a registry object loaded from registry.json.
 * Throws on structural problems so a bad registry fails fast at boot.
 */
export function assertValidRegistry(registry) {
  if (!registry || typeof registry !== 'object' || !registry.roles) {
    throw new Error('Registry must be an object with a "roles" map.');
  }
  for (const [role, cfg] of Object.entries(registry.roles)) {
    if (!Array.isArray(cfg.permissions)) {
      throw new Error(`Role "${role}" is missing a permissions array.`);
    }
    if (!Number.isFinite(cfg.dailyBudgetCap) || cfg.dailyBudgetCap < 0) {
      throw new Error(`Role "${role}" needs a non-negative numeric dailyBudgetCap.`);
    }
    if (typeof cfg.basePrompt !== 'string' || cfg.basePrompt.length === 0) {
      throw new Error(`Role "${role}" needs a non-empty basePrompt.`);
    }
  }
  return registry;
}

/**
 * Mint a short-lived, role-scoped credential.
 * This is a stand-in for a real secrets backend (Vault, AWS KMS, GCP SM).
 * Replace mintEphemeralToken in production — never ship static keys to agents.
 */
export function mintEphemeralToken(role, { now = Date.now, ttlSeconds = 900 } = {}) {
  const issuedAtMs = now();
  const secret = randomBytes(12).toString('hex');
  return {
    apiKey: `sk-ephemeral-${role}-${secret}`,
    issuedAt: new Date(issuedAtMs).toISOString(),
    expiresAt: new Date(issuedAtMs + ttlSeconds * 1000).toISOString(),
    ttlSeconds,
  };
}

/**
 * Build the bootstrap payload an agent needs to wake up:
 * scoped credentials, budget cap, permissions, and base prompt.
 * Throws a descriptive error for unknown roles (the agent stays a blank slate).
 */
export function buildBootstrap(registry, { fleetId, role }, opts = {}) {
  if (!fleetId || !role) {
    throw new Error('Both "fleetId" and "role" are required.');
  }
  const roleConfig = registry.roles[role];
  if (!roleConfig) {
    const known = Object.keys(registry.roles).join(', ') || '(none)';
    throw new Error(`Role "${role}" not found in Fleet Registry. Known roles: ${known}.`);
  }

  const credentials = mintEphemeralToken(role, opts);

  return {
    fleetId,
    role,
    budgetCap: roleConfig.dailyBudgetCap,
    permissions: roleConfig.permissions,
    systemPrompt: roleConfig.basePrompt,
    credentials,
  };
}

/**
 * One-line accountability record for the audit trail (who/what/authority/when).
 * Written to stderr by the server so it never pollutes the stdout data stream.
 */
export function auditLine(bootstrap) {
  return [
    `fleetId=${bootstrap.fleetId}`,
    `role=${bootstrap.role}`,
    `budgetCap=${bootstrap.budgetCap}`,
    `permissions=[${bootstrap.permissions.join(',')}]`,
    `expiresAt=${bootstrap.credentials.expiresAt}`,
  ].join(' ');
}
