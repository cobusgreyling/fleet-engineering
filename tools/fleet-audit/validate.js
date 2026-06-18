import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import yaml from 'yaml';

const PKG_DIR = path.dirname(fileURLToPath(import.meta.url));

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

async function loadSchema(name) {
  const schemaPath = path.join(PKG_DIR, 'schemas', name);
  const text = await readFile(schemaPath, 'utf8');
  return JSON.parse(text);
}

function validateWithSchema(ajv, schema, data, label) {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    const msgs = (validate.errors || []).map((e) => `${e.instancePath || '/'} ${e.message}`);
    throw new Error(`${label}: ${msgs.join('; ')}`);
  }
}

export async function validateFleetAgents(workspaceRoot) {
  const root = path.resolve(workspaceRoot);
  const registryPath = path.join(root, 'agents/registry.yaml');
  const manifestDir = path.join(root, 'agents/manifests');
  const ajv = new Ajv({ allErrors: true, strict: false });
  const manifestSchema = await loadSchema('agent-manifest.schema.json');
  const registrySchema = await loadSchema('agent-registry.schema.json');

  const result = {
    registryValid: false,
    manifestCount: 0,
    validManifestCount: 0,
    errors: [],
    warnings: [],
    registryIds: new Set(),
    manifestIds: new Set(),
    activeRegistryIds: new Set(),
    loopsByAgent: {},
    permissionsOk: true,
  };

  if (!(await exists(registryPath)) && !(await exists(manifestDir))) {
    return result;
  }

  try {
    if (await exists(registryPath)) {
      const data = loadYaml(await readFile(registryPath, 'utf8'));
      validateWithSchema(ajv, registrySchema, data, 'agents/registry.yaml');
      result.registryValid = true;
      for (const agent of data.agents) {
        result.registryIds.add(agent.id);
        if (agent.status === 'active') result.activeRegistryIds.add(agent.id);
        if (agent.manifest) {
          const resolved = path.resolve(root, agent.manifest);
          if (!(await exists(resolved))) {
            result.errors.push(`Registry references missing manifest: ${agent.manifest}`);
            continue;
          }
          const manifest = loadYaml(await readFile(resolved, 'utf8'));
          validateWithSchema(ajv, manifestSchema, manifest, agent.manifest);
          if (manifest.id !== agent.id) {
            result.errors.push(`Manifest id mismatch: registry=${agent.id} manifest=${manifest.id}`);
          }
          result.manifestIds.add(manifest.id);
          result.validManifestCount++;
          if (manifest.loops?.length) result.loopsByAgent[manifest.id] = manifest.loops;
          if (!['claw', 'assistant'].includes(manifest.identity)) {
            result.errors.push(`${agent.manifest}: identity must be claw or assistant`);
          }
          if (!manifest.permissions && manifest.status === 'active') {
            result.warnings.push(`${manifest.id}: active agent missing permissions block`);
            result.permissionsOk = false;
          }
        }
      }
    }
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : String(err));
  }

  if (await exists(manifestDir)) {
    const entries = await readdir(manifestDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !/\.ya?ml$/i.test(entry.name)) continue;
      result.manifestCount++;
      const filePath = path.join(manifestDir, entry.name);
      try {
        const data = loadYaml(await readFile(filePath, 'utf8'));
        validateWithSchema(ajv, manifestSchema, data, entry.name);
        result.manifestIds.add(data.id);
        if (!result.registryIds.has(data.id) && data.status === 'active') {
          result.warnings.push(`Shadow agent: ${data.id} in manifests/ but not in registry`);
        }
        if (data.loops?.length) result.loopsByAgent[data.id] = data.loops;
        if (!data.permissions && data.status === 'active') {
          result.warnings.push(`${data.id}: active manifest missing permissions block`);
          result.permissionsOk = false;
        }
        result.validManifestCount++;
      } catch (err) {
        result.errors.push(err instanceof Error ? err.message : String(err));
      }
    }
  }

  for (const id of result.activeRegistryIds) {
    if (!result.manifestIds.has(id)) {
      result.warnings.push(`Registry entry ${id} is active but has no manifest`);
    }
  }

  return result;
}

export function detectLoopAlignment(loopMd, loopsByAgent) {
  const issues = [];
  const referenced = new Set();
  for (const loops of Object.values(loopsByAgent)) {
    for (const loop of loops) referenced.add(loop);
  }
  if (!referenced.size) return issues;

  for (const loop of referenced) {
    const pattern = new RegExp(`\\b${loop}\\b`, 'i');
    if (!pattern.test(loopMd)) {
      issues.push(`Loop "${loop}" in manifest but not referenced in LOOP.md`);
    }
  }
  return issues;
}