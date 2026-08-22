# Agent rules — hisabkar (frontend)

Read this before making any change here, regardless of which AI tool/agent
you are. These rules aren't tied to one assistant — follow them the same way
whether you're Claude Code, Cursor, Copilot, or anything else.

## 1. Match what's already here — don't invent new conventions

Before creating a file or folder, find the closest existing example and copy
its shape. Do not introduce a new pattern because it seems cleaner — this
codebase has one established way to do most things; use it.

- **Pages** live at `src/pages/<PageName>/<PageName>.tsx`, with page-specific
  styles in a sibling `style.module.css` in the same folder (see
  `src/pages/WhatsNew/`, `src/pages/SignIn/`). Folder name and component file
  name match, PascalCase.
- **Components** live at `src/components/<ComponentName>/<ComponentName>.tsx`
  (+ `style.module.css`). Small reusable primitives go under
  `src/components/Atoms/<AtomName>/`.
- **Routes**: add the path to `PROJECT_ROUTES` in
  `src/utils/constant/Constant.ts`, then wire the `<Route>` in
  `src/routes/ProjectRoutes.tsx`, wrapped in `PrivateRoute` (requires login) or
  `PublicRoute` (add `allowedRoutes={[...]}` if it should also be viewable
  while logged in, like `/support` and `/whats-new` — omit it if it should
  bounce a logged-in user back home, like `/legal/:pageType`).
- **API endpoint paths** go in `API_ROUTES` in the same `Constant.ts` — never
  inline a URL string in a component.
- **Redux slices**: `src/store/features/<name>Slice.ts`.
- **Helpers**: `src/utils/helpers/<name>Helper.ts`.
- **Static/reference data** (JSON consumed by the UI): `src/data/<name>.json`.

## 2. Styling — dark/gold theme is the standing default

Read `REDESIGN_PLAN.md` before touching any UI code. In short:

- Use the `--hk-*` custom properties defined in `src/index.css` for color,
  border, surface, and spacing decisions on any redesigned/new page. Don't
  invent new hex values or reuse the legacy Tailwind gray/white palette that
  older pages (e.g. `Legals`) still use — that's pre-redesign, not the target.
- Reuse the shared atom classes already defined in `src/index.css`
  (`.hk-card`, `.hk-pill*`, `.hk-btn-primary`, `.hk-avatar*`, `.hk-money`,
  etc.) instead of re-implementing the same look in a new CSS module.
- Don't stack a CSS-module class on a shadcn primitive (`Button`, `Input`,
  ...) to override its size/spacing — see the "Gotchas" section in
  `REDESIGN_PLAN.md` for why that silently breaks.

## 3. Versioning — do this automatically, don't wait to be asked

This app ships **one version number shared by both repos**
(`hisabkar` and its sibling `hisabkar-server`, expected to be checked out
next to each other on disk). The source of truth for the changelog is
`src/data/versionHistory.json` in _this_ repo, and it's rendered publicly at
`/whats-new` (linked from the sign-in page's version pill).

**Whenever you complete a change that a user would actually notice or care
about** — a new feature, a bug fix, a UI change, an upgrade — bump the
version as part of that same change, automatically:

1. Decide the bump type ([semver](https://semver.org/)):
   - **patch** — bug fix, small styling/UX tweak, no new capability.
   - **minor** — new feature or capability, backward compatible.
   - **major** — breaking change (removes/changes existing behavior in a way
     that could break users or integrations).
2. Bump `version` in **both** `package.json` files to the same new number —
   this one (`hisabkar/package.json`) and the sibling repo's
   `hisabkar-server/package.json` — even if only one side actually changed.
   They must never drift apart.
3. Add a **new entry at the top** of the `versions` array in
   `src/data/versionHistory.json`, matching the existing shape exactly:
   ```json
   {
     "version": "3.5.0",
     "date": "YYYY-MM-DD",
     "type": "minor",
     "era": 3,
     "title": "Short title for this release",
     "changes": [
       { "type": "feature", "text": "What was added, in user-facing terms" },
       { "type": "fix", "text": "What was fixed, in user-facing terms" }
     ]
   }
   ```
   Use the real current date. Reuse the current `era` id unless this change
   is genuinely a new major chapter for the product (only three eras exist
   so far — see the `eras` array in the same file); if it is, add a new era
   entry too.
4. Update the top-level `"currentVersion"` field in the same JSON to match.

**One bump per logical change, not per commit.** If you're mid-way through a
multi-step task in the same session/PR that hasn't shipped yet, fold further
tweaks into the entry you already added instead of creating another one.

**Don't bump for**: pure refactors with no user-visible effect, doc/comment
changes, dev-tooling changes, or edits to this file.

## 4. Keep README.md current — do this automatically too

If a change adds a new user-facing feature, screen, or flow (not a bug fix,
not internal refactor), update `README.md` in the same change:

- New feature → add it to the **Features** list.
- New screen/page → add or update the relevant entry under **Screens
  Overview**.
- New env var required to run the app → add it to the `.env` block under
  **Installation**.
- New major dependency that changes the stack story (e.g. a new state
  library, a new external service) → update **Tech Stack**.

Keep additions short and in the same style as existing entries — don't
restructure the file or rewrite unrelated sections. If nothing in the change
is README-worthy (bug fix, styling tweak, refactor), leave it alone.

## 5. Before finishing any change

Run `npx tsc --noEmit` to type-check (the full `npm run build` currently
fails for an unrelated, pre-existing ESLint config mismatch — see
`REDESIGN_PLAN.md` → Known issues — so don't use it to validate your work).
