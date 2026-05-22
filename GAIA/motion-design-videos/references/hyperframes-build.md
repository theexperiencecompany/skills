# HyperFrames build — mechanics, porting, 4K export

The film is authored in HyperFrames (HTML + GSAP). Invoke the `hyperframes`, `hyperframes-cli`, and `gsap` skills for framework detail; this file is the film-specific layer. For porting from Remotion, invoke `remotion-to-hyperframes`.

## Table of contents
1. Core HyperFrames rules
2. Project structure
3. Root timeline + sub-compositions
4. The 4K export trick
5. Porting components exactly
6. Text effects
7. CLI loop

---

## 1. Core HyperFrames rules
- One **paused** GSAP timeline registered on `window.__timelines["main"]` (the root). Each sub-comp registers its own under its composition id.
- Every timed element needs `class="clip"` + `data-start`, `data-duration`, `data-track-index`. The framework uses `class="clip"` for visibility control — without it the element won't show/hide correctly.
- **Deterministic only** — no `Date.now()`, no `Math.random()`, no network. Everything is seek-driven.
- Videos are `muted` + a separate `<audio>` element for the track.

## 2. Project structure
```
index.html              # root composition (the assembled film)
compositions/*.html     # ported sub-components (composer, chat, terminal, charts, morph)
compositions/text-effects.js  # the ported Text* effect library (HFText.*)
assets/                 # score.mp3, soundfont, doodles, avatars, macOS icons, logos, SFX
meta.json, hyperframes.json, package.json
```
Keep `.bak` copies of superseded `index.html` / score / beatgrid versions for reference.

## 3. Root timeline + sub-compositions
- The **root timeline** carries all kinetic typography (`HFText.*` effects mounted at beat-grid offsets).
- Each ported component mounts as a sub-comp: `data-composition-id="composer" data-composition-src="compositions/composer.html"`. Animate the **outer wrapper** (the thing in the root timeline), never reach into the sub-comp's internals.
- **A composition id hosts a live internal timeline ONLY ONCE per frame.** For a 3-up (three chat panels on screen at once) you MUST use **distinct ids** (`imessage-panel`, `whatsapp-panel`, `telegram-panel`) — not three instances of `imessage`. Reusing one id means only one renders its timeline.
- **Pace each sub-comp's internal timeline to span its clip.** If a sub-comp's timeline is shorter than the time it's on screen, it finishes early and sits frozen. Stretch its internal timing to fill the clip's duration.

## 4. The 4K export trick (there is no `--scale` flag)
Author at 1920×1080, then scale the whole stage 2× to native 3840×2160:
```html
<!-- root element -->
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

## 5. Porting components EXACTLY (never recreate)
If real product UI exists, port it — do not approximate. Approximations look fake and cost iterations. Port from the actual source (e.g. motion-studio Remotion compositions):
- **Composer** (TypingComposer): typing animation, send button that flips accent on send, ring pulse. Keep authentic proportions — do **not** double `min-height` (it looked "too tall").
- **Chat bubbles** (ChatDemo): iMessage (iOS-blue gradient user bubble + gray `#E9E9EB` "them" bubble), WhatsApp, Telegram — each with its **real doodle background**, real bubble tails, ticks, and **real macOS app icons** in the header (not brand glyphs). Use the authentic platform logos and message SFX.
- **Terminal**, **BarChart**, and the **Text\*** effects.
Map Remotion → GSAP per `remotion-to-hyperframes`: `useCurrentFrame`/`interpolate`/`spring`/`Easing.bezier` → GSAP `fromTo` tweens with the matching cubic-bezier on the paused timeline. Match the **interpolation window, stagger, easing, and from-state** verbatim. Document fidelity + any approximation in `TRANSLATION_NOTES.md`.

### Real assets, not placeholders
Use the real doodles, avatars, macOS icons, platform logos, message SFX, landing-page screenshot. Real specific data (names, numbers, filenames) everywhere — never lorem/placeholder.

### Geometry gotchas (see `pitfalls.md` for the full list)
- `clip-path: path()` uses **absolute px** — bubble-tail coords must match the element's actual (scaled) size or tails render broken.
- Container **morphs** animate shared-element geometry (width/height/radius/position), not opacity. A search bar becomes a Safari window by reshaping ONE element while the window body grows around it.

## 6. Text effects
Build `compositions/text-effects.js` exposing an `HFText.*` library — each effect a faithful port of a source `Text*` composition (its interpolation curve, stagger, from-state). Apple ease `cubic-bezier(0.16,1,0.3,1)`; per-word/per-char. Mount per scene at the beat-grid offset: `HFText.focusBlurResolve(tl, { root: "#hero", at: 16.0 })`. Use a **distinct effect per scene**. To match source display headlines: `font-size:~132px; font-weight:700; letter-spacing:-0.045em; line-height:1.05`.

**Do not flatten styled inner spans.** A naive `splitLines`/`textContent` rewrite destroys inner `<span class="accent">` runs (kills an accent-colored word). Either animate the element as a unit or use a word-splitter that preserves inner runs.

## 7. CLI loop
```bash
npm run check    # lint + validate + inspect — fix all errors, review inspect warnings
npm run render   # writes a TIMESTAMPED mp4 — promote to canonical with explicit cp/mv
```
`npm run dev` is a long-running preview server — run it in the background, never foreground (it times out and dies). Never `rm` renders with a glob.
