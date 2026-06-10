# FLEET.md — Fleet Engineering Reference

This file documents how the **fleet-engineering** reference repository operates as a governed mini-fleet.

The goal: be the canonical, copyable collection of fleet patterns, starters, and tooling — and eat our own dogfood.

## Active Fleet Posture

| Concern | This repo |
|---------|-----------|
| Registry | `patterns/registry.yaml` + per-pattern docs |
| Identity | Maintainers own patterns; contributors via PR |
| Permissions | Public read; write via PR + CODEOWNERS (future) |
| Inbox | GitHub Issues + Discussions for human gates |
| Audit | `fleet-audit` workflow on every push/PR |
| Economics | No unattended token spend on this reference repo |
| Sovereign control | CI can block; no auto-merge of fleet policy changes |

## Accountability Test (dogfood)

For any automated action in this repo, we should answer:

> *Which agent/workflow did it, with what authority, against what task, evidenced by what?*

Example:
- **Which**: `audit.yml` GitHub Action
- **Authority**: repository `GITHUB_TOKEN`, read-only on PRs
- **Task**: score fleet readiness of changed paths
- **Evidence**: workflow run URL + posted comment / check result

## Active Patterns (reference repo)

### Team Agent Registry (F1)
- Registry: `patterns/registry.yaml`
- Manifest template: `templates/AGENT-MANIFEST.yaml`
- State: `FLEET-STATE.md` (human-maintained catalog of what runs where)

### Cross-Agent Audit (F1)
- `fleet-audit` CLI + `.github/workflows/audit.yml`
- Scores projects for registry, identity docs, budget, kill switch

### Fleet Budget Guard (F1 — documentation only)
- Template: `templates/fleet-budget.md`
- This reference repo does not run paid agent loops

## Relationship to Loop Engineering

This repo does **not** replace [loop-engineering](https://github.com/cobusgreyling/loop-engineering). Loops live inside fleets.

```
Fleet  = registry + identity + permissions + inbox + audit + economics + kill switch
Loop   = schedule + state + sub-agents + verification (inside one agent system)
```

When a team runs 3+ loops or 5+ agents, graduate from loop-engineering checklists to fleet-engineering checklists.

## Multi-fleet note

See [docs/multi-fleet.md](docs/multi-fleet.md) for orgs with separate team fleets (platform, GTM, support).

## Kill switch

To pause all fleet automation for this repo:
1. Disable GitHub Actions workflows in repo settings, or
2. Add `FLEET_PAUSE_ALL=true` to repo variables (honored by future automation), or
3. Remove `FLEET.md` active pattern section and open an issue explaining why.

## Review cadence

- Weekly: scan `FLEET-STATE.md` for stale agent entries
- Monthly: re-run `fleet-audit .` on starters and update registry
- Per release: verify accountability test still passes for all workflows