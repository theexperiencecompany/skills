# <PRODUCT> — "<FILM TITLE>" — Launch Film Creative Brief (v1)

> North star for every agent. Copy this into the project; bump the version on every
> user-feedback round and note what supersedes what.

## Version log
- **v1 (current):** initial brief.

## 1. What we're launching (the truth — be accurate)
**<PR / feature>.** The leap, in one sentence:
> **<one-sentence leap, grounded in real shipped code>.**

Real, shipped capabilities (do NOT exceed these):
- <capability 1 — cite the real code/file>
- <capability 2>
- <capability 3>

Emotional truth: *"<the one feeling the film delivers>."*

## 2. Positioning spine
**"<the one-liner>."** Hook teases; the reveal at <T>s detonates. The proof (real product UI) does the convincing, not adjectives.

## 3. Audience, platform, length
- Audience: <devs / founders / power users / general>.
- **16:9, 1920×1080** (author here; export 4K via the 2× stage). Length: **~<N>s**.
- First **3s** must stop the scroll; last **4s** = a clean, screenshot-able logo.

## 4. Tone & references
Apple keynote energy: bright, minimal, fast, premium, confident. No voiceover. A real music track carries emotion; subtle off-beat SFX punctuate cuts. References: Apple product-page films, Linear/Vercel launch films. **Restraint is the aesthetic.**

## 5. Brand system (see the skill's apple-aesthetic.md for the full palette)
- Page BG `#FFFFFF` / `#F5F5F7`. Ink `#1C1C1E`, secondary `#3A3A3C`, muted `#8E8E93`, cards `#E5E5EA`.
- Success `#34C759`, warning `#FF9500`, error `#FF3B30`, caution `#FFCC00`, Apple Blue `#007AFF`.
- **Brand accent `<#hex>` — used ≤5 moments total.** Do not introduce a second blue.
- Type: SF Pro Display / Inter. Mono: Anonymous Pro / `ui-monospace`. Soft Apple shadows, no heavy borders.

## 6. Components (pick from the reusable library; port real chrome where it exists)
Choose per beat from the engine in `hyperframes-build.md` §4 — composer · chat panels · terminal · bar chart · notification card · search→browser morph · Text\* effects. If real product UI exists, PORT it exactly (never recreate); otherwise theme the library block.
| Beat / use | Component (library block or source path to port) |
|---|---|
| <beat> | <composer / chat panels / terminal / chart / card / morph / port source> |
| <beat> | <…> |
| <beat> | <…> |
Text effects to use (distinct per scene): `<list the Text* effects>`.

## 7. Motion language
Apple ease `cubic-bezier(0.16,1,0.3,1)`. One transform per element. Per-word text, distinct effect per scene, seamless overlap. Container morphs (geometry), not opacity fades. Hard cuts on downbeats; hero frames hold a bar.

## 8. Music
`assets/score.mp3` — a **REAL, cleanly-licensed royalty-free track** (Pixabay free-commercial / Uppbeat / FMA), vibe `<cinematic electronica / dynamic electronic / tech / energetic synth>`, <N>s. **Beat-match its drop to the reveal at <T>s** (offset the track). Cut to `BEATGRID.md`. Record source + license in `CREDITS.md`. Subtle SFX on off-beats (mixed via re-mux). **Fades out — the fade must complete inside the audio's used duration (no hard cut).** Do NOT synthesize (fluidsynth is a last resort only — sounds like corporate elevator music).

## 9. Hard constraints / do-nots
- No voiceover. No overclaiming beyond §1. No benchmarks/competitors.
- Accent discipline: ≤5 accent moments. Body copy never accent-colored on white.
- Determinism: all motion seek-driven on `window.__timelines["main"]`. ~120px safe margins; `inspect` clean.

## 10. Definition of done
- `lint` 0 errors, `inspect` 0 issues. 4K MP4 rendered `-q high --crf 14` (verify bit_rate via `ffprobe` — not the ~1.8 Mbps default), score embedded + fades out, ~<N>s. No dead frames on any downbeat (verified on-frame).
- Faithful ports (note approximations in `TRANSLATION_NOTES.md`). Passes UX + craft audits.
- A first-time viewer gets the value in one watch and wants it.
