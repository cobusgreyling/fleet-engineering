# Fleet Failure Modes

Incident-style catalog. Use in postmortems and pattern design.

## FM-01 Shadow Agent

**Signal:** Production action; no registry entry.  
**Cause:** Easy agent creation without catalog discipline.  
**Mitigation:** F1 gate — no connectors without manifest. Weekly registry review.

## FM-02 Credential Soup

**Signal:** Cannot answer "with what authority?"  
**Cause:** Shared keys; mixed claw/assistant semantics.  
**Mitigation:** Identity primitive; rotate keys per agent class.

## FM-03 Inbox Bypass

**Signal:** Destructive action without approval record.  
**Cause:** "Fast path" for trusted agent.  
**Mitigation:** Tool risk ratings; destructiveHint + inbox required.

## FM-04 Budget Avalanche

**Signal:** Monthly bill 10× with no attribution.  
**Cause:** Multiple L2 loops + sub-agents; no caps.  
**Mitigation:** Fleet Budget Guard before second unattended loop.

## FM-05 Handoff Schema Drift

**Signal:** Worker agents misinterpret manager output.  
**Cause:** Natural-language handoffs without typed contracts.  
**Mitigation:** Hierarchical Delegation pattern; JSON schema at boundaries.

## FM-06 Clone Fork Bomb

**Signal:** 50 variants of same agent; configs diverge.  
**Cause:** Clone without `forked_from` tracking or owner.  
**Mitigation:** Agent Clone & Fork policy; registry promotion rules.

## FM-07 Audit Theater

**Signal:** Logs exist but cannot correlate across agents.  
**Cause:** Per-agent logging only.  
**Mitigation:** Cross-Agent Audit; shared trace ID on handoffs.

## FM-08 Kill Switch Fail

**Signal:** Could not stop runaway agent in incident.  
**Cause:** Kill procedure never tested; scattered schedulers.  
**Mitigation:** `FLEET_PAUSE_ALL` + documented platform stops; quarterly drill.