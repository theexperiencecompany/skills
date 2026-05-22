---
name: motion-design-videos
description: Produce an Apple-keynote-quality motion-design video in HyperFrames (HTML + GSAP compositions) — kinetic typography plus real product UI, scored to a real music track, rendered at 4K. Use when asked to make a motion-design video, an Apple-style launch/product film, a feature-announcement video, a hype/promo reel or sizzle, ESPECIALLY in HyperFrames, or when porting motion-studio/Remotion components into a HyperFrames video. The engine is HyperFrames — `npx hyperframes` lint/inspect/render, one paused GSAP timeline on window.__timelines, sub-compositions, a reusable component library, and a 4K scale-stage. Covers the full pipeline — discovery, a binding creative brief, a music beat grid, an agent team (scriptwriter, reviewer, component porter, video builder, UX and craft auditors), faithful component porting, the Apple aesthetic and exact palette, sourcing a real royalty-free music track beat-matched to the edit, 4K export, frame-by-frame verification, and the hard-won pitfalls that cost real iterations.
---

# HyperFrames Motion-Design Videos

Build an Apple-keynote-quality motion-design video **in HyperFrames** (HTML + GSAP): bright, minimal, fast, premium, kinetic-type + real product UI, scored to a real music track, shipped at 4K. HyperFrames is the engine — HTML compositions with one paused GSAP timeline, sub-compositions, `npx hyperframes` lint/inspect/render, and a 4K scale-stage.

**Input → output.** This skill is **script-agnostic**: input = ANY product + ANY script; output = an Apple-keynote 4K HyperFrames video. The reusable engine is the same every time — the **beat-grid-first workflow**, the **HyperFrames component library** (composer, chat panels, terminal, bar chart, notification card, search→browser morph, the Text\* effects), the **brief/script templates**, the **agent team**, and the **verification loop**. To make a new film you supply a brief + a script; you mount the components that script calls for, feed them that script's real content, time everything to the beat grid, and verify on-frame. The lessons here were distilled from a full real build (a product launch film), but every rule is phrased to apply to any product and any script.

**The bar:** value lands for a stranger in one watch; it reads as an Apple keynote film, not a generic tech ad. Restraint is the aesthetic — white space, one idea per frame, physical motion.

**Expect iteration.** Apple-grade output is NOT one-shot in practice — expect rounds of user feedback on centering, dead-frames-on-downbeats, exact-vs-approximate components, music vibe, dark-vs-light, sizing, and per-scene polish. Bump the brief version each round, re-run the affected agents, and **verify EVERY change on-frame** (extract frames and view them; measure with PIL / ffmpeg `signalstats` when precision is needed). The goal is to make the *next* film a 1-shot by encoding what each round taught.

## When you start — read these references in order

1. `references/workflow.md` — the end-to-end process and order of operations. **Read first.**
2. `references/agent-team.md` — the agent roles to spin up and what each produces.
3. `references/apple-aesthetic.md` — the exact palette, type, motion, layout rules (the bar).
4. `references/music-pipeline.md` — the beat grid + sourcing/beat-matching a REAL track (synth is last resort).
5. `references/hyperframes-build.md` — HyperFrames mechanics, component porting, 4K export.
6. `references/pitfalls.md` — every hard-won gotcha. **Read before building and again before claiming done.**

`templates/CREATIVE_BRIEF.md` and `templates/SCRIPT.md` are starting skeletons — copy them into the project, don't edit in place.

## The non-negotiable spine

1. **Discovery → binding brief.** Read the *real* thing you're launching (feature/PR/product) and the *real* script. Pin audience, platform, length, the one-sentence leap, and the real (non-overclaimed) capabilities. Write a `CREATIVE_BRIEF.md` that is the north star for every agent.
2. **Lock the BEAT GRID before the script.** 120 BPM → beat = 0.5s, bar = 2.0s. Hard act-cuts land on downbeats (0, 2, 4, …). The music grid drives the script, not the other way around. See `references/music-pipeline.md`.
3. **Run the agent team in order.** scriptwriter → script reviewer → component porter → video builder → UX auditor + craft auditor → apply fixes → render. Expect several user-feedback rounds; the brief grows versions (v1→v5+). See `references/agent-team.md`.
4. **Port EXACT components, never recreate.** If real product UI exists (a composer, chat bubbles, terminal, charts, text effects), port it faithfully — match geometry, easing, structure — and re-theme. Hand-drawn approximations look fake and cost iterations.
5. **Source a REAL music track (do NOT synthesize).** Find a cleanly-licensed, professionally-produced royalty-free track (Pixabay free-commercial; Uppbeat/FMA), **beat-match its drop to the hero/reveal downbeat** (offset the track), trim, and fade out. Synthesized MIDI (fluidsynth + GM soundfont) sounds like cheap "corporate elevator music" and was rejected — it is a labeled last resort only. See `references/music-pipeline.md`.
6. **Verify every change frame-by-frame.** ffmpeg-extract frames and view them; check `signalstats` YMIN per integer second for dead frames. Never trust lint alone.

## Tooling at a glance

- **HyperFrames** (HTML + GSAP): one paused timeline registered on `window.__timelines["main"]`; timed elements need `class="clip"` + `data-start`/`data-duration`/`data-track-index`; sub-comps via `data-composition-src`. Deterministic only (no `Date.now`/`Math.random`/network). `npm run check` (lint+validate+inspect), `npm run render`. Invoke the `hyperframes`, `hyperframes-cli`, and `gsap` skills.
- **Porting Remotion → HyperFrames:** use the `remotion-to-hyperframes` skill mapping (`useCurrentFrame`/`interpolate`/`spring`/`Easing` → GSAP tweens on the paused timeline).
- **Music:** source a real royalty-free track (Pixabay via `curl_cffi` browser-impersonation past Cloudflare), beat-match the drop to the hero downbeat (RMS envelope), trim + fade with `ffmpeg`. Audio-only changes re-mux (`-c:v copy`), never re-render. Synthesis (`fluidsynth` + soundfont) is the last resort. See `references/music-pipeline.md`.
- **Frame verification:** `ffmpeg` extract + Read the image; `ffmpeg ... signalstats` for YMIN.

## Definition of done (all must hold)

- `lint` 0 errors, `inspect` 0 issues (no overflow / off-canvas).
- 4K (3840×2160) MP4 rendered near-lossless (`-q high --crf 14`), score embedded, correct duration; verify the bit_rate with `ffprobe` (NOT the ~1.8 Mbps default — it bands).
- Score is a **real, cleanly-licensed track** (not synthesized), beat-matched to the edit, with source + license recorded in `CREDITS.md`. It **fades out** (verify the last 2s taper to silence — no hard cut).
- **No dead/blank frames on any downbeat** (verified frame-by-frame, not by lint).
- Passes both audits: Apple design principles + the exact palette, and the motion language.
- Components are faithful ports (note any approximation in `TRANSLATION_NOTES.md`).
- Real, specific data (names/numbers/files) — never placeholders; nothing overclaimed beyond real shipped capability.
- A first-time viewer gets the value in one watch and wants it.
