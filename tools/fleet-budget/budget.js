import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

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

function extractBudgetFromManifest(text, filename) {
  const idMatch = text.match(/^id:\s*(\S+)/m);
  const capMatch = text.match(/^budget_daily_tokens:\s*(\S+)/m);
  const ownerMatch = text.match(/^owner:\s*(\S+)/m);
  const loopsMatch = text.match(/^loops:\s*\n(?:\s+-\s+(\S+)\n?)+/m);
  const loop = loopsMatch ? [...text.matchAll(/^\s+-\s+(\S+)/gm)].map((m) => m[1]) : [];

  return {
    id: idMatch?.[1] || path.basename(filename, path.extname(filename)),
    dailyCap: parseYamlNumber(capMatch?.[1]),
    owner: ownerMatch?.[1] || 'unknown',
    loops: loop,
    source: filename,
  };
}

function parseTeamCap(budgetMd) {
  const match = budgetMd.match(/Monthly\s*\|\s*([\d_]+)/);
  return parseYamlNumber(match?.[1]);
}

export async function rollupFleetBudget(target) {
  const root = path.resolve(target);
  const manifestDir = path.join(root, 'agents/manifests');
  const budgetMd = await readSafe(path.join(root, 'fleet-budget.md'));

  const agents = [];
  if (await exists(manifestDir)) {
    const entries = await readdir(manifestDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !/\.ya?ml$/i.test(entry.name)) continue;
      const text = await readSafe(path.join(manifestDir, entry.name));
      agents.push(extractBudgetFromManifest(text, entry.name));
    }
  }

  const withCaps = agents.filter((a) => a.dailyCap != null);
  const dailyTotal = withCaps.reduce((sum, a) => sum + (a.dailyCap || 0), 0);
  const monthlyEstimate = dailyTotal * 30;
  const teamMonthlyCap = parseTeamCap(budgetMd);
  const overTeamCap = teamMonthlyCap != null && monthlyEstimate > teamMonthlyCap;

  const warnings = [];
  if (agents.length === 0) warnings.push('No agent manifests in agents/manifests/');
  if (withCaps.length < agents.length) {
    warnings.push(`${agents.length - withCaps.length} manifest(s) missing budget_daily_tokens`);
  }
  if (overTeamCap) {
    warnings.push(`Sum of daily caps × 30 (${monthlyEstimate}) exceeds team monthly cap (${teamMonthlyCap})`);
  }

  return {
    target: root,
    agentCount: agents.length,
    agents,
    dailyTotal,
    monthlyEstimate,
    teamMonthlyCap,
    overTeamCap,
    warnings,
  };
}

export function formatHuman(result) {
  const lines = [
    `Fleet Budget Rollup — ${result.target}`,
    `Agents: ${result.agentCount}  With daily caps: ${result.agents.filter((a) => a.dailyCap != null).length}`,
    `Daily total (capped agents): ${result.dailyTotal.toLocaleString()} tokens`,
    `Monthly estimate (daily × 30): ${result.monthlyEstimate.toLocaleString()} tokens`,
  ];
  if (result.teamMonthlyCap != null) {
    lines.push(`Team monthly cap: ${result.teamMonthlyCap.toLocaleString()} tokens`);
  }
  if (result.agents.length) {
    lines.push('', 'Per-agent:');
    for (const a of result.agents) {
      const cap = a.dailyCap != null ? a.dailyCap.toLocaleString() : '—';
      lines.push(`  ${a.id}: ${cap}/day  owner=${a.owner}  loops=[${a.loops.join(', ')}]`);
    }
  }
  if (result.warnings.length) {
    lines.push('', 'Warnings:');
    for (const w of result.warnings) lines.push(`  ! ${w}`);
  }
  return lines.join('\n');
}