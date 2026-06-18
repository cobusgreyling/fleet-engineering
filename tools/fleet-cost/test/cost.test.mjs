import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { analyzeFleetCost } from '../cost.js';

async function scaffold(root) {
  await mkdir(path.join(root, 'agents/manifests'), { recursive: true });
  await writeFile(path.join(root, 'agents/manifests/a.yaml'), `id: a
owner: team
version: 1.0.0
identity: claw
autonomy_tier: F1
status: active
budget_daily_tokens: 100000
loops:
  - daily-triage
`);
  await writeFile(path.join(root, 'fleet-run-log.jsonl'), '{"agent_id":"a","tokens":90000}\n');
}

test('analyzeFleetCost: reads run log and flags near cap', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-cost-'));
  await scaffold(root);
  const result = await analyzeFleetCost(root);
  assert.equal(result.agentCount, 1);
  assert.equal(result.attribution[0].actualTokens, 90000);
  assert.equal(result.attribution[0].nearCap, true);
  await rm(root, { recursive: true, force: true });
});

test('analyzeFleetCost: estimates when no log', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-cost-'));
  await scaffold(root);
  await rm(path.join(root, 'fleet-run-log.jsonl'));
  const result = await analyzeFleetCost(root);
  assert.ok(result.attribution[0].estimatedDaily > 0);
  assert.equal(result.attribution[0].source, 'loop-estimate');
  await rm(root, { recursive: true, force: true });
});