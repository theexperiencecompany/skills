---
name: landing-page
description: 1-shot high-quality landing pages and demos in GAIA's design system. Use when building any new marketing or landing page, feature showcase, persona page, or integration page for the GAIA web app.
---

# Landing Page Builder

Build high-converting landing pages that match GAIA's design system exactly. Follow every step in order.

---

## Step 1 — Copy First. No Code Until You Have Copy.

Invoke the `landing-page-copywriter` skill before writing any code. Copy written after the layout exists produces generic pages.

If the audience or purpose isn't clear, ask:
1. Who is this page for?
2. What is the single action this page needs them to take?
3. What pain do they have that GAIA solves specifically for them?
4. Any real numbers, testimonials, or proof points available?

Needed before proceeding:
- Headline (≤10 words, outcome-focused — what they get, not what GAIA is)
- Subheadline (1–2 sentences expanding the headline)
- Problem section copy (emotional, in the audience's exact language)
- 3–6 feature descriptions (benefit-led, not system-capability-led)
- How it works (3–4 steps max)
- Testimonial copy or placeholder structure
- Final CTA with urgency/risk reversal

---

## Step 2 — Audit Before Building

Run these before creating anything new:

```bash
ls apps/web/src/features/landing/components/sections/
ls apps/web/src/features/landing/components/demo/
ls apps/web/src/features/landing/components/
ls apps/web/src/app/(landing)/
```

These always exist — import them, never recreate them:

| Component | Import from | Use for |
|-----------|-------------|---------|
| `LargeHeader` | `@/features/landing/components/LargeHeader` | All section titles |
| `GetStartedButton` | `@/features/landing/components/GetStartedButton` | All primary CTAs |
| `FinalSection` | `@/features/landing/components/sections/FinalSection` | End-of-page CTA (mandatory) |
| `TestimonialsSection` | `@/features/landing/components/sections/TestimonialsSection` | Testimonials |
| `MotionContainer` | `@/features/landing/components/MotionContainer` | Staggered section entrances |
| `SplitTextBlur` | `@/features/landing/components/hero/SplitTextBlur` | Hero headline reveal |
| `DemoSidebar` | `@/features/landing/components/demo/DemoSidebar` | Demo app chrome |
| `DemoChatHeader` | `@/features/landing/components/demo/DemoChatHeader` | Demo app chrome |
| `DemoCalendarView` etc. | `@/features/landing/components/demo/` | Demo content views |

---

## Step 3 — Section Architecture

Use this order. Include what you need, drop what you don't. Order is not optional — it follows the narrative arc.

| # | Section | Rule |
|---|---------|------|
| 1 | Hero | Always. Wallpaper + SplitTextBlur headline + GetStartedButton |
| 2 | Trust strip | Only if you have real numbers (user count, companies, uptime) |
| 3 | Problem/pain | Emotional. Makes the reader feel seen. Not a feature list. |
| 4 | Demo/showcase | Required for product pages. Shows it working. |
| 5 | Features/benefits | What it specifically does for this audience |
| 6 | How it works | 3–4 steps maximum |
| 7 | Testimonials | Use TestimonialsSection |
| 8 | FAQ | Only for complex objections |
| 9 | Final CTA | Always. Use FinalSection. |

---

## Step 4 — Background Selection

All wallpapers at `/public/images/wallpapers/`.

| Wallpaper | Use for |
|-----------|---------|
| `swiss.webp` / `swiss_morning/evening/night.webp` | Hero — time-of-day adaptive preferred |
| `surreal.webp` | Pricing or premium-angle pages |
| `staircase.webp` | Use case or journey pages |
| `library.webp` | Integration or knowledge pages |
| `northernlights.webp` | Tech/futuristic angle |
| `space.webp` | Scale or ambition sections |

---

## Step 5 — Design System

### Colors

```
Page background:    #111111
Primary accent:     #00bbff
Card outer:         bg-zinc-800  or  bg-zinc-800/50
Card inner:         bg-zinc-900
Text primary:       text-white / text-zinc-100
Text muted:         text-zinc-400 / text-zinc-500
Accent bg:          bg-[#00bbff]/10  with  text-[#00bbff]
Status badges:      always /10 opacity bg (e.g. bg-emerald-400/10 text-emerald-400)
```

### Typography

```
Hero headline:      font-serif font-normal  — NEVER font-bold on serif
Hero size:          text-[2.8rem] sm:text-[5rem]  (home page: text-[6.5rem])
Section titles:     text-4xl sm:text-5xl font-serif font-normal
Body/landing:       font-light  — lighter weight reads as premium
Section chips:      text-sm font-medium uppercase tracking-widest text-[#00bbff]
Card headers:       text-sm font-semibold text-zinc-100
Item titles:        text-sm font-medium text-zinc-200
Meta/labels:        text-xs text-zinc-500
```

### Cards — Non-Negotiable Rules

```
Outer container:    rounded-2xl bg-zinc-800 p-4
Inner items:        rounded-2xl bg-zinc-900 p-3
Item spacing:       space-y-2

NEVER add:          border-   ring-   outline-   shadow-   on cards
NEVER mix:          rounded-lg and rounded-2xl at the same nesting level
```

### Animations

```
Easing (always):    ease: [0.32, 0.72, 0, 1]  — never ease-in-out
Spring:             { type: "spring", stiffness: 400, damping: 70, mass: 1 }
Scroll entrance:    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
Stagger delay:      i * 0.08  per item
AnimatePresence:    always mode="wait" when replacing content
                    always stable key props on motion children
                    wrap only the outermost changing element
```

### Layout

```
Max width:          max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6
Section padding:    py-20 sm:py-32  (major)   py-12 sm:py-20  (minor)
Feature grid:       grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
Split layout:       grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
```

---

## Step 6 — Section Code Patterns

### Hero

```tsx
<section className="relative min-h-[85vh] flex flex-col justify-end pb-20 overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <img src="/images/wallpapers/swiss.webp" className="w-full h-full object-cover" />
    <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#111111] to-transparent" />
  </div>
  <div className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 relative z-10">
    <MotionContainer>
      <p className="text-sm font-medium text-[#00bbff] uppercase tracking-widest mb-4">
        [Chip label]
      </p>
      <SplitTextBlur
        text="[Headline from copywriter]"
        className="text-[2.8rem] sm:text-[5rem] font-serif font-normal leading-tight text-white max-w-4xl"
      />
      <p className="mt-6 text-lg font-light text-zinc-300 max-w-2xl leading-relaxed">
        [Subheadline]
      </p>
      <div className="mt-10 flex flex-wrap gap-4 items-center">
        <GetStartedButton />
        <a href="#demo" className="text-sm text-zinc-400 hover:text-white transition-colors">
          See how it works →
        </a>
      </div>
    </MotionContainer>
  </div>
</section>
```

### Feature Card

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
  className="rounded-2xl bg-zinc-800/50 p-6 flex flex-col gap-3"
>
  <div className="w-10 h-10 rounded-xl bg-[#00bbff]/10 flex items-center justify-center">
    {feature.icon}
  </div>
  <h3 className="text-base font-medium text-zinc-100">{feature.title}</h3>
  <p className="text-sm font-light text-zinc-400 leading-relaxed">{feature.description}</p>
</motion.div>
```

### Split Layout (Text + Visual)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
  <MotionContainer>
    <p className="text-sm font-medium text-[#00bbff] uppercase tracking-widest mb-4">[Chip]</p>
    <h2 className="text-4xl sm:text-5xl font-serif font-normal text-white leading-tight">
      [Headline]
    </h2>
    <p className="mt-5 text-base font-light text-zinc-400 leading-relaxed max-w-lg">[Body]</p>
    <ul className="mt-8 space-y-3">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-3 text-sm text-zinc-300">
          <CheckIcon className="w-4 h-4 text-[#00bbff] mt-0.5 shrink-0" />
          {point}
        </li>
      ))}
    </ul>
    <div className="mt-8"><GetStartedButton /></div>
  </MotionContainer>
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    className="rounded-2xl overflow-hidden"
  >
    {/* screenshot, demo component, or illustration */}
  </motion.div>
</div>
```

---

## Step 7 — Demo Sections

For any demo, invoke the `demo-animations` skill.

Every demo must:
1. Show a real user message → GAIA doing work → a meaningful result
2. Use real product components (`DemoCalendarView`, `DemoTodosView`, etc.) with realistic dummy data — never recreate them
3. Follow the phase state machine: `idle → user_sent → thinking → loading → tool_calls → responding → complete`
4. Use timing from `demoConstants.ts`: userMsg 500ms, thinking 900ms, toolCalls 4600ms, loop 14000ms
5. Loop automatically

Demo chrome (makes it look like a real product, not a mockup):

```tsx
<div className="flex rounded-2xl overflow-hidden border border-zinc-700/50 bg-zinc-900">
  <DemoSidebar className="hidden lg:flex w-52 shrink-0" />
  <div className="flex flex-col flex-1 min-w-0">
    <DemoChatHeader />
    <div className="flex-1 p-4">{/* messages and result cards */}</div>
  </div>
</div>
```

Realistic dummy data rules:
- Task names that sound like real work ("Draft investor update email", not "Task 1")
- Tool calls that match GAIA's actual capabilities (Gmail, Calendar, Notion, Linear)
- Bot responses that read like GAIA actually wrote them, not placeholder text

---

## Step 8 — File Organization

```
apps/web/src/app/(landing)/[page-name]/page.tsx          ← server component + metadata
apps/web/src/features/landing/components/[page-name]/    ← page-specific components
```

`page.tsx` always exports metadata:
```tsx
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({
  title: "[Title] — GAIA",
  description: "[SEO description from copy]",
  path: "/[page-name]",
});

export default function PageName() {
  return <main>...</main>;
}
```

Split into a separate component file when a section exceeds ~150 lines or is reusable elsewhere.

---

## Step 9 — Quality Gate

Do not mark done until every item passes.

**Copy**
- [ ] No placeholder text anywhere in the page
- [ ] Headline answers "what will I get?" not "what is this?"
- [ ] Every feature described as an outcome for the user, not a system capability
- [ ] Single primary CTA — GetStartedButton. Secondary actions are links, not buttons.

**Design**
- [ ] Hero has a wallpaper background, not a solid color
- [ ] FinalSection used at the very bottom of every page
- [ ] All section titles use LargeHeader or match its exact pattern
- [ ] Zero `border-` `ring-` `outline-` `shadow-` classes on any card
- [ ] All serif headings are `font-normal`, never `font-bold`
- [ ] Accent `#00bbff` used for chips, icon tint backgrounds, active states

**Animations**
- [ ] Hero uses SplitTextBlur
- [ ] Every section uses scroll-triggered `whileInView` entrance
- [ ] Easing is `[0.32, 0.72, 0, 1]` — not `ease-in-out`, not linear
- [ ] Demo loops automatically with a reset phase
- [ ] AnimatePresence wraps conditional content with `mode="wait"` and stable keys

**Technical**
- [ ] `"use client"` only on components that use browser APIs or hooks
- [ ] No `any` types
- [ ] All imports at the top of every file
- [ ] Mobile layout verified at 375px — hero text readable, no horizontal overflow, CTAs full-width
- [ ] `nx run-many -t lint type-check` passes clean

---

## What Separates Good Pages From Mediocre Ones

**Narrative arc matters more than aesthetics.** The page must tell a story: agitate the pain → introduce hope → prove it works → make acting easy. A list of features is not a story and will not convert.

**Specificity converts. Vagueness doesn't.**
- Bad: "Saves you time"
- Good: "Clears your Monday morning inbox in under 5 minutes"

Use the audience's exact language. Developer pages: "PRs", "deploys", "standups". Sales pages: "pipeline", "follow-ups", "quota".

**The demo is the proof.** If it looks fake, it destroys trust. Real component names, real-sounding tasks, actual tool names. Fake data is worse than no demo.

**Social proof placement.** One strong quote directly under the hero outperforms a full testimonials section at the bottom. Put proof where skepticism lives — near the CTA, not at the end.

**Mobile first.** Test at 375px before anything else. Most visitors are mobile.
