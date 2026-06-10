# Fleet Safety

Safety at population scale differs from single-loop safety.

## Autonomy tiers

| Tier | Posture | Example |
|------|---------|---------|
| F1 | Human approves all external writes | Draft PR only |
| F2 | Allowlisted auto-actions | Merge green dependabot patches |
| F3 | Supervised unattended | SRE agent with rollback |

Assign tier per agent in manifest — not per organization once.

## Tool risk classes

| Class | Examples | Gate |
|-------|----------|------|
| Read | grep, search, list | Auto |
| Write-internal | commit to branch, draft doc | Verifier + inbox optional |
| Write-external | email send, prod deploy, delete | Inbox required |
| Destructive | drop table, delete repo | Inbox + named approver |

Use MCP [tool annotations](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/) as hints — not substitutes for fleet policy.

## Denylist (fleet-wide)

Maintain in `FLEET.md`:

- Packages / paths no agent may modify
- APIs that always require inbox
- Data classes (PCI, PHI) that require F1 only

## Kill switch hierarchy

1. Single agent pause
2. Team fleet pause
3. `FLEET_PAUSE_ALL`
4. Platform admin disable (LangSmith / cloud console)

Test level 1–2 monthly.

## Relation to loop safety

Loop safety ([loop-engineering docs](https://github.com/cobusgreyling/loop-engineering/blob/main/docs/safety.md)) governs **one loop**.

Fleet safety governs **which loops may run unattended** and **what they share**.