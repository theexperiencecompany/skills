---
name: gaia-ui
description: Design language and visual conventions for the GAIA web app (apps/web). Use when building new components, pages, tool call sections, chat bubbles, or any UI element in GAIA. Covers the design philosophy, color system, typography, spacing, icons, animations, and all patterns needed to make anything look native to GAIA.
---

# GAIA Design Language

## Philosophy

**Flat, dark, glassy.** No decorative borders or outlines — depth comes from layering background colors and blur, never strokes. UI feels elevated through contrast and transparency.

**Dark only.** There is no light mode. Everything is designed for dark backgrounds. All components, all pages.

**Zinc neutrals + cyan accent.** The entire neutral palette is the zinc scale. The primary brand color (`#00bbff`) is used sparingly — CTAs, active states, user chat bubbles, primary icons, and badges only.

**Rounded and soft.** Large border radii throughout. Nothing feels sharp or corporate.

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
- `text-white` / `text-zinc-100` — primary content, headings
- `text-zinc-400` — secondary, descriptions, body
- `text-zinc-500` — muted, metadata, timestamps, placeholders

**Status colors** — always use semantic HeroUI color props with `/15` opacity backgrounds:
- Success: `bg-success/15` + `text-emerald-400`
- Warning: `bg-warning/15` + `text-warning-500`
- Danger: `bg-red-500/15` + `text-red-400`
- Info: `text-blue-400`

**Text selection** — custom branded selection color:
```css
::selection { background: #00364b; color: #0bf; }
```

**Toasts** — info toasts use the primary color family:
```css
--info-bg: #00161e; --info-border: #173945; --info-text: #00bbff;
```

---

## Icons

Icons come from **`gaia-icons`** — a project-local wrapper around [HugeIcons](https://hugeicons.com). Always import from `gaia-icons`, not directly from hugeicons.

```tsx
import { Home01Icon, SearchIcon, Alert01Icon } from "gaia-icons"

<Home01Icon className="size-5" />
```

Standard sizes: `size-4` (small/inline), `size-5` (default), `size-6` (prominent). Use `className` for sizing and color, not `width`/`height` props when possible.

---

## Typography

Three fonts, each with a clear role:

- **Inter** (default sans) — all UI, body, buttons, labels, everything functional
- **PP Editorial New** (`font-serif`) — landing page headings, pricing modal titles. Editorial and marketing moments only, never in app UI.
- **Anonymous Pro** (`font-mono`) — code blocks, terminal output, technical content

**Scale in practice:**
- `text-xs` — metadata, chip labels, uppercase section headers
- `text-sm` — most UI text, buttons, secondary content (default for app UI)
- `text-base` — body paragraphs, descriptions
- `text-xl` → `text-3xl` — headings
- Landing hero: `text-[2.8rem] sm:text-[6.5rem] font-normal tracking-tighter`

**Uppercase section labels** — used in settings panels, cards, form sections:
```tsx
<p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Current Plan</p>
```

**Text truncation** — always truncate long strings in constrained containers:
```tsx
<span className="truncate">...</span>          // single line
<p className="line-clamp-2">...</p>            // two lines
<p className="line-clamp-1 max-w-[200px]">...</p>
```

---

## Spacing & Radius

Padding defaults: `p-4` for cards, `p-2`/`p-3` for compact elements, `px-5 py-4` for settings sections. Gaps: `gap-2`, `gap-3` for dense layouts, `gap-6`+ between major sections.

Radii follow a clear progression — rounder = more prominent/elevated:

| Context | Class |
|---------|-------|
| Pills, badges, avatar dots, notification counts | `rounded-full` |
| Buttons, icon containers, inputs, small chips | `rounded-xl` |
| Cards, panels, modals, dropdowns | `rounded-2xl` |
| Premium cards, featured sections, hero elements | `rounded-3xl` |

---

## Depth & Layering

Depth without borders — achieved through:
1. **Background color steps**: `#111111` → `bg-zinc-900/60` → `bg-zinc-800` → `bg-zinc-700`
2. **Transparency + blur**: `bg-zinc-800/40 backdrop-blur-xl` for floating elements
3. **Shadow**: `shadow-md`, `shadow-lg` for cards that need more elevation
4. **Hover**: `hover:bg-white/5` for subtle interactivity on dark surfaces

Never add `border`, `outline`, or `ring` for aesthetics. Only use them for functional focus states on interactive elements.

**Backdrop blur scale:**
- `backdrop-blur-xl` — panels, cards overlaying content
- `backdrop-blur-2xl` — maximum, for search results overlays
- `backdrop-blur-lg` — moderate, for glass cards

---

## Buttons

HeroUI `<Button>` with `rounded-xl` override on className always.

- **Primary CTA** — `variant="solid" color="primary"`, `className="w-full rounded-xl font-medium"`
- **Secondary** — `variant="flat" color="default"`, `className="rounded-xl"`
- **Ghost / navigation** — `variant="light" color="default"`, text `text-zinc-400 hover:text-zinc-300`
- **Destructive** — `variant="flat" color="danger"`
- **Icon-only** — add `isIconOnly`, `size="sm"`

For elevated CTAs (landing pages, upgrade prompts, sidebar promo): use `<RaisedButton color="#00bbff">` from `@/components/ui/raised-button`. It has a built-in shine gradient and dynamic shadow — do not try to replicate this manually.

---

## Cards & Containers

No borders. Elevation through background contrast + optional blur.

```tsx
// Standard card
<div className="rounded-2xl bg-zinc-800 p-4">

// Glass / floating card
<div className="rounded-2xl bg-zinc-800/40 p-4 backdrop-blur-xl">

// Subdued settings section
<div className="rounded-2xl bg-zinc-900/60 px-5 py-4">

// Hoverable list item (no border, just overlay on hover)
<div className="p-4 transition-all hover:bg-white/5">

// Scrollable container with glass background
<div className="max-h-80 overflow-y-auto rounded-2xl bg-zinc-800/70 backdrop-blur-2xl">
```

Dividers between sections inside a card use `<Divider className="bg-zinc-700/50" />` — a HeroUI component, not a border on the container.

---

## Scrollbars

Custom scrollbars are applied globally via globals.css. They are thin (`8px`), transparent track, zinc-700 thumb. Any container with overflow should inherit them automatically.

To hide scrollbars while keeping scroll functionality (e.g. horizontal image strips):
```tsx
<div className="no-scrollbar overflow-x-auto">
```

---

## Animations

Framer Motion via `motion/react` — always `<m.div>`, never `<motion.div>`.

Standard easing: `[0.19, 1, 0.22, 1]` — snappy deceleration, natural feel.

```tsx
// Mount reveal — default for most things
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}

// Staggered list items
transition={{ delay: index * 0.07, duration: 0.15, ease: [0.19, 1, 0.22, 1] }}

// Image / media reveal from blur
initial={{ scale: 0.6, filter: "blur(10px)" }}
animate={{ scale: 1, filter: "blur(0px)" }}
transition={{ duration: 0.15, ease: [0.19, 1, 0.22, 1] }}

// Fade in from below (landing sections)
initial={{ opacity: 0, y: 16 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.4 }}
```

Hover micro-interactions: `transition-all duration-200 hover:scale-105`, `transition-all duration-300 hover:opacity-80`.

**CSS animation utilities** (from globals.css, available as Tailwind classes):
- `animate-scale-in` — scale + fade from 0.9
- `animate-scale-in-blur` — scale from 0.8 + blur removal
- `animate-shimmer` — left-to-right shimmer sweep
- `animate-shine` — repeating gradient shine
- `animate-shake` — horizontal shake for errors

---

## Loading & Skeleton States

Skeleton placeholders use `bg-accent animate-pulse rounded-md` via the `<Skeleton>` component. Match the shape and size of the real content.

```tsx
// Card skeleton
<div className="rounded-3xl bg-zinc-800 p-4">
  <Skeleton className="mb-2 h-8 w-8 rounded-lg" />
  <Skeleton className="mb-2 h-6 w-3/4 rounded-lg" />
  <Skeleton className="h-4 w-full rounded-lg" />
</div>
```

For images, show a skeleton that fades out when the image loads:
```tsx
const [isLoading, setIsLoading] = useState(true)

{isLoading && <Skeleton className="absolute inset-0 rounded-2xl" />}
<Image
  className={`transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
  onLoad={() => setIsLoading(false)}
/>
```

Spinners: use HeroUI `<Spinner />` centered inside a padded container for page/section loading.

End-of-list messages:
```tsx
<p className="py-4 text-center text-xs text-zinc-500">You're all caught up</p>
```

---

## Gradients

Used selectively for visual moments — never for structure.

**Shiny text** (animated shimmer on text, landing page):
```tsx
<span
  className="animate-shine bg-size-[200%_100%] bg-clip-text text-transparent"
  style={{
    backgroundImage: "linear-gradient(90deg, rgb(255 255 255 / 0.3) 20%, rgb(255 255 255) 50%, rgb(255 255 255 / 0.3) 80%)",
  }}
/>
```

**Background radial glow** (hero section):
```css
background: linear-gradient(0deg, #0000 31%, #0bf3 100%);
```

**Landing hero text** (editorial serif heading gradient):
```css
background: linear-gradient(to bottom, #ffffff, #dbdbdb);
```

---

## Landing Page

Different feel from app UI — uses the serif font, larger type, more negative space.

```tsx
// Announcement badge / pill
<div className="flex w-fit cursor-pointer items-center gap-1 rounded-full bg-zinc-400/30 p-1 px-2 text-sm font-light text-white outline-1 outline-zinc-400/40 backdrop-blur-xl transition duration-300 hover:scale-105">
  What's new →
</div>

// Hero heading — PP Editorial New, very large, tracking tight
<h1 className="font-serif text-[2.8rem] leading-none font-normal tracking-tighter sm:text-[6.5rem]">

// Subtitle — Inter, lighter weight
<p className="max-w-(--breakpoint-lg) px-4 text-center text-lg leading-7 tracking-tighter font-light text-zinc-400 sm:text-xl">
```

**Landing navbar** — glassmorphic floating pill:
- `backdrop-filter: blur(16px) saturate(180%)`
- `background: rgba(32, 32, 32, 0.23)`
- Fixed position, `top: 1rem`, `border-radius: 8px`
- On hover: solid `#18181b` background

**Browser/app window mockup frame** (demo sections):
```tsx
// Traffic light buttons
<div className="h-3 w-3 rounded-full bg-zinc-700 transition-colors hover:bg-red-500" />
<div className="h-3 w-3 rounded-full bg-zinc-700 transition-colors hover:bg-yellow-400" />
<div className="h-3 w-3 rounded-full bg-zinc-700 transition-colors hover:bg-green-500" />
```

---

## Chat Bubbles

Styles live in globals.css as `.imessage-bubble`, `.imessage-from-me`, `.imessage-from-them` — apply those class names, never recreate inline.

- User: cyan background (`#00bbff`), black text, right-aligned
- Bot: zinc-800 (`#27272a`), white text, left-aligned
- Grouped messages use `.imessage-grouped-first`, `.imessage-grouped-middle`, `.imessage-grouped-last` to suppress the tail on all but the final bubble
- Emoji-only messages: `text-[4rem] leading-none` (1 emoji), `text-5xl` (2), `text-4xl` (3)
- Typing cursor: `animate-pulse bg-white/60 inline-block h-3.5 w-0.5`

---

## Tool Call Sections

Tool calls appear inside chat, between a bot's thinking and its response. The pattern:

- Compact header row with stacked/overlapping icons: `flex items-center -space-x-2`
- Slight rotation on each icon for visual layering
- Collapsible — trigger text: `text-sm text-zinc-400 hover:text-zinc-200 transition-colors`
- Container: glass card style — `rounded-2xl bg-zinc-800/40 backdrop-blur-xl p-3`
- Status text: `text-xs text-zinc-500`

---

## Status / Alert Cards

Pattern: icon box + title + chip + body text + CTA button.

```tsx
// Colored icon box
<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/15">
  <AlertIcon className="size-5 text-warning-500" />
</div>

// Status chip
<Chip size="sm" variant="flat" color="warning"
  classNames={{ base: "bg-warning/15", content: "text-xs font-semibold" }}>
  Rate Limited
</Chip>

// Checkmark list (benefits, features)
<div className="flex items-start gap-2">
  <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
  <span className="text-xs text-zinc-400">Unlimited messages</span>
</div>
```

Dividers between card sections: `<Divider className="bg-zinc-700/50" />`

---

## Notification / Badge Counts

```tsx
<div className="flex size-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-zinc-950">
  {count > 99 ? "9+" : count}
</div>
```

---

## Progress Bars

```tsx
<div className="flex items-center gap-2">
  <Progress value={75} color="warning" className="flex-1" />
  <span className="shrink-0 text-xs text-zinc-500">750 / 1,000</span>
</div>
```

Colors follow the same status scale: `color="success"` under 60%, `color="warning"` 60–85%, `color="danger"` above 85%.

---

## Pricing / Modal Headers

Modals use serif font for the title — the only place serif appears inside the app UI.

```tsx
<h2 className="font-serif text-4xl font-normal tracking-tight">Level Up</h2>
<p className="text-sm font-light text-zinc-400">Choose the plan that matches your ambition</p>
```

Tab switchers (monthly/yearly) use `<Tabs radius="full">` — fully pill-shaped tabs.

Chips inside tab labels for badges: `<Chip color="primary" size="sm" variant="shadow">Save 25%</Chip>`
