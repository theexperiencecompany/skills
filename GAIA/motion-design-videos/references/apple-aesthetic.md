# Apple aesthetic — the bar + the exact palette

Evaluate EVERY scene against this. It is the craft auditor's checklist. Restraint is the aesthetic: white space, one idea per frame, physical motion. Light-mode Apple-keynote white is the default.

## Table of contents
1. Principles (the eight)
2. The exact palette
3. Brand accent discipline
4. Typography
5. Layout & centering
6. Motion language
7. Depth & effects
8. Per-scene scorecard

---

## 1. Principles (the eight)
1. **Color** — clean backgrounds only: white / `#F5F5F7` / light gray `#E5E5EA`. No loud or saturated washes. No dark layering for depth in light mode.
2. **Typography** — SF Pro Display (Inter is the accepted alternative). Bold headlines, Regular/Medium body. Tight tracking on display sizes.
3. **Layout & spacing** — intentional, **centered** layouts with generous breathing room (~120px safe margins). Nothing cramped, nothing accidental.
4. **Motion** — **subtle, quick, smooth.** No flashy or dramatic moves. Apple ease `cubic-bezier(0.16,1,0.3,1)` everywhere.
5. **UI components** — rounded-corner panels/cards that **morph between shapes via keyframed geometry, not opacity fades or image scaling.**
6. **Text animation** — position + opacity **per word** (per-char for accent), slide-up / blur reveals. A **distinct effect per scene**, **seamlessly overlapping** (no whole-sentence fades).
7. **Depth/effects** — subtle: glassmorphism (blur + faint white border), gentle bevel, very subtle drop shadows. Premium, never heavy.
8. **Sound** — a real, beat-matched music track + subtle off-beat SFX make it feel alive. Music **fades out** at the end.

## 2. The exact palette (binding color roles)

| Role | HEX | Use |
|---|---|---|
| Page background | `#FFFFFF` (hero type) / `#F5F5F7` (alternating panel beats) | |
| Light Gray | `#E5E5EA` | dividers & cards / light surfaces |
| Mid Gray | `#8E8E93` | muted / placeholders / disabled |
| Dark Gray 2 | `#3A3A3C` | **secondary text** / subtle UI |
| Dark Gray (ink) | `#1C1C1E` | **near-black headlines / primary ink** |
| Apple Blue | `#007AFF` | system primary / links / buttons |
| Apple Green | `#34C759` | success / confirmations (`+38% QoQ`, `ready`, `✓ done`) |
| Apple Orange | `#FF9500` | warnings (if any) |
| Apple Red | `#FF3B30` | errors (if any) |
| Apple Yellow | `#FFCC00` | caution / notifications (if any) |

Light-mode depth = soft shadows, not borders: `box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 40px rgba(0,0,0,.08)` for floating cards. Hairlines `rgba(0,0,0,.08)` only where structural. Radii: inputs 12px, cards 16–20px, hero/composer 24px, pills full.

## 3. Brand accent discipline
- Use the **brand accent sparingly — ≤5 moments total** in the whole film (e.g. the reveal word, a primary button, a hero chart bar, one payoff word, the logo). On a white canvas an accent reads loud.
- **Do NOT introduce a second blue.** If the brand accent is one blue, do not also use Apple system blue `#007AFF` next to it — pick one. Authentic platform colors (iMessage's iOS-blue bubble gradient `linear-gradient(180deg,#309BFE,#027BFF)`) are fine because they're the real component, not a brand accent.
- Switching the brand accent itself should be a **one-token change** — keep it a variable, never hardcode it across scenes.
- Body copy is never accent-colored on white (contrast). Accent only as fills or large display words with enough weight.

## 4. Typography
- One family (Inter) everywhere. Weights: 300 for big elegant lines, 400/500 UI, 600/700/800 punch. Mono = Anonymous Pro / `ui-monospace` for terminals + filenames.
- Tighten display type: `letter-spacing: -0.03em` and tighter at large sizes. Display headlines ~96–132px, `line-height` ~1.05; subtitle ~38px, weight 400.
- No italics, no serif (at most one editorial-serif hero line, and default to sans).

## 5. Layout & centering
- **Optically center via full-canvas flex**, not guessed `top/left` offsets. A flex-centered full-canvas container is robust; absolute pixel offsets drift and read as "accidental."
- Generous breathing room; ~120px safe margins; `inspect` must show no overflow/off-canvas.
- Keep **authentic component proportions** — do not inflate `min-height` to "fill" space (it makes a composer look "too tall"). One idea per frame; ≤7 words per headline.
- **Centering can be sabotaged by hidden bugs, not your layout.** `white-space: pre-wrap` + indented inner spans, or a hidden-but-in-flow placeholder (`visibility:hidden`/`autoAlpha:0`), make a correctly-centered container *look* off-center. Rule those out first (see `pitfalls.md` #1, #2).
- **Readability is layout too:** any panel a viewer must READ (thread, card, stat) reaches full opacity and holds long enough to read (≥~1s). Don't pin payload content at half opacity or flash it (`pitfalls.md` #12).

## 6. Motion language
- Apple ease `cubic-bezier(0.16,1,0.3,1)` is the default for nearly everything.
- **One transform per element**, physical and weighted. No lazy fades — every text change is a *designed* transition (mask/clip reveal, blur-to-focus, per-word stagger, kinetic build, shared-axis swap).
- **Per-word** text animation with a **distinct effect per scene**, and **seamless overlap**: the outgoing line blurs/lifts as the incoming resolves. Never a whole-sentence cross-fade.
- Hard act-cuts on downbeats (0,2,4,…); inner swaps may land on half-beats for energy; hold hero frames a full bar so big moments breathe.
- **Container morphs (geometry), not opacity fades or image scaling.** A search bar that becomes a browser window is the *same element* reshaping (width/height/radius/position) — the growing container *reveals* a STATIC destination image underneath; never cross-dissolve two pictures and never `scale()` the image (it blurs/distorts). See `hyperframes-build.md` §6.
- A click can motivate a cut: a cursor travels to a button, click feedback (scale-down + ring pulse), then the next beat fires — see the cursor-click pattern in `hyperframes-build.md` §7.

## 7. Depth & effects
Subtle glassmorphism, gentle bevel, very subtle drop shadows. Premium, never heavy. No grid/dot backgrounds, no glows/blooms behind logos (a clean lockup on white reads more premium than a glowing one).

## 8. Per-scene scorecard
For each scene give a row: **scene · color ✓/✗ · typography ✓/✗ · spacing+centering ✓/✗ · motion ✓/✗ (subtle/quick/smooth, per-word) · depth ✓/✗ · fix**. Be specific (hex, px, timing). Prioritize P0 (breaks the Apple feel) / P1 / P2.
