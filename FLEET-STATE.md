# Fleet State — fleet-engineering reference repo

Last review: 2026-06-10

## Registered agents / automations

| ID | Owner | Role | Authority | Evidence path | Status |
|----|-------|------|-----------|---------------|--------|
| `audit-workflow` | maintainers | Fleet readiness scoring | `GITHUB_TOKEN` read | `.github/workflows/audit.yml` | active F1 |
| `validate-registry` | maintainers | Pattern registry validation | CI read | `scripts/validate-registry.mjs` | active F1 |

## Human inbox (needs decision)

- [ ] Publish Fleet Engineering Substack essay and link here
- [x] GitHub Pages showcase live
- [x] npm publish workflows for `fleet-audit`, `fleet-init`, `fleet-budget` (tag to release)

## Watch list

- LangSmith Fleet product evolution — map new primitives to `docs/primitives-matrix.md`
- loop-engineering `multi-loop.md` — cross-link when fleet essay ships

## Recent decisions

- 2026-06-10: Scaffolded v0.1 reference repo locally; F1 posture (catalog + audit, no unattended agents)