# hisabkar UI — Theme Reference

> Read this before touching UI code. It documents the **current design
> system** (dark/gold theme, tokens, shared atoms, and gotchas learned along
> the way) — not a page-by-page completion tracker. Ask the user which part
> needs work next; don't infer it from this file.

## Theme

**Dark is the standing default theme everywhere** — not a
`prefers-color-scheme` fallback. Dark ink/navy background with a warm
yellow/gold accent, on mobile and desktop, regardless of the user's OS theme
setting. A light palette exists only as an opt-in `[data-theme="light"]`
override (not wired to any toggle) — never default to it.

**Single top Navbar, no bottom tab bar** — except Group Detail pages
(`/group/:id`), which render their own `GroupDetailHeader` (back button,
group identity, admin menu) instead and use a 5-item bottom nav
(Timeline / Summary / Add / Assistant / Chat) local to that page.
`Navbar`/`PrivateRoutes` both check the route and skip rendering the shared
navbar there.

**Group-type icons** are keyword-matched Lucide icons (`getGroupTypeIcon` in
`src/utils/comman/groupTypeIcon.tsx`), rendered with `currentColor` — not the
real per-type image asset (`tbl_group_types.icon`), which is a fixed-color
image that can't be recolored via CSS. Icon box color reflects balance status
(gold = you owe / no activity, green = you're owed), not category. Unmatched
type names fall back to a `Wallet` icon — add a new regex to
`GROUP_TYPE_ICON_RULES` rather than reintroducing the image approach.

## Design tokens

Defined on `:root` in `src/index.css` — use these, don't invent new values:

```css
:root {
  --hk-bg: #10131c;
  --hk-surface: #1a1f2e;
  --hk-surface-2: #212739;
  --hk-surface-sunken: #0b0e15;
  --hk-border: #2e3549;
  --hk-ink: #f1efea;
  --hk-ink-soft: #aeb4c7;
  --hk-ink-faint: #767d93;
  --hk-accent: #f0ac4c;
  --hk-accent-strong: #f7c271;
  --hk-accent-soft: #3b2c13;
  --hk-on-accent: #241804;
  --hk-positive: #49c285;
  --hk-positive-soft: #123424;
  --hk-negative: #f0806a;
  --hk-negative-soft: #3b1c15;
  --hk-avatar-1: #7c8fb8;
  --hk-avatar-2: #8fbb92;
  --hk-avatar-3: #bb8da0;
  --hk-avatar-4: #cfa06a;
  --hk-avatar-5: #84afc0;
  --hk-shadow: 0, 0, 0;
  --hk-focus: #2f6fed;
  --hk-font-mono: "Cascadia Code", "SF Mono", "Roboto Mono", ui-monospace, Menlo, Consolas, monospace;
}
```

Optional light override (not default, not wired to a toggle):

```css
[data-theme="light"] {
  --hk-bg: #f7f5f1; --hk-surface: #ffffff; --hk-surface-2: #fdfbf7; --hk-surface-sunken: #efeae0;
  --hk-border: #e4dfd3; --hk-ink: #1c2333; --hk-ink-soft: #5b6172; --hk-ink-faint: #8a90a3;
  --hk-accent: #cc8a2a; --hk-accent-strong: #a66e1c; --hk-accent-soft: #f7e4c2; --hk-on-accent: #2b1b02;
  --hk-positive: #22884f; --hk-positive-soft: #dcf0e3; --hk-negative: #c6472e; --hk-negative-soft: #fbe3dc;
  --hk-avatar-1: #4c5b77; --hk-avatar-2: #6b8f6e; --hk-avatar-3: #8a5f73; --hk-avatar-4: #a9743f; --hk-avatar-5: #5c7a8a;
  --hk-shadow: 28, 20, 6;
}
```

## Shared atoms (reuse, don't recreate per component)

Defined once in `src/index.css`:

- `.hk-money` — mono, tabular-nums, for all currency amounts.
- `.hk-card` — surface + border + shadow.
- `.hk-pill` / `.hk-pill-positive` / `.hk-pill-negative` / `.hk-pill-neutral`.
- `.hk-avatar` / `.hk-avatar-stack` — circular avatar with overlap ring; give
  it a `background: var(--hk-avatar-N)` (cycle 1–5) when there's no image.
- `.hk-btn-primary` (gold, filled) / `.hk-btn-secondary` (bordered) — use
  these instead of shadcn `Button` for real actions; see gotcha below.
- `.hk-icon-btn` — 38×38 bordered icon button (used by `Navbar`'s mobile
  menu, etc.). For a *different* fixed size on one specific instance, use an
  inline `style` override, not a second CSS-module class — see gotcha below.
- `.hk-section-label` — small uppercase muted label for section headers.
- `.hk-fab` — raw bottom-right FAB (`bottom: 24px`), unrelated to any bottom
  nav bar since there isn't a global one.

## Gotchas learned the hard way

- **Don't stack a CSS-module class on top of shadcn `Button`/`Input`/etc. to
  override size or spacing.** `cn()`/`tailwind-merge` only dedupes *Tailwind*
  utility classes against each other — it has no idea your CSS-module class
  exists, so both end up in the DOM and whichever stylesheet happens to load
  last wins the cascade. This has caused real bugs (an icon squeezed to
  invisible by a competing `px-4 py-2`). Either drop the shadcn primitive for
  a plain element styled by your own CSS module, or use an inline `style`
  override, which always wins regardless of load order.
- **A modal's inner width should be `%`/`max-width`, never a bare `vw`
  value.** `ModalComponent`'s own box is `90vw` on mobile with its own `15px`
  padding per side — a child sized in `vw` measures against the *full
  viewport*, not that already-narrower, already-padded parent, so it can
  overflow past the modal's own edge (the left side looks fine since it's
  anchored by the parent's padding regardless of the child's width — only the
  right side visibly breaks). Confirmed present in `GroupLogs` and
  `CreateGroup` (`min(440px, 92vw)`) — not yet fixed there.
- **Chart.js (`<canvas>`) can't resolve `var(--hk-*)`.** Canvas drawing APIs
  aren't part of the CSSOM cascade — use literal hex values that match the
  tokens instead (see `ChartComponents/BarChart.tsx`).
- **Nested `overflow:auto` containers with identical bounds drift on
  mobile** (`-webkit-overflow-scrolling: touch` on both) — reads as list
  content jumping/disappearing near the top after a small scroll. Only the
  actual innermost scrolling element should have `overflow:auto`; ancestors
  wrapping it 1:1 should be `overflow:hidden`.
- **A floating/absolutely-positioned close button needs deliberate
  clearance**, not assumed spacing — `ModalComponent`'s close (X) is
  absolutely positioned independent of content flow, so a modal with no
  header of its own needs explicit `padding-right` (horizontal clearance)
  near the top; vertical clearance usually already comes from the modal's
  own base padding, so don't double it with an extra `margin-top` too.

## Known issues

- `npm run build` fails with `Definition for rule
  '@typescript-eslint/no-explicit-any' was not found` — an ESLint 9 / CRA
  eslint-webpack-plugin version mismatch in repo config, unrelated to UI
  work and pre-existing. Use `npx tsc --noEmit` to verify instead of the full
  build.
- **`src/store/features/userSlice.ts`'s `initialState` currently has a
  hardcoded real session (id/name/avatar/token) with a `TEMP (remove before
  shipping)` comment** — added to test on a phone without Google sign-in
  working over LAN. Must be reverted to the empty/logged-out defaults before
  any commit/deploy; don't carry it forward silently.
