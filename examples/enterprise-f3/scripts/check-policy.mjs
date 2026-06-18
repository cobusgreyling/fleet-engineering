#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const manifestDir = path.join(root, 'agents/manifests');
if (!(await exists(manifestDir))) {
  console.log('SKIP — no agents/manifests/');
  process.exit(0);
}

const allowlist = await readFile(path.join(root, 'policy/tool-allowlist.yaml'), 'utf8');
const deny = (allowlist.match(/denylist:[\s\S]*?connectors:\s*\n((?:\s+-\s+.+\n?)+)/) || [])[1] || '';
const denied = [...deny.matchAll(/-\s+(\S+)/g)].map((m) => m[1]);

let errors = 0;
const entries = await readdir(manifestDir, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile() || !/\.ya?ml$/i.test(entry.name)) continue;
  const text = await readFile(path.join(manifestDir, entry.name), 'utf8');
  const id = text.match(/^id:\s*(\S+)/m)?.[1] || entry.name;
  const tier = text.match(/^autonomy_tier:\s*(\S+)/m)?.[1];
  if (tier === 'F3' && !text.includes('human_gates:')) {
    console.error(`FAIL ${id}: F3 agent missing human_gates`);
    errors++;
  }
  for (const conn of denied) {
    if (text.includes(conn)) {
      console.error(`FAIL ${id}: uses denied connector ${conn}`);
      errors++;
    }
  }
}

if (errors) process.exit(1);
console.log('OK policy check');