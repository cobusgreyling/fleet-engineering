# Relaunch Demo Script (15–30s GIF)

Record this cold path. No monorepo clone. No enterprise setup.

## One-command local rehearsal (preferred)

From a clone of this repo (uses local CLIs — no npm publish required):

```bash
chmod +x scripts/record-relaunch-demo.sh
./scripts/record-relaunch-demo.sh          # auto-paced for GIF capture
./scripts/record-relaunch-demo.sh --pause  # keypress between beats
```

Record the terminal (examples):

```bash
# asciinema + agg → gif
asciinema rec /tmp/fleet-ready.cast -c './scripts/record-relaunch-demo.sh'
agg /tmp/fleet-ready.cast assets/visuals/fleet-ready-demo.gif
```

## Terminal script (npx / published packages)

```bash
# Clean slate
rm -rf /tmp/fleet-ready-demo && mkdir /tmp/fleet-ready-demo && cd /tmp/fleet-ready-demo

# Before (expect low score)
npx @cobusgreyling/fleet-audit . 2>/dev/null || echo "Fleet Ready: ~10 (empty)"

# Scaffold F1
npx @cobusgreyling/fleet-init . --pattern team-agent-registry --tool grok

# After
npx @cobusgreyling/fleet-audit . --suggest

# Optional second beat: inbox
npx @cobusgreyling/fleet-init . --pattern shared-inbox-hitl
npx @cobusgreyling/fleet-audit .
```

## Narration (overlay or voice)

1. “Three agents. No list. No owner. No kill switch.”
2. “Fleet engineering: design the population, not another prompt.”
3. Show score climb.
4. “Every action must answer: which agent, what authority, what task, what evidence.”
5. CTA: `github.com/cobusgreyling/fleet-engineering`

## Visual checklist

- [ ] Large terminal font
- [ ] Score number centered in frame on final frame
- [ ] Repo URL end card 2s
- [ ] Dark theme matching loop-engineering GIF
- [ ] Under 30s total (15s ideal)

## Placement

1. README hero (under init commands)
2. GitHub Pages showcase
3. Substack embed
4. Tweet 1 of relaunch thread

## Honesty bar

If init does not raise score by ≥25 points on empty dir, fix audit/init before publishing the GIF.
