#!/usr/bin/env node
import { auditFleet, formatHuman } from './auditor.js';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('-')) || '.';
const suggest = args.includes('--suggest');
const json = args.includes('--json');
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(`fleet-audit — Fleet Readiness Score CLI (v0.1)

Usage:
  fleet-audit [path] [options]

Options:
  --json      JSON output
  --suggest   Show scaffold commands
  --help      This help

Levels: F0 (ad-hoc) → F1 (cataloged) → F2 (shared) → F3 (enterprise)
`);
  process.exit(0);
}

const result = await auditFleet(target);
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(formatHuman(result));

if (suggest) {
  console.log('\n=== Suggested actions ===');
  console.log('  node tools/fleet-init/dist/cli.js . --pattern team-agent-registry');
  console.log('  cp templates/fleet-budget.md fleet-budget.md');
  console.log('  cp templates/permissions-model.yaml permissions-model.yaml');
  console.log('  See docs/fleet-design-checklist.md');
}

if (result.score < 40) process.exitCode = 2;