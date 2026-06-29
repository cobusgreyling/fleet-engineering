import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertValidRegistry,
  buildBootstrap,
  mintEphemeralToken,
  auditLine,
} from '../allocate.js';

const registry = {
  roles: {
    'security-auditor': {
      permissions: ['repo:read', 'issue:write'],
      dailyBudgetCap: 50,
      basePrompt: 'You are a strict security auditor.',
    },
  },
};

test('assertValidRegistry: accepts a well-formed registry', () => {
  assert.equal(assertValidRegistry(registry), registry);
});

test('assertValidRegistry: rejects a role missing a budget cap', () => {
  assert.throws(
    () => assertValidRegistry({ roles: { bad: { permissions: [], basePrompt: 'x' } } }),
    /non-negative numeric dailyBudgetCap/
  );
});

test('buildBootstrap: returns scoped budget, permissions, and prompt', () => {
  const b = buildBootstrap(registry, { fleetId: 'agent-007', role: 'security-auditor' });
  assert.equal(b.fleetId, 'agent-007');
  assert.equal(b.budgetCap, 50);
  assert.deepEqual(b.permissions, ['repo:read', 'issue:write']);
  assert.equal(b.systemPrompt, 'You are a strict security auditor.');
});

test('buildBootstrap: mints an ephemeral, role-tagged, expiring credential', () => {
  const b = buildBootstrap(registry, { fleetId: 'agent-007', role: 'security-auditor' });
  assert.match(b.credentials.apiKey, /^sk-ephemeral-security-auditor-[0-9a-f]+$/);
  assert.ok(new Date(b.credentials.expiresAt) > new Date(b.credentials.issuedAt));
});

test('buildBootstrap: unknown role fails closed with the list of known roles', () => {
  assert.throws(
    () => buildBootstrap(registry, { fleetId: 'a', role: 'ghost' }),
    /Role "ghost" not found.*security-auditor/s
  );
});

test('buildBootstrap: missing arguments are rejected', () => {
  assert.throws(() => buildBootstrap(registry, { fleetId: 'a' }), /required/);
});

test('mintEphemeralToken: two calls never collide', () => {
  const a = mintEphemeralToken('r');
  const b = mintEphemeralToken('r');
  assert.notEqual(a.apiKey, b.apiKey);
});

test('auditLine: includes who/what/authority without leaking the secret', () => {
  const b = buildBootstrap(registry, { fleetId: 'agent-007', role: 'security-auditor' });
  const line = auditLine(b);
  assert.match(line, /fleetId=agent-007/);
  assert.match(line, /role=security-auditor/);
  assert.match(line, /budgetCap=50/);
  assert.ok(!line.includes(b.credentials.apiKey), 'audit line must not contain the token');
});
