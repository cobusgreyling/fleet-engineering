# Examples

Runnable walkthroughs and platform-specific notes.

| Platform | Path | What you get |
|----------|------|--------------|
| DIY (git-backed) | [diy/](diy/) | `demo.sh` — before/after audit scores |
| E2E F2 | [e2e-f2/](e2e-f2/) | Full F2 workspace + run log + CI |
| Enterprise F3 | [enterprise-f3/](enterprise-f3/) | Policy-as-code + compliance export |
| LangSmith Fleet | [langsmith-fleet/](langsmith-fleet/) | `export-backup.sh` + sample registry |
| OpenHermit | [openhermit/](openhermit/) | `apply-permissions.sh` + sample overlay |

## Quick compare

```bash
npx @cobusgreyling/fleet-init /tmp/demo --pattern team-agent-registry --with-loop daily-triage
npx @cobusgreyling/fleet-audit /tmp/demo --suggest
npx @cobusgreyling/fleet-budget /tmp/demo
npx @cobusgreyling/fleet-cost /tmp/demo
```

## From clone

```bash
bash examples/diy/demo.sh
npm run test:examples
```