# Hierarchical Delegation

**Goal:** Manager agent or loop delegates to specialized workers with typed, auditable handoffs.

## When to use

- One intake agent fans out to domain specialists
- Handoffs fail when passed as free text

## Topology

```
Manager (router/planner)
 ├── Worker A (research)
 ├── Worker B (implement)
 └── Worker C (verify)
```

## Week one (F1)

Manager produces **report-only** handoff packets. Workers do not auto-execute.

## Handoff contract

Use JSON schema at boundaries:

```json
{
  "task_id": "T-4421",
  "goal": "Draft vendor intake summary",
  "constraints": ["no external send", "read-only Notion"],
  "principal": "claw",
  "parent_trace": "trace-parent-xyz"
}
```

Store schema in `agents/handoff-schema.json`.

## Human gates

- Worker promoted from F1 to F2 autonomy
- Handoff parse failures (3+ retries → escalate)
- Cross-worker conflicting outputs

## Relation to loop engineering

Manager ≈ loop with `loop-triage` skill. Workers ≈ sub-agents with isolated worktrees. Fleet layer adds **registry + identity** on each node.

## Platform notes

**LangGraph:** Natural fit for graph topology.  
**LangSmith Fleet:** Use separate registered agents per role; choreograph via explicit triggers.