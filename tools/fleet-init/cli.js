#!/usr/bin/env node
import { initFleet } from './init.js';

const args = process.argv.slice(2);
const help = args.includes('--help') || args.includes('-h');

let pattern = 'team-agent-registry';
let withLoop = null;
let tool = 'grok';
let target = '.';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--pattern' && args[i + 1]) {
    pattern = args[++i];
    continue;
  }
  if (arg === '--with-loop' && args[i + 1]) {
    withLoop = args[++i];
    continue;
  }
  if (arg === '--tool' && args[i + 1]) {
    tool = args[++i];
    continue;
  }
  if (arg === '--help' || arg === '-h') continue;
  if (!arg.startsWith('-') && target === '.') {
    target = arg;
  }
}

if (help) {
  console.log(`fleet-init — Scaffold fleet engineering artifacts (v0.3)

Usage:
  fleet-init [path] --pattern <id> [--with-loop <loop>] [--tool grok|claude-code|codex]

Patterns:
  team-agent-registry (default)
  shared-inbox-hitl
  hierarchical-delegation
  agent-clone-fork
  fleet-budget-guard
  cross-agent-audit

Loops (--with-loop):
  daily-triage, pr-babysitter, issue-triage, changelog-drafter,
  dependency-sweeper, post-merge-cleanup

Examples:
  fleet-init ~/my-fleet --pattern team-agent-registry
  fleet-init . --pattern team-agent-registry --with-loop daily-triage --tool grok

Install: npx @cobusgreyling/fleet-init [path] --pattern <id>
`);
  process.exit(0);
}

try {
  const result = await initFleet(target, { pattern, withLoop, tool });
  console.log(`Fleet scaffold → ${result.dest}`);
  console.log(`Pattern: ${result.pattern}`);
  if (result.loopPattern) console.log(`Loop: ${result.loopPattern} (${result.loopTool})`);
  console.log('Created:');
  for (const f of result.created) console.log(`  ✓ ${f}`);
  console.log(`\nNext: ${result.next}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}