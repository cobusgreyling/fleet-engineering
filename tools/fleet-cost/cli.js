#!/usr/bin/env node
import { analyzeFleetCost, formatHuman } from './cost.js';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('-')) || '.';
const json = args.includes('--json');
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(`fleet-cost — Attribute token spend per agent (v0.1)

Usage:
  fleet-cost [path] [options]

Reads fleet-run-log.jsonl for actual usage, or estimates from loop patterns.

Options:
  --json      JSON output
  --help      This help

Log format (JSONL):
  {"agent_id":"weekly-report","tokens":42000,"timestamp":"2026-06-18T10:00:00Z"}

Install: npx @cobusgreyling/fleet-cost [path]
`);
  process.exit(0);
}

const result = await analyzeFleetCost(target);
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(formatHuman(result));

if (result.hasOverCap) process.exitCode = 2;