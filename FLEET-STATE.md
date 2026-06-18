# Fleet State — fleet-engineering reference repo

Last review: 2026-06-18

## Registered agents / automations

| ID | Owner | Role | Authority | Evidence path | Status |
|----|-------|------|-----------|---------------|--------|
| `audit-workflow` | maintainers | Fleet readiness scoring | `GITHUB_TOKEN` read | `.github/workflows/audit.yml` | active F1 |
| `validate-registry` | maintainers | Pattern registry validation | CI read | `scripts/validate-registry.mjs` | active F1 |

Manifests: `agents/manifests/*.yaml` · Registry: `agents/registry.yaml`

## Human inbox (needs decision)

- [x] GitHub Pages showcase + interactive pattern picker
- [x] npm publish workflows for all four CLIs (tag to release)
- [ ] Enable GitHub **Template repository** setting for minimal-fleet

## Watch list

- LangSmith Fleet product evolution — map new primitives to `docs/primitives-matrix.md`
- loop-engineering cross-link from README (bidirectional)

## Recent decisions

- 2026-06-18: v0.3 — schema validation in fleet-audit, fleet-cost, --with-loop, runnable examples, F3 starter
- 2026-06-10: Scaffolded v0.1 reference repo; F1 posture (catalog + audit, no unattended agents)