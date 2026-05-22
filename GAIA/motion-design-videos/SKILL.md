---
name: motion-design-videos
description: Produce an Apple-keynote-quality motion-design launch/product film — kinetic typography plus real product UI, scored to original music, rendered at 4K. Use when asked to create a launch video, product film, feature-announcement video, hype/promo reel, sizzle, or Apple-style motion-design commercial, especially in HyperFrames (HTML+GSAP) or when porting motion-studio/Remotion components into a video. Covers the full pipeline — discovery, a binding creative brief, a music beat grid, an agent team (scriptwriter, reviewer, component porter, video builder, UX and craft auditors), faithful component porting, the Apple aesthetic and exact palette, an original score (fluidsynth plus GM soundfont), 4K export, frame-by-frame verification, and the hard-won pitfalls that cost real iterations.
---

# Motion-Design Launch Videos

Build a film that looks like it came out of an Apple keynote: bright, minimal, fast, premium, kinetic-type + real product UI, scored to original music, shipped at 4K.

**Input → output.** This skill is **script-agnostic**: input = ANY product + ANY script; output = an Apple-keynote 4K video. The reusable engine is the same every time — the **beat-grid-first workflow**, the **component library** (composer, chat panels, terminal, bar chart, notification card, search→browser morph, the Text\* effects), the **brief/script templates**, the **agent team**, and the **verification loop**. To make a new film you supply a brief + a script; you mount the components that script calls for, feed them that script's real content, time everything to the beat grid, and verify on-frame. The lessons here were distilled from a full real build (a product launch film), but every rule is phrased to apply to any product and any script.

**The bar:** value lands for a stranger in one watch; it reads as an Apple keynote film, not a generic tech ad. Restraint is the aesthetic — white space, one idea per frame, physical motion.

**Expect iteration.** Apple-grade output is NOT one-shot in practice — expect rounds of user feedback on centering, dead-frames-on-downbeats, exact-vs-approximate components, music vibe, dark-vs-light, sizing, and per-scene polish. Bump the brief version each round, re-run the affected agents, and **verify EVERY change on-frame** (extract frames and view them; measure with PIL / ffmpeg `signalstats` when precision is needed). The goal is to make the *next* film a 1-shot by encoding what each round taught.

## When you start — read these references in order

1. `references/workflow.md` — the end-to-end process and order of operations. **Read first.**
2. `references/agent-team.md` — the agent roles to spin up and what each produces.
3. `references/apple-aesthetic.md` — the exact palette, type, motion, layout rules (the bar).
4. `references/music-pipeline.md` — the beat grid + original-score pipeline (fluidsynth + soundfont).
5. `references/hyperframes-build.md` — HyperFrames mechanics, component porting, 4K export.
6. `references/pitfalls.md` — every hard-won gotcha. **Read before building and again before claiming done.**

`templates/CREATIVE_BRIEF.md` and `templates/SCRIPT.md` are starting skeletons — copy them into the project, don't edit in place.

## The non-negotiable spine

1. **Discovery → binding brief.** Read the *real* thing you're launching (feature/PR/product) and the *real* script. Pin audience, platform, length, the one-sentence leap, and the real (non-overclaimed) capabilities. Write a `CREATIVE_BRIEF.md` that is the north star for every agent.
2. **Lock the BEAT GRID before the script.** 120 BPM → beat = 0.5s, bar = 2.0s. Hard act-cuts land on downbeats (0, 2, 4, …). The music grid drives the script, not the other way around. See `references/music-pipeline.md`.
3. **Run the agent team in order.** scriptwriter → script reviewer → component porter → video builder → UX auditor + craft auditor → apply fixes → render. Expect several user-feedback rounds; the brief grows versions (v1→v5+). See `references/agent-team.md`.
4. **Port EXACT components, never recreate.** If real product UI exists (a composer, chat bubbles, terminal, charts, text effects), port it faithfully — match geometry, easing, structure — and re-theme. Hand-drawn approximations look fake and cost iterations.
5. **Original score, real instruments.** Render a MIDI arrangement through fluidsynth + a real GM soundfont (FluidR3) → sampled instruments, then master with ffmpeg (warm EQ, glue comp, light reverb, loudnorm, **fade-out**). Cool/modern instrumentation (Rhodes EP + warm pad + synth sub-bass + tasteful electronic beat) beats solo "corporate piano." NOT additive synthesis.
6. **Verify every change frame-by-frame.** ffmpeg-extract frames and view them; check `signalstats` YMIN per integer second for dead frames. Never trust lint alone.

## Tooling at a glance

- **HyperFrames** (HTML + GSAP): one paused timeline registered on `window.__timelines["main"]`; timed elements need `class="clip"` + `data-start`/`data-duration`/`data-track-index`; sub-comps via `data-composition-src`. Deterministic only (no `Date.now`/`Math.random`/network). `npm run check` (lint+validate+inspect), `npm run render`. Invoke the `hyperframes`, `hyperframes-cli`, and `gsap` skills.
- **Porting Remotion → HyperFrames:** use the `remotion-to-hyperframes` skill mapping (`useCurrentFrame`/`interpolate`/`spring`/`Easing` → GSAP tweens on the paused timeline).
- **Music:** `fluidsynth` + `FluidR3_GM.sf2`, MIDI authored as raw bytes (no `mido` dependency), mastered with `ffmpeg`. See `references/music-pipeline.md`.
- **Frame verification:** `ffmpeg` extract + Read the image; `ffmpeg ... signalstats` for YMIN.

## Definition of done (all must hold)

- `lint` 0 errors, `inspect` 0 issues (no overflow / off-canvas).
- 4K (3840×2160) MP4 rendered near-lossless (`-q high --crf 14`), score embedded, correct duration; verify the bit_rate with `ffprobe` (NOT the ~1.8 Mbps default — it bands).
- Score **fades out** (verify the last 2s taper to silence — no hard cut).
- **No dead/blank frames on any downbeat** (verified frame-by-frame, not by lint).
- Passes both audits: Apple design principles + the exact palette, and the motion language.
- Components are faithful ports (note any approximation in `TRANSLATION_NOTES.md`).
- Real, specific data (names/numbers/files) — never placeholders; nothing overclaimed beyond real shipped capability.
- A first-time viewer gets the value in one watch and wants it.
