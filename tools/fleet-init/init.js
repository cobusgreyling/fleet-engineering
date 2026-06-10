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

function applyPlaceholders(content, { team, date, pattern }) {
  return content
    .replace(/\{\{TEAM_NAME\}\}/g, team)
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{PATTERN\}\}/g, pattern);
}

function patchFleetMd(content, pattern) {
  const flags = PATTERN_FLEET_FLAGS[pattern] || ['Team Agent Registry'];
  let out = content;
  for (const flag of flags) {
    out = out.replace(`- [ ] ${flag}`, `- [x] ${flag}`);
  }
  return out;
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
  const date = new Date().toISOString().slice(0, 10);
  const team = options.team || 'your-team';

  if (!VALID_PATTERNS.has(pattern)) {
    throw new Error(`Unknown pattern: ${pattern}. Valid: ${[...VALID_PATTERNS].join(', ')}`);
  }

  await ensureDir(dest);
  const created = [];

  const copies = [
    ['starters/minimal-fleet/FLEET.md', 'FLEET.md'],
    ['templates/FLEET-STATE.md', 'FLEET-STATE.md'],
    ['templates/fleet-budget.md', 'fleet-budget.md'],
    ['templates/permissions-model.yaml', 'permissions-model.yaml'],
    ['templates/AGENT-MANIFEST.yaml', 'agents/manifests/example-agent.yaml'],
    ['starters/minimal-fleet/.github/workflows/fleet-audit.yml', '.github/workflows/fleet-audit.yml'],
    ...(PATTERN_EXTRAS[pattern] || []),
  ];

  for (const [from, to] of copies) {
    const destPath = path.join(dest, to);
    try {
      await copyTemplate(src, dest, from, to);
      if (/\.(md|ya?ml)$/i.test(to)) {
        let content = await readFile(destPath, 'utf8');
        content = applyPlaceholders(content, { team, date, pattern });
        if (to === 'FLEET.md') content = patchFleetMd(content, pattern);
        await writeFile(destPath, content);
      }
      created.push(to);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to scaffold ${to} from ${from}: ${msg}`);
    }
  }

  const registry = `# Agent registry — ${date}
# Pattern: ${pattern}

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

  return { dest, pattern, created };
}