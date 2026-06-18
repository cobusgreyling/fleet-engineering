# Release — npm CLIs

Publish fleet tools with git tags. Requires [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) on the `cobusgreyling/fleet-engineering` repo.

## Packages

| Package | Directory | Tag format |
|---------|-----------|------------|
| `@cobusgreyling/fleet-audit` | `tools/fleet-audit` | `fleet-audit-v*` |
| `@cobusgreyling/fleet-init` | `tools/fleet-init` | `fleet-init-v*` |
| `@cobusgreyling/fleet-budget` | `tools/fleet-budget` | `fleet-budget-v*` |
| `@cobusgreyling/fleet-cost` | `tools/fleet-cost` | `fleet-cost-v*` |

## One-time npm setup

1. Create packages on npmjs.com (if not exists)
2. Add trusted publisher: GitHub Actions, repo `cobusgreyling/fleet-engineering`, workflow matching release file
3. Enable **Template repository** in GitHub repo Settings → General (for minimal-fleet starter)

## Release steps (v0.3.0)

```bash
git tag fleet-audit-v0.3.0 && git push origin fleet-audit-v0.3.0
git tag fleet-init-v0.3.0 && git push origin fleet-init-v0.3.0
git tag fleet-budget-v0.3.0 && git push origin fleet-budget-v0.3.0
git tag fleet-cost-v0.1.0 && git push origin fleet-cost-v0.1.0
```

Workflow runs tests and `npm publish --provenance`.

## Local dev

```bash
npm install
cd tools/fleet-audit && npm install && cd ../..
npm test
node tools/fleet-audit/cli.js . --suggest
```