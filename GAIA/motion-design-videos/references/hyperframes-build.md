# HyperFrames build — mechanics, the reusable component library, 4K export

The film is authored in HyperFrames (HTML + GSAP). Invoke the `hyperframes`, `hyperframes-cli`, and `gsap` skills for framework detail; this file is the film-specific layer. For porting from Remotion, invoke `remotion-to-hyperframes`.

The components below are the **reusable engine** — they are NOT specific to any one product or script. Given any product + any script, you mount the components the script calls for, feed them that script's real content, and time them to the beat grid.

## Table of contents
1. Core HyperFrames rules
2. Project structure
3. Root timeline + sub-compositions
4. The reusable component library
5. The 4K export trick + high-bitrate render
6. Container morphs (A→B)
7. Cursor-click gesture (reusable interaction)
8. Porting components exactly
9. Text effects
10. Debugging layout live (DevTools)
11. CLI loop

---

## 1. Core HyperFrames rules
- One **paused** GSAP timeline registered on `window.__timelines["main"]` (the root). Each sub-comp registers its own under its composition id.
- Every timed element needs `class="clip"` + `data-start`, `data-duration`, `data-track-index`. The framework uses `class="clip"` for visibility control — without it the element won't show/hide correctly.
- **Deterministic only** — no `Date.now()`, no `Math.random()`, no network. Everything is seek-driven.
- Audio is a `<clip>`/`<audio>` element; the **audio clip must span the score's full fade-out** (see `music-pipeline.md`) or the end hard-cuts.

## 2. Project structure
```text
index.html                    # root composition (the assembled film)
compositions/*.html           # sub-components (composer, chat, terminal, chart, card, morph)
compositions/text-effects.js  # the Text* effect library (HFText.*)
assets/                       # score.mp3, soundfont, doodles, avatars, app icons, logos, SFX
meta.json, hyperframes.json, package.json
```
Keep `.bak` copies of superseded `index.html` / score / beatgrid versions for reference.

## 3. Root timeline + sub-compositions
- The **root timeline** carries all kinetic typography (`HFText.*` effects mounted at beat-grid offsets).
- Each component mounts as a sub-comp: `data-composition-id="<id>" data-composition-src="compositions/<file>.html"`. Animate the **outer wrapper** (the thing in the root timeline), never reach into the sub-comp's internals.
- **A composition id hosts a live internal timeline ONLY ONCE per frame.** To show several instances of the same component at once (e.g. a 3-up of chat panels) use **distinct ids** (`panel-a`/`panel-b`/`panel-c`), not three copies of one id — reuse means only one renders its timeline.
- **Pace each sub-comp's internal timeline to span its clip.** If a sub-comp's timeline is shorter than the time it's on screen, it finishes early and freezes. Stretch its internal timing to fill the clip's duration.

## 4. The reusable component library
Mount whichever the script calls for. Port real product chrome where it exists; otherwise use these faithful, themeable building blocks. Feed each the script's **real** content.

| Component | What it is | Reusable for |
|---|---|---|
| **Composer** | A typing input: text types in, a send button flips to the accent on send, a ring pulse fires. | "user asks X" / prompt beats |
| **Chat panels** | iMessage (iOS-blue user bubble + gray "them" bubble), WhatsApp / Telegram (real doodle backgrounds), real bubble tails + ticks, real app icon + platform name in the header. | conversation / multi-platform beats |
| **Terminal** | A light/dark terminal: per-char command print, blinking caret, output lines, `ready`/`done`. | "it runs real code / does work" beats |
| **Bar chart** | Staggered bars growing from baseline, one highlighted bar + a delta label (e.g. `+38% QoQ`). | data / result / impact beats |
| **Notification card** | A system-style notification (app-icon tile, title, body, "now" timestamp, slide-in) with an action pill. | proactive / "it already did it" beats |
| **Search→browser morph** | A search bar that morphs into a browser window revealing a page (see §6). | CTA / "go try it" beats |
| **Text\* effects** | The kinetic-type library (§9). | every headline / copy beat |

Generalize the IDs/labels to the script (a `composer`, a `terminal`, a `chart`) — the mechanics are identical regardless of product.

## 5. The 4K export trick + high-bitrate render
**There is no `--scale` flag.** Author at 1920×1080, then scale the whole stage 2× to native 3840×2160:
```html
<div data-composition-id="main" data-width="3840" data-height="2160">
  <div id="stage4k">  <!-- everything visual lives in here -->
    ...clips, sub-comps...
  </div>
</div>
```
```css
#stage4k {
  position: absolute; top: 0; left: 0;
  width: 1920px; height: 1080px;
  transform: scale(2);
  transform-origin: top left;
}
```
All clips/sub-comps are authored at 1080p coordinates inside `#stage4k` and render crisp at 2×. Set the root `data-width`/`data-height` to 3840/2160. **Render at 1080p first** to iterate fast, flip to 4K for the final.

### Bitrate matters (YouTube delivery)
The default render is **~1.8 Mbps — too low**; gradients/blurs band visibly. Render the master near-lossless:
```bash
npm run render -- -q high --crf 14   # PNG-lossless frame capture + near-lossless encode
```
- Verify the result with `ffprobe`:
  ```bash
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,bit_rate -of default=nw=1 renders/film.mp4
  ```
  Expect 3840×2160 and a high bit_rate (tens of Mbps), not ~1.8 Mbps.
- YouTube re-encodes on upload, so deliver a **low-CRF master** to survive their compression with no banding.

## 6. Container morphs (A→B)
To morph element A into element B (e.g. a search bar → a browser window), animate the **shared container's geometry** — `width`, `height`, `border-radius`, `position`/transform — and keep any **revealed image STATIC**:
- ONE container reshapes from A's box to B's box; the growing container *reveals* the destination content (e.g. a landing-page screenshot) which sits fixed underneath. Never cross-fade between two pictures and never `scale()` the image (scaling blurs/distorts it).
- Smaller pieces (traffic-light dots, an address bar) scale/slide into their final spots during the morph using the same Apple ease.
- **Pace the morph sub-comp's internal timeline to span its clip** (§3) or it finishes early and holds a half-formed shape.

## 7. Cursor-click gesture (reusable interaction)
To motivate a transition with a click (e.g. clicking a button that triggers the morph):
1. A mouse-pointer SVG travels to the target button (Apple-eased move).
2. Click feedback on arrival: button `scale 0.9 → 1` + a ring pulse (`scale 1 → ~1.9`, `opacity .45 → 0`).
3. THEN the next beat fires (the morph / navigation).
This reads as intentional interaction and gives the next cut a cause. Keep it quick and on the grid.

## 8. Porting components EXACTLY (never recreate)
If real product UI exists, port it — do not approximate. Approximations look fake and cost iterations.
- **Composer:** typing + send-flips-accent + ring pulse. Keep authentic proportions — do **not** double `min-height` (it looked "too tall").
- **Chat panels:** iMessage iOS-blue gradient user bubble + gray `#E9E9EB` "them" bubble; WhatsApp/Telegram with their **real doodle backgrounds**, real bubble tails + ticks. Header uses the **real app icon** (no tile shadow/outline) + the platform name as the label. Mount a 3-up with **distinct ids** (§3). Use real message SFX on chat beats.
- **Terminal**, **Bar chart**, **Notification card**, and the **Text\*** effects.

Map Remotion → GSAP per `remotion-to-hyperframes`: `useCurrentFrame`/`interpolate`/`spring`/`Easing.bezier` → GSAP `fromTo` tweens with the matching cubic-bezier on the paused timeline. Match the **interpolation window, stagger, easing, and from-state** verbatim. Document fidelity + any approximation in `TRANSLATION_NOTES.md`.

### Real assets, not placeholders
Use real doodles, avatars, app icons, platform logos, message SFX, landing/screenshot images. Real specific data (names, numbers, filenames) everywhere — never lorem/placeholder.

### Geometry gotchas (full list in `pitfalls.md`)
- `clip-path: path()` uses **absolute px** — bubble-tail / morph-shape coords must match the element's actual (scaled) size or they render broken.
- `white-space: pre-wrap` + indented inner spans renders inter-tag newlines as real line breaks (use `nowrap`/`normal` or strip whitespace) — **pitfalls #1**.
- Hidden placeholders must use `display:none`/`position:absolute`, not `visibility:hidden`/`autoAlpha:0`, or they still push siblings — **pitfalls #2**.

## 9. Text effects
Build `compositions/text-effects.js` exposing an `HFText.*` library — each effect a faithful port of a source `Text*` composition (its interpolation curve, stagger, from-state). Apple ease `cubic-bezier(0.16,1,0.3,1)`; per-word/per-char. Mount per scene at the beat-grid offset: `HFText.focusBlurResolve(tl, { root: "#hero", at: 16.0 })`. Use a **distinct effect per scene**. To match source display headlines: `font-size:~132px; font-weight:700; letter-spacing:-0.045em; line-height:1.05`.

**Do not flatten styled inner spans.** A naive `splitLines`/`textContent` rewrite destroys inner `<span class="accent">` runs (kills an accent-colored word). Animate the element as a unit or use a word-splitter that preserves inner runs.

## 10. Debugging layout live (DevTools)
When a CSS/layout bug resists frame-extraction (mysterious height, mis-centering), debug it in the browser instead of blind render loops:
1. `npm run dev` in the background.
2. With the Chrome DevTools MCP, navigate to `http://localhost:<port>/preview/comp/<file>.html`.
3. Seek: `window.__timelines['<id>'].time(<t>)`.
4. Inspect the node: `getBoundingClientRect()`, `getComputedStyle(el).whiteSpace`, `.display`.
This cracked the `pre-wrap` bug instantly after many blind renders. See `pitfalls.md` #5.

## 11. CLI loop
```bash
npm run check                 # lint + validate + inspect — fix all errors
npm run render -- -q high --crf 14   # 4K near-lossless master (writes a TIMESTAMPED mp4)
```
`npm run dev` is a long-running preview server — run it in the background, never foreground (it times out and dies). Promote the timestamped render to a canonical name with explicit filenames; **never `rm` renders with a glob** (see `pitfalls.md` #13).
