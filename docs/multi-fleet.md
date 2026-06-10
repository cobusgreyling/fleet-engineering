# Multi-Fleet Coordination

When teams run separate fleets (platform, GTM, support, security).

## When you have multiple fleets

- Different data boundaries (PII, production, customer)
- Different platforms (LangSmith Fleet vs self-hosted)
- Different autonomy policies

This is normal at F2+. Fleet engineering applies **per fleet** and **between fleets**.

## Between-fleet rules

| Rule | Rationale |
|------|-----------|
| No shared service credentials across fleets | Attribution breaks |
| Handoffs require typed contracts | Same as multi-agent |
| Each fleet has its own registry | No shadow catalog |
| Cross-fleet actions go through inbox | Sovereign control |
| Economics attributed per fleet | Chargeback clarity |

## Bridge from loop multi-loop

[loop-engineering multi-loop](https://github.com/cobusgreyling/loop-engineering/blob/main/docs/multi-loop.md) coordinates loops **within one repo/team**.

Multi-fleet coordinates **populations** across teams:

```
Team A Fleet          Team B Fleet
├── daily-triage      ├── pr-babysitter
├── ci-sweeper        └── gtm-research
└── registry A        └── registry B
         │                     │
         └──── handoff contract ────┘
              (typed, audited)
```

## Priority when fleets collide

1. Sovereign control (kill / pause)
2. Identity / compliance boundary
3. Budget caps
4. Choreography contracts
5. Topology changes

## Anti-pattern: Monolith Fleet

One enterprise fleet for every agent everywhere. Simple early; brittle at scale. Prefer federated fleets with explicit handoff contracts.