import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { validateFleetAgents, detectLoopAlignment } from './validate.js';

const REGISTRY_FILES = ['agents/registry.yaml', 'patterns/registry.yaml'];

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

async function countManifests(root) {
  const dir = path.join(root, 'agents/manifests');
  if (!(await exists(dir))) return 0;
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && /\.ya?ml$/i.test(e.name)).length;
}

export async function auditFleet(target) {
  const root = path.resolve(target);
  const fleetMd = await readSafe(path.join(root, 'FLEET.md'));
  const fleetState = await readSafe(path.join(root, 'FLEET-STATE.md'));
  const budget = await readSafe(path.join(root, 'fleet-budget.md'));
  const loopMd = await readSafe(path.join(root, 'LOOP.md'));
  const permissions = await readSafe(path.join(root, 'templates/permissions-model.yaml'))
    + await readSafe(path.join(root, 'permissions-model.yaml'));
  const agentsMd = await readSafe(path.join(root, 'AGENTS.md'));

  const registryPresent = (
    await Promise.all(REGISTRY_FILES.map((f) => exists(path.join(root, f))))
  ).some(Boolean);

  const manifestCount = await countManifests(root);
  const hasTemplateManifest = await exists(path.join(root, 'templates/AGENT-MANIFEST.yaml'));
  const validation = await validateFleetAgents(root);
  const loopIssues = detectLoopAlignment(loopMd, validation.loopsByAgent);

  const signals = {
    fleetMd: fleetMd.length > 100,
    fleetState: fleetState.length > 50,
    registry: registryPresent,
    manifests: manifestCount > 0 || hasTemplateManifest,
    manifestCount,
    hasTemplateManifest,
    permissions: /clone|run|edit/i.test(permissions) && validation.permissionsOk,
    budget: budget.length > 50,
    killSwitch: /kill|pause|FLEET_PAUSE/i.test(fleetMd),
    accountability: /accountability|which agent/i.test(fleetMd + fleetState + agentsMd),
    patterns: await exists(path.join(root, 'patterns/registry.yaml')),
    auditWorkflow: await exists(path.join(root, '.github/workflows/fleet-audit.yml'))
      || await exists(path.join(root, '.github/workflows/audit.yml')),
    inboxRunbook: await exists(path.join(root, 'inbox-runbook.md')),
    auditRunbook: await exists(path.join(root, 'audit-runbook.md')),
    handoffSchema: await exists(path.join(root, 'agents/handoff-schema.json')),
    schemaValid: validation.errors.length === 0 && validation.registryValid,
    noShadowAgents: !validation.warnings.some((w) => w.startsWith('Shadow agent:')),
    loopAligned: loopIssues.length === 0,
  };

  let score = 10;
  const findings = [];
  const recommendations = [];

  if (signals.fleetMd) { score += 15; findings.push({ level: 'ok', message: 'FLEET.md present' }); }
  else findings.push({ level: 'fail', message: 'Missing FLEET.md — fleet posture undefined' });

  if (signals.fleetState) { score += 12; findings.push({ level: 'ok', message: 'FLEET-STATE.md present' }); }
  else findings.push({ level: 'warn', message: 'Missing FLEET-STATE.md — no human catalog' });

  if (signals.registry) { score += 12; findings.push({ level: 'ok', message: 'Registry file found' }); }
  else findings.push({ level: 'warn', message: 'No agents/registry.yaml or patterns/registry.yaml' });

  if (signals.manifests) {
    score += manifestCount > 0 ? 14 : 8;
    findings.push({
      level: 'ok',
      message: manifestCount > 0
        ? `${manifestCount} agent manifest(s)`
        : 'AGENT-MANIFEST template present',
    });
  } else findings.push({ level: 'warn', message: 'No agent manifests' });

  if (signals.permissions) { score += 10; findings.push({ level: 'ok', message: 'Permissions model documented' }); }
  else findings.push({ level: 'warn', message: 'Permissions (clone/run/edit) not documented on active agents' });

  if (signals.budget) { score += 10; findings.push({ level: 'ok', message: 'Fleet budget file present' }); }
  else findings.push({ level: 'warn', message: 'Missing fleet-budget.md' });

  if (signals.killSwitch) { score += 8; findings.push({ level: 'ok', message: 'Kill switch referenced in FLEET.md' }); }
  else findings.push({ level: 'warn', message: 'No kill switch documented' });

  if (signals.accountability) { score += 10; findings.push({ level: 'ok', message: 'Accountability test referenced' }); }
  else findings.push({ level: 'warn', message: 'Accountability test not referenced' });

  if (signals.patterns) { score += 6; findings.push({ level: 'ok', message: 'Fleet patterns registry present' }); }
  if (signals.auditWorkflow) { score += 5; findings.push({ level: 'ok', message: 'fleet-audit workflow (dogfood)' }); }

  if (validation.registryValid) {
    findings.push({ level: 'ok', message: 'Registry schema valid' });
  }
  if (validation.errors.length) {
    score = Math.max(10, score - validation.errors.length * 5);
    for (const err of validation.errors) findings.push({ level: 'fail', message: `Schema: ${err}` });
  }
  if (validation.warnings.some((w) => w.startsWith('Shadow agent:'))) {
    score = Math.max(10, score - 8);
    for (const w of validation.warnings.filter((x) => x.startsWith('Shadow agent:'))) {
      findings.push({ level: 'fail', message: w });
      recommendations.push(`Register shadow agent in agents/registry.yaml — ${w}`);
    }
  }
  for (const w of validation.warnings.filter((x) => !x.startsWith('Shadow agent:'))) {
    findings.push({ level: 'warn', message: w });
  }
  if (loopIssues.length) {
    score = Math.max(10, score - loopIssues.length * 3);
    for (const issue of loopIssues) {
      findings.push({ level: 'warn', message: issue });
      recommendations.push('Align LOOP.md with manifest loops: — see starters/fleet-plus-loop/');
    }
  } else if (Object.keys(validation.loopsByAgent).length && loopMd.length > 50) {
    findings.push({ level: 'ok', message: 'Loop patterns aligned with manifests' });
    score += 3;
  }

  let level = 'F0';
  let assessment = 'Ad-hoc population — start with Team Agent Registry';
  const f2Ready = score >= 65 && (signals.inboxRunbook || signals.auditRunbook);
  if (f2Ready) { level = 'F2'; assessment = 'Shared fleet posture — budgets and audit in place'; }
  else if (score >= 40) { level = 'F1'; assessment = 'Cataloged — ready for inbox and budget enforcement'; }
  else if (score >= 25) { level = 'F0+'; assessment = 'Early — add FLEET.md and registry'; }

  if (level === 'F2' && !signals.inboxRunbook) {
    recommendations.push('npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl');
  }
  if (level === 'F2' && !signals.auditRunbook) {
    recommendations.push('npx @cobusgreyling/fleet-init . --pattern cross-agent-audit');
  }
  if (level === 'F2' && !signals.handoffSchema && Object.values(validation.loopsByAgent).flat().length > 1) {
    recommendations.push('npx @cobusgreyling/fleet-init . --pattern hierarchical-delegation');
  }

  if (!signals.fleetMd) {
    recommendations.push('npx @cobusgreyling/fleet-init . --pattern team-agent-registry');
  }
  if (!signals.fleetState) recommendations.push('cp templates/FLEET-STATE.md FLEET-STATE.md');
  if (!signals.budget) recommendations.push('cp templates/fleet-budget.md fleet-budget.md');
  if (manifestCount === 0 && !hasTemplateManifest) {
    recommendations.push('npx @cobusgreyling/fleet-init . --pattern team-agent-registry');
  }
  if (!signals.permissions) recommendations.push('cp templates/permissions-model.yaml permissions-model.yaml');
  if (!signals.registry) recommendations.push('Add agents/registry.yaml — see templates/AGENT-MANIFEST.yaml');
  if (!signals.killSwitch) recommendations.push('Document kill switch in FLEET.md (FLEET_PAUSE_ALL)');
  if (!signals.accountability) recommendations.push('See docs/accountability-test.md');
  if (score < 40) recommendations.push('See docs/fleet-design-checklist.md');

  return {
    target: root,
    score: Math.min(score, 100),
    level,
    assessment,
    signals,
    findings,
    recommendations: [...new Set(recommendations)],
    validation: {
      errors: validation.errors,
      warnings: validation.warnings,
      loopIssues,
    },
  };
}

export function formatHuman(result) {
  const lines = [
    `Fleet Readiness — ${result.target}`,
    `Score: ${result.score}/100  Level: ${result.level}`,
    `Assessment: ${result.assessment}`,
    '',
    'Findings:',
  ];
  for (const f of result.findings) {
    const icon = f.level === 'ok' ? '✓' : f.level === 'warn' ? '!' : '✗';
    lines.push(`  ${icon} ${f.message}`);
  }
  if (result.recommendations.length) {
    lines.push('', 'Recommendations:');
    for (const r of result.recommendations) lines.push(`  → ${r}`);
  }
  return lines.join('\n');
}

export function formatSuggestions(result) {
  if (!result.recommendations.length) {
    return ['No scaffold actions needed — review docs/fleet-design-checklist.md for F2→F3'];
  }
  return result.recommendations;
}