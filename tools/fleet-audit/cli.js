#!/usr/bin/env node
import { auditFleet, formatHuman, formatSuggestions } from './auditor.js';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('-')) || '.';
const suggest = args.includes('--suggest');
const json = args.includes('--json');
const help = args.includes('--help') || args.includes('-h');
const minScoreArg = args.find((a) => a.startsWith('--min-score='));
const minScore = minScoreArg ? Number(minScoreArg.split('=')[1]) : null;

if (help) {
  console.log(`fleet-audit — Fleet Readiness Score CLI (v0.3)

Usage:
  fleet-audit [path] [options]

Options:
  --json              JSON output
  --suggest           Show scaffold commands for gaps only
  --min-score=N       Exit 1 if score < N (CI gate)
  --help              This help

Levels: F0 (ad-hoc) → F1 (cataloged) → F2 (shared) → F3 (enterprise)

Install: npx @cobusgreyling/fleet-audit [path]
`);
  process.exit(0);
}

const result = await auditFleet(target);
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(formatHuman(result));

if (suggest) {
  console.log('\n=== Suggested actions ===');
  for (const line of formatSuggestions(result)) console.log(`  ${line}`);
}

if (minScore != null && Number.isFinite(minScore) && result.score < minScore) {
  process.exitCode = 1;
} else if (result.score < 40) {
  process.exitCode = 2;
}