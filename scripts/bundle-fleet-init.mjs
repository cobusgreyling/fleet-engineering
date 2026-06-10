#!/usr/bin/env node
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = path.join(root, 'tools/fleet-init');

await rm(path.join(toolDir, 'starters'), { recursive: true, force: true });
await rm(path.join(toolDir, 'templates'), { recursive: true, force: true });

await cp(path.join(root, 'starters/minimal-fleet'), path.join(toolDir, 'starters/minimal-fleet'), { recursive: true });
await cp(path.join(root, 'templates'), path.join(toolDir, 'templates'), { recursive: true });

console.log('Bundled starters + templates → tools/fleet-init/');