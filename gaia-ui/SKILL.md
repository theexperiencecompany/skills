---
name: gaia-ui
description: Design language and visual conventions for the GAIA web app (apps/web). Use when building new components, pages, tool call sections, chat bubbles, or any UI element in GAIA. Covers the design philosophy, color system, typography, spacing, icons, and patterns needed to make anything look native to GAIA.
---

# GAIA Design Language

## Philosophy

**Flat, dark, and glassy.** No decorative borders or outlines — depth comes from layering background colors and blur. UI feels elevated through contrast and transparency, not strokes.

**Zinc neutrals + cyan accent.** Everything is built from the zinc scale. The primary brand color (`#00bbff`) is used sparingly — CTAs, active states, user chat bubbles, and badges only.

---

## Colors

| Role | Value |
|------|-------|
| Page background | `#111111` (`bg-primary-bg`) |
| Sidebar / panels | `#1a1a1a` (`bg-secondary-bg`) |
| Cards | `bg-zinc-800`, `bg-zinc-900/60` |
| Glass cards | `bg-zinc-800/40` + `backdrop-blur-xl` |
| Hover overlay | `hover:bg-white/5` |
| Primary accent | `#00bbff` (`bg-primary`, `text-primary`) |

**Text hierarchy** — zinc scale only:
- `text-white` / `text-zinc-100` — primary content
- `text-zinc-400` — secondary, descriptions
- `text-zinc-500` — muted, metadata, placeholders

**Status colors** — always use semantic HeroUI color props (`color="success"`, `color="warning"`, `color="danger"`) with `/15` opacity backgrounds:
- Success: `bg-success/15` + `text-emerald-400`
- Warning: `bg-warning/15` + `text-warning-500`
- Danger: `bg-red-500/15` + `text-red-400`

---

## Icons

Icons come from **`gaia-icons`** — a project-local wrapper around [HugeIcons](https://hugeicons.com). Import from `gaia-icons`, not directly from hugeicons.

```tsx
import { Home01Icon, SearchIcon } from "gaia-icons"

<Home01Icon className="size-5" />
```

Standard sizes: `size-4` (small/inline), `size-5` (default), `size-6` (prominent).

---

## Typography

Three fonts, each with a distinct role:

- **Inter** (default sans) — all UI, body, buttons, labels
- **PP Editorial New** (serif, `font-serif`) — landing headings, pricing modal titles. Used for editorial/marketing moments only.
- **Anonymous Pro** (mono, `font-mono`) — code blocks, terminal output

**Scale in practice:**
- `text-xs` — metadata, chip labels, section headers in uppercase
- `text-sm` — most UI text, buttons, secondary content
- `text-base` — body paragraphs
- `text-xl` → `text-3xl` — headings
- Landing hero: `text-[2.8rem] sm:text-[6.5rem] font-normal tracking-tighter`

**Uppercase section labels** (settings, cards):
```tsx
<p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Label</p>
```

---

## Spacing & Radius

Padding defaults: `p-4` for cards, `p-2`/`p-3` for compact elements. Gaps: `gap-2`, `gap-3` for most layouts, `gap-6`+ between sections.

Radii follow a clear progression — rounder = more prominent:

| Context | Class |
|---------|-------|
| Pills, badges, avatar dots | `rounded-full` |
| Buttons, icon containers | `rounded-xl` |
| Cards, panels | `rounded-2xl` |
| Premium / hero cards | `rounded-3xl` |

---

## Buttons

HeroUI `<Button>` with `rounded-xl` override always. No `border` or custom shadow styling.

- **Primary CTA** — `variant="solid" color="primary"`
- **Secondary** — `variant="flat" color="default"`
- **Ghost / nav** — `variant="light"`, text `text-zinc-400 hover:text-zinc-300`
- **Icon-only** — add `isIconOnly`

For elevated CTAs (landing, sidebar promo): use `<RaisedButton color="#00bbff">` from `@/components/ui/raised-button`. It has a built-in shine effect and dynamic shadow.

---

## Cards

No borders. Elevation = background color difference + optional blur.

```tsx
// Standard card
<div className="rounded-2xl bg-zinc-800 p-4">

// Glass card (overlays, popovers)
<div className="rounded-2xl bg-zinc-800/40 p-4 backdrop-blur-xl">

// Settings / subdued section
<div className="rounded-2xl bg-zinc-900/60 px-5 py-4">
```

Hoverable items use `hover:bg-white/5` — never a border on hover.

---

## Animations

Framer Motion via `motion/react` — always use `<m.div>`, never `<motion.div>`.

Standard easing: `[0.19, 1, 0.22, 1]` — snappy out, natural feel.

```tsx
// Mount reveal
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}

// Stagger (list items)
transition={{ delay: index * 0.07, duration: 0.15, ease: [0.19, 1, 0.22, 1] }}

// Media / image reveal
initial={{ scale: 0.6, filter: "blur(10px)" }}
animate={{ scale: 1, filter: "blur(0px)" }}
```

Hover micro-interactions: `transition-all duration-200 hover:scale-105`. Keep durations short — `150ms`–`300ms`.

CSS utility classes defined in `globals.css`: `animate-scale-in`, `animate-scale-in-blur`.

---

## Tool Call Sections

Tool call UI lives inside chat bubbles. Pattern: a compact header row with stacked/overlapping icons showing which tools ran, followed by collapsible content.

- Icon stack: `flex items-center -space-x-2` with slight rotation per item for visual interest
- Container: same glass card pattern — `rounded-2xl bg-zinc-800/40 backdrop-blur-xl p-3`
- Status text: `text-xs text-zinc-500`
- Collapsible trigger: `text-sm text-zinc-400 hover:text-zinc-200 transition-colors`

---

## Chat Bubbles

Styles live in `globals.css` as `.imessage-bubble`, `.imessage-from-me`, `.imessage-from-them` — apply those classes, don't recreate them inline.

- User bubble: cyan (`#00bbff`) background, black text
- Bot bubble: `bg-zinc-800`
- Emoji-only sizing: `text-[4rem]` (1), `text-5xl` (2), `text-4xl` (3)
