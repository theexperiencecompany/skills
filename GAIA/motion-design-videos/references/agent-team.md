# Agent team

Spin a small team of focused agents. Run them in order; each binds to the previous one's artifact and to the `CREATIVE_BRIEF.md`. A single agent can play multiple roles, but keep the *artifacts* separate — they're the handoff contract and the audit trail.

## Roles & deliverables

| # | Role | Reads | Produces | Job |
|---|---|---|---|---|
| 0 | **Lead / director** | the real feature/PR | `CREATIVE_BRIEF.md`, `BEATGRID.md`, the score | Pins the truth, brand system, palette, component list, length. Owns the north star. Re-grids when length changes. |
| 1 | **Scriptwriter** | brief + beat grid | `SCRIPT.md` | Per-beat sheet keyed to downbeats: copy, text-effect per scene, component, accuracy note. |
| 2 | **Script reviewer** | script + brief | `SCRIPT_REVIEW.md` | Density relief, stranger-comprehension, overclaim audit, accent-hit ledger (≤5). Doesn't churn the grid. |
| 3 | **Component porter** | source components + brief | `compositions/*.html`, `text-effects.js`, `TRANSLATION_NOTES.md` | Faithful ports (geometry/easing/structure), re-themed. Notes any approximation. |
| 4 | **Video builder** | script + ports + grid | `index.html` | Assembles the root timeline + sub-comps; cuts on downbeats; overlaps transitions; 4K stage. |
| 5 | **UX auditor** | the rendered film | `AUDIT_UX.md` | Clarity for a stranger, dead-frame hunt (ffmpeg YMIN), pacing, value-lands. |
| 6 | **Craft auditor** | the rendered film + `apple-aesthetic.md` | `AUDIT_CRAFT.md` / `AUDIT_APPLE_DESIGN.md` / `AUDIT_APPLE_MOTION.md` | Scores every scene vs Apple principles + palette; specific + prioritized. |
| — | **Fixer** (lead) | both audits | `FIXES.md` | Consolidate P0/P1/P2, apply, re-verify frames. |

## Handoff contract (the working files)
- `CREATIVE_BRIEF.md` (lead) · `BEATGRID.md` (lead) · `assets/score.mp3` (lead)
- `SCRIPT.md` (writer) → `SCRIPT_REVIEW.md` (reviewer)
- `compositions/*.html` + `text-effects.js` (porter) · `TRANSLATION_NOTES.md` (porter)
- `index.html` (builder)
- `AUDIT_UX.md` (UX) · `AUDIT_CRAFT.md` / `AUDIT_APPLE_*.md` (craft) → `FIXES.md` (lead)

## Principles for running the team
- **The brief wins.** When agents conflict, the latest brief version is authoritative. Bump the version on every user-feedback round and note what it supersedes.
- **Auditors audit the *render*, not the source.** They extract frames and look. An auditor that only reads HTML misses dead frames and broken tails.
- **Separate UX from craft.** UX = "does a stranger get it." Craft = "does it meet the Apple bar." They catch different defects; running them together blurs both.
- **Fixes get a P0/P1/P2 priority.** P0 is anything that breaks comprehension or the Apple feel — most often a blank frame on a downbeat. Fix the P0 class globally before the P1s.
- **Re-verify after fixing.** A fix is not done until frames are re-extracted and checked. See `pitfalls.md`.
