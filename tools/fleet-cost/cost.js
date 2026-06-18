import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const LOG_FILES = ['fleet-run-log.jsonl', 'fleet-run-log.json', 'logs/fleet-run-log.jsonl'];
const LOOP_COST_DEFAULTS = {
  'daily-triage': { noop: 5000, report: 50000, action: 150000 },
  'pr-babysitter': { noop: 3000, report: 80000, action: 250000 },
  'issue-triage': { noop: 4000, report: 60000, action: 180000 },
};

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readSafe(p) {
  try {
    return await readFile(p, 'utf8');
  } catch {
    return '';
  }
}

function parseYamlNumber(value) {
  if (value == null) return null;
  const n = Number(String(value).replace(/_/g, ''));
  return Number.isFinite(n) ? n : null;
}

function extractManifest(text, filename) {
  const idMatch = text.match(/^id:\s*(\S+)/m);
  const capMatch = text.match(/^budget_daily_tokens:\s*(\S+)/m);
  const ownerMatch = text.match(/^owner:\s*(\S+)/m);
  const loops = [...text.matchAll(/^\s+-\s+(\S+)/gm)].map((m) => m[1]);
  const loopSection = text.match(/^loops:\s*\n/m);
  const loopList = loopSection ? loops : [];

  return {
    id: idMatch?.[1] || path.basename(filename, path.extname(filename)),
    dailyCap: parseYamlNumber(capMatch?.[1]),
    owner: ownerMatch?.[1] || 'unknown',
    loops: loopList,
  };
}

async function loadRunLog(root) {
  for (const rel of LOG_FILES) {
    const filePath = path.join(root, rel);
    if (!(await exists(filePath))) continue;
    const text = await readSafe(filePath);
    if (!text.trim()) continue;
    if (rel.endsWith('.jsonl')) {
      return text.trim().split('\n').map((line) => JSON.parse(line));
    }
    return JSON.parse(text);
  }
  return [];
}

function estimateFromLoops(loops) {
  let estimate = 0;
  for (const loop of loops) {
    const costs = LOOP_COST_DEFAULTS[loop];
    if (costs) estimate += costs.report;
    else estimate += 40000;
  }
  return estimate;
}

export async function analyzeFleetCost(target) {
  const root = path.resolve(target);
  const manifestDir = path.join(root, 'agents/manifests');
  const agents = [];

  if (await exists(manifestDir)) {
    const entries = await readdir(manifestDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !/\.ya?ml$/i.test(entry.name)) continue;
      const text = await readSafe(path.join(manifestDir, entry.name));
      agents.push(extractManifest(text, entry.name));
    }
  }

  const runs = await loadRunLog(root);
  const usageByAgent = {};
  for (const run of runs) {
    const id = run.agent_id || run.agentId || 'unknown';
    const tokens = Number(run.tokens || run.token_count || 0);
    if (!usageByAgent[id]) usageByAgent[id] = { tokens: 0, runs: 0 };
    usageByAgent[id].tokens += tokens;
    usageByAgent[id].runs += 1;
  }

  const attribution = agents.map((agent) => {
    const usage = usageByAgent[agent.id] || { tokens: 0, runs: 0 };
    const hasLogs = usage.runs > 0;
    const estimated = hasLogs ? usage.tokens : estimateFromLoops(agent.loops);
    const pctOfCap = agent.dailyCap ? Math.round((estimated / agent.dailyCap) * 100) : null;
    const nearCap = pctOfCap != null && pctOfCap >= 80;
    const overCap = pctOfCap != null && pctOfCap >= 100;
    return {
      ...agent,
      actualTokens: usage.tokens,
      runCount: usage.runs,
      estimatedDaily: estimated,
      source: hasLogs ? 'fleet-run-log' : 'loop-estimate',
      pctOfCap,
      nearCap,
      overCap,
    };
  });

  const warnings = [];
  const totalActual = attribution.reduce((s, a) => s + a.estimatedDaily, 0);
  const overCapAgents = attribution.filter((a) => a.overCap);
  const nearCapAgents = attribution.filter((a) => a.nearCap && !a.overCap);

  if (agents.length === 0) warnings.push('No agent manifests — run fleet-init first');
  if (runs.length === 0) {
    warnings.push('No fleet-run-log.jsonl — showing loop-based estimates; append runs for actual attribution');
  }
  for (const a of overCapAgents) {
    warnings.push(`${a.id}: estimated ${a.estimatedDaily.toLocaleString()} tokens exceeds daily cap ${a.dailyCap?.toLocaleString()}`);
  }
  for (const a of nearCapAgents) {
    warnings.push(`${a.id}: ${a.pctOfCap}% of daily cap — review before scaling`);
  }

  return {
    target: root,
    agentCount: agents.length,
    runLogEntries: runs.length,
    totalEstimatedDaily: totalActual,
    attribution,
    warnings,
    hasOverCap: overCapAgents.length > 0,
  };
}

export function formatHuman(result) {
  const lines = [
    `Fleet Cost Attribution — ${result.target}`,
    `Agents: ${result.agentCount}  Run log entries: ${result.runLogEntries}`,
    `Total estimated daily: ${result.totalEstimatedDaily.toLocaleString()} tokens`,
    '',
    'Per-agent:',
  ];
  for (const a of result.attribution) {
    const cap = a.dailyCap != null ? `${a.dailyCap.toLocaleString()}/day` : 'no cap';
    const pct = a.pctOfCap != null ? ` (${a.pctOfCap}% of cap)` : '';
    lines.push(`  ${a.id}: ${a.estimatedDaily.toLocaleString()} tokens  [${a.source}]  cap=${cap}${pct}  runs=${a.runCount}`);
  }
  if (result.warnings.length) {
    lines.push('', 'Warnings:');
    for (const w of result.warnings) lines.push(`  ! ${w}`);
  }
  return lines.join('\n');
}