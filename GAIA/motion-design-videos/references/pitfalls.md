# Pitfalls — hard-won, every one cost real iterations

Read this before building AND again before claiming done. These are the failures that actually happened.

## Table of contents
1. Dead frames on downbeats (the #1 defect)
2. Verify frame-by-frame, never trust lint
3. Styled-span flattening
4. clip-path uses absolute px
5. One timeline per composition id
6. Pace sub-comp timelines to their clip
7. Center via flex, not guessed offsets
8. Keep authentic component proportions
9. Shell / render-file traps
10. Accuracy, no overclaiming

---

## 1. Dead frames on downbeats — THE priority
The worst failure is a **blank/white frame landing on a hard downbeat** — the "snaps into a void / choppy" feel. It happens when an outgoing scene exits before the incoming one has built, or a build starts slightly *after* its downbeat (e.g. a reveal whose first word is legible at 16.6s when the music hits at 16.0s).
- **Overlap everything by ~0.15–0.25s.** Begin the incoming build *while* the outgoing scene is still lifting/blurring (lead-in / linger / cross-dissolve). Each musical downbeat must land on built content, never white.
- **Compress per-word stagger** so a hero line is fully legible by ~0.5s after its downbeat, hitting ON the beat.
- Check EVERY downbeat 0→end, not just the obvious ones.

## 2. Verify frame-by-frame — never trust lint alone
Lint/inspect catch structural errors, not dead frames or broken visuals.
- Extract a frame at every integer second (and at exact suspect downbeats) and **look at it**:
  ```bash
  ffmpeg -ss 16.0 -i renders/film.mp4 -frames:v 1 /tmp/f16.png
  ```
- Quantify blankness with `signalstats` YMIN per second (YMIN ~230+ = near-white blank; ~16–32 = content present):
  ```bash
  ffmpeg -i renders/film.mp4 -vf "select='eq(n\,0)+...',signalstats,metadata=print" -f null -
  ```
  Or sample per-second and grep the YMIN. A fix is NOT done until frames are re-extracted and confirmed.

## 3. Styled-span flattening destroys accent words
`splitLines` / rewriting `textContent` flattens the headline and **destroys inner styled spans** — e.g. an `<span class="accent">computer</span>` loses its color. Either animate the element as a unit, or use a word-splitter that **preserves inner runs** (wrap words without discarding existing child spans).

## 4. `clip-path: path()` uses absolute px
Bubble tails / morph shapes built with `clip-path: path("…")` are in **absolute pixels**, not relative units. If the element is scaled (e.g. inside a 2× stage, or a panel with its own `transform: scale()`), the path coords must match the element's **actual rendered size** or the tail renders broken/clipped. Author the path at the element's true px dimensions.

## 5. A composition id hosts a live timeline ONLY ONCE per frame
For a 3-up (three panels visible simultaneously) use **distinct composition ids** (`imessage-panel`/`whatsapp-panel`/`telegram-panel`), not three copies of one id. Reuse → only one renders its internal timeline; the others sit static.

## 6. Pace each sub-comp timeline to span its clip
If a sub-comp's internal timeline is shorter than its on-screen duration, it **finishes early and freezes**. Stretch the sub-comp's internal timing to fill the clip.

## 7. Center via full-canvas flex, not guessed top/left
Optically center with a flex-centered full-canvas container. Guessed absolute `top/left` offsets drift between scenes and read as "weird placement" — a real audit finding ("Real work. Done." was off-center). Fix centering **globally**, not scene-by-scene.

## 8. Keep authentic component proportions
Don't inflate `min-height` (or other dimensions) to "fill" space — the composer looked **"too tall"** when its min-height was doubled. Ports must keep 1:1 proportions with source; only overall uniform scale may change.

## 9. Shell / render-file traps
- **zsh word-splitting:** unquoted vars do NOT word-split in a `for` loop (unlike bash). And a glob inside `$(...)` **errors on no-match**. Use `grep` / explicit lists instead of relying on glob expansion.
- **The command hook may rewrite `npx` → `npm`.** Use the `npm run …` scripts (`npm run render`, `npm run check`) rather than raw `npx hyperframes …`.
- **`render` writes a TIMESTAMPED file.** Promote it to the canonical name with an explicit `cp`/`mv` using full filenames. **NEVER `rm` renders (or `.bak`s) with a glob** — you'll delete history.
- **No trailing-slash `rm` on a symlinked dir** (e.g. shared `node_modules`/`assets`): `rm dir` (no slash) for a symlink; `rm -rf dir/` follows the link and deletes the target's contents.

## 10. Accuracy, no overclaiming
Ground every on-screen claim in real shipped code (read the PR/feature). No benchmarks, no competitors, no AGI talk, no capability the product doesn't have. Real specific data (names/numbers/files), never placeholders. A film that overclaims reads as a lie to the exact technical audience you're targeting.
