---
name: gaia-imessage-demos
description: Write and produce GAIA iMessage demo videos for launch and YC. Use when asked to script, review, score, or render an iMessage product demo, especially when the user says "make a demo", "write the YC video", "script the iMessage thread", "review this demo script", or "render the thread". Covers the founder's voice rules, the state-ledger logic audit that catches continuity errors before rendering, a multi-agent scoring loop, and the Keyloom/Remotion production pipeline.
---

# GAIA iMessage demos

A demo is one iMessage thread. No WhatsApp, no web UI, no motion graphics, no voiceover. The product is shown by the assistant doing real work across weeks, in plain language a stranger can follow on the first read.

The goal is not a feature tour. It is a month in one person's life where the work gets done and the person stays in control.

## The bar

A cold viewer who has never heard of GAIA should be able to say, after one watch, what the person does, what the assistant did, and what changed. If they have to infer a mechanism, a referent, or a number, the line fails.

The founder's own words set the bar:

- "it should be simple, it should just work"
- "the whole demo video should be just an imessage conversation"
- "this is so ai slop"
- "the script seems boring and dead and have to think between the lines a bit. and it feels over done. its not human"
- "why would we want to have a disagreement?"
- "the user legit signed up"
- "why make the reader read between the lines and vague talk like this?"
- "like we gotta think from a human perspective"
- "okay better this way of thinking about lines being readable is great"
- "but this isnbt doing any work"
- "each convo can be slightly longer"

## When to use

Use for the YC demo, a launch demo, a social cut, or any request to script or review an iMessage conversation that demonstrates GAIA.

Do not use for the long form narrated video, the web app demo, or the WhatsApp and Telegram scenes. Those are separate deliverables with separate specs.

## Non-negotiables

1. **One thread, nothing else.** No other platforms, no browser chrome, no device mockup, no title cards, no logo outro.
2. **The assistant speaks first.** A user who signed up does not ask who is texting. The first frame shows value, not onboarding.
3. **No manufactured conflict.** Nobody argues, nobody is tested, nobody has to be won over. The tension comes from real work and real deadlines.
4. **Every line is readable on one pass.** No jargon, no shorthand, no fragments that need decoding. Name the thing.
5. **The work is visible.** Every scene does something with a result the viewer can see: a draft, a booking, a refund, a form, a contract review.
6. **Life and business share the thread.** The personal beat is not decoration. It is the proof that one assistant holds both.
7. **The user stays competent.** The assistant asks before acting, the user makes the calls, and the user can override.
8. **The ending is calm, not a flex.** No scoreboard, no "I know", no punchline about the product.

## Pipeline

Work in this order. Do not write dialogue before step 2 is agreed.

### 1. Research the real surface

Read the actual product before inventing a workflow. Check the docs and the code, not a summary.

- Email and calendar behavior in `docs/guides/managing-email.mdx` and the calendar code, in the GAIA repo.
- Workflows in `docs/workflows.mdx`.
- The latest briefing design in the Conductor workspace, not the first screenshot you find.
- Any feature you plan to show must exist. If it does not, say so and change the beat.
- If those paths are not present, use the public docs or ask. Never invent a capability.

### 2. Lock the direction

Agree on four things before any dialogue:

- **Protagonist.** Usually the founder, signing up and progressively handing over work.
- **Timespan.** Four to eight weeks, shown as four to six days.
- **The one visible job.** A raise, a launch, a move, a business month. One spine.
- **The claim.** What the viewer should repeat afterward. Example: "it runs the office while he's on site."

Write the claim in one sentence. If you cannot, the demo has no spine.

### 3. Fill the state ledger

For every beat, fill the row in `references/logic-audit.md`. A blank cell is a bug. This is the step that prevents the errors the founder kept catching: a flight that appears from nowhere, a contract that teleports into an inbox, "nothing on my plate" followed by a personal item.

### 4. Draft the thread

Write in plain language. Short scenes, longer messages. Each scene has one decision or one result. Put the artifacts in the thread, not in a separate scene: a brief image, a link card, a tapback.

Target 45 to 55 beats for 2:30 to 3:00. Do not pad with filler. If the duration is short, add a real scene. A pause is only for reading time or a time skip, never for content.

### 5. Run the logic audit

Apply every gate in `references/logic-audit.md`. One failed gate means rewrite that beat. Do not render until all gates pass.

### 6. Score with independent agents

Spawn five agents with no shared context. Each gets the script and nothing about your intent. Use the roles and thresholds in `references/agent-team.md`.

The cold viewer is the most important. If a person who does not know GAIA, and does not care about the persona, cannot follow it, the script fails regardless of craft.

Run a round, rewrite, then run a fresh set. A round passes only when every threshold clears. If two cold viewers disagree by more than 1.5 points on the same script, you are at the noise floor. Stop editing sentences and change the story.

### 7. Render and verify

Use the Keyloom composition. The production spec, prop schema, timing math, and known pitfalls are in `references/production.md`.

After rendering, extract frames at the start, every date divider, and the end. Check:

- the date divider and the first bubble are in sync
- the image and its caption are in sync
- no bubble is clipped under the header in a way that cuts a sentence
- the final message is on screen for at least 1.5 seconds
- every artifact is legible at 1080 wide

## What the demo must prove

- It does real work, not just replies.
- It holds state across weeks without re-briefing.
- It handles both the company and the person.
- It knows when to ask and when to act.
- It is calm, not theatrical.

## References

- `references/voice.md` — the voice doctrine, with the founder's quotes and the failure patterns.
- `references/logic-audit.md` — the 12 gates, the state ledger, and the three highest-leverage checks.
- `references/agent-team.md` — the scoring roles, dimensions, and pass thresholds.
- `references/production.md` — Keyloom props, timing math, render commands, and pitfalls.
- `templates/props.example.json` — a ten-beat shape to copy, not a finished demo.

## The deliverable

Two artifacts, always together:

1. A readable script block. One message per line, speaker on the left, date headers between scenes, artifacts marked in brackets.
2. A props JSON for the renderer. Brackets in the script map to `images` or `link` beats in the same order.

If the two disagree, the JSON is wrong. The script is the source of truth.

## Definition of done

- 2:30 to 3:00, 45 to 55 beats.
- Zero logic gates failed.
- Cold viewer average at least 7.5, no dimension below 6.
- Continuity audit 10/10.
- YC partner craft at least 7.5 and impact at least 7.
- The claim is stated in one sentence and the thread proves it.
- Artifacts and at least one reaction are in the thread.
- Frames verified at the start, every divider, and the end.
