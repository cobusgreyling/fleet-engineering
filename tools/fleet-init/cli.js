#!/usr/bin/env node
import { initFleet } from './init.js';

const args = process.argv.slice(2);
const help = args.includes('--help') || args.includes('-h');

let pattern = 'team-agent-registry';
let target = '.';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--pattern' && args[i + 1]) {
    pattern = args[++i];
    continue;
  }
  if (arg === '--help' || arg === '-h') continue;
  if (!arg.startsWith('-') && target === '.') {
    target = arg;
  }
}

if (help) {
  console.log(`fleet-init — Scaffold fleet engineering artifacts (v0.2)

Usage:
  fleet-init [path] --pattern <id>

Patterns:
  team-agent-registry (default)
  shared-inbox-hitl
  hierarchical-delegation
  agent-clone-fork
  fleet-budget-guard
  cross-agent-audit

Install: npx @cobusgreyling/fleet-init [path] --pattern <id>
`);
  process.exit(0);
}

try {
  const result = await initFleet(target, { pattern });
  console.log(`Fleet scaffold → ${result.dest}`);
  console.log(`Pattern: ${result.pattern}`);
  console.log('Created:');
  for (const f of result.created) console.log(`  ✓ ${f}`);
  console.log('\nNext: npx @cobusgreyling/fleet-audit <path> --suggest');
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}