#!/usr/bin/env node
import { rollupFleetBudget, formatHuman } from './budget.js';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('-')) || '.';
const json = args.includes('--json');
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(`fleet-budget — Roll up per-agent token caps from manifests (v0.1)

Usage:
  fleet-budget [path] [options]

Options:
  --json      JSON output
  --help      This help

Install: npx @cobusgreyling/fleet-budget [path]
`);
  process.exit(0);
}

const result = await rollupFleetBudget(target);
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(formatHuman(result));

if (result.overTeamCap) process.exitCode = 2;