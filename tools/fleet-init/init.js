import { mkdir, copyFile, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const VALID_PATTERNS = new Set([
  'team-agent-registry',
  'shared-inbox-hitl',
  'hierarchical-delegation',
  'agent-clone-fork',
  'fleet-budget-guard',
  'cross-agent-audit',
]);

const VALID_LOOPS = new Set([
  'daily-triage',
  'pr-babysitter',
  'issue-triage',
  'changelog-drafter',
  'dependency-sweeper',
  'post-merge-cleanup',
]);

const PATTERN_EXTRAS = {
  'shared-inbox-hitl': [
    ['templates/inbox-runbook.md', 'inbox-runbook.md'],
  ],
  'hierarchical-delegation': [
    ['templates/handoff-schema.json', 'agents/handoff-schema.json'],
  ],
  'agent-clone-fork': [
    ['templates/fork-policy.md', 'fork-policy.md'],
  ],
  'cross-agent-audit': [
    ['templates/audit-runbook.md', 'audit-runbook.md'],
  ],
};

const PATTERN_FLEET_FLAGS = {
  'team-agent-registry': ['Team Agent Registry'],
  'shared-inbox-hitl': ['Team Agent Registry', 'Shared Inbox HITL'],
  'fleet-budget-guard': ['Team Agent Registry', 'Fleet Budget Guard'],
  'hierarchical-delegation': ['Team Agent Registry', 'Hierarchical Delegation'],
  'agent-clone-fork': ['Team Agent Registry', 'Agent Clone & Fork'],
  'cross-agent-audit': ['Team Agent Registry', 'Cross-Agent Audit'],
};

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function copyTemplate(srcRoot, destRoot, srcRel, destRel) {
  await ensureDir(path.dirname(path.join(destRoot, destRel)));
  await copyFile(path.join(srcRoot, srcRel), path.join(destRoot, destRel));
}

function applyPlaceholders(content, vars) {
  let out = content;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return out;
}

function patchFleetMd(content, pattern) {
  const flags = PATTERN_FLEET_FLAGS[pattern] || ['Team Agent Registry'];
  let out = content;
  for (const flag of flags) {
    out = out.replace(`- [ ] ${flag}`, `- [x] ${flag}`);
  }
  return out;
}

function patchManifestLoops(content, loopPattern) {
  if (!loopPattern) return content;
  if (/^loops:/m.test(content)) {
    return content.replace(/^loops:\s*\n(?:\s+-\s+\S+\n?)+/m, `loops:\n  - ${loopPattern}\n`);
  }
  return content.replace(/^status:/m, `loops:\n  - ${loopPattern}\n\nstatus:`);
}

async function resolveSrcRoot(options) {
  if (options.srcRoot) return options.srcRoot;
  const pkgDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
  const bundledFleet = path.join(pkgDir, 'starters/minimal-fleet/FLEET.md');
  if (await exists(bundledFleet)) return pkgDir;
  return path.resolve(pkgDir, '../..');
}

export async function initFleet(target, options = {}) {
  const dest = path.resolve(target);
  const src = await resolveSrcRoot(options);
  const pattern = options.pattern || 'team-agent-registry';
  const loopPattern = options.withLoop || null;
  const loopTool = options.tool || 'grok';
  const date = new Date().toISOString().slice(0, 10);
  const team = options.team || 'your-team';

  if (!VALID_PATTERNS.has(pattern)) {
    throw new Error(`Unknown pattern: ${pattern}. Valid: ${[...VALID_PATTERNS].join(', ')}`);
  }
  if (loopPattern && !VALID_LOOPS.has(loopPattern)) {
    throw new Error(`Unknown loop: ${loopPattern}. Valid: ${[...VALID_LOOPS].join(', ')}`);
  }

  await ensureDir(dest);
  const created = [];
  const placeholders = {
    TEAM_NAME: team,
    DATE: date,
    PATTERN: pattern,
    LOOP_PATTERN: loopPattern || 'daily-triage',
    LOOP_TOOL: loopTool,
  };

  const copies = [
    ['starters/minimal-fleet/FLEET.md', 'FLEET.md'],
    ['templates/FLEET-STATE.md', 'FLEET-STATE.md'],
    ['templates/fleet-budget.md', 'fleet-budget.md'],
    ['templates/permissions-model.yaml', 'permissions-model.yaml'],
    ['templates/AGENT-MANIFEST.yaml', 'agents/manifests/example-agent.yaml'],
    ['starters/minimal-fleet/.github/workflows/fleet-audit.yml', '.github/workflows/fleet-audit.yml'],
    ...(PATTERN_EXTRAS[pattern] || []),
  ];

  if (loopPattern) {
    copies.push(['templates/LOOP.md', 'LOOP.md']);
  }

  for (const [from, to] of copies) {
    const destPath = path.join(dest, to);
    try {
      await copyTemplate(src, dest, from, to);
      if (/\.(md|ya?ml)$/i.test(to)) {
        let content = await readFile(destPath, 'utf8');
        content = applyPlaceholders(content, placeholders);
        if (to === 'FLEET.md') content = patchFleetMd(content, pattern);
        if (to === 'agents/manifests/example-agent.yaml' && loopPattern) {
          content = patchManifestLoops(content, loopPattern);
        }
        await writeFile(destPath, content);
      }
      created.push(to);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to scaffold ${to} from ${from}: ${msg}`);
    }
  }

  const registry = `# Agent registry — ${date}
# Pattern: ${pattern}${loopPattern ? ` + loop: ${loopPattern}` : ''}

agents:
  - id: example-agent
    manifest: agents/manifests/example-agent.yaml
    owner: ${team}
    status: active
    pattern: ${pattern}
`;
  await ensureDir(path.join(dest, 'agents/manifests'));
  await writeFile(path.join(dest, 'agents/registry.yaml'), registry);
  created.push('agents/registry.yaml');

  const next = loopPattern
    ? 'npx @cobusgreyling/loop-init . --pattern ' + loopPattern + ' --tool ' + loopTool
    : 'npx @cobusgreyling/fleet-audit <path> --suggest';

  return { dest, pattern, loopPattern, loopTool, created, next };
}