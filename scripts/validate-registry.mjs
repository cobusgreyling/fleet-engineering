#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(root, 'patterns/registry.yaml');

const text = await readFile(registryPath, 'utf8');
const ids = [...text.matchAll(/^\s+-\s+id:\s+(\S+)/gm)].map((m) => m[1]);
const files = [...text.matchAll(/^\s+file:\s+(\S+)/gm)].map((m) => m[1]);

if (ids.length === 0) {
  console.error('No patterns in registry');
  process.exit(1);
}

const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) {
  console.error('Duplicate pattern ids:', dupes.join(', '));
  process.exit(1);
}

let missing = 0;
for (const file of files) {
  try {
    await readFile(path.join(root, 'patterns', file));
  } catch {
    console.error(`Missing pattern file: patterns/${file}`);
    missing++;
  }
}

if (missing) process.exit(1);
console.log(`OK — ${ids.length} fleet patterns validated`);