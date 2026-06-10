# Examples

Runnable walkthroughs and platform-specific notes.

| Platform | Path | What you get |
|----------|------|--------------|
| DIY (git-backed) | [diy/](diy/) | F1 afternoon walkthrough with before/after audit scores |
| LangSmith Fleet | [langsmith-fleet/](langsmith-fleet/) | Registry backup + sample export |
| OpenHermit | [openhermit/](openhermit/) | Permissions overlay + accountability sample |

## Quick compare

```bash
npx @cobusgreyling/fleet-init /tmp/demo --pattern team-agent-registry
npx @cobusgreyling/fleet-audit /tmp/demo
npx @cobusgreyling/fleet-budget /tmp/demo
```