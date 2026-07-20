# Fleet Engineering — Relaunch Playbook

Turn **fleet-engineering** from “correct sequel” (24★) into the same growth curve as **loop-engineering** (~8.8k★).

This is not a rewrite. The product mostly exists. The gap is **solo-day-one aha**, **score addiction**, and **distribution**.

---

## Positioning (lock this)

| | Loop | Fleet |
|--|------|-------|
| Unit | One autonomous system | A governed population |
| Pain | “I keep re-prompting” | “We have agents everywhere” |
| Promise | Design the loop | Design the registry + inbox + kill switch |
| Score | Loop Ready (L0–L3) | **Fleet Ready (F0–F3)** |
| Tagline | Stop prompting. Design the loop. | **You don’t have an agent problem. You have a population problem.** |

**One-sentence pitch (README hero + social):**

> Fleet engineering replaces ad-hoc agent sprawl with an accountable organization — registry, identity, permissions, inbox, budgets, and a kill switch — so every action answers: *which agent, with what authority, against what task, evidenced by what?*

**Do not pitch as:** multi-agent framework, CrewAI competitor, or “enterprise only.”

**Do pitch as:** the practical reference kit *after* loop-engineering — same house style, next layer of the stack.

```
Context → Harness → Loop → Fleet
```

---

## Non-negotiable viral mechanics (copy loop)

1. **One command** — `npx @cobusgreyling/fleet-init .`
2. **One score** — `npx @cobusgreyling/fleet-audit .` → 0–100 + F0–F3 + `--suggest`
3. **15-second demo GIF** — empty dir → init → audit climbs (see [relaunch demo script](../stories/relaunch-demo-script.md))
4. **Pattern picker** — already at `docs/pattern-picker.md` + Pages
5. **Week-one safe path** — F1 catalog + inbox only; no unattended L2+ loops
6. **Dogfood badge** — fleet-audit on every PR (already wired)
7. **Cross-link from loop** — loop README “Scale to a fleet” section + Substack Part 2

If any of these are weak, fix them before new features.

---

## Relaunch week (7 days)

### Day 0 — Freeze the demo path

```bash
rm -rf /tmp/fleet-demo && mkdir /tmp/fleet-demo && cd /tmp/fleet-demo
npx @cobusgreyling/fleet-init . --pattern team-agent-registry
npx @cobusgreyling/fleet-audit . --suggest
# Target: score jumps from ~10 → ≥40 (F1) with clear next steps
```

Checklist:
- [ ] Init works without cloning the monorepo
- [ ] Audit score is explained in human output (not only JSON)
- [ ] `--suggest` prints copy-pasteable commands
- [ ] README hero shows the two commands above
- [ ] GIF recorded and linked from README + Pages

### Day 1 — README hero rewrite

Lead with pain → command → score → stack diagram. Move maturity theory below the fold.

Hero structure:
1. Tagline
2. `fleet-init` + `fleet-audit` code block
3. “Fleet Ready” score screenshot/GIF
4. “Already have loops?” → `starters/fleet-plus-loop`
5. Pattern table (symptom → pattern)

### Day 2 — Score productization

Document weights in [fleet-ready-score.md](./fleet-ready-score.md). Mirror loop-audit UX:

```
Fleet Ready: 62/100  (F2 shared)
✓ FLEET.md  ✓ registry  ✓ manifests  ✓ budget
! inbox-runbook missing  ! kill switch not tested
→ npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl
```

CI gate examples:

```yaml
- run: npx @cobusgreyling/fleet-audit . --min-score=40
```

### Day 3 — Killer demo story

Publish one story with numbers (use real or dogfood):

> Three shadow agents, one shared key, $X surprise bill → registry + budget guard + kill switch in 45 minutes. Fleet Ready 18 → 71.

File: `stories/` + Substack excerpt + tweet thread.

### Day 4 — Loop cross-promo

In **loop-engineering** README (and docs/QUICKSTART):

```markdown
## Scale beyond one loop

When multiple loops/agents share a team, adopt fleet engineering:
npx @cobusgreyling/fleet-init . --with-loop daily-triage
```

Pin fleet in profile README under the stack.

### Day 5 — Essay + influencer pack

Substack: **“Fleet Engineering: the outer organization for your loops”**

Sections:
1. Why loop success creates fleet pain
2. Accountability test (one sentence)
3. F0→F3 without buying a platform
4. DIY 5-minute path
5. Link repo + score GIF

Outreach list: anyone who boosted loop (Addy orbit, agent-harness authors, Grok/Claude Code communities).

### Day 6–7 — Distribution blitz

- Show HN / Reddit r/LocalLLaMA + r/ClaudeAI + r/ChatGPTCoding (practical tone)
- X thread: problem → accountability sentence → init → score → inbox → kill switch
- LinkedIn: engineering-manager angle (cost + audit)
- Update Pages showcase with “Start here if you have 3+ agents”

---

## Content that converts (prioritize)

| Asset | Job |
|-------|-----|
| Demo GIF | Trust in 15s |
| Symptom → pattern table | Self-selection |
| `fleet-plus-loop` starter | Convert loop users |
| Failure modes | Seriousness / SEO |
| Stories (honest fails) | Social proof |

Skip until after relaunch: new frameworks integrations, multi-fleet theory deep dives, enterprise-only F3 polish.

---

## Success metrics (30 days)

| Signal | Target |
|--------|--------|
| GitHub stars | 500+ (path to 2k if loop cross-promo works) |
| `fleet-init` weekly npm | Measurable (publish if not already) |
| Stars from loop README | Track referrer / campaign UTM in essay |
| Issues/PRs | External pattern or starter PR |
| “Fleet Ready” mentions | Organic quote tweets / blog cites |

If stars move but npm doesn’t: onboarding broken.  
If npm moves but retention doesn’t: patterns not stealable enough.

---

## What *not* to do

- Don’t rename to compete with outerloop/harness-foundry messaging in public — **fleet is the growth surface**
- Don’t require a paid control plane for the aha moment
- Don’t lead with seven primitives before the 5-minute path
- Don’t launch memory-engineering the same week (split attention)

---

## Owner checklist (ship this pack)

- [ ] [fleet-ready-score.md](./fleet-ready-score.md) linked from README
- [ ] [relaunch-demo-script.md](../stories/relaunch-demo-script.md) recorded as GIF
- [ ] README hero matches this positioning
- [ ] Loop repo cross-link merged
- [ ] Essay draft published
- [ ] npm packages discoverable under `@cobusgreyling/fleet-*`
