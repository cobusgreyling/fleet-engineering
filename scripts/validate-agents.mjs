#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import yaml from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function loadYaml(text) {
  const doc = yaml.parseDocument(text, { prettyErrors: true });
  if (doc.errors?.length) {
    throw new Error(doc.errors.map((e) => e.message).join('; '));
  }
  return doc.toJS();
}

async function validateJsonSchema(name, data, schemaFile) {
  const schemaText = await readFile(path.join(root, 'schemas', schemaFile), 'utf8');
  const schema = JSON.parse(schemaText);
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    const msgs = (validate.errors || []).map((e) => `${e.instancePath || '/'} ${e.message}`);
    throw new Error(`${name}: ${msgs.join('; ')}`);
  }
}

async function validateRegistry(registryPath) {
  const text = await readFile(registryPath, 'utf8');
  const data = loadYaml(text);
  await validateJsonSchema(path.basename(registryPath), data, 'agent-registry.schema.json');

  const workspaceRoot = path.dirname(path.dirname(registryPath));
  for (const agent of data.agents) {
    if (agent.manifest) {
      const resolved = path.resolve(workspaceRoot, agent.manifest);
      if (!(await exists(resolved))) {
        throw new Error(`Registry references missing manifest: ${agent.manifest}`);
      }
      const manifestText = await readFile(resolved, 'utf8');
      const manifest = loadYaml(manifestText);
      await validateJsonSchema(agent.manifest, manifest, 'agent-manifest.schema.json');
      if (manifest.id !== agent.id) {
        throw new Error(`Manifest id mismatch: registry=${agent.id} manifest=${manifest.id}`);
      }
    }
  }
  return data.agents.length;
}

async function validateManifestDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    if (!entry.isFile() || !/\.ya?ml$/i.test(entry.name)) continue;
    const filePath = path.join(dir, entry.name);
    const text = await readFile(filePath, 'utf8');
    const data = loadYaml(text);
    await validateJsonSchema(entry.name, data, 'agent-manifest.schema.json');
    count++;
  }
  return count;
}

let errors = 0;
const target = process.argv[2] ? path.resolve(process.argv[2]) : root;
const registryPath = path.join(target, 'agents/registry.yaml');
const manifestDir = path.join(target, 'agents/manifests');

try {
  let registryCount = 0;
  let manifestCount = 0;

  if (await exists(registryPath)) {
    registryCount = await validateRegistry(registryPath);
    console.log(`OK — agents/registry.yaml (${registryCount} entries)`);
  }

  if (await exists(manifestDir)) {
    manifestCount = await validateManifestDir(manifestDir);
    console.log(`OK — ${manifestCount} manifest(s) in agents/manifests/`);
  }

  if (!registryCount && !manifestCount) {
    console.log('SKIP — no agents/registry.yaml or agents/manifests/ (not an agent fleet workspace)');
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  errors++;
}

if (errors) process.exit(1);