# Operating Fleets

Day-2 operations for fleet engineering.

## Weekly

- Review `FLEET-STATE.md` — retire stale agents
- Check budget burn vs caps
- Inbox queue depth for risky action classes
- One accountability test spot-check

## Monthly

- Re-run `fleet-audit` on each team workspace
- Update `patterns/registry.yaml` if new patterns adopted
- Review clone/fork sprawl
- Kill switch drill (pause one non-critical agent)

## Logging

Minimum fleet log fields:

```
timestamp, agent_id, version, principal, action, task_ref, trace_id, outcome
```

Store where compliance requires — not only in chat UI.

## When to kill

Kill or pause when:
- Budget hard cap hit
- Accountability test fails on production action
- Inbox SLA breached for destructive class
- Agent version drifts from registered manifest
- Incident commander requests `FLEET_PAUSE_ALL`

Document kill in `FLEET-STATE.md` with reason and owner.

## Cost operations

Pair with [loop-engineering operating loops](https://github.com/cobusgreyling/loop-engineering/blob/main/docs/operating-loops.md):

| Loop ops | Fleet ops |
|----------|-----------|
| Per-loop token estimate | Per-agent + per-team caps |
| loop-run-log | Fleet-wide spend dashboard |
| Kill one loop | Kill agent subset or fleet |

## Promotion workflow

```
F0 experiment → manifest draft → F1 catalog → inbox trial → F2 shared → F3 enterprise
```

Never promote on demo success alone — require accountability test pass for the action class.