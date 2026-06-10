# Fleet Engineering

<p align="center">
  <img src="assets/visuals/fleet-engineering-header.jpg" alt="Fleet Engineering — Govern populations of agents with accountability" width="100%" />
</p>


<p align="center">
  <a href="https://github.com/cobusgreyling/fleet-engineering/actions/workflows/audit.yml"><img src="https://img.shields.io/github/actions/workflow/status/cobusgreyling/fleet-engineering/audit.yml?label=fleet-audit%20dogfood" alt="fleet-audit dogfood"></a>
  <a href="https://github.com/cobusgreyling/fleet-engineering/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
  <a href="https://cobusgreyling.github.io/fleet-engineering/"><img src="https://img.shields.io/badge/GitHub_Pages-live-6366f1" alt="Pages"></a>
</p>

<p align="center">
  <img src="assets/cobus-greyling.jpg" alt="Cobus Greyling" />
</p>

**Fleet engineering is replacing ad-hoc populations of agents with an accountable organization. You design the registry, identity, permissions, inbox, audit trail, and sovereign control that let many loops run safely across a team.**

A fleet is not "many agents." A fleet is a **governed population** where every action answers one sentence:

> *Which agent did it, with what authority, against what task, evidenced by what?*

<p align="center">
  <strong><a href="https://cobusgreyling.github.io/fleet-engineering/">→ cobusgreyling.github.io/fleet-engineering</a></strong>
  <br>
  <strong><a href="https://cobusgreyling.substack.com/">→ Fleet Engineering essay on Substack (coming soon)</a></strong>
</p>

## The Stack

| Layer | Unit of design | Question |
|-------|----------------|----------|
| [Context Engineering](https://cobusgreyling.medium.com/context-engineering-a34fd80ccc26) | One inference | What does the model see? |
| [Harness Engineering](https://cobusgreyling.substack.com/p/the-rise-of-ai-harness-engineering) | One agent run | How does a single run execute safely? |
| [Loop Engineering](https://github.com/cobusgreyling/loop-engineering) | One autonomous system | What keeps prompting and verifying over time? |
| **Fleet Engineering** | Many agents + loops | How do populations coordinate and govern at scale? |

## Quick Links

| Start here | Description |
|------------|-------------|
| [Concepts](docs/concepts.md) | Fleet vs loop vs harness — **read this first** |
| [Five Concerns](docs/five-concerns.md) | Topology, choreography, identity, economics, sovereign control |
| [Accountability Test](docs/accountability-test.md) | The one-sentence standard for real fleets |
| [Pattern Picker](docs/pattern-picker.md) | Which fleet pattern to adopt first |
| [Primitives Matrix](docs/primitives-matrix.md) | LangSmith Fleet vs DIY vs OpenHermit |
| [Fleet Design Checklist](docs/fleet-design-checklist.md) | Ship readiness rubric (F0–F3) |
| [Patterns](patterns/README.md) | 6 production fleet patterns |
| [Starters](starters/) | Clone-and-run kits |
| [fleet-audit](tools/fleet-audit/) | Fleet Readiness Score — `node tools/fleet-audit/cli.js .` |
| [fleet-init](tools/fleet-init/) | Scaffold registry + manifests — `node tools/fleet-init/cli.js .` |
| [Stories](stories/) | Real wins and honest failures |

## Why This Matters

Loop engineering automates *your* prompting. Fleet engineering automates *organizational* coordination — who may run what, on whose behalf, with what evidence, at what cost.

When agents are easy to create, the hard part shifts from building to **managing**: ownership, authentication, permissions, audit trails, and safe sharing across teams. [LangSmith Fleet](https://www.langchain.com/blog/introducing-langsmith-fleet) names this shift for enterprises. This repo defines the **open discipline** — patterns and checklists that work with any platform.

## The Seven Fleet Primitives

| Primitive | Job in the Fleet |
|-----------|------------------|
| **Registry** | What agents exist, who owns them, version, lifecycle |
| **Identity & credentials** | Claw (service) vs assistant (act-as-user) |
| **Permissions & sharing** | clone / run / edit; workspace vs individual |
| **Inbox / escalation** | Fleet-wide HITL; approve/reject across agents |
| **Observability & audit** | Traces, decision evidence, cross-agent search |
| **Economics** | Budgets, quotas, cost attribution per agent/team |
| **Sovereign control** | Kill switch, rollback, autonomy tiers |

Full detail: [docs/primitives.md](docs/primitives.md) · Cross-platform matrix: [docs/primitives-matrix.md](docs/primitives-matrix.md)

### Anatomy of a Fleet (Mermaid)

```mermaid
flowchart TB
    subgraph Registry
        R[Agent Registry<br/>manifests + owners]
    end
    subgraph Identity
        I[Credentials model<br/>Claw vs Assistant]
        P[Permissions<br/>clone · run · edit]
    end
    subgraph Operations
        L1[Loop A]
        L2[Loop B]
        L3[Loop C]
    end
    subgraph Control
        IN[Shared Inbox<br/>HITL]
        AU[Audit / Traces]
        EC[Budgets & Quotas]
        KS[Kill Switch]
    end
    R --> L1 & L2 & L3
    I --> L1 & L2 & L3
    P --> L1 & L2 & L3
    L1 & L2 & L3 --> IN
    L1 & L2 & L3 --> AU
    EC --> L1 & L2 & L3
    KS --> L1 & L2 & L3
```

## Patterns

| Pattern | Scale | Starter | Week 1 | Cost risk |
|---------|-------|---------|--------|-----------|
| [Team Agent Registry](patterns/team-agent-registry.md) | 3–20 agents | [minimal-fleet](starters/minimal-fleet) | **F1** catalog only | Low |
| [Shared Inbox HITL](patterns/shared-inbox-hitl.md) | 2+ active agents | [minimal-fleet](starters/minimal-fleet) | F1 approve-only | Low |
| [Hierarchical Delegation](patterns/hierarchical-delegation.md) | manager + workers | [minimal-fleet](starters/minimal-fleet) | F1 report chain | Medium |
| [Agent Clone & Fork](patterns/agent-clone-fork.md) | 1 → many teams | [minimal-fleet](starters/minimal-fleet) | F1 clone policy | Low |
| [Fleet Budget Guard](patterns/fleet-budget-guard.md) | any active fleet | [minimal-fleet](starters/minimal-fleet) | **F1** caps only | Low |
| [Cross-Agent Audit](patterns/cross-agent-audit.md) | compliance / incidents | [minimal-fleet](starters/minimal-fleet) | F1 read-only audit | Low |

Not sure which to pick? See [pattern-picker](docs/pattern-picker.md).

Machine-readable index: [patterns/registry.yaml](patterns/registry.yaml)

## Getting Started (5 minutes)

```bash
# 1. Scaffold a minimal fleet workspace
node tools/fleet-init/cli.js . --pattern team-agent-registry

# 2. Audit readiness
node tools/fleet-audit/cli.js . --suggest

# 3. Review the accountability test
cat docs/accountability-test.md

# 4. Start F1: registry + permissions doc only — no unattended autonomy
```

Phased rollout: **F0 ad-hoc → F1 catalog + inbox → F2 shared agents + budgets → F3 enterprise governance**

See [fleet-design-checklist](docs/fleet-design-checklist.md).

## Operating & Safety

* [Failure Modes](docs/failure-modes.md) — incident-style catalog
* [Multi-Fleet Coordination](docs/multi-fleet.md) — when teams run separate fleets
* [Operating Fleets](docs/operating-fleets.md) — cost, logging, when to kill
* [Safety](docs/safety.md) — autonomy tiers, denylist, kill switches
* [Security](SECURITY.md) — reporting and fleet-scale automation risks
* [Stack](docs/stack.md) — context → harness → loop → fleet trail

## Caveats

Fleet engineering amplifies organizational judgment — both good and bad.

* **Shadow agents** multiply faster than registry updates.
* **Shared credentials** without identity model become compliance debt.
* **Unattended fleets** make unattended mistakes at org scale.
* **Budget caps** without per-agent attribution hide runaway loops.

Build the fleet like someone who intends to stay accountable — not just the person who enabled every agent.

## Related Repos

* [loop-engineering](https://github.com/cobusgreyling/loop-engineering) — the layer below: autonomous loops that prompt your agents
* [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — harness primitives and curated resources

## Contributing

Share production patterns, platform mappings, and failure stories. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

---

*Practical, platform-aware reference for fleet engineering — patterns you can clone, checklists you can ship against, and stories that include what broke.*
