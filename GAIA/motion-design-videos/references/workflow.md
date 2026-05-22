# Workflow — end to end

The order matters. Each phase produces an artifact the next phase binds to.

## Table of contents
1. Discovery
2. Creative brief (north star)
3. Beat grid (lock before script)
4. Script → review
5. Component porting
6. Build
7. Audit → fix
8. Render
9. Iterate (expect feedback rounds)

---

## 1. Discovery
This skill takes **any product + any script**. Read the **real** thing you're launching — the product, the feature, the PR, the actual shipped code — AND the supplied script (if any). Do not invent capability. Pin down:
- **What shipped / the script's claim** in one sentence (the "leap"). Ground every claim in real code/the script.
- **Real capabilities** — an explicit list you will not exceed. No benchmarks, no competitors, no overclaiming.
- **Audience** (devs / founders / power users / general).
- **Platform & aspect** (16:9 1920×1080 is the default canvas; author here even for 4K).
- **Length** (films tend to grow as scope grows — e.g. 40s → 50s → 56s across rounds; start tight).
- **Emotional truth** — the one feeling the film must deliver.

If a script is provided, map each beat to a **component from the library** (`hyperframes-build.md` §4) and a **text effect**. If real product UI exists (a web app, Remotion compositions), locate the source — you will port from it, not recreate it.

## 2. Creative brief (north star)
Write `CREATIVE_BRIEF.md` (skeleton in `templates/`). It is binding for every agent. It must contain:
- The positioning spine / one-liner.
- The truth + real capability list (the "do not exceed these").
- Audience, platform, length, the first-3s scroll-stop and last-4s screenshot-able logo.
- Tone & references (Apple product-page films, Linear/Vercel launch films).
- The **brand system** — exact palette tokens, type, accent discipline (see `apple-aesthetic.md`).
- The exact list of **components to port** (with source paths) and **text effects** to use.
- Music direction (file, BPM, build/resolve moments).
- Hard constraints / do-nots and a **definition of done**.

Keep a version log at the top. As the user gives feedback, bump the version (v1→v2→…) and note what supersedes what. The brief is the single source of truth when agents disagree.

## 3. Beat grid (lock BEFORE the script)
The music grid drives the script. Write `BEATGRID.md` first (see `music-pipeline.md`):
- 120 BPM → beat 0.5s, bar 2.0s. List every downbeat (0,2,4,…).
- Divide the runtime into phrases/acts with energy notes (intro/hook → build/ask → REVEAL soar → impressive → proactive/platforms → payoff → logo → CTA).
- Mark the key cut anchors (e.g. the reveal detonates at 16.0s on the score's impact hit).
- Hero frames hold a full bar (2s); montage hits land on half-beats.

Only after the grid exists do you write the script against it.

## 4. Script → review
Scriptwriter writes `SCRIPT.md`: a per-beat sheet keyed to the beat grid. Each beat names its time window, the on-screen copy (≤7 words / headline, every word legible ≥0.4s), the **text effect** (a distinct effect per scene), the component if any, and an **accuracy note** grounding the claim in real code.

Script reviewer writes `SCRIPT_REVIEW.md`: density relief (no back-to-back staccato lists), comprehension for a stranger, accuracy/overclaim audit, accent-hit ledger (count the cyan/accent moments — keep ≤5). The reviewer should not add/remove beats lightly — keep the grid intact.

## 5. Component porting
Porter ports each named component from source (e.g. Remotion → HyperFrames) **exactly** — matching geometry, easing config, and structure, re-themed to the film palette. Document fidelity + any approximation in `TRANSLATION_NOTES.md`. See `hyperframes-build.md` for mechanics and `pitfalls.md` for the porting traps.

## 6. Build
Builder assembles `index.html` (the root composition) and wires sub-comps. One paused root timeline carries all kinetic type; each ported component is a sub-comp with its own internal timeline. Author at 1920×1080 inside a 2× scaled stage for 4K. Cut on downbeats, overlap transitions so no downbeat lands on a blank frame.

## 7. Audit → fix
Two auditors, in parallel:
- **UX auditor** (`AUDIT_UX.md`): clarity for a stranger, comprehension, dead-frame hunt (quantified with ffmpeg `signalstats` YMIN), pacing, does the value land.
- **Craft auditor** (`AUDIT_CRAFT.md` / `AUDIT_APPLE_*.md`): every scene scored against the Apple principles + palette — color, type, spacing/centering, motion (subtle/quick/smooth, per-word), depth. Specific (hex, px, timing), prioritized P0/P1/P2.

Consolidate into a `FIXES.md` (P0 = anything that breaks comprehension or the Apple feel — chiefly dead frames on downbeats). Apply fixes, then **re-verify frame-by-frame** before claiming done.

## 8. Render
Render the 4K master near-lossless: `npm run render -- -q high --crf 14` (the default ~1.8 Mbps bands gradients). It writes a **timestamped** file. Promote to a canonical filename with explicit filenames — NEVER `rm` with a glob (see `pitfalls.md`). Confirm with `ffprobe`: 3840×2160, high bit_rate, correct duration, audio present, score fades out (last 2s taper to silence). YouTube re-encodes, so deliver a low-CRF master.

## 9. Iterate (assume it, don't hope to avoid it)
Apple-grade output takes iteration; treat each user note as a hard-won rule worth encoding back into the skill. Expect rounds on **centering, dead-frames-on-downbeats, exact-vs-approximate components, music vibe, dark-vs-light, sizing, and per-scene polish**. Each round: bump the brief version, re-grid if length changes, re-run the affected agents, re-audit, **re-verify EVERY change on-frame** (extract + view; measure with PIL / ffmpeg `signalstats`). Keep `.bak` copies of superseded versions (score, index, beatgrid), never delete blindly.
