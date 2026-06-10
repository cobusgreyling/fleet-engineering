# AGENTS.md — fleet-engineering

Guidance for AI agents working in this repository.

## Purpose

This is the open reference for **Fleet Engineering** — governing populations of agents with accountability. It complements [loop-engineering](https://github.com/cobusgreyling/loop-engineering).

## Before you change anything

1. Read [docs/concepts.md](docs/concepts.md) and [docs/accountability-test.md](docs/accountability-test.md)
2. Check [FLEET.md](FLEET.md) for active fleet posture
3. Patterns must update [patterns/registry.yaml](patterns/registry.yaml)

## Conventions

- **F0–F3** = fleet maturity levels (not loop L0–L3)
- **Claw** = agent with fixed service credentials
- **Assistant** = agent acting on behalf of invoking user
- Every pattern doc includes: goal, scale, week-one mode, human gates, failure modes

## Do not

- Add vendor-only patterns without a DIY equivalent note
- Enable unattended write automation without human gates documented
- Break registry schema without updating `scripts/validate-registry.mjs`

## Key paths

| Path | Purpose |
|------|---------|
| `patterns/` | Production fleet patterns |
| `templates/` | AGENT-MANIFEST, permissions, budget |
| `tools/fleet-audit/` | Readiness scorer |
| `tools/fleet-init/` | Scaffold CLI |
| `docs/five-concerns.md` | Core discipline framework |