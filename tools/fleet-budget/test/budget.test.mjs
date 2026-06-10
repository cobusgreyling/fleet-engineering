import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { rollupFleetBudget } from '../budget.js';

test('rollupFleetBudget: sums manifest caps', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-budget-'));
  await mkdir(path.join(root, 'agents/manifests'), { recursive: true });
  await writeFile(path.join(root, 'fleet-budget.md'), '# Budget\n| Monthly | 10_000_000 |\n');
  await writeFile(path.join(root, 'agents/manifests/a.yaml'), `id: agent-a\nowner: team\nbudget_daily_tokens: 1000\n`);
  await writeFile(path.join(root, 'agents/manifests/b.yaml'), `id: agent-b\nowner: team\nbudget_daily_tokens: 2000\n`);

  const result = await rollupFleetBudget(root);
  assert.equal(result.agentCount, 2);
  assert.equal(result.dailyTotal, 3000);
  assert.equal(result.monthlyEstimate, 90000);

  await rm(root, { recursive: true, force: true });
});

test('rollupFleetBudget: warns when monthly estimate exceeds team cap', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fleet-budget-'));
  await mkdir(path.join(root, 'agents/manifests'), { recursive: true });
  await writeFile(path.join(root, 'fleet-budget.md'), '## Team totals\n| Monthly | 1_000 |\n');
  await writeFile(path.join(root, 'agents/manifests/a.yaml'), `id: big\nowner: team\nbudget_daily_tokens: 100\n`);

  const result = await rollupFleetBudget(root);
  assert.equal(result.overTeamCap, true);
  assert.ok(result.warnings.some((w) => w.includes('exceeds team monthly cap')));

  await rm(root, { recursive: true, force: true });
});