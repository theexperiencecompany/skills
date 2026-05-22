# Pitfalls — hard-won, every one cost real iterations

Read this before building AND again before claiming done. These are the failures that actually happened on a real build. They are framework- and script-agnostic — they bite any Apple-style motion-design film.

## Table of contents
1. `white-space: pre-wrap` turns inter-tag newlines into REAL line breaks
2. Hidden elements must LEAVE the layout flow
3. Dead frames on downbeats (the #1 timing defect)
4. Verify frame-by-frame, never trust lint
5. When a render won't reveal a layout bug, inspect it LIVE (DevTools)
6. Styled-span flattening destroys accent words
7. `clip-path: path()` uses absolute px (broken bubble tails / morph shapes)
8. One live timeline per composition id
9. Pace sub-comp timelines to their clip
10. Center via flex, not guessed offsets
11. Keep authentic component proportions
12. Info-bearing panels must be readable (full opacity, long enough)
13. Shell / render-file ops traps
14. Accuracy, no overclaiming

---

## 1. `white-space: pre-wrap` turns inter-tag newlines into REAL line breaks — TOP PITFALL
The single most expensive bug of the build. An element styled `white-space: pre-wrap` (common on typing/composer/code elements) treats the **newlines and indentation between child tags in pretty-printed HTML as literal whitespace**. Pretty-printed markup like:
```html
<div class="input">
  <span>Draft</span>
  <span>the</span>
  <span>email</span>
</div>
```
renders as **four lines tall** (one per newline), pushing the visible text to the bottom of its box and **defeating BOTH flex and absolute centering** — for many iterations, because the HTML *looks* correct.
- **Fix:** use `white-space: nowrap` or `normal` on such elements, OR strip the inter-tag whitespace (single-line markup / no indentation between inline spans).
- **Tell:** an element is mysteriously taller than its content and text sits at the bottom; centering "doesn't work" no matter what you try. Suspect `pre`/`pre-wrap` + indented inner spans first.

## 2. Hidden elements must LEAVE the layout flow
A placeholder or pre-reveal element hidden with `visibility: hidden` or GSAP `autoAlpha: 0` is **invisible but STILL occupies layout** and pushes its siblings (mis-centering the visible content). To truly remove it from flow use `display: none` (toggle it in the timeline) or take it out with `position: absolute`. Reserve `opacity`/`autoAlpha` for things that should keep their space.

## 3. Dead frames on downbeats — THE timing priority
The worst timing failure is a **blank/white frame landing on a hard downbeat** — the "snaps into a void / choppy" feel. It happens when an outgoing scene exits before the incoming one has built, or a build starts slightly *after* its downbeat (e.g. a reveal whose first word is legible at 16.6s when the music hits at 16.0s).
- **Overlap everything by ~0.15–0.25s.** Begin the incoming build *while* the outgoing scene is still lifting/blurring (lead-in / linger / cross-dissolve). Each musical downbeat must land on built content, never white.
- **Compress per-word stagger** so a hero line is fully legible by ~0.5s after its downbeat, hitting ON the beat.
- Check EVERY downbeat 0→end, not just the obvious ones.

## 4. Verify frame-by-frame — never trust lint alone
Lint/inspect catch structural errors, not dead frames, broken visuals, or mis-centering.
- Extract a frame at every integer second (and at exact suspect downbeats) and **look at it**:
  ```bash
  ffmpeg -ss 16.0 -i renders/film.mp4 -frames:v 1 /tmp/f16.png
  ```
- Quantify blankness with `signalstats` YMIN per second (YMIN ~230+ = near-white blank; ~16–32 = content present):
  ```bash
  ffmpeg -i renders/film.mp4 -vf "select='eq(n\,0)+...',signalstats,metadata=print" -f null -
  ```
- For pixel-precise checks (is the headline actually centered? what color is this region?) load the frame in **PIL** and measure bounding boxes / sample pixels. A fix is NOT done until frames are re-extracted and confirmed.

## 5. When a render won't reveal a layout bug, inspect it LIVE (DevTools)
Blind render-extract-look loops are slow and can hide the *cause* of a CSS/layout bug. When a layout defect resists frame inspection, debug it live in the browser — this cracked the `pre-wrap` bug (#1) instantly after many blind render attempts.
1. Start the preview server in the background: `npm run dev` (long-running — never foreground).
2. With the Chrome DevTools MCP, navigate to `http://localhost:<port>/preview/comp/<file>.html` (the sub-comp) or the root composition.
3. Seek the timeline to the suspect instant: `window.__timelines['<composition-id>'].time(<t>)`.
4. Read the offending node's true geometry/styles:
   ```js
   const el = document.querySelector('<selector>');
   el.getBoundingClientRect();              // actual size/position
   getComputedStyle(el).whiteSpace;         // catches pre-wrap
   getComputedStyle(el).display;            // catches hidden-but-in-flow
   ```
The computed box vs. the expected box tells you immediately whether the bug is whitespace, flow, scale, or position.

## 6. Styled-span flattening destroys accent words
`splitLines` / rewriting `textContent` flattens the headline and **destroys inner styled spans** — e.g. an `<span class="accent">word</span>` loses its color. Either animate the element as a unit, or use a word-splitter that **preserves inner runs** (wrap words without discarding existing child spans).

## 7. `clip-path: path()` uses absolute px
Bubble tails / morph shapes built with `clip-path: path("…")` are in **absolute pixels**, not relative units. If the element is scaled (e.g. inside a 2× stage, or a panel with its own `transform: scale()`), the path coords must match the element's **actual rendered size** or the tail renders broken/clipped. Author the path at the element's true (scaled) px dimensions, or compute the path from the rendered box.

## 8. A composition id hosts a live timeline ONLY ONCE per frame
To mount several instances of the same component live in one frame (e.g. a 3-up of chat panels) use **distinct composition ids** (`panel-a`/`panel-b`/`panel-c`), not three copies of one id. Reuse → only one renders its internal timeline; the others sit static/frozen.

## 9. Pace each sub-comp timeline to span its clip
If a sub-comp's internal timeline is shorter than its on-screen duration, it **finishes early and freezes** (a morph holds half-done, a typing animation completes then sits). Stretch the sub-comp's internal timing to fill the clip's full duration.

## 10. Center via full-canvas flex, not guessed top/left
Optically center with a flex-centered full-canvas container. Guessed absolute `top/left` offsets drift between scenes and read as "weird placement" (a recurring audit finding across the build). Fix centering **globally**, not scene-by-scene. (And rule out #1/#2 first — they make correctly-centered containers *look* off-center.)

## 11. Keep authentic component proportions
Don't inflate `min-height` (or other dimensions) to "fill" space — a composer looked **"too tall"** when its min-height was doubled. Ports must keep 1:1 proportions with source; only overall uniform scale may change.

## 12. Info-bearing panels must be readable
Any panel a viewer must READ (a chat thread, a notification card, a stat) must reach **full opacity** and **hold long enough to read** (≥~1s for a short line; longer for a thread). Don't pin it at 0.5 opacity "for subtlety" and don't flash it for <1s — the value doesn't land. Subtlety is for decoration, not for the payload.

## 13. Shell / render-file ops traps
- **`render` writes a TIMESTAMPED file** into `renders/`. Find the newest with `ls -t` / `grep`, then promote it to the canonical name with an explicit `cp`/`mv` using **full filenames**.
- **NEVER `rm` renders (or `.bak`s) with a glob** — a no-match glob can behave unexpectedly and a too-broad glob can delete the render you just made or your history.
- **zsh quirks:** unquoted vars do NOT word-split in a `for` loop (unlike bash); a glob inside `$(...)` **errors on no-match**. Use `grep` / explicit lists, not glob expansion, to locate files.
- **The command hook may rewrite `npx` → `npm`.** Use the `npm run …` scripts (`npm run render`, `npm run check`) rather than raw `npx hyperframes …`.
- **No trailing-slash `rm` on a symlinked dir** (e.g. shared `node_modules`/`assets`): `rm dir` (no slash) for a symlink; `rm -rf dir/` follows the link and deletes the target's contents.

## 14. Accuracy, no overclaiming
Ground every on-screen claim in real shipped capability (read the PR/feature/script source). No benchmarks, no competitors, no AGI talk, no capability the product doesn't have. Real specific data (names/numbers/files), never placeholders. A film that overclaims reads as a lie to the exact audience you're targeting.
