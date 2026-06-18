# Contributing

Thank you for helping build the open reference for fleet engineering.

## What we want

- Production fleet patterns with honest failure modes
- Platform mappings (LangSmith Fleet, DIY, self-hosted)
- Stories — wins and postmortems with accountability scores
- Improvements to `fleet-audit`, `fleet-cost` scoring and schemas

## Local setup

```bash
git clone https://github.com/cobusgreyling/fleet-engineering.git
cd fleet-engineering
npm install
npm test
npm run audit:suggest
```

## Pattern PRs

1. Add `patterns/<id>.md`
2. Update `patterns/registry.yaml`
3. Link from `docs/pattern-picker.md` if user-facing
4. Add pattern extras to `tools/fleet-init/init.js` if scaffold artifacts apply
5. If loop integration applies, test `--with-loop` alignment with `fleet-audit`

## Schema changes

- Update `schemas/*.schema.json`
- Run `npm run validate:agents` against `starters/minimal-fleet`

## Tool changes

- Add tests in `tools/<tool>/test/`
- Bump `tools/<tool>/package.json` version before release tag

## Code of conduct

Be precise. Cite sources. Prefer accountability over hype.