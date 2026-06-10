# The Five Concerns of Fleet Engineering

Fleet engineering is organized around five interconnected concerns. Together with a **registry**, they turn agent populations into operable fleets.

## 1. Topology

**How agents relate structurally.**

| Pattern | Shape | Good for |
|---------|-------|----------|
| Hierarchical | Manager → workers | Command, delegation, oversight |
| Peer-to-peer | Direct agent-to-agent | Resilience, emergent coordination |
| Blackboard | Shared state / memory | Research, collaborative reasoning |
| Router | Dispatch to specialists | Multi-domain intake |
| Market-based | Bidding / scoring for tasks | Dynamic load, cost optimization |

Topology choice affects failure modes. Hierarchical fleets fail at the manager; P2P fleets fail at coordination drift.

**Fleet engineering question:** *Who can talk to whom, and who owns the outcome?*

## 2. Choreography

**How work flows between agents.**

| Style | Mechanism | Risk |
|-------|-----------|------|
| Workflow / DAG | Defined sequence | Brittle handoffs if schemas are loose |
| Event-driven | Pub-sub, triggers | Ordering and duplicate handling |
| Handoff | Typed payload between agents | Schema validation at boundaries |
| Saga | Compensating transactions | Long-running business processes |

GitHub's guidance applies at fleet scale: multi-agent systems behave like distributed systems. Every handoff needs typed schemas and boundary validation.

**Fleet engineering question:** *What is the contract at each handoff?*

## 3. Identity & Trust

**Who acted, on whose behalf, with what authority.**

Minimum fleet identity model:

| Dimension | Options |
|-----------|---------|
| Actor | Which agent instance / version |
| Principal | Service account (claw) vs end user (assistant) |
| Scope | Tools and data the principal may touch |
| Evidence | Trace ID, signed action manifest, audit log |

LangSmith Fleet implements this as agent identity + credentials (claw vs assistant) + tiered permissions.

**Fleet engineering question:** *Can we prove who authorized this action after the fact?*

## 4. Resource Economics

**How scarce resources are allocated across the fleet.**

Resources to meter:
- Tokens / inference spend
- Tool and API calls
- Concurrent agent slots
- Human review bandwidth (inbox queue depth)

Controls:
- Per-agent and per-team budgets
- Admission control (reject new runs when over cap)
- Cost attribution tags (team, agent, loop)
- Cheap triage before expensive sub-agents

**Fleet engineering question:** *Who pays when a loop runs at 5-minute cadence with two sub-agents?*

## 5. Sovereign Control

**How the organization retains ultimate authority.**

| Control | Purpose |
|---------|---------|
| Kill switch | Emergency stop for agent / team / fleet |
| Rollback | Revert agent config or action to known-good state |
| Autonomy tiers | F1 supervised → F3 unattended by risk class |
| Policy-as-code | Denylists, tool allowlists, data boundaries |
| Drift detection | Agent behavior diverges from registered manifest |

**Fleet engineering question:** *Can we stop and recover without guessing?*

## Registry — The Spine

Without a registry, the five concerns are documentation. With a registry, they are enforceable.

Minimum registry fields per agent:

```yaml
id: vendor-intake
owner: ops-team
version: 1.2.0
topology: router
identity: claw
permissions: [run]
loops: [daily-triage]
budget_daily_tokens: 500000
autonomy_tier: F1
```

Template: [templates/AGENT-MANIFEST.yaml](../templates/AGENT-MANIFEST.yaml)

## How concerns map to patterns

| Pattern | Primary concerns |
|---------|------------------|
| Team Agent Registry | Registry, Identity |
| Shared Inbox HITL | Choreography, Sovereign control |
| Hierarchical Delegation | Topology, Choreography |
| Agent Clone & Fork | Registry, Permissions |
| Fleet Budget Guard | Economics |
| Cross-Agent Audit | Identity, Sovereign control |