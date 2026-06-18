import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { auditFleet, formatSuggestions } from '../auditor.js';

async function scaffoldF1(root) {
  await writeFile(path.join(root, 'FLEET.md'), '# FLEET\nKill switch: FLEET_PAUSE_ALL\nAccountability test required.\n'.repeat(5));
  await writeFile(path.join(root, 'FLEET-STATE.md'), '# State\n| id | owner |\n| a | team |\n'.repeat(3));
  await writeFile(path.join(root, 'fleet-budget.md'), '# Budget\n| Monthly | 1_000_000 |\n'.repeat(3));
  await writeFile(path.join(root, 'permissions-model.yaml'), 'levels:\n  clone: {}\n  run: {}\n  edit: {}\n');
  await mkdir(path.join(root, 'agents/manifests'), { recursive: true });
  await writeFile(path.join(root, 'agents/manifests/a.yaml'), 'id: a\nowner: team\nversion: 1.0.0\nidentity: claw\nautonomy_tier: F1\nstatus: active\n');
  await writeFile(path.join(root, 'agents/registry.yaml'), 'agents:\n  - id: a\n    owner: team\n    status: active\n    manifest: agents/manifests/a.yaml\n');
}

test('auditFleet: empty dir is F0 with low score', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-audit-'));
  const result = await auditFleet(root);
  assert.ok(result.score < 40);
  assert.equal(result.level, 'F0');
  await rm(root, { recursive: true, force: true });
});

test('auditFleet: F1 workspace reaches F1+', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-audit-'));
  await scaffoldF1(root);
  const result = await auditFleet(root);
  assert.ok(result.score >= 40);
  assert.ok(['F1', 'F2'].includes(result.level));
  await rm(root, { recursive: true, force: true });
});

test('formatSuggestions: healthy repo has no init spam', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-audit-'));
  await scaffoldF1(root);
  const result = await auditFleet(root);
  const suggestions = formatSuggestions(result);
  assert.ok(!suggestions.some((s) => s.includes('fleet-init')));
  await rm(root, { recursive: true, force: true });
});

test('auditFleet: shadow agent lowers score', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-audit-'));
  await scaffoldF1(root);
  await writeFile(path.join(root, 'agents/manifests/shadow.yaml'), `id: shadow-bot
owner: unknown
version: 1.0.0
identity: claw
autonomy_tier: F1
status: active
permissions:
  workspace_default: run
`);
  const result = await auditFleet(root);
  assert.ok(result.findings.some((f) => f.message.includes('Shadow agent')));
  await rm(root, { recursive: true, force: true });
});

test('auditFleet: reference-style repo with template manifest scores high', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-audit-'));
  await writeFile(path.join(root, 'FLEET.md'), '# FLEET\nKill FLEET_PAUSE_ALL. Accountability which agent.\n'.repeat(8));
  await writeFile(path.join(root, 'FLEET-STATE.md'), '# State\n'.repeat(10));
  await writeFile(path.join(root, 'fleet-budget.md'), '# Budget\n'.repeat(10));
  await mkdir(path.join(root, 'templates'), { recursive: true });
  await writeFile(path.join(root, 'templates/permissions-model.yaml'), 'clone run edit\n');
  await writeFile(path.join(root, 'templates/AGENT-MANIFEST.yaml'), 'id: template\n');
  await mkdir(path.join(root, 'patterns'), { recursive: true });
  await writeFile(path.join(root, 'patterns/registry.yaml'), 'patterns: []\n');
  await mkdir(path.join(root, '.github/workflows'), { recursive: true });
  await writeFile(path.join(root, '.github/workflows/audit.yml'), 'name: audit\n');

  const result = await auditFleet(root);
  assert.ok(result.score >= 65);
  const suggestions = formatSuggestions(result);
  assert.ok(!suggestions.some((s) => s.includes('fleet-init')));
  await rm(root, { recursive: true, force: true });
});