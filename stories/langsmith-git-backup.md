# LangSmith Fleet → Git Registry Backup

**Context:** Platform team on LangSmith Fleet; eng leads wanted git-backed disaster recovery.  
**Pattern:** Team Agent Registry + Cross-Agent Audit (F1)

## What worked

Weekly export of workspace agent list → `agents/registry.yaml`. Drift diff in PR comments. Restored 2 agents after accidental delete using manifest backups.

## Workflow

```bash
npx @cobusgreyling/fleet-init ~/fleet-backup --pattern team-agent-registry
# Weekly script: normalize LangSmith export → agents/registry.yaml
npx @cobusgreyling/fleet-audit ~/fleet-backup
```

## Accountability test

Git registry answers *which agent* and *who owns* even when LangSmith UI is down. Traces still answer *evidenced by what* via LangSmith.

## Lesson

Platform registry + git backup = F1 minimum for enterprises. Neither alone satisfies the full accountability sentence.