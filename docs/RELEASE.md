# Release — npm CLIs

Publish fleet tools with git tags. Requires [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) on the `cobusgreyling/fleet-engineering` repo.

## Packages

| Package | Directory | Tag format |
|---------|-----------|------------|
| `@cobusgreyling/fleet-audit` | `tools/fleet-audit` | `fleet-audit-v*` |
| `@cobusgreyling/fleet-init` | `tools/fleet-init` | `fleet-init-v*` |
| `@cobusgreyling/fleet-budget` | `tools/fleet-budget` | `fleet-budget-v*` |

## One-time npm setup

1. Create packages on npmjs.com (if not exists)
2. Add trusted publisher: GitHub Actions, repo `cobusgreyling/fleet-engineering`, workflow matching release file

## Release steps

```bash
# Bump version in tools/<pkg>/package.json, then:
git tag fleet-audit-v0.2.0
git push origin fleet-audit-v0.2.0
```

Workflow runs tests and `npm publish --provenance`.

## Local dev

```bash
npm install
npm test
node tools/fleet-audit/cli.js . --suggest
```