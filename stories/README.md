# Stories

Real fleet wins and honest failures. **Every story must include audit scores before/after when applicable.**

| Story | Pattern | Lesson |
|-------|---------|--------|
| [Registry before inbox](registry-before-inbox.md) | Team Agent Registry | Catalog before approvals |
| [Shadow agents audit](shadow-agents-audit.md) | Team Agent Registry | Audit score forces honesty |
| [Inbox bypass incident](inbox-bypass-incident.md) | Shared Inbox HITL | DM approval ≠ inbox |
| [Budget cap saved runaway](budget-cap-saved-runaway.md) | Fleet Budget Guard | Cap manager + workers |
| [LangSmith git backup](langsmith-git-backup.md) | Registry + Audit | Platform + git together |

## Template for new stories

- Context (team size, agents, platform)
- Pattern used
- What worked
- What broke
- **Accountability test score before/after** (e.g. 2/4 → 4/4)
- **fleet-audit score before/after** (e.g. 32/100 F0+ → 58/100 F1)
- Optional: `fleet-cost` attribution lesson

Submit via [story issue template](../.github/ISSUE_TEMPLATE/story.yml).