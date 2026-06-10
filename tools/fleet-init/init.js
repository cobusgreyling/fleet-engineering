import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function copyTemplate(srcRoot, destRoot, srcRel, destRel) {
  await ensureDir(path.dirname(path.join(destRoot, destRel)));
  await copyFile(path.join(srcRoot, srcRel), path.join(destRoot, destRel));
}

export async function initFleet(target, options = {}) {
  const dest = path.resolve(target);
  const src = options.srcRoot || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const pattern = options.pattern || 'team-agent-registry';
  const date = new Date().toISOString().slice(0, 10);

  await ensureDir(dest);

  const created = [];

  const copies = [
    ['starters/minimal-fleet/FLEET.md', 'FLEET.md'],
    ['templates/FLEET-STATE.md', 'FLEET-STATE.md'],
    ['templates/fleet-budget.md', 'fleet-budget.md'],
    ['templates/permissions-model.yaml', 'permissions-model.yaml'],
    ['templates/AGENT-MANIFEST.yaml', 'agents/manifests/example-agent.yaml'],
  ];

  for (const [from, to] of copies) {
    const destPath = path.join(dest, to);
    try {
      await copyTemplate(src, dest, from, to);
      if (to.endsWith('.md')) {
        let content = await readFile(destPath, 'utf8');
        content = content.replace(/\{\{TEAM_NAME\}\}/g, 'your-team').replace(/\{\{DATE\}\}/g, date);
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
    owner: your-team
    status: active
`;
  await ensureDir(path.join(dest, 'agents/manifests'));
  await writeFile(path.join(dest, 'agents/registry.yaml'), registry);
  created.push('agents/registry.yaml');

  return { dest, pattern, created };
}