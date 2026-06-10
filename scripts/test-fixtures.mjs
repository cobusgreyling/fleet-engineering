#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditFleet } from '../tools/fleet-audit/auditor.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const cases = [
  { dir: 'tests/fixtures/f0-empty', maxScore: 25, level: 'F0' },
  { dir: 'tests/fixtures/f1-partial', minScore: 20, maxScore: 55 },
  { dir: 'starters/minimal-fleet', minScore: 55 },
];

let failed = 0;

for (const c of cases) {
  const target = path.join(root, c.dir);
  const result = await auditFleet(target);
  if (c.maxScore != null && result.score > c.maxScore) {
    console.error(`FAIL ${c.dir}: score ${result.score} > max ${c.maxScore}`);
    failed++;
    continue;
  }
  if (c.minScore != null && result.score < c.minScore) {
    console.error(`FAIL ${c.dir}: score ${result.score} < min ${c.minScore}`);
    failed++;
    continue;
  }
  if (c.level && result.level !== c.level) {
    console.error(`FAIL ${c.dir}: level ${result.level} !== ${c.level}`);
    failed++;
    continue;
  }
  console.log(`OK ${c.dir}: score=${result.score} level=${result.level}`);
}

if (failed) process.exit(1);